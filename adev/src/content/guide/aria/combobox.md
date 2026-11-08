# Combobox

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Combobox ARIA 模式"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Combobox API 參考"/>
</docs-pill-row>

## 概觀

這個指令負責協調觸發元素（例如文字輸入框、按鈕或 `div`）與彈出視窗，提供自動完成、選取與多選模式所用的基礎指令。

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

## 用法

Combobox 是負責協調互動式觸發元素（例如文字輸入框、按鈕或 `div`）與彈出視窗的基礎指令。它是自動完成、選取與多選模式的基礎。在下列情況可以考慮直接使用 combobox：

- **建置自訂的自動完成模式**：建立專門的篩選或建議行為
- **建立自訂的選取元件**：開發具有獨特需求的下拉清單
- **協調輸入與彈出視窗**：把文字輸入與 listbox、tree 或 dialog 內容配對
- **實作自訂篩選**：在使用者程式碼中篩選並調度相符的選項

在下列情況，請改用已文件化的模式：

- 需要標準的自動完成與篩選功能：請參閱 [Autocomplete 模式](guide/aria/autocomplete)，裡面有可直接使用的範例
- 需要單選下拉清單：請參閱 [Select 模式](guide/aria/select)，裡面有完整的下拉清單實作
- 需要多選下拉清單：請參閱 [Multiselect 模式](guide/aria/multiselect)，了解以精簡顯示呈現的多選功能

NOTE: [Autocomplete](guide/aria/autocomplete)、[Select](guide/aria/select) 與 [Multiselect](guide/aria/multiselect) 指南展示了已文件化的模式，它們把這個指令與 [Listbox](guide/aria/listbox) 結合，用於特定的使用情境。

## 功能

Angular 的 combobox 提供完整無障礙的輸入與彈出視窗協調系統，包含：

- **觸發元素與彈出視窗**：協調觸發元素與彈出內容
- **彈性的協調方式**：與標準版面配置無縫整合（listbox、tree、grid 或 dialog）
- **鍵盤導覽**：處理方向鍵、Enter 與 Escape
- **螢幕閱讀器支援**：內建 ARIA 屬性，包括 role="combobox" 與 aria-expanded
- **彈出視窗管理**：依使用者互動自動顯示或隱藏
- **以訊號為基礎的反應性**：使用 Angular 訊號進行反應式狀態管理

## 範例

### Autocomplete

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

篩選是在使用者程式碼中管理的，做法是更新一個訊號，由它反應式地篩選選項清單。使用者用方向鍵瀏覽、用 Enter 或點選來選取。這提供了完整的控制權，以及為自訂選取邏輯保留最大的彈性。完整的篩選模式與範例，請參閱 [Autocomplete 指南](guide/aria/autocomplete)。

### 唯讀模式

這個模式把唯讀的 combobox 與 listbox 結合，建立具有鍵盤導覽與螢幕閱讀器支援的單選下拉清單。

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

不必輸入文字也能觸發下拉清單，做法是使用按鈕作為主機觸發元素，或是把原生 HTML `readonly` 屬性套用到輸入觸發元素上。彈出視窗會在點選或按方向鍵時開啟。

這個設定是 [Select](guide/aria/select) 與 [Multiselect](guide/aria/multiselect) 模式的基礎。完整的下拉清單實作（包含觸發器與覆蓋層定位），請參閱那些指南。

### 日期選擇器格線

Combobox 可以與二維格線協調，建立無障礙的日期選擇器。使用者用方向鍵在行事曆格線表格中瀏覽日期，並以點選、Enter 或空白鍵確認選取。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 對話框彈出視窗

對話框彈出視窗把 combobox 觸發器與標準的對話框版面配置和焦點陷阱（例如 CDK 的 `cdkTrapFocus`）結合。當覆蓋層需要強制回應行為或背景互動時，請使用對話框彈出視窗。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 測試

Angular Aria 提供 `ComboboxHarness`，可用來測試 combobox 元件。
以下範例示範如何在元件測試中使用這個元件測試工具：

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {MyComboboxComponent} from './my-combobox'; // Your component

describe('MyComboboxComponent', () => {
  let fixture: ComponentFixture<MyComboboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyComboboxComponent],
    });

    fixture = TestBed.createComponent(MyComboboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow opening and closing the popup', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Verify initial state
    expect(await combobox.isOpen()).toBe(false);

    // Open the popup
    await combobox.open();
    expect(await combobox.isOpen()).toBe(true);

    // Close the popup
    await combobox.close();
    expect(await combobox.isOpen()).toBe(false);
  });
});
```

## API 參考

如需詳細的 API 文件，請查看下列 API 參考：

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)

### 相關模式與指令

Combobox 是下列已文件化模式的基礎指令：

- [Autocomplete](guide/aria/autocomplete)：篩選與建議模式（協調輸入打字與選項清單）
- [Select](guide/aria/select)：單選下拉清單模式（直接套用在不可編輯的按鈕觸發器上）
- [Multiselect](guide/aria/multiselect)：多選模式（套用在不可編輯的觸發器上，搭配啟用多選的 Listbox）

Combobox 通常會與下列項目結合：

- [Listbox](guide/aria/listbox)：最常見的彈出內容
- [Tree](guide/aria/tree)：階層式彈出內容（範例請參閱 Tree 指南）
