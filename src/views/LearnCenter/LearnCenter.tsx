// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import AoSendMsgModel from './AoSendMsgModel'
import AoCreateProcessModel from './AoCreateProcessModel'
import AoGetPageRecordsModel from './AoGetPageRecordsModel'
import AoGetMessageModel from './AoGetMessageModel'

const LearnCenter = () => {
  // ** Hook

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <AoSendMsgModel />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <AoGetPageRecordsModel />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <AoGetMessageModel />
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ padding: '0 8px' }}>
          <AoCreateProcessModel />
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default LearnCenter
