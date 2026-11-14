# 結構指令

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }

</style>

本指南將說明 Angular 如何使用**結構指令**操作 DOM，
以及你如何撰寫自己的結構指令來做同樣的事。

試試 <live-example></live-example>。

{@a definition}

## 什麼是結構指令？

結構指令負責 HTML 版面。
它們塑造或重塑 DOM 的_結構_，通常是透過新增、移除或操作元素來達成。

與其他指令相同，你將結構指令套用到_宿主元素_上。
接著，指令便會對該宿主元素及其後代元素執行它應該做的事。

結構指令很容易辨認。
如本範例所示，指令屬性名稱前面有一個星號（*）。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngif)" region="ngif">

</code-example>

沒有方括號。沒有圓括號。只有設定為字串的 `*ngIf`。

在本指南中你將了解到，[星號（*）是一種便利的表示法](guide/structural-directives#asterisk)，
而該字串是[_微語法_](guide/structural-directives#microsyntax)，並非一般的
[範本運算式](guide/template-syntax#範本運算式)。
Angular 會將這種表示法去糖化（desugar）為加上標記的 `<ng-template>`，包圍
宿主元素及其後代元素。
每個結構指令對該範本所做的事各不相同。

三個常見的內建結構指令&mdash;[NgIf](guide/template-syntax#ngIf)、
[NgFor](guide/template-syntax#ngFor) 與 [NgSwitch...](guide/template-syntax#ngSwitch)&mdash;在
[_範本語法_](guide/template-syntax)指南中有說明，並且在 Angular 文件各處的範例中都可以看到。
以下是一個在範本中使用它們的範例：

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (built-in)" region="built-in">

</code-example>

本指南不會重複說明如何_使用_它們，但會解釋它們_如何運作_，
以及如何[撰寫你自己的](guide/structural-directives#unless)結構指令。

<div class="callout is-helpful">

<header>
  指令拼法
</header>

在本指南各處，你會看到同一個指令以_大駝峰式（UpperCamelCase）_與_小駝峰式（lowerCamelCase）_兩種方式拼寫。
你已經看過 `NgIf` 與 `ngIf`。
這是有原因的。`NgIf` 指的是指令的_類別_；
`ngIf` 指的是指令的_屬性名稱_。

指令的_類別_以_大駝峰式_拼寫（`NgIf`）。
指令的_屬性名稱_以_小駝峰式_拼寫（`ngIf`）。
本指南在談論指令的屬性與其功能時，指的是指令的_類別_。
本指南在描述如何將指令套用到 HTML 範本中的元素時，指的則是_屬性名稱_。

</div>

<div class="alert is-helpful">

另外還有兩種 Angular 指令，在其他地方有廣泛的說明：
(1)&nbsp;元件，以及 (2)&nbsp;屬性指令。

*元件*以原生 HTML 元素的方式管理一塊 HTML 區域。
技術上來說，它是帶有範本的指令。

[*屬性*指令](guide/attribute-directives)會改變元素、元件或另一個指令的外觀或行為。
例如，內建的 [`NgStyle`](guide/template-syntax#ngStyle) 指令
會同時改變多個元素樣式。

你可以將許多_屬性_指令套用到一個宿主元素上。
你[只能套用一個](guide/structural-directives#one-per-element)_結構_指令到宿主元素上。

</div>

{@a ngIf}

## NgIf 案例研究

`NgIf` 是最簡單、也最容易理解的結構指令。
它接受一個布林運算式，讓一整塊 DOM 出現或消失。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngif-true)" region="ngif-true">

</code-example>

`ngIf` 指令不會用 CSS 隱藏元素。它會實際地從 DOM 中新增與移除它們。
你可以用瀏覽器開發者工具檢查 DOM，來確認這一點。

<figure>
  <img src='generated/images/guide/structural-directives/element-not-in-dom.png' alt="ngIf=false 時元素不在 DOM 中">
</figure>

上方的段落在 DOM 中。下方未被使用的段落則不在；
取而代之的是一個關於「bindings」的註解（稍後會在[後文](guide/structural-directives#asterisk)說明）。

當條件為 false 時，`NgIf` 會將其宿主元素從 DOM 中移除，
將它與 DOM 事件分離（即它所建立的連結），
將元件與 Angular 變更偵測分離，並將其銷毀。
元件與 DOM 節點接著可以被垃圾回收，釋放記憶體。

### 為何要*移除*而非*隱藏*？

指令也可以改為將不需要的段落的 `display` 樣式設定為 `none`，來隱藏它。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (display-none)" region="display-none">

</code-example>

雖然看不見，該元素仍然留在 DOM 中。

<figure>
  <img src='generated/images/guide/structural-directives/element-display-in-dom.png' alt="隱藏的元素仍在 DOM 中">
</figure>

對於一個簡單的段落，隱藏與移除的差別並不重要。
但當宿主元素附著在一個耗費資源的元件上時，差別就很重要了。
這類元件的行為即使在隱藏時仍會繼續。
元件依然附著在它的 DOM 元素上。它持續監聽事件。
Angular 持續檢查可能影響資料繫結的變更。
元件原本在做的事，它會繼續做。

雖然看不見，該元件&mdash;以及它的所有後代元件&mdash;仍占用資源。
效能與記憶體的負擔可能相當可觀，回應速度可能下降，而使用者什麼也看不到。

從正面來看，再次顯示元素很快。
元件先前的狀態被保留下來，隨時可以顯示。
元件不需要重新初始化&mdash;那可能是一個昂貴的操作。
因此，隱藏與顯示有時是正確的做法。

但在沒有充分理由將它們留下來的情況下，
你應該偏好使用像 `NgIf` 這樣的結構指令，移除使用者看不到的 DOM 元素，
並回收未使用的資源。

**這些考量同樣適用於每一個結構指令，無論是內建還是自訂的。**
在套用結構指令之前，你或許應該先停下來想一想
新增與移除元素、建立與銷毀元件所帶來的後果。

{@a asterisk}

<a id="the-asterisk--prefix"></a>
## 星號（*）前綴

你一定注意到指令名稱前的星號（*）前綴，
並好奇它為何必要、作用是什麼。

以下是 `*ngIf` 在 `hero` 存在時顯示英雄名稱的寫法。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (asterisk)" region="asterisk">

</code-example>

星號是某個稍嫌複雜之物的「語法糖」。
在內部，Angular 會將 `*ngIf` _屬性_轉換為 `<ng-template>` _元素_，包圍宿主元素，如下所示。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngif-template)" region="ngif-template">

</code-example>

* `*ngIf` 指令移到 `<ng-template>` 元素上，在那裡成為屬性繫結 `[ngIf]`。
* `<div>` 的其餘部分，包括它的 class 屬性，移到了 `<ng-template>` 元素內部。

第一種形式實際上不會被渲染，最終進入 DOM 的只有完成品。

<figure>
  <img src='generated/images/guide/structural-directives/hero-div-in-dom.png' alt="DOM 中的 hero div">
</figure>

Angular 在實際渲染時用掉了 `<ng-template>` 的內容，
並以一個診斷註解取代 `<ng-template>`。

[`NgFor`](guide/structural-directives#ngFor) 與 [`NgSwitch...`](guide/structural-directives#ngSwitch) 指令也遵循相同的模式。

{@a ngFor}

## _*ngFor_ 內部

Angular 以類似的方式，將 `*ngFor` 從星號（*）語法轉換為 `<ng-template>` _元素_。

以下是一個功能完整的 `NgFor` 應用，兩種寫法都列出來：

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (inside-ngfor)" region="inside-ngfor">

</code-example>

這顯然比 `ngIf` 複雜得多，而且理所當然。
`NgFor` 指令具備比本指南所展示的 `NgIf` 更多的功能，包括必填與選用的。
`NgFor` 至少需要一個迴圈變數（`let hero`）和一個清單（`heroes`）。

你在指派給 `ngFor` 的字串中啟用這些功能，該字串以 Angular 的[微語法](guide/structural-directives#microsyntax)撰寫。

<div class="alert is-helpful">

`ngFor` 字串_之外_的一切都會留在宿主元素
（`<div>`）上，隨著它一起移入 `<ng-template>` 內部。
在本範例中，`[ngClass]="odd"` 仍然留在 `<div>` 上。

</div>

{@a microsyntax}

### 微語法

Angular 微語法讓你用一個簡潔、好用的字串來設定指令。
微語法剖析器會將該字串轉換為 `<ng-template>` 上的屬性：

* `let` 關鍵字宣告一個[_範本輸入變數_](guide/structural-directives#template-input-variable)，
供你在範本內參照。本範例中的輸入變數是 `hero`、`i` 與 `odd`。
剖析器會將 `let hero`、`let i` 與 `let odd` 轉換為名為
`let-hero`、`let-i` 與 `let-odd` 的變數。

* 微語法剖析器會取 `of` 與 `trackBy`，將兩者轉為首字大寫（`of` -> `Of`、`trackBy` -> `TrackBy`），
並以指令的屬性名稱（`ngFor`）作為前綴，得到 `ngForOf` 與 `ngForTrackBy` 這兩個名稱。
它們是 `NgFor` 的兩個_輸入屬性_的名稱。
指令就是這樣知道清單是 `heroes`，而 track-by 函式是 `trackById` 的。

* 當 `NgFor` 指令迭代清單時，它會設定與重設其自身_脈絡_物件的屬性。
這些屬性包括 `index` 與 `odd`，以及一個名為 `$implicit` 的特殊屬性。

* `let-i` 與 `let-odd` 變數分別被定義為 `let i=index` 與 `let odd=odd`。
Angular 會將它們設定為脈絡的 `index` 與 `odd` 屬性目前的值。

* `let-hero` 的脈絡屬性沒有被指定。
它的預期來源是隱含的。
Angular 會將 `let-hero` 設定為脈絡的 `$implicit` 屬性的值，
而 `NgFor` 已用目前迭代的英雄初始化該屬性。

* [API 指南](api/common/NgForOf "API: NgFor")
說明了其他 `NgFor` 指令屬性與脈絡屬性。

* `NgFor` 由 `NgForOf` 指令實作。更多關於其他 `NgForOf` 指令屬性與脈絡屬性的資訊，請參閱 [NgForOf API 參考](api/common/NgForOf)。

當你撰寫自己的結構指令時，也可以使用這些微語法機制。
研讀
[`NgIf` 的原始碼](https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_if.ts "Source: NgIf")
與 [`NgForOf`](https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts "Source: NgForOf")
是深入了解的好方法。

{@a template-input-variable}

{@a template-input-variables}

### 範本輸入變數

_範本輸入變數_是一個變數，你可以在範本的單一實例_內_參照它的值。
本範例中有幾個這樣的變數：`hero`、`i` 與 `odd`。
它們前面都加上了關鍵字 `let`。

_範本輸入變數_**_並非_**與
[範本_參照_變數](guide/template-syntax#ref-vars)相同，
無論是在_語意_上還是在_語法_上。

你使用 `let` 關鍵字（`let hero`）宣告範本_輸入_變數。
該變數的作用範圍限於重複範本的_單一實例_。
你可以在其他結構指令的定義中，再次使用相同的變數名稱。

你透過在變數名稱前加上 `#` 前綴（`#var`）來宣告範本_參照_變數。
_參照_變數指向它所附著的元素、元件或指令。
它可以在_整個範本_的_任何位置_被存取。

範本_輸入_變數與_參照_變數的名稱各自擁有自己的命名空間。`let hero` 中的 `hero` 與
宣告為 `#hero` 的 `hero` 永遠不會是同一個變數。

{@a one-per-element}

<a id="one-structural-directive-per-host-element"></a>
### 每個宿主元素只能有一個結構指令

總有一天，你會想重複一塊 HTML，但只在特定條件為 true 時才執行。
你會_嘗試_將 `*ngFor` 與 `*ngIf` 同時放在同一個宿主元素上。
Angular 不會允許你這樣做。你只能將一個_結構_指令套用到一個元素上。

原因是為了簡單。結構指令可以對宿主元素及其後代做複雜的事情。
當兩個指令同時主張同一個宿主元素時，哪一個優先？
應該先執行 `NgIf` 還是 `NgFor`？`NgIf` 可以取消 `NgFor` 的效果嗎？
如果可以（而且看起來應該可以），Angular 又該如何將這種取消能力推廣到其他結構指令？

這些問題都沒有簡單的答案。禁止使用多個結構指令，可以讓這些問題變得沒有意義。
對於這個使用情境，有一個簡單的解法：將 `*ngIf` 放在包圍 `*ngFor` 元素的容器元素上。
其中一個或兩個元素都可以是 [`ng-container`](guide/structural-directives#ngcontainer)，這樣你就不必引入額外的 HTML 層級。

{@a ngSwitch}

## _NgSwitch_ 指令內部

Angular 的 _NgSwitch_ 實際上是一組協同運作的指令：`NgSwitch`、`NgSwitchCase` 與 `NgSwitchDefault`。

以下是一個範例。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngswitch)" region="ngswitch">

</code-example>

指派給 `NgSwitch` 的 switch 值（`hero.emotion`）決定了
要顯示哪一個 switch 案例（如果有的話）。

`NgSwitch` 本身不是結構指令。
它是一個_屬性_指令，控制其他兩個 switch 指令的行為。
這就是為什麼你寫 `[ngSwitch]`，而永遠不寫 `*ngSwitch`。

`NgSwitchCase` 與 `NgSwitchDefault` _是_結構指令。
你使用星號（*）前綴表示法將它們附加到元素上。
當 `NgSwitchCase` 的值與 switch 值相符時，它會顯示其宿主元素。
當沒有同層的 `NgSwitchCase` 與 switch 值相符時，`NgSwitchDefault` 會顯示其宿主元素。

<div class="alert is-helpful">

你套用指令的元素就是它的_宿主_元素。
`<happy-hero>` 是 happy `*ngSwitchCase` 的宿主元素。
`<unknown-hero>` 是 `*ngSwitchDefault` 的宿主元素。

</div>

與其他結構指令相同，`NgSwitchCase` 與 `NgSwitchDefault`
也可以被去糖化為 `<ng-template>` 元素形式。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngswitch-template)" region="ngswitch-template">

</code-example>

{@a prefer-asterisk}

## 偏好使用星號（*）語法

星號（*）語法比去糖化後的形式更清楚。
當沒有單一元素可以承載指令時，使用 [&lt;ng-container&gt;](guide/structural-directives#ng-container)。

雖然很少有充分的理由以範本_屬性_或_元素_形式套用結構指令，
但了解 Angular 會建立 `<ng-template>` 並理解它如何運作，仍然很重要。
當你[撰寫自己的結構指令](guide/structural-directives#unless)時，會參照 `<ng-template>`。

{@a template}

## *&lt;ng-template&gt;*

&lt;ng-template&gt; 是一個用於渲染 HTML 的 Angular 元素。
它永遠不會被直接顯示。
事實上，在渲染檢視之前，Angular 會將 `<ng-template>` 及其內容_取代_為一個註解。

如果沒有結構指令，你只是將一些元素包在 `<ng-template>` 中，
那些元素就會消失。
這就是「Hip! Hip! Hooray!」一語中，中間那個「Hip!」的命運。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (template-tag)" region="template-tag">

</code-example>

Angular 會抹去中間的「Hip!」，讓歡呼聲少了那麼一點熱情。

<figure>
  <img src='generated/images/guide/structural-directives/template-rendering.png' alt="範本標籤渲染">
</figure>

結構指令會讓 `<ng-template>` 發揮作用，
當你[撰寫自己的結構指令](guide/structural-directives#unless)時就會看到。

{@a ngcontainer}

{@a ng-container}

## 使用 &lt;ng-container&gt; 將同層元素分組

通常會有一個_根_元素，可以而且應該用來承載結構指令。
清單元素（`<li>`）是 `NgFor` 重複器的典型宿主元素。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngfor-li)" region="ngfor-li">

</code-example>

當沒有宿主元素時，你通常可以將內容包在原生 HTML 容器元素中，
例如 `<div>`，並將指令附加到該包裝元素上。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngif)" region="ngif">

</code-example>

引入另一個容器元素&mdash;通常是 `<span>` 或 `<div>`&mdash;來
將元素分組到單一_根_之下，通常是無害的。
_通常_……但並非_永遠_。

分組元素可能會破壞範本的外觀，因為 CSS 樣式
既未預期也不適應新的版面。
例如，假設你有下列段落版面。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngif-span)" region="ngif-span">

</code-example>

你還有一個 CSS 樣式規則，恰好會套用到 `<p>` 段落內的 `<span>`。

<code-example path="structural-directives/src/app/app.component.css" linenums="false" title="src/app/app.component.css (p-span)" region="p-span">

</code-example>

建構出來的段落渲染得很奇怪。

<figure>
  <img src='generated/images/guide/structural-directives/bad-paragraph.png' alt="樣式出錯的被 span 包圍的段落">
</figure>

原本要用在其他地方的 `p span` 樣式，被不小心套用到了這裡。

另一個問題：某些 HTML 元素要求所有直接子元素都是特定型別。
例如，`<select>` 元素要求 `<option>` 子元素。
你不能將 _options_ 包在條件式 `<div>` 或 `<span>` 中。

當你這樣嘗試時，

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (select-span)" region="select-span">

</code-example>

下拉選單是空的。

<figure>
  <img src='generated/images/guide/structural-directives/bad-select.png' alt="被 span 包圍的 options 無法運作">
</figure>

瀏覽器不會顯示 `<span>` 內的 `<option>`。

### &lt;ng-container&gt; 來救援

Angular 的 `<ng-container>` 是一個分組元素，不會干擾樣式或版面，
因為 Angular _不會把它放進 DOM_。

以下再次列出條件式段落，這次使用 `<ng-container>`。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (ngif-ngcontainer)" region="ngif-ngcontainer">

</code-example>

它的渲染正常。

<figure>
  <img src='generated/images/guide/structural-directives/good-paragraph.png' alt="使用 ngcontainer 且樣式正確的段落">
</figure>

現在使用 `<ng-container>` 來有條件地排除一個 _select_ 的 `<option>`。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (select-ngcontainer)" region="select-ngcontainer">

</code-example>

下拉選單運作正常。

<figure>
  <img src='generated/images/guide/structural-directives/select-ngcontainer-anim.gif' alt="ngcontainer 的 options 運作正常">
</figure>

`<ng-container>` 是 Angular 剖析器能辨識的語法元素。
它不是指令、元件、類別或介面。
它更像是 JavaScript `if` 區塊中的大括號：

<code-example language="javascript">
  if (someCondition) {
    statement1;
    statement2;
    statement3;
  }

</code-example>

如果沒有那些大括號，JavaScript 只會執行第一個陳述式，
而你的本意是要有條件地將它們全部作為單一區塊執行。
`<ng-container>` 在 Angular 範本中滿足了類似的需求。

{@a unless}

## 撰寫結構指令

在本節中，你將撰寫一個 `UnlessDirective` 結構指令，
它做的事與 `NgIf` 恰好相反。
`NgIf` 在條件為 `true` 時顯示範本內容。
`UnlessDirective` 則在條件為 ***false*** 時顯示內容。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (appUnless-1)" region="appUnless-1">

</code-example>

建立指令與建立元件相似。

* 匯入 `Directive` 裝飾器（而非 `Component` 裝飾器）。

* 匯入 `Input`、`TemplateRef` 與 `ViewContainerRef` 符號；_任何_結構指令都會需要它們。

* 將裝飾器套用到指令類別上。

* 設定 CSS *屬性選擇器*，用來在指令被套用到範本中的元素時識別該指令。

以下示範如何起步：

<code-example path="structural-directives/src/app/unless.directive.ts" linenums="false" title="src/app/unless.directive.ts (skeleton)" region="skeleton">

</code-example>

指令的 _selector_（選擇器）通常是加上方括號的指令**屬性名稱**，即 `[appUnless]`。
方括號定義了一個 CSS
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors" title="MDN: Attribute selectors">屬性選擇器</a>。

指令的_屬性名稱_應該以_小駝峰式_拼寫，並以一個前綴開頭。
不要使用 `ng`，該前綴屬於 Angular。
挑一個簡短、適合你或你公司的前綴。
在本範例中，前綴是 `app`。

依[樣式指南](guide/styleguide#02-03 "Angular Style Guide")，指令的_類別_名稱以 `Directive` 結尾。
Angular 自己的指令則不然。

### _TemplateRef_ 與 _ViewContainerRef_

像這樣簡單的結構指令，會從 Angular 產生的 `<ng-template>` 建立一個
[_embedded view_（嵌入檢視）](api/core/EmbeddedViewRef "API: EmbeddedViewRef")，
並將該檢視插入與指令原始 `<p>` 宿主元素相鄰的
[_view container_（檢視容器）](api/core/ViewContainerRef "API: ViewContainerRef")中。

你將使用
[`TemplateRef`](api/core/TemplateRef "API: TemplateRef")
取得 `<ng-template>` 的內容，並透過
[`ViewContainerRef`](api/core/ViewContainerRef "API: ViewContainerRef")
存取_檢視容器_。

你會在指令的建構函式中，將兩者注入為類別的私有變數。

<code-example path="structural-directives/src/app/unless.directive.ts" linenums="false" title="src/app/unless.directive.ts (ctor)" region="ctor">

</code-example>

### _appUnless_ 屬性

指令的使用者預期將一個 true/false 條件繫結到 `[appUnless]`。
這表示指令需要一個以 `@Input` 裝飾的 `appUnless` 屬性

<div class="alert is-helpful">

關於 `@Input` 的說明，請參閱[_範本語法_](guide/template-syntax#inputs-outputs)指南。

</div>

<code-example path="structural-directives/src/app/unless.directive.ts" linenums="false" title="src/app/unless.directive.ts (set)" region="set">

</code-example>

每當條件的值改變時，Angular 就會設定 `appUnless` 屬性。
由於 `appUnless` 屬性會執行工作，它需要一個 setter。

* 如果條件為 falsy，且檢視先前尚未建立，
就告訴_檢視容器_從範本建立_嵌入檢視_。

* 如果條件為 truthy，且檢視目前正在顯示，
就清除容器，這同時也會銷毀該檢視。

沒有人會讀取 `appUnless` 屬性，所以它不需要 getter。

完成的指令程式碼如下：

<code-example path="structural-directives/src/app/unless.directive.ts" linenums="false" title="src/app/unless.directive.ts (excerpt)" region="no-docs">

</code-example>

將此指令加入 AppModule 的 `declarations` 陣列。

接著建立一些 HTML 來試用它。

<code-example path="structural-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (appUnless)" region="appUnless">

</code-example>

當 `condition` 為 falsy 時，上方（A）段落出現，下方（B）段落消失。
當 `condition` 為 truthy 時，上方（A）段落被移除，下方（B）段落出現。

<figure>
  <img src='generated/images/guide/structural-directives/unless-anim.gif' alt="UnlessDirective 實際運作">
</figure>

{@a summary}

## 總結

你可以在 <live-example></live-example> 中試用並下載本指南的原始碼。

以下是 `src/app/` 資料夾中的原始碼。

<code-tabs>

  <code-pane title="app.component.ts" path="structural-directives/src/app/app.component.ts">

  </code-pane>

  <code-pane title="app.component.html" path="structural-directives/src/app/app.component.html">

  </code-pane>

  <code-pane title="app.component.css" path="structural-directives/src/app/app.component.css">

  </code-pane>

  <code-pane title="app.module.ts" path="structural-directives/src/app/app.module.ts">

  </code-pane>

  <code-pane title="hero.ts" path="structural-directives/src/app/hero.ts">

  </code-pane>

  <code-pane title="hero-switch.components.ts" path="structural-directives/src/app/hero-switch.components.ts">

  </code-pane>

  <code-pane title="unless.directive.ts" path="structural-directives/src/app/unless.directive.ts">

  </code-pane>

</code-tabs>

你學到了：

* 結構指令會操作 HTML 版面。
* 當沒有合適的宿主元素時，使用 [`<ng-container>`](guide/structural-directives#ngcontainer) 作為分組元素。
* Angular 會將 [星號（*）語法](guide/structural-directives#asterisk) 去糖化為 `<ng-template>`。
* 這對 `NgIf`、`NgFor` 與 `NgSwitch` 內建指令如何運作。
* 關於會展開為 [`<ng-template>`](guide/structural-directives#template) 的 [_微語法_](guide/structural-directives#microsyntax)。
* 如何撰寫 [自訂結構指令](guide/structural-directives#unless) `UnlessDirective`。
