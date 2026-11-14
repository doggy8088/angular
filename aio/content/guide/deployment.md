# 部署

本頁說明部署與最佳化你的 Angular 應用程式的工具與技巧。


{@a toc}

{@a overview}



## 總覽

本指南說明將 Angular 應用程式準備好並部署到遠端伺服器的技巧。
這些技巧從_簡單但非最佳_進展到_更最佳、也更繁複_。

* [最簡單的方式](guide/deployment#dev-deploy "Simplest deployment possible")是把開發環境複製到伺服器上。

* [_Ahead of Time_ 編譯 (AOT)](guide/deployment#aot "AOT Compilation")是
[幾種最佳化策略](guide/deployment#optimize)中的第一種。
你也會想閱讀 [AOT 食譜](guide/aot-compiler "AOT Cookbook")中的詳細說明。

* [Webpack](guide/deployment#webpack "Webpack Optimization")是一種受歡迎的通用打包工具，擁有豐富的生態系，包括 AOT 的外掛。
Angular 的 [webpack 指南](guide/webpack "Webpack: an introduction")可以幫助你入門，
而_本_頁提供額外的最佳化建議，但你可能還是得自己多了解 webpack。

* [Angular 設定](guide/deployment#angular-configuration "Angular configuration")一節提請注意
可能改善效能的特定用戶端應用程式變更。

* [伺服器設定](guide/deployment#server-configuration "Server configuration")一節說明
伺服器端可能必須做的變更，_無論你如何部署應用程式_。



{@a dev-deploy}


## 最簡單的部署方式

部署應用程式最簡單的方式，是直接從開發環境將它發佈到網站伺服器上。

它已經在本機執行了。你只需把它幾乎_原封不動_地
複製到一台他人可以連上的非本機伺服器。

1. 把本機專案資料夾中的_所有內容_（或[_幾乎所有內容_](guide/deployment#node-modules "Loading npm packages from the web")）
複製到伺服器上的一個資料夾。

1. 如果你從子資料夾提供應用程式，
請編輯一份 `index.html`，適當設定 `<base href>`。
例如，如果 `index.html` 的 URL 是 `www.mysite.com/my/app/`，就把 _base href_ 設為
`<base href="/my/app/">`。
否則，就保持不動。
[下文有更多說明](guide/deployment#base-tag)。

1. 設定伺服器，把遺失檔案的請求重新導向到 `index.html`。
[下文有更多說明](guide/deployment#fallback)。

1. 依[下文所述](guide/deployment#enable-prod-mode)啟用正式模式（可選）。

這是你能做的最簡單的部署。


<div class="alert is-helpful">



這_不是_正式環境部署。它未經最佳化，對使用者來說也不會快。
它可能足以在內部與經理、團隊成員及其他利害關係人分享你的進度與想法。
務必閱讀下方的[針對正式環境最佳化](guide/deployment#optimize "Optimizing for production")。



</div>



{@a node-modules}


### 從網路載入 npm 套件檔案 (SystemJS)

_npm 套件_的 `node_modules` 資料夾所包含的程式碼，
遠多於在瀏覽器中實際執行你的應用程式所需的數量。
Quickstart 安裝的 `node_modules` 通常有 20,500 多個檔案、超過 180 MB。
應用程式本身只需要其中極小的一部分就能執行。

上傳所有這些無用的龐大內容需要很長時間，
而且使用者會不必要地等待函式庫檔案逐一零碎下載。

改從網路載入你需要的少數檔案。

(1) 為部署製作一份 `index.html` 副本，並把所有 `node_module` 腳本
換成從網路載入的版本。它可能看起來像這樣。


<code-example path="deployment/src/index.html" region="node-module-scripts" linenums="false">

</code-example>



(2) 把 `systemjs.config.js` 腳本換成一個
載入 `systemjs.config.server.js` 的腳本。

<code-example path="deployment/src/index.html" region="systemjs-config" linenums="false">

</code-example>



(3) 把 `systemjs.config.server.js`（如下方程式碼範例所示）加入 `src/` 資料夾。
這個替代版本會設定 _SystemJS_，從網路載入 Angular
（以及其他第三方套件）的 _UMD_ 版本。

視需要修改 `systemjs.config.server.js`，讓它與你對
`systemjs.config.js` 所做的變更保持同步。

請注意 `paths` 鍵：


<code-example path="deployment/src/systemjs.config.server.js" region="paths" linenums="false">

</code-example>



在標準的 SystemJS 設定中，`npm` 路徑指向 `node_modules/`。
在這份伺服器設定中，它指向
<a href="https://unpkg.com/" title="unpkg.com">https://unpkg.com</a>，
一個託管 _npm 套件_的網站，
並直接從網路載入它們。
也有其他服務提供者做同樣的事。

如果你不願意或無法從開放的網路載入套件，
`systemjs.config.server.js` 中的清單指出了你會複製到伺服器上函式庫資料夾的檔案與資料夾。
然後把設定的 `'npm'` 路徑改成指向該資料夾。

### 用範例練習

以下這個簡單的路由器範例應用程式展示了這些變更。


<code-tabs>

  <code-pane title="index.html" path="deployment/src/index.html">

  </code-pane>

  <code-pane title="systemjs.config.server.js" path="deployment/src/systemjs.config.server.js">

  </code-pane>

  <code-pane title="main.ts" path="deployment/src/main.ts">

  </code-pane>

  <code-pane title="app/app.module.ts" path="deployment/src/app/app.module.ts">

  </code-pane>

  <code-pane title="app/app.component.ts" path="deployment/src/app/app.component.ts">

  </code-pane>

  <code-pane title="app/crisis-list.component.ts" path="deployment/src/app/crisis-list.component.ts">

  </code-pane>

  <code-pane title="app/hero-list.component.ts" path="deployment/src/app/hero-list.component.ts">

  </code-pane>

</code-tabs>



在對你的應用程式嘗試這些技巧之前，先用這個範例練習。

1. 按照[設定說明](guide/setup "Angular QuickStart setup")，建立名為 <code>simple-deployment</code> 的新專案。

1. 加入上方所示的「Simple deployment」範例檔案。

1. 像執行任何專案一樣，用 `npm start` 執行它。

1. 在瀏覽器開發者工具中檢查網路流量。
注意它會從網路載入所有套件。
你可以刪除 `node_modules` 資料夾，應用程式仍能執行
（不過在你還原它之前，你將無法重新編譯或啟動 `lite-server`）。

1. 把範例部署到伺服器（不要包含 `node_modules` 資料夾！）。

當它運作正常後，對你的應用程式嘗試同樣的流程。


{@a optimize}



## 針對正式環境最佳化

雖然直接從開發環境部署也行得通，但它遠非最佳。

用戶端會對個別的應用程式程式碼與範本檔案發出許多小型請求，
只要看看瀏覽器開發者工具的網路分頁就能迅速確認這一點。
每個小檔案的下載，花在與伺服器通訊的時間可能比傳輸資料還多。

開發檔案充滿註解與空白，方便閱讀與除錯。
瀏覽器下載的是整個函式庫，而不是只下載應用程式需要的部分。
從伺服器傳到用戶端的程式碼量（「payload」）
可能遠大於嚴格執行應用程式所需的數量。

眾多的請求與龐大的 payload 意味著
應用程式的啟動時間會比最佳化後更長。
使用者可能要等上幾秒（或更久），才能看到或做任何有用的事。

這重要嗎？這取決於你必須自行評估的業務與技術因素。

如果它_確實_重要，有一些工具與技巧可以減少請求的數量與回應的大小。

* Ahead-of-Time (AOT) Compilation：預先編譯 Angular 元件範本。
* Bundling：將模組串連成單一檔案 (bundle)。
* Inlining：將範本 html 與 css 拉入元件中。
* Minification：移除多餘的空白、註解與可選的標記。
* Uglification：將程式碼改寫為使用簡短、難以理解的變數與函式名稱。
* Dead code elimination：移除未被參考的模組與未使用的程式碼。
* Pruned libraries：丟棄未使用的函式庫，並縮減其他函式庫，只保留你需要的功能。
* Performance measurement：聚焦於能帶來可衡量差異的最佳化。

每個工具做的事各不相同。
它們組合使用時效果最好，而且相輔相成。

你可以使用任何你喜歡的建置系統。
無論你選擇什麼系統，務必將它自動化，讓
針對正式環境的建置成為單一步驟。


{@a aot}


### Ahead-of-Time (AOT) 編譯

Angular 的 _Ahead-of-Time_ 編譯器會在建置過程中預先編譯應用程式元件及其範本。

以 AOT 編譯的應用程式啟動更快，原因有幾個。

* 應用程式元件會立即執行，無需用戶端編譯。
* 範本會以程式碼形式內嵌在元件中，因此不會有向用戶端請求範本檔案的情形。
* 你不用下載 Angular 編譯器，它本身就相當龐大。
* 編譯器會丟棄未使用的 Angular 指令，接著搖樹最佳化工具便能將它們排除。

在 [AOT 食譜](guide/aot-compiler "AOT Cookbook")中進一步了解 AOT 編譯，
它說明了如何從命令列執行 AOT 編譯器，
以及如何使用 [_rollup_](guide/deployment#rollup) 進行打包、最小化、混淆化與搖樹最佳化。


{@a webpack}


### Webpack (與 AOT)

<a href="https://webpack.js.org/" title="Webpack 2">Webpack 2</a> 是另一個
將範本與樣式表行內化，並對應用程式進行打包、最小化與混淆化的絕佳選擇。
「[Webpack: an introduction](guide/webpack "Webpack: an introduction")」指南會幫助你開始
在 Angular 中使用 webpack。

考慮使用官方的
<a href="https://github.com/angular/angular-cli/tree/master/packages/%40ngtools/webpack" title="Ahead-of-Time Webpack Plugin">
Angular Ahead-of-Time Webpack Plugin</a>
來設定 _Webpack_。
這個外掛會轉譯 TypeScript 應用程式程式碼、
分別打包延遲載入的 `NgModules`，
並執行 AOT 編譯&mdash;而且完全不需要變更原始碼。


{@a rollup}


### 使用 _rollup_ 消除死程式碼

任何你未曾呼叫的程式碼都是_死程式碼_。
將死程式碼從應用程式與第三方函式庫中移除，可以大幅減少應用程式的總大小。

_搖樹最佳化_是一種_死程式碼消除_技巧，它會從 JavaScript 模組中移除整個匯出。
如果某個函式庫匯出了應用程式未匯入的內容，搖樹最佳化工具會將它從程式碼庫中移除。

搖樹最佳化由
<a href="http://rollupjs.org/" title="Rollup">Rollup</a> 所推廣，它是一個受歡迎的工具，擁有一套由外掛組成的生態系，用於打包、最小化與混淆化。
在 rollup 創作者 Rich Harris 的
<a href="https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.15ih9cyvl" title="Tree-shaking and Dead Code Elimination">
這篇文章</a>中，進一步了解搖樹最佳化與死程式碼消除。


{@a prune}


### 縮減函式庫

不要指望自動化能移除所有的死程式碼。

移除你不使用的函式庫，尤其是 `index.html` 中不必要的腳本。
考慮為你確實使用的函式庫尋找更小的替代品。

有些函式庫提供了建置自訂精簡版的設施，只包含你需要的功能。
其他函式庫則讓你可以 _a la carte_ 地匯入功能。
**RxJS** 就是一個好例子：逐一匯入 RxJS 的 `Observable` 運算子，而不是匯入整個函式庫。


{@a measure}


### 先衡量效能

當你清楚且準確地了解是什麼讓應用程式變慢時，你就能對要最佳化什麼、如何最佳化做出更好的決定。
原因可能和你想的不一樣。
你可能會浪費大量時間與金錢去最佳化某個沒有實際效益、甚至會讓應用程式更慢的東西。
你應該在對你重要的環境中執行時，衡量應用程式的實際行為。

<a href="https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing" title="Chrome DevTools Network Performance">
Chrome DevTools Network Performance 頁面</a> 是開始學習衡量效能的好地方。

[WebPageTest](https://www.webpagetest.org/) 工具是另一個好選擇，也可以幫助你驗證部署是否成功。


{@a angular-configuration}



## Angular 設定

Angular 設定可能決定應用程式是快速啟動，還是根本無法載入。


{@a base-tag}


### `base` 標籤

HTML [_&lt;base href="..."/&gt;_](/guide/router)
會指定一個基底路徑，用來解析指向圖片、指令碼與樣式表等資產的相對 URL。
例如，給定 `<base href="/my/app/">`，瀏覽器會把 `some/place/foo.jpg` 這樣的 URL
解析為對 `my/app/some/place/foo.jpg` 的伺服器請求。
在導覽期間，Angular 路由器會使用 _base href_ 作為元件、範本與模組檔案的基底路徑。


<div class="l-sub-section">



另請參閱 [*APP_BASE_HREF*](api/common/APP_BASE_HREF "API: APP_BASE_HREF") 替代方案。

</div>



在開發期間，你通常會在存放 `index.html` 的資料夾中啟動伺服器。
那就是根資料夾，你會在 `index.html` 靠近頂部的地方加入 `<base href="/">`，因為 `/` 是應用程式的根。

但在共用或正式環境伺服器上，你可能會從子資料夾提供應用程式。
例如，當載入應用程式的 URL 是 `http://www.mysite.com/my/app/` 這類網址時，
子資料夾是 `my/app/`，你應該在伺服器版本的 `index.html` 中加入 `<base href="/my/app/">`。

當 `base` 標籤設定錯誤時，應用程式會無法載入，瀏覽器主控台會顯示遺失檔案的 `404 - Not Found` 錯誤。
看看它_試圖_在哪裡找到那些檔案，並據以適當調整 base 標籤。


{@a enable-prod-mode}


### 啟用正式模式

Angular 應用程式預設以開發模式執行，如瀏覽器主控台的下列訊息所示：


<code-example format="nocode">
  Angular is running in the development mode. Call enableProdMode() to enable the production mode.
</code-example>



切換到正式模式可以讓它執行得更快，方法是停用開發專屬的檢查，例如雙重變更偵測週期。

若要在遠端執行時啟用[正式模式](api/core/enableProdMode)，請將下列程式碼加入 `main.ts`。


<code-example path="deployment/src/main.ts" region="enableProdMode" title="src/main.ts (enableProdMode)" linenums="false">

</code-example>



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

[Angular Ahead-of-Time Webpack Plugin](https://github.com/angular/angular-cli/tree/master/packages/%40ngtools/webpack)
會自動辨識延遲載入的 `NgModules`，並為它們建立個別的套件。



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
[重寫規則](http://httpd.apache.org/docs/current/mod/mod_rewrite.html)，
如[這裡](https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess/)所示：


<code-example format=".">
  RewriteEngine On
  # If an existing asset or directory is requested go to it as it is
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
  RewriteRule ^ - [L]

  # If the requested resource doesn't exist, use index.html
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
          &lt;action type="Rewrite" url="/src/" /&gt;
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

Angular 開發者在向應用程式自己的主機伺服器以外的伺服器發出服務請求（通常是資料服務請求）時，
可能會遇到
<a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing" title="Cross-origin resource sharing">
<i>cross-origin resource sharing</i></a> 錯誤。
除非伺服器明確允許，否則瀏覽器禁止這類請求。

客戶端應用程式對這些錯誤無能為力。
伺服器必須設定為接受應用程式的請求。
關於如何為特定伺服器啟用 CORS，請參閱
<a href="http://enable-cors.org/server.html" title="Enabling CORS server">enable-cors.org</a>。


{@a next-steps}



## 下一步
 如果你想超越[簡單的 _copy-deploy_](guide/deployment#dev-deploy "Simplest deployment possible")方式，
 接著請閱讀 [AOT 食譜](guide/aot-compiler "AOT Cookbook")。
