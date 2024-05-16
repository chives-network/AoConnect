// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import authConfig from 'src/configs/auth'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

import { formatHash, formatXWE, getContentTypeAbbreviation } from 'src/configs/functions';

const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: theme.spacing(3)
}))

const ImgOriginal = styled('img')(({  }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  style: { zIndex: 1 }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
    fontWeight: 550,
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }))
  
function ImagePreview(ImageSource: string) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    useEffect(() => {
      const img = new Image();
      img.src = ImageSource;
  
      img.onload = () => {
        setImageError(false);
      };
  
      img.onerror = () => {
        setImageError(true);
      };
    }, [ImageSource]);
  
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!imageError && !isHovered && (
          <Img src={ImageSource} />
        )}
        {!imageError && isHovered && (
          <div className="preview">
            <ImgOriginal src={ImageSource} 
            />
          </div>
        )}
      </div>
    );
  }

function FormatTxInfoInRow({ TxRecord }: any) {
    const FileMap: { [key: string]: string } = {}
    TxRecord?.tags.map((Item: { [key: string]: string }) => {
      FileMap[Item.name] = Item.value;
    });
    const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
    
    //console.log("FileMap", FileMap)
    switch(FileType) {
        case 'PNG':
        case 'GIF':
        case 'JPEG':
        case 'JPG':
        case 'WEBM':
            return ImagePreview(`${authConfig.backEndApi}/${TxRecord?.id}/thumbnail`)
        case 'PDF':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
        case 'XLS':
        case 'XLSX':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
        case 'DOC':
        case 'DOCX':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
        case 'PPT':
        case 'PPTX':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
        case 'MP4':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
        case 'MP3':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
        case 'WAV':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
        case 'JSON':
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']?FileMap['File-Name']:FileType}</LinkStyled></Tooltip>
        case 'EXE':
        case 'TEXT': 
        case 'CSV':  
            return <Tooltip title={FileMap['File-Name']}><LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled></Tooltip>
    }

    switch(FileMap['File-Name']?.slice(-4)) {
        case '.stl':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
    }
  
    //Bundle Support
    const BundleFormat = FileMap['Bundle-Format'];
    const BundleVersion = FileMap['Bundle-Version'];
    const BundleNumber = FileMap['Entity-Number'];
    if(BundleFormat == "binary") {
      return <Tooltip title={"Bundle Number: "+BundleNumber}><div>Bundle: { BundleVersion} ({BundleNumber})</div></Tooltip>;
    }
  
    //Video Format
  
    if(TxRecord?.recipient != "") {
          
      return (
          <Typography noWrap variant='body2'>
            {formatXWE(TxRecord?.quantity.winston, 4) + " -> "}
            <Tooltip title={`${TxRecord?.recipient}`}>
              <LinkStyled href={`/addresses/all/${TxRecord?.recipient}`}>{formatHash(TxRecord?.recipient, 5)}</LinkStyled>
            </Tooltip>
          </Typography>  
      )
    }
    
    return <div>Unknown</div>;
  
  }
  
export default FormatTxInfoInRow;
