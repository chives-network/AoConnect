// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

import { GetMyLastMsg } from 'src/functions/AoConnect'
import { Typography } from '@mui/material'

const GetMyLastMsgModel = () => {
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

  const [processTxId, setprocessTxId] = useState<string>("K4kzmPPoxWp0YQqG0UNDeXIhWuhWkMcG0Hx8HYCjmLw")
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

  const handleSubmit = async () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
          duration: 4000
        })
        router.push("/mywallets");
        
        return
    }

    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)

    const Result: any = await GetMyLastMsg(currentWallet.jwk, processTxId);
    console.log("GetMyLastMsg Result", Result)
    if(Result) {
      setResultText(Result)
      toast.success("GetMyLastMsg Success", { duration: 4000 })
      setIsDisabledButton(false)
      setUploadingButton(`${t('Submit')}`)
      //setprocessTxId("")
      //setMessage("")
      //setTags("")
    }

  }


  return (
    <Fragment>
        <Card>
        <CardHeader title={`${t('Get My Last Msg')}`} />
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
                    <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                        {uploadingButton}
                    </Button>
                </Grid>

                <Grid item xs={12} container justifyContent="flex-start">
                    <Link href={`https://www.ao.link/message/${resultText}`} target='_blank'>
                        <Typography variant='body2'>
                            {resultText.id}
                        </Typography>
                    </Link>
                </Grid>

            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

export default GetMyLastMsgModel
