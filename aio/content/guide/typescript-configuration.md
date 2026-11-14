# TypeScript 設定

TypeScript 是 Angular 應用程式開發的主要語言。
它是 JavaScript 的超集，在設計階段支援型別安全與工具。

瀏覽器無法直接執行 TypeScript。Typescript 必須使用 *tsc* 編譯器「轉譯」為 JavaScript，
這需要一些設定。

本頁介紹 TypeScript 設定與 TypeScript 環境中對 Angular 開發者重要的部分，包括以下檔案的詳細資訊：

* [tsconfig.json](guide/typescript-configuration#tsconfig)&mdash;TypeScript 編譯器設定。
* [typings](guide/typescript-configuration#typings)&mdash;TypesScript 宣告檔案。

{@a tsconfig}

## *tsconfig.json*
通常，你會在專案中加入一個名為 `tsconfig.json` 的 TypeScript 設定檔，
以在編譯器產生 JavaScript 檔案時提供指引。

<div class="alert is-helpful">

如需了解 `tsconfig.json` 的詳細資訊，請參閱官方
[TypeScript wiki](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

</div>

[設定](guide/setup)指南使用下列 `tsconfig.json`：

<code-example lang="json" header="tsconfig.json" linenums="false">
  {
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "lib": [ "es2015", "dom" ],
      "noImplicitAny": true,
      "suppressImplicitAnyIndexErrors": true
    }
  }
</code-example>

這個檔案包含對 Angular 應用程式至關重要的選項與旗標。

{@a noImplicitAny}

### *noImplicitAny* 與 *suppressImplicitAnyIndexErrors*

TypeScript 開發者對於 `noImplicitAny` 旗標應該設為 `true` 還是 `false` 意見不一。
沒有正確答案，而且你之後也可以更改旗標。
但你現在的選擇可能會對較大的專案造成影響，因此值得討論。

當 `noImplicitAny` 旗標為 `false`（預設值），且編譯器無法根據變數的使用方式推斷其型別時，編譯器會默默地將型別預設為 `any`。這就是 *隱含 `any`* 的意思。

文件設定將 `noImplicitAny` 旗標設為 `true`。
當 `noImplicitAny` 旗標為 `true` 且 TypeScript 編譯器無法推斷型別時，它仍會產生 JavaScript 檔案，但同時也會**回報錯誤**。
許多經驗豐富的開發者偏好這種較嚴格的設定，因為型別檢查能在編譯時期捕捉更多無意的錯誤。

即使 `noImplicitAny` 旗標為 `true`，你仍可把變數的型別設為 `any`。

當 `noImplicitAny` 旗標為 `true` 時，你可能還會遇到 *隱含索引錯誤*。
大多數開發者認為 *這個特定錯誤* 帶來的困擾大於幫助。
你可以用下列額外的旗標來抑制它們：

<code-example format=".">
  "suppressImplicitAnyIndexErrors":true

</code-example>

文件設定也將這個旗標設為 `true`。

{@a typings}

## TypeScript 型別定義
許多 JavaScript 函式庫（例如 jQuery、Jasmine 測試函式庫與 Angular）以 TypeScript 編譯器本身無法辨識的功能與語法，擴充了 JavaScript 環境。
當編譯器無法辨識某個內容時，就會丟出錯誤。

使用 [TypeScript 型別定義檔](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)&mdash;`d.ts files`&mdash;來告訴編譯器你載入的函式庫。

支援 TypeScript 的編輯器會利用這些相同的定義檔，來顯示函式庫功能的型別資訊。

許多函式庫會在 npm 套件中附上定義檔，讓 TypeScript 編譯器與編輯器都能找到它們。Angular 就是其中一個函式庫。
任何 Angular 應用程式的 `node_modules/@angular/core/` 資料夾中，都包含數個描述 Angular 各部分的 `d.ts` 檔案。

**對於內含 `d.ts` 檔案的函式庫套件，你不需要做任何事就能取得 *typings* 檔案。
Angular 套件已內含這些檔案。**

### lib.d.ts

TypeScript 內含一個特殊的宣告檔案，稱為 `lib.d.ts`。這個檔案包含 JavaScript 執行階段與 DOM 中各種常見 JavaScript 結構的環境宣告。

根據 `--target`，TypeScript 會加入 _額外的_ 環境宣告，例如當 target 為 `es6` 時加入 `Promise`。

由於 QuickStart 以 `es5` 為目標，你可以覆寫要包含的宣告檔案清單：

<code-example format=".">
  "lib": ["es2015", "dom"]

</code-example>

正因如此，即使目標是 `es5`，你也擁有全部的 `es6` 型別定義。

### 可安裝的型別定義檔
許多函式庫&mdash;其中包括 jQuery、Jasmine 與 Lodash&mdash;*並未*在 npm 套件中附上 `d.ts` 檔案。
幸好，這些函式庫的作者或社群貢獻者已為它們建立了獨立的 `d.ts` 檔案，並發佈在眾所周知的位置。

你可以使用 `npm`，透過 [`@types/*` 範圍套件](http://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html) 安裝這些型別定義，而 TypeScript 從 2.0 起會自動辨識它們。

例如，要安裝 `jasmine` 的型別定義，你可以執行 `npm install @types/jasmine --save-dev`。

QuickStart 用到兩個 *typings*，也就是 `d.ts` 檔案：

* [jasmine](http://jasmine.github.io/) 型別定義，供 Jasmine 測試框架使用。

* [node](https://www.npmjs.com/package/@types/node)，供參照 *Node.js®* 環境中物件的程式碼使用；

QuickStart 並不要求這些型別定義，但許多範例會用到。

{@a target}

### *target*

預設目標是 `es5`，如果你只想把應用程式部署到相容 es6 的瀏覽器，可以把目標設定為 `es6`。但若在某些舊瀏覽器（例如 `IE`）中把目標設定為 `es6`，將會丟出 `Syntax Error`。
