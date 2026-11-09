# 表單送出

當使用者送出表單時，你的應用程式通常需要同時處理多項工作：呈現驗證錯誤、防止重複送出、把資料傳送到伺服器等等。手動逐一處理這些工作既繁瑣又容易出錯。

Signal Forms 提供了 `submit()` 函式，協助你管理表單送出的生命週期。本指南將逐步說明如何使用它。

## `submit()` 做了什麼？

`submit()` 函式會依特定順序執行：

1. **把可互動欄位標記為已觸碰**——只在被觸碰後才顯示錯誤的欄位，現在會顯示它們的驗證錯誤。隱藏、停用與唯讀欄位會被略過。
1. **檢查驗證**——若有任何驗證規則失敗，送出就會停止，`action` 函式不會執行。
1. **執行 action**——`action` 函式會以表單的目前值執行。執行期間，`submitting()` 會回傳 `true`。
1. **處理結果**——若 action 回傳錯誤，這些錯誤會被導向它們的目標欄位；若什麼都不回傳，這次送出就視為成功。

`submit()` 函式會回傳一個 `Promise<boolean>`：當 action 無錯誤地完成時解析為 `true`；當驗證失敗、action 回傳錯誤，或已有送出進行中時，解析為 `false`。若 action 擲出例外，這個 promise 會以該錯誤被拒絕。

## 用 `FormRoot` 設定表單送出 {#setting-up-form-submission-with-formroot}

使用 `submit()` 函式最常見的方式，是透過 `FormRoot` 指令。

`FormRoot` 指令繫結到 `<form>` 元素時，會自動處理三件事：

1. **設定 [`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#novalidate)**——停用瀏覽器內建的驗證，改由 Signal Forms 管理驗證
1. **防止預設行為**——阻止瀏覽器在表單送出時導頁
1. **呼叫 `submit()`**——當使用者送出表單時，若表單建立時有帶 `submission` 選項，就觸發送出流程

NOTE: `FormRoot` 指令會自動在 `form` 元素上設定 `novalidate` 屬性。使用 `FormRoot` 時，你不需要手動加上它。

`FormRoot` 會處理送出事件，但你還是需要告訴它該拿表單資料_做什麼_。這需要三件事：

1. 把你的表單繫結到 `FormRoot` 指令
1. 把 `submission` 選項傳給 `form()` 函式
1. 在 `submission` 選項中定義一個 `action` 函式，負責管理送出的資料

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, FormRoot, required} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="contactForm">
      <label>
        Name
        <input [formField]="contactForm.name" />
      </label>

      <label>
        Email
        <input type="email" [formField]="contactForm.email" />
      </label>

      <button type="submit">Send</button>
    </form>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(
    this.contactModel,
    (schemaPath) => {
      required(schemaPath.name);
      required(schemaPath.email);
    },
    {
      submission: {
        action: async (field) => {
          const result = await saveContact(field().value());
          if (result.ok) return;

          return {kind: 'serverError', message: 'Failed to submit form'};
        },
      },
    },
  );
}
```

只有在沒有任何驗證規則失敗時，`action` 函式才會執行。依預設，尚待處理的非同步驗證器不會阻擋送出（詳情請參閱[控制驗證閘門](#controlling-validation-gating-with-ignorevalidators)）。action 會收到欄位樹，以及一個帶有 `root` 與 `submitted` 欄位樹的 `detail` 物件，這在送出子表單時很有用。

驗證通過之後，action 本身仍可能因網路錯誤或重複輸入等情境而失敗。遇到這種情況，你可以回傳錯誤，把失敗呈現出來。反之，若要表示成功，你只需要回傳 `null` 或 `undefined`，或執行一個空的 `return`。

## 用 `submitting()` 顯示送出狀態

當你需要追蹤表單是否正在送出時，Signal Forms 提供了 `submitting()` 訊號，它會在 `action` 函式執行期間回傳 `true`。用它來顯示載入指示，或停用送出按鈕以防止重複送出。

```angular-html
<button type="submit" [disabled]="contactForm().submitting()">
  @if (contactForm().submitting()) {
    Sending...
  } @else {
    Send
  }
</button>
```

一旦 `action` 函式成功或回傳錯誤，`submitting()` 訊號就會自動重設回 `false`。

## 管理送出錯誤

### 伺服器錯誤

當你的 `action` 函式與伺服器通訊時，伺服器可能回傳需要出現在特定欄位上的錯誤。把這些錯誤從 `action` 回傳，它們就會被導向目標欄位。

#### 送出欄位上的錯誤

依預設，從 `action` 回傳的錯誤會被指派給送出的欄位（也就是你傳給 `submit()` 的欄位樹）：

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'serverError', message: 'Failed to submit form'};
};
```

#### 特定欄位上的錯誤

當你想把錯誤導向特定欄位時，請加入一個指向該欄位的 `fieldTree` 屬性：

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'taken', message: result.message, fieldTree: field.email};
};
```

#### 多個錯誤

當你想在多個欄位上回報錯誤時，請回傳一個陣列：

