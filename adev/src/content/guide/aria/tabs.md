<docs-decorative-header title="Tabs">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" title="Tabs ARIA 模式"/>
  <docs-pill href="/api/aria/tabs/Tabs" title="Tabs API 參考文件"/>
</docs-pill-row>

## 概述

分頁以分層方式顯示內容區段，一次只顯示一個面板。使用者點選分頁按鈕，或用方向鍵導覽分頁清單，就能在面板之間切換。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 用法

分頁很適合將相關內容組織成不同區段，讓使用者在不同檢視或分類之間切換。

**適合使用分頁的情況**：

- 將相關內容組織成不同區段
- 建立具有多個分類的設定面板
- 建立具有多個主題的文件
- 實作具有不同檢視的儀表板
- 顯示需要使用者切換情境的內容

**避免使用分頁的情況**：

- 建立循序表單或精靈（改用 stepper 模式）
- 在頁面之間導覽（改用路由導覽）
- 顯示單一內容區段（不需要分頁）
- 分頁超過 7-8 個（考慮改用其他版面配置）

## 功能

- **選取模式**：分頁可在取得焦點時自動啟用，或需要手動啟用
- **鍵盤導覽**：用方向鍵、Home 與 End 有效地導覽分頁
- **方向**：水平或垂直的分頁清單版面配置
- **延遲內容**：分頁面板只在首次啟用時才算繪
- **停用分頁**：停用個別分頁，並管理焦點
- **焦點模式**：roving tabindex 或 activedescendant 焦點策略
- **RTL 支援**：支援由右至左語言的導覽

## 範例

### 選取跟隨焦點

當選取跟隨焦點時，你用方向鍵導覽，分頁就會立即啟用。這能提供即時回饋，很適合輕量的內容。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

在分頁清單上設定 `[selectionMode]="'follow'"`，即可啟用這個行為。

### 手動啟用

採用手動啟用時，方向鍵只會在分頁之間移動焦點，不會改變選取的分頁。使用者需按 Space 或 Enter 來啟用取得焦點的分頁。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

對於內容較重的面板，使用 `[selectionMode]="'explicit'"`，可避免不必要的算繪。

### 垂直分頁

將分頁垂直排列，適用於設定面板或導覽側邊欄等介面。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

在分頁清單上設定 `[orientation]="'vertical'"`。導覽會改用上/下方向鍵。

### 延遲算繪內容

在 `ng-template` 上使用 `ngTabContent` 指令，可延後算繪分頁面板，直到面板首次顯示時才算繪。

```angular-html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTab">
    <li ngTab value="tab1">Tab 1</li>
    <li ngTab value="tab2">Tab 2</li>
  </ul>

  <div ngTabPanel value="tab1">
    <ng-template ngTabContent>
      <!-- This content only renders when Tab 1 is first shown -->
      <app-heavy-component />
    </ng-template>
  </div>

  <div ngTabPanel value="tab2">
    <ng-template ngTabContent>
      <!-- This content only renders when Tab 2 is first shown -->
      <app-another-component />
    </ng-template>
  </div>
</div>
```

依預設，內容在面板隱藏後仍會保留在 DOM 中。設定 `[preserveContent]="false"`，即可在面板停用時移除內容。

### 停用分頁

停用個別分頁，以防止使用者互動。可控制停用分頁是否能取得鍵盤焦點。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

當分頁清單的 `[softDisabled]="true"` 時，停用分頁可以取得焦點，但無法啟用。當 `[softDisabled]="false"` 時，鍵盤導覽會跳過停用分頁。

## API {#apis}

### Tabs

協調分頁清單與面板的容器指令。

這個指令沒有輸入或輸出。它是 `ngTabList`、`ngTab` 與 `ngTabPanel` 指令的根容器。

### TabList

分頁按鈕的容器，負責管理選取狀態與鍵盤導覽。

#### 輸入屬性

| 屬性            | 類型                         | 預設值         | 說明                                         |
| --------------- | ---------------------------- | -------------- | -------------------------------------------- |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | 分頁清單的版面方向                           |
| `wrap`          | `boolean`                    | `false`        | 鍵盤導覽是否從最後一個分頁繞回第一個分頁     |
| `softDisabled`  | `boolean`                    | `true`         | 為 `true` 時，停用的分頁可取得焦點但無法啟用 |
| `selectionMode` | `'follow' \| 'explicit'`     | `'follow'`     | 分頁在取得焦點時啟用，或需要明確啟用         |
| `selectedTab`   | `any`                        | —              | 目前選取的分頁值（支援雙向綁定）             |

### Tab

個別的分頁按鈕。

#### 輸入屬性

| 屬性       | 類型      | 預設值  | 說明                     |
| ---------- | --------- | ------- | ------------------------ |
| `value`    | `any`     | —       | **必填**。此分頁的唯一值 |
| `disabled` | `boolean` | `false` | 停用此分頁               |

#### 訊號

| 屬性       | 類型              | 說明                   |
| ---------- | ----------------- | ---------------------- |
| `selected` | `Signal<boolean>` | 此分頁目前是否被選取   |
| `active`   | `Signal<boolean>` | 此分頁目前是否取得焦點 |

### TabPanel

與分頁關聯的內容面板。

#### 輸入屬性

| 屬性              | 類型      | 預設值 | 說明                                    |
| ----------------- | --------- | ------ | --------------------------------------- |
| `value`           | `any`     | —      | **必填**。必須與關聯分頁的 `value` 相同 |
| `preserveContent` | `boolean` | `true` | 停用後是否將面板內容保留在 DOM 中       |

#### 訊號

| 屬性      | 類型              | 說明               |
| --------- | ----------------- | ------------------ |
| `visible` | `Signal<boolean>` | 此面板目前是否可見 |

### TabContent

用於延遲算繪分頁面板內容的結構指令。

這個指令沒有輸入、輸出或方法。將它套用到分頁面板內的 `ng-template` 元素：

```angular-html
<div ngTabPanel value="tab1">
  <ng-template ngTabContent>
    <!-- Content here is lazily rendered -->
  </ng-template>
</div>
```
