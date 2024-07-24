
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import axios from 'axios'

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord } from 'src/functions/AoConnect/AoConnect'
import { AoTokenTransfer } from 'src/functions/AoConnect/Token'


export const AoLoadBlueprintFaucet = async (currentWalletJwk: any, processTxId: string, FaucetInfo: any) => {
    try {
        if(processTxId && processTxId.length != 43) {

            return
        }
        if(typeof processTxId != 'string') {

            return 
        }

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/blueprints/chivesfaucet.lua', { headers: { }, params: { } }).then(res => res.data)
        
        //Filter Faucet Infor
        if(FaucetInfo && FaucetInfo.Name) {
            Data = Data.replace("AoConnectFaucet", FaucetInfo.Name)
        }
        if(FaucetInfo && FaucetInfo.Logo) {
            Data = Data.replace("dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ", FaucetInfo.Logo)
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

            return { status: 'ok', id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintFaucet Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoFaucetCheckBalance = async (currentWalletJwk: any, FaucetTxId: string, myAoConnectTxId: string) => {
    try {
        if(FaucetTxId && FaucetTxId.length != 43) {

            return
        }
        if(myAoConnectTxId && myAoConnectTxId.length != 43) {

            return
        }
        if(typeof FaucetTxId != 'string' || typeof myAoConnectTxId != 'string') {

            return 
        }
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendFaucetResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + FaucetTxId + '", Action = "CheckBalance", Tags = { Target = ao.id } })',
        });
        console.log("AoFaucetCheckBalance Balance", SendFaucetResult)
        
        if(SendFaucetResult && SendFaucetResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, SendFaucetResult)
            console.log("AoFaucetCheckBalance MsgContent", MsgContent)

            return { status: 'ok', id: SendFaucetResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendFaucetResult };
        }
    }
    catch(Error: any) {
        console.error("AoFaucetBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoFaucetCredit = async (currentWalletJwk: any, FaucetTxId: string, myFaucetProcessTxId: string, sendOutProcessTxId: string) => {
    try {
        if(FaucetTxId && FaucetTxId.length != 43) {

            return
        }
        if(myFaucetProcessTxId && myFaucetProcessTxId.length != 43) {

            return
        }
        if(sendOutProcessTxId && sendOutProcessTxId.length != 43) {

            return
        }
        if(typeof FaucetTxId != 'string' || typeof myFaucetProcessTxId != 'string' || typeof sendOutProcessTxId != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = 'Send({ Target = "' + FaucetTxId + '", Action = "Credit", Recipient = "' + sendOutProcessTxId + '" })'
        const SendFaucetResult = await message({
            process: myFaucetProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Data,
        });
        console.log("AoFaucetCredit Credit", SendFaucetResult, Data)
        
        if(SendFaucetResult && SendFaucetResult.length == 43) {
            const MsgContent = await AoGetRecord(myFaucetProcessTxId, SendFaucetResult)

            return { status: 'ok', id: SendFaucetResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendFaucetResult };
        }
    }
    catch(Error: any) {
        console.error("AoFaucetCredit Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoFaucetDeposit = async (currentWalletJwk: any, FaucetTxId: string, myFaucetProcessTxId: string, sendOutProcessTxId: string, sendOutAmount: number) => {

    return await AoTokenTransfer(currentWalletJwk, FaucetTxId, sendOutProcessTxId, sendOutAmount)
}

export const AoFaucetDepositBalances = async (TargetTxId: string, startIndex: string, endIndex: string) => {
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
                { name: 'Action', value: 'depositBalances' },
                { name: 'Target', value: TargetTxId },
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

            return 
        }
    }
    catch(Error: any) {
        console.error("AoFaucetDepositBalances Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoFaucetCreditBalances = async (TargetTxId: string, startIndex: string, endIndex: string) => {
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
                { name: 'Action', value: 'creditBalances' },
                { name: 'Target', value: TargetTxId },
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

            return 
        }
    }
    catch(Error: any) {
        console.error("AoFaucetCreditBalances Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}