# 搭配服務使用訊號

既然你已學會[使用 model 訊號進行雙向繫結](/tutorials/signals/6-two-way-binding-with-model-signals)，接著來探索如何將訊號與 Angular 服務搭配使用。服務非常適合在多個元件之間共享反應式狀態，而訊號透過自動變更偵測與簡潔的反應式模式，讓這件事更強大。

在本活動中，你將學會如何建立一個使用訊號的購物車 store，讓購物車顯示元件能自動對狀態變化做出反應。

<hr />

<docs-workflow>

<docs-step title="加入 cart store 訊號">
在 `cart-store.ts` 中加入唯讀與計算訊號，讓購物車狀態具有反應性。

```ts
// Add the computed import
import {Injectable, signal, computed} from '@angular/core';

// Then add these signals to the class:

// Readonly signals
readonly cartItems = this.items.asReadonly();

// Computed signals
readonly totalQuantity = computed(() => {
  return this.items().reduce((sum, item) => sum + item.quantity, 0);
});

readonly totalPrice = computed(() => {
  return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

這些訊號讓元件能以反應式方式存取購物車資料與計算出的總計。`asReadonly()` 方法能避免外部程式碼直接修改購物車項目，而 `computed()` 則建立衍生狀態，在來源訊號改變時自動更新。
</docs-step>

<docs-step title="完成數量更新方法">
`cart-display.ts` 中的購物車顯示元件，已在其範本中使用 cart store 的訊號。完成數量更新方法，來修改購物車項目：

```ts
increaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem) {
    this.cartStore.updateQuantity(id, currentItem.quantity + 1);
  }
}

decreaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem && currentItem.quantity > 1) {
    this.cartStore.updateQuantity(id, currentItem.quantity - 1);
  }
}
```

這些方法使用 `cartItems()` 讀取目前的購物車狀態，並透過 store 的方法更新數量。訊號改變時，UI 會自動更新！
</docs-step>

<docs-step title="更新主應用程式元件">
更新 `app.ts` 中的主應用程式元件，使用購物車服務並顯示購物車元件。

```angular-ts
import {Component, inject} from '@angular/core';
import {CartStore} from './cart-store';
import {CartDisplay} from './cart-display';

@Component({
  selector: 'app-root',
  imports: [CartDisplay],
  template: `
    <div class="shopping-app">
      <header>
        <h1>Signals with Services Demo</h1>
        <div class="cart-badge">
          Cart: {{ cartStore.totalQuantity() }} items (\${{ cartStore.totalPrice() }})
        </div>
      </header>

      <main>
        <cart-display></cart-display>
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  cartStore = inject(CartStore);
}
```

</docs-step>

</docs-workflow>

太棒了！你已學會如何將訊號與服務搭配使用。要記住的關鍵概念如下：

- **服務層級的訊號**：服務可以使用訊號管理反應式狀態
- **依賴注入**：在元件中使用 `inject()` 存取帶有訊號的服務
- **服務中的計算訊號**：建立會自動更新的衍生狀態
- **唯讀訊號**：公開訊號的唯讀版本，避免外部修改

在下一課中，你將學到[如何搭配指令使用訊號](/tutorials/signals/8-using-signals-with-directives)！
