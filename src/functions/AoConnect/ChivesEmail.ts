
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, AoLoadBlueprintModule } from 'src/functions/AoConnect/AoConnect'

export const AoLoadBlueprintChivesEmail = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chivesemail')
}

export const ChivesEmailGetMyEmailRecords = async (TargetTxId: string, myAoConnectTxId: string, folder: string, startIndex: string, endIndex: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: myAoConnectTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetMyEmailRecords' },
                { name: 'Target', value: myAoConnectTxId },
                { name: 'Folder', value: folder },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });
        console.log("ChivesEmailGetMyEmailRecords", result)

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesEmailGetMyEmailRecords Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesEmailGetPublicKeys = async (TargetTxId: string, myAoConnectTxId: string, Target: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: myAoConnectTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetPublicKeys' },
                { name: 'Target', value: Target },
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
        console.error("ChivesEmailGetPublicKeys Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesEmailReadEmailContent = async (currentWalletJwk: any, TargetTxId: string, myAoConnectTxId: string, EmailId: string, Folder: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + TargetTxId + '", Action = "ReadEmailContent", EmailId = "' + EmailId + '", Folder = "' + Folder + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        const GetChivesEmailReadEmailContentResult = await message(Data);
        
        //console.log("ChivesEmailReadEmailContent SendData", SendData)
        //console.log("ChivesEmailReadEmailContent Data", Data)
        //console.log("ChivesEmailReadEmailContent GetChivesEmailReadEmailContentResult", GetChivesEmailReadEmailContentResult)
        
        if(GetChivesEmailReadEmailContentResult && GetChivesEmailReadEmailContentResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesEmailReadEmailContentResult)

            return { status: 'ok', id: GetChivesEmailReadEmailContentResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesEmailReadEmailContentResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesEmailReadEmailContent Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesEmailMoveToFolder = async (currentWalletJwk: any, TargetTxId: string, myAoConnectTxId: string, EmailId: string, OldFolder: string, NewFolder: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + TargetTxId + '", Action = "MoveToFolder", EmailId = "' + EmailId + '", OldFolder = "' + OldFolder + '", NewFolder = "' + NewFolder + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        const GetChivesEmailMoveToFolderResult = await message(Data);

        //console.log("ChivesEmailMoveToFolder EmailId", EmailId)
        //console.log("ChivesEmailMoveToFolder SendData", SendData)
        //console.log("ChivesEmailMoveToFolder Data", Data)
        //console.log("ChivesEmailMoveToFolder GetChivesEmailMoveToFolderResult", GetChivesEmailMoveToFolderResult)
        
        if(GetChivesEmailMoveToFolderResult && GetChivesEmailMoveToFolderResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesEmailMoveToFolderResult)

            return { status: 'ok', id: GetChivesEmailMoveToFolderResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesEmailMoveToFolderResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesEmailMoveToFolder Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesEmailGetEmailRecords = async (TargetTxId: string, myAoConnectTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: myAoConnectTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetEmailRecords' },
                { name: 'Target', value: myAoConnectTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesEmailGetEmailRecords Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesEmailSendEmail = async (currentWalletJwk: any, TargetTxId: string, myAoConnectTxId: string, To: string, Subject: string, Content: string, Summary: string, Encrypted: string) => {
    try {
        const currentTimestampWithOffset: number = Date.now();
        const currentTimezoneOffset: number = new Date().getTimezoneOffset();
        const currentTimestampInZeroUTC: number = currentTimestampWithOffset + (currentTimezoneOffset * 60 * 1000);

        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + TargetTxId + '", Action = "SendEmail", To = "' + To + '", Subject = "' + Subject + '", Data = "' + Content + '", Summary = "' + Summary + '", Encrypted = "' + Encrypted + '", Timestamp = "' + currentTimestampInZeroUTC + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        const GetChivesEmailSendEmailResult = await message(Data);

        console.log("ChivesEmailSendEmail SendData", SendData)
        //console.log("ChivesEmailSendEmail Data", Data)
        //console.log("ChivesEmailSendEmail GetChivesEmailSendEmailResult", GetChivesEmailSendEmailResult)
        
        if(GetChivesEmailSendEmailResult && GetChivesEmailSendEmailResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesEmailSendEmailResult)

            return { status: 'ok', id: GetChivesEmailSendEmailResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesEmailSendEmailResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesEmailSendEmail Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesEmailSetPublicKey = async (currentWalletJwk: any, TargetTxId: string, myAoConnectTxId: string, PublicKey: string, PublicKeyMAC: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + TargetTxId + '", Action = "SetPublicKey", PublicKey = "' + PublicKey + '", PublicKeyMAC = "' + PublicKeyMAC + '" })',
        }
        const GetChivesEmailSetPublicKeyResult = await message(Data);

        //console.log("ChivesEmailSetPublicKey PublicKey", PublicKey)
        //console.log("ChivesEmailSetPublicKey Data", Data)
        //console.log("ChivesEmailSetPublicKey GetChivesEmailSetPublicKeyResult", GetChivesEmailSetPublicKeyResult)
        
        if(GetChivesEmailSetPublicKeyResult && GetChivesEmailSetPublicKeyResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesEmailSetPublicKeyResult)

            return { status: 'ok', id: GetChivesEmailSetPublicKeyResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesEmailSetPublicKeyResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesEmailSetPublicKey Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}
