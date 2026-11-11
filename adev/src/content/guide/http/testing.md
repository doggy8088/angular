# 測試請求

如同任何外部依賴，你必須模擬 HTTP 後端，讓測試能模擬與遠端伺服器的互動。`@angular/common/http/testing` 函式庫提供工具，用來擷取應用程式發出的請求、對這些請求進行斷言，並模擬回應以仿效後端的行為。

此測試函式庫的設計模式是：應用程式先執行程式碼並發出請求。接著，測試預期某些請求已經或尚未發出，對這些請求進行斷言，最後透過對每個預期請求呼叫「flush」來提供回應。

最後，測試可以驗證應用程式沒有發出任何未預期的請求。

## 測試設定

若要開始測試 `HttpClient` 的用法，請設定 `TestBed`，並在測試設定中加入 `provideHttpClient()` 與 `provideHttpClientTesting`。這樣會把 `HttpClient` 設定為使用測試後端，而非真實網路。它同時提供 `HttpTestingController`，你將用它與測試後端互動、設定對已發出請求的預期，並對這些請求送出回應（flush）。設定完成後，`HttpTestingController` 可以從 `TestBed` 注入取得。

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
</docs-code>

現在，當你的測試發出請求時，它們會打到測試後端，而非一般後端。你可以使用 `httpTesting` 對這些請求進行斷言。

## 預期與回應請求

例如，你可以撰寫一個測試，預期會發生一個 GET 請求，並提供一個模擬回應：

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    ConfigService,
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = this.configService.getConfig<Config>();

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
</docs-code>

NOTE: 如果測試發出了多個符合指定條件的請求，`expectOne` 將會失敗。

除了對 `req.method` 進行斷言，你也可以改用 `expectOne` 的擴充形式，同時比對請求方法：

<docs-code language="ts">
const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, 'Request to load the configuration');
</docs-code>

HELPFUL: 預期 API 會比對請求的完整 URL，包括任何查詢參數。

最後一個步驟 — 驗證沒有請求仍未處理 — 相當常見，你可以把它移到 `afterEach()` 步驟中：

<docs-code language="ts">
afterEach(() => {
  // Verify that none of the tests make any extra HTTP requests.
  TestBed.inject(HttpTestingController).verify();
});
</docs-code>

## 一次處理多個請求

如果你的測試需要回應重複的請求，請使用 `match()` API 而非 `expectOne()`。它接受相同的參數，但回傳一個符合條件的請求陣列。回傳後，這些請求會從後續的比對中移除，你需要負責對它們送出回應並驗證。

<docs-code language="ts">
const allGetRequests = httpTesting.match({method: 'GET'});
foreach (const req of allGetRequests) {
  // Handle responding to each request.
}
</docs-code>

## 進階比對

所有比對函式都接受述詞函式，以進行自訂比對邏輯：

<docs-code language="ts">
// Look for one request that has a request body.
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);
</docs-code>

`expectNone` 函式斷言沒有請求符合指定條件。

<docs-code language="ts">
// Assert that no mutation requests have been issued.
httpTesting.expectNone(req => req.method !== 'GET');
</docs-code>

## 測試錯誤處理

你應該測試應用程式在 HTTP 請求失敗時的回應。

### 後端錯誤

若要測試後端錯誤的處理（當伺服器回傳非成功的狀態碼時），請以錯誤回應對請求呼叫 flush，模擬後端在請求失敗時會回傳的內容。

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Assert that the application successfully handled the backend error.
</docs-code>

### 網路錯誤

請求也可能因網路錯誤而失敗，這類錯誤會以 `ProgressEvent` 錯誤的形式呈現。它們可以透過 `error()` 方法傳送：

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Assert that the application successfully handled the network error.
</docs-code>
