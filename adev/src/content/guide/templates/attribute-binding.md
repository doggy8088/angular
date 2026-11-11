# attribute 繫結 {#attribute-binding}

Angular 的 attribute 繫結能協助你直接為 attribute 設定值。
透過 attribute 繫結，你可以改善無障礙體驗、動態地為應用程式設定樣式，並同時管理多個 CSS 類別或樣式。

## 語法 {#syntax}

attribute 繫結的語法與[屬性繫結](guide/templates/property-binding)相似，但你不是把元素屬性放在中括號之間，而是在 attribute 名稱前加上前綴 `attr`，後面再接一個點。
然後，你用一個解析為字串的運算式設定 attribute 的值。

<docs-code language="html">

<p [attr.attribute-you-are-targeting]="expression"></p>

</docs-code>

HELPFUL: 當運算式解析為 `null` 或 `undefined` 時，Angular 會將該 attribute 完全移除。

## 繫結 ARIA attribute {#binding-aria-attributes}

attribute 繫結的主要使用案例之一，就是設定 ARIA attribute。

要繫結到 ARIA attribute，請輸入下列內容：

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="attrib-binding-aria"/>

## 繫結到 `colspan` {#binding-to-colspan}

attribute 繫結另一個常見的使用案例，是表格中的 `colspan` attribute。繫結到 `colspan` attribute，能讓你的表格以程式方式保持動態。視應用程式填入表格的資料量而定，一列所跨越的欄數可能會改變。

要對 `<td>` 的 attribute `colspan` 使用 attribute 繫結

1. 使用下列語法指定 `colspan` attribute：`[attr.colspan]`。
1. 將 `[attr.colspan]` 設為等於一個運算式。

在下列範例中，你將 `colspan` attribute 繫結到運算式 `1 + 1`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="colspan"/>

這個繫結會使 `<tr>` 跨越兩欄。

HELPFUL: 有時候，屬性的名稱與 attribute 的名稱會有所不同。

`colspan` 是 `<td>` 的 attribute，而 `colSpan`（S 大寫）是屬性。
使用 attribute 繫結時，請使用小寫 s 的 `colspan`。

如需如何繫結到 `colSpan` 屬性的更多資訊，請參閱[屬性繫結](guide/templates/property-binding)中的 [`colspan` 與 `colSpan`](guide/templates/property-binding#colspan-and-colspan) 章節。

## 下一步 {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/templates/class-binding" title="類別與樣式繫結"/>
</docs-pill-row>
