# 使用資源處理非同步反應式

IMPORTANT: `resource` 是[實驗性](reference/releases#experimental)功能。它已經可以試用，但在穩定之前仍可能改變。

所有訊號 API 都是同步的——`signal`、`computed`、`input` 等。然而，應用程式經常需要處理以非同步方式取得的資料。`Resource` 讓你可以將非同步資料納入應用程式以訊號為基礎的程式碼中，同時仍能以同步方式存取其資料。

你可以使用 `Resource` 執行任何種類的非同步操作，但 `Resource` 最常見的用途是從伺服器擷取資料。以下範例建立一個資源來擷取某些使用者資料。

建立 `Resource` 最簡單的方法是使用 `resource` 函式。

```typescript
import {resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Define a reactive computation.
  // The params value recomputes whenever any read signals change.
  params: () => ({id: userId()}),

  // Define an async loader that retrieves data.
  // The resource calls this function every time the `params` value changes.
  loader: ({params}) => fetchUser(params),
});

// Create a computed signal based on the result of the resource's loader function.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` serves 2 purposes:
    // - It acts as type guard to strip `undefined` from the type
    // - It protects against reading a throwing `value` when the resource is in error state
    return userResource.value().firstName;
  }

  // fallback in case the resource value is `undefined` or if the resource is in error state
  return undefined;
});
```

`resource` 函式接受一個 `ResourceOptions` 物件，它有兩個主要屬性：`params` 與 `loader`。

`params` 屬性定義一個反應式計算，用來產生參數值。每當這個計算中讀取的訊號改變時，資源就會產生新的參數值，類似 `computed` 的行為。

`loader` 屬性定義一個 `ResourceLoader`——一個用來擷取某些狀態的非同步函式。每當 `params` 計算產生新值時，資源就會呼叫 loader，並把該值傳給它。詳情請參閱下方的[資源載入器](#resource-loaders)。

`Resource` 有一個 `value` 訊號，其中包含 loader 的結果。

## 資源載入器 {#resource-loaders}

建立資源時，你要指定一個 `ResourceLoader`。這個 loader 是一個非同步函式，接受單一參數——一個 `ResourceLoaderParams` 物件——並傳回一個值。

`ResourceLoaderParams` 物件包含三個屬性：`params`、`previous` 與 `abortSignal`。

| Property      | 說明                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params`      | 資源的 `params` 計算所產生的值。                                                                                                |
| `previous`    | 一個帶有 `status` 屬性的物件，包含先前的 `ResourceStatus`。                                                                    |
| `abortSignal` | 一個 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。詳情請參閱下方的[中止請求](#aborting-requests)。 |

如果 `params` 計算傳回 `undefined`，loader 函式就不會執行，資源狀態會變成 `'idle'`。

### 中止請求 {#aborting-requests}

如果資源載入期間 `params` 計算改變，資源會中止尚未完成的載入操作。

你可以使用 `ResourceLoaderParams` 中的 `abortSignal` 來回應被中止的請求。例如，原生的 `fetch` 函式就接受一個 `AbortSignal`：

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${params.id}`, {signal: abortSignal});
  },
});
```

關於使用 `AbortSignal` 取消請求的更多詳情，請參閱 [MDN 上的 `AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。

### 重新載入 {#reloading}

你可以呼叫 `reload` 方法，以程式化方式觸發資源的 `loader`。

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

// ...

userResource.reload();
```

## 資源狀態 {#resource-status}

資源物件有數個訊號屬性，可用來讀取非同步 loader 的狀態。

| Property    | 說明                                                                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`     | 資源的最新值；如果尚未收到任何值，則為 `undefined`。 |
| `hasValue`  | 資源是否有值。                                                                                                                                                            |
| `error`     | 執行資源 loader 時遇到的最新錯誤；如果尚未發生錯誤，則為 `undefined`。                                                                              |
| `isLoading` | 資源 loader 目前是否正在執行。                                                                                                                                            |
| `status`    | 資源的具體 `ResourceStatus`，如下所述。                                                                                                                                |

`status` 訊號提供一個具體的 `ResourceStatus`，以字串常數描述資源的狀態。

| Status        | `value()`         | 說明                                                                  |
| ------------- | :---------------- | ---------------------------------------------------------------------------- |
| `'idle'`      | `undefined`       | 資源沒有有效的請求，且 loader 尚未執行。                |
| `'error'`     | `undefined`       | loader 遇到了錯誤。                                         |
| `'loading'`   | `undefined`       | loader 因 `params` 值改變而正在執行。            |
| `'reloading'` | 先前的值    | loader 因呼叫資源的 `reload` 方法而正在執行。 |
| `'resolved'`  | 解析完成的值    | loader 已完成。                                                    |
| `'local'`     | 在本機設定的值 | 資源的值已透過 `.set()` 或 `.update()` 在本機設定。        |

你可以使用這些狀態資訊來條件式地顯示使用者介面元素，例如載入指示器與錯誤訊息。

## 使用 `httpResource` 進行反應式資料擷取 {#reactive-data-fetching-with-httpresource}

[`httpResource`](/guide/http/http-resource) 是 `HttpClient` 的包裝器，它會把請求狀態與回應以訊號的形式提供給你。它透過 Angular 的 HTTP 堆疊（包括攔截器）發出 HTTP 請求。

## 使用快照組合資源 {#resource-composition-with-snapshots}

`ResourceSnapshot` 是資源目前狀態的結構化表示。每個資源都有一個 `snapshot` 屬性，提供其目前狀態的訊號。

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

const userSnapshot = userResource.snapshot;
```

每個快照都包含一個 `status`，以及一個 `value` 或一個 `error`。

### 使用快照組合資源 {#composing-resources-with-snapshots}

你可以使用 `resourceFromSnapshots` 從快照建立新的資源。這讓你能與 `computed`、`linkedSignal` 等訊號 API 組合，來轉換資源的行為。

```ts
import {linkedSignal, resourceFromSnapshots, Resource, ResourceSnapshot} from '@angular/core';

function withPreviousValue<T>(input: Resource<T>): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        // When the input resource enters loading state, we keep the value
        // from its previous state, if any.
        return {status: 'loading' as const, value: previous.value.value};
      }

      // Otherwise we simply forward the state of the input resource.
      return snap;
    },
  });

  return resourceFromSnapshots(derived);
}

@Component({
  /*... */
})
export class AwesomeProfile {
  userId = input.required<number>();
  user = withPreviousValue(httpResource(() => `/user/${this.userId()}`));
  // When userId changes, user.value() keeps the old user data until the new one loads
}
```
