# 欄位狀態管理

Signal Forms 的欄位狀態讓你能回應使用者的互動，它提供了驗證狀態（如 `valid`、`invalid`、`errors`）、互動追蹤（如 `touched`、`dirty`）與可用性（如 `disabled`、`hidden`）的反應式訊號。

## 了解欄位狀態

當你用 [`form()`](api/forms/signals/form) 函式建立表單時，它會回傳一棵**欄位樹**——一種映照你表單模型的物件結構。樹中的每個欄位都能用點記法存取（例如 [`form.email`](api/forms/signals/FieldTree)）。

### 存取欄位狀態

當你把欄位樹中的任何欄位當作函式呼叫時（例如 [`form.email()`](api/forms/signals/FieldState)），它會回傳一個 `FieldState` 物件，其中包含追蹤該欄位驗證、互動與可用性狀態的反應式訊號。例如，`invalid()` 訊號會告訴你該欄位是否有驗證錯誤：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <input type="email" [formField]="registrationForm.email" />

    @if (registrationForm.email().invalid()) {
      <p class="error">Email has validation errors:</p>
      <ul>
        @for (error of registrationForm.email().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  `,
})
export class Registration {
  registrationModel = signal({
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

在這個範例中，範本會檢查 `registrationForm.email().invalid()`，決定是否顯示錯誤訊息。

### 欄位狀態訊號

最常用的訊號是 `value()`，它是一個 `WritableSignal`，提供對欄位目前值的存取：

```ts
const emailValue = registrationForm.email().value();
console.log(emailValue); // Current email string
```

除了 `value()` 之外，欄位狀態還包含驗證、互動追蹤與可用性控制的訊號：

| 類別                                    | 訊號         | 說明                                                                      |
| --------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| **[驗證](#validation-state)**           | `valid()`    | 欄位通過所有驗證規則，且沒有尚待處理的驗證器                              |
|                                         | `invalid()`  | 欄位有驗證錯誤                                                            |
|                                         | `errors()`   | 驗證錯誤物件的陣列                                                        |
|                                         | `pending()`  | 非同步驗證進行中                                                          |
| **[互動](#interaction-state)**          | `touched()`  | 使用者已聚焦並離開該欄位（若為可互動欄位）                                |
|                                         | `dirty()`    | 使用者已修改該欄位（若為可互動欄位），即使值與初始狀態相同                |
| **[可用性](#availability-state)**       | `disabled()` | 欄位已停用，不影響父表單狀態                                              |
|                                         | `hidden()`   | 表示欄位應被隱藏；在範本中用 `@if` 控制可見性                             |
|                                         | `readonly()` | 欄位為唯讀，不影響父表單狀態                                              |

這些訊號讓你能建立會回應使用者行為的反應式表單使用體驗。以下各節將詳細探討每個類別。

## 驗證狀態 {#validation-state}

驗證狀態訊號會告訴你欄位是否有效，以及它包含哪些錯誤。

NOTE: 本指南聚焦的是在範本與邏輯中使用驗證狀態（例如讀取 `valid()`、`invalid()`、`errors()` 來顯示回饋）。若要了解如何定義驗證規則與建立自訂驗證器，請參閱[驗證指南](guide/forms/signals/validation)。

### 檢查有效性

使用 `valid()` 與 `invalid()` 檢查驗證狀態：

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().invalid()) {
      <p class="error">Email is invalid</p>
    }
    @if (loginForm.email().valid()) {
      <p class="success">Email looks good</p>
    }
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

| 訊號        | 在下列情況回傳 `true`                       |
| ----------- | ------------------------------------------- |
| `valid()`   | 欄位通過所有驗證規則，且沒有尚待處理的驗證器 |
| `invalid()` | 欄位有驗證錯誤                              |

在程式碼中檢查有效性時，若你想區分「有錯誤」與「驗證尚待處理」，請用 `invalid()` 而不是 `!valid()`。原因是：當非同步驗證尚待處理時，`valid()` 與 `invalid()` 可能同時為 `false`——因為驗證尚未完成，欄位還不算有效；同時也還沒找到錯誤，所以也不算無效。

### 讀取驗證錯誤

用 `errors()` 存取驗證錯誤陣列，或用 `getError()` 存取單一錯誤。每個錯誤物件包含：

| 屬性        | 說明                                           |
| ----------- | ---------------------------------------------- |
| `kind`      | 失敗的驗證規則（例如「required」或「email」）   |
| `message`   | 可選的人類可讀錯誤訊息                         |
| `fieldTree` | 發生錯誤的 `FieldTree` 參照                    |

NOTE: `message` 屬性是可選的。驗證器可以提供自訂錯誤訊息，但若未指定，你可能需要把錯誤的 `kind` 值對應到你自己的訊息。

以下範例示範如何用驗證錯誤陣列，在範本中顯示錯誤：

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().errors().length > 0) {
      <div class="errors">
        @for (error of loginForm.email().errors(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `
})
```

這種方式會走訪欄位的所有錯誤，把每則錯誤訊息顯示給使用者。

以下範例示範如何用 `getError()` 在範本中顯示錯誤：

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().getError('required'); as error) {
      <div class="errors">
        <p>{{ error.message }}</p>
      </div>
    }
  `
})
```

`getError()` 接受任何字串作為錯誤的 `kind`，並能辨識內建的驗證錯誤種類（例如「required」、「email」、「minLength」）。

### 尚待處理的驗證

`pending()` 訊號表示非同步驗證正在進行中：

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="signupForm.email" />

    @if (signupForm.email().pending()) {
      <p>Checking if email is available...</p>
    }

    @if (signupForm.email().invalid() && !signupForm.email().pending()) {
      <p>Email is already taken</p>
    }
  `
})
```

這個訊號讓你能在非同步驗證執行期間顯示載入狀態。

## 互動狀態 {#interaction-state}

互動狀態會追蹤使用者是否與欄位互動過，支援像是「只在使用者碰過欄位後才顯示錯誤」這類模式。

### 已觸碰狀態

`touched()` 訊號追蹤使用者是否已聚焦並離開某個欄位，或該欄位是否被以程式化方式標記為已觸碰。只有可互動的欄位能變成已觸碰；隱藏、停用與唯讀欄位不會因使用者互動或 `markAsTouched()` 而變成已觸碰。

當你需要某個區塊層級的動作來揭露該區塊內的驗證錯誤時，請對區塊欄位呼叫 `markAsTouched()`。`skipDescendants` 的預設值是 `false`，因此這次呼叫會把區塊欄位與每個子孫欄位都標記為已觸碰。

例如，結帳流程可以在讓使用者繼續到下一步之前，先驗證運送區塊：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-checkout-shipping',
  imports: [FormField],
  template: `
    <label>
      Name
      <input [formField]="checkoutForm.shipping.name" />
    </label>
    @if (checkoutForm.shipping.name().touched() && checkoutForm.shipping.name().invalid()) {
      <p>{{ checkoutForm.shipping.name().errors()[0].message }}</p>
    }

    <label>
      Address
      <input [formField]="checkoutForm.shipping.address" />
    </label>
    @if (checkoutForm.shipping.address().touched() && checkoutForm.shipping.address().invalid()) {
      <p>{{ checkoutForm.shipping.address().errors()[0].message }}</p>
    }

    <button type="button" (click)="continueToPayment()">Continue</button>

    @if (showPayment() && checkoutForm.shipping().valid()) {
      <p>Ready for payment.</p>
    }
  `,
})
export class CheckoutShipping {
  checkoutModel = signal({
    shipping: {
      name: '',
      address: '',
    },
  });

  showPayment = signal(false);

  checkoutForm = form(this.checkoutModel, (schemaPath) => {
    required(schemaPath.shipping.name, {message: 'Enter a name'});
    required(schemaPath.shipping.address, {message: 'Enter an address'});
  });

  continueToPayment() {
    this.checkoutForm.shipping().markAsTouched();

    if (this.checkoutForm.shipping().invalid()) {
      return;
    }

    this.showPayment.set(true);
  }
}
```

