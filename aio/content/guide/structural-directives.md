# 結構指令

本指南介紹結構指令，並提供概念性資訊，說明這類指令的運作方式、Angular 如何解讀其簡寫語法，以及如何加入範本守衛屬性來捕捉範本型別錯誤。

結構指令是指透過新增與移除 DOM 元素來改變 DOM 版面配置的指令。

Angular 提供一組內建結構指令（例如 `NgIf`、`NgForOf`、`NgSwitch` 等），在所有 Angular 專案中都很常用。如需更多資訊，請參閱[內建指令](guide/built-in-directives)。

<div class="alert is-helpful">

關於本頁所述的範例應用程式，請參閱 <live-example name="structural-directives"></live-example>。

</div>

<a id="shorthand"></a>
<a id="asterisk"></a>

## 結構指令簡寫

套用結構指令時，通常會在前面加上星號 `*`，例如 `*ngIf`。這種慣例是一種簡寫，Angular 會加以解讀並轉換成長形式。Angular 會把結構指令前面的星號轉換成一個包住主元素及其子元素的 `<ng-template>`。

舉例來說，以下程式碼使用 `*ngIf`，在 `hero` 存在時顯示英雄的名稱：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (asterisk)" region="asterisk"></code-example>

Angular 會建立一個 `<ng-template>` 元素，並把 `*ngIf` 指令套用到它上面，在那裡它會變成方括號形式的屬性繫結 `[ngIf]`。其餘的 `<div>`，包括它的 class 屬性，接著會被移到 `<ng-template>` 裡面：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-template)" region="ngif-template"></code-example>

請注意，Angular 實際上並不會建立一個真正的 `<ng-template>` 元素，而只會渲染 `<div>` 元素。

```html
<div _ngcontent-c0>Mr. Nice</div>

```

以下範例比較了 `*ngFor` 中星號的簡寫用法與長形式的 `<ng-template>`：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (inside-ngfor)" region="inside-ngfor"></code-example>

在這裡，所有與 `ngFor` 結構指令相關的內容都會移到 `<ng-template>`。元素上的所有其他繫結與屬性則套用到 `<div>` 內的 `<ng-template>` 元素。主元素上的其他修飾詞，除了 `ngFor` 字串之外，在元素移入 `<ng-template>` 時會留在原位。在這個範例中，`[class.odd]="odd"` 會留在 `<div>` 上。

`let` 關鍵字會宣告一個範本輸入變數，你可以在範本內參照它。本範例中的輸入變數是 `hero`、`i` 與 `odd`。解析器會把 `let hero`、`let i` 與 `let odd` 轉譯成名為 `let-hero`、`let-i` 與 `let-odd` 的變數。`let-i` 與 `let-odd` 變數會變成 `let i=index` 與 `let odd=odd`。Angular 會把 `i` 與 `odd` 設定為脈絡中 `index` 與 `odd` 屬性的目前值。

解析器會對所有指令套用 PascalCase，並在前面加上指令的屬性名稱，例如 ngFor。舉例來說，`ngFor` 的輸入屬性 `of` 與 `trackBy` 會對映到 `ngForOf` 與 `ngForTrackBy`。

當 `NgFor` 指令逐一走訪清單時，它會設定並重設自己脈絡物件的屬性。這些屬性可以包括但不限於 `index`、`odd`，以及一個名為 `$implicit` 的特殊屬性。

Angular 會把 `let-hero` 設定為脈絡中 `$implicit` 屬性的值，而 `NgFor` 已經用目前迭代的英雄來初始化該屬性。

如需更多資訊，請參閱 [NgFor API](api/common/NgFor "API: NgFor") 與 [NgForOf API](api/common/NgForOf) 文件。

<div class="alert is-helpful">

  請注意，Angular 的 `<ng-template>` 元素定義了一個預設不會渲染任何內容的範本；如果你只是把元素包在 `<ng-template>` 中，而沒有套用結構指令，這些元素將不會被渲染。

如需更多資訊，請參閱 [ng-template API](api/core/ng-template) 文件。

