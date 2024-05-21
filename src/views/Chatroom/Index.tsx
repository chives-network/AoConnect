// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import AppModel from 'src/views/Chatroom/Model'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { getAnonymousUserId } from 'src/functions/ChatBook'


const AllApp = () => {

  // ** Hook
  const [pageid, setPageid] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [app, setApp] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')
  const [appId, setAppId] = useState<string>('')
  
  const [type, setType] = useState<string>("ALL")
  const [search, setSearch] = useState<string>("ALL")

  useEffect(() => {
    getAppsPage()
  }, [])

  const handleSearchFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setApp([])
    setType("ALL")
    setSearch(Item)
    setAppId("")
  }

  const [anonymousUserId, setAnonymousUserId] = useState<string>('')
  useEffect(() => {
    const tempId = getAnonymousUserId()
    setAnonymousUserId(tempId)
  }, [])

  const getAppsPage = async function () {
    const pagesize = 20

    if(loadingAllData == false)  {
      setLoading(true)
      const RS = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/collection/chatroom.json', { headers: { 'Content-Type': 'application/json'} }).then(res=>res.data)
      console.log("RSRSRSRSRS",RS)
      if(RS) {
        const appInitial: string[] = []
        RS.map((Item: any)=>{
          appInitial.push(Item)
        })
        if(RS.length < pagesize && pageid >= 0) {
          setLoadingAllData(true)
        }
        setApp([...app, ...appInitial].filter((element) => element != null))
        setAppId("")
        window.localStorage.setItem(authConfig.AoConnectChatRoom, JSON.stringify([...app, ...appInitial]))
      }
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);  

      return () => {
        clearTimeout(timer);
      };
    }
    else {
      setLoading(true)
      setLoadingText('Finished')
      const timer2 = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => {
        clearTimeout(timer2);
      };
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      setPageid(pageid + 1)

      //getAppsPage();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [app]); 

  return (
    <Fragment>
      <AppModel app={app} loading={loading} loadingText={loadingText} appId={appId} setAppId={setAppId} show={show} setShow={setShow} handleSearchFilter={handleSearchFilter}/>
    </Fragment>
  )
}


export default AllApp
