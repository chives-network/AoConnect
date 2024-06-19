// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintMyProcessTxIds, MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken } from 'src/functions/AoConnect/MyProcessTxIds'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const MyProcessTxIds = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>({MyProcessTxIds:''})

  const handleSimulatedMyProcessTxIds = async function () {

    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)

    const MyProcessTxIds = await AoCreateProcessAuto(currentWallet.jwk)
    if(MyProcessTxIds) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        MyProcessTxIds: MyProcessTxIds
      }))
    }

    setToolInfo((prevState: any)=>({
        ...prevState,
        'Wait seconds': '10s'
    }))
    setToolInfo((prevState: any)=>({
        ...prevState,
        'Loading LoadBlueprint MyProcessTxIds': '....................................................'
    }))

    await sleep(10000)

    let LoadBlueprintMyProcessTxIds: any = await AoLoadBlueprintMyProcessTxIds(currentWallet.jwk, MyProcessTxIds);
    while(LoadBlueprintMyProcessTxIds && LoadBlueprintMyProcessTxIds.status == 'ok' && LoadBlueprintMyProcessTxIds.msg && LoadBlueprintMyProcessTxIds.msg.error)  {
      sleep(6000)
      LoadBlueprintMyProcessTxIds = await AoLoadBlueprintMyProcessTxIds(currentWallet.jwk, MyProcessTxIds);
      console.log("handleSimulatedToken LoadBlueprintMyProcessTxIds:", LoadBlueprintMyProcessTxIds);
    }
    if(LoadBlueprintMyProcessTxIds) {
      console.log("LoadBlueprintMyProcessTxIds", LoadBlueprintMyProcessTxIds)
      if(LoadBlueprintMyProcessTxIds?.msg?.Output?.data?.output)  {
        const formatText = LoadBlueprintMyProcessTxIds?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintMyProcessTxIds: formatText
        }))
      }
    }
    console.log("LoadBlueprintMyProcessTxIds", LoadBlueprintMyProcessTxIds)

    const TokenProcessTxId1 = await AoCreateProcessAuto(currentWallet.jwk)
    if(TokenProcessTxId1) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenProcessTxId1: TokenProcessTxId1
      }))
    }

    const TokenProcessTxId2 = await AoCreateProcessAuto(currentWallet.jwk)
    if(TokenProcessTxId2) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        TokenProcessTxId2: TokenProcessTxId2
      }))
    }

    const MyProcessTxIdsAddToken1 = await MyProcessTxIdsAddToken(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, TokenProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddToken1) {
      console.log("MyProcessTxIdsAddToken1", MyProcessTxIdsAddToken1)
      if(MyProcessTxIdsAddToken1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddToken1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddToken1: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddToken1: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsAddToken2 = await MyProcessTxIdsAddToken(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, TokenProcessTxId1, '666', 'Data')
    if(MyProcessTxIdsAddToken2) {
      console.log("MyProcessTxIdsAddToken2", MyProcessTxIdsAddToken2)
      if(MyProcessTxIdsAddToken2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsAddToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsAddToken2: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsAddToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsGetTokensData1 = await MyProcessTxIdsGetTokens(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetTokensData1) {
      console.log("MyProcessTxIdsGetTokensData1", MyProcessTxIdsGetTokensData1)
      if(MyProcessTxIdsGetTokensData1?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsGetTokensData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'MyProcessTxIdsGetTokensData1': formatText
        }))
      }
    }

    const MyProcessTxIdsDelToken2 = await MyProcessTxIdsDelToken(currentWallet.jwk, MyProcessTxIds, MyProcessTxIds, TokenProcessTxId2)
    if(MyProcessTxIdsDelToken2) {
      console.log("MyProcessTxIdsDelToken2", MyProcessTxIdsDelToken2)
      if(MyProcessTxIdsDelToken2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsDelToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            MyProcessTxIdsDelToken2: formatText
          }))

          //Read message from inbox
          const MyProcessTxIdsDelTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(MyProcessTxIdsDelTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                MyProcessTxIdsDelToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const MyProcessTxIdsGetTokensData2 = await MyProcessTxIdsGetTokens(MyProcessTxIds, MyProcessTxIds)
    if(MyProcessTxIdsGetTokensData2) {
      console.log("MyProcessTxIdsGetTokensData2", MyProcessTxIdsGetTokensData2)
      if(MyProcessTxIdsGetTokensData2?.msg?.Output?.data?.output)  {
        const formatText = MyProcessTxIdsGetTokensData2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          'MyProcessTxIdsGetTokensData2': formatText
        }))
      }
    }



    
    //Delay 1s code end
    setIsDisabledButton(false)

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Finished': '==================================================='
    }))

    //}, 5000);


  }

  return (
    <Fragment>
      {currentAddress ?
      <Grid container>
        <Grid item xs={12}>
          <Card>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Button sx={{ textTransform: 'none', m: 2 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                        () => { handleSimulatedMyProcessTxIds() }
                    }>
                    {t("Simulated MyProcessTxIds")}
                    </Button>
                  </Box>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/myprocesstxids.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("MyProcessTxIds Lua")}
                      </Typography>
                  </Link>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Typography noWrap variant='body2' sx={{my: 2}}>
                CurrentAddress: <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography>
                </Typography>
                

                {toolInfo && Object.keys(toolInfo).map((Item: any, Index: number)=>{

                  return (
                    <Fragment key={Index}>
                    <Tooltip title={toolInfo[Item]}>
                      <Typography  variant='body2' sx={{my: 2}}>
                      {Item}: <Typography variant='body2' sx={{display: 'inline', color: 'primary.main', whiteSpace: 'pre-line'}}>{toolInfo[Item]}</Typography>
                      </Typography>
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

export default MyProcessTxIds

