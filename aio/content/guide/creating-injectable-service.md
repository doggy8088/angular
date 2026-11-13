# 建立可注入的服務

服務是一個廣泛的類別，涵蓋應用程式所需的任何值、函式或功能。 服務通常是一個用途狹窄且定義明確的類別。 元件也是一種可以使用 DI 的類別。

Angular 區分元件與服務，是為了提高模組化程度與可重用性。 將元件與檢視相關的功能，和其他類型的處理分開，可以讓你的元件類別精簡而有效率。

理想上，元件的工作是提供使用者體驗，除此之外別無其他。 元件應該提供供資料繫結使用的屬性與方法，作為檢視（由範本算繪）與應用程式邏輯（通常包含某種模型概念）之間的橋樑。

元件可以把某些工作委派給服務，例如從伺服器擷取資料、驗證使用者輸入，或直接將訊息記錄到主控台。 把這類處理工作定義在可注入的服務類別中，就能讓任何元件使用這些工作。 你也可以為同一種類型的服務設定不同的提供者，依不同情境適當選用，讓應用程式更具適應性。

Angular 並不強制這些原則。 Angular 讓你能輕鬆地把應用程式邏輯拆分成服務，並透過 DI 讓元件使用這些服務，藉此幫助你遵循這些原則。

## 服務範例

以下是一個服務類別的範例，它會將訊息記錄到瀏覽器主控台。

<code-example header="src/app/logger.service.ts (class)" path="architecture/src/app/logger.service.ts" region="class"></code-example>

服務可以依賴其他服務。 例如，以下是一個依賴 `Logger` 服務的 `HeroService`，它也使用 `BackendService` 來取得英雄。 而 `BackendService` 又可能依賴 `HttpClient` 服務，從伺服器非同步擷取英雄。

<code-example header="src/app/hero.service.ts (class)" path="architecture/src/app/hero.service.ts" region="class"></code-example>

## 建立可注入的服務

Angular CLI 提供建立新服務的指令。在以下範例中，你會把一個新服務新增到先前以 `ng new` 指令建立的應用程式中。

若要在 `src/app/heroes` 資料夾中產生一個新的 `HeroService` 類別，請依照以下步驟：

1. 執行這個 [Angular CLI](cli) 指令：

<code-example language="sh">
ng generate service heroes/hero
</code-example>

這個指令會建立以下預設的 `HeroService`。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" header="src/app/heroes/hero.service.ts (CLI-generated)">
</code-example>

`@Injectable()` 裝飾器表明 Angular 可以在 DI 系統中使用這個類別。 `providedIn: 'root'` 這項詮釋資料，意味著 `HeroService` 會在整個應用程式中提供。

2. 加入一個 `getHeroes()` 方法，從 `mock.heroes.ts` 傳回英雄，以取得英雄模擬資料：

<code-example path="dependency-injection/src/app/heroes/hero.service.3.ts" header="src/app/heroes/hero.service.ts">
</code-example>

為了清晰與可維護性，建議你把元件與服務定義在不同的檔案中。

## 注入服務

若要把服務作為依賴注入元件，你可以使用元件的 `constructor()`，並提供一個帶有依賴型別的建構子引數。下列範例在 `HeroListComponent` 建構子中指定了 `HeroService`。`heroService` 的型別是 `HeroService`。由於該類別先前已用 `@Injectable` 裝飾器標註，Angular 會把 `HeroService` 認為是依賴。

<code-example header="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts" region="ctor-signature">
</code-example>

## 在其他服務中注入服務

當一個服務依賴另一個服務時，採用的模式與注入到元件相同。 在以下範例中，`HeroService` 依賴 `Logger` 服務來記錄它的活動。

首先，匯入 `Logger` 服務。接著，在 `HeroService` 的 `constructor()` 中指定 `private logger: Logger`，以注入 `Logger` 服務。

在這裡，`constructor()` 指定了 `Logger` 型別，並把 `Logger` 實例儲存在名為 `logger` 的私有欄位中。

下列程式碼分頁展示了 `Logger` 服務與兩個版本的 `HeroService`。第一版的 `HeroService` 不依賴 `Logger` 服務。修訂後的第二版則依賴 `Logger` 服務。

<code-tabs>

  <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

  <code-pane header="src/app/logger.service"
  path="dependency-injection/src/app/logger.service.ts">
  </code-pane>

</code-tabs>

在這個範例中，`getHeroes()` 方法在擷取英雄時，使用 `Logger` 服務記錄了一則訊息。

## 後續步驟

* [如何在 DI 中設定依賴](guide/dependency-injection-providers)
* [如何使用 `InjectionTokens` 來提供與注入服務／類別以外的值](guide/dependency-injection-providers#設定依賴提供者)
* [依賴注入實戰](guide/dependency-injection-in-action)

@reviewed 2022-08-02
