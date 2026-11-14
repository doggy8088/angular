# 設定專案的結構剖析

文件中的[設定](guide/setup)流程會安裝 _大量_ 檔案。
其中大多數都可以安全地忽略。

位於 **`src/`** 與 **`e2e/`** 資料夾 _內_ 的應用程式檔案，對開發者來說最重要。

那些資料夾 _外_ 的檔案，決定了開發環境的條件。
它們很少變動，你可能永遠不會檢視或修改它們。
如果你真的需要，這一頁可以幫助你了解它們的用途。


<style>
  td, th {vertical-align: top}
</style>



<table width="100%">

  <col width="10%">

  </col>

  <col width="90%">

  </col>

  <tr>

    <th>
      檔案
    </th>

    <th>
      用途
    </th>

  </tr>

  <tr>

    <td>
      <code>src/app/</code>
    </td>

    <td>


      Angular 應用程式檔案放在這裡。

      隨附「Hello Angular」範例的
      `AppComponent`、`AppModule`、一個元件單元測試（`app.component.spec.ts`），以及
      啟動檔案 `main.ts`。

      將 <live-example name="setup">範例應用程式</live-example>
      與 <live-example name="setup" stackblitz="quickstart-specs">單元測試</live-example>
      作為 _即時範例_ 試用看看。
    </td>

  </tr>

  <tr>

    <td>
      <code>e2e/</code>
    </td>

    <td>


      應用程式的 _端到端_（e2e）測試，
      以 Jasmine 撰寫，並由
      <a href="http://www.protractortest.org/" title="Protractor: end-to-end testing for Angular">protractor</a>
      e2e 測試執行器執行。

      初始內容是一個針對「Hello Angular」範例的 e2e 測試。
    </td>

  </tr>

  <tr>

    <td>
      <code>node_modules/</code>
    </td>

    <td>


      以 `npm install` 指令安裝的 _npm_ 套件。
    </td>

  </tr>

  <tr>

    <td>
      <code>.editorconfig<br>
.git/<br>
.gitignore<br>
.travis.yml</code>
    </td>

    <td>


      工具用的設定檔案與資料夾。
      除非你有充分的理由，否則先忽略它們。
    </td>

  </tr>

  <tr>

    <td>
      <code>CHANGELOG.md</code>
    </td>

    <td>


      _QuickStart_ 儲存庫的變更歷史。
      可以刪除或忽略。
    </td>

  </tr>

  <tr>

    <td>
      <code>favicon.ico</code>
    </td>

    <td>


      出現在瀏覽器分頁中的應用程式圖示。
    </td>

  </tr>

  <tr>

    <td>
      <code>index.html</code>
    </td>

    <td>


      應用程式的宿主頁面。
      它以規定的順序載入少數幾個必要指令碼。
      然後它啟動應用程式，把根 `AppComponent`
      放進自訂的 `<my-app>` body 標籤中。

      同一個 `index.html` 能滿足所有文件應用程式範例。
    </td>

  </tr>

  <tr>

    <td>
      <code>karma.conf.js</code>
    </td>

    <td>


      [測試](guide/testing)指南中所述的 <a href="https://karma-runner.github.io/1.0/index.html" title="Karma unit test runner">karma</a>
      測試執行器的設定。
    </td>

  </tr>

  <tr>

    <td>
      <code>karma-test-shim.js</code>
    </td>

    <td>


      如[測試](guide/testing)指南所述，用 SystemJS 執行 <a href="https://karma-runner.github.io/1.0/index.html" title="Karma unit test runner">karma</a>
      的指令碼。
    </td>

  </tr>

  <tr>

    <td>
      <code>non-essential-files.txt</code>
    </td>

    <td>


      如果你想清除設定中原始的 QuickStart Seed 測試與 git 維護產物，
      可以刪除的檔案清單。
      請參閱可選的
      [_刪除非必要檔案_](guide/setup#non-essential "Setup: Deleting non-essential files") 一節中的說明。
      *只在最開始做這件事，以免不小心刪除你自己的測試與 git 設定！*
    </td>

  </tr>

  <tr>

    <td>
      <code>LICENSE</code>
    </td>

    <td>


      用於在你的應用程式中使用這份設定程式碼的 MIT 開源授權。
    </td>

  </tr>

  <tr>

    <td>
      <code>package.json</code>
    </td>

    <td>


      標明專案的 `npm` 套件依賴。

      包含執行應用程式、
      執行測試等指令碼。輸入 `npm run` 可列出清單。
      關於這些指令碼，可<a href="https://github.com/angular/quickstart/blob/master/README.md#npm-scripts"
         title="npm scripts for Angular documentation samples">深入閱讀</a>。
    </td>

  </tr>

  <tr>

    <td>
      <code>protractor.config.js</code>
    </td>

    <td>


      <a href="http://www.protractortest.org/" title="Protractor: end-to-end testing for Angular">protractor</a>
      _端到端_（e2e）測試執行器的設定。
    </td>

  </tr>

  <tr>

    <td>
      <code>README.md</code>
    </td>

    <td>


      在你的專案中使用這個 git 儲存庫的說明。
      刪除前值得一讀。
    </td>

  </tr>

  <tr>

    <td>
      <code>styles.css</code>
    </td>

    <td>


      應用程式的全域樣式。初始內容包含為 QuickStart 示範準備的 `<h1>` 樣式。

    </td>

  </tr>

  <tr>

    <td>
      <code>systemjs<br>.config.js</code>
    </td>

    <td>


      告訴 **SystemJS** 模組載入器，要去哪裡尋找
      JavaScript `import` 陳述式所參照的模組。例如：
      <code-example language="ts">
        import { Component } from '@angular/core;
      </code-example>


      除非你完全精通 SystemJS 設定，否則不要碰這個檔案。
    </td>

  </tr>

  <tr>

    <td>
      <code>systemjs<br>.config.extras.js</code>
    </td>

    <td>


      可選的額外 SystemJS 設定。
      一種加入 SystemJS 對映（例如應用程式的 _barrels_）的方法，
      而不更動原始的 `system.config.js`。
    </td>

  </tr>

  <tr>

    <td>
      <code>tsconfig.json</code>
    </td>

    <td>


      告訴 TypeScript 編譯器，如何把 TypeScript 原始碼檔案
      轉譯成能在所有現代瀏覽器中執行的 JavaScript 檔案。
    </td>

  </tr>

  <tr>

    <td>
      <code>tslint.json</code>
    </td>

    <td>


      以 `npm` 安裝的 TypeScript 程式碼檢查工具會檢查你的 TypeScript 程式碼，
      當你違反它的某條規則時就會抱怨。

      這個檔案定義了[Angular 風格指南](guide/styleguide)與文件作者
      所偏好的檢查規則。
    </td>

  </tr>

</table>
