# Angular 工作區設定

位於 Angular [工作區](guide/glossary#工作區workspace)根層級、名為 `angular.json` 的檔案，為 Angular CLI 提供的建置與開發工具提供整個工作區與專案專屬的設定預設值。設定中給定的路徑值是相對於根工作區資料夾。

## 整體 JSON 結構

在 `angular.json` 的最上層，少數屬性設定工作區，而 `projects` 區段包含其餘各專案的設定選項。
你可以透過專案層級設定的預設值，覆寫工作區層級設定的 CLI 預設值。
你也可以使用命令列，覆寫專案層級設定的預設值。

下列屬性位於檔案的最上層，用來設定工作區。

| 屬性             | 詳細資訊 |
|:---              |:---     |
| `version`        | 設定檔版本。                                                                                                                                                                                                       |
| `newProjectRoot` | 建立新專案的路徑。絕對路徑，或相對於工作區資料夾的路徑。                                                                                                                                                             |
| `cli`            | 一組自訂 [Angular CLI](cli) 的選項。請參閱[CLI 設定選項](#cli-configuration-options)一節。                                                                                                                      |
| `schematics`     | 一組自訂此工作區 `ng generate` 子指令選項預設值的[原理圖](guide/glossary#原理圖schematic)。請參閱[產生原理圖](#schematics)一節。                                                                                             |
| `projects`       | 包含工作區中每個專案（程式庫或應用程式）的子區段，以及各專案的設定選項。                                                                                                                                                     |

你以 `ng new app_name` 建立的初始應用程式會列在「projects」之下：

<code-example language="json">

"projects": {
  "app_name": {
    &hellip;
  }
  &hellip;
}

</code-example>

以 `ng generate library` 建立程式庫專案時，該程式庫專案也會加入 `projects` 區段。

<div class="alert is-helpful">

**NOTE**：<br />
設定檔的 `projects` 區段與工作區檔案結構並非完全對應。

*   以 `ng new` 建立的初始應用程式位於工作區檔案結構的最上層
*   額外的應用程式與程式庫則放在工作區中的 `projects` 資料夾

更多資訊請參閱[工作區與專案檔案結構](guide/file-structure)。

</div>

<a id="cli-configuration-options"></a>

## CLI 設定選項

下列設定屬性是一組自訂 Angular CLI 的選項。

| 屬性                  | 詳細資訊                                                                                  | 值類型                                              |
|:---                   |:---                                                                                       |:---                                                 |
| `analytics`           | 與 Angular 團隊分享匿名的[使用資料](cli/usage-analytics-gathering)。                                        | `boolean` &verbar; `ci`                             |
| `analyticsSharing`    | 一組分析分享選項。                                                                | [分析分享選項](#分析分享選項) |
| `cache`               | 控制 [Angular CLI 建置器](guide/cli-builder)使用的[持續性磁碟快取](cli/cache)。              | [快取選項](#快取選項)                          |
| `schematicCollection` | 要使用的預設原理圖集合清單。                                                                | `string`                                                |
| `packageManager`      | 要使用的偏好套件管理工具。                                                                  | `npm` &verbar; `cnpm` &verbar; `pnpm` &verbar;`yarn`|
| `warnings`            | 控制 CLI 特有的主控台警告。                                                          | [警告選項](#警告選項)                        |

### 分析分享選項

| 屬性       | 詳細資訊                                          | 值類型     |
|:---        |:---                                               |:---        |
| `tracking` | 分析分享資訊追蹤 ID。                             | `string`   |
| `uuid`     | 分析分享資訊 UUID（全域唯一識別碼）。              | `string`   |


<a id="cache-options"></a>
### 快取選項

| 屬性          | 詳細資訊                               | 值類型                           | 預設值           |
|:---           | :---                                   |:---                              |:---              |
| `enabled`     | 設定是否啟用磁碟快取。                 | `boolean`                        | `true`           |
| `environment` | 設定在哪些環境中啟用磁碟快取。         | `local` &verbar; `ci` &verbar; `all` | `local`      |
| `path`        | 用來儲存快取結果的目錄。               | `string`                         | `.angular/cache` |

### 警告選項

| 屬性              | 詳細資訊                                                                         | 值類型    | 預設值    |
|:---               |:---                                                                             |:---       |:---       |
| `versionMismatch` | 當全域 Angular CLI 版本比本機版本新時顯示警告。                                   | `boolean` | `true`    |

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

| 屬性          | 詳細資訊 |
|:---           |:---     |
| `root`        | 此專案檔案的根資料夾，相對於工作區資料夾。初始應用程式為空，因為它位於工作區的最上層。 |
| `sourceRoot`  | 此專案原始碼檔案的根資料夾。                                                                                                        |
| `projectType` | 「application」或「library」其中之一。應用程式可以獨立在瀏覽器中執行，程式庫則不行。                                           |
| `prefix`      | Angular 會在產生的選取器前面加上的字串。可以自訂以識別應用程式或功能區域。                                    |
| `schematics`  | 一組自訂此專案 `ng generate` 子指令選項預設值的原理圖。請參閱[產生原理圖](#schematics)一節。|
| `architect`   | 此專案的 Architect 建置器目標的設定預設值。                                                                                  |

<a id="schematics"></a>

## 產生原理圖

Angular 產生[原理圖](guide/glossary#原理圖schematic)是透過新增檔案或修改既有檔案來修改專案的指示。
Angular CLI 預設 `ng generate` 子指令的個別原理圖彙集在 `@schematics/angular` 套件中。
以 `schematic-package:schematic-name` 的格式指定子指令的原理圖名稱；
例如，產生元件的原理圖是 `@schematics/angular:component`。

CLI 用來產生專案與專案各部分的預設原理圖，其 JSON 結構定義彙集在 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) 套件中。
結構定義說明了 CLI 在每個 `ng generate` 子指令下可用的選項，如 `--help` 輸出所示。

結構定義中給定的欄位，對應於 CLI 子指令選項允許的引數值與預設值。
你可以更新工作區結構定義檔案，為子指令選項設定不同的預設值。

<a id="architect"></a>

## 專案工具設定選項

Architect 是 CLI 用來執行複雜工作（例如編譯與執行測試）的工具。
Architect 是一個殼層，會根據[目標](guide/glossary#目標target)設定，執行指定的[建置器](guide/glossary#建置器builder)來執行特定工作。
你可以定義與設定新的建置器與目標，以擴充 CLI。
請參閱 [Angular CLI 建置器](guide/cli-builder)。

<a id="default-build-targets"></a>

### 預設 Architect 建置器與目標

Angular 為特定的 CLI 指令或一般 `ng run` 指令定義了預設建置器。
定義這些預設建置器各自選項與預設值的 JSON 結構定義，彙集在 [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) 套件中。
這些結構定義為下列建置器設定選項。

*   [app-shell](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/app-shell/schema.json)
*   [browser](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/browser/schema.json)
*   [dev-server](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/dev-server/schema.json)
*   [extract-i18n](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/extract-i18n/schema.json)
*   [karma](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/karma/schema.json)
*   [server](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/server/schema.json)

### 設定建置器目標

`angular.json` 的 `architect` 區段包含一組 Architect 目標。
許多目標對應於執行它們的 CLI 指令。
一些額外預先定義的目標可以使用 `ng run` 指令執行，你也可以定義自己的目標。

每個目標物件會指定該目標的 `builder`，也就是 Architect 執行的工具所屬的 npm 套件。
此外，每個目標還有一個 `options` 區段，用來設定該目標的預設選項，以及一個 `configurations` 區段，用來命名並指定該目標的替代設定。
請參閱下方[建置目標](#建置目標)中的範例。

<code-example language="json">

"architect": {
  "build": {},
  "serve": {},
  "e2e" : {},
  "test": {},
  "lint": {},
  "extract-i18n": {},
  "server": {},
  "app-shell": {}
}

</code-example>

| 區段                     | 詳細資訊 |
|:---                      |:---     |
| `architect/build`        | 設定 `ng build` 指令選項的預設值。更多資訊請參閱[建置目標](#建置目標)一節。                                                                                   |
| `architect/serve`        | 覆寫建置預設值，並為 `ng serve` 指令提供額外的服務預設值。除了 `ng build` 指令可用的選項之外，還會新增與提供應用程式相關的選項。 |
| `architect/e2e`          | 使用 `ng e2e` 指令建置端對端測試應用程式時，覆寫建置選項預設值。                                                                                                         |
| `architect/test`         | 覆寫測試建置的建置選項預設值，並為 `ng test` 指令提供額外的測試執行預設值。                                                                                         |
| `architect/lint`         | 設定 `ng lint` 指令選項的預設值，該指令會對專案原始碼檔案執行程式碼分析。                                                                                                  |
| `architect/extract-i18n` | 設定 `ng extract-i18n` 指令選項的預設值，該指令會從原始碼中擷取標記的訊息字串並輸出翻譯檔案。                                                          |
| `architect/server`       | 使用 `ng run <project>:server` 指令，以伺服器端渲染建立 Universal 應用程式時，設定預設值。                                                                                |
| `architect/app-shell`    | 使用 `ng run <project>:app-shell` 指令，為漸進式網頁應用程式（PWA）建立應用程式殼層時，設定預設值。                                                                 |

一般而言，可以設定預設值的選項，對應於每個指令在 [CLI 參考頁面](cli)中所列的指令選項。

<div class="alert is-helpful">

**NOTE**：<br />
設定檔中的所有選項都必須使用 [camelCase](guide/glossary#case-conventions)，而非 dash-case。

</div>

<a id="build-target"></a>

## 建置目標

`architect/build` 區段會設定 `ng build` 指令選項的預設值。
它具有下列頂層屬性。

| 屬性             | 詳細資訊                                                                                                                                                                                                                                                                                                              |
|:---             |:---                                                                                                                                                                                                                                                                                                                      |
| `builder`       | 用來建立此目標的建置工具所屬的 npm 套件。應用程式的預設建置器（`ng build myApp`）是 `@angular-devkit/build-angular:browser`，使用 [webpack](https://webpack.js.org) 套件打包工具。<div class="alert is-helpful"> **NOTE**：<br />建置程式庫（`ng build myLib`）時會使用不同的建置器。</div> |
| `options`       | 此區段包含預設的建置目標選項，在未指定具名替代設定時使用。請參閱[預設建置目標](#default-build-targets)一節。                                                                                                                                                |
| `configurations`| 此區段定義並命名不同預期目的地的替代設定。它包含每個具名設定的區段，為該預期環境設定預設選項。請參閱[替代建置設定](#build-configs)一節。                                             |

<a id="build-configs"></a>

### 替代建置設定

Angular CLI 隨附兩種建置設定：`production` 與 `development`。
預設情況下，`ng build` 指令使用 `production` 設定，會套用數種建置最佳化，包括：

*   打包檔案
*   盡量減少多餘的空白
*   移除註解與無用程式碼
*   將程式碼改寫為使用簡短、混淆過的名稱（最小化）

你可以定義並命名適合開發流程的額外替代設定（例如 `stage`）。
不同建置設定的一些範例包括 AIO 本身使用的 `stable`、`archive` 與 `next`，以及建置應用程式在地化版本所需的個別地區設定專屬設定。
詳情請參閱[國際化（i18n）][AioGuideI18nCommonMerge]。

你可以將替代設定的名稱傳遞給 `--configuration` 命令列旗標來選取它。

你也可以傳入多個設定名稱，以逗號分隔的清單表示。
例如，若要同時套用 `stage` 與 `fr` 建置設定，請使用指令 `ng build --configuration stage,fr`。
在此情況下，指令會由左至右解析具名的設定。
如果多個設定變更了相同的設定，最後設定的值就是最終值。
因此，在此範例中，如果 `stage` 與 `fr` 設定都設定了輸出路徑，就會使用 `fr` 中的值。

<a id="build-props"></a>

### 額外的建置與測試選項

預設或目標建置的可設定選項，一般對應於 [`ng build`](cli/build)、[`ng serve`](cli/serve) 與 [`ng test`](cli/test) 指令可用的選項。
這些選項及其可能值的詳情，請參閱 [CLI 參考資料](cli)。

有些額外選項只能透過設定檔設定，無論是直接編輯，或使用 [`ng config`](cli/config) 指令。

| 選項屬性                   | 詳細資訊                                                                                                                                                                                                                                                                                                 |
|:---                        |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `assets`                   | 一個物件，包含要加入專案全域情境的靜態資產路徑。預設路徑指向專案的圖示檔案及其 `assets` 資料夾。更多資訊請參閱[資產設定](#asset-config)一節。                                                                  |
| `styles`                   | 一個樣式檔案陣列，要加入專案的全域情境。Angular CLI 支援 CSS 匯入與所有主要的 CSS 預處理器：[sass/scss](https://sass-lang.com) 與 [less](http://lesscss.org)。更多資訊請參閱[樣式與指令碼設定](#style-script-config)一節。            |
| `stylePreprocessorOptions` | 一個物件，包含要傳遞給樣式預處理器的選項值配對。更多資訊請參閱[樣式與指令碼設定](#style-script-config)一節。                                                                                                                                               |
| `scripts`                  | 一個物件，包含要加入專案全域情境的 JavaScript 指令碼檔案。這些指令碼的載入方式，就如同你在 `index.html` 中的 `<script>` 標籤內加入它們一樣。更多資訊請參閱[樣式與指令碼設定](#style-script-config)一節。                            |
| `budgets`                  | 應用程式全部或部分的預設大小預算類型與閾值。你可以設定建置器，在輸出達到或超過閾值大小時回報警告或錯誤。請參閱[設定大小預算](guide/build#configure-size-budgets)。（`test` 區段中不提供。） |
| `fileReplacements`         | 一個物件，包含檔案及其編譯時期取代檔案。更多資訊請參閱[設定目標專屬的檔案取代](guide/build#設定目標專屬的檔案置換)。                                                                                                                     |

<a id="complex-config"></a>

## 複雜的設定值

`assets`、`styles` 與 `scripts` 選項可以是簡單的路徑字串值，也可以是具有特定欄位的物件值。
`sourceMap` 與 `optimization` 選項可以透過指令旗標設定為簡單的布林值，但也可以透過設定檔給定複雜的值。

下列各節提供這些複雜值在各種情況下如何使用的更多詳細資訊。

<a id="asset-config"></a>

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

| 欄位             | 詳細資訊 |
|:---              |:---     |
| `glob`           | 一個 [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md)，以 `input` 作為基底目錄。                                                              |
| `input`          | 相對於工作區根目錄的路徑。                                                                                                                                 |
| `output`         | 相對於 `outDir` 的路徑（預設為 `dist/`*project-name*）。基於安全性考量，CLI 絕不會將檔案寫入專案輸出路徑之外。 |
| `ignore`         | 要排除的 glob 清單。                                                                                                                                            |
| `followSymlinks` | 允許 glob 模式跟隨符號連結目錄。這可讓系統搜尋符號連結的子目錄。預設為 `false`。                                      |

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

<a id="style-script-config"></a>

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

<a id="style-preprocessor"></a>

#### 樣式預處理器選項

在 Sass 中，你可以對元件樣式與全域樣式使用 `includePaths` 功能，這可讓你新增在匯入時會檢查的額外基底路徑。

若要新增路徑，請使用 `stylePreprocessorOptions` 選項：

<code-example language="json">

"stylePreprocessorOptions": {
  "includePaths": [
    "src/style-paths"
  ]
}

</code-example>

該資料夾中的檔案（例如 `src/style-paths/_variables.scss`）可以從專案中的任何位置匯入，無需使用相對路徑：

<code-example language="typescript">

// src/app/app.component.scss
// A relative path works
&commat;import '../style-paths/variables';
// But now this works as well
&commat;import 'variables';

</code-example>

<div class="alert is-helpful">

**NOTE**：<br />
如果你需要將樣式或指令碼用於單元測試，也需要將其加入 `test` 建置器。
另請參閱[在應用程式中使用執行時期全域程式庫](guide/using-libraries#在應用程式中使用執行階段全域程式庫)。

</div>

### 最佳化設定

`optimization` 瀏覽器建置器選項可以是布林值或物件，以進行更精細的設定。
此選項會啟用建置輸出的各種最佳化，包括：

*   指令碼與樣式的最小化
*   搖樹優化
*   無用程式碼消除
*   關鍵 CSS 的內嵌
*   字型的內嵌

有數個選項可以用來微調應用程式的最佳化。

| 選項      | 詳細資訊                                                                                                               | 值類型                                                                     | 預設值    |
|:---       |:---                                                                                                                   |:---                                                                            |:---           |
| `scripts` | 啟用指令碼輸出的最佳化。                                                                                           | `boolean`                                                                      | `true`        |
| `styles`  | 啟用樣式輸出的最佳化。                                                                                            | `boolean` &verbar; [樣式最佳化選項](#樣式最佳化選項) | `true`        |
| `fonts`   | 啟用字型的最佳化。<div class="alert is-helpful"> **NOTE**：<br />需要網際網路存取。</div> | `boolean` &verbar; [字型最佳化選項](#字型最佳化選項)   | `true`        |

#### 樣式最佳化選項

| 選項             | 詳細資訊                                                                                                                  | 值類型    | 預設值    |
|:---              |:---                                                                                                                      |:---       |:---       |
| `minify`         | 透過移除多餘的空白與註解、合併識別碼並最小化值，來最小化 CSS 定義。        | `boolean` | `true`    |
| `inlineCritical` | 擷取並內嵌關鍵 CSS 定義，以改善[首次內容繪製](https://web.dev/first-contentful-paint)。 | `boolean` | `true`    |

#### 字型最佳化選項

| 選項     | 詳細資訊                                                                                                                                                                                                                                                                    | 值類型    | 預設值    |
|:---      |:---                                                                                                                                                                                                                                                                        |:---       |:---       |
| `inline` | 透過在應用程式的 HTML 索引檔案中內嵌外部 Google Fonts 與 Adobe Fonts CSS 定義，減少[轉譯阻擋請求](https://web.dev/render-blocking-resources)。<div class="alert is-helpful"> **NOTE**：<br />需要網際網路存取。</div> | `boolean` | `true`    |

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

| 選項      | 詳細資訊                                            | 值類型    | 預設值    |
|:---       |:---                                                |:---       |:---       |
| `scripts` | 輸出所有指令碼的來源對應。                          | `boolean` | `true`    |
| `styles`  | 輸出所有樣式的來源對應。                            | `boolean` | `true`    |
| `vendor`  | 解析廠商套件的來源對應。                            | `boolean` | `false`   |
| `hidden`  | 輸出供錯誤回報工具使用的來源對應。                  | `boolean` | `false`   |

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
如果你只想讓來源對應在錯誤回報工具中對應錯誤堆疊追蹤、但不想在瀏覽器開發人員工具中公開你的來源對應，這很有用。

</div>

<!-- links -->

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Common Internationalization task #6: Merge translations into the application | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
