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

import { BalanceCompare } from 'src/functions/AoConnect/AoConnect'

const TokenSendOut = (props: any) => {
    // ** Props
    const {tokenGetInfor, setTokenGetInfor, handleTokenSendOut, handleTokenSearch } = props

    // ** Hook
    const { t } = useTranslation()
    const router = useRouter()

    const auth = useAuth()
    const currentAddress = auth.currentAddress

    useEffect(()=>{
        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState,
            SendOutTokenError: '',
            SendOutAmount: '',
            SendOutAmountError: '',
            SendOutData: '',
            SendOutDataError: '',
            isDisabledButton: false,
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

        if(tokenGetInfor && (tokenGetInfor.SendOutToken == null || tokenGetInfor.SendOutToken.trim() == "") )  {
            setTokenGetInfor( (prevState: any) => ({ 
                ...prevState, 
                SendOutTokenError: t('Token name must have a value')
            }) )
            
            return
        }

        if(tokenGetInfor && tokenGetInfor.TokenProcessTxId == tokenGetInfor.SendOutToken && false)  {
            setTokenGetInfor( (prevState: any) => ({ 
                ...prevState, 
                SendOutTokenError: t('Cannot send amount to yourself')
            }) )
            
            return
        }

        if(tokenGetInfor && (tokenGetInfor.SendOutAmount == null || tokenGetInfor.SendOutAmount.trim() == "" || tokenGetInfor.SendOutAmount <= 0) )  {
            setTokenGetInfor( (prevState: any) => ({ 
                ...prevState, 
                SendOutAmountError: t('Token send out amount must more than zero')
            }) )
            
            return
        }
        if(tokenGetInfor && tokenGetInfor.SendOutAmount && BalanceCompare(tokenGetInfor.TokenBalance, tokenGetInfor.SendOutAmount) === -1 )  {
            setTokenGetInfor( (prevState: any) => ({
                ...prevState, 
                SendOutAmountError: t('Insufficient balance')
            }) )
            
            return
        }
        if(tokenGetInfor && tokenGetInfor.SendOutAmount && BalanceCompare(tokenGetInfor.TokenBalance, tokenGetInfor.SendOutAmount) === 1 )  {
            setTokenGetInfor( (prevState: any) => ({
                ...prevState, 
                SendOutAmountError: null
            }) )
        }

        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState, 
            isDisabledButton: true,
            FormSubmit: 'Submitting...'
        }) )

        const handleTokenSendOutResult: any = await handleTokenSendOut(tokenGetInfor.TokenProcessTxId, tokenGetInfor.SendOutToken, tokenGetInfor.SendOutAmount);

        console.log("handleTokenSendOutResult", handleTokenSendOutResult)

        if(handleTokenSendOutResult && handleTokenSendOutResult.Token) {
            toast.success('Your token have created', { duration: 4000 })
            toast.success('Token: ' + handleTokenSendOutResult.Token, { duration: 4000 })
            handleTokenSearch(handleTokenSendOutResult.Token)
        }

        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState,
            SendOutToken: '',
            SendOutTokenError: '',
            SendOutAmount: '',
            SendOutAmountError: '',
            SendOutData: '',
            SendOutDataError: '',
            isDisabledButton: false,
            openSendOutToken: false,
            FormSubmit: 'Submit'
        }) )

    }
    

  return (
    <Dialog fullWidth open={tokenGetInfor.openSendOutToken} onClose={
        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openSendOutToken: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Box position={'absolute'} right={'6px'} top={'2px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openSendOutToken: false }) ) }
                    } 
                    aria-label="close"
                    disabled={tokenGetInfor.isDisabledButton}
                    >
                    <Icon icon='mdi:close' />
                    </IconButton>
                </Box>
            </Box>
        </DialogTitle>
        <DialogContent>
        <Card>
            <CardHeader title={`${t('Send Token Out')}`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            disabled
                            size="small"
                            label={`${t('My Token')}`}
                            placeholder={`${t('My Token')}`}
                            value={tokenGetInfor?.TokenProcessTxId}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            disabled
                            size="small"
                            label={`${t('My Balance')}`}
                            placeholder={`${t('My Balance')}`}
                            value={tokenGetInfor?.TokenBalance}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            disabled={tokenGetInfor.isDisabledButton}
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
                            disabled={tokenGetInfor.isDisabledButton}
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
                            disabled={tokenGetInfor.isDisabledButton}
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
                        <Button sx={{textTransform: 'none', }} variant='contained' disabled={tokenGetInfor.isDisabledButton} onClick={
                            () => { handleSubmit() }
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
