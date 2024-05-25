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
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'


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

import { GetMyLastMsg, AoCreateProcessAuto, AoLoadBlueprintToken, AoTokenBalance, AoTokenTransfer, AoTokenMint, AoTokenBalances, generateRandomNumber, AoTokenBalanceDryRun, AoTokenBalancesDryRun, AoTokenInfoDryRun } from 'src/functions/AoConnectLib'
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
  const [tokenGetInfor, setTokenGetInfor] = useState<any>()

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

  
  const handleTokenSearch = async function (ExistToken: string) {
    if(!ExistToken) return 

    setIsDisabledButton(true)
    setToolInfo(null)

    setToolInfo((prevState: any)=>({
      ...prevState,
      TokenProcessTxId: ExistToken
    }))

    const AoDryRunBalance = await AoTokenBalanceDryRun(ExistToken, ExistToken)
    if(AoDryRunBalance) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenBalance: AoDryRunBalance
      }))
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        TokenBalance: AoDryRunBalance
      }))
    }

    const TokenGetMap = await AoTokenInfoDryRun(ExistToken)
    setTokenGetInfor((prevState: any)=>({
      ...prevState,
      ...TokenGetMap,
      ExistToken
    }))

    const AoDryRunBalances = await AoTokenBalancesDryRun(ExistToken)
    if(AoDryRunBalances) {
      console.log("AoDryRunBalances", AoDryRunBalances)
      const AoDryRunBalancesJson = JSON.parse(AoDryRunBalances)
      const AoDryRunBalancesJsonSorted = Object.entries(AoDryRunBalancesJson)
                        .sort((a: any, b: any) => b[1] - a[1])
                        .reduce((acc: any, [key, value]) => {
                            acc[key] = value;
                            return acc;
                        }, {} as { [key: string]: number });
      const TokenMap = Object.values(AoDryRunBalancesJson)
      const TokenHolders = TokenMap.length
      let CirculatingSupply = BigNumber(0)
      TokenMap.map((Item: any)=>{
        CirculatingSupply = CirculatingSupply.plus(Item)
      })
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenBalances: AoDryRunBalancesJsonSorted
      }))
      setTokenGetInfor((prevState: any)=>({
        ...prevState,
        TokenBalances: AoDryRunBalancesJsonSorted,
        TokenHolders: TokenHolders,
        CirculatingSupply: CirculatingSupply
      }))
      console.log("AoDryRunBalances", AoDryRunBalancesJsonSorted, "TokenHolders", TokenHolders)
    }

    setIsDisabledButton(false)

  }

  console.log("tokenGetInfor", tokenGetInfor)

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

      try {
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

        const AoDryRunBalance = await AoTokenBalanceDryRun(TokenProcessTxId, TokenProcessTxId)
        if(AoDryRunBalance) {
          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenBalance: AoDryRunBalance
          }))
        }

        const AoDryRunBalances = await AoTokenBalancesDryRun(TokenProcessTxId)
        if(AoDryRunBalances) {
          console.log("AoDryRunBalances", AoDryRunBalances)
          const AoDryRunBalancesJson = JSON.parse(AoDryRunBalances)
          setToolInfo((prevState: any)=>({
            ...prevState,
            TokenBalances: AoDryRunBalancesJson
          }))
          console.log("AoDryRunBalances", AoDryRunBalancesJson)
        }
        
      }
      catch(Error: any) {
        console.log("handleTokenCreate Error:", Error)
      }

    }, 5000);


    setIsDisabledButton(false)

  }


  const handleTest = async function (TargetTxId: string) {
    const AoDryRunBalance = await AoTokenInfoDryRun(TargetTxId)
    console.log("AoTokenInfoDryRun", AoDryRunBalance)
  }

  handleTest("7bXsUAAy7rIbdhCkhZtw8_XGNc2CZtRAH0qxK1pktP0")

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

                <TextField
                    sx={{ml: 2, my: 2}}
                    size="small"
                    label={`${t('ExistToken')}`}
                    placeholder={`${t('ExistToken')}`}
                    value={tokenInfo?.ExistToken ?? ''}
                    onChange={(e: any)=>{
                      setTokenInfo((prevState: any)=>({
                        ...prevState,
                        ExistToken: e.target.value
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
                    () => { handleTokenSearch(tokenInfo?.ExistToken) }
                }>
                {t("Search Token")}
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
                          </Typography>
                          <Typography variant='caption' sx={{ color: 'primary.secondary', pt: 0.4 }}>
                            {tokenGetInfor?.Ticker}
                            <Link href={`https://www.ao.link/token/${toolInfo?.TokenProcessTxId}`} target='_blank'>
                              <Typography noWrap variant='body2' sx={{ml: 2, display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenProcessTxId}</Typography>
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
                          {String(tokenGetInfor?.CirculatingSupply)}
                        </Typography>
                      </Box>
                    </Box>

                  </Box>

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
                        <TableRow>
                          <TableCell colSpan={2}>
                            My Token: {tokenGetInfor.ExistToken}
                          </TableCell>
                          <TableCell colSpan={2}>
                            Balance: {tokenGetInfor.TokenBalance}
                          </TableCell>
                        </TableRow>
                        {tokenGetInfor && tokenGetInfor.TokenBalances && Object.keys(tokenGetInfor.TokenBalances).map((Item: string, Index: number)=>{

                          return (
                            <TableRow key={Index}>
                              <TableCell>
                                <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline' }}>{Index + 1}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap variant='body2' sx={{ color: 'info.main', pr: 3, display: 'inline' }}>{Item}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline' }}>{tokenGetInfor.TokenBalances[Item]}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline' }}>Send to this account</Typography>
                              </TableCell>
                            </TableRow>
                          )
                          
                        })}
                    
                        </TableBody>
                      </Table>
                    </TableContainer>

                  </Box>

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
