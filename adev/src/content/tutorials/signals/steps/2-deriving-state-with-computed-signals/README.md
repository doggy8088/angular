# 使用計算訊號衍生狀態

既然你已學會[如何建立和更新訊號](/tutorials/signals/1-creating-your-first-signal)，接著來認識計算訊號。計算訊號是衍生值，會在其相依性改變時自動更新。它們非常適合依據其他訊號建立反應式計算。

在本活動中，你將學到如何使用 `computed()` 函式建立衍生狀態，它會在底層訊號改變時自動更新。

來強化我們的使用者狀態系統，加入從使用者狀態訊號衍生資訊的計算值。起始程式碼現在包含三種狀態選項：`'online'`、`'away'` 與 `'offline'`。

<hr />

<docs-workflow>

<docs-step title="匯入 computed 函式">
將 `computed` 加到你既有的匯入中。

```ts
// Add computed to existing imports
import {Component, signal, computed, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="建立用於通知的計算訊號">
加入一個計算訊號，依使用者狀態判斷是否應啟用通知。

```ts
notificationsEnabled = computed(() => this.userStatus() === 'online');
```

這個計算訊號會在 `userStatus` 訊號改變時自動重新計算。注意，我們在計算函式內呼叫 `this.userStatus()` 來讀取訊號的值。
</docs-step>

<docs-step title="建立用於描述訊息的計算訊號">
加入一個計算訊號，依使用者狀態建立一段描述訊息。

```ts
statusMessage = computed(() => {
  const status = this.userStatus();
  switch (status) {
    case 'online':
      return 'Available for meetings and messages';
    case 'away':
      return 'Temporarily away, will respond soon';
    case 'offline':
      return 'Not available, check back later';
    default:
      return 'Status unknown';
  }
});
```

這展示了計算訊號如何以 switch 陳述式與字串轉換，處理更複雜的邏輯。
</docs-step>

<docs-step title="建立計算工作時間可用性的計算訊號">
加入一個計算訊號，計算使用者目前是否在工作時間內。

```ts
isWithinWorkingHours = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const isWeekday = now.getDay() > 0 && now.getDay() < 6;
  return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
});
```

這示範了計算訊號如何進行計算，並結合多個資料來源。當 `userStatus` 改變時，值會自動更新。
</docs-step>

<docs-step title="在範本中顯示計算值">
範本中已有顯示 "Loading..." 的預留位置。將它們換成你的計算訊號：

1. 通知部分，將 `Loading...` 換成 `@if` 區塊：

   ```angular-html
   @if (notificationsEnabled()) {
     Enabled
   } @else {
     Disabled
   }
   ```

1. 訊息部分，將 `Loading...` 換成：

   ```angular-html
   {{ statusMessage() }}
   ```

1. 工作時間部分，將 `Loading...` 換成 `@if` 區塊：

   ```angular-html
   @if (isWithinWorkingHours()) {
     Yes
   } @else {
     No
   }
   ```

注意，計算訊號的呼叫方式和一般訊號一樣，都要加上括號！
</docs-step>

</docs-workflow>

太棒了！你已學會如何建立計算訊號。

以下是要記住的幾個重點：

- **計算訊號具有反應性**：在其相依性改變時自動更新
- **唯讀**：你無法直接設定計算值，它們是從其他訊號衍生而來
- **可包含複雜邏輯**：可用於計算、轉換與衍生狀態
- **提供基於動態狀態的高效能計算方式**：Angular 只在其相依性真正改變時，才會重新計算它們

在下一課中，你將學到[以另一種方式使用 linkedSignal 衍生狀態](/tutorials/signals/3-deriving-state-with-linked-signals)！
