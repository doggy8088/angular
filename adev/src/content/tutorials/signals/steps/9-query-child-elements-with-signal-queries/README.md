# 使用訊號查詢子元素

既然你已學會[如何搭配指令使用訊號](/tutorials/signals/8-using-signals-with-directives)，接著來探索以訊號為基礎的查詢 API。它們提供一種反應式的方式，來存取子元件與指令並與之互動。元件與指令既能進行查詢，也能被查詢。與傳統的 ViewChild 不同，訊號查詢會自動更新，並提供具型別安全的子元件與指令存取方式。

在本活動中，你將加入 viewChild 查詢，以程式化的方式與子元件互動。

<hr />

<docs-workflow>

<docs-step title="加入 viewChild 匯入">
首先，在 `app.ts` 中加入 `viewChild` 匯入，以存取子元件。

```ts
import {Component, signal, computed, viewChild, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="建立 viewChild 查詢">
在 App 元件中加入 viewChild 查詢，以存取子元件。

```ts
// Query APIs to access child components
firstProduct = viewChild(ProductCard);
cartSummary = viewChild(CartSummary);
```

這些查詢會建立訊號，引用子元件的實例。
</docs-step>

<docs-step title="實作父元件方法">
在 `app.ts` 中，使用 viewChild 查詢來呼叫子元件的方法：

```ts
showFirstProductDetails() {
  const product = this.firstProduct();
  if (product) {
    product.highlight();
  }
}

initiateCheckout() {
  const summary = this.cartSummary();
  if (summary) {
    summary.initiateCheckout();
  }
}
```

</docs-step>

<docs-step title="測試互動">
控制按鈕現在應該可以運作了：

- **"Show First Product Details"**：呼叫 ProductCard 的 `highlight()`
- **"Initiate Checkout"**：呼叫 CartSummary 的 `initiateCheckout()`

點選按鈕，看看 viewChild 查詢如何讓父元件控制子元件的行為。
</docs-step>

</docs-workflow>

太完美了！你已學會如何使用以訊號為基礎的查詢 API，進行子元件互動：

在下一課中，你將學到[如何使用 effect 回應訊號變化](/tutorials/signals/10-reacting-to-signal-changes-with-effect)！
