
-- Author: Chives-Network
-- Name: ChivesChat
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

-- Owner CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw
-- Admin 4g0crQskU9ikPci3dmrWHHigEn2XCe5bCk_VaSOFa4c
-- Member vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA

-- Send({Target = "chatroom txid", Action = "AddAdmin", AdminId = "admin txid..." }) need owner role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "DelAdmin", AdminId = "admin txid..." }) need owner role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "AddMember", MemberId = "vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA" }) need admin role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "DelMember", MemberId = "vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA" }) need admin role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "ApplyJoin" }) need user role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "ApplyJoin" }) need user role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "ApprovalApply", Applicant = "vn4duuWVuhr88Djustco1ZP_oAMuinJ6OqvazRAnrsA" }) need admin role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "Broadcast", Data = "ChivesChat: Broadcasting My 1st Message" }) need user role to call
-- Send({Target = "CT8fSMyXjN_MQBGe1vFctW7gyGWneYGscP_jgjPi1yw", Action = "Quit" }) need user role to call

Owners = Owners or {}
Admins = Admins or {}
Members = Members or {}

function Welcome()
  return(
      "Welcome to ChivesChat V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Chatroom support three roles: owner, admin, member.\n" ..
      "2. Owner: can add or delete admins, invite members, delete members.\n" ..
      "3. Admin: Approval join application, invite members, delete members.\n" ..
      "4. Member: Apply join chatroom, send messages, and quit chatroom.\n" ..
      "5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.\n\n" ..
      "Have fun, be respectful !")
end

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
            Handlers.utils.reply("Have add admin " .. msg.AdminId)(msg)
        else
            Handlers.utils.reply("Already is admin " .. msg.AdminId)(msg)
        end

        ao.send({
            Target = msg.From,
            Data = "Successfully add admin " .. msg.AdminId
        })

    else
        ao.send({
          Target = msg.From,
          Action = 'AddAdmin-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only owner can add admin ' .. msg.AdminId
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
                Handlers.utils.reply("Have delete admin " .. msg.AdminId)(msg)
                found = true
                break
            end
        end

        if found then
            ao.send({
                Target = msg.From,
                Data = "Successfully delete admin " .. msg.AdminId
            })
        else
            ao.send({
                Target = msg.From,
                Data = "Not a admin " .. msg.AdminId
            })
        end

    else
        ao.send({
          Target = msg.From,
          Action = 'DelAdmin-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only owner can delete admin ' .. msg.AdminId
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
      else
        Handlers.utils.reply("Already joined")(msg)
      end
      ao.send({
        Target = msg.From,
        Data = "Successfully add member " .. msg.MemberId
      })
    else 
      ao.send({
        Target = msg.From,
        Action = 'AddMember-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only admin can add member ' .. msg.MemberId
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
              Handlers.utils.reply("Has remove member ".. msg.MemberId)(msg)
              isMember = true
              break
          end
      end
      ao.send({
        Target = msg.From,
        Data = "Successfully remove member " .. msg.MemberId
      })
    else 
      ao.send({
        Target = msg.From,
        Action = 'DelMember-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only admin can remove member ' .. msg.MemberId
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
        ao.send({Target = admin, Data = 'You have a new application that needs approval.', Sender = msg.From})
        haveSentRecords[admin] = true
      end
    end
    ao.send({Target = msg.From, Data = 'Your application has been submitted and is awaiting administrator approval.', Admin = admin})
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
        else
          Handlers.utils.reply("Already joined")(msg)
        end
        ao.send({
          Target = msg.From,
          Data = "Successfully approval user " .. msg.Applicant
        })
    else 
      ao.send({
        Target = msg.From,
        Action = 'ApprovalApply-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only admin can approval ' .. msg.Applicant
      })
    end
    Handlers.utils.reply("You have approval one application")(msg)
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
            Handlers.utils.reply("Quit")(msg)
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