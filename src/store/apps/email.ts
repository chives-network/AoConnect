// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import authConfig from 'src/configs/auth'

import { TxRecordType } from 'src/types/apps/Chivesweave'

interface DataParams {
    address: string
    pageId: number
    pageSize: number
    type: string
    folder: string
    label: string
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appMyFiles/fetchData', async (params: DataParams) => {  

  let Url = authConfig.backEndApi + '/file/'+ `${params.type}` + '/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  if(params.type == "*" && params.folder =="*" && params.label != "*")  {
    Url = authConfig.backEndApi + '/file/label/'+ `${params.label}` + '/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  }
  if(params.type == "*" && params.folder !="*" && params.folder !="Star" && params.label == "*")  {
    Url = authConfig.backEndApi + '/file/folder/'+ `${params.folder}` + '/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  }
  if(params.type == "*" && params.folder =="Star" && params.label == "*")  {
    Url = authConfig.backEndApi + '/file/star/Star/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  }
  
  const response = await axios.get(Url)
  const NewData: any[] = response.data.data.filter((record: any) => record.id)
  
  //const TableData: any = {}
  //response.data.table.map((Item: any)=>{
  //  TableData[Item.id] = Item
  //})
  //const NewDataTable: TxRecordType[] = NewData.map((Item: TxRecordType)  => {
  //  return {...Item, ['table']:TableData[Item.id]}
  //} );
  response.data.data = NewData
  
  return { ...response.data, filter: params }
})

// ** Fetch Data
export const fetchTotalNumber = createAsyncThunk('appMyFiles/fetchTotalNumber', async (params: DataParams) => {  

  const TotalNumber: any = {};

  const Url1 = authConfig.backEndApi + '/file/folder/Root/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  const response1 = await axios.get(Url1)
  TotalNumber['Root'] = response1.data.total

  const Url2 = authConfig.backEndApi + '/file/folder/Trash/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  const response2 = await axios.get(Url2)
  TotalNumber['Trash'] = response2.data.total

  const Url3 = authConfig.backEndApi + '/file/folder/Spam/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  const response3 = await axios.get(Url3)
  TotalNumber['Spam'] = response3.data.total

  const Url4 = authConfig.backEndApi + '/file/star/Star/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize;
  const response4 = await axios.get(Url4)
  TotalNumber['Star'] = response4.data.total

  const Url5 = authConfig.backEndApi + '/file/group/label/'+ `${params.address}`;
  const response5 = await axios.get(Url5)
  const ItemLabelMap: any = {}
  response5.data.map((Item: any)=>(ItemLabelMap[Item.item_label] = Item.number))
  TotalNumber['label'] = ItemLabelMap
  
  return TotalNumber
})

export const fetchAllFolder = createAsyncThunk('appMyFiles/fetchAllFolder', async (params: DataParams) => {  

  const FolderArray: any = {};

  const Url1 = authConfig.backEndApi + '/folder/all/'+ `${params.address}`;
  const response1 = await axios.get(Url1)
  console.log("response1.data", response1.data)
  response1.data && response1.data.map((Item: any) => {
    if (!FolderArray[Item.item_parent]) {
      FolderArray[Item.item_parent] = [];
    }
    FolderArray[Item.item_parent].push({name: Item.item_name, id: Item.id, timestamp: Item.timestamp});
  });
  
  console.log("FolderArray", FolderArray)
  
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
      state.files = action.payload.emails
      state.filter = action.payload.filter
      state.mailMeta = action.payload.emailsMeta

      const tableMap: any = {}
      action.payload.table && action.payload.table.length > 0 && action.payload.table.map((Item: any)=>{
        tableMap[Item.id] = Item;
      })
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.table = tableMap
      state.allPages = action.payload.allpages

    })
    builder.addCase(setCurrentFile.fulfilled, (state, action) => {
      state.currentFile = action.payload
    })
    builder.addCase(fetchTotalNumber.fulfilled, (state, action) => {
      state.totalnumber = action.payload
    })
    builder.addCase(fetchAllFolder.fulfilled, (state, action) => {
      state.folder = action.payload
    })
  }
})

export const { handleSelectFile, handleSelectAllFile } = appDriveSlice.actions

export default appDriveSlice.reducer
