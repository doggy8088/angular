# 設定 `HttpClient`

在 Angular v21 及之後版本，`HttpClient` 預設即可供注入使用。

## 透過依賴注入提供 `HttpClient`

你可以使用 `provideHttpClient` 輔助函式，在 `app.config.ts` 的應用程式 `providers` 中設定預設的 HTTP 功能集，或加入其他功能。

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(/* add features here, such as withInterceptors(...) */)],
};
```

如果你的應用程式改用以 NgModule 為基礎的啟動方式，你可以把 `provideHttpClient` 加入應用程式 NgModule 的 providers，以設定預設的 HTTP 功能集或加入其他功能：

```ts
@NgModule({
  providers: [provideHttpClient(/* add features here, such as withInterceptors(...) */)],
  // ... other application configuration
})
export class AppModule {}
```

之後，你就可以把 `HttpClient` 服務注入為元件、服務或其他類別的依賴：

```ts
@Service()
export class ConfigService {
  private http = inject(HttpClient);
  // This service can now make HTTP requests via `this.http`.
}
```

## 設定 `HttpClient` 的功能

`provideHttpClient` 接受一份選用的功能設定清單，用來啟用或設定用戶端的各個面向。本節詳述這些選用功能與其用法。

### `withXhr`

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withXhr())],
};
```

`HttpClient` 預設使用 [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) API 來發出請求。`withXhr` 功能會把用戶端改為使用 [`XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) API。

`fetch` 是較現代的 API，可用於少數不支援 `XMLHttpRequest` 的環境。不過它也有一些限制，例如不會產生上傳進度事件。

<docs-callout critical title="不要在伺服器端渲染（SSR）環境中使用 `withXhr`">

伺服器上的 XHR 支援已**棄用**，預計在 Angular 23 移除。底層的 `xhr2` 函式庫無法安全地處理重新導向：它可能在跨來源重新導向時轉送 `Authorization` 標頭，也容易因重新導向迴圈而遭受阻斷服務（DoS）攻擊。SSR 應用程式請改用預設的 `fetch` 後端。

</docs-callout>

### `withInterceptors(...)`

`withInterceptors` 用來設定一組攔截器函式，負責處理透過 `HttpClient` 發出的請求。詳情請見[攔截器指南](guide/http/interceptors)。

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` 會把舊式的類別型攔截器納入 `HttpClient` 設定。詳情請見[攔截器指南](guide/http/interceptors)。

HELPFUL: 函式型攔截器（透過 `withInterceptors`）的執行順序較可預期，建議優先於 DI 型攔截器使用。

### `withRequestsMadeViaParent()`

預設情況下，當你在某個注入器內使用 `provideHttpClient` 設定 `HttpClient` 時，該設定會覆蓋上層注入器中可能存在的任何 `HttpClient` 設定。

加入 `withRequestsMadeViaParent()` 後，`HttpClient` 會改為把請求往上傳給上層注入器的 `HttpClient` 執行個體，前提是請求已先通過本層級設定的所有攔截器。當你想在子注入器中「加入」攔截器、同時仍讓請求通過上層注入器的攔截器時，這個功能很有用。

CRITICAL: 你必須在目前注入器的上層設定一個 `HttpClient` 執行個體，否則此選項無效，使用時會發生執行階段錯誤。

### `withJsonpSupport()`

<docs-callout critical title="JSONP 已棄用">

`withJsonpSupport`、`HttpClientJsonpModule` 以及 `HttpClient` 的 `.jsonp()` 方法都已棄用，因為 JSONP 可能造成跨網站指令碼（XSS）弱點。請改用搭配 [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) 的標準 HTTP 請求。

</docs-callout>

加入 `withJsonpSupport` 會啟用 `HttpClient` 的 `.jsonp()` 方法，透過 [JSONP 慣例](https://en.wikipedia.org/wiki/JSONP)以 GET 請求跨網域載入資料。

HELPFUL: 進行跨網域請求時，請盡可能優先使用 [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) 而非 JSONP。

### `withXsrfConfiguration(...)`

加入此選項可自訂 `HttpClient` 內建的 XSRF 安全功能。詳情請見[安全性指南](best-practices/security)。

### `withNoXsrfProtection()`

加入此選項會停用 `HttpClient` 內建的 XSRF 安全功能。詳情請見[安全性指南](best-practices/security)。

## 以 `HttpClientModule` 為基礎的設定

有些應用程式可能使用較舊的、以 NgModule 為基礎的 API 來設定 `HttpClient`。

下表列出 `@angular/common/http` 提供的 NgModule，以及它們與上方 provider 設定函式的對應關係。

| **NgModule**                            | `provideHttpClient()` 的對應寫法                         |
| --------------------------------------- | -------------------------------------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi(), withXhr())` |
| `HttpClientJsonpModule`（已棄用）    | `withJsonpSupport()`（已棄用）                        |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)`                             |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()`                                 |

NOTE: `HttpClientModule` 與 `HttpClientXsrfModule` 也已棄用。請改用 `provideHttpClient` 搭配對應的功能。

<docs-callout important title="在多個注入器中使用 HttpClientModule 時請小心">
當 `HttpClientModule` 同時存在於多個注入器時，攔截器的行為並不明確，會受到確切選項以及 provider／匯入順序的影響。

多注入器設定請優先使用 `provideHttpClient`，其行為較穩定。詳情請見上方的 `withRequestsMadeViaParent` 功能。
</docs-callout>
