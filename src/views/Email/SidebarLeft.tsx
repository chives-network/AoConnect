// ** React Imports
import { ElementType, ReactNode, useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomBadge from 'src/@core/components/mui/badge'

// ** Types
import { CustomBadgeProps } from 'src/@core/components/mui/badge/types'
import { EmailSidebarType } from 'src/types/apps/Chivesweave'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Styled Components
const ListItemStyled = styled(ListItem)<ListItemProps & { component?: ElementType; href: string }>(({ theme }) => ({
  borderLeftWidth: '3px',
  borderLeftStyle: 'solid',
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(1)
}))

const ListBadge = styled(CustomBadge)<CustomBadgeProps>(() => ({
  '& .MuiBadge-badge': {
    height: '18px',
    minWidth: '18px',
    transform: 'none',
    position: 'relative',
    transformOrigin: 'none'
  }
}))

const SidebarLeft = (props: EmailSidebarType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const {
    store,
    hidden,
    lgAbove,
    folder,
    setFolder,
    leftSidebarOpen,
    leftSidebarWidth,
    composeTitle,
    toggleComposeOpen,
    setEmailDetailWindowOpen,
    handleLeftSidebarToggle,
    EmailCategoriesColors
  } = props

  const [sideBarActive, setSideBarActive] = useState<{ [key: string]: string }>({"folder": "Inbox"})

  useEffect(() => {
    if(folder) {
      setSideBarActive({"folder": folder})
    }
  }, [folder])

  const RenderBadge = (
    folder: string,
    color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  ) => {
    if (store && store.recordsCount && store.recordsCount[folder]) {
      return <ListBadge skin='light' color={color} sx={{ ml: 2 }} badgeContent={store.recordsCount[folder]} />
    }
    else {
      return null
    }
  }

  const handleActiveItem = (type: 'folder', value: string) => {
    if (sideBarActive && sideBarActive[type] !== value) {
      return false
    } else {
      return true
    }
  }

  const handleListItemClick = (Folder: string | null) => {
    setFolder(Folder)
    setEmailDetailWindowOpen(false)
    handleLeftSidebarToggle()
  }

  const activemyfilesCondition = store && handleActiveItem('folder', 'Inbox')

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={lgAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        zIndex: 9,
        display: 'block',
        position: lgAbove ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          boxShadow: 'none',
          width: leftSidebarWidth,
          zIndex: lgAbove ? 2 : 'drawer',
          position: lgAbove ? 'static' : 'absolute'
        },
        '& .MuiBackdrop-root': {
          position: 'absolute'
        }
      }}
    >
      <Box sx={{ p: 5, overflowY: 'hidden' }}>
        <Button fullWidth variant='contained' onClick={toggleComposeOpen}>
          {composeTitle}
        </Button>
      </Box>
      <ScrollWrapper>
        <Box sx={{ pt: 0, overflowY: 'hidden' }}>
          <List component='div'>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Inbox")
              }}
              sx={{ borderLeftColor: activemyfilesCondition ? 'primary.main' : 'transparent' }}
            >
              <ListItemIcon sx={{ color: activemyfilesCondition ? 'primary.main' : 'text.secondary' }}>
                <Icon icon='mdi:email-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Inbox`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(activemyfilesCondition && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Inbox', 'primary')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Starred")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Starred') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'Starred') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:star-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Starred`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Starred') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Starred', 'success')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Sent")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Sent') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'Sent') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:send-outline'/>
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Sent`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Sent') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Sent', 'warning')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Spam")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Spam') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'Spam') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:alert-octagon-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Spam`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Spam') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Spam', 'error')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Trash")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Trash') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'Trash') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:delete-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Trash`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Trash') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Trash', 'info')}
            </ListItemStyled>
          </List>
          <Typography
            component='h6'
            variant='caption'
            sx={{ mx: 6, mt: 4, mb: 0, color: 'text.disabled', letterSpacing: '0.21px', textTransform: 'uppercase' }}
          >
          {t('Categories')}
          </Typography>
          <List component='div'>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Important")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Important') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: `${EmailCategoriesColors['Important']}.main` } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Important`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Important') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Important', EmailCategoriesColors['Important'])}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Social")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Social') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: `${EmailCategoriesColors['Social']}.main` } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Social`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Social') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Social', EmailCategoriesColors['Social'])}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Updates")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Updates') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: `${EmailCategoriesColors['Updates']}.main` } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Updates`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Updates') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Updates', EmailCategoriesColors['Updates'])}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Forums")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Forums') ? 'warning.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: `${EmailCategoriesColors['Forums']}.main` } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Forums`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Forums') && { color: 'warning.main' }) }
                }}
              />
              {RenderBadge('Forums', EmailCategoriesColors['Forums'])}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='#'
              onClick={(event: any)=>{
                event.preventDefault();
                handleListItemClick("Promotions")
              }}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'Promotions') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: `${EmailCategoriesColors['Promotions']}.main` } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Promotions`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'Promotions') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Promotions', EmailCategoriesColors['Promotions'])}
            </ListItemStyled>
          </List>

        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default SidebarLeft
