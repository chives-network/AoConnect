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

import { GetMyInboxMsg } from 'src/functions/AoConnectLib'

const processTxId = "K5P_L9KdbbvORnde7_0JXaix1Cn9_FWGfUKMjFR3GUw"

const Inbox = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()
  const { datasetId } = props

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress


  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [pageData, setPageData] = useState<any>({name: '', type: 'File', files: [], csvs: [], trainingMode: 'Chunk Split', processWay: 'Auto process', datasetId: datasetId, FormAction: 'addInbox', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg', openEdit: false, openDelete: false })

  const [uploadProgress, setUploadProgress] = useState<any>({files: {}, csvs: {}})

  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    fetchData(paginationModel)
    setIsLoading(false)
  }, [paginationModel, counter, isMobileData, auth, datasetId])

  const fetchData = async function (paginationModel: any) {
    if (currentAddress && processTxId) {
      //const RS = await GetMyInboxMsg(currentWallet.jwk, processTxId)
      //console.log("RS", RS)
      //setStore(RS)  
    }
  }
  
  useEffect(() => {


  }, [pageData])


  
  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 50,
      field: 'name',
      headerName: `${t(`Name`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'dataTotal',
      headerName: `${t(`DataTotal`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {row.dataTotal}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'updateTime',
      headerName: `${t(`UpdateTime`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {row.updateTime}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'status',
      headerName: `${t(`Status`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {row.status}
          </Typography>
        )
      }
    },
    {
      flex: 0.05,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: t('Actions') as string,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('Delete')}>
            <IconButton size='small' onClick={
                        () => { setPageData( () => ({ ...row, openEdit: false, openDelete: true, FormAction: 'deleteInbox', FormTitle: 'Delete', FormSubmit: 'Confirm', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
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
            {pageData.openEdit == false ?
              <Grid container>
                  <Grid item xs={12} lg={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ my: 3, ml: 5 }}>{t('Dataset')}</Typography>
                      <Button sx={{ my: 3, mr: 5 }} size="small" variant='outlined' onClick={
                          () => { setPageData( (prevState: any) => ({ ...prevState, openEdit: true, FormAction: 'addInbox', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
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
            : 
              <Fragment></Fragment>
            }

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

