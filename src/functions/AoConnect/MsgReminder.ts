import { AoGetPageRecords } from './AoConnect'

const AoConnectIndexedDb = 'AoConnectDb'
const AoConnectLastCursor = 'AoConnectLastCursor'
const AoConnectAllMessages = 'AoConnectAllMessages'
const AoConnectReminderProcessTxId = 'AoConnectReminderProcessTxId'
const AoConnectReminderChatroomTxId = 'AoConnectReminderChatroomTxId'
const AoConnectEveryTimeGetMsgCount = 10

export const SetAoConnectReminderChatroomTxId = (chatroomTxId: string) => {
    window.localStorage.setItem(AoConnectReminderChatroomTxId, chatroomTxId)

    return window.localStorage.getItem(AoConnectReminderChatroomTxId) ?? ''
}

export const GetAoConnectReminderChatroomTxId = () => {

    return window.localStorage.getItem(AoConnectReminderChatroomTxId) ?? ''
}

export const SetAoConnectReminderProcessTxId = (processTxId: string) => {
    window.localStorage.setItem(AoConnectReminderProcessTxId, processTxId)

    return window.localStorage.getItem(AoConnectReminderProcessTxId) ?? ''
}

export const GetAoConnectReminderProcessTxId = () => {

    return window.localStorage.getItem(AoConnectReminderProcessTxId) ?? ''
}

const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export const ReminderMsgAndStoreToLocal = async (processTxId: string) => {
    const AoConnectLastCursorData = window.localStorage.getItem(AoConnectLastCursor) || undefined
    const AoGetPageRecordsList = await AoGetPageRecords(processTxId, 'DESC', AoConnectEveryTimeGetMsgCount, AoConnectLastCursorData);
    const NeedReminderMsg: any[] = []
    AoGetPageRecordsList && AoGetPageRecordsList.edges && AoGetPageRecordsList.edges.map((item: any, index: number)=>{

        if(index == 0 && item.cursor) {
            window.localStorage.setItem(AoConnectLastCursor, item.cursor)
        }

        //Output From Chatroom Msg Reminder
        if(item.node && item.node.Output && item.node.Output.data && typeof item.node.Output.data === 'string' )  {
            const Data = item.node.Output.data.replace(ansiRegex, '');
            //NeedReminderMsg.push({Target: null, Action: 'Output', Type:'Reminder', From: null, Data, Ref_: null, Logo: null, Sender: null})
        }

        //Output From Chatroom Msg Reminder
        if(item.node && item.node.Output && item.node.Output.data && item.node.Output.data.output && typeof item.node.Output.data.output === 'string' )  {
            const Msg = item.node.Output.data.output.replace(ansiRegex, '');
            
            //NeedReminderMsg.push([Msg, ''])
        }

        //Messages
        if(item.node && item.node.Messages && typeof item.node.Messages === 'object' && item.node.Messages.length > 0)  {
            const MessagesList = item.node.Messages;
            MessagesList && MessagesList.map((ItemMsg: any, Index: number)=>{
                const Data = ItemMsg?.Data?.replace(ansiRegex, '')
                const Tags = ItemMsg.Tags
                const Target = ItemMsg.Target

                if( Data || Target )   {

                    const TagsMap: any = {}
                    Tags.map((ItemTag: any)=>{
                        TagsMap[ItemTag.name] = ItemTag.value
                    })

                    const From = TagsMap['From-Process']
                    const Sender = TagsMap['Sender']
                    let Type = TagsMap['Type']
                    if(Sender) Type = "Chat"
                    const Action = TagsMap['Action']
                    const Ref_ = TagsMap['Ref_']
                    let Logo = null
                    if(Action)  {
                        Logo = "/images/apple-touch-icon.png"
                    }
                    else if(Data == 'Broadcasted.') {
                        Logo = "/images/apple-touch-icon.png"
                    }

                    //Messages
                    NeedReminderMsg.push({Target, Action, Type, From, Data, Ref_, Logo, Sender})

                    const TickerList = Tags.filter((item: any)=> item.name == 'Ticker')
                    if( TickerList && TickerList.length == 1 )  {
                        const Value = TickerList[0]['value']
                        const LogoList = Tags.filter((item: any)=> item.name == 'Logo')
                        const Logo = LogoList && LogoList[0] && LogoList[0]['value'] ? LogoList[0]['value'] : null
                        const FromList = Tags.filter((item: any)=> item.name == 'From-Process')
                        const From = FromList[0]['value']
                        if(Data) {
                            //NeedReminderMsg.push([Data.replace(ansiRegex, ''), Value.replace(ansiRegex, '') + " from " + Target, Logo])
                        }
                        else {
                            //NeedReminderMsg.push([Value.replace(ansiRegex, '') + " from " + Target, From])
                        }
                    }

                }

                
                
            })
        }
        console.log("typeof item.node.Messages", typeof item.node.Messages, item.node.Messages)

    })

    //Write to IndexedDb
    SaveMessagesIntoIndexedDb(processTxId, NeedReminderMsg)
    
    console.log("ReminderMsgAndStoreToLocal NeedReminderMsg", NeedReminderMsg)

    return NeedReminderMsg
}

