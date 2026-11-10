# `HttpClient` 的安全性

`HttpClient` 內建支援兩種常見的 HTTP 安全機制：XSSI 防護與 XSRF/CSRF 防護。

TIP: 也請考慮為你的 API 採用 [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy)。

## XSSI 防護

跨站指令碼包含（XSSI）是[跨站指令碼](https://en.wikipedia.org/wiki/Cross-site_scripting)攻擊的一種形式：攻擊者把來自你 API 端點的 JSON 資料當成 `<script>`，載入到他們所控制的頁面，之後便能運用各種 JavaScript 技巧存取這些資料。

防止 XSSI 的常見技巧，是讓 JSON 回應帶有「不可執行的前綴」，常用的前綴是 `)]}',\n`。此前綴可防止 JSON 回應被解讀為有效的可執行 JavaScript。當 API 以資料形式載入時，可在進行 JSON 解析前先把此前綴移除。

`HttpClient` 在解析回應中的 JSON 時，會自動移除這個 XSSI 前綴（如果有的話）。

## XSRF/CSRF 防護

[跨站請求偽造（XSRF 或 CSRF）](https://en.wikipedia.org/wiki/Cross-site_request_forgery)是一種攻擊技巧：攻擊者誘使已通過驗證的使用者，在不知情的情況下在你的網站上執行操作。

`HttpClient` 支援一種用來防止 XSRF 攻擊的[常見機制](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token)。執行 HTTP 請求時，攔截器會從 cookie 讀取權杖（預設為 `XSRF-TOKEN`），並把它設為 HTTP 標頭 `X-XSRF-TOKEN`。由於只有在你的網域上執行的程式碼能讀取該 cookie，後端可以確定 HTTP 請求來自你的用戶端應用程式，而不是攻擊者。

預設情況下，攔截器會在所有發往相對 URL 與同源 URL 的變更型請求（例如 `POST`）上傳送這個標頭，但不會在 `GET` 或 `HEAD` 請求上傳送。

<docs-callout helpful title="為什麼不保護 GET 請求？">
CSRF 防護只對能改變後端狀態的請求才有必要。CSRF 攻擊本質上會跨越網域界線，而 Web 的 [同源政策](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) 會防止攻擊頁面取得已驗證 `GET` 請求的結果。
</docs-callout>

若要善用這項機制，你的伺服器需要在頁面載入時或第一個 GET 請求時，把權杖設在一個 JavaScript 可讀取、名為 `XSRF-TOKEN` 的工作階段 cookie 中。在後續請求中，伺服器可以驗證 cookie 是否與 `X-XSRF-TOKEN` HTTP 標頭相符，藉此確定只有在你的網域上執行的程式碼可能傳送該請求。權杖對每位使用者都必須唯一，且必須可由伺服器驗證；這能防止用戶端自行捏造權杖。請把權杖設為你網站驗證 cookie 加上 salt 的摘要，以加強安全性。

為了防止多個 Angular 應用程式共用相同網域或子網域時發生衝突，請為每個應用程式指定唯一的 cookie 名稱。

<docs-callout important title="HttpClient 只支援 XSRF 防護機制的用戶端那一半">
  你的後端服務必須設定為：為你的頁面設定 cookie，並驗證所有符合條件的請求都帶有該標頭。若未做到，Angular 的預設防護將失效。
</docs-callout>

### 設定自訂 cookie／標頭名稱

若你的後端服務為 XSRF 權杖 cookie 或標頭使用不同的名稱，請使用 `withXsrfConfiguration` 覆寫預設值。

把它加入 `provideHttpClient` 呼叫，如下所示：

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ],
};
```

### 停用 XSRF 防護

若內建的 XSRF 防護機制不適用於你的應用程式，你可以使用 `withNoXsrfProtection` 功能停用它：

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```
