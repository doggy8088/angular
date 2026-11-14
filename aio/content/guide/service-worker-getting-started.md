# 開始使用 service worker

#### 先決條件

對下列內容有基本的了解：
* [Angular service worker 簡介](guide/service-worker-intro)。

<hr />


從 Angular 5.0.0 開始，你可以輕鬆地在任何 CLI 專案中啟用 Angular service worker 支援。本文件說明如何在新專案與現有專案中啟用 Angular service worker 支援，接著透過一個簡單的範例向你展示 service worker 的實際運作，示範載入與基本快取。

## 將 service worker 加入新應用程式

如果你要產生新的 CLI 專案，可以使用 CLI 在建立專案的同時設定好 Angular service worker。做法是把 `--service-worker` 旗標加到 `ng new` 指令：

```sh
ng new my-project --service-worker 
```

`--service-worker` 旗標會負責把你的應用程式設定為使用 service worker：加入 `service-worker` 套件，並設定好支援 service worker 所需的檔案。詳細資訊請參閱下一節，該節詳細介紹了整個流程，展示如何手動將 service worker 加入現有的應用程式。



## 將 service worker 加入現有的應用程式

若要將 service worker 加入現有的應用程式：

1. 加入 service worker 套件。
2. 在 CLI 中啟用 service worker 建置支援。
3. 匯入並註冊 service worker。
4. 建立 service worker 設定檔，指定快取行為與其他設定。
5. 建置專案。

### 步驟 1：加入 service worker 套件

使用 yarn 工具加入 `@angular/service-worker` 套件，如下所示：

```sh
yarn add @angular/service-worker
```

### 步驟 2：在 CLI 中啟用 service worker 建置支援

若要啟用 Angular service worker，CLI 必須在建置時產生一份 Angular service worker manifest。若要讓 CLI 為現有專案產生 manifest，請把專案 `.angular-cli.json` 檔案中的 `serviceWorker` 旗標設為 `true`，如下所示：

```sh
ng set apps.0.serviceWorker=true
```

### 步驟 3：匯入並註冊 service worker

若要匯入並註冊 Angular service worker：

在根模組 `src/app/app.module.ts` 的頂部，匯入 `ServiceWorkerModule` 與 `environment`。

<code-example path="service-worker-getting-started/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts" region="sw-import"> </code-example>


把 `ServiceWorkerModule` 加入 `@NgModule` 的 `imports` 陣列。使用 `register()` 輔助函式來處理 service worker 的註冊，並注意在非生產模式執行時停用 service worker。

<code-example path="service-worker-getting-started/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts" region="sw-module"> </code-example>

`ngsw-worker.js` 檔案是預先建置好的 service worker 指令碼的名稱，CLI 會把它複製到 `dist/`，隨著你的伺服器一起部署。

### 步驟 4：建立設定檔 `ngsw-config.json`

Angular CLI 需要一份名為 `ngsw-config.json` 的 service worker 設定檔。設定檔控制 service worker 如何快取檔案與資料資源。

你可以從 CLI 的樣板版本開始，它為大多數應用程式設定了合理的預設值。

或者，把下列內容儲存為 `src/ngsw-config.json`：

<code-example path="service-worker-getting-started/src/ngsw-config.json" linenums="false" title="src/ngsw-config.json"> </code-example>

### 步驟 5：建置專案

最後，建置專案：

```sh
ng build --prod
```

CLI 專案現在已設定完成，可以使用 Angular service worker。


## Service worker 實際運作：導覽

本節使用範例應用程式，實際示範 service worker 的運作。

### 使用 `http-server` 提供服務

