# 生命週期鉤子

元件有一個由 Angular 管理的生命週期。

Angular 建立它、渲染它、建立並渲染它的子元件，在它的資料繫結屬性變更時檢查它，並在將它從 DOM 移除之前銷毀它。

Angular 提供**生命週期鉤子**，讓你能洞悉這些關鍵的生命時刻，並在它們發生時採取行動。

指令也有同一組生命週期鉤子。

{@a hooks-overview}

## 元件生命週期鉤子總覽

指令與元件實例有一個生命週期，Angular 會建立、更新與銷毀它們。開發者可以實作 Angular `core` 程式庫中的一或多個*生命週期鉤子*介面，介入該生命週期的關鍵時刻。

每個介面有一個單一的鉤子方法，其名稱是介面名稱加上 `ng` 前綴。例如，`OnInit` 介面有一個名為 `ngOnInit()` 的鉤子方法，Angular 會在建立元件後不久呼叫它：

<code-example path="lifecycle-hooks/src/app/peek-a-boo.component.ts" region="ngOnInit" header="peek-a-boo.component.ts (excerpt)" linenums="false"></code-example>

沒有指令或元件會實作所有的生命週期鉤子。Angular 只會在指令／元件的鉤子方法*有定義時*才呼叫它。

{@a hooks-purpose-timing}

## 生命週期順序

Angular 透過呼叫其建構函式建立元件／指令*之後*，會在特定時刻依下列順序呼叫生命週期鉤子方法：

<table width="100%">
  <col width="20%"></col>
  <col width="80%"></col>
  <tr>
    <th>鉤子</th>
    <th>用途與時機</th>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnChanges()</code>
    </td>
    <td>

      在 Angular（重新）設定資料繫結輸入屬性時回應。
      這個方法會收到一個包含目前與先前屬性值的 `SimpleChanges` 物件。

      在 `ngOnInit()` 之前呼叫，以及每當一個或多個資料繫結輸入屬性變更時呼叫。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnInit()</code>
    </td>
    <td>

      在 Angular 首次顯示資料繫結屬性、並設定指令／元件的輸入屬性之後，初始化指令／元件。

      呼叫_一次_，在第一次 `ngOnChanges()` 之後。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngDoCheck()</code>
    </td>
    <td>

      偵測並處理 Angular 自身無法或不會偵測的變更。

      在每次變更偵測執行期間呼叫，緊接在 `ngOnChanges()` 與 `ngOnInit()` 之後。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentInit()</code>
    </td>
    <td>

      在 Angular 將外部內容投影到元件的檢視／指令所在的檢視之後回應。

      在第一次 `ngDoCheck()` 之後呼叫_一次_。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentChecked()</code>
    </td>
    <td>

      在 Angular 檢查投影到指令／元件中的內容之後回應。

      在 `ngAfterContentInit()` 之後、以及其後的每一次 `ngDoCheck()` 之後呼叫。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewInit()</code>
    </td>
    <td>

      在 Angular 初始化元件的檢視與子檢視／指令所在的檢視之後回應。

      在第一次 `ngAfterContentChecked()` 之後呼叫_一次_。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewChecked()</code>
    </td>
    <td>

      在 Angular 檢查元件的檢視與子檢視／指令所在的檢視之後回應。

      在 `ngAfterViewInit()` 之後、以及其後的每一次 `ngAfterContentChecked()` 之後呼叫。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnDestroy()</code>
    </td>
    <td>

      在 Angular 銷毀指令／元件之前進行清理。
      取消訂閱 Observable 並分離事件處理常式，以避免記憶體洩漏。

      在 Angular 銷毀指令／元件_之前立即_呼叫。

    </td>
  </tr>
</table>

{@a interface-optional}

## 介面是選擇性的（技術上）

從純技術的觀點來看，介面對 JavaScript 與 TypeScript 開發者而言是選擇性的。
JavaScript 語言沒有介面。
Angular 在執行期看不到 TypeScript 介面，因為它們會從轉譯後的 JavaScript 中消失。

幸運的是，它們並非必要。
你不需要把生命週期鉤子介面加到指令與元件上，也能享有鉤子本身帶來的好處。

Angular 改為檢查指令與元件類別，並在鉤子方法*有定義時*呼叫它們。
Angular 會尋找並呼叫像是 `ngOnInit()` 這樣的方法，不論有沒有介面。

