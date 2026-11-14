# 複雜動畫序列

#### 先決條件

對下列概念有基本的了解：

* [Angular 動畫簡介](guide/animations)
* [轉場與觸發器](guide/transition-and-triggers)

<hr>

到目前為止，我們已學會單一 HTML 元素的簡單動畫。Angular 也能讓你為協調好的序加入動畫，例如整個格線或元素清單在進入與離開頁面時的動畫。你可以選擇讓多個動畫平行執行，或讓各自獨立的動畫依序一個接一個執行。

控制複雜動畫序列的函式如下：

* `query()` 尋找一個或多個內部 HTML 元素。
* `stagger()` 為多個元素的動畫套用瀑布式延遲。
* `group()` 平行執行多個動畫步驟。
* `sequence()` 一個接一個地執行動畫步驟。

{@a complex-sequence}

## 使用 query() 與 stagger() 函式為多個元素加入動畫

`query()` 函式能讓你在正在播放動畫的元素內尋找內部元素。這個函式會鎖定父元件內的特定 HTML 元素，並分別為每個元素套用動畫。當 Angular 在整個頁面上協調這些元素時，它會智慧地處理設定、拆卸與清理。

`stagger()` 函式能讓你定義每個被查詢項目在播放動畫時的時間間隔，藉此讓元素以彼此延遲的方式播放動畫。

即時範例中的 Filter/Stagger 分頁顯示一份英雄清單，伴隨一段開場序列。整份英雄清單會瀑布式地依序出現，從上到下，彼此之間略有延遲。

以下範例示範如何對動畫元素的進入動畫使用 `query()` 與 `stagger()` 函式。

* 使用 `query()` 尋找任何進入或離開頁面的元素。此查詢會指定符合特定 CSS 類別條件的元素。

* 對這些元素中的每一個，使用 `style()` 設定相同的初始樣式。讓它變成不可見，並使用 `transform` 把它移出原位，讓它能滑入定位。

* 使用 `stagger()` 讓每個動畫延遲 30 毫秒。

* 使用自訂的緩動曲線，讓每個元素在畫面上播放 0.5 秒，同時淡入並還原 transform。

<code-example path="animations/src/app/hero-list-page.component.ts" title="src/app/hero-list-page.component.ts" region="page-animations" language="typescript" linenums="false"></code-example>

## 使用 group() 函式的平行動畫

你已看過如何在每個連續動畫之間加入延遲。但你可能也想設定平行發生的動畫。例如，你可能想為同一個元素的兩個 CSS 屬性加入動畫，但每個屬性使用不同的 `easing` 函式。為此，你可以使用動畫的 `group()` 函式。

<div class="alert is-helpful">

**注意：** `group()` 函式是用來群組動畫 *steps*，而不是動畫元素。
</div>

以下範例在 `:enter` 與 `:leave` 上都使用群組，允許兩種不同的時間設定。它們平行套用到同一個元素上，但彼此獨立執行。

<code-example path="animations/src/app/hero-list-groups.component.ts" region="animationdef" title="src/app/hero-list-groups.component.ts (excerpt)" language="typescript" linenums="false"></code-example>

## 依序動畫與平行動畫

複雜動畫可以同時發生很多事。但如果你想建立一個由多個動畫一個接一個發生的動畫呢？先前你用 `group()` 讓多個動畫同時平行執行。

另一個叫 `sequence()` 的函式，能讓你把同樣的動畫一個接一個地執行。在 `sequence()` 內部，動畫步驟由 `style()` 或 `animate()` 函式呼叫組成。

* 使用 `style()` 立即套用所提供的樣式資料。
* 使用 `animate()` 在一段指定時間區間內套用樣式資料。

## 篩選動畫範例

我們再來看看範例頁面上的另一個動畫。在「Filter/Stagger」分頁下，在 **Search Heroes** 文字方塊中輸入一些文字，例如 `Magnet` 或 `tornado`。

當你輸入時，篩選會即時運作。隨著你輸入每個新字母、篩選條件越來越嚴格，元素會離開頁面。當你刪除篩選方塊中的每個字母時，英雄清單會逐漸重新進入頁面。

HTML 範本包含一個叫 `filterAnimation` 的觸發器。

<code-example path="animations/src/app/hero-list-page.component.html" title="src/app/hero-list-page.component.html" region="filter-animations"></code-example>

元件檔案包含三個轉場。

<code-example path="animations/src/app/hero-list-page.component.ts" title="src/app/hero-list-page.component.ts" region="filter-animations" language="typescript" linenums="false"></code-example>

這個動畫會執行以下動作：

* 忽略使用者第一次開啟或瀏覽到此頁面時執行的任何動畫。篩選會縮小已存在的內容範圍，因此它假設所有要播放動畫的 HTML 元素都已存在於 DOM 中。

* 執行篩選比對，找出符合的項目。

對每一筆符合的項目：

* 將元素的 opacity 與 width 設為 0，讓它完全透明且寬度無限窄，以此隱藏元素。

* 在 300 毫秒內讓元素以動畫進入。在動畫期間，元素會回復到預設的寬度與不透明度。

* 若有多筆符合的元素，從頁面頂部開始逐一錯開每個元素的動畫，每個元素之間延遲 50 毫秒。

## 動畫序列小結

為多個元素加入動畫的 Angular 函式，從 `query()` 開始尋找內部元素；例如，收集一個 `<div>` 內的所有圖片。其餘函式 `stagger()`、`group()` 與 `sequence()`，會套用瀑布效果，或讓你控制多個動畫步驟如何套用。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

* [Angular 動畫簡介](guide/animations)
* [轉場與觸發器](guide/transition-and-triggers)
* [可重複使用的動畫](guide/reusable-animations)
* [路由轉場動畫](guide/route-animations)