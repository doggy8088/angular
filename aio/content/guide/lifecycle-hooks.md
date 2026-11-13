# 生命週期鉤子

元件實例有一個生命週期，從 Angular 具現化元件類別、並渲染元件檢視及其子檢視時開始。
生命週期隨著變更偵測繼續進行，Angular 會檢查資料繫結屬性何時變更，並依需要更新檢視與元件實例。
生命週期在 Angular 銷毀元件實例、並將其渲染的範本從 DOM 移除時結束。
指令也有類似的生命週期，Angular 會在執行過程中建立、更新與銷毀實例。

你的應用程式可以使用[生命週期鉤子方法](guide/glossary#生命週期掛鉤lifecycle-hook "Definition of lifecycle hook")，在元件或指令生命週期的關鍵事件中介入，以初始化新實例、在需要時啟動變更偵測、回應變更偵測期間的更新，以及在實例刪除之前進行清理。

## 先備知識

在使用生命週期鉤子之前，你應該對下列內容有基本了解：

*   [TypeScript 程式設計](https://www.typescriptlang.org)
*   Angular 應用程式設計基礎，如 [Angular 概念](guide/architecture "Introduction to fundamental app-design concepts")所述

<a id="hooks-overview"></a>

## 回應生命週期事件

若要回應元件或指令生命週期中的事件，請實作 Angular `core` 程式庫中的一或多個*生命週期鉤子*介面。
這些鉤子讓你有機會在適當的時機，對元件或指令實例採取行動，也就是 Angular 建立、更新或銷毀該實例的時候。

每個介面為單一鉤子方法定義原型，其名稱是介面名稱加上 `ng` 前綴。
例如，`OnInit` 介面有一個名為 `ngOnInit()` 的鉤子方法。
如果你在元件或指令類別中實作這個方法，Angular 會在第一次檢查該元件或指令的輸入屬性後不久呼叫它。

<code-example header="peek-a-boo.directive.ts (excerpt)" path="lifecycle-hooks/src/app/peek-a-boo.directive.ts" region="ngOnInit"></code-example>

你不需要實作所有（或任何）生命週期鉤子，只需要實作你需要的那些。

<a id="hooks-purpose-timing"></a>

### 生命週期事件順序

在你的應用程式透過呼叫建構函式具現化元件或指令之後，Angular 會在該實例生命週期的適當時機，呼叫你已實作的鉤子方法。

Angular 會依下列順序執行鉤子方法。
請用它們來執行下列各類操作。

| 鉤子方法 | 用途 | 時機 |
|:---                       |:---                                                                                                                                                                                                                                                                                                                                                    |:---    |
| `ngOnChanges()`           | 在 Angular 設定或重設資料繫結輸入屬性時回應。這個方法會收到一個包含目前與先前屬性值的 `SimpleChanges` 物件。 <br /> <div class="alert is-helpful"> **NOTE**: <br /> 這種情況經常發生，因此你在這裡執行的任何操作都會顯著影響效能。 </div> 詳情請見本文件中的[使用變更偵測鉤子](#onchanges)。 | 在 `ngOnInit()` 之前呼叫（如果元件有繫結的輸入），以及每當一個或多個資料繫結輸入屬性變更時呼叫。 <br /> <div class="alert is-helpful"> **NOTE**: <br /> 如果你的元件沒有輸入，或你使用它時沒有提供任何輸入，框架不會呼叫 `ngOnChanges()`。 </div> |
| `ngOnInit()`              | 在 Angular 首次顯示資料繫結屬性、並設定指令或元件的輸入屬性之後，初始化指令或元件。詳情請見本文件中的[初始化元件或指令](#oninit)。                                                                                                                 | 呼叫一次，在第一次 `ngOnChanges()` 之後。即使 `ngOnChanges()` 未被呼叫（也就是沒有範本繫結輸入時），`ngOnInit()` 仍會被呼叫。                                                                                              |
| `ngDoCheck()`             | 偵測並處理 Angular 自身無法或不會偵測的變更。詳情與範例請見本文件中的[定義自訂變更偵測](#docheck)。                                                                                                                                                                                   | 在每次變更偵測執行時，緊接在 `ngOnChanges()` 之後呼叫；在第一次執行時，緊接在 `ngOnInit()` 之後呼叫。                                                                                                                                            |
| `ngAfterContentInit()`    | 在 Angular 將外部內容投影到元件的檢視、或指令所在的檢視之後回應。 <br /> 詳情與範例請見本文件中的[回應內容的變更](#aftercontent)。                                                                                                                              | 在第一次 `ngDoCheck()` 之後呼叫*一次*。                                                                                                                                                                                                                            |
| `ngAfterContentChecked()` | 在 Angular 檢查投影到指令或元件中的內容之後回應。 <br /> 詳情與範例請見本文件中的[回應投影內容的變更](#aftercontent)。                                                                                                                                                       | 在 `ngAfterContentInit()` 之後、以及其後的每一次 `ngDoCheck()` 之後呼叫。                                                                                                                                                                                                 |
| `ngAfterViewInit()`       | 在 Angular 初始化元件的檢視與子檢視、或包含指令的檢視之後回應。 <br /> 詳情與範例請見本文件中的[回應檢視變更](#afterview)。                                                                                                                                         | 在第一次 `ngAfterContentChecked()` 之後呼叫*一次*。                                                                                                                                                                                                 |
| `ngAfterViewChecked()`    | 在 Angular 檢查元件的檢視與子檢視、或包含指令的檢視之後回應。                                                                                                                                                                                                                                           | 在 `ngAfterViewInit()` 之後、以及其後的每一次 `ngAfterContentChecked()` 之後呼叫。                                                                                                                    |
| `ngOnDestroy()`           | 在 Angular 銷毀指令或元件之前進行清理。取消訂閱 Observable 並分離事件處理常式，以避免記憶體洩漏。詳情請見本文件中的[在實例銷毀時清理](#ondestroy)。                                                                                                                           | 在 Angular 銷毀指令或元件之前立即呼叫。                                                                                                                                                                                                  |

<a id="the-sample"></a>

### 生命週期範例集

<live-example></live-example> 透過一系列練習展示生命週期鉤子的使用，這些練習以元件形式呈現，由根元件 `AppComponent` 控制。
在每個案例中，一個*父元件*作為測試台，測試一個展示一或多個生命週期鉤子方法的*子元件*。

下表列出這些練習與簡要說明。
範例程式碼也在以下各節中用來說明特定任務。

| 元件 | 詳細資訊 |
|:---                           |:---     |
| [Peek-a-boo](#peek-a-boo)     | 展示每一個生命週期鉤子。每個鉤子方法都會寫入螢幕上的記錄。 |
| [Spy](#spy)                   | 展示如何將生命週期鉤子與自訂指令搭配使用。`SpyDirective` 實作了 `ngOnInit()` 與 `ngOnDestroy()` 鉤子，並用它們來監看與回報元素何時進入或離開目前的檢視。 |
| [OnChanges](#onchanges)       | 展示 Angular 如何在元件輸入屬性每次變更時呼叫 `ngOnChanges()` 鉤子，並說明如何解讀傳給鉤子方法的 `changes` 物件。 |
| [DoCheck](#docheck)           | 以自訂變更偵測實作 `ngDoCheck()` 方法。觀察鉤子將變更寫入記錄，看看 Angular 呼叫這個鉤子的頻率。 |
| [AfterView](#afterview)       | 說明 Angular 所說的[檢視](guide/glossary#檢視view "Definition of view.")是什麼意思。展示 `ngAfterViewInit()` 與 `ngAfterViewChecked()` 鉤子。 |
| [AfterContent](#aftercontent) | 展示如何將外部內容投影到元件中，以及如何區分投影內容與元件的檢視子元件。展示 `ngAfterContentInit()` 與 `ngAfterContentChecked()` 鉤子。 |
| [Counter](#counter)           | 展示元件與指令的組合，各自有自己的鉤子。 |

<a id="oninit"></a>

## 初始化元件或指令

使用 `ngOnInit()` 方法來執行以下初始化任務。

| 初始化任務 | 詳細資訊 |
|:---                                                          |:---     |
| 在建構函式之外執行複雜的初始化   | 元件的建構應該便宜又安全。例如，你不應該在元件建構函式中擷取資料。你不需要擔心新元件在測試中建立、或在你決定顯示它之前，會試圖聯繫遠端伺服器。 <br /> `ngOnInit()` 是元件擷取初始資料的好地方。範例請見 [Tour of Heroes 教學](tutorial/toh-pt4#oninit)。 |
| 在 Angular 設定輸入屬性之後設定元件 | 建構函式應該只將初始區域變數設定為簡單的值。 <br /> 請記住，指令的資料繫結輸入屬性要到*建構之後*才會被設定。如果你需要根據這些屬性來初始化指令，請在 `ngOnInit()` 執行時設定它們。 <div class="alert is-helpful"> `ngOnChanges()` 方法是你第一次存取這些屬性的機會。Angular 會在 `ngOnInit()` 之前呼叫 `ngOnChanges()`，但之後也會多次呼叫它。它只會呼叫 `ngOnInit()` 一次。 </div> |

<a id="ondestroy"></a>

## 在實例銷毀時清理

將清理邏輯放在 `ngOnDestroy()` 中，這是 Angular 銷毀指令之前必須執行的邏輯。

這裡是釋放不會被自動垃圾回收的資源的地方。
如果你忽略這一點，就有記憶體洩漏的風險。

*   取消訂閱 Observable 與 DOM 事件
*   停止間隔計時器
*   取消註冊指令向全域或應用程式服務註冊的所有回呼

`ngOnDestroy()` 方法也是通知應用程式另一部分「元件即將消失」的時機。

## 一般範例

以下範例展示了各種生命週期事件的呼叫順序與相對頻率，以及鉤子如何分別或共同用於元件與指令。

<a id="peek-a-boo"></a>

### 所有生命週期事件的順序與頻率

為了展示 Angular 如何依預期順序呼叫鉤子，`PeekABooComponent` 在一個元件中展示了所有的鉤子。

實務上，你幾乎不會像這個展示這樣實作所有的介面。

以下快照反映了使用者點選 **Create&hellip;** 按鈕、再點選 **Destroy&hellip;** 按鈕之後的記錄狀態。

<div class="lightbox">

<img alt="Peek-a-boo 範例" src="generated/images/guide/lifecycle-hooks/peek-a-boo.png">

</div>

記錄訊息的順序遵循規定的鉤子呼叫順序：

| 鉤子順序 | 記錄訊息 |
|:---        |:---                   |
| 1          | `OnChanges`           |
| 2          | `OnInit`              |
| 3          | `DoCheck`             |
| 4          | `AfterContentInit`    |
| 5          | `AfterContentChecked` |
| 6          | `AfterViewInit`       |
| 7          | `AfterViewChecked`    |
| 8          | `DoCheck`             |
| 9          | `AfterContentChecked` |
| 10         | `AfterViewChecked`    |
| 11         | `OnDestroy`           |


<div class="alert is-helpful">

請注意，記錄確認了輸入屬性（在這個案例中是 `name` 屬性）在建構時還沒有被賦值。
輸入屬性在 `onInit()` 方法中可用，供進一步初始化使用。

</div>

如果使用者點選了 *Update Hero* 按鈕，記錄會再顯示一個 `OnChanges`，以及另外兩組 `DoCheck`、`AfterContentChecked` 與 `AfterViewChecked`。
請注意，這三個鉤子觸發得*非常頻繁*，因此保持它們的邏輯盡可能精簡很重要。

<a id="spy"></a>

### 使用指令監看 DOM

`Spy` 範例展示如何將鉤子方法用於指令以及元件。
`SpyDirective` 實作了兩個鉤子 `ngOnInit()` 與 `ngOnDestroy()`，來發現被監看的元素何時出現在目前的檢視中。

這個範本將 `SpyDirective` 套用到父元件 `SpyComponent` 管理的 `ngFor` *hero* 重複器中的 `<div>` 上。

這個範例不執行任何初始化或清理。
它只是透過記錄指令本身何時被具現化與銷毀，來追蹤元素在檢視中的出現與消失。

像這樣的間諜指令可以讓你深入了解無法直接變更的 DOM 物件。
你無法存取內建 `<div>` 的實作，也無法修改第三方元件。
但你確實可以選擇用指令來監看這些元素。

這個指令定義了 `ngOnInit()` 與 `ngOnDestroy()` 鉤子，
使用注入的 `LoggerService` 將訊息記錄到父元件。

<code-example header="src/app/spy.directive.ts" path="lifecycle-hooks/src/app/spy.directive.ts" region="spy-directive"></code-example>

將間諜套用到任何內建或元件元素上，你會看到它與該元素同時初始化與銷毀。
這裡它附加到重複的英雄 `<p>` 上：

<code-example header="src/app/spy.component.html" path="lifecycle-hooks/src/app/spy.component.html" region="template"></code-example>

每個間諜的建立與銷毀，都會在 *Hook Log* 中留下一筆記錄，標記所附加英雄 `<p>` 的出現與消失。
新增英雄會產生一個新的英雄 `<p>`。
間諜的 `ngOnInit()` 會記錄該事件。

*Reset* 按鈕會清除 `heroes` 清單。
Angular 會同時從 DOM 移除所有英雄 `<p>` 元素，並銷毀它們的間諜指令。
間諜的 `ngOnDestroy()` 方法會回報它的最後時刻。

<a id="counter"></a>

### 同時使用元件與指令的鉤子

在這個範例中，`CounterComponent` 使用 `ngOnChanges()` 方法，在父元件每次遞增其輸入 `counter` 屬性時記錄一次變更。

這個範例將前一個範例的 `SpyDirective` 套用到 `CounterComponent` 的記錄上，以監看記錄項目的建立與銷毀。

<a id="onchanges"></a>

<a id="using-change-detection-hooks"></a>
## 使用變更偵測鉤子

每當 Angular 偵測到***輸入屬性***的變更時，就會呼叫元件或指令的 `ngOnChanges()` 方法。
*onChanges* 範例透過監控 `OnChanges()` 鉤子來展示這一點。

<code-example header="on-changes.component.ts (excerpt)" path="lifecycle-hooks/src/app/on-changes.component.ts" region="ng-on-changes"></code-example>

`ngOnChanges()` 方法接受一個物件，將每個變更的屬性名稱對應到一個 [SimpleChange](api/core/SimpleChange) 物件，該物件持有目前與先前的屬性值。
這個鉤子會逐一走訪變更的屬性並記錄它們。

範例元件 `OnChangesComponent` 有兩個輸入屬性：`hero` 與 `power`。

<code-example header="src/app/on-changes.component.ts" path="lifecycle-hooks/src/app/on-changes.component.ts" region="inputs"></code-example>

主元件 `OnChangesParentComponent` 按如下方式繫結它們。

<code-example header="src/app/on-changes-parent.component.html" path="lifecycle-hooks/src/app/on-changes-parent.component.html" region="on-changes"></code-example>

以下是使用者進行變更時，範例的實際運作情形。

<div class="lightbox">

<img alt="OnChanges 鉤子" src="generated/images/guide/lifecycle-hooks/on-changes-anim.gif">

</div>

當 *power* 屬性的字串值變更時，就會出現記錄項目。
但請注意，`ngOnChanges()` 方法不會捕捉 `hero.name` 的變更。
這是因為 Angular 只在輸入屬性的值變更時才呼叫這個鉤子。
在這個案例中，`hero` 是輸入屬性，而 `hero` 屬性的值是*指向英雄物件的參照*。
當其本身 `name` 屬性的值變更時，物件參照並沒有改變。

<a id="afterview"></a>

### 回應檢視變更

當 Angular 在變更偵測期間走訪[檢視階層](guide/glossary#檢視階層view-hierarchy "Definition of view hierarchy definition")時，它必須確保子元件的變更不會試圖造成其父元件的變更。
由於[單向資料流](guide/glossary#單向資料流unidirectional-data-flow "Definition")的運作方式，這樣的變更無法正確渲染。

如果你需要進行一項會顛覆預期資料流的變更，你必須觸發新的變更偵測週期，才能讓該變更被渲染。
這些範例說明如何安全地進行這類變更。

*AfterView* 範例探討 Angular 在建立元件的子檢視*之後*呼叫的 `AfterViewInit()` 與 `AfterViewChecked()` 鉤子。

以下是一個在 `<input>` 中顯示英雄名稱的子檢視：

<code-example header="ChildViewComponent" path="lifecycle-hooks/src/app/child-view.component.ts" region="child-view"></code-example>

`AfterViewComponent` 在*其範本內*顯示這個子檢視：

<code-example header="AfterViewComponent (template)" path="lifecycle-hooks/src/app/after-view.component.ts" region="template"></code-example>

以下鉤子會根據*子檢視內*變更的值採取行動，而子檢視只能透過查詢以 [@ViewChild](api/core/ViewChild) 裝飾的屬性來取得。

<code-example header="AfterViewComponent (class excerpts)" path="lifecycle-hooks/src/app/after-view.component.ts" region="hooks"></code-example>

<a id="wait-a-tick"></a>

#### 更新檢視前先等待

在這個範例中，當英雄名稱超過 10 個字元時，`doSomething()` 方法會更新畫面，但在更新 `comment` 之前會先等待一個 tick。

<code-example header="AfterViewComponent (doSomething)" path="lifecycle-hooks/src/app/after-view.component.ts" region="do-something"></code-example>

`AfterViewInit()` 與 `AfterViewChecked()` 鉤子都會在元件的檢視組成之後觸發。
如果你修改程式碼，讓鉤子立即更新元件資料繫結的 `comment` 屬性，你會看到 Angular 拋出錯誤。

`LoggerService.tick_then()` 陳述式會將記錄更新延後一個瀏覽器 JavaScript 週期，從而觸發新的變更偵測週期。

#### 撰寫精簡的鉤子方法以避免效能問題

當你執行 *AfterView* 範例時，請注意 Angular 呼叫 `AfterViewChecked()` 的頻率——通常是在沒有值得關注的變更時。
請小心你在這些方法中放入多少邏輯或運算。

<div class="lightbox">

<img alt="AfterView 鉤子" src="generated/images/guide/lifecycle-hooks/after-view-anim.gif">

</div>

<a id="aftercontent"></a>
<a id="aftercontent-hooks"></a>

<a id="content-projection"></a>

### 回應投影內容的變更

*內容投影*是一種從元件外部匯入 HTML 內容、並將該內容插入元件範本中指定位置的方式。
你可以透過尋找下列結構，來辨識範本中的內容投影。

*   元件元素標籤之間的 HTML
*   元件範本中 `<ng-content>` 標籤的存在

<div class="alert is-helpful">

AngularJS 開發者稱這種技術為 *transclusion*（轉置）。

</div>

*AfterContent* 範例探討 Angular 在將外部內容投影到元件之後呼叫的 `AfterContentInit()` 與 `AfterContentChecked()` 鉤子。

請看[前一個 *AfterView*](#afterview)範例的這個變化版本。
這一次，它不是將子檢視包含在範本內，而是從 `AfterContentComponent` 鉤子的父元件匯入內容。
以下是父元件的範本。

<code-example header="AfterContentParentComponent (template excerpt)" path="lifecycle-hooks/src/app/after-content-parent.component.ts" region="parent-template"></code-example>

請注意，`<app-child>` 標籤夾在 `<after-content>` 標籤之間。
絕對不要在元件的元素標籤之間放置內容，*除非你打算將該內容投影到元件中*。

現在來看看元件的範本。

<code-example header="AfterContentComponent (template)" path="lifecycle-hooks/src/app/after-content.component.ts" region="template"></code-example>

`<ng-content>` 標籤是外部內容的*預留位置*。
它告訴 Angular 要在哪裡插入該內容。
在這個案例中，投影的內容是來自父元件的 `<app-child>`。

<div class="lightbox">

<img alt="投影內容" src="generated/images/guide/lifecycle-hooks/projected-child-view.png">

</div>

#### 使用 AfterContent 鉤子

*AfterContent* 鉤子與 *AfterView* 鉤子類似。
關鍵差異在於子元件。

*   *AfterView* 鉤子關心的是 `ViewChildren`，也就是元素標籤出現在元件範本*內*的子元件
*   *AfterContent* 鉤子關心的是 `ContentChildren`，也就是 Angular 投影到元件中的子元件

以下 *AfterContent* 鉤子會根據*內容子元件*中變更的值採取行動，而內容子元件只能透過查詢以 [@ContentChild](api/core/ContentChild) 裝飾的屬性來取得。

<code-example header="AfterContentComponent (class excerpts)" path="lifecycle-hooks/src/app/after-content.component.ts" region="hooks"></code-example>

<a id="no-unidirectional-flow-worries"></a>

<div class="callout is-helpful">

<header>不需要等待內容更新</header>

這個元件的 `doSomething()` 方法會立即更新元件資料繫結的 `comment` 屬性。
不需要[延遲更新以確保正確渲染](#wait-a-tick "Delaying updates")。

Angular 會在呼叫任一個 *AfterView* 鉤子之前，先呼叫兩個 *AfterContent* 鉤子。
Angular 會在完成這個元件檢視的組成*之前*，先完成投影內容的組成。
在 `AfterContent...` 與 `AfterView...` 鉤子之間有一個短暫的空檔，讓你可以修改主元件的檢視。

</div>

<a id="docheck"></a>

<a id="defining-custom-change-detection"></a>
## 定義自訂變更偵測

若要監控 `ngOnChanges()` 無法捕捉的變更，請如 *DoCheck* 範例所示，實作你自己的變更檢查。
這個範例展示如何使用 `ngDoCheck()` 鉤子，來偵測並處理 Angular 自身無法捕捉的變更。

*DoCheck* 範例以以下 `ngDoCheck()` 鉤子擴充了 *OnChanges* 範例：

<code-example header="DoCheckComponent (ngDoCheck)" path="lifecycle-hooks/src/app/do-check.component.ts" region="ng-do-check"></code-example>

這段程式碼會檢查某些*關注的值*，擷取並比較它們目前的狀態與先前的狀態。
當 `hero` 或 `power` 沒有實質變更時，它會在記錄中寫入一則特殊訊息，讓你看到 `DoCheck()` 被呼叫的頻率。
結果很有啟發性。

<div class="lightbox">

<img alt="DoCheck 鉤子" src="generated/images/guide/lifecycle-hooks/do-check-anim.gif">

</div>

雖然 `ngDoCheck()` 鉤子可以偵測英雄的 `name` 何時變更，但它是一個昂貴的鉤子。
這個鉤子被呼叫的頻率極高 &mdash;在*每一次*變更偵測週期之後都會被呼叫，無論變更發生在哪裡。
在使用者能夠做任何事之前，這個範例中它就被呼叫了二十多次。

這些初始檢查大多是由 Angular 首次渲染*頁面上其他地方的無關資料*所觸發。
光是將游標移到另一個 `<input>` 就會觸發一次呼叫。
相對較少的呼叫會顯示相關資料的實際變更。
如果你使用這個鉤子，你的實作必須極為輕量，否則使用者體驗會受到影響。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
