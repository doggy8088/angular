# 複雜動畫序列

## 先決條件

對下列概念有基本的了解：

*   [Angular 動畫簡介](guide/animations)
*   [轉場與觸發器](guide/transition-and-triggers)

到目前為止，我們已學會單一 HTML 元素的簡單動畫。 Angular 也能讓你為協調好的序加入動畫，例如整個格線或元素清單在進入與離開頁面時的動畫。 你可以選擇讓多個動畫平行執行，或讓各自獨立的動畫依序一個接一個執行。

控制複雜動畫序列的函式如下：

| 函式 | 說明 |
|:---                               |:---     |
| `query()` | 尋找一個或多個內部 HTML 元素。 |
| `stagger()` | 為多個元素的動畫套用瀑布式延遲。 |
| [`group()`](api/animations/group) | 平行執行多個動畫步驟。 |
| `sequence()` | 一個接一個地執行動畫步驟。 |

<a id="complex-sequence"></a>

## query() 函式

大多數複雜動畫都仰賴 `query()` 函式來尋找子元素並為它們套用動畫。基本範例包括：

| 範例 | 說明 |
|:---                                    |:---     |
| `query()` 之後接 `animate()` | 用來查詢簡單的 HTML 元素並直接為它們套用動畫。 |
| `query()` 之後接 `animateChild()` | 用來查詢子元素，這些子元素本身帶有套用在其上的動畫中繼資料，並觸發這類動畫（否則會被目前／父元素的動畫擋住）。 |

`query()` 的第一個參數是一個 [CSS 選擇器](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)字串，其中也可以包含以下 Angular 專用 token：

| Token | 說明 |
|:---                        |:---     |
| `:enter` <br /> `:leave` | 用於正在進入／離開的元素。 |
| `:animating` | 用於目前正在播放動畫的元素。 |
| `@*` <br /> `@triggerName` | 用於帶有任何（或特定）觸發器的元素。 |
| `:self` | 正在播放動畫的元素本身。 |

<div class="callout is-helpful">

<header>進入與離開的元素</header>

