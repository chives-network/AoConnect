
// ** React Imports
import { Fragment, memo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from 'src/hooks/useAuth'

import Grid from '@mui/material/Grid'

import Pagination from '@mui/material/Pagination'
import toast from 'react-hot-toast'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintChivesServerData, 
    ChivesServerDataGetTokens, ChivesServerDataAddToken, ChivesServerDataDelToken, 
    ChivesServerDataGetChatrooms, ChivesServerDataAddChatroom, ChivesServerDataDelChatroom, 
    ChivesServerDataGetLotteries, ChivesServerDataAddLottery, ChivesServerDataDelLottery, 
    ChivesServerDataGetGuesses, ChivesServerDataAddGuess, ChivesServerDataDelGuess, 
    ChivesServerDataGetBlogs, ChivesServerDataAddBlog, ChivesServerDataDelBlog, 
    ChivesServerDataGetSwaps, ChivesServerDataAddSwap, ChivesServerDataDelSwap, 
    ChivesServerDataGetProjects, ChivesServerDataAddProject, ChivesServerDataDelProject
   } from 'src/functions/AoConnect/ChivesServerData'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;


const SettingModel = () => {
  
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [serverModel, setServerModel] = useState<string>("Token")
  const [serverTxId, setServerTxId] = useState<string>("91uljP8YzSKu01C73xDJNlAs6jcZIboWbsgkPnB-Ks4")
  const [serverData, setServerData] = useState<any>({})

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [chivesServerDataTxIdError, setChivesServerDataTxIdError] = useState<string>('')

  const handleGetServerData = async (Model: string) => {
    setServerModel(Model)
    setIsDisabledButton(true)
    const ChivesServerData = serverTxId
    setServerData((prevState: any)=>({
        ...prevState,
        [Model]: null
    }))
    switch(Model) {
        case 'Token':
            const ChivesServerDataGetTokensData1 = await ChivesServerDataGetTokens(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetTokensData1) {
                console.log("ChivesServerDataGetTokensData1", ChivesServerDataGetTokensData1)
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: ChivesServerDataGetTokensData1
                }))
                console.log("ChivesServerDataGetTokensData1 serverData", serverData)
            }
            break;
        case 'Chatroom':
            const ChivesServerDataGetChatroomsData1 = await ChivesServerDataGetChatrooms(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetChatroomsData1) {
                console.log("ChivesServerDataGetChatroomsData1", ChivesServerDataGetChatroomsData1)
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: ChivesServerDataGetChatroomsData1
                }))
                console.log("ChivesServerDataGetChatroomsData1 serverData", serverData)
            }
            break;
        case 'Lottery':
            const ChivesServerDataGetLotteriesData1 = await ChivesServerDataGetLotteries(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetLotteriesData1) {
                console.log("ChivesServerDataGetLotteriesData1", ChivesServerDataGetLotteriesData1)
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: ChivesServerDataGetLotteriesData1
                }))
                console.log("ChivesServerDataGetLotteriesData1 serverData", serverData)
            }
            break;
        case 'Guess':
            const ChivesServerDataGetGuessesData1 = await ChivesServerDataGetGuesses(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetGuessesData1) {
                console.log("ChivesServerDataGetGuessesData1", ChivesServerDataGetGuessesData1)
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: ChivesServerDataGetGuessesData1
                }))
                console.log("ChivesServerDataGetGuessesData1 serverData", serverData)
            }
            break;
        case 'Blog':
            const ChivesServerDataGetBlogsData1 = await ChivesServerDataGetBlogs(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetBlogsData1) {
                console.log("ChivesServerDataGetBlogsData1", ChivesServerDataGetBlogsData1)
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: ChivesServerDataGetBlogsData1
                }))
                console.log("ChivesServerDataGetBlogsData1 serverData", serverData)
            }
            break;
        case 'Swap':
            const ChivesServerDataGetSwapsData1 = await ChivesServerDataGetSwaps(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetSwapsData1) {
                console.log("ChivesServerDataGetSwapsData1", ChivesServerDataGetSwapsData1)
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: ChivesServerDataGetSwapsData1
                }))
                console.log("ChivesServerDataGetSwapsData1 serverData", serverData)
            }
            break;
        case 'Project':
            const ChivesServerDataGetProjectsData1 = await ChivesServerDataGetProjects(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetProjectsData1) {
                console.log("ChivesServerDataGetProjectsData1", ChivesServerDataGetProjectsData1)
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: ChivesServerDataGetProjectsData1
                }))
                console.log("ChivesServerDataGetProjectsData1 serverData", serverData)
            }
            break;
    }
    setIsDisabledButton(false)
  }  

  const handleDeleteServerData = async (Id: string) => {
    const Model = serverModel
    setServerModel(Model)
    setIsDisabledButton(true)
    const ChivesServerData = serverTxId
    switch(Model) {
        case 'Token':
            const ChivesServerDataDelTokenData1 = await ChivesServerDataDelToken(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelTokenData1) {
                console.log("ChivesServerDataDelTokenData1", ChivesServerDataDelTokenData1)
                if(ChivesServerDataDelTokenData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelTokenData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelTokenData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                      if(formatText2) {
                        toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                      }
                    }
                  }
                }
            }
            handleGetServerData(Model)
            break;
        case 'Chatroom':
            const ChivesServerDataDelChatroomData1 = await ChivesServerDataDelChatroom(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelChatroomData1) {
                console.log("ChivesServerDataDelChatroomData1", ChivesServerDataDelChatroomData1)
                if(ChivesServerDataDelChatroomData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelChatroomData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                      if(formatText2) {
                        toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                      }
                    }
                  }
                }
            }
            handleGetServerData(Model)
            break;
        case 'Lottery':
            const ChivesServerDataDelLotteryData1 = await ChivesServerDataDelLottery(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelLotteryData1) {
                console.log("ChivesServerDataDelLotteryData1", ChivesServerDataDelLotteryData1)
                if(ChivesServerDataDelLotteryData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelLotteryData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelLotteryData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                      if(formatText2) {
                        toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                      }
                    }
                  }
                }
            }
            handleGetServerData(Model)
            break;
        case 'Guess':
            const ChivesServerDataDelGuessData1 = await ChivesServerDataDelGuess(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelGuessData1) {
                console.log("ChivesServerDataDelGuessData1", ChivesServerDataDelGuessData1)
                if(ChivesServerDataDelGuessData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelGuessData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelGuessData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                      if(formatText2) {
                        toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                      }
                    }
                  }
                }
            }
            handleGetServerData(Model)
            break;
        case 'Blog':
            const ChivesServerDataDelBlogData1 = await ChivesServerDataDelBlog(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelBlogData1) {
                console.log("ChivesServerDataDelBlogData1", ChivesServerDataDelBlogData1)
                if(ChivesServerDataDelBlogData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelBlogData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelBlogData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                      if(formatText2) {
                        toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                      }
                    }
                  }
                }
            }
            handleGetServerData(Model)
            break;
        case 'Swap':
            const ChivesServerDataDelSwapData1 = await ChivesServerDataDelSwap(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelSwapData1) {
                console.log("ChivesServerDataDelSwapData1", ChivesServerDataDelSwapData1)
                if(ChivesServerDataDelSwapData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelSwapData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelSwapData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                      if(formatText2) {
                        toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                      }
                    }
                  }
                }
            }
            handleGetServerData(Model)
            break;
        case 'Project':
            const ChivesServerDataDelProjectData1 = await ChivesServerDataDelProject(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelProjectData1) {
                console.log("ChivesServerDataDelProjectData1", ChivesServerDataDelProjectData1)
                if(ChivesServerDataDelProjectData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelProjectData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelProjectData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                      if(formatText2) {
                        toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                      }
                    }
                  }
                }
            }
            handleGetServerData(Model)
            break;
    }
    setIsDisabledButton(false)
  }  

  return (
    <Box
        sx={{
            py: 3,
            px: 5,
            display: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}
        >
        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <TextField
                                sx={{ml: 2, my: 2}}
                                size="small"
                                label={`${t('ChivesServerDataTxId')}`}
                                placeholder={`${t('ChivesServerDataTxId')}`}
                                value={serverTxId}
                                onChange={(e: any)=>{
                                    if(e.target.value && e.target.value.length == 43) {
                                        setChivesServerDataTxIdError('')
                                        setServerTxId(e.target.value)
                                    }
                                    else {
                                        setChivesServerDataTxIdError('Please set ChivesServerDataTxId first!')
                                        setIsDisabledButton(false)
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                error={!!chivesServerDataTxIdError}
                                helperText={chivesServerDataTxIdError}
                            />
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Token') }
                            }>
                            {t("Token Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Chatroom') }
                            }>
                            {t("Chatroom Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Lottery') }
                            }>
                            {t("Lottery Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Guess') }
                            }>
                            {t("Guess Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Blog') }
                            }>
                            {t("Blog Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Swap') }
                            }>
                            {t("Swap Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Project') }
                            }>
                            {t("Project Data")}
                            </Button>
                        </Box>
                    </Grid>
                </Card>
            </Grid>
        </Grid>

        <TableContainer>
            <Table>
            <TableBody>
            <TableRow sx={{my: 0, py: 0}}>
                <TableCell sx={{my: 0, py: 0}} colSpan={6}>
                    Model: {serverModel}
                </TableCell>
            </TableRow>
            <TableRow sx={{my: 0, py: 0}}>
                <TableCell sx={{my: 0, py: 0}}>
                    Id
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    HashId
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Group
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Sort
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Operation
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Data
                </TableCell>
            </TableRow>
            {serverData && serverData[serverModel] && Object.keys(serverData[serverModel]).map((Item: string, Index: number)=>{

                const Row = serverData[serverModel][Item]

                return (
                    <Fragment key={Index}>
                        {Row &&  (
                            <TableRow key={Index} sx={{my: 0, py: 0}}>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Index+1}</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'info.main', pr: 1, display: 'inline', my: 0, py: 0 }}>{Row[serverModel + 'Id']}</Typography>
                                    {Row && Row[serverModel + 'Id'] && (
                                        <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                                            navigator.clipboard.writeText(Row[serverModel + 'Id']);
                                        }}>
                                            <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                                        </IconButton>
                                    )}
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Row[serverModel + 'Group']}</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Row[serverModel + 'Sort']}</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Button sx={{textTransform: 'none', my: 0}} size="small" disabled={isDisabledButton} variant='outlined'  onClick={
                                        () => { handleDeleteServerData(Row[serverModel + 'Id']) }
                                    }>
                                    {t("Delete")}
                                    </Button>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Row[serverModel + 'Data']}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </Fragment>
                )
                
            })}
        
            </TableBody>
            </Table>

            {serverData && serverData[serverModel] == null && isDisabledButton == true && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ pl: 5, py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                                <CircularProgress />
                                <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', ml: 5, pt: 0 }}>{t('Loading Data ...')}</Typography>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            )}

            {serverData && serverData[serverModel] && serverData[serverModel].length == 0 && isDisabledButton == false && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ pl: 5, py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                            <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', ml: 5, pt: 0 }}>{t('No Data')}</Typography>
                        </Grid>
                        </Box>
                    </Box>
                </Box>
            )}

        </TableContainer>

    </Box>
  );
  
}


export default memo(SettingModel)
