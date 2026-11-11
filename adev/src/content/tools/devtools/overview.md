# DevTools 總覽

Angular DevTools 是一個瀏覽器擴充功能，為 Angular 應用程式提供除錯與效能分析功能。

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

你可以從 [Chrome 線上應用程式商店](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh)或 [Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/) 安裝 Angular DevTools。

在任何網頁上按下 <kbd>F12</kbd> 或 <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd>（Windows 或 Linux），或按下 <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> 或 <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd>（Mac），即可開啟 Chrome 或 Firefox DevTools。
瀏覽器 DevTools 開啟且 Angular DevTools 已安裝後，你可以在「Angular」分頁下找到它。

HELPFUL: Chrome 的新分頁頁面不會執行已安裝的擴充功能，因此 Angular 分頁不會出現在 DevTools 中。造訪任何其他頁面即可看到它。

<img src="assets/images/guide/devtools/devtools.png" alt="Angular DevTools 總覽，顯示某個應用程式的元件樹。">

## 開啟你的應用程式

開啟擴充功能後，你會看到兩個額外的分頁：

| 分頁                                   | 說明                                                                                                                |
| :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [Components](tools/devtools/component) | 讓你探索應用程式中的元件與指令，並預覽或編輯它們的狀態。                    |
| [Profiler](tools/devtools/profiler)    | 讓你對應用程式進行效能分析，了解變更偵測執行期間的效能瓶頸所在。 |

<!-- TODO: Add new sections like signals, router etc. -->

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="Angular DevTools 頂部的螢幕截圖，左上角有兩個分頁，一個標示為「Components」，另一個標示為「Profiler」。">

在 Angular DevTools 的右上角，你可以看到頁面上正在執行的 Angular 版本，以及擴充功能的最新 commit 雜湊值。

### 未偵測到 Angular 應用程式

如果你開啟 Angular DevTools 時看到「Angular application not detected」錯誤訊息，表示它無法與頁面上的 Angular 應用程式通訊。
最常見的原因是你正在檢視的網頁並不包含 Angular 應用程式。
請再次確認你檢視的是正確的網頁，且 Angular 應用程式正在執行。

### 我們偵測到以正式環境設定建置的應用程式

如果你看到「We detected an application built with production configuration. Angular DevTools only supports development builds.」錯誤訊息，表示頁面上找到了 Angular 應用程式，但它是以正式環境最佳化編譯的。
編譯正式環境版本時，Angular CLI 會移除各種除錯功能，以盡量減少頁面上的 JavaScript 量並提升效能，其中包括與 DevTools 通訊所需的功能。

若要執行 DevTools，你需要以停用最佳化的方式編譯應用程式。`ng serve` 預設就是這樣做的。
如果你需要為已部署的應用程式除錯，請在建置時以 [`optimization` 設定選項](reference/configs/workspace-config#optimization-configuration)（`{"optimization": false}`）停用最佳化。
