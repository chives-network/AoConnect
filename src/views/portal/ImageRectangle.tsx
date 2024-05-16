
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
import ReactAudioPlayer from 'react-audio-player';

import { formatHash, formatTimestampAge } from 'src/configs/functions';
import { Fragment } from 'react'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import authConfig from 'src/configs/auth'

const ImageRectangle = ( {item, backEndApi, FileType} : any) => {
  // ** Hook
  const { t } = useTranslation()
  
  const FileMap: { [key: string]: string } = {}
  item?.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileName = FileMap['File-Name'];
  const timestamp = item.block.timestamp;
  const date = new Date(timestamp * 1000);

  const EntityType = FileMap['Entity-Type'];
  const EntityAction = FileMap['Entity-Action'];
  const EntityTarget = FileMap['Entity-Target'];
  const EntityTargetText = FileMap['Entity-Target-Text'];
  const FileTxId = FileMap['File-TxId'];
  let ImageUrl = ""
  if(FileTxId && FileTxId.length == 43) {
    ImageUrl = FileTxId
  }
  else {
    ImageUrl = item.id
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthAbbreviation = monthNames[date.getMonth()];
  const day = date.getDate();

  console.log("FileType", FileType)

  return (
    <Card>
      {FileType && (FileType=="png" || FileType=="jpeg" || FileType=="gif" || FileType=="image" || FileType=="word" || FileType=="excel" || FileType=="pptx") ?
        <Link href={`/txs/view/${item.id}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="video" && authConfig.productName != "ArDrive" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }      
      {FileType && FileType=="video" && authConfig.productName == "ArDrive" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`/images/icons/video.jpg`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="audio" && authConfig.productName != "ArDrive" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <ReactAudioPlayer src={`${backEndApi}/${ImageUrl}`} controls style={{width: '100%'}}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="audio" && authConfig.productName == "ArDrive" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <ReactAudioPlayer src={`${backEndApi}/${ImageUrl}`} controls style={{width: '100%'}}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="pdf" && authConfig.productName != "ArDrive" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="pdf" && authConfig.productName == "ArDrive" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`/images/icons/pdf.png`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="stl" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      <CardContent>
        {authConfig.productName != "ArDrive" ?
        <Fragment>
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
              <Typography sx={{ fontWeight: 600 }}>{formatHash(FileName, 12)}</Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: theme => `${theme.spacing(4)} !important`, mt: theme => `${theme.spacing(4.75)} !important` }} />
        </Fragment>
        :
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 600 }}>{formatHash(FileName, 12)}</Typography>
        </Box>
        }
        

        <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
          <Icon icon='mdi:user' />
          <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
            <Typography sx={{ fontSize: '0.9rem' }}>{`${t(`Owner`)}`}: </Typography>
            <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(item.owner.address, 6)}</Typography>
          </Box>
        </Box>
        
        {EntityType != "Action" ?
          <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
            <Icon icon='icon-park-outline:transaction-order' />
            <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
              <Typography sx={{ fontSize: '0.9rem' }}>{`${t(`TxId`)}`}: </Typography>
              <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(ImageUrl, 6)}</Typography>
            </Box>
          </Box>
          :
          <Fragment></Fragment>
        }
        {EntityType == "Action" ?
          <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
            <Icon icon='icon-park-outline:transaction-order' />
            <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
              <Typography sx={{ fontSize: '0.9rem' }}>{t(EntityType) as string}: </Typography>
              {EntityAction=="Folder" && EntityTarget.length == 43 ?
                <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(EntityTargetText, 6)}</Typography>
                :
                <Fragment></Fragment>
              }
              {EntityAction=="Folder" && EntityTarget.length != 43 ?
                <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(EntityTarget, 6)}</Typography>
                :
                <Fragment></Fragment>
              }
              {EntityAction=="Star" ?
                <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(EntityTarget, 6)}</Typography>
                :
                <Fragment></Fragment>
              }
              {EntityAction=="Label" ?
                <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>Label ({formatHash(EntityTarget, 6)})</Typography>
                :
                <Fragment></Fragment>
              }
            </Box>
          </Box>
          :
          <Fragment></Fragment>
        }
        {authConfig.productName == "ArDrive" ?
          <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
            <Icon icon='mdi:user' />
            <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
              <Typography sx={{ fontSize: '0.9rem' }}>{`${t(`Time`)}`}: </Typography>
              <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatTimestampAge(item.block.timestamp)}</Typography>
            </Box>
          </Box>
        :
        null
        }

      </CardContent>
    </Card>
  )
}

export default ImageRectangle
