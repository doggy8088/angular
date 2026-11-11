# Angular 套件格式

本文件說明 Angular 套件格式（Angular Package Format，APF）。
APF 是一份 Angular 專屬規格，定義 npm 套件的結構與格式，所有第一方 Angular 套件（`@angular/core`、`@angular/material` 等）以及大多數第三方 Angular 程式庫都採用它。

採用 APF 的套件，能在使用 Angular 的大多數常見情境下無縫運作。
使用 APF 的套件與 Angular 團隊提供的工具，以及更廣泛的 JavaScript 生態系統都相容。
建議第三方程式庫開發者遵循相同的 npm 套件格式。

<div class="alert is-helpful">

APF 會隨著 Angular 其餘部分一起版本化，每個主要版本都會改進套件格式。
你可以在這份 [Google 文件](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)中找到 v13 之前各版本的規格。

</div>

## 為什麼要制定套件格式？

在今日的 JavaScript 環境中，開發者以許多不同的方式、透過許多不同的工具鏈（Webpack、rollup、esbuild 等）取用套件。
這些工具理解並要求的輸入各不相同：有些工具能處理最新的 ES 語言版本，有些工具則更適合直接取用較舊的 ES 版本。

Angular 的發行格式支援所有常用的開發工具與工作流程，並特別著重那些能帶來更小的應用程式承載量（payload），或更快開發迭代週期（建置時間）的最佳化。

