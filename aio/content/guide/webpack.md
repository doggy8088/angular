# Webpack：簡介

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }

</style>



[**Webpack**](https://webpack.github.io/) 是一個熱門的模組綑綁工具，
能將應用程式原始碼綑綁成方便使用的_區塊_，
並將這些程式碼從伺服器載入瀏覽器。

它是文件其他部分所用 *SystemJS* 做法的絕佳替代方案。
本指南帶你初步認識 Webpack，並說明如何將它用於 Angular 應用程式。


{@a top}

<!--


# Contents

* [What is Webpack?](guide/webpack#what-is-webpack)

  * [Entries and outputs](guide/webpack#entries-outputs)
  * [Multiple bundles](guide/webpack#multiple-bundles)
  * [Loaders](guide/webpack#loaders)
  * [Plugins](guide/webpack#plugins)

* [Configuring Webpack](guide/webpack#configure-webpack)

  * [Polyfills](guide/webpack#polyfills)
  * [Common configuration](guide/webpack#common-configuration)
  * [Inside `webpack.common.js`](guide/webpack#inside-webpack-commonjs)

    * [entry](guide/webpack#common-entries)
    * [resolve extension-less imports](guide/webpack#common-resolves)
    * [`module.rules`](guide/webpack#common-rules)
    * [Plugins](guide/webpack#plugins)
    * [`CommonsChunkPlugin`](guide/webpack#commons-chunk-plugin)
    * [`HtmlWebpackPlugin`](guide/webpack#html-webpack-plugin)

  * [Environment specific configuration](guide/webpack#environment-configuration)
  * [Development configuration](guide/webpack#development-configuration)
  * [Production configuration](guide/webpack#production-configuration)
  * [Test configuration](guide/webpack#test-configuration)

* [Trying it out](guide/webpack#try)
* [Highlights](guide/webpack#highlights)
* [Conclusion](guide/webpack#conclusion)

-->

你也可以<a href="generated/zips/webpack/webpack.zip" target="_blank">下載最終成果。</a>

{@a what-is-webpack}

## 什麼是 Webpack？

Webpack 是一個強大的模組綑綁工具。
_套件_（bundle）是一個 JavaScript 檔案，匯集了_屬於_同一組的資產，
並應在對單一檔案的一次請求回應中，一併提供給客戶端。
套件可以包含 JavaScript、CSS 樣式、HTML，以及幾乎任何其他種類的檔案。

Webpack 會遍歷你的應用程式原始碼，
尋找 `import` 陳述式，建立相依性圖，並產生一個或多個_套件_。
搭配外掛與規則，Webpack 可以預先處理並最小化各種非 JavaScript 檔案，例如 TypeScript、SASS 與 LESS 檔案。

Webpack 做什麼、如何做，都由你透過一個 JavaScript 設定檔 `webpack.config.js` 來決定。


{@a entries-outputs}



### 進入點與輸出

你提供一個或多個*進入點*檔案給 Webpack，讓它找出並納入從這些進入點向外延伸的相依性。
本範例唯一的進入點檔案是應用程式的根檔案 `src/main.ts`：


<code-example path="webpack/config/webpack.common.js" region="one-entry" title="webpack.config.js (single entry)" linenums="false">

</code-example>



Webpack 會檢查該檔案，並遞迴遍歷它的 `import` 相依性。


<code-example path="webpack/src/app/app.component.ts" region="component" title="src/main.ts" linenums="false">

</code-example>



它發現你正在匯入 `@angular/core`，便將其加入相依性清單，作為可能納入套件的候選。
它開啟 `@angular/core` 檔案，並沿著_它自己的_ `import` 陳述式網路一路追蹤，直到從 `main.ts` 向下建立出完整的相依性圖。

接著它會把這些檔案**輸出**到設定中指定的 `app.js` _套件檔案_：

<code-example name="webpack.config.js (single output)" language="javascript">
  output: {
    filename: 'app.js'
  }

</code-example>

這個 `app.js` 輸出套件是一個單一的 JavaScript 檔案，包含應用程式原始碼及其相依性。
稍後你會在 `index.html` 中用 `<script>` 標籤載入它。


{@a multiple-bundles}


#### 多個套件
你大概不會想要一個包辦一切的巨大套件。
比較好的做法是把變動頻繁的應用程式程式碼，與相對穩定的供應商程式碼模組分開。

修改設定，讓它有兩個進入點：`main.ts` 與 `vendor.ts`：


<code-example language="javascript">
  entry: {
    app: 'src/app.ts',
    vendor: 'src/vendor.ts'
  },

  output: {
    filename: '[name].js'
  }

</code-example>


Webpack 會建立兩張各自獨立的相依性圖，
並產生*兩個*套件檔案：一個名為 `app.js`，只包含應用程式程式碼；
另一個名為 `vendor.js`，包含所有供應商相依性。


<div class="l-sub-section">



輸出名稱中的 `[name]` 是一個*預留位置*，Webpack 外掛會把它替換成進入點名稱，
也就是 `app` 與 `vendor`。外掛將在本指南[稍後說明](guide/webpack#commons-chunk-plugin)。


</div>



若要告訴 Webpack 哪些內容屬於供應商套件，
請新增一個 `vendor.ts` 檔案，只匯入應用程式的第三方模組：

<code-example path="webpack/src/vendor.ts" title="src/vendor.ts" linenums="false">

</code-example>



{@a loaders}



### 載入器

Webpack 可以綑綁任何種類的檔案：JavaScript、TypeScript、CSS、SASS、LESS、圖片、HTML、字型，無所不包。
但 Webpack _本身_只懂 JavaScript 檔案。
請用*載入器*（loader）教它把非 JavaScript 檔案轉換成對應的 JavaScript。
TypeScript 與 CSS 的載入器設定如下。


<code-example language="javascript">
  rules: [
    {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader'
    },
    {
      test: /\.css$/,
      loaders: 'style-loader!css-loader'
    }
  ]

</code-example>



當 Webpack 遇到如下的 `import` 陳述式時，
它會套用 `test` 的 RegEx 模式。


<code-example language="typescript">
  import { AppComponent } from './app.component.ts';

  import 'uiframework/dist/uiframework.css';

</code-example>



當某個模式與檔名相符時，Webpack 就用對應的載入器處理該檔案。

第一個 `import` 檔案符合 `.ts` 模式，因此 Webpack 用 `awesome-typescript-loader` 處理它。
被匯入的檔案不符合第二個模式，所以它的載入器會被忽略。

第二個 `import` 符合第二個 `.css` 模式，而你為它串連了*兩個*以（!）字元相連的載入器。
Webpack 套用串連載入器的順序是*由右至左*。因此它會先套用
`css` 載入器，將 CSS 的 `@import` 與 `url(...)` 陳述式攤平。
接著再套用 `style` 載入器，把 CSS 附加到頁面上的 `<style>` 元素內。


{@a plugins}



### 外掛

Webpack 有一條階段分明的建置管線。
你可以用外掛接入這條管線，例如 `uglify` 最小化外掛：

<code-example language="javascript">
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]

</code-example>



{@a configure-webpack}



## 設定 Webpack

經過這段簡短的導覽，你已經準備好為 Angular 應用程式建立自己的 Webpack 設定了。

先從設定開發環境開始。

建立一個新的專案資料夾。

<code-example language="sh" class="code-shell">
  mkdir angular-webpack
  cd    angular-webpack

</code-example>



加入這些檔案：


<code-tabs>

  <code-pane title="package.json" path="webpack/package.webpack.json">

  </code-pane>

  <code-pane title="src/tsconfig.json" path="webpack/src/tsconfig.1.json">

  </code-pane>

  <code-pane title="webpack.config.js" path="webpack/webpack.config.js">

  </code-pane>

  <code-pane title="karma.conf.js" path="webpack/karma.webpack.conf.js">

  </code-pane>

  <code-pane title="config/helpers.js" path="webpack/config/helpers.js">

  </code-pane>

</code-tabs>



<div class="l-sub-section">



這些檔案中有許多你應該在其他 Angular 文件指南中見過，
尤其是 [TypeScript 設定](guide/typescript-configuration)與
[npm 套件](guide/npm-packages)指南。

Webpack、外掛與載入器也都以套件形式安裝。
它們列在更新後的 `packages.json` 中。


</div>



開啟終端機視窗，安裝 npm 套件。

<code-example language="sh" class="code-shell">
  npm install

</code-example>



{@a polyfills}



### Polyfills

如[瀏覽器支援](guide/browser-support)指南所述，你需要 polyfill
才能在大多數瀏覽器中執行 Angular 應用程式。

Polyfill 應該與應用程式套件及供應商套件分開綑綁。
在 `src/` 資料夾中加入像這樣的 `polyfills.ts`。


<code-example path="webpack/src/polyfills.ts" title="src/polyfills.ts" linenums="false">

</code-example>



<div class="callout is-critical">



<header>
  載入 polyfills
</header>



在 `polyfills.ts` 中及早載入 `zone.js`，緊接在其他 ES6 與中繼資料 shim 之後。


</div>



由於這個套件檔案會最先載入，`polyfills.ts` 也是設定瀏覽器環境
要採正式環境還是開發環境的好地方。


{@a common-configuration}



### 共通設定

開發人員通常會為開發、正式與測試環境分別準備設定。
三者的設定有許多共通之處。

把共通設定集中到一個名為 `webpack.common.js` 的檔案中。


<code-example path="webpack/config/webpack.common.js" title="config/webpack.common.js" linenums="false">

</code-example>



{@a inside-webpack-commonjs}


### _webpack.common.js_ 內部
Webpack 是一個以 NodeJS 為基礎的工具，它從一個 JavaScript commonjs 模組檔案讀取設定。

該設定以 `require` 陳述式匯入相依性，
並將數個物件匯出為 `module.exports` 物件的屬性。

* [`entry`](guide/webpack#common-entries)&mdash;定義套件的進入點檔案。
* [`resolve`](guide/webpack#common-resolves)&mdash;當檔名缺少副檔名時，如何解析檔名。
* [`module.rules`](guide/webpack#common-rules)&mdash; `module` 是一個物件，其 `rules` 決定檔案如何載入。
* [`plugins`](guide/webpack#common-plugins)&mdash;建立外掛的實例。


{@a common-entries}


#### _entry_

第一個匯出的是 `entry` 物件：


<code-example path="webpack/config/webpack.common.js" region="entries" title="config/webpack.common.js" linenums="false">

</code-example>



這個 `entry` 物件定義了三個套件：

* `polyfills`&mdash;在大多數現代瀏覽器中執行 Angular 應用程式所需的 polyfill。
* `vendor`&mdash;第三方相依性，例如 Angular、lodash 與 bootstrap.css。
* `app`&mdash;應用程式程式碼。


{@a common-resolves}


#### _resolve_ 無副檔名匯入

應用程式會 `import` 數十、甚至數百個 JavaScript 與 TypeScript 檔案。
你可以像這個範例一樣，在 `import` 陳述式中寫明副檔名：

<code-example language="typescript">
  import { AppComponent } from './app.component.ts';

</code-example>


但大多數 `import` 陳述式根本不提副檔名。
請告訴 Webpack：解析無副檔名的檔案請求時，要尋找副檔名為
`.ts` 或 `.js` 的相符檔案（分別對應一般 JavaScript 檔案與預先編譯的 TypeScript 檔案）。


<code-example path="webpack/config/webpack.common.js" region="resolve" title="config/webpack.common.js" linenums="false">

</code-example>



<div class="l-sub-section">



如果 Webpack 也應該為樣式與 HTML 解析無副檔名檔案，
請把 `.css` 與 `.html` 加入清單。


</div>



{@a common-rules}




#### _module.rules_
規則告訴 Webpack 每個檔案（或模組）該使用哪些載入器：


<code-example path="webpack/config/webpack.common.js" region="loaders" title="config/webpack.common.js" linenums="false">

</code-example>



* `awesome-typescript-loader`&mdash;在 `tsconfig.json` 檔案的引導下，將 TypeScript 程式碼轉譯為 ES5 的載入器。
* `angular2-template-loader`&mdash;載入 Angular 元件的範本與樣式。
* `html-loader`&mdash;用於元件範本。
* 圖片／字型&mdash;圖片與字型也會一併綑綁。
* CSS&mdash;第一個模式比對全應用程式範圍的樣式；第二個模式處理
元件範圍的樣式（也就是在元件的 `styleUrls` 中繼資料屬性中指定的樣式）。

<div class="l-sub-section">



第一個模式用於全應用程式範圍的樣式。它會排除 `src/app` 目錄內的 `.css` 檔案，
元件範圍的樣式就位於該處。下文說明的 `ExtractTextPlugin` 會對這些檔案套用 `style` 與 `css`
載入器。

第二個模式篩選元件範圍的樣式，並透過 `raw-loader` 將它們以字串形式載入，
這正是 Angular 對 `styleUrls` 中繼資料屬性中指定的樣式所期望的處理方式。


</div>



<div class="l-sub-section">



多個載入器可以用陣列表示法串連。


</div>



{@a common-plugins}




#### _plugins_
最後，建立三個外掛的實例：


<code-example path="webpack/config/webpack.common.js" region="plugins" title="config/webpack.common.js" linenums="false">

</code-example>



{@a commons-chunk-plugin}


#### *CommonsChunkPlugin*

`app.js` 套件應該只包含應用程式程式碼。所有供應商程式碼都屬於 `vendor.js` 套件。

當然，應用程式程式碼會匯入供應商程式碼。
單靠 Webpack 本身，還不夠聰明到能把供應商程式碼排除在 `app.js` 套件之外。
這份工作由 `CommonsChunkPlugin` 完成。

<div class="l-sub-section">



`CommonsChunkPlugin` 辨識三個_區塊_之間的階層關係：`app` -> `vendor` -> `polyfills`。
當 Webpack 發現 `app` 與 `vendor` 有共用的相依性時，就會把它們從 `app` 中移除。
如果 `vendor` 與 `polyfills` 有共用相依性，它也會把 `polyfills` 從 `vendor` 中移除，不過它們並沒有。


</div>



{@a html-webpack-plugin}


#### _HtmlWebpackPlugin_

Webpack 會產生許多 js 與 CSS 檔案。
你_可以_手動把它們插入 `index.html`，但那既繁瑣又容易出錯。
Webpack 可以用 `HtmlWebpackPlugin` 替你注入這些指令碼與連結。


{@a environment-configuration}



### 環境專屬設定

`webpack.common.js` 設定檔承擔了大部分繁重的工作。
請建立各自獨立、環境專屬的設定檔，在 `webpack.common` 的基礎上，
併入目標環境特有的部分。

這些檔案通常簡短而簡單。


{@a development-configuration}



### 開發設定

以下是 `webpack.dev.js` 開發設定檔。


<code-example path="webpack/config/webpack.dev.js" title="config/webpack.dev.js" linenums="false">

</code-example>



開發建置依賴 Webpack 開發伺服器，其設定位於檔案接近底部的位置。

雖然你告訴 Webpack 把輸出套件放在 `dist` 資料夾，
開發伺服器會把所有套件保留在記憶體中，不會寫入磁碟。
你在 `dist` 資料夾中找不到任何檔案，至少找不到由*本次開發建置*產生的檔案。


在 `webpack.common.js` 中加入的 `HtmlWebpackPlugin`，會使用 `publicPath` 與 `filename` 設定，
在 `index.html` 中產生適當的 `<script>` 與 `<link>` 標籤。

CSS 樣式預設埋在 JavaScript 套件裡面。`ExtractTextPlugin` 會把它們擷取成
外部的 `.css` 檔案，再由 `HtmlWebpackPlugin` 以 `<link>` 標籤寫入 `index.html`。

這些設定選項及其他設定選項的詳細資訊，
請參閱 [Webpack 文件](https://webpack.github.io/docs/)。

取得本指南結尾的應用程式程式碼，動手試試：


<code-example language="sh" class="code-shell">
  npm start

</code-example>



{@a production-configuration}



### 正式環境設定

*正式環境*建置的設定與*開發*設定相似，只有幾處關鍵差異。


<code-example path="webpack/config/webpack.prod.js" title="config/webpack.prod.js" linenums="false">

</code-example>



你會把應用程式及其相依性部署到真正的正式環境伺服器。
你不會部署只在開發時需要的產物。

把正式環境的輸出套件檔案放在 `dist` 資料夾。

Webpack 產生的檔名帶有可破除快取的雜湊值。
多虧了 `HtmlWebpackPlugin`，雜湊值變更時你不必更新 `index.html` 檔案。

還有一些額外的外掛：

* *`NoEmitOnErrorsPlugin`&mdash;發生錯誤時停止建置。
* *`UglifyJsPlugin`&mdash;最小化套件。
* *`ExtractTextPlugin`&mdash;將內嵌的 CSS 擷取為外部檔案，並在檔名加入可破除快取的雜湊值。
* *`DefinePlugin`&mdash;用來定義可在應用程式內參考的環境變數。
* *`LoaderOptionsPlugins`&mdash;覆寫某些載入器的選項。

多虧了 `DefinePlugin` 與檔案頂部定義的 `ENV` 變數，你可以像這樣啟用 Angular 正式模式：


<code-example path="webpack/src/main.ts" region="enable-prod" title="src/main.ts" linenums="false">

</code-example>



取得本指南結尾的應用程式程式碼，動手試試：


<code-example language="sh" class="code-shell">
  npm run build

</code-example>



{@a test-configuration}



### 測試設定

執行單元測試不需要太多設定。
你不需要為開發與正式環境建置宣告的那些載入器與外掛。
你大概也不需要為單元測試載入並處理全應用程式範圍的樣式檔案，那樣做只會拖慢速度；
那些 CSS 檔案請改用 `null` 載入器。

你可以把測試設定併入 `webpack.common` 設定，再覆寫你不想要或不需要的部分。
但從一份全新的設定重新開始，可能更簡單。


<code-example path="webpack/config/webpack.test.js" title="config/webpack.test.js" linenums="false">

</code-example>



重新設定 [Karma](https://karma-runner.github.io/1.0/index.html)，改用 Webpack 執行測試：


<code-example path="webpack/config/karma.conf.js" title="config/karma.conf.js" linenums="false">

</code-example>



你不會預先編譯 TypeScript；Webpack 會即時在記憶體中轉譯 TypeScript 檔案，並將產生的 JS 直接餵給 Karma。
磁碟上沒有暫存檔案。

`karma-test-shim` 告訴 Karma 要預先載入哪些檔案，
並用每個應用程式都期望預先載入的提供者測試版本，為 Angular 測試框架做好準備。


<code-example path="webpack/config/karma-test-shim.js" title="config/karma-test-shim.js" linenums="false">

</code-example>



請注意，你並_沒有_明確載入應用程式程式碼。
你告訴 Webpack 去找出並載入測試檔案（檔名以 `.spec.ts` 結尾的檔案）。
每個規格檔案只會匯入它所測試的全部&mdash;且僅限於&mdash;那些應用程式原始碼。
Webpack 只載入_那些_特定的應用程式檔案，並忽略其他你沒有在測試的檔案。


取得本指南結尾的應用程式程式碼，動手試試：


<code-example language="sh" class="code-shell">
  npm test

</code-example>

{@a try}

## 動手試試

以下是一個小應用程式的原始碼，它使用本指南介紹的
Webpack 技巧進行綑綁。


<code-tabs>

  <code-pane title="src/index.html" path="webpack/src/index.html">

  </code-pane>

  <code-pane title="src/main.ts" path="webpack/src/main.ts">

  </code-pane>

  <code-pane title="src/assets/css/styles.css" path="webpack/src/assets/css/styles.css">

  </code-pane>

</code-tabs>



<code-tabs>

  <code-pane title="src/app/app.component.ts" path="webpack/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/app.component.html" path="webpack/src/app/app.component.html">

  </code-pane>

  <code-pane title="src/app/app.component.css" path="webpack/src/app/app.component.css">

  </code-pane>

  <code-pane title="src/app/app.component.spec.ts" path="webpack/src/app/app.component.spec.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts" path="webpack/src/app/app.module.ts">

  </code-pane>

</code-tabs>



<code>app.component.html</code> 會顯示這個可下載的 Angular 標誌
<a href="assets/images/logos/angular/angular.png">
<img src="assets/images/logos/angular/angular.png" height="40px" title="download Angular logo"></a>。
在專案的 `assets` 資料夾下建立一個名為 `images` 的資料夾，然後在圖片上按右鍵（Mac 上用 Cmd+click）
將它下載到該資料夾。


{@a bundle-ts}


以下再次列出定義 `polyfills` 與 `vendor` 套件的 TypeScript 進入點檔案。

<code-tabs>

  <code-pane title="src/polyfills.ts" path="webpack/src/polyfills.ts">

  </code-pane>

  <code-pane title="src/vendor.ts" path="webpack/src/vendor.ts">

  </code-pane>

</code-tabs>

{@a highlights}

<h3 class="no-toc">重點整理</h3>

* `index.html` 中沒有 `<script>` 或 `<link>` 標籤。
`HtmlWebpackPlugin` 會在執行階段動態插入它們。

* `app.component.ts` 中的 `AppComponent` 以簡單的 `import` 陳述式匯入全應用程式範圍的 CSS。

* `AppComponent` 本身有自己的 HTML 範本與 CSS 檔案。Webpack 以 `require()` 呼叫載入它們。
Webpack 也會把這些元件範圍的檔案收進 `app.js` 套件。
你在原始碼中看不到這些呼叫；
它們是由 `angular2-template-loader` 外掛在幕後加入的。

* `vendor.ts` 由驅動 `vendor.js` 套件的供應商相依性 `import` 陳述式組成。
應用程式也會匯入這些模組；如果 `CommonsChunkPlugin` 沒有偵測到重疊並把它們從 `app.js` 中移除，
它們就會在 `app.js` 套件中重複出現。
{@a conclusion}

## 結論

你已經學到足以為小型 Angular 應用程式設定開發、測試與正式環境建置的
Webpack 知識。

_你永遠可以學得更多_。上網搜尋專家建議，擴展你的 Webpack 知識。

[回到頂部](guide/webpack#top)
