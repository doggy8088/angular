<docs-decorative-header title="Menu">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menu ARIA 模式"/>
  <docs-pill href="/api/aria/menu/Menu" title="Menu API 參考文件"/>
</docs-pill-row>

## 概述

選單提供一份可供使用者選取的動作或選項清單，通常在點選按鈕或按右鍵時出現。選單支援用方向鍵進行鍵盤導覽，也支援子選單、核取方塊、選項按鈕與停用項目。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 用法

選單很適合呈現可供使用者選取的動作或指令清單。

**適合使用選單的情況**：

- 建立應用程式指令選單（File、Edit、View）
- 建立內容選單（按右鍵執行的動作）
- 顯示下拉式動作清單
- 實作工具列下拉選單
- 組織設定或選項

**避免使用選單的情況**：

- 建立網站導覽（改用導覽地標）
- 建立表單選取欄位（改用 [Select](guide/aria/select) 元件）
- 在內容面板之間切換（改用 [Tabs](guide/aria/tabs)）
- 顯示可收合的內容（改用 [Accordion](guide/aria/accordion)）

## 功能

- **鍵盤導覽**：用方向鍵、Home/End 與字元搜尋，導覽更有效率
- **子選單**：支援巢狀選單，並自動定位
- **選單類型**：獨立選單、觸發式選單與功能表列
- **核取方塊與選項按鈕**：可切換與可選取的選單項目
- **停用項目**：軟停用或硬停用狀態，並管理焦點
- **自動關閉行為**：可設定選取後是否關閉
- **RTL 支援**：支援由右至左語言的導覽

## 範例

### 搭配觸發器的選單

將觸發按鈕與選單配成一組，就能建立下拉選單。觸發器負責開啟與關閉選單。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

使用者選取項目或按下 Escape 時，選單會自動關閉。

### 內容選單

當使用者在元素上按右鍵時，內容選單會出現在游標位置。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.html"/>
</docs-code-multifile>

使用 `contextmenu` 事件的座標來定位選單。

### 獨立選單

獨立選單不需要觸發器，會一直顯示在介面中。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

獨立選單很適合用在隨時可見的動作清單或導覽上。

### 停用選單項目

使用 `disabled` 輸入屬性停用個別選單項目，並用 `softDisabled` 控制其焦點行為。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

當 `[softDisabled]="true"` 時，停用項目可以取得焦點，但無法啟用。當 `[softDisabled]="false"` 時，鍵盤導覽會跳過停用項目。

## API {#apis}

### Menu

選單項目的容器指令。

#### 輸入屬性

| 屬性           | 型別      | 預設值 | 說明                                       |
| -------------- | --------- | ------ | ------------------------------------------ |
| `disabled`     | `boolean` | `false` | 停用選單中的所有項目                       |
| `wrap`         | `boolean` | `true`  | 鍵盤導覽是否在邊緣繞回                     |
| `softDisabled` | `boolean` | `true`  | 為 `true` 時，停用項目可取得焦點但無法互動 |

#### 方法

| 方法    | 參數 | 說明     |
| ------- | ---- | -------- |
| `close` | 無   | 關閉選單 |

### MenuBar

多個選單的水平容器。

#### 輸入屬性

| 屬性           | 型別      | 預設值  | 說明                                       |
| -------------- | --------- | ------- | ------------------------------------------ |
| `disabled`     | `boolean` | `false` | 停用整個功能表列                           |
| `wrap`         | `boolean` | `true`  | 鍵盤導覽是否在邊緣繞回                     |
| `softDisabled` | `boolean` | `true`  | 為 `true` 時，停用項目可取得焦點但無法互動 |

### MenuItem {#menuitem}

選單中的個別項目。

#### 輸入屬性

| 屬性         | 型別      | 預設值 | 說明                                   |
| ------------ | --------- | ------ | -------------------------------------- |
| `value`      | `any`     | —      | **必填**。此項目的值                   |
| `disabled`   | `boolean` | `false` | 停用此選單項目                         |
| `submenu`    | `Menu`    | —      | 子選單的參照                           |
| `searchTerm` | `string`  | `''`   | 搶先輸入用的搜尋詞（支援雙向繫結）     |

#### 訊號

| 屬性       | 型別              | 說明                 |
| ---------- | ----------------- | -------------------- |
| `active`   | `Signal<boolean>` | 項目目前是否取得焦點 |
| `expanded` | `Signal<boolean>` | 子選單是否展開       |
| `hasPopup` | `Signal<boolean>` | 項目是否有關聯的子選單 |

NOTE: MenuItem 不公開任何方法。使用 `submenu` 輸入屬性把子選單與選單項目關聯起來。

### MenuTrigger {#menutrigger}

開啟選單的按鈕或元素。

#### 輸入屬性

| 屬性           | 型別      | 預設值  | 說明                                 |
| -------------- | --------- | ------- | ------------------------------------ |
| `menu`         | `Menu`    | —       | **必填**。要觸發的選單               |
| `disabled`     | `boolean` | `false` | 停用觸發器                           |
| `softDisabled` | `boolean` | `true`  | 為 `true` 時，停用的觸發器可取得焦點 |

#### 訊號

| 屬性       | 型別              | 說明                     |
| ---------- | ----------------- | ------------------------ |
| `expanded` | `Signal<boolean>` | 選單目前是否開啟         |
| `hasPopup` | `Signal<boolean>` | 觸發器是否有關聯的選單   |

#### 方法

| 方法     | 參數 | 說明             |
| -------- | ---- | ---------------- |
| `open`   | 無   | 開啟選單         |
| `close`  | 無   | 關閉選單         |
| `toggle` | 無   | 切換選單開關狀態 |
