// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoTokenBalanceDryRun } from 'src/functions/AoConnect/Token'
import { AoLoadBlueprintFaucet, AoFaucetGetFaucetBalance, AoFaucetDepositToken, AoFaucetGetFaucet } from 'src/functions/AoConnect/ChivesFaucet'
import { ansiRegex } from 'src/configs/functions'

const ChivesFaucetModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()
  const [faucetInfo, setFaucetInfo] = useState<any>()

  const handleSimulatedChivesFaucet = async function () {
    console.log("setFaucetInfo", setFaucetInfo, faucetInfo)
    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)
    setToolInfo(null)


    const FaucetProcessTxId = "rYl15VXlTUkkSHzEkXfdn8XVa1M9VewgfGdVRH2Ob40"
    //const FaucetProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)

    if(FaucetProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        FaucetProcessTxId: FaucetProcessTxId
      }))
    }

    //await sleep(3000)

    let LoadBlueprintFaucet: any = await AoLoadBlueprintFaucet(currentWallet.jwk, FaucetProcessTxId, faucetInfo);
    while(LoadBlueprintFaucet && LoadBlueprintFaucet.status == 'ok' && LoadBlueprintFaucet.msg && LoadBlueprintFaucet.msg.error)  {
      sleep(6000)
      LoadBlueprintFaucet = await AoLoadBlueprintFaucet(currentWallet.jwk, FaucetProcessTxId, faucetInfo);
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
    }
    console.log("handleSimulatedChivesFaucet LoadBlueprintFaucet", LoadBlueprintFaucet)

    await sleep(3000)

    const FAUCET_TOKEN_ID = "Yot4NNkLcwWly8OfEQ81LCZuN4i4xysZTKJYuuZvM1Q"

    const AoDryRunBalanceMyAddress = await AoTokenBalanceDryRun(FAUCET_TOKEN_ID, currentAddress)
      if(AoDryRunBalanceMyAddress) {
        console.log("FaucetProcessTxIdBalance AoDryRunBalanceMyAddress", AoDryRunBalanceMyAddress)
        setToolInfo((prevState: any)=>({
            ...prevState,
            FaucetProcessTxIdBalanceMyAddress: AoDryRunBalanceMyAddress
      }))
    }

    const DepositFaucetData = await AoFaucetDepositToken(currentWallet.jwk, FAUCET_TOKEN_ID, 2)
    console.log("DepositFaucetData", DepositFaucetData)
    if(DepositFaucetData) {
        console.log("DepositFaucetData", DepositFaucetData)
        if(DepositFaucetData?.msg?.error)  {
          setToolInfo((prevState: any)=>({
            ...prevState,
            DepositFaucetData: DepositFaucetData?.msg?.error
          }))
        }

        const AoDryRunBalance = await AoTokenBalanceDryRun(FAUCET_TOKEN_ID, FaucetProcessTxId)
          if(AoDryRunBalance) {
            console.log("FaucetProcessTxIdBalance AoDryRunBalance", AoDryRunBalance)
            setToolInfo((prevState: any)=>({
                ...prevState,
                FaucetProcessTxIdBalance: AoDryRunBalance
          }))
        }

        setToolInfo((prevState: any)=>({
            ...prevState,
            Divider: '--------------------------------------'
        }))
    }

    const FaucetBalanceData = await AoFaucetGetFaucetBalance(FaucetProcessTxId)
    if(FaucetBalanceData) {
      console.log("AoFaucetGetFaucetBalance FaucetBalanceData1", FaucetBalanceData)
      if(FaucetBalanceData?.msg?.Output?.data?.output)  {
        const formatText = FaucetBalanceData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            FaucetBalance1: formatText
          }))

        }

      }
    }

    const SendFaucetToUserOneData = await AoFaucetGetFaucet(currentWallet.jwk, FaucetProcessTxId)
    if(SendFaucetToUserOneData) {
      
      console.log("SendFaucetToUserOneData", SendFaucetToUserOneData)
      
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
                  <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                      () => { handleSimulatedChivesFaucet() }
                  }>
                  {t("Simulated Faucet")}
                  </Button>
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

