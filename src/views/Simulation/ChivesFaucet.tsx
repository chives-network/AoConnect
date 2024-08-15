// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from 'src/@core/components/icon'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { AoCreateProcessAuto, sleep, FormatBalance } from 'src/functions/AoConnect/AoConnect'

import { AoTokenBalanceDryRun } from 'src/functions/AoConnect/Token'
import { AoLoadBlueprintFaucet, AoFaucetGetFaucetBalance, AoFaucetDepositToken, AoFaucetGetFaucet, AoFaucetDepositBalances, AoFaucetCreditBalances, AoFaucetInfo } from 'src/functions/AoConnect/ChivesFaucet'
import { ansiRegex } from 'src/configs/functions'

const ChivesFaucetModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>({FaucetSendRule: 'EveryDay', FaucetSendAmount: '0.123', TokenIdInFaucet:''})
  const [ChivesFaucetAoConnectTxIdError, setChivesFaucetAoConnectTxIdError] = useState<string>('')

  const handleSimulatedChivesFaucet = async function () {

    if(currentWallet == undefined || currentWallet == null) {

      return
    }
    setIsDisabledButton(true)

    const TokenIdInFaucet = toolInfo.TokenIdInFaucet
    if(!TokenIdInFaucet || TokenIdInFaucet == "" || TokenIdInFaucet.length != 43) {
        setChivesFaucetAoConnectTxIdError('Please set TokenIdInFaucet first!')

        return 
    }
    else {
        setChivesFaucetAoConnectTxIdError('')
    }

    if(toolInfo.TokenIdInFaucet) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenIdInFaucet: toolInfo.TokenIdInFaucet
      }))
    }

    //const FaucetProcessTxId = "pIMgbVaMIgYlp7Pv63Y_e5YtdXz0e5RQqkdm4Asa0R8"

    const FaucetProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)

    if(FaucetProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        FaucetProcessTxId: FaucetProcessTxId
      }))
    }

    //await sleep(3000)
    
    let LoadBlueprintFaucet: any = await AoLoadBlueprintFaucet(currentWallet.jwk, FaucetProcessTxId, toolInfo.TokenIdInFaucet, toolInfo.FaucetSendAmount, toolInfo.FaucetSendRule);
    console.log("handleSimulatedChivesFaucet LoadBlueprintFaucet:", LoadBlueprintFaucet);
    while(LoadBlueprintFaucet && LoadBlueprintFaucet.status == 'error')  {
      sleep(6000)
      LoadBlueprintFaucet = await AoLoadBlueprintFaucet(currentWallet.jwk, FaucetProcessTxId, toolInfo.TokenIdInFaucet, toolInfo.FaucetSendAmount, toolInfo.FaucetSendRule);
      console.log("handleSimulatedChivesFaucet LoadBlueprintFaucet:", LoadBlueprintFaucet);
    }
    if(LoadBlueprintFaucet) {
      if(LoadBlueprintFaucet?.msg?.Output?.data?.output)  {
        const formatText = LoadBlueprintFaucet?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintFaucet: formatText
        }))
      }
      if(LoadBlueprintFaucet.Token && LoadBlueprintFaucet.Token.Denomination) {
        setToolInfo((prevState: any)=>({
          ...prevState,
          Denomination: LoadBlueprintFaucet.Token.Denomination
        }))
      }
      if(LoadBlueprintFaucet?.status == 'error') {
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintFaucet: LoadBlueprintFaucet?.msg
        }))
        setIsDisabledButton(false)

        return 
      }
    }
    console.log("handleSimulatedChivesFaucet LoadBlueprintFaucet", LoadBlueprintFaucet)

    await sleep(3000)

    const AoFaucetInfoData = await AoFaucetInfo(FaucetProcessTxId)
    console.log("AoFaucetInfoData AoFaucetInfo", AoFaucetInfoData)
    if(AoFaucetInfoData) {
      setToolInfo((prevState: any)=>({
          ...prevState,
          AoFaucetInfoData: JSON.stringify(AoFaucetInfoData)
      }))
    }
    
    const MyAddressFaucetBalance = await AoTokenBalanceDryRun(toolInfo.TokenIdInFaucet, currentAddress)
    if(MyAddressFaucetBalance) {
      console.log("MyAddressFaucetBalance AoTokenBalanceDryRun", MyAddressFaucetBalance, Number(AoFaucetInfoData.Denomination))
      setToolInfo((prevState: any)=>({
          ...prevState,
          MyAddressFaucetBalance: FormatBalance(MyAddressFaucetBalance, Number(AoFaucetInfoData.Denomination))
      }))
    }

    const DepositFaucetData = await AoFaucetDepositToken(currentWallet.jwk, toolInfo.TokenIdInFaucet, FaucetProcessTxId, 2000, Number(toolInfo.Denomination))
    console.log("DepositFaucetData", DepositFaucetData)
    if(DepositFaucetData) {
        console.log("DepositFaucetData", DepositFaucetData)
        if(DepositFaucetData?.msg?.error)  {
          setToolInfo((prevState: any)=>({
            ...prevState,
            DepositFaucetData: DepositFaucetData?.msg?.error
          }))
        }

        await sleep(3000)

        const AoDryRunBalance = await AoTokenBalanceDryRun(toolInfo.TokenIdInFaucet, FaucetProcessTxId)
          if(AoDryRunBalance) {
            console.log("FaucetProcessTxIdBalance AoDryRunBalance", AoDryRunBalance)
            setToolInfo((prevState: any)=>({
                ...prevState,
                FaucetProcessTxIdBalance: FormatBalance(AoDryRunBalance, Number(toolInfo.Denomination))
          }))
        }

        setToolInfo((prevState: any)=>({
            ...prevState,
            Divider: '--------------------------------------'
        }))
    }

    const GetFaucetFromFaucetTokenId: any = await AoFaucetGetFaucet(currentWallet.jwk, FaucetProcessTxId)
    if(GetFaucetFromFaucetTokenId?.msg?.Messages && GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data) {
      console.log("GetFaucetFromFaucetTokenId", GetFaucetFromFaucetTokenId)
      setToolInfo((prevState: any)=>({
        ...prevState,
        GetFaucetFromFaucetTokenId: GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data
      }))
    }

    await sleep(3000)

    const FaucetBalanceData = await AoFaucetGetFaucetBalance(FaucetProcessTxId)
    console.log("FaucetBalanceData AoFaucetGetFaucetBalance", FaucetBalanceData)
    if(FaucetBalanceData) {
      setToolInfo((prevState: any)=>({
          ...prevState,
          FaucetBalanceData: FaucetBalanceData
      }))
    }

    const FaucetDepositBalanceData = await AoFaucetDepositBalances(FaucetProcessTxId, '1', '10')
    console.log("FaucetDepositBalanceData AoFaucetDepositBalances", FaucetDepositBalanceData)
    if(FaucetDepositBalanceData) {
      setToolInfo((prevState: any)=>({
          ...prevState,
          FaucetDepositBalanceData: FaucetDepositBalanceData
      }))
    }
    
    await sleep(3000)

    const FaucetCreditBalanceData = await AoFaucetCreditBalances(FaucetProcessTxId, '1', '10')
    console.log("FaucetCreditBalanceData AoFaucetCreditBalances", FaucetCreditBalanceData)
    if(FaucetCreditBalanceData) {
      setToolInfo((prevState: any)=>({
          ...prevState,
          FaucetCreditBalanceData: FaucetCreditBalanceData
      }))
    }


    setToolInfo((prevState: any)=>({
      ...prevState,
      ExecuteStatus: 'All Finished.'
    }))

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
                  <Box>
                    <TextField
                          sx={{ml: 2, my: 2}}
                          size="small"
                          disabled={isDisabledButton}
                          label={`${t('TokenIdInFaucet')}`}
                          placeholder={`${t('TokenIdInFaucet')}`}
                          value={toolInfo.TokenIdInFaucet}
                          onChange={(e: any)=>{
                              if(e.target.value && e.target.value.length == 43) {
                                  setChivesFaucetAoConnectTxIdError('')
                              }
                              else {
                                  setChivesFaucetAoConnectTxIdError('Please set TokenIdInFaucet first!')
                                  setIsDisabledButton(false)
                              }
                              setToolInfo((prevState: any)=>({
                                  ...prevState,
                                  TokenIdInFaucet: e.target.value
                              }))
                          }}
                          InputProps={{
                              startAdornment: (
                                  <InputAdornment position='start'>
                                      <Icon icon='mdi:account-outline' />
                                  </InputAdornment>
                              )
                          }}
                          error={!!ChivesFaucetAoConnectTxIdError}
                          helperText={ChivesFaucetAoConnectTxIdError}
                    />
                    <TextField
                          sx={{ml: 2, my: 2}}
                          size="small"
                          disabled={isDisabledButton}
                          label={`${t('FaucetSendRule')}`}
                          placeholder={`${t('FaucetSendRule')}`}
                          value={toolInfo.FaucetSendRule}
                          onChange={(e: any)=>{
                              setToolInfo((prevState: any)=>({
                                  ...prevState,
                                  FaucetSendRule: e.target.value
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
                          disabled={isDisabledButton}
                          label={`${t('FaucetSendAmount')}`}
                          placeholder={`${t('FaucetSendAmount')}`}
                          value={toolInfo.FaucetSendAmount}
                          onChange={(e: any)=>{
                              setToolInfo((prevState: any)=>({
                                  ...prevState,
                                  FaucetSendAmount: e.target.value
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
                    <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                        () => { handleSimulatedChivesFaucet() }
                    }>
                    {t("Simulated Faucet")}
                    </Button>
                  </Box>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesfaucet.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("Faucet Lua")}
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

export default ChivesFaucetModel

