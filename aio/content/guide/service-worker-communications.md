# 與 Service Worker 通訊

將 `ServiceWorkerModule` 匯入 `AppModule` 不只是註冊 service worker，也提供了一些服務，讓你與 service worker 互動，並控制應用程式的快取。

## 必要條件

對下列內容有基本的了解：

*   [開始使用 service worker](guide/service-worker-getting-started)

## `SwUpdate` 服務

`SwUpdate` 服務讓你存取多個事件，這些事件會指出 Service Worker 何時發現並安裝應用程式可用的更新。

`SwUpdate` 服務支援三種獨立的操作：

*   當更新版本在伺服器上被*偵測*到、在本機*安裝完成可供使用*，或*安裝失敗*時，收到通知
*   要求 service worker 檢查伺服器是否有新更新
*   要求 service worker 為目前的分頁啟用最新版本的應用程式

### 版本更新

`versionUpdates` 是 `SwUpdate` 的 `Observable` 屬性，會發送四種事件類型：

| 事件類型                         | 詳細說明                                                                                                                    |
|:---                              |:---                                                                                                                         |
| `VersionDetectedEvent`           | 當 Service Worker 在伺服器上偵測到應用程式的新版本，並即將開始下載時發送。                                                    |
| `NoNewVersionDetectedEvent`      | 當 Service Worker 已檢查伺服器上的應用程式版本，且沒有找到新版本時發送。                                                      |
| `VersionReadyEvent`              | 當應用程式的新版本可供用戶端啟用時發送。可用來通知使用者有可用更新，或提示他們重新整理頁面。                                    |
| `VersionInstallationFailedEvent` | 當新版本安裝失敗時發送。可用於記錄／監控用途。                                                                                |

<code-example header="log-update.service.ts" path="service-worker-getting-started/src/app/log-update.service.ts" region="sw-update"></code-example>

### 檢查更新

你可以要求 Service Worker 檢查伺服器上是否已部署任何更新。
Service Worker 會在初始化期間以及每次導覽請求時檢查更新——也就是使用者從不同位址導覽到你的應用程式時。
不過，如果你的網站經常變更，或想讓更新依排程發生，你也可以選擇手動檢查更新。

使用 `checkForUpdate()` 方法來完成：

<code-example header="check-for-update.service.ts" path="service-worker-getting-started/src/app/check-for-update.service.ts"></code-example>

這個方法會回傳一個 `Promise<boolean>`，指出是否有可供啟用的更新。
檢查可能會失敗，這會導致 `Promise` 被拒絕。

<div class="alert is-important">

為了避免對頁面的初始渲染造成負面影響，`ServiceWorkerModule` 預設會等待應用程式穩定，最多等待 30 秒，才註冊 ServiceWorker 指令碼。
持續輪詢更新，例如使用 [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 或 RxJS 的 [interval()](https://rxjs.dev/api/index/function/interval)，會讓應用程式無法穩定，ServiceWorker 指令碼要等到 30 秒上限到達後才會向瀏覽器註冊。

<div class="alert is-helpful">

**NOTE**: <br />
你的應用程式所做的任何輪詢都是如此。
更多資訊，請參閱 [isStable](api/core/ApplicationRef#isStable) 文件。

</div>

若要避免這段延遲，請如前例所示，先等待應用程式穩定，再開始輪詢更新。
或者，你也可以為 ServiceWorker 定義不同的[註冊策略](api/service-worker/SwRegistrationOptions#registrationStrategy)。

</div>

### 更新到最新版本

你可以在新版本準備好時，立即重新載入頁面，把既有分頁更新到最新版本。
為了避免打斷使用者的進度，一般來說，最好先提示使用者，讓他們確認可以重新載入頁面並更新到最新版本：

<code-example header="prompt-update.service.ts" path="service-worker-getting-started/src/app/prompt-update.service.ts" region="sw-version-ready"></code-example>

<div class="alert is-important">

呼叫 {@link SwUpdate#activateUpdate SwUpdate#activateUpdate()} 可以在不重新載入頁面的情況下，把分頁更新到最新版本，但這可能會破壞應用程式。

不重新載入就更新，可能會造成[應用程式殼層](guide/glossary#應用程式殼層（app-shell）)與其他頁面資源（例如[延遲載入的 chunk](guide/glossary#延遲載入（lazy-loading）)，其檔案名稱可能在版本之間變更）之間的版本不一致。

你只應該在確定對你的特定使用情境是安全的情況下，才使用 `activateUpdate()`。

</div>

### 處理無法復原的狀態

在某些情況下，Service Worker 用來服務用戶端的應用程式版本，可能處於損壞狀態，若不完整重新載入頁面就無法復原。

例如，想像以下情境：

*   使用者第一次開啟應用程式，Service Worker 快取了最新版本的應用程式。
   假設應用程式已快取的資產包括 `index.html`、`main.<main-hash-1>.js` 與 `lazy-chunk.<lazy-hash-1>.js`。

*   使用者關閉應用程式，一段時間沒有再開啟。
*   過了一段時間後，新版本的應用程式部署到伺服器。
   這個較新的版本包括 `index.html`、`main.<main-hash-2>.js` 與 `lazy-chunk.<lazy-hash-2>.js` 這些檔案。

    <div class="alert is-helpful">

    **NOTE**: <br />
    雜湊值現在不同了，因為檔案內容已變更。

    </div>

    舊版本在伺服器上已不再提供。

*   同時，使用者的瀏覽器決定把 `lazy-chunk.<lazy-hash-1>.js` 從快取中清除。
   瀏覽器可能會為了回收磁碟空間，決定清除快取中的特定（或全部）資源。

*   使用者再次開啟應用程式。
   Service Worker 提供它此時所知的最新版本，也就是舊版本（`index.html` 與 `main.<main-hash-1>.js`）。

*   在稍後的某個時間點，應用程式請求延遲載入的 bundle：`lazy-chunk.<lazy-hash-1>.js`。
*   Service Worker 在快取中找不到該資產（記得它已被瀏覽器清除）。
   它也無法從伺服器取得（因為伺服器現在只有較新版本的 `lazy-chunk.<lazy-hash-2>.js`）。

在上述情境中，Service Worker 無法提供一個通常會被快取的資產。
該應用程式版本已損壞，若不重新載入頁面，就無法修復用戶端的狀態。
在這種情況下，Service Worker 會發送一個 `UnrecoverableStateEvent` 事件來通知用戶端。
訂閱 `SwUpdate#unrecoverable` 即可收到通知並處理這些錯誤。

<code-example header="handle-unrecoverable-state.service.ts" path="service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" region="sw-unrecoverable-state"></code-example>

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：

*   [推播通知](guide/service-worker-notifications)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
