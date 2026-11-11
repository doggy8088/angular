# 了解管道

使用管道來轉換字串、貨幣金額、日期與其他資料，以便顯示。

## 什麼是管道 {#what-is-a-pipe}

管道是在範本中使用的簡單函式，接受輸入值並回傳轉換後的值。管道很實用，因為你只需宣告每個管道一次，就能在整個應用程式中使用它們。
例如，你可以用管道把日期顯示為 **April 15, 1988**，而不是原始的字串格式。

你可以建立自己的自訂管道，在範本中提供可重複使用的轉換。

## 內建管道 {#built-in-pipes}

Angular 提供用於典型資料轉換的內建管道，包括使用地區設定資訊來格式化資料的國際化（i18n）轉換。
以下是常用的資料格式化內建管道：

- [`DatePipe`](api/common/DatePipe): 依地區設定規則格式化日期值。
- [`UpperCasePipe`](api/common/UpperCasePipe): 將文字轉換為全部大寫。
- [`LowerCasePipe`](api/common/LowerCasePipe): 將文字轉換為全部小寫。
- [`CurrencyPipe`](api/common/CurrencyPipe): 將數字轉換為貨幣字串，依地區設定規則格式化。
- [`DecimalPipe`](/api/common/DecimalPipe): 將數字轉換為帶小數點的字串，依地區設定規則格式化。
- [`PercentPipe`](api/common/PercentPipe): 將數字轉換為百分比字串，依地區設定規則格式化。
- [`AsyncPipe`](api/common/AsyncPipe): 訂閱與取消訂閱非同步來源，例如 observable。
- [`JsonPipe`](api/common/JsonPipe): 把元件物件屬性以 JSON 顯示在畫面上，供除錯使用。

NOTE: 內建管道的完整清單，請參閱[管道 API 文件](/api?type=pipe "Pipes API reference summary")。
如需深入了解如何把管道用於國際化（i18n），請參閱[依地區設定格式化資料](guide/i18n/format-data-locale)。
