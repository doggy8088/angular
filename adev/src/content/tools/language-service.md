# Angular Language Service

Angular Language Service 讓程式碼編輯器能在 Angular 範本中提供自動完成、錯誤提示、提示資訊與導航功能。
它既支援放在個別 HTML 檔案中的外部範本，也支援內嵌範本。

## 為 Angular Language Service 設定編譯器選項

若要啟用最新的 Language Service 功能，請在 `tsconfig.json` 中將 `strictTemplates` 選項設為 `true`，如下例所示：

<docs-code language="json">

"angularCompilerOptions": {
  "strictTemplates": true
}

</docs-code>

更多資訊請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options)指南。

## 功能

你的編輯器會自動偵測你開啟的是 Angular 檔案。
接著它會使用 Angular Language Service 讀取你的 `tsconfig.json` 檔案，找出應用程式中的所有範本，並為你開啟的任何範本提供語言服務。

語言服務包括：

* 自動完成清單
* AOT 診斷訊息
* 快速資訊
* 前往定義

### 自動完成

自動完成能在你輸入時提供符合情境的候選項目與提示，加快你的開發速度。
這個範例展示了內插中的自動完成。
輸入過程中，你可以按下 tab 鍵完成輸入。

<img alt="自動完成" src="assets/images/guide/language-service/language-completion.gif">

元素內部也有自動完成可用。
凡是你用作元件選擇器的元素，都會出現在自動完成清單中。

### 錯誤檢查

Angular Language Service 能預先警告你程式碼中的錯誤。
在這個範例中，Angular 不知道 `orders` 是什麼，也不知道它來自何處。

<img alt="錯誤檢查" src="assets/images/guide/language-service/language-error.gif">

### 快速資訊與導航

快速資訊功能讓你將滑鼠懸停在項目上，查看元件、指令與模組來自何處。
接著你可以點選「Go to definition」，或按下 F12 直接前往定義。

<img alt="導航" src="assets/images/guide/language-service/language-navigation.gif">

## 在你的編輯器中使用 Angular Language Service

