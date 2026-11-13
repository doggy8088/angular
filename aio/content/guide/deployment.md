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

  <code-example language="sh">

   ng build --watch

  </code-example>

  和 `ng serve` 命令一樣，原始檔變更時會重新產生輸出檔案。

* 在第二個終端機中，安裝一個網頁伺服器（例如 [lite-server](https://github.com/johnpapa/lite-server)），並針對輸出資料夾執行它。例如：

  <code-example language="sh">

   lite-server --baseDir="dist/project-name"

  </code-example>

   有新檔案輸出時，伺服器會自動重新載入你的瀏覽器。

<div class="alert is-critical">

這個方法僅供開發與測試使用，不是受支援或安全的應用程式部署方式。

</div>

### 使用 CLI 自動部署

Angular CLI 指令 `ng deploy`（在 8.3.0 版中引入）會執行與你的專案相關聯的 `deploy` [CLI 建置器](guide/cli-builder)。許多第三方建置器為不同平台實作了部署功能。你可以用 `ng add [package name]` 將其中任何一個加入專案。

當你新增具備部署功能的套件時，它會自動在你的工作區設定（`angular.json` 檔案）中，為所選專案加入一段 `deploy` 設定。之後你就能用 `ng deploy` 指令部署該專案。

例如，下列指令會自動將專案部署到 Firebase。

<code-example language="sh">
ng add @angular/fire
ng deploy
</code-example>

這個命令是互動式的。在這種情況下，你必須擁有或建立一個 Firebase 帳戶，並使用該帳戶進行驗證。命令會提示你選取一個 Firebase 專案進行部署

這個命令會為你的應用程式產生最佳化建置（相當於 `ng deploy --prod`），然後把正式環境資產上傳到 Firebase。

下表列出為不同平台實作部署功能的套件。每個套件的 `deploy` 指令可能需要不同的命令列選項。你可以透過下表套件名稱旁的連結進一步瞭解：

| 部署到                                                 | 套件                                                                        |
|---------------------------------------------------------------|--------------------------------------------------------------------------------|
| [Firebase hosting](https://firebase.google.com/docs/hosting)  | [`@angular/fire`](https://npmjs.org/package/@angular/fire)                     |
| [Azure](https://azure.microsoft.com/en-us/)                   | [`@azure/ng-deploy`](https://npmjs.org/package/@azure/ng-deploy)               |
| [Now](https://zeit.co/now)                                    | [`@zeit/ng-deploy`](https://npmjs.org/package/@zeit/ng-deploy)                 |
| [Netlify](https://www.netlify.com/)                           | [`@netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy) |
| [GitHub pages](https://pages.github.com/)                     | [`angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages)         |
| [NPM](https://npmjs.com/)                                     | [`ngx-deploy-npm`](https://npmjs.org/package/ngx-deploy-npm)                   |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`@jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

若你要部署到自行管理的伺服器，或你喜歡的雲端平台沒有對應的建置器，你可以建立一個建置器來使用 `ng deploy` 指令，或是閱讀本指南，瞭解如何手動部署應用程式。

### 基本部署到遠端伺服器

最簡單的部署方式是建立正式環境建置，並把輸出目錄複製到網頁伺服器。

1. 先建立正式環境建置：

  <code-example language="sh">

    ng build --prod

  </code-example>

2. 把輸出資料夾內_所有_的內容（預設為 `dist/project-name/`）複製到伺服器上的一個資料夾。

3. 設定伺服器，將遺失檔案的請求重新導向到 `index.html`。
進一步了解伺服器端重新導向，請參閱[下方](#fallback)。

這是你的應用程式最簡單的正式環境就緒部署方式。

{@a deploy-to-github}

### 部署到 GitHub Pages

若要將你的 Angular 應用程式部署到 [GitHub Pages](https://help.github.com/articles/what-is-github-pages/)，請完成下列步驟：

1. 為你的專案[建立 GitHub 儲存庫](https://help.github.com/articles/create-a-repo/)。

1. 在本機專案中設定 `git`，加入一個指向你在上一步建立的 GitHub 儲存庫的遠端。
  GitHub 會在你建立儲存庫時提供這些命令，讓你可以在命令提示字元中複製貼上。
  這些命令應與下列類似，不過 GitHub 會為你填入專案專屬的設定：

  ```sh
  git remote add origin https://github.com/your-username/your-project-name.git
  git branch -M main
  git push -u origin main
  ```

  當你從 GitHub 貼上這些命令時，它們會自動執行。

1. 建立並切換到名為 `gh-pages` 的 `git` 分支。

  ```sh
  git checkout -b gh-pages
  ```

1. 使用 GitHub 專案名稱，透過 Angular CLI 命令 [`ng build`](cli/build) 與下列選項建置專案，其中 `your_project_name` 是你在步驟 1 為 GitHub 儲存庫取的專案名稱。

  請務必在專案名稱兩側都加上斜線，如 `/your_project_name/`。

  <code-example language="sh">

    ng build --prod --output-path docs --base-href /your_project_name/

  </code-example>

1. 建置完成後，複製 `docs/index.html` 並命名為 `docs/404.html`。

1. 提交變更並推送。

1. 在 GitHub 專案頁面中，前往 Settings 並向下捲動到 GitHub Pages 區段，將網站設定為[從 docs 資料夾發佈](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)。

1. 點選 Save。

1. 點選 GitHub Pages 區段頂部的 GitHub Pages 連結，查看已部署的應用程式。
連結的格式為 `https://<user_name>.github.io/<project_name>/`。

<div class="alert is-helpful">

看看 [angular-cli-ghpages](https://github.com/angular-buch/angular-cli-ghpages)，這是一個功能完整的套件，可以為你完成上述所有工作，還有額外功能。

</div>

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
[rewrite 規則](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)，如
  (https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess/) 所示：

  <code-example>
    RewriteEngine On
    &#35 If an existing asset or directory is requested go to it as it is
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]<br>
    &#35 If the requested resource doesn't exist, use index.html
    RewriteRule ^ /index.html
  </code-example>


* [Nginx](https://nginx.org/)：使用 `try_files`，如
[Front Controller Pattern Web Apps](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps) 所述，
並修改為提供 `index.html`：

  ```
  try_files $uri $uri/ /index.html;
  ```

* [Ruby](https://www.ruby-lang.org/)：使用 ([sinatra](http://sinatrarb.com/)) 建立 Ruby 伺服器，並使用一個設定伺服器 `server.rb` 的基本 Ruby 檔案：

  ```ruby
  require 'sinatra'

  # Folder structure
  # .
  # -- server.rb
  # -- public
  #    |-- project-name
  #        |-- index.html

  get '/' do
      folderDir = settings.public_folder + '/project-name'  # ng build output folder
      send_file File.join(folderDir, 'index.html')
  end
  ```


* [IIS](https://www.iis.net/)：在 `web.config` 中加入一條 rewrite 規則，類似
[這裡](https://stackoverflow.com/a/26152011) 所示：

  <code-example format='.' language="xml">
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

  <code-example language="json">
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
<a href="https://enable-cors.org/server.html" title="Enabling CORS server">enable-cors.org</a>。

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

  Angular is running in development mode. Call enableProdMode() to enable production mode.

</code-example>

切換到*正式模式*可以停用開發專屬的檢查（例如雙重變更偵測週期），讓它執行得更快。

當你透過 `--prod` 命令列旗標啟用正式環境建置時，執行期正式模式也會一併啟用。

{@a lazy-loading}

### 延遲載入

只載入應用程式啟動時絕對必須存在的應用程式模組，可以大幅縮短啟動時間。

設定 Angular 路由器，延後載入所有其他模組（及其相關程式碼），方式可以是
[等到應用程式啟動後](guide/router-tutorial-toh#preloading  "Preloading")
或是在需要時 [_延遲載入_](guide/router#延遲載入 "Lazy loading")
它們。

<div class="callout is-helpful">

<header>不要急切地從延遲載入的模組匯入內容</header>

如果你打算延遲載入某個模組，請小心不要在應用程式啟動時會被急切載入的檔案（例如根 `AppModule`）中匯入它。
如果你這麼做，該模組會立即被載入。

綑綁設定必須考慮延遲載入。由於延遲載入的模組不會在 JavaScript 中被匯入，綑綁工具預設會排除它們。
綑綁工具不知道路由器設定，無法為延遲載入的模組建立獨立的套件。
你必須手動建立這些套件。

CLI 會執行
[Angular Ahead-of-Time Webpack Plugin](https://github.com/angular/angular-cli/tree/master/packages/ngtools/webpack)，
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

<code-example language="sh">

  npm install source-map-explorer --save-dev

</code-example>

為正式環境建置應用程式，*包含來源對應表*

<code-example language="sh">

  ng build --prod --source-map

</code-example>

列出 `dist/project-name/` 資料夾中產生的套件。

<code-example language="sh">

  ls dist/project-name/*.js

</code-example>

執行 explorer，為其中一個套件產生圖形表示。
下列範例顯示 *main* 套件的圖表。

<code-example language="sh">

  node_modules/.bin/source-map-explorer dist/project-name/main*

</code-example>

`source-map-explorer` 會分析隨套件產生的來源對應表，並繪製所有相依性的地圖，準確顯示套件中包含哪些類別。

以下是名為 `cli-quickstart` 的範例應用程式的 *main* 套件輸出。

<div class="lightbox">
  <img src="generated/images/guide/deployment/quickstart-sourcemap-explorer.png" alt="quickstart 的 sourcemap explorer">
</div>

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

{@a differential-loading}

## 差異式載入

建置 Web 應用程式時，你會希望確保應用程式與大多數瀏覽器相容。
即使 JavaScript 不斷演進、持續引入新功能，並非所有瀏覽器都以相同的速度更新，支援這些新功能。

你在開發中使用 TypeScript 撰寫的程式碼，會被編譯並綑綁為 ES2015，也就是與大多數瀏覽器相容的 JavaScript 語法。
所有現代瀏覽器都支援 ES2015 及更新的版本，但在大多數情況下，你仍然需要考慮從不支援 ES2015 的瀏覽器存取應用程式的使用者。
當以較舊的瀏覽器為目標時，[polyfill](guide/browser-support#polyfills) 可以彌補差距，提供那些瀏覽器所支援的舊版 JavaScript 中不存在的功能。

為了最大化相容性，你可以提供單一套件，包含所有編譯後的程式碼，以及可能需要的任何 polyfill。
然而，使用現代瀏覽器的使用者不應該為他們不需要的 polyfill 所增加的套件大小付出代價。
差異式載入（Angular CLI 8 及更高版本支援）可以幫助解決這個問題。

差異式載入是一種策略，讓你的 Web 應用程式能支援多種瀏覽器，但只載入瀏覽器需要的程式碼。當啟用差異式載入時，CLI 會建立兩個獨立的套件，作為你部署的應用程式的一部分。

* 第一個套件包含現代的 ES2015 語法。這個套件利用現代瀏覽器的內建支援，提供更少的 polyfill，讓套件更小。

* 第二個套件包含舊式 ES5 語法的程式碼，以及所有必要的 polyfill。第二個套件較大，但支援較舊的瀏覽器。

### 差異式建置

當你使用 Angular CLI 建置流程部署時，你可以選擇如何以及何時支援差異式載入。
[`ng build` CLI 命令](cli/build) 會查詢瀏覽器設定與設定的建置目標，判斷是否需要支援舊版瀏覽器，以及建置是否應產生差異式載入所需的套件。

下列設定決定你的需求。

* Browserslist

   Browserslist 設定檔包含在你的應用程式[專案結構](guide/file-structure#應用程式設定檔)中，提供你的應用程式支援的最低瀏覽器版本。完整設定選項，請參閱 [Browserslist 規格](https://github.com/browserslist/browserslist)。

* TypeScript 設定

   在 TypeScript 設定檔中，`compilerOptions` 區段的 "target" 選項決定程式碼編譯到的 ECMAScript 目標版本。
   現代瀏覽器原生支援 ES2015，而 ES5 更常用於支援舊版瀏覽器。

<div class="alert is-helpful">

   差異式載入目前僅支援使用 `es2015` 作為編譯目標。用高於 `es2015` 的目標時，建置流程會發出警告。

</div>

對於開發建置，`ng build` 產生的輸出較簡單且較容易除錯，讓你不必過度依賴編譯後程式碼的 sourcemap。

對於正式環境建置，你的設定決定要為應用程式的部署建立哪些套件。
需要時，建置流程也會修改 `index.html` 檔案，加入啟用差異式載入的 script 標籤，如下列範例所示。

<code-example language="html" header="index.html">
&lt;body>
  &lt;app-root>&lt;/app-root>
  &lt;script src="runtime-es2015.js" type="module">&lt;/script>
  &lt;script src="runtime-es5.js" nomodule>&lt;/script>
  &lt;script src="polyfills-es2015.js" type="module">&lt;/script>
  &lt;script src="polyfills-es5.js" nomodule>&lt;/script>
  &lt;script src="styles-es2015.js" type="module">&lt;/script>
  &lt;script src="styles-es5.js" nomodule>&lt;/script>
  &lt;script src="vendor-es2015.js" type="module">&lt;/script>
  &lt;script src="vendor-es5.js" nomodule>&lt;/script>
  &lt;script src="main-es2015.js" type="module">&lt;/script>
  &lt;script src="main-es5.js" nomodule>&lt;/script>
&lt;/body>
</code-example>

每個 script 標籤都有一個 `type="module"` 或 `nomodule` 屬性。原生支援 ES 模組的瀏覽器只會載入帶有 `module` 型別屬性的 script，並忽略帶有 `nomodule` 屬性的 script。舊版瀏覽器只會載入帶有 `nomodule` 屬性的 script，並忽略載入 ES 模組的 `module` 型別 script 標籤。

<div class="alert is-helpful">

   有些舊版瀏覽器仍會下載這兩個套件，但只會依據上述屬性執行適當的 script。你可以在[這裡](https://github.com/philipwalton/webpack-esnext-boilerplate/issues/1)進一步了解這個問題。

</div>

### 設定差異式載入

若要在應用程式建置中包含差異式載入，你必須設定應用程式專案中的 Browserslist 與 TypeScript 設定檔。

下列範例顯示新建立的 Angular 應用程式的 `.browserslistrc` 與 `tsconfig.json` 檔案。在此設定中，IE 9-11 等舊版瀏覽器被忽略，編譯目標為 ES2015。

<code-example language="none" header=".browserslistrc">
# This file is used by the build system to adjust CSS and JS output to support the specified browsers below.
# For additional information regarding the format and rule options, please see:
# https://github.com/browserslist/browserslist#queries

# For the full list of supported browsers by the Angular framework, please see:
# https://angular.io/guide/browser-support

# You can see what browsers were selected by your queries by running:
#   npx browserslist

last 1 Chrome version
last 1 Firefox version
last 2 Edge major versions
last 2 Safari major versions
last 2 iOS major versions
Firefox ESR
not IE 11 # Angular supports IE 11 only as an opt-in. To opt-in, remove the 'not' prefix on this line.
</code-example>

<code-example language="json" header="tsconfig.json">

{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "esnext",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}

</code-example>

<div class="alert is-important">

   若要查看支援哪些瀏覽器並決定哪些設定符合你的瀏覽器支援需求，請參閱 [Browserslist 相容性頁面](https://browserl.ist/?q=%3E+0.5%25%2C+last+2+versions%2C+Firefox+ESR%2C+not+dead%2C+not+IE+9-11)。

</div>

Browserslist 設定讓你可以忽略不支援 ES2015 的瀏覽器。在這種情況下，只會產生單一建置。

如果你的 Browserslist 設定包含對任何舊版瀏覽器的支援，TypeScript 設定中的建置目標會決定建置是否支援差異式載入。

{@a configuration-table }

| Browserslist | ES 目標 | 建置結果 |
| -------- | -------- | -------- |
| 已停用 ES5 支援 | es2015  | 單一建置，不需要 ES5 |
| 已啟用 ES5 支援  | es5     | 單一建置，僅含 ES5 的條件式 polyfill |
| 已啟用 ES5 支援  | es2015  | 差異式載入（兩種建置，含條件式 polyfill） |

{@a test-and-serve}

## 在較舊的瀏覽器中進行本機開發

差異式載入對於以 Angular CLI 10 及更高版本產生的應用程式專案，預設不會啟用。
不過，`ng serve`、`ng test` 與 `ng e2e` 命令會產生單一 ES2015 建置，無法在不支援模組的較舊瀏覽器（例如 IE 11）中執行。

不過，若要保持差異式載入的優點，更好的選擇是為 `ng serve`、`ng e2e` 與 `ng test` 定義多個設定。

{@a differential-serve}

### 為 ES5 設定 serve

若要為 `ng serve` 這麼做，請在 `tsconfig.app.json` 旁建立一個新檔案 `tsconfig-es5.app.json`，內容如下。

<code-example language="json">

{
 "extends": "./tsconfig.app.json",
 "compilerOptions": {
     "target": "es5"
  }
}

</code-example>

在 `angular.json` 中，在 `build` 與 `serve` 目標下加入兩個新的設定區段，指向新的 TypeScript 設定。

<code-example language="json">

"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
      ...
  },
  "configurations": {
    "production": {
        ...
    },
    "es5": {
      "tsConfig": "./tsconfig-es5.app.json"
    }
  }
},
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
      ...
  },
  "configurations": {
    "production": {
     ...
    },
    "es5": {
      "browserTarget": "&lt;app-name&gt;:build:es5"
    }
  }
},

</code-example>

接著，你可以用這個設定執行 `ng serve` 命令。請務必將 `<app-name>`（在 `"<app-name>:build:es5"` 中）替換為應用程式的實際名稱，如同它在 `angular.json` 的 `projects` 下顯示的那樣。例如，如果你的應用程式名稱是 `myAngularApp`，設定就會變成 `"browserTarget": "myAngularApp:build:es5"`。

<code-example language="sh">

ng serve --configuration es5

</code-example>

{@a differential-test}

### 設定 test 命令

在 `tsconfig.spec.json` 旁建立一個新檔案 `tsconfig-es5.spec.json`，內容如下。

<code-example language="json">

{
 "extends": "./tsconfig.spec.json",
 "compilerOptions": {
     "target": "es5"
  }
}

</code-example>

<code-example language="json">

"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
      ...
  },
  "configurations": {
    "es5": {
      "tsConfig": "./tsconfig-es5.spec.json"
    }
  }
},

</code-example>

接著，你可以用這個設定執行測試

<code-example language="sh">

ng test --configuration es5

</code-example>

### 設定 e2e 命令

如上所述，建立一個 [ES5 serve 設定](guide/deployment#為-es5-設定-serve)，並為 E2E 目標設定一個 ES5 設定。

<code-example language="json">

"e2e": {
  "builder": "@angular-devkit/build-angular:protractor",
  "options": {
      ...
  },
  "configurations": {
	  "production": {
		  ...
	  },
    "es5": {
      "devServerTarget": "&lt;app-name&gt;:serve:es5"
    }
  }
},

</code-example>

接著，你可以用這個設定執行 `ng e2e` 命令。請務必將 `<app-name>`（在 `"<app-name>:serve:es5"` 中）替換成應用程式的實際名稱，也就是它在 `angular.json` 的 `projects` 底下出現的名稱。例如，如果你的應用程式名稱是 `myAngularApp`，設定就會變成 `"devServerTarget": "myAngularApp:serve:es5"`。

<code-example language="none" class="code-shell">

ng e2e --configuration es5

</code-example>
