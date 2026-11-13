# Angular service worker 簡介

Service worker 強化了傳統的 Web 部署模式，讓應用程式能提供與在作業系統與硬體上原生執行的程式碼同等級的可靠性與效能體驗。
將 service worker 加入 Angular 應用程式，是把應用程式轉變為 [Progressive Web App](https://web.dev/progressive-web-apps/)（也稱為 PWA）的步驟之一。

最簡單來說，service worker 是一個在 Web 瀏覽器中執行的指令碼，負責管理應用程式的快取。

Service worker 扮演網路 proxy 的角色。
它們會攔截應用程式發出的所有 HTTP 請求，並能自行決定如何回應這些請求。
例如，它們可以查詢本機快取，若有可用的快取回應就直接傳回。
Proxy 的攔截不限於透過 `fetch` 等程式化 API 發出的請求，也包括 HTML 中參照的資源，甚至最初對 `index.html` 的請求。
因此，基於 service worker 的快取是完全可程式化的，不依賴伺服器指定的快取標頭。

與構成應用程式的其他指令碼（例如 Angular 應用程式套件）不同，service worker 在使用者關閉分頁後仍會保留下來。
下次瀏覽器載入應用程式時，service worker 會先載入，並能攔截載入應用程式所需的每一個資源請求。
如果 service worker 的設計如此，它可以_完全滿足應用程式的載入，完全不需要網路_。

即使在快速可靠的網路上，來回延遲在載入應用程式時仍可能造成顯著的延遲。
使用 service worker 降低對網路的依賴，可以大幅改善使用者體驗。

## Angular 中的 service worker

Angular 應用程式作為單頁應用程式，正好能充分受益於 service worker 的優勢。從 5.0.0 版開始，Angular 隨附 service worker 實作。Angular 開發者可以直接利用這個 service worker，享受它帶來的可靠性與效能提升，無需針對低階 API 撰寫程式。

Angular 的 service worker 旨在最佳化最終使用者在緩慢或不可靠的網路連線下使用應用程式的體驗，同時將提供過時內容的風險降到最低。

為了達成這一點，Angular service worker 遵循下列指導原則：

*   快取應用程式就像安裝原生應用程式一樣。
    應用程式會作為一個整體被快取，所有檔案一起更新。

*   執行中的應用程式會持續使用相同版本的全部檔案。
    它不會突然開始接收來自較新版本的快取檔案，因為這些檔案很可能不相容。

*   當使用者重新整理應用程式時，他們看到的是最新且完整快取的版本。
    新分頁會載入最新快取的程式碼。

*   更新在背景進行，在變更發布後相對快速地完成。
    在更新安裝完成並準備就緒之前，會持續提供前一版本的應用程式。

*   Service worker 會盡可能節省頻寬。
    資源只有在變更時才會下載。

為了支援這些行為，Angular service worker 會從伺服器載入一份 _manifest_ 檔案。
這個名為 `ngsw.json` 的檔案（不要與 [web app manifest](https://developer.mozilla.org/docs/Web/Manifest) 混淆）描述了要快取的資源，並包含每個檔案內容的雜湊值。
當應用程式的更新部署後，manifest 的內容隨之改變，通知 service worker 應該下載並快取新版本的應用程式。
這份 manifest 是由 CLI 產生的設定檔 `ngsw-config.json` 所生成的。

安裝 Angular service worker 就像加入一個 `NgModule` 一樣簡單。除了向瀏覽器註冊 Angular service worker 之外，這也會提供幾個可注入的服務，讓你與 service worker 互動並加以控制。例如，應用程式可以要求在有新更新可用時收到通知，也可以要求 service worker 檢查伺服器上是否有可用的更新。

## 先決條件

若要使用 Angular service worker 的所有功能，請使用最新版本的 Angular 與 Angular CLI。

若要註冊 service worker，應用程式必須透過 HTTPS 存取，而不是 HTTP。
瀏覽器會忽略透過不安全連線提供的頁面上的 service worker。
原因是 service worker 相當強大，因此需要格外小心，確保 service worker 指令碼未被竄改。

這條規則有一個例外：為了讓本機開發更簡單，瀏覽器在存取 `localhost` 上的應用程式時，_不_要求安全連線。

### 瀏覽器支援

若要受益於 Angular service worker，你的應用程式必須在普遍支援 service worker 的 Web 瀏覽器中執行。
目前，最新版的 Chrome、Firefox、Edge、Safari、Opera、UC Browser（Android 版）與 Samsung Internet 都支援 service worker。
IE 與 Opera Mini 等瀏覽器不支援 service worker。

如果使用者用來存取你的應用程式的瀏覽器不支援 service worker，service worker 就不會被註冊，離線快取管理與推播通知等相關行為也不會發生。
具體來說：

*   瀏覽器不會下載 service worker 指令碼與 `ngsw.json` manifest 檔案
*   主動嘗試與 service worker 互動的操作（例如呼叫 `SwUpdate.checkForUpdate()`）會傳回被拒絕的 promise
*   相關服務的 observable 事件（例如 `SwUpdate.available`）不會被觸發

強烈建議你確保應用程式即使在瀏覽器不支援 service worker 的情況下也能運作。
雖然不支援的瀏覽器會忽略 service worker 快取，但如果應用程式嘗試與 service worker 互動，它仍會回報錯誤。
例如，呼叫 `SwUpdate.checkForUpdate()` 會傳回被拒絕的 promise。
若要避免這類錯誤，請使用 `SwUpdate.isEnabled` 檢查 Angular service worker 是否已啟用。

若要深入了解其他已支援 service worker 的瀏覽器，請參閱 [Can I Use](https://caniuse.com/#feat=serviceworkers) 頁面與 [MDN 文件](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)。

## 相關資源

本節的其餘文章專門討論 service worker 的 Angular 實作。

*   [應用程式殼層](guide/app-shell)
*   [Service Worker 通訊](guide/service-worker-communications)
*   [Service Worker 通知](guide/service-worker-notifications)
*   [正式環境中的 Service Worker](guide/service-worker-devops)
*   [Service Worker 設定](guide/service-worker-config)

如需 service worker 的一般資訊，請參閱 [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)。

如需瀏覽器支援的資訊，請參閱 [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers) 的 [browser support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) 章節、Jake Archibald 的 [Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready) 以及 [Can I Use](https://caniuse.com/serviceworkers)。

如需更多建議與範例，請參閱：

*   [使用 Angular Service Worker 預先快取](https://web.dev/precaching-with-the-angular-service-worker)
*   [使用 Angular CLI 建立 PWA](https://web.dev/creating-pwa-with-angular-cli)

## 後續步驟

若要開始使用 Angular service worker，請參閱[開始使用 service worker](guide/service-worker-getting-started)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
