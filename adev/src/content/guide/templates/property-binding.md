# 屬性繫結

在 Angular 中，屬性繫結可讓您設定 HTML 元素或指令的屬性值。使用屬性繫結可執行諸如切換按鈕功能、以程式方式設定路徑，以及在元件之間共用值等作業。

## 了解資料流向

屬性綁定將值單向傳遞，從元件的屬性傳入目標元素的屬性。

若要讀取目標元素的屬性或呼叫其中一個方法，請參閱 [ViewChild](api/core/ViewChild) 和 [ContentChild](api/core/ContentChild) 的 API 參考。

## 繫結到屬性

HELPFUL: 有關聆聽事件的資訊，請參閱 [事件繫結](guide/templates/event-binding)。

若要繫結至元素的屬性，請將其括在方括號中 `[]`，這會將該屬性識別為目標屬性。

目標屬性是您要指定值的 DOM 屬性。

要將字串指定給元件的屬性（例如 `ItemDetailComponent` 的 `childItem`），請使用相同的方括號指派符號：

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="property-binding" header="src/app/app.component.html"/>

在多數情況下，目標名稱是屬性的名稱，即使它似乎是特徵的名稱。

在此範例中，`src` 是 `<img>` 元素屬性的名稱。

<!-- vale Angular.Google_WordListSuggestions = NO -->

方括號 `[]` 使 Angular 將賦值的右側視為動態表達式來評估。

<!-- vale Angular.Google_WordListSuggestions = NO -->

沒有括號時，Angular 將右邊視為字串文字，並將屬性設定為該靜態值。

要將字串指定給屬性，請輸入下列程式碼：

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="no-evaluation" header="src/app.component.html"/>

省略括號會呈現字串 `parentItem`，而不是 `parentItem` 的值。

## 將元素屬性設定為元件屬性值

若要將 `<img>` 元素的 `src` 屬性繫結到元件的屬性，請將 `src` 置於方括號中，後接等號與屬性。

使用屬性 `itemImageUrl`，鍵入以下程式碼：

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="property-binding" header="src/app/app.component.html"/>

在類別中宣告 `itemImageUrl` 屬性，在本例中為 `AppComponent`。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="item-image" header="src/app/app.component.ts"/>

### `colspan` 和 `colSpan`

一個常見的混淆點是屬性 `colspan` 與 `colSpan` 屬性之間的差異。請注意，這兩個名稱只差一個字母。

若要使用 `colSpan` 屬性繫結，請輸入以下內容：

<docs-code path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="colSpan" header="src/app/app.component.html"/>

若要停用按鈕，而元件的 `isUnchanged` 屬性為 `true`，請鍵入下列內容：

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="disabled-button" header="src/app/app.component.html"/>

若要設定指令的屬性，請輸入下列內容：

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="class-binding" header="src/app/app.component.html"/>

若要設定自訂元件的模型屬性，以使父級元件和子級元件能夠彼此通訊，請輸入下列內容：

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="model-property-binding" header="src/app/app.component.html"/>

## 切換按鈕功能

<!-- vale Angular.Google_WordListSuggestions = NO -->

若要使用布林值來停用按鈕的功能，請將 `disabled` DOM 屬性繫結至類別中的布林值屬性。

<!-- vale Angular.Google_WordListSuggestions = YES -->

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="disabled-button" header="src/app/app.component.html"/>

由於 `AppComponent` 中 `isUnchanged` 屬性的值為 `true`，Angular 便會停用按鈕。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="boolean" header="src/app/app.component.ts"/>

## 接下來

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding-best-practices" title="屬性綁定的最佳實務"/>
  <docs-pill href="guide/templates/event-binding" title="事件綁定"/>
  <docs-pill href="guide/templates/interpolation" title="文字插值"/>
  <docs-pill href="guide/templates/class-binding" title="類別和樣式綁定"/>
  <docs-pill href="guide/templates/attribute-binding" title="屬性綁定"/>
</docs-pill-row>
