# 動畫轉場和觸發器

本指南深入探討特殊轉場狀態，例如 `*` 萬用字元和 `void`。它展示如何使用這些特殊狀態讓元素進入和離開檢視。
本節還探討多個動畫觸發、動畫回呼和使用關鍵影格的基於序列的動畫。

## 預定義狀態和萬用字元比對

在 Angular 中，過渡狀態可透過 [`state()`](api/animations/state) 函式明確定義，或使用預先定義的 `*` 萬用字元和 `void` 狀態。

### 萬用字元狀態

星號 `*` 或 *萬用字元* 符合任何動畫狀態。
這對於定義不論 HTML 元素的開始或結束狀態如何而套用的轉場很有用。

例如，當元素的狀態從開啟變為其他任何狀態時，`open => *` 的轉場就會套用。

<img alt="萬用字元狀態表達式" src="https://angular.dev/assets/images/guide/animations/wildcard-state-500.png">

以下是一個使用通配符狀態與先前使用 `open` 和 `closed` 狀態的範例的另一個程式碼範例。
不需要定義每個狀態到狀態的轉換配對，任何轉換到 `closed` 需要 1 秒，任何轉換到 `open` 需要 0.5 秒。

這允許在不包含每個狀態的單獨轉換的情況下，新增新的狀態。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard1"/>

使用雙箭頭語法來指定狀態到狀態的雙向轉移。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard2"/>

### 使用通配符狀態與多個轉換狀態

在二態按鈕範例中，萬用字元沒那麼有用，因為只有兩種可能狀態，`open` 和 `closed`。
一般而言，當元素有多種可能變更的狀態時，請使用萬用字元狀態。
如果按鈕可以從 `open` 變更為 `closed` 或類似 `inProgress` 的狀態，使用萬用字元狀態可以減少所需的編碼量。

<img alt="3 種狀態的萬用字元狀態" src="https://angular.dev/assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-transition"/>

當兩個狀態之間發生任何變更時，會套用 `* => *` 轉換。

轉場會依據定義的順序配對。
因此，您可以在 `* => *` 轉場上套用其他轉場。
舉例來說，定義僅適用於 `open => closed` 的樣式變更或動畫，然後使用 `* => *` 作為未特別指出的狀態配對的後備。

若要執行此操作，請在 `* => *` *之前* 列出較為具體的轉換。

### 使用樣式通配符

使用通配符 `*` 和樣式來告訴動畫使用任何當前的樣式值，並使用該值進行動畫。
通配符是備用值，如果要動畫化的狀態未在觸發器中宣告，則會使用該值。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition4"/>

### 空狀態

