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

當運算式解析為 `null` 時，Angular 會完全移除該 attribute。

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

在下列範例中，我們將 `colspan` attribute 繫結到運算式 `1 + 1`。

<code-example path="attribute-binding/src/app/app.component.html" region="colspan" header="src/app/app.component.html"></code-example>

這個繫結會使 `<tr>` 跨越兩欄。

<div class="alert is-helpful">

有時候，屬性的名稱與 attribute 的名稱會有所不同。

`colspan` 是 `<tr>` 的 attribute，而 `colSpan`（S 大寫）是屬性。
使用 attribute 繫結時，請使用小寫 s 的 `colspan`。
關於如何繫結到 `colSpan` 屬性，更多資訊請參閱 [Property Binding](guide/property-binding) 的 [`colspan` and `colSpan`](guide/property-binding#colspan) 一節。

</div>

<hr/>

{@a class-binding}

## 繫結到 `class` attribute

使用類別繫結，可以從元素的 `class` attribute 中加入和移除 CSS 類別名稱。

### 繫結到單一 CSS `class`

要建立單一類別繫結，請使用前綴 `class`，後面接一個點，再接 CSS 類別的名稱&mdash;例如 `[class.sale]="onSale"`。
當繫結的運算式 `onSale` 為 truthy 時，Angular 會加入該類別；當運算式為 falsy 時，則會移除該類別&mdash;`undefined` 除外。
更多資訊請參閱[樣式委派](guide/style-precedence#styling-delegation)。

### 繫結到多個 CSS 類別

要繫結到多個類別，請將 `[class]` 設為一個運算式&mdash;例如 `[class]="classExpression"`。
運算式可以是以空格分隔的類別名稱字串，或以類別名稱為鍵、以真值或假值運算式為值的物件。
使用物件格式時，Angular 只會在相關聯的值為真值時才加入該類別。

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
    <td><code>{[key: string]: boolean | undefined | null}</code></td>
    <td><code>{foo: true, bar: false}</code></td>
  </tr>
  <tr>
    <td><code>Array</code><<code>string</code>></td>
    <td><code>['foo', 'bar']</code></td>
  </tr>
</table>

<hr/>

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

</div>

### 繫結到多個樣式

要切換多個樣式，請繫結到 `[style]` attribute&mdash;例如 `[style]="styleExpression"`。
運算式通常是樣式的字串清單，例如 `"width: 100px; height: 100px;"`。

你也可以將運算式格式化為物件，以樣式名稱為鍵、樣式值為值，例如 `{width: '100px', height: '100px'}`。

<div class="alert is-important">

對於任何類物件的運算式&mdash;例如 `object`、`Array`、`Map` 或 `Set`&mdash;物件的身分必須改變，Angular 才會更新類別清單。
只更新屬性而不改變物件身分是沒有效果的。

</div>

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
    <td rowspan=3>多樣式繫結</td>
    <td rowspan=3><code>[style]="styleExpression"</code></td>
    <td><code>string</code></td>
    <td><code>"width: 100px; height: 100px"</code></td>
  </tr>
  <tr>
    <td><code>{[key: string]: string | undefined | null}</code></td>
    <td><code>{width: '100px', height: '100px'}</code></td>
  </tr>
  <tr>
    <td><code>Array</code><<code>string</code>></td>
    <td><code>['width', '100px']</code></td>
  </tr>
</table>
