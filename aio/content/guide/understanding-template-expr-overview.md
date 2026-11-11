# 了解範本運算式

本主題探討 Angular 文字插值的一些面向。


## 語法

範本運算式與 JavaScript 運算式相似。
許多 JavaScript 運算式都是合法的範本運算式，但有下列例外。

你不能使用具有副作用或會助長副作用的 JavaScript 運算式，包括：

* 指派（`=`, `+=`, `-=`, `...`）
* `new`、`typeof` 或 `instanceof` 等運算子
* 以 <code>;</code> 或 <code>,</code> 串連運算式
* 遞增與遞減運算子 `++` 和 `--`
* 部分 ES2015+ 運算子

與 JavaScript 語法其他值得注意的差異包括：

* 不支援 `|` 和 `&` 等位元運算子
* 新的[範本運算式運算子](guide/template-expression-operators)，例如 `|`、`?.` 與 `!`

## 運算式上下文

插值運算式有一個上下文，也就是運算式所屬的應用程式特定部分。一般而言，這個上下文就是元件實例。

在下列程式碼片段中，運算式 `recommended` 與運算式 `itemImageUrl2` 參照的是 `AppComponent` 的屬性。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html"></code-example>

運算式也可以參照_範本_上下文的屬性，例如[範本輸入變數](guide/structural-directives#shorthand)或[範本參照變數](guide/template-reference-variables)。

下列範例使用了一個範本輸入變數 `customer`.

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)"></code-example>

下一個範例則使用範本參照變數 `#customerInput`.

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)"></code-example>

<div class="alert is-helpful">

範本運算式不能參照全域命名空間中的任何東西，`undefined` 除外。
它們不能參照 `window` 或 `document`。
此外，它們不能呼叫 `console.log()` 或 `Math.max()`，且只能參照運算式上下文的成員。

</div>

### 避免名稱衝突

運算式求值所依據的上下文，是範本變數、指令的上下文物件（如果有的話）與元件成員的聯集。
如果你參照的名稱同時屬於其中多個命名空間，Angular 會套用下列優先順序邏輯來決定上下文：

1. 範本變數名稱。
1. 指令上下文中的名稱。
1. 元件的成員名稱。

為了避免某個上下文中的變數遮蔽另一個上下文中的變數，請讓變數名稱保持唯一。
在下列範例中，`AppComponent` 範本問候了 `customer`，也就是 Padma。

接著 `ngFor` 會列出 `customers` 陣列中的每個 `customer`。

<code-example path="interpolation/src/app/app.component.1.ts" region="var-collision" header="src/app/app.component.ts"></code-example>

`ngFor` 內的 `customer` 位於 `<ng-template>` 的上下文中，因此參照的是 `customers` 陣列中的 `customer`，在此案例中是 Ebony 與 Chiho。
這份清單不會出現 Padma，因為 `ngFor` 外的 `customer` 位於不同的上下文中。
相反地，`<h1>` 中的 `customer` 不包含 Ebony 或 Chiho，因為這個 `customer` 的上下文是類別，而類別中 `customer` 的值是 Padma。

## 運算式最佳實務

使用範本運算式時，請遵循下列最佳實務：

* **使用簡短的運算式**

  盡可能使用屬性名稱或方法呼叫。將應用程式與業務邏輯保留在元件中，讓它易於開發和測試。

* **快速執行**

  Angular 會在每次[變更偵測](guide/glossary#變更偵測（change-detection）)週期後執行範本運算式。許多非同步活動都會觸發變更偵測週期，例如 promise 的解析、HTTP 結果、計時器事件、按鍵與滑鼠移動。

  運算式應該要能快速完成，讓使用者體驗盡可能有效率，在較慢的裝置上尤其如此。當運算需要較多資源時，可以考慮快取其值。

* **不要造成可見的副作用**

  根據 Angular 的[單向資料流模型](guide/glossary#單向資料流（unidirectional-data-flow）)，範本運算式不應變更目標屬性值以外的任何應用程式狀態。讀取一個元件值，不應改變其他顯示中的值。檢視在單次算繪過程中應該保持穩定。

  <div class="callout is-important">
    <header>冪等運算式能減少副作用</header>

    [冪等](https://en.wikipedia.org/wiki/Idempotence)運算式沒有副作用，能提升 Angular 的變更偵測效能。以 Angular 的用語來說，冪等運算式在它的相依值改變之前，永遠回傳_完全相同的東西_。

    相依值在事件迴圈的單次輪轉期間不應改變。如果冪等運算式回傳字串或數字，連續呼叫兩次會回傳相同的字串或數字。如果運算式回傳物件（包括 `array`），連續呼叫兩次會回傳相同的物件_參照_。

  </div>

  <div class="alert is-important">

  這項行為有一個例外，適用於 `*ngFor`。
  `*ngFor` 具有 `trackBy` 功能，可以在走訪物件時處理物件中變化的值。
  詳情請參閱 [*ngFor* 與 `trackBy`](guide/built-in-directives#ngfor-with-trackby)。

  </div>

## 後續步驟

* 屬性繫結

@reviewed 2022-03-31
