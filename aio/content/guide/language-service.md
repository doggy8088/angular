# Angular Language Service

Angular Language Service 是一種在 Angular 範本中取得自動完成、錯誤、提示與導覽的方式，無論範本是放在 HTML 檔案中的外部範本，或是以字串形式內嵌在註解/裝飾器中。Angular Language Service 會自動偵測你開啟的是 Angular 檔案，讀取你的 `tsconfig.json` 檔案，找出應用程式中的所有範本，並為你開啟的任何範本提供語言服務。

## 自動完成

自動完成能在你輸入時提供符合情境的候選項目與提示，加快你的開發速度。這個範例展示了內插中的自動完成。輸入過程中，你可以按下 tab 鍵完成輸入。

<figure>
  <img src="generated/images/guide/language-service/language-completion.gif" alt="自動完成">
</figure>

元素內部也有自動完成。你作為元件選擇器使用的任何元素，都會出現在自動完成清單中。

## 錯誤檢查

Angular Language Service 也能預先提醒你程式碼中的錯誤。在這個範例中，Angular 不知道 `orders` 是什麼，也不知道它來自哪裡。

<figure>
  <img src="generated/images/guide/language-service/language-error.gif" alt="錯誤檢查">
</figure>

## 導覽

導覽讓你將滑鼠停留在上方，就能看到元件、指令、模組等來自哪裡，接著點選並按下 F12 直接前往其定義。

<figure>
  <img src="generated/images/guide/language-service/language-navigation.gif" alt="導覽">
</figure>

## 編輯器中的 Angular Language Service

Angular Language Service 目前可用於 [Visual Studio Code](https://code.visualstudio.com/) 和
[WebStorm](https://www.jetbrains.com/webstorm)。

### Visual Studio Code

在 Visual Studio Code 中，請從商店安裝 Angular Language Service，該商店可透過左側選單窗格底部的圖示存取。你也可以使用 VS 快速開啟（⌘+P）搜尋擴充功能。開啟後，請輸入下列命令：

```sh
ext install Angular.ng-template
```

接著按一下安裝按鈕，安裝 Angular Language Service。

### WebStorm

在 WebStorm 中，你必須將語言服務安裝為開發相依性。當 Angular 看到這個開發相依性時，便會在 WebStorm 內提供語言服務。WebStorm 接著除了 Angular Language Service 之外，還會在範本中提供著色和自動完成。

你的 `package.json` 中需要加入的開發相依性如下：

```json

devDependencies {
	"@angular/language-service": "^4.0.0"
}
```

接著，在專案根目錄的終端機視窗中，以 `npm` 或 `yarn` 安裝 `devDependencies`：

```sh
npm install 
```
*OR* 

```sh
yarn
```

*OR*

```sh
yarn install
```

### Sublime Text

在 [Sublime Text](https://www.sublimetext.com/) 中，你首先需要一個允許 TypeScript 的擴充功能。在本機的 `node_modules` 目錄中安裝最新版的 TypeScript：

```sh
npm install --save-dev typescript
```

接著在相同位置安裝 Angular Language Service：
```sh
npm install --save-dev @angular/language-service
```

從 TypeScript 2.3 開始，TypeScript 具有語言服務可以使用的語言服務外掛模型。

接著，在你的使用者偏好設定（`Cmd+,` 或 `Ctrl+,`）中加入：

```json
"typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"
```

## 在專案中安裝

你也可以使用下列 `npm` 命令，在你的專案中安裝 Angular Language Service：

```sh
npm install --save-dev @angular/language-service
```
此外，將下列內容加入你的專案 `tsconfig.json` 的 `"compilerOptions"` 區段。

```json
  "plugins": [
      {"name": "@angular/language-service"}
  ]
```
請注意，這只會在 `.ts` 檔案中提供診斷與補全。
若要在 HTML 檔案中取得補全，你需要自訂的 Sublime 外掛（或修改目前的外掛）。

## 語言服務的運作方式

當你使用具有語言服務的編輯器時，會有一個編輯器處理程序，它會啟動一個獨立的語言處理程序/服務，並透過 [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) 與其通訊。每當你在編輯器中輸入時，它會將資訊傳送到另一個處理程序，以追蹤你專案的狀態。當你在範本中觸發完成清單時，編輯器處理程序會先將範本剖析為 HTML AST，或 [抽象語法樹](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。接著，Angular 編譯器會解讀範本屬於哪個模組、你所在的範圍，以及元件選擇器。然後，它會判斷你的游標位於範本 AST 中的哪個位置。判斷出情境後，它就能判斷子元素可以是什麼。

如果你在內插中，情況會稍微複雜一點。如果你在 `div` 中有一個 `{{data.---}}` 的內插，並需要在 `data.---` 之後取得補全清單，編譯器無法使用 HTML AST 找到答案。HTML AST 只能告訴編譯器，存在一些包含「`{{data.---}}`」字元的文字。這時範本解析器會產生一個運算式 AST，它位於範本 AST 之內。接著 Angular Language Service 會在其上下文中查看 `data.---`，詢問 TypeScript Language Service `data` 的成員有哪些。TypeScript 接著便回傳可能性的清單。

如需更深入的資訊，請參見
[Angular Language Service API](https://github.com/angular/angular/blob/master/packages/language-service/src/types.ts)

<hr>

## 更多資訊

如需更多資訊，請參見 Chuck Jazdzewski 在 [ng-conf](https://www.ng-conf.org/) 2017 關於 Angular Language Service 的[演講](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s)。
