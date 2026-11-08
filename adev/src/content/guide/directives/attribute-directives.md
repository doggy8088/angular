# 屬性指令

屬性指令會改變 DOM 元素和 Angular 元件的外觀或行為。

## 一次性行為請用範本繫結

Angular 的範本語法已經涵蓋了變更單一元素的類別、樣式、屬性和事件：

- [類別與樣式繫結](guide/templates/binding#css-class-and-style-property-bindings)可新增與移除 CSS 類別和行內樣式。
- [屬性與特性繫結](guide/templates/binding)可設定 DOM 特性和 HTML 屬性。
- [事件監聽器](guide/templates/event-listeners)可回應使用者互動。

當你想把這類行為打包成可重複使用的單位、套用到任何元素或元件時，屬性指令就很有用。

## 建立屬性指令

自訂屬性指令是一個帶有 `@Directive()` 裝飾器的 JavaScript 類別。裝飾器的 `selector` 定義了套用該指令的屬性。方括號使它成為屬性選擇器，因此該指令會比對帶有該屬性的元素。依慣例，使用像 `app` 這樣的前綴來避免命名衝突：

```ts
import {Directive} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {}
```

HELPFUL: CLI 指令 [`ng generate directive`](tools/cli/schematics) 會產生一個指令及其測試檔案的鷹架。

指令可以透過宿主繫結以宣告方式改變其宿主，也可以透過宿主元素的參考以命令方式改變。這個範例[注入](guide/di) [`ElementRef`](api/core/ElementRef)，並透過其 `nativeElement` 屬性存取元素，把背景設為黃色：

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

IMPORTANT: 指令*不*支援命名空間。

```angular-html {avoid}
<p app:Highlight>This is invalid</p>
```

## 套用屬性指令

若要套用該指令，在元素上以屬性形式加上它的選擇器：

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" region="applied"/>

Angular 會為該 `<p>` 元素建立一個 `HighlightDirective` 實例，注入該元素的參考，並把它的背景設為黃色。

## 處理使用者事件

若要回應使用者互動，透過 `@Directive()` 裝飾器的 `host` 屬性，把宿主元素事件繫結到處理方法。以下指令在指標停留在宿主元素上時將其反白，指標離開時清除反白：

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

`host` 屬性把 `mouseenter` 和 `mouseleave` 事件對應到 `onMouseEnter()` 和 `onMouseLeave()` 方法，這兩個方法會委派給一個 `highlight()` 輔助函式，由它在宿主元素上設定背景顏色。關於宿主事件繫結的更多資訊，請參閱[繫結到宿主元素](guide/components/host-elements#binding-to-the-host-element)。

## 接受輸入值

和元件一樣，指令透過 [`input()`](guide/components/inputs) 函式接受輸入。讓輸入與選擇器同名，使單一繫結既能套用指令，又能把值傳給它：

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="input"/>

透過把它當作訊號來叫用，讀取輸入值；當沒有設定顏色時，退回使用預設值：

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"/>

在範本中，把值繫結到選擇器。由於輸入與選擇器同名，`[appHighlight]` 既能套用指令，也能設定它的值。這裡繫結的 `color` 是元件上的一個屬性：

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="color"/>

<docs-code header="app.component.ts" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" region="class"/>

指令可以宣告一個以上的輸入。以下指令新增了一個 `defaultColor` 輸入，接著依序退回使用 `appHighlight`、`defaultColor`，最後是 `red`：

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts"/>

在同一個元素上繫結兩個輸入。由於 `defaultColor` 接受的是靜態字串而非動態運算式，不需要方括號：

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="defaultColor"/>

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

## 後續步驟

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="結構指令"/>
  <docs-pill href="guide/directives/directive-composition-api" title="指令組合 API"/>
</docs-pill-row>
