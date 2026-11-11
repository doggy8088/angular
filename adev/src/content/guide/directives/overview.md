<docs-decorative-header title="內建指令" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
指令是為你的 Angular 應用程式中的元素加上額外行為的類別。
</docs-decorative-header>

使用 Angular 的內建指令來管理表單、清單、樣式，以及使用者看到的內容。

Angular 指令的不同類型如下：

| 指令類型                                                         | 說明                                                                           |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| [元件](guide/components)                                         | 搭配範本使用。這是最常見的指令類型。                                           |
| [屬性指令](#built-in-attribute-directives)                      | 改變元素、元件或另一個指令的外觀或行為。                                       |
| [結構指令](#built-in-structural-directives)              | 透過新增與移除 DOM 元素來改變 DOM 版面配置。                                   |

本指南介紹內建的[屬性指令](#built-in-attribute-directives)與[結構指令](#built-in-structural-directives)。

## 內建屬性指令 {#built-in-attribute-directives}

屬性指令會監聽並修改其他 HTML 元素、屬性、性質與元件的行為。

最常見的屬性指令如下：

| 常見指令                                               | 說明                                            |
| :----------------------------------------------------- | :------------------------------------------------- |
| [`NgClass`](#adding-and-removing-classes-with-ngclass) | 新增與移除一組 CSS 類別。             |
| [`NgStyle`](#setting-inline-styles-with-ngstyle)       | 新增與移除一組 HTML 樣式。             |
| [`NgModel`](#displaying-and-updating-properties-with-ngmodel)         | 為 HTML 表單元素加上雙向資料繫結。 |

HELPFUL: 內建指令只使用公開 API。它們並未擁有其他指令無法存取的任何私有 API 的特殊存取權。

## 使用 `NgClass` 新增與移除類別 {#adding-and-removing-classes-with-ngclass}

使用 `ngClass` 一次新增或移除多個 CSS 類別。

HELPFUL: 若要新增或移除_單一_類別，請使用[類別繫結](guide/templates/class-binding)，而不是 `NgClass`。

### 在元件中匯入 `NgClass`

若要使用 `NgClass`，請把它加入元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgClass import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-class"/>

### 搭配運算式使用 `NgClass`

在你想設定樣式的元素上，加入 `[ngClass]` 並把它設為等於一個運算式。
在這個例子中，`isSpecial` 是在 `app.component.ts` 中設為 `true` 的布林值。
因為 `isSpecial` 為 true，`ngClass` 會把 `special` 類別套用到 `<div>`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="special-div"/>

### 搭配方法使用 `NgClass`

1. 若要搭配方法使用 `NgClass`，請把該方法加入元件類別。
    在下列範例中，`setCurrentClasses()` 會以一個物件設定 `currentClasses` 屬性，該物件會依其他三個元件屬性的 `true` 或 `false` 狀態，新增或移除三個類別。

    物件的每個鍵都是一個 CSS 類別名稱。
    如果鍵為 `true`，`ngClass` 會新增該類別。
    如果鍵為 `false`，`ngClass` 會移除該類別。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setClasses"/>

1. 在範本中，把 `ngClass` 屬性繫結加到 `currentClasses`，以設定元素的類別：

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgClass-1"/>

在這個使用案例中，Angular 會在初始化時以及發生變更時套用這些類別。
完整範例一開始會透過 `ngOnInit()` 呼叫 `setCurrentClasses()`，當相依屬性因按鈕點選而變更時也會呼叫它。
這些步驟並非實作 `ngClass` 的必要條件。

## 使用 `NgStyle` 設定行內樣式 {#setting-inline-styles-with-ngstyle}

### 在元件中匯入 `NgStyle`

若要使用 `NgStyle`，請把它加入元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgStyle import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-style"/>

使用 `NgStyle`，依元件的狀態一次設定多個行內樣式。

1. 若要使用 `NgStyle`，請把一個方法加入元件類別。

    在下列範例中，`setCurrentStyles()` 會以一個物件設定 `currentStyles` 屬性，該物件依其他三個元件屬性的狀態定義三種樣式。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setStyles"/>

1. 若要設定元素的樣式，請把 `ngStyle` 屬性繫結加到 `currentStyles`。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgStyle-2"/>

在這個使用案例中，Angular 會在初始化時套用這些樣式，並在發生變更時再次套用。
為此，完整範例會在一開始以 `ngOnInit()` 呼叫 `setCurrentStyles()`，並在相依屬性透過按鈕點選而改變時再次呼叫。
不過，這些步驟並非單獨實作 `ngStyle` 的必要條件。

## 使用 `ngModel` 顯示與更新屬性 {#displaying-and-updating-properties-with-ngmodel}

使用 `NgModel` 指令來顯示資料屬性，並在使用者做出變更時更新該屬性。

1. 匯入 `FormsModule`，並把它加入 AppComponent 的 `imports` 清單。

    <docs-code header="src/app/app.component.ts (FormsModule import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-forms-module" />

1. 在 HTML `<form>` 元素上加入 `[(ngModel)]` 繫結，並把它設為等於該屬性，這裡是 `name`。

    <docs-code header="src/app/app.component.html (NgModel example)" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgModel-1"/>

    這種 `[(ngModel)]` 語法只能設定資料繫結的屬性。

若要自訂你的設定，請使用展開形式，把屬性繫結與事件繫結分開。
使用[屬性繫結](guide/templates/property-binding)設定屬性，並使用[事件繫結](guide/templates/event-binding)回應變更。
下列範例把 `<input>` 的值改為大寫：

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="uppercase"/>

以下是所有變化形式的實際運作，包括大寫版本：

<img alt="NgModel 的各種變化" src="assets/images/guide/built-in-directives/ng-model-anim.gif">

### `NgModel` 與值存取器

`NgModel` 指令適用於由 [ControlValueAccessor](api/forms/ControlValueAccessor) 支援的元素。
Angular 為所有基本 HTML 表單元素提供了_值存取器_。
如需更多資訊，請參閱[表單](guide/forms)。

若要把 `[(ngModel)]` 套用到非表單的內建元素或第三方自訂元件，你必須撰寫一個值存取器。
如需更多資訊，請參閱 [DefaultValueAccessor](api/forms/DefaultValueAccessor) 的 API 文件。

HELPFUL: 當你撰寫 Angular 元件時，如果你依 Angular 的[雙向繫結語法](guide/templates/two-way-binding#how-two-way-binding-works)來命名值與事件屬性，就不需要值存取器或 `NgModel`。

## 內建結構指令 {#built-in-structural-directives}

結構指令負責 HTML 版面配置。
它們塑造或重塑 DOM 的結構，通常是透過新增、移除與操作它們所附加的宿主元素來達成。

本節介紹最常見的內建結構指令：

| 常見的內建結構指令                             | 說明                                               |
| :----------------------------------------------- | :------------------------------------------------- |
| [`NgIf`](#adding-or-removing-an-element-with-ngif) | 依條件從範本建立或棄置子檢視。                     |
| [`NgFor`](#listing-items-with-ngfor)               | 為清單中的每個項目重複一個節點。                   |
| [`NgSwitch`](#switching-cases-with-ngswitch)       | 一組在替代檢視之間切換的指令。                     |

如需更多資訊，請參閱[結構指令](guide/directives/structural-directives)。

## 使用 `NgIf` 新增或移除元素 {#adding-or-removing-an-element-with-ngif}

把 `NgIf` 指令套用到宿主元素，即可新增或移除元素。

當 `NgIf` 為 `false` 時，Angular 會把元素及其後代從 DOM 移除。
接著 Angular 會棄置它們的元件，釋放記憶體與資源。

### 在元件中匯入 `NgIf`

若要使用 `NgIf`，請把它加入元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgIf import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-if"/>

### 使用 `NgIf`

若要新增或移除元素，請把 `*ngIf` 繫結到條件運算式，例如下列範例中的 `isActive`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-1"/>

當 `isActive` 運算式傳回真值時，`NgIf` 會把 `ItemDetailComponent` 加入 DOM。
當運算式為假值時，`NgIf` 會把 `ItemDetailComponent` 從 DOM 移除，並棄置該元件及其所有子元件。

如需 `NgIf` 與 `NgIfElse` 的更多資訊，請參閱 [NgIf API 文件](api/common/NgIf)。

### 防範 `null`

依預設，`NgIf` 會防止顯示繫結到 null 值的元素。

若要用 `NgIf` 守衛一個 `<div>`，請在 `<div>` 上加入 `*ngIf="yourProperty"`。
在下列範例中，因為有 `currentCustomer`，所以會顯示 `currentCustomer` 的名稱。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-2"/>

然而，如果該屬性是 `null`，Angular 就不會顯示 `<div>`。
在本範例中，Angular 不會顯示 `nullCustomer`，因為它是 `null`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-2b"/>

## 使用 `NgFor` 列出項目 {#listing-items-with-ngfor}

使用 `NgFor` 指令呈現一份項目清單。

### 在元件中匯入 `NgFor`

若要使用 `NgFor`，請把它加入元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgFor import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-for"/>

### 使用 `NgFor`

若要使用 `NgFor`，你必須：

1. 定義一段 HTML，決定 Angular 如何算繪單一項目。
1. 若要列出你的項目，請把簡寫 `let item of items` 指派給 `*ngFor`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-1"/>

字串 `"let item of items"` 指示 Angular 執行下列事項：

- 把 `items` 陣列中的每個項目存入區域的 `item` 迴圈變數
- 在每次迭代中，讓範本 HTML 都能使用每個項目
- 把 `"let item of items"` 轉譯為宿主元素周圍的 `<ng-template>`
- 為清單中的每個 `item` 重複該 `<ng-template>`

如需更多資訊，請參閱[結構指令](guide/directives/structural-directives)中的[結構指令簡寫](guide/directives/structural-directives#structural-directive-shorthand)一節。

### 重複元件檢視

若要重複一個元件元素，請把 `*ngFor` 套用到選擇器。
在下列範例中，選擇器是 `<app-item-detail>`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-2"/>

你可以在下列位置參照範本輸入變數，例如 `item`：

- 在 `ngFor` 宿主元素內
- 在宿主元素的後代內，以存取項目的屬性

下列範例先在插值中參照 `item`，然後把它傳入 `<app-item-detail>` 元件的 `item` 屬性繫結。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-1-2"/>

如需範本輸入變數的更多資訊，請參閱[結構指令簡寫](guide/directives/structural-directives#structural-directive-shorthand)。

### 取得 `*ngFor` 的 `index`

在範本輸入變數中取得 `*ngFor` 的 `index`，並在範本中使用它。

在 `*ngFor` 中，加入分號與 `let i=index` 到簡寫中。
下列範例把 `index` 取得為名為 `i` 的變數，並把它與項目名稱一起顯示。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-3"/>

`NgFor` 指令上下文的 index 屬性會傳回每次迭代中項目的零基索引。

Angular 把這道指示轉譯為宿主元素周圍的 `<ng-template>`，
然後重複使用這個範本，為清單中的每個 `item` 建立一組新的元素與繫結。
如需簡寫的更多資訊，請參閱[結構指令](guide/directives/structural-directives#structural-directive-shorthand)指南。

## 在條件為真時重複元素 {#repeating-elements-when-a-condition-is-true}

若要在特定條件為真時重複一段 HTML，請把 `*ngIf` 放在包裝 `*ngFor` 元素的容器元素上。

如需更多資訊，請參閱[每個元素一個結構指令](guide/directives/structural-directives#one-structural-directive-per-element)。

### 使用 `*ngFor` `trackBy` 追蹤項目

透過追蹤項目清單的變更，減少你的應用程式對伺服器的呼叫次數。
有了 `*ngFor` 的 `trackBy` 屬性，Angular 可以只變更並重新算繪已變更的項目，而不必重新載入整份項目清單。

1. 在元件中加入一個方法，傳回 `NgFor` 應追蹤的值。
    在本範例中，要追蹤的值是項目的 `id`。
    如果瀏覽器已經算繪過該 `id`，Angular 會追蹤它，不會再向伺服器查詢同一個 `id`。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="trackByItems"/>

1. 在簡寫運算式中，把 `trackBy` 設為 `trackByItems()` 方法。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="trackBy"/>

**變更 id** 會建立具有新 `item.id` 的新項目。
在下列 `trackBy` 效果的示意中，**重設項目** 會建立 `item.id` 相同的新項目。

- 沒有 `trackBy` 時，兩個按鈕都會觸發完整的 DOM 元素替換。
- 有 `trackBy` 時，只有變更 `id` 才會觸發元素替換。

<img alt="trackBy 動畫" src="assets/images/guide/built-in-directives/ngfor-trackby.gif">


## 在沒有 DOM 元素的情況下承載指令

Angular 的 `<ng-container>` 是一個分組元素，它不會干擾樣式或版面配置，因為 Angular 不會把它放進 DOM。

當沒有單一元素可以承載指令時，請使用 `<ng-container>`。

以下是一個使用 `<ng-container>` 的條件段落。

<docs-code header="src/app/app.component.html (ngif-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="ngif-ngcontainer"/>

<img alt="樣式正確的 ng-container 段落" src="assets/images/guide/structural-directives/good-paragraph.png">

1. 從 `FormsModule` 匯入 `ngModel` 指令。

1. 把 `FormsModule` 加入相關 Angular 模組的 imports 區段。

1. 若要依條件排除某個 `<option>`，請把 `<option>` 包在 `<ng-container>` 裡。

    <docs-code header="src/app/app.component.html (select-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="select-ngcontainer"/>

    <img alt="ng-container 中的選項運作正常" src="assets/images/guide/structural-directives/select-ngcontainer-anim.gif">

## 使用 `NgSwitch` 切換案例 {#switching-cases-with-ngswitch}

如同 JavaScript 的 `switch` 陳述式，`NgSwitch` 會依切換條件，從數個可能的元素中顯示一個元素。
Angular 只會把所選的元素放進 DOM。

<!--todo: API Flagged -->

`NgSwitch` 是一組三個指令：

| `NgSwitch` 指令     | 說明                                                                             |
| :-------------------- | :------------------------------------------------------------------------------- |
| `NgSwitch`            | 屬性指令，會改變其夥伴指令的行為。                                               |
| `NgSwitchCase`        | 結構指令，當其繫結值等於切換值時把元素加入 DOM，不等於切換值時則移除其繫結值。   |
| `NgSwitchDefault`     | 結構指令，當沒有符合的 `NgSwitchCase` 時把元素加入 DOM。                         |

若要使用這些指令，請把 `NgSwitch`、`NgSwitchCase` 與 `NgSwitchDefault` 加入元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgSwitch imports)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-switch"/>

### 使用 `NgSwitch`

1. 在一個元素上（例如 `<div>`），加入 `[ngSwitch]` 並把它繫結到一個傳回切換值的運算式，例如 `feature`。
    雖然本範例中的 `feature` 值是字串，但切換值可以是任何型別。

1. 把 `*ngSwitchCase` 與 `*ngSwitchDefault` 繫結到各案例的元素上。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgSwitch"/>

1. 在父元件中定義 `currentItem`，用在 `[ngSwitch]` 運算式中。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="item"/>

1. 在每個子元件中，加入一個 `item` [輸入屬性](guide/components/inputs)，把它繫結到父元件的 `currentItem`。
    下列兩個片段顯示父元件與其中一個子元件。
    其他子元件與 `StoutItemComponent` 相同。

    <docs-code header="In each child component, here StoutItemComponent" path="adev/src/content/examples/built-in-directives/src/app/item-switch.component.ts" visibleRegion="input"/>

    <img alt="NgSwitch 動畫" src="assets/images/guide/built-in-directives/ngswitch.gif">

切換指令也可以搭配內建 HTML 元素與 Web 元件使用。
例如，你可以把 `<app-best-item>` 切換案例換成 `<div>`，如下所示。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgSwitch-div"/>


## 後續步驟

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="屬性指令"/>
  <docs-pill href="guide/directives/structural-directives" title="結構指令"/>
  <docs-pill href="guide/directives/directive-composition-api" title="指令組合 API"/>
</docs-pill-row>
