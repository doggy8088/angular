# 屬性指令

使用屬性指令變更 DOM 元素和 Angular 元件的外觀或行為。

## 建立一個屬性指令

本節引導您建立一個重點指示，將主機元素的背景顏色設定為黃色。

1. 若要建立指令，請使用 CLI 指令 [`ng generate directive`](tools/cli/schematics)。

    <docs-code language="shell">

    ng generate directive highlight

    </docs-code>

    CLI 會建立 `src/app/highlight.directive.ts`，以及對應的測試檔案 `src/app/highlight.directive.spec.ts`。

    <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.0.ts"/>

    `@Directive()` 裝飾器的設定內容指定指令的 CSS 屬性選擇器 `[appHighlight]`。

1. 從 `@angular/core` 匯入 `ElementRef`。
    `ElementRef` 透過其 `nativeElement` 內容授予對主機 DOM 元素的直接存取權。

1. 在指令的 `constructor()` 中加入 `ElementRef` 以 [注入](guide/di) 對主機 DOM 元素的參照，也就是套用 `appHighlight` 的元素。

1. 將邏輯新增至 `HighlightDirective` 類別，將背景設定為黃色。

    <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

有幫助的：指令*不*支援命名空間。

<docs-code header="src/app/app.component.avoid.html (unsupported)" path="adev/src/content/examples/attribute-directives/src/app/app.component.avoid.html" visibleRegion="unsupported"/>

## 應用屬性指令

1. 若要使用 `HighlightDirective`，請在 HTML 範本中加入一個 `<p>` 元素，並將指令作為屬性。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" visibleRegion="applied"/>

Angular 建立一個 `HighlightDirective` 類別的實例，並在指令的建構函數中注入對 `<p>` 元素的參照，這會將 `<p>` 元素的背景樣式設定為黃色。

## 處理使用者事件

本節說明如何偵測使用者將滑鼠移入或移出元素，並藉由設定或清除醒目顏色來回應。

1. 從 '@angular/core' 匯入 `HostListener`。

    <docs-code header="src/app/highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="imports"/>

1. 加入兩個事件處理常式，分別對滑鼠移入或移出時做出回應，並使用 `@HostListener()` 裝飾器。

    <docs-code header="src/app/highlight.directive.ts (mouse-methods)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="mouse-methods"/>

使用 `@HostListener()` 裝飾器，訂閱包含屬性指令的 DOM 元素的事件，在本案例中為 `<p>`。

HELPFUL: 處理常式委派給輔助方法 `highlight()`，將顏色設定在主機 DOM 元素 `el` 上。

完整的指令如下：

<docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

當指標移至段落元素上時背景顏色出現，當指標移出時背景顏色消失。

<img alt="第二個重點" src="assets/content/images/guide/attribute-directives/highlight-directive-anim.gif">

## 將值傳遞至屬性指令

這部分會引導你設定在套用 `HighlightDirective` 時的醒目顏色。

1. 在 `highlight.directive.ts` 中，從 `@angular/core` 匯入 `Input`。

    <docs-code header="src/app/highlight.directive.ts (匯入)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="imports"/>

1. 新增 `appHighlight` `@Input()` 屬性。

    <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="input"/>

    `@Input()` 裝飾器會將元資料新增到類別，讓指令的 `appHighlight` 屬性可供繫結。

1. 在 `app.component.ts` 中，新增 `color` 屬性至 `AppComponent`。

    <docs-code header="src/app/app.component.ts (類別)" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.ts" visibleRegion="class"/>

1. 若要同時套用指令和色彩，請使用屬性繫結加上 `appHighlight` 指令選擇器，並將其設定等於 `color`。

    <docs-code header="src/app/app.component.html (色彩)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="color"/>

    `[appHighlight]` 屬性繫結執行兩個工作：

    * 將醒目提示指令套用至 `<p>` 元素
    * 使用屬性繫結設定指令的醒目提示色彩

### 使用使用者輸入設定值

此區段引導您透過新增無線電按鈕，將您的顏色選擇繫結至 `appHighlight` 指令。

1. 在 `app.component.html` 中新增標記以選擇顏色，如下所示：

    <docs-code header="src/app/app.component.html (v2)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="v2"/>

1. 修改 `AppComponent.color`，使其沒有初始值。

    <docs-code header="src/app/app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" visibleRegion="class"/>

1. 在 `highlight.directive.ts` 中，修改 `onMouseEnter` 方法，使其先嘗試使用 `appHighlight` 進行重點標示，如果 `appHighlight` 為 `undefined`，則改用 `red`。

    <docs-code header="src/app/highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="mouse-enter"/>

1. 執行您的應用程式，以驗證使用者可以使用無線電按鈕選擇顏色。

    <img alt="根據使用者選擇的無線電按鈕，以動畫 GIF 呈現重新調整重點標示指令的變色效果" src="assets/content/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

## 綁定至第二個屬性

本節引導您設定您的應用程式，以便開發人員可以設定預設顏色。

1. 在 `HighlightDirective` 中新增一個名為 `defaultColor` 的第二個 `Input()` 屬性。

    <docs-code header="src/app/highlight.directive.ts (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="defaultColor"/>

1. 修改指令的 `onMouseEnter`，使其先嘗試使用 `appHighlight` 進行突顯，然後使用 `defaultColor`，如果兩個屬性都是 `undefined`，則退回到 `red`。

    <docs-code header="src/app/highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="mouse-enter"/>

1. 若要繫結到 `AppComponent.color` 並以「紫羅蘭」作為預設顏色，請新增以下 HTML。
    在本例中，`defaultColor` 繫結不使用方括號 `[]`，因為它是靜態的。

    <docs-code header="src/app/app.component.html (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="defaultColor"/>

    與元件一樣，您可以將多個指令屬性繫結新增至主機元素。

如果沒有預設顏色繫結，預設顏色為紅色。
當使用者選擇顏色時，選取的顏色會變成主動突顯顏色。

<img alt="最終的亮點指令的動畫 gif，顯示紅色沒有約束力，以及默認顏色設定的紫羅蘭色。當用戶選擇顏色時，選擇具有優先權。" src="assets/content/images/guide/attribute-directives/highlight-directive-final-anim.gif">

## 使用 `NgNonBindable` 停用 Angular 處理

html
<div ng-non-bindable>
  {{ variable }}
</div>

要防止在瀏覽器中進行表達式評估，請將 `ngNonBindable` 加入主機元素。
`ngNonBindable` 停用範本中的內插、指令和繫結。

在以下範例中，表達式 `{{ 1 + 1 }}` 呈現時就像在您的程式碼編輯器中一樣，不會顯示 `2`。

<docs-code header="src/app/app.component.html" linenums="false" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable"/>

將 `ngNonBindable` 套用至元素會停止對該元素的子元素進行繫結。
但是，`ngNonBindable` 仍會讓指令在您套用 `ngNonBindable` 的元素上運作。
在以下範例中，`appHighlight` 指令仍處於作用中，但 Angular 沒有評估表達式 `{{ 1 + 1 }}`。

<docs-code header="src/app/app.component.html" linenums="false" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable-with-directive"/>

如果你將 `ngNonBindable` 套用到父元素，Angular 會停用該元素子元素的插補和任何類型的繫結，例如屬性繫結或事件繫結。
