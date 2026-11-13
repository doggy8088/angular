# 使用表單來取得使用者輸入

本指南延續入門教學[開始使用基本 Angular 應用程式](start "Get started with a basic Angular app")的[管理資料](start/start-data "Try it: Managing Data")步驟。

本節將帶你逐步加入一個以表單為基礎的結帳功能，以便在結帳過程中收集使用者資訊。

## 定義結帳表單模型

本步驟會說明如何在元件類別中設定結帳表單模型。
表單模型會決定表單的狀態。

1. 開啟 `cart.component.ts`。

1. 從 `@angular/forms` 套件匯入 `FormBuilder` 服務。
  此服務提供方便的方法來產生控制項。

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="imports">
  </code-example>

1. 在 `CartComponent` 的 `constructor()` 中注入 `FormBuilder` 服務。
  此服務是 `ReactiveFormsModule` 模組的一部分，你已經匯入了它。

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="inject-form-builder">
  </code-example>

1. 若要收集使用者的姓名與地址，請使用 `FormBuilder` 的 `group()` 方法，將 `checkoutForm` 屬性設定為包含 `name` 與 `address` 欄位的表單模型。

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form-group"></code-example>

1. 定義一個 `onSubmit()` 方法來處理表單。
  此方法可讓使用者提交姓名與地址。
  此外，此方法會使用 `CartService` 的 `clearCart()` 方法來重設表單並清空購物車。

  整個購物車元件類別如下所示：

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts">
  </code-example>

## 建立結帳表單

使用下列步驟，在 Cart 檢視底部加入結帳表單。

1. 在 `cart.component.html` 的底部，加入一個 HTML `<form>` 元素與一個 **Purchase** 按鈕。

1. 使用 `formGroup` 屬性繫結，將 `checkoutForm` 繫結到 HTML `<form>`。

  <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.3.html" region="checkout-form">
  </code-example>

1. 在 `form` 標籤上，使用 `ngSubmit` 事件繫結來監聽表單提交，並以 `checkoutForm` 的值呼叫 `onSubmit()` 方法。

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html (cart component template detail)" region="checkout-form-1">
  </code-example>

1. 為 `name` 與 `address` 加入 `<input>` 欄位，每個欄位都加上 `formControlName` 屬性，將 `checkoutForm` 中 `name` 與 `address` 的表單控制項繫結到各自的 `<input>` 欄位。
  完整的元件如下所示：

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html" region="checkout-form-2">
  </code-example>

將幾項商品放入購物車後，使用者可以檢視商品、輸入姓名與地址，並提交購買。

<div class="lightbox">
  <img src='generated/images/guide/start/cart-with-items-and-form.png' alt="含結帳表單的購物車檢視">
</div>

若要確認提交，請開啟主控台，查看包含你所提交姓名與地址的物件。

## 後續步驟

你現在擁有一個完整的線上商店應用程式，包含商品目錄、購物車與結帳功能。

[繼續前往「部署」一節](start/start-deployment "Try it: Deployment")，轉移到本機開發，或將應用程式部署到 Firebase 或你自己的伺服器。

@reviewed 2021-09-15
