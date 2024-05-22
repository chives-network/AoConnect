Members = Members or {}

Handlers.add(
  "register",
  Handlers.utils.hasMatchingTag("Action", "Register"),
  function (msg)
    local found = false
    for _, member in ipairs(Members) do
      if member == msg.From then
        found = true
        break
      end
    end
    
    if not found then
      table.insert(Members, msg.From)
      Handlers.utils.reply("Registered.")(msg)
    else
      Handlers.utils.reply("Already registered.")(msg)
    end
  end
)

Handlers.add(
  "unregister",
  Handlers.utils.hasMatchingTag("Action", "Unregister"),
  function (msg)
    local found = false
    for i, v in ipairs(Members) do
        if v == msg.From then
            table.remove(Members, i)
            Handlers.utils.reply("Unregistered")(msg)
            found = true
            break
        end
    end
    if not found then
        Handlers.utils.reply("Not registered")(msg)
    end
  end
)

Handlers.add(
  "broadcast",
  Handlers.utils.hasMatchingTag("Action", "Broadcast"),
  function (msg)
    local haveSentRecords = {}
    for _, recipient in ipairs(Members) do
      if not haveSentRecords[recipient] then
        ao.send({Target = recipient, Data = msg.Data, Sender: msg.Sender})
        haveSentRecords[recipient] = true
      end
    end
    Handlers.utils.reply("Broadcasted...")(msg)
  end
)

ChivesChat = {}

ChivesChat.InitRoom = "K4kzmPPoxWp0YQqG0UNDeXIhWuhWkMcG0Hx8HYCjmLw"
ChivesChat.LastSend = ChivesChat.LastSend or ChivesChat.InitRoom

ChivesChat.LastReceive = {
    Room = ChivesChat.InitRoom,
    Sender = nil
}

ChivesChat.InitRooms = {   [ChivesChat.InitRoom] = "Chives-Getting-Started",
                        ["UREzA_KXE112ZrcnCcI5tiCUk1zzuKG8dV52EgVa-g8"] = "Chives-Test-Chat"                        
                    }

ChivesChat.Rooms = ChivesChat.Rooms or ChivesChat.InitRooms

ChivesChat.Confirmations = ChivesChat.Confirmations or true

-- Helper function to go from roomName => address
ChivesChat.findRoom =
    function(target)
        for address, name in pairs(ChivesChat.Rooms) do
            if target == name then
                return address
            end
        end
    end

ChivesChat.add =
    function(...)
        local arg = {...}
        ao.send({
            Target = ChivesChat.InitRoom,
            Action = "Register",
            Name = arg[1] or Name,
            Address = arg[2] or ao.id
        })
    end

List =
    function()
        return DevChat.Rooms
    end

Join =
    function(id, ...)
        local arg = {...}
        local addr = ChivesChat.findRoom(id) or id
        local nick = arg[1] or ao.id
        ao.send({ Target = addr, Action = "Register", Nickname = nick or Name })
        return("Registering with room " .. id .. " with nickname " .. nick)
    end

Say =
    function(text, ...)
        local arg = {...}
        local id = arg[1]
        local Sender = arg[2]
        if id ~= nil then
            ChivesChat.LastSend = ChivesChat.findRoom(id) or id
        end
        ao.send({ Target = ChivesChat.LastSend, Action = "Broadcast", Data = text, Sender = Sender })
        return("Chat: " .. text .. " Said: " .. ChivesChat.LastSend)
    end

Tip =
    function(...) -- Recipient, Target, Qty
        local arg = {...}
        local room = arg[2] or ChivesChat.LastReceive.Room
        local roomName = ChivesChat.Rooms[room] or room
        local qty = tostring(arg[3] or 1)
        local recipient = arg[1] or ChivesChat.LastReceive.Sender
        ao.send({
            Action = "Transfer",
            Target = room,
            Recipient = recipient,
            Quantity = qty
        })
        return(Colors.gray .. "Sent tip of " ..
            Colors.green .. qty .. Colors.gray ..
            " to " .. Colors.red .. recipient .. Colors.gray ..
            " in room " .. Colors.blue .. roomName .. Colors.gray ..
            "."
        )
    end

Replay =
    function(...) -- depth, room
        local arg = {...}
        local room = nil
        if arg[1] then
            room = ChivesChat.findRoom(arg[2]) or arg[2]
        else
            room = ChivesChat.LastReceive.Room
        end
        local roomName = ChivesChat.Rooms[room] or room
        local depth = arg[1] or 3

        ao.send({
            Target = room,
            Action = "Replay",
            Depth = tostring(depth)
        })
        return(
            Colors.gray ..
             "Requested replay of the last " ..
            Colors.green .. depth .. 
            Colors.gray .. " messages from " .. Colors.blue ..
            roomName .. Colors.reset .. ".")
    end

Leave =
    function(id)
        local addr = ChivesChat.findRoom(id) or id
        ao.send({ Target = addr, Action = "Unregister" })
        return("Leaving room: " .. addr .. "")
    end

    
if DevChatRegistered == nil then
    DevChatRegistered = true
    Join(ChivesChat.InitRoom)
end

function help()
    return(
        Colors.blue .. "\n\nWelcome to ao ChivesChat v0.1!\n\n" .. Colors.reset ..
        "ChivesChat is a simple service that helps the ao community communicate as we build our new computer.\n" ..
        "The interface is simple. Run...\n\n" ..
        Colors.green .. "\t\t`List()`" .. Colors.reset .. " to see which rooms are available.\n" .. 
        Colors.green .. "\t\t`Join(\"RoomName\")`" .. Colors.reset .. " to join a room.\n" .. 
        Colors.green .. "\t\t`Say(\"Msg\"[, \"RoomName\"])`" .. Colors.reset .. " to post to a room (remembering your last choice for next time).\n" ..
        Colors.green .. "\t\t`Replay([\"Count\"])`" .. Colors.reset .. " to reprint the most recent messages from a chat.\n" ..
        Colors.green .. "\t\t`Leave(\"RoomName\")`" .. Colors.reset .. " at any time to unsubscribe from a chat.\n" ..
        Colors.green .. "\t\t`Tip([\"Recipient\"])`" .. Colors.reset .. " to send a token from the chatroom to the sender of the last message.\n\n" ..
        "You have already been registered to the " .. Colors.blue .. ChivesChat.Rooms[ChivesChat.InitRoom] .. Colors.reset .. ".\n" ..
        "Have fun, be respectful, and remember: Cypherpunks ship code! 🫡")
end

return help()