因為 `ng serve` 無法搭配 service worker 使用，你必須用獨立的 HTTP 伺服器在本機測試專案。可以使用任何 HTTP 伺服器。以下範例使用 npm 上的 [http-server](https://www.npmjs.com/package/http-server) 套件。為降低發生衝突的可能性，請在專用的連接埠上測試。

若要用 `http-server` 提供服務，請切換到包含 Web 檔案的目錄，並啟動 Web 伺服器：

```sh
cd dist
http-server -p 8080
```

### 首次載入

伺服器執行時，你可以將瀏覽器指向 http://localhost:8080/。你的應用程式應該會正常載入。

**提示：** 測試 Angular service worker 時，建議使用瀏覽器的無痕或私密視窗，確保 service worker 不會讀到先前殘留的狀態，以免造成非預期的行為。

### 模擬網路問題

若要模擬網路問題，請停用應用程式的網路互動。在 Chrome 中：

1. 從 Chrome 右上角的選單中，選取 **Tools** > **Developer Tools**。
2. 前往 **Network tab**。
3. 勾選 **Offline 方塊**。

<figure>
  <img src="generated/images/guide/service-worker/offline-checkbox.png" alt="Network 分頁中的離線核取方塊已勾選">
</figure>

現在應用程式已無法進行網路互動。

對於未使用 Angular service worker 的應用程式，此時重新整理會顯示 Chrome 的網路中斷頁面，上面寫著「There is no Internet connection」。

加入 Angular service worker 後，應用程式的行為就不同了。重新整理時，頁面會正常載入。

查看 Network 分頁，確認 service worker 已在運作。

<figure>
  <img src="generated/images/guide/service-worker/sw-active.png" alt="要求標示為來自 ServiceWorker">
</figure>

請注意，在「Size」欄位下，請求的狀態是 `(from ServiceWorker)`。這表示資源不是從網路載入的，而是從 service worker 的快取載入。


### 哪些內容被快取了？

請注意，瀏覽器呈現這個應用程式所需的全部檔案都已被快取。`ngsw-config.json` 的範本設定會快取 CLI 所使用的特定資源：

* `index.html`。
* `favicon.ico`。
* 建置產物（JS 與 CSS 套件）。
* `assets` 下的所有內容。

### 修改你的應用程式

現在你已經了解 service worker 如何快取你的應用程式，下一步是了解更新如何運作。

1. 如果你正在無痕視窗中測試，請再開一個空白分頁。這樣能在測試期間保持無痕模式與快取狀態存活。

2. 關閉應用程式分頁，但不要關閉視窗。這也會一併關閉 Developer Tools。

3. 關閉 `http-server`。

4. 接著，對應用程式做一項變更，並觀察 service worker 安裝更新。

5. 開啟 `src/app/app.component.html` 進行編輯。

6. 將文字 `Welcome to {{title}}!` 改為 `Bienvenue à {{title}}!`。

7. 再次建置並執行伺服器：

```sh
ng build --prod
cd dist
http-server -p 8080
```

### 在瀏覽器中更新你的應用程式

接著看看瀏覽器與 service worker 如何處理更新後的應用程式。

1. 在同一個視窗中再次開啟 http://localhost:8080。發生了什麼事？

<figure>
  <img src="generated/images/guide/service-worker/welcome-msg-en.png" alt="仍顯示「Welcome to Service Workers!」">
</figure>

哪裡出錯了？其實什麼都沒出錯。Angular service worker 正在做它的工作，提供它已**安裝**的應用程式版本，即使已有更新可用。為了速度，service worker 在提供已快取的應用程式之前，不會先等待檢查更新。

查看 `http-server` 的記錄檔，你可以看到 service worker 正在請求 `/ngsw.json`。service worker 就是這樣檢查更新的。

2. 重新整理頁面。

<figure>
  <img src="generated/images/guide/service-worker/welcome-msg-fr.png" alt="文字已變為「Bienvenue à app!」">
</figure>

service worker 已在*背景*安裝更新後的應用程式版本，下次載入或重新載入頁面時，service worker 就會切換到最新版本。

<hr />

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：
* [與 service worker 通訊](guide/service-worker-communications)。
