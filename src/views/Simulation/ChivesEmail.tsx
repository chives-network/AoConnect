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
import authConfig from 'src/configs/auth'

// ** Next Import
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from 'src/functions/AoConnect/AoConnect'
import { AoLoadBlueprintChivesEmail, 
  ChivesEmailGetMyEmailRecords, ChivesEmailSendEmail, ChivesEmailSetPublicKey, ChivesEmailGetPublicKeys, ChivesEmailGetEmailRecords, ChivesEmailReadEmailContent, ChivesEmailMoveToFolder
 } from 'src/functions/AoConnect/ChivesEmail'
import { ansiRegex } from 'src/configs/functions'

const ChivesEmail = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>({ChivesEmail:''})

  const handleSimulatedChivesEmail = async function () {

    if(currentWallet == undefined || currentWallet == null) {

      return
    }

    setIsDisabledButton(true)

    const ChivesEmail = authConfig.AoConnectChivesEmailServerData
    const TokenProcessTxId1 = "uk6oWsri6492CmYMA2iCgDlSSFwlhuyijfv9UNqtqvg"
    const TokenProcessTxId2 = "Bxp-92cN0pUt621JPMTeLfTm1WE70a3kKX7HkU0QQkM"

    setToolInfo({ChivesEmail:ChivesEmail})

    const ChivesEmail1 = await AoCreateProcessAuto(currentWallet.jwk)
    if(ChivesEmail) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ChivesEmail: ChivesEmail
      }))
    }
    console.log("ChivesEmail1", ChivesEmail1)

    setToolInfo((prevState: any)=>({
        ...prevState,
        'Wait seconds': '5s'
    }))
    setToolInfo((prevState: any)=>({
        ...prevState,
        'Loading LoadBlueprint ChivesEmail': '....................................................'
    }))

    await sleep(5000)

    let LoadBlueprintChivesEmail: any = await AoLoadBlueprintChivesEmail(currentWallet.jwk, ChivesEmail);
    while(LoadBlueprintChivesEmail && LoadBlueprintChivesEmail.status == 'ok' && LoadBlueprintChivesEmail.msg && LoadBlueprintChivesEmail.msg.error)  {
      sleep(6000)
      LoadBlueprintChivesEmail = await AoLoadBlueprintChivesEmail(currentWallet.jwk, ChivesEmail);
      console.log("handleSimulatedToken LoadBlueprintChivesEmail:", LoadBlueprintChivesEmail);
    }
    if(LoadBlueprintChivesEmail) {
      console.log("LoadBlueprintChivesEmail", LoadBlueprintChivesEmail)
      if(LoadBlueprintChivesEmail?.msg?.Output?.data?.output)  {
        const formatText = LoadBlueprintChivesEmail?.msg?.Output?.data?.output.replace(ansiRegex, '');
        setToolInfo((prevState: any)=>({
          ...prevState,
          LoadBlueprintChivesEmail: formatText
        }))
      }
    }
    console.log("LoadBlueprintChivesEmail", LoadBlueprintChivesEmail)

    /*
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
    */

    setToolInfo((prevState: any)=>({
      ...prevState,
      'Testing Email': '==================================================='
    }))

    const ChivesEmailSendEmail1 = await ChivesEmailSendEmail(currentWallet.jwk, ChivesEmail, TokenProcessTxId2, 'He tried to oust OpenAI’s CEO. Now, he’s starting a ‘safe’ rival', 'The launch announcement from Safe Superintelligence suggests that the company wants to take a different approach: Our singular focus means no distraction by management overhead or product cycles, and our business model means safety, security, and progress are all insulated from short-term commercial pressures. Joining Sutskever in launching the new company are Daniel Levy, who had worked at OpenAI for the past two years, and Daniel Gross, an investor who previously worked as a partner at the startup accelerator Y Combinator and on machine learning efforts at Apple. The company says it will have offices in Palo Alto, California, and Tel Aviv, Israel.', "New York CNN — The OpenAI co-founder who left the high-flying artificial intelligence startup last month has announced his next venture: a company dedicated to building safe, powerful artificial intelligence that could become a rival to his old employer.", 'Encrypted001')
    if(ChivesEmailSendEmail1) {
      console.log("ChivesEmailSendEmail1", ChivesEmailSendEmail1)
      if(ChivesEmailSendEmail1?.msg?.Output?.data?.output)  {
        const formatText = ChivesEmailSendEmail1?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesEmailSendEmail1: formatText
          }))

          //Read message from inbox
          const ChivesEmailSendEmailData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId1)
          if(ChivesEmailSendEmailData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesEmailSendEmailData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesEmailSendEmail1: formatText2
              }))
            }
          }

        }

      }
    }
    await ChivesEmailSendEmail(currentWallet.jwk, ChivesEmail, TokenProcessTxId2, 'Subject002-0853', 'Content002', 'Summary002', 'Text')
    await ChivesEmailSendEmail(currentWallet.jwk, ChivesEmail, TokenProcessTxId2, 'Subject003-0853', 'Content003', 'Summary003', 'Text')
    await ChivesEmailSendEmail(currentWallet.jwk, ChivesEmail, TokenProcessTxId2, 'Subject004-0853', 'Content004', 'Summary004', 'Text')
    await ChivesEmailSendEmail(currentWallet.jwk, ChivesEmail, TokenProcessTxId2, 'Subject005-0853', 'Content005', 'Summary005', 'Text')
    await ChivesEmailSendEmail(currentWallet.jwk, ChivesEmail, TokenProcessTxId2, 'Subject006-0853', 'Content006', 'Summary006', 'Text')

    const ChivesEmailGetMyEmailRecordsData1 = await ChivesEmailGetMyEmailRecords(ChivesEmail, TokenProcessTxId1, "Inbox", '0', '10')
    if(ChivesEmailGetMyEmailRecordsData1) {
      console.log("ChivesEmailGetMyEmailRecordsData1", ChivesEmailGetMyEmailRecordsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesEmailGetMyEmailRecordsData1': JSON.stringify(ChivesEmailGetMyEmailRecordsData1)
      }))
    }

    const ChivesEmailGetMyEmailRecordsData2 = await ChivesEmailGetMyEmailRecords(ChivesEmail, TokenProcessTxId2, "Inbox", '0', '10')
    if(ChivesEmailGetMyEmailRecordsData2) {
      console.log("ChivesEmailGetMyEmailRecordsData2", ChivesEmailGetMyEmailRecordsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesEmailGetMyEmailRecordsData2': JSON.stringify(ChivesEmailGetMyEmailRecordsData2)
      }))
    }

    const ChivesEmailReadEmailContentData = await ChivesEmailReadEmailContent(currentWallet.jwk, ChivesEmail, 'Svwfh_fzyX5bcj1dvMrYT9DyU52l7EB9MWCtNHqTmhw', 'Inbox')
    if(ChivesEmailReadEmailContentData) {
      console.log("ChivesEmailReadEmailContentData", ChivesEmailReadEmailContentData)
      if(ChivesEmailReadEmailContentData?.msg?.Output?.data?.output)  {
        const formatText = ChivesEmailReadEmailContentData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesEmailSetPublicKey1: formatText
          }))

          //Read message from inbox
          const ChivesEmailSetPublicKeyData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(ChivesEmailSetPublicKeyData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesEmailSetPublicKeyData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesEmailReadEmailContentData: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesEmailMoveToFolderData = await ChivesEmailMoveToFolder(currentWallet.jwk, ChivesEmail, 'HEGz9y0hZXz48Ur_Rkpwml5aVwf18eiM6fpaLo9XnjI', 'Inbox', 'Starred')
    if(ChivesEmailMoveToFolderData) {
      console.log("ChivesEmailMoveToFolderData", ChivesEmailMoveToFolderData)
      if(ChivesEmailMoveToFolderData?.msg?.Output?.data?.output)  {
        const formatText = ChivesEmailMoveToFolderData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesEmailSetPublicKey1: formatText
          }))

          //Read message from inbox
          const ChivesEmailSetPublicKeyData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(ChivesEmailSetPublicKeyData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesEmailSetPublicKeyData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesEmailMoveToFolderData: formatText2
              }))
            }
          }

        }

      }
    }

    
    const ChivesEmailSetPublicKey2 = await ChivesEmailSetPublicKey(currentWallet.jwk, ChivesEmail, TokenProcessTxId2, 'PublicKey', 'PublicKeyMAC')
    if(ChivesEmailSetPublicKey2) {
      console.log("ChivesEmailSetPublicKey2", ChivesEmailSetPublicKey2)
      if(ChivesEmailSetPublicKey2?.msg?.Output?.data?.output)  {
        const formatText = ChivesEmailSetPublicKey2?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          setToolInfo((prevState: any)=>({
            ...prevState,
            ChivesEmailSetPublicKey1: formatText
          }))

          //Read message from inbox
          const ChivesEmailSetPublicKeyData1 = await GetMyLastMsg(currentWallet.jwk, TokenProcessTxId2)
          if(ChivesEmailSetPublicKeyData1?.msg?.Output?.data?.output)  {
            const formatText2 = ChivesEmailSetPublicKeyData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              setToolInfo((prevState: any)=>({
                ...prevState,
                ChivesEmailSetPublicKey2: formatText2
              }))
            }
          }

        }

      }
    }

    const ChivesEmailGetPublicKeysData = await ChivesEmailGetPublicKeys(ChivesEmail, TokenProcessTxId1, TokenProcessTxId2)
    if(ChivesEmailGetPublicKeysData) {
      console.log("ChivesEmailGetPublicKeysData", ChivesEmailGetPublicKeysData)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesEmailGetPublicKeysData': ChivesEmailGetPublicKeysData
      }))
    }
    
    const ChivesEmailGetEmailRecordsData1 = await ChivesEmailGetEmailRecords(ChivesEmail, TokenProcessTxId1)
    if(ChivesEmailGetEmailRecordsData1) {
      console.log("ChivesEmailGetEmailRecordsData1", ChivesEmailGetEmailRecordsData1)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesEmailGetEmailRecordsData1': JSON.stringify(ChivesEmailGetEmailRecordsData1)
      }))
    }

    const ChivesEmailGetEmailRecordsData2 = await ChivesEmailGetEmailRecords(ChivesEmail, TokenProcessTxId2)
    if(ChivesEmailGetEmailRecordsData2) {
      console.log("ChivesEmailGetEmailRecordsData2", ChivesEmailGetEmailRecordsData2)
      setToolInfo((prevState: any)=>({
        ...prevState,
        'ChivesEmailGetEmailRecordsData2': JSON.stringify(ChivesEmailGetEmailRecordsData2)
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
                        () => { handleSimulatedChivesEmail() }
                    }>
                    {t("Simulated ChivesEmail")}
                    </Button>
                  </Box>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoConnect/blob/main/blueprints/chivesemail.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("ChivesEmail Lua") as string}
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

export default ChivesEmail

