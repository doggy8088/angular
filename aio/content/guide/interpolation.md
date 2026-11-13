# 文字插值

文字插值讓你可以將動態字串值納入你的 HTML 範本中。
使用插值可以動態改變應用程式檢視中呈現的內容，例如顯示包含使用者名稱的自訂問候語。

<div class="alert is-helpful">

本指南中的所有語法與程式碼片段，請見 <live-example></live-example>。

</div>

## 以插值顯示值

插值是指將運算式嵌入標記文字中。
依預設，插值使用雙大括號（`{{` 與 `}}`）字元作為分隔符號。

為了說明插值如何運作，以一個包含 `currentCustomer` 變數的 Angular 元件為例：

<code-example header="src/app/app.component.ts" path="interpolation/src/app/app.component.ts" region="customer"></code-example>

使用插值，在對應的元件範本中顯示這個變數的值：

<code-example header="src/app/app.component.html" path="interpolation/src/app/app.component.html" region="interpolation-example1"></code-example>

Angular 會以對應元件屬性的字串值取代 `currentCustomer`。
在這個案例中，值是 `Maria`。

在以下範例中，Angular 會評估 `title` 與 `itemImageUrl` 屬性，以顯示一些標題文字與一張圖片。

<code-example header="src/app/app.component.html" path="interpolation/src/app/app.component.html" region="component-property"></code-example>

## 範本運算式

範本**運算式**會產生一個值，並出現在雙大括號（`{{` 與 `}}`）字元之內。
Angular 會解析該運算式，並將它指派給繫結目標的一個屬性。
目標可以是 HTML 元素、元件或指令。

### 以插值解析運算式

更一般來說，大括號之間的文字是一個範本運算式，Angular 會先評估它，再將它轉換為字串。
下列插值以兩個數字相加來說明這一點：

<code-example header="src/app/app.component.html" path="interpolation/src/app/app.component.html" region="convert-string"></code-example>

運算式也可以叫用宿主元件的方法，例如下列範例中的 `getVal()`：

<code-example header="src/app/app.component.html" path="interpolation/src/app/app.component.html" region="invoke-method"></code-example>

使用插值時，Angular 會執行下列工作：

1.  評估雙大括號中的所有運算式。
1.  將運算式結果轉換為字串。
1.  將結果與任何相鄰的文字字串連結。
1.  將組合結果指派給元素或指令屬性。

<div class="alert is-helpful">

