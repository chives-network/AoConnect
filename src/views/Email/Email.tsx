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
import UploadFiles from 'src/views/form/uploadfiles';

import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Third Party Components
import toast from 'react-hot-toast'

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

  const router = useRouter()
  
  // ** States
  const [query, setQuery] = useState<string>('')
  const [uploadFilesOpen, setUploadFilesOpen] = useState<boolean>(false)
  const [uploadFilesTitle, setUploadFilesTitle] = useState<string>(`${t(`Write Email`)}`)
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
  
  //const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const hidden = true
  const store = useSelector((state: RootState) => state.email)

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings

  const auth = useAuth()
  const currentAoAddress = "Bxp-92cN0pUt621JPMTeLfTm1WE70a3kKX7HkU0QQkM"
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 12 })
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  const handleFolderChange = (folder: string) => {
    setFolder(folder);
    console.log("handleFolderChange", folder)
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
      setUploadFilesOpen(false)
      setUploadFilesTitle(`${t(`Compose`)}`)
    }
  }, [dispatch, paginationModel, folder, currentAoAddress, counter])

  const toggleUploadFilesOpen = () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
      toast.success(t(`Please create a wallet first`), {
        duration: 4000
      })
      router.push("/mywallets");
      
      return
    }
    setUploadFilesOpen(!uploadFilesOpen)
    if(uploadFilesOpen) {
      setUploadFilesTitle(`${t(`Write Email`)}`)
    }
    else {
      setUploadFilesTitle(`${t(`Back To List`)}`)
    }
  }
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
        uploadFilesTitle={uploadFilesTitle}
        toggleUploadFilesOpen={toggleUploadFilesOpen}
        setEmailDetailWindowOpen={setEmailDetailWindowOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        EmailCategoriesColors={EmailCategoriesColors}
      />
      { !uploadFilesOpen ?
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
          handleFolderChange={handleFolderChange}
          loading={loading}
          setLoading={setLoading}
          noEmailText={noEmailText}
          currentWallet={currentWallet}
          currentAoAddress={currentAoAddress}
          counter={counter}
          setCounter={setCounter}
        />
        :
        <CardContent>
          <UploadFiles />
        </CardContent>
      }
    </Box>
  )
}

export default EmailAppLayout
