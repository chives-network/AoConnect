// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import authConfig from 'src/configs/auth'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { ChivesEmailGetMyEmailRecords } from 'src/functions/AoConnect/ChivesEmail'

interface DataParams {
    address: string
    pageId: number
    pageSize: number
    folder: string
}

// ** Fetch Data
export const fetchData = createAsyncThunk('MyEmails/fetchData', async (params: DataParams) => {  
  console.log("params", params)
  const startIndex = params.pageId * params.pageSize + 1
  const endIndex = (params.pageId+1) * params.pageSize
  const ChivesEmailGetMyEmailRecordsData1 = await ChivesEmailGetMyEmailRecords(authConfig.AoConnectChivesEmailServerData, params.address, params.folder ?? "Inbox", String(startIndex), String(endIndex))
  if(ChivesEmailGetMyEmailRecordsData1) {
    console.log("ChivesEmailGetMyEmailRecordsData1", ChivesEmailGetMyEmailRecordsData1)
    const [filterEmails, totalRecords, emailFolder, startIndex, endIndex, EmailRecordsCount] = ChivesEmailGetMyEmailRecordsData1
    
    return { ...{filterEmails, totalRecords, emailFolder, startIndex, endIndex, EmailRecordsCount}, filter: params }
  }
  else {
  
    return { ...{filterEmails: [], totalRecords : 0, emailFolder: params.folder, startIndex: '0', endIndex: '10', EmailRecordsCount: {} }, filter: params }
  }
})

export const myEmailSlice = createSlice({
  name: 'myEmail',
  initialState: {
    files: null,
    mailMeta: null,
    filter: {
      q: '',
      label: '',
      type: '',
      folder: 'Inbox'
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
      state.allData = action.payload.EmailRecordsCount
      state.data = action.payload.filterEmails
      state.total = action.payload.totalRecords
      state.params = action.payload.filter
      state.allPages = Math.ceil(action.payload.totalRecords / 10)
    })
  }
})

export const { handleSelectFile, handleSelectAllFile } = myEmailSlice.actions

export default myEmailSlice.reducer
