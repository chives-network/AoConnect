
// ** React Imports
import { Fragment, memo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import CircularProgress from '@mui/material/CircularProgress'

import Grid from '@mui/material/Grid'

import Pagination from '@mui/material/Pagination'

const TokenListOfficial = (prop: any) => {
  
  const { tokenGetInfor, setTokenGetInfor, setPageId, pageId, pageCount, startIndex, pageSize } = prop

  const { t } = useTranslation()

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageId(page)
    console.log("TokenListOfficial handlePageChange 1", event)
  }  
  console.log("TokenListOfficial -------------------- handlePageChange 2", pageId, pageCount, tokenGetInfor)
  
  const TokenBalances: any[] = tokenGetInfor && tokenGetInfor.TokenBalancesAllRecords && tokenGetInfor.TokenBalancesAllRecords.length>0 ? tokenGetInfor.TokenBalancesAllRecords.slice(pageId * pageSize - pageSize, (pageId) * pageSize) : null

  return (
    <Box
        sx={{
            py: 3,
            px: 5,
            display: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
        >
        <TableContainer>
            <Table>
            <TableBody>
            <TableRow sx={{my: 0, py: 0}}>
                <TableCell sx={{my: 0, py: 0}}>
                    Id
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Holder
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Amount
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Operation
                </TableCell>
            </TableRow>
            {TokenBalances && TokenBalances.map((Item: any, Index: number)=>{

                return (
                    <Fragment key={Index}>
                        {Item.length == 0 &&  (
                            <TableRow key={Index} sx={{my: 0, py: 0}}>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Number(startIndex) + Index}</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'info.main', pr: 1, display: 'inline', my: 0, py: 0 }}>......</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'info.main', pr: 1, display: 'inline', my: 0, py: 0 }}>......</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Button sx={{textTransform: 'none', my: 0}} size="small" disabled variant='outlined'>
                                    {t("Send")}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        {Item.length > 0 &&  (
                            <TableRow key={Index} sx={{my: 0, py: 0}}>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Number(pageId * pageSize - pageSize) + Index + 1}</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'info.main', pr: 1, display: 'inline', my: 0, py: 0 }}>{Item[0]}</Typography>
                                    {Item[0] && (
                                        <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                                            navigator.clipboard.writeText(Item[0]);
                                        }}>
                                            <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                                        </IconButton>
                                    )}
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Item[1]}</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Button sx={{textTransform: 'none', my: 0}} size="small" disabled={tokenGetInfor.disabledSendOutButton || tokenGetInfor.TokenProcessTxId == Item[0]} variant='outlined' onClick={
                                        () => { setTokenGetInfor((prevState: any)=>({
                                            ...prevState,
                                            openSendOutToken: true,
                                            SendOutToken: Item,
                                        })) }
                                    }>
                                    {t("Send")}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </Fragment>
                )
                
            })}
        
            </TableBody>
            </Table>

            {tokenGetInfor && TokenBalances == null && (
                <Box sx={{ pl: 5, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                        <CircularProgress />
                        <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', ml: 5, pt: 0 }}>{t('Loading token holders...')}</Typography>
                    </Grid>
                    </Box>
                </Box>
            )}

            {pageCount > 0 && (
                <Box sx={{ pl: 5, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                        <Pagination count={pageCount} variant='outlined' color='primary' page={pageId} onChange={handlePageChange} siblingCount={1} boundaryCount={1} />
                    </Grid>
                    </Box>
                </Box>
            )}

        </TableContainer>

    </Box>
  );
  
}


export default memo(TokenListOfficial)
