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

## 伺服器路由

### 設定伺服器路由

你可以宣告一個由 [`ServerRoute`](api/ssr/ServerRoute 'API reference') 物件組成的陣列，來建立伺服器路由設定。這個設定通常放在名為 `app.routes.server.ts` 的檔案中。

```typescript {header: "app.routes.server.ts"}
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

```typescript {header: "app.config.server.ts"}
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {ApplicationConfig} from '@angular/core';
import {serverRoutes} from './app.routes.server';

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
import {ApplicationConfig} from '@angular/core';
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

| Rendering mode      | Description                                                                                                 |
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

```typescript {header: "app.routes.server.ts"}
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

### 自訂建置時預先渲染（SSG）

使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 時，你可以指定數個設定選項，來自訂預先渲染與提供的流程。

#### 參數化路由

對於每條使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 的路由，你可以指定一個 [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 函式。這個函式讓你控制哪些具體參數會產生各自獨立的預先渲染文件。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 函式會傳回一個 `Promise`，其解析結果是一個物件陣列。每個物件是路由參數名稱與值的鍵值對應。例如，如果你定義了像 `post/:id` 這樣的路由，`getPrerenderParams ` 可以傳回陣列 `[{id: '123'}, {id: '456'}]`，從而為 `post/123` 與 `post/456` 分別渲染文件。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 的主體可以使用 Angular 的 [`inject`](api/core/inject 'API reference') 函式來注入依賴，並執行任何用來決定要預先渲染哪些路由的工作。這通常包括發出請求來擷取資料，以建構參數值陣列。

你也可以將這個函式用於 catch-all 路由（例如 `/**`），其中參數名稱會是 `"**"`，傳回值會是路徑的區段，例如 `foo/bar`。這些可以與其他參數結合（例如 `/post/:id/**`），以處理更複雜的路由設定。

```ts {header: "app.routes.server.ts"}
import {RenderMode, ServerRoute} from '@angular/ssr';
import {inject} from '@angular/core';

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

```ts {header: "app.routes.server.ts"}
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
      return [{id: '1'}, {id: '2'}, {id: '3'}];
    },
  },
];
```

## 撰寫與伺服器相容的元件

某些常見的瀏覽器 API 與功能在伺服器上可能無法使用。應用程式無法使用 `window`、`document`、`navigator` 或 `location` 等瀏覽器專屬的全域物件，以及 `HTMLElement` 的某些屬性。

一般而言，依賴瀏覽器專屬符號的程式碼應該只在瀏覽器中執行，不要在伺服器上執行。這可以透過 `afterEveryRender` 與 `afterNextRender` 生命週期鉤子來強制達成。這些鉤子只在瀏覽器中執行，在伺服器上會被略過。

```angular-ts
import {Component, ElementRef, viewChild, afterNextRender} from '@angular/core';

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

## 提供平台專屬的實作

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

```ts {header: "app.config.ts"}
export const appConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: BrowserAnalyticsService}],
};
```

在你的伺服器設定中以伺服器端的實作覆寫：

```ts {header: "app.config.server.ts"}
const serverConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: ServerAnalyticsService}],
};
```

在你的元件中注入並使用該服務：

```ts
@Component(/* ... */)
export class Checkout {
  private analytics = inject(AnalyticsService);

  onAction() {
    this.analytics.trackEvent('action');
  }
}
```

## Accessing Document via DI

When working with server-side rendering, you should avoid directly referencing browser-specific globals like `document`. Instead, use the [`DOCUMENT`](api/core/DOCUMENT) token to access the document object in a platform-agnostic way.

```ts
import {inject, DOCUMENT, Service} from '@angular/core';

@Service()
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

HELPFUL: For managing meta tags, Angular provides the `Meta` service.

## Accessing Request and Response via DI

The `@angular/core` package provides several tokens for interacting with the server-side rendering environment. These tokens give you access to crucial information and objects within your Angular application during SSR.

