import { generateMnemonic, validateMnemonic } from 'bip39-web-crypto';
import { getKeyPairFromMnemonic } from 'human-crypto-keys'

import { PromisePool } from '@supercharge/promise-pool'

import type { JWKInterface } from 'arweave/web/lib/wallet'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { BalancePlus } from 'src/functions/AoConnect/AoConnect'

// @ts-ignore
import { v4 } from 'uuid'
import BigNumber from 'bignumber.js'

import Arweave from 'arweave'

// ** Third Party Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

const arweave = Arweave.init(urlToSettings(authConfig.backEndApi))

const chivesWallets: string = authConfig.chivesWallets
const chivesCurrentWallet: string = authConfig.chivesCurrentWallet
const chivesWalletNickname: string = authConfig.chivesWalletNickname
const chivesTxStatus: string = authConfig.chivesTxStatus
const chivesLanguage: string = authConfig.chivesLanguage
const chivesProfile: string = authConfig.chivesProfile
const chivesReferee: string = authConfig.chivesReferee
const chivesContacts: string = authConfig.chivesContacts


export async function generateNewMnemonicAndGetWalletData (mnemonic: string) {
    try {
        let newMnemonic = mnemonic
        if(newMnemonic == undefined || newMnemonic == "")  {
            newMnemonic = await generateMnemonic();
        }
        const isValidMnemonic = await validateMnemonic(newMnemonic);
        if(isValidMnemonic) {
            
            //console.log("validateMnemonic:", newMnemonic)
            
            const mnemonicToJwkValue = await mnemonicToJwk(newMnemonic)
            
            //console.log("mnemonicToJwkValue:", mnemonicToJwkValue)
            
            //Get Wallet Data From LocalStorage
            const chivesWalletsList = window.localStorage.getItem(chivesWallets)     
            const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
            
            //Get Wallet Max Id
            let walletId = 0
            while (walletExists.find((w: any) => +w.id === walletId)) { walletId++ }
            
            //Make walletData
            const walletData: any = {...mnemonicToJwkValue}
            walletData.id ??= walletId
            walletData.uuid ??= v4() as string
            walletData.settings ??= {}
            walletData.state ??= {"hot": true}
            
            //Make Addresss From Jwk
            const key = await arweave.wallets.jwkToAddress(walletData.jwk as any)
            const publicKey = walletData.jwk.n
            walletData.data ??= {}
            walletData.data.arweave = { key, publicKey }            
            
            //Write New Wallet Data to LocalStorage
            walletExists.push(walletData)
            window.localStorage.setItem(chivesWallets, JSON.stringify(walletExists))

            //const addFileToJwkValue = await addFileToJwk('')
            //console.log("addImportDataValue:", addImportDataValue)

            return walletData
        }
        else {
            
            //Error Mnemonic
            return null;
        }
    } catch (error) {
        console.log('Error generateNewMnemonicAndGetJwk:', error);
    }
};

export async function jwkToAddress (jwk: any) {

    return await arweave.wallets.jwkToAddress(jwk as any)
}

export async function importWalletJsonFile (wallet: any) {

    const mnemonicToJwkValue: any = {}
    mnemonicToJwkValue.jwk = wallet

    //Get Wallet Data From LocalStorage
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)      
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    
    //Get Wallet Max Id
    let walletId = 0
    while (walletExists.find((w: any) => +w.id === walletId)) { walletId++ }
    
    //Make walletData
    const walletData: any = {...mnemonicToJwkValue}
    walletData.id ??= walletId
    walletData.uuid ??= v4() as string
    walletData.settings ??= {}
    walletData.state ??= {"hot": true}
    
    //Make Addresss From Jwk
    const key = await arweave.wallets.jwkToAddress(walletData.jwk as any)
    const publicKey = walletData.jwk.n
    walletData.data ??= {}
    walletData.data.arweave = { key, publicKey }            
    
    //Write New Wallet Data to LocalStorage
    walletExists.push(walletData)
    window.localStorage.setItem(chivesWallets, JSON.stringify(walletExists))

    //const addFileToJwkValue = await addFileToJwk('')
    //console.log("addImportDataValue:", addImportDataValue)

    return walletData
};

export async function checkMnemonicValidity (newMnemonic: string) {
    try {
        return await validateMnemonic(newMnemonic);
    } catch (error) {
      console.error('Error checkMnemonicValidity:', error);
    }
};

export async function mnemonicToJwk (mnemonic: string) {
    try {
      
      //console.log('make keyPair waiting ......................', mnemonic);
      
      const keyPair = await getKeyPairFromMnemonic(mnemonic, { id: 'rsa', modulusLength: 4096 }, { privateKeyFormat: 'pkcs8-der' })
      
      //console.log("keyPair.privateKey", keyPair.privateKey)
      
      const jwk = await pkcs8ToJwk(keyPair.privateKey) as JWKInterface
      
      //console.log("jwk...............", jwk)
      
      return { jwk }
    } catch (error) {
      console.log('Error mnemonicToJwk:', error);
    }
};

export async function addFileToJwk (keyfile: string) {
    try {
        const data = keyfile != null && keyfile != '' && JSON.parse(keyfile) as JWKInterface
		const jwk = data || await arweave.wallets.generate()
		
        return { jwk }
    } catch (error) {
      console.log('Error mnemonicToJwk:', error);
    }
};

export function urlToSettings (url: string) {
    const obj = new URL(url)
    const protocol = obj.protocol.replace(':', '')
    const host = obj.hostname
    const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
    
    return { protocol, host, port }
};


export function getAllWallets() {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
        
        return walletExists
    }
};

export function getCurrentWalletAddress() {
    if(typeof window !== 'undefined')  {
        const CurrentWalletAddress = window.localStorage.getItem(chivesCurrentWallet)
        if(CurrentWalletAddress == undefined) {
            const chivesWalletsList = window.localStorage.getItem(chivesWallets)
            const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
            if(walletExists && walletExists[0] && walletExists[0].data && walletExists[0].data.arweave && walletExists[0].data.arweave.key) {
                window.localStorage.setItem(chivesCurrentWallet, walletExists[0].data.arweave.key)
            }
        }    
        
        return String(CurrentWalletAddress)
    }
};

export function getCurrentWallet() {
    const CurrentWalletAddress = window.localStorage.getItem(chivesCurrentWallet)

    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    let foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === CurrentWalletAddress);
    
    if(foundWallet == undefined && walletExists && walletExists[0] && walletExists[0].data && walletExists[0].data.arweave && walletExists[0].data.arweave.key) {
        foundWallet = walletExists[0]
        window.localStorage.setItem(chivesCurrentWallet, walletExists[0].data.arweave.key)
    }

    return foundWallet
};

export function setCurrentWallet(Address: string) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === Address);
    
    if(foundWallet && foundWallet.data && foundWallet.data.arweave && foundWallet.data.arweave.key) {
        window.localStorage.setItem(chivesCurrentWallet, Address)
    }

    return true
};

