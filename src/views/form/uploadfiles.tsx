// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/form/FileUploaderMultiple'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const UploadFiles = () => {
  // ** Hook
  const { t } = useTranslation()
  
  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              {`${t('Upload Files')}`}
            </Typography>
          }
          subtitle={<Typography variant='body2'>{`${t('You can choose multiple files for simultaneous uploading. Uploading files to blockchain may take 3-10 minutes.')}`}</Typography>}
        />
        <Grid item xs={12}>
            <FileUploaderMultiple />
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

export default UploadFiles
