# 加入表單邏輯

Signal Forms 讓你能使用結構定義為表單加入邏輯。驗證邏輯已在[驗證指南](guide/forms/signals/validation)中說明，本指南將討論結構定義中其他可用的規則。你可以有條件地停用欄位、依其他值隱藏欄位、把欄位設為唯讀、防抖使用者輸入，以及為自訂控制項附加中繼資料。

本指南將說明如何使用 `disabled()`、`hidden()`、`readonly()`、`debounce()` 與 `metadata()` 等規則來控制欄位行為。

## 何時加入表單邏輯

當欄位行為取決於其他欄位的值，或需要以反應式方式更新時，請使用規則。例如：

- 訂單總額太低時被停用的優惠券代碼欄位
- 除非需要運送、否則隱藏的地址欄位
- 會防抖以減少 API 呼叫的搜尋欄位

## 規則如何運作

規則把反應式邏輯繫結到表單中的特定欄位。大多數規則都接受一個反應式邏輯函式作為選擇性引數。這個反應式邏輯函式會在它參照的訊號變更時自動重新計算，就像 `computed` 一樣。

```ts
const orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.couponCode, ({valueOf}) => valueOf(schemaPath.total) < 50);
  //~~~~~~ ~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //rule     path                   reactive logic function
});
```

反應式邏輯函式會收到一個 `FieldContext` 物件，透過 `valueOf()` 與 `stateOf()` 等輔助函式，提供對欄位值與狀態的存取。它通常會被解構，以便直接存取這些輔助函式。

NOTE: 結構定義回呼參數（這些範例中的 `schemaPath`）是一個 `SchemaPathTree` 物件，提供你表單中所有欄位的路徑。你可以任意為這個參數命名。

`FieldContext` 屬性與方法的完整詳情，請參閱[驗證指南](guide/forms/signals/validation)。

## 用 `disabled()` 防止欄位更新 {#prevent-field-updates-with-disabled}

`disabled()` 規則設定欄位的停用狀態。

它會與 `[formField]` 指令搭配，依欄位狀態自動繫結 `disabled` 屬性，因此你不需要在範本上手動加上 `[disabled]="yourForm.fieldName().disabled()"`。

NOTE: 停用的欄位會跳過驗證——它們不參與表單的驗證檢查。欄位的值會被保留，但不會被驗證。驗證行為的詳情，請參閱[驗證指南](guide/forms/signals/validation)。

### 永遠停用

若要永久停用欄位，只用欄位路徑呼叫 `disabled()`：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      System ID (cannot be changed)
      <input [formField]="settingsForm.systemId" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    systemId: 'SYS-12345',
    userName: '',
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    disabled(schemaPath.systemId);
  });
}
```

### 有條件地停用

若要依條件停用欄位，請提供一個反應式邏輯函式，回傳 `true`（停用）或 `false`（啟用）：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Order Total
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Coupon Code
      <input [formField]="orderForm.couponCode" />
    </label>
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, ({valueOf}) => valueOf(schemaPath.total) < 50);
  });
}
```

在這個範例中，當訂單總額低於 $50 時，優惠券代碼欄位會被停用。

### 停用原因 {#disabled-reasons}

停用欄位時，你可以回傳字串而非 `true`，為使用者提供面向使用者的說明：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Order Total
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Coupon Code
      <input [formField]="orderForm.couponCode" />
    </label>

    @if (orderForm.couponCode().disabled()) {
      <div class="info">
        @for (reason of orderForm.couponCode().disabledReasons(); track reason) {
          <p>{{ reason.message }}</p>
        }
      </div>
    }
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, ({valueOf}) =>
      valueOf(schemaPath.total) < 50 ? 'Order must be $50 or more to use a coupon' : false,
    );
  });
}
```

反應式邏輯函式會回傳：

- **字串**，以附帶原因的方式停用欄位
- `false`，啟用欄位（不只是任何假值——請明確使用 `false`）

透過欄位狀態上的 `disabledReasons()` 訊號存取這些原因。每個原因都有一個 `message` 屬性，包含你回傳的字串。

#### 多個停用原因

你也可以對同一個欄位多次呼叫 `disabled()`，所有回傳的原因都會累積：

```angular-ts
orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.promoCode, ({valueOf}) =>
    !valueOf(schemaPath.hasAccount) ? 'You must have an account to use promo codes' : false,
  );
  disabled(schemaPath.promoCode, ({valueOf}) =>
    valueOf(schemaPath.total) < 25 ? 'Order must be at least $25' : false,
  );
});
```

若兩個條件都為真，欄位會顯示兩個停用原因。這個模式很適合用在你想分開維護的複雜可用性規則上。

## 在欄位上設定 `hidden()` 狀態 {#configuring-hidden-state-on-fields}

`hidden()` 規則設定欄位的隱藏狀態。然而，這只設定了程式層面的狀態。**欄位是否出現在 UI 中，由你控制**。

IMPORTANT: 與 `disabled` 及 `readonly` 不同，`hidden` 狀態沒有原生的 DOM 屬性。`[formField]` 指令不會對元素套用 `hidden` 屬性。你必須在範本中使用 `@if` 或 CSS，依 `hidden()` 狀態有條件地呈現欄位。

NOTE: 與停用欄位相同，隱藏欄位也會跳過驗證。詳情請參閱[驗證指南](guide/forms/signals/validation)。

### 基本的欄位隱藏

把 `hidden()` 與回傳 `true`（隱藏）或 `false`（可見）的反應式邏輯函式搭配使用：

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
    hidden(schemaPath.publicUrl, ({valueOf}) => !valueOf(schemaPath.isPublic));
  });
}
```

