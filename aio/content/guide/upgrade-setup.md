# 從 AngularJS 升級的設定

<!--
Question: Can we remove this file and instead direct readers to https://github.com/angular/quickstart/blob/master/README.md
-->

<div class="alert is-critical">

**適用對象：** 請**僅**在[從 AngularJS 升級](guide/upgrade "從 AngularJS 升級到 Angular")或[為提升效能而升級](guide/upgrade-performance "為提升效能而升級")的脈絡下使用本指南。
那些升級指南會參照本設定指南，以了解如何使用[已被棄用的 QuickStart GitHub 儲存庫](https://github.com/angular/quickstart "已被棄用的 Angular QuickStart GitHub 儲存庫")，該儲存庫是在目前的 Angular [CLI](cli "CLI 總覽")之前建立的。

**對於所有其他情境，** 請參閱[設定本機環境與工作區](guide/setup-local "設定本機開發環境")中的最新指示。


</div>

<!--
The <live-example name=quickstart>QuickStart live-coding</live-example> example is an Angular _playground_.
There are also some differences from a local app, to simplify that live-coding experience.
In particular, the QuickStart live-coding example shows just the AppComponent file; it creates the equivalent of app.module.ts and main.ts internally for the playground only.
-->

本指南說明如何在你自己的機器上進行本機開發。
在你的機器上建立新專案既快速又簡單，只要使用 [GitHub 上的 QuickStart 種子](https://github.com/angular/quickstart "Install the github QuickStart repo")即可。

**先決條件：** 請確認你已安裝 [Node.js® 與 npm](guide/setup-local#prerequisites "Angular prerequisites")。


{@a clone}
## 複製

使用下列終端機指令，執行 _clone-to-launch_ 步驟。

<code-example language="sh">
  git clone https://github.com/angular/quickstart.git quickstart
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



`npm start` 在早於創作者更新（2017 年 4 月）的 _Bash for Windows_ 版本中會失敗。


</div>



{@a download}


## 下載
<a href="https://github.com/angular/quickstart/archive/master.zip" title="Download the QuickStart seed repository">下載 QuickStart 種子</a>
並將其解壓縮到你的專案資料夾中。接著使用下列終端機指令執行其餘步驟。

<code-example language="sh">
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



`npm start` 在早於創作者更新（2017 年 4 月）的 _Bash for Windows_ 版本中會失敗。


</div>



{@a non-essential}



## 刪除 _non-essential_ 檔案（選用）

你可以快速刪除與測試及 QuickStart 儲存庫維護有關的 _non-essential_ 檔案
(***包括所有與 git 相關的產物***，例如 `.git` 資料夾與 `.gitignore`！)。


<div class="alert is-important">



請只在一開始這麼做，以免不小心刪除你自己的測試與 git 設定！


</div>



在專案資料夾中開啟終端機視窗，並依你的環境輸入下列指令：

### OS/X (bash)

<code-example language="sh">
  xargs rm -rf &lt; non-essential-files.osx.txt
  rm src/app/*.spec*.ts
  rm non-essential-files.osx.txt

</code-example>



### Windows

<code-example language="sh">
  for /f %i in (non-essential-files.txt) do del %i /F /S /Q
  rd .git /s /q
  rd e2e /s /q

</code-example>



{@a seed}



## QuickStart 種子裡有什麼？



**QuickStart 種子**提供了一個基本的 QuickStart 遊樂場應用程式，以及本機開發所需的其他檔案。
因此，你機器上的專案資料夾中有許多檔案，
其中大部分你可以在之後[進一步了解](guide/file-structure)。


<div class="alert is-helpful">

**提醒：**「QuickStart 種子」範例是在 Angular CLI 之前建立的，因此此處所述內容與 Angular CLI 應用程式之間有些差異。

</div>

{@a app-files}


請聚焦於 **`/src`** 資料夾中的以下三個 TypeScript（`.ts`）檔案。


<div class='filetree'>

  <div class='file'>
    src
  </div>

  <div class='children'>

    <div class='file'>
      app
    </div>

    <div class='children'>

      <div class='file'>
        app.component.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

    </div>

    <div class='file'>
      main.ts
    </div>

  </div>

</div>



<code-tabs>

  <code-pane header="src/app/app.component.ts" path="setup/src/app/app.component.ts">

  </code-pane>

  <code-pane header="src/app/app.module.ts" path="setup/src/app/app.module.ts">

  </code-pane>

  <code-pane header="src/main.ts" path="setup/src/main.ts">

  </code-pane>

</code-tabs>



所有的指南與食譜都 _至少有這些核心檔案_。
每個檔案各有其獨特用途，並隨著應用程式成長而獨立演進。

`src/` 以外的檔案涉及應用程式的建置、部署與測試。
它們包括設定檔與外部相依性。

`src/` 內的檔案「屬於」你的應用程式。
請在 `src/` 目錄中新增 Typescript、HTML 與 CSS 檔案，大多放在 `src/app` 內，
除非另有指示。

以下檔案都在 `src/` 中：


<style>
  td, th {vertical-align: top}
</style>



<table width="100%">

  <col width="20%">

  </col>

  <col width="80%">

  </col>

  <tr>

    <th>
      File
    </th>

    <th>
      Purpose
    </th>

  </tr>

  <tr>

    <td>
      <code>app/app.component.ts</code>
    </td>

    <td>


      定義與 QuickStart 遊樂場中相同的 `AppComponent`。
      它是**根**元件，隨著應用程式演進，會成為巢狀元件樹的根。

    </td>

  </tr>

  <tr>

    <td>
      <code>app/app.module.ts</code>
    </td>

    <td>


      定義 `AppModule`，也就是 [根模組](guide/bootstrapping "AppModule: the root module")，它告訴 Angular 如何組裝應用程式。
      當最初建立時，它只宣告 `AppComponent`。
      隨著時間推移，你會加入更多要宣告的元件。

    </td>

  </tr>

  <tr>

    <td>
      <code>main.ts</code>
    </td>

    <td>


      使用 [JIT 編譯器](guide/glossary#jit)編譯應用程式，並
      [啟動](guide/bootstrapping)
      應用程式的主要模組（`AppModule`）以在瀏覽器中執行。
      JIT 編譯器是大多數專案開發期間合理的選擇，也是
      像 Stackblitz 這類 _live-coding_ 環境中唯一可行的選擇。
      另外還有[編譯](guide/aot-compiler)、[建置](guide/build)與[部署](guide/deployment)選項可供選用。

    </td>

  </tr>

</table>


## 附錄：在本機使用 IE 開發

如果你在本機使用 `ng serve` 開發 Angular，瀏覽器與本機開發伺服器之間會自動建立 `websocket` 連線，因此當你的程式碼變更時，瀏覽器可以自動重新整理。

在 Windows 中，預設情況下，一個應用程式只能有 6 個 websocket 連線，<a href="https://msdn.microsoft.com/library/ee330736%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396#websocket_maxconn" title="MSDN WebSocket settings">MSDN WebSocket 設定</a>。
因此當 IE 重新整理時（由 `ng serve` 手動或自動），有時 websocket 不會正確關閉。當 websocket 連線超過限制時，會拋出 `SecurityError`。這個錯誤不會影響 Angular 應用程式，你可以重新啟動 IE 來清除這個錯誤，或修改 windows 登錄來更新限制。

## 附錄：使用 `fakeAsync()/waitForAsync()` 進行測試

如果你使用 `fakeAsync()/waitForAsync()` 輔助函式來執行單元測試（詳情請參閱[測試指南](guide/testing-components-scenarios#fake-async)），你需要在測試設定檔中匯入 `zone.js/dist/zone-testing`。

<div class="alert is-important">
如果你使用 `Angular/CLI` 建立專案，它已經匯入在 `src/test.ts` 中。
</div>

而在較早版本的 `Angular` 中，下列檔案是匯入或加入到你的 html 檔案中的：

```
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
```

你仍然可以分別載入這些檔案，但順序很重要，你必須在 `sync-test`、`async-test`、`fake-async-test` 與 `jasmine-patch` 之前匯入 `proxy`。而且你還需要在 `jasmine-patch` 之前匯入 `sync-test`，所以建議直接匯入 `zone-testing`，而不是分別載入這些檔案。
