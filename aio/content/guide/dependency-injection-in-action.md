# 依賴注入實戰

本節探討 Angular 中依賴注入 (DI) 的許多功能。
{@a toc}

請參閱 <live-example name="dependency-injection-in-action"></live-example>，查看本食譜中的程式碼。

{@a nested-dependencies}

## 巢狀服務依賴

被注入服務的_消費者_不需要知道如何建立該服務。
建立與快取依賴是 DI 框架的工作。消費者只需要讓 DI 框架知道它需要哪些依賴。

有時某個服務依賴其他服務，而那些服務又可能依賴更多的服務。
依賴注入框架會以正確的順序解析這些巢狀依賴。
在每一步，依賴的消費者在自己的建構函式中宣告所需，並讓框架提供它們。

以下範例顯示 `AppComponent` 宣告它對 `LoggerService` 與 `UserContext` 的依賴。

<code-example path="dependency-injection-in-action/src/app/app.component.ts" region="ctor" header="src/app/app.component.ts" linenums="false">

</code-example>

`UserContext` 則同時依賴 `LoggerService` 與
`UserService`——另一個收集特定使用者資訊的服務。

<code-example path="dependency-injection-in-action/src/app/user-context.service.ts" region="injectables" header="user-context.service.ts (injection)" linenums="false">

</code-example>

當 Angular 建立 `AppComponent` 時，DI 框架會建立 `LoggerService` 的實例，並開始建立 `UserContextService`。
`UserContextService` 也需要 `LoggerService`，而框架已經有了，所以框架可以提供同一個實例。`UserContextService` 還需要 `UserService`，而框架尚未建立它。`UserService` 沒有進一步的依賴，所以框架可以直接用 `new` 實例化該類別，並把實例提供給 `UserContextService` 建構函式。

父元件 `AppComponent` 不需要知道依賴的依賴。
在建構函式中宣告所需（在此例中為 `LoggerService` 與 `UserContextService`），框架就會解析巢狀依賴。

當所有依賴就位後，`AppComponent` 就會顯示使用者資訊。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/logged-in-user.png" alt="Logged In User">
</figure>

{@a service-scope}

## 將服務範圍限制在元件子樹

Angular 應用程式有多個注入器，排列成與元件樹平行的樹狀階層。
每個注入器都會建立依賴的單例實例。
同一個實例會被注入到該注入器提供該服務的任何地方。
特定服務可以在注入器階層的任何層級提供與建立，這表示如果某服務由多個注入器提供，就可以有多個該服務的實例。

由根注入器提供的依賴可以注入到應用程式中*任何地方*的*任何*元件。
在某些情況下，你可能想將服務的可用範圍限制在應用程式的特定區域。
例如，你可能想讓使用者明確選擇加入以使用某個服務，而不是讓根注入器自動提供它。

你可以將被注入服務的範圍限制在應用程式階層的一個*分支*，方法是*在該分支的子根元件*提供該服務。
本範例示範如何透過將 `HeroService` 加入子元件 `@Component()` 裝飾器的 `providers` 陣列，讓 `HeroesBaseComponent` 使用不同的 `HeroService` 實例。

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="injection" header="src/app/sorted-heroes.component.ts (HeroesBaseComponent excerpt)">

</code-example>

當 Angular 建立 `HeroesBaseComponent` 時，它也會建立一個新的 `HeroService` 實例，該實例只對該元件及其子元件（如果有）可見。

你也可以在應用程式其他地方將 `HeroService` 提供給不同的元件。
那會產生一個不同的服務實例，存在於不同的注入器中。

<div class="alert is-helpful">

這類有範圍的 `HeroService` 單例範例出現在隨附的範例程式碼各處，包括 `HeroBiosComponent`、`HeroOfTheMonthComponent` 與 `HeroesBaseComponent`。
這些元件各自擁有自己的 `HeroService` 實例，管理自己獨立的英雄集合。

</div>

{@a multiple-service-instances}

## 多個服務實例（沙箱化）

有時候，你會希望在元件階層中的*相同層級*擁有多個服務實例。

一個很好的例子是：某個服務為其搭配的元件實例保存狀態。
每個元件都需要一個獨立的服務實例。
每個服務都有自己的工作狀態，與其他元件的服務及狀態相互隔離。
這稱為*沙箱化*，因為每個服務與元件實例都有自己的沙箱可以發揮。

