# 屬性繫結最佳實務

遵循幾個準則，你就能以有助於減少錯誤、保持程式碼可讀性的方式使用屬性繫結。

<div class="alert is-helpful">

請參閱 <live-example name="property-binding"></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 避免副作用

範本運算式的評估不應該有可見的副作用。
使用範本運算式的語法來協助避免副作用。
一般而言，正確的語法會阻止你在屬性繫結運算式中將值指派給任何東西。
該語法也會阻止你使用遞增與遞減運算子。

### 產生副作用的範例

如果你有一個運算式，變更了你所繫結的其他東西的值，那個值的變更就是副作用。
Angular 可能會、也可能不會顯示變更後的值。
如果 Angular 確實偵測到變更，它會擲出錯誤。

作為最佳實務，只使用會傳回值的屬性與方法。

## 傳回適當的型別

範本運算式應該產生目標屬性所期望的型別值。
例如，傳回：

* `string`，如果目標屬性期望字串
* `number`，如果它期望數字
* `object`，如果它期望物件。

### 傳入字串

在以下範例中，`ItemDetailComponent` 的 `childItem` 屬性期望一個字串。

<code-example header="src/app/app.component.html" path="property-binding/src/app/app.component.html" region="model-property-binding"></code-example>

查看 `ItemDetailComponent` 中 `@Input()` 型別為 `string` 之處，確認這個期望：

<code-example header="src/app/item-detail/item-detail.component.ts (setting the @Input() type)" path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type"></code-example>

`AppComponent` 中的 `parentItem` 是字串，這表示 `[childItem]="parentItem"` 中的運算式 `parentItem` 會評估為字串。

<code-example header="src/app/app.component.ts" path="property-binding/src/app/app.component.ts" region="parent-data-type"></code-example>

如果 `parentItem` 是其他型別，你也需要把 `childItem` 的 `@Input()` 指定為該型別。

### 傳入物件

在這個範例中，`ItemListComponent` 是 `AppComponent` 的子元件，而 `items` 屬性期望一個物件陣列。

<code-example header="src/app/app.component.html" path="property-binding/src/app/app.component.html" region="pass-object"></code-example>

在 `ItemListComponent` 中，`@Input()` `items` 的型別是 `Item[]`。

<code-example header="src/app/item-list.component.ts" path="property-binding/src/app/item-list/item-list.component.ts" region="item-input"></code-example>

請注意，`Item` 是一個物件，它有兩個屬性：`id` 與 `name`。

<code-example header="src/app/item.ts" path="property-binding/src/app/item.ts" region="item-class"></code-example>

在 `app.component.ts` 中，`currentItems` 是一個物件陣列，形狀與 `items.ts` 中的 `Item` 物件相同，帶有 `id` 與 `name`。

<code-example header="src/app.component.ts" path="property-binding/src/app/app.component.ts" region="pass-object"></code-example>

藉由提供相同形狀的物件，當 Angular 評估運算式 `currentItems` 時，你滿足了 `items` 的期望。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
