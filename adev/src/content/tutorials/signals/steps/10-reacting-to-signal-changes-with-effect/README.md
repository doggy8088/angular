# 使用 effect 回應訊號變化

既然你已學會[使用訊號查詢子元素](/tutorials/signals/9-query-child-elements-with-signal-queries)，接著來探索如何使用 effect 回應訊號變化。effect 是會在其相依性改變時自動執行的函式，因此非常適合用於記錄、DOM 操作或 API 呼叫等副作用。

**重要：effect 應該是你最後才考慮使用的 API**。對於衍生值，永遠優先使用 `computed()`；對於既能衍生、也能手動設定的值，則優先使用 `linkedSignal()`。如果你發現自己用 effect 把資料從一個訊號複製到另一個訊號，這表示你應該把真實來源往上移，改用 `computed()` 或 `linkedSignal()`。effect 最適合用來將訊號狀態同步到命令式、非訊號的 API。

在本活動中，你將學會如何恰當地使用 `effect()` 函式，處理會回應訊號變化的合理副作用。

<hr />

你有一個主題管理應用程式，訊號已經設定好了。現在你將加入 effect，自動回應訊號變化。

<docs-workflow>

<docs-step title="匯入 effect 函式">
將 `effect` 加到你既有的匯入中。

```ts
// Add effect to existing imports
import {Component, signal, computed, effect, ChangeDetectionStrategy} from '@angular/core';
```

`effect` 函式會建立一個反應式副作用，它會在所讀取的任何訊號改變時自動執行。
</docs-step>

<docs-step title="建立用於 localStorage 的 effect">
加入一個 effect，在主題改變時，自動將主題儲存到本機儲存空間。

```ts
constructor() {
  // Save theme to localStorage whenever it changes
  effect(() => {
    localStorage.setItem('theme', this.theme());
    console.log('Theme saved to localStorage:', this.theme());
  });
}
```

每當主題訊號改變時，這個 effect 就會執行，自動保存使用者的偏好設定。
</docs-step>

<docs-step title="建立記錄使用者活動的 effect">
加入一個 effect，在使用者登入或登出時進行記錄。

```ts
constructor() {
  // ... previous effect

  // Log user activity changes
  effect(() => {
    const status = this.isLoggedIn() ? 'logged in' : 'logged out';
    const user = this.username();
    console.log(`User ${user} is ${status}`);
  });
}
```

這個 effect 示範了 effect 如何讀取多個訊號，並對其中任何一個的變化做出反應。
</docs-step>

<docs-step title="建立帶有清理機制的 effect">
加入一個 effect，設定一個計時器，並在元件銷毀時進行清理。

```ts
constructor() {
  // ... previous effects

  // Timer effect with cleanup
  effect((onCleanup) => {
    const interval = setInterval(() => {
      console.log('Timer tick - Current theme:', this.theme());
    }, 5000);

    // Clean up the interval when the effect is destroyed
    onCleanup(() => {
      clearInterval(interval);
      console.log('Timer cleaned up');
    });
  });
}
```

這個 effect 在執行期間沒有讀取任何訊號，因為 `this.theme()` 是稍後才在 `setInterval` 回呼內呼叫的。它只會執行一次，永遠不會重新執行，所以清理只會在元件銷毀時發生，例如預覽重新載入時。
</docs-step>

<docs-step title="測試這些 effect">
開啟瀏覽器主控台，並與應用程式互動：

- **Toggle Theme**：查看主題如何存入 localStorage
- **Login/Logout**：查看使用者活動記錄
- **Watch Timer**：查看每 5 秒一次的定期主題記錄

effect 會在元件建立時執行一次，所以有些記錄會在你點選任何東西之前就出現。之後，只要它們所讀取的訊號改變，它們就會再次執行。
</docs-step>

</docs-workflow>

太棒了！你已學會如何將 effect 與訊號搭配使用。要記住的關鍵概念如下：

- **effect 具有反應性**：會在所讀取的任何訊號改變時自動執行
- **只用於副作用**：非常適合記錄、DOM 操作、API 呼叫，以及同步到命令式 API
- **清理**：使用 `onCleanup` 回呼，清理計時器或訂閱等資源
- **自動追蹤**：effect 會自動追蹤它讀取了哪些訊號，並在這些訊號改變時重新執行

**切記：謹慎使用 effect**！本課的範例（localStorage 同步、記錄、計時器）都是恰當的用法。請避免在下列情況使用 effect：

- 從其他訊號衍生值：改用 `computed()`，不要用 effect
- 建立可寫入的衍生狀態：改用 `linkedSignal()`，不要用 effect
- 在訊號之間複製資料：重新組織結構，改用共享的真實來源

effect 功能強大，但當 `computed()` 與 `linkedSignal()` 無法解決你的使用情境時，它應該是你的最後手段。
