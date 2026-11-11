# 反應式表單

當你想以程式方式管理表單、而非完全依賴範本時，反應式表單就是答案。

在這個練習中，你將學習如何建立反應式表單。

<hr>

<docs-workflow>

<docs-step title="匯入 `ReactiveForms` 模組">

在 `app.component.ts` 中，從 `@angular/forms` 匯入 `ReactiveFormsModule`，並把它加到元件的 `imports` 陣列中。

```angular-ts
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

<docs-step title="用 FormControl 建立 `FormGroup` 物件">

反應式表單使用 `FormControl` 類別來表示表單控制項（例如輸入框）。Angular 提供 `FormGroup` 類別，把表單控制項分組為一個方便的物件，讓開發者處理大型表單時更便利。

把 `FormControl` 和 `FormGroup` 加到 `@angular/forms` 的匯入中，這樣你就能為每個表單建立 FormGroup，並把 `name` 和 `email` 屬性作為 FormControl。

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

<docs-step title="把 FormGroup 和 FormControl 連結到表單">

每個 `FormGroup` 都應該使用 `[formGroup]` 指令附加到表單上。

此外，每個 `FormControl` 都可以用 `formControlName` 指令附加，並指派給對應的屬性。使用以下表單程式碼更新範本：

```angular-html
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

<docs-step title="處理表單的更新">

當你想從 `FormGroup` 存取資料時，可以透過存取 `FormGroup` 的值來做到。更新 `template`，顯示表單的值：

```angular-html
...
<h2>Profile Form</h2>
<p>Name: {{ profileForm.value.name }}</p>
<p>Email: {{ profileForm.value.email }}</p>
```

</docs-step>

<docs-step title="存取 FormGroup 的值">
為元件類別加上一個名為 `handleSubmit` 的新方法，稍後你會用它來處理表單提交。
這個方法會顯示表單中的值，你可以從 FormGroup 存取這些值。

在元件類別中，加上 `handleSubmit()` 方法來處理表單提交。

<docs-code language="ts">
handleSubmit() {
  alert(
    this.profileForm.value.name + ' | ' + this.profileForm.value.email
  );
}
</docs-code>
</docs-step>

<docs-step title="把 `ngSubmit` 加到表單">
你現在可以存取表單的值了，接著要處理提交事件並使用 `handleSubmit` 方法。
Angular 有一個專門為此用途設計的事件處理器，稱為 `ngSubmit`。更新表單元素，讓表單提交時呼叫 `handleSubmit` 方法。

<docs-code language="angular-html" highlight="[3]">
<form
  [formGroup]="profileForm"
  (ngSubmit)="handleSubmit()">
</docs-code>

</docs-step>

</docs-workflow>

就這樣，你學會了如何在 Angular 中使用反應式表單。

這個練習做得太出色了。繼續前進，學習表單驗證。
