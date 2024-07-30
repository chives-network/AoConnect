
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

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/blueprints/chivesfaucet.lua', { timeout: 10000 }).then(res => res.data)
        
        //Filter Faucet Infor
        if(FaucetInfo && FaucetInfo.Name) {
            Data = Data.replace("AoConnectFaucet", FaucetInfo.Name)
        }
        if(FaucetInfo && FaucetInfo.Logo) {
            Data = Data.replace("dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ", FaucetInfo.Logo)
        }
        if(FaucetInfo && FaucetInfo.FAUCET_TOKEN_ID) {
            Data = Data.replace("Yot4NNkLcwWly8OfEQ81LCZuN4i4xysZTKJYuuZvM1Q", FaucetInfo.FAUCET_TOKEN_ID)
        }
        if(FaucetInfo && FaucetInfo.FAUCET_SEND_AMOUNT) {
            Data = Data.replace("0.123", FaucetInfo.FAUCET_SEND_AMOUNT)
        }
        if(FaucetInfo && FaucetInfo.FAUCET_SEND_RULE) {
            Data = Data.replace("EveryDay", FaucetInfo.FAUCET_SEND_RULE)
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

export const AoFaucetGetFaucet = async (currentWalletJwk: any, FaucetTxId: string) => {
    try {
        if(FaucetTxId && FaucetTxId.length != 43) {

            return
        }
        if(typeof FaucetTxId != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: FaucetTxId,
            tags: [
              { name: "Action", value: "GetFaucet" },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const SendTokenResult = await message(data);
        console.log("AoFaucetGetFaucet SendTokenResult:", SendTokenResult)

        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(FaucetTxId, SendTokenResult)

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }

    }
    catch(Error: any) {
        console.error("AoFaucetGetFaucet Error:", Error)
    }

}

export const AoFaucetDepositToken = async (currentWalletJwk: any, FAUCET_TOKEN_ID: string, FaucetTxIdAsReceivedAddress: string, DepositAmount: number) => {
    
    return await AoTokenTransfer(currentWalletJwk, FAUCET_TOKEN_ID, FaucetTxIdAsReceivedAddress, DepositAmount)
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

        const result: any = await dryrun({
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

            return JSON.parse(result.Messages[0].Data)
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

            return JSON.parse(result.Messages[0].Data)
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

export const AoFaucetGetFaucetBalance = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'CheckFaucetBalance' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[1] && result.Messages[1].Data) {

            return result.Messages[1].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoFaucetGetFaucetBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoFaucetInfo = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Info' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        console.log("result", result)

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Tags) {
            const Tags: any[] = result.Messages[0].Tags
            const TagsMap: any = {}
            Tags && Tags.map((Tag: any)=>{
                TagsMap[Tag.name] = Tag.value
            })

            return TagsMap
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoFaucetGetFaucetBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}


