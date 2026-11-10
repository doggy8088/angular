<docs-decorative-header title="Listbox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox 模式"/>
  <docs-pill href="/api?query=listbox#angular_aria_listbox" title="Listbox API 參考"/>
</docs-pill-row>

## 概觀

這個指令會顯示一份選項清單供使用者選取，支援鍵盤導覽、單選或多選，以及螢幕閱讀器支援。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 用法

Listbox 是 [Select](guide/aria/select)、[Multiselect](guide/aria/multiselect) 與 [Autocomplete](guide/aria/autocomplete) 模式所使用的基礎指令。對於大多數下拉清單需求，請改用那些已文件化的模式。

在下列情況可以考慮直接使用 listbox：

- **建置自訂的選取元件**：建立具有特定行為的專門介面
- **可見的選取清單**：把可選取的項目直接顯示在頁面上（不是放在下拉清單裡）
- **自訂整合模式**：與獨特的彈出視窗或版面配置需求整合

在下列情況避免使用 listbox：

- **需要導覽選單**：請使用 [Menu](guide/aria/menu) 指令來處理動作與指令

## 功能

Angular 的 listbox 提供完整無障礙的清單實作，包含：

- **鍵盤導覽**：用方向鍵瀏覽選項、用 Enter 或空白鍵選取
- **螢幕閱讀器支援**：內建 ARIA 屬性，包括 role="listbox"
- **單選或多選**：`multi` 屬性控制選取模式
- **水平或垂直**：`orientation` 屬性控制版面方向
- **預先輸入搜尋**：輸入字元即可跳到相符的選項
- **以訊號為基礎的反應性**：使用 Angular 訊號進行反應式狀態管理

## 範例

### 基本 listbox

應用程式有時需要把可選取的清單直接顯示在頁面上，而不是藏在下拉清單裡。獨立的 listbox 為這些可見的清單介面提供鍵盤導覽與選取功能。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

`values` 模型訊號提供與已選取項目的雙向繫結。在 `selectionMode="explicit"` 之下，使用者按空白鍵或 Enter 來選取選項。把 listbox 與 combobox 及覆蓋層定位結合的下拉清單模式，請參閱 [Select](guide/aria/select) 模式。

### 水平 listbox

清單有時以水平方式呈現效果更好，例如類似工具列的介面或分頁式的選取。`orientation` 屬性會同時改變版面配置與鍵盤導覽方向。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

在 `orientation="horizontal"` 之下，左右方向鍵會在選項之間瀏覽，而不是上下方向鍵。Listbox 會自動處理由右至左（RTL）的語言，做法是反轉導覽方向。

### 選取模式

Listbox 支援兩種選取模式，用來控制項目在什麼時候被選取。

`'follow'` 模式會自動選取取得焦點的項目，在選取頻繁變更時提供更快的互動。`'explicit'` 模式則需要用空白鍵或 Enter 確認選取，避免在瀏覽時不小心變更。下拉清單模式在單選時通常使用 `'follow'` 模式。

#### Explicit

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.html" />
</docs-code-multifile>

#### Follow

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.html" />
</docs-code-multifile>

| 模式         | 說明                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `'follow'`   | 在選取頻繁變更時，會自動選取取得焦點的項目，提供更快的互動                                               |
| `'explicit'` | 需要用空白鍵或 Enter 確認選取，避免在瀏覽時不小心變更                                                     |

TIP: 下拉清單模式在單選時通常使用 `'follow'` 模式。

## API {#apis}

### Listbox 指令

`ngListbox` 指令建立可供選取選項的無障礙清單。

#### 輸入屬性

| 屬性             | 型別                               | 預設值       | 說明                             |
| ---------------- | ---------------------------------- | ------------ | -------------------------------- |
| `id`             | `string`                           | auto         | listbox 的唯一識別碼             |
| `multi`          | `boolean`                          | `false`      | 啟用多選                         |
| `orientation`    | `'vertical' \| 'horizontal'`       | `'vertical'` | 清單的版面方向                   |
| `wrap`           | `boolean`                          | `true`       | 焦點是否在清單邊緣繞回           |
| `selectionMode`  | `'follow' \| 'explicit'`           | `'follow'`   | 選取的觸發方式                   |
| `focusMode`      | `'roving' \| 'activedescendant'`   | `'roving'`   | 焦點管理策略                     |
| `softDisabled`   | `boolean`                          | `true`       | 停用項目是否可以取得焦點         |
| `disabled`       | `boolean`                          | `false`      | 停用整個 listbox                 |
| `readonly`       | `boolean`                          | `false`      | 把 listbox 設為唯讀               |
| `typeaheadDelay` | `number`                           | `500`        | 搶先輸入搜尋重置前的毫秒數       |

#### 模型

| 屬性     | 型別  | 說明                 |
| -------- | ----- | -------------------- |
| `values` | `V[]` | 可雙向繫結的已選取值陣列 |

#### 訊號

| 屬性     | 型別          | 說明                   |
| -------- | ------------- | ---------------------- |
| `values` | `Signal<V[]>` | 目前已選取的值（訊號形式） |

#### 方法

| 方法                       | 參數                              | 說明                     |
| -------------------------- | --------------------------------- | ------------------------ |
| `scrollActiveItemIntoView` | `options?: ScrollIntoViewOptions` | 把作用中項目捲動到可見範圍 |
| `gotoFirst`                | 無                                | 導覽到 listbox 的第一個項目 |

### Option 指令

`ngOption` 指令標記 listbox 中的項目。

#### 輸入屬性

| 屬性       | 型別      | 預設值  | 說明                         |
| ---------- | --------- | ------- | ---------------------------- |
| `id`       | `string`  | auto    | 選項的唯一識別碼             |
| `value`    | `V`       | -       | 與此選項關聯的值（必填）     |
| `label`    | `string`  | -       | 供螢幕閱讀器使用的選用標籤   |
| `disabled` | `boolean` | `false` | 此選項是否停用               |

#### 訊號

| 屬性       | 型別              | 說明             |
| ---------- | ----------------- | ---------------- |
| `selected` | `Signal<boolean>` | 此選項是否已選取 |
| `active`   | `Signal<boolean>` | 此選項是否取得焦點 |

### 相關模式

Listbox 被下列已文件化的下拉清單模式使用：

- **[Select](guide/aria/select)**：使用唯讀 combobox 加上 listbox 的單選下拉清單模式
- **[Multiselect](guide/aria/multiselect)**：使用唯讀 combobox 加上 listbox 與 `multi` 的多選下拉清單模式
- **[Autocomplete](guide/aria/autocomplete)**：使用 combobox 加上 listbox 的可篩選下拉清單模式

若需要包含觸發器、彈出視窗與覆蓋層定位的完整下拉清單模式，請參閱那些模式指南，不要只單獨使用 listbox。

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox ARIA 模式"/>
  <docs-pill href="/api/aria/listbox/Listbox" title="Listbox API 參考"/>
</docs-pill-row>
