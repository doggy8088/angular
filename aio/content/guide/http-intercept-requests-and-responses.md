# HTTP — 攔截請求與回應

使用攔截機制時，你可以宣告 *攔截器*，檢查並轉換應用程式發往伺服器的 HTTP 請求。
這些攔截器也可以在伺服器的回應返回應用程式的途中，檢查並轉換它們。
多個攔截器會形成請求／回應處理常式的 *往返* 鏈。

攔截器可以針對每個 HTTP 請求／回應，以例行、標準的方式執行各種 *隱含* 工作，從驗證到記錄皆然。

若沒有攔截機制，開發人員就必須針對每個 `HttpClient` 方法呼叫，*明確地*實作這些工作。

## 撰寫攔截器

若要實作攔截器，請宣告一個類別，實作 `HttpInterceptor` 介面的 `intercept()` 方法。

以下是一個什麼都不做的 `noop` 攔截器，它會讓請求原封不動地通過：

<code-example header="app/http-interceptors/noop-interceptor.ts" path="http/src/app/http-interceptors/noop-interceptor.ts"></code-example>

`intercept` 方法會將請求轉換為 `Observable`，最終回傳 HTTP 回應。
就這個意義而言，每個攔截器都完全有能力自行完整處理請求。

大多數攔截器會在請求進入時檢查它，並將可能已修改的請求轉發給 `next` 物件的 `handle()` 方法，該物件實作了 [`HttpHandler`](api/common/http/HttpHandler) 介面。

<code-example format="javascript" language="javascript">

export abstract class HttpHandler {
  abstract handle(req: HttpRequest&lt;any&gt;): Observable&lt;HttpEvent&lt;any&gt;&gt;;
}

</code-example>

