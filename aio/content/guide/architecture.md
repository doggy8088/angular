# 架構總覽

Angular 是一個框架，用來以 HTML 以及 JavaScript 或 TypeScript 等可編譯為 JavaScript 的語言，建立用戶端應用程式。

此框架由數個程式庫組成，其中一些是核心程式庫，另一些則是選用程式庫。

你撰寫 Angular 應用程式的方式，是以帶有 Angular 化標記的 HTML *範本* 組合畫面、撰寫 *元件* 類別來管理這些範本、在 *服務* 中加入應用程式邏輯，並將元件與服務封裝在 *模組* 中。

接著，你透過 *啟動* _根模組_ 來啟動應用程式。Angular 會接手，依你提供的指示在瀏覽器中呈現應用程式內容，並回應使用者的互動。

當然，實際內容不只如此。你將在後續頁面中了解細節。目前先專注在大方向上。

<figure>
  <img src="generated/images/guide/architecture/overview2.png" alt="總覽">
</figure>

<div class="l-sub-section">

  本頁所參照的程式碼可透過 <live-example></live-example> 取得。

</div>

## 模組

<img src="generated/images/guide/architecture/module.png" alt="元件" class="left">

Angular 應用程式是模組化的，而 Angular 有自己的模組化系統，稱為 _NgModules_。

NgModules 是一件大事。本頁介紹模組；[NgModules](guide/ngmodule) 頁面則深入說明模組。

<br class="clear">

每個 Angular 應用程式都至少有一個 NgModule 類別，也就是[根模組](guide/bootstrapping "Bootstrapping")，依慣例命名為 `AppModule`。

在小型應用程式中，_根模組_ 可能是唯一的模組，但大多數應用程式還有更多 _功能模組_。每個功能模組都是一個內聚的程式碼區塊，專屬於某個應用程式領域、工作流程或一組密切相關的功能。

NgModule 無論是 _根模組_ 或 _功能模組_，都是一個帶有 `@NgModule` 裝飾器的類別。

<div class="l-sub-section">

  裝飾器是修改 JavaScript 類別的函式。Angular 有許多裝飾器，會將中繼資料附加到類別上，讓它知道這些類別的意義以及它們應如何運作。
  <a href="https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.x5c2ndtx0">
  在網路上進一步了解</a>裝飾器。

</div>

