# 了解管道

使用[管道](guide/glossary#管道pipe "Definition of a pipe")來轉換字串、貨幣金額、日期與其他資料，以供顯示。

## 什麼是管道

管道是在[範本運算式](/guide/glossary#範本運算式template-expression "Definition of template expression")中使用的簡單函式，接受一個輸入值並回傳轉換後的值。管道很有用，因為你可以在整個應用程式中使用它們，同時每個管道只需要宣告一次。
例如，你可以使用管道把日期顯示為 **April 15, 1988** 這種格式，而不是原始字串格式。

<div class="alert is-helpful">

如需查看本主題所用的範例應用程式，請參閱 <live-example name="pipes"></live-example>。

</div>

## 內建管道

Angular 提供用於典型資料轉換的內建管道，包括使用地區設定資訊來格式化資料的國際化（i18n）轉換。
以下是常用的資料格式化內建管道：

*   [`DatePipe`](api/common/DatePipe)：依據地區設定規則格式化日期值。
*   [`UpperCasePipe`](api/common/UpperCasePipe)：把文字轉換為全部大寫。
*   [`LowerCasePipe`](api/common/LowerCasePipe)：把文字轉換為全部小寫。
*   [`CurrencyPipe`](api/common/CurrencyPipe)：把數字轉換為貨幣字串，依據地區設定規則格式化。
*   [`DecimalPipe`](/api/common/DecimalPipe)：把數字轉換為帶有小數點的字串，依據地區設定規則格式化。
*   [`PercentPipe`](api/common/PercentPipe)：把數字轉換為百分比字串，依據地區設定規則格式化。

<div class="alert is-helpful">

*   如需內建管道的完整清單，請參閱[管道 API 文件](/api/common#pipes "Pipes API reference summary")。
*   如需進一步了解如何在國際化（i18n）工作中使用管道，請參閱[依據地區設定格式化資料][AioGuideI18nCommonFormatDataLocale]。

</div>

建立管道來封裝自訂轉換，並在範本運算式中使用你的自訂管道。

## 管道與優先順序

管道運算子的優先順序高於三元運算子（`?:`），也就是說 `a ? b : c | x` 會被解析為 `a ? b : (c | x)`。
管道運算子不能在 `?:` 的第一與第二個運算元中不加括號使用。

由於優先順序的關係，如果你想讓管道套用到三元運算的結果，請把整個運算式用括號包起來；例如 `(a ? b : c) | x`。

<code-example path="pipes/src/app/precedence.component.html" region="precedence" header="src/app/precedence.component.html"></code-example>

<!-- links -->

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale "Format data based on locale | Angular"

<!-- end links -->

@reviewed 2022-04-01
