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
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import ListItem, { ListItemProps } from '@mui/material/ListItem'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'


import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'

import TextField from '@mui/material/TextField'
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Email App Component Imports
import { setTimeout } from 'timers'
import DriveDetail from './EmailDetail'

import Pagination from '@mui/material/Pagination'
import { useRouter } from 'next/router'

import toast from 'react-hot-toast'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import {
  DriveListType,
  LabelType,
  MailFoldersArrType,
  MailFoldersObjType
} from 'src/types/apps/emailTypes'
import { OptionType } from 'src/@core/components/option-menu/types'

import authConfig from 'src/configs/auth'

import { formatTimestamp} from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { TrashMultiFiles, SpamMultiFiles, StarMultiFiles, UnStarMultiFiles, ChangeMultiFilesLabel, ChangeMultiFilesFolder, GetFileCacheStatus, GetHaveToDoTask,ResetToDoTask, ActionsSubmitToBlockchain, CreateFolder } from 'src/functions/ChivesWallets'
import { TxRecordType } from 'src/types/apps/Chivesweave'

const FileItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
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

const DriveList = (props: DriveListType) => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()
  
  // ** Props
  const {
    store,
    query,
    hidden,
    dispatch,
    setQuery,
    direction,
    routeParams,
    labelColors,
    folder,
    setCurrentFile,
    driveFileOpen,
    handleSelectFile,
    setFileDetailOpen,
    handleSelectAllFile,
    paginationModel,
    handlePageChange,
    handleFolderChange,
    folderHeaderList,
    handleFolderHeaderList
  } = props

  
  const [fileCounter, setFileCounter] = useState<number>(0)

  useEffect(()=>{
    dispatch(handleSelectAllFile(false))

    updateFileCounter()

  },[paginationModel, folder])

  function updateFileCounter() {
    let fileCounterItem =0
    store && store.data && store.data.forEach((drive: TxRecordType) => {
      const TagsMap: any = {}
      drive && drive.tags && drive.tags.length > 0 && drive.tags.map( (Tag: any) => {
        TagsMap[Tag.name] = Tag.value;
      })
      const EntityType = TagsMap['Entity-Type']
      if(EntityType!="Folder") {
        fileCounterItem += 1
      }
    })
    setFileCounter(fileCounterItem)
  }
  
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isSubmitBlockchainDialog, setIsSubmitBlockchainDialog] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [isProgress, setIsProgress] = useState<boolean>(false)
  const [haveSubmitTextTip, setHaveSubmitTextTip] = useState<string>("")
  const [isHaveTaskToDo, setIsHaveTaskToDo] = useState<number>(0)
  const [haveTaskToDoNumber, setHaveTaskToDoNumber] = useState<number>(0)
  const [isHaveTaskToDoText, setIsHaveTaskToDoText] = useState<string>("")
  useEffect(()=>{
    const GetHaveToDoTaskData: number = GetHaveToDoTask()
    setHaveTaskToDoNumber(GetHaveToDoTaskData)
    setIsHaveTaskToDoText(`${t(`Submit to Blockchain`)}`)
    console.log("uploadProgress", uploadProgress)
  },[isHaveTaskToDo])

  const [isNewFolderDialog, setIsNewFolderDialog] = useState<boolean>(false)
  const [folderName, setFodlerName] = useState<string>("")
  const [folderNameParent, setFodlerNameParent] = useState<string>("Root")
  const [folderNameError, setFodlerNameError] = useState<string | null>(null)
  const handleFolderNameChange = (event: any) => {
    setFodlerName(event.target.value);
    console.log("folderName", folderName)
    if(event.target.value.length == '' || event.target.value == undefined) {
        setFodlerNameError(`${t('Folder name can not be null')}`)
    }
  };

  const auth = useAuth()
  const currentAddress = auth.currentAddress

  // ** State
  const [refresh, setRefresh] = useState<boolean>(false)

  // ** Vars
  const folders: MailFoldersArrType[] = [
    {
      name: 'draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'myfiles',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  ]

  const foldersConfig = {
    draft: {
      name: 'draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    spam: {
      name: 'spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    trash: {
      name: 'trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    myfiles: {
      name: 'myfiles',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  }

  const foldersObj: MailFoldersObjType = {
    myfiles: [foldersConfig.spam, foldersConfig.trash],
    sent: [foldersConfig.trash],
    draft: [foldersConfig.trash],
    spam: [foldersConfig.myfiles, foldersConfig.trash],
    trash: [foldersConfig.myfiles, foldersConfig.spam]
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

  const handleActionsSubmitToBlockchain = () => {
    setIsSubmitBlockchainDialog(true);
    setOpen(true);
  }

  const handleActionsSubmitToBlockchainYes: any = async () => {
    setIsProgress(true)
    const ActionsSubmitToBlockchainResult = await ActionsSubmitToBlockchain(setUploadProgress);
    console.log("ActionsSubmitToBlockchainResult", ActionsSubmitToBlockchainResult)
    if(ActionsSubmitToBlockchainResult && ActionsSubmitToBlockchainResult.id) {
      setHaveSubmitTextTip(`${t(`Submitted successfully`)}`)

      const delayExecution = setTimeout(() => {
        setOpen(false);
        setIsSubmitBlockchainDialog(false);
        setIsProgress(false);
        setIsHaveTaskToDo(isHaveTaskToDo + 1);
        toast.success(t(`Submitted successfully`), {
          duration: 2000
        })
      }, 2000);

      return () => clearTimeout(delayExecution);
    }
  }

  const handleNoClose = () => {
    setOpen(false)
    setIsSubmitBlockchainDialog(false)
  }

  const handleCancelOperation = () => {
    ResetToDoTask();
    setIsHaveTaskToDo(isHaveTaskToDo + 1);
  }

  const handleCreateFolderOperation = () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
      toast.success(t(`Please create a wallet first`), {
        duration: 4000
      })
      router.push("/mywallets");
      
      return
    }
    setOpen(true)
    setIsNewFolderDialog(true)
  }

  const handleCreateFolderSubmit = () => {
    if(folderName=="") {
      setFodlerNameError(`${t('Folder name can not be null')}`)
      setFodlerNameParent("Root")
    }
    else {
      setOpen(false)
      setIsNewFolderDialog(false)
      CreateFolder(folderName, folderNameParent)
      setFodlerName("")
      setFodlerNameError(null)
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      toast.success(t(`Save to drafts`), {
        duration: 2000
      })
    }
  }

  const handleRefreshDriveClick = () => {
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
    store && store.folder && store.folder['Root'] && store.folder['Root'].map((Item: any) => {
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
    routeParams,
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
      {isSubmitBlockchainDialog == true ? 
        <Fragment>
          <Dialog
              open={open}
              disableEscapeKeyDown
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              >
              <DialogTitle id='alert-dialog-title'>{`${t(`Submit to Blockchain`)}`}</DialogTitle>
              <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    {`${t(`Would you like to submit your operations to the blockchain? This process may take 3-5 minutes.`)}`}
                  </DialogContentText>
              </DialogContent>
              <DialogActions className='dialog-actions-dense'>
                  {isProgress == true && haveSubmitTextTip == "" ? 
                    <Fragment>
                      <CircularProgress disableShrink sx={{ m: 6 }} />
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  {isProgress == true && haveSubmitTextTip != "" ? 
                    <Fragment>
                      <Typography
                              sx={{
                                mr: 4,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }}
                            >
                              {haveSubmitTextTip}
                            </Typography>
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  {isProgress == false ? 
                    <Fragment>
                      <Button onClick={handleActionsSubmitToBlockchainYes} color="error" size='large' variant='contained' >{`${t(`Yes`)}`}</Button>
                      <Button onClick={handleNoClose} color="primary">{`${t(`No`)}`}</Button>
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  
              </DialogActions>
          </Dialog>
        </Fragment>
      :
      <Fragment></Fragment>
      }
      {isNewFolderDialog == true ? 
        <Fragment>
          <Dialog
              open={open}
              disableEscapeKeyDown
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              >
              <DialogTitle id='alert-dialog-title'>{`${t(`Create Folder`)}`}</DialogTitle>
              <DialogContent>
                  <DialogContentText id='alert-dialog-description' sx={{py: 2}}>
                    <TextField
                        fullWidth
                        label={`${t('FolderName')}`}
                        placeholder={`${t('FolderName')}`}
                        value={folderName}
                        onChange={handleFolderNameChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                  <Icon icon='mdi:folder-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!folderNameError}
                        helperText={folderNameError}
                    />
                  </DialogContentText>
                  {`${t('After creating the folder, you need to manually submit it to the blockchain network')}`}
              </DialogContent>
              <DialogActions className='dialog-actions-dense'>
                  {isProgress == true && haveSubmitTextTip == "" ? 
                    <Fragment>
                      <CircularProgress disableShrink sx={{ m: 6 }} />
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  {isProgress == true && haveSubmitTextTip != "" ? 
                    <Fragment>
                      <Typography
                              sx={{
                                mr: 4,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }}
                            >
                              {haveSubmitTextTip}
                            </Typography>
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  {isProgress == false ? 
                    <Fragment>
                      <Button onClick={handleCreateFolderSubmit} color="error" size='large' variant='contained' >{`${t(`Submit`)}`}</Button>
                      <Button onClick={handleNoClose} color="primary">{`${t(`Cancel`)}`}</Button>
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  
              </DialogActions>
          </Dialog>
        </Fragment>
      :
      <Fragment></Fragment>
      }
      <Box sx={{ height: '100%', backgroundColor: 'background.paper' }}>
        <Box sx={{ px: 5, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {folderHeaderList && folderHeaderList.length > 0 ? 
                <Stack spacing={2}>
                  <Breadcrumbs
                    separator={<Icon icon='mingcute:right-line' fontSize='1.375rem' />}
                    aria-label="breadcrumb"
                  >
                    {folderHeaderList.map((Item: any, Index: number)=>{
                      return (
                          folderHeaderList.length == Index+1 ?
                          <Typography key="3" color="text.primary">
                            {Item.name}
                          </Typography>
                          :
                          <Link underline="hover" style={{cursor: 'pointer'}} key={Index} color="inherit" onClick={()=>handleFolderHeaderList(Item)}>
                            {Item.name}
                          </Link>
                          )
                    })}
                  </Breadcrumbs>
                </Stack>
              :
              <Input
                value={query}
                placeholder={`${t(`Search File Name`)}`}
                onChange={e => setQuery(e.target.value)}
                sx={{ width: '100%', '&:before, &:after': { display: 'none' } }}
                startAdornment={
                  <InputAdornment position='start' sx={{ color: 'text.disabled' }}>
                    <Icon icon='mdi:magnify' fontSize='1.375rem' />
                  </InputAdornment>
                }
              />
            }
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ py: 2, px: { xs: 2.5, sm: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {store && store.data && store.selectedFiles ? (
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
                  {routeParams && routeParams.initFolder !== 'Trash' && routeParams.initFolder !== 'Spam' ? (
                    <Tooltip title={`${t(`Move to Trash`)}`} arrow>
                      <IconButton onClick={()=>handleMoveToTrash(null)}>
                        <Icon icon='mdi:delete-outline' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {routeParams && routeParams.initFolder !== 'Trash' && routeParams.initFolder !== 'Spam' ? (
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
              {haveTaskToDoNumber && haveTaskToDoNumber>0 ?
                <Fragment>
                  <Tooltip title={isHaveTaskToDoText} arrow>
                    <Button fullWidth color={'primary'} variant={'contained'} onClick={handleActionsSubmitToBlockchain}> {isHaveTaskToDoText} ({haveTaskToDoNumber}) </Button>
                  </Tooltip>
                  <Tooltip title={`${t(`Cancel Operation`)}`} arrow>
                    <IconButton size='small' onClick={handleCancelOperation}>
                      <Icon icon='mdi-redo-variant' fontSize='1.375rem' />
                    </IconButton>
                  </Tooltip>
                </Fragment>
                :
                <Fragment>
                  <Tooltip title={`${t(`Refresh`)}`} arrow>
                    <IconButton size='small' onClick={handleRefreshDriveClick}>
                      <Icon icon='mdi:reload' fontSize='1.375rem' />
                    </IconButton>
                  </Tooltip>
                </Fragment>
              }

              {routeParams && routeParams.initFolder !== 'Trash' && routeParams.initFolder !== 'Spam' && routeParams.initFolder !== 'Star' ? (
                <Tooltip title={`${t(`Create Folder`)}`} arrow>
                  <Button variant='contained'size='small' onClick={handleCreateFolderOperation} sx={{ whiteSpace: 'nowrap' }}>
                    <Icon icon='mdi:plus' />
                    {`${t(`Create Folder`)}`}
                  </Button>
                </Tooltip>
              ) : null}
              
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 12rem)' }}>
          <ScrollWrapper hidden={hidden}>
            {store && store.data && store.data.length ? (
              <List sx={{ p: 0 }}>
                {store.data.map((drive: TxRecordType) => {
                  const TagsMap: any = {}
                  drive && drive.tags && drive.tags.length > 0 && drive.tags.map( (Tag: any) => {
                    TagsMap[Tag.name] = Tag.value;
                  })
                  const EntityType = TagsMap['Entity-Type']
                  const EntityTarget = TagsMap['Entity-Target']
                  const FullStatusRS: any = GetFileCacheStatus(drive)
                  const FileCacheStatus: any = FullStatusRS['CacheStatus']
                  const FileFullStatus: any = FullStatusRS['FullStatus']
                  let IsFileDisabled = false
                  if(FileCacheStatus.Folder == "Trash" || FileCacheStatus.Folder == "Spam" || (FileCacheStatus.Folder!=undefined && FileCacheStatus.Folder!="") ) {
                    IsFileDisabled = true
                  }

                  return (
                    <FileItem
                      key={drive.id}
                      sx={{ backgroundColor: true ? 'action.hover' : 'background.paper' }}
                      onClick={() => {
                        if(EntityType == "Folder") {
                          if(IsFileDisabled) {
                          }
                          else {
                            console.log("drive",drive)
                            handleFolderChange(drive.id)
                            handleFolderHeaderList({'name':EntityTarget, 'value':drive.id})
                          }
                        }
                        else {
                          if(IsFileDisabled) {
                          }
                          else {
                            setFileDetailOpen(true)
                            dispatch(setCurrentFile(drive))
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
                            onChange={() => dispatch(handleSelectFile(drive.id))}
                            checked={store.selectedFiles.includes(drive.id) || false}
                            disabled={( IsFileDisabled || EntityType == "Folder" )}
                          />
                          <IconButton
                            size='small'
                            onClick={e => handleStarDrive(e, drive.id, !FileFullStatus['Star'])}
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
                              src={`${authConfig.backEndApi}/${drive.id}/thumbnail`}
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
                              {TagsMap['File-Name']}
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
                          {formatTimestamp(drive.block.timestamp)}
                        </Typography>
                      </Box>
                    </FileItem>
                  )
                })}

              </List>
            ) : (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
                <Icon icon='mdi:alert-circle-outline' fontSize={20} />
                <Typography>{`${t(`No Files Found`)}`}</Typography>
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
        <Box sx={{ px: 5, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
              <Pagination count={Number(store?.allPages)} variant='outlined' color='primary' page={paginationModel.page} onChange={handlePageChange} siblingCount={2} boundaryCount={3} />
            </Grid>
          </Box>
        </Box>

      </Box>

      {/* @ts-ignore */}
      <DriveDetail {...driveDetailsProps} />
    </Box>
  )
}

export default DriveList
