{@a code-coverage}

# 找出你測試了多少程式碼

CLI 可以執行單元測試並建立程式碼覆蓋率報告。
程式碼覆蓋率報告會向你顯示程式碼庫中有哪些部分可能沒有被單元測試妥善測試到。

<div class="alert is-helpful">

  關於測試指南所描述的範例應用程式，請參閱<live-example name="testing" embedded-style noDownload>範例應用程式</live-example>。

  關於測試指南中的測試功能，請參閱<live-example name="testing" stackblitz="specs" noDownload>測試</live-example>。

</div>


若要產生覆蓋率報告，請在專案的根目錄執行下列指令。

<code-example language="sh" class="code-shell">
  ng test --no-watch --code-coverage
</code-example>

測試完成後，該指令會在專案中建立一個新的 `/coverage` 資料夾。開啟 `index.html` 檔案，即可查看一份帶有你的原始碼與程式碼覆蓋率數值的報告。

如果你想在每次測試時都建立程式碼覆蓋率報告，請在 CLI 設定檔 `angular.json` 中設定下列選項：

```
  "test": {
    "options": {
      "codeCoverage": true
    }
  }
```

## 程式碼覆蓋率強制要求

程式碼覆蓋率百分比讓你估計你的程式碼有多少比例已被測試。
如果你的團隊決定了一個要進行單元測試的最低數量，請以 Angular CLI 強制執行這個最低要求。

例如，假設你希望程式碼庫至少有 80% 的程式碼覆蓋率。
若要啟用這個功能，請開啟 [Karma](https://karma-runner.github.io) 測試平台設定檔 `karma.conf.js`，並在 `coverageIstanbulReporter:` 鍵中加入下列內容。

```
coverageIstanbulReporter: {
  reports: [ 'html', 'lcovonly' ],
  fixWebpackSourcePaths: true,
  thresholds: {
    statements: 80,
    lines: 80,
    branches: 80,
    functions: 80
  }
}
```

`thresholds` 屬性會讓工具在專案中執行單元測試時，強制要求至少 80% 的程式碼覆蓋率。
