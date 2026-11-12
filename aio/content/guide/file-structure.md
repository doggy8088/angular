# 工作區與專案檔案結構

你要在 Angular [工作區](guide/glossary#工作區workspace)的脈絡下開發應用程式。一個工作區包含一或多個[專案](guide/glossary#專案project)的檔案。一個專案就是組成一個獨立應用程式或一個可共用函式庫的檔案集合。

Angular CLI 的 `ng new` 指令會建立一個工作區。

<code-example format="shell" language="shell">

ng new &lt;my-project&gt;

</code-example>

執行這個指令時，CLI 會在新的工作區中安裝必要的 Angular npm 套件與其他依賴，並建立一個名為 *my-project* 的根層級應用程式。工作區根資料夾包含各種支援與設定檔，以及一個帶有產生出來的描述文字的 README 檔案，你可以自訂它。

依預設，`ng new` 會在工作區的根層級建立一個初始骨架應用程式，以及它的端對端測試。這個骨架是一個簡單的 Welcome 應用程式，隨時可以執行，也很容易修改。根層級應用程式與工作區同名，原始檔案位於工作區的 `src/` 子資料夾中。

這種預設行為適合典型的「多儲存庫」開發風格，也就是每個應用程式都位於各自的工作區中。
建議初學者與中階使用者使用 `ng new`，為每個應用程式建立個別的工作區。

Angular 也支援包含[多個專案](#多個專案)的工作區。這種開發環境適合正在開發[可共用函式庫](guide/glossary#程式庫library)的進階使用者，也適合採用「monorepo」開發風格的企業：以單一儲存庫與全域組態管理所有的 Angular 專案。

若要設定單一儲存庫工作區，你應該略過建立根應用程式。
請參閱下方的[為多專案工作區進行設定](#多個專案)。

## 工作區設定檔

工作區內的所有專案都共用一個 [CLI 組態脈絡](guide/workspace-config)。工作區的最上層包含工作區層級的設定檔、根層級應用程式的設定檔，以及根層級應用程式原始檔案與測試檔案的子資料夾。

| 工作區設定檔 | 用途                                                                                                                                                                                                                                                                                                                                                                               |
|:---                           |:---                                                                                                                                                                                                                                                                                                                                                                                   |
| `.editorconfig`               | 程式碼編輯器的組態。請見 [EditorConfig](https://editorconfig.org)。                                                                                                                                                                                                                                                                                                        |
| `.gitignore`                  | 指定 [Git](https://git-scm.com) 應該忽略的刻意不追蹤的檔案。                                                                                                                                                                                                                                                                                               |
| `README.md`                   | 根應用程式的介紹文件。                                                                                                                                                                                                                                                                                                                                  |
| `angular.json`                | 工作區中所有專案的 CLI 組態預設值，包括 CLI 使用的建置、伺服與測試工具的組態選項，例如 [Karma](https://karma-runner.github.io) 與 [Protractor](https://www.protractortest.org)。詳情請見[Angular 工作區組態](guide/workspace-config)。                                                    |
| `package.json`                | 設定工作區中所有專案都可用的 [npm 套件依賴](guide/npm-packages)。關於這個檔案的具體格式與內容，請見 [npm 文件](https://docs.npmjs.com/files/package.json)。                                                                                                                                                  |
| `package-lock.json`           | 提供 npm 用戶端安裝到 `node_modules` 的所有套件的版本資訊。詳情請見 [npm 文件](https://docs.npmjs.com/files/package-lock.json)。如果你使用 yarn 用戶端，這個檔案會是 [yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock)。                                                                                   |
| `src/`                        | 根層級應用程式專案的原始檔案。                                                                                                                                                                                                                                                                                                                                  |
| `node_modules/`               | 為整個工作區提供 [npm 套件](guide/npm-packages)。工作區層級的 `node_modules` 依賴對所有專案都可見。                                                                                                                                                                                                                                          |
| `tsconfig.json`               | 工作區中專案的基礎 [TypeScript](https://www.typescriptlang.org) 組態。所有其他組態檔都繼承自這個基礎檔案。如需更多資訊，請見 TypeScript 文件中的[使用 extends 進行組態繼承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends)一節。|

## 應用程式專案檔案

預設情況下，CLI 指令 `ng new my-app` 會建立一個名為 "my-app" 的工作區資料夾，並在工作區最上層的 `src/` 資料夾中產生新的應用程式骨架。
新產生的應用程式包含根模組的原始檔案，以及根元件與範本。

工作區檔案結構就緒後，你可以在命令列使用 `ng generate` 指令，為應用程式加入功能與資料。這個初始的根層級應用程式是 CLI 指令的*預設應用程式*（除非你在建立[其他應用程式](#多個專案)後變更預設值）。

<div class="alert is-helpful">

除了在命令列使用 CLI，你也可以直接在應用程式的原始檔案資料夾與組態檔中操作檔案。

</div>

對於單一應用程式工作區，工作區的 `src` 子資料夾包含根應用程式的原始檔案（應用程式邏輯、資料與資產）。對於多專案工作區，`projects` 資料夾中的其他專案包含一個 `project-name/src/` 子資料夾，結構相同。

### 應用程式原始檔案

`src/` 最上層的檔案用來支援測試與執行你的應用程式。子資料夾包含應用程式原始檔案與應用程式專屬組態。

| 應用程式支援檔案 | 用途                                                                                                                                                                                                                                                                                                                                                    |
|:---                       |:---                                                                                                                                                                                                                                                                                                                                                        |
| `app/`                    | 包含定義應用程式邏輯與資料的元件檔案。詳情請見[下方](#app-src)。                                                                                                                                                                                                                                          |
| `assets/`                 | 包含圖片與其他資產檔案，建置應用程式時會原樣複製。                                                                                                                                                                                                                                                                   |
| `favicon.ico`             | 在書籤列中為這個應用程式使用的圖示。                                                                                                                                                                                                                                                                                                   |
| `index.html`              | 有人造訪你的網站時提供的主要 HTML 頁面。CLI 在建置應用程式時會自動加入所有的 JavaScript 與 CSS 檔案，因此你通常不需要在這裡手動加入任何 `<script>` 或` <link>` 標籤。                                                                                                                         |
| `main.ts`                 | 應用程式的主要進入點。使用 [JIT 編譯器](guide/glossary#jit)編譯應用程式，並啟動應用程式的根模組（AppModule）在瀏覽器中執行。你也可以在 CLI 的 `build` 與 `serve` 指令加上 `--aot` 旗標，不需變更任何程式碼就使用 [AOT 編譯器](guide/aot-compiler)。 |
| `styles.css`             | 列出為專案提供樣式的 CSS 檔案。副檔名反映你為專案設定的樣式預處理器。                                                                                                                                                                                                                       |

<div class="alert is-helpful">

新的 Angular 專案依預設使用嚴格模式。如果不想要這樣，你可以在建立專案時選擇退出。如需更多資訊，請見[嚴格模式](guide/strict-mode)。

</div>

<a id="app-src"></a>

在 `src` 資料夾中，`app` 資料夾包含專案的邏輯與資料。
Angular 元件、範本與樣式都放在這裡。

| `src/app/` 檔案 | 用途 |
|---|---|
| `app/app.config.ts` | 定義應用程式組態邏輯，告訴 Angular 如何組裝應用程式。當你為應用程式加入更多 provider 時，必須在此宣告。<br><br>_僅在使用 `--standalone` 選項時產生。_ |
| `app/app.component.ts` | 為應用程式的根元件（名為 `AppComponent`）定義邏輯。隨著你為應用程式加入元件與服務，與這個根元件關聯的 view 會成為[view 階層](guide/glossary#檢視階層view-hierarchy)的根。 |
| `app/app.component.html` | 定義與根 `AppComponent` 關聯的 HTML 範本。 |
| `app/app.component.css` | 為根 `AppComponent` 定義基礎 CSS 樣式表。 |
| `app/app.component.spec.ts` | 為根 `AppComponent` 定義單元測試。 |
| `app/app.module.ts` | 定義根模組（名為 `AppModule`），告訴 Angular 如何組裝應用程式。最初只宣告 `AppComponent`。當你為應用程式加入更多元件時，必須在此宣告。<br><br>_使用 `--standalone` 選項時不會產生這個檔案。_ |

### 應用程式設定檔

根應用程式的應用程式專屬組態檔位於工作區根層級。對於多專案工作區，專案專屬組態檔位於專案根目錄下的 `projects/project-name/`。

專案專屬的 [TypeScript](https://www.typescriptlang.org) 設定檔，會繼承自工作區層級的 `tsconfig.json`。

| 應用程式專屬組態檔 | 用途                                                                                                                                                                                                                                                                      |
|:---                                      |:---                                                                                                                                                                                                                                                                          |
| `tsconfig.app.json`                      | 應用程式專屬的 [TypeScript](https://www.typescriptlang.org) 組態，包括 TypeScript 與 Angular 範本編譯器選項。請見[TypeScript 組態](guide/typescript-configuration)與 [Angular 編譯器選項](guide/angular-compiler-options)。 |
| `tsconfig.spec.json`                     | 應用程式測試的 [TypeScript](https://www.typescriptlang.org) 組態。請見[TypeScript 組態](guide/typescript-configuration)。                                                                                                                       |

<a id="multiple-projects"></a>

## 多個專案

多專案工作區適合使用單一儲存庫與全域組態管理所有 Angular 專案（「monorepo」模式）的企業。多專案工作區也支援函式庫開發。

### 為多專案工作區進行設定

如果你打算在一個工作區中擁有多個專案，可以在建立工作區時略過初始應用程式的產生，並為工作區取一個獨一無二的名稱。
下列指令會建立一個包含所有工作區層級設定檔的工作區，但不包含根層級應用程式。

<code-example format="shell" language="shell">

ng new my-workspace --no-create-application

</code-example>

接著你可以產生在工作區內名稱獨一無二的應用程式與函式庫。

<code-example format="shell" language="shell">

cd my-workspace
ng generate application my-first-app

</code-example>

### 多專案檔案結構

第一個明確產生的應用程式會與工作區中的所有其他專案一起放入 `projects` 資料夾。新產生的函式庫也會加入 `projects` 底下。以這種方式建立專案時，工作區的檔案結構與[工作區組態檔](guide/workspace-config) `angular.json` 的結構完全一致。

<div class="filetree">
    <div class="file">
        my-workspace
    </div>
    <div class="children">
        <div class="file">
          &hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; （工作區層級的設定檔）
        </div>
        <div class="file">
          projects &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; （產生的應用程式與函式庫）
        </div>
        <div class="children">
            <div class="file">
              my-first-app &nbsp; --（一個明確產生的應用程式）
            </div>
            <div class="children">
                <div class="file">
                  &hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --（應用程式專屬組態）
                </div>
                <div class="file">
                  src &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --（應用程式的原始檔案與支援檔案）
                </div>
            </div>
            <div class="file">
              my-lib &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --（一個產生的函式庫）
            </div>
            <div class="children">
                <div class="file">
                  &hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --（函式庫專屬組態）
                </div>
                <div class="file">
                  src &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --（函式庫的原始檔案與支援檔案）
                </div>
            </div>
        </div>
    </div>
</div>

## 函式庫專案檔案

使用 CLI 產生函式庫時（例如執行 `ng generate library my-lib` 這樣的指令），產生的檔案會放入工作區的 `projects/` 資料夾。如需進一步了解如何建立自己的函式庫，請見[建立函式庫](guide/creating-libraries)。

與應用程式不同，函式庫有自己的 `package.json` 組態檔。

在 `projects/` 資料夾下，`my-lib` 資料夾包含你的函式庫程式碼。

| 函式庫原始檔案     | 用途                                                                                                                                                                                                   |
|:---                      |:---                                                                                                                                                                                                       |
| `src/lib`                |  包含你的函式庫專案的邏輯與資料。與應用程式專案一樣，函式庫專案可以包含元件、服務、模組、指令與管道。                                         |
| `src/public-api.ts`      | 指定從你的函式庫匯出的所有檔案。                                                                                                                                                  |
| `ng-package.json`        | [ng-packagr](https://github.com/ng-packagr/ng-packagr) 用來建置你的函式庫的組態檔。                                                                                              |
| `package.json`           | 設定這個函式庫所需的 [npm 套件依賴](guide/npm-packages)。                                                                                                             |
| `tsconfig.lib.json`      | 函式庫專屬的 [TypeScript](https://www.typescriptlang.org) 組態，包括 TypeScript 與 Angular 範本編譯器選項。請見[TypeScript 組態](guide/typescript-configuration)。 |
| `tsconfig.lib.prod.json` | 函式庫專屬的 [TypeScript](https://www.typescriptlang.org) 組態，在正式模式建置函式庫時使用。                                                                   |
| `tsconfig.spec.json`     | 函式庫測試的 [TypeScript](https://www.typescriptlang.org) 組態。請見[TypeScript 組態](guide/typescript-configuration)。                                                        |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-04-24