</div>


<a id="one-per-element"></a>
## 每個元素只能有一個結構指令

重複一段 HTML 區塊、但只在特定條件為真時才重複，是相當常見的使用情境。直覺的做法是在同一個元素上同時放 `*ngFor` 與 `*ngIf`。然而，由於 `*ngFor` 與 `*ngIf` 都是結構指令，編譯器會把這種寫法視為錯誤。一個元素上只能套用一個_結構_指令。

原因在於簡潔。結構指令可以對主元素及其子元素做複雜的操作。

當兩個指令都宣稱擁有同一個主元素時，哪一個應該優先？

哪一個應該先執行，`NgIf` 還是 `NgFor`？`NgIf` 可以取消 `NgFor` 的效果嗎？如果可以（看起來應該可以），Angular 又該如何把取消的能力推廣到其他結構指令？

這些問題沒有簡單的答案。禁止使用多個結構指令可以讓這些問題變得無關緊要。這個使用情境有一個簡單的解法：把 `*ngIf` 放在包住 `*ngFor` 元素的容器元素上。其中一個或兩個元素都可以是 `<ng-container>`，這樣就不會產生額外的 DOM 元素。


<a id="unless"></a>
## 建立結構指令

本節將引導你建立一個 `UnlessDirective`，以及如何設定 `condition` 值。`UnlessDirective` 的作用與 `NgIf` 相反，而 `condition` 值可以設定為 `true` 或 `false`。當條件為 `NgIf` 時，`true` 會顯示範本內容。當條件為 `UnlessDirective` 時，`false` 會顯示內容。

以下是套用到段落元素的 `UnlessDirective` 選擇器 `appUnless`。當 `condition` 為 `false` 時，瀏覽器會顯示該句話。

<code-example header="src/app/app.component.html (appUnless-1)" path="structural-directives/src/app/app.component.html" region="appUnless-1"></code-example>

1.  使用 Angular CLI，執行下列指令，其中 `unless` 是指令的名稱：

    <code-example format="shell" language="shell">

    ng generate directive unless

    </code-example>

Angular 會建立指令類別，並指定 CSS 選擇器 `appUnless`，用來在範本中識別該指令。

1.  匯入 `Input`、`TemplateRef` 與 `ViewContainerRef`。

    <code-example header="src/app/unless.directive.ts (skeleton)" path="structural-directives/src/app/unless.directive.ts" region="skeleton"></code-example>

1.  在指令建構子中注入 `TemplateRef` 與 `ViewContainerRef`，作為私有變數。

    <code-example header="src/app/unless.directive.ts (ctor)" path="structural-directives/src/app/unless.directive.ts" region="ctor"></code-example>

`UnlessDirective` 會從 Angular 產生的 `<ng-template>` 建立一個[內嵌視圖](api/core/EmbeddedViewRef "API: EmbeddedViewRef")，並把該視圖插入到指令原始 `<p>` 主元素旁邊的[視圖容器](api/core/ViewContainerRef "API: ViewContainerRef")中。

[`TemplateRef`](api/core/TemplateRef "API: TemplateRef") 可協助你取得 `<ng-template>` 的內容，而 [`ViewContainerRef`](api/core/ViewContainerRef "API: ViewContainerRef") 則可存取視圖容器。

1.  加入一個帶有 setter 的 `appUnless` `@Input()` 屬性。

    <code-example header="src/app/unless.directive.ts (set)" path="structural-directives/src/app/unless.directive.ts" region="set"></code-example>

每當條件的值變更時，Angular 就會設定 `appUnless` 屬性。

    *   如果條件為 falsy，且 Angular 之前尚未建立視圖，setter 會讓視圖容器從範本建立內嵌視圖
    *   如果條件為 truthy，且視圖目前正在顯示，setter 會清除容器，進而處置該視圖

完整的指令如下：

<code-example header="src/app/unless.directive.ts (excerpt)" path="structural-directives/src/app/unless.directive.ts" region="no-docs"></code-example>

### 測試指令

在本節中，你將更新應用程式以測試 `UnlessDirective`。

