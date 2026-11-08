# 使用 `debounced` 對訊號進行防抖

IMPORTANT: `debounced` 是 [實驗性](reference/releases#experimental) 功能。它已可供你試用，但在穩定之前仍可能改變。

使用 `debounced`（防抖），可以延遲對訊號值的反應，直到它停止變化為止。它傳回一個 `Resource`，其值反映來源訊號經過防抖後的值。

```angular-ts
import {Component, debounced, resource, signal} from '@angular/core';

@Component({
  template: `
    <input (input)="query.set($event.target.value)" />

    @if (results.isLoading()) {
      <p>Searching…</p>
    }
    @for (item of results.value(); track item.id) {
      <li>{{ item.name }}</li>
    }
  `,
})
export class Search {
  query = signal('');

  debouncedQuery = debounced(this.query, 300);

  results = resource({
    params: () => this.debouncedQuery.value(),
    loader: ({params}) => fetchResults(params),
  });
}
```

`debounced` 接收來源訊號與以毫秒為單位的等待時間。傳回的資源的 `value()` 永遠包含最後一個已定下來的值，`status()` 則告訴你新值是否仍在等待中。

## 防抖期間的狀態

防抖計時器倒數期間，`status()` 為 `'loading'`，`value()` 傳回先前已解析的值。計時器到期時，資源會定為 `'resolved'`。若來源訊號拋出錯誤，資源會立即進入 `'error'`，不會啟動計時器。

完整的狀態清單及其 `value()` 行為，請參閱 [Resource 狀態](/guide/signals/resource#resource-status)。

## 自訂等待函式

除了毫秒數，你也可以傳入一個傳回 `Promise<void>` 的函式。資源會在 promise 解析時解析。若來源訊號在 promise 定下來之前就改變，Angular 會捨棄先前的 promise 並啟動新的 promise。

```ts
debouncedQuery = debounced(query, (value, lastSnapshot) => {
  // Retry immediately after an error rather than making the user wait again.
  if (lastSnapshot.status === 'error') return;
  // Short queries get a longer delay—the user is likely still typing.
  const ms = value.length < 3 ? 500 : 200;
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
});
```

詳情請參閱 API 參考中的 `DebounceTimer` 型別。

## 相等性判斷

預設情況下，`debounced` 使用 `Object.is` 比較值。

當預設的同一性檢查太嚴格時，請使用 `equal` 選項提供自訂的相等性函式：

```ts
debouncedFilter = debounced(filter, 200, {
  equal: (a, b) => a.category === b.category && a.minPrice === b.minPrice,
});
```

## 注入上下文

`debounced` 必須在 [注入上下文](guide/di/dependency-injection-context) 內呼叫。當注入器被銷毀時，Angular 會自動銷毀經過防抖的資源，並取消任何等待中的計時器。

若要在注入上下文之外使用 `debounced`，請透過選項傳入明確的 `Injector`：

```ts
@Service()
export class SearchService {
  private injector = inject(Injector);

  createDebouncedQuery(query: Signal<string>): Resource<string> {
    return debounced(query, 300, {injector: this.injector});
  }
}
```
