# 內建指令

Angular 提供兩種內建指令：[_屬性_指令](guide/attribute-directives)與[_結構_指令](guide/structural-directives)。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

關於如何建立自己的自訂指令的資訊，請參閱[屬性指令](guide/attribute-directives)與[結構指令](guide/structural-directives)。

<hr/>

{@a attribute-directives}

## 內建屬性指令

屬性指令會監聽並修改其他 HTML 元素、屬性、性質與元件的行為。
你通常會把它們像 HTML attribute 一樣套用到元素上，因此得名。

許多 NgModule，例如 [`RouterModule`](guide/router "Routing and Navigation") 與 [`FormsModule`](guide/forms "Forms")，都定義了自己的屬性指令。
最常見的屬性指令如下：

* [`NgClass`](guide/built-in-directives#ngClass)&mdash;新增與移除一組 CSS 類別。
* [`NgStyle`](guide/built-in-directives#ngStyle)&mdash;新增與移除一組 HTML 樣式。
* [`NgModel`](guide/built-in-directives#ngModel)&mdash;為 HTML 表單元素加上雙向資料繫結。

<hr/>

{@a ngClass}

## `NgClass`

使用 `ngClass` 一次新增或移除多個 CSS 類別。

<code-example path="built-in-directives/src/app/app.component.html" region="special-div" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

若要新增或移除*單一*類別，請使用[類別繫結](guide/attribute-binding#class-binding)，而不是 `NgClass`。

</div>

考慮一個 `setCurrentClasses()` 元件方法，它會設定元件屬性
`currentClasses`，其值是一個物件，會根據另外三個元件屬性的
`true`/`false` 狀態新增或移除三個類別。物件的每個鍵都是一個 CSS 類別名稱；其值為 `true` 表示應加入該類別，
`false` 表示應移除。

<code-example path="built-in-directives/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts"></code-example>

把 `ngClass` 屬性繫結加入 `currentClasses`，即可相應地設定元素的類別：

<code-example path="built-in-directives/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

請記住，在這種情況下，你會呼叫 `setCurrentClasses()`，
包括初始時，以及相依屬性變更時。

</div>

<hr/>

{@a ngStyle}

## `NgStyle`

使用 `NgStyle`，根據元件的狀態一次動態地設定多個行內樣式。

### 不使用 `NgStyle`

作為背景脈絡，考慮在不使用 `NgStyle` 的情況下，以[樣式繫結](guide/attribute-binding#style-binding)設定*單一*樣式值。

<code-example path="built-in-directives/src/app/app.component.html" region="without-ng-style" header="src/app/app.component.html"></code-example>

不過，若要同時設定*多個*行內樣式，請使用 `NgStyle` 指令。

以下是 `setCurrentStyles()` 方法，它會設定元件
屬性 `currentStyles`，其值是一個物件，會根據另外三個元件屬性的狀態定義三種樣式：

<code-example path="built-in-directives/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts"></code-example>

把 `ngStyle` 屬性繫結加入 `currentStyles`，即可相應地設定元素的樣式：

<code-example path="built-in-directives/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

請記得呼叫 `setCurrentStyles()`，包括初始時，以及相依屬性變更時。

</div>

<hr/>

{@a ngModel}

## `[(ngModel)]`：雙向繫結

`NgModel` 指令可讓你顯示資料屬性，並在使用者變更時更新該屬性。範例如下：

<code-example path="built-in-directives/src/app/app.component.html" header="src/app/app.component.html (NgModel example)" region="NgModel-1"></code-example>

### 匯入 `FormsModule` 以使用 `ngModel`

在雙向資料繫結中使用 `ngModel` 指令之前，
你必須匯入 `FormsModule` 並把它加入 NgModule 的 `imports` 清單。
如需 `FormsModule` 與 `ngModel` 的更多資訊，請參閱[表單](guide/forms#ngModel)。

請記得匯入 `FormsModule`，讓 `[(ngModel)]` 可以如下使用：

<code-example path="built-in-directives/src/app/app.module.ts" header="src/app/app.module.ts (FormsModule import)" region="import-forms-module"></code-example>

你也可以分別繫結 `<input>` 元素的 `value` 屬性與 `input` 事件，達到相同的結果：

<code-example path="built-in-directives/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html"></code-example>

為了簡化語法，`ngModel` 指令把細節隱藏在它自己的 `ngModel` 輸入與 `ngModelChange` 輸出屬性背後：

<code-example path="built-in-directives/src/app/app.component.html" region="NgModelChange" header="src/app/app.component.html"></code-example>

`ngModel` 資料屬性會設定元素的值屬性，而 `ngModelChange` 事件屬性
會監聽元素值的變更。

### `NgModel` 與值存取器

這些細節因元素種類而異，因此 `NgModel` 指令只適用於受到 [ControlValueAccessor](api/forms/ControlValueAccessor) 支援的元素，該存取器會把元素適配到此協定。
Angular 為所有基本 HTML 表單元素提供了*值存取器*，而
[表單](guide/forms)指南示範了如何繫結到這些元素。

在你撰寫合適的值存取器之前，你無法把 `[(ngModel)]` 套用到非表單的原生元素或
第三方自訂元件。如需更多資訊，請參閱
[DefaultValueAccessor](api/forms/DefaultValueAccessor) 的 API 文件。

對於你自己撰寫的 Angular 元件，你不需要值存取器，因為你可以把值與事件屬性命名為符合 Angular 基本[雙向繫結語法](guide/two-way-binding)的形式，完全跳過 `NgModel`。
[雙向繫結](guide/two-way-binding)一節中的 `sizer` 就是這種技巧的範例。

把 `ngModel` 分開繫結，比繫結到元素的原生屬性有所改進，但你可以用單一宣告以 `[(ngModel)]` 語法進一步簡化繫結：

<code-example path="built-in-directives/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html"></code-example>

這個 `[(ngModel)]` 語法只能*設定*資料繫結的屬性。
如果你需要做更多事，可以撰寫展開形式；
例如，下列程式碼會把 `<input>` 的值改為大寫：

<code-example path="built-in-directives/src/app/app.component.html" region="uppercase" header="src/app/app.component.html"></code-example>

以下是所有變化形式的實際運作，包括大寫版本：

<div class="lightbox">
  <img src='generated/images/guide/built-in-directives/ng-model-anim.gif' alt="NgModel 變化">
</div>

<hr/>

{@a structural-directives}

## 內建 _結構_ 指令

結構指令負責 HTML 版面配置。
它們塑造或重塑 DOM 的結構，通常是透過新增、移除與操作它們所附加的宿主元素來達成。

本節介紹最常見的內建結構指令：

* [`NgIf`](guide/built-in-directives#ngIf)&mdash;依條件從範本建立或棄置子檢視。
* [`NgFor`](guide/built-in-directives#ngFor)&mdash;為清單中的每個項目重複一個節點。
* [`NgSwitch`](guide/built-in-directives#ngSwitch)&mdash;一組在替代檢視之間切換的指令。

<div class="alert is-helpful">

結構指令的深入細節在
[結構指令](guide/structural-directives)指南中有涵蓋，
該指南說明了下列內容：

* 為什麼要[在指令名稱前加上星號（\*）前綴](guide/structural-directives#星號前綴)。
* 當指令沒有合適的宿主元素時，使用 [`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>")
來群組元素。
* 如何撰寫你自己的結構指令。
* 為什麼你[只能對一個元素套用一個結構指令](guide/structural-directives#one-per-element "one per host element")。

</div>

<hr/>

{@a ngIf}

## NgIf

把 `NgIf` 指令套用到
宿主元素，即可從 DOM 新增或移除元素。
把指令繫結到像本範例中 `isActive` 這樣的條件運算式。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

別忘了 `ngIf` 前面的星號（`*`）。如需星號的更多資訊，請參閱[結構指令](guide/structural-directives)中的[星號（*）前綴](guide/structural-directives#星號前綴)一節。

</div>

當 `isActive` 運算式傳回真值時，`NgIf` 會把 `ItemDetailComponent` 加入 DOM。
當運算式為假值時，`NgIf` 會把 `ItemDetailComponent` 從 DOM 移除，並棄置該元件及其所有子元件。

### 顯示/隱藏 vs. `NgIf`

隱藏元素與用 `NgIf` 移除元素不同。
作為比較，下列範例示範如何以
[class](guide/attribute-binding#class-binding) 或 [style](guide/attribute-binding#style-binding) 繫結控制元素的可見性。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html"></code-example>

當你隱藏一個元素時，該元素及其所有後代都會留在 DOM 中。
這些元素的元件全都留在記憶體中，
Angular 可能會繼續檢查變更。
你可能會不必要地握有大量運算資源並降低效能。

`NgIf` 的運作方式不同。當 `NgIf` 為 `false` 時，Angular 會把元素及其後代從 DOM 移除。
它會棄置它們的元件，釋放資源，
從而帶來更好的使用者體驗。

如果你要隱藏大型元件樹，請考慮以 `NgIf` 作為比顯示/隱藏更有效率的替代方案。

<div class="alert is-helpful">

如需 `NgIf` 與 `ngIfElse` 的更多資訊，請參閱 [NgIf API 文件](api/common/NgIf)。

</div>

### 防範 null

`ngIf` 的另一個優點是可以用來防範 null。顯示/隱藏
最適合非常簡單的使用情境，所以當你需要防護時，改用 `ngIf`。如果巢狀運算式嘗試存取 `null` 的屬性，Angular 會擲出錯誤。

下列範例示範 `NgIf` 如何防護兩個 `<div>`。
只有存在 `currentCustomer` 時，才會出現 `currentCustomer` 名稱。
只要 `nullCustomer` 是 `null`，就不會顯示它。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html"></code-example>

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2b" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

另請參閱
[安全導覽運算子](guide/template-expression-operators#safe-navigation-operator "Safe navigation operator (?.)")。

</div>
<hr/>

{@a ngFor}
## `NgFor`

`NgFor` 是一個重複器指令&mdash;一種呈現項目清單的方式。
你定義一段 HTML，說明單一項目應如何顯示，
然後告訴 Angular 把該段落當作範本，用來算繪清單中的每個項目。
指派給 `*ngFor` 的文字是指導重複器流程的指令。

下列範例示範把 `NgFor` 套用到一個簡單的 `<div>`。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

別忘了 `ngFor` 前面的星號（`*`）。如需星號的更多資訊，請參閱[結構指令](guide/structural-directives)中的[星號（*）前綴](guide/structural-directives#星號前綴)一節。

</div>

你也可以把 `NgFor` 套用到元件元素，如下列範例所示。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html"></code-example>

{@a microsyntax}

<div class="callout is-critical">
<header>*ngFor 簡寫</header>

指派給 `*ngFor` 的字串不是[範本運算式](guide/interpolation)。相反地，
它是一種*簡寫*&mdash;一種 Angular 會解譯的自有小語言。
字串 `"let item of items"` 表示：

> *取出 `items` 陣列中的每個項目，把它存入區域 `item` 迴圈變數，並讓它在每次迭代時可供範本 HTML 使用。*

Angular 會把這個指令轉譯為宿主元素周圍的 `<ng-template>`，
再重複使用這個範本，為清單中的每個 `item` 建立一組新的元素與繫結。
如需簡寫的更多資訊，請參閱[結構指令](guide/structural-directives#microsyntax)指南。

</div>

{@a template-input-variable}

{@a template-input-variables}

### 範本輸入變數

`item` 前面的 `let` 關鍵字會建立一個名為 `item` 的範本輸入變數。
`ngFor` 指令會迭代父元件 `items` 屬性傳回的 `items` 陣列，
並在每次迭代時把 `item` 設為陣列中的目前項目。

在 `ngFor` 宿主元素內
以及其後代內參照 `item`，即可存取該項目的屬性。
下列範例先在插值中參照 `item`，
再把繫結傳入 `<app-item-detail>` 元件的 `item` 屬性。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html"></code-example>

如需範本輸入變數的更多資訊，請參閱
[結構指令](guide/structural-directives#template-input-variable)。

### 搭配 `index` 使用 `*ngFor`

`NgFor` 指令內容的 `index` 屬性
會傳回每次迭代中項目的零基索引。
你可以把 `index` 擷取到範本輸入變數中，並在範本中使用它。

下一個範例把 `index` 擷取到名為 `i` 的變數中，並把它與項目名稱一起顯示。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`NgFor` 由 `NgForOf` 指令實作。如需其他 `NgForOf` 內容值（例如 `last`、`even`
與 `odd`）的更多資訊，請參閱 [NgForOf API 參考](api/common/NgForOf)。

</div>

{@a trackBy}
### 搭配 `trackBy` 使用 *ngFor

如果你把 `NgFor` 用在大型清單上，對單一項目的小變更（例如移除或新增一個項目）可能觸發一連串 DOM 操作。例如，重新向伺服器查詢可能把清單重設為全新的項目物件，即使那些項目先前已經顯示過。在這種情況下，Angular 只看到一份全新的物件參照清單，只能把舊的 DOM 元素全部換成新的 DOM 元素。

你可以透過 `trackBy` 讓這件事更有效率。
在元件中加入一個方法，傳回 `NgFor` 應該追蹤的值。
在本例中，該值是英雄的 `id`。如果該 `id` 已經算繪過，
Angular 會持續追蹤它，不會為了相同的 `id` 再次向伺服器查詢。

<code-example path="built-in-directives/src/app/app.component.ts" region="trackByItems" header="src/app/app.component.ts"></code-example>

在簡寫運算式中，把 `trackBy` 設為 `trackByItems()` 方法。

<code-example path="built-in-directives/src/app/app.component.html" region="trackBy" header="src/app/app.component.html"></code-example>

以下是 `trackBy` 效果的圖示。
"Reset items" 會建立具有相同 `item.id` 的新項目。
"Change ids" 會建立具有新 `item.id` 的新項目。

* 沒有 `trackBy` 時，兩個按鈕都會觸發完整的 DOM 元素取代。
* 使用 `trackBy` 時，只有變更 `id` 才會觸發元素取代。

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngfor-trackby.gif" alt="trackBy 動畫">
</div>

<div class="alert is-helpful">

內建指令只使用公開 API。
它們並未擁有其他指令無法存取的任何私有 API 的特殊存取權。

</div>

<hr/>

{@a ngSwitch}
## `NgSwitch` 指令

NgSwitch 就像 JavaScript 的 `switch` 陳述式。
它會根據切換條件，從數個可能的元素中顯示一個元素。
Angular 只會把選取的元素放入 DOM。
<!-- API Flagged -->
`NgSwitch` 實際上是一組三個協作的指令：
`NgSwitch`、`NgSwitchCase` 與 `NgSwitchDefault`，如下列範例所示。

 <code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html"></code-example>

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngswitch.gif" alt="NgSwitch 動畫">
</div>

`NgSwitch` 是控制器指令。把它繫結到一個傳回
*切換值*的運算式，例如 `feature`。雖然本範例中的 `feature` 值是
字串，但切換值可以是任何型別。

**繫結到 `[ngSwitch]`**。如果你嘗試設定 `*ngSwitch`，會得到錯誤，因為
`NgSwitch` 是*屬性*指令，不是*結構*指令。
它不直接碰觸 DOM，而是改變其同伴指令的行為。

**繫結到 `*ngSwitchCase` 與 `*ngSwitchDefault`**。
`NgSwitchCase` 與 `NgSwitchDefault` 指令是*結構*指令
，因為它們會從 DOM 新增或移除元素。

* `NgSwitchCase` 會在其繫結值等於切換值時，把它的元素加入 DOM；不等於切換值時，則移除其元素。

* `NgSwitchDefault` 會在沒有選取的 `NgSwitchCase` 時，把它的元素加入 DOM。

切換指令特別適合用來新增與移除*元件元素*。
本範例在 `item-switch.components.ts` 檔案中定義的四個 `item` 元件之間切換。
每個元件都有一個 `item` [輸入屬性](guide/inputs-outputs#input "Input property")
，它繫結到父元件的 `currentItem`。

切換指令也可以搭配原生元素與 Web 元件使用。
例如，你可以把 `<app-best-item>` 切換案例換成下列寫法。

<code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html"></code-example>
