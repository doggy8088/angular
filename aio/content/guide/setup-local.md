# 設定本機環境與工作區

本指南說明如何使用 [Angular CLI 工具](cli "CLI command reference") 為 Angular 開發設定你的環境。
內容包括先決條件、安裝 CLI、建立初始工作區與起始應用程式，以及在本機執行該應用程式來驗證你的設定。

<div class="callout is-helpful">
<header>學習 Angular</header>

如果你是 Angular 新手，請參閱 [入門](start)。入門會在建置基本線上商店應用程式的脈絡中，協助你快速學習 Angular 的基本概念。它利用 [StackBlitz](https://stackblitz.com/) 線上開發環境，所以在你準備好之前，不需要先設定本機環境。

</div>


{@a devenv}
{@a prerequisites}
## 必要條件

在你開始之前，請確定你的開發環境包含 `Node.js®` 與一個 npm 套件管理員。

{@a nodejs}
### Node.js

Angular 需要 `Node.js` 10.9.0 或更新版本。

* 若要檢查你的版本，請在終端機／主控台視窗中執行 `node -v`。

* 若要取得 `Node.js`，請前往 [nodejs.org](https://nodejs.org "Nodejs.org")。

{@a npm}
### npm 套件管理員

Angular、Angular CLI 與 Angular 應用程式，都依賴以 [npm 套件](https://docs.npmjs.com/getting-started/what-is-npm) 形式提供的程式庫所提供的特色與功能。若要下載並安裝 npm 套件，你必須有一個 npm 套件管理員。

本設定指南使用 [npm 客戶端](https://docs.npmjs.com/cli/install)命令列介面，它會隨 `Node.js` 一起預設安裝。

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

你是在 Angular [**工作區**](guide/glossary#工作區（workspace）)的脈絡下開發應用程式。

要建立新的工作區與初始的入門應用程式：

1. 執行 CLI 指令 `ng new`，並提供名稱 `my-app`，如下所示：

    <code-example language="sh" class="code-shell">
      ng new my-app

    </code-example>

2. `ng new` 指令會提示你提供初始應用程式要包含哪些功能的資訊。按下 Enter 或 Return 鍵，接受預設值即可。

Angular CLI 會安裝必要的 Angular npm 套件與其他相依套件。這可能需要幾分鐘。

CLI 會建立一個新的工作區和一個簡單的 Welcome 應用程式，隨時可以執行。

{@a serve}

## 步驟 3：執行應用程式

Angular CLI 內含一個伺服器，讓你可以輕鬆在本機建置並提供你的應用程式。

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


<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/setup-local/app-works.png' alt="顯示「Welcome to my-app!」的畫面">
  </div>
</figure>


## 後續步驟

* 如果你是 Angular 新手，請參閱 [入門](start)教學。入門會在建置基本線上商店應用程式的脈絡中，協助你快速學習 Angular 的基本概念。

  <div class="alert is-helpful">

  入門使用的是 [StackBlitz](https://stackblitz.com/) 線上開發環境。
  若要了解如何將應用程式從 StackBlitz 匯出到你的本機環境，請直接跳至 [Deployment](start/deployment "Getting Started: Deployment") 一節。

  </div>


* 若要進一步了解如何使用 Angular CLI，請參閱 [CLI 概覽](cli "CLI Overview")。除了建立初始工作區與應用程式鷹架之外，你還可以使用 CLI 來產生 Angular 程式碼，例如元件與服務。CLI 支援完整的開發週期，包括建置、測試、打包與部署。

* 如需更多關於 `ng new` 所產生的 Angular 檔案的資訊，請參閱 [工作區與專案檔案結構](guide/file-structure)。
