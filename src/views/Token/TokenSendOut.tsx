// ** React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'


import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

const TokenSendOut = (props: any) => {
    // ** Props
    const {tokenGetInfor, setTokenGetInfor, handleTokenSendOut, isDisabledButton } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

  return (
    <Dialog fullWidth open={tokenGetInfor.openSendOutToken} onClose={
        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openSendOutToken: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Box position={'absolute'} right={'6px'} top={'2px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openSendOutToken: false }) ) }
                    } aria-label="close">
                    <Icon icon='mdi:close' />
                    </IconButton>
                </Box>
            </Box>
        </DialogTitle>
        <DialogContent>
        <Card>
            <CardHeader title={`${t('Send Coin Out')}`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`${t('SendOutToken')}`}
                            placeholder={`${t('SendOutToken')}`}
                            value={tokenGetInfor?.SendOutToken}
                            onChange={(e: any)=>{
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, SendOutToken: e.target.value }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenGetInfor?.SendOutTokenError}
                            helperText={tokenGetInfor?.SendOutTokenError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type='number'
                            label={`${t('SendOutAmount')}`}
                            placeholder={`${t('SendOutAmount')}`}
                            value={tokenGetInfor?.SendOutAmount}
                            onChange={(e: any)=>{
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, SendOutAmount: e.target.value }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenGetInfor?.SendOutAmountError}
                            helperText={tokenGetInfor?.SendOutAmountError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label={`${t('SendOutData')}`}
                            placeholder={`${t('SendOutData')}`}
                            value={tokenGetInfor?.SendOutData}
                            onChange={(e: any)=>{
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, SendOutData: e.target.value }) )
                            }}
                            error={!!tokenGetInfor?.SendOutDataError}
                            helperText={tokenGetInfor?.SendOutDataError}
                        />
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button variant='contained' disabled={isDisabledButton} onClick={
                            () => { 
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, FormAction: 'deletepublish' }) )
                                handleTokenSendOut()
                                }
                        }>
                        {t(tokenGetInfor.FormSubmit)}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        </DialogContent>
    </Dialog>
  )
}

export default TokenSendOut
