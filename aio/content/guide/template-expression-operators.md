<!-- {@a expression-operators} -->

# 範本運算式運算子

Angular 範本運算式語言採用 JavaScript 語法的子集，並輔以少數針對特定情境的特殊運算子。接下來的章節將介紹其中三個運算子：

* [管道](guide/template-expression-operators#pipe)
* [安全導航運算子](guide/template-expression-operators#safe-navigation-operator)
* [非空值斷言運算子](guide/template-expression-operators#non-null-assertion-operator)

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

{@a pipe}

## 管道運算子（`|`）

運算式的結果在準備用於繫結之前，可能需要先經過一些轉換。
例如，你可以將數字顯示為貨幣、將文字改為大寫，或篩選清單並加以排序。

管道是簡單的函式，接受一個輸入值並回傳轉換後的值。
使用管道運算子（`|`），就能輕鬆地在範本運算式中套用它們：

<code-example path="template-expression-operators/src/app/app.component.html" region="uppercase-pipe" header="src/app/app.component.html"></code-example>

管道運算子會將左側運算式的結果，傳給右側的管道函式。

你可以透過多個管道串連運算式：

<code-example path="template-expression-operators/src/app/app.component.html" region="pipe-chain" header="src/app/app.component.html"></code-example>

你也可以為管道[套用參數](guide/pipes#parameterizing-a-pipe)：

<code-example path="template-expression-operators/src/app/app.component.html" region="date-pipe" header="src/app/app.component.html"></code-example>

`json` 管道對於繫結的除錯特別有幫助：

<code-example path="template-expression-operators/src/app/app.component.html" region="json-pipe" header="src/app/app.component.html"></code-example>

產生的輸出大致如下：

<code-example language="json">
  { "name": "Telephone",
    "manufactureDate": "1980-02-25T05:00:00.000Z",
    "price": 98 }
</code-example>

<div class="alert is-helpful">

管道運算子的優先順序高於三元運算子（`?:`），
這表示 `a ? b : c | x` 會被解析為 `a ? b : (c | x)`。
不過，由於種種原因，
管道運算子在 `?:` 的第一個與第二個運算元中，無法在不加括號的情況下使用。
在第三個運算元中也使用括號，是良好的做法。

</div>


<hr/>

{@a safe-navigation-operator}

## 安全導航運算子（ `?` ）與 null 屬性路徑

Angular 的安全導航運算子 `?`，可以防範屬性路徑中的 `null` 與 `undefined`
值。在這裡，當 `item` 為 `null` 時，它能避免檢視渲染失敗。

<code-example path="template-expression-operators/src/app/app.component.html" region="safe" header="src/app/app.component.html"></code-example>

如果 `item` 為 `null`，檢視仍會渲染，但顯示的值是空白的；你只會看到「The item name is:」，其後什麼都沒有。

請看下一個使用 `nullItem` 的範例。

<code-example language="html">
  The null item name is {{nullItem.name}}
</code-example>

由於沒有安全導航運算子，且 `nullItem` 為 `null`，JavaScript 與 Angular 會擲出 `null` 參照錯誤，並中斷 Angular 的渲染過程：

<code-example language="bash">
  TypeError: Cannot read property 'name' of null.
</code-example>

不過，屬性路徑中的 `null` 值在某些情況下是可以接受的，
特別是當值一開始為 null、但資料最終會送達的時候。

使用安全導航運算子 `?`，Angular 會在遇到第一個 `null` 值時停止求值該運算式，並在不發生錯誤的情況下渲染檢視。

它對於 `a?.b?.c?.d` 這樣的長屬性路徑也能完美運作。


<hr/>

{@a non-null-assertion-operator}

## 非空值斷言運算子（ `!` ）

自 TypeScript 2.0 起，你可以使用 `--strictNullChecks` 旗標，強制啟用[嚴格空值檢查](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript")。TypeScript 會確保沒有任何變數在非預期的情況下為 `null` 或 `undefined`。

在此模式下，具型別的變數預設不允許 `null` 與 `undefined`。如果你讓某個變數未指派值，或嘗試將 `null` 或 `undefined` 指派給型別不允許 `null` 與 `undefined` 的變數，型別檢查器會擲出錯誤。

如果型別檢查器無法判斷某個變數在執行時會是 `null` 或 `undefined`，也會擲出錯誤。你可以套用後綴的
[非空值斷言運算子 !](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator")，告訴型別檢查器不要擲出錯誤。

Angular 的非空值斷言運算子 `!`，在 Angular 範本中也有相同的用途。例如，你可以斷言 `item` 的屬性也已定義。

<code-example path="template-expression-operators/src/app/app.component.html" region="non-null" header="src/app/app.component.html"></code-example>

當 Angular 編譯器將你的範本轉換為 TypeScript 程式碼時，
它會防止 TypeScript 回報 `item.color` 可能為 `null` 或 `undefined`。

與[安全導航運算子](guide/template-expression-operators#safe-navigation-operator "Safe navigation operator (?)")不同，
非空值斷言運算子不會防範 `null` 或 `undefined`。
相反地，它會告訴 TypeScript 型別檢查器，針對特定的屬性運算式，暫停嚴格的 `null` 檢查。

非空值斷言運算子 `!` 是選用的，唯一的例外是當你開啟嚴格空值檢查時，就必須使用它。

{@a any-type-cast-function}

## `$any()` 型別轉換函式

有時繫結運算式會在 [AOT 編譯](guide/aot-compiler)期間觸發型別錯誤，而且無法或難以完整指定型別。
若要消除這個錯誤，你可以使用 `$any()` 轉換函式，將
運算式轉換為 [`any` 型別](http://www.typescriptlang.org/docs/handbook/basic-types.html#any)，如下列範例所示：

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html"></code-example>

當 Angular 編譯器將此範本轉換為 TypeScript 程式碼時，
它會在對範本執行型別檢查時，防止 TypeScript 回報 `bestByDate` 不是 `item`
物件的成員。

`$any()` 轉換函式也可以搭配 `this` 使用，以便存取元件
未宣告的成員。

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html"></code-example>

`$any()` 轉換函式可在繫結運算式中任何方法呼叫有效的位置使用。