當 `continueToPayment()` 對 `checkoutForm.shipping()` 呼叫 `markAsTouched()` 時，它用的是預設的 `skipDescendants: false` 行為。Angular 會把 `shipping`、`shipping.name` 與 `shipping.address` 標記為已觸碰，因此在整份表單送出之前，子欄位的 `touched() && invalid()` 錯誤訊息就會變成可見。

NOTE: 只有當承接呼叫的欄位應該變成已觸碰、又不想改變其子孫欄位的已觸碰狀態時，才傳入 `{skipDescendants: true}`。

### 已變更狀態

表單常常需要偵測資料是否真的變過——例如提醒使用者有未儲存的變更，或只在必要時才啟用儲存按鈕。`dirty()` 訊號會追蹤使用者是否修改過欄位。

當使用者修改可互動欄位的值時，`dirty()` 訊號會變成 `true`，而且即使值被改回與初始值相同，仍維持 `true`：

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="profileForm.name" />
      <input [formField]="profileForm.bio" />

      @if (profileForm().dirty()) {
        <p class="warning">You have unsaved changes</p>
      }
    </form>
  `,
})
export class Profile {
  profileModel = signal({name: 'Alice', bio: 'Developer'});
  profileForm = form(this.profileModel);
}
```

把 `dirty()` 用在「未儲存的變更」警告上，或只在資料變過時才啟用儲存按鈕。

