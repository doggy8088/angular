# 開始使用 service worker

本文件說明如何在使用 [Angular CLI](tools/cli) 建立的專案中啟用 Angular service worker 支援，接著透過範例實際示範 service worker 的運作，展示載入與基本快取的行為。

## 將 service worker 加入你的專案 {#adding-a-service-worker-to-your-project}

若要在專案中設定 Angular service worker，請執行下列 CLI 指令：

```shell

ng add @angular/pwa

```

CLI 會透過下列動作，將你的應用程式設定為使用 service worker：

1. 將 `@angular/service-worker` 套件加入你的專案。
1. 在 CLI 中啟用 service worker 建置支援。
1. 匯入 service worker，並向應用程式的根 providers 註冊。
1. 更新 `index.html` 檔案：
   - 加入連結，引入 `manifest.webmanifest` 檔案
   - 加入 `theme-color` 的 meta 標籤
1. 安裝圖示檔案，以支援安裝後的 Progressive Web App（PWA）。
1. 建立名為 [`ngsw-config.json`](ecosystem/service-workers/config) 的 service worker 設定檔，
   用來指定快取行為與其他設定。

接著，建置專案：

```shell

ng build

```

CLI 專案現在已設定完成，可以使用 Angular service worker。

## Service worker 實際運作：導覽

本節使用範例應用程式，實際示範 service worker 的運作。
若要在本機開發期間啟用 service worker 支援，請使用正式環境設定，執行下列指令：

```shell

ng serve --configuration=production

```

或者，你也可以使用 npm 上的 [`http-server package`](https://www.npmjs.com/package/http-server)，
它支援 service worker 應用程式。執行下列指令即可在不安裝的情況下使用：

```shell

npx http-server -p 8080 -c-1 dist/&lt;project-name&gt;/browser

```

這樣就能在 http://localhost:8080 以支援 service worker 的方式提供你的應用程式。

### 首次載入

讓伺服器在連接埠 `8080` 上執行後，將瀏覽器指向 `http://localhost:8080`。
你的應用程式應該會正常載入。

TIP: 測試 Angular service worker 時，建議使用瀏覽器的無痕或私密視窗，確保 service worker 不會讀到先前殘留的狀態，以免造成非預期的行為。

HELPFUL: 若你不是使用 HTTPS，service worker 只會在存取 `localhost` 上的應用程式時才註冊。

### 模擬網路問題

若要模擬網路問題，請停用應用程式的網路互動。

在 Chrome 中：

1. 選取 **Tools** > **Developer Tools**（從 Chrome 右上角的選單進入）。
1. 前往 **Network tab**。
1. 在 **Throttling** 下拉選單中選取 **Offline**。

<img alt="Network 分頁中的離線選項已被選取" src="assets/images/guide/service-worker/offline-option.png">

現在應用程式已無法進行網路互動。

對於未使用 Angular service worker 的應用程式，此時重新整理會顯示 Chrome 的網路中斷頁面，上面寫著「There is no Internet connection」。

加入 Angular service worker 後，應用程式的行為就不同了。
重新整理時，頁面會正常載入。

查看 Network 分頁，確認 service worker 已在運作。

<img alt="請求被標示為來自 ServiceWorker" src="assets/images/guide/service-worker/sw-active.png">

HELPFUL: 在「Size」欄位下，請求的狀態是 `(ServiceWorker)`。
這表示資源不是從網路載入的，
而是從 service worker 的快取載入。

### 哪些內容被快取了？

請注意，瀏覽器呈現這個應用程式所需的全部檔案都已被快取。
`ngsw-config.json` 的範本設定會快取 CLI 所使用的特定資源：

- `index.html`
- `favicon.ico`
- 建置產物（JS 與 CSS 套件）
- `assets` 下的所有內容
- 直接位於所設定的 `outputPath`（預設為 `./dist/<project-name>/`）或 `resourcesOutputPath` 之下的圖片與字型。
  這些選項的更多資訊，請參閱 `ng build` 的文件。

IMPORTANT: 產生的 `ngsw-config.json` 只包含有限的可快取字型與圖片副檔名清單。在某些情況下，你可能需要修改 glob 模式以符合你的需求。

IMPORTANT: 如果 `resourcesOutputPath` 或 `assets` 路徑在設定檔產生之後被修改，你需要手動修改 `ngsw-config.json` 中的路徑。

### 修改你的應用程式

現在你已經了解 service worker 如何快取你的應用程式，下一步是了解更新如何運作。
對應用程式做一項變更，並觀察 service worker 如何安裝更新：

1. 如果你正在無痕視窗中測試，請再開一個空白分頁。
   這樣能在測試期間保持無痕模式與快取狀態存活。

1. 關閉應用程式分頁，但不要關閉視窗。
   這也會一併關閉 Developer Tools。

1. 關閉 `http-server`（Ctrl-c）。
1. 開啟 `src/app/app.component.html` 進行編輯。
1. 將文字 `Welcome to {{title}}!` 改為 `Bienvenue à {{title}}!`。
1. 再次建置並執行伺服器：

```shell
    ng build
    npx http-server -p 8080 -c-1 dist/<project-name>/browser
```

### 在瀏覽器中更新你的應用程式

接著看看瀏覽器與 service worker 如何處理更新後的應用程式。

1. 在同一個視窗中再次開啟 [http://localhost:8080](http://localhost:8080)。
   發生了什麼事？

   <img alt="它仍顯示 Welcome to Service Workers!" src="assets/images/guide/service-worker/welcome-msg-en.png">

   哪裡出錯了？
   _其實什麼都沒出錯！_
   Angular service worker 正在做它的工作，提供它已**安裝**的應用程式版本，即使已有更新可用。
   為了速度，service worker 在提供已快取的應用程式之前，不會先等待檢查更新。

   查看 `http-server` 的記錄，可以看到 service worker 正在請求 `/ngsw.json`。

   ```text
   [2023-09-07T00:37:24.372Z]  "GET /ngsw.json?ngsw-cache-bust=0.9365263935102124" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
   ```

   這就是 service worker 檢查更新的方式。

1. 重新整理頁面。

   <img alt="文字已改為 Bienvenue à app!" src="assets/images/guide/service-worker/welcome-msg-fr.png">

   service worker 已在_背景_安裝更新後的應用程式版本，下次載入或重新載入頁面時，service worker 就會切換到最新版本。

## Service worker 設定

Angular service worker 透過 `SwRegistrationOptions` 介面支援完整的設定選項，讓你能精細控制註冊行為、快取與指令碼執行。

### 啟用與停用 service worker

`enabled` 選項控制是否註冊 service worker，以及相關服務是否嘗試與它通訊。

```ts

import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Disable in development, enable in production
    }),
  ],
};

```

### 使用 updateViaCache 控制快取

`updateViaCache` 選項控制瀏覽器在 service worker 更新期間如何查閱 HTTP 快取。這讓你能精細控制瀏覽器何時擷取更新後的 service worker 指令碼與匯入的模組。

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      updateViaCache: 'imports',
    }),
  ],
};

