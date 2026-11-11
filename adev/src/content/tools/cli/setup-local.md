# 設定本機環境與工作區

本指南說明如何使用 [Angular CLI](cli 'CLI command reference') 為 Angular 開發設定你的環境。
內容包括安裝 CLI、建立初始工作區與起始應用程式，以及在本機執行該應用程式來驗證你的設定。

<docs-callout title="不需本機設定也能試用 Angular">

如果你是 Angular 新手，或許可以先從[立即試用！](tutorials/learn-angular)開始，它會在你的瀏覽器中介紹 Angular 的核心概念。
這份獨立教學利用互動式的 [StackBlitz](https://stackblitz.com) 環境進行線上開發。
在你準備好之前，不需要設定本機環境。

</docs-callout>

## 開始之前

若要使用 Angular CLI，你應該熟悉下列技術：

<docs-pill-row>
  <docs-pill href="https://developer.mozilla.org/docs/Web/JavaScript/A_re-introduction_to_JavaScript" title="JavaScript"/>
  <docs-pill href="https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML" title="HTML"/>
  <docs-pill href="https://developer.mozilla.org/docs/Learn/CSS/First_steps" title="CSS"/>
</docs-pill-row>

你也應該熟悉命令列介面（CLI）工具的使用方式，並對命令殼層有基本的了解。
了解 [TypeScript](https://www.typescriptlang.org) 會有幫助，但不是必需的。

## 相依套件

若要在本機系統上安裝 Angular CLI，你需要安裝 [Node.js](https://nodejs.org/)。
Angular CLI 使用 Node 及其搭配的套件管理器 npm，在瀏覽器之外安裝並執行 JavaScript 工具。

[下載並安裝 Node.js](https://nodejs.org/en/download)，其中也會包含 `npm` CLI。
Angular 需要 Node.js 的[現行 LTS 或維護 LTS](https://nodejs.org/en/about/previous-releases) 版本。
詳情請參閱 Angular 的[版本相容性](reference/versions)指南。

## 安裝 Angular CLI {#install-the-angular-cli}

若要安裝 Angular CLI，請開啟終端機視窗並執行下列指令：

<docs-code-multifile>
   <docs-code
     header="npm"
     >
     npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     >
     pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     >
     yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     >
     bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

### PowerShell 執行原則

在 Windows 用戶端電腦上，PowerShell 指令碼的執行預設是停用的，因此上述指令可能會失敗並出現錯誤。
若要允許執行 PowerShell 指令碼（npm 全域執行檔需要這項設定），你必須設定下列<a href="https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies">執行原則</a>：

<docs-code language="sh">

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

</docs-code>

請仔細閱讀執行指令後顯示的訊息，並依照指示操作。務必了解設定執行原則的影響。

### Unix 權限

在某些類 Unix 設定中，全域指令碼可能歸 root 使用者所有，因此上述指令可能會失敗並出現權限錯誤。
使用 `sudo` 以 root 使用者身分執行指令，並在出現提示時輸入你的密碼：

<docs-code-multifile>
   <docs-code
     header="npm"
     >
     sudo npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     >
     sudo pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     >
     sudo yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     >
     sudo bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

務必了解以 root 身分執行指令的影響。

## 建立工作區與初始應用程式

你在 Angular **工作區**的脈絡下開發應用程式。

若要建立新的工作區與初始起始應用程式，請執行 CLI 指令 `ng new` 並提供名稱 `my-app`，如下所示，然後回答要包含哪些功能的提示：

<docs-code language="shell">

ng new my-app

</docs-code>

Angular CLI 會安裝必要的 Angular npm 套件與其他相依套件。
這可能需要幾分鐘。

CLI 會在與工作區同名的新目錄中建立一個新工作區和一個小型的歡迎應用程式，隨時可以執行。
切換到新目錄，讓後續指令使用這個工作區。

<docs-code language="shell">

cd my-app

</docs-code>

## 執行應用程式

Angular CLI 包含一個開發伺服器，讓你在本機建置並提供你的應用程式。執行下列指令：

<docs-code language="shell">

ng serve --open

</docs-code>

`ng serve` 指令會啟動伺服器、監視你的檔案，並在你變更這些檔案時重新建置應用程式並重新載入瀏覽器。

`--open`（或簡寫 `-o`）選項會自動開啟你的瀏覽器，前往 `http://localhost:4200/` 檢視產生的應用程式。

## 工作區與專案檔案

[`ng new`](cli/new) 指令會建立一個 [Angular 工作區](reference/configs/workspace-config)資料夾，並在其中產生一個新應用程式。
一個工作區可以包含多個應用程式與程式庫。
由 [`ng new`](cli/new) 指令建立的初始應用程式位於工作區的根目錄。
當你在既有工作區中產生額外的應用程式或程式庫時，它預設會進入 `projects/` 子資料夾。

新產生的應用程式包含根元件與範本的原始檔案。
每個應用程式都有一個 `src` 資料夾，裡面放著它的元件、資料與素材。

你可以直接編輯產生的檔案，或用 CLI 指令來新增與修改它們。
使用 [`ng generate`](cli/generate) 指令，為額外的元件、指令、管道、服務等新增檔案。
像 [`ng add`](cli/add) 與 [`ng generate`](cli/generate) 這類建立應用程式與程式庫或對其進行操作的指令，必須在工作區_內部_執行。相對地，像 `ng new` 這類指令必須在工作區_外部_執行，因為它們會建立新的工作區。

## 後續步驟

- 深入了解產生之工作區的[檔案結構](reference/configs/file-structure)與[設定](reference/configs/workspace-config)。

- 用 [`ng test`](cli/test) 測試你的新應用程式。

- 用 [`ng generate`](cli/generate) 產生元件、指令、管道等樣板程式碼。

- 用 [`ng deploy`](cli/deploy) 部署你的新應用程式，讓真正的使用者可以使用。

- 用 [`ng e2e`](cli/e2e) 設定並執行應用程式的端對端測試。

