// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import ChivesChat from './ChivesChat'
import ChivesChatOnlyChat from './ChivesChatOnlyChat'
import Chatroom from './Chatroom'
import Token from './Token'
import TokenOnlySendAndMint from './TokenOnlySendAndMint'
import MyProcessTxIds from './MyProcessTxIds'
import ChivesLottery from './ChivesLottery'
import ChivesFaucet from './ChivesFaucet'
import ChivesServerData from './ChivesServerData'
import ChivesEmail from './ChivesEmail'


const LearnCenter = () => {
  // ** Hook

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <ChivesChat />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <ChivesChatOnlyChat />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <ChivesEmail />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <ChivesServerData />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <ChivesFaucet />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <ChivesLottery />
        </Card>
      </Grid>
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
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <TokenOnlySendAndMint />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
          <MyProcessTxIds />
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default LearnCenter
