// ** React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import TextField2 from './TextField2'

const ChannelEdit = (props: any) => {
    // ** Props
    const {openChannelEdit, setOpenChannelEdit, handleAddOrEditOrDelChannel } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    const isDisabledButton = false

  return (
    <Dialog fullWidth open={openChannelEdit.open} onClose={
        () => { 
            setOpenChannelEdit((prevState: any)=>({
                ...prevState,
                open: false,
            }))
        }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Typography sx={{pl: 2}}>{t('Channel Detail') as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { 
                            setOpenChannelEdit((prevState: any)=>({
                                ...prevState,
                                open: false,
                            }))
                         }
                    } aria-label="close">
                        <Icon icon='mdi:close-circle-outline' />
                    </IconButton>
                </Box>
            </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
                <TextField2
                    size="small"
                    value={openChannelEdit?.Channel?.ChannelGroup ?? ''}
                    sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    placeholder={t("ChannelGroup") as string}
                    onChange={(e: any) => {
                        const ChannelNameNew = { ...openChannelEdit.Channel, ChannelGroup: e.target.value }
                        setOpenChannelEdit((prevState: any)=>({
                            ...prevState,
                            Channel: ChannelNameNew,
                        }))
                    }}
                />
                <TextField2
                    size="small"
                    value={openChannelEdit?.Channel?.ChannelName ?? ''}
                    sx={{ width: '100%', mt: 3, resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    placeholder={t("ChannelName") as string}
                    onChange={(e: any) => {
                        const ChannelNameNew = { ...openChannelEdit.Channel, ChannelName: e.target.value }
                        setOpenChannelEdit((prevState: any)=>({
                            ...prevState,
                            Channel: ChannelNameNew,
                        }))
                    }}
                />
                <TextField2
                    multiline
                    rows={4}
                    size="small"
                    value={openChannelEdit?.Channel?.ChannelIntro ?? ''}
                    sx={{ width: '100%', mt: 3, resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    placeholder={t("Channel introduction") as string}
                    onChange={(e: any) => {
                        const ChannelIntroNew = { ...openChannelEdit.Channel, ChannelIntro: e.target.value }
                        setOpenChannelEdit((prevState: any)=>({
                            ...prevState,
                            Channel: ChannelIntroNew,
                        }))
                    }}
                />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button size="small" variant='outlined' disabled={isDisabledButton} onClick={
                () => { 
                    setOpenChannelEdit((prevState: any)=>({
                        ...prevState,
                        open: false,
                    }))
                }
            }>
            {t("Cancel")}
            </Button>
            <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                () => { 
                    setOpenChannelEdit((prevState: any)=>({
                        ...prevState,
                        open: false,
                    }))
                    if(openChannelEdit.edit) {
                        handleAddOrEditOrDelChannel('Edit')
                    }
                    else {
                        handleAddOrEditOrDelChannel('Add')
                    }
                }
            }>
            {t('Submit')}
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default ChannelEdit
