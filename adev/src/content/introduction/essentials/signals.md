<docs-decorative-header title="訊號" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
建立並管理動態資料。
</docs-decorative-header>

在 Angular 中，你會用訊號來建立與管理狀態。訊號是對某個值的輕量包裝。

使用 `signal` 函式來建立一個保存本機狀態的訊號：

```typescript
import {signal} from '@angular/core';

// Create a signal with the `signal` function.
const firstName = signal('Morgan');

// Read a signal value by calling it— signals are functions.
console.log(firstName());

// Change the value of this signal by calling its `set` method with a new value.
firstName.set('Jaime');

// You can also use the `update` method to change the value
// based on the previous value.
firstName.update(name => name.toUpperCase());
```

Angular 會追蹤訊號在哪些地方被讀取，以及何時被更新。框架會利用這些資訊來執行額外的工作，例如以新狀態更新 DOM。這種隨著訊號值變化而作出反應的能力，就稱為反應式機制。

## 計算運算式

`computed` 是一種訊號，它的值是由其他訊號推導出來的。

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());

console.log(firstNameCapitalized()); // MORGAN
```

`computed` 訊號是唯讀的，它沒有 `set` 或 `update` 方法。取而代之的是，當它所讀取的任何訊號改變時，`computed` 訊號的值會自動隨之改變：

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

## 在元件中使用訊號

在你的元件裡使用 `signal` 與 `computed` 來建立並管理狀態：

```typescript
@Component({/* ... */})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  activateTrial() {
    this.isTrial.set(true);
  }
}
```

TIP: 想更深入了解 Angular 訊號嗎？請參閱[訊號深入指南](guide/signals)，取得完整說明。

## 下一步

現在你已經學會如何宣告與管理動態資料，接著來學習如何在範本中使用這些資料。

<docs-pill-row>
  <docs-pill title="以範本打造動態介面" href="essentials/templates" />
  <docs-pill title="訊號深入指南" href="guide/signals" />
</docs-pill-row>
