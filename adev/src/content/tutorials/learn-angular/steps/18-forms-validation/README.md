# 驗證表單

在使用表單時，另一個常見情境是需要驗證輸入以確保提交正確資料。

在這個活動中，您將學習如何使用反應式表單驗證表單。

<hr>

<docs-workflow>

<docs-step title="匯入驗證程式">

Angular 提供了一組驗證工具。若要使用這些工具，請先將元件更新為從 `@angular/forms` 匯入 `Validators`。

<docs-code language="ts" highlight="[1]">
import {ReactiveFormsModule, Validators} from '@angular/forms';

@Component({...})
export class AppComponent {}
</docs-code>

</docs-step>

<docs-step title="加入驗證至表單">

每個 `FormControl` 都可以傳入您要使用以驗證 `FormControl` 值的 `Validators`。例如，如果您想要讓 `profileForm` 的欄位為必填，請使用 `Validators.required`。更新 `name` 和 `email` `FormControl` 為必填：

```ts
profileForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.required),
});
```

</docs-step>

<docs-step title="在範本中檢查表單驗證">

要判斷表單是否有效，`FormGroup` 類別有一個 `valid` 屬性。
您可以使用這個屬性動態繫結屬性。根據表單的有效性來更新提交 `button` 以啟用。

```html
<button type="submit" [disabled]="!profileForm.valid">Submit</button>
```

</docs-step>

</docs-workflow>

現在您知道驗證是如何與反應式表單一起運作的基本知識。

在 Angular 中使用表單這些核心概念的學習成果很好。如果您想了解更多資訊，務必參考 [Angular 表單文件](guide/forms/form-validation)。

