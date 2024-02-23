# 測試屬性指令

一個 *attribute directive* 修飾元素、元件或另一個指令的行為。
其名稱反映指令的應用方式：作為主機元素上的屬性。

## 測試 `HighlightDirective`

範例應用程式的 `HighlightDirective` 會根據資料繫結的顏色或預設顏色（淺灰色）設定元素的背景顏色。
它也會將元素的客製屬性 \(`customProperty`\) 設為 `true`，沒有其他原因，只是為了顯示它可以做到。

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.ts"/>

它用於整個應用程式中，可能最簡單的是在 `AboutComponent` 中：

<docs-code header="app/about/about.component.ts" path="adev/src/content/examples/testing/src/app/about/about.component.ts"/>

只要在 [元件測試情境](guide/testing/components-scenarios) 的 [嵌套元件測試](guide/testing/components-scenarios#nested-component-tests) 區段中探討過的技巧，即可測試 `HighlightDirective` 在 `AboutComponent` 中的特定用法。

<docs-code header="app/about/about.component.spec.ts" path="adev/src/content/examples/testing/src/app/about/about.component.spec.ts" visibleRegion="tests"/>

然而，測試單個用例不太可能探索指令功能的全部範圍。
查找和測試使用該指令的所有組件既繁瑣，又脆弱，而且幾乎不可能提供全面的覆蓋範圍。

*僅限類別的測試* 可能很有用，但像此類型的屬性指令往往會操控 DOM。
孤立的單元測試不接觸 DOM，因此不會讓人對指令的效能有信心。

更好的解決方案是建立一個人工測試元件，以示範應用指令的所有方法。

<docs-code header="app/shared/highlight.directive.spec.ts (TestComponent)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="test-component"/>

<img alt="HighlightDirective spec in action" src="assets/content/images/guide/testing/highlight-directive-spec.png">

HELPFUL: `<input>` 案例將 `HighlightDirective` 繫結到輸入框中顏色的值名稱。
初始值是單字「cyan」，應為輸入框的背景顏色。

以下是此元件的一些測試：

<docs-code header="app/shared/highlight.directive.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="selected-tests"/>

值得注意的幾項技術有：

* `By.directive` 謂詞是一種很好的方式，可以在 *元素類型未知時* 取得具有此指令的元素
* `By.css('h2:not([highlight])')` 中的 [`:not` 偽類別](https://developer.mozilla.org/docs/Web/CSS/:not) 可協助尋找 *沒有* 指令的 `<h2>` 元素。
    `By.css('*:not([highlight])')` 可找到 *任何* 沒有指令的元素。

* `DebugElement.styles` 可存取元素樣式，即使在沒有實際瀏覽器的情況下也是如此，這要歸功於 `DebugElement` 抽象化。
    但當抽象化看起來比本機元素更簡單或更清晰時，請隨時利用 `nativeElement`。

* Angular 會將指令新增至套用該指令的元素的注入器中。
    預設顏色的測試使用第二個 `<h2>` 的注入器來取得其 `HighlightDirective` 執行個體及其 `defaultColor`。

* `DebugElement.properties` 可存取由指令設定的人工自訂屬性

