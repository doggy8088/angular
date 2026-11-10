# 驗證

表單需要驗證，才能確保使用者在提交前提供正確、完整的資料。若沒有驗證，你就必須在伺服器上處理資料品質問題、用不清楚的錯誤訊息提供糟糕的使用者體驗，並手動檢查每一個限制條件。

訊號表單提供以結構定義為基礎的驗證方式。驗證規則透過結構定義函式綁定到欄位，在值變更時自動執行，並透過欄位狀態訊號公開錯誤。這實現了反應式驗證，會隨著使用者與表單互動而更新。

<docs-code-multifile preview hideCode path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.css"/>
</docs-code-multifile>

## 驗證基礎 {#validation-basics}

訊號表單的驗證是透過傳給 `form()` 的第二個引數——結構定義函式——來定義的。

### 結構定義函式 {#the-schema-function}

結構定義函式會收到一個 `SchemaPathTree` 物件，讓你定義驗證規則：

<docs-code
  header="app.ts"
  path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"
  visibleLines="[21,22,23,24,25,26,27]"
  highlight="[23,24,26]"
/>

結構定義函式在表單初始化期間執行一次。驗證規則使用結構定義路徑參數（例如 `schemaPath.email`、`schemaPath.password`）綁定到欄位，每當欄位值變更時，驗證就會自動執行。

NOTE: 結構定義回呼參數（在這些範例中是 `schemaPath`）是一個 `SchemaPathTree` 物件，提供表單中所有欄位的路徑。你可以自由命名這個參數。

### 驗證的運作方式

訊號表單的驗證遵循以下模式：

1. **在結構定義中定義驗證規則**：在結構定義函式中將驗證規則綁定到欄位
2. **自動執行**：欄位值變更時執行驗證規則
3. **錯誤傳播**：驗證錯誤透過欄位狀態訊號公開
4. **反應式更新**：驗證狀態變更時，UI 自動更新

互動式欄位每次值變更時都會執行驗證。隱藏與停用欄位不會執行驗證——在欄位恢復為互動式之前，它們的驗證規則會被跳過。

### 驗證時機

驗證規則依以下順序執行：

1. **同步驗證**：值變更時，所有同步驗證規則都會執行
2. **非同步驗證**：非同步驗證規則只在所有同步驗證規則都通過後才執行
3. **欄位狀態更新**：`valid()`、`invalid()`、`errors()` 與 `pending()` 訊號隨之更新

同步驗證規則（例如 `required()`、`email()`）會立即完成。非同步驗證規則（例如 `validateHttp()`）可能需要一些時間，並在執行期間將 `pending()` 訊號設為 `true`。

所有驗證規則在每次變更時都會執行——驗證不會在第一個錯誤後短路停止。如果欄位同時有 `required()` 與 `email()` 驗證規則，兩者都會執行，而且可以同時產生錯誤。

## 內建驗證規則

訊號表單為常見的驗證情境提供驗證規則。所有內建驗證規則都接受一個選項物件，用於自訂錯誤訊息與條件邏輯。

### required()

`required()` 驗證規則確保欄位有值：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>

      <label>
        Email
        <input type="email" [formField]="registrationForm.email" />
      </label>

      <button type="submit">Register</button>
    </form>
  `,
})
export class RegistrationComponent {
  registrationModel = signal({
    username: '',
    email: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
    required(schemaPath.email, {message: 'Email is required'});
  });
}
```

當欄位符合下列條件時，該欄位被視為「空」：

| 條件                 | 範例    |
| -------------------- | ------- |
| 值為 `null`          | `null`, |
| 值為空字串           | `''`    |

對於條件式必填，請使用 `when` 選項：

```ts
registrationForm = form(this.registrationModel, (schemaPath) => {
  required(schemaPath.promoCode, {
    message: 'Promo code is required for discounts',
    when: ({valueOf}) => valueOf(schemaPath.applyDiscount),
  });
});
```

