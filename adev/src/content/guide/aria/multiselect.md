# Multiselect

## 概述

多選模式將唯讀的 combobox 觸發器與多選 listbox 彈出視窗結合，建立出無障礙程度高、支援鍵盤導覽與螢幕閱讀器的多選下拉選單。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 用法

當使用者需要從一組熟悉的選項中選取多個相關項目時，多選模式最為合適。

在下列情況可以考慮使用這個模式：

- **使用者需要多選**：標籤、分類、篩選條件或標記等可同時適用多個選項的情況
- **選項清單固定**（少於 20 個項目）：使用者不需搜尋就能瀏覽選項
- **篩選內容**：可同時啟用多個條件
- **指派屬性**：標籤、權限或功能等可同時有多個值的情況
- **相關選項**：邏輯上能互相搭配的選項（例如選取多位團隊成員）

在下列情況應避免使用這個模式：

- **只需要單選**：改用 [Select 模式](guide/aria/select)，下拉選單更簡單
- **清單超過 20 個項目且需要搜尋**：改用具備多選能力的 [Autocomplete 模式](guide/aria/autocomplete)
- **會選取大多數或全部選項**：核取清單模式的可見性更好
- **選項是各自獨立的二元選項**：個別的核取方塊能更清楚地表達選項

## 功能

多選模式結合 [Combobox](guide/aria/combobox) 與 [Listbox](guide/aria/listbox) 指令，提供完全無障礙的下拉選單，功能包括：

- **鍵盤導覽**：用方向鍵導覽選項、用 Space 切換、用 Escape 關閉
- **螢幕閱讀器支援**：內建 ARIA 屬性，包括 aria-multiselectable
- **選取數量顯示**：多選時以精簡的「項目 + 2 more」模式顯示
- **以訊號為基礎的反應式機制**：使用 Angular 訊號管理反應式狀態
- **智慧定位**：由 CDK Overlay 處理視窗邊緣與捲動
- **持續顯示選取狀態**：選取的選項在選取後仍可見，並帶有勾選標記

## 範例

### 基本多選

使用者需要從一份選項清單中選取多個項目。唯讀的 combobox 搭配支援多選的 listbox，能提供熟悉的多選功能，並具備完整的無障礙支援。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngListbox` 上的 `multi` 屬性可啟用多選。按 Space 可切換選項，彈出視窗會保持開啟以便繼續選取。顯示內容會呈現第一個選取的項目，再加上其餘選取項目的數量。

### 具備自訂顯示的多選

選項通常需要圖示或顏色等視覺標示，協助使用者辨識選項。選項內的自訂範本能提供豐富的格式，而顯示值則呈現精簡的摘要。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

每個選項都會在標籤旁顯示一個圖示。顯示值會更新為第一個選取項目的圖示與文字，再加上其餘選取項目的數量。選取的選項會顯示勾選標記，提供清楚的視覺回饋。

### 受控選取

表單有時需要限制選取數量，或驗證使用者的選擇。以程式控制選取狀態，就能在維持無障礙的同時加上這些限制。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

這個範例將選取數量限制為兩個項目。達到上限時，未選取的選項會被停用，以防止繼續選取，而 combobox 的顯示內容也會隨之更新以反映目前的選擇。

## 測試

多選模式可以使用 `@angular/aria/combobox/testing` 的 `ComboboxHarness` 與 `@angular/aria/listbox/testing` 的 `ListboxHarness` 組合來測試。
以下範例示範如何使用這些測試工具來測試多選元件：

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyMultiselectComponent} from './my-multiselect'; // Your component

describe('MyMultiselectComponent', () => {
  let fixture: ComponentFixture<MyMultiselectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMultiselectComponent],
    });

    fixture = TestBed.createComponent(MyMultiselectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting multiple options', async () => {
    const select = await loader.getHarness(ComboboxHarness);

    // Open the dropdown
    await select.open();

    // Get the listbox harness from the popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    expect(await listbox.isMulti()).toBe(true);

    const options = await listbox.getOptions();

    // Select first and second options
    await options[0].click();
    await options[1].click();

    // Verify both options are selected
    expect(await options[0].isSelected()).toBe(true);
    expect(await options[1].isSelected()).toBe(true);

    // Close the dropdown
    await select.close();

    // Verify value is updated (e.g., comma separated list or count)
    expect(await (await select.host()).text()).toContain('Option 1, Option 2');
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
