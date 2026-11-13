# 開始使用 service worker


本文件說明如何在使用 [Angular CLI](cli) 建立的專案中啟用 Angular service worker 支援，接著透過範例實際示範 service worker 的運作，展示載入與基本快取的行為。

#### 先決條件

對[Angular service worker 簡介](guide/service-worker-intro)中的資訊有基本的了解。


## 將 service worker 加入你的專案

若要在專案中設定 Angular service worker，請使用 CLI 指令 `ng add @angular/pwa`。它會負責設定應用程式使用 service worker，加入 `@angular/service-worker` 套件，並設定必要的支援檔案。

```sh
ng add @angular/pwa --project *project-name*
```

前述指令會完成下列動作：

1. 將 `@angular/service-worker` 套件加入你的專案。
2. 在 CLI 中啟用 service worker 建置支援。
3. 在應用程式模組中匯入並註冊 service worker。
4. 更新 `index.html` 檔案：
    * 加入連結，引入 `manifest.webmanifest` 檔案。
    * 加入 `theme-color` 的 meta 標籤。
5. 安裝圖示檔案，以支援安裝後的 Progressive Web App（PWA）。
6. 建立名為 [`ngsw-config.json`](/guide/service-worker-config) 的 service worker 設定檔，用來指定快取行為與其他設定。


 接著，建置專案：

```sh
ng build
```

CLI 專案現在已設定完成，可以使用 Angular service worker。


## Service worker 實際運作：導覽

本節使用範例應用程式，實際示範 service worker 的運作。

### 使用 `http-server` 提供服務

因為 `ng serve` 無法搭配 service worker 使用，你必須用獨立的 HTTP 伺服器在本機測試專案。可以使用任何 HTTP 伺服器。以下範例使用 npm 上的 [http-server](https://www.npmjs.com/package/http-server) 套件。為降低發生衝突的可能性並避免提供過時的內容，請在專用的連接埠上測試，並停用快取。

若要用 `http-server` 提供包含 Web 檔案的目錄服務，請執行以下指令：

```sh
http-server -p 8080 -c-1 dist/<project-name>
```

### 首次載入

伺服器執行時，請將瀏覽器指向 http://localhost:8080/。你的應用程式應該會正常載入。

<div class="alert is-helpful">

**提示：** 測試 Angular service worker 時，建議使用瀏覽器的無痕或私密視窗，確保 service worker 不會讀到先前殘留的狀態，以免造成非預期的行為。

</div>

<div class="alert is-helpful">

**注意：**
若你不是使用 HTTPS，service worker 只會在你於 `localhost` 存取應用程式時才註冊。

</div>

### 模擬網路問題

若要模擬網路問題，請停用應用程式的網路互動。

在 Chrome 中：

1. 從 Chrome 右上角的選單中，選取 **Tools** > **Developer Tools**。
1. 前往 **Network tab**。
1. 在 **Throttling** 下拉選單中選取 **Offline**。

<div class="lightbox">
  <img src="generated/images/guide/service-worker/offline-option.png" alt="已選取網路頁籤中的離線選項">
</div>

現在應用程式已無法進行網路互動。

對於未使用 Angular service worker 的應用程式，此時重新整理會顯示 Chrome 的網路中斷頁面，上面寫著「There is no Internet connection」。

加入 Angular service worker 後，應用程式的行為就不同了。重新整理時，頁面會正常載入。

查看 Network 分頁，確認 service worker 已在運作。

<div class="lightbox">
  <img src="generated/images/guide/service-worker/sw-active.png" alt="要求標示為來自 ServiceWorker">
</div>

請注意，在「Size」欄位下，請求的狀態是 `(ServiceWorker)`。這表示資源不是從網路載入的，而是從 service worker 的快取載入。


### 哪些內容被快取了？

請注意，瀏覽器呈現這個應用程式所需的全部檔案都已被快取。`ngsw-config.json` 的範本設定會快取 CLI 所使用的特定資源：

* `index.html`。
* `favicon.ico`。
* 建置產物（JS 與 CSS 套件）。
* `assets` 下的所有內容。
* 設定好的 `outputPath`（預設為 `./dist/<project-name>/`）或 `resourcesOutputPath` 正下方直接放置的圖片與字型。如需進一步了解這些選項，請參閱 [`ng build`](cli/build)。


<div class="alert is-important">
請注意以下兩個重點：

1. 產生的 `ngsw-config.json` 只包含有限的可快取字型與圖片副檔名清單。在某些情況下，你可能需要修改 glob 模式以符合你的需求。

1. 如果 `resourcesOutputPath` 或 `assets` 路徑在設定檔產生之後被修改，你需要手動修改 `ngsw-config.json` 中的路徑。
</div>

### 修改你的應用程式

現在你已經了解 service worker 如何快取你的應用程式，下一步是了解更新如何運作。對應用程式做一項變更，並觀察 service worker 如何安裝更新：

1. 如果你正在無痕視窗中測試，請再開一個空白分頁。這樣能在測試期間保持無痕模式與快取狀態存活。

1. 關閉應用程式分頁，但不要關閉視窗。這也會一併關閉 Developer Tools。

1. 關閉 `http-server`。

1. 開啟 `src/app/app.component.html` 進行編輯。

1. 將文字 `Welcome to {{title}}!` 改為 `Bienvenue à {{title}}!`。

1. 再次建置並執行伺服器：

```sh
ng build
http-server -p 8080 -c-1 dist/<project-name>
```

### 在瀏覽器中更新你的應用程式

接著看看瀏覽器與 service worker 如何處理更新後的應用程式。

1. 在同一個視窗中再次開啟 [http://localhost:8080](http://localhost:8080)。發生了什麼事？

  <div class="lightbox">
    <img src="generated/images/guide/service-worker/welcome-msg-en.png" alt="仍顯示「Welcome to Service Workers!」">
  </div>

  哪裡出錯了？其實什麼都沒出錯。Angular service worker 正在做它的工作，提供它已**安裝**的應用程式版本，即使已有更新可用。為了速度，service worker 在提供已快取的應用程式之前，不會先等待檢查更新。

  查看 `http-server` 的記錄檔，看看 service worker 正在請求 `/ngsw.json`。service worker 就是這樣檢查更新的。

1. 重新整理頁面。

  <div class="lightbox">
    <img src="generated/images/guide/service-worker/welcome-msg-fr.png" alt="文字已變為「Bienvenue à app!」">
  </div>

  service worker 已在*背景*安裝更新後的應用程式版本，下次載入或重新載入頁面時，service worker 就會切換到最新版本。

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：
* [App Shell 模式](guide/app-shell)。
* [與 service worker 通訊](guide/service-worker-communications)。
