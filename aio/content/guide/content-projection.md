# 內容投影

本主題說明如何使用內容投影來建立彈性且可重複使用的元件。

<div class="alert is-helpful">

若要檢視或下載本主題使用的範例程式碼，請參閱 <live-example></live-example>。

</div>

內容投影是一種模式：在這個模式中，你把想使用的內容插入（也就是*投影*）到另一個元件裡面。舉例來說，你可以有一個接受其他元件所提供內容的 `Card` 元件。

以下各節說明 Angular 中常見的內容投影實作方式，包括：

| 內容投影 | 詳細說明 |
|:---                                            |:---     |
| [單一插槽內容投影](#single-slot) | 使用這類內容投影時，元件接受來自單一來源的內容。 |
| [多重插槽內容投影](#multi-slot) | 在這種情況下，元件接受來自多個來源的內容。 |
| [條件式內容投影](#conditional) | 使用條件式內容投影的元件，只有在符合特定條件時才會算繪內容。 |

<a id="single-slot"></a>

## 單一插槽內容投影

最基本的內容投影形式是*單一插槽內容投影*。單一插槽內容投影指的是建立一個元件，你可以在其中投影一個元件。

若要建立使用單一插槽內容投影的元件，請依下列步驟操作：

1.  [建立元件](guide/component-overview#建立元件)。
1.  在你的元件範本中，於你希望投影內容出現的位置加入一個 `<ng-content>` 元素。

舉例來說，下列元件使用 `<ng-content>` 元素來顯示訊息。

<code-example header="content-projection/src/app/zippy-basic/zippy-basic.component.ts" path="content-projection/src/app/zippy-basic/zippy-basic.component.ts"></code-example>

有了 `<ng-content>` 元素之後，這個元件的使用者現在可以把自己的訊息投影到元件中。例如：

<code-example header="content-projection/src/app/app.component.html" path="content-projection/src/app/app.component.html" region="single-slot"></code-example>

<div class="alert is-helpful">

`<ng-content>` 元素是一個佔位符，不會建立真實的 DOM 元素。
套用到 `<ng-content>` 的自訂屬性會被忽略。

</div>

<a id="multi-slot"></a>

## 多重插槽內容投影

一個元件可以有多個插槽。每個插槽可以指定一個 CSS 選取器，決定哪些內容會進入該插槽。這種模式稱為*多重插槽內容投影*。使用這種模式時，你必須指定希望投影內容出現的位置。你可以透過 `<ng-content>` 的 `select` 屬性來完成這項工作。

若要建立使用多重插槽內容投影的元件，請依下列步驟操作：

1.  [建立元件](guide/component-overview#建立元件)。
1.  在你的元件範本中，於你希望投影內容出現的位置加入一個 `<ng-content>` 元素。
1.  為 `<ng-content>` 元素加入 `select` 屬性。Angular 支援[選取器](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)，可搭配標籤名稱、屬性、CSS 類別與 `:not` 偽類別的任意組合。

舉例來說，下列元件使用兩個 `<ng-content>` 元素。

    <code-example header="content-projection/src/app/zippy-multislot/zippy-multislot.component.ts" path="content-projection/src/app/zippy-multislot/zippy-multislot.component.ts"></code-example>

使用 `question` 屬性的內容，會被投影到具有 `select=[question]` 屬性的 `<ng-content>` 元素中。

<code-example header="content-projection/src/app/app.component.html" path="content-projection/src/app/app.component.html" region="multi-slot"></code-example>

<div class="callout is-helpful">

<header>沒有 select 屬性的 ng-content</header>

如果你的元件包含一個沒有 `select` 屬性的 `<ng-content>` 元素，該實例會接收所有不符合其他任何 `<ng-content>` 元素的投影元件。

在前面的範例中，只有第二個 `<ng-content>` 元素定義了 `select` 屬性。
因此，第一個 `<ng-content>` 元素會接收投影到元件中的任何其他內容。

</div>

<a id="conditional"></a>

## 條件式內容投影

如果你的元件需要*依條件*算繪內容，或是多次算繪內容，你應該設定該元件接受一個 `<ng-template>` 元素，其中包含你想依條件算繪的內容。

在這些情況下，不建議使用 `<ng-content>` 元素，因為當元件的使用者提供內容時，該內容*一定*會被初始化，即使元件沒有定義 `<ng-content>` 元素，或是該 `<ng-content>` 元素位於 `ngIf` 陳述式內部也一樣。

使用 `<ng-template>` 元素時，你可以讓元件根據任何你想要的條件、想算繪幾次就明確算繪內容幾次。在該元素被明確算繪之前，Angular 不會初始化 `<ng-template>` 元素的內容。

以下步驟示範使用 `<ng-template>` 實作條件式內容投影的典型方式。

1.  [建立元件](guide/component-overview#建立元件)。
1.  在接受 `<ng-template>` 元素的元件中，使用 `<ng-container>` 元素來算繪該範本，例如：

    <code-example header="content-projection/src/app/example-zippy.template.html" path="content-projection/src/app/example-zippy.template.html" region="ng-container"></code-example>

這個範例使用 `ngTemplateOutlet` 指令來算繪指定的 `<ng-template>` 元素，你將在後面的步驟中定義它。你可以把 `ngTemplateOutlet` 指令套用到任何類型的元素上。這個範例把指令指派給 `<ng-container>` 元素，因為元件不需要算繪真實的 DOM 元素。

1.  把 `<ng-container>` 元素包在另一個元素（例如 `div` 元素）裡面，並套用你的條件邏輯。

    <code-example header="content-projection/src/app/example-zippy.template.html" path="content-projection/src/app/example-zippy.template.html" region="ngif"></code-example>

1.  在你想投影內容的範本中，把投影內容包在 `<ng-template>` 元素裡面，例如：

    <code-example header="content-projection/src/app/app.component.html"  region="ng-template" path="content-projection/src/app/app.component.html"></code-example>

`<ng-template>` 元素定義了一個內容區塊，元件可以依據自身的邏輯來算繪它。元件可以使用 `@ContentChild` 或 `@ContentChildren` 裝飾器，取得這個範本內容的參考，也就是 `TemplateRef`。前面的範例建立了一個自訂指令 `appExampleZippyContent`，作為標記元件內容所用 `<ng-template>` 的 API。有了 `TemplateRef`，元件就可以使用 `ngTemplateOutlet` 指令，或是 `ViewContainerRef` 的 `createEmbeddedView()` 方法，來算繪所參考的內容。

1.  [建立屬性指令](guide/attribute-directives#建立屬性指令)，其選取器要符合你範本的自訂屬性。在這個指令中，注入一個 `TemplateRef` 實例。

    <code-example header="content-projection/src/app/app.component.ts" path="content-projection/src/app/app.component.ts" region="zippycontentdirective"></code-example>

在上一個步驟中，你加入了一個帶有自訂屬性 `appExampleZippyContent` 的 `<ng-template>` 元素。這段程式碼提供了 Angular 在遇到該自訂屬性時會使用的邏輯。在這個情況下，該邏輯指示 Angular 實例化一個範本參考。

1.  在你想把內容投影進去的元件中，使用 `@ContentChild` 來取得投影內容的範本。

    <code-example header="content-projection/src/app/app.component.ts" path="content-projection/src/app/app.component.ts" region="contentchild"></code-example>

在這個步驟之前，你的應用程式已有一個元件，會在符合特定條件時實例化範本。你也建立了一個指令，提供該範本的參考。在最後這個步驟中，`@ContentChild` 裝飾器會指示 Angular 在指定的元件中實例化該範本。

    <div class="alert is-helpful">

    在多重插槽內容投影的情況下，請使用 `@ContentChildren` 來取得投影元素的 `QueryList`。

    </div>

<a id="ngprojectas "></a>

## 在更複雜的環境中投影內容

如[多重插槽內容投影](#multi-slot)所述，你通常會使用屬性、元素、CSS 類別，或是三者的某種組合，來識別要把內容投影到哪裡。舉例來說，在下列 HTML 範本中，一個段落標籤使用自訂屬性 `question`，把內容投影到 `app-zippy-multislot` 元件中。

<code-example header="content-projection/src/app/app.component.html" path="content-projection/src/app/app.component.html" region="multi-slot"></code-example>

在某些情況下，你可能想把內容投影成不同的元素。舉例來說，你想投影的內容可能是另一個元素的子元素。你可以使用 `ngProjectAs` 屬性來達成。

舉例來說，請看下列 HTML 片段：

<code-example header="content-projection/src/app/app.component.html" path="content-projection/src/app/app.component.html" region="ngprojectas"></code-example>

這個範例使用 `<ng-container>` 屬性，來模擬把元件投影到更複雜的結構中。

<div class="callout is-helpful">

<header>提醒</header>

`ng-container` 元素是一種邏輯結構，用來將其他 DOM 元素分組；不過，`ng-container` 本身不會在 DOM 樹中算繪。

</div>

在這個範例中，我們想投影的內容位於另一個元素內部。為了按照預期投影此內容，範本使用了 `ngProjectAs` 屬性。使用 `ngProjectAs` 時，整個 `<ng-container>` 元素會透過 `[question]` 選取器被投影到元件中。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
