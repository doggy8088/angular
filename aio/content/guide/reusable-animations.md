# 可重複使用的動畫

本主題提供如何建立可重複使用動畫的範例。

## 先決條件

在繼續本主題之前，你應該熟悉下列內容：

*   [Angular 動畫簡介](guide/animations)
*   [轉場與觸發器](guide/transition-and-triggers)

## 建立可重複使用的動畫

若要建立可重複使用的動畫，請使用 [`animation()`](api/animations/animation) 函式在獨立的 `.ts` 檔案中定義動畫，並把這個動畫定義宣告為 `const` 匯出變數。 接著，你可以使用 [`useAnimation()`](api/animations/useAnimation) 函式，在應用程式元件中匯入並重複使用這個動畫。

<code-example header="src/app/animations.ts" path="animations/src/app/animations.1.ts" region="animation-const"></code-example>

在前面的程式碼片段中，`transitionAnimation` 被宣告為匯出變數，因而可以重複使用。

<div class="alert is-helpful">

**注意**：<br />
`height`、`opacity`、`backgroundColor` 與 `time` 輸入會在執行期間被取代。

</div>

你也可以匯出動畫的一部分。 例如，以下片段匯出了動畫 `trigger`。

<code-example header="src/app/animations.1.ts" path="animations/src/app/animations.1.ts" region="trigger-const"></code-example>

從這一步開始，你可以把可重複使用的動畫變數匯入元件類別中。 例如，以下程式碼片段匯入了 `transitionAnimation` 變數，並透過 `useAnimation()` 函式使用它。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.3.ts" region="reusable"></code-example>

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

*   [Angular 動畫簡介](guide/animations)
*   [轉場與觸發器](guide/transition-and-triggers)
*   [複雜動畫序列](guide/complex-animation-sequences)
*   [路由轉場動畫](guide/route-animations)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
