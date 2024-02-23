# 複雜動畫序列

到目前為止，我們已經學習了單一 HTML 元素的簡單動畫。
Angular 也讓您可以對協調的順序進行動畫處理，例如當整個網格或元素清單進入和離開頁面時。
您可以選擇同時執行多個動畫，或按順序執行離散動畫，一個接一個。

控制複雜動畫序列的函數為：

| 功能                         | 詳細資料 |
|:---                               |:---     |
| `query()`                         | 尋找一個或多個內部 HTML 元素。 |
| `stagger()`                       | 對多個元素的動畫套用層疊延遲。 |
| [`group()`](api/animations/group) | 並行執行多個動畫步驟。 |
| `sequence()`                      | 依序執行動畫步驟。 |

## query() 函數

最複雜的動畫仰賴 `query()` 函數來尋找子元素並對其套用動畫，以下是此類動畫的基本範例：

| 範例                               | 詳細資料 |
|:---                                    |:---     |
| `query()` 接著 `animate()`      | 用於查詢簡單 HTML 元素，並直接套用動畫。                                                                                                                            |
| `query()` 接著 `animateChild()` | 用於查詢子元素，這些子元素本身套用了動畫的元資料，並觸發此動畫（否則會被當前/父元素的動畫所阻擋）。 |

`query()` 的第一個參數是一個 [css selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) 字串，它也可以包含以下 Angular 特有的標記：

| 令牌                     | 詳細資料 |
|:---                        |:---     |
| `:enter` <br /> `:leave`   | 用於進入/離開元素。               |
| `:animating`               | 用於目前正在動畫化的元素。            |
| `@*` <br /> `@triggerName` | 用於具有任何—或特定—觸發器的元素。 |
| `:self`                    | 動畫化元素本身。                |

<docs-callout title="進入和離開元素">

