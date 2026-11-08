# 在開發階段提供 Angular 應用程式

你可以用 `ng serve` 指令來啟動開發伺服器提供你的 Angular CLI 應用程式。
它會編譯你的應用程式、略過不必要的最佳化、啟動開發伺服器，並在後續變更時自動重新建置與即時重新載入。
按下 `Ctrl+C` 即可停止伺服器。

`ng serve` 只會執行 `angular.json` 中所指定預設專案的 `serve` 目標所對應的建置器。雖然這裡可以使用任何建置器，最常見（也是預設）的是 `@angular/build:dev-server`。

你可以查看特定專案的 `serve` 目標，來判斷該專案使用的是哪個建置器。

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invokes the Architect target named `serve`.
        "serve": {
          "builder": "@angular/build:dev-server"
          // ...
        },
        "build": {/* ... */},
        "test": {/* ... */}
      }
    }
  }
}
```

## 代理到後端伺服器

使用[代理支援](https://vite.dev/config/server-options#server-proxy)，把 `--proxy-config` 建置選項傳入一個檔案，就能將特定的 URL 導向後端伺服器。
舉例來說，若要把所有對 `http://localhost:4200/api` 的呼叫導向在 `http://localhost:3000/api` 上執行的伺服器，請依下列步驟操作。

1. 在專案的 `src/` 資料夾中建立一個 `proxy.conf.json` 檔案。
1. 把下列內容加入新的 proxy 檔案：

```json
{
  "/api/**": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

1. 在 CLI 設定檔 `angular.json` 中，把 `proxyConfig` 選項加入 `serve` 目標：

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "proxyConfig": "src/proxy.conf.json"
          }
        }
      }
    }
  }
}
```

1. 若要用這份 proxy 設定執行開發伺服器，請呼叫 `ng serve`。

NOTE: 若要讓 proxy 設定檔的變更生效，你必須重新啟動 `ng serve` 行程。

### 路徑比對行為

- `/api` 會比對 `/api` 以及任何以它開頭的路徑，例如 `/api/users/123` 或 `/api-docs`。
- `/api/*` 會比對 `/api/users`，但不會比對 `/api` 或 `/api/users/123`。
- `/api/**` 會比對 `/api`、`/api/users` 與 `/api/users/123`，但不會比對 `/api-docs`。
