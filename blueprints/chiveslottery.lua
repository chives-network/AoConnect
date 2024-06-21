-- Name: ChivesLottery
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240620
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/chiveslottery.lua

-- Function
-- 1. periodic lottery.
-- 2. jackpot lottery.

--[[
While from a user perspective, there will be a smooth experience and seem like one contest, there’ll actually be two draws: one for the lottery and one for the jackpot. Both will run simultaneously. Note that wagering puts you in for a chance of winning both, however, there are some key differences between the lottery and the jackpot:

Lottery winners will always be paid out every 20 hours, with 100 prizes, or the total amount of players if less than 100, paid out regularly and the chance of winning depending on the amount of TokenA user wagers.

There’s a 2% chance that the jackpot will be won every 20 hours and a 0.1% chance that the entire Jackpot prize pool is won. If the jackpot is not won, it is rolled over to the next round and the prize pool increases until it is won.

1st: 20% of the lottery prize pool
2nd: 15% of the lottery prize pool
3rd: 10% of the lottery prize pool
4th: 8% of the lottery prize pool
5th: 7% of the lottery prize pool
6th: 6% of the lottery prize pool
7th: 5% of the lottery prize pool
8th: 4% of the lottery prize pool
9th: 3% of the lottery prize pool
10th: 2% of the lottery prize pool
11th to 100th: 0.333% to 0.111% (in increments of 0.00247%) of the lottery prize pool.

抽奖设计原理草稿:
当管理员初始化当前LUA文件,得到一个PROCESSTXID,管理员就对当前程序拥有有管理权限
当其它用户存入一定量的TokenA的时候,可以根据时间区间,当前程序ID,TokenA的ID, 得到所有用户存入TokenA的明细记录
当时间截止,使用当前LUA的算法进行抽奖计算结果,并且把计算结果进行保存以供查询.
当有了抽奖结果以后,使用这个结果给所有中奖的用户进行发送对应的TokenA, 使用ChivesToken lua可以一次性发送多个地址和金额,这样可以一次性操作来完成整个结算过程．
注意:
1 这个发送过程,目前还需要管理员来操作,无法完全链上执行,因为发送金额需要签名授权来完成,这个需要依赖用户的私钥.
2 时间截止触发机制,需要使用到一个定时任务来实现,而这个定时任务,需要使用到客户端来实现,初期可以搞一个Electron的客户端来实现.

抽奖程序逻辑和步骤
1 抽奖RrocessTxId: 这个是主要是初始化当前LUA文件得来的,相当于某一个抽奖的ID
2 抽奖所需要存入的TOKEN的ProcessTxId: 比如前抽奖需要用户存入的是哪一个TOKEN, 比如TokenA
3 存入: 当前用户向[抽奖RrocessTxId]存入一定数量的TokenA, 当完成转账的时候,[抽奖RrocessTxId]会收到一个消息,告诉系统收到了哪个地址的多少金额的TokenA, 然后捕捉到这个事件, 把相关信息写入到[抽奖RrocessTxId]的数据里面
4 计算: 使用一定的算法来计算获奖名单
5 支出: 根据用户存入的不同金额,然后使用相关的算法,得到最终需要转账的地址和金额的名单, 然后使用Send函数在lua内进行调用结算功能, 目前发现不敢是谁调用都可以,调用者本身不会损失任何金额. 这个结果过程是从[抽奖RrocessTxId]在TokenA中的余额,发送给不同的用户. 是否支持其它用户来调用,目前需要更多的测试.
6 已经完成本期的抽奖记录转入历史记录,用于保存和查看, 查看时支持分页显示.

抽奖概念说明
1 每一个小时或24个小时为一个周期
2 每个周期内所有可以使用的金额, 分为三部分, 1%做为手续费, 余下的部分分为两部分,30%和70%, 30%做为头奖, 70%做为周期性抽奖. 
3 头奖: 中奖概率为0.2%, 如果有人中头奖, 会则拿走整个池子里面所有的金额, 如果没有人中头奖, 则会累各进入下一轮.
4 周期性抽奖: 每次会抽出100个人, 按照名次进行分配不同的金额,说见分配表prizeRatios.如果参与人员不足100人, 则按名次发送中奖金额, 余下部分则进入下一轮.
2 链上自动结算,无需人工干预(有待于最终确认)

Lottery Design Principle Draft:
When the administrator initializes the current LUA file and obtains a PROCESSTXID, the administrator gains management rights over the current program.
When other users deposit a certain amount of TokenA, detailed records of all users depositing TokenA can be obtained based on the time interval, current program ID, and TokenA ID.
When the time expires, the lottery calculation result is generated using the current LUA algorithm, and the result is saved for future queries.
After obtaining the lottery result, this result is used to send the corresponding TokenA to all winning users. Using the ChivesToken Lua, multiple addresses and amounts can be sent at once, thus completing the entire settlement process in one operation.
Note:
1. The current sending process still requires administrator intervention and cannot be fully executed on-chain because sending the amount requires signature authorization, which depends on the user's private key.
2. The time expiration triggering mechanism requires the implementation of a scheduled task, which needs to be done using a client. Initially, an Electron client can be developed for this purpose.

]]
--

