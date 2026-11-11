# 複雜動畫序列

IMPORTANT: Angular 團隊建議所有新程式碼都使用原生 CSS 製作動畫，不要用 Animations 套件。請利用本指南了解以 Animations 套件建置的既有程式碼。請參閱[從 Angular Animations 套件遷移](guide/animations/migration#complex-sequences)，了解如何開始在你的應用程式中使用純 CSS 動畫。

到目前為止，我們已學會單一 HTML 元素的簡單動畫。
Angular 也能讓你為協調好的序加入動畫，例如整個格線或元素清單在進入與離開頁面時的動畫。
你可以選擇讓多個動畫平行執行，或讓各自獨立的動畫依序一個接一個執行。

控制複雜動畫序列的函式如下：

| 函式                              | 說明                                                           |
| :-------------------------------- | :------------------------------------------------------------- |
| `query()`                         | 尋找一個或多個內部 HTML 元素。                         |
| `stagger()`                       | 為多個元素的動畫套用瀑布式延遲。 |
| [`group()`](api/animations/group) | 平行執行多個動畫步驟。                     |
| `sequence()`                      | 一個接一個地執行動畫步驟。                        |

## query() 函式

大多數複雜動畫都仰賴 `query()` 函式來尋找子元素並為它們套用動畫。基本範例包括：

| 範例                                   | 說明                                                                                                                                                                                            |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query()` 之後接 `animate()`      | 用來查詢簡單的 HTML 元素並直接為它們套用動畫。                                                                                                                          |
| `query()` 之後接 `animateChild()` | 用來查詢子元素，這些子元素本身帶有套用在其上的動畫中繼資料，並觸發這類動畫（否則會被目前／父元素的動畫擋住）。 |

`query()` 的第一個參數是一個 [CSS 選擇器](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)字串，其中也可以包含以下 Angular 專用 token：

| Token                      | 說明                                         |
| :------------------------- | :------------------------------------------- |
| `:enter` <br /> `:leave`   | 用於正在進入／離開的元素。               |
| `:animating`               | 用於目前正在播放動畫的元素。            |
| `@*` <br /> `@triggerName` | 用於帶有任何（或特定）觸發器的元素。 |
| `:self`                    | 正在播放動畫的元素本身。                |

<docs-callout title="進入與離開的元素">

並非所有子元素都會真的被視為正在進入／離開；這有時可能違反直覺、令人困惑。詳情請見 [query API 文件](api/animations/query#entering-and-leaving-elements)。

你也可以在動畫範例（動畫[簡介章節](guide/animations#about-this-guide)中有介紹）的「Querying」分頁中看到這一點的圖解。

</docs-callout>

## 使用 query() 與 stagger() 函式為多個元素加入動畫

透過 `query()` 查詢子元素之後，`stagger()` 函式能讓你定義每個項目之間的時間間隔，讓元素以彼此延遲的方式播放動畫。

以下範例示範如何使用 `query()` 與 `stagger()` 函式，為一個清單（英雄清單）加入動畫：每個英雄依序加入，彼此之間略有延遲，從上到下排列。

- 使用 `query()` 尋找符合特定條件、正在進入頁面的元素
- 對這些元素中的每一個，使用 `style()` 設定相同的初始樣式。
  讓它變透明，並使用 `transform` 把它移出原位，讓它能滑入定位。

- 使用 `stagger()` 讓每個動畫延遲 30 毫秒
- 使用自訂的緩動曲線，讓每個元素在畫面上播放 0.5 秒，同時淡入並還原 transform

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="page-animations"/>

## 使用 group() 函式的平行動畫

你已看過如何在每個連續動畫之間加入延遲。
但你可能也想設定平行發生的動畫。
例如，你可能想為同一個元素的兩個 CSS 屬性加入動畫，但每個屬性使用不同的 `easing` 函式。
為此，你可以使用動畫的 [`group()`](api/animations/group) 函式。

HELPFUL: [`group()`](api/animations/group) 函式是用來把動畫*步驟*分組，而不是把被動畫的元素分組。

以下範例在 `:enter` 與 `:leave` 上都使用了 [`group()`](api/animations/group)，採用兩種不同的時間設定，因此把兩個獨立的動畫平行套用到同一個元素上。

<docs-code header="src/app/hero-list-groups.component.ts (excerpt)" path="adev/src/content/examples/animations/src/app/hero-list-groups.component.ts" visibleRegion="animationdef"/>

## 依序動畫與平行動畫

複雜動畫可以同時發生很多事。
但如果你想建立一個由多個動畫一個接一個發生的動畫呢？先前你用 [`group()`](api/animations/group) 讓多個動畫同時平行執行。

另一個叫 `sequence()` 的函式，能讓你把同樣的動畫一個接一個地執行。
在 `sequence()` 內部，動畫步驟由 `style()` 或 `animate()` 函式呼叫組成。

- 使用 `style()` 立即套用所提供的樣式資料。
- 使用 `animate()` 在一段指定時間區間內套用樣式資料。

## 篩選動畫範例

再看看範例頁面上的另一個動畫。
在「Filter/Stagger」分頁下，在 **Search Heroes** 文字方塊中輸入一些文字，例如 `Magnet` 或 `tornado`。

當你輸入時，篩選會即時運作。
隨著你輸入每個新字母、篩選條件越來越嚴格，元素會離開頁面。
當你刪除篩選方塊中的每個字母時，英雄清單會逐漸重新進入頁面。

HTML 範本包含一個叫 `filterAnimation` 的觸發器。

<docs-code header="src/app/hero-list-page.component.html" path="adev/src/content/examples/animations/src/app/hero-list-page.component.html" visibleRegion="filter-animations" language="angular-html"/>

元件裝飾器中的 `filterAnimation` 包含三個轉場。

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="filter-animations"/>

這個範例中的程式碼執行以下工作：

- 當使用者第一次開啟或瀏覽到此頁面時跳過動畫（篩選動畫會縮小已存在的內容範圍，所以它只對 DOM 中已存在的元素有效）
- 根據搜尋輸入的值篩選英雄

對每一次變化：

- 把正在離開 DOM 的元素的 opacity 與 width 設為 0，將它隱藏
- 在 300 毫秒內為正在進入 DOM 的元素加入動畫。
  在動畫期間，元素會回復到預設的寬度與不透明度。

- 若有多個元素正在進入或離開 DOM，從頁面頂部開始錯開每個動畫，每個元素之間延遲 50 毫秒

## 為重新排序清單的項目加入動畫

雖然 Angular 開箱即可正確為 `*ngFor` 清單項目加入動畫，但若它們的順序改變，Angular 就做不到了。
這是因為它會無法追蹤每個元素是哪一個，導致動畫損壞。
幫助 Angular 追蹤這類元素的唯一方法，是為 `NgForOf` 指令指定一個 `TrackByFunction`。
這能確保 Angular 永遠知道每個元素是哪一個，進而永遠能把正確的動畫套用到正確的元素上。

IMPORTANT: 若你需要為 `*ngFor` 清單的項目加入動畫，且這些項目的順序有可能在執行期間改變，請務必使用 `TrackByFunction`。

## 動畫與元件檢視封裝

Angular 動畫是以元件的 DOM 結構為基礎，並不直接考慮[檢視封裝](guide/components/styling#style-scoping)，這表示使用 `ViewEncapsulation.Emulated` 的元件，其行為與使用 `ViewEncapsulation.None` 完全相同（`ViewEncapsulation.ShadowDom` 的行為則不同，稍後會簡短討論）。

例如，若把 `query()` 函式（在本動畫指南後續內容中會看到更多）套用在一棵使用模擬檢視封裝的元件樹頂端，這樣的查詢就能辨識（進而為其加入動畫）樹中任意深度的 DOM 元素。

另一方面，`ViewEncapsulation.ShadowDom` 會把 DOM 元素「藏」在 [`ShadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot) 元素內，改變元件的 DOM 結構。這類 DOM 操作確實會妨礙部分動畫實作正常運作，因為它仰賴簡單的 DOM 結構，且不考慮 `ShadowRoot` 元素。因此，建議避免為包含使用 ShadowDom 檢視封裝之元件的檢視套用動畫。

## 動畫序列小結

為多個元素加入動畫的 Angular 函式，從 `query()` 開始尋找內部元素；例如，收集一個 `<div>` 內的所有圖片。
其餘函式 `stagger()`、[`group()`](api/animations/group) 與 `sequence()`，會套用瀑布效果，或讓你控制多個動畫步驟如何套用。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫簡介"/>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場與觸發器"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
  <docs-pill href="guide/animations/route-animations" title="路由轉場動畫"/>
</docs-pill-row>
