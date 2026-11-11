# 工作區的 npm 相依性

Angular 框架、Angular CLI 以及 Angular 應用程式所使用的元件，都封裝為 [npm 套件](https://docs.npmjs.com/getting-started/what-is-npm 'What is npm?')，並透過 [npm registry](https://docs.npmjs.com) 發布。

你可以使用 [npm CLI 用戶端](https://docs.npmjs.com/cli/install) 下載並安裝這些 npm 套件。
Angular CLI 預設使用 npm 用戶端。

HELPFUL: 關於 `Node.js` 與 `npm` 所需的版本與安裝方式，請參閱[本地環境設定](tools/cli/setup-local 'Setting up for Local Development')。

如果你的電腦上已有使用其他版本 Node.js 與 npm 執行的專案，建議使用 [nvm](https://github.com/creationix/nvm) 來管理多個版本的 Node.js 與 npm。

## `package.json`

`npm` 會安裝 [`package.json`](https://docs.npmjs.com/files/package.json) 檔案中所列出的套件。

CLI 指令 `ng new` 在建立新工作區時，會一併建立一個 `package.json` 檔案。
這個 `package.json` 會供工作區中的所有專案使用，包括 CLI 在建立工作區時所建立的初始應用程式專案。
使用 `ng generate library` 建立的函式庫，則會包含各自的 `package.json` 檔案。

這個 `package.json` 一開始會包含一組入門套件，其中有些是 Angular 必需的套件，有些則支援常見的應用程式情境。
隨著應用程式持續演進，你可以再把套件加入 `package.json`。

## 預設相依性

下列 Angular 套件會列為新 Angular 工作區預設 `package.json` 檔案中的相依性。
完整的 Angular 套件清單，請參閱 [API 參考文件](api)。

| 套件名稱                                                         | 詳細說明                                                                                                                                                                       |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular/animations`](api#animations)                                                        | Angular 的動畫函式庫，讓你輕鬆定義並套用頁面與清單轉場等動畫效果。更多資訊，請參閱[動畫指南](guide/animations)。 |
| [`@angular/common`](api#common)                                                                | Angular 團隊提供的常用服務、管道與指令。                                                                                                                                       |
| `@angular/compiler`                                                                            | Angular 的範本編譯器。它能理解 Angular 範本，並將其轉換為讓應用程式執行的程式碼。                                                                                              |
| `@angular/compiler-cli`                                                                        | Angular 的編譯器，由 Angular CLI 的 `ng build` 與 `ng serve` 指令叫用。它會在標準的 TypeScript 編譯過程中，使用 `@angular/compiler` 處理 Angular 範本。                      |
| [`@angular/core`](api#core)                                                                    | 框架中每個應用程式都需要的關鍵執行階段部分。包含所有中繼資料裝飾器，例如 `@Component`、依賴注入，以及元件生命週期鉤子。                                                        |
| [`@angular/forms`](api#forms)                                                                  | 同時支援[範本驅動表單](guide/forms)與[反應式表單](guide/forms/reactive-forms)。請參閱[表單簡介](guide/forms)。                                                                  |
| [`@angular/platform-browser`](api#platform-browser)                                            | 所有與 DOM 和瀏覽器相關的內容，特別是協助將內容渲染到 DOM 的部分。                                                                                                             |
| [`@angular/platform-browser-dynamic`](api#platform-browser-dynamic)                            | 包含使用 [JIT 編譯器](tools/cli/aot-compiler#choosing-a-compiler) 在用戶端編譯並執行應用程式的[提供者](api/core/Provider)與方法。                                   |
| [`@angular/router`](api#router)                                                                | 當瀏覽器 URL 變更時，路由模組會在你的應用程式頁面之間導覽。更多資訊，請參閱[路由與導覽](guide/routing)。                                                                       |
| [`@angular/cli`](https://github.com/angular/angular-cli)                                       | 包含用來執行 `ng` 指令的 Angular CLI 執行檔。                                                                                                                                  |
| [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli) | 包含用來打包、測試與提供 Angular 應用程式與函式庫的預設 CLI 建置器。                                                                                                           |
| `rxjs`                                                   | 使用 `Observables` 進行反應式程式設計的函式庫。                                                                                                                                |
| [`zone.js`](https://github.com/angular/zone.js)                                                | 當原生 JavaScript 操作引發事件時，Angular 依賴 `zone.js` 執行 Angular 的變更偵測流程。                                                                                      |
| [`typescript`](https://www.npmjs.com/package/typescript)                                       | TypeScript 編譯器、語言伺服器與內建型別定義。                                                                                                                                  |