local bint = require('.bint')(256)
local ao = require('ao')
local json = require('json')

depositBalance = depositBalance or {}
periodicLottery = periodicLottery or {}
jackpotLottery = jackpotLottery or {}
rateLottery = 0.01 -- 1% will send to rateLotteryAddress as the service fee
rateLotteryAddress = rateLotteryAddress or "30ntYN_xlw3dijw9cp02APFP0oOtLFSFDORgxs_ur1U" -- Project Running Address
periodicLotteryNumber = 100

LOTTERY_PROCESS = LOTTERY_PROCESS or "NTNTSp5xdaL3BiqgwAnWK7QZ4ces-xVEK6IOHQUkQIE" -- Staking and Received Token Process Tx Id
LOTTERY_BALANCE = '-1'


Balances = Balances or {}
Name = Name or 'AoConnectLottery' 
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
      "Welcome to Chives ChivesLottery V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Support ChivesLottery.\n" ..
      "Have fun, be respectful !")
end

Handlers.add('Info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
  ao.send({
    Target = msg.From,
    Name = Name,
    Logo = Logo,
    Denomination = tostring(Denomination),
    Release = 'ChivesLottery',
    Version = '20240620',
    periodicLotteryNumber,
    rateLottery,
  })
end)


local prizeRatios = {
    0.20, 0.15, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02,
    0.00333, 0.0033053, 0.0032806, 0.0032559, 0.0032312, 0.0032065,
    0.0031818, 0.0031571, 0.0031324, 0.0031077, 0.003083, 0.0030583,
    0.0030336, 0.0030089, 0.0029842, 0.0029595, 0.0029348, 0.0029101,
    0.0028854, 0.0028607, 0.002836, 0.0028113, 0.0027866, 0.0027619,
    0.0027372, 0.0027125, 0.0026878, 0.0026631, 0.0026384, 0.0026137,
    0.002589, 0.0025643, 0.0025396, 0.0025149, 0.0024902, 0.0024655,
    0.0024408, 0.0024161, 0.0023914, 0.0023667, 0.002342, 0.0023173,
    0.0022926, 0.0022679, 0.0022432, 0.0022185, 0.0021938, 0.0021691,
    0.0021444, 0.0021197, 0.002095, 0.0020703, 0.0020456, 0.0020209,
    0.0019962, 0.0019715, 0.0019468, 0.0019221, 0.0018974, 0.0018727,
    0.001848, 0.0018233, 0.0017986, 0.0017739, 0.0017492, 0.0017245,
    0.0016998, 0.0016751, 0.0016504, 0.0016257, 0.001601, 0.0015763,
    0.0015516, 0.0015269, 0.0015022, 0.0014775, 0.0014528, 0.0014281,
    0.0014034, 0.0013787, 0.001354, 0.0013293, 0.0013046, 0.0012799,
    0.0012552, 0.0012305, 0.0012058, 0.0011811, 0.0011564, 0.0011317
}

-- Monitor received txs action from LOTTERY_PROCESS & Update lottery balance automation
Handlers.add(
    "MonitorReceivedTxActions",
    function(msg)
      if msg.Tags.Sender and msg.Tags.Quantity and msg.Tags['Data-Protocol'] == 'ao' and msg.Tags['From-Process'] == LOTTERY_PROCESS then
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
      if msg.Tags.Sender and msg.Tags.Quantity and msg.Tags['Data-Protocol'] == 'ao' and msg.Tags['From-Process'] == LOTTERY_PROCESS and msg.Tags.Ref_ then
        depositBalance[msg.Tags.Ref_] = {msg.Tags.Sender, msg.Tags.Quantity, msg.Tags['From-Process'], msg.Tags.Action, msg.Tags.Ref_}
      end 
    end
)

-- Monitor send out txs action & lottery balance automation
Handlers.add(
    "MonitorSendOutTxActions",
    function(msg)
      if msg.From == LOTTERY_PROCESS and msg.Tags.Balance then
          return true
      else
          return false
      end
    end,
    function(msg)
        if msg.Tags.Balance then
          LOTTERY_BALANCE = msg.Tags.Balance
        end
    end
)

-- Update lottery balance trigger
Handlers.add('UpdateBalance', Handlers.utils.hasMatchingTag('Action', 'UpdateBalance'), function(msg)
  Send({ Target = LOTTERY_PROCESS, Action = "Balance", Tags = { Target = ao.id } })
  ao.send({
    Target = msg.From,
    Data = 'Update ' .. ao.id .. ' Balance in ' .. LOTTERY_PROCESS
  })
end)