`NgModule` 是一個裝飾器函式，接受單一中繼資料物件，其屬性描述該模組。其中最重要的屬性如下：
* `declarations` - 屬於此模組的 _檢視類別_。Angular 有三種檢視類別：[元件](guide/architecture#元件)、[指令](guide/architecture#指令) 與 [管道](guide/pipes)。

* `exports` - 宣告的子集，這些宣告應在其他模組的元件[範本](guide/architecture#範本) 中可見且可用。

* `imports` - 其他模組，其匯出的類別是 _此_ 模組中所宣告元件範本所需要的。

* `providers` - [服務](guide/architecture#服務) 的建立者，此模組將這些服務加入全域服務集合中；它們可在應用程式的所有部分存取。

* `bootstrap` - 主要的應用程式檢視，稱為 _根元件_，它承載所有其他應用程式檢視。只有 _根模組_ 應設定此 `bootstrap` 屬性。

以下是一個簡單的根模組：

<code-example path="architecture/src/app/mini-app.ts" region="module" title="src/app/app.module.ts" linenums="false"></code-example>

<div class="l-sub-section">

  `AppComponent` 的 `export` 只是為了示範如何匯出；在此範例中實際上並不需要。根模組沒有理由 _匯出_ 任何東西，因為其他元件不需要 _匯入_ 根模組。

</div>

透過 _啟動_ 根模組來啟動應用程式。在開發期間，你很可能會像這樣在 `main.ts` 檔案中啟動 `AppModule`。

<code-example path="architecture/src/main.ts" title="src/main.ts" linenums="false"></code-example>

### NgModules 與 JavaScript 模組

NgModule &mdash;一個以 `@NgModule` 裝飾的類別&mdash;是 Angular 的一項基本功能。

JavaScript 也有自己的模組系統，用於管理 JavaScript 物件的集合。它與 NgModule 系統完全不同且互不相關。

在 JavaScript 中，每個_檔案_都是一個模組，檔案中定義的所有物件都屬於該模組。
模組以 `export` 關鍵字標記某些物件，將其宣告為公開。
其他 JavaScript 模組使用*import 陳述式*來存取其他模組中的公開物件。

<code-example path="architecture/src/app/app.module.ts" region="imports" linenums="false"></code-example>

<code-example path="architecture/src/app/app.module.ts" region="export" linenums="false"></code-example>

<div class="l-sub-section">
  <a href="http://exploringjs.com/es6/ch_modules.html">在網路上進一步瞭解 JavaScript 模組系統。</a>
</div>

這是兩個不同且 _互補_ 的模組系統。撰寫應用程式時兩者都要用。

### Angular 程式庫

<img src="generated/images/guide/architecture/library-module.png" alt="元件" class="left">

Angular 以 JavaScript 模組集合的形式提供。你可以將它們視為程式庫模組。

每個 Angular 程式庫名稱都以 `@angular` 前置詞開頭。

你使用 **npm** 套件管理器安裝它們，並以 JavaScript `import` 陳述式匯入其中部分內容。

<br class="clear">

例如，像這樣從 `@angular/core` 程式庫匯入 Angular 的 `Component` 裝飾器：

<code-example path="architecture/src/app/app.component.ts" region="import" linenums="false"></code-example>

你也可以使用 JavaScript import 陳述式，從 Angular _程式庫_匯入 NgModules：

<code-example path="architecture/src/app/mini-app.ts" region="import-browser-module" linenums="false"></code-example>

在上述簡單根模組的範例中，應用程式模組需要 `BrowserModule` 內的素材。若要存取該素材，請像這樣將它加入 `@NgModule` 中繼資料的 `imports`：

<code-example path="architecture/src/app/mini-app.ts" region="ngmodule-imports" linenums="false"></code-example>

如此一來，你便同時使用 Angular 與 JavaScript 模組系統。

這兩個系統很容易混淆，因為它們共用「imports」與「exports」等共通詞彙。別擔心，隨著時間與經驗累積，混淆會逐漸變得清晰。

<div class="l-sub-section">

  從 [NgModules](guide/ngmodule) 頁面了解更多。

</div>

<hr/>

## 元件

<img src="generated/images/guide/architecture/hero-component.png" alt="元件" class="left">

_元件_ 控制螢幕上稱為 *檢視* 的一塊區域。

例如，下列檢視是由元件所控制的：

* 具有導覽連結的應用程式根目錄。
* 英雄清單。
* 英雄編輯器。

你可以在類別內定義元件的應用程式邏輯&mdash;也就是它為支援檢視所做的事&mdash;。這個類別透過一組屬性和方法的 API 與檢視互動。

{@a component-code}

例如，這個 `HeroListComponent` 有一個 `heroes` 屬性，會傳回它從服務取得的英雄陣列。`HeroListComponent` 還有一個 `selectHero()` 方法，當使用者點選從該清單中選擇英雄時，會設定 `selectedHero` 屬性。

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (class)" region="class"></code-example>

當使用者在應用程式中移動時，Angular 會建立、更新與銷毀元件。你的應用程式可以在此生命週期的每個時刻，透過選用的[生命週期鉤子](guide/lifecycle-hooks)（例如上方宣告的 `ngOnInit()`）採取行動。

<hr/>

## 範本

<img src="generated/images/guide/architecture/template.png" alt="範本" class="left">

你以元件的配套範本來定義元件的檢視。範本是一種 HTML 形式，告訴 Angular 如何渲染元件。

範本看起來像一般的 HTML，只是有些許不同。以下是我們的 `HeroListComponent` 的範本：

<code-example path="architecture/src/app/hero-list.component.html" title="src/app/hero-list.component.html"></code-example>

雖然這個範本使用了典型的 HTML 元素，例如 `<h2>` 與 `<p>`，它也有一些不同之處。像 `*ngFor`、`{{hero.name}}`、`(click)`、`[hero]` 與 `<hero-detail>` 這樣的程式碼，使用的是 Angular 的[範本語法](guide/template-syntax)。

在範本的最後一行，`<hero-detail>` 標籤是一個自訂元素，代表一個新元件 `HeroDetailComponent`。

`HeroDetailComponent` 是與你一直在看的 `HeroListComponent` *不同* 的元件。`HeroDetailComponent`（未顯示程式碼）呈現關於某位特定英雄的事實，也就是使用者從 `HeroListComponent` 所呈現的清單中選出的那位英雄。`HeroDetailComponent` 是 `HeroListComponent` 的子元件。

<img src="generated/images/guide/architecture/component-tree.png" alt="中繼資料" class="left">

請注意 `<hero-detail>` 如何自然地與原生 HTML 元素並列。自訂元件在相同的版面配置中與原生 HTML 無縫混合。

<hr class="clear"/>

## 中繼資料

<img src="generated/images/guide/architecture/metadata.png" alt="中繼資料" class="left">

中繼資料告訴 Angular 如何處理一個類別。

<br class="clear">

[回頭看](guide/architecture#component-code) `HeroListComponent` 的程式碼，你可以看到它只是一個類別。其中看不出任何框架的痕跡，完全沒有「Angular」。

事實上，`HeroListComponent` 真的 *就只是一個類別*。在你 *告訴 Angular 它是元件* 之前，它還不是元件。

若要告訴 Angular `HeroListComponent` 是一個元件，請將**中繼資料**附加到該類別上。

在 TypeScript 中，你使用**裝飾器**來附加中繼資料。以下是 `HeroListComponent` 的一些中繼資料：

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (metadata)" region="metadata"></code-example>

這是 `@Component` 裝飾器，它將緊接在其下方的類別識別為元件類別。

`@Component` 裝飾器接受一個必要的設定物件，其中包含 Angular 建立與呈現元件及其檢視所需的資訊。

以下是幾個最實用的 `@Component` 設定選項：

* `selector`：CSS 選取器，告訴 Angular 在 *父層* HTML 中找到 `<hero-list>` 標籤時，建立並插入此元件的執行個體。例如，若應用程式的 HTML 包含 `<hero-list></hero-list>`，Angular 便會在這些標籤之間插入 `HeroListComponent` 檢視的執行個體。

* `templateUrl`：此元件 HTML 範本的模組相對位址，如[上方](guide/architecture#範本)所示。

* `providers`：元件所需服務的**依賴注入提供者**陣列。這是告訴 Angular 元件的建構函式需要一個 `HeroService`，才能取得要顯示的英雄清單的一種方式。

<img src="generated/images/guide/architecture/template-metadata-component.png" alt="中繼資料" class="left">

`@Component` 中的中繼資料告訴 Angular，要到哪裡取得你為元件指定的主要建構區塊。

範本、中繼資料與元件共同描述一個檢視。

以類似的方式套用其他中繼資料裝飾器，來引導 Angular 的行為。`@Injectable`、`@Input` 與 `@Output` 是幾個較受歡迎的裝飾器。

<br class="clear">

架構上的重點是，你必須在程式碼中加入中繼資料，Angular 才知道該做什麼。

<hr/>

## 資料繫結

如果沒有框架，你就必須自己負責把資料值推入 HTML 控制項，並把使用者的回應轉換為動作與值的更新。手寫這種推/拉邏輯既繁瑣、容易出錯，又難以閱讀，任何有經驗的 jQuery 程式設計師都能作證。

<img src="generated/images/guide/architecture/databinding.png" alt="資料繫結" class="left">

Angular 支援資料繫結，這是一種協調範本各部分與元件各部分的機制。在範本 HTML 中加入繫結標記，告訴 Angular 如何連接雙方。

如圖所示，資料繫結語法有四種形式。每種形式都有一個方向 &mdash;流向 DOM、來自 DOM，或雙向。

<br class="clear">

`HeroListComponent` [範例](guide/architecture#範本)範本使用了其中三種形式：

<code-example path="architecture/src/app/hero-list.component.1.html" linenums="false" title="src/app/hero-list.component.html (binding)" region="binding"></code-example>

* `{{hero.name}}` [*插值*](guide/displaying-data#interpolation)
在 `<li>` 元素內顯示元件的 `hero.name` 屬性值。

* `[hero]` [*屬性繫結*](guide/template-syntax#property-binding) 將
`selectedHero` 的值從父元件 `HeroListComponent` 傳遞給子元件 `HeroDetailComponent` 的 `hero` 屬性。

* `(click)` [*事件繫結*](guide/user-input#click) 在使用者點選英雄名稱時，呼叫元件的 `selectHero` 方法。

**雙向資料繫結**是重要的第四種形式，它將屬性繫結與事件繫結結合在單一標記法中，使用 `ngModel` 指令。以下是 `HeroDetailComponent` 範本中的一個範例：

<code-example path="architecture/src/app/hero-detail.component.html" linenums="false" title="src/app/hero-detail.component.html (ngModel)" region="ngModel"></code-example>

在雙向繫結中，資料屬性的值會像屬性繫結一樣，從元件流向輸入方塊。
使用者的變更也會像事件繫結一樣流回元件，將屬性重設為最新值。

Angular 會針對每個 JavaScript 事件週期，從應用程式元件樹的根節點開始，經過所有子元件，處理 *所有* 資料繫結一次。

<figure>
  <img src="generated/images/guide/architecture/component-databinding.png" alt="資料繫結">
</figure>

資料繫結在範本與其元件之間的溝通中扮演重要角色。

<figure>
  <img src="generated/images/guide/architecture/parent-child-binding.png" alt="父／子繫結">
</figure>

資料繫結對於父元件與子元件之間的溝通也很重要。

<hr/>

## 指令

<img src="generated/images/guide/architecture/directive.png" alt="父子" class="left">

Angular 範本是 *動態* 的。當 Angular 渲染範本時，會依照**指令**所給的指示來轉換 DOM。

指令是具有 `@Directive` 裝飾器的類別。元件是 *帶有範本的指令*；`@Component` 裝飾器實際上就是以範本導向功能擴充的 `@Directive` 裝飾器。

<div class="l-sub-section">

  雖然元件在技術上是一種指令，但元件在 Angular 應用程式中如此獨特且核心，因此這篇架構總覽將元件與指令分開說明。

</div>

另外還有兩種指令：_結構_ 指令與 _屬性_ 指令。

它們往往像屬性一樣出現在元素標籤內，有時以名稱出現，但更常作為指派或繫結的目標。

**結構**指令會透過在 DOM 中加入、移除與取代元素來改變版面配置。

[範例範本](guide/architecture#範本)使用了兩個內建結構指令：

<code-example path="architecture/src/app/hero-list.component.1.html" linenums="false" title="src/app/hero-list.component.html (structural)" region="structural"></code-example>

* [`*ngFor`](guide/displaying-data#ngFor) 告訴 Angular 為 `heroes` 清單中的每位英雄逐一建立一個 `<li>`。
* [`*ngIf`](guide/displaying-data#ngIf) 只有在存在已選取的英雄時，才包含 `HeroDetail` 元件。

**屬性**指令會改變現有元素的外觀或行為。在範本中，它們看起來像一般的 HTML 屬性，因此得名。

實作雙向資料繫結的 `ngModel` 指令就是屬性指令的一個例子。`ngModel` 會設定現有元素（通常是 `<input>`）的顯示值屬性，並回應變更事件，藉此修改該元素的行為。

<code-example path="architecture/src/app/hero-detail.component.html" linenums="false" title="src/app/hero-detail.component.html (ngModel)" region="ngModel"></code-example>

Angular 還有更多指令，它們或是改變版面配置結構（例如 [ngSwitch](guide/template-syntax#ngSwitch)），或是修改 DOM 元素與元件的各個層面（例如 [ngStyle](guide/template-syntax#ngStyle) 與 [ngClass](guide/template-syntax#ngClass)）。

當然，你也可以撰寫自己的指令。像 `HeroListComponent` 這樣的元件就是一種自訂指令。

<!-- PENDING: link to where to learn more about other kinds! -->

<hr/>

## 服務

<img src="generated/images/guide/architecture/service.png" alt="服務" class="left">

_服務_ 是一個廣泛的類別，涵蓋應用程式需要的任何值、函式或功能。

幾乎任何東西都可以是服務。服務通常是一個目的狹窄、定義明確的類別。它應該做好某件特定的事，並把它做好。
<br class="clear">

範例包括：

* 記錄服務
* 資料服務
* 訊息匯流排
* 稅額計算器
* 應用程式設定

服務並沒有什麼專屬於 _Angular_ 的特性。Angular 對服務沒有定義。沒有服務基底類別，也沒有註冊服務的地方。

然而，服務是任何 Angular 應用程式的基礎。元件是服務的大量消費者。

以下是一個服務類別的範例，它會將訊息記錄到瀏覽器主控台：

<code-example path="architecture/src/app/logger.service.ts" linenums="false" title="src/app/logger.service.ts (class)" region="class"></code-example>

以下是一個 `HeroService`，它使用 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 來擷取英雄。`HeroService` 依賴 `Logger` 服務，以及另一個負責伺服器通訊繁重工作的 `BackendService`。

<code-example path="architecture/src/app/hero.service.ts" linenums="false" title="src/app/hero.service.ts (class)" region="class"></code-example>

服務無處不在。

元件類別應該保持精簡。它們不從伺服器擷取資料、不驗證使用者輸入，也不直接記錄到主控台。它們將這類任務委派給服務。

元件的工作只是實現使用者體驗，別無其他。它在檢視（由範本所渲染）與應用程式邏輯（通常包含某種 _模型_ 的概念）之間居中協調。好的元件會提供屬性和方法來進行資料繫結。它將所有不平凡的任務都委派給服務。

Angular 並不 *強制* 執行這些原則。如果你寫出一個 3000 行的「大雜燴」元件，它也不會抱怨。

Angular 確實能幫助你 *遵循* 這些原則，它讓你輕鬆地將應用程式邏輯拆分到服務中，並透過 *依賴注入* 讓元件可以使用這些服務。

<hr/>

## 依賴注入

<img src="generated/images/guide/architecture/dependency-injection.png" alt="服務" class="left">

_依賴注入_ 是一種為類別的新執行個體提供其所需的完整依賴的方式。大多數依賴都是服務。Angular 使用依賴注入，為新元件提供它們所需的服務。

<br class="clear">

Angular 可以透過查看建構函式參數的型別，判斷元件需要哪些服務。例如，你的 `HeroListComponent` 的建構函式需要一個 `HeroService`：

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (constructor)" region="ctor"></code-example>

當 Angular 建立元件時，它會先向**注入器**詢問該元件所需的服務。

注入器維護著一個容器，裡面是它先前已建立的服務執行個體。如果請求的服務執行個體不在容器中，注入器會建立一個並將它加入容器，然後再把服務傳回給 Angular。當所有請求的服務都已解析並傳回後，Angular 就能以這些服務作為引數，呼叫元件的建構函式。這就是 *依賴注入*。

`HeroService` 的注入過程大致如下：

<figure>
  <img src="generated/images/guide/architecture/injector-injects.png" alt="服務">
</figure>

如果注入器沒有 `HeroService`，它怎麼知道如何建立一個？

簡而言之，你必須事先向注入器註冊 `HeroService` 的提供者。**提供者**是可以建立或傳回服務的東西，通常就是服務類別本身。

你可以在模組或元件中註冊提供者。

一般而言，請將提供者加入[根模組](guide/architecture#模組)，如此一來，服務的同一個執行個體便可在任何地方使用。

<code-example path="architecture/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts (module providers)" region="providers"></code-example>

或者，在元件層級的 `@Component` 中繼資料的 `providers` 屬性中註冊：

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (component providers)" region="providers"></code-example>

在元件層級註冊，意味著該元件的每個新執行個體都會得到一個新的服務執行個體。

<!-- 我們為了這篇總覽，已大幅簡化依賴注入。完整的故事請見[依賴注入](guide/dependency-injection)頁面。 -->

關於依賴注入，要記住的重點：

* 依賴注入已內建於 Angular 框架中，並在各處使用。

* *注入器* 是主要的機制。
  * 注入器維護一個它所建立的服務執行個體的 *容器*。
  * 注入器可以從 *提供者* 建立新的服務執行個體。

* *提供者* 是建立服務的配方。

* 向注入器註冊 *提供者*。

<hr/>

## 總結

你已經了解 Angular 應用程式八大主要建構區塊的基礎知識：

* [模組](guide/architecture#模組)
* [元件](guide/architecture#元件)
* [範本](guide/architecture#範本)
* [中繼資料](guide/architecture#中繼資料)
* [資料繫結](guide/architecture#資料繫結)
* [指令](guide/architecture#指令)
* [服務](guide/architecture#服務)
* [依賴注入](guide/architecture#依賴注入)

那是 Angular 應用程式其他一切的基礎，也已經足以讓你開始動手了。但它並不包含你所需要知道的一切。

以下是一份簡短、按字母順序排列的其他重要 Angular 功能與服務清單。其中大多數都已在本文件中說明（或即將說明）。

> [**動畫**](guide/animations)：使用 Angular 的動畫程式庫為元件行為加上動畫效果，不需要深入了解動畫技術或 CSS。

> **變更偵測**的文件將說明 Angular 如何判斷元件屬性值已變更、何時更新畫面，以及它如何使用 **zones** 攔截非同步活動並執行其變更偵測策略。

> **事件**的文件將說明如何使用元件與服務來引發事件，並搭配發佈與訂閱事件的機制。

> [**表單**](guide/forms)：支援複雜的資料輸入情境，具備以 HTML 為基礎的驗證與變更（dirty）檢查。

> [**HTTP**](guide/http)：使用 HTTP 用戶端與伺服器溝通，以取得資料、儲存資料，以及呼叫伺服器端動作。

> [**生命週期鉤子**](guide/lifecycle-hooks)：透過實作生命週期鉤子介面，掌握元件從建立到銷毀的生命週期中的關鍵時刻。

> [**管道**](guide/pipes)：在範本中使用管道，透過轉換顯示值來改善使用者體驗。請看這個 `currency` 管道運算式：
>
> > `price | currency:'USD':true`
>
> 它將 42.33 的價格顯示為 `$42.33`。

> [**Router**](guide/router)：在用戶端應用程式中從一個頁面導覽到另一個頁面，且從不離開瀏覽器。

> [**測試**](guide/testing)：使用 _Angular 測試平台_，針對應用程式各部分與 Angular 框架互動的情形執行單元測試。