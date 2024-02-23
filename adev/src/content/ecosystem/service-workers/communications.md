# 與 Service Worker 溝通

啟用服務工作者支援的功能不僅僅是註冊服務工作者；它還提供你可以用來與服務工作者互動並控制應用程式快取的服務。

## `SwUpdate` 服務

`SwUpdate` 服務讓您可以存取事件，這些事件會在服務工作者偵測並安裝應用程式的可用更新時指出。

`SwUpdate` 服務支援三個獨立作業：

* 在伺服器上 *偵測到* 更新版本、*安裝並準備好* 本機使用或 *安裝失敗* 時接收通知。
* 要求服務工作者檢查伺服器是否有新的更新。
* 要求服務工作者為當前分頁啟用最新版本的應用程式。

### 版本更新

`versionUpdates` 是 `SwUpdate` 的 `Observable` 屬性，會發出四種事件類型：

| 事件類型                      | 詳細資料 |
|:---                              |:---     |
| `VersionDetectedEvent`           | 當服務工作者在伺服器上偵測到新版本的應用程式，並且即將開始下載時發出。                                                   |
| `NoNewVersionDetectedEvent`      | 當服務工作者已檢查伺服器上應用程式的版本，但未找到新版本時發出。                                                            |
| `VersionReadyEvent`              | 當新版本的應用程式可供用戶端啟用時發出。可用於通知用戶有可用的更新，或提示他們重新整理頁面。 |
| `VersionInstallationFailedEvent` | 當安裝新版本失敗時發出。可供用於記錄/監控目的。                                                                      |

<docs-code header="log-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/log-update.service.ts" visibleRegion="sw-update"/>

### 檢查更新

可以要求服務人員檢查伺服器上是否已部署任何更新。
服務人員會在初始化期間和每次導覽請求時檢查更新，也就是說，當使用者從不同的地址導覽到您的應用程式時。
但是，如果您有經常變更的網站或希望更新按計畫發生，則可以選擇手動檢查更新。

使用 `checkForUpdate()` 方法執行此操作：

<docs-code header="check-for-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/check-for-update.service.ts"/>

此方法傳回一個 `Promise<boolean>` 表示是否有可啟用的更新。
檢查可能會失敗，這將導致 `Promise` 遭到拒絕。

<docs-callout important title="穩定性與服務工作者註冊">
為了避免對頁面的初始呈現造成負面影響，預設情況下，Angular 服務工作者服務會等待應用程式穩定長達 30 秒，然後再註冊 ServiceWorker 腳本。

例如，使用 [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 或 RxJS 的 [interval()](https://rxjs.dev/api/index/function/interval) 持續輪詢更新會防止應用程式穩定，而且 ServiceWorker 腳本直到達到 30 秒的上限之前才會向瀏覽器註冊。

這適用於您的應用程式執行的任何類型的輪詢。
請查看 [isStable](api/core/ApplicationRef#isStable) 文件以了解更多資訊。

透過在開始輪詢更新之前先等待應用程式穩定下來，可以避免延遲，如前一個範例所示。
或者，您可能想為 ServiceWorker 定義不同的 [註冊策略](api/service-worker/SwRegistrationOptions#registrationStrategy)。
</docs-callout>

### 更新到最新版本

當新版本準備就緒時，您可以透過重新載入頁面來將現有分頁更新到最新版本。
為了避免中斷使用者的進度，通常建議提示使用者並讓他們確認重新載入頁面和更新到最新版本是可以的：

<docs-code header="prompt-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/prompt-update.service.ts" visibleRegion="sw-version-ready"/>

<docs-callout important title="在不重新載入的情況下更新的安全">
呼叫 `activateUpdate()` 會將分頁更新至最新版本，而不會重新載入頁面，但這可能會損壞應用程式。

不重新載入更新可能會造成應用程式殼層與其他頁面資源（例如可能會在版本之間變更檔名的延遲載入區塊）之間的版本不相符。

只有在您確定它對您的特定用例安全時，才應使用 `activateUpdate()`。
</docs-callout>

### 處理無法復原的狀態

在某些情況下，服務工作者用來為客戶端提供服務的應用程式版本可能處於無法復原的損壞狀態，除非重新載入整個頁面。

例如，想像以下情境：

1. 用戶第一次打開應用程式，服務工作者會快取最新版本的應用程式。
    假設應用程式快取的資產包括 `index.html`、`main.<main-hash-1>.js` 和 `lazy-chunk.<lazy-hash-1>.js`。

1. 用戶關閉應用程式，一段時間沒有打開。
1. 過了一段時間後，伺服器部署了應用程式的較新版本。
    這個較新版本包括檔案 `index.html`、`main.<main-hash-2>.js` 和 `lazy-chunk.<lazy-hash-2>.js`。

重要：雜湊現在不同，因為檔案內容已變更。舊版本不再在伺服器上提供。

1. 與此同時，使用者的瀏覽器決定從快取中移除 `lazy-chunk.<lazy-hash-1>.js`。
    瀏覽器可能會決定從快取中移除特定（或全部）資源，以回收磁碟空間。

1. 使用者再次開啟應用程式。
    服務工作者提供它目前已知的最新版本，亦即舊版本（`index.html` 和 `main.<main-hash-1>.js`）。

1. 在某個稍後時間點，應用程式要求延遲載入的套件 `lazy-chunk.<lazy-hash-1>.js`。
1. 服務工作者無法在快取中找到資產（請記住瀏覽器已將其移除）。
    它也無法從伺服器擷取它（因為伺服器現在只有較新版本的 `lazy-chunk.<lazy-hash-2>.js`）。

在上述情境中，服務工作者無法提供通常會快取的資產。
那個特定應用程式版本已損壞，而且沒有辦法在不重新整理頁面的情況下修正用戶端的狀態。
在這種情況下，服務工作者會藉由傳送 `UnrecoverableStateEvent` 事件來通知用戶端。
請訂閱 `SwUpdate#unrecoverable` 以接收通知並處理這些錯誤。

<docs-code header="handle-unrecoverable-state.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" visibleRegion="sw-unrecoverable-state"/>

## 更深入了解 Angular 服務工作者

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="推播通知"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
</docs-pill-row>

