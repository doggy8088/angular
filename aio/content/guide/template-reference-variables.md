# 範本變數

範本變數協助你在範本的一個部分，使用來自範本另一個部分的資料。
使用範本變數來執行工作，例如回應使用者輸入，或微調應用程式的表單。

範本變數可以參照以下項目：

*   範本內的 DOM 元素
*   指令
*   元素
*   [TemplateRef](api/core/TemplateRef)
*   [web 元件](https://developer.mozilla.org/docs/Web/Web_Components "MDN: Web Components")

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的運作範例。

</div>

## 語法

在範本中，你使用井字號（`#`）字元來宣告範本變數。
以下範本變數 `#phone` 在 `<input>` 元素上宣告了一個 `phone` 變數。

<code-example header="src/app/app.component.html" path="template-reference-variables/src/app/app.component.html" region="ref-var"></code-example>

在元件範本中的任何地方參照範本變數。
在這裡，範本下方的一個 `<button>` 參照了 `phone` 變數。

<code-example header="src/app/app.component.html" path="template-reference-variables/src/app/app.component.html" region="ref-phone"></code-example>

## Angular 如何將值指派給範本變數

Angular 會依據你宣告變數的位置，將值指派給範本變數：

*   如果你在元件上宣告變數，該變數會參照元件實例
*   如果你在標準 HTML 標籤上宣告變數，該變數會參照該元素
*   如果你在 `<ng-template>` 元素上宣告變數，該變數會參照代表該範本的 `TemplateRef` 實例。
    更多關於 `<ng-template>` 的資訊，請參閱[結構指令](guide/structural-directives)中的[Angular 如何使用星號 `*` 語法](guide/structural-directives#asterisk)。

*   如果變數在右側指定了名稱，例如 `#var="ngModel"`，該變數會參照元素上具有相符 `exportAs` 名稱的指令或元件。
    <!--todo: What does the second half of this mean?^^ Can we explain this more fully? Could I see a working example? -kw -->

### 搭配範本變數使用 `NgForm`

在大多數情況下，Angular 會將範本變數的值設為它所在的元素。
在前面的範例中，`phone` 參照的是電話號碼 `<input>`。
按鈕的 click 處理常式會把 `<input>` 值傳給元件的 `callPhone()` 方法。

Angular 會把 `NgForm` 指令套用到 `<form>` 元素上。這個範例示範如何透過參照指令的 `exportAs` 名稱，取得對不同值的參照。

<code-example header="src/app/hero-form.component.html" path="template-reference-variables/src/app/app.component.html" region="ngForm"></code-example>

如果沒有 `ngForm` attribute 值，`itemForm` 的參照值會是
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)，也就是 `<form>`。

有了 `NgForm`，`itemForm` 就是對 [NgForm](api/forms/NgForm "API: NgForm") 指令的參照，能夠追蹤表單中每個控制項的值與有效性。

與原生 `<form>` 元素不同，`NgForm` 指令有一個 `form` 屬性。
`NgForm` 的 `form` 屬性讓你能在 `itemForm.form.valid` 無效時停用提交按鈕。

## 未指定值時的預設參照型別

在元素上宣告範本參照變數而不為它定義值時，它回傳的型別會反映它所套用的元素型別：

- **原生元素**：[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) 的特定子類別
- **元件**：特定元件類別的實例
- **NgTemplate**：TemplateRef

若要透過指令參照元素，需要把指令的 `exportAs` 屬性設為參照值。
在變數值未指定的情況下，參照會回傳 `HTMLElement`，即使該元素套用了一個或多個指令也一樣。

## 範本變數範圍

在範本變數周圍的範本內，任何地方都可以參照它。
`*ngIf` 與 `*ngFor` 等[結構指令](guide/built-in-directives)，或 `<ng-template>`，會充當範本的邊界。
你無法在這些邊界之外存取範本變數。

<div class="alert is-helpful">

在範本中只定義變數一次，讓執行時期值保持可預測。

</div>

### 在巢狀範本中存取

內層範本可以存取外層範本定義的範本變數。

在以下範例中，變更 `<input>` 中的文字會變更 `<span>` 中的值，因為 Angular 會透過範本變數 `ref1` 立即更新變更。

<code-example header="src/app/app.component.html" path="template-reference-variables/src/app/app.component.html" region="template-ref-vars-scope1"></code-example>

在這個案例中，`<span>` 周圍有一個隱含的 `<ng-template>`，而變數的定義在它之外。
從父範本存取範本變數之所以行得通，是因為子範本會繼承父範本的脈絡。

把前面的程式碼改寫成較冗長的形式，可以明確顯示出 `<ng-template>`。

<code-example format="html" language="html">

&lt;input #ref1 type="text" [(ngModel)]="firstExample" /&gt;

&lt;!-- New template --&gt;
&lt;ng-template [ngIf]="true"&gt;
  &lt;!-- Because the context is inherited, the value is available to the new template --&gt;
  &lt;span&gt;Value: {{ ref1.value }}&lt;/span&gt;
&lt;/ng-template&gt;

</code-example>

不過，從父範本之外存取範本變數是行不通的。

<code-example format="html" language="html">

&lt;input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" /&gt;
&lt;span&gt;Value: {{ ref2?.value }}&lt;/span&gt; &lt;!-- doesn't work --&gt;

</code-example>

冗長形式顯示 `ref2` 在父範本之外。

<code-example format="html" language="html">

&lt;ng-template [ngIf]="true"&gt;
  &lt;!-- The reference is defined within a template --&gt;
  &lt;input #ref2 type="text" [(ngModel)]="secondExample" /&gt;
&lt;/ng-template&gt;
&lt;!-- ref2 accessed from outside that template doesn't work --&gt;
&lt;span&gt;Value: {{ ref2?.value }}&lt;/span&gt;

</code-example>

請看以下使用 `*ngFor` 的範例。

<code-example format="html" language="html">

&lt;ng-container *ngFor="let i of [1,2]"&gt;
  &lt;input #ref type="text" [value]="i" /&gt;
&lt;/ng-container&gt;
{{ ref.value }}

</code-example>

在這裡，`ref.value` 無法運作。
同一個迴圈的冗長語法說明了原因：

<code-example format="html" language="html">
  
&lt;ng-template ngFor let-i [ngForOf]="[1,2]"&gt;
  &lt;input #ref type="text" [value]="i" /&gt;
&lt;/ng-template&gt;
{{ ref.value }}

</code-example>

嘗試存取 `ref.value` 屬性的插值出現在所參照元素的父範本之外，因此無法觸及。

把插值移到範本內，就能使用該變數。現在它會參照迴圈渲染的每個元素各自正確的值。

<code-example format="html" language="html">
  
&lt;ng-template ngFor let-i [ngForOf]="[1,2]"&gt;
  &lt;input #ref type="text" [value]="i" /&gt;
  {{ ref.value }}
&lt;/ng-template&gt;

</code-example>

這個片段顯示 2 個 `<input>` 元素，並印出各自的值。

### 在 `<ng-template>` 內存取範本變數

當你在 `<ng-template>` 上宣告變數時，該變數會參照代表該範本的 `TemplateRef` 實例。

<code-example header="src/app/app.component.html" path="template-reference-variables/src/app/app.component.html" region="template-ref"></code-example>

在這個範例中，點選按鈕會呼叫 `log()` 函式，把 `#ref3` 的值輸出到主控台。
因為 `#ref` 變數位於 `<ng-template>` 上，它的值是 `TemplateRef`。

以下是 `TemplateRef()` 函式在瀏覽器主控台展開後的輸出，其中包含 `TemplateRef` 的名稱。

<code-example format="shell" language="shell">

&blacktriangledown; ƒ TemplateRef()
name: "TemplateRef"
&lowbar;&lowbar;proto&lowbar;&lowbar;: Function

</code-example>

<a id="template-input-variable"></a>
<a id="template-input-variables"></a>

## 範本輸入變數

_範本輸入變數_是供範本的單一實例內部參照的變數。
你可以使用 `let` 關鍵字宣告範本輸入變數，例如 `let hero`。

如果省略它的值，它會取得 `$implicit` 範本脈絡的屬性的值。

這個範例中有幾個這樣的變數：`hero`、`i` 與 `odd`。
第一個變數取得被迭代項目的值，因為 `NgForOf` 會把該值指派給 `$implicit`。

<code-example format="html" language="html">
  
&lt;ng-template ngFor #hero let-hero [ngForOf]="heroes" let-i="index" let-odd="odd"&gt;
  &lt;div [class]="{'odd-row': odd}"&gt;{{i}}:{{hero.name}}&lt;/div&gt;
&lt;/ng-template&gt;

</code-example>

變數的作用範圍限於重複範本的單一實例。
在其他結構指令的定義中，可以再次使用相同的變數名稱。

當同一個範本中宣告了同名的_範本參照變數_與_範本輸入變數_時，後者優先。
