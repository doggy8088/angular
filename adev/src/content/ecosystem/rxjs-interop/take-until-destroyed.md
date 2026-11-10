# 使用 `takeUntilDestroyed` 取消訂閱

TIP: 本指南假設你已熟悉[元件與指令的生命週期](guide/components/lifecycle)。

來自 `@angular/core/rxjs-interop` 的 `takeUntilDestroyed` 運算子，提供一種簡潔可靠的方式，在元件或指令被銷毀時自動取消訂閱 Observable。這能避免 RxJS 訂閱常見的記憶體洩漏。它的運作方式類似 RxJS 的 [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) 運算子，但不需要另外準備一個 Subject。

```typescript
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NotificationDispatcher, CustomPopupShower} from './some-shared-project-code';

@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);

  constructor() {
    // This subscription the 'notifications' Observable is automatically
    // unsubscribed when the 'UserProfile' component is destroyed.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed()).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```

`takeUntilDestroyed` 運算子接受單一個可選的 [`DestroyRef`](/api/core/DestroyRef) 引數。運算子透過 `DestroyRef` 得知元件或指令何時被銷毀。在[注入上下文](/guide/di/dependency-injection-context)中呼叫 `takeUntilDestroyed` 時可以省略這個引數，典型情境是元件或指令的建構子。如果你的程式碼可能在注入上下文之外呼叫 `takeUntilDestroyed`，就務必提供 `DestroyRef`。

```typescript
@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);
  private destroyRef = inject(DestroyRef);

  startListeningToNotifications() {
    // Always pass a `DestroyRef` if you call `takeUntilDestroyed` outside
    // of an injection context.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```
