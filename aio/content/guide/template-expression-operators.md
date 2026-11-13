# 範本運算式運算子

<div class="callout is-critical">

<header>已標記為封存</header>

為了確保你獲得最佳體驗，本主題已標記為待歸檔，直到我們確認它能清楚傳達最正確的資訊為止。

在此期間，這個主題或許有幫助：[階層式注入器](guide/hierarchical-dependency-injection)。

如果你認為這個內容不應該歸檔，請提交一個 [GitHub issue](https://github.com/angular/angular/issues/new?template=3-docs-bug.md)。

</div>

Angular 範本運算式語言採用 JavaScript 語法的子集，並輔以少數針對特定情境的特殊運算子。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

<a id="non-null-assertion-operator"></a>

## 非空值斷言運算子（`!`）

當你使用 TypeScript 的 `--strictNullChecks` 旗標時，可以使用 Angular 的非空值斷言運算子 `!`，來防止型別檢查器擲出錯誤。

Angular 的非空值斷言運算子會讓 TypeScript 型別檢查器針對特定的屬性運算式，暫停嚴格的 `null` 與 `undefined` 檢查。

例如，你可以斷言 `item` 的屬性也已定義。

<code-example header="src/app/app.component.html" path="template-expression-operators/src/app/app.component.html" region="non-null"></code-example>

通常，你會想確保任何屬性繫結都不是 `null` 或 `undefined`。不過，有些情況下這樣的狀態是可以接受的。針對這些情況，你可以使用 Angular 的非空值斷言運算子，來防止 TypeScript 回報某個屬性為 `null` 或 `undefined`。

非空值斷言運算子 `!` 是選用的，除非你開啟了嚴格空值檢查。

如需更多資訊，請參閱 TypeScript 的[嚴格空值檢查](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript")。

<a id="any-type-cast-function"></a>

## `$any()` 型別轉換函式

有時繫結運算式會在 [AOT 編譯](guide/aot-compiler)期間觸發型別錯誤，而且無法或難以完整指定型別。若要消除這個錯誤，你可以使用 `$any()` 轉換函式，把運算式轉換為 [`any` 型別](https://www.typescriptlang.org/docs/handbook/basic-types.html#any)，如下列範例所示：

<code-example header="src/app/app.component.html" path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1"></code-example>

使用 `$any()` 可以防止 TypeScript 回報 `bestByDate` 不是 `item` 物件的成員。

`$any()` 轉換函式也可以搭配 `this` 使用，以便存取元件未宣告的成員。

<code-example header="src/app/app.component.html" path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2"></code-example>

`$any()` 轉換函式可在繫結運算式中任何方法呼叫有效的位置使用。

另外請注意，`$any()` 只會影響型別。產生的程式碼中沒有方法呼叫；`$any()` 函式會在編譯時完全消除。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
