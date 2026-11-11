# 注入上下文

依賴注入（DI）系統在內部仰賴一個執行階段上下文，目前的注入器在這個上下文中可供使用。

這表示注入器只有在程式碼於這樣的上下文中執行時，才能運作。

注入上下文在以下情境中可供使用：

* 在正由 DI 系統實例化的類別（例如 `@Injectable` 或 `@Component`）的建構期間（透過 `constructor`）。
* 在這類類別的欄位初始化器中。
* 在為 `Provider` 或 `@Injectable` 的 `useFactory` 指定的工廠函式中。
* 在為 `InjectionToken` 指定的 `factory` 函式中。
* 在於注入上下文中執行的堆疊框架內。

知道自己何時處於注入上下文中，將能讓你使用 [`inject`](api/core/inject) 函式來注入實例。

## 類別建構子 {#class-constructors}

每當 DI 系統實例化一個類別時，都是在注入上下文中進行的。這由框架本身處理。類別的建構子會在該執行階段上下文中執行，這也讓你可以使用 [`inject`](api/core/inject) 函式來注入 token。

<docs-code language="typescript" highlight="[[3],[6]]">
class MyComponent  {
  private service1: Service1;
  private service2: Service2 = inject(Service2); // In context

  constructor() {
    this.service1 = inject(Service1) // In context
  }
}
</docs-code>

## 上下文中的堆疊框架

有些 API 被設計成在注入上下文中執行。例如，路由守衛就是如此。這讓 [`inject`](api/core/inject) 可以在守衛函式中用來存取某個服務。

以下是一個 `CanActivateFn` 的範例：

<docs-code language="typescript" highlight="[3]">
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
</docs-code>

## 在注入上下文中執行 {#run-within-an-injection-context}

當你想在注入上下文中執行一個指定的函式、但自己還不在注入上下文中時，可以使用 `runInInjectionContext` 來做到。
這需要能存取一個指定的注入器，例如 `EnvironmentInjector`：

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

請注意，只有當注入器能解析所需的 token 時，`inject` 才會傳回實例。

## 斷言上下文 {#asserts-the-context}

Angular 提供 `assertInInjectionContext` 輔助函式，用來斷言目前的上下文是注入上下文。

## 在上下文之外使用 DI

在注入上下文之外呼叫 [`inject`](api/core/inject) 或呼叫 `assertInInjectionContext`，將會擲出[錯誤 NG0203](/errors/NG0203)。
