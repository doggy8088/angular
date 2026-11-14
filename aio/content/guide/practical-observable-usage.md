# Observable 的實際應用

以下是 observable 特別有用的一些領域範例。

## 即時輸入建議

Observable 可以簡化即時輸入建議的實作。一般來說，即時輸入必須執行一連串獨立的工作：

* 監聽來自輸入的資料。
* 修剪值（移除空白字元）並確認它達到最小長度。
* 防抖動（以免每次按鍵都送出 API 請求，而是等待按鍵出現停頓）。
* 如果值維持不變，就不要送出請求（例如快速按下一個字元，然後按退格鍵）。
* 如果進行中的 AJAX 請求的結果會被更新後的結果作廢，就取消它們。

用完整的 JavaScript 撰寫這些邏輯可能相當複雜。使用 observable，你可以使用一連串簡單的 RxJS 運算子：

<code-example path="practical-observable-usage/src/typeahead.ts" title="Typeahead"></code-example>

## 指數退避

指數退避是一種技巧：在 API 失敗後重試，每次連續失敗後拉長重試之間的時間間隔，直到達到最大重試次數，之後該請求就被視為失敗。使用 promise 與其他追蹤 AJAX 呼叫的方法來實作這一點可能相當複雜。使用 observable 則非常容易：

<code-example path="practical-observable-usage/src/backoff.ts" title="Exponential backoff"></code-example>
