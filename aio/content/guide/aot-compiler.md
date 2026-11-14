# 預先（AOT）編譯

本食譜說明如何在建置過程中以 _預先_（AOT）方式編譯，從而大幅提升效能。

{@a overview}

## 總覽

Angular 應用程式主要由元件及其 HTML 範本組成。在瀏覽器可以渲染應用程式之前，元件與範本必須由 _Angular 編譯器_ 轉換為可執行的 JavaScript。

<div class="l-sub-section">

  <a href="https://www.youtube.com/watch?v=kW9cJsvcsGo">觀看編譯器作者 Tobias Bosch 講解 Angular 編譯器</a>，於 AngularConnect 2016。

</div>

你可以在應用程式載入時，在瀏覽器中以執行期方式，使用 **_即時_（JIT）編譯器** 編譯應用程式。這是整份文件所展示的標準開發方式。它很好，但也有不足之處。

JIT 編譯會帶來執行期效能損失。由於多了瀏覽器內編譯步驟，檢視的渲染需要更長時間。應用程式也更大，因為它包含 Angular 編譯器，以及許多應用程式實際上用不到的程式庫程式碼。更大的應用程式傳輸時間更長、載入更慢。

編譯能找出許多元件與範本的繫結錯誤。JIT 編譯在執行期才發現它們，在流程中已經太晚了。

**_預先_（AOT）編譯器**可以在建置時編譯，及早抓到範本錯誤並提升效能。

{@a aot-jit}

## _預先_（AOT）與 _即時_（JIT）

其實 Angular 編譯器只有一個。AOT 與 JIT 的差別在於時機與工具。採用 AOT 時，編譯器在建置時使用一組程式庫執行一次；採用 JIT 時，它在執行期為每位使用者、使用另一組程式庫，每次都執行。

{@a why-aot}

## 為什麼要做 AOT 編譯？

*渲染更快速*

使用 AOT 時，瀏覽器下載的是應用程式的預先編譯版本。
瀏覽器載入的是可執行程式碼，因此能立即渲染應用程式，不必等待先編譯應用程式。

*更少的非同步請求*

編譯器會將外部 HTML 範本與 CSS 樣式表*內嵌*至應用程式的 JavaScript 中，
省去針對這些原始檔案的額外 ajax 請求。

*Angular 框架下載大小更小*

若應用程式已經編譯完成，就不需要下載 Angular 編譯器。
編譯器大約占 Angular 本身的一半，因此省略它能大幅減少應用程式的下載量。

*更早偵測範本錯誤*

AOT 編譯器會在建置步驟中偵測並回報範本繫結錯誤，
早於使用者看到這些錯誤之前。

*更好的安全性*

AOT 會在 HTML 範本與元件提供給用戶端之前，早早將它們編譯為 JavaScript 檔案。
由於沒有範本需要讀取，也沒有高風險的用戶端 HTML 或 JavaScript 求值，
注入攻擊的機會因而更少。

{@a compile}

## 使用 AOT 編譯

準備離線編譯只需要幾個簡單步驟。以 <a href='../guide/setup.html'>Setup</a> 為起點。對唯一的 `app.component` 做幾處小改動後，得到以下兩個類別與 HTML 檔案：

<code-tabs>
  <code-pane title="src/app/app.component.html" path="aot-compiler/src/app/app.component.html">
  </code-pane>
  <code-pane title="src/app/app.component.ts" path="aot-compiler/src/app/app.component.ts">
  </code-pane>
</code-tabs>

使用以下指令安裝幾個新的 npm 依賴：

<code-example language="none" class="code-shell">
  npm install @angular/compiler-cli @angular/platform-server --save
</code-example>

你將執行 `@angular/compiler-cli` npm 套件所提供的 `ngc` 編譯器，而不是 TypeScript 編譯器（`tsc`）。

`ngc` 是 `tsc` 的直接替代品，設定方式也大致相同。

`ngc` 需要它自己的 `tsconfig.json`，其中包含以 AOT 為導向的設定。將原始的 `src/tsconfig.json` 複製為專案根目錄下名為 `tsconfig-aot.json` 的檔案，然後如下修改它。

<code-example path="aot-compiler/tsconfig-aot.json" title="tsconfig-aot.json" linenums="false">
</code-example>

