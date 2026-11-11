# Angular 動畫簡介

動畫能營造出運動的幻覺：HTML 元素的樣式會隨時間改變。
設計良好的動畫能讓應用程式更有趣、更直覺易用，但它不只是裝飾。
動畫能從多方面改善應用程式與使用者體驗：

* 沒有動畫時，網頁轉場容易顯得突兀生硬
* 動態效果能大幅提升使用者體驗，讓使用者有機會察覺應用程式對其操作的回應
* 良好的動畫能直覺地把使用者的注意力引導到需要的地方

通常，動畫涉及隨時間進行的多個樣式*轉換*。
一個 HTML 元素可以移動、改變顏色、放大或縮小、淡入淡出，或滑出頁面。
這些變化可以同時或依序發生。你可以控制每個轉換的時間。

Angular 的動畫系統建構在 CSS 功能之上，也就是說，凡是瀏覽器視為可動畫化的屬性，你都能為它加入動畫。
這包括位置、大小、transform、顏色、邊框等等。
W3C 在其 [CSS Transitions](https://www.w3.org/TR/css-transitions-1) 頁面上維護了一份可動畫化屬性的清單。

## 關於本指南 {#about-this-guide}

本指南涵蓋 Angular 動畫的基本功能，帶你開始把 Angular 動畫加到專案中。

## 開始使用

動畫相關的主要 Angular 模組是 `@angular/animations` 與 `@angular/platform-browser`。

要開始把 Angular 動畫加到專案中，請連同標準 Angular 功能一起匯入動畫專用模組。

<docs-workflow>
<docs-step title="啟用動畫模組">
從 `@angular/platform-browser/animations/async` 匯入 `provideAnimationsAsync`，並把它加入 `bootstrapApplication` 函式呼叫的 providers 清單中。

<docs-code header="Enabling Animations" language="ts" linenums>
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
  ]
});
</docs-code>

<docs-callout important title="若你的應用程式需要立即播放的動畫">
  若你需要在應用程式載入時立即發生動畫，
  你會想改用急切載入的動畫模組。改從 `@angular/platform-browser/animations` 匯入 `provideAnimations`，
  並在 `bootstrapApplication` 函式呼叫中用 `provideAnimations` **取代**
  `provideAnimationsAsync`。
</docs-callout>

對於以 `NgModule` 為基礎的應用程式，請匯入 `BrowserAnimationsModule`，它會把動畫功能引入你的 Angular 根應用程式模組。

<docs-code header="src/app/app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="Importing animation functions into component files">
If you plan to use specific animation functions in component files, import those functions from `@angular/animations`.

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="imports"/>

