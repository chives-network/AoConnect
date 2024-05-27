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
import { AoLoadBlueprintChivesChat, GetChivesChatAdmins, GetChivesChatMembers, SendMessageToChivesChat, ChivesChatAddAdmin, ChivesChatDelAdmin, ChivesChatAddMember, ChivesChatDelMember } from 'src/functions/AoConnect/ChivesChat'

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

    const AdminOne = await AoCreateProcessAuto(currentWallet.jwk)
    if(AdminOne) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        AdminOne: AdminOne
      }))
    }

    const AdminTwo = await AoCreateProcessAuto(currentWallet.jwk)
    if(AdminTwo) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        AdminTwo: AdminTwo
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

      const ChivesChatAdmins1st = await GetChivesChatAdmins(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatAdmins1st) {
        console.log("ChivesChatAdmins1st", ChivesChatAdmins1st)
        if(ChivesChatAdmins1st?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAdmins1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdmins1st: formatText
          }))
        }
      }

      const ChivesChatAddAdminOne = await ChivesChatAddAdmin(currentWallet.jwk, ChivesChatProcessTxId, ChivesChatProcessTxId, AdminOne)
      if(ChivesChatAddAdminOne) {
        console.log("ChivesChatAddAdminOne", ChivesChatAddAdminOne)
        if(ChivesChatAddAdminOne?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddAdminOne?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddAdminOne: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddAdminOne: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAdmins2nd = await GetChivesChatAdmins(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatAdmins2nd) {
        console.log("ChivesChatAdmins2nd", ChivesChatAdmins2nd)
        if(ChivesChatAdmins2nd?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAdmins2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdmins2nd: formatText
          }))
        }
      }

      const ChivesChatAddAdminTwo = await ChivesChatAddAdmin(currentWallet.jwk, ChivesChatProcessTxId, ChivesChatProcessTxId, AdminTwo)
      if(ChivesChatAddAdminTwo) {
        console.log("ChivesChatAddAdminTwo", ChivesChatAddAdminTwo)
        if(ChivesChatAddAdminTwo?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddAdminTwo?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddAdminTwo: formatText
            }))

            //Read message from inbox
            const AdminTwoInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
            if(AdminTwoInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddAdminTwo: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAdmins3rd = await GetChivesChatAdmins(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatAdmins3rd) {
        console.log("ChivesChatAdmins3rd", ChivesChatAdmins3rd)
        if(ChivesChatAdmins3rd?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAdmins3rd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdmins3rd: formatText
          }))
        }
      }

      const ChivesChatDelAdminOne = await ChivesChatDelAdmin(currentWallet.jwk, ChivesChatProcessTxId, ChivesChatProcessTxId, AdminOne)
      if(ChivesChatDelAdminOne) {
        console.log("ChivesChatDelAdminOne", ChivesChatDelAdminOne)
        if(ChivesChatDelAdminOne?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatDelAdminOne?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatDelAdminOne: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatDelAdminOne: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAdmins4th = await GetChivesChatAdmins(currentWallet.jwk, ChivesChatProcessTxId)
      if(ChivesChatAdmins4th) {
        console.log("ChivesChatAdmins4th", ChivesChatAdmins4th)
        if(ChivesChatAdmins4th?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAdmins4th?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdmins4th: formatText
          }))
        }
      }

      //Admin add or del member
      const ChivesChatAddMemberOne = await ChivesChatAddMember(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, UserOne)
      if(ChivesChatAddMemberOne) {
        console.log("ChivesChatAddMemberOne", ChivesChatAddMemberOne)
        if(ChivesChatAddMemberOne?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddMemberOne?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddMemberOne: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddMemberOne: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAddMemberTwo = await ChivesChatAddMember(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, UserTwo)
      if(ChivesChatAddMemberTwo) {
        console.log("ChivesChatAddMemberTwo", ChivesChatAddMemberTwo)
        if(ChivesChatAddMemberTwo?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddMemberTwo?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddMemberTwo: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddMemberTwo: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAddMemberThree = await ChivesChatAddMember(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, UserThree)
      if(ChivesChatAddMemberThree) {
        console.log("ChivesChatAddMemberThree", ChivesChatAddMemberThree)
        if(ChivesChatAddMemberThree?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddMemberThree?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddMemberThree: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddMemberThree: formatText2
                }))
              }
            }

          }

        }
      }

      const GetChivesChatMembers1st = await GetChivesChatMembers(currentWallet.jwk, ChivesChatProcessTxId)
      if(GetChivesChatMembers1st) {
        console.log("GetChivesChatMembers1st", GetChivesChatMembers1st)
        if(GetChivesChatMembers1st?.msg?.Output?.data?.output)  {
          const formatText = GetChivesChatMembers1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            GetChivesChatMembers1st: formatText
          }))
        }
      }

      const ChivesChatDelMemberTwo = await ChivesChatDelMember(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, UserTwo)
      if(ChivesChatDelMemberTwo) {
        console.log("ChivesChatDelMemberTwo", ChivesChatDelMemberTwo)
        if(ChivesChatDelMemberTwo?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatDelMemberTwo?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatDelMemberTwo: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatDelMemberTwo: formatText2
                }))
              }
            }

          }

        }
      }
      
      const GetChivesChatMembers2nd = await GetChivesChatMembers(currentWallet.jwk, ChivesChatProcessTxId)
      if(GetChivesChatMembers2nd) {
        console.log("GetChivesChatMembers2nd", GetChivesChatMembers2nd)
        if(GetChivesChatMembers2nd?.msg?.Output?.data?.output)  {
          const formatText = GetChivesChatMembers2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            GetChivesChatMembers2nd: formatText
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
                AdminOne Message From: Top-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.AdminOne}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                AdminTwo Message From: Bottom-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.AdminTwo}</Typography>
                </Typography>
                

                <Tooltip title={toolInfo?.UserOne}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  UserOne ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOne}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.UserTwo}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  UserTwo ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwo}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.UserThree}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  UserThree ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThree}</Typography>
                  </Typography>
                </Tooltip>
                
                <Tooltip title={toolInfo?.LoadBlueprintChivesChat}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  .load-blueprint chiveschat: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.LoadBlueprintChivesChat}</Typography>
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Admins(Empty): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAdmins1st}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                AddAdmin AdminOne : <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAddAdminOne}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Admins(1 Admin): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAdmins2nd}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                AddAdmin AdminTwo: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAddAdminTwo}</Typography>
                </Typography>

                <Tooltip title={toolInfo?.ChivesChatMembers3rd}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Admins(2 Admins): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAdmins3rd}</Typography>
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                DelAdmin AdminOne: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatDelAdminOne}</Typography>
                </Typography>

                <Tooltip title={toolInfo?.ChivesChatAdmins4th}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Admins(1 Admins, Left AdminTwo): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAdmins4th}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.ChivesChatAddMemberOne}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Add UserOne: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAddMemberOne}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.ChivesChatAddMemberTwo}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Add UserTwo: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAddMemberTwo}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.ChivesChatAddMemberThree}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Add UserThree: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatAddMemberThree}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.GetChivesChatMembers1st}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Members in Chatroom(3 Users): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.GetChivesChatMembers1st}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.GetChivesChatMembers1st}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Delete UserTwo Using AdminTwo: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.ChivesChatDelMemberTwo}</Typography>
                  </Typography>
                </Tooltip>

                <Tooltip title={toolInfo?.GetChivesChatMembers2nd}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  Members in Chatroom(User One and Three, UserTwo was deleted): <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.GetChivesChatMembers2nd}</Typography>
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

