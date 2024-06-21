
-- Name: MyProcessTxIds
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240612
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/myprocesstxids.lua

-- Function
-- Save user's setting data, every user have his own data.
-- 1. Save user chatroom process tx ids.
-- 2. Save user token process tx ids.
-- 3. Save user lottery process tx ids.
-- 4. Save user guess big or small tx ids.
-- 5. Save user blog process tx ids.
-- 6. Save user swap process tx ids.
-- 7. Save user project process tx ids.

Chatrooms = Chatrooms or {}
Tokens = Tokens or {}
Lotteries = Lotteries or {}
Guesses = Guesses or {}
Blogs = Blogs or {}
Swaps = Swaps or {}
Projects = Projects or {}

function Welcome()
  return(
      "Welcome to MyProcessTxIds V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Save user chatroom process tx ids.\n" ..
      "2. Save user token process tx ids.\n" ..
      "3. Save user lottery process tx ids.\n" ..
      "4. Save user guess big or small tx ids.\n" ..
      "5. Save user blog tx ids.\n" ..
      "6. Save user swap tx ids.\n" ..
      "7. Save user project tx ids.\n" ..
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
      ChatroomSort = msg.ChatroomSort,
      ChatroomGroup = msg.ChatroomGroup,
      ChatroomData = msg.ChatroomData
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
      TokenSort = msg.TokenSort,
      TokenGroup = msg.TokenGroup,
      TokenData = msg.TokenData
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
      LotterySort = msg.LotterySort,
      LotteryGroup = msg.LotteryGroup,
      LotteryData = msg.LotteryData
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
      GuessSort = msg.GuessSort,
      GuessGroup = msg.GuessGroup,
      GuessData = msg.GuessData
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


Handlers.add(
  "GetBlogs",
  Handlers.utils.hasMatchingTag("Action", "GetBlogs"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Blogs[msg.From])
    })
  end
)

Handlers.add(
  "AddBlog",
  Handlers.utils.hasMatchingTag("Action", "AddBlog"),
  function (msg)
    if not Blogs[msg.From] then
      Blogs[msg.From] = {}
    end
    Blogs[msg.From][msg.BlogId] = {
      BlogId = msg.BlogId,
      BlogSort = msg.BlogSort,
      BlogGroup = msg.BlogGroup,
      BlogData = msg.BlogData
    }
    Handlers.utils.reply("Has add Blog")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully add a Blog"
    })
  end
)

Handlers.add(
  "DelBlog",
  Handlers.utils.hasMatchingTag("Action", "DelBlog"),
  function (msg)
    if not Blogs[msg.From] then
      Blogs[msg.From] = {}
    end
    Blogs[msg.From][msg.BlogId] = nil
    Handlers.utils.reply("Has delete Blog")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully delete a Blog"
    })
  end
)


Handlers.add(
  "GetSwaps",
  Handlers.utils.hasMatchingTag("Action", "GetSwaps"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Swaps[msg.From])
    })
  end
)

Handlers.add(
  "AddSwap",
  Handlers.utils.hasMatchingTag("Action", "AddSwap"),
  function (msg)
    if not Swaps[msg.From] then
      Swaps[msg.From] = {}
    end
    Swaps[msg.From][msg.SwapId] = {
      SwapId = msg.SwapId,
      SwapSort = msg.SwapSort,
      SwapGroup = msg.SwapGroup,
      SwapData = msg.SwapData
    }
    Handlers.utils.reply("Has add Swap")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully add a Swap"
    })
  end
)

Handlers.add(
  "DelSwap",
  Handlers.utils.hasMatchingTag("Action", "DelSwap"),
  function (msg)
    if not Swaps[msg.From] then
      Swaps[msg.From] = {}
    end
    Swaps[msg.From][msg.SwapId] = nil
    Handlers.utils.reply("Has delete Swap")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully delete a Swap"
    })
  end
)


Handlers.add(
  "GetProjects",
  Handlers.utils.hasMatchingTag("Action", "GetProjects"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Projects[msg.From])
    })
  end
)

Handlers.add(
  "AddProject",
  Handlers.utils.hasMatchingTag("Action", "AddProject"),
  function (msg)
    if not Projects[msg.From] then
      Projects[msg.From] = {}
    end
    Projects[msg.From][msg.ProjectId] = {
      ProjectId = msg.ProjectId,
      ProjectSort = msg.ProjectSort,
      ProjectGroup = msg.ProjectGroup,
      ProjectData = msg.ProjectData
    }
    Handlers.utils.reply("Has add Project")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully add a Project"
    })
  end
)

Handlers.add(
  "DelProject",
  Handlers.utils.hasMatchingTag("Action", "DelProject"),
  function (msg)
    if not Projects[msg.From] then
      Projects[msg.From] = {}
    end
    Projects[msg.From][msg.ProjectId] = nil
    Handlers.utils.reply("Has delete Project")(msg)
    ao.send({
      Target = msg.From,
      Data = "Successfully delete a Project"
    })
  end
)


return Welcome()