盡管如此，將介面加到 TypeScript 指令類別上仍是良好的做法，以享有強型別與編輯器工具的好處。

{@a other-lifecycle-hooks}

## 其他 Angular 生命週期鉤子

其他 Angular 子系統可能有自己的生命週期鉤子，獨立於這些元件鉤子之外。

第三方程式庫也可能實作它們自己的鉤子，讓開發者更能掌控這些程式庫的使用方式。

{@a the-sample}

## 生命週期範例

<live-example></live-example>
透過一系列練習，展示生命週期鉤子的實際運作，這些練習以元件形式呈現，由根元件 `AppComponent` 控制。

它們遵循一個共同模式：一個*父元件*作為測試台，測試一個展示一或多個生命週期鉤子方法的*子元件*。

以下是每個練習的簡要說明：

<table width="100%">
  <col width="20%"></col>
  <col width="80%"></col>
  <tr>
    <th>元件</th>
    <th>說明</th>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#peek-a-boo">Peek-a-boo</a>
    </td>
    <td>

      展示每一個生命週期鉤子。
      每個鉤子方法都會寫入螢幕上的記錄。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#spy">Spy</a>
    </td>
    <td>

      指令也有生命週期鉤子。
      `SpyDirective` 可以使用 `ngOnInit` 與 `ngOnDestroy` 鉤子，記錄它所監看的元素何時被建立或銷毀。

      這個範例將 `SpyDirective` 套用到父元件 `SpyComponent` 管理的 `ngFor` *hero* 重複器中的 `<div>` 上。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#onchanges">OnChanges</a>
    </td>
    <td>

      了解 Angular 如何在元件輸入屬性每次變更時，以 `changes` 物件呼叫 `ngOnChanges()` 鉤子。
      並說明如何解讀 `changes` 物件。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#docheck">DoCheck</a>
    </td>
    <td>

      以自訂變更偵測實作一個 `ngDoCheck()` 方法。
      看看 Angular 呼叫這個鉤子的頻率，並觀察它將變更寫入記錄。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#afterview">AfterView</a>
    </td>
    <td>

      說明 Angular 所說的*檢視*是什麼意思。
      展示 `ngAfterViewInit` 與 `ngAfterViewChecked` 鉤子。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#aftercontent">AfterContent</a>
    </td>
    <td>

      展示如何將外部內容投影到元件中，
      以及如何區分投影內容與元件的檢視子元件。
      展示 `ngAfterContentInit` 與 `ngAfterContentChecked` 鉤子。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      Counter
    </td>
    <td>

      展示元件與指令的組合，各自有自己的鉤子。

      在這個範例中，`CounterComponent` 會在父元件每次遞增其輸入 counter 屬性時，記錄一次變更（透過 `ngOnChanges`）。
      同時，前一個範例的 `SpyDirective` 被套用到 `CounterComponent` 的記錄上，在那裡監看記錄項目的建立與銷毀。

    </td>
  </tr>
</table>

本頁其餘部分會更詳細地討論選定的練習。

{@a peek-a-boo}

## Peek-a-boo：所有鉤子

`PeekABooComponent` 在一個元件中展示所有的鉤子。

你幾乎不會像這樣實作所有的介面。
peek-a-boo 的存在是為了展示 Angular 如何依預期順序呼叫鉤子。

以下快照反映了使用者點選 *Create...* 按鈕、再點選 *Destroy...* 按鈕之後的記錄狀態。

<figure>
  <img src="generated/images/guide/lifecycle-hooks/peek-a-boo.png" alt="Peek-a-boo">
</figure>

記錄訊息的順序遵循規定的鉤子呼叫順序：
`OnChanges`、`OnInit`、`DoCheck`&nbsp;(3x)、`AfterContentInit`、`AfterContentChecked`&nbsp;(3x)、
`AfterViewInit`、`AfterViewChecked`&nbsp;(3x) 與 `OnDestroy`。

<div class="alert is-helpful">

  建構函式本身並不是 Angular 鉤子。
  記錄確認了輸入屬性（在這個案例中是 `name` 屬性）在建構時還沒有被賦值。

</div>

