# Angular 工作區設定

位於 Angular [工作區](guide/glossary#工作區（workspace）)根層級、名為 `angular.json` 的檔案，為 Angular CLI 提供的建置與開發工具提供整個工作區與專案專屬的設定預設值。設定中給定的路徑值是相對於根工作區資料夾。

## 整體 JSON 結構

在 `angular.json` 的最上層，少數屬性設定工作區，而 `projects` 區段包含其餘各專案的設定選項。在工作區層級設定的 CLI 預設值可以被專案層級設定的預設值覆寫，而專案層級設定的預設值可以在命令列上覆寫。

下列屬性位於檔案的最上層，用來設定工作區。

* `version`：設定檔版本。
* `newProjectRoot`：建立新專案的路徑。絕對路徑，或相對於工作區資料夾的路徑。
* `defaultProject`：在未以引數提供時，指令要使用的預設專案名稱。當你使用 `ng new` 在新工作區中建立新應用程式時，該應用程式就是該工作區的預設專案，直到你在此變更它為止。
* `schematics`：一組自訂此工作區 `ng generate` 子指令選項預設值的[原理圖](guide/glossary#原理圖（schematic）)。請參閱下方的[產生原理圖](#schematics)。
* `projects`：包含工作區中每個專案（程式庫或應用程式）的子區段，以及各專案的設定選項。

你以 `ng new app_name` 建立的初始應用程式會列在「projects」之下：

<code-example language="json">

"projects": {
  "app_name": {
    ...
  }
  ...
}

</code-example>

以 `ng generate library` 建立程式庫專案時，該程式庫專案也會加入 `projects` 區段。

<div class="alert is-helpful">

  請注意，設定檔的 `projects` 區段與工作區檔案結構並非完全對應。
  * 以 `ng new` 建立的初始應用程式位於工作區檔案結構的最上層。
  * 額外的應用程式與程式庫則放在工作區中的 `projects` 資料夾。

  更多資訊請參閱[工作區與專案檔案結構](guide/file-structure)。

</div>

## 嚴格模式

建立新工作區與專案時，你可以選擇使用 Angular 的嚴格模式，這可以協助你寫出更好、更易於維護的程式碼。
詳情請參閱[嚴格模式](/guide/strict-mode)。

<a id="cache-options"></a>

## 專案設定選項

在 `projects:<project_name>` 之下，每個專案都可使用下列頂層設定屬性。

<code-example language="json">

    "my-app": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {}
    }

</code-example>

| PROPERTY | DESCRIPTION |
| :-------------- | :---------------------------- |
| `root`          | 此專案檔案的根資料夾，相對於工作區資料夾。初始應用程式為空，因為它位於工作區的最上層。 |
| `sourceRoot`    | 此專案原始碼檔案的根資料夾。 |
| `projectType`   | 「application」或「library」其中之一。應用程式可以獨立在瀏覽器中執行，程式庫則不行。|
| `prefix`        | Angular 會在產生的選取器前面加上的字串。可以自訂以識別應用程式或功能區域。 |
| `schematics`    | 一組自訂此專案 `ng generate` 子指令選項預設值的原理圖。請參閱下方的[產生原理圖](#schematics)。  |
| `architect`     | 此專案的 Architect 建置器目標的設定預設值。 |

{@a schematics}

## 產生原理圖

Angular 產生[原理圖](guide/glossary#原理圖（schematic）)是透過新增檔案或修改既有檔案來修改專案的指示。
Angular CLI 預設 `ng generate` 子指令的個別原理圖彙集在 `@schematics/angular` 套件中。
以 `schematic-package:schematic-name` 的格式指定子指令的原理圖名稱；
例如，產生元件的原理圖是 `@schematics/angular:component`。

CLI 用來產生專案與專案各部分的預設原理圖，其 JSON 結構定義彙集在 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/application/schema.json) 套件中。
結構定義說明了 CLI 在每個 `ng generate` 子指令下可用的選項，如 `--help` 輸出所示。

結構定義中給定的欄位，對應於 CLI 子指令選項允許的引數值與預設值。
你可以更新工作區結構定義檔案，為子指令選項設定不同的預設值。

{@a architect}

## 專案工具設定選項

Architect 是 CLI 用來執行複雜工作（例如編譯與執行測試）的工具。
Architect 是一個殼層，會根據[目標](guide/glossary#目標（target）)設定，執行指定的[建置器](guide/glossary#建置器（builder）)來執行特定工作。
你可以定義與設定新的建置器與目標，以擴充 CLI。
請參閱 [Angular CLI 建置器](guide/cli-builder)。

{@a default-build-targets}

### 預設 Architect 建置器與目標

Angular 為特定的 CLI 指令或一般 `ng run` 指令定義了預設建置器。
定義這些預設建置器各自選項與預設值的 JSON 結構定義，彙集在 [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/master/packages/angular/cli/lib/config/schema.json) 套件中。
這些結構定義為下列建置器設定選項。

* app-shell
* browser
* dev-server
* extract-i18n
* karma
* protractor
* server
* tslint

### 設定建置器目標

`angular.json` 的 `architect` 區段包含一組 Architect 目標。
許多目標對應於執行它們的 CLI 指令。
一些額外預先定義的目標可以使用 `ng run` 指令執行，你也可以定義自己的目標。

每個目標物件會指定該目標的 `builder`，也就是 Architect 執行的工具所屬的 npm 套件。
此外，每個目標還有一個 `options` 區段，用來設定該目標的預設選項，以及一個 `configurations` 區段，用來命名並指定該目標的替代設定。
請參閱下方[建置目標](#build-target)中的範例。

<code-example language="json">

      "architect": {
        "build": { },
        "serve": { },
        "e2e" : { },
        "test": { },
        "lint": { },
        "extract-i18n": { },
        "server": { },
        "app-shell": { }
      }

</code-example>

* `architect/build` 區段設定 `ng build` 指令選項的預設值。
請參閱下方的[建置目標](#build-target)以取得更多資訊。

* `architect/serve` 區段覆寫建置預設值，並為 `ng serve` 指令提供額外的服務預設值。除了 `ng build` 指令可用的選項之外，還會新增與提供應用程式相關的選項。

* `architect/e2e` 區段在使用 `ng e2e` 指令建置端對端測試應用程式時，覆寫建置選項預設值。

* `architect/test` 區段覆寫測試建置的建置選項預設值，並為 `ng test` 指令提供額外的測試執行預設值。

* `architect/lint` 區段設定 `ng lint` 指令選項的預設值，該指令會對專案原始碼檔案執行程式碼分析。Angular 的預設程式碼檢查工具是 [TSLint](https://palantir.github.io/tslint/)。

* `architect/extract-i18n` 區段設定 `ng extract-i18n` 指令選項的預設值，該指令會從原始碼中擷取標記的訊息字串並輸出翻譯檔案。

* `architect/server` 區段在使用 `ng run <project>:server` 指令，以伺服器端渲染建立 Universal 應用程式時，設定預設值。

* `architect/app-shell` 區段在使用 `ng run <project>:app-shell` 指令，為漸進式網頁應用程式（PWA）建立應用程式殼層時，設定預設值。

一般而言，可以設定預設值的選項，對應於每個指令在 [CLI 參考頁面](cli)中所列的指令選項。
請注意，設定檔中的所有選項都必須使用 [camelCase](guide/glossary#case-conventions)，而非 dash-case。

{@a build-target}

## 建置目標

`architect/build` 區段會設定 `ng build` 指令選項的預設值。它具有下列頂層屬性。

| PROPERTY | DESCRIPTION |
| :-------------- | :---------------------------- |
| `builder`       | 用來建立此目標的建置工具所屬的 npm 套件。應用程式的預設建置器（`ng build myApp`）是 `@angular-devkit/build-angular:browser`，使用 [webpack](https://webpack.js.org/) 套件打包工具。請注意，建置程式庫（`ng build myLib`）時會使用不同的建置器。 |
| `options`       | 此區段包含預設的建置目標選項，在未指定具名替代設定時使用。請參閱下方的[預設建置目標](#default-build-targets)。 |
| `configurations`| 此區段定義並命名不同預期目的地的替代設定。它包含每個具名設定的區段，為該預期環境設定預設選項。請參閱下方的[替代建置設定](#build-configs)。 |


{@a build-configs}

### 替代建置設定

預設會定義一個 `production` 設定，而 `ng build` 指令有 `--prod` 選項可使用此設定進行建置。`production` 設定會設定在多方面最佳化應用程式的預設值，例如打包檔案、盡量減少多餘的空白、移除註解與無用程式碼，以及將程式碼改寫為使用簡短、隱晦的名稱（「最小化」）。

你可以定義並命名適合開發流程的額外替代設定（例如 `stage`）。不同建置設定的一些範例包括 AIO 本身使用的 `stable`、`archive` 與 `next`，以及建置應用程式在地化版本所需的個別地區設定專屬設定。詳情請參閱[國際化（i18n）](guide/i18n#merge-aot)。

你可以將替代設定的名稱傳遞給 `--configuration` 命令列旗標來選取它。

你也可以傳入多個設定名稱，以逗號分隔的清單表示。例如，若要同時套用 `stage` 與 `fr` 建置設定，請使用指令 `ng build --configuration stage,fr`。在此情況下，指令會由左至右解析具名的設定。如果多個設定變更了相同的設定，最後設定的值就是最終值。

如果同時使用 `--prod` 命令列旗標，它會先被套用，其設定可以被透過 `--configuration` 旗標指定的任何設定覆寫。

{@a build-props}

### 額外的建置與測試選項

預設或目標建置的可設定選項，一般對應於 [`ng build`](cli/build)、[`ng serve`](cli/serve) 與 [`ng test`](cli/test) 指令可用的選項。
這些選項及其可能值的詳情，請參閱 [CLI 參考資料](cli)。

有些額外選項只能透過設定檔設定，無論是直接編輯，或使用 [`ng config`](cli/config) 指令。

| OPTIONS PROPERTIES | DESCRIPTION |
| :------------------------- | :---------------------------- |
| `assets`                   | 一個物件，包含要加入專案全域情境的靜態資產路徑。預設路徑指向專案的圖示檔案及其 `assets` 資料夾。更多資訊請參閱下方的[資產設定](#asset-config)。 |
| `styles`                   | 一個樣式檔案陣列，要加入專案的全域情境。Angular CLI 支援 CSS 匯入與所有主要的 CSS 預處理器：[sass/scss](https://sass-lang.com/)、[less](http://lesscss.org/) 與 [stylus](https://stylus-lang.com/)。更多資訊請參閱下方的[樣式與指令碼設定](#style-script-config)。 |
| `stylePreprocessorOptions` | 一個物件，包含要傳遞給樣式預處理器的選項值配對。更多資訊請參閱下方的[樣式與指令碼設定](#style-script-config)。 |
| `scripts`                  | 一個物件，包含要加入專案全域情境的 JavaScript 指令碼檔案。這些指令碼的載入方式，就如同你在 `index.html` 中的 `<script>` 標籤內加入它們一樣。更多資訊請參閱下方的[樣式與指令碼設定](#style-script-config)。 |
| `budgets`                  | 應用程式全部或部分的預設大小預算類型與閾值。你可以設定建置器，在輸出達到或超過閾值大小時回報警告或錯誤。請參閱[設定大小預算](guide/build#configure-size-budgets)。（`test` 區段中不提供。） |
| `fileReplacements`         | 一個物件，包含檔案及其編譯時期取代檔案。更多資訊請參閱[設定目標專屬的檔案置換](guide/build#設定目標專屬的檔案置換)。|

{@a complex-config}

## 複雜的設定值

`assets`、`styles` 與 `scripts` 選項可以是簡單的路徑字串值，也可以是具有特定欄位的物件值。
`sourceMap` 與 `optimization` 選項可以透過指令旗標設定為簡單的布林值，但也可以透過設定檔給定複雜的值。
下列各節提供這些複雜值在各種情況下如何使用的更多詳細資訊。

{@a asset-config}

### 資產設定

每個 `build` 目標設定都可以包含一個 `assets` 陣列，列出在建置專案時想要原樣複製的檔案或資料夾。
預設會複製 `src/assets/` 資料夾與 `src/favicon.ico`。

<code-example language="json">

"assets": [
  "src/assets",
  "src/favicon.ico"
]

</code-example>

若要排除資產，可以將它從資產設定中移除。

你可以將資產指定為物件（而非相對於工作區根目錄的簡單路徑），進一步設定要複製的資產。
資產規格物件可以具有下列欄位。

* `glob`：一個 [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md)，以 `input` 作為基底目錄。
* `input`：相對於工作區根目錄的路徑。
* `output`：相對於 `outDir` 的路徑（預設為 `dist/`*project-name*）。基於安全性考量，CLI 絕不會將檔案寫入專案輸出路徑之外。
* `ignore`：要排除的 glob 清單。
* `followSymlinks`：允許 glob 模式跟隨符號連結目錄。這可讓系統搜尋符號連結的子目錄。預設為 `false`。

例如，可以使用下列物件，更詳細地表示預設的資產路徑。

<code-example language="json">

"assets": [
  {
    "glob": "**/*",
    "input": "src/assets/",
    "output": "/assets/"
  },
  {
    "glob": "favicon.ico",
    "input": "src/",
    "output": "/"
  }
]

</code-example>

你可以使用這種擴充設定，從專案外部複製資產。
例如，下列設定會從 node 套件複製資產：

<code-example language="json">

"assets": [
 {
   "glob": "**/*",
   "input": "./node_modules/some-package/images",
   "output": "/some-package/"
 }
]

</code-example>

`node_modules/some-package/images/` 的內容將可在 `dist/some-package/` 中取用。

下列範例使用 `ignore` 欄位，排除資產資料夾中的某些檔案，使其不會複製到建置中：

<code-example language="json">

"assets": [
 { 
   "glob": "**/*",
   "input": "src/assets/",
   "ignore": ["**/*.svg"],
   "output": "/assets/" 
 }
]

</code-example>

{@a style-script-config}

### 樣式與指令碼設定

`styles` 與 `scripts` 選項的陣列項目可以是簡單的路徑字串，也可以是指向額外進入點檔案的物件。
相關的建置器會在建置期間，將該檔案及其依賴載入為獨立的套件。
使用設定物件時，你可以使用 `bundleName` 欄位，為進入點的套件命名。

套件預設會被注入，但你可以將 `inject` 設定為 `false`，以排除該套件的注入。
例如，下列物件值會建立並命名一個包含樣式與指令碼的套件，並排除其注入：

<code-example language="json">

   "styles": [
     {
       "input": "src/external-module/styles.scss",
       "inject": false,
       "bundleName": "external-module"
     }
   ],
   "scripts": [
     { 
       "input": "src/external-module/main.js",
       "inject": false,
       "bundleName": "external-module"
     }
   ]

</code-example>

你可以混合使用簡單與複雜的樣式與指令碼檔案參照。

<code-example language="json">

"styles": [
  "src/styles.css",
  "src/more-styles.css",
  { "input": "src/lazy-style.scss", "inject": false },
  { "input": "src/pre-rename-style.scss", "bundleName": "renamed-style" },
]

</code-example>

{@a style-preprocessor}

#### 樣式預處理器選項

在 Sass 與 Stylus 中，你可以對元件樣式與全域樣式使用 `includePaths` 功能，這可讓你新增在匯入時會檢查的額外基底路徑。

若要新增路徑，請使用 `stylePreprocessorOptions` 選項：

<code-example language="json">

"stylePreprocessorOptions": {
  "includePaths": [
    "src/style-paths"
  ]
}

</code-example>

該資料夾中的檔案（例如 `src/style-paths/_variables.scss`）可以從專案中的任何位置匯入，無需使用相對路徑：

```ts
// src/app/app.component.scss
// A relative path works
@import '../style-paths/variables';
// But now this works as well
@import 'variables';
```

請注意，你也會需要將任何樣式或指令碼加入 `test` 建置器，如果你需要將它們用於單元測試。
另請參閱[在應用程式中使用執行階段全域程式庫](guide/using-libraries#在應用程式中使用執行階段全域程式庫)。

### 最佳化設定

`optimization` 瀏覽器建置器選項可以是布林值或物件，以進行更精細的設定。此選項會啟用建置輸出的各種最佳化，包括：

- 指令碼與樣式的最小化
- 搖樹優化
- 無用程式碼消除
- 關鍵 CSS 的內嵌
- 字型的內嵌

有數個選項可以用來微調應用程式的最佳化。

<table class="is-full-width is-fixed-layout">
<thead>
<tr>
<th>選項</th>
<th width="40%">說明</th>
<th>值類型</th>
<th>預設值</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>scripts</code></td>
<td>啟用指令碼輸出的最佳化。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>true</code></td>
</tr>
<tr>
<td><code>styles</code></td>
<td>啟用樣式輸出的最佳化。</td>
<td><code>boolean|<a href="#styles-optimization-options">Styles optimization options</a></code></td>
<td><code>true</code></td>
</tr>
<tr>
<td><code>fonts</code></td>
<td>啟用字型的最佳化。<br><strong>注意：</strong>這需要網際網路存取。</td>
<td><code class="no-auto-link">boolean|<a href="#字型最佳化選項">字型最佳化選項</a></code></td>
<td><code>true</code></td>
</tr>
</tbody>
</table>

<a id="styles-optimization-options"></a>
#### 樣式最佳化選項
<table class="is-full-width is-fixed-layout">
<thead>
<tr>
<th>選項</th>
<th width="40%">說明</th>
<th>值類型</th>
<th>預設值</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>minify</code></td>
<td>透過移除多餘的空白與註解、合併識別碼並最小化值，來最小化 CSS 定義。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>true</code></td>
</tr>
<tr>
<td><code>inlineCritical</code></td>
<td>擷取並內嵌關鍵 CSS 定義，以改善 <a href="https://web.dev/first-contentful-paint/">首次內容繪製。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>false</code></td>
</tr>
</tbody>
</table>

#### 字型最佳化選項
<table class="is-full-width is-fixed-layout">
<thead>
<tr>
<th>選項</th>
<th width="40%">說明</th>
<th>值類型</th>
<th>預設值</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>inline</code></td>
<td>透過在應用程式的 HTML 索引檔案中內嵌外部 Google 字型與圖示 CSS 定義，減少 <a href="https://web.dev/render-blocking-resources/">轉譯阻擋請求</a>。<br><strong>注意：</strong>這需要網際網路存取。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>true</code></td>
</tr>
</tbody>
</table>


你可以提供如下的值，對其中一者套用最佳化：

<code-example language="json">

  "optimization": { 
    "scripts": true,
    "styles": {
      "minify": true,
      "inlineCritical": true
    },
    "fonts": true
  }

</code-example>

<div class="alert is-helpful">

   對於 [Universal](guide/glossary#universal)，你可以將樣式最佳化設定為 `true`，以減少 HTML 頁面中渲染的程式碼。

</div>

### 來源對應設定

`sourceMap` 瀏覽器建置器選項可以是布林值或物件，以進行更精細的設定，控制應用程式的來源對應。

<table class="is-full-width is-fixed-layout">
<thead>
<tr>
<th>選項</th>
<th width="40%">說明</th>
<th>值類型</th>
<th>預設值</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>scripts</code></td>
<td>輸出所有指令碼的來源對應。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>true</code></td>
</tr>
<tr>
<td><code>styles</code></td>
<td>輸出所有樣式的來源對應。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>true</code></td>
</tr>
<tr>
<td><code>vendor</code></td>
<td>解析廠商套件的來源對應。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>false</code></td>
</tr>
<tr>
<td><code>hidden</code></td>
<td>輸出供錯誤回報工具使用的來源對應。</td>
<td><code class="no-auto-link">boolean</code></td>
<td><code>false</code></td>
</tr>
</tbody>
</table>


下列範例顯示如何切換一或多個值來設定來源對應輸出：

<code-example language="json">

  "sourceMap": {
    "scripts": true,
    "styles": false,
    "hidden": true,
    "vendor": true
  }

</code-example>

<div class="alert is-helpful">

   使用隱藏來源對應時，來源對應不會在套件中被參照。
   這些在你只想讓來源對應在錯誤回報工具中對應錯誤堆疊追蹤、但不想在瀏覽器開發人員工具中公開你的來源對應時很有用。

</div>
