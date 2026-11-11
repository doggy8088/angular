# 範本陳述式

範本陳述式是可以在 HTML 中使用的方法或屬性，用來回應使用者事件。
透過範本陳述式，你的應用程式可以藉由顯示動態內容或提交表單等動作與使用者互動。

在以下範例中，範本陳述式 `deleteHero()` 出現在等號 `=` 字元右側的引號中，如 `(event)="statement"`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-component-statement"/>

當使用者點選 **Delete hero** 按鈕時，Angular 會呼叫元件類別中的 `deleteHero()` 方法。

搭配元素、元件或指令使用範本陳述式，來回應事件。

HELPFUL: 回應事件是 Angular 單向資料流的一個面向。
在單一事件迴圈期間，你可以變更應用程式中的任何東西。

## 語法 {#syntax}

和[範本運算式](guide/templates/interpolation)一樣，範本陳述式使用的語言看起來像 JavaScript。
不過，範本陳述式的剖析器與範本運算式的剖析器不同。
此外，範本陳述式剖析器特別支援基本指派 \(`=`\)，以及以分號 \(`;`\) 串連運算式。

以下 JavaScript 與範本運算式語法是不允許的：

* `new`
* 遞增與遞減運算子，`++` 與 `--`
* 運算子指派，例如 `+=` 與 `-=`
* 位元運算子，例如 `|` 與 `&`
* [管道運算子](guide/pipes)

## 陳述式上下文 {#statement-context}

陳述式有一個上下文——應用程式中該陳述式所屬的特定部分。

陳述式只能參照陳述式上下文中的東西，那通常是元件實例。
例如，以下程式碼片段中 `(click)="deleteHero()"` 的 `deleteHero()` 是元件的一個方法。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-component-statement"/>

陳述式上下文也可以參照範本自身上下文的屬性。
在以下範例中，元件的事件處理方法 `onSave()` 接受範本自身的 `$event` 物件作為引數。
在接下來的兩行中，`deleteHero()` 方法接受一個[範本輸入變數](guide/directives/structural-directives#shorthand) `hero`，而 `onSubmit()` 接受一個[範本參照變數](guide/templates/reference-variables) `#heroForm`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-var-statement"/>

在這個範例中，`$event` 物件、`hero` 與 `#heroForm` 的上下文是範本。

範本上下文名稱的優先順序高於元件上下文名稱。
在前面的 `deleteHero(hero)` 中，`hero` 是範本輸入變數，而不是元件的 `hero` 屬性。

## 陳述式最佳實務 {#statement-best-practices}

| 實務               | 詳細資訊 |
|:---                |:---      |
| 簡潔               | 使用方法呼叫或基本屬性指派，讓範本陳述式保持最精簡。 |
| 在上下文內運作     | 範本陳述式的上下文可以是元件類別實例或範本。因此，範本陳述式無法參照全域命名空間中的任何東西，例如 `window` 或 `document`。例如，範本陳述式不能呼叫 `console.log()` 或 `Math.max()`。 |
