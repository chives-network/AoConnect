// ** React Imports
import { useRef, useEffect, Ref, ReactNode, Fragment, memo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import { formatHash, formatTimestampLocalTime} from 'src/configs/functions';

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(3, 5, 3, 3)
}))

const ChatLog = (props: any) => {
  // ** Props
  const { t } = useTranslation()
  const { data, hidden, app, rowInMsg, maxRows, handleDeleteOneChatLogById, processingMessages, setUserProfileRightOpen, setMember, allMembers, loadingGetChatLogs } = props

  // ** Ref
  const chatArea = useRef(null)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    if (chatArea.current) {
      if (hidden) {
        // @ts-ignore
        chatArea.current.scrollTop = Number.MAX_SAFE_INTEGER
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = Number.MAX_SAFE_INTEGER
      }
    }
  }

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog: any[] | [] = []
    if (data.chat) {
      chatLog = data.chat.chat
    }

    const HaveLoadingNanoIdList: string[] = []

    const formattedChatLog: any[] = []
    let chatMessageSender = chatLog[0] ? chatLog[0].Sender : 11
    let msgGroup: any = {
      Sender: chatMessageSender,
      messages: []
    }
    chatLog.forEach((msg: any, index: number) => {
      if(msg && msg.Id) {
        HaveLoadingNanoIdList.push(msg.Id)
      }
      if (chatMessageSender === msg.Sender) {
        msgGroup.messages.push({
          Timestamp: msg.Timestamp,
          msg: msg.message,
          sender: msg.Sender,
          Id: msg.Id,
          feedback: msg.feedback
        })
      } 
      else {
        chatMessageSender = msg.Sender

        formattedChatLog.push(msgGroup)

        msgGroup = {
          Sender: msg.Sender,
          messages: [
            {
              Timestamp: msg.Timestamp,
              msg: msg.message,
              sender: msg.Sender,
              Id: msg.Id,
              feedback: msg.feedback
            }
          ]
        }
      }

      if (index === chatLog.length - 1) {
        
        formattedChatLog.push(msgGroup)
        processingMessages.map((MsgItem: any)=>{
          
          if(!HaveLoadingNanoIdList.includes(MsgItem.NanoId)) {
            formattedChatLog.push(MsgItem)
          }

        })

      }

    })

    return formattedChatLog
  }

  useEffect(() => {
    if (data && data.chat && data.chat.chat.length) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])


  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item: any, index: number, ChatItemMsgList: any[]) => {
      const isSender = item.Sender === data.userContact.id

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: index !== ChatItemMsgList.length - 1 ? 4 : undefined
          }}
        >
          {isSender ?
          <Box display="flex" alignItems="center" justifyContent="right" borderRadius="8px" p={0} mb={1} >
            <Tooltip title={item.Sender}>
              <Typography sx={{my: 0.5, mx: 1}} variant='body2'>{formatHash(item.Sender, 5)}</Typography>
            </Tooltip>
            <Tooltip title={t('Copy')}>
              <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                navigator.clipboard.writeText(item.Sender);
                toast.success(t('Copied success') as string, { duration: 1000 })
              }}>
                <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title={item.Sender}>
              <Typography sx={{my: 0.5, mx: 1}} variant='body2'>{formatTimestampLocalTime(item.messages[0].Timestamp)}</Typography>
            </Tooltip>
            <Tooltip title={t('Delete')}>
              <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                handleDeleteOneChatLogById(item.messages[0].Id)
              }}>
                <Icon icon='mdi:trash-outline' fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
              }}
              {...{
                src: data.userContact.avatar,
                alt: data.userContact.fullName
              }}
            >
              {app.name}
            </CustomAvatar>
          </Box>
          :
          <Box display="flex" alignItems="center" justifyContent="left" borderRadius="8px" p={0} mb={1} >
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
              }}
              {...{
                src: allMembers[item.Sender]?.MemberAvatar,
                alt: app.name
              }}
              onClick={
                ()=>{
                  setUserProfileRightOpen(true)
                  setMember(allMembers[item.Sender])
                }
              }
            >
              {app.name}
            </CustomAvatar>
            <Fragment>
              <Tooltip title={item.Sender}>
                <Typography sx={{my: 0.5, mx: 1}} variant='body2'>{formatHash(item.Sender, 5)}</Typography>
              </Tooltip>
              <Tooltip title={t('Copy')}>
                <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                  navigator.clipboard.writeText(item.Sender);
                  toast.success(t('Copied success') as string, { duration: 1000 })
                }}>
                  <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                </IconButton>
              </Tooltip>
              <Tooltip title={item.Sender}>
                <Typography sx={{my: 0.5, mx: 1}} variant='body2'>{formatTimestampLocalTime(item.messages[0].Timestamp)}</Typography>
              </Tooltip>
            </Fragment>

          </Box>
          }

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '100%', '100%'] }}>
            {item.messages.map((chat: any, ChatIndex: number) => {
              const ChatMsgType = 'Chat'

              return (
                <Box key={ChatIndex} sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
                    {ChatMsgType == "Chat" ?
                      <div>
                        <Typography
                        sx={{
                          boxShadow: 1,
                          borderRadius: 1,
                          width: 'fit-content',
                          fontSize: '0.875rem',
                          p: theme => theme.spacing(2.5, 2, 2.5, 2),
                          ml: isSender ? 'auto' : undefined,
                          borderTopLeftRadius: !isSender ? 0 : undefined,
                          borderTopRightRadius: isSender ? 0 : undefined,
                          color: isSender ? 'common.white' : 'text.primary',
                          backgroundColor: isSender ? 'primary.main' : 'background.paper',
                        }}
                        >
                          {chat.msg?.replace('\n', '  \n')}
                        </Typography>
                      </div>
                      :
                      null
                    }

                </Box>
              )
            })}
          </Box>
          
        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false, suppressScrollX: true }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  const inputMsgHeight = rowInMsg <= maxRows? rowInMsg * 1.25 : maxRows * 1.25

  return (
    <Fragment>
      <Box sx={{ height: `calc(100% - 6.2rem - ${inputMsgHeight}rem)` }}>
        <ScrollWrapper hidden={false}>{renderChats()}</ScrollWrapper>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingGetChatLogs}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Fragment>
  )
}

export default memo(ChatLog)
