# Angular 依賴注入

**依賴注入 (DI)** 是一種建立依賴於其他物件的物件的方式。
依賴注入系統在建立物件實例時，
會提供它所依賴的物件（稱為_依賴_）。

[依賴注入模式](guide/dependency-injection-pattern) 頁面說明了這個一般性的做法。
_你正在閱讀的這本指南_則說明 Angular 自己的依賴注入系統如何運作。

## DI 範例

你將透過討論本指南隨附的範例應用程式，來學習 Angular 依賴注入。
隨時可以執行 <live-example></live-example>。

先來看看 [英雄之旅](tutorial/) 中_英雄_功能的
這個簡化版本。

<code-tabs>
  <code-pane title="src/app/heroes/heroes.component.ts" path="dependency-injection/src/app/heroes/heroes.component.1.ts"
  region="v1">
  </code-pane>

  <code-pane title="src/app/heroes/hero-list.component.ts" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>

  <code-pane title="src/app/heroes/hero.ts" path="dependency-injection/src/app/heroes/hero.ts">
  </code-pane>

  <code-pane title="src/app/heroes/mock-heroes.ts" path="dependency-injection/src/app/heroes/mock-heroes.ts">
  </code-pane>

</code-tabs>

`HeroesComponent` 是頂層的英雄元件。
它唯一的目的就是顯示 `HeroListComponent`，
而後者顯示一份英雄名稱清單。

這個版本的 `HeroListComponent` 從 `HEROES` 陣列取得它的 `heroes`，那是一個定義在另外的 `mock-heroes` 檔案中的記憶體內集合。

<code-example title="src/app/heroes/hero-list.component.ts (class)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts"
region="class">
</code-example>

這在開發的早期階段可能還夠用，但離理想還差得遠。
一旦你試著測試這個元件，或從遠端伺服器取得英雄，
你就必須變更 `HerosListComponent` 的實作，
並且更換其他每一處對 `HEROES` 模擬資料的使用。

