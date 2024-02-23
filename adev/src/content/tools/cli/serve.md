# 為開發服務 Angular 應用程式

您可以使用 `ng serve` 指令來服務您的 Angular CLI 應用程式。
這會編譯您的應用程式，略過不必要的最佳化，啟動一個開發伺服器，並自動重新建置和即時重新載入任何後續變更。
您可以按 `Ctrl+C` 來停止伺服器。

`ng serve` 只執行 `angular.json` 中所指定的預設專案的 `serve` 目標的建構器。
雖然任何建構器都可以在這裡使用，但最常見（也是預設）的建構器是 `@angular-devkit/build-angular:dev-server`。

您可以透過檢視該專案的 `serve` 目標來判斷哪個建構工具正在為特定專案使用。

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

此頁面討論 `@angular-devkit/build-angular:dev-server` 的用法和選項。

## 代理到後端伺服器

使用 [代理支持](https://webpack.js.org/configuration/dev-server/#devserverproxy) 將特定 URL 轉移至後端伺服器，方法是將檔案傳遞給 `--proxy-config` 建置選項。
例如，若要將所有對 `http://localhost:4200/api` 的呼叫轉移至執行於 `http://localhost:3000/api` 的伺服器，請執行下列步驟。

1. 在專案的 `src/` 資料夾中建立 `proxy.conf.json` 檔案。
1. 將下列內容新增至新的代理檔案：

    <docs-code language="json">

    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }

    </docs-code>

1. 在 CLI 組態檔案 `angular.json` 中，將 `proxyConfig` 選項新增至 `serve` 目標：

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

1. 要使用這個代理組態執行開發伺服器，請呼叫 `ng serve`。

編輯代理組態檔案來新增組態選項；以下是一些範例。
有關所有選項的說明，請參閱 [webpack DevServer 文件](https://webpack.js.org/configuration/dev-server/#devserverproxy)。

NOTE：如果您編輯代理設定檔，您必須重新啟動 `ng serve` 程序才能讓您的變更生效。

## `localhost` 解析度

自 Node 版本 17 起，Node 將 _不_ 總是將 `http://localhost:<port>` 解析為 `http://127.0.0.1:<port>`，具體取決於每台電腦的配置。

如果您使用代理程式鎖定 `localhost` URL 時收到 `ECONNREFUSED` 錯誤，您可以透過將目標從 `http://localhost:<port>` 更新為 `http://127.0.0.1:<port>` 來修正此問題。

請參閱 [http-proxy-middleware 文件](https://github.com/chimurai/http-proxy-middleware#nodejs-17-econnrefused-issue-with-ipv6-and-localhost-705) 以獲取更多資訊。

