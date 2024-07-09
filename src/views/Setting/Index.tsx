
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
import { GetTokenAvatar } from 'src/functions/AoConnect/Token'

import Grid from '@mui/material/Grid'

import toast from 'react-hot-toast'
import MuiAvatar from '@mui/material/Avatar'

import TokenSummary from 'src/views/Token/TokenSummary'

import { GetMyLastMsg } from 'src/functions/AoConnect/AoConnect'

import { 
    ChivesServerDataGetTokens, ChivesServerDataAddToken, ChivesServerDataDelToken, 
    ChivesServerDataGetChatrooms, ChivesServerDataAddChatroom, ChivesServerDataDelChatroom, 
    ChivesServerDataGetLotteries, ChivesServerDataAddLottery, ChivesServerDataDelLottery, 
    ChivesServerDataGetGuesses, ChivesServerDataAddGuess, ChivesServerDataDelGuess, 
    ChivesServerDataGetBlogs, ChivesServerDataAddBlog, ChivesServerDataDelBlog, 
    ChivesServerDataGetSwaps, ChivesServerDataAddSwap, ChivesServerDataDelSwap, 
    ChivesServerDataGetProjects, ChivesServerDataAddProject, ChivesServerDataDelProject, 
    ChivesServerDataGetFaucets, ChivesServerDataAddFaucet, ChivesServerDataDelFaucet
   } from 'src/functions/AoConnect/ChivesServerData'

import { AoTokenInfoDryRun } from 'src/functions/AoConnect/Token'
import { AoChatroomInfoDryRun } from 'src/functions/AoConnect/ChivesChat'

import { ansiRegex } from 'src/configs/functions'


