
{@a attribute-directive}

# 測試屬性指令

_屬性指令_會修改元素、元件或其他指令的行為。
它的名稱反映了指令的套用方式：作為宿主元素上的一個屬性。

<div class="alert is-helpful">

  若想親自動手體驗，可以在閱讀本指南的同時，<live-example name="testing" stackblitz="specs" noDownload>在瀏覽器中執行測試並探索測試程式碼</live-example>。

  如果你想試用本指南所述的應用程式，可以<live-example name="testing" noDownload>在瀏覽器中執行</live-example>，或<live-example name="testing" downloadOnly>下載並在本機執行</live-example>。

</div>

## 測試 `HighlightDirective`

範例應用程式的 `HighlightDirective` 會根據資料繫結的顏色或預設顏色（lightgray），設定元素的背景顏色。
它也會將元素的自訂屬性（`customProperty`）設定為 `true`，理由僅僅是為了展示它可以這麼做。

<code-example path="testing/src/app/shared/highlight.directive.ts" header="app/shared/highlight.directive.ts"></code-example>

它在整個應用程式中都有使用，或許最簡單的用法是在 `AboutComponent` 中：

<code-example path="testing/src/app/about/about.component.ts" header="app/about/about.component.ts"></code-example>

在 `AboutComponent` 中測試 `HighlightDirective` 的特定用法，只需要[元件測試情境](guide/testing-components-scenarios)中[「巢狀元件測試」](guide/testing-components-scenarios#巢狀元件測試)一節所探討的技巧。

<code-example path="testing/src/app/about/about.component.spec.ts" region="tests" header="app/about/about.component.spec.ts"></code-example>

不過，只測試單一使用案例，不太可能探索到指令能力的完整範圍。
找出並測試所有使用該指令的元件既繁瑣又脆弱，而且同樣不太可能提供完整覆蓋率。

_僅類別測試_可能有幫助，
但像這樣的屬性指令往往會操作 DOM。
隔離的單元測試不會觸及 DOM，因此，
無法讓人對指令是否真的有效產生信心。

更好的解決方案是建立一個人造的測試元件，展示套用該指令的所有方式。

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="test-component" header="app/shared/highlight.directive.spec.ts (TestComponent)"></code-example>

<div class="lightbox">
  <img src='generated/images/guide/testing/highlight-directive-spec.png' alt="Highlight 指令規格運作畫面">
</div>

<div class="alert is-helpful">

`<input>` 案例將 `HighlightDirective` 繫結到輸入框中顏色值的名稱。
初始值是 "cyan" 這個字，應該會成為輸入框的背景顏色。

</div>

以下是這個元件的一些測試：

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests" header="app/shared/highlight.directive.spec.ts (selected tests)"></code-example>

有幾個技巧值得注意：

- 當元素型別未知時，`By.directive` 謂詞是取得帶有此指令之元素的絕佳方式。

- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:not">`:not` 虛擬類別</a>
  在 `By.css('h2:not([highlight])')` 中有助於找出_沒有_該指令的 `<h2>` 元素。
  `By.css('*:not([highlight])')` 會找出_任何_沒有該指令的元素。

- 即使沒有真正的瀏覽器，`DebugElement.styles` 也能透過 `DebugElement` 抽象層存取元素樣式。
  但當 `nativeElement` 看起來比抽象層更容易或更清楚時，也請自由利用它。

- Angular 會將指令加入它所套用元素的注入器中。
  預設顏色的測試使用第二個 `<h2>` 的注入器，取得它的 `HighlightDirective` 執行個體
  與其 `defaultColor`。

- `DebugElement.properties` 可以存取由指令設定的人造自訂屬性。
