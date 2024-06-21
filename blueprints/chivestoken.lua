-- Name: ChivesToken
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240620
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/token.lua

-- Function
-- 1. Support Token Airdrop.
-- 2. Support Balances Pagination.
-- 3. Support Sent Txs Pagination.
-- 4. Support Received Txs Pagination.

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
      "Welcome to Chives Token V0.2!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Support Token Airdrop.\n" ..
      "2. Support Balances.\n" ..
      "3. Support Sent Txs.\n" ..
      "4. Support Received Txs.\n" ..
      "Have fun, be respectful !")
end


-- token should be idempotent and not change previous state updates
Name = 'AoConnectToken' 
Ticker = Ticker or 'AOCN'
Denomination = Denomination or 12
Balances = Balances or { [ao.id] = utils.toBalanceValue(9999 * 10^Denomination) }
Logo = Logo or 'dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ'
SentTransactions = SentTransactions or {}
ReceivedTransactions = ReceivedTransactions or {}
AllTransactions = AllTransactions or {}
MyAllTransactions = MyAllTransactions or {}

Handlers.add('Info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
  local totalSupply = bint(0)
  local tokenHolders = bint(0)
  for _, balance in pairs(Balances) do
    totalSupply =  utils.add(totalSupply, balance) 
    tokenHolders = utils.add(tokenHolders, 1) 
  end
  ao.send({
    Target = msg.From,
    Name = Name,
    Ticker = Ticker,
    Logo = Logo,
    Denomination = tostring(Denomination),
    TotalSupply = utils.divide(totalSupply, 10^Denomination),
    TokenHolders = tokenHolders,
    Logo = Logo,
    Release = 'ChivesToken',
    Version = '20240620'
  })
end)

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
        circulatingSupply = utils.add(circulatingSupply, balance)
    end

    table.sort(sortedBalances, utils.compare)
    local totalRecords = #sortedBalances

    local filterBalances = {}
    local startIndex = tonumber(msg.Tags.startIndex) or 1
    local endIndex = tonumber(msg.Tags.endIndex) or 1
    if startIndex <= 0 then
      startIndex = 1
    end
    if endIndex <= 0 then
      endIndex = 1
    end
    if startIndex > endIndex then
      startIndex = endIndex
    end
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

Handlers.add('Transfer', Handlers.utils.hasMatchingTag('Action', 'Transfer'), function(msg)
  assert(type(msg.Recipient) == 'string', 'Recipient is required!')
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(0, bint(msg.Quantity)), 'Quantity must be greater than 0')

  if not Balances[msg.From] then Balances[msg.From] = "0" end
  if not Balances[msg.Recipient] then Balances[msg.Recipient] = "0" end

  if bint(msg.Quantity) <= bint(Balances[msg.From]) then
    Balances[msg.From] = utils.subtract(Balances[msg.From], msg.Quantity)
    Balances[msg.Recipient] = utils.add(Balances[msg.Recipient], msg.Quantity)

    table.insert(AllTransactions, { msg.From, msg.Recipient, msg.Quantity, msg.Tags.Ref_ })

    if not SentTransactions[msg.From] then
      SentTransactions[msg.From] = {}
    end
    table.insert(SentTransactions[msg.From], { msg.Recipient, msg.Quantity, msg.Tags.Ref_ })

    if not ReceivedTransactions[msg.Recipient] then
      ReceivedTransactions[msg.Recipient] = {}
    end
    table.insert(ReceivedTransactions[msg.Recipient], { msg.From, msg.Quantity, msg.Tags.Ref_ })

    if not MyAllTransactions[msg.From] then
      MyAllTransactions[msg.From] = {}
    end
    table.insert(MyAllTransactions[msg.From], { msg.Recipient, msg.Quantity, 'Sent', msg.Tags.Ref_ })

    if not MyAllTransactions[msg.Recipient] then
      MyAllTransactions[msg.Recipient] = {}
    end
    table.insert(MyAllTransactions[msg.Recipient], { msg.From, msg.Quantity, 'Received', msg.Tags.Ref_ })
    
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

