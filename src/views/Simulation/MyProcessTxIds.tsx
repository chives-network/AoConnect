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
import { AoLoadBlueprintMyProcessTxIds, 
  MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken, 
  MyProcessTxIdsGetChatrooms, MyProcessTxIdsAddChatroom, MyProcessTxIdsDelChatroom, 
  MyProcessTxIdsGetLotteries, MyProcessTxIdsAddLottery, MyProcessTxIdsDelLottery, 
  MyProcessTxIdsGetGuesses, MyProcessTxIdsAddGuess, MyProcessTxIdsDelGuess, 
  MyProcessTxIdsGetSwaps, MyProcessTxIdsAddSwap, MyProcessTxIdsDelSwap, 
  MyProcessTxIdsGetBlogs, MyProcessTxIdsAddBlog, MyProcessTxIdsDelBlog, 
  MyProcessTxIdsGetProjects, MyProcessTxIdsAddProject, MyProcessTxIdsDelProject
 } from 'src/functions/AoConnect/MyProcessTxIds'
import { ansiRegex } from 'src/configs/functions'

const MyProcessTxIds = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>({MyProcessTxIds:''})

  const handleSimulatedMyProcessTxIds = async function () {

    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)

    const MyProcessTxIds = await AoCreateProcessAuto(currentWallet.jwk)
    if(MyProcessTxIds) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        MyProcessTxIds: MyProcessTxIds
      }))
    }

    setToolInfo((prevState: any)=>({
        ...prevState,
        'Wait seconds': '10s'
    }))
    setToolInfo((prevState: any)=>({
        ...prevState,
        'Loading LoadBlueprint MyProcessTxIds': '....................................................'
    }))

    await sleep(10000)

    let LoadBlueprintMyProcessTxIds: any = await AoLoadBlueprintMyProcessTxIds(currentWallet.jwk, MyProcessTxIds);
    while(LoadBlueprintMyProcessTxIds && LoadBlueprintMyProcessTxIds.status == 'ok' && LoadBlueprintMyProcessTxIds.msg && LoadBlueprintMyProcessTxIds.msg.error)  {
      sleep(6000)
      LoadBlueprintMyProcessTxIds = await AoLoadBlueprintMyProcessTxIds(currentWallet.jwk, MyProcessTxIds);
      console.log("handleSimulatedToken LoadBlueprintMyProcessTxIds:", LoadBlueprintMyProcessTxIds);
    }
    if(LoadBlueprintMyProcessTxIds) {
      console.log("LoadBlueprintMyProcessTxIds", LoadBlueprintMyProcessTxIds)
      if(LoadBlueprintMyProcessTxIds?.msg?.Output?.data?.output)  {
        const formatText = LoadBlueprintMyProcessTxIds?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintMyProcessTxIds: formatText
        }))
      }
    }
    console.log("LoadBlueprintMyProcessTxIds", LoadBlueprintMyProcessTxIds)

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

    const MyProcessTxIdsAddToken1 = await MyProcessTxIdsAddToken(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, TokenProcessTxId1, '666', 'Group', 'Data')
    if(MyProcessTxIdsAddToken1) {
      console.log("MyProcessTxIdsAddToken1", MyProcessTxIdsAddToken1)
      if(MyProcessTxIdsAddToken1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddToken1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddToken1: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddToken1: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsAddToken2 = await MyProcessTxIdsAddToken(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, TokenProcessTxId2, '777', 'Group', 'Data')
    if(MyProcessTxIdsAddToken2) {
      console.log("MyProcessTxIdsAddToken2", MyProcessTxIdsAddToken2)
      if(MyProcessTxIdsAddToken2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddToken2: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsGetTokensData1 = await MyProcessTxIdsGetTokens(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetTokensData1) {
      console.log("MyProcessTxIdsGetTokensData1", MyProcessTxIdsGetTokensData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetTokensData1': JSON.stringify(MyProcessTxIdsGetTokensData1)
      }))
    }

    const MyProcessTxIdsDelToken2 = await MyProcessTxIdsDelToken(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, TokenProcessTxId2)
    if(MyProcessTxIdsDelToken2) {
      console.log("MyProcessTxIdsDelToken2", MyProcessTxIdsDelToken2)
      if(MyProcessTxIdsDelToken2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelToken2: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsDelTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(MyProcessTxIdsDelTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsGetTokensData2 = await MyProcessTxIdsGetTokens(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetTokensData2) {
      console.log("MyProcessTxIdsGetTokensData2", MyProcessTxIdsGetTokensData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetTokensData2': JSON.stringify(MyProcessTxIdsGetTokensData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Chatroom': '==================================================='
    }))
    
    const ChatroomProcessTxId1 = TokenProcessTxId1
    const ChatroomProcessTxId2 = TokenProcessTxId2

    const MyProcessTxIdsAddChatroom1 = await MyProcessTxIdsAddChatroom(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, ChatroomProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddChatroom1) {
      console.log("MyProcessTxIdsAddChatroom1", MyProcessTxIdsAddChatroom1)
      if(MyProcessTxIdsAddChatroom1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddChatroom1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddChatroom1: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsAddChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChatroomProcessTxId1)
          if(MyProcessTxIdsAddChatroomData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddChatroom1: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsAddChatroom2 = await MyProcessTxIdsAddChatroom(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, ChatroomProcessTxId2, '777', 'Data')
    if(MyProcessTxIdsAddChatroom2) {
      console.log("MyProcessTxIdsAddChatroom2", MyProcessTxIdsAddChatroom2)
      if(MyProcessTxIdsAddChatroom2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddChatroom2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddChatroom2: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsAddChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChatroomProcessTxId2)
          if(MyProcessTxIdsAddChatroomData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddChatroom2: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsGetChatroomsData1 = await MyProcessTxIdsGetChatrooms(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetChatroomsData1) {
      console.log("MyProcessTxIdsGetChatroomsData1", MyProcessTxIdsGetChatroomsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetChatroomsData1': JSON.stringify(MyProcessTxIdsGetChatroomsData1)
      }))
    }

    const MyProcessTxIdsDelChatroom2 = await MyProcessTxIdsDelChatroom(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, ChatroomProcessTxId2)
    if(MyProcessTxIdsDelChatroom2) {
      console.log("MyProcessTxIdsDelChatroom2", MyProcessTxIdsDelChatroom2)
      if(MyProcessTxIdsDelChatroom2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelChatroom2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelChatroom2: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsDelChatroomData1 = await GetMyLastMsg(currentWallet.jwk, ChatroomProcessTxId1)
          if(MyProcessTxIdsDelChatroomData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelChatroomData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelChatroom2: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsGetChatroomsData2 = await MyProcessTxIdsGetChatrooms(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetChatroomsData2) {
      console.log("MyProcessTxIdsGetChatroomsData2", MyProcessTxIdsGetChatroomsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetChatroomsData2': JSON.stringify(MyProcessTxIdsGetChatroomsData2)
      }))
    }



    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Lottery': '==================================================='
    }))
    
    const LotteryProcessTxId1 = TokenProcessTxId1
    const LotteryProcessTxId2 = TokenProcessTxId2
    
    const MyProcessTxIdsAddLottery1 = await MyProcessTxIdsAddLottery(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, LotteryProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddLottery1) {
      console.log("MyProcessTxIdsAddLottery1", MyProcessTxIdsAddLottery1)
      if(MyProcessTxIdsAddLottery1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddLottery1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddLottery1: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddLotteryData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId1)
          if(MyProcessTxIdsAddLotteryData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddLottery1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsAddLottery2 = await MyProcessTxIdsAddLottery(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, LotteryProcessTxId2, '777', 'Data')
    if(MyProcessTxIdsAddLottery2) {
      console.log("MyProcessTxIdsAddLottery2", MyProcessTxIdsAddLottery2)
      if(MyProcessTxIdsAddLottery2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddLottery2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddLottery2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddLotteryData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId2)
          if(MyProcessTxIdsAddLotteryData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddLottery2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetLotteriesData1 = await MyProcessTxIdsGetLotteries(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetLotteriesData1) {
      console.log("MyProcessTxIdsGetLotteriesData1", MyProcessTxIdsGetLotteriesData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetLotteriesData1': JSON.stringify(MyProcessTxIdsGetLotteriesData1)
      }))
    }
    
    const MyProcessTxIdsDelLottery2 = await MyProcessTxIdsDelLottery(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, LotteryProcessTxId2)
    if(MyProcessTxIdsDelLottery2) {
      console.log("MyProcessTxIdsDelLottery2", MyProcessTxIdsDelLottery2)
      if(MyProcessTxIdsDelLottery2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelLottery2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelLottery2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsDelLotteryData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId1)
          if(MyProcessTxIdsDelLotteryData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelLotteryData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelLottery2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetLotteriesData2 = await MyProcessTxIdsGetLotteries(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetLotteriesData2) {
      console.log("MyProcessTxIdsGetLotteriesData2", MyProcessTxIdsGetLotteriesData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetLotteriesData2': JSON.stringify(MyProcessTxIdsGetLotteriesData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Blog': '==================================================='
    }))
    
    const BlogProcessTxId1 = TokenProcessTxId1
    const BlogProcessTxId2 = TokenProcessTxId2
    
    const MyProcessTxIdsAddBlog1 = await MyProcessTxIdsAddBlog(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, BlogProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddBlog1) {
      console.log("MyProcessTxIdsAddBlog1", MyProcessTxIdsAddBlog1)
      if(MyProcessTxIdsAddBlog1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddBlog1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddBlog1: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddBlogData1 = await GetMyLastMsg(currentWallet.jwk, BlogProcessTxId1)
          if(MyProcessTxIdsAddBlogData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddBlog1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsAddBlog2 = await MyProcessTxIdsAddBlog(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, BlogProcessTxId2, '777', 'Data')
    if(MyProcessTxIdsAddBlog2) {
      console.log("MyProcessTxIdsAddBlog2", MyProcessTxIdsAddBlog2)
      if(MyProcessTxIdsAddBlog2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddBlog2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddBlog2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddBlogData1 = await GetMyLastMsg(currentWallet.jwk, BlogProcessTxId2)
          if(MyProcessTxIdsAddBlogData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddBlog2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetBlogsData1 = await MyProcessTxIdsGetBlogs(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetBlogsData1) {
      console.log("MyProcessTxIdsGetBlogsData1", MyProcessTxIdsGetBlogsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetBlogsData1': JSON.stringify(MyProcessTxIdsGetBlogsData1)
      }))
    }
    
    const MyProcessTxIdsDelBlog2 = await MyProcessTxIdsDelBlog(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, BlogProcessTxId2)
    if(MyProcessTxIdsDelBlog2) {
      console.log("MyProcessTxIdsDelBlog2", MyProcessTxIdsDelBlog2)
      if(MyProcessTxIdsDelBlog2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelBlog2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelBlog2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsDelBlogData1 = await GetMyLastMsg(currentWallet.jwk, BlogProcessTxId1)
          if(MyProcessTxIdsDelBlogData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelBlogData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelBlog2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetBlogsData2 = await MyProcessTxIdsGetBlogs(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetBlogsData2) {
      console.log("MyProcessTxIdsGetBlogsData2", MyProcessTxIdsGetBlogsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetBlogsData2': JSON.stringify(MyProcessTxIdsGetBlogsData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Swap': '==================================================='
    }))
    
    const SwapProcessTxId1 = TokenProcessTxId1
    const SwapProcessTxId2 = TokenProcessTxId2
    
    const MyProcessTxIdsAddSwap1 = await MyProcessTxIdsAddSwap(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, SwapProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddSwap1) {
      console.log("MyProcessTxIdsAddSwap1", MyProcessTxIdsAddSwap1)
      if(MyProcessTxIdsAddSwap1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddSwap1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddSwap1: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddSwapData1 = await GetMyLastMsg(currentWallet.jwk, SwapProcessTxId1)
          if(MyProcessTxIdsAddSwapData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddSwap1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsAddSwap2 = await MyProcessTxIdsAddSwap(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, SwapProcessTxId2, '777', 'Data')
    if(MyProcessTxIdsAddSwap2) {
      console.log("MyProcessTxIdsAddSwap2", MyProcessTxIdsAddSwap2)
      if(MyProcessTxIdsAddSwap2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddSwap2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddSwap2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddSwapData1 = await GetMyLastMsg(currentWallet.jwk, SwapProcessTxId2)
          if(MyProcessTxIdsAddSwapData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddSwap2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetSwapsData1 = await MyProcessTxIdsGetSwaps(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetSwapsData1) {
      console.log("MyProcessTxIdsGetSwapsData1", MyProcessTxIdsGetSwapsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetSwapsData1': JSON.stringify(MyProcessTxIdsGetSwapsData1)
      }))
    }
    
    const MyProcessTxIdsDelSwap2 = await MyProcessTxIdsDelSwap(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, SwapProcessTxId2)
    if(MyProcessTxIdsDelSwap2) {
      console.log("MyProcessTxIdsDelSwap2", MyProcessTxIdsDelSwap2)
      if(MyProcessTxIdsDelSwap2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelSwap2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelSwap2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsDelSwapData1 = await GetMyLastMsg(currentWallet.jwk, SwapProcessTxId1)
          if(MyProcessTxIdsDelSwapData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelSwapData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelSwap2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetSwapsData2 = await MyProcessTxIdsGetSwaps(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetSwapsData2) {
      console.log("MyProcessTxIdsGetSwapsData2", MyProcessTxIdsGetSwapsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetSwapsData2': JSON.stringify(MyProcessTxIdsGetSwapsData2)
      }))
    }

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Project': '==================================================='
    }))
    
    const ProjectProcessTxId1 = TokenProcessTxId1
    const ProjectProcessTxId2 = TokenProcessTxId2
    
    const MyProcessTxIdsAddProject1 = await MyProcessTxIdsAddProject(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, ProjectProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddProject1) {
      console.log("MyProcessTxIdsAddProject1", MyProcessTxIdsAddProject1)
      if(MyProcessTxIdsAddProject1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddProject1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddProject1: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddProjectData1 = await GetMyLastMsg(currentWallet.jwk, ProjectProcessTxId1)
          if(MyProcessTxIdsAddProjectData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddProject1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsAddProject2 = await MyProcessTxIdsAddProject(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, ProjectProcessTxId2, '777', 'Data')
    if(MyProcessTxIdsAddProject2) {
      console.log("MyProcessTxIdsAddProject2", MyProcessTxIdsAddProject2)
      if(MyProcessTxIdsAddProject2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddProject2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddProject2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddProjectData1 = await GetMyLastMsg(currentWallet.jwk, ProjectProcessTxId2)
          if(MyProcessTxIdsAddProjectData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddProject2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetProjectsData1 = await MyProcessTxIdsGetProjects(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetProjectsData1) {
      console.log("MyProcessTxIdsGetProjectsData1", MyProcessTxIdsGetProjectsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetProjectsData1': JSON.stringify(MyProcessTxIdsGetProjectsData1)
      }))
    }
    
    const MyProcessTxIdsDelProject2 = await MyProcessTxIdsDelProject(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, ProjectProcessTxId2)
    if(MyProcessTxIdsDelProject2) {
      console.log("MyProcessTxIdsDelProject2", MyProcessTxIdsDelProject2)
      if(MyProcessTxIdsDelProject2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelProject2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelProject2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsDelProjectData1 = await GetMyLastMsg(currentWallet.jwk, ProjectProcessTxId1)
          if(MyProcessTxIdsDelProjectData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelProjectData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelProject2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetProjectsData2 = await MyProcessTxIdsGetProjects(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetProjectsData2) {
      console.log("MyProcessTxIdsGetProjectsData2", MyProcessTxIdsGetProjectsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetProjectsData2': JSON.stringify(MyProcessTxIdsGetProjectsData2)
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Guess': '==================================================='
    }))
    
    const GuessProcessTxId1 = TokenProcessTxId1
    const GuessProcessTxId2 = TokenProcessTxId2
    
    const MyProcessTxIdsAddGuess1 = await MyProcessTxIdsAddGuess(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, GuessProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddGuess1) {
      console.log("MyProcessTxIdsAddGuess1", MyProcessTxIdsAddGuess1)
      if(MyProcessTxIdsAddGuess1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddGuess1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddGuess1: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddGuessData1 = await GetMyLastMsg(currentWallet.jwk, GuessProcessTxId1)
          if(MyProcessTxIdsAddGuessData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddGuess1: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsAddGuess2 = await MyProcessTxIdsAddGuess(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, GuessProcessTxId2, '777', 'Data')
    if(MyProcessTxIdsAddGuess2) {
      console.log("MyProcessTxIdsAddGuess2", MyProcessTxIdsAddGuess2)
      if(MyProcessTxIdsAddGuess2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddGuess2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddGuess2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsAddGuessData1 = await GetMyLastMsg(currentWallet.jwk, GuessProcessTxId2)
          if(MyProcessTxIdsAddGuessData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddGuess2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetGuessesData1 = await MyProcessTxIdsGetGuesses(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetGuessesData1) {
      console.log("MyProcessTxIdsGetGuessesData1", MyProcessTxIdsGetGuessesData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetGuessesData1': JSON.stringify(MyProcessTxIdsGetGuessesData1)
      }))
    }
    
    const MyProcessTxIdsDelGuess2 = await MyProcessTxIdsDelGuess(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, GuessProcessTxId2)
    if(MyProcessTxIdsDelGuess2) {
      console.log("MyProcessTxIdsDelGuess2", MyProcessTxIdsDelGuess2)
      if(MyProcessTxIdsDelGuess2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelGuess2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
    
          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelGuess2: formatText
          }))
    
          //Read message from inbox
          const MyProcessTxIdsDelGuessData1 = await GetMyLastMsg(currentWallet.jwk, GuessProcessTxId1)
          if(MyProcessTxIdsDelGuessData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelGuessData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelGuess2: formatText2
              }))
            }
          }
    
        }
    
      }
    }
    
    const MyProcessTxIdsGetGuessesData2 = await MyProcessTxIdsGetGuesses(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetGuessesData2) {
      console.log("MyProcessTxIdsGetGuessesData2", MyProcessTxIdsGetGuessesData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'MyProcessTxIdsGetGuessesData2': JSON.stringify(MyProcessTxIdsGetGuessesData2)
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
                        () => { handleSimulatedMyProcessTxIds() }
                    }>
                    {t("Simulated MyProcessTxIds")}
                    </Button>
                  </Box>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/myprocesstxids.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("MyProcessTxIds Lua")}
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

export default MyProcessTxIds

