# Angular 中的依賴注入

依賴是類別執行其功能所需的服務或物件。
依賴注入（dependency injection，簡稱 DI）是一種設計模式，在這種模式中，類別會向外部來源請求依賴，而不是自行建立它們。

Angular 的 DI 框架會在類別實例化時為它提供依賴。
使用 Angular DI 可以提高應用程式的彈性與模組化程度。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 建立可注入的服務

若要在 `src/app/heroes` 資料夾中產生一個新的 `HeroService` 類別，請使用下列 [Angular CLI](cli) 指令。

<code-example format="shell" language="shell">

ng generate service heroes/hero

</code-example>

這個指令會建立以下預設的 `HeroService`。

<code-example header="src/app/heroes/hero.service.ts (CLI-generated)" path="dependency-injection/src/app/heroes/hero.service.0.ts"></code-example>

`@Injectable()` 裝飾器表明 Angular 可以在 DI 系統中使用這個類別。
`providedIn: 'root'` 這項詮釋資料，意味著 `HeroService` 在整個應用程式中都可見。

接著，若要取得英雄模擬資料，請加入一個 `getHeroes()` 方法，從 `mock.heroes.ts` 傳回英雄。

<code-example header="src/app/heroes/hero.service.ts" path="dependency-injection/src/app/heroes/hero.service.3.ts"></code-example>

為了清晰與可維護性，建議你把元件與服務定義在不同的檔案中。

如果你確實把元件與服務合併在同一個檔案中，務必先定義服務，再定義元件。
如果你在服務之前定義元件，Angular 會傳回執行時期的 null 參照錯誤。

<a id="injector-config"></a>
<a id="bootstrap"></a>

## 注入服務

注入服務能讓服務在元件中可見。

若要把依賴注入元件的 `constructor()`，請提供一個帶有依賴型別的建構子引數。
下列範例在 `HeroListComponent` 建構子中指定了 `HeroService`。
`heroService` 的型別是 `HeroService`。

<code-example header="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature"></code-example>

如需更多資訊，請參閱[在模組中提供依賴](guide/providers)與[階層式注入器](guide/hierarchical-dependency-injection)。

<a id="service-needs-service"></a>

## 在其他服務中使用服務

當一個服務依賴另一個服務時，採用的模式與注入到元件相同。
在以下範例中，`HeroService` 依賴 `Logger` 服務來記錄它的活動。

首先，匯入 `Logger` 服務。
接著，在 `HeroService` 的 `constructor()` 括號內指定 `private logger: Logger`，以注入 `Logger` 服務。

當你建立的類別其 `constructor()` 帶有參數時，請指定這些參數的型別與詮釋資料，讓 Angular 能注入正確的服務。

在這裡，`constructor()` 指定了 `Logger` 型別，並把 `Logger` 實例儲存在名為 `logger` 的私有欄位中。

下列程式碼分頁展示了 `Logger` 服務與兩個版本的 `HeroService`。
第一版的 `HeroService` 不依賴 `Logger` 服務。
修訂後的第二版則依賴 `Logger` 服務。

<code-tabs>
    <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts"></code-pane>
    <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts"></code-pane>
    <code-pane header="src/app/logger.service" path="dependency-injection/src/app/logger.service.ts"></code-pane>
</code-tabs>

在這個範例中，`getHeroes()` 方法在擷取英雄時，使用 `Logger` 服務記錄了一則訊息。

## 後續步驟

*   [依賴提供者](guide/dependency-injection-providers)
*   [DI 權杖與提供者](guide/dependency-injection-providers)
*   [依賴注入實戰](guide/dependency-injection-in-action)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
