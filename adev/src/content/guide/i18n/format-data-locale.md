# 依據地區格式化數據

Angular 提供以下內建資料轉換 [管道](guide/pipes)。
資料轉換管道使用 [`LOCALE_ID`][AioApiCoreLocaleId] 令牌來根據每個語言環境的規則格式化資料。

| 數據轉換管道                   | 細節 |
|:---                                        |:---     |
| [`DatePipe`][AioApiCommonDatepipe]         | 格式化日期值。                             |
| [`CurrencyPipe`][AioApiCommonCurrencypipe] | 將數字轉換成貨幣字串。       |
| [`DecimalPipe`][AioApiCommonDecimalpipe]   | 將數字轉換成小數數字字串。 |
| [`PercentPipe`][AioApiCommonPercentpipe]   | 將數字轉換成百分比字串。     |

## 使用 DatePipe 顯示目前日期

若要以當前地區設定的格式顯示目前日期，請針對 `DatePipe` 使用下列格式。

<!--todo: 用 docs-code 取代 -->

<docs-code language="typescript">

{{ today &verbar; date }}

</docs-code>

## 以 CurrencyPipe 覆寫目前地區

將 `locale` 參數新增到管線以覆寫 `LOCALE_ID` 令牌的當前值。

要強制貨幣使用美式英文 \(`en-US`\)，請使用以下格式給予 `CurrencyPipe``

<!--todo: 用 docs-code 取代 -->

<docs-code language="typescript">

{{ amount &verbar; currency : 'en-US' }}

</docs-code>

HELPFUL: 為 `CurrencyPipe` 指定的 locale 會覆寫應用程式的全域 `LOCALE_ID` 令牌。

## 接下來

<docs-pill-row>
  <docs-pill href="guide/i18n/prepare" title="準備元件進行翻譯"/>
</docs-pill-row>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
