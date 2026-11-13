# 動畫轉場與觸發器

你在[簡介](guide/animations)頁面中學過 Angular 動畫的基礎。

本指南更深入地說明 `*`（萬用字元）與 `void` 等特殊轉場狀態，並示範這些特殊狀態如何用在元素進入與離開檢視的情境。
本章也會探討多個動畫觸發器、動畫回呼，以及使用關鍵影格的序列式動畫。

## 預先定義的狀態與萬用字元比對

在 Angular 中，轉場狀態可以透過 `state()` 函式明確定義，也可以使用預先定義的 `*`（萬用字元）與 `void` 狀態。

### 萬用字元狀態

星號 `*`，也就是 *wildcard*（萬用字元），可以比對任何動畫狀態。這在定義不論 HTML 元素的起始或結束狀態為何都適用的轉場時非常好用。

例如，`open => *` 這個轉場會在元素的狀態從 open 變成其他任何狀態時套用。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/animations/wildcard-state-500.png" alt="萬用字元狀態運算式">
  </div>
</figure>

下面是另一個程式碼範例，把萬用字元狀態和先前使用 `open` 與 `closed` 狀態的範例結合在一起。
不必再逐一為每一組狀態定義轉場配對，任何轉到 `closed` 的轉場都花 1 秒，任何轉到 `open` 的轉場都花 0.5 秒。

這樣一來，新增狀態時就不必為每個新狀態分別加上轉場。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="trigger-wildcard1" language="typescript"></code-example>

使用雙箭頭語法來指定雙向的狀態對狀態轉場。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="trigger-wildcard2" language="typescript"></code-example>

### 使用萬用字元狀態搭配多個轉場狀態

在雙狀態按鈕範例中，萬用字元沒什麼用處，因為只有兩種可能的狀態：`open` 和 `closed`。
一般來說，當處於某個特定狀態的元素有多種可能切換到的狀態時，就使用萬用字元狀態。
如果按鈕可以從 `open` 切換到 `closed` 或是類似 `inProgress` 的狀態，使用萬用字元狀態可以減少所需的程式碼量。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/animations/wildcard-3-states.png" alt="包含 3 個狀態的萬用字元狀態">
  </div>
</figure>


<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="trigger-transition" language="typescript"></code-example>


當任何兩個狀態之間發生變化時，就會套用 `* => *` 轉場。

轉場會按照定義的順序進行比對。因此，你可以在 `* => *`（any-to-any）轉場之上再套用其他轉場。舉例來說，先定義只適用於 `open => closed`、或只適用於 `closed => open` 的樣式變更或動畫，再把 `* => *` 當作其他未明確指定的狀態配對的備援。

要這麼做，請把更明確的轉場列在 `* => *` *之前*。

### 搭配樣式使用萬用字元

把萬用字元 `*` 與樣式搭配使用，告訴動畫使用目前的樣式值，並以該值進行動畫。萬用字元是一個備援值，當要加上動畫的狀態未在觸發器內宣告時，就會使用它。

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="transition4" language="typescript"></code-example>

### Void 狀態

