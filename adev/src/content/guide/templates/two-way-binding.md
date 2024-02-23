# 雙向繫結

雙向繫結為應用程式中的元件提供一種共享數據的方式。
使用雙向繫結來偵聽事件，並在父元件和子元件之間同時更新值。

雙向繫結結合了 [屬性繫結](guide/templates/property-binding) 與事件繫結：

| 綁定                                   | 詳細資料 |
|:---                                        |:---     |
| [屬性綁定](guide/templates/property-binding) | 設定特定元素屬性。    |
| [事件綁定](guide/templates/event-binding)       | 監聽元素變更事件。 |

## 新增雙向資料繫結

Angular 的雙向繫結語法是方括號和圓括號的組合，`[()]`。
`[()]` 語法結合屬性繫結的方括號，`[]`，與事件繫結的圓括號，`()`，如下所示：

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-syntax"/>

## 雙向繫結是如何運作的

要讓雙向資料繫結運作，`@Output()` 屬性必須使用模式，`inputChange`，其中 `input` 是 `@Input()` 屬性的名稱。
舉例來說，如果 `@Input()` 屬性是 `size`，`@Output()` 屬性必須是 `sizeChange`。

以下 `sizerComponent` 具有 `size` 值屬性和 `sizeChange` 事件。
`size` 屬性是 `@Input()`，因此資料可以流入 `sizerComponent`。
`sizeChange` 事件是 `@Output()`，它讓資料從 `sizerComponent` 流出到父元件。

接下來，有兩種方法，`dec()` 用於減小字體大小，`inc()` 用於增大字體大小。
這兩種方法使用 `resize()` 來更改 `size` 屬性的值，但須在最小/最大值約束內，並發出傳達新 `size` 值的事件。

<docs-code header="src/app/sizer.component.ts" path="adev/src/content/examples/two-way-binding/src/app/sizer/sizer.component.ts" visibleRegion="sizer-component"/>

`sizerComponent` 範本有兩個按鈕，每個按鈕都會將 click 事件繫結到 `inc()` 和 `dec()` 方法。
當使用者點擊其中一個按鈕時，`sizerComponent` 會呼叫對應的方法。
`inc()` 和 `dec()` 這兩個方法都會呼叫 `resize()` 方法，並傳入 `+1` 或 `-1`，這將會觸發 `sizeChange` 事件，並傳入新的尺寸值。

<docs-code header="src/app/sizer.component.html" path="adev/src/content/examples/two-way-binding/src/app/sizer/sizer.component.html"/>

在 `AppComponent` 範本中，`fontSizePx` 與 `SizerComponent` 雙向繫結。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-1"/>

在 `AppComponent` 中，`fontSizePx` 透過將值設定為 `16` 來建立初始的 `SizerComponent.size` 值。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/two-way-binding/src/app/app.component.ts" visibleRegion="font-size"/>

點擊按鈕會更新 `AppComponent.fontSizePx`。
經過修正的 `AppComponent.fontSizePx` 值會更新樣式繫結，這會讓顯示的文字變大或變小。

雙向繫結語法是屬性繫結和事件繫結組合的簡寫。
`SizerComponent` 繫結作為單獨的屬性繫結和事件繫結如下。

<docs-code header="src/app/app.component.html (expanded)" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-2"/>

`$event` 變數包含 `SizerComponent.sizeChange` 事件的資料。
當使用者按下按鈕時，Angular 會將 `$event` 值指派給 `AppComponent.fontSizePx`。

<docs-callout title="表單中的雙向繫結">

由於沒有內建的 HTML 元素遵循 `x` 值和 `xChange` 事件模式，因此表單元素的雙向繫結需要 `NgModel`。
如需有關如何使用表單中的雙向繫結的詳細資訊，請參閱 Angular [NgModel](guide/directives#ngModel)。

</docs-callout>

