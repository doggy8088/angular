# 使用 Resource API 以訊號管理非同步資料

既然你已學會[如何使用連結訊號衍生狀態](/tutorials/signals/3-deriving-state-with-linked-signals)，接著來探索如何以 Resource API 處理非同步資料。Resource API 提供一個強大的方式，用訊號管理非同步操作，內建載入狀態、錯誤處理與請求管理。

在本活動中，你將學會如何使用 `resource()` 函式非同步載入資料，並透過建置一個使用者個人資料載入器來實際示範 Resource API，學會如何處理非同步操作的不同狀態。

<hr />

<docs-workflow>

<docs-step title="匯入 resource 函式與 API">
將 `resource` 加到你既有的匯入中，並匯入模擬的 API 函式。

```ts
// Add resource to existing imports
import {Component, signal, computed, resource, ChangeDetectionStrategy} from '@angular/core';
// Import mock API function
import {getUserData} from './user-api';
```

</docs-step>

<docs-step title="建立使用者資料的 resource">
在元件類別中加入一個屬性，建立一個依使用者 ID 訊號載入使用者資料的 resource。

```ts
userId = signal(1);

userResource = resource({
  params: () => ({id: this.userId()}),
  loader: (params) => getUserData(params.params.id),
});
```

</docs-step>

<docs-step title="加入與 resource 互動的方法">
加入變更使用者 ID 並重新載入 resource 的方法。

```ts
loadUser(id: number) {
  this.userId.set(id);
}

reloadUser() {
  this.userResource.reload();
}
```

變更 params 訊號會自動觸發重新載入，你也可以使用 `reload()` 手動重新載入。
</docs-step>

<docs-step title="為 resource 狀態建立計算訊號">
加入計算訊號，存取 resource 的不同狀態。

```ts
isLoading = this.userResource.isLoading;
hasError = computed(() => this.userResource.status() === 'error');
```

resource 提供 `status()` 訊號，其值可以是 'loading'、'reloading'、'resolved' 或 'error'；`value()` 訊號用於存放已載入的資料；`hasValue()` 方法則可安全地檢查資料是否可用。`isLoading()` 訊號在 'loading' 與 'reloading' 時都為 true。
</docs-step>

<docs-step title="接上按鈕並顯示 resource 狀態">
範本結構已經提供好了。現在把一切接起來：

第 1 部分：**為按鈕加入點選處理常式**

```html
<button (click)="loadUser(1)">Load User 1</button>
<button (click)="loadUser(2)">Load User 2</button>
<button (click)="loadUser(999)">Load Invalid User</button>
<button (click)="reloadUser()">Reload</button>
```

第 2 部分：**將預留位置換成 resource 狀態處理**

```angular-html
@if (isLoading()) {
  <p>Loading user...</p>
} @else if (hasError()) {
  <p class="error">Error: {{ userResource.error()?.message }}</p>
} @else if (userResource.hasValue()) {
  <div class="user-info">
    <h3>{{ userResource.value().name }}</h3>
    <p>{{ userResource.value().email }}</p>
  </div>
}
```

resource 提供不同的方法來檢查其狀態：

- `isLoading()`：取得資料時為 true
- `hasError()`：發生錯誤時為 true
- `userResource.hasValue()`：有資料可用時為 true
- `userResource.value()`：存取已載入的資料
- `userResource.error()`：存取錯誤資訊

</docs-step>

</docs-workflow>

太棒了！你已學會如何將 Resource API 與訊號搭配使用。要記住的關鍵概念如下：

- **resource 具有反應性**：params 改變時自動重新載入
- **內建狀態管理**：resource 提供 `status()`、`value()` 與 `error()` 訊號
- **自動清理**：resource 會自動處理請求取消與清理
- **手動控制**：需要時，你可以手動重新載入或中止請求

在下一課中，你將學到[如何使用輸入訊號將資料傳給元件](/tutorials/signals/5-component-communication-with-signals)！
