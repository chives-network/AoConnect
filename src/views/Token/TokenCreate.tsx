// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import { useTranslation } from 'react-i18next'

const TokenCreate = (prop: any) => {

  const { tokenCreate, setTokenCreate, handleTokenCreate, isDisabledButton } = prop
  
  const { t } = useTranslation()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ padding: '0 8px' }}>
            <TextField
                sx={{ml: 2, my: 2, width: '200px'}}
                size="small"
                label={`${t('Name')}`}
                placeholder={`${t('Name')}`}
                value={tokenCreate?.Name ?? 'AoConnectToken'}
                onChange={(e: any)=>{
                    setTokenCreate((prevState: any)=>({
                    ...prevState,
                    Name: e.target.value
                    }))
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                        <Icon icon='mdi:account-outline' />
                        </InputAdornment>
                    )
                }}
            />
            <TextField
                sx={{ml: 2, my: 2, width: '200px'}}
                size="small"
                label={`${t('Ticker')}`}
                placeholder={`${t('Ticker')}`}
                value={tokenCreate?.Ticker ?? 'AOCN'}
                onChange={(e: any)=>{
                    setTokenCreate((prevState: any)=>({
                    ...prevState,
                    Ticker: e.target.value
                    }))
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                        <Icon icon='mdi:account-outline' />
                        </InputAdornment>
                    )
                }}
            />
            <TextField
                sx={{ml: 2, my: 2, width: '200px'}}
                size="small"
                type="number"
                label={`${t('Balance')}`}
                placeholder={`${t('Balance')}`}
                value={tokenCreate?.Balance ?? 9999}
                onChange={(e: any)=>{
                    setTokenCreate((prevState: any)=>({
                    ...prevState,
                    Balance: e.target.value
                    }))
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Icon icon='mdi:account-outline' />
                        </InputAdornment>
                    )
                }}
            />
            <TextField
                sx={{ml: 2, my: 2}}
                size="small"
                label={`${t('Logo')}`}
                placeholder={`${t('Logo')}`}
                value={tokenCreate?.Logo ?? 'dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ'}
                onChange={(e: any)=>{
                    setTokenCreate((prevState: any)=>({
                    ...prevState,
                    Logo: e.target.value
                    }))
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                        <Icon icon='mdi:account-outline' />
                        </InputAdornment>
                    )
                }}
            />

            <Button sx={{ m: 2, mt: 3 }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                () => { handleTokenCreate() }
            }>
            {t("Create Token")}
            </Button>
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default TokenCreate
