# 在開發階段提供 Angular 應用程式

你可以用 `ng serve` 指令來啟動開發伺服器提供你的 Angular CLI 應用程式。
它會編譯你的應用程式、略過不必要的最佳化、啟動開發伺服器，並在後續變更時自動重新建置與即時重新載入。
按下 `Ctrl+C` 即可停止伺服器。

`ng serve` 只會執行 `angular.json` 中所指定預設專案的 `serve` 目標所對應的建置器。
雖然這裡可以使用任何建置器，最常見（也是預設）的是 `@angular-devkit/build-angular:dev-server`。

你可以查看特定專案的 `serve` 目標，來判斷該專案使用的是哪個建置器。

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invokes the Architect target named `serve`.
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          // ...
        },
        "build": { /* ... */ }
        "test": { /* ... */ }
      }
    }
  }
}

</docs-code>

本頁討論 `@angular-devkit/build-angular:dev-server` 的用法與選項。

## 代理到後端伺服器

使用[代理支援](https://webpack.js.org/configuration/dev-server/#devserverproxy)，把 `--proxy-config` 建置選項傳入一個檔案，就能將特定的 URL 導向後端伺服器。
舉例來說，若要把所有對 `http://localhost:4200/api` 的呼叫導向在 `http://localhost:3000/api` 上執行的伺服器，請依下列步驟操作。

1. 在專案的 `src/` 資料夾中建立一個 `proxy.conf.json` 檔案。
1. 把下列內容加入新的 proxy 檔案：

    <docs-code language="json">

    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }

    </docs-code>

1. 在 CLI 設定檔 `angular.json` 中，把 `proxyConfig` 選項加入 `serve` 目標：

    <docs-code language="json">

    {
      "projects": {
        "my-app": {
          "architect": {
            "serve": {
              "builder": "@angular-devkit/build-angular:dev-server",
              "options": {
                "proxyConfig": "src/proxy.conf.json"
              }
            }
          }
        }
      }
    }

    </docs-code>

1. 若要用這份 proxy 設定執行開發伺服器，請呼叫 `ng serve`。

編輯 proxy 設定檔以加入設定選項；以下是一些範例。
所有選項的說明，請參閱 [webpack DevServer 文件](https://webpack.js.org/configuration/dev-server/#devserverproxy)。

NOTE: 若你編輯 proxy 設定檔，必須重新啟動 `ng serve` 行程，變更才會生效。

## `localhost` 解析 {#localhost-resolution}

自 Node 17 版起，Node _並不_總是會將 `http://localhost:<port>` 解析為 `http://127.0.0.1:<port>`，實際結果取決於每台機器的設定。

若你在使用目標為 `localhost` URL 的代理時收到 `ECONNREFUSED` 錯誤，可以將目標從 `http://localhost:<port>` 更新為 `http://127.0.0.1:<port>`，來修正這個問題。

更多資訊請見 [`http-proxy-middleware` 文件](https://github.com/chimurai/http-proxy-middleware#nodejs-17-econnrefused-issue-with-ipv6-and-localhost-705)。