export function setWalletNickname(Address: string, Nickname: string) {
    if (Address && Address.length === 43) {
        const chivesWalletNicknameData = window.localStorage.getItem(chivesWalletNickname)
        const chivesWalletNicknameObject = chivesWalletNicknameData ? JSON.parse(chivesWalletNicknameData) : {}
        chivesWalletNicknameObject[Address] = Nickname
        window.localStorage.setItem(chivesWalletNickname, JSON.stringify(chivesWalletNicknameObject))
    }
    
    return true
}

export function getWalletNicknames() {
    if(typeof window !== 'undefined')  {
        const chivesWalletNicknameData = window.localStorage.getItem(chivesWalletNickname)
        const chivesWalletNicknameObject = chivesWalletNicknameData ? JSON.parse(chivesWalletNicknameData) : {}
        
        return chivesWalletNicknameObject
    }
}

export function getWalletById(WalletId: number) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => Number(wallet.id) === WalletId);
    
    return foundWallet
};

export function getWalletByUuid(Uuid: string) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.uuid === Uuid);
    
    return foundWallet
};

export function getWalletByAddress(Address: string) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === Address);
    
    return foundWallet
};

export function deleteWalletById(WalletId: number) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const leftWallets = walletExists.filter((wallet: any) => Number(wallet.id) !== WalletId);
    window.localStorage.setItem(chivesWallets, JSON.stringify(leftWallets))
    
    return true
};

export function deleteWalletByWallet(WalletJwk: any) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const leftWallets = walletExists.filter((wallet: any) => wallet.jwk.n !== WalletJwk.n);
    window.localStorage.setItem(chivesWallets, JSON.stringify(leftWallets))
    
    return true
};



