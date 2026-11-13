# Angular 中的依賴注入

依賴注入 (DI) 是一種重要的應用程式設計模式。
Angular 有自己的 DI 框架，通常用於 Angular 應用程式的設計中，以提高其效率與模組化程度。

依賴是類別執行其功能所需的服務或物件。
DI 是一種編碼模式，類別會向外部來源請求依賴，而不是自行建立它們。

在 Angular 中，DI 框架會在類別被實例化時，將已宣告的依賴提供給該類別。本指南說明 DI 在 Angular 中如何運作，以及你如何使用它來讓你的應用程式靈活、高效、健壯，同時兼具可測試性與可維護性。

<div class="alert is-helpful">

 你可以執行本指南隨附範例應用程式的 <live-example></live-example>。

</div>

先來看看[英雄之旅](tutorial/)中_英雄_功能的這個簡化版本。這個簡單版本不使用 DI；我們將逐步將它改用 DI。

<code-tabs>
  <code-pane header="src/app/heroes/heroes.component.ts" path="dependency-injection/src/app/heroes/heroes.component.1.ts" region="v1">
  </code-pane>

  <code-pane header="src/app/heroes/hero-list.component.ts" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.ts" path="dependency-injection/src/app/heroes/hero.ts">
  </code-pane>

  <code-pane header="src/app/heroes/mock-heroes.ts" path="dependency-injection/src/app/heroes/mock-heroes.ts">
  </code-pane>

</code-tabs>

`HeroesComponent` 是頂層的英雄元件。
它唯一的目的就是顯示 `HeroListComponent`，而後者顯示英雄名稱清單。

這個版本的 `HeroListComponent` 從 `HEROES` 陣列取得英雄，那是一個定義在另外的 `mock-heroes` 檔案中的記憶體內集合。

<code-example header="src/app/heroes/hero-list.component.ts (class)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts" region="class">
</code-example>

這種做法在原型開發階段可行，但不健壯也不可維護。
一旦你想測試這個元件，或從遠端伺服器取得英雄，你就必須修改 `HeroesListComponent` 的實作，並取代每一處 `HEROES` 模擬資料的使用。

## 建立並註冊可注入的服務

DI 框架讓你可以從一個可注入的_服務_類別（定義在它自己的檔案中）向元件提供資料。為了示範，我們將建立一個提供英雄清單的可注入服務類別，並將該類別註冊為該服務的提供者。

<div class="alert is-helpful">

在同一個檔案中放多個類別可能會令人困惑。我們一般建議你把元件與服務定義在不同的檔案中。

如果你確實把元件與服務合併在同一個檔案中，務必先定義服務，再定義元件。
如果你在服務之前定義元件，你會得到一個執行時期的 null 參照錯誤。

借助 `forwardRef()` 方法，也可以先定義元件，如這篇[部落格文章](http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html)所說明。

