# 為表單加入驗證

為表單加入驗證至關重要，能確保使用者輸入有效的資料。Signal Forms 的驗證器寫在你傳給 `form()` 函式的結構函式中。

在本活動中，你將學到如何：

- 匯入內建驗證器
- 為你的表單定義結構函式
- 以自訂錯誤訊息將驗證器套用到特定欄位

來加入驗證吧！

<hr />

<docs-workflow>

<docs-step title="匯入驗證器">
從 `@angular/forms/signals` 匯入 `required` 與 `email` 驗證器：

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="為表單加入結構函式">
更新你的 `form()` 呼叫，將結構函式作為第二個參數加入。結構函式會收到一個 `fieldPath` 參數，讓你存取每個欄位：

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  // Validators will go here
});
```

</docs-step>

<docs-step title="為電子郵件欄位加入驗證">
在結構函式中，為電子郵件欄位加入驗證。同時使用 `required()` 與 `email()` 驗證器：

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
});
```

`message` 選項可為使用者提供自訂的錯誤訊息。
</docs-step>

<docs-step title="為密碼欄位加入驗證">
使用 `required()` 驗證器，為密碼欄位加入驗證：

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
  required(fieldPath.password, {message: 'Password is required'});
});
```

</docs-step>

</docs-workflow>

太完美了！你已為表單加入驗證。使用者與表單互動時，驗證器會自動執行。驗證失敗時，欄位的狀態會反映出這些錯誤。

接下來，你將學到[如何在範本中顯示驗證錯誤](/tutorials/signal-forms/4-display-errors)！
