# HTTP 用戶端 - 測試請求

如同任何外部相依性，你必須模擬 HTTP 後端，讓測試可以模擬與遠端伺服器的互動。`@angular/common/http/testing` 函式庫讓設定這種模擬變得簡單明瞭。

## HTTP 測試函式庫

此測試函式庫的設計模式是：應用程式先執行程式碼並發出請求。接著，測試預期某些請求已經或尚未發出，對這些請求進行斷言，最後透過對每個預期請求呼叫「flush」來提供回應。

最後，測試可以驗證應用程式沒有發出任何未預期的請求。

<div class="alert is-helpful">

你可以在即時編碼環境中執行 <live-example stackblitz="specs" name="http">這些範例測試</live-example>。

本指南所述的測試位於 `src/testing/http-client.spec.ts`。
在 `src/app/heroes/heroes.service.spec.ts` 中，也有一些測試會呼叫 `HttpClient` 的應用程式資料服務。

</div>

## 測試設定

若要開始測試對 `HttpClient` 的呼叫，請匯入 `HttpClientTestingModule` 與模擬控制器 `HttpTestingController`，以及測試所需的其他符號。

<code-example header="app/testing/http-client.spec.ts (imports)" path="http/src/testing/http-client.spec.ts" region="imports"></code-example>

接著將 `HttpClientTestingModule` 加入 `TestBed`，並繼續設定*受測服務*。

<code-example header="app/testing/http-client.spec.ts(setup)" path="http/src/testing/http-client.spec.ts" region="setup"></code-example>

現在，測試過程中發出的請求會打到測試後端，而不是一般的後端。

這個設定也會呼叫 `TestBed.inject()` 來注入 `HttpClient` 服務與模擬控制器，以便在測試期間參照它們。

## 預期並回應請求

現在你可以撰寫一個測試，預期會發生一個 GET 請求，並提供一個模擬回應。

<code-example header="app/testing/http-client.spec.ts (HttpClient.get)" path="http/src/testing/http-client.spec.ts" region="get-test"></code-example>

最後一個步驟 — 驗證沒有請求仍未處理 — 相當常見，你可以把它移到 `afterEach()` 步驟中：

<code-example path="http/src/testing/http-client.spec.ts" region="afterEach"></code-example>

### 自訂請求預期

如果僅以 URL 比對還不夠，你可以實作自己的比對函式。例如，你可以尋找帶有授權標頭的送出請求：

<code-example path="http/src/testing/http-client.spec.ts" region="predicate"></code-example>

如同先前的 `expectOne()`，如果有 0 個或 2 個以上的請求滿足這個述詞，測試就會失敗。

### 處理多個請求

如果你的測試需要回應重複的請求，請使用 `match()` API 而非 `expectOne()`。它接受相同的參數，但回傳一個符合條件的請求陣列。回傳後，這些請求會從後續的比對中移除，你需要負責對它們送出回應並驗證。

<code-example path="http/src/testing/http-client.spec.ts" region="multi-request"></code-example>

## 測試錯誤

你應該測試應用程式對失敗的 HTTP 請求的防禦能力。

使用錯誤訊息呼叫 `request.flush()`，如下列範例所示。

<code-example path="http/src/testing/http-client.spec.ts" region="404"></code-example>

或者，使用 `ProgressEvent` 呼叫 `request.error()`。

<code-example path="http/src/testing/http-client.spec.ts" region="network-error"></code-example>

@reviewed 2022-11-14
