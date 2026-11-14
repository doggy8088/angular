# Angular Universal：伺服器端算繪

本指南說明 **Angular Universal**，這是一種在伺服器上執行你的 Angular 應用程式的技術。

一般的 Angular 應用程式在 _瀏覽器_ 中執行，根據使用者操作在 DOM 中算繪頁面。
Angular Universal 透過一個稱為 _伺服器端算繪_（SSR）的過程，在 _伺服器_ 上產生 _靜態_ 應用程式頁面。
當 Universal 與你的應用程式整合後，它可以產生這些頁面並提供給瀏覽器，以回應瀏覽器的請求。
它也可以預先產生頁面成為 HTML 檔案，供你稍後提供。

使用 [Angular CLI](guide/glossary#cli) 即可輕鬆讓應用程式為伺服器端算繪做好準備。CLI schematic `@nguniversal/express-engine` 會執行所需的步驟，如下所述。

本指南說明一個 Universal 範例應用程式，它會以伺服器算繪頁面的形式快速啟動。
同時，瀏覽器會下載完整的用戶端版本，並在程式碼載入後自動切換到該版本。

<div class="alert is-helpful">

**注意：** [下載完成的範例程式碼](generated/zips/universal/universal.zip)，
  其執行於 [Node.js® Express](https://expressjs.com/) 伺服器中。

</div>

{@a why-do-it}

## 為什麼要使用伺服器端算繪？

建立應用程式的 Universal 版本有三個主要原因。

1. 協助網路爬蟲（SEO）
1. 改善行動裝置與低功耗裝置上的效能
1. 快速顯示第一頁

{@a seo}
{@a web-crawlers}
### 協助網路爬蟲

Google、Bing、Facebook、Twitter 與其他社群媒體網站依賴網路爬蟲來索引你的應用程式內容，讓這些內容能在網路上被搜尋到。
這些網路爬蟲可能無法像真人使用者那樣，導覽並索引你高度互動的 Angular 應用程式。

Angular Universal 可以產生應用程式的靜態版本，不需要 JavaScript 也容易搜尋、連結與瀏覽。
Universal 也讓網站預覽成為可能，因為每個 URL 都會回傳完整算繪的頁面。

啟用網路爬蟲支援，通常稱為
[搜尋引擎最佳化（SEO）](https://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf)。

{@a no-javascript}

### 改善行動裝置與低功耗裝置上的效能

有些裝置不支援 JavaScript，或執行 JavaScript 的效能太差，導致使用者體驗無法接受。
對於這些情況，你可能需要應用程式的伺服器算繪、無 JavaScript 版本。
這個版本雖然有限，但可能是那些原本完全無法使用應用程式的人唯一可行的替代方案。

{@a startup-performance}

### 快速顯示第一頁

快速顯示第一頁，對使用者參與至關重要。
如果頁面載入時間超過 3 秒，[53% 的行動網站造訪會被放棄](https://www.doubleclickbygoogle.com/articles/mobile-speed-matters/)。
你的應用程式可能必須啟動得更快，才能在這些使用者決定去做別的事情之前吸引他們。

使用 Angular Universal，你可以為應用程式產生看起來像完整應用程式的登陸頁面。
這些頁面是純 HTML，即使 JavaScript 被停用也能顯示。
這些頁面不處理瀏覽器事件，但它們 _確實_ 支援使用 `[routerLink](guide/router#router-link)` 在網站中導覽。

實際上，你會提供到達頁面的靜態版本來留住使用者的注意力。
同時，你會在背後載入完整的 Angular 應用程式。
使用者會感覺到達頁面的效能近乎即時，並在完整應用程式載入後獲得完整的互動體驗。

{@a how-does-it-work}

## Universal Web 伺服器

Universal Web 伺服器會以 [Universal 範本引擎](#universal-engine)算繪的靜態 HTML 回應應用程式頁面請求。
伺服器接收並回應來自用戶端（通常是瀏覽器）的 HTTP 請求，並提供指令碼、CSS 與圖片等靜態資產。
它也可能回應資料請求，直接回應或以代理方式轉發到另一個資料伺服器。

本指南的範例 Web 伺服器以熱門的 [Express](https://expressjs.com/) 框架為基礎。

<div class="alert is-helpful">

**注意：** _任何_ Web 伺服器技術都可以提供 Universal 應用程式，只要它能呼叫 Universal 的 `renderModuleFactory()` 函式。
  這裡討論的原則與決策要點適用於任何 Web 伺服器技術。

</div>

若要建立 Universal 應用程式，請安裝 `platform-server` 套件，它提供 DOM、`XMLHttpRequest` 的伺服器實作，以及其他不依賴瀏覽器的低階功能。
使用 `platform-server` 模組（而非 `platform-browser` 模組）編譯用戶端應用程式，並在 Web 伺服器上執行產生的 Universal 應用程式。

伺服器（本指南範例中的 [Node Express](https://expressjs.com/)）會把用戶端對應用程式頁面的請求，傳給 Universal 的 `renderModuleFactory()` 函式。

`renderModuleFactory()` 函式接受一個 *範本* HTML 頁面（通常是 `index.html`）、
一個包含元件的 Angular *模組*，
以及一個決定要顯示哪些元件的 *路由* 作為輸入。
路由來自用戶端對伺服器的請求。

每個請求都會產生對應請求路由的適當檢視。
`renderModuleFactory()` 函式會在範本的 `<app>` 標籤內算繪該檢視，為用戶端建立完成的 HTML 頁面。

最後，伺服器會把算繪完成的頁面回傳給用戶端。

{@a summary}
## 為伺服器端算繪做好準備

在你的應用程式能在伺服器上算繪之前，你必須變更應用程式本身，並且設定伺服器。

1. 安裝相依套件。
1. 修改應用程式程式碼及其設定，為應用程式做好準備。
1. 加入建置目標，並使用 CLI 搭配 `@nguniversal/express-engine` schematic 建置 Universal 套件包。
1. 設定伺服器來執行 Universal 套件包。
1. 把應用程式打包並在伺服器上執行。

下列各節會更詳細地說明這些主要步驟。

<div class="alert is-helpful">

**注意：** 下方的 [Universal 教學](#the-example) 會使用 Tour of Heroes 範例應用程式帶你逐步完成這些步驟，並更詳細地說明你可以做什麼，以及你為什麼可能想這麼做。

若要查看可運作的伺服器端算繪應用程式，請 clone [Angular Universal starter](https://github.com/angular/universal-starter)。

</div>

<div class="callout is-critical">

<header>伺服器請求的安全性</header>

從瀏覽器應用程式發出的 HTTP 請求，與 Universal 應用程式在伺服器上發出的請求並不相同。
Universal HTTP 請求有不同的安全性需求

當瀏覽器發出 HTTP 請求時，伺服器可以對 cookies、XSRF 標頭等做出假設。
例如，瀏覽器會自動傳送目前使用者的驗證 cookies。
Angular Universal 無法把這些憑證轉送到另一台資料伺服器。
如果你的伺服器要處理 HTTP 請求，你就必須加入自己的安全性管道。

</div>

## 步驟 1：安裝相依套件

把 `@angular/platform-server` 安裝到你的專案中。使用的版本要與專案中其他 `@angular` 套件的版本相同。你的 webpack 建置也需要 `ts-loader`，以及 `@nguniversal/module-map-ngfactory-loader`，用於在伺服器算繪的上下文中處理延遲載入。

```
$ npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader ts-loader
```

## 步驟 2：為應用程式做好準備

若要讓你的應用程式為 Universal 算繪做好準備，請採取下列步驟：

* 為你的應用程式加入 Universal 支援。

* 建立伺服器根模組。

* 建立一個主要檔案，匯出伺服器根模組。

* 設定伺服器根模組。

### 2a. 為你的應用程式加入 Universal 支援

在 `src/app/app.module.ts` 中，為你的 `BrowserModule` 匯入加入 `.withServerTransition()` 與一個應用程式 ID，讓你的 `AppModule` 與 Universal 相容。

<code-example format="." language="typescript" linenums="false">
@NgModule({
  bootstrap: [AppComponent],
  imports: [
    // Add .withServerTransition() to support Universal rendering.
    // The application ID can be any identifier which is unique on
    // the page.
    BrowserModule.withServerTransition({appId: 'my-app'}),
    ...
  ],

})
export class AppModule {}
</code-example>

### 2b. 建立伺服器根模組

建立一個名為 `AppServerModule` 的模組，在伺服器上執行時作為根模組。本範例把它放在與 `app.module.ts` 相鄰、名為 `app.server.module.ts` 的檔案中。這個新模組匯入根 `AppModule` 的所有內容，並加入 `ServerModule`。它也加入 `ModuleMapLoaderModule`，協助讓延遲載入路由能在以 Angular CLI 進行伺服器端算繪時成為可能。

以下是 `src/app/app.server.module.ts` 中的一個範例。

<code-example format="." language="typescript" linenums="false">
import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';

@NgModule({
  imports: [
    // The AppServerModule should import your AppModule followed
    // by the ServerModule from @angular/platform-server.
    AppModule,
    ServerModule,
    ModuleMapLoaderModule // <-- *Important* to have lazy-loaded routes work
  ],
  // Since the bootstrapped component is not inherited from your
  // imported AppModule, it needs to be repeated here.
  bootstrap: [AppComponent],
})
export class AppServerModule {}
</code-example>

### 2c. 建立主要檔案以匯出 AppServerModule

在應用程式的 `src/` 資料夾中，為你的 Universal 套件包建立一個主要檔案，以匯出你的 `AppServerModule` 執行個體。本範例把這個檔案稱為 `main.server.ts`。

<code-example format="." language="typescript" linenums="false">
export { AppServerModule } from './app/app.server.module';
</code-example>

### 2d. 為 AppServerModule 建立設定檔

把 `tsconfig.app.json` 複製為 `tsconfig.server.json`，並修改如下：

* 在 `"compilerOptions"` 中，把 `"module"` 目標設為 `"commonjs"`。
* 加入 `"angularCompilerOptions"` 區段，並把 `"entryModule"` 設為指向你的 `AppServerModule` 執行個體。使用 `importPath#symbolName` 格式。在本範例中，進入模組是 `app/app.server.module#AppServerModule`。

<code-example format="." language="none" linenums="false">
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/app",
    "baseUrl": "./",
    // Set the module format to "commonjs":
    "module": "commonjs",
    "types": []
  },
  "exclude": [
    "test.ts",
    "**/*.spec.ts"
  ],
  // Add "angularCompilerOptions" with the AppServerModule you wrote
  // set as the "entryModule".
  "angularCompilerOptions": {
    "entryModule": "app/app.server.module#AppServerModule"
  }
}
</code-example>

## 步驟 3：建立新的建置目標並建置套件包

開啟你專案的 Angular 設定檔 `angular.json`，並在 `"architect"` 區段中為伺服器建置加入一個新目標。下列範例把新目標命名為 `"server"`。

<code-example format="." language="none" linenums="false">
"architect": {
  "build": { ... }
  "server": {
    "builder": "@angular-devkit/build-angular:server",
    "options": {
      "outputPath": "dist/my-project-server",
      "main": "src/main.server.ts",
      "tsConfig": "src/tsconfig.server.json"
    }
  }
}
</code-example>

若要為你的應用程式建置伺服器套件包，請使用 `ng run` 指令，格式為 `projectName#serverTarget`。在本範例中，現在設定了兩個目標 `"build"` 與 `"server"`。

<code-example format="." language="none" linenums="false">
# This builds your project using the server target, and places the output
# in dist/my-project-server/
$ ng run my-project:server

Date: 2017-07-24T22:42:09.739Z
Hash: 9cac7d8e9434007fd8da
Time: 4933ms
chunk {0} main.js (main) 9.49 kB [entry] [rendered]
chunk {1} styles.css (styles) 0 bytes [entry] [rendered]
</code-example>

## 步驟 4：設定伺服器以執行 Universal 套件包

若要執行 Universal 套件包，你需要把它傳送到伺服器。

下列範例把 `AppServerModule`（以 AoT 編譯）傳給 `PlatformServer` 方法 `renderModuleFactory()`，它會序列化應用程式，並把結果回傳給瀏覽器。

<code-example format="." language="typescript" linenums="false">
app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url,
    // configure DI to make lazy-loading work differently
    // (we need to instantly render the view)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    callback(null, html);
  });
});
</code-example>

這種技巧給你完整的彈性。為了方便起見，你也可以使用帶有一些內建功能的 `@nguniversal/express-engine` 工具。

<code-example format="." language="typescript" linenums="false">
import { ngExpressEngine } from '@nguniversal/express-engine';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
</code-example>

下列簡單範例實作了一個最基本的 Node Express 伺服器，把一切啟動起來。
（請注意，這僅供示範。在真正的生產環境中，你需要設定額外的驗證與安全性。）

在專案的根層級、`package.json` 旁邊，建立一個名為 `server.ts` 的檔案，並加入下列內容。

<code-example format="." language="typescript" linenums="false">
// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    callback(null, html);
  });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
</code-example>

## 步驟 5：把應用程式打包並在伺服器上執行

設定一個 webpack 設定，來處理 Node Express 的 `server.ts` 檔案並提供你的應用程式。

在你的應用程式根目錄中，建立一個 webpack 設定檔（`webpack.server.config.js`），把 `server.ts` 檔案及其相依性編譯到 `dist/server.js`。

<code-example format="." language="typescript" linenums="false">
@NgModule({
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {  server: './server.ts' },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/(node_modules|main\..*\.js)/],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for "WARNING Critical dependency: the request of a dependency is an expression"
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
}
</code-example>

專案的 `dist/` 資料夾現在同時包含 browser 與 server 資料夾。

<code-example format="." language="none" linenums="false">
dist/
   browser/
   server/
</code-example>

若要在伺服器上執行應用程式，請在命令殼層中輸入下列指令。

<code-example format="." language="bash" linenums="false">
node dist/server.js
</code-example>

### 建立腳本

現在讓我們建立幾個便利的腳本，幫助我們將來完成這一切。
你可以在 Angular 設定檔 `angular.json` 的 `"server"` 區段中加入這些腳本。

<code-example format="." language="none" linenums="false">
"architect": {
  "build": { ... }
  "server": {
    ...
     "scripts": {
      // Common scripts
      "build:ssr": "npm run build:client-and-server-bundles && npm run webpack:server",
      "serve:ssr": "node dist/server.js",

      // Helpers for the scripts
      "build:client-and-server-bundles": "ng build --prod && ng build --prod --app 1 --output-hashing=false",
      "webpack:server": "webpack --config webpack.server.config.js --progress --colors"
    }
   ...
</code-example>

若要在本機系統上以 Universal 執行你應用程式的生產建置，請使用下列指令。

<code-example format="." language="bash" linenums="false">
npm run build:ssr && npm run serve:ssr
</code-example>

### 處理瀏覽器 API 的因應方式

因為 Universal `platform-server` 應用程式不在瀏覽器中執行，你可能必須因應伺服器上缺少的一些瀏覽器 API 與功能。

例如，你在伺服器端算繪的頁面無法參照 `window`、`document`、`navigator` 或 `location` 等瀏覽器專屬的原生物件。
如果你在伺服器算繪頁面上不需要這些物件，你可以用條件邏輯避開它們。
或者，你可以為你需要的物件找到可注入的 Angular 抽象層，例如 `Location` 或 `Document`；
它可能足以替代你正在呼叫的特定 API。
如果 Angular 沒有提供它，你可以撰寫自己的抽象層：在瀏覽器中委派給瀏覽器 API，在伺服器上則委派給令人滿意的替代實作。

同樣地，沒有滑鼠或鍵盤事件時，伺服器端應用程式無法仰賴使用者點選按鈕來顯示元件。
應用程式必須僅根據傳入的用戶端請求來決定要算繪的內容。
這正是讓應用程式[可路由](guide/router)的有力理由。

因為伺服器算繪頁面的使用者除了點選連結之外做不了多少事，
你應該盡快把真正的用戶端應用程式換上來，以提供適當的互動體驗。

{@a the-example}

## Universal 教學

[英雄之旅教學](tutorial)是本逐步解說的基礎。

核心應用程式檔案大多未動，只有少數例外，如下所述。
你將加入更多檔案，以支援使用 Universal 進行建置與提供服務。

在本範例中，Angular CLI 會使用
[預先編譯（AoT）編譯器](guide/aot-compiler)
編譯並打包應用程式的 Universal 版本。
Node Express Web 伺服器會把用戶端請求轉換為 Universal 算繪的 HTML 頁面。

若要建立伺服器端應用程式模組 `app.server.module.ts`，請執行下列 CLI 指令。

<code-example format="." language="bash">

ng add @nguniversal/express-engine --clientProject angular.io-example

</code-example>

此指令會建立下列資料夾結構。

<code-example format="." language="none" linenums="false">
src/
  index.html                 <i>應用程式網頁</i>
  main.ts                    <i>用戶端應用程式的啟動器</i>
  main.server.ts             <i>* 伺服器端應用程式的啟動器</i>
  tsconfig.app.json          <i>TypeScript 用戶端設定</i>
  tsconfig.server.json       <i>* TypeScript 伺服器設定</i>
  tsconfig.spec.json         <i>TypeScript 規格設定</i>
  style.css                  <i>應用程式的樣式</i>
  app/ ...                   <i>應用程式程式碼</i>
    app.server.module.ts     <i>* 伺服器端應用程式模組</i>
server.ts                    <i>* Express Web 伺服器</i>
tsconfig.json                <i>TypeScript 用戶端設定</i>
package.json                 <i>npm 設定</i>
webpack.server.config.js     <i>* webpack 伺服器設定</i>
</code-example>

標有 `*` 的檔案是新增的，不在原始教學範例中。
本指南在下列各節中介紹它們。

{@a http-urls}

### 對伺服器請求使用絕對 URL

教學的 `HeroService` 與 `HeroSearchService` 委派給 Angular 的 `HttpClient` 模組來擷取應用程式資料。
這些服務會把請求傳送到 _相對_ URL，例如 `api/heroes`。
在 Universal 應用程式中，HTTP URL 必須是 _絕對的_（例如 `https://my-server.com/api/heroes`），即使 Universal Web 伺服器有能力處理相對請求。
這表示你需要變更你的服務：在伺服器上執行時以絕對 URL 發出請求，在瀏覽器中執行時則以相對 URL 發出請求。

一種解決方案是在 Angular 的 [`APP_BASE_HREF`](api/common/APP_BASE_HREF) token 之下提供伺服器的執行期來源，
把它注入服務中，並把來源前置加到請求 URL 上。

首先，變更 `HeroService` 建構子，讓它接受第二個 `origin` 參數，該參數透過 `APP_BASE_HREF` token 選擇性地注入。

<code-example path="universal/src/app/hero.service.ts" region="ctor" title="src/app/hero.service.ts (constructor with optional origin)">
</code-example>

建構子使用 `@Optional()` 裝飾器，在來源 _存在時_ 把它前置加到 `heroesUrl` 上。
你在瀏覽器版本中不提供 `APP_BASE_HREF`，所以 `heroesUrl` 保持相對。

<div class="alert is-helpful">

**注意：** 如果你已在 `index.html` 檔案中指定 `<base href="/">` 以滿足路由器對基底位址的需求（如教學範例所做的），你可以忽略瀏覽器中的 `APP_BASE_HREF`。

</div>

{@a universal-engine}
### Universal 範本引擎

`server.ts` 檔案中重要的一段是 `ngExpressEngine()` 函式。

<code-example path="universal/server.ts" title="server.ts" region="ngExpressEngine">
</code-example>

`ngExpressEngine()` 函式是 Universal 的 `renderModuleFactory()` 函式的包裝器，它把用戶端的請求轉換為伺服器算繪的 HTML 頁面。
你會在一個適合你伺服器技術堆疊的 _範本引擎_ 中呼叫該函式。

* 第一個參數是 `AppServerModule`。
它是 Universal 伺服器端算繪器與你的應用程式之間的橋樑。

* 第二個參數 `extraProviders` 是可選的。它讓你指定只在這個伺服器上執行時才套用的相依性提供者。
當你的應用程式需要只能由目前正在執行的伺服器執行個體判斷的資訊時，你可以這樣做。
本例中需要的資訊是執行中伺服器的 *來源*，它在 `APP_BASE_HREF` token 之下提供，讓應用程式可以[計算絕對 HTTP URL](#http-urls)。

`ngExpressEngine()` 函式回傳一個 `Promise` 回呼，它會解析為算繪好的頁面。
要如何處理該頁面，由你的引擎決定。
這個引擎的 `Promise` 回呼會把算繪好的頁面回傳給 Web 伺服器，
伺服器接著在 HTTP 回應中把它轉送給用戶端。

<div class="alert is-helpful">

**注意：** 這些包裝器有助於隱藏 `renderModuleFactory()` 函式的複雜性。在 [Universal 儲存庫](https://github.com/angular/universal) 中，有更多針對不同後端技術的包裝器。

</div>

### 篩選請求 URL

Web 伺服器必須區分 _應用程式頁面請求_ 與其他種類的請求。

這不像攔截對根位址 `/` 的請求那麼簡單。
瀏覽器可能會請求其中一個應用程式路由，例如 `/dashboard`、`/heroes` 或 `/detail:12`。
事實上，如果應用程式僅由伺服器算繪，點選的 _每一個_ 應用程式連結都會以導覽 URL 的形式到達伺服器，供路由器使用。

幸好，應用程式路由有一個共同點：它們的 URL 沒有副檔名。
（資料請求也沒有副檔名，但可以認出它們，因為它們一律以 `/api` 開頭。）
所有靜態資產請求都有副檔名（例如 `main.js` 或 `/node_modules/zone.js/dist/zone.js`）。

由於你使用路由，你可以辨識這三種請求類型並以不同方式處理。

1. 資料請求 - 以 `/api` 開頭的請求 URL。
2. 應用程式導覽 - 沒有副檔名的請求 URL。
3. 靜態資產 - 所有其他請求。

Node Express 伺服器是一條中介軟體管道，逐一篩選並處理 URL 請求。
你以像這樣的 `app.get()` 呼叫來設定 Node Express 伺服器管道，這個呼叫是針對資料請求的。

<code-example path="universal/server.ts" title="server.ts (data URL)" region="data-request" linenums="false">
</code-example>

<div class="alert is-helpful">

**注意：** 這個範例伺服器不處理資料請求。

教學中的「in-memory web API」模組是一個示範與開發工具，它會攔截所有 HTTP 呼叫，並模擬遠端資料伺服器的行為。
  實際上，你會移除該模組，並在此處於伺服器上註冊你的 Web API 中介軟體。

</div>

下列程式碼會篩選沒有副檔名的請求 URL，並將其視為導覽請求。

<code-example path="universal/server.ts" title="server.ts (navigation)" region="navigation-request" linenums="false">
</code-example>

### 安全地提供靜態檔案

單一的 `app.use()` 會把所有其他 URL 視為對 JavaScript、圖片與樣式檔案等靜態資產的請求。

為了確保用戶端只能下載他們被允許查看的檔案，請把所有面向用戶端的資產檔案放在 `/dist` 資料夾中，並且只受理對 `/dist` 資料夾中檔案的請求。

下列 Node Express 程式碼會把所有剩餘請求路由到 `/dist`，如果找不到檔案，就回傳 `404 - NOT FOUND` 錯誤。

<code-example path="universal/server.ts" title="server.ts (static files)" region="static" linenums="false">
</code-example>

### Universal 實戰

在瀏覽器中開啟 http://localhost:4000/。
你應該會看到熟悉的 Tour of Heroes 儀表板頁面。

透過 `routerLinks` 的導覽運作正確。
你可以從儀表板前往 Heroes 頁面再回來。
你可以點選儀表板頁面上的英雄，顯示其 Details 頁面。

但請注意，點選、滑鼠移動與鍵盤輸入都是無反應的。

* 在 Heroes 頁面上點選英雄沒有任何作用。
* 你無法加入或刪除英雄。
* 儀表板頁面上的搜尋框被忽略。
* Details 頁面上的 *Back* 與 *Save* 按鈕無法運作。

除了 `routerLink` 點選之外的使用者事件都不支援。
你必須等待完整的用戶端應用程式到達。
在你編譯用戶端應用程式並把輸出移到 `dist/` 資料夾之前，它不會到達。

在開發機器上，從伺服器算繪應用程式轉換到用戶端應用程式發生得很快。
你可以模擬較慢的網路，更清楚地看到轉換過程，並
更能體會在低功耗、連線品質差的裝置上執行的 Universal 應用程式所帶來的啟動速度優勢。

開啟 Chrome Dev Tools 並前往 Network 分頁。
在選單列最右邊找到 [Network Throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#throttling) 下拉選單。

試試其中一種「3G」速度。
伺服器算繪的應用程式仍然快速啟動，但完整的用戶端應用程式可能需要幾秒鐘才能載入。
