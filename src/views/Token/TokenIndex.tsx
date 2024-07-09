// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import CircularProgress from '@mui/material/CircularProgress'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import MuiAvatar from '@mui/material/Avatar'
import authConfig from 'src/configs/auth'
import IconButton from '@mui/material/IconButton'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import TokenMint from './TokenMint'
import TokenCreate from './TokenCreate'
import TokenSendOut from './TokenSendOut'
import TokenAirdrop from './TokenAirdrop'
import TokenListChivesToken from './TokenListChivesToken'
import TokenListOfficial from './TokenListOfficial'
import TokenAllTransactions from './TokenAllTransactions'
import TokenMyAllTransactions from './TokenMyAllTransactions'
import TokenReceivedTransactions from './TokenReceivedTransactions'
import TokenSentTransaction from './TokenSentTransaction'

import { GetMyLastMsg, AoCreateProcessAuto, FormatBalance, sleep, isOwner } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintToken, AoTokenTransfer, AoTokenMint, AoTokenAirdrop, AoTokenBalanceDryRun, AoTokenBalancesDryRun, AoTokenBalancesPageDryRun, AoTokenInfoDryRun, AoTokenAllTransactions, AoTokenSentTransactions, AoTokenReceivedTransactions, AoTokenMyAllTransactions, GetTokenAvatar } from 'src/functions/AoConnect/Token'

import { ChivesServerDataGetTokens } from 'src/functions/AoConnect/ChivesServerData'

import { downloadCsv } from 'src/functions/ChatBook'

// ** Third Party Components
import { BigNumber } from 'bignumber.js'
import { ansiRegex } from 'src/configs/functions'

