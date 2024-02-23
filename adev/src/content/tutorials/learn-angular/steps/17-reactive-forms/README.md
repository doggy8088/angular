# 反應式表單

當你想程式化地管理你的表單，而不是純粹依賴範本，反應式表單就是解答。

在這個活動中，您將學習如何設置反應式表單。

<hr>

<docs-workflow>

<docs-step title="匯入 `ReactiveForms` 模組">

在 `app.component.ts` 中，從 `@angular/forms` 匯入 `ReactiveFormsModule` 並將它新增至元件的 `imports` 陣列中。

```ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <form>
      <label>Name
        <input type="text" />
      </label>
      <label>Email
        <input type="email" />
      </label>
      <button type="submit">Submit</button>
    </form>
  `,
  imports: [ReactiveFormsModule],
})
```

</docs-step>

<docs-step title="使用 `FormControls` 建立 `FormGroup` 物件">

Reactive forms 使用 `FormControl` 類別來表示表單控制項（例如輸入）。Angular 提供 `FormGroup` 類別，用作表單控制項的分組，成為一個有用的物件，讓開發人員更方便處理大型表單。

將 `FormControl` 和 `FormGroup` 新增至 `@angular/forms` 的導入，以便為每個表單建立 `FormGroup`，其中 `name` 和 `email` 屬性為 `FormControls`。

```ts
import {ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
...
export class AppComponent {
  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });
}
```

</docs-step>

<docs-step title="將 FormGroup 和 FormControls 連結至表單">

每個 `FormGroup` 都應該使用 `[formGroup]` 指令附加到表單。

此外，每個 `FormControl` 都可以附加 `formControlName` 指令，並指定到對應的屬性。使用以下表單程式碼更新範本：

```html
<form [formGroup]="profileForm">
  <label>
    Name
    <input type="text" formControlName="name" />
  </label>
  <label>
    Email
    <input type="email" formControlName="email" />
  </label>
  <button type="submit">Submit</button>
</form>
```

</docs-step>

<docs-step title="處理表單更新">

當您想要存取 `FormGroup` 中的資料時，可以透過存取 `FormGroup` 的值來做到。更新 `template` 以顯示表單值：

```html
...
<h2>Profile Form</h2>
<p>Name: {{ profileForm.value.name }}</p>
<p>Email: {{ profileForm.value.email }}</p>
```

</docs-step>

<docs-step title="存取 FormGroup 值">
在元件類別中新增一個名為 `handleSubmit` 的新方法，稍後你會使用它來處理表單提交。
這個方法會顯示表單中的值，你可以從 FormGroup 存取這些值。

在元件類別中，新增 `handleSubmit()` 方法來處理表單提交。

<docs-code language="ts">
handleSubmit() {
  alert(
    this.profileForm.value.name + ' | ' + this.profileForm.value.email
  );
}
</docs-code>
</docs-step>

<docs-step title="Add `ngSubmit` to the form">
You have access to the form values, now it is time to handle the submission event and use the `handleSubmit` method.
Angular has an event handler for this specific purpose called `ngSubmit`. Update the form element to call the `handleSubmit` method when the form is submitted.

<docs-code language="html" highlight="[3]">
<form
  [formGroup]="profileForm"
  (ngSubmit)="handleSubmit()">
</docs-code>

</docs-step>

</docs-workflow>

就這樣，您已經知道如何在 Angular 中使用反應表單了。

這項活動做得很好。繼續學習表單驗證。

