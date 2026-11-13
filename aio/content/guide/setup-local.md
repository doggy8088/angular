# 設定本機環境與工作區

本指南說明如何使用 [Angular CLI 工具](cli "CLI command reference") 為 Angular 開發設定你的環境。
內容包括先決條件、安裝 CLI、建立初始工作區與起始應用程式，以及在本機執行該應用程式來驗證你的設定。

<div class="callout is-helpful">
<header>不用在本機設定，直接試用 Angular</header>

如果你是 Angular 新手，或許可以先從 [立即試用！](start)開始，它會在一個現成的基本線上商店應用程式的脈絡中介紹 Angular 的基本概念，供你檢視與修改。這份獨立教學利用互動式 [StackBlitz](https://stackblitz.com/) 環境進行線上開發。在你準備好之前，不需要先設定本機環境。

</div>


{@a devenv}
{@a prerequisites}
## 必要條件

若要使用 Angular 框架，你應該熟悉下列技術：

* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
* [HTML](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML)
* [CSS](https://developer.mozilla.org/docs/Learn/CSS/First_steps)

具備 [TypeScript](https://www.typescriptlang.org/) 知識會很有幫助，但並非必要。

若要在本機系統上安裝 Angular，你需要下列項目：

{@a nodejs}

* **Node.js**

  Angular 需要 [目前、現行 LTS 或維護 LTS](https://nodejs.org/about/releases) 版本的 Node.js。

  <div class="alert is-helpful">

  如需特定版本需求的相關資訊，請參閱 [package.json](https://unpkg.com/@angular/cli/package.json) 檔案中的 `engines` 鍵。

  </div>

  如需更多安裝 Node.js 的資訊，請參閱 [nodejs.org](https://nodejs.org "Nodejs.org")。
  如果你不確定系統上執行的是哪個版本的 Node.js，請在終端機視窗中執行 `node -v`。

{@a npm}

* **npm 套件管理員**

  Angular、Angular CLI 與 Angular 應用程式在許多功能上都依賴 [npm 套件](https://docs.npmjs.com/getting-started/what-is-npm)。
  若要下載並安裝 npm 套件，你需要一個 npm 套件管理員。
  本指南使用 [npm 客戶端](https://docs.npmjs.com/cli/install)命令列介面，它會隨 `Node.js` 一起預設安裝。
  若要確認你已安裝 npm 客戶端，請在終端機視窗中執行 `npm -v`。


{@a install-cli}

## 安裝 Angular CLI

你可以使用 Angular CLI 來建立專案、產生應用程式與函式庫程式碼，並執行各種持續性的開發工作，例如測試、打包與部署。

若要安裝 Angular CLI，請開啟終端機視窗並執行下列指令：

<code-example language="sh">
  npm install -g @angular/cli<aio-angular-dist-tag class="pln"></aio-angular-dist-tag>
</code-example>

{@a create-proj}

## 建立工作區與初始應用程式

你是在 Angular [**工作區**](guide/glossary#工作區workspace)的脈絡下開發應用程式。

要建立新的工作區與初始的入門應用程式：

1. 執行 CLI 指令 `ng new`，並提供名稱 `my-app`，如下所示：

   <code-example language="sh">
      ng new my-app

    </code-example>

2. `ng new` 指令會提示你提供初始應用程式要包含哪些功能的資訊。按下 Enter 或 Return 鍵，接受預設值即可。

Angular CLI 會安裝必要的 Angular npm 套件與其他相依套件。這可能需要幾分鐘。

CLI 會建立一個新的工作區和一個簡單的 Welcome 應用程式，隨時可以執行。

<div class="alert is-helpful">

你也可以選擇使用 Angular 的嚴格模式，它能協助你撰寫更好、更易維護的程式碼。
更多資訊請參閱[嚴格模式](/guide/strict-mode)。

</div>

{@a serve}

## 執行應用程式

Angular CLI 內含一個伺服器，讓你在本機建置並提供你的應用程式。

1. 前往工作區資料夾，例如 `my-app`。

1. 執行下列指令：

<code-example language="sh">
  cd my-app
  ng serve --open
</code-example>

`ng serve` 指令會啟動伺服器、監看你的檔案，
並在你變更這些檔案時重建應用程式。

`--open`（或簡寫 `-o`）選項會自動開啟你的瀏覽器
前往 `http://localhost:4200/`。

如果安裝與設定成功，你應該會看到類似下列的頁面。


<div class="lightbox">
  <img src='generated/images/guide/setup-local/app-works.png' alt="顯示「Welcome to my-app!」的畫面">
</div>


## 後續步驟

* 若要更深入了解 Angular 單頁應用程式架構與設計原則的基本概念與術語，請閱讀 [Angular 概念](guide/architecture)一節。

* 跟著 [英雄之旅教學](tutorial)實作，這是一份完整的動手練習，介紹使用 Angular CLI 的應用程式開發流程，並帶你走過重要的子系統。

* 若要進一步了解如何使用 Angular CLI，請參閱 [CLI 概覽](cli "CLI Overview")。除了建立初始工作區與應用程式鷹架之外，你還可以使用 CLI 來產生 Angular 程式碼，例如元件與服務。CLI 支援完整的開發週期，包括建置、測試、打包與部署。

* 如需更多關於 `ng new` 所產生的 Angular 檔案的資訊，請參閱 [工作區與專案檔案結構](guide/file-structure)。
