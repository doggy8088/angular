# CLI 總覽與指令參考

Angular CLI 是一套命令列介面工具，讓你直接從命令殼層初始化、開發、建立骨架並維護 Angular 應用程式。

## 安裝 Angular CLI

Angular CLI 的主版本跟隨 Angular 受支援的主版本，但次版本可以獨立發行。

使用 `npm` 套件管理器安裝 CLI：

<code-example format="shell" language="shell">

npm install -g &commat;angular/cli<aio-angular-dist-tag class="pln"></aio-angular-dist-tag>

</code-example>

關於各版本之間的變更詳情，以及從舊版更新的資訊，請參閱 GitHub 上的 Releases 頁籤：https://github.com/angular/angular-cli/releases

## 基本工作流程

透過 `ng` 執行檔在命令列上呼叫這個工具。
命令列上有線上說明可用。
輸入以下指令，即可列出指定指令（例如 [new](cli/new)）的指令或選項及簡短說明。

<code-example format="shell" language="shell">

ng --help
ng new --help

</code-example>

若要在開發伺服器上建立、建置並提供一個新的基本 Angular 專案，請先到新工作區的父目錄，再使用以下指令：

<code-example format="shell" language="shell">

ng new my-first-project
cd my-first-project
ng serve

</code-example>

在瀏覽器中開啟 http://localhost:4200/，即可看到新應用程式執行。
使用 [ng serve](cli/serve) 指令建置應用程式並在本機提供服務時，只要你變更任何原始檔案，伺服器就會自動重新建置應用程式並重新載入頁面。

<div class="alert is-helpful">

執行 `ng new my-first-project` 時，會在目前的工作目錄中建立一個名為 `my-first-project` 的新資料夾。
由於你需要在該資料夾內建立檔案，執行指令前請確認你在目前工作目錄中有足夠的權限。

如果目前的工作目錄不適合放你的專案，可以執行 `cd <path-to-other-directory>` 切換到更合適的目錄。

</div>

## 工作區與專案檔案

[ng new](cli/new) 指令會建立一個 *Angular 工作區*資料夾，並產生新的應用程式骨架。
一個工作區可以包含多個應用程式與程式庫。
由 [ng new](cli/new) 指令建立的初始應用程式位於工作區的最上層。
在工作區中產生額外的應用程式或程式庫時，它會放進 `projects/` 子資料夾。

新產生的應用程式包含根模組的原始檔案，以及一個根元件與範本。
每個應用程式都有一個 `src` 資料夾，包含邏輯、資料與資產。

你可以直接編輯產生的檔案，或使用 CLI 指令新增與修改它們。
使用 [ng generate](cli/generate) 指令，為額外的元件與服務新增檔案，以及新管道、指令等的程式碼。
[add](cli/add) 與 [generate](cli/generate) 這類建立應用程式與程式庫、或對其操作的指令，必須在工作區或專案資料夾內執行。

*   進一步瞭解請參閱[工作區檔案結構](guide/file-structure)。

### 工作區與專案設定

工作區最上層會建立單一個工作區設定檔 `angular.json`。
你可以在這裡設定各專案的 CLI 指令選項預設值，並指定 CLI 為不同目標建置專案時要使用的設定。

[ng config](cli/config) 指令讓你從命令列設定與取得設定值，你也可以直接編輯 `angular.json` 檔案。

<div class="alert is-helpful">

**NOTE**: <br />
設定檔中的選項名稱必須使用 [camelCase](guide/glossary#case-types)，提供給指令的選項名稱則必須使用 dash-case。

</div>

*   進一步瞭解請參閱[工作區設定](guide/workspace-config)。

## CLI 指令語言語法

指令語法表示如下：

`ng` *<command-name>* *<required-arg>* [*optional-arg*] `[options]`

*   大多數指令與部分選項都有別名。
    別名會顯示在各指令的語法說明中。

*   選項名稱以雙破折號（`--`）字元作為前綴。
    選項別名以單破折號（`-`）字元作為前綴。
    引數沒有前綴。
    例如：

    <code-example format="shell" language="shell">

    ng build my-app -c production

    </code-example>

*   一般來說，產生之產物的名稱可以作為引數傳給指令，或用 `--name` 選項指定。

*   引數與選項名稱必須使用 [dash-case](guide/glossary#case-types)。
    例如：`--my-option-name`

### 布林選項

布林選項有兩種形式：`--this-option` 將旗標設為 `true`，`--no-this-option` 設為 `false`。
若兩者都沒有提供，旗標會保持參考文件中所列的預設狀態。

### 陣列選項

陣列選項可以用兩種形式提供：`--option value1 value2` 或 `--option value1 --option value2`。

### 相對路徑

指定檔案的選項可以給絕對路徑，或相對於目前工作目錄的路徑；目前工作目錄一般是工作區或專案根目錄。

### 原理圖

[ng generate](cli/generate) 與 [ng add](cli/add) 指令以引數接收要產生或加入目前專案的產物或程式庫。
除了一般選項之外，每個產物或程式庫還會在 *原理圖* 中定義自己的選項。
原理圖選項以與直接指令選項相同的格式提供給指令。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