export const SaveMessagesIntoIndexedDb = (processTxId: string, NeedReminderMsg: any[]) => {

    let db: any = null;
    const request = OpenDb(processTxId);

    request.onsuccess = function(event: any) {
        db = event.target.result;
        if (db) {
            if (db.objectStoreNames.contains('ReminderMsg')) {
                const transaction = db.transaction(['ReminderMsg'], 'readwrite');
                const objectStore = transaction.objectStore('ReminderMsg');

                console.log("SaveMessagesIntoIndexedDb 3333", NeedReminderMsg)

                NeedReminderMsg && NeedReminderMsg.map((ItemMsg: any)=>{

                    const {Target, Action, Type, From, Data, Ref_, Logo, Sender} = ItemMsg

                    objectStore.add({
                        Target: Target,
                        Action: Action,
                        Type: Type,
                        From: From,
                        Sender: Sender,
                        Data: Data,
                        Ref_: Ref_,
                        Logo: Logo
                    });

                })

                transaction.oncomplete = function() {
                    db.close();
                };
            }
        }
    };
    request.onupgradeneeded = function(event: any) {
        db = event.target.result;
        if(db) {
            CreateDbTables(db)
        }
    };

}

export const GetChatLogFromIndexedDb = (processTxId: string) => {
    return new Promise((resolve, reject) => {
        const request = OpenDb(processTxId, reject);

        request.onsuccess = function(event: any) {
            const db = event.target.result;
            
            // 在成功打开数据库后，创建一个只读事务并获取存储对象
            if (db.objectStoreNames.contains('ReminderMsg')) {
                const transaction = db.transaction(['ReminderMsg'], 'readonly');
                const objectStore = transaction.objectStore('ReminderMsg');
                
                // 定义分页参数
                const pageSize = 5;
                let pageNumber = 1;
                let offset = 0;
                
                const cursorRequest = objectStore.openCursor(null, 'prev')
                const Result: any[] = []
                cursorRequest.onsuccess = function(event: any) {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (offset >= (pageNumber - 1) * pageSize && offset < pageNumber * pageSize) {
                            console.log('Retrieved data:', cursor.value);
                            Result.push(cursor.value);
                        }
                        offset++;
                        cursor.continue();
                    } else {
                        console.log('End of data', Result);
                        resolve(Result);
                    }
                };
            }
        };
    });
}

export function ConvertInboxMessageFormatToJson(input: string) {

    // 这是一个非标准化的JSON格式, 源头是Inbox返回的结果, 需要做一下额外的处理才能转换为JSON对像
    // This is a non-standardized JSON format. The source is the result returned by Inbox. Additional processing is required to convert it into a JSON object.

    // 去除最外层的一对{},并且替换为[] Remove the outermost pair of {} and replace it with []
    let adjustedData = "["+ input.replace(/\s+/g, ' ').trim().slice(1, -1) + "]";

    // 将键值对中的键加上双引号 Enclose the key in the key-value pair in double quotes
    adjustedData = adjustedData.replace(/(\w[\w-]*)\s*=\s*/g, '"$1": ')

    // 将外层的大括号转换为标准 JSON 格式 Convert outer braces to standard JSON format
    adjustedData = adjustedData.replace(/:\s*\{\s*\{/g, ': [ {')
                               .replace(/\}\s*\},/g, '} ],')
                               .replace(/\}\s*\}/g, '} ]');


    try {
        const InboxMsgList = JSON.parse(adjustedData);

        const InboxMsgListNew = InboxMsgList.map((Item: any, Index: number)=>{

            return {...Item, id: Index}
        })

        console.log("ConvertInboxMessageFormatToJson SaveInboxMsgIntoIndexedDb", InboxMsgListNew.reverse())

        return InboxMsgListNew
    }
    catch(Error: any) {
        console.log("ConvertInboxMessageFormatToJson Error", Error)
        
        return 
    }
}