See all [available animation functions](guide/animations#animations-api-summary) at the end of this guide.

</docs-step>
<docs-step title="Adding the animation metadata property">
In the component file, add a metadata property called `animations:` within the `@Component()` decorator.
You put the trigger that defines an animation within the `animations` metadata property.

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="decorator"/>
</docs-step>
</docs-workflow>

## Animating a transition

Let's animate a transition that changes a single HTML element from one state to another.
For example, you can specify that a button displays either **Open** or **Closed** based on the user's last action.
When the button is in the `open` state, it's visible and yellow.
When it's the `closed` state, it's translucent and blue.

In HTML, these attributes are set using ordinary CSS styles such as color and opacity.
In Angular, use the `style()` function to specify a set of CSS styles for use with animations.
Collect a set of styles in an animation state, and give the state a name, such as `open` or `closed`.

HELPFUL: Let's create a new `open-close` component to animate with simple transitions.

Run the following command in terminal to generate the component:

<docs-code language="shell">

ng g component open-close

</docs-code>

這會在 `src/app/open-close.component.ts` 建立該元件。

### 動畫狀態與樣式

使用 Angular 的 [`state()`](api/animations/state) 函式，定義要在每個轉場結束時呼叫的不同狀態。
這個函式接受兩個參數：
一個唯一的名稱（例如 `open` 或 `closed`）與一個 `style()` 函式。

使用 `style()` 函式定義一組要與指定狀態名稱關聯的樣式。
對於含有連字號的樣式屬性，你必須使用*駝峰式命名*，例如 `backgroundColor`，或把它們用引號包起來，例如 `'background-color'`。

我們來看看 Angular 的 [`state()`](api/animations/state) 函式如何與 `style⁣­(⁠)` 函式搭配，設定 CSS 樣式屬性。
在這段程式碼中，同一時間為該狀態設定了多個樣式屬性。
在 `open` 狀態下，按鈕的高度為 200 像素、不透明度為 1，背景色為黃色。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

In the following `closed` state, the button has a height of 100 pixels, an opacity of 0.8, and a background color of blue.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state2"/>

### Transitions and timing

In Angular, you can set multiple styles without any animation.
However, without further refinement, the button instantly transforms with no fade, no shrinkage, or other visible indicator that a change is occurring.

To make the change less abrupt, you need to define an animation *transition* to specify the changes that occur between one state and another over a period of time.
The `transition()` function accepts two arguments:
The first argument accepts an expression that defines the direction between two transition states, and the second argument accepts one or a series of `animate()` steps.

Use the `animate()` function to define the length, delay, and easing of a transition, and to designate the style function for defining styles while transitions are taking place.
Use the `animate()` function to define the `keyframes()` function for multi-step animations.
These definitions are placed in the second argument of the `animate()` function.

#### Animation metadata: duration, delay, and easing

The `animate()` function \(second argument of the transition function\) accepts the `timings` and `styles` input parameters.

The `timings` parameter takes either a number or a string defined in three parts.

<docs-code language="typescript">

animate (duration)

</docs-code>

或

<docs-code language="typescript">

animate ('duration delay easing')

</docs-code>

第一個部分 `duration` 是必填的。
持續時間可以用不加引號的數字以毫秒表示，或用加引號並帶時間單位的字串以秒表示。
例如，十分之一秒的持續時間可以這樣表示：

* 用純數字，以毫秒計：
    `100`

* 用字串，以毫秒計：
    `'100ms'`

* 用字串，以秒計：
    `'0.1s'`

第二個參數 `delay` 的語法與 `duration` 相同。
例如：

* 等待 100ms，然後執行 200ms：`'0.2s 100ms'`

第三個參數 `easing` 控制動畫在執行期間如何[加速與減速](https://easings.net)。
例如，`ease-in` 會讓動畫一開始緩慢，隨著進行逐漸加快。

* 等待 100ms，執行 200ms。
    使用減速曲線，快速起步再緩緩減速到靜止點：
    `'0.2s 100ms ease-out'`

* 執行 200ms，無延遲。
    使用標準曲線，緩慢起步、中段加速、結尾再緩緩減速：
    `'0.2s ease-in-out'`

* 立即開始，執行 200ms。
    使用加速曲線，緩慢起步並以全速結束：
    `'0.2s ease-in'`

HELPFUL: 關於緩動曲線的一般資訊，請見 Material Design 網站的[自然緩動曲線](https://material.io/design/motion/speed.html#easing)主題。

這個範例提供了一個從 `open` 到 `closed` 的狀態轉場，兩個狀態之間的轉場時間為 1 秒。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition1"/>

In the preceding code snippet, the `=>` operator indicates unidirectional transitions, and `<=>` is bidirectional.
Within the transition, `animate()` specifies how long the transition takes.
In this case, the state change from `open` to `closed` takes 1 second, expressed here as `1s`.

This example adds a state transition from the `closed` state to the `open` state with a 0.5-second transition animation arc.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition2"/>

HELPFUL: Some additional notes on using styles within [`state`](api/animations/state) and `transition` functions.

* Use [`state()`](api/animations/state) to define styles that are applied at the end of each transition, they persist after the animation completes
* Use `transition()` to define intermediate styles, which create the illusion of motion during the animation
* When animations are disabled, `transition()` styles can be skipped, but [`state()`](api/animations/state) styles can't
* Include multiple state pairs within the same `transition()` argument:

    <docs-code language="typescript">

    transition( 'on => off, off => void' )

    </docs-code>

### 觸發動畫

動畫需要一個*觸發器*，它才知道何時開始。
`trigger()` 函式收集各個狀態與轉場，並為動畫取一個名字，讓你可以把它附加到 HTML 範本中的觸發元素上。

`trigger()` 函式描述要監看變化的屬性名稱。
當變化發生時，觸發器會啟動其定義中包含的動作。
這些動作可以是轉場或其他函式，後面會再看到。

在這個範例中，我們將觸發器命名為 `openClose`，並把它附加到 `button` 元素上。
觸發器描述了開啟與關閉狀態，以及兩個轉場的時間。

HELPFUL: 在每次 `trigger()` 函式呼叫中，一個元素在任一時間點只能處於一種狀態。
不過，多個觸發器可以同時處於作用中。

### 定義動畫並附加到 HTML 範本

動畫定義在控制要加入動畫的 HTML 元素的元件中繼資料中。
把定義動畫的程式碼放在 `@Component()` 裝飾器內的 `animations:` 屬性下。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>

When you've defined an animation trigger for a component, attach it to an element in that component's template by wrapping the trigger name in brackets and preceding it with an `@` symbol.
Then, you can bind the trigger to a template expression using standard Angular property binding syntax as shown below, where `triggerName` is the name of the trigger, and `expression` evaluates to a defined animation state.

<docs-code language="typescript">

<div [@triggerName]="expression">…</div>;

</docs-code>

當運算式的值變成新狀態時，動畫就會執行或被觸發。

以下程式碼片段把觸發器繫結到 `isOpen` 屬性的值。

<docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>

在這個範例中，當 `isOpen` 運算式求值為已定義的 `open` 或 `closed` 狀態時，它會通知觸發器 `openClose` 有狀態變化。
接著就由 `openClose` 的程式碼處理狀態變化，並啟動狀態變化動畫。

對於進入或離開頁面的元素（插入 DOM 或從 DOM 移除），你可以讓動畫有條件地執行。
例如，在 HTML 範本中搭配動畫觸發器使用 `*ngIf`。

HELPFUL: 在元件檔案中，把定義動畫的觸發器設為 `@Component()` 裝飾器中 `animations:` 屬性的值。

在 HTML 範本檔案中，使用觸發器名稱把已定義的動畫附加到要加入動畫的 HTML 元素上。

### 程式碼回顧

以下是轉場範例中討論過的程式碼檔案。

<docs-code-multifile>
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>
    <docs-code header="src/app/open-close.component.css" path="adev/src/content/examples/animations/src/app/open-close.component.css"/>
</docs-code-multifile>

### 小結

你學會了如何使用 `style()` 與 [`state()`](api/animations/state)，再搭配負責時間的 `animate()`，為兩個狀態之間的轉場加入動畫。

關於 Angular 動畫的進階功能，請見「動畫」章節，從[轉場與觸發器](guide/animations/transition-and-triggers)的進階技巧開始。

## 動畫 API 總覽 {#animations-api-summary}

`@angular/animations` 模組提供的函式式 API，提供了一套領域專用語言（DSL），用來在 Angular 應用程式中建立與控制動畫。
核心函式與相關資料結構的完整清單與語法細節，請見 [API 參考文件](api#animations)。

| 函式名稱                          | 功能                                                                                                                                                                                                |
|:---                               |:---                                                                                                                                                                                                         |
| `trigger()`                       | 啟動動畫，並作為所有其他動畫函式呼叫的容器。HTML 範本會繫結到 `triggerName`。用第一個參數宣告一個唯一的觸發器名稱。使用陣列語法。 |
| `style()`                         | 定義一個或多個要在動畫中使用的 CSS 樣式。在動畫期間控制 HTML 元素的外觀。使用物件語法。                                                                 |
| [`state()`](api/animations/state) | 建立一組具名的 CSS 樣式，在成功轉場到指定狀態時套用。之後可以在其他動畫函式中以名稱參照該狀態。                              |
| `animate()`                       | 指定轉場的時間資訊。可選的值有 `delay` 與 `easing`。內部可以包含 `style()` 呼叫。                                                                            |
| `transition()`                    | 定義兩個具名狀態之間的動畫序列。使用陣列語法。                                                                                                                                 |
| `keyframes()`                     | 允許在指定時間區間內依序在樣式之間變化。用在 `animate()` 內部。每個 `keyframe()` 內部可以包含多個 `style()` 呼叫。使用陣列語法。                       |
| [`group()`](api/animations/group) | 指定一組要平行執行的動畫步驟（*內部動畫*）。所有內部動畫步驟都完成後，動畫才會繼續。用在 `sequence()` 或 `transition()` 內部。     |
| `query()`                         | 在目前元素內尋找一個或多個內部 HTML 元素。                                                                                                                                           |
| `sequence()`                      | 指定一份要依序一個接一個執行的動畫步驟清單。                                                                                                                                  |
| `stagger()`                       | 讓多個元素的動畫起始時間錯開。                                                                                                                                            |
| `animation()`                     | 產生一個可從其他地方呼叫的可重複使用動畫。與 `useAnimation()` 搭配使用。                                                                                                      |
| `useAnimation()`                  | 啟用一個可重複使用的動畫。與 `animation()` 搭配使用。                                                                                                                                                    |
| `animateChild()`                  | 讓子元件的動畫能在與父元件相同的時間範圍內執行。                                                                                                                    |

</table>

## 深入了解 Angular 動畫

HELPFUL: 可以看看這場在 2017 年 11 月 AngularConnect 大會發表的[演講](https://www.youtube.com/watch?v=rnTK9meY5us)，以及其隨附的[原始碼](https://github.com/matsko/animationsftw.in)。

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場與觸發器"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜動畫序列"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
  <docs-pill href="guide/animations/route-animations" title="路由轉場動畫"/>
</docs-pill-row>
