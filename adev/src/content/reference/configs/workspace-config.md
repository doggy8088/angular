# Angular 工作區設定

位於 Angular 工作區根層級的 `angular.json` 檔案，提供工作區層級與專案專屬的設定預設值。這些設定會供 Angular CLI 提供的建置與開發工具使用。
設定中給定的路徑值，都是相對於工作區根目錄。

## 一般 JSON 結構

在 `angular.json` 的最上層，有幾個屬性用來設定工作區，而 `projects` 區段則包含其餘的各專案設定選項。
你可以透過專案層級的預設值，覆寫在工作區層級設定的 Angular CLI 預設值。
你也可以使用命令列，覆寫在專案層級設定的預設值。

檔案最上層的下列屬性，用來設定工作區。

| 屬性             | 詳細說明                                                                                                                                                                                       |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`        | 設定檔版本。                                                                                                                                                                                   |
| `newProjectRoot` | 透過 `ng generate application` 或 `ng generate library` 等工具建立新專案的路徑。路徑可以是絕對路徑，或相對於工作區目錄。預設值為 `projects`                                                  |
| `cli`            | 一組用來自訂 [Angular CLI](tools/cli) 的選項。請參閱下方的 [Angular CLI 設定選項](#angular-cli-configuration-options)。                                                                        |
| `schematics`     | 一組[原理圖](tools/cli/schematics)，用來自訂此工作區的 `ng generate` 子指令選項預設值。請參閱下方的[原理圖](#schematics)。                                                                   |
| `projects`       | 包含工作區中每個應用程式或函式庫的子區段，並帶有專案專屬的設定選項。                                                                                                                           |

你使用 `ng new app-name` 建立的初始應用程式，會列在 "projects" 之下：

當你使用 `ng generate library` 建立函式庫專案時，該函式庫專案也會加入 `projects` 區段。

HELPFUL: 設定檔的 `projects` 區段，與工作區檔案結構並不完全對應。

<!-- markdownlint-disable-next-line MD032 -->

- 由 `ng new` 建立的初始應用程式，位於工作區檔案結構的最上層。
- 其他應用程式與函式庫，預設位於 `projects` 目錄之下。

更多資訊，請參閱[工作區與專案檔案結構](reference/configs/file-structure)。

## Angular CLI 設定選項 {#angular-cli-configuration-options}

下列屬性是一組用來自訂 Angular CLI 的選項。

| 屬性                   | 詳細說明                                                                                                         | 值型別                                | 預設值        |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------- | :------------------------------------ | :------------ |
| `analytics`            | 與 Angular 團隊分享匿名使用資料。布林值表示是否分享資料；UUID 字串則會使用假名識別碼分享資料。                   | `boolean` | `string`                 | `false`       |
| `cache`                | 控制 [Angular CLI 建置器](tools/cli/cli-builder) 使用的[持久磁碟快取](cli/cache)。                               | [快取選項](#cache-options)            | `{}`          |
| `schematicCollections` | 列出要在 `ng generate` 中使用的原理圖集合。                                                                      | `string[]`                            | `[]`          |
| `packageManager`       | 要使用的偏好套件管理工具。                                                                                       | `npm` | `cnpm` | `pnpm` | `yarn` | `npm`         |
| `warnings`             | 控制 Angular CLI 專屬的主控台警告。                                                                              | [警告選項](#warnings-options)         | `{}`          |

### 快取選項 {#cache-options}

| 屬性          | 詳細說明                                                                                                                                                                                                                                       | 值型別                   | 預設值           |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :--------------- |
| `enabled`     | 設定是否為建置啟用磁碟快取。                                                                                                                                                                                                                   | `boolean`                | `true`           |
| `environment` | 設定在哪種環境中啟用磁碟快取。<br><br>_ `ci` 僅在持續整合（CI）環境中啟用快取。<br>_ `local` 僅在 CI 環境 _之外_ 啟用快取。<br>\* `all` 在所有地方啟用快取。                                                                                 | `local` | `ci` | `all` | `local`          |
| `path`        | 用來儲存快取結果的目錄。                                                                                                                                                                                                                       | `string`                 | `.angular/cache` |

### 警告選項 {#warnings-options}

| 屬性              | 詳細說明                                                         | 值型別    | 預設值 |
| :---------------- | :--------------------------------------------------------------- | :-------- | :----- |
| `versionMismatch` | 當全域 Angular CLI 版本比本地版本新時，顯示警告。                | `boolean` | `true` |

## 專案設定選項

下列最上層設定屬性可用於每個專案，位於 `projects['project-name']` 之下。

| 屬性          | 詳細說明                                                                                                                                                                                                               | 值型別                                                          | 預設值          |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- | :-------------- |
| `root`        | 此專案檔案的根目錄，相對於工作區目錄。初始應用程式此值為空，它位於最上層。                                                                                                                                           | `string`                                                        | 無（必填）      |
| `projectType` | "application" 或 "library" 其中之一。應用程式可以在瀏覽器中獨立執行，函式庫則不行。                                                                                                                                    | `application` | `library`                                      | 無（必填）      |
| `sourceRoot`  | 此專案原始檔案的根目錄。                                                                                                                                                                                               | `string`                                                        | `''`            |
| `prefix`      | 使用 `ng generate` 產生新元件、指令與管道時，Angular 會在此字串後加上前綴作為選擇器前綴。可以自訂，以識別某個應用程式或功能領域。                                                                                      | `string`                                                        | `'app'`         |
| `schematics`  | 一組原理圖，用來自訂此專案的 `ng generate` 子指令選項預設值。請參閱[產生原理圖](#schematics)區段。                                                                                                                     | 請參閱[原理圖](#schematics)                                     | `{}`            |
| `architect`   | 此專案的 Architect 建置器目標的設定預設值。                                                                                                                                                                            | 請參閱[設定建置器目標](#configuring-builder-targets)            | `{}`            |

## 原理圖 {#schematics}

[Angular 原理圖](tools/cli/schematics) 是一組指示，用來透過加入新檔案或修改現有檔案來修改專案。
你可以將原理圖名稱對應到一組預設選項，藉此進行設定。

原理圖的「名稱」格式為：`<schematic-package>:<schematic-name>`。
預設 Angular CLI `ng generate` 子指令的原理圖，收集在套件 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) 中。
例如，使用 `ng generate component` 產生元件的原理圖是 `@schematics/angular:component`。

原理圖結構定義中給定的欄位，對應到 Angular CLI 子指令選項允許的命令列引數值與預設值。
你可以更新工作區結構定義檔案，為子指令選項設定不同的預設值。例如，若要預設在 `ng generate component` 中停用 `standalone`：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "schematics": {
        "@schematics/angular:component": {
          "standalone": false
        }
      }
    }
  }
}

</docs-code>

## 設定 CLI 建置器

Architect 是 Angular CLI 用來執行複雜工作的工具，例如編譯與測試執行。
Architect 是一個殼層，會依照目標設定，執行指定的建置器來完成給定的工作。
你可以定義與設定新的建置器與目標，藉此擴充 Angular CLI。
請參閱 [Angular CLI 建置器](tools/cli/cli-builder)。

### 預設的 Architect 建置器與目標

Angular 定義了預設建置器，供特定指令使用，或搭配一般的 `ng run` 指令使用。
定義每個建置器的選項與預設值的 JSON 結構定義，收集在 [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) 套件中。
這些結構定義為下列建置器設定選項。

### 設定建置器目標 {#configuring-builder-targets}

`angular.json` 的 `architect` 區段包含一組 Architect 目標。
許多目標對應到執行它們的 Angular CLI 指令。
其他目標可以使用 `ng run` 指令執行，你也可以定義自己的目標。

每個目標物件會指定該目標的 `builder`，也就是 Architect 所執行工具的 npm 套件。
每個目標也有一個 `options` 區段，用來設定該目標的預設選項；以及一個 `configurations` 區段，用來命名並指定該目標的替代設定。
請參閱下方的 [Build target](#build-target) 範例。

| 屬性           | 詳細說明                                                                                                                                                                                                                 |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`        | 設定 `ng build` 指令選項的預設值。更多資訊，請參閱 [Build target](#build-target) 區段。                                                                                                                                |
| `serve`        | 覆寫建置預設值，並為 `ng serve` 指令提供額外的 serve 預設值。除了 `ng build` 指令可用的選項之外，還加入與提供應用程式相關的選項。                                                                                                |
| `e2e`          | 覆寫建置預設值，供 `ng e2e` 指令建置端對端測試應用程式。                                                                    |
| `test`         | 覆寫測試建置的建置預設值，並為 `ng test` 指令提供額外的測試執行預設值。                                                                                                                 |
| `lint`         | 設定 `ng lint` 指令選項的預設值，該指令會對專案原始檔案執行靜態程式碼分析。                                             |
| `extract-i18n` | 設定 `ng extract-i18n` 指令選項的預設值，該指令會從原始碼擷取本地化訊息字串，並輸出國際化用的翻譯檔案。                                                                                                                 |

HELPFUL: 設定檔中的所有選項都必須使用 `camelCase`，而不是命令列所使用的 `dash-case`。

## Build target {#build-target}

`architect` 下的每個目標都有下列屬性：

| 屬性             | 詳細說明                                                                                                                                                                                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `builder`        | 用來建立此目標的 CLI 建置器，格式為 `<package-name>:<builder-name>`。                                                                                                                                                                                          |
| `options`        | 建置目標的預設選項。                                                                                                                                                                                                                                           |
| `configurations` | 執行目標的替代設定。每個設定會為其預期環境設定預設選項，覆寫 `options` 下的相關值。請參閱下方的[替代建置設定](#alternate-build-configs)。                                                                                                               |

例如，若要設定停用最佳化的建置：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "optimization": false
          }
        }
      }
    }
  }
}

