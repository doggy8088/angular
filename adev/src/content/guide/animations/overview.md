# Angular 動畫介紹

動畫提供運動的錯覺：HTML 元素隨時間改變樣式。
設計良好的動畫可以讓你的應用程式更有趣且易於使用，但它們不僅僅是裝飾。
動畫可以通過多種方式改進你的應用程式和使用者體驗：

* 沒有動畫，網頁轉場可能會顯得突然和不協調
* 動態大幅增強使用者體驗，因此動畫讓使用者有機會偵測應用程式對其動作的回應
* 良好的動畫直覺地將使用者的注意力導引到需要的地方

通常，動畫會隨著時間涉及多種樣式*轉換*。
HTML 元素可以移動、變色、變大或變小、淡出或從頁面滑出。
這些變化可以同時或依序發生。您可以控制每個轉換的時間。

Angular 的動畫系統建立在 CSS 功能上，這表示您可以對瀏覽器視為可動畫化的任何屬性進行動畫化。
這包括位置、大小、轉換、顏色、邊框等。
W3C 在其 [CSS Transitions](https://www.w3.org/TR/css-transitions-1) 頁面上維護一個可動畫化屬性的列表。

## 關於本指南

本指南介紹基本 Angular 動畫功能，讓您開始在專案中加入 Angular 動畫。

## 開始使用

用於動畫的主要 Angular 模組是 `@angular/animations` 和 `@angular/platform-browser`。

若要開始將 Angular 動畫新增至專案，請匯入動畫專用模組以及標準 Angular 功能。

<docs-workflow>
<docs-step title="啟用動畫模組">
從 `@angular/platform-browser/animations/async` 導入 `provideAnimationsAsync`，並將它新增至 `bootstrapApplication` 函數呼叫的提供者清單中。

<docs-code header="Enabling Animations" language="ts" linenums>
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
  ]
});
</docs-code>

<docs-callout important title="如果您需要應用程式中的動畫立即執行">
  如果您需要在應用程式載入時立即執行動畫，您將需要切換到即時載入的動畫模組。從 `@angular/platform-browser/animations` 匯入 `provideAnimations`，並在 `bootstrapApplication` 函式呼叫中使用 `provideAnimations` **取代** `provideAnimationsAsync`。
</docs-callout>

對於基於 `NgModule` 的應用程式，導入 `BrowserAnimationsModule`，它將動畫功能引入您的 Angular 根應用程式模組。

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

這會在 `src/app/open-close.component.ts` 中建立元件。

### 動畫狀態和樣式

使用 Angular 的 [`state()`](api/animations/state) 函數來定義不同狀態，以便在每個轉換結束時呼叫。
此函數採用兩個參數：
一個唯一名稱，例如 `open` 或 `closed`，以及一個 `style()` 函數。

使用 `style()` 函數定義要與給定狀態名稱關聯的樣式集。
您必須使用 *camelCase* 表示包含破折號的樣式屬性，例如 `backgroundColor`，或用引號將其括起來，例如 `'background-color'`。

讓我們看看 Angular 的 [`state()`](api/animations/state) 函數如何與 `style⁣­(⁠)` 函數搭配使用來設定 CSS 樣式屬性。
在此程式碼片段中，將多個樣式屬性同時設定給狀態。
在 `open` 狀態中，按鈕的高度為 200 像素、不透明度為 1，且背景顏色為黃色。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

在以下的 `closed` 狀態，按鈕高度為 100 像素、不透明度為 0.8，背景顏色為藍色。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state2"/>

### 轉場與計時

在 Angular 中，您可以設定多個樣式，而不會產生任何動畫。
但是，在沒有進一步調整的情況下，按鈕會立即轉換，沒有漸變、沒有縮小或其他可見的指標來表示正在發生變化。

為了讓變更不那麼突然，您需要定義動畫 *transition* 來指定在一段時間內一個狀態與另一個狀態之間發生的變更。
`transition()` 函數接受兩個參數：
第一個參數接受定義兩個過渡狀態之間方向的表達式，第二個參數接受一個或一系列 `animate()` 步驟。

使用 `animate()` 函數定義轉換的長度、延遲和緩衝，並指定樣式函數來定義轉換發生期間的樣式。
使用 `animate()` 函數來定義多步驟動畫的 `keyframes()` 函數。
這些定義放在 `animate()` 函數的第二個參數中。

#### 動畫資訊：持續時間、延遲和緩和

`animate()` 函數（過渡函數的第二個參數）接受 `timings` 和 `styles` 輸入參數。

