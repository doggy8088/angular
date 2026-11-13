# 使用表單來取得使用者輸入

在[管理資料](start/start-data "Try it: Managing Data")結束時，線上商店應用程式已有商品目錄與購物車。

本節將帶你逐步加入一個以表單為基礎的結帳功能，以便在結帳過程中收集使用者資訊。

## Angular 中的表單

Angular 中的表單以標準 HTML 表單為基礎，協助你建立自訂表單控制項與簡單的驗證體驗。Angular Reactive 表單包含兩個部分：位於元件中、負責存放與管理表單的物件，以及位於範本中、呈現表單的視覺化部分。

## 定義結帳表單模型

首先，設定結帳表單模型。表單模型定義在元件類別中，是表單狀態的唯一真實來源。

1. 開啟 `cart.component.ts`。

1. Angular 的 `FormBuilder` 服務提供方便的方法來產生控制項。如同你先前用過的其他服務，你需要先匯入並注入此服務，才能使用它：

    1. 從 `@angular/forms` 套件匯入 `FormBuilder` 服務。

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="imports">
      </code-example>

      `FormBuilder` 服務由 `ReactiveFormsModule` 提供，而 `AppModule`（位於 `app.module.ts` 中）已經匯入了它。

    1. 注入 `FormBuilder` 服務。

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="inject-form-builder">
      </code-example>

1. 仍在 `CartComponent` 類別中，定義 `checkoutForm` 屬性來存放表單模型。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form">
    </code-example>

1. 若要收集使用者的姓名與地址，請使用 `FormBuilder` 的 `group()` 方法，將 `checkoutForm` 屬性設定為包含 `name` 與 `address` 欄位的表單模型。把這段加入建構子的大括弧 `{}` 之間。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form-group"></code-example>

1. 在結帳流程中，使用者需要提交他們的姓名與地址。當他們提交訂單時，表單應重設，購物車也應清空。

    1. 在 `cart.component.ts` 中，定義一個 `onSubmit()` 方法來處理表單。使用 `CartService` 的 `clearCart()` 方法，在表單提交後清空購物車商品並重設表單。在真實世界的應用程式中，這個方法也會把資料提交到外部伺服器。整個購物車元件類別如下：

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts">
    </code-example>

現在你已在元件類別中定義了表單模型，接著需要一個結帳表單，在檢視中反映這個模型。

## 建立結帳表單

使用下列步驟，在「Cart」檢視底部加入結帳表單。

1. 開啟 `cart.component.html`。

1. 在範本底部，加入一個 HTML 表單來擷取使用者資訊。

1. 使用 `formGroup` 屬性繫結，將 `checkoutForm` 繫結到範本中的 `form` 標籤。另外加入一個「Purchase」按鈕來提交表單。

  <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.3.html" region="checkout-form">
  </code-example>

1. 在 `form` 標籤上，使用 `ngSubmit` 事件繫結來監聽表單提交，並以 `checkoutForm` 的值呼叫 `onSubmit()` 方法。

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html (cart component template detail)" region="checkout-form-1">
  </code-example>

1. 為 `name` 與 `address` 加入輸入欄位。使用 `formControlName` 屬性繫結，將 `checkoutForm` 中 `name` 與 `address` 的表單控制項繫結到各自的輸入欄位。最後的完整元件如下：

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html" region="checkout-form-2">
  </code-example>

將幾項商品放入購物車後，使用者現在可以檢視商品、輸入姓名與地址，並提交購買：

<div class="lightbox">
  <img src='generated/images/guide/start/cart-with-items-and-form.png' alt="含結帳表單的購物車檢視">
</div>

若要確認提交，請開啟主控台，你應該會看到一個包含你所提交姓名與地址的物件。

## 後續步驟

恭喜！你現在擁有一個完整的線上商店應用程式，包含商品目錄、購物車與結帳功能。

[繼續前往「部署」一節](start/start-deployment "Try it: Deployment")，轉移到本機開發，或將應用程式部署到 Firebase 或你自己的伺服器。
