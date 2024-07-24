
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "scripts/@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord } from 'src/functions/AoConnect/AoConnect'

import axios from 'axios'
import { jwkToAddress } from 'src/functions/ChivesWallets'

export const AoLoadBlueprintChivesServerData = async (currentWalletJwk: any, processTxId: string) => {
    try {
        if(processTxId && processTxId.length != 43) {

            return
        }
        if(typeof processTxId != 'string') {

            return 
        }

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoConnect/main/blueprints/chivesserverdata.lua', { headers: { }, params: { } }).then(res => res.data)
        
        const address = await jwkToAddress(currentWalletJwk)
        if(address && address.length == 43) {
            Data = Data.replaceAll("AoConnectOwner", address)
        }

        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Data,
        });
        console.log("AoLoadBlueprintChivesServerData GetMyLastMsg", module, GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("AoLoadBlueprintChivesServerData MsgContent", module, MsgContent)

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

export const ChivesServerDataGetTokens = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetTokens Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddToken = async (currentWalletJwk: any, MyProcessTxId: string, TokenId: string, TokenSort: string, TokenGroup: string, TokenData: string) => {
    try {
        console.log("ChivesServerDataAddToken TokenId", TokenId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddToken" },
              { name: "TokenId", value: TokenId },
              { name: "TokenSort", value: TokenSort ?? '100' },
              { name: "TokenGroup", value: TokenGroup },
              { name: "TokenData", value: TokenData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddTokenResult = await message(data);
        console.log("ChivesServerDataAddToken GetChivesServerDataAddTokenResult", GetChivesServerDataAddTokenResult)
        
        if(GetChivesServerDataAddTokenResult && GetChivesServerDataAddTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddTokenResult)

            return { status: 'ok', id: GetChivesServerDataAddTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddTokenResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelToken = async (currentWalletJwk: any, MyProcessTxId: string, TokenId: string) => {
    try {
        console.log("ChivesServerDataDelToken TokenId", TokenId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelToken" },
              { name: "TokenId", value: TokenId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelTokenResult = await message(data);
        console.log("ChivesServerDataDelToken GetChivesServerDataDelTokenResult", GetChivesServerDataDelTokenResult)
        
        if(GetChivesServerDataDelTokenResult && GetChivesServerDataDelTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelTokenResult)

            return { status: 'ok', id: GetChivesServerDataDelTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelTokenResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}


export const ChivesServerDataGetChatrooms = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetChatrooms Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddChatroom = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ChatroomId: string, ChatroomSort: string, ChatroomGroup: string, ChatroomData: string) => {
    try {
        console.log("ChivesServerDataAddChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddChatroom", ChatroomId = "' + ChatroomId + '", ChatroomSort = "' + ChatroomSort + '", ChatroomGroup = "' + ChatroomGroup + '", ChatroomData = "' + ChatroomData + '" })',
        }
        console.log("ChivesServerDataAddChatroom Data", Data)
        const GetChivesServerDataAddChatroomResult = await message(Data);
        console.log("ChivesServerDataAddChatroom GetChivesServerDataAddChatroomResult", GetChivesServerDataAddChatroomResult)
        
        if(GetChivesServerDataAddChatroomResult && GetChivesServerDataAddChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataAddChatroomResult)

            return { status: 'ok', id: GetChivesServerDataAddChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelChatroom = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ChatroomId: string) => {
    try {
        console.log("ChivesServerDataDelChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelChatroom", ChatroomId = "' + ChatroomId + '" })',
        }
        console.log("ChivesServerDataDelChatroom Data", Data)
        const GetChivesServerDataDelChatroomResult = await message(Data);
        console.log("ChivesServerDataDelChatroom GetChivesServerDataDelChatroomResult", GetChivesServerDataDelChatroomResult)
        
        if(GetChivesServerDataDelChatroomResult && GetChivesServerDataDelChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataDelChatroomResult)

            return { status: 'ok', id: GetChivesServerDataDelChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetGuesses = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetGuesses Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddGuess = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, GuessId: string, GuessSort: string, GuessGroup: string, GuessData: string) => {
    try {
        console.log("ChivesServerDataAddGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddGuess", GuessId = "' + GuessId + '", GuessSort = "' + GuessSort + '", GuessGroup = "' + GuessGroup + '", GuessData = "' + GuessData + '" })',
        }
        console.log("ChivesServerDataAddGuess Data", Data)
        const GetChivesServerDataAddGuessResult = await message(Data);
        console.log("ChivesServerDataAddGuess GetChivesServerDataAddGuessResult", GetChivesServerDataAddGuessResult)
        
        if(GetChivesServerDataAddGuessResult && GetChivesServerDataAddGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataAddGuessResult)

            return { status: 'ok', id: GetChivesServerDataAddGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddGuessResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelGuess = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, GuessId: string) => {
    try {
        console.log("ChivesServerDataDelGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelGuess", GuessId = "' + GuessId + '" })',
        }
        console.log("ChivesServerDataDelGuess Data", Data)
        const GetChivesServerDataDelGuessResult = await message(Data);
        console.log("ChivesServerDataDelGuess GetChivesServerDataDelGuessResult", GetChivesServerDataDelGuessResult)
        
        if(GetChivesServerDataDelGuessResult && GetChivesServerDataDelGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataDelGuessResult)

            return { status: 'ok', id: GetChivesServerDataDelGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelGuessResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetLotteries = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetLotteries Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddLottery = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, LotteryId: string, LotterySort: string, LotteryGroup: string, LotteryData: string) => {
    try {
        console.log("ChivesServerDataAddLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddLottery", LotteryId = "' + LotteryId + '", LotterySort = "' + LotterySort + '", LotteryGroup = "' + LotteryGroup + '", LotteryData = "' + LotteryData + '" })',
        }
        console.log("ChivesServerDataAddLottery Data", Data)
        const GetChivesServerDataAddLotteryResult = await message(Data);
        console.log("ChivesServerDataAddLottery GetChivesServerDataAddLotteryResult", GetChivesServerDataAddLotteryResult)
        
        if(GetChivesServerDataAddLotteryResult && GetChivesServerDataAddLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataAddLotteryResult)

            return { status: 'ok', id: GetChivesServerDataAddLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelLottery = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, LotteryId: string) => {
    try {
        console.log("ChivesServerDataDelLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelLottery", LotteryId = "' + LotteryId + '" })',
        }
        console.log("ChivesServerDataDelLottery Data", Data)
        const GetChivesServerDataDelLotteryResult = await message(Data);
        console.log("ChivesServerDataDelLottery GetChivesServerDataDelLotteryResult", GetChivesServerDataDelLotteryResult)
        
        if(GetChivesServerDataDelLotteryResult && GetChivesServerDataDelLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataDelLotteryResult)

            return { status: 'ok', id: GetChivesServerDataDelLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetBlogs = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetBlogs' },
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
        console.error("ChivesServerDataGetBlogs Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddBlog = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, BlogId: string, BlogSort: string, BlogGroup: string, BlogData: string) => {
    try {
        console.log("ChivesServerDataAddBlog BlogId", BlogId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddBlog", BlogId = "' + BlogId + '", BlogSort = "' + BlogSort + '", BlogGroup = "' + BlogGroup + '", BlogData = "' + BlogData + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("ChivesServerDataAddBlog SendData", SendData)
        console.log("ChivesServerDataAddBlog Data", Data)
        const GetChivesServerDataAddBlogResult = await message(Data);
        console.log("ChivesServerDataAddBlog GetChivesServerDataAddBlogResult", GetChivesServerDataAddBlogResult)
        
        if(GetChivesServerDataAddBlogResult && GetChivesServerDataAddBlogResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataAddBlogResult)

            return { status: 'ok', id: GetChivesServerDataAddBlogResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddBlogResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddBlog Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelBlog = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, BlogId: string) => {
    try {
        console.log("ChivesServerDataDelBlog BlogId", BlogId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelBlog", BlogId = "' + BlogId + '" })',
        }
        console.log("ChivesServerDataDelBlog Data", Data)
        const GetChivesServerDataDelBlogResult = await message(Data);
        console.log("ChivesServerDataDelBlog GetChivesServerDataDelBlogResult", GetChivesServerDataDelBlogResult)
        
        if(GetChivesServerDataDelBlogResult && GetChivesServerDataDelBlogResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataDelBlogResult)

            return { status: 'ok', id: GetChivesServerDataDelBlogResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelBlogResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelBlog Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetSwaps = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetSwaps' },
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
        console.error("ChivesServerDataGetSwaps Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddSwap = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, SwapId: string, SwapSort: string, SwapGroup: string, SwapData: string) => {
    try {
        console.log("ChivesServerDataAddSwap SwapId", SwapId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddSwap", SwapId = "' + SwapId + '", SwapSort = "' + SwapSort + '", SwapGroup = "' + SwapGroup + '", SwapData = "' + SwapData + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("ChivesServerDataAddSwap SendData", SendData)
        console.log("ChivesServerDataAddSwap Data", Data)
        const GetChivesServerDataAddSwapResult = await message(Data);
        console.log("ChivesServerDataAddSwap GetChivesServerDataAddSwapResult", GetChivesServerDataAddSwapResult)
        
        if(GetChivesServerDataAddSwapResult && GetChivesServerDataAddSwapResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataAddSwapResult)

            return { status: 'ok', id: GetChivesServerDataAddSwapResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddSwapResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddSwap Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelSwap = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, SwapId: string) => {
    try {
        console.log("ChivesServerDataDelSwap SwapId", SwapId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelSwap", SwapId = "' + SwapId + '" })',
        }
        console.log("ChivesServerDataDelSwap Data", Data)
        const GetChivesServerDataDelSwapResult = await message(Data);
        console.log("ChivesServerDataDelSwap GetChivesServerDataDelSwapResult", GetChivesServerDataDelSwapResult)
        
        if(GetChivesServerDataDelSwapResult && GetChivesServerDataDelSwapResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataDelSwapResult)

            return { status: 'ok', id: GetChivesServerDataDelSwapResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelSwapResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelSwap Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetProjects = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetProjects' },
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
        console.error("ChivesServerDataGetProjects Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddProject = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ProjectId: string, ProjectSort: string, ProjectGroup: string, ProjectData: string) => {
    try {
        console.log("ChivesServerDataAddProject ProjectId", ProjectId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddProject", ProjectId = "' + ProjectId + '", ProjectSort = "' + ProjectSort + '", ProjectGroup = "' + ProjectGroup + '", ProjectData = "' + ProjectData + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("ChivesServerDataAddProject SendData", SendData)
        console.log("ChivesServerDataAddProject Data", Data)
        const GetChivesServerDataAddProjectResult = await message(Data);
        console.log("ChivesServerDataAddProject GetChivesServerDataAddProjectResult", GetChivesServerDataAddProjectResult)
        
        if(GetChivesServerDataAddProjectResult && GetChivesServerDataAddProjectResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataAddProjectResult)

            return { status: 'ok', id: GetChivesServerDataAddProjectResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddProjectResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddProject Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelProject = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ProjectId: string) => {
    try {
        console.log("ChivesServerDataDelProject ProjectId", ProjectId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelProject", ProjectId = "' + ProjectId + '" })',
        }
        console.log("ChivesServerDataDelProject Data", Data)
        const GetChivesServerDataDelProjectResult = await message(Data);
        console.log("ChivesServerDataDelProject GetChivesServerDataDelProjectResult", GetChivesServerDataDelProjectResult)
        
        if(GetChivesServerDataDelProjectResult && GetChivesServerDataDelProjectResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataDelProjectResult)

            return { status: 'ok', id: GetChivesServerDataDelProjectResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelProjectResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelProject Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}


export const ChivesServerDataGetFaucets = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetFaucets' },
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
        console.error("ChivesServerDataGetFaucets Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddFaucet = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, FaucetId: string, FaucetSort: string, FaucetGroup: string, FaucetData: string) => {
    try {
        console.log("ChivesServerDataAddFaucet FaucetId", FaucetId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddFaucet", FaucetId = "' + FaucetId + '", FaucetSort = "' + FaucetSort + '", FaucetGroup = "' + FaucetGroup + '", FaucetData = "' + FaucetData + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("ChivesServerDataAddFaucet SendData", SendData)
        console.log("ChivesServerDataAddFaucet Data", Data)
        const GetChivesServerDataAddFaucetResult = await message(Data);
        console.log("ChivesServerDataAddFaucet GetChivesServerDataAddFaucetResult", GetChivesServerDataAddFaucetResult)
        
        if(GetChivesServerDataAddFaucetResult && GetChivesServerDataAddFaucetResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataAddFaucetResult)

            return { status: 'ok', id: GetChivesServerDataAddFaucetResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddFaucetResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddFaucet Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelFaucet = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, FaucetId: string) => {
    try {
        console.log("ChivesServerDataDelFaucet FaucetId", FaucetId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelFaucet", FaucetId = "' + FaucetId + '" })',
        }
        console.log("ChivesServerDataDelFaucet Data", Data)
        const GetChivesServerDataDelFaucetResult = await message(Data);
        console.log("ChivesServerDataDelFaucet GetChivesServerDataDelFaucetResult", GetChivesServerDataDelFaucetResult)
        
        if(GetChivesServerDataDelFaucetResult && GetChivesServerDataDelFaucetResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChivesServerDataDelFaucetResult)

            return { status: 'ok', id: GetChivesServerDataDelFaucetResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelFaucetResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelFaucet Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}