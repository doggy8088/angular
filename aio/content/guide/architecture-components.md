# 元件與範本簡介

*元件* 控制螢幕上稱為 [*檢視*](guide/glossary#檢視（view） "檢視的定義") 的一塊區域。
例如，個別元件定義並控制 [英雄之旅教學](tutorial) 中的以下各個檢視：

* 具有導覽連結的應用程式根目錄。
* 英雄清單。
* 英雄編輯器。

你可以在類別內定義元件的應用程式邏輯&mdash;也就是它為支援檢視所做的事&mdash;。
這個類別透過一組屬性和方法的 API 與檢視互動。

例如，`HeroListComponent` 有一個保存英雄陣列的 `heroes` 屬性。
當使用者點選從該清單選擇英雄時，其 `selectHero()` 方法會設定 `selectedHero` 屬性。
此元件從服務取得英雄，該服務是建構函式上的 TypeScript [參數屬性](https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties)。
該服務透過依賴注入系統提供給此元件。

<code-example path="architecture/src/app/hero-list.component.ts" header="src/app/hero-list.component.ts (class)" region="class"></code-example>

當使用者在應用程式中移動時，Angular 會建立、更新與銷毀元件。你的應用程式可以在此生命週期的每個時刻，透過選用的 [生命週期鉤子](guide/lifecycle-hooks)（例如 `ngOnInit()`）採取行動。

## 元件中繼資料

<img src="generated/images/guide/architecture/metadata.png" alt="中繼資料" class="left">

`@Component` 裝飾器將緊接其下的類別識別為元件類別，並指定其中繼資料。在下方的範例程式碼中，你可以看到 `HeroListComponent` 只是一個類別，完全沒有特殊的 Angular 標記法或語法。直到你以 `@Component` 裝飾器將其標記為元件，它才成為元件。

元件的中繼資料告訴 Angular，要到哪裡取得建立與呈現元件及其檢視所需的主要建構單元。具體而言，它會將 *範本* 與元件相關聯，可以直接以行內程式碼，或以參照方式。元件與其範本共同描述一個 *檢視*。

除了包含或指向範本之外，`@Component` 中繼資料還會設定（例如）如何在 HTML 中參照元件，以及它需要哪些服務。

以下是 `HeroListComponent` 的基本中繼資料範例。

<code-example path="architecture/src/app/hero-list.component.ts" header="src/app/hero-list.component.ts (metadata)" region="metadata"></code-example>

此範例展示一些最實用的 `@Component` 設定選項：

* `selector`：CSS 選取器，告訴 Angular 在範本 HTML 中找到對應標籤時，建立並插入此元件的執行個體。例如，若應用程式的 HTML 包含 `<app-hero-list></app-hero-list>`，Angular 便會在這些標籤之間插入 `HeroListComponent` 檢視的執行個體。

* `templateUrl`：此元件 HTML 範本的模組相對位址。或者，你也可以以行內方式提供 HTML 範本，作為 `template` 屬性的值。此範本定義元件的 *宿主檢視*。

* `providers`：元件所需服務的 [提供者](guide/glossary#提供者（provider）) 陣列。在此範例中，這告訴 Angular 如何提供元件建構函式用來取得要顯示的英雄清單的 `HeroService` 執行個體。


## 範本與檢視

<img src="generated/images/guide/architecture/template.png" alt="範本" class="left">

你以元件的配套範本來定義元件的檢視。範本是一種 HTML 形式，告訴 Angular 如何渲染元件。

檢視通常以階層方式組織，讓你可以將整個 UI 區段或頁面作為一個單元來修改，或顯示與隱藏。與元件直接相關聯的範本定義該元件的 *宿主檢視*。元件也可以定義 *檢視階層*，其中包含由其他元件承載的 *內嵌檢視*。

<div class="lightbox">
  <img src="generated/images/guide/architecture/component-tree.png" alt="元件樹" class="left">
</div>

檢視階層可以包含來自同一 NgModule 中的元件的檢視，但也可以（而且經常如此）包含來自在不同 NgModules 中定義的元件的檢視。

## 範本語法

範本看起來像一般的 HTML，不同之處在於它還包含 Angular [範本語法](guide/template-syntax)，會根據應用程式的邏輯以及應用程式與 DOM 資料的狀態來改變 HTML。你的範本可以使用 *資料繫結* 來協調應用程式與 DOM 資料，使用 *管道* 在資料顯示前進行轉換，以及使用 *指令* 將應用程式邏輯套用到所顯示的內容。

例如，以下是教學中的 `HeroListComponent` 的範本。

<code-example path="architecture/src/app/hero-list.component.html" header="src/app/hero-list.component.html"></code-example>

此範本使用典型的 HTML 元素，例如 `<h2>` 與 `<p>`，也包含 Angular 範本語法元素 `*ngFor`、`{{hero.name}}`、`(click)`、`[hero]` 與 `<app-hero-detail>`。這些範本語法元素告訴 Angular 如何運用程式邏輯與資料，將 HTML 渲染到螢幕上。

* `*ngFor` 指令告訴 Angular 對清單進行反覆運算。
* `{{hero.name}}`、`(click)` 與 `[hero]` 將程式資料與 DOM 雙向繫結，以回應使用者輸入。請參閱下方關於 [資料繫結](#資料繫結) 的更多說明。
* 範例中的 `<app-hero-detail>` 標籤是一個元素，代表一個新元件 `HeroDetailComponent`。
`HeroDetailComponent`（未顯示程式碼）定義了 `HeroListComponent` 的 hero-detail 子檢視。
請注意，像這樣的自訂元件如何在相同的版面配置中與原生 HTML 無縫混合。

### 資料繫結

若沒有框架，你必須負責將資料值推送到 HTML 控制項中，並將使用者回應轉換為動作與值更新。親手撰寫這種推拉邏輯既繁瑣又容易出錯，而且難以閱讀，任何經驗豐富的前端 JavaScript 程式設計師都能證實這一點。

Angular 支援 *雙向資料繫結*，這是一種協調範本各部分與元件各部分的機制。在範本 HTML 中加入繫結標記，告訴 Angular 如何連接雙方。

下圖顯示資料繫結標記的四種形式。每種形式都有一個方向：流向 DOM、來自 DOM，或兩者皆是。

<div class="lightbox">
  <img src="generated/images/guide/architecture/databinding.png" alt="資料繫結" class="left">
</div>

`HeroListComponent` 範本中的這個範例使用了其中三種形式。

<code-example path="architecture/src/app/hero-list.component.1.html" header="src/app/hero-list.component.html (binding)" region="binding"></code-example>

* `{{hero.name}}` [*插值*](guide/interpolation)
在 `<li>` 元素內顯示元件的 `hero.name` 屬性值。

* `[hero]` [*屬性繫結*](guide/property-binding) 將
`selectedHero` 的值從父元件 `HeroListComponent` 傳遞給子元件 `HeroDetailComponent` 的 `hero` 屬性。

* `(click)` [*事件繫結*](guide/user-input#繫結到使用者輸入事件) 在使用者點選英雄名稱時，呼叫元件的 `selectHero` 方法。

雙向資料繫結（主要用於 [範本驅動表單](guide/forms)）將屬性繫結與事件繫結結合在單一標記法中。
以下是 `HeroDetailComponent` 範本中使用 `ngModel` 指令進行雙向繫結的範例。

<code-example path="architecture/src/app/hero-detail.component.html" header="src/app/hero-detail.component.html (ngModel)" region="ngModel"></code-example>

在雙向繫結中，資料屬性的值會像屬性繫結一樣，從元件流向輸入方塊。使用者的變更也會像事件繫結一樣流回元件，將屬性重設為最新值。

Angular 會針對每個 JavaScript 事件週期，從應用程式元件樹的根節點開始，經過所有子元件，處理 *所有* 資料繫結一次。

<div class="lightbox">
  <img src="generated/images/guide/architecture/component-databinding.png" alt="資料繫結" class="left">
</div>

資料繫結在範本與其元件之間的溝通中扮演重要角色，對於父元件與子元件之間的溝通也很重要。

<div class="lightbox">
  <img src="generated/images/guide/architecture/parent-child-binding.png" alt="父／子繫結" class="left">
</div>

### 管道

Angular 管道讓你可以在範本 HTML 中宣告顯示值的轉換。具有 `@Pipe` 裝飾器的類別會定義一個函式，將輸入值轉換為輸出值，以在檢視中顯示。

Angular 定義了各種管道，例如 [date](api/common/DatePipe) 管道與 [currency](api/common/CurrencyPipe) 管道；完整清單請參閱[管道 API 清單](api?type=pipe)。你也可以定義新的管道。

若要在 HTML 範本中指定值轉換，請使用[管道運算子（|）](guide/pipes)。

`{{interpolated_value | pipe_name}}`

你可以串連管道，將一個管道函式的輸出傳送給另一個管道函式進行轉換。管道也可以接受引數，以控制其執行轉換的方式。例如，你可以將所需的格式傳遞給 `date` 管道。

```
  <!-- Default format: output 'Jun 15, 2015'-->
  <p>Today is {{today | date}}</p>

 <!-- fullDate format: output 'Monday, June 15, 2015'-->
 <p>The date is {{today | date:'fullDate'}}</p>

  <!-- shortTime format: output '9:43 AM'-->
  <p>The time is {{today | date:'shortTime'}}</p>
```

### 指令

<img src="generated/images/guide/architecture/directive.png" alt="指令" class="left">

Angular 範本是 *動態* 的。當 Angular 渲染範本時，會依照 *指令* 所給的指示來轉換 DOM。指令是具有 `@Directive()` 裝飾器的類別。

元件從技術上說就是一種指令。然而，元件在 Angular 應用程式中是如此獨特且核心，因此 Angular 定義了 `@Component()` 裝飾器，以範本導向的功能擴充 `@Directive()` 裝飾器。

除了元件之外，還有另外兩種指令：*結構* 與 *屬性*。Angular 定義了許多這兩種指令，你也可以使用 `@Directive()` 裝飾器自行定義。

如同元件，指令的中繼資料會將被裝飾的類別與 `selector` 元素相關聯，你可以使用該元素將其插入 HTML。在範本中，指令通常以屬性的形式出現在元素標籤內，可以是依名稱出現，或作為指派或繫結的目標。

#### 結構指令

*結構指令* 會透過在 DOM 中加入、移除與取代元素來改變版面配置。範例範本使用兩個內建結構指令，為檢視的渲染方式加入應用程式邏輯。

<code-example path="architecture/src/app/hero-list.component.1.html" header="src/app/hero-list.component.html (structural)" region="structural"></code-example>

* [`*ngFor`](guide/built-in-directives#ngFor) 是一種反覆運算指令；它告訴 Angular 為 `heroes` 清單中的每位英雄逐一建立一個 `<li>`。
* [`*ngIf`](guide/built-in-directives#ngIf) 是一種條件式指令；只有在存在已選取的英雄時，才包含 `HeroDetail` 元件。

#### 屬性指令

*屬性指令* 會改變現有元素的外觀或行為。在範本中，它們看起來像一般的 HTML 屬性，因此得名。

實作雙向資料繫結的 `ngModel` 指令就是屬性指令的一個例子。`ngModel` 會設定現有元素（通常是 `<input>`）的顯示值屬性，並回應變更事件，藉此修改該元素的行為。

<code-example path="architecture/src/app/hero-detail.component.html" header="src/app/hero-detail.component.html (ngModel)" region="ngModel"></code-example>

Angular 還有更多預先定義的指令，它們或是改變版面配置結構（例如 [ngSwitch](guide/built-in-directives#ngSwitch)），或是修改 DOM 元素與元件的各個層面（例如 [ngStyle](guide/built-in-directives#ngstyle) 與 [ngClass](guide/built-in-directives#ngClass)）。

<div class="alert is-helpful">

請參閱[屬性指令](guide/attribute-directives)與[結構指令](guide/structural-directives)指南，瞭解更多資訊。

</div>