### 已觸碰與已變更的比較

這些訊號追蹤的是不同種類的互動狀態：

| 訊號        | 何時變成 true                                                                             |
| ----------- | ----------------------------------------------------------------------------------------- |
| `touched()` | 使用者已聚焦並離開可互動欄位，或該欄位被以程式化方式標記為已觸碰                          |
| `dirty()`   | 使用者已修改可互動欄位（即使從未離開該欄位，也即使目前值與初始值相同）                    |

一個欄位可以處於不同的組合狀態：

| 狀態               | 情境                                     |
| ------------------ | ---------------------------------------- |
| 已觸碰但未變更     | 使用者聚焦並離開了欄位，但沒有做任何變更 |
| 既已觸碰又已變更   | 使用者聚焦欄位、變更了值，然後離開欄位   |

NOTE: 隱藏、停用與唯讀欄位是不可互動的——它們不會因使用者互動而變成已觸碰或已變更。

## 可用性狀態 {#availability-state}

可用性狀態訊號控制欄位是否可互動、可編輯或可見。停用、隱藏與唯讀欄位是不可互動的。它們不影響其父表單的有效、已觸碰或已變更狀態。

### 停用的欄位

`disabled()` 訊號表示欄位是否接受使用者輸入。停用的欄位會出現在 UI 中，但使用者無法與之互動。

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  // TIP: The `[formField]` directive automatically binds the `disabled` attribute based
  // on the field's `disabled()` state, so you don't need to manually add `[disabled]="field().disabled()"`
  template: `
    <input [formField]="orderForm.couponCode" />

    @if (orderForm.couponCode().disabled()) {
      <p class="info">Coupon code is only available for orders over $50</p>
    }
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  });
}
```

在這個範例中，我們用 `valueOf(schemaPath.total)` 檢查 `total` 欄位的值，決定 `couponCode` 是否應被停用。

NOTE: 結構定義回呼參數（這些範例中的 `schemaPath`）是一個 `SchemaPathTree` 物件，提供你表單中所有欄位的路徑。你可以任意為這個參數命名。

在定義 `disabled()`、`hidden()` 或 `readonly()` 這類規則時，`when` 函式會收到一個 `FieldContext` 物件，通常會被解構（例如 `({valueOf})`）。驗證規則中常用的兩個方法是：

