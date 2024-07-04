
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
EmailRecordsUnRead = EmailRecordsUnRead or {}

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
    if EmailRecords[msg.From][emailFolder] then 
      emailIdList = EmailRecords[msg.From][emailFolder]
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

    local EmailRecordsCount = {}
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Inbox'] then
      EmailRecordsCount['Inbox'] = #EmailRecordsUnRead[msg.From]['Inbox']
    else
      EmailRecordsCount['Inbox'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Started'] then
      EmailRecordsCount['Started'] = #EmailRecordsUnRead[msg.From]['Started']
    else
      EmailRecordsCount['Started'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Snoozed'] then
      EmailRecordsCount['Snoozed'] = #EmailRecordsUnRead[msg.From]['Snoozed']
    else
      EmailRecordsCount['Snoozed'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Sent'] then
      EmailRecordsCount['Sent'] = #EmailRecordsUnRead[msg.From]['Sent']
    else
      EmailRecordsCount['Sent'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Drafts'] then
      EmailRecordsCount['Drafts'] = #EmailRecordsUnRead[msg.From]['Drafts']
    else
      EmailRecordsCount['Drafts'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Important'] then
      EmailRecordsCount['Important'] = #EmailRecordsUnRead[msg.From]['Important']
    else
      EmailRecordsCount['Important'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['AllMail'] then
      EmailRecordsCount['AllMail'] = #EmailRecordsUnRead[msg.From]['AllMail']
    else
      EmailRecordsCount['AllMail'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Spam'] then
      EmailRecordsCount['Spam'] = #EmailRecordsUnRead[msg.From]['Spam']
    else
      EmailRecordsCount['Spam'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Trash'] then
      EmailRecordsCount['Trash'] = #EmailRecordsUnRead[msg.From]['Trash']
    else
      EmailRecordsCount['Trash'] = 0
    end
    EmailRecordsCount['Categories'] = {}
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Categories'] and EmailRecordsUnRead[msg.From]['Categories']['Social'] then
      EmailRecordsCount['Categories']['Social'] = #EmailRecordsUnRead[msg.From]['Categories']['Social']
    else
      EmailRecordsCount['Categories']['Social'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Categories'] and EmailRecordsUnRead[msg.From]['Categories']['Updates'] then
      EmailRecordsCount['Categories']['Updates'] = #EmailRecordsUnRead[msg.From]['Categories']['Updates']
    else
      EmailRecordsCount['Categories']['Updates'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Categories'] and EmailRecordsUnRead[msg.From]['Categories']['Forums'] then
      EmailRecordsCount['Categories']['Forums'] = #EmailRecordsUnRead[msg.From]['Categories']['Forums']
    else
      EmailRecordsCount['Categories']['Forums'] = 0
    end
    if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Categories'] and EmailRecordsUnRead[msg.From]['Categories']['Promotions'] then
      EmailRecordsCount['Categories']['Promotions'] = #EmailRecordsUnRead[msg.From]['Categories']['Promotions']
    else
      EmailRecordsCount['Categories']['Promotions'] = 0
    end

    -- out email results
    ao.send({
        Target = msg.From,
        Data = require('json').encode({filterEmails, totalRecords, emailFolder, startIndex, endIndex, EmailRecordsCount})
    })

  end
)

Handlers.add(
  "ReadEmailContent",
  Handlers.utils.hasMatchingTag("Action", "ReadEmailContent"),
  function (msg)

    local EmailContent = {}
    if msg.From and msg.Tags.EmailId and EmailDatas[msg.Tags.EmailId] then
      EmailContent = EmailDatas[msg.Tags.EmailId]
      if EmailRecordsUnRead[msg.From] and EmailRecordsUnRead[msg.From]['Inbox'] then
        local found = false
        for i, v in ipairs(EmailRecordsUnRead[msg.From]['Inbox']) do
            if v == msg.Tags.EmailId then
                table.remove(EmailRecordsUnRead[msg.From]['Inbox'], i)
                found = true
                break
            end
        end

        if found then
            ao.send({
                Target = msg.From,
                Data = require('json').encode({Data = EmailContent, Status = 'OK'})
            })
        else
            ao.send({
                Target = msg.From,
                Data = require('json').encode({Data = 'Not Found Email 1', Status = 'ERROR'})
            })
        end
      else
        ao.send({
            Target = msg.From,
            Data = require('json').encode({Data = 'Not Found Email 2', Status = 'ERROR'})
        })
      end
    else
      ao.send({
          Target = msg.From,
          Data = require('json').encode({Data = 'Not Found Email 3', Status = 'ERROR'})
      })
    end
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

          if EmailRecords[msg.To] == nil then
              EmailRecords[msg.To] = {}
          end
          if EmailRecords[msg.To]['Inbox'] == nil then
            EmailRecords[msg.To]['Inbox'] = {}
          end
          table.insert(EmailRecords[msg.To]['Inbox'], msg.Id)

          
          if EmailRecordsUnRead[msg.To] == nil then
            EmailRecordsUnRead[msg.To] = {}
          end
          if EmailRecordsUnRead[msg.To]['Inbox'] == nil then
            EmailRecordsUnRead[msg.To]['Inbox'] = {}
          end
          table.insert(EmailRecordsUnRead[msg.To]['Inbox'], msg.Id)

          EmailDatas[msg.Id] = {
              Id = msg.Id,
              From = msg.From,
              To = msg.To,
              Subject = msg.Subject,
              Content = msg.Content,
              Summary = msg.Summary,
              Encrypted = msg.Encrypted,
              Timestamp = os.time(),
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
    if msg.From and msg.Tags.Target and #msg.Tags.Target == 43 then
        if EmailRecords[msg.From] == nil then
          EmailRecords[msg.From] = {}
          EmailRecords[msg.From]['Inbox'] = {}
          EmailRecords[msg.From]['Started'] = {}
          EmailRecords[msg.From]['Snoozed'] = {}
          EmailRecords[msg.From]['Sent'] = {}
          EmailRecords[msg.From]['Drafts'] = {}
          EmailRecords[msg.From]['Important'] = {}
          EmailRecords[msg.From]['AllMail'] = {}
          EmailRecords[msg.From]['Spam'] = {}
          EmailRecords[msg.From]['Trash'] = {}
          EmailRecords[msg.From]['Categories'] = {}
          EmailRecords[msg.From]['Categories']['Social'] = {}
          EmailRecords[msg.From]['Categories']['Updates'] = {}
          EmailRecords[msg.From]['Categories']['Forums'] = {}
          EmailRecords[msg.From]['Categories']['Promotions'] = {}
        end
        if EmailRecords[msg.Tags.Target] == nil then
          EmailRecords[msg.Tags.Target] = {}
          EmailRecords[msg.Tags.Target]['Inbox'] = {}
          EmailRecords[msg.Tags.Target]['Started'] = {}
          EmailRecords[msg.Tags.Target]['Snoozed'] = {}
          EmailRecords[msg.Tags.Target]['Sent'] = {}
          EmailRecords[msg.Tags.Target]['Drafts'] = {}
          EmailRecords[msg.Tags.Target]['Important'] = {}
          EmailRecords[msg.Tags.Target]['AllMail'] = {}
          EmailRecords[msg.Tags.Target]['Spam'] = {}
          EmailRecords[msg.Tags.Target]['Trash'] = {}
          EmailRecords[msg.Tags.Target]['Categories'] = {}
          EmailRecords[msg.Tags.Target]['Categories']['Social'] = {}
          EmailRecords[msg.Tags.Target]['Categories']['Updates'] = {}
          EmailRecords[msg.Tags.Target]['Categories']['Forums'] = {}
          EmailRecords[msg.Tags.Target]['Categories']['Promotions'] = {}
        end
        if EmailRecordsUnRead[msg.Tags.Target] == nil then
          EmailRecordsUnRead[msg.Tags.Target] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Inbox'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Started'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Snoozed'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Sent'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Drafts'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Important'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['AllMail'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Spam'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Trash'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Categories'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Categories']['Social'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Categories']['Updates'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Categories']['Forums'] = {}
          EmailRecordsUnRead[msg.Tags.Target]['Categories']['Promotions'] = {}
        end
        if PublicKeys[msg.Tags.Target] == nil then
          ao.send({
            Target = msg.From,
            Data = ''
          })
        else 
          ao.send({
            Target = msg.From,
            Data = PublicKeys[msg.Tags.Target]
          })
        end
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