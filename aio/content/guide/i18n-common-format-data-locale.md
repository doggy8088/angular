# 依地區設定格式化資料

Angular 提供下列內建的資料轉換[管道][AioGuideGlossaryPipe]。資料轉換管道使用 [`LOCALE_ID`][AioApiCoreLocaleId] 權杖，依各地區設定的規則格式化資料。

| 資料轉換管道 | 詳情 |
|:---                                        |:---     |
| [`DatePipe`][AioApiCommonDatepipe] | 格式化日期值。 |
| [`CurrencyPipe`][AioApiCommonCurrencypipe] | 將數字轉換為貨幣字串。 |
| [`DecimalPipe`][AioApiCommonDecimalpipe] | 將數字轉換為十進位數字字串。 |
| [`PercentPipe`][AioApiCommonPercentpipe] | 將數字轉換為百分比字串。 |

## 使用 DatePipe 顯示目前日期

若要以目前地區設定的格式顯示目前日期，請為 `DatePipe` 使用下列格式。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

{{ today &verbar; date }}

</code-example>

## 為 CurrencyPipe 覆寫目前地區設定

將 `locale` 參數加入管道，即可覆寫 `LOCALE_ID` token 目前的值。

若要強制貨幣使用美式英文 \(`en-US`\)，請為 `CurrencyPipe` 使用下列格式

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

{{ amount &verbar; currency : 'en-US' }}

</code-example>

<div class="alert is-helpful">

**注意**：<br />
為 `CurrencyPipe` 指定的地區設定會覆寫應用程式全域的 `LOCALE_ID` 權杖。

</div>

## 後續步驟

*   [準備元件以供翻譯][AioGuideI18nCommonPrepare]

<!-- links -->

[AioApiCommonCurrencypipe]: api/common/CurrencyPipe "CurrencyPipe | Common - API | Angular"
[AioApiCommonDatepipe]: api/common/DatePipe "DatePipe | Common - API | Angular"
[AioApiCommonDecimalpipe]: api/common/DecimalPipe "DecimalPipe | Common - API | Angular"
[AioApiCommonPercentpipe]: api/common/PercentPipe "PercentPipe | Common - API | Angular"
[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioGuideGlossaryPipe]: guide/glossary#管道（pipe） "pipe - 詞彙表 | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "準備元件以供翻譯 | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
