# RxJS Interop

IMPORTANT: RxJS Interop 套件可供 [開發人員預覽](reference/releases#developer-preview)。您可以試用，但它可能會在穩定之前發生變更。

Angular 的 `@angular/core/rxjs-interop` 套件提供了有用的工具，可將 [Angular 信號](guide/signals) 與 RxJS Observables 整合。

## `toSignal`

使用 `toSignal` 函式來建立一個信號，用於追蹤 Observable 的值。它的行為與範本中的 `async` 管道類似，但更靈活，可以在應用程式的任何地方使用。

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

如同 `async` 管道，`toSignal` 會立即訂閱 Observable，這可能會觸發副作用。`toSignal` 建立的訂閱會在呼叫 `toSignal` 的元件或服務被銷毀時自動取消訂閱指定的 Observable。

重要事項：`toSignal` 會建立訂閱。您應避免對同一個可觀察物件重複呼叫它，而應重複使用它傳回的訊號。

### 初始值

Observables 可能不會在訂閱時同步產生值，但信號總是需要一個目前值。有許多方法可以處理 `toSignal` 信號的這個「初始」值。

#### `initialValue` 選項

如上面的範例所示，您可以指定一個 `initialValue` 選項，其值為 Observable 第一次發出之前訊號應該回傳的值。

#### `undefined` 初始值

如果您沒有提供 `initialValue`，則產生的訊號將會回傳 `undefined`，直到 Observable 發出。這類似於 `async` 管道回傳 `null` 的行為。

#### `requireSync` 選項

某些 Observables 保證會同步發射，例如 `BehaviorSubject`。在這些情況下，您可以指定 `requireSync: true` 選項。

當 `requiredSync` 為 `true` 時，`toSignal` 強制 Observable 在訂閱時同步發射。這可保證信號始終具有值，並且不需要 `undefined` 類型或初始值。

### `manualCleanup``

預設情況下，當建立 `toSignal` 的元件或服務被銷毀時，`toSignal` 會自動取消訂閱 Observable。

若要覆寫此行為，可以傳遞 `manualCleanup` 選項。您可以針對自然完成的 Observable 使用此設定。

### 錯誤和完成

如果在 `toSignal` 中使用的 Observable 產生錯誤，則在讀取信號時會擲出該錯誤。

如果在 `toSignal` 中使用的 Observable 完成，訊號會繼續傳回完成前最近發出的值。

## `toObservable``

使用 `toObservable` 工具程式建立一個 `Observable` 來追蹤訊號的值。訊號的值會由 `effect` 監控，當值變更時，`effect` 會將值發射到 `Observable`。

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

隨著 `query` 訊號改變，`query$` Observable 會發出最新的查詢並觸發新的 HTTP 請求。

### 注入背景

預設情況下，`toObservable` 需要在 [注入內容](guide/di/dependency-injection-context) 中執行，例如在建構元件或服務期間。如果沒有注入內容可用，您可以手動指定要使用的 `Injector`。

### `toObservable` 的時機

`toObservable` 使用效應來追蹤 `ReplaySubject` 中信號的值。在訂閱時，第一個值（如果有）可能會同步發出，而所有後續值都將是非同步的。

與可觀察的物件不同，訊號永遠不會提供同步的變更通知。即使您多次更新訊號的值，`toObservable` 僅會在訊號穩定後才發出該值。

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe(value => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

在這裡，只有最後一個值 (3) 會被記錄。
