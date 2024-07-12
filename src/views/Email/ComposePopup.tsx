// ** React Imports
import { useState, useRef, HTMLAttributes, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import ButtonGroup from '@mui/material/ButtonGroup'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

import { EncryptEmailAES256GCMV1 } from 'src/functions/ChivesEncrypt'

import { ChivesEmailSendEmail } from 'src/functions/AoConnect/ChivesEmail'

import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { EditorState, ContentState } from 'draft-js'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Imports
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Types
import { MailComposeType, FieldMenuItems } from 'src/types/apps/emailTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'


// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import toast from 'react-hot-toast'

import { useTranslation } from 'react-i18next'

interface MailFields {
  cc: boolean
  bcc: boolean
}

const menuItemsArr: FieldMenuItems[] = []

const filter = createFilterOptions()

const ComposePopup = (props: MailComposeType) => {

  const { t } = useTranslation()

  // ** Props
  const { mdAbove, composeOpen, composePopupWidth, toggleComposeOpen, currentAoAddress, currentWallet, currentEmail, folder } = props

  // ** States
  const [emailTo, setEmailTo] = useState<FieldMenuItems[]>([])
  const [ccValue, setccValue] = useState<FieldMenuItems[]>([])
  const [subjectValue, setSubjectValue] = useState<string>('')
  const [bccValue, setbccValue] = useState<FieldMenuItems[]>([])
  const [sendBtnOpen, setSendBtnOpen] = useState<boolean>(false)
  const [messageValue, setMessageValue] = useState(EditorState.createEmpty())
  const [visibility, setVisibility] = useState<MailFields>({
    cc: false,
    bcc: false
  })
  const [emailToAddressError, setEmailToAddressError] = useState<string>('')
  const [emailToAddress, setEmailToAddress] = useState<string>('')

  useEffect(() => {
    setSendBtnOpen(false)
    if(currentEmail?.Reply == true) {
      setSubjectValue('Reply: ' + currentEmail.Subject)
      if(folder == "Sent") {
        setEmailTo([{name: currentEmail.To, value: currentEmail.To, src: ''}])
      }
      else {
        setEmailTo([{name: currentEmail.From, value: currentEmail.From, src: ''}])
      }
      const contentState = ContentState.createFromText('\n\n----------------------------------\n' + currentEmail.Content);
      const newEditorState = EditorState.createWithContent(contentState);
      setMessageValue(newEditorState)
    }
    if(currentEmail?.Forward == true) {
      setSubjectValue('Fw: ' + currentEmail.Subject)
      setEmailTo([])
      const contentState = ContentState.createFromText('\n\n----------------------------------\n' + currentEmail.Content);
      const newEditorState = EditorState.createWithContent(contentState);
      setMessageValue(newEditorState)
    }
  }, [composeOpen])

  // ** Ref
  const anchorRefSendBtn = useRef<HTMLDivElement>(null)

  const handleMailDelete = (value: string, state: FieldMenuItems[], setState: (val: FieldMenuItems[]) => void) => {
    const arr = state
    const index = arr.findIndex((i: FieldMenuItems) => i.value === value)
    arr.splice(index, 1)
    setState([...arr])
  }

  const handlePopupClose = () => {
    toggleComposeOpen()
  }

  const handleSendEmail = async () => {
    if(emailTo && emailTo.length == 0 && emailToAddress.length != 43) {
      toast.error(t('Received address must input') as string, {
        duration: 2000
      })
    }
    if(subjectValue.length == 0) {
      toast.error(t('Email subject must input') as string, {
        duration: 2000
      })
    }
    const isMessageValueEmpty = messageValue.getCurrentContent().getPlainText().trim().length === 0;
    if(isMessageValueEmpty) {
      toast.error(t('Email content must input') as string, {
        duration: 2000
      })
    }
    const EmailAddress: any = {}
    emailTo.map((item: any)=>{
      if(item.value && item.value.length == 43) {
        EmailAddress[item.value] = 1;
      }
    })
    if(emailToAddress && emailToAddress.length == 43) {
      EmailAddress[emailToAddress] = 1
    }
    const EmailAddressList = Object.keys(EmailAddress);
    setSendBtnOpen(true)

    if(EmailAddressList && EmailAddressList.length == 0) {
      toast.error(t('Received address must input') as string, {
        duration: 2000
      })
    }

    const EncryptedKey = EmailAddressList[0] + "" + currentAoAddress
    const SubjectEncryptd = EncryptEmailAES256GCMV1(subjectValue, EncryptedKey)
    const ContentEncryptd = EncryptEmailAES256GCMV1(messageValue.getCurrentContent().getPlainText(), EncryptedKey)
    const SummaryEncryptd = EncryptEmailAES256GCMV1(messageValue.getCurrentContent().getPlainText().slice(0, 200), EncryptedKey)

    const ChivesEmailSendEmail1 = await ChivesEmailSendEmail(currentWallet.jwk, authConfig.AoConnectChivesEmailServerData, EmailAddressList[0], SubjectEncryptd, ContentEncryptd, SummaryEncryptd, 'V1')
    console.log("ChivesEmailSendEmail1", ChivesEmailSendEmail1)
    if(ChivesEmailSendEmail1) {
      if(ChivesEmailSendEmail1?.msg?.Messages[0]?.Data)  {
        toast.success(t(ChivesEmailSendEmail1?.msg?.Messages[0]?.Data) as string, {
          duration: 2000
        })
      }
    }

    //const DecryptEmailAES256GCMV1Data = DecryptEmailAES256GCMV1(ContentEncryptd, EncryptedKey)
    //console.log("DecryptEmailAES256GCMV1Data", DecryptEmailAES256GCMV1Data)

    handlePopupCloseAndDeleteDraft()

  }

  const handlePopupCloseAndDeleteDraft = () => {
    toggleComposeOpen()
    setEmailTo([])
    setccValue([])
    setbccValue([])
    setSubjectValue('')
    setMessageValue(EditorState.createEmpty())
    setVisibility({
      cc: false,
      bcc: false
    })
    setEmailToAddress('')
  }

  const handleMinimize = () => {
    toggleComposeOpen()
    setEmailTo(emailTo)
    setccValue(ccValue)
    setbccValue(bccValue)
    setVisibility(visibility)
    setMessageValue(messageValue)
    setSubjectValue(subjectValue)
  }

  const renderCustomChips = (
    array: FieldMenuItems[],
    getTagProps: ({ index }: { index: number }) => {},
    state: FieldMenuItems[],
    setState: (val: FieldMenuItems[]) => void
  ) => {
    return array.map((item, index) => (
      <Chip
        size='small'
        key={item.value}
        label={item.name}
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon='mdi:close' />}
        onDelete={() => handleMailDelete(item.value, state, setState)}
      />
    ))
  }

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: FieldMenuItems,
    array: FieldMenuItems[],
    setState: (val: FieldMenuItems[]) => void
  ) => {
    return (
      <ListItem key={option.value} sx={{ cursor: 'pointer' }} onClick={() => setState([...array, option])}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {option.src.length ? (
            <CustomAvatar src={option.src} alt={option.name} sx={{ mr: 3, width: 22, height: 22 }} />
          ) : (
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 22, height: 22, fontSize: '.75rem' }}>
              {getInitials(option.name)}
            </CustomAvatar>
          )}
          <Typography sx={{ fontSize: '0.875rem' }}>{option.name}</Typography>
        </Box>
      </ListItem>
    )
  }

  const addNewOption = (options: FieldMenuItems[], params: any): FieldMenuItems[] => {
    const filtered = filter(options, params)
    const { inputValue } = params
    const isExisting = options.some(option => inputValue === option.name)

    if (inputValue !== '' && inputValue.length == 43 && !isExisting) {
      filtered.push({
        name: inputValue,
        value: inputValue,
        src: ''
      })
    }

    // @ts-ignore
    return filtered
  }

  return (
    <Drawer
      hideBackdrop
      anchor='bottom'
      open={composeOpen}
      variant='temporary'
      onClose={toggleComposeOpen}
      sx={{
        top: 'auto',
        left: 'auto',
        right: mdAbove ? '1.5rem' : '1rem',
        bottom: '1.5rem',
        display: 'block',
        zIndex: theme => `${theme.zIndex.drawer} + 1`,
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          position: 'static',
          width: composePopupWidth
        }
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>Compose Mail</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ p: 1, mr: 2 }} onClick={handleMinimize}>
            <Icon icon='mdi:minus' fontSize={20} />
          </IconButton>
          <IconButton sx={{ p: 1 }} onClick={handlePopupClose}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <div>
            <InputLabel sx={{ mr: 3, fontSize: '0.875rem' }} htmlFor='email-to-select'>
              To:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailTo}
            clearIcon={false}
            id='email-to-select'
            filterSelectedOptions
            options={menuItemsArr}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={option => (option as FieldMenuItems).name as string}
            renderOption={(props, option) => renderListItem(props, option, emailTo, setEmailTo)}
            renderTags={(array: FieldMenuItems[], getTagProps) =>
              renderCustomChips(array, getTagProps, emailTo, setEmailTo)
            }
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': { p: 2 },
              '& .MuiAutocomplete-endAdornment': { display: 'none' }
            }}
            renderInput={params => (
              <TextField
                {...params}
                autoComplete='new-password'
                onClick={(e: any)=>{
                  if(e.target.value && e.target.value.length == 43) {
                    setEmailToAddressError("")
                    setEmailToAddress(e.target.value)
                  }
                  else if(e.target.value == "") {
                    setEmailToAddressError("")
                  }
                  else {
                    setEmailToAddressError("Received address length must is 43")
                  }
                }}
                onChange={(e: any)=>{
                  if(e.target.value && e.target.value.length == 43) {
                    setEmailToAddressError("")
                  }
                  else if(e.target.value == "") {
                    setEmailToAddressError("")
                  }
                  else {
                    setEmailToAddressError("Received address length must is 43")
                  }
                }}
                error={!!emailToAddressError}
                helperText={emailToAddressError}
                sx={{
                  border: 0,
                  '& fieldset': { border: '0 !important' },
                  '& .MuiOutlinedInput-root': { p: '0 !important' }
                }}
              />
            )}
          />
        </Box>
      </Box>
      {visibility.cc ? (
        <Box
          sx={{
            py: 1,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, fontSize: '0.875rem' }} htmlFor='email-cc-select'>
              Cc:
            </InputLabel>
          </div>
          <TextField
            fullWidth
            size='small'
            sx={{
              border: 0,
              '& fieldset': { border: '0 !important' },
              '& .MuiOutlinedInput-root': { p: '0 !important' }
            }}
          />
        </Box>
      ) : null}
      {visibility.bcc ? (
        <Box
          sx={{
            py: 1,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, fontSize: '0.875rem' }} htmlFor='email-bcc-select'>
              Bcc:
            </InputLabel>
          </div>
          <TextField
            fullWidth
            size='small'
            sx={{
              border: 0,
              '& fieldset': { border: '0 !important' },
              '& .MuiOutlinedInput-root': { p: '0 !important' }
            }}
          />
        </Box>
      ) : null}
      <Box
        sx={{
          py: 1,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <div>
          <InputLabel sx={{ mr: 3, fontSize: '0.875rem' }} htmlFor='email-subject-input'>
            Subject:
          </InputLabel>
        </div>
        <Input
          fullWidth
          value={subjectValue}
          id='email-subject-input'
          onChange={e => setSubjectValue(e.target.value)}
          sx={{ '&:before, &:after': { display: 'none' }, '& .MuiInput-input': { py: 1.875 } }}
        />
      </Box>
      <EditorWrapper sx={{ '& .rdw-editor-wrapper': { border: 0 } }}>
        <ReactDraftWysiwyg
          editorState={messageValue}
          onEditorStateChange={editorState => setMessageValue(editorState)}
          placeholder='Message'
          toolbar={{
            options: ['inline', 'textAlign'],
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline', 'strikethrough']
            }
          }}
        />
      </EditorWrapper>
      <Box
        sx={{
          py: 2,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonGroup variant='contained' ref={anchorRefSendBtn} aria-label='split button'>
            <Button onClick={handleSendEmail} disabled={sendBtnOpen}>Send</Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' onClick={handlePopupCloseAndDeleteDraft} disabled={sendBtnOpen}>
            <Icon icon='mdi:delete-outline' fontSize='1.375rem' />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ComposePopup
