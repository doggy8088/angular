# 顯示驗證錯誤

現在你已經能驗證表單了，接下來要把驗證錯誤顯示給使用者看，這一點很重要。

在本活動中，你將學到如何：

- 以驗證訊號存取欄位狀態
- 使用 `@if` 條件式顯示錯誤
- 以 `@for` 逐一列出錯誤
- 只在使用者互動後才顯示錯誤

來顯示驗證回饋吧！

<hr />

<docs-workflow>

<docs-step title="為電子郵件欄位加入錯誤顯示">
在電子郵件輸入元素下方，加入條件式錯誤顯示。只有在欄位同時處於無效且已被觸碰的狀態時，才會顯示錯誤：

```angular-html
<label>
  Email
  <input type="email" [formField]="loginForm.email" />
</label>
@if (loginForm.email().invalid() && loginForm.email().touched()) {
  <div class="error">
    @for (error of loginForm.email().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

呼叫 `loginForm.email()` 可存取欄位的狀態訊號。`invalid()` 方法在驗證失敗時回傳 `true`，`touched()` 在使用者與欄位互動後回傳 `true`，`errors()` 則提供驗證錯誤的陣列，其中包含自訂訊息。
</docs-step>

<docs-step title="為密碼欄位加入錯誤顯示">
在密碼輸入元素下方，以相同的模式加入密碼錯誤的顯示：

```angular-html
<label>
  Password
  <input type="password" [formField]="loginForm.password" />
</label>
@if (loginForm.password().invalid() && loginForm.password().touched()) {
  <div class="error">
    @for (error of loginForm.password().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

</docs-step>

</docs-workflow>

太出色了！你已為表單加入錯誤顯示。錯誤只會在使用者與欄位互動後才出現，能提供有幫助的回饋，又不會造成干擾。

接下來，你將學到[如何處理表單提交](/tutorials/signal-forms/5-add-submission)！