1.  在 `condition` 中加入一個設定為 `false` 的 `AppComponent`。

    <code-example header="src/app/app.component.ts (excerpt)" path="structural-directives/src/app/app.component.ts" region="condition"></code-example>

1.  更新範本以使用該指令。在這裡，`*appUnless` 位於兩個 `<p>` 標籤上，帶有相反的 `condition` 值，一個是 `true`，一個是 `false`。

    <code-example header="src/app/app.component.html (appUnless)" path="structural-directives/src/app/app.component.html" region="appUnless"></code-example>

星號是簡寫，用來標示 `appUnless` 為結構指令。當 `condition` 為 falsy 時，上方 \（A\) 段落會出現，下方 \（B\) 段落會消失。當 `condition` 為 truthy 時，上方 \（A\) 段落會消失，下方（B）段落會出現。

1.  若要在瀏覽器中變更並顯示 `condition` 的值，請加入顯示狀態與按鈕的標記。

    <code-example header="src/app/app.component.html" path="structural-directives/src/app/app.component.html" region="toggle-info"></code-example>

若要驗證指令是否正常運作，請點選按鈕來變更 `condition` 的值。

<div class="lightbox">

<img alt="UnlessDirective 實際運作" src="generated/images/guide/structural-directives/unless-anim.gif">

</div>

## 結構指令語法參考

撰寫自己的結構指令時，請使用下列語法：

<code-example format="typescript" hideCopy language="typescript">

&ast;:prefix="( :let &verbar; :expression ) (';' &verbar; ',')? ( :let &verbar; :as &verbar; :keyExp )&ast;"

</code-example>

下列模式描述了結構指令文法的每個部分：

<code-tabs>
    <code-pane format="typescript" header="as" hideCopy language="typescript"> as = :export "as" :local ";"? </code-pane>
    <code-pane format="typescript" header="keyExp" hideCopy language="typescript"> keyExp = :key ":"? :expression ("as" :local)? ";"? </code-pane>
    <code-pane format="typescript" header="let" hideCopy language="typescript"> let = "let" :local "=" :export ";"? </code-pane>
</code-tabs>

| 關鍵字 | 說明 |
|:---          |:---     |
| `prefix` | HTML 屬性鍵 |
| `key` | HTML 屬性鍵 |
| `local` | 在範本中使用的區域變數名稱 |
| `export` | 指令以指定名稱匯出的值 |
| `expression` | 標準 Angular 運算式 |

### Angular 如何轉譯簡寫

Angular 會把結構指令簡寫轉譯為一般的繫結語法，如下所示：

| 簡寫 | 轉譯結果 |
|:---                             |:---         |
| `prefix` 與裸 `expression` | <code-example format="typescript" hideCopy language="typescript"> [prefix]="expression" </code-example> |
| `keyExp` | <code-example format="typescript" hideCopy language="typescript"> [prefixKey] "expression" (let-prefixKey="export") </code-example> <div class="alert is-helpful"> **注意**： <br /> `prefix` 會加到 `key` 上 </div> |
| `let` | <code-example format="typescript" hideCopy language="typescript"> let-local="export" </code-example> |

### 簡寫範例

下表提供簡寫範例：

| 簡寫 | Angular 如何解讀該語法 |
|:---                                                                                                                                                                                                           |:---                               |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngFor="let item of [1,2,3]" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template ngFor &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-item &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ngForOf]="[1,2,3]"&gt; </code-example> |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngFor="let item of [1,2,3] as items; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; trackBy: myTrack; index as i" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template ngFor &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-item &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ngForOf]="[1,2,3]" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-items="ngForOf" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ngForTrackBy]="myTrack" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-i="index"&gt; </code-example> |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngIf="exp" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template [ngIf]="exp"&gt; </code-example> |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngIf="exp as value" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template [ngIf]="exp" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-value="ngIf"&gt; </code-example> |

<a id="directive-type-checks"></a>

<!--todo: To do follow up PR: move this section to a more general location because it also applies to attribute directives. -->

