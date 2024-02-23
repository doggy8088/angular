# 設置本地環境和工作區

本指南說明如何使用 [Angular CLI](cli "CLI 命令參考") 設定您的 Angular 開發環境。
其中包含關於安裝 CLI、建立初始工作區和入門應用程式，以及在本地端執行該應用程式以驗證您的設定的資訊。

<docs-callout title="在沒有本地端設定的情況下嘗試 Angular">

如果您是 Angular 新手，您可能想要從 [立即試用！](tutorials/learn-angular) 開始，它在您的瀏覽器中介紹了 Angular 的基本知識。
此獨立教學利用互動式 [StackBlitz](https://stackblitz.com) 環境進行線上開發。
您無需設定您的本地環境，直到您準備就緒。

</docs-callout>

## 開始之前

如要使用 Angular CLI，您應熟悉下列事項：

<docs-pill-row>
  <docs-pill href="https://developer.mozilla.org/docs/Web/JavaScript/A_re-introduction_to_JavaScript" title="JavaScript"/>
  <docs-pill href="https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML" title="HTML"/>
  <docs-pill href="https://developer.mozilla.org/docs/Learn/CSS/First_steps" title="CSS"/>
</docs-pill-row>

您還應熟悉命令列介面 (CLI) 工具的使用方式，並對命令殼牌具有一般瞭解。
瞭解 [TypeScript](https://www.typescriptlang.org) 有助益，但不是必要的。

## 依賴

若要將 Angular CLI 安裝至您的本地端系統，您需要安裝 [Node.js](https://nodejs.org/)。
Angular CLI 使用 Node 及其關聯的套件管理員 npm，來安裝和執行瀏覽器以外的 JavaScript 工具。

[下載並安裝 Node.js](https://nodejs.org/en/download)，其中也會包含 `npm` CLI。
Angular 需要一個 [active LTS 或 maintenance LTS](https://nodejs.org/about/releases) 版本的 Node.js。
請參閱 [Angular 的版本相容性](reference/versions) 指南以了解更多資訊。

## 安裝 Angular CLI

若要安裝 Angular CLI，請開啟終端機視窗並執行下列指令：

<docs-code language="shell">

npm install -g @angular/cli

</docs-code>

### Powershell 執行政策

在 Windows 客戶端電腦上，PowerShell 腳本的執行預設為停用，因此上述指令可能會因錯誤而失敗。
若要允許執行 PowerShell 腳本（npm 全域二進位檔案所需要），您必須設定下列 <a href="https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.core/about/about_execution_policies">執行原則</a>：

<docs-code language="sh">

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

</docs-code>

請仔細閱讀執行指令後顯示的訊息，並依照指示進行操作。請務必了解設定執行政策的意義。

### Unix 權限

在某些類 Unix 的設定中，全域 npm 腳本可能由 root 用戶擁有，因此上述指令可能會因權限錯誤而失敗。
使用 `sudo` 以 root 用戶身分執行指令，並在提示時輸入您的密碼：

<docs-code language="sh">

sudo npm install -g @angular/cli

</docs-code>

請務必了解以 root 身份執行命令的含義。

## 建立工作空間和初始應用程式

您在 Angular **工作區**的背景下開發應用程式。

若要建立新的工作區和初始的入門應用程式，執行 CLI 指令 `ng new` 並提供名稱 `my-app`，如下所示，然後回答關於要包含的功能的提示：

<docs-code language="shell">

ng new my-app

</docs-code>

Angular CLI 安裝必要的 Angular npm 套件和其他相依性。
這可能需要幾分鐘時間。

CLI 在一個與工作空間同名的目錄中建立一個新的工作空間和一個小型歡迎應用程式，準備運行。
導航到新的目錄，以便後續命令使用此工作空間。

<docs-code language="shell">

cd my-app

</docs-code>

## 執行應用程式

Angular CLI 包含一個開發伺服器，供您在本地端建置和服務您的應用程式。執行以下指令：

<docs-code language="shell">

ng serve --open

</docs-code>

`ng serve` 命令啟動伺服器，監控您的檔案，並在您對那些檔案進行變更時重新建置應用程式和重新載入瀏覽器。

`--open` (或僅 `-o`) 選項會自動開啟您的瀏覽器至 `http://localhost:4200/` 以檢視產生的應用程式。

## 工作空間和專案檔案

[`ng new`](cli/new) 指令會建立一個 [Angular 工作區](reference/configs/workspace-config) 資料夾，並在其中產生一個新的應用程式。
一個工作區可以包含多個應用程式和函式庫。
[`ng new`](cli/new) 指令建立的初始應用程式位於工作區的根目錄中。
當您在現有工作區中產生一個額外的應用程式或函式庫時，它預設會進入 `projects/` 子資料夾。

新產生的應用程式包含根元件和範本的原始檔。
每個應用程式都有 `src` 資料夾，其中包含其元件、資料和資產。

您可以直接編輯產生的檔案，或使用 CLI 指令新增及修改檔案。
使用 [`ng generate`](cli/generate) 指令新增其他元件、指令、管道、服務等的新檔案。
[`ng add`](cli/add) 和 [`ng generate`](cli/generate) 等指令（用於建立或操作應用程式和程式庫）必須在工作區中執行。
相反地，`ng new` 等指令必須在工作區 *外部* 執行，因為它們會建立新的工作區。

## 後續步驟

* 瞭解有關 [檔案結構](reference/configs/file-structure) 和 [設定](reference/configs/workspace-config) 的更多資訊，以產生工作區。

* 使用 [`ng test`](cli/test) 測試您的新應用程式。

* 使用 [`ng generate`](cli/generate) 產生樣板，例如元件、指令和管線。

* 使用 [`ng deploy`](cli/deploy) 部署您的新應用程式，並使其可供實際使用者使用。

* 使用 [`ng e2e`](cli/e2e) 設定並執行應用程式的端到端測試。
