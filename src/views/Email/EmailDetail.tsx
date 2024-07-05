// ** React Imports
import { Fragment, ReactNode, useEffect } from 'react'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Custom Components Imports
import Sidebar from 'src/@core/components/sidebar'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Types
import { OptionType } from 'src/@core/components/option-menu/types'
import { EmailDetailType } from 'src/types/apps/emailTypes'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { formatTimestampLocalTime } from 'src/configs/functions';

import { GetFileCacheStatus } from 'src/functions/ChivesWallets'

import { GetAppAvatarModId } from 'src/functions/AoConnect/MsgReminder'

import { ChivesEmailReadEmailContent } from 'src/functions/AoConnect/ChivesEmail'

import authConfig from 'src/configs/auth'

const DriveDetail = (props: EmailDetailType) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    currentEmail,
    hidden,
    direction,
    labelColors,
    folder,
    handleStarDrive,
    driveFileOpen,
    setFileDetailOpen,
    handleMoveToTrash,
    handleMoveToSpam,
    handleMoveToFolder,
    currentWallet,
    currentAoAddress
  } = props

  const FullStatusRS: any = GetFileCacheStatus(currentEmail)
  const FileFullStatus: any = FullStatusRS['FullStatus']

  useEffect(() => {
    const fetchData = async () => {
      if (currentEmail && currentEmail.Id && currentWallet) {
        const ChivesEmailReadEmailContentData = await ChivesEmailReadEmailContent(currentWallet.jwk, authConfig.AoConnectChivesEmailServerData, currentAoAddress, currentEmail.Id, folder);
        console.log("ChivesEmailReadEmailContentData", ChivesEmailReadEmailContentData)
      }
    };
  
    fetchData();
  }, [currentEmail]);
  

  // ** Hook
  const { settings } = useSettings()

  const handleMoveToTrashcurrentEmail = () => {
    handleMoveToTrash(currentEmail.Id)
    setFileDetailOpen(false)
  }

  const handleMoveToSpamcurrentEmail = () => {
    handleMoveToSpam(currentEmail.Id)
    setFileDetailOpen(false)
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
            handleMoveToFolder(null, folder, key)
          }
        }
      })
    })

    return array
  }

  const prevMailIcon = direction === 'rtl' ? 'mdi:chevron-right' : 'mdi:chevron-left'
  const goBackIcon = prevMailIcon
  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  return (
    <Sidebar
      hideBackdrop
      direction='right'
      show={driveFileOpen}
      sx={{ zIndex: 3, width: '100%', overflow: 'hidden' }}
      onClose={() => {
        setFileDetailOpen(false)        
      }}
    >
      {currentEmail && currentEmail ? (
        <Fragment>
          <Box
            sx={{
              px: 2,
              py: 2,
              backgroundColor: 'background.paper',
              borderBottom: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: ['flex-start', 'center'], justifyContent: 'space-between' }}>
              <Box
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}
              >
                <IconButton
                  size='small'
                  sx={{ mr: 2 }}
                  onClick={() => {
                    setFileDetailOpen(false)                    
                  }}
                >
                  <Icon icon={goBackIcon} fontSize='2rem' />
                </IconButton>
                <Box
                  sx={{
                    display: 'flex',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexDirection: ['column', 'row']
                  }}
                >
                  <Typography noWrap sx={{ mr: 2, fontWeight: 500 }}>
                    {currentEmail.Subject}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {folder !== 'trash' ? (
                    <IconButton size='small' onClick={handleMoveToTrashcurrentEmail}>
                      <Icon icon='mdi:delete-outline' fontSize='1.375rem' />
                    </IconButton>
                  ) : null}
                  <IconButton size='small' onClick={handleMoveToSpamcurrentEmail}>
                    <Icon icon='mdi:alert-circle-outline' fontSize='1.375rem' />
                  </IconButton>
                  <OptionsMenu
                    leftAlignMenu
                    options={handleLabelsMenu()}
                    iconButtonProps={{ size: 'small' }}
                    icon={<Icon icon='mdi:label-outline' fontSize='1.375rem' />}
                  />
                </Box>
              <div>
                <IconButton
                  size='small'
                  onClick={e => handleStarDrive(e, currentEmail.Id, !FileFullStatus['Star'])}
                  sx={{ ...(true ? { color: FileFullStatus['Star'] ? 'warning.main' : 'text.secondary' } : {}) }}
                >
                  <Icon icon={FileFullStatus['Star'] ? 'mdi:star' : 'mdi:star-outline'} fontSize='1.375rem'/>
                </IconButton>
              </div>
              </Box>
            </Box>
          </Box>
          <Box sx={{ height: 'calc(100% - 3rem)', backgroundColor: 'action.hover' }}>
            <ScrollWrapper>
              <Box
                sx={{
                  py: 2,
                  px: 2,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    width: '100%',
                    borderRadius: 1,
                    overflow: 'visible',
                    position: 'relative',
                    backgroundColor: 'background.paper',
                    boxShadow: settings.skin === 'bordered' ? 0 : 6,
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          alt={currentEmail.From}
                          src={GetAppAvatarModId(currentEmail.From)}
                          sx={{ width: '2.375rem', height: '2.375rem', mr: 3 }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontWeight: 500 }}>{currentEmail.Subject}</Typography>
                          <Typography variant='body2'>{currentEmail.From}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='caption' sx={{ mr: 3 }}>
                          {formatTimestampLocalTime(currentEmail.Timestamp)}
                        </Typography>
                        {false ? (
                          <IconButton size='small'>
                            <Icon icon='mdi:attachment' fontSize='1.375rem' />
                          </IconButton>
                        ) : null}
                        <OptionsMenu
                          iconButtonProps={{ size: 'small' }}
                          iconProps={{ fontSize: '1.375rem' }}
                          options={[
                            {
                              text: t('Reply'),
                              menuItemProps: { sx: { '& svg': { mr: 2 } } },
                              icon: <Icon icon='mdi:share-outline' fontSize={20} />
                            },
                            {
                              text: t('Forward'),
                              menuItemProps: { sx: { '& svg': { mr: 2 } } },
                              icon: <Icon icon='mdi:reply-outline' fontSize={20} />
                            }
                          ]}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ m: '0 !important' }} />
                  <Box sx={{ p: 4, pt: 4 }}>
                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                    {currentEmail.Content}                                 
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 5,
                    width: '100%',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    boxShadow: settings.skin === 'bordered' ? 0 : 6
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>
                    Click here to{' '}
                    <Typography
                      component='span'
                      sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'inherit' }}
                    >
                      {t('Reply')}
                    </Typography>{' '}
                    or{' '}
                    <Typography
                      component='span'
                      sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'inherit' }}
                    >
                      {t('Forward')}
                    </Typography>
                  </Typography>
                </Box>

              </Box>
            </ScrollWrapper>
          </Box>
        </Fragment>
      ) : null}
    </Sidebar>
  )
}

export default DriveDetail
