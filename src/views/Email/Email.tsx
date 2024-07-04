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
import { DriveLayoutType } from 'src/types/apps/emailTypes'

// ** Email App Component Imports
import DriveList from 'src/views/Email/EmailList'
import SidebarLeft from 'src/views/Email/SidebarLeft'
import UploadFiles from 'src/views/form/uploadfiles';

import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Actions
import {
  fetchData,
  setCurrentFile,
  handleSelectFile,
  handleSelectAllFile,
  fetchTotalNumber,
  fetchAllFolder
} from 'src/store/apps/email'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Variables
const labelColors: any = {
  private: 'error',
  personal: 'success',
  company: 'primary',
  important: 'warning'
}

const DriveAppLayout = ({ initFolder, label, type }: DriveLayoutType) => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()
  
  // ** States
  const [query, setQuery] = useState<string>('')
  const [uploadFilesOpen, setUploadFilesOpen] = useState<boolean>(false)
  const [uploadFilesTitle, setUploadFilesTitle] = useState<string>(`${t(`Upload Files`)}`)
  const [driveFileOpen, setFileDetailOpen] = useState<boolean>(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [folder, setFolder] = useState<string>(initFolder)
  const [folderHeaderList, setFolderHeaderList] = useState<any[]>([{'name': t(initFolder) as string, 'value': initFolder}])

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
  const routeParams = {
    label: label || 'Personal',
    type: type || 'image',
    initFolder: folder || 'Root'
  }

  const auth = useAuth()
  const id = auth.currentAddress
  const currentAddress = auth.currentAddress

  // ** State
  const paginationModelDefaultValue = { page: 1, pageSize: 9 }
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 9 })
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  const handleFolderChange = (folder: string) => {
    setFolder(folder);
    console.log("handleFolderChange", folder)
  }

  const handleFolderHeaderList = (folderHeader: any) => {
    const folderHeaderListNew: any = []
    let isContinue = 1
    folderHeaderList.forEach((Item: any)=>{
      if(isContinue == 1) {
        folderHeaderListNew.push(Item)
        if(Item.value == folderHeader.value) {
          isContinue = 2 
        }
      }
    })
    if(isContinue == 1) {
      folderHeaderListNew.push(folderHeader)
    }
    setFolder(folderHeader.value);
    setFolderHeaderList(folderHeaderListNew);
    setPaginationModel(paginationModelDefaultValue)
    console.log("folderHeaderListNew", folderHeaderListNew)
  }
  
  useEffect(() => {
    if(true && id && id.length == 43) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: type,
          folder: folder,
          label: label
        })
      )
      dispatch(
        fetchTotalNumber({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: type,
          folder: folder,
          label: label
        })
      )
      dispatch(
        fetchAllFolder({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: type,
          folder: folder,
          label: label
        })
      )
      dispatch(handleSelectAllFile(false))
      setUploadFilesOpen(false)
      setUploadFilesTitle(`${t(`Upload Files`)}`)
    }
  }, [dispatch, paginationModel, type, folder, label, id])

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
      setUploadFilesTitle(`${t(`Upload Files`)}`)
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
        handleFolderHeaderList={handleFolderHeaderList}
        routeParams={routeParams}
        driveFileOpen={driveFileOpen}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        uploadFilesTitle={uploadFilesTitle}
        toggleUploadFilesOpen={toggleUploadFilesOpen}
        setFileDetailOpen={setFileDetailOpen}
        handleSelectAllFile={handleSelectAllFile}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
      />
      { !uploadFilesOpen ?
        <DriveList
          query={query}
          store={store}
          hidden={hidden}
          lgAbove={lgAbove}
          dispatch={dispatch}
          setQuery={setQuery}
          direction={direction}
          routeParams={routeParams}
          labelColors={labelColors}
          folder={folder}
          setCurrentFile={setCurrentFile}
          driveFileOpen={driveFileOpen}
          handleSelectFile={handleSelectFile}
          setFileDetailOpen={setFileDetailOpen}
          handleSelectAllFile={handleSelectAllFile}
          handleLeftSidebarToggle={handleLeftSidebarToggle}        
          paginationModel={paginationModel}
          handlePageChange={handlePageChange}
          handleFolderChange={handleFolderChange}
          folderHeaderList={folderHeaderList}
          handleFolderHeaderList={handleFolderHeaderList}
        />
        :
        <CardContent>
          <UploadFiles />
        </CardContent>
      }
    </Box>
  )
}

export default DriveAppLayout
