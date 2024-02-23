# 找出你正在測試的程式碼量

Angular CLI 可以執行單元測試和建立程式碼覆蓋率報告。
程式碼覆蓋率報告會顯示您的程式碼庫中可能未透過單元測試適當測試的任何部分。

要產生覆蓋率報告，請在專案的根目錄執行以下指令。

<docs-code language="shell">
ng test --no-watch --code-coverage
</docs-code>

測試完成後，指令會在專案中建立新的 `/coverage` 目錄。
開啟 `index.html` 檔案，即可檢視包含原始程式碼和程式碼涵蓋率數值的報告。

如果你想在每次測試時建立程式碼覆蓋率報告，請在 Angular CLI 組態檔案 `angular.json` 中設定下列選項：

<docs-code language="json">
"test": {
  "options": {
    "codeCoverage": true
  }
}
</docs-code>

## 程式碼覆蓋率強制執行

程式碼覆蓋率百分比讓您可以估計已測試的程式碼比例。
如果您的團隊決定一組要進行單元測試的最低數量，請使用 Angular CLI 執行此最低數量。

例如，假設您想要程式碼庫擁有至少 80% 的程式碼覆蓋率。
為啟用此功能，請開啟 [Karma](https://karma-runner.github.io) 測試平台設定檔 `karma.conf.js`，並在 `coverageReporter:` 鍵中新增 `check` 屬性。

<docs-code language="javascript">
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/&lt;project-name&gt;'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
</docs-code>

HELPFUL：閱讀 [測試指南](guide/testing#configuration)，以進一步了解如何建立和微調 Karma 組態。

`check` 屬性會導致工具在專案中執行單元測試時強制執行至少 80% 的程式碼覆蓋率。

在 [karma 覆蓋率文件](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md) 中閱讀更多關於覆蓋率配置選項。
