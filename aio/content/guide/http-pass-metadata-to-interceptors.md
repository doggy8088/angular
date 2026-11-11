# HTTP - 將中繼資料傳遞給攔截器

許多攔截器需要設定，或能從設定中受益。想像一個會重試失敗請求的攔截器。預設情況下，攔截器可能會重試請求三次，但對於特別容易出錯或敏感的請求，你可能會想覆寫這個重試次數。

`HttpClient` 請求包含一個 *context*，可以攜帶關於該請求的中繼資料。攔截器可以讀取或修改這個 context，不過在送出請求時，它不會被傳送到後端伺服器。這讓應用程式或其他攔截器可以用設定參數（例如重試請求的次數）來標記請求。

## 建立 context 權杖

Angular 使用 `HttpContextToken` 在 context 中儲存與擷取值。你可以使用 `new` 運算子建立 context 權杖，如下列範例所示：

<code-example header="creating a context token" path="http/src/app/http-interceptors/retry-interceptor.ts" region="context-token"></code-example>

在建立 `HttpContextToken` 時傳入的 lambda 函式 `() => 3` 有兩個用途：

1.  它讓 TypeScript 推斷這個權杖的型別：`HttpContextToken<number>`。請求 context 是型別安全的——從請求的 context 讀取權杖時，會回傳適當型別的值。

1.  它會設定權杖的預設值。這是當這個權杖未設定其他值時，請求 context 所回傳的值。使用預設值可以避免檢查某個特定值是否已設定。

## 發出請求時設定 context 值

發出請求時，你可以提供一個 `HttpContext` 執行個體，其中已設定好 context 值。

<code-example header="setting context values" path="http/src/app/http-interceptors/retry-interceptor.ts" region="set-context"></code-example>

## 在攔截器中讀取 context 值

在攔截器內，你可以使用 `HttpContext.get()` 讀取給定請求 context 中某個權杖的值。如果你沒有明確為該權杖設定值，Angular 會回傳該權杖中指定的預設值。

<code-example header="reading context values in an interceptor" path="http/src/app/http-interceptors/retry-interceptor.ts" region="reading-context"></code-example>

## Context 是可變的

與 `HttpRequest` 執行個體的其他大部分層面不同，請求 context 是可變的，而且會在請求的其他不可變轉換中持續存在。這讓攔截器可以透過 context 協調操作。例如，`RetryInterceptor` 範例可以使用第二個 context 權杖，來追蹤給定請求執行期間發生了多少錯誤：

<code-example header="coordinating operations through the context" path="http/src/app/http-interceptors/retry-interceptor.ts" region="mutable-context"></code-example>

@reviewed 2022-11-15
