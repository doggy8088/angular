<docs-decorative-header title="Toolbar">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" title="工具列 ARIA 模式"/>
  <docs-pill href="/api/aria/toolbar/Toolbar" title="Toolbar API 參考文件"/>
</docs-pill-row>

## 概觀

工具列是將相關控制項與動作分組在一起的容器，並支援鍵盤導覽，常用於文字格式化、工具列與命令面板。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使用方式

當需要將使用者經常存取的相關控制項分組時，工具列最能發揮效果。符合下列情況時，可以考慮使用工具列：

- **多個相關動作**：你有數個執行相關功能的控制項（例如文字格式化按鈕）
- **鍵盤效率很重要**：使用者能受惠於以方向鍵快速進行鍵盤導覽
- **控制項需要分組**：你需要用分隔線將控制項組織成邏輯區段
- **頻繁存取**：控制項在工作流程中會被反覆使用

下列情況應避免使用工具列：

- 簡單的按鈕群組就足夠：若只有 2 至 3 個不相關的動作，個別按鈕的效果更好
- 控制項彼此不相關：工具列隱含邏輯上的分組，不相關的控制項會讓使用者困惑
- 複雜的巢狀導覽：深層階層更適合用選單或導覽元件

## 功能特色

Angular 的工具列提供完整無障礙的工具列實作，包含：

- **鍵盤導覽**：以方向鍵在控制項之間導覽，以 Enter 或 Space 啟用
- **螢幕閱讀器支援**：內建 ARIA 屬性，支援輔助技術
- **控制項群組**：將相關控制項組織在一起，例如單選按鈕群組或切換按鈕群組
- **彈性的方向**：水平或垂直版面，鍵盤導覽會自動配合
- **以訊號為基礎的反應式狀態**：使用 Angular 訊號管理反應式狀態
- **雙向文字支援**：自動處理由右至左（RTL）的語言
- **可設定的焦點行為**：可選擇導覽循環繞回，或在邊緣硬性停止

## 範例

### 基本水平工具列

水平工具列將控制項由左至右排列，符合文字編輯器與設計工具的常見模式。方向鍵可在控制項之間導覽，焦點會停留在工具列內，直到使用者按下 Tab 移到下一個頁面元素。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 垂直工具列

垂直工具列將控制項由上至下堆疊，適合用於側邊面板或垂直命令面板。上下方向鍵可在控制項之間導覽。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 控制項群組

控制項群組包含協同運作的相關控制項，例如文字對齊選項或清單格式化選項。群組會維護自身的內部狀態，同時參與工具列導覽。

在上面的範例中，對齊按鈕被包在帶有 `role="radiogroup"` 的 `ngToolbarWidgetGroup` 中，建立出互斥的選取群組。

`multi` 輸入屬性可控制群組內是否能同時選取多個控制項：

```html {highlight: [15]}
<!-- Single selection (radio group) -->
<div ngToolbarWidgetGroup role="radiogroup" aria-label="Alignment">
  <button ngToolbarWidget value="left">Left</button>
  <button ngToolbarWidget value="center">Center</button>
  <button ngToolbarWidget value="right">Right</button>
</div>

<!-- Multiple selection (toggle group) -->
<div ngToolbarWidgetGroup [multi]="true" aria-label="Formatting">
  <button ngToolbarWidget value="bold">Bold</button>
  <button ngToolbarWidget value="italic">Italic</button>
  <button ngToolbarWidget value="underline">Underline</button>
</div>
```

### 停用的控制項

工具列支援兩種停用模式：

1. **軟停用**的控制項仍可取得焦點，但會以視覺方式表明無法使用
2. **硬停用**的控制項會完全從鍵盤導覽中移除。

`softDisabled` 預設為 `true`，讓停用的控制項仍能接收焦點。若要啟用硬停用模式，請在工具列上設定 `[softDisabled]="false"`。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 由右至左（RTL）支援

工具列會自動支援由右至左的語言。將工具列包在設定了 `dir="rtl"` 的容器中，即可反轉版面與鍵盤導覽方向。方向鍵導覽會自動調整：左方向鍵移到下一個控制項，右方向鍵移到上一個。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## API {#apis}

### Toolbar 指令

`ngToolbar` 指令提供工具列功能的容器。

#### 輸入屬性

| 屬性           | 類型                           | 預設值         | 說明                     |
| -------------- | ------------------------------ | -------------- | ------------------------ |
| `orientation`  | `'vertical' \| 'horizontal'`   | `'horizontal'` | 工具列為垂直或水平方向   |
| `disabled`     | `boolean`                      | `false`        | 停用整個工具列           |
| `softDisabled` | `boolean`                      | `true`         | 停用的項目是否能取得焦點 |
| `wrap`         | `boolean`                      | `true`         | 焦點是否在邊緣繞回       |

### ToolbarWidget 指令

`ngToolbarWidget` 指令將元素標示為工具列內可導覽的控制項。

#### 輸入屬性

| 屬性       | 類型      | 預設值 | 說明                     |
| ---------- | --------- | ------ | ------------------------ |
| `id`       | `string`  | auto   | 控制項的唯一識別碼       |
| `disabled` | `boolean` | `false`| 停用此控制項             |
| `value`    | `V`       | -      | 與控制項關聯的值（必填） |

#### 訊號

| 屬性       | 類型              | 說明                             |
| ---------- | ----------------- | -------------------------------- |
| `active`   | `Signal<boolean>` | 此控制項目前是否取得焦點         |
| `selected` | `Signal<boolean>` | 此控制項是否被選取（在群組內時） |

### ToolbarWidgetGroup 指令

`ngToolbarWidgetGroup` 指令將相關的控制項組成群組。

#### 輸入屬性

| 屬性       | 類型      | 預設值  | 說明                   |
| ---------- | --------- | ------- | ---------------------- |
| `disabled` | `boolean` | `false` | 停用群組內的所有控制項 |
| `multi`    | `boolean` | `false` | 是否能選取多個控制項   |

### 相關元件

工具列可包含各種控制項類型，包括按鈕、樹狀結構與 combobox。特定控制項的實作方式請見各元件的文件。

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" title="工具列 ARIA 模式"/>
  <docs-pill href="/api/aria/toolbar/Toolbar" title="Toolbar API 參考文件"/>
</docs-pill-row>
