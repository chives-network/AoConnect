// ** React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const MembersApplicant = (props: any) => {
    // ** Props
    const {openMembersApplicant, setOpenMembersApplicant, valueMembersApplicant, setValueMembersApplicant, handleApplicantMember } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    const isDisabledButton = false

    console.log("valueMembersApplicant", valueMembersApplicant)

    return (
        <Dialog fullWidth open={openMembersApplicant} maxWidth="md" onClose={
            () => { setOpenMembersApplicant(false) }
        }>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <Avatar src={openMembersApplicant.FormTitleIcon} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                    <Typography sx={{pl: 2}}>{t('Review user applications') as string}</Typography>
                    <Box position={'absolute'} right={'5px'} top={'1px'}>
                        <IconButton size="small" edge="end" onClick={
                            () => { setOpenMembersApplicant(false) }
                        } aria-label="close">
                            <Icon icon='mdi:close-circle-outline' />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <TableContainer component={Paper} variant="outlined" sx={{mt: 3}}>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Box textAlign="center">{t('MemberId')}</Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">{t('MemberReason')}</Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">{t('Actions')}</Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                            <TableBody>
                            {valueMembersApplicant && valueMembersApplicant.map((Applicant: any, index: number)=>{    

                                return (
                                    <TableRow key={index}>
                                        <TableCell style={{ display: 'flex', alignItems: 'center' }}>
                                            {Applicant.MemberId}
                                        </TableCell>
                                        <TableCell style={{ width: '20%', padding: 0, margin: 0 }}>
                                            {Applicant.MemberReason}
                                        </TableCell>
                                        <TableCell style={{ width: '25%', padding: 0, margin: 0 }}>
                                            <Box display="flex" justifyContent="center">
                                                <Button size="small" sx={{mr: 2}} variant='outlined' disabled={isDisabledButton} onClick={() => { 
                                                    handleApplicantMember(Applicant.MemberId, "Refuse");
                                                    setOpenMembersApplicant(false)
                                                }}>
                                                    {t("Refuse")}
                                                </Button>
                                                <Button size="small" variant='contained' disabled={isDisabledButton} onClick={() => { 
                                                    handleApplicantMember(Applicant.MemberId, "Accept");
                                                    setOpenMembersApplicant(false)
                                                }}>
                                                    {t('Accept')}
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button size="small" variant='outlined' disabled={isDisabledButton} onClick={
                    () => { 
                        setOpenMembersApplicant(false)
                        const AllApplicantsList = valueMembersApplicant.map((Applicant: any) => {  

                            return Applicant.MemberId;
                        });
                        const ApplicantsListAll = AllApplicantsList.join('****');
                        console.log("ApplicantsListAll", ApplicantsListAll);
                        handleApplicantMember(ApplicantsListAll, "Refuse")
                        setValueMembersApplicant([])
                    }
                }>
                {t("Refuse All")}
                </Button>
                <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                    () => { 
                        setOpenMembersApplicant(false)
                        const AllApplicantsList = valueMembersApplicant.map((Applicant: any) => {  

                            return Applicant.MemberId;
                        });
                        const ApplicantsListAll = AllApplicantsList.join('****');
                        console.log("ApplicantsListAll", ApplicantsListAll);
                        handleApplicantMember(ApplicantsListAll, "Accept")
                        setValueMembersApplicant([])
                    }
                }>
                {t('Accept All')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MembersApplicant
