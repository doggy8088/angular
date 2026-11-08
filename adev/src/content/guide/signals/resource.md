# 使用資源處理非同步反應式

所有訊號 API 都是同步的——`signal`、`computed`、`input` 等。然而，應用程式經常需要處理以非同步方式取得的資料。`Resource` 讓你可以將非同步資料納入應用程式以訊號為基礎的程式碼中，同時仍能以同步方式存取其資料。

你可以使用 `Resource` 執行任何種類的非同步操作，但 `Resource` 最常見的用途是從伺服器擷取資料。以下範例建立一個資源來擷取某些使用者資料。

建立 `Resource` 最簡單的方法是使用 `resource` 函式。

```typescript
import {computed, resource, Signal} from '@angular/core';

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

## 資源載入器

建立資源時，你要指定一個 `ResourceLoader`。這個 loader 是一個非同步函式，接受單一參數——一個 `ResourceLoaderParams` 物件——並傳回一個值。

`ResourceLoaderParams` 物件包含三個屬性：`params`、`previous` 與 `abortSignal`。

| Property      | Description                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params`      | 資源的 `params` 計算所產生的值。                                                                                                |
| `previous`    | 一個帶有 `status` 屬性的物件，包含先前的 `ResourceStatus`。                                                                    |
| `abortSignal` | 一個 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。詳情請參閱下方的[中止請求](#aborting-requests)。 |

如果 `params` 計算傳回 `undefined`，loader 函式就不會執行，資源狀態會變成 `'idle'`。

### 串流資源

某些非同步資料來源會隨時間產生多個值，而不是傳回單一結果。例如 WebSockets、Server-Sent Events (SSE)，以及 Firestore 的 `onSnapshot` 監聽器。

對於這類持續更新的資料來源，請使用 `stream`。與每個請求只解析一次的 `loader` 不同，`stream` 傳回的訊號其值可以隨著新資料到來而持續更新。

對於一次性的非同步操作，例如從 HTTP 端點擷取資料，請使用 `loader`。

在這個範例中，`userUpdates` 模擬一個外部來源，例如 WebSocket 或 SSE 連線。

```typescript
const userUpdates = signal({value: 'Alice'});

const userResource = resource({
  stream: () => userUpdates,
});

// Simulate a new value arriving from the external data source:
userUpdates.set({value: 'Bob'});
```

### 中止請求

如果資源載入期間 `params` 計算改變，資源會中止尚未完成的載入操作。

你可以使用 `ResourceLoaderParams` 中的 `abortSignal` 來回應被中止的請求。例如，原生的 `fetch` 函式就接受一個 `AbortSignal`：

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${params.id}`, {signal: abortSignal}).then((res) => res.json());
  },
});
```

關於使用 `AbortSignal` 取消請求的更多詳情，請參閱 [MDN 上的 `AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。

### 重新載入

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

## 資源狀態

資源物件有數個訊號屬性，可用來讀取非同步 loader 的狀態。

| Property    | Description                                                                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`     | 資源的最新值；如果尚未收到任何值，則為預設值（除非有設定 `defaultValue`，否則為 `undefined`）。當狀態為 `'error'` 時，讀取 `value()` 會擲出錯誤。 |
| `hasValue`  | 資源是否有值。                                                                                                                                                            |
| `error`     | 執行資源 loader 時遇到的最新錯誤；如果尚未發生錯誤，則為 `undefined`。                                                                              |
| `isLoading` | 資源 loader 目前是否正在執行。                                                                                                                                            |
| `status`    | 資源的具體 `ResourceStatus`，如下所述。                                                                                                                                |

`status` 訊號提供一個具體的 `ResourceStatus`，以字串常數描述資源的狀態。

| Status        | `value()`         | Description                                                                  |
| ------------- | :---------------- | ---------------------------------------------------------------------------- |
| `'idle'`      | `undefined`       | 資源沒有有效的請求，且 loader 尚未執行。                |
| `'error'`     | 擲出錯誤   | loader 遇到了錯誤。                                         |
| `'loading'`   | `undefined`       | loader 因 `params` 值改變而正在執行。            |
| `'reloading'` | 先前的值    | loader 因呼叫資源的 `reload` 方法而正在執行。 |
| `'resolved'`  | 解析完成的值    | loader 已完成。                                                    |
| `'local'`     | 在本機設定的值 | 資源的值已透過 `.set()` 或 `.update()` 在本機設定。        |

你可以使用這些狀態資訊來條件式地顯示使用者介面元素，例如載入指示器與錯誤訊息。

## 搭配 SSR 快取 `resource` 資料

當應用程式在伺服器上渲染時，資源 loader 會執行一次以產生初始 HTML。在水合（hydration）期間，瀏覽器通常會再執行一次同一個 loader。

若要重用伺服器端的結果，請為資源提供一個 `id`。Angular 會在伺服器上把解析完成的值存入 `TransferState`，並在用戶端用它把資源初始化為 `'resolved'` 狀態。

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
  id: 'user-unique-id',
});
```

`id` 值在你的應用程式中必須唯一，且在伺服器與用戶端上必須相同，Angular 才能把快取項目對應到提出請求的資源。

IMPORTANT: 由於快取值會被序列化進頁面的 HTML 中，請避免在載入特定使用者資料的資源上設定 `id`，尤其是那些資料屬於觸發伺服器端渲染的使用者、且渲染出的 HTML 可能被快取或在使用者之間共用時。

## 串連資源

有時，一個資源會依賴另一個資源的結果。你可以使用 `params` 上下文物件中提供的 `chain` 函式來表達這種依賴關係。

```typescript
import {resource} from '@angular/core';

