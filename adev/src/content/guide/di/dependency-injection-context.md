# Injection context

相依性注入 (DI) 系統在內部依賴於執行時間環境，在該環境中可取得目前的注入器。
這表示注入器只有在程式碼在此環境中執行時才能運作。

注入內容在下列情況下可用：

* 建構函式（通過 `constructor`）建立一個由相依性注入系統實例化的類別，例如 `@Injectable` 或 `@Component`。
* 在此類別的欄位初始化項中。
* 在 `Provider` 或 `@Injectable` 的 `useFactory` 指定的工廠函式中。
* 在 `InjectionToken` 指定的 `factory` 函式中。
* 在注入內容中執行的堆疊框架中。

了解何時處於注入環境中，將允許您使用 [`inject`](api/core/inject) 函式來注入執行個體。

## 類別建構函式

每次 DI 系統實例化一個類別時，這會在注入內容中完成。這由架構本身處理。類別的建構函式在該執行階段內容中執行，因此允許使用 [`inject`](api/core/inject) 函式注入令牌。

<docs-code language="typescript" highlight="[[3],[6]]">
class MyComponent  {
  private service1: Service1;
  private service2: Service2 = inject(Service2); // In context

constructor() {
    this.service1 = inject(HeroService) // In context
  }
}
</docs-code>

## 上下文中堆疊的框架

有些 API 是設計用於在注入的內容中執行。例如，路由防護就是如此。它允許使用 [`inject`](api/core/inject) 存取防護函式中的服務。

以下是一個 `CanActivateFn` 的範例：

<docs-code language="typescript" highlight="[3]">
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
</docs-code>

## 在注入內容中執行

當您想在不在注入內容中執行給定函式時，您可以使用 `runInInjectionContext` 來執行。
這需要訪問給定的注入器，例如 `EnvironmentInjector`。

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[9]">
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Do what you need with the injected service
    });
  }
}
</docs-code>

注意，僅當注入器可以解決所需的令牌時，`inject` 才會傳回一個實例。

## 斷言上下文

Angular 提供 `assertInInjectionContext` 輔助函式，用以斷言目前的情境是注入的情境。

## 在背景之外使用 DI

呼叫 [`inject`](api/core/inject) 或在注入內容外呼叫 `assertInInjectionContext` 會擲出 [錯誤 NG0203](/errors/NG0203)。
