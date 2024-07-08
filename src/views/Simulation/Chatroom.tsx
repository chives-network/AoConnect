// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import Avatar from '@mui/material/Avatar'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintChatroom, GetChatroomMembers, RegisterChatroomMember, SendMessageToChatroom } from 'src/functions/AoConnect/Chatroom'
import { ReminderMsgAndStoreToLocal } from 'src/functions/AoConnect/MsgReminder'
import { ansiRegex } from 'src/configs/functions'

const Chatroom = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()

  // ** State
  //const [isLoading, setIsLoading] = useState(false);

  const CustomToast = (ContentList: any, position: string, avatar: string) => {
    return toast(
      t => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Victor Anderson' src={ ContentList['Logo'] || '/images/avatars/' + avatar } sx={{ mr: 3, width: 40, height: 40 }} />
            <div>
              <Typography>{ContentList['Data']}</Typography>
              {ContentList && ContentList['Action'] == null && ContentList['FromProcess'] && (
                <Typography variant='caption'>{ContentList['FromProcess']} Id: {ContentList['Ref_']}</Typography>
              )}
              {ContentList && ContentList['Action'] != null && (
                <Typography variant='caption'>Action: {ContentList['Action']} Id: {ContentList['Ref_']}</Typography>
              )}
            </div>
          </Box>
          <IconButton onClick={() => toast.dismiss(t.id)}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      ),
      {
        style: {
          minWidth: '550px'
        },

        //@ts-ignore
        position: position,
        duration: 4000
      }
    )
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const UserOneTxId = toolInfo?.UserOne
      if(UserOneTxId) {
        const ReminderMsgAndStoreToLocalDataUserOne = UserOneTxId && UserOneTxId.length == 43 ? await ReminderMsgAndStoreToLocal(UserOneTxId) : null
        const displayMessagesWithDelay = (messages: any[], index: number) => {
          if (index < messages.length) {
            setTimeout(() => {
              CustomToast(messages[index], 'top-left', '1.png')
              displayMessagesWithDelay(messages, index + 1);
            }, 1000);
          }
        };
        ReminderMsgAndStoreToLocalDataUserOne && displayMessagesWithDelay(ReminderMsgAndStoreToLocalDataUserOne, 0);
        console.log("ReminderMsgAndStoreToLocalDataUserOne", ReminderMsgAndStoreToLocalDataUserOne)
      }
    }, 1000 * 6 * 1);

    return () => clearInterval(intervalId);
  }, [toolInfo?.UserOne]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const UserTwoTxId = toolInfo?.UserTwo
      if(UserTwoTxId) {
        const ReminderMsgAndStoreToLocalDataUserTwo = UserTwoTxId && UserTwoTxId.length == 43 ? await ReminderMsgAndStoreToLocal(UserTwoTxId) : null
        const displayMessagesWithDelay = (messages: any[], index: number) => {
          if (index < messages.length) {
            setTimeout(() => {
              CustomToast(messages[index], 'bottom-left', '2.png')
              displayMessagesWithDelay(messages, index + 1);
            }, 1000);
          }
        };
        ReminderMsgAndStoreToLocalDataUserTwo && displayMessagesWithDelay(ReminderMsgAndStoreToLocalDataUserTwo, 0);
        console.log("ReminderMsgAndStoreToLocalDataUserTwo", ReminderMsgAndStoreToLocalDataUserTwo)
      }
    }, 1000 * 6 * 1);

    return () => clearInterval(intervalId);
  }, [toolInfo?.UserTwo]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const UserThreeTxId = toolInfo?.UserThree
      if(UserThreeTxId) {
        const ReminderMsgAndStoreToLocalDataUserThree = UserThreeTxId && UserThreeTxId.length == 43 ? await ReminderMsgAndStoreToLocal(UserThreeTxId) : null
        const displayMessagesWithDelay = (messages: any[], index: number) => {
          if (index < messages.length) {
            setTimeout(() => {
              CustomToast(messages[index], 'bottom-right', '3.png')
              displayMessagesWithDelay(messages, index + 1);
            }, 1000);
          }
        };
        ReminderMsgAndStoreToLocalDataUserThree && displayMessagesWithDelay(ReminderMsgAndStoreToLocalDataUserThree, 0);
        console.log("ReminderMsgAndStoreToLocalDataUserThree", ReminderMsgAndStoreToLocalDataUserThree)
      }
    }, 1000 * 6 * 1);

    return () => clearInterval(intervalId);
  }, [toolInfo?.UserThree]);


  const handleSimulatedChatroom = async function () {
    
    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)
    setToolInfo(null)
    
    const ChatroomProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(ChatroomProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ChatroomProcessTxId: ChatroomProcessTxId
      }))
    }

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

    setTimeout(async () => {
      
      //Delay 5s code begin

      let LoadBlueprintChatroom: any = await AoLoadBlueprintChatroom(currentWallet.jwk, ChatroomProcessTxId);
      while(LoadBlueprintChatroom && LoadBlueprintChatroom.status == 'ok' && LoadBlueprintChatroom.msg && LoadBlueprintChatroom.msg.error)  {
        sleep(6000)
        LoadBlueprintChatroom = await AoLoadBlueprintChatroom(currentWallet.jwk, ChatroomProcessTxId);
        console.log("handleSimulatedToken LoadBlueprintChatroom:", LoadBlueprintChatroom);
      }
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

      /*
      const LoadBlueprintChat: any = await AoLoadBlueprintChat(currentWallet.jwk, ChatroomProcessTxId)
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
      */

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

      const SendMessageToChatroomDataUserOne = await SendMessageToChatroom(currentWallet.jwk, ChatroomProcessTxId, UserOne, "001 Msg from UserOne ["+UserOne+"]")
      if(SendMessageToChatroomDataUserOne) {
        console.log("SendMessageToChatroomDataUserOne", SendMessageToChatroomDataUserOne)
        if(SendMessageToChatroomDataUserOne?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChatroomDataUserOne?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChatroomDataUserOne formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserOneSendMessage: formatText
          }))
        }
      }

      const SendMessageToChatroomDataUserTwo = await SendMessageToChatroom(currentWallet.jwk, ChatroomProcessTxId, UserTwo, "002 Msg from UserTwo ["+UserTwo+"]")
      if(SendMessageToChatroomDataUserTwo) {
        console.log("SendMessageToChatroomDataUserTwo", SendMessageToChatroomDataUserTwo)
        if(SendMessageToChatroomDataUserTwo?.msg?.Messages && SendMessageToChatroomDataUserTwo?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChatroomDataUserTwo?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChatroomDataUserTwo formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserTwoSendMessage: formatText
          }))
        }
      }

      const SendMessageToChatroomDataUserThree = await SendMessageToChatroom(currentWallet.jwk, ChatroomProcessTxId, UserThree, "003 Msg from UserThree ["+UserThree+"]")
      if(SendMessageToChatroomDataUserThree) {
        console.log("SendMessageToChatroomDataUserThree", SendMessageToChatroomDataUserThree)
        if(SendMessageToChatroomDataUserThree?.msg?.Messages && SendMessageToChatroomDataUserThree?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChatroomDataUserThree?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChatroomDataUserThree formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserThreeSendMessage: formatText
          }))
        }
      }
      
      //Delay 1s code end
      setIsDisabledButton(false)

    }, 5000);

    

    

  }

  return (
    <Fragment>
      {currentAddress ?
      <Grid container>
        <Grid item xs={12}>
          <Card>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button sx={{ textTransform: 'none', m: 2, }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                      () => { handleSimulatedChatroom() }
                  }>
                  {t("Simulated Chatroom")}
                  </Button>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/chatroom.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("Chatroom Lua")}
                      </Typography>
                  </Link>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Grid sx={{my: 2}}>
                  <Typography noWrap variant='body2' sx={{display: 'inline', mr: 1}}>CurrentAddress:</Typography>
                  <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography>
                </Grid>

                {toolInfo && Object.keys(toolInfo).map((Item: any, Index: number)=>{

                  return (
                    <Fragment key={Index}>
                      <Tooltip title={toolInfo[Item]}>
                        <Grid sx={{my: 2}}>
                          <Typography noWrap variant='body2' sx={{display: 'inline', mr: 1}}>{Item}:</Typography>
                          <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo[Item]}</Typography>
                        </Grid>
                      </Tooltip>
                    </Fragment>
                  )

                })}


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

export default Chatroom

