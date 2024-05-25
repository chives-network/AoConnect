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

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'


import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

const TokenCreate = (props: any) => {
    // ** Props
    const {tokenCreate, setTokenCreate, tokenGetInfor, setTokenGetInfor, handleTokenCreate, isDisabledButton } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

  return (
    <Dialog fullWidth open={tokenGetInfor.openCreateToken} onClose={
        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openCreateToken: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Box position={'absolute'} right={'6px'} top={'2px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openCreateToken: false }) ) }
                    } aria-label="close">
                    <Icon icon='mdi:close' />
                    </IconButton>
                </Box>
            </Box>
        </DialogTitle>
        <DialogContent>
        <Card>
            <CardHeader title={`${t('Create New Token')}`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`${t('Name')}`}
                            placeholder={`${t('Token name, e.g. AoConnectToken')}`}
                            value={tokenCreate?.Name}
                            onChange={(e: any)=>{
                                setTokenCreate( (prevState: any) => ({ ...prevState, Name: e.target.value }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenCreate?.NameError}
                            helperText={tokenCreate?.NameError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`${t('Ticker')}`}
                            placeholder={`${t('Token ticker, e.g. AOCN')}`}
                            value={tokenCreate?.Ticker}
                            onChange={(e: any)=>{
                                setTokenCreate( (prevState: any) => ({ ...prevState, Ticker: e.target.value }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenCreate?.TickerError}
                            helperText={tokenCreate?.TickerError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type='number'
                            label={`${t('Balance')}`}
                            placeholder={`${t('Total Issues Amount, e.g. 1000')}`}
                            value={tokenGetInfor?.Balance}
                            onChange={(e: any)=>{
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, Balance: e.target.value }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenGetInfor?.BalanceError}
                            helperText={tokenGetInfor?.BalanceError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`${t('Logo')}`}
                            placeholder={`${t('Logo')}`}
                            value={tokenGetInfor?.Logo ?? 'dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ'}
                            onChange={(e: any)=>{
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, Logo: e.target.value }) )
                            }}
                            error={!!tokenGetInfor?.LogoError}
                            helperText={tokenGetInfor?.LogoError}
                        />
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button variant='contained' disabled={isDisabledButton} onClick={
                            () => { 
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, FormAction: 'deletepublish' }) )
                                handleTokenCreate()
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

export default TokenCreate
