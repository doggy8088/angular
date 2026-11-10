# 伺服器端與混合渲染

Angular 預設將所有應用程式以用戶端渲染（CSR）的方式交付。雖然這種做法的初始負載較輕量，但它帶來一些取捨，包括載入時間較慢、效能指標較差，以及資源需求較高，因為大部分運算都由使用者的裝置執行。因此，許多應用程式透過將伺服器端渲染（SSR）納入混合渲染策略，獲得了顯著的效能提升。

## 什麼是混合渲染？

混合渲染讓開發者能善用伺服器端渲染（SSR）、預先渲染（也稱為「靜態網站生成」或 SSG）與用戶端渲染（CSR）的優點，來最佳化你的 Angular 應用程式。它讓你能細緻地控制應用程式不同部分的渲染方式，為使用者提供最佳體驗。

## 設定混合渲染

你可以在使用 Angular CLI 的 `ng new` 指令時加上伺服器端渲染旗標（即 `--ssr`），來建立一個採用混合渲染的**新**專案：

```shell
ng new --ssr
```

你也可以用 `ng add` 指令為既有專案加入伺服器端渲染，來啟用混合渲染：

```shell
ng add @angular/ssr
```

NOTE: 預設情況下，Angular 會預先渲染你的整個應用程式，並產生一個伺服器檔案。若要停用此行為並建立完全靜態的應用程式，請將 `outputMode` 設為 `static`。若要啟用 SSR，請更新伺服器路由以使用 `RenderMode.Server`。詳情請參閱 [`Server routing`](#server-routing) 與 [`Generate a fully static application`](#generate-a-fully-static-application)。

## 伺服器路由 {#server-routing}

### 設定伺服器路由

你可以宣告一個由 [`ServerRoute`](api/ssr/ServerRoute 'API reference') 物件組成的陣列，來建立伺服器路由設定。這個設定通常放在名為 `app.routes.server.ts` 的檔案中。

```typescript
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },
];
```

你可以使用 [`withRoutes`](api/ssr/withRoutes 'API reference') 函式，透過 [`provideServerRendering`](api/ssr/provideServerRendering 'API reference') 將這個設定加入你的應用程式：

```typescript
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {serverRoutes} from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ... other providers ...
  ],
};
```

使用 [App shell 模式](ecosystem/service-workers/app-shell)時，你必須指定用來作為用戶端渲染路由 app shell 的元件。要做到這一點，請使用 [`withAppShell`](api/ssr/withAppShell 'API reference') 功能：

```typescript
import {provideServerRendering, withRoutes, withAppShell} from '@angular/ssr';
import {AppShell} from './app-shell';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes), withAppShell(AppShell)),
    // ... other providers ...
  ],
};
```

### 渲染模式

伺服器路由設定讓你可以透過設定 [`RenderMode`](api/ssr/RenderMode 'API reference')，來指定應用程式中每條路由應該如何渲染：

| Rendering mode      | 說明                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Server (SSR)**    | 針對每個請求在伺服器上渲染應用程式，並將內容完整的 HTML 頁面傳送給瀏覽器。 |
| **Client (CSR)**    | 在瀏覽器中渲染應用程式。這是 Angular 的預設行為。                               |
| **Prerender (SSG)** | 在建置時預先渲染應用程式，為每條路由產生靜態 HTML 檔案。                      |

#### 選擇渲染模式

每種渲染模式都有不同的優點與缺點。你可以依應用程式的具體需求選擇渲染模式。

##### 用戶端渲染（CSR）

用戶端渲染的開發模型最簡單，因為你可以假設程式碼總是在網頁瀏覽器中執行來撰寫它。這讓你能使用各種同樣假設自己在瀏覽器中執行的用戶端函式庫。

用戶端渲染的效能通常比其他渲染模式差，因為它必須先下載、解析並執行頁面的 JavaScript，使用者才能看到任何渲染出的內容。如果你的頁面在渲染時還要從伺服器擷取更多資料，使用者還必須等待這些額外請求完成，才能看到完整內容。

如果你的頁面會被搜尋爬蟲建立索引，用戶端渲染可能對搜尋引擎最佳化（SEO）產生負面影響，因為搜尋爬蟲在索引頁面時能執行的 JavaScript 量有其限制。

採用用戶端渲染時，伺服器除了提供靜態 JavaScript 資源外，不需要做任何渲染頁面的工作。如果伺服器成本是考量因素，你可以將這一點納入評估。

支援可安裝、離線體驗並搭配 [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 的應用程式，可以仰賴用戶端渲染，而不需要與伺服器通訊。

##### 伺服器端渲染（SSR）

伺服器端渲染的頁面載入速度比用戶端渲染快。伺服器在收到瀏覽器的請求後會直接渲染 HTML 文件，不需要等待 JavaScript 下載並執行。使用者只需經歷伺服器擷取資料並渲染所請求頁面所需的延遲。這種模式也省去了瀏覽器發出額外網路請求的需要，因為你的程式碼可以在伺服器上渲染時擷取資料。

伺服器端渲染通常有出色的搜尋引擎最佳化（SEO）表現，因為搜尋爬蟲收到的是完整渲染的 HTML 文件。

伺服器端渲染要求你撰寫不嚴格依賴瀏覽器 API 的程式碼，也限制了你對那些假設自己在瀏覽器中執行的 JavaScript 函式庫的選擇。

採用伺服器端渲染時，你的伺服器會為每個請求執行 Angular 來產生 HTML 回應，這可能增加伺服器託管成本。

##### 建置時預先渲染

預先渲染的頁面載入速度比用戶端渲染和伺服器端渲染都快。因為預先渲染是在_建置時_建立 HTML 文件，伺服器可以直接以靜態 HTML 文件回應請求，不需要任何額外工作。

預先渲染要求渲染頁面所需的所有資訊在_建置時_都已備齊。這表示預先渲染的頁面不能包含針對載入頁面的特定使用者的任何資料。預先渲染主要適用於對應用程式所有使用者都相同的頁面。

因為預先渲染發生在建置時，它可能大幅增加正式建置的時間。使用 [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 產生大量 HTML 文件，可能影響部署的總檔案大小，進而導致部署變慢。

預先渲染通常有出色的搜尋引擎最佳化（SEO）表現，因為搜尋爬蟲收到的是完整渲染的 HTML 文件。

預先渲染要求你撰寫不嚴格依賴瀏覽器 API 的程式碼，也限制了你對那些假設自己在瀏覽器中執行的 JavaScript 函式庫的選擇。

預先渲染對每個伺服器請求產生的額外負擔極低，因為你的伺服器是以靜態 HTML 文件回應。靜態檔案也很容易被內容傳遞網路（CDN）、瀏覽器與中間快取層快取，讓後續的頁面載入更快。完全靜態的網站也可以僅透過 CDN 或靜態檔案伺服器部署，不需要為你的應用程式維護自訂的伺服器執行環境。這能將工作從應用程式的 Web 伺服器卸載，從而提升可擴展性，對高流量應用程式特別有益。

NOTE: 使用 Angular service worker 時，第一個請求由伺服器渲染，但後續所有請求都由 service worker 處理並在用戶端渲染。

### 設定標頭與狀態碼

你可以使用 `ServerRoute` 設定中的 `headers` 與 `status` 屬性，為個別伺服器路由設定自訂標頭與狀態碼。

```typescript
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... other routes
];
```

### 重新導向

對於路由設定中以 [`redirectTo`](api/router/Route#redirectTo 'API reference') 屬性指定的重新導向，Angular 在伺服器端的處理方式有所不同。

**伺服器端渲染（SSR）**
重新導向是在伺服器端渲染過程中，使用標準的 HTTP 重新導向（例如 301、302）來執行。

**預先渲染（SSG）**
重新導向是以「軟重新導向」的方式實作，在預先渲染的 HTML 中使用 [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#refresh) 標籤。

### 自訂建置時預先渲染（SSG） {#customizing-build-time-prerendering-ssg}

使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 時，你可以指定數個設定選項，來自訂預先渲染與提供的流程。

#### 參數化路由

對於每條使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 的路由，你可以指定一個 [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 函式。這個函式讓你控制哪些具體參數會產生各自獨立的預先渲染文件。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 函式會傳回一個 `Promise`，其解析結果是一個物件陣列。每個物件是路由參數名稱與值的鍵值對應。例如，如果你定義了像 `post/:id` 這樣的路由，`getPrerenderParams ` 可以傳回陣列 `[{id: 123}, {id: 456}]`，從而為 `post/123` 與 `post/456` 分別渲染文件。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 的主體可以使用 Angular 的 [`inject`](api/core/inject 'API reference') 函式來注入依賴，並執行任何用來決定要預先渲染哪些路由的工作。這通常包括發出請求來擷取資料，以建構參數值陣列。

你也可以將這個函式用於 catch-all 路由（例如 `/**`），其中參數名稱會是 `"**"`，傳回值會是路徑的區段，例如 `foo/bar`。這些可以與其他參數結合（例如 `/post/:id/**`），以處理更複雜的路由設定。

```ts
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assuming this returns ['1', '2', '3']

      return ids.map((id) => ({id})); // Generates paths like: /post/1, /post/2, /post/3
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        {id: '1', '**': 'foo/3'},
        {id: '2', '**': 'bar/4'},
      ]; // Generates paths like: /post/1/foo/3, /post/2/bar/4
    },
  },
];
```

由於 [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 專門適用於 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')，這個函式總是在_建置時_執行。`getPrerenderParams` 不得依賴任何瀏覽器專屬或伺服器專屬的 API 來取得資料。

IMPORTANT: 在 `getPrerenderParams` 內使用 [`inject`](api/core/inject 'API reference') 時，請記住 `inject` 必須以同步方式使用。它不能在非同步回呼中、或在任何 `await` 陳述式之後被呼叫。更多資訊請參閱 `runInInjectionContext`。

#### 後備策略

使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 模式時，你可以指定一個後備策略，來處理尚未預先渲染之路徑的請求。

可用的後備策略有：

- **Server**：後備為伺服器端渲染。如果沒有指定 `fallback` 屬性，這就是**預設**行為。
- **Client**：後備為用戶端渲染。
- **None**：不做後備。Angular 不會處理未預先渲染之路徑的請求。

```ts
// app.routes.server.ts
import {RenderMode, PrerenderFallback, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Fallback to CSR if not prerendered
    async getPrerenderParams() {
      // This function returns an array of objects representing prerendered posts at the paths:
      // `/post/1`, `/post/2`, and `/post/3`.
      // The path `/post/4` will utilize the fallback behavior if it's requested.
      return [{id: 1}, {id: 2}, {id: 3}];
    },
  },
];
```

## 撰寫與伺服器相容的元件 {#authoring-server-compatible-components}

某些常見的瀏覽器 API 與功能在伺服器上可能無法使用。應用程式無法使用 `window`、`document`、`navigator` 或 `location` 等瀏覽器專屬的全域物件，以及 `HTMLElement` 的某些屬性。

一般而言，依賴瀏覽器專屬符號的程式碼應該只在瀏覽器中執行，不要在伺服器上執行。這可以透過 `afterEveryRender` 與 `afterNextRender` 生命週期鉤子來強制達成。這些鉤子只在瀏覽器中執行，在伺服器上會被略過。

```angular-ts
import {Component, viewChild, afterNextRender} from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  contentRef = viewChild.required<ElementRef>('content');

  constructor() {
    afterNextRender(() => {
      // Safe to check `scrollHeight` because this will only run in the browser, not the server.
      console.log('content height: ' + this.contentRef().nativeElement.scrollHeight);
    });
  }
}
```

NOTE: 請優先使用[平台專屬的提供者](guide/ssr#providing-platform-specific-implementations)，而不是以 `isPlatformBrowser` 或 `isPlatformServer` 做執行階段檢查。

IMPORTANT: 避免在範本中使用 `isPlatformBrowser` 搭配 `@if` 或其他條件式，來在伺服器與用戶端渲染不同內容。這會造成水合不一致與版面位移，對使用者體驗與 [Core Web Vitals](https://web.dev/learn-core-web-vitals/) 產生負面影響。請改用 `afterNextRender` 進行瀏覽器專屬的初始化，並讓渲染出的內容在各平台上保持一致。

## 在伺服器上設定提供者

在伺服器端，頂層提供者的值會在應用程式程式碼初次解析與求值時設定一次。
這表示以 `useValue` 設定的提供者會在多個請求之間保持其值，直到伺服器應用程式重新啟動為止。

如果你想為每個請求產生新值，請使用帶有 `useFactory` 的工廠提供者。工廠函式會為每個傳入的請求執行，確保每次都建立新值並指派給該 token。

## 提供平台專屬的實作 {#providing-platform-specific-implementations}

當你的應用程式在瀏覽器與伺服器上需要不同行為時，請為每個平台提供分開的服務實作。這種做法能把平台邏輯集中在專屬的服務中。

```ts
export abstract class AnalyticsService {
  abstract trackEvent(name: string): void;
}
```

建立瀏覽器端的實作：

```ts
@Injectable()
export class BrowserAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Sends the event to the browser-based third-party analytics provider
  }
}
```

建立伺服器端的實作：

```ts
@Injectable()
export class ServerAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Records the event on the server
  }
}
```

在你的主應用程式設定中註冊瀏覽器端的實作：

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: BrowserAnalyticsService}],
};
```

在你的伺服器設定中以伺服器端的實作覆寫：

```ts
// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: ServerAnalyticsService}],
};
```

在你的元件中注入並使用該服務：

```ts
@Component({
  /*...*/
})
export class Checkout {
  private analytics = inject(AnalyticsService);

  onAction() {
    this.analytics.trackEvent('action');
  }
}
```

## 透過 DI 存取 Document {#accessing-document-via-di}

在使用伺服器端渲染時，你應該避免直接參考 `document` 等瀏覽器專屬的全域變數。請改用 [`DOCUMENT`](api/core/DOCUMENT) token，以與平台無關的方式存取 document 物件。

```ts
import {Injectable, inject, DOCUMENT} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CanonicalLinkService {
  private readonly document = inject(DOCUMENT);

  // During server rendering, inject a <link rel="canonical"> tag
  // so the generated HTML includes the correct canonical URL
  setCanonical(href: string): void {
    const link = this.document.createElement('link');
    link.rel = 'canonical';
    link.href = href;
    this.document.head.appendChild(link);
  }
}
```

HELPFUL: 對於管理 meta 標籤，Angular 提供了 `Meta` 服務。

## 透過 DI 存取 Request 與 Response {#accessing-request-and-response-via-di}

`@angular/core` 套件提供數個用來與伺服器端渲染環境互動的 token。這些 token 讓你在 SSR 期間能存取 Angular 應用程式中的關鍵資訊與物件。

- **[`REQUEST`](api/core/REQUEST 'API reference')**：提供對目前請求物件的存取，該物件的型別是 Web API 的 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)。這讓你能存取標頭、cookies 與其他請求資訊。
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference')**：提供對回應初始化選項的存取，該選項的型別是 Web API 的 [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters)。這讓你能動態設定回應的標頭與狀態碼。當標頭或狀態碼需要在執行階段決定時，請使用這個 token。
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference')**：提供對目前請求相關額外上下文的存取。這個上下文可以作為 [`handle`](api/ssr/AngularAppEngine#handle 'API reference') 函式的第二個參數傳入。通常用來提供不屬於標準 Web API 的額外請求相關資訊。

```angular-ts
import {inject, REQUEST} from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}
```

<!-- UL is used below as otherwise the list will not be include as part of the note. -->
<!-- prettier-ignore-start -->

IMPORTANT: 上述 token 在以下情境中會是 `null`：<ul class="docs-list">
  <li>在建置過程中。</li>
  <li>當應用程式在瀏覽器中渲染（CSR）時。</li>
  <li>執行靜態網站生成（SSG）時。</li>
  <li>在開發期間的路由擷取過程中（於請求當下）。</li>
</ul>

<!-- prettier-ignore-end -->

## 產生完全靜態的應用程式 {#generate-a-fully-static-application}

預設情況下，Angular 會預先渲染你的整個應用程式，並產生一個用來處理請求的伺服器檔案。這讓你的應用程式能把預先渲染好的內容提供給使用者。然而，如果你偏好沒有伺服器的完全靜態網站，可以在 `angular.json` 設定檔中將 `outputMode` 設為 `static`，來退出這個行為。

當 `outputMode` 設為 `static` 時，Angular 會在建置時為每條路由產生預先渲染的 HTML 檔案，但不會產生伺服器檔案，也不需要 Node.js 伺服器來提供應用程式。這在部署到不需要後端伺服器的靜態託管服務時很有用。

要進行此設定，請如下更新你的 `angular.json` 檔案：

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

## 使用 HttpClient 時快取資料 {#caching-data-when-using-httpclient}

`HttpClient` 在伺服器上執行時會快取對外發出的網路請求。這些資訊會被序列化，並作為伺服器傳送的初始 HTML 的一部分傳給瀏覽器。在瀏覽器中，`HttpClient` 會檢查快取中是否有資料，若有，就在應用程式初始渲染期間重用它，而不發出新的 HTTP 請求。一旦應用程式在瀏覽器中執行時變得[穩定](api/core/ApplicationRef#isStable)，`HttpClient` 就會停止使用快取。

### 設定快取選項 {#configuring-the-caching-options}

你可以透過設定 `HttpTransferCacheOptions`，來自訂 Angular 在伺服器端渲染（SSR）期間如何快取 HTTP 回應，以及在水合期間如何重用它們。  
這個設定是透過在 `provideClientHydration()` 內使用 `withHttpTransferCacheOptions` 全域提供的。

預設情況下，`HttpClient` 會快取所有不含 `Authorization`、`Proxy-Authorization` 或 `Cookie` 標頭、且不是以可傳送憑證的 `withCredentials` 或 Fetch API `credentials` 模式送出的 `HEAD` 與 `GET` 請求。當請求或回應包含禁止快取的 `Cache-Control` 指令（`no-store`、`no-cache` 或 `private`），或 Fetch API 的 `cache` 選項設為 `no-store` 或 `no-cache` 時，Angular 也會跳過傳輸快取。帶有 `Set-Cookie` 標頭的回應同樣會被跳過。你可以在水合設定中使用 `withHttpTransferCacheOptions` 來覆寫請求篩選設定。

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includeHeaders: ['ETag', 'Cache-Control'],
        filter: (req) => !req.url.includes('/api/profile'),
        includePostRequests: true,
        includeRequestsWithAuthHeaders: false,
      }),
    ),
  ],
});
```

---

### `includeHeaders`

指定伺服器回應中哪些標頭應該包含在快取項目裡。  
預設不包含任何標頭。

```ts
withHttpTransferCacheOptions({
  includeHeaders: ['ETag', 'Cache-Control'],
});
```

IMPORTANT: 避免包含驗證 token 等敏感標頭。這些標頭可能會在請求之間洩漏使用者專屬資料。

在 `includeHeaders` 中包含 `Cache-Control`，只是讓該標頭能在水合後的回應上使用。Angular 在決定請求或回應是否符合傳輸快取資格時，本來就會自動評估 `Cache-Control` 標頭。

---

### `includePostRequests`

預設情況下，只有 `GET` 與 `HEAD` 請求會被快取。  
當 `POST` 請求被用作讀取操作（例如 GraphQL 查詢）時，你可以為它們啟用快取。

```ts
withHttpTransferCacheOptions({
  includePostRequests: true,
});
```

只有當 `POST` 請求具**冪等性**，且在伺服器與用戶端渲染之間重用是安全的，才使用此設定。

---

### `includeRequestsWithAuthHeaders`

決定包含 `Authorization`、`Proxy-Authorization` 或 `Cookie` 標頭的請求是否符合快取資格。  
預設情況下，這些請求會被排除，以防止快取使用者專屬的回應。以 `withCredentials` 送出，或 Fetch API `credentials` 設為 `include` 或 `same-origin` 的請求，預設也會被排除。

```ts
withHttpTransferCacheOptions({
  includeRequestsWithAuthHeaders: true,
});
```

只有當驗證標頭**不**影響回應內容時（例如分析 API 的公開 token），才啟用此設定。

### 個別請求的覆寫

你可以使用 `transferCache` 請求選項，為特定請求覆寫快取行為。

```ts
// Include specific headers for this request
http.get('/api/profile', {transferCache: {includeHeaders: ['CustomHeader']}});
```

### 停用快取 {#disabling-caching}

你可以全域或個別停用從伺服器送出之請求的 HTTP 快取。

#### 全域停用

若要停用應用程式中所有請求的快取，請使用 `withNoHttpTransferCache` 功能：

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withNoHttpTransferCache,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoHttpTransferCache())],
});
```

#### 篩選

你也可以使用 `withHttpTransferCacheOptions` 中的 [`filter`](api/common/http/HttpTransferCacheOptions) 選項，選擇性地停用某些請求的快取。例如，你可以停用特定 API 端點的快取：

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        filter: (req) => !req.url.includes('/api/sensitive-data'),
      }),
    ),
  ],
});
```

