import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AnsiText from './AnsiText'

//import dynamic from "next/dynamic"
//const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false })

const MessageRender = ({ resultText }: any) => {

    return  (
                    <Typography variant='body2' sx={{ mt: 3 }}>
                        {resultText && resultText.Output && resultText.Output.data && resultText.Output.data.output && 
                        (
                            <AnsiText text={resultText.Output.data.output} />
                        )
                        }
                        {resultText && resultText.Output && resultText.Output.data && typeof resultText.Output.data == 'string' && 
                        (
                            <AnsiText text={resultText.Output.data} />
                        )
                        }
                    </Typography>
    )
};

//<DynamicReactJson src={resultText} theme="rjv-default" />

export default MessageRender