## 用 `readonly()` 顯示不可編輯的欄位 {#display-uneditable-fields-with-readonly}

`readonly()` 規則防止使用者更新欄位。`[FormField]` 指令會自動把這個狀態繫結到 HTML `readonly` 屬性，在防止編輯的同時，仍允許使用者聚焦並選取文字。

NOTE: 唯讀欄位會跳過[驗證](guide/forms/signals/validation)。

### 永遠唯讀

若要讓欄位永久唯讀，只用欄位路徑呼叫 `readonly()`：

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

`[FormField]` 指令會依欄位狀態自動繫結 `readonly` 屬性。

### 有條件地唯讀

若要依條件讓欄位變成唯讀，請提供一個反應式邏輯函式：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-document',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="documentForm.isLocked" />
      Lock document
    </label>

    <label>
      Document Title
      <input [formField]="documentForm.title" />
    </label>
  `,
})
export class Document {
  documentModel = signal({
    isLocked: false,
    title: 'Untitled',
  });

  documentForm = form(this.documentModel, (schemaPath) => {
    readonly(schemaPath.title, ({valueOf}) => valueOf(schemaPath.isLocked));
  });
}
```

當 `isLocked` 為真時，title 欄位會變成唯讀。

## 在 hidden、disabled 與 readonly 之間選擇

這三個設定函式以不同方式控制欄位可用性：

在下列情況選擇 `hidden()`，當欄位：

- 完全不應該出現在 UI 中
- 與目前的表單狀態不相關
- 範例：勾選「與帳單地址相同」時，隱藏運送地址欄位

在下列情況選擇 `disabled()`，當欄位：

- 應該可見但不可編輯
- 需要顯示它無法使用的原因（使用停用原因）
- 應該從 HTML 表單送出中排除
- 範例：表單有效前停用的送出按鈕、對非管理員使用者停用的核准欄位

在下列情況選擇 `readonly()`，當欄位：

- 應該可見但不可編輯
- 包含使用者需要查看、選取或複製的資料
- 應該包含在 HTML 表單送出中
- 範例：訂單確認編號、系統產生的參照代碼

三者在啟用時都會跳過驗證，並防止使用者編輯。關鍵差異如下：

| 特性                     | `hidden()` | `disabled()` | `readonly()` |
| ------------------------ | ---------- | ------------ | ------------ |
| 在 UI 中可見             | 否         | 是           | 是           |
| 使用者可聚焦／選取       | 否         | 否           | 是           |
| 包含在 HTML 表單送出中   | 否         | 否           | 是           |

## 用 `debounce()` 延遲輸入操作 {#delay-input-operations-with-debounce}

`debounce()` 規則會延遲表單模型的更新。這對效能最佳化，以及減少快速輸入期間不必要的操作很有用。

### 防抖的作用

沒有防抖時，每一次按鍵都會立即更新表單模型。這可能觸發：

- 在每次變更時重新計算的昂貴 computed 訊號
- 每個字元之後的驗證檢查
- 與模型值綁定的 API 呼叫或其他副作用

防抖會延遲這些更新，減少不必要的工作。

### 基本防抖

