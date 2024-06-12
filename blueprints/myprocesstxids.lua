
-- Name: MyProcessTxIds
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240612
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/myprocesstxids.lua

-- Function
-- 1. Save user chatroom process tx ids.
-- 2. Save user token process tx ids.
-- 3. Save user lottery process tx ids.
-- 4. Save user guess big or small tx ids.

Chatrooms = Chatrooms or {}
Tokens = Tokens or {}
Lotteries = Lotteries or {}
Guesses = Guesses or {}

function Welcome()
  return(
      "Welcome to MyProcessTxIds V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Save user chatroom process tx ids.\n" ..
      "2. Save user token process tx ids.\n" ..
      "3. Save user lottery process tx ids.\n" ..
      "4. Save user guess big or small tx ids.\n" ..
      "Have fun, be respectful !")
end

Handlers.add(
  "GetChatrooms",
  Handlers.utils.hasMatchingTag("Action", "GetChatrooms"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Chatrooms[msg.From])
    })
  end
)

Handlers.add(
  "AddChatroom",
  Handlers.utils.hasMatchingTag("Action", "AddChatroom"),
  function (msg)
    if not Chatrooms[msg.From] then
      Chatrooms[msg.From] = {}
    end
    Chatrooms[msg.From][msg.ChatroomId] = {
      ChatroomId = msg.ChatroomId,
      ChatroomSort = msg.ChatroomSort
    }
    Handlers.utils.reply("Has add chatroom")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully add a chatroom"
    })
  end
)

Handlers.add(
  "DelChatroom",
  Handlers.utils.hasMatchingTag("Action", "DelChatroom"),
  function (msg)
    if not Chatrooms[msg.From] then
      Chatrooms[msg.From] = {}
    end
    Chatrooms[msg.From][msg.ChatroomId] = nil
    Handlers.utils.reply("Has delete chatroom")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully delete a chatroom"
    })
  end
)


Handlers.add(
  "GetTokens",
  Handlers.utils.hasMatchingTag("Action", "GetTokens"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Tokens[msg.From])
    })
  end
)

Handlers.add(
  "AddToken",
  Handlers.utils.hasMatchingTag("Action", "AddToken"),
  function (msg)
    if not Tokens[msg.From] then
      Tokens[msg.From] = {}
    end
    Tokens[msg.From][msg.TokenId] = {
      TokenId = msg.TokenId,
      TokenSort = msg.TokenSort
    }
    Handlers.utils.reply("Has add Token")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully add a Token"
    })
  end
)

Handlers.add(
  "DelToken",
  Handlers.utils.hasMatchingTag("Action", "DelToken"),
  function (msg)
    if not Tokens[msg.From] then
      Tokens[msg.From] = {}
    end
    Tokens[msg.From][msg.TokenId] = nil
    Handlers.utils.reply("Has delete Token")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully delete a Token"
    })
  end
)


Handlers.add(
  "GetLotteries",
  Handlers.utils.hasMatchingTag("Action", "GetLotteries"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Lotteries[msg.From])
    })
  end
)

Handlers.add(
  "AddLottery",
  Handlers.utils.hasMatchingTag("Action", "AddLottery"),
  function (msg)
    if not Lotteries[msg.From] then
      Lotteries[msg.From] = {}
    end
    Lotteries[msg.From][msg.LotteryId] = {
      LotteryId = msg.LotteryId,
      Lotteriesort = msg.Lotteriesort
    }
    Handlers.utils.reply("Has add Lottery")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully add a Lottery"
    })
  end
)

Handlers.add(
  "DelLottery",
  Handlers.utils.hasMatchingTag("Action", "DelLottery"),
  function (msg)
    if not Lotteries[msg.From] then
      Lotteries[msg.From] = {}
    end
    Lotteries[msg.From][msg.LotteryId] = nil
    Handlers.utils.reply("Has delete Lottery")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully delete a Lottery"
    })
  end
)


Handlers.add(
  "GetGuesses",
  Handlers.utils.hasMatchingTag("Action", "GetGuesses"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Guesses[msg.From])
    })
  end
)

Handlers.add(
  "AddGuess",
  Handlers.utils.hasMatchingTag("Action", "AddGuess"),
  function (msg)
    if not Guesses[msg.From] then
      Guesses[msg.From] = {}
    end
    Guesses[msg.From][msg.GuessId] = {
      GuessId = msg.GuessId,
      Guessesort = msg.Guessesort
    }
    Handlers.utils.reply("Has add Guess")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully add a Guess"
    })
  end
)

Handlers.add(
  "DelGuess",
  Handlers.utils.hasMatchingTag("Action", "DelGuess"),
  function (msg)
    if not Guesses[msg.From] then
      Guesses[msg.From] = {}
    end
    Guesses[msg.From][msg.GuessId] = nil
    Handlers.utils.reply("Has delete Guess")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully delete a Guess"
    })
  end
)

return Welcome()