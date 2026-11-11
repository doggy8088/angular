# 屬性繫結

Angular 中的屬性繫結協助你設定 HTML 元素或指令的屬性值。使用屬性繫結，可以切換按鈕功能、以程式方式設定路徑，以及在元件之間共用值。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 先決條件

* [元件基礎](guide/architecture-components)
* [範本基礎](guide/glossary#範本（template）)
* [繫結語法](guide/binding-syntax)

## 了解資料流

屬性繫結以單一方向移動值，從元件的屬性進入目標元素屬性。

<div class="alert is-helpful">

如需進一步了解監聽事件，請參閱[事件繫結](guide/event-binding)。

</div>

若要讀取目標元素屬性或呼叫它的方法，請參閱 [ViewChild](api/core/ViewChild) 與 [ContentChild](api/core/ContentChild) 的 API 參考。

## 繫結到屬性

若要繫結到元素的屬性，請用方括號 `[]` 將它括起來，這會將該屬性標示為目標屬性。

目標屬性是你想要指派值的 DOM 屬性。

若要將值指派給圖片元素 `src` 屬性的目標屬性，請輸入以下程式碼：

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

在大多數情況下，目標名稱是屬性的名稱，即使它看起來像是 attribute 的名稱。

在這個範例中，`src` 是 `<img>` 元素屬性的名稱。

<!-- vale Angular.Google_WordListSuggestions = NO -->

括號 `[]` 會讓 Angular 將指派的右側評估為動態運算式。

<!-- vale Angular.Google_WordListSuggestions = NO -->

沒有括號時，Angular 會將右側視為字串字面值，並把屬性設為該靜態值。

若要將字串指派給屬性，請輸入以下程式碼：

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>

省略括號會算繪出字串 `parentItem`，而不是 `parentItem` 的值。

## 將元素屬性設為元件屬性值

若要將 `<img>` 元素的 `src` 屬性繫結到元件的屬性，請將 `src` 放在方括號中，後面接等號，再接屬性。

使用 `itemImageUrl` 屬性，輸入以下程式碼：

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

在類別中宣告 `itemImageUrl` 屬性，在這個案例中是 `AppComponent`。

<code-example path="property-binding/src/app/app.component.ts" region="item-image" header="src/app/app.component.ts"></code-example>

{@a colspan}

#### `colspan` 與 `colSpan`

常見的混淆點是 attribute `colspan` 與屬性 `colSpan` 之間。請注意，這兩個名稱只差一個字母。

若要使用 `colSpan` 進行屬性繫結，請輸入以下內容：

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

若要在元件的 `isUnchanged` 屬性為 `true` 時停用按鈕，請輸入以下內容：

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

若要設定指令的屬性，請輸入以下內容：

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

若要設定自訂元件的 model 屬性，讓父元件與子元件彼此溝通，請輸入以下內容：

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

## 切換按鈕功能

<!-- vale Angular.Google_WordListSuggestions = NO -->

若要使用布林值停用按鈕的功能，請將 `disabled` DOM attribute 繫結到類別中的布林屬性。

<!-- vale Angular.Google_WordListSuggestions = YES -->

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

因為 `AppComponent` 中 `isUnchanged` 屬性的值是 `true`，Angular 會停用該按鈕。

<code-example path="property-binding/src/app/app.component.ts" region="boolean" header="src/app/app.component.ts"></code-example>

## 後續步驟

* [屬性繫結最佳實務](guide/property-binding-best-practices)
* [事件繫結](guide/event-binding)
* [文字插值](guide/interpolation)
* [類別與樣式繫結](guide/class-binding)
* [attribute 繫結](guide/attribute-binding)

@reviewed 2022-04-14