`compilerOptions` 區段除了有一個屬性之外，其餘未變。**請將 `module` 設為 `es2015`。**這一點很重要，原因將在後面的 [Tree Shaking](guide/aot-compiler#tree-shaking) 一節中說明。

真正的新東西是底部名為 `angularCompilerOptions` 的 `ngc` 區段。它的 `genDir` 屬性告訴編譯器，將編譯後的輸出檔案存放在一個新的 `aot` 資料夾中。

`"skipMetadataEmit" : true` 屬性可防止編譯器隨著編譯後的應用程式產生中繼資料檔案。以 TypeScript 檔案為目標時不需要中繼資料檔案，因此沒有理由包含它們。

***元件相對的範本 URL***

AOT 編譯器要求 `@Component` 用於外部範本與 CSS 檔案的 URL 必須是 _元件相對_ 的。也就是說，`@Component.templateUrl` 的值是一個相對於元件類別檔案的 URL 值。例如，`'app.component.html'` URL 表示該範本檔案與其配套的 `app.component.ts` 檔案位於同層。

雖然 JIT 應用程式的 URL 較有彈性，但為了與 AOT 編譯相容，請堅持使用 _元件相對_ 的 URL。

***編譯應用程式***

使用先前安裝的 `ngc` 編譯器，從命令列啟動 AOT 編譯，執行方式如下：

<code-example language="none" class="code-shell">
  node_modules/.bin/ngc -p tsconfig-aot.json
</code-example>

<div class="l-sub-section">

  Windows 使用者應將 `ngc` 指令以雙引號包起來：

  <code-example format='.'>
    "node_modules/.bin/ngc" -p tsconfig-aot.json
  </code-example>

</div>

`ngc` 期望 `-p` 參數指向一個 `tsconfig.json` 檔案，或一個包含 `tsconfig.json` 檔案的資料夾。

`ngc` 完成後，在 `aot` 資料夾中尋找一組 _NgFactory_ 檔案。`aot` 資料夾是 `tsconfig-aot.json` 中指定為 `genDir` 的目錄。

這些工廠檔案對編譯後的應用程式至關重要。每個元件工廠在執行期透過結合原始類別檔案與元件範本的 JavaScript 表示形式，建立該元件的一個執行個體。請注意，產生的工廠內部仍會參照原始元件類別。

<div class="l-sub-section">

  好奇的人可以開啟 `aot/app.component.ngfactory.ts`，看看原始 Angular 範本語法編譯成 TypeScript 後的中間形式。

  JIT 編譯會在記憶體中產生同樣的 _NgFactories_，它們大多看不見。AOT 編譯則將它們呈現為獨立的實體檔案。

</div>

<div class="alert is-important">

  不要編輯 _NgFactories_！重新編譯會取代這些檔案，所有編輯都會遺失。

</div>

{@a bootstrap}

## 啟動

AOT 方式改變了應用程式的啟動方式。

你不是啟動 `AppModule`，而是以產生的模組工廠 `AppModuleNgFactory` 來啟動應用程式。

複製一份 `main.ts` 並命名為 `main-jit.ts`。這是 JIT 版本；先把它收好，因為你之後可能需要它，見[後文](guide/aot-compiler#run-jit "Running with JIT")。

開啟 `main.ts` 並將它轉換為 AOT 編譯。從 JIT 編譯使用的 `platformBrowserDynamic.bootstrap` 改為 `platformBrowser().bootstrapModuleFactory`，並傳入 AOT 產生的 `AppModuleNgFactory`。

以下是 `main.ts` 中的 AOT 啟動，與原始 JIT 版本並列：

<code-tabs>
  <code-pane title="src/main.ts" path="aot-compiler/src/main.ts">
  </code-pane>
  <code-pane title="src/main-jit.ts" path="aot-compiler/src/main-jit.ts">
  </code-pane>
</code-tabs>

請務必使用 `ngc` [重新編譯](guide/aot-compiler#compile)！

{@a tree-shaking}

## 搖樹優化

AOT 編譯為透過稱為 _tree shaking_ 的過程進行進一步最佳化做好了準備。搖樹器會由上至下走訪依賴圖，並像搖落樹上的枯葉一樣，_搖出_ 未使用的程式碼。

搖樹優化可以移除原始碼與程式庫程式碼中未使用的部分，大幅減少應用程式的下載大小。事實上，在小型應用程式中，大部分的減少來自移除未被參照的 Angular 功能。

例如，這個展示應用程式完全沒有使用 `@angular/forms` 程式庫的任何東西。沒有理由下載與表單相關的 Angular 程式碼，搖樹優化能確保你不會下載它。

搖樹優化與 AOT 編譯是兩個獨立的步驟。搖樹優化只能針對 JavaScript 程式碼。AOT 編譯將應用程式更多部分轉換為 JavaScript，進而使應用程式更多部分可以被「搖樹」。

{@a rollup}

### Rollup

本食譜介紹一個稱為 _Rollup_ 的搖樹公用程式。

Rollup 會跟隨 `import` 與 `export` 陳述式的線索，靜態分析應用程式。它產生一個最終的程式碼 _bundle_，其中排除被匯出但從未被匯入的程式碼。

Rollup 只能對具有 `import` 與 `export` 陳述式的 `ES2015` 模組進行搖樹。

<div class="l-sub-section">

  回想一下，`tsconfig-aot.json` 的設定是產生 `ES2015` 模組。程式碼本身是否以 `class`、`const` 等 `ES2015` 語法撰寫並不重要。重要的是，程式碼使用 ES 的 `import` 與 `export` 陳述式，而不是 `require` 陳述式。

</div>

在終端機視窗中，使用此指令安裝 Rollup 依賴：

<code-example language="none" class="code-shell">
  npm install rollup rollup-plugin-node-resolve rollup-plugin-commonjs rollup-plugin-uglify --save-dev
</code-example>

接下來，在專案根目錄中建立一個設定檔案（`rollup-config.js`），告訴 Rollup 如何處理應用程式。本食譜的設定檔案如下。

<code-example path="aot-compiler/rollup-config.js" title="rollup-config.js" linenums="false">
</code-example>

此設定檔案告訴 Rollup，應用程式的進入點是 `src/app/main.js`。`dest` 屬性告訴 Rollup 在 `dist` 資料夾中建立一個名為 `build.js` 的 bundle。它覆寫預設的 `onwarn` 方法，以略過 AOT 編譯器使用 `this` 關鍵字所引起的惱人訊息。

下一節會更深入地說明這些外掛。

{@a rollup-plugins}

### Rollup 外掛

選用的外掛會篩選並轉換 Rollup 的輸入與輸出。

*RxJS*

Rollup 期望應用程式原始碼使用 `ES2015` 模組。並非所有外部依賴都以 `ES2015` 模組形式發佈。事實上，大多數都不是。許多依賴是以 _CommonJS_ 模組形式發佈的。

_RxJs_ Observable 程式庫是一個必要的 Angular 依賴，它以 ES5 JavaScript _CommonJS_ 模組形式發佈。

幸運的是，有一個 Rollup 外掛可以修改 _RxJs_，讓它使用 Rollup 所需的 ES `import` 與 `export` 陳述式。接著，Rollup 會在最終 bundle 中保留應用程式所參照的 `RxJS` 部分。使用方式很簡單。將以下內容加入 `rollup-config.js` 中的 `plugins` 陣列：

<code-example path="aot-compiler/rollup-config.js" region="commonjs" title="rollup-config.js (CommonJs to ES2015 Plugin)" linenums="false">
</code-example>

*Minification*

Rollup 搖樹優化已大幅減少程式碼大小。壓縮（minification）能讓它再小一些。本食譜依賴 _uglify_ Rollup 外掛來壓縮並重整程式碼。將以下內容加入 `plugins` 陣列：

<code-example path="aot-compiler/rollup-config.js" region="uglify" title="rollup-config.js (CommonJs to ES2015 Plugin)" linenums="false">
</code-example>

<div class="l-sub-section">

  在生產環境設定中，你還會在網頁伺服器上啟用 gzip，將程式碼壓縮成更小的套件透過網路傳輸。

</div>

{@a run-rollup}

### 執行 Rollup

使用以下指令執行 Rollup 處理：

<code-example language="none" class="code-shell">
  node_modules/.bin/rollup -c rollup-config.js
</code-example>

<div class="l-sub-section">

  Windows 使用者應將 `rollup` 指令以雙引號包起來：

  <code-example language="none" class="code-shell">
    "node_modules/.bin/rollup"  -c rollup-config.js
  </code-example>

</div>

{@a load}

## 載入 bundle

載入產生的應用程式 bundle 不需要 SystemJS 這類模組載入器。移除與 SystemJS 有關的腳本。改以單一 `<script>` 標籤載入 bundle 檔案，該標籤須放在 `</body>` 標籤之後：

<code-example path="aot-compiler/src/index.html" region="bundle" title="index.html (load bundle)" linenums="false">
</code-example>

{@a serve}

## 提供應用程式

你需要一個網頁伺服器來託管應用程式。使用文件其他地方所用的同一個 `lite-server`：

<code-example language="none" class="code-shell">
  npm run lite
</code-example>

伺服器啟動、開啟瀏覽器，應用程式應該就會出現。

{@a source-code}

## AOT QuickStart 原始碼

以下是相關的原始碼：

<code-tabs>
  <code-pane title="src/app/app.component.html" path="aot-compiler/src/app/app.component.html">
  </code-pane>
  <code-pane title="src/app/app.component.ts" path="aot-compiler/src/app/app.component.ts">
  </code-pane>
  <code-pane title="src/main.ts" path="aot-compiler/src/main.ts">
  </code-pane>
  <code-pane title="src/index.html" path="aot-compiler/src/index.html">
  </code-pane>
  <code-pane title="tsconfig-aot.json" path="aot-compiler/tsconfig-aot.json">
  </code-pane>
  <code-pane title="rollup-config.js" path="aot-compiler/rollup-config.js">
  </code-pane>
</code-tabs>

{@a workflow}

## 工作流程與便利腳本

每當你做出變更，都要重建應用程式的 AOT 版本。那些 _npm_ 指令又長又難記。

將以下 _npm_ 便利腳本加入 `package.json`，讓你可以一次指令完成編譯與 rollup。

<code-example language="json">
  "build:aot": "ngc -p tsconfig-aot.json && rollup -c rollup-config.js",
</code-example>

開啟終端機視窗並試一試。

<code-example language="none" class="code-shell">
  npm run build:aot
</code-example>

{@a run-jit}

### 搭配 AOT 一起以 JIT 開發

AOT 編譯與 rollup 合計需要數秒鐘。搭配 SystemJS 與 JIT，你或許能稍快一些地反覆開發。同一份原始碼可以用兩種方式建置。以下是一種做法。

* 複製一份 `index.html` 並稱為 `index-jit.html`。
* 刪除 `index-jit.html` 底部載入 `bundle.js` 的腳本
* 如下還原 SystemJS 腳本：

<code-example path="aot-compiler/src/index-jit.html" region="jit" title="src/index-jit.html (SystemJS scripts)" linenums="false">
</code-example>

請注意 `system.import` 的細微變化，它現在指定 `src/app/main-jit`。那正是我們在[上方](guide/aot-compiler#bootstrap)保留的啟動檔案 JIT 版本。

開啟一個 _不同_ 的終端機視窗並輸入 `npm start`。

<code-example language="none" class="code-shell">
  npm start
</code-example>

這會以 JIT 編譯應用程式並啟動伺服器。伺服器載入的 `index.html` 仍是 AOT 版本，這一點你可以從瀏覽器主控台確認。把網址列改為 `index-jit.html`，它載入的就是 JIT 版本。這一點從瀏覽器主控台也能看得出來。

照常開發。伺服器與 TypeScript 編譯器都處於「監看模式」，因此你的變更會立即反映在瀏覽器中。

若要在 AOT 中看到那些變更，請切換到原來的終端機，重新執行 `npm run build:aot`。完成後，回到瀏覽器並使用上一頁按鈕，回到預設 `index.html` 中的 AOT 版本。

現在你可以並行地以 JIT 與 AOT 開發了。

{@a toh}

## 英雄之旅

上方的範例是 QuickStart 應用程式的一個微不足道的變體。在本節中，你將把所學到的 AOT 編譯與搖樹優化知識，應用到一個更有份量的應用程式：[_英雄之旅_](tutorial/toh-pt6) 應用程式。

{@a jit-dev-aot-prod}

### 開發時用 JIT、生產時用 AOT

如今 AOT 編譯與搖樹優化花的時間，對開發來說並不實際。這種情況很快就會改變。目前，最好是在開發時以 JIT 編譯，在部署到生產環境之前改用 AOT 編譯。

幸運的是，只要你考慮到幾個關鍵差異，原始碼不用改變就能以任何一種方式編譯。

***index.html***

JIT 與 AOT 應用程式需要各自的 `index.html` 檔案，因為它們的設定與啟動方式如此不同。

以下將它們並列比較：

<code-tabs>
  <code-pane title="aot/index.html (AOT)" path="toh-pt6/aot/index.html">
  </code-pane>
  <code-pane title="src/index.html (JIT)" path="toh-pt6/src/index.html">
  </code-pane>
</code-tabs>

JIT 版本依賴 `SystemJS` 來載入各個模組。它的腳本出現在它的 `index.html` 中。

AOT 版本在單一腳本 `aot/dist/build.js` 中載入整個應用程式。它不需要 `SystemJS`，因此那個腳本不會出現在它的 `index.html` 中。

***main.ts***

JIT 與 AOT 應用程式的啟動方式大致相同，但需要不同的 Angular 程式庫才能做到。其中關鍵差異，在上方的 [Bootstrap](guide/aot-compiler#bootstrap) 一節已有說明，從這些可以、也應該放在同一個資料夾中的 `main` 檔案即可看出：

<code-tabs>
  <code-pane title="main-aot.ts (AOT)" path="toh-pt6/src/main-aot.ts">
  </code-pane>
  <code-pane title="main.ts (JIT)" path="toh-pt6/src/main.ts">
  </code-pane>
</code-tabs>

***TypeScript 設定***

JIT 編譯的應用程式會轉譯為 `commonjs` 模組。AOT 編譯的應用程式則轉譯為 _ES2015_/_ES6_ 模組，以利搖樹優化。AOT 也需要它自己的 TypeScript 設定。

你會需要像這樣的獨立 TypeScript 設定檔案：

<code-tabs>
  <code-pane title="tsconfig-aot.json (AOT)" path="toh-pt6/tsconfig-aot.json">
  </code-pane>
  <code-pane title="src/tsconfig.json (JIT)" path="toh-pt6/src/tsconfig.1.json">
  </code-pane>
</code-tabs>

<div class="callout is-helpful">

  <header>
    `@types` 與 node 模組
  </header>

  在 _這個特定範例專案_ 的檔案結構中，`node_modules` 資料夾剛好位於專案根目錄上方兩層。因此，`"typeRoots"` 必須設為 `"../../node_modules/@types/"`。

  在較典型的專案中，`node_modules` 會與 `tsconfig-aot.json` 位於同層，`"typeRoots"` 會設為 `"node_modules/@types/"`。請編輯你的 `tsconfig-aot.json` 以符合你專案的檔案結構。

</div>

{@a shaking}

### 搖樹優化

Rollup 一如以往地進行搖樹優化。

<code-example path="toh-pt6/rollup-config.js" title="rollup-config.js" linenums="false">
</code-example>

{@a running-app}

### 執行應用程式

<div class="alert is-important">

  給一般讀者看的執行英雄之旅應用程式 AOT 建置版本的說明尚未就緒。

  以下說明假設你已下載 <a href="generated/zips/toh-pt6/toh-pt6.zip" target="_blank">英雄之旅的 zip</a> 並對它執行了 `npm install`。

</div>

像其他所有 JIT 範例一樣，以 `npm start` 執行以 JIT 編譯的應用程式。

以 AOT 編譯的前提是備妥某些支援檔案，其中大多數已在上方討論過。

<code-tabs>
  <code-pane title="src/index.html" path="toh-pt6/src/index.html">
  </code-pane>
  <code-pane title="copy-dist-files.js" path="toh-pt6/copy-dist-files.js">
  </code-pane>
  <code-pane title="rollup-config.js" path="toh-pt6/rollup-config.js">
  </code-pane>
  <code-pane title="tsconfig-aot.json" path="toh-pt6/tsconfig-aot.json">
  </code-pane>
</code-tabs>

在 `package.json` 的 `scripts` 區段中加入以下 npm 腳本，你就能輕鬆地提供以 AOT 編譯的應用程式：

<code-example language="json">
  "serve:aot": "lite-server -c bs-config.aot.json",
</code-example>

使用 node 腳本將 AOT 發佈檔案複製進 `/aot` 資料夾：

<code-example language="none" class="code-shell">
  node copy-dist-files
</code-example>

<div class="l-sub-section">

  在 `zone.js` 或舊瀏覽器的 `core-js` shim 有更新之前，你不需要再做這件事。

</div>

現在以 AOT 編譯應用程式並啟動：

<code-example language="none" class="code-shell">
  npm run build:aot && npm run serve:aot
</code-example>

{@a inspect-bundle}

### 檢查 Bundle

看到 Rollup 之後產生的 JavaScript bundle 長什麼樣子，是件迷人的事。程式碼已被壓縮，所以直接檢查 bundle 學不到太多東西。但 <a href="https://github.com/danvk/source-map-explorer/blob/master/README.md">source-map-explorer</a> 工具可以相當有啟發性。

安裝它：

<code-example language="none" class="code-shell">
  npm install source-map-explorer --save-dev
</code-example>

執行以下指令來產生對照圖。

<code-example language="none" class="code-shell">
  node_modules/.bin/source-map-explorer aot/dist/build.js
</code-example>

`source-map-explorer` 會分析隨 bundle 一起產生的 source map，並繪製所有依賴的圖，確切顯示 bundle 中包含了哪些應用程式與 NgModules 及類別。

以下是 _英雄之旅_ 的對照圖。

<a href="generated/images/guide/aot-compiler/toh-pt6-bundle.png" title="檢視更大的圖片">
  <figure>
    <img src="generated/images/guide/aot-compiler/toh-pt6-bundle-700w.png" alt="toh-pt6-bundle">
  </figure>
</a>