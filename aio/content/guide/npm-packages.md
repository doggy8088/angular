# 工作區的 npm 相依性

Angular 框架、Angular CLI 以及 Angular 應用程式所使用的元件，都封裝為 [npm 套件](https://docs.npmjs.com/getting-started/what-is-npm "What is npm?")，並透過 [npm registry](https://docs.npmjs.com) 發布。

你可以使用 [npm CLI 用戶端](https://docs.npmjs.com/cli/install)下載並安裝這些 npm 套件，該用戶端隨 [Node.js®](https://nodejs.org "Nodejs.org") 應用程式一起安裝並執行。預設情況下，Angular CLI 使用 npm 用戶端。

或者，你也可以使用 [yarn 用戶端](https://yarnpkg.com)下載並安裝 npm 套件。

<div class="alert is-helpful">

關於 `Node.js` 與 `npm` 所需版本與安裝的資訊，請參閱[本機環境設定](guide/setup-local "Setting up for Local Development")。

如果你的電腦上已有使用其他版本 Node.js 與 npm 執行的專案，建議使用 [nvm](https://github.com/creationix/nvm) 來管理多個版本的 Node.js 與 npm。

</div>

## `package.json`

`npm` 與 `yarn` 都會安裝 [`package.json`](https://docs.npmjs.com/files/package.json) 檔案中所列出的套件。

CLI 指令 `ng new` 在建立新工作區時，會建立一個 `package.json` 檔案。這個 `package.json` 會供工作區中的所有專案使用，包括 CLI 在建立工作區時所建立的初始應用程式專案。

這個 `package.json` 一開始會包含*一組入門套件*，其中有些是 Angular 必需的套件，有些則支援常見的應用程式情境。隨著應用程式持續演進，你可以把套件加入 `package.json`。你甚至可以移除一些套件。

`package.json` 分為兩組套件：

| 套件 | 詳細資訊 |
|:---                                                    |:---     |
| [相依性](guide/npm-packages#相依套件) | 對*執行*應用程式至關重要。 |
| [開發相依性](guide/npm-packages#dev-dependencies) | 只在*開發*與*建置*應用程式時需要。 |

<div class="alert is-helpful">

**LIBRARY DEVELOPERS**: <br />
預設情況下，CLI 指令 [`ng generate library`](cli/generate) 會為新程式庫建立一個 `package.json`。
該 `package.json` 會在將程式庫發佈到 npm 時使用。
更多資訊請參閱 CLI wiki 頁面[程式庫支援](guide/creating-libraries)。

</div>

<a id="dependencies"></a>

## 相依套件

`package.json` 的 `dependencies` 區段中所列的套件，對*執行*應用程式至關重要。

`package.json` 的 `dependencies` 區段包含：

| 套件 | 詳細資訊 |
|:---                                   |:---     |
| [Angular 套件](#angular-套件) | Angular 核心與選用模組；其套件名稱以 `@angular` 開頭 |
| [支援套件](#支援套件) | Angular 應用程式執行時必須存在的第三方程式庫 |
| [Polyfill 套件](#polyfills) | Polyfill 可填補瀏覽器 JavaScript 實作中的缺口 |

若要加入新的相依性，請使用 [`ng add`](cli/add) 指令。

<a id="angular-packages"></a>

### Angular 套件

下列 Angular 套件會列為新 Angular 工作區預設 `package.json` 檔案中的相依性。 完整的 Angular 套件清單，請參閱 [API 參考文件](api?type=package)。

| 套件名稱 | 詳細說明 |
|:---                                                                 |:---     |
| [`@angular/animations`](api/animations) | Angular 的動畫函式庫，讓你輕鬆定義並套用頁面與清單轉場等動畫效果。更多資訊，請參閱[動畫指南](guide/animations)。 |
| [`@angular/common`](api/common) | Angular 團隊提供的常用服務、管道與指令。[`HttpClientModule`](api/common/http/HttpClientModule) 也在這裡，位於 [`@angular/common/http`](api/common/http) 子資料夾中。更多資訊請參閱 [HttpClient 指南](guide/understanding-communicating-with-http)。 |
| `@angular/compiler` | Angular 的範本編譯器。它理解範本，並可將其轉換為讓應用程式執行與渲染的程式碼。通常你不會直接與編譯器互動，而是在瀏覽器中使用 `platform-browser-dynamic` 進行 JIT 編譯時間接使用它。更多資訊請參閱[預先編譯指南](guide/aot-compiler)。 |
| [`@angular/core`](api/core) | 每個應用程式都需要的框架關鍵執行時期部分。包括所有中繼資料裝飾器、`Component`、`Directive`、依賴注入，以及元件生命週期掛鉤。 |
| [`@angular/forms`](api/forms) | 支援[範本驅動](guide/forms)與[反應式表單](guide/reactive-forms)。關於如何為你的應用程式選擇最佳表單方式，請參閱[表單簡介](guide/forms-overview)。 |
| [`@angular/platform-browser`](api/platform-browser) | 所有與 DOM 與瀏覽器相關的部分，特別是協助渲染至 DOM 的部分。此套件也包含 `bootstrapModuleFactory()` 方法，用於為使用 [AOT](guide/aot-compiler) 預先編譯的正式版建置啟動應用程式。 |
| [`@angular/platform-browser-dynamic`](api/platform-browser-dynamic) | 包含[提供者](api/core/Provider)與方法，可使用 [JIT 編譯器](guide/aot-compiler) 在用戶端編譯並執行應用程式。 |
| [`@angular/router`](api/router) | 當瀏覽器 URL 變更時，路由模組會在你的應用程式頁面之間導覽。更多資訊，請參閱[路由與導覽](guide/router)。 |

<a id="support-packages"></a>

### 支援套件

下列支援套件包含在新 Angular 工作區預設 `package.json` 檔案的相依性中。

| 套件名稱 | 詳細說明 |
|:---                                             |:---     |
| [`rxjs`](https://github.com/ReactiveX/rxjs) | 許多 Angular API 會傳回[*可觀察物件*](guide/glossary#可觀察物件（observable）)。RxJS 是目前提交給決定 JavaScript 語言標準的 [TC39](https://www.ecma-international.org/memento/tc39.htm) 委員會的 [Observable 規格提案](https://github.com/tc39/proposal-observable)的一種實作。 |
| [`zone.js`](https://github.com/angular/zone.js) | 當原生 JavaScript 操作引發事件時，Angular 依靠 zone.js 來執行 Angular 的變更偵測程序。Zone.js 是目前提交給決定 JavaScript 語言標準的 [TC39](https://www.ecma-international.org/memento/tc39.htm) 委員會的[規格](https://gist.github.com/mhevery/63fdcdf7c65886051d55)的一種實作。 |

<a id="polyfills"></a>

### Polyfill 套件

許多瀏覽器缺乏對最新 HTML 標準中某些功能的原生支援，而這些功能是 Angular 所需要的。[*Polyfill*](https://en.wikipedia.org/wiki/Polyfill_(programming)) 可以模擬缺少的功能。[瀏覽器支援](guide/browser-support)指南說明哪些瀏覽器需要 polyfill，以及如何加入它們。

<a id="dev-dependencies"></a>

## 開發相依性

`package.json` 的 `devDependencies` 區段中所列的套件，可協助你在本機上開發應用程式。你不會將它們與正式版應用程式一起部署。

若要加入新的 `devDependency`，請使用下列任一指令：

<code-example format="shell" language="shell">

npm install --save-dev &lt;package-name&gt;

</code-example>

<code-example format="shell" language="shell">

yarn add --dev &lt;package-name&gt;

</code-example>

下列 `devDependencies` 提供於新 Angular 工作區預設的 `package.json` 檔案中。

| 套件名稱 | 詳細說明 |
|:---                                                                       |:---     |
| [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli) | Angular 建置工具。 |
| [`@angular/cli`](https://github.com/angular/angular-cli) | Angular CLI 工具。 |
| `@angular/compiler-cli` | Angular 編譯器，由 Angular CLI 的 `ng build` 與 `ng serve` 指令呼叫。 |
| `@types/... ` | Jasmine 與 Node.js 等第三方程式庫的 TypeScript 定義檔案。 |
| `jasmine/... ` | 支援 [Jasmine](https://jasmine.github.io) 測試程式庫的套件。 |
| `karma/... ` | 支援 [karma](https://www.npmjs.com/package/karma) 測試執行器的套件。 |
| [`typescript`](https://www.npmjs.com/package/typescript) | TypeScript 語言伺服器，包括 *tsc* TypeScript 編譯器。 |

## 相關資訊

關於 Angular CLI 如何處理套件的資訊，請參閱下列指南：

| 主題 | 詳細資訊 |
|:---                                 |:---     |
| [建置與提供服務](guide/build) | 套件如何組合以建立開發建置 |
| [部署](guide/deployment) | 套件如何組合以建立正式版建置 |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
