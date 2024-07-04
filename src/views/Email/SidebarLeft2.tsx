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
import { DriveSidebarType } from 'src/types/apps/Chivesweave'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import TreeView from '@mui/lab/TreeView'
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem'

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

const SidebarLeft = (props: DriveSidebarType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const {
    store,
    hidden,
    lgAbove,
    dispatch,
    routeParams,
    leftSidebarOpen,
    leftSidebarWidth,
    uploadFilesTitle,
    toggleUploadFilesOpen,
    setFileDetailOpen,
    handleSelectAllFile,
    handleLeftSidebarToggle
  } = props

  const [sideBarActive, setSideBarActive] = useState<{ [key: string]: string }>({"folder": "myfiles"})

  const [sideBarBadge, setSideBarBadge] = useState<{ [key: string]: string }>({"folder": ""})

  useEffect(() => {
    if(routeParams && routeParams.initFolder) {
      setSideBarActive({"folder": routeParams.initFolder})
    }
    if(store && store.total && routeParams && routeParams.initFolder) {
      setSideBarBadge({...sideBarBadge, [routeParams.initFolder]: store.total})
    }
    console.log("sideBarBadge", sideBarBadge)
  }, [routeParams, store])

  const RenderBadge = (
    folder: string,
    color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  ) => {
    if (store && store.totalnumber && store.totalnumber[folder]) {
      return <ListBadge skin='light' color={color} sx={{ ml: 2 }} badgeContent={store.totalnumber[folder]} />
    }
    else if (store && store.totalnumber.label && store.totalnumber.label[folder]) {
      return <ListBadge skin='light' color={color} sx={{ ml: 2 }} badgeContent={store.totalnumber.label[folder]} />
    }
    else {
      return null
    }
  }

  const handleActiveItem = (type: 'folder' | 'label' | 'type', value: string) => {
    if (sideBarActive && sideBarActive[type] !== value) {
      return false
    } else {
      return true
    }
  }

  const handleListItemClick = () => {
    setFileDetailOpen(false)
    setTimeout(() => dispatch(handleSelectAllFile(false)), 50)
    handleLeftSidebarToggle()
  }

  const activemyfilesCondition =
    store && handleActiveItem('folder', 'myfiles')

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  const ExpandIcon = <Icon icon={'mdi:chevron-left'} />

  type StyledTreeItemProps = TreeItemProps & {
    labelText: string
    labelIcon: string
    folder: string
  }

  // Styled TreeItem component
  const StyledTreeItemRoot = styled(TreeItem)<TreeItemProps>(({ theme }) => ({
    '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
      backgroundColor: theme.palette.action.hover
    },
    '& .MuiTreeItem-content': {
      paddingRight: theme.spacing(3),
      borderTopRightRadius: theme.spacing(4),
      borderBottomRightRadius: theme.spacing(4),
      fontWeight: theme.typography.fontWeightMedium
    },
    '& .MuiTreeItem-label': {
      fontWeight: 'inherit',
      paddingRight: theme.spacing(3)
    },
    '& .MuiTreeItem-group': {
      marginLeft: 0,
      '& .MuiTreeItem-content': {
        paddingLeft: theme.spacing(4),
        fontWeight: theme.typography.fontWeightRegular
      }
    }
  }))
  
  const StyledTreeItem = (props: StyledTreeItemProps) => {
    // ** Props
    const { labelText, labelIcon, folder, ...other } = props

    return (
      <StyledTreeItemRoot
        {...other}
        label={
          <Box sx={{ py: 1.5, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
            <Icon icon={labelIcon} color='inherit' />
            <Typography sx={{ flexGrow: 1, fontWeight: 'inherit' }}>
              {labelText}
            </Typography>
            {store.totalnumber[folder] ? (
              <ListBadge skin='light' class={'primary'} sx={{ ml: 2 }} badgeContent={store.totalnumber[folder]} />
            ) : null}
          </Box>
        }
      />
    )
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
        <Button fullWidth variant='contained' onClick={toggleUploadFilesOpen}>
          {uploadFilesTitle}
        </Button>
      </Box>
      <ScrollWrapper>
        <Box sx={{ pt: 0, overflowY: 'hidden' }}>
          <TreeView
            defaultExpanded={['10']}
            defaultExpandIcon={ExpandIcon}
            defaultCollapseIcon={<Icon icon='mdi:chevron-down' />}
          >
            <StyledTreeItem nodeId='10' folder='Root' labelText={`${t(`My Files`)}`} labelIcon='mdi:file-outline'>
              <StyledTreeItem nodeId='5' folder='Root1' labelText='Social' labelIcon='mdi:account-supervisor-outline' />
              <StyledTreeItem nodeId='6' folder='Root2' labelText='Updates' labelIcon='mdi:information-outline' />
              <StyledTreeItem nodeId='7' folder='Root3' labelText='Forums' labelIcon='mdi:forum-outline' />
              <StyledTreeItem nodeId='8' folder='Root4' labelText='Promotions' labelIcon='mdi:tag-outline' />
            </StyledTreeItem>
          </TreeView>
          
          <List component='div'>
            <ListItemStyled
              component={Link}
              href='/drive/myfiles'
              onClick={handleListItemClick}
              sx={{ borderLeftColor: activemyfilesCondition ? 'primary.main' : 'transparent' }}
            >
              <ListItemIcon sx={{ color: activemyfilesCondition ? 'primary.main' : 'text.secondary' }}>
                <Icon icon='mdi:email-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`My Files`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(activemyfilesCondition && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Root', 'primary')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/sharedfiles'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'sharedfiles') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'sharedfiles') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:send-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Shared Files`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'sharedfiles') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('sharedfiles', 'warning')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/uploaded'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'uploaded') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'uploaded') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:pencil-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Uploaded`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'uploaded') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('uploaded', 'secondary')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/starred'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'starred') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'starred') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:star-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Starred`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'starred') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Star', 'success')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/spam'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'spam') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'spam') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:alert-octagon-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Spam`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'spam') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('Spam', 'error')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/trash'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'trash') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'trash') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:delete-outline' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Trash`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'trash') && { color: 'primary.main' }) }
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
          Labels
          </Typography>
          <List component='div'>
            <ListItemStyled
              component={Link}
              href='/drive/personal'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'image') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'success.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Personal`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'image') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('personal', 'success')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/company'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'word') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'primary.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Company`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'word') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('company', 'primary')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/important'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'excel') ? 'warning.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'warning.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Important`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'excel') && { color: 'warning.main' }) }
                }}
              />
              {RenderBadge('important', 'warning')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/private'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'pptx') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'error.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Private`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'pptx') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('private', 'error')}
            </ListItemStyled>
          </List>

          
          <Typography
            component='h6'
            variant='caption'
            sx={{ mx: 6, mt: 4, mb: 0, color: 'text.disabled', letterSpacing: '0.21px', textTransform: 'uppercase' }}
          >
          File Types
          </Typography>
          <List component='div'>
            <ListItemStyled
              component={Link}
              href='/drive/image'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'image') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'success.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Image`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'image') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/word'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'word') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'primary.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Word`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'word') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/excel'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'excel') ? 'warning.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'warning.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Excel`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'excel') && { color: 'warning.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/pptx'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'pptx') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'error.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Pptx`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'pptx') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/video'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'video') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'warning.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Video`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'video') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/pdf'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'pdf') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'error.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Pdf`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'pdf') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/stl'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'stl') ? 'info.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'info.info' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary={`${t(`Stl`)}`}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'stl') && { color: 'info.main' }) }
                }}
              />
            </ListItemStyled>
          </List>

        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default SidebarLeft
