# 屬性繫結最佳實務

遵循一些準則，您可以使用屬性繫結以減少錯誤並保持程式碼可讀。

## 避免副作用

評估範本表達式不應該有可見的副作用。
使用範本表達式的語法來幫助避免副作用。
一般來說，正確的語法會阻止您在屬性繫結表達式中指派值給任何內容。
語法也會阻止您使用增量和遞減運算子。

### 產生副作用的一個範例

如果你有一個運算式，它改變了你正在繫結的另一個東西的值，那個值的改變將是一個副作用。
Angular 可能會或可能不會顯示已變更的值。
如果 Angular 確實偵測到變更，它會擲出錯誤。

作為最佳實務，僅使用會傳回值的屬性和方法。

## 回傳適當的型別

範本運算式應產生目標屬性預期的值類型。
例如，傳回：

* 一個 `字串`，如果目標屬性預期為字串
* 一個 `數字`，如果它預期為數字
* 一個 `物件`，如果它預期為物件。

### 傳入字串

在以下範例中，`ItemDetailComponent` 的 `childItem` 屬性預期會是字串。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="model-property-binding"/>

透過查看 `ItemDetailComponent` 中 `@Input()` 型別為 `string` 來確認此預期：

<docs-code header="src/app/item-detail.component.ts (setting the @Input() type)" path="adev/src/content/examples/property-binding/src/app/item-detail.component.ts" visibleRegion="input-type"/>

`AppComponent` 中的 `parentItem` 是字串，這表示表達式 `[childItem]="parentItem"` 中的 `parentItem` 會評估為字串。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="parent-data-type"/>

如果 `parentItem` 是其他類型，則需要將 `childItem`  `@Input()` 也指定為該類型。

### 傳入物件

在此範例中，`ItemListComponent` 是 `AppComponent` 的子元件，而 `items` 屬性預期會傳入一個物件陣列。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="pass-object"/>

在 `ItemListComponent` 中，`@Input()`, `items` 的類型為 `Item[]`。

<docs-code header="src/app/item-list.component.ts" path="adev/src/content/examples/property-binding/src/app/item-list.component.ts" visibleRegion="item-input"/>

請注意，`Item` 是物件，它有兩個屬性，`id` 和 `name`。

<docs-code header="src/app/item.ts" path="adev/src/content/examples/property-binding/src/app/item.ts" visibleRegion="item-class"/>

在 `app.component.ts` 中，`currentItems` 是個物件陣列，其形狀與 `items.ts` 中的 `Item` 物件相同，具有 `id` 和 `name`。

<docs-code header="src/app.component.ts" path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="pass-object"/>

透過在相同形狀中提供物件，當 Angular 評估表達式 `currentItems` 時，您可以滿足 `items` 的預期。
