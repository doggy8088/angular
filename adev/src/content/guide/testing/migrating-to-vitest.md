# 從 Karma 遷移至 Vitest

Angular CLI 會將 [Vitest](https://vitest.dev/) 作為新專案的預設單元測試執行器。本指南說明如何將既有專案從 Karma 與 Jasmine 遷移至 Vitest。

IMPORTANT: 將既有專案遷移至 Vitest 目前仍屬實驗性質。此流程也需要使用 `application` 建置系統，該系統是所有新建專案的預設值。

## 手動遷移步驟

在使用自動化重構原理圖之前，你必須先手動更新專案，改用 Vitest 測試執行器。

### 1. 安裝相依性

安裝 `vitest` 與 DOM 模擬函式庫。雖然仍可在瀏覽器中執行測試（見[步驟 5](#5-configure-browser-mode-optional)），但 Vitest 預設使用 DOM 模擬函式庫，在 Node.js 中模擬瀏覽器環境，讓測試執行得更快。CLI 會自動偵測並使用已安裝的 `happy-dom`；若未安裝，則改用 `jsdom`。你必須安裝其中一個套件。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev vitest jsdom
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev vitest jsdom
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D vitest jsdom
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev vitest jsdom
  </docs-code>
</docs-code-multifile>

### 2. 更新 `angular.json`

在 `angular.json` 檔案中，找到專案的 `test` 目標，將其 `builder` 改為 `@angular/build:unit-test`。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}
```

`unit-test` 建置器預設使用 `"tsConfig": "tsconfig.spec.json"` 與 `"buildTarget": "::development"`。如果專案需要不同的值，你可以明確設定這些選項。例如，若缺少 `development` 建置設定，或測試需要不同的選項，你可以為 `buildTarget` 建立並使用 `testing` 或類似名稱的建置設定。

先前的 `@angular/build:karma` 建置器允許直接在 `test` 目標內設定建置選項（例如 `polyfills`、`assets` 或 `styles`）。新的 `@angular/build:unit-test` 建置器不支援這種做法。如果你的測試專用建置選項與既有的 `development` 建置設定不同，你必須將這些選項移到專用的建置目標設定中。如果你的測試建置選項已經與 `development` 建置設定相同，則無需任何動作。

### 3. 處理自訂的 `karma.conf.js` 設定

`karma.conf.js` 中的自訂設定不會自動遷移。在刪除 `karma.conf.js` 檔案之前，請先檢查其中是否有需要遷移的自訂設定。

許多 Karma 選項在 Vitest 中都有對應功能，可以在自訂的 Vitest 設定檔（例如 `vitest.config.ts`）中設定，並透過 `runnerConfig` 選項連結到你的 `angular.json`。

常見的遷移路徑包括：

- **報告器**：Karma 報告器必須換成與 Vitest 相容的報告器。這些通常可以直接在 `angular.json` 的 `test.options.reporters` 屬性中設定。如需更進階的設定，請使用自訂的 `vitest.config.ts` 檔案。
- **外掛**：Karma 外掛可能有 Vitest 的對應版本，你需要自行尋找並安裝。請注意，程式碼覆蓋率是 Angular CLI 的內建功能，可以用 `ng test --coverage` 啟用。
- **自訂瀏覽器啟動器**：改由 `angular.json` 中的 `browsers` 選項取代，並安裝像 `@vitest/browser-playwright` 這樣的瀏覽器 provider。

其他設定請參閱官方 [Vitest 文件](https://vitest.dev/config/)。

### 4. 移除 Karma 與 `test.ts` 檔案

現在你可以從專案中刪除 `karma.conf.js` 與 `src/test.ts`，並解除安裝與 Karma 相關的套件。下列指令以新建 Angular CLI 專案所安裝的套件為準；你的專案可能還有其他 Karma 相關套件需要移除。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="bun" language="shell">
    bun remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
</docs-code-multifile>

### 5. 設定瀏覽器模式（選用）

如果你需要在真正的瀏覽器中執行測試，必須安裝瀏覽器 provider 並設定你的 `angular.json`。

**安裝瀏覽器 provider**：

請依需求選擇下列其中一個瀏覽器 provider：

- **Playwright**：`@vitest/browser-playwright`，支援 Chromium、Firefox 與 WebKit。
- **WebdriverIO**：`@vitest/browser-webdriverio`，支援 Chrome、Firefox、Safari 與 Edge。
- **Preview**：`@vitest/browser-preview`，用於 WebContainer 環境（例如 StackBlitz）。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright
  </docs-code>
</docs-code-multifile>

**為瀏覽器模式更新 `angular.json`**：

在 `test` 目標的 options 中加入 `browsers` 選項。瀏覽器名稱取決於你安裝的 provider（例如 Playwright 用 `chromium`、WebdriverIO 用 `chrome`）。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

如果設定了 `CI` 環境變數，或瀏覽器名稱包含「Headless」（例如 `ChromeHeadless`），就會自動啟用無頭模式。否則，測試會在有介面的瀏覽器中執行。

## 使用原理圖自動重構測試

IMPORTANT: `refactor-jasmine-vitest` 原理圖屬實驗性質，可能無法涵蓋所有可能的測試模式。請務必檢查原理圖所做的變更。

Angular CLI 提供 `refactor-jasmine-vitest` 原理圖，可自動將你的 Jasmine 測試重構為使用 Vitest。

### 總覽

此原理圖會在你的測試檔案（`.spec.ts`）中自動進行下列轉換：

- 將 `fit` 與 `fdescribe` 轉換為 `it.only` 與 `describe.only`。
- 將 `xit` 與 `xdescribe` 轉換為 `it.skip` 與 `describe.skip`。
- 將 `spyOn` 呼叫轉換為對等的 `vi.spyOn`。
- 以 `expect.objectContaining` 取代 `jasmine.objectContaining`。
- 以 `expect.any` 取代 `jasmine.any`。
- 以 `vi.fn` 取代 `jasmine.createSpy`。
- 將 `beforeAll`、`beforeEach`、`afterAll` 與 `afterEach` 更新為 Vitest 的對等寫法。
- 將 `fail()` 轉換為 Vitest 的 `expect.fail()`。
- 調整預期寫法以符合 Vitest API
- 為無法自動轉換的程式碼加上 TODO 註解

此原理圖**不會**執行下列動作：

- 不會安裝 `vitest` 或其他相關相依性。
- 不會更改你的 `angular.json` 改用 Vitest 建置器，也不會從 `test` 目標遷移任何建置選項（例如 `polyfills` 或 `styles`）。
- 不會移除 `karma.conf.js` 或 `test.ts` 檔案。
- 不會處理複雜或巢狀的 spy 情境，這類情況可能需要手動重構。

### 執行原理圖

專案設定好 Vitest 後，你就可以執行原理圖來重構測試檔案。

若要重構預設專案中的**所有**測試檔案，請執行：

```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

### 選項

你可以使用下列選項自訂原理圖的行為：

| Option                   | Description                                                                                         |
| :----------------------- | :-------------------------------------------------------------------------------------------------- |
| `--project <name>`       | 指定要在多專案工作區中重構的專案。<br> 範例：`--project=my-lib`      |
| `--include <path>`       | 只重構特定的檔案或目錄。<br> 範例：`--include=src/app/app.component.spec.ts` |
| `--file-suffix <suffix>` | 指定測試檔案的其他副檔名。<br> 範例：`--file-suffix=.test.ts`              |
| `--add-imports`          | 如果你已在 Vitest 設定中停用全域變數，則加入明確的 `vitest` 匯入。            |
| `--verbose`              | 查看所有已套用轉換的詳細記錄。                                                |
| `--browser-mode`         | 如果你打算在瀏覽器模式中執行測試。                                                     |

### 遷移完成後

原理圖執行完畢後，建議你：

1.  **執行測試**：執行 `ng test`，確保重構後所有測試仍能通過。
2.  **檢查變更**：仔細看過原理圖所做的變更，特別留意複雜的測試，尤其是那些有繁複 spy 或 mock 的測試，因為它們可能需要進一步的手動調整。

`ng test` 指令會以_監看模式_建置應用程式並啟動設定的執行器。使用互動式終端機且不在 CI 上執行時，監看模式預設為啟用。

## 設定

Angular CLI 會為你處理 Vitest 設定，根據 `angular.json` 中的選項，在記憶體中建構完整的設定。

### 自訂 Vitest 設定

IMPORTANT: 使用自訂設定雖然能啟用進階選項，但 Angular 團隊不直接支援設定檔的具體內容，或其中使用的任何第三方外掛。CLI 也會覆寫某些屬性（`test.projects`、`test.include`）以確保運作正常。

你可以提供自訂的 Vitest 設定檔來覆寫預設設定。完整的可用選項清單請參閱官方 [Vitest 文件](https://vitest.dev/config/)。

**1. 直接指定路徑：**
在你的 `angular.json` 中提供 Vitest 設定檔的直接路徑：

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {"runnerConfig": "vitest.config.ts"}
        }
      }
    }
  }
}
```

**2. 自動搜尋基礎設定：**
如果你將 `runnerConfig` 設為 `true`，建置器會自動在你的專案與工作區根目錄中搜尋共用的 `vitest-base.config.*` 檔案。

## `zone.js` Vitest 修補

若要使用 `fakeAsync`、`flush` 或 `waitForAsync` 等函式，或讓既有測試能配合這些函式運作，你可以在 `angular.json` 中，將 `zone.js/plugins/vitest-patch` 加入測試目標的 polyfills。

無論如何，我們強烈建議你開始規劃將既有測試套件改為原生 `async` 與 Vitest 假計時器，因為這是既定的做法。

假計時器在 Vitest 中的使用方式，可參閱[此處的範例](/guide/testing/components-scenarios#async-test-with-a-vitest-fake-timers)。

## 問題回報

請在 [GitHub](https://github.com/angular/angular-cli/issues) 上回報問題與功能需求。

請盡可能提供最小可重現範例，協助團隊處理問題。
