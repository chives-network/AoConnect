// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Demo Components Imports
import SendOutForm from 'src/views/form/SendOutForm'

const SendOut = () => {
  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
            <SendOutForm />
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

export default SendOut