export async function getWalletBalance(Address: string) {    
    try {

        return arweave.ar.winstonToAr(await arweave.wallets.getBalance(Address))
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getWalletBalanceWinston(Address: string) {
    try {

        return await arweave.wallets.getBalance(Address)
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getPrice(byteSize: number) {
    try {

        return arweave.ar.winstonToAr(await arweave.transactions.getPrice(byteSize))
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getPriceWinston(byteSize: number) {
    try {

        return await arweave.transactions.getPrice(byteSize)
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getWalletBalanceReservedRewards(Address: string) {
    try {
        const reserved_rewards_total = await axios.get(authConfig.backEndApi + '/wallet/' + Address + '/reserved_rewards_total' ).then(res=>res.data);

        return arweave.ar.winstonToAr(reserved_rewards_total)
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getTxsInMemory() {
    try {
        if(authConfig.tokenType == "XWE")           {
            const response = await axios.get(authConfig.backEndApi + '/tx/pending/record' ).then(res=>res.data);
            if(response && response.length>0) {
                const SendTxsInMemory: any = {}
                const ReceiveTxsInMemory: any = {}
                for (const item of response) {
                    if(SendTxsInMemory[item.owner.address])  {
                        SendTxsInMemory[item.owner.address] = BalancePlus(Number(item.quantity.xwe), Number(SendTxsInMemory[item.owner.address]))
                    }
                    else {
                        SendTxsInMemory[item.owner.address] = Number(item.quantity.xwe)
                    }
                    if(ReceiveTxsInMemory[item.recipient])  {
                        ReceiveTxsInMemory[item.recipient] = BalancePlus(Number(item.quantity.xwe), Number(ReceiveTxsInMemory[item.recipient]))
                    }
                    else {
                        ReceiveTxsInMemory[item.recipient] = Number(item.quantity.xwe)
                    }
                }
                
                return {send: SendTxsInMemory, receive: ReceiveTxsInMemory}
            }
        }
    } 
    catch (e) { 
        console.warn('getTxsInMemory failed') 
    }
}

export async function getXweWalletAllTxs(Address: string, Type: string, pageId = 0, pageSize = 10) {

    let addressApiType = ''
    switch(Type) {
        case 'AllTxs':
            addressApiType = "txsrecord";
            break;
        case 'Sent':
            addressApiType = "send";
            break;
        case 'Received':
            addressApiType = "deposits";
            break;
        case 'Files':
            addressApiType = "datarecord";
            break;
    }
    try {
        if(addressApiType && addressApiType!="" && Address && Address.length == 43)  {
            const response = await axios.get(authConfig.backEndApi + '/wallet/' + `${Address}` + '/' + `${addressApiType}` + '/' + `${pageId}` + '/' + pageSize).then(res=>res.data)
            const NewData: any[] = response.data.filter((record: any) => record.recipient)
            response.data = NewData
            
            return response
        }
    } 
    catch (e) { 
        console.warn('getXweWalletAllTxs failed') 
    }

}

export function winstonToAr(winston: string) {
    
    return arweave.ar.winstonToAr(winston)
}

export function arToWinston(ar: string) {
    
    return arweave.ar.arToWinston(ar)
}

export function isAddress(address: string) {
    return !!address?.match(/^[a-z0-9_-]{43}$/i)
}

export function downloadTextFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function downloadUrlFile(url: string, fileName: string, mimeType: string) {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function removePunctuation(text: string) {
    if(text) {
        return String(text).replace(/[^\w\s\u4e00-\u9fa5]/g, '');
    }
    else {
        return "";
    }
}

export async function readFile (file: File) {
    return new Promise<Uint8Array>((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => resolve(new Uint8Array(e.target?.result as any))
      fileReader.onerror = (e) => reject(e)
      fileReader.readAsArrayBuffer(file)
    })
}

export async function readFileText(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.onerror = (e) => reject(e);
        fileReader.readAsText(file);
    });
}

export async function sendAmount(walletData: any, target: string, amount: string, tags: any, data: string | Uint8Array | ArrayBuffer | undefined, fileName: string, setUploadProgress: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>) {
    const quantity = amount && amount.length > 0 && amount != "" ? arweave.ar.arToWinston(new BigNumber(amount).toString()) : '0' ;

    //Check Fee and Send Amount must smaller than wallet balance

    const txSettings:any = {}
    if(target && target.length == 43 && Number(quantity) > 0) {
	    txSettings.target = target
        txSettings.quantity = quantity
    }
	if (data && data != undefined && data != '') { txSettings.data = data }

    //Make Tx Data
    const tx = await arweave.createTransaction(txSettings)
    
    //Add Tags
    for (const tag of tags || []) { tx.addTag(tag.name, tag.value) }
    
    await arweave.transactions.sign(tx, walletData.jwk);
    const currentFee = await getPriceWinston(Number(tx.data_size))
    const currentBalance = await getWalletBalanceWinston(walletData.data.arweave.key)

    if(Number(currentBalance) < (Number(currentFee) + Number(quantity)) )       {

        return { status: 800, statusText: 'Insufficient balance, need: ' + winstonToAr(String(Number(currentFee) + Number(quantity))) }
    }
    
    //console.log('currentBalance', currentBalance);
    //console.log('currentFee', currentFee);
    //console.log('quantity', Number(quantity));

    if (!tx.chunks?.chunks?.length) { 
		const txResult = await arweave.transactions.post(tx);
		if(txResult.status==200) {
			console.log('Transaction sent', txResult);
            
            //Update the upload process
            fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
                
                return {
                ...prevProgress,
                [fileName]: 100,
                };
            });
		}
		else if(txResult.status==400) {
			console.error(txResult.statusText, txResult); 
		}
		else {			
			console.log('Unknow error', txResult);
		}

		return txResult; 
	}

    //Upload Data if have Chunks
    const UploadChunksStatus: any = {}
    const uploader = await arweave.transactions.getUploader(tx)
	const storageKey = 'uploader:' + tx.id
	localStorage.setItem(storageKey, JSON.stringify(uploader))
	UploadChunksStatus[tx.id] ??= {}
	UploadChunksStatus[tx.id].upload = 0
    console.log('Begin upload data txid', tx.id)
    
    //console.log('uploader begin: ', uploader)
    let uploadRecords = 0
	while (!uploader.isComplete) {
		await uploader.uploadChunk()
		localStorage.setItem(storageKey, JSON.stringify(uploader))
		UploadChunksStatus[tx.id].upload = uploader.pctComplete
        
        //Update the upload process
        fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
            
            return {
            ...prevProgress,
            [fileName]: uploader.pctComplete,
            };
        });
		
        //console.log("uploader processing: ",uploadRecords, uploader.pctComplete)
        uploadRecords = uploadRecords + 1
	}
	if(uploader.isComplete) {
		localStorage.removeItem(storageKey)
		setTimeout(() => delete UploadChunksStatus[tx.id], 1000)
		console.log('Transaction sent: ', tx)
        
        //Update the upload process
        fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
            
            return {
            ...prevProgress,
            [fileName]: uploader.pctComplete,
            };
        });
	}
	else {
		console.error('Transaction error', tx)
	}

    //console.log('uploader end: ', uploader)
    //console.log('UploadChunksStatus: ', UploadChunksStatus)

    return tx; 
}

export function encode (text: string) {
	const encoder = new TextEncoder()
	
    return encoder.encode(text)
}

export function decode (buffer: BufferSource) {
	const decoder = new TextDecoder()
	
    return decoder.decode(buffer)
}

export async function getHash (data: string | Uint8Array) {
	const content = typeof data === 'string' ? encode(data) : data
	const buffer = await window.crypto.subtle.digest('SHA-256', content)
	
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('')
}

export async function getProcessedData(walletData: any, walletAddress: string, data: any, Manifest: boolean, BundleTypeArray: string[]): Promise<ArTxParams['data']> {
	if (typeof data === 'string') { return data }
    console.log("getProcessedData Input File Data:", data)
	if (!walletData) { throw 'multiple files unsupported for current account' }
    if (walletData && walletData.jwk && data && data.length > 0) {
        const bundleItems: any[] = []
        let dataItems: any = null
        if(BundleTypeArray && BundleTypeArray[0] && BundleTypeArray[1])  {
            //Profile
            const BundleTypeMap: any = {}
            const dataItemsMain = data.slice(0, -1);
            const dataItemsList = await Promise.all(dataItemsMain.map((item: any) => createDataItem(walletData, item)))
            console.log("dataItemsList", dataItemsList)
            dataItemsList.map((item: any, index: number)=>{
                if(item && item?.id!=undefined && item?.id.length == 43) {
                    BundleTypeMap[BundleTypeArray[index]] = item?.id
                }
            })
            const dataContent = data.slice(-1)[0]  
            console.log("dataContent", dataContent)
            console.log("BundleTypeMap", BundleTypeMap)  
            const jsonData = JSON.parse(dataContent['data'])
            if(BundleTypeMap['Avatar'] != undefined && BundleTypeMap['Avatar'].length == 43)      {
                jsonData['Avatar'] = BundleTypeMap['Avatar']
            }
            if(BundleTypeMap['Banner'] != undefined && BundleTypeMap['Banner'].length == 43)      {
                jsonData['Banner'] = BundleTypeMap['Banner']
            }
            const jsonDataNew: any[] = [{...dataContent, ['data']: JSON.stringify(jsonData)}]
            console.log("jsonDataNew____________________", jsonDataNew)
            const dataContentList = await Promise.all(jsonDataNew.map((item: any) => createDataItem(walletData, item)))  
            console.log("dataContentList", dataContentList)  
            dataItems = dataItemsList.concat(dataContentList) 
            console.log("dataItems______________________", dataItems)  
            
        }
        else {
            //Other Case
            dataItems = await Promise.all(data.map((item: any) => createDataItem(walletData, item)))
        }
        
        //dataItems.map((item: any)=>{
        //    console.log("getProcessedData item id:", item?.id)
        //})
        
        const trustedAddresses = walletAddress ? [walletAddress] : []
        const deduplicated = await deduplicate(dataItems, trustedAddresses)
        const deduplicatedDataItems = dataItems.map((item: any, i: number) => deduplicated[i] || item)
        console.log("getProcessedData deduplicatedDataItems:", deduplicatedDataItems)
        bundleItems.push(...deduplicatedDataItems.filter((item: any): item is Exclude<typeof item, string> => typeof item !== 'string'))
        console.log("getProcessedData bundleItems 1:", bundleItems)
        if(Manifest)  {
            try {
                const paths = data.map((item: any) => item.path || '')
                const index = paths.find((path: any) => path === 'index.html')
                const manifest = generateManifest(paths, deduplicatedDataItems, index)
                bundleItems.push(await createDataItem(walletData, { ...manifest }))
                console.log("getProcessedData bundleItems 2:", bundleItems)
            } 
            catch (e) { 
                console.warn('manifest generation failed') 
            }
        }
        
        return (await createBundle(walletData, bundleItems)).getRaw()
    }
    else { 
        throw 'multiple files unsupported for '
    }
}


//Check File Hash from mainnet, if file have exist on mainnet, should not upload
async function deduplicate (transactions: ArDataItemParams[], trustedAddresses?: string[]): Promise<Array<string | undefined>> {
	const entries = (await PromisePool.for(transactions).withConcurrency(5).process(async tx =>
		({ tx, hash: tx.tags?.find(tag => tag.name === 'File-Hash')?.value || await getHash(tx.data) }))).results
	const chunks = [] as typeof entries[]
	while (entries.length) { chunks.push(entries.splice(0, 500)) }
	
    return (await PromisePool.for(chunks).withConcurrency(3).process(async chunk => {
        const checkResultOnMainnet: any[] = await axios.get(authConfig.backEndApi + '/statistics_network', { headers: { }, params: { } })
                                .then(() => {
                                        
                                        //console.log("deduplicate in lib", res.data)
                                        
                                        return []
                                    }
                                )

		return (await PromisePool.for(chunk).withConcurrency(3).process(async entry => {
            const result = checkResultOnMainnet
				.filter((tx: any) => tx.tags.find((tag: any) => tag.name === 'File-Hash' && tag.value === entry.hash))
				.filter((tx: any) => !entry.tx.tags || hasMatchingTags(entry.tx.tags, tx.tags))
			for (const tx of result) {
				const verified = trustedAddresses ? trustedAddresses.includes(tx.owner.address) : await verifyData(entry.hash, tx.id)
				if (verified) { return tx }
			}
		})).results
	})).results.flat().map(tx => tx?.node.id)
}


export function hasMatchingTags(requiredTags: { name: string; value: string }[], existingTags: { name: string; value: string }[]): boolean {
	
    return !requiredTags.find(requiredTag => !existingTags.find(existingTag =>
		existingTag.name === requiredTag.name && existingTag.value === requiredTag.value))
}

async function verifyData (hash: string, id: string) {
    console.log("verifyData", hash, id)
} // todo store verification results in cache

export async function getSize (data: any, processedData: any): Promise<number> {
	if (typeof data === 'string') { return data.length }
	const processed = processedData
	if (processed == undefined) { throw 'Error' }
	if (typeof processed === 'string') { return data.length }
	
    return ArrayBuffer.isView(processed) ? processed?.byteLength : new Uint8Array(processed).byteLength
}

export function generateManifest (localPaths: string[], transactions: Array<{ id: string } | string>, index?: string) {
	if (localPaths.length !== transactions.length) { throw 'Length mismatch' }
	if (index && !localPaths.includes(index)) { throw 'Unknown index' }
	const paths = {} as { [key: string]: { id: string } }
	localPaths.forEach((path, i) => {
		if (!path) { throw 'Path undefined' }
		const tx = transactions[i]
		const id = typeof tx === 'string' ? tx : tx.id
		paths[path] = { id }
	})
	const indexParam = index ? { index: { path: index } } : {}
	
    return {
		data: JSON.stringify({
			manifest: 'chivesweave/paths',
			version: '0.1.0',
			...indexParam,
			paths,
		}),
		tags: [{ name: 'Content-Type', value: 'application/x.chivesweave-manifest+json' }]
	}
}

async function createDataItem (walletData: any, item: ArDataItemParams) {
    // @ts-ignore
    const { createData, signers } = await import('../../scripts/arbundles')
    const { data, tags, target } = item
    const signer = new signers.ArweaveSigner(walletData.jwk)
    const anchor = arweave.utils.bufferTob64(crypto.getRandomValues(new Uint8Array(32))).slice(0, 32)
    const dataItem = createData(data, signer, { tags, target, anchor })
    await dataItem.sign(signer)
    
    return dataItem
}

export async function createDataItemSigner (walletDataJwk: any, item: ArDataItemParams) {
    // @ts-ignore
    const { createData, signers } = await import('../../scripts/arbundles')
    const { data, tags, target } = item
    const signer = new signers.ArweaveSigner(walletDataJwk)
    const anchor = arweave.utils.bufferTob64(crypto.getRandomValues(new Uint8Array(32))).slice(0, 32)
    const dataItem = createData(data, signer, { tags, target, anchor })
    await dataItem.sign(signer)
    
    return {
        id: dataItem.id,
        raw: dataItem.getRaw()
    }
}


async function createBundle (walletData: any, items: Awaited<ReturnType<typeof createDataItem>>[]) {
    // @ts-ignore
    const { bundleAndSignData, signers } = await import('../../scripts/arbundles')
    const signer = new signers.ArweaveSigner(walletData.jwk)
    
    return bundleAndSignData(items, signer)
}

export async function pkcs8ToJwk (key: Uint8Array) {
	const imported = await window.crypto.subtle.importKey('pkcs8', key, { name: 'RSA-PSS', hash: 'SHA-256' }, true, ['sign'])
	const jwk = await window.crypto.subtle.exportKey('jwk', imported)
	delete jwk.key_ops
	delete jwk.alg

	return jwk
}

export async function getDecryptionKey (key: JsonWebKey, hash = 'SHA-256') {
	const jwk = { ...key }
	delete jwk.key_ops
	delete jwk.alg

	return window.crypto.subtle.importKey('jwk', jwk, { name: 'RSA-OAEP', hash }, false, ['decrypt'])
}

export async function getEncryptionKey (n: string, hash = 'SHA-256') {
	const jwk = { kty: "RSA", e: "AQAB", n, alg: "RSA-OAEP-256", ext: true }

	return window.crypto.subtle.importKey('jwk', jwk, { name: 'RSA-OAEP', hash }, false, ['encrypt'])
}

export async function encryptWithPublicKey(publicKeyString: string, plaintext: string) {
	const publicKey = await getEncryptionKey(publicKeyString);
	const encodedText = new TextEncoder().encode(plaintext);
	const encryptedData = await window.crypto.subtle.encrypt(
		{
		name: 'RSA-OAEP',
		},
		publicKey,
		encodedText
	);
    const uint8Array = new Uint8Array(encryptedData);
    const base64String = Buffer.from(uint8Array).toString('base64');

	return base64String;
}

export async function decryptWithPrivateKey(privateKeyJwk: any, encryptedData: string) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const arrayBuffer = buffer.buffer;
	const privateKey = await getDecryptionKey(privateKeyJwk);
	console.log("privateKey", privateKey)
	const decryptedData = await window.crypto.subtle.decrypt(
		{
		name: 'RSA-OAEP',
		},
		privateKey,
		arrayBuffer
	);
	console.log("decryptedData", decryptedData)
	const decryptedText = new TextDecoder().decode(decryptedData);

	return decryptedText;
}


//#########################################################################################################################################
export async function TrashMultiFiles(FileTxList: TxRecordType[]) {
    return await ChangeMultiFilesFolder(FileTxList, "Trash", "");
}

export async function FolderMultiFiles(FileTxList: TxRecordType[], Target: string) {
    return await ChangeMultiFilesFolder(FileTxList, Target, "");
}

export async function SpamMultiFiles(FileTxList: TxRecordType[]) {
    return await ChangeMultiFilesFolder(FileTxList, "Spam", "");
}

export async function RegisterAgentAction(Address: string, Level: string) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    ChivesDriveActionsMap['Agent'] = {...ChivesDriveActionsMap['Agent'], [Address] : Level}
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
    console.log("ChivesDriveActionsMap", ChivesDriveActionsMap)
}

export async function RegisterRefereeAction(Address: string, Referee: string) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    ChivesDriveActionsMap['Referee'] = {...ChivesDriveActionsMap['Referee'], [Address] : Referee}
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
    console.log("ChivesDriveActionsMap", ChivesDriveActionsMap)
}

