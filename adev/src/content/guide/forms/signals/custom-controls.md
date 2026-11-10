# 自訂控制項

NOTE: 本指南假設你已熟悉 [Signal Forms 基礎](essentials/signal-forms)。

瀏覽器內建的表單控制項（如 input、select、textarea）可以處理常見情況，但應用程式常需要專門的輸入方式。附月曆 UI 的日期選擇器、附格式工具列的富文字編輯器，或附自動完成的標籤選擇器，都需要自訂實作。

Signal Forms 能與任何實作了特定介面的元件搭配運作。**控制項介面**定義了讓你的元件能與表單系統溝通的屬性與訊號。元件只要實作其中一個介面，`[formField]` 指令就會自動把你的控制項連接到表單狀態、驗證與資料綁定。

## 建立基本的自訂控制項

我們先從最小可行的實作開始，再依需要加入功能。

### 最小輸入控制項

基本的自訂輸入只需要實作 `FormValueControl` 介面，並定義必要的 `value` 模型訊號。

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

### 最小核取方塊控制項

核取方塊類型的控制項需要兩件事：

1. 實作 `FormCheckboxControl` 介面，讓 `FormField` 指令把它辨識為表單控制項
2. 提供 `checked` 模型訊號

```angular-ts
import {Component, model, ChangeDetectionStrategy} from '@angular/core';
import {FormCheckboxControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-toggle',
  template: `
    <button type="button" [class.active]="checked()" (click)="toggle()">
      <span class="toggle-slider"></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicToggle implements FormCheckboxControl {
  /** Whether the toggle is checked */
  checked = model<boolean>(false);

  toggle() {
    this.checked.update((val) => !val);
  }
}
```

### 使用你的自訂控制項

控制項建立好之後，在任何會用內建輸入的位置都能用它，只要在上面加上 `FormField` 指令即可：

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {BasicInput} from './basic-input';
import {BasicToggle} from './basic-toggle';

@Component({
  imports: [FormField, BasicInput, BasicToggle],
  template: `
    <form novalidate>
      <label>
        Email
        <app-basic-input [formField]="registrationForm.email" />
      </label>

      <label>
        Accept terms
        <app-basic-toggle [formField]="registrationForm.acceptTerms" />
      </label>

      <button type="submit" [disabled]="registrationForm().invalid()">Register</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  registrationModel = signal({
    email: '',
    acceptTerms: false,
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    required(schemaPath.acceptTerms, {message: 'You must accept the terms'});
  });
}
```

NOTE: 結構定義回呼參數（這些範例中的 `schemaPath`）是一個 `SchemaPathTree` 物件，提供表單中所有欄位的路徑。這個參數你可以取任何名字。

`[formField]` 指令對自訂控制項與內建輸入的運作方式完全相同。Signal Forms 一視同仁：驗證會執行、狀態會更新、資料綁定自動運作。

## 了解控制項介面

看過自訂控制項實際運作後，接著來探討它們如何與 Signal Forms 整合。

### 控制項介面

你建立的 `BasicInput` 與 `BasicToggle` 元件實作了特定的控制項介面，告訴 Signal Forms 如何與它們互動。

#### FormValueControl

`FormValueControl` 是大多數輸入類型的介面：文字輸入、數字輸入、日期選擇器、select 下拉選單，以及任何編輯單一值的控制項。元件實作這個介面時：

- **必要屬性**：你的元件必須提供 `value` 模型訊號
- **FormField 指令的行為**：把表單欄位的值綁定到你的控制項的 `value` 訊號

IMPORTANT: 實作 `FormValueControl` 的控制項不可以有 `checked` 屬性

#### FormCheckboxControl

`FormCheckboxControl` 是核取方塊類型控制項的介面：切換開關、開關，以及任何表示布林值開／關狀態的控制項。元件實作這個介面時：

- **必要屬性**：你的元件必須提供 `checked` 模型訊號
- **FormField 指令的行為**：把表單欄位的值綁定到你的控制項的 `checked` 訊號

IMPORTANT: 實作 `FormCheckboxControl` 的控制項不可以有 `value` 屬性

### 可選的狀態屬性

`FormValueControl` 與 `FormCheckboxControl` 都繼承自 `FormUiControl`，這是一個基礎介面，提供與表單狀態整合的可選屬性。

所有屬性都是可選的，只實作你的控制項需要的即可。

#### 互動狀態

追蹤使用者何時與你的控制項互動：

| 屬性      | 用途                                             |
| --------- | ------------------------------------------------ |
| `touched` | 使用者是否已與該欄位互動                         |
| `dirty`   | 值是否與初始狀態不同                             |

#### 驗證狀態

向使用者顯示驗證回饋：

| 屬性      | 用途                     |
| --------- | ------------------------ |
| `errors`  | 目前驗證錯誤的陣列       |
| `valid`   | 欄位是否有效             |
| `invalid` | 欄位是否有驗證錯誤       |
| `pending` | 非同步驗證是否正在進行中 |

#### 可用狀態

控制使用者能否與你的欄位互動：

| 屬性              | 用途                                     |
| ----------------- | ---------------------------------------- |
| `disabled`        | 欄位是否已停用                           |
| `disabledReasons` | 欄位被停用的原因                         |
| `readonly`        | 欄位是否為唯讀（可見但不可編輯）         |
| `hidden`          | 欄位是否已隱藏、不顯示                   |

NOTE: `disabledReasons` 是 `DisabledReason` 物件的陣列。每個物件都有一個 `field` 屬性（參照到欄位樹）與一個可選的 `message` 屬性。透過 `reason.message` 存取訊息。

#### 驗證限制 {#validation-constraints}

從表單接收驗證限制的值：

| 屬性        | 用途                                        |
| ----------- | ------------------------------------------- |
| `required`  | 欄位是否必填                                |
| `min`       | 數值下限（沒有約束時為 `undefined`）        |
| `max`       | 數值上限（沒有約束時為 `undefined`）        |
| `minLength` | 字串長度下限（沒有約束時為 undefined）      |
| `maxLength` | 字串長度上限（沒有約束時為 undefined）      |
| `pattern`   | 要比對的正規表示式模式陣列                  |

#### 欄位中繼資料

| 屬性   | 用途                                         |
| ------ | -------------------------------------------- |
| `name` | 欄位的 name 屬性（在表單與應用程式間全域唯一） |

下方的「[加入狀態訊號](#adding-state-signals)」一節會展示如何在你的控制項中實作這些屬性。

### FormField 指令的運作方式 {#how-the-formfield-directive-works}

`[formField]` 指令會偵測你的控制項實作了哪個介面，並自動綁定相應的訊號：

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {CustomInput} from './custom-input';
import {CustomToggle} from './custom-toggle';

@Component({
  selector: 'app-my-form',
  imports: [FormField, CustomInput, CustomToggle],
  template: `
    <form novalidate>
      <app-custom-input [formField]="userForm.username" />
      <app-custom-toggle [formField]="userForm.subscribe" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyForm {
  formModel = signal({
    username: '',
    subscribe: false,
  });

  userForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
  });
}
```

TIP: 想完整了解如何建立與管理表單模型，請見[表單模型指南](guide/forms/signals/models)。

當你綁定 `[formField]="userForm.username"` 時，FormField 指令會：

1. 偵測到你的控制項實作了 `FormValueControl`
2. 在內部存取 `userForm.username().value()`，並把它綁定到你的控制項的 `value` 模型訊號
3. 把表單狀態訊號（`disabled()`、`errors()` 等）綁定到你的控制項的可選輸入訊號
4. 透過訊號的反應性自動進行更新

## 加入狀態訊號 {#adding-state-signals}

上面的最小控制項可以運作，但不會回應表單狀態。你可以加入可選的輸入訊號，讓你的控制項能對停用狀態做出反應、顯示驗證錯誤，並追蹤使用者互動。

以下是一個實作了常見狀態屬性的完整範例：

```angular-ts
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';
import {FormValueControl, WithOptionalFieldTree, ValidationError, DisabledReason} from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="text"
          [value]="value()"
          (input)="value.set($event.target.value)"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.aria-invalid]="invalid()"
          (blur)="touched.set(true)"
        />

        @if (invalid()) {
          <div class="error-messages" role="alert">
            @for (error of errors(); track error) {
              <span class="error">{{ error.message }}</span>
            }
          </div>
        }

        @if (disabled() && disabledReasons().length > 0) {
          <div class="disabled-reasons">
            @for (reason of disabledReasons(); track reason) {
              <span>{{ reason.message }}</span>
            }
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulInput implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
```

如此一來，你就能搭配驗證與狀態管理來使用這個控制項：

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';
import {StatefulInput} from './stateful-input';

@Component({
  imports: [FormField, StatefulInput],
  template: `
    <form novalidate>
      <label>
        Email
        <app-stateful-input [formField]="loginForm.email" />
      </label>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  loginModel = signal({email: ''});

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

當使用者輸入無效的 email 時，FormField 指令會自動更新 `invalid()` 與 `errors()`。你的控制項可以據此顯示驗證回饋。

### 狀態屬性的訊號型別

大多數狀態屬性使用 `input()`（從表單端唯讀）。當你的控制項會在使用者互動時更新 `touched`，請改用 `model()`。`touched` 屬性獨特之處在於，它可以依你的需求使用 `model()`、`input()` 或 `OutputRef`。

## 值轉換 {#value-transformation}

控制項顯示的值有時與表單模型儲存的值不同：日期選擇器可能顯示「January 15, 2024」，儲存的卻是「2024-01-15」；貨幣輸入可能顯示「$1,234.56」，儲存的卻是 1234.56。

使用 `linkedSignal()`（來自 `@angular/core`）把模型值轉換為顯示用的形式，並處理輸入事件，把使用者輸入剖析回儲存格式：

```angular-ts
import {formatCurrency} from '@angular/common';
import {ChangeDetectionStrategy, Component, linkedSignal, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-currency-input',
  template: `
    <input
      type="text"
      [value]="displayValue()"
      (input)="displayValue.set($event.target.value)"
      (blur)="updateModel()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyInput implements FormValueControl<number> {
  // Stores numeric value (1234.56)
  readonly value = model.required<number>();

  // Stores display value ("1,234.56")
  readonly displayValue = linkedSignal(() => formatCurrency(this.value(), 'en', 'USD'));

  // Update the model from the display value.
  updateModel() {
    this.value.set(parseCurrency(this.displayValue()));
  }
}