驗證規則只在 `when` 函式傳回 `true` 時執行。

NOTE: `required` 對空陣列會回傳 `true`。若要驗證陣列，請使用 [`minLength()`](#minlength-and-maxlength)。

### email()

`email()` 驗證規則檢查電子郵件格式是否有效：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Your Email
        <input type="email" [formField]="contactForm.email" />
      </label>
    </form>
  `,
})
export class ContactComponent {
  contactModel = signal({email: ''});

  contactForm = form(this.contactModel, (schemaPath) => {
    email(schemaPath.email, {message: 'Please enter a valid email address'});
  });
}
```

`email()` 驗證規則使用標準的電子郵件格式正規表示式。它接受像 `user@example.com` 這樣的地址，但會拒絕像 `user@` 或 `@example.com` 這樣格式錯誤的地址。

### min() 與 max() {#min-and-max}

`min()` 與 `max()` 驗證規則處理數值：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Age
        <input type="number" [formField]="ageForm.age" />
      </label>

      <label>
        Rating (1-5)
        <input type="number" [formField]="ageForm.rating" />
      </label>
    </form>
  `,
})
export class AgeFormComponent {
  ageModel = signal({
    age: 0,
    rating: 0,
  });

  ageForm = form(this.ageModel, (schemaPath) => {
    min(schemaPath.age, 18, {message: 'You must be at least 18 years old'});
    max(schemaPath.age, 120, {message: 'Please enter a valid age'});

    min(schemaPath.rating, 1, {message: 'Rating must be at least 1'});
    max(schemaPath.rating, 5, {message: 'Rating cannot exceed 5'});
  });
}
```

你可以使用計算值作為動態限制：

```ts
ageForm = form(this.ageModel, (schemaPath) => {
  min(schemaPath.participants, () => this.minimumRequired(), {
    message: 'Not enough participants',
  });
});
```

### minLength() 與 maxLength() {#minlength-and-maxlength}

`minLength()` 與 `maxLength()` 驗證規則處理字串與陣列：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, minLength, maxLength} from '@angular/forms/signals';

