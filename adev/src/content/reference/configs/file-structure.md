# 工作區和專案檔案結構

您在 Angular 工作區的內容中開發應用程式。
工作區包含一個或多個專案的檔案。
專案是組成應用程式或可共用程式庫的檔案集。

Angular CLI `ng new` 指令建立一個工作空間。

<docs-code language="shell">

ng new my-project

</docs-code>

當您執行此命令時，CLI 會在新的工作區中安裝必要的 Angular npm 套件和其他相依性，其中包含名為 *my-project* 的根級應用程式。

預設情況下，`ng new` 會在工作區的根目錄下建立一個初始的骨架應用程式，連同其端到端測試。
該骨架適用於一個簡單的歡迎應用程式，該應用程式已準備好運行且易於修改。
根級別應用程式的名稱與工作區的名稱相同，而原始檔案位於工作區的 `src/` 子資料夾中。

此預設行為適合於典型的「多個儲存庫」開發風格，其中每個應用程式都位於其自己的工作區。
建議初學者和中級使用者使用 `ng new` 為每個應用程式建立一個獨立的工作區。

Angular 也支援有多個專案的工作區 ([multiple projects](#multiple-projects))。
這類型的開發環境適合開發可共享程式庫的高階使用者，以及採用「單一存放庫」開發風格的企業，並以單一存放庫和全域設定來處理所有 Angular 專案。

若要設定 monorepo 工作區，您應該略過建立根應用程式。
請參閱以下 [設定多專案工作區](#multiple-projects)。

## 工作區設定檔

工作區內的所有專案共用一個 [設定檔](reference/configs/workspace-config)。
工作區的頂層包含工作區範圍的設定檔、根層級應用程式的設定檔，以及根層級應用程式原始碼和測試檔案的子資料夾。

| 工作區設定檔 | 用途                                                                                                                                                                                                                                                                                                          |
|:---                           |:---                                                                                                                                                                                                                                                                                                              |
| `.editorconfig`               | 程式編輯器的設定。參閱 [EditorConfig](https://editorconfig.org)。                                                                                                                                                                                                                                    |
| `.gitignore`                  | 指定 [Git](https://git-scm.com) 應略過的已知未追蹤檔案。                                                                                                                                                                                                                           |
| `README.md`                   | 工作區的說明文件。                                                                                                                                                                                                                                                                                 |
| `angular.json`                | 工作區中所有專案的 CLI 設定，包括如何建置、提供服務和測試每個專案的設定選項。有關詳細資訊，請參閱 [Angular 工作區設定](reference/configs/workspace-config)。                                                                                     |
| `package.json`                | 設定可供工作區中所有專案使用的 [npm 套件相依性](reference/configs/npm-packages)。有關此檔案的特定格式和內容，請參閱 [npm 文件](https://docs.npmjs.com/files/package.json)。                                                                 |
| `package-lock.json`           | 提供 npm 客戶端安裝至 `node_modules` 的所有套件的版本資訊。有關詳細資訊，請參閱 [npm 文件](https://docs.npmjs.com/files/package-lock.json)。                                                                                                                              |
| `src/`                        | 根層級應用程式專案的原始檔。                                                                                                                                                                                                                                                             |
| `node_modules/`               | 整個工作區已安裝的 [npm 套件](reference/configs/npm-packages)。工作區範圍的 `node_modules` 相依性對所有專案都可見。                                                                                                                                                       |
| `tsconfig.json`               | 工作區中專案的基本 [TypeScript](https://www.typescriptlang.org) 設定。所有其他設定檔都繼承自此基本檔案。有關更多資訊，請參閱 [相關的 TypeScript 文件](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases)。 |

## 應用程式專案檔案

預設情況下，CLI 命令 `ng new my-app` 會建立一個名為「my-app」的工作區資料夾，並在工作區最上層的 `src/` 資料夾中產生一個新的應用程式範本。
新產生的應用程式包含一個根模組的原始碼檔案，其中包含一個根元件和範本。

當工作區檔案結構就定位後，您可以在命令列上使用 `ng generate` 指令，將功能和資料新增至應用程式。
這個初始根層級應用程式是 CLI 指令的「預設應用程式」（除非您在建立 [其他應用程式](#multiple-projects) 後變更預設值）。

對於單一應用程式工作區，工作區的 `src` 子資料夾包含根應用程式的原始檔案（應用程式邏輯、資料和資產）。
對於多專案工作區，`projects` 資料夾中的其他專案包含具相同結構的 `project-name/src/` 子資料夾。

### 應用程式原始檔

位於 `src/` 頂層的檔案支援執行您的應用程式。
次資料夾包含應用程式來源和應用程式特定組態。

| 應用程式支援檔案 | 目的 |
|:--- |:--- |
| `app/` | 包含定義應用程式邏輯和資料的元件檔案。詳情請參閱 [下方](#app-src)。 |
| `assets/` | 包含影像和其他資產檔案，可由開發伺服器提供為靜態檔案，並在您建置應用程式時按原樣複製。 |
| `favicon.ico` | 在書籤列中用於此應用程式的圖示。 |
| `index.html` | 當有人造訪您的網站時提供的 HTML 主頁。CLI 會在建置應用程式時自動加入所有 JavaScript 和 CSS 檔案，因此您通常不需要在此手動加入任何 `<script>` 或`<link>` 標籤。 |
| `main.ts` | 應用程式的主要進入點。 |
| `styles.css` | 套用到整個應用程式的全域 CSS 樣式。 |

在 `src` 資料夾內，`app` 資料夾包含專案的邏輯和資料。
Angular 元件、範本及樣式在此。

| `src/app/` 檔案        | 目的                                                                                                                                                                                                                                                                            |
|:---                     |:---                                                                                                                                                                                                                                                                                |
| `app.config.ts`         | 定義應用程式設定，告訴 Angular 如何組合應用程式。當您加入更多提供者至應用程式時，應在此處宣告它們。<br><br>*僅在使用 `--standalone` 選項時產生。*                                                        |
| `app.component.ts`      | 定義應用程式的根元件，命名為 `AppComponent`。與此根元件關聯的檢視會成為檢視層級的根，當您將元件與服務加入應用程式時。                                                                        |
| `app.component.html`    | 定義與 `AppComponent` 關聯的 HTML 範本。                                                                                                                                                                                                                          |
| `app.component.css`     | 定義 `AppComponent` 的 CSS 樣式表。                                                                                                                                                                                                                                     |
| `app.component.spec.ts` | 定義 `AppComponent` 的單元測試。                                                                                                                                                                                                                                            |
| `app.module.ts`         | 定義根模組，命名為 `AppModule`，告訴 Angular 如何組合應用程式。最初僅宣告 `AppComponent`。當您加入更多元件至應用程式時，必須在此處宣告它們。<br><br>*僅在使用 `--standalone false` 選項時產生。* |
| `app.routes.ts`         | 定義應用程式的路由設定。                                                                                                                                                                                                                                   |

### 應用程式設定檔

根應用程式的應用程式專用設定檔位於工作區根目錄層級。
對於多專案工作區，專案專用設定檔位於專案根目錄，在 `projects/project-name/` 下。

專案特定的 [TypeScript](https://www.typescriptlang.org) 組態檔繼承自工作區範圍的 `tsconfig.json`。

| 應用程式專用組態檔 | 目的                                                                                                                                                                                                           |
|:---                                      |:---                                                                                                                                                                                                               |
| `tsconfig.app.json`                      | 應用程式專用的 [TypeScript 組態](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)，包含 [Angular 編譯器選項](reference/configs/angular-compiler-options)。 |
| `tsconfig.spec.json`                     | 應用程式測試的 [TypeScript 組態](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                                                                                              |

## 多個專案

多專案工作區適合於使用單一存放庫和全域設定來處理多個 Angular 專案（「monorepo」模型）的組織。
多專案工作區也支援函式庫開發。

### 建立多個專案的工作空間

如果您打算在工作區中有多個專案，您可以建立工作區時略過初始應用程式產生，並為工作區取一個唯一名稱。
以下指令建立一個工作區，包含所有工作區範圍的設定檔，但沒有根層級應用程式。

<docs-code language="shell">

ng new my-workspace --no-create-application

</docs-code>

然後，您可以產生在工作區內名稱獨一無二的應用程式和函式庫。

<docs-code language="shell">

cd my-workspace
ng generate application my-app
ng generate library my-lib

</docs-code>

### 多重專案檔案結構

第一個明確生成的應用程式會和工作空間中的所有其他專案一起進入 `projects` 資料夾。
新生成的程式庫也會新增至 `projects` 底下。
當你以這種方式建立專案時，工作空間的檔案結構會與 [工作空間設定檔](reference/configs/workspace-config) `angular.json` 的結構完全一致。

```markdown
my-workspace/
  ├── …                (workspace-wide configuration files)
  └── projects/        (applications and libraries)
      ├── my-app/      (an explicitly generated application)
      │   └── …        (application-specific code and configuration)
      └── my-lib/      (a generated library)
          └── …        (library-specific code and configuration)
```

## 函式庫專案檔案

當您使用 CLI (以命令 `ng generate library my-lib` 為例) 產生函式庫時，產生的檔案會進入工作區的 `projects/` 資料夾中。
有關如何建立自己的函式庫的更多資訊，請參閱 [建立函式庫](tools/libraries/creating-libraries)。

與應用程式不同，函式庫有它自己的 `package.json` 組態檔案。

在 `projects/` 資料夾下，`my-lib` 資料夾包含您的程式庫程式碼。

| 函式庫原始碼檔案     | 目的                                                                                                                                                                                          |
|:---                      |:---                                                                                                                                                                                             |
| `src/lib`                | 包含函式庫專案的邏輯與資料。如同應用程式專案，函式庫專案可以包含元件、服務、模組、指令和管線。                                                                                                                                        |
| `src/public-api.ts`      | 指定從函式庫匯出的所有檔案。                                                                                                                                                                      |
| `ng-package.json`        | 供 [ng-packagr](https://github.com/ng-packagr/ng-packagr) 用於建立函式庫的設定檔。                                                                                                                                      |
| `package.json`           | 設定此函式庫所需的 [npm 套件相依性](reference/configs/npm-packages)。                                                                                                                                       |
| `tsconfig.lib.json`      | 函式庫專屬的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)，包含 [Angular 編譯器選項](reference/configs/angular-compiler-options)。 |
| `tsconfig.lib.prod.json` | 函式庫專屬的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)，用於以生產模式建立函式庫。                                                                                                                             |
| `tsconfig.spec.json`     | 函式庫單元測試的 [TypeScript 設定](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                                                                                                                             |
