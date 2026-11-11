# 實驗性單元測試系統

Angular CLI 提供了一個實驗性單元測試系統，可以使用 [Vitest](https://vitest.dev/) 作為測試執行器。

IMPORTANT: 這個實驗性單元測試系統需要使用 `application` 建置系統。
`application` 建置系統是所有新建專案的預設值。

## 安裝相依性

新的建置器需要一些套件才能運作。若要安裝這些新套件，請執行下列指令：

<docs-code language="bash">

npm install vitest jsdom --save-dev

</docs-code>

如果你的工作區中沒有其他專案使用 Karma，請執行下列指令來解除安裝對應的套件：

<docs-code language="bash">

npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter --save-dev

</docs-code>

## 設定測試

Angular CLI 在新專案中包含了這個測試系統，但必須先完成設定才能使用。

你用 CLI 建立的專案，預設設定為使用 `karma` 測試系統。
若要改為實驗性單元測試系統，請如下更新 `test` 目標：

<docs-code language="json">
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "tsconfig.spec.json",
    "runner": "vitest",
    "buildTarget": "::development"
  }
}
</docs-code>

`buildTarget` 的運作方式，類似於開發伺服器可用的那個選項。
`build` 目標為測試設定建置選項。
如果專案缺少 `development` 建置設定，或你需要不同的測試選項，你可以建立並使用一個 `testing` 或類似名稱的建置設定。

若要執行應用程式的測試，只要像之前一樣執行 [`ng test`](cli/test) CLI 指令即可：

<docs-code language="shell">

ng test

</docs-code>

`ng test` 指令以_監看模式_建置應用程式，並啟動已設定的執行器。

主控台輸出看起來像下面這樣：

<docs-code language="shell">
 ✓ spec-app-app.spec.js (2 tests) 31ms
   ✓ App > should create the app 22ms
   ✓ App > should render title 8ms

Test Files 1 passed (1)
Tests 2 passed (2)
Start at 14:24:15
Duration 1.16s (transform 628ms, setup 703ms, collect 64ms, tests 31ms, environment 188ms, prepare 33ms)
</docs-code>

在使用互動式終端機且不在 CI 上執行時，監看模式預設為啟用。

## 設定

Angular CLI 會為你處理 Vitest 設定。它會根據 `angular.json` 檔案中指定的選項，在記憶體中建構完整的設定。
目前不支援直接自訂底層測試執行器的設定。

## 錯誤回報

請在 [GitHub](https://github.com/angular/angular-cli/issues) 上回報問題與功能請求。

請盡可能提供最小重現範例，以協助團隊處理問題。
