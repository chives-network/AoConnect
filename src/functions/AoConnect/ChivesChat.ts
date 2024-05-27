
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import authConfig from 'src/configs/auth'
import BigNumber from 'bignumber.js'
import axios from 'axios'

import { ConvertInboxMessageFormatToJson, SaveInboxMsgIntoIndexedDb } from 'src/functions/AoConnect/MsgReminder'
import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, BalanceTimes, AoLoadBlueprintModule } from 'src/functions/AoConnect/AoConnect'


export const AoLoadBlueprintChivesChat = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chiveschat')
}


export const GetChivesChatMembers = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatMembersResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Members',
        });
        console.log("GetChivesChatMembers GetChivesChatMembers", GetChivesChatMembersResult)
        
        if(GetChivesChatMembersResult && GetChivesChatMembersResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatMembersResult)
            return { id: GetChivesChatMembersResult, msg: MsgContent };
        }
        else {
            return { id: GetChivesChatMembersResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatMembers Error:", Error)
    }
  
}

export const GetChivesChatAdmins = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatAdminsResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Admins',
        });
        console.log("GetChivesChatAdmins GetChivesChatAdmins", GetChivesChatAdminsResult)
        
        if(GetChivesChatAdminsResult && GetChivesChatAdminsResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatAdminsResult)
            return { id: GetChivesChatAdminsResult, msg: MsgContent };
        }
        else {
            return { id: GetChivesChatAdminsResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatAdmins Error:", Error)
    }
  
}

export const ChivesChatAddAdmin = async (currentWalletJwk: any, chatroomTxId: string, myProcessTxId: string, AdminId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatAddAdminResult = await message({
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AddAdmin", AdminId = "' + AdminId + '" })',
        });
        console.log("ChivesChatAddAdmin GetChivesChatAddAdminResult", GetChivesChatAddAdminResult)
        
        if(GetChivesChatAddAdminResult && GetChivesChatAddAdminResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetChivesChatAddAdminResult)
            return { id: GetChivesChatAddAdminResult, msg: MsgContent };
        }
        else {
            return { id: GetChivesChatAddAdminResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatMembers Error:", Error)
    }
  
}

export const ChivesChatDelAdmin = async (currentWalletJwk: any, chatroomTxId: string, myProcessTxId: string, AdminId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatDelAdminResult = await message({
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "DelAdmin", AdminId = "' + AdminId + '" })',
        });
        console.log("ChivesChatDelAdmin GetChivesChatDelAdminResult", GetChivesChatDelAdminResult)
        
        if(GetChivesChatDelAdminResult && GetChivesChatDelAdminResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetChivesChatDelAdminResult)
            return { id: GetChivesChatDelAdminResult, msg: MsgContent };
        }
        else {
            return { id: GetChivesChatDelAdminResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatMembers Error:", Error)
    }
  
}

export const ChivesChatAddMember = async (currentWalletJwk: any, chatroomTxId: string, myProcessTxId: string, MemberId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AddMember", MemberId = "' + MemberId + '" })',
        }
        console.log("ChivesChatAddMember Data", Data)
        const GetChivesChatAddMemberResult = await message(Data);
        console.log("ChivesChatAddMember GetChivesChatAddMemberResult", GetChivesChatAddMemberResult)
        
        if(GetChivesChatAddMemberResult && GetChivesChatAddMemberResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetChivesChatAddMemberResult)
            return { id: GetChivesChatAddMemberResult, msg: MsgContent };
        }
        else {
            return { id: GetChivesChatAddMemberResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatMembers Error:", Error)
    }
  
}

export const ChivesChatDelMember = async (currentWalletJwk: any, chatroomTxId: string, myProcessTxId: string, MemberId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatDelMemberResult = await message({
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "DelMember", MemberId = "' + MemberId + '" })',
        });
        console.log("ChivesChatDelMember GetChivesChatDelMemberResult", GetChivesChatDelMemberResult)
        
        if(GetChivesChatDelMemberResult && GetChivesChatDelMemberResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetChivesChatDelMemberResult)
            return { id: GetChivesChatDelMemberResult, msg: MsgContent };
        }
        else {
            return { id: GetChivesChatDelMemberResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatMembers Error:", Error)
    }
  
}


export const SendMessageToChivesChat = async (currentWalletJwk: any, chatroomTxId: string, myProcessTxId: string, Message: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendMessageResult = await message({
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "Broadcast", Data = "' + Message + '" })',
        });
        console.log("SendMessageToChivesChat SendMessage", SendMessageResult)
        
        if(SendMessageResult && SendMessageResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, SendMessageResult)
            return { id: SendMessageResult, msg: MsgContent };
        }
        else {
            return { id: SendMessageResult };
        }
    }
    catch(Error: any) {
        console.error("SendMessageToChivesChat Error:", Error)
    }
  
}




