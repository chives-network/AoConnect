// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import ChatContent from 'src/views/Chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { ChatChatInit } from 'src/functions/ChatBook'

// ** Axios Imports
import { useAuth } from 'src/hooks/useAuth'

import { GetInboxMsgFromLocalStorage, GetAoConnectReminderChatroomTxId } from 'src/functions/AoConnect/MsgReminder'
import { GetMyInboxMsg, GetMyInboxLastMsg, sleep } from 'src/functions/AoConnect/AoConnect'
import { SendMessageToChivesChat, ChivesChatGetMembers, ChivesChatGetChannels } from 'src/functions/AoConnect/ChivesChat'
import { StatusObjType, StatusType } from 'src/types/apps/chatTypes'
import MembersList from 'src/views/Chat/MembersList'
import ChannelsList from 'src/views/Chat/ChannelsList'

import {  } from 'src/functions/AoConnect/MsgReminder'


const AppChat = (props: any) => {
  // ** Hook

  // ** States
  const [userStatus, setUserStatus] = useState<StatusType>('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)

  const [getChivesChatGetMembers, setGetChivesChatGetMembers] = useState<any>([[], {}])
  const [getChivesChatGetChannels, setGetChivesChatGetChannels] = useState<any>([])
  

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  // ** Vars
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const membersListWidth = smAbove ? 270 : 200
  const channelsListWidth = smAbove ? 210 : 200

  const { skin } = settings
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const statusObj: StatusObjType = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)


  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const { t } = useTranslation()
  const { id, app, myProcessTxId } = props

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    let timeoutId: any = null;

    const CronTaskLastMessage = () => {
      
      //console.log('This message will appear every 10 seconds');
      const delay = Math.random() * 10000;
      
      //console.log(`Simulating a long running process: ${delay}ms`);
      timeoutId = setTimeout(() => {
        handleGetLastMessage();
        
        //console.log('Finished long running process');
        timeoutId = setTimeout(CronTaskLastMessage, 10000);
      }, delay);
    };
  
    if (t && currentAddress && id) {
      CronTaskLastMessage();
      handleGetAllMessages();
      handleGetAllMembers();
      handleGetAllChannels();
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
    await GetMyInboxLastMsg(currentWallet.jwk, id, 'Inbox[#Inbox-2]')
    sleep(500)
    await GetMyInboxLastMsg(currentWallet.jwk, id, 'Inbox[#Inbox-1]')
    sleep(500)
    await GetMyInboxLastMsg(currentWallet.jwk, id, 'Inbox[#Inbox]')
    sleep(500)
    setCounter(counter+1)
    getChatLogList()
    
    //console.log("handleGetLastMessage counter", counter)
  }

  const handleGetAllMessages = async function () {
    setDownloadButtonDisable(true)
    getChatLogList()
    await GetMyInboxMsg(currentWallet.jwk, id)
    
    //setProcessingMessages([])
    setCounter(counter+1)
    getChatLogList()
    
    //console.log("handleGetAllMessages counter", counter)
    setDownloadButtonDisable(false)
  }

  const handleGetAllMembers = async function () {
    if(id && myProcessTxId)  {
      const GetChivesChatGetMembers = await ChivesChatGetMembers(id, myProcessTxId)
      if(GetChivesChatGetMembers) {
        setGetChivesChatGetMembers(GetChivesChatGetMembers)
        console.log("GetChivesChatGetMembers", GetChivesChatGetMembers)
      }
    }
  }

  const handleGetAllChannels = async function () {
    if(id && myProcessTxId)  {
      const GetChivesChatGetChannels = await ChivesChatGetChannels(id, myProcessTxId)
      if(GetChivesChatGetChannels) {
        setGetChivesChatGetChannels(GetChivesChatGetChannels)
        console.log("GetChivesChatGetChannels", GetChivesChatGetChannels)
      }
    }
  }

  
  const getChatLogList = async function () {
    if(id && currentAddress) {
      const GetInboxMsgFromLocalStorageData = GetInboxMsgFromLocalStorage(id, 0, 20)
      
      //console.log("GetInboxMsgFromLocalStorageData", GetInboxMsgFromLocalStorageData)
      if(GetInboxMsgFromLocalStorageData)  {
        const ChatChatInitList = ChatChatInit(GetInboxMsgFromLocalStorageData, app.systemPrompt, id)
        const selectedChat = {
          "chat": {
              "id": 1,
              "userId": myProcessTxId,
              "unseenMsgs": 0,
              "chat": ChatChatInitList
          }
        }
        const storeInit = {
          "chats": [],
          "userProfile": {
              "id": myProcessTxId,
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
        console.log("chatlogId", chatlogId)
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
  const [processingMessages, setProcessingMessages] = useState<any[]>([])
  
  // ** Hooks
  //const hidden = false

  const sendMsg = async (Obj: any) => {
    if(currentAddress && t) {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      setRefreshChatCounter(refreshChatCounter + 1)
      
      const SendMessageToChatroomDataUserOne = await SendMessageToChivesChat(currentWallet.jwk, id, myProcessTxId, Obj.message)
      if(SendMessageToChatroomDataUserOne && SendMessageToChatroomDataUserOne.id && SendMessageToChatroomDataUserOne.NanoId) {
        const messageInfor = {
          Sender: myProcessTxId,
          NanoId: SendMessageToChatroomDataUserOne.NanoId,
          messages: [
            {
              Timestamp: String(Date.now()),
              msg: Obj.message,
              NanoId: SendMessageToChatroomDataUserOne.NanoId,
              feedback: false
            }
          ]
        }
        setProcessingMessages((prevState: any)=>([
          ...prevState,
          messageInfor
        ]))
        console.log("SendMessageToChatroomDataUserOne.id", SendMessageToChatroomDataUserOne)
      }
      

      if(true)      {
        setSendButtonDisable(false)
        setSendButtonLoading(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t("Send") as string)
        setSendInputText(t("Your message...") as string)
      }
    }
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
      <ChannelsList
        store={store}
        hidden={hidden}
        mdAbove={mdAbove}
        statusObj={statusObj}
        userStatus={userStatus}
        channelsListWidth={channelsListWidth}
        getChivesChatGetChannels={getChivesChatGetChannels}
        leftSidebarOpen={leftSidebarOpen}
        userProfileLeftOpen={userProfileLeftOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
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
        processingMessages={processingMessages}
        ClearButtonClick={ClearButtonClick}
        handleGetAllMessages={handleGetAllMessages}
        app={app}
        handleDeleteOneChatLogById={handleDeleteOneChatLogById}
        myProcessTxId={myProcessTxId}
      />
      <MembersList
        store={store}
        hidden={hidden}
        mdAbove={mdAbove}
        statusObj={statusObj}
        userStatus={userStatus}
        membersListWidth={membersListWidth}
        getChivesChatGetMembers={getChivesChatGetMembers}
        leftSidebarOpen={leftSidebarOpen}
        userProfileLeftOpen={userProfileLeftOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
      </Box>
    </Fragment>
  )
}

//AppChat.contentHeightFixed = true

export default AppChat
