# attribute 繫結

Angular 的 attribute 繫結能協助你直接為 attribute 設定值。 透過 attribute 繫結，你可以改善無障礙體驗、動態地為應用程式設定樣式，並同時管理多個 CSS 類別或樣式。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 先決條件

* [屬性繫結](guide/property-binding)

## 語法

attribute 繫結的語法與[屬性繫結](guide/property-binding)相似，但你不是把元素屬性放在中括號之間，而是在 attribute 名稱前加上前綴 `attr`，後面再接一個點。 然後，你用一個解析為字串的運算式設定 attribute 的值。

<code-example format="html" language="html">

&lt;p [attr.attribute-you-are-targeting]="expression"&gt;&lt;/p&gt;

</code-example>

<div class="alert is-helpful">

當運算式解析為 `null` 或 `undefined` 時，Angular 會完全移除該 attribute。

</div>

## 繫結 ARIA attribute

attribute 繫結的主要使用案例之一，就是設定 ARIA attribute。

要繫結到 ARIA attribute，請輸入下列內容：

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria"></code-example>

<a id="colspan"></a>

## 繫結到 `colspan`

attribute 繫結另一個常見的使用案例，是表格中的 `colspan` attribute。繫結到 `colspan` attribute，能讓你的表格以程式方式保持動態。視應用程式填入表格的資料量而定，一列所跨越的欄數可能會改變。

要對 `<td>` 的 attribute `colspan` 使用 attribute 繫結
1. 使用下列語法指定 `colspan` attribute：`[attr.colspan]`。
1. 將 `[attr.colspan]` 設為等於一個運算式。

在下列範例中，你將 `colspan` attribute 繫結到運算式 `1 + 1`。

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="colspan"></code-example>

這個繫結會使 `<tr>` 跨越兩欄。

<div class="alert is-helpful">

有時候，屬性的名稱與 attribute 的名稱會有所不同。

`colspan` 是 `<td>` 的 attribute，而 `colSpan`（S 大寫）是屬性。 使用 attribute 繫結時，請使用小寫 s 的 `colspan`。

關於如何繫結到 `colSpan` 屬性，請參閱 [Property Binding](guide/property-binding) 的 [`colspan` and `colSpan`](guide/property-binding#colspan) 一節。

</div>

## 下一步

* [類別與樣式繫結](guide/class-binding)

@reviewed 2022-05-02
