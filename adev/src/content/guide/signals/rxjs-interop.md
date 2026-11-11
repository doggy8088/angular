# RxJS 互通

IMPORTANT: RxJS Interop 套件目前處於[開發者預覽](reference/releases#developer-preview)階段。它已經可以試用，但在成為穩定版之前仍可能有所變更。

Angular 的 `@angular/core/rxjs-interop` 套件提供實用的工具函式，協助你將 [Angular 訊號](guide/signals) 與 RxJS Observable 整合。

## `toSignal`

使用 `toSignal` 函式建立一個訊號，用來追蹤 Observable 的值。它的行為類似範本中的 `async` 管道，但更具彈性，可用在應用程式的任何地方。

```ts
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

### 注入上下文 {#injection-context}

`toSignal` 預設需要在[注入上下文](guide/di/dependency-injection-context)中執行，例如在元件或服務的建構期間。如果沒有可用的注入上下文，你可以手動指定要改用的 `Injector`。

### 初始值 {#initial-values}

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

### 錯誤與完成 {#error-and-completion}

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

### 注入上下文 {#injection-context}

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

### `outputFromObservable`

`outputFromObservable(...)` 宣告一個 Angular 輸出，根據 RxJS observable 發送值。

```ts
class MyDir {
  nameChange$ = new Observable<string>(/* ... */);
  nameChange = outputFromObservable(this.nameChange$); // OutputRef<string>
}
```

詳情請參閱 [output() API 指南](/guide/components/output-fn)。

### `outputToObservable`

`outputToObservable(...)` 將 Angular 輸出轉換為 observable。這讓你能方便地將 Angular 輸出整合進 RxJS 串流。

```ts
outputToObservable(myComp.instance.onNameChange)
  .pipe(...)
  .subscribe(...)
```

詳情請參閱 [output() API 指南](/guide/components/output-fn)。
