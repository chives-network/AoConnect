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
import { AoLoadBlueprintFaucet, AoFaucetCheckBalance, AoFaucetDeposit, AoFaucetCredit } from 'src/functions/AoConnect/ChivesFaucet'
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

    /*
    const FaucetProcessTxId = "MELwrHkq3w74Dc-s5PYgKA-KW-j3Wxk4yZX5j8yXSu4"
    if(FaucetProcessTxId) {
        setToolInfo((prevState: any)=>({
            ...prevState,
            FaucetProcessTxId: FaucetProcessTxId
        }))
    }
    */
    
    const FaucetProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(FaucetProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        FaucetProcessTxId: FaucetProcessTxId
      }))
    }

    await sleep(3000)

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

    await sleep(2000)

    const SendFrom = "Et_0JIWXDauOv9lew9NVJ_5P5vOj-jL9u9QpFCjj0GQ"
    const Faucet_PROCESS = "jsH3PcxiuEEVyiT3fgk648sO5kQ2ZuNNAZx5zOCJsz0"

    const DepositFaucetData = await AoFaucetDeposit(currentWallet.jwk, Faucet_PROCESS, SendFrom, FaucetProcessTxId, 2)
    if(DepositFaucetData) {
        console.log("DepositFaucetData", DepositFaucetData)
        if(DepositFaucetData?.msg?.error)  {
          setToolInfo((prevState: any)=>({
            ...prevState,
            DepositFaucetData: DepositFaucetData?.msg?.error
          }))
        }

        if(DepositFaucetData?.msg?.Output?.data?.output)  {
          const formatText = DepositFaucetData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {
  
            setToolInfo((prevState: any)=>({
              ...prevState,
              DepositFaucetData1: formatText
            }))
  
            //Read message from inbox
            const UserOneInboxData1 = await GetMyLastMsg(currentWallet.jwk, FaucetProcessTxId)
            if(UserOneInboxData1?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  FaucetProcessTxId1: formatText2
                }))
              }
            }
            const UserOneInboxData2 = await GetMyLastMsg(currentWallet.jwk, FaucetProcessTxId)
            if(UserOneInboxData2?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData2?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  FaucetProcessTxId2: formatText2
                }))
              }
            }
            const UserOneInboxData4 = await GetMyLastMsg(currentWallet.jwk, SendFrom)
            if(UserOneInboxData4?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData4?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  SendFrom: formatText2
                }))
              }
            }
            const UserOneInboxData3 = await GetMyLastMsg(currentWallet.jwk, SendFrom)
            if(UserOneInboxData3?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData3?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  SendFrom: formatText2
                }))
              }
            }
  
          }
  
        }

        const AoDryRunBalance = await AoTokenBalanceDryRun(Faucet_PROCESS, FaucetProcessTxId)
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

    const FaucetBalanceData = await AoFaucetCheckBalance(currentWallet.jwk, FaucetProcessTxId, FaucetProcessTxId)
    if(FaucetBalanceData) {
      console.log("AoFaucetCheckBalance FaucetBalanceData1", FaucetBalanceData)
      if(FaucetBalanceData?.msg?.Output?.data?.output)  {
        const formatText = FaucetBalanceData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            FaucetBalance1: formatText
          }))

          //Read message from inbox
          const FaucetInboxData = await GetMyLastMsg(currentWallet.jwk, FaucetProcessTxId)
          console.log("AoFaucetCheckBalance FaucetBalanceData2", FaucetInboxData)
          if(FaucetInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = FaucetInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                FaucetBalance2: formatText2
              }))
            }
          }

        }

      }
    }
    
    const UserOne = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserOne) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ReceivedTokenUserOne: UserOne
      }))
    }

    await sleep(2000)

    //const SendFrom = "Et_0JIWXDauOv9lew9NVJ_5P5vOj-jL9u9QpFCjj0GQ"
    //const Faucet_PROCESS = "jsH3PcxiuEEVyiT3fgk648sO5kQ2ZuNNAZx5zOCJsz0"

    const SendFaucetToUserOneData = await AoFaucetCredit(currentWallet.jwk, FaucetProcessTxId, FaucetProcessTxId, UserOne)
    if(SendFaucetToUserOneData) {
      console.log("SendFaucetToUserOneData", SendFaucetToUserOneData)
      if(SendFaucetToUserOneData?.msg?.error)  {
        setToolInfo((prevState: any)=>({
          ...prevState,
          SendFaucetToUserOneData: SendFaucetToUserOneData?.msg?.error
        }))
      }
      if(SendFaucetToUserOneData?.msg?.Output?.data?.output)  {
        const formatText = SendFaucetToUserOneData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            SendFaucetToUserOneData: formatText
          }))

          //Read message from inbox
          const UserOneInboxData1 = await GetMyLastMsg(currentWallet.jwk, FaucetProcessTxId)
          if(UserOneInboxData1?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                SendFaucetToUserOneData: formatText2
              }))
            }
          }
          const UserOneInboxData5 = await GetMyLastMsg(currentWallet.jwk, UserOne)
          if(UserOneInboxData5?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData5?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                UserOne: formatText2
              }))
            }
          }
          const AoDryRunBalance = await AoTokenBalanceDryRun(Faucet_PROCESS, UserOne)
          if(AoDryRunBalance) {
            console.log("AoTokenBalanceDryRun AoDryRunBalance", AoDryRunBalance)
            setToolInfo((prevState: any)=>({
                ...prevState,
                UserOneBalance: AoDryRunBalance
            }))
          }

        }

      }
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