- **[`REQUEST`](api/core/REQUEST 'API reference'):** Provides access to the current request object, which is of type [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) from the Web API. This allows you to access headers, cookies, and other request information.
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** Provides access to the response initialization options, which is of type [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters) from the Web API. This allows you to set headers and the status code for the response dynamically. Use this token to set headers or status codes that need to be determined at runtime.
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** Provides access to additional context related to the current request. This context can be passed as the second parameter of the [`handle`](api/ssr/AngularAppEngine#handle 'API reference') function. Typically, this is used to provide additional request-related information that is not part of the standard Web API.

```angular-ts
import {inject, REQUEST, Component} from '@angular/core';

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

IMPORTANT: The above tokens will be `null` in the following scenarios:<ul class="docs-list">
  <li>During the build processes.</li>
  <li>When the application is rendered in the browser (CSR).</li>
  <li>When performing static site generation (SSG).</li>
  <li>During route extraction in development (at the time of the request).</li>
</ul>

<!-- prettier-ignore-end -->

## Generate a fully static application

By default, Angular prerenders your entire application and generates a server file for handling requests. This allows your app to serve pre-rendered content to users. However, if you prefer a fully static site without a server, you can opt out of this behavior by setting the `outputMode` to `static` in your `angular.json` configuration file.

When `outputMode` is set to `static`, Angular generates pre-rendered HTML files for each route at build time, but it does not generate a server file or require a Node.js server to serve the app. This is useful for deploying to static hosting providers where a backend server is not needed.

To configure this, update your `angular.json` file as follows:

```json
{
  "projects": {
    "my-app": {
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

### Prerendered file output format

The `format` property of the `prerender` option controls the file structure Angular writes for each prerendered route. For a route with the path `about`:

| `format`              | Prerendered file   |
| --------------------- | ------------------ |
| `directory` (default) | `about/index.html` |
| `file`                | `about.html`       |

Depending on your static hosting provider, you can set `format` to `"file"` if your host requires `<route>.html` files to serve routes without redirecting to a trailing slash.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static",
            "prerender": {
              "format": "file"
            }
          }
        }
      }
    }
  }
}
```

NOTE: The `format` option is only considered when the build does not produce a server.

## Caching data when using HttpClient

`HttpClient` caches outgoing network requests when running on the server. This information is serialized and transferred to the browser as part of the initial HTML sent from the server. In the browser, `HttpClient` checks whether it has data in the cache and if so, reuses it instead of making a new HTTP request during initial application rendering. `HttpClient` stops using the cache once an application becomes [stable](api/core/ApplicationRef#isStable) while running in a browser.

### Configuring the response body size limit

When `HttpClient` uses the default fetch backend during server-side rendering, Angular limits each response body to 1 MB. This limit prevents the server from buffering unexpectedly large responses during rendering. If a response exceeds the configured limit, the request fails with the [NG02825](errors/NG02825) error.

If your application needs to fetch larger responses during server rendering, set `maxResponseBodySize` in the `provideServerRendering` options:

```ts
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {ApplicationConfig} from '@angular/core';
import {serverRoutes} from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      {
        maxResponseBodySize: 5 * 1024 * 1024, // 5MB
      },
      withRoutes(serverRoutes),
    ),
  ],
};
```

`maxResponseBodySize` is configured in bytes and applies globally to server-side `HttpClient` requests that use the fetch backend.

IMPORTANT: Keep this limit as small as your application allows. Increasing it lets server-side requests buffer larger response bodies, which can increase memory use and denial-of-service risk. Prefer moving large downloads outside server rendering.

CRITICAL: During SSR, the Fetch implementation reads the entire response body to verify `integrity` before returning a response, as required by the [Fetch Standard](https://fetch.spec.whatwg.org/#concept-main-fetch). Angular enforces [`maxResponseBodySize`](/guide/ssr#configuring-the-response-body-size-limit) only after Fetch returns a response, so this limit does not constrain the data buffered during integrity verification.

### Configuring the caching options

You can customize how Angular caches HTTP responses during server‑side rendering (SSR) and reuses them during hydration by configuring `HttpTransferCacheOptions`.  
This configuration is provided globally using `withHttpTransferCacheOptions` inside `provideClientHydration()`.

By default, `HttpClient` caches all `HEAD` and `GET` requests which don't contain `Authorization`, `Proxy-Authorization`, or `Cookie` headers and are not sent with `withCredentials` or Fetch API `credentials` modes that can send credentials. Angular also skips transfer cache when a request or response includes `Cache-Control` directives that forbid caching (`no-store`, `no-cache`, or `private`), or when the Fetch API `cache` option is set to `no-store` or `no-cache`. Responses that carry a `Set-Cookie` header are also skipped. You can override the request filtering settings by using `withHttpTransferCacheOptions` in the hydration configuration.

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
        includeHeaders: ['ETag', 'Cache-Control'],
        filter: (req) => !req.url.includes('/api/profile'),
        includePostRequests: true,
        includeRequestsWithAuthHeaders: false,
      }),
    ),
  ],
});
```

### `includeHeaders`

Specifies which headers from the server response should be included in cached entries.  
No headers are included by default.

```ts
withHttpTransferCacheOptions({
  includeHeaders: ['ETag', 'Cache-Control'],
});
```

