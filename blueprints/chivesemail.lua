
-- Name: ChivesEmail
-- Author: Chives-Network
-- Email: chivescoin@gmail.com
-- Copyright: MIT
-- Version: 20240705
-- Github: https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesemail.lua

-- Function
-- 1. Send and receive email
-- 2. Support encrypted email

math.randomseed(os.time())

PublicKeys = PublicKeys or {}
EmailRecords = EmailRecords or {}
EmailDatas = EmailDatas or {}

function Welcome()
  return(
      "Welcome to ChivesEmail V0.1!\n\n" ..
      "Main functoin:\n\n" ..
      "1. Send and receive email.\n" ..
      "2. Support encrypted email.\n" ..
      "Have fun, be respectful !")
end

function generateRandomString(length)
    local characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    local randomChars = {}
    for i = 1, length do
        local randomIndex = math.random(1, #characters)
        randomChars[i] = string.sub(characters, randomIndex, randomIndex)
    end
    return table.concat(randomChars)
end

function generateEmailId()
    local characters = 'Email' .. generateRandomString(38)
    return characters
end

Handlers.add(
  "GetMyEmailRecords",
  Handlers.utils.hasMatchingTag("Action", "GetMyEmailRecords"),
  function (msg)
    local emailResult = {}
    if EmailRecords[msg.From] == nil then
        EmailRecords[msg.From] = {}
    end
    local emailFolder = "Inbox"
    if msg.Tags.folder then
        emailFolder = tostring(msg.Tags.folder)
    end
    if EmailRecords[msg.From][emailFolder] == nil then
        EmailRecords[msg.From][emailFolder] = {}
    end
    local emailIdList = {}
    for emailId in pairs(EmailRecords[msg.From][emailFolder]) do
        table.insert(emailIdList, emailId)
    end

    local totalRecords = #emailIdList

    local filterEmails = {}
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
        local emailId = emailIdList[i]
        if emailId and EmailDatas[emailId] then
            table.insert(filterEmails, EmailDatas[emailId])
        end
    end
    -- out email results
    ao.send({
        Target = msg.From,
        Data = require('json').encode(filterEmails)
    })
  end
)

Handlers.add(
  "GetMySentRecords",
  Handlers.utils.hasMatchingTag("Action", "GetMySentRecords"),
  function (msg)
    local emailResult = {}
    if EmailRecords[msg.From] == nil then
        EmailRecords[msg.From] = {}
    end
    local emailFolder = "Inbox"
    if EmailRecords[msg.From][emailFolder] == nil then
        EmailRecords[msg.From][emailFolder] = {}
    end
    local emailIdList = {}
    for emailId in pairs(EmailRecords[msg.From][emailFolder]) do
        table.insert(emailIdList, emailId)
    end

    local totalRecords = #emailIdList

    local filterEmails = {}
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
        local emailId = emailIdList[i]
        if emailId and EmailDatas[emailId] then
            table.insert(filterEmails, EmailDatas[emailId])
        end
    end
    -- out email results
    ao.send({
        Target = msg.From,
        Data = require('json').encode(filterEmails)
    })
  end
)

Handlers.add(
  "SendEmail",
  Handlers.utils.hasMatchingTag("Action", "SendEmail"),
  function (msg)
        if msg.From and msg.To and msg.Subject and msg.Content and msg.Summary and msg.Encrypted then
          if EmailRecords[msg.From] == nil then
              EmailRecords[msg.From] = {}
          end
          if EmailRecords[msg.From]['Sent'] == nil then
              EmailRecords[msg.From]['Sent'] = {}
          end
          table.insert(EmailRecords[msg.From]['Sent'], msg.Id)
          if EmailRecords[msg.To]['Inbox'] == nil then
              EmailRecords[msg.To]['Inbox'] = {}
          end
          table.insert(EmailRecords[msg.To]['Inbox'], msg.Id)
          EmailDatas[msg.Id] = {
              From = msg.From,
              To = msg.To,
              Subject = msg.Subject,
              Content = msg.Content,
              Summary = msg.Summary,
              Encrypted = msg.Encrypted,
              MsgId = msg.Id,
              Attach = {}
          }
          Handlers.utils.reply("Has Send Email")(msg)
          ao.send({
              Target = msg.From,
              Data = "Successfully sent a Email"
          })
        else 
            ao.send({
                Target = msg.From,
                Action = 'SendEmail-Error',
                ['Message-Id'] = msg.Id,
                Error = 'Email send data is not full filled'
            })
        end
  end
)

Handlers.add(
  "GetEmailRecords",
  Handlers.utils.hasMatchingTag("Action", "GetEmailRecords"),
  function (msg)
    if msg.From then
        ao.send({
          Target = msg.From,
          Data = require('json').encode(EmailRecords)
        })
    end
  end
)

Handlers.add(
  "GetPublicKeys",
  Handlers.utils.hasMatchingTag("Action", "GetPublicKeys"),
  function (msg)
    if msg.From then
        ao.send({
          Target = msg.From,
          Data = require('json').encode(PublicKeys)
        })
    end
  end
)

Handlers.add(
  "SetPublicKey",
  Handlers.utils.hasMatchingTag("Action", "SetPublicKey"),
  function (msg)
    if msg.From and msg.PublicKey and msg.PublicKeyMAC then
        PublicKeys[msg.From] = msg.PublicKey
        Handlers.utils.reply("Has set PublicKey")(msg)
        ao.send({
            Target = msg.From,
            Data = "Successfully set a PublicKey"
        })
    else 
        ao.send({
            Target = msg.From,
            Action = 'SetPublicKey-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only user can set PublicKey or PublicKey is null'
        })
    end
  end
)


return Welcome()