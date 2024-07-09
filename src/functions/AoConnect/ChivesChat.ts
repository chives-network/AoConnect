
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, AoLoadBlueprintModule } from 'src/functions/AoConnect/AoConnect'

import { getNanoid } from 'src/functions/string.tools'
import authConfig from 'src/configs/auth'


export const AoLoadBlueprintChivesChat = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chiveschat')
}

export const GetChivesChatMembersByOwner = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatMembersByOwnerResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Members',
        });
        console.log("GetChivesChatMembersByOwner GetChivesChatMembersByOwner", GetChivesChatMembersByOwnerResult)
        
        if(GetChivesChatMembersByOwnerResult && GetChivesChatMembersByOwnerResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatMembersByOwnerResult)

            return { status: 'ok', id: GetChivesChatMembersByOwnerResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatMembersByOwnerResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatMembersByOwner Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const GetChivesChatInvites = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatInvitesResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Invites',
        });
        console.log("GetChivesChatInvites GetChivesChatInvites", GetChivesChatInvitesResult)
        
        if(GetChivesChatInvitesResult && GetChivesChatInvitesResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatInvitesResult)

            return { status: 'ok', id: GetChivesChatInvitesResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatInvitesResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatInvites Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const GetChivesChatApplicants = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatApplicantsResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Applicants',
        });
        console.log("GetChivesChatApplicants GetChivesChatApplicants", GetChivesChatApplicantsResult)
        
        if(GetChivesChatApplicantsResult && GetChivesChatApplicantsResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatApplicantsResult)

            return { status: 'ok', id: GetChivesChatApplicantsResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatApplicantsResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatApplicants Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
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

            return { status: 'ok', id: GetChivesChatAdminsResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAdminsResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatAdmins Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddAdmin = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, AdminId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatAddAdminResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AddAdmin", AdminId = "' + AdminId + '" })',
        });
        console.log("ChivesChatAddAdmin GetChivesChatAddAdminResult", GetChivesChatAddAdminResult)
        
        if(GetChivesChatAddAdminResult && GetChivesChatAddAdminResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatAddAdminResult)

            return { status: 'ok', id: GetChivesChatAddAdminResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddAdminResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddAdmin Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatDelAdmin = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, AdminId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatDelAdminResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "DelAdmin", AdminId = "' + AdminId + '" })',
        });
        console.log("ChivesChatDelAdmin GetChivesChatDelAdminResult", GetChivesChatDelAdminResult)
        
        if(GetChivesChatDelAdminResult && GetChivesChatDelAdminResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatDelAdminResult)

            return { status: 'ok', id: GetChivesChatDelAdminResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatDelAdminResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatDelAdmin Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatApplyJoin = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "ApplyJoin", MemberName = "' + MemberName + '", MemberReason = "' + MemberReason + '" })',
        }
        console.log("ChivesChatApplyJoin Data", Data)
        const GetChivesChatApplyJoinResult = await message(Data);
        console.log("ChivesChatApplyJoin GetChivesChatApplyJoinResult", GetChivesChatApplyJoinResult)
        
        if(GetChivesChatApplyJoinResult && GetChivesChatApplyJoinResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatApplyJoinResult)

            return { status: 'ok', id: GetChivesChatApplyJoinResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatApplyJoinResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatApplyJoin Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatApprovalApply = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + chatroomTxId + '", Action = "ApprovalApply", MemberId = "' + MemberId + '", MemberName = "' + MemberName + '", MemberReason = "' + MemberReason + '" })'
        console.log("SendData", SendData)
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("ChivesChatApprovalApply Data", Data)
        const GetChivesChatApprovalApplyResult = await message(Data);
        console.log("ChivesChatApprovalApply GetChivesChatApprovalApplyResult", GetChivesChatApprovalApplyResult)
        
        if(GetChivesChatApprovalApplyResult && GetChivesChatApprovalApplyResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatApprovalApplyResult)

            return { status: 'ok', id: GetChivesChatApprovalApplyResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatApprovalApplyResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatApprovalApply Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatRefuseApply = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "RefuseApply", MemberId = "' + MemberId + '", MemberName = "' + MemberName + '", MemberReason = "' + MemberReason + '" })',
        }
        console.log("ChivesChatRefuseApply Data", Data)
        const GetChivesChatRefuseApplyResult = await message(Data);
        console.log("ChivesChatRefuseApply GetChivesChatRefuseApplyResult", GetChivesChatRefuseApplyResult)
        
        if(GetChivesChatRefuseApplyResult && GetChivesChatRefuseApplyResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatRefuseApplyResult)

            return { status: 'ok', id: GetChivesChatRefuseApplyResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatRefuseApplyResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatRefuseApply Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddMember = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AddMember", MemberId = "' + MemberId + '", MemberName = "' + MemberName + '", MemberReason = "' + MemberReason + '" })',
        }
        console.log("ChivesChatAddMember Data", Data)
        const GetChivesChatAddMemberResult = await message(Data);
        console.log("ChivesChatAddMember GetChivesChatAddMemberResult", GetChivesChatAddMemberResult)
        
        if(GetChivesChatAddMemberResult && GetChivesChatAddMemberResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatAddMemberResult)

            return { status: 'ok', id: GetChivesChatAddMemberResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddMemberResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddMember Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddInvite = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AddInvite", MemberId = "' + MemberId + '", MemberName = "' + MemberName + '", MemberReason = "' + MemberReason + '" })',
        }
        console.log("ChivesChatAddInvite Data", Data)
        const GetChivesChatAddInviteResult = await message(Data);
        console.log("ChivesChatAddInvite GetChivesChatAddInviteResult", GetChivesChatAddInviteResult)
        
        if(GetChivesChatAddInviteResult && GetChivesChatAddInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatAddInviteResult)

            return { status: 'ok', id: GetChivesChatAddInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddInvite Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddInvites = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        console.log("ChivesChatAddInvites MemberId", MemberId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AddInvites", MemberId = "' + MemberId + '", MemberName = "' + MemberName + '", MemberReason = "' + MemberReason + '" })',
        }
        console.log("ChivesChatAddInvites Data", Data)
        const GetChivesChatAddInviteResult = await message(Data);
        console.log("ChivesChatAddInvites GetChivesChatAddInviteResult", GetChivesChatAddInviteResult)
        
        if(GetChivesChatAddInviteResult && GetChivesChatAddInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatAddInviteResult)

            return { status: 'ok', id: GetChivesChatAddInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddInvites Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAgreeInvite = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AgreeInvite" })',
        }
        console.log("ChivesChatAgreeInvite Data", Data)
        const GetChivesChatAgreeInviteResult = await message(Data);
        console.log("ChivesChatAgreeInvite GetChivesChatAgreeInviteResult", GetChivesChatAgreeInviteResult)
        
        if(GetChivesChatAgreeInviteResult && GetChivesChatAgreeInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatAgreeInviteResult)

            return { status: 'ok', id: GetChivesChatAgreeInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAgreeInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAgreeInvite Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatRefuseInvite = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "RefuseInvite" })',
        }
        console.log("ChivesChatRefuseInvite Data", Data)
        const GetChivesChatRefuseInviteResult = await message(Data);
        console.log("ChivesChatRefuseInvite GetChivesChatRefuseInviteResult", GetChivesChatRefuseInviteResult)
        
        if(GetChivesChatRefuseInviteResult && GetChivesChatRefuseInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatRefuseInviteResult)

            return { status: 'ok', id: GetChivesChatRefuseInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatRefuseInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatRefuseInvite Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatDelMember = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, MemberId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatDelMemberResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "DelMember", MemberId = "' + MemberId + '" })',
        });
        console.log("ChivesChatDelMember GetChivesChatDelMemberResult", GetChivesChatDelMemberResult)
        
        if(GetChivesChatDelMemberResult && GetChivesChatDelMemberResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatDelMemberResult)

            return { status: 'ok', id: GetChivesChatDelMemberResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatDelMemberResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatDelMember Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddChannel = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, ChannelId: string, ChannelName: string, ChannelGroup: string, ChannelSort: string, ChannelIntro: string, ChannelWritePermission: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatAddChannelResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "AddChannel", ChannelId = "' + ChannelId + '", ChannelName = "' + ChannelName + '", ChannelGroup = "' + ChannelGroup + '", ChannelSort = "' + ChannelSort + '", ChannelIntro = "' + ChannelIntro + '", ChannelWritePermission = "' + ChannelWritePermission + '"})',
        });
        console.log("ChivesChatAddChannel GetChivesChatAddChannelResult", GetChivesChatAddChannelResult)
        
        if(GetChivesChatAddChannelResult && GetChivesChatAddChannelResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatAddChannelResult)

            return { status: 'ok', id: GetChivesChatAddChannelResult, msg: MsgContent };
        }
        else {
            
            return { status: 'ok', id: GetChivesChatAddChannelResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddChannel Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatEditChannel = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, ChannelId: string, ChannelName: string, ChannelGroup: string, ChannelSort: string, ChannelIntro: string, ChannelWritePermission: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatEditChannelResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "EditChannel", ChannelId = "' + ChannelId + '", ChannelName = "' + ChannelName + '", ChannelGroup = "' + ChannelGroup + '", ChannelSort = "' + ChannelSort + '", ChannelIntro = "' + ChannelIntro + '", ChannelWritePermission = "' + ChannelWritePermission + '"})',
        });
        console.log("ChivesChatEditChannel GetChivesChatEditChannelResult", GetChivesChatEditChannelResult)
        
        if(GetChivesChatEditChannelResult && GetChivesChatEditChannelResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatEditChannelResult)

            return { status: 'ok', id: GetChivesChatEditChannelResult, msg: MsgContent };
        }
        else {
            
            return { status: 'ok', id: GetChivesChatEditChannelResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatEditChannel Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatDelChannel = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, ChannelId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatDelChannelResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "DelChannel", ChannelId = "' + ChannelId + '"})',
        });
        console.log("ChivesChatDelChannel GetChivesChatDelChannelResult", GetChivesChatDelChannelResult)
        
        if(GetChivesChatDelChannelResult && GetChivesChatDelChannelResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesChatDelChannelResult)

            return { status: 'ok', id: GetChivesChatDelChannelResult, msg: MsgContent };
        }
        else {
            
            return { status: 'ok', id: GetChivesChatDelChannelResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatDelChannel Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatGetChannels = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetChannels' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("AoChatroomBalanceDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesChatGetMembers = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetMembers' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            if(result.Messages[0].Data[0] == '[' || result.Messages[0].Data[0] == '{')  {
                return JSON.parse(result.Messages[0].Data)
            }
            else {
                return [result.Messages[0].Data, '', '']
            }
        }
        else {

            return [[], {}]
        }
    }
    catch(Error: any) {
        console.error("ChivesChatGetMembers Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return [[], {}]
    }
}

