# 依賴注入

**依賴注入**是一種重要的應用程式設計模式。
Angular 有它自己的依賴注入框架，
而且你真的無法在沒有它的情況下建置 Angular 應用程式。
它被使用得如此廣泛，幾乎每個人都直接稱它為 _DI_。

本頁說明什麼是 DI、它為何如此有用，
以及[如何在 Angular 應用程式中使用它](guide/dependency-injection#angular-di)。

執行 <live-example></live-example>。

{@a why-di }

## 為何需要依賴注入？

若要了解依賴注入為何如此重要，請看一個沒有它的範例。
想像你寫了下列程式碼：


<code-example path="dependency-injection/src/app/car/car-no-di.ts" region="car" title="src/app/car/car.ts (without DI)">

</code-example>



`Car` 類別會在它的建構子中建立它需要的一切。
問題出在哪裡？
問題是，`Car` 類別脆弱、缺乏彈性，而且難以測試。

這個 `Car` 需要引擎與輪胎。它不是開口要求它們，
而是 `Car` 建構子從非常特定的類別 `Engine` 與 `Tires`
自行實例化出它們的副本。

如果 `Engine` 類別演進了，它的建構子需要一個參數，會怎麼樣？
那會毀掉 `Car` 類別，而且在你按照像
`this.engine = new Engine(theNewParameter)` 這樣重寫它之前，它會一直壞著。
你第一次寫 `Car` 時，根本沒考慮過 `Engine` 建構子的參數。
你現在可能也預料不到它們。
但你將*不得不*開始在意，因為
當 `Engine` 的定義改變時，`Car` 類別也必須改變。
這使得 `Car` 很脆弱。

如果你想在你的 `Car` 上裝不同品牌的輪胎呢？辦不到。
你被鎖定在 `Tires` 類別所建立的任何品牌上。這使得
`Car` 類別缺乏彈性。

目前每輛新車都有它自己的 `engine`。它無法與其他車共用 `engine`。
雖然這對汽車引擎來說合情合理，
但你肯定想得到其他應該共用的依賴，例如連向製造商服務中心的車載無線連線。這個 `Car` 缺乏
共用先前已為其他消費者建立好的服務的彈性。

當你為 `Car` 撰寫測試時，你只能任由它隱藏的依賴擺佈。
真的有可能在測試環境中建立一個新的 `Engine` 嗎？
`Engine` 依賴什麼？那個依賴又依賴什麼？
一個新的 `Engine` 實例會不會對伺服器發出非同步呼叫？
你肯定不希望這種事在測試期間發生。

如果 `Car` 應該在胎壓過低時閃爍警告信號呢？
如果你在測試期間無法換上低胎壓的輪胎，
你如何確認它真的會閃爍警告？

你對這輛車隱藏的依賴毫無控制權。
當你無法控制依賴時，一個類別就變得難以測試。

你要如何讓 `Car` 更健壯、更有彈性、更容易測試？

{@a ctor-injection}
超級簡單。把 `Car` 建構子改成使用 DI 的版本：


<code-tabs>

  <code-pane title="src/app/car/car.ts (excerpt with DI)" path="dependency-injection/src/app/car/car.ts" region="car-ctor">

  </code-pane>

  <code-pane title="src/app/car/car.ts (excerpt without DI)" path="dependency-injection/src/app/car/car-no-di.ts" region="car-ctor">

  </code-pane>

</code-tabs>



看出發生了什麼嗎？依賴的定義
現在出現在建構子中。
`Car` 類別不再建立 `engine` 或 `tires`。
它只是消費它們。


<div class="l-sub-section">



這個範例利用了 TypeScript 的建構子語法，
可以同時宣告參數與屬性。


</div>



現在你可以將引擎與輪胎傳入建構子，來建立一輛車。


<code-example path="dependency-injection/src/app/car/car-creations.ts" region="car-ctor-instantiation" linenums="false">

</code-example>



是不是很酷？
`engine` 與 `tire` 依賴的定義
已與 `Car` 類別解耦。
你可以傳入任何種類的 `engine` 或 `tires`，只要它們
符合 `engine` 或 `tires` 的一般 API 要求即可。

現在，如果有人擴充了 `Engine` 類別，那不是 `Car` 的問題。


<div class="l-sub-section">



`Car` 的_消費者_才有問題。消費者必須把建立車輛的程式碼更新成
像這樣：


<code-example path="dependency-injection/src/app/car/car-creations.ts" region="car-ctor-instantiation-with-param" linenums="false">

</code-example>



關鍵點是：`Car` 類別完全不需要改變。
你很快就會處理消費者的問題。


</div>



`Car` 類別現在容易測試得多，因為你完全掌控了
它的依賴。
你可以將模擬替身傳入建構子，讓它們在每次測試中
完全按照你的期望運作：


<code-example path="dependency-injection/src/app/car/car-creations.ts" region="car-ctor-instantiation-with-mocks" linenums="false">

</code-example>



**你剛剛學會了什麼是依賴注入。**

它是一種程式設計模式，類別會從外部
來源接收它的依賴，而不是自行建立它們。

很酷！但那個可憐的消費者該怎麼辦？
任何想要一輛 `Car` 的人，現在都必須
建立全部三個部分：`Car`、`Engine` 與 `Tires`。
`Car` 類別把自己的問題甩到了消費者身上。
你需要有個東西負責組裝這些部分。

你_可以_寫一個龐大的類別來做這件事：


<code-example path="dependency-injection/src/app/car/car-factory.ts" title="src/app/car/car-factory.ts">

</code-example>



現在只有三個建立方法，還不算太糟。
但隨著應用程式成長，維護它會變得非常棘手。
這個工廠將會變成一張由相互依賴的工廠方法組成的
巨大蜘蛛網！

如果你可以單純列出你想建置的東西，
而不必定義哪個依賴要注入到什麼東西裡，豈不是很好？

這正是依賴注入框架派上用場的地方。
想像這個框架有一個叫做_注入器_的東西。
你向這個注入器註冊一些類別，它就會想辦法建立它們。

當你需要一輛 `Car` 時，你只要請注入器幫你取得它，就可以了。


<code-example path="dependency-injection/src/app/car/car-injector.ts" region="injector-call" title="src/app/car/car-injector.ts" linenums="false">

</code-example>



人人都是贏家。`Car` 對如何建立 `Engine` 或 `Tires` 一無所知。
消費者對如何建立 `Car` 一無所知。
你不需要維護一個龐大的工廠類別。
`Car` 與消費者都只要要求它們需要的東西，注入器就會交付。

這正是**依賴注入框架**的精髓所在。

現在你已知道什麼是依賴注入，也體會到它的好處，
請繼續閱讀，了解它在 Angular 中是如何實作的。

{@a angular-di}

## Angular 依賴注入

Angular 附帶了它自己的依賴注入框架。這個框架也可以
被其他應用程式與框架當作獨立模組使用。

若要了解它在 Angular 中建置元件時能做些什麼，
先從[英雄之旅](tutorial/)中的 `HeroesComponent`
的一個簡化版本開始。


<code-tabs>

  <code-pane title="src/app/heroes/heroes.component.ts" path="dependency-injection/src/app/heroes/heroes.component.1.ts" region="v1">

  </code-pane>

  <code-pane title="src/app/heroes/hero-list.component.ts" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">

  </code-pane>

  <code-pane title="src/app/heroes/hero.ts" path="dependency-injection/src/app/heroes/hero.ts">

  </code-pane>

  <code-pane title="src/app/heroes/mock-heroes.ts" path="dependency-injection/src/app/heroes/mock-heroes.ts">

  </code-pane>

</code-tabs>



`HeroesComponent` 是 *Heroes* 功能區域的根元件。
它管理這個區域的所有子元件。
這個精簡版本只有一個子元件 `HeroListComponent`，
它會顯示一份英雄清單。


目前 `HeroListComponent` 從 `HEROES` 取得英雄，那是一個定義在另一個檔案中的記憶體內集合。
在開發初期這或許夠用，但遠非理想。
一旦你嘗試測試這個元件，或是想從遠端伺服器取得英雄資料，
你就必須改變 `heroes` 的實作，
並修正其他每一處對 `HEROES` 模擬資料的使用。

更好的做法是製作一個服務，隱藏應用程式取得英雄資料的方式。


<div class="l-sub-section">



既然服務是一個
[獨立的關注點](https://en.wikipedia.org/wiki/Separation_of_concerns)，
不妨考慮將服務程式碼寫在它自己的檔案中。

詳情請參閱[這則說明](guide/dependency-injection#one-class-per-file)。

</div>



下列 `HeroService` 公開了一個 `getHeroes` 方法，它回傳
與先前相同的模擬資料，但它的任何消費者都不需要知道這一點。


<code-example path="dependency-injection/src/app/heroes/hero.service.1.ts" title="src/app/heroes/hero.service.ts">

</code-example>





<div class="l-sub-section">



服務類別上方的 `@Injectable()` 裝飾器
將在[稍後](guide/dependency-injection#injectable)介紹。


</div>



<div class="l-sub-section">



當然，這不是一個真正的服務。
如果應用程式真的從遠端伺服器取得資料，API 就必須是
非同步的，或許會回傳一個 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。
你也必須改寫元件消費服務的方式。
這在一般情況下很重要，但在這個範例中不重要。


</div>



在 Angular 中，服務只不過是一個類別。
在你向 Angular 注入器註冊它之前，它也一直只是一個類別。


<div id='bootstrap'>

</div>



{@a injector-config}


### 設定注入器

你不需要建立 Angular 注入器。
Angular 會在啟動過程中為你建立一個全應用程式範圍的注入器。


<code-example path="dependency-injection/src/main.ts" linenums="false" title="src/main.ts (bootstrap)" region="bootstrap">

</code-example>



你確實必須註冊**提供者**來設定注入器，它們負責建立應用程式所需的服務。
本指南稍後會說明什麼是[提供者](guide/dependency-injection#providers)。


你可以在 [NgModule](guide/ngmodule) 內或應用程式元件中註冊提供者。


{@a register-providers-ngmodule}


### 在 _NgModule_ 中註冊提供者
以下是 `AppModule`，它在它的 `providers` 陣列中註冊了兩個提供者：`UserService` 與一個 `APP_CONFIG` 提供者。


<code-example path="dependency-injection/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts (excerpt)" region="ngmodule">

</code-example>



因為 `HeroService` _只_在 `HeroesComponent`
及其子元件內使用，頂層的 `HeroesComponent` 是
註冊它的理想位置。


{@a register-providers-component}


### 在元件中註冊提供者

以下是一個改訂過的 `HeroesComponent`，它在自己的 `providers` 陣列中註冊了 `HeroService`。


<code-example path="dependency-injection/src/app/heroes/heroes.component.1.ts" region="full" title="src/app/heroes/heroes.component.ts" linenums="false">

</code-example>



{@a ngmodule-vs-comp}


### 何時該用 _NgModule_，何時該用應用程式元件

一方面，在 `NgModule` 中提供的提供者會向根注入器註冊。這意味著在 `NgModule` 內註冊的每個提供者
都可以在_整個應用程式_中存取。

另一方面，在應用程式元件中註冊的提供者，
只在該元件及其所有子元件上可用。

在這裡，`APP_CONFIG` 服務需要在整個應用程式中都可用，所以它
註冊在 `AppModule` 的 `@NgModule` `providers` 陣列中。
但由於 `HeroService` 只在 *Heroes*
功能區域內使用，其他地方都不會用到，把它註冊在
`HeroesComponent` 中是合理的。


<div class="l-sub-section">



另請參閱 [NgModule FAQ](guide/ngmodule-faq#q-root-component-or-module) 中的
*「我應該將全應用程式範圍的提供者加入根 `AppModule` 還是
根 `AppComponent`？」*


</div>



{@a prep-for-injection}


### 讓 _HeroListComponent_ 做好注入的準備

`HeroListComponent` 應該從被注入的 `HeroService` 取得英雄。
依照依賴注入模式，元件必須在它的建構子中要求該服務，
[如先前所討論](guide/dependency-injection#ctor-injection)。
這是一個小小的變更：


<code-tabs>

  <code-pane title="src/app/heroes/hero-list.component (with DI)" path="dependency-injection/src/app/heroes/hero-list.component.2.ts">

  </code-pane>

  <code-pane title="src/app/heroes/hero-list.component (without DI)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">

  </code-pane>

</code-tabs>



<div class="l-sub-section">



#### 關注建構子

在建構子中加入一個參數，並不是這裡發生的全部事情。


<code-example path="dependency-injection/src/app/heroes/hero-list.component.2.ts" region="ctor" title="src/app/heroes/hero-list.component.ts" linenums="false">

</code-example>



請注意，建構子參數的型別是 `HeroService`，而且
`HeroListComponent` 類別有一個 `@Component` 裝飾器
（請向上捲動來確認這一點）。
另請回想，父元件 (`HeroesComponent`)
擁有 `HeroService` 的 `providers` 資訊。

建構子參數型別、`@Component` 裝飾器，
以及父元件的 `providers` 資訊，三者結合起來告訴
Angular 注入器：每當它建立一個新的 `HeroListComponent` 時，
就注入一個 `HeroService` 實例。


</div>



{@a di-metadata}


### 隱含建立注入器

在本指南稍早，你看過如何使用注入器來建立一輛新的
`Car`。
你_可以_像這樣明確地
建立一個注入器：


<code-example path="dependency-injection/src/app/car/car-injector.ts" region="injector-create-and-call" title="src/app/car/car-injector.ts" linenums="false">

</code-example>



你在英雄之旅或任何其他文件範例中都不會看到這樣的程式碼。
如果你*必須*這麼做，你*可以*寫出[明確建立注入器](guide/dependency-injection#explicit-injector)的程式碼，
但這不一定是最好的選擇。
當 Angular 為你建立元件時，它會負責建立與呼叫注入器&mdash;無論是透過 HTML 標記（例如 `<hero-list></hero-list>`），
還是透過[路由器](guide/router)導航到一個元件之後。
如果你讓 Angular 做它的工作，你就能享受到自動化依賴注入的好處。


{@a singleton-services}


### 單例服務

依賴在注入器的範圍內是單例。
在本指南的範例中，一個單一的 `HeroService` 實例會在
`HeroesComponent` 與它的 `HeroListComponent` 子元件之間共用。

然而，Angular DI 是一個階層式注入
系統，這意味著巢狀注入器可以建立它們自己的服務實例。
如需更多資訊，請參閱[階層式注入器](guide/hierarchical-dependency-injection)。


{@a testing-the-component}


### 測試元件

先前你已經看到，為依賴注入而設計類別，會讓類別更容易測試。
將依賴列為建構子參數，可能就是你有效測試應用程式各部分所需的全部。

例如，你可以用一個可以在測試下操控的模擬服務
建立一個新的 `HeroListComponent`：


<code-example path="dependency-injection/src/app/test.component.ts" region="spec" title="src/app/test.component.ts" linenums="false">

</code-example>



<div class="l-sub-section">



在[測試](guide/testing)中深入了解。


</div>



{@a service-needs-service}


### 當服務需要服務時

`HeroService` 非常簡單。它本身沒有任何依賴。


要是它有依賴呢？要是它透過記錄服務來回報它的活動呢？
你可以套用相同的*建構子注入*模式，
加入一個帶有 `Logger` 參數的建構子。

以下是與原始版本並列的改訂版。


<code-tabs>

  <code-pane title="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">

  </code-pane>

  <code-pane title="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">

  </code-pane>

</code-tabs>



建構子現在要求一個被注入的 `Logger` 實例，並將它儲存在一個名為 `logger` 的私有欄位中。
當有人要求英雄時，你會在 `getHeroes()` 方法中呼叫該欄位。


{@a injectable}


### 為什麼要用 _@Injectable()_？

**[@Injectable()](api/core/Injectable)** 會將一個類別標記為可供
注入器實例化。一般來說，當注入器嘗試實例化一個未標記為
`@Injectable()` 的類別時，它會回報錯誤。


<div class="l-sub-section">



實際上，你本來可以從 `HeroService` 的第一個
版本中省略 `@Injectable()`，因為它沒有被注入的參數。
但現在服務有了一個被注入的依賴，你就必須使用它。
你需要它，是因為 Angular 需要建構子參數的中繼資料
才能注入一個 `Logger`。


</div>



<div class="callout is-helpful">



<header>
  建議：為每個服務類別都加入 @Injectable()
</header>



不妨考慮為每個服務類別都加入 `@Injectable()`，即使是那些沒有依賴、
因此技術上並不需要它的類別也一樣。原因如下：


<ul style="font-size:inherit">

  <li>
    <b>未雨綢繆：</b> 之後加入依賴時，不必記得補上 <code>@Injectable()</code>。
  </li>

  <li>
    <b>一致性：</b> 所有服務都遵循相同的規則，你也不必疑惑為什麼少了某個裝飾器。
  </li>

</ul>



</div>



注入器也負責實例化像 `HeroesComponent` 這樣的元件。那麼為什麼 `HeroesComponent` 沒有
`@Injectable()` 呢？

如果你真的想加，你*可以*加。它並非必要，因為
`HeroesComponent` 已經標記了 `@Component`，而這個
裝飾器類別（例如你稍後會學到的 `@Directive` 與 `@Pipe`）
是 [@Injectable()](api/core/Injectable) 的一個子型別。事實上，
正是 `@Injectable()` 裝飾器
將一個類別標識為注入器進行實例化的目標。


<div class="l-sub-section">



在執行時期，注入器可以讀取轉譯後的 JavaScript 程式碼中的類別中繼資料，
並利用建構子參數型別資訊
來判斷要注入哪些東西。

並非每個 JavaScript 類別都有中繼資料。
TypeScript 編譯器預設會丟棄中繼資料。
如果 `emitDecoratorMetadata` 編譯器選項為 true
（在 `tsconfig.json` 中就應該如此），
編譯器就會為_每個至少有一個裝飾器的類別_，將中繼資料加入產生的 JavaScript 中。

雖然任何裝飾器都會觸發這個效果，但使用
[@Injectable()](api/core/Injectable) 裝飾器來標記服務類別，
可以讓意圖更明確。


</div>



<div class="callout is-critical">



<header>
  一定要包含括號
</header>



一定要寫 `@Injectable()`，而不要只寫 `@Injectable`。
如果你忘記了括號，應用程式會以莫名其妙的方式失敗。


</div>


{@a logger-service}

## 建立並註冊記錄服務

將記錄器注入 `HeroService` 分為兩個步驟：

1. 建立記錄服務。
1. 將它向應用程式註冊。

這個記錄服務相當簡單：


<code-example path="dependency-injection/src/app/logger.service.ts" title="src/app/logger.service.ts">

</code-example>



你很可能在應用程式的各處都需要同一個記錄服務，
所以將它放在專案的 `app` 資料夾中，
並在應用程式模組 `AppModule` 的 `providers` 陣列中註冊它。


<code-example path="dependency-injection/src/app/providers.component.ts" linenums="false" title="src/app/providers.component.ts (excerpt)" region="providers-logger">

</code-example>



如果你忘記註冊記錄器，Angular 會在它第一次尋找記錄器時擲出例外：

<code-example format="nocode">
  EXCEPTION: No provider for Logger! (HeroListComponent -> HeroService -> Logger)

</code-example>



那是 Angular 在告訴你，依賴注入器找不到記錄器的*提供者*。
它需要該提供者來建立一個 `Logger`，以便注入到一個新的
`HeroService` 中，而它需要
建立該服務並將它注入到一個新的 `HeroListComponent` 中。

這一連串的建立始於 `Logger` 提供者。*提供者*是下一節的主題。

{@a providers}

## 注入器提供者

提供者*提供*了依賴值的具體執行時期版本。
注入器依賴**提供者**來建立它注入到元件與其他服務中的服務實例。

你必須向注入器註冊一個服務*提供者*，否則它不會知道如何建立該服務。

先前你曾像這樣，在 `AppModule` 的中繼資料的 `providers` 陣列中註冊 `Logger` 服務：


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger" title="src/app/providers.component.ts">

</code-example>



要*提供*一個外觀與行為都像 `Logger` 的東西，有很多種方式。
`Logger` 類別本身就是一個明顯而自然的提供者。
但它不是唯一的方式。

你可以將注入器設定為使用其他提供者，它們可以交付一個行為像 `Logger` 的物件。
你可以提供一個替代類別。你可以提供一個類似記錄器的物件。
你可以給它一個呼叫記錄器工廠函式的提供者。
在適當的情況下，這些做法都可能是好選擇。

重要的是，當注入器需要一個 `Logger` 時，它有一個提供者可以求助。


<div id='provide'>

</div>



### *Provider* 類別與 _provide_ 物件實字


你曾將 `providers` 陣列寫成這樣：


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-1" title="src/app/providers.component.ts">

</code-example>



這其實是一個提供者註冊的簡寫表示式，
使用帶有兩個屬性的_提供者_物件實字：


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" title="src/app/providers.component.ts">

</code-example>



第一個是[權杖](guide/dependency-injection#token)，它既是定位依賴值的鍵，
也是註冊提供者的鍵。

第二個是提供者定義物件，
你可以將它視為建立依賴值的一個*配方*。
建立依賴值有很多種方式，就像寫配方有很多種方式一樣。


<div id='class-provider'>

</div>



### 替代類別提供者

有時候你會要求一個不同的類別來提供服務。
以下程式碼告訴注入器，
當有東西要求 `Logger` 時，回傳一個 `BetterLogger`。


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" title="src/app/providers.component.ts">

</code-example>



{@a class-provider-dependencies}


### 帶有依賴的類別提供者
也許一個 `EvenBetterLogger` 可以在記錄訊息中顯示使用者名稱。
這個記錄器會從被注入的 `UserService` 取得使用者，
該服務也會在應用程式層級被注入。


<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger" title="src/app/providers.component.ts" linenums="false">

</code-example>



像 `BetterLogger` 一樣設定它。


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5" title="src/app/providers.component.ts" linenums="false">

</code-example>



{@a aliased-class-providers}


### 為類別提供者取別名

假設一個舊元件依賴於一個 `OldLogger` 類別。
`OldLogger` 與 `NewLogger` 有相同的介面，但出於某些原因
你無法更新舊元件來使用它。

當*舊*元件用 `OldLogger` 記錄訊息時，
你希望改由 `NewLogger` 的單例實例來處理。

當元件要求新的或舊的記錄器時，
依賴注入器應該注入那個單例實例。
`OldLogger` 應該是 `NewLogger` 的別名。

你當然不希望你的應用程式裡有兩個不同的 `NewLogger` 實例。
不幸的是，如果你試著用 `useClass` 把 `OldLogger` 別名為 `NewLogger`，得到的正是如此。


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6a" title="src/app/providers.component.ts" linenums="false">

</code-example>



解決方案：使用 `useExisting` 選項來建立別名。


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b" linenums="false">

</code-example>



{@a value-provider}


### 值提供者


有時候，提供一個現成的物件，比要求注入器從類別建立它更容易。


<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger" title="src/app/providers.component.ts" linenums="false">

</code-example>



然後你用 `useValue` 選項註冊一個提供者，
讓這個物件扮演記錄器的角色。


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7" linenums="false">

</code-example>



在
[非類別依賴](guide/dependency-injection#non-class-dependencies) 與
[InjectionToken](guide/dependency-injection#injection-token) 章節中查看更多 `useValue` 範例。


<div id='factory-provider'>

</div>



### 工廠提供者

有時候你需要動態建立依賴值，
基於你在最後一刻之前不會知道的資訊。
也許該資訊在瀏覽器工作階段的過程中會反覆改變。

同時假設可注入的服務無法獨立存取這些資訊的來源。

這種情況需要**工廠提供者**。

為了說明這一點，加入一個新的業務需求：
`HeroService` 必須對一般使用者隱藏*秘密*英雄。
只有已授權的使用者應該看到秘密英雄。

與 `EvenBetterLogger` 一樣，`HeroService` 需要一項關於使用者的事實。
它需要知道使用者是否有權看到秘密英雄。
這項授權可以在單一應用程式工作階段的過程中改變，
例如當你登入不同的使用者時。

與 `EvenBetterLogger` 不同，你不能將 `UserService` 注入到 `HeroService` 中。
`HeroService` 無法直接存取使用者資訊，來決定
誰已授權誰未授權。


相反地，`HeroService` 建構子接受一個布林旗標，來控制秘密英雄的顯示。


<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" title="src/app/heroes/hero.service.ts (excerpt)" linenums="false">

</code-example>



你可以注入 `Logger`，但你無法注入布林值 `isAuthorized`。
你必須用工廠提供者接管這個 `HeroService` 新實例的建立。

工廠提供者需要一個工廠函式：


<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" title="src/app/heroes/hero.service.provider.ts (excerpt)" linenums="false">

</code-example>



雖然 `HeroService` 無法存取 `UserService`，但工廠函式可以。

你將 `Logger` 與 `UserService` 都注入到工廠提供者中，
並讓注入器將它們傳給工廠函式：


<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" title="src/app/heroes/hero.service.provider.ts (excerpt)" linenums="false">

</code-example>



<div class="l-sub-section">



`useFactory` 欄位告訴 Angular，該提供者是一個工廠函式，
其實作即為 `heroServiceFactory`。

`deps` 屬性是一個[提供者權杖](guide/dependency-injection#token)的陣列。
`Logger` 與 `UserService` 類別是它們自己的類別提供者的權杖。
注入器解析這些權杖，並將對應的服務注入到相符的工廠函式參數中。


</div>



請注意，你將工廠提供者擷取到一個匯出的變數 `heroServiceProvider` 中。
這個額外的步驟讓工廠提供者可以重複使用。
你可以在任何需要的地方用這個變數註冊 `HeroService`。

在本範例中，你只在 `HeroesComponent` 中需要它，
在那裡它取代了詮釋資料 `providers` 陣列中先前的 `HeroService` 註冊。
這裡你可以看到新與舊的實作並列：


<code-tabs>

  <code-pane title="src/app/heroes/heroes.component (v3)" path="dependency-injection/src/app/heroes/heroes.component.ts">

  </code-pane>

  <code-pane title="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts" region="full">

  </code-pane>

</code-tabs>


{@a token}

## 依賴注入權杖

當你向注入器註冊提供者時，你會將該提供者與一個依賴注入權杖關聯起來。
注入器維護著一個內部的*權杖-提供者*對映，當被要求提供
依賴時，它會參照這個對映。權杖是該對映的鍵。

在先前所有的範例中，依賴值一直是類別*實例*，而
類別*型別*充當它自己的查找鍵。
在這裡，你透過提供 `HeroService` 型別作為權杖，直接從注入器取得一個 `HeroService`：


<code-example path="dependency-injection/src/app/injector.component.ts" region="get-hero-service" title="src/app/injector.component.ts" linenums="false">

</code-example>



當你撰寫一個需要注入的類別依賴的建構子時，你也有同樣的好運氣。
當你定義一個帶有 `HeroService` 類別型別的建構子參數時，
Angular 就知道要注入與
該 `HeroService` 類別權杖相關聯的服務：


<code-example path="dependency-injection/src/app/heroes/hero-list.component.ts" region="ctor-signature" title="src/app/heroes/hero-list.component.ts">

</code-example>



當你想到大多數依賴值都是由類別提供的時候，這一點特別方便。


{@a non-class-dependencies}


### 非類別依賴

<p>
  如果依賴值不是類別怎麼辦？有時候你想要注入的東西是
  一個字串、函式或物件。
</p>



<p>
  應用程式經常定義包含許多小型事實的設定物件
  （例如應用程式的標題或某個 Web API 端點的位址），
  但這些設定物件並不總是類別的實例。
  它們可以是像這樣的物件實字：
</p>



<code-example path="dependency-injection/src/app/app.config.ts" region="config" title="src/app/app-config.ts (excerpt)" linenums="false">

</code-example>



要是你想讓這個設定物件可以被注入呢？
你知道你可以向[值提供者](guide/dependency-injection#value-provider)註冊一個物件。


但你應該用什麼作為權杖？
你沒有類別可以充當權杖。
沒有 `AppConfig` 類別。


<div class="l-sub-section">



### TypeScript 介面不是有效的權杖

`HERO_DI_CONFIG` 常數有一個介面 `AppConfig`。不幸的是，你
不能將 TypeScript 介面用作權杖：

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface" title="src/app/providers.component.ts" linenums="false">

</code-example>



<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface" title="src/app/providers.component.ts" linenums="false">

</code-example>



如果你習慣了強型別語言中的依賴注入，這看起來可能很奇怪，在那些語言中
介面是首選的依賴查找鍵。

這不是 Angular 造成的。介面是 TypeScript 的設計時期工件。JavaScript 沒有介面。
TypeScript 介面會從產生的 JavaScript 中消失。
執行時期沒有留下任何介面型別資訊可以讓 Angular 找到。


</div>



{@a injection-token}


### _InjectionToken_

為非類別依賴選擇提供者權杖的一個解決方案，
是定義並使用一個 [*InjectionToken*](api/core/InjectionToken)。
這樣的權杖的定義看起來像這樣：


<code-example path="dependency-injection/src/app/app.config.ts" region="token" title="src/app/app.config.ts" linenums="false">

</code-example>



型別參數雖然是選用的，但它能向開發者與工具傳達依賴的型別。
token 描述則是另一項協助開發者的資訊。

使用 `InjectionToken` 物件註冊依賴提供者：


<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9" title="src/app/providers.component.ts" linenums="false">

</code-example>



現在，藉由 `@Inject` 裝飾器的幫助，你可以將設定物件注入到任何需要它的建構子中：


<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" title="src/app/app.component.ts" linenums="false">

</code-example>



<div class="l-sub-section">



雖然 `AppConfig` 介面在依賴注入中不扮演任何角色，它支援類別內設定物件的型別。


</div>



或者，你可以在像 `AppModule` 這樣的 ngModule 中提供並注入設定物件。

<code-example path="dependency-injection/src/app/app.module.ts" region="ngmodule-providers" title="src/app/app.module.ts (ngmodule-providers)"></code-example>

<div id='optional'>

</div>



## 可選依賴

`HeroService` *需要*一個 `Logger`，但要是它沒有
`logger` 也能將就呢？
你可以透過用 `@Optional()` 註解建構子引數，
告訴 Angular 該依賴是可選的：


<code-example path="dependency-injection/src/app/providers.component.ts" region="import-optional">

</code-example>



<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-10-ctor" linenums="false">

</code-example>



使用 `@Optional()` 時，你的程式碼必須為 null 值做好準備。如果你
沒有在上游某處註冊 `logger`，注入器就會將
`logger` 的值設為 null。



## 總結

你在本頁中學到了 Angular 依賴注入的基礎。
你可以註冊各種不同種類的提供者，而且你知道如何透過在建構函式中加入參數，來請求被注入的物件（例如服務）。

Angular 依賴注入的能力比本指南所描述的更多。
你可以從它對巢狀注入器的支援開始，進一步了解它的進階功能，見
[階層式依賴注入](guide/hierarchical-dependency-injection)。

{@a explicit-injector}

## 附錄：直接使用注入器

開發者很少直接使用注入器，但是
這裡有一個這樣做的 `InjectorComponent`。


<code-example path="dependency-injection/src/app/injector.component.ts" region="injector" title="src/app/injector.component.ts">

</code-example>



`Injector` 本身就是一個可注入的服務。

在本範例中，Angular 將元件自己的 `Injector` 注入到該元件的建構子中。
然後，元件在 `ngOnInit()` 中向注入的注入器索取它想要的服務。

請注意，服務本身並沒有注入到元件中。
它們是透過呼叫 `injector.get()` 擷取的。

如果 `get()` 方法無法解析所要求的服務，它會拋出一個錯誤。
你可以呼叫帶有第二個參數的 `get()`，該參數是當服務
未被找到時要回傳的值。如果服務沒有向這個或任何祖先注入器註冊，Angular 就找不到該服務。


<div class="l-sub-section">



這項技術是
[服務定位器模式](https://en.wikipedia.org/wiki/Service_locator_pattern) 的一個範例。

除非你真的需要，否則請**避免**使用這項技術。
它鼓勵像你在這裡看到的那種隨意的大雜燴式做法。
它難以解釋、理解與測試。
你無法透過檢查建構子就知道這個類別需要什麼，或者它會做什麼。
它可以從任何祖先元件取得服務，而不僅僅是它自己的。
你被迫要深入挖掘實作才能發現它做了什麼。

當框架開發者必須以一般化且動態的方式取得服務時，他們可能會採用這種做法。


</div>

{@a one-class-per-file}

## 附錄：為何每個檔案只放一個類別

在同一個檔案中有多個類別令人困惑，最好避免。
開發者期望一檔案一類別。讓他們開心。

如果你將 `HeroService` 類別與
`HeroesComponent` 結合在同一個檔案中，
**請將元件定義在最後**。
如果你在服務之前定義元件，
你將會得到一個執行時期 null 參照錯誤。


<div class="l-sub-section">



你其實可以利用 `forwardRef()` 方法先定義元件，正如
這篇[部落格文章](http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html)所解釋的那樣。
但何必自找麻煩呢？
只要將元件與服務定義在個別的檔案中，就能完全避開這個問題。

</div>

