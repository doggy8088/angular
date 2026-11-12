# 使用 Angular Universal 進行伺服器端算繪 (SSR)

本指南說明 **Angular Universal**，這是一種讓 Angular 在伺服器上算繪應用程式的技術。

預設情況下，Angular 只會在*瀏覽器*中算繪應用程式。Angular Universal 讓 Angular 在*伺服器*上算繪應用程式，產生代表應用程式狀態的*靜態* HTML 內容。HTML 內容在瀏覽器中算繪完成後，Angular 會啟動應用程式，並重複使用伺服器產生的 HTML 中可用的資訊。

使用伺服器端算繪時，應用程式在瀏覽器中通常算繪得更快，讓使用者有機會在應用程式完全可互動之前先看到應用程式的使用者介面。更多資訊請參閱下方[「為什麼使用伺服器端算繪？」](#why-do-it)一節。

如需更深入了解 SSR 相關的不同技術與概念，請參閱這篇[文章](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)。

你可以使用如下所述的 `@nguniversal/express-engine` 套件，在 Angular 應用程式中啟用伺服器端算繪。

<div class="alert is-helpful">

Angular Universal 需要 [active LTS 或 maintenance LTS](https://nodejs.org/about/releases) 版本的 Node.js。
相關資訊請參閱[版本相容性](guide/versions)指南，以了解目前支援的版本。

</div>

<a id="the-example"></a>

## Universal 教學

[英雄之旅教學](tutorial/tour-of-heroes)是本逐步解說的基礎。

在本範例中，Angular CLI 會使用[預先編譯 (AOT) 編譯器](guide/aot-compiler)編譯並打包應用程式的 Universal 版本。
Node.js Express Web 伺服器會根據用戶端請求，使用 Universal 編譯 HTML 頁面。

<div class="alert is-helpful">

<live-example downloadOnly>Download the finished sample code</live-example>，其執行於 [Node.js® Express](https://expressjs.com) 伺服器中。

</div>

### 步驟 1. 啟用伺服器端算繪

執行下列指令，將 SSR 支援加入你的應用程式：

<code-example format="shell" language="shell">

ng add &commat;nguniversal/express-engine

</code-example>

此指令會更新應用程式程式碼以啟用 SSR，並在專案結構中加入額外檔案（以 `*` 符號標記的檔案）。

<div class='filetree'>
    <div class='file'>
        src
    </div>
    <div class='children'>
        <div class='file'>
          index.html &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- 應用程式網頁
        </div>
        <div class='file'>
          main.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- 用戶端應用程式的啟動器
        </div>
        <div class='file'>
          main.server.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- &ast; 伺服器端應用程式的啟動器
        </div>
        <div class='file'>
          style.css &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- 應用程式的樣式
        </div>
        <div class='file'>
          app/ &nbsp;&hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- 應用程式程式碼
        </div>
        <div class='children'>
            <div class='file'>
              app.config.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- 用戶端應用程式設定（僅限獨立式應用程式）
            </div>
            <div class='file'>
              app.module.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- 用戶端應用程式模組（僅限 NgModule 應用程式）
            </div>
        </div>
        <div class='children'>
            <div class='file'>
              app.config.server.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- &ast; 伺服器端應用程式設定（僅限獨立式應用程式）
            </div>
            <div class='file'>
              app.module.server.ts &nbsp;&nbsp;&nbsp; // &lt;-- &ast; 伺服器端應用程式模組（僅限 NgModule 應用程式）
            </div>
        </div>
        <div class='file'>
          server.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- &ast; Express Web 伺服器
        </div>
        <div class='file'>
          tsconfig.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript 基礎設定
        </div>
        <div class='file'>
          tsconfig.app.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript 瀏覽器應用程式設定
        </div>
        <div class='file'>
          tsconfig.server.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript 伺服器應用程式設定
        </div>
        <div class='file'>
          tsconfig.spec.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript 測試設定
        </div>
    </div>
</div>

### 步驟 2. 啟用用戶端水合

<div class="alert is-important">

水合功能目前為[開發人員預覽](/guide/releases#開發者預覽)版。歡迎你試用，但在正式穩定之前可能會有所變更。

</div>

水合是將伺服器端算繪的應用程式在用戶端還原的流程。這包括重複使用伺服器算繪的 DOM 結構、保留應用程式狀態、傳輸伺服器已經擷取的應用程式資料，以及其他流程。如需進一步了解水合，請參閱[這份指南](guide/hydration)。

你可以更新 `app.module.ts` 檔案來啟用水合。從 `@angular/platform-browser` 匯入 `provideClientHydration` 函式，並如下所示將該函式呼叫加入 `AppModule` 的 `providers` 區段。

```typescript
import {provideClientHydration} from '@angular/platform-browser';
// ...

@NgModule({
  // ...
  providers: [ provideClientHydration() ],  // add this line
  bootstrap: [ AppComponent ]
})
export class AppModule {
  // ...
}
```

### 步驟 3. 啟動伺服器

若要在本機系統上開始使用 Universal 算繪你的應用程式，請使用下列指令。

<code-example format="shell" language="shell">

npm run dev:ssr

</code-example>

### 步驟 4. 在瀏覽器中執行你的應用程式

Web 伺服器啟動後，請開啟瀏覽器並前往 `http://localhost:4200`。
你應該會看到熟悉的英雄之旅儀表板頁面。

使用 `routerLinks` 的導覽可以正常運作，因為它們使用內建的錨點（`<a>`）元素。
你可以從儀表板前往英雄頁面再返回。
在儀表板頁面上點選一位英雄，即可顯示其詳細資料頁面。

如果你限制網路速度，讓用戶端指令碼需要更久的時間下載（說明如下），你會注意到：

*   你無法新增或刪除英雄
*   儀表板頁面上的搜尋框沒有作用
*   詳細資料頁面上的*返回*與*儲存*按鈕沒有作用

從伺服器算繪的應用程式過渡到用戶端應用程式，在開發機器上發生得很快，但你應該一律在真實情境中測試應用程式。

你可以按照下列步驟模擬較慢的網路，以便更清楚地看到這個過渡：

1.  開啟 Chrome 開發人員工具並前往 Network 分頁。
1.  在選單列最右側找到 [Network Throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#throttling) 下拉式選單。
1.  試試其中一種「3G」速度。

伺服器算繪的應用程式仍會快速啟動，但完整的用戶端應用程式可能需要數秒才能載入。

<a id="why-do-it"></a>

## 為什麼使用伺服器端算繪？

建立應用程式的 Universal 版本有三個主要原因。

*   透過[搜尋引擎最佳化 (SEO)](https://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf)協助網路爬蟲
*   改善行動裝置與低效能裝置上的效能
*   透過[首次內容繪製 (FCP)](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint)快速顯示第一頁

<a id="seo"></a>
<a id="web-crawlers"></a>

### 協助網路爬蟲 (SEO)

Google、Bing、Facebook、Twitter 以及其他社群媒體網站仰賴網路爬蟲來索引你的應用程式內容，讓這些內容可以在網路上被搜尋。
這些網路爬蟲可能無法像人類使用者一樣，瀏覽並索引你高度互動的 Angular 應用程式。

Angular Universal 可以產生應用程式的靜態版本，不需要 JavaScript 也容易搜尋、連結與瀏覽。
Universal 也讓網站預覽成為可能，因為每個 URL 都會回傳完整算繪的頁面。

<a id="no-javascript"></a>

### 改善行動裝置與低效能裝置上的效能

有些裝置不支援 JavaScript，或執行 JavaScript 的效能太差，導致使用者體驗無法接受。
對於這些情況，你可能需要應用程式的伺服器算繪、無 JavaScript 版本。
這個版本雖然有限，但可能是那些原本完全無法使用應用程式的人唯一可行的替代方案。

<a id="startup-performance"></a>

### 快速顯示第一頁

快速顯示第一頁對使用者參與度可能至關重要。
載入速度較快的頁面表現較好，[即使差距小至 100ms](https://web.dev/shopping-for-speed-on-ebay)也是如此。
你的應用程式可能必須更快啟動，才能在使用者決定轉而做其他事情之前吸引他們。

使用 Angular Universal，你可以為應用程式產生看起來像完整應用程式的到達頁面。
這些頁面是純 HTML，即使停用 JavaScript 也能顯示。
這些頁面不處理瀏覽器事件，但它們*確實*支援透過 [`routerLink`](guide/router-reference#router-link) 在網站內導覽。

實際上，你會提供到達頁面的靜態版本來留住使用者的注意力。
同時，你會在背後載入完整的 Angular 應用程式。
使用者會感覺到達頁面的效能近乎即時，並在完整應用程式載入後獲得完整的互動體驗。

<a id="how-does-it-work"></a>

## Universal Web 伺服器

Universal Web 伺服器會以 [Universal 範本引擎](#universal-engine)算繪的靜態 HTML 回應應用程式頁面請求。
伺服器接收並回應來自用戶端（通常是瀏覽器）的 HTTP 請求，並提供指令碼、CSS 與圖片等靜態資產。
它也可能回應資料請求，直接回應或以代理方式轉發到另一個資料伺服器。

本指南的範例 Web 伺服器以熱門的 [Express](https://expressjs.com) 框架為基礎。

<div class="alert is-helpful">

**NOTE**: <br />
*任何* Web 伺服器技術都可以提供 Universal 應用程式，只要它能呼叫 Angular `platform-server` 套件的 [`renderModule`](api/platform-server/renderModule) 或 [`renderApplication`](api/platform-server/renderApplication) 函式。
這裡討論的原則與決策要點適用於任何 Web 伺服器技術。

</div>

Universal 應用程式使用 Angular `platform-server` 套件（而非 `platform-browser`），它提供 DOM、`XMLHttpRequest` 以及其他不依賴瀏覽器的低階功能的伺服器端實作。

伺服器（本指南範例中的 [Node.js Express](https://expressjs.com)）會把應用程式頁面的用戶端請求傳遞給 NgUniversal 的 `ngExpressEngine`。
在底層，引擎會算繪應用程式，同時提供快取與其他實用的工具。

算繪函式接受一個*範本* HTML 頁面（通常是 `index.html`）與一個包含元件的 Angular *模組*作為輸入。或者，它也可以接受一個函式，該函式在被呼叫時回傳一個解析為 `ApplicationRef` 的 `Promise`，以及一個決定要顯示哪些元件的*路由*。路由來自用戶端對伺服器的請求。

每個請求都會產生對應請求路由的適當檢視。
算繪函式會在範本的 `<app>` 標籤內算繪該檢視，為用戶端建立完成的 HTML 頁面。

最後，伺服器會把算繪完成的頁面回傳給用戶端。

<a id="caching-data-when-using-httpclient"></a>
### 使用 HttpClient 時快取資料
預設情況下，[`provideClientHydration()`](api/platform-browser/provideClientHydration) 函式會啟用建議的功能組合，為大多數應用程式提供最佳效能。其中包括下列功能：
* 協調 DOM 水合（進一步了解請參閱[這裡](guide/hydration)）。
* 在伺服器上執行時快取 [`HttpClient`](api/common/http/HttpClient) 回應，並將此快取傳輸到用戶端，以避免額外的 HTTP 請求。

在伺服器上執行時，[`HttpClient`](api/common/http/HttpClient) 會對每一個 `HEAD` 與 `GET` 請求進行資料快取。之後，這些資訊會被序列化，並作為伺服器端算繪後從伺服器送出的初始 HTML 的一部分傳輸到瀏覽器。在瀏覽器中，[`HttpClient`](api/common/http/HttpClient) 會檢查快取中是否有資料，若有，就會重複使用它，而不在應用程式初始算繪期間發出新的 HTTP 請求。一旦應用程式在瀏覽器中執行並變得[穩定](api/core/ApplicationRef#isStable)，HttpClient 就會停止使用快取。

### 處理瀏覽器 API 的因應方式

由於 Universal 應用程式不在瀏覽器中執行，某些瀏覽器 API 與功能在伺服器上可能不存在。

例如，伺服器端應用程式無法參照僅限瀏覽器的全域物件，例如 `window`、`document`、`navigator` 或 `location`。

Angular 針對這些物件提供了一些可注入的抽象，例如 [`Location`](api/common/Location) 或 [`DOCUMENT`](api/common/DOCUMENT)；它們或許足以替代這些 API。
如果 Angular 沒有提供，你也可以撰寫新的抽象，在瀏覽器中委派給瀏覽器 API，在伺服器上則委派給替代實作（也稱為填補 (shimming)）。

同樣地，沒有滑鼠或鍵盤事件時，伺服器端應用程式無法仰賴使用者點選按鈕來顯示元件。
應用程式必須僅根據傳入的用戶端請求來決定要算繪的內容。
這正是讓應用程式[可路由](guide/router)的有力理由。

<a id="service-worker"></a>
### Universal 與 Angular Service Worker

如果你將 Universal 與 Angular service worker 搭配使用，其行為會與一般的伺服器端算繪行為有所不同。初始的伺服器請求會如預期在伺服器上算繪。然而，在該初始請求之後，後續請求都由 service worker 處理。對於後續請求，`index.html` 檔案會以靜態方式提供，而略過伺服器端算繪。

<a id="universal-engine"></a>

### Universal 範本引擎

`server.ts` 檔案中重要的一段是 `ngExpressEngine()` 函式。

<code-example header="server.ts" path="universal/server.ts" region="ngExpressEngine"></code-example>

`ngExpressEngine()` 函式是 Angular `platform-server` 套件 [`renderModule`](api/platform-server/renderModule) 與 [`renderApplication`](api/platform-server/renderApplication) 函式的包裝器，可將用戶端的請求轉換為伺服器算繪的 HTML 頁面。

它接受一個具有下列屬性的物件：

| 屬性           | 詳細說明 |
|:---            |:---     |
| `bootstrap`      | 應用程式在伺服器上算繪時，根 `NgModule` 或在被呼叫時回傳一個解析為 `ApplicationRef` 的 `Promise` 的函式。以範例應用程式而言，它就是 `AppServerModule`。它是 Universal 伺服器端算繪器與 Angular 應用程式之間的橋樑。 |
| `extraProviders` | 此屬性為選用，可讓你指定僅在伺服器上算繪應用程式時才適用的依賴提供者。當你的應用程式需要只能由目前執行的伺服器執行個體決定的資訊時，請使用此屬性。       |

`ngExpressEngine()` 函式會回傳一個解析為算繪完成頁面的 `Promise` 回呼。
由引擎決定如何處理該頁面。
此引擎的 `Promise` 回呼會把算繪完成的頁面回傳給 Web 伺服器，Web 伺服器再將其轉發給 HTTP 回應中的用戶端。

### 篩選請求 URL

<div class="alert is-helpful">

**NOTE**: <br />
使用 NgUniversal Express 套件時，下面描述的基本行為會自動處理。
這有助於理解底層行為，或在不使用該套件的情況下重現它。

</div>

Web 伺服器必須區分*應用程式頁面請求*與其他種類的請求。

這不像攔截對根位址 `/` 的請求那麼簡單。
瀏覽器可能會請求其中一個應用程式路由，例如 `/dashboard`、`/heroes` 或 `/detail:12`。
事實上，如果應用程式僅由伺服器算繪，點選的*每一個*應用程式連結都會以導覽 URL 的形式到達伺服器，供路由器使用。

幸好，應用程式路由有一個共同點：它們的 URL 沒有副檔名。
（資料請求也沒有副檔名，但可以認出它們，因為它們一律以 `/api` 開頭。）
所有靜態資產請求都有副檔名（例如 `main.js` 或 `/node_modules/zone.js/bundles/zone.umd.js`）。

由於你使用路由，你可以辨識這三種請求類型並以不同方式處理。

| 路由請求類型 | 詳細說明 |
|:---                   |:---     |
| 資料請求          | 以 `/api` 開頭的請求 URL     |
| 應用程式導覽        | 沒有副檔名的請求 URL |
| 靜態資產          | 所有其他請求                 |

Node.js Express 伺服器是由中介軟體組成的管線，會逐一篩選與處理請求。
你可以使用 `server.get()` 呼叫來設定 Node.js Express 伺服器管線，例如下列針對資料請求的呼叫：

<code-example header="server.ts (data URL)" path="universal/server.ts" region="data-request"></code-example>

<div class="alert is-helpful">

**NOTE**: <br />
這個範例伺服器不處理資料請求。

教學中的「in-memory web API」模組是一個示範與開發工具，它會攔截所有 HTTP 呼叫，並模擬遠端資料伺服器的行為。
實際上，你會移除該模組，並在此處於伺服器上註冊你的 Web API 中介軟體。

</div>

下列程式碼會篩選沒有副檔名的請求 URL，並將其視為導覽請求：

<code-example header="server.ts (navigation)" path="universal/server.ts" region="navigation-request"></code-example>

### 安全地提供靜態檔案

單一的 `server.use()` 會把所有其他 URL 視為對 JavaScript、圖片與樣式檔案等靜態資產的請求。

為確保用戶端只能下載他們被允許查看的檔案，請把所有面向用戶端的資產檔案放在 `/dist` 資料夾中，並且只接受來自 `/dist` 資料夾的檔案請求。

下列 Node.js Express 程式碼會把所有剩餘請求路由到 `/dist`，如果找不到檔案，則回傳 `404 - NOT FOUND` 錯誤。

<code-example header="server.ts (static files)" path="universal/server.ts" region="static"></code-example>

### 在伺服器上為 HTTP（資料）請求使用絕對 URL

教學中的 `HeroService` 與 `HeroSearchService` 委派給 Angular `HttpClient` 模組來擷取應用程式資料。
這些服務會向*相對* URL（例如 `api/heroes`）發送請求。
在伺服器端算繪的應用程式中，HTTP URL 必須是*絕對* URL（例如 `https://my-server.com/api/heroes`）。
這表示 URL 在伺服器上執行時必須以某種方式轉換為絕對 URL，在瀏覽器中執行時則保持相對 URL。

如果你使用其中一個 `@nguniversal/*-engine` 套件（例如 `@nguniversal/express-engine`），這會自動幫你處理好。
你不需要做任何事就能讓相對 URL 在伺服器上運作。

如果基於某些原因，你沒有使用 `@nguniversal/*-engine` 套件，你可能需要自行處理。

建議的解決方案是將完整請求 URL 傳遞給 [renderModule](api/platform-server/renderModule) 的 `options` 引數。
這個選項的侵入性最小，因為它不需要對應用程式做任何變更。
在這裡，「請求 URL」指的是應用程式在伺服器上算繪所要回應的那個請求的 URL。
例如，如果用戶端請求了 `https://my-server.com/dashboard`，而你正在伺服器上算繪應用程式來回應此請求，`options.url` 應設定為 `https://my-server.com/dashboard`。

如此一來，在伺服器上算繪應用程式期間發出的每一個 HTTP 請求，Angular 都能使用提供的 `options.url`，正確地將請求 URL 解析為絕對 URL。

### 實用的指令碼

| 指令碼                                                                                                    | 詳細說明 |
|:---                                                                                                        |:---     |
| <code-example format="shell" language="shell"> npm run dev:ssr </code-example>                            | 類似於提供開發期間即時重新載入的 [`ng serve`](cli/serve)，但使用伺服器端算繪。應用程式會以監看模式執行，並在每次變更後重新整理瀏覽器。此指令比實際的 `ng serve` 指令慢。                                                                                                                                                  |
| <code-example format="shell" language="shell"> ng build &amp;&amp; ng run app-name:server </code-example> | 以正式模式同時建置伺服器指令碼與應用程式。當你想要建置專案以進行部署時，請使用此指令。                                                                                                                                                                                                                                                                     |
| <code-example format="shell" language="shell"> npm run serve:ssr </code-example>                          | 啟動伺服器指令碼，以便在本機以伺服器端算繪提供應用程式。它會使用 `npm run build:ssr` 建立的建置產物，因此請確認你也已執行過該指令。 <div class="alert is-helpful"> **NOTE**: <br /> `serve:ssr` 並非用於在正式環境中提供你的應用程式，僅用於在本機測試伺服器端算繪的應用程式。 </div> |
| <code-example format="shell" language="shell"> npm run prerender </code-example>                          | 用於預渲染應用程式的頁面。進一步了解預渲染，請參閱[這裡](guide/prerendering)。                                                                                                                                                                                                                                                                                                            |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-06-21
