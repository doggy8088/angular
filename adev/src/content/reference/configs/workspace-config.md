# Angular 工作區設定

位於 Angular 工作區根目錄的 `angular.json` 檔案提供工作區範圍和專案特定組態預設值。這些用於 Angular CLI 提供的建置和開發工具。
組態中指定的路徑值是相對於根工作區目錄。

## 一般 JSON 結構

在 `angular.json` 的頂層，幾個屬性配置工作區，而 `projects` 區段包含其餘每個專案的配置選項。
您可以透過在專案層級設定的預設值，覆寫在工作區層級設定的 Angular CLI 預設值。
您也可以使用命令列覆寫在專案層級設定的預設值。

檔案最上層的下列屬性，會設定工作區。

| 屬性       | 詳細資料                                                                                                                                                                                       |
|:---              |:---                                                                                                                                                                                           |
| `version`        | 組態檔案版本。                                                                                                                                                                           |
| `newProjectRoot` | 使用 `ng generate application` 或 `ng generate library` 等工具建立新專案的路徑。路徑可以是絕對或相對於工作區目錄。預設為 `projects` |
| `cli`            | 一組自訂 [Angular CLI](tools/cli) 的選項。請參閱以下 [Angular CLI 組態選項](#angular-cli-configuration-options)。                                                              |
| `schematics`     | 一組 [schematics](tools/cli/schematics) 自訂此工作區的 `ng generate` 子指令選項預設值。請參閱以下 [schematics](#schematics)。                                                    |
| `projects`       | 包含工作區中每個應用程式或函式庫的子區段，其中包含專案特定的組態選項。                                                                                                      |

您使用 `ng new app-name` 建立的初始應用程式列於「專案」底下：

當您使用 `ng generate library` 建立一個程式庫專案時，該程式庫專案也會新增至 `projects` 區段。

HELPFUL: 配置檔案的 `projects` 區段與工作區檔案結構不完全對應。

<!-- markdownlint-disable-next-line MD032 -->

* `ng new` 建立的初始應用程式位於工作區檔案結構的最上層。
* 其他應用程式和函式庫預設位於 `projects` 目錄下。

如需更多資訊，請參閱 [工作區和專案檔案結構](reference/configs/file-structure)。

## Angular CLI 組態選項

以下屬性是一組客製化 Angular CLI 的選項。

| 屬性              | 詳細資訊                                                                                                                                                                | 值類型                                            | 預設值 |
|:---                   |:---                                                                                                                                                                  |:---                                                   |:---           |
| `analytics`           | 與 Angular 團隊分享匿名使用資料。布林值表示是否分享資料，而 UUID 字串則使用匿名識別碼分享資料。 | `boolean` &verbar;  `string`                          | `false`       |
| `cache`               | 控制 [Angular CLI 建構器](tools/cli/cli-builder) 使用的 [持久性磁碟快取](cli/cache)。                                                                                   | [快取選項](#cache-options)                       | `{}`          |
| `schematicCollections`| 列出要在 `ng generate` 中使用的 schematic 集合。                                                                                                                               | `string[]`                                            | `[]`          |
| `packageManager`      | 要使用的首選套件管理員工具。                                                                                                                                             | `npm` &verbar; `cnpm` &verbar; `pnpm` &verbar; `yarn` | `npm`         |
| `warnings`            | 控制 Angular CLI 特有的主控台警告。                                                                                                                                      | [警告選項](#warnings-options)                 | `{}`          |

### 快取選項

| 屬性      | 詳細資料                                                                                                                                                                                                                                          | 值類型                           | 預設值    |
|:---           |:---                                                                                                                                                                                                                                              |:---                                  |:---              |
| `enabled`     | 設定是否啟用建構的磁碟快取。                                                                                                                                                                                                                      | `boolean`                            | `true`           |
| `environment` | 設定磁碟快取啟用的環境。<br><br>* `ci` 僅在持續整合 (CI) 環境中啟用快取。<br>* `local` 僅在 CI 環境*之外*啟用快取。<br>* `all` 在各處啟用快取。 | `local` &verbar; `ci` &verbar; `all` | `local`          |
| `path`        | 用於儲存快取結果的目錄。                                                                                                                                                                                                                              | `string`                             | `.angular/cache` |

### 警告選項

| 屬性          | 詳細資訊                                                                        | 值類型 | 預設值 |
|:---               |:---                                                                            |:---        |:---           |
| `versionMismatch` | 當全球 Angular CLI 版本比本機版本新時顯示警告。 | `boolean`  | `true`        |

## 專案設定選項

以下頂級設定屬性可供每個專案使用，位於 `projects['project-name']` 中。

| 屬性      | 詳細資訊                                                                                                                                                                              | 值類型                                                      | 預設值   |
|:---           |:---                                                                                                                                                                                  |:---                                                             |:---             |
| `root`        | 此專案檔案的根目錄，相對於工作區目錄。第一個應用程式的根目錄為空，位於工作區的最上層。                                                                         | `string`                                                        | 無 (必要) |
| `projectType` | 「應用程式」或「函式庫」之一。應用程式可以在瀏覽器中獨立執行，函式庫則不行。                                                                                                  | `application` &verbar; `library`                                | 無 (必要) |
| `sourceRoot`  | 此專案來源檔案的根目錄。                                                                                                                                                                | `string`                                                        | `''`            |
| `prefix`      | Angular 在使用 `ng generate` 產生新的元件、指令和管道時，會將字串加到選取器前面。可以自訂以辨識應用程式或功能區域。                                  | `string`                                                        | `'app'`         |
| `schematics`  | 一組自訂 `ng generate` 子指令選項預設值的簡圖，適用於此專案。請參閱 [產生簡圖](#schematics) 區段。                                                                | 參閱 [schematics](#schematics)                                   | `{}`            |
| `architect`   | 此專案中 Architect Builder 目標的預設設定。                                                                                                                                   | 參閱 [設定 Builder 目標](#configuring-builder-targets) | `{}`            |

## 電路圖

[Angular 範例](tools/cli/schematics) 是用於修改專案的指令，方法是新增檔案或修改現有檔案。
這些範例可透過將範例名稱對應至一組預設選項來設定。

示意圖的「名稱」格式為：`<schematic-package>:<schematic-name>`。
預設 Angular CLI `ng generate` 子命令的示意圖收集在套件 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) 中。
例如，使用 `ng generate component` 產生元件的示意圖為 `@schematics/angular:component`。

在 schematic 的 schema 中給出的欄位，對應到 Angular CLI 子指令選項允許的命令列參數值和預設值。
您可以更新工作區 schema 檔案，來為子指令選項設定不同的預設值。例如，要在 `ng generate component` 中預設停用 `standalone`：

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

## 配置 CLI 構建器

Architect 是 Angular CLI 用於執行複雜任務的工具，例如編譯和執行測試。
Architect 是一個執行指定建構器以根據目標設定執行給定任務的外殼。
你可以定義和設定新的建構器和目標來擴充 Angular CLI。
請參閱 [Angular CLI 建構器](tools/cli/cli-builder)。

### 預設 Architect 建構器和目標

`Angular` 為特定指令或一般 `ng run` 指令定義預設建構器。

定義每個建構器選項與預設值的 JSON 架構收集於 [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) 套件中。

架構設定以下建構器的選項。

### 建構器目標設定

`angular.json` 的 `architect` 區段包含一組 Architect 目標。
許多目標對應到執行它們的 Angular CLI 指令。
其他目標可以使用 `ng run` 指令執行，而且您可以定義自己的目標。

每個目標物件指定該目標的 `builder`，這是 Architect 執行的工具的 npm 套件。
每個目標還有一個 `options` 區段，用於設定目標的預設選項，以及一個 `configurations` 區段，用於命名和指定目標的替代配置。
請參閱以下 [建置目標](#build-target) 中的範例。

| 屬性       | 詳細資料                                                                                                                                                                                              |
|:---            |:---                                                                                                                                                                                                  |
| `build`        | 設定 `ng build` 指令選項的預設值。請參閱 [建置目標](#build-target) 區段以取得更多資訊。                                                                                                 |
| `serve`        | 覆寫建置預設值，並提供 `ng serve` 指令額外的服務預設值。除了 `ng build` 指令可用的選項之外，還新增與提供應用程式服務相關的選項。                                                    |
| `e2e`          | 使用 `ng e2e` 指令覆寫建置預設值，以便建置端到端測試應用程式。                                                                                                                            |
| `test`         | 覆寫建置預設值，以便進行測試建置，並提供 `ng test` 指令額外的測試執行預設值。                                                                                                             |
| `lint`         | 設定 `ng lint` 指令選項的預設值，該指令會針對專案原始檔執行靜態程式碼分析。                                                                                                               |
| `extract-i18n` | 設定 `ng extract-i18n` 指令選項的預設值，該指令會從原始碼中擷取在地化訊息字串，並輸出國際化的翻譯檔。                                                                                  |

HELPFUL：設定檔中的所有選項都必須使用 `camelCase`，而不是在命令列中使用的 `dash-case`。

## 建置目標

`architect` 下的每個目標具有下列屬性：

| 屬性        | 詳細資料                                                                                                                                                                                                                                                |
|:---             |:---                                                                                                                                                                                                                                                    |
| `builder`       | 以 `<package-name>:<builder-name>` 形式建立此目標的 CLI 建構工具。                                                                                                                                                             |
| `options`       | 建置目標預設選項。                                                                                                                                                                                                                          |
| `configurations`| 執行目標的替代組態。每個組態設定預設的選項，讓該預期環境覆寫 `options` 下的關聯值。請參閱下方的 [替代建置組態](#alternate-build-configs)。 |

例如，要配置停用最佳化項目的建置：

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

### 替代建構配置

Angular CLI 提供兩種建置設定檔：`production` 和 `development`。
預設情況下，`ng build` 指令會使用 `production` 設定檔，它會套用多項建置最佳化，包括：

* 捆綁檔案
* 最小化多餘的空白
* 移出註解和無用程式碼
* 縮小程式碼以使用簡短、混淆的名稱

您可以定義並命名額外的替代設定 (例如 `staging`)，以符合您的開發流程。
您可以透過將其名稱傳遞給 `--configuration` 命令列旗標，來選擇替代設定。

例如，要配置一個僅在生產版本中啟用最佳化的版本 (`ng build --configuration production`)：

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

您也可以傳入多個設定檔名稱作為以逗號分隔的清單。
例如，若要套用 `staging` 和 `french` 建置設定檔，請使用指令 `ng build --configuration staging,french`。
在這種情況下，此指令會由左至右分析已命名的設定檔。
如果多個設定檔變更相同的設定，最後設定的值會是最終值。
在此範例中，如果 `staging` 和 `french` 設定檔都設定輸出路徑，則會使用 `french` 中的值。

### 其他編譯和測試選項

預設或目標建置的可設定選項通常與 [`ng build`](cli/build)、[`ng serve`](cli/serve) 和 [`ng test`](cli/test) 命令可用的選項相同。
有關這些選項及其可能值的詳細資訊，請參閱 [Angular CLI 參考](cli)。

| 選項屬性         | 詳細資訊                                                                                                                                                                                                                                                                |
|:---                        |:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`                   | 包含要與應用程式一起提供的靜態資源路徑的物件。預設路徑指向專案的圖示檔案及其 `assets` 目錄。詳情請參閱 [資產配置](#資產配置) 部分。                                                                                                                                 |
| `styles`                   | 要新增至專案的全球內容的 CSS 檔案陣列。Angular CLI 支援 CSS 匯入和所有主要的 CSS 預處理器。詳情請參閱 [樣式和指令碼配置](#樣式和指令碼配置) 部分。                                                                                               |
| `stylePreprocessorOptions` | 包含要傳遞至樣式預處理器的選項值配對的物件。詳情請參閱 [樣式和指令碼配置](#樣式和指令碼配置) 部分。                                                                                                                                                            |
| `scripts`                  | 包含要新增至應用的 JavaScript 檔案的物件。載入指令碼的方式就像在 `index.html` 內的 `<script>` 標籤中新增指令碼一樣。詳情請參閱 [樣式和指令碼配置](#樣式和指令碼配置) 部分。                                                               |
| `budgets`                  | 所有應用程式或其部分的預設大小預算類型和閾值。您可以將建置器配置為在輸出達到或超過閾值大小時報告警告或錯誤。請參閱 [配置大小預算](tools/cli/build#configure-size-budgets)。                                                                  |
| `fileReplacements`         | 包含檔案及其編譯時替換的物件。詳情請參閱 [配置目標特定檔案替換](tools/cli/build#configure-target-specific-file-replacements)。                                                                                                                                           |
| `index`                    | 載入應用的基本 HTML 文件。詳情請參閱 [索引配置](#索引配置)。                                                                                                                                                                                                  |

## 複雜的組態值

`assets`、`index`、`outputPath`、`styles` 和 `scripts` 選項可以具有簡單的路徑字串值或具有特定欄位的物件值。

`sourceMap` 和 `optimization` 選項可以設定為簡單的布林值。也可以使用設定檔給予複雜的值。

以下各節提供更多詳細資料說明這些複雜值如何在每種情況下使用。

### 資產配置

每個 `build` 目標設定可以包含一個 `assets` 陣列，列出在建置專案時想要原樣複製的檔案或資料夾。
預設情況下，`src/assets/` 目錄和 `src/favicon.ico` 會被複製。

要排除資產，您可以從資產設定中將其移除。

您可以進一步配置要複製的資產，方法是將資產指定為物件，而不是作為相對於工作區根目錄的簡單路徑。
資產規格物件可以具有下列欄位。

| 欄位           | 詳細                                                                                                                                   |
|:---              |:---                                                                                                                                       |
| `glob`           | 使用 `input` 作為基本目錄的 [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md)。                                 |
| `input`          | 相對於工作區根目錄的路徑。                                                                                                    |
| `output`         | 相對於 `outDir` 的路徑。由於安全性考量，Angular CLI 永遠不會在專案輸出路徑以外的位置寫入檔案。                               |
| `ignore`         | 要排除的 glob 清單。                                                                                                               |
| `followSymlinks` | 允許 glob 模式遵循符號連結目錄。這允許搜尋符號連結的子目錄。預設為 `false`。                                     |

例如，可以使用以下物件更詳細地表示預設資源路徑。

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

以下範例使用 `ignore` 欄位，將資產目錄中的特定檔案排除，不複製到組建中：

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

### 樣式和腳本配置

`styles` 和 `scripts` 選項的陣列項目可以是簡單的路徑字串，或指向額外進入點檔案的物件。
關聯的建構器在建置期間將該檔案及其依賴項載入為一個獨立的套件。
使用組態物件時，您可以使用 `bundleName` 欄位為進入點命名套件。

預設會注入此捆綁，但您可以將 `inject` 設為 `false` 以排除此捆綁的注入。
例如，下列物件值會建立並命名一個包含樣式和指令碼的捆綁，並將其排除於注入之外：

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

在 Sass 中，您可以同時對元件和全域樣式使用 `includePaths` 功能。這允許您新增會檢查匯入的額外基本路徑。

要新增路徑，請使用 `stylePreprocessorOptions` 選項：

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

該目錄中的檔案，例如 `src/style-paths/_variables.scss`，可以從專案中的任何位置匯入，而不需要相對路徑：

<docs-code language="scss">

// src/app/app.component.scss
// A relative path works
@import '../style-paths/variables';

// But now this works as well
@import 'variables';

</docs-code>

HELPFUL：如果您需要單元測試，您也需要將任何樣式或腳本加入 `test` 建構器。
另請參閱 [在應用程式內使用執行時期全域函式庫](tools/libraries/using-libraries#using-runtime-global-libraries-inside-your-app)。

### 最佳化配置

`optimization` 選項可以是布林值或用於更精細調整配置的物件。
此選項啟用建置輸出的各種最佳化，包括：

* 腳本和樣式的最小化
* Tree-shaking
* 死碼消除
* 內嵌關鍵 CSS
* 內嵌字型

應用程式的優化可以透過多種選項來微調。

| 選項   | 詳細資訊                                                        | 值類型                                                                     | 預設值 |
|:---       |:---                                                            |:---                                                                            |:---           |
| `scripts` | 啟用腳本輸出的最佳化。                                    | `boolean`                                                                      | `true`        |
| `styles`  | 啟用樣式輸出的最佳化。                                    | `boolean` &verbar; [樣式最佳化選項](#styles-optimization-options) | `true`        |
| `fonts`   | 啟用字體的最佳化。這需要網路連線。                     | `boolean` &verbar; [字體最佳化選項](#fonts-optimization-options)   | `true`        |

#### 樣式優化選項

| 選項          | 詳細資訊                                                                                                               | 值類型 | 預設值 |
|:---              |:---                                                                                                                   |:---        |:---           |
| `minify`         | 移除不必要的空白和註解、合併識別符號，並將值最小化，以壓縮 CSS 定義。                                            | `boolean`  | `true`        |
| `inlineCritical` | 萃取和內嵌關鍵的 CSS 定義，以改善 [首次內容繪製](https://web.dev/first-contentful-paint)。                | `boolean`  | `true`        |
| `removeSpecialComments` | 移除包含 `@license` 或 `@preserve` 或以 `//!` 或 `/*!` 開頭的全局 CSS 中的註解。                            | `boolean`  | `true`        |

#### 字體優化選項

| 選項  | 詳細資料                                                                                                                                                                                                             | 值類型 | 預設值 |
|:---      |:---                                                                                                                                                                                                                 |:---        |:---           |
| `inline` | 透過將外部 Google 字體和 Adobe 字體 CSS 定義內嵌在應用程式的 HTML 索引檔案中，減少[阻礙呈現的請求](https://web.dev/render-blocking-resources)。這需要網路連線。 | `布林值`  | `true`        |

您可以提供以下值以將最佳化套用至其中一個或另一個：

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

### Source map 組態

`sourceMap` 建置工具選項可以是布林值或物件以進行更精確的調整設定，以控制應用程式的來原始碼。

| 選項   | 詳細                                             | 值類型 | 預設值 |
|:---       |:---                                                 |:---        |:---           |
| `scripts` | 輸出所有腳本的原始碼映射。                 | `boolean`  | `true`        |
| `styles`  | 輸出所有樣式的原始碼映射。                  | `boolean`  | `true`        |
| `vendor`  | 解析供應商套件的原始碼映射。                | `boolean`  | `false`       |
| `hidden`  | 從輸出 JavaScript 中省略連結至原始碼映射。 | `boolean`  | `false`       |

以下範例顯示如何切換一個或多個值來設定來源地圖輸出：

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

HELPFUL：使用隱藏的原始碼映射時，原始碼映射不會在套件中被參照。
如果您只希望原始碼映射將堆疊追蹤映射到錯誤報告工具中，而不顯示在瀏覽器開發人員工具中，那這將很有用。
請注意，即使 `hidden` 阻止原始碼映射在輸出套件中被連結，您的部署程序也必須注意不要在生產環境中提供生成的原始碼映射，否則資訊仍會洩露。

### 索引配置

設定產生該應用程式的 HTML 索引。

`index` 選項可以是字串或物件，以進行更精確的設定。

當以字串提供值時，指定路徑的文件名將用於生成的檔案，且將在應用程式設定的輸出路徑的根目錄中建立。

#### 索引選項

| 選項  | 詳細資訊                                                                                                                                                                        | 值類型 | 預設值   |
|:---      |:---                                                                                                                                                                            |:---        |:---             |
| `input`  | 要用於應用程式產生的 HTML 索引的檔案路徑。                                                                                                                                       | `string`   | 無 (必填) |
| `output` | 應用程式產生的 HTML 索引檔案的輸出路徑。將使用提供的完整路徑，並視為相對於應用程式設定的輸出路徑。                                                                            | `string`   | `index.html`    |

### 輸出路徑設定

`outputPath` 選項可以是字串，將用作 `base` 值，或是用於更精細的調整設定的物件。

可使用多個選項來微調應用程式的輸出結構。

| 選項   | 詳細資料                                                                            | 值類型 | 預設值 |
|:---       |:---                                                                                |:---        |:---           |
| `base`    | 指定相對於工作區根目錄的輸出路徑。                                | `string`   |               |
| `browser` | 瀏覽器建置的輸出目錄名稱位於基本輸出路徑內。這可以安全地提供給使用者。       | `string`   | `browser`     |
| `server`  | 輸出路徑基本目錄中的伺服器建置的輸出目錄名稱。        | `string`   | `server`      |
| `media`   | 位於輸出瀏覽器目錄中的媒體檔案的輸出目錄名稱。這些媒體檔案通常在 CSS 檔案中稱為資源。 | `string`   | `media`       |
