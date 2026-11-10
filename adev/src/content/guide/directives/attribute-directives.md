# 屬性指令

使用屬性指令，改變 DOM 元素與 Angular 元件的外觀或行為。

## 建立屬性指令

本節將引導你建立一個醒目顯示指令，把宿主元素的背景顏色設為黃色。

1. 若要建立指令，請使用 CLI 指令 [`ng generate directive`](tools/cli/schematics)。

   ```shell
   ng generate directive highlight
   ```

   CLI 會建立 `src/app/highlight.directive.ts`，以及對應的測試檔 `src/app/highlight.directive.spec.ts`。

   ```angular-ts
   import {Directive} from '@angular/core';

   @Directive({
     selector: '[appHighlight]',
   })
   export class HighlightDirective {}
   ```

   `@Directive()` 裝飾器的設定屬性指定了指令的 CSS 屬性選擇器 `[appHighlight]`。

1. 從 `@angular/core` 匯入 `ElementRef`。
   `ElementRef` 透過其 `nativeElement` 屬性，讓你能直接存取宿主 DOM 元素。

1. 在指令的 `constructor()` 中加入 `ElementRef`，以[注入](guide/di)宿主 DOM 元素的參照，也就是你套用 `appHighlight` 的那個元素。

1. 在 `HighlightDirective` 類別中加入把背景設為黃色的邏輯。

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

IMPORTANT: 指令*不*支援命名空間。

```angular-html {avoid}
<p app:Highlight>This is invalid</p>
```

## 套用屬性指令

若要使用 `HighlightDirective`，請在 HTML 範本中加入一個 `<p>` 元素，並把指令作為其屬性。

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" region="applied"/>

Angular 會建立 `HighlightDirective` 類別的執行個體，把 `<p>` 元素的參照注入指令的建構子，進而把 `<p>` 元素的背景樣式設為黃色。

## 處理使用者事件

本節示範如何偵測使用者把滑鼠移入或移出元素，並以設定或清除醒目顯示顏色來回應。

1. 使用 `@Directive()` 裝飾器中的 `host` 屬性，設定宿主事件繫結。

   <docs-code header="src/app/highlight.directive.ts (decorator)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" region="decorator"/>

1. 加入兩個事件處理器方法，並透過 `host` 屬性把宿主元素事件對應到這些方法。

   <docs-code header="highlight.directive.ts (mouse-methods)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" region="mouse-methods"/>

在指令的 [`host` 屬性](guide/components/host-elements#binding-to-the-host-element)上設定事件監聽器，即可訂閱承載屬性指令的 DOM 元素（本例中是 `<p>`）的事件。

HELPFUL: 這些處理器會委派給一個輔助方法 `highlight()`，由它在宿主 DOM 元素 `el` 上設定顏色。

完整的指令如下：

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

當指標懸停在段落元素上時，背景顏色會出現；指標移開時，背景顏色隨之消失。

<img alt="第二次醒目顯示" src="assets/images/guide/attribute-directives/highlight-directive-anim.gif">

## 把值傳入屬性指令

本節將引導你在套用 `HighlightDirective` 的同時設定醒目顯示顏色。

1. 在 `highlight.directive.ts` 中，從 `@angular/core` 匯入 `input`。

   <docs-code header="highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="imports"/>

1. 加入一個 `appHighlight` `input` 屬性。

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="input"/>

   `input()` 函式會為類別加上中繼資料，讓指令的 `appHighlight` 屬性可以被繫結。

1. 在 `app.component.ts` 中，為 `AppComponent` 加入一個 `color` 屬性。

   <docs-code header="app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.ts" region="class"/>

1. 若要同時套用指令與顏色，請以 `appHighlight` 指令選擇器進行屬性繫結，把它設為等於 `color`。

   <docs-code header="app.component.html (color)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="color"/>

   `[appHighlight]` 屬性繫結會執行兩項工作：
   - 把醒目顯示指令套用到 `<p>` 元素
   - 以屬性繫結設定指令的醒目顯示顏色

### 以使用者輸入設定值

本節將引導你加入單選按鈕，把你選擇的顏色繫結到 `appHighlight` 指令。

1. 如下列方式，在 `app.component.html` 中加入用來選擇顏色的標記：

   <docs-code header="app.component.html (v2)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="v2"/>

2. 修改 `AppComponent.color`，讓它沒有初始值。

   <docs-code header="app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" region="class"/>

3. 在 `highlight.directive.ts` 中，修改 `onMouseEnter` 方法，讓它先嘗試以 `appHighlight` 醒目顯示，若 `appHighlight` 為 `undefined`，則退回使用 `red`。
   <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"/>

4. 啟動你的應用程式，確認使用者可以用單選按鈕選擇顏色。

   <img alt="重構後的醒目顯示指令依使用者選取的單選按鈕改變顏色的動畫 gif" src="assets/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

## 繫結到第二個屬性

本節將引導你設定應用程式，讓開發者可以設定預設顏色。

1. 為 `HighlightDirective` 加入第二個 `input()` 屬性，稱為 `defaultColor`。

   <docs-code header="highlight.directive.ts (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" region="defaultColor"/>

2. 修改指令的 `onMouseEnter`，讓它先嘗試以 `appHighlight` 醒目顯示，再嘗試 `defaultColor`，若兩者都是 `undefined`，則退回使用 `red`。

   <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" region="mouse-enter"/>

3. 若要繫結到 `AppComponent.color`，並以「violet」作為退回的預設顏色，請加入下列 HTML。
   在這個例子中，`defaultColor` 繫結不使用方括號 `[]`，因為它的值是靜態字串，而不是動態運算式。

   <docs-code header="app.component.html (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="defaultColor"/>

   與元件一樣，你可以把多個指令屬性繫結加到一個宿主元素上。

如果沒有預設顏色繫結，預設顏色就是紅色。
當使用者選擇顏色時，選取的顏色會成為生效中的醒目顯示顏色。

<img alt="最終版醒目顯示指令的動畫 gif：沒有繫結時顯示紅色，設定了預設顏色時顯示紫羅蘭色；使用者選取顏色時，以該選取為準" src="assets/images/guide/attribute-directives/highlight-directive-final-anim.gif">

## 使用 `NgNonBindable` 停用 Angular 處理

若要防止瀏覽器中的運算式求值，在宿主元素上加上 `ngNonBindable`。
`ngNonBindable` 會停用範本中的插值、指令和繫結。

在以下範例中，運算式 `{{ 1 + 1 }}` 會就像在你的程式碼編輯器中一樣呈現，不會顯示 `2`。

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable"/>

把 `ngNonBindable` 套用到某個元素，會停止該元素的子元素的繫結。
不過，`ngNonBindable` 仍然讓指令在你套用 `ngNonBindable` 的元素上運作。
在以下範例中，`appHighlight` 指令仍然有效，但 Angular 不會對運算式 `{{ 1 + 1 }}` 求值。

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable-with-directive"/>

如果你把 `ngNonBindable` 套用到父元素，Angular 會停用該元素子元素的任何形式的插值和繫結，例如屬性繫結或事件繫結。
