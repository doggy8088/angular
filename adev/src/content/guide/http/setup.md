# 設定 `HttpClient`

在您的應用程式中使用 `HttpClient` 之前，您必須使用 [相依性注入](guide/di) 來設定它。

## 透過相依性注入提供 `HttpClient`

`HttpClient` 是使用 `provideHttpClient` 輔助函式提供的，大多數應用程式會將其包含在 `app.config.ts` 的應用程式 `providers` 中。

<docs-code language="ts">
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ]
};
</docs-code>

如果您的應用程式使用基於 NgModule 的引導程式，您可以將 `provideHttpClient` 包含在應用程式 NgModule 的提供者中：

<docs-code language="ts">
@NgModule({
  providers: [
    provideHttpClient(),
  ],
  // ... other application configuration
})
export class AppModule {}
</docs-code>

然後，您可以將 `HttpClient` 服務注入為元件、服務或其他類別的相依性：

<docs-code language="ts">
@Injectable({providedIn: 'root'})
export class ConfigService {
  constructor(private http: HttpClient) {
    // This service can now make HTTP requests via `this.http`.
  }
}
</docs-code>

## 配置 `HttpClient` 的功能`

`provideHttpClient` 接受一個選用功能設定清單，以啟用或設定客戶端不同面向的行為。本節詳述選用功能及其用法。

### `withFetch`

<docs-code language="ts">
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
    ),
  ]
};
</docs-code>

預設情況下，`HttpClient` 使用 [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) API 發出請求。`withFetch` 功能將用戶端切換為使用 [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API。

`fetch` 是較新的 API，可供 `XMLHttpRequest` 不受支援的一些環境使用。它有一些限制，例如不產生上傳進度事件。

### `withInterceptors(...)``

`withInterceptors` 配置一組攔截器函式，這些函式會處理透過 `HttpClient` 進行的請求。請參閱 [攔截器指南](guide/http/interceptors) 以了解更多資訊。

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` 在 `HttpClient` 組態中包含舊式類別基礎攔截器。請參閱 [攔截器指南](guide/http/interceptors) 以了解更多資訊。

HELPFUL: 具有較可預測排序的功能性攔截器 (透過 `withInterceptors`)，我們建議使用它們而不是基於 DI 的攔截器。

### `withRequestsMadeViaParent()`

預設情況下，當您在給定的注入器中使用 `provideHttpClient` 配置 `HttpClient` 時，此配置將覆寫父注入器中可能存在的 `HttpClient` 的任何配置。

當你加入 `withRequestsMadeViaParent()`，`HttpClient` 會被配置為將請求傳遞到父層注入器中的 `HttpClient` 實例，一旦它們透過此層級的任何已配置攔截器。如果你想在子層級注入器中 _新增_ 攔截器，同時仍透過父層級注入器的攔截器來傳送請求，這將會很有用。

CRITICAL：您必須在目前的注入器上方配置 `HttpClient` 的執行個體，否則此選項無效，而當您嘗試使用它時，您會收到執行時期錯誤。

### `withJsonpSupport()`

包含 `withJsonpSupport` 啟用 `HttpClient` 上的 `.jsonp()` 方法，該方法透過 [JSONP 慣例](https://en.wikipedia.org/wiki/JSONP) 進行 GET 要求，以跨網域載入資料。

HELPFUL: 盡可能使用 [CORS](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS) 來進行跨網域請求，而不是 JSONP。

### `withXsrfConfiguration(...)`

包含此選項允許自定義 `HttpClient` 內建的 XSRF 安全性功能。有關更多資訊，請參閱 [安全性指南](guide/http/security)。

### `withNoXsrfProtection()`

包含此選項會停用 `HttpClient` 內建的 XSRF 安全性功能。請參閱 [安全性指南](guide/http/security)以了解更多資訊。

## 基於 `HttpClientModule` 的設定

某些應用程式可能會使用基於 NgModules 的舊 API 來配置 `HttpClient`。

下表列出 `@angular/common/http` 提供的 NgModules，以及它們與上述提供者組態函式的關聯。

| **NgModule** | 等同於 `provideHttpClient()` |
| - | - |
| `HttpClientModule` | `provideHttpClient(withInterceptorsFromDi())` |
| `HttpClientJsonpModule` | `withJsonpSupport()` |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)` |
| `HttpClientXsrfModule.disable()` | `withNoXsrfProtection()` |

<docs-callout important title="在多個注入器中使用 HttpClientModule 時小心">
當 `HttpClientModule` 出現在多個注入器中時，攔截器的行為定義不明確，且取決於確切的選項和提供者/匯入順序。

對於多注入器配置，優先使用 `provideHttpClient`，因為它具有更穩定的行為。請參閱上面的 `withRequestsMadeViaParent` 功能。
</docs-callout>