export async function StarMultiFiles(FileTxList: TxRecordType[]) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    FileTxList.map((FileTx: any)=>{
        ChivesDriveActionsMap['Star'] = {...ChivesDriveActionsMap['Star'], [FileTx.id] : true}
        ChivesDriveActionsMap['Data'] = {...ChivesDriveActionsMap['Data'], [FileTx.id] : FileTx}
    })
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
    console.log("ChivesDriveActionsMap", ChivesDriveActionsMap)
}

export async function UnStarMultiFiles(FileTxList: TxRecordType[]) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    FileTxList.map((FileTx: any)=>{
        ChivesDriveActionsMap['Star'] = {...ChivesDriveActionsMap['Star'], [FileTx.id] : false}
        ChivesDriveActionsMap['Data'] = {...ChivesDriveActionsMap['Data'], [FileTx.id] : FileTx}
    })
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
    console.log("ChivesDriveActionsMap", ChivesDriveActionsMap)
}

export async function ChangeMultiFilesFolder(FileTxList: TxRecordType[], EntityType: string, folder: any) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    FileTxList.map((FileTx: any)=>{
        ChivesDriveActionsMap['Folder'] = {...ChivesDriveActionsMap['Folder'], [FileTx.id] : EntityType}
        ChivesDriveActionsMap['Data'] = {...ChivesDriveActionsMap['Data'], [FileTx.id] : FileTx}
    })
    if(EntityType == "Trash") {
        ChivesDriveActionsMap['FolderList'] = {...ChivesDriveActionsMap['FolderList'], ['Trash'] : {'id':'Trash', 'name':'Trash'}}
    }
    else if(EntityType == "Spam") {
        ChivesDriveActionsMap['FolderList'] = {...ChivesDriveActionsMap['FolderList'], ['Spam'] : {'id':'Spam', 'name':'Spam'}}
    }
    else {
        ChivesDriveActionsMap['FolderList'] = {...ChivesDriveActionsMap['FolderList'], [folder.id] : folder}
    }
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
    console.log("ChivesDriveActionsMap", ChivesDriveActionsMap)
}

