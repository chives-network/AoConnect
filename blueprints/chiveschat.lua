
-- Name: ChivesChat
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240715
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/chiveschat.lua

-- Function
-- 1. Chatroom support three roles: owner, admin, member.
-- 2. Owner: Can add or delete admins, add or delete channels, invite members (requiring user agreement), adding members, and deleting members.
-- 3. Admin: Approval for joining the application, inviting members (requiring user agreement), adding members, and deleting members.
-- 4. Member: Apply to join the chatroom, get approval from the admin, then send messages, and finally leave the chatroom.
-- 5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.
-- 6. Anyone can get channel information.
-- 7. Only members can get information on all members.
-- 8. This version of the message is public, not encrypted.

Owner = Owner or "OwnerWalletAddress"
Admins = Admins or {}
Members = Members or {}
Invites = Invites or {}
Applicants = Applicants or {}
Channels = Channels or {}
Info = Info or {}
ChatRecords = ChatRecords or {}
BlockMembers = BlockMembers or {}

function Welcome()
  return(
      "Welcome to ChivesChat V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Chatroom support three roles: owner, admin, member.\n" ..
      "2. Owner: Can add or delete admins, add or delete channels, invite members (requiring user agreement), adding members, and deleting members.\n" ..
      "3. Admin: Approval for joining the application, inviting members (requiring user agreement), adding members, and deleting members.\n" ..
      "4. Member: Apply to join the chatroom, get approval from the admin, then send messages, and finally leave the chatroom.\n" ..
      "5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.\n" ..
      "6. Anyone can get channel information.\n" ..
      "7. Only members can get information on all members.\n" ..
      "8. This version of the message is public, not encrypted.\n\n" ..
      "Have fun, be respectful !")
end

Handlers.add('Info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)

  Info['Statics'] = {}
  Info['Statics']['Owner'] = #Owner
  Info['Statics']['Admins'] = #Admins
  Info['Statics']['Members'] = #Members
  Info['Statics']['Invites'] = #Invites
  Info['Statics']['Applicants'] = #Applicants
  Info['Statics']['Channels'] = #Channels
  ao.send({
    Target = msg.From,
    Data = require('json').encode(Info)
  })

end)


Handlers.add('SetInfo', Handlers.utils.hasMatchingTag('Action', 'SetInfo'), function(msg)

  local isAdmin = false
  if msg.From == Owner then
    isAdmin = true
  end
  for _, Admin in ipairs(Admins) do
      if Admin == msg.From then
          isAdmin = true
          break
      end
  end
  
  if isAdmin and msg.Name and msg.Logo and #msg.Logo == 43 then
    Info['Id'] = ao.id
    Info['Name'] = msg.Name
    Info['Logo'] = msg.Logo
    Info['Release'] = 'ChivesChatroom'
    Info['Version'] = '20240715'
    Info['Summary'] = msg.Summary
    Info['Group'] = msg.Group
    ao.send({
      Target = msg.From,
      Data = "Successfully set chatroom info"
    })
  else 
    ao.send({
      Target = msg.From,
      Action = 'SetInfo-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Only the admin can set chatroom info'
    })
  end
  
end)

