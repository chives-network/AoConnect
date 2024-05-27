
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import { ConvertInboxMessageFormatToJson, SaveInboxMsgIntoIndexedDb } from './AoConnectMsgReminder'
import authConfig from 'src/configs/auth'
import BigNumber from 'bignumber.js'
import axios from 'axios'


const MU_URL = "https://mu.ao-testnet.xyz"
const CU_URL = "https://cu.ao-testnet.xyz"
const GATEWAY_URL = "https://arweave.net"


export const AoSendMsg = async (currentWalletJwk: any, processTxId: string, Msg: string, Tags: any[]) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const sendMsgResult = await message({
            process: processTxId,
            tags: Tags,
            signer: createDataItemSigner(currentWalletJwk),
            data: Msg,
        });
        console.log("AoSendMsg sendMsgResult", sendMsgResult, "Tags", Tags, "data", Msg)
    
        return sendMsgResult;
    }
    catch(Error: any) {

        console.log("AoSendMsg Error", Error);
    }
}

export const AoGetLastPage = async (processTxId: string, Sort: string = 'DESC', Limit: number = 25) => {
    try {
        const { results } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        let resultsOut = await results({
            process: processTxId,
            sort: Sort,
            limit: Limit,
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)

        return []
    }
}

export const AoGetRecord = async (processTxId: string, messageTxId: string) => {
    try {
        const { result } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        let resultsOut = await result({
            process: processTxId,
            message: messageTxId
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
    }
}

export const AoGetMessage = async (processTxId: string, messageTxId: string) => {
    try {
        const { result } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        let resultsOut = await result({
            process: processTxId,
            message: messageTxId
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
    }
}

export const AoGetPageRecords = async (processTxId: string, Sort: string = 'DESC', Limit: number = 25, From: string = '') => {
    try {
        const { results } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        let resultsOut = await results({
            process: processTxId,
            from: From && From != '' ? From : undefined,
            sort: Sort, 
            limit: Limit,
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
    }
}

export const AoCreateProcess = async (currentWalletJwk: any, moduleTxId: string, scheduler: string, Tags: any[]) => {
    try {
        const { spawn } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const processTxId = await spawn({
            // The Arweave TXID of the ao Module
            module: moduleTxId,
            // The Arweave wallet address of a Scheduler Unit
            scheduler: scheduler,
            signer: createDataItemSigner(currentWalletJwk),
            tags: Tags,
        });

        console.log("AoCreateProcess processTxId", processTxId)
    
        return processTxId;
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
    }
}

export const AoDryRun = async (TargetTxId: string, processTxId: string, Data: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: Data,
            tags: [
                { name: 'Action', value: 'Balance' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        console.log("AoDryRun result 001", result)
    
        return result;
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
    }
}

export const AoTokenBalanceDryRun = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Balance' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return result.Messages[0].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalanceDryRun Error:", Error)

        return 
    }
}

export const AoTokenBalancesDryRun = async (TargetTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Balances' },
                { name: 'Target', value: TargetTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return result.Messages[0].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalancesDryRun Error:", Error)

        return 
    }
}


export const AoTokenInfoDryRun = async (TargetTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Info' },
                { name: 'Target', value: TargetTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Tags) {
            const RS: any[] = []
            result.Messages[0].Tags.map((Item: any)=>{
                RS[Item.name] = Item.value
            })
            return RS
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenInfoDryRun Error:", Error)

        return 
    }
}

export const AoTokenInBoxDryRun = async (TargetTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Members' },
                { name: 'Target', value: TargetTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Tags) {
            const RS: any[] = []
            result.Messages[0].Tags.map((Item: any)=>{
                RS[Item.name] = Item.value
            })
            return RS
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenInfoDryRun Error:", Error)

        return 
    }
}




export const AoMonitor = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { monitor } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await monitor({
            process: processTxId,
            signer: createDataItemSigner(currentWalletJwk),
        });

        console.log("AoMonitor result", result)
    
        return result;
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
    }
}

export const AoUnMonitor = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { unmonitor } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await unmonitor({
            process: processTxId,
            signer: createDataItemSigner(currentWalletJwk),
        });

        console.log("AoUnMonitor result", result)
    
        return result;
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
    }
}

export const AoCreateProcessAuto = async (currentWalletJwk: any) => {
    try {

        const processTxId: any = await AoCreateProcess(currentWalletJwk, authConfig.AoConnectModule, String(authConfig.AoConnectScheduler), [{ "name": "Your-Tag-Name", "value": "Your-Tag-Value" }, { "name": "Creator", "value": "Chives-Network" }]);

        console.log("AoCreateProcessAuto processTxId", processTxId)
    
        return processTxId;
    }
    catch(Error: any) {
        console.error("AoCreateProcessAuto Error:", Error)
    }
}

export const GetMyInboxMsg = async (currentWalletJwk: any, processTxId: string) => {
    
    const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

    const GetMyInboxMsgResult = await message({
        process: processTxId,
        tags: [ { name: 'Action', value: 'Eval' } ],
        signer: createDataItemSigner(currentWalletJwk),
        data: 'Inbox',
      });
    console.log("GetMyInboxMsg GetMyInboxMsgResult", GetMyInboxMsgResult)

    if(GetMyInboxMsgResult && GetMyInboxMsgResult.length == 43) {
        const MsgContent = await AoGetMessage(processTxId, GetMyInboxMsgResult)
        if(MsgContent && MsgContent.Output && MsgContent.Output.data && MsgContent.Output.data.output) {
            const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
            const formatText = MsgContent.Output.data.output.replace(ansiRegex, '');
            const InboxMsgList: any[] = ConvertInboxMessageFormatToJson(formatText)

            if(InboxMsgList) {
                SaveInboxMsgIntoIndexedDb(processTxId, InboxMsgList)
            }
            console.log("GetMyInboxMsg InboxMsgList", InboxMsgList)
            
            
            return { id: GetMyInboxMsgResult, msg: InboxMsgList };
        }
        else {
            return { id: GetMyInboxMsgResult };
        }
    }
    else {
        return { id: GetMyInboxMsgResult };
    }
    
}

export const GetMyLastMsg = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Inbox[#Inbox].Data',
        });
        console.log("GetMyLastMsg GetMyLastMsg", GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("GetMyLastMsg MsgContent", MsgContent)
            return { id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {
            return { id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("GetMyLastMsg Error:", Error)
    }
  
}

export const GetChatroomMembers = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChatroomMembersResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Members',
        });
        console.log("GetChatroomMembers GetChatroomMembers", GetChatroomMembersResult)
        
        if(GetChatroomMembersResult && GetChatroomMembersResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChatroomMembersResult)
            return { id: GetChatroomMembersResult, msg: MsgContent };
        }
        else {
            return { id: GetChatroomMembersResult };
        }
    }
    catch(Error: any) {
        console.error("GetChatroomMembers Error:", Error)
    }
  
}

