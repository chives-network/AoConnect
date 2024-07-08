// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintChivesServerData, 
  ChivesServerDataGetTokens, ChivesServerDataAddToken, ChivesServerDataDelToken, 
  ChivesServerDataGetChatrooms, ChivesServerDataAddChatroom, ChivesServerDataDelChatroom, 
  ChivesServerDataGetLotteries, ChivesServerDataAddLottery, ChivesServerDataDelLottery, 
  ChivesServerDataGetGuesses, ChivesServerDataAddGuess, ChivesServerDataDelGuess, 
  ChivesServerDataGetBlogs, ChivesServerDataAddBlog, ChivesServerDataDelBlog, 
  ChivesServerDataGetSwaps, ChivesServerDataAddSwap, ChivesServerDataDelSwap, 
  ChivesServerDataGetProjects, ChivesServerDataAddProject, ChivesServerDataDelProject, 
  ChivesServerDataGetFaucets, ChivesServerDataAddFaucet, ChivesServerDataDelFaucet
 } from 'src/functions/AoConnect/ChivesServerData'
import { ansiRegex } from 'src/configs/functions'

const ChivesServerData = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>({ChivesServerData:''})

  const handleSimulatedChivesServerData = async function () {

    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)

    
    const ChivesServerData = await AoCreateProcessAuto(currentWallet.jwk)
    if(ChivesServerData) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ChivesServerData: ChivesServerData
      }))
    }

    setToolInfo((prevState: any)=>({
        ...prevState,
        'Wait seconds': '5s'
    }))
    setToolInfo((prevState: any)=>({
        ...prevState,
        'Loading LoadBlueprint ChivesServerData': '....................................................'
    }))

    await sleep(5000)

    let LoadBlueprintChivesServerData: any = await AoLoadBlueprintChivesServerData(currentWallet.jwk, ChivesServerData);
    while(LoadBlueprintChivesServerData && LoadBlueprintChivesServerData.status == 'ok' && LoadBlueprintChivesServerData.msg && LoadBlueprintChivesServerData.msg.error)  {
      sleep(6000)
      LoadBlueprintChivesServerData = await AoLoadBlueprintChivesServerData(currentWallet.jwk, ChivesServerData);
      console.log("handleSimulatedToken LoadBlueprintChivesServerData:", LoadBlueprintChivesServerData);
    }
    if(LoadBlueprintChivesServerData) {
      console.log("LoadBlueprintChivesServerData", LoadBlueprintChivesServerData)
      if(LoadBlueprintChivesServerData?.msg?.Output?.data?.output)  {
        const formatText = LoadBlueprintChivesServerData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintChivesServerData: formatText
        }))
      }
    }
    console.log("LoadBlueprintChivesServerData", LoadBlueprintChivesServerData)
    
    const TokenProcessTxId1 = await AoCreateProcessAuto(currentWallet.jwk)
    if(TokenProcessTxId1) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenProcessTxId1: TokenProcessTxId1
      }))
    }

    const TokenProcessTxId2 = await AoCreateProcessAuto(currentWallet.jwk)
    if(TokenProcessTxId2) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenProcessTxId2: TokenProcessTxId2
      }))
    }

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Token': '==================================================='
    }))

    const ChivesServerDataAddToken1 = await ChivesServerDataAddToken(currentWallet.jwk, ChivesServerData, ChivesServerData, TokenProcessTxId1, 'Token666', 'TokenGroup', 'TokenData')
    if(ChivesServerDataAddToken1) {
      console.log("ChivesServerDataAddToken1", ChivesServerDataAddToken1)
      if(ChivesServerDataAddToken1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddToken1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddToken1: formatText
          }))

          //Read message from inbox
          const ChivesServerDataAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(ChivesServerDataAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddToken1: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataAddToken2 = await ChivesServerDataAddToken(currentWallet.jwk, ChivesServerData, ChivesServerData, TokenProcessTxId2, 'Token777', 'TokenGroup', 'TokenData')
    if(ChivesServerDataAddToken2) {
      console.log("ChivesServerDataAddToken2", ChivesServerDataAddToken2)
      if(ChivesServerDataAddToken2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddToken2: formatText
          }))

          //Read message from inbox
          const ChivesServerDataAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(ChivesServerDataAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataGetTokensData1 = await ChivesServerDataGetTokens(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetTokensData1) {
      console.log("ChivesServerDataGetTokensData1", ChivesServerDataGetTokensData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetTokensData1': JSON.stringify(ChivesServerDataGetTokensData1)
      }))
    }

    const ChivesServerDataDelToken2 = await ChivesServerDataDelToken(currentWallet.jwk, ChivesServerData, ChivesServerData, TokenProcessTxId2)
    if(ChivesServerDataDelToken2) {
      console.log("ChivesServerDataDelToken2", ChivesServerDataDelToken2)
      if(ChivesServerDataDelToken2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelToken1: formatText
          }))

          //Read message from inbox
          const ChivesServerDataDelTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(ChivesServerDataDelTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataGetTokensData2 = await ChivesServerDataGetTokens(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetTokensData2) {
      console.log("ChivesServerDataGetTokensData2", ChivesServerDataGetTokensData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetTokensData2': JSON.stringify(ChivesServerDataGetTokensData2)
      }))
    }

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Chatroom': '==================================================='
    }))

    const ChatroomProcessTxId1 = TokenProcessTxId1
    const ChatroomProcessTxId2 = TokenProcessTxId2

    const ChivesServerDataAddChatroom1 = await ChivesServerDataAddChatroom(currentWallet.jwk, ChivesServerData, ChivesServerData, ChatroomProcessTxId1, 'Chatroom666', 'ChatroomGroup', 'ChatroomData')
    if(ChivesServerDataAddChatroom1) {
      console.log("ChivesServerDataAddChatroom1", ChivesServerDataAddChatroom1)
      if(ChivesServerDataAddChatroom1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddChatroom1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddChatroom1: formatText
          }))

          //Read message from inbox
          const ChivesServerDataAddChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChatroomProcessTxId1)
          if(ChivesServerDataAddChatroomData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddChatroom1: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataAddChatroom2 = await ChivesServerDataAddChatroom(currentWallet.jwk, ChivesServerData, ChivesServerData, ChatroomProcessTxId2, 'Chatroom777', 'ChatroomGroup', 'ChatroomData')
    if(ChivesServerDataAddChatroom2) {
      console.log("ChivesServerDataAddChatroom2", ChivesServerDataAddChatroom2)
      if(ChivesServerDataAddChatroom2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddChatroom2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddChatroom2: formatText
          }))

          //Read message from inbox
          const ChivesServerDataAddChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChatroomProcessTxId2)
          if(ChivesServerDataAddChatroomData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddChatroom2: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataGetChatroomsData1 = await ChivesServerDataGetChatrooms(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetChatroomsData1) {
      console.log("ChivesServerDataGetChatroomsData1", ChivesServerDataGetChatroomsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetChatroomsData1': JSON.stringify(ChivesServerDataGetChatroomsData1)
      }))
    }

    const ChivesServerDataDelChatroom2 = await ChivesServerDataDelChatroom(currentWallet.jwk, ChivesServerData, ChivesServerData, ChatroomProcessTxId2)
    if(ChivesServerDataDelChatroom2) {
      console.log("ChivesServerDataDelChatroom2", ChivesServerDataDelChatroom2)
      if(ChivesServerDataDelChatroom2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelChatroom2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelChatroom1: formatText
          }))

          //Read message from inbox
          const ChivesServerDataDelChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChatroomProcessTxId2)
          if(ChivesServerDataDelChatroomData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelChatroom2: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataGetChatroomsData2 = await ChivesServerDataGetChatrooms(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetChatroomsData2) {
      console.log("ChivesServerDataGetChatroomsData2", ChivesServerDataGetChatroomsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetChatroomsData2': JSON.stringify(ChivesServerDataGetChatroomsData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Lottery': '==================================================='
    }))
    
    const LotteryProcessTxId1 = TokenProcessTxId1
    const LotteryProcessTxId2 = TokenProcessTxId2
    
    const ChivesServerDataAddLottery1 = await ChivesServerDataAddLottery(currentWallet.jwk, ChivesServerData, ChivesServerData, LotteryProcessTxId1, 'Lottery666', 'LotteryGroup', 'LotteryData')
    if(ChivesServerDataAddLottery1) {
      console.log("ChivesServerDataAddLottery1", ChivesServerDataAddLottery1)
      if(ChivesServerDataAddLottery1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddLottery1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddLottery1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddLotteryData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId1)
          if(ChivesServerDataAddLotteryData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddLottery1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataAddLottery2 = await ChivesServerDataAddLottery(currentWallet.jwk, ChivesServerData, ChivesServerData, LotteryProcessTxId2, 'Lottery777', 'LotteryGroup', 'LotteryData')
    if(ChivesServerDataAddLottery2) {
      console.log("ChivesServerDataAddLottery2", ChivesServerDataAddLottery2)
      if(ChivesServerDataAddLottery2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddLottery2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddLottery2: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddLotteryData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId2)
          if(ChivesServerDataAddLotteryData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddLottery2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetLotteriesData1 = await ChivesServerDataGetLotteries(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetLotteriesData1) {
      console.log("ChivesServerDataGetLotteriesData1", ChivesServerDataGetLotteriesData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetLotteriesData1': JSON.stringify(ChivesServerDataGetLotteriesData1)
      }))
    }
    
    const ChivesServerDataDelLottery2 = await ChivesServerDataDelLottery(currentWallet.jwk, ChivesServerData, ChivesServerData, LotteryProcessTxId2)
    if(ChivesServerDataDelLottery2) {
      console.log("ChivesServerDataDelLottery2", ChivesServerDataDelLottery2)
      if(ChivesServerDataDelLottery2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelLottery2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelLottery1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataDelLotteryData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId2)
          if(ChivesServerDataDelLotteryData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelLottery2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetLotteriesData2 = await ChivesServerDataGetLotteries(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetLotteriesData2) {
      console.log("ChivesServerDataGetLotteriesData2", ChivesServerDataGetLotteriesData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetLotteriesData2': JSON.stringify(ChivesServerDataGetLotteriesData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Guess': '==================================================='
    }))
    
    const GuessProcessTxId1 = TokenProcessTxId1
    const GuessProcessTxId2 = TokenProcessTxId2
    
    const ChivesServerDataAddGuess1 = await ChivesServerDataAddGuess(currentWallet.jwk, ChivesServerData, ChivesServerData, GuessProcessTxId1, 'Guess666', 'GuessGroup', 'GuessData')
    if(ChivesServerDataAddGuess1) {
      console.log("ChivesServerDataAddGuess1", ChivesServerDataAddGuess1)
      if(ChivesServerDataAddGuess1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddGuess1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddGuess1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddGuessData1 = await GetMyLastMsg(currentWallet.jwk, GuessProcessTxId1)
          if(ChivesServerDataAddGuessData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddGuess1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataAddGuess2 = await ChivesServerDataAddGuess(currentWallet.jwk, ChivesServerData, ChivesServerData, GuessProcessTxId2, 'Guess777', 'GuessGroup', 'GuessData')
    if(ChivesServerDataAddGuess2) {
      console.log("ChivesServerDataAddGuess2", ChivesServerDataAddGuess2)
      if(ChivesServerDataAddGuess2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddGuess2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddGuess2: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddGuessData1 = await GetMyLastMsg(currentWallet.jwk, GuessProcessTxId2)
          if(ChivesServerDataAddGuessData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddGuess2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetGuessesData1 = await ChivesServerDataGetGuesses(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetGuessesData1) {
      console.log("ChivesServerDataGetGuessesData1", ChivesServerDataGetGuessesData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetGuessesData1': JSON.stringify(ChivesServerDataGetGuessesData1)
      }))
    }
    
    const ChivesServerDataDelGuess2 = await ChivesServerDataDelGuess(currentWallet.jwk, ChivesServerData, ChivesServerData, GuessProcessTxId2)
    if(ChivesServerDataDelGuess2) {
      console.log("ChivesServerDataDelGuess2", ChivesServerDataDelGuess2)
      if(ChivesServerDataDelGuess2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelGuess2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelGuess1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataDelGuessData1 = await GetMyLastMsg(currentWallet.jwk, GuessProcessTxId2)
          if(ChivesServerDataDelGuessData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelGuess2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetGuessesData2 = await ChivesServerDataGetGuesses(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetGuessesData2) {
      console.log("ChivesServerDataGetGuessesData2", ChivesServerDataGetGuessesData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetGuessesData2': JSON.stringify(ChivesServerDataGetGuessesData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Blog': '==================================================='
    }))
    
    const BlogProcessTxId1 = TokenProcessTxId1
    const BlogProcessTxId2 = TokenProcessTxId2
    
    const ChivesServerDataAddBlog1 = await ChivesServerDataAddBlog(currentWallet.jwk, ChivesServerData, ChivesServerData, BlogProcessTxId1, 'Blog666', 'BlogGroup', 'BlogData')
    if(ChivesServerDataAddBlog1) {
      console.log("ChivesServerDataAddBlog1", ChivesServerDataAddBlog1)
      if(ChivesServerDataAddBlog1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddBlog1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddBlog1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddBlogData1 = await GetMyLastMsg(currentWallet.jwk, BlogProcessTxId1)
          if(ChivesServerDataAddBlogData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddBlog1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataAddBlog2 = await ChivesServerDataAddBlog(currentWallet.jwk, ChivesServerData, ChivesServerData, BlogProcessTxId2, 'Blog777', 'BlogGroup', 'BlogData')
    if(ChivesServerDataAddBlog2) {
      console.log("ChivesServerDataAddBlog2", ChivesServerDataAddBlog2)
      if(ChivesServerDataAddBlog2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddBlog2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddBlog2: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddBlogData1 = await GetMyLastMsg(currentWallet.jwk, BlogProcessTxId2)
          if(ChivesServerDataAddBlogData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddBlog2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetBlogsData1 = await ChivesServerDataGetBlogs(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetBlogsData1) {
      console.log("ChivesServerDataGetBlogsData1", ChivesServerDataGetBlogsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetBlogsData1': JSON.stringify(ChivesServerDataGetBlogsData1)
      }))
    }
    
    const ChivesServerDataDelBlog2 = await ChivesServerDataDelBlog(currentWallet.jwk, ChivesServerData, ChivesServerData, BlogProcessTxId2)
    if(ChivesServerDataDelBlog2) {
      console.log("ChivesServerDataDelBlog2", ChivesServerDataDelBlog2)
      if(ChivesServerDataDelBlog2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelBlog2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelBlog1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataDelBlogData1 = await GetMyLastMsg(currentWallet.jwk, BlogProcessTxId2)
          if(ChivesServerDataDelBlogData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelBlog2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetBlogsData2 = await ChivesServerDataGetBlogs(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetBlogsData2) {
      console.log("ChivesServerDataGetBlogsData2", ChivesServerDataGetBlogsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetBlogsData2': JSON.stringify(ChivesServerDataGetBlogsData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Swap': '==================================================='
    }))
    
    const SwapProcessTxId1 = TokenProcessTxId1
    const SwapProcessTxId2 = TokenProcessTxId2
    
    const ChivesServerDataAddSwap1 = await ChivesServerDataAddSwap(currentWallet.jwk, ChivesServerData, ChivesServerData, SwapProcessTxId1, 'Swap666', 'SwapGroup', 'SwapData')
    if(ChivesServerDataAddSwap1) {
      console.log("ChivesServerDataAddSwap1", ChivesServerDataAddSwap1)
      if(ChivesServerDataAddSwap1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddSwap1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddSwap1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddSwapData1 = await GetMyLastMsg(currentWallet.jwk, SwapProcessTxId1)
          if(ChivesServerDataAddSwapData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddSwap1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataAddSwap2 = await ChivesServerDataAddSwap(currentWallet.jwk, ChivesServerData, ChivesServerData, SwapProcessTxId2, 'Swap777', 'SwapGroup', 'SwapData')
    if(ChivesServerDataAddSwap2) {
      console.log("ChivesServerDataAddSwap2", ChivesServerDataAddSwap2)
      if(ChivesServerDataAddSwap2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddSwap2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddSwap2: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddSwapData1 = await GetMyLastMsg(currentWallet.jwk, SwapProcessTxId2)
          if(ChivesServerDataAddSwapData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddSwap2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetSwapsData1 = await ChivesServerDataGetSwaps(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetSwapsData1) {
      console.log("ChivesServerDataGetSwapsData1", ChivesServerDataGetSwapsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetSwapsData1': JSON.stringify(ChivesServerDataGetSwapsData1)
      }))
    }
    
    const ChivesServerDataDelSwap2 = await ChivesServerDataDelSwap(currentWallet.jwk, ChivesServerData, ChivesServerData, SwapProcessTxId2)
    if(ChivesServerDataDelSwap2) {
      console.log("ChivesServerDataDelSwap2", ChivesServerDataDelSwap2)
      if(ChivesServerDataDelSwap2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelSwap2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelSwap1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataDelSwapData1 = await GetMyLastMsg(currentWallet.jwk, SwapProcessTxId2)
          if(ChivesServerDataDelSwapData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelSwap2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetSwapsData2 = await ChivesServerDataGetSwaps(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetSwapsData2) {
      console.log("ChivesServerDataGetSwapsData2", ChivesServerDataGetSwapsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetSwapsData2': JSON.stringify(ChivesServerDataGetSwapsData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Project': '==================================================='
    }))
    
    const ProjectProcessTxId1 = TokenProcessTxId1
    const ProjectProcessTxId2 = TokenProcessTxId2
    
    const ChivesServerDataAddProject1 = await ChivesServerDataAddProject(currentWallet.jwk, ChivesServerData, ChivesServerData, ProjectProcessTxId1, 'Project666', 'ProjectGroup', 'ProjectData')
    if(ChivesServerDataAddProject1) {
      console.log("ChivesServerDataAddProject1", ChivesServerDataAddProject1)
      if(ChivesServerDataAddProject1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddProject1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddProject1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddProjectData1 = await GetMyLastMsg(currentWallet.jwk, ProjectProcessTxId1)
          if(ChivesServerDataAddProjectData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddProject1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataAddProject2 = await ChivesServerDataAddProject(currentWallet.jwk, ChivesServerData, ChivesServerData, ProjectProcessTxId2, 'Project777', 'ProjectGroup', 'ProjectData')
    if(ChivesServerDataAddProject2) {
      console.log("ChivesServerDataAddProject2", ChivesServerDataAddProject2)
      if(ChivesServerDataAddProject2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddProject2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddProject2: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddProjectData1 = await GetMyLastMsg(currentWallet.jwk, ProjectProcessTxId2)
          if(ChivesServerDataAddProjectData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddProject2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetProjectsData1 = await ChivesServerDataGetProjects(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetProjectsData1) {
      console.log("ChivesServerDataGetProjectsData1", ChivesServerDataGetProjectsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetProjectsData1': JSON.stringify(ChivesServerDataGetProjectsData1)
      }))
    }
    
    const ChivesServerDataDelProject2 = await ChivesServerDataDelProject(currentWallet.jwk, ChivesServerData, ChivesServerData, ProjectProcessTxId2)
    if(ChivesServerDataDelProject2) {
      console.log("ChivesServerDataDelProject2", ChivesServerDataDelProject2)
      if(ChivesServerDataDelProject2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelProject2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelProject1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataDelProjectData1 = await GetMyLastMsg(currentWallet.jwk, ProjectProcessTxId2)
          if(ChivesServerDataDelProjectData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelProject2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetProjectsData2 = await ChivesServerDataGetProjects(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetProjectsData2) {
      console.log("ChivesServerDataGetProjectsData2", ChivesServerDataGetProjectsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetProjectsData2': JSON.stringify(ChivesServerDataGetProjectsData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Faucet': '==================================================='
    }))
    
    const FaucetProcessTxId1 = TokenProcessTxId1
    const FaucetProcessTxId2 = TokenProcessTxId2
    
    const ChivesServerDataAddFaucet1 = await ChivesServerDataAddFaucet(currentWallet.jwk, ChivesServerData, ChivesServerData, FaucetProcessTxId1, 'Faucet666', 'FaucetGroup', 'FaucetData')
    if(ChivesServerDataAddFaucet1) {
      console.log("ChivesServerDataAddFaucet1", ChivesServerDataAddFaucet1)
      if(ChivesServerDataAddFaucet1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddFaucet1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddFaucet1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddFaucetData1 = await GetMyLastMsg(currentWallet.jwk, FaucetProcessTxId1)
          if(ChivesServerDataAddFaucetData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddFaucetData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddFaucet1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataAddFaucet2 = await ChivesServerDataAddFaucet(currentWallet.jwk, ChivesServerData, ChivesServerData, FaucetProcessTxId2, 'Faucet777', 'FaucetGroup', 'FaucetData')
    if(ChivesServerDataAddFaucet2) {
      console.log("ChivesServerDataAddFaucet2", ChivesServerDataAddFaucet2)
      if(ChivesServerDataAddFaucet2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddFaucet2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddFaucet2: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataAddFaucetData1 = await GetMyLastMsg(currentWallet.jwk, FaucetProcessTxId2)
          if(ChivesServerDataAddFaucetData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddFaucetData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddFaucet2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetFaucetsData1 = await ChivesServerDataGetFaucets(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetFaucetsData1) {
      console.log("ChivesServerDataGetFaucetsData1", ChivesServerDataGetFaucetsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetFaucetsData1': JSON.stringify(ChivesServerDataGetFaucetsData1)
      }))
    }
    
    const ChivesServerDataDelFaucet2 = await ChivesServerDataDelFaucet(currentWallet.jwk, ChivesServerData, ChivesServerData, FaucetProcessTxId2)
    if(ChivesServerDataDelFaucet2) {
      console.log("ChivesServerDataDelFaucet2", ChivesServerDataDelFaucet2)
      if(ChivesServerDataDelFaucet2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelFaucet2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelFaucet1: formatText
          }))
    
          //Read message from inbox
          const ChivesServerDataDelFaucetData1 = await GetMyLastMsg(currentWallet.jwk, FaucetProcessTxId2)
          if(ChivesServerDataDelFaucetData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelFaucetData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelFaucet2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const ChivesServerDataGetFaucetsData2 = await ChivesServerDataGetFaucets(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetFaucetsData2) {
      console.log("ChivesServerDataGetFaucetsData2", ChivesServerDataGetFaucetsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetFaucetsData2': JSON.stringify(ChivesServerDataGetFaucetsData2)
      }))
    }


    
    //Delay 1s code end
    setIsDisabledButton(false)

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Finished': '==================================================='
    }))

    //}, 5000);


  }

  return (
    <Fragment>
      {currentAddress ?
      <Grid container>
        <Grid item xs={12}>
          <Card>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                        () => { handleSimulatedChivesServerData() }
                    }>
                    {t("Simulated ChivesServerData")}
                    </Button>
                  </Box>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesserverdata.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("ChivesServerData Lua") as string}
                      </Typography>
                  </Link>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Grid sx={{my: 2}}>
                  <Typography noWrap variant='body2' sx={{display: 'inline', mr: 1}}>CurrentAddress:</Typography>
                  <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography>
                </Grid>
                
                {toolInfo && Object.keys(toolInfo).map((Item: any, Index: number)=>{

                  return (
                    <Fragment key={Index}>
                      <Tooltip title={toolInfo[Item]}>
                        <Grid sx={{my: 2}}>
                          <Typography noWrap variant='body2' sx={{display: 'inline', mr: 1}}>{Item}:</Typography>
                          <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo[Item]}</Typography>
                        </Grid>
                      </Tooltip>
                    </Fragment>
                  )

                })}

              </Grid>
          </Card>
        </Grid>
      </Grid>
      :
      null
      }
    </Fragment>
  )
}

export default ChivesServerData

