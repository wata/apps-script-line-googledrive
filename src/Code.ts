const props = PropertiesService.getScriptProperties()
const accessToken = props.getProperty('LINE_NOTIFY_ACCESS_TOKEN')!
const webAppURL = props.getProperty('WEB_APP_URL')!
const channel = {
    id: Utilities.getUuid(),
    type: 'web_hook',
    token: '',
    expiration: `${new Date(Date.now() + 60 * 60 * 24 * 7 * 1000).getTime()}`,
    address: webAppURL
}

const doPost = (e: GoogleAppsScript.Events.DoPost) => {
    if (!e.postData || !e.postData.contents) return
    const lock = LockService.getScriptLock()
    if (!lock.tryLock(10000)) return
    try {
        const pageToken = props.getProperty('PAGE_TOKEN')
        const res = Drive.Changes?.list({ pageToken })
        if (!res || !res.items || !res.newStartPageToken) return
        res.items.forEach((item) => {
            if (!item.file || !item.file.title || !item.file.id || item.file.mimeType !== 'image/jpeg') return
            const file = DriveApp.getFileById(item.file.id)
            sendToLINE(item.file.title, file)
        })
        props.setProperty('PAGE_TOKEN', res.newStartPageToken)
    } catch (e) {
        console.error('doPost(e:) yielded an error: ' + e)
    } finally {
        lock.releaseLock()
    }
}

const startWatching = () => {
    const startPageToken = Drive.Changes?.getStartPageToken()
    props.setProperty('PAGE_TOKEN', JSON.parse(startPageToken as string).startPageToken)
    const res = Drive.Changes?.watch(channel)
    console.log(JSON.stringify(res, null, ' '))
    try {
        stopWatching()
    } catch (e) {
        console.error('stopWatching() yielded an error: ' + e)
    }
    props.setProperty('CHANNEL_ID', channel.id)
    props.setProperty('RESOURCE_ID', res?.resourceId || '')
}

const stopWatching = () => {
    const id = props.getProperty('CHANNEL_ID')
    const resourceId = props.getProperty('RESOURCE_ID')
    if (!id || !resourceId) return
    const res = Drive.Channels?.stop({ id, resourceId })
    console.log(JSON.stringify(res, null, ' '))
}

const sendToLINE = (filename: string, imageFile: GoogleAppsScript.Drive.File) => {
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
        method: 'post',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        payload: {
            message: filename,
            imageFile: imageFile.getAs('image/jpeg'),
        }
    })
}