```

`updateViaCache` 選項接受下列值：

- **`'imports'`**：查閱 HTTP 快取以取得 service worker 指令碼所匯入的指令碼，但不查閱 service worker 指令碼本身
- **`'all'`**：同時查閱 HTTP 快取以取得 service worker 指令碼與其匯入的指令碼
- **`'none'`**：不查閱 HTTP 快取以取得 service worker 指令碼或其匯入的指令碼

### 使用 type 選項支援 ES Module

`type` 選項讓你在註冊 service worker 時指定指令碼類型，讓你的 service worker 指令碼能支援 ES module 功能。

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      type: 'module', // Enable ES module features
    }),
  ],
};

```

`type` 選項接受下列值：

- **`'classic'`**（預設）：傳統的 service worker 指令碼執行方式。指令碼中不允許使用 `import` 與 `export` 等 ES module 功能
- **`'module'`**：將指令碼註冊為 ES module。允許使用 `import`/`export` 語法與模組功能

### 註冊範圍控制

`scope` 選項定義 service worker 的註冊範圍，決定它能控制的 URL 範圍。

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      scope: '/app/', // Service worker will only control URLs under /app/
    }),
  ],
};

```

- 控制 service worker 可以攔截與管理哪些 URL
- 預設情況下，範圍是包含 service worker 指令碼的目錄
- 在呼叫 `ServiceWorkerContainer.register()` 時使用

### 註冊策略設定

`registrationStrategy` 選項定義 service worker 何時向瀏覽器註冊，讓你能控制註冊的時機。

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

```

可用的註冊策略：

- **`'registerWhenStable:timeout'`**（預設：`'registerWhenStable:30000'`）：在應用程式穩定後（沒有待處理的 micro-/macro-tasks）就註冊，但不晚於指定的逾時時間（毫秒）
- **`'registerImmediately'`**：立即註冊 service worker
- **`'registerWithDelay:timeout'`**：延遲指定的逾時時間（毫秒）後再註冊

```ts

// Register immediately
export const immediateConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ],
};

// Register with a 5-second delay
export const delayedConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWithDelay:5000',
    }),
  ],
};

```

你也可以提供 Observable 工廠函式，來自訂註冊時機：

```ts
import { timer } from 'rxjs';

export const customConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: () => timer(10_000), // Register after 10 seconds
    }),
  ],
};

```

## 深入了解 Angular service worker

你可能也會對下列內容有興趣：

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="設定檔"/>
  <docs-pill href="ecosystem/service-workers/communications" title="與 Service Worker 通訊"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="推播通知"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker DevOps"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell 模式"/>
</docs-pill-row>
