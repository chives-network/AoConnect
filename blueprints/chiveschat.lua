
-- Name: ChivesChat
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240527
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/chiveschat.lua

-- Function
-- 1. Chatroom support three roles: owner, admin, member.
-- 2. Owner: can add or delete admins, invite members, delete members.
-- 3. Admin: Approval join application, invite members, delete members.
-- 4. Member: Apply join chatroom, send messages, and quit chatroom.
-- 5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.
-- 6. Owner can add or delete channels.


-- Three Roles Account
-- Owner CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw
-- Admin 4g0crQskU9ikPci3dmrWHHigEn2XCe5bCk_VaSOFa4c
-- Member vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA

-- Function Call Examples
-- Send({Target = "chatroom txid", Action = "AddAdmin", AdminId = "admin txid..." }) need owner role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "DelAdmin", AdminId = "admin txid..." }) need owner role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "AddMember", MemberId = "vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA" }) need admin role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "DelMember", MemberId = "vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA" }) need admin role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "ApplyJoin" }) need user role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "ApplyJoin" }) need user role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "ApprovalApply", Applicant = "vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA" }) need admin role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "Broadcast", Data = "ChivesChat: Broadcasting My 1st Message" }) need user role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "Quit" }) need user role to call
-- Setting Channels (need owner role to call)
-- Send({Target = "PoaM0gVaHif3PPdVbPd0ptWASXInF-UVEOd4cgFx5uM", Action = "AddChannel", ChannelId = "1", ChannelName = "Announcement", ChannelGroup = "Welcome", ChannelSort = "1", ChannelWritePermission = "Owner" })
-- Send({Target = "PoaM0gVaHif3PPdVbPd0ptWASXInF-UVEOd4cgFx5uM", Action = "AddChannel", ChannelId = "2", ChannelName = "Rules", ChannelGroup = "Welcome", ChannelSort = "2", ChannelWritePermission = "Owner" })
-- Send({Target = "PoaM0gVaHif3PPdVbPd0ptWASXInF-UVEOd4cgFx5uM", Action = "AddChannel", ChannelId = "3", ChannelName = "Introduction", ChannelGroup = "Introduction", ChannelSort = "3" })
-- Send({Target = "PoaM0gVaHif3PPdVbPd0ptWASXInF-UVEOd4cgFx5uM", Action = "AddChannel", ChannelId = "4", ChannelName = "Community", ChannelGroup = "Community", ChannelSort = "4" })
-- Send({Target = "PoaM0gVaHif3PPdVbPd0ptWASXInF-UVEOd4cgFx5uM", Action = "AddChannel", ChannelId = "5", ChannelName = "Support", ChannelGroup = "Community", ChannelSort = "5" })
-- Send({Target = "PoaM0gVaHif3PPdVbPd0ptWASXInF-UVEOd4cgFx5uM", Action = "AddChannel", ChannelId = "6", ChannelName = "Admin Team", ChannelGroup = "Administrators", ChannelSort = "6", ChannelReadPermission = "Owner,Admin" })

Owners = Owners or {}
Admins = Admins or {}
Members = Members or {}
Channels = Channels or {}

function Welcome()
  return(
      "Welcome to ChivesChat V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Chatroom support three roles: owner, admin, member.\n" ..
      "2. Owner: can add or delete admins, invite members, delete members.\n" ..
      "3. Admin: Approval join application, invite members, delete members.\n" ..
      "4. Member: Apply join chatroom, send messages, and quit chatroom.\n" ..
      "5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.\n" ..
      "6. Owner can add or delete channels.\n\n" ..
      "Have fun, be respectful !")
end

Handlers.add(
  "GetInfo",
  Handlers.utils.hasMatchingTag("Action", "GetInfo"),
  function (msg)
    return (Channels)
  end
)

