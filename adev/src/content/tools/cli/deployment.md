# 部署

當您準備將您的 Angular 應用程式佈署至遠端伺服器時，您有各種選擇。

## 使用 CLI 自動部署

Angular CLI 指令 `ng deploy` 會執行與您的專案相關聯的 `deploy` [CLI 建構器](tools/cli/cli-builder)。

許多第三方建構器會實作部署功能至不同平台。
您可以使用 `ng add` 將任何其中一個加入您的專案。

當您新增具備佈署功能的套件時，它會自動以選取專案的 `deploy` 區段更新您的工作區設定 (`angular.json` 檔案)。

然後您可以使用 `ng deploy` 指令來佈署該專案。

例如，以下指令會自動將專案部署到 [Firebase](https://firebase.google.com/)。

<docs-code language="shell">

ng add @angular/fire
ng deploy

</docs-code>

該指令是互動式的。
在這種情況下，您必須擁有或建立一個 Firebase 帳戶並使用它進行驗證。
該指令會在建構應用程式並將產品資源上傳至 Firebase 之前，提示您選擇一個 Firebase 專案進行部署。

下表列出工具，這些工具可將部署功能實作到不同平台。
每個套件的 `deploy` 指令可能需要不同的指令列選項。
您可以透過追蹤以下套件名稱相關的連結以閱讀更多資訊：

| 部署到                                                     | 安裝指令                                                                              |
|:---                                                               |:---                                                                                  |
| [Firebase hosting](https://firebase.google.com/docs/hosting)      | [`ng add @angular/fire`](https://npmjs.org/package/@angular/fire)                           |
| [Vercel](https://vercel.com/solutions/angular)                    | [`vercel init angular`](https://github.com/vercel/vercel/tree/main/examples/angular) |
| [Netlify](https://www.netlify.com)                                | [`ng add @netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy)       |
| [GitHub pages](https://pages.github.com)                          | [`ng add angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages)               |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`ng add @jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

如果您要部署到自行管理的伺服器，或者沒有您喜愛的雲端平台的建構器，您可以 [建立建構器](tools/cli/cli-builder) 以使用 `ng deploy` 指令，或者閱讀本指南以瞭解如何手動部署您的應用程式。

## 手動部署到遠端伺服器

若要手動部署應用程式，請建立生產組建並將輸出目錄複製到網路伺服器或內容傳遞網路 (CDN)。
預設情況下，`ng build` 使用 `production` 組態。
如果您已自訂組建組態，您可能想要確認在部署之前套用 [生產最佳化](tools/cli/deployment#production-optimizations)。

預設情況下，`ng build` 會將建置好的成品輸出到 `dist/my-app/`，不過這個路徑可以使用 `@angular-devkit/build-angular:browser` 建構器的 `outputPath` 選項進行設定。
將這個目錄複製到伺服器並設定它來服務該目錄。

儘管這是一個最小的部署解決方案，但還是有一些要求讓伺服器正確地提供您的 Angular 應用程式。

## 伺服器設定

本節介紹您可能需要在伺服器上設定的變更，以執行您的 Angular 應用程式。

### 路由應用必須退回到 `index.html`

以 Client 端呈現的 Angular 應用程式最適合使用靜態 HTML 伺服器來服務，因為所有內容都是靜態的，且在建置時產生。

如果應用程式使用 Angular 路由器，則必須將伺服器設定為在被要求提供它沒有的檔案時，傳回應用程式的首頁 (`index.html`)。

路由應用程式應支援「深度連結」。
*深度連結* 是指定應用程式中元件路徑的 URL。
例如，`http://my-app.test/users/42` 是指向顯示使用者詳細資料頁面的 *深度連結*，該頁面顯示 `id` 為 42 的使用者。

當使用者最初載入索引頁面，然後從正在執行的用戶端內導覽至該 URL 時，不會有任何問題。
Angular 路由器執行 *用戶端* 導覽，且不會要求新的 HTML 頁面。

但點擊電子郵件中的深度連結、在瀏覽器地址列輸入連結，或在已開啟深度連結頁面時更新瀏覽器，都將由瀏覽器本身處理，*在* 正在執行的應用程式外部。
瀏覽器會直接向伺服器要求 `/users/42`，繞過 Angular 的路由器。

靜態伺服器在收到 `http://my-app.test/` 的請求時通常會傳回 `index.html`。
但大多數伺服器預設會拒絕 `http://my-app.test/users/42` 並傳回 `404 - Not Found` 錯誤，*除非* 將其設定為改傳回 `index.html`。
將伺服器的備用路由或 404 頁面設定為 `index.html`，以便為深度連結提供 Angular 服務並顯示正確的路由。
有些伺服器將這種備用行為稱為「單頁應用程式」(SPA) 模式。

一旦瀏覽器載入應用程式，Angular 路由器將會讀取 URL 以確定它在那個頁面並正確顯示 `/users/42`。

對於「真正的」404 頁面，例如 `http://my-app.test/does-not-exist`，伺服器不需要任何額外的配置。
[在 Angular 路由器中實作的 404 頁面](guide/routing/common-router-tasks#displaying-a-404-page) 將會正確顯示。

### 要求資料來自不同伺服器 (CORS)

網頁開發人員在對應用程式自己的主機伺服器以外的伺服器進行網路請求時，可能會遇到 [*跨來源資源分享*](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS "Cross-origin resource sharing") 錯誤。
除非伺服器明確允許，否則瀏覽器會禁止此類請求。

Angular 或用戶端應用程式無法處理這些錯誤。
必須將 _伺服器_ 配置為接受應用程式的請求。
在 [enable-cors.org](https://enable-cors.org/server.html "啟用 CORS 伺服器") 中了解如何為特定伺服器啟用 CORS。

## 生產優化

ng build` 使用 `production` 組態，除非另行設定。此組態啟用下列建置最佳化功能。

| 功能                                                           | 詳細資料                                                                                       |
|:---                                                                |:---                                                                                           |
| [即時 (AOT) 編譯](tools/cli/aot-compiler)                    | 預先編譯 Angular 元件範本。                                                                 |
| [生產模式](tools/cli/deployment#production-mode-at-runtime) | 最佳化應用程式以獲得最佳執行時期效能                                                    |
| 捆綁                                                           | 將多個應用程式和程式庫檔案連結成最少數量的已部署檔案。                                   |
| 壓縮                                                           | 移除了多餘的空白、註解和選用權杖。                                                         |
| 混淆                                                           | 將函式、類別和變數重新命名為較短的任意識別碼。                                           |
| 死程式碼消除                                                      | 移除了未參考的模組和未使用過的程式碼。                                                       |

請參閱 [`ng build`](cli/build) 以進一步了解 CLI 建置選項及其效果。

### 專屬開發的功能

當您使用 `ng serve` 在本地端執行應用程式時，Angular 在執行階段使用開發組態，其中啟用了：

* 額外的安全檢查，例如 [`expression-changed-after-checked`](errors/NG0100) 偵測。
* 更詳細的錯誤訊息。
* 其他除錯工具，例如全域 `ng` 變數和 [Angular DevTools](tools/devtools) 支援。

這些功能在開發階段很有用，但需要應用程式中額外的程式碼，這在生產階段是不需要的。為了確保這些功能不會對最終使用者的套件大小造成負面影響，Angular CLI 在為生產階段建置時，會從套件中移除僅用於開發的程式碼。

預設情況下使用 `ng build` 來建置您的應用程式會使用 `production` 組態，此組態會從輸出中移除這些功能以獲得最佳的套件大小。

## `--deploy-url`

--deploy-url` 是一個命令列選項，用於指定基本路徑，以在 *編譯* 時為影像、指令碼和樣式表等資產解析相對 URL。

<docs-code language="shell">

ng build --deploy-url /my/assets

</docs-code>

`--deploy-url` 的效果和目的與 [`<base href>`](guide/routing/common-router-tasks) 重疊。兩者皆可用於初始腳本、樣式表、延遲載入腳本和 CSS 資源。

與可在執行階段在單個位置定義的 `<base href>` 不同，`--deploy-url` 需要在建置階段硬編碼到應用程式。
若有可能，優先使用 `<base href>`。
