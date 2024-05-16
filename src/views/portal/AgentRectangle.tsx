
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Next Imports
import Link from 'next/link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import { formatHash } from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const AgentRectangle = ( {item, backEndApi, FileType} : any) => {
  // ** Hook
  const { t } = useTranslation()
  
  const timestamp = item?.Block?.timestamp;
  const date = new Date(timestamp * 1000);

  console.log("FileType", FileType)

  let ImageUrl = ""
  if(item && item.Profile.Avatar && item.Profile.Avatar && item.Profile.Avatar.length == 43) {
    ImageUrl = `${backEndApi}/${item.Profile.Avatar}/thumbnail`
  }
  else {
    ImageUrl = '/images/chives.png'
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthAbbreviation = monthNames[date.getMonth()];
  const day = date.getDate();

  const LevelName = ['InActive', 'Level 1', 'Level 2', 'Level 3'];

  return (
    <Card>
      <Link href={`/user/agent/${item.Address}`}>
        <CardMedia image={ImageUrl} sx={{ height: '11.25rem', objectFit: 'scale-down', mx: 3, borderRadius: '5px' }}/>
      </Link>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, width: '3rem', height: '3.375rem' }}>
            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: 500, lineHeight: 1.29, color: 'primary.main', letterSpacing: '0.47px' }}
              >
                {monthAbbreviation}
              </Typography>
              <Typography variant='h6' sx={{ mt: -0.75, fontWeight: 600, color: 'primary.main' }}>
                {day}
              </Typography>
            </Box>
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600 }}>{formatHash(item.Profile.Name, 12)}</Typography>
          </Box>
        </Box>

        <Divider
          sx={{ mb: theme => `${theme.spacing(4)} !important`, mt: theme => `${theme.spacing(4.75)} !important` }}
        />

        <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
          <Icon icon='mdi:user' />
          <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
            <Typography sx={{ fontSize: '0.9rem' }}>{`${t(`Agent`)}`}: </Typography>
            <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(item.Address, 6)}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
            <Icon icon='icon-park-outline:transaction-order' />
            <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
              <Typography sx={{ fontSize: '0.9rem' }}>{`${t(`Level`)}`}: </Typography>
              <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{LevelName[item.AgentLevel]}</Typography>
            </Box>
        </Box>

      </CardContent>
    </Card>
  )
}

export default AgentRectangle
