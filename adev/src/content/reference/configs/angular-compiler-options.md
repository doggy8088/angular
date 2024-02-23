# Angular 編譯器選項

當您使用 [即時編譯 (AOT)](tools/cli/aot-compiler)，您可以透過在 [TypeScript 設定檔](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)中指定 Angular 編譯器選項來控制您的應用程式編譯方式。

Angular 選項物件 `angularCompilerOptions` 是 `compilerOptions` 物件的兄弟物件，它提供標準選項給 TypeScript 編譯器。

<docs-code header="tsconfig.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.json" visibleRegion="angular-compiler-options"/>

## 透過 `extends` 繼承設定`

如同 TypeScript 編譯器，Angular AOT 編譯器也支援 TypeScript 組態檔案的 `angularCompilerOptions` 區段中的 `extends`。
`extends` 屬性位於頂層，與 `compilerOptions` 和 `angularCompilerOptions` 平行。

TypeScript 組態可以使用 `extends` 屬性從另一個檔案繼承設定。
基本檔案的組態選項會先載入，然後被繼承組態檔案中的選項覆寫。

例如：

<docs-code header="tsconfig.app.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.app.json" visibleRegion="angular-compiler-options-app"/>

如需了解更多資訊，請參閱 [TypeScript 手冊](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

## 範本選項

以下選項可供設定 Angular AOT 編譯器。

### `annotationsAs`

修改 Angular 特定註解的發射方式以改善樹狀搖晃。
非 Angular 註解不受影響。
`static fields` 或 `decorators` 之一。預設值為 `static fields`。

* 預設情況下，編譯器會使用類別中的靜態欄位取代裝飾器，這允許進階樹狀搖晃器 (例如 [Closure compiler](https://github.com/google/closure-compiler)) 移除未使用的類別
* `decorators` 值會保留裝飾器，這可以加快編譯速度。
    TypeScript 會呼叫 `__decorate` 輔助函數。
    使用 `--emitDecoratorMetadata` 以進行執行時期反射。

    有用的：產生的程式碼無法正確地進行樹狀搖晃。

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

當值為 `true` 時，使用 [Tsickle](https://github.com/angular/tsickle) 為發出的 JavaScript 加上 [JSDoc](https://jsdoc.app) 註解，[Closure Compiler](https://github.com/google/closure-compiler) 需要這些註解。
預設值為 `false`。

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

指定要使用的編譯模式。
以下模式可用：

| 模式       | 詳細資料 |
|:---         |:---     |
| `'full'`    | 根據當前使用的 Angular 版本，生成完全 AOT 編譯的程式碼。 |
| `'partial'` | 以穩定但中間的形式生成程式碼，適合公開的程式庫。                 |

預設值為 `'full'`。

對於大多數應用程式，`'full'` 是正確的編譯模式。

對於獨立發布的程式庫（例如 NPM 套件），請使用 `'partial'`。
`'partial'` 編譯會輸出一個穩定的中間格式，它可以更好地支援不同 Angular 版本的應用程式使用該程式庫。
在「HEAD」上與其應用程式一起建置並使用相同版本的 Angular 的程式庫（例如在單一儲存庫中）可以使用 `'full'`，因為沒有版本偏差的風險。

### `disableExpressionLowering`

當為 `true`（預設值）時，會轉換註解中使用或可能使用的程式碼，以允許從範本工廠模組匯入。
請參閱 [元資料改寫](tools/cli/aot-compiler#metadata-rewriting)以了解更多資訊。

當為 `false` 時，停用此改寫，需要手動完成改寫。

### `disableTypeScriptVersionCheck``

當 `true` 時，編譯器不會查看 TypeScript 版本，也不會在使用不受支援的 TypeScript 版本時報告錯誤。
不建議這樣做，因為不受支援的 TypeScript 版本可能會出現未定義的行為。
預設為 `false`。

### `enableI18nLegacyMessageIdFormat`

指示 Angular 範本編譯器為在範本中以 `i18n` 屬性標記的訊息建立舊版識別碼。
請參閱 [將文字標記為翻譯][AioGuideI18nCommonPrepareMarkTextInComponentTemplate] 以取得有關標記訊息以進行在地化的更多資訊。

除非您的專案仰賴使用舊式 ID 建立的翻譯，否則將此選項設定為「false」。
預設為「true」。

Ivy 訊息擷取工具在先前建立了多種舊版格式用於擷取訊息 ID。
這些訊息格式有一些問題，例如空白處理和依賴範本原始 HTML 內部資訊。

新的訊息格式更能抵抗空白的更動，在所有翻譯檔案格式中皆相同，並且可以直接從對 `$localize` 的呼叫中建立。
這允許應用程式程式碼中的 `$localize` 訊息使用與元件範本中相同的 `i18n` 訊息作為 ID。

### `enableResourceInlining`

當為 `true` 時，會以 `template` 和 `styles` 屬性中的內聯內容取代所有 `@Component` 裝飾器中的 `templateUrl` 和 `styleUrls` 屬性。

如果啟用，`ngc` 的 `.js` 輸出不包含任何延遲載入的範本或樣式網址。

對於使用 Angular CLI 建立的程式庫專案，開發配置預設為 `true`。

### `enableLegacyTemplate`

當為 `true` 時，啟用已棄用的 `<template>` 元素取代 `<ng-template>`。
預設為 `false`。
可能為某些第三方 Angular 函式庫所要求。

### `flatModuleId`

用於匯入平面模組的模組 ID（當 `flatModuleOutFile` 為 `true` 時）。
由範本編譯器建立的參考在從平面模組匯入符號時使用這個模組名稱。
如果 `flatModuleOutFile` 為 `false`，則忽略。

### `flatModuleOutFile`

當 `true` 時，產生給定檔案名稱的扁平模組索引和對應的扁平模組中繼資料。
用於建立封裝方式類似於 `@angular/core` 和 `@angular/common` 的扁平模組。
當使用此選項時，函式庫的 `package.json` 應參照建立的扁平模組索引，而不是函式庫索引檔案。

僅產生一個 `.metadata.json` 檔案，其中包含從函式庫索引匯出的符號的所有必要資訊。
在建立的 `.ngfactory.js` 檔案中，扁平模組索引用於匯入符號。符號包括函式庫索引的公共 API 和隱藏的內部符號。

預設情況下，假設 `files` 欄位中提供的 `.ts` 檔案是函式庫索引。
如果指定多個 `.ts` 檔案，則使用 `libraryIndex` 選擇要使用的檔案。
如果提供多個 `.ts` 檔案而沒有 `libraryIndex`，則會產生錯誤。

平面模組索引 `.d.ts` 和 `.js` 會在與程式庫索引 `.d.ts` 檔案相同的位址中，以指定的 `flatModuleOutFile` 名稱建立。

例如，如果某個函式庫使用 `public_api.ts` 檔案作為模組的函式庫索引，`tsconfig.json` `files` 欄位會是 `["public_api.ts"]`。
然後可以設定 `flatModuleOutFile` 選項，例如，設定為 `"index.js"`, 它會產生 `index.d.ts` 和 `index.metadata.json` 檔案。
函式庫的 `package.json` 的 `module` 欄位會是 `"index.js"`，而 `typings` 欄位會是 `"index.d.ts"`。

### `fullTemplateTypeCheck`

當 `true` 時，建議值，啟用範本編譯器的 [繫結表達式驗證](tools/cli/aot-compiler#binding-expression-validation) 階段。此階段使用 TypeScript 驗證繫結表達式。
如需更多資訊，請參閱 [範本類型檢查](tools/cli/template-typecheck)。

預設為 `false`，但當您使用 Angular CLI 命令 `ng new --strict` 時，它會在新專案的設定中設為 `true`。

重要：`fullTemplateTypeCheck` 選項已在 Angular 13 中棄用，取而代之的是 `strictTemplates` 編譯器選項家族。

### `generateCodeForLibraries`

當 `true` 時，為具有對應 `.metadata.json` 檔案的 `.d.ts` 檔案建立工廠檔案 \(`.ngfactory.js` 和 `.ngstyle.js`\)。預設值為 `true`。

當為 `false` 時，工廠檔案只會針對 `.ts` 檔案建立。
在使用工廠摘要時執行此操作。

### `preserveWhitespaces`

當為 `false`（預設），會從編譯的範本中移除空白文字節點，這會產生較小的已發射範本工廠模組。
設為 `true` 以保留空白文字節點。

有用的：在使用水合時，建議您使用 `preserveWhitespaces: false`，這是預設值。如果您選擇透過在 tsconfig 中加入 `preserveWhitespaces: true` 來啟用保留空白，您可能會遇到水合問題。這還不是完全受支援的設定。請確保這在伺服器和客戶端 tsconfig 檔案之間也一致設定。請參閱 [水合指南](guide/hydration#preserve-whitespaces)以了解更多詳情。

### `skipMetadataEmit`

當 `true` 時，不產生 `.metadata.json` 檔案。
預設值為 `false`。

`.metadata.json` 檔案包含範本編譯器從 `.ts` 檔案中需要的資訊，這些資訊未包含在 TypeScript 編譯器產生的 `.d.ts` 檔案中。
此資訊包括範例內容，例如元件範本，TypeScript 會將它發送到 `.js` 檔案，但不會發送到 `.d.ts` 檔案。

使用工廠摘要時，你可以設定為「true」，因為工廠摘要包含 `.metadata.json` 檔案中的資訊副本。

如果使用 TypeScript 的 `--outFile` 選項，請設定為 `true`，因為此類型的 TypeScript 輸出對元資料檔案無效。
Angular 社群不建議將 `--outFile` 與 Angular 搭配使用。
請改用打包器，例如 [webpack](https://webpack.js.org)。

### `skipTemplateCodegen`

當 `true` 時，不發出 `.ngfactory.js` 和 `.ngstyle.js` 檔案。
這會關閉大部分的範本編譯器並停用範本診斷報告。

可用於指示範本編譯器為 `npm` 套件分發產生 `.metadata.json` 檔案。這可避免產生無法分發到 `npm` 的 `.ngfactory.js` 和 `.ngstyle.js` 檔案。

對於使用 Angular CLI 建立的程式庫專案，開發配置預設為 `true`。

### `strictMetadataEmit`

當 `true` 時，如果 `"skipMetadataEmit"` 為 `false`，則會向 `.metadata.json` 檔案報告錯誤。
預設為 `false`。
僅在 `"skipMetadataEmit"` 為 `false` 且 `"skipTemplateCodegen"` 為 `true` 時使用。

此選項用於驗證針對與 `npm` 套件綑綁而發出的 `.metadata.json` 檔案。
驗證很嚴格，可能會針對模板編譯器使用時絕不會產生錯誤的元資料發出錯誤。
您可以選擇透過在記錄符號的註解中加入 `@dynamic` 來禁止此選項發出的錯誤。

`.metadata.json` 檔案包含錯誤是有效的。
如果使用元資料來決定註解的內容，範本編譯器會報告這些錯誤。
元資料收集器無法預測設計用於註解中的符號。它預先在匯出的符號的元資料中包含錯誤節點。
然後，範本編譯器可以使用錯誤節點來報告使用這些符號時的錯誤。

如果函式庫用戶打算在註解中使用符號，範本編譯器通常不會報告此情況。在用戶實際使用符號後才會報告。
這個選項允許在函式庫的建置階段偵測這些錯誤，例如，在製作 Angular 函式庫時使用。

對於使用 Angular CLI 建立的程式庫專案，開發配置預設為 `true`。

### `strictInjectionParameters`

當為 `true` 時，會針對無法判斷插入類型的提供的參數報告錯誤。
當為 `false` 時，無法解析其類型的已標記為 `@Injectable` 類別的建構函數參數會產生警告。
建議的值為 `true`，但預設值為 `false`。

當您使用 Angular CLI 指令 `ng new --strict` 時，它會在建立的專案設定中設為 `true`。

### `strictTemplates`

如果 `true`，則啟用 [嚴格的範本類型檢查](tools/cli/template-typecheck#strict-mode)。

此選項啟用的嚴格性旗標允許您開啟和關閉特定類型的嚴格範本類型檢查。
請參閱 [排除範本錯誤](tools/cli/template-typecheck#troubleshooting-template-errors)。

當您使用 Angular CLI 指令 `ng new --strict` 時，它會在新的專案設定中被設為 `true`。

### `trace`

當為 `true` 時，在編譯範本時會印出額外資訊。
預設為 `false`。

## 命令列選項

在多數情況下，您會使用 [Angular CLI](reference/configs/angular-compiler-options) 間接與 Angular 編譯器互動。在除錯某些問題時，您可能會發現直接呼叫 Angular 編譯器很有用。
您可以使用 `@angular/compiler-cli` npm 套件提供的 `ngc` 指令，從命令列呼叫編譯器。

`ngc` 命令是 TypeScript 的 `tsc` 編譯器命令的包裝器。Angular 編譯器主要透過 `tsconfig.json` 組態，而 Angular CLI 則主要透過 `angular.json` 組態。

除了設定檔，您也可以使用 [`tsc` 命令列選項](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 來設定 `ngc`。

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
