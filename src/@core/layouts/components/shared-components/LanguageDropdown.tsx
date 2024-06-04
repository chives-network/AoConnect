// ** React Import
import { useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

import { getChivesLanguage, setChivesLanguage } from 'src/functions/ChivesWallets'

import { useAuth } from 'src/hooks/useAuth'

/*
import toast from 'react-hot-toast'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
*/
//import { ReminderMsgAndStoreToLocal, GetAoConnectReminderProcessTxId } from 'src/functions/AoConnect/MsgReminder'


interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = (lang: 'en' | 'zh' | 'zh-TW' | 'Ru' | 'Fr' | 'De' | 'Sp' | 'Kr' ) => {
    i18n.changeLanguage(lang)
    setChivesLanguage(lang)
  }

  const auth = useAuth()
  const currentAddress = auth.currentAddress

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    const localLanguage = getChivesLanguage()
    if(localLanguage!=i18n.language && localLanguage!='') {
      i18n.changeLanguage(localLanguage)
      setChivesLanguage(localLanguage)
    }
    document.documentElement.setAttribute('lang', i18n.language)
    console.log("currentAddresscurrentAddresscurrentAddress", currentAddress)
  }, [i18n.language])

  /*
  useEffect(() => {

    const intervalId = setInterval(async () => {
      const GetMyCurrentProcessTxIdData: string = GetAoConnectReminderProcessTxId()
      const ReminderMsgAndStoreToLocalData = GetMyCurrentProcessTxIdData && GetMyCurrentProcessTxIdData.length == 43 ? await ReminderMsgAndStoreToLocal(GetMyCurrentProcessTxIdData) : null
      
      //Every msg delay one second to remind
      const displayMessagesWithDelay = (messages: any[], index: number) => {
        if (index < messages.length) {
          setTimeout(() => {
            CustomToast(messages[index])
            displayMessagesWithDelay(messages, index + 1);
          }, 1000);
        }
      };
      ReminderMsgAndStoreToLocalData && displayMessagesWithDelay(ReminderMsgAndStoreToLocalData, 0);
      console.log("ReminderMsgAndStoreToLocalData", ReminderMsgAndStoreToLocalData)
      
    }, 1000 * 6 * 1);

    return () => clearInterval(intervalId);

  }, [currentAddress]);

  //Message Format {Target, Action, Type, FromProcess, Data, Ref_}
  const CustomToast = (ContentList: any) => {
    return toast(
      t => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Victor Anderson' src={ ContentList['Logo'] || '/images/avatars/3.png' } sx={{ mr: 3, width: 40, height: 40 }} />
            <div>
              <Typography>{ContentList['Data']}</Typography>
              {ContentList && ContentList['Action'] == null && ContentList['FromProcess'] && (
                <Typography variant='caption'>{ContentList['FromProcess']} Id: {ContentList['Ref_']}</Typography>
              )}
              {ContentList && ContentList['Action'] != null && (
                <Typography variant='caption'>Action: {ContentList['Action']} Id: {ContentList['Ref_']}</Typography>
              )}
            </div>
          </Box>
          <IconButton onClick={() => toast.dismiss(t.id)}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      ),
      {
        style: {
          minWidth: '550px'
        },
        position: 'top-center',
        duration: 4000
      }
    )
  }

  */


  return (
    <OptionsMenu
      icon={<Icon icon='mdi:translate' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={[
        {
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Korean',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Kr',
            onClick: () => {
              handleLangItemClick('Kr')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'French',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Fr',
            onClick: () => {
              handleLangItemClick('Fr')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'German',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'De',
            onClick: () => {
              handleLangItemClick('De')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Spanish',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Sp',
            onClick: () => {
              handleLangItemClick('Sp')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Russia',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Ru',
            onClick: () => {
              handleLangItemClick('Ru')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: '简体中文',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'zh',
            onClick: () => {
              handleLangItemClick('zh')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: '繁體中文',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'zh-TW',
            onClick: () => {
              handleLangItemClick('zh-TW')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
