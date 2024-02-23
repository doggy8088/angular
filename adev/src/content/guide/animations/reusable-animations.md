# 可重複使用的動畫

本主題提供一些範例，說明如何建立可重複使用的動畫。

## 建立可重複使用的動畫

若要建立可重複使用的動畫，請使用 [`animation()`](api/animations/animation) 函式在獨立的 `.ts` 檔案中定義動畫，並將此動畫定義宣告為 `const` 匯出變數。
然後，您可以使用 [`useAnimation()`](api/animations/useAnimation) 函式匯入並在任何應用程式元件中重複使用此動畫。

<docs-code header="src/app/animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="animation-const"/>

在前面的程式碼片段中，`transitionAnimation` 透過宣告為 export 變數來使其可重複使用。

HELPFUL: `height`, `opacity`, `backgroundColor` 和 `time` 輸入在執行期間會被替換。

您也可以匯出動畫的一部分。
例如，以下程式片段匯出動畫 `trigger`。

<docs-code header="src/app/animations.1.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="trigger-const"/>

從此處，您可以在您的元件類別中匯入可重複使用的動畫變數。
例如，以下程式碼片段匯入 `transitionAnimation` 變數，並透過 `useAnimation()` 函式使用它。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.3.ts" visibleRegion="reusable"/>

## 更多關於 Angular 動畫

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫介紹"/>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場和觸發器"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜的動畫順序"/>
  <docs-pill href="guide/animations/route-animations" title="路由轉場動畫"/>
</docs-pill-row>
