<docs-decorative-header title="Autocomplete">
</docs-decorative-header>

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
- **三種篩選模式**：可在自動選取、手動選取與醒目提示行為之間選擇
- **以訊號為基礎的反應性**：使用 Angular 訊號進行反應式狀態管理
- **Popover API 整合**：運用原生 HTML Popover API 達成最佳定位
- **雙向文字支援**：自動處理由右至左（RTL）的語言

## 範例

### 自動選取模式 {#auto-select-mode}

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

## API {#apis}

### Combobox 指令

`ngCombobox` 指令提供自動完成功能的容器。

#### 輸入屬性

| 屬性         | 型別                                           | 預設值     | 說明                         |
| ------------ | ---------------------------------------------- | ---------- | ---------------------------- |
| `filterMode` | `'auto-select'` \| `'manual'` \| `'highlight'` | `'manual'` | 控制選取行為                 |
| `disabled`   | `boolean`                                      | `false`    | 停用 combobox                |
| `firstMatch` | `string`                                       | -          | 彈出視窗中第一個符合項目的值 |

#### 輸出

| 屬性       | 型別              | 說明                     |
| ---------- | ----------------- | ------------------------ |
| `expanded` | `Signal<boolean>` | 表示彈出視窗目前是否開啟的訊號 |

### ComboboxInput 指令

`ngComboboxInput` 指令把輸入元素連接到 combobox。

#### 模型

| 屬性    | 型別     | 說明                                     |
| ------- | -------- | ---------------------------------------- |
| `value` | `string` | 使用 `[(value)]` 雙向繫結的輸入字串值    |

### ComboboxPopupContainer 指令

`ngComboboxPopupContainer` 指令包裹彈出內容並管理其顯示。

必須在 popover 元素內搭配 `<ng-template>` 使用。

### 相關元件

自動完成使用 [Listbox](/api/aria/listbox/Listbox) 與 [Option](/api/aria/listbox/Option) 指令來渲染建議清單。更多自訂選項請見 [Listbox 文件](/guide/aria/listbox)。
