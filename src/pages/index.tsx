// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** React Imports
import { useState, useEffect, Fragment } from 'react'


interface ChainInfoType {
  network: string
  version: number
  release: number
  height: number
  current: string
  blocks: number
  peers: number
  time: number
  miningtime: number
  weave_size: number
  denomination: number
  diff: string
}

const Home = () => {

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Home
