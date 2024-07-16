// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import ChatContent from 'src/views/Chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CircularProgress from '@mui/material/CircularProgress'

import { ChatChatInit } from 'src/functions/ChatBook'

// ** Axios Imports
import { useAuth } from 'src/hooks/useAuth'

import { GetChatRecordsFromLocalStorage, GetAoConnectMembers, SetAoConnectMembers, GetAoConnectChannels, SetAoConnectChannels, SaveChatRecordsToStorage } from 'src/functions/AoConnect/MsgReminder'
import { SendMessageToChivesChat, ChivesChatGetMembers, ChivesChatGetChannels, ChivesChatAddAdmin, ChivesChatDelAdmin, ChivesChatAddInvites, ChivesChatApprovalApply, ChivesChatRefuseApply, ChivesChatDelMember, ChivesChatBlockMember, ChivesChatAddChannel, ChivesChatEditChannel, ChivesChatDelChannel, ChivesChatIsMember, GetChatroomAvatar, ChivesChatApplyJoin, ChivesChatGetChatRecords } from 'src/functions/AoConnect/ChivesChat'
import { StatusObjType, StatusType } from 'src/types/apps/chatTypes'
import MembersList from 'src/views/Chat/MembersList'
import ChannelsList from 'src/views/Chat/ChannelsList'
import UserProfileRight from 'src/views/Chat/UserProfileRight'
import MembersInvite from 'src/views/Chat/MembersInvite'
import MembersApplicant from 'src/views/Chat/MembersApplicant'
import ChannelEdit from 'src/views/Chat/ChannelEdit'

import { ansiRegex } from 'src/configs/functions'


