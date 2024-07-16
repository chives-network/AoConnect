// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'

import { formatHash, formatTimestampDateTime } from 'src/configs/functions'
import { GetMyInboxMsg } from 'src/functions/AoConnect/AoConnect'
import { GetChatRecordsFromLocalStorage, GetAoConnectReminderProcessTxId } from 'src/functions/AoConnect/MsgReminder'

import ViewMessage from './ViewMessage'

const Inbox = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [isViewModel, setIsViewModel] = useState<boolean>(false)
  const [viewInfo, setViewInfo] = useState<any>()

  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>({data:[], total:0});
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    setIsLoading(true)
    GetChatRecordsFromLocalStorageInbox(paginationModel)
    setIsLoading(false)
  }, [paginationModel, counter, isMobileData, auth])

  const GetMyInboxMsgFromAoConnect = async function () {
    setIsLoading(true)
    setIsDisabledButton(true)
    const GetMyCurrentProcessTxIdData: string = GetAoConnectReminderProcessTxId()
    if (currentAddress && GetMyCurrentProcessTxIdData) {
      const RS = await GetMyInboxMsg(currentWallet.jwk, GetMyCurrentProcessTxIdData)
      console.log("RS", RS, "GetMyCurrentProcessTxIdData", GetMyCurrentProcessTxIdData)
      setCounter(counter+1)
    }
    setIsLoading(false)
    setIsDisabledButton(false)
  }
  
  const GetChatRecordsFromLocalStorageInbox = async function (paginationModel: any) {
    const channelId = "AAAAAA"
    const GetMyCurrentProcessTxIdData: string = GetAoConnectReminderProcessTxId()
    const GetChatRecordsFromLocalStorageData = await GetChatRecordsFromLocalStorage(GetMyCurrentProcessTxIdData, channelId, paginationModel.page, paginationModel.pageSize)
    console.log("GetChatRecordsFromLocalStorageData", GetChatRecordsFromLocalStorageData, paginationModel)
    setStore(GetChatRecordsFromLocalStorageData)
  }

  //Loading the all Inbox to IndexedDb
  useEffect(() => {
    //GetMyInboxMsgFromAoConnect()
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
      flex: 12,
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
      flex: 2,
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
      flex: 2,
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
      flex: 2,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: t('Actions') as string,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('View')}>
            <IconButton size='small' onClick={
                        () => { setIsViewModel(true); setViewInfo(row); }
                    }>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

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
                      <Button sx={{ my: 3, mr: 5 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                          () => { GetMyInboxMsgFromAoConnect() }
                      }>
                      {t("Download Messages")}
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
                  {isViewModel && <ViewMessage viewInfo={viewInfo} isViewModel={isViewModel} setIsViewModel={setIsViewModel} /> }
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

