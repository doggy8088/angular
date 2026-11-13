# CLI 總覽與指令參考

Angular CLI 是一個命令列介面工具，你可以用它初始化、開發、建立骨架與維護 Angular 應用程式。你可以直接在命令殼層中使用這個工具，或透過 [Angular Console](https://angularconsole.com) 這類互動式 UI 間接使用。

## 安裝 Angular CLI

Angular CLI 的主要版本跟隨 Angular 的受支援主要版本，但次要版本可以單獨發佈。

使用 `npm` 套件管理工具安裝 CLI：
<code-example language="bash">
npm install -g @angular/cli
</code-example>

關於各版本之間的變更細節，以及從舊版本更新的資訊，請參閱 GitHub 上的 Releases 頁籤：https://github.com/angular/angular-cli/releases

## 基本工作流程

透過 `ng` 執行檔在命令列上呼叫這個工具。
命令列上提供線上說明。
輸入下列指令可列出某個指令（例如 [generate](cli/generate)）的指令或選項及其簡短說明。

<code-example language="bash">
ng help
ng generate --help
</code-example>

要在開發伺服器上建立、建置並提供新的基本 Angular 專案，請前往新工作區的父目錄，使用下列指令：

<code-example language="bash">
ng new my-first-project
cd my-first-project
ng serve
</code-example>

在瀏覽器中開啟 http://localhost:4200/ 即可看到新應用程式執行。
當你使用 [ng serve](cli/serve) 指令建置應用程式並在本機提供服務時，每當你變更任何來源檔案，伺服器都會自動重新建置應用程式並重新載入頁面。

<div class="alert is-helpful">

   執行 `ng new my-first-project` 時，會在目前的工作目錄中建立一個名為 `my-first-project` 的新資料夾。由於你需要在該資料夾內建立檔案，執行指令前請確認你在目前的工作目錄中有足夠的權限。

   如果目前的工作目錄不適合放你的專案，你可以先執行 `cd <path-to-other-directory>` 切換到更適當的目錄。

</div>

## 工作區與專案檔案

[ng new](cli/new) 指令會建立一個 *Angular 工作區*資料夾，並產生新的應用程式骨架。
一個工作區可以包含多個應用程式與程式庫。
由 [ng new](cli/new) 指令建立的初始應用程式位於工作區的最上層。
當你在工作區中產生額外的應用程式或程式庫時，它會放在 `projects/` 子資料夾中。

新產生的應用程式包含根模組的來源檔案，以及根元件與範本。
每個應用程式都有一個 `src` 資料夾，裡面放著邏輯、資料與資產。

你可以直接編輯產生的檔案，或使用 CLI 指令新增與修改它們。
使用 [ng generate](cli/generate) 指令為額外的元件與服務新增檔案，以及為新的管道、指令等新增程式碼。
像 [add](cli/add) 與 [generate](cli/generate) 這類建立或操作應用程式與程式庫的指令，必須在工作區或專案資料夾內執行。

* 進一步了解[工作區檔案結構](guide/file-structure)。

### 工作區與專案設定

工作區的最上層會建立單一的工作區設定檔 `angular.json`。
你可以在這裡設定每個專案的 CLI 指令選項預設值，並指定 CLI 為不同目標建置專案時要使用的設定。

[ng config](cli/config) 指令可讓你從命令列設定與取得設定值，你也可以直接編輯 `angular.json` 檔案。
請注意，設定檔中的選項名稱必須使用 [camelCase](guide/glossary#大小寫慣例case-types)，而提供給指令的選項名稱則 camelCase 與 dash-case 兩者皆可。

* 進一步了解[工作區設定](guide/workspace-config)。
* 參閱 `angular.json` 的[完整結構定義](https://github.com/angular/angular-cli/wiki/angular-workspace)。

## CLI 指令語法

指令語法如下所示：

`ng` *commandNameOrAlias* *requiredArg* [*optionalArg*] `[options]`

* 大多數指令與部分選項都有別名。別名會顯示在每個指令的語法說明中。

* 選項名稱以雙連字號 (--) 為前綴。
    選項別名以單連字號 (-) 為前綴。
    引數沒有前綴。
    例如：
    <code-example language="bash">
        ng build my-app -c production
    </code-example>

* 一般來說，產生的人工產物名稱可以作為指令的引數提供，或用 --name 選項指定。

* 引數與選項名稱可以使用 [camelCase 或 dash-case](guide/glossary#大小寫慣例case-types)。
`--myOptionName` 與 `--my-option-name` 等效。

### 布林與列舉選項

布林選項有兩種形式：`--thisOption` 會設定旗標，`--noThisOption` 會清除旗標。
如果兩種選項都沒有提供，旗標會保持參考文件所列的預設狀態。

每個列舉選項的說明都會給出允許的值，預設值以**粗體**標示。


### 相對路徑

用來指定檔案的選項可以給絕對路徑，或給相對於目前工作目錄的路徑；目前工作目錄通常是工作區或專案的根目錄。

### 原理圖

[ng generate](cli/generate) 與 [ng add](cli/add) 指令以要產生或加入目前專案的人工產物或程式庫作為引數。
除了一般選項之外，每個人工產物或程式庫會在*原理圖*中定義自己的選項。
原理圖選項以與直接指令選項相同的格式提供給指令。


### 使用 Bazel 建置

你可以選擇將 Angular CLI 設定為使用 [Bazel](https://docs.bazel.build) 作為建置工具。詳情請參閱[使用 Bazel 建置](guide/bazel)。

