# 從 AngularJS 升級的設定

<!--tode: Question: Can we remove this file and instead direct readers to https://github.com/angular/quickstart/blob/master/README.md -->

<div class="alert is-critical">

**適用對象**： <br />
請**僅**在[從 AngularJS 升級](guide/upgrade "從 AngularJS 升級到 Angular")或[為提升效能而升級](guide/upgrade-performance "為提升效能而升級")的脈絡下使用本指南。
那些升級指南會參照本設定指南，以了解如何使用[已被棄用的 QuickStart GitHub 儲存庫](https://github.com/angular/quickstart "已被棄用的 Angular QuickStart GitHub 儲存庫")，該儲存庫是在目前的 Angular [CLI](cli "CLI 總覽")之前建立的。

**對於所有其他情境**，請參閱[設定本機環境與工作區](guide/setup-local "設定本機開發環境")中的最新指示。

</div>

<!--
The <live-example name=quickstart>QuickStart live-coding</live-example> example is an Angular *playground*.
There are also some differences from a local app, to simplify that live-coding experience.
In particular, the QuickStart live-coding example shows just the AppComponent file; it creates the equivalent of app.module.ts and main.ts internally for the playground only.
-->

本指南說明如何在你自己的機器上進行本機開發。在你的機器上建立新專案既快速又簡單，只要使用 [GitHub 上的 QuickStart 種子](https://github.com/angular/quickstart "Install the github QuickStart repo")即可。

## 先決條件

請確認你已安裝 [Node.js&reg; 與 npm](guide/setup-local#必要條件 "Angular prerequisites")。

<a id="clone"></a>

## 複製

使用下列終端機指令，執行*複製到啟動*的步驟。

<code-example format="shell" language="shell">

git clone https://github.com/angular/quickstart.git quickstart
cd quickstart
npm install

</code-example>

<a id="download"></a>

## 下載

[下載 QuickStart 種子](https://github.com/angular/quickstart/archive/master.zip "Download the QuickStart seed repository")並將其解壓縮到你的專案資料夾中。接著使用下列終端機指令執行其餘步驟。

<code-example format="shell" language="shell">

cd quickstart
npm install

</code-example>

<a id="non-essential"></a>

## 刪除*非必要*檔案（選用）

你可以快速刪除與測試及 QuickStart 儲存庫維護有關的*非必要*檔案（***包括所有與 git 相關的產物***，例如 `.git` 資料夾與 `.gitignore`）。

<div class="alert is-important">

請只在一開始這麼做，以免不小心刪除你自己的測試與 git 設定。

</div>

在專案資料夾中開啟終端機視窗，並依你的環境輸入下列指令：

### macOS / Mac OS X (bash)

<code-example format="shell" language="shell">

xargs rm -rf &lt; non-essential-files.osx.txt
rm src/app/*.spec*.ts
rm non-essential-files.osx.txt

</code-example>

### Windows

<code-example format="shell" language="shell">

for /f %i in (non-essential-files.txt) do del %i /F /S /Q
rd .git /s /q
rd e2e /s /q

</code-example>

## 更新相依性版本

由於 QuickStart 儲存庫已被棄用，它不再更新，你需要一些額外的步驟才能使用最新版 Angular。

1.  移除已過時的 `@angular/http` 套件（同時從 `package.json > dependencies` 與 `src/systemjs.config.js > SystemJS.config() > map` 中移除）。
1.  執行下列指令，安裝 Angular 框架套件的最新版本：

    <code-example format="shell" language="shell">

    npm install --save &commat;angular/common&commat;latest &commat;angular/compiler&commat;latest &commat;angular/core&commat;latest &commat;angular/forms&commat;latest &commat;angular/platform-browser&commat;latest &commat;angular/platform-browser-dynamic&commat;latest &commat;angular/router&commat;latest

    </code-example>

1.  執行下列指令，安裝 Angular 所使用的其他套件的最新版本（RxJS、TypeScript、Zone.js）：

    <code-example format="shell" language="shell">

    npm install --save rxjs&commat;latest zone.js&commat;latest
    npm install --save-dev typescript&commat;latest

    </code-example>

1.  安裝 `systemjs-plugin-babel` 套件。之後會用它來載入 Angular 框架檔案，這些檔案是 ES2015 格式，需使用 SystemJS 載入。

    <code-example format="shell" language="shell">

    npm install --save systemjs-plugin-babel&commat;latest

    </code-example>

1.  為了能夠正確載入最新版 Angular 框架套件（ES2015 格式），請替換 `src/systemjs.config.js` 中的相關項目：

    <code-examples format="javascript" language="javascript" path="upgrade-phonecat-2-hybrid/systemjs.config.1.js" region="angular-paths"></code-example>

1.  為了能夠正確載入最新版 RxJS 套件，請替換 `src/systemjs.config.js` 中的相關項目：

    <code-examples format="javascript" language="javascript" path="upgrade-phonecat-2-hybrid/systemjs.config.1.js" region="rxjs-paths"></code-example>

1.  為了能夠載入 `tslib` 套件（TypeScript 轉譯檔案所需），請在 `src/systemjs.config.js` 中加入下列項目：

    <code-examples format="javascript" language="javascript" path="upgrade-phonecat-2-hybrid/systemjs.config.1.js" region="tslib-paths"></code-example>

1.  為了讓 SystemJS 能夠正確載入 ES2015 格式的 Angular 檔案，請在 `src/systemjs.config.js` 中加入下列項目：

    <code-examples format="javascript" language="javascript" path="upgrade-phonecat-2-hybrid/systemjs.config.1.js" region="plugin-babel"></code-example>

1.  最後，為了避免相依性的 TypeScript 型別檢查錯誤，請在 `src/tsconfig.json` 中加入下列項目：

    <code-example format="json" language="json">

    {
      "compilerOptions": {
        "skipLibCheck": true,
        // &hellip;
      }
    }

    </code-example>

這樣一來，你現在可以執行 `npm start` 來建置並提供應用程式。建置完成後，應用程式會自動在新的瀏覽器分頁中開啟，而且當你修改原始碼時會自動重新載入。

<a id="seed"></a>

## QuickStart 種子裡有什麼？

**QuickStart 種子**提供了一個基本的 QuickStart 遊樂場應用程式，以及本機開發所需的其他檔案。因此，你機器上的專案資料夾中有許多檔案，其中大部分你可以在之後[進一步了解](guide/file-structure)。

<div class="alert is-helpful">

**提醒：**「QuickStart 種子」範例是在 Angular CLI 之前建立的，因此此處所述內容與 Angular CLI 應用程式之間有些差異。

</div>

<a id="app-files"></a>

請聚焦於 `/src` 資料夾中的以下三個 TypeScript（`.ts`）檔案。

<div class="filetree">
  <div class="file">
    src
  </div>
  <div class="children">
    <div class="file">
      app
    </div>
    <div class="children">
      <div class="file">
        app.component.ts
      </div>
      <div class="file">
        app.module.ts
      </div>
    </div>
    <div class="file">
      main.ts
    </div>
  </div>
</div>

<code-tabs>
    <code-pane header="src/app/app.component.ts" path="setup/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.module.ts" path="setup/src/app/app.module.ts"></code-pane>
    <code-pane header="src/main.ts" path="setup/src/main.ts"></code-pane>
</code-tabs>

所有的指南與食譜都*至少有這些核心檔案*。每個檔案各有其獨特用途，並隨著應用程式成長而獨立演進。

`src/` 以外的檔案涉及應用程式的建置、部署與測試，包括設定檔與外部相依性。

`src/` 內的檔案「屬於」你的應用程式。請在 `src/` 目錄中新增 Typescript、HTML 與 CSS 檔案，大多放在 `src/app` 內，除非另有指示。

以下檔案都在 `src/` 中：

| 檔案 | 用途 |
|:---                  |:---     |
| app/app.component.ts | 定義與 QuickStart 遊樂場中相同的 `AppComponent`。它是**根**元件，隨著應用程式演進，會成為巢狀元件樹的根。|
| app/app.module.ts | 定義 `AppModule`，也就是[根模組](guide/bootstrapping "AppModule: the root module")，它告訴 Angular 如何組裝應用程式。最初建立時，它只宣告 `AppComponent`。隨著時間推移，你會加入更多要宣告的元件。|
| main.ts | 使用 [JIT 編譯器](guide/glossary#jit)編譯應用程式，並[啟動](guide/bootstrapping)應用程式的主要模組（`AppModule`）以在瀏覽器中執行。JIT 編譯器是大多數專案開發期間合理的選擇，也是像 Stackblitz 這類*即時編碼*環境中唯一可行的選擇。另外還有[編譯](guide/aot-compiler)、[建置](guide/build)與[部署](guide/deployment)選項可供選用。|

## 附錄：使用 `fakeAsync()/waitForAsync()` 進行測試

如果你使用 `fakeAsync()` 或 `waitForAsync()` 輔助函式來執行單元測試（詳情請參閱[測試指南](guide/testing-components-scenarios#fake-async)），你需要在測試設定檔中匯入 `zone.js/testing`。

<div class="alert is-important">

如果你使用 `Angular/CLI` 建立專案，它已經匯入在 `src/test.ts` 中。

</div>

而在較早版本的 `Angular` 中，下列檔案是匯入或加入到你的 html 檔案中的：

<code-example format="html" language="html">

import 'zone.js/plugins/long-stack-trace-zone';
import 'zone.js/plugins/proxy';
import 'zone.js/plugins/sync-test';
import 'zone.js/plugins/jasmine-patch';
import 'zone.js/plugins/async-test';
import 'zone.js/plugins/fake-async-test';

</code-example>

你仍然可以分別載入這些檔案，但順序很重要，你必須在 `sync-test`、`async-test`、`fake-async-test` 與 `jasmine-patch` 之前匯入 `proxy`。而且你還需要在 `jasmine-patch` 之前匯入 `sync-test`，所以建議直接匯入 `zone-testing`，而不是分別載入這些檔案。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