- `valueOf(schemaPath.otherField)` - 讀取表單中另一個欄位的值
- `value()` - 一個訊號，包含套用該規則的欄位的值

停用的欄位不會對父表單的驗證狀態做出貢獻。即使停用的欄位本身無效，父表單仍然可以有效。`disabled()` 狀態影響的是互動性與驗證，不會改變欄位的值。

### 隱藏的欄位

`hidden()` 訊號表示欄位是否被有條件地隱藏。把 `hidden()` 與 `@if` 搭配使用，依條件顯示或隱藏欄位：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="profileForm.isPublic" />
      Make profile public
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        Public URL
        <input [formField]="profileForm.publicUrl" />
      </label>
    }
  `,
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: '',
  });

  profileForm = form(this.profileModel, (schemaPath) => {
    hidden(schemaPath.publicUrl, {when: ({valueOf}) => !valueOf(schemaPath.isPublic)});
  });
}
```

隱藏的欄位不參與驗證。若必填欄位被隱藏，它不會阻止表單送出。`hidden()` 狀態影響的是可用性與驗證，不會改變欄位的值。

### 唯讀的欄位

`readonly()` 訊號表示欄位是否為唯讀。唯讀欄位會顯示其值，但使用者無法編輯：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-account',
  imports: [FormField],
  template: `
    <label>
      Username (cannot be changed)
      <input [formField]="accountForm.username" />
    </label>

    <label>
      Email
      <input [formField]="accountForm.email" />
    </label>
  `,
})
export class Account {
  accountModel = signal({
    username: 'johndoe',
    email: 'john@example.com',
  });

  accountForm = form(this.accountModel, (schemaPath) => {
    readonly(schemaPath.username);
  });
}
```

NOTE: `[formField]` 指令會依欄位的 `readonly()` 狀態自動繫結 `readonly` 屬性，因此你不需要手動加上 `[readonly]="field().readonly()"`。

與停用及隱藏欄位相同，唯讀欄位也是不可互動的，且不影響父表單狀態。`readonly()` 狀態影響的是可編輯性與驗證，不會改變欄位的值。

### 各自的適用時機

| 狀態         | 適用時機                               | 使用者看得到 | 使用者可互動 | 參與驗證 |
| ------------ | -------------------------------------- | ------------ | ------------ | -------- |
| `disabled()` | 欄位暫時無法使用（例如依其他欄位的值） | 是           | 否           | 否       |
| `hidden()`   | 欄位在目前情境下不相關                 | 否（搭配 @if）| 否           | 否       |
| `readonly()` | 值應該可見但不可編輯                   | 是           | 否           | 否       |

## 表單層級狀態

根表單本身也是欄位樹中的一個欄位。當你把它當作函式呼叫時，它同樣會回傳一個 `FieldState` 物件，彙總所有子欄位的狀態。

### 存取表單狀態

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="loginForm.email" />
      <input [formField]="loginForm.password" />

      <button [disabled]="!loginForm().valid()">Sign In</button>
    </form>
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

在這個範例中，只有當所有子欄位都有效時，表單才有效。這讓你能依整體表單有效性來啟用或停用送出按鈕。

### 表單層級訊號

由於根表單是一個欄位，它擁有相同的訊號（例如 `valid()`、`invalid()`、`touched()`、`dirty()` 等）。

| 訊號        | 表單層級行為                                   |
| ----------- | ---------------------------------------------- |
| `valid()`   | 所有可互動欄位都有效，且沒有尚待處理的驗證器   |
| `invalid()` | 至少一個可互動欄位有驗證錯誤                   |
| `pending()` | 至少一個可互動欄位有尚待處理的非同步驗證       |
| `touched()` | 表單本身，或至少一個可互動的子孫欄位，已被觸碰 |
| `dirty()`   | 使用者已修改至少一個可互動欄位                 |

### 表單層級與欄位層級狀態的適用時機

**表單層級狀態的適用時機**：

- 送出按鈕的啟用／停用狀態
- 「儲存」按鈕的狀態
- 整體表單有效性檢查
- 未儲存變更的警告

**欄位層級狀態的適用時機**：

- 個別欄位的錯誤訊息
- 欄位專屬樣式
- 逐欄位的驗證回饋
- 有條件的欄位可用性

## 狀態傳播

欄位狀態會從子欄位向上，經過父欄位群組，傳播到根表單。

### 子欄位狀態如何影響父表單

當子欄位變成無效時，其父欄位群組會變成無效，根表單也是如此。當子欄位變成已觸碰或已變更時，父欄位群組與根表單會反映這個變化。這種彙總讓你能在任何層級檢查有效性——欄位或整份表單皆可。

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  address: {
    street: '',
    city: '',
  },
});

const userForm = form(userModel);

// If firstName is invalid, profile is invalid
userForm.profile.firstName().invalid() === true;
// → userForm.profile().invalid() === true
// → userForm().invalid() === true
```