-- Check lottery balance
Handlers.add('CheckBalance', Handlers.utils.hasMatchingTag('Action', 'CheckBalance'), function(msg)
  Send({ Target = LOTTERY_PROCESS, Action = "Balance", Tags = { Target = ao.id } })
  if LOTTERY_BALANCE == '-1' then
    ao.send({
      Target = msg.From,
      Data = '-1'
    })
  else 
    ao.send({
      Target = msg.From,
      Data = 'Lottery Balance: ' .. utils.divide(LOTTERY_BALANCE, 10^Denomination)
    })
  end
end)

-- Credit token one time
Handlers.add('Credit', Handlers.utils.hasMatchingTag('Action', 'Credit'), function(msg)
  assert(type(msg.Recipient) == 'string', 'Recipient is required!')
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(0, bint(msg.Quantity)), 'Quantity must be greater than 0')
  ao.send({
    Target = msg.From,
    Data = 'Lottery Balance1 ' .. utils.divide(LOTTERY_BALANCE, 10^Denomination)
  })
  assert(bint.__le(bint(msg.Quantity), LOTTERY_BALANCE), 'Balance must be greater than quantity')

  Send({ Target = LOTTERY_PROCESS, Action = "Transfer", Recipient = msg.Recipient, Quantity = msg.Quantity, Tags = { Target = ao.id } })
  Send({ Target = LOTTERY_PROCESS, Action = "Balance", Tags = { Target = ao.id } })

  ao.send({
    Target = msg.From,
    Data = 'Lottery Balance2: ' .. utils.divide(LOTTERY_BALANCE, 10^Denomination) .. ' From ' .. msg.From
  })
  
end)

Handlers.add('ExecLotteryResult', Handlers.utils.hasMatchingTag('Action', 'ExecLotteryResult'), function(msg)
    
    if msg.From == ao.id then
        local recipientListIds = {}
        for recipientId in string.gmatch(msg.Recipient, '([^*]+)') do
            table.insert(recipientListIds, recipientId)
        end

        local quantityListIds = {}
        for quantityId in string.gmatch(msg.Quantity, '([^*]+)') do
            table.insert(quantityListIds, toNumber(quantityId))
        end

        local totalAmount = 0
        for index, recipientId in ipairs(recipientListIds) do
            local quantityId = quantityListIds[index]
            totalAmount = utils.add(totalAmount, toNumber(quantityId))
        end

        -- Begin Lottery Calculate
        math.randomseed(os.time())
        local winners = {}
        local numAddresses = math.min(#addresses, 100)
        for i = 1, numAddresses do
            local index = math.random(#addresses)
            table.insert(winners, addresses[index])
            table.remove(addresses, index)
        end

        local results = {}
        for i, winner in ipairs(winners) do
            local prizeAmount = utils.multiply(totalAmount, prizeRatios[i])
            table.insert(results, {
                address = winner,
                rank = i,
                ratio = prizeRatios[i],
                amount = prizeAmount
            })
        end
        -- End Lottery Calculate
        ao.send({
          Target = msg.From,
          Data = "Successfully Exec Lottery Result"
        })
    else
        ao.send({
          Target = msg.From,
          Action = 'ExecLotteryResult-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only the Process Id can Exec Lottery Result !'
        })
    end
  
end)


Handlers.add('depositBalance', Handlers.utils.hasMatchingTag('Action', 'depositBalance'), function(msg)
  local bal = '0'
  if (msg.Tags.Recipient and depositBalances[msg.Tags.Recipient]) then
    bal = depositBalances[msg.Tags.Recipient]
  elseif msg.Tags.Target and depositBalances[msg.Tags.Target] then
    bal = depositBalances[msg.Tags.Target]
  elseif depositBalances[msg.From] then
    bal = depositBalances[msg.From]
  end

  ao.send({
    Target = msg.From,
    Balance = bal,
    Account = msg.Tags.Recipient or msg.Tags.Target or msg.From,
    Data = bal
  })

end)

Handlers.add('depositBalancesPage', 
  Handlers.utils.hasMatchingTag('Action', 'depositBalancesPage'), 
  function(msg) 

    local circulatingDeposit = 0
    local sorteddepositBalances = {}
    for id, balance in pairs(depositBalances) do
        table.insert(sorteddepositBalances, {id, balance})
        circulatingDeposit = circulatingDeposit + balance
    end

    table.sort(sorteddepositBalances, utils.compare)
    local totalRecords = #sorteddepositBalances

    local filterdepositBalances = {}
    local startIndex = tonumber(msg.Tags.startIndex)
    local endIndex = tonumber(msg.Tags.endIndex)
    for i = startIndex, endIndex do
        local record = sorteddepositBalances[i]
        if record then
            local id = record[1]
            local balance = record[2]
            filterdepositBalances[id] = balance
        end
    end

    ao.send({ Target = msg.From, Data = json.encode({filterdepositBalances, totalRecords, circulatingDeposit}) }) 
    
  end
)


return Welcome()