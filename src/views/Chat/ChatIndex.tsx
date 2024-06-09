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

import { GetInboxMsgFromLocalStorage, GetAoConnectMembers, SetAoConnectMembers, GetAoConnectChannels, SetAoConnectChannels } from 'src/functions/AoConnect/MsgReminder'
import { GetMyInboxMsg, GetMyInboxLastMsg, sleep, GetMyLastMsg } from 'src/functions/AoConnect/AoConnect'
import { SendMessageToChivesChat, ChivesChatGetMembers, ChivesChatGetChannels, ChivesChatAddAdmin, ChivesChatDelAdmin, ChivesChatAddInvites } from 'src/functions/AoConnect/ChivesChat'
import { StatusObjType, StatusType } from 'src/types/apps/chatTypes'
import MembersList from 'src/views/Chat/MembersList'
import ChannelsList from 'src/views/Chat/ChannelsList'
import UserProfileRight from 'src/views/Chat/UserProfileRight'
import MembersInvite from 'src/views/Chat/MembersInvite'

import {  } from 'src/functions/AoConnect/MsgReminder'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;



const AppChat = (props: any) => {
  // ** Hook

  // ** States
  const [userStatus, setUserStatus] = useState<StatusType>('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)

  const [loadingGetMembers, setLoadingGetMembers] = useState<boolean>(false)
  const [loadingGetChannels, setLoadingGetChannels] = useState<boolean>(false)
  const [getChivesChatGetMembers, setGetChivesChatGetMembers] = useState<any>([[], {}])
  const [getChivesChatGetChannels, setGetChivesChatGetChannels] = useState<any>([])
  const [allMembers, setAllMembers] = useState<any>({})
  const [openMembersInvite, setOpenMembersInvite] = useState<boolean>(false)
  const [valueMembersInvite, setValueMembersInvite] = useState<string>('W8KNkIsXPTxIM9dBlVkZD7AM2IjyHrHIoSbQPZ3fOFk\nK4kzmPPoxWp0YQqG0UNDeXIhWuhWkMcG0Hx8HYCjmLw\nJQbi-qZBHWQCCl3BoPEwWOfGzNlYhxK0DmlwQlBb4cM')

  const [member, setMember] = useState<any>(null)
  
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
  const handleUserProfileRightSidebarToggle = () => {
    setUserProfileRightOpen(!userProfileRightOpen)
    setMember(null)
  }


  const auth = useAuth()
  const currentWallet = auth.currentWallet

  const { t } = useTranslation()
  const { id, app, myProcessTxId, currentAddress } = props

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [counter, setCounter] = useState<number>(0)
  const [membersCounter, setMembersCounter] = useState<number>(0)
  
  //const [channelsCounter, setChannelsCounter] = useState<number>(0)
  //const [messagesCounter, setMessagesCounter] = useState<number>(0)

  useEffect(() => {
    let timeoutId: any = null;

    setUserStatus('online')

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

  useEffect(() => {
    if(membersCounter>0) {
      handleGetAllMembers();
    }
  }, [membersCounter]);
  
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

  const handleAddChannelAdmin = async function (MemberId: string) {
    toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
    if(id != myProcessTxId)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })
    }
    const AddAdminByMemberId = await ChivesChatAddAdmin(currentWallet.jwk, id, myProcessTxId, MemberId)
    if(AddAdminByMemberId) {
      toast.success(t('Your request has been successfully executed.') as string, { duration: 2500, position: 'top-center' })
      console.log("handleAddChannelAdmin AddAdminByMemberId", AddAdminByMemberId)
      if(AddAdminByMemberId?.msg?.Output?.data?.output)  {
        const formatText = AddAdminByMemberId?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
          console.log("handleAddChannelAdmin formatText", formatText)

          //Read message from inbox
          const AdminTwoInboxData = await GetMyLastMsg(currentWallet.jwk, id)
          if(AdminTwoInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
            }
          }
          setMembersCounter(membersCounter + 1)

        }
      }
    }
  }

  const handleDelChannelAdmin = async function (MemberId: string) {
    toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
    if(id != myProcessTxId)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })
    }
    const DelAdminByMemberId = await ChivesChatDelAdmin(currentWallet.jwk, id, myProcessTxId, MemberId)
    if(DelAdminByMemberId) {
      toast.success(t('Your request has been successfully executed.') as string, { duration: 2500, position: 'top-center' })
      console.log("handleDelChannelAdmin DelAdminByMemberId", DelAdminByMemberId)
      if(DelAdminByMemberId?.msg?.Output?.data?.output)  {
        const formatText = DelAdminByMemberId?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
          console.log("handleDelChannelAdmin formatText", formatText)

          //Read message from inbox
          const AdminTwoInboxData = await GetMyLastMsg(currentWallet.jwk, id)
          if(AdminTwoInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
            }
          }
          setMembersCounter(membersCounter + 1)

        }
      }
    }
  }

  const handleInviteMember = async function () {
    toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
    if(id != myProcessTxId)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })
    }
    const ChivesChatAddInvitesUserOne = await ChivesChatAddInvites(currentWallet.jwk, id, myProcessTxId, valueMembersInvite.replace(/\n/g, '\\n'), "Invite Member", "Hope you join this chatroom")
    if(ChivesChatAddInvitesUserOne) {
      toast.success(t('Your request has been successfully executed.') as string, { duration: 2500, position: 'top-center' })
      console.log("handleInviteMember ChivesChatAddInvitesUserOne", ChivesChatAddInvitesUserOne)
      if(ChivesChatAddInvitesUserOne?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddInvitesUserOne?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
          console.log("handleInviteMember formatText", formatText)

          //Read message from inbox
          const AdminTwoInboxData = await GetMyLastMsg(currentWallet.jwk, id)
          if(AdminTwoInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
            }
          }
          
        }
      }
    }
  }


  const handleGetAllMessages = async function () {
    setDownloadButtonDisable(true)
    getChatLogList()
    await GetMyInboxMsg(currentWallet.jwk, id)
    
    //setProcessingMessages([])
    getChatLogList()
    
    //console.log("handleGetAllMessages counter", counter)
    setDownloadButtonDisable(false)
  }

  const handleGetAllMembers = async function () {
    if(currentAddress) {
      const GetAoConnectMembersData = GetAoConnectMembers(currentAddress)
      setGetChivesChatGetMembers(GetAoConnectMembersData)
    }
    if(id && myProcessTxId)  {
      setLoadingGetMembers(true)
      const GetChivesChatGetMembers = await ChivesChatGetMembers(id, myProcessTxId)
      if(GetChivesChatGetMembers) {
        setGetChivesChatGetMembers(GetChivesChatGetMembers)
        SetAoConnectMembers(currentAddress, GetChivesChatGetMembers)
        console.log("GetChivesChatGetMembers", GetChivesChatGetMembers)
      }
      setLoadingGetMembers(false)
    }
  }

  const handleGetAllChannels = async function () {
    if(currentAddress) {
      const GetAoConnectChannelsData = GetAoConnectChannels(currentAddress)
      setGetChivesChatGetChannels(GetAoConnectChannelsData)
    }
    if(id && myProcessTxId)  {
      setLoadingGetChannels(true)
      const GetChivesChatGetChannels = await ChivesChatGetChannels(id, myProcessTxId)
      if(GetChivesChatGetChannels) {
        setGetChivesChatGetChannels(GetChivesChatGetChannels)
        SetAoConnectChannels(currentAddress, GetChivesChatGetChannels)
        console.log("GetChivesChatGetChannels", GetChivesChatGetChannels)
      }
      setLoadingGetChannels(false)
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
        loadingGetChannels={loadingGetChannels}
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
        setMember={setMember}
        setUserProfileRightOpen={setUserProfileRightOpen}
        allMembers={allMembers}
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
        loadingGetMembers={loadingGetMembers}
        setMember={setMember}
        setUserProfileRightOpen={setUserProfileRightOpen}
        setAllMembers={setAllMembers}
        handleAddChannelAdmin={handleAddChannelAdmin}
        handleDelChannelAdmin={handleDelChannelAdmin}
        isOwner={id == myProcessTxId ? true : false}
        app={app}
        setOpenMembersInvite={setOpenMembersInvite}
      />
      <UserProfileRight
        member={member}
        hidden={hidden}
        statusObj={statusObj}
        membersListWidth={(membersListWidth+200)}
        userProfileRightOpen={userProfileRightOpen}
        handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
      />
      <MembersInvite openMembersInvite={openMembersInvite} setOpenMembersInvite={setOpenMembersInvite} valueMembersInvite={valueMembersInvite} setValueMembersInvite={setValueMembersInvite} handleInviteMember={handleInviteMember} />
      </Box>
    </Fragment>
  )
}


//AppChat.contentHeightFixed = true

export default AppChat
