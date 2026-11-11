# 伺服器端算繪

伺服器端算繪 (SSR) 是在伺服器上算繪頁面的流程，產生的初始 HTML 內容包含頁面的初始狀態。HTML 內容送達瀏覽器後，Angular 會初始化應用程式，並運用 HTML 中包含的資料。

## 為什麼使用 SSR？

與用戶端算繪 (CSR) 相比，SSR 的主要優勢包括：

- **改善效能：** SSR 將完整算繪的 HTML 交付給用戶端，瀏覽器甚至在下載應用程式的 JavaScript 之前就能解析並顯示，藉此改善 Web 應用程式的效能。這對低頻寬連線或行動裝置上的使用者特別有幫助。
- **改善 Core Web Vitals：** SSR 帶來的效能提升可以用 [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/) 統計資料來衡量，例如降低首次內容繪製 ([FCP](https://developer.chrome.com/en/docs/lighthouse/performance/first-contentful-paint/)) 與最大內容繪製 ([LCP](https://web.dev/lcp/))，以及累計版面位移 ([CLS](https://web.dev/cls/))。
- **更好的 SEO：** SSR 讓搜尋引擎更容易爬取並索引應用程式的內容，藉此改善 Web 應用程式的搜尋引擎最佳化 (SEO)。

## 啟用伺服器端算繪

若要建立啟用 SSR 的**新**專案，請執行：

<docs-code language="shell">

ng new --ssr

</docs-code>

若要為**既有**專案加入 SSR，請使用 Angular CLI 的 `ng add` 指令。

<docs-code language="shell">

ng add @angular/ssr

</docs-code>

這些指令會建立並更新應用程式程式碼以啟用 SSR，並在專案結構中加入額外檔案。

<docs-code language="text">

my-app
|-- server.ts                       # application server
└── src
    |-- app
    |   └── app.config.server.ts    # server application configuration
    └── main.server.ts              # main server application bootstrapping

</docs-code>

若要驗證應用程式已進行伺服器端算繪，請用 `ng serve` 在本機執行它。初始的 HTML 請求應該包含應用程式內容。

## 設定伺服器端算繪

`server.ts` 檔案設定了 Node.js Express 伺服器與 Angular 伺服器端算繪。`CommonEngine` 用來算繪 Angular 應用程式。

<docs-code path="adev/src/content/examples/ssr/server.ts" visibleLines="[31,45]"></docs-code>

`CommonEngine` 的 `render` 方法接受具有下列屬性的物件：

| 屬性                | 詳細說明                                              | 預設值 |
| ------------------- | ----------------------------------------------------- | ------ |
| `bootstrap`         | 回傳 `NgModule` 或解析為 `ApplicationRef` 的 promise 的方法。 |        |
| `providers`         | 目前請求的平台層級提供者陣列。                        |        |
| `url`               | 要算繪的頁面 URL。                                    |        |
| `inlineCriticalCss` | 是否透過行內化關鍵 CSS 來減少阻擋算繪的請求。         | `true` |
| `publicPath`        | 瀏覽器檔案與資產的基底路徑。                          |        |
| `document`          | 用於啟動伺服器應用程式的初始 DOM。                    |        |
| `documentFilePath`  | 用於啟動伺服器應用程式的初始 DOM 檔案路徑。           |        |

Angular CLI 會先產生一個初始的伺服器實作，專注於對你的 Angular 應用程式進行伺服器端算繪。這個伺服器可以擴充以支援 API 路由、重新導向、靜態資產等其他功能。詳情請參閱 [Express 文件](https://expressjs.com/)。

## 水合

水合是將伺服器端算繪的應用程式在用戶端還原的流程。這包括重複使用伺服器算繪的 DOM 結構、保留應用程式狀態、傳輸伺服器已經擷取的應用程式資料，以及其他流程。只要使用 SSR，水合預設就會啟用。你可以在[水合指南](guide/hydration)中找到更多資訊。

## 使用 HttpClient 時快取資料 {#caching-data-when-using-httpclient}

[`HttpClient`](api/common/http/HttpClient) 在伺服器上執行時，會快取向外送出的網路請求。這些資訊會被序列化，並作為伺服器送出的初始 HTML 的一部分傳輸到瀏覽器。在瀏覽器中，`HttpClient` 會檢查快取中是否有資料，若有，就會重複使用它，而不在應用程式初始算繪期間發出新的 HTTP 請求。當應用程式在瀏覽器中執行並變得[穩定](api/core/ApplicationRef#isStable)後，`HttpClient` 就會停止使用快取。

`HttpClient` 依預設會快取所有 `HEAD` 與 `GET` 請求。你可以在提供水合功能時，使用 [`withHttpTransferCacheOptions`](/api/platform-browser/withHttpTransferCacheOptions) 設定快取。

<docs-code language="typescript">

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true
    }))
  ]
});

</docs-code>

## 撰寫與伺服器相容的元件 {#authoring-server-compatible-components}

某些常見的瀏覽器 API 與功能在伺服器上可能無法使用。應用程式無法使用 `window`、`document`、`navigator` 或 `location` 等瀏覽器專屬的全域物件，以及 `HTMLElement` 的某些屬性。

一般而言，依賴瀏覽器專屬符號的程式碼應該只在瀏覽器中執行，而不是在伺服器上。這可以透過 [`afterRender`](api/core/afterRender) 與 [`afterNextRender`](api/core/afterNextRender) 生命週期鉤子來強制執行。這些鉤子只在瀏覽器上執行，在伺服器上會被跳過。

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

## 使用 Angular Service Worker

如果你在伺服器上使用 Angular 並搭配 Angular service worker，其行為會與一般的伺服器端算繪行為有所不同。初始的伺服器請求會如預期在伺服器上算繪。然而，在該初始請求之後，後續請求都由 service worker 處理，且一律在用戶端算繪。
