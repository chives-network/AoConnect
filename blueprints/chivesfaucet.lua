-- Name: ChivesFaucet
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240729
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesfaucet.lua

-- Function
-- 1. Deposit token to faucet wallet address.
-- 2. Credit token to user from faucet wallet addres.
-- 3. Deposit records
-- 4. Credit records
-- 5. Setting rules

--

local bint = require('.bint')(256)
local ao = require('ao')
local json = require('json')

creditBalances = creditBalances or {}
depositBalances = depositBalances or {}

FAUCET_SEND_AMOUNT = FAUCET_SEND_AMOUNT or  0.123
FAUCET_SEND_RULE = FAUCET_SEND_RULE or  'EveryDay' -- OneTime or EveryDay
FAUCET_TOKEN_ID = FAUCET_TOKEN_ID or "Yot4NNkLcwWly8OfEQ81LCZuN4i4xysZTKJYuuZvM1Q" -- Staking and Received Token Process Tx Id
FAUCET_BALANCE = FAUCET_BALANCE or '-1'

Name = 'AoConnectFaucet' 
Denomination = Denomination or 12
Logo = Logo or 'dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ'

local utils = {
  add = function (a,b) 
    return tostring(bint(a) + bint(b))
  end,
  subtract = function (a,b)
    return tostring(bint(a) - bint(b))
  end,
  multiply = function (a, b)
    return tostring(bint(tonumber(a) * tonumber(b)))
  end,
  divide = function (a, b)
    assert(bint(b) ~= bint(0), "Division by zero")
    return tostring(bint(a) / bint(b))
  end,
  toBalanceValue = function (a)
    return tostring(bint(a))
  end,
  toNumber = function (a)
    return tonumber(a)
  end,
  compare = function (a, b)
    return bint(a[2]) > bint(b[2])
  end
}

function Welcome()
  return(
      "Welcome to ChivesFaucet V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Deposit token to faucet wallet address.\n" ..
      "2. Credit token to user from faucet wallet addres.\n" ..
      "3. Deposit records.\n" ..
      "4. Credit records.\n" ..
      "5. Setting rules.\n" ..
      "Have fun, be respectful !")
end

Handlers.add('Info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
  ao.send({
    Id = FAUCET_TOKEN_ID,
    Name = Name,
    Logo = Logo,
    FaucetTokenId = FAUCET_TOKEN_ID,
    FaucetBalance = FAUCET_BALANCE,
    FaucetRule = FAUCET_SEND_RULE,
    FaucetAmount = FAUCET_SEND_AMOUNT,
    Denomination = tostring(Denomination),
    Release = 'ChivesFaucet',
    Version = '20240729',
  })
end)

-- Monitor received txs action from FAUCET_TOKEN_ID & Update faucet balance automation
Handlers.add(
    "MonitorReceivedTxActions",
    function(msg)
      if msg.Tags.Sender and msg.Tags.Quantity and msg.Tags['Data-Protocol'] == 'ao' and msg.Tags['From-Process'] == FAUCET_TOKEN_ID then
        if msg.Tags.Action == 'Credit-Notice' or msg.Tags.Action == 'ChivesToken-Credit-Notice' then
          return true
        else 
          return true
        end
      else 
        return false
      end
    end,
    function(msg)
      if msg.Tags.Sender and msg.Tags.Quantity and msg.Tags['Data-Protocol'] == 'ao' and msg.Tags['From-Process'] == FAUCET_TOKEN_ID and msg.Tags.Ref_ then
        table.insert(depositBalances, 1, {msg.Tags.Sender, utils.divide(msg.Tags.Quantity, 10^Denomination), msg.Timestamp, msg.Id})
        Send({ Target = FAUCET_TOKEN_ID, Action = "Balance", Tags = { Target = ao.id } })
      end 
    end
)

-- Monitor send out txs action & faucet balance automation
Handlers.add(
    "MonitorSendOutTxActions",
    function(msg)
      if msg.From == FAUCET_TOKEN_ID and msg.Tags.Balance then
          return true
      else
          return false
      end
    end,
    function(msg)
        if msg.Tags.Balance then
          FAUCET_BALANCE = msg.Tags.Balance
        end
    end
)