`timings` 參數會取一個數字或一個由三個部分定義的字串。

<docs-code language="typescript">

animate (duration)

</docs-code>

以下文字為 HTML 和 Markdown 文件的混合。請將文字翻譯成繁體中文，並保持其格式不變。

or

<docs-code language="typescript">

animate ('duration delay easing')

</docs-code>

第一個部分，`duration`，是必須的。
duration 可以用不帶引號的數字以毫秒為單位表示，或用帶引號的時間說明符以秒為單位表示。
例如，十分之一秒的 duration 可以表示如下：

* 以毫秒為單位，為一純數字：
    `100`

* 以毫秒為單位，為一字串：
    `'100ms'`

* 以秒為單位，為一字串：
    `'0.1s'`

第二個參數 `delay`，語法與 `duration` 相同。
例如：

* 等待 100ms，然後運行 200ms：`'0.2s 100ms'`

第三個參數 `easing` 控制動畫在執行期間如何 [加速和減速](https://easings.net)。
例如，`ease-in` 會導致動畫在開始時速度較慢，然後隨著進度加快速度。

* 等候 100 毫秒，執行 200 毫秒。
    使用減速曲線快速開始，然後慢慢減速至靜止點：
    `'0.2s 100ms ease-out'`

* 執行 200 毫秒，沒有延遲。
    使用標準曲線慢慢開始，在中間加速，然後在結尾慢慢減速：
    `'0.2s ease-in-out'`

* 立即開始，執行 200 毫秒。
    使用加速曲線慢慢開始，並以全速結束：
    `'0.2s ease-in'`

HELPFUL: 參閱 Material Design 網站關於 [自然緩衝曲線](https://material.io/design/motion/speed.html#easing) 的主題，以獲取有關緩衝曲線的資訊。

此範例提供從 `open` 到 `closed` 的狀態轉換，狀態之間的轉換時間為 1 秒。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition1"/>

在前面的程式碼片段中，`=>` 運算子表示單向過渡，而 `<=>` 是雙向的。
在過渡中，`animate()` 指定過渡需要多長時間。
在這個案例中，狀態從 `open` 到 `closed` 改變需要 1 秒，這裡表示為 `1s`。

此範例從 `closed` 狀態加入一個狀態轉換至 `open` 狀態，並以 0.5 秒的過渡動畫弧線。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition2"/>

HELPFUL: 有關在 [`state`](api/animations/state) 和 `transition` 函數中使用樣式的其他說明。

* 使用 [`state()`](api/animations/state) 定義在每個轉換結束時套用的樣式，它們會在動畫完成後持續存在
* 使用 `transition()` 定義中間樣式，在動畫期間創造出移動的錯覺
* 當動畫被停用時，`transition()` 樣式可以被略過，但 [`state()`](api/animations/state) 樣式不行
* 在同一個 `transition()` 參數中包含多個狀態配對：

    <docs-code language="typescript">

    transition( 'on =&gt; off, off =&gt; void' )

    </docs-code>

### 觸發動畫

動畫需要一個 *觸發器*，以便知道何時開始。
`trigger()` 函數會收集狀態和轉換，並為動畫提供一個名稱，以便您可以將其附加到 HTML 範本中的觸發元素。

`trigger()` 函數描述要監控變化的屬性名稱。
當變更發生時，觸發器會啟動其定義中包含的動作。
這些動作可以是轉換或其他函數，我們稍後會看到。

在此範例中，我們將觸發器命名為 `openClose`，並將其附加到 `button` 元素。
觸發器描述開啟和關閉狀態，以及兩個轉換的時間。

HELPFUL: 在每次 `trigger()` 函數呼叫中，元素在任何給定時間只能處於一種狀態。
然而，多個觸發器可以同時處於活動狀態。

### 定義動畫並將其附加到 HTML 範本

動畫定義在控制要動畫化的 HTML 元素的元件的元資料中。
將定義動畫的程式碼放在 `@Component()` 裝飾器內的 `animations:` 屬性下。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>

當您為元件定義動畫觸發器時，請透過在觸發器名稱中加上括號並在前面加上 `@` 符號，將它附加到該元件範本中的元素。
然後，您可以使用標準的 Angular 屬性繫結語法將觸發器繫結到範本表達式，如下所示，其中 `triggerName` 是觸發器的名稱，而 `expression` 會評估為已定義的動畫狀態。

<docs-code language="typescript">

&lt;div [&commat;triggerName]="expression"&gt;&hellip;&lt;/div&gt;;

</docs-code>

動畫在表達式值變更為新狀態時執行或觸發。

以下程式碼片段將觸發器繫結至 `isOpen` 屬性的值。

<docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>

在此範例中，當 `isOpen` 表達式評估為 `open` 或 `closed` 的已定義狀態時，它會通知觸發器 `openClose` 狀態變更。
然後由 `openClose` 程式碼來處理狀態變更，並啟動狀態變更動畫。

對於進入或離開頁面的元素（插入或從 DOM 中移除），您可以讓動畫有條件執行。
例如，在 HTML 範本中使用 `*ngIf` 和動畫觸發器。

HELPFUL: 在元件檔案中，將定義動畫的觸發器設定為 `@Component()` 裝飾器的 `animations:` 屬性的值。

在 HTML 範本檔案中，使用觸發器名稱將已定義的動畫附加到要動畫化的 HTML 元素。

### 程式碼檢閱

以下是轉換範例中討論的程式碼檔案。

<docs-code-multifile>
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>
    <docs-code header="src/app/open-close.component.css" path="adev/src/content/examples/animations/src/app/open-close.component.css"/>
</docs-code-multifile>

### 摘要

您已學會使用 `style()` 和 [`state()`](api/animations/state) 以及 `animate()` 來控制時間，將動畫新增至兩個狀態之間的轉換。

在動畫部分中，學習 Angular 動畫的更多進階功能，從 [轉場和觸發器](guide/animations/transition-and-triggers) 的進階技巧開始。

## 動畫 API 總覽

`@angular/animations` 模組提供的功能性 API 提供了特定於領域的語言 (DSL)，用於在 Angular 應用程式中建立和控制動畫。
請參閱 [API 參考](api/animations)以取得核心功能和相關數據結構的完整清單和語法詳細資料。

| 功能名稱                               | 作用                                                                                                                                                                                                 |
|:---                               |:---                                                                                                                                                                                                         |
| `trigger()`                       | 啟動動畫，並作為所有其他動畫函數呼叫的容器。HTML 範本繫結至 `triggerName`。使用第一個參數宣告唯一的觸發器名稱。使用陣列語法。                                                               |
| `style()`                         | 定義動畫中要使用的 CSS 樣式。控制動畫期間 HTML 元素的視覺外觀。使用物件語法。                                                                                                                            |
| [`state()`](api/animations/state) | 建立 CSS 樣式的命名集合，應該在成功轉換至指定狀態時套用。然後可以在其他動畫函數中按名稱參照狀態。                                                                                                 |
| `animate()`                       | 指定轉換的時間資訊。`delay` 和 `easing` 的選用值。可以在其中包含 `style()` 呼叫。                                                                                                                 |
| `transition()`                    | 定義兩個命名狀態之間的動畫順序。使用陣列語法。                                                                                                                                                             |
| `keyframes()`                     | 允許在指定的時間間隔內，在樣式之間進行順序變更。在 `animate()` 中使用。可以在每個 `keyframe()` 中包含多個 `style()` 呼叫。使用陣列語法。                                             |
| [`group()`](api/animations/group) | 指定要並行執行的動畫步驟群組（*內部動畫*）。只有在所有內部動畫步驟完成後，動畫才會繼續。在 `sequence()` 或 `transition()` 中使用。                                              |
| `query()`                         | 在當前元素中尋找一個或多個內部 HTML 元素。                                                                                                                                                             |
| `sequence()`                      | 指定按順序逐一執行的動畫步驟清單。                                                                                                                                                                  |
| `stagger()`                       | 交錯多個元素動畫的開始時間。                                                                                                                                                                            |
| `animation()`                     | 產生可從其他地方呼叫的可重複使用動畫。與 `useAnimation()` 搭配使用。                                                                                                                                     |
| `useAnimation()`                  | 啟用可重複使用的動畫。與 `animation()` 搭配使用。                                                                                                                                                             |
| `animateChild()`                  | 允許子元件的動畫在與父元件相同的時間範圍內執行。

</table>

## 更多關於 Angular 動畫

HELPFUL: 看看這個 [簡報](https://www.youtube.com/watch?v=rnTK9meY5us)，2017 年 11 月在 AngularConnect 會議中展示，以及隨附的 [原始碼](https://github.com/matsko/animationsftw.in)。

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場和觸發器"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜動畫序列"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
  <docs-pill href="guide/animations/route-animations" title="路由轉場動畫"/>
</docs-pill-row>

