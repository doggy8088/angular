# 範本語句

模板語句是您可以在 HTML 中用來回應使用者事件的方法或屬性。
透過模板語句，您的應用程式可以透過顯示動態內容或提交表單等動作來吸引使用者。

在以下範例中，範本陳述式 `deleteHero()` 出現在等號 `=` 字元右側的引號中，如同 `(event)="statement"`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-component-statement"/>

當用戶點擊 **刪除英雄** 按鈕時，Angular 會在元件類別中呼叫 `deleteHero()` 方法。

使用範本陳述句搭配元素、元件或指令，以回應事件。

HELPFUL：回應事件是 Angular 單向資料流的一個面向。
您可以在單一事件迴圈期間變更應用程式中的任何內容。

## 語法

類似於 [範本運算式](guide/templates/interpolation)，範本語句使用類似於 JavaScript 的語言。
然而，範本語句的解析器與範本運算式的解析器不同。
此外，範本語句解析器特別支援基本指定 \(`=`\) 和以分號 \(`;`\) 串連的運算式。

以下 JavaScript 和範本表達式語法不允許：

* `new`
* 增量和減量運算子，`++` 和 `--`
* 運算子賦值，例如 `+=` 和 `-=`
* 位元運算子，例如 `|` 和 `&`
* [管道運算子](guide/pipes)

## 聲明內容

陳述有一個內容 &mdash;應用程序的特定部分，陳述屬於該部分。

陳述句只能參照陳述句上下文中包含的內容，通常是組件實例。
例如，下一個片段中的 `(click)="deleteHero()"` 的 `deleteHero()` 是該組件的方法。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-component-statement"/>

語句內容文字也可能參考範本本身內容文字的屬性。
在以下範例中，元件的事件處理方法 `onSave()` 將範本本身的 `$event` 物件作為參數。
在接下來的兩行中，`deleteHero()` 方法採用 [範本輸入變數](guide/directives/structural-directives#shorthand) `hero`，而 `onSubmit()` 則採用 [範本參考變數](guide/templates/reference-variables) `#heroForm`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-var-statement"/>

在這個範例中，`$event` 物件、`hero` 和 `#heroForm` 的內容是範本。

範本內容的變數名稱優先於元件內容的變數名稱。
在前面的 `deleteHero(hero)` 中，`hero` 是範本輸入變數，而非元件的 `hero` 屬性。

## 聲明最佳實務

## Statement best practices

1. **Be clear and concise.** Your statement should be easy to understand and should not be overly technical.
2. **Be specific.** Your statement should clearly state what you are committing to and how you will measure your progress.
3. **Be realistic.** Your statement should be achievable within the resources and time you have available.
4. **Be measurable.** You should be able to track your progress and measure the impact of your statement.
5. **Be time-bound.** Your statement should have a specific timeframe for completion.
6. **Be relevant.** Your statement should be relevant to your audience and should address a need or issue that they care about.
7. **Be engaging.** Your statement should be engaging and should capture the attention of your audience.
8. **Be authentic.** Your statement should be true to your values and should reflect your genuine commitment to making a difference.
9. **Be actionable.** Your statement should be actionable and should provide specific steps that you will take to achieve your goals.
10. **Be visible.** Your statement should be visible to your audience and should be easy for them to find.

| 實務                                     | 詳細資料 |
|:---                                     |:---     |
| 簡潔                                      | 使用方法呼叫或基本屬性指定來使範本陳述式保持在最小值。                                                                                                                                                                                                         |
| 在上下文中工作                                | 範本陳述式的上下文可以是元件類別實例或範本。因此，範本陳述式無法參照全域命名空間中的任何內容，例如 `window` 或 `document`。例如，範本陳述式無法呼叫 `console.log()` 或 `Math.max()`。 |

