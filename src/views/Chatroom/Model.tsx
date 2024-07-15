// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { GetChatroomAvatar } from 'src/functions/AoConnect/ChivesChat'

const AppModel = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()

  // ** Props
  const {
    app,
    loading,
    loadingText,
    show,
    setShow
  } = props

  
  const auth = useAuth()
  const currentAddress = auth.currentAddress

  const ChatroomAvatar = GetChatroomAvatar('Chives')

  const renderContent = () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
            <Card sx={{ px: 3, pt: 1}}>
              {true ? (
                <Fragment>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box p={2} display="flex" alignItems="center">
                        <Typography variant="h6" sx={{ marginRight: '8px' }}>{t('Chatroom')}</Typography>
                        <Typography variant="body2">Address: {currentAddress}</Typography>
                        <IconButton sx={{mt: 1, ml: 1}} aria-label='capture screenshot' color='secondary' size='small' onClick={() => {
                            navigator.clipboard.writeText(currentAddress);
                            toast.success(t('Copied success') as string, { duration: 1000 });
                        }}>
                            <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: 2, mb: 2}}>
                    {app && app.map((item: any, index: number) => (
                      <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
                        <Box position="relative" sx={{mb: 2, mr: 2}}>
                          <CardMedia image={`/images/cardmedia/cardmedia-${theme.palette.mode}.png`} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1 }}/>
                          <Box position="absolute" top={10} left={5} m={1} px={0.8} borderRadius={1}
                            onClick={()=>{
                              router.push('/chat/chat/' + item.id)
                            }}
                            sx={{cursor: 'pointer'}}
                          >
                            <Box display="flex" alignItems="center">
                            <Avatar src={ChatroomAvatar} sx={{ mr: 3, width: 35, height: 35 }} />
                              <Typography 
                                  sx={{
                                      fontWeight: 500,
                                      lineHeight: 1.71,
                                      letterSpacing: '0.22px',
                                      fontSize: '1rem !important',
                                      maxWidth: '200px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flexGrow: 1,
                                  }}
                              >
                                  {item.name}
                              </Typography>
                            </Box>
                          </Box>
                          <Box position="absolute" top={55} left={5} m={1} px={0.8} borderRadius={1} 
                            sx={{ 
                              cursor: 'pointer',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                            onClick={()=>{
                              router.push('/chat/chat/' + item.id)
                            }}
                            >
                            <Typography variant='caption'>{item.intro}</Typography>
                          </Box>
                          <Box position="absolute" bottom={0} left={1} m={1} px={0.8}>
                            <Button disabled variant="text" size="small" startIcon={<Icon icon={'mdi:users-outline'} />} >
                              {t('Members')}
                            </Button>
                          </Box>
                          <Box position="absolute" top={2} right={1} m={1} px={0.8}>
                            <Button variant="text" size="small" startIcon={<Icon icon='material-symbols:chat-outline' />} 
                              onClick={()=>{
                                router.push('/chat/chat/' + item.id)
                              }}
                              >
                              {t('Chat')}
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                    {app && app.length == 0 && loading == false?
                    <Grid 
                      item 
                      key='0' 
                      xs={12}
                      sx={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      <Typography variant="body1">{t('No Data')}</Typography>
                    </Grid>
                    :
                    null}
                  </Grid>
                </Fragment>
              ) : (
                <Fragment></Fragment>
              )}
            </Card>
            {loading ?
            <Dialog
              open={show}
              onClose={() => setShow(false)}
            >
              <DialogContent sx={{ position: 'relative' }}>
                <Container>
                  <Grid container spacing={2}>
                    <Grid item xs={8} sx={{}}>
                      <Box sx={{ ml: 6, display: 'flex', alignItems: 'center', flexDirection: 'column', whiteSpace: 'nowrap' }}>
                        <CircularProgress sx={{ mb: 4 }} />
                        <Typography>{t(loadingText) as string}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </DialogContent>
            </Dialog>
            :
            null}
          </Grid>
        </Grid>
      )
  }

  return renderContent()
}

export default AppModel
