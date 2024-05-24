// ** React Imports
import { useState, useEffect, Fragment } from 'react'

import { BigNumber } from 'bignumber.js';

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import Avatar from '@mui/material/Avatar'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, AoLoadBlueprintToken, AoTokenBalance, AoTokenTransfer, AoTokenMint, AoTokenBalances } from 'src/functions/AoConnectLib'
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

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const UserOneTxId = toolInfo?.UserOne
      if(UserOneTxId) {
        const ReminderMsgAndStoreToLocalDataUserOne = UserOneTxId && UserOneTxId.length == 43 ? await ReminderMsgAndStoreToLocal(UserOneTxId) : null
        const displayMessagesWithDelay = (messages: any[], index: number) => {
          if (index < messages.length) {
            setTimeout(() => {
              CustomToast(messages[index], 'top-left', '1.png')
              displayMessagesWithDelay(messages, index + 1);
            }, 1000);
          }
        };
        ReminderMsgAndStoreToLocalDataUserOne && displayMessagesWithDelay(ReminderMsgAndStoreToLocalDataUserOne, 0);
        console.log("ReminderMsgAndStoreToLocalDataUserOne", ReminderMsgAndStoreToLocalDataUserOne)
      }
    }, 1000 * 6 * 1);

    return () => clearInterval(intervalId);
  }, [toolInfo?.UserOne]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const UserTwoTxId = toolInfo?.UserTwo
      if(UserTwoTxId) {
        const ReminderMsgAndStoreToLocalDataUserTwo = UserTwoTxId && UserTwoTxId.length == 43 ? await ReminderMsgAndStoreToLocal(UserTwoTxId) : null
        const displayMessagesWithDelay = (messages: any[], index: number) => {
          if (index < messages.length) {
            setTimeout(() => {
              CustomToast(messages[index], 'bottom-left', '2.png')
              displayMessagesWithDelay(messages, index + 1);
            }, 1000);
          }
        };
        ReminderMsgAndStoreToLocalDataUserTwo && displayMessagesWithDelay(ReminderMsgAndStoreToLocalDataUserTwo, 0);
        console.log("ReminderMsgAndStoreToLocalDataUserTwo", ReminderMsgAndStoreToLocalDataUserTwo)
      }
    }, 1000 * 6 * 1);

    return () => clearInterval(intervalId);
  }, [toolInfo?.UserTwo]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const UserThreeTxId = toolInfo?.UserThree
      if(UserThreeTxId) {
        const ReminderMsgAndStoreToLocalDataUserThree = UserThreeTxId && UserThreeTxId.length == 43 ? await ReminderMsgAndStoreToLocal(UserThreeTxId) : null
        const displayMessagesWithDelay = (messages: any[], index: number) => {
          if (index < messages.length) {
            setTimeout(() => {
              CustomToast(messages[index], 'bottom-right', '3.png')
              displayMessagesWithDelay(messages, index + 1);
            }, 1000);
          }
        };
        ReminderMsgAndStoreToLocalDataUserThree && displayMessagesWithDelay(ReminderMsgAndStoreToLocalDataUserThree, 0);
        console.log("ReminderMsgAndStoreToLocalDataUserThree", ReminderMsgAndStoreToLocalDataUserThree)
      }
    }, 1000 * 6 * 1);

    return () => clearInterval(intervalId);
  }, [toolInfo?.UserThree]);



  const handleSimulatedToken = async function () {

    setIsDisabledButton(true)
    setToolInfo(null)

    const TokenProcessTxId = await AoCreateProcessAuto(currentWallet.jwk)
    if(TokenProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenProcessTxId: TokenProcessTxId
      }))
    }

    const UserOne = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserOne) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserOne: UserOne
      }))
    }

    const UserTwo = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserTwo) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserTwo: UserTwo
      }))
    }

    const UserThree = await AoCreateProcessAuto(currentWallet.jwk)
    if(UserThree) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserThree: UserThree
      }))
    }

    const LoadBlueprintToken = await AoLoadBlueprintToken(currentWallet.jwk, TokenProcessTxId)
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

    setTimeout(async () => {

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

    }, 1000);

    setTimeout(async () => {
      const SendTokenToUserOneData = await AoTokenTransfer(currentWallet.jwk, TokenProcessTxId, TokenProcessTxId, UserOne, 1001)
      if(SendTokenToUserOneData) {
        console.log("SendTokenToUserOneData", SendTokenToUserOneData)
        if(SendTokenToUserOneData?.msg?.Output?.data?.output)  {
          const formatText = SendTokenToUserOneData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              SendUserOne1001: formatText
            }))

            //Read message from inbox
            const UserOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserOne)
            if(UserOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  SendUserOne1001: formatText2
                }))
              }
            }

          }

        }
      }
    
      const UserOneBalanceData = await AoTokenBalance(currentWallet.jwk, TokenProcessTxId, UserOne)
      if(UserOneBalanceData) {
        console.log("UserOneBalanceData", UserOneBalanceData)
        if(UserOneBalanceData?.msg?.Output?.data?.output)  {
          const formatText = UserOneBalanceData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserOneBalance: formatText
            }))

            //Read message from inbox
            const UserOneInboxData = await GetMyLastMsg(currentWallet.jwk, UserOne)
            if(UserOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserOneBalance: formatText2
                }))
              }
            }

          }

        }
      }

    }, 5000);
    
    setTimeout(async () => {
      const SendTokenToUserTwoData = await AoTokenTransfer(currentWallet.jwk, TokenProcessTxId, TokenProcessTxId, UserTwo, 1002)
      if(SendTokenToUserTwoData) {
        console.log("SendTokenToUserTwoData", SendTokenToUserTwoData)
        if(SendTokenToUserTwoData?.msg?.Output?.data?.output)  {
          const formatText = SendTokenToUserTwoData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              SendUserTwo1002: formatText
            }))

            //Read message from inbox
            const UserTwoInboxData = await GetMyLastMsg(currentWallet.jwk, UserTwo)
            if(UserTwoInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  SendUserTwo1002: formatText2
                }))
              }
            }

          }

        }
      }

      const UserTwoBalanceData = await AoTokenBalance(currentWallet.jwk, TokenProcessTxId, UserTwo)
      if(UserTwoBalanceData) {
        console.log("UserTwoBalanceData", UserTwoBalanceData)
        if(UserTwoBalanceData?.msg?.Output?.data?.output)  {
          const formatText = UserTwoBalanceData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserTwoBalance: formatText
            }))

            //Read message from inbox
            const UserTwoInboxData = await GetMyLastMsg(currentWallet.jwk, UserTwo)
            if(UserTwoInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserTwoBalance: formatText2
                }))
              }
            }

          }

        }
      }

    }, 10000);

    setTimeout(async () => {
      const SendTokenToUserThreeData = await AoTokenTransfer(currentWallet.jwk, TokenProcessTxId, TokenProcessTxId, UserThree, 1003)
      if(SendTokenToUserThreeData) {
        console.log("SendTokenToUserThreeData", SendTokenToUserThreeData)
        if(SendTokenToUserThreeData?.msg?.Output?.data?.output)  {
          const formatText = SendTokenToUserThreeData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              SendUserThree1003: formatText
            }))

            //Read message from inbox
            const UserThreeInboxData = await GetMyLastMsg(currentWallet.jwk, UserThree)
            if(UserThreeInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserThreeInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  SendUserThree1003: formatText2
                }))
              }
            }

          }

        }
      }

      const UserThreeBalanceData = await AoTokenBalance(currentWallet.jwk, TokenProcessTxId, UserThree)
      if(UserThreeBalanceData) {
        console.log("UserThreeBalanceData", UserThreeBalanceData)
        if(UserThreeBalanceData?.msg?.Output?.data?.output)  {
          const formatText = UserThreeBalanceData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserThreeBalance: formatText
            }))

            //Read message from inbox
            const UserThreeInboxData = await GetMyLastMsg(currentWallet.jwk, UserThree)
            if(UserThreeInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserThreeInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserThreeBalance: formatText2
                }))
              }
            }

          }

        }
      }

    }, 15000);

    setTimeout(async () => {
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


    }, 20000);
    
    setTimeout(async () => {
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


    }, 25000);

    
    

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
                  <Button sx={{ m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                      () => { handleSimulatedToken() }
                  }>
                  {t("Simulated Token")}
                  </Button>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Typography noWrap variant='body2' sx={{my: 2}}>
                CurrentAddress: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                TokenProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenProcessTxId}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserOne Message From: Top-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOne}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwo Message From: Bottom-Left ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwo}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThree Message From: Bottom-Right ProcessTxId: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThree}</Typography>
                </Typography>
                
                <Tooltip title={toolInfo?.LoadBlueprintToken}>
                  <Typography noWrap variant='body2' sx={{my: 2}}>
                  .load-blueprint token: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.LoadBlueprintToken}</Typography>
                  </Typography>
                </Tooltip>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Token Balance: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.TokenBalance}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                SendUserOne1001: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.SendUserOne1001}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserOneBalance: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserOneBalance}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                SendUserTwo1002: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.SendUserTwo1002}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserTwoBalance: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserTwoBalance}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                SendUserThree1003: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.SendUserThree1003}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                UserThreeBalance: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.UserThreeBalance}</Typography>
                </Typography>

                <Typography noWrap variant='body2' sx={{my: 2}}>
                Mint2000: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo?.Mint2000}</Typography>
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

