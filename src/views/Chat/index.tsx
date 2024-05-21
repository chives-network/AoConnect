// ** React Imports
import { useEffect, useState, Fragment } from 'react'

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

const processTxId = "K5P_L9KdbbvORnde7_0JXaix1Cn9_FWGfUKMjFR3GUw"

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

  const [anonymousUserId, setAnonymousUserId] = useState<string>('')
  const [userType, setUserType] = useState<string>('')
  useEffect(() => {
    const tempId = getAnonymousUserId()
    setAnonymousUserId(tempId)
  }, [])

  const getChatRoomFromGithub = async function () {
    if(processTxId)   {
      const RS = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/collection/chatroom.json', { headers: { 'Content-Type': 'application/json'} }).then(res=>res.data)
      console.log("RS",RS)
      setApp(RS)
    }
  }

  useEffect(() => {

    getChatRoomFromGithub()

  }, [refreshChatCounter])

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

export default Chat

