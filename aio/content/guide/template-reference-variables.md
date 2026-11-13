# 範本變數

範本變數協助你在範本的一個部分，使用來自範本另一個部分的資料。
使用範本變數來執行工作，例如回應使用者輸入，或微調應用程式的表單。

範本變數可以參照以下項目：

* 範本內的 DOM 元素
* 指令
* 元素
* [TemplateRef](api/core/TemplateRef)
* <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web 元件</a>

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的運作範例。

</div>

## 語法

在範本中，你使用井字號（`#`）來宣告範本變數。
以下範本變數 `#phone` 在 `<input>` 元素上宣告了一個 `phone` 變數。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

在元件範本中的任何地方參照範本變數。
在這裡，範本下方的一個 `<button>` 參照了 `phone` 變數。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

## Angular 如何將值指派給範本變數

Angular 會依據你宣告變數的位置，將值指派給範本變數：

* 如果你在元件上宣告變數，該變數會參照元件實例。
* 如果你在標準 HTML 標籤上宣告變數，該變數會參照該元素。
* 如果你在 `<ng-template>` 元素上宣告變數，該變數會參照代表該範本的 `TemplateRef` 實例。
  更多關於 `<ng-template>` 的資訊，請參閱[結構指令](guide/structural-directives)中的[Angular 如何使用星號 `*` 語法](guide/structural-directives#asterisk)。
* 如果變數在右側指定了名稱，例如 `#var="ngModel"`，該變數會參照元素上具有相符 `exportAs` 名稱的指令或元件。
<!-- What does the second half of this mean?^^ Can we explain this more fully? Could I see a working example? -kw -->

### 搭配範本變數使用 `NgForm`

在大多數情況下，Angular 會將範本變數的值設為它所在的元素。
在前面的範例中，`phone` 參照的是電話號碼 `<input>`。
按鈕的 click 處理常式會把 `<input>` 值傳給元件的 `callPhone()` 方法。

`NgForm` 指令示範如何透過參照指令的 `exportAs` 名稱，取得對不同值的參照。
在以下範例中，範本變數 `itemForm` 出現三次，中間以 HTML 隔開。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

如果沒有 `ngForm` attribute 值，`itemForm` 的參照值會是
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)，也就是 `<form>`。
不過，`Component` 與 `Directive` 之間存在一項差異：Angular 參照 `Component` 時不需指定 attribute 值，而 `Directive` 不會改變隱含的參照，也就是該元素。
<!-- What is the train of thought from talking about a form element to the difference between a component and a directive? Why is the component directive conversation relevant here?  -kw -->

有了 `NgForm`，`itemForm` 就是對 [NgForm](api/forms/NgForm "API: NgForm") 指令的參照，能夠追蹤表單中每個控制項的值與有效性。

與原生 `<form>` 元素不同，`NgForm` 指令有一個 `form` 屬性。
`NgForm` 的 `form` 屬性讓你能在 `itemForm.form.valid` 無效時停用提交按鈕。


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

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref-vars-scope1" header="src/app/app.component.html"></code-example>

在這個案例中，`<span>` 周圍有一個隱含的 `<ng-template>`，而變數的定義在它之外。
從父範本存取範本變數之所以行得通，是因為子範本會繼承父範本的脈絡。

把前面的程式碼改寫成較冗長的形式，可以明確顯示出 `<ng-template>`。

```html

<input #ref1 type="text" [(ngModel)]="firstExample" />

<!-- New template -->
<ng-template [ngIf]="true">
  <!-- Because the context is inherited, the value is available to the new template -->
  <span>Value: {{ ref1.value }}</span>
</ng-template>

```

不過，從父範本之外存取範本變數是行不通的。

```html
  <input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
  <span>Value: {{ ref2?.value }}</span> <!-- doesn't work -->
```

冗長形式顯示 `ref2` 在父範本之外。

```
<ng-template [ngIf]="true">
  <!-- The reference is defined within a template -->
  <input #ref2 type="text" [(ngModel)]="secondExample" />
</ng-template>
<!-- ref2 accessed from outside that template doesn't work -->
<span>Value: {{ ref2?.value }}</span>
```

請看以下使用 `*ngFor` 的範例。

```
<ng-container *ngFor="let i of [1,2]">
  <input #ref type="text" [value]="i" />
</ng-container>
{{ ref.value }}
```

在這裡，`ref.value` 無法運作。
結構指令 `*ngFor` 會把範本實例化兩次，因為 `*ngFor` 會迭代陣列中的兩個項目。
無法定義 `ref.value` 參照所代表的意義。

對於 `*ngFor` 或 `*ngIf` 這類結構指令，Angular 無從得知範本是否曾被實例化。

因此，Angular 無法存取該值，並會回傳錯誤。

### 在 `<ng-template>` 內存取範本變數

當你在 `<ng-template>` 上宣告變數時，該變數會參照代表該範本的 `TemplateRef` 實例。

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref" header="src/app/app.component.html"></code-example>

在這個範例中，點選按鈕會呼叫 `log()` 函式，把 `#ref3` 的值輸出到主控台。
因為 `#ref` 變數位於 `<ng-template>` 上，它的值是 `TemplateRef`。

以下是 `TemplateRef()` 函式在瀏覽器主控台展開後的輸出，其中包含 `TemplateRef` 的名稱。

<code-example language="sh">

&#9660; ƒ TemplateRef()
name: "TemplateRef"
__proto__: Function

</code-example>

{@a template-input-variable}
{@a template-input-variables}
## 範本輸入變數

_範本輸入變數_是供範本的單一實例內部參照的變數。
你可以使用 `let` 關鍵字宣告範本輸入變數，例如 `let hero`。

這個範例中有幾個這樣的變數：`hero`、`i` 與 `odd`。

```html
<ng-template #hero let-hero let-i="index" let-odd="isOdd">
  <div [class]="{'odd-row': odd}">{{i}}:{{hero.name}}</div>
</ng-template>
```

變數的作用範圍限於重複範本的單一實例。
在其他結構指令的定義中，可以再次使用相同的變數名稱。

相對地，你宣告範本變數的方式是在變數名稱前加上 `#` 前綴，例如 `#var`。
範本變數參照的是它所附加的元素、元件或指令。

範本輸入變數與範本變數的名稱各自擁有自己的命名空間。
`let hero` 中的範本輸入變數 `hero`，與 `#hero` 中的範本變數 `hero` 是不同的。
