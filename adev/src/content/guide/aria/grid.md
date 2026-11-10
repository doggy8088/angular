<docs-decorative-header title="Grid">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="Grid ARIA 模式"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="Grid API 參考"/>
</docs-pill-row>

## 概觀

格線讓使用者可以使用方向鍵、Home、End 與 Page Up/Down，瀏覽二維資料或互動元素。格線適用於資料表、行事曆、試算表，以及把相關互動元素分組的版面配置模式。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## 用法

當資料或互動元素以列與欄的方式組織、而使用者需要在多個方向上進行鍵盤導覽時，格線就很好用。

**適合使用格線的情況**：

- 建立具有可編輯或可選取儲存格的互動式資料表
- 建立行事曆或日期選擇器
- 實作類似試算表的介面
- 把互動元素（按鈕、核取方塊）分組，減少頁面上的 Tab 停靠點
- 建立需要二維鍵盤導覽的介面

**避免使用格線的情況**：

- 顯示簡單的唯讀表格（請改用語意化的 HTML `<table>`）
- 顯示單欄清單（請改用 [Listbox](guide/aria/listbox)）
- 顯示階層式資料（請改用 [Tree](guide/aria/tree)）
- 建立沒有表格版面配置的表單（請使用標準表單控制項）

## 功能

- **二維導覽**：方向鍵可以在所有方向上於儲存格之間移動
- **焦點模式**：可以在 roving tabindex 或 activedescendant 這兩種焦點策略之間選擇
- **選取支援**：選擇性的儲存格選取，支援單選或多選模式
- **換行行為**：設定導覽在格線邊緣如何換行（continuous、loop 或 nowrap）
- **範圍選取**：使用輔助鍵或拖曳選取多個儲存格
- **停用狀態**：停用整個格線或個別儲存格
- **RTL 支援**：自動支援由右至左語言的導覽

## 範例

### 資料表格線

對於使用者需要用方向鍵在儲存格之間瀏覽的互動式表格，請使用格線。這個範例示範一個具有鍵盤導覽的基本資料表。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

把 `ngGrid` 指令套用到表格元素，把 `ngGridRow` 套用到每一列，把 `ngGridCell` 套用到每個儲存格。

### 行事曆格線

行事曆是格線常見的使用情境。這個範例示範月檢視畫面，使用者可以用方向鍵瀏覽日期。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

當焦點在某個儲存格上時，使用者可以按 Enter 或空白鍵來啟用日期。

### 版面配置格線

使用版面配置格線把互動元素分組，減少 Tab 停靠點。這個範例示範一組膠囊按鈕組成的格線。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

使用者不必逐一用 Tab 逐個經過每個按鈕，而是用方向鍵瀏覽，只有一個按鈕會接收 Tab 焦點。

### 選取與焦點模式

把 `[enableSelection]="true"` 設好來啟用選取，並設定焦點與選取如何互動。

```angular-html
<table
  ngGrid
  [enableSelection]="true"
  [selectionMode]="'explicit'"
  [multi]="true"
  [focusMode]="'roving'"
>
  <tr ngGridRow>
    <td ngGridCell>Cell 1</td>
    <td ngGridCell>Cell 2</td>
  </tr>
</table>
```

**選取模式**：

- `follow`：取得焦點的儲存格會自動被選取
- `explicit`：使用者用空白鍵或點選來選取儲存格

**焦點模式**：

- `roving`：焦點使用 `tabindex` 在儲存格之間移動（較適合簡單的格線）
- `activedescendant`：焦點停留在格線容器上，`aria-activedescendant` 會指出目前作用中的儲存格（較適合虛擬捲動）

## API {#apis}

### Grid

為列與儲存格提供鍵盤導覽與焦點管理的容器指令。

#### 輸入屬性

| 屬性                   | 型別                                 | 預設值     | 說明                                       |
| ---------------------- | ------------------------------------ | ---------- | ------------------------------------------ |
| `enableSelection`      | `boolean`                            | `false`    | 格線是否啟用選取                           |
| `disabled`             | `boolean`                            | `false`    | 停用整個格線                               |
| `softDisabled`         | `boolean`                            | `true`     | 為 `true` 時，停用儲存格可取得焦點但無法互動 |
| `focusMode`            | `'roving' \| 'activedescendant'`     | `'roving'` | 格線使用的焦點策略                         |
| `rowWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`   | 沿列導覽時的繞回行為                       |
| `colWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`   | 沿欄導覽時的繞回行為                       |
| `multi`                | `boolean`                            | `false`    | 是否可選取多個儲存格                       |
| `selectionMode`        | `'follow' \| 'explicit'`             | `'follow'` | 選取是否跟隨焦點，或需要明確的操作         |
| `enableRangeSelection` | `boolean`                            | `false`    | 啟用以輔助鍵或拖曳進行的範圍選取           |

### GridRow

代表格線中的一列，是格線儲存格的容器。

#### 輸入屬性

| 屬性       | 型別     | 預設值 | 說明                 |
| ---------- | -------- | ------ | -------------------- |
| `rowIndex` | `number` | auto   | 此列在格線中的索引   |

### GridCell

代表格線列中的個別儲存格。

#### 輸入屬性

| 屬性          | 型別                         | 預設值         | 說明                                       |
| ------------- | ---------------------------- | -------------- | ------------------------------------------ |
| `id`          | `string`                     | auto           | 儲存格的唯一識別碼                         |
| `role`        | `string`                     | `'gridcell'`   | 儲存格角色：`gridcell`、`columnheader` 或 `rowheader` |
| `disabled`    | `boolean`                    | `false`        | 停用此儲存格                               |
| `selected`    | `boolean`                    | `false`        | 儲存格是否已選取（支援雙向繫結）           |
| `selectable`  | `boolean`                    | `true`         | 儲存格是否可以選取                         |
| `rowSpan`     | `number`                     | —              | 儲存格跨越的列數                           |
| `colSpan`     | `number`                     | —              | 儲存格跨越的欄數                           |
| `rowIndex`    | `number`                     | —              | 儲存格的列索引                             |
| `colIndex`    | `number`                     | —              | 儲存格的欄索引                             |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | 儲存格內小工具的方向                       |
| `wrap`        | `boolean`                    | `true`         | 儲存格內的小工具導覽是否繞回               |

#### 訊號

| 屬性     | 型別              | 說明                   |
| -------- | ----------------- | ---------------------- |
| `active` | `Signal<boolean>` | 儲存格目前是否取得焦點 |
