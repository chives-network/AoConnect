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
    title: 'AOConnect',
    icon: 'streamline:hard-disk-solid',
    path: '/aoconnect/example'
  }
]

const navigation = (): VerticalNavItemsType => {

  // @ts-ignore
  return ARISNavMenus
}

export default navigation
