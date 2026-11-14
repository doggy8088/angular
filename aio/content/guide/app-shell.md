# 應用程式殼層

應用程式殼層是一種在建置時使用路由來渲染應用程式一部分的方法。
它能快速啟動靜態渲染頁面（所有頁面共通的骨架），同時瀏覽器下載完整用戶端版本，並在程式碼載入後自動切換，藉此改善使用者體驗。

這讓使用者能快速看到應用程式有意義的首次繪製，因為瀏覽器只需直接渲染 HTML 與 CSS，不需要初始化任何 JavaScript。

進一步了解請參閱 [The App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell)。

## 步驟 1：準備應用程式

你可以使用下列 CLI 指令來執行此操作：
<code-example format="." language="bash" linenums="false">
ng new my-app --routing
</code-example>

對於既有應用程式，你必須在應用程式中手動加入 `RouterModule` 並定義 `<router-outlet>`。

## 步驟 2：建立應用程式殼層

使用 CLI 自動建立應用程式殼層。

<code-example format="." language="bash" linenums="false">
ng generate app-shell --client-project my-app --universal-project server-app
</code-example>

* `my-app` 會使用你的用戶端應用程式名稱。
* `server-app` 會使用 Universal（或伺服器）應用程式的名稱。

執行此指令後，你會注意到 `angular.json` 設定檔已更新，新增了兩個新的目標，以及一些其他變更。

<code-example format="." language="none" linenums="false">
"server": {
  "builder": "@angular-devkit/build-angular:server",
  "options": {
    "outputPath": "dist/my-app-server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  }
},
"app-shell": {
  "builder": "@angular-devkit/build-angular:app-shell",
  "options": {
    "browserTarget": "my-app:build",
    "serverTarget": "my-app:server",
    "route": "shell"
  }
}
</code-example>

## 步驟 3：驗證應用程式已使用殼層內容建置

使用 CLI 建置 `app-shell` 目標。

<code-example format="." language="bash" linenums="false">
ng run my-app:app-shell
</code-example>

若要驗證建置輸出，請開啟 `dist/my-app/index.html`。尋找預設文字 `app-shell works!`，確認應用程式殼層路由已渲染並包含在輸出中。
