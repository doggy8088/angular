# 使用管線格式化資料

您可以通過配置來進一步使用管道。通過將選項傳遞給管道，可以配置管道。

在這個活動中，您將使用一些管道和管道參數。

<hr>

若要將參數傳遞至管線，請使用 `:` 語法，後接參數值。以下是一個範例：

```ts
template: `{{ date | date:'medium' }}`;
```

輸出為「2015 年 6 月 15 日下午 9:43:11」。

時間自訂管線輸出：

<docs-workflow>

<docs-step title="使用 `DecimalPipe` 格式化數字">

在 `app.component.ts` 中，更新範本以包含 `decimal` 管道的參數。

<docs-code language="ts" highlight="[3]">
template: `
    ...
    <li>Number with "decimal" {{ num | number:"3.2-2" }}</li>
`
</docs-code>

備註：格式是什麼？`DecimalPipe` 的參數稱為 `digitsInfo`，此參數使用格式：`{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}``

</docs-step>

<docs-step title="使用 `DatePipe` 格式化日期">

現在，更新範本以使用 `date` 管道。

<docs-code language="ts" highlight="[3]">
template: `
    ...
    <li>Date with "date" {{ birthday | date: 'medium' }}</li>
`
</docs-code>

要增添樂趣，請嘗試 `date` 的不同參數。更多資訊請參閱 [Angular 文件](/guide/pipes)。

</docs-step>

<docs-step title="使用 `CurrencyPipe` 格式化貨幣">

對於您的最後一個任務，請更新範本以使用 `currency` 管道。

<docs-code language="ts" highlight="[3]">
template: `
    ...
    <li>Currency with "currency" {{ cost | currency }}</li>
`
</docs-code>

您也可以嘗試不同的參數來使用 `currency`。更多資訊請參閱 [Angular 文件](/guide/pipes)。

</docs-step>

</docs-workflow>

使用管道進行了很棒的工作。到目前為止，你已經取得了一些很大的進展。

您的應用程式中還可以使用的內建管線更多。您可以在 [Angular 文件](/guide/pipes) 中找到清單。

倘若內建管道無法滿足你的需求，你也可以建立自訂管道。查看下一個課程以了解更多。
