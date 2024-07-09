// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Third Party Import
import Box from '@mui/material/Box'

// ** Axios Imports
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'

import { GetMyLastMsg } from 'src/functions/AoConnect/AoConnect'
import { MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken } from 'src/functions/AoConnect/MyProcessTxIds'

import TokenLeft from 'src/views/Token/TokenLeft'
import TokenIndex from 'src/views/Token/TokenIndex'

import { ansiRegex } from 'src/configs/functions'
import { AoCreateProcessAuto } from 'src/functions/AoConnect/AoConnect'
import { GetAoConnectMyAoConnectTxId, SetAoConnectMyAoConnectTxId } from 'src/functions/AoConnect/MsgReminder'

const TokenModel = () => {
  // ** Hook

  // ** States

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  // ** Vars
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const tokenLeftWidth = smAbove ? 270 : 200

  const { skin } = settings
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))

  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const [tokenLeft, setTokenLeft] = useState<any[]>([])
  const [counter, setCounter] = useState<number>(0)
  const [searchToken, setSearchToken] = useState<string>('')
  const [loadingGetTokens, setLoadingGetTokens] = useState<boolean>(true)
  const [addTokenButtonText, setAddTokenButtonText] = useState<string>('Add Favorite')
  const [addTokenButtonDisabled, setAddTokenButtonDisabled] = useState<boolean>(false)
  const [addTokenFavorite, setAddTokenFavorite] = useState<boolean>(false)
  const [tokenCreate, setTokenCreate] = useState<any>({ openCreateToken: false, FormSubmit: 'Submit', isDisabledButton: false })
  const [tokenGetInfor, setTokenGetInfor] = useState<any>({ openSendOutToken: false, disabledSendOutButton:false, FormSubmit: 'Submit', isDisabledButton: false })
  
  const [cancelTokenButtonText, setCancelTokenButtonText] = useState<string>('Cancel Favorite')
  const [cancelTokenButtonDisabled, setCancelTokenButtonDisabled] = useState<boolean>(false)
  const [cancelTokenFavorite, setCancelTokenFavorite] = useState<boolean>(false)
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  
  const [myAoConnectTxId, setMyAoConnectTxId] = useState<string>('')
  useEffect(() => {
    const fetchData = async () => {
        if(currentAddress && currentAddress.length === 43) {
            const MyProcessTxIdData: string = GetAoConnectMyAoConnectTxId(currentAddress);
            if(MyProcessTxIdData && MyProcessTxIdData.length === 43) {
                setMyAoConnectTxId(MyProcessTxIdData);
            }
            if(MyProcessTxIdData === '') {
                const ChivesMyAoConnectProcessTxId = await AoCreateProcessAuto(currentWallet.jwk);
                if(ChivesMyAoConnectProcessTxId) {
                    console.log("ChivesMyAoConnectProcessTxId", ChivesMyAoConnectProcessTxId);
                    SetAoConnectMyAoConnectTxId(currentAddress, ChivesMyAoConnectProcessTxId);
                    setMyAoConnectTxId(ChivesMyAoConnectProcessTxId);
                }
            }
        }
    };
    fetchData();
  }, [currentAddress]);

  useEffect(() => {
    if(myAoConnectTxId && myAoConnectTxId.length == 43 && currentAddress && currentAddress.length == 43 && myAoConnectTxId!= currentAddress ) {      
      handleGetTokenInfo()
    }
  }, [myAoConnectTxId, counter, currentAddress])


  const handleGetTokenInfo = async () => {
    setLoadingGetTokens(true)
    const MyProcessTxIdsGetTokensData = await MyProcessTxIdsGetTokens(authConfig.AoConnectMyProcessTxIds, myAoConnectTxId);
    if (MyProcessTxIdsGetTokensData) {
        console.log("MyProcessTxIdsGetTokensData", MyProcessTxIdsGetTokensData);
        const TokenList = Object.values(MyProcessTxIdsGetTokensData);
        if (TokenList) {
            const filteredTokens = TokenList.filter((token: any) => token && token?.TokenData && token?.TokenId && token?.TokenId?.length == 43);
            const filteredTokensData = filteredTokens.map((token: any) => {
              try {
                  const parsedTokenData = JSON.parse(token.TokenData);

                  return { ...token, TokenData: parsedTokenData };
              } 
              catch (error) {

                  return { ...token, TokenData: null };
              }
            });
            const filteredTokensDataNew = filteredTokensData.filter((token: any) => token.TokenData);
            filteredTokensDataNew.sort((a: any, b: any) => {
              return Number(a.TokenSort) - Number(b.TokenSort);
            });
            if (filteredTokensDataNew.length > 0) {
              setTokenLeft(filteredTokensDataNew);
              console.log("tokenLeft filteredTokensDataNew", filteredTokensDataNew);
            }
        }
    }
    setLoadingGetTokens(false)
  }


  const handleAddToken = async (WantToSaveTokenProcessTxId: string) => {
    if(tokenInfo)  {
      setAddTokenButtonDisabled(true)
      setAddTokenButtonText('waiting')
      const WantToSaveTokenProcessTxIdData = await MyProcessTxIdsAddToken(currentWallet.jwk, authConfig.AoConnectMyProcessTxIds, myAoConnectTxId, WantToSaveTokenProcessTxId, tokenGetInfor?.Sort ?? '10', 'My Tokens', JSON.stringify(tokenInfo).replace(/"/g, '\\"') )
      if(WantToSaveTokenProcessTxIdData) {
        setAddTokenButtonText('Have add')
        console.log("WantToSaveTokenProcessTxIdData", WantToSaveTokenProcessTxIdData)
        if(WantToSaveTokenProcessTxIdData?.msg?.Output?.data?.output)  {
          setCounter(counter + 1)
          const formatText = WantToSaveTokenProcessTxIdData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {
            const MyProcessTxIdsAddTokenData1 = await GetMyLastMsg(currentWallet.jwk, WantToSaveTokenProcessTxId)
            if(MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output)  {
              const formatText2 = MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                toast.success(formatText2, {
                  duration: 2000
                })
              }
            }

          }

        }
      }
    }
  }

  const handleCancelFavoriteToken = async (WantToSaveTokenProcessTxId: string) => {
    setCancelTokenButtonDisabled(true)
    setCancelTokenButtonText('waiting')
    const WantToSaveTokenProcessTxIdData = await MyProcessTxIdsDelToken(currentWallet.jwk, authConfig.AoConnectMyProcessTxIds, myAoConnectTxId, WantToSaveTokenProcessTxId)
    if(WantToSaveTokenProcessTxIdData) {
      console.log("WantToSaveTokenProcessTxIdData", WantToSaveTokenProcessTxIdData)
      if(WantToSaveTokenProcessTxIdData?.msg?.Output?.data?.output)  {
        setCounter(counter + 1)
        setCancelTokenButtonText('Have cancel')
        const formatText = WantToSaveTokenProcessTxIdData?.msg?.Output?.data?.output.replace(ansiRegex, '');
        if(formatText) {

          //Read message from inbox
          const MyProcessTxIdsDelTokenData1 = await GetMyLastMsg(currentWallet.jwk, WantToSaveTokenProcessTxId)
          if(MyProcessTxIdsDelTokenData1?.msg?.Output?.data?.output)  {
            const formatText2 = MyProcessTxIdsDelTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
            if(formatText2) {
              toast.success(formatText2, {
                duration: 2000
              })
            }
          }

        }

      }
    }
  }
  

  
  return (
    <Fragment>
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >

        <Fragment>
          <TokenLeft
            myAoConnectTxId={myAoConnectTxId}
            hidden={hidden}
            mdAbove={mdAbove}
            tokenLeftWidth={tokenLeftWidth}
            tokenLeft={tokenLeft}
            searchToken={searchToken}
            setSearchToken={setSearchToken}
            loadingGetTokens={loadingGetTokens}
            setAddTokenButtonText={setAddTokenButtonText}
            setAddTokenButtonDisabled={setAddTokenButtonDisabled}
            addTokenFavorite={addTokenFavorite}
            setAddTokenFavorite={setAddTokenFavorite}
            tokenCreate={tokenCreate}
            setTokenCreate={setTokenCreate}
            leftSidebarOpen={leftSidebarOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            setTokenGetInfor={setTokenGetInfor}
            setCancelTokenFavorite={setCancelTokenFavorite}
          />
          {myAoConnectTxId && myAoConnectTxId.length == 43 && (
            <TokenIndex 
              myAoConnectTxId={myAoConnectTxId}
              tokenLeft={tokenLeft}
              tokenInfo={tokenInfo}
              setTokenInfo={setTokenInfo}
              handleAddToken={handleAddToken}
              handleCancelFavoriteToken={handleCancelFavoriteToken}
              searchToken={searchToken}
              setSearchToken={setSearchToken}
              addTokenButtonText={addTokenButtonText}
              addTokenButtonDisabled={addTokenButtonDisabled}
              addTokenFavorite={addTokenFavorite}
              tokenCreate={tokenCreate}
              setTokenCreate={setTokenCreate}
              counter={counter}
              setCounter={setCounter}
              tokenGetInfor={tokenGetInfor}
              setTokenGetInfor={setTokenGetInfor}
              setAddTokenFavorite={setAddTokenFavorite}
              setAddTokenButtonText={setAddTokenButtonText}
              setAddTokenButtonDisabled={setAddTokenButtonDisabled}
              cancelTokenButtonText={cancelTokenButtonText}
              cancelTokenButtonDisabled={cancelTokenButtonDisabled}
              cancelTokenFavorite={cancelTokenFavorite}
              setCancelTokenFavorite={setCancelTokenFavorite}
              setCancelTokenButtonText={setCancelTokenButtonText}
              setCancelTokenButtonDisabled={setCancelTokenButtonDisabled}
            />
          )}
        </Fragment>

      </Box>
    </Fragment>
  )
}

export default TokenModel
