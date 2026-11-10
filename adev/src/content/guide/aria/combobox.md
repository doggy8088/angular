<docs-decorative-header title="Combobox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Combobox ARIA 模式"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Combobox API 參考"/>
</docs-pill-row>

## 概觀

這個指令負責協調文字輸入與彈出視窗，提供自動完成、選取與多選模式所用的基礎指令。

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

Combobox 是負責協調文字輸入與彈出視窗的基礎指令。它是自動完成、選取與多選模式的基礎。在下列情況可以考慮直接使用 combobox：

- **建置自訂的自動完成模式**：建立專門的篩選或建議行為
- **建立自訂的選取元件**：開發具有獨特需求的下拉清單
- **協調輸入與彈出視窗**：把文字輸入與 listbox、tree 或 dialog 內容配對
- **實作特定的篩選模式**：使用手動、自動選取或醒目提示行為

在下列情況，請改用已文件化的模式：

- 需要標準的自動完成與篩選功能：請參閱 [Autocomplete 模式](guide/aria/autocomplete)，裡面有可直接使用的範例
- 需要單選下拉清單：請參閱 [Select 模式](guide/aria/select)，裡面有完整的下拉清單實作
- 需要多選下拉清單：請參閱 [Multiselect 模式](guide/aria/multiselect)，了解以精簡顯示呈現的多選功能

NOTE: [Autocomplete](guide/aria/autocomplete)、[Select](guide/aria/select) 與 [Multiselect](guide/aria/multiselect) 指南展示了已文件化的模式，它們把這個指令與 [Listbox](guide/aria/listbox) 結合，用於特定的使用情境。

## 功能

Angular 的 combobox 提供完整無障礙的輸入與彈出視窗協調系統，包含：

- **文字輸入與彈出視窗**：協調輸入欄位與彈出內容
- **三種篩選模式**：手動、自動選取或醒目提示行為
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

`filterMode="manual"` 設定讓你能完整控制篩選與選取。輸入會更新一個訊號，由它篩選選項清單。使用者用方向鍵瀏覽、用 Enter 或點選來選取。這個模式為自訂篩選邏輯提供了最大的彈性。完整的篩選模式與範例，請參閱 [Autocomplete 指南](guide/aria/autocomplete)。

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

`readonly` 屬性可防止在輸入欄位中打字。彈出視窗會在點選或按方向鍵時開啟。使用者以鍵盤瀏覽選項，並用 Enter 或點選來選取。

這個設定是 [Select](guide/aria/select) 與 [Multiselect](guide/aria/multiselect) 模式的基礎。完整的下拉清單實作（包含觸發器與覆蓋層定位），請參閱那些指南。

### 對話框彈出視窗

彈出視窗有時需要搭配背景與焦點陷阱的強制回應行為。combobox 的對話框指令為特殊使用情境提供了這個模式。

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

`ngComboboxDialog` 指令使用原生 dialog 元素建立強制回應的彈出視窗，提供背景行為與焦點陷阱。當選取介面需要強制回應互動，或彈出內容複雜到需要全螢幕焦點時，請使用對話框彈出視窗。

## API {#apis}

### Combobox 指令

`ngCombobox` 指令負責協調文字輸入與彈出視窗。

#### 輸入屬性

| 屬性             | 型別                                           | 預設值     | 說明                             |
| ---------------- | ---------------------------------------------- | ---------- | -------------------------------- |
| `filterMode`     | `'manual'` \| `'auto-select'` \| `'highlight'` | `'manual'` | 控制選取行為                     |
| `disabled`       | `boolean`                                      | `false`    | 停用 combobox                    |
| `readonly`       | `boolean`                                      | `false`    | 把 combobox 設為唯讀（供 Select/Multiselect 使用） |
| `firstMatch`     | `V`                                            | -          | 自動選取時第一個符合項目的值     |
| `alwaysExpanded` | `boolean`                                      | `false`    | 讓彈出視窗保持開啟               |

**篩選模式**：

- **`'manual'`**：由使用者明確控制篩選與選取。彈出視窗依你的篩選邏輯顯示選項。使用者以 Enter 或點選來選取。這個模式提供最大的彈性。
- **`'auto-select'`**：使用者輸入時，輸入值會自動更新為第一個符合的選項。需要透過 `firstMatch` 輸入屬性來協調。範例請參閱 [Autocomplete 指南](guide/aria/autocomplete#auto-select-mode)。
- **`'highlight'`**：醒目提示符合的文字，但不變更輸入值。使用者以方向鍵瀏覽，並用 Enter 選取。

#### 訊號

| 屬性       | 型別              | 說明                 |
| ---------- | ----------------- | -------------------- |
| `expanded` | `Signal<boolean>` | 彈出視窗目前是否開啟 |

#### 方法

| 方法       | 參數 | 說明           |
| ---------- | ---- | -------------- |
| `open`     | 無   | 開啟 combobox  |
| `close`    | 無   | 關閉 combobox  |
| `expand`   | 無   | 展開 combobox  |
| `collapse` | 無   | 收合 combobox  |

### ComboboxInput 指令

`ngComboboxInput` 指令把輸入元素連接到 combobox。

#### 模型

| 屬性    | 型別     | 說明                              |
| ------- | -------- | --------------------------------- |
| `value` | `string` | 使用 `[(value)]` 雙向繫結的值     |

輸入元素會自動獲得鍵盤處理與 ARIA 屬性。

### ComboboxPopup 指令

`ngComboboxPopup` 指令（主機指令）管理彈出視窗的可見性與協調。通常在 `ng-template` 中搭配 `ngComboboxPopupContainer` 使用，或搭配 CDK Overlay 使用。

### ComboboxPopupContainer 指令

`ngComboboxPopupContainer` 指令把 `ng-template` 標記為彈出內容。

```html
<ng-template ngComboboxPopupContainer>
  <div ngListbox>...</div>
</ng-template>
```

搭配 Popover API 或 CDK Overlay 來定位。

### ComboboxDialog 指令

`ngComboboxDialog` 指令建立強制回應的 combobox 彈出視窗。

```html
<dialog ngComboboxDialog>
  <div ngListbox>...</div>
</dialog>
```

用於需要背景與焦點陷阱的強制回應彈出行為。

### 相關模式與指令

Combobox 是下列已文件化模式的基礎指令：

- **[Autocomplete](guide/aria/autocomplete)**：篩選與建議模式（搭配篩選模式使用 Combobox）
- **[Select](guide/aria/select)**：單選下拉清單模式（搭配 `readonly` 使用 Combobox）
- **[Multiselect](guide/aria/multiselect)**：多選模式（搭配 `readonly` 與啟用多選的 Listbox 使用 Combobox）

Combobox 通常會與下列項目結合：

- **[Listbox](guide/aria/listbox)**：最常見的彈出內容
- **[Tree](guide/aria/tree)**：階層式彈出內容（範例請參閱 Tree 指南）
