# Angular CLI 建置器

許多 Angular CLI 指令會對你的程式碼執行複雜的流程，例如 lint、建置或測試。
這些指令使用一個名為 Architect 的內部工具來執行 *CLI 建置器*，建置器會套用另一個工具來完成所需的任務。

從 Angular 8 版開始，CLI Builder API 已穩定，可供想透過新增或修改指令來客製化 Angular CLI 的開發者使用。例如，你可以提供一個建置器來執行全新的任務，或變更既有指令所使用的第三方工具。

本文件說明 CLI 建置器如何與工作區設定檔整合，並示範如何建立你自己的建置器。

<div class="alert is-helpful">

   這裡所用範例的程式碼可以在 [這個 GitHub 儲存庫](https://github.com/mgechev/cli-builders-demo) 中找到。

</div>

## CLI 建置器

內部的 Architect 工具會把工作委派給稱為[*建置器*](guide/glossary#建置器（builder）)的處理函式。
建置器處理函式接收兩個引數：一組輸入 `options`（一個 JSON 物件），以及一個 `context`（一個 `BuilderContext` 物件）。

這裡的關注點分離與[原理圖](guide/glossary#原理圖（schematic）)相同；原理圖用於其他會碰觸你的程式碼的 CLI 指令（例如 `ng generate`）。

* 選項由 CLI 使用者給定，context 由 CLI Builder API 提供，同時也提供對 CLI Builder API 的存取，行為則由開發者提供。

* `BuilderContext` 物件提供排程方法 `BuilderContext.scheduleTarget()` 的存取途徑。排程器會以給定的[目標設定](guide/glossary#目標（target）)執行建置器處理函式。

建置器處理函式可以是同步的（回傳一個值）、非同步的（回傳 Promise），或以監看模式回傳多個值（回傳 Observable）。
回傳值必須永遠是 `BuilderOutput` 類型。
這個物件包含一個布林值 `success` 欄位，以及一個可選的 `error` 欄位，可放入錯誤訊息。

Angular 提供了一些建置器，供 CLI 用於 `ng build`、`ng test` 與 `ng lint` 等指令。
這些與其他內建 CLI 建置器的預設目標設定，可以在[工作區設定檔](guide/workspace-config) `angular.json` 的 "architect" 區段中找到（並客製化）。
此外，你也可以建立自己的建置器來擴充與客製化 Angular，並使用 [`ng run` CLI 指令](cli/run)來執行它們。

### 建置器專案結構

建置器位於一個「專案」資料夾中，其結構與 Angular 工作區相似：最上層放全域設定檔，原始碼資料夾中則放更具體的設定與定義行為的程式碼檔案。
例如，你的 `myBuilder` 資料夾可能包含下列檔案。

| FILES    | PURPOSE |
| :----------------------- | :------------------------------------------|
| `src/my-builder.ts`      | 建置器定義的主要原始碼檔案。 |
| `src/my-builder.spec.ts` | 測試用的原始碼檔案。 |
| `src/schema.json`        | 建置器輸入選項的定義。 |
| `builders.json`          | 測試設定。 |
| `package.json`           | 相依性。見 https://docs.npmjs.com/files/package.json。 |
| `tsconfig.json`          | [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。 |

把建置器發佈到 `npm`（請參閱[發佈你的程式庫](https://angular.io/guide/creating-libraries#publishing-your-library)）。如果你把它發佈為 `@example/my-builder`，請使用下列指令安裝它。

<code-example language="sh">

npm install @example/my-builder

</code-example>

## 建立建置器

舉例來說，我們來建立一個執行 shell 命令的建置器。
要建立建置器，請使用 `createBuilder()` CLI Builder 函式，並回傳一個 `BuilderOutput` 物件。

<code-example language="typescript" header="/command/index.ts">
import { BuilderOutput, createBuilder } from '@angular-devkit/architect';

export default createBuilder(_commandBuilder);

function _commandBuilder(
  options: JsonObject,
  context: BuilderContext,
  ): Promise<BuilderOutput> {
  ...
}

</code-example>

現在為它加入一些邏輯。
下列程式碼從使用者選項中取得命令與引數，啟動新的處理程序，並等待處理程序完成。
若處理程序成功（回傳碼為 0），便會解析回傳值。

<code-example language="typescript" header="/command/index.ts">
import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import * as childProcess from 'child_process';

export default createBuilder(_commandBuilder);

function _commandBuilder(
  options: JsonObject,
  context: BuilderContext,
): Promise<BuilderOutput> {
  const child = childProcess.spawn(options.command, options.args);
  return new Promise<BuilderOutput>(resolve => {
    child.on('close', code => {
      resolve({success: code === 0});
    });
  });
}

</code-example>

### 處理輸出

預設情況下，`spawn()` 方法會把所有內容輸出到處理程序的標準輸出與錯誤輸出。
為了讓測試與除錯更容易，我們可以改把輸出轉送到 CLI Builder 的記錄器。
這也讓建置器本身可以在獨立的處理程序中執行，即使標準輸出與錯誤輸出已被停用（例如在 [Electron 應用程式](https://electronjs.org/)中）。

我們可以從 context 取得一個 Logger 實例。

<code-example language="typescript" header="/command/index.ts">
import { BuilderOutput, createBuilder, BuilderContext } from '@angular-devkit/architect';
import * as childProcess from 'child_process';

export default createBuilder(_commandBuilder);

function _commandBuilder(
  options: JsonObject,
  context: BuilderContext,
): Promise<BuilderOutput> {
  const child = childProcess.spawn(options.command, options.args, {stdio: 'pipe'});
  child.stdout.on('data', (data) => {
    context.logger.info(data.toString());
  });
  child.stderr.on('data', (data) => {
    context.logger.error(data.toString());
  });

  return new Promise<BuilderOutput>(resolve => {
    child.on('close', code => {
      resolve({success: code === 0});
    });
  });
}

</code-example>

### 進度與狀態回報

CLI Builder API 內含進度與狀態回報工具，可為特定函式與介面提供提示。

若要回報進度，使用 `BuilderContext.reportProgress()` 方法，它接收目前值、可選的總數與狀態字串作為引數。
總數可以是任何數字。例如，若你知道需要處理多少檔案，總數可以是檔案數量，目前值則是已處理的數量。
狀態字串在你傳入新字串值之前不會被修改。

你可以看到 `tslint` 建置器如何回報進度的[範例](https://github.com/angular/angular-cli/blob/ba21c855c0c8b778005df01d4851b5a2176edc6f/packages/angular_devkit/build_angular/src/tslint/index.ts#L107)。

在我們的範例中，shell 命令不是完成就是仍在執行，因此不需要進度回報，但我們可以回報狀態，讓呼叫我們建置器的父建置器知道目前狀況。
使用 `BuilderContext.reportStatus()` 方法來產生任意長度的狀態字串。
（請注意，無法保證長字串會完整顯示；它可能會被截斷以配合顯示它的 UI。）
傳入空字串即可移除狀態。

<code-example language="typescript" header="/command/index.ts">
import { BuilderOutput, createBuilder, BuilderContext } from '@angular-devkit/architect';
import * as childProcess from 'child_process';

export default createBuilder(_commandBuilder);

function _commandBuilder(
  options: JsonObject,
  context: BuilderContext,
): Promise<BuilderOutput> {
  context.reportStatus(`Executing "${options.command}"...`);
  const child = childProcess.spawn(options.command, options.args, {stdio: 'pipe'});

  child.stdout.on('data', (data) => {
    context.logger.info(data.toString());
  });
  child.stderr.on('data', (data) => {
    context.logger.error(data.toString());
  });

  return new Promise<BuilderOutput>(resolve => {
    context.reportStatus(`Done.`);
    child.on('close', code => {
      resolve({success: code === 0});
    });
  });
}

</code-example>

## 建置器輸入

你可以透過 CLI 指令間接呼叫建置器，或直接使用 Angular CLI 的 `ng run` 指令。
在任何一種情況下，你都必須提供必要的輸入，但可以讓其他輸入使用為特定[*目標*](guide/glossary#目標（target）)預先設定的預設值、提供預先定義的具名覆寫設定，並在命令列上提供進一步的覆寫選項值。

### 輸入驗證

你在與該建置器關聯的 JSON 結構定義中定義建置器輸入。
Architect 工具會把解析後的輸入值收集到 `options` 物件中，並在傳給建置器函式之前，依據結構定義驗證它們的型別。
（Schematics 程式庫也會對使用者輸入做同樣的驗證。）

對於我們的範例建置器，我們預期 `options` 值是一個 `JsonObject`，有兩個鍵：`command` 是字串，`args` 是字串值的陣列。

我們可以提供下列 schema 來驗證這些值的類型。

<code-example language="json" header="command/schema.json">
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "command": {
      "type": "string"
    },
    "args": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}

</code-example>

<div class="alert is-helpful">

這是一個非常簡單的範例，但使用結構定義進行驗證可以非常強大。
更多資訊請參閱 [JSON schemas website](http://json-schema.org/)。

</div>

若要將建置器實作與其 schema 及名稱連結起來，我們需要建立一個*建置器定義*檔案，我們可以在 `package.json` 中指向它。

建立一個名為 `builders.json` 的檔案，外觀如下：

<code-example language="json" header="builders.json">

{
  "builders": {
    "command": {
      "implementation": "./command",
      "schema": "./command/schema.json",
      "description": "Runs any command line in the operating system."
    }
  }
}

</code-example>

在 `package.json` 檔案中，加入一個 `builders` 鍵，告訴 Architect 工具去哪裡找我們的建置器定義檔。

<code-example language="json" header="package.json">

{
  "name": "@example/command-runner",
  "version": "1.0.0",
  "description": "Builder for Command Runner",
  "builders": "builders.json",
  "devDependencies": {
    "@angular-devkit/architect": "^1.0.0"
  }
}

</code-example>

我們建置器的正式名稱現在是 ` @example/command-runner:command`。
前半部是套件名稱（以 Node 解析方式解析），後半部是建置器名稱（以 `builders.json` 檔案解析）。

使用我們的某個 `options` 非常直觀，我們在上一節存取 `options.command` 時就是這麼做的。

<code-example language="typescript" header="/command/index.ts">
    context.reportStatus(`Executing "${options.command}"...`);
    const child = childProcess.spawn(options.command, options.args, { stdio: 'pipe' });

</code-example>

### 目標設定

建置器必須有一個已定義的目標，將它與特定的輸入設定及[專案](guide/glossary#專案（project）)關聯起來。

目標是在 `angular.json` [CLI 設定檔](guide/workspace-config)中定義的。
目標會指定要使用的建置器、它的預設選項設定，以及具名的替代設定。
Architect 工具會使用目標定義，為指定的執行解析輸入選項。

`angular.json` 檔案為每個專案設有一區段，每個專案設定的 "architect" 區段則設定了供 CLI 指令（如 'build'、'test' 與 'lint'）使用的建置器目標。
例如，預設情況下，`build` 指令會執行建置器 `@angular-devkit/build-angular:browser` 來執行建置工作，並傳入 `angular.json` 中為 `build` 目標指定的預設選項值。

<code-example language="json" header="angular.json">
{
  "myApp": {
    ...
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:browser",
        "options": {
          "outputPath": "dist/myApp",
          "index": "src/index.html",
          ...
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
            ...
          }
        }
      },
      ...

</code-example>

指令會把 "options" 區段中指定的預設選項集傳給建置器。
如果你傳入 `--configuration=production` 旗標，它會使用 `production` 替代設定中指定的覆寫值。
你也可以在命令列上個別指定進一步的選項覆寫。
你也可以在 `build` 目標中加入更多替代設定，以定義 `stage` 或 `qa` 等其他環境。

#### 目標字串

通用的 `ng run` CLI 指令將目標字串作為第一個引數，其形式為 *project:target[:configuration]*。

* *project*：與該目標相關聯的 Angular CLI 專案名稱。

* *target*：`angular.json` 檔案 `architect` 區段中具名的建置器設定。

* *configuration*：（可選）該目標的特定設定覆寫名稱，定義於 `angular.json` 檔案中。

若你的建置器呼叫另一個建置器，它可能需要讀取傳入的目標字串。
使用 `@angular-devkit/architect` 的 `targetFromTargetString()` 工具函式，將這個字串解析成物件。

## 排程與執行

Architect 以非同步方式執行建置器。
若要呼叫建置器，你排程一個工作，待所有設定解析完成後執行。

在排程器回傳 `BuilderRun` 控制物件之前，建置器函式不會被執行。
CLI 通常會呼叫 `BuilderContext.scheduleTarget()` 函式來排程工作，然後使用 `angular.json` 檔案中的目標定義來解析輸入選項。

Architect 解析指定目標的輸入選項時，會先取預設選項物件，接著以所用設定的值覆寫（如果有），再以傳給 `BuilderContext.scheduleTarget()` 的覆寫物件的值進一步覆寫。
對 Angular CLI 而言，覆寫物件是由命令列引數建立的。

Architect 會依建置器的 schema 驗證解析後的選項值。
若輸入有效，Architect 會建立 context 並執行建置器。

更多資訊請參閱[工作區設定](guide/workspace-config)。

<div class="alert is-helpful">

   你也可以呼叫 `BuilderContext.scheduleBuilder()`，直接從另一個建置器或測試中叫用建置器。
   你可以直接把 `options` 物件傳給該方法，這些選項值會直接依照建置器的結構定義進行驗證，不再進一步調整。

   只有 `BuilderContext.scheduleTarget()` 方法會透過 `angular.json` 檔案解析設定與覆寫。

</div>

### 預設 Architect 設定

我們來建立一個簡單的 `angular.json` 檔案，將目標設定放入情境中。

你可以將建置器發佈到 npm（請參閱[發佈你的程式庫](https://angular.io/guide/creating-libraries#publishing-your-library)），並使用下列指令安裝它：

<code-example language="sh">

npm install @example/command-runner

</code-example>

若你用 `ng new builder-test` 建立新專案，產生的 `angular.json` 檔案大致如下，只有預設的建置器設定。

<code-example language="json" header="angular.json">

{
  // ...
  "projects": {
    // ...
    "builder-test": {
      // ...
      "architect": {
        // ...
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // ... more options...
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              // ... more options...
              "optimization": true,
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
  // ...
}

</code-example>

### 新增目標

新增一個會執行我們建置器來執行特定命令的目標。
這個目標會告訴建置器對一個檔案執行 `touch`，以更新它的修改日期。

我們需要更新 `angular.json` 檔案，在我們新專案的 "architect" 區段中為這個建置器加入一個目標。

* 我們會在專案的 "architect" 物件中新增一段目標區段。

* 名為 "touch" 的目標使用我們的建置器，也就是我們發佈到 `@example/command-runner` 的那個。（請參閱[發佈你的程式庫](https://angular.io/guide/creating-libraries#publishing-your-library)）

* options 物件為我們定義的兩個輸入提供預設值：`command` 是要執行的 Unix 命令，`args` 是包含要操作之檔案的陣列。

* configurations 鍵是選用的，我們現在先省略它。

<code-example language="json" header="angular.json">

{
  "projects": {
    "builder-test": {
      "architect": {
        "touch": {
          "builder": "@example/command-runner:command",
          "options": {
            "command": "touch",
            "args": [
              "src/main.ts"
            ]
          }
        },
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
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

若要以新目標的預設設定執行我們的建置器，在 Linux shell 中使用下列 CLI 指令。

<code-example language="sh">

   ng run builder-test:touch

</code-example>

這會對 `src/main.ts` 檔案執行 `touch` 命令。

你可以使用命令列引數來覆寫已設定的預設值。
例如，若要以不同的 `command` 值執行，使用下列 CLI 指令。

<code-example language="sh">

ng run builder-test:touch --command=ls

</code-example>

這會呼叫 `ls` 命令，而不是 `touch` 命令。
因為我們沒有覆寫 *args* 選項，它會列出 `src/main.ts` 檔案的資訊（為該目標提供的預設值）。

## 測試建置器

請為你的建置器使用整合測試，這樣你就能使用 Architect 排程器來建立情境，如這個[範例](https://github.com/mgechev/cli-builders-demo)所示。

* 在建置器來源目錄中，你建立了一個新的測試檔 `index.spec.ts`。程式碼會建立 `JsonSchemaRegistry`（用於結構定義驗證）、`TestingArchitectHost`（`ArchitectHost` 的記憶體內實作）與 `Architect` 的新實例。

* 我們在建置器的 [`package.json` 檔案](https://github.com/mgechev/cli-builders-demo/blob/master/command-builder/builders.json) 旁邊加入了一個 `builders.json` 檔案，並修改套件檔案以指向它。

以下是一個執行命令建置器的測試範例。
這個測試使用建置器執行 `ls` 命令，然後驗證它成功執行並列出了正確的檔案。

<code-example language="typescript" header="command/index_spec.ts">

import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
// Our builder forwards the STDOUT of the command to the logger.
import { logging, schema } from '@angular-devkit/core';

describe('Command Runner Builder', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    // TestingArchitectHost() takes workspace and current directories.
    // Since we don't use those, both are the same in this case.
    architectHost = new TestingArchitectHost(__dirname, __dirname);
    architect = new Architect(architectHost, registry);

    // This will either take a Node package name, or a path to the directory
    // for the package.json file.
    await architectHost.addBuilderFromPackage('..');
  });

  // This might not work in Windows.
  it('can run ls', async () => {
    // Create a logger that keeps an array of all messages that were logged.
    const logger = new logging.Logger('');
    const logs = [];
    logger.subscribe(ev => logs.push(ev.message));

    // A "run" can have multiple outputs, and contains progress information.
    const run = await architect.scheduleBuilder('@example/command-runner:command', {
      command: 'ls',
      args: [__dirname],
    }, { logger });  // We pass the logger for checking later.

    // The "result" member (of type BuilderOutput) is the next output.
    const output = await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();

    // Expect that it succeeded.
    expect(output.success).toBe(true);

    // Expect that this file was listed. It should be since we're running
    // `ls $__dirname`.
    expect(logs).toContain('index.spec.ts');
  });
});

</code-example>

<div class="alert is-helpful">

   在你的 repo 中執行這個測試時，你需要 [`ts-node`](https://github.com/TypeStrong/ts-node) 套件。你可以把 `index.spec.ts` 改名為 `index.spec.js` 來避免這個需求。

</div>

### 監看模式

Architect 預期建置器執行一次（預設）後就回傳。
這種行為與會監看變更的建置器（例如 Webpack）不完全相容。
Architect 可以支援監看模式，但有一些事情需要注意。

* 若要在監看模式下使用，建置器處理函式應回傳一個 Observable。Architect 會訂閱這個 Observable 直到它完成，若建置器以相同引數再次被排程，可能會重用它。

* 建置器應在每次執行後永遠發出一個 `BuilderOutput` 物件。一旦執行過，它就可以進入監看模式，等待外部事件觸發。若某個事件觸發它重新啟動，建置器應執行 `BuilderContext.reportRunning()` 函式，告訴 Architect 它正在再次執行。這可避免在另一次執行被排程時，Architect 停止這個建置器。

當你的建置器呼叫 `BuilderRun.stop()` 退出監看模式時，Architect 會取消訂閱建置器的 Observable，並呼叫建置器的 teardown 邏輯進行清理。
（這種行為也讓長時間執行的建置可以被停止與清理。）

一般而言，若你的建置器正在監看外部事件，你應將執行分成三個階段。

1. **執行中**
   例如，webpack 正在編譯。當 webpack 完成且你的建置器發出 `BuilderOutput` 物件時結束。

1. **監看中**
   在兩次執行之間，監看外部事件串流。例如，webpack 會監看檔案系統是否有任何變更。當 webpack 重新開始建置，且 `BuilderContext.reportRunning()` 被呼叫時結束。接著回到步驟 1。

1. **完成**
   任務已完全完成（例如，webpack 原本要執行多次），或建置器執行已停止（使用 `BuilderRun.stop()`）。接著會執行你的 teardown 邏輯，Architect 會取消訂閱你的建置器 Observable。

## 小結

CLI Builder API 提供了一種方式，透過建置器執行自訂邏輯，來改變 Angular CLI 的行為。

* 建置器可以是同步或非同步的，執行一次或監看外部事件，並能排程其他建置器或目標。

* 建置器的選項預設值在 `angular.json` 設定檔中指定，可被目標的替代設定覆寫，再被命令列旗標進一步覆寫。

* 我們建議你使用整合測試來測試 Architect 建置器，並使用單元測試來驗證建置器執行的邏輯。

* 若你的建置器回傳 Observable，它應在該 Observable 的 teardown 邏輯中清理。
