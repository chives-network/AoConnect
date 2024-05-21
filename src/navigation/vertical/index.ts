// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const ARISNavMenus = [
  {
    sectionTitle: 'My Portal'
  },
  {
    title: 'Create Wallet',
    icon: 'material-symbols:captive-portal-rounded',
    path: '/mywallets'
  },
  {
    title: 'AR Wallet',
    icon: 'clarity:wallet-solid',
    path: '/wallet/sendout'
  },
  {
    title: 'Learn Center',
    icon: 'hugeicons:online-learning-01',
    path: '/learncenter'
  },
  {
    title: 'Chat Room',
    icon: 'material-symbols:chat',
    path: '/chatroom'
  },
  {
    title: 'Token Cetner',
    icon: 'material-symbols:token',
    path: '/token'
  }
]

const navigation = (): VerticalNavItemsType => {

  // @ts-ignore
  return ARISNavMenus
}

export default navigation