並非所有子元素實際上都會被視為進入／離開；這有時可能違反直覺、令人困惑。更多資訊請參閱 [query api docs](api/animations/query#entering-and-leaving-elements)。

你也可以在動畫即時範例 \(在動畫 [introduction section](guide/animations#關於本指南) 中介紹\) 的 Querying 分頁中看到相關說明。

</div>

## 使用 query() 與 stagger() 函式為多個元素加入動畫

透過 `query()` 查詢子元素之後，`stagger()` 函式能讓你定義每個項目之間的時間間隔，讓元素以彼此延遲的方式播放動畫。

以下範例示範如何使用 `query()` 與 `stagger()` 函式，為一個清單（英雄清單）加入動畫：每個英雄依序加入，彼此之間略有延遲，從上到下排列。

*   使用 `query()` 尋找符合特定條件、正在進入頁面的元素
*   對這些元素中的每一個，使用 `style()` 設定相同的初始樣式。 讓它變透明，並使用 `transform` 把它移出原位，讓它能滑入定位。

*   使用 `stagger()` 讓每個動畫延遲 30 毫秒
*   使用自訂的緩動曲線，讓每個元素在畫面上播放 0.5 秒，同時淡入並還原 transform

<code-example header="src/app/hero-list-page.component.ts" path="animations/src/app/hero-list-page.component.ts" region="page-animations"></code-example>

## 使用 group() 函式的平行動畫

你已看過如何在每個連續動畫之間加入延遲。 但你可能也想設定平行發生的動畫。 例如，你可能想為同一個元素的兩個 CSS 屬性加入動畫，但每個屬性使用不同的 `easing` 函式。 為此，你可以使用動畫的 [`group()`](api/animations/group) 函式。

<div class="alert is-helpful">

注意：<br />
[`group()`](api/animations/group) 函式是用來群組動畫 *steps*，而不是動畫元素。

</div>

以下範例在 `:enter` 與 `:leave` 上都使用了 [`group()`](api/animations/group)，採用兩種不同的時間設定，因此把兩個獨立的動畫平行套用到同一個元素上。

<code-example header="src/app/hero-list-groups.component.ts (excerpt)" path="animations/src/app/hero-list-groups.component.ts" region="animationdef"></code-example>

## 依序動畫與平行動畫

複雜動畫可以同時發生很多事。 但如果你想建立一個由多個動畫一個接一個發生的動畫呢？先前你用 [`group()`](api/animations/group) 讓多個動畫同時平行執行。

另一個叫 `sequence()` 的函式，能讓你把同樣的動畫一個接一個地執行。 在 `sequence()` 內部，動畫步驟由 `style()` 或 `animate()` 函式呼叫組成。

*   使用 `style()` 立即套用所提供的樣式資料。
*   使用 `animate()` 在一段指定時間區間內套用樣式資料。

## 篩選動畫範例

再看看範例頁面上的另一個動畫。 在「Filter/Stagger」分頁下，在 **Search Heroes** 文字方塊中輸入一些文字，例如 `Magnet` 或 `tornado`。

當你輸入時，篩選會即時運作。 隨著你輸入每個新字母、篩選條件越來越嚴格，元素會離開頁面。 當你刪除篩選方塊中的每個字母時，英雄清單會逐漸重新進入頁面。

HTML 範本包含一個叫 `filterAnimation` 的觸發器。

<code-example header="src/app/hero-list-page.component.html" path="animations/src/app/hero-list-page.component.html" region="filter-animations"></code-example>

元件裝飾器中的 `filterAnimation` 包含三個轉場。

<code-example header="src/app/hero-list-page.component.ts" path="animations/src/app/hero-list-page.component.ts" region="filter-animations"></code-example>

這個範例中的程式碼執行以下工作：

*   當使用者第一次開啟或瀏覽到此頁面時跳過動畫（篩選動畫會縮小已存在的內容範圍，所以它只對 DOM 中已存在的元素有效）
*   根據搜尋輸入的值篩選英雄

對每一次變化：

*   把正在離開 DOM 的元素的 opacity 與 width 設為 0，將它隱藏
*   在 300 毫秒內為正在進入 DOM 的元素加入動畫。 在動畫期間，元素會回復到預設的寬度與不透明度。

*   若有多個元素正在進入或離開 DOM，從頁面頂部開始錯開每個動畫，每個元素之間延遲 50 毫秒

## 為重新排序清單的項目加入動畫

雖然 Angular 開箱即可正確為 `*ngFor` 清單項目加入動畫，但若它們的順序改變，Angular 就做不到了。 這是因為它會無法追蹤每個元素是哪一個，導致動畫損壞。 幫助 Angular 追蹤這類元素的唯一方法，是為 `NgForOf` 指令指定一個 `TrackByFunction`。 這能確保 Angular 永遠知道每個元素是哪一個，進而永遠能把正確的動畫套用到正確的元素上。

<div class="alert is-important">

IMPORTANT: <br />
如果你需要為 `*ngFor` 清單的項目加上動畫，而且這些項目的順序有可能在執行階段改變，請務必使用 `TrackByFunction`。

</div>

## 動畫序列小結

為多個元素加入動畫的 Angular 函式，從 `query()` 開始尋找內部元素；例如，收集一個 `<div>` 內的所有圖片。 其餘函式 `stagger()`、[`group()`](api/animations/group) 與 `sequence()`，會套用瀑布效果，或讓你控制多個動畫步驟如何套用。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

*   [Angular 動畫簡介](guide/animations)
*   [轉場與觸發器](guide/transition-and-triggers)
*   [可重複使用的動畫](guide/reusable-animations)
*   [路由轉場動畫](guide/route-animations)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
