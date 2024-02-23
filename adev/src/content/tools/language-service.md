# Angular Language Service

Angular 語言服務為程式碼編輯器提供一種在 Angular 範本中取得完成、錯誤、提示和導覽的方式。
它適用於獨立 HTML 檔案中的外部範本，也適用於內嵌範本。

## 為 Angular 語言服務設定編譯器選項

如要啟用最新的語言服務功能，請在 `tsconfig.json` 中將 `strictTemplates` 選項設為 `true`，如下例所示：

<docs-code language="json">

"angularCompilerOptions": {
  "strictTemplates": true
}

</docs-code>

有關更多資訊，請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options)指南。

## 特色

您的編輯器會自動偵測您正在開啟一個 Angular 檔案。
然後它會使用 Angular 語言服務來讀取您的 `tsconfig.json` 檔案，找到您應用程式中的所有範本，然後為您開啟的任何範本提供語言服務。

語言服務包括：

* 自動完成清單
* AOT 診斷訊息
* 快速資訊
* 前往定義

### 自動完成

自動完成功能會在您輸入時提供您情境可能性和提示，從而加快您的開發時間。
此範例顯示插補中的自動完成功能。
在您輸入時，您可以按下 tab 鍵來完成。

<img alt="自動完成功能" src="https://angular.dev/assets/images/guide/language-service/language-completion.gif">

元素內也有補全功能。

您作為元件選擇器擁有的任何元素都將顯示在補全清單中。

### 錯誤檢查

Angular 語言服務可以預先警告您程式碼中的錯誤。
在此範例中，Angular 不知道 `orders` 是什麼或它從何而來。

<img alt="錯誤檢查" src="https://angular.dev/assets/images/guide/language-service/language-error.gif">

### 快速資訊與導覽

快速資訊功能讓您將滑鼠懸停在元件、指令和模組上，以查看它們的來源。
然後，您可以按一下「前往定義」或按 F12 直接前往定義。

<img alt="navigation" src="https://angular.dev/assets/images/guide/language-service/language-navigation.gif">

## 編輯器中的 Angular 語言服務

html
<p>
  The Angular Language Service provides a number of features that make it easier to develop Angular applications in your editor. These features include:
</p>
<ul>
  <li>Autocompletion</li>
  <li>Syntax highlighting</li>
  <li>Error checking</li>
  <li>Navigation</li>
  <li>Refactoring</li>
</ul>
<p>
  To use the Angular Language Service, you need to install the Angular extension for your editor. The extension is available for a variety of editors, including Visual Studio Code, Atom, and Sublime Text.
</p>
<p>
  Once you have installed the extension, you can enable the Angular Language Service by opening the settings for your editor and selecting the "Angular" checkbox.
</p>
<p>
  The Angular Language Service will then be available in your editor. You can use the features of the service by typing in your Angular code.
</p>

