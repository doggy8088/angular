# 攔截器

`HttpClient` 支援一種稱為 _攔截器_ 的中介軟體形式。

TLDR：攔截器是中介軟體，可將重試、快取、記錄和驗證等常見模式從個別要求中抽象出來。

`HttpClient` 支援兩種攔截器：函式和基於 DI 的。我們的建議是使用函式攔截器，因為它們具有更可預測的行為，尤其是在複雜的設定中。本指南中的範例使用函式攔截器，我們在最後的單獨區段介紹 [基於 DI 的攔截器](#di-based-interceptors)。

## Interceptors

攔截器通常是您可以為每個請求執行的函式，並且具有廣泛的功能來影響請求和回應的內容和整體流程。您可以安裝多個攔截器，它們形成一個攔截器鏈，其中每個攔截器在將請求或回應轉發到鏈中的下一個攔截器之前對其進行處理。

您可以使用攔截器來實現各種常見模式，例如：

* 將驗證標頭加入到對特定 API 的傳出請求。
* 以指數退避重試失敗的請求。
* 將回應快取一段時間，或直到被突變無效化。
* 自訂回應的解析。
* 測量伺服器回應時間並將其記錄下來。
* 在網路操作進行中時，驅動 UI 元素，例如載入指示器。
* 收集並批次處理在某個時間範圍內發出的請求。
* 在可配置的期限或逾時後自動使請求失敗。
* 定期輪詢伺服器並更新結果。

## 定義攔截器

攔截器的基本形式是一個函式，它接收傳出的 `HttpRequest` 和一個表示攔截器鏈中下一個處理步驟的 `next` 函式。

例如，此 `loggingInterceptor` 會在轉發請求之前將傳出請求 URL 記錄到 `console.log`：

<docs-code language="ts">
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
</docs-code>

為了讓這個攔截器實際攔截請求，您必須將 `HttpClient` 配置為使用它。

## 配置攔截器

您在使用相依性注入組態 `HttpClient` 時，可透過 `withInterceptors` 功能來宣告要使用的攔截器集合：

<docs-code language="ts">
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    withInterceptors([loggingInterceptor, cachingInterceptor]),
  )
]});
</docs-code>

您配置的攔截器會以您在提供者中列出的順序鏈結在一起。在上面的範例中，`loggingInterceptor` 會處理請求，然後將其轉發到 `cachingInterceptor`。

### 攔截回應事件

攔截器可以轉換 `next` 返回的 `HttpEvent` 的 `Observable` 串流，以存取或操作回應。由於此串流包含所有回應事件，因此可能需要檢查每個事件的 `.type` 以識別最終的回應物件。

<docs-code language="ts">
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log(req.url, 'returned a response with status', event.status);
    }
  }));
}
</docs-code>

提示：攔截器自然地將回應與其傳出請求關聯起來，因為它們在封閉中轉換回應串流，該封閉會擷取請求物件。

## 修改請求

`HttpRequest` 和 `HttpResponse` 實例的大多數方面都是 _不可變_ 的，攔截器無法直接修改它們。相反，攔截器通過使用 `.clone()` 操作來複製這些物件套用變異，並指定應在新實例中變異哪些屬性。這可能涉及對值本身執行不可變的更新（例如 `HttpHeaders` 或 `HttpParams`）。

例如，若要將標頭新增至要求：

<docs-code language="ts">
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
</docs-code>

這種不變性允許大多數攔截器在相同的 `HttpRequest` 提交給攔截器鏈多次時，成為冪等。這可能會因為一些原因而發生，包括在請求失敗後重新嘗試時。

CRITICAL: 請求或回應的主體**不**受到深度變異的保護。如果攔截器必須變異主體，請小心處理在同一個請求上執行多次。

## 攔截器中的相依性注入

Interceptors 在註冊它們的注入器中以 _injection context_ 執行，並且可以使用 Angular 的 `inject` API 來擷取依賴項。

例如，假設一個應用程式有一個稱為 `AuthService` 的服務，它為傳出要求建立驗證權杖。一個攔截器可以注入並使用這個服務：

<docs-code language="ts">
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();

// Clone the request to add the authentication header.
  const newReq = req.clone({headers: {
    req.headers.append('X-Authentication-Token', authToken),
  }});
  return next(newReq);
}
</docs-code>

## 請求和回應元數據

在請求中包含未傳送至後端，但專門用於攔截器的資訊通常很有用。`HttpRequest` 具有 `.context` 物件，其會將此類型的元資料儲存為 `HttpContext` 的執行個體。此物件會以鍵是 `HttpContextToken` 類型的已輸入地圖運作。

為了說明此系統如何運作，讓我們使用元數據來控制快取攔截器是否針對特定要求啟用。

### 定義情境標記

為了儲存快取攔截器是否要將特定請求快取在其請求的 `.context` 地圖中，定義一個新的 `HttpContextToken` 作為金鑰：

<docs-code language="ts">
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
</docs-code>

提供的函式為尚未明確設定值的要求建立令牌的預設值。使用函式可確保如果令牌的值是物件或陣列，每個要求都會取得它自己的執行個體。

### 在攔截器中讀取 token

攔截器可以讀取程式碼，並根據其值選擇套用快取邏輯：

<docs-code language="ts">
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return ...;
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}
</docs-code>

### 在發出請求時設定內容標記

當透過 `HttpClient` API 進行請求時，您可以提供 `HttpContextToken` 的值：

<docs-code language="ts">
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
</docs-code>

Interceptors 可以從請求的 `HttpContext` 讀取這些值。

### 要求內容是可以變動的

與 `HttpRequest` 的其他屬性不同，關聯的 `HttpContext` 是 _可變的_。如果攔截器變更稍後重試的請求的內容，相同的攔截器會在再次執行時觀察內容變更。這對於在需要時傳遞多個重試的狀態非常有用。

## 合成回應

大多數攔截器會在轉換請求或回應時簡單地呼叫 `next` 處理常式，但這並不是嚴格的要求。本節討論了攔截器可以整合更進階行為的幾種方式。

Interceptors 不需要呼叫 `next`。他們也可以選擇通過其他機制來建構回應，例如從快取或通過備用機制發送請求。

可以使用 `HttpResponse` 建構函式建立回應：

<docs-code language="ts">
const resp = new HttpResponse({
  body: 'response body',
});
</docs-code>

## 基於 DI 的攔截器

`HttpClient` 也支援攔截器，這些攔截器定義為可注入的類別，並透過 DI 系統進行配置。基於 DI 的攔截器的功能與功能性攔截器相同，但配置機制不同。

基於 DI 的攔截器是一個可注入的類別，它實作了 `HttpInterceptor` 介面：

<docs-code language="ts">
@Injectable()
public class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req);
  }
}
</docs-code>

基於 DI 的攔截器是透過相依性注入多重提供者來設定：

<docs-code language="ts">
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    // DI-based interceptors must be explicitly enabled.
    withInterceptorsFromDi(),
  ),

{provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
]});
</docs-code>

基於 DI 的攔截器會按其提供者註冊的順序執行。在具有廣泛且分層式 DI 配置的應用程式中，此順序可能很難預測。
