# npm 套件

 [**Angular CLI**](https://cli.angular.io/)、Angular 應用程式以及 Angular 本身，都依賴以 [**npm**](https://docs.npmjs.com/) 套件形式提供的程式庫所給予的特性與功能。

你可以使用 [**npm 用戶端**](https://docs.npmjs.com/cli/install) 下載並安裝這些 npm 套件，它以 Node.js® 應用程式的形式執行。

[**yarn 用戶端**](https://yarnpkg.com/en/) 是下載與安裝 npm 套件的熱門替代選擇。
Angular CLI 在你建立新專案時，預設使用 `yarn` 來安裝 npm 套件。

<div class="alert is-helpful">

Node.js 與 npm 是 Angular 開發不可或缺的工具。

[立即取得](https://docs.npmjs.com/getting-started/installing-node "Installing Node.js and updating npm")
如果它們尚未安裝在你的電腦上。

**請確認你執行的 Node.js 為 `v8.x` 或更高版本、npm 為 `5.x` 或更高版本**
方法是，在終端機/主控台視窗中執行 `node -v` 與 `npm -v` 指令。
舊版本會產生錯誤。

考慮使用 [nvm](https://github.com/creationix/nvm) 來管理多個
版本的 Node.js 與 npm。如果你的電腦上已有使用其他版本
Node.js 與 npm 執行的專案，你可能會需要 [nvm](https://github.com/creationix/nvm)。

</div>

## _package.json_

`npm` 與 `yarn` 都會安裝在 [**package.json**](https://docs.npmjs.com/files/package.json) 檔案中所指定的套件。

CLI 的 `ng new` 指令會為你的專案建立一個預設的 `package.json` 檔案。
這個 `package.json` 指定了_一組入門套件_，它們能良好地協同運作，
並共同支援許多常見的應用程式情境。

隨著你的應用程式演進，你會將套件加入 `package.json`。
你甚至可以移除一些套件。

本指南著重於入門套件中最重要的套件。

#### *相依性* 與 *開發相依性*

`package.json` 包含兩組套件：
[相依性](guide/npm-packages#dependencies) 與 [開發相依性](guide/npm-packages#dev-dependencies)。

*相依性* 對*執行*應用程式至關重要。
*開發相依性* 只在*開發*應用程式時才需要。

{@a dependencies}

## *相依性*
`package.json` 的 `dependencies` 區段包含：

* **Angular 套件**：Angular 核心與選用模組；其套件名稱以 `@angular/` 開頭。

* **支援套件**：Angular 應用程式執行時必須存在的第三方程式庫。

* **Polyfill 套件**：Polyfill 可填補瀏覽器 JavaScript 實作中的缺口。

### Angular 套件

**@angular/animations**：Angular 的動畫函式庫，能讓你輕鬆定義並套用動畫效果，例如頁面與清單轉場。
詳見[動畫指南](guide/animations)。

**@angular/common**：Angular 團隊提供的常用服務、管道與指令。
[`HttpClientModule`](guide/http) 也在這裡，位於 '@angular/common/http' 子資料夾中。

**@angular/core**：每個應用程式都需要的框架關鍵執行時期部分。
包括所有中繼資料裝飾器、`Component`、`Directive`、依賴注入，以及元件生命週期鉤子。

**@angular/compiler**：Angular 的*範本編譯器*。
它理解範本，並可將其轉換為讓應用程式執行與渲染的程式碼。
通常你不會直接與編譯器互動，而是在瀏覽器中使用 `platform-browser-dynamic` 進行 [JIT 編譯](guide/aot-compiler)時間接使用它。

**@angular/forms**：支援[範本驅動](guide/forms)與[反應式表單](guide/reactive-forms)。

**@angular/http**：Angular 的舊版、已棄用的 HTTP 用戶端。

**@angular/platform-browser**：所有與 DOM 與瀏覽器相關的部分，特別是
協助渲染至 DOM 的部分。
此套件也包含 `bootstrapModuleFactory()` 方法，
用於為使用 [AOT](guide/aot-compiler) 預先編譯的正式版建置啟動應用程式。

**@angular/platform-browser-dynamic**：包含[提供者](api/core/Provider)
與方法，可使用 [JIT 編譯器](guide/aot-compiler) 在用戶端編譯並執行應用程式。

**@angular/router**：[路由模組](/guide/router) 會在瀏覽器 URL 變更時，在你的應用程式頁面之間導覽。

**@angular/upgrade**：用於將 AngularJS 應用程式升級至 Angular 的公用程式集。

{@a polyfills}

### Polyfill 套件

許多瀏覽器缺乏對最新 HTML 標準中某些功能的原生支援，
而這些功能是 Angular 所需要的。
「[Polyfills](https://en.wikipedia.org/wiki/Polyfill)」可以模擬缺少的功能。
[瀏覽器支援](guide/browser-support)指南說明哪些瀏覽器需要 polyfill，以及
你可以如何加入它們。

預設的 `package.json` 會安裝 **[core-js](https://github.com/zloirock/core-js)** 套件，
它為數個熱門瀏覽器 polyfill 缺少的功能。

### 支援套件

**[rxjs](https://github.com/benlesh/RxJS)**：許多 Angular API 會傳回 _observables_。RxJS 是 [Observables 規格](https://github.com/zenparsing/es-observable)提案的一種實作，該提案目前正提交給
[TC39](http://www.ecma-international.org/memento/TC39.htm) 委員會，該委員會負責決定 JavaScript 語言的標準。


**[zone.js](https://github.com/angular/zone.js)**：Angular 依靠 zone.js，在原生 JavaScript 操作引發事件時執行 Angular 的變更偵測程序。Zone.js 是目前提交給
[TC39](http://www.ecma-international.org/memento/TC39.htm) 委員會的[規格](https://gist.github.com/mhevery/63fdcdf7c65886051d55)的一種實作，該委員會負責決定 JavaScript 語言的標準。


{@a dev-dependencies}

## *開發相依性*

`package.json` 的 *devDependencies* 區段中所列的套件，可協助你在本機上開發應用程式。

你不會將它們與正式版應用程式一起部署，儘管這麼做也無妨。

**[@angular/cli](https://github.com/angular/angular-cli/)**：Angular CLI 工具。


**[@angular/compiler-cli](https://github.com/angular/angular/blob/master/packages/compiler-cli/README.md)**：Angular 編譯器，由 Angular CLI 的 `build` 與 `serve` 指令呼叫。


**[@angular/language-service](https://github.com/angular/angular-cli/)**：Angular 語言服務會分析元件範本，並提供型別與錯誤資訊，讓具備 TypeScript 感知能力的編輯器可用來改善開發體驗。
例如，請參閱 [VS Code 的 Angular 語言服務擴充功能](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)


**@types/... **：Jasmine 與 Node.js 等第三方程式庫的 TypeScript 定義檔案。


**[codelyzer](https://www.npmjs.com/package/codelyzer)**：一款 Angular 應用程式的 linter，其規則遵循 Angular [風格指南](guide/styleguide)。


**jasmine/... **：支援 [Jasmine](https://jasmine.github.io/) 測試程式庫的套件。


**karma/... **：支援 [karma](https://www.npmjs.com/package/karma) 測試執行器的套件。


**[protractor](https://www.npmjs.com/package/protractor)**：一個用於 Angular 應用程式的端到端（e2e）框架。
建立在 [WebDriverJS](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs) 之上。


**[ts-node](https://www.npmjs.com/package/ts-node)**：Node.js 的 TypeScript 執行環境與 REPL。


**[tslint](https://www.npmjs.com/package/tslint)**：一個靜態分析工具，用於檢查 TypeScript 程式碼的可讀性、可維護性與功能錯誤。


**[typescript](https://www.npmjs.com/package/typescript)**：
TypeScript 語言伺服器，包括 *tsc* TypeScript 編譯器。


## 好多套件！好多檔案！

預設的 `package.json` 安裝的套件，比你的專案實際需要的還多。

一個套件可能包含數十、數百，甚至數千個檔案，
全都在你本機的 `node_modules` 目錄中。
檔案數量之龐大令人望而生畏，

你可以移除不需要的套件，但你怎麼能確定自己不會需要它？
實際上，與其為此煩惱，不如安裝一個你不需要的套件。
本機開發電腦上多餘的套件與套件檔案是無害的。

預設情況下，Angular CLI 建置程序只會將你的應用程式實際需要的少數「vendor」程式庫檔案打包成單一檔案。
瀏覽器下載的是這個打包檔，而不是原始的套件檔案。

請參閱[部署](guide/deployment)以了解更多。
