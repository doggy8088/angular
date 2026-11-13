# 與 Service Worker 通訊

將 `ServiceWorkerModule` 匯入 `AppModule` 不只是註冊 service worker，也提供了一些服務，讓你與 service worker 互動，並控制應用程式的快取。

#### 必要條件

對下列內容有基本的了解：
* [開始使用 service worker](guide/service-worker-getting-started)。


## `SwUpdate` 服務

`SwUpdate` 服務讓你存取多個事件，這些事件會指出 service worker 何時發現應用程式可用的更新，或何時啟用該更新&mdash;也就是它開始把該更新的內容提供給你的應用程式。

`SwUpdate` 服務支援四種獨立的操作：
* 收到 *available* 更新的通知。這些是應用程式的新版本，會在頁面重新整理時載入。
* 收到更新 *activation* 的通知。這是指 service worker 立即開始提供應用程式的新版本。
* 要求 service worker 檢查伺服器是否有新更新。
* 要求 service worker 為目前的分頁啟用最新版本的應用程式。

### 可用與已啟用的更新

這兩個更新事件 `available` 與 `activated`，是 `SwUpdate` 的 `Observable` 屬性：

<code-example path="service-worker-getting-started/src/app/log-update.service.ts" header="log-update.service.ts" region="sw-update"></code-example>


使用這些事件，在有待處理的更新時通知使用者，或在使用者執行的程式碼過舊時重新整理他們的頁面。

### 檢查更新

你可以要求 service worker 檢查伺服器上是否已部署任何更新。service worker 會在初始化期間以及每次導覽請求時檢查更新&mdash;也就是使用者從不同位址導覽到你的應用程式時。不過，如果你的網站經常變更，或想讓更新依排程發生，你也可以選擇手動檢查更新。

使用 `checkForUpdate()` 方法來完成：

<code-example path="service-worker-getting-started/src/app/check-for-update.service.ts" header="check-for-update.service.ts"></code-example>

這個方法會回傳一個 `Promise`，表示更新檢查已成功完成，但不表示檢查是否因此發現更新。即使找到更新，service worker 仍必須成功下載變更的檔案，而這可能會失敗。若成功，`available` 事件會表示應用程式有新版本可用。

<div class="alert is-important">

為了避免對頁面的初始渲染造成負面影響，`ServiceWorkerModule` 預設會等待應用程式穩定，最多等待 30 秒，才註冊 ServiceWorker 指令碼。持續輪詢更新，例如使用 [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 或 RxJS 的 [interval()](https://rxjs.dev/api/index/function/interval)，會讓應用程式無法穩定，ServiceWorker 指令碼要等到 30 秒上限到達後才會向瀏覽器註冊。

請注意，你的應用程式所做的任何輪詢都是如此。更多資訊，請參閱 {@link ApplicationRef#isStable isStable} 文件。

若要避免這段延遲，請如前例所示，先等待應用程式穩定，再開始輪詢更新。或者，你也可以為 ServiceWorker 定義不同的 {@link SwRegistrationOptions#registrationStrategy 註冊策略}。

</div>

### 強制啟用更新

如果目前的分頁需要立即更新至最新的應用程式版本，可以呼叫 `activateUpdate()` 方法來要求更新：

<code-example path="service-worker-getting-started/src/app/prompt-update.service.ts" header="prompt-update.service.ts" region="sw-activate"></code-example>

<div class="alert is-important">

在不重新載入頁面的情況下呼叫 `activateUpdate()`，可能會破壞目前正在執行的應用程式的延遲載入，特別是當延遲載入的 chunk 使用帶有雜湊的檔案名稱時，這些名稱在每個版本都會變更。因此，建議在 `activateUpdate()` 回傳的 promise 完成後重新載入頁面。

</div>

### 處理無法復原的狀態

在某些情況下，service worker 用來服務用戶端的應用程式版本，可能處於損壞狀態，若不完整重新載入頁面就無法復原。

例如，想像以下情境：
- 使用者第一次開啟應用程式，service worker 快取了最新版本的應用程式。假設應用程式已快取的資產包括 `index.html`、`main.<main-hash-1>.js` 與 `lazy-chunk.<lazy-hash-1>.js`。
- 使用者關閉應用程式，一段時間沒有再開啟。
- 過了一段時間後，新版本的應用程式部署到伺服器。這個較新的版本包括 `index.html`、`main.<main-hash-2>.js` 與 `lazy-chunk.<lazy-hash-2>.js` 這些檔案（請注意，雜湊值現在不同了，因為檔案內容已變更）。舊版本在伺服器上已不再提供。
- 同時，使用者的瀏覽器決定把 `lazy-chunk.<lazy-hash-1>.js` 從快取中清除。瀏覽器可能會為了回收磁碟空間，決定清除快取中的特定（或全部）資源。
- 使用者再次開啟應用程式。service worker 提供它此時所知的最新版本，也就是舊版本（`index.html` 與 `main.<main-hash-1>.js`）。
- 在稍後的某個時間點，應用程式請求延遲載入的 bundle：`lazy-chunk.<lazy-hash-1>.js`。
- service worker 在快取中找不到該資產（記得它已被瀏覽器清除）。它也無法從伺服器取得（因為伺服器現在只有較新版本的 `lazy-chunk.<lazy-hash-2>.js`）。

在上述情境中，service worker 無法提供一個通常會被快取的資產。該應用程式版本已損壞，若不重新載入頁面，就無法修復用戶端的狀態。在這種情況下，service worker 會發送一個 `UnrecoverableStateEvent` 事件來通知用戶端。訂閱 `SwUpdate#unrecoverable` 即可收到通知並處理這些錯誤。

<code-example path="service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" header="handle-unrecoverable-state.service.ts" region="sw-unrecoverable-state"></code-example>


## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：
* [正式環境中的 Service Worker](guide/service-worker-devops)。
