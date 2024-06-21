-- Name: ChivesFaucet
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240620
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesfaucet.lua

-- Function
-- 1. Deposit token to faucet.
-- 2. Credit token to user from faucet process tx id.
-- 3. Deposit records
-- 4. Credit records
-- 5. Setting rules

--

local bint = require('.bint')(256)
local ao = require('ao')
local json = require('json')

depositBalances = depositBalances or {}
creditBalances = creditBalances or {}
receivedBalances = receivedBalances or {}

FAUCET_SEND_AMOUNT = FAUCET_SEND_AMOUNT or  0.123
FAUCET_SEND_RULE = FAUCET_SEND_RULE or  'EveryDay' -- OneTime or EveryDay
FAUCET_PROCESS = FAUCET_PROCESS or "jsH3PcxiuEEVyiT3fgk648sO5kQ2ZuNNAZx5zOCJsz0" -- Staking and Received Token Process Tx Id
FAUCET_BALANCE = FAUCET_BALANCE or '-1'

Name = Name or 'AoConnectFaucet' 
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
      "1. Deposit token to faucet.\n" ..
      "2. Credit token to user from faucet process tx id.\n" ..
      "3. Deposit records.\n" ..
      "4. Credit records.\n" ..
      "5. Setting rules.\n" ..
      "Have fun, be respectful !")
end

Handlers.add('Info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
  ao.send({
    Id = FAUCET_PROCESS,
    Balance = FAUCET_BALANCE,
    Name = Name,
    Logo = Logo,
    Denomination = tostring(Denomination),
    Release = 'ChivesFaucet',
    Version = '20240620',
  })
end)

-- Monitor received txs action from FAUCET_PROCESS & Update faucet balance automation
Handlers.add(
    "MonitorReceivedTxActions",
    function(msg)
      if msg.Tags.Sender and msg.Tags.Quantity and msg.Tags['Data-Protocol'] == 'ao' and msg.Tags['From-Process'] == FAUCET_PROCESS then
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
      if msg.Tags.Sender and msg.Tags.Quantity and msg.Tags['Data-Protocol'] == 'ao' and msg.Tags['From-Process'] == FAUCET_PROCESS and msg.Tags.Ref_ then
        depositBalances[msg.Tags.Ref_] = {msg.Tags.Sender, msg.Tags.Quantity, msg.Tags['From-Process'], msg.Tags.Action, msg.Tags.Ref_}
        Send({ Target = FAUCET_PROCESS, Action = "Balance", Tags = { Target = ao.id } })
      end 
    end
)

-- Monitor send out txs action & faucet balance automation
Handlers.add(
    "MonitorSendOutTxActions",
    function(msg)
      if msg.From == FAUCET_PROCESS and msg.Tags.Balance then
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
Handlers.add('CheckBalance', Handlers.utils.hasMatchingTag('Action', 'CheckBalance'), function(msg)
  Send({ Target = FAUCET_PROCESS, Action = "Balance", Tags = { Target = ao.id } })
  if FAUCET_BALANCE == '-1' then
    ao.send({
      Target = msg.From,
      Data = '-1'
    })
  else 
    ao.send({
      Target = msg.From,
      Data = 'Faucet Balance: ' .. utils.divide(FAUCET_BALANCE, 10^Denomination)
    })
  end
end)

-- Credit token one time
Handlers.add('Credit', Handlers.utils.hasMatchingTag('Action', 'Credit'), function(msg)
  Send({ Target = FAUCET_PROCESS, Action = "Balance", Tags = { Target = ao.id } })
  local SendAmount = utils.multiply(FAUCET_SEND_AMOUNT, 10^Denomination)
  assert(type(msg.Recipient) == 'string', 'Recipient is required!')
  ao.send({
    Target = msg.From,
    Data = 'Faucet Balance 1: ' .. FAUCET_BALANCE
  })
  assert(bint.__le(bint(SendAmount), bint(FAUCET_BALANCE)), 'Balance must be greater than faucet amount')

  Send({ Target = FAUCET_PROCESS, Action = "Transfer", Recipient = msg.Recipient, Quantity = SendAmount, Tags = { Target = ao.id } })
  Send({ Target = FAUCET_PROCESS, Action = "Balance", Tags = { Target = ao.id } })

  ao.send({
    Target = msg.From,
    Data = 'Faucet Balance 2: ' .. FAUCET_BALANCE .. ' From ' .. msg.From .. ' SendAmount: ' .. SendAmount
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

Handlers.add('creditBalances', 
  Handlers.utils.hasMatchingTag('Action', 'creditBalances'), 
  function(msg) 

    local circulatingDredit = 0
    local sortedCreditBalances = {}
    for id, balance in pairs(creditBalances) do
        table.insert(sortedCreditBalances, {id, balance})
        circulatingDredit = circulatingDredit + balance
    end

    table.sort(sortedCreditBalances, utils.compare)
    local totalRecords = #sortedCreditBalances

    local filterCreditBalances = {}
    local startIndex = tonumber(msg.Tags.startIndex)
    local endIndex = tonumber(msg.Tags.endIndex)
    for i = startIndex, endIndex do
        local record = sortedCreditBalances[i]
        if record then
            local id = record[1]
            local balance = record[2]
            filterCreditBalances[id] = balance
        end
    end

    ao.send({ Target = msg.From, Data = json.encode({filterCreditBalances, totalRecords, circulatingDredit}) }) 
    
  end
)

return Welcome()