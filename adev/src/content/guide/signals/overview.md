<docs-decorative-header title="Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angular Signals 是一個系統，它詳細追蹤應用程式中您的狀態如何以及在哪裡使用，以便框架最佳化呈現更新。
</docs-decorative-header>

提示：在深入瞭解此綜合指南之前，先檢閱 Angular 的 [精華](essentials/managing-dynamic-data)。

## 訊號是什麼？

A **訊號**是環繞在值周圍的包裝器，當該值變更時，會通知有興趣的消費者。訊號可以包含任何值，從基本類型到複雜的資料結構。

你可以透過呼叫訊號的 getter 函式來讀取訊號的值，這讓 Angular 能追蹤訊號的使用位置。

信號可以是 _可寫_ 或 _唯讀_。

### 可寫入訊號

可寫入的信號提供了一種 API，用於直接更新其值。您可以透過使用信號的初始值呼叫 `signal` 函式來建立可寫入的信號：

```ts
const count = signal(0);

// Signals are getter functions - calling them reads their value.
console.log('The count is: ' + count());
```

若要變更可寫入訊號的值，可直接 `.set()` ：

```ts
count.set(3);
```

或使用 `.update()` 操作從前一個值計算新值：

```ts
// Increment the count by 1.
count.update(value => value + 1);
```

可寫入的訊號具有類型 `WritableSignal`。

### 計算訊號

**計算信號** 是唯讀信號，其值來自其他信號。您可以使用 `computed` 函式並指定推導來定義計算信號：

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

`doubleCount` 信號取決於 `count` 信號。每當 `count` 更新時，Angular 知道 `doubleCount` 也需要更新。

#### 計算信號是延遲評估和備忘的

`doubleCount` 的衍生函式並不會在您第一次讀取 `doubleCount` 時執行以計算其值。計算出的值隨後會被快取，如果您再次讀取 `doubleCount`，它將會傳回快取值而不會重新計算。

如果您之後變更 `count`，Angular 知道 `doubleCount` 的快取值不再有效，且下次您讀取 `doubleCount` 時，其新值會被計算出來。

因此，您可以在計算訊號中安全執行計算成本昂貴的推導，例如過濾陣列。

#### 計算的信號不是可寫信號

您無法直接將值指定給計算訊號。亦即，

```ts
doubleCount.set(3);
```

產生編譯錯誤，因為 `doubleCount` 不是 `WritableSignal`。

#### 計算的訊號相依性是動態的

僅追蹤在推導期間實際讀取的訊號。例如，在此計算中，僅當 `showCount` 訊號為真時才會讀取 `count` 訊號：

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

當你讀取 `conditionalCount` 時，如果 `showCount` 是 `false`，則會傳回「這裡沒有東西可看！」訊息，_不_ 會讀取 `count` 信號。這表示如果你稍後更新 `count`，_不會_ 導致 `conditionalCount` 重新計算。

如果你將 `showCount` 設為 `true`，然後再次讀取 `conditionalCount`，衍生函式就會重新執行並執行 `showCount` 為 `true` 的分支，傳回顯示 `count` 值的訊息。變更 `count` 然後會使 `conditionalCount` 的快取值失效。

請注意，在推導過程中，依賴項可以被移除，也可以被添加。如果您稍後將 `showCount` 設回 `false`，那麼 `count` 將不再被視為 `conditionalCount` 的依賴項。

## 在 `OnPush` 元件中讀取訊號

