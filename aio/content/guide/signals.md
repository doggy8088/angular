# Angular 訊號

**Angular 訊號**是一個系統，能以細緻的粒度追蹤你的狀態在整個應用程式中如何被使用、在哪裡被使用，讓框架得以最佳化渲染更新。

<div class="alert is-important">

Angular 訊號目前處於[開發者預覽](/guide/releases#開發者預覽)階段。你可以先試用，但它們在正式穩定之前可能還會有所改變。

</div>

## 什麼是訊號？

**訊號**是包住一個值的包裝器，當該值改變時，會通知有興趣的消費者。訊號可以包含任何值，從基本型別到複雜的資料結構皆可。

訊號的值一定是透過 getter 函式讀取的，這讓 Angular 得以追蹤訊號是在哪裡被使用的。

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

在使用包含物件的訊號時，有時候直接變更該物件會比較方便。例如，如果物件是陣列，你可能想推入新值，而不整個取代陣列。若要進行這類內部變更，請使用 `.mutate` 方法：

```ts
const todos = signal([{title: 'Learn signals', done: false}]);

todos.mutate(value => {
  // Change the first TODO in the array to 'done: true' without replacing it.
  value[0].done = true;
});
```

可寫入訊號的型別是 `WritableSignal`。

### 計算訊號

**計算訊號**會從其他訊號衍生出自己的值。使用 `computed` 並指定一個衍生函式來定義它：

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

`doubleCount` 訊號依賴於 `count`。每當 `count` 更新，Angular 就知道任何依賴 `count` 或 `doubleCount` 的東西也需要更新。

#### 計算訊號同時具備延遲求值與記憶化

在第一次讀取 `doubleCount` 之前，`doubleCount` 的衍生函式不會執行以計算其值。計算完成後，該值會被快取，之後讀取 `doubleCount` 時會直接傳回快取值，不再重新計算。

當 `count` 改變時，它會通知 `doubleCount` 其快取值已不再有效，該值只會在下一次讀取 `doubleCount` 時才重新計算。

因此，你可以安心地在計算訊號中執行計算成本高昂的衍生運算，例如篩選陣列。

#### 計算訊號不是可寫入訊號

你無法直接對計算訊號指派值。也就是說，

```ts
doubleCount.set(3);
```

會產生編譯錯誤，因為 `doubleCount` 不是 `WritableSignal`。

#### 計算訊號的依賴關係是動態的

只有在衍生過程中實際被讀取的訊號才會被追蹤。例如，在這個計算訊號中，`count` 訊號只有在特定條件下才會被讀取：

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

讀取 `conditionalCount` 時，如果 `showCount` 是 `false`，就會傳回「Nothing to see here!」訊息，而且_不會_讀取 `count` 訊號。這表示 `count` 的更新不會導致重新計算。

如果 `showCount` 之後被設為 `true`，且再次讀取 `conditionalCount`，衍生函式會重新執行，並走 `showCount` 為 `true` 的分支，傳回顯示 `count` 值的訊息。之後 `count` 的變更就會使 `conditionalCount` 的快取值失效。

請注意，依賴關係既可以新增，也可以移除。如果 `showCount` 之後又被設為 `false`，`count` 就不再被視為 `conditionalCount` 的依賴。

## 在 `OnPush` 元件中讀取訊號

當 `OnPush` 元件在範本中使用訊號的值時，Angular 會將該訊號追蹤為該元件的依賴。當該訊號更新時，Angular 會自動[標記](/api/core/ChangeDetectorRef#markforcheck)該元件，確保它在下次變更偵測執行時得到更新。請參閱[跳過元件子樹](/guide/change-detection-skipping-subtrees)指南，深入了解 `OnPush` 元件。

## 副作用（effect）

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

* 記錄正在顯示的資料及其變更時間，無論是為了分析或作為除錯工具
* 讓資料與 `window.localStorage` 保持同步
* 加入無法用範本語法表達的自訂 DOM 行為
* 對 `<canvas>`、圖表程式庫或其他第三方 UI 程式庫執行自訂渲染

#### 何時不該使用 effect

避免使用 effect 來傳播狀態變更。這可能導致 `ExpressionChangedAfterItHasBeenChecked` 錯誤、無限循環更新，或不必要的變更偵測循環。

由於這些風險，在 effect 中設定訊號預設是被禁止的，但若絕對必要，仍可啟用。

### 注入上下文

預設情況下，使用 `effect()` 函式註冊新的 effect 需要一個[注入上下文](/guide/dependency-injection-context)（也就是能存取 `inject` 函式）。提供注入上下文最簡單的方式，是在元件、指令或服務的 `constructor` 中呼叫 `effect`：

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()})`);
    });
  }
}
```

或者，也可以把 effect 指派給一個欄位（同時也給了它一個描述性的名稱）。

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  
  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()})`);
  });
}
```

若要在建構函式之外建立 effect，你可以透過其選項將 `Injector` 傳給 `effect`：

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  constructor(private injector: Injector) {}

  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()})`);
    }, {injector: this.injector});
  }
}
```

### 銷毀 effect

當你建立 effect 時，它會在其所在的上下文被銷毀時自動被銷毀。也就是說，在元件中建立的 effect 會在元件被銷毀時被銷毀。指令、服務等之中的 effect 也是如此。

effect 會傳回一個 `EffectRef`，可以用來透過 `.destroy()` 操作手動銷毀它。也可以搭配 `manualCleanup` 選項，建立一個持續存在直到手動銷毀的 effect。當不再需要這類 effect 時，務必確實將其清理乾淨。

## 進階主題

### 訊號相等比較函式

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

對於可寫入訊號，`.mutate()` 不會檢查相等性，因為它是在不產生新參照的情況下變更目前的值。

### 讀取但不追蹤依賴

在少數情況下，你可能會想在 `computed` 或 `effect` 這類反應式函式中執行會讀取訊號的程式碼，但_不_建立依賴關係。

例如，假設當 `currentUser` 改變時，應該記錄 `counter` 的值。你可以建立一個同時讀取這兩個訊號的 `effect`：

```ts
effect(() => {
  console.log(`User set to `${currentUser()}` and the counter is ${counter()}`);
});
```

這個範例會在 `currentUser` 或 `counter` _任一_改變時記錄訊息。然而，如果這個 effect 只應該在 `currentUser` 改變時執行，那麼讀取 `counter` 只是附帶的，`counter` 的改變不應該觸發新的記錄訊息。

你可以藉由以 `untracked` 呼叫訊號的 getter，來防止該訊號讀取被追蹤：

```ts
effect(() => {
  console.log(`User set to `${currentUser()}` and the counter is ${untracked(counter)}`);
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

### effect 清理函式

effect 可能會啟動長時間執行的操作，如果 effect 被銷毀，或在第一次操作完成前又再次執行，這些操作就應該被取消。建立 effect 時，你的函式可以選擇性地接受一個 `onCleanup` 函式作為第一個參數。這個 `onCleanup` 函式讓你註冊一個回呼，在 effect 下一次執行開始前，或 effect 被銷毀時呼叫。

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

@reviewed 2023-06-21
