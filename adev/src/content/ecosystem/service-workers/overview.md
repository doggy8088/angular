# Angular service worker 概述

服務工作者擴充傳統的網路部署模型，並授權應用程式提供可靠性與效能均可與在作業系統與硬體上執行的程式碼相提並論的使用者體驗。
將服務工作者新增至 Angular 應用程式是將應用程式轉換成 [漸進式網路應用程式](https://web.dev/progressive-web-apps/) (也稱為 PWA) 的步驟之一。

在最簡單的情況下，服務工作者是一個在網頁瀏覽器中執行的腳本，用於管理應用程式的快取。

Service workers 功能類似網路代理伺服器。
他們會攔截應用程式發出的所有傳出 HTTP 要求，並選擇如何回應這些要求。
例如，他們可以查詢本機快取，並在有快取回應時提供快取回應。
代理伺服器不限於透過程式設計 API（例如 `fetch`）提出的要求；它還包括 HTML 中參照的資源，甚至對 `index.html` 的初始要求。
因此，基於 Service worker 的快取完全可程式設計，而且不依賴伺服器指定的快取標頭。

不像構成應用程式的其他腳本，例如 Angular 應用程式組合，服務工作者在使用者關閉分頁後仍然存在。
瀏覽器下次載入應用程式時，服務工作者會先載入，並且可以攔截載入應用程式的每個資源請求。
如果服務工作者設計為執行此操作，它就可以*完全滿足應用程式的載入，而不需要網路*。

即使在快速可靠的網路中，載入應用程式時，來回延遲可能會造成顯著的延遲。
使用服務工作者來減少對網路的依賴，可以顯著改善使用者體驗。

## Angular 中的 Service Worker

Angular 應用程式，作為單頁式應用程式，處於有利位置，可以從服務工作者的優勢中受益。Angular 具備服務工作者實作。Angular 開發人員可以利用這個服務工作者，並從它所提供的增強可靠性和效能中受益，而無需針對低階層 API 進行編碼。

Angular 的服務工作者旨在優化最終用戶在速度慢或不可靠的網路連線中使用應用程式的體驗，同時也將提供過時內容的風險降至最低。

為了達成此目的，Angular 服務工作遵循以下準則：

* 快取應用程式就像安裝原生應用程式。
    應用程式作為一個單元快取，所有檔案一起更新。

* 正在執行的應用程式會繼續執行所有檔案的相同版本。
    它不會突然開始接收來自較新版本且可能不相容的快取檔案。

* 當使用者重新整理應用程式時，他們會看到最新完全快取的版本。
    新的分頁載入最新快取的程式碼。

* 更新會在變更發佈後相對快速的背景中發生。
    在更新安裝並準備好之前，會提供應用程式的先前版本。

* 服務工作者在可能的情況下會節省頻寬。
    資源僅在變更時下載。

為了支援這些行為，Angular service worker 會從伺服器載入一個 *manifest* 檔案。
檔案稱為 `ngsw.json`（不要與 [web app manifest](https://developer.mozilla.org/docs/Web/Manifest) 混淆），描述要快取的資源，並包含每個檔案內容的雜湊值。
當應用程式的更新已部署時，宣告變更的內容，通知 service worker 應下載並快取新版本的應用程式。
此宣告會從 CLI 產生的組態檔 `ngsw-config.json` 產生。

安裝 Angular 服務工作者和 [執行 Angular CLI 指令](ecosystem/service-workers/getting-started#adding-a-service-worker-to-your-project) 一樣簡單。
除了向瀏覽器註冊 Angular 服務工作者之外，這也會讓幾個可用於注入的服務與服務工作者互動，並可被用來控制它。
例如，應用程式可以要求在有新的更新可用時收到通知，或是應用程式可以要求服務工作者檢查伺服器是否有可用的更新。

## 開始之前

若要使用 Angular 服務工作者的所有功能，請使用最新版本的 Angular 和 [Angular CLI](tools/cli)。

服務人員要被註冊，該應用程式必須透過 HTTPS 而不是 HTTP 存取。
瀏覽器會忽略透過不安全的連線提供服務的頁面上的服務人員。
原因在於服務人員相當強大，因此需要特別小心以確保服務人員腳本沒有被竄改。

這個規則有一個例外：為了讓在地開發更直接，瀏覽器在存取 `localhost` 上的應用程式時*不*需要安全連線。

### 瀏覽器支援

若要受益於 Angular service worker，您的應用程式必須在支援一般服務工作者的網路瀏覽器中執行。
目前，服務工作者在最新版本的 Chrome、Firefox、Edge、Safari、Opera、UC 瀏覽器 (Android 版本) 和 Samsung Internet 中受到支援。
IE 和 Opera Mini 等瀏覽器不支援服務工作者。

如果使用者使用不支援服務工作者的瀏覽器存取您的應用程式，則服務工作者不會註冊，而且相關行為（例如離線快取管理和推播通知）不會發生。
更具體地說：

* 瀏覽器不會下載服務工作程序腳本和 `ngsw.json` 清單檔案
* 嘗試與服務工作程序進行互動，例如呼叫 `SwUpdate.checkForUpdate()`，會傳回被拒絕的承諾
* 相關服務的可觀察事件，例如 `SwUpdate.available`，不會被觸發

強烈建議您確保您的應用程式即使在瀏覽器中不支援服務工作也能正常運作。
儘管不支援的瀏覽器會忽略服務工作快取，但如果應用程式嘗試與服務工作互動，它仍會報告錯誤。
例如，呼叫 `SwUpdate.checkForUpdate()` 會傳回被拒絕的承諾。
為避免此類錯誤，請使用 `SwUpdate.isEnabled` 檢查是否已啟用 Angular 服務工作。

若要進一步了解其他支援服務工作者的瀏覽器，請參閱 [Can I Use](https://caniuse.com/#feat=serviceworkers) 頁面和 [MDN 文件](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)。

## 相關資源

本節中的其他文章特別說明服務工作者的 Angular 實作。

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="設定檔"/>
  <docs-pill href="ecosystem/service-workers/communications" title="與 Service Worker 通訊"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="推播通知"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell 模式"/>
</docs-pill-row>

有關服務工作者的更多資訊，請參閱 [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)。

有關瀏覽器支援的更多資訊，請參閱 [服務工作者：簡介](https://developers.google.com/web/fundamentals/primers/service-workers) 的 [瀏覽器支援](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) 部分、Jake Archibald 的 [服務工作者準備好了嗎？](https://jakearchibald.github.io/isserviceworkerready) 和 [Can I Use](https://caniuse.com/serviceworkers)。

如需更多建議和範例，請參閱：

<docs-pill-row>
  <docs-pill href="https://web.dev/precaching-with-the-angular-service-worker" title="使用 Angular Service Worker 進行預快取"/>
  <docs-pill href="https://web.dev/creating-pwa-with-angular-cli" title="使用 Angular CLI 建立 PWA"/>
</docs-pill-row>

## 下一步

若要開始使用 Angular 服務工作者，請參閱 [服務工作者入門](ecosystem/service-workers/getting-started)。
