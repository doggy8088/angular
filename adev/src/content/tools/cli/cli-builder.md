# Angular CLI 建置器

許多 Angular CLI 指令會在你的程式碼上執行複雜的程序，例如建置、測試或提供應用程式服務。
這些指令使用一個名為 Architect 的內部工具來執行 _CLI 建置器_，建置器會呼叫另一個工具（打包器、測試執行器、伺服器）來完成預定的工作。
自訂建置器可以執行全新的工作，或變更既有指令所使用的第三方工具。

本文件說明 CLI 建置器如何與工作區設定檔整合，並示範如何建立你自己的建置器。

HELPFUL: 本文範例使用的程式碼可在這個 [GitHub 儲存庫](https://github.com/mgechev/cli-builders-demo)中找到。

## CLI 建置器

內部的 Architect 工具將工作委派給稱為_建置器_的處理函式。
建置器處理函式接收兩個引數：

| 引數      | 類型             |
| :-------- | :--------------- |
| `options` | `JSONObject`     |
| `context` | `BuilderContext` |

這裡的關注點分離與[原理圖](tools/cli/schematics-authoring)相同；原理圖用於其他會碰觸你的程式碼的 CLI 指令（例如 `ng generate`）。

- `options` 物件由 CLI 使用者的選項與設定提供，而 `context` 物件則由 CLI Builder API 自動提供。
- 除了情境資訊外，`context` 物件還提供了一個排程方法 `context.scheduleTarget()`。
  排程器會以指定的目標設定執行建置器處理函式。

建置器處理函式可以是同步的（回傳一個值）、非同步的（回傳 `Promise`），或以監看模式回傳多個值（回傳 `Observable`）。
回傳值必須永遠是 `BuilderOutput` 類型。
這個物件包含一個布林值 `success` 欄位，以及一個可選的 `error` 欄位，可放入錯誤訊息。

Angular 提供了一些建置器，供 CLI 用於 `ng build` 與 `ng test` 等指令。
這些與其他內建 CLI 建置器的預設目標設定，可在[工作區設定檔](reference/configs/workspace-config) `angular.json` 的 "architect" 區段中找到並設定。
此外，你也可以建立自己的建置器來擴充與自訂 Angular，並使用 [`ng run` CLI 指令](cli/run)直接執行它們。

### 建置器專案結構

建置器位於一個「專案」資料夾中，其結構與 Angular 工作區相似：最上層放全域設定檔，原始碼資料夾中則放更具體的設定與定義行為的程式碼檔案。
例如，你的 `myBuilder` 資料夾可能包含下列檔案。

| 檔案                     | 用途                                                                                                      |
| :----------------------- | :-------------------------------------------------------------------------------------------------------- |
| `src/my-builder.ts`      | 建置器定義的主要原始碼檔案。                                                                              |
| `src/my-builder.spec.ts` | 測試用的原始碼檔案。                                                                                      |
| `src/schema.json`        | 建置器輸入選項的定義。                                                                                    |
| `builders.json`          | 建置器定義。                                                                                              |
| `package.json`           | 依賴。請參閱 [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json)。     |
| `tsconfig.json`          | [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                      |

建置器可以發佈到 `npm`，請參閱[發佈你的程式庫](tools/libraries/creating-libraries)。

## 建立建置器 {#creating-a-builder}

以範例來說，我們來建立一個將檔案複製到新位置的建置器。
若要建立建置器，使用 `createBuilder()` CLI Builder 函式，並回傳一個 `Promise<BuilderOutput>` 物件。

<docs-code header="src/my-builder.ts (builder skeleton)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder-skeleton"/>

現在為它加入一些邏輯。
下列程式碼從使用者選項中取得來源與目的地檔案路徑，並將檔案從來源複製到目的地（使用 [Promise 版本的 NodeJS 內建 `copyFile()` 函式](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)）。
若複製操作失敗，它會回傳一個帶有底層問題訊息的錯誤。

<docs-code header="src/my-builder.ts (builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder"/>

### 處理輸出

預設情況下，`copyFile()` 不會將任何內容輸出到程序的標準輸出或標準錯誤。
若發生錯誤，可能很難理解問題發生時建置器到底在做什麼。
使用 `Logger` API 記錄額外資訊，來補上更多情境。
這也能讓建置器本身在獨立的程序中執行，即使標準輸出與錯誤被停用也沒問題。

你可以從 context 取得一個 `Logger` 實例。

<docs-code header="src/my-builder.ts (handling output)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="handling-output"/>

### 進度與狀態回報

CLI Builder API 內含進度與狀態回報工具，可為特定函式與介面提供提示。

若要回報進度，使用 `context.reportProgress()` 方法，它接收目前值、可選的總數與狀態字串作為引數。
總數可以是任何數字。例如，若你知道需要處理多少檔案，總數可以是檔案數量，目前值則是已處理的數量。
狀態字串在你傳入新字串值之前不會被修改。

在我們的範例中，複製操作不是完成就是仍在執行，因此不需要進度回報，但你可以回報狀態，讓呼叫我們建置器的父建置器知道目前狀況。
使用 `context.reportStatus()` 方法來產生任意長度的狀態字串。

HELPFUL: 不保證長字串會完整顯示；它可能被截斷以符合顯示它的 UI。

傳入空字串即可移除狀態。

<docs-code header="src/my-builder.ts (progress reporting)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="progress-reporting"/>

## 建置器輸入

你可以透過 `ng build` 之類的 CLI 指令間接呼叫建置器，或用 Angular CLI 的 `ng run` 指令直接呼叫。
無論哪種情況，你都必須提供必要的輸入，但其他輸入可以預設為針對特定_目標_預先設定的值、以[設定](tools/cli/environments)指定的值，或在命令列上設定的值。

### 輸入驗證

你在與建置器相關聯的 JSON schema 中定義建置器輸入。
與原理圖類似，Architect 工具會將解析後的輸入值收集成一個 `options` 物件，並在傳給建置器函式之前，依 schema 驗證它們的類型。

以我們的範例建置器來說，`options` 應該是一個有兩個鍵的 `JsonObject`：
`source` 與 `destination`，兩者都是字串。

你可以提供下列 schema 來驗證這些值的類型。

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

HELPFUL: 這是最小範例，但用 schema 做驗證可以非常強大。
更多資訊請參閱 [JSON schemas 網站](http://json-schema.org)。

若要將建置器實作與其 schema 及名稱連結起來，你需要建立一個_建置器定義_檔案，並在 `package.json` 中指向它。

建立一個名為 `builders.json` 的檔案，內容如下：

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

在 `package.json` 檔案中，加入一個 `builders` 鍵，告訴 Architect 工具去哪裡找我們的建置器定義檔。

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

我們的建置器正式名稱現在是 `@example/copy-file:copy`。
第一部分是套件名稱，第二部分是 `builders.json` 檔案中指定的建置器名稱。

這些值可透過 `options.source` 與 `options.destination` 存取。

<docs-code header="src/my-builder.ts (report status)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="report-status"/>

### 目標設定

建置器必須有一個已定義的目標，將它與特定的輸入設定及專案相關聯。

目標定義在 `angular.json` [CLI 設定檔](reference/configs/workspace-config)中。
目標會指定要使用的建置器、它的預設選項設定，以及具名的替代設定。
Angular CLI 中的 Architect 會使用目標定義，來解析某次執行的輸入選項。

`angular.json` 檔案為每個專案設有一區段，每個專案設定的 "architect" 區段則設定了供 CLI 指令（如 'build'、'test' 與 'serve'）使用的建置器目標。
例如，預設情況下，`ng build` 指令會執行建置器 `@angular-devkit/build-angular:browser` 來執行建置工作，並傳入 `angular.json` 中為 `build` 目標指定的預設選項值。

<docs-code header="angular.json" language="json">

…

"myApp": {
…
"architect": {
"build": {
"builder": "@angular-devkit/build-angular:browser",
"options": {
"outputPath": "dist/myApp",
"index": "src/index.html",
…
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
…
}
}
},
…
}
}

…

</docs-code>

指令會將 "options" 區段中指定的預設選項集合傳給建置器。
若你傳入 `--configuration=production` 旗標，它會使用 `production` 設定中指定的覆寫值。
你也可以在命令列上個別指定更多的選項覆寫。

#### 目標字串

通用的 `ng run` CLI 指令將目標字串作為第一個引數，其形式如下。

```shell

project:target[:configuration]

```

|               | 詳細資訊                                                                                                      |
| :------------ | :-------------------------------------------------------------------------------------------------------------------- |
| project       | 與該目標相關聯的 Angular CLI 專案名稱。                                                                               |
| target        | `angular.json` 檔案 "architect" 區段中具名的建置器設定。                                                              |
| configuration | （可選）該目標的特定設定覆寫名稱，定義於 `angular.json` 檔案中。                                                      |

若你的建置器呼叫另一個建置器，它可能需要讀取傳入的目標字串。
使用 `@angular-devkit/architect` 的 `targetFromTargetString()` 工具函式，將這個字串解析成物件。

## 排程與執行

Architect 以非同步方式執行建置器。
若要呼叫建置器，你排程一個工作，待所有設定解析完成後執行。

在排程器回傳 `BuilderRun` 控制物件之前，建置器函式不會被執行。
CLI 通常會呼叫 `context.scheduleTarget()` 函式來排程工作，然後使用 `angular.json` 檔案中的目標定義來解析輸入選項。

Architect 解析指定目標的輸入選項時，會先取預設選項物件，接著以設定的值覆寫，再以傳給 `context.scheduleTarget()` 的覆寫物件的值進一步覆寫。
對 Angular CLI 而言，覆寫物件是由命令列引數建立的。

Architect 會依建置器的 schema 驗證解析後的選項值。
若輸入有效，Architect 會建立 context 並執行建置器。

更多資訊請參閱[工作區設定](reference/configs/workspace-config)。

HELPFUL: 你也可以透過呼叫 `context.scheduleBuilder()`，直接從另一個建置器或測試中呼叫建置器。
你直接將 `options` 物件傳給該方法，這些選項值會依建置器的 schema 驗證，不做進一步調整。

只有 `context.scheduleTarget()` 方法會透過 `angular.json` 檔案解析設定與覆寫。

### 預設 Architect 設定

我們來建立一個簡單的 `angular.json` 檔案，將目標設定放入情境中。

你可以將建置器發佈到 npm（請參閱[發佈你的程式庫](tools/libraries/creating-libraries#publishing-your-library)），並使用下列指令安裝它：

```shell

npm install @example/copy-file

```

若你用 `ng new builder-test` 建立新專案，產生的 `angular.json` 檔案大致如下，只有預設的建置器設定。

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

### 新增目標

新增一個會執行我們建置器來複製檔案的目標。
這個目標告訴建置器複製 `package.json` 檔案。

- 我們會在專案的 `architect` 物件中新增一段目標區段
- 名為 `copy-package` 的目標使用我們的建置器，你已將它發佈為 `@example/copy-file`。
- options 物件為你定義的兩個輸入提供預設值。
  - `source`：你要複製的既有檔案。
  - `destination`：你要複製到的路徑。

< header="angular.json" language="json">

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

### 執行建置器

若要以新目標的預設設定執行我們的建置器，使用下列 CLI 指令。

```shell

ng run builder-test:copy-package

```

這會將 `package.json` 檔案複製為 `package-copy.json`。

使用命令列引數來覆寫已設定的預設值。
例如，若要以不同的 `destination` 值執行，使用下列 CLI 指令。

```shell

ng run builder-test:copy-package --destination=package-other.json

```

這會改將檔案複製為 `package-other.json`，而不是 `package-copy.json`。
因為你沒有覆寫 _source_ 選項，它仍然會從預設的 `package.json` 檔案複製。

## 測試建置器

對你的建置器使用整合測試，這樣你就能使用 Architect 排程器建立 context，如這個[範例](https://github.com/mgechev/cli-builders-demo)所示。
在建置器原始碼目錄中，建立一個新的測試檔案 `my-builder.spec.ts`。這個測試會建立 `JsonSchemaRegistry`（用於 schema 驗證）、`TestingArchitectHost`（`ArchitectHost` 的記憶體內實作）與 `Architect` 的新實例。

以下是一個執行複製檔案建置器的測試範例。
這個測試使用建置器複製 `package.json` 檔案，並驗證複製後檔案的內容與來源相同。

<docs-code header="src/my-builder.spec.ts" path="adev/src/content/examples/cli-builder/src/my-builder.spec.ts"/>

HELPFUL: 在你的儲存庫中執行這個測試時，你需要 [`ts-node`](https://github.com/TypeStrong/ts-node) 套件。
你可以將 `my-builder.spec.ts` 重新命名為 `my-builder.spec.js` 來避免這個需求。

### 監看模式

大多數建置器執行一次後就回傳。然而，這種行為與會監看變更的建置器（例如開發伺服器）並不完全相容。
Architect 可以支援監看模式，但有一些需要注意的地方。

- 若要在監看模式下使用，建置器處理函式應回傳一個 `Observable`。
  Architect 會訂閱這個 `Observable` 直到它完成，若建置器以相同引數再次被排程，可能會重用它。

- 建置器應在每次執行後永遠發出一個 `BuilderOutput` 物件。
  一旦執行過，它就可以進入監看模式，等待外部事件觸發。
  若某個事件觸發它重新啟動，建置器應執行 `context.reportRunning()` 函式，告訴 Architect 它正在再次執行。
  這可避免在另一次執行被排程時，Architect 停止這個建置器。

當你的建置器呼叫 `BuilderRun.stop()` 退出監看模式時，Architect 會取消訂閱建置器的 `Observable`，並呼叫建置器的 teardown 邏輯進行清理。
這種行為也讓長時間執行的建置可以被停止與清理。

一般而言，若你的建置器正在監看外部事件，你應將執行分成三個階段。

| 階段       | 詳細資訊                                                                                                                                                                                                                                       |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 執行中     | 正在執行的工作，例如呼叫編譯器。當編譯器完成且你的建置器發出 `BuilderOutput` 物件時，此階段結束。                                                                                                                                           |
| 監看中     | 在兩次執行之間，監看外部事件串流。例如，監看檔案系統的任何變更。當編譯器重新啟動、且 `context.reportRunning()` 被呼叫時，此階段結束。                                                                                                       |
| 完成       | 任務已完全完成（例如某個需要執行多次的編譯器），或建置器執行已被停止（使用 `BuilderRun.stop()`）。Architect 會執行 teardown 邏輯，並取消訂閱你的建置器的 `Observable`。                                                                      |

## 摘要

CLI Builder API 提供了一種方式，透過建置器執行自訂邏輯，來改變 Angular CLI 的行為。

- 建置器可以是同步或非同步的，執行一次或監看外部事件，並能排程其他建置器或目標。
- 建置器的選項預設值在 `angular.json` 設定檔中指定，可被目標的替代設定覆寫，再被命令列旗標進一步覆寫
- Angular 團隊建議你使用整合測試來測試 Architect 建置器。使用單元測試來驗證建置器執行的邏輯。
- 若你的建置器回傳 `Observable`，它應在該 `Observable` 的 teardown 邏輯中清理建置器。
