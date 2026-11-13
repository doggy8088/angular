# 使用參數與串連管道轉換資料

使用選用參數來微調管道的輸出。
例如，使用 [`CurrencyPipe`](api/common/CurrencyPipe "API reference") 並以國家代碼（例如 EUR）作為參數。
範本運算式 `{{ amount | currency:'EUR' }}` 會把 `amount` 轉換為歐元貨幣。
在管道名稱（`currency`）後面加上冒號（`:`）與參數值（`'EUR'`）。

如果管道接受多個參數，請以冒號分隔各個值。
例如，`{{ amount | currency:'EUR':'Euros '}}` 會把第二個參數——字串字面值 `'Euros '`——加到輸出字串中。使用任何有效的範本運算式作為參數，例如字串字面值或元件屬性。

有些管道至少需要一個參數，並允許更多選用參數，例如 [`SlicePipe`](/api/common/SlicePipe "API reference for SlicePipe")。例如，`{{ slice:1:5 }}` 會建立一個新的陣列或字串，包含從元素 `1` 開始、到元素 `5` 結束的子集。

## 範例：格式化日期

下列範例中的頁籤展示了在兩種不同格式（`'shortDate'` 與 `'fullDate'`）之間切換：

*   `app.component.html` 範本使用格式參數，為 [`DatePipe`](api/common/DatePipe)（名稱為 `date`）把日期顯示為 **04/15/88** 的形式。
*   `hero-birthday2.component.ts` 元件把管道的格式參數繫結到元件的 `format` 屬性（位於 `template` 區段），並加入一個按鈕，處理繫結到元件 `toggleFormat()` 方法的點選事件。
*   `hero-birthday2.component.ts` 元件的 `toggleFormat()` 方法會把元件的 `format` 屬性在短格式（`'shortDate'`）與較長的格式（`'fullDate'`）之間切換。

<code-tabs>
    <code-pane header="src/app/app.component.html" region="format-birthday" path="pipes/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/hero-birthday2.component.ts (template)" region="template" path="pipes/src/app/hero-birthday2.component.ts"></code-pane>
    <code-pane header="src/app/hero-birthday2.component.ts (class)" region="class" path="pipes/src/app/hero-birthday2.component.ts"></code-pane>
</code-tabs>

點選 **Toggle Format** 按鈕，會讓日期格式在 **04/15/1988** 與 **Friday, April 15, 1988** 之間交替切換。

<div class="alert is-helpful">

如需 `date` 管道的格式選項，請參閱 [DatePipe](api/common/DatePipe "DatePipe API Reference page")。

</div>

## 範例：以串連管道套用兩種格式

串連管道，讓一個管道的輸出成為下一個管道的輸入。

在下列範例中，串連的管道會先把格式套用到日期值，再把格式化後的日期轉換為大寫字元。
第一個頁籤為 `src/app/app.component.html` 範本串連 `DatePipe` 與 `UpperCasePipe`，把生日顯示為 **APR 15, 1988** 的形式。
第二個頁籤為 `src/app/app.component.html` 範本在串連到 `uppercase` 之前，把 `fullDate` 參數傳給 `date`，產生 **FRIDAY, APRIL 15, 1988** 的形式。

<code-tabs>
    <code-pane header="src/app/app.component.html (1)" region="chained-birthday" path="pipes/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/app.component.html (2)" region="chained-parameter-birthday" path="pipes/src/app/app.component.html"></code-pane>
</code-tabs>

@reviewed 2022-4-01
