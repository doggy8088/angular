<docs-decorative-header title="內建指令" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
指令是類別，可為 Angular 應用程式中的元素新增其他行為。
</docs-decorative-header>

使用 Angular 內建的指令來管理表單、清單、樣式，以及使用者看到什麼。

Angular 指令類型如下：

| 指令類型                                          | 詳細資料                                                                           |
| :------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [元件](guide/components)                           | 與範本搭配使用。此類指令是最常見的指令類型。                                 |
| [屬性指令](#built-in-attribute-directives)   | 變更元素、元件或其他指令的外觀或行為。                                       |
| [結構指令](#built-in-structural-directives) | 透過新增和移除 DOM 元素來變更 DOM 佈局。                                     |

本指南涵蓋內建的 [屬性指令](#built-in-attribute-directives) 和 [結構指令](#built-in-structural-directives)。

## 內建屬性指令

屬性指令會偵聽和修改其他 HTML 元素、屬性、內容和元件的行為。

最常見的屬性指令如下：

| 常見指令                                             | 詳細資料                                            |
| :------------------------------------------------------------ | :------------------------------------------------- |
| [`NgClass`](#adding-and-removing-classes-with-ngclass)        | 新增並移除一組 CSS 類別。             |
| [`NgStyle`](#setting-inline-styles-with-ngstyle)              | 新增並移除一組 HTML 樣式。             |
| [`NgModel`](#displaying-and-updating-properties-with-ngmodel) | 將雙向資料繫結新增至 HTML 表單元素。 |

HELPFUL：內建指令僅使用公開 API。它們無法特別存取其他指令無法存取的任何私人 API。

## 使用 `NgClass` 新增和移除類別

html
<div [ngClass]="currentClasses">...</div>

同時使用 `ngClass` 新增或移除多個 CSS 類別。

HELPFUL: 若要新增或移除 _單一_ 類別，請使用 [類別繫結](guide/templates/class-binding) 而不是 `NgClass`。

### 在元件中匯入 `NgClass`

若要使用 `NgClass`，請將它新增至元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgClass import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-class"/>

### 使用帶有表達式的 `NgClass`

在您想設定樣式的元素上，加入 `[ngClass]` 並將它設定為等於一個表達式。
在這個案例中，`isSpecial` 是在 `app.component.ts` 中設定為 `true` 的布林值。
因為 `isSpecial` 為真，`ngClass` 將 `special` 的類別套用至 `<div>`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="special-div"/>

### 使用 `NgClass` 與方法

1. 若要將 `NgClass` 與方法搭配使用，請將方法新增至元件類別。
    在以下範例中，`setCurrentClasses()` 會以物件設定 `currentClasses` 屬性，該物件會根據三個其他元件屬性的 `true` 或 `false` 狀態新增或移除三個類別。

    物件的每個金鑰都是 CSS 類別名稱。
    如果金鑰為 `true`，`ngClass` 會新增類別。
    如果金鑰為 `false`，`ngClass` 會移除類別。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setClasses"/>

1. 在範本中，將 `ngClass` 屬性繫結新增至 `currentClasses` 以設定元素的類別：

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgClass-1"/>

對於這個使用案例，Angular 會在初始化時套用類別，並且在變更時套用。
完整的範例最初會透過 `ngOnInit()` 呼叫 `setCurrentClasses()`，以及當相關屬性透過按鈕點擊而變更時。
這些步驟對於實作 `ngClass` 來說不是必要的。

## 使用 `NgStyle` 設定內聯樣式

html
<div [ngStyle]="{'color': 'red', 'font-size': '20px'}"></div>

### 在元件中匯入 `NgStyle`

要使用 `NgStyle`，請將它新增到元件的 `imports` 清單中。

<docs-code header="src/app/app.component.ts (NgStyle import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-style"/>

使用 `NgStyle` 可根據元件的狀態同時設定多個內聯樣式。

1. 若要使用 `NgStyle`，請在元件類別中新增一個方法。

    在以下範例中，`setCurrentStyles()` 會使用定義三種樣式的物件設定 `currentStyles` 屬性，這些樣式基於三個其他元件屬性的狀態。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setStyles"/>

1. 若要設定元素的樣式，請將 `ngStyle` 屬性繫結新增至 `currentStyles`。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgStyle-2"/>

針對此使用案例，Angular 在初始化時套用樣式，並在變更時套用。
為執行此動作，完整範例會在 `ngOnInit()` 中以 `setCurrentStyles()` 進行初始呼叫，以及在依賴屬性因為按鈕點擊而變更時呼叫。
不過，要單獨實作 `ngStyle` 時，不需要執行這些步驟。

## 使用 `ngModel` 顯示和更新屬性

使用 `NgModel` 指令來顯示資料屬性，並在使用者進行變更時更新該屬性。

1. 匯入 `FormsModule` 並將它新增至 `AppComponent` 的 `imports` 清單。

    <docs-code header="src/app/app.component.ts (FormsModule import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-forms-module" />

1. 在 HTML `<form>` 元素上新增 `[(ngModel)]` 繫結，並將它設定等於屬性，這裡是 `name`。

    <docs-code header="src/app/app.component.html (NgModel example)" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgModel-1"/>

    這個 `[(ngModel)]` 語法只能設定資料繫結的屬性。

要自訂您的設定，請寫入擴充表單，它會將屬性和事件繫結分開。
使用 [屬性繫結](guide/templates/property-binding) 來設定屬性，並使用 [事件繫結](guide/templates/event-binding) 來回應變更。
以下範例將 `<input>` 值變更為大寫：

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="uppercase"/>

以下為所有變體的實際操作，包括大寫版本：

<img alt="NgModel 變化" src="https://angular.dev/assets/images/guide/built-in-directives/ng-model-anim.gif">

### `NgModel` 及值存取器

`NgModel` 指令適用於由 [ControlValueAccessor](api/forms/ControlValueAccessor) 支援的元素。
Angular 為所有基本 HTML 表單元素提供 _值存取器_。
如需更多資訊，請參閱 [表單](guide/forms)。

若要將 `[(ngModel)]` 套用至非表單內建元素或第三方自訂元件，您必須撰寫值存取器。
如需詳細資訊，請參閱 [DefaultValueAccessor](api/forms/DefaultValueAccessor) 的 API 文件。

HELPFUL: 當您撰寫 Angular 元件時，如果您根據 Angular 的[雙向繫結語法](guide/templates/two-way-binding#how-two-way-binding-works)來命名值和事件屬性，則不需要值存取器或 `NgModel`。

## 內建結構指令

結構型指令負責 HTML 佈局。
它們塑造或重塑 DOM 的結構，通常是透過新增、移除和操作其附加的主機元素來達成。

本節介紹最常見的內建結構型指令：

| 常見內建結構型指令 | 詳情 |
| :------------------------------------------------- | :--------------------------------------------------------------- |
| [`NgIf`](#adding-or-removing-an-element-with-ngif) | 有條件地建立或處置來自範本的子檢視。 |
| [`NgFor`](#listing-items-with-ngfor) | 重複一個節點以供清單中的每個項目使用。 |
| [`NgSwitch`](#switching-cases-with-ngswitch) | 一組在不同檢視之間切換的指令。 |

如欲了解更多資訊，請參閱 [結構型指令](guide/directives/structural-directives)。

## 使用 `NgIf` 新增或移除元素

將元素新增或移除，方法是將 `NgIf` 指令套用到主機元素。

當 `NgIf` 為 `false` 時，Angular 會從 DOM 中移除元素及其子元素。
Angular 然後處置其元件，這會釋放記憶體和資源。

### 在元件中匯入 `NgIf`

要使用 `NgIf`，請將它新增至元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgIf import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-if"/>

### 使用 `NgIf`

若要新增或移除元素，請將 `*ngIf` 繫結至條件表達式，例如以下範例中的 `isActive`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-1"/>

當 `isActive` 表達式傳回真值時，`NgIf` 將 `ItemDetailComponent` 新增至 DOM。
當表達式為假值時，`NgIf` 將 `ItemDetailComponent` 從 DOM 中移除，並處理該元件及其所有子元件。

有關 `NgIf` 和 `NgIfElse` 的更多資訊，請參閱 [NgIf API 文件](api/common/NgIf)。

### 防範 `null`

null

預設情況下，`NgIf` 會防止顯示繫結到 null 值的元素。

要使用 `NgIf` 來保護 `<div>`，請將 `*ngIf="yourProperty"` 新增到 `<div>`。
在以下範例中，`currentCustomer` 名稱會顯示，因為有一個 `currentCustomer`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-2"/>

`null` 的話，Angular 不會顯示 `<div>`。
在這個範例中，Angular 不會顯示 `nullCustomer` 因為它是 `null`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-2b"/>

## 使用 `NgFor` 列出項目

使用 `NgFor` 指令來呈現項目清單。

### 在元件中匯入 `NgFor`

若要使用 `NgFor`，請將它加入元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgFor import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-for"/>

### 使用 `NgFor`

要使用 `NgFor`，您必須：

1. 定義一個 HTML 區塊，用於決定 Angular 如何呈現單個項目。
1. 若要列出您的項目，請將簡寫 `let item of items` 指派給 `*ngFor`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-1"/>

字串 `"let item of items"` 指示 Angular 執行下列動作：

- 將每個項目儲存在 `item` 迴圈變數的 `items` 陣列中
- 讓每個項目在每次叠代時都能使用範本 HTML
- 將 `"let item of items"` 轉換成圍繞主機元素的 `<ng-template>`
- 對清單中的每個 `item` 重複 `<ng-template>`

有關更多資訊，請參閱 [結構型指令速記](guide/directives/structural-directives#structural-directive-shorthand) 部分的 [結構型指令](guide/directives/structural-directives)。

### 重複元件檢視

若要重複元件元素，請將 `*ngFor` 套用至選取器。
在下列範例中，選取器是 `<app-item-detail>`。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-2"/>

參照範本輸入變數（例如 `item`），如下所示：

- 在 `ngFor` 主機元素內
- 在主機元素的子孫中存取項目屬性

以下範例首先在內插中參照 `item`，然後傳入對 `<app-item-detail>` 元件的 `item` 屬性的繫結。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-1-2"/>

有關範本輸入變數的更多資訊，請參閱 [結構型指令簡寫](guide/directives/structural-directives#structural-directive-shorthand)。

### 取得 `*ngFor` 的 `index`

在範本輸入變數中取得 `*ngFor` 的 `index` 並在範本中使用它。

在 `*ngFor` 中，將分號和 `let i=index` 新增至簡寫。
以下範例以變數 `i` 取得 `index`，並與項目名稱一起顯示。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-3"/>

`NgFor` 指令內容的 index 屬性會傳回每次叠代中該項目的以 0 為基底的索引。

Angular 將此指令轉換為主機元素周圍的 `<ng-template>`，
然後重複使用此範本為清單中的每個 `item` 建立一組新的元素和繫結。
如需有關簡寫的更多資訊，請參閱 [結構指令](guide/directives/structural-directives#structural-directive-shorthand) 指南。

## 當條件為真時重複元素

若要重複一個 HTML 區塊，當特定條件為 true 時，請在包裝 `*ngFor` 元素的容器元素上放置 `*ngIf`。

有關更多資訊，請參閱 [每個元素一個結構型指令](guide/directives/structural-directives#one-structural-directive-per-element)。

### 使用 `*ngFor` `trackBy` 追蹤項目

透過追蹤項目清單的變更來減少你的應用程式對伺服器的呼叫次數。
使用 `*ngFor` `trackBy` 屬性，Angular 僅會變更並重新呈現已變更的那些項目，而不是重新載入整個項目清單。

1. 將方法新增至元件，以傳回 `NgFor` 應追蹤的值。
    在此範例中，要追蹤的值是項目 `id`。
    如果瀏覽器已呈現 `id`，Angular 會追蹤它，且不會針對相同 `id` 重新查詢伺服器。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="trackByItems"/>

1. 在簡寫表達式中，將 `trackBy` 設為 `trackByItems()` 方法。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="trackBy"/>

**變更 id** 會建立具有新 `item.id` 的新項目。
在以下 `trackBy` 效果的插圖中，**重設項目** 會建立具有相同 `item.id` 的新項目。

- 沒有 `trackBy`，兩個按鈕都會觸發完整的 DOM 元素替換。
- 使用 `trackBy`，只有變更 `id` 才會觸發元素替換。

<img alt="Animation of trackBy" src="https://angular.dev/assets/images/guide/built-in-directives/ngfor-trackby.gif">

## 無 DOM 元素的指令寄存

Angular `<ng-container>` 是一個分組元素，不會干擾樣式或佈局，因為 Angular 沒有將它放入 DOM 中。

當沒有單一元素可以主導指令時，使用 `<ng-container>`。

以下是使用`<ng-container>`的條件段落。

<docs-code header="src/app/app.component.html (ngif-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="ngif-ngcontainer"/>

<img alt="ngcontainer 段落具有適當樣式" src="https://angular.dev/assets/images/guide/structural-directives/good-paragraph.png">

1. 從 `FormsModule` 匯入 `ngModel` 指令。

1. 將 `FormsModule` 加入相關 Angular 模組的匯入區段。

1. 若要以條件方式排除 `<option>`，請用 `<ng-container>` 包住 `<option>`。

    <docs-code header="src/app/app.component.html (select-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="select-ngcontainer"/>

    <img alt="ngcontainer 選項正常運作" src="https://angular.dev/assets/images/guide/structural-directives/select-ngcontainer-anim.gif">

## 使用 `NgSwitch` 切換案例

<h3>Switch cases with `NgSwitch`</h3>

<p>Here is an example of how to use `NgSwitch` to switch between different views based on the value of a property.</p>

html
<div [ngSwitch]="color">
  <div *ngSwitchCase="'red'">You picked red!</div>
  <div *ngSwitchCase="'blue'">You picked blue!</div>
  <div *ngSwitchCase="'green'">You picked green!</div>
  <div *ngSwitchDefault>Pick a color!</div>
</div>
<p>In this example, the `color` property is bound to the `[ngSwitch]` directive. When the value of the `color` property changes, the `NgSwitch` directive will switch to the corresponding view. For example, if the value of the `color` property is `"red"`, then the view with the `*ngSwitchCase="'red'"` directive will be displayed.</p>

<p>You can also use the `*ngSwitchDefault` directive to specify a default view that will be displayed if none of the other cases match. In this example, the default view is the one with the `*ngSwitchDefault` directive, which displays the message "Pick a color!".</p>

<p>Here is a live example of how to use `NgSwitch` to switch between different views based on the value of a property:</p>

html
<div [ngSwitch]="color">
  <div *ngSwitchCase="'red'">You picked red!</div>
  <div *ngSwitchCase="'blue'">You picked blue!</div>
  <div *ngSwitchCase="'green'">You picked green!</div>
  <div *ngSwitchDefault>Pick a color!</div>
</div>

<button (click)="color = 'red'">Red</button>
<button (click)="color = 'blue'">Blue</button>
<button (click)="color = 'green'">Green</button>
<p>When you click on one of the buttons, the value of the `color` property will change and the `NgSwitch` directive will switch to the corresponding view.</p>

如同 JavaScript 的 `switch` 語句，`NgSwitch` 會根據切換條件，在多個可能的元素中顯示一個元素。
Angular 僅將選取的元素放入 DOM。

<!--todo: API Flagged -->

`NgSwitch` 是一組三個指令：

| `NgSwitch` 指令 | 詳細資料                                                                                                                                                                |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NgSwitch`            | 一個屬性指令，用來改變其同伴指令的行為。                                                                                                                             |
| `NgSwitchCase`        | 當其繫結的值等於切換值時，將其元素加入 DOM，當其繫結的值不等於切換值時，將其元素移除的結構型指令。                                                               |
| `NgSwitchDefault`     | 當沒有選取 `NgSwitchCase` 時，將其元素加入 DOM 的結構型指令。                                                                                                        |

若要使用指令，請將 `NgSwitch`、`NgSwitchCase` 和 `NgSwitchDefault` 新增至元件的 `imports` 清單。

<docs-code header="src/app/app.component.ts (NgSwitch imports)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-switch"/>

### 使用 `NgSwitch`

1. 在元素上，例如 `<div>`，加入繫結到回傳切換值 (如 `feature`) 的表達式的 `[ngSwitch]`。
    雖然此範例中的 `feature` 值為字串，但切換值可以是任何類型。

1. 在案例元素上繫結至 `*ngSwitchCase` 和 `*ngSwitchDefault`。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgSwitch"/>

1. 在父元件中定義 `currentItem`，以便在 `[ngSwitch]` 表達式中使用它。

    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="item"/>

1. 在每個子元件中，加入繫結至父元件的 `currentItem` 的 `item` [輸入屬性](guide/components/inputs)。
    以下兩個程式片段顯示父元件和其中一個子元件。
    其他子元件與 `StoutItemComponent` 相同。

    <docs-code header="在每個子元件中，這裡是 StoutItemComponent" path="adev/src/content/examples/built-in-directives/src/app/item-switch.component.ts" visibleRegion="input"/>

    <img alt="NgSwitch 的動畫" src="https://angular.dev/assets/images/guide/built-in-directives/ngswitch.gif">

`Switch` 指令也可以與內建 HTML 元素和網頁元件一起使用。
例如，您可以將 `<app-best-item>` 切換案例改用 `<div>`，如下所示。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgSwitch-div"/>

## 接下來

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="屬性指令"/>
  <docs-pill href="guide/directives/structural-directives" title="結構指令"/>
  <docs-pill href="guide/directives/directive-composition-api" title="指令組合 API"/>
</docs-pill-row>
