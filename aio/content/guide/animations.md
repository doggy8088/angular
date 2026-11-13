# Angular 動畫簡介

動畫能營造出運動的幻覺：HTML 元素的樣式會隨時間改變。 設計良好的動畫能讓應用程式更有趣、更直覺易用，但它不只是裝飾。 動畫能從多方面改善應用程式與使用者體驗：

*   沒有動畫時，網頁轉場容易顯得突兀生硬
*   動態效果能大幅提升使用者體驗，讓使用者有機會察覺應用程式對其操作的回應
*   良好的動畫能直覺地把使用者的注意力引導到需要的地方

通常，動畫涉及隨時間進行的多個樣式*轉換*。 一個 HTML 元素可以移動、改變顏色、放大或縮小、淡入淡出，或滑出頁面。 這些變化可以同時或依序發生。你可以控制每個轉換的時間。

Angular 的動畫系統建構在 CSS 功能之上，也就是說，凡是瀏覽器視為可動畫化的屬性，你都能為它加入動畫。 這包括位置、大小、transform、顏色、邊框等等。 W3C 在其 [CSS Transitions](https://www.w3.org/TR/css-transitions-1) 頁面上維護了一份可動畫化屬性的清單。

## 關於本指南

本指南涵蓋 Angular 動畫的基本功能，帶你開始把 Angular 動畫加到專案中。

本指南描述的功能——以及相關 Angular 動畫指南描述的更進階功能——都在一個範例應用程式中展示，詳見 <live-example></live-example>。

## 先決條件

本指南假設你已熟悉如何建置基本的 Angular 應用程式，相關說明請參閱下列章節：

*   [教學](tutorial)
*   [架構總覽](guide/architecture)

## 開始使用

動畫相關的主要 Angular 模組是 `@angular/animations` 與 `@angular/platform-browser`。
使用 CLI 建立新專案時，這些依賴會自動加入你的專案。

要開始把 Angular 動畫加到專案中，請連同標準 Angular 功能一起匯入動畫專用模組。

### 步驟 1：啟用動畫模組

匯入 `BrowserAnimationsModule`，它會把動畫功能帶進你的 Angular 根應用程式模組。

<code-example header="src/app/app.module.ts" path="animations/src/app/app.module.1.ts"></code-example>

<div class="alert is-helpful">

注意：<br />
使用 CLI 建立應用程式時，根應用程式模組 `app.module.ts` 會放在 `src/app` 資料夾中。

</div>

### 步驟 2：將動畫函式匯入元件檔案

如果你打算在元件檔案中使用特定的動畫函式，請從 `@angular/animations` 匯入這些函式。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="imports"></code-example>

<div class="alert is-helpful">

注意：<br />
請參閱本指南結尾的[可用動畫函式摘要](guide/animations#animation-api-summary)。

</div>

### 步驟 3：加入動畫詮釋資料屬性

在元件檔案中，於 `@Component()` 裝飾器內加入一個名為 `animations:` 的詮釋資料屬性。你把定義動畫的觸發器放在 `animations` 詮釋資料屬性中。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="decorator"></code-example>

## 為轉場加上動畫

我們來為一個轉場加上動畫，讓單一 HTML 元素從一種狀態變為另一種狀態。例如，你可以指定按鈕根據使用者的上一個動作顯示 **Open** 或 **Closed**。當按鈕處於 `open` 狀態時，它是可見的黃色；處於 `closed` 狀態時，則是半透明的藍色。

在 HTML 中，這些屬性是使用一般的 CSS 樣式（如 color 與 opacity）來設定的。在 Angular 中，請使用 `style()` 函式來指定一組要搭配動畫使用的 CSS 樣式。把一組樣式收集到一個動畫狀態中，並為該狀態取一個名稱，例如 `open` 或 `closed`。

<div class="alert is-helpful">

我們來建立一個新的 `open-close` 元件，用簡單的轉場為它加上動畫。

請在終端機中執行以下指令來產生元件：

<code-example format="shell" language="shell">

ng g component open-close

</code-example>

這會在 `src/app/open-close.component.ts` 建立該元件。

</div>

### 動畫狀態與樣式

使用 Angular 的 [`state()`](api/animations/state) 函式，定義要在每個轉場結束時呼叫的不同狀態。 這個函式接受兩個參數： 一個唯一的名稱（例如 `open` 或 `closed`）與一個 `style()` 函式。

使用 `style()` 函式定義一組要與指定狀態名稱關聯的樣式。 對於含有連字號的樣式屬性，你必須使用[*駝峰式命名*](guide/glossary#case-conventions)，例如 `backgroundColor`，或把它們用引號包起來，例如 `'background-color'`。

我們來看看 Angular 的 [`state()`](api/animations/state) 函式如何與 `style⁣­(⁠)` 函式搭配，設定 CSS 樣式屬性。 在這段程式碼中，同一時間為該狀態設定了多個樣式屬性。 在 `open` 狀態下，按鈕的高度為 200 像素、不透明度為 1，背景色為黃色。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state1"></code-example>

在接下來的 `closed` 狀態中，按鈕的高度為 100 像素、不透明度為 0.8，背景顏色為藍色。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state2"></code-example>

### 轉場與時間

在 Angular 中，你可以設定多種樣式而不使用任何動畫。不過，若不進一步修飾，按鈕會瞬間變換，沒有淡入、縮小或其他可見的變化跡象。

為了讓變化不那麼突兀，你需要定義一個動畫 *transition*，來指定在一段時間內從一種狀態變為另一種狀態時發生的變化。`transition()` 函式接受兩個引數：第一個引數接受一個運算式，用來定義兩個轉場狀態之間的方向；第二個引數接受一個或一系列 `animate()` 步驟。

使用 `animate()` 函式來定義轉場的長度、延遲與緩動，並指定在轉場進行期間用來定義樣式的 style 函式。使用 `animate()` 函式來定義多步驟動畫的 `keyframes()` 函式。這些定義放在 `animate()` 函式的第二個引數中。

#### 動畫詮釋資料：持續時間、延遲與緩動

`animate()` 函式（轉場函式的第二個引數）接受 `timings` 與 `styles` 輸入參數。

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

*   等待 100ms，執行 200ms。 使用減速曲線，快速起步再緩緩減速到靜止點： `'0.2s 100ms ease-out'`

*   執行 200ms，無延遲。 使用標準曲線，緩慢起步、中段加速、結尾再緩緩減速： `'0.2s ease-in-out'`

*   立即開始，執行 200ms。 使用加速曲線，緩慢起步並以全速結束： `'0.2s ease-in'`

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
關於在 [`state`](api/animations/state) 與 `transition` 函式中使用樣式的一些補充說明。

*   使用 [`state()`](api/animations/state) 來定義在每個轉場結束時套用的樣式，動畫完成後這些樣式會繼續保留
*   使用 `transition()` 來定義中間樣式，藉此營造動畫進行中的錯覺
*   關閉動畫時，可以略過 `transition()` 樣式，但 [`state()`](api/animations/state) 樣式不行
*   在同一個 `transition()` 引數中包含多組狀態配對：

    <code-example format="typescript" language="typescript">

    transition( 'on =&gt; off, off =&gt; void' )

    </code-example>

</div>

### 觸發動畫

動畫需要一個*觸發器*，它才知道何時開始。 `trigger()` 函式收集各個狀態與轉場，並為動畫取一個名字，讓你可以把它附加到 HTML 範本中的觸發元素上。

`trigger()` 函式描述要監看變化的屬性名稱。 當變化發生時，觸發器會啟動其定義中包含的動作。 這些動作可以是轉場或其他函式，後面會再看到。

在這個範例中，我們將觸發器命名為 `openClose`，並把它附加到 `button` 元素上。 觸發器描述了開啟與關閉狀態，以及兩個轉場的時間。

<div class="alert is-helpful">

注意：<br />
在每個 `trigger()` 函式呼叫中，一個元素在任何時候只能處於一種狀態。
不過，多個觸發器可以同時處於作用中。

</div>

### 定義動畫並附加到 HTML 範本

動畫定義在控制要加入動畫的 HTML 元素的元件中繼資料中。 把定義動畫的程式碼放在 `@Component()` 裝飾器內的 `animations:` 屬性下。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="component"></code-example>

為元件定義好動畫觸發器後，請用中括號包住觸發器名稱、並在前面加上 `@` 符號，把它附加到該元件範本中的元素上。接著，你可以使用標準的 Angular 屬性繫結語法，把觸發器繫結到範本運算式，如下所示，其中 `triggerName` 是觸發器的名稱，而 `expression` 會求值為一個已定義的動畫狀態。

<code-example format="typescript" language="typescript">

&lt;div [&commat;triggerName]="expression"&gt;&hellip;&lt;/div&gt;;

</code-example>

當運算式的值變成新狀態時，動畫就會執行或被觸發。

以下程式碼片段把觸發器繫結到 `isOpen` 屬性的值。

<code-example header="src/app/open-close.component.html" path="animations/src/app/open-close.component.1.html" region="trigger"></code-example>

在這個範例中，當 `isOpen` 運算式求值為已定義的 `open` 或 `closed` 狀態時，它會通知觸發器 `openClose` 有狀態變化。 接著就由 `openClose` 的程式碼處理狀態變化，並啟動狀態變化動畫。

對於進入或離開頁面的元素（插入 DOM 或從 DOM 移除），你可以讓動畫有條件地執行。 例如，在 HTML 範本中搭配動畫觸發器使用 `*ngIf`。

<div class="alert is-helpful">

注意：<br />
在元件檔案中，把定義動畫的觸發器設為 `@Component()` 裝飾器中 `animations:` 屬性的值。

在 HTML 範本檔案中，使用觸發器名稱把已定義的動畫附加到要加入動畫的 HTML 元素上。

</div>

### 程式碼回顧

以下是轉場範例中討論過的程式碼檔案。

<code-tabs>
    <code-pane header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="component"></code-pane>
    <code-pane header="src/app/open-close.component.html" path="animations/src/app/open-close.component.1.html" region="trigger"></code-pane>
    <code-pane header="src/app/open-close.component.css" path="animations/src/app/open-close.component.css"></code-pane>
</code-tabs>

### 小結

你學會了如何使用 `style()` 與 [`state()`](api/animations/state)，再搭配負責時間的 `animate()`，為兩個狀態之間的轉場加入動畫。

關於 Angular 動畫的進階功能，請見「動畫」章節，從[轉場與觸發器](guide/transition-and-triggers)的進階技巧開始。

<a id="animation-api-summary"></a>

## 動畫 API 總覽

`@angular/animations` 模組提供的函式式 API，提供了一套領域專用語言（DSL），用來在 Angular 應用程式中建立與控制動畫。 核心函式與相關資料結構的完整清單與語法細節，請見 [API 參考文件](api/animations)。

| 函式名稱 | 功能 |
|:---                               |:---                                                                                                                                                                                                         |
| `trigger()` | 啟動動畫，並作為所有其他動畫函式呼叫的容器。HTML 範本會繫結到 `triggerName`。用第一個參數宣告一個唯一的觸發器名稱。使用陣列語法。 |
| `style()` | 定義一個或多個要在動畫中使用的 CSS 樣式。在動畫期間控制 HTML 元素的外觀。使用物件語法。 |
| [`state()`](api/animations/state) | 建立一組具名的 CSS 樣式，在成功轉場到指定狀態時套用。之後可以在其他動畫函式中以名稱參照該狀態。 |
| `animate()` | 指定轉場的時間資訊。可選的值有 `delay` 與 `easing`。內部可以包含 `style()` 呼叫。 |
| `transition()` | 定義兩個具名狀態之間的動畫序列。使用陣列語法。 |
| `keyframes()` | 允許在指定時間區間內依序在樣式之間變化。用在 `animate()` 內部。每個 `keyframe()` 內部可以包含多個 `style()` 呼叫。使用陣列語法。 |
| [`group()`](api/animations/group) | 指定一組要平行執行的動畫步驟（*內部動畫*）。所有內部動畫步驟都完成後，動畫才會繼續。用在 `sequence()` 或 `transition()` 內部。 |
| `query()` | 在目前元素內尋找一個或多個內部 HTML 元素。 |
| `sequence()` | 指定一份要依序一個接一個執行的動畫步驟清單。 |
| `stagger()` | 讓多個元素的動畫起始時間錯開。 |
| `animation()` | 產生一個可從其他地方呼叫的可重複使用動畫。與 `useAnimation()` 搭配使用。 |
| `useAnimation()` | 啟用一個可重複使用的動畫。與 `animation()` 搭配使用。 |
| `animateChild()` | 讓子元件的動畫能在與父元件相同的時間範圍內執行。 |

</table>

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

*   [轉場與觸發器](guide/transition-and-triggers)
*   [複雜動畫序列](guide/complex-animation-sequences)
*   [可重複使用的動畫](guide/reusable-animations)
*   [路由轉場動畫](guide/route-animations)

<div class="alert is-helpful">

請參閱這份 [presentation](https://www.youtube.com/watch?v=rnTK9meY5us)（2017 年 11 月於 AngularConnect 大會發表）以及隨附的 [source code](https://github.com/matsko/animationsftw.in)。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
