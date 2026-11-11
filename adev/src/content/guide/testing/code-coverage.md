# 找出你測試了多少程式碼

Angular CLI 可以執行單元測試並建立程式碼覆蓋率報告。
程式碼覆蓋率報告會向你顯示程式碼庫中有哪些部分可能沒有被單元測試妥善測試到。

若要產生覆蓋率報告，請在專案的根目錄執行下列指令。

<docs-code language="shell">
ng test --no-watch --code-coverage
</docs-code>

測試完成後，該指令會在專案中建立一個新的 `/coverage` 目錄。
開啟 `index.html` 檔案，即可查看一份帶有你的原始碼與程式碼覆蓋率數值的報告。

如果你想在每次測試時都建立程式碼覆蓋率報告，請在 Angular CLI 設定檔 `angular.json` 中設定下列選項：

<docs-code language="json">
"test": {
  "options": {
    "codeCoverage": true
  }
}
</docs-code>

## 程式碼覆蓋率強制要求

程式碼覆蓋率百分比讓你估計你的程式碼有多少比例已被測試。
如果你的團隊決定了一個要進行單元測試的最低數量，請以 Angular CLI 強制執行這個最低要求。

例如，假設你希望程式碼庫至少有 80% 的程式碼覆蓋率。
若要啟用這個功能，請開啟 [Karma](https://karma-runner.github.io) 測試平台設定檔 `karma.conf.js`，並在 `coverageReporter:` 鍵中加入 `check` 屬性。

<docs-code language="javascript">
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
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

HELPFUL: 在[測試指南](guide/testing#configuration)中，閱讀更多關於建立與微調 Karma 設定的資訊。

`check` 屬性會讓工具在專案中執行單元測試時，強制要求至少 80% 的程式碼覆蓋率。

在 [karma coverage 文件](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md)中，閱讀更多覆蓋率設定選項。