const AppChat = (props: any) => {
  // ** Hook

  // ** States
  const [userStatus, setUserStatus] = useState<StatusType>('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)

  const [loadingGetChatLogs, setLoadingGetChatLogs] = useState<boolean>(false)
  const [loadingGetMembers, setLoadingGetMembers] = useState<boolean>(false)
  const [loadingGetChannels, setLoadingGetChannels] = useState<boolean>(false)
  const [getChivesChatGetMembers, setGetChivesChatGetMembers] = useState<any>([[], {}, {}])
  const [getChivesChatGetChannels, setGetChivesChatGetChannels] = useState<any>([])
  const [allMembers, setAllMembers] = useState<any>({})
  const [channelId, setChannelId] = useState<string>('')

  const [openMembersInvite, setOpenMembersInvite] = useState<boolean>(false)
  const [valueMembersInvite, setValueMembersInvite] = useState<string>('')

  const [openMembersApplicant, setOpenMembersApplicant] = useState<boolean>(false)
  const [valueMembersApplicant, setValueMembersApplicant] = useState<any[]>([])

  const [openChannelEdit, setOpenChannelEdit] = useState<any>({add: false, edit: false, del: false, open: false})

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
  const { id, app, myAoConnectTxId, currentAddress } = props

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [counter, setCounter] = useState<number>(0)
  const [membersCounter, setMembersCounter] = useState<number>(0)
  const [channelsCounter, setChannelsCounter] = useState<number>(0)
  const [currentMemberStatus, setCurrentMemberStatus] = useState<boolean[] | null[]>([null, null, null, null, null])
  
  const GetChatroomAvatarData = GetChatroomAvatar(app.logo)
  
  useEffect(() => {
    const checkChivesChatIsMember = async () => {
        const ChivesChatIsMemberData = await ChivesChatIsMember(id, currentAddress)
        console.log("ChivesChatIsMemberData", ChivesChatIsMemberData)
        if (ChivesChatIsMemberData) {
          setCurrentMemberStatus(ChivesChatIsMemberData)
        }
    };
    checkChivesChatIsMember();
  }, [id, currentAddress, counter]);

  useEffect(() => {
    if(currentMemberStatus[0] == true || currentMemberStatus[1] == true || currentMemberStatus[2] == true)  {
      let timeoutId: any = null;

      setUserStatus('online')

      const CronTaskGetMembers = () => {
        
        //console.log('This message will appear every 10 seconds');
        const delay = Math.random() * 180000;
        
        //console.log(`Simulating a long running process: ${delay}ms`);
        timeoutId = setTimeout(() => {
          handleGetAllMembers();
          
          //console.log('Finished long running process');
          timeoutId = setTimeout(CronTaskGetMembers, 180000);
        }, delay);
      };

      const CronTaskGetChannels = () => {
        
        //console.log('This message will appear every 10 seconds');
        const delay = Math.random() * 600000;
        
        //console.log(`Simulating a long running process: ${delay}ms`);
        timeoutId = setTimeout(() => {
          handleGetAllChannels();
          
          //console.log('Finished long running process');
          timeoutId = setTimeout(CronTaskGetChannels, 600000);
        }, delay);
      };
    
      if (t && currentAddress && id) {
        CronTaskGetMembers();
        CronTaskGetChannels();
        handleGetAllMembers();
        handleGetAllChannels();
        setSendButtonText(t("Send") as string);
        setSendInputText(t("Your message...") as string);
      }
    
      return () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId)
        }
      }
    }
  }, [t, currentAddress, id, currentMemberStatus]);

  useEffect(() => {
    if(currentMemberStatus[0] == true || currentMemberStatus[1] == true || currentMemberStatus[2] == true)  {
      let timeoutId: any = null;

      setUserStatus('online')

      const CronTaskLastMessage = () => {
        const delay = Math.random() * 10000;
        timeoutId = setTimeout(() => {
          console.log(`Simulating a long running process: ${delay}ms`, channelId);
          if(channelId != '' && currentAddress && id) {
            getChatLogList(channelId)
            console.log('Finished long running process', channelId);
          }
          timeoutId = setTimeout(CronTaskLastMessage, 10000);
        }, delay);
      };
    
      if (currentAddress && id) {
        CronTaskLastMessage();
      }
    
      return () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId)
        }
      }
    }
  }, [currentAddress, id, currentMemberStatus, channelId]);

  useEffect(() => {
    if(channelId) {
      handleChangeChannelIdModel(channelId)
    }
  }, [channelId]);
  
  const handleChangeChannelIdModel = async function (channelId: string) {
    setLoadingGetChatLogs(true)
    await getChatLogList(channelId)
    setLoadingGetChatLogs(false)
  }

  useEffect(() => {
    if(membersCounter>0) {
      handleGetAllMembers();
    }
  }, [membersCounter]);

  useEffect(() => {
    if(channelsCounter>0) {
      handleGetAllChannels();
    }
  }, [channelsCounter]);
  
  const handleAddChannelAdmin = async function (MemberId: string) {
    toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
    if(currentMemberStatus && currentMemberStatus[0] != true)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

      return
    }
    const AddAdminByMemberId = await ChivesChatAddAdmin(currentWallet.jwk, id, MemberId)
    console.log("AddAdminByMemberId", AddAdminByMemberId)
    if(AddAdminByMemberId?.msg?.Messages[0]?.Data)  {
      toast.success(t(AddAdminByMemberId?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      setMembersCounter(membersCounter + 1)
    }
  }

  const handleDelChannelAdmin = async function (MemberId: string) {
    toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
    if(currentMemberStatus && currentMemberStatus[0] != true)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

      return
    }
    const DelAdminByMemberId = await ChivesChatDelAdmin(currentWallet.jwk, id, MemberId)
    console.log("AddAdminByMemberId", DelAdminByMemberId)
    if(DelAdminByMemberId?.msg?.Messages[0]?.Data)  {
      toast.success(t(DelAdminByMemberId?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      setMembersCounter(membersCounter + 1)
    }
  }

  const handleInviteMember = async function () {
    toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
    if(currentMemberStatus && currentMemberStatus[0] != true)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

      return
    }
    const ChivesChatAddInvitesUserOne = await ChivesChatAddInvites(currentWallet.jwk, id, valueMembersInvite.replace(/\n/g, '\\n'), "Invite Member", "Hope you join this chatroom")
    console.log("ChivesChatAddInvitesUserOne", ChivesChatAddInvitesUserOne)
    if(ChivesChatAddInvitesUserOne?.msg?.Messages[0]?.Data)  {
      toast.success(t(ChivesChatAddInvitesUserOne?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
    }
  }

  const handleApplicantMember = async function (Applicants: string, Action: string) {
    toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
    if(currentMemberStatus && currentMemberStatus[0] != true)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

      return
    }

    //Clearn the local var
    const ApplicantsList = Applicants.split("****")
    const ApplicantsTemp = getChivesChatGetMembers[2] ?? {}
    const ApplicantsTempNew: any = {}
    if(ApplicantsTemp && ApplicantsList && ApplicantsList.length > 0)  {
      Object.values(ApplicantsTemp).map((item: any)=>{
        if(!ApplicantsList.includes(item.MemberId)) {
          ApplicantsTempNew[item.MemberId] = item
        }
      })
      setGetChivesChatGetMembers([getChivesChatGetMembers[0], getChivesChatGetMembers[1], ApplicantsTempNew])
    }

    if(Action == 'Accept')  {
      const ChivesChatApprovalApplyMembers = await ChivesChatApprovalApply(currentWallet.jwk, id, Applicants, "Applicant Member", "Administrator approval your request")
      console.log("ChivesChatApprovalApplyMembers", ChivesChatApprovalApplyMembers)
      if(ChivesChatApprovalApplyMembers?.msg?.Messages[0]?.Data)  {
        toast.success(t(ChivesChatApprovalApplyMembers?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
        setMembersCounter(membersCounter + 1)
      }
    }
    if(Action == 'Refuse')  {
      const ChivesChatRefuseApplyMembers = await ChivesChatRefuseApply(currentWallet.jwk, id, Applicants, "Applicant Member", "Administrator approval your request")
      if(ChivesChatRefuseApplyMembers) {
        toast.success(t('Your request has been successfully executed.') as string, { duration: 2500, position: 'top-center' })
        console.log("ChivesChatRefuseApplyMembers", ChivesChatRefuseApplyMembers)
        if(ChivesChatRefuseApplyMembers?.msg?.Messages[0]?.Data)  {
          toast.success(t(ChivesChatRefuseApplyMembers?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
          setMembersCounter(membersCounter + 1)
        }
      }
    }
  }

  const handleDelMember = async function (MemberId: string) {
    if(currentMemberStatus && currentMemberStatus[0] != true)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

      return
    }
    const KictOutMemberByMemberId = await ChivesChatDelMember(currentWallet.jwk, id, MemberId)
    console.log("KictOutMemberByMemberId", KictOutMemberByMemberId)
    if(KictOutMemberByMemberId?.msg?.Messages[0]?.Data)  {
      toast.success(t(KictOutMemberByMemberId?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      setMembersCounter(membersCounter + 1)
    }
  }

  const handleBlockMember = async function (MemberId: string) {
    if(currentMemberStatus && currentMemberStatus[0] != true)  {
      toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

      return
    }
    const BlockMemberByMemberId = await ChivesChatBlockMember(currentWallet.jwk, id, MemberId)
    console.log("BlockMemberByMemberId", BlockMemberByMemberId)
    if(BlockMemberByMemberId?.msg?.Messages[0]?.Data)  {
      toast.success(t(BlockMemberByMemberId?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      setMembersCounter(membersCounter + 1)
    }
  }

  const handleGetAllMessages = async function () {
    setDownloadButtonDisable(true)
    if(channelId != '') {
      setLoadingGetChatLogs(true)
      getChatLogList(channelId)
      setLoadingGetChatLogs(false)
    }
    setDownloadButtonDisable(false)
  }

  const handleChangeChannelId = (ChannelId: string) => {
    setLoadingGetChatLogs(true)
    setChannelId(ChannelId)
    setLoadingGetChatLogs(false)
  }

  const handleGetAllMembers = async function () {
    if(currentAddress) {
      const GetAoConnectMembersData = GetAoConnectMembers(currentAddress)
      setGetChivesChatGetMembers(GetAoConnectMembersData)
    }
    if(id && currentAddress)  {
      setLoadingGetMembers(true)
      const GetChivesChatGetMembers = await ChivesChatGetMembers(id, currentAddress)
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

      //Set the Announcement as the default ChannelId
      Object.values(GetAoConnectChannelsData).map((item: any)=>{
        if(item.ChannelName == 'Announcement' && channelId == '') {
          setChannelId(item.ChannelId)
        }
      })

    }
    if(id && currentAddress)  {
      setLoadingGetChannels(true)
      const GetChivesChatGetChannels = await ChivesChatGetChannels(id, currentAddress)
      if(GetChivesChatGetChannels) {
        setGetChivesChatGetChannels(GetChivesChatGetChannels)
        SetAoConnectChannels(currentAddress, GetChivesChatGetChannels)

        //Set the Announcement as the default ChannelId
        Object.values(GetChivesChatGetChannels).map((item: any)=>{
          if(item.ChannelName == 'Announcement' && channelId == '') {
            setChannelId(item.ChannelId)
          }
        })

      }
      setLoadingGetChannels(false)
    }
  }

  const getChatLogList = async function (channelId: string) {
    if(id && currentAddress) {

      const ChivesChatGetChatRecordsData = await ChivesChatGetChatRecords(id, currentAddress, channelId, '1', '9')
      SaveChatRecordsToStorage(ChivesChatGetChatRecordsData[0], currentAddress, true)

      const GetChatRecordsFromLocalStorageData = GetChatRecordsFromLocalStorage(currentAddress, channelId, 0, 20)
      
      console.log("GetChatRecordsFromLocalStorageData", GetChatRecordsFromLocalStorageData)
      if(true)  {
        const ChatChatInitList = ChatChatInit(GetChatRecordsFromLocalStorageData, app.systemPrompt, currentAddress)
        const selectedChat = {
          "chat": {
              "id": 1,
              "userId": currentAddress,
              "unseenMsgs": 0,
              "chat": ChatChatInitList
          }
        }
        const storeInit = {
          "chats": [],
          "userProfile": {
              "id": currentAddress,
              "avatar": '/images/avatars/' + ((currentAddress.charAt(0).charCodeAt(0)%8)+1) + '.png',
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

  const handleAddOrEditOrDelChannel = async function (Action: string, ChannelId = '') {
    console.log("Action", Action, openChannelEdit)
    if(Action == 'Add')  {
      toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
      if(currentMemberStatus && currentMemberStatus[0] != true)  {
        toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

        return
      }
      const AddChannel = await ChivesChatAddChannel(currentWallet.jwk, id, openChannelEdit.Channel.ChannelId, openChannelEdit.Channel.ChannelName, openChannelEdit.Channel.ChannelGroup, openChannelEdit.Channel.ChannelSort ?? '999', openChannelEdit.Channel.ChannelIntro, "Owner")
      console.log("handleEditOrEditOrDelChannel AddChannel", AddChannel)
      if(AddChannel?.msg?.Messages[0]?.Data)  {
        toast.success(t(AddChannel?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
        setChannelsCounter(channelsCounter + 1)
      }
    }

    else if(Action == 'Edit')  {
      toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
      if(currentMemberStatus && currentMemberStatus[0] != true)  {
        toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

        return
      }
      const EditChannel = await ChivesChatEditChannel(currentWallet.jwk, id, openChannelEdit.Channel.ChannelId, openChannelEdit.Channel.ChannelName, openChannelEdit.Channel.ChannelGroup, openChannelEdit.Channel.ChannelSort ?? '999', openChannelEdit.Channel.ChannelIntro, "Owner")
      console.log("handleEditOrEditOrDelChannel EditChannel", EditChannel)
      if(EditChannel?.msg?.Messages[0]?.Data)  {
        toast.success(t(EditChannel?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
        setChannelsCounter(channelsCounter + 1)
      }
    }

    else if(Action == 'Del')  {
      toast.success(t('Your request is currently being processed.') as string, { duration: 2500, position: 'top-center' })
      if(currentMemberStatus && currentMemberStatus[0] != true)  {
        toast.error(t('You are not a owner') as string, { duration: 2500, position: 'top-center' })

        return
      }
      const DelChannel = await ChivesChatDelChannel(currentWallet.jwk, id, ChannelId)
      console.log("handleEditOrEditOrDelChannel DelChannel", DelChannel)
      if(DelChannel?.msg?.Messages[0]?.Data)  {
        toast.success(t(DelChannel?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
        setChannelsCounter(channelsCounter + 1)
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
  
  const handleChivesChatApplyJoin = async function () {
    setSendButtonDisable(true)
    const ChivesChatUserApplyJoin = await ChivesChatApplyJoin(currentWallet.jwk, id, "User" + myAoConnectTxId.substring(0, 6), "Hope join this chatroom")
    if(ChivesChatUserApplyJoin) {
      console.log("ChivesChatUserApplyJoin", ChivesChatUserApplyJoin)
      setCounter(counter+1)
      if(ChivesChatUserApplyJoin.status == 'error' && ChivesChatUserApplyJoin.msg)  {
        toast.success(t(ChivesChatUserApplyJoin.msg) as string, { duration: 2500, position: 'top-center' })
      }
      if(ChivesChatUserApplyJoin?.msg?.Messages[0]?.Data)  {
        const formatText = ChivesChatUserApplyJoin?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
        toast.success(t(formatText) as string, { duration: 2500, position: 'top-center' })

      }
    }

    setSendButtonDisable(false)
  }


  // ** Hooks
  //const hidden = false

  const sendMsg = async (Obj: any) => {
    console.log("SendMessageToChatroomDataUserOne", Obj)
    if(currentAddress && t) {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      setRefreshChatCounter(refreshChatCounter + 1)

      const currentTimestampWithOffset: number = Date.now();
      const currentTimezoneOffset: number = new Date().getTimezoneOffset();
      const currentTimestampInZeroUTC: number = currentTimestampWithOffset + (currentTimezoneOffset * 60 * 1000);
      
      const SendMessageToChatroomDataUserOne = await SendMessageToChivesChat(currentWallet.jwk, id, channelId, Obj.message)
      console.log("SendMessageToChatroomDataUserOne", SendMessageToChatroomDataUserOne)
      if(SendMessageToChatroomDataUserOne && SendMessageToChatroomDataUserOne.NanoId && SendMessageToChatroomDataUserOne.NanoId) {
        const messageInfor = {
          Sender: currentAddress,
          NanoId: SendMessageToChatroomDataUserOne.NanoId,
          messages: [
            {
              Timestamp: String(currentTimestampInZeroUTC),
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
        console.log("SendMessageToChatroomDataUserOne.NanoId", SendMessageToChatroomDataUserOne)
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

      {currentMemberStatus && (currentMemberStatus[0] == true || currentMemberStatus[1] == true || currentMemberStatus[2] == true) && (
        <Fragment>
          <ChannelsList
            store={store}
            hidden={hidden}
            mdAbove={mdAbove}
            statusObj={statusObj}
            userStatus={userStatus}
            channelId={channelId}
            handleChangeChannelId={handleChangeChannelId}
            channelsListWidth={channelsListWidth}
            getChivesChatGetChannels={getChivesChatGetChannels}
            leftSidebarOpen={leftSidebarOpen}
            userProfileLeftOpen={userProfileLeftOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            loadingGetChannels={loadingGetChannels}
            isOwner={currentMemberStatus[0] ? true : false}
            setOpenChannelEdit={setOpenChannelEdit}
            handleAddOrEditOrDelChannel={handleAddOrEditOrDelChannel}
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
            myAoConnectTxId={myAoConnectTxId}
            setMember={setMember}
            setUserProfileRightOpen={setUserProfileRightOpen}
            allMembers={allMembers}
            loadingGetChatLogs={loadingGetChatLogs}
          />
          <MembersList
            id={id}
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
            handleDelMember={handleDelMember}
            handleBlockMember={handleBlockMember}
            isOwner={currentMemberStatus[0] ? true : false}
            app={app}
            setOpenMembersInvite={setOpenMembersInvite}
            setOpenMembersApplicant={setOpenMembersApplicant}
            valueMembersApplicant={valueMembersApplicant}
            setValueMembersApplicant={setValueMembersApplicant}
            currentAddress={currentAddress}
          />
        </Fragment>
      )}

      {currentMemberStatus && (currentMemberStatus[0]!=true && currentMemberStatus[1]!=true && currentMemberStatus[2]!=true) && (
        <Fragment>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <CustomAvatar
                      src={GetChatroomAvatarData}
                      variant='rounded'
                      alt={app.id}
                      sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                    />
                    <Typography variant='h6' sx={{ mb: 4 }}>
                      {app.name}
                    </Typography>
                    <Typography sx={{ mr: 2, mb: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                      ChatroomId: {app.id}
                    </Typography>
                    <Typography sx={{ mr: 2, mb: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                      Address: {currentAddress}
                    </Typography>
                    {currentMemberStatus[3]==false && (
                      <Button sx={{textTransform: 'none', }} variant='contained' onClick={
                          () => { handleChivesChatApplyJoin() }
                      }>
                      {t('Join in')}
                      </Button>
                    )}
                    {currentMemberStatus[3]==true && (
                      <Button sx={{textTransform: 'none', }} variant='contained' disabled>
                      {t('Waiting approval')}
                      </Button>
                    )}
                    {currentMemberStatus[3]==null && (
                      <CircularProgress size={40}/>
                    )}
                </CardContent>
                
                <CardContent>
                  <Typography variant='h6'>{`${t(`Introduction`)}`}</Typography>
                  <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
                  <Box sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Name`)}`}:</Typography>
                      <Typography variant='body2'>{app?.inputName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Email`)}`}:</Typography>
                      <Typography variant='body2'>{app?.inputEmail}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Twitter`)}`}:</Typography>
                      <Typography variant='body2'>{app?.inputTwitter}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Github`)}`}:</Typography>
                      <Typography variant='body2'>{app?.inputGithub}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Fragment>
      )}
      
      
      <UserProfileRight
        member={member}
        hidden={hidden}
        statusObj={statusObj}
        membersListWidth={(membersListWidth+200)}
        userProfileRightOpen={userProfileRightOpen}
        handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
      />

      <MembersInvite openMembersInvite={openMembersInvite} setOpenMembersInvite={setOpenMembersInvite} valueMembersInvite={valueMembersInvite} setValueMembersInvite={setValueMembersInvite} handleInviteMember={handleInviteMember} />
      
      <MembersApplicant openMembersApplicant={openMembersApplicant} setOpenMembersApplicant={setOpenMembersApplicant} valueMembersApplicant={valueMembersApplicant} setValueMembersApplicant={setValueMembersApplicant} handleApplicantMember={handleApplicantMember} />

      <ChannelEdit openChannelEdit={openChannelEdit} setOpenChannelEdit={setOpenChannelEdit} handleAddOrEditOrDelChannel={handleAddOrEditOrDelChannel} />
      
      </Box>
    </Fragment>
  )
}


//AppChat.contentHeightFixed = true

export default AppChat
