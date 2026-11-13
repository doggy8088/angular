# 動畫轉場與計時

動畫*轉場*會指定在一個狀態與另一個狀態之間發生的變化。設定轉場可讓變化不那麼突兀。動畫*轉場*會指定在一個狀態與另一個狀態之間發生的變化。

## 已定義的動畫 `transition()` 函式

`transition()` 函式接受兩個引數：

定義兩個轉場狀態之間方向的運算式；接受一個或一連串 `animate()` 步驟的運算式

使用轉場的 `animate()` 函式來定義：

* 長度
* 延遲
* 緩動
* 用於在轉場進行期間定義樣式的樣式函式

使用 `animate()` 函式來定義多步驟動畫的 `keyframes()` 函式。這些定義放在 `animate()` 函式的第二個引數中。

## 動畫詮釋資料：持續時間、延遲與緩動

`animate()` 函式接受 `timings` 與 `styles` 兩個輸入參數。

`timings` 參數接受一個數字，或一個以三個部分定義的字串。

<code-example format="typescript" language="typescript">

animate (duration)

</code-example>

或

<code-example format="typescript" language="typescript">

animate ('duration delay easing')

</code-example>

第一個部分 `duration` 是必填的。 持續時間可以用不加引號的數字以毫秒表示，或用加引號並帶時間單位的字串以秒表示。 例如，十分之一秒的持續時間可以這樣表示：

*   用純數字，以毫秒計： `100`

*   用字串，以毫秒計： `'100ms'`

*   用字串，以秒計： `'0.1s'`

第二個參數 `delay` 的語法與 `duration` 相同。 例如：

*   等待 100ms，然後執行 200ms：`'0.2s 100ms'`

第三個參數 `easing` 控制動畫在執行期間如何[加速與減速](https://easings.net)。 例如，`ease-in` 會讓動畫一開始緩慢，隨著進行逐漸加快。

*   等待 100 毫秒、執行 200 毫秒。使用減速曲線，先快後慢、逐漸減速至靜止點：

    <code-example format="output" language="shell">

    0.2s 100ms ease-out

    </code-example>

*   執行 200 毫秒、無延遲。使用標準曲線，開始慢、中間加速、最後慢慢減速：

    <code-example format="output" language="shell">

    0.2s ease-in-out

    </code-example>

*   立即開始、執行 200 毫秒。使用加速曲線，開始慢、最後以全速結束：
    <code-example format="output" language="shell">

    0.2s ease-in

    </code-example>

<div class="alert is-helpful">

注意：<br />
關於緩動曲線的一般資訊，請參閱 Material Design 網站上 [Natural easing curves](https://material.io/design/motion/speed.html#easing) 的主題。

</div>

這個範例提供了一個從 `open` 到 `closed` 的狀態轉場，兩個狀態之間的轉場時間為 1 秒。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="transition1"></code-example>

在前面的程式碼片段中，`=>` 運算子表示單向轉場，而 `<=>` 則是雙向。在轉場中，`animate()` 會指定轉場所需的時間。在這個例子中，從 `open` 狀態變為 `closed` 狀態需要 1 秒，在此表示為 `1s`。

這個範例加入了一個從 `closed` 狀態到 `open` 狀態的狀態轉場，轉場動畫弧線為 0.5 秒。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="transition2"></code-example>

<div class="alert is-helpful">

注意：<br />
在 [`state`](api/animations/state) 與 `transition` 函式中使用樣式：

*   使用 [`state()`](api/animations/state) 來定義在每個轉場結束時套用的樣式，動畫完成後這些樣式會繼續保留
*   使用 `transition()` 來定義中間樣式，藉此營造動畫進行中的錯覺
*   關閉動畫時，可以略過 `transition()` 樣式，但 [`state()`](api/animations/state) 樣式不行
*   在同一個 `transition()` 引數中包含多組狀態配對：

    <code-example format="typescript" language="typescript">

    transition( 'on =&gt; off, off =&gt; void' )

    </code-example>

</div>

@reviewed 2022-10-04
