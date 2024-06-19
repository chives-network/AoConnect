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
import { AoLoadBlueprintChivesServerData, ChivesServerDataGetTokens, ChivesServerDataAddToken, ChivesServerDataDelToken } from 'src/functions/AoConnect/ChivesServerData'

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const ChivesServerData = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>({ChivesServerData:''})

  const handleSimulatedChivesServerData = async function () {

    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)

    const ChivesServerData = await AoCreateProcessAuto(currentWallet.jwk)
    if(ChivesServerData) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ChivesServerData: ChivesServerData
      }))
    }

    setToolInfo((prevState: any)=>({
        ...prevState,
        'Wait seconds': '5s'
    }))
    setToolInfo((prevState: any)=>({
        ...prevState,
        'Loading LoadBlueprint ChivesServerData': '....................................................'
    }))

    await sleep(5000)

    let LoadBlueprintChivesServerData: any = await AoLoadBlueprintChivesServerData(currentWallet.jwk, ChivesServerData);
    while(LoadBlueprintChivesServerData && LoadBlueprintChivesServerData.status == 'ok' && LoadBlueprintChivesServerData.msg && LoadBlueprintChivesServerData.msg.error)  {
      sleep(6000)
      LoadBlueprintChivesServerData = await AoLoadBlueprintChivesServerData(currentWallet.jwk, ChivesServerData);
      console.log("handleSimulatedToken LoadBlueprintChivesServerData:", LoadBlueprintChivesServerData);
    }
    if(LoadBlueprintChivesServerData) {
      console.log("LoadBlueprintChivesServerData", LoadBlueprintChivesServerData)
      if(LoadBlueprintChivesServerData?.msg?.Output?.data?.output)  {
        const formatText = LoadBlueprintChivesServerData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintChivesServerData: formatText
        }))
      }
    }
    console.log("LoadBlueprintChivesServerData", LoadBlueprintChivesServerData)

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

    const ChivesServerDataAddToken1 = await ChivesServerDataAddToken(currentWallet.jwk, ChivesServerData, ChivesServerData, TokenProcessTxId1, '666', 'Data')
    if(ChivesServerDataAddToken1) {
      console.log("ChivesServerDataAddToken1", ChivesServerDataAddToken1)
      if(ChivesServerDataAddToken1?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddToken1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddToken1: formatText
          }))

          //Read message from inbox
          const ChivesServerDataAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(ChivesServerDataAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddToken1: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataAddToken2 = await ChivesServerDataAddToken(currentWallet.jwk, ChivesServerData, ChivesServerData, TokenProcessTxId2, '777', 'Data')
    if(ChivesServerDataAddToken2) {
      console.log("ChivesServerDataAddToken2", ChivesServerDataAddToken2)
      if(ChivesServerDataAddToken2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataAddToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataAddToken2: formatText
          }))

          //Read message from inbox
          const ChivesServerDataAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(ChivesServerDataAddTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataAddToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataGetTokensData1 = await ChivesServerDataGetTokens(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetTokensData1) {
      console.log("ChivesServerDataGetTokensData1", ChivesServerDataGetTokensData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetTokensData1': JSON.stringify(ChivesServerDataGetTokensData1)
      }))
    }

    const ChivesServerDataDelToken2 = await ChivesServerDataDelToken(currentWallet.jwk, ChivesServerData, ChivesServerData, TokenProcessTxId2)
    if(ChivesServerDataDelToken2) {
      console.log("ChivesServerDataDelToken2", ChivesServerDataDelToken2)
      if(ChivesServerDataDelToken2?.msg?.Output?.data?.output)  {
        const formatText = ChivesServerDataDelToken2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesServerDataDelToken1: formatText
          }))

          //Read message from inbox
          const ChivesServerDataDelTokenData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(ChivesServerDataDelTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesServerDataDelTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesServerDataDelToken2: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesServerDataGetTokensData2 = await ChivesServerDataGetTokens(ChivesServerData, ChivesServerData)
    if(ChivesServerDataGetTokensData2) {
      console.log("ChivesServerDataGetTokensData2", ChivesServerDataGetTokensData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesServerDataGetTokensData2': JSON.stringify(ChivesServerDataGetTokensData2)
      }))
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
                        () => { handleSimulatedChivesServerData() }
                    }>
                    {t("Simulated ChivesServerData")}
                    </Button>
                  </Box>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesserverdata.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("ChivesServerData Lua")}
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

export default ChivesServerData