{@a hero-bios-component}

在這個範例中，`HeroBiosComponent` 呈現了三個 `HeroBioComponent` 實例。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="simple" header="ap/hero-bios.component.ts">

</code-example>

每個 `HeroBioComponent` 都可以編輯單一英雄的傳記。
`HeroBioComponent` 依靠 `HeroCacheService` 來擷取、快取該英雄，並對其執行其他持久化操作。

<code-example path="dependency-injection-in-action/src/app/hero-cache.service.ts" region="service" header="src/app/hero-cache.service.ts">

</code-example>

三個 `HeroBioComponent` 實例無法共用同一個 `HeroCacheService` 實例，
因為它們會彼此競爭，決定要快取哪位英雄。

相反地，每個 `HeroBioComponent` 會在其中繼資料 `providers` 陣列中列出 `HeroCacheService`，藉此取得*專屬*的 `HeroCacheService` 實例。

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="component" header="src/app/hero-bio.component.ts">

</code-example>

父元件 `HeroBiosComponent` 會把一個值繫結到 `heroId`。
`ngOnInit` 把該 ID 傳給服務，服務會擷取並快取該英雄。
`hero` 屬性的 getter 會從服務中取出已快取的英雄。
範本會顯示這個資料繫結的屬性。

請在 <live-example name="dependency-injection-in-action">即時程式碼</live-example>
中找到這個範例，並確認三個 `HeroBioComponent` 實例各自擁有快取的英雄資料。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios.png" alt="Bios">
</figure>

{@a qualify-dependency-lookup}

## 使用參數裝飾器限定依賴查詢

當一個類別需要某個依賴時，該依賴會以參數的形式加入建構子中。
當 Angular 需要實例化該類別時，它會呼叫 DI 框架來提供該依賴。
預設情況下，DI 框架會在注入器階層中搜尋提供者，
從元件的本機注入器開始，必要時再沿著注入器樹往上冒泡，
直到抵達根注入器。

* 第一個設定了提供者的注入器，會把依賴（服務實例或值）提供給建構子。

* 如果在根注入器中找不到提供者，DI 框架會擲出錯誤。

有許多選項可以修改預設的搜尋行為，做法是在類別建構子的服務值參數上使用*參數裝飾器*。

{@a optional}

### 讓依賴成為 `@Optional`，並用 `@Host` 限制搜尋範圍

依賴可以在元件階層中的任何層級註冊。
當元件請求某個依賴時，Angular 會從該元件的注入器開始，
沿著注入器樹往上走，直到找到第一個合適的提供者。
如果在這個過程中找不到依賴，Angular 會擲出錯誤。

在某些情況下，你需要限制搜尋範圍，或是容納缺少的依賴。
你可以在元件建構子的服務值參數上，使用 `@Host` 與 `@Optional` 限定裝飾器來修改 Angular 的搜尋行為。

* `@Optional` 屬性裝飾器會告訴 Angular，在找不到依賴時回傳 null。

* `@Host` 屬性裝飾器會在*宿主元件*處停止往上搜尋。
宿主元件通常就是請求依賴的那個元件。
不過，當這個元件被投影到*父*元件中時，
該父元件就會成為宿主。下列範例涵蓋第二種情況。

