// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const ARISNavMenus = [
  {
    sectionTitle: 'My Portal'
  },
  {
    title: 'My Wallet',
    icon: 'material-symbols:account-balance-wallet-outline',
    path: '/mywallets'
  },
  {
    title: 'Email',
    icon: 'mdi:email-outline',
    path: '/email'
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
  },
  {
    title: 'Lottery',
    icon: 'fluent:lottery-24-regular',
    path: '/lottery'
  },
  {
    title: 'Debug',
    icon: 'codicon:debug-all',
    path: '/debug'
  },
  {
    title: 'Simulation',
    icon: 'carbon:tool-kit',
    path: '/tool'
  },
  {
    title: 'Setting',
    icon: 'material-symbols:settings-outline',
    path: '/setting'
  }
]

/*

  {
    title: 'Blog',
    icon: 'mdi:blog-outline',
    path: '/blog'
  },
  {
    title: 'Guess',
    icon: 'fluent-mdl2:compare-uneven',
    path: '/guess'
  },


*/

const navigation = (): VerticalNavItemsType => {

  // @ts-ignore
  return ARISNavMenus
}

export default navigation
