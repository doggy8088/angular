# 可重複使用的動畫

#### 先決條件

對下列概念有基本的理解：

* [Angular 動畫簡介](guide/animations)
* [轉場與觸發器](guide/transition-and-triggers)

<hr>

Angular 動畫中的 [AnimationOptions](https://angular.io/api/animations/AnimationOptions) 介面讓你能建立可在不同元件之間重複使用的動畫。

## 建立可重複使用的動畫

若要建立可重複使用的動畫，請使用 [`animation()`](https://angular.io/api/animations/animation) 方法在獨立的 `.ts` 檔案中定義動畫，並將這個動畫定義宣告為 `const` 匯出變數。接著，你可以匯入這個動畫，並使用 [`useAnimation()`](https://angular.io/api/animations/useAnimation) API 在應用程式的任何元件中重複使用它。

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts" region="reusable" language="typescript"></code-example>

在上面的程式碼片段中，`transAnimation` 被宣告為匯出變數，因而可以重複使用。

<div class="alert is-helpful">

**注意：** `height`、`opacity`、`backgroundColor` 與 `time` 輸入會在執行期間被取代。
</div>

你可以將可重複使用的 `transAnimation` 變數匯入元件類別，並使用 `useAnimation()` 方法重複使用它，如下所示。

<code-example path="animations/src/app/open-close.component.3.ts" header="src/app/open-close.component.ts" region="reusable" language="typescript"></code-example>

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

* [Angular 動畫簡介](guide/animations)
* [轉場與觸發器](guide/transition-and-triggers)
* [複雜動畫序列](guide/complex-animation-sequences)
* [路由轉場動畫](guide/route-animations)
