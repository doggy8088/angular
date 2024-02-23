# 工作區 npm 相依性

Angular Framework、Angular CLI 和 Angular 應用程式使用的元件都打包為 [npm 套件](https://docs.npmjs.com/getting-started/what-is-npm "什麼是 npm？")，並使用 [npm 登錄](https://docs.npmjs.com) 分發。

您可以使用 [npm CLI 客戶端](https://docs.npmjs.com/cli/install) 下載並安裝這些 npm 套件。
預設情況下，Angular CLI 使用 npm 客戶端。

HELPFUL：有關必備版本以及 `Node.js` 和 `npm` 的安裝資訊，請參閱 [本機環境設定](tools/cli/setup-local "設定本機開發環境")。

如果您已經在機器上使用其他版本的 Node.js 和 npm 執行專案，請考慮使用 [nvm](https://github.com/creationix/nvm) 來管理多個版本的 Node.js 和 npm。

## `package.json`

`npm` 安裝在 [`package.json`](https://docs.npmjs.com/files/package.json) 檔案中識別的套件。

當 CLI 命令 `ng new` 建立新工作區時，它會建立一個 `package.json` 檔案。
這個 `package.json` 會被工作區中的所有專案使用，包括 CLI 在建立工作區時建立的初始應用程式專案。
使用 `ng generate library` 建立的函式庫會包含自己的 `package.json` 檔案。

最初，此 `package.json` 包含 *一組入門套件*，其中一些為 Angular 所需，其他則支援常見的應用程式場景。
隨著應用程式的發展，您可以將套件新增至 `package.json`。

## 預設依賴

以下的 Angular 套件包含在新的 Angular 工作區的預設 `package.json` 檔案中作為相依性。
如需完整的 Angular 套件清單，請參閱 [API 參考](api)。

| 套件名稱                                                              | 詳細資料                                                                                                                                                                                        |
|:---                                                                       |:---                                                                                                                                                                                            |
| [`@angular/animations`](api/animations)                                   | Angular 的動畫程式庫可輕鬆定義和套用動畫效果，例如頁面和清單轉場。如需更多資訊，請參閱 [動畫指南](guide/animations)。                                                |
| [`@angular/common`](api/common)                                           | 由 Angular 團隊提供的常用服務、管線和指令。                                                                                                                                              |
| `@angular/compiler`                                                       | Angular 的範本編譯器。它了解 Angular 範本，並可以將它們轉換成讓應用程式執行的程式碼。                                                                                              |
| `@angular/compiler-cli`                                                   | Angular 的編譯器，由 Angular CLI 的 `ng build` 和 `ng serve` 命令呼叫。它在標準 TypeScript 編譯中使用 `@angular/compiler` 處理 Angular 範本。                                 |
| [`@angular/core`](api/core)                                               | 每個應用程式需要的架構的關鍵執行時期部分。包含所有元資料裝飾器，例如 `@Component`、相依性注入和元件生命週期掛勾。                                                   |
| [`@angular/forms`](api/forms)                                             | 支援 [範本驅動](guide/forms) 和 [反應表單](guide/forms/reactive-forms)。請參閱 [表單簡介](guide/forms)。                                                                           |
| [`@angular/platform-browser`](api/platform-browser)                       | 所有與 DOM 和瀏覽器相關的內容，特別是協助呈現在 DOM 中的部分。                                                                                                                   |
| [`@angular/platform-browser-dynamic`](api/platform-browser-dynamic)       | 包含 [提供者](api/core/Provider) 和方法，以使用 [JIT 編譯器](tools/cli/aot-compiler#choosing-a-compiler) 在用戶端編譯和執行應用程式。                                 |
| [`@angular/router`](api/router)                                           | 當瀏覽器網址變更時，路由器模組會在應用程式頁面之間導覽。如需更多資訊，請參閱 [路由和導覽](guide/routing)。                                                               |
| [`@angular/cli`](https://github.com/angular/angular-cli)                  | 包含 Angular CLI 二進位檔，用於執行 `ng` 命令。                                                                                                                                          |
| [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli) | 包含用於捆綁、測試和提供 Angular 應用程式和程式庫的預設 CLI 建構器。                                                                                                          |
| `rxjs`                                                                    | 使用 `Observables` 的響應式程式設計程式庫。                                                                                                                                          |
| [`zone.js`](https://github.com/angular/zone.js)                           | Angular 仰賴 `zone.js` 在原生 JavaScript 作業引發事件時執行 Angular 的變更偵測程序。                                                                                                 |
| [`typescript`](https://www.npmjs.com/package/typescript)                  | TypeScript 編譯器、語言伺服器和內建型別定義。                                                                                                                                    |
