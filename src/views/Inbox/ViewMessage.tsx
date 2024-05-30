// ** React Imports
import { useRef, Fragment } from 'react'

import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: any }>(({ theme }) => ({
    padding: theme.spacing(3, 5, 3, 3)
  }))


const ViewMessage = (props: any) => {
    // ** Props
    const {viewInfo, isViewModel, setIsViewModel } = props

    // ** Hook
    const { t } = useTranslation()

    const chatArea = useRef(null)

    return (
        <Dialog fullWidth open={isViewModel} onClose={
            () => { setIsViewModel( false ) }
        }>
            <DialogTitle sx={{mx:1, p:2, pb:1}}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>{t('Inbox Message Detail') as string}</Typography>
                <Box>
                    <IconButton size="small" edge="end" onClick={() => { setIsViewModel( false ) }} aria-label="close">
                        <Icon icon='mdi:close' />
                    </IconButton>
                </Box>
            </Box>

            </DialogTitle>
            <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false, suppressScrollX: true }}>
                <Fragment>
                    {viewInfo && Object.keys(viewInfo).map((item: string, index: number)=>{

                        return (
                            <Fragment key={index}>
                                <Grid item xs={12}>
                                    <Card sx={{mt: 2}}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 2, m: 0 }}>
                                            <Typography sx={{ fontSize: '0.875rem' }}>
                                            {item}
                                            </Typography>
                                            <Typography sx={{ color: 'action.active', fontSize: '0.8125rem' }}>
                                                {viewInfo[item] || ''}
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            </Fragment>
                        )
                    })}
                </Fragment>
            </PerfectScrollbar>
        </Dialog>
    )
}

export default ViewMessage
