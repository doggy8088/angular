# Angular 編譯器選項

使用[預先編譯（AOT）](guide/aot-compiler)時，你可以在 `tsconfig.json` [TypeScript 設定檔](guide/typescript-configuration)中指定*範本*編譯器選項，來控制應用程式的編譯方式。

範本選項物件 `angularCompilerOptions` 與 `compilerOptions` 物件並列，後者負責提供標準選項給 TypeScript 編譯器。

```json
    {
      "compilerOptions": {
        "experimentalDecorators": true,
                  ...
      },
      "angularCompilerOptions": {
        "fullTemplateTypeCheck": true,
        "preserveWhitespaces": true,
                  ...
      }
  }
  ```

{@a tsconfig-extends}
## 使用 extends 的設定繼承

與 TypeScript 編譯器相同，Angular AOT 編譯器也支援在 TypeScript 設定檔 `tsconfig.json` 的 `angularCompilerOptions` 區段中使用 `extends`。`extends` 屬性位於最上層，與 `compilerOptions` 和 `angularCompilerOptions` 並列。

TypeScript 設定可以透過 `extends` 屬性，從另一個檔案繼承設定。系統會先載入基礎檔案的設定選項，再由繼承的 `tsconfig` 檔案中的選項覆寫。

例如：

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "experimentalDecorators": true,
    ...
  },
  "angularCompilerOptions": {
    "fullTemplateTypeCheck": true,
    "preserveWhitespaces": true,
    ...
  }
}
```

更多資訊，請參閱 [TypeScript 手冊](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

## 範本選項

下列選項可用於設定 AOT 範本編譯器。

### `allowEmptyCodegenFiles`

設為 `true` 時，即使檔案是空的，也會建立所有可能的檔案。預設值為 `false`。供 Bazel 建置規則使用，以簡化 Bazel 規則追蹤檔案依賴關係的方式。請勿在 Bazel 規則之外使用此選項。

### `annotationsAs`

修改 Angular 專屬註解的輸出方式，以改善搖樹優化。非 Angular 的註解不受影響。可填 `static fields`（預設值）或 `decorators`。

* 預設情況下，編譯器會以類別中的靜態欄位取代裝飾器，讓 [Closure compiler](https://github.com/google/closure-compiler) 等進階搖樹工具能移除未使用的類別。

* `decorators` 值會保留裝飾器原樣，編譯速度較快。TypeScript 會輸出對 ` __decorate` 輔助函式的呼叫。使用 `--emitDecoratorMetadata` 進行執行階段反射（但請注意，產生的程式碼無法正確進行搖樹優化。

### `annotateForClosureCompiler`

設為 `true` 時，使用 [Tsickle](https://github.com/angular/tsickle) 為輸出的 JavaScript 加上 [Closure Compiler](https://github.com/google/closure-compiler) 所需的 [JSDoc](http://usejsdoc.org/) 註解。預設值為 `false`。

### `disableExpressionLowering`

預設值為 `true`，此時會轉換屬於註解、或可能用於註解的程式碼，使其能從範本工廠模組匯入。更多資訊，請參閱[中繼資料改寫](guide/aot-compiler#metadata-rewriting)。

設為 `false` 時，停用此改寫，改寫必須手動完成。

### `disableTypeScriptVersionCheck`

設為 `true` 時，編譯器不會查看 TypeScript 版本，在使用不支援的 TypeScript 版本時也不會回報錯誤。不建議使用，因為不支援的 TypeScript 版本可能會有未定義的行為。預設值為 `false`。

### `enableIvy`

啟用 [Ivy](guide/ivy) 編譯與渲染管線。自版本 9 起，預設值為 `true`。在版本 9 中，你可以[退出 Angular Ivy](guide/ivy#opting-out-of-angular-ivy)，繼續使用先前的編譯器 View Engine。

對於使用 CLI 產生的程式庫專案，`prod` 設定在版本 9 中的預設值為 `false`。

### `enableResourceInlining`

設為 `true` 時，會將所有 `@Component` 裝飾器中的 `templateUrl` 與 `styleUrls` 屬性，取代為 `template` 與 `styles` 屬性中的行內內容。

啟用時，`ngc` 的 `.js` 輸出不會包含任何延遲載入的範本或樣式 URL。

對於使用 CLI 產生的程式庫專案，`dev` 設定的預設值為 `true`。

{@a enablelegacytemplate}

### `enableLegacyTemplate`

設為 `true` 時，啟用 `<template>` 元素的使用；該元素已在 Angular 4.0 中棄用，改用 `<ng-template>`（以避免與 DOM 中同名的元素衝突）。預設值為 `false`。某些第三方 Angular 函式庫可能會需要此選項。

### `flatModuleId`

匯入平面模組時要使用的模組 ID（當 `flatModuleOutFile` 為 `true` 時）。範本編譯器建立的參照，在從平面模組匯入符號時會使用這個模組名稱。若 `flatModuleOutFile` 為 `false`，此選項會被忽略。

### `flatModuleOutFile`

設為 `true` 時，會產生指定檔案名稱的平面模組索引，以及對應的平面模組中繼資料。可用來建立封裝方式與 `@angular/core` 和 `@angular/common` 類似的平面模組。使用此選項時，函式庫的 `package.json` 應參照所建立的平面模組索引，而不是函式庫索引檔案。

只會產生一個 `.metadata.json` 檔案，其中包含從函式庫索引匯出的符號所需的全部中繼資料。在所建立的 `.ngfactory.js` 檔案中，會使用平面模組索引來匯入符號。這些符號同時包含函式庫索引的公開 API，以及被遮蔽的內部符號。

預設情況下，系統會假設在 `files` 欄位中提供的 `.ts` 檔案就是函式庫索引。若指定了多個 `.ts` 檔案，則會使用 `libraryIndex` 來選取要使用的檔案。若提供了多個 `.ts` 檔案但沒有 `libraryIndex`，系統會產生錯誤。

系統會在與函式庫索引 `.d.ts` 檔案相同的位置，以指定的 `flatModuleOutFile` 名稱建立平面模組索引 `.d.ts` 與 `.js`。

例如，若某個函式庫使用 `public_api.ts` 檔案作為模組的函式庫索引，`tsconfig.json` 的 `files` 欄位會是 `["public_api.ts"]`。接著可以將 `flatModuleOutFile` 選項設為（例如）`"index.js"`，如此便會產生 `index.d.ts` 與 `index.metadata.json` 檔案。該函式庫 `package.json` 的 `module` 欄位會是 `"index.js"`，`typings` 欄位會是 `"index.d.ts"`。

### `fullTemplateTypeCheck`

設為 `true` 時（建議值），啟用範本編譯器的[繫結運算式驗證](guide/aot-compiler#binding-expression-validation)階段。此階段使用 TypeScript 驗證繫結運算式。更多資訊，請參閱[範本型別檢查](guide/template-typecheck)。

預設值為 `false`，但使用 Angular CLI 指令 `ng new` 時，所建立專案的設定中預設會將其設為 `true`。

### `generateCodeForLibraries`

設為 `true` 時（預設值），會為具有對應 `.metadata.json` 檔案的 `.d.ts` 檔案建立工廠檔案（`.ngfactory.js` 與 `.ngstyle.js`）。

設為 `false` 時，只會為 `.ts` 檔案建立工廠檔案。使用工廠摘要時，請這樣設定。


### `preserveWhitespaces`

預設值為 `false`，此時會從已編譯的範本中移除空白文字節點，讓輸出的範本工廠模組更小。設為 `true` 則保留空白文字節點。

### `skipMetadataEmit`

設為 `true` 時，不會產生 `.metadata.json` 檔案。預設值為 `false`。

`.metadata.json` 檔案包含範本編譯器需要的資訊，這些資訊來自 `.ts` 檔案，但未包含在 TypeScript 編譯器產生的 `.d.ts` 檔案中。這些資訊包括例如註解的內容（例如元件的範本），TypeScript 會將其輸出到 `.js` 檔案，但不會輸出到 `.d.ts` 檔案。

使用工廠摘要時可以設為 `true`，因為工廠摘要已包含 `.metadata.json` 檔案中資訊的副本。

若你使用 TypeScript 的 `--outFile` 選項，請設為 `true`，因為中繼資料檔案不適用於這種形式的 TypeScript 輸出。不過，我們不建議在 Angular 中使用 `--outFile`。請改用打包工具，例如 [webpack](https://webpack.js.org/)。

### `skipTemplateCodegen`

設為 `true` 時，不會輸出 `.ngfactory.js` 與 `.ngstyle.js` 檔案。這會關閉大部分的範本編譯器，並停用範本診斷的回報。

可用來指示範本編譯器產生 `.metadata.json` 檔案，隨 `npm` 套件一同發布。這樣可避免產生無法發布到 `npm` 的 `.ngfactory.js` 與 `.ngstyle.js` 檔案。

對於使用 Angular CLI 建立的函式庫專案，`dev` 設定的預設值為 `true`。

### `strictMetadataEmit`

設為 `true` 時，若 `"skipMetadataEmit"` 為 `false`，會將錯誤回報到 `.metadata.json` 檔案。預設值為 `false`。僅在 `"skipMetadataEmit"` 為 `false` 且 `"skipTemplateCodeGen"` 為 `true` 時使用。

此選項用來驗證要隨 `npm` 套件一同打包的 `.metadata.json` 檔案。這項驗證相當嚴格，可能會為中繼資料回報錯誤，但這些中繼資料被範本編譯器使用時永遠不會產生錯誤。你可以在記錄某個符號的註解中加入 `@dynamic`，藉此抑制此選項針對該匯出符號所輸出的錯誤。

`.metadata.json` 檔案中包含錯誤是有效的。若中繼資料被用來決定註解的內容，範本編譯器會回報這些錯誤。中繼資料收集器無法預測哪些符號是設計來用於註解的。它會預先將錯誤節點包含在匯出符號的中繼資料中。範本編譯器接著便可使用這些錯誤節點，在這些符號被使用時回報錯誤。

若某個函式庫的用戶端打算在註解中使用某個符號，範本編譯器通常不會回報此事。它會在用戶端實際使用該符號之後才回報。此選項讓這些錯誤能在函式庫的建置階段被偵測出來，例如在產生 Angular 函式庫本身時便會用到。

對於使用 Angular CLI 建立的函式庫專案，`dev` 設定的預設值為 `true`。

### `strictInjectionParameters`

設為 `true` 時（建議值），若某個所提供參數的注入型別無法判定，會回報錯誤。設為 `false` 時（目前的預設值），標記為 `@Injectable` 的類別中型別無法解析的建構函式參數，會產生警告。

使用 Angular CLI 指令 `ng new` 時，所建立專案的設定中預設會將其設為 `true`。

### `strictTemplates`

設為 `true` 時，在 Angular 版本 9 中啟用[嚴格範本型別檢查](guide/template-typecheck#嚴格模式)。嚴格模式僅在使用 [Ivy](guide/ivy) 時可用。

其他嚴格旗標可讓你啟用與停用特定類型的嚴格範本型別檢查。請參閱[範本錯誤疑難排解](guide/template-typecheck#範本錯誤疑難排解)。


### `trace`

設為 `true` 時，在編譯範本時列印額外資訊。預設值為 `false`。
