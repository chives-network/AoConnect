// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import { CheckPermission } from 'src/functions/ChatBook'

import { formatHash, formatTimestampDateTime } from 'src/configs/functions'
import { GetMyInboxMsg, GetMyCurrentProcessTxId } from 'src/functions/AoConnectLib'
import { GetInboxMsgFromIndexedDb } from 'src/functions/AoConnectMsgReminder'

const Inbox = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()
  const { datasetId } = props

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)

  const [uploadProgress, setUploadProgress] = useState<any>({files: {}, csvs: {}})

  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    GetInboxMsgFromIndexedDbInbox(paginationModel)
    setIsLoading(false)
  }, [paginationModel, counter, isMobileData, auth, datasetId])

  const GetMyInboxMsgFromAoConnect = async function (paginationModel: any) {
    const GetMyCurrentProcessTxIdData: string = GetMyCurrentProcessTxId(currentAddress, 0)
    if (currentAddress && GetMyCurrentProcessTxIdData) {
      const RS = await GetMyInboxMsg(currentWallet.jwk, GetMyCurrentProcessTxIdData)
      console.log("RS", RS, "GetMyCurrentProcessTxIdData", GetMyCurrentProcessTxIdData)
      if(RS && RS.msg) {
        setStore({data: RS.msg, total: RS.msg.length})
      }
    }
  }
  
  const GetInboxMsgFromIndexedDbInbox = async function (paginationModel: any) {
    const GetInboxMsgFromIndexedDbData = await GetInboxMsgFromIndexedDb(paginationModel.page, paginationModel.pageSize)
    console.log("GetInboxMsgFromIndexedDbData", GetInboxMsgFromIndexedDbData, paginationModel)
    setStore(GetInboxMsgFromIndexedDbData)
  }


  //Loading the all Inbox to IndexedDb
  useEffect(() => {
    //GetMyInboxMsgFromAoConnect(paginationModel)
  }, [])


  
  const columns: GridColDef[] = [
    {
      flex: 10,
      minWidth: 50,
      field: 'From',
      headerName: `${t(`From`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {formatHash(row.From, 8)}
          </Typography>
        )
      }
    },
    {
      flex: 6,
      minWidth: 100,
      field: 'BlockHeight',
      headerName: `${t(`BlockHeight`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {row['BlockHeight']}
          </Typography>
        )
      }
    },
    {
      flex: 20,
      minWidth: 100,
      field: 'Data',
      headerName: `${t(`Data`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {row.Data}
          </Typography>
        )
      }
    },
    {
      flex: 10,
      minWidth: 100,
      field: 'Timestamp',
      headerName: `${t(`Timestamp`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {formatTimestampDateTime(row.Timestamp)}
          </Typography>
        )
      }
    },
    {
      flex: 6,
      minWidth: 100,
      field: 'Type',
      headerName: `${t(`Type`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {row.Type}
          </Typography>
        )
      }
    },
    {
      flex: 6,
      minWidth: 100,
      field: 'Ref',
      headerName: `${t(`Ref`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {row.Ref_}
          </Typography>
        )
      }
    },
    {
      flex: 6,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: t('Actions') as string,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('Delete')}>
            <IconButton size='small' onClick={
                        () => {  }
                    }>
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleSubmit = async () => {

    if (currentAddress) {
      setIsDisabledButton(true)
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/' + pageData.FormAction, pageData, { headers: { 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit:", FormSubmit)
      if(FormSubmit?.status == "ok") {
          toast.success(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
          setPageData({openEdit: false, name: '', type: 'File', files: [], csvs: [], trainingMode: 'Chunk Split', processWay: 'Auto process', updateTime: 0, status: 100, expiredTime: '', authCheck: '', datasetId: datasetId})
      }
      else {
          toast.error(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
          if(FormSubmit && FormSubmit.msg=='Token is invalid') {
            
            //CheckPermission(auth, router, true)
          }
      }
      setCounter(counter + 1)
      setIsDisabledButton(false)
    }

  }

  return (
    <Fragment>
      {currentAddress ?
      <Grid container>
      {store && store.data != undefined ?
        <Grid item xs={12}>
          <Card>
            <Grid container>
                  <Grid item xs={12} lg={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ my: 3, ml: 5 }}>{t('Dataset')}</Typography>
                      <Button sx={{ my: 3, mr: 5 }} size="small" variant='outlined' onClick={
                          () => {  }
                      }>
                      {t("Add Data Source")}
                      </Button>
                  </Grid>
                  <DataGrid
                      autoHeight
                      rows={store.data}
                      rowCount={store.total as number}
                      columns={columns}
                      sortingMode='server'
                      paginationMode='server'
                      filterMode="server"
                      loading={isLoading}
                      disableRowSelectionOnClick
                      pageSizeOptions={[10, 15, 20, 30, 50, 100]}
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      disableColumnMenu={true}
                  />
            </Grid>

          </Card>
        </Grid>
        :
        <Fragment></Fragment>
      }
      </Grid>
      :
      null
      }
    </Fragment>
  )
}

export default Inbox

