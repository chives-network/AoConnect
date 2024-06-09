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
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import TextField2 from './TextField2'

const MembersInvite = (props: any) => {
    // ** Props
    const {openMembersInvite, setOpenMembersInvite, valueMembersInvite, setValueMembersInvite, handleInviteMember } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    const isDisabledButton = false

  return (
    <Dialog fullWidth open={openMembersInvite} onClose={
        () => { setOpenMembersInvite(false) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Avatar src={openMembersInvite.FormTitleIcon} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                <Typography sx={{pl: 2}}>{t('Invite to Chatroom') as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setOpenMembersInvite(false) }
                    } aria-label="close">
                        <Icon icon='mdi:close-circle-outline' />
                    </IconButton>
                </Box>
            </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
                <TextField2
                    multiline
                    rows={8}
                    size="small"
                    value={valueMembersInvite}
                    sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    placeholder={t("Support entering multiple addresses, with each address on a separate line") as string}
                    onChange={(e: any) => {
                        setValueMembersInvite(e.target.value)
                    }}
                />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button size="small" variant='outlined' disabled={isDisabledButton} onClick={
                () => { setOpenMembersInvite(false) }
            }>
            {t("Cancel")}
            </Button>
            <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                () => { 
                    setOpenMembersInvite(false)
                    handleInviteMember()
                }
            }>
            {t('Submit')}
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default MembersInvite
