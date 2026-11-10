# 使用輸入訊號將資料傳遞給元件

既然你已學會[使用訊號管理非同步資料](/tutorials/signals/4-managing-async-data-with-signals)，接著來探索 Angular 以訊號為基礎的 `input()` API，它可將資料從父元件傳給子元件，讓元件的資料流更具反應性、更有效率。如果你熟悉其他框架的元件 props，inputs 就是同樣的概念。

在本活動中，你將為產品卡片元件加入訊號輸入，並看到父元件的資料如何以反應式方式向下流動。

<hr />

<docs-workflow>

<docs-step title="為 ProductCard 加入訊號輸入">
在 `product-card` 元件中加入訊號 `input()` 函式，來接收資料。

```ts
// Add imports for signal inputs
import {Component, input, ChangeDetectionStrategy} from '@angular/core';

// Add these signal inputs
name = input.required<string>();
price = input.required<number>();
available = input<boolean>(true);
```

注意，`input.required()` 建立的是必須提供的輸入，而帶有預設值的 `input()` 則是選用的。
</docs-step>

<docs-step title="將輸入連接到範本">
更新 `product-card` 的範本，顯示訊號輸入的值。

```angular-html
<div class="product-card">
  <h3>{{ name() }}</h3>
  <p class="price">\${{ price() }}</p>
  <p class="status">
    Status:
    @if (available()) {
      Available
    } @else {
      Out of Stock
    }
  </p>
</div>
```

輸入訊號在範本中的用法和一般訊號一樣：以函式方式呼叫它們，即可取得其值。
</docs-step>

<docs-step title="將父元件訊號連接到子元件輸入">
更新 `app.ts` 中 `product-card` 的用法，傳入動態的訊號值，而非靜態值。

```html
<!-- Change from static values: -->
<product-card name="Static Product" price="99" available="true" />

<!-- To dynamic signals: -->
<product-card [name]="productName()" [price]="productPrice()" [available]="productAvailable()" />
```

方括號 `[]` 會建立屬性繫結，將目前的訊號值傳給子元件。
</docs-step>

<docs-step title="測試反應式更新">
在 `app.ts` 中加入方法，更新父元件的訊號，看看子元件如何自動做出反應。

```ts
updateProduct() {
  this.productName.set('Updated Product');
  this.productPrice.set(149);
}

toggleAvailability() {
  this.productAvailable.set(!this.productAvailable());
}
```

```html
<!-- Add controls to test reactivity -->
<div class="controls">
  <button (click)="updateProduct()">Update Product Info</button>
  <button (click)="toggleAvailability()">Toggle Availability</button>
</div>
```

當父元件的訊號改變時，子元件會自動接收並顯示新值！
</docs-step>

</docs-workflow>

太棒了！你已學會訊號輸入的運作方式：

- **訊號輸入**：使用 `input()` 與 `input.required()` 從父元件接收資料
- **反應式更新**：父元件的訊號值改變時，子元件自動更新
- **型別安全**：訊號輸入提供完整的 TypeScript 型別檢查
- **預設值**：選用輸入可以有預設值，必填輸入則必須提供

訊號輸入讓元件通訊更具反應性，在許多情況下，也免去了 `OnChanges` 生命週期掛鉤的需要。

在下一課中，你將學到[使用 model 訊號進行雙向繫結](/tutorials/signals/6-two-way-binding-with-model-signals)！
