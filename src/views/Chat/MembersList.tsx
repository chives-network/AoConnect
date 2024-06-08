// ** React Imports
import { useState, useEffect, ChangeEvent, ReactNode, Fragment } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
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
import { ContactType, ProfileUserType } from 'src/types/apps/chatTypes'

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'

// ** Chat App Components Imports
import UserProfileLeft from 'src/views/Chat/UserProfileLeft'

import { useTranslation } from 'react-i18next'
import CircularProgress from '@mui/material/CircularProgress'

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

const MembersList = (props: any) => {
  // ** Props
  const {
    hidden,
    mdAbove,
    statusObj,
    userStatus,
    membersListWidth,
    getChivesChatGetMembers,
    leftSidebarOpen,
    userProfileLeftOpen,
    handleLeftSidebarToggle,
    handleUserProfileLeftSidebarToggle,
    loadingGetMembers
  } = props

  // ** States
  const [query, setQuery] = useState<string>('')
  const [filteredMembers, setFilteredMembers] = useState<ContactType[]>([])
  const [active, setActive] = useState<null | { type: string; id: string | number }>(null)

  const { t } = useTranslation()

  // ** Hooks
  const router = useRouter()

  const handleChatClick = (type: 'chat' | 'Member', id: number) => {
    setActive({ type, id })
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const Admins: string[] = getChivesChatGetMembers[0] ?? []
  const Members: any = getChivesChatGetMembers[1] ?? {}
  console.log("getChivesChatGetMembers11 getChivesChatGetMembers", getChivesChatGetMembers)
  console.log("getChivesChatGetMembers11 Admins", Admins)
  console.log("getChivesChatGetMembers11 Members", Members)

  const MembersListOriginal: any[] = Object.values(Members).map((item: any, index: number)=>{

    const MemberAvatar = '/images/avatars/' + ((index%8)+1) + '.png'
    const MemberAbout = item.MemberAbout ? item.MemberAbout : item.MemberId
    
    return {...item, MemberRole:'user', MemberAbout: MemberAbout, MemberAvatar: MemberAvatar, MemberStatus: 'online'}

  })

  const AdminsListData: any[] = MembersListOriginal.filter((item: any)=> Admins.includes(item.MemberId) )
  const MembersListData: any[] = MembersListOriginal.filter((item: any)=> !Admins.includes(item.MemberId) )

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

  const renderMembers = (MembersList: any[]) => {
    if (MembersList && MembersList.length) {
      if (query.length && !filteredMembers.length) {
        return (
          <ListItem>
            <Typography sx={{ color: 'text.secondary' }}>No Members Found</Typography>
          </ListItem>
        )
      } 
      else {
        const memberArrayToMap = MembersList

        console.log("MembersList", MembersList)

        return memberArrayToMap !== null
          ? memberArrayToMap.map((Member: any, index: number) => {
              const activeCondition =
                active !== null && active.id === Member.MemberId && active.type === 'Member' && !hasActiveId(Member.MemberId)

              return (
                <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
                  <ListItemButton
                    disableRipple
                    onClick={() => handleChatClick(hasActiveId(Member.MemberId) ? 'chat' : 'Member', Member.MemberId)}
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
                      {Member.MemberAvatar ? (
                        <MuiAvatar
                          alt={Member.MemberName}
                          src={Member.MemberAvatar}
                          sx={{
                            width: 38,
                            height: 38,
                            ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                          }}
                        />
                      ) : (
                        <CustomAvatar
                          color={Member?.avatarColor ?? 'primary'}
                          skin={activeCondition ? 'light-static' : 'light'}
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: '1rem',
                            ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                          }}
                        >
                          {getInitials(Member.MemberName ?? '')}
                        </CustomAvatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        my: 0,
                        ml: 4,
                        ...(activeCondition && { '& .MuiTypography-root': { color: 'common.white' } })
                      }}
                      primary={
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{Member.MemberName}</Typography>
                      }
                      secondary={
                        <Typography noWrap variant='body2' sx={{ ...(!activeCondition && { color: 'text.disabled' }) }}>
                          {Member.MemberAbout}
                        </Typography>
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

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
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
            width: membersListWidth,
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
          {MockData && MockData.profileUser ? (
            <Badge
              overlap='circular'
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              sx={{ mr: 4 }}
              onClick={handleUserProfileLeftSidebarToggle}
              badgeContent={
                <Box
                  component='span'
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    color: `${statusObj[userStatus]}.main`,
                    backgroundColor: `${statusObj[userStatus]}.main`,
                    boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                  }}
                />
              }
            >
              <MuiAvatar
                src={MockData.profileUser.avatar}
                alt={MockData.profileUser.fullName}
                sx={{ width: '2.375rem', height: '2.375rem', cursor: 'pointer' }}
              />
            </Badge>
          ) : null}

          {!loadingGetMembers && 
            <TextField
              fullWidth
              size='small'
              value={query}
              onChange={handleFilter}
              placeholder='Search for Member...'
              sx={{ '& .MuiInputBase-root': { borderRadius: 5 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                    <Icon icon='mdi:magnify' fontSize={20} />
                  </InputAdornment>
                )
              }}
            />
          }
          
          {loadingGetMembers && <CircularProgress size={20} /> }

          {!mdAbove ? (
            <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
              <Icon icon='mdi:close' fontSize='1.375rem' />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(2, 3, 3, 3) }}>
              {AdminsListData && AdminsListData.length > 0 && (
                <Fragment>
                  <Typography variant='h6' sx={{ ml: 3, mb: 1, color: 'primary.main' }}>
                    {t('Admins')}
                  </Typography>
                  <List sx={{ p: 0 }}>{renderMembers(AdminsListData)}</List>
                </Fragment>
              )}
              {MembersListData && MembersListData.length > 0 && (
                <Fragment>
                  <Typography variant='h6' sx={{ ml: 3, mb: 1, color: 'primary.main' }}>
                    {t('Members')}
                  </Typography>
                  <List sx={{ p: 0 }}>{renderMembers(MembersListData)}</List>
                </Fragment>
              )}
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>

      <UserProfileLeft
        store={MockData}
        hidden={hidden}
        statusObj={statusObj}
        userStatus={userStatus}
        membersListWidth={membersListWidth}
        getChivesChatGetMembers={getChivesChatGetMembers}
        userProfileLeftOpen={userProfileLeftOpen}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
    </div>
  )
}

export default MembersList