Handlers.add(
  "AddChannel",
  Handlers.utils.hasMatchingTag("Action", "AddChannel"),
  function (msg)
    if msg.From == ao.id then
        Channels[msg.ChannelId] = {
          ChannelId = msg.ChannelId,
          ChannelName = msg.ChannelName,
          ChannelGroup = msg.ChannelGroup,
          ChannelSort = msg.ChannelSort
        }
        Handlers.utils.reply("Has save channel")(msg)
        ao.send({
            Target = msg.From,
            Data = "Successfully add a channel"
        })

    else
        ao.send({
          Target = msg.From,
          Action = 'AddChannel-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only the owner can add a channel'
        })
    end
  end
)

Handlers.add(
  "DelChannel",
  Handlers.utils.hasMatchingTag("Action", "DelChannel"),
  function (msg)
    if msg.From == ao.id then
        if Channels[msg.ChannelId] then
          Channels[msg.ChannelId] = nil
          Handlers.utils.reply("Channel deleted")(msg)
          ao.send({
              Target = msg.From,
              Data = "Successfully deleted the channel"
          })
        else
          ao.send({
            Target = msg.From,
            Action = 'DeleteChannel-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Channel not found'
          })
        end
    else
        ao.send({
          Target = msg.From,
          Action = 'DeleteChannel-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only the owner can delete a channel'
        })
    end
  end
)

Handlers.add(
  "AddAdmin",
  Handlers.utils.hasMatchingTag("Action", "AddAdmin"),
  function (msg)
    if msg.From == ao.id then
        local found = false
        for _, Admin in ipairs(Admins) do
            if Admin == msg.AdminId then
                found = true
                break
            end
        end

        if not found then
            table.insert(Admins, msg.AdminId)
            Handlers.utils.reply("Have add administrator")(msg)
        else
            Handlers.utils.reply("Already is administrator")(msg)
        end

        ao.send({
            Target = msg.From,
            Data = "Successfully add administrator"
        })
        ao.send({
          Target = msg.AdminId,
          Data = "You have been set as an administrator.  Chatroom:" .. ao.id
        })

    else
        ao.send({
          Target = msg.From,
          Action = 'AddAdmin-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only the owner can add an administrator'
        })
    end
  end
)

Handlers.add(
  "DelAdmin",
  Handlers.utils.hasMatchingTag("Action", "DelAdmin"),
  function (msg)
    if msg.From == ao.id then
        local found = false
        for i, v in ipairs(Admins) do
            if v == msg.AdminId then
                table.remove(Admins, i)
                Handlers.utils.reply("Have delete administrator")(msg)
                found = true
                break
            end
        end

        if found then
            ao.send({
                Target = msg.From,
                Data = "Successfully delete administrator"
            })
            ao.send({
              Target = msg.AdminId,
              Data = "You have been removed as an administrator. Chatroom:" .. ao.id
            })
        else
            ao.send({
                Target = msg.From,
                Data = "Not a administrator"
            })
        end

    else
        ao.send({
          Target = msg.From,
          Action = 'DelAdmin-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only the owner can delete an administrator'
        })
    end
  end
)

Handlers.add(
  "AddMember",
  Handlers.utils.hasMatchingTag("Action", "AddMember"),
  function (msg)
    local isAdmin = false
    if msg.From == ao.id then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    
    if isAdmin then
      local isMember = false
      for _, member in ipairs(Members) do
        if member == msg.MemberId then
          isMember = true
          break
        end
      end
      if not isMember then
        table.insert(Members, msg.MemberId)
        Handlers.utils.reply("Joined")(msg)
        ao.send({
          Target = msg.From,
          Data = "Successfully add member"
        })
        ao.send({
          Target = msg.MemberId,
          Data = "You have been invited to join chatroom " .. ao.id
        })
      else
        Handlers.utils.reply("Already joined")(msg)
      end
      
    else 
      ao.send({
        Target = msg.From,
        Action = 'AddMember-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only an administrator can add a member'
      })
    end
  end
)

