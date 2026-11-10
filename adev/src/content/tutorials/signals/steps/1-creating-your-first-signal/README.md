# 建立並更新你的第一個訊號

歡迎來到 Angular 訊號教學！[訊號](/essentials/signals)是 Angular 的反應式原語，提供管理狀態的方式，並在狀態改變時自動更新你的 UI。

在本活動中，你將學到如何：

- 使用 `signal()` 函式建立你的第一個訊號
- 在範本中顯示它的值
- 使用 `set()` 與 `update()` 方法更新訊號值

來用訊號建置一個互動式使用者狀態系統吧！

<hr />

<docs-workflow>

<docs-step title="匯入 signal 函式">
在元件檔案的頂端，從 `@angular/core` 匯入 `signal` 函式。

```ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="在元件中建立訊號">
在元件類別中加入一個 `userStatus` 訊號，初始值為 `'offline'`。

```ts
@Component({
  /* Config omitted */
})
export class App {
  userStatus = signal<'online' | 'offline'>('offline');
}
```

</docs-step>

<docs-step title="在範本中顯示訊號值">
更新狀態指示器，讓它顯示目前的使用者狀態，做法是：
1. 使用 `[class]="userStatus()"` 將訊號繫結到 class 屬性
2. 將 `???` 換成 `{{ userStatus() }}`，顯示狀態文字

```angular-html
<!-- Update from: -->
<div class="status-indicator offline">
  <span class="status-dot"></span>
  Status: ???
</div>

<!-- To: -->
<div class="status-indicator" [class]="userStatus()">
  <span class="status-dot"></span>
  Status: {{ userStatus() }}
</div>
```

注意，我們呼叫訊號 `userStatus()` 時要加上括號，才能讀取它的值。
</docs-step>

<docs-step title="加入更新訊號的方法">
在元件中加入方法，使用 `set()` 方法變更使用者狀態。

```ts
goOnline() {
  this.userStatus.set('online');
}

goOffline() {
  this.userStatus.set('offline');
}
```

`set()` 方法會以新值完全取代訊號目前的值。

</docs-step>

<docs-step title="接上控制按鈕">
按鈕已經在範本中了。現在將它們連接到你的方法，加入：
1. 使用 `(click)` 的點選處理常式
2. 已處於該狀態時，使用 `[disabled]` 的停用狀態

```html
<!-- Add bindings to the existing buttons: -->
<button (click)="goOnline()" [disabled]="userStatus() === 'online'">Go Online</button>
<button (click)="goOffline()" [disabled]="userStatus() === 'offline'">Go Offline</button>
```

</docs-step>

<docs-step title="加入使用 update() 的切換方法">
加入一個 `toggleStatus()` 方法，使用 `update()` 方法在上線與離線之間切換。

```ts
toggleStatus() {
  this.userStatus.update(current => current === 'online' ? 'offline' : 'online');
}
```

`update()` 方法接收一個函式，該函式會收到目前的值，並回傳新值。當你需要依據目前狀態來修改既有值時，這個方法很好用。

</docs-step>

<docs-step title="加入切換按鈕的處理常式">
切換按鈕已經在範本中了。將它連接到你的 `toggleStatus()` 方法：

```html
<button (click)="toggleStatus()" class="toggle-btn">Toggle Status</button>
```

</docs-step>

</docs-workflow>

恭喜！你已建立你的第一個訊號，並學會如何使用 `set()` 與 `update()` 兩種方法更新它。`signal()` 函式會建立一個 Angular 會追蹤的反應式值，當你更新它時，你的 UI 會自動反映出變化。

接下來，你將學到[如何使用計算訊號從訊號衍生狀態](/tutorials/signals/2-deriving-state-with-computed-signals)！

<docs-callout helpful title="關於 ChangeDetectionStrategy.OnPush">

在本教學中，你可能會注意到元件裝飾器裡的 `ChangeDetectionStrategy.OnPush`。這是針對使用訊號的 Angular 元件所做的效能最佳化。目前你可以先放心忽略它——只要知道它能讓你的應用程式在使用訊號時執行得更快就好！想了解更多，請參閱[變更偵測策略 API 文件](/api/core/ChangeDetectionStrategy)。

</docs-callout>
