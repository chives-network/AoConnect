import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'

const EmailModel = () => {

  return (
    <Box>
      <Typography> My Email On Ao. Dev not begin. </Typography>
      <CardMedia image={`/screen/Email/Demo-Email.png`} sx={{ height: '900px', objectFit: 'contain', borderRadius: 1, mt: 2 }}/>
    </Box>
  )

}

export default EmailModel

