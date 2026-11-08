# 測試訊號表單

表單通常是應用程式的關鍵所在，測試能讓你有信心：隨著程式碼庫演進，表單仍能正確運作。訊號表單將大部分邏輯放在結構定義而非範本中，這表示你可以在不算繪元件的情況下，測試大部分的表單行為。

本指南將逐步說明如何設定這些測試，先從獨立的邏輯測試開始，再介紹當 DOM 互動很重要時使用的元件綁定測試。

## 單獨測試表單邏輯

當你只需要驗證驗證規則、停用狀態、必填狀態或錯誤輸出時，請直接測試表單本身，而不是算繪元件。獨立測試讓設定保持精簡，並讓測試聚焦於表單的行為。

關鍵需求是注入器（injector）。訊號表單在建立表單期間需要注入上下文。如果測試在沒有注入上下文的情況下呼叫 `form()`，該呼叫會在測試能對表單做任何斷言之前就擲出例外。

滿足這個需求最直接的方法，是明確傳入注入器。以下測試建立了一個帶有 `required` 規則的表單，並驗證該欄位在取得值之後變為有效：

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('marks required fields as invalid until they have a value', () => {
    const model = signal({name: ''});

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().valid()).toBe(false);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

這個模式適用於大多數獨立測試，因為注入器需求在呼叫處一目了然。它也反映了 Angular 原始碼中訊號表單單元測試建立表單的方式。

當受測程式碼在內部呼叫 `form()` 時，你可能無法直接傳入注入器。在這種情況下，請將呼叫包裝在環境注入上下文中：

```ts {header: 'profile-form.spec.ts'}
import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('can create a form inside an injection context', () => {
    const model = signal({name: ''});

    TestBed.runInInjectionContext(() => {
      const profileForm = form(model, (path) => {
        required(path.name);
      });

      expect(profileForm.name().valid()).toBe(false);
    });
  });
});
```

這兩種模式產生的表單種類相同。當測試直接建立表單時，傳入 `{injector}` 通常是最清楚的選擇。當受測程式碼在內部呼叫 `form()`，而你需要提供周圍的注入上下文時，`TestBed.runInInjectionContext()` 就很好用。

表單建立完成後，請透過欄位狀態訊號來測試它。常見的斷言包括 `valid()`、`invalid()`、`disabled()`、`required()` 與 `errors()`。對大多數表單邏輯而言，這已足以驗證行為，不需要牽涉 DOM。

## 測試具有多條規則的表單

注入器設定就緒後，一個很好的下一步是撰寫一個完整的測試，將幾段表單邏輯一起演練。這類測試仍然是獨立測試，但看起來更接近真實應用程式中的表單。

例如，以下測試同時驗證了一條基本的必填規則，以及一條相依於另一個欄位的條件式必填規則：

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('updates validation state when related fields change', () => {
    const model = signal({
      name: '',
      age: 5,
    });

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
        required(path.name, {
          error: (ctx) => ({kind: `required-${ctx.valueOf(path.age)}`}),
          when: ({valueOf}) => valueOf(path.age) > 10,
        });
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().invalid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.age().value.set(15);

    expect(profileForm.name().errors()).toEqual([
      expect.objectContaining({kind: 'required'}),
      expect.objectContaining({kind: 'required-15'}),
    ]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

這個範例展示了一個重要的測試模式：更新一個欄位，然後針對另一個欄位的狀態做斷言。由於訊號表單的規則是反應式的，某個欄位的驗證可能相依於同層欄位的值、父層的值或其他衍生條件。測試應直接驗證這些關係，而不是只檢查變更的那個欄位。

對於以驗證為主的測試，`errors()` 通常是最有用的斷言。`valid()` 與 `invalid()` 告訴你欄位目前是否通過驗證，但 `errors()` 會顯示是哪條規則造成失敗。當欄位有多個驗證器或條件規則時，這一點特別有用。

大多數日常的表單測試都可以使用相同的結構：

1. 建立一個模型訊號，其形狀是能重現該行為的最小形狀。
1. 使用明確的注入器建立表單。
1. 斷言初始欄位狀態。
1. 使用 `.value.set(...)` 變更欄位；測試跨欄位規則時，也包含同層欄位。
1. 斷言更新後的狀態訊號，通常是 `errors()`、`valid()` 或 `invalid()`。

當測試的主題是結構定義行為而非算繪時，請預設使用這種獨立測試風格。它比元件測試更快，而且當行為改變時，更容易看出是哪條規則造成的。

## 測試與元件綁定的表單

當你需要驗證相依於範本綁定、透過 `dispatchEvent` 進行的使用者互動，或自行管理算繪的自訂表單控制項等行為時，獨立測試就不夠了。你需要元件綁定測試來算繪範本，才能與實際的 DOM 元素互動。

### 設定元件測試

元件綁定測試會算繪元件，讓你與實際的 DOM 元素互動。使用 `TestBed.createComponent()` 建立元件，並等待算繪完成後再做斷言：

```angular-ts {header: 'profile-form.ts'}
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-profile-form',
  imports: [FormField],
  template: `<input [formField]="profileForm.name" />`,
})
export class ProfileForm {
  readonly model = signal({name: 'Ada'});
  readonly profileForm = form(this.model, (path) => {
    required(path.name);
  });
}
```

```ts {header: 'profile-form.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';
import {ProfileForm} from './profile-form';

describe('ProfileForm', () => {
  it('reflects model values in the DOM and updates the model on user input', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Model → View: the input reflects the model's initial value
    expect(input.value).toBe('Ada');

    // View → Model: simulate the user clearing the field
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.profileForm.name().value()).toBe('');
    expect(fixture.componentInstance.profileForm.name().valid()).toBe(false);
  });
});
```

請注意，元件使用 `form()` 時沒有明確指定注入器，因為元件自身的注入上下文會自動提供它。每次變更後，`await fixture.whenStable()` 會等到算繪與副作用完成後才進行斷言。

相同的模式也適用於非同步操作，例如非同步驗證器或伺服器呼叫。在非同步工作完成後呼叫 `await fixture.whenStable()` 即可。

## 何時使用哪種方式

| 需要驗證的內容                                       | 方式         |
| ---------------------------------------------------- | ------------ |
| 驗證規則、`errors()`、`valid()`、`invalid()`         | 獨立測試     |
| 停用、必填或唯讀狀態                                 | 獨立測試     |
| 跨欄位的反應式相依性                                 | 獨立測試     |
| 條件式結構定義（`applyWhen`、`applyWhenValue`）      | 獨立測試     |
| 輸入值在 DOM 中的算繪                                | 元件綁定測試 |
| 使用者輸入更新模型                                   | 元件綁定測試 |
| 具有自有範本的自訂表單控制項                         | 元件綁定測試 |
| 焦點管理或無障礙屬性                                 | 元件綁定測試 |

大多數表單只需要獨立測試。表單的邏輯（例如驗證、停用狀態、跨欄位規則）位於結構定義中，而結構定義不需要範本就能執行。當你關心的行為跨越了表單與 DOM 之間的界線時，元件綁定測試才會帶來價值。

## 後續步驟

本指南介紹了單獨測試訊號表單，以及搭配元件範本進行測試。以下是探討訊號表單其他面向的相關指南：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/form-submission" title="表單提交" />
</docs-pill-row>
