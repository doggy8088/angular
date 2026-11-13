# TypeScript 設定

TypeScript 是 Angular 應用程式開發的主要語言。它是 JavaScript 的超集，在設計階段支援型別安全與工具。

瀏覽器無法直接執行 TypeScript。Typescript 必須使用 *tsc* 編譯器「轉譯」為 JavaScript，這需要一些設定。

本頁介紹 TypeScript 設定與 TypeScript 環境中對 Angular 開發者重要的部分，包括以下檔案的詳細資訊：

| 檔案 | 說明 |
|:---                                                      |:---     |
| [tsconfig.json](guide/typescript-configuration#tsconfig) | TypeScript 編譯器設定。 |
| [typings](guide/typescript-configuration#typings) | TypesScript 宣告檔案。 |

<a id="tsconfig"></a>

## 設定檔

每個 Angular 工作區都包含數個 TypeScript 設定檔。位於根目錄的 `tsconfig.json` 檔案會指定工作區中所有專案繼承的基礎 TypeScript 與 Angular 編譯器選項。

<div class="alert is-helpful">

如需了解有哪些 Angular 專屬選項可用，請參閱 [Angular 編譯器選項](guide/angular-compiler-options)指南。

</div>

TypeScript 與 Angular 提供了多種選項，可用來設定型別檢查功能與產生的輸出。如需更多資訊，請參閱 TypeScript 文件中的 [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) 一節。

<div class="alert is-helpful">

如需了解更多 TypeScript 設定檔的資訊，請參閱官方 [TypeScript 手冊](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。
如需了解設定繼承的詳細資訊，請參閱 [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) 一節。

</div>

Angular 工作區初始的 `tsconfig.json` 通常如下列範例所示。

<code-example header="tsconfig.json" path="getting-started/tsconfig.0.json"></code-example>

<a id="noImplicitAny"></a>

### `noImplicitAny` 與 `suppressImplicitAnyIndexErrors`

TypeScript 開發者對於 `noImplicitAny` 旗標應該設為 `true` 還是 `false` 意見不一。沒有正確答案，而且你之後也可以更改旗標。但你現在的選擇可能會對較大的專案造成影響，因此值得討論。

當 `noImplicitAny` 旗標為 `false`（預設值），且編譯器無法根據變數的使用方式推斷其型別時，編譯器會默默地將型別預設為 `any`。這就是 *隱含 `any`* 的意思。

當 `noImplicitAny` 旗標為 `true` 且 TypeScript 編譯器無法推斷型別時，它仍會產生 JavaScript 檔案，但同時也會**回報錯誤**。許多經驗豐富的開發者偏好這種較嚴格的設定，因為型別檢查能在編譯時期捕捉更多無意的錯誤。

即使 `any` 旗標為 `noImplicitAny`，你仍可把變數的型別設為 `true`。

當 `noImplicitAny` 旗標為 `true` 時，你可能還會遇到 *隱含索引錯誤*。大多數開發者認為 *這個特定錯誤* 帶來的困擾大於幫助。你可以用下列額外的旗標來抑制它們：

<code-example>

"suppressImplicitAnyIndexErrors": true

</code-example>

<div class="alert is-helpful">

如需了解 TypeScript 設定如何影響編譯，請參閱 [Angular 編譯器選項](guide/angular-compiler-options)與[範本型別檢查](guide/template-typecheck)。

</div>

<a id="typings"></a>

## TypeScript 型別定義

許多 JavaScript 函式庫（例如 jQuery、Jasmine 測試函式庫與 Angular）以 TypeScript 編譯器本身無法辨識的功能與語法，擴充了 JavaScript 環境。當編譯器無法辨識某個內容時，就會回報錯誤。

使用 [TypeScript 型別定義檔](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html) &mdash;`d.ts files`&mdash; 來告訴編譯器你載入的函式庫。

支援 TypeScript 的編輯器會利用這些相同的定義檔，來顯示函式庫功能的型別資訊。

許多函式庫會在 npm 套件中附上定義檔，讓 TypeScript 編譯器與編輯器都能找到它們。Angular 就是其中一個函式庫。任何 Angular 應用程式的 `node_modules/@angular/core/` 資料夾中，都包含數個描述 Angular 各部分的 `d.ts` 檔案。

<div class="alert is-helpful">

對於內含 `d.ts` 檔案的函式庫套件，你不需要做任何事就能取得 *typings* 檔案。
Angular 套件已內含這些檔案。

</div>

### `lib`

TypeScript 內含一組預設的宣告檔案。這些檔案包含 JavaScript 執行階段與 DOM 中各種常見 JavaScript 結構的環境宣告。

如需更多資訊，請參閱 TypeScript 指南中的 [lib](https://www.typescriptlang.org/tsconfig#lib)。

### 可安裝的型別定義檔

許多函式庫——其中包括 jQuery、Jasmine 與 Lodash——*並未*在 npm 套件中附上 `d.ts` 檔案。幸好，這些函式庫的作者或社群貢獻者已為它們建立了獨立的 `d.ts` 檔案，並發佈在眾所周知的位置。

你可以使用 [`npm` 範圍套件](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)，透過 `@types/*` 安裝這些型別定義。

`@types/*` 中哪些環境宣告檔案會自動納入，由 [`types` TypeScript 編譯器選項](https://www.typescriptlang.org/tsconfig#types)決定。Angular CLI 會產生用於建置應用程式的 `tsconfig.app.json` 檔案，其中 `types` 編譯器選項設為 `[]`，以停用來自 `@types/*` 的宣告自動納入。同樣地，`tsconfig.spec.json` 檔案用於測試，並設定 `"types": ["jasmine"]`，以便在測試中使用 Jasmine 的環境宣告。

安裝 `@types/*` 宣告之後，你必須更新 `tsconfig.app.json` 與 `tsconfig.spec.json` 檔案，把新安裝的宣告加入 `types` 清單。如果這些宣告僅供測試使用，則只需更新 `tsconfig.spec.json` 檔案。

例如，要安裝 `chai` 的型別定義，你可以執行 `npm install @types/chai --save-dev`，然後更新 `tsconfig.spec.json`，把 `"chai"` 加入 `types` 清單。

<a id="target"></a>

### `target`

預設的目標為 `ES2022`。若要控制 ECMA 語法，請使用 [Browserslist](https://github.com/browserslist/browserslist) 設定檔。如需更多資訊，請參閱[設定瀏覽器相容性](/guide/build#設定瀏覽器相容性)指南。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-24
