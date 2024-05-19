// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

import JSONTree from 'react-json-tree'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

import { AoGetMessage } from 'src/functions/AoConnectLib'
import AnsiText from './AnsiText'


const AoGetMessageModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()
    
  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [resultText, setResultText] = useState<any>()

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
  
  const [message, setMessage] = useState<string>("JQbi-qZBHWQCCl3BoPEwWOfGzNlYhxK0DmlwQlBb4cM")
  const [messageError, setMessageError] = useState<string | null>(null)
  const handlemessageChange = (event: any) => {
    setMessage(event.target.value);
    setMessageError("")
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

    const Result: any = await AoGetMessage(processTxId, message);
    console.log("AoGetMessage Result", Result)
    if(Result) {
      setResultText(Result)
      console.log("AoGetMessageModel","handleSubmit","processTxId:", processTxId, "message:", message, "Result:", Result)
      toast.success("AoGetMessage Success", { duration: 4000 })
      //setprocessTxId("")
      //setMessage("")
      //setTags("")
    }
    setIsDisabledButton(false)
    setUploadingButton(`${t('Submit')}`)

  }

  const [isReactJson, setIsReactJson] = useState<boolean>(false)
  useEffect(()=>{
    setIsReactJson(false)
  }, [])

  

  return (
    <Fragment>
        <Card>
        <CardHeader title={`${t('Get Message')}`} />
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
                        helperText={
                            <Fragment>
                                <Link href={`https://cookbook_ao.g8way.io/concepts/processes.html`} target='_blank'>
                                    {'Process Concept'}
                                </Link>
                                <Link href={`https://www.ao.link/processes`} target='_blank' sx={{ml: 4}}>
                                    {'All Processes'}
                                </Link>
                                <Link href={`https://www.ao.link/entity/${processTxId}`} target='_blank' sx={{ml: 4}}>
                                    {'Detail on AOLink'}
                                </Link>
                            </Fragment>
                            }
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={`${t('messageTxId')}`}
                        placeholder={`${t('messageTxId')}`}
                        value={message}
                        onChange={handlemessageChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!messageError}
                        helperText={
                            <Fragment>
                                <Link href={`https://cookbook_ao.g8way.io/concepts/messages.html`} target='_blank'>
                                    {'Messages Concept'}
                                </Link>
                                <Link href={`https://www.ao.link/message/${message}`} target='_blank' sx={{ml: 4}}>
                                    {'Detail on AOLink'}
                                </Link>
                            </Fragment>
                            }
                    />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                    {resultText && (
                    <Button variant='outlined' size='small' sx={{ mr:3 }} onClick={()=>setResultText(null)} disabled={isDisabledButton} >
                        {t('Cannel')}
                    </Button>
                    )}
                    <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                        {uploadingButton}
                    </Button>
                </Grid>

                <Grid item xs={12} container justifyContent="flex-start">
                    <Typography variant='body2'>
                        {resultText && resultText.Output && resultText.Output.data && resultText.Output.data.output && 
                        (
                            <AnsiText text={resultText.Output.data.output} />
                        )
                        }
                        {resultText && resultText.Output && resultText.Output.data && typeof resultText.Output.data == 'string' && 
                        (
                            <AnsiText text={resultText.Output.data} />
                        )
                        }
                        {resultText && typeof resultText == 'object' && 
                        <Box
                            sx={{
                                borderRadius: '5px',
                                padding: '8px',
                                marginTop: '5px',
                                whiteSpace: 'pre-line',
                                border: (theme: any) => `1px solid ${theme.palette.divider}`,
                                borderColor: (theme: any) => `rgba(${theme.palette.customColors.main}, 0.25)`
                            }} >
                            <JSONTree data={{data: resultText}} />
                        </Box>
                        }
                    </Typography>
                </Grid>

            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

export default AoGetMessageModel