const SettingModel = () => {
  
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet

  const [serverModel, setServerModel] = useState<string>("Token")
  const [serverTxId, setServerTxId] = useState<string>("91uljP8YzSKu01C73xDJNlAs6jcZIboWbsgkPnB-Ks4")
  const [serverData, setServerData] = useState<any>({})

  const [isAllowAddServerData, setIsAllowAddServerData] = useState<boolean>(false)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [chivesServerDataTxIdError, setChivesServerDataTxIdError] = useState<string>('')
  
  const [processTxId, setProcessTxId] = useState<string>("")
  const [processInfo, setProcessInfo] = useState<any>({})
  const [AddAoConnectTxIdError, setAddAoConnectTxIdError] = useState<string>('')
  const [groupValue, setGroupValue] = useState<string>("")
  const [sortValue, setSortValue] = useState<string>("")
  const [groupError, setGroupError] = useState<string>('')
  const [sortError, setSortError] = useState<string>('')

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
                const dataArray = Object.values(ChivesServerDataGetTokensData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.TokenGroup == b.TokenGroup) {
                        return Number(a.TokenSort) - Number(b.TokenSort);
                    } else {
                        return a.TokenGroup.localeCompare(b.TokenGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetTokensData1 serverData", serverData)
            }
            break;
        case 'Chatroom':
            const ChivesServerDataGetChatroomsData1 = await ChivesServerDataGetChatrooms(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetChatroomsData1) {
                const dataArray = Object.values(ChivesServerDataGetChatroomsData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.ChatroomGroup == b.ChatroomGroup) {
                        return Number(a.ChatroomSort) - Number(b.ChatroomSort);
                    } else {
                        return a.ChatroomGroup.localeCompare(b.ChatroomGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetChatroomsData1 serverData", serverData)
            }
            break;
        case 'Lottery':
            const ChivesServerDataGetLotteriesData1 = await ChivesServerDataGetLotteries(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetLotteriesData1) {
                const dataArray = Object.values(ChivesServerDataGetLotteriesData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.LotteryGroup == b.LotteryGroup) {
                        return Number(a.Lotteriesort) - Number(b.Lotteriesort);
                    } else {
                        return a.LotteryGroup.localeCompare(b.LotteryGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetLotteriesData1 serverData", serverData)
            }
            break;
        case 'Guess':
            const ChivesServerDataGetGuessesData1 = await ChivesServerDataGetGuesses(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetGuessesData1) {
                const dataArray = Object.values(ChivesServerDataGetGuessesData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.GuessGroup == b.GuessGroup) {
                        return Number(a.Guessesort) - Number(b.Guessesort);
                    } else {
                        return a.GuessGroup.localeCompare(b.GuessGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetGuessesData1 serverData", serverData)
            }
            break;
        case 'Blog':
            const ChivesServerDataGetBlogsData1 = await ChivesServerDataGetBlogs(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetBlogsData1) {
                const dataArray = Object.values(ChivesServerDataGetBlogsData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.BlogGroup == b.BlogGroup) {
                        return Number(a.BlogSort) - Number(b.BlogSort);
                    } else {
                        return a.BlogGroup.localeCompare(b.BlogGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetBlogsData1 serverData", serverData)
            }
            break;
        case 'Swap':
            const ChivesServerDataGetSwapsData1 = await ChivesServerDataGetSwaps(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetSwapsData1) {
                const dataArray = Object.values(ChivesServerDataGetSwapsData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.SwapGroup == b.SwapGroup) {
                        return Number(a.SwapSort) - Number(b.SwapSort);
                    } else {
                        return a.SwapGroup.localeCompare(b.SwapGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetSwapsData1 serverData", serverData)
            }
            break;
        case 'Project':
            const ChivesServerDataGetProjectsData1 = await ChivesServerDataGetProjects(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetProjectsData1) {
                const dataArray = Object.values(ChivesServerDataGetProjectsData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.ProjectGroup == b.ProjectGroup) {
                        return Number(a.ProjectSort) - Number(b.ProjectSort);
                    } else {
                        return a.ProjectGroup.localeCompare(b.ProjectGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetProjectsData1 serverData", serverData)
            }
            break;
        case 'Faucet':
            const ChivesServerDataGetFaucetsData1 = await ChivesServerDataGetFaucets(ChivesServerData, ChivesServerData)
            if(ChivesServerDataGetFaucetsData1) {
                const dataArray = Object.values(ChivesServerDataGetFaucetsData1);
                dataArray.sort((a: any, b: any) => {
                    if (a.FaucetGroup == b.FaucetGroup) {
                        return Number(a.FaucetSort) - Number(b.FaucetSort);
                    } else {
                        return a.FaucetGroup.localeCompare(b.FaucetGroup);
                    }
                });
                setServerData((prevState: any)=>({
                    ...prevState,
                    [Model]: dataArray
                }))
                console.log("ChivesServerDataGetFaucetsData1 serverData", serverData)
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
        case 'Faucet':
            const ChivesServerDataDelFaucetData1 = await ChivesServerDataDelFaucet(currentWallet.jwk, ChivesServerData, ChivesServerData, Id)
            if(ChivesServerDataDelFaucetData1) {
                console.log("ChivesServerDataDelFaucetData1", ChivesServerDataDelFaucetData1)
                if(ChivesServerDataDelFaucetData1?.msg?.Output?.data?.output)  {
                  const formatText = ChivesServerDataDelFaucetData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                  if(formatText) {
                    const ChivesServerDataDelFaucetData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                    if(ChivesServerDataDelFaucetData1?.msg?.Output?.data?.output)  {
                      const formatText2 = ChivesServerDataDelFaucetData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
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

  const handleSearchProcessData = async (Model: string) => {
    setIsDisabledButton(true)
    switch(Model) {
        case 'Token':
            const TokenGetMap: any = await AoTokenInfoDryRun(processTxId)
            if(TokenGetMap && Number(TokenGetMap.Denomination) >= 0 && TokenGetMap.Name != "" && TokenGetMap.Ticker != "") {
                console.log("handleSearchProcessData handleTokenSearch TokenGetMap", TokenGetMap)
                setProcessInfo(TokenGetMap)
                setIsAllowAddServerData(true)
            }
            else {
                toast.success(t('This is not a token') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Chatroom':
            const ChatroomGetMap: any = await AoChatroomInfoDryRun(processTxId)
            console.log("handleTokenSearch ChatroomGetMap", ChatroomGetMap)
            break;
    }
    setIsDisabledButton(false)
  }

  const handleAddToServerData = async (Model: string) => {
    if(groupValue == "") {
        toast.error(t('Group must have a value') as string, { duration: 2500, position: 'top-center' })

        return 
    }
    if(sortValue == "") {
        toast.error(t('Sort must have a value') as string, { duration: 2500, position: 'top-center' })

        return
    }
    setIsDisabledButton(true)
    const ChivesServerData = serverTxId
    switch(Model) {
        case 'Token':
            const ChivesServerDataAddToken1 = await ChivesServerDataAddToken(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddToken1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddToken1", ChivesServerDataAddToken1)
                if(ChivesServerDataAddToken1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddToken1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddTokenData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddToken Failed') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Chatroom':
            const ChivesServerDataAddChatroom1 = await ChivesServerDataAddChatroom(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddChatroom1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddChatroom1", ChivesServerDataAddChatroom1)
                if(ChivesServerDataAddChatroom1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddChatroom1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddChatroomData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddChatroom Failed') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Guess':
            const ChivesServerDataAddGuess1 = await ChivesServerDataAddGuess(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddGuess1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddGuess1", ChivesServerDataAddGuess1)
                if(ChivesServerDataAddGuess1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddGuess1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddGuessData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddGuessData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddGuess Failed') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Lottery':
            const ChivesServerDataAddLottery1 = await ChivesServerDataAddLottery(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddLottery1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddLottery1", ChivesServerDataAddLottery1)
                if(ChivesServerDataAddLottery1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddLottery1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddLotteryData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddLotteryData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddLottery Failed') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Blog':
            const ChivesServerDataAddBlog1 = await ChivesServerDataAddBlog(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddBlog1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddBlog1", ChivesServerDataAddBlog1)
                if(ChivesServerDataAddBlog1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddBlog1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddBlogData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddBlogData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddBlog Failed') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Swap':
            const ChivesServerDataAddSwap1 = await ChivesServerDataAddSwap(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddSwap1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddSwap1", ChivesServerDataAddSwap1)
                if(ChivesServerDataAddSwap1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddSwap1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddSwapData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddSwapData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddSwap Failed') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Project':
            const ChivesServerDataAddProject1 = await ChivesServerDataAddProject(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddProject1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddProject1", ChivesServerDataAddProject1)
                if(ChivesServerDataAddProject1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddProject1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddProjectData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddProjectData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddProject Failed') as string, { duration: 2500, position: 'top-center' })
            }
            break;
        case 'Faucet':
            const ChivesServerDataAddFaucet1 = await ChivesServerDataAddFaucet(currentWallet.jwk, ChivesServerData, ChivesServerData, processTxId, sortValue, groupValue, JSON.stringify(processInfo).replace(/"/g, '\\"'))
            if(ChivesServerDataAddFaucet1) {
                handleGetServerData(Model)
                setProcessTxId('')
                setProcessInfo({})
                setIsAllowAddServerData(false)
                console.log("ChivesServerDataAddFaucet1", ChivesServerDataAddFaucet1)
                if(ChivesServerDataAddFaucet1?.msg?.Output?.data?.output)  {
                    const formatText = ChivesServerDataAddFaucet1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                    if(formatText) {
                        const ChivesServerDataAddFaucetData1 = await GetMyLastMsg(currentWallet.jwk, ChivesServerData)
                        if(ChivesServerDataAddFaucetData1?.msg?.Output?.data?.output)  {
                            const formatText2 = ChivesServerDataAddFaucetData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
                            if(formatText2) {
                                toast.success(t(formatText2) as string, { duration: 2500, position: 'top-center' })
                            }
                        }
                    }
                }
            }
            else {
                toast.success(t('Exec ChivesServerDataAddFaucet Failed') as string, { duration: 2500, position: 'top-center' })
            }
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
                    <Grid item sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
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
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={true} variant='outlined' onClick={
                                () => { handleGetServerData('Lottery') }
                            }>
                            {t("Lottery Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={true} variant='outlined' onClick={
                                () => { handleGetServerData('Guess') }
                            }>
                            {t("Guess Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={true} variant='outlined' onClick={
                                () => { handleGetServerData('Blog') }
                            }>
                            {t("Blog Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={true} variant='outlined' onClick={
                                () => { handleGetServerData('Swap') }
                            }>
                            {t("Swap Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={true} variant='outlined' onClick={
                                () => { handleGetServerData('Project') }
                            }>
                            {t("Project Data")}
                            </Button>
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleGetServerData('Faucet') }
                            }>
                            {t("Faucet Data")}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                        <Box>
                            <TextField
                                sx={{ml: 2, my: 2}}
                                size="small"
                                label={`${t('AddProcessTxId')}`}
                                placeholder={`${t('AddProcessTxId')}`}
                                value={processTxId}
                                onChange={(e: any)=>{
                                    if(e.target.value && e.target.value.length == 43) {
                                        setAddAoConnectTxIdError('')
                                        setProcessTxId(e.target.value)
                                    }
                                    else {
                                        setAddAoConnectTxIdError('Please set AddProcessTxId first!')
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
                                error={!!AddAoConnectTxIdError}
                                helperText={AddAoConnectTxIdError}
                            />
                            <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                () => { handleSearchProcessData(serverModel) }
                            }>
                            {t("Search")}
                            </Button>
                            <Typography noWrap variant='body2' sx={{ color: 'default.main', pr: 3, display: 'inline', my: 0, py: 0 }}>
                                Model: {serverModel}
                            </Typography>
                            {isAllowAddServerData && (
                                <Fragment>
                                    <TextField
                                        sx={{ml: 2, my: 2, width: '200px'}}
                                        size="small"
                                        label={`${t('Group')}`}
                                        placeholder={`${t('Group')}`}
                                        value={groupValue}
                                        onChange={(e: any)=>{
                                            if(e.target.value) {
                                                setGroupError('')
                                                setGroupValue(e.target.value)
                                            }
                                            else {
                                                setGroupError('Please set Group first!')
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
                                        error={!!groupError}
                                        helperText={groupError}
                                    />
                                    <TextField
                                        sx={{ml: 2, my: 2, width: '200px'}}
                                        size="small"
                                        label={`${t('Sort')}`}
                                        placeholder={`${t('Sort')}`}
                                        value={sortValue}
                                        onChange={(e: any)=>{
                                            if(e.target.value) {
                                                setSortError('')
                                                setSortValue(e.target.value)
                                            }
                                            else {
                                                setSortError('Please set Sort first!')
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
                                        error={!!sortError}
                                        helperText={sortError}
                                    />
                                    <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                                        () => { handleAddToServerData(serverModel) }
                                    }>
                                    {t("Add to server")}
                                    </Button>
                                </Fragment>
                            )}
                        </Box>
                    </Grid>
                </Card>
            </Grid>
        </Grid>

        <TokenSummary tokenGetInfor={processInfo} />

        <TableContainer>
            <Table>
            <TableBody>
            <TableRow sx={{my: 0, py: 0}}>
                <TableCell sx={{my: 0, py: 0}} colSpan={7}>
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
                    Avatar
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Data
                </TableCell>
            </TableRow>
            {serverData && serverData[serverModel] && serverData[serverModel].map((Item: any, Index: number)=>{

                const Row = Item

                let AvatarLogo = ""
                try{ 
                    const ServerModelData = Row[serverModel + 'Data'] && JSON.parse(Row[serverModel + 'Data'])
                    if(ServerModelData && ServerModelData.Logo) {
                        AvatarLogo = ServerModelData.Logo
                    }
                }
                catch(Error: any) {
                    console.log("AvatarLogo Error", Error)
                }

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
                                    <MuiAvatar
                                        src={GetTokenAvatar(AvatarLogo)}
                                        sx={{ width: '2.5rem', height: '2.5rem' }}
                                    />
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography variant='body2' sx={{ color: 'primary.main', pr: 3, my: 0, py: 0 }}>{Row[serverModel + 'Data']}</Typography>
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
