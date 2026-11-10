# 使用連結訊號衍生狀態

既然你已學會[如何使用計算訊號衍生狀態](/tutorials/signals/2-deriving-state-with-computed-signals)，你先前建立了一個用於 `notificationsEnabled` 的計算訊號，它會自動跟隨你的使用者狀態。但如果使用者想在上線時也手動停用通知，該怎麼辦？這時就輪到連結訊號登場了。

連結訊號是可寫入的訊號，會與其來源訊號保持反應式連接。它們非常適合建立平常跟隨計算結果、但需要時可以覆寫的狀態。

在本活動中，你將把先前使用者狀態系統中計算出的 `notificationsEnabled` 強化為可寫入的連結訊號，藉此學會 `linkedSignal()` 與 `computed()` 的差異。

<hr />

<docs-workflow>

<docs-step title="匯入 linkedSignal 函式">
將 `linkedSignal` 加到你既有的匯入中。

```ts
// Add linkedSignal to existing imports
import {Component, signal, computed, linkedSignal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="以相同運算式將 computed 換成 linkedSignal">
以使用完全相同運算式的 linkedSignal，取代計算訊號 `notificationsEnabled`：

```ts
// Previously (from lesson 2):
// notificationsEnabled = computed(() => this.userStatus() === 'online');

// Now with linkedSignal - same expression, but writable:
notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');
```

運算式完全相同，但 linkedSignal 建立的是可寫入的訊號。它仍會在 `userStatus` 改變時自動更新，但你也可以手動設定它。
</docs-step>

<docs-step title="加入手動切換通知的方法">
加入一個方法，示範連結訊號可以直接寫入：

```ts
toggleNotifications() {
  // This works with linkedSignal but would error with computed!
  this.notificationsEnabled.set(!this.notificationsEnabled());
}
```

這就是關鍵差異：計算訊號是唯讀的，但連結訊號在保持反應式連接的同時，也可以手動更新。
</docs-step>

<docs-step title="更新範本，加入手動通知控制">
更新你的範本，加入通知的切換按鈕：

```angular-html
<div class="status-info">
  <div class="notifications">
    <strong>Notifications:</strong>
    @if (notificationsEnabled()) {
      Enabled
    } @else {
      Disabled
    }
    <button (click)="toggleNotifications()" class="override-btn">
      @if (notificationsEnabled()) {
        Disable
      } @else {
        Enable
      }
    </button>
  </div>
  <!-- existing message and working-hours divs remain -->
</div>
```

</docs-step>

<docs-step title="觀察反應式行為">
現在來測試這些行為：

1. 變更使用者狀態，注意 `notificationsEnabled` 如何自動更新
2. 手動切換通知，它會覆寫計算值
3. 再次變更狀態，連結訊號會重新與其計算同步

這示範了連結訊號即使在被手動設定後，仍能保持其反應式連接！
</docs-step>

</docs-workflow>

太棒了！你已學會計算訊號與連結訊號的關鍵差異：

- **計算訊號**：唯讀，永遠從其他訊號衍生
- **連結訊號**：可寫入，既能衍生，也能手動更新
- **何時使用 computed**：值應永遠由計算得出時
- **何時使用 linkedSignal**：你需要一個可以覆寫的預設計算時

在下一課中，你將學到[如何使用訊號管理非同步資料](/tutorials/signals/4-managing-async-data-with-signals)！
