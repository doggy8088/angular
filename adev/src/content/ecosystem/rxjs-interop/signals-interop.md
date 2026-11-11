# RxJS 與 Angular 訊號的互通

`@angular/core/rxjs-interop` 套件提供多個 API，協助你整合 RxJS 與 Angular 訊號。

## 使用 `toSignal` 從 RxJS Observable 建立訊號

使用 `toSignal` 函式建立一個訊號，用來追蹤 Observable 的值。它的行為類似範本中的 `async` 管道，但更具彈性，可用在應用程式的任何地方。

```angular-ts
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // Get a `Signal` representing the `counterObservable`'s value.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

和 `async` 管道一樣，`toSignal` 會立即訂閱 Observable，這可能會觸發副作用。`toSignal` 建立的訂閱，會在呼叫 `toSignal` 的元件或服務被銷毀時，自動取消訂閱指定的 Observable。

IMPORTANT: `toSignal` 會建立一個訂閱。你應避免對同一個 Observable 重複呼叫它，改為重複使用它回傳的訊號。

### 注入上下文

`toSignal` 預設需要在[注入上下文](guide/di/dependency-injection-context)中執行，例如在元件或服務的建構期間。如果沒有可用的注入上下文，你可以手動指定要改用的 `Injector`。

### 初始值

Observable 在訂閱時不一定會同步產生值，但訊號永遠需要一個目前值。以下有幾種方式可以處理 `toSignal` 訊號的這個「初始」值。

#### `initialValue` 選項

如上例所示，你可以指定 `initialValue` 選項，作為訊號在 Observable 首次發送前應回傳的值。

#### `undefined` 初始值

如果你不提供 `initialValue`，產生的訊號會在 Observable 發送前回傳 `undefined`。這類似 `async` 管道回傳 `null` 的行為。

#### `requireSync` 選項

有些 Observable 保證會同步發送，例如 `BehaviorSubject`。在這種情況下，你可以指定 `requireSync: true` 選項。

當 `requiredSync` 為 `true` 時，`toSignal` 會強制要求 Observable 在訂閱時同步發送。這保證訊號永遠有值，不需要 `undefined` 型別，也不需要初始值。

### `manualCleanup`

預設情況下，當建立訊號的元件或服務被銷毀時，`toSignal` 會自動取消訂閱 Observable。

若要覆寫這個行為，可以傳入 `manualCleanup` 選項。這個設定適用於會自然完成的 Observable。

#### 自訂相等比較

有些 observable 發送的值，雖然參考不同或細節略有差異，卻應該視為**相等**。`equal` 選項讓你定義一個**自訂相等函式**，判斷兩個連續的值在何時應視為相同。

當兩個發送的值被視為相等時，產生的訊號**不會更新**。這能避免多餘的運算、DOM 更新或 effect 不必要地重新執行。

```ts
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component(/* ... */)
export class EqualExample {
  temperature$ = interval(1000).pipe(
    map(() => ({ temperature: Math.floor(Math.random() * 3) + 20 }) ) // 20, 21, or 22 randomly
  );

  // Only update if the temperature changes
  temperature = toSignal(this.temperature$, {
    initialValue: { temperature : 20  },
    equal: (prev, curr) => prev.temperature === curr.temperature
  });
}
```

### 錯誤與完成

如果用於 `toSignal` 的 Observable 產生錯誤，該錯誤會在讀取訊號時拋出。

如果用於 `toSignal` 的 Observable 完成，訊號會繼續回傳完成前最後發送的值。

## 使用 `toObservable` 從訊號建立 RxJS Observable

使用 `toObservable` 工具函式建立一個 `Observable`，用來追蹤訊號的值。訊號的值由一個 `effect` 監控，當值變更時，effect 會把值發送給 Observable。

```ts
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);

  results$ = this.query$.pipe(
    switchMap(query => this.http.get('/search?q=' + query ))
  );
}
```

隨著 `query` 訊號變更，`query$` Observable 會發送最新的查詢並觸發一個新的 HTTP 請求。

### 注入上下文

`toObservable` 預設需要在[注入上下文](guide/di/dependency-injection-context)中執行，例如在元件或服務的建構期間。如果沒有可用的注入上下文，你可以手動指定要改用的 `Injector`。

### `toObservable` 的時機

`toObservable` 使用 effect 在 `ReplaySubject` 中追蹤訊號的值。訂閱時，第一個值（如果有的話）可能會同步發送，之後的所有值都會是非同步的。

與 Observable 不同，訊號永遠不會同步通知變更。即使你多次更新訊號的值，`toObservable` 也只會在訊號穩定後才發送該值。

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe(value => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

在這裡，只有最後的值（3）會被記錄下來。

## 使用 `rxResource` 處理非同步資料 {#using-rxresource-for-async-data}

IMPORTANT: `rxResource` 目前屬於[實驗性功能](reference/releases#experimental)。它已經可以試用，但在成為穩定版之前仍可能有所變更。

Angular 的 [`resource` 函式](/guide/signals/resource)讓你把非同步資料納入應用程式以訊號為基礎的程式碼。在這個模式之上，`rxResource` 讓你定義一個 resource，其資料來源以 RxJS `Observable` 表示。`rxResource` 不接受 `loader` 函式，而是接受一個接受 RxJS `Observable` 的 `stream` 函式。

```typescript
import {Component, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class UserProfile {
  // This component relies on a service that exposes data through an RxJS Observable.
  private userData = inject(MyUserDataClient);

  protected userId = input<string>();

  private userResource = rxResource({
    params: () => ({ userId: this.userId() }),

    // The `stream` property expects a factory function that returns
    // a data stream as an RxJS Observable.
    stream: ({params}) => this.userData.load(params.userId),
  });
}
```

`stream` 屬性接受一個 RxJS `Observable` 的工廠函式。這個工廠函式會收到 resource 的 `params` 值，並回傳一個 `Observable`。每當 `params` 運算產生新值時，resource 就會呼叫這個工廠函式。工廠函式收到的參數詳情，請參閱 [Resource loaders](/guide/signals/resource#resource-loaders)。

在其他方面，`rxResource` 的行為與 `resource` 相同，並提供相同的 API，用於指定參數、讀取值、檢查載入狀態與檢視錯誤。
