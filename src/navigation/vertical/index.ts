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
    title: 'Learn',
    icon: 'hugeicons:online-learning-01',
    path: '/learn'
  },
  {
    title: 'Tool',
    icon: 'carbon:tool-kit',
    path: '/tool'
  },
  {
    title: 'Chat',
    icon: 'material-symbols:chat',
    path: '/chat/room'
  },
  {
    title: 'Token',
    icon: 'material-symbols:token',
    path: '/token'
  }
]

const navigation = (): VerticalNavItemsType => {

  // @ts-ignore
  return ARISNavMenus
}

export default navigation
