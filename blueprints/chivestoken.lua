-- Name: ChivesToken
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240615
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/token.lua

-- Function
-- 1. Support Airdrop.
-- 2. Support Balances Pagination.

local bint = require('.bint')(256)
local ao = require('ao')

--[[
  This module implements the ao Standard Token Specification.

  Terms:
    Sender: the wallet or Process that sent the Message

  It will first initialize the internal state, and then attach handlers,
    according to the ao Standard Token Spec API:

    - Info(): return the token parameters, like Name, Ticker, Logo, and Denomination

    - Balance(Target?: string): return the token balance of the Target. If Target is not provided, the Sender
        is assumed to be the Target

    - Balances(): return the token balance of all participants

    - Transfer(Target: string, Quantity: number): if the Sender has a sufficient balance, send the specified Quantity
        to the Target. It will also issue a Credit-Notice to the Target and a Debit-Notice to the Sender

    - Mint(Quantity: number): if the Sender matches the Process Owner, then mint the desired Quantity of tokens, adding
        them the Processes' balance
]]
--
local json = require('json')

--[[
  utils helper functions to remove the bint complexity.
]]
--


local utils = {
  add = function (a,b) 
    return tostring(bint(a) + bint(b))
  end,
  subtract = function (a,b)
    return tostring(bint(a) - bint(b))
  end,
  multiply = function (a, b)
    return tostring(bint(a) * bint(b))
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
    return a[2] > b[2]
  end
}


function Welcome()
  return(
      "Welcome to Chives Token V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Support Airdrop.\n" ..
      "2. Support Balances Pagination.\n" ..
      "Have fun, be respectful !")
end


--[[
     Initialize State

     ao.id is equal to the Process.Id
   ]]
--
Variant = "0.0.3"

-- token should be idempotent and not change previous state updates
Name = 'AoConnectToken' 
Ticker = 'AOCN'
Denomination = 12
Logo = 'dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ'
Balances = Balances or { [ao.id] = utils.toBalanceValue(9999 * 10^Denomination) }

--[[
     Add handlers for each incoming Action defined by the ao Standard Token Specification
   ]]
--

--[[
     Info
   ]]
--
Handlers.add('Info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
  ao.send({
    Target = msg.From,
    Name = Name,
    Ticker = Ticker,
    Logo = Logo,
    Denomination = tostring(Denomination),
    Release = 'ChivesToken',
    Version = '20240615'
  })
end)

--[[
     Balance
   ]]
--
Handlers.add('Balance', Handlers.utils.hasMatchingTag('Action', 'Balance'), function(msg)
  local bal = '0'

  -- If not Recipient is provided, then return the Senders balance
  if (msg.Tags.Recipient and Balances[msg.Tags.Recipient]) then
    bal = Balances[msg.Tags.Recipient]
  elseif msg.Tags.Target and Balances[msg.Tags.Target] then
    bal = Balances[msg.Tags.Target]
  elseif Balances[msg.From] then
    bal = Balances[msg.From]
  end

  ao.send({
    Target = msg.From,
    Balance = bal,
    Ticker = Ticker,
    Account = msg.Tags.Recipient or msg.From,
    Data = bal
  })
end)

--[[
     Balances
   ]]
--

Handlers.add('Balances', 
  Handlers.utils.hasMatchingTag('Action', 'Balances'),
  function(msg) 
    ao.send({ Target = msg.From, Data = json.encode(Balances) }) 
  end
)

Handlers.add('BalancesPage', 
  Handlers.utils.hasMatchingTag('Action', 'BalancesPage'), 
  function(msg) 

    local circulatingSupply = 0
    local sortedBalances = {}
    for id, balance in pairs(Balances) do
        table.insert(sortedBalances, {id, balance})
        circulatingSupply = circulatingSupply + balance
    end

    table.sort(sortedBalances, utils.compare)
    local totalRecords = #sortedBalances

    local filterBalances = {}
    local startIndex = tonumber(msg.Tags.startIndex)
    local endIndex = tonumber(msg.Tags.endIndex)
    for i = startIndex, endIndex do
        local record = sortedBalances[i]
        if record then
            local id = record[1]
            local balance = record[2]
            filterBalances[id] = balance
        end
    end

    ao.send({ Target = msg.From, Data = json.encode({filterBalances, totalRecords, circulatingSupply}) }) 
    
  end
)

--[[
     Transfer
   ]]
--
Handlers.add('Transfer', Handlers.utils.hasMatchingTag('Action', 'Transfer'), function(msg)
  assert(type(msg.Recipient) == 'string', 'Recipient is required!')
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(0, bint(msg.Quantity)), 'Quantity must be greater than 0')

  if not Balances[msg.From] then Balances[msg.From] = "0" end
  if not Balances[msg.Recipient] then Balances[msg.Recipient] = "0" end

  if bint(msg.Quantity) <= bint(Balances[msg.From]) then
    Balances[msg.From] = utils.subtract(Balances[msg.From], msg.Quantity)
    Balances[msg.Recipient] = utils.add(Balances[msg.Recipient], msg.Quantity)

    --[[
         Only send the notifications to the Sender and Recipient
         if the Cast tag is not set on the Transfer message
       ]]
    --
    if not msg.Cast then
      -- Debit-Notice message template, that is sent to the Sender of the transfer
      local debitNotice = {
        Target = msg.From,
        Action = 'ChivesToken-Debit-Notice',
        Recipient = msg.Recipient,
        Quantity = msg.Quantity,
        Data = Colors.gray ..
            "You transferred " ..
            Colors.blue .. utils.divide(msg.Quantity, 10^Denomination) .. Colors.gray .. " to " .. Colors.green .. msg.Recipient .. Colors.reset
      }
      -- Credit-Notice message template, that is sent to the Recipient of the transfer
      local creditNotice = {
        Target = msg.Recipient,
        Action = 'ChivesToken-Credit-Notice',
        Sender = msg.From,
        Quantity = msg.Quantity,
        Data = Colors.gray ..
            "You received " ..
            Colors.blue .. utils.divide(msg.Quantity, 10^Denomination) .. Colors.gray .. " from " .. Colors.green .. msg.From .. Colors.reset
      }

      -- Add forwarded tags to the credit and debit notice messages
      for tagName, tagValue in pairs(msg) do
        -- Tags beginning with "X-" are forwarded
        if string.sub(tagName, 1, 2) == "X-" then
          debitNotice[tagName] = tagValue
          creditNotice[tagName] = tagValue
        end
      end

      -- Send Debit-Notice and Credit-Notice
      ao.send(debitNotice)
      ao.send(creditNotice)
    end
  else
    ao.send({
      Target = msg.From,
      Action = 'ChivesToken-Transfer-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Insufficient Balance!'
    })
  end
