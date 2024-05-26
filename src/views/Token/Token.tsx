// ** React Imports
import { useState, useEffect, Fragment } from 'react'

import { BigNumber } from 'bignumber.js';

// ** MUI Imports
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import Avatar from '@mui/material/Avatar'
import MuiAvatar from '@mui/material/Avatar'
import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import TokenList from './TokenList'
import TokenMint from './TokenMint'
import TokenCreate from './TokenCreate'
import TokenSendOut from './TokenSendOut'

import { GetMyLastMsg, AoCreateProcessAuto, AoLoadBlueprintToken, AoTokenBalance, AoTokenTransfer, AoTokenMint, AoTokenBalances, generateRandomNumber, AoTokenBalanceDryRun, AoTokenBalancesDryRun, AoTokenInfoDryRun, FormatBalance } from 'src/functions/AoConnectLib'
import { ReminderMsgAndStoreToLocal } from 'src/functions/AoConnectMsgReminder'
import { nlNL } from '@mui/x-data-grid';

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const Inbox = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [tokenMint, setTokenMint] = useState<any>({ openMintToken: false, FormSubmit: 'Submit', isDisabledButton: false })
  const [tokenCreate, setTokenCreate] = useState<any>({ openCreateToken: false, FormSubmit: 'Submit', isDisabledButton: false })
  const [tokenGetInfor, setTokenGetInfor] = useState<any>({ openSendOutToken: false, disabledSendOutButton:false, FormSubmit: 'Submit', isDisabledButton: false })

  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const CustomToast = (ContentList: any, position: string, avatar: string) => {
    return toast(
      t => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Victor Anderson' src={ ContentList['Logo'] || '/images/avatars/' + avatar } sx={{ mr: 3, width: 40, height: 40 }} />
            <div>
              <Typography>{ContentList['Data']}</Typography>
              {ContentList && ContentList['Action'] == null && ContentList['FromProcess'] && (
                <Typography variant='caption'>{ContentList['FromProcess']} Id: {ContentList['Ref_']}</Typography>
              )}
              {ContentList && ContentList['Action'] != null && (
                <Typography variant='caption'>Action: {ContentList['Action']} Id: {ContentList['Ref_']}</Typography>
              )}
            </div>
          </Box>
          <IconButton onClick={() => toast.dismiss(t.id)}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      ),
      {
        style: {
          minWidth: '550px'
        },
        //@ts-ignore
        position: position,
        duration: 4000
      }
    )
  }

  const handleTokenSearch = async function (CurrentToken: string) {
    if(!CurrentToken) return 

    setIsDisabledButton(true)

    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      TokenProcessTxId: CurrentToken,
      CurrentToken: CurrentToken,
      TokenBalance: 0,
      TokenBalances: null,
      TokenHolders: null,
      CirculatingSupply: null
    }))

    const AoDryRunBalance = await AoTokenBalanceDryRun(CurrentToken, CurrentToken)
    if(AoDryRunBalance) {
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        TokenBalance: FormatBalance(AoDryRunBalance)
      }))
    }

    const TokenGetMap = await AoTokenInfoDryRun(CurrentToken)
    if(TokenGetMap)  {
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        ...TokenGetMap
      }))
    }
    else {

      //No Token Infor
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        Name: null,
        Ticker: null,
        Balance: null,
        Logo: null
      }))
    }

    console.log("TokenGetMap", TokenGetMap)

    await handleAoTokenBalancesDryRun(CurrentToken)

    setIsDisabledButton(false)

  }

  const handleTokenCreate = async function (tokenCreate: any) {

    let TokenProcessTxId = null
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
          const LoadBlueprintToken = await AoLoadBlueprintToken(currentWallet.jwk, TokenProcessTxId, tokenCreate);
          if (LoadBlueprintToken) {
            console.log("LoadBlueprintToken", LoadBlueprintToken);
            if (LoadBlueprintToken?.msg?.Output?.data?.output) {

              // const formatText = LoadBlueprintToken?.msg?.Output?.data?.output.replace(ansiRegex, '');
              // setTokenGetInfor((prevState: any) => ({
              //   ...prevState,
              //   LoadBlueprintToken: formatText
              // }));

            }
          }
  
          const AoDryRunBalance = await AoTokenBalanceDryRun(TokenProcessTxId, TokenProcessTxId);
          if (AoDryRunBalance) {
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

  const handleAoTokenBalancesDryRun = async function (CurrentToken: string) {
    const AoDryRunBalances = await AoTokenBalancesDryRun(CurrentToken)
    if(AoDryRunBalances) {
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
  }

  const handleTest = async function (TargetTxId: string) {
    const AoDryRunBalance = await AoTokenInfoDryRun(TargetTxId)
    console.log("AoTokenInfoDryRun", AoDryRunBalance)
  }

  //handleTest("7bXsUAAy7rIbdhCkhZtw8_XGNc2CZtRAH0qxK1pktP0")

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

  const handleTokenSendOut = async function (TokenProcessTxId: string, ReceivedAddress: string, Amount: number) {

    if(Amount == null || Number(Amount) <= 0) return
    
    setIsDisabledButton(true)

    const AoTokenTransferData = await AoTokenTransfer(currentWallet.jwk, TokenProcessTxId, TokenProcessTxId, ReceivedAddress, Number(Amount))
    if(AoTokenTransferData) {
      console.log("AoTokenTransferData", AoTokenTransferData)
      if(AoTokenTransferData?.msg?.Output?.data?.output)  {
        const formatText = AoTokenTransferData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {
          const AoTokenTransferInboxData = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId)
          if(AoTokenTransferInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = AoTokenTransferInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(formatText2, {
                duration: 5000
              })
            }
            
            await handleAoTokenBalancesDryRun(TokenProcessTxId)

            const AoDryRunBalance = await AoTokenBalanceDryRun(TokenProcessTxId, TokenProcessTxId)
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
      {currentAddress ?
      <Grid container>
        <Grid item xs={12}>
          <Card>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography noWrap variant='body1' sx={{my: 2, ml: 2}}>
                  {t("Token Management")} ( CurrentAddress: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography> )
                  </Typography>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                
                <TokenCreate tokenCreate={tokenCreate} setTokenCreate={setTokenCreate} handleTokenCreate={handleTokenCreate} handleTokenSearch={handleTokenSearch} />

                <Button sx={{ m: 2, mt: 3 }} size="small" variant='outlined' onClick={
                    () => { 
                      setTokenCreate((prevState: any)=>({
                        ...prevState,
                        openCreateToken: true
                      }))
                     }
                }>
                {t("Create Token")}
                </Button>

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

                <Button sx={{ m: 2, mt: 3 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                    () => { handleTokenSearch(tokenGetInfor?.CurrentToken) }
                }>
                {t("Search Token")}
                </Button>

                <TokenMint tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} handleTokenMint={handleTokenMint} handleTokenSearch={handleTokenSearch} />

                <Button sx={{ m: 2, mt: 3 }} disabled={tokenGetInfor?.Name !='' ? false : true } size="small" variant='outlined' onClick={
                    () => { 
                      setTokenGetInfor((prevState: any)=>({
                        ...prevState,
                        openMintToken: true
                      }))
                     }
                }>
                {t("Mint Token")}
                </Button>

              </Grid>
              
              <Grid item sx={{ display: 'column', m: 2 }}>
                {tokenGetInfor && tokenGetInfor.Name && (
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
                            {tokenGetInfor?.Name}
                            <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.secondary'}}>Balance: {tokenGetInfor.TokenBalance}</Typography>
                          </Typography>
                          <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                            {tokenGetInfor?.Ticker}
                            <Link href={`https://www.ao.link/token/${tokenGetInfor?.TokenProcessTxId}`} target='_blank'>
                              <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.main'}}>{tokenGetInfor?.TokenProcessTxId}</Typography>
                            </Link>
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

                  <TokenList tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} />

                  {tokenGetInfor && tokenGetInfor.openSendOutToken && ( 
                    <TokenSendOut tokenGetInfor={tokenGetInfor} setTokenGetInfor={setTokenGetInfor} handleTokenSendOut={handleTokenSendOut} /> 
                  )}
                  

                  </>

                )}

                
                
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

export default Inbox

