# Angular Universal：伺服器端算繪

本指南說明 **Angular Universal**，這是一種在伺服器上執行你的 Angular 應用程式的技術。

一般的 Angular 應用程式在 _瀏覽器_ 中執行，根據使用者操作在 DOM 中算繪頁面。

**Angular Universal** 透過一個稱為 **伺服器端算繪（SSR）** 的過程，在 _伺服器_ 上產生 _靜態_ 應用程式頁面。

它可以產生這些頁面並提供給瀏覽器，以回應瀏覽器的請求。
它也可以預先產生頁面成為 HTML 檔案，供你稍後提供。

本指南說明一個 Universal 範例應用程式，它會以伺服器算繪頁面的形式快速啟動。
同時，瀏覽器會下載完整的用戶端版本，並在程式碼載入後自動切換到該版本。

<div class="l-sub-section">

[下載完成的範例程式碼](generated/zips/universal/universal.zip)，
其執行於 [node express](https://expressjs.com/) 伺服器中。

</div>

{@a why-do-it}

### 為什麼要用 Universal

建立應用程式的 Universal 版本有三個主要原因。

1. 協助網路爬蟲（SEO）
1. 改善行動裝置與低功耗裝置上的效能
1. 快速顯示第一頁

{@a seo}
{@a web-crawlers}
#### 協助網路爬蟲

Google、Bing、Facebook、Twitter 與其他社群媒體網站依賴網路爬蟲來索引你的應用程式內容，讓這些內容能在網路上被搜尋到。

這些網路爬蟲可能無法像真人使用者那樣，導覽並索引你高度互動的 Angular 應用程式。

Angular Universal 可以產生應用程式的靜態版本，不需要 JavaScript 也容易搜尋、連結與瀏覽。
它也讓網站預覽成為可能，因為每個 URL 都會回傳完整算繪的頁面。

啟用網路爬蟲支援，通常稱為
[搜尋引擎最佳化（SEO）](https://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf)。

{@a no-javascript}

#### 行動裝置與低效能裝置上的效能

有些裝置不支援 JavaScript，或執行 JavaScript 的效能太差，導致使用者體驗無法接受。
對於這些情況，你可能需要應用程式的伺服器算繪、無 JavaScript 版本。
這個版本雖然有限，但可能是那些原本完全無法使用應用程式的人唯一可行的替代方案。

{@a startup-performance}

#### 快速顯示第一頁

快速顯示第一頁，對使用者參與至關重要。

如果頁面載入時間超過 3 秒，[53% 的行動網站造訪會被放棄](https://www.doubleclickbygoogle.com/articles/mobile-speed-matters/)。
你的應用程式可能必須啟動得更快，才能在這些使用者決定去做別的事情之前吸引他們。

使用 Angular Universal，你可以為應用程式產生看起來像完整應用程式的登陸頁面。
這些頁面是純 HTML，即使 JavaScript 被停用也能顯示。
這些頁面不處理瀏覽器事件，但它們 _確實_ 支援使用 [routerLink](guide/router.html#router-link) 在網站中導覽。

實際上，你會提供登陸頁面的靜態版本來留住使用者的注意力。
同時，你會以[下方說明](#transition)的方式，在背後載入完整的 Angular 應用程式。
使用者會感覺登陸頁面的效能近乎即時，
並在完整應用程式載入後獲得完整的互動體驗。

{@a how-does-it-work}
### 運作方式

若要建立 Universal 應用程式，請安裝 `platform-server` 套件。
`platform-server` 套件提供 DOM、`XMLHttpRequest` 的伺服器實作，以及其他不依賴瀏覽器的低階功能。

你使用 `platform-server` 模組而非 `platform-browser` 模組來編譯用戶端應用程式，
並在 Web 伺服器上執行產生的 Universal 應用程式。

伺服器（本指南範例中的 [Node Express](https://expressjs.com/) 伺服器）
會把用戶端對應用程式頁面的請求，傳給 Universal 的 `renderModuleFactory` 函式。

`renderModuleFactory` 函式接受一個 *範本* HTML 頁面（通常是 `index.html`）、
一個包含元件的 Angular *模組*，
以及一個決定要顯示哪些元件的 *路由* 作為輸入。

路由來自用戶端對伺服器的請求。
每個請求都會產生對應請求路由的適當檢視。

`renderModuleFactory` 會在範本的 `<app>` 標籤內算繪該檢視，為用戶端建立完成的 HTML 頁面。

最後，伺服器會把算繪完成的頁面回傳給用戶端。

### 處理瀏覽器 API 的因應方式

因為 Universal `platform-server` 應用程式不在瀏覽器中執行，你可能必須因應伺服器上缺少的一些瀏覽器 API 與功能。

你無法參照 `window`、`document`、`navigator` 或 `location` 等瀏覽器專屬的原生物件。
如果你不需要在伺服器算繪頁面上使用它們，請用條件邏輯避開它們。

或者，為你需要的物件尋找可注入的 Angular 抽象層，例如 `Location` 或 `Document`；
它可能足以替代你正在呼叫的特定 API。
如果 Angular 沒有提供它，你或許可以撰寫自己的抽象層：在瀏覽器中委派給瀏覽器 API，在伺服器上則委派給令人滿意的替代實作。

沒有滑鼠或鍵盤事件時，Universal 應用程式無法仰賴使用者點選按鈕來顯示元件。
Universal 應用程式應該僅根據傳入的用戶端請求來決定要算繪的內容。
這正是讓應用程式[可路由](guide/router)的有力理由。

因為伺服器算繪頁面的使用者除了點選連結之外做不了多少事，
你應該盡快[把真正的用戶端應用程式換上來](#transition)，以提供適當的互動體驗。

{@a the-example}

## 範例

_Tour of Heroes_ 教學是本指南所述 Universal 範例的基礎。

核心應用程式檔案大多未動，只有少數例外，如下所述。
你將加入更多檔案，以支援使用 Universal 進行建置與提供服務。

在本範例中，Angular CLI 會使用
[AOT（Ahead-of-Time）編譯器](guide/aot-compiler)
編譯並打包應用程式的 Universal 版本。
Node/Express Web 伺服器會把用戶端請求轉換為 Universal 算繪的 HTML 頁面。

你將建立：

 * 伺服器端應用程式模組，`app.server.module.ts`
 * 伺服器端的進入點，`main.server.ts`
 * 處理請求的 Express Web 伺服器，`server.ts`
 * TypeScript 設定檔，`tsconfig.server.json`
 * 伺服器用的 Webpack 設定檔，`webpack.server.config.js`

完成後，資料夾結構將如下所示：

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

{@a preparation}

## 準備工作

下載 [Tour of Heroes](generated/zips/toh-pt6/toh-pt6.zip) 專案，並從中安裝相依套件。

{@a install-the-tools}

### 安裝工具

首先，安裝這些套件。

 * `@angular/platform-server`：Universal 伺服器端元件。
 * `@nguniversal/module-map-ngfactory-loader`：在伺服器算繪的上下文中處理延遲載入。
 * `@nguniversal/express-engine`：Universal 應用程式用的 Express 引擎。
 * `ts-loader`：轉譯伺服器應用程式

以下列指令安裝它們：

<code-example format="." language="bash">
npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader ts-loader @nguniversal/express-engine
</code-example>

{@a transition}

### 修改用戶端應用程式

Universal 應用程式可以作為動態且內容豐富的「啟動畫面」，吸引用使用者。
它給人近乎即時應用程式的印象。

同時，瀏覽器在背景下載用戶端應用程式的指令碼。
載入完成後，Angular 會從靜態的伺服器算繪頁面，轉換到互動式用戶端應用程式動態算繪的檢視。

你必須對應用程式程式碼做一些變更，以同時支援伺服器端算繪，以及轉換到用戶端應用程式。

#### 根 `AppModule`

開啟檔案 `src/app/app.module.ts`，在 `NgModule` 中繼資料中找到 `BrowserModule` 的匯入。
把該匯入換成以下這個：

<code-example path="universal/src/app/app.module.ts" region="browsermodule" title="src/app/app.module.ts (withServerTransition)">
</code-example>

Angular 會把 `appId` 值（可以是 _任何_ 字串）加入伺服器算繪頁面的樣式名稱中，
以便在用戶端應用程式啟動時識別並移除它們。

你可以透過注入，取得目前平台與 `appId` 的執行期資訊。

<code-example path="universal/src/app/app.module.ts" region="platform-detection" title="src/app/app.module.ts (platform detection)">
</code-example>

{@a http-urls}

#### 絕對 HTTP URL

教學的 `HeroService` 與 `HeroSearchService` 委派給 Angular 的 `HttpClient` 模組來擷取應用程式資料。
這些服務會把請求傳送到 _相對_ URL，例如 `api/heroes`。

在 Universal 應用程式中，HTTP URL 必須是 _絕對的_，例如 `https://my-server.com/api/heroes`，
即使 Universal Web 伺服器有能力處理這些請求。

你必須變更這些服務：在伺服器上執行時以絕對 URL 發出請求，
在瀏覽器中執行時則以相對 URL 發出請求。

一種解決方案是在 Angular 的 [`APP_BASE_REF` token](api/common/APP_BASE_HREF) 之下提供伺服器的執行期來源，
把它注入服務中，並把來源前置加到請求 URL 上。

首先，變更 `HeroService` 建構子，讓它接受第二個 `origin` 參數，該參數透過 `APP_BASE_HREF` token 選擇性地注入。

<code-example path="universal/src/app/hero.service.ts" region="ctor" title="src/app/hero.service.ts (constructor with optional origin)">
</code-example>

請注意，建構子如何把來源（如果存在的話）前置加到 `heroesUrl` 上。

你在瀏覽器版本中不提供 `APP_BASE_HREF`，所以 `heroesUrl` 保持相對。

<div class="l-sub-section">

如果你已在 `index.html` 中指定 `<base href="/">` 以滿足路由器對基底位址的需求（如教學範例所做的），你可以忽略瀏覽器中的 `APP_BASE_HREF`。

</div>

{@a server-code}

## 伺服器程式碼

若要執行 Angular Universal 應用程式，你需要一台能接受用戶端請求並回傳算繪頁面的伺服器。

{@a app-server-module}

### 應用程式伺服器模組

應用程式伺服器模組類別（依慣例命名為 `AppServerModule`）是一個 Angular 模組，它包裝應用程式的根模組（`AppModule`），讓 Universal 能在你的應用程式與伺服器之間居中協調。
`AppServerModule` 也告訴 Angular，在以 Universal 應用程式形式執行時如何啟動你的應用程式。

在 `src/app/` 目錄中建立一個 `app.server.module.ts` 檔案，內容為下列 `AppServerModule` 程式碼：

<code-example path="universal/src/app/app.server.module.ts" title="src/app/app.server.module.ts">
</code-example>

請注意，它先匯入用戶端應用程式的 `AppModule`、Angular Universal 的 `ServerModule` 與 `ModuleMapLoaderModule`。

`ModuleMapLoaderModule` 是一個伺服器端模組，它讓路由能延遲載入。

這裡也是註冊在 Universal 下執行應用程式專屬提供者的地方。

{@a web-server}

### Universal Web 伺服器

_Universal_ Web 伺服器會以 [Universal 範本引擎](#universal-engine)算繪的靜態 HTML 回應應用程式 _頁面_ 請求。

它接收並回應來自用戶端（通常是瀏覽器）的 HTTP 請求。
它提供指令碼、CSS 與圖片等靜態資產。
它也可能回應資料請求，或許直接回應，或作為代理轉發到另一台資料伺服器。

本指南的範例 Web 伺服器以熱門的 [Express](https://expressjs.com/) 框架為基礎。

<div class="l-sub-section">

  _任何_ Web 伺服器技術都可以提供 Universal 應用程式，只要它能呼叫 Universal 的 `renderModuleFactory`。
  以下討論的原則與決策要點，適用於你所選擇的任何 Web 伺服器技術。

</div>

在根目錄中建立一個 `server.ts` 檔案，並加入下列程式碼：

<code-example path="universal/server.ts" title="server.ts">
</code-example>

<div class="alert is-critical">

  **這個範例伺服器並不安全！**
  務必加入中介軟體來驗證與授權使用者，
  就像你對一般的 Angular 應用程式伺服器所做的那樣。

</div>

{@a universal-engine}
#### Universal 範本引擎

這個檔案中重要的一段是 `ngExpressEngine` 函式：

<code-example path="universal/server.ts" title="server.ts" region="ngExpressEngine">
</code-example>

`ngExpressEngine` 是 Universal 的 `renderModuleFactory` 函式的包裝器，它把用戶端的請求轉換為伺服器算繪的 HTML 頁面。
你會在一個適合你伺服器技術堆疊的 _範本引擎_ 中呼叫該函式。

第一個參數是你[稍早](#app-server-module)撰寫的 `AppServerModule`。
它是 Universal 伺服器端算繪器與你的應用程式之間的橋樑。

第二個參數是 `extraProviders`。它是可選的 Angular 依賴注入提供者，在這個伺服器上執行時套用。

{@a provide-origin}

當你的應用程式需要只能由目前正在執行的伺服器執行個體判斷的資訊時，你就要提供 `extraProviders`。

本例中需要的資訊是執行中伺服器的來源，它在 `APP_BASE_HREF` token 之下提供，讓應用程式可以[計算絕對 HTTP URL](#http-urls)。

`ngExpressEngine` 函式回傳一個 _promise_，它會解析為算繪好的頁面。

要如何處理該頁面，由你的引擎決定。
_這個引擎的_ promise 回呼會把算繪好的頁面回傳給 [Web 伺服器](#web-server)，
伺服器接著在 HTTP 回應中把它轉送給用戶端。

<div class="l-sub-section">

  這些包裝器非常有用，能隱藏 `renderModuleFactory` 的複雜性。在 [Universal 儲存庫](https://github.com/angular/universal) 中，有更多針對不同後端技術的包裝器。

</div>

#### 篩選請求 URL

Web 伺服器必須區分 _應用程式頁面請求_ 與其他種類的請求。

這不像攔截對根位址 `/` 的請求那麼簡單。
瀏覽器可能會請求其中一個應用程式路由，例如 `/dashboard`、`/heroes` 或 `/detail:12`。
事實上，如果應用程式 _僅_ 由伺服器算繪，點選的 _每一個_ 應用程式連結都會以導覽 URL 的形式到達伺服器，
供路由器使用。

幸好，應用程式路由有一個共同點：它們的 URL 沒有副檔名。

資料請求也沒有副檔名，但可以認出它們，因為它們一律以 `/api` 開頭。

所有靜態資產請求都有副檔名（例如 `main.js` 或 `/node_modules/zone.js/dist/zone.js`）。

因此我們可以輕鬆辨識這三種請求類型，並以不同方式處理。

1. 資料請求：以 `/api` 開頭的請求 URL
2. 應用程式導覽：沒有副檔名的請求 URL
3. 靜態資產：所有其他請求。

Express 伺服器是一條中介軟體管道，逐一篩選並處理 URL 請求。

你以像這樣的 `app.get()` 呼叫來設定 Express 伺服器管道，這個呼叫是針對資料請求的。

<code-example path="universal/server.ts" title="server.ts (data URL)" region="data-request" linenums="false">
</code-example>

<div class="l-sub-section">

這個範例伺服器不處理資料請求。

教學中的「in-memory web API」模組是一個示範與開發工具，它會攔截所有 HTTP 呼叫，
並模擬遠端資料伺服器的行為。
實際上，你會移除該模組，並在此處於伺服器上註冊你的 Web API 中介軟體。

</div>

<div class="alert is-critical">

**Universal HTTP 請求有不同的安全性需求**

從瀏覽器應用程式發出的 HTTP 請求，與 Universal 應用程式在伺服器上發出的請求並不相同。

當瀏覽器發出 HTTP 請求時，伺服器可以對 cookies、XSRF 標頭等做出假設。

例如，瀏覽器會自動傳送目前使用者的驗證 cookies。
Angular Universal 無法把這些憑證轉送到另一台資料伺服器。
如果你的伺服器要處理 HTTP 請求，你就必須加入自己的安全性管道。

</div>

下列程式碼會篩選沒有副檔名的請求 URL，並將其視為導覽請求。

<code-example path="universal/server.ts" title="server.ts (navigation)" region="navigation-request" linenums="false">
</code-example>

#### 安全地提供靜態檔案

單一的 `app.use()` 會把所有其他 URL 視為對 JavaScript、圖片與樣式檔案等靜態資產的請求。

為了確保用戶端只能下載他們被 _允許_ 查看的檔案，你會[把所有面向用戶端的資產檔案放在 `/dist` 資料夾中](#universal-webpack-設定)，
並且只受理對 `/dist` 資料夾中檔案的請求。

下列 Express 程式碼會把所有剩餘請求路由到 `/dist`；如果找不到檔案，就回傳 `404 - NOT FOUND`。

<code-example path="universal/server.ts" title="server.ts (static files)" region="static" linenums="false">
</code-example>

{@a universal-configuration}

## 為 Universal 進行設定

伺服器應用程式需要它自己的建置設定。

{@a universal-typescript-configuration}

### Universal TypeScript 設定

在專案根目錄中建立一個 `tsconfig.server.json` 檔案，以設定 Universal 應用程式的 TypeScript 與 AOT 編譯。

<code-example path="universal/src/tsconfig.server.json" title="src/tsconfig.server.json">
</code-example>

這個設定繼承自根目錄的 `tsconfig.json` 檔案。某些設定因其差異而值得注意。

* `module` 屬性必須是 **commonjs** 格式，才能被 require 到我們的伺服器應用程式中。

* `angularCompilerOptions` 區段會引導 AOT 編譯器：
  * `entryModule`：伺服器應用程式的根模組，以 `path/to/file#ClassName` 表示。

### Universal Webpack 設定

Universal 應用程式不需要任何額外的 Webpack 設定，CLI 會為你處理，
但因為伺服器是 TypeScript 應用程式，你會使用 Webpack 來轉譯它。

在專案根目錄中建立一個 `webpack.server.config.js` 檔案，內容為下列程式碼。

<code-example path="universal/webpack.server.config.js" title="webpack.server.config.js">
</code-example>

**Webpack 設定**是一個豐富的主題，超出本指南的範圍。

## 使用 Universal 建置並執行

現在你已建立 TypeScript 與 Webpack 設定檔，可以建置並執行 Universal 應用程式。

首先，把 _build_ 與 _serve_ 指令加入 `package.json` 的 `scripts` 區段：

<code-example format="." language="ts">
"scripts": {
    ...
    "build:universal": "npm run build:client-and-server-bundles && npm run webpack:server",
    "serve:universal": "node dist/server.js",
    "build:client-and-server-bundles": "ng build --prod && ng build --prod --app 1 --output-hashing=false",
    "webpack:server": "webpack --config webpack.server.config.js --progress --colors"
    ...
}
</code-example>

{@a build}

#### 建置

在命令提示字元中輸入

<code-example format="." language="bash">
npm run build:universal
</code-example>

Angular CLI 會把 Universal 應用程式編譯並打包到兩個不同的資料夾 `browser` 與 `server` 中。
Webpack 會把 `server.ts` 檔案轉譯為 JavaScript。

{@a serve}

#### 啟動伺服器

建置應用程式之後，啟動伺服器。

<code-example format="." language="bash">
npm run serve:universal
</code-example>

主控台視窗應該會顯示

<code-example format="." language="bash">
Node server listening on http://localhost:4000
</code-example>

## Universal 實戰

在瀏覽器中開啟 http://localhost:4000/。
你應該會看到熟悉的 Tour of Heroes 儀表板頁面。

透過 `routerLinks` 的導覽運作正確。
你可以從儀表板前往 Heroes 頁面再回來。
你可以點選儀表板頁面上的英雄，顯示其 Details 頁面。

但點選、滑鼠移動與鍵盤輸入都是無反應的。

* 在 Heroes 頁面上點選英雄沒有任何作用。
* 你無法加入或刪除英雄。
* 儀表板頁面上的搜尋框被忽略。
* Details 頁面上的 _back_ 與 _save_ 按鈕無法運作。

除了 `routerLink` 點選之外的使用者事件都不支援。
使用者必須等待完整的用戶端應用程式到達。

在你編譯用戶端應用程式並把輸出移到 `dist/` 資料夾之前，它永遠不會到達，
而這一步你馬上就會進行。

## 網路節流

在開發機器上，從伺服器算繪應用程式轉換到用戶端應用程式發生得很快。
你可以模擬較慢的網路，更清楚地看到轉換過程，並
更能體會在低功耗、連線品質差的裝置上執行的 Universal 應用程式所帶來的啟動速度優勢。

開啟 Chrome Dev Tools 並前往 Network 分頁。
在選單列最右邊找到 [Network Throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#throttling) 下拉選單。

試試其中一種「3G」速度。
伺服器算繪的應用程式仍然快速啟動，但完整的用戶端應用程式可能需要幾秒鐘才能載入。

{@a summary}
## 總結

本指南向你展示了如何把現有的 Angular 應用程式，變成能進行伺服器端算繪的 Universal 應用程式。
它也說明了這樣做的一些關鍵原因。

 - 協助網路爬蟲（SEO）
 - 支援低頻寬或低功耗裝置
 - 快速載入第一頁

Angular Universal 能大幅改善你的應用程式給人的啟動效能感受。
網路越慢，讓 Universal 向使用者顯示第一頁就越有利。
