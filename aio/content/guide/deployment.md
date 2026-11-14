# 部署

本頁說明將 Angular 應用程式部署到遠端伺服器的技巧。

{@a dev-deploy}
{@a copy-files}

## 最簡單的部署方式

若要最簡單的部署，請以開發模式建置，並將輸出目錄複製到網頁伺服器。

1. 先從開發建置開始

  <code-example language="none" class="code-shell">
    ng build
  </code-example>


2. 把輸出資料夾內_所有_的內容（預設為 `dist/`）複製到伺服器上的一個資料夾。


3. 如果你將檔案複製到伺服器的_子資料夾_中，請附加建置旗標 `--base-href`，並適當設定 `<base href>`。<br><br>

  例如，如果 `index.html` 在伺服器上的 `/my/app/index.html`，請像這樣將 _base href_ 設為
  `<base href="/my/app/">`。

  <code-example language="none" class="code-shell">
    ng build --base-href=/my/app/
  </code-example>

  你會看到產生的 `dist/index.html` 中已正確設定 `<base href>`。<br><br>
  如果你複製到伺服器的根目錄，請省略此步驟，不要動 `<base href>`。<br><br>
  進一步了解 `<base href>` 的角色，請參閱[下方](guide/deployment#base-tag)。


4. 設定伺服器，將遺失檔案的請求重新導向到 `index.html`。
進一步了解伺服器端重新導向，請參閱[下方](guide/deployment#fallback)。


這_不是_正式環境部署。它未經最佳化，對使用者來說也不會快。
它可能足以在內部與經理、團隊成員及其他利害關係人分享你的進度與想法。

{@a optimize}

## 針對正式環境最佳化

雖然直接從開發環境部署也行得通，
你可以使用額外的 CLI 命令列旗標產生最佳化的建置，
從 `--prod` 開始。

### 使用 _--prod_ 建置

<code-example language="none" class="code-shell">
  ng build --prod
</code-example>

`--prod` _meta-flag_ 會啟用下列最佳化功能。

* [Ahead-of-Time (AOT) Compilation](guide/aot-compiler)：預先編譯 Angular 元件範本。
* [Production mode](#enable-prod-mode)：部署正式環境，藉此啟用_正式模式_。
* Bundling：將你眾多的應用程式與程式庫檔案串連成幾個套件。
* Minification：移除多餘的空白、註解與可選的標記。
* Uglification：將程式碼改寫為使用簡短、難以理解的變數與函式名稱。
* Dead code elimination：移除未被參考的模組與許多未使用的程式碼。

其餘的[複製部署步驟](#copy-files)與之前相同。

你可以加入 `build-optimizer` 旗標，進一步縮小套件大小。

<code-example language="none" class="code-shell">
  ng build --prod --build-optimizer
</code-example>

有關可用建置選項及其作用的詳細資訊，請參閱
[CLI 文件](https://github.com/angular/angular-cli/wiki/build)。

{@a enable-prod-mode}

### 啟用正式模式

Angular 應用程式預設以開發模式執行，如瀏覽器主控台的下列訊息所示：

<code-example format="nocode">
  Angular is running in the development mode. Call enableProdMode() to enable the production mode.
</code-example>

切換到_正式模式_可以停用開發專屬的檢查（例如雙重變更偵測週期），讓它執行得更快。

為正式環境建置（或附加 `--environment=prod` 旗標）會啟用_正式模式_
查看 CLI 產生的 `main.ts` 即可了解其運作方式。

{@a lazy-loading}

### 延遲載入

只載入應用程式啟動時絕對必須存在的應用程式模組，可以大幅縮短啟動時間。

設定 Angular 路由器，延後載入所有其他模組（及其相關程式碼），方式可以是
[等到應用程式啟動後](guide/router#preloading  "Preloading")
或是在需要時[_延遲載入_](guide/router#asynchronous-routing "Lazy loading")
它們。

#### 不要急切地從延遲載入的模組匯入內容

這是常見的錯誤。
你已安排延遲載入某個模組。
但你不經意地在應用程式啟動時會急切載入的檔案（例如根 `AppModule`）中，用 JavaScript `import` 陳述式匯入了它。
如果你這麼做，該模組會立即被載入。

綑綁設定必須考慮延遲載入。
由於延遲載入的模組不會在 JavaScript 中被匯入（如剛才所述），綑綁工具預設會排除它們。
綑綁工具不知道路由器設定，不會為延遲載入的模組建立獨立的套件。
你必須手動建立這些套件。

CLI 會執行
[Angular Ahead-of-Time Webpack Plugin](https://github.com/angular/angular-cli/tree/master/packages/%40ngtools/webpack)，
它會自動辨識延遲載入的 `NgModules`，並為它們建立獨立的套件。

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

## _build_ 與 _serve_

部署時你可能會偏好 `ng build`。

**ng build** 命令用於建置應用程式，並將建置產物部署到其他地方。
**ng serve** 命令用於快速、本機、迭代式的開發。

`ng build` 與 `ng serve` 都會先**清除輸出資料夾**再建置專案。
`ng build` 命令會將產生的建置產物寫入輸出資料夾。
`ng serve` 命令則不會。
它改從記憶體提供建置產物，以獲得更快的開發體驗。

<div class="alert is-helpful">

輸出資料夾預設為 `dist/`。
若要輸出到不同的資料夾，請變更 `angular.json` 中的 `outputPath`。

</div>

`ng serve` 命令會從本機 CLI 開發伺服器建置、監看並提供應用程式。

`ng build` 命令只產生一次輸出檔案，不提供它們。
`ng build --watch` 命令會在原始檔變更時重新產生輸出檔案。
如果你正在開發期間建置，並自動將變更重新部署到另一台伺服器，
這個 `--watch` 旗標很有用。


更多詳細資訊與選項，請參閱 [CLI `build` 主題](https://github.com/angular/angular-cli/wiki/build)。

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

#### 開發伺服器

* [Lite-Server](https://github.com/johnpapa/lite-server)：隨
[Quickstart 儲存庫](https://github.com/angular/quickstart) 一起安裝的預設開發伺服器，已預先設定為退回 `index.html`。


* [Webpack-Dev-Server](https://github.com/webpack/webpack-dev-server)：在開發伺服器選項中如下設定
`historyApiFallback` 項目：

  <code-example>
    historyApiFallback: {
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
    }
  </code-example>


#### 正式環境伺服器

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


* [NGinx](http://nginx.org/)：使用 `try_files`，如
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