Handlers.add('MyAllTransactions', 
  Handlers.utils.hasMatchingTag('Action', 'MyAllTransactions'), 
  function(msg) 
    if msg.Tags.Sender and msg.Tags.startIndex and msg.Tags.endIndex then 
      if not MyAllTransactions[msg.Tags.Sender] then
        MyAllTransactions[msg.Tags.Sender] = {}
      end
      local totalRecords = #MyAllTransactions[msg.Tags.Sender]

      local filterMyAllTransactions = {}
      local startIndex = tonumber(msg.Tags.startIndex) or 1
      local endIndex = tonumber(msg.Tags.endIndex) or 1
      if startIndex <= 0 then
        startIndex = 1
      end
      if endIndex <= 0 then
        endIndex = 1
      end
      if startIndex > endIndex then
        startIndex = endIndex
      end
      if endIndex > totalRecords then
        endIndex = totalRecords
      end
      local endFilter = totalRecords - startIndex + 1
      local startFilter = totalRecords - endIndex + 1
      for i = startFilter, endFilter do
          table.insert(filterMyAllTransactions, MyAllTransactions[msg.Tags.Sender][i])
      end

      ao.send({ Target = msg.From, Data = json.encode({filterMyAllTransactions, totalRecords}) }) 
    else 
      ao.send({
        Target = msg.From,
        Action = 'MyAllTransactions-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Must set Sender, startIndex, endIndex'
      })
    end
  end
)

Handlers.add('AllTransactions', 
  Handlers.utils.hasMatchingTag('Action', 'AllTransactions'), 
  function(msg) 
    local totalRecords = #AllTransactions

    local filterAllTransactions = {}
    local startIndex = tonumber(msg.Tags.startIndex) or 1
    local endIndex = tonumber(msg.Tags.endIndex) or 1
    if startIndex <= 0 then
      startIndex = 1
    end
    if endIndex <= 0 then
      endIndex = 1
    end
    if startIndex > endIndex then
      startIndex = endIndex
    end
    if endIndex > totalRecords then
      endIndex = totalRecords
    end
    local endFilter = totalRecords - startIndex + 1
    local startFilter = totalRecords - endIndex + 1
    for i = startFilter, endFilter do
        table.insert(filterAllTransactions, AllTransactions[i])
    end

    ao.send({ Target = msg.From, Data = json.encode({filterAllTransactions, totalRecords}) }) 
    
  end
)

Handlers.add('SentTransactions', 
  Handlers.utils.hasMatchingTag('Action', 'SentTransactions'), 
  function(msg) 
    if msg.Tags.Sender and msg.Tags.startIndex and msg.Tags.endIndex then 
      if not SentTransactions[msg.Tags.Sender] then
        SentTransactions[msg.Tags.Sender] = {}
      end
      local totalRecords = #SentTransactions[msg.Tags.Sender]

      local filterSentTransactions = {}
      local startIndex = tonumber(msg.Tags.startIndex) or 1
      local endIndex = tonumber(msg.Tags.endIndex) or 1
      if startIndex <= 0 then
        startIndex = 1
      end
      if endIndex <= 0 then
        endIndex = 1
      end
      if startIndex > endIndex then
        startIndex = endIndex
      end
      if endIndex > totalRecords then
        endIndex = totalRecords
      end
      local endFilter = totalRecords - startIndex + 1
      local startFilter = totalRecords - endIndex + 1
      for i = startFilter, endFilter do
          table.insert(filterSentTransactions, SentTransactions[msg.Tags.Sender][i])
      end

      ao.send({ Target = msg.From, Data = json.encode({filterSentTransactions, totalRecords}) }) 
    else 
      ao.send({
        Target = msg.From,
        Action = 'SentTransactions-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Must set Sender, startIndex, endIndex'
      })
    end
    
  end
)

Handlers.add('ReceivedTransactions', 
  Handlers.utils.hasMatchingTag('Action', 'ReceivedTransactions'), 
  function(msg) 
    if msg.Tags.Recipient and msg.Tags.startIndex and msg.Tags.endIndex then 
      if not ReceivedTransactions[msg.Tags.Recipient] then
        ReceivedTransactions[msg.Tags.Recipient] = {}
      end
      local totalRecords = #ReceivedTransactions[msg.Tags.Recipient]

      local filterReceivedTransactions = {}
      local startIndex = tonumber(msg.Tags.startIndex) or 1
      local endIndex = tonumber(msg.Tags.endIndex) or 1
      if startIndex <= 0 then
        startIndex = 1
      end
      if endIndex <= 0 then
        endIndex = 1
      end
      if startIndex > endIndex then
        startIndex = endIndex
      end
      if endIndex > totalRecords then
        endIndex = totalRecords
      end
      local endFilter = totalRecords - startIndex + 1
      local startFilter = totalRecords - endIndex + 1
      for i = startFilter, endFilter do
          table.insert(filterReceivedTransactions, ReceivedTransactions[msg.Tags.Recipient][i])
      end

      ao.send({ Target = msg.From, Data = json.encode({filterReceivedTransactions, totalRecords}) }) 
    else 
      ao.send({
        Target = msg.From,
        Action = 'ReceivedTransactions-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only set Recipient or startIndex or endIndex'
      })
    end
    
  end
)

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