-- Check faucet balance
Handlers.add('CheckFaucetBalance', Handlers.utils.hasMatchingTag('Action', 'CheckFaucetBalance'), function(msg)
  Send({ Target = FAUCET_TOKEN_ID, Action = "Balance", Tags = { Target = ao.id } })
  if FAUCET_BALANCE == '-1' then
    ao.send({
      Target = msg.From,
      Data = 'Not Deposit'
    })
  else 
    ao.send({
      Target = msg.From,
      Data = utils.divide(FAUCET_BALANCE, 10^Denomination)
    })
  end
end)

-- GetFaucet token one time
Handlers.add('GetFaucet', Handlers.utils.hasMatchingTag('Action', 'GetFaucet'), function(msg)
  Send({ Target = FAUCET_TOKEN_ID, Action = "Balance", Tags = { Target = ao.id } })
  local SendAmount = utils.multiply(FAUCET_SEND_AMOUNT, 10^Denomination)
  ao.send({
    Target = msg.From,
    Data = 'Faucet Balance 1: ' .. FAUCET_BALANCE
  })
  assert(bint.__le(bint(SendAmount), bint(FAUCET_BALANCE)), 'Balance must be greater than faucet amount. SendAmount: ' .. SendAmount .. ', FAUCET_BALANCE:' .. FAUCET_BALANCE)

  Send({ Target = FAUCET_TOKEN_ID, Action = "Transfer", Recipient = msg.From, Quantity = SendAmount, Tags = { Target = ao.id } })
  Send({ Target = FAUCET_TOKEN_ID, Action = "Balance", Tags = { Target = ao.id } })
  
  table.insert(creditBalances, 1, {msg.From, utils.divide(SendAmount, 10^Denomination), msg.Timestamp, msg.Id})

  ao.send({
    Target = msg.From,
    Data = 'You have received ' .. utils.divide(SendAmount, 10^Denomination) .. ' from Faucet, left: ' .. utils.divide(FAUCET_BALANCE, 10^Denomination)
  })

end)

Handlers.add('depositBalances', 
  Handlers.utils.hasMatchingTag('Action', 'depositBalances'), 
  function(msg) 

    local circulatingDeposit = 0
    local sortedDepositBalances = {}
    for id, balance in pairs(depositBalances) do
        table.insert(sortedDepositBalances, {id, balance})
        circulatingDeposit = circulatingDeposit + balance
    end

    table.sort(sortedDepositBalances, utils.compare)
    local totalRecords = #sortedDepositBalances

    local filterDepositBalances = {}
    local startIndex = tonumber(msg.Tags.startIndex)
    local endIndex = tonumber(msg.Tags.endIndex)
    for i = startIndex, endIndex do
        local record = sortedDepositBalances[i]
        if record then
            local id = record[1]
            local balance = record[2]
            filterDepositBalances[id] = balance
        end
    end

    ao.send({ Target = msg.From, Data = json.encode({filterDepositBalances, totalRecords, circulatingDeposit}) }) 
    
  end
)

Handlers.add('depositBalances', 
  Handlers.utils.hasMatchingTag('Action', 'depositBalances'), 
  function(msg) 

    local totalRecords = #depositBalances
    local filterDepositBalances = {}
    local startIndex = tonumber(msg.Tags.startIndex)
    local endIndex = tonumber(msg.Tags.endIndex)
    for i = startIndex, endIndex do
        local record = depositBalances[i]
        if record then
          table.insert(filterDepositBalances, record)
        end
    end

    ao.send({ Target = msg.From, Data = json.encode({filterDepositBalances, totalRecords}) }) 
    
  end
)


Handlers.add('creditBalances', 
  Handlers.utils.hasMatchingTag('Action', 'creditBalances'), 
  function(msg) 

    local totalRecords = #creditBalances
    local filterCreditBalances = {}
    local startIndex = tonumber(msg.Tags.startIndex)
    local endIndex = tonumber(msg.Tags.endIndex)
    for i = startIndex, endIndex do
        local record = creditBalances[i]
        if record then
          table.insert(filterCreditBalances, record)
        end
    end

    ao.send({ Target = msg.From, Data = json.encode({filterCreditBalances, totalRecords}) }) 
    
  end
)

return Welcome()