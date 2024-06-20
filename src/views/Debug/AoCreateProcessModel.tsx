// ** React Imports
import { Fragment, useState } from 'react'

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

import { AoCreateProcess } from 'src/functions/AoConnect/AoConnect'

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

  const [moduleTxId, setmoduleTxId] = useState<string>(authConfig.AoConnectModule)
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
  
  const [scheduler, setScheduler] = useState<string>(authConfig.AoConnectScheduler)
  const [schedulerError, setSchedulerError] = useState<string | null>(null)
  const handleschedulerChange = (event: any) => {
    setScheduler(event.target.value);
    setSchedulerError("")
  };

  const [tags, setTags] = useState<string>('[ \n{ "name": "Your-Tag-Name", "value": "Your-Tag-Value" }, \n{ "name": "Creator", "value": "Chives-Network" } \n]')
  const [tagsError, setTagsError] = useState<string | null>(null)
  const handleTagsChange = (event: any) => {
    setTags(event.target.value);
    setTagsError("")
  };

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

    const processId: any = await AoCreateProcess(currentWallet.jwk, moduleTxId, String(scheduler), JSON.parse(tags));

    if(processId && processId.length == 43) {
      toast.success(processId, { position: 'top-right', duration: 4000 })
      setResultText(processId)
    }
    setIsDisabledButton(false)
    setUploadingButton(`${t('Submit')}`)

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

                <Grid item xs={12} container justifyContent="flex-start">
                    {t('Result')}:
                    <Link href={authConfig.AoConnectAoLink + `/entity/${resultText}`} target='_blank'>
                        <Typography variant='body2'>
                            {resultText}
                        </Typography>
                    </Link>

                </Grid>

            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

export default AoCreateProcessModel
