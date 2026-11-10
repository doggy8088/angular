# 工作區與專案檔案結構

你在 Angular 工作區的脈絡下開發應用程式。
一個工作區包含一個或多個專案的檔案。
專案是構成應用程式或可共用函式庫的一組檔案。

Angular CLI 的 `ng new` 指令會建立一個工作區。

```shell
ng new my-project
```

執行此指令時，CLI 會在新工作區中安裝必要的 Angular npm 套件與其他相依性，並建立一個名為 _my-project_ 的根層級應用程式。

預設情況下，`ng new` 會在工作區的根層級建立一個初始骨架應用程式，以及其端對端測試。
此骨架是一個簡單的歡迎應用程式，可立即執行且易於修改。
根層級應用程式與工作區同名，其原始檔案位於工作區的 `src/` 子資料夾中。

這種預設行為適合典型的「多儲存庫」開發風格，也就是每個應用程式都位於各自的工作區中。
建議初學者與中階使用者使用 `ng new`，為每個應用程式建立個別的工作區。

Angular 也支援包含[多個專案](#multiple-projects)的工作區。
這種開發環境適合正在開發可共用函式庫的進階使用者，
以及採用「單一儲存庫」開發風格的企業，也就是以單一儲存庫與全域設定管理所有 Angular 專案。

若要設定單一儲存庫工作區，你應該略過建立根應用程式。
請參閱下方的[為多專案工作區進行設定](#multiple-projects)。

## 工作區設定檔

工作區內的所有專案共用同一份[設定](reference/configs/workspace-config)。
工作區的最上層包含工作區層級的設定檔、根層級應用程式的設定檔，以及根層級應用程式原始檔案與測試檔案的子資料夾。

| 工作區設定檔                  | 用途                                                                                                                                                                                                                                                                                                             |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.editorconfig`               | 編輯器的設定。請參閱 [EditorConfig](https://editorconfig.org)。                                                                                                                                                                                                                                                  |
| `.gitignore`                  | 指定 [Git](https://git-scm.com) 應忽略的刻意未追蹤檔案。                                                                                                                                                                                                                                                         |
| `README.md`                   | 工作區的文件。                                                                                                                                                                                                                                                                                                   |
| `angular.json`                | 工作區中所有專案的 CLI 設定，包含如何建置、提供與測試每個專案的設定選項。詳細資訊，請參閱 [Angular 工作區設定](reference/configs/workspace-config)。                                                                                                                                                               |
| `package.json`                | 設定工作區中所有專案均可使用的 [npm 套件相依性](reference/configs/npm-packages)。此檔案的具體格式與內容，請參閱 [npm 文件](https://docs.npmjs.com/files/package.json)。                                                                                                                                             |
| `package-lock.json`           | 提供 npm 用戶端安裝到 `node_modules` 的所有套件的版本資訊。詳細資訊，請參閱 [npm 文件](https://docs.npmjs.com/files/package-lock.json)。                                                                                                                                                                           |
| `src/`                        | 根層級應用程式專案的原始檔案。                                                                                                                                                                                                                                                                                   |
| `public/`                     | 包含要由開發伺服器以靜態檔案形式提供，並在建置應用程式時原樣複製的圖片與其他資產檔案。                                                                                                                                                                                                                           |
| `node_modules/`               | 整個工作區已安裝的 [npm 套件](reference/configs/npm-packages)。工作區層級的 `node_modules` 相依性對所有專案可見。                                                                                                                                                                                                 |
| `tsconfig.json`               | 工作區中各專案的基礎 [TypeScript](https://www.typescriptlang.org) 設定。所有其他設定檔都繼承自此基礎檔案。更多資訊，請參閱[相關的 TypeScript 文件](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases)。                                                                               |

## 應用程式專案檔案

預設情況下，CLI 指令 `ng new my-app` 會建立一個名為 "my-app" 的工作區資料夾，並在工作區最上層的 `src/` 資料夾中產生新的應用程式骨架。
新產生的應用程式包含根模組的原始檔案，以及根元件與範本。

工作區檔案結構就緒後，你可以在命令列使用 `ng generate` 指令，為應用程式加入功能與資料。
這個初始的根層級應用程式是 CLI 指令的 _預設應用程式_（除非你在建立[額外的應用程式](#multiple-projects)後變更預設值）。

對於單一應用程式工作區，工作區的 `src` 子資料夾包含根應用程式的原始檔案（應用程式邏輯、資料與資產）。
對於多專案工作區，`projects` 資料夾中的額外專案，則包含結構相同的 `project-name/src/` 子資料夾。

### 應用程式原始檔案

`src/` 最上層的檔案負責支援應用程式的執行。
子資料夾包含應用程式原始碼與應用程式專屬設定。

| 應用程式支援檔案          | 用途                                                                                                                                                                                                                              |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                    | 包含定義應用程式邏輯與資料的元件檔案。詳情請見下方。                                                                                                                                                                              |
| `favicon.ico`             | 在書籤列中供此應用程式使用的圖示。                                                                                                                                                                              |
| `index.html`              | 當有人造訪你的網站時所提供的主要 HTML 頁面。CLI 會在建置應用程式時自動加入所有 JavaScript 與 CSS 檔案，因此你通常不需要在此手動加入任何 `<script>` 或`<link>` 標籤。                                                                |
| `main.ts`                 | 應用程式的主要進入點。                                                                                                                                                                                                            |
| `styles.css`              | 套用到整個應用程式的全域 CSS 樣式。                                                                                                                                                                                               |

在 `src` 資料夾中，`app` 資料夾包含專案的邏輯與資料。
Angular 元件、範本與樣式都放在這裡。

| `src/app/` 檔案  | 用途                                                                                                                                                                                                                                                                             |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.config.ts`  | 定義應用程式設定，告訴 Angular 如何組裝應用程式。當你為應用程式加入更多提供者時，應在此宣告。<br><br>_僅在使用 `--standalone` 選項時產生。_                                                                                                                                       |
| `app.component.ts`      | 定義應用程式的根元件，名為 `AppComponent`。當你將元件與服務加入應用程式時，與此根元件相關聯的檢視會成為檢視階層的根。                                                                                                                                                                      |
| `app.component.html`    | 定義與 `AppComponent` 相關聯的 HTML 範本。                                                                                                                                                                                                                                                  |
| `app.component.css`     | 定義 `AppComponent` 的 CSS 樣式表。                                                                                                                                                                                                                                                         |
| `app.component.spec.ts` | 定義 `AppComponent` 的單元測試。                                                                                                                                                                                                                                                            |
| `app.module.ts`         | 定義名為 `AppModule` 的根模組，告訴 Angular 如何組裝應用程式。一開始只宣告 `AppComponent` 元件。當你為應用程式加入更多元件時，必須在此宣告。<br><br>_僅在使用 `--standalone false` 選項時產生。_                                                                                            |
| `app.routes.ts`  | 定義應用程式的路由設定。                                                                                                                                                                                                                                                           |

### 應用程式設定檔

根應用程式的應用程式專屬設定檔，位於工作區根層級。
對於多專案工作區，專案專屬設定檔位於專案根目錄，也就是 `projects/project-name/` 之下。

專案專屬的 [TypeScript](https://www.typescriptlang.org) 設定檔，會繼承自工作區層級的 `tsconfig.json`。

| 應用程式專屬設定檔                       | 用途                                                                                                                                                                                                |
| :--------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.app.json`                      | 應用程式專屬的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)，包含 [Angular 編譯器選項](reference/configs/angular-compiler-options)。                            |
| `tsconfig.spec.json`                     | 應用程式測試所用的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                                                                                             |

## 多個專案 {#multiple-projects}

多專案工作區適合以單一儲存庫與全域設定管理多個 Angular 專案的組織（即「單一儲存庫」模式）。
多專案工作區也支援函式庫開發。

### 為多專案工作區進行設定

如果你打算在一個工作區中擁有多個專案，可以在建立工作區時略過初始應用程式的產生，並為工作區取一個獨一無二的名稱。
下列指令會建立一個包含所有工作區層級設定檔的工作區，但不包含根層級應用程式。

```shell
ng new my-workspace --no-create-application
```

接著你可以產生在工作區內名稱獨一無二的應用程式與函式庫。

```shell
cd my-workspace
ng generate application my-app
ng generate library my-lib
```

### 多專案檔案結構

第一個明確產生的應用程式會放入 `projects` 資料夾，與工作區中的所有其他專案並列。
新產生的函式庫也會加入 `projects` 之下。
以這種方式建立專案時，工作區的檔案結構會與[工作區設定檔](reference/configs/workspace-config) `angular.json` 的結構完全一致。

```markdown
my-workspace/
├── … (workspace-wide configuration files)
└── projects/ (applications and libraries)
├── my-app/ (an explicitly generated application)
│ └── … (application-specific code and configuration)
└── my-lib/ (a generated library)
└── … (library-specific code and configuration)
```

## 函式庫專案檔案 {#library-project-files}

當你使用 CLI 產生函式庫時（例如使用 `ng generate library my-lib` 指令），產生的檔案會放入工作區的 `projects/` 資料夾。
關於建立你自己的函式庫的更多資訊，請參閱[建立函式庫](tools/libraries/creating-libraries)。

與應用程式不同，函式庫有自己的 `package.json` 設定檔。

在 `projects/` 資料夾下，`my-lib` 資料夾包含你的函式庫程式碼。

| 函式庫原始檔案           | 用途                                                                                                                                                                                         |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib`                | 包含你的函式庫專案的邏輯與資料。與應用程式專案一樣，函式庫專案可以包含元件、服務、模組、指令與管道。                                                                                         |
| `src/public-api.ts`      | 指定從你的函式庫匯出的所有檔案。                                                                                                                                                             |
| `ng-package.json`        | [ng-packagr](https://github.com/ng-packagr/ng-packagr) 用來建置你的函式庫的設定檔。                                                                                                          |
| `package.json`           | 設定此函式庫所需的 [npm 套件相依性](reference/configs/npm-packages)。                                                                                                                        |
| `tsconfig.lib.json`      | 函式庫專屬的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)，包含 [Angular 編譯器選項](reference/configs/angular-compiler-options)。                       |
| `tsconfig.lib.prod.json` | 函式庫專屬的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)，在以生產模式建置函式庫時使用。                                                               |
| `tsconfig.spec.json`     | 函式庫單元測試所用的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                                                                                     |
