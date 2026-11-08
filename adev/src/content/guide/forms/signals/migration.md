# 把既有表單遷移到 Signal Forms

本指南提供把既有程式碼庫遷移到 Signal Forms 的策略，重點放在與既有反應式表單（Reactive Forms）的互通性。

## 使用 `compatForm` 由上而下遷移

有時你可能會想在 Signal Form 中使用既有的反應式 `FormControl` 實例。這在控制項涉及下列情況時很有用：

- 複雜的非同步邏輯。
- 尚未移植的繁複 RxJS 運算子。
- 與既有第三方函式庫整合。

### 把 `FormControl` 整合進 Signal Form

假設有一個既有的 `passwordControl`，使用專門的 `enterprisePasswordValidator`。與其重寫驗證器，不如把這個控制項橋接進你的訊號狀態。

我們可以用 `compatForm` 做到這一點：

```typescript
import {signal} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';

// 1. Existing control with a specialized validator
const passwordControl = new FormControl('', {
  validators: [Validators.required, enterprisePasswordValidator()],
  nonNullable: true,
});

// 2. Wrap it inside your form state signal
const user = signal({
  email: '',
  password: passwordControl, // Nest the existing control directly
});

// 3. Create the form
const f = compatForm(user);

// Access values via the signal tree
console.log(f.email().value()); // Current email value
console.log(f.password().value()); // Current value of passwordControl

// Reactive state is proxied automatically
const isPasswordValid = f.password().valid();
const passwordErrors = f.password().errors(); // Returns CompatValidationError if the existing validator fails
```

在範本中，繫結底層控制項，使用標準的反應式語法：

```angular-html
<form novalidate>
  <div>
    <label>
      Email:
      <input [formField]="f.email" />
    </label>
  </div>

  <div>
    <label>
      Password:
      <input [formField]="f.password" type="password" />
    </label>

    @if (f.password().touched() && f.password().invalid()) {
      <div class="error-list">
        @for (error of f.password().errors(); track error) {
          <p>{{ errorMessage(error) }}</p>
        }
      </div>
    }
  </div>
</form>
```

來自既有驗證器的錯誤是 `CompatValidationError`。它們不會設定 `message`；驗證器回傳的錯誤物件改以 `context` 提供：

```typescript
import {ValidationError} from '@angular/forms/signals';
import {CompatValidationError} from '@angular/forms/signals/compat';

errorMessage(error: ValidationError) {
  if (error instanceof CompatValidationError) {
    return (error.context as {message?: string} | null)?.message ?? error.kind;
  }
  return error.message ?? error.kind;
}
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.html"/>
</docs-code-multifile>

### 把 `FormGroup` 整合進 Signal Form

你也可以包裝整個 `FormGroup`。當表單中某個可重用的子區塊（例如**地址區塊**）仍由既有的反應式表單管理時，這種情況很常見。

```typescript
import {signal} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';
import {required} from '@angular/forms/signals';

// 1. An existing address group with its own validation logic
const addressGroup = new FormGroup({
  street: new FormControl('123 Angular Way', Validators.required),
  city: new FormControl('Mountain View', Validators.required),
  zip: new FormControl('94043', Validators.required),
});

// 2. Include it in the state like it's a value
const checkoutModel = signal({
  customerName: 'Pirojok the Cat',
  shippingAddress: addressGroup,
});

const f = compatForm(checkoutModel, (p) => {
  required(p.customerName);
});
```

`shippingAddress` 欄位在你的 Signal Form 樹中扮演分支的角色。你可以在範本中透過 `.control()` 存取底層的既有控制項，來繫結這些巢狀控制項：

```angular-html
<form novalidate>
  <h3>Shipping Details</h3>

  <div>
    <label>
      Customer Name:
      <input [formField]="f.customerName" />
    </label>

    @if (f.customerName().touched() && f.customerName().invalid()) {
      <div class="error-list">
        <p>Customer name is required.</p>
      </div>
    }
  </div>

  <fieldset>
    <legend>Address</legend>

    @let street = f.shippingAddress().control().controls.street;
    <div>
      <label>
        Street:
        <input [formControl]="street" />
      </label>
      @if (street.touched && street.invalid) {
        <div class="error-list">
          <p>Street is required</p>
        </div>
      }
    </div>

    @let city = f.shippingAddress().control().controls.city;
    <div>
      <label>
        City:
        <input [formControl]="city" />
      </label>
      @if (city.touched && city.invalid) {
        <div class="error-list">
          <p>City is required</p>
        </div>
      }
    </div>

    @let zip = f.shippingAddress().control().controls.zip;
    <div>
      <label>
        Zip Code:
        <input [formControl]="zip" />
      </label>
      @if (zip.touched && zip.invalid) {
        <div class="error-list">
          <p>Zip Code is required</p>
        </div>
      }
    </div>
  </fieldset>
