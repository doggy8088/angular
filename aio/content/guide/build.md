# 建置與提供 Angular 應用程式

本頁討論 Angular 專案專屬的建置設定選項。

{@a app-environments}

## 設定應用程式環境

你可以為專案定義不同的具名建置設定，例如 *stage* 與 *production*，各自帶有不同的預設值。

每個具名設定都可以為適用於各種[建置器目標](guide/glossary#目標（target）)的任一選項提供預設值，例如 `build`、`serve` 與 `test`。[Angular CLI](cli) 的 `build`、`serve` 與 `test` 指令就能針對你預定的目標環境，將檔案換成適當的版本。

### 設定環境專屬的預設值

專案的 `src/environments/` 資料夾包含基礎設定檔 `environment.ts`，它提供預設環境。
你可以在目標專屬的設定檔中，為其他環境（例如 production 與 staging）加入覆寫的預設值。

例如：

```
└──myProject/src/environments/
                   └──environment.ts
                   └──environment.prod.ts
                   └──environment.stage.ts
```

基礎檔案 `environment.ts` 包含預設的環境設定。例如：

```
export const environment = {
  production: false
};
```

未指定環境時，`build` 指令會將它作為建置目標。
你可以加入更多變數，方式是為環境物件新增屬性，或是另外建立物件。
例如，下例為預設環境的某個變數加入了預設值：

```
export const environment = {
  production: false,
  apiUrl: 'http://my-api-url'
};
```

你可以新增目標專屬的設定檔，例如 `environment.prod.ts`。
以下內容為 production 建置目標設定預設值：

```
export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};
```

### 在應用程式中使用環境專屬變數

下列應用程式結構會為 production 與 staging 環境設定建置目標：

```
└── src
    └── app
        ├── app.component.html
        └── app.component.ts
    └── environments
        ├── environment.prod.ts
        ├── environment.staging.ts
        └── environment.ts
```

要使用你定義的環境設定，你的元件必須匯入原始的環境檔案：

```
import { environment } from './../environments/environment';
```

這樣能確保 build 與 serve 指令找得到特定建置目標的設定。

元件檔案（`app.component.ts`）中的下列程式碼使用了一個在設定檔中定義的環境變數。

```
import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    console.log(environment.production); // Logs false for default environment
  }
  title = 'app works!';
}
```
{@a file-replacement}

## 設定目標專屬的檔案置換

主要的 CLI 設定檔 `angular.json` 中，每個建置目標的設定裡都有一段 `fileReplacements`，讓你可以把任何檔案換成該檔案的目標專屬版本。
這在你想為特定環境（例如 production 或 staging）的建置加入目標專屬的程式碼或變數時非常有用。

預設不會置換任何檔案。
你可以為特定的建置目標加入檔案置換。
例如：

```
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    ...
```

這表示當你建置 production 設定時（使用 `ng build --prod` 或 `ng build --configuration=production`），`src/environments/environment.ts` 檔案會被換成該檔案的目標專屬版本 `src/environments/environment.prod.ts`。

你可以視需要加入額外的設定。要加入 staging 環境，請複製 `src/environments/environment.ts`，命名為 `src/environments/environment.staging.ts`，再把 `staging` 設定加入 `angular.json`：

```
"configurations": {
  "production": { ... },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}
```

你也可以為這個目標環境加入更多設定選項。
建置支援的任何選項，都可以在建置目標設定中覆寫。

若要使用 staging 設定進行建置，執行下列指令：

<code-example language="sh" class="code-shell">
 ng build --configuration=staging
</code-example>

如果你把它加入 `angular.json` 的 "serve:configurations" 區段，也可以設定 `serve` 指令使用目標建置設定：

```
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "your-project-name:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "your-project-name:build:production"
    },
    "staging": {
      "browserTarget": "your-project-name:build:staging"
    }
  }
},
```

{@a size-budgets}
{@a configure-size-budgets}

## 設定大小預算

應用程式的功能越長越大，體積也隨之增長。
CLI 讓你能在設定中訂定大小門檻，確保應用程式的各個部分維持在你定義的大小界限之內。

在 CLI 設定檔 `angular.json` 中，為每個[已設定的環境](#app-environments)加入一段 `budgets` 來定義大小界限。

```
{
  ...
  "configurations": {
    "production": {
      ...
      budgets: []
    }
  }
}
```

你可以為整個應用程式設定大小預算，也可以針對特定部分設定。
每個預算項目會設定一種指定類型的預算。
大小值可使用下列格式指定：

* 123 or 123b：大小，單位為位元組

* 123kb：大小，單位為 KB

* 123mb：大小，單位為 MB

* 12%：相對於基準的大小百分比。（不適用於基準值本身。）

設定預算後，當應用程式的某個部分達到或超過你設定的界限大小時，建置系統會發出警告或回報錯誤。

每個預算項目都是一個 JSON 物件，具有下列屬性：

<table>
  <tr>
    <th>屬性</th>
    <th>值</th>
  </tr>

  <tr>
    <td>type</td>
    <td>

    預算的類型。以下擇一：

* `bundle` - 特定 bundle 的大小。
* `initial` - 應用程式的初始大小。
* `allScript` - 所有指令碼的大小。
* `all` - 整個應用程式的大小。
* `anyComponentStyle` - 任一元件樣式表的大小。
* `anyScript` - 任一指令碼的大小。
* `any` - 任一檔案的大小。

    </td>
  </tr>
   <tr>
    <td>name</td>
    <td>

    bundle 的名稱（適用於 `type=bundle`）。

    </td>
  </tr>
  <tr>
    <td>baseline</td>
    <td>用來比較的基準大小。</td>
  </tr>
  <tr>
    <td>maximumWarning</td>
    <td>相對於基準的警告上限門檻。</td>
  </tr>
  <tr>
    <td>maximumError</td>
    <td>相對於基準的錯誤上限門檻。</td>
  </tr>
  <tr>
    <td>minimumWarning</td>
    <td>相對於基準的警告下限門檻。</td>
  </tr>
  <tr>
    <td>minimumError</td>
    <td>相對於基準的錯誤下限門檻。</td>
  </tr>
  <tr>
    <td>warning</td>
    <td>相對於基準的警告門檻（下限與上限）。</td>
  </tr>
  <tr>
    <td>error</td>
    <td>相對於基準的錯誤門檻（下限與上限）。</td>
  </tr>

 </table>

{@a browser-compat}

## 設定瀏覽器相容性

CLI 使用 [Autoprefixer](https://github.com/postcss/autoprefixer) 來確保與不同瀏覽器及瀏覽器版本的相容性。
你可能會覺得有必要指定特定瀏覽器，或從建置中排除某些瀏覽器版本。

Autoprefixer 內部依賴名為 [Browserslist](https://github.com/browserslist/browserslist) 的程式庫，來判斷要為哪些瀏覽器支援前綴處理。
Browserslist 會在套件設定檔的 `browserslist` 屬性中，或在名為 `.browserslistrc` 的設定檔中尋找設定選項。
Autoprefixer 在為你的 CSS 加上前綴時，會查詢 `browserslist` 設定。

* 將 browserslist 屬性加入套件設定檔 `package.json`，告訴 Autoprefixer 要以哪些瀏覽器為目標：
```
 "browserslist": [
   "> 1%",
   "last 2 versions"
 ]
```

* 或者，你可以在專案目錄中新增一個 `.browserslistrc` 檔案，指定你想要支援的瀏覽器：
```
 ### Supported Browsers
 > 1%
 last 2 versions
```

關於如何指定特定瀏覽器與版本，請參閱 [browserslist 儲存庫](https://github.com/browserslist/browserslist) 中的更多範例。

### 與 Lighthouse 的向後相容性

如果你想產生漸進式 Web 應用程式，並使用 [Lighthouse](https://developers.google.com/web/tools/lighthouse/) 為專案評分，請把下列 `browserslist` 項目加入你的 `package.json` 檔案，以消除 [old flexbox](https://developers.google.com/web/tools/lighthouse/audits/old-flexbox) 前綴：

```
"browserslist": [
  "last 2 versions",
  "not ie <= 10",
  "not ie_mob <= 10"
]
```

### 與 CSS grid 的向後相容性

Autoprefixer 中的 CSS grid 版面支援，先前預設開啟，在 Angular 8 及更高版本中預設關閉。

若要在 IE10/11 中使用 CSS grid，你必須使用 `autoplace` 選項明確啟用它。
為此，請把下列內容加入全域樣式檔的頂端（或在特定的 css 選擇器範圍內）：

```
/* autoprefixer grid: autoplace /
```
或
```
/ autoprefixer grid: no-autoplace */
```

更多資訊請參閱 [Autoprefixer 文件](https://autoprefixer.github.io/)。

{@a proxy}

## 代理到後端伺服器

使用 `webpack` 開發伺服器中的 [proxying 支援](https://webpack.js.org/configuration/dev-server/#devserver-proxy)，把特定 URL 轉送到後端伺服器，做法是把檔案傳給 `--proxy-config` 建置選項。
例如，要把所有對 `http://localhost:4200/api` 的呼叫轉送到執行於 `http://localhost:3000/api` 的伺服器，請依下列步驟操作。

1. 在專案的 `src/` 資料夾中建立一個 `proxy.conf.json` 檔案。

1. 把下列內容加入新的 proxy 檔案：
    ```
    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }
    ```

1. 在 CLI 設定檔 `angular.json` 中，把 `proxyConfig` 選項加入 `serve` 目標：
    ```
    ...
    "architect": {
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "options": {
          "browserTarget": "your-application-name:build",
          "proxyConfig": "src/proxy.conf.json"
        },
    ...
    ```

1. 若要用這份 proxy 設定執行開發伺服器，請呼叫 `ng serve`。

編輯 proxy 設定檔以加入設定選項；以下是一些範例。
所有選項的說明，請參閱 [webpack DevServer 文件](https://webpack.js.org/configuration/dev-server/#devserver-proxy)。

請注意，如果你編輯了 proxy 設定檔，必須重新啟動 `ng serve` 程序，變更才會生效。

### 重寫 URL 路徑

`pathRewrite` proxy 設定選項可讓你在執行時期重寫 URL 路徑。
例如，請為 proxy 設定指定下列 `pathRewrite` 值，從路徑結尾移除 "api"。

```
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

如果你需要存取不在 `localhost` 上的後端，請一併設定 `changeOrigin` 選項。例如：

```
{
  "/api": {
    "target": "http://npmjs.org",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "changeOrigin": true
  }
}
```

要協助判斷 proxy 是否如預期運作，請設定 `logLevel` 選項。例如：

```
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "logLevel": "debug"
  }
}
```

Proxy 的日誌層級有 `info`（預設值）、`debug`、`warn`、`error` 與 `silent`。

### Proxy 多個項目

你可以透過用 JavaScript 定義設定，把多個項目 proxy 到同一個目標。

把 proxy 設定檔設為 `proxy.conf.js`（而非 `proxy.conf.json`），並如下列範例指定設定檔。

```
const PROXY_CONFIG = [
    {
        context: [
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target: "http://localhost:3000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
```

在 CLI 設定檔 `angular.json` 中，指向 JavaScript proxy 設定檔：

```
...
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.js"
    },
...
```

### 略過 proxy

如果你需要選擇性地略過 proxy，或在請求送出前動態變更請求，請加入 bypass 選項，如這個 JavaScript 範例所示。

```
const PROXY_CONFIG = {
    "/api/proxy": {
        "target": "http://localhost:3000",
        "secure": false,
        "bypass": function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf("html") !== -1) {
                console.log("Skipping proxy for browser request.");
                return "/index.html";
            }
            req.headers["X-Custom-Header"] = "yes";
        }
    }
}

module.exports = PROXY_CONFIG;
```

### 使用公司 proxy

如果你在公司 proxy 後面工作，後端無法直接把呼叫 proxy 到你本機網路以外的任何 URL。
在這種情況下，你可以設定後端 proxy，讓它使用 agent 把呼叫經由你的公司 proxy 重新導向：

<code-example language="none" class="code-shell">
npm install --save-dev https-proxy-agent
</code-example>

當你定義環境變數 `http_proxy` 或 `HTTP_PROXY` 時，執行 `npm start` 時會自動加入 agent，讓呼叫通過你的公司 proxy。

在 JavaScript 設定檔中使用下列內容。

```
var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: '/api',
  target: 'http://your-remote-server.com:3000',
  secure: false
}];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
```