如果使用者點選了 *Update Hero* 按鈕，記錄會再顯示一個 `OnChanges`，以及另外兩組 `DoCheck`、`AfterContentChecked` 與 `AfterViewChecked`。
很明顯，這三個鉤子觸發得*非常頻繁*。請保持這些鉤子中的邏輯盡可能精簡！

接下來的範例聚焦於鉤子的細節。


{@a spy}

## 監看 *OnInit* 與 *OnDestroy*

利用這兩個間諜鉤子進行臥底行動，找出元素何時被初始化或銷毀。

這是為指令量身打造的滲透任務。
英雄們永遠不會知道自己被監看著。

<div class="alert is-helpful">

  言歸正傳，請注意兩個重點：

  1. Angular 會為*指令*以及元件呼叫鉤子方法。<br><br>

  2. 間諜指令可以讓你深入了解無法直接變更的 DOM 物件。
  顯然，你不能動原生 `<div>` 的實作。
  你也不能修改第三方元件。
  但你可以用指令來監看兩者。

</div>

這個狡猾的間諜指令很簡單，幾乎完全由 `ngOnInit()` 與 `ngOnDestroy()` 鉤子組成，透過注入的 `LoggerService` 將訊息記錄到父元件。

<code-example path="lifecycle-hooks/src/app/spy.directive.ts" region="spy-directive" header="src/app/spy.directive.ts" linenums="false"></code-example>

你可以把間諜套用到任何原生或元件元素上，它會與該元素同時初始化與銷毀。
這裡它附加到重複的英雄 `<div>` 上：

<code-example path="lifecycle-hooks/src/app/spy.component.html" region="template" header="src/app/spy.component.html" linenums="false"></code-example>

每個間諜的誕生與消亡，都標記著所附加英雄 `<div>` 的誕生與消亡，並在 *Hook Log* 中留下一筆記錄，如下所示：

<figure>
  <img src='generated/images/guide/lifecycle-hooks/spy-directive.gif' alt="Spy Directive">
</figure>

新增英雄會產生一個新的英雄 `<div>`。間諜的 `ngOnInit()` 會記錄該事件。

*Reset* 按鈕會清除 `heroes` 清單。
Angular 會同時從 DOM 移除所有英雄 `<div>` 元素，並銷毀它們的間諜指令。
間諜的 `ngOnDestroy()` 方法會回報它的最後時刻。

`ngOnInit()` 與 `ngOnDestroy()` 方法在實際應用程式中扮演著更重要的角色。

{@a oninit}

### _OnInit()_

使用 `ngOnInit()` 有兩個主要理由：

1. 在建構後不久執行複雜的初始化。
1. 在 Angular 設定輸入屬性之後設定元件。

經驗豐富的開發者都同意，元件的建構應該便宜又安全。

