# 服務與依賴注入簡介

<img src="generated/images/guide/architecture/service.png" alt="服務" class="left">

_服務_是一個廣泛的類別，涵蓋應用程式需要的任何值、函式或功能。服務通常是一個目的狹窄、定義明確的類別。它應該做好某件特定的事，並把它做好。
<br class="clear">

Angular 將元件與服務區分開來，以提高模組化程度與可重用性。

* 透過將元件與檢視相關的功能和其他種類的處理分開，你可以讓元件類別保持精簡而有效率。理想上，元件的工作只是實現使用者體驗，別無其他。它應該提供屬性和方法來進行資料繫結，以在檢視（由範本所渲染）與應用程式邏輯（通常包含某種 _模型_ 的概念）之間居中協調。

* 元件不應該需要自己去定義如何從伺服器擷取資料、驗證使用者輸入，或直接記錄到主控台這類事情。相反地，它可以將這類任務委派給服務。透過在可注入的服務類別中定義那種處理任務，你可以讓任何元件都能使用它。你也可以在不同情況下注入同一種服務的不同提供者，讓應用程式更具適應性。

Angular 並不 *強制* 執行這些原則。Angular 確實能幫助你 *遵循* 這些原則，它讓你輕鬆地將
應用程式邏輯拆分到服務中，並透過 *依賴注入* 讓元件可以使用這些服務。

## 服務範例

以下是一個服務類別的範例，它會將訊息記錄到瀏覽器主控台：

<code-example path="architecture/src/app/logger.service.ts" linenums="false" title="src/app/logger.service.ts (class)" region="class"></code-example>

服務可以依賴其他服務。例如，以下是一個依賴 `Logger` 服務的 `HeroService`，它也使用 `BackendService` 來取得英雄。而該服務又可能依賴 `HttpClient` 服務，從伺服器非同步擷取英雄。

<code-example path="architecture/src/app/hero.service.ts" linenums="false" title="src/app/hero.service.ts (class)" region="class"></code-example>

<hr/>

## 依賴注入

<img src="generated/images/guide/architecture/dependency-injection.png" alt="服務" class="left">

元件會使用服務；也就是說，你可以將服務 *注入* 元件，讓該元件得以存取該服務類別。

若要在 Angular 中將某個類別定義為服務，請使用 `@Injectable` 裝飾器提供中繼資料，讓 Angular 能將它作為 *依賴* 注入元件。

同樣地，使用 `@Injectable` 裝飾器表示某個元件或其他類別（例如另一個服務、管道或 NgModule）_具有_ 依賴。依賴不一定是服務&mdash;例如，它可以是函式或值。

*依賴注入*（通常稱為 DI）已內建於 Angular 框架中，並在各處用來為新元件提供它們所需的服務或其他資源。

* *注入器* 是主要的機制。你不需要自行建立 Angular 注入器。Angular 會在啟動程序中為你建立一個應用程式範圍的注入器。

* 注入器維護一個它已建立的依賴實例的 *容器*，並在可能的情況下重複使用它們。

* *提供者* 是建立依賴的配方。對於服務而言，這通常就是服務類別本身。對於應用程式中需要的任何依賴，你必須向應用程式的注入器註冊提供者，讓注入器能用它來建立新實例。

當 Angular 建立元件類別的新實例時，它會查看建構子參數的型別，來判斷該元件需要哪些服務或其他依賴。例如，`HeroListComponent` 的建構子需要 `HeroService`：

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (constructor)" region="ctor"></code-example>

當 Angular 發現某個元件依賴某個服務時，它會先檢查注入器中是否已有該服務的現有實例。如果請求的服務實例尚不存在，注入器會使用已註冊的提供者建立一個，並將它加入注入器，然後再把服務傳回給 Angular。

當所有請求的服務都已解析並傳回後，Angular 就能以這些服務作為引數，呼叫元件的建構子。

`HeroService` 的注入過程大致如下：

<figure>
  <img src="generated/images/guide/architecture/injector-injects.png" alt="服務" class="left">
</figure>

### 提供服務

你必須為任何要使用的服務註冊至少一個 *提供者*。你可以在模組或元件中註冊提供者。

* 當你將提供者加入[根模組](guide/architecture-modules)時，應用程式中的所有元件都可以使用同一個服務實例。

<code-example path="architecture/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts (module providers)" region="providers"></code-example>

* 當你在元件層級註冊提供者時，每建立一個新的元件實例，就會得到一個新的
服務實例。在元件層級，請在 `@Component` 中繼資料的 `providers` 屬性中註冊服務提供者：

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (component providers)" region="providers"></code-example>

更多詳細資訊，請見[依賴注入](guide/dependency-injection)一節。

<hr/>