@Component({
  selector: 'app-password-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Bio
        <textarea [formField]="passwordForm.bio"></textarea>
      </label>
    </form>
  `,
})
export class PasswordFormComponent {
  passwordModel = signal({
    password: '',
    bio: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
    maxLength(schemaPath.password, 100, {message: 'Password is too long'});

    maxLength(schemaPath.bio, 500, {message: 'Bio cannot exceed 500 characters'});
  });
}
```

對字串而言，「長度」指的是字元數；對陣列而言，「長度」指的是元素數量。

### pattern()

`pattern()` 驗證規則使用正規表示式進行驗證：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-phone-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Phone Number
        <input [formField]="phoneForm.phone" placeholder="555-123-4567" />
      </label>

      <label>
        Postal Code
        <input [formField]="phoneForm.postalCode" placeholder="12345" />
      </label>
    </form>
  `,
})
export class PhoneFormComponent {
  phoneModel = signal({
    phone: '',
    postalCode: '',
  });

  phoneForm = form(this.phoneModel, (schemaPath) => {
    pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, {
      message: 'Phone must be in format: 555-123-4567',
    });

    pattern(schemaPath.postalCode, /^\d{5}$/, {
      message: 'Postal code must be 5 digits',
    });
  });
}
```

常見的模式：

| 模式類型         | 正規表示式              | 範例         |
| ---------------- | ----------------------- | ------------ |
| 電話             | `/^\d{3}-\d{3}-\d{4}$/` | 555-123-4567 |
| 郵遞區號（美國） | `/^\d{5}$/`             | 12345        |
| 英數字           | `/^[a-zA-Z0-9]+$/`      | abc123       |
| URL 安全字元     | `/^[a-zA-Z0-9_-]+$/`    | my-url_123   |

## 陣列項目的驗證

表單可以包含巢狀物件陣列（例如訂單項目清單）。若要對陣列中的每個項目套用驗證規則，請在結構定義函式中使用 `applyEach()`。`applyEach()` 會逐一走訪陣列路徑，並為每個項目提供一個路徑，讓你可以像套用在頂層欄位一樣套用驗證器。

```ts
import {Component, signal} from '@angular/core';
import {applyEach, FormField, form, min, required, SchemaPathTree} from '@angular/forms/signals';

type Item = {name: string; quantity: number};

interface Order {
  title: string;
  description: string;
  items: Item[];
}

function ItemSchema(item: SchemaPathTree<Item>) {
  required(item.name, {message: 'Item name is required'});
  min(item.quantity, 1, {message: 'Quantity must be at least 1'});
}

@Component(/* ... */)
export class OrderComponent {
  orderModel = signal<Order>({
    title: '',
    description: '',
    items: [{name: '', quantity: 0}],
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    required(schemaPath.title);
    required(schemaPath.description);

    applyEach(schemaPath.items, ItemSchema);
  });
}
```

## 驗證錯誤 {#validation-errors}

當驗證規則失敗時，它們會產生描述問題所在的錯誤物件。了解錯誤結構有助於你向使用者提供清楚的回饋。

<!-- TODO: Uncomment when field state management guide is published

NOTE: This section covers the errors that validation rules produce. For displaying and using validation errors in your UI, see the [Field State Management guide](guide/forms/signals/field-state-management). -->

### 錯誤結構

每個驗證錯誤物件都包含以下屬性：

| 屬性      | 說明                                                               |
| --------- | ------------------------------------------------------------------ |
| `kind`    | 失敗的驗證規則（例如 "required"、"email"、"minLength"）            |
| `message` | 選擇性的人類可讀錯誤訊息                                           |

內建驗證規則會自動設定 `kind` 屬性。`message` 屬性是選擇性的——你可以透過驗證規則選項提供自訂訊息。

### 自訂錯誤訊息

所有內建驗證規則都接受 `message` 選項，用於自訂錯誤文字：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="signupForm.username" />
      </label>

      <label>
        Password
        <input type="password" [formField]="signupForm.password" />
      </label>
    </form>
  `,
})
export class SignupComponent {
  signupModel = signal({
    username: '',
    password: '',
  });

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'Please choose a username',
    });

    required(schemaPath.password, {
      message: 'Password cannot be empty',
    });
    minLength(schemaPath.password, 12, {
      message: 'Password must be at least 12 characters for security',
    });
  });
}
```

自訂訊息應清楚、具體，並告訴使用者如何修正問題。不要使用 "Invalid input"，而應使用 "Password must be at least 12 characters for security"。

### 每個欄位的多個錯誤

當欄位有多條驗證規則時，每條驗證規則都會獨立執行，並可能產生一個錯誤：

```ts
signupForm = form(this.signupModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});
  minLength(schemaPath.email, 5, {message: 'Email is too short'});
});
```

如果電子郵件欄位是空的，只會出現 `required()` 錯誤。如果使用者輸入 "a@b"，`email()` 與 `minLength()` 錯誤會同時出現。所有驗證規則都會執行——驗證不會在第一個失敗後停止。

TIP: 在範本中使用 `touched() && invalid()` 模式，可避免錯誤在使用者與欄位互動之前就出現。如需顯示驗證錯誤的完整指引，請參閱[欄位狀態管理指南](guide/forms/signals/field-state-management#conditional-error-display)。

## 自訂驗證規則

內建驗證規則能處理常見情況，但你經常會需要自訂驗證邏輯，用於業務規則、複雜格式或特定領域的限制。

### 使用 validate() {#using-validate}

`validate()` 函式用來建立自訂驗證規則。它接收一個驗證器函式，該函式存取欄位上下文並傳回：

| 傳回值                | 意義         |
| --------------------- | ------------ |
| 錯誤物件              | 值無效       |
| `null` 或 `undefined` | 值有效       |

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-url-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Website URL
        <input [formField]="urlForm.website" />
      </label>
    </form>
  `,
})
export class UrlFormComponent {
  urlModel = signal({website: ''});

  urlForm = form(this.urlModel, (schemaPath) => {
    validate(schemaPath.website, ({value}) => {
      if (!value().startsWith('https://')) {
        return {
          kind: 'https',
          message: 'URL must start with https://',
        };
      }

      return null;
    });
  });
}
```

驗證器函式會收到一個 `FieldContext` 物件，其中包含：

| 屬性            | 型別       | 說明                             |
| --------------- | ---------- | -------------------------------- |
| `value`         | Signal     | 包含目前欄位值的訊號             |
| `state`         | FieldState | 欄位狀態參照                     |
| `field`         | FieldTree  | 欄位樹參照                       |
| `valueOf()`     | Method     | 依路徑取得另一個欄位的值         |
| `stateOf()`     | Method     | 依路徑取得另一個欄位的狀態       |
| `fieldTreeOf()` | Method     | 依路徑取得另一個欄位的欄位樹     |
| `pathKeys`      | Signal     | 從根到目前欄位的路徑鍵           |

NOTE: 子欄位也有 `key` 訊號，陣列項目欄位則同時有 `key` 與 `index` 訊號。

驗證失敗時，傳回包含 `kind` 與 `message` 的錯誤物件；驗證通過時，傳回 `null` 或 `undefined`。

### 使用 validateTree() {#using-validatetree}

`validateTree()` 函式用來建立自訂驗證規則，可以鎖定多個欄位，或為整個子樹提供複雜的驗證邏輯。

```angular-ts
import {Component, model} from '@angular/core';
import {form, FormField, validateTree} from '@angular/forms/signals';

interface User {
  firstName: string;
  lastName: string;
}

@Component({
  /* ... */
})
export class UserFormComponent {
  readonly userModel = model<DTO>({
    firstName: '',
    lastName: '',
  });

  userForm = form(this.userModel, (path) => {
    validateTree(path, (ctx) => {
      if (ctx.valueOf(path.firstName).length < 5) {
        return {
          kind: 'minLength5',
          message: 'First name must be at least 5 characters',
          fieldTree: ctx.fieldTree.lastName,
        };
      }

      return null;
    });
  });
}
```

`validateTree()` 的驗證器函式會收到與 `validate()` 相同的 `FieldContext` 物件。

### 可重複使用的驗證規則

將 `validate()` 包裝起來，即可建立可重複使用的驗證規則函式：

```ts
function url(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    try {
      new URL(value());
      return null;
    } catch {
      return {
        kind: 'url',
        message: options?.message || 'Enter a valid URL',
      };
    }
  });
}

function phoneNumber(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (!phoneRegex.test(value())) {
      return {
        kind: 'phoneNumber',
        message: options?.message || 'Phone must be in format: 555-123-4567',
      };
    }

    return null;
  });
}
```

你可以像使用內建驗證規則一樣使用自訂驗證規則：

```ts
urlForm = form(this.urlModel, (schemaPath) => {
  url(schemaPath.website, {message: 'Please enter a valid website URL'});
  phoneNumber(schemaPath.phone);
});
```

## 跨欄位驗證

跨欄位驗證會比較或關聯多個欄位的值。

跨欄位驗證的常見情境是密碼確認：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-password-change',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        New Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Confirm Password
        <input type="password" [formField]="passwordForm.confirmPassword" />
      </label>

      <button type="submit">Change Password</button>
    </form>
  `,
})
export class PasswordChangeComponent {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, {message: 'Password is required'});
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});

    required(schemaPath.confirmPassword, {message: 'Please confirm your password'});

    validate(schemaPath.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);

      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }

      return null;
    });
  });
}
```

確認驗證規則使用 `valueOf(schemaPath.password)` 存取密碼欄位的值，並將它與確認值比較。這條驗證規則會以反應式方式執行——只要任一密碼變更，驗證就會自動重新執行。

## 非同步驗證 {#async-validation}

非同步驗證處理需要外部資料來源的驗證，例如在伺服器上檢查使用者名稱是否可用，或對照 API 進行驗證。

### 使用 validateHttp()

`validateHttp()` 函式執行以 HTTP 為基礎的驗證：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, validateHttp} from '@angular/forms/signals';

@Component({
  selector: 'app-username-form',|
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="usernameForm.username" />

        @if (usernameForm.username().pending()) {
          <span class="checking">Checking availability...</span>
        }
      </label>
    </form>
  `,
})
export class UsernameFormComponent {
  usernameModel = signal({username: ''});

  usernameForm = form(this.usernameModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});

    validateHttp(schemaPath.username, {
      request: ({value}) => `/api/check-username?username=${value()}`,
      onSuccess: (response: any) => {
        if (response.taken) {
          return {
            kind: 'usernameTaken',
            message: 'Username is already taken',
          };
        }
        return null;
      },
      onError: (error) => ({
        kind: 'networkError',
        message: 'Could not verify username availability',
      }),
    });
  });
}
```

`validateHttp()` 驗證規則會：

1. 呼叫 `request` 函式傳回的 URL 或請求
2. 使用 `onSuccess` 將成功回應對應為驗證錯誤或 `null`
3. 使用 `onError` 處理請求失敗（網路錯誤、HTTP 錯誤）
4. 在請求進行期間將 `pending()` 設為 `true`
5. 只在所有同步驗證規則都通過後才執行

### 待處理狀態

非同步驗證執行期間，欄位的 `pending()` 訊號會傳回 `true`。你可以使用它來顯示載入指示器：

```angular-html
@if (form.username().pending()) {
  <span class="spinner">Checking...</span>
}
```

`valid()` 訊號在驗證待處理期間會傳回 `false`，即使目前還沒有錯誤。`invalid()` 訊號則只在存在錯誤時才傳回 `true`。

## 與結構定義驗證程式庫整合 {#integration-with-schema-validation-libraries}

訊號表單內建支援符合 [Standard Schema](https://standardschema.dev/) 的程式庫，例如 [Zod](https://zod.dev/) 或 [Valibot](https://valibot.dev/)。這項整合透過 `validateStandardSchema` 函式提供。它讓你可以使用既有的結構定義，同時保有訊號表單反應式驗證的好處。

```ts
import {form, validateStandardSchema} from '@angular/forms/signals';
import * as z from 'zod';

// Define your schema
const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// Use with Signal Forms
const userForm = form(signal({email: '', password: ''}), (schemaPath) => {
  validateStandardSchema(schemaPath, userSchema);
});
```

### 動態結構定義

你可以傳入訊號而不是靜態結構定義，讓驗證結構定義在其相依性變更時自動更新。

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, FormField, validateStandardSchema} from '@angular/forms/signals';
import z from 'zod';

@Component({
  /* ... */
})
export class DynamicSchema {
  model = signal({document: '', type: 'dni'});

  // Schema reacts automatically to type changes
  schema = computed(() =>
    z.object({
      document:
        this.model().type === 'dni'
          ? z.string().length(8, 'DNI must be 8 digits')
          : z.string().min(12, 'Passport must be at least 12 characters'),
    }),
  );

  f = form(this.model, (p) => validateStandardSchema(p, () => this.schema()));
}
```

## 後續步驟

本指南介紹了驗證規則的建立與套用。以下是探討訊號表單其他面向的相關指南：

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/models" title="表單模型" />
  <docs-pill href="guide/forms/signals/custom-controls" title="自訂控制項" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
