# 與 Service Worker 通訊

將 `ServiceWorkerModule` 匯入 `AppModule` 不只是註冊 service worker，也提供了一些服務，讓你與 service worker 互動，並控制應用程式的快取。

#### 必要條件

對下列內容有基本的了解：
* [開始使用 service worker](guide/service-worker-getting-started)。

<hr />


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

你可以要求 service worker 檢查伺服器上是否已部署任何更新。如果你的網站經常變更，或想讓更新依排程發生，你可能會選擇這麼做。

使用 `checkForUpdate()` 方法來完成：

<code-example path="service-worker-getting-started/src/app/check-for-update.service.ts" header="check-for-update.service.ts"></code-example>

這個方法會回傳一個 `Promise`，表示更新檢查已成功完成，但不表示檢查是否因此發現更新。即使找到更新，service worker 仍必須成功下載變更的檔案，而這可能會失敗。若成功，`available` 事件會表示應用程式有新版本可用。

<div class="alert is-important">

為了避免對初始渲染造成負面影響，`ServiceWorkerModule` 預設會等待應用程式穩定，才註冊 ServiceWorker 指令碼。持續輪詢更新（例如使用 `interval()`）會讓應用程式無法穩定，ServiceWorker 指令碼將永遠不會向瀏覽器註冊。

你可以先等待應用程式穩定，再開始輪詢更新，以避免這種情況（如上例所示）。

請注意，你的應用程式所做的任何輪詢都是如此。更多資訊，請參閱 {@link ApplicationRef#isStable isStable} 文件。

</div>

### 強制啟用更新

如果目前的分頁需要立即更新至最新的應用程式版本，可以呼叫 `activateUpdate()` 方法來要求更新：

<code-example path="service-worker-getting-started/src/app/prompt-update.service.ts" header="prompt-update.service.ts" region="sw-activate"></code-example>

這樣做可能會破壞目前正在執行的應用程式的延遲載入，特別是當延遲載入的 chunk 使用帶有雜湊的檔案名稱時，這些名稱在每個版本都會變更。

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：
* [正式環境中的 Service Worker](guide/service-worker-devops)。
