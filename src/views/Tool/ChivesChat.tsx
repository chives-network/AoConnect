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

import { GetMyLastMsg, AoCreateProcessAuto } from 'src/functions/AoConnect/AoConnect'
import { ReminderMsgAndStoreToLocal } from 'src/functions/AoConnect/MsgReminder'
import { AoLoadBlueprintChivesChat, GetChivesChatAdmins, GetChivesChatMembersByOwner, GetChivesChatInvites, GetChivesChatApplicants, ChivesChatAddAdmin, ChivesChatDelAdmin, ChivesChatAddInvite, ChivesChatDelMember, ChivesChatAddChannel, ChivesChatGetChannels, ChivesChatAgreeInvite, ChivesChatRefuseInvite, ChivesChatGetMembers } from 'src/functions/AoConnect/ChivesChat'

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
            'ChivesChatAdmins1st(Empty)': formatText
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
            'ChivesChatAdmins2nd(1 Admin)': formatText
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
            'ChivesChatAdmins3rd(2 Admins)': formatText
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
            'ChivesChatAdmins4th(1 Admin, Left AdminTwo)': formatText
          }))
        }
      }

      //Admin add or del member
      const ChivesChatAddInviteOne = await ChivesChatAddInvite(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, UserOne, "UserOne", "感兴趣")
      if(ChivesChatAddInviteOne) {
        console.log("ChivesChatAddInviteOne", ChivesChatAddInviteOne)
        if(ChivesChatAddInviteOne?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddInviteOne?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddInviteOne: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddInviteOne: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAddInviteTwo = await ChivesChatAddInvite(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, UserTwo, "UserTwo", "Interesting This Chatroom")
      if(ChivesChatAddInviteTwo) {
        console.log("ChivesChatAddInviteTwo", ChivesChatAddInviteTwo)
        if(ChivesChatAddInviteTwo?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddInviteTwo?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddInviteTwo: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddInviteTwo: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAddInviteThree = await ChivesChatAddInvite(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, UserThree, "UserThree", "Interesting This Chatroom")
      if(ChivesChatAddInviteThree) {
        console.log("ChivesChatAddInviteThree", ChivesChatAddInviteThree)
        if(ChivesChatAddInviteThree?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddInviteThree?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddInviteThree: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddInviteThree: formatText2
                }))
              }
            }

          }

        }
      }

      const GetChivesChatInvites1st = await GetChivesChatInvites(currentWallet.jwk, ChivesChatProcessTxId)
      if(GetChivesChatInvites1st) {
        console.log("GetChivesChatInvites1st", GetChivesChatInvites1st)
        if(GetChivesChatInvites1st?.msg?.Output?.data?.output)  {
          const formatText = GetChivesChatInvites1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            'GetChivesChatInvites1st(3 Invites)': formatText
          }))
        }
      }
      
      const ChivesChatAgreeInviteUserOne = await ChivesChatAgreeInvite(currentWallet.jwk, ChivesChatProcessTxId, UserOne)
      if(ChivesChatAgreeInviteUserOne) {
        console.log("ChivesChatAgreeInviteUserOne", ChivesChatAgreeInviteUserOne)
        if(ChivesChatAgreeInviteUserOne?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAgreeInviteUserOne?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAgreeInviteUserOne: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserOne)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAgreeInviteUserOne: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatRefuseInviteUserTwo = await ChivesChatRefuseInvite(currentWallet.jwk, ChivesChatProcessTxId, UserTwo)
      if(ChivesChatRefuseInviteUserTwo) {
        console.log("ChivesChatRefuseInviteUserTwo", ChivesChatRefuseInviteUserTwo)
        if(ChivesChatRefuseInviteUserTwo?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatRefuseInviteUserTwo?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatRefuseInviteUserTwo: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserTwo)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatRefuseInviteUserTwo: formatText2
                }))
              }
            }

          }

        }
      }
      
      const GetChivesChatInvites2nd = await GetChivesChatInvites(currentWallet.jwk, ChivesChatProcessTxId)
      if(GetChivesChatInvites2nd) {
        console.log("GetChivesChatInvites2nd", GetChivesChatInvites2nd)
        if(GetChivesChatInvites2nd?.msg?.Output?.data?.output)  {
          const formatText = GetChivesChatInvites2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            'GetChivesChatInvites2nd(1 invite)': formatText
          }))
        }
      }

      const GetChivesChatMembersByOwner1st = await GetChivesChatMembersByOwner(currentWallet.jwk, ChivesChatProcessTxId)
      if(GetChivesChatMembersByOwner1st) {
        console.log("GetChivesChatMembersByOwner1st", GetChivesChatMembersByOwner1st)
        if(GetChivesChatMembersByOwner1st?.msg?.Output?.data?.output)  {
          const formatText = GetChivesChatMembersByOwner1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            'GetChivesChatMembersByOwner1st(1 member)': formatText
          }))
        }
      }

      /*
      const ChivesChatAddChannel1 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, ChivesChatProcessTxId, "11", "ChannelName001", "Welcome", "11", "Owner")
      if(ChivesChatAddChannel1) {
        console.log("ChivesChatAddChannel1", ChivesChatAddChannel1)
        if(ChivesChatAddChannel1?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddChannel1?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddChannel1: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddChannel1: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatAddChannel2 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, ChivesChatProcessTxId, "12", "ChannelName002", "Welcome", "12", "Owner")
      if(ChivesChatAddChannel2) {
        console.log("ChivesChatAddChannel2", ChivesChatAddChannel2)
        if(ChivesChatAddChannel2?.msg?.Output?.data?.output)  {
          const formatText = ChivesChatAddChannel2?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              ChivesChatAddChannel2: formatText
            }))

            //Read message from inbox
            const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
            if(AdminOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  ChivesChatAddChannel2: formatText2
                }))
              }
            }

          }

        }
      }

      const ChivesChatGetChannelsData = await ChivesChatGetChannels(ChivesChatProcessTxId, UserOne)
      if(ChivesChatGetChannelsData) {
        setToolInfo((prevState: any)=>({
          ...prevState,
          ChivesChatGetChannelsData: ChivesChatGetChannelsData
        }))
      }
      */

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
                  <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                      () => { handleSimulatedChivesChat() }
                  }>
                  {t("Simulated ChivesChat")}
                  </Button>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/chiveschat.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("ChivesChat Lua")}
                      </Typography>
                  </Link>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Typography noWrap variant='body2' sx={{my: 2}}>
                CurrentAddress: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography>
                </Typography>

                {toolInfo && Object.keys(toolInfo).map((Item: any, Index: number)=>{

                  return (
                    <>
                    <Tooltip title={toolInfo[Item]}>
                      <Typography noWrap variant='body2' sx={{my: 2}}>
                      {Item}: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo[Item]}</Typography>
                      </Typography>
                    </Tooltip>
                    </>
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

export default ChivesChat

