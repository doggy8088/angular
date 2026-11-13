# 使用 Angular Universal 進行伺服器端算繪（SSR）

本指南說明 **Angular Universal**，這是一種在伺服器上算繪 Angular 應用程式的技術。

一般的 Angular 應用程式在 _瀏覽器_ 中執行，根據使用者操作在 DOM 中算繪頁面。
Angular Universal 在 _伺服器_ 上執行，產生之後會在用戶端啟動的 _靜態_ 應用程式頁面。這表示應用程式通常算繪得更快，讓使用者有機會在應用程式完全可互動之前，先看到應用程式的版面配置。

如需更深入了解 SSR 相關的不同技術與概念，請參閱這篇
[文章](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)。

使用 [Angular CLI](guide/glossary#cli) 即可輕鬆讓應用程式為伺服器端算繪做好準備。
CLI schematic `@nguniversal/express-engine` 會執行所需的步驟，如下所述。

<div class="alert is-helpful">

  Angular Universal 需要 [active LTS 或 maintenance LTS](https://nodejs.org/about/releases) 版本的 Node.js。
  請參閱 [package.json](https://unpkg.com/browse/@angular/platform-server/package.json) 檔案中的 `engines` 屬性，以了解目前支援的版本。

</div>

<div class="alert is-helpful">

  **注意：** <live-example downloadOnly>下載完成的範例程式碼</live-example>，其執行於 [Node.js® Express](https://expressjs.com/) 伺服器中。

</div>

{@a the-example}
## Universal 教學

[英雄之旅教學](tutorial)是本逐步解說的基礎。

在本範例中，Angular CLI 會使用[預先編譯（AOT）編譯器](guide/aot-compiler)編譯並打包應用程式的 Universal 版本。
Node.js Express Web 伺服器會根據用戶端請求，使用 Universal 編譯 HTML 頁面。

若要建立伺服器端應用程式模組 `app.server.module.ts`，請執行下列 CLI 指令。

<code-example language="bash">

ng add @nguniversal/express-engine

</code-example>

此指令會建立下列資料夾結構。

<code-example language="none">
src/
  index.html                 <i>應用程式網頁</i>
  main.ts                    <i>用戶端應用程式的啟動器</i>
  main.server.ts             <i>* 伺服器端應用程式的啟動器</i>
  style.css                  <i>應用程式的樣式</i>
  app/ ...                   <i>應用程式程式碼</i>
    app.server.module.ts     <i>* 伺服器端應用程式模組</i>
server.ts                    <i>* Express Web 伺服器</i>
tsconfig.json                <i>TypeScript 基礎設定</i>
tsconfig.app.json            <i>TypeScript 瀏覽器應用程式設定</i>
tsconfig.server.json         <i>TypeScript 伺服器應用程式設定</i>
tsconfig.spec.json           <i>TypeScript 測試設定</i>
</code-example>

以 `*` 標記的檔案是新增的，不在原始教學範例中。

### Universal 實戰

若要在本機系統上開始使用 Universal 算繪你的應用程式，請使用下列指令。

<code-example language="bash">
npm run dev:ssr
</code-example>

開啟瀏覽器並前往 http://localhost:4200/。
你應該會看到熟悉的英雄之旅儀表板頁面。

使用 `routerLinks` 的導覽可以正常運作，因為它們使用內建的錨點（`<a>`）標籤。
你可以從儀表板前往英雄頁面再返回。
在儀表板頁面上點選一位英雄，即可顯示其詳細資料頁面。

如果你限制網路速度，讓用戶端指令碼需要更久的時間下載（說明如下），你會注意到：
* 你無法新增或刪除英雄。
* 儀表板頁面上的搜尋框沒有作用。
* 詳細資料頁面上的 *Back* 與 *Save* 按鈕沒有作用。

除了點按 `routerLink` 以外，使用者事件都不受支援。
你必須等候完整的用戶端應用程式啟動並執行，或使用像
[preboot](https://github.com/angular/preboot) 這類程式庫來緩衝這些事件，讓你在用戶端指令碼載入後重播這些事件。

從伺服器算繪的應用程式過渡到用戶端應用程式，在開發機器上發生得很快，但你應該一律在真實情境中測試應用程式。

你可以按照下列步驟模擬較慢的網路，以便更清楚地看到這個過渡：

1. 開啟 Chrome 開發人員工具並前往 Network 分頁。
1. 在選單列最右側找到 [Network Throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#throttling) 下拉式選單。
1. 試試其中一種「3G」速度。

伺服器算繪的應用程式仍會快速啟動，但完整的用戶端應用程式可能需要數秒才能載入。

{@a why-do-it}
## 為什麼使用伺服器端算繪？

建立應用程式的 Universal 版本有三個主要原因。

1. 透過[搜尋引擎最佳化（SEO）](https://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf)協助網路爬蟲
1. 改善行動裝置與低效能裝置上的效能
1. 透過[首次內容繪製（FCP）](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint)快速顯示第一頁

{@a seo}
{@a web-crawlers}
### 協助網路爬蟲（SEO）

Google、Bing、Facebook、Twitter 以及其他社群媒體網站仰賴網路爬蟲來索引你的應用程式內容，讓這些內容可以在網路上被搜尋。
這些網路爬蟲可能無法像人類使用者一樣，瀏覽並索引你高度互動的 Angular 應用程式。

Angular Universal 可以產生應用程式的靜態版本，不需要 JavaScript 也容易搜尋、連結與瀏覽。
Universal 也讓網站預覽成為可能，因為每個 URL 都會回傳完整算繪的頁面。

{@a no-javascript}
### 改善行動裝置與低效能裝置上的效能

有些裝置不支援 JavaScript，或執行 JavaScript 的效能太差，導致使用者體驗無法接受。
對於這些情況，你可能需要應用程式的伺服器算繪、無 JavaScript 版本。
這個版本雖然有限，但可能是那些原本完全無法使用應用程式的人唯一可行的替代方案。

{@a startup-performance}
### 快速顯示第一頁

快速顯示第一頁對使用者參與度可能至關重要。
載入速度較快的頁面表現較好，[即使差距小至 100ms](https://web.dev/shopping-for-speed-on-ebay/)也是如此。
你的應用程式可能必須更快啟動，才能在使用者決定轉而做其他事情之前吸引他們。

使用 Angular Universal，你可以為應用程式產生看起來像完整應用程式的到達頁面。
這些頁面是純 HTML，即使停用 JavaScript 也能顯示。
這些頁面不處理瀏覽器事件，但它們 _確實_ 支援透過 [`routerLink`](guide/router-reference#router-link) 在網站內導覽。

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

  **注意：** _任何_ Web 伺服器技術都可以提供 Universal 應用程式，只要它能呼叫 Universal 的 `renderModule()` 函式。
  這裡討論的原則與決策要點適用於任何 Web 伺服器技術。

</div>

Universal 應用程式使用 Angular `platform-server` 套件（而非 `platform-browser`），它提供 DOM、`XMLHttpRequest` 以及其他不依賴瀏覽器的低階功能的伺服器端實作。

伺服器（本指南範例中的 [Node.js Express](https://expressjs.com/)）會把應用程式頁面的用戶端請求傳遞給 NgUniversal 的 `ngExpressEngine`。在底層，它會呼叫 Universal 的 `renderModule()` 函式，同時提供快取與其他實用的工具。

`renderModule()` 函式接受一個 *範本* HTML 頁面（通常是 `index.html`）、一個包含元件的 Angular *模組*，以及一個決定要顯示哪些元件的 *路由* 作為輸入。
路由來自用戶端對伺服器的請求。

每個請求都會產生對應請求路由的適當檢視。
`renderModule()` 函式會在範本的 `<app>` 標籤內算繪該檢視，為用戶端建立完成的 HTML 頁面。

最後，伺服器會把算繪完成的頁面回傳給用戶端。

### 處理瀏覽器 API 的因應方式

由於 Universal 應用程式不在瀏覽器中執行，某些瀏覽器 API 與功能在伺服器上可能不存在。

例如，伺服器端應用程式無法參照僅限瀏覽器的全域物件，例如 `window`、`document`、`navigator` 或 `location`。

Angular 針對這些物件提供了一些可注入的抽象，例如 [`Location`](api/common/Location) 或 [`DOCUMENT`](api/common/DOCUMENT)；它們或許足以替代這些 API。
如果 Angular 沒有提供，你也可以撰寫新的抽象，在瀏覽器中委派給瀏覽器 API，在伺服器上則委派給替代實作（也稱為填補（shimming））。

同樣地，沒有滑鼠或鍵盤事件時，伺服器端應用程式無法仰賴使用者點選按鈕來顯示元件。
應用程式必須僅根據傳入的用戶端請求來決定要算繪的內容。
這正是讓應用程式[可路由](guide/router)的有力理由。

{@a universal-engine}
### Universal 範本引擎

`server.ts` 檔案中重要的一段是 `ngExpressEngine()` 函式。

<code-example path="universal/server.ts" header="server.ts" region="ngExpressEngine">
</code-example>

`ngExpressEngine()` 函式是 Universal 的 `renderModule()` 函式的包裝器，可將用戶端的請求轉換為伺服器算繪的 HTML 頁面。它接受一個具有下列屬性的物件：

* `bootstrap`：在伺服器上算繪時，用來啟動應用程式的根 `NgModule` 或 `NgModule` 工廠。以範例應用程式而言，它就是 `AppServerModule`。它是 Universal 伺服器端算繪器與 Angular 應用程式之間的橋樑。
* `extraProviders`：此屬性為選用，可讓你指定僅在伺服器上算繪應用程式時才適用的依賴提供者。當你的應用程式需要只能由目前執行的伺服器執行個體決定的資訊時，請使用此屬性。

`ngExpressEngine()` 函式會回傳一個解析為算繪完成頁面的 `Promise` 回呼。
由引擎決定如何處理該頁面。
此引擎的 `Promise` 回呼會把算繪完成的頁面回傳給 Web 伺服器，Web 伺服器再將其轉發給 HTTP 回應中的用戶端。

<div class="alert is-helpful">

  **注意：** 這些包裝器有助於隱藏 `renderModule()` 函式的複雜性。不同後端技術還有更多的包裝器，位於 [Universal 存放庫](https://github.com/angular/universal)。

</div>

### 篩選請求 URL

注意：使用 NgUniversal Express schematic 時，下面描述的基本行為會自動處理。這有助於理解底層行為，或在不使用 schematic 的情況下重現它。

Web 伺服器必須區分 _應用程式頁面請求_ 與其他種類的請求。

這不像攔截對根位址 `/` 的請求那麼簡單。
瀏覽器可能會請求其中一個應用程式路由，例如 `/dashboard`、`/heroes` 或 `/detail:12`。
事實上，如果應用程式僅由伺服器算繪，點選的 _每一個_ 應用程式連結都會以導覽 URL 的形式到達伺服器，供路由器使用。

幸好，應用程式路由有一個共同點：它們的 URL 沒有副檔名。
（資料請求也沒有副檔名，但可以認出它們，因為它們一律以 `/api` 開頭。）
所有靜態資產請求都有副檔名（例如 `main.js` 或 `/node_modules/zone.js/bundles/zone.umd.js`）。

由於你使用路由，你可以辨識這三種請求類型並以不同方式處理。

1. **資料請求**：以 `/api` 開頭的請求 URL。
1. **應用程式導覽**：沒有副檔名的請求 URL。
1. **靜態資產**：所有其他請求。

Node.js Express 伺服器是由中介軟體組成的管線，會逐一篩選與處理請求。
你可以使用 `server.get()` 呼叫來設定 Node.js Express 伺服器管線，例如下列針對資料請求的呼叫。

<code-example path="universal/server.ts" header="server.ts (data URL)" region="data-request"></code-example>

<div class="alert is-helpful">

  **注意：** 這個範例伺服器不處理資料請求。

  教學中的「in-memory web API」模組是一個示範與開發工具，它會攔截所有 HTTP 呼叫，並模擬遠端資料伺服器的行為。
  實際上，你會移除該模組，並在此處於伺服器上註冊你的 Web API 中介軟體。

</div>

下列程式碼會篩選沒有副檔名的請求 URL，並將其視為導覽請求。

<code-example path="universal/server.ts" header="server.ts (navigation)" region="navigation-request"></code-example>

### 安全地提供靜態檔案

單一的 `server.use()` 會把所有其他 URL 視為對 JavaScript、圖片與樣式檔案等靜態資產的請求。

為確保用戶端只能下載他們被允許查看的檔案，請把所有面向用戶端的資產檔案放在 `/dist` 資料夾中，並且只接受來自 `/dist` 資料夾的檔案請求。

下列 Node.js Express 程式碼會把所有剩餘請求路由到 `/dist`，如果找不到檔案，則回傳 `404 - NOT FOUND` 錯誤。

<code-example path="universal/server.ts" header="server.ts (static files)" region="static"></code-example>

### 在伺服器上為 HTTP（資料）請求使用絕對 URL

教學中的 `HeroService` 與 `HeroSearchService` 委派給 Angular `HttpClient` 模組來擷取應用程式資料。
這些服務會向 _相對_ URL（例如 `api/heroes`）發送請求。
在伺服器端算繪的應用程式中，HTTP URL 必須是 _絕對_ URL（例如 `https://my-server.com/api/heroes`）。
這表示 URL 在伺服器上執行時必須以某種方式轉換為絕對 URL，在瀏覽器中執行時則保持相對 URL。

如果你使用其中一個 `@nguniversal/*-engine` 套件（例如 `@nguniversal/express-engine`），這會自動幫你處理好。
你不需要做任何事就能讓相對 URL 在伺服器上運作。

如果基於某些原因，你沒有使用 `@nguniversal/*-engine` 套件，你可能需要自行處理。

建議的解決方案是將完整請求 URL 傳遞給 [renderModule()](api/platform-server/renderModule) 或 [renderModuleFactory()](api/platform-server/renderModuleFactory) 的 `options` 引數（取決於你使用哪一個在伺服器上算繪 `AppServerModule`）。
這個選項的侵入性最小，因為它不需要對應用程式做任何變更。
在這裡，「請求 URL」指的是應用程式在伺服器上算繪所要回應的那個請求的 URL。
例如，如果用戶端請求了 `https://my-server.com/dashboard`，而你正在伺服器上算繪應用程式來回應此請求，`options.url` 應設定為 `https://my-server.com/dashboard`。

如此一來，在伺服器上算繪應用程式期間發出的每一個 HTTP 請求，Angular 都能使用提供的 `options.url`，正確地將請求 URL 解析為絕對 URL。

### 實用的指令碼

- `npm run dev:ssr`

  此指令類似於提供開發期間即時重新載入的 [`ng serve`](cli/serve)，但使用伺服器端算繪。應用程式會以監看模式執行，並在每次變更後重新整理瀏覽器。
  此指令比實際的 `ng serve` 指令慢。

- `ng build && ng run app-name:server`

  此指令以正式模式同時建置伺服器指令碼與應用程式。當你想要建置專案以進行部署時，請使用此指令。

- `npm run serve:ssr`

  此指令啟動伺服器指令碼，以便在本機以伺服器端算繪提供應用程式。它會使用 `ng run build:ssr` 建立的建置產物，因此請確認你也已執行過該指令。

  請注意，`serve:ssr` 並非用於在正式環境中提供你的應用程式，僅用於在本機測試伺服器端算繪的應用程式。

- `npm run prerender`

  此指令碼可用於預渲染應用程式的頁面。
  進一步了解預渲染，請參閱[這裡](guide/prerendering)。
