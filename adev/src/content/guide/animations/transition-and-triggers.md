# 動畫轉場與觸發器

本指南深入說明 `*` 萬用字元與 `void` 等特殊轉場狀態，並示範這些特殊狀態如何用在元素進入與離開檢視的情境。
本節也會探討多個動畫觸發器、動畫回呼，以及使用關鍵影格的序列式動畫。

## 預先定義的狀態與萬用字元比對

在 Angular 中，轉場狀態可以透過 [`state()`](api/animations/state) 函式明確定義，也可以使用預先定義的 `*` 萬用字元狀態與 `void` 狀態。

### 萬用字元狀態

星號 `*`，也就是 *wildcard*（萬用字元），可以比對任何動畫狀態。
這在定義不論 HTML 元素的起始或結束狀態為何都適用的轉場時非常好用。

例如，`open => *` 這個轉場會在元素的狀態從 open 變成其他任何狀態時套用。

<img alt="萬用字元狀態運算式" src="assets/images/guide/animations/wildcard-state-500.png">

下面是另一個程式碼範例，把萬用字元狀態和先前使用 `open` 與 `closed` 狀態的範例結合在一起。
不必再逐一為每一組狀態定義轉場配對，任何轉到 `closed` 的轉場都花 1 秒，任何轉到 `open` 的轉場都花 0.5 秒。

這樣一來，新增狀態時就不必為每個新狀態分別加上轉場。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard1"/>

Use a double arrow syntax to specify state-to-state transitions in both directions.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard2"/>

### Use wildcard state with multiple transition states

In the two-state button example, the wildcard isn't that useful because there are only two possible states, `open` and `closed`.
In general, use wildcard states when an element has multiple potential states that it can change to.
If the button can change from `open` to either `closed` or something like `inProgress`, using a wildcard state could reduce the amount of coding needed.

<img alt="wildcard state with 3 states" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-transition"/>

The `* => *` transition applies when any change between two states takes place.

Transitions are matched in the order in which they are defined.
Thus, you can apply other transitions on top of the `* => *` transition.
For example, define style changes or animations that would apply just to `open => closed`, then use `* => *` as a fallback for state pairings that aren't otherwise called out.

To do this, list the more specific transitions *before* `* => *`.

### Use wildcards with styles

Use the wildcard `*` with a style to tell the animation to use whatever the current style value is, and animate with that.
Wildcard is a fallback value that's used if the state being animated isn't declared within the trigger.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition4"/>

### Void state