Angular 語言服務目前可作為 [Visual Studio Code](https://code.visualstudio.com)、[WebStorm](https://www.jetbrains.com/webstorm)、[Sublime Text](https://www.sublimetext.com) 和 [Eclipse IDE](https://www.eclipse.org/eclipseide) 的擴充功能。

### Visual Studio Code

在 [Visual Studio Code](https://code.visualstudio.com) 中，從 [擴充功能：市集](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) 安裝擴充功能。
使用左側功能表窗格上的擴充功能圖示，或使用 VS 快速開啟（Mac 上的 ⌘+P，Windows 上的 CTRL+P），然後輸入「? ext」來從編輯器開啟市集。
在市集中搜尋 Angular 語言服務擴充功能，然後按一下 **安裝** 按鈕。

Visual Studio Code 與 Angular 語言服務的整合是由 Angular 團隊維護和分發。

### Visual Studio

在 [Visual Studio](https://visualstudio.microsoft.com) 中，從 [擴充功能：市集](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService) 安裝擴充功能。
從頂端功能表窗格選擇擴充功能，然後選擇管理擴充功能，即可從編輯器開啟市集。
在市集中，搜尋 Angular 語言服務擴充功能，然後按一下 **安裝** 按鈕。

Visual Studio 與 Angular 語言服務的整合由 Microsoft 與 Angular 團隊共同維護和發行。
查看[此處](https://github.com/microsoft/vs-ng-language-service)的專案。

### WebStorm

在 [WebStorm](https://www.jetbrains.com/webstorm) 中，啟用外掛程式 [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs)。

自 WebStorm 2019.1 起，不再需要 `@angular/language-service`，並應從 `package.json` 中移除它。

### Sublime Text

在 [Sublime Text](https://www.sublimetext.com) 中，當作為外掛安裝時，語言服務僅支援內聯範本。
您需要一個自訂 Sublime 外掛（或對目前外掛的修改）才能在 HTML 檔案中完成。

若要使用內嵌範本的語言服務，您必須先新增一個擴充功能來允許 TypeScript，然後安裝 Angular 語言服務外掛程式。

從 TypeScript 2.3 開始，TypeScript 具備語言服務可使用的外掛程式模型。

1. 在本機 `node_modules` 目錄中安裝最新版本的 TypeScript：

    <docs-code language="shell">

    npm install --save-dev typescript

    </docs-code>

1. 在相同的位置安裝 Angular 語言服務套件：

    <docs-code language="shell">

    npm install --save-dev &commat;angular/language-service

    </docs-code>

1. 套件安裝完成後，將下列內容新增到專案 `tsconfig.json` 的 `"compilerOptions"` 區段。

    <docs-code header="tsconfig.json" language="json">

    "plugins": [
        {"name": "&commat;angular/language-service"}
    ]

    </docs-code>

1. 在編輯器的使用者偏好設定中\(`Cmd+,` 或 `Ctrl+,`\)，新增下列內容：

    <docs-code header="Sublime Text 使用者偏好設定" language="json">

    "typescript-tsdk": "&lt;路徑至您的資料夾&gt;/node_modules/typescript/lib"

    </docs-code>

這讓 Angular Language Service 能在 `.ts` 檔案中提供診斷和補全。

### Eclipse IDE

可以直接安裝附帶 Angular 語言伺服器的「Eclipse IDE for Web and JavaScript developers」套件，或從其他 Eclipse IDE 套件中使用「說明」>「Eclipse Marketplace」尋找並安裝 [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml)。

## 語言服務如何運作

當您使用具有語言服務的編輯器時，編輯器會啟動一個獨立的語言服務程序，並透過 [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) 使用 [語言伺服器協定](https://microsoft.github.io/language-server-protocol) 與之通訊。
當您在編輯器中輸入時，編輯器會將資訊傳送給語言服務程序來追蹤專案狀態。

當你在範本中觸發完成清單時，編輯器會先將範本解析成 HTML [抽象語法樹 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。
Angular 編譯器會解譯該樹以判斷內容：範本屬於哪個模組、目前的範圍、元件選擇器，以及你的遊標在範本 AST 中的位置。
然後，它可以判斷可能在該位置的符號。

如果您在內插法中，這會涉及更多內容。
如果在 `div` 內部有 `{{data.---}}` 的內插法，並且需要在 `data.---` 之後顯示完成清單，編譯器無法使用 HTML AST 來尋找答案。
HTML AST 只會告訴編譯器，有一些文字包含字元 "`{{data.---}}`"。
這是範本解析器產生表達式 AST 的時候，它位於範本 AST 內部。
然後 Angular 語言服務會在自己的內容中查看 `data.---`，詢問 TypeScript 語言服務 `data` 的成員是什麼，並傳回可能性清單。

## 更多資訊

* 如需有關實作的更深入資訊，請參閱 [Angular Language Service 來源](https://github.com/angular/angular/blob/main/packages/language-service/src)
* 如需有關設計考量和意圖的更多資訊，請參閱 [此處的設計文件](https://github.com/angular/vscode-ng-language-service/wiki/Design)
