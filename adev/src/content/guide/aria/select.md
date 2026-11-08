# Select

## 概述

這個模式將 combobox 與 listbox 結合，建立支援鍵盤導覽與螢幕閱讀器的單選下拉選單。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 用法

當使用者需要從一組熟悉的選項中選取單一值時，選取模式最為合適。

在下列情況可以考慮使用這個模式：

- **選項清單固定**（少於 20 個項目）：使用者不需篩選就能瀏覽並選擇
- **選項為人熟悉**：使用者能辨識選項，不需要搜尋
- **表單需要標準欄位**：國家、州、分類或狀態等選取欄位
- **設定與組態**：偏好設定或選項的下拉選單
- **選項標籤清楚**：每個選項都有獨特且容易瀏覽的名稱

在下列情況應避免使用這個模式：

- **清單超過 20 個項目**：改用 [Autocomplete 模式](guide/aria/autocomplete)，篩選效果更好
- **使用者需要搜尋選項**：[Autocomplete](guide/aria/autocomplete) 提供文字輸入與篩選
- **需要多選**：改用 [Multiselect 模式](guide/aria/multiselect)
- **選項非常少**（2-3 個）：選項按鈕能讓所有選項一目了然

## 功能

選取模式結合 [Combobox](guide/aria/combobox) 與 [Listbox](guide/aria/listbox) 指令，提供完全無障礙的下拉選單，功能包括：

- **鍵盤導覽**：用方向鍵導覽選項、用 Enter 選取、用 Escape 關閉
- **螢幕閱讀器支援**：為輔助技術內建 ARIA 屬性
- **自訂顯示**：以圖示、格式或豐富內容顯示選取的值
- **以訊號為基礎的反應式機制**：使用 Angular 訊號管理反應式狀態
- **智慧定位**：由 CDK Overlay 處理視窗邊緣與捲動
- **雙向文字支援**：自動處理由右至左（RTL）語言

## 範例

### 基本選取

使用者需要標準的下拉選單來從一份值清單中選擇。combobox 搭配 listbox，能提供熟悉的選取體驗，並具備完整的無障礙支援。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

將 `ngCombobox` 指令直接套用在非互動的宿主元素（例如 `div` 或 `button`）上，而不是 `<input>` 上，就能防止文字輸入。使用者以方向鍵與 Enter 操作下拉選單，就像原生的 select 元素一樣。

### 具備自訂顯示的選取

選項通常需要圖示或徽章等視覺標示，協助使用者快速辨識選項。選項內的自訂範本能提供豐富的格式，同時維持無障礙。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

每個選項都會在標籤旁顯示一個圖示。選取的值會更新為所選選項的圖示與文字，提供清楚的視覺回饋。

### 停用選取

當某些表單條件未滿足時，可以停用選取欄位以防止使用者互動。停用狀態會提供視覺回饋，並防止鍵盤互動。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

停用時，選取欄位會顯示停用的視覺狀態，並阻擋所有使用者互動。螢幕閱讀器會向輔助技術使用者播報停用狀態。

## 測試

選取模式可以使用 `@angular/aria/combobox/testing` 的 `ComboboxHarness` 與 `@angular/aria/listbox/testing` 的 `ListboxHarness` 組合來測試。
以下範例示範如何使用這些測試工具來測試選取元件：

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MySelectComponent} from './my-select'; // Your component

describe('MySelectComponent', () => {
  let fixture: ComponentFixture<MySelectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MySelectComponent],
    });

    fixture = TestBed.createComponent(MySelectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting an option', async () => {
    // Load the combobox harness (which acts as the select trigger)
    const select = await loader.getHarness(ComboboxHarness);

    // Verify it is closed initially
    expect(await select.isOpen()).toBe(false);

    // Open the dropdown
    await select.open();
    expect(await select.isOpen()).toBe(true);

    // Get the listbox harness from the popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();
    expect(options.length).toBe(3);

    // Click the second option
    await options[1].click();

    // Verify the dropdown closed and the value updated
    expect(await select.isOpen()).toBe(false);
    expect(await (await select.host()).text()).toContain('Option 2');
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

### 定位

選取模式與 [CDK Overlay](https://material.angular.dev/cdk/overlay/overview) 整合，以進行智慧定位。使用 `cdkConnectedOverlay` 可自動處理視窗邊緣與捲動。
