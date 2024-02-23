# 使用服務工作人員入門

這份文件說明如何啟用您使用 [Angular CLI](tools/cli) 建立的專案中的 Angular 服務工作者支援。然後使用一個範例向您展示服務工作者執行中的情況，展示載入和基本快取。

## 為您的專案新增 service worker

要設定專案中的 Angular 服務工作者，請執行下列 CLI 指令：

<docs-code language="shell">

ng add @angular/pwa

</docs-code>

CLI 使用下列動作將您的應用程式設定為使用服務工作者：

1. 將 `@angular/service-worker` 套件新增到您的專案。
1. 在 CLI 中啟用 Service Worker 建置支援。
1. 匯入 Service Worker 並將其註冊至應用程式的根提供者。
1. 更新 `index.html` 檔案：
    * 包括新增 `manifest.webmanifest` 檔案的連結
    * 新增 `theme-color` 的 meta 標籤
1. 安裝圖示檔案以支援已安裝的漸進式網路應用程式 (PWA)。
1. 建立名為 [`ngsw-config.json`](ecosystem/service-workers/config) 的 Service Worker 組態檔案，其中指定快取行為和其他設定。

現在，建構專案：

<docs-code language="shell">

ng build

</docs-code>

CLI 專案現已設定好使用 Angular 服務工作者。

## 服務工作者實戰：導覽

此部分示範一個實際運作的服務工作者，
使用一個範例應用程式。

### 初始載入

伺服器在埠 `8080` 上執行，請將您的瀏覽器指向 `http://localhost:8080`。
您的應用程式應該會正常載入。

提示：在測試 Angular 服務工作執行緒時，最好在瀏覽器中使用無痕或私人視窗，以確保服務工作執行緒不會讀取先前剩餘的狀態，這可能會導致意外行為。

HELPFUL：如果您不使用 HTTPS，則服務工作者只有在 `localhost` 上存取應用程式時才會被註冊。

### 模擬網路問題

若要模擬網路問題，請停用應用程式的網路互動。

在 Chrome 中：

1. 選取 **工具** &gt; **開發人員工具**（位於右上角的 Chrome 功能表中）。
1. 前往 **網路** 標籤。
1. 在 **限制速度** 下拉式功能表中選取 **離線**。

<img alt="在「網路」標籤中選取「離線」選項" src="https://angular.dev/assets/images/guide/service-worker/offline-option.png">

現在應用程式無法訪問網路互動。

對於不使用 Angular 服務工作者的應用程式，現在重新整理會顯示 Chrome 的網際網路中斷頁面，其中寫著「沒有網際網路連線」。

加入 Angular 服務工作程序後，應用程式行為會有所改變。
重新整理時，頁面會正常載入。

請查看 Network 標籤以驗證服務工作者是否處於活動狀態。

<img alt="請求標記為來自 ServiceWorker" src="https://angular.dev/assets/images/guide/service-worker/sw-active.png">

HELPFUL: 在「大小」欄位中，要求狀態為 `(ServiceWorker)`。
這表示資源並未從網路載入。
而是從 Service Worker 快取中載入。

### 正在快取什麼？

請注意，瀏覽器需要的所有檔案才能呈現這個應用程式都是快取的。
`ngsw-config.json` 樣板設定被設定成快取 CLI 使用的特定資源：

* `index.html`
* `favicon.ico`
* 建置產出 (JS 和 CSS 捆綁)
* `assets` 下的所有內容
* 直接位於已設定的 `outputPath` (預設為 `./dist/<project-name>/`) 或 `resourcesOutputPath` 下的圖片和字體。
如需瞭解這些選項的更多資訊，請參閱 `ng build` 的文件。

重要事項：所產生的 `ngsw-config.json` 包含可快取字型和圖像擴充功能的清單。在某些情況下，您可能想修改 glob 模式以符合您的需求。

重要：如果在產生設定檔之後修改了 `resourcesOutputPath` 或 `assets` 路徑，您需要手動在 `ngsw-config.json` 中變更路徑。

### 對您的應用程式進行變更

現在您已瞭解服務工作者如何快取您的應用程式，下一步是瞭解更新如何運作。
變更應用程式，然後觀察服務工作者安裝更新：

1. 如果你在無痕視窗中測試，請開啟第二個空白分頁。
    這會在測試期間保持無痕視窗和快取狀態。

1. 關閉應用程式分頁，但不要關閉視窗。
    這也應該會關閉開發人員工具。

1. 關閉 `http-server`（Ctrl-c）。
1. 開啟 `src/app/app.component.html` 以進行編輯。
1. 將文字 `Welcome to {{title}}!` 更改為 `Bienvenue à {{title}}!`。
1. 再次建置並執行伺服器：

    <docs-code language="shell">

    ng build
    npx http-server -p 8080 -c-1 dist/&lt;project-name&gt;/browser

    </docs-code>

### 在瀏覽器中更新你的應用程式

現在看看瀏覽器和服務工作者如何處理更新的應用程式。

1. 在同個視窗中再次開啟 [http://localhost:8080](http://localhost:8080)。
    會發生什麼事？

    <img alt="仍然顯示歡迎使用 Service Workers！" src="https://angular.dev/assets/images/guide/service-worker/welcome-msg-en.png">

    哪裡出錯了？
    _其實，什麼問題也沒有！_
    Angular 服務工作者正在執行工作，提供它已**安裝**的應用程式版本，即使有可用的更新。
    為了速度，服務工作者不會等到檢查更新後才提供它已快取的應用程式。

    查看 `http-server` 記錄，以查看服務工作者要求 `/ngsw.json`。

    <docs-code language="shell">
    [2023-09-07T00:37:24.372Z]  "GET /ngsw.json?ngsw-cache-bust=0.9365263935102124" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    </docs-code>

    服務工作者就是這樣檢查更新。

1. 更新頁面。

    <img alt="文字已變更為 Bienvenue à app！" src="https://angular.dev/assets/images/guide/service-worker/welcome-msg-fr.png">

    服務工作者在**背景中**安裝了更新版本的應用程式，在下一次載入或重新載入頁面時，服務工作者就會切換到最新版本。

## 更深入了解 Angular 服務工作者

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="設定檔"/>
  <docs-pill href="ecosystem/service-workers/communications" title="與 Service Worker 通訊"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="推播通知"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell 模式"/>
</docs-pill-row>