你可以指定以毫秒為單位的延遲，來為欄位防抖：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Search
      <input [formField]="searchForm.query" />
    </label>

    <p>Searching for: {{ searchForm.query().value() }}</p>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, 300);
  });
}
```

在 300 毫秒防抖下：

- 使用者在輸入欄位中打字
- 表單模型只在停止打字 300 毫秒後才更新
- 若使用者持續打字，計時器會隨每次按鍵重設
- 一旦使用者停頓 300 毫秒，模型就會以最終值更新

### 時序保證

`debounce()` 函式透過以下機制，確保使用者不會遺失資料：

- **被標記為已觸碰時**：值會立即同步，中止任何尚待處理的防抖延遲。這會在欄位失去焦點時，或被明確標記為已觸碰時發生。
- **表單送出時**：所有欄位都會在驗證前被標記為已觸碰，確保所有防抖的值立即同步。

這表示使用者可以快速打字、跳離欄位，或送出表單，都不需要等待防抖延遲結束。

### 自訂防抖邏輯

若要進階控制，請提供一個防抖器函式，控制何時同步值。這個函式會在控制項值每次更新時被呼叫，可以回傳 `undefined` 以立即同步，或回傳一個 Promise，在它解析之前阻止同步：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Search
      <input [formField]="searchForm.query" />
    </label>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, () => {
      // Return a promise that resolves after 500ms
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    });
  });
}
```

防抖器函式可以回傳：

- `undefined`，立即同步值
- `Promise<void>`，在它解析之前阻止同步

自訂防抖邏輯的使用情境：

- 實作簡單延遲之外的自訂時序邏輯
- 與外部事件協調同步
- 依應用程式狀態有條件地防抖

### 何時使用防抖

防抖在下列情況最有用：

- 你有依賴欄位值的昂貴 computed 訊號
- 欄位會觸發 API 呼叫或其他副作用
- 你想減少快速打字期間的驗證負擔
- 效能分析顯示模型更新造成速度變慢

在下列情況不要使用防抖：

- 欄位需要立即更新才能有好的使用體驗（例如計算機輸入）
- 效能收益微不足道
- 使用者期待即時回饋

## 用 `metadata()` 把資料關聯到欄位

中繼資料把反應式資料附加到欄位。驗證規則在內部使用這套系統，你也可以發布自己的鍵，用於應用程式專屬資訊，例如說明文字、設定，或計算出的顯示值。

Signal Forms 提供了六個預先定義的中繼資料鍵，內建驗證器會自動填入：

| 鍵           | 由誰填入             | 透過什麼讀取          |
| ------------ | -------------------- | --------------------- |
| `REQUIRED`   | `required()`         | `field().required()`  |
| `MIN`        | `min()` | `field().min()`       |
| `MAX`        | `max()` | `field().max()`       |
| `MIN_LENGTH` | `minLength()`        | `field().minLength()` |
| `MAX_LENGTH` | `maxLength()`        | `field().maxLength()` |
| `PATTERN`    | `pattern()`          | `field().pattern()`   |

`[formField]` 指令會自動把其中五個鍵（`REQUIRED`、`MIN`、`MAX`、`MIN_LENGTH` 與 `MAX_LENGTH`）繫結到原生表單控制項上對應的 HTML 屬性。`PATTERN` 是例外，因為 Signal Forms 支援每個欄位多條 pattern，而 HTML `pattern` 屬性只接受單一正規表示式。

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age',
  imports: [FormField],
  template: `
    <label>
      Age (between {{ ageForm.age().min?.() }} and {{ ageForm.age().max?.() }})
      <input type="number" [formField]="ageForm.age" />
    </label>

    @if (ageForm.age().required()) {
      <span class="required-indicator">*</span>
    }
  `,
})
export class Age {
  ageModel = signal({age: 0});

  ageForm = form(this.ageModel, (schemaPath) => {
    required(schemaPath.age);
    min(schemaPath.age, 18);
    max(schemaPath.age, 120);
  });
}
```

### 反應式中繼資料

驗證規則可以從其他欄位推導它們的限制，讓發布的中繼資料具備反應性：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, max} from '@angular/forms/signals';

@Component({
  selector: 'app-inventory',
  imports: [FormField],
  template: `
    <label>
      Item
      <select [formField]="inventoryForm.item">
        <option value="widget">Widget</option>
        <option value="gadget">Gadget</option>
      </select>
    </label>

    <label>
      Quantity (max: {{ inventoryForm.quantity().max?.() }})
      <input type="number" [formField]="inventoryForm.quantity" />
    </label>
  `,
})
export class Inventory {
  inventoryModel = signal({
    item: 'widget',
    quantity: 0,
  });

  inventoryForm = form(this.inventoryModel, (schemaPath) => {
    max(schemaPath.quantity, ({valueOf}) => {
      const item = valueOf(schemaPath.item);
      return item === 'widget' ? 100 : 50;
    });
  });
}
```