與 `intercept()` 一樣，`handle()` 方法會將 HTTP 請求轉換為 [`HttpEvents`](#interceptor-events) 的 `Observable`，最終包含伺服器的回應。
`intercept()` 方法可以在將該 observable 回傳給呼叫者之前檢查並修改它。

這個 `no-op` 攔截器會使用原始請求呼叫 `next.handle()`，並原樣回傳 observable，什麼都不做。

## `next` 物件

`next` 物件代表攔截器鏈中的下一個攔截器。
鏈中最後一個 `next` 是 `HttpClient` 後端處理常式，它會將請求傳送給伺服器並接收伺服器的回應。

大多數攔截器會呼叫 `next.handle()`，讓請求流向下一個攔截器，最終到達後端處理常式。
攔截器*也可以*跳過呼叫 `next.handle()`，使鏈短路，並以人為的伺服器回應[回傳自己的 `Observable`](guide/http-interceptor-use-cases#caching)。

這是 Express.js 等框架中常見的中介軟體模式。

## 提供攔截器

`NoopInterceptor` 是由 Angular [依賴注入（DI）](guide/dependency-injection)系統管理的服務。
與其他服務一樣，你必須先提供攔截器類別，應用程式才能使用它。

因為攔截器是 `HttpClient` 服務的選用相依性，你必須在提供 `HttpClient` 的注入器，或其父注入器中提供它們。
在 DI 建立 `HttpClient` *之後*才提供的攔截器會被忽略。

這個應用程式會在應用程式的根注入器中提供 `HttpClient`，這是將 `HttpClientModule` 匯入 `AppModule` 的副作用。
你也應該在 `AppModule` 中提供攔截器。

從 `@angular/common/http` 匯入 `HTTP_INTERCEPTORS` 注入權杖後，像這樣撰寫 `NoopInterceptor` 提供者：

<code-example path="http/src/app/http-interceptors/index.ts" region="noop-provider"></code-example>

請注意 `multi: true` 選項。
這個必要設定告訴 Angular，`HTTP_INTERCEPTORS` 是一個 *multiprovider* 的權杖，會注入一個值陣列，而非單一值。

你*也可以*直接將這個提供者加入 `AppModule` 的 providers 陣列。
不過，這種寫法相當冗長，而且你很可能會建立更多攔截器並以相同方式提供它們。
你也必須[密切注意提供這些攔截器的順序](#攔截器順序)。

請考慮建立一個「barrel」檔案，將所有攔截器提供者收集到 `httpInterceptorProviders` 陣列中，從第一個 `NoopInterceptor` 開始。

<code-example header="app/http-interceptors/index.ts" path="http/src/app/http-interceptors/index.ts" region="interceptor-providers"></code-example>

接著像這樣將它匯入並加入 `AppModule` 的 `providers array`：

<code-example header="app/app.module.ts (interceptor providers)" path="http/src/app/app.module.ts" region="interceptor-providers"></code-example>

當你建立新的攔截器時，將它們加入 `httpInterceptorProviders` 陣列，就不需要再回頭修改 `AppModule`。

<div class="alert is-helpful">

完整的範例程式碼中還有更多攔截器。

</div>

## 攔截器順序

Angular 會按照你提供攔截器的順序套用它們。
例如，假設你想處理 HTTP 請求的驗證，並在將它們傳送到伺服器之前記錄下來。
為了完成這項工作，你可以先提供 `AuthInterceptor` 服務，再提供 `LoggingInterceptor` 服務。
發出的請求會從 `AuthInterceptor` 流向 `LoggingInterceptor`。
這些請求的回應會朝反方向流動，從 `LoggingInterceptor` 回到 `AuthInterceptor`。
以下是這個過程的視覺化呈現：

<div class="lightbox">

<img alt="攔截器依 HttpClient、AuthInterceptor、AuthInterceptor、HttpBackend、伺服器的順序排列，並以相反順序返回，以呈現雙向流程" src="generated/images/guide/http/interceptor-order.svg">

</div>

<div class="alert is-helpful">

流程中的最後一個攔截器永遠是負責與伺服器通訊的 `HttpBackend`。

</div>

你之後無法變更順序或移除攔截器。
如果你需要動態啟用與停用攔截器，就必須將這個能力建置到攔截器本身。

<a id="interceptor-events"></a>

## 處理攔截器事件

大多數 `HttpClient` 方法會回傳 `HttpResponse<any>` 的 observable。
`HttpResponse` 類別本身實際上就是一個事件，其型別為 `HttpEventType.Response`。
不過，單一 HTTP 請求可以產生多個其他型別的事件，包括上傳與下載進度事件。
`HttpInterceptor.intercept()` 與 `HttpHandler.handle()` 方法會回傳 `HttpEvent<any>` 的 observable。

許多攔截器只關心發出的請求，會原樣回傳 `next.handle()` 的事件串流，不做修改。
不過，有些攔截器需要檢查並修改 `next.handle()` 的回應；這些操作可以看到串流中的所有事件。

<a id="immutability"></a>

雖然攔截器能夠修改請求與回應，但 `HttpRequest` 與 `HttpResponse` 的實例屬性是 `readonly`，因此它們基本上是不可變的。
它們不可變是有充分理由的：
應用程式可能會在成功之前重試請求數次，這表示攔截器鏈可能會多次重新處理同一個請求。
如果攔截器可以修改原始請求物件，重試的操作就會從已修改的請求開始，而非原始請求。
不可變性確保攔截器每次嘗試看到的都是相同的請求。

<div class="alert is-helpful">

除非有充分的理由，否則你的攔截器應該原樣回傳每個事件。

</div>

TypeScript 會阻止你設定 `HttpRequest` 的唯讀屬性。

<code-example format="javascript" language="javascript">

// Typescript disallows the following assignment because req.url is readonly
req.url = req.url.replace('http://', 'https://');

</code-example>

如果你必須修改請求，請先複製它，並在傳給 `next.handle()` 之前修改複本。
你可以一次完成複製與修改請求，如下列範例所示。

<code-example header="app/http-interceptors/ensure-https-interceptor.ts (excerpt)" path="http/src/app/http-interceptors/ensure-https-interceptor.ts" region="excerpt"></code-example>

`clone()` 方法的雜湊引數可讓你在複製其他屬性的同時，修改請求的特定屬性。

### 修改請求主體

`readonly` 指派防護無法阻止深層更新，特別是無法阻止你修改請求主體物件的屬性。

<code-example format="javascript" language="javascript">

req.body.name = req.body.name.trim(); // bad idea!

</code-example>

如果你必須修改請求主體，請遵循下列步驟。

1.  複製主體，並在複本中進行修改。
1.  使用 `clone()` 方法複製請求物件。
1.  以修改後的複本取代複本的主體。

<code-example header="app/http-interceptors/trim-name-interceptor.ts (excerpt)" path="http/src/app/http-interceptors/trim-name-interceptor.ts" region="excerpt"></code-example>

### 在複本中清除請求主體

有時候你需要清除請求主體，而非取代它。
請將複製請求的主體設為 `null`。

<div class="alert is-helpful">

**提示**<br />
如果你將複製請求的主體設為 `undefined`，Angular 會假設你要保持主體不變。

</div>

<code-example format="javascript" language="javascript">

newReq = req.clone({ &hellip; }); // body not mentioned =&gt; preserve original body
newReq = req.clone({ body: undefined }); // preserve original body
newReq = req.clone({ body: null }); // clear the body

</code-example>

@reviewed 2023-03-16