你也可以使用前向參照來打破循環依賴。
請參閱 [DI 食譜](guide/dependency-injection-in-action#forwardref)中的範例。

</div>

### 建立可注入的服務類別

[Angular CLI](cli) 可以用這個指令在 `src/app/heroes` 資料夾中產生新的 `HeroService` 類別。

<code-example language="sh" class="code-shell">
ng generate service heroes/hero
</code-example>

這個指令會建立下列 `HeroService` 骨架。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" header="src/app/heroes/hero.service.ts (CLI-generated)">
</code-example>

`@Injectable()` 是每個 Angular 服務定義中不可或缺的要素。類別的其餘部分撰寫了一個 `getHeroes` 方法，回傳與之前相同的模擬資料。（真正的應用程式可能會從遠端伺服器非同步取得資料，但我們先忽略這一點，專注於注入服務的機制。）

<code-example path="dependency-injection/src/app/heroes/hero.service.3.ts" header="src/app/heroes/hero.service.ts">
</code-example>

{@a injector-config}
{@a bootstrap}

### 用服務提供者設定注入器

我們建立的類別提供了一個服務。`@Injectable()` 裝飾器將它標記為可以被注入的服務，但 Angular 在你用該服務的[提供者](guide/glossary#provider)設定 Angular [依賴注入器](guide/glossary#injector)之前，實際上無法將它注入到任何地方。

注入器負責建立服務實例，並將它們注入到像 `HeroListComponent` 這樣的類別中。
你很少自己建立 Angular 注入器。Angular 在執行應用程式時為你建立注入器，從它在[啟動過程](guide/bootstrapping)中建立的_根注入器_開始。

提供者告訴注入器_如何建立服務_。
你必須先用提供者設定注入器，該注入器才能建立服務（或提供任何其他種類的依賴）。

提供者可以是服務類別本身，這樣注入器就可以使用 `new` 來建立實例。
你也可以定義多個類別，以不同的方式提供同一個服務，並用不同的提供者設定不同的注入器。

<div class="alert is-helpful">

注入器是繼承的，也就是說，如果某個注入器無法解析依賴，它會要求父注入器來解析。
元件可以從自己的注入器、其元件祖先的注入器、其父 NgModule 的注入器，或 `root` 注入器取得服務。

* 深入了解[不同種類的提供者](guide/dependency-injection-providers)。

* 深入了解[注入器階層](guide/hierarchical-dependency-injection)如何運作。

</div>

你可以在應用程式的不同層級用提供者設定注入器，方法是在以下三個地方之一設定中繼資料值：

* 在服務本身的 `@Injectable()` 裝飾器中。

* 在 NgModule 的 `@NgModule()` 裝飾器中。

* 在元件的 `@Component()` 裝飾器中。

`@Injectable()` 裝飾器有 `providedIn` 中繼資料選項，你可以在其中用 `root` 注入器，或用特定 NgModule 的注入器，指定被裝飾服務類別的提供者。

`@NgModule()` 與 `@Component()` 裝飾器有 `providers` 中繼資料選項，你可以在其中為 NgModule 層級或元件層級的注入器設定提供者。

<div class="alert is-helpful">

元件是指令，而 `providers` 選項繼承自 `@Directive()`。你也可以在與元件相同的層級為指令與管道設定提供者。

深入了解[在何處設定提供者](guide/hierarchical-dependency-injection)。

</div>

{@a injector-config}
{@a bootstrap}

## 注入服務

為了讓 `HeroListComponent` 從 `HeroService` 取得英雄，它需要請求注入 `HeroService`，而不是用 `new` 建立自己的 `HeroService` 實例。

你可以透過指定**帶有依賴型別的建構函式參數**，告訴 Angular 在元件的建構函式中注入依賴。以下是 `HeroListComponent` 的建構函式，請求注入 `HeroService`。

<code-example header="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature">
</code-example>

當然，`HeroListComponent` 應該對注入的 `HeroService` 做些事情。
這是修改後的元件，使用注入的服務，並與先前版本並列以供比較。

<code-tabs>
  <code-pane header="hero-list.component (with DI)" path="dependency-injection/src/app/heroes/hero-list.component.2.ts">
  </code-pane>

  <code-pane header="hero-list.component (without DI)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>
</code-tabs>

`HeroService` 必須在某個父注入器中提供。`HeroListComponent` 中的程式碼不依賴 `HeroService` 來自何處。
如果你決定在 `AppModule` 中提供 `HeroService`，`HeroListComponent` 不需要任何改變。

{@a singleton-services}
{@a component-child-injectors}

### 注入器階層與服務執行個體

服務在注入器的範圍內是單例，也就是說，在給定的注入器中，一個服務最多只有一個執行個體。

一個應用程式只有一個根注入器。在 `root` 或 `AppModule` 層級提供 `UserService`，表示它向根注入器註冊。整個應用程式只有一個 `UserService` 實例，每個注入 `UserService` 的類別都會取得這個服務實例_除非_你用_子注入器_設定了另一個提供者。

Angular DI 具有[階層式注入系統](guide/hierarchical-dependency-injection)，也就是說，巢狀的注入器可以建立自己的服務執行個體。
每當 Angular 建立一個在 `@Component()` 中指定了 `providers` 的元件新執行個體時，也會為該執行個體建立一個新的_子注入器_。
同樣地，當新的 NgModule 在執行期延遲載入時，Angular 可以為它建立一個帶有自己的提供者的注入器。

子模組注入器與元件注入器彼此獨立，會建立各自獨立的所提供服務執行個體。當 Angular 銷毀 NgModule 或元件執行個體時，也會一併銷毀該注入器以及該注入器的服務執行個體。

多虧了[注入器繼承](guide/hierarchical-dependency-injection)，你仍然可以將應用程式範圍的服務注入到這些元件中。
元件的注入器是其父元件注入器的子注入器，並從所有祖先注入器一路繼承回應用程式的_根_注入器。Angular 可以注入該譜系中任何一個注入器所提供的服務。

例如，Angular 可以同時為 `HeroListComponent` 注入在 `HeroComponent` 中提供的 `HeroService` 與在 `AppModule` 中提供的 `UserService`。

{@a testing-the-component}

## 測試具有依賴的元件

用依賴注入設計類別，會讓類別更容易測試。
將依賴列為建構函式參數，可能就是有效測試應用程式各部分所需的全部。

例如，你可以用一個可以在測試下操控的模擬服務，建立一個新的 `HeroListComponent`。

<code-example path="dependency-injection/src/app/test.component.ts" region="spec" header="src/app/test.component.ts"></code-example>

<div class="alert is-helpful">

在[測試](guide/testing)指南中深入了解。

</div>

{@a service-needs-service}

## 需要其他服務的服務

服務可以有自己的依賴。`HeroService` 非常簡單，沒有任何自己的依賴。然而，假設你想讓它透過記錄服務來報告它的活動。你可以套用相同的*建構函式注入*模式，加入一個接受 `Logger` 參數的建構函式。

這是注入 `Logger` 的修改後 `HeroService`，與先前的服務並列以供比較。

<code-tabs>

  <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

  <code-pane header="src/app/logger.service"
  path="dependency-injection/src/app/logger.service.ts">
  </code-pane>

</code-tabs>

建構函式請求注入 `Logger` 的實例，並將它儲存在名為 `logger` 的私有欄位中。`getHeroes()` 方法在被要求取得英雄時會記錄一條訊息。

請注意，`Logger` 服務也有 `@Injectable()` 裝飾器，儘管它可能不需要自己的依賴。事實上，`@Injectable()` 裝飾器是**所有服務都必須的**。

當 Angular 建立一個建構函式帶有參數的類別時，它會尋找那些參數的型別與注入中繼資料，以便注入正確的服務。
如果 Angular 找不到該參數資訊，它會拋出錯誤。
Angular 只有在_類別有某種裝飾器_時才能找到參數資訊。
`@Injectable()` 裝飾器是服務類別的標準裝飾器。

<div class="alert is-helpful">

 這個裝飾器的要求是 TypeScript 強加的。TypeScript 在將程式碼[轉譯](guide/glossary#transpile)為 JavaScript 時，通常會丟棄參數型別資訊。如果類別有裝飾器，且 TypeScript 的 `tsconfig.json` 設定檔中 `emitDecoratorMetadata` 編譯器選項設為 `true`，TypeScript 就會保留這項資訊。CLI 已將 `tsconfig.json` 設定為 `emitDecoratorMetadata: true`。

 這表示你有責任把 `@Injectable()` 加到你的服務類別上。

</div>

{@a token}

{@a injection-token}

### 依賴注入 token

當你用提供者設定注入器時，你會將該提供者與 [DI 權杖](guide/glossary#di-token)關聯起來。
注入器維護著一個內部的*權杖—提供者*對映表，在被要求提供依賴時參照它。權杖是這個對映表的鍵。

在簡單的範例中，依賴值是一個*實例*，而類別*型別*則作為它自己的查閱鍵。
在這裡，你透過提供 `HeroService` 型別作為權杖，直接從注入器取得 `HeroService`：

<code-example path="dependency-injection/src/app/injector.component.ts" region="get-hero-service" header="src/app/injector.component.ts"></code-example>

當你撰寫需要注入以類別為基礎之依賴的建構函式時，行為也類似。
當你以 `HeroService` 類別型別定義建構函式參數時，Angular 就知道要注入與該 `HeroService` 類別權杖關聯的服務：

<code-example path="dependency-injection/src/app/heroes/hero-list.component.ts" region="ctor-signature" header="src/app/heroes/hero-list.component.ts">
</code-example>

許多依賴值是由類別提供的，但並非全部。展開後的 *provide* 物件能讓你將不同種類的提供者與 DI 權杖關聯起來。

* 深入了解[不同種類的提供者](guide/dependency-injection-providers)。

{@a optional}

### 可選依賴

`HeroService` *需要*一個記錄器，但如果它沒有記錄器也能運作呢？

當元件或服務宣告一個依賴時，類別建構函式將該依賴作為參數。
你可以用 `@Optional()` 註解建構函式參數，告訴 Angular 該依賴是可選的。

<code-example path="dependency-injection/src/app/providers.component.ts" region="import-optional">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-10-ctor"></code-example>

使用 `@Optional()` 時，你的程式碼必須為 null 值做好準備。如果你沒有在任何地方註冊記錄器提供者，注入器會將 `logger` 的值設為 null。

<div class="alert is-helpful">

`@Inject()` 與 `@Optional()` 是_參數裝飾器_。它們透過註解需要依賴之類別建構函式上的依賴參數，來改變 DI 框架提供依賴的方式。

在[階層式依賴注入器](guide/hierarchical-dependency-injection)中深入了解參數裝飾器。

</div>

## 總結

你在本頁中學到了 Angular 依賴注入的基礎。
你可以註冊各種不同種類的提供者，而且你知道如何透過在建構函式中加入參數，來請求被注入的物件（例如服務）。

在下列頁面中更深入地探索 Angular DI 系統的功能與進階特性：

* 在[階層式依賴注入](guide/hierarchical-dependency-injection)中深入了解巢狀注入器。

* 深入了解 [DI 權杖與提供者](guide/dependency-injection-providers)。

* [依賴注入實戰](guide/dependency-injection-in-action)是一本食譜，介紹一些你可以用 DI 做的有趣事情。
