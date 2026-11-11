
# 測試屬性指令

_屬性指令_會修改元素、元件或其他指令的行為。
它的名稱反映了指令的套用方式：作為宿主元素上的一個屬性。

## 測試 `HighlightDirective`

範例應用程式的 `HighlightDirective` 會根據資料繫結的顏色或預設顏色（lightgray），設定元素的背景顏色。
它也會將元素的自訂屬性（`customProperty`）設定為 `true`，理由僅僅是為了展示它可以這麼做。

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.ts"/>

它在整個應用程式中都有使用，或許最簡單的用法是在 `AboutComponent` 中：

<docs-code header="app/about/about.component.ts" path="adev/src/content/examples/testing/src/app/about/about.component.ts"/>

在 `AboutComponent` 中測試 `HighlightDirective` 的特定用法，只需要[元件測試情境](guide/testing/components-scenarios)中[「巢狀元件測試」](guide/testing/components-scenarios#nested-component-tests)一節所探討的技巧。

<docs-code header="app/about/about.component.spec.ts" path="adev/src/content/examples/testing/src/app/about/about.component.spec.ts" visibleRegion="tests"/>

不過，只測試單一使用案例，不太可能探索到指令能力的完整範圍。
找出並測試所有使用該指令的元件既繁瑣又脆弱，而且同樣不太可能提供完整覆蓋率。

_僅類別測試_可能有幫助，但像這樣的屬性指令往往會操作 DOM。
隔離的單元測試不會觸及 DOM，因此無法讓人對指令是否真的有效產生信心。

更好的解決方案是建立一個人造的測試元件，展示套用該指令的所有方式。

<docs-code header="app/shared/highlight.directive.spec.ts (TestComponent)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="test-component"/>

<img alt="Highlight 指令規格運作畫面" src="assets/images/guide/testing/highlight-directive-spec.png">

HELPFUL: `<input>` 案例將 `HighlightDirective` 繫結到輸入框中顏色值的名稱。
初始值是 "cyan" 這個字，應該會成為輸入框的背景顏色。

以下是這個元件的一些測試：

<docs-code header="app/shared/highlight.directive.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="selected-tests"/>

有幾個技巧值得注意：

- 當元素型別未知時，`By.directive` 謂詞是取得帶有此指令之元素的絕佳方式
- `By.css('h2:not([highlight])')` 中的 [`:not` 虛擬類別](https://developer.mozilla.org/docs/Web/CSS/:not)有助於找出_沒有_該指令的 `<h2>` 元素。
  `By.css('*:not([highlight])')` 會找出_任何_沒有該指令的元素。

- 即使沒有真正的瀏覽器，`DebugElement.styles` 也能透過 `DebugElement` 抽象層存取元素樣式。
  但當 `nativeElement` 看起來比抽象層更容易或更清楚時，也請自由利用它。

- Angular 會將指令加入它所套用元素的注入器中。
  預設顏色的測試使用第二個 `<h2>` 的注入器，取得它的 `HighlightDirective` 執行個體與其 `defaultColor`。

- `DebugElement.properties` 可以存取由指令設定的人造自訂屬性