</docs-code>

### 替代建置設定 {#alternate-build-configs}

Angular CLI 附帶兩種建置設定：`production` 與 `development`。
預設情況下，`ng build` 指令使用 `production` 設定，這會套用多項建置最佳化，包括：

- 打包檔案
- 將多餘空白降到最低
- 移除註解與無用程式碼
- 將程式碼最小化，使用簡短且經名稱混淆處理的名稱

你可以定義並命名額外的替代設定（例如 `staging`），以符合你的開發流程。
你可以將替代設定的名稱傳給 `--configuration` 命令列旗標，藉此選取替代設定。

例如，若要設定僅在生產建置時才啟用最佳化（`ng build --configuration production`）：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "optimization": false
          },
          "configurations": {
            "production": {
              "optimization": true
            }
          }
        }
      }
    }
  }
}

</docs-code>

你也可以以逗號分隔清單的形式傳入多個設定名稱。
例如，若要同時套用 `staging` 與 `french` 建置設定，請使用指令 `ng build --configuration staging,french`。
在這種情況下，指令會由左至右解析命名的設定。
若多個設定變更了相同設定，最後設定的值就是最終值。
在此範例中，若 `staging` 與 `french` 設定都設定了輸出路徑，將會使用 `french` 中的值。

### 額外的建置與測試選項 {#extra-build-and-test-options}