開發者可以倚賴 Angular CLI 與 [ng-packagr](https://github.com/ng-packagr/ng-packagr)（Angular CLI 使用的建置工具）來產出 Angular 套件格式的套件。
詳情請參閱[建立程式庫](guide/creating-libraries)指南。

## 檔案配置

下列範例展示 `@angular/core` 套件簡化後的檔案配置，並逐一說明套件中的每個檔案。

<div class='filetree'>
    <div class='file'>
      node_modules/@angular/core
    </div>
    <div class='children'>
        <div class='file'>
          README.md &nbsp; <!-- // &lt;-- Package README, used by npmjs web UI. -->
        </div>
        <div class='file'>
          package.json &nbsp; <!-- // &lt;-- Primary package.json, describing the package itself as well as all available entrypoints and code formats. This file contains the "exports" mapping used by runtimes and tools to perform module resolution. -->
        </div>
        <div class='file'>
          index.d.ts &nbsp; <!-- // &lt;-- Bundled .d.ts for the primary entrypoint &commat;angular/core. -->
        </div>
        <div class='file'>
          esm2022 &nbsp; <!-- // &lt;-- Tree of &commat;angular/core sources in unflattened ES2022 format. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              index.mjs
            </div>
            <div class='file'>
              public_api.mjs
            </div>
            <div class='file'>
              testing &nbsp; <!-- // &lt;-- Tree of the &commat;angular/core/testing entrypoint in unflattened ES2022 format. -->
            </div>
        </div>
        <div class='file'>
          fesm2022 &nbsp; <!-- // &lt;-- Code for all entrypoints in flattened \(FESM\) ES2022 format, along with sourcemaps. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              core.mjs.map
            </div>
            <div class='file'>
              testing.mjs
            </div>
            <div class='file'>
              testing.mjs.map
            </div>
        </div>
        <div class='file'>
          testing &nbsp; <!-- // &lt;-- Directory representing the "testing" entrypoint. -->
        </div>
        <div class='children'>
            <div class='file'>
              index.d.ts &nbsp; <!-- // &lt;-- Bundled .d.ts for the &commat;angular/core/testing entrypoint. -->
            </div>
        </div>
    </div>
</div>

下表說明 `node_modules/@angular/core` 下的檔案配置，註解各檔案與目錄的用途：

| 檔案 | 用途 |
|:--- |:--- |
| `README.md` | 套件 README，供 npmjs 網頁介面使用。 |
| `package.json` | 主要的 `package.json`，描述套件本身以及所有可用的進入點與程式碼格式。此檔案包含供執行階段與工具執行模組解析時使用的 "exports" 對應。 |
| `index.d.ts` | 主要進入點 `@angular/core` 經綑綁的 `.d.ts`。 |
| `esm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `index.mjs` <br /> &nbsp;&nbsp;─ `public_api.mjs` | 未經扁平化的 ES2022 格式 `@angular/core` 來源樹。 |
| `esm2022/testing/` | 未經扁平化的 ES2022 格式 `@angular/core/testing` 進入點來源樹。 |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | 所有進入點經扁平化（FESM）的 ES2022 格式程式碼，以及來源對應檔。 |
| `testing/` | 代表 "testing" 進入點的目錄。 |
| `testing/index.d.ts` | `@angular/core/testing` 進入點經綑綁的 `.d.ts`。 |

## `package.json`

主要的 `package.json` 包含重要的套件中繼資料，包括下列各項：

* 它[宣告](#esm-宣告)套件採用 ECMAScript Module（ESM）格式
* 它包含一個 [`"exports"` 欄位](#exports)，定義所有進入點可用的原始碼格式
* 它包含一些[鍵](#舊版解析鍵)，為主要的 `@angular/core` 進入點定義可用的原始碼格式，供不理解 `"exports"` 的工具使用。
    這些鍵被視為已棄用，隨著 `"exports"` 的支援在整個生態系統中推廣開來，未來可能被移除。

* 它宣告套件是否包含[副作用](#副作用)

### ESM 宣告

最上層的 `package.json` 包含這個鍵：

<code-example language="javascript">

{
  "type": "module"
}

</code-example>

這會告知解析器，套件中的程式碼使用 ECMAScript Modules，而非 CommonJS 模組。

### `"exports"`

`"exports"` 欄位的結構如下：

<code-example language="javascript">

"exports": {
  "./schematics/*": {
    "default": "./schematics/*.js"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./core.d.ts",
    "esm": "./esm2022/core.mjs",
    "esm2022": "./esm2022/core.mjs",
    "default": "./fesm2022/core.mjs"
  },
  "./testing": {
    "types": "./testing/testing.d.ts",
    "esm": "./esm2022/testing/testing.mjs",
    "esm2022": "./esm2022/testing/testing.mjs",
    "default": "./fesm2022/testing.mjs"
  }
}

</code-example>

最值得注意的是 `"."` 與 `"./testing"` 這兩個鍵，它們分別定義 `@angular/core` 主要進入點與 `@angular/core/testing` 次要進入點可用的程式碼格式。
每個進入點可用的格式如下：

| 格式 | 詳細說明 |
|:--- |:--- |
| Typings \(`.d.ts` files\) | 當依賴某個套件時，TypeScript 會使用 `.d.ts` 檔案。 |
| `es2022` | 扁平化為單一來源檔案的 ES2022 程式碼。 |
| `esm2022` | 未經扁平化的來源檔案中的 ES2022 程式碼（此格式僅供實驗使用，詳情請參閱[關於 package.json 預設值的說明](#關於-packagejson-預設值的說明)）。 |
| `default` | 扁平化為單一來源的 ES2022 程式碼。

理解這些鍵的工具，可以優先從 `"exports"` 中選取合適的程式碼格式。

程式庫可能想要公開額外的靜態檔案，這些檔案無法被以 JavaScript 為主的進入點的 exports 所涵蓋，例如 Sass mixin 或預先編譯好的 CSS。

更多資訊請參閱[在程式庫中管理素材](guide/creating-libraries#在程式庫中管理素材)。

### 舊版解析鍵

除了 `"exports"` 之外，最上層的 `package.json` 也為不支援 `"exports"` 的解析器定義了舊版模組解析鍵。
以 `@angular/core` 為例，它們是：

<code-example language="javascript">

{
  "module": "./fesm2022/core.mjs",
  "typings": "./core.d.ts",
}

</code-example>

如前面的程式碼片段所示，模組解析器可以使用這些鍵來載入特定的程式碼格式。

### 副作用

`package.json` 的最後一項功能是宣告套件是否有[副作用](#sideeffects-flag)。

<code-example language="javascript">

{
  "sideEffects": false
}

</code-example>

大多數 Angular 套件不應依賴最上層的副作用，因此應包含這項宣告。

## 進入點與程式碼分割

Angular 套件格式的套件包含一個主要進入點，以及零個或多個次要進入點（例如 `@angular/common/http`）。
進入點有幾項功能。

1. 它們定義使用者匯入程式碼所用的模組指定符（module specifier）（例如 `@angular/core` 與 `@angular/core/testing`）。

   使用者通常將這些進入點視為用途或能力各異的、彼此獨立的符號群組。

   特定進入點可能只用於特殊用途，例如測試。
   這類 API 可以從主要進入點中分離出來，降低它們被誤用或錯誤使用的機會。

1. 它們定義程式碼可以延遲載入的粒度。

   許多現代建置工具只能在 ES Module 層級進行「程式碼分割」（也就是延遲載入）。
   Angular 套件格式主要為每個進入點使用單一「扁平」的 ES Module。這表示大多數建置工具無法將單一進入點的程式碼分割成多個輸出區塊（chunk）。

APF 套件的一般原則是：進入點應盡可能用於邏輯上相關聯的最小程式碼集合。
例如，Angular Material 套件將每個邏輯元件或元件集合發行成獨立的進入點：一個給 Button、一個給 Tabs，依此類推。
這樣一來，只要有需要，每個 Material 元件都能分開延遲載入。

並非所有程式庫都需要這樣的粒度。
大多數只有單一邏輯用途的程式庫，應發行成單一進入點。
例如 `@angular/core` 就為執行階段使用單一進入點，因為 Angular 執行階段通常被視為單一整體使用。

### 次要進入點的解析

次要進入點可以透過套件 `package.json` 的 `"exports"` 欄位來解析。

## README.md

README 檔案採用 Markdown 格式，用於在 npm 與 GitHub 上顯示套件的說明。

@angular/core 套件的 README 內容範例：

<code-example language="html">

Angular
&equals;&equals;&equals;&equals;&equals;&equals;&equals;

The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

License: MIT

</code-example>

## 部分編譯

Angular 套件格式的程式庫必須以「部分編譯」模式發行。
這是 `ngc` 的一種編譯模式，產出的已編譯 Angular 程式碼不與特定的 Angular 執行階段版本綁定；相對地，應用程式使用完整編譯，Angular 編譯器與執行階段的版本必須完全一致。

若要對 Angular 程式碼進行部分編譯，請在你的 `tsconfig.json` 的 `angularCompilerOptions` 屬性中使用 `compilationMode` 旗標：

<code-example language="javascript">

{
  &hellip;
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}

</code-example>

部分編譯的程式庫程式碼，接著會在應用程式建置過程中由 Angular CLI 轉換成完整編譯的程式碼。

如果你的建置管線不使用 Angular CLI，請參閱[在 Angular CLI 之外取用部分 Ivy 程式碼](guide/creating-libraries#在-angular-cli-之外取用-partial-ivy-程式碼)指南。

## 最佳化

### ES 模組扁平化

Angular 套件格式規定程式碼以「扁平化」的 ES 模組格式發行。
這能大幅減少 Angular 應用程式的建置時間，以及最終應用程式包的下載與解析時間。
歡迎參閱 Nolan Lawson 的精彩文章[「The cost of small modules」](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules)。

Angular 編譯器可以產生索引 ES 模組檔案。Rollup 等工具可以使用這些檔案，產生*扁平化 ES 模組*（Flattened ES Module，FESM）檔案格式的扁平化模組。

FESM 是一種檔案格式，透過將從某個進入點可存取的所有 ES Module 扁平化成單一 ES Module 而建立。
它的形成方式是：追蹤套件的所有 import，將那些程式碼複製到單一檔案中，同時保留所有公開的 ES export，並移除所有私有的 import。

FESM 這個縮寫名稱讀作 *phe-som*，後面可以接一個數字，例如 FESM2020。
這個數字指的是模組內 JavaScript 的語言層級。
因此，FESM2022 檔案會是 ESM+ES2022，包含 import/export 陳述式與 ES2022 原始碼。

若要產生扁平化的 ES Module 索引檔，請在你的 tsconfig.json 檔案中使用下列設定選項：

<code-example language="javascript">

{
  "compilerOptions": {
    &hellip;
    "module": "esnext",
    "target": "es2022",
    &hellip;
  },
  "angularCompilerOptions": {
    &hellip;
    "flatModuleOutFile": "my-ui-lib.js",
    "flatModuleId": "my-ui-lib"
  }
}

</code-example>

索引檔（例如 `my-ui-lib.js`）由 ngc 產生後，就可以使用 Rollup 等打包工具與最佳化工具來產出扁平化的 ESM 檔案。

#### 關於 package.json 預設值的說明

自 webpack v4 起，對 webpack 使用者而言，ES 模組扁平化最佳化應該已無必要。在 webpack 中不扁平化模組，應該就能獲得更好的程式碼分割效果。
但實務上，把未扁平化的模組當作 webpack v4 的輸入時，仍可能看到大小迴歸。
這就是為什麼 `module` 與 `es2022` 這兩個 package.json 條目仍然指向 FESM 檔案。
這個問題目前正在調查中。預期在大小迴歸問題解決之後，會把 `module` 與 `es2022` 這兩個 package.json 進入點切換為未扁平化的檔案。
APF 目前包含未扁平化的 ESM2022 程式碼，目的就是為了驗證這樣的未來變更。

### 「sideEffects」旗標

ECMAScript Modules 預設具有副作用：從模組匯入會確保該模組最上層的任何程式碼都應執行。
這通常不是我們想要的，因為典型模組中大多數具有副作用的程式碼，其實並非真正具有副作用，只是影響特定的符號。
如果那些符號沒有被匯入使用，我們通常希望在稱為搖樹優化（tree-shaking）的最佳化過程中將它們移除，而具有副作用的程式碼可能會妨礙這件事。

Webpack 等建置工具支援一個旗標，讓套件能宣告它們不依賴模組最上層具有副作用的程式碼，給予工具更大的自由，對套件中的程式碼進行搖樹優化。
這些最佳化的最終結果，應該是更小的包大小，以及程式碼分割後包內區塊更好的程式碼分布。
如果你的程式碼包含非本機的副作用，這項最佳化可能會弄壞你的程式碼；不過這在 Angular 應用程式中並不常見，通常是不良設計的徵兆。
建議所有套件都將 `sideEffects` 屬性設為 `false`，宣告自己為無副作用狀態；同時建議開發者遵循 [Angular 風格指南](/guide/styleguide)，如此自然會寫出不含非本機副作用的程式碼。

更多資訊：[webpack 關於副作用的文件](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### ES2022 語言層級

ES2022 語言層級現在是 Angular CLI 與其他工具取用的預設語言層級。
Angular CLI 會在應用程式建置時，將包降級到所有目標瀏覽器都支援的語言層級。

### .d.ts 打包／型別定義扁平化

自 APF v8 起，現在偏好執行 [API Extractor](https://api-extractor.com) 來合併打包 TypeScript 定義，讓整個 API 出現在單一檔案中。

在先前的 APF 版本中，每個進入點的 `.d.ts` 進入點旁邊會有一個 `src` 目錄，裡面包含與原始程式碼結構相符的個別 d.ts 檔案。
雖然這種發行格式仍然允許且受支援，但非常不建議使用，因為它會讓 IDE 等工具產生混淆，進而提供不正確的自動完成建議；也會讓使用者得以依賴深層匯入路徑，而這類路徑通常不被視為程式庫或套件的公開 API。

### Tslib

自 APF v10 起，建議將 tslib 加入主要進入點的直接依賴。
這是因為 tslib 的版本與用來編譯你的程式庫的 TypeScript 版本綁定在一起。

## 範例

*   [@angular/core package](https://unpkg.com/browse/@angular/core@13.0.0-rc.0)
*   [@angular/material package](https://unpkg.com/browse/@angular/material@13.0.0-rc.0)

## 術語定義

本文件全程刻意使用下列術語。
本節列出它們全部的定義，以提供額外的清晰說明。

#### 套件

發行到 NPM 並一起安裝的最小檔案集合，例如 `@angular/core`。
這個套件包含一個稱為 package.json 的資訊清單、已編譯的原始碼、TypeScript 定義檔、原始碼對應表、中繼資料等。
套件以 `npm install @angular/core` 安裝。

#### 符號

模組中包含的類別、函式、常數或變數，可選擇性地透過模組 export 讓外部世界看見。

#### 模組

ECMAScript Modules 的簡稱。
一個包含匯入與匯出符號的陳述式的檔案。
這與 ECMAScript 規格中模組的定義相同。

#### ESM

ECMAScript Modules 的簡稱（見上文）。

#### FESM

Flattened ES Modules 的簡稱，由一種檔案格式組成，這種格式透過將從某個進入點可存取的所有 ES Module 扁平化成單一 ES Module 而建立。

#### 模組 ID

在 import 陳述式中使用的模組識別符（例如 `@angular/core`）。
這個 ID 通常直接對應到檔案系統上的一個路徑，但由於各種模組解析策略的存在，情況並非總是如此。

#### 模組指定符

模組識別符（見上文）。

#### 模組解析策略

用來將模組 ID 轉換成檔案系統路徑的演算法。
Node.js 有一套定義明確且廣泛使用的策略，TypeScript 支援數種模組解析策略，[Closure Compiler](https://developers.google.com/closure/compiler) 又有另一套策略。

#### 模組格式

模組語法的規格，至少涵蓋從檔案匯入與匯出的語法。
常見的模組格式有 CommonJS（CJS，通常用於 Node.js 應用程式）與 ECMAScript Modules（ESM）。
模組格式只指出個別模組的封裝方式，而不涉及組成模組內容所用的 JavaScript 語言功能。
正因如此，Angular 團隊經常將語言層級指定符作為模組格式的後綴（例如，ESM+ES2022 表示模組採用 ESM 格式，且包含 ES2022 程式碼）。

#### 包

形式為單一 JS 檔案的產物，由建置工具（例如 [Webpack](https://webpack.js.org) 或 [Rollup](https://rollupjs.org)）產出，包含源自一個或多個模組的符號。
包是因應瀏覽器而生的權宜做法，目的是減少瀏覽器若要開始下載數百甚至數萬個檔案所造成的網路負擔。
Node.js 通常不使用包。
常見的包格式有 UMD 與 System.register。

#### 語言層級

程式碼的語言（ES2022）。
與模組格式無關。

#### 進入點

預定由使用者匯入的模組。
它由唯一的模組 ID 參照，並匯出該模組 ID 所參照的公開 API。
例子有 `@angular/core` 或 `@angular/core/testing`。
兩個進入點都存在於 `@angular/core` 套件中，但它們匯出不同的符號。
一個套件可以有許多進入點。

#### 深層匯入

從不屬於進入點的模組取得符號的過程。
這些模組 ID 通常被視為私有 API，可能在專案的生命週期內，或在為該套件建立包的過程中變更。

#### 最上層匯入

來自某個進入點的匯入。
可用的最上層匯入定義了公開 API，並公開在「@angular/name」模組中，例如 `@angular/core` 或 `@angular/common`。

#### 搖樹優化

識別並移除應用程式未使用的程式碼的過程，也稱為死碼消除（dead code elimination）。
這是一種在應用程式層級執行的全域最佳化，使用 [Rollup](https://rollupjs.org)、[Closure Compiler](https://developers.google.com/closure/compiler) 或 [Terser](https://github.com/terser/terser) 等工具。

#### AOT 編譯器

Angular 的 Ahead of Time 編譯器。

#### 扁平化型別定義

由 [API Extractor](https://api-extractor.com) 產生的、合併打包後的 TypeScript 定義。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-03-06
