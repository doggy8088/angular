# 使用者輸入

點選連結、按下按鈕、輸入
文字等使用者動作會引發 DOM 事件。
本頁說明如何使用 Angular
事件繫結語法，將這些事件繫結到元件事件處理常式。

執行 <live-example></live-example>。

## 繫結到使用者輸入事件

你可以使用 [Angular 事件繫結](guide/template-syntax#event-binding)
來回應任何 [DOM 事件](https://developer.mozilla.org/en-US/docs/Web/Events)。
許多 DOM 事件是由使用者輸入觸發的。繫結到這些事件提供了一種
取得使用者輸入的方式。

若要繫結到 DOM 事件，請把 DOM 事件名稱放在括號中，並為它指派一個加上引號的
[範本陳述式](guide/template-syntax#template-statements)。

以下範例展示了一個實作點選處理常式的事件繫結：

<code-example path="user-input/src/app/click-me.component.ts" region="click-me-button" title="src/app/click-me.component.ts" linenums="false">

</code-example>

{@a click}

等號左側的 `(click)` 會將按鈕的點選事件識別為**繫結的目標**。
等號右側引號內的文字
是**範本陳述式**，它會呼叫元件的 `onClickMe` 方法，以回應
點選事件。

撰寫繫結時，請留意範本陳述式的**執行脈絡**。
範本陳述式中的識別碼屬於特定的脈絡物件，
通常是控制範本的 Angular 元件。
上方的範例只顯示了一行 HTML，但該 HTML 屬於一個更大的元件：

<code-example path="user-input/src/app/click-me.component.ts" region="click-me-component" title="src/app/click-me.component.ts" linenums="false">

</code-example>

當使用者點選按鈕時，Angular 會呼叫 `ClickMeComponent` 的 `onClickMe` 方法。

## 從 $event 物件取得使用者輸入
DOM 事件會攜帶一些對元件可能有用的資訊負載。
本節說明如何繫結到輸入框的 `keyup` 事件，以在每次按鍵後取得使用者的輸入。

以下程式碼會監聽 `keyup` 事件，並把整個事件負載（`$event`）傳給元件事件處理常式。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-1-template" title="src/app/keyup.components.ts (template v.1)" linenums="false">

</code-example>

當使用者按下並放開按鍵時，就會發生 `keyup` 事件，Angular 會在
`$event` 變數中提供對應的 DOM 事件物件，這段程式碼會把它作為參數傳給元件的 `onKey()` 方法。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-1-class-no-type" title="src/app/keyup.components.ts (class v.1)" linenums="false">

</code-example>

`$event` 物件的屬性會依 DOM 事件的類型而有所不同。舉例來說，
滑鼠事件包含的資訊與輸入框編輯事件不同。

所有 [標準 DOM 事件物件](https://developer.mozilla.org/en-US/docs/Web/API/Event)
都有一個 `target` 屬性，是對引發事件的元素參照。
在這個例子中，`target` 指的是 [`<input>` 元素](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)，而
`event.target.value` 會回傳該元素的目前內容。

每次呼叫後，`onKey()` 方法會把輸入框值的內容附加到
元件 `values` 屬性中的清單，後面加上一個分隔字元（|）。
[插值](guide/template-syntax#interpolation)
會顯示 `values` 屬性中累積的輸入框變更。

假設使用者輸入字母「abc」，然後按退格鍵逐一刪除。
以下是 UI 顯示的內容：

<code-example>
  a | ab | abc | ab | a | |
</code-example>

<figure>
  <img src='generated/images/guide/user-input/keyup1-anim.gif' alt="keyup 範例 1">
</figure>

<div class="alert is-helpful">

或者，你也可以改用 `event.key` 取代 `event.target.value`，自行累積各個按鍵本身，在這種情況下，相同的使用者輸入會產生：

<code-example>
  a | b | c | backspace | backspace | backspace |

</code-example>

</div>

{@a keyup1}

### 為 _$event_ 加上型別

上方的範例把 `$event` 轉型為 `any` 型別。
這簡化了程式碼，但付出了代價。
它沒有任何型別資訊
可以揭示事件物件的屬性，也無法防止愚蠢的錯誤。

以下範例以型別改寫了該方法：

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-1-class" title="src/app/keyup.components.ts (class v.1 - typed )" linenums="false">

</code-example>

`$event` 現在是一個特定的 `KeyboardEvent`。
並非所有元素都有 `value` 屬性，因此它把 `target` 轉型為輸入元素。
`OnKey` 方法更清楚地表達了它對範本的期待，以及它如何解讀事件。

### 傳遞 _$event_ 是值得懷疑的做法
為事件物件加上型別，揭示了把整個 DOM 事件傳入方法的一個重大異議：
元件對範本細節的了解太多了。
它若不對 HTML 實作有超出應有的了解，就無法擷取資訊。
這破壞了範本（_使用者看到的內容_）
與元件（_應用程式如何處理使用者資料_）之間的關注點分離。

下一節說明如何使用範本參照變數來解決這個問題。

## 從範本參照變數取得使用者輸入
還有另一種取得使用者資料的方法：使用 Angular
[**範本參照變數**](guide/template-syntax#ref-vars)。
這些變數提供從範本內部直接存取元素的途徑。
若要宣告範本參照變數，請在識別碼前面加上井號（或英鎊）字元（#）。

以下範例使用範本參照變數
在一個簡單的範本中實作按鍵回送。

<code-example path="user-input/src/app/loop-back.component.ts" region="loop-back-component" title="src/app/loop-back.component.ts" linenums="false">

</code-example>

在 `<input>` 元素上宣告的、名為 `box` 的範本參照變數，
指的就是 `<input>` 元素本身。
程式碼使用 `box` 變數來取得輸入元素的 `value`，並以插值的方式
顯示在 `<p>` 標籤之間。

這個範本完全自成一體。它沒有繫結到元件，
元件也不做任何事。

在輸入框中輸入一些文字，看看顯示內容如何隨著每次按鍵更新。

<figure>
  <img src='generated/images/guide/user-input/keyup-loop-back-anim.gif' alt="迴圈回送">
</figure>

<div class="alert is-helpful">

**除非繫結到事件，否則完全不會運作。**

Angular 只有在應用程式回應非同步事件（例如按鍵）而有所動作時，才會更新繫結（連帶更新畫面）。
這段範例程式碼把 `keyup` 事件
繫結到數字 0，這是最短的範本陳述式。
雖然該陳述式沒有實際作用，
但它滿足了 Angular 的要求，因此 Angular 會更新畫面。

</div>

使用範本參照變數來取得輸入框，比透過 `$event` 物件取得要容易得多。以下是前一個
`keyup` 範例的改寫版，使用範本參照變數取得使用者輸入。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-2" title="src/app/keyup.components.ts (v2)" linenums="false">

</code-example>

這種做法的一個優點是，元件能從檢視中取得乾淨的資料值。
它不再需要了解 `$event` 及其結構。
{@a key-event}

## 按鍵事件篩選（使用 `key.enter`）
`(keyup)` 事件處理常式會聽到 *每一次按鍵*。
有時只有 _Enter_ 鍵才重要，因為它表示使用者已經輸入完畢。
減少雜訊的一種方式，是檢查每一個 `$event.keyCode`，只有在該按鍵是 _Enter_ 時才採取行動。

有更簡單的方法：繫結到 Angular 的 `keyup.enter` 偽事件。
然後，只有在使用者按下 _Enter_ 時，Angular 才會呼叫事件處理常式。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-3" title="src/app/keyup.components.ts (v3)" linenums="false">

</code-example>

以下是它的運作方式。

<figure>
  <img src='generated/images/guide/user-input/keyup3-anim.gif' alt="keyup 範例 3">
</figure>

## 失去焦點時

在前面的範例中，輸入框的目前狀態
會在使用者把滑鼠移開並點選頁面上的別處時遺失，
如果他們未先按下 _Enter_。
元件的 `value` 屬性只有在使用者按下 _Enter_ 時才會更新。

要修正這個問題，請同時監聽 _Enter_ 鍵與 _blur_ 事件。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-4" title="src/app/keyup.components.ts (v4)" linenums="false">

</code-example>

## 全部整合起來
前一頁說明了如何[顯示資料](guide/displaying-data)。
本頁示範了事件繫結技巧。

現在，把它們全部整合到一個微型應用程式中，
它可以顯示英雄清單，並將新的英雄加入清單。
使用者可以在輸入框中輸入英雄名稱並
點選「加入」，來加入英雄。

<figure>
  <img src='generated/images/guide/user-input/little-tour-anim.gif' alt="英雄小導覽">
</figure>

以下是「英雄小導覽」元件。

<code-example path="user-input/src/app/little-tour.component.ts" region="little-tour" title="src/app/little-tour.component.ts" linenums="false">

</code-example>

### 觀察重點

* **使用範本變數來參照元素** &mdash;
`newHero` 範本變數參照 `<input>` 元素。
你可以從 `<input>` 元素的任何同層或子層參照 `newHero`。

* **傳遞值，而非元素** &mdash;
與其把 `newHero` 傳入元件的 `addHero` 方法，
不如取得輸入框的值，再把*該值*傳給 `addHero`。

* **保持範本陳述式簡單** &mdash;
`(blur)` 事件繫結到兩個 JavaScript 陳述式。
第一個陳述式呼叫 `addHero`。第二個陳述式 `newHero.value=''`，
會在新的英雄加入清單後清除輸入框。

## 原始碼

以下是本頁討論過的所有程式碼。

<code-tabs>

  <code-pane title="click-me.component.ts" path="user-input/src/app/click-me.component.ts">

  </code-pane>

  <code-pane title="keyup.components.ts" path="user-input/src/app/keyup.components.ts">

  </code-pane>

  <code-pane title="loop-back.component.ts" path="user-input/src/app/loop-back.component.ts">

  </code-pane>

  <code-pane title="little-tour.component.ts" path="user-input/src/app/little-tour.component.ts">

  </code-pane>

</code-tabs>

## 小結

你已經掌握了回應使用者輸入與手勢的基本原語。

這些技巧對小規模示範很有用，但在處理
大量使用者輸入時，它們很快就會變得冗長而笨拙。
雙向資料繫結是一種更優雅、更簡潔的方式，可以在
資料輸入欄位與模型屬性之間移動值。
下一頁 `Forms` 說明如何
使用 `NgModel` 撰寫雙向繫結。
