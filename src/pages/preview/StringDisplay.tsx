import React, { Fragment } from 'react';

import ToggleButton from '@mui/material/ToggleButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import Link from 'next/link'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

interface Props {
  InputString: string
  StringSize: number
  href: string | null
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 550,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

function StringDisplay({ InputString, StringSize, href } : Props) {
  let truncatedString = InputString;
  if(InputString=="" || InputString==undefined) {
    return <Fragment></Fragment>
  }

  if(StringSize >= 40) {
    truncatedString = InputString;
  }
  else if(StringSize > 0) {
    truncatedString = InputString.slice(0, StringSize) + '...' + InputString.slice(0-StringSize);
  }
  if(InputString && InputString.length <= StringSize * 2) {
    truncatedString = InputString;
  }
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(InputString);
  }

  //console.log("isMobile", isMobile())

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {href && href != undefined ? 
          <LinkStyled href={href} sx={{pr: 2}}>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>{truncatedString}</Typography>
          </LinkStyled>
        :
          <div style={{ paddingRight: 5}}>{truncatedString}</div>
        }
        {InputString && InputString.length > 20 ?
          <ToggleButton value='left' size="small">
              <Icon onClick={copyToClipboard} icon='material-symbols:content-copy-outline' fontSize={20} />
          </ToggleButton>
        :
          <Fragment></Fragment>
        }
    </div>
  );
}

export default StringDisplay;
