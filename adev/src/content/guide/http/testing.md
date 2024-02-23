# 測試 request

對於任何外部依賴項，您都必須模擬 HTTP 後端，以便您的測試可以模擬與遠端伺服器的互動。`@angular/common/http/testing` 函式庫提供工具來擷取應用程式提出的要求，對其進行聲明，並模擬回應，以模擬您的後端行為。

測試程式庫是為一種模式而設計，在這種模式中，應用程式會先執行程式碼並提出請求。然後，測試會期待某些請求已經或尚未提出，針對這些請求執行斷言，最後透過「清除」每個預期的請求來提供回應。

最後，測試可驗證應用程式沒有發出任何意外的請求。

## 測試設定

要開始測試 `HttpClient` 的使用，請配置 `TestBed` 並在測試的設定中包含 `provideHttpClientTesting`。這會將 `HttpClient` 配置為使用測試後端，而不是真正的網路。它還提供了 `HttpTestingController`，您將使用它來與測試後端互動、設定有關已發出請求的預期，以及刷新對這些請求的回應。配置後，可以從 `TestBed` 中注入 `HttpTestingController`。

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
</docs-code>

現在，當您的測試發出請求時，它們將會擊中測試後端，而不是正常的後端。您可以使用 `httpTesting` 對這些請求進行斷言。

## 期待和回應請求

例如，您可以撰寫一個測試，預期會發生 GET 要求並提供模擬回應：

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    ConfigService,
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

注意：如果測試已做出多個符合給定條件的要求，`expectOne` 將會失敗。

作為 `req.method` 斷言的替代方法，您可以改用 `expectOne` 的擴充表單來同時比對要求方法：

<docs-code language="ts">
const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, 'Request to load the configuration');
</docs-code>

HELPFUL: 期望 API 會比對要求的完整網址，包括任何查詢參數。

最後一個步驟，驗證沒有任何請求未完成，這很常見，你可以將它移到 `afterEach()` 步驟：

<docs-code language="ts">
afterEach(() => {
  // Verify that none of the tests make any extra HTTP requests.
  TestBed.inject(HttpTestingController).verify();
});
</docs-code>

## 同時處理多個請求

如果您需要在測試中回應重複的請求，請使用 `match()` API，而非 `expectOne()`。它採用相同的參數，但會傳回一個符合請求的陣列。傳回後，這些請求會從後續的配對中移除，並且您負責清除並驗證它們。

<docs-code language="ts">
const allGetRequests = httpTesting.match({method: 'GET'});
foreach (const req of allGetRequests) {
  // Handle responding to each request.
}
</docs-code>

## 進階比對

所有匹配函數都接受一個謂詞函數來進行自訂的匹配邏輯：

<docs-code language="ts">
// Look for one request that has a request body.
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);
</docs-code>

`expectNone` 函數聲稱沒有要求符合既定準則。

<docs-code language="ts">
// Assert that no mutation requests have been issued.
httpTesting.expectNone(req => req.method !== 'GET');
</docs-code>

## 測試錯誤處理

當 HTTP 要求失敗時，你應該測試 app 的回應。

### 後端錯誤

為了測試後端錯誤處理（當伺服器傳回非成功狀態碼時），請以一個錯誤回應沖刷請求，以模擬後端在請求失敗時會傳回的內容。

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Assert that the application successfully handled the backend error.
</docs-code>

### 網路錯誤

請求也可能會因網路錯誤而失敗，這些錯誤會顯示為 `ProgressEvent` 錯誤。這些錯誤可以用 `error()` 方法傳遞：

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Assert that the application successfully handled the network error.
</docs-code>