export const SaveInboxMsgIntoIndexedDb = (processTxId: string, InboxMsgList: any[]) => {

    let db: any = null;
    const request = OpenDb(processTxId);

    request.onsuccess = function(event: any) {
        db = event.target.result;
        if (db) {
            if (db.objectStoreNames.contains('InboxMsg')) {
                const transaction = db.transaction(['InboxMsg'], 'readwrite');
                const objectStore = transaction.objectStore('InboxMsg');

                InboxMsgList && InboxMsgList.map((ItemMsg: any)=>{
                    let Type = ItemMsg?.Tags?.Type
                    if(ItemMsg.Sender) {
                        Type = "Chat"
                    }
                    objectStore.add({
                        BlockHeight: ItemMsg['Block-Height'], 
                        From: ItemMsg.From,
                        Target: ItemMsg.Target,
                        HashId: ItemMsg.Id,
                        Timestamp: ItemMsg.Timestamp,
                        Data: ItemMsg.Data,
                        Type: Type,
                        Ref_: ItemMsg?.Tags?.Ref_,
                        Sender: ItemMsg.Sender,
                        Module: ItemMsg.Module,
                        Owner: ItemMsg.Owner,
                        Cron: ItemMsg.Cron,
                        ContentType: ItemMsg['Content-Type'], 
                        HashChain: ItemMsg['Hash-Chain'], 
                        ForwardedBy: ItemMsg['Forwarded-By']
                    });

                })
                transaction.oncomplete = function() {
                    db.close();
                };
            }
        }
    };
    request.onupgradeneeded = function(event: any) {
        db = event.target.result;
        if(db) {
            CreateDbTables(db)
        }
    };

}

export const GetInboxMsgFromIndexedDb = (processTxId: string, pageNumber: number, pageSize: number) => {

    return new Promise((resolve, reject) => {
        const request = OpenDb(processTxId, reject);

        request.onsuccess = function(event: any) {
            const db = event.target.result;
            
            // 在成功打开数据库后，创建一个只读事务并获取存储对象
            if (db.objectStoreNames.contains('InboxMsg')) {
                const transaction = db.transaction(['InboxMsg'], 'readonly');
                const objectStore = transaction.objectStore('InboxMsg');
                
                const getAllRequest = objectStore.getAll();

                getAllRequest.onsuccess = function(event: any) {
                    const allRecords = event.target.result;
                    const allRecordsReverse = [...allRecords]
                    const Result = allRecordsReverse.reverse().slice(pageNumber * pageSize, (pageNumber+1) * pageSize)
                    
                    //console.log("GetInboxMsgFromIndexedDb Result", Result)
                    resolve({data: Result, total: allRecords.length});
                };

                getAllRequest.onerror = function(event: any) {
                    reject('GetInboxMsgFromIndexedDb Error in getting all records');
                };
            }
            
        };
    });

}

const OpenDb = (processTxId = "", reject: any = null) => {
    const request = indexedDB.open(processTxId && processTxId!="" ? processTxId : AoConnectIndexedDb, 3);
    request.onerror = function(event: any) {
        console.log('Database error: ' + event.target.errorCode);
        if( reject ) {
            reject('Database error');
        }
    };  
    
    return request
}

const CreateDbTables = (db: any) => {

    if (!db.objectStoreNames.contains('InboxMsg')) {
        const objectStore = db.createObjectStore('InboxMsg', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('BlockHeight', 'BlockHeight', { unique: false });
        objectStore.createIndex('Sender', 'Sender', { unique: false });
        objectStore.createIndex('From', 'From', { unique: false });
        objectStore.createIndex('Target', 'Target', { unique: false });
        objectStore.createIndex('HashId', 'HashId', { unique: true });
        objectStore.createIndex('Timestamp', 'Timestamp', { unique: false });
        objectStore.createIndex('Data', 'Data', { unique: false });
        objectStore.createIndex('Ref_', 'Ref_', { unique: false });
        objectStore.createIndex('Module', 'Module', { unique: false });
        objectStore.createIndex('Owner', 'Owner', { unique: false });
        objectStore.createIndex('Cron', 'Cron', { unique: false });
        objectStore.createIndex('ContentType', 'ContentType', { unique: false });
        objectStore.createIndex('HashChain', 'HashChain', { unique: false });
        objectStore.createIndex('ForwardedBy', 'ForwardedBy', { unique: false });
        objectStore.createIndex('Type', 'Type', { unique: false });
    }

    if (!db.objectStoreNames.contains('ReminderMsg')) {
        const objectStore2 = db.createObjectStore('ReminderMsg', { keyPath: 'id', autoIncrement: true });
        objectStore2.createIndex('Target', 'Target', { unique: false });
        objectStore2.createIndex('Action', 'Action', { unique: false });
        objectStore2.createIndex('Type', 'Type', { unique: false });
        objectStore2.createIndex('From', 'From', { unique: false });
        objectStore2.createIndex('Data', 'Data', { unique: false });
        objectStore2.createIndex('Ref_', 'Ref_', { unique: false });
        objectStore2.createIndex('Logo', 'Logo', { unique: false });
        objectStore2.createIndex('Sender', 'Sender', { unique: false });
    }

}

export const GetAppAvatar = (logo: string) => {
    if(logo && logo.length == 43) {

        return "https://arweave.org/" + logo
    }
    else {

        return "/images/chatroom/2.png"
    }

}
