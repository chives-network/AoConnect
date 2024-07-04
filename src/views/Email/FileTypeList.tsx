// ** React Imports
import { useState, useEffect, Fragment, SyntheticEvent } from 'react'

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

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/email'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import Pagination from '@mui/material/Pagination'

import ImageRectangle from 'src/views/portal/ImageRectangle'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Axios Imports
import axios from 'axios'

// ** Next Import
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'

import StringDisplay from 'src/pages/preview/StringDisplay'

import { winstonToAr } from 'src/functions/ChivesWallets'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'

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


const FileResourceModel = ({ activeTab } : any) => {
  // ** Hook
  const { t } = useTranslation()
  
  const router = useRouter()

  const auth = useAuth()

  const id = auth.currentAddress

  const isMobileData = isMobile()

  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 8 })
  
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.email)

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

  useEffect(() => {
    if(true && id && id.length == 43) {
      dispatch(
        fetchData({
          folder: 'Inbox',
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
        })
      )
    }
  }, [dispatch, paginationModel, activeTab, id])

  const handleChange = (event: SyntheticEvent, value: string) => {
    router
      .push({
        pathname: `/myfiles/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
      console.log("handleChange", event, isLoading)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Grid container spacing={6}>

    {id != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${t(`My Files`)}`} />
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

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            {`${t(`Total transactions`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{store.total}</TableCell>
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
              value='image'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:account-outline' />
                  Image
                </Box>
              }
            />
            <Tab
              value='video'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bookmark-outline' />
                  Video
                </Box>
              }
            />
            <Tab
              value='pdf'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Pdf
                </Box>
              }
            />
            <Tab
              value='word'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Word
                </Box>
              }
            />
            <Tab
              value='excel'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Excel
                </Box>
              }
            />
            <Tab
              value='pptx'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  PPT
                </Box>
              }
            />
            <Tab
              value='stl'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Stl
                </Box>
              }
            />
          </TabList>
        </TabContext>

        <Card sx={{ padding: '0 8px' }}>
          <CardHeader title={`${activeTab?.toUpperCase()}`} />
          {store && store.data !== undefined ? (
            <Fragment>
              <Grid container spacing={2}>
                {store.data.map((item: TxRecordType, index: number) => (
                  <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
                    <ImageRectangle item={item} backEndApi={authConfig.backEndApi} FileType={activeTab}/>
                  </Grid>
                ))}
              </Grid>
              <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                <Pagination  count={Number(store?.allPages)} variant='outlined' color='primary' page={paginationModel.page+1} onChange={handlePageChange} siblingCount={2} boundaryCount={3} />
              </Grid>
            </Fragment>
          ) : (
            <Fragment></Fragment>
          )}
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default FileResourceModel
