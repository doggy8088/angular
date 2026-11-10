## 副作用（effect）

訊號之所以好用，是因為它們會在改變時通知有興趣的消費者。**副作用**（effect）是一種運算，只要有一個或多個訊號值改變就會執行。你可以用 `effect` 函式建立 effect：

```ts
import {effect} from '@angular/core';

effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

effect 總是**至少會執行一次**。當 effect 執行時，它會追蹤所有被讀取的訊號值。只要其中任何訊號值改變，effect 就會再次執行。與計算訊號類似，effect 會動態追蹤其依賴，且只追蹤最近一次執行中被讀取的訊號。

effect 總是以**非同步**方式，在變更偵測過程中執行。

### effect 的使用情境

effect 應該是你最後才考慮使用的 API。衍生值請優先使用 `computed()`，可衍生又可手動設定的值請優先使用 `linkedSignal()`。如果你發現自己在用 effect 把資料從一個訊號複製到另一個訊號，這表示你應該把真實來源往上移，改用 `computed()` 或 `linkedSignal()`。effect 最適合用來把訊號狀態同步到命令式、非訊號的 API。

TIP: effect 沒有「好用」的情境，只有「合適」的情境。

- 記錄訊號值，不論是為了分析還是作為除錯工具。
- 讓資料與各種儲存方式保持同步：`window.localStorage`、session storage、cookies 等。
- 加入無法以範本語法表達的自訂 DOM 行為。
- 對 `<canvas>` 元素、圖表函式庫或其他第三方 UI 函式庫執行自訂渲染。

<docs-callout critical title="何時不該使用 effect">
避免使用 effect 來傳播狀態變更。這可能導致 `ExpressionChangedAfterItHasBeenChecked` 錯誤、無限循環更新，或不必要的變更偵測週期。

請改用 `computed` 訊號來建模依賴其他狀態的狀態。
</docs-callout>

### 注入上下文

預設情況下，你只能在[注入上下文](guide/di/dependency-injection-context)中（也就是能存取 `inject` 函式的地方）建立 `effect()`。滿足這個要求最簡單的方法，是在元件、指令或服務的 `constructor` 中呼叫 `effect`：

```ts
@Component({
  /*...*/
})
export class EffectiveCounter {
  readonly count = signal(0);

  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

若要在 constructor 之外建立 effect，可以透過選項把 `Injector` 傳給 `effect`：

```ts
@Component({
  /*...*/
})
export class EffectiveCounter {
  readonly count = signal(0);
  private injector = inject(Injector);

  initializeLogging(): void {
    effect(
      () => {
        console.log(`The count is: ${this.count()}`);
      },
      {injector: this.injector},
    );
  }
}
```

### effect 的執行

Angular 會依 effect 建立所在的上下文，為其定義兩種隱含行為。

"View Effect" 是在元件實例化上下文中建立的 `effect`，包括由與元件注入器綁定的服務所建立的 effect。<br>
"Root Effect" 則是在根層級提供的服務實例化上下文中建立的 effect。

這兩種 `effect` 的執行都與變更偵測流程綁定。

- "View effects" 會在變更偵測流程檢查其對應元件_之前_執行。
- "Root effects" 會在變更偵測流程檢查所有元件之前執行。

在這兩種情況下，如果 effect 執行期間至少有一個依賴發生改變，effect 會在變更偵測流程繼續往下走之前重新執行。

### 銷毀 effect {#destroying-effects}

當元件或指令被銷毀時，Angular 會自動清理所有相關的 effect。

`effect` 可以在兩種不同的上下文中建立，這會影響它被銷毀的時機：

- "View effect" 會在元件被銷毀時銷毀。
- "Root effect" 會在應用程式被銷毀時銷毀。

effect 會傳回一個 `EffectRef`。你可以使用該 ref 的 `destroy` 方法手動處置 effect。建立 effect 時，你也可以搭配 `manualCleanup` 選項來停用自動清理。請務必在這類 effect 不再需要時確實將它銷毀。

### effect 清理函式 {#effect-cleanup-functions}

當元件或指令被銷毀時，Angular 會自動清理所有相關的 effect。
effect 可能會啟動長時間執行的操作，如果 effect 被銷毀、或在第一個操作完成前又再次執行，你應該取消這些操作。建立 effect 時，你的函式可以選擇性地接受一個 `onCleanup` 函式作為第一個參數。這個 `onCleanup` 函式讓你註冊一個回呼，該回呼會在 effect 下一次執行開始前、或 effect 被銷毀時被呼叫。

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

## 對 DOM 元素執行副作用

`effect` 函式是一個通用工具，用來在訊號改變時執行程式碼。然而，它會在 Angular 更新 DOM _之前_執行。在某些情況下，你可能需要手動檢視或修改 DOM，或整合需要直接存取 DOM 的第三方函式庫。

針對這些情況，你可以使用 `afterRenderEffect`。它的運作方式與 `effect` 類似，但會在 Angular 完成渲染並將變更提交到 DOM 之後才執行。

```ts
@Component({
  /*...*/
})
export class MyFancyChart {
  chartData = input.required<ChartData>();
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  chart: ChartInstance;

  constructor() {
    // Run a single time to create the chart instance
    afterNextRender({
      write: () => {
        this.chart = initializeChart(this.canvas().nativeElement(), this.chartData());
      },
    });

    // Re-run after DOM has been updated whenever `chartData` changes
    afterRenderEffect(() => {
      this.chart.updateData(this.chartData());
    });
  }
}
```

在這個範例中，`afterRenderEffect` 用來更新由第三方函式庫建立的圖表。

TIP: 你通常不需要用 `afterRenderEffect` 來檢查 DOM 變更。只要情況允許，`ResizeObserver`、`MutationObserver` 和 `IntersectionObserver` 這類 API 都比 `effect` 或 `afterRenderEffect` 更適合。

### 渲染階段

存取並修改 DOM 可能影響應用程式的效能，例如觸發過多不必要的[重排](https://developer.mozilla.org/en-US/docs/Glossary/Reflow)。

為了最佳化這些操作，`afterRenderEffect` 提供四個階段，讓回呼分組並以最佳化的順序執行。

這四個階段是：

| Phase            | 說明                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `earlyRead`      | 在此階段從 DOM 讀取資料，時機在後續的寫入回呼之前，例如用來執行瀏覽器原生不支援的自訂版面配置。如果讀取可以延後，請優先使用 `read` 階段。 |
| `write`          | 在此階段寫入 DOM。**絕對不要**在此階段從 DOM 讀取資料。                                                                                                                     |
| `mixedReadWrite` | 在此階段同時讀取與寫入 DOM。如果能把工作拆分到其他階段，就絕對不要使用此階段。                                         |
| `read`           | 在此階段從 DOM 讀取資料。**絕對不要**在此階段寫入 DOM。                                                                                                                     |

使用這些階段有助於防止版面抖動，並確保你的 DOM 操作以安全且有效率的方式執行。

你可以把帶有 `phase` 屬性的物件傳給 `afterRender` 或 `afterNextRender`，來指定階段：

```ts
afterRenderEffect({
  earlyRead: (cleanupFn) => {
    /* ... */
  },
  write: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  mixedReadWrite: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  read: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
});
```

CRITICAL: 如果你不指定階段，`afterRenderEffect` 會在 `mixedReadWrite` 階段執行回呼。這可能造成額外的 DOM 重排，進而拖累應用程式效能。

#### 階段的執行

`earlyRead` 階段的回呼不會收到任何參數。之後每個階段都會以 Signal 的形式收到前一個階段回呼的傳回值。你可以利用這一點來協調各階段之間的工作。

effect 會依下列階段順序執行：

1. `earlyRead`
2. `write`
3. `mixedReadWrite`
4. `read`

如果其中一個階段修改了 `afterRenderEffect` 追蹤的訊號值，受影響的階段會再次執行。

#### 清理

每個階段都會提供一個清理回呼函式作為引數。這些清理回呼會在 `afterRenderEffect` 被銷毀時，或在階段副作用重新執行之前執行。

### 伺服器端渲染的注意事項

`afterRenderEffect` 與 `afterNextRender`/`afterEveryRender` 一樣，只在用戶端執行。

NOTE: 元件不保證在回呼執行前已完成[水合](/guide/hydration)。直接讀取或寫入 DOM 與版面配置時，務必謹慎。
