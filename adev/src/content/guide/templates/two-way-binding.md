# 雙向繫結

雙向繫結讓應用程式中的元件能共用資料。
使用雙向繫結，可以在父元件與子元件之間同時監聽事件並更新值。

雙向繫結結合了[屬性繫結](guide/templates/property-binding)與事件繫結：

| 繫結                                               | 詳細資訊                     |
|:---                                                |:---                          |
| [屬性繫結](guide/templates/property-binding)       | 設定特定的元素屬性。         |
| [事件繫結](guide/templates/event-binding)          | 監聽元素變更事件。           |

## 加入雙向資料繫結 {#adding-two-way-data-binding}

Angular 的雙向繫結語法是方括號與括號的組合 `[()]`。
`[()]` 語法結合了屬性繫結的括號 `[]` 與事件繫結的括號 `()`，如下所示。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-syntax"/>

## 雙向繫結如何運作 {#how-two-way-binding-works}

雙向資料繫結要能運作，`@Output()` 屬性必須使用 `inputChange` 模式，其中 `input` 是 `@Input()` 屬性的名稱。
例如，如果 `@Input()` 屬性是 `size`，`@Output()` 屬性就必須是 `sizeChange`。

以下 `sizerComponent` 有一個 `size` 值屬性與一個 `sizeChange` 事件。
`size` 屬性是一個 `@Input()`，所以資料可以流入 `sizerComponent`。
`sizeChange` 事件是一個 `@Output()`，讓資料可以從 `sizerComponent` 流出到父元件。

接著，有兩個方法：`dec()` 用來減小字型大小，`inc()` 用來增大字型大小。
這兩個方法使用 `resize()`，在最小/最大值限制內變更 `size` 屬性的值，並發出一個傳達新 `size` 值的事件。

<docs-code header="src/app/sizer.component.ts" path="adev/src/content/examples/two-way-binding/src/app/sizer/sizer.component.ts" visibleRegion="sizer-component"/>

`sizerComponent` 範本有兩個按鈕，每個按鈕都將 click 事件繫結到 `inc()` 與 `dec()` 方法。
當使用者點選其中一個按鈕時，`sizerComponent` 會呼叫對應的方法。
`inc()` 與 `dec()` 兩個方法都以 `+1` 或 `-1` 呼叫 `resize()` 方法，進而以新的大小值引發 `sizeChange` 事件。

<docs-code header="src/app/sizer.component.html" path="adev/src/content/examples/two-way-binding/src/app/sizer/sizer.component.html"/>

在 `AppComponent` 範本中，`fontSizePx` 與 `SizerComponent` 進行雙向繫結。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-1"/>

在 `AppComponent` 中，`fontSizePx` 將值設為 `16`，建立了 `SizerComponent.size` 的初始值。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/two-way-binding/src/app/app.component.ts" visibleRegion="font-size"/>

點選按鈕會更新 `AppComponent.fontSizePx`。
更新後的 `AppComponent.fontSizePx` 值會更新樣式繫結，讓顯示的文字變大或變小。

雙向繫結語法是屬性繫結與事件繫結組合的簡寫。
將 `SizerComponent` 繫結拆成個別的屬性繫結與事件繫結，如下所示。

<docs-code header="src/app/app.component.html (expanded)" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-2"/>

`$event` 變數包含 `SizerComponent.sizeChange` 事件的資料。
當使用者點選按鈕時，Angular 會把 `$event` 值指派給 `AppComponent.fontSizePx`。

<docs-callout title="表單中的雙向繫結">

因為沒有內建 HTML 元素遵循 `x` 值與 `xChange` 事件模式，含有表單元素的雙向繫結需要 `NgModel`。
更多關於如何在表單中使用雙向繫結的資訊，請參閱 Angular [NgModel](guide/directives#displaying-and-updating-properties-with-ngmodel)。

</docs-callout>
