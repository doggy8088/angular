# 攔截器

`HttpClient` 支援一種稱為「攔截器」的中介層形式。

TLDR: 攔截器是一種中介層，讓重試、快取、記錄與驗證等常見模式能從個別請求中抽象出來，統一處理。

`HttpClient` 支援兩種攔截器：函式型與 DI 型。我們建議使用函式型攔截器，因為它們的行為較可預期，在複雜設定下尤其如此。本指南的範例使用函式型攔截器，[DI 型攔截器](#di-based-interceptors)則在文末以專節介紹。

## 攔截器

攔截器通常是可針對每個請求執行的函式，具備廣泛的能力，能影響請求與回應的內容及整體流程。你可以安裝多個攔截器，它們會組成一條攔截器鏈，其中每個攔截器在把請求或回應轉交給鏈中的下一個攔截器之前，先行處理。

你可以使用攔截器實作各種常見模式，例如：

- 為傳送至特定 API 的外送請求加入驗證標頭。
- 以指數退避方式重試失敗的請求。
- 將回應快取一段時間，或快取到被變更操作失效為止。
- 自訂回應的解析方式。
- 量測伺服器回應時間並記錄下來。
- 在網路操作進行期間驅動 UI 元素，例如載入旋轉圖示。
- 收集並批次處理在某段時間內發出的請求。
- 在可設定的期限或逾時之後自動讓請求失敗。
- 定期輪詢伺服器並重新整理結果。

## 定義攔截器

攔截器的基本形式是一個函式，它接收外送的 `HttpRequest`，以及一個 `next` 函式，代表攔截器鏈中的下一個處理步驟。

例如，這個 `loggingInterceptor` 會在轉交請求之前，把外送請求的 URL 記錄到 `console.log`：

```ts
export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
```

要讓這個攔截器真正攔截請求，你必須設定 `HttpClient` 使用它。

## 設定攔截器

在透過依賴注入設定 `HttpClient` 時，使用 `withInterceptors` 功能來宣告要使用的攔截器集合：

```ts
bootstrapApplication(App, {
  providers: [provideHttpClient(withInterceptors([loggingInterceptor, cachingInterceptor]))],
});
```

你設定的攔截器會依你在 providers 中列出的順序串連在一起。在上例中，`loggingInterceptor` 會先處理請求，然後轉交給 `cachingInterceptor`。

### 攔截回應事件 {#intercepting-response-events}

攔截器可以轉換 `next` 回傳的 `HttpEvent` 的 `Observable` 串流，以存取或操作回應。由於此串流包含所有回應事件，為了辨識最終的回應物件，可能需要檢查每個事件的 `.type`。

```ts
export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    }),
  );
}
```

TIP: 攔截器天生就能把回應與其對應的外送請求關聯起來，因為它們是在擷取了請求物件的閉包中轉換回應串流。

## 修改請求

`HttpRequest` 與 `HttpResponse` 執行個體的大多數面向都是「不可變」的，攔截器無法直接修改它們。攔截器改以使用 `.clone()` 操作複製這些物件，並指定在新執行個體中要變更哪些屬性，來套用變更。這可能涉及對值本身進行不可變更新（例如 `HttpHeaders` 或 `HttpParams`）。

例如，為請求加入一個標頭：

```ts
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
```

這種不可變性讓大多數攔截器在同一個 `HttpRequest` 被多次提交到攔截器鏈時，仍能保持冪等。這種情況可能因多種原因發生，包括請求在失敗後被重試時。

CRITICAL: 請求或回應的主體「不」受深層變更的保護。如果攔截器必須變更主體，務必小心處理同一個請求被多次執行的情況。

## 攔截器中的依賴注入

攔截器在註冊它的注入器的「注入上下文」中執行，可以使用 Angular 的 [`inject`](/api/core/inject) API 來取得依賴。

例如，假設應用程式有一個名為 `AuthService` 的服務，負責為外送請求建立驗證權杖。攔截器可以注入並使用這個服務：

```ts
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
```

## 請求與回應的中繼資料 {#request-and-response-metadata}

在請求中加入不傳送給後端、而是專門給攔截器使用的資訊，往往很有用。`HttpRequest` 有一個 `.context` 物件，它以 `HttpContext` 執行個體的形式儲存這類中繼資料。這個物件的作用類似具型別的對照表，其鍵的型別為 `HttpContextToken`。

為了說明這套系統如何運作，我們用中繼資料來控制快取攔截器是否對某個請求啟用。

### 定義上下文權杖

若要把「快取攔截器是否應快取某個特定請求」存放在該請求的 `.context` 對照表中，請定義一個新的 `HttpContextToken` 作為鍵：

```ts
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
```

所提供的函式會為尚未明確設定值的請求建立權杖的預設值。使用函式可確保當權杖的值是物件或陣列時，每個請求都能取得自己的執行個體。

### 在攔截器中讀取權杖

接著，攔截器可以讀取該權杖，並依其值決定是否套用快取邏輯：

```ts
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return ...;
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}
```

### 發出請求時設定上下文權杖

透過 `HttpClient` API 發出請求時，你可以為 `HttpContextToken` 提供值：

```ts
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
```

攔截器可以從請求的 `HttpContext` 讀取這些值。

### 請求上下文是可變的

與 `HttpRequest` 的其他屬性不同，相關聯的 `HttpContext` 是「可變」的。如果攔截器變更了一個之後會被重試的請求的上下文，同一個攔截器在再次執行時會觀察到該上下文變更。在需要跨多次重試傳遞狀態時，這很有用。

## 合成回應

大多數攔截器只會呼叫 `next` 處理器，同時轉換請求或回應，但這並非嚴格必要。本節討論攔截器納入更進階行為的幾種方式。

攔截器不一定要呼叫 `next`。它們可以改為透過其他機制建構回應，例如從快取取得，或透過替代機制傳送請求。

可以使用 `HttpResponse` 建構函式來建構回應：

```ts
const resp = new HttpResponse({
  body: 'response body',
});
```

## 處理重新導向資訊

搭配 `withFetch` provider 使用 `HttpClient` 時，回應會包含一個 `redirected` 屬性，指出該回應是否為重新導向的結果。此屬性與原生 Fetch API 規格一致，在攔截器處理重新導向情境時很有用。

攔截器可以存取重新導向資訊並據此採取行動：

```ts
export function redirectTrackingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.redirected) {
        console.log('Request to', req.url, 'was redirected to', event.url);
        // Handle redirect logic - maybe update analytics, security checks, etc.
      }
    }),
  );
}
```

你也可以使用重新導向資訊，在攔截器中實作條件邏輯：

```ts
export function authRedirectInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.redirected) {
        // Check if we were redirected to a login page
        if (event.url?.includes('/login')) {
          // Handle authentication redirect
          handleAuthRedirect();
        }
      }
    }),
  );
}
```

## 處理回應型別

搭配 `withFetch` provider 使用 `HttpClient` 時，回應會包含一個 `type` 屬性，指出瀏覽器如何依 CORS 政策與請求模式處理該回應。此屬性與原生 Fetch API 規格一致，為除錯 CORS 問題與了解回應可存取性提供寶貴的線索。

回應的 `type` 屬性可以是下列值：

- `'basic'`：同來源回應，所有標頭皆可存取
- `'cors'`：跨來源回應，CORS 標頭已正確設定
- `'opaque'`：沒有 CORS 的跨來源回應，標頭與主體可能受限
- `'opaqueredirect'`：在 no-cors 模式下，來自重新導向請求的回應
- `'error'`：發生網路錯誤

攔截器可以利用回應型別資訊進行 CORS 除錯與錯誤處理：

```ts
export function responseTypeInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    map((event) => {
      if (event.type === HttpEventType.Response) {
        // Handle different response types appropriately
        switch (event.responseType) {
          case 'opaque':
            // Limited access to response data
            console.warn('Limited response data due to CORS policy');
            break;
          case 'cors':
          case 'basic':
            // Full access to response data
            break;
          case 'error':
            // Handle network errors
            console.error('Network error in response');
            break;
        }
      }
    }),
  );
}
```

## DI 型攔截器 {#di-based-interceptors}

`HttpClient` 也支援以可注入類別定義、並透過 DI 系統設定的攔截器。DI 型攔截器的能力與函式型攔截器完全相同，但設定機制不同。

DI 型攔截器是一個實作 `HttpInterceptor` 介面的可注入類別：

```ts
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req);
  }
}
```

DI 型攔截器透過依賴注入的多重 provider 來設定：

```ts
bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi(),
    ),

    {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
  ],
});
```

DI 型攔截器依其 provider 註冊的順序執行。在 DI 設定龐大且具階層的應用程式中，這個順序可能非常難以預測。
