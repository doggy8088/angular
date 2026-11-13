# 屬性繫結

Angular 中的屬性繫結協助你設定 HTML 元素或指令的屬性值。
透過屬性繫結，你可以切換按鈕功能、以程式方式設定路徑，以及在元件之間共用值。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 先決條件

若要充分發揮屬性繫結的效益，你應該先熟悉下列內容：

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

若要繫結到元素的屬性，請將它包在方括號 `[]` 中，這會將該屬性標示為目標屬性。
目標屬性是你想要指派值的 DOM 屬性。
例如，下列程式碼中的目標屬性是圖片元素的 `src` 屬性。

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

在大多數情況下，目標名稱是屬性的名稱，即使它看起來像是 attribute 的名稱。
在這個範例中，`src` 是 `<img>` 元素屬性的名稱。

這些括號 `[]` 會讓 Angular 將指派的右側評估為動態運算式。
沒有括號時，Angular 會將右側視為字串字面值，並把屬性設為該靜態值。

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>

省略括號會算繪出字串 `parentItem`，而不是 `parentItem` 的值。

## 將元素屬性設為元件屬性值

若要將 `<img>` 元素的 `src` 屬性繫結到元件的屬性，請將目標 `src` 放在方括號中，後面接等號，再接屬性。
這裡的屬性是 `itemImageUrl`。

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

在類別中宣告 `itemImageUrl` 屬性，在這個案例中是 `AppComponent`。

<code-example path="property-binding/src/app/app.component.ts" region="item-image" header="src/app/app.component.ts"></code-example>

{@a colspan}

#### `colspan` 與 `colSpan`

常見的混淆點是 attribute `colspan` 與屬性 `colSpan` 之間。
請注意，這兩個名稱只差一個字母。

如果你這樣寫：

<code-example language="html">
  &lt;tr&gt;&lt;td colspan="{{1 + 1}}"&gt;Three-Four&lt;/td&gt;&lt;/tr&gt;
</code-example>

你會得到這個錯誤：

<code-example language="bash">
  Template parse errors:
  Can't bind to 'colspan' since it isn't a known native property
</code-example>

正如訊息所說，`<td>` 元素沒有 `colspan` 屬性。這是因為
`colspan` 是 attribute&mdash;`colSpan`（`S` 為大寫）才是
對應的屬性。文字插值與屬性繫結只能設定*屬性*，不能設定 attribute。

相反地，你會使用屬性繫結，像這樣寫：

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

另一個範例是在元件表示 `isUnchanged` 時停用按鈕：

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

另一個是設定指令的屬性：

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

再一個是設定自訂元件的 model 屬性&mdash;這是父元件與子元件溝通的好方法：

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

## 切換按鈕功能

若要依布林值停用按鈕的功能，請將 DOM `disabled` 屬性繫結到類別中值為 `true` 或 `false` 的屬性。

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

因為 `AppComponent` 中 `isUnchanged` 屬性的值是 `true`，Angular 會停用該按鈕。

<code-example path="property-binding/src/app/app.component.ts" region="boolean" header="src/app/app.component.ts"></code-example>

## 設定指令屬性

若要設定指令的屬性，請將指令放在方括號中，例如 `[ngClass]`，後面接等號，再接屬性。
這裡的屬性是 `classes`。

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

若要使用這個屬性，你必須在類別中宣告它，在這個範例中是 `AppComponent`。
`classes` 的值是 `special`。

<code-example path="property-binding/src/app/app.component.ts" region="directive-property" header="src/app/app.component.ts"></code-example>

Angular 會將 `special` 類別套用到 `<p>` 元素，讓你可以使用 `special` 套用 CSS 樣式。

## 在元件之間繫結值

若要設定自訂元件的 model 屬性，請將目標（這裡是 `childItem`）放在方括號 `[]` 之間，後面接等號，再接屬性。
這裡的屬性是 `parentItem`。

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

若要使用目標與屬性，你必須在各自的類別中宣告它們。

在它的元件類別中宣告 `childItem` 目標，在這個案例中是 `ItemDetailComponent`。

例如，下列程式碼在它的元件類別中宣告 `childItem` 目標，在這個案例中是 `ItemDetailComponent`。

接著，程式碼包含帶有 `childItem` 屬性的 `@Input()` 裝飾器，讓資料可以流入。

<code-example path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type" header="src/app/item-detail/item-detail.component.ts"></code-example>

接著，程式碼在它的元件類別中宣告 `parentItem` 屬性，在這個案例中是 `AppComponent`。
在這個範例中，`childItem` 的型別是 `string`，所以 `parentItem` 必須是字串。
這裡，`parentItem` 的字串值是 `lamp`。

<code-example path="property-binding/src/app/app.component.ts" region="parent-data-type" header="src/app/app.component.ts"></code-example>

透過這個設定，`<app-item-detail>` 的檢視會將 `lamp` 的值用於 `childItem`。

## 屬性繫結與安全性

屬性繫結有助於保持內容安全。
例如，請看下列惡意內容。

<code-example path="property-binding/src/app/app.component.ts" region="malicious-content" header="src/app/app.component.ts"></code-example>

元件範本以下列方式對內容進行文字插值：

<code-example path="property-binding/src/app/app.component.html" region="malicious-interpolated" header="src/app/app.component.html"></code-example>

瀏覽器不會處理這段 HTML，而是如下直接顯示原始內容。

<code-example language="bash">
"Template &lt;script&gt;alert("evil never sleeps")&lt;/script&gt; Syntax" is the interpolated evil title.
</code-example>

Angular 不允許含有 `<script>` 標籤的 HTML，無論是透過[文字插值](guide/interpolation)還是屬性繫結，藉此防止 JavaScript 執行。

然而，在下列範例中，Angular 會在顯示值之前先加以[清理](guide/security#sanitization-and-security-contexts)。

<code-example path="property-binding/src/app/app.component.html" region="malicious-content" header="src/app/app.component.html"></code-example>

文字插值處理 `<script>` 標籤的方式與屬性繫結不同，但兩種方式算繪出的內容都是無害的。
以下是清理後 `evilTitle` 範例的瀏覽器輸出。

<code-example language="bash">
"Template Syntax" is the property bound evil title.
</code-example>

## 屬性繫結與文字插值

[文字插值](guide/interpolation)與屬性繫結通常可以達到相同的結果。
下列繫結配對做的事相同。

<code-example path="property-binding/src/app/app.component.html" region="property-binding-interpolation" header="src/app/app.component.html"></code-example>

將資料值算繪為字串時，你可以使用任一種形式，不過文字插值的可讀性較佳。
不過，當要將元素屬性設定為非字串的資料值時，你必須使用屬性繫結。

## 後續步驟

* [屬性繫結最佳實務](guide/property-binding-best-practices)
