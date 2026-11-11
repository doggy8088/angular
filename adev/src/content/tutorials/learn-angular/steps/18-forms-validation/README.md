# 驗證表單

使用表單時另一個常見情境，是需要驗證輸入內容，確保送出的是正確的資料。

在這個練習中，你將學習如何以反應式表單驗證表單。

<hr>

<docs-workflow>

<docs-step title="匯入 Validators">

Angular 提供了一組驗證工具。要使用它們，先更新元件，從 `@angular/forms` 匯入 `Validators`。

<docs-code language="ts" highlight="[1]">
import {ReactiveFormsModule, Validators} from '@angular/forms';

@Component({...})
export class AppComponent {}
</docs-code>

</docs-step>

<docs-step title="為表單加上驗證">

每個 `FormControl` 都可以傳入你想用來驗證 `FormControl` 值的 `Validators`。例如，如果你想讓 `profileForm` 中的 `name` 欄位成為必填，就使用 `Validators.required`。
對於我們 Angular 表單中的 `email` 欄位，我們希望確保它不是空白，並且符合有效的電子郵件地址結構。我們可以把 `Validators.required` 和 `Validators.email` 這兩個驗證器合併在一個陣列中來做到這一點。
更新 `name` 和 `email` 的 `FormControl`：

```ts
profileForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

</docs-step>

<docs-step title="在範本中檢查表單驗證">

要判斷表單是否有效，`FormGroup` 類別有一個 `valid` 屬性。
你可以使用這個屬性來動態繫結特性。更新提交 `button`，讓它依表單的有效性決定啟用或停用。

```angular-html
<button type="submit" [disabled]="!profileForm.valid">Submit</button>
```

</docs-step>

</docs-workflow>

你現在已經了解驗證如何與反應式表單搭配運作的基礎。

你把在 Angular 中使用表單的這些核心概念學得很好。如果你想了解更多，請務必參閱 [Angular 表單文件](guide/forms/form-validation)。