</form>
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.html"/>
</docs-code-multifile>

### 存取值

雖然 `compatForm` 會在 `FormControl` 層級代理值的存取，但完整的表單值仍保留著控制項本身：

```typescript
const passwordControl = new FormControl('password' /** ... */);

const user = signal({
  email: '',
  password: passwordControl, // Nest the existing control directly
});

const form = compatForm(user);
form.password().value(); // 'password'
form().value(); // { email: '', password: FormControl}
```

若你需要整份表單值，就必須手動組合：

```typescript
const formValue = computed(() => ({
  email: form.email().value(),
  password: form.password().value(),
})); // {email: '', password: ''}
```

## 由下而上遷移

### 把 Signal Form 整合進 `FormGroup`

你可以使用 `SignalFormControl`，把以訊號為基礎的表單公開為標準的 `FormControl`。當你想把表單的葉節點遷移到訊號、同時保留父 `FormGroup` 結構時，這很有用。

```typescript
import {Component, signal} from '@angular/core';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {required} from '@angular/forms/signals';

@Component({
  // ...
  imports: [ReactiveFormsModule],
})
export class UserProfile {
  // 1. Create a SignalFormControl, use signal form rules.
  emailControl = new SignalFormControl('', (p) => {
    required(p, {message: 'Email is required'});
  });

  // 2. Use it in an existing FormGroup
  form = new FormGroup({
    email: this.emailControl,
  });
}
```

`SignalFormControl` 會在 **Signal Forms** 系統與**反應式表單**系統之間雙向同步值：

- **Signal -> Reactive**：透過 Signal Forms 更新值，會立即更新反應式表單控制項。

```typescript
// Signal Forms update
this.emailControl.fieldTree().value.set('new@example.com');

// Reactive Forms reflects the change
console.log(this.form.value); // {email: 'new@example.com'}
```

- **Reactive -> Signal**：透過父 `FormGroup` 更新值，會更新 Signal Forms 的狀態。

```typescript
// Reactive Forms update
this.form.patchValue({email: 'other@example.com'});

// Signal Forms reflects the change
console.log(this.emailControl.fieldTree().value()); // 'other@example.com'
```

### 繫結 `SignalFormControl`

要在 `FormGroup` 中使用 `SignalFormControl`，請把它作為控制項傳入，並在範本中使用 `.fieldTree` 繫結：

```typescript
readonly emailControl = new SignalFormControl('', (p) => { required(p); });

readonly form = new FormGroup({
  name: new FormControl('Alice'),
  email: this.emailControl,
});
```

```angular-html {prefer}
<form [formGroup]="form">
  <!-- Standard control -->
  <input formControlName="name" />

  <!-- Signal control -->
  <input [formField]="emailControl.fieldTree" />
</form>
```

```angular-html {avoid}
<!-- Avoid: Using formControlName or [formControl] for SignalFormControl -->
<input formControlName="email" />
<input [formControl]="emailControl" />
```

### 為什麼 `SignalFormControl` 接收值而非訊號

在標準的 Signal Forms 中，你是把訊號傳入來建立表單：`form(mySignal)`。

然而，`SignalFormControl` 的第一個引數接收的是**原始值**（例如字串或物件）：

```typescript
// Takes a raw value, not a signal
const userControl = new SignalFormControl({
  email: 'pirojok@example.com',
});
```

`SignalFormControl` 會在內部建立訊號，以攔截寫入，並觸發反應式表單所預期的**同步更新**。

你仍然可以透過 `.sourceValue` 存取內部訊號：

```typescript
const value = userControl.sourceValue();
```

### 停用／啟用控制項

用於變更啟用／停用狀態的命令式 API（例如 `enable()`、`disable()`），在 `SignalFormControl` 中刻意不予支援。這是因為控制項的狀態應該源自訊號狀態與規則。

嘗試呼叫 disable/enable 會擲出錯誤。

