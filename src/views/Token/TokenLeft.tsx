// ** React Imports
import { useState, ReactNode } from 'react'

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

import CircularProgress from '@mui/material/CircularProgress'
import MuiAvatar from '@mui/material/Avatar'
import { GetAppAvatar } from 'src/functions/AoConnect/MsgReminder'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

const TokenLeft = (props: any) => {
  // ** Props
  const {
    hidden,
    mdAbove,
    tokenLeftWidth,
    tokenLeft,
    setSearchToken,
    loadingGetTokens
  } = props

  // ** States
  const [active, setActive] = useState<string>('')

  const { t } = useTranslation()

  const handleTokenClick = (id: string) => {
    setActive(id)
    setSearchToken(id)
  }

  const renderTokens = (tokenLeft: any[]) => {
    if (tokenLeft && tokenLeft.length == 0) {
      return (
        <ListItem>
          <Typography sx={{ color: 'text.secondary' }}>No Tokens</Typography>
        </ListItem>
      )
    } 
    else {

      return tokenLeft && tokenLeft.map((Token: any, index: number) => {
            const activeCondition = active !== null && active === Token.Id

            console.log("Token.Logo", GetAppAvatar(Token.Logo))

            return (
              <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
                <ListItemButton
                  disableRipple
                  onClick={() => handleTokenClick(Token.Id)}
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
                    {Token.Logo && Token.Logo.length == 43 ? (
                      <MuiAvatar
                        alt={Token.Name}
                        src={GetAppAvatar(Token.Logo)}
                        sx={{
                          width: 38,
                          height: 38,
                          ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                        }}
                      />
                    ) : (
                      <CustomAvatar
                        color={'primary'}
                        skin={activeCondition ? 'light-static' : 'light'}
                        sx={{
                          width: 38,
                          height: 38,
                          fontSize: '1rem',
                          ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                        }}
                      >
                        {getInitials(Token.Name ?? '')}
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
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{Token.Name}</Typography>
                    }
                    secondary={
                      <Typography noWrap variant='body2' sx={{ ...(!activeCondition && { color: 'text.disabled' }) }}>
                        {Token.Ticker}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )
          })
    }
  }


  return (
    <div>
      <Drawer
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
            width: tokenLeftWidth,
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
            <Typography>{t('My Tokens')}</Typography>
            {loadingGetTokens && <CircularProgress size={20} /> }
        </Box>


        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(2, 3, 3, 3) }}>
              <List sx={{ p: 0 }}>{renderTokens(tokenLeft)}</List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>

    </div>
  )
}

export default TokenLeft