使用 `void` 狀態來設定元素進入或離開頁面時的轉場。請參閱[為進入與離開檢視加上動畫](#enter-leave-view)。


### 結合萬用字元與 void 狀態

在轉場中結合萬用字元與 void 狀態，來觸發進入與離開頁面的動畫：

* 當元素離開檢視時，不論離開前處於何種狀態，都會套用 `* => void` 的轉場。

* 當元素進入檢視時，不論進入時處於何種狀態，都會套用 `void => *` 的轉場。

* 萬用字元狀態 `*` 會對應 *任何* 狀態，包括 `void`。

## 為進入與離開檢視的元素加上動畫

本節說明如何為進入或離開頁面的元素加上動畫。

<div class="alert is-helpful">

**注意：** 就本指南的目的而言，元素進入或離開檢視，相當於被插入 DOM 或從 DOM 移除。

</div>

加入一個新的行為：

* 當你把一位英雄加入英雄清單時，它看起來會從左側飛進頁面。
* 當你從清單中移除一位英雄時，它看起來會向右飛出。

<code-example path="animations/src/app/hero-list-enter-leave.component.ts" header="src/app/hero-list-enter-leave.component.ts" region="animationdef" language="typescript"></code-example>

在前面的程式碼中，當 HTML 元素未附加到檢視時，我們套用了 `void` 狀態。


{@a enter-leave-view}

## :enter 與 :leave 別名

`:enter` 和 `:leave` 分別是 `void => *` 與 `* => void` 轉場的別名。這些別名由數個動畫函式使用。

<code-example hideCopy language="typescript">
transition ( ':enter', [ ... ] );  // alias for void => *
transition ( ':leave', [ ... ] );  // alias for * => void
</code-example>

要鎖定正在進入檢視的元素比較困難，因為它還不在 DOM 裡。
因此，請使用 `:enter` 與 `:leave` 這兩個別名，鎖定插入到檢視中、或從檢視移除的 HTML 元素。

### 搭配 \*ngIf 與 \*ngFor 使用 :enter 與 :leave

當任何 `*ngIf` 或 `*ngFor` 檢視放到頁面上時，會執行 `:enter` 轉場；當那些檢視從頁面移除時，則會執行 `:leave` 轉場。

這個範例有一個專門用於進入與離開動畫的觸發器，名為 `myInsertRemoveTrigger`。HTML 範本包含以下程式碼。

<code-example path="animations/src/app/insert-remove.component.html" header="src/app/insert-remove.component.html" region="insert-remove" language="typescript">
</code-example>

在元件檔案中，`:enter` 轉場會把初始不透明度設為 0，接著在元素插入檢視時，以動畫把不透明度變成 1。

<code-example path="animations/src/app/insert-remove.component.ts" header="src/app/insert-remove.component.ts" region="enter-leave-trigger" language="typescript">
</code-example>

請注意，這個範例不需要使用 `state()`。

## 轉場中的 :increment 與 :decrement

`transition()` 函式還接受 `:increment` 與 `:decrement` 這兩個選取器值。當數值變大或變小時，可以用它們來啟動轉場。

<div class="alert is-helpful">

**注意：** 以下範例使用了 `query()` 與 `stagger()` 方法。如需更多關於這些方法的資訊，請參閱[複雜序列](guide/complex-animation-sequences#complex-sequence)頁面。

</div>

<code-example path="animations/src/app/hero-list-page.component.ts" header="src/app/hero-list-page.component.ts" region="increment" language="typescript"></code-example>

## 轉場中的布林值

如果觸發器包含布林值作為繫結值，就可以用一個比較 `true` 與 `false`、或 `1` 與 `0` 的 `transition()` 運算式來比對這個值。

<code-example path="animations/src/app/open-close.component.2.html" header="src/app/open-close.component.html" region="trigger-boolean">
</code-example>

在上方的程式碼片段中，HTML 範本把一個 `<div>` 元素繫結到名為 `openClose` 的觸發器，其狀態運算式為 `isOpen`，可能的值為 `true` 與 `false`。這種模式可以替代建立 `open` 與 `close` 這類兩個具名狀態的做法。

在元件程式碼中，於 `@Component` 中繼資料的 `animations:` 屬性裡，當狀態求值為 `true`（在這裡代表「open」）時，相關 HTML 元素的高度會是萬用字元樣式或預設值。在這個例子中，動畫會採用元素在動畫開始之前原有的高度。當元素處於「closed」狀態時，元素的高度會以動畫變成 0，讓它看不見。

<code-example path="animations/src/app/open-close.component.2.ts" header="src/app/open-close.component.ts" region="trigger-boolean" language="typescript">
</code-example>

## 多個動畫觸發器

你可以為一個元件定義不只一個動畫觸發器。把動畫觸發器附加到不同元素上，而元素之間的父子關係會影響動畫執行的方式與時機。

### 父子動畫

在 Angular 中，每當一個動畫被觸發時，父動畫永遠優先，子動畫會被阻擋。若要讓子動畫執行，父動畫必須查詢每一個包含子動畫的元素，接著再使用 [`animateChild()`](https://angular.io/api/animations/animateChild) 函式讓這些動畫執行。

#### 停用某個 HTML 元素上的動畫

有一個特殊的動畫控制繫結 `@.disabled`，可以放在 HTML 元素上，關閉該元素以及其所有巢狀元素的動畫。當值為 true 時，`@.disabled` 繫結會阻止所有動畫呈現。

以下程式碼範例示範如何使用這項功能。

<code-tabs>

<code-pane path="animations/src/app/open-close.component.4.html" header="src/app/open-close.component.html" region="toggle-animation">
</code-pane>

<code-pane path="animations/src/app/open-close.component.4.ts" header="src/app/open-close.component.ts" region="toggle-animation" language="typescript">
</code-pane>

</code-tabs>

當 `@.disabled` 繫結為 true 時，`@childAnimation` 觸發器就不會啟動。

當 HTML 範本中的某個元素使用 `@.disabled` 主機繫結關閉動畫時，它內部所有元素的動畫也會一併關閉。
你無法在單一元素上選擇性地關閉多個動畫。

不過，仍可以用下列方式之一，讓已停用父元素之下的子動畫被選擇性地執行：

* 父動畫可以使用 [`query()`](https://angular.io/api/animations/query) 函式，收集位於 HTML 範本中已停用區域內的內層元素。
那些元素仍然可以做動畫。

* 子動畫可以先被父動畫查詢出來，之後再用 `animateChild()` 函式加上動畫。

#### 停用所有動畫

若要關閉 Angular 應用程式的所有動畫，把 `@.disabled` 主機繫結放在最上層的 Angular 元件上即可。

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="toggle-app-animations" language="typescript"></code-example>

<div class="alert is-helpful">

**注意：** 在端對端（E2E）測試期間，於整個應用程式停用動畫很有用。
</div>

## 動畫回呼

動畫的 `trigger()` 函式會在動畫開始與結束時發出 *callbacks*（回呼）。以下範例的元件包含一個 `openClose` 觸發器。

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="events1" language="typescript"></code-example>

在 HTML 範本中，動畫事件會透過 `$event` 以 `@trigger.start` 與 `@trigger.done` 的形式傳回，其中 `trigger` 是所用觸發器的名稱。
在這個範例中，`openClose` 觸發器的寫法如下。

<code-example path="animations/src/app/open-close.component.3.html" header="src/app/open-close.component.html" region="callbacks">
</code-example>

動畫回呼的一種潛在用途，是用來掩蓋緩慢的 API 呼叫（例如資料庫查詢）所造成的等待感。
例如，可以把 **InProgress** 按鈕設定成有它自己的循環動畫，在後端系統操作完成之前，讓它脈動或做其他視覺動作。

目前的動畫結束時，也可以呼叫另一個動畫。
例如，當 API 呼叫完成時，按鈕會從 `inProgress` 狀態轉到 `closed` 狀態。

動畫可以影響使用者，讓他們 *感覺* 操作速度變快了，即使實際上並沒有。
因此，簡單的動畫可以是一種符合成本效益的方式，讓使用者保持滿意，不必費力提升伺服器呼叫的速度、還要補償像是不穩定的網路連線這種你無法控制的狀況。

回呼也可以當作除錯工具，例如搭配 `console.warn()`，在瀏覽器的開發者 JavaScript 主控台中檢視應用程式的執行進度。
以下程式碼片段會為最初的範例（具有 `open` 與 `closed` 兩種狀態的按鈕）建立主控台記錄輸出。

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="events" language="typescript"></code-example>

{@a keyframes}

## 關鍵影格

上一節介紹的是一個簡單的雙狀態轉場。現在，讓我們使用 *keyframes*（關鍵影格）建立一個由多個步驟依序執行的動畫。

Angular 的 `keyframe()` 函式類似於 CSS 中的 keyframes。關鍵影格可以在單一計時區段內進行多次樣式變更。
例如，按鈕不必淡入淡出，而可以在 2 秒的單一時間跨度內多次變換顏色。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/animations/keyframes-500.png" alt="關鍵影格">
  </div>
</figure>

這段變色動畫的程式碼可能長這樣。

<code-example path="animations/src/app/status-slider.component.ts" header="src/app/status-slider.component.ts" region="keyframes" language="typescript"></code-example>

### 偏移量

關鍵影格包含一個 `offset`，用來定義每個樣式變更在動畫中發生的時間點。
Offsets 是從 0 到 1 的相對量測值，標示動畫的起點與終點。如果至少使用了一次，每個關鍵影格步驟都應該套用 offset。

為關鍵影格定義 offset 是選擇性的。
如果你省略它們，系統會自動指派均勻間隔的 offset。
例如，三個沒有預先定義 offset 的關鍵影格，會分別得到 0、0.5 與 1 的 offset。
如果把前面範例中間那個轉場的 offset 指定為 0.8，可能會像這樣。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/animations/keyframes-offset-500.png" alt="含位移的關鍵影格">
  </div>
</figure>

指定了 offset 的程式碼如下。

<code-example path="animations/src/app/status-slider.component.ts" header="src/app/status-slider.component.ts" region="keyframesWithOffsets" language="typescript">
</code-example>

你可以在單一動畫中，把關鍵影格與 `duration`、`delay` 和 `easing` 結合使用。

### 帶有脈動效果的關鍵影格

在動畫過程中，於特定的 offset 定義樣式，就能用關鍵影格在動畫中建立脈動效果。

以下是一個使用關鍵影格建立脈動效果的範例：

* 原本的 `open` 與 `closed` 狀態，高度、顏色與不透明度也依原本的變化，在 1 秒的時間範圍內發生。

* 插入中間的關鍵影格序列，會讓按鈕在同樣 1 秒的時間範圍內看起來不規則地脈動。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/animations/keyframes-pulsation.png" alt="含不規則脈動的關鍵影格">
  </div>
</figure>

這段動畫的程式碼片段可能長這樣。

<code-example path="animations/src/app/open-close.component.1.ts" header="src/app/open-close.component.ts" region="trigger" language="typescript"></code-example>

### 可動畫的屬性與單位

Angular 動畫建立在 Web 動畫之上，所以只要是瀏覽器認定可動畫的屬性，你都可以為它加上動畫。
這包括位置、尺寸、變換、顏色、框線等。W3C 在其 [CSS Transitions](https://www.w3.org/TR/css-transitions-1/) 頁面上維護了一份可動畫屬性的清單。

對於具有數值的位置屬性，請把值寫成字串、加上引號並附上適當的後綴，藉此定義單位：

* 50 像素：`'50px'`
* 相對字型大小：`'3em'`
* 百分比：`'100%'`

你也可以把值寫成數字（也就是不提供單位）。在這種情況下，Angular 會假設預設單位是像素，也就是 px。
把 50 像素寫成 `50`，和寫成 `'50px'` 是相同的意思。

### 使用萬用字元自動計算屬性

有時候，維度樣式屬性的值要到執行階段才知道。
例如，元素的寬度與高度往往取決於它們的內容或螢幕大小。
這類屬性用 CSS 來做動畫往往很棘手。

在這種情況下，你可以在 `style()` 底下使用特殊的萬用字元 `*` 屬性值，如此該特定樣式屬性的值會在執行階段計算出來，再填入動畫中。

以下範例有一個名為 `shrinkOut` 的觸發器，用在 HTML 元素離開頁面時。
動畫會採用元素離開前原有的高度，並以動畫從該高度變成 0。

<code-example path="animations/src/app/hero-list-auto.component.ts" header="src/app/hero-list-auto.component.ts" region="auto-calc" language="typescript"></code-example>

### 關鍵影格摘要

Angular 的 `keyframes()` 函式讓你可以在單一轉場中指定多個中途樣式，並可使用選擇性的 `offset`，定義每個樣式變更應該在動畫的哪個時間點發生。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

* [Angular 動畫簡介](guide/animations)
* [複雜的動畫序列](guide/complex-animation-sequences)
* [可重複使用的動畫](guide/reusable-animations)
* [路由轉場動畫](guide/route-animations)
