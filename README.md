# apps-script-line-googledrive

スクリプトエディター、"Project Settings > Script Properties"に次の値を設定

Property | Value
---- | ----
`LINE_NOTIFY_ACCESS_TOKEN` | LINE Notifyのアクセストークン
`WEB_APP_URL` | デプロイ後、"Deploy > Manage deployments > Web app"から取得できるURL

永続化するために"Triggers > Add Trigger"にて `startWatching` を定期実行するように設定

<img width="1122" alt="Screenshot 2023-11-01 at 22 42 12" src="https://github.com/wata/apps-script-line-googledrive/assets/519695/fbaad2b2-baaa-4198-bf3d-8284c94212ed">
