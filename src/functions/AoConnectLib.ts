import { connect, createDataItemSigner } from "@permaweb/aoconnect"
import { ConvertInboxMessageFormatToJson, SaveInboxMsgIntoIndexedDb } from './AoConnectMsgReminder'
import authConfig from 'src/configs/auth'
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
        console.log("AoGetPageRecords Error:", Error)

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
        console.log("AoGetPageRecords Error:", Error)
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
        console.log("AoGetPageRecords Error:", Error)
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
        console.log("AoGetPageRecords Error:", Error)
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
        console.log("AoGetPageRecords Error:", Error)
    }
}

export const AoDryRun = async (processTxId: string, TargetTxId: string, Data: string, Tags: any[]) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            process: processTxId,
            data: Data,
            tags: [{name: 'Action', value: 'Balance'}],
            anchor: TargetTxId
        });

        console.log("AoDryRun result", result, {
            process: processTxId,
            data: Data,
            tags: [{name: 'Action', value: 'Balance'}],
            anchor: TargetTxId
        })
    
        return result;
    }
    catch(Error: any) {
        console.log("AoGetPageRecords Error:", Error)
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
        console.log("AoGetPageRecords Error:", Error)
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
        console.log("AoGetPageRecords Error:", Error)
    }
}

export const AoCreateProcessAuto = async (currentWalletJwk: any) => {
    try {

        const processTxId: any = await AoCreateProcess(currentWalletJwk, authConfig.AoConnectModule, String(authConfig.AoConnectScheduler), [{ "name": "Your-Tag-Name", "value": "Your-Tag-Value" }, { "name": "Creator", "value": "Chives-Network" }]);

        console.log("AoCreateProcessAuto processTxId", processTxId)
    
        return processTxId;
    }
    catch(Error: any) {
        console.log("AoCreateProcessAuto Error:", Error)
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
                SaveInboxMsgIntoIndexedDb(InboxMsgList)
            }
            
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
        console.log("GetMyLastMsg Error:", Error)
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
        console.log("GetChatroomMembers Error:", Error)
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
        console.log("GetChatroomMembers Error:", Error)
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
        console.log("SendMessageToChatroom Error:", Error)
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
        console.log("AoLoadBlueprintChatroom Error:", Error)
    }
  
}

export const AoLoadBlueprintChatroom = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chatroom')
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
        console.log("AoLoadBlueprintChatroom Error:", Error)
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
        console.log("AoTokenBalance Error:", Error)
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
        console.log("AoTokenBalances Error:", Error)
    }
  
}

export const AoTokenTransfer = async (currentWalletJwk: any, tokenTxId: string, myTokenProcessTxId: string, sendOutProcessTxId: string, sendOutAmount: number) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendTokenResult = await message({
            process: myTokenProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + tokenTxId + '", Action = "Transfer", Recipient = "' + sendOutProcessTxId + '", Quantity = "' + sendOutAmount + '"})',
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
        console.log("AoTokenTransfer Error:", Error)
    }
  
}

export const AoTokenMint = async (currentWalletJwk: any, tokenTxId: string, mintAmount: number) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendTokenResult = await message({
            process: tokenTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + tokenTxId + '", Tags = { Action = "Mint", Quantity = "' + mintAmount + '" }})',
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
        console.log("AoTokenTransfer Error:", Error)
    }
  
}

export const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
