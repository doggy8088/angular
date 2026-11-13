# 屬性指令

使用屬性指令，改變 DOM 元素與 Angular 元件的外觀或行為。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 建立屬性指令

本節將引導你建立一個醒目顯示指令，把宿主元素的背景顏色設為黃色。

1.  若要建立指令，請使用 CLI 指令 [`ng generate directive`](cli/generate)。

    <code-example format="shell" language="shell">

    ng generate directive highlight

    </code-example>

CLI 會建立 `src/app/highlight.directive.ts`、對應的測試檔 `src/app/highlight.directive.spec.ts`，並在 `AppModule` 中宣告這個指令類別。

CLI 產生的預設 `src/app/highlight.directive.ts` 如下：

    <code-example header="src/app/highlight.directive.ts" path="attribute-directives/src/app/highlight.directive.0.ts"></code-example>

`@Directive()` 裝飾器的設定屬性指定了指令的 CSS 屬性選擇器 `[appHighlight]`。

1.  從 `@angular/core` 匯入 `ElementRef`。 `ElementRef` 透過其 `nativeElement` 屬性，讓你能直接存取宿主 DOM 元素。

1.  在指令的 `constructor()` 中加入 `ElementRef`，以[注入](guide/dependency-injection)宿主 DOM 元素的參照，也就是你套用 `appHighlight` 的那個元素。

1.  在 `HighlightDirective` 類別中加入把背景設為黃色的邏輯。

    <code-example header="src/app/highlight.directive.ts" path="attribute-directives/src/app/highlight.directive.1.ts"></code-example>

<div class="alert is-helpful">

指令*不*支援命名空間。

<code-example header="src/app/app.component.avoid.html (unsupported)" path="attribute-directives/src/app/app.component.avoid.html" region="unsupported"></code-example>

</div>

<a id="apply-directive"></a>

## 套用屬性指令

1.  若要使用 `HighlightDirective`，請在 HTML 範本中加入一個 `<p>` 元素，並把指令作為其屬性。

    <code-example header="src/app/app.component.html" path="attribute-directives/src/app/app.component.1.html" region="applied"></code-example>

Angular 會建立 `HighlightDirective` 類別的執行個體，把 `<p>` 元素的參照注入指令的建構子，進而把 `<p>` 元素的背景樣式設為黃色。

<a id="respond-to-user"></a>

## 處理使用者事件

本節示範如何偵測使用者把滑鼠移入或移出元素，並以設定或清除醒目顯示顏色來回應。

1.  從 `@angular/core` 匯入 `HostListener`。

    <code-example header="src/app/highlight.directive.ts (imports)" path="attribute-directives/src/app/highlight.directive.2.ts" region="imports"></code-example>

1.  加入兩個事件處理器，在滑鼠移入或移出時回應，每個都加上 `@HostListener()` 裝飾器。

    <code-example header="src/app/highlight.directive.ts (mouse-methods)" path="attribute-directives/src/app/highlight.directive.2.ts" region="mouse-methods"></code-example>

使用 `@HostListener()` 裝飾器，即可訂閱承載屬性指令的 DOM 元素（本例中是 `<p>`）的事件。

<div class="alert is-helpful">

這些處理常式會委派給輔助方法 `highlight()`，由它在宿主 DOM 元素 `el` 上設定顏色。

</div>

完整的指令如下：

<code-example header="src/app/highlight.directive.ts" path="attribute-directives/src/app/highlight.directive.2.ts"></code-example>

當指標懸停在段落元素上時，背景顏色會出現；指標移開時，背景顏色隨之消失。

<div class="lightbox">

<img alt="第二個醒目提示" src="generated/images/guide/attribute-directives/highlight-directive-anim.gif">

</div>

<a id="bindings"></a>

## 把值傳入 attribute 指令

本節將帶你一邊套用 `HighlightDirective`，一邊設定醒目提示顏色。

1.  在 `highlight.directive.ts` 中，從 `@angular/core` 匯入 `Input`。

    <code-example header="src/app/highlight.directive.ts (imports)" path="attribute-directives/src/app/highlight.directive.3.ts" region="imports"></code-example>

1.  加入一個 `appHighlight` `@Input()` 屬性。

    <code-example header="src/app/highlight.directive.ts" path="attribute-directives/src/app/highlight.directive.3.ts" region="input"></code-example>

`@Input()` 裝飾器會為類別加入詮釋資料，讓指令的 `appHighlight` 屬性可供繫結。

