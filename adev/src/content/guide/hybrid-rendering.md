# 混合渲染

## 什麼是混合渲染？

混合渲染結合了伺服器端渲染（SSR）、預先渲染（也稱為「靜態網站生成」或 SSG）與用戶端渲染（CSR）的優點，來最佳化你的 Angular 應用程式。它讓你能以不同的策略渲染應用程式的不同部分，讓你對應用程式如何交付給使用者有細緻的控制。

Angular 新的**開發者預覽**伺服器渲染 API，為建構現代 Web 應用程式提供了更有效率、更具彈性的做法。這些 API 讓你能完全掌控應用程式的渲染，從而進行能提升效能、搜尋引擎最佳化（SEO）與整體使用者體驗的最佳化。

**這些新 API 的優點：**

- **更大的彈性**：
  - 運用對渲染的細緻控制，針對應用程式的不同部分，為效能與使用者體驗進行最佳化。
  - 為每條路由選擇最佳的渲染策略，無論是為快速初始載入時間而用伺服器端渲染、為動態互動性而用用戶端渲染，還是混合的做法。
- **內建國際化（i18n）**：
  - 透過開箱即用的 i18n 支援，輕鬆讓你的應用程式適應不同的語言與地區。
- **與執行環境無關**：
  - 在任何 JavaScript 執行環境中使用這些 API，不限於 Node.js。
  - 無論你的技術堆疊為何，都能享受強化渲染能力帶來的好處。
- **無縫整合開發伺服器**：
  - 透過完全整合的開發伺服器，享受流暢且有效率的開發體驗。

這個開發者預覽讓你能搶先一睹這些強大的新功能。Angular 團隊鼓勵你親自探索，並提供意見回饋，協助形塑 Angular 伺服器渲染的未來。

## 設定混合渲染

你可以使用 Angular CLI 建立一個帶有伺服器端路由的**新**專案：

```shell
ng new --ssr --server-routing
```

你也可以使用 `ng add` 指令，為現有專案加入伺服器端路由：

```shell
ng add @angular/ssr --server-routing
```

## 伺服器路由 {#server-routing}

### 設定伺服器路由

你可以宣告一個由 [`ServerRoute`](api/ssr/ServerRoute 'API reference') 物件組成的陣列，來建立伺服器路由設定。這個設定通常放在名為 `app.routes.server.ts` 的檔案中。

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

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

你可以使用 [`provideServerRouting`](api/ssr/provideServerRouting 'API reference') 函式，將這個設定加入你的應用程式。

```typescript
import { provideServerRouting } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    // ... other providers ...
  ]
};
```

使用 [App shell 模式](ecosystem/service-workers/app-shell)時，你必須指定要作為用戶端渲染路由 app shell 的路由。要做到這一點，請提供一個帶有 `appShellRoute` 屬性的選項物件給 [`provideServerRouting`](api/ssr/provideServerRouting 'API reference')：

```typescript
import { provideServerRouting, withAppShell } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRouting(serverRoutes, withAppShell(AppShellComponent)),
    // ... other providers ...
  ]
};
```

### 渲染模式

伺服器路由設定讓你可以透過設定 [`RenderMode`](api/ssr/RenderMode 'API reference')，來指定應用程式中每條路由應該如何渲染：

| Rendering mode      | 說明                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Server (SSR)**    | 針對每個請求在伺服器上渲染應用程式，並將內容完整的 HTML 頁面傳送給瀏覽器。詳情請見[伺服器端渲染（SSR）指南](guide/ssr)。 |
| **Client (CSR)**    | 在瀏覽器中渲染應用程式。這是 Angular 的預設行為。                               |
| **Prerender (SSG)** | 在建置時預先渲染應用程式，為每條路由產生靜態 HTML 檔案。詳情請見[預先渲染指南](guide/prerendering)。                      |

#### 選擇渲染模式

每種渲染模式都有不同的優點與缺點。你可以依應用程式的具體需求選擇渲染模式。

##### 用戶端渲染

用戶端渲染的開發模型最簡單，因為你可以假設程式碼總是在網頁瀏覽器中執行來撰寫它。這讓你能使用各種同樣假設自己在瀏覽器中執行的用戶端函式庫。

用戶端渲染的效能通常比其他渲染模式差，因為它必須先下載、解析並執行頁面的 JavaScript，使用者才能看到任何渲染出的內容。如果你的頁面在渲染時還要從伺服器擷取更多資料，使用者還必須等待這些額外請求完成，才能看到完整內容。

