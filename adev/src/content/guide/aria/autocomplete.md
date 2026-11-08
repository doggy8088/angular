# Autocomplete

## 概觀

這是一個無障礙的輸入欄位，會在使用者輸入時篩選並建議選項，幫助他們從清單中找到並選取所需的值。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 用法

當使用者需要從一大組選項中選取、而打字比捲動更快的情境下，自動完成的效果最好。在下列情況可以考慮使用自動完成：

- **選項清單很長**（超過 20 個項目）：打字縮小選擇範圍的速度，比捲動下拉清單更快
- **使用者知道自己在找什麼**：他們可以輸入預期值的一部分（例如州名、產品或使用者名稱）
- **選項遵循可預測的模式**：使用者可以猜到部分相符的內容（例如國家代碼、電子郵件網域或分類）
- **速度很重要**：表單能受惠於快速選取，不必進行大量導覽

在下列情況避免使用自動完成：

- 清單少於 10 個選項：一般的下拉清單或單選按鈕群組能提供更好的可見性
- 使用者需要瀏覽選項：如果探索很重要，一開始就把所有選項都顯示出來
- 選項不熟悉：使用者無法輸入他們不知道清單裡存在的東西

## 功能

Angular 的自動完成提供完整無障礙的 combobox 實作，包含：

- **鍵盤導覽**：用方向鍵瀏覽選項、用 Enter 選取、用 Escape 關閉
- **螢幕閱讀器支援**：為輔助技術內建 ARIA 屬性
- **動態醒目提示行為**：內建支援行內選取建議
- **以訊號為基礎的反應性**：使用 Angular 訊號進行反應式狀態管理
- **Popover API 整合**：運用原生 HTML Popover API 達成最佳定位
- **雙向文字支援**：自動處理由右至左（RTL）的語言

## 範例

### 自動選取模式

使用者輸入部分文字時，會期待立即得到確認，知道自己的輸入與某個可用選項相符。自動選取模式會在使用者輸入時，把輸入值更新為第一個篩選出來的選項，減少需要的按鍵次數，並即時回饋，讓使用者知道搜尋方向正確。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 手動選取模式

手動選取模式會在使用者瀏覽建議清單時，保持輸入的文字不變，避免自動更新造成混淆。只有當使用者用 Enter 或點選明確確認選擇時，輸入內容才會改變。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 醒目提示模式

醒目提示模式讓使用者用方向鍵瀏覽選項，在瀏覽過程中不會改變輸入值，直到他們用 Enter 或點選明確選取新選項為止。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Signal Forms 整合

Angular Aria 可以與以訊號為基礎的 [Signal Forms](guide/forms/signals/overview) API 無縫整合。你可以把複雜的輸入封裝成可重複使用的自訂控制元件，實作 `FormValueControl`。

以下範例示範一個實作 `FormValueControl<string>` 的國家選取器元件，它使用 `[formField]` 繫結到父表單，並受到結構定義驗證規則的保護。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.html"/>
  <docs-code header="country-selector.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.ts"/>
  <docs-code header="country-selector.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.html"/>
  <docs-code header="country-selector.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.css"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.css"/>
</docs-code-multifile>

## 測試

自動完成模式可以使用 `@angular/aria/combobox/testing` 的 `ComboboxHarness` 與 `@angular/aria/listbox/testing` 的 `ListboxHarness` 組合來測試。
以下範例示範如何使用這些元件測試工具測試自動完成元件：

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyAutocompleteComponent} from './my-autocomplete'; // Your component

describe('MyAutocompleteComponent', () => {
  let fixture: ComponentFixture<MyAutocompleteComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAutocompleteComponent],
    });

    fixture = TestBed.createComponent(MyAutocompleteComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should filter options based on input', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Type in the input to trigger filtering
    await combobox.setValue('ap');
    expect(await combobox.isOpen()).toBe(true);

    // Get the listbox harness from the popup
    const listbox = await combobox.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    // Verify options are filtered (e.g., 'Apple', 'Apricot')
    expect(options.length).toBe(2);
    expect(await options[0].getText()).toBe('Apple');

    // Select the first option
    await options[0].click();

    // Verify the input value is updated and popup is closed
    expect(await combobox.isOpen()).toBe(false);
    expect(await combobox.getValue()).toBe('Apple');
  });
});
```

## API 參考

如需詳細的 API 文件，請查看下列 API 參考：

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)
- [`Listbox`](/api/aria/listbox/Listbox)
- [`Option`](/api/aria/listbox/Option)