```typescript {avoid}
import {signal, effect} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';

export class UserProfile {
  readonly emailControl = new SignalFormControl('');

  readonly isLoading = signal(false);

  constructor() {
    // This will throw an error
    effect(() => {
      if (this.isLoading()) {
        this.emailControl.disable();
      } else {
        this.emailControl.enable();
      }
    });
  }
}
```

改用 disabled 規則：

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {disabled} from '@angular/forms/signals';

export class UserProfile {
  readonly isLoading = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // The control becomes disabled whenever isLoading is true
    disabled(p, {when: () => this.isLoading()});
  });

  async saveData() {
    this.isLoading.set(true);
    // ... perform save ...
    this.isLoading.set(false);
  }
}
```

### 動態操作

用於新增或移除驗證器的命令式 API（例如 `addValidators()`、`removeValidators()`、`setValidators()`），在 `SignalFormControl` 中刻意不予支援。

嘗試呼叫這些方法會擲出錯誤。

```typescript {avoid}
export class UserProfile {
  readonly emailControl = new SignalFormControl('');
  readonly isRequired = signal(false);

  toggleRequired() {
    this.isRequired.update((v) => !v);
    // This will throw an error
    if (this.isRequired()) {
      this.emailControl.addValidators(Validators.required);
    } else {
      this.emailControl.removeValidators(Validators.required);
    }
  }
}
```

改用 `applyWhen` 規則，有條件地套用驗證器：

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {applyWhen, required} from '@angular/forms/signals';

export class UserProfile {
  readonly isRequired = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // The control becomes required whenever isRequired is true
    applyWhen(
      p,
      () => this.isRequired(),
      (p) => {
        required(p);
      },
    );
  });
}
```

### 手動選取錯誤

`setErrors()` 與 `markAsPending()` 方法不受支援。在 Signal Forms 中，錯誤源自驗證規則與非同步驗證狀態。若你需要回報錯誤，應該透過結構描述中的驗證規則，以宣告方式完成。

## 自動狀態類別

反應式／範本表單會自動加上[類別屬性](/guide/forms/template-driven-forms#track-control-states)（例如 `.ng-valid` 或 `.ng-dirty`），以便為控制項狀態套用樣式。Signal Forms 不會這樣做。

若你想保留這個行為，可以提供 `NG_STATUS_CLASSES` 預設集：

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';
import {NG_STATUS_CLASSES} from '@angular/forms/signals/compat';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
});
```

你也可以提供自己的自訂設定，依你的自訂邏輯套用任何你想要的類別：

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: {
        'ng-valid': ({state}) => state().valid(),
        'ng-invalid': ({state}) => state().invalid(),
        'ng-touched': ({state}) => state().touched(),
        'ng-dirty': ({state}) => state().dirty(),
      },
    }),
  ],
});
```

## 自訂控制項

任何[自訂 Signal Form 控制項](guide/forms/signals/custom-controls)都可以原封不動地用在反應式（及範本驅動）表單中。這讓你能把既有的 `ControlValueAccessor` 實作遷移到 `FormValueControl`／`FormCheckboxControl`，而不破壞既有的使用方式。

IMPORTANT: 不要在同一個元件上同時實作 `ControlValueAccessor` 與 `FormValueControl`／`FormCheckboxControl`。擇一實作即可。

假設有下列自訂控制項：

```angular-ts
import {Component, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-input',
  template: `
    <div class="basic-input">
      <input
        type="text"
        [value]="value()"
        (input)="value.set($event.target.value)"
        placeholder="Enter text..."
      />
    </div>
  `,
})
export class BasicInput implements FormValueControl<string> {
  /** The current input value */
  value = model('');
}
```

你可以像使用原生輸入或以 `ControlValueAccessor` 為基礎的自訂控制項一樣，把這個自訂控制項用在反應式表單中。例如，假設有這個帶有反應式表單的簡單元件。

```angular-ts
import {Component} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {BasicInput} from './basic-input';

@Component({
  selector: 'app-example',
  template: `
    <form [formGroup]="reactiveFormGroup">
      <app-basic-input formControlName="reactiveControlName" />
    </form>
    <p>Text: {{ reactiveFormGroup.value.reactiveControlName }}</p>
  `,
  imports: [ReactiveFormsModule, BasicInput],
})
export class ExampleComponent {
  readonly reactiveFormGroup = new FormGroup({
    reactiveControlName: new FormControl(''),
  });
}
```

對自訂 `app-basic-input` 控制項的任何變更，都會反映在反應式 `FormControl` 中。
