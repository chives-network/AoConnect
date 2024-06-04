// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

import CircularProgress from '@mui/material/CircularProgress'

// ** Hooks
import { sendAmount, getCurrentWallet, getHash, getProcessedData, getChivesLanguage } from 'src/functions/ChivesWallets'
import {EncryptDataWithKey} from 'src/functions/ChivesEncrypt'

// ** Third Party Components
import toast from 'react-hot-toast'

import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const FileUploaderMultiple = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()
  
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t(`Upload Files`)}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [removeAllButton, setRemoveAllButton] = useState<string>(`${t(`Remove All`)}`)
  const [isDisabledRemove, setIsDisabledRemove] = useState<boolean>(false)
  const [isEncryptFile, setIsEncryptFile] = useState<boolean>(false)
  
  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
          duration: 4000
        })
        router.push("/mywallets");
        
        return
      }
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      setIsDisabledButton(false)
      setUploadingButton(`${t(`Upload Files`)}`)      
      setRemoveAllButton(`${t(`Remove All`)}`)
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }
  
  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      {uploadProgress['UploadBundleFile'] && (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant='determinate' {...{value: uploadProgress['UploadBundleFile']??0}} size={50} />
                <Box
                sx={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                >
                <Typography variant='caption' component='div' color='text.secondary'>
                    {uploadProgress['UploadBundleFile']??0}%
                </Typography>
                </Box>
            </Box>
      )}
      { uploadProgress['UploadBundleFile'] && uploadProgress['UploadBundleFile'] > 0 ?
            <Fragment></Fragment>
        :
            <IconButton onClick={() => handleRemoveFile(file)}>
                <Icon icon='mdi:close' fontSize={20} />
            </IconButton> 
        }
      
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])    
    setIsDisabledButton(false)
    setIsDisabledRemove(false)
    setUploadingButton(`${t(`Upload Files`)}`)
    setUploadProgress({})
  }

  const handleUploadAllFiles = () => {
    setIsDisabledButton(true)
    setIsDisabledRemove(true)
    setUploadingButton(`${t(`Uploading`)}...`)
    uploadMultiFiles();
  }

  const uploadMultiFiles = async () => {
    const getChivesLanguageData: string = getChivesLanguage();
    
    //Make the bundle data
    const formData = (await Promise.all(files?.map(async file => {
      let data = file instanceof File ? await readFile(file) : file
      const tags = [] as Tag[]
      if(isEncryptFile)    {
        //Encrypt File Content
        const getCurrentWalletData = getCurrentWallet();
        const FileContent = new TextDecoder().decode(data);
        const FileEncrypt = EncryptDataWithKey(FileContent, file.name, getCurrentWalletData.jwk);
        console.log("FileEncrypt", FileEncrypt)
        setBaseTags(tags, {          
          'App-Name': FileEncrypt['App-Name'],
          'App-Version': FileEncrypt['App-Version'],
          'Content-Type': file.type,
          'File-Name': FileEncrypt['File-Name'],
          'File-Hash': FileEncrypt['File-Hash'],
          'Cipher-ALG': FileEncrypt['Cipher-ALG'],
          'Cipher-IV': FileEncrypt['Cipher-IV'],
          'Cipher-TAG': FileEncrypt['Cipher-TAG'],
          'Cipher-UUID': FileEncrypt['Cipher-UUID'],
          'Cipher-KEY': FileEncrypt['Cipher-KEY'],
          'Entity-Type': FileEncrypt['Entity-Type'],
          'Unix-Time': FileEncrypt['Unix-Time']
        })
        data = FileEncrypt['Cipher-CONTENT']
      }
      else {

        //Not Encrypt File Content
        setBaseTags(tags, {
          'Content-Type': file.type,
          'File-Name': file.name,
          'File-Hash': await getHash(data),
          'File-Public': 'Public',
          'File-Summary': '',
          'Cipher-ALG': '',
          'File-Parent': 'Root',
          'File-Language': getChivesLanguageData,
          'File-Pages': '',
          'Entity-Type': 'File',
          'App-Name': authConfig['App-Name'],
          'App-Version': authConfig['App-Version'],
          'App-Instance': authConfig['App-Instance'],
          'Unix-Time': String(Date.now())
        })
      }
      
      return { data, tags, path: file.name }
    })))
    
    const getProcessedDataValue = await getProcessedData(currentWallet, currentAddress, formData, true, []);

    const target = ""
    const amount = ""
    const data = getProcessedDataValue

    console.log("getChivesLanguageData", getChivesLanguageData)
    setIsEncryptFile(false)
    
    //Make the tags
    const tags: any = []
    tags.push({name: "Bundle-Format", value: 'binary'})
    tags.push({name: "Bundle-Version", value: '2.0.0'})
    tags.push({name: "Entity-Type", value: "Bundle"})
    tags.push({name: "Entity-Number", value: String(files.length)})

    const TxResult: any = await sendAmount(currentWallet, target, amount, tags, data, "UploadBundleFile", setUploadProgress);

    //Save Tx Records Into LocalStorage
    const chivesTxStatus: string = authConfig.chivesTxStatus
    const ChivesDriveActionsMap: any = {}
    const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
    const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []
    const TxResultNew = {...TxResult, data:'', chunks:''}
    chivesTxStatusList.push({TxResult: TxResultNew, ChivesDriveActionsMap: ChivesDriveActionsMap})
    console.log("chivesTxStatusList-FileUploaderMultiple", chivesTxStatusList)
    window.localStorage.setItem(chivesTxStatus, JSON.stringify(chivesTxStatusList))

    if(TxResult.status == 800) {
      //Insufficient balance
      toast.error(TxResult.statusText, { duration: 4000 })
      setIsDisabledButton(false)
      setIsDisabledRemove(false)
      setUploadingButton(`${t(`Upload Files`)}`)
    }

  };

  function setBaseTags (tags: Tag[], set: { [key: string]: string }) {
    const baseTags: { [key: string]: string } = {
      'Content-Type': '',
      'File-Hash': '',
      'Bundle-Format': '',
      'Bundle-Version': '',
      ...set
    }
    for (const name in baseTags) { setTag(tags, name, baseTags[name]) }
  }

  function setTag (tags: Tag[], name: string, value?: string) {
    let currentTag = tags.find(tag => tag.name === name)
    if (value) {
      if (!currentTag) {
        currentTag = { name, value: '' }
        tags.push(currentTag)
      }
      currentTag.value = value
    } else {
      const index = tags.indexOf(currentTag!)
      if (index !== -1) { tags.splice(index, 1) }
    }
  }

  useEffect(() => {
    let isFinishedAllUploaded = true
    uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).forEach(([key, value]) => {
        if(value != 100) {
            isFinishedAllUploaded = false
        }

        console.log("uploadProgress key ....", key, value)
    })
    if(uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).length > 0 && isFinishedAllUploaded) {
        setIsDisabledButton(true)
        setIsDisabledRemove(false)
        setUploadingButton(t("Upload success") as string)
        setRemoveAllButton(t("Clean Records") as string)        
        toast.success(t('Successfully submitted to blockchain') as string, { duration: 4000 })
    }
  }, [uploadProgress])

  function readFile (file: File) {
    return new Promise<Uint8Array>((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => resolve(new Uint8Array(e.target?.result as any))
      fileReader.onerror = (e) => reject(e)
      fileReader.readAsArrayBuffer(file)
    })
  }

  /*
  const uploadSingleFile = async (currentWallet: any, file: File) => {
    const target = ""
    const amount = ""
    const data = await readFile(file)
    const fileHash = await getHash(data)
    
    const tags: any = []
    tags.push({name: "Content-Type", value: file.type})
    tags.push({name: "File-Hash", value: fileHash})
    tags.push({name: "File-Name", value: file.name})

    const TxResult: any = await sendAmount(currentWallet, target, amount, tags, data, file.name, setUploadProgress);
    console.log("TxResult", TxResult)
    if(TxResult.status == 800) {
      //Insufficient balance
      toast.error(TxResult.statusText, { duration: 4000 })
      setIsDisabledButton(false)
      setIsDisabledRemove(false)
      setUploadingButton(`${t(`Upload Files`)}`)
    }
  };
  */

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
          <Img alt='Upload img' src='/images/misc/upload.png' />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
            <HeadingTypography variant='h5'>{`${t('Drop files here or click to upload.')}`}</HeadingTypography>
          </Box>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles} disabled={isDisabledRemove}>{removeAllButton}</Button>
            <Button variant='contained' onClick={handleUploadAllFiles} disabled={isDisabledButton}>{uploadingButton}</Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default FileUploaderMultiple
