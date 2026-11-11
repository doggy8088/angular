# 與 Service Worker 通訊

啟用 Service Worker 支援不只是註冊 Service Worker 而已，它還提供多個服務，讓你與 Service Worker 互動，並控制應用程式的快取行為。

## `SwUpdate` 服務

`SwUpdate` 服務讓你存取多個事件，這些事件會指出 Service Worker 何時發現並安裝應用程式可用的更新。

`SwUpdate` 服務支援三種獨立的操作：

- 在伺服器上_偵測_到新版本、_已安裝並準備好_可在本機使用，或_安裝失敗_時，接收通知。
- 要求 Service Worker 向伺服器檢查新更新。
- 要求 Service Worker 為目前的分頁啟用最新版本的應用程式。

### 版本更新

`versionUpdates` 是 `SwUpdate` 的 `Observable` 屬性，會發送四種事件類型：

| 事件類型                         | 詳細說明                                                                                                                    |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `VersionDetectedEvent`           | 當 Service Worker 在伺服器上偵測到應用程式的新版本，並即將開始下載時發送。                                                    |
| `NoNewVersionDetectedEvent`      | 當 Service Worker 已檢查伺服器上的應用程式版本，且沒有找到新版本時發送。                                                      |
| `VersionReadyEvent`              | 當應用程式的新版本可供用戶端啟用時發送。可用來通知使用者有可用更新，或提示他們重新整理頁面。                                    |
| `VersionInstallationFailedEvent` | 當新版本安裝失敗時發送。可用於記錄／監控用途。                                                                                |

<docs-code header="log-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/log-update.service.ts" visibleRegion="sw-update"/>

### 檢查更新

你可以要求 Service Worker 檢查伺服器上是否已部署任何更新。
Service Worker 會在初始化期間以及每次導覽請求時檢查更新——也就是使用者從不同位址導覽到你的應用程式時。
不過，如果你的網站經常變更，或想讓更新依排程發生，你也可以選擇手動檢查更新。

使用 `checkForUpdate()` 方法來完成：

<docs-code header="check-for-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/check-for-update.service.ts"/>

這個方法會回傳一個 `Promise<boolean>`，指出是否有可供啟用的更新。
檢查可能會失敗，這會導致 `Promise` 被拒絕。

<docs-callout important title="穩定狀態與 Service Worker 註冊">
為了避免對頁面的初始渲染造成負面影響，Angular Service Worker 服務預設會等待應用程式穩定，最多等待 30 秒，之後才註冊 ServiceWorker 指令碼。

持續輪詢更新，例如使用 [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 或 RxJS 的 [interval()](https://rxjs.dev/api/index/function/interval)，會讓應用程式無法穩定，ServiceWorker 指令碼也就不會註冊到瀏覽器，直到達到 30 秒的上限為止。

你的應用程式所做的任何輪詢都是如此。
更多資訊，請參閱 [isStable](api/core/ApplicationRef#isStable) 文件。

若要避免這段延遲，請如前例所示，先等待應用程式穩定，再開始輪詢更新。
或者，你也可以為 ServiceWorker 定義不同的[註冊策略](api/service-worker/SwRegistrationOptions#registrationStrategy)。
</docs-callout>

### 更新到最新版本

你可以在新版本準備好時，立即重新載入頁面，把既有分頁更新到最新版本。
為了避免打斷使用者的進度，一般來說，最好先提示使用者，讓他們確認可以重新載入頁面並更新到最新版本：

<docs-code header="prompt-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/prompt-update.service.ts" visibleRegion="sw-version-ready"/>

<docs-callout important title="不重新載入就更新的安全性">
呼叫 `activateUpdate()` 可以不重新載入頁面就把分頁更新到最新版本，但這可能會讓應用程式損壞。

不重新載入就更新，可能會造成應用程式殼層與其他頁面資源之間的版本不一致，例如延遲載入的 chunk，它們的檔案名稱可能會在版本之間變更。

你只應該在確定對你的特定使用情境是安全的情況下，才使用 `activateUpdate()`。
</docs-callout>

### 處理無法復原的狀態

在某些情況下，Service Worker 用來服務用戶端的應用程式版本，可能處於損壞狀態，若不完整重新載入頁面就無法復原。

例如，想像以下情境：

1. 使用者第一次開啟應用程式，Service Worker 快取了最新版本的應用程式。
   假設應用程式已快取的資產包括 `index.html`、`main.<main-hash-1>.js` 與 `lazy-chunk.<lazy-hash-1>.js`。

1. 使用者關閉應用程式，一段時間沒有再開啟。
1. 過了一段時間後，新版本的應用程式部署到伺服器。
   這個較新的版本包括 `index.html`、`main.<main-hash-2>.js` 與 `lazy-chunk.<lazy-hash-2>.js` 等檔案。

IMPORTANT: 現在雜湊值不同了，因為檔案內容已變更。舊版本在伺服器上已不再可用。

1. 同時，使用者的瀏覽器決定把 `lazy-chunk.<lazy-hash-1>.js` 從快取中清除。
   瀏覽器可能會為了回收磁碟空間，決定清除快取中的特定（或全部）資源。

1. 使用者再次開啟應用程式。
   Service Worker 提供它此時所知的最新版本，也就是舊版本（`index.html` 與 `main.<main-hash-1>.js`）。

1. 在稍後的某個時間點，應用程式請求延遲載入的 bundle：`lazy-chunk.<lazy-hash-1>.js`。
1. Service Worker 在快取中找不到該資產（記得它已被瀏覽器清除）。
   它也無法從伺服器取得（因為伺服器現在只有較新版本的 `lazy-chunk.<lazy-hash-2>.js`）。

在上述情境中，Service Worker 無法提供一個通常會被快取的資產。
該應用程式版本已損壞，若不重新載入頁面，就無法修復用戶端的狀態。
在這種情況下，Service Worker 會發送一個 `UnrecoverableStateEvent` 事件來通知用戶端。
訂閱 `SwUpdate#unrecoverable` 即可收到通知並處理這些錯誤。

<docs-code header="handle-unrecoverable-state.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" visibleRegion="sw-unrecoverable-state"/>

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="推播通知"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker 運維"/>
</docs-pill-row>
