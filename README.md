# apps-script-line-googledrive

Googleドライブの変更通知をGoogle Apps Scriptで受け取り、LINE Notify経由でLINEに画像ファイルを送る

## セットアップ

1. デプロイ

    ```sh
    git clone https://github.com/wata/apps-script-line-googledrive.git
    cd apps-script-line-googledrive
    npm install

    # webapp のスクリプトを作成し、デプロイ
    clasp create --type webapp
    clasp push
    clasp deploy
    ```

1. スクリプトプロパティを設定

    スクリプトエディター、"Project Settings > Script Properties"に次の値を設定
    Property | Value
    ---- | ----
    `LINE_NOTIFY_ACCESS_TOKEN` | LINE Notifyのアクセストークン
    `WEB_APP_URL` | デプロイ後、"Deploy > Manage deployments > Web app"から取得できるURL<br>（デプロイする度にDeployment IDが変わる＝URLが変わるので注意）

1. 時間駆動型トリガーを設定

    永続化するために"Triggers > Add Trigger"にて `startWatching` を定期実行するように設定

    <img width="1122" alt="Screenshot 2023-11-01 at 22 42 12" src="https://github.com/wata/apps-script-line-googledrive/assets/519695/fbaad2b2-baaa-4198-bf3d-8284c94212ed">

## 使い方

- ScanSnapで読み取り > Googleドライブに保存 > LINEに通知

    ScanSnapで、ファイル形式「JPEG」、保存先サービス「Googleドライブ」に設定しておく

    ![IMG_B492A1F70261-1 Medium](https://github.com/wata/apps-script-line-googledrive/assets/519695/91db089d-6610-468a-a0d3-cb32475f3efd)
