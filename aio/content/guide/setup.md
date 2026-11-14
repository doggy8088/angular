# 本機開發環境設定

{@a develop-locally}

<live-example name=quickstart>QuickStart 即時程式碼</live-example> 範例是一個 Angular _遊樂場_。
它不是開發真正應用程式的地方。
你[應該在本機開發](guide/setup#why-locally "Why develop locally")，在你自己的機器上進行 ... 而我們也認為這正是你應該學習 Angular 的方式。

使用 **QuickStart seed**，在你的機器上設定新專案既快速又簡單，
它維護在 [github](https://github.com/angular/quickstart "Install the github QuickStart repo") 上。


請確保你已[安裝 Node.js® 與 npm](guide/setup#install-prerequisites "What if you don't have Node.js and npm?")。

{@a clone}


## 複製

使用下列終端機指令執行 _clone-to-launch_ 步驟。


<code-example language="sh" class="code-shell">
  git clone https://github.com/angular/quickstart.git quickstart
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



`npm start` 在早於 Creators Update（2017 年 4 月）的版本中，會在 _Bash for Windows_ 中失敗。


</div>



{@a download}


## 下載
<a href="https://github.com/angular/quickstart/archive/master.zip" title="Download the QuickStart seed repository">下載 QuickStart seed</a>
並把它解壓縮到你的專案資料夾。接著使用下列終端機指令執行其餘步驟。


<code-example language="sh" class="code-shell">
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



`npm start` 在早於 Creators Update（2017 年 4 月）的版本中，會在 _Bash for Windows_ 中失敗。


</div>



{@a non-essential}



## 刪除 _non-essential_ 檔案（可選）

你可以快速刪除與測試及 QuickStart 儲存庫維護相關的 _non-essential_ 檔案
（***包括所有 git 相關產物***，例如 `.git` 資料夾與 `.gitignore`！）。


<div class="alert is-important">



請只在一開始執行這個動作，以免不小心刪掉你自己的測試與 git 設定！


</div>



在專案資料夾中開啟終端機視窗，並針對你的環境輸入下列指令：

### OS/X (bash)

<code-example language="sh" class="code-shell">
  xargs rm -rf &lt; non-essential-files.osx.txt
  rm src/app/*.spec*.ts
  rm non-essential-files.osx.txt

</code-example>



### Windows

<code-example language="sh" class="code-shell">
  for /f %i in (non-essential-files.txt) do del %i /F /S /Q
  rd .git /s /q
  rd e2e /s /q

</code-example>



{@a seed}



## QuickStart seed 裡有什麼？



**QuickStart seed** 包含與 QuickStart 遊樂場相同的應用程式。
但它真正的目的，是為 _本機_ 開發提供堅實的基礎。
因此，你機器上的專案資料夾中有 _更多檔案_，
其中大部分你可以[日後再了解](guide/setup-systemjs-anatomy "Setup Anatomy")。



{@a app-files}


請聚焦於 **`/src`** 資料夾中下列三個 TypeScript（`.ts`）檔案。


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

  <code-pane title="src/app/app.component.ts" path="setup/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts" path="setup/src/app/app.module.ts">

  </code-pane>

  <code-pane title="src/main.ts" path="setup/src/main.ts">

  </code-pane>

</code-tabs>



所有指南與食譜都 _至少有這些核心檔案_。
每個檔案都有各自不同的目的，並隨著應用程式成長而獨立演進。

`src/` 之外的檔案與建置、部署及測試你的應用程式有關。
它們包括設定檔與外部相依套件。

`src/` 之內的檔案「屬於」你的應用程式。
把新的 Typescript、HTML 與 CSS 檔案加到 `src/` 目錄中，大部分放在 `src/app` 裡，
除非另有指示。

下列檔案全都在 `src/` 中


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
      檔案
    </th>

    <th>
      用途
    </th>

  </tr>

  <tr>

    <td>
      <code>app/app.component.ts</code>
    </td>

    <td>


      定義與 QuickStart 遊樂場中相同的 `AppComponent`。
      它是隨著應用程式演進、將成為巢狀元件樹的**根**元件。
    </td>

  </tr>

  <tr>

    <td>
      <code>app/app.module.ts</code>
    </td>

    <td>


      定義 `AppModule`，也就是告訴 Angular 如何組裝應用程式的[根模組](guide/bootstrapping "AppModule: the root module")。
      目前它只宣告了 `AppComponent`。
      很快就會有更多元件需要宣告。
    </td>

  </tr>

  <tr>

    <td>
      <code>main.ts</code>
    </td>

    <td>


      使用 [JIT 編譯器](guide/glossary#jit)編譯應用程式，並
      [啟動](guide/bootstrapping)
      應用程式的主要模組（`AppModule`），讓它在瀏覽器中執行。
      在大多數專案的開發期間，JIT 編譯器是合理的選擇，
      也是在 Stackblitz 這類 _live-coding_ 環境中執行範例的唯一可行選擇。
      你將在文件後面的部分了解替代的編譯與[部署](guide/deployment)選項。

    </td>

  </tr>

</table>



<div class="alert is-helpful">



### 下一步

如果你是 Angular 新手，我們建議你跟著[教學課程](tutorial "Tour of Heroes tutorial")學習。


</div>

<br></br><br></br>


{@a install-prerequisites}



## 附錄：Node.js 與 npm


[Node.js](https://nodejs.org/en/) 與 [npm](https://www.npmjs.com/) 套件管理器，是使用 Angular 及其他平台進行現代 Web 開發不可或缺的工具。
Node.js 驅動用戶端開發與建置工具。
_npm_ 套件管理器本身就是一個 _Node.js_ 應用程式，負責安裝 JavaScript 程式庫。

如果你的機器上還沒安裝它們，<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">
現在就取得它們</a>。

**確認你執行的是 Node.js `v8.x` 或更高版本，以及 npm `5.x` 或更高版本**
方法是在終端機／主控台視窗中執行 `node -v` 與 `npm -v` 指令。
較舊的版本會產生錯誤。

我們建議使用 [nvm](https://github.com/creationix/nvm) 來管理多個版本的 Node.js 與 npm。
如果你機器上已有使用其他版本 Node.js 與 npm 的專案在執行，你可能會需要 [nvm](https://github.com/creationix/nvm)。


{@a why-locally}



## 附錄：為什麼要在本機開發

在瀏覽器中進行 <live-example title="QuickStart Seed in Stackblitz">即時程式碼</live-example> 是探索 Angular 的好方法。

幾乎每個文件頁面上的連結，都會在瀏覽器中開啟已完成的範例。
你可以遊玩範例程式碼、與朋友分享你的變更，並把程式碼下載到你自己的機器上執行。

[入門](guide/quickstart "Angular QuickStart Playground")只展示了 `AppComponent` 檔案。
它在內部建立了等同於 `app.module.ts` 與 `main.ts` 的內容，_僅供遊樂場使用_，
讓讀者能不受干擾地探索 Angular。
其他範例則以 QuickStart seed 為基礎。

儘管這很有趣 ...

* 你不能在 Stackblitz 中發布你的應用程式
* 你在寫程式碼時並非總是有網路連線
* 在瀏覽器中轉譯 TypeScript 速度很慢
* 型別支援、重構與程式碼完成功能只有在你的本機 IDE 中才能運作

把 <live-example title="QuickStart Seed in Stackblitz">即時程式碼</live-example> 環境當作 _遊樂場_ 使用，
在那裡嘗試文件範例並自行實驗。
當你想要
<a href="https://github.com/angular/angular/issues/new" title="File a documentation issue">提出文件問題</a> 或
<a href="https://github.com/angular/angular/issues/new" title="File an Angular issue">向 Angular 本身提出問題</a> 時，它是重現錯誤的完美場所。

對於真正的開發，我們強烈建議[在本機開發](guide/setup#develop-locally)。

## 附錄：使用 IE 在本機開發

如果你使用 `ng serve` 在本機開發 angular，瀏覽器與本機開發伺服器之間會自動建立 `websocket` 連線，因此當你的程式碼變更時，瀏覽器可以自動重新整理。

在 windows 中，預設一個應用程式只能有 6 條 websocket 連線，<a href="https://msdn.microsoft.com/library/ee330736%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396#websocket_maxconn" title="MSDN WebSocket settings">MSDN WebSocket 設定</a>。
因此，如果 IE 被手動重新整理或由 `ng serve` 自動重新整理，有時 websocket 會無法正確關閉，當 websocket 連線超過限制時，就會擲出 `SecurityError`，這個錯誤不會影響 angular 應用程式，你只要重新啟動 IE 就能清除這個錯誤，或修改 windows 登錄檔來更新上限。

## 附錄：使用 `fakeAsync()/async()` 進行測試

如果你使用 `fakeAsync()/async()` 輔助函式來執行單元測試（詳情請參閱[測試指南](guide/testing#使用-fakeasync-的非同步測試)），你需要在測試設定檔中匯入 `zone.js/dist/zone-testing`。

<div class="alert is-important">
如果你是使用 `Angular/CLI` 建立專案，`src/test.ts` 中已經匯入它了。
</div>

而在較早版本的 `Angular` 中，下列檔案會被匯入或加入你的 html 檔案：

```
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
```

你仍然可以分別載入這些檔案，但順序很重要，你必須先匯入 `proxy`，再匯入 `sync-test`、`async-test`、`fake-async-test` 與 `jasmine-patch`。而且你還需要先匯入 `sync-test`，再匯入 `jasmine-patch`，因此建議直接匯入 `zone-testing`，而不要分別載入這些檔案。
