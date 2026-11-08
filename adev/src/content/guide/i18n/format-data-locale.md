# 依地區設定格式化資料

Angular 提供下列內建的資料轉換[管道](guide/templates/pipes)。
資料轉換管道使用 [`LOCALE_ID`][ApiCoreLocaleId] token，依各地區設定的規則格式化資料。

| 資料轉換管道                            | 詳情                                      |
| :-------------------------------------- | :------------------------------------------------ |
| [`DatePipe`][ApiCommonDatepipe]         | 格式化日期值。                                    |
| [`CurrencyPipe`][ApiCommonCurrencypipe] | 將數字轉換為貨幣字串。                            |
| [`DecimalPipe`][ApiCommonDecimalpipe]   | 將數字轉換為十進位數字字串。                      |
| [`PercentPipe`][ApiCommonPercentpipe]   | 將數字轉換為百分比字串。                          |

## 使用 DatePipe 顯示目前日期

若要以目前地區設定的格式顯示目前日期，請為 `DatePipe` 使用下列格式。

```angular-html
{{ today | date }}
```

## 為 CurrencyPipe 覆寫目前地區設定

將 `locale` 參數加入管道，即可覆寫 `LOCALE_ID` token 目前的值。

若要強制貨幣使用美式英文 \(`en-US`\)，請為 `CurrencyPipe` 使用下列格式

```angular-html
{{ amount | currency: 'USD' : 'symbol' : '1.2-2' : 'en-US' }}
```

HELPFUL: 為 `CurrencyPipe` 指定的地區設定，會覆寫應用程式全域的 `LOCALE_ID` token。

## 下一步

<docs-pill-row>
  <docs-pill href="guide/i18n/prepare" title="準備元件以供翻譯"/>
</docs-pill-row>

[ApiCommonCurrencypipe]: api/common/CurrencyPipe 'CurrencyPipe | Common - API | Angular'
[ApiCommonDatepipe]: api/common/DatePipe 'DatePipe | Common - API | Angular'
[ApiCommonDecimalpipe]: api/common/DecimalPipe 'DecimalPipe | Common - API | Angular'
[ApiCommonPercentpipe]: api/common/PercentPipe 'PercentPipe | Common - API | Angular'
[ApiCoreLocaleId]: api/core/LOCALE_ID 'LOCALE_ID | Core - API | Angular'
