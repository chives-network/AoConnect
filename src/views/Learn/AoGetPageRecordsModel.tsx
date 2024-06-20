// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

import authConfig from 'src/configs/auth'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

import { AoGetPageRecords } from 'src/functions/AoConnect/AoConnect'
import AnsiText from './AnsiText'



const AoGetPageRecordsModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()
    
  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [resultRecords, setresultRecords] = useState<any>()

  const auth = useAuth()
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
            position: 'top-right', 
            duration: 4000
        })
        router.push("/mywallets");
        
        return
    }

    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)

    const Result: any = await AoGetPageRecords(processTxId, 'DESC', 10, '');
    console.log("AoGetPageRecords Result", Result)
    if(true) {
      setresultRecords(Result)
      toast.success("AoGetPageRecords Success", { position: 'top-right', duration: 4000 })
    }
    setIsDisabledButton(false)
    setUploadingButton(`${t('Submit')}`)

  }


  return (
    <Fragment>
        <Card>
        <CardHeader title={`${t('Get Page Records')}`} />
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
                                <Link href={authConfig.AoConnectAoLink + `/processes`} target='_blank' sx={{ml: 4}}>
                                    {'All Processes'}
                                </Link>
                                <Link href={authConfig.AoConnectAoLink + `/entity/${processTxId}`} target='_blank' sx={{ml: 4}}>
                                    {'Detail on AOLink'}
                                </Link>
                            </Fragment>
                            }
                    />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                    {resultRecords && (
                    <Button variant='outlined' size='small' sx={{ mr:3 }} onClick={()=>setresultRecords(null)} disabled={isDisabledButton} >
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
                    <TableContainer>
                        <Table size='small' sx={{ width: '95%' }}>
                            <TableBody
                            sx={{
                                '& .MuiTableCell-root': {
                                border: 0,
                                pt: 2,
                                pb: 2.5,
                                pl: '0 !important',
                                pr: '0 !important',
                                '&:first-of-type': {
                                    width: 148
                                }
                                }
                            }}
                            >

                            {resultRecords && resultRecords.edges && resultRecords.edges.length > 0 && resultRecords.edges.map((item: any, index: number)=>{
                                
                                const JsonData = item.node.Output.data
                                console.log("JsonData", typeof JsonData, JsonData)

                                if(typeof JsonData === 'string')  {

                                    return (
                                        <TableRow key={index}>
                                            <TableCell sx={{width: '5%'}}>
                                                {index+1}
                                            </TableCell>
                                            <TableCell>
                                                <AnsiText text={JsonData} />
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                else if(typeof JsonData === 'object' && typeof JsonData.output == 'string')  {

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {index}
                                            </TableCell>
                                            <TableCell>
                                                <AnsiText text={JsonData.output} />
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                else if(typeof JsonData === 'object' && Object.keys(JsonData).includes('output'))  {

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {index}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    {JSON.stringify(JsonData)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                
                            })}
                            

                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                </Grid>

                

            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

export default AoGetPageRecordsModel