export async function ChangeMultiFilesLabel(FileTxList: TxRecordType[], EntityType: string) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    FileTxList.map((FileTx: any)=>{
        ChivesDriveActionsMap['Label'] = {...ChivesDriveActionsMap['Label'], [FileTx.id] : EntityType}
        ChivesDriveActionsMap['Data'] = {...ChivesDriveActionsMap['Data'], [FileTx.id] : FileTx}
    })
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
    console.log("ChivesDriveActionsMap", ChivesDriveActionsMap)
}

export async function CreateFolder(folderName: string, folderNameParent: string) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    const FolderMap: any = {}
    FolderMap['parent'] = folderNameParent
    FolderMap['name'] = folderName
    ChivesDriveActionsMap['CreateFolder'] = {...ChivesDriveActionsMap['CreateFolder'], [folderNameParent+"____"+folderName] : FolderMap}
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
    console.log("ChivesDriveActionsMap", ChivesDriveActionsMap)
}

export function getLockStatus(Module: string) {
    const chivesProfileText = window.localStorage.getItem(chivesProfile)      
    const chivesProfileList = chivesProfileText ? JSON.parse(chivesProfileText) : {}
    console.log("chivesProfileList", chivesProfileList)

    return chivesProfileList[Module]
}

export function setLockStatus(Module: string, TxId: string) {
    const chivesProfileText = window.localStorage.getItem(chivesProfile)      
    const chivesProfileList = chivesProfileText ? JSON.parse(chivesProfileText) : {}
    chivesProfileList[Module] = TxId
    window.localStorage.setItem(chivesProfile, JSON.stringify(chivesProfileList))
}

export function deleteLockStatus(TxId: string) {
    const chivesProfileText = window.localStorage.getItem(chivesProfile)      
    const chivesProfileList = chivesProfileText ? JSON.parse(chivesProfileText) : {}
    const foundKey = Object.keys(chivesProfileList).find(key => chivesProfileList[key] === TxId)
    if(foundKey && foundKey!="") {
        delete chivesProfileList[foundKey]
    }
    window.localStorage.setItem(chivesProfile, JSON.stringify(chivesProfileList))
}

export function setChivesReferee(Referee: string) {
    window.localStorage.setItem(chivesReferee, Referee)
}

export function getChivesReferee() {
    const chivesRefereeData = window.localStorage.getItem(chivesReferee) || ''
    
    return chivesRefereeData
}

export function deleteChivesReferee() {
    window.localStorage.removeItem(chivesReferee)
}

export function setChivesContacts(Address: string, Name: string) {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)      
        const chivesContactsList = chivesContactsText ? JSON.parse(chivesContactsText) : {}
        chivesContactsList[Address] = Name
        window.localStorage.setItem(chivesContacts, JSON.stringify(chivesContactsList))

        return chivesContactsList
    }
    catch (error: any) {
        console.error(`setChivesContacts Error`, error);
    }
}

export function deleteChivesContacts(Address: string) {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)      
        const chivesContactsList = chivesContactsText ? JSON.parse(chivesContactsText) : {}
        if (Address in chivesContactsList) {
            delete chivesContactsList[Address];
        }
        window.localStorage.setItem(chivesContacts, JSON.stringify(chivesContactsList))

        return chivesContactsList
    }
    catch (error: any) {
        console.error(`deleteChivesContacts Error`, error);
    }
}


export function searchChivesContacts(searchValue: string) {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)      
        const chivesContactsList = chivesContactsText ? JSON.parse(chivesContactsText) : {}
        
        const result: any = {};
        for (const key in chivesContactsList) {
            if (key.toLowerCase().includes(searchValue.toLowerCase()) || chivesContactsList[key].toLowerCase().includes(searchValue.toLowerCase())) {
                result[key] = chivesContactsList[key]
            }
        }

        return result
    }
    catch (error: any) {
        console.error(`deleteChivesContacts Error`, error);
    }
}

export function getChivesContacts() {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)      
        const chivesContactsList = chivesContactsText ? JSON.parse(chivesContactsText) : {}

        return chivesContactsList
    }
    catch (error: any) {
        console.error(`getChivesContacts Error`, error);
    }
}

export async function CheckBundleTxStatus() {
    //Get the bundle tx status
    const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
    const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []
    console.log("CheckBundleTxStatus", chivesTxStatusList, (new Date()).toLocaleTimeString())
    const chivesTxStatusListNew: any[] = []
    if(chivesTxStatusList && chivesTxStatusList.length > 0)  {
        await Promise.all(
            chivesTxStatusList.map(async (Item: any) => {
                try {
                    const TxId = Item.TxResult.id;
                    const response = await axios.get(authConfig.backEndApi + '/tx/' + TxId + '/unbundle/0/9');
                    if(response && response.data && response.data.txs && response.data.txs.length > 0) {
                        console.log("response.data", response.data)
                        deleteLockStatus(TxId)
                    }
                    else {
                        chivesTxStatusListNew.push(Item)
                    }
                } 
                catch (error) {
                    console.error(`Error fetching data for Item:`, Item);
                }
            })
        );    
        console.log("chivesTxStatusList___________________chivesTxStatusListNew", chivesTxStatusListNew)
        window.localStorage.setItem(chivesTxStatus, JSON.stringify(chivesTxStatusListNew))
        console.log("CheckBundleTxStatus", chivesTxStatusList, chivesTxStatusListNew)
    }
}

