// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { getNanoid } from 'src/functions/string.tools'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintChivesChat, GetChivesChatAdmins, GetChivesChatMembersByOwner, GetChivesChatInvites, 
  ChivesChatAddAdmin, ChivesChatDelAdmin, ChivesChatAddInvite, ChivesChatAddMember, ChivesChatDelMember, ChivesChatAddChannel, ChivesChatGetChannels, ChivesChatAgreeInvite, ChivesChatRefuseInvite, ChivesChatApplyJoin, ChivesChatGetApplicants,ChivesChatApprovalApply, ChivesChatRefuseApply } from 'src/functions/AoConnect/ChivesChat'
import { ansiRegex } from 'src/configs/functions'

const ChivesChat = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()

  const handleSimulatedChivesChat = async function () {
    
    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)
    setToolInfo(null)
    
    setToolInfo((prevState: any)=>({
      ...prevState,
      'Create Chatroom and other 5 users': 'Chatroom, AdminOne, AdminTwo, UserOne, UserTwo, UserThree'
    }))

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

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Wait seconds': '5s'
    }))
    setToolInfo((prevState: any)=>({
      ...prevState,
      'Loading LoadBlueprint ChivesChat': '....................................................'
    }))

    await sleep(5000)

    //setTimeout(async () => {
    
    let LoadBlueprintChivesChat: any = await AoLoadBlueprintChivesChat(currentWallet.jwk, currentAddress, ChivesChatProcessTxId);
    while(LoadBlueprintChivesChat && LoadBlueprintChivesChat.status == 'ok' && LoadBlueprintChivesChat.msg && LoadBlueprintChivesChat.msg.error)  {
      sleep(6000)
      LoadBlueprintChivesChat = await AoLoadBlueprintChivesChat(currentWallet.jwk, currentAddress, ChivesChatProcessTxId);
      console.log("handleSimulatedToken LoadBlueprintChivesChat:", LoadBlueprintChivesChat);
    }
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

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Admin Role': '....................................................'
    }))
    
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

    await sleep(500)

    await ChivesChatAddMember(currentWallet.jwk, ChivesChatProcessTxId, AdminOne, "AdminOne", "AdminOne Reason")
    const ChivesChatAddAdminOne = await ChivesChatAddAdmin(currentWallet.jwk, ChivesChatProcessTxId, AdminOne)
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

    await sleep(500)

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

    await sleep(500)

    await ChivesChatAddMember(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo, "AdminTwo", "AdminTwo Reason")
    const ChivesChatAddAdminTwo = await ChivesChatAddAdmin(currentWallet.jwk, ChivesChatProcessTxId, AdminTwo)
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

    await sleep(500)

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

    await sleep(500)

    const ChivesChatDelAdminOne = await ChivesChatDelAdmin(currentWallet.jwk, ChivesChatProcessTxId, AdminOne)
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

    await sleep(500)

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

    await sleep(500)

    


    
    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Channel': '....................................................'
    }))

    const ChivesChatAddChannel1 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, getNanoid(43), "Announcement", "Welcome", "1", "Intro", "Owner")
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

    await sleep(500)

    const ChivesChatAddChannel2 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, getNanoid(43), "Rules", "Welcome", "2", "Intro", "Owner")
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

    await sleep(500)

    const ChivesChatAddChannel3 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, getNanoid(43), "Introduction", "Introduction", "3", "Intro", "")
    if(ChivesChatAddChannel3) {
      console.log("ChivesChatAddChannel3", ChivesChatAddChannel3)
      if(ChivesChatAddChannel3?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddChannel3?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAddChannel3: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAddChannel3: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatAddChannel4 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, getNanoid(43), "Community", "Community", "4", "Intro", "")
    if(ChivesChatAddChannel4) {
      console.log("ChivesChatAddChannel4", ChivesChatAddChannel4)
      if(ChivesChatAddChannel4?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddChannel4?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAddChannel4: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAddChannel4: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)
       
    const ChivesChatAddChannel5 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, getNanoid(43), "Support", "Community", "5", "Intro", "")
    if(ChivesChatAddChannel5) {
      console.log("ChivesChatAddChannel5", ChivesChatAddChannel5)
      if(ChivesChatAddChannel5?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddChannel5?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAddChannel5: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAddChannel5: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatAddChannel6 = await ChivesChatAddChannel(currentWallet.jwk, ChivesChatProcessTxId, getNanoid(43), "Admin Team", "Administrators", "6", "Intro", "Owner,Admin")
    if(ChivesChatAddChannel6) {
      console.log("ChivesChatAddChannel6", ChivesChatAddChannel6)
      if(ChivesChatAddChannel6?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddChannel6?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAddChannel6: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, ChivesChatProcessTxId)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAddChannel6: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatGetChannelsData = await ChivesChatGetChannels(ChivesChatProcessTxId, UserOne)
    if(ChivesChatGetChannelsData) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesChatGetChannelsData(2 channels)': JSON.stringify(ChivesChatGetChannelsData)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Invite': '....................................................'
    }))

    //Admin add or del member
    const ChivesChatAddInviteUserOne = await ChivesChatAddInvite(currentWallet.jwk, ChivesChatProcessTxId, UserOne, "UserOne", "Hope join this chatroom")
    if(ChivesChatAddInviteUserOne) {
      console.log("ChivesChatAddInviteUserOne", ChivesChatAddInviteUserOne)
      if(ChivesChatAddInviteUserOne?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddInviteUserOne?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAddInviteUserOne: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAddInviteUserOne: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatAddInviteUserTwo = await ChivesChatAddInvite(currentWallet.jwk, ChivesChatProcessTxId, UserTwo, "UserTwo", "Interesting This Chatroom")
    if(ChivesChatAddInviteUserTwo) {
      console.log("ChivesChatAddInviteUserTwo", ChivesChatAddInviteUserTwo)
      if(ChivesChatAddInviteUserTwo?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddInviteUserTwo?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAddInviteUserTwo: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAddInviteUserTwo: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatAddInviteUserThree = await ChivesChatAddInvite(currentWallet.jwk, ChivesChatProcessTxId, UserThree, "UserThree", "Interesting This Chatroom")
    if(ChivesChatAddInviteUserThree) {
      console.log("ChivesChatAddInviteUserThree", ChivesChatAddInviteUserThree)
      if(ChivesChatAddInviteUserThree?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAddInviteUserThree?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAddInviteUserThree: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAddInviteUserThree: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const GetChivesChatInvitesList1st = await GetChivesChatInvites(currentWallet.jwk, ChivesChatProcessTxId)
    if(GetChivesChatInvitesList1st) {
      console.log("GetChivesChatInvitesList1st", GetChivesChatInvitesList1st)
      if(GetChivesChatInvitesList1st?.msg?.Output?.data?.output)  {
        const formatText = GetChivesChatInvitesList1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'GetChivesChatInvitesList1st(3 Invites)': formatText
        }))
      }
    }

    await sleep(500)
    
    const ChivesChatUserOneAgreeInvite = await ChivesChatAgreeInvite(currentWallet.jwk, UserOne)
    if(ChivesChatUserOneAgreeInvite) {
      console.log("ChivesChatUserOneAgreeInvite", ChivesChatUserOneAgreeInvite)
      if(ChivesChatUserOneAgreeInvite?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatUserOneAgreeInvite?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatUserOneAgreeInvite: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserOne)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatUserOneAgreeInvite: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatUserTwoRefuseInvite = await ChivesChatRefuseInvite(currentWallet.jwk, UserTwo)
    if(ChivesChatUserTwoRefuseInvite) {
      console.log("ChivesChatUserTwoRefuseInvite", ChivesChatUserTwoRefuseInvite)
      if(ChivesChatUserTwoRefuseInvite?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatUserTwoRefuseInvite?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatUserTwoRefuseInvite: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatUserTwoRefuseInvite: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)
    
    const GetChivesChatInvitesList2nd = await GetChivesChatInvites(currentWallet.jwk, ChivesChatProcessTxId)
    if(GetChivesChatInvitesList2nd) {
      console.log("GetChivesChatInvitesList2nd", GetChivesChatInvitesList2nd)
      if(GetChivesChatInvitesList2nd?.msg?.Output?.data?.output)  {
        const formatText = GetChivesChatInvitesList2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'GetChivesChatInvitesList2nd(1 invite, Left UserThree)': formatText
        }))
      }
    }

    await sleep(500)

    const ChivesChatUserThreeRefuseInvite = await ChivesChatRefuseInvite(currentWallet.jwk, UserThree)
    if(ChivesChatUserThreeRefuseInvite) {
      console.log("ChivesChatUserThreeRefuseInvite", ChivesChatUserThreeRefuseInvite)
      if(ChivesChatUserThreeRefuseInvite?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatUserThreeRefuseInvite?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatUserThreeRefuseInvite: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserThree)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatUserThreeRefuseInvite: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const GetChivesChatInvites3nd = await GetChivesChatInvites(currentWallet.jwk, ChivesChatProcessTxId)
    if(GetChivesChatInvites3nd) {
      console.log("GetChivesChatInvites3nd", GetChivesChatInvites3nd)
      if(GetChivesChatInvites3nd?.msg?.Output?.data?.output)  {
        const formatText = GetChivesChatInvites3nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'GetChivesChatInvites3nd(Empty)': formatText
        }))
      }
    }

    await sleep(500)

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

    await sleep(500)

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Apply': '....................................................'
    }))

    const ChivesChatUserTwoApplyJoin = await ChivesChatApplyJoin(currentWallet.jwk, ChivesChatProcessTxId, "UserTwo", "Hope join this chatroom")
    if(ChivesChatUserTwoApplyJoin) {
      console.log("ChivesChatUserTwoApplyJoin", ChivesChatUserTwoApplyJoin)
      if(ChivesChatUserTwoApplyJoin?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatUserTwoApplyJoin?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatUserTwoApplyJoin: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatUserTwoApplyJoin: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatUserThreeApplyJoin = await ChivesChatApplyJoin(currentWallet.jwk, ChivesChatProcessTxId, "UserThree", "Hope join this chatroom")
    if(ChivesChatUserThreeApplyJoin) {
      console.log("ChivesChatUserThreeApplyJoin", ChivesChatUserThreeApplyJoin)
      if(ChivesChatUserThreeApplyJoin?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatUserThreeApplyJoin?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatUserThreeApplyJoin: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserThree)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatUserThreeApplyJoin: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatGetApplicants1st = await ChivesChatGetApplicants(ChivesChatProcessTxId, AdminTwo)
    if(ChivesChatGetApplicants1st) {
      console.log("ChivesChatGetApplicants1st", ChivesChatGetApplicants1st)
      if(ChivesChatGetApplicants1st?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatGetApplicants1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'ChivesChatGetApplicants1st(UserTwo and UserThree)': formatText
        }))
      }
    }

    await sleep(500)

    const ChivesChatAdminTwoApprovalApplyUserTwo = await ChivesChatApprovalApply(currentWallet.jwk, ChivesChatProcessTxId, UserTwo, "UserTwo", "ChivesChatAdminTwoApprovalApplyUserTwo")
    if(ChivesChatAdminTwoApprovalApplyUserTwo) {
      console.log("ChivesChatAdminTwoApprovalApplyUserTwo", ChivesChatAdminTwoApprovalApplyUserTwo)
      if(ChivesChatAdminTwoApprovalApplyUserTwo?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAdminTwoApprovalApplyUserTwo?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdminTwoApprovalApplyUserTwo: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAdminTwoApprovalApplyUserTwo: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatGetApplicants2st = await ChivesChatGetApplicants(ChivesChatProcessTxId, AdminTwo)
    if(ChivesChatGetApplicants2st) {
      console.log("ChivesChatGetApplicants2st", ChivesChatGetApplicants2st)
      if(ChivesChatGetApplicants2st?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatGetApplicants2st?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'ChivesChatGetApplicants2st(Left UserThree)': formatText
        }))
      }
    }

    await sleep(500)

    const ChivesChatAdminTwoRefuseApplyUserThree = await ChivesChatRefuseApply(currentWallet.jwk, ChivesChatProcessTxId, UserThree, "UserThree", "ChivesChatAdminTwoRefuseApplyUserThree")
    if(ChivesChatAdminTwoRefuseApplyUserThree) {
      console.log("ChivesChatAdminTwoRefuseApplyUserThree", ChivesChatAdminTwoRefuseApplyUserThree)
      if(ChivesChatAdminTwoRefuseApplyUserThree?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAdminTwoRefuseApplyUserThree?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdminTwoRefuseApplyUserThree: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAdminTwoRefuseApplyUserThree: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(500)

    const ChivesChatGetApplicants3st = await ChivesChatGetApplicants(ChivesChatProcessTxId, AdminTwo)
    if(ChivesChatGetApplicants3st) {
      console.log("ChivesChatGetApplicants3st", ChivesChatGetApplicants3st)
      if(ChivesChatGetApplicants3st?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatGetApplicants3st?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'ChivesChatGetApplicants3st(Empty)': formatText
        }))
      }
    }

    await sleep(500)

    const GetChivesChatMembersByOwner2st = await GetChivesChatMembersByOwner(currentWallet.jwk, ChivesChatProcessTxId)
    if(GetChivesChatMembersByOwner2st) {
      console.log("GetChivesChatMembersByOwner2st", GetChivesChatMembersByOwner2st)
      if(GetChivesChatMembersByOwner2st?.msg?.Output?.data?.output)  {
        const formatText = GetChivesChatMembersByOwner2st?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'GetChivesChatMembersByOwner2st(2 members, UserOne and UserTwo)': formatText
        }))
      }
    }

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Members': '....................................................'
    }))

    const UserFour = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserFour) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserFour: UserFour
      }))
    }

    const UserFive = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserFive) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserFive: UserFive
      }))
    }

    //Admin add or del member
    const ChivesChatAdminTwoAddUserFour = await ChivesChatAddMember(currentWallet.jwk, ChivesChatProcessTxId, UserFour, "UserFour", "UserFour Reason")
    if(ChivesChatAdminTwoAddUserFour) {
      console.log("ChivesChatAdminTwoAddUserFour", ChivesChatAdminTwoAddUserFour)
      if(ChivesChatAdminTwoAddUserFour?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAdminTwoAddUserFour?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdminTwoAddUserFour: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAdminTwoAddUserFour: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesChatAdminTwoAddUserFive = await ChivesChatAddMember(currentWallet.jwk, ChivesChatProcessTxId, UserFive, "UserFive", "UserFive Reason")
    if(ChivesChatAdminTwoAddUserFive) {
      console.log("ChivesChatAdminTwoAddUserFive", ChivesChatAdminTwoAddUserFive)
      if(ChivesChatAdminTwoAddUserFive?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAdminTwoAddUserFive?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdminTwoAddUserFive: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAdminTwoAddUserFive: formatText2
              }))
            }
          }

        }

      }
    }

    const GetChivesChatMembersByOwner3rd = await GetChivesChatMembersByOwner(currentWallet.jwk, ChivesChatProcessTxId)
    if(GetChivesChatMembersByOwner3rd) {
      console.log("GetChivesChatMembersByOwner3rd", GetChivesChatMembersByOwner3rd)
      if(GetChivesChatMembersByOwner3rd?.msg?.Output?.data?.output)  {
        const formatText = GetChivesChatMembersByOwner3rd?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'GetChivesChatMembersByOwner3rd(4 members, UserOne, UserTwo, UserFour, UserFive)': formatText
        }))
      }
    }

    const ChivesChatAdminTwoDelUserFive = await ChivesChatDelMember(currentWallet.jwk, ChivesChatProcessTxId, UserFive)
    if(ChivesChatAdminTwoDelUserFive) {
      console.log("ChivesChatAdminTwoDelUserFive", ChivesChatAdminTwoDelUserFive)
      if(ChivesChatAdminTwoDelUserFive?.msg?.Output?.data?.output)  {
        const formatText = ChivesChatAdminTwoDelUserFive?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesChatAdminTwoDelUserFive: formatText
          }))

          //Read message from inbox
          const AdminOneInboxData = await GetMyLastMsg(currentWallet.jwk, AdminTwo)
          if(AdminOneInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AdminOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesChatAdminTwoDelUserFive: formatText2
              }))
            }
          }

        }

      }
    }

    const GetChivesChatMembersByOwner4th = await GetChivesChatMembersByOwner(currentWallet.jwk, ChivesChatProcessTxId)
    if(GetChivesChatMembersByOwner4th) {
      console.log("GetChivesChatMembersByOwner4th", GetChivesChatMembersByOwner4th)
      if(GetChivesChatMembersByOwner4th?.msg?.Output?.data?.output)  {
        const formatText = GetChivesChatMembersByOwner4th?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'GetChivesChatMembersByOwner4th(3 members, UserOne, UserTwo, UserFour)': formatText
        }))
      }
    }


    await sleep(500)
    
    //Delay 1s code end
    setIsDisabledButton(false)

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Finished': '==================================================='
    }))

    //}, 5000);


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
                  {t("Simulated ChivesChat (No Reminder)")}
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

export default ChivesChat

