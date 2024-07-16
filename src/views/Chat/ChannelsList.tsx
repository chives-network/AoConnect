// ** React Imports
import { useState, useEffect, ReactNode, Fragment } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'

import { useTranslation } from 'react-i18next'

import Icon from 'src/@core/components/icon'
import CircularProgress from '@mui/material/CircularProgress'
import OptionsMenu from 'src/@core/components/option-menu'
import IconButton from '@mui/material/IconButton'
import { getNanoid } from 'src/functions/string.tools'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

const ChannelsList = (props: any) => {
  // ** Props
  const {
    hidden,
    mdAbove,
    channelId,
    handleChangeChannelId,
    channelsListWidth,
    getChivesChatGetChannels,
    leftSidebarOpen,
    handleLeftSidebarToggle,
    loadingGetChannels,
    isOwner,
    setOpenChannelEdit,
    handleAddOrEditOrDelChannel
  } = props

  // ** States
  const [active, setActive] = useState<string>('')
  const [ChannelsGroupList, setChannelsGroupList] = useState<string[]>([])
  const [getChivesChatGetChannelsMap, setGetChivesChatGetChannelsMap] = useState<any>({})

  const { t } = useTranslation()

  // ** Hooks
  const router = useRouter()

  const handleChatClick = (id: string) => {
    setActive(id)
    handleChangeChannelId(id)
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setActive('')
    })

    console.log("ChannelsList channelId", channelId)
    
    if(getChivesChatGetChannels)   {
      const getChivesChatGetChannelsValues: any[] = Object.values(getChivesChatGetChannels)
      getChivesChatGetChannelsValues.sort((a: any, b: any) => {
          return Number(a.ChannelSort) - Number(b.ChannelSort);
      });
      
      const getChivesChatGetChannelsMap: any = {}
      getChivesChatGetChannelsValues.map((item: any)=>{
          if(getChivesChatGetChannelsMap[item.ChannelGroup] == undefined) {
              getChivesChatGetChannelsMap[item.ChannelGroup] = []
          }
          getChivesChatGetChannelsMap[item.ChannelGroup].push(item)
      })

      const ChannelsGroupList = Object.keys(getChivesChatGetChannelsMap)

      setChannelsGroupList(ChannelsGroupList)
      setGetChivesChatGetChannelsMap(getChivesChatGetChannelsMap)

      if(getChivesChatGetChannelsValues && getChivesChatGetChannelsValues.length > 0 && getChivesChatGetChannelsValues[0] && getChivesChatGetChannelsValues[0].ChannelId && active == '') {
        setActive(getChivesChatGetChannelsValues[0].ChannelId)
      }

    }
    
  }, [getChivesChatGetChannels])

  const renderChannels = (ChannelsList: any[]) => {
    if (ChannelsList && ChannelsList.length) {
        const channelArrayToMap = ChannelsList

        return channelArrayToMap !== null
          ? channelArrayToMap.map((Channel: any, index: number) => {
              const activeCondition = active !== null && active === Channel.ChannelId

              const optionsMenus = [
                {
                  text: 'Copy ChannelId',
                  menuItemProps: {
                    sx: { py: 2 },
                    onClick: () => {
                      navigator.clipboard.writeText(Channel.ChannelId);
                    }
                  }
                }
              ]
  
              if(isOwner && Channel.ChannelName != "Announcement") {
                optionsMenus.push({
                  text: 'Edit Channel',
                  menuItemProps: {
                    sx: { py: 2 },
                    onClick: () => {
                      setOpenChannelEdit((prevState: any)=>({
                        ...prevState,
                        add: false,
                        edit: true,
                        del: false,
                        open: true,
                        Channel: Channel
                      }))
                    }
                  }
                })
              }
  
              if(isOwner && Channel.ChannelName != "Announcement") {
                optionsMenus.push({
                  text: 'Del Channel',
                  menuItemProps: {
                    sx: { py: 2 },
                    onClick: () => {
                      setOpenChannelEdit((prevState: any)=>({
                        ...prevState,
                        add: false,
                        edit: false,
                        del: true,
                        open: false
                      }))
                      handleAddOrEditOrDelChannel('Del', Channel.ChannelId)
                    }
                  }
                })
              }

              return (
                <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
                  <ListItemButton
                    disableRipple
                    onClick={() => handleChatClick(Channel.ChannelId)}
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
                    {optionsMenus && optionsMenus.length > 0 && (
                      <OptionsMenu
                        icon={<Icon icon='mdi:dots-vertical' fontSize='1.25rem' />}
                        menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
                        iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                        options={optionsMenus}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              )
            })
          : null
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
                justifyContent: 'space-between', // 将内容显示在左右两端
                borderBottom: theme => `1px solid ${theme.palette.divider}`
            }}
            >
            <Typography>{t('All Channels')}</Typography>
            {loadingGetChannels && <CircularProgress size={20} /> }
        </Box>


        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(2, 3, 3, 3) }}>
              {ChannelsGroupList && ChannelsGroupList.length > 0 && ChannelsGroupList.map((ChannelGroupName: string, index: number)=>{

                return (
                    <Fragment key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant='h6' sx={{ color: 'primary.main' }}>
                                {t(ChannelGroupName)}
                            </Typography>
                            {isOwner && (
                              <IconButton size="small" edge="end" onClick={()=>{
                                setOpenChannelEdit((prevState: any)=>({
                                  ...prevState,
                                  add: true,
                                  edit: false,
                                  del: false,
                                  open: true,
                                  Channel: {ChannelId: getNanoid(43), ChannelName: '', ChannelGroup: ChannelGroupName, ChannelIntro: ''}
                                }))
                              }} aria-label="add">
                                  <Icon icon='mdi:add' />
                              </IconButton>
                            )}
                        </Box>
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
