// ** React Imports
import { useEffect, useState, Fragment, memo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import ChatIndex from 'src/views/Chat/ChatIndex'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

import { GetChatLogFromIndexedDb } from 'src/functions/AoConnectMsgReminder'

const Chat = (props: any) => {
  // ** States
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [app, setApp] = useState<any>(null)

  // ** Hooks
  const { t } = useTranslation()
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if(id && id.length == 43) {
      handlerGetChatLogFromIndexed(String(id))
      
      //Get Chatroom Detail
      const AoConnectChatRoomData = window.localStorage.getItem(authConfig.AoConnectChatRoom) || '{}';
      const AoConnectChatRoomJson = JSON.parse(AoConnectChatRoomData)
      if(AoConnectChatRoomJson) {
        const AppNew = AoConnectChatRoomJson.filter((item: any)=>item.id == id)
        if(AppNew && AppNew[0]) {
          setApp(AppNew[0])
        }
      }
    }
  }, [id])

  const handlerGetChatLogFromIndexed = async (id: string) => {
    const GetChatLogFromIndexedDbData = await GetChatLogFromIndexedDb(String(id))
    console.log("GetChatLogFromIndexedDb", GetChatLogFromIndexedDbData)
  }

  // ** Vars
  const { skin } = settings

  return (
    <Fragment>
      {id && app?
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
        <ChatIndex id={id} app={app}/>
      </Box>
      :
      null
      }
    </Fragment>
  )
}

export default memo(Chat)

