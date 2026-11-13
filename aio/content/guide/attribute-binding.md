# attribute、類別與樣式繫結

Angular 的 attribute 繫結能協助你直接為 attribute 設定值。
透過 attribute 繫結，你可以改善無障礙體驗、動態地為應用程式設定樣式，並同時管理多個 CSS 類別或樣式。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 繫結到 attribute

建議只要有可能，就用[屬性繫結](guide/property-binding)設定元素屬性。
然而，有時候你沒有可以繫結的元素屬性。
在這種情況下，就使用 attribute 繫結。

例如，[ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) 與
[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) 純粹是 attribute。
ARIA 與 SVG 都不對應元素屬性，也不會設定元素屬性。
在這些情況下，你必須使用 attribute 繫結，因為沒有對應的屬性目標。


## 語法

attribute 繫結的語法與[屬性繫結](guide/property-binding)相似，但你不是把元素屬性放在中括號之間，而是在 attribute 名稱前加上前綴 `attr`，後面再接一個點。
然後，你用一個解析為字串的運算式設定 attribute 的值。

<code-example language="html">

 &lt;p [attr.attribute-you-are-targeting]="expression"&gt;&lt;/p&gt;

</code-example>

<div class="alert is-helpful">

當運算式解析為 `null` 或 `undefined` 時，Angular 會完全移除該 attribute。

</div>

## 繫結 ARIA attribute

attribute 繫結的主要使用案例之一
就是設定 ARIA attribute，如下列範例所示：

<code-example path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria" header="src/app/app.component.html"></code-example>

{@a colspan}

## 繫結到 `colspan`

attribute 繫結另一個常見的使用案例，是表格中的 `colspan` attribute。
繫結到 `colspan` attribute，能協助你讓表格以程式方式保持動態。
視應用程式填入表格的資料量而定，一列所跨越的欄數可能會改變。

要對 `<td>` 的 attribute `colspan` 使用 attribute 繫結：

1. 使用下列語法指定 `colspan` attribute：`[attr.colspan]`。
1. 將 `[attr.colspan]` 設為等於一個運算式。

在下列範例中，你將 `colspan` attribute 繫結到運算式 `1 + 1`。

<code-example path="attribute-binding/src/app/app.component.html" region="colspan" header="src/app/app.component.html"></code-example>

這個繫結會使 `<tr>` 跨越兩欄。

<div class="alert is-helpful">

有時候，屬性的名稱與 attribute 的名稱會有所不同。