預設或目標建置的可設定選項，通常對應到 [`ng build`](cli/build)、[`ng serve`](cli/serve) 與 [`ng test`](cli/test) 指令可用的選項。
這些選項與其可能值的詳細資訊，請參閱 [Angular CLI 參考文件](cli)。

| 選項屬性                   | 詳細說明                                                                                                                                                                                                                                                                  |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`                   | 包含要隨應用程式提供的靜態資產路徑的物件。預設路徑指向專案的圖示檔案與其 `assets` 目錄。更多資訊，請參閱[資產設定](#assets-configuration)區段。                                                                                                                                    |
| `styles`                   | 要加入專案全域脈絡的 CSS 檔案陣列。Angular CLI 支援 CSS 匯入與所有主要的 CSS 預處理器。更多資訊，請參閱[樣式與指令碼設定](#styles-and-scripts-configuration)區段。                                                                                                       |
| `stylePreprocessorOptions` | 包含要傳給樣式預處理器的選項與值配對的物件。請參閱[樣式與指令碼設定](#styles-and-scripts-configuration)區段。                                                                                                                                                             |
| `scripts`                  | 包含要加入應用程式的 JavaScript 檔案的物件。這些指令碼的載入方式，就完全如同你在 `index.html` 內的 `<script>` 標籤中所加入的一樣。更多資訊，請參閱[樣式與指令碼設定](#styles-and-scripts-configuration)區段。                                                              |
| `budgets`                  | 應用程式全部或部分的預設大小預算型別與閾值。你可以設定建置器，在輸出達到或超過閾值大小時回報警告或錯誤。請參閱[設定大小預算](tools/cli/build#configure-size-budgets)。                                                                                                  |
| `fileReplacements`         | 包含檔案及其編譯時期替代項的物件。更多資訊，請參閱[設定目標專屬檔案替代](tools/cli/build#configure-target-specific-file-replacements)。                                                                                                                                  |
| `index`                    | 載入應用程式的基底 HTML 文件。更多資訊，請參閱[索引設定](#index-config)。                                                                                                                                                                                            |

## 複雜設定值

`assets`、`index`、`outputPath`、`styles` 與 `scripts` 選項，可以是簡單的路徑字串值，也可以是帶有特定欄位的物件值。
`sourceMap` 與 `optimization` 選項可以設為簡單的布林值。它們也可以使用設定檔給定複雜值。

下列區段提供更多關於這些複雜值在各情況下如何使用的詳細資訊。

### 資產設定 {#assets-configuration}

每個 `build` 目標設定都可以包含一個 `assets` 陣列，列出你想在建置專案時原樣複製的檔案或資料夾。
預設情況下，`src/assets/` 目錄與 `src/favicon.ico` 會被複製過去。

若要排除某項資產，你可以將它從 assets 設定中移除。

你可以進一步將資產指定為物件（而不是相對於工作區根目錄的簡單路徑），藉此設定要複製的資產。
資產規格物件可以有下列欄位。

| 欄位             | 詳細說明                                                                                                                                   |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `glob`           | 以 `input` 作為基底目錄的 [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md)。                                           |
| `input`          | 相對於工作區根目錄的路徑。                                                                                                                 |
| `output`         | 相對於 `outDir` 的路徑。由於安全性考量，Angular CLI 絕不會將檔案寫入專案輸出路徑之外。                                                     |
| `ignore`         | 要排除的 glob 清單。                                                                                                                       |
| `followSymlinks` | 允許 glob 模式跟隨符號連結目錄。這讓符號連結的子目錄也能被搜尋。預設值為 `false`。                                                         |

例如，預設的資產路徑可以用下列物件更詳細地表示。

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
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
          }
        }
      }
    }
  }
}

</docs-code>

下列範例使用 `ignore` 欄位，將 assets 目錄中的某些檔案排除在建置複製之外：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "ignore": ["**/*.svg"],
                "output": "/assets/"
              }
            ]
          }
        }
      }
    }
  }
}

</docs-code>

### 樣式與指令碼設定 {#styles-and-scripts-configuration}

`styles` 與 `scripts` 選項的陣列項目，可以是簡單路徑字串，或是指向額外進入點檔案的物件。
相關建置器會在建置期間，將該檔案及其相依性載入為個別的套件組。
使用設定物件時，你可以選擇使用 `bundleName` 欄位，為進入點的套件組命名。

套件組預設會被注入，但你可以將 `inject` 設為 `false`，將套件組排除在注入之外。
例如，下列物件值會建立並命名一個包含樣式與指令碼的套件組，並將其排除在注入之外：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
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
          }
        }
      }
    }
  }
}

</docs-code>

#### 樣式預處理器選項

在 Sass 中，元件樣式與全域樣式都可以使用 `includePaths` 功能。這讓你可以加入額外的基底路徑，在匯入時進行檢查。

若要加入路徑，請使用 `stylePreprocessorOptions` 選項：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/style-paths"
              ]
            }
          }
        }
      }
    }
  }
}

</docs-code>

該目錄中的檔案（例如 `src/style-paths/_variables.scss`），可以從專案中的任何位置匯入，無需使用相對路徑：

<docs-code language="scss">

// src/app/app.component.scss
// A relative path works
@import '../style-paths/variables';

// But now this works as well
@import 'variables';

</docs-code>

HELPFUL: 若單元測試需要樣式或指令碼，你也需要將它們加入 `test` 建置器。
另請參閱[在應用程式中使用執行階段全域函式庫](tools/libraries/using-libraries#using-runtime-global-libraries-inside-your-app)。

### 最佳化設定 {#optimization-configuration}

`optimization` 選項可以是布林值，也可以是物件，以進行更細緻的設定。
此選項會啟用建置輸出的多項最佳化，包括：

- 將指令碼與樣式最小化
- 搖樹優化
- 移除無用程式碼
- 將關鍵 CSS 行內化
- 將字型行內化

有幾個選項可用來微調應用程式的最佳化。

| 選項      | 詳細說明                                               | 值型別                                                                   | 預設值 |
| :-------- | :----------------------------------------------------- | :----------------------------------------------------------------------- | :----- |
| `scripts` | 啟用指令碼輸出的最佳化。                               | `boolean`                                                                | `true` |
| `styles`  | 啟用樣式輸出的最佳化。                                 | `boolean` | [樣式最佳化選項](#styles-optimization-options)               | `true` |
| `fonts`   | 啟用字型的最佳化。這需要網際網路存取。                 | `boolean` | [字型最佳化選項](#fonts-optimization-options)                | `true` |

#### 樣式最佳化選項 {#styles-optimization-options}

| 選項                    | 詳細說明                                                                                                         | 值型別    | 預設值 |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------- | :--------- | :------------ |
| `minify`                | 透過移除多餘空白與註解、合併識別碼以及將值最小化，將 CSS 定義最小化。                                                    | `boolean`  | `true`        |
| `inlineCritical`        | 擷取並行內化關鍵 CSS 定義，以改善[首次內容繪製](https://web.dev/first-contentful-paint)。                                | `boolean`  | `true`        |
| `removeSpecialComments` | 移除全域 CSS 中包含 `@license` 或 `@preserve`，或是以 `//!` 或 `/*!` 開頭的註解。                                        | `boolean`  | `true`        |

