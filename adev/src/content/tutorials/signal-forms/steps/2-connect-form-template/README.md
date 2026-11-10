# 將表單連接到範本

現在，你需要使用 `[formField]` 指令將表單連接到範本。這會在你的表單模型與輸入元素之間建立雙向資料繫結。

在本課程中，你將學到如何：

- 匯入 `FormField` 指令
- 使用 `[formField]` 指令將表單欄位繫結到輸入元素
- 將文字輸入框與核取方塊連接到你的表單
- 在範本中顯示表單欄位的值

來把範本接起來吧！

<hr />

<docs-workflow>

<docs-step title="匯入 FormField 指令">
從 `@angular/forms/signals` 匯入 `FormField` 指令，並將它加入元件的 imports 陣列：

```ts
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

</docs-step>

<docs-step title="繫結電子郵件欄位">
在範本中，將 `[formField]` 指令加到電子郵件輸入元素上：

```html
<input type="email" [formField]="loginForm.email" />
```

`loginForm.email` 運算式會存取表單中的電子郵件欄位。
</docs-step>

<docs-step title="繫結密碼欄位">
將 `[formField]` 指令加到密碼輸入元素上：

```html
<input type="password" [formField]="loginForm.password" />
```

</docs-step>

<docs-step title="繫結核取方塊欄位">
將 `[formField]` 指令加到核取方塊輸入元素上：

```html
<input type="checkbox" [formField]="loginForm.rememberMe" />
```

</docs-step>

<docs-step title="顯示表單的值">
在表單下方有一個除錯區段，用來顯示目前的表單值。使用 `.value()` 顯示每個欄位的值：

```angular-html
<p>Email: {{ loginForm.email().value() }}</p>
<p>Password: {{ loginForm.password().value() ? '••••••••' : '(empty)' }}</p>
<p>Remember me: {{ loginForm.rememberMe().value() ? 'Yes' : 'No' }}</p>
```

表單欄位的值是訊號，所以你輸入時，畫面顯示的值會自動更新。
</docs-step>

</docs-workflow>

做得好！你已將表單連接到範本，並顯示了表單的值。`[formField]` 指令會自動處理雙向資料繫結：你輸入時，`loginModel` 訊號會更新，畫面顯示的值也會立即更新。

接下來，你將學到[如何為表單加入驗證](/tutorials/signal-forms/3-add-validation)！
