// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'

import { formatHash, formatTimestampDateTime } from 'src/configs/functions'
import { GetMyLastMsg, AoCreateProcessAuto, AoLoadBlueprintChatroom, AoLoadBlueprintChat, GetChatroomMembers, RegisterChatroomMember, SendMessageToChatroom } from 'src/functions/AoConnectLib'
import { GetInboxMsgFromIndexedDb, GetAoConnectReminderProcessTxId } from 'src/functions/AoConnectMsgReminder'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const Inbox = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [isViewModel, setIsViewModel] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()

  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>({data:[], total:0});
  const [counter, setCounter] = useState<number>(0)

  const handleSimulatedChatroom = async function () {

    setIsDisabledButton(true)
    setToolInfo(null)

    const UserOne = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserOne) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserOne: UserOne
      }))
    }

    const UserTwo = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserTwo) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserTwo: UserTwo
      }))
    }

    const UserThree = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserThree) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserThree: UserThree
      }))
    }
    
    const ChatroomProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(ChatroomProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ChatroomProcessTxId: ChatroomProcessTxId
      }))
    }

    setTimeout(async () => {
      
      //Delay 5s code begin

      const LoadBlueprintChatroom = await AoLoadBlueprintChatroom(currentWallet.jwk, ChatroomProcessTxId)
      if(LoadBlueprintChatroom) {
        console.log("LoadBlueprintChatroom", LoadBlueprintChatroom)
        if(LoadBlueprintChatroom?.msg?.Output?.data?.output)  {
          const formatText = LoadBlueprintChatroom?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            LoadBlueprintChatroom: formatText
          }))
        }
      }
      console.log("LoadBlueprintChatroom", LoadBlueprintChatroom)

      const LoadBlueprintChat = await AoLoadBlueprintChat(currentWallet.jwk, ChatroomProcessTxId)
      if(LoadBlueprintChat) {
        console.log("LoadBlueprintChat", LoadBlueprintChat)
        if(LoadBlueprintChat?.msg?.Output?.data?.output)  {
          const formatText = LoadBlueprintChat?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            LoadBlueprintChat: formatText
          }))
        }
      }

      const ChatroomMembers1st = await GetChatroomMembers(currentWallet.jwk, ChatroomProcessTxId)
      if(ChatroomMembers1st) {
        console.log("ChatroomMembers1st", ChatroomMembers1st)
        if(ChatroomMembers1st?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers1st: formatText
          }))
        }
      }

      const UserOneRegisterData = await RegisterChatroomMember(currentWallet.jwk, ChatroomProcessTxId, UserOne)
      if(UserOneRegisterData) {
        console.log("UserOneRegisterData", UserOneRegisterData)
        if(UserOneRegisterData?.msg?.Output?.data?.output)  {
          const formatText = UserOneRegisterData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserOneRegister: formatText
            }))

            //Read message from inbox
            const UserOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserOne)
            if(UserOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserOneRegister: formatText2
                }))
              }
            }

          }

        }
      }

      const ChatroomMembers2nd = await GetChatroomMembers(currentWallet.jwk, ChatroomProcessTxId)
      if(ChatroomMembers2nd) {
        console.log("ChatroomMembers2nd", ChatroomMembers2nd)
        if(ChatroomMembers2nd?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers2nd: formatText
          }))
        }
      }

      const UserTwoRegisterData = await RegisterChatroomMember(currentWallet.jwk, ChatroomProcessTxId, UserTwo)
      if(UserTwoRegisterData) {
        console.log("UserTwoRegisterData", UserTwoRegisterData)
        if(UserTwoRegisterData?.msg?.Output?.data?.output)  {
          const formatText = UserTwoRegisterData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserTwoRegister: formatText
            }))

            //Read message from inbox
            const UserTwoInboxData = await GetMyLastMsg(currentWallet.jwk, UserTwo)
            if(UserTwoInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserTwoRegister: formatText2
                }))
              }
            }

          }

        }
      }

      const ChatroomMembers3rd = await GetChatroomMembers(currentWallet.jwk, ChatroomProcessTxId)
      if(ChatroomMembers3rd) {
        console.log("ChatroomMembers3rd", ChatroomMembers3rd)
        if(ChatroomMembers3rd?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers3rd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers3rd: formatText
          }))
        }
      }

      const UserThreeRegisterData = await RegisterChatroomMember(currentWallet.jwk, ChatroomProcessTxId, UserThree)
      if(UserThreeRegisterData) {
        console.log("UserThreeRegisterData", UserThreeRegisterData)
        if(UserThreeRegisterData?.msg?.Output?.data?.output)  {
          const formatText = UserThreeRegisterData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserThreeRegister: formatText
            }))

            //Read message from inbox
            const UserThreeInboxData = await GetMyLastMsg(currentWallet.jwk, UserThree)
            if(UserThreeInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserThreeInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserThreeRegister: formatText2
                }))
              }
            }

          }

        }
      }

      const ChatroomMembers4th = await GetChatroomMembers(currentWallet.jwk, ChatroomProcessTxId)
      if(ChatroomMembers4th) {
        console.log("ChatroomMembers4th", ChatroomMembers4th)
        if(ChatroomMembers4th?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers4th?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers4th: formatText
          }))
        }
      }


      //SendMessageToChatroom
      
      //Delay 5s code end
      setIsDisabledButton(false)

    }, 5000);

    

    

  }


  //Loading the all Inbox to IndexedDb
  useEffect(() => {
    //GetMyInboxMsgFromAoConnect()
  }, [])

  return (
    <Fragment>
      {currentAddress ?
      <Grid container>
        <Grid item xs={12}>
          <Card>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button sx={{ m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                      () => { handleSimulatedChatroom() }
                  }>
                  {t("Simulated Chatroom")}
                  </Button>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Typography noWrap variant='body2' sx={{my: 2}}>
                currentAddress: {currentAddress}
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserOne: {toolInfo?.UserOne}
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwo: {toolInfo?.UserTwo}
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThree: {toolInfo?.UserThree}
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                ChatroomProcessTxId: {toolInfo?.ChatroomProcessTxId}
                </Typography>
                
                <Tooltip title={toolInfo?.LoadBlueprintChatroom}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  .load-blueprint chatroom: {toolInfo?.LoadBlueprintChatroom}
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.LoadBlueprintChat}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  .load-blueprint chat: {toolInfo?.LoadBlueprintChat}
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Members(Empty): {toolInfo?.ChatroomMembers1st}
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserOne Register: {toolInfo?.UserOneRegister}
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Members(1 user): {toolInfo?.ChatroomMembers2nd}
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwo Register: {toolInfo?.UserTwoRegister}
                </Typography>

                <Tooltip title={toolInfo?.ChatroomMembers3rd}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Members(2 users): {toolInfo?.ChatroomMembers3rd}
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThree Register: {toolInfo?.UserThreeRegister}
                </Typography>

                <Tooltip title={toolInfo?.ChatroomMembers4th}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                      Members(3 users): {toolInfo?.ChatroomMembers4th}
                  </Typography>
                </Tooltip>
                
                <Tooltip title={toolInfo?.UserOneSendMessage}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  UserOne Send Message: {toolInfo?.UserOneSendMessage}
                  </Typography>
                </Tooltip>


              </Grid>
          </Card>
        </Grid>
      </Grid>
      :
      null
      }
    </Fragment>
  )
}

export default Inbox

