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

const TokenMint = (props: any) => {
    // ** Props
    const {tokenGetInfor, setTokenGetInfor, handleTokenMint, handleTokenSearch } = props

    // ** Hook
    const { t } = useTranslation()
    const router = useRouter()

    const auth = useAuth()
    const currentAddress = auth.currentAddress

    useEffect(()=>{
        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState,
            Name: '',
            Ticker: '',
            Balance: '',
            NameError: '',
            LogoError: '',
            TickerError: '',
            BalanceError: '',
            isDisabledButton: false,
            openMintToken: false,
            ManualProcessTxId: '',
            FormSubmit: 'Submit'
        }) )
    }, [])

    const handleSubmit = async () => {
        if(currentAddress == undefined || currentAddress.length != 43) {
            toast.success(t(`Please Mint a wallet first`), {
                duration: 4000
            })
            router.push("/mywallets");
            
            return
        }

        if(tokenGetInfor && (tokenGetInfor.MintAmount == null || Number(tokenGetInfor.MintAmount.trim()) <= 0) )  {
            setTokenGetInfor( (prevState: any) => ({ 
                ...prevState, 
                MintAmountError: t('Token mint amount more than zero')
            }) )
            
            return
        }

        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState, 
            isDisabledButton: true,
            FormSubmit: 'Submitting...'
        }) )

        const handleTokenMintResult: any = await handleTokenMint(tokenGetInfor.TokenProcessTxId, tokenGetInfor.MintAmount);

        console.log("handleTokenMintResult", handleTokenMintResult)

        if(handleTokenMintResult && handleTokenMintResult.Token) {
            toast.success('Your token have Mintd', { duration: 4000 })
            toast.success('Token: ' + handleTokenMintResult.Token, { duration: 4000 })
            handleTokenSearch(handleTokenMintResult.Token)
        }

        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState,
            NameError: '',
            LogoError: '',
            TickerError: '',
            BalanceError: '',
            isDisabledButton: false,
            openMintToken: false,
            FormSubmit: 'Submit'
        }) )

    }

  return (
    <Dialog fullWidth open={tokenGetInfor.openMintToken ?? false} onClose={
        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openMintToken: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Box position={'absolute'} right={'6px'} top={'2px'}>
                    <IconButton size="small" edge="end" onClick={
                            () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openMintToken: false }) ) }
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
            <CardHeader title={`${t('Mint Token')}`} />
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
                            disabled
                            size="small"
                            label={`${t('Circulating Supply')}`}
                            placeholder={`${t('Circulating Supply')}`}
                            value={tokenGetInfor?.CirculatingSupply}
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
                            type='number'
                            label={`${t('MintAmount')}`}
                            placeholder={`${t('Mint Amount, e.g. 1000')}`}
                            disabled={tokenGetInfor.isDisabledButton}
                            value={tokenGetInfor?.MintAmount}
                            onChange={(e: any)=>{
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, MintAmount: e.target.value }) )
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!tokenGetInfor?.MintAmountError}
                            helperText={tokenGetInfor?.MintAmountError}
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

export default TokenMint