Use the `void` state to configure transitions for an element that is entering or leaving a page.
See [Animating entering and leaving a view](guide/animations/transition-and-triggers#aliases-enter-and-leave).

### Combine wildcard and void states

Combine wildcard and void states in a transition to trigger animations that enter and leave the page:

* A transition of `* => void` applies when the element leaves a view, regardless of what state it was in before it left
* A transition of `void => *` applies when the element enters a view, regardless of what state it assumes when entering
* The wildcard state `*` matches to *any* state, including `void`

## Animate entering and leaving a view

This section shows how to animate elements entering or leaving a page.

Add a new behavior:

* When you add a hero to the list of heroes, it appears to fly onto the page from the left
* When you remove a hero from the list, it appears to fly out to the right

<docs-code header="src/app/hero-list-enter-leave.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.component.ts" visibleRegion="animationdef"/>

In the preceding code, you applied the `void` state when the HTML element isn't attached to a view.

## Aliases :enter and :leave

`:enter` and `:leave` are aliases for the `void => *` and `* => void` transitions.
These aliases are used by several animation functions.

<docs-code hideCopy language="typescript">

transition ( ':enter', [ … ] );  // alias for void => *
transition ( ':leave', [ … ] );  // alias for * => void

</docs-code>

要鎖定正在進入檢視的元素比較困難，因為它還不在 DOM 裡。
使用 `:enter` 與 `:leave` 這兩個別名，就能鎖定插入到檢視中、或從檢視移除的 HTML 元素。

### 搭配 `*ngIf` 與 `*ngFor` 使用 :enter 與 :leave

當任何 `*ngIf` 或 `*ngFor` 檢視放到頁面上時，會執行 `:enter` 轉場；當那些檢視從頁面移除時，則會執行 `:leave` 轉場。

IMPORTANT: 進入與離開的行為有時容易讓人混淆。
經驗法則是：任何由 Angular 加入 DOM 的元素，都會經過 `:enter` 轉場；只有由 Angular 直接從 DOM 移除的元素，才會經過 `:leave` 轉場。例如，某個元素的檢視會因為它的父元素被從 DOM 移除，而跟著從 DOM 消失。

這個範例有一個專門用於進入與離開動畫的觸發器，名為 `myInsertRemoveTrigger`。
HTML 範本包含以下程式碼。

<docs-code header="src/app/insert-remove.component.html" path="adev/src/content/examples/animations/src/app/insert-remove.component.html" visibleRegion="insert-remove"/>

在元件檔案中，`:enter` 轉場會把初始不透明度設為 0，接著在元素插入檢視時，以動畫把不透明度變成 1。

<docs-code header="src/app/insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/insert-remove.component.ts" visibleRegion="enter-leave-trigger"/>

請注意，這個範例不需要使用 [`state()`](api/animations/state)。

## 轉場 :increment 與 :decrement

`transition()` 函式還接受 `:increment` 與 `:decrement` 這兩個選取器值。
當數值變大或變小時，可以用它們來啟動轉場。

HELPFUL: 以下範例使用了 `query()` 與 `stagger()` 方法。
如需這些方法的更多資訊，請參閱[複雜序列](guide/animations/complex-sequences)頁面。

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="increment"/>

## 轉場中的布林值

如果觸發器的繫結值是布林值，就可以用比較 `true` 與 `false`（或 `1` 與 `0`）的 `transition()` 運算式來比對這個值。

<docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.2.html" visibleRegion="trigger-boolean"/>

在上方的程式碼片段中，HTML 範本把一個 `<div>` 元素繫結到名為 `openClose` 的觸發器，其狀態運算式為 `isOpen`，可能的值為 `true` 與 `false`。
這種模式可以替代建立 `open` 與 `close` 這類兩個具名狀態的做法。

在 `@Component` 中繼資料的 `animations:` 屬性裡，當狀態求值為 `true` 時，相關 HTML 元素的高度會是萬用字元樣式或預設值。
在這個例子中，動畫會採用元素在動畫開始之前原有的高度。
當元素處於 `closed` 狀態時，元素的高度會以動畫變成 0，讓它看不見。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.2.ts" visibleRegion="trigger-boolean"/>

## 多個動畫觸發器

你可以為一個元件定義不只一個動畫觸發器。
把動畫觸發器附加到不同元素上，而元素之間的父子關係會影響動畫執行的方式與時機。

### 父子動畫

在 Angular 中，每當一個動畫被觸發時，父動畫永遠優先，子動畫會被阻擋。
若要讓子動畫執行，父動畫必須查詢每一個包含子動畫的元素，接著再使用 [`animateChild()`](api/animations/animateChild) 函式讓這些動畫執行。

#### 停用某個 HTML 元素上的動畫

有一個特殊的動畫控制繫結 `@.disabled`，可以放在 HTML 元素上，關閉該元素以及其所有巢狀元素的動畫。
當值為 true 時，`@.disabled` 繫結會阻止所有動畫呈現。

以下程式碼範例示範如何使用這項功能。

<docs-code-multifile>
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.4.html" visibleRegion="toggle-animation"/>
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.4.ts" visibleRegion="toggle-animation" language="typescript"/>
</docs-code-multifile>

當 `@.disabled` 繫結為 true 時，`@childAnimation` 觸發器就不會啟動。

當 HTML 範本中的某個元素使用 `@.disabled` 主機繫結關閉動畫時，它內部所有元素的動畫也會一併關閉。
你無法在單一元素上選擇性地關閉多個動畫。<!-- vale off -->

不過，仍可以用下列方式之一，讓已停用父元素之下的子動畫被選擇性地執行：

* 父動畫可以使用 [`query()`](api/animations/query) 函式，收集位於 HTML 範本中已停用區域內的內層元素。
    那些元素仍然可以做動畫。
<!-- vale on -->

* 子動畫可以先被父動畫查詢出來，之後再用 `animateChild()` 函式加上動畫

#### 停用所有動畫

若要關閉 Angular 應用程式的所有動畫，把 `@.disabled` 主機繫結放在最上層的 Angular 元件上即可。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="toggle-app-animations"/>

HELPFUL: 在端對端（E2E）測試期間，把整個應用程式的動畫停用會很有幫助。

## 動畫回呼

動畫的 `trigger()` 函式會在動畫開始與結束時發出 *callbacks*（回呼）。
以下範例的元件包含一個 `openClose` 觸發器。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events1"/>

在 HTML 範本中，動畫事件會透過 `$event` 以 `@triggerName.start` 與 `@triggerName.done` 的形式傳回，其中 `triggerName` 是所用觸發器的名稱。
在這個範例中，`openClose` 觸發器的寫法如下。

<docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.3.html" visibleRegion="callbacks"/>

動畫回呼的一種潛在用途，是用來掩蓋緩慢的 API 呼叫（例如資料庫查詢）所造成的等待感。
例如，可以為 **InProgress** 按鈕設定它自己的循環動畫，讓它在後端系統操作完成期間持續播放。

目前的動畫結束時，也可以呼叫另一個動畫。
例如，當 API 呼叫完成時，按鈕會從 `inProgress` 狀態轉到 `closed` 狀態。

動畫可以影響使用者，讓他們 *感覺* 操作速度變快了，即使實際上並沒有。

回呼也可以當作除錯工具，例如搭配 `console.warn()`，在瀏覽器的開發者 JavaScript 主控台中檢視應用程式的執行進度。
以下程式碼片段會為最初的範例（具有 `open` 與 `closed` 兩種狀態的按鈕）建立主控台記錄輸出。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events"/>

## 關鍵影格

若要建立由多個步驟依序執行的動畫，請使用 *keyframes*（關鍵影格）。

Angular 的 `keyframe()` 函式可以在單一計時區段內進行多次樣式變更。
例如，按鈕不必淡入淡出，而可以在 2 秒的單一時間跨度內多次變換顏色。

<img alt="關鍵影格" src="assets/images/guide/animations/keyframes-500.png">

這段變色動畫的程式碼可能長這樣。

<docs-code header="src/app/status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframes"/>

### Offset

關鍵影格包含一個 `offset`，用來定義每個樣式變更在動畫中發生的時間點。
Offset 是從 0 到 1 的相對量測值，標示動畫的起點與終點。如果至少使用了一次，每個關鍵影格步驟都應該套用 offset。

為關鍵影格定義 offset 是選擇性的。
如果你省略它們，系統會自動指派均勻間隔的 offset。
例如，三個沒有預先定義 offset 的關鍵影格，會分別得到 0、0.5 與 1 的 offset。
如果把前面範例中間那個轉場的 offset 指定為 0.8，可能會像這樣。

<img alt="帶有 offset 的關鍵影格" src="assets/images/guide/animations/keyframes-offset-500.png">

指定了 offset 的程式碼如下。

<docs-code header="src/app/status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframesWithOffsets"/>

你可以在單一動畫中，把關鍵影格與 `duration`、`delay` 和 `easing` 結合使用。

### 帶有脈動效果的關鍵影格

在動畫過程中，於特定的 offset 定義樣式，就能用關鍵影格在動畫中建立脈動效果。

以下是一個使用關鍵影格建立脈動效果的範例：

* 原始的 `open` 與 `closed` 狀態，高度、顏色與不透明度的原始變化在 1 秒的時間範圍內發生
* 在中間插入一段關鍵影格序列，讓按鈕在同樣的 1 秒時間範圍內呈現不規律的脈動

<img alt="帶有不規律脈動的關鍵影格" src="assets/images/guide/animations/keyframes-pulsation.png">

這段動畫的程式碼片段可能長這樣。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.1.ts" visibleRegion="trigger"/>

### 可動畫的屬性與單位

Angular 動畫建立在 Web 動畫之上，所以只要是瀏覽器認定可動畫的屬性，你都可以為它加上動畫。
這包括位置、尺寸、變換、顏色、框線等。
W3C 在其 [CSS Transitions](https://www.w3.org/TR/css-transitions-1) 頁面上維護了一份可動畫屬性的清單。

對於具有數值的屬性，請把值寫成字串、加上引號並附上適當的後綴，藉此定義單位：

* 50 像素：
    `'50px'`

* 相對字型大小：
    `'3em'`

* 百分比：
    `'100%'`

你也可以把值寫成數字。在這種情況下，Angular 會假設預設單位是像素，也就是 `px`。
把 50 像素寫成 `50`，和寫成 `'50px'` 是相同的意思。

HELPFUL: 反之，字串 `"50"` 不會被視為有效值\)。

### 使用萬用字元自動計算屬性

有時候，維度樣式屬性的值要到執行階段才知道。
例如，元素的寬度與高度往往取決於它們的內容或螢幕大小。
這類屬性用 CSS 來做動畫往往很棘手。

在這種情況下，你可以在 `style()` 底下使用特殊的萬用字元 `*` 屬性值。該樣式屬性的值會在執行階段計算出來，再填入動畫中。

以下範例有一個名為 `shrinkOut` 的觸發器，用在 HTML 元素離開頁面時。
動畫會採用元素離開前原有的高度，並以動畫從該高度變成 0。

<docs-code header="src/app/hero-list-auto.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.component.ts" visibleRegion="auto-calc"/>

### 關鍵影格摘要

Angular 的 `keyframes()` 函式讓你可以在單一轉場中指定多個中途樣式。你也可以使用選擇性的 `offset`，定義每個樣式變更應該在動畫的哪個時間點發生。

## 更多 Angular 動畫相關資訊

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫簡介"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜的動畫序列"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
  <docs-pill href="guide/animations/route-animations" title="路由轉場動畫"/>
</docs-pill-row>
