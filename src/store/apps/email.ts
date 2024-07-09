// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import authConfig from 'src/configs/auth'

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
    const [filterEmails, totalRecords, emailFolder, startIndex, endIndex, EmailRecordsCount, recordsUnRead] = ChivesEmailGetMyEmailRecordsData1
    
    return { ...{filterEmails, totalRecords, emailFolder, startIndex, endIndex, EmailRecordsCount, recordsUnRead}, filter: params }
  }
  else {
  
    return { ...{filterEmails: [], totalRecords : 0, emailFolder: params.folder, startIndex: '0', endIndex: '10', EmailRecordsCount: {}, recordsUnRead:{} }, filter: params }
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
    recordsCount: [],
    recordsUnRead: {},
    table: [],
    allPages: 1,
    folder:[],
  },
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.recordsCount = action.payload.EmailRecordsCount
      state.data = action.payload.filterEmails
      state.total = action.payload.totalRecords
      state.params = action.payload.filter
      state.recordsUnRead = action.payload.recordsUnRead
      state.allPages = Math.ceil(action.payload.totalRecords / 10)
    })
  }
})

export default myEmailSlice.reducer
