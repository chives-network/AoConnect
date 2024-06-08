// ** React Imports
import { Fragment, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Type
import { UserProfileRightType } from 'src/types/apps/chatTypes'

// ** Custom Component Imports
import Sidebar from 'src/@core/components/sidebar'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'

const UserProfileRight = (props: UserProfileRightType) => {
  const {
    member,
    hidden,
    membersListWidth,
    userProfileRightOpen,
    handleUserProfileRightSidebarToggle
  } = props

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  return (
    <Sidebar
      direction='right'
      show={userProfileRightOpen}
      backDropClick={handleUserProfileRightSidebarToggle}
      sx={{
        zIndex: 9,
        height: '100%',
        width: membersListWidth,
        borderTopRightRadius: theme => theme.shape.borderRadius,
        borderBottomRightRadius: theme => theme.shape.borderRadius,
        '& + .MuiBackdrop-root': {
          zIndex: 8,
          borderRadius: 1
        }
      }}
    >
      {member ? (
        <Fragment>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              size='small'
              onClick={handleUserProfileRightSidebarToggle}
              sx={{ top: '0.5rem', right: '0.5rem', position: 'absolute', color: 'text.secondary' }}
            >
              <Icon icon='mdi:close' fontSize='1.375rem' />
            </IconButton>
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 5.5, display: 'flex', justifyContent: 'center' }}>
                <Badge
                  overlap='circular'
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  badgeContent={
                    <Box
                      component='span'
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        color: `primary.main`,
                        boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                        backgroundColor: `primary.main`
                      }}
                    />
                  }
                >
                  {member.MemberAvatar ? (
                    <MuiAvatar
                      sx={{ width: '5rem', height: '5rem' }}
                      src={member.MemberAvatar}
                      alt={member.MemberName}
                    />
                  ) : (
                    <CustomAvatar
                      skin='light'
                      color={member.MemberAvatarColor}
                      sx={{ width: '5rem', height: '5rem', fontWeight: 500, fontSize: '2rem' }}
                    >
                      {getInitials(member.MemberName)}
                    </CustomAvatar>
                  )}
                </Badge>
              </Box>
              <Typography sx={{ mb: 0.5, fontWeight: 500, textAlign: 'center' }}>
                {member.MemberName}
              </Typography>
              <Typography variant='body2' sx={{ textAlign: 'center', mt: 2 }}>
                {member.MemberId}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 'calc(100% - 11.8125rem)' }}>
            <ScrollWrapper>
              <Box sx={{ p: 5 }}>
                <FormGroup sx={{ mb: 10.5 }}>
                  <Typography variant='body2' sx={{ mb: 3.5, textTransform: 'uppercase' }}>
                    About
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem' }}>{member.about}</Typography>
                </FormGroup>

                <Box sx={{ mb: 8.5 }}>
                  <Typography variant='body2' sx={{ mb: 3.5, textTransform: 'uppercase' }}>
                    Personal Information
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemIcon sx={{ mr: 2, color: 'text.primary' }}>
                        <Icon icon='mdi:email-outline' fontSize='1.375rem' />
                      </ListItemIcon>
                      <ListItemText
                        sx={{ textTransform: 'lowercase' }}
                        primary={`${member.MemberId}@ao.com`}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemIcon sx={{ mr: 2, color: 'text.primary' }}>
                        <Icon icon='mdi:phone-outline' fontSize='1.375rem' />
                      </ListItemIcon>
                      <ListItemText primary='+1 (***) *** - ****' />
                    </ListItem>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemIcon sx={{ mr: 2, color: 'text.primary' }}>
                        <Icon icon='mdi:clock-time-five-outline' fontSize='1.375rem' />
                      </ListItemIcon>
                      <ListItemText primary='Mon - Fri 9AM - 6PM' />
                    </ListItem>
                  </List>
                </Box>

                <div>
                  <Typography variant='body2' sx={{ mb: 3.5, textTransform: 'uppercase' }}>
                    Options
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ px: 2 }}>
                        <ListItemIcon sx={{ mr: 2, color: 'text.primary' }}>
                          <Icon icon='mdi:bookmark-outline' fontSize='1.375rem' />
                        </ListItemIcon>
                        <ListItemText primary='Add Tag' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ px: 2 }}>
                        <ListItemIcon sx={{ mr: 2, color: 'text.primary' }}>
                          <Icon icon='mdi:star-outline' fontSize='1.375rem' />
                        </ListItemIcon>
                        <ListItemText primary='Important Contact' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ px: 2 }}>
                        <ListItemIcon sx={{ mr: 2, color: 'text.primary' }}>
                          <Icon icon='mdi:image-outline' fontSize='1.375rem' />
                        </ListItemIcon>
                        <ListItemText primary='Shared Media' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ px: 2 }}>
                        <ListItemIcon sx={{ mr: 2, color: 'text.primary' }}>
                          <Icon icon='mdi:delete-outline' fontSize='1.375rem' />
                        </ListItemIcon>
                        <ListItemText primary='Delete Contact' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ px: 2 }}>
                        <ListItemIcon sx={{ mr: 2.5, ml: 0.5, color: 'text.primary' }}>
                          <Icon icon='mdi:block-helper' fontSize='1.125rem' />
                        </ListItemIcon>
                        <ListItemText primary='Block Contact' />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </div>
              </Box>
            </ScrollWrapper>
          </Box>
        </Fragment>
      ) : null}
    </Sidebar>
  )
}

export default UserProfileRight
