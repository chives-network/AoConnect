
-- Name: ChivesServerData
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240620
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesserverdata.lua

-- Function
-- Save server's data, used for explorer.
-- 1. Save chatroom process tx ids.
-- 2. Save token process tx ids.
-- 3. Save lottery process tx ids.
-- 4. Save guess big or small tx ids.
-- 5. Save blog process tx ids.
-- 6. Save swap process tx ids.
-- 7. Save project process tx ids.
-- 8. Save Faucet process tx ids.

Chatrooms = Chatrooms or {}
Tokens = Tokens or {}
Lotteries = Lotteries or {}
Guesses = Guesses or {}
Blogs = Blogs or {}
Swaps = Swaps or {}
Projects = Projects or {}
Faucets = Faucets or {}

function Welcome()
  return(
      "Welcome to ChivesServerData V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Save chatroom process tx ids.\n" ..
      "2. Save token process tx ids.\n" ..
      "3. Save lottery process tx ids.\n" ..
      "4. Save guess big or small tx ids.\n" ..
      "5. Save blog big or small tx ids.\n" ..
      "6. Save swap big or small tx ids.\n" ..
      "7. Save project big or small tx ids.\n" ..
      "8. Save faucet big or small tx ids.\n" ..
      "Save server's data, used for explorer.\n" ..
      "Have fun, be respectful !")
end

Handlers.add(
  "GetChatrooms",
  Handlers.utils.hasMatchingTag("Action", "GetChatrooms"),
  function (msg)
    ao.send({
        Target = msg.From,
        Data = require('json').encode(Chatrooms)
    })
  end
)

Handlers.add(
  "AddChatroom",
  Handlers.utils.hasMatchingTag("Action", "AddChatroom"),
  function (msg)
        if msg.From == ao.id and msg.ChatroomId and #msg.ChatroomId == 43 then
          Chatrooms[msg.ChatroomId] = {
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
        else 
            ao.send({
                Target = msg.From,
                Action = 'AddChatroom-Error',
                ['Message-Id'] = msg.Id,
                Error = 'Only owner can AddChatroom'
            })
        end
  end
)

Handlers.add(
  "DelChatroom",
  Handlers.utils.hasMatchingTag("Action", "DelChatroom"),
  function (msg)
    if msg.From == ao.id and msg.ChatroomId then
        Chatrooms[msg.ChatroomId] = nil
        Handlers.utils.reply("Has delete chatroom")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully delete a chatroom"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelChatroom-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelChatroom'
        })
    end
  end
)


Handlers.add(
  "GetTokens",
  Handlers.utils.hasMatchingTag("Action", "GetTokens"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Tokens)
    })
  end
)

Handlers.add(
  "AddToken",
  Handlers.utils.hasMatchingTag("Action", "AddToken"),
  function (msg)
    if msg.From == ao.id and msg.TokenId and #msg.TokenId == 43 then
        Tokens[msg.TokenId] = {
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
    else 
        ao.send({
            Target = msg.From,
            Action = 'AddToken-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can AddToken'
        })
    end
  end
)

Handlers.add(
  "DelToken",
  Handlers.utils.hasMatchingTag("Action", "DelToken"),
  function (msg)
    if msg.From == ao.id then
      if Tokens[msg.TokenId] then
        Tokens[msg.TokenId] = nil;
        Handlers.utils.reply("Token deleted")(msg);
        ao.send({
            Target = msg.From,
            Data = "Successfully deleted the Token"
        });
      else
        ao.send({
          Target = msg.From,
          Action = 'DeleteToken-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Token not found'
        });
      end
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelToken-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelToken'
        });
    end
  end
)


Handlers.add(
  "GetLotteries",
  Handlers.utils.hasMatchingTag("Action", "GetLotteries"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Lotteries)
    })
  end
)

Handlers.add(
  "AddLottery",
  Handlers.utils.hasMatchingTag("Action", "AddLottery"),
  function (msg)
    if msg.From == ao.id and msg.LotteryId and #msg.LotteryId == 43 then
        Lotteries[msg.LotteryId] = {
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
    else 
        ao.send({
            Target = msg.From,
            Action = 'AddLottery-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can AddLottery'
        })
    end
  end
)

Handlers.add(
  "DelLottery",
  Handlers.utils.hasMatchingTag("Action", "DelLottery"),
  function (msg)
    if msg.From == ao.id and msg.LotteryId then
        Lotteries[msg.LotteryId] = nil
        Handlers.utils.reply("Has delete Lottery")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully delete a Lottery"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelLottery-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelLottery'
        })
    end
  end
)


Handlers.add(
  "GetGuesses",
  Handlers.utils.hasMatchingTag("Action", "GetGuesses"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Guesses)
    })
  end
)