```ts
action: async (field) => {
  const result = await registerUser(field().value());
  if (result.ok) return;

  return result.errors.map((err: {field: string; message: string}) => ({
    kind: 'serverError',
    message: err.message,
    fieldTree: field[err.field as keyof typeof field],
  }));
};
```

### 自動清除送出錯誤

當使用者編輯欄位時，送出錯誤會自動清除。若 `action` 在 email 欄位上回傳錯誤，使用者一變更 email 值，該錯誤就會消失。

這與驗證錯誤不同，驗證錯誤會以反應式方式重新計算。驗證規則會在每次變更時再次執行，並可能產生相同的錯誤。送出錯誤則是來自伺服器的一次性結果——一旦清除，除非再次送出表單，否則不會重現。

TIP: 送出錯誤會與驗證錯誤一起出現在欄位的 `errors()` 訊號中。若要在範本中顯示錯誤，請參閱[欄位狀態管理指南](guide/forms/signals/field-state-management)。

## 用 `onInvalid` 處理無效的送出

當驗證失敗時，`action` 函式不會執行。若你需要回應失敗的送出嘗試——例如捲動到第一個錯誤、顯示提示訊息，或聚焦某個無效欄位——請使用 `onInvalid` 回呼。

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        firstError?.fieldTree().focusBoundControl();
      },
    },
  },
);
```

`onInvalid` 回呼接收與 `action` 相同的 `(field, detail)` 參數。它會在所有可互動欄位都被標記為已觸碰之後執行，因此它執行時，驗證錯誤已經在 UI 中可見。

## 用 `ignoreValidators` 控制驗證閘門 {#controlling-validation-gating-with-ignorevalidators}

依預設，`submit()` 會忽略尚待處理的驗證器。若沒有驗證器失敗，即使有些非同步驗證器還在進行中，action 也會執行。`ignoreValidators` 選項讓你能控制這個行為。

| 值          | 行為                                                     |
| ----------- | -------------------------------------------------------- |
| `'pending'` | 只要沒有驗證器失敗就送出，即使有些尚待處理（預設）       |
| `'none'`    | 只有所有驗證器都通過才送出——尚待處理的驗證器會阻擋送出   |
| `'all'`     | 無論驗證狀態如何，一律送出                               |

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      ignoreValidators: 'none',
    },
  },
);
```

當你的表單有非同步驗證器（例如檢查使用者名稱是否可用），而且你需要所有驗證都完成後才能送出時，請使用 `'none'`。在儲存草稿的情境中，若你想不論驗證狀態如何都保存資料，請使用 `'all'`。

## 用 `submit()` 手動送出

`FormRoot` 指令是觸發送出最常見的方式，但你也可以直接呼叫 `submit()`。這在多步驟精靈、自動儲存，或從表單元素外部觸發送出時很有用。

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, submit} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <label>
      Name
      <input [formField]="contactForm.name" />
    </label>

    <label>
      Email
      <input type="email" [formField]="contactForm.email" />
    </label>

    <button (click)="onSave()">Save</button>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(this.contactModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  });

  async onSave() {
    // When calling `submit()` directly, you pass the action as the second argument
    // instead of configuring it in `FormOptions`.
    const success = await submit(this.contactForm, async (field) => {
      const result = await saveContact(field().value());
      if (result.ok) return;

      return {kind: 'serverError', message: 'Failed to save'};
    });

    if (success) {
      // Handle success — navigate, show confirmation, etc.
    }
  }
}
```

## 處理副作用

`submit()` 函式會回傳 `Promise<boolean>`——當 action 無錯誤地完成時為 `true`；當驗證失敗、action 回傳錯誤，或已有送出進行中時為 `false`。若 action 擲出例外，promise 會被拒絕。用這個回傳值來觸發導頁或通知等副作用。

```ts
async onSave() {
  const success = await submit(this.contactForm, async (field) => {
    await saveContact(field().value());
  });

  if (success) {
    await this.router.navigate(['/confirmation']);
  }
}
```

當 action 產生了副作用需要的資料（例如伺服器產生的 ID）時，請把副作用處理放在 action 內部：

```ts
async onSave() {
  await submit(this.contactForm, async (field) => {
    const contact = await createContact(field().value());
    await this.router.navigate(['/confirmation', contact.id]);
  });
}
```

使用 `FormRoot` 時，副作用同樣放在 `action` 內，因為 `FormRoot` 會在內部呼叫 `submit()`：

```ts
submission: {
  action: async (field) => {
    const result = await saveContact(field().value());
    if (result.ok) {
      await this.router.navigate(['/confirmation']);
      return;
    }

    return {kind: 'serverError', message: 'Failed to submit form'};
  },
}
```

## 同時送出

當一次送出正在進行時，針對同一表單或其任何子孫欄位的後續 `submit()` 呼叫，會立即回傳 `false` 而不執行 action。這能防止使用者在短時間內多次觸發送出動作時，造成重複送出與副作用。

## 後續步驟

本指南說明了如何送出表單，以及如何處理表單送出錯誤。相關指南將探討 Signal Forms 的其他面向：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/form-logic" title="加入表單邏輯" />
</docs-pill-row>