### 隱藏、停用與唯讀欄位

隱藏、停用與唯讀欄位是不可互動的，不影響父表單狀態：

```ts
const orderModel = signal({
  customerName: '',
  requiresShipping: false,
  shippingAddress: '',
});

const orderForm = form(orderModel, (schemaPath) => {
  hidden(schemaPath.shippingAddress, {when: ({valueOf}) => !valueOf(schemaPath.requiresShipping)});
});
```

在這個範例中，當 `shippingAddress` 被隱藏時，它不影響表單有效性。因此，即使 `shippingAddress` 是空的且必填，表單仍然可以有效。

這種行為能避免隱藏、停用或唯讀欄位阻擋表單送出，或影響驗證、已觸碰與已變更狀態。

## 在範本中使用狀態

欄位狀態訊號能與 Angular 範本無縫整合，讓你不必手動處理事件，就能實現反應式表單使用體驗。

### 有條件地顯示錯誤 {#conditional-error-display}

只在使用者與欄位互動過後才顯示錯誤：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <label>
      Email
      <input type="email" [formField]="signupForm.email" />
    </label>

    @if (signupForm.email().touched() && signupForm.email().invalid()) {
      <p class="error">{{ signupForm.email().errors()[0].message }}</p>
    }
  `,
})
export class Signup {
  signupModel = signal({email: '', password: ''});

  signupForm = form(this.signupModel, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

這個模式能避免在使用者還沒有機會與欄位互動之前就顯示錯誤。錯誤只會在使用者聚焦後離開欄位時才出現。

### 有條件的欄位可用性

把 `hidden()` 訊號與 `@if` 搭配使用，依條件顯示或隱藏欄位：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="orderForm.requiresShipping" />
      Requires shipping
    </label>

    @if (!orderForm.shippingAddress().hidden()) {
      <label>
        Shipping Address
        <input [formField]="orderForm.shippingAddress" />
      </label>
    }
  `,
})
export class Order {
  orderModel = signal({
    requiresShipping: false,
    shippingAddress: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    hidden(schemaPath.shippingAddress, {
      when: ({valueOf}) => !valueOf(schemaPath.requiresShipping),
    });
  });
}
```

隱藏欄位不參與驗證，因此即使隱藏欄位本身無效，表單仍可送出。

### 追蹤陣列欄位的值

在 Signal Forms 中，走訪一組欄位的 `@for` 區塊，應該依欄位身分來追蹤。

```angular-ts
@Component({
  imports: [FormField],
  template: `
    @for (field of form.emails; track field) {
      <input [formField]="field" />
    }
  `,
})
export class App {
  formModel = signal({emails: ['john.doe@mail.com', 'max.musterman@mail.com']});
  form = form(this.formModel);
}
```

表單系統已經在追蹤陣列中的模型值，並自動為它建立的欄位維持穩定的身分。

當某個項目改變時，即使它的某些屬性看起來相同，它也可能代表一個新的邏輯實體。依身分追蹤能確保框架把它視為不同的項目，而不是重用既有的 UI 元素。這能避免有狀態的元素（如表單輸入）被錯誤地共享，並讓繫結與模型的正確部分保持對齊。

## 在元件邏輯中使用欄位狀態

欄位狀態訊號能與 Angular 的反應式基本工具（如 `computed()` 與 `effect()`）搭配，實現進階的表單邏輯。

### 送出前的驗證檢查

在元件方法中檢查表單有效性：

```ts
export class Registration {
  registrationModel = signal({
    username: '',
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel);

  async onSubmit() {
    // Wait for any pending async validation
    if (this.registrationForm().pending()) {
      console.log('Waiting for validation...');
      return;
    }

    // Guard against invalid submissions
    if (this.registrationForm().invalid()) {
      console.error('Form is invalid');
      return;
    }

    const data = this.registrationModel();
    await this.api.register(data);
  }
}
```

這能確保只有有效且完整驗證過的資料會送到你的 API。

### 用 computed 建立衍生狀態

依欄位狀態建立 computed 訊號，在底層欄位狀態變更時自動更新：

```ts
export class Password {
  passwordModel = signal({password: '', confirmPassword: ''});
  passwordForm = form(this.passwordModel);