Handlers.add(
  "AddGuess",
  Handlers.utils.hasMatchingTag("Action", "AddGuess"),
  function (msg)
    if msg.From == ao.id and msg.GuessId and #msg.GuessId == 43 then
        Guesses[msg.GuessId] = {
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
    else 
        ao.send({
            Target = msg.From,
            Action = 'AddGuess-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can AddGuess'
        })
    end
  end
)

Handlers.add(
  "DelGuess",
  Handlers.utils.hasMatchingTag("Action", "DelGuess"),
  function (msg)
    if msg.From == ao.id and msg.GuessId then
        Guesses[msg.GuessId] = nil
        Handlers.utils.reply("Has delete Guess")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully delete a Guess"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelGuess-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelGuess'
        })
    end
  end
)

Handlers.add(
  "GetBlogs",
  Handlers.utils.hasMatchingTag("Action", "GetBlogs"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Blogs)
    })
  end
)

Handlers.add(
  "AddBlog",
  Handlers.utils.hasMatchingTag("Action", "AddBlog"),
  function (msg)
    if msg.From == ao.id and msg.BlogId and #msg.BlogId == 43 then
        Blogs[msg.BlogId] = {
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
    else 
        ao.send({
            Target = msg.From,
            Action = 'AddBlog-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can AddBlog'
        })
    end
  end
)

Handlers.add(
  "DelBlog",
  Handlers.utils.hasMatchingTag("Action", "DelBlog"),
  function (msg)
    if msg.From == ao.id and msg.BlogId then
        Blogs[msg.BlogId] = nil
        Handlers.utils.reply("Has delete Blog")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully delete a Blog"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelBlog-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelBlog'
        })
    end
  end
)

Handlers.add(
  "GetSwaps",
  Handlers.utils.hasMatchingTag("Action", "GetSwaps"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Swaps)
    })
  end
)

Handlers.add(
  "AddSwap",
  Handlers.utils.hasMatchingTag("Action", "AddSwap"),
  function (msg)
    if msg.From == ao.id and msg.SwapId and #msg.SwapId == 43 then
        Swaps[msg.SwapId] = {
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
    else 
        ao.send({
            Target = msg.From,
            Action = 'AddSwap-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can AddSwap'
        })
    end
  end
)

Handlers.add(
  "DelSwap",
  Handlers.utils.hasMatchingTag("Action", "DelSwap"),
  function (msg)
    if msg.From == ao.id and msg.SwapId then
        Swaps[msg.SwapId] = nil
        Handlers.utils.reply("Has delete Swap")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully delete a Swap"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelSwap-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelSwap'
        })
    end
  end
)

Handlers.add(
  "GetProjects",
  Handlers.utils.hasMatchingTag("Action", "GetProjects"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Projects)
    })
  end
)

Handlers.add(
  "AddProject",
  Handlers.utils.hasMatchingTag("Action", "AddProject"),
  function (msg)
    if msg.From == ao.id and msg.ProjectId and #msg.ProjectId == 43 then
        Projects[msg.ProjectId] = {
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
    else 
        ao.send({
            Target = msg.From,
            Action = 'AddProject-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can AddProject'
        })
    end
  end
)

Handlers.add(
  "DelProject",
  Handlers.utils.hasMatchingTag("Action", "DelProject"),
  function (msg)
    if msg.From == ao.id and msg.ProjectId then
        Projects[msg.ProjectId] = nil
        Handlers.utils.reply("Has delete Project")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully delete a Project"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelProject-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelToken'
        })
    end
  end
)

Handlers.add(
  "GetFaucets",
  Handlers.utils.hasMatchingTag("Action", "GetFaucets"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Faucets)
    })
  end
)

Handlers.add(
  "AddFaucet",
  Handlers.utils.hasMatchingTag("Action", "AddFaucet"),
  function (msg)
    if msg.From == ao.id and msg.FaucetId and #msg.FaucetId == 43 then
        Faucets[msg.FaucetId] = {
            FaucetId = msg.FaucetId,
            FaucetSort = msg.FaucetSort,
            FaucetGroup = msg.FaucetGroup,
            FaucetData = msg.FaucetData
          }
          Handlers.utils.reply("Has add Faucet")(msg)
          ao.send({
            Target = msg.From,
            Data = "Successfully add a Faucet"
          })
    else 
        ao.send({
            Target = msg.From,
            Action = 'AddFaucet-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can AddFaucet'
        })
    end
  end
)

Handlers.add(
  "DelFaucet",
  Handlers.utils.hasMatchingTag("Action", "DelFaucet"),
  function (msg)
    if msg.From == ao.id and msg.FaucetId then
        Faucets[msg.FaucetId] = nil
        Handlers.utils.reply("Has delete Faucet")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully delete a Faucet"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'DelFaucet-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only owner can DelToken'
        })
    end
  end
)

return Welcome()