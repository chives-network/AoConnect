// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Chatroom from './Chatroom'
import Token from './Token'

const LearnCenter = () => {
  // ** Hook

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <Chatroom />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <Token />
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default LearnCenter
