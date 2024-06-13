
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import axios from 'axios'

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, BalanceTimes } from 'src/functions/AoConnect/AoConnect'



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

            return { status: 'ok', id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
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

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
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

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalances Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
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

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenTransfer Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
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

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenTransfer Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
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
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

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
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenBalancesPageDryRun = async (TargetTxId: string, startIndex: string, endIndex: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'BalancesPage' },
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
        console.error("AoTokenBalancesPageDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

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
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

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
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}