#### 字型最佳化選項 {#fonts-optimization-options}

| 選項     | 詳細說明                                                                                                                                                                                                             | 值型別    | 預設值 |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------- | :------------ |
| `inline` | 在應用程式的 HTML 索引檔案中行內化外部 Google Fonts 與 Adobe Fonts CSS 定義，藉此減少[會阻擋渲染的請求](https://web.dev/render-blocking-resources)。這需要網際網路存取。                                            | `boolean`  | `true`        |

你可以提供如下的值，藉此將最佳化套用到其中一項：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "optimization": {
              "scripts": true,
              "styles": {
                "minify": true,
                "inlineCritical": true
              },
              "fonts": true
            }
          }
        }
      }
    }
  }
}

</docs-code>

### 來源對應設定

`sourceMap` 建置器選項可以是布林值，也可以是物件，以進行更細緻的設定，控制應用程式的來源對應。

| 選項             | 詳細說明                                                   | 值型別    | 預設值  |
| :--------------- | :----------------------------------------------------------- | :--------- | :------------ |
| `scripts`        | 為所有指令碼輸出來源對應。                                 | `boolean`  | `true`        |
| `styles`         | 為所有樣式輸出來源對應。                                   | `boolean`  | `true`        |
| `vendor`         | 解析供應商套件的來源對應。                                 | `boolean`  | `false`       |
| `hidden`         | 從輸出 JavaScript 中省略來源對應的連結。                   | `boolean`  | `false`       |

