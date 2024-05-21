

export const getMessageData = (messages: any[]) => {
    let target = messages[0].Target;
    let data = messages[0].Data;
    let tags = Object.assign({}, ...messages[0]['Tags'].map((x: any) => ({[x.name]: x.value})));
    return { target, data, tags };
}

export const getMessagesData = (messages: any[]) => {
    let target_array = []
    let data_array = []
    let tags_array = []
    for (let i = 0; i < messages.length; i++) {
        let target = messages[i].Target;
        let data = messages[i].Data;
        let tags = Object.assign({}, ...messages[i]['Tags'].map((x) => ({[x.name]: x.value})));
        target_array.push(target)
        data_array.push(data)
        tags_array.push(tags)
    }
    return { target_array, data_array, tags_array };
}

export const getOutputData = (output: any) => {
    let data = ''
    if (typeof(output["data"]) == 'string') {
        data = output["data"]
    } else {
        data = output["data"]["output"]
    }
    return { data }
}

export const getNoticeAction = (message: string) => {
    return message.split('Action = \x1B[34m')[1].split('\x1B[0m')[0]
}

export const parseNoticeData = (x: any) => {
    if (x.node.Messages.length > 0) {
        return getMessagesData(x.node.Messages)
    } else {
        return getOutputData(x.node.Output)
    } 
}

export const getNoticeData = (results: any) => {
    let res = results["edges"]
        .map((x: any) => parseNoticeData(x))   
    return res
}
  
export const getErrorMessage = (error: string) => {
    return error.split(":")[4].trim()
}

export const parseAmount = (amount: number, denomination: number, isNegative=false) => {
    const amountNew = (amount * Math.pow(10, denomination)).toString();
    return isNegative ? '-' + amountNew : amountNew;
}

export const parseBalances = (data: any) => {
    return JSON.parse(data)
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