並不是所有子元素都被視為進入/離開；這有時可能違反直覺且令人困惑。請參閱 [query api 文件](api/animations/query#entering-and-leaving-elements) 以了解更多資訊。

您還可以在動畫範例中看到此說明 \(在動畫 [介紹區段](guide/animations#about-this-guide) 中介紹\) 的查詢標籤下。

</docs-callout>

## 使用 query() 和 stagger() 函數動畫多個元素

在通過 `query()` 查詢子元素後，`stagger()` 函數可讓您定義每個查詢項目之間的定時間隔，並以延遲方式為元素添加動畫效果。

以下範例示範如何使用 `query()` 和 `stagger()` 函數，以動畫方式加入清單 \(英雄\) 並逐一顯示，並以些微延遲，由上至下。

* 使用 `query()` 來尋找符合特定標準的進入頁面的元素
* 對於這些元素的每個元素，使用 `style()` 來設定元素的相同初始樣式。
    使其透明並使用 `transform` 將其移出位置，以便它可以滑入到位。

* 使用 `stagger()` 將每個動畫延遲 30 毫秒
* 使用自定義的緩和曲線在螢幕上為每個元素動畫化 0.5 秒，同時淡入並取消轉換

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="page-animations"/>

## 平行動畫使用 group() 函數

你已經看過如何在每個連續動畫之間加入延遲。
但你可能也想設定同時發生的動畫。
例如，你可能想對同一個元素的兩個 CSS 屬性做動畫，但對每個屬性使用不同的 `easing` 函數。
針對這種情況，你可以使用動畫 [`group()`](api/animations/group) 函數。

HELPFUL: [`group()`](api/animations/group) 函數用於將動畫 *步驟* 分組，而不是動畫元素。

以下範例在 `:enter` 和 `:leave` 中同時使用 [`group()`](api/animations/group)，以取得兩種不同的計時設定，因此可以同時對同一個元素套用兩個獨立的動畫。

<docs-code header="src/app/hero-list-groups.component.ts (excerpt)" path="adev/src/content/examples/animations/src/app/hero-list-groups.component.ts" visibleRegion="animationdef"/>

## 順序 vs. 平行動畫

複雜的動畫可以同時執行很多事情。
但如果你想要建立一個涉及多個動畫、一個接一個發生的動畫，該怎麼辦？先前你使用 [`group()`](api/animations/group) 在同一時間執行多個動畫，平行執行。

另一個名為 `sequence()` 的函數可讓您依序執行這些動畫。
在 `sequence()` 內，動畫步驟包含 `style()` 或 `animate()` 函數呼叫。

* 使用 `style()` 立即套用提供的造型資料。
* 使用 `animate()` 在給定的時間間隔內套用造型資料。

## 動畫範例過濾

請在範例頁面中看看另一個動畫。
在「Filter/Stagger」標籤下，在 **搜尋英雄** 文字方塊中輸入一些文字，例如 `Magnet` 或 `tornado`。

當您輸入時，篩選器以即時方式運作。
當您輸入每個新字母時，元素會離開頁面，而篩選器會逐漸變得更嚴格。
當您刪除篩選框中的每個字母時，英雄列表會逐漸重新進入頁面。

HTML 範本包含一個稱為 `filterAnimation` 的觸發器。

<docs-code header="src/app/hero-list-page.component.html" path="adev/src/content/examples/animations/src/app/hero-list-page.component.html" visibleRegion="filter-animations"/>

元件裝飾器中的 `filterAnimation` 包含三個轉換。

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="filter-animations"/>

這個範例中的程式碼執行下列工作：

* 當使用者首次開啟或導覽至此頁面時，略過動畫\(過濾動畫會縮小已存在內容，因此它僅適用於已存在於 DOM 中的元素\)
* 依照搜尋輸入值過濾英雄

針對每個變更：

* 透過將元素的不透明度和寬度設為 0，來隱藏元素，同時讓它保留在 DOM 中
* 元素進入 DOM 時，以 300 毫秒的動畫顯示。
    在動畫期間，元素假設其預設寬度和不透明度。

* 如果有多個元素進入或離開 DOM，則從頁面頂端開始，以 50 毫秒的延遲，交錯執行每個動畫

## 重新排序清單的動畫項目

雖然 Angular 可以正確地為 `*ngFor` 清單項目執行動畫，但如果這些項目順序變更，它將無法執行動畫。
這是因為它將無法追蹤哪個元素是哪個元素，導致動畫中斷。
幫助 Angular 追蹤這些元素的唯一方法是將 `TrackByFunction` 指定給 `NgForOf` 指令。
這可確保 Angular 始終知道哪個元素是哪個元素，因此可以隨時將正確的動畫套用至正確的元素。

重要：
如果您需要為 `*ngFor` 清單中的項目加入動畫，並且在執行期間有可能會變更這些項目的順序，請務必使用 `TrackByFunction`。

## 動畫和元件檢視封裝

Angular 動畫基於元件 DOM 結構，並不直接考慮 [檢視封裝](/guide/components/styling#style-scoping)，這表示使用 `ViewEncapsulation.Emulated` 的元件行為完全如同使用 `ViewEncapsulation.None` 一樣（我們稍後會討論 `ViewEncapsulation.ShadowDom` 行為不同）。

例如，如果在使用模擬檢視封裝的組件樹最上層套用 `query()` 函式（您會在動畫指南的其餘部分看到更多內容），此查詢就能識別（並因此動畫化）樹的任何深度上的 DOM 元素。

另一方面，`ViewEncapsulation.ShadowDom` 通過將 DOM 元素「隱藏」在 [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) 元素內來改變元件的 DOM 結構。此類 DOM 操作確實會阻止某些動畫實作正常運作，因為它依賴簡單的 DOM 結構，而且不會考慮 `ShadowRoot` 元素。因此，建議避免將動畫套用到使用 ShadowDom 視圖封裝的元件的視圖。

## 動畫序列摘要

Angular 用於多個元素動畫的函數以 `query()` 開始，用於尋找內部元素；例如，收集 `<div>` 中的所有圖像。
其餘函數 `stagger()`, [`group()`](api/animations/group) 和 `sequence()`，應用級聯或讓您控制多個動畫步驟的應用方式。

## 更多關於 Angular 動畫

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫簡介"/>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場和觸發器"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
  <docs-pill href="guide/animations/route-animations" title="路由轉場動畫"/>
</docs-pill-row>

