# 屬性指令

**屬性**指令會改變 DOM 元素的外觀或行為。

試用 <live-example title="Attribute Directive example"></live-example>。

{@a directive-overview}

## 指令總覽

Angular 中有三種指令：

1. 元件&mdash;帶有範本的指令。
1. 結構指令&mdash;透過新增與移除 DOM 元素來改變 DOM 版面配置。
1. 屬性指令&mdash;改變元素、元件或另一個指令的外觀或行為。

*元件*是三種指令中最常見的。
你在 [QuickStart](guide/quickstart) 指南中第一次見到元件。

*結構指令*會改變檢視的結構。
兩個例子是 [NgFor](guide/template-syntax#ngFor) 與 [NgIf](guide/template-syntax#ngIf)。
在[結構指令](guide/structural-directives)指南中了解它們。

*屬性指令*被用作元素的 attribute。
例如，[範本語法](guide/template-syntax)指南中的內建 [NgStyle](guide/template-syntax#ngStyle) 指令，可以同時改變多個元素樣式。

## 建立一個簡單的屬性指令

屬性指令至少需要建立一個以
`@Directive` 註解的控制器類別，該註解指定了用來識別
該 attribute 的選擇器。
控制器類別實作所需的指令行為。

本頁示範建立一個簡單的 _myHighlight_ 屬性
指令，在使用者把滑鼠懸停在該元素上時設定元素的背景顏色。你可以像這樣套用它：

<code-example path="attribute-directives/src/app/app.component.1.html" linenums="false" title="src/app/app.component.html (applied)" region="applied"></code-example>

{@a write-directive}

### 撰寫指令程式碼

依照[設定](guide/setup)說明，建立名為 <code>attribute-directives</code> 的新本機專案。

在指定的資料夾中建立下列原始碼檔案：

<code-example path="attribute-directives/src/app/highlight.directive.1.ts" title="src/app/highlight.directive.ts"></code-example>

`import` 陳述式指定了來自 Angular `core` 的符號：

1. `Directive` 提供 `@Directive` 裝飾器的功能。
1. `ElementRef` [注入](guide/dependency-injection)到指令的建構子中，讓程式碼可以存取 DOM 元素。
1. `Input` 讓資料從繫結運算式流入指令。

接著，`@Directive` 裝飾器函式把指令的詮釋資料放在設定物件中，作為引數傳入。

`@Directive` 需要一個 CSS 選擇器，來識別
範本中與該指令相關聯的 HTML。
[attribute 的 CSS 選擇器](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
是放在中括號內的 attribute 名稱。
這裡，指令的選擇器是 `[myHighlight]`。
Angular 會在範本中找到所有帶有 `myHighlight` 這個 attribute 的元素。

<div class="l-sub-section">

### 為什麼不用 "highlight"？

雖然 *highlight* 是比 *myHighlight* 更簡潔的名稱，而且也能運作，
但最佳實務是為選擇器名稱加上前綴，確保
它們不會與標準 HTML attribute 衝突。
這也降低了與第三方指令名稱碰撞的風險。

請務必**不要**把 `highlight` 指令名稱以 **`ng`** 為前綴，因為
該前綴保留給 Angular 使用，使用它可能導致難以診斷的錯誤。
對於簡單的示範，簡短的前綴 `my` 有助於區分你的自訂指令。

</div>


在 `@Directive` 詮釋資料之後是指令的控制器類別，
名為 `HighlightDirective`，它包含該指令的邏輯。
匯出 `HighlightDirective` 讓其他元件可以存取它。

Angular 會為每個符合的元素建立指令控制器類別的新執行個體，
並把 Angular 的 `ElementRef` 注入建構子。
`ElementRef` 是一項服務，透過其 `nativeElement` 屬性，讓你能直接存取 DOM 元素。

{@a apply-directive}

## 套用屬性指令

若要使用新的 `HighlightDirective`，請建立一個範本，
把指令作為 attribute 套用到段落（`<p>`）元素。
在 Angular 的用語中，帶有該 attribute 的**宿主**是 `<p>` 元素。

把範本放在它自己的 <code>app.component.html</code>
檔案中，內容如下：

<code-example path="attribute-directives/src/app/app.component.1.html" title="src/app/app.component.html"></code-example>

現在在 `AppComponent` 中參照這個範本：

<code-example path="attribute-directives/src/app/app.component.ts" title="src/app/app.component.ts"></code-example>

接著，加入 `import` 陳述式來取得 `Highlight` 指令，
並把該類別加入 `declarations` 的 NgModule 詮釋資料。這樣 Angular
在範本中遇到 `myHighlight` 時就能辨識該指令。

<code-example path="attribute-directives/src/app/app.module.ts" title="src/app/app.module.ts"></code-example>

現在當應用程式執行時，`myHighlight` 指令會醒目顯示段落文字。

<figure>
  <img src="generated/images/guide/attribute-directives/first-highlight.png" alt="第一個醒目提示">
</figure>

<div class="l-sub-section">

<h3 class="no-toc">你的指令沒有作用？</h3>

你有記得把指令加入 `@NgModule` 的 `declarations` attribute 嗎？
這很容易忘記！
開啟瀏覽器工具中的主控台，尋找像這樣的錯誤：

<code-example format="nocode">
  EXCEPTION: Template parse errors:
    Can't bind to 'myHighlight' since it isn't a known property of 'p'.
</code-example>

Angular 偵測到你正試圖繫結到*某個東西*，但它在模組的 `declarations` 陣列中找不到這個指令。
在 `declarations` 陣列中指定 `HighlightDirective` 之後，
Angular 就知道它可以把該指令套用到在此模組中宣告的元件。

</div>

總結來說，Angular 在 `<p>` 元素上找到了 `myHighlight` attribute。
它建立了 `HighlightDirective` 類別的執行個體，
並把 `<p>` 元素的參照注入指令的建構子，
進而把 `<p>` 元素的背景樣式設為黃色。

{@a respond-to-user}

## 回應使用者引發的事件

目前，`myHighlight` 只是設定元素顏色。
這個指令可以更有動態性。
它可以偵測使用者何時把滑鼠移入或移出元素，
並以設定或清除醒目顯示顏色來回應。

先把 `HostListener` 加入匯入的符號清單；
也加入 `Input` 符號，因為你很快就會需要它。

<code-example path="attribute-directives/src/app/highlight.directive.ts" linenums="false" title="src/app/highlight.directive.ts (imports)" region="imports"></code-example>

接著加入兩個事件處理器，在滑鼠移入或移出時回應，
每個都加上 `HostListener` 裝飾器。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" linenums="false" title="src/app/highlight.directive.ts (mouse-methods)" region="mouse-methods"></code-example>

`@HostListener` 裝飾器讓你可以訂閱承載屬性指令的 DOM 元素（本例中是 `<p>`）的事件。

<div class="l-sub-section">

當然，你也可以用標準 JavaScript 伸入 DOM 並手動附加事件監聽器。
但*該*做法至少有三個問題：

1. 你必須正確地撰寫監聽器。
1. 程式碼必須在指令被棄置時*分離*監聽器，以避免記憶體洩漏。
1. 直接與 DOM API 對話不是最佳實務。

</div>

這些處理器委派給一個輔助方法，由它在 DOM 元素 `el` 上設定顏色，
而 `el` 是你在建構子中宣告並初始化的。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" linenums="false" title="src/app/highlight.directive.ts (constructor)" region="ctor"></code-example>

完整的指令如下：

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" title="src/app/highlight.directive.ts"></code-example>

執行應用程式，確認當滑鼠懸停在 `p` 上時背景顏色會出現，滑鼠移出時則消失。

<figure>
  <img src="generated/images/guide/attribute-directives/highlight-directive-anim.gif" alt="第二個醒目提示">
</figure>

{@a bindings}

## 以 _@Input_ 資料繫結把值傳入指令

目前醒目顯示顏色是在指令*內部*硬式編碼的。這缺乏彈性。
在本節中，你讓開發者能在套用指令時設定醒目顯示顏色。

先像這樣為指令類別加入 `highlightColor` 屬性：

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" linenums="false" title="src/app/highlight.directive.ts (highlightColor)" region="color"></code-example>

{@a input}

### 繫結到 _@Input_ 屬性

請注意 `@Input` 裝飾器。它為類別加入詮釋資料，讓指令的 `highlightColor` 屬性可供繫結。

它被稱為*輸入*屬性，因為資料從繫結運算式流入指令*之中*。
如果沒有該輸入詮釋資料，Angular 會拒絕該繫結；如需更多資訊，請參閱[下方](guide/attribute-directives#why-input "Why add @Input?")。

試著把下列指令繫結變化加入 `AppComponent` 範本：

<code-example path="attribute-directives/src/app/app.component.1.html" linenums="false" title="src/app/app.component.html (excerpt)" region="color-1"></code-example>

為 `AppComponent` 加入 `color` 屬性。

<code-example path="attribute-directives/src/app/app.component.1.ts" linenums="false" title="src/app/app.component.ts (class)" region="class"></code-example>

讓它以屬性繫結控制醒目顯示顏色。

<code-example path="attribute-directives/src/app/app.component.1.html" linenums="false" title="src/app/app.component.html (excerpt)" region="color-2"></code-example>

這樣很好，但如果能像這樣在*同一個 attribute 中*同時套用指令並設定顏色，就更好了。

<code-example path="attribute-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (color)" region="color"></code-example>

`[myHighlight]` attribute 繫結既會把醒目顯示指令套用到 `<p>` 元素，
也會以屬性繫結設定指令的醒目顯示顏色。
你重用了指令的屬性選擇器（`[myHighlight]`）來做這兩件事。
這是簡潔、緊湊的語法。

你必須把指令的 `highlightColor` 屬性更名為 `myHighlight`，因為那現在是顏色屬性繫結的名稱。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" linenums="false" title="src/app/highlight.directive.ts (renamed to match directive selector)" region="color-2"></code-example>

這令人不悅。`myHighlight` 這個詞是糟糕的屬性名稱，也無法表達該屬性的意圖。

{@a input-alias}

### 繫結到 _@Input_ 別名

幸好，你可以把指令屬性命名為你想要的任何名稱，並且為了繫結目的**_為它取別名_**。

還原原始屬性名稱，並在 `@Input` 的引數中指定選擇器作為別名。

<code-example path="attribute-directives/src/app/highlight.directive.ts" linenums="false" title="src/app/highlight.directive.ts (color property with alias)" region="color"></code-example>

在指令*內部*，該屬性名為 `highlightColor`。
在指令*外部*，也就是你繫結到它的地方，它名為 `myHighlight`。

你得到了兩全其美：你想要的屬性名稱與你想要的繫結語法：

<code-example path="attribute-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (color)" region="color"></code-example>

現在你繫結到 `highlightColor`，請修改 `onMouseEnter()` 方法以使用它。
如果有人疏忽沒有繫結到 `highlightColor`，就以紅色醒目顯示：

<code-example path="attribute-directives/src/app/highlight.directive.3.ts" linenums="false" title="src/app/highlight.directive.ts (mouse enter)" region="mouse-enter"></code-example>

以下是最新版本的指令類別。

<code-example path="attribute-directives/src/app/highlight.directive.3.ts" linenums="false" title="src/app/highlight.directive.ts (excerpt)"></code-example>

## 撰寫測試工具來試用

可能很難想像這個指令實際上如何運作。
在本節中，你將把 `AppComponent` 變成一個測試工具，
讓你用單選按鈕挑選醒目顯示顏色，並把你的顏色選擇繫結到指令。

如下更新 <code>app.component.html</code>：

<code-example path="attribute-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (v2)" region="v2"></code-example>

修改 `AppComponent.color`，讓它沒有初始值。

<code-example path="attribute-directives/src/app/app.component.ts" linenums="false" title="src/app/app.component.ts (class)" region="class"></code-example>

以下是測試工具與指令的實際運作。

<figure>
  <img src="generated/images/guide/attribute-directives/highlight-directive-v2-anim.gif" alt="醒目顯示 v.2">
</figure>

{@a second-property}

## 繫結到第二個屬性

這個醒目顯示指令只有一個可自訂的屬性。在真實應用程式中，它可能需要更多。

目前，預設顏色&mdash;在使用者挑選醒目顯示顏色之前占主導的顏色&mdash;被硬式編碼為 "red"。
讓範本開發者設定預設顏色。

為 `HighlightDirective` 加入第二個 **input** 屬性，名為 `defaultColor`：

<code-example path="attribute-directives/src/app/highlight.directive.ts" linenums="false" title="src/app/highlight.directive.ts (defaultColor)" region="defaultColor"></code-example>

修改指令的 `onMouseEnter`，讓它先嘗試用 `highlightColor` 進行醒目提示，再用 `defaultColor`，若兩個屬性都是 `undefined`，則改用 `red`。

<code-example path="attribute-directives/src/app/highlight.directive.ts" linenums="false" title="src/app/highlight.directive.ts (mouse-enter)" region="mouse-enter"></code-example>

當你已經在繫結 `myHighlight` attribute 名稱時，要如何繫結到第二個屬性？

與元件一樣，你可以在範本中串連任意多個指令屬性繫結。
開發者應該能撰寫下列範本 HTML，既繫結到 `AppComponent.color`，
又以 "violet" 作為預設顏色備援。

<code-example path="attribute-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (defaultColor)" region="defaultColor"></code-example>

Angular 知道 `defaultColor` 繫結屬於 `HighlightDirective`，
因為你用 `@Input` 裝飾器把它做成*公開*的。

以下是完成編碼後，測試工具應有的運作方式。

<figure>
  <img src="generated/images/guide/attribute-directives/highlight-directive-final-anim.gif" alt="最終醒目顯示">
</figure>

## 總結

本頁涵蓋如何：

* [建立一個**屬性指令**](guide/attribute-directives#write-directive)，用來修改元素的行為。
* [把指令套用到](guide/attribute-directives#apply-directive)範本中的元素。
* [回應**事件**](guide/attribute-directives#respond-to-user)，這些事件會改變指令的行為。
* [**把值繫結到指令**](guide/attribute-directives#bindings)。

最終原始碼如下：

<code-tabs>
  <code-pane title="app/app.component.ts" path="attribute-directives/src/app/app.component.ts"></code-pane>
  <code-pane title="app/app.component.html" path="attribute-directives/src/app/app.component.html"></code-pane>
  <code-pane title="app/highlight.directive.ts" path="attribute-directives/src/app/highlight.directive.ts"></code-pane>
  <code-pane title="app/app.module.ts" path="attribute-directives/src/app/app.module.ts"></code-pane>
  <code-pane title="main.ts" path="attribute-directives/src/main.ts"></code-pane>
  <code-pane title="index.html" path="attribute-directives/src/index.html"></code-pane>
</code-tabs>



你也可以體驗與下載 <live-example title="Attribute Directive example"></live-example>。

{@a why-input}

### 附錄：為什麼要加入 _@Input_？

在本示範中，`hightlightColor` 屬性是
`HighlightDirective` 的 ***input*** 屬性。你已經看過它在沒有別名的情況下被套用：

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" linenums="false" title="src/app/highlight.directive.ts (color)" region="color"></code-example>

你也看過它帶有別名的情況：

<code-example path="attribute-directives/src/app/highlight.directive.ts" linenums="false" title="src/app/highlight.directive.ts (color)" region="color"></code-example>

無論哪種方式，`@Input` 裝飾器都告訴 Angular 這個屬性是
_公開_的，可供父元件繫結。
如果沒有 `@Input`，Angular 會拒絕繫結到該屬性。

你以前把範本 HTML 繫結到元件屬性時，從未用過 `@Input`。
有什麼不同？

差異在於信任問題。
Angular 把元件的範本視為*屬於*該元件。
元件與其範本彼此隱含地信任。
因此，元件自己的範本可以繫結到該元件的*任何*屬性，
無論有沒有 `@Input` 裝飾器。

但元件或指令不應盲目信任*其他*元件與指令。
元件或指令的屬性預設對繫結是隱藏的。
從 Angular 繫結的角度來看，它們是*私有的*。
當以 `@Input` 裝飾器裝飾時，該屬性從 Angular 繫結的角度來看變成*公開*的。
只有這樣，它才能被其他元件或指令繫結。

你可以從屬性名稱在繫結中的位置，判斷是否需要 `@Input`。

* 當它出現在範本運算式中、等號（=）的***右側***時，
  它屬於範本的元件，不需要 `@Input` 裝飾器。

* 當它出現在**中括號**（[ ]）中、等號（=）的**左側**時，
  該屬性屬於*其他*元件或指令；
  該屬性必須以 `@Input` 裝飾器裝飾。

現在把這個推理套用到下列範例：

<code-example path="attribute-directives/src/app/app.component.html" linenums="false" title="src/app/app.component.html (color)" region="color"></code-example>

* 運算式右側的 `color` 屬性屬於範本的元件。
  範本與其元件彼此信任。
  `color` 屬性不需要 `@Input` 裝飾器。

* 左側的 `myHighlight` 屬性指的是 `HighlightDirective` 的*別名*屬性，
  而非範本元件的屬性。這裡存在信任問題。
  因此，該指令屬性必須帶有 `@Input` 裝飾器。
