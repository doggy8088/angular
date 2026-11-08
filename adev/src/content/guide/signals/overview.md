<docs-decorative-header title="Angular 訊號" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angular 訊號是一套能細緻追蹤狀態在應用程式中如何被使用、以及在哪裡被使用的系統，讓框架得以最佳化渲染更新。
</docs-decorative-header>

TIP: 在深入閱讀這份完整指南之前，先看看 Angular 的[入門要點](essentials/signals)。

## 什麼是訊號？

**訊號**是包住一個值的包裝器，當該值改變時，會通知有興趣的消費者。訊號可以包含任何值，從基本型別到複雜的資料結構皆可。

透過呼叫訊號的 getter 函式來讀取它的值，Angular 藉此追蹤訊號在哪裡被使用。

訊號可以是可寫入的，也可以是唯讀的。

### 可寫入訊號

可寫入訊號提供直接更新其值的 API。你可以呼叫 `signal` 函式並傳入訊號的初始值，來建立可寫入訊號：

```ts
const count = signal(0);

// Signals are getter functions - calling them reads their value.
console.log('The count is: ' + count());
```

若要改變可寫入訊號的值，可以直接用 `.set()` 設定：

```ts
count.set(3);
```

或使用 `.update()` 運算，從前一個值計算出新值：

```ts
// Increment the count by 1.
count.update((value) => value + 1);
```

可寫入訊號的型別是 `WritableSignal`。

#### 將可寫入訊號轉換為唯讀訊號

`WritableSignal` 提供 `asReadonly()` 方法，會傳回該訊號的唯讀版本。當你想把訊號的值公開給消費者、又不希望他們直接修改時，這個方法很有用：

```ts
@Service()
export class CounterState {
  // Private writable state
  private readonly _count = signal(0);

  readonly count = this._count.asReadonly(); // public readonly

  increment() {
    this._count.update((v) => v + 1);
  }
}

@Component({/* ... */})
export class AwesomeCounter {
  state = inject(CounterState);

  count = this.state.count; // can read but not modify

  increment() {
    this.state.increment();
  }
}
```

唯讀訊號會反映原始可寫入訊號的所有變更，但無法用 `set()` 或 `update()` 方法修改。

IMPORTANT: 唯讀訊號**並未**內建任何能防止其值被深層修改的機制。

### 計算訊號 {#computed-signals}

**計算訊號**是唯讀訊號，其值衍生自其他訊號。你可以用 `computed` 函式並指定一段衍生邏輯來定義計算訊號：

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

`doubleCount` 訊號依賴 `count` 訊號。每當 `count` 更新時，Angular 就知道 `doubleCount` 也需要更新。

#### 計算訊號同時具備延遲求值與記憶化

`doubleCount` 的衍生函式不會執行來計算其值，直到你第一次讀取 `doubleCount` 為止。計算出的值接著會被快取起來，之後再次讀取 `doubleCount` 時，會直接傳回快取的值，不再重新計算。

之後如果你改變 `count`，Angular 就知道 `doubleCount` 的快取值已失效，下次讀取 `doubleCount` 時會重新計算出新值。

因此，你可以安心地在計算訊號中執行計算成本高昂的衍生運算，例如篩選陣列。

#### 計算訊號不是可寫入訊號

你無法直接對計算訊號指派值。也就是說，

```ts
doubleCount.set(3);
```

會產生編譯錯誤，因為 `doubleCount` 不是 `WritableSignal`。

#### 計算訊號的依賴關係是動態的

只有在衍生過程中實際被讀取的訊號才會被追蹤。例如，在這個 `computed` 中，只有當 `showCount` 訊號為 true 時，才會讀取 `count` 訊號：

```ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```

當你讀取 `conditionalCount` 時，如果 `showCount` 為 `false`，會傳回 "Nothing to see here!" 訊息，且_不會_讀取 `count` 訊號。換句話說，之後就算你更新 `count`，也_不會_導致 `conditionalCount` 重新計算。

如果你將 `showCount` 設為 `true` 後再次讀取 `conditionalCount`，衍生邏輯會重新執行並走 `showCount` 為 `true` 的分支，傳回顯示 `count` 值的訊息。此時改變 `count` 就會使 `conditionalCount` 的快取值失效。

請注意，依賴關係在衍生過程中可以被移除，也可以被新增。如果你之後把 `showCount` 設回 `false`，`count` 就不再被視為 `conditionalCount` 的依賴。

## 反應式上下文 {#reactive-contexts}

**反應式上下文**是一種執行階段狀態，Angular 在其中監控訊號的讀取以建立依賴關係。讀取訊號的程式碼是_消費者_，被讀取的訊號則是_生產者_。

Angular 會在以下情況自動進入反應式上下文：

