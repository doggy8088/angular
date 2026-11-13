# HTTP — 攔截器使用案例

以下列出攔截器的數種常見用途。

## 設定預設標頭

應用程式常使用攔截器，為發出的請求設定預設標頭。

範例應用程式有一個會產生授權權杖的 `AuthService`。
以下是它的 `AuthInterceptor`，它會注入該服務以取得權杖，並為每個發出的請求加上帶有該權杖的授權標頭：

<code-example header="app/http-interceptors/auth-interceptor.ts" path="http/src/app/http-interceptors/auth-interceptor.ts"></code-example>

複製請求以設定新標頭的做法非常常見，因此有一個 `setHeaders` 捷徑可用：

<code-example path="http/src/app/http-interceptors/auth-interceptor.ts" region="set-header-shortcut"></code-example>

會修改標頭的攔截器可用於許多不同的操作，包括：

*   驗證／授權
*   快取行為；例如 `If-Modified-Since`
*   XSRF 防護

## 記錄請求與回應配對

因為攔截器可以*一起*處理請求與回應，所以它們可以執行諸如為整個 HTTP 操作計時與記錄等工作。

請看下列 `LoggingInterceptor`，它會擷取請求的時間與回應的時間，並使用注入的 `MessageService` 記錄結果與經過的時間。

<code-example header="app/http-interceptors/logging-interceptor.ts)" path="http/src/app/http-interceptors/logging-interceptor.ts" region="excerpt"></code-example>

RxJS 的 `tap` 運算子會擷取請求成功或失敗的狀態。
當回應 observable 回傳錯誤或完成時，RxJS 的 `finalize` 運算子會被呼叫，並將結果回報給 `MessageService`。

`tap` 與 `finalize` 都不會碰觸回傳給呼叫者的 observable 串流的值。

<a id="custom-json-parser"></a>

## 自訂 JSON 解析

攔截器可用來自訂實作取代內建的 JSON 解析。

下列範例中的 `CustomJsonInterceptor` 示範如何做到這一點。
如果被攔截的請求預期收到 `'json'` 回應，`responseType` 會改為 `'text'`，以停用內建的 JSON 解析。
接著回應會透過注入的 `JsonParser` 進行解析。

<code-example header="app/http-interceptors/custom-json-interceptor.ts" path="http/src/app/http-interceptors/custom-json-interceptor.ts" region="custom-json-interceptor"></code-example>

接著你可以實作自己的自訂 `JsonParser`。
以下是自訂 JsonParser，具備特殊的日期還原器。

<code-example header="app/http-interceptors/custom-json-interceptor.ts" path="http/src/app/http-interceptors/custom-json-interceptor.ts" region="custom-json-parser"></code-example>

你需要同時提供 `CustomParser` 與 `CustomJsonInterceptor`。

<code-example header="app/http-interceptors/index.ts" path="http/src/app/http-interceptors/index.ts" region="custom-json-interceptor"></code-example>

<a id="caching"></a>

## 快取請求

攔截器可以自行處理請求，不需要轉發給 `next.handle()`。

例如，你可能會決定快取某些請求與回應，以提升效能。
你可以將快取委派給攔截器，而不干擾現有的資料服務。

下列範例中的 `CachingInterceptor` 示範了這種做法。

<code-example header="app/http-interceptors/caching-interceptor.ts)" path="http/src/app/http-interceptors/caching-interceptor.ts" region="v1"></code-example>

*   `isCacheable()` 函式會判斷請求是否可快取。
    在這個範例中，只有發往套件搜尋 API 的 GET 請求可以快取。

*   如果請求不可快取，攔截器會將請求轉發給鏈中的下一個處理常式
*   如果在快取中找到可快取的請求，攔截器會回傳帶有快取回應的 `of()` *observable*，略過 `next` 處理常式與下游所有其他攔截器
*   如果可快取的請求不在快取中，程式碼會呼叫 `sendRequest()`。
    這個函式會將請求轉發給 `next.handle()`，最終呼叫伺服器並回傳伺服器的回應。

<a id="send-request"></a>

<code-example path="http/src/app/http-interceptors/caching-interceptor.ts" region="send-request"></code-example>

<div class="alert is-helpful">

請注意 `sendRequest()` 如何在回應返回應用程式的途中攔截它。
這個方法會將回應透過管道傳給 `tap()` 運算子，其回呼函式會將回應加入快取。

原始回應會原封不動地沿著攔截器鏈返回應用程式呼叫者。

資料服務（例如 `PackageSearchService`）並不知道，它們的某些 `HttpClient` 請求實際上回傳的是快取回應。

</div>


<a id="cache-refresh"></a>

## 使用攔截器請求多個值

`HttpClient.get()` 方法通常會回傳一個 observable，只發出一個值——資料或錯誤。
攔截器可以將其改為會發出[多個值](guide/observables)的 observable。

下列修訂版 `CachingInterceptor` 可以選擇性地回傳一個 observable：它會立即發出快取回應，將請求繼續送往套件搜尋 API，稍後再以更新後的搜尋結果再次發出。

<code-example path="http/src/app/http-interceptors/caching-interceptor.ts" region="intercept-refresh"></code-example>

<div class="alert is-helpful">

*先快取再重新整理*選項是由自訂 `x-refresh` 標頭的存在所觸發。

`PackageSearchComponent` 上的一個核取方塊會切換 `withRefresh` 旗標，它是 `PackageSearchService.search()` 的其中一個引數。
該 `search()` 方法會建立自訂的 `x-refresh` 標頭，並在呼叫 `HttpClient.get()` 之前將其加入請求。

</div>

修訂版 `CachingInterceptor` 無論是否有快取值都會建立伺服器請求，使用的是[上文](#send-request)所述的相同 `sendRequest()` 方法。
`results$` observable 會在被訂閱時發出請求。

*   如果沒有快取值，攔截器會回傳 `results$`。
*   如果有快取值，程式碼會將快取回應 *透過管道* 傳給 `results$`。這會產生一個重新組合的 observable，發出兩個回應，因此訂閱者會看到這兩個回應的序列：  
  *   立即發出的快取回應
  *   稍後發出的伺服器回應

<a id="report-progress"></a>

@reviewed 2022-11-08
