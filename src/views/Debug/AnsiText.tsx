import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ansiRegex } from 'src/configs/functions'

const AnsiText = ({ text }: any) => {
    
    // 正则表达式匹配 ANSI 转义码
    const formatText = String(text).replace(ansiRegex, '');
  
    return  <Box
                sx={{
                    borderRadius: '5px',
                    padding: '8px',
                    width: '95%',
                    whiteSpace: 'pre-line',
                    border: (theme: any) => `1px solid ${theme.palette.divider}`,
                    borderColor: (theme: any) => `rgba(${theme.palette.customColors.main}, 0.25)`,
                    wordWrap: 'break-word',
                    marginRight: '5px'
                }} >
                    <Typography variant='body2' sx={{ mt: 3 , wordWrap: 'break-word'}}>
                        {formatText}
                    </Typography>
            </Box>
};

export default AnsiText