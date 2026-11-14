# 入門

歡迎使用 Angular！Angular 協助你為 Web、行動裝置或桌面建置現代應用程式。

本指南將示範如何建置並執行一個簡單的 Angular
應用程式。你將使用 [Angular CLI 工具](cli "CLI command reference") 來加速開發，
同時遵循[風格指南](guide/styleguide "Angular style guide")的建議，
讓_每個_ Angular 專案都受益。

完成本指南不需要 30 分鐘。
在本指南的最後&mdash;作為最終程式碼審查的一部分&mdash;有一個連結，可以下載最終應用程式程式碼的副本。（即使你沒有執行本指南中的指令，你仍然可以下載最終應用程式程式碼。）


{@a devenv}
{@a prerequisites}
## 必要條件

在開始之前，請確定你的開發環境包含 `Node.js®` 與一個 npm 套件管理員。

{@a nodejs}
### Node.js

Angular 需要 `Node.js` 8.x 或 10.x 版。

* 若要檢查你的版本，請在終端機／主控台視窗中執行 `node -v`。

* 若要取得 `Node.js`，請前往 [nodejs.org](https://nodejs.org "Nodejs.org")。

{@a npm}
### npm 套件管理員

Angular、Angular CLI 與 Angular 應用程式，都依賴以 [npm 套件](https://docs.npmjs.com/getting-started/what-is-npm) 形式提供的程式庫所提供的特色與功能。若要下載並安裝 npm 套件，你必須有一個 npm 套件管理員。

本快速入門使用 [npm 客戶端](https://docs.npmjs.com/cli/install)命令列介面，它會隨 `Node.js` 一起預設安裝。

若要確認你已安裝 npm 客戶端，請在終端機／主控台視窗中執行 `npm -v`。


{@a install-cli}

## 步驟 1：安裝 Angular CLI

你可以使用 Angular CLI
來建立專案、產生應用程式與函式庫程式碼，並執行各種持續性的開發工作，例如測試、打包與部署。

在全域安裝 Angular CLI。

若要使用 `npm` 安裝 CLI，請開啟終端機／主控台視窗，並輸入下列指令：


<code-example language="sh" class="code-shell">
  npm install -g @angular/cli

</code-example>



{@a create-proj}

## 步驟 2：建立工作區與初始應用程式

你是在 Angular [**工作區**](guide/glossary#工作區（workspace）)的脈絡下開發應用程式。工作區包含一個或多個 [**專案**](guide/glossary/#專案（project）)的檔案。專案是構成應用程式、函式庫或端對端（e2e）測試的檔案集合。

要建立新的工作區與初始應用程式專案：

1. 執行 CLI 指令 `ng new`，並提供名稱 `my-app`，如下所示：

    <code-example language="sh" class="code-shell">
      ng new my-app

    </code-example>

2. `ng new` 指令會提示你提供初始應用程式要包含哪些功能的資訊。按下 Enter 或 Return 鍵，接受預設值即可。

Angular CLI 會安裝必要的 Angular npm 套件與其他相依套件。這可能需要幾分鐘。

它還會建立下列工作區與起始專案檔案：

* 一個新的工作區，根資料夾名為 `my-app`
* 一個初始的骨架應用程式專案，同樣稱為 `my-app`（位於 `src` 子資料夾中）
* 一個端對端測試專案（位於 `e2e` 子資料夾中）
* 相關的設定檔案

初始應用程式專案包含一個簡單的 Welcome 應用程式，隨時可以執行。

{@a serve}

## 步驟 3：執行應用程式

Angular 內含一個伺服器，讓你可以輕鬆在本機建置並提供你的應用程式。

1. 前往工作區資料夾（`my-app`）。

1. 使用 CLI 指令 `ng serve` 並加上 `--open` 選項，啟動伺服器。

<code-example language="sh" class="code-shell">
  cd my-app
  ng serve --open
</code-example>

`ng serve` 指令會啟動伺服器、監看你的檔案，
並在你變更這些檔案時重建應用程式。

`--open`（或簡寫 `-o`）選項會自動開啟你的瀏覽器
前往 `http://localhost:4200/`。

你的應用程式會以一則訊息歡迎你：


<figure>
  <img src='generated/images/guide/cli-quickstart/app-works.png' alt="顯示「Welcome to my-app!」的畫面">
</figure>



{@a first-component}

## 步驟 4：編輯你的第一個 Angular 元件

[**_元件_**](guide/glossary#元件（component）)是 Angular 應用程式的基本建置區塊。
它們在畫面上顯示資料、監聽使用者輸入，並根據該輸入採取行動。

作為初始應用程式的一部分，CLI 已為你建立了第一個 Angular 元件。它就是_根元件_，名稱為 `app-root`。

1. 開啟 `./src/app/app.component.ts`。

2. 將 `title` 屬性從 `'my-app'` 變更為 `'My First Angular App'`。

    <code-example path="cli-quickstart/src/app/app.component.ts" region="component" header="src/app/app.component.ts" linenums="false"></code-example>

    瀏覽器會自動以修訂後的標題重新載入。這樣很好，但它可以看起來更好。

3. 開啟 `./src/app/app.component.css`，並為元件加入一些樣式。

    <code-example path="cli-quickstart/src/app/app.component.css" header="src/app/app.component.css" linenums="false"></code-example>

看起來不錯！

<figure>
  <img src='generated/images/guide/cli-quickstart/my-first-app.png' alt="入門應用程式的輸出結果">
</figure>




{@a project-file-review}

## 最終程式碼審查

你可以<a href="generated/zips/cli-quickstart/cli-quickstart.zip" target="_blank">下載</a>你在本入門指南中建立的應用程式範例。


<div class="alert is-helpful">

**提示：** 大多數 Angular 指南都包含連結，讓你可以下載範例檔案並在 [Stackblitz](http://www.stackblitz.com) 中執行即時範例，這樣你就可以看到 Angular 概念與程式碼的實際運作。


</div>


關於 Angular 專案檔案與檔案結構的更多資訊，請參閱[工作區與專案檔案結構](guide/file-structure)。




## 後續步驟

現在你已經瞭解了 Angular 應用程式與 Angular CLI 的要點，可以接著使用這些其他的入門教材：

* [英雄之旅教學](tutorial "Tour of Heroes tutorial")提供額外的動手學習機會。它會引導你完成建置一個應用程式的步驟，該應用程式協助人力仲介公司管理一組超級英雄員工。
它具備你預期在資料驅動的應用程式中會看到的許多功能：

        - 取得並顯示一組項目清單

        - 編輯所選取項目的詳細資訊

        - 在資料的不同檢視間導覽


* [架構指南](guide/architecture "Architecture guide")說明了模組、元件、服務與依賴注入（DI）等關鍵概念。它為更深入的指南提供了基礎，這些指南專門介紹特定的 Angular 概念與功能。

在完成教學與架構指南後，你將準備好透過本文件集的其他指南與參考資料，自行繼續探索 Angular，專注於對你的應用程式最重要的功能。
