
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, AoLoadBlueprintModule } from 'src/functions/AoConnect/AoConnect'

export const AoLoadBlueprintMyProcessTxIds = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'myprocesstxids')
}

export const MyProcessTxIdsGetTokens = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetTokens' },
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
        console.error("MyProcessTxIdsGetTokens Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddToken = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, TokenId: string, TokenSort: string) => {
    try {
        console.log("MyProcessTxIdsAddToken TokenId", TokenId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddToken", TokenId = "' + TokenId + '", TokenSort = "' + TokenSort + '" })'
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("MyProcessTxIdsAddToken SendData", SendData)
        console.log("MyProcessTxIdsAddToken Data", Data)
        const GetMyProcessTxIdsAddTokenResult = await message(Data);
        console.log("MyProcessTxIdsAddToken GetMyProcessTxIdsAddTokenResult", GetMyProcessTxIdsAddTokenResult)
        
        if(GetMyProcessTxIdsAddTokenResult && GetMyProcessTxIdsAddTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsAddTokenResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddTokenResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelToken = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, TokenId: string) => {
    try {
        console.log("MyProcessTxIdsDelToken TokenId", TokenId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelToken", TokenId = "' + TokenId + ' })',
        }
        console.log("MyProcessTxIdsDelToken Data", Data)
        const GetMyProcessTxIdsDelTokenResult = await message(Data);
        console.log("MyProcessTxIdsDelToken GetMyProcessTxIdsDelTokenResult", GetMyProcessTxIdsDelTokenResult)
        
        if(GetMyProcessTxIdsDelTokenResult && GetMyProcessTxIdsDelTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsDelTokenResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelTokenResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}


export const MyProcessTxIdsGetChatrooms = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetChatrooms' },
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
        console.error("MyProcessTxIdsGetChatrooms Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddChatroom = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, ChatroomId: string, ChatroomSort: string) => {
    try {
        console.log("MyProcessTxIdsAddChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddChatroom", ChatroomId = "' + ChatroomId + '", ChatroomSort = "' + ChatroomSort + '" })',
        }
        console.log("MyProcessTxIdsAddChatroom Data", Data)
        const GetMyProcessTxIdsAddChatroomResult = await message(Data);
        console.log("MyProcessTxIdsAddChatroom GetMyProcessTxIdsAddChatroomResult", GetMyProcessTxIdsAddChatroomResult)
        
        if(GetMyProcessTxIdsAddChatroomResult && GetMyProcessTxIdsAddChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsAddChatroomResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelChatroom = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, ChatroomId: string) => {
    try {
        console.log("MyProcessTxIdsDelChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelChatroom", ChatroomId = "' + ChatroomId + ' })',
        }
        console.log("MyProcessTxIdsDelChatroom Data", Data)
        const GetMyProcessTxIdsDelChatroomResult = await message(Data);
        console.log("MyProcessTxIdsDelChatroom GetMyProcessTxIdsDelChatroomResult", GetMyProcessTxIdsDelChatroomResult)
        
        if(GetMyProcessTxIdsDelChatroomResult && GetMyProcessTxIdsDelChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsDelChatroomResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const MyProcessTxIdsGetGuesses = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetGuesses' },
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
        console.error("MyProcessTxIdsGetGuesses Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddGuess = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, GuessId: string, Guessesort: string) => {
    try {
        console.log("MyProcessTxIdsAddGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddGuess", GuessId = "' + GuessId + '", Guessesort = "' + Guessesort + '" })',
        }
        console.log("MyProcessTxIdsAddGuess Data", Data)
        const GetMyProcessTxIdsAddGuessResult = await message(Data);
        console.log("MyProcessTxIdsAddGuess GetMyProcessTxIdsAddGuessResult", GetMyProcessTxIdsAddGuessResult)
        
        if(GetMyProcessTxIdsAddGuessResult && GetMyProcessTxIdsAddGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsAddGuessResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddGuessResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelGuess = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, GuessId: string) => {
    try {
        console.log("MyProcessTxIdsDelGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelGuess", GuessId = "' + GuessId + ' })',
        }
        console.log("MyProcessTxIdsDelGuess Data", Data)
        const GetMyProcessTxIdsDelGuessResult = await message(Data);
        console.log("MyProcessTxIdsDelGuess GetMyProcessTxIdsDelGuessResult", GetMyProcessTxIdsDelGuessResult)
        
        if(GetMyProcessTxIdsDelGuessResult && GetMyProcessTxIdsDelGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsDelGuessResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelGuessResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const MyProcessTxIdsGetLotteries = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetLotteries' },
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
        console.error("MyProcessTxIdsGetLotteries Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddLottery = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, LotteryId: string, Lotteriesort: string) => {
    try {
        console.log("MyProcessTxIdsAddLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddLottery", LotteryId = "' + LotteryId + '", Lotteriesort = "' + Lotteriesort + '" })',
        }
        console.log("MyProcessTxIdsAddLottery Data", Data)
        const GetMyProcessTxIdsAddLotteryResult = await message(Data);
        console.log("MyProcessTxIdsAddLottery GetMyProcessTxIdsAddLotteryResult", GetMyProcessTxIdsAddLotteryResult)
        
        if(GetMyProcessTxIdsAddLotteryResult && GetMyProcessTxIdsAddLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsAddLotteryResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelLottery = async (currentWalletJwk: any, MyProcessTxId: string, myProcessTxId: string, LotteryId: string) => {
    try {
        console.log("MyProcessTxIdsDelLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelLottery", LotteryId = "' + LotteryId + ' })',
        }
        console.log("MyProcessTxIdsDelLottery Data", Data)
        const GetMyProcessTxIdsDelLotteryResult = await message(Data);
        console.log("MyProcessTxIdsDelLottery GetMyProcessTxIdsDelLotteryResult", GetMyProcessTxIdsDelLotteryResult)
        
        if(GetMyProcessTxIdsDelLotteryResult && GetMyProcessTxIdsDelLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myProcessTxId, GetMyProcessTxIdsDelLotteryResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}


