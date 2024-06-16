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

import TokenList from './TokenList'
import TokenMint from './TokenMint'
import TokenCreate from './TokenCreate'
import TokenSendOut from './TokenSendOut'
import TokenAirdrop from './TokenAirdrop'

import { GetMyLastMsg, AoCreateProcessAuto, FormatBalance, sleep, isOwner } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintToken, AoTokenTransfer, AoTokenMint, AoTokenAirdrop, AoTokenBalanceDryRun, AoTokenBalancesDryRun, AoTokenBalancesPageDryRun, AoTokenInfoDryRun } from 'src/functions/AoConnect/Token'

// , AoTokenAllTransactions, AoTokenSentTransactions, AoTokenReceivedTransactions

import { BigNumber } from 'bignumber.js'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const Inbox = (prop: any) => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const { myProcessTxId,
          tokenLeft,
          handleAddToken, 
          searchToken, 
          setSearchToken,
          addTokenButtonText, 
          addTokenButtonDisabled, 
          addTokenFavorite, 
          tokenCreate,
          setTokenCreate,
          counter,
          setCounter,
          tokenGetInfor,
          setTokenGetInfor,
          setAddTokenButtonText,
          setAddTokenButtonDisabled
        } = prop
  
  const [myProcessTxIdInPage, setMyProcessTxIdInPage] = useState<string>(myProcessTxId)

  //const [tokenMint, setTokenMint] = useState<any>({ openMintToken: false, FormSubmit: 'Submit', isDisabledButton: false })
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [isSearchTokenModelOpen, setIsSearchTokenModelOpen] = useState<boolean>(false)
  const [isOwnerStatus, setIsOwnerStatus] = useState<boolean>(false)

  const [pageId, setPageId] = useState<number>(1)
  const [pageCount, setPageCount] = useState<number>(0)
  const [startIndex, setStartIndex] = useState<number>(1)
  const [endIndex, setEndIndex] = useState<number>(10)
  const [tokenInfo, setTokenInfo] = useState<any>(null)
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
      handleTokenBalancesPagination()
      console.log("handleTokenBalancesPagination", pageId, tokenInfo)
    }
  }, [pageId, tokenInfo])

  // ** State
  //const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    if(searchToken && searchToken.length == 43) {
      setIsDisabledButton(true)
      handleTokenSearch(searchToken)
      setIsDisabledButton(false)
    }
  }, [searchToken])

  useEffect(()=>{
    if(searchToken && searchToken.length == 43 && currentAddress && currentAddress.length == 43) {
      handleCheckIsOwner(searchToken, currentAddress)
    }
  }, [searchToken, currentAddress])

  const handleCheckIsOwner = async function (CurrentToken: string, currentAddress: string) {
    if(!CurrentToken) return 
    if(!currentAddress) return 
    const isOwnerData = await isOwner(CurrentToken, currentAddress)
    if(isOwnerData) {
      setIsOwnerStatus(true)
      setMyProcessTxIdInPage(CurrentToken)
      const AoDryRunBalance = await AoTokenBalanceDryRun(CurrentToken, CurrentToken)
      if(AoDryRunBalance) {
        setTokenGetInfor((prevState: any)=>({
          ...prevState,
          TokenBalance: FormatBalance(AoDryRunBalance)
        }))
      }
    }
    console.log("isOwnerData", isOwnerData)
  }

  const handleTokenSearch = async function (CurrentToken: string) {
    if(!CurrentToken) return 

    setPageId(1)
    setPageCount(0)
    setIsDisabledButton(true)
    setIsSearchTokenModelOpen(true)
    setSearchToken(CurrentToken)

    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      TokenProcessTxId: CurrentToken,
      CurrentToken: CurrentToken,
      Logo: null,
      TokenBalance: 0,
      TokenBalances: null,
      TokenHolders: null,
      CirculatingSupply: null,
      Version: null,
      Release: null
    }))

    const AoDryRunBalance = await AoTokenBalanceDryRun(CurrentToken, myProcessTxIdInPage)
    if(AoDryRunBalance) {
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        TokenBalance: FormatBalance(AoDryRunBalance)
      }))
    }

    const TokenGetMap: any = await AoTokenInfoDryRun(CurrentToken)
    console.log("handleTokenSearch TokenGetMap", TokenGetMap)
    if(TokenGetMap)  {
      if(TokenGetMap.TokenHolders) {
        setPageCount(Math.ceil(TokenGetMap.TokenHolders/pageSize))
      }
      setTokenInfo(TokenGetMap)
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        Version: null,
        Release: null,
        TokenHolders: TokenGetMap?.TokenHolders,
        CirculatingSupply: TokenGetMap?.TotalSupply,
        ...TokenGetMap
      }))
      const isFavorite = tokenLeft.some((item: any) => item.Id == CurrentToken)
      if(isFavorite) {
        setAddTokenButtonText('Have favorite')
        setAddTokenButtonDisabled(true)
      }
      else {
        setAddTokenButtonText('Add favorite')
        setAddTokenButtonDisabled(false)
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
        Version: null,
        Release: null
      }))
    }

    await handleAoTokenBalancesDryRun(CurrentToken, TokenGetMap?.Release)

    setIsDisabledButton(false)

  }

  const handleTokenBalancesPagination = async function () {
    await handleAoTokenBalancesDryRun(tokenGetInfor.CurrentToken, tokenGetInfor.Release)
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
              TokenBalance: FormatBalance(AoDryRunBalance)
            }));
            resolve({ Token: TokenProcessTxId, Balance: FormatBalance(AoDryRunBalance) });
          }
        } catch (error) {
          console.log("handleTokenCreate Error:", error);
          reject(error);
        }
      }, 5000);
    });
    
  }

  const handleAoTokenBalancesDryRun = async function (CurrentToken: string, Release: string | undefined) {
    if(authConfig.AoConnectBlockTxIds.includes(CurrentToken)) {
      console.log("handleAoTokenBalancesDryRun", "This token can not search txs records, due to txs are too large.")

      return 
    }
    if(Release && Release == "ChivesToken")  {
      //const AoTokenAllTransactionsData = await AoTokenAllTransactions(CurrentToken, '1', '10')
      //console.log("AoTokenAllTransactionsData", AoTokenAllTransactionsData)

      //const AoTokenSentTransactionsData = await AoTokenSentTransactions(CurrentToken, CurrentToken, '1', '10')
      //console.log("AoTokenAllTransactionsData AoTokenSentTransactionsData", AoTokenSentTransactionsData)

      //const AoTokenReceivedTransactionsData = await AoTokenReceivedTransactions(CurrentToken, "97kgujUNuuwUHb0x41j-0eTI33we7Svxy6TfAJdgTAU", '1', '10')
      //console.log("AoTokenAllTransactionsData AoTokenReceivedTransactionsData", AoTokenReceivedTransactionsData)

      const AoDryRunBalances = await AoTokenBalancesPageDryRun(CurrentToken, String(startIndex), String(endIndex))
      if(AoDryRunBalances) {
        try{
          const AoDryRunBalancesData = JSON.parse(AoDryRunBalances)
          console.log("AoDryRunBalancesData", AoDryRunBalancesData)
          const AoDryRunBalancesJson = AoDryRunBalancesData[0]
          const TokenHolders = AoDryRunBalancesData[1]
          const CirculatingSupply = FormatBalance(AoDryRunBalancesData[2])
          const AoDryRunBalancesJsonSorted = Object.entries(AoDryRunBalancesJson)
                            .sort((a: any, b: any) => b[1] - a[1])
                            .reduce((acc: any, [key, value]) => {
                                acc[key] = FormatBalance(Number(value));
                                
                                return acc;
                            }, {} as { [key: string]: number });
          setTokenGetInfor((prevState: any)=>({
            ...prevState,
            TokenBalances: AoDryRunBalancesJsonSorted,
            TokenHolders: TokenHolders,
            CirculatingSupply: CirculatingSupply.toString()
          }))
          console.log("AoDryRunBalances", AoDryRunBalancesJsonSorted, "TokenHolders", TokenHolders)
        }
        catch(Error: any) {
          console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
      }
    }
    else {
      const AoDryRunBalances = await AoTokenBalancesDryRun(CurrentToken)
      if(AoDryRunBalances) {
        try{
          console.log("AoDryRunBalances", AoDryRunBalances)
          const AoDryRunBalancesJson = JSON.parse(AoDryRunBalances)
          const AoDryRunBalancesJsonSorted = Object.entries(AoDryRunBalancesJson)
                            .sort((a: any, b: any) => b[1] - a[1])
                            .reduce((acc: any, [key, value]) => {
                                acc[key] = FormatBalance(Number(value));
                                
                                return acc;
                            }, {} as { [key: string]: number });
          const TokenMap = Object.values(AoDryRunBalancesJsonSorted)
          const TokenHolders = TokenMap.length
          let CirculatingSupply = BigNumber(0)
          TokenMap.map((Item: any)=>{
            CirculatingSupply = CirculatingSupply.plus(Item)
          })
          setTokenGetInfor((prevState: any)=>({
            ...prevState,
            TokenBalances: AoDryRunBalancesJsonSorted,
            TokenHolders: TokenHolders,
            CirculatingSupply: CirculatingSupply.toString()
          }))
          console.log("AoDryRunBalances", AoDryRunBalancesJsonSorted, "TokenHolders", TokenHolders)
        }
        catch(Error: any) {
          console.log("handleAoTokenBalancesDryRun Error", Error)
        }
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
    if(AoTokenTransferData) {
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
            
            await handleAoTokenBalancesDryRun(TokenProcessTxId, tokenGetInfor?.Release)

            const AoDryRunBalance = await AoTokenBalanceDryRun(TokenProcessTxId, myProcessTxIdInPage)
            if(AoDryRunBalance) {
              setTokenGetInfor((prevState: any)=>({
                ...prevState,
                TokenBalance: FormatBalance(AoDryRunBalance)
              }))
            }

          }
        }
      }
    }

    setIsDisabledButton(false)
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
                    <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography noWrap variant='body1' sx={{my: 2, ml: 2}}>
                        {t("Token Management")} 
                        ( MyAoAddress: 
                        <Typography noWrap variant='body2' sx={{ml:2, display: 'inline', color: 'primary.main'}}>{myProcessTxIdInPage}</Typography> 
                          {searchToken && (
                            <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                                navigator.clipboard.writeText(myProcessTxIdInPage);
                                toast.success(t('Copied success') as string, { duration: 1000 })
                            }}>
                                <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                            </IconButton>
                          )}
                          )
                        </Typography>
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

                        <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={addTokenButtonDisabled} size="small" variant='outlined' onClick={
                            () => { 
                              if(tokenGetInfor.CurrentToken) {
                                handleAddToken(tokenGetInfor.CurrentToken)
                              }
                            }
                        }>
                        {t(addTokenButtonText)}
                        </Button>

                      </Grid>
                    )}

                    { searchToken && (addTokenFavorite == false || isSearchTokenModelOpen) && tokenGetInfor && tokenGetInfor.CurrentToken && (
                      <Fragment>
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
                        
                        <Grid item sx={{ display: 'column', m: 2 }}>
                          {tokenGetInfor && (
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
                                    badgeContent={
                                      <Box
                                        component='span'
                                        sx={{
                                          width: 8,
                                          height: 8,
                                          borderRadius: '50%',
                                          color: `primary.main`,
                                          boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                                          backgroundColor: `primary.main`
                                        }}
                                      />
                                    }
                                  >
                                    <MuiAvatar
                                      src={authConfig.backEndApi + '/' + tokenGetInfor?.Logo}
                                      alt={tokenGetInfor?.Name}
                                      sx={{ width: '2.5rem', height: '2.5rem' }}
                                    />
                                  </Badge>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                      {tokenGetInfor?.Name ?? 'Token'}
                                      <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Balance: {tokenGetInfor.TokenBalance ?? '...'}</Typography>
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

                          {isOwnerStatus && (
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
                          
                          <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                              () => { setTokenGetInfor((prevState: any)=>({
                                  ...prevState,
                                  openSendOutToken: true,
                                  SendOutToken: "",
                              })) }
                          }>
                          {t("Send")}
                          </Button>
                          
                          <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                              () => { setTokenGetInfor((prevState: any)=>({
                                  ...prevState,
                                  openSendOutToken: true,
                                  SendOutToken: "",
                              })) }
                          }>
                          {t("Transactions")}
                          </Button>
                          
                          <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                              () => { setTokenGetInfor((prevState: any)=>({
                                  ...prevState,
                                  openSendOutToken: true,
                                  SendOutToken: "",
                              })) }
                          }>
                          {t("Sent Txs")}
                          </Button>
                          
                          <Button sx={{textTransform: 'none',  m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                              () => { setTokenGetInfor((prevState: any)=>({
                                  ...prevState,
                                  openSendOutToken: true,
                                  SendOutToken: "",
                              })) }
                          }>
                          {t("Received Txs")}
                          </Button>

                        </Grid>

                        
                        <Grid item sx={{ display: 'column', m: 2 }}>
                          <TokenList tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} setPageId={setPageId} pageId={pageId} pageCount={pageCount} startIndex={startIndex} />
                          {tokenGetInfor && tokenGetInfor.openSendOutToken && ( 
                            <TokenSendOut tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} handleTokenSendOut={handleTokenSendOut} /> 
                          )}
                        </Grid>
                      
                      </Fragment>
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

export default Inbox