export const ChivesChatIsMember = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'IsMember' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            if(result.Messages[0].Data[0] == '[' || result.Messages[0].Data[0] == '{')  {
                return JSON.parse(result.Messages[0].Data)
            }
            else {
                return [result.Messages[0].Data, '', '']
            }
        }
        else {

            return [[], {}]
        }
    }
    catch(Error: any) {
        console.error("ChivesChatGetMembers Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return [[], {}]
    }
}

export const ChivesChatGetApplicants = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetApplicants' },
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
        console.error("AoChatroomBalanceDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesChatGetInboxs = async (TargetTxId: string, processTxId: string, startIndex: string, endIndex: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            Id: getNanoid(32),
            data: "ChivesChatGetInboxs",
            tags: [
                { name: 'Action', value: 'GetInboxs' },
                { name: 'Target', value: processTxId },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return result.Messages[0].Data
        }
        else {

            return { status: 'error', msg: 'Unknown return data parsed' };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatGetInboxs Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return { status: 'error', msg: 'Unknown' };
    }
}

export const SendMessageToChivesChat = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, Message: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const NanoId = getNanoid(32)

        const SendMessageResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "Broadcast", Data = "' + Message + '", NanoId = "' + NanoId + '" })',
        });
        console.log("SendMessageToChivesChat SendMessage", SendMessageResult)
        
        if(SendMessageResult && SendMessageResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, SendMessageResult)

            return { status: 'ok', id: SendMessageResult, msg: MsgContent, NanoId: NanoId };
        }
        else {
            
            return { status: 'ok', id: SendMessageResult };
        }
    }
    catch(Error: any) {
        console.error("SendMessageToChivesChat Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const GetChatroomAvatar = (Logo: string) => {
    if(Logo && Logo.length == 43)  {
        return authConfig.backEndApi + "/" + Logo
    }
    else {
        return '/images/chives.png'
    }
}


export const AoChatroomInfoDryRun = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }

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
        console.error("AoChatroomInfoDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