## 改善自訂指令的範本型別檢查

你可以為自訂指令加入範本守衛屬性，來改善範本型別檢查。這些屬性可以協助 Angular 範本型別檢查器在編譯時期找出範本中的錯誤，進而避免執行時期錯誤。這些屬性如下：

*   屬性 `ngTemplateGuard_(someInputProperty)` 可讓你為範本內的輸入運算式指定更精確的型別
*   `ngTemplateContextGuard` 靜態屬性可宣告範本脈絡的型別

本節提供這兩種型別守衛屬性的範例。如需更多資訊，請參閱[範本型別檢查](guide/template-typecheck "Template type-checking guide")。

<a id="narrowing-input-types"></a>

### 使用範本守衛讓範本內的型別需求更具體

範本中的結構指令會根據其輸入運算式，控制該範本是否在執行時期渲染。為了協助編譯器捕捉範本型別錯誤，你應該盡可能精確地指定指令輸入運算式在範本內出現時所需的型別。

型別守衛函式會把輸入運算式的預期型別，縮小為在執行時期可能傳給範本內指令的型別子集。你可以提供這樣的函式，協助型別檢查器在編譯時期推斷該運算式的正確型別。

舉例來說，`NgIf` 的實作使用型別縮小，來確保只有在 `*ngIf` 的輸入運算式為 truthy 時才會具現化範本。若要提供具體的型別需求，`NgIf` 指令定義了一個[靜態屬性 `ngTemplateGuard_ngIf: 'binding'`](api/common/NgIf#static-properties)。`binding` 值是一種常見型別縮小的特殊情形，在這種情形中，輸入運算式會被求值，以滿足型別需求。

若要為範本內指令的輸入運算式提供更具體的型別，請在指令中加入 `ngTemplateGuard_xx` 屬性，其中靜態屬性名稱的後綴 `xx` 是 `@Input()` 欄位名稱。該屬性的值可以是根據其回傳型別而定的一般型別縮小函式，或是像 `"binding"` 情形中的字串 `NgIf`。

舉例來說，請看下列結構指令，它把範本運算式的結果當作輸入：

<code-tabs linenums="true">
  <code-pane
    header="src/app/if-loaded.directive.ts"
    path="structural-directives/src/app/if-loaded.directive.ts">
  </code-pane>
  <code-pane
    header="src/app/loading-state.ts"
    path="structural-directives/src/app/loading-state.ts">
  </code-pane>
  <code-pane
    header="src/app/hero.component.ts"
    path="structural-directives/src/app/hero.component.ts">
  </code-pane>
</code-tabs>

在本範例中，`LoadingState<T>` 型別允許兩種狀態：`Loaded<T>` 或 `Loading`。用作指令 `state` 輸入（別名為 `appIfLoaded`）的運算式屬於概括型別 `LoadingState`，因為在那個時間點還不知道載入狀態為何。

`IfLoadedDirective` 的定義宣告了靜態欄位 `ngTemplateGuard_appIfLoaded`，用來表達縮小行為。在 `AppComponent` 範本中，只有在 `*appIfLoaded` 實際上是 `state` 時，`Loaded<Hero>` 結構指令才應該渲染這個範本。型別守衛可讓型別檢查器推斷範本內 `state` 可接受的型別是 `Loaded<T>`，並進一步推斷 `T` 必須是 `Hero` 的實例。

<a id="narrowing-context-type"></a>

### 為指令的上下文定型別

如果你的結構指令為具現化的範本提供脈絡，你可以提供一個靜態 `ngTemplateContextGuard` 函式，在範本內正確地為其指定型別。以下程式碼片段展示了這類函式的一個範例。

<code-tabs linenums="true">
  <code-pane
    header="src/app/trigonometry.directive.ts"
    path="structural-directives/src/app/trigonometry.directive.ts">
  </code-pane>
  <code-pane
    header="src/app/app.component.html (appTrigonometry)"
    path="structural-directives/src/app/app.component.html"
    region="appTrigonometry">
  </code-pane>
</code-tabs>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
