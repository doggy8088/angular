# 加入表單提交

最後，來學如何處理表單提交。你將學到如何使用 `submit()` 函式，在表單有效時執行非同步操作，並在表單有錯誤時停用提交按鈕。

在本活動中，你將學到如何：

- 匯入 `submit()` 函式
- 建立提交處理方法
- 使用 `submit()` 只在表單有效時執行邏輯
- 依表單狀態停用提交按鈕

來完成這個表單吧！

<hr />

<docs-workflow>

<docs-step title="匯入 submit 函式">
從 `@angular/forms/signals` 匯入 `submit` 函式：

```ts
import {form, FormField, required, email, submit} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="加入 onSubmit 方法">
在元件類別中，加入處理表單提交的 `onSubmit()` 方法：

```ts
onSubmit(event: Event) {
  event.preventDefault();
  submit(this.loginForm, async () => {
    const credentials = this.loginModel();
    console.log('Logging in with:', credentials);
    // Add your login logic here
  });
}
```

`submit()` 函式只會在表單有效時執行你的非同步回呼。它也會自動處理表單的提交狀態。
</docs-step>

<docs-step title="將提交處理常式繫結到表單">
在範本中，將 `onSubmit()` 方法繫結到表單的 submit 事件：

```html
<form (submit)="onSubmit($event)"></form>
```

</docs-step>

<docs-step title="在表單無效時停用按鈕">
更新提交按鈕，讓它在表單無效時停用：

```html
<button type="submit" [disabled]="loginForm().invalid()">Log in</button>
```

這樣可在表單有驗證錯誤時避免提交。
</docs-step>

</docs-workflow>

恭喜！你已使用 Signal Forms 建置出一個完整的登入表單。

想看看自己學到了什麼，並探索進階主題嗎？繼續前往[下一步](/tutorials/signal-forms/6-next-steps)！
