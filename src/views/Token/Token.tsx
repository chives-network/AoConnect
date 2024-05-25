// ** React Imports
import { useState, useEffect, Fragment } from 'react'

import { BigNumber } from 'bignumber.js';

// ** MUI Imports
import Button from '@mui/material/Button'
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

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, AoLoadBlueprintToken, AoTokenBalance, AoTokenTransfer, AoTokenMint, AoTokenBalances, generateRandomNumber, AoDryRun } from 'src/functions/AoConnectLib'
import { ReminderMsgAndStoreToLocal } from 'src/functions/AoConnectMsgReminder'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const Inbox = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()
  const [tokenInfo, setTokenInfo] = useState<any>()

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

  const handleTokenCreate = async function () {

    setIsDisabledButton(true)
    setToolInfo(null)

    const TokenProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(TokenProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenProcessTxId: TokenProcessTxId
      }))
    }

    setTimeout(async () => {

      const LoadBlueprintToken = await AoLoadBlueprintToken(currentWallet.jwk, TokenProcessTxId, tokenInfo)
      if(LoadBlueprintToken) {
        console.log("LoadBlueprintToken", LoadBlueprintToken)
        if(LoadBlueprintToken?.msg?.Output?.data?.output)  {
          const formatText = LoadBlueprintToken?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            LoadBlueprintToken: formatText
          }))
        }
      }
      console.log("LoadBlueprintToken", LoadBlueprintToken)

      
      const AoDryRunBalance = await AoDryRun(TokenProcessTxId, TokenProcessTxId, TokenProcessTxId, [])
      console.log("AoDryRunBalance", AoDryRunBalance)

    }, 5000);

    

    setIsDisabledButton(false)

  }

  const handleTest = async function (TokenProcessTxId: string) {
    const AoDryRunBalance = await AoDryRun(TokenProcessTxId, TokenProcessTxId, '5555', [])
    console.log("AoDryRunBalance", AoDryRunBalance)
  }

  handleTest("aFExjGOV-DwCv6yU6H4FbSOiKq82hsVD2M5Gk6wbP1U")

  const handleTokenMint = async function (TokenProcessTxId: string) {

    setIsDisabledButton(true)
    setToolInfo(null)

    const MintTokenData = await AoTokenMint(currentWallet.jwk, TokenProcessTxId, 2000)
    if(MintTokenData) {
      console.log("MintTokenData", MintTokenData)
      if(MintTokenData?.msg?.Output?.data?.output)  {
        const formatText = MintTokenData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            Mint2000: formatText
          }))

          //Read message from inbox
          const MintTokenInboxData = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId)
          if(MintTokenInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = MintTokenInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                Mint2000: formatText2
              }))
            }
          }

        }

      }
    }

    setIsDisabledButton(false)
  }

  const handleTokenBalance = async function (TokenProcessTxId: string) {

    setIsDisabledButton(true)
    setToolInfo(null)

    const TokenBalanceData = await AoTokenBalance(currentWallet.jwk, TokenProcessTxId, TokenProcessTxId)
    if(TokenBalanceData) {
      console.log("TokenBalanceData", TokenBalanceData)
      if(TokenBalanceData?.msg?.Output?.data?.output)  {
        const formatText = TokenBalanceData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenBalance: formatText
          }))

          //Read message from inbox
          const TokenInboxData = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId)
          if(TokenInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = TokenInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                TokenBalance: formatText2
              }))
            }
          }

        }

      }
    }

    setIsDisabledButton(false)
  }

  const handleTokenBalances = async function (TokenProcessTxId: string) {

    setIsDisabledButton(true)
    setToolInfo(null)

    const TokenBalancesData = await AoTokenBalances(currentWallet.jwk, TokenProcessTxId)
    if(TokenBalancesData) {
      console.log("TokenBalancesData", TokenBalancesData)
      if(TokenBalancesData?.msg?.Output?.data?.output)  {
        const formatText = TokenBalancesData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenBalances: formatText
          }))

          //Read message from inbox
          const TokenBalancesInboxData = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId)
          if(TokenBalancesInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = TokenBalancesInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              let TokenBalancesList = null
              try {
                TokenBalancesList = JSON.parse(formatText2)
                let TotalTokenSum = BigNumber(0)
                Object.values(TokenBalancesList).map((ItemV: any)=>{
                  TotalTokenSum = TotalTokenSum.plus(ItemV);
                })
                TokenBalancesList['TotalTokenSum'] = String(TotalTokenSum)
              }
              catch(Error: any) {
                TokenBalancesList = {result: formatText2} 
                console.log("TokenBalancesData Error:", Error)
              }
              setToolInfo((prevState: any)=>({
                ...prevState,
                TokenBalances: TokenBalancesList
              }))
              console.log("TokenBalancesList", TokenBalancesList)
            }
          }

        }

      }
    }

    setIsDisabledButton(false)
  }

  

  //Loading the all Inbox to IndexedDb
  useEffect(() => {
    //GetMyInboxMsgFromAoConnect()
  }, [])

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
                <TextField
                    sx={{ml: 2, my: 2, width: '200px'}}
                    size="small"
                    label={`${t('Name')}`}
                    placeholder={`${t('Name')}`}
                    value={tokenInfo?.Name ?? 'AoConnectToken'}
                    onChange={(e: any)=>{
                      setTokenInfo((prevState: any)=>({
                        ...prevState,
                        Name: e.target.value
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
                <TextField
                    sx={{ml: 2, my: 2, width: '200px'}}
                    size="small"
                    label={`${t('Ticker')}`}
                    placeholder={`${t('Ticker')}`}
                    value={tokenInfo?.Ticker ?? 'AOCN'}
                    onChange={(e: any)=>{
                      setTokenInfo((prevState: any)=>({
                        ...prevState,
                        Ticker: e.target.value
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
                <TextField
                    sx={{ml: 2, my: 2, width: '200px'}}
                    size="small"
                    type="number"
                    label={`${t('Balance')}`}
                    placeholder={`${t('Balance')}`}
                    value={tokenInfo?.Balance ?? 9999}
                    onChange={(e: any)=>{
                      setTokenInfo((prevState: any)=>({
                        ...prevState,
                        Balance: e.target.value
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
                <TextField
                    sx={{ml: 2, my: 2}}
                    size="small"
                    label={`${t('Logo')}`}
                    placeholder={`${t('Logo')}`}
                    value={tokenInfo?.Logo ?? 'dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ'}
                    onChange={(e: any)=>{
                      setTokenInfo((prevState: any)=>({
                        ...prevState,
                        Logo: e.target.value
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
                    () => { handleTokenCreate() }
                }>
                {t("Create Token")}
                </Button>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                TokenProcessTxId: 
                <Link href={`https://www.ao.link/token/${toolInfo?.TokenProcessTxId}`} target='_blank'>
                  <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenProcessTxId}</Typography>
                </Link>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Token Balance: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenBalance}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                  Token Balances: 
                </Typography>
                {toolInfo && toolInfo.TokenBalances && Object.keys(toolInfo.TokenBalances).map((Item: string, Index: number)=>{

                  return (
                    <Fragment key={Index}>
                      <Box sx={{color: 'primary.main'}}>
                        <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main', pr: 3}}>{Index}</Typography>
                        <Typography noWrap variant='body2' sx={{display: 'inline', color: 'info.main', pr: 3}}>{Item}</Typography>
                        <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main', pr: 3}}>{toolInfo.TokenBalances[Item]}</Typography>
                      </Box>
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

export default Inbox