這些裝飾器可以單獨使用，也可以一起使用，如範例所示。
這個 `HeroBiosAndContactsComponent` 是你先前在[上面](guide/dependency-injection-in-action#hero-bios-component)看過的 `HeroBiosComponent` 的修訂版。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="hero-bios-and-contacts" header="src/app/hero-bios.component.ts (HeroBiosAndContactsComponent)">

</code-example>

請注意範本：

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="template" header="dependency-injection-in-action/src/app/hero-bios.component.ts" linenums="false">

</code-example>

現在 `<hero-bio>` 標籤之間多了一個新的 `<hero-contact>` 元素。
Angular 會把對應的 `HeroContactComponent` *投影*（也就是*透傳*）到 `HeroBioComponent` 檢視中，
放在 `HeroBioComponent` 範本的 `<ng-content>` 插槽裡。

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="template" header="src/app/hero-bio.component.ts (template)" linenums="false">

</code-example>

結果如下所示，來自 `HeroContactComponent` 的英雄電話號碼會投影在英雄描述的上方。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-and-content.png" alt="bio and contact">
</figure>

以下是 `HeroContactComponent`，它示範了這些限定裝飾器。

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="component" header="src/app/hero-contact.component.ts">

</code-example>

請注意建構子的參數。

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="ctor-params" header="src/app/hero-contact.component.ts" linenums="false">

</code-example>

裝飾 `heroCache` 建構子屬性的 `@Host()` 函式，可確保你
取得來自父元件 `HeroBioComponent` 的快取服務參考。
如果父元件缺少該服務，Angular 就會擲出錯誤，即使元件樹中更高層級的元件有提供它也一樣。

第二個 `@Host()` 函式裝飾了 `loggerService` 建構子屬性。
應用程式中唯一的 `LoggerService` 實例是在 `AppComponent` 層級提供的。
宿主 `HeroBioComponent` 並沒有自己的 `LoggerService` 提供者。

如果你沒有同時用 `@Optional()` 裝飾該屬性，Angular 就會擲出錯誤。
當屬性被標記為選用時，Angular 會把 `loggerService` 設為 null，元件的其餘部分也會隨之調整。

以下是實際運作中的 `HeroBiosAndContactsComponent`。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios-and-contacts.png" alt="Bios with contact into">
</figure>

如果你把 `@Host()` 裝飾器註解掉，Angular 會沿著注入器的祖先樹往上走，
直到在 `AppComponent` 層級找到記錄器。
記錄器邏輯隨即啟動，英雄顯示內容會更新，
加上「!!!」標記，表示已找到記錄器。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-contact-no-host.png" alt="Without @Host">
</figure>

如果你恢復 `@Host()` 裝飾器並把 `@Optional` 註解掉，
當應用程式在宿主元件層級找不到所需的記錄器時，就會擲出例外。

`EXCEPTION: No provider for LoggerService! (HeroContactComponent -> LoggerService)`

### 使用 `@Inject` 提供自訂提供者

使用自訂提供者，能讓你為隱含的依賴提供具體的實作，例如內建的瀏覽器 API。下列範例使用 `InjectionToken`，將 [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 瀏覽器 API 作為 `BrowserStorageService` 中的依賴提供出來。

<code-example path="dependency-injection-in-action/src/app/storage.service.ts" header="src/app/storage.service.ts">

</code-example>

`factory` 函式會回傳附加在瀏覽器 window 物件上的 `localStorage` 屬性。`Inject` 裝飾器是一個建構子參數，用來指定依賴的自訂提供者。這個自訂提供者現在可以在測試期間，用 `localStorage` 的模擬 API 覆寫，而不必與真實的瀏覽器 API 互動。

{@a skip}

### 使用 `@Self` 與 `@SkipSelf` 修改提供者搜尋

提供者也可以透過建構子參數裝飾器，按注入器劃分範圍。下列範例在 `Component` 類別的 `providers` 中，以 `sessionStorage` 瀏覽器 API 覆寫 `BROWSER_STORAGE` token。同一個 `BrowserStorageService` 會在建構子中被注入兩次，分別以 `@Self` 與 `@SkipSelf` 裝飾，以定義由哪個注入器處理該提供者依賴。

<code-example path="dependency-injection-in-action/src/app/storage.component.ts" header="src/app/storage.component.ts">

</code-example>

使用 `@Self` 裝飾器時，注入器只會查看元件自身的注入器來尋找提供者。`@SkipSelf` 裝飾器則讓你可以略過本機注入器，往階層上方尋找能滿足此依賴的提供者。`sessionStorageService` 實例會使用 `sessionStorage` 瀏覽器 API 與 `BrowserStorageService` 互動，而 `localStorageService` 會略過本機注入器，改用使用 `localStorage` 瀏覽器 API 的根 `BrowserStorageService`。

{@a component-element}

## 注入元件的 DOM 元素

雖然開發者力求避免這麼做，但許多視覺效果和第三方工具（例如 jQuery）都需要存取 DOM。
因此，你可能需要存取元件的 DOM 元素。

為了說明，以下是從[屬性指令](guide/attribute-directives)頁面簡化而來的 `HighlightDirective`。

<code-example path="dependency-injection-in-action/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts">

</code-example>

當使用者將滑鼠移到套用此指令的
DOM 元素上時，該指令會把背景設為醒目色彩。

Angular 會把建構子的 `el` 參數設為注入的 `ElementRef`。
（`ElementRef` 是 DOM 元素的包裝器，
其 `nativeElement` 屬性會公開該 DOM 元素，供指令操作。）

範例程式碼將指令的 `myHighlight` 屬性套用到兩個 `<div>` 標籤，第一個沒有值（產生預設顏色），第二個有指定的顏色值。

<code-example path="dependency-injection-in-action/src/app/app.component.html" region="highlight" header="src/app/app.component.html (highlight)" linenums="false">

</code-example>

下圖顯示了將滑鼠移到 `<hero-bios-and-contacts>` 標籤上時的效果。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/highlight.png" alt="Highlighted bios">
</figure>

{@a providers}

## 用提供者定義依賴

本節示範如何撰寫提供依賴服務的提供者。

要從依賴注入器取得服務，你必須給它一個[權杖](guide/glossary#token)。
Angular 通常透過指定建構函式參數及其型別來處理這個交易。
參數型別就是注入器的查閱權杖。
Angular 將這個權杖傳給注入器，並將結果指派給參數。

以下是一個典型範例。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="ctor" header="src/app/hero-bios.component.ts (component constructor injection)" linenums="false">

</code-example>

Angular 向注入器詢問與 `LoggerService` 關聯的服務，並將回傳值指派給 `logger` 參數。

如果注入器已經快取了與該權杖關聯的服務實例，它會提供該實例。
如果沒有，它需要使用與該權杖關聯的提供者來建立一個。

<div class="alert is-helpful">

如果注入器沒有所請求權杖的提供者，它會將請求委派給其父注入器，在那裡重複這個過程，直到沒有更多注入器為止。
如果搜尋失敗，注入器會拋出錯誤&mdash;除非該請求是[可選的](guide/dependency-injection-in-action#optional)。

</div>

新的注入器沒有提供者。
Angular 會用一組慣用的提供者初始化它所建立的注入器。
你必須為自己應用程式專屬的依賴設定提供者。

{@a defining-providers}

### 定義提供者

依賴不一定總能用實例化類別的預設方法來建立。
你在 [Dependency Providers](guide/dependency-injection-providers) 中學過其他一些方法。
下列 `HeroOfTheMonthComponent` 範例示範了許多替代做法，以及你為什麼需要它們。
它在視覺上很簡單：只有幾個屬性，以及記錄器產生的日誌。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-of-month.png" alt="Hero of the month">
</figure>

其背後的程式碼自訂了 DI 框架提供依賴的方式與位置。
這些使用案例說明了使用 [*provide* 物件字面值](guide/dependency-injection-providers#provide)，將定義物件與 DI token 建立關聯的不同方式。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="hero-of-the-month" header="hero-of-the-month.component.ts">

</code-example>

`providers` 陣列展示了你可以如何使用不同的提供者定義鍵：
`useValue`、`useClass`、`useExisting` 或 `useFactory`。

{@a usevalue}

#### 值提供者：`useValue`

`useValue` 鍵可讓你把一個固定值與 DI token 建立關聯。
使用這種技巧來提供*執行階段設定常數*，例如網站的基底位址與功能旗標。
你也可以在單元測試中使用值提供者，以模擬資料取代正式的資料服務。

`HeroOfTheMonthComponent` 範例有兩個值提供者。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-value" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

* 第一個提供者為 `Hero` token 提供一個現有的 `Hero` 類別實例，而不要求
注入器用 `new` 建立新實例，或使用它自己快取的實例。
在這裡，token 就是類別本身。

* 第二個指定一個字面字串資源，供 `TITLE` token 使用。
`TITLE` 提供者 token *不是*一個類別，而是一種
特殊的提供者查詢鍵，稱為[注入 token](guide/dependency-injection-in-action#injection-token)，
由 `InjectionToken` 實例表示。

你可以為任何類型的提供者使用注入 token，不過當依賴是字串、數字或函式這類簡單值時，它特別有幫助。

*值提供者*的值必須在你於此處指定它之前就先定義好。
標題字串字面值是立即可以取得的。
這個範例中的 `someHero` 變數已在檔案中較前面的位置設定，如下所示。
你不能使用值會在稍後才定義的變數。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="some-hero" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

其他類型的提供者可以*延遲*建立它們的值；也就是說，在需要注入時才建立。

{@a useclass}

#### 類別提供者：`useClass`

`useClass` 提供者鍵讓你建立並傳回指定類別的新實例。

你可以使用這類提供者，為常用或預設的類別替換上*替代實作*。
替代實作可以例如實作不同的策略、擴充預設類別，或在測試案例中模擬真實類別的行為。

下列程式碼展示了 `HeroOfTheMonthComponent` 中的兩個範例。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-class" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

第一個提供者是最典型情況的*去語法糖*展開形式，在這種情況下，
要建立的類別（`HeroService`）同時也是提供者的依賴注入 token。
一般來說較偏好簡短形式；這種長形式則把細節明確寫出來。

第二個提供者以 `DateLoggerService` 取代 `LoggerService`。
`LoggerService` 已經在 `AppComponent` 層級註冊。
當這個子元件請求 `LoggerService` 時，它收到的會是 `DateLoggerService` 實例。

<div class="alert is-helpful">

這個元件及其子元件樹會收到 `DateLoggerService` 實例。
在樹之外的元件則繼續收到原始的 `LoggerService` 實例。

</div>

`DateLoggerService` 繼承自 `LoggerService`；它會在每則訊息後面附加目前的日期／時間：

<code-example path="dependency-injection-in-action/src/app/date-logger.service.ts" region="date-logger-service" header="src/app/date-logger.service.ts" linenums="false">

</code-example>

{@a useexisting}

#### 別名提供者：`useExisting`

`useExisting` 提供者鍵讓你將一個 token 對應到另一個 token。
實際上，第一個 token 是與第二個 token 相關聯之服務的別名，
從而建立了兩種存取同一個服務物件的方式。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

你可以使用這種技巧，透過別名介面來縮小 API。
下列範例展示了為此目的引入的別名。

想像 `LoggerService` 有一個龐大的 API，遠比實際的三個方法與一個屬性來得大。
你可能會想把 API 介面縮小到只剩你實際需要的成員。
在這個範例中，`MinimalLogger` [類別介面](#class-interface)把 API 縮減為兩個成員：

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" header="src/app/minimal-logger.service.ts" linenums="false">

</code-example>

下列範例在簡化版的 `HeroOfTheMonthComponent` 中使用 `MinimalLogger`。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.1.ts" header="src/app/hero-of-the-month.component.ts (minimal version)" linenums="false">

</code-example>

`HeroOfTheMonthComponent` 建構子的 `logger` 參數被定型為 `MinimalLogger`，因此在支援 TypeScript 的編輯器中，只會看到 `logs` 與 `logInfo` 這兩個成員。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/minimal-logger-intellisense.png" alt="MinimalLogger restricted API">
</figure>

在幕後，Angular 會把 `logger` 參數設為在 `LoggingService` token 下註冊的完整服務，也就是[上面提供](guide/dependency-injection-in-action#useclass)的 `DateLoggerService` 實例。

<div class="alert is-helpful">

下圖說明了這一點，圖中顯示了記錄日期。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/date-logger-entry.png" alt="DateLoggerService entry">
</figure>

</div>

{@a usefactory}

#### 工廠提供者：`useFactory`

`useFactory` 提供者鍵可讓你透過呼叫工廠函式來建立依賴物件，
如下列範例所示。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-factory" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

注入器會呼叫你作為 `useFactory` 鍵的值所提供的工廠函式，藉此提供依賴值。
請注意，這種形式的提供者有第三個鍵 `deps`，用來指定
`useFactory` 函式的依賴。

使用這種技巧，透過工廠函式來建立依賴物件，
其輸入是*注入的服務*與*本機狀態*的組合。

依賴物件（由工廠函式回傳）通常是類別實例，
但也可以是其他東西。
在這個範例中，依賴物件是一個字串，內容是「本月英雄」競賽亞軍們的名字。

在這個範例中，本機狀態是數字 `2`，也就是元件應該顯示的亞軍人數。
這個狀態值會作為引數傳給 `runnersUpFactory()`。
`runnersUpFactory()` 會回傳*提供者工廠函式*，它可以同時使用
傳入的狀態值，以及注入的服務 `Hero` 與 `HeroService`。

<code-example path="dependency-injection-in-action/src/app/runners-up.ts" region="factory-synopsis" header="runners-up.ts (excerpt)" linenums="false">

</code-example>

提供者工廠函式（由 `runnersUpFactory()` 回傳）會回傳實際的依賴物件，
也就是那個名字字串。

* 這個函式接受獲勝的 `Hero` 與 `HeroService` 作為引數。
Angular 會根據 `deps` 陣列中兩個 *token* 所識別的注入值來提供這些引數。

* 這個函式會回傳名字字串，Angular 再把它注入
`HeroOfTheMonthComponent` 的 `runnersUp` 參數中。

<div class="alert is-helpful">

這個函式會從 `HeroService` 取得候選英雄，
取其中 `2` 位作為亞軍，並回傳串連後的名稱。
請參閱 <live-example name="dependency-injection-in-action"></live-example>
以查看完整的原始碼。

</div>

{@a tokens}

## 提供者 token 的替代方案：類別介面與「InjectionToken」

當提供者 token 是一個類別，
同時也是回傳的依賴物件（也就是服務）的型別時，Angular 的依賴注入最為簡單。

不過，token 不必是類別，即使它是類別，
也不必與回傳物件的型別相同。
這就是下一節的主題。
{@a class-interface}

### 類別介面

前一個*本月英雄*範例使用 `MinimalLogger` 類別
作為 `LoggerService` 提供者的 token。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

`MinimalLogger` 是一個抽象類別。

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" header="dependency-injection-in-action/src/app/minimal-logger.service.ts" linenums="false">

</code-example>

抽象類別通常是你可以擴充的基礎類別。
不過，在這個應用程式中，並沒有任何類別繼承自 `MinimalLogger`。
`LoggerService` 與 `DateLoggerService` 本來可以繼承 `MinimalLogger`，
或者改以介面的方式實作它。
但它們兩者都沒有這麼做。
`MinimalLogger` 僅用作依賴注入 token。

當你以這種方式使用類別時，它稱為*類別介面*。

如 [DI 提供者](guide/dependency-injection-providers#interface-not-valid-token)所述，介面不是有效的 DI 權杖，因為它是 TypeScript 的產物，在執行時不存在。
使用這個抽象類別介面來獲得介面的強型別，同時也能像一般類別一樣將它用作提供者權杖。

類別介面應該*只*定義其使用者被允許呼叫的成員。
這種縮小範圍的介面有助於讓具體類別與其使用者解耦。

<div class="alert is-helpful">

使用類別作為介面，可以讓你在真實的 JavaScript 物件中獲得介面的特性。
不過，為了將記憶體成本降到最低，該類別應該*沒有實作*。
`MinimalLogger` 會被轉譯成下列未經最佳化、壓縮前的 JavaScript 建構子函式。

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" region="minimal-logger-transpiled" header="dependency-injection-in-action/src/app/minimal-logger.service.ts" linenums="false">

</code-example>

請注意，它沒有任何成員。無論你為類別加入多少成員，它都不會變大，
只要那些成員只有型別、沒有實作。

請再看一次 TypeScript 的 `MinimalLogger` 類別，確認它沒有任何實作。

</div>

{@a injection-token}

### 「InjectionToken」物件

依賴物件可以是日期、數字與字串這類簡單值，或是
陣列與函式這類無固定形狀的物件。

這類物件沒有應用程式介面，因此用類別來表示並不合適。
它們更適合用一個既唯一又有象徵意義的 token 來表示，
也就是一個 JavaScript 物件，它有一個好記的名稱，但不會與恰好同名的另一個 token 衝突。

`InjectionToken` 具有這些特性。
你在*本月英雄*範例中遇到過它兩次，
分別是在 *title* 值提供者與 *runnersUp* 工廠提供者中。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="provide-injection-token" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

你像這樣建立 `TITLE` token：

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="injection-token" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" linenums="false">

</code-example>

型別參數雖然是選用的，但它能向開發者與工具傳達依賴的型別。
token 描述則是另一項協助開發者的資訊。

{@a di-inheritance}

## 注入到衍生類別中

撰寫繼承自另一個元件的元件時要小心。
如果基礎元件有注入的依賴，
你必須在衍生類別中重新提供並重新注入它們，
再透過建構子把它們傳給基礎類別。

在這個人為設計的範例中，`SortedHeroesComponent` 繼承自 `HeroesBaseComponent`，
以顯示一份*排序過*的英雄清單。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/sorted-heroes.png" alt="Sorted Heroes">
</figure>

`HeroesBaseComponent` 可以獨立運作。
它需要自己的一份 `HeroService` 實例來取得英雄，
並按照英雄從資料庫抵達的順序顯示它們。

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="heroes-base" header="src/app/sorted-heroes.component.ts (HeroesBaseComponent)">

</code-example>

<div class="alert is-helpful">

### 保持建構子簡單

建構子應該只做初始化變數這類小事。
這條規則讓元件在測試時可以安全建構，不必擔心它會做出像與伺服器通訊這類大動作。
這就是為什麼你要從 `ngOnInit` 內部呼叫 `HeroService`，而不是從建構子呼叫。

</div>

使用者希望以字母順序查看英雄。
與其修改原始元件，不如建立它的子類別，也就是
`SortedHeroesComponent`，在呈現英雄之前先為他們排序。
`SortedHeroesComponent` 讓基礎類別去擷取英雄。

很可惜，Angular 無法直接把 `HeroService` 注入基礎類別。
你必須再次為*這個*元件提供 `HeroService`，
再於建構子內部把它傳給基礎類別。

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="sorted-heroes" header="src/app/sorted-heroes.component.ts (SortedHeroesComponent)">

</code-example>

現在請注意 `afterGetHeroes()` 方法。
你的第一直覺可能是，在 `SortedHeroesComponent` 中建立一個 `ngOnInit` 方法並在那裡排序。
但 Angular 會在呼叫基礎類別的 `ngOnInit` *之前*，先呼叫*衍生*類別的 `ngOnInit`，
所以你會在英雄陣列*抵達之前*就對它排序。這會產生一個棘手的錯誤。

覆寫基礎類別的 `afterGetHeroes()` 方法可以解決這個問題。

這些複雜情況說明了應該*避免使用元件繼承*。

{@a forwardref}

## 使用前向類別參考（*forwardRef*）打破循環

類別宣告的順序在 TypeScript 中很重要。
在類別被定義之前，你無法直接參考它。

這通常不是問題，特別是當你遵循建議的*一個檔案一個類別*規則時。
但有時循環參考無可避免。
當類別「A」參考類別「B」，而「B」參考「A」時，你就陷入困境。
其中一個必須先定義。

Angular 的 `forwardRef()` 函式會建立一個*間接*參考，讓 Angular 稍後再解析。

*Parent Finder* 範例充滿了無法打破的循環類別參考。

當一個類別*參考到自己本身*時，你就會面臨這個難題，
就像 `AlexComponent` 在其 `providers` 陣列中所做的那樣。
`providers` 陣列是 `@Component()` 裝飾器函式的屬性，必須
出現在類別定義的*上方*。

使用 `forwardRef` 打破循環。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="parent-finder.component.ts (AlexComponent providers)" linenums="false">

</code-example>

<!--- Waiting for good examples

{@a directive-level-providers}

{@a element-level-providers}

## Element-level providers

A component is a specialization of directive, and the `@Component()` decorator inherits the `providers` property from `@Directive`. The injector is at the element level, so a provider configured with any element-level injector is available to any component, directive, or pipe attached to the same element.

Here's a live example that implements a custom form control, taking advantage of an injector that is shared by a component and a directive on the same element.

https://stackblitz.com/edit/basic-form-control

The component, `custom-control`, configures a provider for the DI token `NG_VALUE_ACCESSOR`.
In the template, the `FormControlName` directive is instantiated along with the custom component.
It can inject the `NG_VALUE_ACCESSOR` dependency because they share the same injector.
(Notice that this example also makes use of `forwardRef()` to resolve a circularity in the definitions.)

### Sharing a service among components

__NEED TO TURN THIS INTO FULL EXTERNAL EXAMPLE__

Suppose you want to share the same `HeroCacheService` among multiple components. One way to do this is to create a directive.

```
<ng-container heroCache>
  <hero-overview></hero-overview>
  <hero-details></hero-details>
</ng-container>
```

Use the `@Directive()` decorator to configure the provider for the service:

```
@Directive(providers:[HeroCacheService])

class heroCache{...}
```

Because the injectors for both the overview and details components are children of the injector created from the `heroCache` directive, they can inject things it provides.
If the `heroCache` directive provides the `HeroCacheService`, the two components end up sharing them.

If you want to show only one of them, use the directive to make sure __??of what??__.

`<hero-overview heroCache></hero-overview>`

 --->