const TokenIndexModel = (prop: any) => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const { myAoConnectTxId,
          tokenLeft,
          tokenInfo,
          setTokenInfo,
          handleAddToken, 
          handleCancelFavoriteToken,
          searchToken, 
          setSearchToken,
          addTokenButtonText, 
          addTokenButtonDisabled, 
          addTokenFavorite, 
          setAddTokenFavorite,
          tokenCreate,
          setTokenCreate,
          counter,
          setCounter,
          tokenGetInfor,
          setTokenGetInfor,
          setAddTokenButtonText,
          setAddTokenButtonDisabled,
          cancelTokenFavorite,
          cancelTokenButtonText, 
          cancelTokenButtonDisabled,
          setCancelTokenFavorite,
          setCancelTokenButtonDisabled
        } = prop
  
  const [myProcessTxIdInPage, setMyProcessTxIdInPage] = useState<string>(myAoConnectTxId)
  useEffect(()=>{
    if(myAoConnectTxId && myAoConnectTxId.length == 43 && myProcessTxIdInPage.length != 43 && myAoConnectTxId != myProcessTxIdInPage) {
      //setMyProcessTxIdInPage(myAoConnectTxId)
    }
  }, [myAoConnectTxId])
  console.log("myProcessTxIdmyProcessTxId", myAoConnectTxId, "myProcessTxIdInPage", myProcessTxIdInPage)

  //const [tokenMint, setTokenMint] = useState<any>({ openMintToken: false, FormSubmit: 'Submit', isDisabledButton: false })
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [isSearchTokenModelOpen, setIsSearchTokenModelOpen] = useState<boolean>(false)
  const [isOwnerStatus, setIsOwnerStatus] = useState<boolean>(false)

  const [tokenListAction, setTokenListAction] = useState<string>("All Holders")
  const [tokenListModel, setTokenListModel] = useState<string>("ChivesToken")
  const [pageId, setPageId] = useState<number>(1)
  const [pageCount, setPageCount] = useState<number>(0)
  const [startIndex, setStartIndex] = useState<number>(1)
  const [endIndex, setEndIndex] = useState<number>(10)
  const pageSize = 10

  useEffect(()=>{
    if(tokenInfo && pageId > 0 && Number(tokenInfo.TokenHolders)>0 ) {
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        TokenBalances: [[],[],[],[],[],[],[],[],[],[]]
      }))
      setPageCount(Math.ceil(tokenInfo.TokenHolders/pageSize))
      setStartIndex((pageId - 1) * pageSize + 1) //start with 1, not 0
      setEndIndex((pageId) * pageSize)
      switch(tokenListAction) {
        case 'All Txs':
          handleAoTokenAllTransactions(tokenGetInfor.CurrentToken)
          console.log("handleAoTokenAllTransactions", pageId, tokenInfo)
          break;
        case 'My Txs':
          handleAoTokenMyAllTransactions(tokenGetInfor.CurrentToken)
          console.log("handleAoTokenMyAllTransactions", pageId, tokenInfo)
          break;
        case 'Sent Txs':
          handleAoTokenSentTransactions(tokenGetInfor.CurrentToken)
          console.log("handleAoTokenSentTransactions", pageId, tokenInfo)
          break;
        case 'Received Txs':
          handleAoTokenReceivedTransactions(tokenGetInfor.CurrentToken)
          console.log("handleAoTokenReceivedTransactions", pageId, tokenInfo)
          break;
        case 'All Holders':
          handleTokenBalancesPagination()
          console.log("handleTokenBalancesPagination", pageId, tokenInfo)
          break;
      }
    }
  }, [pageId, tokenInfo, tokenListAction])

  // ** State
  //const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    if(searchToken && searchToken.length == 43) {
      setIsDisabledButton(true)
      handleTokenSearch(searchToken)
      setIsDisabledButton(false)
    }
  }, [searchToken])

  const handleTokenSearch = async function (CurrentToken: string) {
    if(!CurrentToken) return 

    setPageId(1)
    setPageCount(0)
    setIsDisabledButton(true)
    setIsSearchTokenModelOpen(true)
    setSearchToken(CurrentToken)
    setCancelTokenFavorite(false)

    const isOwnerData = await isOwner(CurrentToken, currentAddress)
    setIsOwnerStatus(isOwnerData)
    console.log("isOwnerData", isOwnerData)
    
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      TokenProcessTxId: CurrentToken,
      CurrentToken: CurrentToken,
      Logo: null,
      Denomination: null,
      TokenBalance: 0,
      TokenBalancesAllRecords: null,
      TokenBalances: null,
      TokenHolders: null,
      CirculatingSupply: null,
      Version: null,
      Release: null
    }))

    const TokenGetMap: any = await AoTokenInfoDryRun(CurrentToken)
    console.log("handleTokenSearch TokenGetMap", TokenGetMap)
    const TokenModelType = TokenGetMap && TokenGetMap.Release == "ChivesToken" ? TokenGetMap.Release : "Official"
    const Denomination = TokenGetMap.Denomination
    if(TokenGetMap)  {
      if(TokenGetMap.TokenHolders) {
        setPageCount(Math.ceil(TokenGetMap.TokenHolders/pageSize))
      }
      setTokenListModel(TokenGetMap.Release == "ChivesToken" ? TokenGetMap.Release : "Official")
      setTokenInfo(TokenGetMap)
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        Denomination: TokenGetMap.Denomination,
        TokenHolders: TokenGetMap?.TokenHolders,
        CirculatingSupply: TokenGetMap?.TotalSupply,
        ...TokenGetMap
      }))
      const isFavorite = tokenLeft.some((item: any) => item.Id == CurrentToken)
      if(isFavorite) {
        setAddTokenButtonText('Have favorite')
        setAddTokenButtonDisabled(true)
        setCancelTokenFavorite(true)
        setCancelTokenButtonDisabled(false)
      }
      else {
        setAddTokenButtonText('Add favorite')
        setAddTokenButtonDisabled(false)
        setCancelTokenFavorite(false)
      }
    }
    else {

      //No Token Infor
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        Name: null,
        Ticker: null,
        Balance: null,
        Logo: null,
        TokenHolders: null,
        CirculatingSupply: null,
        Denomination: null,
        TokenBalance: 0,
        TokenBalancesAllRecords: null,
        TokenBalances: null,
      }))
      setTokenListAction('')
    }
    
    console.log("handleTokenSearch tokenGetInfor", tokenGetInfor)
    if(isOwnerData == false) {
      const AoDryRunBalance = await AoTokenBalanceDryRun(CurrentToken, myProcessTxIdInPage)
      if(AoDryRunBalance && tokenInfo && Denomination) {
        setTokenGetInfor((prevState: any)=>({
          ...prevState,
          TokenBalance: FormatBalance(AoDryRunBalance, Number(Denomination))
        }))
      }
    }
    else {
      if(tokenInfo && Denomination) {
        setMyProcessTxIdInPage(CurrentToken)
        const AoDryRunBalance = await AoTokenBalanceDryRun(CurrentToken, CurrentToken)
        if(AoDryRunBalance) {
          setTokenGetInfor((prevState: any)=>({
            ...prevState,
            TokenBalance: FormatBalance(AoDryRunBalance, Number(Denomination))
          }))
        }
      }
    }

    console.log("tokenInfo.ReleasetokenInfo.ReleasetokenInfo.ReleasetokenInfo.Release", tokenInfo?.Release)
    if(TokenModelType == "ChivesToken") {
      await handleAoTokenBalancesDryRunChivesToken(CurrentToken, Denomination)
    }
    else {
      await handleAoTokenBalancesDryRunOfficialToken(CurrentToken, Denomination)
    }

    setIsDisabledButton(false)

  }

  const handleTokenBalancesPagination = async function () {
    if(tokenInfo && tokenInfo.Release == "ChivesToken") {
      await handleAoTokenBalancesDryRunChivesToken(tokenGetInfor.CurrentToken, tokenInfo.Denomination)
    }
    else {
      await handleAoTokenBalancesDryRunOfficialToken(tokenGetInfor.CurrentToken, tokenInfo.Denomination)
    }
  }

  const handleTokenCreate = async function (tokenCreate: any) {

    let TokenProcessTxId: any = null
    if(tokenCreate && tokenCreate.ManualProcessTxId && tokenCreate.ManualProcessTxId.length == 43) {
      TokenProcessTxId = tokenCreate?.ManualProcessTxId
      const TokenGetMap = await AoTokenInfoDryRun(TokenProcessTxId)
      if(TokenGetMap) {
        toast.error(t('This token have created, can not create again'), {
          duration: 4000
        })

        return 
      }
    }
    else {
      TokenProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
      while(TokenProcessTxId && TokenProcessTxId.length != 43) {
        TokenProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
        console.log("TokenProcessTxId", TokenProcessTxId)
      }
    }

    if (TokenProcessTxId) {
      setTokenGetInfor((prevState: any) => ({
        ...prevState,
        TokenProcessTxId: TokenProcessTxId,
        CurrentToken: TokenProcessTxId
      }));
    }
  
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          let LoadBlueprintToken: any = await AoLoadBlueprintToken(currentWallet.jwk, TokenProcessTxId, tokenCreate);
          while(LoadBlueprintToken && LoadBlueprintToken.status == 'ok' && LoadBlueprintToken.msg && LoadBlueprintToken.msg.error)  {
            sleep(6000)
            LoadBlueprintToken = await AoLoadBlueprintToken(currentWallet.jwk, TokenProcessTxId, tokenCreate);
            console.log("handleTokenCreate LoadBlueprintToken:", LoadBlueprintToken);
          }
  
          const AoDryRunBalance = await AoTokenBalanceDryRun(TokenProcessTxId, myProcessTxIdInPage);
          if (AoDryRunBalance) {
            setCounter(counter + 1)
            setTokenGetInfor((prevState: any) => ({
              ...prevState,
              TokenBalance: FormatBalance(AoDryRunBalance, 12)
            }));
            resolve({ Token: TokenProcessTxId, Balance: FormatBalance(AoDryRunBalance, 12) });
          }
        } catch (error) {
          console.log("handleTokenCreate Error:", error);
          reject(error);
        }
      }, 5000);
    });
    
  }

  const handleAoTokenAllTransactions = async function (CurrentToken: string) {
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      AoTokenAllTransactionsList: [[],[],[],[],[],[],[],[],[],[]],
    }))
    const AoDryRunData: any = await AoTokenAllTransactions(CurrentToken, String(startIndex), String(endIndex))
    console.log("AoDryRunData", AoDryRunData)
    try{
      if(AoDryRunData) {
        setTokenGetInfor((prevState: any)=>({
          ...prevState,
          AoTokenAllTransactionsList: AoDryRunData[0],
          AoTokenAllTransactionsCount: AoDryRunData[1],
        }))
        setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
      }
    }
    catch(Error: any) {
      console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
    }
  }

  const handleAoTokenMyAllTransactions = async function (CurrentToken: string) {
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      AoTokenMyAllTransactionsList: [[],[],[],[],[],[],[],[],[],[]],
    }))
    const AoDryRunData: any = await AoTokenMyAllTransactions(CurrentToken, myProcessTxIdInPage, String(startIndex), String(endIndex))
    console.log("AoDryRunData", AoDryRunData)
    try{
      if(AoDryRunData) {
        setTokenGetInfor((prevState: any)=>({
          ...prevState,
          AoTokenMyAllTransactionsList: AoDryRunData[0],
          AoTokenMyAllTransactionsCount: AoDryRunData[1],
        }))
        setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
      }
    }
    catch(Error: any) {
      console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
    }
  }

  const handleAoTokenSentTransactions = async function (CurrentToken: string) {
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      AoTokenSentTransactionsList: [[],[],[],[],[],[],[],[],[],[]],
    }))
    const AoDryRunData: any = await AoTokenSentTransactions(CurrentToken, myProcessTxIdInPage, String(startIndex), String(endIndex))
    console.log("handleAoTokenSentTransactions AoDryRunData", AoDryRunData)
    try{
      if(AoDryRunData) {
        setTokenGetInfor((prevState: any)=>({
          ...prevState,
          AoTokenSentTransactionsList: AoDryRunData[0],
          AoTokenSentTransactionsCount: AoDryRunData[1],
        }))
        setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
      }
    }
    catch(Error: any) {
      console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
    }
  }

  const handleAoTokenReceivedTransactions = async function (CurrentToken: string) {
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      AoTokenReceivedTransactionsList: [[],[],[],[],[],[],[],[],[],[]],
    }))
    const AoDryRunData: any = await AoTokenReceivedTransactions(CurrentToken, myProcessTxIdInPage, String(startIndex), String(endIndex))
    console.log("handleAoTokenReceivedTransactions AoDryRunData", AoDryRunData)
    try{
      if(AoDryRunData) {
        setTokenGetInfor((prevState: any)=>({
          ...prevState,
          AoTokenReceivedTransactionsList: AoDryRunData[0],
          AoTokenReceivedTransactionsCount: AoDryRunData[1],
        }))
        setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
      }
    }
    catch(Error: any) {
      console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
    }
  }

  const handleAoTokenBalancesDryRunOfficialToken = async function (CurrentToken: string, Denomination: number) {
    if(authConfig.AoConnectBlockTxIds.includes(CurrentToken)) {
      console.log("handleAoTokenBalancesDryRunOfficialToken", "This token can not search txs records, due to txs are too large.")

      return 
    }
    console.log("handleAoTokenBalancesDryRunOfficialToken Log", tokenGetInfor, tokenInfo)
    if(tokenGetInfor || tokenGetInfor.TokenBalancesAllRecords == undefined)   {
      const AoDryRunBalances = await AoTokenBalancesDryRun(CurrentToken)
      if(AoDryRunBalances && tokenInfo && Denomination) {
        try{
          const AoDryRunBalancesJson = JSON.parse(AoDryRunBalances)
          const AoDryRunBalancesJsonMap = new Map(Object.entries(AoDryRunBalancesJson));
          const AoDryRunBalancesJsonSorted = Array.from(AoDryRunBalancesJsonMap.entries()).filter(([, value] : any) => Number(value) > 0);
          AoDryRunBalancesJsonSorted.sort((a: any, b: any) => b[1] - a[1]);
          const TokenHolders = AoDryRunBalancesJsonSorted.length
          let CirculatingSupply = BigNumber(0)
          const AoDryRunBalancesJsonSortedResult = AoDryRunBalancesJsonSorted.map((Item: any)=>{
            const HolderBalance = FormatBalance(Number(Item[1]), Number(Denomination))
            CirculatingSupply = CirculatingSupply.plus(HolderBalance)

            return [Item[0], HolderBalance]
          })
          setPageCount(Math.ceil(AoDryRunBalancesJsonSorted.length/pageSize))
          setTokenGetInfor((prevState: any)=>({
            ...prevState,
            TokenBalancesAllRecords: AoDryRunBalancesJsonSortedResult,
            TokenHolders: TokenHolders,
            CirculatingSupply: CirculatingSupply.toString()
          }))
          console.log("handleAoTokenBalancesDryRunOfficialToken", AoDryRunBalancesJsonSortedResult, "TokenHolders", TokenHolders, tokenInfo, tokenGetInfor)
        }
        catch(Error: any) {
          console.log("handleAoTokenBalancesDryRunOfficialToken Error", Error)
        }
      }
    }
  }

  const handleAoTokenBalancesDryRunChivesToken = async function (CurrentToken: string, Denomination: number) {
    if(authConfig.AoConnectBlockTxIds.includes(CurrentToken)) {
      console.log("handleAoTokenBalancesDryRunChivesToken", "This token can not search txs records, due to txs are too large.")

      return 
    }
    const AoDryRunBalances = await AoTokenBalancesPageDryRun(CurrentToken, String(startIndex), String(endIndex))
    if(AoDryRunBalances && tokenInfo && Denomination) {
      try{
        const AoDryRunBalancesData = JSON.parse(AoDryRunBalances)
        console.log("AoDryRunBalancesData", AoDryRunBalancesData)
        const AoDryRunBalancesJson = AoDryRunBalancesData[0]
        const TokenHolders = AoDryRunBalancesData[1]
        const CirculatingSupply = FormatBalance(AoDryRunBalancesData[2], Number(Denomination))
        const AoDryRunBalancesJsonSorted = Object.entries(AoDryRunBalancesJson)
                          .sort((a: any, b: any) => b[1] - a[1])
                          .reduce((acc: any, [key, value]) => {
                              acc[key] = FormatBalance(Number(value), Number(Denomination));
                              
                              return acc;
                          }, {} as { [key: string]: number });
        setTokenGetInfor((prevState: any)=>({
          ...prevState,
          TokenBalances: AoDryRunBalancesJsonSorted,
          TokenBalancesAllRecords: null,
          TokenHolders: TokenHolders,
          CirculatingSupply: CirculatingSupply.toString()
        }))
        console.log("AoDryRunBalances", AoDryRunBalancesJsonSorted, "TokenHolders", TokenHolders)
      }
      catch(Error: any) {
        console.log("handleAoTokenBalancesDryRunChivesToken AoTokenBalancesPageDryRun Error", Error)
      }
    }
  }


  const handleTokenMint = async function (TokenProcessTxId: string, MintAmount: number) {

    if(MintAmount == null || Number(MintAmount) <= 0) return

    const TokenGetMap = await AoTokenInfoDryRun(TokenProcessTxId)
    if(TokenGetMap == null) {
      toast.error(t('This token not exist, please create first'), {
        duration: 4000
      })

      return 
    }

    setIsDisabledButton(true)
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      disabledSendOutButton: true
    }))

    const MintTokenData = await AoTokenMint(currentWallet.jwk, TokenProcessTxId, MintAmount)
    if(MintTokenData) {
      console.log("MintTokenData", MintTokenData)
      if(MintTokenData?.msg?.Output?.data?.output)  {
        const formatText = MintTokenData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
          const MintTokenInboxData = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId)
          if(MintTokenInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = MintTokenInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(formatText2, {
                duration: 2000
              })
            }
            await handleTokenSearch(TokenProcessTxId)
          }
        }
      }
    }

    setIsDisabledButton(false)
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      disabledSendOutButton: false
    }))

  }

  const handleTokenAirdrop = async function (TokenProcessTxId: string, AddressList: string, AmountList: string) {

    if(AddressList == null) return
    if(AmountList == null) return

    const TokenGetMap = await AoTokenInfoDryRun(TokenProcessTxId)
    if(TokenGetMap == null) {
      toast.error(t('This token not exist, please create first'), {
        duration: 4000
      })

      return 
    }

    setIsDisabledButton(true)
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      disabledSendOutButton: true
    }))

    const MintTokenData = await AoTokenAirdrop(currentWallet.jwk, TokenProcessTxId, AddressList, AmountList)
    if(MintTokenData) {
      console.log("MintTokenData", MintTokenData)
      if(MintTokenData?.msg?.Output?.data?.output)  {
        const formatText = MintTokenData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
          const MintTokenInboxData = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId)
          if(MintTokenInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = MintTokenInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(formatText2, {
                duration: 2000
              })
            }
            await handleTokenSearch(TokenProcessTxId)
          }
        }
      }
    }

    setIsDisabledButton(false)
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      disabledSendOutButton: false
    }))

  }

  const handleTokenSendOut = async function (TokenProcessTxId: string, ReceivedAddress: string, Amount: number) {

    if(Amount == null || Number(Amount) <= 0) return
    
    setIsDisabledButton(true)

    const AoTokenTransferData = await AoTokenTransfer(currentWallet.jwk, TokenProcessTxId, myProcessTxIdInPage, ReceivedAddress, Number(Amount))
    if(AoTokenTransferData && tokenInfo && tokenInfo.Denomination) {
      console.log("AoTokenTransferData", AoTokenTransferData)
      if(AoTokenTransferData?.msg?.Output?.data?.output)  {
        const formatText = AoTokenTransferData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
          const AoTokenTransferInboxData = await GetMyLastMsg(currentWallet.jwk, myProcessTxIdInPage)
          if(AoTokenTransferInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AoTokenTransferInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(formatText2, {
                duration: 5000
              })
            }
            
            if(tokenInfo && tokenInfo.Release == "ChivesToken") {
              await handleAoTokenBalancesDryRunChivesToken(TokenProcessTxId, tokenInfo.Denomination)
            }
            else {
              await handleAoTokenBalancesDryRunOfficialToken(TokenProcessTxId, tokenInfo.Denomination)
            }

            const AoDryRunBalance = await AoTokenBalanceDryRun(TokenProcessTxId, myProcessTxIdInPage)
            if(AoDryRunBalance) {
              setTokenGetInfor((prevState: any)=>({
                ...prevState,
                TokenBalance: FormatBalance(AoDryRunBalance, Number(tokenInfo.Denomination))
              }))
            }

          }
        }
      }
    }

    setIsDisabledButton(false)
  }

  const handleExportHolders = () => {
    if(tokenGetInfor && tokenGetInfor.TokenBalancesAllRecords) {
      const CsvList = tokenGetInfor.TokenBalancesAllRecords.map((item: any)=>{

        return item[0] + "," + item[1]
      })
      downloadCsv(CsvList.join('\n'), "TokenAllHolders[" + tokenGetInfor.CurrentToken + "]")
      toast.success(t('Download all holders data success'), {
        duration: 4000
      })
    }
  }

  const [serverData, setServerData] = useState<any[]>([])

  useEffect(()=>{
    handleGetServerData()
  }, [])

  const handleGetServerData = async () => {
    
    const ChivesServerDataGetTokensData1 = await ChivesServerDataGetTokens(authConfig.AoConnectChivesServerData, authConfig.AoConnectChivesServerData)
    
    if(ChivesServerDataGetTokensData1) {
        const dataArray = Object.values(ChivesServerDataGetTokensData1);
        dataArray.sort((a: any, b: any) => {
            if (a.TokenGroup == b.TokenGroup) {
                return Number(a.TokenSort) - Number(b.TokenSort);
            } else {
                return a.TokenGroup.localeCompare(b.TokenGroup);
            }
        });
        setServerData(dataArray)
        console.log("ChivesServerDataGetTokensData1 dataArray", dataArray)
    }

  }

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{ padding: '0 8px' }}>
              {myProcessTxIdInPage ?
              <Grid container>
                <Grid item xs={12}>
                  <Card>
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography noWrap variant='body1' sx={{ my: 2, mx: 2 }}>
                          {t("Token Explorer")}
                      </Typography>
                      <Typography noWrap variant='body2' sx={{}}>
                          MyAo: {myProcessTxIdInPage}
                      </Typography>
                      <IconButton sx={{mt: 1, ml: 1}} aria-label='capture screenshot' color='secondary' size='small' onClick={() => {
                          navigator.clipboard.writeText(myProcessTxIdInPage);
                          toast.success(t('Copied success') as string, { duration: 1000 });
                      }}>
                          <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                      </IconButton>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12} sx={{my: 2}}>
                  <Card>

                      {addTokenFavorite == true && (
                        <Grid item sx={{ display: 'column', m: 2 }}>
                          <TextField
                              sx={{ml: 2, my: 2}}
                              size="small"
                              label={`${t('CurrentToken')}`}
                              placeholder={`${t('CurrentToken')}`}
                              value={tokenGetInfor?.CurrentToken ?? ''}
                              onChange={(e: any)=>{
                                setTokenGetInfor((prevState: any)=>({
                                  ...prevState,
                                  CurrentToken: e.target.value
                                }))
                              }}
                              InputProps={{
                                  startAdornment: (
                                      <InputAdornment position='start'>
                                      <Icon icon='mdi:account-outline' />
                                      </InputAdornment>
                                  )
                              }}
                          />

                          <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                              () => { handleTokenSearch(tokenGetInfor?.CurrentToken) }
                          }>
                          {t("Search Token")}
                          </Button>
                          
                          {!addTokenButtonDisabled && (
                            <TextField
                                sx={{ml: 2, my: 2, width: '120px'}}
                                size="small"
                                label={`${t('Sort')}`}
                                placeholder={`${t('Sort')}`}
                                value={tokenGetInfor?.Sort ?? ''}
                                onChange={(e: any)=>{
                                  setTokenGetInfor((prevState: any)=>({
                                    ...prevState,
                                    Sort: e.target.value
                                  }))
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                            />
                          )}
                          <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={addTokenButtonDisabled} size="small" variant='outlined' onClick={
                              () => { 
                                if(tokenGetInfor.CurrentToken) {
                                  handleAddToken(tokenGetInfor.CurrentToken)
                                }
                              }
                          }>
                          {t(addTokenButtonText)}
                          </Button>

                          {cancelTokenFavorite && (
                            <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={cancelTokenButtonDisabled} size="small" variant='outlined' onClick={
                                () => { 
                                  if(tokenGetInfor.CurrentToken) {
                                    handleCancelFavoriteToken(tokenGetInfor.CurrentToken)
                                  }
                                }
                            }>
                            {t(cancelTokenButtonText)}
                            </Button>
                          )}

                        </Grid>
                      )}

                      { searchToken && (addTokenFavorite == false || isSearchTokenModelOpen) && tokenGetInfor && tokenGetInfor.CurrentToken && (
                        <Fragment>
                          {tokenGetInfor && tokenGetInfor.Name && (
                            <Grid item sx={{ display: 'flex', flexDirection: 'row', m: 2 }}>
                              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', pt: 0.8 }}>
                                  Token: {searchToken}
                              </Typography>
                              {searchToken && (
                                <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                                    navigator.clipboard.writeText(searchToken);
                                    toast.success(t('Copied success') as string, { duration: 1000 })
                                }}>
                                    <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                                </IconButton>
                              )}
                            </Grid>
                          )}
                          {tokenGetInfor && tokenGetInfor.Name == null && (
                            <Grid item sx={{ display: 'flex', flexDirection: 'row', m: 2 }}>
                              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', pt: 0.8, ml: 2, color: `error.main` }}>
                                  {searchToken} is not a token.
                              </Typography>
                            </Grid>
                          )}
                          
                          <Grid item sx={{ display: 'column', m: 2 }}>
                            {tokenGetInfor && tokenGetInfor?.Name && (
                              <>
                              <Box
                                sx={{
                                  py: 3,
                                  px: 5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                                  borderTop: theme => `1px solid ${theme.palette.divider}`
                                }}
                                >            
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center'}} >
                                    <Badge
                                      overlap='circular'
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                      }}
                                      sx={{ mr: 3 }}
                                    >
                                      <MuiAvatar
                                        src={GetTokenAvatar(tokenGetInfor?.Logo)}
                                        alt={tokenGetInfor?.Name}
                                        sx={{ width: '2.5rem', height: '2.5rem' }}
                                      />
                                    </Badge>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                        {tokenGetInfor?.Name ?? 'Token'}
                                        <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Balance: {tokenGetInfor.TokenBalance ?? '...'}</Typography>
                                        <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Denomination: {tokenGetInfor?.Denomination ?? ''}</Typography>
                                        <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Version: {tokenGetInfor?.Version ?? ''}</Typography>
                                      </Typography>
                                      <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                                        {tokenGetInfor?.Ticker}
                                        <Link href={authConfig.AoConnectAoLink + `/token/${tokenGetInfor?.TokenProcessTxId}`} target='_blank'>
                                          <Typography noWrap variant='body2' sx={{ml: 2, mr: 1, display: 'inline', color: 'primary.main'}}>{tokenGetInfor?.TokenProcessTxId}</Typography>
                                        </Link>
                                        {tokenGetInfor?.TokenProcessTxId && (
                                            <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                                                navigator.clipboard.writeText(tokenGetInfor?.TokenProcessTxId);
                                            }}>
                                                <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                                            </IconButton>
                                        )}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 3 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                      {t('Token holders')}
                                    </Typography>
                                    <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                                      {t('Circulating supply')}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 3 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                      {tokenGetInfor?.TokenHolders}
                                    </Typography>
                                    <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                                      {tokenGetInfor?.CirculatingSupply}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              </>
                            )}

                          </Grid>

                          <Grid item sx={{ display: 'column', m: 2 }}>

                            <TokenCreate tokenCreate={tokenCreate} setTokenCreate={setTokenCreate} handleTokenCreate={handleTokenCreate} handleTokenSearch={handleTokenSearch} handleAddToken={handleAddToken} setCounter={setCounter}/>

                            <TokenMint tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} handleTokenMint={handleTokenMint} handleTokenSearch={handleTokenSearch} />

                            <TokenAirdrop tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} handleTokenAirdrop={handleTokenAirdrop} handleTokenSearch={handleTokenSearch} />

                            {isOwnerStatus && tokenGetInfor && tokenGetInfor.Name && (
                              <Fragment>
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      setTokenGetInfor((prevState: any)=>({
                                        ...prevState,
                                        openMintToken: true
                                      }))
                                    }
                                }>
                                {t("Mint")}
                                </Button>
                              </Fragment>
                            )}
                            
                            {isOwnerStatus && Number(tokenGetInfor.Version) >= 20240620 && tokenGetInfor && tokenGetInfor.Name && (
                              <Fragment>
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      setTokenGetInfor((prevState: any)=>({
                                        ...prevState,
                                        openAirdropToken: true
                                      }))
                                    }
                                }>
                                {t("Airdrop")}
                                </Button>
                              </Fragment>
                            )}

                            {tokenGetInfor?.Version && Number(tokenGetInfor.Version) >= 20240620 && tokenGetInfor && tokenGetInfor.Name && (
                              <Fragment>
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      setTokenListAction("All Txs")
                                      setPageId(1)
                                    }
                                }>
                                {t("All Txs")}
                                </Button>     
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      setTokenListAction("My Txs")
                                      setPageId(1)
                                    }
                                }>
                                {t("My Txs")}
                                </Button>                          
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      setTokenListAction("Sent Txs")
                                      setPageId(1)
                                    }
                                }>
                                {t("Sent Txs")}
                                </Button>                              
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      setTokenListAction("Received Txs")
                                      setPageId(1)
                                    }
                                }>
                                {t("Received Txs")}
                                </Button>
                              </Fragment>
                            )}
                            
                            {tokenGetInfor && tokenGetInfor.Name && (
                              <Fragment>
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      setTokenListAction("All Holders")
                                      setPageId(1) 
                                    }
                                }>
                                {t("All Holders")}
                                </Button>
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { setTokenGetInfor((prevState: any)=>({
                                        ...prevState,
                                        openSendOutToken: true,
                                        SendOutToken: "",
                                    })) }
                                }>
                                {t("Send")}
                                </Button>
                              </Fragment>
                            )}

                            {tokenGetInfor && tokenGetInfor.Name && tokenGetInfor.TokenBalancesAllRecords && tokenInfo && tokenInfo.Release == undefined && (
                              <Fragment>
                                <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                                    () => { 
                                      handleExportHolders()
                                    }
                                }>
                                {t("Export Holders")}
                                </Button>
                              </Fragment>
                            )}

                          </Grid>

                          {tokenListAction == "All Txs" && (
                            <Grid item sx={{ display: 'column', m: 2 }}>
                              <TokenAllTransactions tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} setPageId={setPageId} pageId={pageId} pageCount={pageCount} startIndex={startIndex} />
                            </Grid>
                          )}

                          {tokenListAction == "My Txs" && (
                            <Grid item sx={{ display: 'column', m: 2 }}>
                              <TokenMyAllTransactions tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} setPageId={setPageId} pageId={pageId} pageCount={pageCount} startIndex={startIndex} />
                            </Grid>
                          )}

                          {tokenListAction == "Sent Txs" && (
                            <Grid item sx={{ display: 'column', m: 2 }}>
                              <TokenSentTransaction tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} setPageId={setPageId} pageId={pageId} pageCount={pageCount} startIndex={startIndex} />
                            </Grid>
                          )}

                          {tokenListAction == "Received Txs" && (
                            <Grid item sx={{ display: 'column', m: 2 }}>
                              <TokenReceivedTransactions tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} setPageId={setPageId} pageId={pageId} pageCount={pageCount} startIndex={startIndex} />
                            </Grid>
                          )}

                          {tokenListAction == "All Holders" && tokenListModel == "ChivesToken" && (
                            <Grid item sx={{ display: 'column', m: 2 }}>
                              <TokenListChivesToken tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} setPageId={setPageId} pageId={pageId} pageCount={pageCount} startIndex={startIndex} />
                            </Grid>
                          )}

                          {tokenListAction == "All Holders" && tokenListModel == "Official" && (
                            <Grid item sx={{ display: 'column', m: 2 }}>
                              <TokenListOfficial tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} setPageId={setPageId} pageId={pageId} pageCount={pageCount} startIndex={startIndex} pageSize={pageSize} />
                            </Grid>
                          )}

                          
                          {tokenGetInfor && tokenGetInfor.openSendOutToken && ( 
                            <TokenSendOut tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} handleTokenSendOut={handleTokenSendOut} /> 
                          )}
                          
                        
                        </Fragment>
                      )}

                      { serverData && searchToken == '' && (
                        <TableContainer>
                          <Table>
                          <TableBody>
                          <TableRow sx={{my: 0, py: 0}}>
                              <TableCell sx={{my: 0, py: 0}}>
                                  Id
                              </TableCell>
                              <TableCell sx={{my: 0, py: 0}}>
                                  Token
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
                          </TableRow>
                          {serverData && serverData.map((Item: any, Index: number)=>{
              
                              const Row = Item
                              const serverModel = "Token"

                              let ServerModelData = null
                              let AvatarLogo = ""
                              try{ 
                                  ServerModelData = Row[serverModel + 'Data'] && JSON.parse(Row[serverModel + 'Data'])
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
                                                <Box sx={{ display: 'flex', alignItems: 'center'}} >
                                                  <Badge
                                                    overlap='circular'
                                                    anchorOrigin={{
                                                      vertical: 'bottom',
                                                      horizontal: 'right'
                                                    }}
                                                    sx={{ mr: 3 }}
                                                  >
                                                    <MuiAvatar
                                                      src={GetTokenAvatar(AvatarLogo)}
                                                      alt={Row[serverModel + 'Id']}
                                                      sx={{ width: '2.5rem', height: '2.5rem' }}
                                                    />
                                                  </Badge>
                                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                      {ServerModelData?.Name ?? 'Token'}
                                                      <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Denomination: {ServerModelData?.Denomination ?? ''}</Typography>
                                                      <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Version: {ServerModelData?.Version ?? ''}</Typography>
                                                    </Typography>
                                                    <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                                                      {ServerModelData?.Ticker}
                                                      <Link href={authConfig.AoConnectAoLink + `/token/${Row[serverModel + 'Id']}`} target='_blank'>
                                                        <Typography noWrap variant='body2' sx={{ml: 2, mr: 1, display: 'inline', color: 'primary.main'}}>{Row[serverModel + 'Id']}</Typography>
                                                      </Link>
                                                      <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                                                          navigator.clipboard.writeText(Row[serverModel + 'Id']);
                                                        }}>
                                                          <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                                                      </IconButton>
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                              </TableCell>
                                              <TableCell sx={{my: 0, py: 0}}>
                                                  <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Row[serverModel + 'Group']}</Typography>
                                              </TableCell>
                                              <TableCell sx={{my: 0, py: 0}}>
                                                  <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Row[serverModel + 'Sort']}</Typography>
                                              </TableCell>
                                              <TableCell sx={{my: 0, py: 0}}>
                                                  <Button sx={{textTransform: 'none', my: 0}} size="small" disabled={isDisabledButton} variant='outlined'  onClick={
                                                      () => { 
                                                        setAddTokenFavorite(true)
                                                        handleTokenSearch(Row[serverModel + 'Id'])
                                                        setTokenGetInfor((prevState: any)=>({
                                                          ...prevState,
                                                          CurrentToken: Row[serverModel + 'Id']
                                                        }))
                                                       }
                                                  }>
                                                  {t("View")}
                                                  </Button>
                                              </TableCell>
                                          </TableRow>
                                      )}
                                  </Fragment>
                              )
                              
                          })}
                      
                          </TableBody>
                          </Table>
              
                          {serverData && serverData == null && isDisabledButton == true && (
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
              
                          {serverData && serverData.length == 0 && isDisabledButton == false && (
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
                      )}
                      
                  </Card>
                </Grid>
              </Grid>
              :
              null
              }
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default TokenIndexModel

