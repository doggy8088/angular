# App shell pattern

[App shell 模式](https://developers.google.com/web/fundamentals/architecture/app-shell) 是一種在建置時使用路由來呈現應用程式一部分的方式。
它可以透過快速啟動一個靜態呈現的頁面（所有頁面的共同架構）來改善使用者體驗，同時瀏覽器會下載完整的用戶端版本，並在程式碼載入後自動切換到該版本。

這為使用者提供快速出現的應用程式有意義的第一次繪製，因為瀏覽器可以在無需初始化任何 JavaScript 的情況下呈現 HTML 和 CSS。

<docs-workflow>
<docs-step title="準備應用程式">
使用以下 Angular CLI 指令執行此操作：

<docs-code language="shell">

ng new my-app --routing

</docs-code>

對於現有應用程式，您必須手動加入 `RouterModule` 並在您的應用程式內定義 `<router-outlet>`。
</docs-step>
<docs-step title="建立應用程式外殼">
使用 Angular CLI 自動建立應用程式外殼。

<docs-code language="shell">

ng generate app-shell

</docs-code>

有關此命令的更多資訊，請參閱 [應用程式殼層指令](cli/generate#app-shell-command)。

在執行此指令後，您可以看到 `angular.json` 組態檔案已更新，新增兩個新目標，並有其他一些變更。

<docs-code language="json">

"server": {
  "builder": "&commat;angular-devkit/build-angular:server",
  "defaultConfiguration": "production",
  "options": {
    "outputPath": "dist/my-app/server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  },
  "configurations": {
    "development": {
      "outputHashing": "none",
    },
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
  "builder": "&commat;angular-devkit/build-angular:app-shell",
  "defaultConfiguration": "production",
  "options": {
    "route": "shell"
  },
  "configurations": {
    "development": {
      "browserTarget": "my-app:build:development",
      "serverTarget": "my-app:server:development",
    },
    "production": {
      "browserTarget": "my-app:build:production",
      "serverTarget": "my-app:server:production"
    }
  }
}

</docs-code>
</docs-step>
<docs-step title="Verify the application is built with the shell content">
Use the Angular CLI to build the `app-shell` target.

<docs-code language="shell">

ng run my-app:app-shell:development

</docs-code>

或者使用生產設定。

<docs-code language="shell">

ng run my-app:app-shell:production

</docs-code>

要驗證建置輸出，請開啟 <code class="no-auto-link">dist/my-app/browser/index.html</code>。
尋找預設文字 `app-shell works!` 以顯示應用程式外殼路由已作為輸出的一部分進行渲染。
</docs-step>
</docs-workflow>

