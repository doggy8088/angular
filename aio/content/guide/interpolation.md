# 插值與範本運算式

插值讓你可以將計算得到的字串納入 HTML 元素標籤之間的文字，以及屬性指派之中。範本運算式就是你用來計算這些字串的工具。

<div class="alert is-helpful">

本指南中的所有語法與程式碼片段，請見 <live-example></live-example>。

</div>

## 插值 `{{...}}`

插值是指將運算式嵌入標記文字中。
依預設，插值以雙大括號 `{{` 與 `}}` 作為其分隔符號。

在以下範例中，`{{ currentCustomer }}` 就是插值的一個範例。

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1" header="src/app/app.component.html"></code-example>

大括號之間的文字通常是元件屬性的名稱。Angular 會以對應元件屬性的字串值取代該名稱。

<code-example path="interpolation/src/app/app.component.html" region="component-property" header="src/app/app.component.html"></code-example>

在上例中，Angular 會評估 `title` 與 `itemImageUrl` 屬性並填入空白，先顯示一些標題文字，接著顯示一張圖片。

更一般來說，大括號之間的文字是一個範本運算式，Angular 會先評估它，再將它轉換為字串。
下列插值以兩個數字相加來說明這一點：

<code-example path="interpolation/src/app/app.component.html" region="convert-string" header="src/app/app.component.html"></code-example>

運算式可以叫用宿主元件的方法，例如以下範例中的 `getVal()`：

<code-example path="interpolation/src/app/app.component.html" region="invoke-method" header="src/app/app.component.html"></code-example>

Angular 會評估雙大括號中的所有運算式，將運算式結果轉換為字串，並將它們與相鄰的文字字串連結。最後，它會將這個組合而成的插值結果指派給**元素或指令屬性。**

你看起來像是把結果插入元素標籤之間，並指派給屬性。
然而，插值是一種特殊語法，Angular 會把它轉換成*屬性繫結*。

<div class="alert is-helpful">

如果你想使用 `{{` 與 `}}` 以外的符號，可以透過 `Component` 中繼資料中的
[interpolation](api/core/Component#interpolation)
選項，設定插值分隔符號。

</div>

## 範本運算式

範本**運算式**會產生一個值，並出現在雙大括號 `{{ }}` 之內。
Angular 會執行該運算式，並將它指派給繫結目標的一個屬性；
目標可以是 HTML 元素、元件或指令。

`{{1 + 1}}` 的插值大括號包圍著範本運算式 `1 + 1`。
在屬性繫結中，
範本運算式會出現在引號內、位於&nbsp;`=` 符號的右側，如 `[property]="expression"`。

就語法而言，範本運算式與 JavaScript 相似。
許多 JavaScript 運算式都是合法的範本運算式，但有少數例外。

你不能使用具有副作用或會助長副作用的 JavaScript 運算式，
包括：

* 指派（`=`, `+=`, `-=`, `...`）
* `new`、`typeof`、`instanceof` 等運算子
* 以 <code>;</code> 或 <code>,</code> 串連運算式
* 遞增（`++`）與遞減（`--`）運算子
* 部分 ES2015+ 運算子

與 JavaScript 語法其他值得注意的差異包括：

* 不支援 `|` 和 `&` 等位元運算子
* 新的[範本運算式運算子](guide/template-expression-operators)，例如 `|`、`?.` 與 `!`


## 運算式上下文

*運算式上下文*通常就是 _元件_ 實例。
在以下程式碼片段中，雙大括號內的 `recommended` 與引號內的
`itemImageUrl2` 參照的是 `AppComponent` 的屬性。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html"></code-example>

運算式也可以參照*範本*上下文的屬性
例如範本輸入變數、
<!-- link to built-in-directives#template-input-variables -->
`let customer`，或範本參照變數 `#customerInput`。
<!-- link to guide/template-ref-variables -->

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)"></code-example>

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)"></code-example>

運算式中詞彙的上下文，是*範本變數*、
指令的 _context_ 物件（如果有的話）與元件*成員*的混合。
如果你參照的名稱同時屬於其中多個命名空間，
範本變數名稱的優先順序最高，其次是指令 _context_ 中的名稱，
最後才是元件的成員名稱。

前一個範例就呈現了這樣的名稱衝突。元件有一個 `customer`
屬性，而 `*ngFor` 定義了一個 `customer` 範本變數。

<div class="alert is-helpful">

`{{customer.name}}` 中的 `customer`
參照的是範本輸入變數，而不是元件的屬性。

範本運算式不能參照全域命名空間中的任何東西，
`undefined` 除外。它們不能參照
`window` 或 `document`。此外，它們
不能呼叫 `console.log()` 或 `Math.max()`，且只能參照
運算式上下文的成員。

</div>

## 運算式準則

使用範本運算式時，請遵循下列準則：

* [簡單](guide/interpolation#簡單)
* [快速執行](guide/interpolation#快速執行)
* [無可見副作用](guide/interpolation#無可見副作用)

### 簡單

雖然可以撰寫複雜的範本運算式，但比較好的
做法是避免這麼做。

屬性名稱或方法呼叫應該是常態，但偶爾使用布林否定 `!` 是可以的。
除此之外，請將應用程式與業務邏輯侷限在元件中，
讓它易於開發和測試。

### 快速執行

Angular 會在每次變更偵測週期後執行範本運算式。
許多非同步活動都會觸發變更偵測週期，例如
promise 的解析、HTTP 結果、計時器事件、按鍵與滑鼠移動。

運算式應該要能快速完成，否則使用者體驗可能會拖慢，在較慢的裝置上尤其如此。
當運算需要較多資源時，可以考慮快取其值。

### 無可見副作用

範本運算式不應變更目標屬性值以外的
任何應用程式狀態。

這條規則是 Angular「單向資料流」政策的關鍵。
你永遠不必擔心讀取一個元件值可能會改變其他顯示中的值。
檢視在單次算繪過程中應該保持穩定。

[冪等](https://en.wikipedia.org/wiki/Idempotence)運算式是理想的選擇，因為
它沒有副作用，還能提升 Angular 的變更偵測效能。
以 Angular 的用語來說，冪等運算式
在它的相依值改變之前，永遠回傳*完全相同的東西*。

相依值在事件迴圈的單次輪轉期間不應改變。
如果冪等運算式回傳字串或數字，連續呼叫兩次會回傳相同的字串或數字。如果運算式回傳物件（包括 `array`），連續呼叫兩次會回傳相同的物件*參照*。

<div class="alert is-helpful">

這項行為有一個例外，適用於 `*ngFor`。`*ngFor` 具有 `trackBy` 功能，可以在走訪物件時處理物件的參照不等式。詳情請參閱 [*ngFor with `trackBy`](guide/built-in-directives#搭配-trackby-使用-ngfor)。

</div>