使用這個選項來排除帶有使用者專屬或動態資料的端點（例如 `/api/profile`）。

#### 個別請求

若要停用個別請求的快取，你可以在 `HttpRequest` 中指定 [`transferCache`](api/common/http/HttpRequest#transferCache) 選項。

```ts
httpClient.get('/api/sensitive-data', {transferCache: false});
```

`HttpTransferCache` 不會快取明確選擇退出快取的請求或回應。當請求包含值為 `no-store`、`no-cache` 或 `private` 的 `Cache-Control` 標頭，或請求使用設為 `no-store` 或 `no-cache` 的 Fetch API `cache` 選項時，Angular 會跳過傳輸快取項目。帶有 `Cache-Control: no-store`、`Cache-Control: no-cache` 或 `Cache-Control: private` 的回應也不會存入傳輸快取。包含 `Set-Cookie` 標頭的回應同樣不會被儲存，因為它們通常帶有使用者專屬的狀態。

NOTE: 如果你的應用程式在伺服器與用戶端使用不同的 HTTP 來源來呼叫 API，`HTTP_TRANSFER_CACHE_ORIGIN_MAP` token 讓你能在這些來源之間建立對應，使 `HttpTransferCache` 功能能將這些請求識別為相同的請求，並在用戶端水合期間重用伺服器上快取的資料。

## 設定伺服器

### Node.js

`@angular/ssr/node` 是專為 Node.js 環境擴充 `@angular/ssr` 的套件。它提供的 API 讓你在 Node.js 應用程式中實作伺服器端渲染更容易。完整的函式清單與使用範例，請參閱 [`@angular/ssr/node` API 參考](api/ssr/node/AngularNodeAppEngine)。

```ts
// server.ts
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // Pass control to the next middleware
      }
    })
    .catch(next);
});

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
```

### Non-Node.js

`@angular/ssr` 提供在 Node.js 以外的平台上為你的 Angular 應用程式進行伺服器端渲染所需的核心 API。它利用 Web API 中標準的 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 與 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) 物件，讓你能將 Angular SSR 整合到各種伺服器環境中。詳細資訊與範例，請參閱 [`@angular/ssr` API 參考](api/ssr/AngularAppEngine)。

```ts
// server.ts
import {AngularAppEngine, createRequestHandler} from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response | null = await angularApp.render(req);

  // ...
});
```

## 安全性

關於防止伺服器端請求偽造（SSRF）與設定允許主機的詳細資訊，請參閱[伺服器端安全性](best-practices/security#preventing-server-side-request-forgery-ssrf)指南。