Angular Language Service 目前以擴充功能形式提供給 [Visual Studio Code](https://code.visualstudio.com)、[WebStorm](https://www.jetbrains.com/webstorm)、[Sublime Text](https://www.sublimetext.com) 與 [Eclipse IDE](https://www.eclipse.org/eclipseide)。

### Visual Studio Code

在 [Visual Studio Code](https://code.visualstudio.com) 中，從 [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) 安裝擴充功能。
使用編輯器左側選單窗格的「Extensions」圖示開啟市集，或使用 VS Quick Open（Mac 上是 ⌘+P、Windows 上是 CTRL+P）並輸入「? ext」。
在市集中搜尋 Angular Language Service 擴充功能，點選 **Install** 按鈕。

Visual Studio Code 與 Angular Language Service 的整合由 Angular 團隊維護並發行。

### Visual Studio

在 [Visual Studio](https://visualstudio.microsoft.com) 中，從 [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService) 安裝擴充功能。
從編輯器頂部選單窗格選取「Extensions」開啟市集，再選取「Manage Extensions」。
在市集中搜尋 Angular Language Service 擴充功能，點選 **Install** 按鈕。

Visual Studio 與 Angular Language Service 的整合由 Microsoft 在 Angular 團隊的協助下維護並發行。
專案詳見[這裡](https://github.com/microsoft/vs-ng-language-service)。

### WebStorm

在 [WebStorm](https://www.jetbrains.com/webstorm) 中，啟用 [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs) 外掛程式。

自 WebStorm 2019.1 起，不再需要 `@angular/language-service`，應將它從你的 `package.json` 中移除。

### Sublime Text

在 [Sublime Text](https://www.sublimetext.com) 中，Language Service 以外掛程式安裝時只支援內嵌範本。
若要在 HTML 檔案中使用自動完成，你需要自訂的 Sublime 外掛程式（或修改現有的外掛程式）。

若要為內嵌範本使用 Language Service，你必須先加入一個擴充功能來啟用 TypeScript，再安裝 Angular Language Service 外掛程式。
自 TypeScript 2.3 起，TypeScript 具備語言服務可使用的外掛程式模型。

1. 在本機的 `node_modules` 目錄中安裝最新版的 TypeScript：

    <docs-code language="shell">

    npm install --save-dev typescript

    </docs-code>

1. 在相同位置安裝 Angular Language Service 套件：

    <docs-code language="shell">

    npm install --save-dev @angular/language-service

    </docs-code>

1. 套件安裝完成後，將下列內容加入你專案 `tsconfig.json` 的 `"compilerOptions"` 區段。

    <docs-code header="tsconfig.json" language="json">

    "plugins": [
        {"name": "@angular/language-service"}
    ]

    </docs-code>

1. 在你的編輯器使用者偏好設定（`Cmd+,` 或 `Ctrl+,`）中，加入下列內容：

    <docs-code header="Sublime Text user preferences" language="json">

    "typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"

    </docs-code>

如此一來，Angular Language Service 就能在 `.ts` 檔案中提供診斷與自動完成。

### Eclipse IDE

你可以直接安裝內含 Angular Language Server 的「Eclipse IDE for Web and JavaScript developers」套件；或者從其他 Eclipse IDE 套件中，使用「Help > Eclipse Marketplace」尋找並安裝 [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml)。

### Neovim

#### 搭配 Node.js 的 Conquer of Completion

Angular Language Service 使用 tsserver，而 tsserver 並未完全遵循 LSP 規格。因此，如果你在 Neovim 或 Vim 中使用 JavaScript、TypeScript 或 Angular，你可能會發現 [Conquer of Completion](https://github.com/neoclide/coc.nvim)（COC）對 Angular Language Service 與 tsserver 的實作最為完整。這是因為 COC 移植了 VSCode 的 tsserver 實作，能配合 tsserver 的實作方式。

1. [設定 coc.nvim](https://github.com/neoclide/coc.nvim)

2. 設定 Angular Language Service

    安裝完成後，執行 `CocConfig` 這個 Vim 命令列指令，開啟設定檔 `coc-settings.json`，並加入 angular 屬性。

    請務必將路徑正確替換為你全域 `node_modules` 的路徑，讓它們分別指向包含 `tsserver` 與 `ngserver` 的目錄。

    <docs-code header="CocConfig example file coc-settings.json" language="json">
    {
      "languageserver": {
        "angular": {
          "command": "ngserver",
          "args": [
            "--stdio",
            "--tsProbeLocations",
            "/usr/local/lib/node_modules/typescript/lib/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES", 
            "--ngProbeLocations",
            "/usr/local/lib/node_modules/@angular/language-server/bin/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES"
          ],
          "filetypes": ["ts", "typescript", "html"],
          "trace.server.verbosity": "verbose"
        }
      }
    }
    </docs-code>

HELPFUL: 上方的 `/usr/local/lib/node_modules/typescript/lib` 與 `/usr/local/lib/node_modules/@angular/language-server/bin` 應指向你全域 node 模組的位置，你的實際路徑可能不同。

#### 內建的 Neovim LSP

Angular Language Service 可以搭配 [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) 外掛程式在 Neovim 中使用。

1. [安裝 nvim-lspconfig](https://github.com/neovim/nvim-lspconfig?tab=readme-ov-file#install)

2. [為 nvim-lspconfig 設定 angularls](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#angularls)

## Language Service 的運作方式

當你使用具備語言服務的編輯器時，編輯器會啟動一個獨立的語言服務程序，並透過 [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call)，使用 [Language Server Protocol](https://microsoft.github.io/language-server-protocol) 與它通訊。
當你在編輯器中輸入時，編輯器會傳送資訊給語言服務程序，以追蹤你專案的狀態。

當你在範本中觸發自動完成清單時，編輯器會先將範本解析成 HTML [抽象語法樹（AST）](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。
Angular 編譯器會解讀這棵樹來判斷情境：範本屬於哪個模組、目前的範圍、元件選擇器，以及你的游標在範本 AST 中的位置。
接著它就能判斷在該位置可能出現哪些符號。

如果你是在內插中，過程會稍微複雜一些。
如果你在一個 `div` 中有一個 `{{data.---}}` 內插，需要在 `data.---` 之後取得自動完成清單，編譯器無法單靠 HTML AST 找到答案。
HTML AST 只能告訴編譯器，這裡有一段包含「`{{data.---}}`」字元的文字。
這時範本解析器會產生一個運算式 AST，它位於範本 AST 之內。
接著 Angular Language Service 會在它的情境中檢視 `data.---`，詢問 TypeScript Language Service `data` 有哪些成員，並回傳候選清單。

## 更多資訊

* 實作的深入資訊請參閱 [Angular Language Service 原始碼](https://github.com/angular/angular/blob/main/packages/language-service/src)
* 設計考量與意圖請參閱[這裡的設計文件](https://github.com/angular/vscode-ng-language-service/wiki/Design)
