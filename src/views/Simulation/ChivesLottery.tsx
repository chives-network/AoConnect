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

//import { AoLoadBlueprintLottery, AoLotteryCheckBalance, AoLotteryCredit, AoLotteryUpdateBalance } from 'src/functions/AoConnect/ChivesLottery'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoTokenBalanceDryRun } from 'src/functions/AoConnect/Token'
import { AoLoadBlueprintLottery, AoLotteryCheckBalance, AoLotteryDeposit, AoLotteryUpdateBalance, AoLotteryCredit } from 'src/functions/AoConnect/ChivesLottery'
import { ansiRegex } from 'src/configs/functions'

const ChivesLotteryModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()
  const [lotteryInfo, setLotteryInfo] = useState<any>()

  const handleSimulatedChivesLottery = async function () {
    console.log("setLotteryInfo", setLotteryInfo, lotteryInfo)
    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)
    setToolInfo(null)

    /*
    const LotteryProcessTxId = "9ojE31o1cuBXEh1aTcPlIostfi_xCxcX94LJU4FqcAE"
    if(LotteryProcessTxId) {
        setToolInfo((prevState: any)=>({
            ...prevState,
            LotteryProcessTxId: LotteryProcessTxId
        }))
    }
    */

    const LotteryProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(LotteryProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        LotteryProcessTxId: LotteryProcessTxId
      }))
    }

    await sleep(3000)

    let LoadBlueprintLottery: any = await AoLoadBlueprintLottery(currentWallet.jwk, LotteryProcessTxId, lotteryInfo);
    while(LoadBlueprintLottery && LoadBlueprintLottery.status == 'ok' && LoadBlueprintLottery.msg && LoadBlueprintLottery.msg.error)  {
      sleep(6000)
      LoadBlueprintLottery = await AoLoadBlueprintLottery(currentWallet.jwk, LotteryProcessTxId, lotteryInfo);
      console.log("handleSimulatedChivesLottery LoadBlueprintLottery:", LoadBlueprintLottery);
    }
    if(LoadBlueprintLottery) {
      if(LoadBlueprintLottery?.msg?.Output?.data?.output)  {
        const formatText = LoadBlueprintLottery?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintLottery: formatText
        }))
      }
    }
    console.log("handleSimulatedChivesLottery LoadBlueprintLottery", LoadBlueprintLottery)

    await sleep(3000)

    const LotteryUpdateBalanceData = await AoLotteryUpdateBalance(currentWallet.jwk, LotteryProcessTxId, LotteryProcessTxId)
    console.log("LotteryUpdateBalanceData", LotteryUpdateBalanceData)
    setToolInfo((prevState: any)=>({
        ...prevState,
        LotteryUpdateBalanceData: "AoLotteryUpdateBalance"
    }))
    
    await sleep(3000)

    const LotteryBalanceData = await AoLotteryCheckBalance(currentWallet.jwk, LotteryProcessTxId, LotteryProcessTxId)
    if(LotteryBalanceData) {
      console.log("AoLotteryCheckBalance LotteryBalanceData1", LotteryBalanceData)
      if(LotteryBalanceData?.msg?.Output?.data?.output)  {
        const formatText = LotteryBalanceData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            LotteryBalance1: formatText
          }))

          //Read message from inbox
          const LotteryInboxData = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId)
          console.log("AoLotteryCheckBalance LotteryBalanceData2", LotteryInboxData)
          if(LotteryInboxData?.msg?.Output?.data?.output)  {
            const formatText2 = LotteryInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                LotteryBalance2: formatText2
              }))
            }
          }

        }

      }
    }

    await sleep(2000)

    const SendFrom = "tmRWlxyqbXzcOU7V66CwrhZTNMl6xSjjfcUrjZAIFus"
    const LOTTERY_PROCESS = "NTNTSp5xdaL3BiqgwAnWK7QZ4ces-xVEK6IOHQUkQIE"
    const DepositLotteryData = await AoLotteryDeposit(currentWallet.jwk, LOTTERY_PROCESS, SendFrom, LotteryProcessTxId, 2)
    if(DepositLotteryData) {
        console.log("DepositLotteryData", DepositLotteryData)
        if(DepositLotteryData?.msg?.error)  {
          setToolInfo((prevState: any)=>({
            ...prevState,
            DepositLotteryData: DepositLotteryData?.msg?.error
          }))
        }

        if(DepositLotteryData?.msg?.Output?.data?.output)  {
          const formatText = DepositLotteryData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {
  
            setToolInfo((prevState: any)=>({
              ...prevState,
              DepositLotteryData1: formatText
            }))
  
            //Read message from inbox
            const UserOneInboxData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId)
            if(UserOneInboxData1?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  LotteryProcessTxId1: formatText2
                }))
              }
            }
            const UserOneInboxData2 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId)
            if(UserOneInboxData2?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData2?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  LotteryProcessTxId2: formatText2
                }))
              }
            }
            const UserOneInboxData4 = await GetMyLastMsg(currentWallet.jwk, SendFrom)
            if(UserOneInboxData4?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData4?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  SendFrom1: formatText2
                }))
              }
            }
            const UserOneInboxData3 = await GetMyLastMsg(currentWallet.jwk, SendFrom)
            if(UserOneInboxData3?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData3?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  SendFrom2: formatText2
                }))
              }
            }
  
          }
  
        }

        const AoDryRunBalance = await AoTokenBalanceDryRun(LOTTERY_PROCESS, LotteryProcessTxId)
          if(AoDryRunBalance) {
            console.log("LotteryProcessTxIdBalance AoDryRunBalance", AoDryRunBalance)
            setToolInfo((prevState: any)=>({
                ...prevState,
                LotteryProcessTxIdBalance: AoDryRunBalance
          }))
        }

        setToolInfo((prevState: any)=>({
            ...prevState,
            Divider: '--------------------------------------'
        }))
    }
    
    const UserOne = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserOne) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ReceivedTokenUserOne: UserOne
      }))
    }

    await sleep(2000)

    const SendLotteryToUserOneData = await AoLotteryCredit(currentWallet.jwk, LotteryProcessTxId, SendFrom, UserOne, 0.1)
    if(SendLotteryToUserOneData) {
      console.log("SendLotteryToUserOneData", SendLotteryToUserOneData)
      if(SendLotteryToUserOneData?.msg?.error)  {
        setToolInfo((prevState: any)=>({
          ...prevState,
          SendLotteryToUserOneData: SendLotteryToUserOneData?.msg?.error
        }))
      }
      if(SendLotteryToUserOneData?.msg?.Output?.data?.output)  {
        const formatText = SendLotteryToUserOneData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            SendLotteryToUserOneData1: formatText
          }))

          //Read message from inbox
          const UserOneInboxData1 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId)
          if(UserOneInboxData1?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                LotteryProcessTxIdBalance: formatText2
              }))
            }
          }
          const UserOneInboxData2 = await GetMyLastMsg(currentWallet.jwk, LotteryProcessTxId)
          if(UserOneInboxData2?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData2?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                LotteryProcessTxIdBalance: formatText2
              }))
            }
          }
          const UserOneInboxData4 = await GetMyLastMsg(currentWallet.jwk, SendFrom)
          if(UserOneInboxData4?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData4?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                SendFrom1: formatText2
              }))
            }
          }
          const UserOneInboxData3 = await GetMyLastMsg(currentWallet.jwk, SendFrom)
          if(UserOneInboxData3?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData3?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                SendFrom2: formatText2
              }))
            }
          }
          const UserOneInboxData5 = await GetMyLastMsg(currentWallet.jwk, UserOne)
          if(UserOneInboxData5?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData5?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                UserOne1: formatText2
              }))
            }
          }
          const UserOneInboxData6 = await GetMyLastMsg(currentWallet.jwk, UserOne)
          if(UserOneInboxData6?.msg?.Output?.data?.output)  {
            const formatText2 = UserOneInboxData6?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                UserOne2: formatText2
              }))
            }
          }
          const AoDryRunBalance = await AoTokenBalanceDryRun(LOTTERY_PROCESS, UserOne)
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
                      () => { handleSimulatedChivesLottery() }
                  }>
                  {t("Simulated Lottery")}
                  </Button>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/chiveslottery.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("Lottery Lua")}
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

export default ChivesLotteryModel

