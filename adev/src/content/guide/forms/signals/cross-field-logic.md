# 跨欄位邏輯

當某個欄位的規則、驗證或行為取決於另一個欄位的值或狀態時，就需要**跨欄位邏輯**。

訊號表單會為每個規則函式提供一個**欄位上下文**。欄位上下文讓你存取目前欄位的值與狀態，並透過 `valueOf()`、`stateOf()` 與 `fieldTreeOf()` 讀取表單中的其他欄位。

本指南深入說明欄位上下文 API，並展示常見的跨欄位模式。單一欄位的驗證請見[驗證指南](/guide/forms/signals/validation)。

## 了解欄位上下文 {#understanding-the-field-context}

訊號表單中的每個規則函式都會收到一個**欄位上下文**參數，它是一個物件，描述目前的欄位，並提供存取表單其他部分的方式。

目前欄位可以存取三個屬性：

| 屬性        | 型別                 | 說明                                            |
| ----------- | -------------------- | ----------------------------------------------- |
| `value`     | `Signal<TValue>`     | 目前欄位的值，以訊號表示                        |
| `state`     | `FieldState<TValue>` | 目前欄位的狀態（如有效性、錯誤、touched、dirty） |
| `fieldTree` | `FieldTree<TValue>`  | 目前欄位的樹，用於以程式方式存取子欄位          |

跨欄位邏輯則用以下三個屬性存取表單的其他部分：

| 屬性            | 型別                           | 說明                                                                                             |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `valueOf()`     | `(path) => PValue`             | 最常用。當你需要另一個欄位的原始值來比較或計算時使用。                                           |
| `stateOf()`     | `(path) => FieldState<PValue>` | 當邏輯取決於另一個欄位的狀態時使用，例如它是否有效、是否 touched 或 dirty。                      |
| `fieldTreeOf()` | `(path) => FieldTree<PModel>`  | 當你需要以程式方式存取另一個欄位的樹時使用，例如用 validateTree 把錯誤推到特定的子欄位。         |

以下範例使用 `value` 與 `valueOf()`，驗證目前欄位（結束日期）必須晚於表單中的開始日期：

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }

      return null;
    });
  });
}
```

NOTE: `fieldContext` 參數通常會被解構，只取出規則需要的部分。本指南後續的範例都採用這個模式。

## 跨欄位驗證模式

上一節的日期範圍範例，以開始日期驗證結束日期。因為規則讀取了 `valueOf(schemaPath.startDate)`，任一日期改變時它都會自動重新評估。換句話說，只要一個驗證器就能讓錯誤狀態保持正確。

不過，那個驗證器只會把錯誤放在結束日期欄位上。若你希望範圍無效時兩個欄位都顯示錯誤，就為每個欄位各加一條相符的驗證規則：

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.startDate, ({value, valueOf}) => {
      if (value() >= valueOf(schemaPath.endDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'Start date must be before end date',
        };
      }
      return null;
    });

    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }
      return null;
    });
  });
}
```

兩條規則都用 `valueOf()` 讀取另一個欄位。因為每條規則都是反應式的，任一日期改變時，兩邊的驗證都會自動重新評估。

NOTE: 規則涉及多個欄位時，你需要決定錯誤該歸屬何處：放在特定欄位、放在多個欄位、還是放在父層。一般原則是把錯誤放在使用者最可能去修正問題的位置。

### 條件式必填

有些表單中，特定欄位只在特定條件下才必填。例如註冊表單可能只在使用者選擇企業帳號類型時，才要求填寫公司名稱：

```ts
import {Component, signal} from '@angular/core';
import {form, required} from '@angular/forms/signals';

@Component({/* ... */})
export class RegistrationForm {
  registrationModel = signal({
    accountType: 'personal' as 'personal' | 'business',
    companyName: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.companyName, {
      when: ({valueOf}) => valueOf(schemaPath.accountType) === 'business',
      message: 'Company name is required for business accounts',
    });
  });
}
```

`when` 選項收到的欄位上下文與其他規則函式相同，所以 `valueOf` 的用法也一樣。當使用者切換回 `'personal'` 時，條件會重新評估，必填要求連同它的錯誤都會自動清除。

用帶 `when` 的 `required()` 取代手動的 `validate()` 檢查，還會為欄位加上正確的必填中繼資料，啟用無障礙功能，例如為螢幕閱讀器把欄位標示為必填。

### 依據另一個欄位的狀態驗證

