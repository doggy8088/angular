# Angular CLI builders

許多 Angular CLI 指令會對您的程式碼執行複雜的程序，例如建置、測試或提供您的應用程式。
這些指令使用一個稱為 Architect 的內部工具來執行 *CLI 建構器*，其會呼叫另一個工具 (打包器、測試執行器、伺服器) 以完成所需的工作。
自訂建構器可以執行一個完全新的工作，或變更現有指令使用的第三方工具。

以下文件說明 CLI 建構器如何與工作區設定檔整合，並展示如何建立自己的建構器。

有用的：在此處找到在範例中使用的程式碼 [GitHub 儲存庫](https://github.com/mgechev/cli-builders-demo)。

## CLI 建構器

內部 Architect 工具將工作委託給稱為「建構函數」的處理函數。
建構函數處理函數會收到兩個引數：

| 參數  | 類型             |
|:---       |:---              |
| `options` | `JSONObject`     |
| `context` | `BuilderContext` |

在這裡，區分責任與 [schematics](tools/cli/schematics-authoring) 相同，後者用於觸及您的程式碼的其他 CLI 命令（例如 `ng generate`）。

* `options` 物件是由 CLI 使用者選項與組態提供，而 `context` 物件則由 CLI Builder API 自動提供。
* 除了上下文資訊之外，`context` 物件也提供存取排程方法 `context.scheduleTarget()`。
    排程器使用指定的目標組態執行 builder 處理函數。

建構器處理函數可以是同步（傳回值）、非同步（傳回 `Promise`）或監看並傳回多個值（傳回 `Observable`）。
傳回值必須永遠是 `BuilderOutput` 類型。
此物件包含一個布林 `success` 欄位和一個可以包含錯誤訊息的選用 `error` 欄位。

Angular 提供了一些建構器，CLI 使用這些建構器來執行 `ng build` 和 `ng test` 等指令。
可以在 [工作區組態檔](reference/configs/workspace-config) `angular.json` 的「architect」區段中找到並組態這些與其他內建 CLI 建構器的預設目標組態。
另外，您可以透過建立自己的建構器來延伸並自訂 Angular，您可以使用 [`ng run` CLI 指令](cli/run) 直接執行這些建構器。

### 建構器項目結構

建構器位於與 Angular 工作空間結構類似的「專案」資料夾中，其中頂層有全域組態檔案，在包含定義行為的程式碼檔案的來源資料夾中則有更明確的組態。
例如，`myBuilder` 資料夾可以包含下列檔案。

| 檔案                    | 目的                                                                                                        |
|:---                      | :---                                                                                                           |
| `src/my-builder.ts`      | 建構器定義的主要來源檔案。                                                                                  |
| `src/my-builder.spec.ts` | 測試的來源檔案。                                                                                            |
| `src/schema.json`        | 建構器輸入選項的定義。                                                                                    |
| `builders.json`          | 建構器定義。                                                                                                |
| `package.json`           | 相依性。請參閱 [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json)。 |
| `tsconfig.json`          | [TypeScript 組態](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                         |

建造器可以發佈到 `npm`，請參閱 [發佈您的庫](tools/libraries/creating-libraries)。

## 建立一個 builder

作為範例，建立一個將檔案複製到新位置的建構器。
若要建立建構器，請使用 `createBuilder()` CLI 建構器函數，並傳回 `Promise<BuilderOutput>` 物件。

<docs-code header="src/my-builder.ts (builder skeleton)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder-skeleton"/>

現在讓我們添加一些邏輯於其中。
以下程式碼從使用者選項中擷取來源和目的地檔案路徑，並將檔案從來源複製到目的地（使用內建 NodeJS `copyFile()` 函數的 [Promise 版本](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)）。
如果複製操作失敗，它會傳回一個包含關於底層問題訊息的錯誤。

<docs-code header="src/my-builder.ts (builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder"/>

### 處理輸出

預設情況下，`copyFile()` 沒有將任何內容列印到程序標準輸出或錯誤。
如果發生錯誤，可能很難確切理解在問題發生時建構器嘗試執行什麼。
使用 `Logger` API 記錄其他資訊，以新增一些其他內容。
這也讓建構器本身在獨立程序中執行，即使標準輸出和錯誤已停用。

你可以從內容中擷取 `Logger` 實例。

<docs-code header="src/my-builder.ts (handling output)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="handling-output"/>

### 進度與狀態回報

CLI Builder API 包含進度和狀態報告工具，可以為某些函式和介面提供提示。

要回報進度，請使用 `context.reportProgress()` 方法，它需要目前值、可選總計和狀態字串做為參數。
總計可以是任何數字。例如，如果您知道要處理多少個檔案，總計可以是檔案數目，而目前則應該是到目前為止已處理的數目。
除非您傳入新的字串值，否則狀態字串不變。

在我們的範例中，複製作業不是已完成就是仍在執行，所以不需要進度報告，但您可以報告狀態，以便呼叫我們建構函數的父建構函數知道正在發生什麼事。
使用 `context.reportStatus()` 方法來產生任何長度的狀態字串。

HELPFUL: 無法保證會完整顯示長字串；它可能會被裁剪以符合顯示它的 UI。

傳遞一個空字串來移除狀態。

<docs-code header="src/my-builder.ts (progress reporting)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="progress-reporting"/>

## Builder 輸入

您可以透過 CLI 指令（例如 `ng build`）或直接透過 Angular CLI `ng run` 指令間接呼叫建構器。
無論是哪一種情況，您都必須提供必要的輸入，但可以讓其他輸入預設為針對特定 *目標* 預先設定的值，該目標由 [設定檔](tools/cli/environments) 指定，或在命令列中設定。

### 輸入驗證

您在與該建構函式相關聯的 JSON 架構中定義建構函式輸入。
類似於架構，Architect 工具將解析的輸入值收集到 `options` 物件中，並在將其傳遞給建構函式函數之前根據架構驗證其類型。

對於我們的範例建構函式，`options` 應為一個具有兩個鍵值的 `JsonObject`：
一個 `source` 和一個 `destination`，它們都是字串。

您可以提供下列 schema 以對這些值的類型進行驗證。

<docs-code header="src/schema.json" language="json">

{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "source": {
      "type": "string"
    },
    "destination": {
      "type": "string"
    }
  }
}

</docs-code>

HELPFUL：這是一個最小的範例，但驗證架構的使用非常強大。
欲了解更多資訊，請參閱 [JSON 架構網站](http://json-schema.org)。

若要將我們的建置器實作與其架構和名稱連結，您需要建立一個 *建置器定義* 檔案，您可以在 `package.json` 中指向該檔案。

建立一個名為 `builders.json` 的檔案，看起來像這樣：

<docs-code header="builders.json" language="json">

{
  "builders": {
    "copy": {
      "implementation": "./dist/my-builder.js",
      "schema": "./src/schema.json",
      "description": "Copies a file."
    }
  }
}

</docs-code>

在 `package.json` 檔案中，加入一個 `builders` 鍵，告訴 Architect 工具在哪裡可以找到我們的 builder 定義檔案。

<docs-code header="package.json" language="json">

{
  "name": "@example/copy-file",
  "version": "1.0.0",
  "description": "Builder for copying files",
  "builders": "builders.json",
  "dependencies": {
    "@angular-devkit/architect": "~0.1200.0",
    "@angular-devkit/core": "^12.0.0"
  }
}

</docs-code>

我們的建構器的正式名稱現在是 `@example/copy-file:copy`。
此名稱的第一部分是套件名稱，第二部分是建構器名稱，如 `builders.json` 檔案中所指定。

這些值可透過 `options.source` 和 `options.destination` 存取。

<docs-code header="src/my-builder.ts (report status)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="report-status"/>

### 目標設定

建築商必須有定義的目標，將其與特定的輸入配置和專案關聯起來。

目標定義在 `angular.json` [CLI 組態檔](reference/configs/workspace-config)中。
目標指定要使用的建構器、其預設選項組態，以及命名的替代組態。
Angular CLI 中的 Architect 使用目標定義來解析給定執行項目的輸入選項。

`angular.json` 檔案對每個專案皆有一區段，且每個專案的「architect」區段會設定 CLI 命令（例如「build」、「test」和「serve」）使用的建構函式目標。
例如，預設情況下，`ng build` 命令會執行建構函式 `@angular-devkit/build-angular:browser` 以執行建置工作，並傳入 `angular.json` 中 `build` 目標所指定的預設選項值。

<docs-code header="angular.json" language="json">

&hellip;

"myApp": {
  &hellip;
  "architect": {
    "build": {
      "builder": "@angular-devkit/build-angular:browser",
      "options": {
        "outputPath": "dist/myApp",
        "index": "src/index.html",
        &hellip;
      },
      "configurations": {
        "production": {
          "fileReplacements": [
            {
              "replace": "src/environments/environment.ts",
              "with": "src/environments/environment.prod.ts"
            }
          ],
          "optimization": true,
          "outputHashing": "all",
          &hellip;
        }
      }
    },
    &hellip;
  }
}

&hellip;

</docs-code>

該命令傳遞給建構器在「選項」區段中指定的一組預設選項。
如果您傳遞 `--configuration=production` 旗標，它會使用在 `production` 組態中指定的值來覆寫。
在命令列中個別指定進一步的覆寫選項。

#### 目標字串

通用 `ng run` CLI 命令以以下形式作為第一個引數目標字串。

<docs-code language="shell">

project:target[:configuration]

</docs-code>

|               | 詳細資料 |
|:---           |:---     |
| 專案       | 與目標相關聯的 Angular CLI 專案名稱。                                                                   |
| 目標        | `angular.json` 檔案 `architect` 區段中指定的名稱建構器設定。                                         |
| 設定檔 | （選用）`angular.json` 檔案中定義的指定目標的特定設定檔覆寫名稱。                                   |

如果您的建構器呼叫其他建構器，可能需要讀取已傳遞的 target 字串。
使用 `@angular-devkit/architect` 中的 `targetFromTargetString()` 實用程式函數，將此字串解析成物件。

## 時間表和執行

Architect 非同步執行 Builder。
若要呼叫 Builder，您必須在所有設定解析完成時安排要執行的任務。

建構函數不會執行，直到排程器回傳 `BuilderRun` 控制物件。
CLI 通常透過呼叫 `context.scheduleTarget()` 函數來排程工作，然後使用 `angular.json` 檔案中的目標定義來解析輸入選項。

Architect 會透過採用預設選項物件、覆寫組態中的值，然後進一步覆寫傳遞給 `context.scheduleTarget()` 的覆寫物件，來為給定目標解析輸入選項。
對於 Angular CLI，覆寫物件是從命令列參數建構而來。

Architect 驗證產生的選項值符合建構器的架構。
如果輸入有效，Architect 會建立內容並執行建構器。

有關更多資訊，請參閱 [Workspace Configuration](reference/configs/workspace-config)。

HELPFUL：您也可以透過呼叫 `context.scheduleBuilder()` 從其他建構函式或測試直接呼叫建構函式。
您可以直接將 `options` 物件傳遞給方法，並且這些選項值會根據建構函式的架構進行驗證，而沒有進一步調整。

只有 `context.scheduleTarget()` 方法會解析設定檔並覆寫 `angular.json` 檔案。

### 預設架構配置

讓我們建立一個簡單的 `angular.json` 檔案，以將目標設定放入內容中。

你可以將建置工具發佈到 npm（請參閱 [發佈你的函式庫](tools/libraries/creating-libraries#publishing-your-library)），並使用以下指令進行安裝：

<docs-code language="shell">

npm install &commat;example/copy-file

</docs-code>

如果你使用 `ng new builder-test` 建立新專案，產生的 `angular.json` 檔案看起來會像這樣，只有預設的建構器組態。

<docs-code header="angular.json" language="json">

{
  "projects": {
    "builder-test": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // more options...
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              // more options...
              "optimization": true,
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}

</docs-code>

### 添加目標

新增一個目標，執行我們的建構器來複製檔案。
此目標告訴建構器複製 `package.json` 檔案。

* 我們將為我們的專案新增一個目標區段至 `architect` 物件
* 名稱為 `copy-package` 的目標使用我們的建構器，您已發佈至 `@example/copy-file`。
* 選項物件提供您定義的兩個輸入的預設值。
  * `source` - 您要複製的現有檔案。
  * `destination` - 您要複製到的路徑。

<docs-code header="angular.json" language="json">

{
  "projects": {
    "builder-test": {
      "architect": {
        "copy-package": {
          "builder": "@example/copy-file:copy",
          "options": {
            "source": "package.json",
            "destination": "package-copy.json"
          }
        },

        // Existing targets...
      }
    }

}
}

</docs-code>

### 運行建構器

如要使用新的目標預設組態來執行我們的建構器，請使用下列 CLI 命令。

<docs-code language="shell">

ng run builder-test:copy-package

</docs-code>

這會將 `package.json` 檔案複製到 `package-copy.json`。

使用命令列引數來覆寫已設定的預設值。
例如，要使用不同的 `destination` 值執行，請使用以下 CLI 命令。

<docs-code language="shell">

ng run builder-test:copy-package --destination=package-other.json

</docs-code>

這樣會將檔案複製到 `package-other.json`，而不是 `package-copy.json`。
由於你沒有覆寫 *來源* 選項，它仍會從預設的 `package.json` 檔案複製。

## 測試建構器

為您的 Builder 使用整合測試，以便您可以使用 Architect 排程器建立一個背景，就像在這個 [範例](https://github.com/mgechev/cli-builders-demo) 中一樣。
在 builder 原始碼目錄中，建立一個新的測試檔案 `my-builder.spec.ts`。測試會建立 `JsonSchemaRegistry`（用於 schema 驗證）、`TestingArchitectHost`（`ArchitectHost` 的記憶體實作）和 `Architect` 的新執行個體。

以下是一個執行複製檔案建構器的測試範例。
測試使用建構器複製 `package.json` 檔案，並驗證複製檔案的內容與來源相同。

<docs-code header="src/my-builder.spec.ts" path="adev/src/content/examples/cli-builder/src/my-builder.spec.ts"/>

HELPFUL：在儲存庫中執行此測試時，您需要[`ts-node`](https://github.com/TypeStrong/ts-node) 套件。
您可以透過將 `my-builder.spec.ts` 重新命名為 `my-builder.spec.js` 來避免此情況。

### 觀察模式

大多數 builder 執行一次並回傳。然而，此行為與監控變更的 builder（例如 devserver）並不完全相容。
Architect 可以支援監控模式，但有一些事項要注意。

* 要與監看模式搭配使用，建構函數應該回傳一個 `Observable`。
    Architect 會訂閱 `Observable` 直到它完成，並且如果建構函數使用相同參數再次排程，可能會重複使用它。

* 建構函數應該在每次執行後發出一個 `BuilderOutput` 物件。
    執行後，它可以進入監看模式，由外部事件觸發。
    如果事件觸發它重新啟動，建構函數應該執行 `context.reportRunning()` 函數，以告訴 Architect 它正在再次執行。
    這會防止 Architect 在排程另一個執行時停止建構函數。

當您的建構器呼叫 `BuilderRun.stop()` 退出監控模式時，Architect 會取消訂閱建構器的 `Observable` 並呼叫建構器的清除邏輯以進行清理。
此行為還允許停止並清理長時間執行的建構。

一般來說，如果您的建置器正在監看外部事件，您應該將執行階段分成三個階段。

| 階段     | 詳細 |
|:---        |:---     |
| 正在執行    | 正在執行的工作，例如呼叫編譯器。當編譯器完成且您的建構器發出 `BuilderOutput` 物件時，此階段即結束。                                                                                                    |
| 正在觀察   | 在兩次執行之間，觀察外部事件串流。例如，觀察檔案系統是否有任何變更。當編譯器重新啟動，且呼叫 `context.reportRunning()` 時，此階段即結束。                                                                |
| 完成 | 工作已完全完成，例如需要執行多次的編譯器，或建構器執行已停止（使用 `BuilderRun.stop()`）。Architect 執行清除邏輯，並取消訂閱您建構器的 `Observable`。 |

## 摘要

CLI Builder API 提供了一種方法，可透過使用 builder 來執行自訂邏輯，以變更 Angular CLI 的行為。

* 建構工具可以是同步或非同步的，執行一次或監控外部事件，並且可以排程其他建構工具或目標。
* 建構工具在 `angular.json` 設定檔中指定選項預設值，這些預設值可以被目標的替代設定覆寫，且可以進一步被命令列標記覆寫
* Angular 團隊建議您使用整合測試來測試 Architect 建構工具。使用單元測試來驗證建構工具執行的邏輯。
* 如果您的建構工具傳回一個 `Observable`，它應該在該 `Observable` 的結束邏輯中清除建構工具。
