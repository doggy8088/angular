<docs-decorative-header title="Angular 訊號" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angular 訊號是一套能細緻追蹤狀態在應用程式中如何被使用、以及在哪裡被使用的系統，讓框架得以最佳化渲染更新。
</docs-decorative-header>

Tip: 在深入閱讀這份完整指南之前，先看看 Angular 的[入門要點](essentials/managing-dynamic-data)。

## 什麼是訊號？ {#what-are-signals}

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
count.update(value => value + 1);
```

可寫入訊號的型別是 `WritableSignal`。

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

## 在 `OnPush` 元件中讀取訊號

當你在 `OnPush` 元件的範本中讀取訊號時，Angular 會把該訊號追蹤為該元件的依賴。當該訊號的值改變時，Angular 會自動[標記](api/core/ChangeDetectorRef#markforcheck)該元件，確保它在下次變更偵測執行時得到更新。關於 `OnPush` 元件的更多資訊，請參閱[略過元件子樹](best-practices/skipping-subtrees)指南。

## 副作用（effect） {#effects}

訊號之所以好用，是因為它們會在變更時通知有興趣的消費者。**effect** 是每當一個或多個訊號值改變時就會執行的一種操作。你可以使用 `effect` 函式來建立 effect：

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

effect 總是**至少會執行一次**。當 effect 執行時，它會追蹤所有被讀取的訊號值。只要其中任何訊號值改變，effect 就會再次執行。與計算訊號類似，effect 會動態追蹤其依賴，且只追蹤最近一次執行中被讀取的訊號。

effect 總是以**非同步**方式，在變更偵測過程中執行。

### effect 的使用情境

在大多數應用程式程式碼中，effect 很少派得上用場，但在特定情境下可能很有用。以下是一些適合使用 `effect` 的情境範例：

* 記錄所顯示的資料及其變更時機，不論是為了分析還是作為除錯工具。
* 讓資料與 `window.localStorage` 保持同步。
* 加入無法以範本語法表達的自訂 DOM 行為。
* 對 `<canvas>`、圖表函式庫或其他第三方 UI 函式庫執行自訂渲染。

<docs-callout critical title="何時不該使用 effect">
避免使用 effect 來傳播狀態變更。這可能導致 `ExpressionChangedAfterItHasBeenChecked` 錯誤、無限循環更新，或不必要的變更偵測週期。

由於這些風險，Angular 預設會阻止你在 effect 中設定訊號。若確實有必要，可以在建立 effect 時設定 `allowSignalWrites` 旗標來啟用它。

請改用 `computed` 訊號來建模依賴其他狀態的狀態。
</docs-callout>

### 注入上下文

預設情況下，你只能在[注入上下文](guide/di/dependency-injection-context)中（也就是能存取 `inject` 函式的地方）建立 `effect()`。滿足這個要求最簡單的方法，是在元件、指令或服務的 `constructor` 中呼叫 `effect`：

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

或者，你可以將 effect 指派給一個欄位（這樣也能為它取一個描述性的名稱）。

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);

  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
}
```

若要在建構函式之外建立 effect，你可以透過其選項將 `Injector` 傳給 `effect`：

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor(private injector: Injector) {}

  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    }, {injector: this.injector});
  }
}
```

### 銷毀 effect {#destroying-effects}

當你建立 effect 時，它會在其所在的上下文被銷毀時自動被銷毀。也就是說，在元件中建立的 effect 會在元件被銷毀時被銷毀。指令、服務等之中的 effect 也是如此。

effect 會傳回一個 `EffectRef`，你可以呼叫它的 `.destroy()` 方法來手動銷毀它。你可以搭配 `manualCleanup` 選項，建立一個持續直到手動銷毀為止的 effect。這類 effect 在不再需要時，請務必確實將它清理掉。

## 進階主題

### 訊號相等比較函式 {#signal-equality-functions}

建立訊號時，你可以選擇性地提供一個相等比較函式，用來檢查新值是否真的與前一個值不同。

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

可寫入訊號和計算訊號都可以提供相等比較函式。

HELPFUL: 預設情況下，訊號使用參考相等性（即 [`Object.is()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比較）。

### 讀取但不追蹤依賴 {#reading-without-tracking-dependencies}

在少數情況下，你可能會想在 `computed` 或 `effect` 這類反應式函式中執行會讀取訊號的程式碼，但_不_建立依賴關係。

例如，假設當 `currentUser` 改變時，應該記錄 `counter` 的值。你可以建立一個同時讀取這兩個訊號的 `effect`：

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

這個範例會在 `currentUser` 或 `counter` _任一_改變時記錄訊息。然而，如果這個 effect 只應該在 `currentUser` 改變時執行，那麼讀取 `counter` 只是附帶的，`counter` 的改變不應該觸發新的記錄訊息。

你可以藉由以 `untracked` 呼叫訊號的 getter，來防止該訊號讀取被追蹤：

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

### effect 清理函式 {#effect-cleanup-functions}

effect 可能會啟動長時間執行的操作；如果 effect 在第一個操作完成之前就被銷毀或再次執行，你就應該取消這些操作。當你建立 effect 時，你的函式可以選擇性地將 `onCleanup` 函式作為第一個參數。這個 `onCleanup` 函式可讓你註冊一個回呼，在 effect 下一次執行開始之前，或在 effect 被銷毀時，就會呼叫該回呼。

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```
