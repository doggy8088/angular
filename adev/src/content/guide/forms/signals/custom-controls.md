# 自訂控制項

NOTE: 本指南假設你已熟悉 [Signal Forms 基礎](essentials/signal-forms)。

瀏覽器內建的表單控制項（如 input、select、textarea）可以處理常見情況，但應用程式常需要專門的輸入方式。附月曆 UI 的日期選擇器、附格式工具列的富文字編輯器，或附自動完成的標籤選擇器，都需要自訂實作。

Signal Forms 能與任何實作了特定介面的元件搭配運作。**控制項介面**定義了讓你的元件能與表單系統溝通的屬性與訊號。元件只要實作其中一個介面，`[formField]` 指令就會自動把你的控制項連接到表單狀態、驗證與資料綁定。

HELPFUL: 自訂 Signal Form 控制項[可以與](guide/forms/signals/migration#custom-controls) Signal、Reactive 與 Template-Driven Forms 搭配使用，不需要任何額外的相容程式碼。

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
| `dirty`   | 使用者是否修改過值，即使後來又改回來也算         |

#### 驗證狀態

向使用者顯示驗證回饋：

| 屬性      | 用途                     |
| --------- | ------------------------ |
| `errors`  | 目前驗證錯誤的陣列       |
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

NOTE: `disabledReasons` 是 `DisabledReason` 物件的陣列。每個物件都有一個 `fieldTree` 屬性（參照到欄位樹）與一個可選的 `message` 屬性。透過 `reason.message` 存取訊息。

#### 驗證限制

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

### FormField 指令的運作方式

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

## 加入狀態訊號

上面的最小控制項可以運作，但不會回應表單狀態。你可以加入可選的輸入訊號，讓你的控制項能對停用狀態做出反應、顯示驗證錯誤，並追蹤使用者互動。

以下是一個實作了常見狀態屬性的完整範例：

```angular-ts
import {Component, model, input, output, ChangeDetectionStrategy} from '@angular/core';
import {
  FormValueControl,
  WithOptionalFieldTree,
  ValidationError,
  DisabledReason,
} from '@angular/forms/signals';

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
          (blur)="touch.emit()"
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
})
export class StatefulInput implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = input<boolean>(false);
  touch = output<void>();

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
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

### 搭配 `debounce('blur')`

[`debounce('blur')`](api/forms/signals/debounce) 規則會把從 UI 到表單模型的更新延後到欄位失去焦點為止，而不是每次按鍵就套用。內建控制項會自動向表單回報 blur。 自訂控制項只有在回應原生 [`blur` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) 時發射 `touch` 輸出，才算參與其中：

```angular-ts
import {Component, model, output} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-custom-input',
  template: `
    <input
      type="text"
      [value]="value()"
      (input)="value.set($event.target.value)"
      (blur)="touch.emit()"
    />
  `,
})
export class CustomInput implements FormValueControl<string> {
  value = model('');
  touch = output<void>();
}
```

有了 `touch` 輸出，`debounce('blur')` 在你的控制項上的行為就與內建輸入相同：

```angular-ts
import {Component, signal} from '@angular/core';
import {debounce, form, FormField} from '@angular/forms/signals';
import {CustomInput} from './custom-input';

@Component({
  selector: 'app-root',
  imports: [CustomInput, FormField],
  template: `<app-custom-input [formField]="userForm.name" />`,
})
export class App {
  userModel = signal({name: ''});

  userForm = form(this.userModel, (schemaPath) => {
    debounce(schemaPath.name, 'blur');
  });
}
```

IMPORTANT: 要在 `blur`（焦點離開控制項）時發射 `touch`，不要在 `focus` 時。控制項若不發射 `touch`，欄位永遠不會被標示為 touched，`debounce('blur')` 也不會把控制項發出的值寫入表單模型。

## 值轉換

控制項顯示的值有時與表單模型儲存的值不同：日期選擇器可能顯示「January 15, 2024」，儲存的卻是「2024-01-15」；貨幣輸入可能顯示「$1,234.56」，儲存的卻是 1234.56。

使用 `transformedValue()`（來自 `@angular/forms/signals`），可以讓 UI 顯示的原始值與模型值保持同步。它接收控制項的 `value` 模型訊號，加上一個 `parse` 函式與一個 `format` 函式，回傳一個存放原始值的可寫入訊號：

- `format` 把模型值轉換成範本要呈現的原始值。
- `parse` 把使用者輸入的內容轉換回模型值，也可以改回報剖析錯誤。

```angular-ts
import {Component, model} from '@angular/core';
import {FormValueControl, transformedValue} from '@angular/forms/signals';

@Component({
  selector: 'number-input',
  template: `
    <input type="text" [value]="rawValue()" (input)="rawValue.set($event.target.value)" />
  `,
})
export class NumberInput implements FormValueControl<number | null> {
  readonly value = model.required<number | null>();

