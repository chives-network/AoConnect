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
import { getAnonymousUserId } from 'src/functions/ChatBook'
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
      {app ?
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
        <ChatIndex app={app} />

      </Box>
      :
      null
      }
    </Fragment>
  )
}

export default memo(Chat)