如果你的頁面會被搜尋爬蟲建立索引，用戶端渲染可能對搜尋引擎最佳化（SEO）產生負面影響，因為搜尋爬蟲在索引頁面時能執行的 JavaScript 量有其限制。

採用用戶端渲染時，伺服器除了提供靜態 JavaScript 資源外，不需要做任何渲染頁面的工作。如果伺服器成本是考量因素，你可以將這一點納入評估。

支援可安裝、離線體驗並搭配 [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 的應用程式，可以仰賴用戶端渲染，而不需要與伺服器通訊。

##### 伺服器端渲染

伺服器端渲染的頁面載入速度比用戶端渲染快。伺服器在收到瀏覽器的請求後會直接渲染 HTML 文件，不需要等待 JavaScript 下載並執行。使用者只需經歷伺服器擷取資料並渲染所請求頁面所需的延遲。這種模式也省去了瀏覽器發出額外網路請求的需要，因為你的程式碼可以在伺服器上渲染時擷取資料。

伺服器端渲染通常有出色的搜尋引擎最佳化（SEO）表現，因為搜尋爬蟲收到的是完整渲染的 HTML 文件。

伺服器端渲染要求你撰寫不嚴格依賴瀏覽器 API 的程式碼，也限制了你對那些假設自己在瀏覽器中執行的 JavaScript 函式庫的選擇。

採用伺服器端渲染時，你的伺服器會為每個請求執行 Angular 來產生 HTML 回應。這筆額外的成本可能影響伺服器託管成本。

##### 建置時預先渲染

預先渲染的頁面載入速度比用戶端渲染和伺服器端渲染都快。因為預先渲染是在_建置時_建立 HTML 文件，伺服器可以直接以靜態 HTML 文件回應請求，不需要任何額外工作。

預先渲染要求渲染頁面所需的所有資訊在_建置時_都已備齊。這表示預先渲染的頁面不能包含針對載入頁面的特定使用者的任何資料。這也表示，預先渲染主要適用於對應用程式所有使用者都相同的頁面。

因為預先渲染發生在建置時，它可能大幅增加正式建置的時間。使用 [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 產生大量 HTML 文件，可能影響部署的總檔案大小，進而導致部署變慢。

它也可能依建置產出中包含的靜態 HTML 文件數量，增加部署所需的時間。

預先渲染通常有出色的搜尋引擎最佳化（SEO）表現，因為搜尋爬蟲收到的是完整渲染的 HTML 文件。

預先渲染要求你撰寫不嚴格依賴瀏覽器 API 的程式碼，也限制了你對那些假設自己在瀏覽器中執行的 JavaScript 函式庫的選擇。

預先渲染對每個伺服器請求產生的額外負擔極低，因為你的伺服器是以靜態 HTML 文件回應。靜態檔案也很容易被內容傳遞網路（CDN）、瀏覽器與中間快取層快取，讓後續的頁面載入更快。將靜態 HTML 檔案部署到 CDN，能把工作從你的應用程式 Web 伺服器卸載，從而提升可擴展性，對高流量應用程式影響尤為顯著。

### 設定標頭與狀態碼

你可以使用 `ServerRoute` 設定中的 `headers` 與 `status` 屬性，為個別伺服器路由設定自訂標頭與狀態碼。

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

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

對於路由設定中以 [`redirectTo`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 屬性指定的重新導向，Angular 在伺服器端的處理方式有所不同。

**伺服器端渲染（SSR）**
重新導向是在伺服器端渲染過程中，使用標準的 HTTP 重新導向（例如 301、302）來執行。

**預先渲染（SSG）**
重新導向是以「軟重新導向」的方式實作，在預先渲染的 HTML 中使用 `<meta http-equiv="refresh">` 標籤。這讓重新導向不需要往返伺服器即可完成。

### 自訂建置時預先渲染（SSG） {#customizing-build-time-prerendering-ssg}

使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 時，你可以指定數個設定選項，來自訂預先渲染與提供的流程。

#### 參數化路由

對於每條使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 的路由，你可以指定一個 [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 函式。這個函式讓你控制哪些具體參數會產生各自獨立的預先渲染文件。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 函式會傳回一個 `Promise`，其解析結果是一個物件陣列。每個物件是路由參數名稱與值的鍵值對應。例如，如果你定義了像 `posts/:id` 這樣的路由，`getPrerenderParams ` 可以傳回陣列 `[{id: 123}, {id: 456}]`，從而為 `posts/123` 與 `posts/456` 分別渲染文件。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 的主體可以使用 Angular 的 [`inject`](api/core/inject 'API reference') 函式來注入依賴，並執行任何用來決定要預先渲染哪些路由的工作。這通常包括發出請求來擷取資料，以建構參數值陣列。

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assuming this returns ['1', '2', '3']

      return ids.map(id => ({ id })); // Transforms IDs into an array of objects for prerendering

      // This will prerender the paths: `/post/1`, `/post/2` and `/post/3`
    },
  },
];
```

由於 [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 專門適用於 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')，這個函式總是在_建置時_執行。`getPrerenderParams` 不得依賴任何瀏覽器專屬或伺服器專屬的 API 來取得資料。如果路由沒有指定 [`fallback`](api/ssr/ServerRoutePrerenderWithParams#fallback 'API reference') 選項，該路由預設會後備至 [`PrerenderFallback.Server`](api/ssr/PrerenderFallback#Server 'API reference')（SSR）。

IMPORTANT: 在 `getPrerenderParams` 內使用 [`inject`](api/core/inject 'API reference') 時，請記住 `inject` 必須以同步方式使用。它不能在非同步回呼中、或在任何 `await` 陳述式之後被呼叫。更多資訊請參閱 [`runInInjectionContext` API 參考](api/core/runInInjectionContext)。

#### 後備策略

使用 [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') 模式時，你可以指定一個後備策略，來處理尚未預先渲染之路徑的請求。

可用的後備策略有：

- **Server**：後備為伺服器端渲染。如果沒有指定 `fallback` 屬性，這就是**預設**行為。
- **Client**：後備為用戶端渲染。
- **None**：不做後備。Angular 不會處理未預先渲染之路徑的請求。

```typescript
// app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Fallback to CSR if not prerendered
    async getPrerenderParams() {
      // This function returns an array of objects representing prerendered posts at the paths:
      // `/post/1`, `/post/2`, and `/post/3`.
      // The path `/post/4` will utilize the fallback behavior if it's requested.
      return [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
];
```

## 透過 DI 存取 Request 與 Response {#accessing-request-and-response-via-di}

`@angular/core` 套件提供數個用來與伺服器端渲染環境互動的 token。這些 token 讓你在 SSR 期間能存取 Angular 應用程式中的關鍵資訊與物件。

- **[`REQUEST`](api/core/REQUEST 'API reference')**：提供對目前請求物件的存取，該物件的型別是 Web API 的 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)。這讓你能存取標頭、cookies 與其他請求資訊。
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference')**：提供對回應初始化選項的存取，該選項的型別是 Web API 的 [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters)。這讓你能動態設定回應的標頭與狀態碼。當標頭或狀態碼需要在執行階段決定時，請使用這個 token。
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference')**：提供對目前請求相關額外上下文的存取。這個上下文可以作為 [`handle`](api/ssr/AngularAppEngine#handle 'API reference') 函式的第二個參數傳入。通常用來提供不屬於標準 Web API 的額外請求相關資訊。

```angular-ts
import { inject, REQUEST } from '@angular/core';

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

IMPORTANT: 上述 token 在以下情境中會是 `null`：

- 在建置過程中。
- 當應用程式在瀏覽器中渲染（用戶端渲染）時。
- 執行靜態網站生成（SSG）時。
- 在開發期間的路由擷取過程中（於請求當下）。

## 設定非 Node.js 伺服器

`@angular/ssr` 提供在 Node.js 以外的平台上為你的 Angular 應用程式進行伺服器端渲染所需的核心 API。它利用 Web API 中標準的 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 與 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) 物件，讓你能將 Angular SSR 整合到各種伺服器環境中。詳細資訊與範例，請參閱 [`@angular/ssr` API 參考](api/ssr/AngularAppEngine)。

```typescript
// server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response|null = await angularApp.render(req);

  // ...
});
```

## 設定 Node.js 伺服器

`@angular/ssr/node` 是專為 Node.js 環境擴充 `@angular/ssr` 的套件。它提供的 API 讓你在 Node.js 應用程式中實作伺服器端渲染更容易。完整的函式清單與使用範例，請參閱 [`@angular/ssr/node` API 參考](api/ssr/node/AngularNodeAppEngine)。

```typescript
// server.ts
import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response => {
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
