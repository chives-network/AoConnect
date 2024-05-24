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

import { GetMyLastMsg, AoCreateProcessAuto, AoLoadBlueprintToken, AoLoadBlueprintChat, GetTokenMembers, RegisterTokenMember, SendMessageToToken } from 'src/functions/AoConnectLib'
import { ReminderMsgAndStoreToLocal } from 'src/functions/AoConnectMsgReminder'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const Inbox = () => {
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



  const handleSimulatedToken = async function () {

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
    
    const TokenProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(TokenProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenProcessTxId: TokenProcessTxId
      }))
    }

    setTimeout(async () => {
      
      //Delay 5s code begin

      const LoadBlueprintToken = await AoLoadBlueprintToken(currentWallet.jwk, TokenProcessTxId)
      if(LoadBlueprintToken) {
        console.log("LoadBlueprintToken", LoadBlueprintToken)
        if(LoadBlueprintToken?.msg?.Output?.data?.output)  {
          const formatText = LoadBlueprintToken?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            LoadBlueprintToken: formatText
          }))
        }
      }
      console.log("LoadBlueprintToken", LoadBlueprintToken)

      const LoadBlueprintChat = await AoLoadBlueprintChat(currentWallet.jwk, TokenProcessTxId)
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

      const TokenMembers1st = await GetTokenMembers(currentWallet.jwk, TokenProcessTxId)
      if(TokenMembers1st) {
        console.log("TokenMembers1st", TokenMembers1st)
        if(TokenMembers1st?.msg?.Output?.data?.output)  {
          const formatText = TokenMembers1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenMembers1st: formatText
          }))
        }
      }

      const UserOneRegisterData = await RegisterTokenMember(currentWallet.jwk, TokenProcessTxId, UserOne)
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

      const TokenMembers2nd = await GetTokenMembers(currentWallet.jwk, TokenProcessTxId)
      if(TokenMembers2nd) {
        console.log("TokenMembers2nd", TokenMembers2nd)
        if(TokenMembers2nd?.msg?.Output?.data?.output)  {
          const formatText = TokenMembers2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenMembers2nd: formatText
          }))
        }
      }

      const UserTwoRegisterData = await RegisterTokenMember(currentWallet.jwk, TokenProcessTxId, UserTwo)
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

      const TokenMembers3rd = await GetTokenMembers(currentWallet.jwk, TokenProcessTxId)
      if(TokenMembers3rd) {
        console.log("TokenMembers3rd", TokenMembers3rd)
        if(TokenMembers3rd?.msg?.Output?.data?.output)  {
          const formatText = TokenMembers3rd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenMembers3rd: formatText
          }))
        }
      }

      const UserThreeRegisterData = await RegisterTokenMember(currentWallet.jwk, TokenProcessTxId, UserThree)
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

      const TokenMembers4th = await GetTokenMembers(currentWallet.jwk, TokenProcessTxId)
      if(TokenMembers4th) {
        console.log("TokenMembers4th", TokenMembers4th)
        if(TokenMembers4th?.msg?.Output?.data?.output)  {
          const formatText = TokenMembers4th?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenMembers4th: formatText
          }))
        }
      }

      const SendMessageToTokenDataUserOne = await SendMessageToToken(currentWallet.jwk, TokenProcessTxId, UserOne, "001 Msg from UserOne ["+UserOne+"]")
      if(SendMessageToTokenDataUserOne) {
        console.log("SendMessageToTokenDataUserOne", SendMessageToTokenDataUserOne)
        if(SendMessageToTokenDataUserOne?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToTokenDataUserOne?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToTokenDataUserOne formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserOneSendMessage: formatText
          }))
        }
      }

      const SendMessageToTokenDataUserTwo = await SendMessageToToken(currentWallet.jwk, TokenProcessTxId, UserTwo, "002 Msg from UserTwo ["+UserTwo+"]")
      if(SendMessageToTokenDataUserTwo) {
        console.log("SendMessageToTokenDataUserTwo", SendMessageToTokenDataUserTwo)
        if(SendMessageToTokenDataUserTwo?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToTokenDataUserTwo?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToTokenDataUserTwo formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserTwoSendMessage: formatText
          }))
        }
      }

      const SendMessageToTokenDataUserThree = await SendMessageToToken(currentWallet.jwk, TokenProcessTxId, UserThree, "003 Msg from UserThree ["+UserThree+"]")
      if(SendMessageToTokenDataUserThree) {
        console.log("SendMessageToTokenDataUserThree", SendMessageToTokenDataUserThree)
        if(SendMessageToTokenDataUserThree?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToTokenDataUserThree?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToTokenDataUserThree formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserThreeSendMessage: formatText
          }))
        }
      }
      


      //
      
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
                      () => { handleSimulatedToken() }
                  }>
                  {t("Simulated Token")}
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
                UserOne Message From: Top-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOne}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwo Message From: Bottom-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwo}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThree Message From: Bottom-Right ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThree}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                TokenProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenProcessTxId}</Typography>
                </Typography>
                
                <Tooltip title={toolInfo?.LoadBlueprintToken}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  .load-blueprint token: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.LoadBlueprintToken}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.LoadBlueprintChat}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  .load-blueprint chat: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.LoadBlueprintChat}</Typography>
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Members(Empty): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenMembers1st}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserOne Register: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOneRegister}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Members(1 user): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenMembers2nd}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwo Register: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwoRegister}</Typography>
                </Typography>

                <Tooltip title={toolInfo?.TokenMembers3rd}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Members(2 users): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenMembers3rd}</Typography>
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThree Register: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThreeRegister}</Typography>
                </Typography>

                <Tooltip title={toolInfo?.TokenMembers4th}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                      Members(3 users): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenMembers4th}</Typography>
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

export default Inbox

