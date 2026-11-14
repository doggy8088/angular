# Angular Language Service

Angular Language Service 是一種在 Angular 範本中取得自動完成、錯誤、提示與導覽的方式，無論範本是放在 HTML 檔案中的外部範本，或是以字串形式內嵌在註解/裝飾器中。Angular Language Service 會自動偵測你開啟的是 Angular 檔案，讀取你的 `tsconfig.json` 檔案，找出應用程式中的所有範本，並為你開啟的任何範本提供語言服務。


## 自動完成

自動完成能在你輸入時提供符合情境的候選項目與提示，加快你的開發速度。這個範例展示了內插中的自動完成。輸入過程中，你可以按下 tab 鍵完成輸入。

<figure>
  <img src="generated/images/guide/language-service/language-completion.gif" alt="自動完成">
</figure>

元素內部也有程式碼補全功能。你作為元件選擇器使用的任何元素，都會出現在補全清單中。

## 錯誤檢查

Angular 語言服務可以預先提醒你程式碼中的錯誤。在這個範例中，Angular 不知道 `orders` 是什麼，也不知道它來自哪裡。

<figure>
  <img src="generated/images/guide/language-service/language-error.gif" alt="錯誤檢查">
</figure>

## 導覽

導覽讓你將滑鼠停留在上方，就能看到元件、指令、模組等來自哪裡，接著點選並按下 F12 直接前往其定義。

<figure>
  <img src="generated/images/guide/language-service/language-navigation.gif" alt="導覽">
</figure>


## 編輯器中的 Angular Language Service

Angular Language Service 目前可用於 [Visual Studio Code](https://code.visualstudio.com/) 與 [WebStorm](https://www.jetbrains.com/webstorm)。

### Visual Studio Code

在 Visual Studio Code 中，從商店安裝 Angular Language Service，該商店可透過左側選單窗格底部的圖示開啟。你也可以使用 VS 快速開啟（Mac 上為 ⌘+P，Windows 上為 CTRL+P）搜尋擴充功能。開啟後，輸入下列命令：

```sh
ext install Angular.ng-template
```

接著點按安裝按鈕，安裝 Angular Language Service。


### WebStorm

在 WebStorm 中，你必須將語言服務安裝為開發依賴。當 Angular 看到這個開發依賴時，便會在 WebStorm 內提供語言服務。接著，除了 Angular Language Service 之外，WebStorm 還會在範本中提供色彩標示與自動完成。

你需要在 `package.json` 中加入的開發依賴如下：

```json
devDependencies {
  "@angular/language-service": "^6.0.0"
}
```

在專案根目錄的終端機視窗中，使用 `npm` 或 `yarn` 安裝 `devDependencies`：

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

在 [Sublime Text](https://www.sublimetext.com/) 中，你首先需要一個支援 TypeScript 的擴充功能。在本地的 `node_modules` 目錄中安裝最新版 TypeScript：

```sh
npm install --save-dev typescript
```

接著在相同位置安裝 Angular Language Service：
```sh
npm install --save-dev @angular/language-service
```

從 TypeScript 2.3 開始，TypeScript 具有語言服務可以使用的外掛程式模型。

接著，在你的使用者偏好設定（`Cmd+,` 或 `Ctrl+,`）中加入：

```json
"typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"
```


## 在專案中安裝

你也可以用下列 `npm` 命令在專案中安裝 Angular Language Service：

```sh
npm install --save-dev @angular/language-service
```
此外，將下列內容加入專案 `tsconfig.json` 的 `"compilerOptions"` 區段。

```json
  "plugins": [
      {"name": "@angular/language-service"}
  ]
```
請注意，這只會在 `.ts` 檔案中提供診斷與補全功能。若要在 HTML 檔案中取得補全功能，你需要一個自訂的 Sublime 外掛程式（或修改現有的外掛程式）。


## 語言服務的運作方式

當你使用具有語言服務的編輯器時，編輯器程序會啟動一個獨立的語言程序/服務，並透過 [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) 與它通訊。每當你在編輯器中輸入，編輯器就會將資訊傳送給另一個程序，以追蹤專案的狀態。當你在範本中觸發補全清單時，編輯器程序會先將範本解析為 HTML AST，也就是[抽象語法樹](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。接著 Angular 編譯器會解讀範本屬於哪個模組、你所在的範疇，以及元件選擇器。然後它會找出你的游標在範本 AST 中的位置。判斷出上下文後，它就能判斷該處可以出現哪些子元素。

如果你在內插中，情況會稍微複雜一點。如果你在 `div` 中有一個 `{{data.---}}` 的內插，並需要在 `data.---` 之後取得補全清單，編譯器無法使用 HTML AST 找到答案。HTML AST 只能告訴編譯器，存在一些包含「`{{data.---}}`」字元的文字。這時範本解析器會產生一個運算式 AST，它位於範本 AST 之內。接著 Angular Language Service 會在其上下文中查看 `data.---`，詢問 TypeScript Language Service `data` 的成員有哪些。TypeScript 接著便回傳可能性的清單。


若要進一步深入了解，請見
[Angular Language Service API](https://github.com/angular/angular/blob/master/packages/language-service/src/types.ts)








<hr>

## 更多資訊

如需更多資訊，請參閱 [Chuck Jazdzewski 的演講](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s)，那是他在 [ng-conf](https://www.ng-conf.org/) 2017 年關於 Angular Language Service 的演講。



