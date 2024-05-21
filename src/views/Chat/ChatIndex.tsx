// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'

// ** Types
import { StatusObjType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import ChatContent from 'src/views/Chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { ChatChatList, ChatChatInit, ChatChatNameList, ChatChatInput, ChatAiOutputV1, DeleteChatChat, DeleteChatChatHistory, DeleteChatChatByChatlogId, DeleteChatChatHistoryByChatlogId, getAnonymouscurrentAddress  } from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

import { GetChatLogFromIndexedDb } from 'src/functions/AoConnectMsgReminder'

const AppChat = (props: any) => {
  // ** Hook

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const { t } = useTranslation()
  const router = useRouter()
  const { id, app } = props

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [chatId, setChatId] = useState<number | string>(-1)
  const [chatName, setChatName] = useState<string>("")
  const [historyCounter, setHistoryCounter] = useState<number>(0)
  const [stopMsg, setStopMsg] = useState<boolean>(false)

  const getChatLogList = async function (appId: string, appTemplate: string) {
    if(id && currentAddress) {
      const GetChatLogFromIndexedDbData = await GetChatLogFromIndexedDb(id)
      if(GetChatLogFromIndexedDbData)  {
        const ChatChatInitList = ChatChatInit(GetChatLogFromIndexedDbData, appTemplate)
        setHistoryCounter(ChatChatInitList.length)
        const selectedChat = {
          "chat": {
              "id": 1,
              "currentAddress": currentAddress,
              "unseenMsgs": 0,
              "chat": ChatChatInitList
          }
        }
        const storeInit = {
          "chats": [],
          "userProfile": {
              "id": currentAddress,
              "avatar": "/images/avatars/1.png",
              "fullName": "Current User",
          },
          "selectedChat": selectedChat
        }
        setStore(storeInit)
      }
    }
  }

  const ClearButtonClick = async function () {
    if(currentAddress) {
      DeleteChatChat()
      DeleteChatChatHistory(currentAddress, chatId, id)
      const selectedChat = {
        "chat": {
            "id": currentAddress,
            "currentAddress": currentAddress,
            "unseenMsgs": 0,
            "chat": []
        }
      }
      const storeInit = {
        "chats": [],
        "userProfile": {
            "id": currentAddress,
            "avatar": "/images/avatars/1.png",
            "fullName": "Current User",
        },
        "selectedChat": selectedChat
      }
      setStore(storeInit)

      //Set system prompt
      ChatChatInit([], GetWelcomeTextFromAppValue)
      setHistoryCounter(0)
      setRefreshChatCounter(0)
      
      const RS = {status:'ok', msg:'Success'}
      if(RS && RS.status == 'ok') { 
        toast.success(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
      else {
        toast.error(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
    }
  }

  const handleDeleteOneChatLogById = async function (chatlogId: string) {
    if (currentAddress && id) {
      DeleteChatChatByChatlogId(chatlogId)
      DeleteChatChatHistoryByChatlogId(currentAddress, chatId, id, chatlogId)
      
      const RS = {status:'ok', msg:'Success'}
      if(RS && RS.status == 'ok') { 
        setRefreshChatCounter(refreshChatCounter + 1)
        toast.success(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
      else {
        toast.error(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
    }
  }
  
  // ** States
  const [store, setStore] = useState<any>(null)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [processingMessage, setProcessingMessage] = useState("")
  const [finishedMessage, setFinishedMessage] = useState("")
  const [responseTime, setResponseTime] = useState<number | null>(null);
  

  const lastChat = {
    "message": processingMessage,
    "time": Date.now(),
    "senderId": 999999,
    "responseTime": responseTime,
    "history": [],
    "feedback": {
        "isSent": true,
        "isDelivered": false,
        "isSeen": false
    }
  }

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = false

  useEffect(() => {
    if(currentAddress) {
      const ChatChatListValue = ChatChatList()
      if(processingMessage && processingMessage!="") {
        
        //流式输出的时候,进来显示
        ChatChatListValue.push(lastChat)
      }
      const selectedChat = {
        "chat": {
            "id": currentAddress,
            "currentAddress": currentAddress,
            "unseenMsgs": 0,
            "chat": ChatChatListValue
        }
      }
      const storeInit = {
        "chats": [],
        "userProfile": {
            "id": currentAddress,
            "avatar": "/images/avatars/1.png",
            "fullName": "Current User",
        },
        "selectedChat": selectedChat
      }
      setStore(storeInit)
      setHistoryCounter(ChatChatListValue.length)
    }
  }, [refreshChatCounter, processingMessage, auth])

  useEffect(() => {
    if(t && id && app)   {
      const ChatChatNameListData: string[] = ChatChatNameList()
      if(ChatChatNameListData.length == 0) {
        setRefreshChatCounter(refreshChatCounter + 1)
      }
      setSendButtonText(t("Send") as string)
      setSendInputText(t("Your message...") as string)  

      setChatId('ChatApp')
      if(app && app.PublishApp && app.PublishApp.name) {
        setChatName(app.PublishApp.name)
        setChatId(app.id)
      }
      else {
        setChatName(app.name)
        setChatId(app.id)
      }

    }
  }, [t, app])

  const sendMsg = async (Obj: any) => {
    if(currentAddress && t) {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      ChatChatInput(id, Obj.send, Obj.message, currentAddress, 0, [])
      setRefreshChatCounter(refreshChatCounter + 1)
      const startTime = performance.now()

      const endTime = performance.now();
      setResponseTime(endTime - startTime);

      if(true)      {
        setSendButtonDisable(false)
        setSendButtonLoading(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t("Send") as string)
        setSendInputText(t("Your message...") as string)
      }
    }
  }

  // ** Vars
  const { skin } = settings
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const statusObj: StatusObjType = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  return (
    <Fragment>
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
      <ChatContent
        store={store}
        hidden={hidden}
        sendMsg={sendMsg}
        mdAbove={mdAbove}
        statusObj={statusObj}
        sendButtonDisable={sendButtonDisable}
        sendButtonLoading={sendButtonLoading}
        sendButtonText={sendButtonText}
        sendInputText={sendInputText}
        chatId={chatId}
        chatName={chatName}
        email={auth?.user?.email}
        ClearButtonClick={ClearButtonClick}
        historyCounter={historyCounter}
        app={app}
        handleDeleteOneChatLogById={handleDeleteOneChatLogById}
      />
      </Box>
    </Fragment>
  )
}

//AppChat.contentHeightFixed = true

export default AppChat
