// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import authConfig from 'src/configs/auth'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { AoLoadBlueprintChivesEmail, 
  ChivesEmailGetMyEmailRecords, ChivesEmailSendEmail, ChivesEmailSetPublicKey, ChivesEmailGetPublicKeys, ChivesEmailGetEmailRecords, ChivesEmailReadEmailContent
 } from 'src/functions/AoConnect/ChivesEmail'

interface DataParams {
    address: string
    pageId: number
    pageSize: number
    folder: string
}

// ** Fetch Data
export const fetchData = createAsyncThunk('MyEmails/fetchData', async (params: DataParams) => {  

  const ChivesEmailGetMyEmailRecordsData1 = await ChivesEmailGetMyEmailRecords(authConfig.AoConnectChivesEmailServerData, params.address, params.folder ?? "Inbox", '0', '10')
  if(ChivesEmailGetMyEmailRecordsData1) {
    console.log("ChivesEmailGetMyEmailRecordsData1", ChivesEmailGetMyEmailRecordsData1)
    const [filterEmails, totalRecords, emailFolder, startIndex, endIndex, EmailRecordsCount] = ChivesEmailGetMyEmailRecordsData1
    
    return { ...{filterEmails, totalRecords, emailFolder, startIndex, endIndex, EmailRecordsCount}, filter: params }
  }
  else {
  
    return { ...{filterEmails: [], totalRecords : 0, emailFolder: params.folder, startIndex: '0', endIndex: '10', EmailRecordsCount: {} }, filter: params }
  }
})

// ** Fetch Data
export const fetchTotalNumber = createAsyncThunk('MyEmails/fetchTotalNumber', async (params: DataParams) => {  

  const TotalNumber: any = {};

  
  return TotalNumber
})

export const fetchAllFolder = createAsyncThunk('MyEmails/fetchAllFolder', async (params: DataParams) => {  

  const FolderArray: any = {};
  
  return FolderArray
})

export const setCurrentFile = createAsyncThunk('appDrive/selectFile', async (FileTx: TxRecordType) => {

  return FileTx
})

export const appDriveSlice = createSlice({
  name: 'appDrive',
  initialState: {
    files: null,
    mailMeta: null,
    filter: {
      q: '',
      label: '',
      type: '',
      folder: 'myfiles'
    },
    currentFile: {},
    selectedFiles: [],
    
    data: [],
    total: 1,
    params: {},
    allData: [],
    table: [],
    allPages: 1,
    totalnumber: [],
    folder:[],
  },
  reducers: {
    handleSelectFile: (state, action) => {
      const files: any = state.selectedFiles
      if (!files.includes(action.payload)) {
        files.push(action.payload)
      } else {
        files.splice(files.indexOf(action.payload), 1)
      }
      state.selectedFiles = files
    },
    handleSelectAllFile: (state, action) => {
      const selectAllDrives: string[] = []
      if (action.payload && state.files !== null) {
        selectAllDrives.length = 0

        // @ts-ignore
        state.data.forEach((drive: TxRecordType) => {
          const TagsMap: any = {}
          drive && drive.tags && drive.tags.length > 0 && drive.tags.map( (Tag: any) => {
            TagsMap[Tag.name] = Tag.value;
          })
          const EntityType = TagsMap['Entity-Type']
          if(EntityType!="Folder") {
            selectAllDrives.push(drive.id)
          }
        })
      } else {
        selectAllDrives.length = 0
      }
      console.log("selectAllDrives", selectAllDrives)
      state.selectedFiles = selectAllDrives as any
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      console.log("action.payload", action.payload)
      state.EmailRecordsCount = action.payload.EmailRecordsCount

      state.data = action.payload.filterEmails
      state.total = action.payload.totalRecords
      state.params = action.payload.filter
      state.allData = action.payload.filterEmails
      state.allPages = Math.ceil(action.payload.totalRecords / 10)

    })
    builder.addCase(setCurrentFile.fulfilled, (state, action) => {
      state.currentFile = action.payload
    })
  }
})

export const { handleSelectFile, handleSelectAllFile } = appDriveSlice.actions

export default appDriveSlice.reducer