下方的範例示範如何切換一個或多個值，藉此設定來源對應輸出：

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": false,
              "hidden": true,
              "vendor": true
            }
          }
        }
      }
    }
  }
}

</docs-code>

HELPFUL: 使用隱藏的來源對應時，來源對應不會在套件組中被參照。
若你只想讓來源對應在錯誤回報工具中對應堆疊追蹤，而不希望它們出現在瀏覽器開發人員工具中，這會很有用。
請注意，雖然 `hidden` 可防止來源對應在輸出套件組中被連結，你的部署流程仍必須注意不要在生產環境中提供產生的來源對應，否則資訊仍會外洩。

### 索引設定 {#index-config}

設定應用程式 HTML 索引的產生方式。

`index` 選項可以是字串，也可以是物件，以進行更細緻的設定。

以字串形式提供值時，指定路徑的檔案名稱會用於產生的檔案，並會在應用程式設定輸出路徑的根目錄中建立。

#### 索引選項

| 選項             | 詳細說明                                                                                                                                                                          | 值型別    | 預設值                                              |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------------------------------------------------- |
| `input`          | 要用於應用程式產生的 HTML 索引的檔案路徑。                                                                                                                                         | `string`   | 無（必填）                                            |
| `output`         | 應用程式產生的 HTML 索引檔案的輸出路徑。會使用所提供的完整路徑，並會視為相對於應用程式設定的輸出路徑。                                                                             | `string`   | `index.html`                                               |

### 輸出路徑設定 {#output-path-configuration}

`outputPath` 選項可以是字串（會用作 `base` 值），也可以是物件，以進行更細緻的設定。

有幾個選項可用來微調應用程式的輸出結構。

| 選項      | 詳細說明                                                                                                                                                           | 值型別    | 預設值    |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------ |
| `base`    | 指定相對於工作區根目錄的輸出路徑。                                                                                                                                 | `string`   |               |
| `browser` | 位於基底輸出路徑之內，你的瀏覽器建置的輸出目錄名稱。這可以安全地提供給使用者。                                                                                     | `string`   | `browser`     |
| `server`  | 位於輸出路徑基底之內，你的伺服器建置的輸出目錄名稱。                                                                                                               | `string`   | `server`      |
| `media`   | 位於輸出瀏覽器目錄之內，你的媒體檔案的輸出目錄名稱。這些媒體檔案在 CSS 檔案中通常被稱為資源。                                                                      | `string`   | `media`       |