`max()` 驗證規則會依選取的項目，以反應式方式設定 `MAX` 中繼資料，因此任何讀取 `field().max()` 的範本或控制項，都會在項目變更時更新。

想深入了解，包括如何定義自訂鍵、用歸約器合併貢獻，以及用受管理的中繼資料處理具生命週期感知能力的物件，請參閱[欄位中繼資料指南](guide/forms/signals/field-metadata)。

## 組合規則

你可以對同一個欄位套用多條規則，也可以用條件邏輯，依表單狀態套用整組規則。

### 一個欄位上的多條規則

套用多條規則，設定欄位行為的各個面向：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled, hidden, debounce, metadata} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

@Component({
  selector: 'app-promo',
  imports: [FormField],
  template: `
    @if (!promoForm.promoCode().hidden()) {
      <label>
        Promo Code
        <input [formField]="promoForm.promoCode" />
      </label>
    }
  `,
})
export class Promo {
  promoModel = signal({
    hasAccount: false,
    subscriptionType: 'free' as 'free' | 'premium',
    promoCode: '',
  });

  promoForm = form(this.promoModel, (schemaPath) => {
    disabled(schemaPath.promoCode, ({valueOf}) =>
      !valueOf(schemaPath.hasAccount) ? 'You must have an account' : false,
    );
    hidden(schemaPath.promoCode, ({valueOf}) => valueOf(schemaPath.subscriptionType) === 'free');
    debounce(schemaPath.promoCode, 300);
    metadata(schemaPath.promoCode, PLACEHOLDER, () => 'Enter promo code');
  });
}
```

這些規則會一起運作：

- Hidden 優先——若欄位被隱藏，停用狀態就不重要了
- Disabled 防止編輯，不受唯讀狀態影響
- 防抖影響模型更新，不受其他狀態影響
- 中繼資料是獨立的，隨時可用

### 用 applyWhen 加入條件邏輯 {#conditional-logic-with-applywhen}

使用 `applyWhen()`，有條件地套用整組規則：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, applyWhen, required, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-address',
  imports: [FormField],
  template: `
    <label>
      Country
      <select [formField]="addressForm.country">
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>
    </label>

    <label>
      Zip/Postal Code
      <input [formField]="addressForm.zipCode" />
    </label>
  `,
})
export class Address {
  addressModel = signal({
    country: 'US',
    zipCode: '',
  });

  addressForm = form(this.addressModel, (schemaPath) => {
    applyWhen(
      schemaPath,
      ({valueOf}) => valueOf(schemaPath.country) === 'US',
      (schemaPath) => {
        // Only applied when country is US
        required(schemaPath.zipCode);
        pattern(schemaPath.zipCode, /^\d{5}(-\d{4})?$/);
      },
    );
  });
}
```

`applyWhen()` 函式會收到：

1. 要套用邏輯的路徑（通常是根表單路徑）
2. 一個反應式邏輯函式，回傳 `true`（套用）或 `false`（不套用）
3. 一個定義條件規則的結構定義函式

條件規則只在條件為真時執行。這對複雜表單很有用，因為驗證規則或行為會依使用者的選擇而改變。

### 可重用的結構定義函式

把常見的規則設定抽取成可重用的函式：

```ts
import {SchemaPath, debounce, metadata, maxLength} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

function emailFieldConfig(path: SchemaPath<string>) {
  debounce(path, 300);
  metadata(path, PLACEHOLDER, () => 'user@example.com');
  maxLength(path, 255);
}

// Use in multiple forms
const contactForm = form(contactModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
  emailFieldConfig(schemaPath.alternateEmail);
});

const registrationForm = form(registrationModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
});
```

當你的應用程式中有跨多份表單使用的標準欄位設定時，這個模式很有用。

## 後續步驟

想進一步了解 Signal Forms，請參閱這些相關指南：

- [欄位狀態管理](guide/forms/signals/field-state-management) - 了解如何在範本與元件邏輯中使用這些函式建立的狀態訊號
- [驗證](guide/forms/signals/validation) - 了解驗證規則與錯誤處理
- [自訂控制項](guide/forms/signals/custom-controls) - 了解自訂控制項如何讀取中繼資料與狀態，讓自己自動完成設定
