// ** React Imports
import { useState, useEffect, Fragment, SyntheticEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatTimestampAge, formatStorageSize } from 'src/configs/functions';

// ** Context
import { useAuth } from 'src/hooks/useAuth'

import FormatTxInfoInRow from 'src/pages/preview/FormatTxInfoInRow';

// ** Next Import
import { useRouter } from 'next/router'

import StringDisplay from 'src/pages/preview/StringDisplay'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

import { winstonToAr } from 'src/functions/ChivesWallets'

import UploadFiles from 'src/views/form/uploadfiles';
import SendOut from 'src/views/form/sendout';
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import Pagination from '@mui/material/Pagination'

interface TransactionCellType {
  row: TxRecordType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 550,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const LinkStyledNormal = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** Styled Tab component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}))


const MyWalletModel = ({ activeTab } : any) => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  const auth = useAuth()

  const id = auth.currentAddress

  const paginationModelDefaultValue = { page: 0, pageSize: 15 }
  const [paginationModel, setPaginationModel] = useState(paginationModelDefaultValue)  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page:page-1 });
    console.log("handlePageChange", event)
  }  
  const isMobileData = isMobile()

  // ** State
  const [isLoading, setIsLoading] = useState(false);

  // ** Hooks
  const store: any = null

  const [addressBalance, setAddressBalance] = useState<string>('')

  useEffect(() => {
    if(id != undefined && id.length == 43) {
      axios
        .get(authConfig.backEndApi + '/wallet/' + id + "/balance", { headers: { }, params: { } })
        .then(res => {
          setAddressBalance(winstonToAr(res.data));
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
    }
  }, [id])

  const handleChange = (event: SyntheticEvent, value: string) => {
    router
      .push({
        pathname: `/wallet/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
      console.log("handleChangeEvent", event)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  function parseTxFeeAndBundleId(TxRecord: TxRecordType) {
    if(TxRecord.bundleid && TxRecord.bundleid!="") {
    
      return (
        <Tooltip title={`BundleId: ${TxRecord.bundleid}`}>
          <LinkStyledNormal href={`/txs/view/${TxRecord.bundleid}`}>{formatHash(TxRecord.bundleid, 5)}</LinkStyledNormal>
        </Tooltip>
      )
    }
  
    return formatXWE(TxRecord.fee.winston, 6);
  }
  
  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'TxId',
      headerName: t(`TxId`) as string,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/txs/view/${row.id}`}>{formatHash(row.id, 7)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'From',
      headerName: t(`From`) as string,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/wallet/all/`}>{formatHash(row.owner.address, 7)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      headerName: t(`Size`) as string,
      field: 'Size',
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatStorageSize(row.data.size)}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Fee',
      headerName: t(`Fee`) as string,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatXWE(row.fee.winston, 6)}
          </Typography>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'Info',
      headerName: t(`Info`) as string,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            <FormatTxInfoInRow TxRecord={row}/>
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'Height',
      headerName: t(`Height`) as string,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/blocks/view/${row.block.height}`}>{row.block.height}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'Time',
      minWidth: 220,
      headerName: t(`Time`) as string,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatTimestampAge(row.block.timestamp)}
          </Typography>
        )
      }
    }
  ]

  
  return (
    <Grid container spacing={6}>

    {id != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${t(`My Wallet`)}`} />
          <CardContent>
            <Grid container spacing={6}>

              <Grid item xs={12} lg={12}>
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
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Address`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {id && id.length == 43 ?
                            <Fragment>                              
                              {isMobileData == true ?
                                <StringDisplay InputString={String(id)} StringSize={10} href={null}/>
                                :
                                <StringDisplay InputString={String(id)} StringSize={25} href={null}/>
                              }
                            </Fragment>
                            :
                            <Fragment>{`${t(`No Address`)}`}</Fragment>
                          }
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Balance`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{addressBalance} {authConfig.tokenName}</TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

            </Grid>
          </CardContent>

        </Card>
      </Grid>
    :
      <Fragment></Fragment>
    }

      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='forced scroll tabs example'
          >
            <Tab
              value='sendout'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='material-symbols:send' />
                  {`${t(`Send`)}`}
                </Box>
              }
            />
            <Tab
              value='uploadfiles'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='material-symbols:backup' />
                  {`${t(`Upload Files`)}`}
                </Box>
              }
            />
          </TabList>
        </TabContext>
          {store && store.data != undefined && activeTab != "sendout" && activeTab !="uploadfiles" ?
            <Fragment>
              {isMobileData ? 
              <Fragment>
                {store.data.map((row: any, index: number) => {
                  return (
                      <Grid item xs={12} sx={{ py: 0, mt: 5 }} key={index}>
                        <Card>
                          <CardContent>      
                            <TableContainer>
                              <Table size='small' sx={{ width: '95%' }}>
                                <TableBody
                                  sx={{
                                    '& .MuiTableCell-root': {
                                      border: 0,
                                      pb: 1.5,
                                      pl: '0 !important',
                                      pr: '0 !important',
                                      '&:first-of-type': {
                                        width: 148
                                      }
                                    }
                                  }}
                                >
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                      {`${t(`TxId`)}`}：<StringDisplay InputString={`${row.id}`} StringSize={7} href={`/txs/view/${row.id}`}/>
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                      {`${t(`From`)}`}：<StringDisplay InputString={`${row.owner.address}`} StringSize={7} href={`/addresses/all/${row.owner.address}`}/>
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                      {`${t(`Size`)}`}：{formatStorageSize(row.data.size)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                      {`${t(`Fee`)}`}：{parseTxFeeAndBundleId(row)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                      {`${t(`Info`)}`}：<FormatTxInfoInRow TxRecord={row}/>
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                      {`${t(`Height`)}`}：<StringDisplay InputString={`${row.block.height}`} StringSize={7} href={`/blocks/view/${row.block.height}`}/>
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                      {`${t(`Time`)}`}：{formatTimestampAge(row.block.timestamp)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>

                                </TableBody>
                              </Table>
                            </TableContainer>
                          </CardContent>      
                        </Card>
                      </Grid>
                  )
                })}
                <Box sx={{ pl: 5, py: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                      <Pagination count={Math.ceil(store.total/paginationModel.pageSize)} variant='outlined' color='primary' page={paginationModel.page+1} onChange={handlePageChange} siblingCount={1} boundaryCount={1} />
                    </Grid>
                  </Box>
                </Box>
              </Fragment>
              :
              <Card>
                <CardHeader title={`${t(`Transactions`)}`} />
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
              </Card>              
              }
            </Fragment>
          :
            <Fragment></Fragment>
          }
          {activeTab == "sendout" ?
            <Card>
              <CardContent>
                <SendOut />
              </CardContent>
            </Card>
          :
            <Fragment></Fragment>
          }
          {activeTab == "uploadfiles" ?
            <Card>
              <CardContent>
                <UploadFiles />
              </CardContent>
            </Card>
          :
            <Fragment></Fragment>
          }
      </Grid>
    </Grid>
  )
}


export default MyWalletModel