使用 `@Component()` 中繼資料中的 [interpolation](api/core/Component#interpolation) 選項，設定插值分隔符號。

</div>

### 語法

範本運算式與 JavaScript 運算式相似。
許多 JavaScript 運算式都是合法的範本運算式，但有下列例外。

你不能使用具有副作用或會助長副作用的 JavaScript 運算式，包括：

*   指派（`=`, `+=`, `-=`, `...`）
*   `new`、`typeof` 或 `instanceof` 等運算子
*   以 `;` 或 `,` 串連運算式
*   遞增（`++`）與遞減（`--`）運算子
*   部分 ES2015+ 運算子

與 JavaScript 語法其他值得注意的差異包括：

*   不支援 `|` 和 `&` 等位元運算子
*   新的[範本運算式運算子](guide/template-expression-operators)，例如 `|`、`?.` 與 `!`

## 運算式上下文

插值運算式有一個上下文，也就是運算式所屬的應用程式特定部分。
一般而言，這個上下文就是元件實例。

在下列程式碼片段中，運算式 `recommended` 與運算式 `itemImageUrl2` 參照的是 `AppComponent` 的屬性。

<code-example header="src/app/app.component.html" path="interpolation/src/app/app.component.html" region="component-context"></code-example>

運算式也可以參照*範本*上下文的屬性，例如[範本輸入變數](guide/structural-directives#shorthand)或[範本參照變數](guide/template-reference-variables)。

下列範例使用了一個範本輸入變數 `customer`。

<code-example header="src/app/app.component.html (template input variable)" path="interpolation/src/app/app.component.html" region="template-input-variable"></code-example>

下一個範例則使用範本參照變數 `#customerInput`。

<code-example header="src/app/app.component.html (template reference variable)" path="interpolation/src/app/app.component.html" region="template-reference-variable"></code-example>

<div class="alert is-helpful">

範本運算式不能參照全域命名空間中的任何東西，`undefined` 除外。
它們不能參照 `window` 或 `document`。
此外，它們不能呼叫 `console.log()` 或 `Math.max()`，且只能參照運算式上下文的成員。

</div>

### 避免名稱衝突

運算式求值所依據的上下文，是範本變數、指令的上下文物件（如果有的話）與元件成員的聯集。
如果你參照的名稱同時屬於其中多個命名空間，Angular 會套用下列邏輯來決定上下文：

1.  範本變數名稱。
1.  指令上下文中的名稱。
1.  元件的成員名稱。

為了避免某個上下文中的變數遮蔽另一個上下文中的變數，請讓變數名稱保持唯一。
在下列範例中，`AppComponent` 範本問候了 `customer`，也就是 Padma。

接著 `ngFor` 會列出 `customers` 陣列中的每個 `customer`。

<code-example header="src/app/app.component.ts" path="interpolation/src/app/app.component.1.ts" region="var-collision"></code-example>

`ngFor` 內的 `customer` 位於 `<ng-template>` 的上下文中，因此參照的是 `customers` 陣列中的 `customer`，在此案例中是 Ebony 與 Chiho。
這份清單不會出現 Padma，因為 `ngFor` 外的 `customer` 位於不同的上下文中。
相反地，`<h1>` 中的 `customer` 不包含 Ebony 或 Chiho，因為這個 `customer` 的上下文是類別，而類別中 `customer` 的值是 Padma。

## 運算式最佳實務

使用範本運算式時，請遵循下列最佳實務：

| 作法 | 詳細資訊 |
|:--- |:--- |
| 使用簡短的運算式 | 盡可能使用屬性名稱或方法呼叫。將應用程式與業務邏輯保留在元件中，讓它易於開發和測試。 |
| 快速執行 | Angular 會在每次[變更偵測](guide/glossary#變更偵測change-detection)週期後執行範本運算式。許多非同步活動都會觸發變更偵測週期，例如 promise 的解析、HTTP 結果、計時器事件、按鍵與滑鼠移動。 <br /> 運算式應該要能快速完成，讓使用者體驗盡可能有效率，在較慢的裝置上尤其如此。當運算需要較多資源時，可以考慮快取其值。 |
| 不要造成可見的副作用 | 根據 Angular 的[單向資料流模型](guide/glossary#單向資料流unidirectional-data-flow)，範本運算式不應變更目標屬性值以外的任何應用程式狀態。讀取一個元件值，不應改變其他顯示中的值。檢視在單次算繪過程中應該保持穩定。 <div class="callout is-important"> <header>冪等運算式能減少副作用</header> [冪等](https://en.wikipedia.org/wiki/Idempotence)運算式沒有副作用，能提升 Angular 的變更偵測效能。以 Angular 的用語來說，冪等運算式在它的相依值改變之前，永遠回傳*完全相同的東西*。 <br /> 相依值在事件迴圈的單次輪轉期間不應改變。如果冪等運算式回傳字串或數字，連續呼叫兩次會回傳相同的字串或數字。如果運算式回傳物件（包括 `array`），連續呼叫兩次會回傳相同的物件*參照*。 </div> <div class="alert is-important"> 這項行為有一個例外，適用於 `*ngFor`。`*ngFor` 具有 `trackBy` 功能，可以在走訪物件時處理物件中變化的值。詳情請參閱 [*ngFor with `trackBy`](guide/built-in-directives#ngfor-with-trackby)。 </div> |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
