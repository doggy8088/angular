# Server-side rendering

伺服器端渲染 (SSR) 是在伺服器上呈現頁面的過程，會產生包含初始頁面狀態的初始 HTML 內容。HTML 內容傳送至瀏覽器後，Angular 會初始化應用程式並使用 HTML 中包含的資料。

## 為什麼要使用 SSR?

SSR 與用戶端渲染 (CSR) 相比的主要優勢有：

- **改善效能**：SSR 可以藉由將完全呈現的 HTML 傳遞給用戶端來改善網路應用程式的效能，瀏覽器可以在下載應用程式 JavaScript 之前就解析和顯示它。這對頻寬較低或使用行動裝置的用戶來說特別有益。
- **改善核心網路指標**：SSR 會帶來效能改善，可以用 [核心網路指標 (CWV)](https://web.dev/learn-core-web-vitals/) 統計數據來衡量，例如縮短首次內容繪製 ([FCP](https://developer.chrome.com/en/docs/lighthouse/performance/first-contentful-paint/)) 和最大內容繪製 ([LCP](https://web.dev/lcp/)) 時間，以及累計版面配置變更 ([CLS](https://web.dev/cls/))。
- **更好的 SEO**：SSR 可以改善網路應用程式的搜尋引擎最佳化 (SEO)，讓搜尋引擎更容易抓取並索引應用程式的內容。

## 啟用伺服器端呈現

建立具有 SSR 的**新**專案，請執行：

<docs-code language="shell">

ng new --ssr

</docs-code>

若要將 SSR 新增至**現有**專案，請使用 Angular CLI `ng add` 指令。

<docs-code language="shell">

ng add @angular/ssr

</docs-code>

這些指令會建立並更新應用程式程式碼以啟用 SSR，並將額外檔案加入專案結構。

<docs-code language="text">

my-app
|-- server.ts                       # application server
└── src
    |-- app
    |   └── app.config.server.ts    # server application configuration
    └── main.server.ts              # main server application bootstrapping

</docs-code>

若要驗證應用程式是伺服器端呈示的，請使用 `ng serve` 在本地端執行它。初始 HTML 要求應包含應用程式內容。

## 設定伺服器端渲染

`server.ts` 檔案設定了 Node.js Express 伺服器和 Angular 伺服器端渲染。`CommonEngine` 用於渲染 Angular 應用程式。

<docs-code path="adev/src/content/examples/ssr/server.ts" visibleLines="[31,45]"></docs-code>

`CommonEngine` 的 `render` 方法接受一個具有下列屬性的物件：

| 屬性           | 詳細資訊                                                                                   | 預設值 |
| ------------------- | ---------------------------------------------------------------------------------------- | ------------- |
| `bootstrap`         | 一種方法，可以傳回 `NgModule` 或承諾解析為 `ApplicationRef`。                     |               |
| `providers`         | 目前要求的平臺層級提供者陣列。                                                           |               |
| `url`               | 要呈現的頁面網址。                                                                       |               |
| `inlineCriticalCss` | 是否要透過內嵌關鍵 CSS 來減少阻礙呈現的請求。                                   | `true`        |
| `publicPath`        | 瀏覽器檔案和資產的基本路徑。                                                         |               |
| `document`          | 用於引導伺服器應用程式的初始 DOM。                                                     |               |
| `documentFilePath`  | 用於引導伺服器應用程式的初始 DOM 的檔案路徑。                                       |               |

Angular CLI 將會建立一個專注於伺服器端渲染你的 Angular 應用程式的初始伺服器實作。此伺服器可以擴充以支援其他功能，例如 API 路由、重新導向、靜態資源等等。請參閱 [Express 文件](https://expressjs.com/) 以了解更多詳細資訊。

## 水合作用

水合作用是將伺服器端呈現的應用程式還原至用戶端上的程序。這包括重用伺服器呈現的 DOM 結構、保留應用程式狀態、傳輸伺服器已擷取的應用程式資料以及其他程序。當你使用 SSR 時，水合作用會預設啟用。你可以在 [水合作用指南](guide/hydration) 中找到更多資訊。

## 使用 HttpClient 時快取資料

在伺服器上執行時，[`HttpClient`](api/common/http/HttpClient) 會快取傳出的網路要求。此資訊會序列化並作為從伺服器傳送的初始 HTML 的一部分傳送到瀏覽器。在瀏覽器中，`HttpClient` 會檢查快取中是否有資料，如果有，則會在初始應用程式呈示期間重複使用它，而不是建立新的 HTTP 要求。`HttpClient` 在應用程式在瀏覽器中執行時變得 [穩定](api/core/ApplicationRef#isStable) 後，便會停止使用快取。

`HttpClient` 預設會快取所有 `HEAD` 和 `GET` 要求。您可以在提供水合時，使用 [`withHttpTransferCacheOptions`](/api/platform-browser/withHttpTransferCacheOptions) 來設定快取。

<docs-code language="typescript">

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true
    }))
  ]
});

</docs-code>

## 撰寫伺服器相容元件

伺服器上可能無法使用某些常見的瀏覽器 API 和功能。應用程式無法使用特定瀏覽器提供的全域物件，例如 `window`、`document`、`navigator` 或 `location`，也無法使用 `HTMLElement` 的某些屬性。

一般而言，依賴瀏覽器特定符號的程式碼應該只在瀏覽器執行，而非伺服器上。這可透過 [`afterRender`](api/core/afterRender) 和 [`afterNextRender`](api/core/afterNextRender) 生命週期掛鉤來執行。這些掛鉤只在瀏覽器上執行，並在伺服器上略過。

<docs-code language="typescript">

import { Component, ViewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  @ViewChild('content') contentRef: ElementRef;

constructor() {
    afterNextRender(() => {
      // Safe to check `scrollHeight` because this will only run in the browser, not the server.
      console.log('content height: ' + this.contentRef.nativeElement.scrollHeight);
    });
  }
}

</docs-code>

## 使用 Angular 服務工作器

html
<script>
  // 註冊服務工作器。
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
</script>

如果您在伺服器上使用 Angular 並搭配 Angular 服務工作者，行為會偏離正常的伺服器端呈現行為。初始伺服器要求會如預期般在伺服器上呈現。然而，在那次初始要求之後，後續要求會由服務工作者處理，並始終在用戶端呈現。
