# 部署

當你準備好將 Angular 應用程式部署到遠端伺服器時，有多種選擇。

{@a dev-deploy}
{@a copy-files}

## 簡單的部署選項

在完整部署應用程式之前，你可以使用下列其中一種過渡技巧，來測試部署流程、建置設定與部署後的行為。

### 從磁碟建置並提供服務

在開發期間，你通常使用 `ng serve` 命令，從本機記憶體建置、監看並提供應用程式（使用 [webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server)）。
但當你準備部署時，必須使用 `ng build` 命令來建置應用程式，並將建置產物部署到其他地方。

`ng build` 與 `ng serve` 都會在建置專案前清空輸出資料夾，但只有 `ng build` 命令會把產生的建置產物寫入輸出資料夾。

<div class="alert is-helpful">

輸出資料夾預設為 `dist/project-name/`。
若要輸出到不同的資料夾，請變更 `angular.json` 中的 `outputPath`。

</div>

當開發過程接近尾聲時，從本機網頁伺服器提供輸出資料夾的內容，可以讓你更了解應用程式部署到遠端伺服器後的行為。
若要體驗即時重新載入，你需要兩個終端機。

* 在第一個終端機中，以 *watch* 模式執行 [`ng build` 命令](cli/build)，將應用程式編譯到 `dist` 資料夾。

  <code-example language="none" class="code-shell">
   ng build --watch
  </code-example>

  和 `ng serve` 命令一樣，原始檔變更時會重新產生輸出檔案。

