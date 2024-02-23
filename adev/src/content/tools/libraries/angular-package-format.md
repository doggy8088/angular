# Angular 套件格式

此文件描述了 Angular 套件格式 (APF)。
APF 是 Angular 特有的規格，用於所有第一方 Angular 套件 (例如 `@angular/core`、`@angular/material` 等等) 和大多數第三方 Angular 函式庫的結構和格式。

APF 讓套件能夠在大多數使用 Angular 的常見情況下無縫運作。
使用 APF 的套件與 Angular 團隊提供的工具以及更廣泛的 JavaScript 生態系統相容。
建議第三方程式庫開發人員遵循相同的 npm 套件格式。

HELPFUL: APF 的版本與 Angular 的其他版本一致，且每個主要版本都會改進套件格式。
您可以在此 [google 文件](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview) 中找到 v13 之前版本的規範。

## 為什麼要指定套件格式？

在當今的 JavaScript 環境中，開發人員以多種不同的方式使用多種不同的工具鏈（Webpack、rollup、esbuild 等）來消耗套件。
這些工具可能瞭解並需要不同的輸入 - 有些工具可能能夠處理最新的 ES 語言版本，而另一些工具可能受益於直接消耗較舊的 ES 版本。

Angular 分發格式支援所有常用的開發工具和工作流程，並強調優化，這些優化可縮小應用程式有效負載大小，或加快開發叠代週期（建置時間）。

