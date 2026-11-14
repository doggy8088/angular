# 入門

好的工具能讓應用程式開發更快速，也比凡事親手來更容易維護。

[**Angular CLI**](https://cli.angular.io/) 是一個**_命令列介面_**工具，
它可以建立專案、加入檔案，並執行各種持續性的開發工作，
例如測試、打包與部署。

本指南的目標是使用 Angular CLI，
以 TypeScript 建置並執行一個簡單的 Angular 應用程式，
同時遵循[風格指南](guide/styleguide)的建議，
這些建議對_每個_ Angular 專案都有益。

在本章結束時，你將對使用 CLI 進行開發有基本的了解，
並為這些文件範例與真實世界的應用程式打下基礎。

你也可以<a href="generated/zips/cli-quickstart/cli-quickstart.zip" target="_blank">下載範例。</a>

<h2 id='devenv'>
  步驟 1. 設定開發環境
</h2>



在你做任何事之前，你需要先設定好你的開發環境。

安裝 **[Node.js® 與 npm](https://nodejs.org/en/download/)**
如果它們尚未安裝在你的電腦上。

<div class="alert is-helpful">



**確認你執行的是 Node.js `8.x` 或更高版本，以及 npm `5.x` 或更高版本**
方法是，在終端機／主控台視窗中執行 `node -v` 與 `npm -v`。
舊版本會產生錯誤，但較新的版本沒有問題。

</div>



然後全域安裝 [Angular CLI](https://github.com/angular/angular-cli)。


<code-example language="sh" class="code-shell">
  npm install -g @angular/cli

</code-example>




<h2 id='create-proj'>
  步驟 2. 建立新專案
</h2>



開啟終端機視窗。


執行下列指令來產生新專案與預設應用程式：


<code-example language="sh" class="code-shell">
  ng new my-app

</code-example>


Angular CLI 會安裝所需的 npm 套件、建立專案檔案，並在專案中填入一個簡單的預設應用程式。這可能需要一些時間。



<div class="alert is-helpful">



你可以使用 `ng add` 指令，將預先封裝好的功能加入新專案。`ng add` 指令會套用指定套件中的 schematics 來轉換專案。 
更多資訊，請參閱 [Angular CLI 文件](https://github.com/angular/angular-cli/wiki/add "Angular CLI documentation")。 

Angular Material 為典型的應用程式版面提供 schematics。 
詳見 [Angular Material 文件](https://material.angular.io/guides "Angular Material documentation")。


</div>


<h2 id='serve'>
  步驟 3：提供應用程式
</h2>



前往專案目錄並啟動伺服器。


<code-example language="sh" class="code-shell">
  cd my-app
  ng serve --open
</code-example>



`ng serve` 指令會啟動伺服器、監視你的檔案，
並在你變更這些檔案時重新建置應用程式。

使用 `--open`（或簡寫 `-o`）選項會自動在
`http://localhost:4200/` 開啟你的瀏覽器。

你的應用程式會以一則訊息迎接你：


<figure>
  <img src='generated/images/guide/cli-quickstart/app-works.png' alt="應用程式運作了！">
</figure>




<h2 id='first-component'>
  步驟 4：編輯你的第一個 Angular 元件
</h2>



CLI 已為你建立了第一個 Angular 元件。
這是_根元件_，名為 `app-root`。
你可以在 `./src/app/app.component.ts` 中找到它。


開啟元件檔案，將 `title` 屬性從 `'app'` 改為 `'My First Angular App!'`。


<code-example path="cli-quickstart/src/app/app.component.ts" region="title" title="src/app/app.component.ts" linenums="false"></code-example>



瀏覽器會以修改後的標題自動重新載入。這很不錯，但它可以看起來更好。

開啟 `src/app/app.component.css`，為元件加上一些樣式。


<code-example path="cli-quickstart/src/app/app.component.css" title="src/app/app.component.css" linenums="false"></code-example>



<figure>
  <img src='generated/images/guide/cli-quickstart/my-first-app.png' alt="入門應用程式的輸出">
</figure>



看起來很棒！



## 接下來呢？
這差不多就是你預期在「Hello, World」應用程式中會做的全部事情。

你已準備好進入[英雄之旅教學](tutorial)，建置
一個小型應用程式，展示你能用 Angular 建置的精彩事物。

或者你可以多停留一會兒，了解你嶄新專案中的檔案。



## 專案檔案導覽

Angular CLI 專案是快速實驗與企業解決方案的基礎。

你應該先看的第一個檔案是 `README.md`。
它包含一些關於如何使用 CLI 指令的基本資訊。
每當你想更了解 Angular CLI 的運作方式時，務必造訪
[Angular CLI 儲存庫](https://github.com/angular/angular-cli) 與
[Wiki](https://github.com/angular/angular-cli/wiki)。

有些產生的檔案你可能不熟悉。



### `src` 資料夾
你的應用程式位於 `src` 資料夾中。
所有 Angular 元件、範本、樣式、圖片，以及你的應用程式需要的任何其他東西都放在這裡。
這個資料夾之外的任何檔案，都是用來支援建置你的應用程式的。


<div class='filetree'>
  <div class='file'>src</div>
  <div class='children'>
    <div class='file'>app</div>
    <div class='children'>
      <div class='file'>app.component.css</div>
      <div class='file'>app.component.html</div>
      <div class="file">app.component.spec.ts</div>
      <div class="file">app.component.ts</div>
      <div class="file">app.module.ts</div>
    </div>
    <div class="file">assets</div>
    <div class='children'>
      <div class="file">.gitkeep</div>
    </div>
    <div class="file">environments</div>
    <div class='children'>
      <div class="file">environment.prod.ts</div>
      <div class="file">environment.ts</div>
    </div>
    <div class="file">browserslist</div>
    <div class="file">favicon.ico</div>
    <div class="file">index.html</div>
    <div class="file">karma.conf.js</div>
    <div class="file">main.ts</div>
    <div class="file">polyfills.ts</div>
    <div class="file">styles.css</div>
    <div class="file">test.ts</div>
    <div class="file">tsconfig.app.json</div>
    <div class="file">tsconfig.spec.json</div>
    <div class="file">tslint.json</div>
  </div>
</div>



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

      `app/app.component.{ts,html,css,spec.ts}`

    </td>
    <td>

      定義 `AppComponent`，以及一個 HTML 範本、CSS 樣式表與一個單元測試。
      它是**根**元件，隨著應用程式演進，將成為巢狀元件樹的根。

    </td>
  </tr>
  <tr>
    <td>

      `app/app.module.ts`

    </td>
    <td>

      定義 `AppModule`，也就是告訴 Angular 如何組裝應用程式的[根模組](guide/bootstrapping "AppModule: the root module")。
      目前它只宣告了 `AppComponent`。
      很快就會有更多元件要宣告。

    </td>
  </tr>
  <tr>
    <td>

      `assets/*`

    </td>
    <td>

      一個資料夾，你可以把圖片與任何其他需要在建置應用程式時整批複製的東西放在這裡。

    </td>
  </tr>
  <tr>
    <td>

      `environments/*`

    </td>
    <td>

      這個資料夾為你的每個目標環境各包含一個檔案，
      每個檔案都匯出簡單的設定變數供你的應用程式使用。
      當你建置應用程式時，這些檔案會即時被取代。
      你在開發時使用的 API 端點可能與正式環境不同，
      或者使用不同的分析權杖。
      你甚至可能使用一些模擬服務。
      無論哪種情況，CLI 都能應付。

    </td>
  </tr>
  <tr>
    <td>

      `browserslist`

    </td>
    <td>

      一個設定檔，用於在不同前端工具之間共享[目標瀏覽器](https://github.com/browserslist/browserslist)。

    </td>
  </tr>  
  <tr>
    <td>

      `favicon.ico`

    </td>
    <td>

      每個網站都想在書籤列上好看。
      從你自己的 Angular 圖示開始吧。

    </td>
  </tr>
  <tr>
    <td>

      `index.html`

    </td>
    <td>

      當有人造訪你的網站時所提供的主要 HTML 頁面。
      大多數時候你都不需要編輯它。
      CLI 在建置你的應用程式時會自動加入所有 `js` 與 `css` 檔案，
      所以你永遠不需要在這裡手動加入任何 `<script>` 或 `<link>` 標籤。

    </td>
  </tr>
  <tr>
    <td>

      `karma.conf.js`

    </td>
    <td>

      [Karma 測試執行器](https://karma-runner.github.io) 的單元測試設定，
      在執行 `ng test` 時使用。

    </td>
  </tr>  
  <tr>
    <td>

      `main.ts`

    </td>
    <td>

      你的應用程式的主要進入點。
      使用 [JIT 編譯器](guide/glossary#jit) 編譯應用程式，
      並啟動應用程式的根模組（`AppModule`）在瀏覽器中執行。
      你也可以只要在 `ng build` 與 `ng serve` 指令加上 `--aot` 旗標，
      不變更任何程式碼就使用 [AOT 編譯器](guide/aot-compiler)。

    </td>
  </tr>
  <tr>
    <td>

      `polyfills.ts`

    </td>
    <td>

      不同瀏覽器對網路標準的支援程度不同。
      Polyfill 有助於消弭這些差異。
      使用 `core-js` 與 `zone.js` 應該相當安全，但請務必參閱
      [瀏覽器支援指南](guide/browser-support)以了解更多資訊。

    </td>
  </tr>
  <tr>
    <td>

      `styles.css`

    </td>
    <td>

      你的全域樣式放在這裡。
      大多數時候，你會想把區域樣式放在元件中以便於維護，
      但影響整個應用程式的樣式需要放在一個集中的地方。

    </td>
  </tr>
  <tr>
    <td>

      `test.ts`

    </td>
    <td>

      這是你的單元測試的主要進入點。
      它有一些你可能不熟悉的自訂設定，但這不是你需要編輯的東西。
    </td>
  </tr>
  <tr>
    <td>

      `tsconfig.{app|spec}.json`
    </td>
    <td>

      Angular 應用程式（`tsconfig.app.json`）
      與單元測試（`tsconfig.spec.json`）的 TypeScript 編譯器設定。

    </td>
  </tr>
  <tr>
    <td>

      `tslint.json`

    </td>
    <td>

      [TSLint](https://palantir.github.io/tslint/) 與
      [Codelyzer](http://codelyzer.com/) 的額外 Lint 設定，在執行 `ng lint` 時使用。
      Lint 有助於保持你的程式碼風格一致。

    </td>
  </tr>  
</table>

### 根資料夾

`src/` 資料夾只是專案根資料夾中的其中一項。
其他檔案協助你建置、測試、維護、記錄與部署應用程式。
這些檔案放在根資料夾中，與 `src/` 並列。


<div class='filetree'>
  <div class="file">my-app</div>
  <div class='children'>
    <div class="file">e2e</div>
    <div class='children'>
      <div class="file">src</div>
      <div class='children'>
        <div class="file">app.e2e-spec.ts</div>
        <div class="file">app.po.ts</div>
      </div>      
      <div class="file">tsconfig.e2e.json</div>
      <div class="file">protractor.conf.js</div>
    </div>
    <div class="file">node_modules/...</div>
    <div class="file">src/...</div>
    <div class='children'>
      <div class="file">karma.conf.js</div>
    </div>    
    <div class="file">.editorconfig</div>
    <div class="file">.gitignore</div>
    <div class="file">angular.json</div>
    <div class="file">package.json</div>
    <div class="file">README.md</div>
    <div class="file">tsconfig.json</div>
    <div class="file">tslint.json</div>
  </div>
</div>

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

      `e2e/`

    </td>
    <td>

      端到端測試位於 `e2e/` 之中。
      它們不應該放在 `src/` 裡，因為 e2e 測試實際上是一個獨立的應用程式，
      只是恰好用來測試你的主要應用程式。
      這也是它們有自己的 `tsconfig.e2e.json` 的原因。

    </td>
  </tr>
  <tr>
    <td>

      `node_modules/`

    </td>
    <td>

      `Node.js` 建立這個資料夾，並將 `package.json` 中列出的所有第三方模組放在其中。
    </td>
  </tr>
  <tr>
    <td>

      `.editorconfig`

    </td>
    <td>

      為你的編輯器提供的簡單設定，確保每個使用你專案的人
      都有相同的基本設定。
      大多數編輯器都支援 `.editorconfig` 檔案。
      詳見 http://editorconfig.org。

    </td>
  </tr>
  <tr>
    <td>

      `.gitignore`

    </td>
    <td>

      Git 設定，確保自動產生的檔案不會提交至原始碼控制。

    </td>
  </tr>
  <tr>
    <td>

      `angular.json`

    </td>
    <td>

      Angular CLI 的設定。
      在這個檔案中，你可以設定數個預設值，也可以設定建置專案時
      要包含哪些檔案。
      如果你想了解更多，請查看官方文件。

    </td>
  </tr>
  <tr>
    <td>

      `package.json`

    </td>
    <td>

      `npm` 設定，列出你的專案使用的第三方套件。
      你也可以在這裡加入你自己的[自訂腳本](https://docs.npmjs.com/misc/scripts)。

    </td>
  </tr>
  <tr>
    <td>

      `protractor.conf.js`

    </td>
    <td>

      [Protractor](http://www.protractortest.org/) 的端到端測試設定，
      在執行 `ng e2e` 時使用。

    </td>
  </tr>
  <tr>
    <td>

      `README.md`

    </td>
    <td>

      你的專案的基本文件，預先填入了 CLI 指令資訊。
      務必以專案文件加以充實，好讓任何
      取出儲存庫的人都能建置你的應用程式！

    </td>
  </tr>
  <tr>
    <td>

      `tsconfig.json`

    </td>
    <td>

      TypeScript 編譯器設定，供你的 IDE 讀取並提供有用的工具支援。

    </td>
  </tr>
  <tr>
    <td>

      `tslint.json`

    </td>
    <td>

      [TSLint](https://palantir.github.io/tslint/) 與
      [Codelyzer](http://codelyzer.com/) 的 Lint 設定，在執行 `ng lint` 時使用。
      Lint 有助於保持你的程式碼風格一致。

    </td>
  </tr>
</table>

<div class="alert is-helpful">

### 下一步

如果你是 Angular 新手，請繼續進行
[教學](tutorial "Tour of Heroes tutorial")。
你可以跳過「Setup」步驟，因為你已經在使用 Angular CLI 的設定了。

</div>
