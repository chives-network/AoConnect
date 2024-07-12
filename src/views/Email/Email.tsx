// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { RootState, AppDispatch } from 'src/store'

// ** Email App Component Imports
import EmailList from 'src/views/Email/EmailList'
import SidebarLeft from 'src/views/Email/SidebarLeft'
import ComposePopup from 'src/views/Email/ComposePopup'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Actions
import { fetchData } from 'src/store/apps/email'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Variables
const EmailCategoriesColors: any = {
  Important: 'error',
  Social: 'info',
  Updates: 'success',
  Forums: 'primary',
  Promotions: 'warning'
}

const EmailAppLayout = () => {
  // ** Hook
  const { t } = useTranslation()

  // ** States
  const [query, setQuery] = useState<string>('')
  const [emailDetailWindowOpen, setEmailDetailWindowOpen] = useState<boolean>(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [folder, setFolder] = useState<string>('Inbox')
  const [loading, setLoading] = useState<boolean>(false)
  const [noEmailText, setNoEmailText] = useState<string>("No Email")
  const [currentEmail, setCurrentEmail] = useState<any>(null)
  const [counter, setCounter] = useState<number>(0)


  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))

  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : '100%'
  const [composeTitle, setComposeTitle] = useState<string>(`${t(`Compose`)}`)
  const [composeOpen, setComposeOpen] = useState<boolean>(false)
  const toggleComposeOpen = () => setComposeOpen(!composeOpen)
  
  //const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const hidden = true
  const store = useSelector((state: RootState) => state.email)

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [currentAoAddress, setMyAoConnectTxId] = useState<string>('')
  useEffect(() => {
    if(currentAddress && currentAddress.length === 43) {
      setMyAoConnectTxId(currentAddress);
    }
  }, [currentAddress]);


  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 12 })
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  useEffect(() => {
    if(true && currentAoAddress && currentAoAddress.length == 43) {
      setLoading(true)
      console.log("loading", loading)
      setNoEmailText('Loading...')
      dispatch(
        fetchData({
          address: String(currentAoAddress),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          folder: folder
        })
      ).then(()=>{
        setLoading(false)
        console.log("loading", loading)
        setNoEmailText('No Email')
      })
      setComposeOpen(false)
      setComposeTitle(`${t(`Compose`)}`)
    }
  }, [dispatch, paginationModel, folder, currentAoAddress, counter])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        lgAbove={lgAbove}
        dispatch={dispatch}
        folder={folder}
        setFolder={setFolder}
        emailDetailWindowOpen={emailDetailWindowOpen}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        composeTitle={composeTitle}
        toggleComposeOpen={toggleComposeOpen}
        setEmailDetailWindowOpen={setEmailDetailWindowOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        EmailCategoriesColors={EmailCategoriesColors}
      />
      <EmailList
        query={query}
        store={store}
        hidden={hidden}
        lgAbove={lgAbove}
        setQuery={setQuery}
        direction={direction}
        folder={folder}
        EmailCategoriesColors={EmailCategoriesColors}
        currentEmail={currentEmail}
        setCurrentEmail={setCurrentEmail}
        emailDetailWindowOpen={emailDetailWindowOpen}
        setEmailDetailWindowOpen={setEmailDetailWindowOpen}
        paginationModel={paginationModel}
        handlePageChange={handlePageChange}
        loading={loading}
        setLoading={setLoading}
        noEmailText={noEmailText}
        currentWallet={currentWallet}
        currentAoAddress={currentAoAddress}
        counter={counter}
        setCounter={setCounter}
        setComposeOpen={setComposeOpen}
      />
      <ComposePopup
        mdAbove={mdAbove}
        composeOpen={composeOpen}
        composePopupWidth={composePopupWidth}
        toggleComposeOpen={toggleComposeOpen}
        currentAoAddress={currentAoAddress}
        currentWallet={currentWallet}
        currentEmail={currentEmail}
        folder={folder}
      />
    </Box>
  )
}

export default EmailAppLayout
