# 動畫

動態效果是現代網頁應用程式設計的一個重要面向。良好的使用者介面會以引人入勝的動畫在狀態之間平滑轉場，在需要的地方吸引注意力。設計良好的動畫可以讓 UI 不僅更有趣，也更容易使用。

## 總覽

Angular 的動畫系統讓你建立的動畫，能以純 CSS 動畫般的原生效能執行。你也可以將動畫邏輯與應用程式其餘程式碼緊密整合，以便輕鬆控制。

<div class="alert is-helpful">

Angular 動畫建立在標準的 [Web Animations API](https://w3c.github.io/web-animations/) 之上，並在[支援它的瀏覽器](http://caniuse.com/#feat=web-animation)上原生執行。

對於其他瀏覽器，則需要 polyfill。請從 GitHub 取得
[`web-animations.min.js`](https://github.com/web-animations/web-animations-js) 並
加入你的頁面。

</div>

<div class="l-sub-section">

本頁的範例可透過 <live-example></live-example> 取得。

</div>

## 設定

在你能為應用程式加入動畫之前，你需要將一些動畫專用的模組與函式匯入根應用程式模組。

<code-example path="animations/src/app/app.module.ts" region="animations-module" title="app.module.ts (animation module import excerpt)" linenums="false"></code-example>

#### 範例基礎

本指南中的動畫範例會為一份英雄清單加上動畫。

`Hero` 類別有一個 `name` 屬性、一個表示英雄是否為啟用狀態的 `state` 屬性，以及一個在狀態之間切換的 `toggleState()` 方法。

<code-example path="animations/src/app/hero.service.ts" region="hero" title="hero.service.ts (Hero class)" linenums="false"></code-example>

螢幕頂端（`app.hero-team-builder.component.ts`）有一系列按鈕，可（透過 `HeroService`）將英雄加入清單或從清單移除。
這些按鈕觸發的清單變更，會被所有範例元件同時看到。

{@a example-transitioning-between-states}

## 在兩個狀態之間轉場

<img src="generated/images/guide/animations/animation_basic_click.gif" alt="簡單的轉場動畫" class="right">

你可以建立一個簡單的動畫，由模型屬性驅動，讓元素在兩個狀態之間轉場。

動畫可以在 `@Component` 中繼資料內定義。

<code-example path="animations/src/app/hero-list-basic.component.ts" region="imports" title="hero-list-basic.component.ts" linenums="false"></code-example>

有了這些，你可以在元件中繼資料中定義一個名為 `heroState` 的*動畫觸發器*。它使用動畫在兩個狀態之間轉場：`active` 與 `inactive`。當英雄為啟用狀態時，元素會以稍大的尺寸與較淺的顏色呈現。

<code-example path="animations/src/app/hero-list-basic.component.ts" region="animationdef" title="hero-list-basic.component.ts (@Component excerpt)" linenums="false"></code-example>

<div class="alert is-helpful">

在此範例中，你是在動畫中繼資料中行內定義動畫樣式（顏色與 transform）。

</div>

現在，使用 `[@triggerName]` 語法，將你剛定義的動畫附加到元件範本中的一個或多個元素。

<code-example path="animations/src/app/hero-list-basic.component.ts" region="template" title="hero-list-basic.component.ts (excerpt)" linenums="false"></code-example>

在這裡，動畫觸發器套用到每個由 `ngFor` 重複的元素。每個重複的元素都獨立地動畫。該屬性的值繫結到運算式 `hero.state`，其值永遠是 `active` 或 `inactive`。

有了這個設定，每當英雄物件改變狀態時，就會出現動畫轉場。以下是完整的元件實作：

<code-example path="animations/src/app/hero-list-basic.component.ts" title="hero-list-basic.component.ts"></code-example>

## 狀態與轉場

Angular 動畫被定義為邏輯上的**狀態**與狀態之間的**轉場**。

動畫狀態是你在應用程式程式碼中定義的字串值。在上方的範例中，狀態 `'active'` 與 `'inactive'` 是根據英雄物件的邏輯狀態。狀態的來源可以是簡單的物件屬性，如本例所示，也可以是在方法中計算出的值。重要的是，你可以將它讀入元件的範本中。

你可以為每個動畫狀態定義*樣式*：

<code-example path="animations/src/app/hero-list-basic.component.ts" region="states" title="src/app/hero-list-basic.component.ts" linenums="false"></code-example>

這些 `state` 定義指定了每個狀態的*結束樣式*。它們會在元素轉場到該狀態後套用到元素上，並在*元素保持該狀態期間*持續存在。實際上，你是在定義元素在不同狀態下具有哪些樣式。

定義狀態之後，你可以定義狀態之間的*轉場*。每個轉場控制從一組樣式切換到下一組樣式的計時：

<code-example path="animations/src/app/hero-list-basic.component.ts" region="transitions" title="src/app/hero-list-basic.component.ts" linenums="false"></code-example>

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_inactive_active.png" alt="在 Angular 動畫中，你定義狀態與狀態之間的轉場" width="400">
</figure>

如果多個轉場有相同的計時設定，你可以將它們合併到同一個 `transition` 定義中：

<code-example path="animations/src/app/hero-list-combined-transitions.component.ts" region="transitions" title="src/app/hero-list-combined-transitions.component.ts" linenums="false"></code-example>

當轉場的兩個方向有相同的計時時，如前一個範例所示，你可以使用速記語法 `<=>`：

<code-example path="animations/src/app/hero-list-twoway.component.ts" region="transitions" title="src/app/hero-list-twoway.component.ts" linenums="false"></code-example>

你也可以在動畫期間套用某個樣式，但在動畫結束後不保留它。你可以在 `transition` 中行內定義這類樣式。在此範例中，元素會立即獲得一組樣式，然後動畫轉場到下一組。當轉場結束時，這些樣式都不會保留，因為它們不是在 `state` 中定義的。

<code-example path="animations/src/app/hero-list-inline-styles.component.ts" region="transitions" title="src/app/hero-list-inline-styles.component.ts" linenums="false"></code-example>

### 萬用字元狀態 `*`

`*`（「萬用字元」）狀態可比對*任何*動畫狀態。這對於定義不論動畫處於哪個狀態都套用的樣式與轉場很有用。例如：

* `active => *` 轉場在元素的狀態從 `active` 變成任何其他狀態時套用。
* `* => *` 轉場在兩個狀態之間發生*任何*變更時套用。

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_inactive_active_wildcards.png" alt="萬用字元狀態可以一次比對多種不同的轉場" width="400">
</figure>

### `void` 狀態

名為 `void` 的特殊狀態可以套用到任何動畫。它在元素*未*附加到檢視時套用，可能是因為它尚未被加入，或因為它已被移除。`void` 狀態對於定義進入與離開動畫很有用。

例如，`* => void` 轉場在元素離開檢視時套用，不論它在離開前處於什麼狀態。

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_void_in.png" alt="void 狀態可用於進入與離開轉場" width="400">
</figure>

萬用字元狀態 `*` 也可比對 `void`。

## 範例：進入與離開

<img src="generated/images/guide/animations/animation_enter_leave.gif" alt="進入與離開動畫" class="right" width="250">

使用 `void` 與 `*` 狀態，你可以定義為元素的進入與離開加上動畫的轉場：

* 進入：`void => *`
* 離開：`* => void`

例如，下方的 `animations` 陣列中有兩個轉場，使用 `void => *` 與 `* => void` 語法，為元素進出檢視加上動畫。

<code-example path="animations/src/app/hero-list-enter-leave.component.ts" region="animationdef" title="hero-list-enter-leave.component.ts (excerpt)" linenums="false"></code-example>

請注意，在此情況下，樣式是直接在轉場定義中套用到 void 狀態，而不是在單獨的 `state(void)` 定義中。因此，進入與離開的 transform 不同：元素從左側進入，向右側離開。

<div class="l-sub-section">

這兩個常見的動畫有各自的別名：

<code-example language="typescript">
  transition(':enter', [ ... ]); // void => *
  transition(':leave', [ ... ]); // * => void
</code-example>

</div>

## 範例：從不同狀態進入與離開

<img src="generated/images/guide/animations/animation_enter_leave_states.gif" alt="進入與離開動畫結合狀態動畫" class="right" width="200">

你也可以將英雄狀態用作動畫狀態，把這個動畫與先前的狀態轉場動畫結合。這讓你可以根據英雄的狀態，為進入與離開設定不同的轉場：

* 未啟用英雄進入：`void => inactive`
* 啟用英雄進入：`void => active`
* 未啟用英雄離開：`inactive => void`
* 啟用英雄離開：`active => void`

這讓你可以精細地控制每個轉場：

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_inactive_active_void.png" alt="此範例在 active、inactive 與 void 狀態之間轉場" width="400">
</figure>

<code-example path="animations/src/app/hero-list-enter-leave-states.component.ts" region="animationdef" title="hero-list-enter-leave.component.ts (excerpt)" linenums="false"></code-example>

## 可動畫的屬性與單位

由於 Angular 的動畫支援建立在 Web Animations 之上，你可以為瀏覽器認為*可動畫*的任何屬性加上動畫。這包括位置、尺寸、transform、顏色、邊框，以及許多其他屬性。W3C 在其 [CSS Transitions 頁面](https://www.w3.org/TR/css3-transitions)上維護了一份[可動畫屬性清單](https://www.w3.org/TR/css3-transitions/#animatable-properties)。

對於具有數值的位置屬性，你可以將值以帶有適當後綴的字串形式提供，藉此定義單位：

* `'50px'`
* `'3em'`
* `'100%'`

如果你在指定尺寸時沒有提供單位，Angular 會假設預設值為 `px`：

* `50` 與寫成 `'50px'` 相同

## 自動屬性計算

<img src="generated/images/guide/animations/animation_auto.gif" alt="自動計算高度的動畫" class="right" width="220">

有時候，你在執行期之前並不知道某個尺寸樣式屬性的值。例如，元素的寬度與高度通常取決於其內容與螢幕尺寸。這些屬性用 CSS 加上動畫通常很棘手。

在這些情況下，你可以使用特殊的 `*` 屬性值，讓屬性的值在執行期計算，然後代入動畫中。

在此範例中，離開動畫會取元素在離開前的高度，並從該高度動畫到零：

<code-example path="animations/src/app/hero-list-auto.component.ts" region="animationdef" title="src/app/hero-list-auto.component.ts" linenums="false"></code-example>

## 動畫計時

每個動畫轉場都有三個可以調整的計時屬性：持續時間、延遲與緩動函式。它們全都合併成單一的轉場*計時字串*。

### 持續時間

持續時間控制動畫從開始到結束需要多久。你可以用三種方式定義持續時間：

* 以純數字表示，單位為毫秒：`100`
* 以字串表示毫秒：`'100ms'`
* 以字串表示秒：`'0.1s'`

### 延遲

延遲控制動畫觸發與轉場開始之間的時間長度。你可以將它加在同一個字串中、接在持續時間之後來定義它。它的格式選項也與持續時間相同：

* 等待 100ms，然後執行 200ms：`'0.2s 100ms'`

### 緩動

[緩動函式](http://easings.net/)控制動畫在執行期間如何加速與減速。例如，`ease-in` 函式會讓動畫一開始相對緩慢，但隨著進行逐漸加快。你可以將緩動作為字串中的*第三個*值，加在持續時間與延遲之後（或在沒有延遲時作為*第二個*值），藉此控制緩動：

* 等待 100ms，然後執行 200ms，並帶有緩動：`'0.2s 100ms ease-out'`
* 執行 200ms，並帶有緩動：`'0.2s ease-in-out'`

<img src="generated/images/guide/animations/animation_timings.gif" alt="具有特定計時的動畫" class="right" width="220">

### 範例

以下是幾個自訂計時的實際運作。進入與離開都持續 200 毫秒，也就是 `0.2s`，但它們的緩動不同。離開會在 `'0.2s 10 ease-out'` 所指定的 10 毫秒些微延遲後開始：

<code-example path="animations/src/app/hero-list-timings.component.ts" region="animationdef" title="hero-list-timings.component.ts (excerpt)" linenums="false"></code-example>

## 使用關鍵影格的多步驟動畫

<img src="generated/images/guide/animations/animation_multistep.gif" alt="以關鍵影格實作彈跳效果的動畫" class="right" width="220">

動畫*關鍵影格*超越了簡單的轉場，成為更精細的動畫，在兩組樣式之間轉場時會經過一個或多個中間樣式。

對於每個關鍵影格，你會指定一個*偏移量*，定義該關鍵影格在動畫中的套用時間點。偏移量是介於零與一之間的數字，零標示動畫的開始，一標示結束。

此範例使用關鍵影格，為進入與離開動畫加入一些「彈跳」效果：

<code-example path="animations/src/app/hero-list-multistep.component.ts" region="animationdef" title="hero-list-multistep.component.ts (excerpt)" linenums="false"></code-example>

請注意，偏移量*不是*以絕對時間定義的。它們是從零到一的相對度量。動畫的最終時間軸是根據關鍵影格偏移量、持續時間、延遲與緩動的組合而定。

為關鍵影格定義偏移量是選用的。如果你省略它們，系統會自動指派間距均勻的偏移量。例如，三個沒有預先定義偏移量的關鍵影格，會得到 `0`、`0.5` 與 `1` 的偏移量。

## 平行動畫群組

<img src="generated/images/guide/animations/animation_groups.gif" alt="以群組實作、具有不同計時的平行動畫" class="right" width="220px">

你已經看過如何同時為多個樣式屬性加上動畫：只要將它們全部放入同一個 `style()` 定義即可。

但你可能也想為平行發生的動畫設定不同的*計時*。例如，你可能想為兩個 CSS 屬性加上動畫，但每個屬性使用不同的緩動函式。

為此，你可以使用動畫*群組*。在此範例中，在進入與離開時都使用群組，可以有兩種不同的計時設定。兩者平行套用到同一個元素，但彼此獨立執行：

<code-example path="animations/src/app/hero-list-groups.component.ts" region="animationdef" title="hero-list-groups.component.ts (excerpt)" linenums="false"></code-example>

一個群組為元素的 transform 與 width 加上動畫；另一個群組為 opacity 加上動畫。

## 動畫回呼

當動畫開始時以及完成時，都會觸發回呼。

在關鍵影格範例中，你有一個名為 `@flyInOut` 的 `trigger`。你可以像這樣掛接那些回呼：

<code-example path="animations/src/app/hero-list-multistep.component.ts" region="template" title="hero-list-multistep.component.ts (excerpt)" linenums="false"></code-example>

回呼會收到一個 `AnimationEvent`，其中包含 `fromState`、`toState` 與 `totalTime` 等實用屬性。

不論動畫是否被採用，那些回呼都會觸發。
