<docs-decorative-header title="Menubar">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menubar ARIA 模式"/>
  <docs-pill href="/api/aria/menu/MenuBar" title="Menubar API 參考文件"/>
</docs-pill-row>

## 概述

功能表列是一條水平導覽列，讓使用者能隨時取用應用程式選單。功能表列將指令組織成 File、Edit、View 等邏輯分類，協助使用者透過鍵盤或滑鼠探索並執行應用程式功能。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 用法

功能表列很適合將應用程式指令組織成常駐且容易探索的導覽。

**適合使用功能表列的情況**：

- 建立應用程式指令列（例如 File、Edit、View、Insert、Format）
- 建立在整個介面中持續可見的導覽
- 將指令組織成邏輯清晰的頂層分類
- 需要支援鍵盤的水平選單導覽
- 建立桌面風格的應用程式介面

**避免使用功能表列的情況**：

- 為個別動作建立下拉選單（改用[搭配觸發器的 Menu](guide/aria/menu)）
- 建立內容選單（改用 [Menu](guide/aria/menu) 指南模式）
- 簡單的獨立動作清單（改用 [Menu](guide/aria/menu)）
- 水平空間有限的行動介面
- 導覽應放在側邊欄或頁首導覽模式中

## 功能

- **水平導覽**：用左/右方向鍵在頂層分類之間移動
- **持續可見**：永遠顯示，不是強制回應視窗，也無法關閉
- **懸停開啟**：首次以鍵盤或點選互動後，子選單會在懸停時開啟
- **巢狀子選單**：支援多層選單深度
- **鍵盤導覽**：方向鍵、Enter/Space、Escape，以及搶先輸入搜尋（typeahead）
- **停用狀態**：可停用整個功能表列或個別項目
- **RTL 支援**：自動支援由右至左語言的導覽

## 範例

### 基本功能表列

功能表列讓使用者能隨時取用依頂層分類組織的應用程式指令。使用者用左/右方向鍵在分類之間移動，並用 Enter 或下方向鍵開啟選單。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

按下右方向鍵可在 File、Edit 與 View 之間移動。按下 Enter 或下方向鍵可開啟選單，並用上/下方向鍵導覽子選單項目。

### 停用功能表列項目

停用個別選單項目或整個功能表列，以防止互動。使用 `softDisabled` 輸入屬性控制停用項目是否能取得鍵盤焦點。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

當功能表列的 `[softDisabled]="true"` 時，停用項目可以取得焦點，但無法啟用。當 `[softDisabled]="false"` 時，鍵盤導覽會跳過停用項目。

### RTL 支援

功能表列會自動適應由右至左（RTL）語言。方向鍵導覽會反轉方向，子選單則定位在左側。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`dir="rtl"` 屬性可啟用 RTL 模式。左方向鍵改為往右移動、右方向鍵改為往左移動，讓 RTL 語言使用者能自然地導覽。

## API {#apis}

功能表列模式使用 Angular Aria 程式庫中的指令。完整的 API 文件請見 [Menu 指南](guide/aria/menu)。

### MenuBar

頂層選單項目的水平容器。

#### 輸入屬性

| 屬性           | 型別      | 預設值  | 說明                                       |
| -------------- | --------- | ------- | ------------------------------------------ |
| `disabled`     | `boolean` | `false` | 停用整個功能表列                           |
| `wrap`         | `boolean` | `true`  | 鍵盤導覽是否從最後一個項目繞回第一個項目   |
| `softDisabled` | `boolean` | `true`  | 為 `true` 時，停用項目可取得焦點但無法互動 |

所有可用輸入屬性與訊號的完整說明，請見 [Menu API 文件](guide/aria/menu#apis)。

### MenuItem

功能表列中的個別項目。API 與 Menu 相同，詳見 [MenuItem](guide/aria/menu#menuitem)。

**功能表列特有的行為**：

- 以左/右方向鍵在功能表列項目之間導覽（垂直選單則用上/下方向鍵）
- 首次以鍵盤互動或點選後，子選單會在懸停時開啟
- Enter 或下方向鍵可開啟子選單，並將焦點移到第一個項目
- `aria-haspopup="menu"` 表示該項目有子選單

### MenuTrigger

功能表列通常不使用 MenuTrigger：項目有關聯的子選單時，MenuItem 會直接處理觸發行為。獨立的選單觸發器模式詳見 [MenuTrigger](guide/aria/menu#menutrigger)。
