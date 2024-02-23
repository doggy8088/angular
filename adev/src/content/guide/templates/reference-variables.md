# 瞭解範本變數

模板變數可協助您在模板的不同部分使用來自模板某一特定部分的資料。
使用模板變數能執行多項工作，例如回應使用者輸入或微調應用程式的表單。

範本變數可以指涉下列項目：

* 模板中的 DOM 元素
* 指令或元件
* [ng-template](api/core/ng-template) 的 [TemplateRef](api/core/TemplateRef)
* <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">Web 元件</a>

## 語法

在範本中，您使用井號符號 `#` 宣告範本變數。
以下範本變數 `#phone` 宣告了一個 `phone` 變數，其值為 `<input>` 元素。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="ref-var" header="src/app/app.component.html"/>

在元件範本中的任何地方參照範本變數。
這裡，在範本下方的 `<button>` 參照 `phone` 變數。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="ref-phone" header="src/app/app.component.html"/>

## Angular 如何將值指定給範本變數

Angular 會根據您宣告變數的位置，將範本變數指派一個值：

* 如果你在元件上宣告變數，則變數會參照元件實例。
* 如果你在標準 HTML 標記上宣告變數，則變數會參照元素。
* 如果你在 `<ng-template>` 元素上宣告變數，則變數會參照代表範本的 `TemplateRef` 實例。
有關 `<ng-template>` 的更多資訊，請參閱 [結構性指令](guide/directives/structural-directives) 中的 [Angular 如何使用星號 `*` 語法](guide/directives/structural-directives#asterisk)。

## 指定名稱的變數

如果變數在右側指定名稱，例如 `#var="ngModel"`, 則變數會參考具有匹配 `exportAs` 名稱的元素上的指令或元件。

<!-- 這後半段是什麼意思？^^ 我們可以更詳細地解釋嗎？我可以看一個工作範例嗎？ -kw -->

### 使用具有範本變數的 `NgForm`

在多數情況下，Angular 會將範本變數值設定為發生該變數的元素。
在之前的範例中，`phone` 是指電話號碼 `<input>`。
按鈕的 click 處理函式將 `<input>` 值傳遞給元件的 `callPhone()` 方法。

`NgForm` 指令展示了透過參照指令的 `exportAs` 名稱來取得不同值的參照。
在以下範例中，範本變數 `itemForm` 出現三次，由 HTML 分隔。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="ngForm" header="src/app/hero-form.component.html"/>

如果沒有 `ngForm` 屬性值，`itemForm` 的參考值將會是 [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)，`<form>`。
如果元素是 Angular 元件，沒有屬性值的參考將會自動參考元件實例。否則，沒有值的參考將會參考 DOM 元素，即使該元素套用了一個或多個指令。

<!-- 談論表單元素到組件與指令的差別，思緒是怎麼跳躍的？為什麼組件指令的對話在這邊會是相關的？ -kw 我同意 -alex -->

## 範本變數範圍

就像 JavaScript 或 TypeScript 程式碼中的變數，範本變數的範圍為宣告它們的範本。

同樣地，結構性指令（如 `*ngIf` 和 `*ngFor`）或 `<ng-template>` 宣告會建立新的巢狀範本範圍，這很像 JavaScript 的控制流程語句，例如 `if` 和 `for` 會建立新的詞法範圍。你無法從結構性指令的邊界之外存取該結構性指令中的範本變數。

HELPFUL: 在範本中僅定義一次變數，因此執行時間值保持可預測性。

### 在巢狀範本中存取

內部範本可以存取外部範本定義的範本變數。

在以下範例中，變更 `<input>` 中的文字會變更 `<span>` 中的值，因為 Angular 會立即透過範本變數 `ref1` 更新變更。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="template-ref-vars-scope1" header="src/app/app.component.html"/>

在這種情況下，`<span>` 上的 `*ngIf` 會建立一個新的範本範圍，其中包含來自其父範圍的 `ref1` 變數。

然而，無法從父範本中的子範本存取範本變數：

```html
  <input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
  <span>Value: {{ ref2?.value }}</span> <!-- doesn't work -->
```

這裡，`ref2` 宣告在由 `*ngIf` 建立的子範圍中，無法從父範本存取。

## 範本輸入變數

_範本輸入變數_ 是在建立範本實例時設定值的變數。請參閱：[撰寫結構指令](/guide/directives/structural-directives)

在 `NgFor` 的長格式用法中可以看到範本輸入變數的實際運作：

```html
<ul>
  <ng-template ngFor let-hero [ngForOf]="heroes">
    <li>{{hero.name}}
  </ng-template>
</ul>
```

`NgFor` 指令會為 `heroes` 陣列中的每個英雄實例化這個 <ng-template> 一次，並為每個實例適當地設定 `hero` 變數。

當一個 `<ng-template>` 被實例化時，可以傳遞多個命名值，這些值可以綁定到不同的範本輸入變數。輸入變數的 `let-` 宣告的右邊可以指定該變數應該使用哪個值。

例如，`NgFor` 也提供對陣列中每個英雄的 `index` 的訪問權限：

```html
<ul>
  <ng-template ngFor let-hero let-i="index" [ngForOf]="heroes">
    <li>Hero number {{i}}: {{hero.name}}
  </ng-template>
</ul>
```

## 接下來

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="撰寫結構型指令"/>
</docs-pill-row>

