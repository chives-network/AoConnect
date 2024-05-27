
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import authConfig from 'src/configs/auth'
import BigNumber from 'bignumber.js'
import axios from 'axios'

import { ConvertInboxMessageFormatToJson, SaveInboxMsgIntoIndexedDb } from 'src/functions/AoConnect/MsgReminder'
import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, BalanceTimes, AoLoadBlueprintModule } from 'src/functions/AoConnect/AoConnect'

export const AoLoadBlueprintChatroom = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chatroom')
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