Handlers.add(
  "GetChatRecords",
  Handlers.utils.hasMatchingTag("Action", "GetChatRecords"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    if Members[msg.From] or isAdmin then
      if msg.Tags.ChannelId and #msg.Tags.ChannelId == 43 and Channels[msg.Tags.ChannelId] then
        if ChatRecords[msg.ChannelId] == nil then
          ChatRecords[msg.ChannelId] = {}
        end
        
        local totalRecords = #ChatRecords[msg.Tags.ChannelId]
        local startIndex = tonumber(msg.Tags.startIndex)
        local endIndex = tonumber(msg.Tags.endIndex)
        
        if startIndex <= 0 or startIndex > totalRecords or endIndex < startIndex then
            ao.send({
              Target = msg.From,
              Data = require('json').encode({{}, totalRecords})
            })
        else 
          if endIndex > totalRecords then
            endIndex = totalRecords
          end
          local records = {}
          for i = startIndex, endIndex do
              table.insert(records, ChatRecords[msg.Tags.ChannelId][i])
          end
          ao.send({
            Target = msg.From,
            Data = require('json').encode({records, totalRecords})
          })
        end
      else 
        ao.send({
          Target = msg.From,
          Action = 'SendMessage-Error',
          ['Message-Id'] = msg.Id,
          Error = 'ChannelId not exist ' .. msg.Tags.ChannelId
        })
      end
    else 
      ao.send({
        Target = msg.From,
        Action = 'SendMessage-Error',
        ['Message-Id'] = msg.Id,
        Error = 'You are not a memeber ' .. msg.Data
      })
    end
  end
)

Handlers.add(
  "SendMessage",
  Handlers.utils.hasMatchingTag("Action", "SendMessage"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    if Members[msg.From] or isAdmin then
      if msg.ChannelId and #msg.ChannelId == 43 and Channels[msg.ChannelId] then
        if ChatRecords[msg.ChannelId] == nil then
          ChatRecords[msg.ChannelId] = {}
        end
        local message = {
          Id = msg.Id,
          From = msg.From,
          ChannelId = msg.ChannelId,
          Content = msg.Data,
          Encrypted = msg.Encrypted,
          Timestamp = msg.Timestamp,
          OSTime = tostring(os.time()),
          Attach = {}
        }
        table.insert(ChatRecords[msg.ChannelId], 1, message)
        ao.send({
          Target = msg.From,
          Data = require('json').encode({Data = 'Successful Send Message', Status = 'OK'})
        })
      else 
        ao.send({
          Target = msg.From,
          Action = 'SendMessage-Error',
          ['Message-Id'] = msg.Id,
          Error = 'ChannelId not exist ' .. msg.ChannelId
        })
      end
    else 
      ao.send({
        Target = msg.From,
        Action = 'SendMessage-Error',
        ['Message-Id'] = msg.Id,
        Error = 'You are not a memeber ' .. msg.Data
      })
    end
  end
)

Handlers.add(
  "GetChannels",
  Handlers.utils.hasMatchingTag("Action", "GetChannels"),
  function (msg)
    ao.send({
      Target = msg.From,
      Data = require('json').encode(Channels)
    })
  end
)

Handlers.add(
  "GetMembers",
  Handlers.utils.hasMatchingTag("Action", "GetMembers"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    if isAdmin then
      ao.send({
        Target = msg.From,
        Data = require('json').encode({Admins, Members, Applicants})
      })
    elseif Members[msg.From] then
      ao.send({
        Target = msg.From,
        Data = require('json').encode({Admins, Members})
      })
    else 
      ao.send({
        Target = msg.From,
        Data = "You need to join the chatroom first"
      })
    end
  end
)

Handlers.add(
  "GetApplicants",
  Handlers.utils.hasMatchingTag("Action", "GetApplicants"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    
    if isAdmin then
      ao.send({
        Target = msg.From,
        Data = require('json').encode(Applicants)
      })
    else 
      ao.send({
        Target = msg.From,
        Data = "You are not a administrator"
      })
    end
  end
)

Handlers.add(
  "IsMember",
  Handlers.utils.hasMatchingTag("Action", "IsMember"),
  function (msg)
    local isOwner = false
    if msg.From == Owner then
      isOwner = true
    end
    local isAdmin = false
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    local isMember = false
    if Members[msg.From] then
      isMember = true
    end
    local isApplicant = false
    if Applicants[msg.From] then
      isApplicant = true
    end
    local isInvite = false
    if Invites[msg.From] then
      isInvite = true
    end
    ao.send({
      Target = msg.From,
      Data = require('json').encode({isOwner, isAdmin, isMember, isApplicant, isInvite})
    })
  end
)

Handlers.add(
  "AddChannel",
  Handlers.utils.hasMatchingTag("Action", "AddChannel"),
  function (msg)
    if msg.From == Owner and msg.ChannelId and #msg.ChannelId == 43 then
        Channels[msg.ChannelId] = {
          ChannelId = msg.ChannelId,
          ChannelName = msg.ChannelName,
          ChannelGroup = msg.ChannelGroup,
          ChannelSort = msg.ChannelSort,
          ChannelIntro = msg.ChannelIntro
        }
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
  "EditChannel",
  Handlers.utils.hasMatchingTag("Action", "EditChannel"),
  function (msg)
    if msg.From == Owner and msg.ChannelId and #msg.ChannelId == 43 then
        Channels[msg.ChannelId] = {
          ChannelId = msg.ChannelId,
          ChannelName = msg.ChannelName,
          ChannelGroup = msg.ChannelGroup,
          ChannelSort = msg.ChannelSort,
          ChannelIntro = msg.ChannelIntro
        }
        ao.send({
            Target = msg.From,
            Data = "Successfully edit a channel"
        })

    else
        ao.send({
          Target = msg.From,
          Action = 'EditChannel-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Only the owner can edit a channel'
        })
    end
  end
)

Handlers.add(
  "DelChannel",
  Handlers.utils.hasMatchingTag("Action", "DelChannel"),
  function (msg)
    if msg.From == Owner and msg.ChannelId and #msg.ChannelId == 43 then
        if Channels[msg.ChannelId] then
          Channels[msg.ChannelId] = nil
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
    if msg.From == Owner and msg.AdminId and #msg.AdminId == 43 then
        local found = false
        for _, Admin in ipairs(Admins) do
            if Admin == msg.AdminId then
                found = true
                break
            end
        end

        if not found then
            table.insert(Admins, msg.AdminId)
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
    if msg.From == Owner and msg.AdminId and #msg.AdminId == 43 then
        local found = false
        for i, v in ipairs(Admins) do
            if v == msg.AdminId then
                table.remove(Admins, i)
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
  "AddInvite",
  Handlers.utils.hasMatchingTag("Action", "AddInvite"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    
    if isAdmin then
      if not Invites[msg.MemberId] and msg.MemberId and #msg.MemberId == 43 then
        Invites[msg.MemberId] = {
          MemberId = msg.MemberId,
          MemberName = msg.MemberName,
          MemberReason = msg.MemberReason
        }
        ao.send({
          Target = msg.From,
          Data = "Successfully invite member"
        })
        ao.send({
          Target = msg.MemberId,
          Data = "You have been invited to join chatroom " .. ao.id
        })
      else
          ao.send({
            Target = msg.From,
            Action = 'AddInvite-Error',
            ['Message-Id'] = msg.Id,
            Error = 'You have been invited this member'
          })
      end
    else 
      ao.send({
        Target = msg.From,
        Action = 'AddInvite-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only an administrator can invite a member'
      })
    end
  end
)

Handlers.add(
  "AddInvites",
  Handlers.utils.hasMatchingTag("Action", "AddInvites"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    
    if isAdmin then
      local addresses = {}
      for address in string.gmatch(msg.MemberId, '([^\n]+)') do
        if #address == 43 then
          table.insert(addresses, address)
        end
      end

      for _, address in ipairs(addresses) do
        if not Invites[address] then
          Invites[address] = {
            MemberId = address,
            MemberName = msg.MemberName,
            MemberReason = msg.MemberReason
          }
          ao.send({
            Target = msg.From,
            Data = "Successfully invite member " .. address
          })
          ao.send({
            Target = address,
            Data = "You have been invited to join chatroom " .. ao.id
          })
        else
          ao.send({
            Target = msg.From,
            Action = 'AddInvite-Error',
            ['Message-Id'] = msg.Id,
            Error = 'You have already invited this member ' .. address
          })
        end
      end
    else 
      ao.send({
        Target = msg.From,
        Action = 'AddInvite-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only an administrator can invite a member'
      })
    end
  end
)

Handlers.add(
  "AgreeInvite",
  Handlers.utils.hasMatchingTag("Action", "AgreeInvite"),
  function (msg)
    if Invites[msg.From] then
      Members[msg.From] = Invites[msg.From]
      Invites[msg.From] = nil
      ao.send({
        Target = msg.From,
        Data = "You have joined the chatroom " .. ao.id
      })
    else
        ao.send({
          Target = msg.From,
          Action = 'AgreeInvite-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Does not have an invite or has already processed'
        })
    end
  end
)

Handlers.add(
  "RefuseInvite",
  Handlers.utils.hasMatchingTag("Action", "RefuseInvite"),
  function (msg)
    if Invites[msg.From] then
      Invites[msg.From] = nil
      ao.send({
        Target = msg.From,
        Data = "You have refused the chatroom " .. ao.id
      })
    else
        ao.send({
          Target = msg.From,
          Action = 'RefuseInvite-Error',
          ['Message-Id'] = msg.Id,
          Error = 'Does not have an invite or has already processed'
        })
    end
  end
)


Handlers.add(
  "AddMember",
  Handlers.utils.hasMatchingTag("Action", "AddMember"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end

    if isAdmin then
      if not Members[msg.MemberId] and msg.MemberId and #msg.MemberId == 43 then
        Members[msg.MemberId] = {
          MemberId = msg.MemberId,
          MemberName = msg.MemberName,
          MemberReason = msg.MemberReason
        }
        ao.send({
          Target = msg.From,
          Data = "User successfully join the chatroom " .. msg.MemberId
        })
        ao.send({
          Target = msg.MemberId,
          Data = "You have already joined. Welcome to the chatroom " .. ao.id
        })
      else
        ao.send({
          Target = msg.From,
          Action = 'AddMember-Error',
          ['Message-Id'] = msg.Id,
          Error = 'This member has joined'
        })
      end
    else 
      ao.send({
        Target = msg.From,
        Action = 'AddMember-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only administrators can add memeber'
      })
    end
  end
)

Handlers.add(
  "DelMember",
  Handlers.utils.hasMatchingTag("Action", "DelMember"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    
    if isAdmin and msg.MemberId and #msg.MemberId == 43 then
      if Members[msg.MemberId] then
        Members[msg.MemberId] = nil
        ao.send({
          Target = msg.From,
          Data = "Member successfully removed"
        })
        ao.send({
          Target = msg.MemberId,
          Data = "You have been removed from chatroom " .. ao.id
        })
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
  "BlockMember",
  Handlers.utils.hasMatchingTag("Action", "BlockMember"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end
    
    if isAdmin and msg.MemberId and #msg.MemberId == 43 then
      if Members[msg.MemberId] then
        BlockMembers[msg.MemberId] = Members[msg.MemberId]
        ao.send({
          Target = msg.From,
          Data = "Member successfully blocked"
        })
        ao.send({
          Target = msg.MemberId,
          Data = "You have been blocked from chatroom " .. ao.id
        })
      end
    else 
      ao.send({
        Target = msg.From,
        Action = 'BlockMember-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only an administrator can block a member'
      })
    end
  end
)

Handlers.add(
  "ApplyJoin",
  Handlers.utils.hasMatchingTag("Action", "ApplyJoin"),
  function (msg)
    if not BlockMembers[msg.MemberId] then
      if not Members[msg.From] then
        Members[msg.From] = {
          MemberId = msg.From,
          MemberName = msg.MemberName,
          MemberReason = msg.MemberReason
        }
        ao.send({Target = msg.From, Data = 'Your application has been submitted and approval.'})
      else 
        ao.send({
          Target = msg.From,
          Action = 'ApplyJoin-Error',
          ['Message-Id'] = msg.Id,
          Error = 'You have already join this chatroom, there is no need to apply again'
        })
      end
    else
      ao.send({
        Target = msg.From,
        Action = 'ApplyJoin-Error',
        ['Message-Id'] = msg.Id,
        Error = 'You are blocked'
      })
    end
    
  end
)

Handlers.add(
  "ApplyJoinNeedApproval",
  Handlers.utils.hasMatchingTag("Action", "ApplyJoin"),
  function (msg)
    if not Applicants[msg.From] then
      Applicants[msg.From] = {
        MemberId = msg.From,
        MemberName = msg.MemberName,
        MemberReason = msg.MemberReason
      }
      ao.send({Target = msg.From, Data = 'Your application has been submitted and is awaiting administrator approval'})
      local haveSentRecords = {}
      for _, admin in ipairs(Admins) do
        if not haveSentRecords[admin] then
          ao.send({Target = admin, Data = 'You have a new application that requires approval', Sender = msg.From})
          haveSentRecords[admin] = true
        end
      end
    else 
      ao.send({
        Target = msg.From,
        Action = 'ApplyJoin-Error',
        ['Message-Id'] = msg.Id,
        Error = 'You have already applied to join this chatroom, there is no need to apply again'
      })
    end
    
  end
)

Handlers.add(
  "ApprovalApply",
  Handlers.utils.hasMatchingTag("Action", "ApprovalApply"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end

    if isAdmin then
      local memberIds = {}
      for memberId in string.gmatch(msg.MemberId, '([^*]+)') do
        if #memberId == 43 then
          table.insert(memberIds, memberId)
        end
      end

      for _, memberId in ipairs(memberIds) do
        if #memberId == 43 then
          if not Members[memberId] then
            if Applicants[memberId] then
              Members[memberId] = Applicants[memberId]
              Applicants[memberId] = nil
              ao.send({
                Target = msg.From,
                Data = "User successfully approved " .. memberId
              })
              ao.send({
                Target = memberId,
                Data = "Your application has been approved. Welcome to the chatroom " .. ao.id
              })
            else 
              ao.send({
                Target = msg.From,
                Action = 'ApprovalApply-Error',
                ['Message-Id'] = msg.Id,
                Error = 'This member is not listed in the applicants or has already been approved'
              })
            end
          else
            Applicants[memberId] = nil
            ao.send({
              Target = msg.From,
              Action = 'ApprovalApply-Error',
              ['Message-Id'] = msg.Id,
              Error = 'This member has joined'
            })
          end
        else
          ao.send({
            Target = msg.From,
            Action = 'ApprovalApply-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Invalid member ID length'
          })
        end
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
  "RefuseApply",
  Handlers.utils.hasMatchingTag("Action", "RefuseApply"),
  function (msg)
    local isAdmin = false
    if msg.From == Owner then
      isAdmin = true
    end
    for _, Admin in ipairs(Admins) do
        if Admin == msg.From then
            isAdmin = true
            break
        end
    end

    if isAdmin then
      local memberIds = {}
      for memberId in string.gmatch(msg.MemberId, '([^*]+)') do
        if #memberId == 43 then
          table.insert(memberIds, memberId)
        end
      end
      for _, memberId in ipairs(memberIds) do
        if #memberId == 43 then
          if Applicants[memberId] then
            Applicants[memberId] = nil
            ao.send({
              Target = msg.From,
              Data = "You have refused user " .. msg.MemberName .. " entry to this chatroom " .. ao.id
            })
            ao.send({
              Target = msg.MemberId,
              Data = "You have been refused entry to this chatroom " .. ao.id .. " Reason: " .. msg.MemberReason
            })
          else 
            ao.send({
              Target = msg.From,
              Action = 'RefuseApply-Error',
              ['Message-Id'] = msg.Id,
              Error = 'Does not have an invite or has already processed'
            })
          end
        else
          ao.send({
            Target = msg.From,
            Action = 'ApprovalApply-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Invalid member ID length'
          })
        end
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
    if Members[msg.From] then
      Members[msg.From] = nil
      ao.send({
        Target = msg.From,
        ['Message-Id'] = msg.Id,
        Data = 'You have successfully exited from chatroom ' .. msg.Data
      })
    else 
      ao.send({
        Target = msg.From,
        Action = 'Quit-Error',
        ['Message-Id'] = msg.Id,
        Error = 'You are not a memeber ' .. msg.Data
      })
    end
  end
)


return Welcome()