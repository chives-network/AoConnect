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

import { AoGetPageRecords } from 'src/functions/AoConnectLib'

const AnsiText = ({ text }: any) => {
    
    // 正则表达式匹配 ANSI 转义码
    const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    const formatText = text.replace(ansiRegex, '');
  
    return  <Box
                sx={{
                    borderRadius: '5px',
                    padding: '8px',
                    whiteSpace: 'pre-line',
                    border: (theme: any) => `1px solid ${theme.palette.divider}`,
                    borderColor: (theme: any) => `rgba(${theme.palette.customColors.main}, 0.25)`
                }} >
                {formatText}
            </Box>
  };

const AoGetPageRecordsModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()
    
  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [resultRecords, setresultRecords] = useState<any>()

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

    const Result: any = await AoGetPageRecords(processTxId, 'DESC', 10, '');
    console.log("AoGetPageRecords Result", Result)
    if(true) {
      setresultRecords(Result)
      toast.success("AoGetPageRecords Success", { duration: 4000 })
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
                        helperText={processTxIdError}
                    />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
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
                                        <TableRow>
                                            <TableCell sx={{width: '5%'}}>
                                                {index+1}
                                            </TableCell>
                                            <TableCell>
                                                <AnsiText text={JsonData} />
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                else if(typeof JsonData === 'object' && Object.keys(JsonData).includes('json'))  {

                                    return (
                                        <TableRow>
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