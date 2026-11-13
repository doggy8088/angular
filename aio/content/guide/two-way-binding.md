# 雙向繫結 `[(...)]`

雙向繫結讓你的應用程式能在元件類別與其範本之間共用資料。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實作範例。

</div>

## 雙向繫結的基礎

雙向繫結做兩件事：

1. 設定特定的元素屬性。
1. 監聽元素變更事件。

Angular 為此提供了一個特殊的 _雙向資料繫結_ 語法 `[()]`。
`[()]` 語法結合了屬性繫結的括號
`[]` 與事件繫結的括號 `()`。

<div class="callout is-important">

<header>
  [( )] = banana in a box
</header>

想像 *banana in a box*（盒子裡的香蕉）這個畫面，記住括號要放在方括號 _裡面_。

</div>

當元素有一個可設定的
屬性 `x`，以及一個對應的事件 `xChange` 時，`[()]` 語法就很容易示範。
以下是一個符合這個模式的 `SizerComponent`。
它有一個 `size` 值屬性與一個相伴的 `sizeChange` 事件：

<code-example path="two-way-binding/src/app/sizer/sizer.component.ts" header="src/app/sizer.component.ts"></code-example>

<code-example path="two-way-binding/src/app/sizer/sizer.component.html" header="src/app/sizer.component.html"></code-example>

初始的 `size` 是來自屬性繫結的輸入值。
點選按鈕會增大或減小 `size`，在
最小/最大值限制內，
然後以調整後的大小引發（即發出）`sizeChange` 事件。

以下範例中，`AppComponent.fontSizePx` 與 `SizerComponent` 進行雙向繫結：

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-1)" region="two-way-1"></code-example>

`AppComponent.fontSizePx` 建立了 `SizerComponent.size` 的初始值。

<code-example path="two-way-binding/src/app/app.component.ts" header="src/app/app.component.ts" region="font-size"></code-example>

點選按鈕會透過雙向繫結更新 `AppComponent.fontSizePx`。
更新後的 `AppComponent.fontSizePx` 值會流向 _樣式_ 繫結，
讓顯示的文字變大或變小。

雙向繫結語法其實只是 _屬性_ 繫結與 _事件_ 繫結的語法糖。
Angular 將 `SizerComponent` 繫結去糖化後如下：

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-2)" region="two-way-2"></code-example>

`$event` 變數包含 `SizerComponent.sizeChange` 事件的資料。
當使用者點選按鈕時，Angular 會把 `$event` 值指派給 `AppComponent.fontSizePx`。

## 表單中的雙向繫結

相較於分開的屬性繫結與事件繫結，雙向繫結語法
方便得多。對 HTML 表單元素（例如 `<input>` 與
`<select>`）使用雙向繫結也會很方便。然而，沒有原生 HTML 元素遵循 `x`
值與 `xChange` 事件模式。

更多關於如何在表單中使用雙向繫結的資訊，請參閱
Angular [NgModel](guide/built-in-directives#ngModel)。