開發人員可以依賴 Angular CLI 和 [ng-packagr](https://github.com/ng-packagr/ng-packagr)（Angular CLI 使用的建置工具）來以 Angular 套件格式產生套件。
請參閱 [建立函式庫](tools/libraries/creating-libraries) 指南以取得更多詳細資訊。

## 文件佈局

以下範例顯示 `@angular/core` 套件的檔案配置的簡化版本，並針對套件中的每個檔案提供說明。

```markdown
node_modules/@angular/core
├── README.md
├── package.json
├── index.d.ts
├── esm2022
│   ├── core.mjs
│   ├── index.mjs
│   ├── public_api.mjs
│   └── testing
├── fesm2022
│   ├── core.mjs
│   ├── core.mjs.map
│   ├── testing.mjs
│   └── testing.mjs.map
└── testing
    └── index.d.ts
```

下列表格描述在 `node_modules/@angular/core` 下的文件佈局，並附註說明檔案和目錄的目的：

| 檔案                                                                                                                                                     | 目的 |
|:---                                                                                                                                                       |:---     |
| `README.md`                                                                                                                                               | 套件 README，供 npmjs 網路使用者介面使用。                                                                                                                                                                          |
| `package.json`                                                                                                                                            | 主要 `package.json`，描述套件本身以及所有可用的進入點和程式碼格式。此檔案包含執行時期和工具用於執行模組解析的「匯出」對應。 |
| `index.d.ts`                                                                                                                                               | 針對主要進入點 `@angular/core` 的捆綁 `.d.ts`。                                                                                                                                                    |
| `esm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `index.mjs` <br /> &nbsp;&nbsp;─ `public_api.mjs`                                         | `@angular/core` 來源的樹狀結構，採用未壓平的 ES2022 格式。                                                                                                                                                  |
| `esm2022/testing/`                                                                                                                                        | `@angular/core/testing` 輸入點的樹狀結構，採用未壓平的 ES2022 格式。                                                                                                                                   |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | 壓平 \(FESM\) ES2022 格式中的所有進入點程式碼，以及原始程式碼對應。                                                                                                                           |
| `testing/`                                                                                                                                                | 代表「testing」進入點的目錄。                                                                                                                                                               |
| `testing/index.d.ts`                                                                                                                                    | 針對 `@angular/core/testing` 輸入點的捆綁 `.d.ts`。                                                                                                                                                     |

## `package.json`

主要的 `package.json` 包含重要的套件資訊，包含以下：

* 它宣告該套件為 EcmaScript 模組 (ESM) 格式 [#esm-declaration]
* 它包含一個 [`"exports"` 欄位](#exports)，定義所有進入點的可用原始碼格式
* 它包含定義主要 `@angular/core` 進入點可用原始碼格式的 [金鑰](#legacy-resolution-keys)，適用於不了解 `"exports"` 的工具。
    這些金鑰被視為已棄用，且可能會在 `"exports"` 的支援在整個生態系中推廣後移除。

* 它宣告該套件是否包含 [副作用](#side-effects)

### ESM 宣告

最上層的 `package.json` 包含鍵：

<docs-code language="javascript">

{
  "type": "module"
}

</docs-code>

這會通知解析器套件中的程式碼使用 EcmaScript 模組，而不是 CommonJS 模組。

### `"exports"`

`"exports"` 欄位具有以下結構：

<docs-code language="javascript">

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

</docs-code>

主要感興趣的是 `"."` 和 `"./testing"` 金鑰，分別定義 `@angular/core` 主要入口點和 `@angular/core/testing` 次要入口點的可用程式碼格式。
每個入口點的可用格式為：

| 格式                   | 詳細 |
|:---                       |:---     |
| 輸入型態 \(`.d.ts` 檔案\) | 當依賴特定套件時，TypeScript 會使用 `.d.ts` 檔案。                                                                                                           |
| `es2022`                  | ES2022 程式碼壓縮成單一原始檔案。                                                                                                                                  |
| `esm2022`                 | 未壓縮原始檔案中的 ES2022 程式碼 \(此格式包含在實驗中 - 請參閱 [此關於 packagejson 中預設值的討論](#note-about-the-defaults-in-packagejson) 以取得詳細資訊\)。 |
| `default`               | ES2022 程式碼壓縮成單一來源。

了解這些鍵的工具可能會優先從 `"exports"` 中選擇合適的程式碼格式。

程式庫可能需要公開額外的靜態檔案，這些檔案不會被 JavaScript 為基礎的入口點 (例如 Sass 混入或預先編譯的 CSS) 的輸出所擷取。

有關更多資訊，請參閱 [管理圖書館中的資源](tools/libraries/creating-libraries#managing-assets-in-a-library)。

### 傳統解析度金鑰

除了 `"exports"` 之外，頂層 `package.json` 也定義了不支援 `"exports"` 的解析器的舊版模組解析關鍵字。
對於 `@angular/core` 這些是：

<docs-code language="javascript">

{
  "module": "./fesm2022/core.mjs",
  "typings": "./core.d.ts",
}

</docs-code>

如先前程式碼片段所示，模組解析器可以使用這些金鑰來載入特定的程式碼格式。

### 副作用

`package.json` 的最後一個功能是宣告這個套件是否有 [副作用](#sideeffects-flag)。

<docs-code language="javascript">

{
  "sideEffects": false
}

</docs-code>

大部分 Angular 套件不應依賴頂層副作用，因此應包含此宣告。

## 入口點和程式碼分割

Angular 套件格式中的套件包含一個主要入口點和零個或多個次要入口點\(例如，`@angular/common/http`\)。
入口點具有多項功能。

1. 它們定義使用者從中匯入程式碼的模組規格符號（例如，`@angular/core` 和 `@angular/core/testing`）。

    使用者通常會將這些入口點視為具有不同目的或功能的符號的個別群組。

    特定的入口點可能只用於特殊目的，例如測試。
    此類 API 可與主要入口點分開，以降低意外或不正確使用的可能性。

1. 它們定義可以延遲載入程式碼的粒度。

    許多現代建置工具僅能在 ES 模組層級執行「程式碼拆分」（亦即延遲載入）。
    Angular 套件格式主要在每個入口點使用單一「平面」ES 模組。這表示大多數建置工具無法將具有單一入口點的程式碼拆分為多個輸出區塊。

APF 套件的一般規則是，盡可能對最小的邏輯連接程式碼集使用進入點。
例如，Angular Material 套件會將每個邏輯元件或元件集發佈為一個獨立的進入點 - 一個用於 Button，一個用於 Tabs，依此類推。
這允許每個 Material 元件在需要時分別延遲載入。

並非所有函式庫都需要這種粒度。
大多數具有單一邏輯目的的函式庫都應該以單一入口點發佈。
例如，`@angular/core` 對執行時期使用單一入口點，因為 Angular 執行時期通常被視為單一實體。

### 次要進入點的解析度

二次入口點可以透過套件的 `package.json` 的 `"exports"` 欄位來解析。

## README.md

README 檔案以 Markdown 格式撰寫，用於在 npm 和 GitHub 上顯示套件說明。

@angular/core 套件的範例 README 內容：

<docs-code language="html">

Angular
&equals;&equals;&equals;&equals;&equals;&equals;&equals;

The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

License: MIT

</docs-code>

## 局部編譯

以 Angular 套件格式提供的函式庫必須以「部分編譯」模式發佈。
這是 `ngc` 的一種編譯模式，會產生未連結至特定 Angular 執行階段版本的已編譯 Angular 程式碼，這與應用程式使用的完整編譯相反，後者的 Angular 編譯器和執行階段版本必須完全相符。

若要部分編譯 Angular 程式碼，請在 `tsconfig.json` 的 `angularCompilerOptions` 屬性中使用 `compilationMode` 標記：

<docs-code language="javascript">

{
  &hellip;
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}

</docs-code>

部分編譯的函式庫程式碼隨後在應用程式建置程序中由 Angular CLI 轉換為完全編譯的程式碼。

如果您的建置管線未使用 Angular CLI，請參閱 [在 Angular CLI 外部使用部分 ivy 程式碼](tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli) 指南。

## 優化

### ES 模組扁平化

Angular 套件格式指定以「扁平化」ES 模組格式發布程式碼。
這可大幅減少 Angular 應用程式的建置時間，以及最終應用程式套件的下載和解析時間。
請查看 Nolan Lawson 的精彩文章 [「小型模組的成本」](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules)。

Angular 編譯器可以產生索引 ES 模組檔案。像 Rollup 等工具可以使用這些檔案，以 *扁平化 ES 模組* (FESM) 檔案格式產生扁平化模組。

FESM 是透過將從入口點可存取的所有 ES 模組壓平到單一 ES 模組而建立的檔案格式。
它透過追蹤所有來自套件的匯入並將該程式碼複製到單一檔案中來形成，同時保留所有公開的 ES 匯出並移除所有私人匯入。

FESM 的簡寫，發音為 *phe-som*，後可接數字，例如 FESM2020。
數字是指模組內 JavaScript 的語言層級。
因此 FESM2022 檔案將是 ESM+ES2022，並包含 import/export 陳述式和 ES2022 原始碼。

如要產生一個扁平的 ES 模組索引檔案，請在 tsconfig.json 檔案中使用下列組態選項：

<docs-code language="javascript">

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

</docs-code>

一旦索引文件（例如，`my-ui-lib.js`）由 ngc 自動建立，Rollup 等打包器和優化器即可用來產生扁平化的 ESM 文件。

#### 有關 package.json 中預設值的注意事項

從 webpack v4 開始，ES 模組最佳化的扁平化對 webpack 使用者來說不應是必要的。在 webpack 中，應該可以獲得更好的程式碼分割，而無需將模組扁平化。
實際上，在將未扁平化的模組用作 webpack v4 的輸入時，仍然可以看到尺寸回歸。
這就是為什麼 `module` 和 `es2022` package.json 條目仍然指向 FESM 檔案。
此問題正在調查中。預計在解決尺寸回歸問題後，將 `module` 和 `es2022` package.json 入口點切換到未扁平化的檔案。
APF 目前包含未扁平化的 ESM2022 程式碼，目的是驗證此類未來的變更。

### 「sideEffects」旗標

預設情況下，EcmaScript 模組會產生副作用：從模組匯入會確保該模組頂層的任何程式碼都會執行。
這通常令人不滿意，因為典型模組中的大多數副作用程式碼實際上並沒有副作用，而僅影響特定符號。
如果未匯入和使用這些符號，通常希望在稱為樹狀搖動的最佳化過程中將其移除，而副作用程式碼可能會阻止此操作。

Webpack 等建置工具支援一個標記，允許套件宣告其不依賴模組最上層的副作用碼，讓工具有更多自由度可以從套件中移除無用的程式碼。
這些最佳化的最終結果應該會讓程式在程式碼分割後，產生較小的套件大小和更好的程式碼分佈在套件區塊中。
如果您的程式碼包含非區域副作用，此最佳化可能會損毀您的程式碼 - 然而，這在 Angular 應用程式中並不常見，而且通常是設計不良的徵兆。
建議所有套件都透過將 `sideEffects` 屬性設定為 `false` 來宣告沒有副作用的狀態，而且開發人員遵循 [Angular 風格指南](/style-guide)，這自然會產生沒有非區域副作用的程式碼。

更多資訊：[webpack 文件中的副作用](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### ES2022 語言等級

ES2022 語言等級現在是 Angular CLI 和其他工具預設使用的語言等級。
Angular CLI 會在應用程式建置時將套件降級為所有目標瀏覽器支援的語言等級。

### d.ts 捆綁 / 類型定義扁平化

自 APF v8 起，現在建議執行 [API Extractor](https://api-extractor.com) 以捆綁 TypeScript 定義，以便整個 API 出現在單一檔案中。

在先前的 APF 版本中，每個進入點都會在 .d.ts 進入點旁邊有一個 `src` 目錄，而此目錄包含與原始程式碼結構相符的個別 d.ts 檔案。
雖然此發行格式仍然允許且受支援，但強烈不建議使用，因為它會混淆 IDE 等工具，然後提供不正確的自動完成，並允許使用者依賴通常不被視為程式庫或套件公開 API 的深度匯入路徑。

### Tslib

自 APF v10 起，建議將 tslib 作為主要進入點的直接相依項目。
這是因為 tslib 版本與用於編譯函式庫的 TypeScript 版本相關。

## 範例

<docs-pill-row>
  <docs-pill href="https://unpkg.com/browse/@angular/core@17.0.0/" title="@angular/core 套件"/>
  <docs-pill href="https://unpkg.com/browse/@angular/material@17.0.0/" title="@angular/material 套件"/>
</docs-pill-row>

## 術語定義

以下術語會在整份文件中有意地使用。
本節是所有術語的定義，以提供額外的清晰度。

### 套件

發佈至 NPM 並一起安裝的最小檔案集，例如 `@angular/core`。
此套件包括稱為 package.json 的清單、已編譯的原始碼、TypeScript 定義檔案、原始碼對應、元資料等。
套件以 `npm install @angular/core` 安裝。

### 符號

一個類別、函數、常數或變數包含在模組中，並可選擇透過模組匯出讓外部世界可見。

### 模組

ECMAScript 模組的簡稱。
包含匯入和匯出符號的檔案。
這與 ECMAScript 規範中模組的定義相同。

### ESM

ECMAScript 模組的簡寫（見上）。

### FESM

Flattened ES Modules 的縮寫，由將可從單一 ES 模組存取的所有 ES 模組壓平而建立的檔案格式組成。

### 模組 ID

在導入語句中使用的模組的識別碼（例如，`@angular/core`）。
ID 通常直接對應到檔案系統上的路徑，但由於各種模組解析策略，並非總是如此。

### 模組說明符

模組識別碼（見上文）。

### 模組解析策略

用於將模組 ID 轉換為檔案系統路徑的演算法。
Node.js 有個演算法，規範良好且廣泛使用；TypeScript 支援多種模組解析策略；[Closure Compiler](https://developers.google.com/closure/compiler) 則有另一種策略。

### 模組格式

關於涵蓋至少檔案匯入和匯出的語法之模組語法的規範。
常見的模組格式有 CommonJS \(CJS，通常用於 Node.js 應用程式\) 或 ECMAScript 模組 \(ESM\)。
模組格式只表示個別模組的封裝，而並非組成模組內容所使用的 JavaScript 語言功能。
因此，Angular 團隊經常使用語言層級識別符作為模組格式的字尾，\(例如，ESM+ES2022 指定模組為 ESM 格式，且包含 ES2022 程式碼\)。

### Bundle

單一 JS 檔案形式的人工製品，由建構工具產生（例如 [Webpack](https://webpack.js.org) 或 [Rollup](https://rollupjs.org)），包含源自一個或多個模組的符號。
捆綁是瀏覽器專用的解決方法，可減少瀏覽器開始下載數百個甚至數萬個檔案時造成的網路負擔。
Node.js 通常不使用捆綁。
常見的捆綁格式為 UMD 和 System.register。

### 語言等級

語言的程式碼 \(ES2022\)。
與模組格式無關。

### 進入點

一個模組，供使用者匯入。
它由一個唯一的模組 ID 參照，並匯出該模組 ID 所參照的公開 API。
範例是 `@angular/core` 或 `@angular/core/testing`。
兩個進入點都存在於 `@angular/core` 套件中，但它們匯出不同的符號。
一個套件可以有許多進入點。

### 深度導入

從非進入點模組中擷取符號的程序。
這些模組 ID 通常被視為專有 API，可以在專案的生存期內或在建立給定套件的套件時變更。

### 最上層 import

一個來自進入點的匯入。
可用的頂級匯入定義了公共 API，並在「&commat;angular/name」模組中公開，例如 `@angular/core` 或 `@angular/common`。

### Tree-shaking

識別並移除應用程式未使用的程式碼的程序 - 也稱為死程式碼消除。
這是一種在應用程式層級使用 Rollup、Closure Compiler 或 Terser 等工具執行之全域最佳化。

### AOT 編譯器

Angular 的 Ahead of Time 編譯器。

### 壓平的類型定義

從 [API Extractor](https://api-extractor.com) 產生的 TypeScript 定義組合。
