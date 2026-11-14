# 階層式依賴注入器

你在 [相依性注入](guide/dependency-injection) 指南中學到了 Angular 相依性注入的基礎。

Angular 具有一個_階層式相依性注入_系統。
實際上，有一棵與應用程式元件樹平行的注入器樹。
你可以在該元件樹的任何層級重新設定注入器。

本指南探討這個系統，以及如何善用它。

嘗試 <live-example></live-example>。

## 注入器樹

在 [相依性注入](guide/dependency-injection) 指南中，
你學到了如何設定相依性注入器，以及如何在你需要它們的地方取回相依性。

事實上，沒有所謂的***那個***注入器。
一個應用程式可以擁有多個注入器。
Angular 應用程式是一棵元件樹。每個元件實例都有自己的注入器。
元件樹與注入器樹平行。

<div class="l-sub-section">

該元件的注入器可能是元件樹更高處的祖先注入器的_代理_。
這是一個提升效率的實作細節。
你不會注意到其中的差別，而
你的心智模型應該是每個元件都有自己的注入器。

</div>

考慮這個指南版本的英雄之旅（Tour of Heroes）應用程式。
最上層是 `AppComponent`，它有一些子元件。
其中一個是 `HeroesListComponent`。
`HeroesListComponent` 持有並管理著多個 `HeroTaxReturnComponent` 實例。
下圖代表了本指南的三層元件樹在三個 `HeroTaxReturnComponent` 實例
同時開啟時的狀態。

<figure>
  <img src="generated/images/guide/dependency-injection/component-hierarchy.png" alt="注入器樹">
</figure>

### 注入器冒泡

當元件請求依賴時，Angular 會嘗試使用在該元件自己的注入器中註冊的提供者來滿足該依賴。
如果元件的注入器缺少該提供者，它會將請求傳給其父元件的注入器。
如果該注入器無法滿足請求，它會將請求傳給*其*父注入器。
這些請求會不斷冒泡，直到 Angular 找到可以處理該請求的注入器，或是用完祖先注入器為止。
如果用完祖先注入器，Angular 會拋出錯誤。

<div class="l-sub-section">

你可以為冒泡設上限。一個中間元件可以宣告自己是 "host" 元件。
提供者的搜尋將不會攀升到高於該宿主元件的注入器。
這是另一個日子的議題。

</div>

### 在不同層級重新提供服務

你可以在注入器樹的多個層級，為特定的依賴令牌重新註冊提供者。
你*不必*重新註冊提供者。沒有好的理由，你不應該這樣做。
但你*可以*。

當解析邏輯向上運作時，遇到的第一個提供者獲勝。
因此，中間注入器中的提供者會攔截來自樹較低處的服務請求。
它有效地「重新配置」並「遮蔽」了樹中較高層級的提供者。

如果你只在頂層指定提供者（通常是根 `AppModule`），注入器樹看起來會是平坦的。
所有請求都會冒泡到你使用 `bootstrapModule` 方法配置的根 <code>NgModule</code> 注入器。

## 元件注入器

能夠在不同層級配置一個或多個提供者，開啟了有趣而實用的可能性。

### 情境：服務隔離

架構上的原因可能會使你想要將對服務的存取限制在它所屬的應用領域內。

本指南範例包括一個顯示壞人清單的 `VillainsListComponent`。
它從一個 `VillainsService` 取得那些壞人。

雖然你*可以*在根 `AppModule` 中提供 `VillainsService`（你在那裡會找到 `HeroesService`），
這將使 `VillainsService` 在應用程式的任何地方都可用，包括 _Hero_ 工作流程。

如果你之後修改 `VillainsService`，你可能會弄壞某處英雄元件中的東西。
這不應該發生，但在根 `AppModule` 中提供服務便會造成這種風險。

相反地，像這樣在 `VillainsListComponent` 的 `providers` 中繼資料中提供 `VillainsService`：

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

有人可能會認為 `HeroTaxReturnComponent` 具有管理與還原變更的邏輯。
對於一份簡單的英雄稅務申報表來說，這將是一項相當容易的任務。
在真實世界中，憑藉豐富的稅務申報資料模型，變更管理會很棘手。
你可以將該管理委派給一個輔助服務，就像這個範例所做的那樣。

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

如果_此_服務是整個應用程式範圍的單例，將會有大麻煩。
每個元件都將共享同一個服務實例。
每個元件都會覆寫屬於另一位英雄的稅務申報表。
真是混亂！

仔細查看 `HeroTaxReturnComponent` 的中繼資料。注意 `providers` 屬性。

<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" linenums="false" title="src/app/hero-tax-return.component.ts (providers)" region="providers">

</code-example>

`HeroTaxReturnComponent` 有它自己的 `HeroTaxReturnService` 提供者。
回想一下，每個元件*實例*都有自己的注入器。
在元件層級提供服務，確保了元件的*每個*實例都有其專屬、私有的服務實例。
沒有稅務申報表被覆寫。沒有混亂。

<div class="l-sub-section">

本情境程式碼的其餘部分依賴其他 Angular 功能與技術，你可以在文件其他地方了解它們。
你可以從 <live-example></live-example> 檢視並下載它。

</div>

### 情境：專門化的提供者

重新提供服務的另一個原因，是在元件樹的更深處替代該服務的一個*更專門化*的實作。

再次考慮 [相依性注入](guide/dependency-injection) 指南中的汽車範例。
假設你為根注入器（標記為 A）配置了 `CarService`、`EngineService` 與 `TiresService` 的*通用*提供者。

你建立了一個 car 元件 (A)，顯示由這三個通用服務建構的一輛車。

接著你建立一個子元件 (B)，它定義了它自己專為 `CarService` 與 `EngineService` 的*專門化*提供者，
這些提供者具有適用於元件 (B) 中所發生事情的特殊能力。

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

<div class="l-sub-section">

這個_汽車_情境的程式碼在範例的 `car.components.ts` 與 `car.services.ts` 檔案中，
你可以從 <live-example></live-example> 檢視並下載它。

</div>
