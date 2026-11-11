# 可重複使用的動畫

本主題提供如何建立可重複使用動畫的範例。

## 建立可重複使用的動畫

若要建立可重複使用的動畫，請使用 [`animation()`](api/animations/animation) 函式在獨立的 `.ts` 檔案中定義動畫，並把這個動畫定義宣告為 `const` 匯出變數。
接著，你可以使用 [`useAnimation()`](api/animations/useAnimation) 函式，在應用程式元件中匯入並重複使用這個動畫。

<docs-code header="src/app/animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="animation-const"/>

在前面的程式碼片段中，`transitionAnimation` 被宣告為匯出變數，因而可以重複使用。

HELPFUL: `height`、`opacity`、`backgroundColor` 與 `time` 這些輸入會在執行期間被取代。

你也可以匯出動畫的一部分。
例如，以下片段匯出了動畫 `trigger`。

<docs-code header="src/app/animations.1.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="trigger-const"/>

從這一步開始，你可以把可重複使用的動畫變數匯入元件類別中。
例如，以下程式碼片段匯入了 `transitionAnimation` 變數，並透過 `useAnimation()` 函式使用它。

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.3.ts" visibleRegion="reusable"/>

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫簡介"/>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場與觸發器"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜動畫序列"/>
  <docs-pill href="guide/animations/route-animations" title="路由轉場動畫"/>
</docs-pill-row>