  protected readonly rawValue = transformedValue(this.value, {
    parse: (val: string): {value: number | null} => ({value: val ? Number(val) : null}),
    format: (val: number | null): string => val?.toString() ?? '',
  });
}
```

寫入回傳的訊號（`rawValue.set(...)`）會執行 `parse`，並把結果寫入 `value`。每當模型從其他地方改變 — 可能是 `reset()`、結構定義規則，或應用程式的其他部分 — `format` 會再次執行，原始值隨之更新以保持一致。

### 回報剖析錯誤

有時原始值沒有有效的模型表示法：打到一半的日期，或數字欄位中的英文字母。上面的 `NumberInput` 就有這個問題：`Number('abc')` 是 `NaN`，而 `parse` 會毫不遲疑地把它寫入模型。

這時改回傳 `{error}`：

```ts
export class NumberInput implements FormValueControl<number | null> {
  readonly value = model.required<number | null>();

  protected readonly rawValue = transformedValue(this.value, {
    parse: (val) => {
      const parsed = val ? Number(val) : null;

      return Number.isNaN(parsed)
        ? {error: {kind: 'parse', message: `${val} is not a number`}}
        : {value: parsed};
    },
    format: (val) => val?.toString() ?? '',
  });
}
```

當你想更新模型「同時」標示問題時，就同時回傳 `value` 與 `error`。

控制項以 `[formField]` 綁定時，剖析錯誤會自動回報給欄位，因此會與驗證錯誤一起出現在欄位的 `errors()` 訊號中：

```angular-ts
@Component({
  imports: [NumberInput, FormField],
  template: `
    <number-input [formField]="orderForm.amount" />

    @for (error of orderForm.amount().errors(); track $index) {
      <!-- {kind: 'parse', message: '...'} is reported here too -->
      <p class="error">{{ error.message }}</p>
    }
  `,
})
export class Order {
  orderModel = signal<{amount: number | null}>({amount: null});
  orderForm = form(this.orderModel);
}
```

有剖析錯誤的欄位即為無效，會像未通過驗證規則一樣阻擋送出。

HELPFUL: Signal Forms 對原生輸入也使用同一套機制。當瀏覽器無法剖析某個值時（例如在 `<input type="date">` 中打到一半的日期），它會以欄位上的 `parse` 錯誤形式呈現。詳見[原生 HTML 驗證](guide/forms/signals/validation#native-html-validation)。

### 重設

在欄位上呼叫 `reset()` 會清除所有待處理的剖析錯誤，並從模型重新格式化原始值，讓停留在無法剖析狀態的控制項回到乾淨的顯示值：

```ts
orderForm.amount().reset();
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

## 讓控制項可重複使用

自訂控制項對驗證常帶有隱含的預期。email 輸入在每個使用它的表單中都需要 `required` 與 `email` 規則。不要仰賴每位使用者重新宣告這些規則，你可以把一個配套的結構定義與控制項打包在一起，從同一個模組同時匯出兩者：

```ts {header: 'email-input.ts'}
import {schema, required, email} from '@angular/forms/signals';

export const emailFieldSchema = schema<string>((path) => {
  required(path, {message: 'Email is required'});
  email(path, {message: 'Enter a valid email address'});
});
```

使用者匯入這個配套結構定義，再用 `apply()` 把它組合進自己的表單：

```ts {header: 'registration.ts'}
import {form, apply} from '@angular/forms/signals';
import {emailFieldSchema} from './email-input';

registrationForm = form(this.registrationModel, (path) => {
  apply(path.email, emailFieldSchema);
});
```

`apply()` 會把配套結構定義的規則合併到父表單的指定路徑。使用者仍然可以在同一欄位加入更多規則，因為 `apply()` 是與其他規則組合，而不是取代它們。`schema()`、`apply()` 以及用 `applyWhen()` 做條件式組合的完整說明，請見[結構定義指南](guide/forms/signals/schemas)。

### 設計考量

使用者的模型必須為每個欄位初始化一個已定義的值。在 Signal Forms 中，`undefined` 表示欄位不存在，而不是空值。對可重複使用的 email 控制項來說，這表示使用者應該用 `''` 作為初始值，不要讓屬性保持未定義。選擇初始值的細節請見[表單模型指南](guide/forms/signals/models)。

此外，控制項不應為狀態管理註冊自己的 effect。表單系統透過內部 effect 管理欄位狀態，也就是說，你的控制項是透過輸入訊號接收狀態更新。若控制項需要轉換值，請用「[值轉換](#value-transformation)」一節所示的 `transformedValue()`，而不是 `effect()`。

## 下一步

本指南說明了如何建立與 Signal Forms 整合的自訂控制項。相關指南探討了 Signal Forms 的其他面向：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="表單模型" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