export async function parseBundleTx() {
    const response = await axios.get(authConfig.backEndApi + '/bundletx/0/60' );
    if(response && response.data && response.data.data && response.data.data.length>0) {
        for (const item of response.data.data) {
            try {
              await axios.get(authConfig.backEndApi + '/tx/' + item.id + '/unbundle/0/6');
            } 
            catch (error) {
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

export async function getWalletProfile(currentAddress: string) {
    const response = await axios.get(authConfig.backEndApi + '/profile/' + currentAddress );
    if(response && response.data && response.data.Profile && response.data.Profile.Name) {
        return response.data
    }
    else {
        return {}
    }
}

export async function checkNodeStatus() {
    const response = await axios.get(authConfig.backEndApi + '/info' );
    const Node = response.data
    if(Node.height < Node.blocks) {
        return true
    }
    else {
        return false
    }
}

export function GetFileCacheStatus(Drive: any) {
    const CacheStatus: any = {}
    const FullStatus: any = {}
    
    //Step 1: Database
    if(Drive && Drive.table && Drive.table.item_star && Drive.table.item_star=="Star")  {
        FullStatus['Star'] = true
    }
    if(Drive && Drive.table && Drive.table.item_label)  {
        FullStatus['Label'] = Drive.table.item_label
    }
    
    //Step 2 : Local Storage Cache
    if(typeof window !== 'undefined')  {
        const TxId: string = Drive?.id
        const ChivesDriveActions = authConfig.chivesDriveActions
        const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
        const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
        if(ChivesDriveActionsMap && ChivesDriveActionsMap['Star'] && ChivesDriveActionsMap['Star'][TxId] !== undefined )  {
            CacheStatus['Star'] = ChivesDriveActionsMap['Star'][TxId];
            FullStatus['Star'] = ChivesDriveActionsMap['Star'][TxId];
        }
        if(ChivesDriveActionsMap && ChivesDriveActionsMap['Label'] && ChivesDriveActionsMap['Label'][TxId] !== undefined )  {
            CacheStatus['Label'] = ChivesDriveActionsMap['Label'][TxId];
            FullStatus['Label'] = ChivesDriveActionsMap['Label'][TxId];
        }
        if(ChivesDriveActionsMap && ChivesDriveActionsMap['Folder'] && ChivesDriveActionsMap['Folder'][TxId] !== undefined )  {
            CacheStatus['Folder'] = ChivesDriveActionsMap['Folder'][TxId];
            FullStatus['Folder'] = ChivesDriveActionsMap['Folder'][TxId];
        }

        const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
        const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []

        if(chivesTxStatusList && chivesTxStatusList.length > 0)  {
            chivesTxStatusList.map(async (Item: any) => {
                const ChivesDriveActionsMaTx = Item.ChivesDriveActionsMap;
                if(ChivesDriveActionsMaTx && ChivesDriveActionsMaTx['Star'] && ChivesDriveActionsMaTx['Star'][TxId] !== undefined )  {
                    CacheStatus['Star'] = ChivesDriveActionsMaTx['Star'][TxId];
                    FullStatus['Star'] = ChivesDriveActionsMaTx['Star'][TxId];
                }
                if(ChivesDriveActionsMaTx && ChivesDriveActionsMaTx['Label'] && ChivesDriveActionsMaTx['Label'][TxId] !== undefined )  {
                    CacheStatus['Label'] = ChivesDriveActionsMaTx['Label'][TxId];
                    FullStatus['Label'] = ChivesDriveActionsMaTx['Label'][TxId];
                }
                if(ChivesDriveActionsMaTx && ChivesDriveActionsMaTx['Folder'] && ChivesDriveActionsMaTx['Folder'][TxId] !== undefined )  {
                    CacheStatus['Folder'] = ChivesDriveActionsMaTx['Folder'][TxId];
                    FullStatus['Folder'] = ChivesDriveActionsMaTx['Folder'][TxId];
                }            
            })
        }
    }

    return {"FullStatus":FullStatus, "CacheStatus":CacheStatus};
}

export function GetHaveToDoTask() {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    let HaveToDoTask = 0
    if(ChivesDriveActionsMap && ChivesDriveActionsMap['Star'])  {
        HaveToDoTask += Object.keys(ChivesDriveActionsMap['Star']).length
    }
    if(ChivesDriveActionsMap && ChivesDriveActionsMap['Label'])  {
        HaveToDoTask += Object.keys(ChivesDriveActionsMap['Label']).length
    }
    if(ChivesDriveActionsMap && ChivesDriveActionsMap['Folder'])  {
        HaveToDoTask += Object.keys(ChivesDriveActionsMap['Folder']).length
    }
    if(ChivesDriveActionsMap && ChivesDriveActionsMap['CreateFolder'])  {
        HaveToDoTask += Object.keys(ChivesDriveActionsMap['CreateFolder']).length
    }

    return HaveToDoTask;
}

export function ResetToDoTask() {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsMap: any = {}
    window.localStorage.setItem(ChivesDriveActions, JSON.stringify(ChivesDriveActionsMap))
}

export async function ActionsSubmitToBlockchain(setUploadProgress: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>) {
    const ChivesDriveActions = authConfig.chivesDriveActions
    const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
    const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
    const FileTxData: any = ChivesDriveActionsMap['Data']
    const FileTxLabel: any = ChivesDriveActionsMap['Label']
    const FileTxStar: any = ChivesDriveActionsMap['Star']
    const FileTxFolder: any = ChivesDriveActionsMap['Folder']
    const CreateFolder: any = ChivesDriveActionsMap['CreateFolder']
    const FolderList: any = ChivesDriveActionsMap['FolderList']
    const AgentList: any = ChivesDriveActionsMap['Agent']
    const RefereeList: any = ChivesDriveActionsMap['Referee']
    
    const FileTxList: any = []
    FileTxLabel && Object.keys(FileTxLabel).forEach(TxId => {
        if (FileTxLabel[TxId] != undefined) {
            FileTxList.push({TxId: TxId, Action: "Label", Target: FileTxLabel[TxId], TxRecord: FileTxData[TxId]})
        }
    })
    FileTxStar && Object.keys(FileTxStar).forEach(TxId => {
        if (FileTxStar[TxId] == true) {
            FileTxList.push({TxId: TxId, Action: "Star", Target: FileTxStar[TxId], TxRecord: FileTxData[TxId]})
        }
        if (FileTxStar[TxId] == false) {
            FileTxList.push({TxId: TxId, Action: "Star", Target: FileTxStar[TxId], TxRecord: FileTxData[TxId]})
        }
    })
    FileTxFolder && Object.keys(FileTxFolder).forEach(TxId => {
        if (FileTxFolder[TxId] != undefined) {
            FileTxList.push({TxId: TxId, Action: "Folder", Target: FileTxFolder[TxId], TxRecord: FileTxData[TxId]})
        }
    })
    CreateFolder && Object.values(CreateFolder).forEach((Item: any) => {
        if (Item.name != undefined && Item.parent != undefined && Item.name != "" && Item.parent != "") {
            FileTxList.push({TxId: null, Action: "CreateFolder", Target: Item.name, Parent: Item.parent})
        }
    })
    AgentList && Object.keys(AgentList).forEach((Address: string) => {
        if (AgentList[Address] !== undefined) {
            FileTxList.push({TxId: Address, Action: "Agent", Target: AgentList[Address], TxRecord: null})
        }
    })
    RefereeList && Object.keys(RefereeList).forEach((Address: string) => {
        if (RefereeList[Address] !== undefined) {
            FileTxList.push({TxId: Address, Action: "Referee", Target: RefereeList[Address], TxRecord: null})
        }
    })

    
    const currentWallet = getCurrentWallet()
    const currentAddress = getCurrentWalletAddress()
    
    //Make Tx List
    const formData = (await Promise.all(FileTxList?.map(async (FileTx: any) => {
      const TxRecord = FileTx.TxRecord
      const TagsMap: any = {}
      TxRecord && TxRecord.tags && TxRecord.tags.length > 0 && TxRecord.tags.map( (Tag: any) => {
        TagsMap[Tag.name] = Tag.value;
      })
      const tags = [] as Tag[]
      if(FileTx.Action=="Label") {
        setBaseTags(tags, {          
            'App-Name': TagsMap['App-Name'],
            'App-Version': TagsMap['App-Version'],
            'Agent-Name': TagsMap['Agent-Name'],
            'Content-Type': TagsMap['Content-Type'],
            'File-Name': TagsMap['File-Name'],
            'File-Hash': TagsMap['File-Hash'],
            'File-Parent': TagsMap['File-Parent'],
            'Cipher-ALG': TagsMap['Cipher-ALG'],
            'File-Public': TagsMap['File-Public'],
            'File-TxId': TxRecord.id,
            'File-Language': TagsMap['File-Language'],
            'File-Pages': TagsMap['File-Pages'],
            'File-BundleId': TxRecord?.bundleid,
            'Entity-Type': "Action",
            'Entity-Action': FileTx.Action,
            'Entity-Target': FileTx.Target,
            'Last-Tx-Change': TxRecord.table.last_tx_action,
            'Unix-Time': String(Date.now())
          })
      }
      if(FileTx.Action=="Folder") {
        console.log("FolderListFolderListFolderListFolderListFolderList",FolderList)
        setBaseTags(tags, {          
            'App-Name': TagsMap['App-Name'],
            'App-Version': TagsMap['App-Version'],
            'Agent-Name': TagsMap['Agent-Name'],
            'Content-Type': TagsMap['Content-Type'],
            'File-Name': TagsMap['File-Name'],
            'File-Hash': TagsMap['File-Hash'],
            'File-Parent': TagsMap['File-Parent'],
            'Cipher-ALG': TagsMap['Cipher-ALG'],
            'File-Public': TagsMap['File-Public'],
            'File-TxId': TxRecord.id,
            'File-Language': TagsMap['File-Language'],
            'File-Pages': TagsMap['File-Pages'],
            'File-BundleId': TxRecord?.bundleid,
            'Entity-Type': "Action",
            'Entity-Action': FileTx.Action,
            'Entity-Target': FileTx.Target,
            'Entity-Target-Text': FolderList[FileTx.Target]['name'],
            'Last-Tx-Change': TxRecord.table.last_tx_action,
            'Unix-Time': String(Date.now())
          })
      }
      if(FileTx.Action=="Star") {
        setBaseTags(tags, {          
            'App-Name': TagsMap['App-Name'],
            'App-Version': TagsMap['App-Version'],
            'Agent-Name': TagsMap['Agent-Name'],
            'Content-Type': TagsMap['Content-Type'],
            'File-Name': TagsMap['File-Name'],
            'File-Hash': TagsMap['File-Hash'],
            'File-Parent': TagsMap['File-Parent'],
            'Cipher-ALG': TagsMap['Cipher-ALG'],
            'File-Public': TagsMap['File-Public'],
            'File-TxId': TxRecord.id,
            'File-Language': TagsMap['File-Language'],
            'File-Pages': TagsMap['File-Pages'],
            'File-BundleId': TxRecord?.bundleid,
            'Entity-Type': "Action",
            'Entity-Action': FileTx.Action,
            'Entity-Target': FileTx.Target ? "Star" : "",
            'Last-Tx-Change': TxRecord.table.last_tx_action,
            'Unix-Time': String(Date.now())
          })
      }
      if(FileTx.Action=="CreateFolder") {
        setBaseTags(tags, {          
            'App-Name': authConfig['App-Name'],
            'App-Version': authConfig['App-Version'],
            'App-Instance': authConfig['App-Instance'],
            'Agent-Name': "",
            'Content-Type': "text/plain",
            'File-Name': FileTx.Target,
            'File-Hash': await getHash(currentAddress + FileTx.Parent + FileTx.Target),
            'File-Parent': FileTx.Parent,
            'Cipher-ALG': "",
            'File-Public': "Public",
            'File-TxId': "",
            'File-Language': "en",
            'File-Pages': "",
            'File-BundleId': "",
            'Entity-Type': "Folder",
            'Entity-Action': FileTx.Action,
            'Entity-Target': FileTx.Target,
            'Unix-Time': String(Date.now())
          })
      }
      if(FileTx.Action=="Agent") {
        setBaseTags(tags, {          
            'App-Name': TagsMap['App-Name'],
            'App-Version': TagsMap['App-Version'],
            'Agent-Name': TagsMap['Agent-Name'],
            'Content-Type': TagsMap['Content-Type'],
            'File-Name': TagsMap['File-Name'],
            'File-Hash': TagsMap['File-Hash'],
            'File-Parent': TagsMap['File-Parent'],
            'Cipher-ALG': TagsMap['Cipher-ALG'],
            'File-Public': TagsMap['File-Public'],
            'File-TxId': "",
            'File-Language': TagsMap['File-Language'],
            'File-Pages': TagsMap['File-Pages'],
            'File-BundleId': "",
            'Entity-Type': "Action",
            'Entity-Action': FileTx.Action,
            'Entity-Target': FileTx.Target,
            'Last-Tx-Change': "",
            'Unix-Time': String(Date.now())
          })
      }
      if(FileTx.Action=="Referee") {
        setBaseTags(tags, {          
            'App-Name': TagsMap['App-Name'],
            'App-Version': TagsMap['App-Version'],
            'Agent-Name': TagsMap['Agent-Name'],
            'Content-Type': TagsMap['Content-Type'],
            'File-Name': TagsMap['File-Name'],
            'File-Hash': TagsMap['File-Hash'],
            'File-Parent': TagsMap['File-Parent'],
            'Cipher-ALG': TagsMap['Cipher-ALG'],
            'File-Public': TagsMap['File-Public'],
            'File-TxId': "",
            'File-Language': TagsMap['File-Language'],
            'File-Pages': TagsMap['File-Pages'],
            'File-BundleId': "",
            'Entity-Type': "Action",
            'Entity-Action': FileTx.Action,
            'Entity-Target': FileTx.Target,
            'Last-Tx-Change': "",
            'Unix-Time': String(Date.now())
          })
      }

      const data = TxRecord?.id ? String(TxRecord.id) : FileTx.Action
      console.log("tags", tags)

      return { data, tags, path: data }
    })))

    console.log("formData", formData)
    
    const getProcessedDataValue = await getProcessedData(currentWallet, String(currentAddress), formData, false, [])

    const target = ""
    const amount = ""
    const data = getProcessedDataValue

    console.log("getProcessedDataValue", getProcessedDataValue)
    
    //Make the tags
    const tags: any = []
    tags.push({name: "Bundle-Format", value: 'binary'})
    tags.push({name: "Bundle-Version", value: '2.0.0'})
    tags.push({name: "Entity-Type", value: "Action"})
    tags.push({name: "Entity-Number", value: String(FileTxList.length)})
    
    //console.log("getProcessedDataValue tags", tags)

    const TxResult: any = await sendAmount(currentWallet, target, amount, tags, data, "UploadBundleFile", setUploadProgress);
    
    //Save Tx Records Into LocalStorage
    const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
    const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []
    chivesTxStatusList.push({TxResult,ChivesDriveActionsMap})
    console.log("chivesTxStatusList", chivesTxStatusList)
    window.localStorage.setItem(chivesTxStatus, JSON.stringify(chivesTxStatusList))

    //Cleae ChivesDriveActions LocalStorage
    ResetToDoTask()

    return TxResult;
};

export async function ProfileSubmitToBlockchain(setUploadProgress: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>, chivesProfileMap: any, FileTxList: string[], lastTxAction: string) {
    
    const currentWallet = getCurrentWallet()
    const currentAddress = getCurrentWalletAddress()

    const getChivesLanguageData: string = getChivesLanguage();

    const FileTxMap: any = {}
    FileTxMap['Avatar'] = chivesProfileMap['Avatar'][0]
    FileTxMap['Banner'] = chivesProfileMap['Banner'][0]
    const AllData = {...chivesProfileMap, Avatar: chivesProfileMap['AvatarTxId'], Banner: chivesProfileMap['BannerTxId']}
    delete AllData['AvatarTxId']
    delete AllData['BannerTxId']
    FileTxMap['Data'] = AllData
    
    //Make Tx List
    const formData = (await Promise.all(FileTxList?.map(async (FileTxKey: string) => { 
      const tags = [] as Tag[]    
      let data = null 
      if(FileTxKey=="Avatar" && FileTxMap[FileTxKey]) {
        const file = FileTxMap[FileTxKey]
        console.log("file", file)
        data = file instanceof File ? await readFile(file) : file
        setBaseTags(tags, {
            'Content-Type': file.type,
            'File-Name': file.name,
            'File-Hash': await getHash(data),
            'File-Public': 'Public',
            'File-Summary': '',
            'Cipher-ALG': '',
            'File-Parent': 'Root',
            'File-Language': getChivesLanguageData,
            'File-Pages': '',
            'Entity-Type': 'File',
            'App-Name': authConfig['App-Name'],
            'App-Version': authConfig['App-Version'],
            'App-Instance': authConfig['App-Instance'],
            'Unix-Time': String(Date.now())
        })
      }
      if(FileTxKey=="Banner" && FileTxMap[FileTxKey]) {
        const file = FileTxMap[FileTxKey]
        data = file instanceof File ? await readFile(file) : file
        setBaseTags(tags, {
            'Content-Type': file.type,
            'File-Name': file.name,
            'File-Hash': await getHash(data),
            'File-Public': 'Public',
            'File-Summary': '',
            'Cipher-ALG': '',
            'File-Parent': 'Root',
            'File-Language': getChivesLanguageData,
            'File-Pages': '',
            'Entity-Type': 'File',
            'App-Name': authConfig['App-Name'],
            'App-Version': authConfig['App-Version'],
            'App-Instance': authConfig['App-Instance'],
            'Unix-Time': String(Date.now())
        })
      }
      if(FileTxKey=="Data") {
        data = JSON.stringify(FileTxMap[FileTxKey])
        setBaseTags(tags, {
            'Content-Type': "text/plain",
            'File-Name': "Profile",
            'File-Hash': await getHash(data),
            'File-Public': 'Public',
            'File-Summary': '',
            'Cipher-ALG': '',
            'File-Parent': 'Root',
            'File-Language': getChivesLanguageData,
            'File-Pages': '',
            'File-BundleId': "",
            'Entity-Type': 'Action',
            'Entity-Action': "Profile",
            'Entity-Target': "",
            'Entity-Avatar': "",
            'Entity-Banner': "",
            'App-Name': authConfig['App-Name'],
            'App-Version': authConfig['App-Version'],
            'App-Instance': authConfig['App-Instance'],
            'Last-Tx-Change': lastTxAction,
            'Unix-Time': String(Date.now())
        })
      }

      console.log("tags", tags)
      console.log("data", data)

      return { data, tags, path: "path" }
    })))

    console.log("formData", formData)
    
    const getProcessedDataValue = await getProcessedData(currentWallet, String(currentAddress), formData, false, FileTxList)

    const target = ""
    const amount = ""
    const data = getProcessedDataValue

    console.log("getProcessedDataValue", getProcessedDataValue)
    
    //Make the tags
    const tags: any = []
    tags.push({name: "Bundle-Format", value: 'binary'})
    tags.push({name: "Bundle-Version", value: '2.0.0'})
    tags.push({name: "Entity-Type", value: "Action"})
    tags.push({name: "Entity-Number", value: String(FileTxList.length)})
    
    console.log("getProcessedDataValue data", data)
    
    const TxResult: any = await sendAmount(currentWallet, target, amount, tags, data, "UploadBundleFile", setUploadProgress);
    
    return TxResult;
};

function setBaseTags (tags: Tag[], set: { [key: string]: string }) {
    const baseTags: { [key: string]: string } = {
      'Content-Type': '',
      'File-Hash': '',
      'Bundle-Format': '',
      'Bundle-Version': '',
      ...set
    }
    for (const name in baseTags) { setTag(tags, name, baseTags[name]) }
}

function setTag (tags: Tag[], name: string, value?: string) {
    let currentTag = tags.find(tag => tag.name === name)
    if (value) {
      if (!currentTag) {
        currentTag = { name, value: '' }
        tags.push(currentTag)
      }
      currentTag.value = value
    } else {
      const index = tags.indexOf(currentTag!)
      if (index !== -1) { tags.splice(index, 1) }
    }
}

export function getChivesLanguage() {
    const ChivesLanguage = window.localStorage.getItem(chivesLanguage) || "en"

    return ChivesLanguage
};

export function setChivesLanguage(Language: string) {
    window.localStorage.setItem(chivesLanguage, Language)

    return true
};