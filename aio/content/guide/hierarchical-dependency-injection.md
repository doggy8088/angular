# 階層式依賴注入器

Angular 依賴注入系統是_階層式_的。
有一棵注入器樹，與應用程式的元件樹平行。
你可以在該元件樹的任何層級重新設定注入器。

本指南探討這個系統，以及如何善用它。
它使用的範例以這個 <live-example></live-example> 為基礎。

{@a ngmodule-vs-comp}
{@a where-to-register}

## 在何處設定提供者

你可以在注入器階層中為不同的注入器設定提供者。
一個內部的平台層級注入器由所有執行中的應用程式共用。
`AppModule` 注入器是全應用程式注入器階層的根，而在
NgModule 內，指令層級的注入器遵循元件階層的結構。

你對於在何處設定提供者的選擇，會造成最終套件大小、服務的_範疇_，以及服務的_生命週期_的差異。

當你在服務本身的 `@Injectable()` 裝飾器中指定提供者時（通常在應用程式根層級），最佳化工具（例如 CLI 生產建置所使用的工具）可以執行*樹搖*，移除你的應用程式未使用的服務。樹搖能帶來更小的套件大小。

* 進一步了解[可樹搖的提供者](guide/dependency-injection-providers#tree-shakable-providers)。

你在應用程式中很多地方都可能會注入 `UserService`，並且會希望每次注入的都是同一個服務實例。透過 `root` 注入器提供 `UserService` 是個好選擇，這也是 CLI 在你為應用程式產生服務時使用的預設做法。

<div class="alert-is-helpful">
<header>平台注入器</header>

當你使用 `providedIn:'root'` 時，你設定的是_應用程式_的根注入器，也就是 `AppModule` 的注入器。
整個注入器階層真正的根是一個_平台注入器_，它是應用程式根注入器的父注入器。
這讓多個應用程式可以共用一個平台設定。例如，無論你有多少應用程式在執行，瀏覽器都只有一個 URL 列。

平台注入器在啟動期間於內部使用，以設定平台專屬的依賴。你可以使用 `platformBrowser()` 函式提供 `extraProviders`，在平台層級設定額外的平台專屬提供者。

進一步了解透過注入器階層進行的依賴解析：
[你一直想知道的 Angular 依賴注入樹](https://blog.angularindepth.com/angular-dependency-injection-and-tree-shakeable-tokens-4588a8f70d5d)

</div>

*NgModule 層級*的提供者可以用 `@NgModule()` 的 `providers` 中繼資料選項指定，或在 `@Injectable()` 的 `providedIn` 選項中指定（搭配根 `AppModule` 以外的某個模組）。

如果模組是[延遲載入](guide/lazy-loading-ngmodules)的，請使用 `@NgModule()` 的 `provides` 選項。當該模組載入時，模組自己的注入器會以該提供者設定，Angular 可以在它在該模組中建立的任何類別中注入對應的服務。如果你使用 `@Injectable()` 選項 `providedIn: MyLazyloadModule`，若該提供者在應用程式中其他地方都沒有使用，可能在編譯時期就被搖除。

* 進一步了解[可樹搖的提供者](guide/dependency-injection-providers#tree-shakable-providers)。

對於根層級與模組層級的注入器，服務實例的生命週期與應用程式或模組相同，Angular 會在每個需要它的類別中注入這同一個服務實例。

*元件層級*的提供者為每個元件實例設定其自己的注入器。
Angular 只能在該元件實例或其後代元件實例中注入對應的服務。
Angular 無法在其他任何地方注入同一個服務實例。

由元件提供的服務可能有有限的生命週期。
元件的每個新實例都有自己的服務實例。
當元件實例被銷毀時，該服務實例也隨之銷毀。

在我們的範例應用程式中，`HeroComponent` 在應用程式啟動時建立
且永遠不會被銷毀，
所以為 `HeroComponent` 建立的 `HeroService` 實例的生命週期與應用程式相同。
若要將 `HeroService` 的存取限制在 `HeroComponent` 及其巢狀的
`HeroListComponent`，請在元件層級、於 `HeroComponent` 的中繼資料中提供 `HeroService`。

* 請參閱下方更多[元件層級注入的範例](#component-injectors)。

{@a register-providers-injectable}

### @Injectable 層級設定

`@Injectable()` 裝飾器標示每個服務類別。服務類別的 `providedIn` 中繼資料選項會設定一個特定的注入器（通常是 `root`），使用被裝飾的類別作為該服務的提供者。
當可注入類別向 `root` 注入器提供它自己的服務時，只要該類別被匯入，該服務便隨處可用。

下列範例使用類別上的 `@Injectable()` 裝飾器，為 `HeroService` 設定提供者。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts"  title="src/app/heroes/heroes.service.ts" linenums="false"> </code-example> 

這個設定告訴 Angular，應用程式的根注入器負責透過呼叫其建構函式來建立
`HeroService` 的實例，
並讓該實例在整個應用程式中可用。

以應用程式的根注入器提供服務是典型的做法，
當你產生新服務時，CLI 會自動為你設定這類提供者。
不過，你不一定總是想在根層級提供服務。
例如，你可能想讓使用者明確選擇使用該服務。

除了指定 `root` 注入器，你也可以將 `providedIn` 設為特定的 NgModule。

例如，在下列摘錄中，`@Injectable()` 裝飾器設定的提供者
可在任何包含 `HeroModule` 的注入器中使用。

<code-example path="dependency-injection/src/app/heroes/hero.service.4.ts"  title="src/app/heroes/hero.service.ts" linenums="false"> </code-example>

這通常與設定 NgModule 本身的注入器沒有什麼不同，
不同之處在於，若 NgModule 沒有使用該服務，該服務是可樹搖的。
這對提供特定服務的程式庫很有用，某些
元件*可能*想要選擇性地注入該服務，
並由應用程式決定是否提供該服務。

* 進一步了解[可樹搖的提供者](guide/dependency-injection-providers#tree-shakable-providers)。

### @NgModule 層級注入器

你可以使用非根 NgModule 的 `providedIn` 中繼資料選項，在模組層級設定提供者，以將提供者的範疇限制在該模組。
這等同於在 `@Injectable()` 中繼資料中指定非根模組，不同之處在於，以這種方式提供的服務不是可樹搖的。

你通常不需要以 `providedIn` 指定 `AppModule`，因為應用程式的 `root` 注入器就是 `AppModule` 注入器。
不過，若你在 `AppModule` 的 `@NgModule()` 中繼資料中設定全應用程式提供者，它會覆寫在 `@Injectable()` 中繼資料中為 `root` 設定的提供者。
你可以這樣做，來設定與多個應用程式共用的服務的非預設提供者。

以下是一個例子：元件路由器設定透過在 `AppModule` 的 `providers` 清單中列出其提供者，
加入了一個非預設的[位置策略](guide/router#location-strategy)。

<code-example path="dependency-injection-in-action/src/app/app.module.ts" region="providers" title="src/app/app.module.ts (providers)" linenums="false">

</code-example>

{@a register-providers-component}

### @Component 層級注入器

NgModule 內的個別元件有它們自己的注入器。
你可以將提供者的範疇限制在某個元件及其子元件，方法是使用 `@Component` 中繼資料在元件層級設定提供者。

下列範例是修訂過的 `HeroesComponent`，在其 `providers` 陣列中指定了 `HeroService`。`HeroService` 可以為這個元件的實例，或任何子元件實例提供英雄。

<code-example path="dependency-injection/src/app/heroes/heroes.component.1.ts" title="src/app/heroes/heroes.component.ts" linenums="false">
</code-example>

### 元素注入器

注入器實際上不屬於元件，而是屬於元件實例在 DOM 中的錨點元素。不同 DOM 元素上的不同元件實例使用不同的注入器。

元件是特殊類型的指令，`@Component()` 的 `providers` 屬性
繼承自 `@Directive()`。
指令也可以有依賴，你可以在它們的 `@Directive()` 中繼資料中設定提供者。
當你使用 `providers` 屬性為元件或指令設定提供者時，該提供者屬於錨點 DOM 元素的注入器。同一個元素上的元件與指令共用一個注入器。

<!--- TBD with examples
* For an example of how this works, see [Element-level providers](guide/dependency-injection-in-action#directive-level-providers).
--->

* 進一步了解 [Element Injectors in Angular](https://blog.angularindepth.com/a-curios-case-of-the-host-decorator-and-element-injectors-in-angular-582562abcf0a)。

## 注入器冒泡

考慮本指南對英雄之旅應用程式的變體。
最上層是 `AppComponent`，它有一些子元件，例如 `HeroesListComponent`。
`HeroesListComponent` 持有並管理多個 `HeroTaxReturnComponent` 實例。
下圖表示這個三層元件樹在同時開啟三個 `HeroTaxReturnComponent` 實例時的狀態。

<figure>
  <img src="generated/images/guide/dependency-injection/component-hierarchy.png" alt="注入器樹">
</figure>

當元件請求一個依賴時，Angular 會嘗試以註冊在該元件自己注入器中的提供者來滿足該依賴。
若元件的注入器缺少該提供者，它會將請求向上傳遞給父元件的注入器。
若該注入器無法滿足請求，它會將請求沿著樹向上傳遞給下一個父注入器。
請求會不斷向上冒泡，直到 Angular 找到能處理該請求的注入器，或祖先注入器用完為止。
若祖先用完，Angular 會拋出錯誤。

若你在不同層級為同一個 DI 權杖註冊了提供者，Angular 遇到的第一個提供者就是它用來提供該依賴的提供者。例如，若提供者在需要服務的元件中本機註冊，Angular 就不會尋找同一個服務的其他提供者。

<div class="alert is-helpful">

你可以透過在元件建構函式中，於依賴服務的參數上加入 `@Host()` 參數裝飾器，來限制冒泡的範圍。
提供者的搜尋會在該元件宿主元素的注入器處停止。

* 請參閱將 `@Host` 與 `@Optional` 一起使用的[範例](guide/dependency-injection-in-action#qualify-dependency-lookup)；`@Optional` 是另一個參數裝飾器，讓你在找不到提供者時處理 null 的情況。

* 進一步了解 [`@Host` 裝飾器與 Element Injectors](https://blog.angularindepth.com/a-curios-case-of-the-host-decorator-and-element-injectors-in-angular-582562abcf0a)。

</div>

若你只在最上層以根注入器註冊提供者（通常是根 `AppModule`），注入器樹看起來是平坦的。
所有請求都會向上冒泡到根注入器，無論你是用 `bootstrapModule` 方法設定的，或是在服務本身以 `root` 註冊了所有提供者。

{@a component-injectors}

## 元件注入器

能在不同層級設定一個或多個提供者，開啟了有趣且實用的可能性。
本指南範例提供了一些你可能想要這樣做的情境。

### 情境：服務隔離

架構上的理由可能讓你想將服務的存取限制在它所屬的應用程式領域。
例如，本指南範例包含一個 `VillainsListComponent`，顯示反派清單。
它從 `VillainsService` 取得那些反派。

若你在根 `AppModule` 中提供 `VillainsService`（你在那裡註冊了 `HeroesService`），
那會讓 `VillainsService` 在應用程式中隨處可用，包括_英雄_工作流程。若你之後修改了 `VillainsService`，可能會破壞某處的英雄元件。在根 `AppModule` 中提供該服務就帶來了這種風險。

反之，你可以像這樣在 `VillainsListComponent` 的 `providers` 中繼資料中提供 `VillainsService`：

<code-example path="hierarchical-dependency-injection/src/app/villains-list.component.ts" linenums="false" title="src/app/villains-list.component.ts (metadata)" region="metadata">

</code-example>

透過在 `VillainsListComponent` 中繼資料中提供 `VillainsService`，且不在其他任何地方提供，
該服務只在 `VillainsListComponent` 及其子元件樹中可用。
它仍然是單例，但它是只存在於_反派_領域的單例。

現在你知道英雄元件無法存取它。你減少了出錯的風險。

### 情境：多個編輯工作階段

許多應用程式允許使用者同時處理多個開啟的任務。
例如，在報稅應用程式中，報稅員可以在一天中處理多份報稅單，
在它們之間切換。

本指南以英雄之旅主題的範例展示該情境。
想像一個外部的 `HeroListComponent`，顯示超級英雄清單。

若要開啟某位英雄的報稅單，報稅員點選英雄名字，這會開啟一個元件來編輯該報稅單。
每份被選中的英雄報稅單會在它自己的元件中開啟，多份報稅單可以同時開啟。

每個報稅單元件有下列特點：

* 是它自己的報稅單編輯工作階段。
* 可以變更一份報稅單，而不影響另一個元件中的報稅單。
* 能夠儲存其報稅單的變更，或取消這些變更。

<figure>
  <img src="generated/images/guide/dependency-injection/hid-heroes-anim.gif" alt="運作中的英雄">
</figure>

假設 `HeroTaxReturnComponent` 有管理與還原變更的邏輯。
對一份簡單的英雄報稅單來說，那會是相當容易的任務。
在真實世界中，有了豐富的報稅單資料模型，變更管理就會很棘手。
你可以將該管理委託給一個輔助服務，如本範例所示。

以下是 `HeroTaxReturnService`。
它快取單一的 `HeroTaxReturn`，追蹤對該報稅單的變更，並可以儲存或還原它。
它也會委託給全應用程式單例 `HeroService`，該服務是透過注入取得的。

<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.service.ts" title="src/app/hero-tax-return.service.ts">

</code-example>

以下是使用它的 `HeroTaxReturnComponent`。

<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" title="src/app/hero-tax-return.component.ts">

</code-example>

_待編輯的報稅單_透過輸入屬性抵達，該屬性以 getter 與 setter 實作。
setter 會以傳入的報稅單初始化元件自己的 `HeroTaxReturnService` 實例。
getter 永遠傳回該服務所說的英雄目前狀態。
元件也會要求服務儲存與還原這份報稅單。

若服務是全應用程式單例，這就行不通了。
每個元件都會共用同一個服務實例，每個元件都會覆寫屬於另一位英雄的報稅單。

為了防止這一點，我們設定 `HeroTaxReturnComponent` 的元件層級注入器來提供該服務，使用元件中繼資料中的 `providers` 屬性。

<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" linenums="false" title="src/app/hero-tax-return.component.ts (providers)" region="providers">

</code-example>

`HeroTaxReturnComponent` 有它自己的 `HeroTaxReturnService` 提供者。
回想一下，每個元件_實例_都有它自己的注入器。
在元件層級提供服務，確保元件的_每個_實例都有自己私有的服務實例，沒有任何報稅單會被覆寫。

<div class="alert is-helpful">

本情境程式碼的其餘部分依賴其他 Angular 功能與技術，你可以在文件其他地方了解它們。
你可以從 <live-example></live-example> 檢視並下載它。

</div>

### 情境：專門化的提供者

在另一個層級重新提供服務的另一個理由，是在元件樹更深處替換該服務的一個_更專門化_的實作。

考慮一個依賴多個服務的 Car 元件。
假設你以 `CarService`、`EngineService` 與 `TiresService` 的_通用_提供者設定了根注入器（標記為 A）。

你建立了一個 car 元件 (A)，顯示由這三個通用服務建構的一輛車。

接著你建立了一個子元件 (B)，它定義了自己_專門化_的 `CarService` 與 `EngineService` 提供者，具有適合元件 (B) 中正在進行之事的特殊能力。

元件 (B) 是另一個元件 (C) 的父元件，(C) 定義了它自己、_更專門化_的 `CarService` 提供者。

<figure>
  <img src="generated/images/guide/dependency-injection/car-components.png" alt="汽車元件">
</figure>

在幕後，每個元件都以零個、一個或多個為該元件本身定義的提供者，設定它自己的注入器。

當你在最深的元件 (C) 解析 `Car` 的實例時，
它的注入器產生一個 `Car` 實例，該實例由注入器 (C) 解析，其 `Engine` 由注入器 (B) 解析，
`Tires` 由根注入器 (A) 解析。

<figure>
  <img src="generated/images/guide/dependency-injection/injector-tree.png" alt="汽車注入器樹">
</figure>

<div class="alert is-helpful">

這個_汽車_情境的程式碼在範例的 `car.components.ts` 與 `car.services.ts` 檔案中，
你可以從 <live-example></live-example> 檢視並下載它。

</div>