// Converts a currency string to a number (e.g. "USD1,234.56" -> 1234.56).
function parseCurrency(value: string): number {
  return parseFloat(value.replace(/^[^\d-]+/, '').replace(/,/g, ''));
}
```

## 驗證整合

控制項會顯示驗證狀態，但不執行驗證。驗證發生在表單結構定義中：你的控制項從 FormField 指令接收 `invalid()` 與 `errors()` 訊號並顯示出來（如上方的 StatefulInput 範例所示）。

FormField 指令也會傳入驗證限制的值，如 `required`、`min`、`max`、`minLength`、`maxLength` 與 `pattern`。你的控制項可以利用這些值強化 UI：

```ts
export class NumberInput implements FormValueControl<number> {
  value = model<number>(0);

  // Constraint values from schema validation rules
  required = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
}
```

當你把 `min()` 與 `max()` 驗證規則加入結構定義時，FormField 指令會把這些值傳給你的控制項。用它們來套用 HTML5 屬性，或在範本中顯示限制提示。

IMPORTANT: 不要在控制項中實作驗證邏輯。把驗證規則定義在表單結構定義中，讓控制項顯示結果就好：

```ts {avoid}
// Avoid: Validation in control
export class BadControl implements FormValueControl<string> {
  value = model<string>('');
  isValid() {
    return this.value().length >= 8;
  } // Don't do this!
}
```

```ts {prefer}
// Good: Validation in schema, control displays results
accountForm = form(this.accountModel, (schemaPath) => {
  minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
});
```

## 下一步

本指南說明了如何建立與 Signal Forms 整合的自訂控制項。相關指南探討了 Signal Forms 的其他面向：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="表單模型" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
