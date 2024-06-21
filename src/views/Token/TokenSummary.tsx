// ** MUI Imports
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import MuiAvatar from '@mui/material/Avatar'
import authConfig from 'src/configs/auth'
import IconButton from '@mui/material/IconButton'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetTokenAvatar } from 'src/functions/AoConnect/Token'

const TokenSummary = (prop: any) => {
  // ** Hook
  const { t } = useTranslation()

  const { tokenGetInfor } = prop
  
  return (
    <Grid item sx={{ display: 'column', m: 2 }}>
        {tokenGetInfor && tokenGetInfor?.Name && (
            <>
            <Box
            sx={{
                py: 3,
                px: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: theme => `1px solid ${theme.palette.divider}`,
                borderTop: theme => `1px solid ${theme.palette.divider}`
            }}
            >            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center'}} >
                <MuiAvatar
                    src={GetTokenAvatar(tokenGetInfor?.Logo)}
                    alt={tokenGetInfor?.Name}
                    sx={{ width: '2.5rem', height: '2.5rem' }}
                    />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {tokenGetInfor?.Name ?? 'Token'}
                    <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Balance: {tokenGetInfor.TokenBalance ?? '...'}</Typography>
                    <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Denomination: {tokenGetInfor?.Denomination ?? ''}</Typography>
                    <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Version: {tokenGetInfor?.Version ?? ''}</Typography>
                    </Typography>
                    <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                    {tokenGetInfor?.Ticker}
                    <Link href={authConfig.AoConnectAoLink + `/token/${tokenGetInfor?.TokenProcessTxId}`} target='_blank'>
                        <Typography noWrap variant='body2' sx={{ml: 2, mr: 1, display: 'inline', color: 'primary.main'}}>{tokenGetInfor?.TokenProcessTxId}</Typography>
                    </Link>
                    {tokenGetInfor?.TokenProcessTxId && (
                        <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                            navigator.clipboard.writeText(tokenGetInfor?.TokenProcessTxId);
                        }}>
                            <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                        </IconButton>
                    )}
                    </Typography>
                </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 3 }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {t('Token holders')}
                </Typography>
                <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                    {t('Circulating supply')}
                </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 3 }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {tokenGetInfor?.TokenHolders ?? '-'}
                </Typography>
                <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                    {tokenGetInfor?.CirculatingSupply ?? '-'}
                </Typography>
                </Box>
            </Box>
            </Box>
            </>
        )}

    </Grid>
  )
}

export default TokenSummary

