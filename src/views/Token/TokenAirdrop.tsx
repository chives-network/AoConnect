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

const TokenAirdrop = (props: any) => {
    // ** Props
    const {tokenGetInfor, setTokenGetInfor, handleTokenAirdrop, handleTokenSearch } = props

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
            openAirdropToken: false,
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
        console.log("tokenGetInfor", tokenGetInfor)
        if(!tokenGetInfor && !tokenGetInfor.AirdropData)  return

        const AddressList: string[] = []
        const AmountList: string[] = []

        if(tokenGetInfor && tokenGetInfor.AirdropData)  {
            let AirdropDataListCheckFalse = false
            const AirdropDataList = tokenGetInfor.AirdropData.split('\n')
            AirdropDataList.map((item: any, index: number)=>{
                const itemList = (item + ",").split(',')
                const AddressTemp = itemList[0]
                const AmountTemp = itemList[1]
                if(AddressTemp && AddressTemp.length != 43) {
                    AirdropDataListCheckFalse = true
                    toast.error('Line:' + (index+1) + ", address length must equal 43", { duration: 4000 })
                }
                if(AmountTemp && Number(AmountTemp) <= 0) {
                    AirdropDataListCheckFalse = true
                    toast.error('Line:' + (index+1) + ", amount must more than zero", { duration: 4000 })
                }
                if(AddressTemp && AddressTemp.length == 43 && AmountTemp && Number(AmountTemp) > 0)  {
                    AddressList.push(AddressTemp)
                    AmountList.push(String(Number(AmountTemp)))
                }
            })
            
            console.log("AirdropDataList", AddressList, AmountList)

            if(AirdropDataListCheckFalse || AddressList.length == 0 || AmountList.length == 0)   {
                setTokenGetInfor( (prevState: any) => ({ 
                    ...prevState, 
                    AirdropDataError: t('AirdropData is invalid')
                }) )
                
                return
            }
        }

        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState, 
            isDisabledButton: true,
            FormSubmit: 'Submitting...'
        }) )

        const handleTokenAirdropResult: any = await handleTokenAirdrop(tokenGetInfor.TokenProcessTxId, AddressList.join('****'), AmountList.join('****'));

        console.log("handleTokenAirdropResult", handleTokenAirdropResult)

        if(handleTokenAirdropResult && handleTokenAirdropResult.Token) {
            toast.success('Your token have Mintd', { duration: 4000 })
            toast.success('Token: ' + handleTokenAirdropResult.Token, { duration: 4000 })
            handleTokenSearch(handleTokenAirdropResult.Token)
        }

        setTokenGetInfor( (prevState: any) => ({ 
            ...prevState,
            NameError: '',
            LogoError: '',
            TickerError: '',
            BalanceError: '',
            isDisabledButton: false,
            openAirdropToken: false,
            FormSubmit: 'Submit'
        }) )

    }

  return (
    <Dialog fullWidth open={tokenGetInfor.openAirdropToken ?? false} onClose={
        () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openAirdropToken: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Box position={'absolute'} right={'6px'} top={'2px'}>
                    <IconButton size="small" edge="end" onClick={
                            () => { setTokenGetInfor( (prevState: any) => ({ ...prevState, openAirdropToken: false }) ) }
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
            <CardHeader title={`${t('Airdrop Token')}`} />
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
                            multiline
                            rows={10}
                            type='number'
                            label={`${t('AirdropData')}`}
                            placeholder={`${t('Input address and amount each line. For example:\naddress1,amount\naddress2,amount2')}`}
                            disabled={tokenGetInfor.isDisabledButton}
                            value={tokenGetInfor?.AirdropData}
                            onChange={(e: any)=>{
                                setTokenGetInfor( (prevState: any) => ({ ...prevState, AirdropData: e.target.value }) )
                            }}
                            error={!!tokenGetInfor?.AirdropDataError}
                            helperText={tokenGetInfor?.AirdropDataError}
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

export default TokenAirdrop
