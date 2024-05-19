import { AoGetPageRecords } from './AoConnectLib'

const AoConnectLastCursor: string = 'AoConnectLastCursor'
const AoConnectAllMessages: string = 'AoConnectAllMessages'
const AoConnectEveryTimeGetMsgCount: number = 10

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export const ReminderMsgAndStoreToLocal = async (processTxId: string) => {
    const AoConnectLastCursorData = window.localStorage.getItem(AoConnectLastCursor) || undefined
    const AoGetPageRecordsList = await AoGetPageRecords(processTxId, 'DESC', AoConnectEveryTimeGetMsgCount, AoConnectLastCursorData);
    const NeedReminderMsg: any[] = []
    AoGetPageRecordsList && AoGetPageRecordsList.edges && AoGetPageRecordsList.edges.map((item: any, index: number)=>{

        if(index == 0 && item.cursor) {
            window.localStorage.setItem(AoConnectLastCursor, item.cursor)
        }
        if(item.node && item.node.Output && item.node.Output.data && typeof item.node.Output.data === 'string' )  {
            const Msg = item.node.Output.data.replace(ansiRegex, '');
            NeedReminderMsg.push([Msg, ''])
        }
        if(item.node && item.node.Output && item.node.Output.data && item.node.Output.data.output && typeof item.node.Output.data.output === 'string' )  {
            const Msg = item.node.Output.data.output.replace(ansiRegex, '');
            NeedReminderMsg.push([Msg, ''])
        }
        if(item.node && item.node.Messages && typeof item.node.Messages === 'object' && item.node.Messages.length > 0)  {
            const MessagesList = item.node.Messages;
            MessagesList && MessagesList.map((ItemMsg: any, Index: number)=>{
                const Data = ItemMsg.Data
                const Tags = ItemMsg.Tags

                const ActionList = Tags.filter((item: any)=> item.name == 'Action')
                if( ActionList && ActionList.length == 1 )  {
                    const Value = ActionList[0]['value']
                    const FromProcessList = Tags.filter((item: any)=> item.name == 'From-Process')
                    const FromProcess = FromProcessList[0]['value']
                    if(Data) {
                        NeedReminderMsg.push([Data.replace(ansiRegex, ''), Value.replace(ansiRegex, '') + " from " + ItemMsg.Target])
                    }
                    else {
                        NeedReminderMsg.push([Value.replace(ansiRegex, '') + " from " + ItemMsg.Target, FromProcess])
                    }
                }

                const TickerList = Tags.filter((item: any)=> item.name == 'Ticker')
                if( TickerList && TickerList.length == 1 )  {
                    const Value = TickerList[0]['value']
                    const LogoList = Tags.filter((item: any)=> item.name == 'Logo')
                    const Logo = LogoList && LogoList[0] && LogoList[0]['value'] ? LogoList[0]['value'] : null
                    const FromProcessList = Tags.filter((item: any)=> item.name == 'From-Process')
                    const FromProcess = FromProcessList[0]['value']
                    if(Data) {
                        NeedReminderMsg.push([Data.replace(ansiRegex, ''), Value.replace(ansiRegex, '') + " from " + ItemMsg.Target, Logo])
                    }
                    else {
                        NeedReminderMsg.push([Value.replace(ansiRegex, '') + " from " + ItemMsg.Target, FromProcess])
                    }
                }
                
            })
        }
        console.log("typeof item.node.Messages", typeof item.node.Messages, item.node.Messages)

    })

    return NeedReminderMsg
}

