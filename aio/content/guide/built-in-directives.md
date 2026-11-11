# 內建指令

指令是為 Angular 應用程式中的元素加上額外行為的類別。
使用 Angular 的內建指令來管理表單、清單、樣式，以及使用者看到的內容。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際運作範例。

</div>

Angular 指令的不同類型如下：

| 指令類型                                                         | 說明                                                                           |
|:---                                                                                                                                                                                  |:---       |
| [元件](guide/component-overview)                                         | 搭配範本使用。這是最常見的指令類型。                                           |
| [屬性指令](guide/built-in-directives#內建屬性指令)                      | 改變元素、元件或另一個指令的外觀或行為。                                       |
| [結構指令](guide/built-in-directives#內建結構指令)              | 透過新增與移除 DOM 元素來改變 DOM 版面配置。                                   |

本指南介紹內建的[屬性指令](guide/built-in-directives#內建屬性指令)與[結構指令](guide/built-in-directives#內建結構指令)。

<a id="attribute-directives"></a>

## 內建屬性指令

屬性指令會監聽並修改其他 HTML 元素、屬性、性質與元件的行為。

許多 NgModule，例如 [`RouterModule`](guide/router "Routing and Navigation") 與 [`FormsModule`](guide/forms "Forms")，都定義了自己的屬性指令。
最常見的屬性指令如下：

| 常見指令                                               | 說明                                            |
|:---                                                                                                                                                                                  |:---       |
| [`NgClass`](guide/built-in-directives#ngClass) | 新增與移除一組 CSS 類別。             |
| [`NgStyle`](guide/built-in-directives#ngstyle)       | 新增與移除一組 HTML 樣式。             |
| [`NgModel`](guide/built-in-directives#ngModel)         | 為 HTML 表單元素加上雙向資料繫結。 |

<div class="alert is-helpful">

內建指令只使用公開 API。它們並未擁有其他指令無法存取的任何私有 API 的特殊存取權。

</div>

<a id="ngClass"></a>

## 使用 `NgClass` 新增與移除類別

使用 `ngClass` 一次新增或移除多個 CSS 類別。

<div class="alert is-helpful">

若要新增或移除_單一_類別，請使用[類別繫結](guide/class-binding)，而不是 `NgClass`。

</div>

### 搭配運算式使用 `NgClass`

在你想設定樣式的元素上，加入 `[ngClass]` 並把它設為等於一個運算式。
在這個例子中，`isSpecial` 是在 `app.component.ts` 中設為 `true` 的布林值。
因為 `isSpecial` 為 true，`ngClass` 會把 `special` 類別套用到 `<div>`。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="special-div"></code-example>

### 搭配方法使用 `NgClass`

1.  若要搭配方法使用 `NgClass`，請把該方法加入元件類別。
    在下列範例中，`setCurrentClasses()` 會設定屬性 `currentClasses`，其值是一個物件，會根據另外三個元件屬性的 `true` 或 `false` 狀態來新增或移除三個類別。

    物件的每個鍵都是一個 CSS 類別名稱。
    若某個鍵為 `true`，`ngClass` 會新增該類別。
    若某個鍵為 `false`，`ngClass` 會移除該類別。

    <code-example header="src/app/app.component.ts" path="built-in-directives/src/app/app.component.ts" region="setClasses"></code-example>

1. 在範本中，把 `ngClass` 屬性繫結加到 `currentClasses`，以設定元素的類別：

    <code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgClass-1"></code-example>

在這個使用案例中，Angular 會在初始化時以及發生變更時套用這些類別。完整範例會在最初以 `ngOnInit()` 呼叫 `setCurrentClasses()`，並在相依屬性透過按鈕點選變更時再次呼叫。這些步驟對於實作 `ngClass` 而言並非必要。如需更多資訊，請參閱 <live-example></live-example> 的 `app.component.ts` 與 `app.component.html`。

<a id="ngstyle"></a>

## 使用 `NgStyle` 設定行內樣式

使用 `NgStyle`，根據元件的狀態一次設定多個行內樣式。

1.  若要使用 `NgStyle`，請把方法加入元件類別。

    在下列範例中，`setCurrentStyles()` 會設定屬性 `currentStyles`，其值是一個物件，會根據另外三個元件屬性的狀態定義三種樣式。

    <code-example header="src/app/app.component.ts" path="built-in-directives/src/app/app.component.ts" region="setStyles"></code-example>

1. 若要設定元素的樣式，請把 `ngStyle` 屬性繫結加到 `currentStyles`。

    <code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgStyle-2"></code-example>

在這個使用案例中，Angular 會在初始化時以及發生變更時套用這些樣式。為此，完整範例會在最初以 `ngOnInit()` 呼叫 `setCurrentStyles()`，並在相依屬性透過按鈕點選變更時再次呼叫。不過，這些步驟對於單獨實作 `ngStyle` 而言並非必要。關於這個選擇性的實作，請參閱 <live-example></live-example> 的 `app.component.ts` 與 `app.component.html`。

<a id="ngModel"></a>

## 使用 `ngModel` 顯示與更新屬性

使用 `NgModel` 指令來顯示資料屬性，並在使用者變更時更新該屬性。

1.  匯入 `FormsModule`，並把它加入 NgModule 的 `imports` 清單。

    <code-example header="src/app/app.module.ts (FormsModule import)" path="built-in-directives/src/app/app.module.ts" region="import-forms-module"></code-example>

1. 在 HTML `<form>` 元素上加入 `[(ngModel)]` 繫結，並把它設為等於該屬性，這裡是 `name`。

    <code-example header="src/app/app.component.html (NgModel example)" path="built-in-directives/src/app/app.component.html" region="NgModel-1"></code-example>

    這種 `[(ngModel)]` 語法只能設定資料繫結的屬性。

若要自訂設定，請撰寫展開形式，將屬性繫結與事件繫結分開。使用[屬性繫結](guide/property-binding)設定屬性，並使用[事件繫結](guide/event-binding)回應變更。下列範例會把 `<input>` 的值改為大寫：

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="uppercase"></code-example>

以下是所有變化形式的實際運作，包括大寫版本：

<div class="lightbox">

<img alt="NgModel 變化" src="generated/images/guide/built-in-directives/ng-model-anim.gif">

</div>

### `NgModel` 與值存取器

`NgModel` 指令適用於由 [ControlValueAccessor](api/forms/ControlValueAccessor) 支援的元素。
Angular 為所有基本 HTML 表單元素提供了_值存取器_。
如需更多資訊，請參閱[表單](guide/forms)。

若要把 `[(ngModel)]` 套用到非表單的內建元素或第三方自訂元件，你必須撰寫一個值存取器。
如需更多資訊，請參閱 [DefaultValueAccessor](api/forms/DefaultValueAccessor) 的 API 文件。

<div class="alert is-helpful">

當你撰寫 Angular 元件時，如果你依 Angular 的[雙向繫結語法](guide/two-way-binding#雙向繫結如何運作)來命名值與事件屬性，就不需要值存取器或 `NgModel`。

</div>

<a id="structural-directives"></a>

## 內建結構指令

結構指令負責 HTML 版面配置。
它們塑造或重塑 DOM 的結構，通常是透過新增、移除與操作它們所附加的宿主元素來達成。

本節介紹最常見的內建結構指令：

| 常見的內建結構指令                             | 說明                                               |
|:---                                                                                                                                                                                  |:---       |
| [`NgIf`](guide/built-in-directives#ngIf) | 依條件從範本建立或棄置子檢視。                     |
| [`NgFor`](guide/built-in-directives#ngFor)               | 為清單中的每個項目重複一個節點。                   |
| [`NgSwitch`](guide/built-in-directives#ngSwitch)       | 一組在替代檢視之間切換的指令。                     |

如需更多資訊，請參閱[結構指令](guide/structural-directives)。

<a id="ngIf"></a>

## 使用 `NgIf` 新增或移除元素

把 `NgIf` 指令套用到宿主元素，即可新增或移除元素。

當 `NgIf` 為 `false` 時，Angular 會把元素及其後代從 DOM 移除。
接著 Angular 會棄置它們的元件，釋放記憶體與資源。

若要新增或移除元素，請把 `*ngIf` 繫結到條件運算式，例如下列範例中的 `isActive`。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgIf-1"></code-example>

當 `isActive` 運算式傳回真值時，`NgIf` 會把 `ItemDetailComponent` 加入 DOM。當運算式為假值時，`NgIf` 會把 `ItemDetailComponent` 從 DOM 移除，並棄置該元件及其所有子元件。

如需 `NgIf` 與 `NgIfElse` 的更多資訊，請參閱 [NgIf API 文件](api/common/NgIf)。

### 防範 `null`

根據預設，`NgIf` 會防止顯示繫結到 null 值的元素。

若要使用 `NgIf` 保護 `<div>`，請把 `*ngIf="yourProperty"` 加到 `<div>` 上。
在下列範例中，`currentCustomer` 名稱會出現，因為有一個 `currentCustomer`。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgIf-2"></code-example>

然而，如果該屬性是 `null`，Angular 就不會顯示 `<div>`。
在本範例中，Angular 不會顯示 `nullCustomer`，因為它是 `null`。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgIf-2b"></code-example>

<a id="ngFor"></a>

## 使用 `NgFor` 列出項目

使用 `NgFor` 指令來呈現項目清單。

1.  定義一段 HTML，決定 Angular 如何算繪單一項目。
1.  若要列出你的項目，請把簡寫 `let item of items` 指派給 `*ngFor`。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgFor-1"></code-example>

字串 `"let item of items"` 指示 Angular 執行下列事項：

*   把 `items` 陣列中的每個項目存入區域的 `item` 迴圈變數
*   在每次迭代中，讓範本 HTML 都能使用每個項目
*   把 `"let item of items"` 轉譯為宿主元素周圍的 `<ng-template>`
*   為清單中的每個 `item` 重複該 `<ng-template>`

如需更多資訊，請參閱[結構指令](guide/structural-directives)中的[結構指令簡寫](guide/structural-directives#shorthand)一節。

### 重複元件檢視

若要重複一個元件元素，請把 `*ngFor` 套用到選擇器。
在下列範例中，選擇器是 `<app-item-detail>`。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgFor-2"></code-example>

在下列位置參照範本輸入變數，例如 `item`：

*   在 `ngFor` 宿主元素內
*   在宿主元素的後代內，以存取項目的屬性

下列範例先在插值中參照 `item`，再把繫結傳入 `<app-item-detail>` 元件的 `item` 屬性。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgFor-1-2"></code-example>

如需範本輸入變數的更多資訊，請參閱[結構指令簡寫](guide/structural-directives#shorthand)。

### 取得 `*ngFor` 的 `index`

在範本輸入變數中取得 `*ngFor` 的 `index`，並在範本中使用它。

在 `*ngFor` 中，加入分號與 `let i=index` 到簡寫中。
下列範例把 `index` 取得為名為 `i` 的變數，並把它與項目名稱一起顯示。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgFor-3"></code-example>

`NgFor` 指令內容的 index 屬性會傳回每次迭代中項目的零基索引。

Angular 會把這個指令轉譯為宿主元素周圍的 `<ng-template>`，再重複使用這個範本，為清單中的每個 `item` 建立一組新的元素與繫結。
如需關於簡寫的更多資訊，請參閱[結構指令](guide/structural-directives#shorthand)指南。


## 在條件為真時重複元素

若要在特定條件為真時重複一段 HTML，請把 `*ngIf` 放在包住 `*ngFor` 元素的容器元素上。

如需更多資訊，請參閱[每個元素一個結構指令](guide/structural-directives#one-per-element)。

<a id="ngfor-with-trackby"></a>

### 使用 `*ngFor` 的 `trackBy` 追蹤項目

透過追蹤項目清單的變更，減少應用程式向伺服器發出的呼叫次數。使用 `*ngFor` 的 `trackBy` 屬性時，Angular 可以只變更並重新算繪已變更的項目，而不必重新載入整個項目清單。

1.  在元件中加入一個方法，傳回 `NgFor` 應該追蹤的值。
    在本範例中，要追蹤的值是項目的 `id`。
    若瀏覽器已經算繪過該 `id`，Angular 會持續追蹤它，不會為了相同的 `id` 再次向伺服器查詢。

    <code-example header="src/app/app.component.ts" path="built-in-directives/src/app/app.component.ts" region="trackByItems"></code-example>

1. 在簡寫運算式中，把 `trackBy` 設為 `trackByItems()` 方法。

    <code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="trackBy"></code-example>

**Change ids** 會建立具有新 `item.id` 的新項目。在下列 `trackBy` 效果的圖示中，**Reset items** 會建立具有相同 `item.id` 的新項目。

*   沒有 `trackBy` 時，兩個按鈕都會觸發完整的 DOM 元素取代。
*   使用 `trackBy` 時，只有變更 `id` 才會觸發元素取代。

<div class="lightbox">

<img alt="trackBy 動畫" src="generated/images/guide/built-in-directives/ngfor-trackby.gif">

</div>

<a id="ngcontainer"></a>

## 在沒有 DOM 元素的情況下裝載指令

Angular 的 `<ng-container>` 是一個群組元素，不會干擾樣式或版面配置，因為 Angular 不會把它放入 DOM。

當沒有單一元素可以裝載指令時，請使用 `<ng-container>`。

以下是一個使用 `<ng-container>` 的條件段落。

<code-example header="src/app/app.component.html (ngif-ngcontainer)" path="structural-directives/src/app/app.component.html" region="ngif-ngcontainer"></code-example>

<div class="lightbox">

<img alt="具正確樣式的 ng-container 段落" src="generated/images/guide/structural-directives/good-paragraph.png">

</div>

1. 從 `FormsModule` 匯入 `ngModel` 指令。

1. 把 `FormsModule` 加入相關 Angular 模組的 imports 區段。

1. 若要依條件排除某個 `<option>`，請把 `<option>` 包在 `<ng-container>` 裡。

    <code-example header="src/app/app.component.html (select-ngcontainer)" path="structural-directives/src/app/app.component.html" region="select-ngcontainer"></code-example>

    <div class="lightbox">

    <img alt="ng-container 選項正常運作" src="generated/images/guide/structural-directives/select-ngcontainer-anim.gif">

    </div>

<a id="ngSwitch"></a>

## 使用 `NgSwitch` 切換案例

和 JavaScript 的 `switch` 陳述式一樣，`NgSwitch` 會根據切換條件，從數個可能的元素中顯示一個元素。Angular 只會把選取的元素放入 DOM。

<!--todo: API Flagged -->

`NgSwitch` 是一組三個指令：

| `NgSwitch` 指令 | 詳細資訊 |
|:---                   |:---     |
| `NgSwitch`            | 一個屬性指令，會改變其同伴指令的行為。                                                                                          |
| `NgSwitchCase`        | 結構指令，當其繫結值等於切換值時把元素加入 DOM，當其繫結值不等於切換值時把元素移除。 |
| `NgSwitchDefault`     | 結構指令，當沒有選取的 `NgSwitchCase` 時把元素加入 DOM。                                                                        |

1.  在某個元素（例如 `<div>`）上，加入繫結到會傳回切換值的運算式（例如 `feature`）的 `[ngSwitch]`。
    雖然本範例中的 `feature` 值是字串，但切換值可以是任何型別。

1.  在案例的元素上繫結 `*ngSwitchCase` 與 `*ngSwitchDefault`。

    <code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgSwitch"></code-example>

1. 在父元件中定義 `currentItem`，用在 `[ngSwitch]` 運算式中。

    <code-example header="src/app/app.component.ts" path="built-in-directives/src/app/app.component.ts" region="item"></code-example>

1.  在每個子元件中，加入一個 `item` [輸入屬性](guide/inputs-outputs#input "Input property")，它會繫結到父元件的 `currentItem`。
    下列兩個片段分別展示了父元件與其中一個子元件。
    其他子元件與 `StoutItemComponent` 相同。

    <code-example header="In each child component, here StoutItemComponent" path="built-in-directives/src/app/item-switch.component.ts" region="input"></code-example>

    <div class="lightbox">

    <img alt="NgSwitch 動畫" src="generated/images/guide/built-in-directives/ngswitch.gif">

    </div>

切換指令也可以搭配內建 HTML 元素與 Web 元件使用。
例如，你可以把 `<app-best-item>` 切換案例換成 `<div>`，如下所示。

<code-example header="src/app/app.component.html" path="built-in-directives/src/app/app.component.html" region="NgSwitch-div"></code-example>

## 後續步驟

關於如何建立自己的自訂指令的資訊，請參閱[屬性指令](guide/attribute-directives)與[結構指令](guide/structural-directives)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
