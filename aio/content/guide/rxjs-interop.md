# RxJS 互通

<div class="alert is-important">

RxJS Interop 套件目前處於[開發者預覽](/guide/releases#開發者預覽)階段。它已經可以試用，但在成為穩定版之前仍可能有所變更。

</div>

Angular 的 `@angular/core/rxjs-interop` 套件提供實用的工具函式，協助你將 [Angular 訊號](/guide/signals) 與 RxJS Observable 整合。

## `toSignal`

使用 `toSignal` 函式建立一個訊號，用來追蹤 Observable 的值。它的行為類似範本中的 `async` 管道，但更具彈性，可用在應用程式的任何地方。

```ts
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // Get a `Signal` representing the `counterObservable`'s value.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

如同 `async` 管道，`toSignal` 會立即訂閱 Observable，這可能會觸發副作用。`toSignal` 建立的訂閱，會在呼叫 `toSignal` 的元件銷毀時，自動取消訂閱指定的 Observable。

### 初始值

Observable 在訂閱時不一定會同步產生值，但訊號永遠需要一個目前值。以下有幾種方式可以處理 `toSignal` 訊號的這個「初始」值。

#### `initialValue` 選項

如同上述範例，`initialValue` 選項指定了訊號在 Observable 第一次發出值之前應傳回的值。

#### `undefined` 初始值

如果省略 `initialValue`，`toSignal` 傳回的訊號在 Observable 發出值之前會傳回 `undefined`。這與 `async` 管道傳回 `null` 的行為類似。

#### `requireSync` 選項

有些 Observable 保證會同步發送，例如 `BehaviorSubject`。在這種情況下，你可以指定 `requireSync: true` 選項。

當 `requiredSync` 為 `true` 時，`toSignal` 會強制要求 Observable 在訂閱時同步發送。這保證訊號永遠有值，不需要 `undefined` 型別，也不需要初始值。

### `manualCleanup`

預設情況下，`toSignal` 會在建立它的情境銷毀時，自動取消訂閱 Observable。例如，如果在建立元件期間呼叫 `toSignal`，它會在元件銷毀時清理訂閱。

`manualCleanup` 選項會停用這種自動清理。如果 Observable 會自然完成，你可以使用這個設定。

### 錯誤與完成

如果用於 `toSignal` 的 Observable 產生錯誤，該錯誤會在讀取訊號時拋出。

如果用於 `toSignal` 的 Observable 完成，訊號會繼續回傳完成前最後發送的值。

## `toObservable`

使用 `toObservable` 工具函式建立一個 `Observable`，用來追蹤訊號的值。訊號的值由一個 `effect` 監控，當值變更時，effect 會把值發送給 Observable。

```ts
import { Component, signal } from '@angular/core';

@Component(...)
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

`toObservable` 預設需要在[注入上下文](/guide/dependency-injection-context)中執行，例如在建立元件或服務期間。如果沒有注入上下文，也可以明確指定一個 `Injector`。

### `toObservable` 的時機

`toObservable` 使用 effect 在 `ReplaySubject` 中追蹤訊號的值。訂閱時，第一個值（如果有的話）可能會同步發送，之後的所有值都會是非同步的。

與 Observable 不同，訊號絕不會同步通知變更。即使你的程式碼多次更新訊號的值，依賴該值的 `effect` 也只會在訊號「穩定下來」之後才執行。

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe(value => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

在這裡，只有最後的值（3）會被記錄下來。
