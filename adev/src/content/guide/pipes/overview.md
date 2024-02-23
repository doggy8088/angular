# 了解管道

使用管道來轉換字串、貨幣金額、日期和其他資料以供顯示。

## 什麼是管道

管道是模板中用於接受輸入值並傳回轉換值的一個簡單函數。管道之所以有用，是因為您可以在整個應用程式中使用它們，而每只聲明一次管道。
例如，您會使用管道將日期顯示為 **1988 年 4 月 15 日**，而不是原始字串格式。

您可以建立自己的自訂管道，以便在範本中公開可重複使用的轉換。

## 內建管道

Angular 提供內建管道，用於典型的資料轉換，包括使用地區資訊來格式化資料的國際化 (i18n) 轉換。
以下是一些常用的內建資料格式化管道：

- [`DatePipe`](api/common/DatePipe)：根據語言環境規則格式化日期值。
- [`UpperCasePipe`](api/common/UpperCasePipe)：將文字轉換成全部大寫。
- [`LowerCasePipe`](api/common/LowerCasePipe)：將文字轉換成全部小寫。
- [`CurrencyPipe`](api/common/CurrencyPipe)：將數字轉換成貨幣字串，格式依照語言環境規則。
- [`DecimalPipe`](/api/common/DecimalPipe)：將數字轉換成帶有小數點的字串，格式依照語言環境規則。
- [`PercentPipe`](api/common/PercentPipe)：將數字轉換成百分比字串，格式依照語言環境規則。
- [`AsyncPipe`](api/common/AsyncPipe)：訂閱和取消訂閱非同步來源，例如可觀察對象。
- [`JsonPipe`](api/common/JsonPipe)：將元件物件屬性顯示在螢幕上，以便進行 JSON 除錯。

備註：如需內建管道的完整清單，請參閱 [管道 API 文件](/api/common#pipes "管道 API 參考摘要")。
如需進一步了解使用管道進行國際化 (i18n) 的工作，請參閱 [根據地區設定格式化資料](/guide/i18n/format-data-locale)。