export const RegisterChatroomMember = async (currentWalletJwk: any, chatroomTxId: string, myProcessTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChatroomMembersResult = await message({
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + chatroomTxId + '", Action = "Register" })',
        });
        console.log("GetChatroomMembers GetChatroomMembers", GetChatroomMembersResult)
        
        if(GetChatroomMembersResult && GetChatroomMembersResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetChatroomMembersResult)
            return { id: GetChatroomMembersResult, msg: MsgContent };
        }
        else {
            return { id: GetChatroomMembersResult };
        }
    }
    catch(Error: any) {
        console.error("GetChatroomMembers Error:", Error)
    }
  
}

export const SendMessageToChatroom = async (currentWalletJwk: any, chatroomTxId: string, myProcessTxId: string, Message: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendMessageResult = await message({
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "Broadcast", Data = "' + Message + '" })',
        });
        console.log("SendMessageToChatroom SendMessage", SendMessageResult)
        
        if(SendMessageResult && SendMessageResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, SendMessageResult)
            return { id: SendMessageResult, msg: MsgContent };
        }
        else {
            return { id: SendMessageResult };
        }
    }
    catch(Error: any) {
        console.error("SendMessageToChatroom Error:", Error)
    }
  
}

export const AoLoadBlueprintModule = async (currentWalletJwk: any, processTxId: string, module: string) => {
    try {
        const Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/blueprints/' + module + '.lua', { headers: { }, params: { } }).then(res => res.data)
    
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Data,
        });
        console.log("AoLoadBlueprintModule GetMyLastMsg", module, GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("AoLoadBlueprintModule MsgContent", module, MsgContent)
            return { id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {
            return { id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintChatroom Error:", Error)

        // 重新执行函数直到成功为止
        setTimeout(async () => {
            return await AoLoadBlueprintModule(currentWalletJwk, processTxId, module);
        }, 15000)
    }
  
}

export const AoLoadBlueprintChatroom = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chatroom')
}

export const AoLoadBlueprintChivesChat = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chiveschat')
}

