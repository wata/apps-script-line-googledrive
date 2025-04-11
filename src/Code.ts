const props = PropertiesService.getScriptProperties()
const lineChannelAccessToken = props.getProperty('LINE_CHANNEL_ACCESS_TOKEN')!
const lineGroupID = props.getProperty('LINE_GROUP_ID')!
const webAppURL = props.getProperty('WEB_APP_URL')!
const channel = {
    id: Utilities.getUuid(),
    type: 'web_hook',
    token: '',
    expiration: `${new Date(Date.now() + 60 * 60 * 24 * 7 * 1000).getTime()}`,
    address: webAppURL
}

declare let global: any
global.doPost = (e: GoogleAppsScript.Events.DoPost) => {
    if (!e.postData || !e.postData.contents) return
    const lock = LockService.getScriptLock()
    if (!lock.tryLock(10000)) return
    try {
        const pageToken = props.getProperty('PAGE_TOKEN')!
        const res = Drive.Changes?.list(pageToken)
        if (!res || !res.changes || !res.newStartPageToken) return
        res.changes.forEach((change) => {
            if (!change.file || !change.file.name || !change.file.id || change.file.mimeType !== 'image/jpeg') return
            //const file = DriveApp.getFileById(change.file.id)
            global.sendToLINE(change.file.name, `https://drive.google.com/uc?id=${change.file.id}`, `https://drive.google.com/uc?id=${change.file.id}`)
        })
        props.setProperty('PAGE_TOKEN', res.newStartPageToken)
    } catch (e) {
        console.error('doPost(e:) yielded an error: ' + e)
    } finally {
        lock.releaseLock()
    }
}

global.startWatching = () => {
    const startPageToken = Drive.Changes?.getStartPageToken()
    const pageToken = JSON.parse(startPageToken as string).startPageToken
    props.setProperty('PAGE_TOKEN', pageToken)
    const res = Drive.Changes?.watch(channel, pageToken)
    console.log(JSON.stringify(res, null, ' '))
    try {
        global.stopWatching()
    } catch (e) {
        console.error('stopWatching() yielded an error: ' + e)
    }
    props.setProperty('CHANNEL_ID', channel.id)
    props.setProperty('RESOURCE_ID', res?.resourceId || '')
}

global.stopWatching = () => {
    const id = props.getProperty('CHANNEL_ID')
    const resourceId = props.getProperty('RESOURCE_ID')
    if (!id || !resourceId) return
    const res = Drive.Channels?.stop({ id, resourceId })
    console.log(JSON.stringify(res, null, ' '))
}

global.sendToLINE = (filename: string, imageURL: string, thumbnailImageURL: string) => {
    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${lineChannelAccessToken}`,
        },
        payload: {
            to: lineGroupID,
            messages: [
                {
                    'type': 'text',
                    'text': filename,
                },
                {
                    'type': 'image',
                    'originalContentUrl': imageURL,
                    'previewImageUrl': thumbnailImageURL
                }
            ],
        }
    })
}
