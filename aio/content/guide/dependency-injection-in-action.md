# 依賴注入

依賴注入是一種管理程式碼依賴的強大模式。
這本食譜探索 Angular 中依賴注入 (DI) 的許多功能。
{@a toc}

<!--

# 目錄

* [應用程式範圍的依賴](guide/dependency-injection-in-action#app-wide-dependencies)
* [外部模組設定](guide/dependency-injection-in-action#external-module-configuration)
* [`@Injectable()` 與巢狀服務依賴](guide/dependency-injection-in-action#nested-dependencies)

  * [`@Injectable()`](guide/dependency-injection-in-action#injectable-1)

* [將服務範圍限制在元件子樹](guide/dependency-injection-in-action#service-scope)
* [多個服務實例（沙箱化）](guide/dependency-injection-in-action#multiple-service-instances)
* [使用 `@Optional()` 與 `@Host()` 限定依賴查詢](guide/dependency-injection-in-action#qualify-dependency-lookup)

  * [示範](guide/dependency-injection-in-action#demonstration)

* [注入元件的 DOM 元素](guide/dependency-injection-in-action#component-element)
* [用提供者定義依賴](guide/dependency-injection-in-action#providers)

  * [定義提供者](guide/dependency-injection-in-action#defining-providers)
  * [*provide* 物件實字](guide/dependency-injection-in-action#provide)
  * [`useValue`&mdash;*值提供者*](guide/dependency-injection-in-action#usevalue)
  * [`useClass`&mdash;*類別提供者*](guide/dependency-injection-in-action#useclass)
  * [`useExisting`&mdash;*別名提供者*](guide/dependency-injection-in-action#useexisting)
  * [`useFactory`&mdash;*工廠提供者*](guide/dependency-injection-in-action#usefactory)

* [提供者權杖的替代方案：類別介面與 `InjectionToken`](guide/dependency-injection-in-action#tokens)

  * [class-interface](guide/dependency-injection-in-action#class-interface)
  * [`InjectionToken`](guide/dependency-injection-in-action#injection-token)

* [注入到衍生類別中](guide/dependency-injection-in-action#di-inheritance)
* [透過注入找到父元件](guide/dependency-injection-in-action#find-parent)

  * [尋找已知型別的父元件](guide/dependency-injection-in-action#known-parent)
  * [無法透過其基底類別找到父元件](guide/dependency-injection-in-action#base-parent)
  * [透過其類別介面找到父元件](guide/dependency-injection-in-action#class-interface-parent)
  * [在父母樹中使用 `@SkipSelf()` 找到父元件](guide/dependency-injection-in-action#parent-tree)
  * [`Parent` 類別介面](guide/dependency-injection-in-action#parent-token)
  * [`provideParent()` 輔助函式](guide/dependency-injection-in-action#provideparent)

* [使用前向類別參考（*forwardRef*）打破循環](guide/dependency-injection-in-action#forwardref)

-->

請參閱 <live-example name="dependency-injection-in-action"></live-example>，查看本食譜中的程式碼。

{@a app-wide-dependencies}

## 應用程式範圍的依賴
在根應用程式元件 `AppComponent` 中，註冊在整個應用程式中使用的依賴的提供者。

以下範例展示了在 `@Component` 詮釋資料的 `providers` 陣列中匯入並註冊
`LoggerService`、`UserContext` 與 `UserService`。

<code-example path="dependency-injection-in-action/src/app/app.component.ts" region="import-services" title="src/app/app.component.ts (excerpt)" linenums="false">

</code-example>

所有這些服務都是以類別形式實作的。
服務類別可以充當它們自己的提供者，這就是為什麼將它們列在 `providers` 陣列中，
就是你需要做的全部註冊。

<div class="l-sub-section">

*提供者*是可以建立或交付服務的東西。
Angular 使用 `new` 從類別提供者建立服務實例。
更多關於提供者的資訊，請參閱[依賴注入](guide/dependency-injection#注入器提供者)
指南。

</div>

既然你已經註冊了這些服務，
Angular 就可以將它們注入到應用程式中*任何地方*的*任何*元件或服務的建構子中。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="ctor" title="src/app/hero-bios.component.ts (component constructor injection)" linenums="false">

</code-example>

<code-example path="dependency-injection-in-action/src/app/user-context.service.ts" region="ctor" title="src/app/user-context.service.ts (service constructor injection)" linenums="false">

</code-example>

{@a external-module-configuration}

## 外部模組設定
一般而言，在 `NgModule` 中註冊提供者，而不是在根應用程式元件中。

當你期望該服務在任何地方都可以注入時，
或者你要在_應用程式開始之前_設定另一個應用程式全域服務時，就這樣做。

以下是第二種情況的一個範例，其中元件路由器設定透過在 `AppModule` 的 `providers` 清單中列出其提供者，
包含一個非預設的[位置策略](guide/router#location-strategy)。

<code-example path="dependency-injection-in-action/src/app/app.module.ts" region="providers" title="src/app/app.module.ts (providers)" linenums="false">

</code-example>

{@a injectable}

{@a nested-dependencies}

## _@Injectable()_ 與巢狀服務依賴
被注入服務的消費者不知道如何建立該服務。
它也不應該在意。
建立並快取該服務是依賴注入的工作。

有時候一個服務依賴於其他服務，而那些服務可能又依賴於其他的服務。
以正確的順序解析這些巢狀依賴，也是框架的工作。
在每個步驟中，依賴的消費者只需要在其
建構子中宣告它需要什麼，框架就會接手。

以下範例展示了在 `AppComponent` 中同時注入 `LoggerService` 與 `UserContext`。

<code-example path="dependency-injection-in-action/src/app/app.component.ts" region="ctor" title="src/app/app.component.ts" linenums="false">

</code-example>

`UserContext` 本身又對 `LoggerService` 與一個收集特定使用者資訊的 `UserService` 都有依賴。

<code-example path="dependency-injection-in-action/src/app/user-context.service.ts" region="injectables" title="user-context.service.ts (injection)" linenums="false">

</code-example>

當 Angular 建立 `AppComponent` 時，依賴注入框架會建立 `LoggerService` 的一個實例，並
開始建立 `UserContextService`。
`UserContextService` 需要 `LoggerService`（框架已經有了）以及 `UserService`（它尚未建立）。
`UserService` 沒有依賴，所以依賴注入框架可以
直接使用 `new` 來實例化一個。

依賴注入的美妙之處在於，`AppComponent` 對這一切毫不在意。
你只需在建構子中宣告需要什麼 (`LoggerService` 與 `UserContextService`)，
剩下的工作就由框架完成。

一旦所有依賴都就位，`AppComponent` 就會顯示使用者資訊：

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/logged-in-user.png" alt="Logged In User">
</figure>

{@a injectable-1}

### *@Injectable()*
請注意 `UserContextService` 類別上的 `@Injectable()` 裝飾器。

<code-example path="dependency-injection-in-action/src/app/user-context.service.ts" region="injectable" title="user-context.service.ts (@Injectable)" linenums="false">

</code-example>

該裝飾器讓 Angular 能夠辨識其兩個依賴的型別：`LoggerService` 與 `UserService`。

從技術上講，`@Injectable()` 裝飾器只對具有_自身依賴_的服務類別才是必要的。
`LoggerService` 不依賴任何東西。即使你省略 `@Injectable()`，記錄器也會正常工作，
而且產生的程式碼會稍微小一點。

但是一旦你給了這個服務一個依賴，它就會壞掉，而你將不得不回去
並加入 `@Injectable()` 來修復它。從一開始就加入 `@Injectable()`，是為了
保持一致性並避免未來的痛苦。

<div class="alert is-helpful">

雖然本網站建議將 `@Injectable()` 套用到所有服務類別，但不必覺得受它束縛。
有些開發者偏好只在需要的地方加入它，這也是一個合理的政策。

</div>

<div class="l-sub-section">

`AppComponent` 類別也有兩個依賴，但沒有 `@Injectable()`。
它不需要 `@Injectable()`，因為該元件類別有 `@Component` 裝飾器。
在 Angular 與 TypeScript 中，*單一*裝飾器&mdash;*任何*裝飾器&mdash;就足以辨識依賴型別。

</div>

{@a service-scope}

## 將服務範圍限制在元件子樹

所有被注入的服務依賴都是單例，這意味著，
對於給定的依賴注入器，一個服務只有一個實例。

但 Angular 應用程式有多個依賴注入器，它們排列成一棵與元件樹平行的樹狀階層。
因此，特定的服務可以在任何元件層級被*提供*並被建立，而且
如果在多個元件中提供，就可以多次。

預設情況下，在一個元件中提供的服務依賴，對它的所有子元件都是可見的，而且
Angular 會將同一個服務實例注入到所有要求該服務的子元件中。

因此，在根 `AppComponent` 中提供的依賴，可以注入到應用程式中*任何地方*的*任何*元件中。

這並不總是令人想要的。
有時候你會想將服務的可用性限制在應用程式的特定區域。

你可以透過在該分支的*子根元件*處提供該服務，
將注入服務的範圍限制在應用程式階層的一個*分支*。
本範例展示了向子根元件提供服務
與向根 `AppComponent` 提供服務有多相似。語法是一樣的。
在這裡，`HeroService` 可供 `HeroesBaseComponent` 使用，因為它在 `providers` 陣列中：

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="injection" title="src/app/sorted-heroes.component.ts (HeroesBaseComponent excerpt)">

</code-example>

當 Angular 建立 `HeroesBaseComponent` 時，它也會建立一個只對該元件及其子元件（如果有的話）可見的 `HeroService` 新實例。

你也可以在應用程式其他地方的一個*不同*元件中提供 `HeroService`。
這將產生一個位於*不同*注入器中的、該服務的*不同*實例。

<div class="l-sub-section">

在隨附的範例程式碼中，這類有範圍的 `HeroService` 單例隨處可見，
包括 `HeroBiosComponent`、`HeroOfTheMonthComponent` 與 `HeroesBaseComponent`。
這些元件中的每一個都有自己的 `HeroService` 實例，管理它自己獨立的英雄集合。

</div>

<div class="alert is-helpful">

### 休息一下！
許多 Angular 開發者可能只需要這麼多的依賴注入知識，
就能建置他們的應用程式。它並不總是需要更複雜。

</div>

{@a multiple-service-instances}

## 多個服務實例（沙箱化）

有時候你會希望在*元件階層的同一層級*有多個服務實例。

一個很好的例子是：某個服務為其搭配的元件實例保存狀態。
每個元件都需要一個獨立的服務實例。
每個服務都有自己的工作狀態，與其他元件的服務及狀態相互隔離。
這稱為*沙箱化*，因為每個服務與元件實例都有自己的沙箱可以發揮。

{@a hero-bios-component}
想像一個 `HeroBiosComponent`，它呈現三個 `HeroBioComponent` 的實例。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="simple" title="ap/hero-bios.component.ts">

</code-example>

每個 `HeroBioComponent` 可以編輯單一英雄的傳記。
`HeroBioComponent` 依賴 `HeroCacheService` 來擷取、快取該英雄，並對其執行其他持久性操作。

<code-example path="dependency-injection-in-action/src/app/hero-cache.service.ts" region="service" title="src/app/hero-cache.service.ts">

</code-example>

顯然，三個 `HeroBioComponent` 實例不能共用同一個 `HeroCacheService`。
它們會為了決定要快取哪個英雄而互相競爭。

每個 `HeroBioComponent` 透過在它的詮釋資料 `providers` 陣列中列出 `HeroCacheService`，
獲得它*自己*的 `HeroCacheService` 實例。

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="component" title="src/app/hero-bio.component.ts">

</code-example>

父元件 `HeroBiosComponent` 將一個值繫結到 `heroId`。
`ngOnInit` 將該 `id` 傳給服務，服務則擷取並快取英雄。
`hero` 屬性的 getter 從服務中提取快取的英雄。
而範本顯示這個資料繫結的屬性。

請在 <live-example name="dependency-injection-in-action">即時程式碼</live-example>
中找到這個範例，並確認三個 `HeroBioComponent` 實例各自擁有快取的英雄資料。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios.png" alt="Bios">
</figure>

{@a optional}

{@a qualify-dependency-lookup}

## 使用 _@Optional()_ 與 `@Host()` 限定依賴查詢

當元件請求一個依賴時，Angular 從該元件的注入器開始，沿著注入器樹向上走，
直到它找到第一個合適的提供者為止。如果 Angular 在該次步行中找不到依賴，它就會拋出錯誤。

在大多數時候，你*希望*這種行為。
但有時你需要限制搜尋及/或容忍缺失的依賴。
你可以使用 `@Host` 與 `@Optional` 限定裝飾器，來修改 Angular 的搜尋行為，
兩者可以單獨使用或一起使用。

`@Optional` 裝飾器告訴 Angular，當它找不到依賴時要繼續。
Angular 會將注入參數設為 `null`。

`@Host` 裝飾器將向上搜尋停在*宿主元件*處。

宿主元件通常就是請求依賴的元件。
但當這個元件被投射到一個*父*元件中時，該父元件就會成為宿主。
下一個範例涵蓋了這第二種情況。

{@a demonstration}

### 示範
這個 `HeroBiosAndContactsComponent` 是你先前在[上面](guide/dependency-injection-in-action#hero-bios-component)看過的 `HeroBiosComponent` 的修訂版。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="hero-bios-and-contacts" title="src/app/hero-bios.component.ts (HeroBiosAndContactsComponent)">

</code-example>

請注意範本：

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="template" title="dependency-injection-in-action/src/app/hero-bios.component.ts" linenums="false">

</code-example>

現在，`<hero-bio>` 標籤之間有一個新的 `<hero-contact>` 元素。
Angular 將對應的 `HeroContactComponent` *投射*（或*轉入*）到 `HeroBioComponent` 檢視中，
將它放在 `HeroBioComponent` 範本的 `<ng-content>` 槽中：

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="template" title="src/app/hero-bio.component.ts (template)" linenums="false">

</code-example>

這是它的樣子，來自 `HeroContactComponent` 的英雄電話號碼被投射在英雄描述的上方：

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-and-content.png" alt="bio and contact">
</figure>

以下是 `HeroContactComponent`，它示範了這些限定裝飾器：

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="component" title="src/app/hero-contact.component.ts">

</code-example>

專注於建構子參數：

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="ctor-params" title="src/app/hero-contact.component.ts" linenums="false">

</code-example>

修飾 `heroCache` 屬性的 `@Host()` 函式確保
你從父元件 `HeroBioComponent` 取得對快取服務的參照。
如果父元件缺少該服務，Angular 就會拋出錯誤，即使在元件樹中更高處的元件剛好有該服務。

第二個 `@Host()` 函式修飾了 `loggerService` 屬性。
應用程式中唯一的 `LoggerService` 實例是在 `AppComponent` 層級提供的。
宿主 `HeroBioComponent` 沒有它自己的 `LoggerService` 提供者。

如果你沒有也用 `@Optional()` 函式修飾該屬性，Angular 就會拋出錯誤。
多虧了 `@Optional()`，Angular 將 `loggerService` 設為 null，其餘的元件會隨之適應。

以下是 `HeroBiosAndContactsComponent` 實際運作的樣子。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios-and-contacts.png" alt="Bios with contact into">
</figure>

如果你註解掉 `@Host()` 裝飾器，Angular 現在會往上遍歷注入器祖先樹，
直到它在 `AppComponent` 層級找到記錄器。記錄器邏輯開始運作，英雄顯示會更新，
並帶有那個多餘的 "!!!"，表示已找到記錄器。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-contact-no-host.png" alt="Without @Host">
</figure>

另一方面，如果你還原 `@Host()` 裝飾器並註解掉 `@Optional`，
應用程式就會因為在宿主元件層級缺少必要的記錄器而失敗。
<br>
`EXCEPTION: No provider for LoggerService! (HeroContactComponent -> LoggerService)`
{@a component-element}

## 注入元件的 DOM 元素

有時候你可能需要存取元件對應的 DOM 元素。
雖然開發者努力避免這樣做，但許多視覺效果與第三方工具（例如 jQuery）
都需要存取 DOM。

為了說明，這裡是來自
[屬性指令](guide/attribute-directives) 頁面的 `HighlightDirective` 的簡化版本。

<code-example path="dependency-injection-in-action/src/app/highlight.directive.ts" title="src/app/highlight.directive.ts">

</code-example>

當使用者將滑鼠移到套用了該指令的 DOM 元素上時，
該指令會將背景設為醒目提示色彩。

Angular 將建構子的 `el` 參數設為注入的 `ElementRef`，它是
該 DOM 元素的包裝器。
它的 `nativeElement` 屬性公開了 DOM 元素，讓指令可以操控。

範例程式碼將指令的 `myHighlight` 屬性套用到兩個 `<div>` 標籤，第一個沒有值（產生預設顏色），第二個有指定的顏色值。

<code-example path="dependency-injection-in-action/src/app/app.component.html" region="highlight" title="src/app/app.component.html (highlight)" linenums="false">

</code-example>

下圖顯示了將滑鼠移到 `<hero-bios-and-contacts>` 標籤上時的效果。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/highlight.png" alt="Highlighted bios">
</figure>

{@a providers}

## 用提供者定義依賴

本節示範如何撰寫提供依賴服務的提供者。

透過給予依賴注入器一個***權杖***，從它取得一個服務。

你通常讓 Angular 透過指定建構子參數及其型別來處理這筆交易。
參數型別充當注入器的查找*權杖*。
Angular 將這個權杖傳給注入器，並將結果指派給該參數。
這裡是一個典型範例：

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="ctor" title="src/app/hero-bios.component.ts (component constructor injection)" linenums="false">

</code-example>

Angular 向注入器要求與 `LoggerService` 相關聯的服務，
並將回傳的值指派給 `logger` 參數。

注入器從哪裡取得那個值？
它可能已經在內部容器中有了那個值。
如果沒有，它可能可以藉助***提供者***來建立一個。
*提供者*是交付與*權杖*相關聯的服務的配方。

<div class="l-sub-section">

如果注入器沒有所請求*權杖*的提供者，它會將請求委派
給其父注入器，在那裡這個過程不斷重複，直到沒有更多的注入器為止。
如果搜尋徒勞無功，注入器就會拋出錯誤&mdash;除非該請求是[可選的](guide/dependency-injection-in-action#optional)。

</div>

新的注入器沒有提供者。
Angular 會用它在意的一些提供者來初始化它所建立的注入器。
你必須手動註冊你_自己的_應用程式提供者，
通常是在 `Component` 或 `Directive` 詮釋資料的 `providers` 陣列中：

<code-example path="dependency-injection-in-action/src/app/app.component.ts" region="providers" title="src/app/app.component.ts (providers)">

</code-example>

{@a defining-providers}

### 定義提供者

簡單的類別提供者是目前為止最典型的。
你在 `providers` 陣列中提到這個類別，就完成了。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="class-provider" title="src/app/hero-bios.component.ts (class provider)" linenums="false">

</code-example>

之所以如此簡單，是因為最常見的注入服務是類別的實例。
但不是每個依賴都能透過建立類別的新實例來滿足。
你需要其他交付依賴值的方法，這意味著你需要其他指定提供者的方法。

`HeroOfTheMonthComponent` 範例示範了許多替代方案，以及你為什麼需要它們。
它在視覺上很簡單：一些屬性，以及記錄器所產生的記錄。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-of-month.png" alt="Hero of the month">
</figure>

它背後的程式碼給了你很多思考的空間。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="hero-of-the-month" title="hero-of-the-month.component.ts">

</code-example>

{@a provide}

#### *provide* 物件實字

`provide` 物件實字接受一個*權杖*和一個*定義物件*。
*權杖*通常是一個類別，但[它不一定非得是](guide/dependency-injection-in-action#tokens)。

*定義*物件有一個必要的屬性，指定如何建立服務的單例實例。在這個例子中，該屬性。

{@a usevalue}

#### useValue&mdash;*值提供者*

將 `useValue` 屬性設為一個***固定值***，提供者可以將它作為服務實例（又稱「依賴物件」）回傳。

使用這項技術提供*執行時期設定常數*，例如網站基底地址與功能旗標。
你可以在單元測試中使用*值提供者*，將正式環境的服務替換為假的或模擬的。

`HeroOfTheMonthComponent` 範例有兩個*值提供者*。
第一個提供 `Hero` 類別的一個實例；
第二個指定一個實字字串資源：

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-value" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

`Hero` 提供者權杖是一個類別，這很合理，因為該值是一個 `Hero`，
而且注入的英雄的消費者會希望有型別資訊。

`TITLE` 提供者權杖*不是一個類別*。
它是一種特殊類型的提供者查找鍵，稱為 [InjectionToken](guide/dependency-injection-in-action#injection-token)。
你可以為任何類型的提供者使用 `InjectionToken`，但當依賴是一個簡單的值（例如字串、數字或函式）時，它特別有幫助。

*值提供者*的值必須在*現在*定義。你不能稍後再建立該值。
顯然，標題字串實字可以立即取得。
本範例中的 `someHero` 變數是在檔案較早的地方設定的：

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="some-hero" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

其他提供者則在注入需要它們時，*延遲*建立它們的值。

{@a useclass}

#### useClass&mdash;*類別提供者*

`useClass` 提供者會建立並回傳指定類別的新實例。

使用這項技術為常見或預設的類別***替換一個替代實作***。
該替代方案可以實作不同的策略、擴充預設類別，
或在測試用例中模仿真實類別的行為。

以下是 `HeroOfTheMonthComponent` 中的兩個範例：

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-class" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

第一個提供者是最典型情況的*去糖化*展開形式，在該情況中
要建立的類別 (`HeroService`) 也是提供者的依賴注入權杖。
它採用這種冗長形式，是為了揭開首選簡短形式的神秘面紗。

第二個提供者用 `DateLoggerService` 替換 `LoggerService`。
`LoggerService` 已經在 `AppComponent` 層級註冊。
當_這個元件_請求 `LoggerService` 時，它收到的是 `DateLoggerService`。

<div class="l-sub-section">

這個元件及其子元件樹會收到 `DateLoggerService` 實例。
樹之外的元件會繼續收到原始的 `LoggerService` 實例。

</div>

`DateLoggerService` 繼承自 `LoggerService`；它將目前日期/時間附加到每條訊息中：

<code-example path="dependency-injection-in-action/src/app/date-logger.service.ts" region="date-logger-service" title="src/app/date-logger.service.ts" linenums="false">

</code-example>

{@a useexisting}

#### _useExisting_&mdash;*別名提供者*

`useExisting` 提供者將一個權杖對映到另一個權杖。
實際上，第一個權杖是與第二個權杖相關聯之服務的***別名***，
建立了***存取同一個服務物件的兩種方法***。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

透過別名介面縮小 API 的範圍，是這種技術的_一個_重要使用案例。
以下範例展示了用於此目的的別名。

想像 `LoggerService` 有一個龐大的 API，比實際的三個方法與一個屬性大得多。
你可能希望將該 API 表面縮小到只剩你實際需要的成員。
在這裡，`MinimalLogger` [*類別介面*](guide/dependency-injection-in-action#class-interface) 將 API 縮減為兩個成員：

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" title="src/app/minimal-logger.service.ts" linenums="false">

</code-example>

現在，在 `HeroOfTheMonthComponent` 的簡化版本中實際使用它。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.1.ts" title="src/app/hero-of-the-month.component.ts (minimal version)" linenums="false">

</code-example>

`HeroOfTheMonthComponent` 建構子的 `logger` 參數的型別為 `MinimalLogger`，因此在具有 TypeScript 意識的編輯器中，只有 `logs` 與 `logInfo` 成員是可見的：

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/minimal-logger-intellisense.png" alt="MinimalLogger restricted API">
</figure>

在幕後，Angular 實際上將 `logger` 參數設定為在 `LoggingService` 權杖下註冊的完整服務，而它恰好就是[上面提供](guide/dependency-injection-in-action#useclass)的 `DateLoggerService`。

<div class="l-sub-section">

下圖顯示了記錄日期，證實了這一點：

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/date-logger-entry.png" alt="DateLoggerService entry">
</figure>

</div>

{@a usefactory}

#### _useFactory_&mdash;*工廠提供者*

`useFactory` 提供者透過呼叫工廠函式來建立依賴物件，
如本範例所示。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-factory" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

使用這項技術，透過其輸入是***注入服務與本機狀態的某種組合***的工廠函式，來***建立一個依賴物件***。

*依賴物件*不一定要是類別實例。它可以是任何東西。
在本範例中，*依賴物件*是「本月英雄」競賽的
亞軍名字所組成的字串。

本機狀態是數字 `2`，即這個元件應該顯示的亞軍數量。
它使用 `2` 立即執行了 `runnersUpFactory`。

`runnersUpFactory` 本身不是提供者工廠函式。
真正的提供者工廠函式是 `runnersUpFactory` 回傳的那個函式。

<code-example path="dependency-injection-in-action/src/app/runners-up.ts" region="factory-synopsis" title="runners-up.ts (excerpt)" linenums="false">

</code-example>

該回傳的函式接受一位獲勝的 `Hero` 和一個 `HeroService` 作為引數。

Angular 從由 `deps` 陣列中的兩個*權杖*所標識的注入值中提供這些引數。
這兩個 `deps` 值是注入器用來提供這些工廠函式依賴的*權杖*。

在完成一些未公開的工作後，該函式回傳名字字串，
而 Angular 將它注入到 `HeroOfTheMonthComponent` 的 `runnersUp` 參數中。

<div class="l-sub-section">

這個函式會從 `HeroService` 取得候選英雄，
取其中 `2` 位作為亞軍，並回傳串連後的名稱。
請參閱 <live-example name="dependency-injection-in-action"></live-example>
以查看完整的原始碼。

</div>

{@a tokens}

## 提供者權杖的替代方案：*類別介面*與 *InjectionToken*

當提供者*權杖*是一個類別時，Angular 依賴注入最為簡單，
該類別同時也是回傳的依賴物件的型別，也就是你通常所說的*服務*。

但權杖不一定要是類別；即使它是一個類別，
它也不一定要與回傳的物件是相同的型別。
這是下一節的主題。
{@a class-interface}

### class-interface
先前的*本月英雄*範例使用 `MinimalLogger` 類別
作為 `LoggerService` 的提供者的權杖。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

`MinimalLogger` 是一個抽象類別。

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" title="dependency-injection-in-action/src/app/minimal-logger.service.ts" linenums="false">

</code-example>

通常你會繼承自一個抽象類別。
但本應用程式中*沒有任何類別*繼承自 `MinimalLogger`。

`LoggerService` 與 `DateLoggerService` _本來可以_繼承自 `MinimalLogger`。
它們_也可以_以介面的方式實作它。
但它們兩者都沒有。
`MinimalLogger` 被專門用作依賴注入權杖。

當你以這種方式使用一個類別時，它被稱為***類別介面***。
*類別介面*的關鍵好處是，你可以獲得介面的強型別，
並且可以***將它用作提供者權杖***，就像你使用普通類別一樣。

***類別介面***應該只定義其消費者被允許呼叫的那些成員。
這樣狹窄的介面有助於將具體類別與其消費者解耦。

<div class="l-sub-section">

#### 為什麼 *MinimalLogger* 是一個類別，而不是 TypeScript 介面
你不能使用介面作為提供者權杖，因為
介面不是 JavaScript 物件。
它們只存在於 TypeScript 設計空間中。
它們在程式碼被轉譯為 JavaScript 後就會消失。

提供者權杖必須是某種真實的 JavaScript 物件：
例如函式、物件、字串或類別。

使用類別作為介面，讓你可以在真實的 JavaScript 物件中獲得介面的特性。

當然，真實的物件會佔用記憶體。為了盡量減少記憶體成本，類別應該*沒有實作*。
`MinimalLogger` 會轉譯為這個未經最佳化、未縮小化的建構子函式 JavaScript：

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" region="minimal-logger-transpiled" title="dependency-injection-in-action/src/app/minimal-logger.service.ts" linenums="false">

</code-example>

請注意，它沒有任何一個成員。無論你為類別增加多少成員，它永遠都不會變大，*只要那些成員只是有型別宣告但沒有實作*。再看一次 TypeScript 的 `MinimalLogger` 類別，確認它沒有實作。

</div>

{@a injection-token}

### _InjectionToken_

依賴物件可以是日期、數字與字串這類簡單值，或是
陣列與函式這類無固定形狀的物件。

這類物件沒有應用程式介面，因此用類別來表示並不合適。
它們更適合用一個既唯一又有象徵意義的 token 來表示，
也就是一個 JavaScript 物件，它有一個好記的名稱，但不會與恰好同名的另一個 token 衝突。

`InjectionToken` 有這些特性。
你在*本月英雄*範例中遇到過它們兩次，
在*標題*值提供者中和在 *runnersUp* 工廠提供者中。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="provide-injection-token" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

你像這樣建立 `TITLE` token：

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="injection-token" title="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

型別參數雖然是選用的，但它能向開發者與工具傳達依賴的型別。
token 描述則是另一項協助開發者的資訊。

{@a di-inheritance}

## 注入到衍生類別中
撰寫一個繼承自另一個元件的元件時，要小心。
如果基底元件有注入的依賴，
你必須在衍生類別中重新提供並重新注入它們，
然後再透過建構子將它們傳遞給基底類別。

在這個人為設計的範例中，`SortedHeroesComponent` 繼承自 `HeroesBaseComponent`，
以顯示一份*排序過*的英雄清單。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/sorted-heroes.png" alt="Sorted Heroes">
</figure>

`HeroesBaseComponent` 可以獨立存在。
它要求有自己的 `HeroService` 實例來取得英雄，
並按照它們從資料庫抵達的順序顯示它們。

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="heroes-base" title="src/app/sorted-heroes.component.ts (HeroesBaseComponent)">

</code-example>

<div class="l-sub-section">

***讓建構子保持簡單。*** 它們應該只做初始化變數這一點小事多一點。
這條規則使元件在測試下可以安全地建構，不必擔心它會做出像與伺服器通訊這樣戲劇性的事。
這就是為什麼你從 `ngOnInit` 中呼叫 `HeroService`，而不是在建構子中。

</div>

使用者希望以字母順序查看英雄。
與其修改原始元件，不如建立它的子類別，也就是
`SortedHeroesComponent`，在呈現英雄之前先為他們排序。
`SortedHeroesComponent` 讓基礎類別去擷取英雄。

很可惜，Angular 無法直接把 `HeroService` 注入基礎類別。
你必須再次為*這個*元件提供 `HeroService`，
再於建構子內部把它傳給基礎類別。

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="sorted-heroes" title="src/app/sorted-heroes.component.ts (SortedHeroesComponent)">

</code-example>

現在請注意 `afterGetHeroes()` 方法。
你的第一直覺可能是，在 `SortedHeroesComponent` 中建立一個 `ngOnInit` 方法並在那裡排序。
但 Angular 會在呼叫基礎類別的 `ngOnInit` *之前*，先呼叫*衍生*類別的 `ngOnInit`，
所以你會在英雄陣列*抵達之前*就對它排序。這會產生一個棘手的錯誤。

覆寫基礎類別的 `afterGetHeroes()` 方法可以解決這個問題。

這些複雜情況說明了應該*避免使用元件繼承*。

{@a find-parent}

## 透過注入找到父元件

應用程式元件經常需要分享資訊。
資料繫結與服務分享等更鬆散耦合的技術
更可取。但有時候，一個元件
直接參照另一個元件是有道理的，
也許是為了存取該元件上的值或呼叫它的方法。

在 Angular 中取得元件參照有點棘手。
雖然 Angular 應用程式是元件樹，
但沒有公開的 API 可以檢查並遍歷那棵樹。

有一個可以取得子參照的 API。
請在 [API 參考](api/) 中查看 `Query`、`QueryList`、`ViewChildren` 與 `ContentChildren`。

沒有公開的 API 可以取得父參照。
但因為每個元件實例都會被加入到注入器的容器中，
你可以使用 Angular 依賴注入來到達父元件。

本節說明一些達成此目的的技巧。

{@a known-parent}

### 尋找已知型別的父元件

你可以使用標準的類別注入，來取得型別已知的父元件。

在下列範例中，父元件 `AlexComponent` 有數個子元件，其中包括 `CathyComponent`：

{@a alex}

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-1" title="parent-finder.component.ts (AlexComponent v.1)" linenums="false">

</code-example>

在把 `AlexComponent` 注入她的建構子之後，*Cathy* 會回報她是否能夠存取 *Alex*：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="cathy" title="parent-finder.component.ts (CathyComponent)" linenums="false">

</code-example>

請注意，雖然有 [@Optional](guide/dependency-injection-in-action#optional) 限定詞
作為安全措施，
但<live-example name="dependency-injection-in-action"></live-example>
證實了 `alex` 參數已有設定。

{@a base-parent}

### 無法透過其基底類別找到父元件

如果你*不知道*具體的父元件類別，該怎麼辦？

一個可重複使用的元件可能是多個元件的子元件。
想像一個用來算繪某金融工具突發新聞的元件。
基於業務上的理由，這個新聞元件會在其父元件的金融工具
資料隨市場資料串流變化時，頻繁地直接呼叫它。

應用程式可能定義了十幾個以上的金融工具元件。
如果你夠幸運，它們全都實作了同一個基礎類別，
而你的 `NewsComponent` 能理解該基礎類別的 API。

<div class="l-sub-section">

尋找實作某個介面的元件會更好。
但這是不可能的，因為 TypeScript 介面在轉譯後的 JavaScript 中會消失，而 JavaScript 不支援介面。
沒有任何產物可以尋找。

</div>

這不一定是好的設計。
這個範例要探討的是*元件是否可以
透過父元件的基礎類別來注入其父元件*。

範例的 `CraigComponent` 探索了這個問題。[回頭看](guide/dependency-injection-in-action#alex)，
你會看到 `Alex` 元件從一個名為 `Base` 的類別*擴充*（*繼承*）。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" title="parent-finder.component.ts (Alex class signature)" linenums="false">

</code-example>

`CraigComponent` 嘗試把 `Base` 注入其 `alex` 建構子參數，並回報是否成功。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="craig" title="parent-finder.component.ts (CraigComponent)" linenums="false">

</code-example>

不幸的是，這行不通。

<live-example name="dependency-injection-in-action"></live-example>

證實了 `alex` 參數是 null。
*你不能透過其基底類別注入父元件。*

{@a class-interface-parent}

### 透過其類別介面找到父元件

你可以用[類別介面](guide/dependency-injection-in-action#class-interface)找到父元件。

父元件必須配合，以一個*類別介面*權杖的名義，提供指向它自己的一個*別名*。

回想一下，Angular 總是把元件實例加入它自己的注入器；
這就是為什麼你[先前](guide/dependency-injection-in-action#known-parent)能把 *Alex* 注入 *Cathy*。

撰寫一個[*別名提供者*](guide/dependency-injection-in-action#useexisting)&mdash;一個帶有 `useExisting`
定義的 `provide` 物件實字&mdash;它能建立注入同一個元件實例的*替代*方式，
並把該提供者加入 `AlexComponent` 的 `@Component` 詮釋資料的 `providers` 陣列：

{@a alex-providers}

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" title="parent-finder.component.ts (AlexComponent providers)" linenums="false">

</code-example>

[Parent](guide/dependency-injection-in-action#parent-token) 是該提供者的*類別介面*權杖。
[*forwardRef*](guide/dependency-injection-in-action#forwardref) 打破了你剛剛讓 `AlexComponent` 參照它自己所造成的循環參照。

*Carol* 是 *Alex* 的第三個子元件，它把父元件注入自己的 `parent` 參數，
方式和你之前做過的一樣：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-class" title="parent-finder.component.ts (CarolComponent class)" linenums="false">

</code-example>

以下是 *Alex* 一家實際運作的樣子：

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/alex.png" alt="Alex 實際運作">
</figure>

{@a parent-tree}

### 在父母樹中使用 _@SkipSelf()_ 找到父元件

想像元件階層的一個分支：*Alice* -> *Barry* -> *Carol*。
*Alice* 與 *Barry* 都實作了 `Parent` *類別介面*。

*Barry* 是問題所在。他需要到達他的父元件 *Alice*，同時也要擔任 *Carol* 的父元件。
這表示他必須既*注入* `Parent` *類別介面*以取得 *Alice*，
又*提供*一個 `Parent` 來滿足 *Carol*。

以下是 *Barry*：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry" title="parent-finder.component.ts (BarryComponent)" linenums="false">

</code-example>

*Barry* 的 `providers` 陣列看起來就和 [*Alex* 的](guide/dependency-injection-in-action#alex-providers)一模一樣。
如果你要繼續這樣撰寫[*別名提供者*](guide/dependency-injection-in-action#useexisting)，你應該建立一個[輔助函式](guide/dependency-injection-in-action#provideparent)。

現在先專注於 *Barry* 的建構子：

<code-tabs>

  <code-pane title="Barry's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry-ctor">

  </code-pane>

  <code-pane title="Carol's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-ctor">

  </code-pane>

</code-tabs>

它與 *Carol* 的建構子完全相同，只多了 `@SkipSelf` 裝飾器。

`@SkipSelf` 之所以必要，有兩個原因：

1. 它告訴注入器，從自身*上方*的元件開始搜尋 `Parent` 依賴，
而這*正是*父元件的含義。

2. 如果你省略 `@SkipSelf` 裝飾器，Angular 會擲出循環依賴錯誤。

  `Cannot instantiate cyclic dependency! (BethComponent -> Parent -> BethComponent)`

以下是 *Alice*、*Barry* 一家實際運作的樣子：

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/alice.png" alt="Alice 實際運作">
</figure>

{@a parent-token}

### *Parent* 類別介面
你[先前學過](guide/dependency-injection-in-action#class-interface)，*類別介面*是一個被當作介面、而非基底類別來使用的抽象類別。

本範例定義了一個 `Parent` *類別介面*。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="parent" title="parent-finder.component.ts (Parent class-interface)" linenums="false">

</code-example>

`Parent` *類別介面*定義了一個帶有型別宣告、但*沒有實作*的 `name` 屬性。
`name` 屬性是子元件唯一能呼叫的父元件成員。
如此狹窄的介面有助於讓子元件類別與其父元件解耦。

可以充當父元件的元件*應該*像 `AliceComponent` 一樣實作*類別介面*：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-class-signature" title="parent-finder.component.ts (AliceComponent class signature)" linenums="false">

</code-example>

這樣做能讓程式碼更清晰。但技術上並非必要。
雖然 `AlexComponent` 如其 `Base` 類別所要求的那樣有一個 `name` 屬性，
但它的類別簽名並未提及 `Parent`：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" title="parent-finder.component.ts (AlexComponent class signature)" linenums="false">

</code-example>

<div class="l-sub-section">

`AlexComponent` *應該*實作 `Parent`，這是良好風格的要求。
它在本範例中沒有這樣做，*只是*為了示範程式碼在沒有該介面的情況下也能編譯並執行

</div>

{@a provideparent}

### _provideParent()_ 輔助函式

撰寫同一個父元件*別名提供者*的各種變體會很快就讓人厭煩，
尤其是這個帶有 [*forwardRef*](guide/dependency-injection-in-action#forwardref) 的討厭長串：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" title="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

你可以把該邏輯抽取成像這樣的一個輔助函式：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-the-parent" title="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

現在你可以為你的元件加入一個更簡單、更有意義的父元件提供者：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-providers" title="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

你可以做得更好。目前版本的輔助函式只能為 `Parent` *類別介面*建立別名。
應用程式可能有各式各樣的父元件型別，每種都有自己的*類別介面*權杖。

以下是一個改訂版本，它預設使用 `parent`，但也接受一個可選的第二個參數，用於不同的父元件*類別介面*。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-parent" title="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

以下是你如何將它用於不同的父元件型別：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="beth-providers" title="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

{@a forwardref}

## 使用前向類別參考（*forwardRef*）打破循環

類別宣告的順序在 TypeScript 中很重要。
在類別被定義之前，你無法直接參照它。

這通常不是問題，特別是當你遵循建議的*一個檔案一個類別*規則時。
但有時循環參照無可避免。
當類別「A」參照類別「B」，而「B」參照「A」時，你就陷入了困境。
其中一個必須先被定義。

Angular 的 `forwardRef()` 函式會建立一個*間接*參照，讓 Angular 稍後再解析。

*Parent Finder* 範例充滿了無法打破的循環類別參考。

當一個類別*參照它自己*時，你就會面臨這個困境，
就像 `AlexComponent` 在其 `providers` 陣列中所做的那樣。
`providers` 陣列是 `@Component` 裝飾器函式的一個屬性，必須
出現在類別定義的*上方*。

用 `forwardRef` 打破這個循環：

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" title="parent-finder.component.ts (AlexComponent providers)" linenums="false">

</code-example>