end)

Handlers.add('Airdrop', Handlers.utils.hasMatchingTag('Action', 'Airdrop'), function(msg)
  if msg.From == ao.id then
    local recipientListIds = {}
    for recipientId in string.gmatch(msg.Recipient, '([^*]+)') do
      table.insert(recipientListIds, recipientId)
    end
    local quantityListIds = {}
    for quantityId in string.gmatch(msg.Quantity, '([^*]+)') do
      table.insert(quantityListIds, quantityId)
    end
    for index, recipientId in ipairs(recipientListIds) do
      local quantityId = quantityListIds[index]
      assert(#recipientId == 43, 'Recipient length require 43!')
      assert(type(recipientId) == 'string', 'Recipient is required!')
      assert(type(quantityId) == 'string', 'Quantity is required!')
      assert(bint.__lt(0, bint(quantityId)), 'Quantity must be greater than 0')

      if not Balances[msg.From] then Balances[msg.From] = "0" end
      if not Balances[recipientId] then Balances[recipientId] = "0" end

      if bint(quantityId) <= bint(Balances[msg.From]) then
        Balances[msg.From] = utils.subtract(Balances[msg.From], quantityId)
        Balances[recipientId] = utils.add(Balances[recipientId], quantityId)

        --[[
            Only send the notifications to the Sender and Recipient
            if the Cast tag is not set on the Transfer message
          ]]
        --
        if not msg.Cast then
          -- Debit-Notice message template, that is sent to the Sender of the transfer
          local debitNotice = {
            Target = msg.From,
            Action = 'Airdrop-Debit-Notice',
            Recipient = recipientId,
            Quantity = quantityId,
            Data = Colors.gray ..
                "You transferred " ..
                Colors.blue .. utils.divide(quantityId, 10^Denomination) .. Colors.gray .. " to " .. Colors.green .. recipientId .. Colors.reset
          }
          -- Credit-Notice message template, that is sent to the Recipient of the transfer
          local creditNotice = {
            Target = recipientId,
            Action = 'Airdrop-Credit-Notice',
            Sender = msg.From,
            Quantity = quantityId,
            Data = Colors.gray ..
                "You received " ..
                Colors.blue .. utils.divide(quantityId, 10^Denomination) .. Colors.gray .. " from " .. Colors.green .. msg.From .. Colors.reset
          }

          -- Add forwarded tags to the credit and debit notice messages
          for tagName, tagValue in pairs(msg) do
            -- Tags beginning with "X-" are forwarded
            if string.sub(tagName, 1, 2) == "X-" then
              debitNotice[tagName] = tagValue
              creditNotice[tagName] = tagValue
            end
          end

          -- Send Debit-Notice and Credit-Notice
          ao.send(debitNotice)
          ao.send(creditNotice)
        end
      else
        ao.send({
          Target = msg.From,
          Action = 'Airdrop-Transfer-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Insufficient Balance!'
        })
      end
    end
  else 
    ao.send({
      Target = msg.From,
      Action = 'Airdrop-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Only owner can Airdrop'
    })
  end

end)

--[[
    Mint
   ]]
--
Handlers.add('Mint', Handlers.utils.hasMatchingTag('Action', 'Mint'), function(msg)
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint(0) < bint(msg.Quantity), 'Quantity must be greater than zero!')

  if not Balances[ao.id] then Balances[ao.id] = "0" end

  if msg.From == ao.id then
    -- Add tokens to the token pool, according to Quantity
    Balances[msg.From] = utils.add(Balances[msg.From], msg.Quantity) 
    ao.send({
      Target = msg.From,
      Data = Colors.gray .. "Successfully minted " .. Colors.blue .. utils.divide(msg.Quantity, 10^Denomination) .. Colors.reset
    })
  else
    ao.send({
      Target = msg.From,
      Action = 'Mint-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Only the Process Id can mint new ' .. Ticker .. ' tokens!'
    })
  end
end)

--[[
     Total Supply
   ]]
--
Handlers.add('Total-Supply', Handlers.utils.hasMatchingTag('Action', 'Total-Supply'), function(msg)
  assert(msg.From ~= ao.id, 'Cannot call Total-Supply from the same process!')

  local totalSupply = bint(0)
  for _, balance in pairs(Balances) do
    totalSupply =  utils.add(totalSupply, balance) 
  end

  ao.send({
    Target = msg.From,
    Action = 'Total-Supply',
    Data = tostring(totalSupply),
    Ticker = Ticker
  })
end)


return Welcome()