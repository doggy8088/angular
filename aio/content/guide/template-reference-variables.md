# 了解範本變數

範本變數協助你在範本的一個部分，使用來自範本另一個部分的資料。
使用範本變數來執行工作，例如回應使用者輸入，或微調應用程式的表單。

範本變數可以參照以下項目：

* 範本內的 DOM 元素
* 指令或元件
* 來自 [ng-template](api/core/ng-template) 的 [TemplateRef](api/core/TemplateRef)
* <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web 元件</a>

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的運作範例。

</div>

## 先決條件

* [了解範本](guide/template-overview)

## 語法

在範本中，你使用井字號 `#` 來宣告範本變數。
以下範本變數 `#phone` 宣告了一個 `phone` 變數，其值為 `<input>` 元素。

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

## 指定名稱的變數

* 如果變數在右側指定了名稱，例如 `#var="ngModel"`，該變數會參照元素上具有相符 `exportAs` 名稱的指令或元件。
<!-- What does the second half of this mean?^^ Can we explain this more fully? Could I see a working example? -kw -->

### 搭配範本變數使用 `NgForm`

在大多數情況下，Angular 會將範本變數的值設為它所在的元素。
在前面的範例中，`phone` 參照的是電話號碼 `<input>`。
按鈕的 click 處理常式會把 `<input>` 值傳給元件的 `callPhone()` 方法。

`NgForm` 指令示範了如何透過參照指令的 `exportAs` 名稱，取得對不同值的參照。
在以下範例中，範本變數 `itemForm` 出現了三次，中間以 HTML 隔開。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

如果沒有 `ngForm` attribute 值，`itemForm` 的參照值會是
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)，也就是 `<form>`。
如果元素是 Angular 元件，沒有 attribute 值的參照會自動參照元件實例。否則，沒有值的參照會參照 DOM 元素，即使該元素套用了一個或多個指令。
<!-- What is the train of thought from talking about a form element to the difference between a component and a directive? Why is the component directive conversation relevant here?  -kw I agree -alex -->

## 範本變數範圍

就像 JavaScript 或 TypeScript 程式碼中的變數一樣，範本變數的作用範圍是宣告它們的範本。

類似地，`*ngIf` 與 `*ngFor` 等[結構指令](guide/built-in-directives)，或 `<ng-template>` 宣告，會建立新的巢狀範本範圍，就像 JavaScript 的 `if` 與 `for` 等控制流程陳述式會建立新的詞彙範圍一樣。你無法從這些結構指令的邊界之外，存取其中的範本變數。

<div class="alert is-helpful">

在範本中只定義變數一次，讓執行時期值保持可預測。

</div>

### 在巢狀範本中存取

內層範本可以存取外層範本定義的範本變數。

在以下範例中，變更 `<input>` 中的文字會變更 `<span>` 中的值，因為 Angular 會透過範本變數 `ref1` 立即更新變更。

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref-vars-scope1" header="src/app/app.component.html"></code-example>

在這個案例中，`<span>` 上的 `*ngIf` 建立了新的範本範圍，其中包含來自其父範圍的 `ref1` 變數。

不過，在父範本中從子範圍存取範本變數是行不通的：

```html
  <input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
  <span>Value: {{ ref2?.value }}</span> <!-- doesn't work -->
```

在這裡，`ref2` 是在 `*ngIf` 建立的子範圍中宣告的，無法從父範本存取。

{@a template-input-variable}
{@a template-input-variables}
## 範本輸入變數

_範本輸入變數_是一種變數，其值在該範本的實例建立時設定。請參閱：[撰寫結構指令](https://angular.io/guide/structural-directives)

在 `NgFor` 的完整形式用法中，可以看到範本輸入變數的實際運作：

```html
<ul>
  <ng-template ngFor let-hero [ngForOf]="heroes">
    <li>{{hero.name}}
  </ng-template>
</ul>
```

`NgFor` 指令會為 `heroes` 陣列中的每位英雄各具現化一次這個 <ng-template>，並為每個實例相應地設定 `hero` 變數。

當 `<ng-template>` 被具現化時，可以傳入多個具名值，它們可以繫結到不同的範本輸入變數。輸入變數的 `let-` 宣告右側可以指定該變數應該使用哪個值。

例如，`NgFor` 也提供對陣列中每位英雄的 `index` 的存取：

```html
<ul>
  <ng-template ngFor let-hero let-i="index" [ngForOf]="heroes">
    <li>Hero number {{i}}: {{hero.name}}
  </ng-template>
</ul>
```

## 下一步

[撰寫結構指令](https://angular.io/guide/structural-directives)

@reviewed 2022-05-12
