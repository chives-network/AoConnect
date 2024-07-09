// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

import axios from 'axios'
import authConfig from 'src/configs/auth'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

import { AoSendMsg, AoGetMessage, generateRandomNumber } from 'src/functions/AoConnect/AoConnect'
import { SetAoConnectReminderProcessTxId, GetAoConnectReminderProcessTxId, SetAoConnectMyAoConnectTxId, GetAoConnectMyAoConnectTxId } from 'src/functions/AoConnect/MsgReminder'


import MessageRender from './MessageRender'



const AoSendMsgModel = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  const [action, setAction] = useState<string>('Chat')
    
  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [isDisabledButton2, setIsDisabledButton2] = useState<boolean>(false)
  
  const [resultText, setResultText] = useState<string>("")
  const [resultText2, setResultText2] = useState<any>()

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [chatroomId, setChatroomId] = useState<string>("")
  const [chatroomIdError, setChatroomIdError] = useState<string | null>(null)
  const handleChatroomIdChange = (event: any) => {
    setChatroomId(event.target.value);
    if(event.target.value.length != 43) {
        setChatroomIdError(`${t('ChatroomId length must be 43')}`)
    }
    else {
        setChatroomIdError("")
    }
    
    console.log("ChatroomId", chatroomId)
  };

  const [myAoConnectTxId, setMyAoConnectTxId] = useState<string>("")
  const [myAoConnectTxIdError, setMyAoConnectTxIdError] = useState<string | null>(null)
  const handleMyProcessTxIdChange = (event: any) => {
    setMyAoConnectTxId(event.target.value);
    if(event.target.value.length != 43) {
        setMyAoConnectTxIdError(`${t('myAoConnectTxId length must be 43')}`)
    }
    else {
        setMyAoConnectTxIdError("")
    }
    
    console.log("myAoConnectTxId", myAoConnectTxId)
  };

  const [processTxId, setProcessTxId] = useState<string>("")
  const [processTxIdError, setprocessTxIdError] = useState<string | null>(null)
  const handleprocessTxIdChange = (event: any) => {
    setProcessTxId(event.target.value);
    if(event.target.value.length != 43) {
        setprocessTxIdError(`${t('processTxId length must be 43')}`)
    }
    else {
        setprocessTxIdError("")
    }
    
    console.log("processTxId", processTxId)
  };

  useEffect(()=>{
    setChatroomId(GetAoConnectMyAoConnectTxId(currentAddress))
    setMyAoConnectTxId(GetAoConnectReminderProcessTxId())
  }, [])
  
  const [message, setMessage] = useState<string>("Hello World : " + String(generateRandomNumber(1111, 9999)).substring(0, 4) + ".")
  const [messageError, setMessageError] = useState<string | null>(null)
  const [messageHelp, setMessageHelp] = useState<string | null>(null)
  const handlemessageChange = (event: any) => {
    setMessage(event.target.value);
    setMessageError("")
    const Msg: string = event.target.value
    if(Msg.startsWith("Inbox")) {
        setMessageHelp('Command')
        setTags('[ { "name": "Action", "value": "Eval" } ]')
    }
    else {
        setMessageHelp('Data')
    }
  };

  const [tags, setTags] = useState<string>('[ \n{ "name": "Your-Tag-Name", "value": "Your-Tag-Value" }, \n{ "name": "Creator", "value": "Chives-Network" } \n]')
  const [tagsError, setTagsError] = useState<string | null>(null)
  const handleTagsChange = (event: any) => {
    setTags(event.target.value);
    setTagsError("")
  };

  const handleSaveLocalStorage = () => {
    SetAoConnectMyAoConnectTxId(currentAddress, myAoConnectTxId);
    SetAoConnectReminderProcessTxId(myAoConnectTxId);
    toast.success('Save Success', { 
        position: 'top-right', 
        duration: 4000 
    })
  }

  const handleSubmit = async () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
            position: 'top-center',
            duration: 4000
        })
        router.push("/mywallets");
        
        return
    }

    setResultText('')
    setResultText2('')
    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)

    const Result: any = await AoSendMsg(currentWallet.jwk, processTxId, String(message), JSON.parse(tags));

    if(Result && Result.length == 43) {
      toast.success(Result, { 
        position: 'top-right', 
        duration: 4000 
      })
      setResultText(Result)
    }
    setIsDisabledButton(false)
    setUploadingButton(`${t('Submit')}`)

  }

  useEffect(()=>{
    if(resultText && resultText!='') {
        handleGetMsgContent()
    }
  }, [resultText])

  const handleGetMsgContent = async () => {
    if(processTxId && resultText && resultText.length == 43)  {
        setIsDisabledButton2(true)
        const Result: any = await AoGetMessage(processTxId, resultText);
        console.log("AoGetMessage Result", Result)
        if(Result) {
            setResultText2(Result)
            console.log("AoGetMessageModel","handleSubmit","processTxId:", processTxId, "message:", resultText, "Result:", Result)
            toast.success("AoGetMessage Success", { position: 'top-right', duration: 4000 })
        }
        setIsDisabledButton2(false)
    }
  }

  const handleLuaFromGithub = async (module: string) => {
    try {
        const Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/blueprints/' + module + '.lua', { headers: { }, params: { } }).then(res => res.data)
        setMessage(Data)
        setTags('[ { "name": "Action", "value": "Eval" } ]')
        setResultText('')
        setResultText2('')
    }
    catch(Error: any) {
        console.error("getAppsPage Error:", Error)
    }
  }

  return (
    <Fragment>
    
    <Card>
            <CardHeader title={`${t('Set chatroomId and MyAoConnectTxid')}`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label={`${t('chatroomId')}`}
                            placeholder={`${t('chatroomId')}`}
                            value={chatroomId}
                            onChange={handleChatroomIdChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!chatroomIdError}
                            helperText={
                                <Fragment>
                                    Need .load-blueprint chatroom and .load-blueprint chat firstly
                                </Fragment>
                                }
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label={`${t('My AoConnect Process TxId')}`}
                            placeholder={`${t('myAoConnectTxId')}`}
                            value={myAoConnectTxId}
                            onChange={handleMyProcessTxIdChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!myAoConnectTxIdError}
                            helperText={myAoConnectTxIdError}
                        />
                    </Grid>
                    <Grid item xs={2} justifyContent="flex-end">
                        <Button type='submit' sx={{mt: 1}} variant='contained' size='large' onClick={handleSaveLocalStorage} >
                            {uploadingButton}
                        </Button>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>

    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Card>
            <CardHeader title={`${t('Send Message')}`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`${t('processTxId')}`}
                            placeholder={`${t('processTxId')}`}
                            value={processTxId}
                            onChange={handleprocessTxIdChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                    <Icon icon='mdi:account-outline' />
                                    </InputAdornment>
                                )
                            }}
                            error={!!processTxIdError}
                            helperText={messageHelp}
                        />
                        
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            label={`${t('Message')}`}
                            placeholder={`${t('Message')}`}
                            value={message}
                            onChange={handlemessageChange}
                            error={!!messageError}
                            helperText={messageHelp}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label={`${t('Tags')}`}
                            placeholder={`${t('Tags')}`}
                            sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}                 
                            value={tags}
                            onChange={handleTagsChange}
                            error={!!tagsError}
                            helperText={tagsError}
                        />
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end">
                        {resultText && (
                        <Button variant='outlined' size='small' sx={{ mr:3 }} onClick={()=>{
                            setResultText('')
                            setResultText2('')
                        }} disabled={isDisabledButton} >
                            {t('Cannel')}
                        </Button>
                        )}
                        {isDisabledButton && (
                            <Box sx={{ m: 0, pt:1 }}>
                                <CircularProgress sx={{ mr: 5, mt: 0 }} />
                            </Box>
                        )}
                        <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                            {uploadingButton}
                        </Button>
                    </Grid>

                    <Grid container justifyContent="flex-start" alignItems="center">
                        <Link href={authConfig.AoConnectAoLink + `/message/${resultText}`} target='_blank'>
                            <Typography variant='body2' sx={{ml: 3, mt:2}}>
                                {resultText}
                            </Typography>
                        </Link>
                        {resultText && (
                            <Button size="small" sx={{mt: 3, ml: 3}} variant='outlined' disabled={isDisabledButton2} onClick={handleGetMsgContent}>{t('Get Content')}</Button>
                        )}
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
            <CardHeader title={`${t('Command Example')}`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Button variant={action=='Chat'?'contained':'outlined'} size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                            setAction('Chat')
                        }}>
                            Chat Section
                        </Button>
                        <Button variant={action=='Token'?'contained':'outlined'} size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                            setAction('Token')
                        }}>
                            Token Section
                        </Button>

                        <Divider sx={{ mr:3, mb: 5 }} />

                        {action && action == 'Chat' && (
                            <Fragment>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr: 3, mb: 2 }} onClick={()=>{
                                        setMessage('Inbox[#Inbox]')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: My Wallet Process TxId / Reminder Id')
                                        setProcessTxId(myAoConnectTxId)
                                    }}>
                                        Inbox[#Inbox]
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Loading the last message
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr: 3, mb: 2 }} onClick={()=>{
                                        setMessage('Inbox[#Inbox].Data')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: My Wallet Process TxId / Reminder Id')
                                        setProcessTxId(myAoConnectTxId)
                                    }}>
                                        Inbox[#Inbox].Data
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Loading the last message's Data
                                    </Typography>
                                </Box>

                                <Divider sx={{ mr:3, mb: 2 }} />
                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        handleLuaFromGithub('chatroom')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        .load-blueprint chatrom
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Use the '.load-blueprint' to load the chatrom contract
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Handlers.list')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Handlers.list
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        List all the methods in Handlers
                                    </Typography>
                                </Box>

                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Send({ Target = "' + chatroomId + '", Action = "Register" })')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('1 Send({ Target = [ChatroomTxId], Action = "Register" }) 2 ProcessTxId: My Wallet Process TxId / Reminder Id')
                                        setProcessTxId(myAoConnectTxId)
                                    }}>
                                        {'Send({ Target = ao.id, Action = "Register" })'}
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Register ao.id 's chat room
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Members')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Members
                                    </Button>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Applicants')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Applicants
                                    </Button>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Invites')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Invites
                                    </Button>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Channels')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Channels
                                    </Button>
                                </Box>
                                
                                <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                    setMessage('Send({Target = "' + chatroomId + '", Action = "Broadcast", Data = "From Chives: Broadcasting My 1st Message" })')
                                    setTags('[ { "name": "Action", "value": "Eval" } ]')
                                    setMessageHelp('1 Send({ Target = [ChatroomTxId], ... }) 2 ProcessTxId: My Wallet Process TxId / Reminder Id')
                                    setProcessTxId(myAoConnectTxId)
                                }}>
                                    {'Send({Target = ao.id, Action = "Broadcast", Data = "From Chives: Broadcasting My 1st Message" })'}
                                </Button>

                                <Divider sx={{ mr:3, mb: 2 }} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        handleLuaFromGithub('chat')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                        }}>
                                        .load-blueprint chat
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Use the '.load-blueprint' to load the chat contract
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('List()')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        List()
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        List all messages
                                    </Typography>
                                </Box>



                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Join("Quests", "Wang001")')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Join("Quests", "Wang001")
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Join the 'Quests' chat room, 'Wang001' as nickname
                                    </Typography>
                                </Box>

                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Say("Hello everyone!", "YeIgn_CImXg4UPHOg7-rbylVv9su6FKXY2LIHwWFB5g")')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Say("Hello everyone!", "YeIgn_CImXg4UPHOg7-rbylVv9su6FKXY2LIHwWFB5g")
                                    </Button>
                                </Box>

                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Leave("Quests")')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: ChatroomTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        Leave("Quests")
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Leave the 'Quests' chat room
                                    </Typography>
                                </Box>

                            </Fragment>
                        )}
                        
                        {action && action == 'Token' && (
                            <Fragment>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr: 3, mb: 2 }} onClick={()=>{
                                        setMessage('Inbox[#Inbox]')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: My Wallet Process TxId / Reminder Id')
                                        setProcessTxId(myAoConnectTxId)
                                    }}>
                                        Inbox[#Inbox]
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Loading the last message
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr: 3, mb: 2 }} onClick={()=>{
                                        setMessage('Inbox[#Inbox].Data')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setMessageHelp('ProcessTxId: My Wallet Process TxId / Reminder Id')
                                        setProcessTxId(myAoConnectTxId)
                                    }}>
                                        Inbox[#Inbox].Data
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Loading the last message's Data
                                    </Typography>
                                </Box>
                                
                                <Divider sx={{ mr:3, mb: 2 }} />
                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        handleLuaFromGithub('token')
                                        setMessageHelp('ProcessTxId: TokenTxId')
                                        setProcessTxId(chatroomId)
                                    }}>
                                        .load-blueprint token
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        Use the '.load-blueprint' to load the token contract
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Handlers.list')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                    }}>
                                        Handlers.list
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        List all the methods in Handlers
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', m: 0, p: 0 }}>
                                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                        setMessage('Send({ Target = "' + chatroomId + '", Action = "Info" })')
                                        setTags('[ { "name": "Action", "value": "Eval" } ]')
                                        setProcessTxId(myAoConnectTxId)
                                    }}>
                                        {'Send({ Target = ao.id, Action = "Info" })'}
                                    </Button>
                                    <Typography variant='body2' sx={{ mt: -2 }}>
                                        ao.id 's token info
                                    </Typography>
                                </Box>

                                
                                <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                    setMessage('Send({ Target = "' + chatroomId + '", Action = "Transfer", Recipient = "UREzA_KXE112ZrcnCcI5tiCUk1zzuKG8dV52EgVa-g8", Quantity = "1111"})')
                                    setTags('[ { "name": "Action", "value": "Eval" } ]')
                                    setProcessTxId(myAoConnectTxId)
                                }}>
                                    {'Send({ Target = ao.id, Action = "Transfer", Recipient = "UREzA_KXE112ZrcnCcI5tiCUk1zzuKG8dV52EgVa-g8", Quantity = "1111"})'}
                                </Button>

                                <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                    setMessage('Send({ Target = "' + chatroomId + '", Tags = { Action = "Mint", Quantity = "2222" }})')
                                    setTags('[ { "name": "Action", "value": "Eval" } ]')
                                    setProcessTxId(myAoConnectTxId)
                                }}>
                                    {'Send({ Target = ao.id, Tags = { Action = "Mint", Quantity = "2222" }})'}
                                </Button>

                                <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                    setMessage('Send({ Target = "' + chatroomId + '", Tags = { Action = "Balances" }})')
                                    setTags('[ { "name": "Action", "value": "Eval" } ]')
                                    setProcessTxId(myAoConnectTxId)
                                }}>
                                    {'Send({ Target = ao.id, Tags = { Action = "Balances" }})'}
                                </Button>

                                <Button variant='outlined' size='small' sx={{ textTransform: 'none', mr:3, mb: 2 }} onClick={()=>{
                                    setMessage('Send({ Target = "' + chatroomId + '", Action = "Balance", Tags = { Target = ao.id } })')
                                    setTags('[ { "name": "Action", "value": "Eval" } ]')
                                    setProcessTxId(myAoConnectTxId)
                                }}>
                                    {'Send({ Target = ao.id, Action = "Balance", Tags = { Target = ao.id } })'}
                                </Button>
                            </Fragment>
                        )}

                    </Grid>
                </Grid>
            </CardContent>
        </Card>    
      </Grid>
      {resultText2 && (
        <Grid item xs={12}>
            <Card>
                <CardHeader title={`${t('Message Content')}`} />
                <CardContent>
                    <Grid container spacing={5}>
                        <MessageRender resultText={resultText2} />
                    </Grid>
                </CardContent>
            </Card>    
        </Grid>
      )}

    </Grid>

    
        
    </Fragment>
  )
}

export default AoSendMsgModel
