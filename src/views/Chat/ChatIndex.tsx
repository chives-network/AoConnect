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

import { ChatChatInit } from 'src/functions/ChatBook'

// ** Axios Imports
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

import { GetInboxMsgFromLocalStorage } from 'src/functions/AoConnect/MsgReminder'
import { GetMyInboxMsg, GetMyInboxLastMsg } from 'src/functions/AoConnect/AoConnect'
import { SendMessageToChivesChat } from 'src/functions/AoConnect/ChivesChat'


const AppChat = (props: any) => {
  // ** Hook

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const { t } = useTranslation()
  const { id, app } = props

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [counter, setCounter] = useState<number>(0)

  const MyProcessTxId = "Ag2sWWOEn_bQHdB6xWzVc6TNC-89MqLgHOIBQeh7PZA"

  useEffect(() => {
  }, [])

  useEffect(() => {
    let timeoutId: any = null;
  
    const CronTaskLastMessage = () => {
      console.log('This message will appear every 10 seconds');
      let delay = Math.random() * 10000;
      console.log(`Simulating a long running process: ${delay}ms`);
      timeoutId = setTimeout(() => {
        handleGetLastMessage();
        console.log('Finished long running process');
        timeoutId = setTimeout(CronTaskLastMessage, 10000);
      }, delay);
    };
  
    if (t && currentAddress && id) {
      CronTaskLastMessage();
      handleGetAllLastMessages();
      setSendButtonText(t("Send") as string);
      setSendInputText(t("Your message...") as string);
    }
  
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [t, currentAddress, id]);
  
  const handleGetLastMessage = async function () {
    setDownloadButtonDisable(true)
    await GetMyInboxLastMsg(currentWallet.jwk, id)
    setCounter(counter+1)
    getChatLogList()
    console.log("handleGetLastMessage counter", counter)
    setDownloadButtonDisable(false)
  }

  const handleGetAllLastMessages = async function () {
    setDownloadButtonDisable(true)
    await GetMyInboxMsg(currentWallet.jwk, id)
    setProcessingMessage("")
    setCounter(counter+1)
    getChatLogList()
    console.log("handleGetAllLastMessages counter", counter)
    setDownloadButtonDisable(false)
  }
  
  const getChatLogList = async function () {
    if(id && currentAddress) {
      const GetInboxMsgFromLocalStorageData = GetInboxMsgFromLocalStorage(id, 0, 20)
      console.log("GetInboxMsgFromLocalStorageData", GetInboxMsgFromLocalStorageData)
      if(GetInboxMsgFromLocalStorageData)  {
        const ChatChatInitList = ChatChatInit(GetInboxMsgFromLocalStorageData, app.systemPrompt, id, MyProcessTxId)
        const selectedChat = {
          "chat": {
              "id": 1,
              "userId": MyProcessTxId,
              "unseenMsgs": 0,
              "chat": ChatChatInitList
          }
        }
        const storeInit = {
          "chats": [],
          "userProfile": {
              "id": MyProcessTxId,
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
      const selectedChat = {
        "chat": {
            "id": currentAddress,
            "userId": currentAddress,
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
  const [downloadButtonDisable, setDownloadButtonDisable] = useState<boolean>(false)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [processingMessage, setProcessingMessage] = useState("")
  const [finishedMessage, setFinishedMessage] = useState("")
  const [responseTime, setResponseTime] = useState<number | null>(null);
  
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = false

  const sendMsg = async (Obj: any) => {
    if(currentAddress && t) {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      setRefreshChatCounter(refreshChatCounter + 1)
      const startTime = performance.now()
      
      const SendMessageToChatroomDataUserOne = await SendMessageToChivesChat(currentWallet.jwk, id, MyProcessTxId, Obj.message)
      if(SendMessageToChatroomDataUserOne && SendMessageToChatroomDataUserOne.id) {
        setProcessingMessage(Obj.message)
      }
      
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
        downloadButtonDisable={downloadButtonDisable}
        sendButtonDisable={sendButtonDisable}
        sendButtonLoading={sendButtonLoading}
        sendButtonText={sendButtonText}
        sendInputText={sendInputText}
        processingMessage={processingMessage}
        ClearButtonClick={ClearButtonClick}
        handleGetAllLastMessages={handleGetAllLastMessages}
        app={app}
        handleDeleteOneChatLogById={handleDeleteOneChatLogById}
        MyProcessTxId={MyProcessTxId}
      />
      </Box>
    </Fragment>
  )
}

//AppChat.contentHeightFixed = true

export default AppChat