export const AoLoadBlueprintChat = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chat')
}

export const AoLoadBlueprintToken = async (currentWalletJwk: any, processTxId: string, tokenInfo: any) => {
    try {
        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/blueprints/token.lua', { headers: { }, params: { } }).then(res => res.data)
        
        //Filter Token Infor
        if(tokenInfo && tokenInfo.Name) {
            Data = Data.replace("AoConnectToken", tokenInfo.Name)
        }
        if(tokenInfo && tokenInfo.Ticker) {
            Data = Data.replace("AOCN", tokenInfo.Ticker)
        }
        if(tokenInfo && tokenInfo.Balance) {
            Data = Data.replace("9999", tokenInfo.Balance)
        }
        if(tokenInfo && tokenInfo.Logo) {
            Data = Data.replace("dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ", tokenInfo.Logo)
        }

        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Data,
        });
        console.log("AoLoadBlueprintModule GetMyLastMsg", module, GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("AoLoadBlueprintModule MsgContent", module, MsgContent)
            return { id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {
            return { id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintChatroom Error:", Error)
    }
}

export const AoTokenBalance = async (currentWalletJwk: any, tokenTxId: string, myProcessTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendTokenResult = await message({
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + tokenTxId + '", Action = "Balance", Tags = { Target = ao.id } })',
        });
        console.log("AoTokenBalance Balance", SendTokenResult)
        
        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, SendTokenResult)
            return { id: SendTokenResult, msg: MsgContent };
        }
        else {
            return { id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalance Error:", Error)
    }
  
}

export const AoTokenBalances = async (currentWalletJwk: any, tokenTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendTokenResult = await message({
            process: tokenTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + tokenTxId + '", Tags = { Action = "Balances" }})',
        });
        console.log("AoTokenBalances Balances", SendTokenResult)
        
        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(tokenTxId, SendTokenResult)
            return { id: SendTokenResult, msg: MsgContent };
        }
        else {
            return { id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalances Error:", Error)
    }
  
}

export const AoTokenTransfer = async (currentWalletJwk: any, tokenTxId: string, myTokenProcessTxId: string, sendOutProcessTxId: string, sendOutAmount: number) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendTokenResult = await message({
            process: myTokenProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + tokenTxId + '", Action = "Transfer", Recipient = "' + sendOutProcessTxId + '", Quantity = "' + BalanceTimes(sendOutAmount) + '"})',
        });
        console.log("AoTokenTransfer Transfer", SendTokenResult)
        
        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(myTokenProcessTxId, SendTokenResult)
            return { id: SendTokenResult, msg: MsgContent };
        }
        else {
            return { id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenTransfer Error:", Error)
    }
  
}

export const AoTokenMint = async (currentWalletJwk: any, tokenTxId: string, mintAmount: number) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendTokenResult = await message({
            process: tokenTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + tokenTxId + '", Tags = { Action = "Mint", Quantity = "' + BalanceTimes(mintAmount) + '" }})',
        });
        console.log("AoTokenTransfer Transfer", SendTokenResult)
        
        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(tokenTxId, SendTokenResult)
            return { id: SendTokenResult, msg: MsgContent };
        }
        else {
            return { id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenTransfer Error:", Error)
    }
  
}

export const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const FormatBalance = (Balance: number) => {

    return (new BigNumber(Number(Balance))).div('1e12').toFixed()
}

export const BalanceTimes = (Balance: number) => {

    return (new BigNumber(Number(Balance))).times('1e12').toString()
}

export const BalanceCompare = (Balance1: number, Balance2: number) => {
    const number1 = new BigNumber(Balance1)
    const number2 = new BigNumber(Balance2)
    const comparisonResult = number1.comparedTo(number2)
    return comparisonResult
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
