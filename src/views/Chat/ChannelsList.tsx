// ** React Imports
import { useState, useEffect, ChangeEvent, ReactNode, Fragment } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ContactType, ChatsArrType, ChatsObj, ProfileUserType } from 'src/types/apps/chatTypes'

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'

// ** Chat App Components Imports
import UserProfileLeft from 'src/views/Chat/UserProfileLeft'

import { useTranslation } from 'react-i18next'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

const MockData: { profileUser: ProfileUserType } = {
  profileUser: {
    id: 11,
    avatar: '/images/avatars/1.png',
    fullName: 'John Doe',
    role: 'admin',
    about:
      'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
    status: 'online',
    settings: {
      isTwoStepAuthVerificationEnabled: true,
      isNotificationsOn: false
    }
  }
}

const ChannelsList = (props: any) => {
  // ** Props
  const {
    hidden,
    mdAbove,
    channelsListWidth,
    getChivesChatGetChannels,
    leftSidebarOpen,
    handleLeftSidebarToggle,
  } = props

  // ** States
  const [query, setQuery] = useState<string>('')
  const [filteredChannels, setFilteredChannels] = useState<ContactType[]>([])
  const [active, setActive] = useState<null | { type: string; id: string | number }>(null)

  const { t } = useTranslation()

  // ** Hooks
  const router = useRouter()

  const handleChatClick = (type: 'chat' | 'Channel', id: number) => {
    setActive({ type, id })
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const getChivesChatGetChannelsValues = Object.values(getChivesChatGetChannels)
  getChivesChatGetChannelsValues.sort((a: any, b: any) => {
    return Number(a.ChannelSort) - Number(b.ChannelSort);
  });
  
  const getChivesChatGetChannelsMap: any = {}
  getChivesChatGetChannelsValues.map((item: any, index: number)=>{
    if(getChivesChatGetChannelsMap[item.ChannelGroup] == undefined) {
        getChivesChatGetChannelsMap[item.ChannelGroup] = []
    }
    getChivesChatGetChannelsMap[item.ChannelGroup].push(item)
  })

  const ChannelsGroupList = Object.keys(getChivesChatGetChannelsMap)

  console.log("getChivesChatGetChannelsMap", getChivesChatGetChannelsMap)


  const ChannelsListData: any[] = getChivesChatGetChannels && Object.values(getChivesChatGetChannels).map((item: any, index: number)=>{

    return {...item}

  })
  console.log("ChannelsListData", ChannelsListData)

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setActive(null)
    })

    return () => {
      setActive(null)
    }
  }, [])

  const hasActiveId = (id: number | string) => {

    return false
  }

  const renderChannels = (ChannelsList: any[]) => {
    if (ChannelsList && ChannelsList.length) {
      if (query.length && !filteredChannels.length) {
        return (
          <ListItem>
            <Typography sx={{ color: 'text.secondary' }}>No Channels Found</Typography>
          </ListItem>
        )
      } 
      else {
        const channelArrayToMap = ChannelsList

        console.log("ChannelsList", ChannelsList)

        return channelArrayToMap !== null
          ? channelArrayToMap.map((Channel: any, index: number) => {
              const activeCondition =
                active !== null && active.id === Channel.ChannelId && active.type === 'Channel' && !hasActiveId(Channel.ChannelId)

              return (
                <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
                  <ListItemButton
                    disableRipple
                    onClick={() => handleChatClick(hasActiveId(Channel.ChannelId) ? 'chat' : 'Channel', Channel.ChannelId)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      width: '100%',
                      borderRadius: 1,
                      ...(activeCondition && {
                        backgroundImage: theme =>
                          `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
                      })
                    }}
                  >
                    <ListItemAvatar sx={{ m: 0 }}>
                        <CustomAvatar
                          color={Channel?.avatarColor ?? 'primary'}
                          skin={activeCondition ? 'light-static' : 'light'}
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: '1rem',
                            ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                          }}
                        >
                          {getInitials(Channel.ChannelName ?? '')}
                        </CustomAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        my: 0,
                        ml: 2,
                        pt: 0
                      }}
                      primary={
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{Channel.ChannelName}</Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )
            })
          : null
      }
    }
  }

  return (
    <div>
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: channelsListWidth,
            position: mdAbove ? 'static' : 'absolute',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            height: '57px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography>{t('All Channels')}</Typography>

          {!mdAbove ? (
            <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
              <Icon icon='mdi:close' fontSize='1.375rem' />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(2, 3, 3, 3) }}>
              {ChannelsGroupList && ChannelsGroupList.length > 0 && ChannelsGroupList.map((ChannelGroupName: string, index: number)=>{

                return (
                    <Fragment key={index}>
                        <Typography variant='h6' sx={{ ml: 3, mb: 1, color: 'primary.main' }}>
                            {t(ChannelGroupName)}
                        </Typography>
                        <List sx={{ p: 0 }}>{renderChannels(getChivesChatGetChannelsMap[ChannelGroupName])}</List>
                    </Fragment>
                )
              })
              }
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>

    </div>
  )
}

export default ChannelsList