Handlers.add(
  "DelMember",
  Handlers.utils.hasMatchingTag("Action", "DelMember"),
  function (msg)
    local isAdmin = false
    if msg.From == ao.id then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    
    if isAdmin then
      local isMember = false
      for i, v in ipairs(Members) do
          if v == msg.MemberId then
              table.remove(Members, i)
              Handlers.utils.reply("Member has been removed")(msg)
              isMember = true
              ao.send({
                Target = msg.From,
                Data = "Member successfully removed"
              })
              ao.send({
                Target = msg.MemberId,
                Data = "You have been removed from chatroom " .. ao.id
              })
              break
          end
      end
      
    else 
      ao.send({
        Target = msg.From,
        Action = 'DelMember-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only an administrator can remove a member'
      })
    end
  end
)

Handlers.add(
  "ApplyJoin",
  Handlers.utils.hasMatchingTag("Action", "ApplyJoin"),
  function (msg)
    local haveSentRecords = {}
    for _, admin in ipairs(Admins) do
      if not haveSentRecords[admin] then
        ao.send({Target = admin, Data = 'You have a new application that requires approval', Sender = msg.From})
        haveSentRecords[admin] = true
      end
    end
    ao.send({Target = msg.From, Data = 'Your application has been submitted and is awaiting administrator approval', Admin = admin})
  end
)

Handlers.add(
  "ApprovalApply",
  Handlers.utils.hasMatchingTag("Action", "ApprovalApply"),
  function (msg)
    local isAdmin = false
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    if isAdmin then
        local isMember = false
        for _, member in ipairs(Members) do
          if member == msg.Applicant then
            isMember = true
            break
          end
        end
        if not isMember then
          table.insert(Members, msg.Applicant)
          Handlers.utils.reply("Joined")(msg)
          ao.send({
            Target = msg.From,
            Data = "Successfully approval user " .. msg.Applicant
          })
          ao.send({
            Target = msg.Applicant,
            Data = "Your application has been approved. Chatroom " .. ao.id
          })
        else
          Handlers.utils.reply("Already joined")(msg)
        end
    else 
      ao.send({
        Target = msg.From,
        Action = 'ApprovalApply-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only administrators can approve'
      })
    end
  end
)

Handlers.add(
  "Quit",
  Handlers.utils.hasMatchingTag("Action", "Quit"),
  function (msg)
    local isMember = false
    for i, v in ipairs(Members) do
        if v == msg.From then
            table.remove(Members, i)
            Handlers.utils.reply("You have successfully exited from chatroom " .. ao.id)(msg)
            isMember = true
            break
        end
    end
    if not isMember then
        Handlers.utils.reply("Not a member")(msg)
    end
  end
)

Handlers.add(
  "Broadcast",
  Handlers.utils.hasMatchingTag("Action", "Broadcast"),
  function (msg)
    local isMember = false
    for _, member in ipairs(Members) do
      if member == msg.From then
        isMember = true
        break
      end
    end
    for _, admin in ipairs(Admins) do
      if admin == msg.From then
        isMember = true
        break
      end
    end
    for _, owner in ipairs(Owners) do
      if owner == msg.From then
        isMember = true
        break
      end
    end
    
    if isMember then
      local haveSentRecords = {}
      for _, recipient in ipairs(Members) do
        if not haveSentRecords[recipient] then
          ao.send({Target = recipient, Data = msg.Data, Sender = msg.From})
          haveSentRecords[recipient] = true
        end
      end
      Handlers.utils.reply("Broadcasted")(msg)
      ao.send({
        Target = msg.From,
        ['Message-Id'] = msg.Id,
        Data = 'Successfully Broadcasted ' .. msg.Data
      })
    else
      Handlers.utils.reply("You are not a memeber")(msg)
      ao.send({
        Target = msg.From,
        Action = 'Broadcast-Error',
        ['Message-Id'] = msg.Id,
        Error = 'You are not a memeber ' .. msg.Data
      })
    end
    
  end
)

return Welcome()