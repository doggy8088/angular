# Angular CLI 建置器

許多 Angular CLI 指令會對你的程式碼執行複雜的流程，例如 lint、建置或測試。這些指令使用一個名為 Architect 的內部工具來執行 *CLI 建置器*，建置器會套用另一個工具來完成所需的任務。

從 Angular 8 版開始，CLI Builder API 已穩定，可供想透過新增或修改指令來客製化 Angular CLI 的開發者使用。例如，你可以提供一個建置器來執行全新的任務，或變更既有指令所使用的第三方工具。

本文件說明 CLI 建置器如何與工作區設定檔整合，並示範如何建立你自己的建置器。

<div class="alert is-helpful">

這裡所用範例的程式碼可以在這個 [GitHub repository](https://github.com/mgechev/cli-builders-demo) 中找到。

</div>

## CLI 建置器

內部的 Architect 工具會把工作委派給稱為[*建置器*](guide/glossary#建置器builder)的處理函式。建置器處理函式接收兩個引數：一組輸入 `options`（一個 JSON 物件），以及一個 `context`（一個 `BuilderContext` 物件）。

這裡的關注點分離與[原理圖](guide/glossary#原理圖schematic)相同；原理圖用於其他會碰觸你的程式碼的 CLI 指令（例如 `ng generate`）。

*   `options` 物件由 CLI 使用者提供，而 `context` 物件由 CLI Builder API 提供
*   除了情境資訊之外，身為 `BuilderContext` 執行個體的 `context` 物件還提供一個排程方法 `context.scheduleTarget()`。排程器會以指定的[目標設定](guide/glossary#目標target)執行建置器處理函式。

建置器處理函式可以是同步的（回傳一個值）、非同步的（回傳 `Promise`），或以監看模式回傳多個值（回傳 `Observable`）。 回傳值必須永遠是 `BuilderOutput` 類型。 這個物件包含一個布林值 `success` 欄位，以及一個可選的 `error` 欄位，可放入錯誤訊息。

Angular 提供了一些建置器，供 CLI 用於 `ng build` 與 `ng test` 等指令。這些與其他內建 CLI 建置器的預設目標設定，可以在[工作區設定檔](guide/workspace-config) `angular.json` 的 "architect" 區段中找到（並客製化）。此外，你也可以建立自己的建置器來擴充與客製化 Angular，並使用 [`ng run` CLI 指令](cli/run)來執行它們。

### 建置器專案結構

建置器位於一個「專案」資料夾中，其結構與 Angular 工作區相似：最上層放全域設定檔，原始碼資料夾中則放更具體的設定與定義行為的程式碼檔案。 例如，你的 `myBuilder` 資料夾可能包含下列檔案。

| 檔案 | 用途 |
|:---                      | :---                                                                                                      |
| `src/my-builder.ts` | 建置器定義的主要原始碼檔案。 |
| `src/my-builder.spec.ts` | 測試用的原始碼檔案。 |
| `src/schema.json` | 建置器輸入選項的定義。 |
| `builders.json` | 建置器定義。 |
| `package.json` | 依賴。請參閱 [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json)。 |
| `tsconfig.json` | [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。 |

把建置器發佈到 `npm`（請參閱[發佈你的程式庫](guide/creating-libraries#發行你的程式庫)）。如果你把它發佈為 `&commat;example/my-builder`，請使用下列指令安裝它。

<code-example format="shell" language="shell">

npm install &commat;example/my-builder

</code-example>

## 建立建置器

舉例來說，我們來建立一個複製檔案的建置器。要建立建置器，請使用 `createBuilder()` CLI Builder 函式，並回傳一個 `Promise<BuilderOutput>` 物件。

<code-example header="src/my-builder.ts (builder skeleton)" path="cli-builder/src/my-builder.ts" region="builder-skeleton"></code-example>

現在為它加入一些邏輯。 下列程式碼從使用者選項中取得來源與目的地檔案路徑，並將檔案從來源複製到目的地（使用 [Promise 版本的 Node.js 內建 `copyFile()` 函式](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)）。 若複製操作失敗，它會回傳一個帶有底層問題訊息的錯誤。

<code-example header="src/my-builder.ts (builder)" path="cli-builder/src/my-builder.ts" region="builder"></code-example>

### 處理輸出

預設情況下，`copyFile()` 不會在處理程序的標準輸出或錯誤輸出印出任何內容。如果發生錯誤，可能很難理解建置器在問題發生時究竟想做什麼。請使用 `Logger` API 記錄額外資訊來補充情境。這也讓建置器本身可以在獨立的處理程序中執行，即使標準輸出與錯誤輸出已被停用（例如在 [Electron 應用程式](https://electronjs.org)中）。

你可以從 context 取得一個 `Logger` 實例。

<code-example header="src/my-builder.ts (handling output)" path="cli-builder/src/my-builder.ts" region="handling-output"></code-example>

### 進度與狀態回報

CLI Builder API 內含進度與狀態回報工具，可為特定函式與介面提供提示。

若要回報進度，使用 `context.reportProgress()` 方法，它接收目前值、可選的總數與狀態字串作為引數。 總數可以是任何數字。例如，若你知道需要處理多少檔案，總數可以是檔案數量，目前值則是已處理的數量。 狀態字串在你傳入新字串值之前不會被修改。

你可以看到 `tslint` 建置器如何回報進度的[範例](https://github.com/angular/angular-cli/blob/ba21c855c0c8b778005df01d4851b5a2176edc6f/packages/angular_devkit/build_angular/src/tslint/index.ts#L107)。

在我們的範例中，複製操作不是完成就是仍在執行，因此不需要進度回報，但你可以回報狀態，讓呼叫我們建置器的父建置器知道目前狀況。 使用 `context.reportStatus()` 方法來產生任意長度的狀態字串。

<div class="alert is-helpful">

注意：<br />
無法保證長字串會完整顯示；它可能會被截斷以配合顯示它的 UI。

</div>

傳入空字串即可移除狀態。

<code-example header="src/my-builder.ts (progress reporting)" path="cli-builder/src/my-builder.ts" region="progress-reporting"></code-example>

## 建置器輸入

你可以透過 CLI 指令間接呼叫建置器，或直接使用 Angular CLI 的 `ng run` 指令。在任何一種情況下，你都必須提供必要的輸入，但可以讓其他輸入使用為特定[*目標*](guide/glossary#目標target)預先設定的預設值、提供預先定義的具名覆寫設定，並在命令列上提供進一步的覆寫選項值。

### 輸入驗證

你在與該建置器關聯的 JSON 結構定義中定義建置器輸入。Architect 工具會把解析後的輸入值收集到 `options` 物件中，並在傳給建置器函式之前，依據結構定義驗證它們的型別。（Schematics 程式庫也會對使用者輸入做同樣的驗證。）

對於我們的範例建置器，你預期 `options` 值是一個 `JsonObject`，有兩個鍵：`source` 與 `destination`，兩者都是字串。

你可以提供下列 schema 來驗證這些值的類型。

<code-example header="src/schema.json" format="json" language="json">

{
  "&dollar;schema": "http://json-schema.org/schema",
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

</code-example>

<div class="alert is-helpful">

這是一個非常簡單的範例，但使用結構定義進行驗證可以非常強大。
更多資訊請參閱 [JSON schemas website](http://json-schema.org)。

</div>

若要將建置器實作與其 schema 及名稱連結起來，你需要建立一個_建置器定義_檔案，並在 `package.json` 中指向它。

建立一個名為 `builders.json` 的檔案，內容如下：

<code-example header="builders.json" format="json" language="json">

{
  "builders": {
    "copy": {
      "implementation": "./dist/my-builder.js",
      "schema": "./src/schema.json",
      "description": "Copies a file."
    }
  }
}

</code-example>

在 `package.json` 檔案中，加入一個 `builders` 鍵，告訴 Architect 工具去哪裡找我們的建置器定義檔。

<code-example header="package.json" format="json" language="json">

{
  "name": "&commat;example/copy-file",
  "version": "1.0.0",
  "description": "Builder for copying files",
  "builders": "builders.json",
  "dependencies": {
    "&commat;angular-devkit/architect": "~0.1200.0",
    "&commat;angular-devkit/core": "^12.0.0"
  }
}

</code-example>

我們建置器的正式名稱現在是 ` @example/copy-file:copy`。前半部是套件名稱（以 Node 解析方式解析），後半部是建置器名稱（以 `builders.json` 檔案解析）。

使用我們的某個 `options` 非常直觀。你在上一節存取 `options.source` 與 `options.destination` 時就是這麼做的。

<code-example header="src/my-builder.ts (report status)" path="cli-builder/src/my-builder.ts" region="report-status"></code-example>

### 目標設定

建置器必須有一個已定義的目標，將它與特定的輸入設定及[專案](guide/glossary#專案project)關聯起來。

目標是在 `angular.json` [CLI 設定檔](guide/workspace-config)中定義的。目標會指定要使用的建置器、它的預設選項設定，以及具名的替代設定。Architect 工具會使用目標定義，為指定的執行解析輸入選項。

`angular.json` 檔案為每個專案設有一區段，每個專案設定的 "architect" 區段則設定了供 CLI 指令（如 'build'、'test' 與 'serve'）使用的建置器目標。 例如，預設情況下，`build` 指令會執行建置器 `@angular-devkit/build-angular:browser` 來執行建置工作，並傳入 `angular.json` 中為 `build` 目標指定的預設選項值。

<code-example format="json" header="angular.json" language="json">
{
  "myApp": {
    &hellip;
    "architect": {
      "build": {
        "builder": "&commat;angular-devkit/build-angular:browser",
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

</code-example>

指令會把 "options" 區段中指定的預設選項集傳給建置器。如果你傳入 `--configuration=production` 旗標，它會使用 `production` 替代設定中指定的覆寫值。你也可以在命令列上個別指定進一步的選項覆寫。你也可以在 `build` 目標中加入更多替代設定，以定義 `stage` 或 `qa` 等其他環境。

#### 目標字串

通用的 `ng run` CLI 指令將目標字串作為第一個引數，其形式如下。

<code-example format="shell" language="shell">

project:target[:configuration]

</code-example>

| | 詳細資訊 |
|:---           |:---     |
| project | 與該目標相關聯的 Angular CLI 專案名稱。 |
| target | `angular.json` 檔案 "architect" 區段中具名的建置器設定。 |
| configuration | （可選）該目標的特定設定覆寫名稱，定義於 `angular.json` 檔案中。 |

若你的建置器呼叫另一個建置器，它可能需要讀取傳入的目標字串。 使用 `@angular-devkit/architect` 的 `targetFromTargetString()` 工具函式，將這個字串解析成物件。

## 排程與執行

Architect 以非同步方式執行建置器。 若要呼叫建置器，你排程一個工作，待所有設定解析完成後執行。

在排程器回傳 `BuilderRun` 控制物件之前，建置器函式不會被執行。 CLI 通常會呼叫 `context.scheduleTarget()` 函式來排程工作，然後使用 `angular.json` 檔案中的目標定義來解析輸入選項。

Architect 解析指定目標的輸入選項時，會先取預設選項物件，接著以設定的值覆寫，再以傳給 `context.scheduleTarget()` 的覆寫物件的值進一步覆寫。 對 Angular CLI 而言，覆寫物件是由命令列引數建立的。

Architect 會依建置器的 schema 驗證解析後的選項值。 若輸入有效，Architect 會建立 context 並執行建置器。

更多資訊請參閱[工作區設定](guide/workspace-config)。

<div class="alert is-helpful">

你也可以呼叫 `context.scheduleBuilder()`，直接從另一個建置器或測試中叫用建置器。
你可以直接把 `options` 物件傳給該方法，這些選項值會直接依照建置器的結構定義進行驗證，不再進一步調整。

只有 `context.scheduleTarget()` 方法會透過 `angular.json` 檔案解析設定與覆寫。

</div>

### 預設 Architect 設定

我們來建立一個簡單的 `angular.json` 檔案，將目標設定放入情境中。

你可以將建置器發佈到 npm（請參閱[發佈你的程式庫](guide/creating-libraries#發行你的程式庫)），並使用下列指令安裝它：

<code-example format="shell" language="shell">

npm install &commat;example/copy-file

</code-example>

若你用 `ng new builder-test` 建立新專案，產生的 `angular.json` 檔案大致如下，只有預設的建置器設定。

<code-example format="json" header="angular.json" language="json">

{
  // &hellip;
  "projects": {
    // &hellip;
    "builder-test": {
      // &hellip;
      "architect": {
        // &hellip;
        "build": {
          "builder": "&commat;angular-devkit/build-angular:browser",
          "options": {
            // &hellip; more options&hellip;
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              // &hellip; more options&hellip;
              "optimization": true,
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
  // &hellip;
}

</code-example>

### 新增目標

新增一個會執行我們建置器來複製檔案的目標。 這個目標告訴建置器複製 `package.json` 檔案。

你需要更新 `angular.json` 檔案，在我們新專案的 "architect" 區段中為這個建置器加入一個目標。

*   我們會在專案的 `architect` 物件中新增一段目標區段
*   名為 "copy-package" 的目標使用我們的建置器，也就是你發佈到 `@example/copy-file` 的那個。（請參閱[發佈你的程式庫](guide/creating-libraries#發行你的程式庫)。）

*   options 物件為你定義的兩個輸入提供預設值：`source` 是你要複製的既有檔案，`destination` 是你要複製到的路徑
*   `configurations` 鍵是選用的，我們現在先省略它

<code-example format="json" header="angular.json" language="json">

{
  "projects": {
    "builder-test": {
      "architect": {
        "copy-package": {
          "builder": "&commat;example/copy-file:copy",
          "options": {
            "source": "package.json",
            "destination": "package-copy.json"
          }
        },
        "build": {
          "builder": "&commat;angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
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
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}

</code-example>

### 執行建置器

若要以新目標的預設設定執行我們的建置器，使用下列 CLI 指令。

<code-example format="shell" language="shell">

ng run builder-test:copy-package

</code-example>

這會將 `package.json` 檔案複製為 `package-copy.json`。

使用命令列引數來覆寫已設定的預設值。 例如，若要以不同的 `destination` 值執行，使用下列 CLI 指令。

<code-example format="shell" language="shell">

ng run builder-test:copy-package --destination=package-other.json

</code-example>

這會把檔案複製到 `package-other.json`，而不是 `package-copy.json`。因為你沒有覆寫 *source* 選項，它會從 `package.json` 檔案（為該目標提供的預設值）複製。

## 測試建置器

請為你的建置器使用整合測試，這樣你就能使用 Architect 排程器來建立情境，如這個[範例](https://github.com/mgechev/cli-builders-demo)所示。

*   在建置器來源目錄中，你建立了一個新的測試檔 `my-builder.spec.ts`。程式碼會建立 `JsonSchemaRegistry`（用於結構定義驗證）、`TestingArchitectHost`（`ArchitectHost` 的記憶體內實作）與 `Architect` 的新執行個體。

*   我們在建置器的 `package.json` 檔案旁邊加入了一個 `builders.json` 檔案，並修改套件檔案以指向它。

以下是一個執行複製檔案建置器的測試範例。 這個測試使用建置器複製 `package.json` 檔案，並驗證複製後檔案的內容與來源相同。

<code-example header="src/my-builder.spec.ts" path="cli-builder/src/my-builder.spec.ts"></code-example>

<div class="alert is-helpful">

在你的 repo 中執行這個測試時，你需要 [`ts-node`](https://github.com/TypeStrong/ts-node) 套件。
你可以把 `my-builder.spec.ts` 改名為 `my-builder.spec.js` 來避免這個需求。

</div>

### 監看模式

Architect 預期建置器執行一次（預設）後就回傳。這種行為與會監看變更的建置器（例如 Webpack）不完全相容。Architect 可以支援監看模式，但有一些事情需要注意。

*   若要在監看模式下使用，建置器處理函式應回傳一個 `Observable`。 Architect 會訂閱這個 `Observable` 直到它完成，若建置器以相同引數再次被排程，可能會重用它。

*   建置器應在每次執行後永遠發出一個 `BuilderOutput` 物件。 一旦執行過，它就可以進入監看模式，等待外部事件觸發。 若某個事件觸發它重新啟動，建置器應執行 `context.reportRunning()` 函式，告訴 Architect 它正在再次執行。 這可避免在另一次執行被排程時，Architect 停止這個建置器。

當你的建置器呼叫 `BuilderRun.stop()` 退出監看模式時，Architect 會取消訂閱建置器的 `Observable`，並呼叫建置器的 teardown 邏輯進行清理。 這種行為也讓長時間執行的建置可以被停止與清理。

一般而言，若你的建置器正在監看外部事件，你應將執行分成三個階段。

| 階段 | 詳細資訊 |
|:---        |:---     |
| 執行中 | 例如，webpack 正在編譯。當 webpack 完成且你的建置器發出 `BuilderOutput` 物件時結束。 |
| 監看中 | 在兩次執行之間，監看外部事件串流。例如，webpack 會監看檔案系統是否有任何變更。當 webpack 重新開始建置，且 `context.reportRunning()` 被呼叫時結束。接著回到步驟 1。 |
| 完成 | 任務已完全完成（例如，webpack 原本要執行多次），或建置器執行已停止（使用 `BuilderRun.stop()`）。接著會執行你的 teardown 邏輯，Architect 會取消訂閱你的建置器 Observable。 |

## 小結

CLI Builder API 提供了一種方式，透過建置器執行自訂邏輯，來改變 Angular CLI 的行為。

*   建置器可以是同步或非同步的，執行一次或監看外部事件，並能排程其他建置器或目標。
*   建置器的選項預設值在 `angular.json` 設定檔中指定，可被目標的替代設定覆寫，再被命令列旗標進一步覆寫

*   我們建議你使用整合測試來測試 Architect 建置器，並使用單元測試來驗證建置器執行的邏輯。

*   若你的建置器回傳 `Observable`，它應在該 `Observable` 的 teardown 邏輯中清理建置器。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
