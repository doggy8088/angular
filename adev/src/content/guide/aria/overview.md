<docs-decorative-header title="Angular Aria" imgSrc="adev/src/assets/images/aria.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

## 什麼是 Angular Aria？

建立無障礙元件看似簡單，但要按照 [W3C 無障礙指南](https://www.w3.org/TR/wcag/) 實作，需要投入相當多的心力，也需要無障礙方面的專業知識。

Angular Aria 是一組無頭（headless）的無障礙指令，實作了常見的 [WAI-ARIA 模式](https://www.w3.org/WAI/ARIA/apg/patterns/)。這些指令會處理鍵盤互動、ARIA 屬性、焦點管理與螢幕閱讀器支援。你只需要提供 HTML 結構、CSS 樣式與商業邏輯！

## 安裝

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/aria
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/aria
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/aria
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/aria
  </docs-code>
</docs-code-multifile>

## 展示

以工具列選單為例。它看起來可能只是「一排綁了特定邏輯的按鈕」，但對不熟悉無障礙的人來說，鍵盤導覽與螢幕閱讀器會帶來許多意料之外的複雜度。

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

光是這一個情境，開發者就需要考慮：

- **鍵盤導覽**：使用者需要能用 Enter 或 Space 開啟選單、用方向鍵導覽選項、用 Enter 選取，並用 Escape 關閉。
- **螢幕閱讀器**：需要播報選單的狀態、選項數量，以及目前取得焦點的選項。
- **焦點管理**：需要在觸發器與選單項目之間合乎邏輯地移動。
- **由右至左的語言**：需要能以反方向導覽。

## 包含哪些內容？

Angular Aria 針對常見的互動模式，提供附有完整文件、可運作範例與 API 參考的指令：

### 搜尋與選取

| 元件                                    | 說明                                                           |
| --------------------------------------- | -------------------------------------------------------------- |
| [Autocomplete](guide/aria/autocomplete) | 文字輸入框，使用者輸入時會出現篩選後的建議                     |
| [Listbox](guide/aria/listbox)           | 支援鍵盤導覽的單選或多選選項清單                               |
| [Select](guide/aria/select)             | 支援鍵盤導覽的單選下拉模式                                     |
| [Multiselect](guide/aria/multiselect)   | 以精簡方式顯示的多選下拉模式                                   |
| [Combobox](guide/aria/combobox)         | 基礎指令，負責協調文字輸入框與彈出視窗                         |

### 導覽與呼叫動作

| 元件                          | 說明                                               |
| ----------------------------- | -------------------------------------------------- |
| [Menu](guide/aria/menu)       | 支援巢狀子選單與鍵盤快速鍵的下拉選單               |
| [Menubar](guide/aria/menubar) | 用於常駐應用程式選單的水平導覽列                   |
| [Toolbar](guide/aria/toolbar) | 成組的控制項，支援合乎邏輯的鍵盤導覽               |

### 內容組織

| 元件                              | 說明                                                                 |
| --------------------------------- | -------------------------------------------------------------------- |
| [Accordion](guide/aria/accordion) | 可收合的內容面板，可個別展開，也可一次只展開一個                     |
| [Tabs](guide/aria/tabs)           | 分頁介面，支援自動或手動啟用模式                                     |
| [Tree](guide/aria/tree)           | 階層式清單，支援展開/收合功能                                        |
| [Grid](guide/aria/grid)           | 二維資料顯示，支援逐格鍵盤導覽                                       |

## 何時使用 Angular Aria

當你需要符合 WCAG 且可自訂樣式的無障礙互動元件時，Angular Aria 是很好的選擇。例如：

- **建立設計系統**：你的團隊維護一套有特定視覺標準的元件庫，需要無障礙的實作
- **企業級元件庫**：你正在為組織內多個應用程式建立可重複使用的元件
- **自訂品牌需求**：介面需要符合精確的設計規格，是預先套好樣式的元件庫難以配合的

## 何時不該使用 Angular Aria

Angular Aria 不見得適合所有情境：

- **預先套好樣式的元件**：如果你需要不加自訂樣式就外觀完整的元件，請改用 Angular Material
- **簡單表單**：在簡單的使用情境下，原生 HTML 表單控制項（例如 `<button>` 與 `<input type="radio">`）本身就具備無障礙支援
- **快速製作原型**：在快速驗證概念時，預先套好樣式的元件庫能減少初期開發時間

## 下一步

從側邊導覽或[上方清單](#whats-included)挑一個元件來看看，或者從 [Toolbar](guide/aria/toolbar) 開始，看看 Angular Aria 指令如何運作的完整範例！