當您在 `OnPush` 元件範本中讀取訊號時，Angular 會將訊號追蹤為該元件的相依性。當該訊號的值變更時，Angular 會自動[標記](api/core/ChangeDetectorRef#markforcheck)元件，以確保在下一次變更偵測執行時，會將其更新。請參閱[略過元件子樹](best-practices/skipping-subtrees)指南，以取得有關 `OnPush` 元件的更多資訊。

## 效果##

訊號之所以有用，是因為當訊號變更時，會通知有興趣的消費者。**效果** 是當一個或多個訊號值變更時執行之操作。您可以使用 `effect` 函式建立效果：

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

效應總是至少執行一次。當效應執行時，它會追蹤任何訊號值讀取。每當這些訊號值有任何變更，效應就會再次執行。類似於計算訊號，效應會動態追蹤其相依性，並且只追蹤在最近一次執行中讀取的訊號。

效果總是**非同步**執行，在變更偵測過程中。

### 效果的使用案例

在多數應用程式程式碼中，很少需要副作用，但在特定情況下可能很有用。以下是使用 `effect` 可能是一個好解決方案的一些情況範例：

* 記錄正在顯示的資料以及其變更時間，以供分析或作為除錯工具。
* 將資料與 `window.localStorage` 同步。
* 加入無法以範本語法表示的客製化 DOM 行為。
* 對 `<canvas>`、圖表庫或其他第三方 UI 庫執行客製化渲染。

<docs-callout critical title="何時不使用效果">
避免使用效果來傳播狀態變更。這可能會導致 `ExpressionChangedAfterItHasBeenChecked` 錯誤、無限循環更新或不必要的變更偵測週期。

由於這些風險，Angular 預設會阻止您在效果中設定訊號。如果絕對有必要，可以在建立效果時設定 `allowSignalWrites` 旗標以啟用它。

相反，使用 `computed` 信號來模擬取決於其他狀態的狀態。
</docs-callout>

### 注入背景

預設情況下，你只能在 [注入內容](guide/di/dependency-injection-context)（你可以存取 `inject` 函式）中建立 `effect()`。滿足此需求最簡單的方法是在元件、指令或服務 `constructor` 中呼叫 `effect`：

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

或者，您可以將效果指定給欄位（這也會讓它擁有描述性名稱）。

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);

  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
}
```

如要在建構函式之外建立效果，您可以透過選項將 `Injector` 傳遞給 `effect`：

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

### 摧毀效果

當您建立一個效果時，它會在封裝的內容被銷毀時自動銷毀。這表示在元件中建立的效果會在元件銷毀時銷毀。指令、服務等中的效果也是如此。

效果會傳回一個 `EffectRef`，您可以使用它手動銷毀，方法是呼叫 `.destroy()` 方法。您可以將此與 `manualCleanup` 選項結合，以建立一個持續到手動銷毀的效果。務必在不再需要時實際清除這些效果。

## 進階主題

### 訊號相等函式

在建立一個訊號時，您可以選擇性地提供一個等號函式，它將用於檢查新值是否真的與前一個值不同。

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

等號函式可以同時提供給可寫入和計算訊號。

HELPFUL: 預設信號使用引用相等（`===` 比較）。

### 閱讀時不追蹤依賴關係

在罕見的情況下，您可能想執行一段可能會讀取響應式函式（例如 `computed` 或 `effect`）中的信號的程式碼，而 _不_ 建立依賴性。

例如，假設當 `currentUser` 變更時，`counter` 的值應該被記錄下來。您可以建立一個 `effect` 來讀取兩個訊號：

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

這個範例會在 `currentUser` 或 `counter` _任一_ 變更時紀錄訊息。然而，若效果應僅在 `currentUser` 變更時執行，則讀取 `counter` 僅為偶然，而 `counter` 的變更不應紀錄新訊息。

你可以透過使用 `untracked` 呼叫存取函式來防止訊號讀取被追蹤：

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});
```

當一個效果需要呼叫不應該被視為依賴項的外部程式碼時，`untracked` 也很有用：

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

### 效應清理函式

效果可能會啟動長時間運作，如果效果被終止或在第一個運作完成前再次執行，您應取消。當您建立效果時，您的函式可以選擇接受一個 `onCleanup` 函式作為其第一個參數。這個 `onCleanup` 函式讓您可以註冊一個回呼，在效果的下一次執行開始之前或效果被終止時呼叫。

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
