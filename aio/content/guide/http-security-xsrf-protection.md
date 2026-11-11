# HTTP 用戶端 — 安全性：跨站請求偽造（XSRF）防護

[跨站請求偽造（XSRF 或 CSRF）](https://en.wikipedia.org/wiki/Cross-site_request_forgery)是一種攻擊手法，攻擊者可以誘使已驗證的使用者在不知情的情況下，在你的網站上執行動作。

`HttpClient` 支援一種用來防止 XSRF 攻擊的[常見機制](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token)。
執行 HTTP 請求時，攔截器會從 Cookie 讀取權杖（預設為 `XSRF-TOKEN`），並將它設為 HTTP 標頭 `X-XSRF-TOKEN`。
因為只有在你的網域上執行的程式碼才能讀取這個 Cookie，後端可以確定該 HTTP 請求來自你的用戶端應用程式，而非攻擊者。

依預設，攔截器會在所有發往相對 URL 的異動請求（例如 POST）上傳送這個標頭，但不會在 GET/HEAD 請求或使用絕對 URL 的請求上傳送。

若要利用這項機制，伺服器需要在頁面載入時或第一次 GET 請求時，在一個 JavaScript 可讀取、名為 `XSRF-TOKEN` 的工作階段 Cookie 中設定權杖。
在後續請求中，伺服器可以驗證 Cookie 與 `X-XSRF-TOKEN` HTTP 標頭是否相符，藉此確定只有在你的網域上執行的程式碼才能發出該請求。
權杖必須對每位使用者都是唯一的，而且必須能由伺服器驗證；這樣可以防止用戶端自行編造權杖。
請將權杖設為網站驗證 Cookie 加鹽後的摘要，以提高安全性。

為了防止多個 Angular 應用程式共用相同網域或子網域的環境發生衝突，請為每個應用程式指定唯一的 Cookie 名稱。

<div class="alert is-important">

*`HttpClient` 只支援 XSRF 防護機制的用戶端部分。*
你的後端服務必須設定為替你的頁面設定 Cookie，並驗證所有符合條件的請求都帶有該標頭。
否則 Angular 的預設防護將失效。

</div>

## 設定自訂 Cookie/標頭名稱

如果你的後端服務為 XSRF 權杖 Cookie 或標頭使用不同的名稱，請使用 `HttpClientXsrfModule.withOptions()` 覆寫預設值。

<code-example path="http/src/app/app.module.ts" region="xsrf"></code-example>

<a id="testing-requests"></a>

@reviewed 2022-11-14
