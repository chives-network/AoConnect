// ** React Imports
import { Fragment, useState, SyntheticEvent, ReactNode, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Backdrop from '@mui/material/Backdrop'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import ListItem, { ListItemProps } from '@mui/material/ListItem'

import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Email App Component Imports
import { setTimeout } from 'timers'
import EmailDetail from './EmailDetail'

import Pagination from '@mui/material/Pagination'

// ** Types
import { EmailListType } from 'src/types/apps/emailTypes'

import { OptionType } from 'src/@core/components/option-menu/types'

import { formatTimestampLocalTime} from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetAppAvatarModId } from 'src/functions/AoConnect/MsgReminder'

import { GetFileCacheStatus } from 'src/functions/ChivesWallets'
import { ChivesEmailReadEmailContent } from 'src/functions/AoConnect/ChivesEmail'

import { DecryptEmailAES256GCMV1 } from 'src/functions/ChivesEncrypt'
import { ChivesEmailMoveToFolder } from 'src/functions/AoConnect/ChivesEmail'
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'



const EmailItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(1.9),
  paddingBottom: theme.spacing(1.45),
  justifyContent: 'space-between',
  transition: 'border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  '&:not(:first-of-type)': {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  '&:hover': {
    zIndex: 2,
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
    '& .mail-actions': { display: 'flex' },
    '& .mail-info-right': { display: 'none' },
    '& + .MuiListItem-root': { borderColor: 'transparent' }
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}))

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const EmailList = (props: EmailListType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const {
    store,
    query,
    hidden,
    setQuery,
    direction,
    EmailCategoriesColors,
    folder,
    currentEmail,
    setCurrentEmail,
    emailDetailWindowOpen,
    setEmailDetailWindowOpen,
    paginationModel,
    handlePageChange,
    loading,
    setLoading,
    noEmailText,
    currentWallet,
    currentAoAddress,
    counter,
    setCounter,
    setComposeOpen
  } = props

  const [starredList, setStarredList] = useState<any>({})
  const [selectedEmails, setSelectedEmails] = useState<any>({})
  const [haveReadEmails, setHaveReadEmails] = useState<any>({})
  
  useEffect(()=>{
    setStarredList({})
    setSelectedEmails({})
  },[paginationModel, folder])

  const recordsUnRead = store.recordsUnRead

  // ** State
  const [refresh, setRefresh] = useState<boolean>(false)

  const handleMoveToFolder = async (id: string | null, oldFolder: string, newFolder: string) => {
    console.log("selectedEmails", selectedEmails);
    setLoading(true)
    if (id === null && store.data && store.data.length > 0) {
      await Promise.all(Object.keys(selectedEmails).map(async (EmailId: string) => {
        const ChivesEmailMoveToFolderData = await ChivesEmailMoveToFolder(currentWallet.jwk, authConfig.AoConnectChivesEmailServerData, EmailId, oldFolder, newFolder);
        console.log("ChivesEmailMoveToFolderData", ChivesEmailMoveToFolderData);
      }));
    }
    if (id && id.length > 0 && store.data && store.data.length > 0) {
      const ChivesEmailMoveToFolderData = await ChivesEmailMoveToFolder(currentWallet.jwk, authConfig.AoConnectChivesEmailServerData, id, oldFolder, newFolder);
      console.log("ChivesEmailMoveToFolderData", ChivesEmailMoveToFolderData);
    }
    setSelectedEmails({})
    setCounter(counter + 1);
  }

  const handleReadEmailContent = async (id: string | null, folder: string) => {
    if (id && id.length == 43 && currentWallet) {
      setHaveReadEmails((prevState: any)=>({
        ...prevState,
        [id]: true
      }))
      const ChivesEmailReadEmailContentData = await ChivesEmailReadEmailContent(currentWallet.jwk, authConfig.AoConnectChivesEmailServerData, id, folder);
      console.log("ChivesEmailReadEmailContentData", ChivesEmailReadEmailContentData)
    }
  }

  const handleMoveToTrash = async (id: string | null) => {
    handleMoveToFolder(id, folder, "Trash")
    toast.success(t('Have moved to trash.') as string, { duration: 2500 })
    setSelectedEmails({})
  }
  
  const handleMoveToSpam = async (id: string | null) => {
    handleMoveToFolder(id, folder, "Spam")
    toast.success(t('Have moved to spam.') as string, { duration: 2500 })
    setSelectedEmails({})
  }

  const handleStarEmail = async (e: SyntheticEvent, id: string, value: boolean) => {
    e.stopPropagation()
    if(value && id && id.length == 43) {
      setStarredList((prevState: any)=>({
        ...prevState,
        [id]: true
      }))
      handleMoveToFolder(id, folder, "Starred")
      toast.success(t('Have moved to starred.') as string, { duration: 2500 })
    }
    else {
      setStarredList((prevState: any)=>({
        ...prevState,
        [id]: false
      }))
    }
    setSelectedEmails({})
  }

  const handleRefreshEmailClick = () => {
    setRefresh(true)
    setTimeout(() => setRefresh(false), 1000)
  }

  const handleCategoriesMenu = () => {
    const array: OptionType[] = []
    Object.entries(EmailCategoriesColors).map(([key, value]: any) => {
      array.push({
        text: <Typography sx={{ textTransform: 'capitalize' }}>{key}</Typography>,
        icon: (
          <Box component='span' sx={{ mr: 2, color: `${value}.main` }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
          </Box>
        ),
        menuItemProps: {
          onClick: () => {
            handleMoveToFolder(null, folder, key)
          }
        }
      })
    })

    return array
  }

  const emailDetailsProps = {
    currentEmail,
    hidden,
    direction,
    EmailCategoriesColors,
    folder,
    handleStarEmail,
    emailDetailWindowOpen,
    setEmailDetailWindowOpen,
    handleMoveToTrash,
    handleMoveToSpam,
    handleMoveToFolder,
    currentWallet,
    currentAoAddress,
    setHaveReadEmails,
    handleReadEmailContent,
    setComposeOpen,
    setCurrentEmail
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', '& .ps__rail-y': { zIndex: 5 } }}>
      <Box sx={{ height: '100%', backgroundColor: 'background.paper' }}>
        <Box sx={{ px: 3, py: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box p={2} display="flex" alignItems="center">
              <Typography sx={{mr: 2}} >
                {folder}
              </Typography>
              <Typography variant="body2" >
              Address: {currentAoAddress}
              </Typography>
              <IconButton sx={{mt: 1, ml: 1}} aria-label='capture screenshot' color='secondary' size='small' onClick={() => {
                  navigator.clipboard.writeText(currentAoAddress);
                  toast.success(t('Copied success') as string, { duration: 1000 });
              }}>
                  <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Input
                size="small"
                disabled
                value={query}
                placeholder={`${t(`Search Not Finished`)}`}
                onChange={e => setQuery(e.target.value)}
                sx={{ width: '200px', '&:before, &:after': { display: 'none' } }}
                startAdornment={
                  <InputAdornment position='start' sx={{ color: 'text.disabled' }}>
                    <Icon icon='mdi:magnify' fontSize='1.375rem' />
                  </InputAdornment>
                }
              />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ py: 1, px: { xs: 2.5, sm: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {store && store.data && store.data.length ? (
                <Checkbox
                  checked={(store.data.length > 0 && Object.keys(selectedEmails).length > 0 && Object.keys(selectedEmails).length == store.data.length) }
                  onChange={() => {
                    if(store.data.length > 0 && selectedEmails && Object.keys(selectedEmails) < store.data.length) {
                      const selectedTemp: any = {}
                      store.data.map((item: any)=>{
                        selectedTemp[item.Id] = true
                      })
                      setSelectedEmails(selectedTemp)
                    }
                    else {
                      setSelectedEmails({})
                    }
                  }}
                  indeterminate={
                    !!(
                      store.data &&
                      store.data.length > 0 &&
                      Object.keys(selectedEmails).length > 0 &&
                      store.data.length !== Object.keys(selectedEmails).length
                    )
                  }
                />
              ) : null}

              {selectedEmails && Object.keys(selectedEmails).length > 0 && store.data && store.data.length ? (
                <Fragment>
                  <OptionsMenu leftAlignMenu options={handleCategoriesMenu()} icon={<Icon icon='mdi:label-outline' />} />
                  {folder !== 'Trash' && folder !== 'Spam' ? (
                    <Tooltip title={`${t(`Move to Trash`)}`} arrow>
                      <IconButton onClick={()=>handleMoveToTrash(null)}>
                        <Icon icon='mdi:delete-outline' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {folder !== 'Sent' && folder !== 'Spam' ? (
                    <Tooltip title={`${t(`Move to Spam`)}`} arrow>
                      <IconButton onClick={()=>handleMoveToSpam(null)}>
                        <Icon icon='mdi:alert-octagon-outline' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Fragment>
              ) : null}


            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Fragment>
                <Tooltip title={`${t(`Refresh`)}`} arrow>
                  <IconButton size='small' onClick={handleRefreshEmailClick}>
                    <Icon icon='mdi:reload' fontSize='1.375rem' />
                  </IconButton>
                </Tooltip>
              </Fragment>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 9.75rem)' }}>
          <ScrollWrapper hidden={hidden}>
            {store && store.data && store.data.length ? (
              <List sx={{ p: 0, m: 1 }}>
                {store.data.map((email: any) => {
                  let Subject = email.Subject
                  let Summary = email.Summary
                  let Content = email.Content
                  switch(email.Encrypted) {
                    case 'V1':
                      Subject = DecryptEmailAES256GCMV1(email.Subject, email.To + email.From)
                      Summary = DecryptEmailAES256GCMV1(email.Summary, email.To + email.From)
                      Content = DecryptEmailAES256GCMV1(email.Content, email.To + email.From)
                      break;
                    default:
                      break;
                  }
                  const FullStatusRS: any = GetFileCacheStatus(email)
                  const FileCacheStatus: any = FullStatusRS['CacheStatus']
                  const FileFullStatus: any = FullStatusRS['FullStatus']
                  let IsFileDisabled = false
                  if(FileCacheStatus.Folder == "Trash" || FileCacheStatus.Folder == "Spam" || (FileCacheStatus.Folder!=undefined && FileCacheStatus.Folder!="") ) {
                    IsFileDisabled = true
                  }

                  const mailReadToggleIcon = recordsUnRead.includes(email.Id) && !haveReadEmails[email.Id] ? 'mdi:email-outline' : 'mdi:email-open-outline'

                  return (
                    <EmailItem
                      key={email.Id}
                      sx={{ backgroundColor: recordsUnRead.includes(email.Id) && !haveReadEmails[email.Id] ? 'action.hover' : 'background.paper' }}
                      onClick={() => {
                        setEmailDetailWindowOpen(true)
                        setCurrentEmail({...email, Subject, Summary, Content})
                      }}
                    >
                      <Tooltip title={(FileFullStatus.Folder == "Trash" || FileFullStatus.Folder == "Spam") ? `${t(`You cannot perform operations on files in the Trash or Spam`)}` :''} arrow>
                        <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                          
                          <Checkbox
                            onClick={e => e.stopPropagation()}
                            onChange={() => {
                              if(email.Id && selectedEmails && selectedEmails[email.Id] == true ) {
                                setSelectedEmails((prevState: any)=>({
                                  ...prevState,
                                  [email.Id]: false
                                }))
                              }
                              else {
                                setSelectedEmails((prevState: any)=>({
                                  ...prevState,
                                  [email.Id]: true
                                }))
                              }
                            }}
                            checked={selectedEmails && selectedEmails[email.Id] == true ? true : false}
                          />
                          <IconButton
                            size='small'
                            onClick={e => handleStarEmail(e, email.Id, !starredList[email.Id])}
                            disabled={IsFileDisabled}
                            sx={{
                              mr: { xs: 0, sm: 3 },
                              color: starredList[email.Id] ? 'warning.main' : 'text.secondary',
                              '& svg': {
                                display: { xs: 'none', sm: 'block' }
                              }
                            }}
                          >
                            <Icon icon={starredList[email.Id] ? 'mdi:star' : 'mdi:star-outline'} />
                          </IconButton>

                          <Avatar
                            alt={email.From}
                            src={GetAppAvatarModId(email.From)}
                            sx={{ mr: 3, width: '2rem', height: '2rem' }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              overflow: 'hidden',
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { xs: 'flex-start', sm: 'center' }
                            }}
                          >
                            <Typography
                              sx={{
                                mr: 4,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset'],
                                color: IsFileDisabled ? 'text.disabled' : ''
                              }}
                            >
                              {Subject}
                            </Typography>
                            <Typography noWrap variant='body2' sx={{ width: '100%' }}>
                              {Summary}
                            </Typography>
                          </Box>
                        </Box>
                      </Tooltip>

                      <Box
                        className='mail-info-right'
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                      >
                        <Typography
                          variant='caption'
                          sx={{ minWidth: '50px', textAlign: 'right', whiteSpace: 'nowrap', color: 'text.disabled' }}
                        >
                          {formatTimestampLocalTime(Number(email.Timestamp))}
                        </Typography>
                      </Box>
                      <Box
                        className='mail-actions'
                        sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}
                      >
                        {email && folder !== 'Trash' ? (
                          <Tooltip placement='top' title='Delete Mail'>
                            <IconButton
                              onClick={e => {
                                e.stopPropagation()
                                handleMoveToTrash(email.Id)
                              }}
                            >
                              <Icon icon='mdi:delete-outline' />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        {email && folder !== 'Sent' ? (
                          <Tooltip placement='top' title={recordsUnRead.includes(email.Id) && !haveReadEmails[email.Id] ? t('Unread Mail') : t('Read Mail')}>
                            <IconButton
                              onClick={e => {
                                e.stopPropagation()
                                if(recordsUnRead.includes(email.Id) && !haveReadEmails[email.Id]) {
                                  handleReadEmailContent(email.Id, folder)
                                }
                              }}
                            >
                              <Icon icon={mailReadToggleIcon} />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        

                        {email && folder !== 'Spam' && folder !== 'Sent' ? (
                          <Tooltip placement='top' title='Move to Spam'>
                            <IconButton
                              onClick={e => {
                                e.stopPropagation()
                                handleMoveToSpam(email.Id)
                              }}
                            >
                              <Icon icon='mdi:alert-octagon-outline' />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                      </Box>
                    </EmailItem>
                  )
                })}

              </List>
            ) : (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
                <Icon icon='mdi:alert-circle-outline' fontSize={20} />
                <Typography>{`${t(noEmailText)}`}</Typography>
              </Box>
            )}
          </ScrollWrapper>
          <Backdrop
            open={refresh}
            onClick={() => setRefresh(false)}
            sx={{
              zIndex: 5,
              position: 'absolute',
              color: 'common.white',
              backgroundColor: 'action.disabledBackground'
            }}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </Box>
        
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ px: 3, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ py: 2 }}>
              <Pagination count={Number(store?.allPages)} variant='outlined' color='primary' page={paginationModel.page} onChange={handlePageChange} siblingCount={2} boundaryCount={3} />
            </Grid>
          </Box>
        </Box>

      </Box>

      {/* @ts-ignore */}
      <EmailDetail {...emailDetailsProps} />

      <Backdrop open={loading} style={{ zIndex: 9999, color: 'common.white' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </Box>
  )
}

export default EmailList
