# 屬性綁定

在 Angular 中，屬性繫結可幫助您直接設定屬性的值。
使用屬性繫結，您可以改善輔助功能、動態調整應用程式的樣式，並同時管理多個 CSS 類別或樣式。

## 語法

屬性繫結語法類似 [屬性繫結](guide/templates/property-binding)，但不是括號中的元素屬性，您在屬性的名稱前面加上前置詞 `attr`，後接一個句點。
然後，您使用解析為字串的表達式設定屬性值。

<docs-code language="html">

&lt;p [attr.attribute-you-are-targeting]="expression"&gt;&lt;/p&gt;

</docs-code>

HELPFUL: 當表達式解析為 `null` 或 `undefined` 時，Angular 會完全移除該屬性。

## 繫結 ARIA 屬性

屬性繫結的主要使用案例之一是設定 ARIA 屬性。

若要繫結至 ARIA 屬性，請輸入下列內容：

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="attrib-binding-aria"/>

## 繫結到 `colspan`

屬性繫結的另一個常見使用案例是表格中的 `colspan` 屬性。繫結到 `colspan` 屬性可幫助您保持表格的動態編程。根據應用程式用來填入表格的資料量，列跨越的欄數可能會改變。

若要將屬性繫結用於 `<td>` 屬性 `colspan`

1. 使用以下語法指定 `colspan` 屬性：`[attr.colspan]`。
1. 將 `[attr.colspan]` 設為等於一個表達式。

在以下範例中，您將 `colspan` 屬性繫結至表達式 `1 + 1`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="colspan"/>

此綁定會使 `<tr>` 跨越兩列。

HELPFUL: 有時候，屬性名稱和特徵之間存在差異。

`colspan` 是 `<td>` 的屬性，而 `colSpan` 大寫「S」則為屬性。
當使用屬性繫結時，請使用小寫「s」的 `colspan`。

有關如何繫結到 `colSpan` 屬性的更多資訊，請參閱 [屬性繫結](guide/templates/property-binding) 的 [`colspan` 和 `colSpan`](guide/templates/property-binding#colspan-and-colspan) 部分。

## 接下來

<docs-pill-row>
  <docs-pill href="guide/templates/class-binding" title="類別和樣式繫結"/>
</docs-pill-row>
