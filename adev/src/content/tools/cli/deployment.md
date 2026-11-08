# 部署

當你準備好將 Angular 應用程式部署到遠端伺服器時，有多種選擇。

## 使用 CLI 自動部署

Angular CLI 指令 `ng deploy` 會執行與你的專案相關聯的 `deploy` [CLI 建置器](tools/cli/cli-builder)。
許多第三方建置器為不同平台實作了部署功能。
你可以用 `ng add` 將其中任何一個加入專案。

當你新增具備部署功能的套件時，它會自動在你的工作區設定（`angular.json` 檔案）中，為所選專案加入一段 `deploy` 設定。
之後你就能用 `ng deploy` 指令部署該專案。

例如，下列指令會自動將專案部署到 [Firebase](https://firebase.google.com/)。

```shell

ng add @angular/fire
ng deploy

```

這個指令是互動式的。
以此例來說，你必須擁有或建立一個 Firebase 帳號，並用它完成驗證。
指令會提示你先選取一個用於部署的 Firebase 專案，然後才建置應用程式，並將正式環境的資產上傳到 Firebase。

下表列出為不同平台實作部署功能的工具。
每個套件的 `deploy` 指令可能需要不同的命令列選項。
你可以透過下表套件名稱旁的連結進一步瞭解：

| 部署目標                                                          | 設定指令                                                                                    |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [Firebase hosting](https://firebase.google.com/docs/hosting)      | [`ng add @angular/fire`](https://www.npmjs.com/package/@angular/fire)                       |
| [Vercel](https://vercel.com/solutions/angular)                    | [`vercel init angular`](https://github.com/vercel/vercel/tree/main/examples/angular)        |
| [Netlify](https://www.netlify.com)                                | [`ng add @netlify-builder/deploy`](https://www.npmjs.com/package/@netlify-builder/deploy)   |
| [GitHub Pages](https://pages.github.com)                          | [`ng add angular-cli-ghpages`](https://www.npmjs.com/package/angular-cli-ghpages)           |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`ng add @jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

若你要部署到自行管理的伺服器，或你喜歡的雲端平台沒有對應的建置器，你可以[建立一個建置器](tools/cli/cli-builder)來使用 `ng deploy` 指令，或是閱讀本指南，瞭解如何手動部署應用程式。

## 手動部署到遠端伺服器

若要手動部署應用程式，先建立正式環境建置，再將輸出成品部署到你的託管環境。
預設情況下，`ng build` 使用 `production` 設定。
若你自訂了建置設定，部署前可能需要先確認[正式環境最佳化](tools/cli/deployment#production-optimizations)有被套用。

`ng build` 預設將建置成品輸出到 `dist/my-app/`，不過這個路徑可以用 `@angular/build:application` 建置器的 `outputPath` 選項來設定。
你要部署的內容取決於應用程式的渲染方式：

- **靜態託管（用戶端渲染或 `outputMode: "static"`）**：將 `dist/my-app/browser/` 目錄複製到 Web 伺服器或內容傳遞網路（CDN），並設定伺服器提供該目錄的內容。
- **伺服器端渲染（`outputMode: "server"`）**：將 `dist/my-app/browser/` 與 `dist/my-app/server/` 兩個目錄都複製到伺服器，然後執行 `node dist/my-app/server/server.mjs`。

更多細節請參閱[伺服器與混合渲染](guide/ssr)。

雖然這是最小可行的部署方案，但伺服器仍須滿足一些要求，才能正確提供你的 Angular 應用程式。

## 伺服器設定

本節說明你可能需要在伺服器上設定的變更，才能執行 Angular 應用程式。

### 具路由的應用程式必須退回 `index.html`

用戶端渲染的 Angular 應用程式非常適合由靜態 HTML 伺服器提供，因為所有內容都是靜態的，並在建置時產生。

若應用程式使用 Angular 路由器，你必須設定伺服器：當被請求的檔案不存在時，改回傳應用程式的主頁（`index.html`）。

具路由的應用程式應支援「深層連結」。
_深層連結_ 是指向應用程式內部某個元件路徑的 URL。
例如，`http://my-app.test/users/42` 就是指向使用者詳細頁面的_深層連結_，該頁面顯示 `id` 為 42 的使用者。

當使用者先載入索引頁、再從執行中的用戶端內部導航到該 URL 時，不會有任何問題。
Angular 路由器會在_用戶端_執行導航，不會請求新的 HTML 頁面。

但在電子郵件中點選深層連結、在瀏覽器網址列輸入它，甚至在已停留在深層連結頁面時重新整理瀏覽器，這些都會由瀏覽器本身處理，_不在_執行中的應用程式之內。
瀏覽器會直接向伺服器請求 `/users/42`，繞過 Angular 的路由器。

靜態伺服器在收到 `http://my-app.test/` 的請求時，通常會回傳 `index.html`。
但多數伺服器預設會拒絕 `http://my-app.test/users/42` 並回傳 `404 - Not Found` 錯誤，_除非_它被設定為改回傳 `index.html`。
請為你的伺服器設定退回路由或 404 頁面指向 `index.html`，這樣深層連結就能由 Angular 提供服務，並顯示正確的路由。
有些伺服器將這種退回行為稱為「單頁應用程式」（SPA）模式。

IMPORTANT: 當你以 `outputMode: "static"` 預渲染應用程式時，請設定伺服器使用 `index.csr.html` 作為退回頁面，而不是 `index.html`。建置會將主頁寫入 `index.csr.html`，而 `index.html`（若有產生）包含的是根路由（`/`）的預渲染內容。

瀏覽器載入應用程式後，Angular 路由器會讀取 URL 來判斷目前所在頁面，並正確顯示 `/users/42`。

對於「真正的」404 頁面，例如 `http://my-app.test/does-not-exist`，伺服器不需要任何額外設定。
[在 Angular 路由器中實作的 404 頁面](guide/routing/common-router-tasks#displaying-a-404-page)會正確顯示。

### 從不同的伺服器請求資料（CORS）

Web 開發者在向非應用程式自身主機的伺服器發出網路請求時，可能會遇到[_跨來源資源共用_](https://developer.mozilla.org/docs/Web/HTTP/CORS 'Cross-origin resource sharing')錯誤。
除非伺服器明確允許，否則瀏覽器禁止這類請求。

對這類錯誤，Angular 或用戶端應用程式無能為力。
必須設定_伺服器_來接受應用程式的請求。
如何在特定伺服器上啟用 CORS，請參閱 [enable-cors.org](https://enable-cors.org/server.html 'Enabling CORS server')。

## 正式環境最佳化 {#production-optimizations}

`ng build` 除非另有設定，否則會使用 `production` 設定。這個設定會啟用下列建置最佳化功能。

| 功能                                                              | 詳細資訊                                                                                      |
| :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| [Ahead-of-Time (AOT) Compilation](tools/cli/aot-compiler)         | 預先編譯 Angular 元件範本。                                                                   |
| [Production mode](tools/cli/deployment#development-only-features) | 將應用程式最佳化，以獲得最佳的執行期效能                                                      |
| 打包                                                              | 將眾多應用程式與程式庫檔案串連成最少數量的部署檔案。                                          |
| 最小化                                                            | 移除多餘的空白、註解與可選的標記。                                                            |
| 名稱混淆                                                          | 將函式、類別與變數重新命名為更短的任意識別名稱。                                              |
| 移除無用程式碼                                                    | 移除未被參考的模組與未使用的程式碼。                                                          |

更多 CLI 建置選項及其效果，請參閱 [`ng build`](cli/build)。

### 僅限開發的功能 {#development-only-features}

在本機使用 `ng serve` 執行應用程式時，Angular 會在執行期使用開發設定，並啟用：

- 額外的安全檢查，例如 [`expression-changed-after-checked`](errors/NG0100) 偵測。
- 更詳細的錯誤訊息。
- 額外的除錯工具，例如具有[除錯函式](api#angular_core_globals)的全域 `ng` 變數，以及 [Angular DevTools](tools/devtools) 支援。

這些功能在開發期間很有幫助，但它們需要在應用程式中加入額外程式碼，這在正式環境並不理想。為確保這些功能不會對終端使用者的 bundle 大小造成負面影響，Angular CLI 會在為正式環境建置時，從 bundle 中移除僅限開發的程式碼。

使用 `ng build` 建置應用程式時，預設使用 `production` 設定，會從輸出中移除這些功能，以獲得最佳的 bundle 大小。

## `--deploy-url`

`--deploy-url` 是一個命令列選項，用來指定在_編譯_時解析圖片、指令碼與樣式表等資產相對 URL 的基礎路徑。

```shell

ng build --deploy-url /my/assets

```

`--deploy-url` 的效果與用途與 [`<base href>`](guide/routing/router-reference#base-href) 有所重疊。兩者都可用於初始指令碼、樣式表、延遲載入的指令碼與 CSS 資源。

與可在執行期單一位置定義的 `<base href>` 不同，`--deploy-url` 必須在建置時寫死進應用程式。
請盡可能優先使用 `<base href>`。
