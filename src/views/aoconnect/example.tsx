// ** React Imports
import { useState, useEffect, Fragment, SyntheticEvent } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import AoSendMsgModel from './AoSendMsgModel'
import AoCreateProcessModel from './AoCreateProcessModel'
import AoGetPageRecordsModel from './AoGetPageRecordsModel'
import GetMyLastMsgModel from './GetMyLastMsgModel'



const Aoconnect = () => {
  // ** Hook

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Card sx={{ padding: '0 8px' }}>
          <AoSendMsgModel />
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ padding: '0 8px' }}>
          <AoCreateProcessModel />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <AoGetPageRecordsModel />
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ padding: '0 8px' }}>
          <GetMyLastMsgModel />
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default Aoconnect