1.  在 `app.component.ts` 中，為 `AppComponent` 加入一個 `color` 屬性。

    <code-example header="src/app/app.component.ts (class)" path="attribute-directives/src/app/app.component.1.ts" region="class"></code-example>

1.  要同時套用指令與顏色，請使用屬性繫結搭配 `appHighlight` 指令選擇器，並將它設為等於 `color`。

    <code-example header="src/app/app.component.html (color)" path="attribute-directives/src/app/app.component.html" region="color"></code-example>

`[appHighlight]` attribute 繫結會執行兩項工作：

    *   把醒目提示指令套用到 `<p>` 元素
    *   用屬性繫結設定指令的醒目提示顏色

### 用使用者輸入設定值

本節將引導你加入單選按鈕，把你選擇的顏色繫結到 `appHighlight` 指令。

1.  在 `app.component.html` 中加入下列選擇顏色的標記：

    <code-example header="src/app/app.component.html (v2)" path="attribute-directives/src/app/app.component.html" region="v2"></code-example>

1.  修改 `AppComponent.color`，讓它沒有初始值。

    <code-example header="src/app/app.component.ts (class)" path="attribute-directives/src/app/app.component.ts" region="class"></code-example>

1.  在 `highlight.directive.ts` 中，修改 `onMouseEnter` 方法，讓它先嘗試用 `appHighlight` 進行醒目提示，若 `appHighlight` 為 `undefined`，則改用 `red`。

    <code-example header="src/app/highlight.directive.ts (mouse-enter)" path="attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"></code-example>

1.  提供應用程式服務，確認使用者可以用單選按鈕選擇顏色。

    <div class="lightbox">

    <img alt="重構後的 highlight 指令依使用者選取的選項按鈕變換顏色的動畫 GIF" src="generated/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

    </div>

<a id="second-property"></a>

## 繫結到第二個屬性

本節將引導你設定應用程式，讓開發者可以設定預設顏色。

1.  為 `HighlightDirective` 加入第二個 `Input()` 屬性，名為 `defaultColor`。

    <code-example header="src/app/highlight.directive.ts (defaultColor)" path="attribute-directives/src/app/highlight.directive.ts" region="defaultColor"></code-example>

1.  修改指令的 `onMouseEnter`，讓它先嘗試用 `appHighlight` 進行醒目提示，再用 `defaultColor`，若兩個屬性都是 `undefined`，則改用 `red`。

    <code-example header="src/app/highlight.directive.ts (mouse-enter)" path="attribute-directives/src/app/highlight.directive.ts" region="mouse-enter"></code-example>

1.  要繫結到 `AppComponent.color`，並以 "violet" 作為預設顏色，請加入下列 HTML。在這個情況下，`defaultColor` 繫結不使用方括號 `[]`，因為它是靜態的。

    <code-example header="src/app/app.component.html (defaultColor)" path="attribute-directives/src/app/app.component.html" region="defaultColor"></code-example>

與元件相同，你可以在宿主元素上加入多個指令屬性繫結。

如果沒有預設顏色繫結，預設顏色就是紅色。當使用者選擇顏色時，所選顏色就會成為作用中的醒目提示顏色。

<div class="lightbox">

<img alt="最終 highlight 指令的動畫 GIF：無繫結時顯示紅色，設定預設顏色時顯示紫色；使用者選取顏色時以選取為準" src="generated/images/guide/attribute-directives/highlight-directive-final-anim.gif">

</div>

<a id="ngNonBindable"></a>

## 用 `NgNonBindable` 停用 Angular 處理

要在瀏覽器中防止運算式求值，請在宿主元素上加入 `ngNonBindable`。`ngNonBindable` 會停用範本中的插值、指令與繫結。

在下列範例中，運算式 `{{ 1 + 1 }}` 會照它在程式碼編輯器中的樣子呈現，不會顯示 `2`。

<code-example header="src/app/app.component.html" linenums="false" path="attribute-directives/src/app/app.component.html" region="ngNonBindable"></code-example>

把 `ngNonBindable` 套用到某個元素上，會停止該元素子元素的繫結。不過，`ngNonBindable` 仍允許指令在你套用 `ngNonBindable` 的元素上運作。在下列範例中，`appHighlight` 指令仍然有效，但 Angular 不會對運算式 `{{ 1 + 1 }}` 求值。

<code-example header="src/app/app.component.html" linenums="false" path="attribute-directives/src/app/app.component.html" region="ngNonBindable-with-directive"></code-example>

如果你把 `ngNonBindable` 套用到父元素，Angular 會對該元素的子元素停用插值與任何形式的繫結，例如屬性繫結或事件繫結。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