目前為止的範例都用 `valueOf()` 讀取另一個欄位的值。有時你的邏輯取決於另一個欄位的「狀態」：它是否有效、是否 touched 或 dirty。這時就改用 `stateOf()`。

例如，確認密碼欄位應該在使用者與密碼欄位互動過後，才檢查兩者是否相符。使用者還沒碰過密碼欄位，就在確認欄位上標示不符，為時過早：

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class PasswordForm {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    validate(schemaPath.confirmPassword, ({value, valueOf, stateOf}) => {
      if (!stateOf(schemaPath.password).touched()) {
        return null;
      }
      if (value() !== valueOf(schemaPath.password)) {
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

`stateOf()` 呼叫會回傳另一個欄位的[欄位狀態](api/forms/signals/FieldState)，讓你存取 `invalid()`、`touched()` 與 `dirty()` 等訊號。因為這些都是訊號，密碼欄位的有效性一改變，規則就會重新評估。

CRITICAL: 小心不要讀取依賴你自己欄位驗證的狀態，那會形成循環。例如，檢查父欄位是否有效的驗證器會造成無限迴圈，因為父欄位的有效性取決於其子欄位的有效性（其中包含你的驗證器）。

## 使用 validateTree {#using-validatetree}

目前為止的範例都用 `validate()` 檢查個別欄位。有時你需要驗證一組欄位，其邏輯本質上就涉及群組中的多個欄位，並且要把錯誤直接指向其中的特定子欄位。`validateTree` 正適合這類情境。

例如在數獨謎題中，每一列的數字都必須唯一。這是一條群組層級的規則：你檢查整列，再標示出違反規則的特定格子。這種驗證用個別欄位上的 `validate` 很難寫得乾淨，因為每一格都得知道所有其他格的狀況。

```ts
import {Component, signal} from '@angular/core';
import {form, validateTree} from '@angular/forms/signals';

@Component({/* ... */})
export class SudokuRow {
  rowModel = signal({
    cell1: 1,
    cell2: 3,
    cell3: 1,
    cell4: 4,
  });

  rowForm = form(this.rowModel, (schemaPath) => {
    validateTree(schemaPath, ({value, fieldTreeOf}) => {
      const row = value();
      const entries = [
        {val: row.cell1, fieldTree: fieldTreeOf(schemaPath.cell1)},
        {val: row.cell2, fieldTree: fieldTreeOf(schemaPath.cell2)},
        {val: row.cell3, fieldTree: fieldTreeOf(schemaPath.cell3)},
        {val: row.cell4, fieldTree: fieldTreeOf(schemaPath.cell4)},
      ];

      const counts = new Map<number, number>();
      for (const {val} of entries) {
        if (val !== 0) {
          counts.set(val, (counts.get(val) ?? 0) + 1);
        }
      }

      const errors = entries
        .filter(({val}) => val !== 0 && (counts.get(val) ?? 0) > 1)
        .map(({val, fieldTree}) => ({
          kind: 'duplicateInRow',
          message: `${val} already appears in this row`,
          fieldTree,
        }));

      return errors.length > 0 ? errors : null;
    });
  });
}
```

驗證器在父欄位（該列）上執行，讀取所有格子的值、計算重複次數，並為每個含重複數字的格子回傳一個錯誤。每個錯誤上的 `fieldTree` 屬性會確切告訴 Angular 哪一格該顯示錯誤。沒有 `fieldTree`，錯誤就會套用到該列本身，而不是使用者需要看到的位置。

因為 `validateTree` 可以回傳錯誤陣列，單一驗證器就能一次標示多個格子。每個錯誤都包含指向其目標的 `fieldTree`，Angular 因此能把錯誤送到正確的欄位。

### 何時用 validateTree、何時用 validate

當錯誤歸屬於被驗證的欄位時，優先用帶 `valueOf()` 的 `validate()`，即使規則會讀取其他欄位。以下情況才改用 `validateTree`：

- 驗證邏輯本質上是關於一組欄位，而不是任何單一欄位
- 驗證器需要回傳指向不同子欄位的錯誤

TIP: 想了解 `validateTree` 及其回傳型別的入門說明，請見[驗證指南](/guide/forms/signals/validation)。

## 下一步

本指南說明了欄位上下文 API 與常見的跨欄位模式。想進一步了解相關的 Signal Forms 指南，請看：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/custom-controls" title="自訂控制項" />
</docs-pill-row>
