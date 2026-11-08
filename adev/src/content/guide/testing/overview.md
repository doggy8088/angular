# 單元測試

測試你的 Angular 應用程式，能協助你確認它是否如預期般運作。單元測試對於及早發現錯誤、確保程式碼品質，以及讓重構更安全，都至關重要。

NOTE: 本指南介紹新建 Angular CLI 專案的預設測試設定，使用的是 Vitest。如果你要將既有專案從 Karma 遷移，請參閱[從 Karma 遷移至 Vitest 指南](guide/testing/migrating-to-vitest)。Karma 仍受支援；更多資訊請參閱 [Karma 測試指南](guide/testing/karma)。

## 測試設定 {#set-up-for-testing}

Angular CLI 會下載並安裝使用 [Vitest 測試框架](https://vitest.dev)測試 Angular 應用程式所需的一切。新專案預設包含 `vitest` 與 `jsdom`。

Vitest 在 Node.js 環境中執行你的單元測試。為了模擬瀏覽器的 DOM，Vitest 使用一個名為 `jsdom` 的函式庫。這樣可以避免啟動瀏覽器的額外負擔，讓測試執行得更快。你可以安裝 `happy-dom` 並解除安裝 `jsdom`，改用 `happy-dom` 作為替代方案。目前受支援的 DOM 模擬函式庫為 `jsdom` 與 `happy-dom`。

用 CLI 建立的專案開箱即可執行測試。執行 [`ng test`](cli/test) 指令：

```shell
ng test
```

`ng test` 指令會以_監看模式_建置應用程式，並啟動 [Vitest 測試執行器](https://vitest.dev)。

主控台輸出如下：

```shell
 ✓ src/app/app.spec.ts (2)
   ✓ App should create the app
   ✓ App should render title
 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  18:18:01
   Duration  2.46s (transform 615ms, setup 2ms, collect 2.21s, tests 5ms)
```

`ng test` 指令也會監看你的檔案變更。如果你修改檔案並儲存，測試會再次執行。

## 設定

Angular CLI 會為你處理大部分的 Vitest 設定。你可以修改 `angular.json` 檔案中的 `test` 目標選項，來自訂測試行為。

### Angular.json 選項

- `include`：要納入測試的檔案 glob 模式。預設為 `['**/*.spec.ts', '**/*.test.ts']`。
- `exclude`：要從測試中排除的檔案 glob 模式。
- `setupFiles`：全域設定檔案的路徑清單（例如 polyfills 或全域 mock），會在你的測試之前執行。
- `providersFile`：匯出 Angular providers 預設陣列、供測試環境使用的檔案路徑。這對於設定注入到測試中的全域測試 providers 很有用。
- `coverage`：用來啟用或停用程式碼覆蓋率報告的布林值。預設為 `false`。
- `browsers`：要在真正的瀏覽器中執行測試的瀏覽器名稱陣列（例如 `["chromium"]`）。需要安裝瀏覽器 provider。詳情請參閱[在瀏覽器中執行測試](#running-tests-in-a-browser)一節。

### 全域測試設定與 providers

`setupFiles` 與 `providersFile` 選項對於管理全域測試設定特別有用。

例如，你可以建立一個 `src/test-providers.ts` 檔案，為所有測試提供 `provideHttpClientTesting`：

```typescript {header: "src/test-providers.ts"}
import {EnvironmentProviders, Provider} from '@angular/core';
import {provideHttpClientTesting} from '@angular/common/http/testing';

const testProviders: (Provider | EnvironmentProviders)[] = [provideHttpClientTesting()];

export default testProviders;
```

接著在你的 `angular.json` 中引用這個檔案：

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "providersFile": "src/test-providers.ts"
          }
        }
      }
    }
  }
}
```

HELPFUL: 建立像 `src/test-providers.ts` 這樣的新 TypeScript 檔案作為測試設定或 providers 時，請確保它們有被納入專案的測試 TypeScript 設定檔（通常是 `tsconfig.spec.json`）。這樣 TypeScript 編譯器才能在測試期間正確處理這些檔案。

### 進階 Vitest 設定 {#advanced-vitest-configuration}

對於進階使用情境，你可以使用 `angular.json` 中的 `runnerConfig` 選項，提供自訂的 Vitest 設定檔。

IMPORTANT: 使用自訂設定雖然能啟用進階選項，但 Angular 團隊不支援設定檔的內容或任何第三方外掛。CLI 也會覆寫某些屬性（`test.projects`、`test.include`）以確保正確整合。

你可以建立一個 Vitest 設定檔（例如 `vitest-base.config.ts`），並在 `angular.json` 中引用它：

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runnerConfig": "vitest-base.config.ts"
          }
        }
      }
    }
  }
}
```

