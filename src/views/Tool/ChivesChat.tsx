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
import toast from 'react-hot-toast'
import Avatar from '@mui/material/Avatar'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto } from 'src/functions/AoConnect/AoConnect'
import { ReminderMsgAndStoreToLocal } from 'src/functions/AoConnect/MsgReminder'
import { AoLoadBlueprintChivesChat, GetChivesChatMembers, RegisterChivesChatMember, SendMessageToChivesChat } from 'src/functions/AoConnect/ChivesChat'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const ChivesChat = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()

  // ** State
  const [isLoading, setIsLoading] = useState(false);

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



  const handleSimulatedChivesChat = async function () {

    setIsDisabledButton(true)
    setToolInfo(null)
    
    const ChivesChatProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(ChivesChatProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ChivesChatProcessTxId: ChivesChatProcessTxId
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

      const LoadBlueprintChivesChat = await AoLoadBlueprintChivesChat(currentWallet.jwk, ChivesChatProcessTxId)
      if(LoadBlueprintChivesChat) {
        console.log("LoadBlueprintChivesChat", LoadBlueprintChivesChat)
        if(LoadBlueprintChivesChat?.msg?.Output?.data?.output)  {
          const formatText = LoadBlueprintChivesChat?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            LoadBlueprintChivesChat: formatText
          }))
        }
      }
      console.log("LoadBlueprintChivesChat", LoadBlueprintChivesChat)

      const ChivesChatMembers1st = await GetChivesChatMembers(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatMembers1st) {
        console.log("ChivesChatMembers1st", ChivesChatMembers1st)
        if(ChivesChatMembers1st?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatMembers1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatMembers1st: formatText
          }))
        }
      }

      const UserOneRegisterData = await RegisterChivesChatMember(currentWallet.jwk, ChivesChatProcessTxId, UserOne)
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

      const ChivesChatMembers2nd = await GetChivesChatMembers(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatMembers2nd) {
        console.log("ChivesChatMembers2nd", ChivesChatMembers2nd)
        if(ChivesChatMembers2nd?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatMembers2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatMembers2nd: formatText
          }))
        }
      }

      const UserTwoRegisterData = await RegisterChivesChatMember(currentWallet.jwk, ChivesChatProcessTxId, UserTwo)
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

      const ChivesChatMembers3rd = await GetChivesChatMembers(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatMembers3rd) {
        console.log("ChivesChatMembers3rd", ChivesChatMembers3rd)
        if(ChivesChatMembers3rd?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatMembers3rd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatMembers3rd: formatText
          }))
        }
      }

      const UserThreeRegisterData = await RegisterChivesChatMember(currentWallet.jwk, ChivesChatProcessTxId, UserThree)
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

      const ChivesChatMembers4th = await GetChivesChatMembers(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatMembers4th) {
        console.log("ChivesChatMembers4th", ChivesChatMembers4th)
        if(ChivesChatMembers4th?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatMembers4th?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatMembers4th: formatText
          }))
        }
      }

      const SendMessageToChivesChatDataUserOne = await SendMessageToChivesChat(currentWallet.jwk, ChivesChatProcessTxId, UserOne, "001 Msg from UserOne ["+UserOne+"]")
      if(SendMessageToChivesChatDataUserOne) {
        console.log("SendMessageToChivesChatDataUserOne", SendMessageToChivesChatDataUserOne)
        if(SendMessageToChivesChatDataUserOne?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChivesChatDataUserOne?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChivesChatDataUserOne formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserOneSendMessage: formatText
          }))
        }
      }

      const SendMessageToChivesChatDataUserTwo = await SendMessageToChivesChat(currentWallet.jwk, ChivesChatProcessTxId, UserTwo, "002 Msg from UserTwo ["+UserTwo+"]")
      if(SendMessageToChivesChatDataUserTwo) {
        console.log("SendMessageToChivesChatDataUserTwo", SendMessageToChivesChatDataUserTwo)
        if(SendMessageToChivesChatDataUserTwo?.msg?.Messages && SendMessageToChivesChatDataUserTwo?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChivesChatDataUserTwo?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChivesChatDataUserTwo formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserTwoSendMessage: formatText
          }))
        }
      }

      const SendMessageToChivesChatDataUserThree = await SendMessageToChivesChat(currentWallet.jwk, ChivesChatProcessTxId, UserThree, "003 Msg from UserThree ["+UserThree+"]")
      if(SendMessageToChivesChatDataUserThree) {
        console.log("SendMessageToChivesChatDataUserThree", SendMessageToChivesChatDataUserThree)
        if(SendMessageToChivesChatDataUserThree?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChivesChatDataUserThree?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChivesChatDataUserThree formatText", formatText)
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
                  <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                      () => { handleSimulatedChivesChat() }
                  }>
                  {t("Simulated ChivesChat")}
                  </Button>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Typography noWrap variant='body2' sx={{my: 2}}>
                CurrentAddress: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                ChivesChatProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatProcessTxId}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserOne Message From: Top-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOne}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwo Message From: Bottom-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwo}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThree Message From: Bottom-Right ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThree}</Typography>
                </Typography>
                
                <Tooltip title={toolInfo?.LoadBlueprintChivesChat}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  .load-blueprint chiveschat: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.LoadBlueprintChivesChat}</Typography>
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Members(Empty): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatMembers1st}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserOne Register: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOneRegister}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Members(1 user): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatMembers2nd}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwo Register: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwoRegister}</Typography>
                </Typography>

                <Tooltip title={toolInfo?.ChivesChatMembers3rd}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Members(2 users): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatMembers3rd}</Typography>
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThree Register: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThreeRegister}</Typography>
                </Typography>

                <Tooltip title={toolInfo?.ChivesChatMembers4th}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                      Members(3 users): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatMembers4th}</Typography>
                  </Typography>
                </Tooltip>
                
                <Tooltip title={toolInfo?.UserOneSendMessage}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  UserOne Send Message: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOneSendMessage}</Typography>
                  </Typography>
                </Tooltip>
                
                <Tooltip title={toolInfo?.UserTwoSendMessage}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  UserTwo Send Message: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwoSendMessage}</Typography>
                  </Typography>
                </Tooltip>
                
                <Tooltip title={toolInfo?.UserThreeSendMessage}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  UserThree Send Message: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThreeSendMessage}</Typography>
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

export default ChivesChat