最好把這些細節藏在一個_服務_類別裡面，
[定義在它自己的檔案中](#one-class-per-file)。

## 建立可注入的 _HeroService_

[**Angular CLI**](https://cli.angular.io/) 可以用這個指令在 `src/app/heroes` 資料夾中產生新的 `HeroService` 類別。

<code-example language="sh" class="code-shell">
ng generate service heroes/hero
</code-example>

該命令會建立以下 `HeroService` 骨架。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" title="src/app/heroes/hero.service.ts (CLI-generated)">
</code-example>

目前先假設 [`@Injectable` 裝飾器](#injectable) 是每個 Angular 服務定義中不可或缺的要素。
這個類別的其餘部分已被改寫，公開了一個 `getHeroes` 方法，
回傳與先前相同的模擬資料。

<code-example path="dependency-injection/src/app/heroes/hero.service.1.ts" title="src/app/heroes/hero.service.ts">
</code-example>

當然，這不是真正的資料服務。
如果應用程式真的要從遠端伺服器取得資料，
`getHeroes` 方法簽名就必須是非同步的。

這個缺陷在本指南中可以放心忽略，因為我們的重點在於
_將服務注入_到 `HeroList` 元件中。

{@a injector-config}
{@a bootstrap}

## 註冊服務提供者

在 Angular 中，_服務_只是一個類別，直到你向 Angular 依賴注入器註冊它為止。

Angular 注入器負責建立服務實例，並將它們注入到像 `HeroListComponent` 這樣的類別中。

你很少自己建立 Angular 注入器。
Angular 會在執行應用程式時為你建立注入器，
從它在[啟動過程](guide/bootstrapping)中建立的_根注入器_開始。

你確實必須向注入器註冊_提供者_，
注入器才能建立該服務。

**提供者**告訴注入器_如何建立服務_。
沒有提供者，注入器就不會知道
它負責注入該服務，
也無法建立該服務。

<div class="l-sub-section">

你將在[下方](#providers)了解更多關於_提供者_的資訊。
目前只要知道它們建立服務，
且必須向注入器註冊就夠了。

</div>

你可以使用任何支援 **`providers` 陣列屬性**的 Angular 裝飾器來註冊提供者。

許多 Angular 裝飾器接受帶有 `providers` 屬性的詮釋資料。
兩個最重要的例子是 `@Component` 與 `@NgModule`。

{@a register-providers-component}

### _@Component_ 提供者

以下是一個改訂過的 `HeroesComponent`，它在自己的 `providers` 陣列中註冊了 `HeroService`。

<code-example path="dependency-injection/src/app/heroes/heroes.component.1.ts" title="src/app/heroes/heroes.component.ts" linenums="false">
</code-example>

{@a register-providers-ngmodule}

### _@NgModule_ 提供者

在以下摘錄中，根 `AppModule` 在它的 `providers` 陣列中註冊了兩個提供者。

<code-example path="dependency-injection/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts (providers)" region="providers">
</code-example>

第一個條目在 `UserService` _注入權杖_下註冊了 `UserService` 類別（_未顯示_）。
第二個則在 `APP_CONFIG` _注入權杖_下註冊了一個值 (`HERO_DI_CONFIG`)。

多虧了這些註冊，Angular 可以將 `UserService` 或 `HERO_DI_CONFIG` 值
注入到它建立的任何類別中。

<div class="l-sub-section">

你將在[下方](#providers)了解_注入權杖_與_提供者_語法。
</div>

{@a ngmodule-vs-comp}

### _@NgModule_ 還是 _@Component_？

你應該用 Angular 模組還是元件來註冊服務？
這兩種選擇會導致服務_範圍_與服務_生命期_的差異。

**Angular 模組提供者** (`@NgModule.providers`) 向應用程式的根注入器註冊。
Angular 可以將對應的服務注入到它建立的任何類別中。
服務實例一旦建立，就會在應用程式的整個生命期記憶體在，Angular 會將這同一個服務實例注入到每一個需要它的類別中。

你很可能會在應用程式的許多地方注入 `UserService`，
而且會希望每次都注入同一個服務實例。
用 Angular 模組提供 `UserService` 是個好選擇。

<div class="l-sub-section">

精確地說，Angular 模組提供者是向根注入器註冊的，
_除非該模組是_[延遲載入](guide/lazy-loading-ngmodules)的。
在本範例中，應用程式開始時所有模組都會_急切載入_，
因此所有模組提供者都向應用程式的根注入器註冊。

</div><br>

<hr>

**元件的提供者** (`@Component.providers`) 向每個元件實例自己的注入器註冊。

Angular 只能將對應的服務注入到該元件實例，或它的其中一個後代元件實例中。
Angular 無法在其他任何地方注入同一個服務實例。

請注意，元件提供的服務可能有有限的生命期。元件的每個新實例都有它自己的服務實例，
而且當元件實例被銷毀時，該服務實例也會被銷毀。

在本範例應用程式中，`HeroComponent` 在應用程式開始時被建立
並且永遠不會被銷毀，因此為 `HeroComponent` 建立的 `HeroService` 也會在應用程式的整個生命期記憶體在。

如果你想將 `HeroService` 的存取限制在 `HeroComponent` 及其巢狀的 `HeroListComponent`，
在 `HeroComponent` 中提供 `HeroService` 可能是個好選擇。

<div class="l-sub-section">

元件所提供服務的範圍與生命期，是 [Angular 建立元件實例的方式](#component-child-injectors) 的結果。 

</div>

## 注入服務

`HeroListComponent` 應該從 `HeroService` 取得英雄。

元件不應該用 `new` 建立 `HeroService`。
它應該要求注入 `HeroService`。

你可以透過指定**帶有依賴型別的建構子參數**，告訴 Angular 在元件的建構子中注入一個依賴。
以下是 `HeroListComponent` 的建構子，它要求注入 `HeroService`。

<code-example title="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature">
</code-example>

當然，`HeroListComponent` 應該對注入的 `HeroService` 做些事情。
以下是改訂過的元件，它利用了注入的服務，並與先前的版本並列以供比較。

<code-tabs>
  <code-pane title="hero-list.component (with DI)" path="dependency-injection/src/app/heroes/hero-list.component.2.ts">
  </code-pane>

  <code-pane title="hero-list.component (without DI)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>
</code-tabs>

請注意，`HeroListComponent` 不知道 `HeroService` 從哪裡來。
_你_知道它來自父元件 `HeroesComponent`。
但如果你改成在 `AppModule` 中提供 `HeroService`，
`HeroListComponent` 完全不需要改變。
_唯一重要的事_是，`HeroService` 有在某個父注入器中被提供。

{@a singleton-services}

## 單例服務

服務_在某個注入器的範圍內_是單例。
在給定的注入器中，一個服務最多只有一個實例。

根注入器只有一個，而 `UserService` 向該注入器註冊。
因此，整個應用程式中只能有一個 `UserService` 實例，
而每個注入 `UserService` 的類別都會取得這個服務實例。

然而，Angular DI 是一個
[階層式注入系統](guide/hierarchical-dependency-injection)，
這意味著巢狀注入器可以建立它們自己的服務實例。
Angular 一直都在建立巢狀注入器。

{@a component-child-injectors}

## 元件子注入器

例如，當 Angular 建立一個帶有 `@Component.providers` 的元件的新實例時，
它也會為該實例建立一個新的_子注入器_。

元件注入器彼此獨立，
而且每一個都會建立它自己的元件所提供服務的實例。

當 Angular 銷毀其中一個元件實例時，它也會銷毀
該元件的注入器以及該注入器的服務實例。 

多虧了[注入器繼承](guide/hierarchical-dependency-injection)，
你仍然可以將應用程式層級的服務注入到這些元件中。
元件的注入器是其父元件注入器的子注入器，
是其父元件的父元件之注入器的後代，依此類推，一路回到應用程式的_根_注入器。
Angular 可以注入該系譜中任何注入器所提供的服務。

例如，Angular 可以為一個 `HeroListComponent`
同時注入在 `HeroComponent` 中提供的 `HeroService`
與在 `AppModule` 中提供的 `UserService`。

{@a testing-the-component}

## 測試元件

先前你已經看到，為依賴注入而設計類別，會讓類別更容易測試。
將依賴列為建構子參數，可能就是你有效測試應用程式各部分所需的全部。

例如，你可以用一個可以在測試下操控的模擬服務
建立一個新的 `HeroListComponent`：

<code-example path="dependency-injection/src/app/test.component.ts" region="spec" title="src/app/test.component.ts" linenums="false">
</code-example>

<div class="l-sub-section">

在[測試](guide/testing)指南中深入了解。

</div>

{@a service-needs-service}

## 當服務需要服務時

`HeroService` 非常簡單。它本身沒有任何依賴。

要是它有依賴呢？要是它透過記錄服務來回報它的活動呢？
你可以套用相同的*建構子注入*模式，
加入一個帶有 `Logger` 參數的建構子。

以下是注入了 `Logger` 的改訂版 `HeroService`，與先前的服務並列以供比較。

<code-tabs>

  <code-pane title="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane title="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

</code-tabs>

建構子要求注入一個 `Logger` 實例，並將它儲存在名為 `logger` 的私有欄位中。
當被要求擷取英雄時，`getHeroes()` 方法會記錄一則訊息。

{@a logger-service}

#### 依賴的 _Logger_ 服務

範例應用程式的 `Logger` 服務相當簡單：

<code-example path="dependency-injection/src/app/logger.service.ts" title="src/app/logger.service.ts">
</code-example>

如果應用程式沒有提供這個 `Logger`，
當 Angular 在尋找要注入到 `HeroService` 的 `Logger` 時，
就會拋出例外。

<code-example language="sh" class="code-shell">
  ERROR Error: No provider for Logger!
</code-example>

因為單例的記錄服務在每個地方都有用，
所以它在根 `AppModule` 中被提供。

<code-example path="dependency-injection/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts (providers)" region="providers-2">
</code-example>

{@a injectable}

## _@Injectable()_

**[@Injectable()](api/core/Injectable)** 裝飾器標識出一個服務類別，
它_可能_需要注入的依賴。

`HeroService` 必須用 `@Injectable()` 註解，因為它需要一個注入的 `Logger`。

<div class="alert is-important">

一定要寫帶括號的 `@Injectable()`，而不只是 `@Injectable`。

</div>

當 Angular 建立一個建構子帶有參數的類別時，
它會尋找那些參數的型別與注入詮釋資料，
以便注入正確的服務。

如果 Angular 找不到該參數資訊，它就會拋出錯誤。

Angular 只有在_類別有某種裝飾器時_才能找到參數資訊。
雖然_任何_裝飾器都可以，
但 `@Injectable()` 裝飾器是服務類別的標準裝飾器。

<div class="l-sub-section">
裝飾器的要求是 TypeScript 施加的。

TypeScript 通常在將程式碼_轉譯_為 JavaScript 時，會捨棄參數型別資訊。
如果類別有裝飾器，
而且 TypeScript 的 `tsconfig.json` 設定檔中的 `emitDecoratorMetadata` 編譯器選項被設為 `true`，
它就會保留這個資訊。

CLI 將 `tsconfig.json` 設定為 `emitDecoratorMetadata: true`。
把 `@Injectable()` 放在你的服務類別上，是你的工作。

</div>

`Logger` 服務也用 `@Injectable()` 裝飾器註解，
雖然它沒有建構子，也沒有依賴。

事實上，這個應用程式中_每個_ Angular 服務類別都用 `@Injectable()` 裝飾器註解，無論它是否有建構子與依賴。
`@Injectable()` 是服務的必要程式碼風格。

{@a providers}

## 提供者

服務提供者*提供*了依賴值的具體執行時期版本。
注入器依賴**提供者**來建立服務實例，
而注入器會將這些服務注入到元件、指令、管道與其他服務中。

你必須向注入器註冊服務*提供者*，否則它將不知道如何建立該服務。

接下來的幾個章節將解釋指定提供者的許多方式。

隨附的程式碼片段幾乎全都是從範例應用程式的 `providers.component.ts` 檔案摘錄的。

### 類別作為自己的提供者

有很多方法可以*提供*一些外觀與行為都像 `Logger` 的東西。
`Logger` 類別本身就是一個明顯而自然的提供者。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

但這不是唯一的方法。

你可以將注入器設定為使用其他提供者，它們可以交付一個行為像 `Logger` 的物件。
你可以提供一個替代類別。你可以提供一個類似記錄器的物件。
你可以給它一個呼叫記錄器工廠函式的提供者。
在適當的情況下，這些做法都可能是好選擇。

重要的是，當注入器需要一個 `Logger` 時，它有一個提供者可以求助。

{@a provide}

### _provide_ 物件實字

再看一次類別提供者的語法。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

這其實是一個提供者註冊的簡寫表示式，
使用帶有兩個屬性的_提供者_物件實字：

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" >
</code-example>

`provide` 屬性持有 [權杖](guide/dependency-injection#token)，它既是定位依賴值的鍵，
也是註冊提供者的鍵。

第二個屬性一定是提供者定義物件，
你可以把它看作是建立依賴值的*配方*。
建立依賴值的方法有很多，正如寫配方的方法有很多一樣。

{@a class-provider}

### 替代類別提供者

有時候你會要求一個不同的類別來提供服務。
以下程式碼告訴注入器，
當有東西要求 `Logger` 時，回傳一個 `BetterLogger`。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" >
</code-example>

{@a class-provider-dependencies}

### 帶依賴的類別提供者

也許一個 `EvenBetterLogger` 可以在記錄訊息中顯示使用者名稱。
這個記錄器從注入的 `UserService` 取得使用者，
而該服務也是在應用程式層級注入的。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"  linenums="false">
</code-example>

像 `BetterLogger` 一樣設定它。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"  linenums="false">
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

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6a"  linenums="false">
</code-example>

解決方案：使用 `useExisting` 選項來建立別名。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b" linenums="false">
</code-example>

{@a value-provider}

### 值提供者

有時候，提供一個現成的物件，比要求注入器從類別建立它更容易。

<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger"  linenums="false">
</code-example>

然後你用 `useValue` 選項註冊一個提供者，
讓這個物件扮演記錄器的角色。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7" linenums="false">
</code-example>

在
[非類別依賴](guide/dependency-injection#non-class-dependencies) 與
[InjectionToken](guide/dependency-injection#injection-token) 章節中查看更多 `useValue` 範例。

{@a factory-provider}

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

  <code-pane title="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts">
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

要是依賴值不是類別呢？有時候你想注入的東西是一個
字串、函式或物件。

應用程式經常定義帶有許多小事實的設定物件
（例如應用程式的標題，或 web API 端點的地址），
但這些設定物件並不總是類別的實例。
它們可以是像這樣的物件實字：

<code-example path="dependency-injection/src/app/app.config.ts" region="config" title="src/app/app.config.ts (excerpt)" linenums="false">
</code-example>

要是你想讓這個設定物件可以被注入呢？
你知道你可以向[值提供者](guide/dependency-injection#value-provider)註冊一個物件。

但你應該用什麼作為權杖？
你沒有類別可以充當權杖。
沒有 `AppConfig` 類別。

<div class="l-sub-section">

### TypeScript 介面不是有效的權杖

`HERO_DI_CONFIG` 常數符合 `AppConfig` 介面。 
不幸的是，你不能使用 TypeScript 介面作為權杖：

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"  linenums="false">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"  linenums="false">
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

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9"  linenums="false">
</code-example>

現在，藉由 `@Inject` 裝飾器的幫助，你可以將設定物件注入到任何需要它的建構子中：

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" title="src/app/app.component.ts" linenums="false">
</code-example>

<div class="l-sub-section">

雖然 `AppConfig` 介面在依賴注入中不扮演任何角色，它支援類別內設定物件的型別。

</div>

或者，你可以在像 `AppModule` 這樣的 ngModule 中提供並注入設定物件。

<code-example path="dependency-injection/src/app/app.module.ts" region="providers" title="src/app/app.module.ts (providers)"></code-example>

{@a optional}

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

## 附錄：一檔案一類別

在同一個檔案中有多個類別令人困惑，最好避免。
開發者期望一檔案一類別。讓他們開心。

如果你將 `HeroService` 類別與
`HeroesComponent` 結合在同一個檔案中，
**請將元件定義在最後**。
如果你在服務之前定義元件，
你將會得到一個執行時期 null 參照錯誤。

<div class="l-sub-section">

實際上，藉助 `forwardRef()` 方法，你可以先定義元件，如
這篇[部落格文章](http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html)中所解釋的。

但最好透過將元件與服務定義在不同的檔案中，來完全避免這個問題。

</div>