* 在第二個終端機中，安裝一個網頁伺服器（例如 [lite-server](https://github.com/johnpapa/lite-server)），並針對輸出資料夾執行它。例如：

  <code-example language="none" class="code-shell">
   lite-server --baseDir="dist"
  </code-example>

   有新檔案輸出時，伺服器會自動重新載入你的瀏覽器。

<div class="alert is-critical">

這個方法僅供開發與測試使用，不是受支援或安全的應用程式部署方式。

</div>

### 基本部署到遠端伺服器

最簡單的部署方式是建立正式環境建置，並把輸出目錄複製到網頁伺服器。

1. 先建立正式環境建置：

  <code-example language="none" class="code-shell">
    ng build --prod
  </code-example>

2. 把輸出資料夾內_所有_的內容（預設為 `dist/`）複製到伺服器上的一個資料夾。

3. 設定伺服器，將遺失檔案的請求重新導向到 `index.html`。
進一步了解伺服器端重新導向，請參閱[下方](#fallback)。

這是你的應用程式最簡單的正式環境就緒部署方式。

{@a deploy-to-github}

### 部署到 GitHub Pages

另一個部署 Angular 應用程式的簡單方法，是使用 [GitHub Pages](https://help.github.com/articles/what-is-github-pages/)。

1. 你需要先[建立 GitHub 帳號](https://github.com/join)（如果你還沒有的話），然後為你的專案[建立儲存庫](https://help.github.com/articles/create-a-repo/)。
記下 GitHub 上的使用者名稱與專案名稱。

1. 使用 Github 專案名稱，透過 Angular CLI 命令 [`ng build`](cli/build) 與這裡顯示的選項建置你的專案：

  <code-example language="none" class="code-shell">
     ng build --prod --output-path docs --base-href /<project_name>/
    </code-example>

1. 建置完成後，複製 `docs/index.html` 並命名為 `docs/404.html`。

1. 提交變更並推送。

1. 在 GitHub 專案頁面上，將其設定為[從 docs 資料夾發佈](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)。

你可以在 `https://<user_name>.github.io/<project_name>/` 看到已部署的頁面。

<div class="alert is-helpful">

看看 [angular-cli-ghpages](https://github.com/angular-buch/angular-cli-ghpages)，這是一個功能完整的套件，可以為你完成上述所有工作，還有額外功能。

</div>

<hr>

{@a server-configuration}

## 伺服器設定

本節介紹你可能需要對伺服器或部署在伺服器上的檔案進行的變更。

{@a fallback}

### 具路由的應用程式必須退回 `index.html`

Angular 應用程式非常適合用簡單的靜態 HTML 伺服器來提供服務。
你不需要伺服器端引擎來動態組合應用程式頁面，因為 Angular 會在客戶端完成這件事。

若應用程式使用 Angular 路由器，你必須設定伺服器：當被請求的檔案不存在時，改回傳應用程式的主頁（`index.html`）。

{@a deep-link}

具路由的應用程式應支援「深層連結」。
_深層連結_ 是指向應用程式內部某個元件路徑的 URL。
例如，`http://www.mysite.com/heroes/42` 就是指向英雄詳細頁面的_深層連結_，該頁面顯示 `id: 42` 的英雄。

當使用者從正在執行的客戶端內部前往該 URL 時沒有問題。
Angular 路由器會解讀該 URL 並路由到該頁面與 hero。

但點選電子郵件中的連結、在瀏覽器網址列輸入它，或只是在 hero 詳細頁面重新整理瀏覽器&mdash;所有這些動作都是由瀏覽器本身處理，_在_正在執行的應用程式之外。
瀏覽器會直接向伺服器請求該 URL，繞過路由器。

靜態伺服器在收到 `http://www.mysite.com/` 的請求時，通常會回傳 `index.html`。
但它會拒絕 `http://www.mysite.com/heroes/42` 並回傳 `404 - Not Found` 錯誤，*除非*它已設定為改回傳 `index.html`。

#### 退回設定範例

沒有任何一種設定適用於所有伺服器。
以下各節說明一些最熱門伺服器的設定。
這份清單絕非詳盡無遺，但應能為你提供一個好的起點。

* [Apache](https://httpd.apache.org/)：在 `.htaccess` 檔案中加入一條
[rewrite 規則](http://httpd.apache.org/docs/current/mod/mod_rewrite.html)，如
  (https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess/) 所示：

  <code-example format=".">
    RewriteEngine On
    &#35 If an existing asset or directory is requested go to it as it is
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]

    &#35 If the requested resource doesn't exist, use index.html
    RewriteRule ^ /index.html
  </code-example>

* [Nginx](http://nginx.org/)：使用 `try_files`，如
[Front Controller Pattern Web Apps](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps) 所述，
並修改為提供 `index.html`：

  <code-example format=".">
    try_files $uri $uri/ /index.html;
  </code-example>

* [IIS](https://www.iis.net/)：在 `web.config` 中加入一條 rewrite 規則，類似
[這裡](http://stackoverflow.com/a/26152011/2116927) 所示：

  <code-example format='.'>
    &lt;system.webServer&gt;
      &lt;rewrite&gt;
        &lt;rules&gt;
          &lt;rule name="Angular Routes" stopProcessing="true"&gt;
            &lt;match url=".*" /&gt;
            &lt;conditions logicalGrouping="MatchAll"&gt;
              &lt;add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /&gt;
              &lt;add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /&gt;
            &lt;/conditions&gt;
            &lt;action type="Rewrite" url="/index.html" /&gt;
          &lt;/rule&gt;
        &lt;/rules&gt;
      &lt;/rewrite&gt;
    &lt;/system.webServer&gt;

  </code-example>

* [GitHub Pages](https://pages.github.com/)：你無法
[直接設定](https://github.com/isaacs/github/issues/408)
GitHub Pages 伺服器，但你可以加入一個 404 頁面。
把 `index.html` 複製為 `404.html`。
它仍會作為 404 回應提供，但瀏覽器會處理該頁面並正確載入應用程式。
同時也建議
[從 `docs/` 於 master 提供服務](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)
並
[建立 `.nojekyll` 檔案](https://www.bennadel.com/blog/3181-including-node-modules-and-vendors-folders-in-your-github-pages-site.htm)

* [Firebase hosting](https://firebase.google.com/docs/hosting/)：加入一條
[rewrite 規則](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-rewrites)。

  <code-example format=".">
    "rewrites": [ {
      "source": "**",
      "destination": "/index.html"
    } ]

  </code-example>

{@a cors}

### 從不同的伺服器請求服務（CORS）

Angular 開發人員在向應用程式自身主機伺服器以外的伺服器發出服務請求（通常是資料服務請求）時，可能會遇到
<a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing" title="Cross-origin resource sharing">
<i>跨來源資源共用</i></a> 錯誤。
瀏覽器禁止這類請求，除非伺服器明確允許。

客戶端應用程式對這些錯誤無能為力。
伺服器必須設定為接受應用程式的請求。
關於如何為特定伺服器啟用 CORS，請參閱
<a href="http://enable-cors.org/server.html" title="Enabling CORS server">enable-cors.org</a>。

<hr>

{@a optimize}

## 正式環境最佳化

`--prod` *meta-flag* 會啟用下列建置最佳化功能。

* [Ahead-of-Time (AOT) Compilation](guide/aot-compiler)：預先編譯 Angular 元件範本。
* [Production mode](#enable-prod-mode)：部署正式環境，藉此啟用_正式模式_。
* Bundling：將你眾多的應用程式與程式庫檔案串連成幾個套件。
* Minification：移除多餘的空白、註解與可選的標記。
* Uglification：將程式碼改寫為使用簡短、難以理解的變數與函式名稱。
* Dead code elimination：移除未被參考的模組與許多未使用的程式碼。

更多 CLI 建置選項及其效果，請參閱 [`ng build`](cli/build)。

{@a enable-prod-mode}

### 啟用執行期正式模式

除了建置最佳化，Angular 也有執行期正式模式。Angular 應用程式預設以開發模式執行，如瀏覽器主控台的下列訊息所示：

<code-example format="nocode">
  Angular is running in the development mode. Call enableProdMode() to enable the production mode.
</code-example>

切換到*正式模式*可以停用開發專屬的檢查（例如雙重變更偵測週期），讓它執行得更快。

當你透過 `--prod` 命令列旗標啟用正式環境建置時，執行期正式模式也會一併啟用。

{@a lazy-loading}

### 延遲載入

只載入應用程式啟動時絕對必須存在的應用程式模組，可以大幅縮短啟動時間。

設定 Angular 路由器，延後載入所有其他模組（及其相關程式碼），方式可以是
[等到應用程式啟動後](guide/router#preloading  "Preloading")
或是在需要時[_延遲載入_](guide/router#asynchronous-routing "Lazy loading")
它們。

<div class="alert is-helpful>

#### 不要急切地從延遲載入的模組匯入內容

如果你打算延遲載入某個模組，請小心不要在應用程式啟動時會急切載入的檔案（例如根 `AppModule`）中匯入它。
如果你這麼做，該模組會立即被載入。

綑綁設定必須考慮延遲載入。由於延遲載入的模組不會在 JavaScript 中被匯入，綑綁工具預設會排除它們。
綑綁工具不知道路由器設定，無法為延遲載入的模組建立獨立的套件。
你必須手動建立這些套件。

CLI 會執行
[Angular Ahead-of-Time Webpack Plugin](https://github.com/angular/angular-cli/tree/master/packages/%40ngtools/webpack)，
它會自動辨識延遲載入的 `NgModules`，並為它們建立獨立的套件。

</div>

{@a measure}

### 衡量效能

當你清楚且準確地了解是什麼讓應用程式變慢時，你就能對要最佳化什麼、如何最佳化做出更好的決定。
原因可能和你想的不一樣。
你可能會浪費大量時間與金錢去最佳化某個沒有實際效益、甚至會讓應用程式更慢的東西。
你應該在對你重要的環境中執行時，衡量應用程式的實際行為。

<a href="https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing" title="Chrome DevTools Network Performance">
Chrome DevTools Network Performance 頁面</a> 是開始學習衡量效能的好地方。

[WebPageTest](https://www.webpagetest.org/) 工具是另一個好選擇，也可以幫助你驗證部署是否成功。

{@a inspect-bundle}

### 檢查套件

<a href="https://github.com/danvk/source-map-explorer/blob/master/README.md">source-map-explorer</a>
工具是檢查正式環境建置後產生的 JavaScript 套件的好方法。

安裝 `source-map-explorer`：

<code-example language="none" class="code-shell">
  npm install source-map-explorer --save-dev
</code-example>

為正式環境建置應用程式，*包含來源對應表*

<code-example language="none" class="code-shell">
  ng build --prod --source-map
</code-example>

列出 `dist/` 資料夾中產生的套件。

<code-example language="none" class="code-shell">
  ls dist/*.bundle.js
</code-example>

執行 explorer，為其中一個套件產生圖形表示。
下列範例顯示 *main* 套件的圖表。

<code-example language="none" class="code-shell">
  node_modules/.bin/source-map-explorer dist/main.*.bundle.js
</code-example>

`source-map-explorer` 會分析隨套件產生的來源對應表，並繪製所有相依性的地圖，準確顯示套件中包含哪些類別。

以下是 QuickStart 的 *main* 套件輸出。

<figure>
  <img src="generated/images/guide/cli-quickstart/quickstart-sourcemap-explorer.png" alt="quickstart 的 sourcemap explorer">
</figure>

{@a base-tag}

## `base` 標籤

HTML [_&lt;base href="..."/&gt;_](/guide/router)
會指定一個基底路徑，用來解析指向圖片、指令碼與樣式表等資產的相對 URL。
例如，給定 `<base href="/my/app/">`，瀏覽器會把 `some/place/foo.jpg` 這樣的 URL
解析為對 `my/app/some/place/foo.jpg` 的伺服器請求。
在導覽期間，Angular 路由器會使用 _base href_ 作為元件、範本與模組檔案的基底路徑。

<div class="alert is-helpful">

另請參閱 [*APP_BASE_HREF*](api/common/APP_BASE_HREF "API: APP_BASE_HREF") 替代方案。

</div>

在開發期間，你通常會在存放 `index.html` 的資料夾中啟動伺服器。
那就是根資料夾，你會在 `index.html` 靠近頂部的地方加入 `<base href="/">`，因為 `/` 是應用程式的根。

但在共用或正式環境伺服器上，你可能會從子資料夾提供應用程式。
例如，當載入應用程式的 URL 是 `http://www.mysite.com/my/app/` 這類網址時，
子資料夾是 `my/app/`，你應該在伺服器版本的 `index.html` 中加入 `<base href="/my/app/">`。

當 `base` 標籤設定錯誤時，應用程式無法載入，瀏覽器主控台會針對遺失的檔案顯示 `404 - Not Found` 錯誤。
查看它*嘗試*在哪裡尋找那些檔案，並適當調整 base 標籤。
