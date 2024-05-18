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

import { AoCreateProcess } from 'src/functions/AoConnectLib'

const AoCreateProcessModel = () => {
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

  const [moduleTxId, setmoduleTxId] = useState<string>("jZDEO4iDcPj5WjdelJE6GeHaWM6ZuPGFHI55eYvBdaU")
  const [moduleTxIdError, setmoduleTxIdError] = useState<string | null>(null)
  const handlemoduleTxIdChange = (event: any) => {
    setmoduleTxId(event.target.value);
    if(event.target.value.length != 43) {
        setmoduleTxIdError(`${t('moduleTxId length must be 43')}`)
    }
    else {
        setmoduleTxIdError("")
    }
    
    console.log("moduleTxId", moduleTxId)
  };
  
  const [scheduler, setScheduler] = useState<string>("fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY")
  const [schedulerError, setSchedulerError] = useState<string | null>(null)
  const handleschedulerChange = (event: any) => {
    setScheduler(event.target.value);
    setSchedulerError("")
  };

  const [tags, setTags] = useState<string>('[ \n{ "name": "Your-Tag-Name-Here", "value": "your-tag-value" }, \n{ "name": "Another-Tag", "value": "another-value" } \n]')
  const [tagsError, setTagsError] = useState<string | null>(null)
  const handleTagsChange = (event: any) => {
    setTags(event.target.value);
    setTagsError("")
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

    const processId: any = await AoCreateProcess(currentWallet.jwk, moduleTxId, String(scheduler), JSON.parse(tags));

    if(processId && processId.length == 43) {
      toast.success(processId, { duration: 4000 })
      setResultText(processId)
      setIsDisabledButton(false)
      setUploadingButton(`${t('Submit')}`)
      //setmoduleTxId("")
      //setScheduler("")
      //setTags("")
    }

  }


  return (
    <Fragment>
        <Card>
        <CardHeader title={`${t('Create Process')}`} />
        <CardContent>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={`${t('moduleTxId')}`}
                        placeholder={`${t('moduleTxId')}`}
                        value={moduleTxId}
                        onChange={handlemoduleTxIdChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!moduleTxIdError}
                        helperText={moduleTxIdError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={`${t('Scheduler')}`}
                        placeholder={`${t('Scheduler')}`}
                        value={scheduler}
                        onChange={handleschedulerChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!schedulerError}
                        helperText={schedulerError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label={`${t('Tags')}`}
                        placeholder={`${t('Tags')}`}
                        sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:scheduler-outline' />
                                </InputAdornment>
                            )
                        }}                        
                        value={tags}
                        onChange={handleTagsChange}
                        error={!!tagsError}
                        helperText={tagsError}
                    />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                    <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                        {uploadingButton}
                    </Button>
                </Grid>

                <Grid item xs={12} container justifyContent="flex-start">
                    {t('Result')}:
                    <Link href={`https://www.ao.link/entity/${resultText}`} target='_blank'>
                        {resultText}
                    </Link>

                </Grid>

            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

export default AoCreateProcessModel