- 執行 `effect`、`afterRenderEffect` 回呼時。
- 求值 `computed` 訊號時。
- 求值 `linkedSignal` 時。
- 求值 `resource` 的 params 函式時。
- 渲染元件範本時（包括[宿主屬性](guide/components/host-elements#binding-to-the-host-element)中的繫結）。

在這些操作期間，Angular 會建立一個_即時_連接。如果被追蹤的訊號改變，Angular _最終_會重新執行消費者。

### 反應式上下文斷言

Angular 提供 `assertNotInReactiveContext` 輔助函式，用來斷言程式碼不是在反應式上下文中執行。請傳入呼叫端函式的參考，這樣當斷言失敗時，錯誤訊息就能指向正確的 API 入口點。相較於泛用的反應式上下文錯誤，這能產生更清楚、更可操作的錯誤訊息。

```ts
import {assertNotInReactiveContext} from '@angular/core';

function subscribeToEvents() {
  assertNotInReactiveContext(subscribeToEvents);
  // Safe to proceed - subscription logic here
}
```

### 讀取但不追蹤依賴

在少數情況下，你可能會想在 `computed` 或 `effect` 這類反應式函式中執行會讀取訊號的程式碼，但_不_建立依賴關係。

例如，假設當 `currentUser` 改變時，應該記錄 `counter` 的值。你可以建立一個同時讀取這兩個訊號的 `effect`：

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

這個範例會在 `currentUser` 或 `counter` _任一_改變時記錄訊息。然而，如果這個 effect 只應該在 `currentUser` 改變時執行，那麼讀取 `counter` 只是附帶的，`counter` 的改變不應該觸發新的記錄訊息。

你可以將訊號的讀取包在 `untracked` 中，來防止它被追蹤：

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});
```

當 effect 需要呼叫某些不應被視為依賴的外部程式碼時，`untracked` 也很有用：

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // If the `loggingService` reads signals, they won't be counted as
    // dependencies of this effect.
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### 反應式上下文與非同步操作

反應式上下文只在同步程式碼中有效。任何在非同步邊界之後發生的訊號讀取，都不會被追蹤為依賴。

```ts {avoid}
effect(async () => {
  const data = await fetchUserData();
  // Reactive context is lost here - theme() won't be tracked
  console.log(`User: ${data.name}, Theme: ${theme()}`);
});
```

若要確保所有訊號讀取都被追蹤，請在 `await` 之前先讀取訊號。這也包括將它們作為引數傳給被等待的函式，因為引數是以同步方式求值的：

```ts {prefer}
effect(async () => {
  const currentTheme = theme(); // Read before await
  const data = await fetchUserData();
  console.log(`User: ${data.name}, Theme: ${currentTheme}`);
});
```

```ts {prefer}
effect(async () => {
  // Also works: signal is read before await (as function argument)
  await renderContent(docContent());
});
```

## 進階衍生

`computed` 能處理簡單的唯讀衍生，但你有時會需要依賴其他訊號的可寫入狀態。
詳情請參閱[使用 linkedSignal 處理相依狀態](/guide/signals/linked-signal)指南。

所有訊號 API 都是同步的——`signal`、`computed`、`input` 等。然而，應用程式經常需要處理以非同步方式取得的資料。`Resource` 讓你可以將非同步資料納入應用程式以訊號為基礎的程式碼中，同時仍能以同步方式存取其資料。詳情請參閱[使用資源處理非同步反應式資料](/guide/signals/resource)指南。

## 對非反應式 API 執行副作用

當我們想要對狀態變化做出反應時，建議使用同步或非同步的衍生。然而，這無法涵蓋所有使用情境，你有時會遇到需要在非反應式 API 上對訊號變化做出反應的情況。針對這些特定情境，請使用 `effect` 或 `afterRenderEffect`。詳情請參閱[非反應式 API 的副作用](/guide/signals/effect)指南。

## 在 `OnPush` 元件中讀取訊號

當你在 `OnPush` 元件的範本中讀取訊號時，Angular 會把該訊號追蹤為該元件的依賴。當該訊號的值改變時，Angular 會自動[標記](api/core/ChangeDetectorRef#markForCheck)該元件，確保它在下次變更偵測執行時得到更新。關於 `OnPush` 元件的更多資訊，請參閱[略過元件子樹](best-practices/skipping-subtrees)指南。

## 進階主題

### 訊號相等比較函式

建立訊號時，你可以選擇性地提供一個相等比較函式，用來檢查新值是否真的與前一個值不同。

```ts
import {signal} from '@angular/core';
import isEqual from 'lodash/isEqual';

const data = signal(['test'], {equal: isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

可寫入訊號和計算訊號都可以提供相等比較函式。

HELPFUL: 預設情況下，訊號使用參考相等性（即 [`Object.is()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比較）。

### 檢查訊號型別

你可以使用 `isSignal` 檢查一個值是否為 `Signal`：

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isSignal(count); // true
isSignal(doubled); // true
isSignal(42); // false
```

若要特別檢查訊號是否可寫入，請使用 `isWritableSignal`：

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isWritableSignal(count); // true
isWritableSignal(doubled); // false
```

## 搭配 RxJS 使用訊號

關於訊號與 RxJS 之間的互通性詳情，請參閱 [RxJS 與 Angular 訊號的互通](ecosystem/rxjs-interop)。

## 訊號除錯

Angular DevTools 能以視覺化方式呈現元件或指令的訊號圖，顯示其訊號、計算訊號、副作用與其他反應式節點之間如何互相依賴。
請參閱[為訊號圖除錯](tools/devtools/signals)，了解如何開啟、閱讀並檢視這張圖。
