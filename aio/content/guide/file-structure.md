# 工作區與專案檔案結構

你在 Angular [工作區](guide/glossary#工作區（workspace）)的脈絡下開發應用程式。一個工作區包含一或多個[專案](guide/glossary#專案（project）)的檔案。專案是組成一個獨立應用程式、一個函式庫，或一組端對端 (e2e) 測試的檔案集合。

Angular CLI 指令 `ng new <project_name>` 讓你開始著手。 
執行這個指令時，CLI 會在新的工作區中安裝必要的 Angular npm 套件與其他依賴，工作區的根資料夾名為 *project_name*。 
它還會建立下列工作區與起始專案檔案：

* 一個初始的骨架應用程式專案，也稱為 *project_name*（位於 `src/` 子資料夾中）。
* 一個端對端測試專案（位於 `e2e/` 子資料夾中）。
* 相關的設定檔。

初始應用程式專案包含一個簡單的 Welcome 應用程式，隨時可以執行。

## 工作區檔案

工作區的最上層包含許多工作區層級的設定檔。

| 工作區設定檔    | 用途 |
| :--------------------- | :------------------------------------------|
| `.editorconfig`        | 程式碼編輯器的組態。請見 [EditorConfig](https://editorconfig.org/)。 |
| `.gitignore`           | 指定 [Git](https://git-scm.com/) 應該忽略的刻意不追蹤的檔案。 |
| `angular.json`         | 工作區中所有專案的 CLI 組態預設值，包括 CLI 使用的建置、伺服與測試工具的組態選項，例如 [TSLint](https://palantir.github.io/tslint/)、[Karma](https://karma-runner.github.io/) 與 [Protractor](http://www.protractortest.org/)。詳情請見 [Angular 工作區組態](guide/workspace-config)。 |
| `node_modules`         | 為整個工作區提供 [npm 套件](guide/npm-packages)。 |
| `package.json`         | 設定工作區中所有專案都可用的 [npm 套件依賴](guide/npm-packages)。關於這個檔案的具體格式與內容，請見 [npm 文件](https://docs.npmjs.com/files/package.json)。 |
| `package-lock.json`    | 提供 npm 用戶端安裝到 `node_modules` 的所有套件的版本資訊。詳情請見 [npm 文件](https://docs.npmjs.com/files/package-lock.json)。如果你使用 yarn 用戶端，這個檔案會改為 [yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock/)。 |
| `tsconfig.json`        | 工作區中應用程式的預設 [TypeScript](https://www.typescriptlang.org/) 組態，包括 TypeScript 與 Angular 範本編譯器選項。請見 [TypeScript 組態](guide/typescript-configuration)。 |
| `tslint.json`          | 工作區中應用程式的預設 [TSLint](https://palantir.github.io/tslint/) 設定。 |
| `README.md`            | 介紹文件。 |

工作區內的所有專案都共用一個 [CLI 組態脈絡](guide/workspace-config)。 
專案專屬的 [TypeScript](https://www.typescriptlang.org/) 設定檔繼承自工作區層級的 `tsconfig.*.json`，應用程式專屬的 [TSLint](https://palantir.github.io/tslint/) 設定檔則繼承自工作區層級的 `tslint.json`。

### 預設應用程式專案檔案

CLI 指令 `ng new my-app` 會建立一個名為 "my-app" 的工作區資料夾，並產生一個新的應用程式骨架。 
這個初始應用程式是 CLI 指令的 *預設應用程式*（除非你在建立其他應用程式後變更預設值）。

新產生的應用程式包含根模組的原始檔案，以及根元件與範本。 
工作區檔案結構就緒後，你可以在命令列使用 `ng generate` 指令，為初始應用程式加入功能與資料。

<div class="alert is-helpful">

   除了在命令列使用 CLI，你也可以使用像 [Angular Console](https://angularconsole.com/) 這樣的互動式開發環境，或直接在應用程式的原始檔案資料夾與組態檔中操作檔案。

</div>

`src/` 子資料夾包含初始應用程式的原始檔案（應用程式邏輯、資料與資產），以及設定檔。
工作區層級的 `node_modules` 依賴對這個專案可見。

| 應用程式原始檔案與設定檔    | 用途 |
| :--------------------- | :------------------------------------------|
| `app/`                 | 包含定義應用程式邏輯與資料的元件檔案。詳情請見下方的[應用程式原始檔案資料夾](#app-src)。 |
| `assets/`              | 包含圖片檔案與其他資產檔案，建置應用程式時會原樣複製。 | 
| `environments/`        | 包含特定目標環境的建置組態選項。預設有一個未命名的標準開發環境，以及一個生產（"prod"）環境。你可以定義其他的目標環境組態。 |
| `browserslist`          | 設定目標瀏覽器與 Node.js 版本在各種前端工具之間的共用。更多資訊請見 [Browserslist on GitHub](https://github.com/browserslist/browserslist)。  |
| `favicon.ico`          | 在書籤列中為這個應用程式使用的圖示。 |
| `index.html`           | 有人造訪你的網站時提供的主要 HTML 頁面。CLI 在建置應用程式時會自動加入所有 JavaScript 與 CSS 檔案，因此你通常不需要在這裡手動加入任何 `<script>` 或` <link>` 標籤。 |
| `main.ts`              | 應用程式的主要進入點。使用 [JIT 編譯器](https://angular.io/guide/glossary#jit) 編譯應用程式，並啟動應用程式的根模組（AppModule）在瀏覽器中執行。你也可以在 CLI 的 `build` 與 `serve` 指令加上 `--aot` 旗標，不需變更任何程式碼就使用 [AOT 編譯器](https://angular.io/guide/aot-compiler)。 |
| `polyfills.ts`         | 提供瀏覽器支援的 polyfill 指令碼。 |
| `styles.sass`          | 列出為專案提供樣式的 CSS 檔案。副檔名反映你為專案設定的樣式預處理器。 |
| `test.ts`              | 單元測試的主要進入點，包含一些 Angular 專屬的設定。你通常不需要編輯這個檔案。 |
| `tsconfig.app.json`   | 繼承自工作區層級的 `tsconfig.json` 檔案。 |
| `tsconfig.spec.json`  | 繼承自工作區層級的 `tsconfig.json` 檔案。 |
| `tslint.json`         | 繼承自工作區層級的 `tslint.json` 檔案。 |

### 預設應用程式專案 e2e 檔案

一個 `e2e/` 子資料夾包含一組對應到初始應用程式的端對端測試的設定與原始檔案。
工作區層級的 `node_modules` 依賴對這個專案可見。

<code-example language="none" linenums="false">
my-app/
  e2e/                  (end-to-end test app for my-app)
    src/                (app source files)
    protractor.conf.js  (test-tool config)
    tsconfig.e2e.json   (TypeScript config inherits from workspace tsconfig.json)
</code-example>

### 其他應用程式與函式庫的專案資料夾

當你在工作區中產生新專案時， 
CLI 會建立一個新的 *工作區*`/projects` 資料夾，並將產生的檔案放在那裡。

當你產生一個應用程式（`ng generate application my-other-app`）時，CLI 會在 `projects/` 底下，為該應用程式與其對應的端對端測試加入資料夾。新產生的函式庫也會加入 `projects/` 底下。

<code-example language="none" linenums="false">
my-app/
  ...
  projects/           (additional apps and libs)
    my-other-app/     (a second app)
      src/
      (config files)
    my-other-app-e2e/  (corresponding test app) 
      src/
      (config files)
    my-lib/            (a generated library)
      (config files)
</code-example>

{@a app-src}
## 應用程式原始檔案資料夾

在 `src/` 資料夾中，`app/` 資料夾包含應用程式的邏輯與資料。Angular 元件、範本與樣式都放在這裡。`assets/` 子資料夾包含圖片，以及應用程式需要的其他任何東西。`src/` 最上層的檔案用來支援測試與執行你的應用程式。

| 應用程式原始檔案 | 用途 |
| :-------------------------- | :------------------------------------------|
| `app/app.component.ts`      | 為應用程式的根元件（名為 `AppComponent`）定義邏輯。隨著你為應用程式加入元件與服務，與這個根元件關聯的 view 會成為[檢視階層](guide/glossary#檢視階層（view-hierarchy）)的根。 |
| `app/app.component.html`    | 定義與根 `AppComponent` 關聯的 HTML 範本。 |
| `app/app.component.css`     | 為根 `AppComponent` 定義基礎 CSS 樣式表。 |
| `app/app.component.spec.ts` | 為根 `AppComponent` 定義單元測試。 |
| `app/app.module.ts`         | 定義根模組（名為 `AppModule`），告訴 Angular 如何組裝應用程式。最初只宣告 `AppComponent`。當你為應用程式加入更多元件時，必須在此宣告。 |
| `assets/*`                  | 包含圖片檔案與其他資產檔案，建置應用程式時會原樣複製。 |
