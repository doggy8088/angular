# 注入上下文

這表示注入器只有在程式碼於這樣的上下文中執行時，才能運作。

注入上下文在以下情境中可供使用：

* 在正由 DI 系統實例化的類別（例如 `@Injectable` 或 `@Component`）的建構期間（透過 `constructor`）。
* 在這類類別的欄位初始化器中。
* 在為 `Provider` 或 `@Injectable` 的 `useFactory` 指定的工廠函式中。
* 在為 `InjectionToken` 指定的 `factory` 函式中。
* 在於注入上下文中執行的堆疊框架內。

知道自己何時處於注入上下文中，將能讓你使用 [`inject`](api/core/inject) 函式來注入實例。

## 類別建構子

每當 DI 系統實例化一個類別時，都是在注入上下文中進行的。這由框架本身處理。類別的建構子會在該執行階段上下文中執行，因此你可以使用 [`inject`](api/core/inject) 函式來注入 token。

<code-example language="typescript">
class MyComponent  {
  private service1: Service1;
  private service2: Service2 = inject(Service2); // In context

  constructor() {
    this.service1 = inject(HeroService) // In context
  }
}
</code-example>

## 上下文中的堆疊框架

有些 API 被設計成在注入上下文中執行。例如，路由守衛就是如此。這讓你可以在守衛函式中使用 [`inject`](api/core/inject) 來存取服務。

以下是一個 `CanActivateFn` 的範例：
<code-example format="typescript" language="typescript">
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
</code-example>

## 在注入上下文中執行

當你想在注入上下文中執行某個函式，但目前並不在注入上下文中時，你可以使用 `runInInjectionContext` 來達成。這需要你能存取某個注入器，例如 `EnvironmentInjector`。

<code-example path="dependency-injection/src/app/heroes/hero.service.5.ts" region="run-in-context" header="src/app/heroes/hero.service.ts">
</code-example>

請注意，只有當注入器能解析所需的 token 時，`inject` 才會傳回實例。

## 斷言上下文

Angular 提供 `assertInInjectionContext` 輔助函式，用來斷言目前的上下文是注入上下文。

## 在上下文之外使用 DI

在注入上下文之外呼叫 [`inject`](api/core/inject) 或呼叫 `assertInInjectionContext`，將會擲出[錯誤 NG0203](/errors/NG0203)。



@reviewed 2023-04-11
