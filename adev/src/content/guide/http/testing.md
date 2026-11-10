# 測試請求

如同任何外部依賴，你必須模擬 HTTP 後端，讓測試能模擬與遠端伺服器的互動。`@angular/common/http/testing` 函式庫提供工具，用來擷取應用程式發出的請求、對這些請求進行斷言，並模擬回應以仿效後端的行為。

此測試函式庫的設計模式是：應用程式先執行程式碼並發出請求。接著，測試預期某些請求已經或尚未發出，對這些請求進行斷言，最後透過對每個預期請求呼叫「flush」來提供回應。

最後，測試可以驗證應用程式沒有發出任何未預期的請求。

## 測試設定

若要開始測試 `HttpClient` 的用法，請設定 `TestBed`，並在測試設定中加入 `provideHttpClientTesting()`。`HttpClient` 由 Angular 的測試環境提供，而 `provideHttpClientTesting()` 會把它設定為使用測試後端，而非真實網路。它同時提供 `HttpTestingController`，你將用它與測試後端互動、設定對已發出請求的預期，並對這些請求送出回應（flush）。設定完成後，`HttpTestingController` 可以從 `TestBed` 注入取得。

```ts
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

現在，當你的測試發出請求時，它們會打到測試後端，而非一般後端。你可以使用 `httpTesting` 對這些請求進行斷言。

### 在測試中設定 `HttpClient`

如果測試需要設定 `HttpClient` 的功能，例如攔截器，請在 `provideHttpClientTesting()` 之前先加入 `provideHttpClient(...)`。
IMPORTANT: 請務必在 `provideHttpClientTesting()` 「之前」提供 `provideHttpClient()`，因為 `provideHttpClientTesting()` 會覆寫 `provideHttpClient()` 的部分內容。順序顛倒可能會讓你的測試壞掉。

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
});
```

## 預期與回應請求

例如，你可以撰寫一個測試，預期會發生一個 GET 請求，並提供一個模擬回應：

```ts
TestBed.configureTestingModule({
  providers: [ConfigService, provideHttpClientTesting()],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
// and creates a `Promise` of the response.
const configPromise = firstValueFrom(config$);

// At this point, the request is pending, and we can assert it was made
// via the `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// We can assert various properties of the request if desired.
expect(req.request.method).toBe('GET');

// Flushing the request causes it to complete, delivering the result.
req.flush(DEFAULT_CONFIG);

// We can then assert that the response was successfully delivered by the `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Finally, we can assert that no other requests were made.
httpTesting.verify();
```

NOTE: 如果測試發出了多個符合指定條件的請求，`expectOne` 將會失敗。

除了對 `req.method` 進行斷言，你也可以改用 `expectOne` 的擴充形式，同時比對請求方法：

```ts
const req = httpTesting.expectOne(
  {
    method: 'GET',
    url: '/api/config',
  },
  'Request to load the configuration',
);
```

HELPFUL: 預期 API 會比對請求的完整 URL，包括任何查詢參數。

最後一個步驟 — 驗證沒有請求仍未處理 — 相當常見，你可以把它移到 `afterEach()` 步驟中：

```ts
afterEach(() => {
  // Verify that none of the tests make any extra HTTP requests.
  TestBed.inject(HttpTestingController).verify();
});
```

## 一次處理多個請求

如果你的測試需要回應重複的請求，請使用 `match()` API 而非 `expectOne()`。它接受相同的參數，但回傳一個符合條件的請求陣列。回傳後，這些請求會從後續的比對中移除，你需要負責對它們送出回應並驗證。

```ts
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Handle responding to each request.
}
```

## 進階比對

所有比對函式都接受述詞函式，以進行自訂比對邏輯：

```ts
// Look for one request that has a request body.
const requestsWithBody = httpTesting.expectOne((req) => req.body !== null);
```

`expectNone` 函式斷言沒有請求符合指定條件。

```ts
// Assert that no mutation requests have been issued.
httpTesting.expectNone((req) => req.method !== 'GET');
```

## 測試錯誤處理

你應該測試應用程式在 HTTP 請求失敗時的回應。

### 後端錯誤

若要測試後端錯誤的處理（當伺服器回傳非成功的狀態碼時），請以錯誤回應對請求呼叫 flush，模擬後端在請求失敗時會回傳的內容。

```ts
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Assert that the application successfully handled the backend error.
```

### 網路錯誤

請求也可能因網路錯誤而失敗，這類錯誤會以 `ProgressEvent` 錯誤的形式呈現。它們可以透過 `error()` 方法傳送：

```ts
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Assert that the application successfully handled the network error.
```

## 測試攔截器

你應該測試攔截器在預期情況下是否正常運作。

例如，應用程式可能需要把由服務產生的驗證權杖加入每個外送請求。
這個行為可以透過使用攔截器來強制實現：

```ts
export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}
```

這個攔截器的 `TestBed` 設定應依賴 `withInterceptors` 功能。

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    // Testing one interceptor at a time is recommended.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
```

`HttpTestingController` 可以取得請求執行個體，接著便可檢查它，以確保請求已被修改。

```ts
const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');

expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
```

類似的攔截器也可以用類別型攔截器實作：

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}
```

若要測試它，`TestBed` 設定應改為：

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    // We rely on the HTTP_INTERCEPTORS token to register the AuthInterceptor as an HttpInterceptor
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
});
```