IMPORTANT: Avoid including sensitive headers like authentication tokens. These can leak user‑specific data between requests.

Including `Cache-Control` in `includeHeaders` only makes that header available on the hydrated response. Angular already evaluates `Cache-Control` headers automatically when deciding whether a request or response is eligible for transfer cache.

### `includePostRequests`

By default, only `GET` and `HEAD` requests are cached.  
You can enable caching for `POST` requests when they are used as read operations such as GraphQL queries.

```ts
withHttpTransferCacheOptions({
  includePostRequests: true,
});
```

Use this only when `POST` requests are **idempotent** and safe to reuse between server and client renders.

### `includeRequestsWithAuthHeaders`

Determines whether requests containing `Authorization`, `Proxy‑Authorization`, or `Cookie` headers are eligible for caching.  
By default, these are excluded to prevent caching user‑specific responses.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithAuthHeaders: true,
});
```

Enable only when authentication headers do **not** affect the response content (for example, public tokens for analytics APIs).

### `includeRequestsWithCredentials`

Determines whether requests sent using `withCredentials` or Fetch API `credentials` modes (`include` or `same-origin`) are eligible for caching.  
By default, these are excluded to prevent caching user‑specific responses.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithCredentials: true,
});
```

Enable only when credentialed requests return responses that are safe to cache.

### `includeNonCacheableRequests`

Determines whether requests and responses containing `Cache-Control` directives that forbid caching (`no-store`, `no-cache`, or `private`), responses with a `Set-Cookie` header, or requests using Fetch API `cache` options (`no-store` or `no-cache`), are eligible for caching.  
By default, these are excluded to respect HTTP caching controls.

```ts
withHttpTransferCacheOptions({
  includeNonCacheableRequests: true,
});
```

Enable only when you need to bypass cache-control restrictions for transfer caching.

### Per‑request overrides

You can override caching behavior for a specific request using the `transferCache` request option.

```ts
// Include specific headers for this request
http.get('/api/profile', {transferCache: {includeHeaders: ['CustomHeader']}});
```

### Disabling caching

You can disable HTTP caching of requests sent from the server either globally or individually.

#### Globally

To disable caching for all requests in your application, use the `withNoHttpTransferCache` feature:

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

#### Filtering

You can also selectively disable caching for certain requests using the [`filter`](api/common/http/HttpTransferCacheOptions) option in `withHttpTransferCacheOptions`. For example, you can disable caching for a specific API endpoint:

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

Use this option to exclude endpoints with user‑specific or dynamic data (for example `/api/profile`).

#### Per-request

To disable caching for an individual request, you can specify the [`transferCache`](api/common/http/HttpRequest#transferCache) option in an `HttpRequest`.

```ts
httpClient.get('/api/sensitive-data', {transferCache: false});
```

`HttpTransferCache` does not cache requests or responses that explicitly opt out of caching. Angular skips transfer cache entries when a request includes a `Cache-Control` header with `no-store`, `no-cache`, or `private`, or when the request uses the Fetch API `cache` option set to `no-store` or `no-cache`. Responses with `Cache-Control: no-store`, `Cache-Control: no-cache`, or `Cache-Control: private` are also not stored in the transfer cache. Responses that include a `Set-Cookie` header are likewise not stored, as they typically carry user-specific state.

NOTE: If your application uses different HTTP origins to make API calls on the server and on the client, the `HTTP_TRANSFER_CACHE_ORIGIN_MAP` token allows you to establish a mapping between those origins, so that `HttpTransferCache` feature can recognize those requests as the same ones and reuse the data cached on the server during hydration on the client.

## Configuring a server

### Node.js

The `@angular/ssr/node` extends `@angular/ssr` specifically for Node.js environments. It provides APIs that make it easier to implement server-side rendering within your Node.js application. For a complete list of functions and usage examples, refer to the [`@angular/ssr/node` API reference](api/ssr/node/AngularNodeAppEngine) API reference.

```ts {header: "server.ts"}
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use((req, res, next) => {
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

The `@angular/ssr` provides essential APIs for server-side rendering your Angular application on platforms other than Node.js. It leverages the standard [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects from the Web API, enabling you to integrate Angular SSR into various server environments. For detailed information and examples, refer to the [`@angular/ssr` API reference](api/ssr/AngularAppEngine).

```ts {header: "server.ts"}
import {AngularAppEngine, createRequestHandler} from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response | null = await angularApp.handle(req);

  // ...
});
```

## Security

For detailed information on preventing Server-Side Request Forgery (SSRF) and configuring allowed hosts, see the [Server-side security](best-practices/security#preventing-server-side-request-forgery-ssrf) guide.
