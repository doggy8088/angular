# Angular Language Service

Angular Language Service 讓程式碼編輯器能在 Angular 範本中提供自動完成、錯誤提示、提示資訊與導航功能。 它既支援放在個別 HTML 檔案中的外部範本，也支援內嵌範本。

## 為 Angular Language Service 設定編譯器選項

若要啟用最新的 Language Service 功能，請在 `tsconfig.json` 中設定 `strictTemplates` 選項：將 `strictTemplates` 設為 `true,`，如下例所示：

<code-example language="json">

  "angularCompilerOptions": {
    "strictTemplates": true
  }

</code-example>

更多資訊請參閱 [Angular 編譯器選項](guide/angular-compiler-options)指南。

## 功能

你的編輯器會自動偵測你開啟的是 Angular 檔案。 接著它會使用 Angular Language Service 讀取你的 `tsconfig.json` 檔案，找出應用程式中的所有範本，並為你開啟的任何範本提供語言服務。

語言服務包括：

*   自動完成清單
*   AOT 診斷訊息
*   快速資訊
*   前往定義

### 自動完成

自動完成能在你輸入時提供符合情境的候選項目與提示，加快你的開發速度。 這個範例展示了內插中的自動完成。 輸入過程中，你可以按下 tab 鍵完成輸入。

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-completion.gif" alt="自動完成">
</div>

元素內部也有程式碼補全功能。你作為元件選擇器使用的任何元素，都會出現在補全清單中。

### 錯誤檢查

Angular 語言服務可以預先提醒你程式碼中的錯誤。在這個範例中，Angular 不知道 `orders` 是什麼，也不知道它來自哪裡。

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-error.gif" alt="錯誤檢查">
</div>

### 快速資訊與導覽

快速資訊功能讓你將滑鼠停留在上方，就能看到元件、指令與模組來自哪裡。接著你可以點選「移至定義」，或按下 F12 直接前往定義。

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-navigation.gif" alt="導覽">
</div>

## 編輯器中的 Angular 語言服務

Angular 語言服務目前以擴充功能的形式提供，適用於 [Visual Studio Code](https://code.visualstudio.com)、[WebStorm](https://www.jetbrains.com/webstorm)、[Sublime Text](https://www.sublimetext.com) 與 [Eclipse IDE](https://www.eclipse.org/eclipseide)。

### Visual Studio Code

在 [Visual Studio Code](https://code.visualstudio.com) 中，請從 [擴充功能：市集](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)安裝擴充功能。使用左側選單窗格中的擴充功能圖示從編輯器開啟市集，或使用 VS 快速開啟（Mac 上為 ⌘+P，Windows 上為 CTRL+P）並輸入「? ext」。在市集中搜尋 Angular Language Service 擴充功能，並點按 **Install** 按鈕。

Visual Studio Code 與 Angular 語言服務的整合由 Angular 團隊維護與發佈。

### Visual Studio

在 [Visual Studio](https://visualstudio.microsoft.com) 中，請從 [擴充功能：市集](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService)安裝擴充功能。從編輯器頂端選單窗格中選取「擴充功能」，再選取「管理擴充功能」，即可開啟市集。在市集中搜尋 Angular Language Service 擴充功能，並點按 **Install** 按鈕。

Visual Studio 與 Angular 語言服務的整合由 Microsoft 在 Angular 團隊的協助下維護與發佈。專案請見[這裡](https://github.com/microsoft/vs-ng-language-service)。

### WebStorm

在 [WebStorm](https://www.jetbrains.com/webstorm) 中，啟用 [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs) 外掛。

自 WebStorm 2019.1 起，不再需要 `@angular/language-service`，應將其從 `package.json` 中移除。

### Sublime Text

在 [Sublime Text](https://www.sublimetext.com) 中，語言服務在安裝為外掛程式時，僅支援行內範本。若要在 HTML 檔案中取得補全功能，你需要一個自訂的 Sublime 外掛程式（或修改現有的外掛程式）。

若要在行內範本中使用語言服務，你必須先加入一個擴充功能以支援 TypeScript，再安裝 Angular 語言服務外掛程式。從 TypeScript 2.3 開始，TypeScript 具有語言服務可以使用的外掛程式模型。

1.  在本地的 `node_modules` 目錄中安裝最新版 TypeScript：

```sh
npm install --save-dev typescript
```

1.  在相同位置安裝 Angular 語言服務套件：

```sh
npm install --save-dev @angular/language-service
```

1.  套件安裝完成後，將下列內容加入專案 `tsconfig.json` 的 `"compilerOptions"` 區段。

<code-example language="json" header="tsconfig.json">
  "plugins": [
      {"name": "@angular/language-service"}
  ]
</code-example>

1. 在編輯器的使用者偏好設定（`Cmd+,` 或 `Ctrl+,`）中加入下列內容：

<code-example language="json" header="Sublime Text user preferences">
"typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"
</code-example>

這能讓 Angular 語言服務在 `.ts` 檔案中提供診斷與補全功能。

### Eclipse IDE

直接安裝內含 Angular 語言伺服器的「Eclipse IDE for Web and JavaScript developers」套件，或從其他 Eclipse IDE 套件中，使用 Help &gt; Eclipse Marketplace 尋找並安裝 [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml)。

## 語言服務的運作方式

當你使用具有語言服務的編輯器時，編輯器會啟動一個獨立的語言服務程序，並透過 [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call)，使用[語言伺服器通訊協定](https://microsoft.github.io/language-server-protocol)與它通訊。當你在編輯器中輸入時，編輯器會將資訊傳送給語言服務程序，以追蹤專案的狀態。

當你在範本中觸發補全清單時，編輯器會先將範本解析為 HTML [抽象語法樹（AST）](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。Angular 編譯器會解讀該樹以判斷上下文：範本屬於哪個模組、目前的作用域、元件選擇器，以及你的游標在範本 AST 中的位置。接著它就能判斷該位置可能出現的符號。

如果你在插值中，情況會稍微複雜一點。如果你在 `div` 中有一個 `{{data.---}}` 的插值，並需要在 `data.---` 之後取得補全清單，編譯器無法使用 HTML AST 找到答案。HTML AST 只能告訴編譯器，存在一些包含「`{{data.---}}`」字元的文字。這時範本解析器會產生一個運算式 AST，它位於範本 AST 之內。接著 Angular 語言服務會在其上下文中查看 `data.---`，詢問 TypeScript 語言服務 `data` 的成員有哪些，並回傳可能性的清單。

## 更多資訊

*   若要進一步深入了解實作，請見 [Angular 語言服務 API](https://github.com/angular/angular/blob/master/packages/language-service/src/types.ts)。
*   若要進一步了解設計考量與意圖，請見[此處的設計文件](https://github.com/angular/vscode-ng-language-service/wiki/Design)。
*   另請參閱 [Chuck Jazdzewski 的演講](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s)，那是他在 [ng-conf](https://www.ng-conf.org/) 2017 年關於 Angular 語言服務的演講。

