# 注入上下文

依賴注入（DI）系統在內部仰賴一個執行階段上下文，目前的注入器在這個上下文中可供使用。

這表示注入器只有在程式碼於這樣的上下文中執行時，才能運作。

注入上下文在以下情境中可供使用：

- 在正由 DI 系統實例化的類別（例如 `@Injectable` 或 `@Component`）的建構期間（透過 `constructor`）。
- 在這類類別的欄位初始化器中。
- 在為 `Provider` 或 `@Injectable` 的 `useFactory` 指定的工廠函式中。
- 在為 `InjectionToken` 指定的 `factory` 函式中。
- 在於注入上下文中執行的堆疊框架內。

知道自己何時處於注入上下文中，將能讓你使用 [`inject`](api/core/inject) 函式來注入實例。

NOTE: 關於在類別建構子和欄位初始化器中使用 `inject()` 的基本範例，請參閱[總覽指南](guide/di/overview#where-can-inject-be-used)。

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

Angular 提供 `assertInInjectionContext` 輔助函式，用來斷言目前的上下文是注入上下文，若不是則擲出清楚的錯誤。傳入呼叫端函式的參考，讓錯誤訊息指向正確的 API 入口點。這會產生比預設的通用注入錯誤更清楚、更可操作的訊息。

```ts
import { ElementRef, assertInInjectionContext, inject } from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
    assertInInjectionContext(injectNativeElement);
    return inject(ElementRef).nativeElement;
}
```

接著你可以**從注入上下文中**（建構子、欄位初始化器、提供者工廠，或透過 `runInInjectionContext` 執行的程式碼）呼叫這個輔助函式：

```ts
import { Component, inject } from '@angular/core';
import { injectNativeElement } from './dom-helpers';

@Component({ /* … */ })
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // Field initializer runs in an injection context.

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // Fails: runs outside an injection context.
  }
}
```

## 在上下文之外使用 DI

在注入上下文之外呼叫 [`inject`](api/core/inject) 或呼叫 `assertInInjectionContext`，將會擲出[錯誤 NG0203](/errors/NG0203)。