`colspan` 是 `<tr>` 的 attribute，而 `colSpan`（S 大寫）是屬性。
使用 attribute 繫結時，請使用小寫 s 的 `colspan`。
關於如何繫結到 `colSpan` 屬性，更多資訊請參閱 [Property Binding](guide/property-binding) 的 [`colspan` and `colSpan`](guide/property-binding#colspan) 一節。

</div>


{@a class-binding}
## 繫結到 `class` attribute

使用類別繫結，可以從元素的 `class` attribute 中加入和移除 CSS 類別名稱。

### 繫結到單一 CSS `class`

要建立單一類別繫結，請使用前綴 `class`，後面接一個點，再接 CSS 類別的名稱&mdash;例如 `[class.sale]="onSale"`。
當繫結的運算式 `onSale` 為 truthy 時，Angular 會加入該類別；當運算式為 falsy 時，則會移除該類別&mdash;`undefined` 除外。
更多資訊請參閱[樣式委派](guide/style-precedence#styling-delegation)。

### 繫結到多個 CSS 類別

要繫結到多個類別，請將 `[class]` 設為一個運算式&mdash;例如 `[class]="classExpression"`。
運算式可以是下列其中之一：

* 以空白分隔的類別名稱字串。
* 以類別名稱為鍵、以 truthy 或 falsy 運算式為值的物件。
* 類別名稱的陣列。

使用物件格式時，Angular 只會在類別的關聯值為 truthy 時加入該類別。

<div class="alert is-important">

對於任何類物件的運算式&mdash;例如 `object`、`Array`、`Map` 或 `Set`&mdash;物件的身分必須改變，Angular 才會更新類別清單。
只更新屬性而不改變物件身分是沒有效果的。

</div>

如果有多個繫結指向同一個類別名稱，Angular 會使用[樣式優先順序](guide/style-precedence)來決定採用哪個繫結。

下表摘要整理了類別繫結語法。

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="15%">
  </col>
  <col width="20%">
  </col>
  <col width="35%">
  </col>
  <col width="30%">
  </col>
  <tr>
    <th>
      繫結類型
    </th>
    <th>
      語法
    </th>
    <th>
      輸入類型
    </th>
    <th>
      輸入值範例
    </th>
  </tr>
  <tr>
    <td>單一類別繫結</td>
    <td><code>[class.sale]="onSale"</code></td>
    <td><code>boolean | undefined | null</code></td>
    <td><code>true</code>, <code>false</code></td>
  </tr>
  <tr>
    <td rowspan=3>多類別繫結</td>
    <td rowspan=3><code>[class]="classExpression"</code></td>
    <td><code>string</code></td>
    <td><code>"my-class-1 my-class-2 my-class-3"</code></td>
  </tr>
  <tr>
    <td><code>Record&lt;string, boolean | undefined | null&gt;</code></td>
    <td><code>{foo: true, bar: false}</code></td>
  </tr>
  <tr>
    <td><code>Array</code><<code>string</code>></td>
    <td><code>['foo', 'bar']</code></td>
  </tr>
</table>


{@a style-binding}
## 繫結到 style attribute

使用樣式繫結，可以動態設定樣式。

### 繫結到單一樣式

要建立單一樣式繫結，請使用前綴 `style`，後面接一個點，再接 CSS 樣式屬性的名稱&mdash;例如 `[style.width]="width"`。
Angular 會將屬性設為繫結運算式的值，該值通常是字串。
你也可以選擇性地加上單位後綴，例如 `em` 或 `%`，這需要數字型別。

<div class="alert is-helpful">

你可以用 [dash-case](guide/glossary#dash-case) 或
[camelCase](guide/glossary#camelcase) 來寫樣式屬性名稱。

<code-example language="html">
  &lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;

  &lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;
</code-example>

</div>

### 繫結到多個樣式

要切換多個樣式，請繫結到 `[style]` attribute&mdash;例如 `[style]="styleExpression"`。
`styleExpression` 可以是下列其中之一：

* 樣式的字串清單，例如 `"width: 100px; height: 100px; background-color: cornflowerblue;"`。
* 以樣式名稱為鍵、以樣式值為值的物件，例如 `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`。

請注意，不支援將陣列繫結到 `[style]`。

<div class="alert is-important">

將 `[style]` 繫結到物件運算式時，物件的身分必須改變，Angular 才會更新類別清單。
只更新屬性而不改變物件身分是沒有效果的。

</div>

#### 單一與多樣式繫結範例

<code-example path="attribute-binding/src/app/single-and-multiple-style-binding.component.ts" header="nav-bar.component.ts">
</code-example>

如果有多個繫結指向同一個樣式 attribute，Angular 會使用[樣式優先順序](guide/style-precedence)來決定採用哪個繫結。

下表摘要整理了樣式繫結語法。

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="15%">
  </col>
  <col width="20%">
  </col>
  <col width="35%">
  </col>
  <col width="30%">
  </col>
  <tr>
    <th>
      繫結類型
    </th>
    <th>
      語法
    </th>
    <th>
      輸入類型
    </th>
    <th>
      輸入值範例
    </th>
  </tr>
  <tr>
    <td>單一樣式繫結</td>
    <td><code>[style.width]="width"</code></td>
    <td><code>string | undefined | null</code></td>
    <td><code>"100px"</code></td>
  </tr>
  <tr>
  <tr>
    <td>單一樣式繫結（附單位）</td>
    <td><code>[style.width.px]="width"</code></td>
    <td><code>number | undefined | null</code></td>
    <td><code>100</code></td>
  </tr>
    <tr>
    <td rowspan=2>多樣式繫結</td>
    <td rowspan=2><code>[style]="styleExpression"</code></td>
    <td><code>string</code></td>
    <td><code>"width: 100px; height: 100px"</code></td>
  </tr>
  <tr>
    <td><code>Record&lt;string, string | undefined | null&gt;</code></td>
    <td><code>{width: '100px', height: '100px'}</code></td>
  </tr>
</table>

<div class="alert is-helpful">

[NgStyle](guide/built-in-directives/#ngstyle) 指令可以作為直接使用 `[style]` 繫結的替代方案。
不過，由於 Angular 的樣式繫結已有所改進，`NgStyle` 不再提供顯著的價值，未來可能最終被移除，因此建議使用前面不搭配 `NgStyle` 的樣式繫結語法。

</div>

{@a styling-precedence}
## 樣式優先順序

單一 HTML 元素的 CSS 類別清單與樣式值，可以繫結到多個來源（例如，來自多個指令的宿主繫結）。

當有多個繫結指向同一個類別名稱或樣式屬性時，Angular 會使用一組優先順序規則來解決衝突，並決定最終要對元素套用哪些類別或樣式。

<div class="alert is-helpful">
<h4>樣式優先順序（從最高到最低）</h4>

1. 範本繫結
    1. 屬性繫結（例如，`<div [class.foo]="hasFoo">` 或 `<div [style.color]="color">`）
    1. 對映繫結（例如，`<div [class]="classExpr">` 或 `<div [style]="styleExpr">`）
    1. 靜態值（例如，`<div class="foo">` 或 `<div style="color: blue">`）
1. 指令宿主繫結
    1. 屬性繫結（例如，`host: {'[class.foo]': 'hasFoo'}` 或 `host: {'[style.color]': 'color'}`）
    1. 對映繫結（例如，`host: {'[class]': 'classExpr'}` 或 `host: {'[style]': 'styleExpr'}`）
    1. 靜態值（例如，`host: {'class': 'foo'}` 或 `host: {'style': 'color: blue'}`）
1. 元件宿主繫結
    1. 屬性繫結（例如，`host: {'[class.foo]': 'hasFoo'}` 或 `host: {'[style.color]': 'color'}`）
    1. 對映繫結（例如，`host: {'[class]': 'classExpr'}` 或 `host: {'[style]': 'styleExpr'}`）
    1. 靜態值（例如，`host: {'class': 'foo'}` 或 `host: {'style': 'color: blue'}`）

</div>

類別或樣式繫結越具體，它的優先順序就越高。

繫結到特定類別（例如 `[class.foo]`）的優先順序高於一般的 `[class]` 繫結；繫結到特定樣式（例如 `[style.bar]`）的優先順序高於一般的 `[style]` 繫結。

<code-example path="attribute-binding/src/app/app.component.html" region="basic-specificity" header="src/app/app.component.html"></code-example>

具體程度規則也適用於來自不同來源的繫結。
一個元素可以同時擁有：在宣告它的範本中的繫結、來自相符指令的宿主繫結，以及來自相符元件的宿主繫結。

範本繫結最為具體，因為它們直接且專門地套用到元素上，所以具有最高的優先順序。

指令宿主繫結被認為較不具體，因為指令可以在多個位置使用，所以其優先順序比範本繫結低。

指令經常擴充元件的行為，因此來自元件的宿主繫結具有最低的優先順序。

<code-example path="attribute-binding/src/app/app.component.html" region="source-specificity" header="src/app/app.component.html"></code-example>

此外，繫結的優先順序高於靜態屬性。

在以下情形中，`class` 與 `[class]` 的具體程度相似，但 `[class]` 繫結是動態的，因此其優先順序較高。

<code-example path="attribute-binding/src/app/app.component.html" region="dynamic-priority" header="src/app/app.component.html"></code-example>

{@a styling-delegation}
### 委派給優先順序較低的樣式

優先順序較高的樣式可以使用 `undefined` 值，「委派」給優先順序較低的樣式。
將樣式屬性設為 `null` 可以確保該樣式被移除；將它設為 `undefined`，則會讓 Angular 退回該樣式次高優先順序的繫結。

舉例來說，請看下列範本：

<code-example path="attribute-binding/src/app/app.component.html" region="style-delegation" header="src/app/app.component.html"></code-example>

假設 `dirWithHostBinding` 指令與 `comp-with-host-binding` 元件都有一個 `[style.width]` 宿主繫結。
在這種情況下，如果 `dirWithHostBinding` 把它的繫結設定為 `undefined`，`width` 屬性就會退回 `comp-with-host-binding` 宿主繫結的值。
然而，如果 `dirWithHostBinding` 把它的繫結設定為 `null`，`width` 屬性就會被完全移除。


## 注入 attribute 值

在某些情況下，你需要根據在宿主元素上以 HTML attribute 設定的靜態值，來區分 [Component](api/core/Component) 或 [Directive](api/core/Directive) 的行為。例如，你可能有一個指令需要知道 `<button>` 或 `<input>` 元素的 `type`。

[Attribute](api/core/Attribute) 參數裝飾器非常適合透過[依賴注入](guide/dependency-injection)，將 HTML attribute 的值傳遞給元件／指令的建構函式。

<div class="alert is-helpful">

  注入的值擷取的是該時刻指定 HTML attribute 的值。
  日後對 attribute 值的更新，不會反映在注入的值中。

</div>

<code-example
  path="attribute-binding/src/app/my-input-with-attribute-decorator.component.ts"
  header="src/app/my-input-with-attribute-decorator.component.ts">
</code-example>

<code-example
  path="attribute-binding/src/app/app.component.html"
  region="attribute-decorator"
  header="src/app/app.component.html">
</code-example>

在前面的範例中，`app.component.html` 的結果是 **The type of the input is: number**。

另一個例子是 [RouterOutlet](api/router/RouterOutlet) 指令，它使用 [Attribute](api/core/Attribute) 裝飾器來取得每個出口上唯一的 [name](api/router/RouterOutlet#description)。

<div class="callout is-helpful">

  <header>@Attribute() vs @Input()</header>

  請記住，當你想追蹤 attribute 值並更新關聯屬性時，請使用 [@Input()](api/core/Input)；當你想將 HTML attribute 的值注入元件或指令的建構函式時，請使用 [@Attribute()](api/core/Attribute)。

</div>