const userResource = resource({
  params: () => ({id: getUserId()}),
  loader: ({params}) => fetchUser(params),
});

const companyResource = resource({
  params: ({chain}) => chain(userResource)?.companyId,
  loader: ({params: companyId}) => fetchCompany(companyId),
});
```

這裡的 `companyResource` 依賴使用者的 `companyId`，而這個值要等 `userResource` 載入後才知道。`chain(userResource)` 會讀取 `userResource` 的值，並自動把它的狀態傳播給 `companyResource`：

- 如果 `userResource` 為 **idle**，`companyResource` 也會變成 `idle`。
- 如果 `userResource` 為 **loading** 或 **reloading**，`companyResource` 會進入 `loading` 狀態，且其 loader 不會執行。請注意，在 `reloading` 期間，`chain` 不會傳回先前解析完成的值。
- 如果 `userResource` 處於 **error** 狀態，`companyResource` 也會進入 `error` 狀態。
- 如果 `userResource` 為 **resolved** 或 **local**，`chain` 會傳回它目前的值，`companyResource` 接著會把該值用作自己的 params。

當 `chain` 從 `userResource` 傳播狀態（`idle`、`loading`、`reloading` 或 `error`）時，params 函式不會繼續執行。當 `userResource` 為 `resolved` 或 `local` 時，`chain` 會傳回它的值，而該值本身也可能是 `undefined`。範例用 `chain(userResource)?.companyId` 處理這種情況，因此 `undefined` 值會導致 params 為 `undefined`，`companyResource` 也隨之變成 `idle`。

NOTE: 請把串連得到的值直接作為 params 值傳入，不要把它包在物件裡。像 `{companyId: undefined}` 這樣的 params 值仍然是已定義的值，因此 loader 會以 `undefined` 的 `companyId` 執行，而不是讓資源變成 `idle`。

### 串連與直接讀取資源值的比較

你可能會想在 `params` 裡直接讀取資源的值：

```typescript {avoid, header: '直接讀取 value()，不傳播狀態'}
const companyResource = resource({
  params: () => {
    const user = userResource.value(); // may be undefined
    return user ? {companyId: user.companyId} : undefined;
  },
  loader: ({params}) => fetchCompany(params.companyId),
});
```

雖然這樣做可行，但從 `params` 傳回 `undefined` 會讓資源變成 `idle`，而不是反映上游資源的實際狀態。使用 `chain` 是較好的做法，因為它能正確鏡像 `loading` 與 `error` 狀態。

只有當下游資源需要執行依賴上游值的非同步工作時，才使用 `chain`。如果你只需要從資源同步衍生出一個值，改用 `computed` 即可。

## 使用 `httpResource` 進行反應式資料擷取

[`httpResource`](/guide/http/http-resource) 是 `HttpClient` 的包裝器，它會把請求狀態與回應以訊號的形式提供給你。它透過 Angular 的 HTTP 堆疊（包括攔截器）發出 HTTP 請求。

## 使用快照組合資源

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

### 使用快照組合資源

IMPORTANT: `resourceFromSnapshots` 是[實驗性](reference/releases#experimental)功能。它已經可以試用，但在穩定之前仍可能改變。

你可以使用 `resourceFromSnapshots` 從快照建立新的資源。這讓你能與 `computed`、`linkedSignal` 等訊號 API 組合，來轉換資源的行為。

```ts
import {
  Component,
  input,
  linkedSignal,
  resourceFromSnapshots,
  Resource,
  ResourceSnapshot,
} from '@angular/core';
import {httpResource} from '@angular/common/http';

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

@Component({/*... */})
export class AwesomeProfile {
  userId = input.required<number>();
  user = withPreviousValue(httpResource(() => `/user/${this.userId()}`));
  // When userId changes, user.value() keeps the old user data until the new one loads
}
```