  // Compute password strength indicator
  passwordStrength = computed(() => {
    const password = this.passwordForm.password().value();
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  });

  // Check if all required fields are filled
  allFieldsFilled = computed(() => {
    return (
      this.passwordForm.password().value().length > 0 &&
      this.passwordForm.confirmPassword().value().length > 0
    );
  });
}
```

### 以程式化方式變更狀態

欄位狀態通常透過使用者互動（打字、聚焦、離開）更新，但有時你需要在程式中控制它。常見情境包括表單送出與重設表單。

#### 表單送出

Signal Forms 提供了 `FormRoot` 指令，讓表單送出更簡單。它會自動阻止瀏覽器預設的表單送出行為，並在 `<form>` 元素上設定 `novalidate` 屬性。

```angular-ts
import {FormField, FormRoot, form, required, email} from '@angular/forms/signals';
import {Component, signal} from '@angular/core';

@Component({
  imports: [FormRoot, FormField],
  template: `
    <form [formRoot]="registrationForm">
      <input [formField]="registrationForm.username" />
      <input type="email" [formField]="registrationForm.email" />
      <input type="password" [formField]="registrationForm.password" />

      <button type="submit">Register</button>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});

  registrationForm = form(
    this.registrationModel,
    (schemaPath) => {
      required(schemaPath.username);
      email(schemaPath.email);
      required(schemaPath.password);
    },
    {
      submission: {
        action: async () => this.submitToServer(),
      },
    },
  );

  private submitToServer() {
    // Send data to server
  }
}
```

當你使用 `FormRoot` 時，送出表單會自動呼叫 `submit()` 函式，把所有欄位標記為已觸碰（揭露驗證錯誤），並在表單有效時執行你的 `action` 回呼。

你也可以不使用指令，手動送出表單：呼叫 `submit(this.registrationForm)`。像這樣明確呼叫 `submit` 函式時，你可以傳入 `FormSubmitOptions`，覆寫表單預設的 `submission` 邏輯：`submit(this.registrationForm, {action: () => /* ... */ })`。

#### 送出後重設表單

成功送出表單後，你可能會想讓它回到初始狀態——同時清除使用者互動紀錄與欄位值。`reset()` 方法會清除已觸碰與已變更旗標。你也可以把可選的值傳給 `reset()`，一併更新模型資料：

```ts
export class Contact {
  private readonly INITIAL_MODEL = {name: '', email: '', message: ''};
  contactModel = signal({...this.INITIAL_MODEL});
  contactForm = form(this.contactModel, {
    submission: {
      action: async (f) => {
        await this.api.sendMessage(this.contactModel());
        // Clear interaction state (touched, dirty) and reset to initial values
        f().reset({...this.INITIAL_MODEL});
      },
    },
  });
}
```

這能確保表單已準備好接受新輸入，不會顯示過時的錯誤訊息或已變更狀態指示。

## 依驗證狀態套用樣式

你可以依驗證狀態繫結 CSS 類別，為表單套用自訂樣式：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <input
      type="email"
      [formField]="form.email"
      [class.is-invalid]="form.email().touched() && form.email().invalid()"
      [class.is-valid]="form.email().touched() && form.email().valid()"
    />
  `,
  styles: `
    input.is-invalid {
      border: 2px solid red;
      background-color: white;
    }

    input.is-valid {
      border: 2px solid green;
    }
  `,
})
export class StyleExample {
  model = signal({email: ''});

  form = form(this.model, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

同時檢查 `touched()` 與驗證狀態，能確保樣式只在使用者與欄位互動後才出現。

## 聚焦繫結到表單欄位的表單控制項

Angular Signal Forms 在欄位狀態上提供了 `focusBoundControl()` 方法，讓你能以程式化方式把[焦點](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)移到與指定表單欄位相關聯的表單控制項。

一個常見的使用情境是改善表單送出時的無障礙體驗：當表單無效時，顯示錯誤訊息，並自動把焦點移到第一個無效欄位，引導使用者修正。

### 基本用法

假設有一個註冊表單：

```ts
@Component({/* ... */})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});
  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username);
    email(schemaPath.email);
    required(schemaPath.password);
  });
}
```

若要把焦點移到繫結到 `email` 欄位的控制項：

```ts
registrationForm.email().focusBoundControl();
```

### 防止捲動

若目標控制項在可視區域之外，而你想在不觸發捲動的情況下聚焦它，可以在呼叫 `focusBoundControl()` 方法時，把 [preventScroll](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#preventscroll) 選項設為 `true`。

```ts
registrationForm.email().focusBoundControl({preventScroll: true});
```

### 送出時聚焦第一個無效欄位

使用 `errorSummary()` 找到第一個無效欄位，並在使用者送出有錯誤的表單時聚焦它：

```ts
onSubmit() {
  const firstError = this.registrationForm().errorSummary()[0];
  if (firstError?.fieldTree) {
    firstError.fieldTree().focusBoundControl();
  } else {
    // proceed with submission
  }
}
```

### 自訂控制項

預設情況下，對自訂控制項呼叫 `focusBoundControl()` 不會有任何效果，因為自訂控制項可以包含多個原生輸入元素。例如，日期選擇器可以包含分別的日期、月份與年份欄位。因此，Angular 無法判斷哪個元素應該接收焦點，或應該執行什麼動作。

若要讓自訂控制項支援程式化聚焦，請實作 `focus()` 方法。當對與自訂控制項相關聯的欄位狀態呼叫 `focusBoundControl()` 時，Angular 會呼叫該控制項的 `focus()` 方法（若有的話）。

假設有一個自訂密碼輸入：

```html
<div class="password-block">
  <input type="password" #passwordCtrl [value]="value()" (input)="value.set($event.target.value)" />
</div>
```

```ts
@Component({/* ... */})
export class PasswordInput implements FormValueControl<string> {
  readonly value = model<string>('');
  readonly passwordCtrl = viewChild.required<ElementRef<HTMLInputElement>>('passwordCtrl');

  // Called automatically when focusBoundControl() is invoked
  // on the field state associated with this custom control
  focus(): void {
    this.passwordCtrl().nativeElement.focus();
  }
}
```

## 後續步驟

本指南說明了驗證與可用性狀態的處理、互動追蹤，以及欄位狀態的傳播。相關指南將探討 Signal Forms 的其他面向：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="表單模型" />
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/custom-controls" title="自訂控制項" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
