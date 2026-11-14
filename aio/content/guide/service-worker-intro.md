# Angular service worker 簡介

Service worker 強化了傳統的 Web 部署模式，讓應用程式能提供與原生安裝的程式碼同等級的可靠性與效能體驗。將 service worker 加入 Angular 應用程式，是把應用程式轉變為 [Progressive Web App](https://developers.google.com/web/progressive-web-apps/)（也稱為 PWA）的步驟之一。

最簡單來說，service worker 是一個在 Web 瀏覽器中執行的指令碼，負責管理應用程式的快取。

Service worker 扮演網路 proxy 的角色。它們會攔截應用程式發出的所有 HTTP 請求，並能自行決定如何回應這些請求。例如，它們可以查詢本機快取，若有可用的快取回應就直接傳回。Proxy 的攔截不限於透過 `fetch` 等程式化 API 發出的請求，也包括 HTML 中參照的資源，甚至最初對 `index.html` 的請求。因此，基於 service worker 的快取是完全可程式化的，不依賴伺服器指定的快取標頭。

與構成應用程式的其他指令碼（例如 Angular 應用程式套件）不同，service worker 在使用者關閉分頁後仍會保留下來。下次瀏覽器載入應用程式時，service worker 會先載入，並能攔截載入應用程式所需的每一個資源請求。如果 service worker 的設計如此，它可以*完全滿足應用程式的載入，完全不需要網路*。

即使在快速可靠的網路上，來回延遲在載入應用程式時仍可能造成顯著的延遲。使用 service worker 降低對網路的依賴，可以大幅改善使用者體驗。


## Angular 中的 service worker

Angular 應用程式作為單頁應用程式，正好能充分受益於 service worker 的優勢。從 5.0.0 版開始，Angular 隨附 service worker 實作。Angular 開發者可以直接利用這個 service worker，享受它帶來的可靠性與效能提升，無需針對低階 API 撰寫程式。

Angular 的 service worker 旨在最佳化最終使用者在緩慢或不可靠的網路連線下使用應用程式的體驗，同時將提供過時內容的風險降到最低。

Angular service worker 的行為遵循這個設計目標：

* 快取應用程式就像安裝原生應用程式一樣。應用程式會作為一個整體被快取，所有檔案一起更新。
* 執行中的應用程式會持續使用相同版本的全部檔案。它不會突然開始接收來自較新版本的快取檔案，因為這些檔案很可能不相容。
* 當使用者重新整理應用程式時，他們看到的是最新且完整快取的版本。新分頁會載入最新快取的程式碼。
* 更新在背景進行，在變更發布後相對快速地完成。在更新安裝完成並準備就緒之前，會持續提供前一版本的應用程式。
* Service worker 會盡可能節省頻寬。資源只有在變更時才會下載。

為了支援這些行為，Angular service worker 會從伺服器載入一份 *manifest* 檔案。這份 manifest 描述了要快取的資源，並包含每個檔案內容的雜湊值。當應用程式的更新部署後，manifest 的內容隨之改變，通知 service worker 應該下載並快取新版本的應用程式。這份 manifest 是由 CLI 產生的設定檔 `ngsw-config.json` 所生成的。

安裝 Angular service worker 就像加入一個 `NgModule` 一樣簡單。除了向瀏覽器註冊 Angular service worker 之外，這也會提供幾個可注入的服務，讓你與 service worker 互動並加以控制。例如，應用程式可以要求在有新更新可用時收到通知，也可以要求 service worker 檢查伺服器上是否有可用的更新。

## 先決條件

你的應用程式必須在支援 service worker 的 Web 瀏覽器中執行。目前，最新版的 Chrome、Firefox、Edge、Safari、Opera、UC Browser（Android 版）與 Samsung Internet 都支援 service worker。IE 與 Opera Mini 等瀏覽器不提供這項支援。若要深入了解其他已支援 service worker 的瀏覽器，請參閱 [Can I Use](https://caniuse.com/#feat=serviceworkers) 頁面與 [MDN 文件](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。

## 相關資源

如需 service worker 的一般資訊，請參閱 [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers/)。

如需瀏覽器支援的資訊，請參閱 [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers/) 的 [browser support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) 章節、Jake Archibald 的 [Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready/) 以及
[Can I Use](http://caniuse.com/#feat=serviceworkers)。

這份 Angular 文件的其餘部分專門探討 service worker 的 Angular 實作。

## 更多關於 Angular service worker

你可能也會對以下內容感興趣：
* [開始使用 service worker](guide/service-worker-getting-started)。
