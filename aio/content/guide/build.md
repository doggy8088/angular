# 建置與提供 Angular 應用程式

本頁討論 Angular 專案專屬的建置設定選項。

<a id="app-environments"></a>

## 設定應用程式環境

你可以為專案定義不同的具名建置設定，例如 `development` 與 `staging`，各自帶有不同的預設值。

每個具名設定都可以為適用於各種[建置器目標](guide/glossary#目標target)的任一選項提供預設值，例如 `build`、`serve` 與 `test`。 接著，[Angular CLI](cli) 的 `build`、`serve` 與 `test` 指令就能針對你預定的目標環境，將檔案換成適當的版本。

### 設定環境專屬的預設值

使用 Angular CLI 時，請先執行這裡所示的[產生環境指令](cli/generate#environments-command)，建立 `src/environments/` 目錄，並設定專案使用這些檔案。

<code-example format="shell" language="shell">

ng generate environments

</code-example>

專案的 `src/environments/` 目錄包含基礎設定檔 `environment.ts`，提供預設環境 `production` 的設定。你可以在目標專屬的設定檔中，覆寫其他環境（例如 `development` 與 `staging`）的預設值。

例如：

<div class="filetree">
    <div class="file">
        myProject/src/environments
    </div>
    <div class="children">
        <div class="file">
          environment.ts
        </div>
        <div class="file">
          environment.development.ts
        </div>
        <div class="file">
          environment.staging.ts
        </div>
    </div>
</div>

基礎檔案 `environment.ts` 包含預設的環境設定。 例如：

<code-example format="typescript" language="typescript">

export const environment = {
  production: true
};

</code-example>

未指定環境時，`build` 指令會將它作為建置目標。 你可以加入更多變數，方式是為環境物件新增屬性，或是另外建立物件。 例如，下例為預設環境的某個變數加入了預設值：

<code-example format="typescript" language="typescript">

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

</code-example>

你可以新增目標專屬的設定檔，例如 `environment.development.ts`。 以下內容為開發建置目標設定了預設值：

<code-example format="typescript" language="typescript">

export const environment = {
  production: false,
  apiUrl: 'http://my-api-url'
};

</code-example>

### 在應用程式中使用環境專屬變數

下列應用程式結構會為 `development` 與 `staging` 環境設定建置目標：

<div class="filetree">
    <div class="file">
        src
    </div>
    <div class="children">
        <div class="file">
          app
        </div>
        <div class="children">
            <div class="file">
              app.component.html
            </div>
            <div class="file">
              app.component.ts
            </div>
        </div>
        <div class="file">
          environments
        </div>
        <div class="children">
            <div class="file">
              environment.ts
            </div>
            <div class="file">
              environment.development.ts
            </div>
            <div class="file">
              environment.staging.ts
            </div>
        </div>
    </div>
</div>

要使用你定義的環境設定，你的元件必須匯入原始的環境檔案：

<code-example format="typescript" language="typescript">

import { environment } from './../environments/environment';

</code-example>

這樣能確保 build 與 serve 指令找得到特定建置目標的設定。

元件檔案（`app.component.ts`）中的下列程式碼使用了一個在設定檔中定義的環境變數。

<code-example format="typescript" language="typescript">

  import { Component } from '&commat;angular/core';
  import { environment } from './../environments/environment';

  &commat;Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent {
    constructor() {
      console.log(environment.production); // Logs false for development environment
    }

    title = 'app works!';
  }

</code-example>

<a id="file-replacement"></a>

## 設定目標專屬的檔案置換

主要的 CLI 設定檔 `angular.json` 中，每個建置目標的設定裡都有一段 `fileReplacements`，讓你可以把 TypeScript 程式中的任何檔案，換成該檔案的目標專屬版本。 這在你想為特定環境（例如正式環境或預備環境）的建置加入目標專屬的程式碼或變數時非常有用。

預設不會置換任何檔案。你可以為特定的建置目標加入檔案置換。例如：

<code-example format="json" language="json">

  "configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        &hellip;

</code-example>

這表示當你用 `ng build --configuration development` 建置開發設定時，`src/environments/environment.ts` 檔案會被換成該檔案的目標專屬版本 `src/environments/environment.development.ts`。

你可以視需要加入額外的設定。要加入 staging 環境，請複製 `src/environments/environment.ts`，命名為 `src/environments/environment.staging.ts`，再把 `staging` 設定加入 `angular.json`：

<code-example format="json" language="json">

  "configurations": {
    "development": { &hellip; },
    "production": { &hellip; },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

</code-example>

你也可以為這個目標環境加入更多設定選項。 建置支援的任何選項，都可以在建置目標設定中覆寫。

若要使用預備設定進行建置，執行下列指令：

<code-example format="shell" language="shell">

ng build --configuration=staging

</code-example>

如果你把它加入 `angular.json` 的 "serve:configurations" 區段，也可以設定 `serve` 指令使用目標建置設定：

<code-example format="json" language="json">

  "serve": {
    "builder": "&commat;angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-project-name:build"
    },
    "configurations": {
      "development": {
        "browserTarget": "your-project-name:build:development"
      },
      "production": {
        "browserTarget": "your-project-name:build:production"
      },
      "staging": {
        "browserTarget": "your-project-name:build:staging"
      }
    }
  },

</code-example>

<a id="size-budgets"></a>
<a id="configure-size-budgets"></a>

## 設定大小預算

應用程式的功能越長越大，體積也隨之增長。 CLI 讓你能在設定中訂定大小門檻，確保應用程式的各個部分維持在你定義的大小界限之內。

在 CLI 設定檔 `angular.json` 中，為每個[已設定的環境](#app-environments)加入一段 `budgets` 來定義大小界限。

<code-example format="json" language="json">

{
  &hellip;
  "configurations": {
    "production": {
      &hellip;
      "budgets": []
    }
  }
}

</code-example>

你可以為整個應用程式設定大小預算，也可以針對特定部分設定。 每個預算項目會設定一種指定類型的預算。 大小值可使用下列格式指定：

| 大小值 | 詳細資訊 |
| :-------------- | :-------------------------------------------------------------------------- |
| `123` or `123b` | 大小，單位為位元組。 |
| `123kb` | 大小，單位為 KB。 |
| `123mb` | 大小，單位為 MB。 |
| `12%` | 相對於基準的大小百分比。\(不適用於基準值本身。\) |

設定預算後，當應用程式的某個部分達到或超過你設定的界限大小時，建置器會發出警告或回報錯誤。

每個預算項目都是一個 JSON 物件，具有下列屬性：

| 屬性 | 值 |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type | 預算的類型。以下擇一： <table> <thead> <tr> <th> 值 </th> <th> 詳細資訊 </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> 特定 bundle 的大小。 </td> </tr> <tr> <td> <code>initial</code> </td> <td> 啟動應用程式所需的 JavaScript 大小。預設在 500kb 時警告、1mb 時報錯。 </td> </tr> <tr> <td> <code>allScript</code> </td> <td> 所有指令碼的大小。 </td> </tr> <tr> <td> <code>all</code> </td> <td> 整個應用程式的大小。 </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> 任一元件樣式表的大小。預設在 2kb 時警告、4kb 時報錯。 </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> 任一指令碼的大小。 </td> </tr> <tr> <td> <code>any</code> </td> <td> 任一檔案的大小。 </td> </tr> </tbody> </table> |
| name | 適用於 `type=bundle` 的 bundle 名稱。 |
| baseline | 用來比較的基準大小。 |
| maximumWarning | 相對於基準的警告上限門檻。 |
| maximumError | 相對於基準的錯誤上限門檻。 |
| minimumWarning | 相對於基準的警告下限門檻。 |
| minimumError | 相對於基準的錯誤下限門檻。 |
| warning | 相對於基準的警告門檻（下限與上限）。 |
| error | 相對於基準的錯誤門檻（下限與上限）。 |

<a id="commonjs "></a>

## 設定 CommonJS 依賴

<div class="alert is-important">

建議你避免在 Angular 應用程式中依賴 CommonJS 模組。
依賴 CommonJS 模組會妨礙打包器與壓縮器最佳化你的應用程式，導致套件變得更大。
建議你在整個應用程式中改用 [ECMAScript modules](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)。
更多資訊請參閱 [How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles)。

</div>

如果 Angular CLI 偵測到你的瀏覽器應用程式依賴 CommonJS 模組，會輸出警告。要停用這些警告，請把 CommonJS 模組名稱加入 `angular.json` 檔案中 `build` 選項裡的 `allowedCommonJsDependencies` 選項。

<code-example language="json">

"build": {
  "builder": "&commat;angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     &hellip;
   }
   &hellip;
},

</code-example>

<a id="browser-compat"></a>

## 設定瀏覽器相容性

Angular CLI 使用 [Browserslist](https://github.com/browserslist/browserslist) 來確保與不同瀏覽器版本的相容性。[Autoprefixer](https://github.com/postcss/autoprefixer) 用於 CSS 廠商前綴，[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) 則用於 JavaScript 語法轉換。

Angular CLI 內部使用下列 `browserslist` 設定，對應 Angular [支援的瀏覽器](guide/browser-support)。

  <code-example format="none" language="text">
  last 2 Chrome versions
  last 1 Firefox version
  last 2 Edge major versions
  last 2 Safari major versions
  last 2 iOS major versions
  Firefox ESR
  </code-example>

若要覆寫內部設定，執行 [`ng generate config browserslist`](cli/generate#config-command)，它會在專案目錄中產生一份 `.browserslistrc` 設定檔。

關於如何指定特定瀏覽器與版本，請參閱 [browserslist 儲存庫](https://github.com/browserslist/browserslist) 中的更多範例。

<div class="alert is-helpful">

使用 [browsersl.ist](https://browsersl.ist) 來顯示某個 `browserslist` 查詢所對應的相容瀏覽器。

</div>

<a id="proxy"></a>

## 代理到後端伺服器

使用 `webpack` 開發伺服器中的 [proxying 支援](https://webpack.js.org/configuration/dev-server/#devserverproxy)，把特定 URL 轉送到後端伺服器，做法是把檔案傳給 `--proxy-config` 建置選項。例如，要把所有對 `http://localhost:4200/api` 的呼叫轉送到執行於 `http://localhost:3000/api` 的伺服器，請依下列步驟操作。

1.  在專案的 `src/` 資料夾中建立一個 `proxy.conf.json` 檔案。
1.  把下列內容加入新的 proxy 檔案：

    <code-example format="json" language="json">

    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }

    </code-example>

1.  在 CLI 設定檔 `angular.json` 中，把 `proxyConfig` 選項加入 `serve` 目標：

    <code-example format="json" language="json">

      &hellip;
      "architect": {
        "serve": {
          "builder": "&commat;angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "your-application-name:build",
            "proxyConfig": "src/proxy.conf.json"
          },
    &hellip;

    </code-example>

1.  若要用這份 proxy 設定執行開發伺服器，請呼叫 `ng serve`。

編輯 proxy 設定檔以加入設定選項；以下是一些範例。 所有選項的說明，請參閱 [webpack DevServer 文件](https://webpack.js.org/configuration/dev-server/#devserverproxy)。

<div class="alert is-helpful">

注意：<br />
如果你編輯了代理設定檔，必須重新啟動 `ng serve` 程序，變更才會生效。

</div>

### 重寫 URL 路徑

`pathRewrite` proxy 設定選項可讓你在執行時期重寫 URL 路徑。例如，請為 proxy 設定指定下列 `pathRewrite` 值，從路徑結尾移除 "api"。

<code-example format="json" language="json">

{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}

</code-example>

如果你需要存取不在 `localhost` 上的後端，請一併設定 `changeOrigin` 選項。例如：

<code-example format="json" language="json">

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

</code-example>

要協助判斷 proxy 是否如預期運作，請設定 `logLevel` 選項。例如：

<code-example format="json" language="json">

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

</code-example>

Proxy 的日誌層級有 `info`（預設值）、`debug`、`warn`、`error` 與 `silent`。

### Proxy 多個項目

你可以透過用 JavaScript 定義設定，把多個項目 proxy 到同一個目標。

把 proxy 設定檔設為 `proxy.conf.mjs`（而非 `proxy.conf.json`），並如下列範例指定設定檔。

<code-example format="javascript" language="javascript">

export default [
  {
    context: [
        '/my',
        '/many',
        '/endpoints',
        '/i',
        '/need',
        '/to',
        '/proxy'
    ],
    target: 'http://localhost:3000',
    secure: false
  }
];

</code-example>

在 CLI 設定檔 `angular.json` 中，指向 JavaScript proxy 設定檔：

<code-example format="json" language="json">

&hellip;
"architect": {
  "serve": {
    "builder": "&commat;angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.mjs"
    },
&hellip;

</code-example>

### 略過 proxy

如果你需要選擇性地略過 proxy，或在請求送出前動態變更請求，請加入 bypass 選項，如這個 JavaScript 範例所示。

<code-example format="javascript" language="javascript">

export default {
  '/api/proxy': {
    "target": 'http://localhost:3000',
    "secure": false,
    "bypass": function (req, res, proxyOptions) {
        if (req.headers.accept.includes('html')) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
        }
        req.headers['X-Custom-Header'] = 'yes';
    }
  }
};

</code-example>

### 使用公司 proxy

如果你在公司 proxy 後面工作，後端無法直接把呼叫 proxy 到你本機網路以外的任何 URL。在這種情況下，你可以設定後端 proxy，讓它使用 agent 把呼叫經由你的公司 proxy 重新導向：

<code-example format="shell" language="shell">

npm install --save-dev https-proxy-agent

</code-example>

當你定義環境變數 `http_proxy` 或 `HTTP_PROXY` 時，執行 `npm start` 時會自動加入 agent，讓呼叫通過你的公司 proxy。

在 JavaScript 設定檔中使用下列內容。

<code-example format="javascript" language="javascript">

import HttpsProxyAgent from 'https-proxy-agent';

const proxyConfig = [{
  context: '/api',
  target: 'http://your-remote-server.com:3000',
  secure: false
}];

export default (proxyConfig) => {
  const proxyServer = process.env.http_proxy &verbar;&verbar; process.env.HTTP_PROXY;
  if (proxyServer) {
    const agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);

    for (const entry of proxyConfig) {
      entry.agent = agent;
    }
  }

  return proxyConfig;
};

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-01-17