你也可以使用 CLI 產生基礎設定檔：

```shell
ng generate config vitest
```

這會建立一個 `vitest-base.config.ts` 檔案，供你自訂。

HELPFUL: 關於 Vitest 設定的更多資訊，請參閱 [Vitest 官方文件](https://vitest.dev/config/)。

## 程式碼覆蓋率

在 `ng test` 指令加上 `--coverage` 旗標，即可產生程式碼覆蓋率報告。報告會產生在 `coverage/` 目錄中。

更詳細的資訊請參閱[程式碼覆蓋率指南](guide/testing/code-coverage)。

## 在瀏覽器中執行測試 {#running-tests-in-a-browser}

雖然預設的 Node.js 環境對大多數單元測試來說速度較快，你也可以在真正的瀏覽器中執行測試。這對於仰賴瀏覽器專屬 API（例如渲染）的測試，或除錯時很有用。

若要在瀏覽器中執行測試，你必須先安裝瀏覽器 provider。關於 Vitest 瀏覽器模式的更多資訊，請參閱[官方文件](https://vitest.dev/guide/browser)。

provider 安裝完成後，你可以透過設定 `angular.json` 中的 `browsers` 選項，或使用 `--browsers` CLI 旗標，在瀏覽器中執行測試。測試預設在有介面的瀏覽器中執行。如果設定了 `CI` 環境變數，則改用無頭模式。若要明確控制無頭模式，可以在瀏覽器名稱後加上 `Headless` 後綴（例如 `chromiumHeadless`）。

```bash
# Example for Playwright (headed)
ng test --browsers=chromium

# Example for Playwright (headless)
ng test --browsers=chromiumHeadless

# Example for WebdriverIO (headed)
ng test --browsers=chrome

# Example for WebdriverIO (headless)
ng test --browsers=chromeHeadless
```

請依需求選擇下列其中一個瀏覽器 provider：

### Playwright

[Playwright](https://playwright.dev/) 是一個瀏覽器自動化函式庫，支援 Chromium、Firefox 與 WebKit。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright playwright
  </docs-code>
</docs-code-multifile>

### WebdriverIO

[WebdriverIO](https://webdriver.io/) 是一個瀏覽器與行動裝置自動化測試框架，支援 Chrome、Firefox、Safari 與 Edge。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
</docs-code-multifile>

### Preview

`@vitest/browser-preview` provider 是為 StackBlitz 這類 WebContainer 環境設計的，不適合用在 CI/CD 中。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-preview
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-preview
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-preview
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-preview
  </docs-code>
</docs-code-multifile>

HELPFUL: 更多進階的瀏覽器專屬設定，請參閱[進階 Vitest 設定](#advanced-vitest-configuration)一節。

## 其他測試框架

你也可以使用其他測試函式庫與測試執行器來對 Angular 應用程式進行單元測試。每個函式庫與執行器都有各自的安裝程序、設定與語法。

## 在持續整合中測試

健全的測試套件是持續整合（CI）管線的重要一環。CI 伺服器讓你能自動在每次提交與提取請求時執行測試。

若要在 CI 伺服器中測試你的 Angular 應用程式，請執行標準測試指令：

```shell
ng test
```

大多數 CI 伺服器會設定 `CI=true` 環境變數，`ng test` 能偵測到它。這會自動將你的測試設定為以非互動、單次執行模式執行。

如果你的 CI 伺服器沒有設定這個變數，或你需要手動強制使用單次執行模式，可以使用 `--no-watch` 與 `--no-progress` 旗標：

```shell
ng test --no-watch --no-progress
```

## 更多測試資訊

應用程式的測試設定完成後，下列測試指南可能對你有幫助。

|                                                                    | Details                                                                           |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [程式碼覆蓋率](guide/testing/code-coverage)                       | 你的測試涵蓋了應用程式的多少部分，以及如何指定所需的涵蓋量。 |
| [測試服務](guide/testing/services)                         | 如何測試你的應用程式所使用的服務。                                   |
| [測試元件基礎](guide/testing/components-basics)    | Angular 元件測試的基礎。                                             |
| [元件測試情境](guide/testing/components-scenarios)  | 各種元件測試情境與使用案例。                       |
| [測試屬性指令](guide/testing/attribute-directives) | 如何測試你的屬性指令。                                            |
| [測試管道](guide/testing/pipes)                               | 如何測試管道。                                                                |
| [除錯測試](guide/testing/debugging)                         | 常見的測試錯誤。                                                              |
| [測試工具 API](guide/testing/utility-apis)                 | Angular 測試功能。                                                         |
