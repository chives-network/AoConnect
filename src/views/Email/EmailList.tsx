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
import DriveDetail from './EmailDetail'

import Pagination from '@mui/material/Pagination'

// ** Types
import {
  EmailListType,
  LabelType,
  MailFoldersArrType,
  MailFoldersObjType
} from 'src/types/apps/emailTypes'

import { OptionType } from 'src/@core/components/option-menu/types'

import { formatTimestamp} from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetAppAvatarModId } from 'src/functions/AoConnect/MsgReminder'

import { TrashMultiFiles, SpamMultiFiles, StarMultiFiles, UnStarMultiFiles, ChangeMultiFilesLabel, ChangeMultiFilesFolder, GetFileCacheStatus } from 'src/functions/ChivesWallets'
import { TxRecordType } from 'src/types/apps/Chivesweave'

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
    dispatch,
    setQuery,
    direction,
    labelColors,
    folder,
    setFolder,
    setCurrentFile,
    driveFileOpen,
    handleSelectFile,
    setFileDetailOpen,
    handleSelectAllFile,
    paginationModel,
    handlePageChange,
    handleFolderChange,
    loading,
    noEmailText
  } = props

  
  const [fileCounter, setFileCounter] = useState<number>(0)

  useEffect(()=>{
    dispatch(handleSelectAllFile(false))

    updateFileCounter()

  },[paginationModel, folder])

  function updateFileCounter() {
    let fileCounterItem =0
    store && store.data && store.data.forEach((email: any) => {
      const TagsMap: any = {}
      email && email.tags && email.tags.length > 0 && email.tags.map( (Tag: any) => {
        TagsMap[Tag.name] = Tag.value;
      })
      const EntityType = TagsMap['Entity-Type']
      if(EntityType!="Folder") {
        fileCounterItem += 1
      }
    })
    setFileCounter(fileCounterItem)
  }
  
  const [isHaveTaskToDo, setIsHaveTaskToDo] = useState<number>(0)

  // ** State
  const [refresh, setRefresh] = useState<boolean>(false)

  // ** Vars
  const folders: MailFoldersArrType[] = [
    {
      name: 'Draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'Spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'Trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'Inbox',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  ]

  const foldersConfig = {
    Draft: {
      name: 'Draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    Spam: {
      name: 'Spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    Trash: {
      name: 'Trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    Inbox: {
      name: 'Inbox',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  }

  const foldersObj: MailFoldersObjType = {
    Inbox: [foldersConfig.Spam, foldersConfig.Trash],
    Sent: [foldersConfig.Trash],
    Draft: [foldersConfig.Trash],
    Spam: [foldersConfig.Inbox, foldersConfig.Trash],
    Trash: [foldersConfig.Inbox, foldersConfig.Spam]
  }

  const handleMoveToTrash = (id: string | null) => {
    console.log("store.selectedFiles", store)
    if( id == null && store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      TrashMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
    if( id && id.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => id == Item.id);
      TrashMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleMoveToSpam = (id: string | null) => {
    if( id == null && store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      SpamMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
    if( id && id.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => id == Item.id);
      SpamMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleStarDrive = (e: SyntheticEvent, id: string, value: boolean) => {
    e.stopPropagation()
    if(value) {
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => Item.id == id );
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      StarMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
    else {
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => Item.id == id );
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      UnStarMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleLabelUpdate = (id: string | null, label: LabelType) => {
    if( id == null && store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      ChangeMultiFilesLabel(TargetFiles, label);
      dispatch(handleSelectAllFile(false))
    }
    if( id && id.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => id == Item.id);
      ChangeMultiFilesLabel(TargetFiles, label);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleFolderUpdate = (id: string | null, folder: any) => {
    if( id == null && store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      ChangeMultiFilesFolder(TargetFiles, folder.id, folder);
      dispatch(handleSelectAllFile(false))
    }
    if( id && id.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => id == Item.id);
      ChangeMultiFilesFolder(TargetFiles, folder.id, folder);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleRefreshEmailClick = () => {
    setIsHaveTaskToDo(isHaveTaskToDo + 1);
    setRefresh(true)
    setTimeout(() => setRefresh(false), 1000)
  }

  const handleLabelsMenu = () => {
    const array: OptionType[] = []
    Object.entries(labelColors).map(([key, value]: any) => {
      array.push({
        text: <Typography sx={{ textTransform: 'capitalize' }}>{key}</Typography>,
        icon: (
          <Box component='span' sx={{ mr: 2, color: `${value}.main` }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
          </Box>
        ),
        menuItemProps: {
          onClick: () => {
            handleLabelUpdate(null, key as LabelType)
            dispatch(handleSelectAllFile(false))
          }
        }
      })
    })

    return array
  }

  const handleFoldersMenu = () => {
    const array: OptionType[] = []
    store && store.folder && store.folder['Inbox'] && store.folder['Inbox'].map((Item: any) => {
      array.push({
        text: <Typography sx={{ textTransform: 'capitalize' }}>{Item.name}</Typography>,
        icon: (
          <Box component='span' sx={{ mr: 2 }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
          </Box>
        ),
        menuItemProps: {
          onClick: () => {
            handleFolderUpdate(null, Item)
            dispatch(handleSelectAllFile(false))
          }
        }
      })
    })

    return array
  }

  const driveDetailsProps = {
    hidden,
    folders,
    dispatch,
    direction,
    foldersObj,
    folder,
    setFolder,
    labelColors,
    handleStarDrive,
    driveFileOpen,
    handleLabelUpdate,
    handleFolderUpdate,
    setFileDetailOpen,
    currentFile: store && store.currentFile ? store.currentFile : null,
    handleMoveToTrash,
    handleMoveToSpam
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', '& .ps__rail-y': { zIndex: 5 } }}>
      <Box sx={{ height: '100%', backgroundColor: 'background.paper' }}>
        <Box sx={{ px: 3, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{}} >
                {folder}
              </Typography>
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
                  onChange={e => {
                    dispatch(handleSelectAllFile(e.target.checked))
                    updateFileCounter()
                  }}
                  checked={(store.data.length > 0 && fileCounter === store.selectedFiles.length && fileCounter > 0) }
                  indeterminate={
                    !!(
                      store.data.length &&
                      store.selectedFiles.length &&
                      store.data.length !== store.selectedFiles.length
                    )
                  }
                />
              ) : null}

              {store && store.selectedFiles.length && store.data && store.data.length ? (
                <Fragment>
                  <OptionsMenu leftAlignMenu options={handleFoldersMenu()} icon={<Icon icon='mdi:folder-outline' />} />
                  <OptionsMenu leftAlignMenu options={handleLabelsMenu()} icon={<Icon icon='mdi:label-outline' />} />
                  {folder !== 'Trash' && folder !== 'Spam' ? (
                    <Tooltip title={`${t(`Move to Trash`)}`} arrow>
                      <IconButton onClick={()=>handleMoveToTrash(null)}>
                        <Icon icon='mdi:delete-outline' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {folder !== 'Trash' && folder !== 'Spam' ? (
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
                  const TagsMap: any = {}
                  email && email.tags && email.tags.length > 0 && email.tags.map( (Tag: any) => {
                    TagsMap[Tag.name] = Tag.value;
                  })
                  const EntityType = TagsMap['Entity-Type']
                  const FullStatusRS: any = GetFileCacheStatus(email)
                  const FileCacheStatus: any = FullStatusRS['CacheStatus']
                  const FileFullStatus: any = FullStatusRS['FullStatus']
                  let IsFileDisabled = false
                  if(FileCacheStatus.Folder == "Trash" || FileCacheStatus.Folder == "Spam" || (FileCacheStatus.Folder!=undefined && FileCacheStatus.Folder!="") ) {
                    IsFileDisabled = true
                  }

                  const mailReadToggleIcon = email?.isRead ? 'mdi:email-outline' : 'mdi:email-open-outline'

                  return (
                    <EmailItem
                      key={email.Id}
                      sx={{ backgroundColor: true ? 'action.hover' : 'background.paper' }}
                      onClick={() => {
                        if(EntityType == "Folder") {
                          if(IsFileDisabled) {
                          }
                          else {
                            console.log("email",email)
                            handleFolderChange(email.Id)
                          }
                        }
                        else {
                          if(IsFileDisabled) {
                          }
                          else {
                            setFileDetailOpen(true)
                            dispatch(setCurrentFile(email))
                            setTimeout(() => {
                              dispatch(handleSelectAllFile(false))
                            }, 600)
                          }
                        }
                        
                      }}
                    >
                      <Tooltip title={(FileFullStatus.Folder == "Trash" || FileFullStatus.Folder == "Spam") ? `${t(`You cannot perform operations on files in the Trash or Spam`)}` :''} arrow>
                        <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                          
                          <Checkbox
                            onClick={e => e.stopPropagation()}
                            onChange={() => dispatch(handleSelectFile(email.Id))}
                            checked={store.selectedFiles.includes(email.Id) || false}
                            disabled={( IsFileDisabled || EntityType == "Folder" )}
                          />
                          <IconButton
                            size='small'
                            onClick={e => handleStarDrive(e, email.Id, !FileFullStatus['Star'])}
                            disabled={IsFileDisabled}
                            sx={{
                              mr: { xs: 0, sm: 3 },
                              color: FileFullStatus['Star'] ? 'warning.main' : 'text.secondary',
                              '& svg': {
                                display: { xs: 'none', sm: 'block' }
                              }
                            }}
                          >
                            <Icon icon={FileFullStatus['Star'] ? 'mdi:star' : 'mdi:star-outline'} />
                          </IconButton>
                          {FileFullStatus && FileFullStatus['Label'] && labelColors[FileFullStatus['Label']] ?
                            <Tooltip title={FileFullStatus['Label']} arrow>
                              <Box component='span' sx={{ mr: 2, ml: -2, color: `${labelColors[FileFullStatus['Label']]}.main` }}>
                                <Icon icon='mdi:circle' fontSize='0.75rem' />
                              </Box>
                            </Tooltip>
                          :
                            <Tooltip title={'No label'} arrow>
                              <Box component='span' sx={{ mr: 2, ml: -2, color: `text.secondary` }}>
                                <Icon icon='mdi:circle' fontSize='0.75rem' />
                              </Box>
                            </Tooltip>
                          }
                          
                          {EntityType == "Folder" ? 
                            <Avatar sx={{ mr: 3, width: '2rem', height: '2rem' }}>
                              <Icon icon='mdi:folder-outline' />
                            </Avatar>
                          :
                            <Avatar
                              alt={TagsMap['File-Name']}
                              src={GetAppAvatarModId(email.Id)}
                              sx={{ mr: 3, width: '2rem', height: '2rem' }}
                            />
                          }
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
                              {email.Subject}
                            </Typography>
                            <Typography noWrap variant='body2' sx={{ width: '100%' }}>
                              {email.Summary}
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
                          {formatTimestamp(Number(email.Timestamp) - (new Date().getTimezoneOffset()) * 60 * 1000)}
                        </Typography>
                      </Box>
                      <Box
                        className='mail-actions'
                        sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}
                      >
                        {email && email.folder !== 'trash' ? (
                          <Tooltip placement='top' title='Delete Mail'>
                            <IconButton
                              onClick={e => {
                                e.stopPropagation()
                              }}
                            >
                              <Icon icon='mdi:delete-outline' />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        <Tooltip placement='top' title={email.isRead ? 'Unread Mail' : 'Read Mail'}>
                          <IconButton
                            onClick={e => {
                              e.stopPropagation()
                            }}
                          >
                            <Icon icon={mailReadToggleIcon} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement='top' title='Move to Spam'>
                          <IconButton
                            onClick={e => {
                              e.stopPropagation()
                            }}
                          >
                            <Icon icon='mdi:alert-octagon-outline' />
                          </IconButton>
                        </Tooltip>
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
      <DriveDetail {...driveDetailsProps} />

      <Backdrop open={loading} style={{ zIndex: 9999, color: 'common.white' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </Box>
  )
}

export default EmailList
