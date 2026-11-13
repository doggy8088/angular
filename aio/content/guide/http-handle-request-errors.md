# HTTP 用戶端 — 處理請求錯誤

如果請求在伺服器上失敗，`HttpClient` 會回傳一個 *error* 物件，而非成功的回應。

執行伺服器交易的服務，也應該負責檢查、解讀與處理錯誤。

發生錯誤時，你可以取得失敗的詳細資訊，告知使用者。
在某些情況下，你也可以自動[重試請求](#retry)。

<a id="error-details"></a>

## 取得錯誤詳細資訊

當資料存取失敗時，應用程式應該給使用者有用的回饋。
原始的錯誤物件作為回饋並不是特別有用。
除了偵測到發生錯誤之外，你還需要取得錯誤詳細資訊，並利用這些資訊組成對使用者友善的回應。

可能會發生兩種錯誤。

*   伺服器後端可能會拒絕請求，回傳帶有狀態碼（例如 404 或 500）的 HTTP 回應。
    這些是錯誤 *回應*。

*   用戶端也可能出問題，例如網路錯誤導致請求無法順利完成，或 RxJS 運算子中拋出的例外。
    這些錯誤的 `status` 為 `0`，且 `error` 屬性包含一個 `ProgressEvent` 物件，其 `type` 可能提供進一步的資訊。

`HttpClient` 會將這兩種錯誤都收進 `HttpErrorResponse`。
檢查該回應，找出錯誤的原因。

下列範例在先前定義的 ConfigService 中定義了一個錯誤處理常式。

<code-example header="app/config/config.service.ts (handleError)" path="http/src/app/config/config.service.ts" region="handleError"></code-example>

這個處理常式會回傳一個帶有使用者友善錯誤訊息的 RxJS `ErrorObservable`。
下列程式碼會更新 `getConfig()` 方法，使用[管道](guide/pipes "Pipes guide")將 `HttpClient.get()` 呼叫回傳的所有 observable 傳送給錯誤處理常式。

<code-example header="app/config/config.service.ts (getConfig v.3 with error handler)" path="http/src/app/config/config.service.ts" region="getConfig_3"></code-example>

<a id="retry"></a>

## 重試失敗的請求

有時候錯誤是暫時性的，再試一次就會自動消失。
例如，在行動裝置情境中網路中斷很常見，再試一次可能就會成功。

[RxJS 函式庫](guide/rx-library)提供數個 *retry* 運算子。
例如，`retry()` 運算子會自動以指定的次數重新訂閱失敗的 `Observable`。
*重新訂閱* `HttpClient` 方法呼叫的結果，效果等同於重新發出 HTTP 請求。

下列範例示範如何將失敗的請求透過管道傳給 `retry()` 運算子，再傳給錯誤處理常式。

<code-example header="app/config/config.service.ts (getConfig with retry)" path="http/src/app/config/config.service.ts" region="getConfig"></code-example>

## 傳送資料到伺服器

除了從伺服器擷取資料之外，`HttpClient` 也支援 PUT、POST、DELETE 等其他 HTTP 方法，可用來修改遠端資料。

本指南的範例應用程式包含「Tour of Heroes」範例的精簡版，它會擷取英雄資料，並讓使用者新增、刪除與更新英雄。
以下各節示範範例應用程式 `HeroesService` 中的資料更新方法。

@reviewed 2023-02-27
