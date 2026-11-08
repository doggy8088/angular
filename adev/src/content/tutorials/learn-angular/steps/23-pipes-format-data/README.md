# 使用管道格式化資料

你可以透過組態管道，進一步發揮管道的用途。管道可以透過傳入選項來組態。

NOTE: 在[深入指南](/guide/templates/pipes)中進一步了解如何使用管道格式化資料。

在這個練習中，你將使用一些管道與管道參數。

<hr>

要把參數傳給管道，請使用 `:` 語法，後面接著參數值。範例如下：

```angular-html
template: `{{ date | date: 'medium' }}`;
```

輸出是 `Jun 15, 2015, 9:43:11 PM`。

是時候自訂一些管道輸出了：

<docs-workflow>

<docs-step title="使用 `DecimalPipe` 格式化數字">

在 `app.ts` 中，更新範本，為 `decimal` 管道加入參數。

```angular-html {highlight:[2]}
template: ` ...
<li>Number with "decimal" {{ num | number: '3.2-2' }}</li>
`
```

NOTE: 那是什麼格式？`DecimalPipe` 的參數稱為 `digitsInfo`，這個參數使用以下格式：`{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

</docs-step>

<docs-step title="使用 `DatePipe` 格式化日期">

現在，更新範本，使用 `date` 管道。

```angular-html {highlight:[2]}
template: ` ...
<li>Date with "date" {{ birthday | date: 'medium' }}</li>
`
```

想多一點樂趣，可以為 `date` 試試不同的參數。更多資訊可以在 [Angular 文件](guide/templates/pipes)中找到。

</docs-step>

<docs-step title="使用 `CurrencyPipe` 格式化貨幣">

最後一個任務，更新範本，使用 `currency` 管道。

```angular-html {highlight:[2]}
template: ` ...
<li>Currency with "currency" {{ cost | currency }}</li>
`
```

你也可以為 `currency` 試試不同的參數。更多資訊可以在 [Angular 文件](guide/templates/pipes)中找到。

</docs-step>

</docs-workflow>

你把管道用得很好。你目前為止已經取得了很大的進展。

還有更多內建管道可以在你的應用程式中使用。你可以在 [Angular 文件](guide/templates/pipes)中找到完整清單。

如果內建管道無法滿足你的需求，你也可以建立自訂管道。查看下一課了解更多。