使用 `void` 狀態來設定進入或離開頁面的元素轉場。
請參閱 [為進入和離開視圖設定動畫](guide/animations/transition-and-triggers#aliases-enter-and-leave)。

### 結合外卡和空狀態

結合通配符和 void 狀態進入轉場，以觸發進入和離開頁面的動畫：

* `* => void` 的過渡適用於元素離開視圖時，無論它在離開前處於什麼狀態
* `void => *` 的過渡適用於元素進入視圖時，無論它進入時處於什麼狀態
* 萬用字元狀態 `*` 匹配 *任何* 狀態，包括 `void`

## 動畫進入和離開視圖

此區段顯示如何為進入或離開頁面的元素加入動畫。

新增行為：

* 當您把英雄加入英雄清單時，它會從左邊飛入頁面
* 當您把英雄從清單中移除時，它會從右邊飛出

<docs-code header="src/app/hero-list-enter-leave.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.component.ts" visibleRegion="animationdef"/>

在之前的程式碼中，當 HTML 元素未附加到檢視時，您套用 `void` 狀態。

## 別名 :enter 和 :leave

`:enter` 和 `:leave` 是 `void => *` 和 `* => void` 轉場的別名。
這些別名被多個動畫函式使用。

<docs-code hideCopy language="typescript">

transition ( ':enter', [ &hellip; ] );  // alias for void =&gt; &ast;
transition ( ':leave', [ &hellip; ] );  // alias for * =&gt; void

</docs-code>

要鎖定進入檢視的元素比較困難，因為它還不在 DOM 中。
使用別名 `:enter` 和 `:leave` 來鎖定插入或從檢視中移除的 HTML 元素。

### 使用 `*ngIf` 和 `*ngFor` 搭配 :enter 和 :leave

`enter` 轉場在任何 `*ngIf` 或 `*ngFor` 檢視被置於頁面上時執行，而 `leave` 則在那些檢視從頁面中移除時執行。

重要：進入/離開行為有時可能會令人混淆。
根據經驗法則，請考慮任何由 Angular 新增至 DOM 的元素都經過 `:enter` 轉場。只有由 Angular 直接從 DOM 中移除的元素才經過 `:leave` 轉場。例如，元素的檢視會從 DOM 中移除，因為它的父元素正在從 DOM 中移除。

這個範例有一個特殊的觸發器，稱為 `myInsertRemoveTrigger`，用於輸入和離開動畫。
HTML 範本包含以下程式碼。

<docs-code header="src/app/insert-remove.component.html" path="adev/src/content/examples/animations/src/app/insert-remove.component.html" visibleRegion="insert-remove"/>

在元件檔案中，`:enter` 轉場設定初始不透明度為 0。然後，當元素插入檢視時，對其進行動畫處理，將不透明度變更為 1。

<docs-code header="src/app/insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/insert-remove.component.ts" visibleRegion="enter-leave-trigger"/>

請注意，這個範例不需要使用 [`state()`](api/animations/state)。

## 轉換 :increment 和 :decrement

`transition()`函式採用其他選擇器值，`:increment`和`:decrement`。
當數值增加或減少時，使用這些值啟動轉換。

HELPFUL: 以下範例使用 `query()` 和 `stagger()` 方法。
有關這些方法的更多資訊，請參閱 [複雜序列](guide/animations/complex-sequences) 頁面。

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="increment"/>

## 過渡中的布林值

如果觸發器包含布林值作為繫結值，則可以使用比較 `true` 和 `false` 或 `1` 和 `0` 的 `transition()` 表達式來比對此值。

<docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.2.html" visibleRegion="trigger-boolean"/>

在上面的程式碼片段中，HTML 範本將 `<div>` 元素繫結到觸發器 `openClose`，狀態表達式為 `isOpen`，可能值為 `true` 和 `false`。
這種模式是建立兩個命名狀態（例如 `open` 和 `close`）的替代作法。

在 `@Component` 的元資料中，當 `animations:` 屬性的狀態評估為 `true` 時，關聯的 HTML 元素的高度為萬用字元樣式或預設值。
在這種情況下，動畫使用元素在動畫開始前已有的高度。
當元素 `closed` 時，元素會以動畫方式變為高度 0，這會讓它看不見。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.2.ts" visibleRegion="trigger-boolean"/>

## 多個動畫觸發器

你可以為一個元件定義多個動畫觸發器。
將動畫觸發器附加到不同的元素，而元素之間的父子關係會影響動畫的運行方式和時間。

### 父子動畫

每次在 Angular 中觸發動畫時，父動畫始終具有優先權，而子動畫則會被阻止。
若要執行子動畫，父動畫必須查詢包含子動畫的每個元素。然後，它會使用 [`animateChild()`](api/animations/animateChild) 函式讓動畫執行。

#### 在 HTML 元素上停用動畫

一種稱為 `@.disabled` 的特殊動畫控制繫結可以放在 HTML 元素上，以關閉該元素以及任何巢狀元素上的動畫。
如果為 true，則 `@.disabled` 繫結會阻止所有動畫呈現。

以下程式碼範例顯示如何使用此功能。

<docs-code-multifile>
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.4.html" visibleRegion="toggle-animation"/>
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.4.ts" visibleRegion="toggle-animation" language="typescript"/>
</docs-code-multifile>

當 `@.disabled` 繫結為 true 時，`@childAnimation` 觸發器不會啟動。

當 HTML 範本中的元素使用 `@.disabled` 主機繫結關閉動畫時，內部所有元素的動畫也會關閉。
您無法選擇性地關閉單一元素上的多個動畫。<!-- vale off -->

選擇性子動畫仍然可以在已停用的父項中以以下其中一種方式執行：

* 父動畫可以使用 [`query()`](api/animations/query) 函式來收集位於 HTML 範本停用區域的內部元素。
    這些元素仍然可以動畫。

<!-- vale on -->

* 子動畫可以被父動畫查詢，然後稍後用 `animateChild()` 函式動畫化

#### 停用所有動畫

如要關閉 Angular 應用程式的全部動畫，請在最上層 Angular 元件上放置 `@.disabled` 主機繫結。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="toggle-app-animations"/>

HELPFUL: 在端對端 (E2E) 測試期間，停用動畫在應用程式中很有用。

## 動畫回呼函式

動畫 `trigger()` 函式在開始和結束時會發出 *回呼*。
以下範例具有包含 `openClose` 觸發器的元件。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events1"/>

在 HTML 範本中，動畫事件透過 `$event` 作為 `@triggerName.start` 和 `@triggerName.done` 傳回，其中 `triggerName` 是正在使用的觸發器名稱。
在此範例中，觸發器 `openClose` 如下所示。

<docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.3.html" visibleRegion="callbacks"/>

動畫回呼的一個潛在用途是彌補緩慢的 API 呼叫，例如資料庫查詢。
例如，在後端系統作業完成時，可以設定一個 **進行中** 按鈕以播放自己的循環動畫。

當目前的動畫完成時，可以呼叫另一個動畫。
例如，當 API 呼叫完成時，按鈕會從 `inProgress` 狀態轉換到 `closed` 狀態。

動畫可以影響最終使用者對操作的 *認知* 速度，即使實際上並沒有比較快。

Callbacks 可用作除錯工具，例如與 `console.warn()` 結合使用，以瀏覽器開發人員 JavaScript 主控台中的應用程式進度。
以下程式碼片段為原始範例建立主控台記錄輸出，一個具有 `open` 和 `closed` 兩種狀態的按鈕。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events"/>

## 關鍵影格

要建立以多個步驟順序執行的動畫，請使用 *關鍵影格*。

Angular 的 `keyframe()` 函式允許在單一計時段內進行多個樣式變更。
例如，按鈕除了淡入淡出外，還可以在 2 秒的時間內變更顏色多次。

<img alt="關鍵影格" src="https://angular.dev/assets/images/guide/animations/keyframes-500.png">

這個顏色的變化程式碼可能看起來像這樣。

<docs-code header="src/app/status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframes"/>

### 偏移

關鍵影格包含一個 `offset`，用來定義動畫中每個樣式變化的發生點。
偏移是從零到一的相對測量，標記動畫的開始和結束。如果至少使用一次，則應將它們應用於每個關鍵影格步驟。

定義關鍵影格的偏移是可選的。
如果您省略它們，則會自動分配均勻間隔的偏移。
例如，三個沒有預定義偏移的關鍵影格會收到 0、0.5 和 1 的偏移。
在前面的範例中為中間的轉場指定 0.8 的偏移可能看起來像這樣。

<img alt="具有偏移量的關鍵影格" src="https://angular.dev/assets/images/guide/animations/keyframes-offset-500.png">

具有指定偏移量的程式碼如下。

<docs-code header="src/app/status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframesWithOffsets"/>

您可以在單一動畫中將關鍵影格與 `duration`、`delay` 和 `easing` 結合使用。

### 帶有脈動的關鍵影格

使用關鍵影格在你的動畫中定義特定偏移的樣式，以建立脈衝效果。

以下是使用關鍵影格建立脈衝效果的範例：

* 原始的 `open` 和 `closed` 狀態，在 1 秒的時間內，高度、顏色和透明度發生原始的變化
* 在中間插入一個關鍵影格序列，導致按鈕在同一 1 秒時間內看起來不規則地脈動

<img alt="不規則搏動的關鍵影格" src="https://angular.dev/assets/images/guide/animations/keyframes-pulsation.png">

此動畫的程式碼片段可能會如下所示。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.1.ts" visibleRegion="trigger"/>

### 可動畫屬性和單位

Angular 動畫支援建立在網頁動畫之上，因此您可以對瀏覽器視為可動畫化的任何屬性執行動畫處理。
這包括位置、大小、轉換、顏色、邊框等。
W3C 在其 [CSS 轉換](https://www.w3.org/TR/css-transitions-1) 頁面上維護一份可動畫化屬性清單。

對於具有數值數值的屬性，請提供值作為字串，以引號標示，並加上適當的後綴來定義單位：

* 50 個像素：
    `'50px'`

* 相對字體大小：
    `'3em'`

* 百分比：
    `'100%'`

你也可以提供該值為數字。在這種情況下，Angular 假設預設單位為像素，或 `px`。
表達 50 像素為 `50` 與說 `'50px'` 相同。

HELPFUL: 字串 `"50"` 相反地不會被視為有效\)。

### 使用萬用字元自動計算屬性

有時，尺寸樣式屬性的值在執行階段才會得知。
例如，元素經常有取決於其內容或螢幕大小的寬度和高度。
這些屬性通常很難使用 CSS 動畫處理。

在這些情況下，您可以在 `style()` 下使用特殊萬用字元 `*` 屬性值。該特定樣式屬性的值在執行階段計算，然後插入動畫。

以下範例有一個觸發器名為 `shrinkOut`，用於當 HTML 元素離開網頁時。
動畫會採用元素離開前的任意高度，並從該高度動畫到零。

<docs-code header="src/app/hero-list-auto.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.component.ts" visibleRegion="auto-calc"/>

### 關鍵影格摘要

Angular 中的 `keyframes()` 函式允許您在單一轉換中指定多種中間樣式。可使用一個選用的 `offset` 來定義每個樣式變更應該在哪個動畫點發生。

## 更多關於 Angular 動畫

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫介紹"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜動畫順序"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
  <docs-pill href="guide/animations/route-animations" title="路徑過渡動畫"/>
</docs-pill-row>
