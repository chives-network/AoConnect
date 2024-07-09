// ** React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
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

import toast from 'react-hot-toast'

import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

const TokenCreate = (props: any) => {
    // ** Props
    const {tokenCreate, setTokenCreate, handleTokenCreate, handleTokenSearch, handleAddToken } = props

    // ** Hook
    const { t } = useTranslation()
    const router = useRouter()

    const auth = useAuth()
    const currentAddress = auth.currentAddress

    useEffect(()=>{
        setTokenCreate( (prevState: any) => ({ 
            ...prevState,
            Name: '',
            Ticker: '',
            Balance: '',
            NameError: '',
            LogoError: '',
            TickerError: '',
            BalanceError: '',
            isDisabledButton: false,
            openCreateToken: false,
            ManualProcessTxId: '',
            FormSubmit: 'Submit'
        }) )
    }, [])

    const handleSubmit = async () => {
        if(currentAddress == undefined || currentAddress.length != 43) {
            toast.success(t(`Please create a wallet first`), {
                duration: 4000
            })
            router.push("/mywallets");
            
            return
        }

        console.log("tokenCreate", tokenCreate)

        if(tokenCreate && (tokenCreate.Name == null || tokenCreate.Name.trim() == "") )  {
            setTokenCreate( (prevState: any) => ({ 
                ...prevState, 
                NameError: t('Token name must have a value')
            }) )
            
            return
        }

        if(tokenCreate && (tokenCreate.Ticker == null || tokenCreate.Ticker.trim() == "") )  {
            setTokenCreate( (prevState: any) => ({ 
                ...prevState, 
                TickerError: t('Token ticker must have a value')
            }) )
            
            return
        }

        if(tokenCreate && (tokenCreate.Balance == null || Number(tokenCreate.Balance.trim()) <= 0) )  {
            setTokenCreate( (prevState: any) => ({ 
                ...prevState, 
                BalanceError: t('Token Balance more than zero')
            }) )
            
            return
        }

        setTokenCreate( (prevState: any) => ({ 
            ...prevState, 
            isDisabledButton: true,
            FormSubmit: 'Submitting...'
        }) )

        const handleTokenCreateResult: any = await handleTokenCreate(tokenCreate);

        console.log("handleTokenCreateResult", handleTokenCreateResult)

        if(handleTokenCreateResult && handleTokenCreateResult.Token) {
            toast.success('Your token have created', { duration: 4000 })
            toast.success('Token: ' + handleTokenCreateResult.Token, { duration: 4000 })
            handleTokenSearch(handleTokenCreateResult.Token)
            handleAddToken(handleTokenCreateResult.Token)
        }

        setTokenCreate( (prevState: any) => ({ 
            ...prevState,
            NameError: '',
            LogoError: '',
            TickerError: '',
            BalanceError: '',
            isDisabledButton: false,
            openCreateToken: false,
            FormSubmit: 'Submit'
        }) )

    }

  return (
    <Dialog fullWidth open={tokenCreate.openCreateToken} onClose={
        () => { setTokenCreate( (prevState: any) => ({ ...prevState, openCreateToken: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Box position={'absolute'} right={'6px'} top={'2px'}>
                    <IconButton size="small" edge="end" onClick={
                            () => { setTokenCreate( (prevState: any) => ({ ...prevState, openCreateToken: false }) ) }
                        } 
                        aria-label="close" 
                        disabled={tokenCreate.isDisabledButton}
                        >
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
                            label={`${t('ManualProcessTxId')}`}
                            placeholder={`${t('Using a exist process tx id, if not, pls empty')}`}
                            disabled={tokenCreate.isDisabledButton}
                            value={tokenCreate?.ManualProcessTxId}
                            onChange={(e: any)=>{
                                setTokenCreate( (prevState: any) => ({ ...prevState, ManualProcessTxId: e.target.value, ManualAoConnectTxIdError: null }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenCreate?.ManualAoConnectTxIdError}
                            helperText={tokenCreate?.ManualAoConnectTxIdError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`${t('Name')}`}
                            placeholder={`${t('Token name, e.g. AoConnectToken')}`}
                            disabled={tokenCreate.isDisabledButton}
                            value={tokenCreate?.Name}
                            onChange={(e: any)=>{
                                setTokenCreate( (prevState: any) => ({ ...prevState, Name: e.target.value, NameError: null }) )
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
                            disabled={tokenCreate.isDisabledButton}
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
                            disabled={tokenCreate.isDisabledButton}
                            value={tokenCreate?.Balance}
                            onChange={(e: any)=>{
                                setTokenCreate( (prevState: any) => ({ ...prevState, Balance: e.target.value }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenCreate?.BalanceError}
                            helperText={tokenCreate?.BalanceError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`${t('Logo')}`}
                            placeholder={`${t('Logo')}`}
                            disabled={tokenCreate.isDisabledButton}
                            value={tokenCreate?.Logo ?? 'dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ'}
                            onChange={(e: any)=>{
                                setTokenCreate( (prevState: any) => ({ ...prevState, Logo: e.target.value }) )
                            }}
                            error={!!tokenCreate?.LogoError}
                            helperText={tokenCreate?.LogoError}
                        />
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button sx={{textTransform: 'none', }} variant='contained' disabled={tokenCreate.isDisabledButton} onClick={
                            () => { handleSubmit() }
                        }>
                        {t(tokenCreate.FormSubmit)}
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
