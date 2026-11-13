# 應用程式殼層

應用程式殼層是一種在建置時使用路由來渲染應用程式一部分的方法。
它能快速啟動靜態渲染頁面（所有頁面共通的骨架），同時瀏覽器下載完整用戶端版本，並在程式碼載入後自動切換，藉此改善使用者體驗。

這讓使用者能快速看到應用程式有意義的首次繪製，因為瀏覽器不需要初始化任何 JavaScript，就能渲染 HTML 與 CSS。

進一步了解請參閱 [The App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell)。

## 步驟 1：準備應用程式

你可以使用下列 CLI 指令來執行此操作：
<code-example language="bash">
ng new my-app --routing
</code-example>

對於既有應用程式，你必須在應用程式中手動加入 `RouterModule` 並定義 `<router-outlet>`。

## 步驟 2：建立應用程式殼層

使用 CLI 自動建立應用程式殼層。

<code-example language="bash">
ng generate app-shell
</code-example>

* `client-project` 會使用你的用戶端應用程式名稱。

執行此指令後，你會注意到 `angular.json` 設定檔已更新，新增了兩個新的目標，以及一些其他變更。

<code-example language="json">
"server": {
  "builder": "@angular-devkit/build-angular:server",
  "options": {
    "outputPath": "dist/my-app/server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  },
  "configurations": {
    "production": {
      "outputHashing": "media",
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      "sourceMap": false,
      "optimization": true
    }
  }
},
"app-shell": {
  "builder": "@angular-devkit/build-angular:app-shell",
  "options": {
    "browserTarget": "my-app:build",
    "serverTarget": "my-app:server",
    "route": "shell"
  },
  "configurations": {
    "production": {
      "browserTarget": "my-app:build:production",
      "serverTarget": "my-app:server:production"
    }
  }
}
</code-example>

## 步驟 3：驗證應用程式已使用殼層內容建置

使用 CLI 建置 `app-shell` 目標。

<code-example language="bash">
ng run my-app:app-shell
</code-example>

或是使用生產環境設定。

<code-example language="bash">
ng run my-app:app-shell:production
</code-example>

若要驗證建置輸出，請開啟 `dist/my-app/browser/index.html`。尋找預設文字 `app-shell works!`，確認應用程式殼層路由已渲染並包含在輸出中。
