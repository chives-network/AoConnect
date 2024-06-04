// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Types
import { AuthValuesType, UserDataType } from './types'

import { getCurrentWalletAddress, getCurrentWallet } from 'src/functions/ChivesWallets'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  currentWallet: null,
  currentAddress: '',
  setAuthContextCurrentAddress: () => Promise.resolve(),
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  
  const [currentWallet, SetCurrentWallet] = useState<null>(defaultProvider.currentWallet)
  const [currentAddress, SetCurrentAddress] = useState<string>(defaultProvider.currentAddress)
  
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const currentAddress: string | undefined = getCurrentWalletAddress();
      console.log("currentAddress", currentAddress)
      if(currentAddress != undefined && currentAddress != null) {
        SetCurrentWallet(getCurrentWallet())
        SetCurrentAddress(currentAddress)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = () => {
    console.log("handleLogin")
  }

  const handleLogout = () => {
    console.log("handleLogout")    
  }

  useEffect(() => {
    const user = {id: 1, role: 'admin', fullName: 'John Doe', username: 'johndoe', email: 'chivesweave@gmail.com'}
    setUser(user as UserDataType)
  }, [])

  const handleCurrentAddress = (Address: string) => {
    SetCurrentAddress(Address)
    SetCurrentWallet(getCurrentWallet())
  }

  const values = {
    user,
    loading,
    currentWallet,
    currentAddress,
    setAuthContextCurrentAddress: handleCurrentAddress,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
