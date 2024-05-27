
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
