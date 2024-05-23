import { connect, createDataItemSigner } from "@permaweb/aoconnect"
import { ConvertInboxMessageFormatToJson, SaveInboxMsgIntoIndexedDb } from './AoConnectMsgReminder'

const MU_URL = "https://mu.ao-testnet.xyz"
const CU_URL = "https://cu.ao-testnet.xyz"
const GATEWAY_URL = "https://arweave.net"

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
        return { id: GetMyLastMsgResult, msg: MsgContent };
    }
    else {
        return { id: GetMyLastMsgResult };
    }
  
}

export const AoSendMsg = async (currentWalletJwk: any, processTxId: string, Msg: string, Tags: any[]) => {
    
    const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

    try {
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

        console.log("AoSendMsg Error", Error)
    }
}

export const AoGetLastPage = async (processTxId: string, Sort: string = 'DESC', Limit: number = 25) => {

    const { results } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
    let resultsOut = await results({
        process: processTxId,
        sort: Sort,
        limit: Limit,
    });

    return resultsOut
}

export const AoGetRecord = async (processTxId: string, messageTxId: string) => {

    const { result } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
    let resultsOut = await result({
        process: processTxId,
        message: messageTxId
    });

    return resultsOut
}

export const AoGetMessage = async (processTxId: string, messageTxId: string) => {

    const { result } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
    let resultsOut = await result({
        process: processTxId,
        message: messageTxId
    });

    return resultsOut
}

export const AoGetPageRecords = async (processTxId: string, Sort: string = 'DESC', Limit: number = 25, From: string = '') => {

    const { results } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
    let resultsOut = await results({
        process: processTxId,
        from: From && From != '' ? From : undefined,
        sort: Sort, 
        limit: Limit,
    });

    return resultsOut
}

export const AoCreateProcess = async (currentWalletJwk: any, moduleTxId: string, scheduler: string, Tags: any[]) => {
    
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

export const AoDryRun = async (currentWalletJwk: any, processTxId: string, Data: string, Tags: any[]) => {
    
    const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

    const result = await dryrun({
        process: processTxId,
        data: Data,
        tags: [{name: 'Action', value: 'Balance'}],
        anchor: '1234'
      });

    console.log("AoDryRun result", result)
  
    return result;
}

export const AoMonitor = async (currentWalletJwk: any, processTxId: string) => {
    
    const { monitor } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

    const result = await monitor({
        process: processTxId,
        signer: createDataItemSigner(currentWalletJwk),
      });

    console.log("AoMonitor result", result)
  
    return result;
}

export const AoUnMonitor = async (currentWalletJwk: any, processTxId: string) => {
    
    const { unmonitor } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

    const result = await unmonitor({
        process: processTxId,
        signer: createDataItemSigner(currentWalletJwk),
      });

    console.log("AoUnMonitor result", result)
  
    return result;
}

export const GetMyCurrentProcessTxId = (Address: string, Index: number) => {

    return 'YeIgn_CImXg4UPHOg7-rbylVv9su6FKXY2LIHwWFB5g'
}
