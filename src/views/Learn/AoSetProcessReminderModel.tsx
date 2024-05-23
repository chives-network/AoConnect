// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

import { SetAoConnectReminderProcessTxId, GetAoConnectReminderProcessTxId } from 'src/functions/AoConnectMsgReminder'

const AoSetProcessReminderModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()
    
  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [resultText, setResultText] = useState<string>("")

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  //GetAoConnectReminderProcessTxId()


  const [processTxId, setprocessTxId] = useState<string>("")
  const [processTxIdError, setprocessTxIdError] = useState<string | null>(null)
  const handleprocessTxIdChange = (event: any) => {
    setprocessTxId(event.target.value);
    if(event.target.value.length != 43) {
        setprocessTxIdError(`${t('processTxId length must be 43')}`)
    }
    else {
        setprocessTxIdError("")
    }
    
    console.log("processTxId", processTxId)
  };

  useEffect(()=>{
    setprocessTxId(GetAoConnectReminderProcessTxId() as string)
  }, [])
  
  const handleSubmit = async () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
            position: 'top-center',
            duration: 4000
        })
        router.push("/mywallets");
        
        return
    }

    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)

    const processId: any = SetAoConnectReminderProcessTxId(processTxId);

    if(processId && processId.length == 43) {
      toast.success(processId, { position: 'top-right', duration: 4000 })
      setResultText(processId)
      //setprocessTxId("")
      //setScheduler("")
      //setTags("")
    }
    setIsDisabledButton(false)
    setUploadingButton(`${t('Submit')}`)

  }


  return (
    <Fragment>
        <Card>
        <CardHeader title={`${t('Set ProcessTxId Reminder')}`} />
        <CardContent>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={`${t('processTxId')}`}
                        placeholder={`${t('processTxId')}`}
                        value={processTxId}
                        onChange={handleprocessTxIdChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!processTxIdError}
                        helperText={processTxIdError}
                    />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                    {resultText && (
                    <Button variant='outlined' size='small' sx={{ mr:3 }} onClick={()=>setResultText('')} disabled={isDisabledButton} >
                        {t('Cannel')}
                    </Button>
                    )}
                    {isDisabledButton && (
                        <Box sx={{ m: 0, pt:1 }}>
                            <CircularProgress sx={{ mr: 5, mt: 0 }} />
                        </Box>
                    )}
                    <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                        {uploadingButton}
                    </Button>
                </Grid>

            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

export default AoSetProcessReminderModel
