# `HttpClient` 安全性

`HttpClient` 內建支援兩種常見的 HTTP 安全機制：XSSI 保護和 XSRF/CSRF 保護。

提示：同時考慮為您的 API 採用 [內容安全性政策](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Headers/Content-Security-Policy)。

## XSSI 防護

跨網站腳本包含 (XSSI) 是 [跨網站腳本](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%BD%91%E7%AB%99%E8%85%BE%E6%96%87) 攻擊的一種形式，攻擊者會在他們控制的頁面上，將 JSON 資料從您的 API 端點載入為 `<script>`。然後可以使用不同的 JavaScript 技術來存取這些資料。

防止 XSSI 的常見技巧是提供具有「不可執行字首」的 JSON 回應，通常為 `)]}',\n`。此字首可防止 JSON 回應被解釋為有效的可執行 JavaScript。當 API 作為資料載入時，可以在 JSON 解析前移除字首。

當從回應中解析 JSON 時，`HttpClient` 會自動移除此 XSSI 前綴（如果存在）。

## XSRF/CSRF 保護

[跨網站請求偽造 (XSRF 或 CSRF)](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%B6%B2%E9%A0%81%E8%A8%82%E6%B1%82%E7%95%A5%E5%81%87%E9%80%A0%E6%93%8D) 是一種攻擊技術，攻擊者可以誘騙已驗證的用戶在您的網站上不知不覺執行操作。

`HttpClient` 支援一個[通用機制](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token)用來防止 XSRF 攻擊。在執行 HTTP 請求時，一個攔截器從 cookie 中讀取一個 token，預設是 `XSRF-TOKEN`，並將它設定為 HTTP 標頭 `X-XSRF-TOKEN`。因為只有在你的網域中執行的程式碼才能讀取 cookie，所以後端可以確定 HTTP 請求是來自你的用戶端應用程式，而不是攻擊者。

預設情況下，攔截器會在所有變動請求 (例如 `POST`) 上發送此標頭至相對 URL，但不會在 GET/HEAD 請求或具有絕對 URL 的請求上發送此標頭。

<docs-callout helpful title="為什麼不保護 GET 要求？">
CSRF 保護僅對能夠變更後端狀態的要求是必要的。依其性質，CSRF 攻擊跨越網域邊界，而網路的 [同源政策](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) 會防止攻擊頁面擷取驗證過 GET 要求的結果。
</docs-callout>

要利用這個優勢，您的伺服器需要在頁面載入或第一次 GET 要求時，將令牌設定在 JavaScript 可讀取的會話 Cookie 中，稱為 `XSRF-TOKEN`。在後續要求中，伺服器可以驗證 Cookie 是否與 `X-XSRF-TOKEN` HTTP 標頭相符，因此可以確定只有在您的網域上執行的程式碼才能傳送要求。令牌必須對每個使用者是唯一的，而且必須能被伺服器驗證；這可防止用戶端建立自己的令牌。將令牌設定為您網站驗證 Cookie 的摘要，並加入鹽以增強安全性。

為了防止在多個 Angular 應用程式共用相同網域或子網域的環境中發生衝突，請為每個應用程式提供一個獨特的 cookie 名稱。

<docs-callout important title="HttpClient 僅支援 XSRF 保護機制的用戶端部分">
  您的後端服務必須配置為為您的網頁設定 cookie，並驗證標頭出現在所有符合資格的請求上。否則，Angular 的預設保護將無效。
</docs-callout>

### 設定自訂 cookie/標頭名稱

如果您的後端服務對 XSRF 令牌 Cookie 或標頭使用不同的名稱，請使用 `withXsrfConfiguration` 來覆寫預設值。

將其新增到 `provideHttpClient` 呼叫，如下所示：

<docs-code language="ts">
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ]
};
</docs-code>

### 停用 XSRF 保護

若內建的 XSRF 保護機制不適用於您的應用程式，您可以使用 `withNoXsrfProtection` 功能停用它：

<docs-code language="ts">
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withNoXsrfProtection(),
    ),
  ]
};
</docs-code>