<div class="alert is-helpful">

  Angular 團隊負責人 Misko Hevery
  [解釋了為什麼](http://misko.hevery.com/code-reviewers-guide/flaw-constructor-does-real-work/)
  你應該避免複雜的建構函式邏輯。

</div>

不要在元件建構函式中擷取資料。
你不需要擔心新元件在測試中建立、或在你決定顯示它之前，會試圖聯繫遠端伺服器。
建構函式應該只將初始區域變數設定為簡單的值。

`ngOnInit()` 是元件擷取初始資料的好地方。
[Tour of Heroes 教學](tutorial/toh-pt4#oninit)指南展示了做法。


還要記住，指令的資料繫結輸入屬性要到_建構之後_才會被設定。
如果你需要根據這些屬性來初始化指令，這會是個問題。
等到 `ngOnInit()` 執行時，它們就已經被設定好了。

<div class="alert is-helpful">

  `ngOnChanges()` 方法是你第一次存取這些屬性的機會。
  Angular 會在 `ngOnInit()` 之前呼叫 `ngOnChanges()`，之後也會多次呼叫它。
  它只會呼叫 `ngOnInit()` 一次。

</div>

你可以放心，Angular 會在建立元件後_很快_呼叫 `ngOnInit()` 方法。
繁重的初始化邏輯就應該放在那裡。

{@a ondestroy}

### _OnDestroy()_

將清理邏輯放在 `ngOnDestroy()` 中，這是 Angular 銷毀指令之前*必須*執行的邏輯。

這是通知應用程式另一部分「元件即將消失」的時機。

這裡是釋放不會被自動垃圾回收的資源的地方。
取消訂閱 Observable 與 DOM 事件。停止間隔計時器。
取消註冊這個指令向全域或應用程式服務註冊的所有回呼。
如果你忽略這一點，就有記憶體洩漏的風險。

{@a onchanges}

## _OnChanges()_

每當 Angular 偵測到元件（或指令）***輸入屬性***的變更時，就會呼叫它的 `ngOnChanges()` 方法。
這個範例監控 `OnChanges` 鉤子。

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="ng-on-changes" header="on-changes.component.ts (excerpt)" linenums="false"></code-example>

`ngOnChanges()` 方法接受一個物件，將每個變更的屬性名稱對應到一個持有目前與先前屬性值的 [SimpleChange](api/core/SimpleChange) 物件。
這個鉤子會逐一走訪變更的屬性並記錄它們。

範例元件 `OnChangesComponent` 有兩個輸入屬性：`hero` 與 `power`。

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="inputs" header="src/app/on-changes.component.ts" linenums="false"></code-example>

主元件 `OnChangesParentComponent` 像這樣繫結它們：

<code-example path="lifecycle-hooks/src/app/on-changes-parent.component.html" region="on-changes" header="src/app/on-changes-parent.component.html"></code-example>

以下是使用者進行變更時，範例的實際運作情形。

<figure>
  <img src='generated/images/guide/lifecycle-hooks/on-changes-anim.gif' alt="OnChanges">
</figure>

當 *power* 屬性的字串值變更時，就會出現記錄項目。
但 `ngOnChanges` 不會捕捉 `hero.name` 的變更。
這乍看之下令人驚訝。

Angular 只在輸入屬性的值變更時才呼叫這個鉤子。
`hero` 屬性的值是*指向英雄物件的參照*。
Angular 不在意英雄本身的 `name` 屬性變更了。
英雄物件的*參照*沒有改變，所以從 Angular 的觀點來看，沒有變更可以回報！

{@a docheck}

## _DoCheck()_

使用 `DoCheck` 鉤子來偵測並處理 Angular 自身無法捕捉的變更。

<div class="alert is-helpful">

  使用這個方法來偵測 Angular 忽略掉的變更。

</div>

*DoCheck* 範例以以下 `ngDoCheck()` 鉤子擴充了 *OnChanges* 範例：

<code-example path="lifecycle-hooks/src/app/do-check.component.ts" region="ng-do-check" header="DoCheckComponent (ngDoCheck)" linenums="false"></code-example>

這段程式碼會檢查某些_關注的值_，擷取並比較它們目前的狀態與先前的狀態。
當 `hero` 或 `power` 沒有實質變更時，它會在記錄中寫入一則特殊訊息，讓你看到 `DoCheck` 被呼叫的頻率。結果很有啟發性：

<figure>
  <img src='generated/images/guide/lifecycle-hooks/do-check-anim.gif' alt="DoCheck">
</figure>

雖然 `ngDoCheck()` 鉤子可以偵測英雄的 `name` 何時變更，但它的代價高得驚人。
這個鉤子被呼叫的頻率極高&mdash;在_每一次_變更偵測週期之後都會被呼叫，無論變更發生在哪裡。
在使用者能夠做任何事之前，這個範例中它就被呼叫了二十多次。

這些初始檢查大多是由 Angular 首次渲染*頁面上其他地方的無關資料*所觸發。
光是將游標移到另一個 `<input>` 就會觸發一次呼叫。
相對較少的呼叫會顯示相關資料的實際變更。
很明顯，我們的實作必須極為輕量，否則使用者體驗會受到影響。

{@a afterview}

## AfterView

*AfterView* 範例探討 Angular 在建立元件的子檢視*之後*呼叫的 `AfterViewInit()` 與 `AfterViewChecked()` 鉤子。

以下是一個在 `<input>` 中顯示英雄名稱的子檢視：

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="child-view" header="ChildComponent" linenums="false"></code-example>

`AfterViewComponent` 在*其範本內*顯示這個子檢視：

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="template" header="AfterViewComponent (template)" linenums="false"></code-example>

以下鉤子會根據*子檢視內*變更的值採取行動，而子檢視只能透過查詢以 [@ViewChild](api/core/ViewChild) 裝飾的屬性來取得。


<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="hooks" header="AfterViewComponent (class excerpts)" linenums="false"></code-example>

{@a wait-a-tick}

### 遵守單向資料流規則

當英雄名稱超過 10 個字元時，`doSomething()` 方法會更新畫面。

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="do-something" header="AfterViewComponent (doSomething)" linenums="false"></code-example>

為什麼 `doSomething()` 方法在更新 `comment` 之前要先等待一個 tick？

Angular 的單向資料流規則禁止在檢視組成*之後*再更新檢視。
這兩個鉤子都會在元件的檢視組成之後觸發。

如果你讓鉤子立即更新元件資料繫結的 `comment` 屬性，Angular 會拋出錯誤（試試看！）。
`LoggerService.tick_then()` 會將記錄更新延後一個瀏覽器 JavaScript 週期，而這就足夠長了。

以下是 *AfterView* 的實際運作情形：

<figure>
  <img src='generated/images/guide/lifecycle-hooks/after-view-anim.gif' alt="AfterView">
</figure>

請注意，Angular 經常呼叫 `AfterViewChecked()`，通常是在沒有值得關注的變更時。
請撰寫精簡的鉤子方法，以避免效能問題。

{@a aftercontent}

## AfterContent

*AfterContent* 範例探討 Angular 在將外部內容投影到元件*之後*呼叫的 `AfterContentInit()` 與 `AfterContentChecked()` 鉤子。

{@a content-projection}

### 內容投影

*內容投影*是一種從元件外部匯入 HTML 內容、並將該內容插入元件範本中指定位置的方式。

<div class="alert is-helpful">

  AngularJS 開發者稱這種技術為 *transclusion*（轉置）。

</div>

請看[前一個 _AfterView_](guide/lifecycle-hooks#afterview)範例的這個變化版本。
這一次，它不是將子檢視包含在範本內，而是從 `AfterContentComponent` 的父元件匯入內容。以下是父元件的範本：

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="parent-template" header="AfterContentParentComponent (template excerpt)" linenums="false"></code-example>

請注意，`<app-child>` 標籤夾在 `<after-content>` 標籤之間。
絕對不要在元件的元素標籤之間放置內容，*除非你打算將該內容投影到元件中*。

現在來看看元件的範本：

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="template" header="AfterContentComponent (template)" linenums="false"></code-example>

`<ng-content>` 標籤是外部內容的*預留位置*。
它告訴 Angular 要在哪裡插入該內容。
在這個案例中，投影的內容是來自父元件的 `<app-child>`。

<figure>
  <img src='generated/images/guide/lifecycle-hooks/projected-child-view.png' alt="Projected Content">
</figure>

<div class="alert is-helpful">

  *內容投影*的明顯跡象有兩點：

  * 元件元素標籤之間的 HTML。
  * 元件範本中 `<ng-content>` 標籤的存在。

</div>

{@a aftercontent-hooks}

### AfterContent 鉤子

*AfterContent* 鉤子與 *AfterView* 鉤子類似。
關鍵差異在於子元件。

* *AfterView* 鉤子關心的是 `ViewChildren`，也就是元素標籤出現在元件範本*內*的子元件。

* *AfterContent* 鉤子關心的是 `ContentChildren`，也就是 Angular 投影到元件中的子元件。

以下 *AfterContent* 鉤子會根據*內容子元件*中變更的值採取行動，而內容子元件只能透過查詢以 [@ContentChild](api/core/ContentChild) 裝飾的屬性來取得。

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="hooks" header="AfterContentComponent (class excerpts)" linenums="false"></code-example>

{@a no-unidirectional-flow-worries}

### 使用 _AfterContent_ 不必擔心單向資料流

這個元件的 `doSomething()` 方法會立即更新元件資料繫結的 `comment` 屬性。
不需要[等待一個 tick](guide/lifecycle-hooks#wait-a-tick)。

回想一下，Angular 會在呼叫任一個 *AfterView* 鉤子之前，先呼叫兩個 *AfterContent* 鉤子。
Angular 會在完成這個元件檢視的組成*之前*，先完成投影內容的組成。
在 `AfterContent...` 與 `AfterView...` 鉤子之間有一個短暫的空檔，讓你可以修改主元件的檢視。
