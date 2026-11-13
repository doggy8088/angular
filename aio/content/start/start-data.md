# 管理資料

本指南延續[使用基本的 Angular 應用程式開始入門](start)教學的第二步，[加入導覽](start/start-routing "加入導覽")。
在這個開發階段，商店應用程式有一個產品目錄，包含兩個檢視：產品清單與產品詳細資料。
使用者可以點選清單中的產品名稱，在新的檢視中查看詳細資料，該檢視有專屬的 URL，也就是路由。

本教學的這個步驟會引導你分以下幾個階段建立購物車：

*   更新產品詳細資料檢視，加入標示為 **Buy** 的按鈕，按下後會把目前的產品加入購物車服務管理的產品清單
*   加入購物車元件，顯示購物車中的商品
*   加入運送元件，使用 Angular 的 `HttpClient` 從 `.json` 檔案擷取運送資料，取得購物車商品的運費價格

<a id="create-cart-service"></a>

## 建立購物車服務

在 Angular 中，服務是某個類別的執行個體，你可以使用 Angular 的[依賴注入系統](guide/glossary#依賴注入dependency-injectiondi "依賴注入定義")，讓應用程式的任何部分都能使用它。

目前，使用者可以檢視產品資訊，應用程式也可以模擬分享功能，以及產品變更的通知。

接下來的步驟是建立讓使用者把產品加入購物車的方法。
本節會引導你加入標示為 **Buy** 的按鈕，並設定購物車服務來儲存購物車中產品的資訊。

<a id="generate-cart-service"></a>

### 定義購物車服務

本節會引導你建立 `CartService`，用來追蹤加入購物車的產品。

1.  在終端機執行以下指令，產生一個新的 `cart` 服務：

    <code-example format="shell" language="shell">

    ng generate service cart

    </code-example>

1.  把 `./products.ts` 中的 `Product` 介面匯入 `cart.service.ts` 檔案，並在 `CartService` 類別中定義 `items` 屬性，用來儲存購物車中目前產品的陣列。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="props"></code-example>

1.  定義方法，把商品加入購物車、傳回購物車商品，以及清空購物車商品。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="methods"></code-example>

    *   `addToCart()` 方法會把產品附加到 `items` 陣列
    *   `getItems()` 方法會收集使用者加入購物車的商品，並傳回每個商品及其相關數量
    *   `clearCart()` 方法會傳回空的商品陣列，也就是清空購物車

<a id="product-details-use-cart-service"></a>

### 使用購物車服務

本節會引導你使用 `CartService` 把產品加入購物車。

1.  在 `product-details.component.ts` 中，匯入購物車服務。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service"></code-example>

1.  把購物車服務加入 `constructor()`，完成注入。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="inject-cart-service"></code-example>

1.  定義 `addToCart()` 方法，把目前的產品加入購物車。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

    `addToCart()` 方法會執行以下動作：

    *   把目前的 `product` 當作引數
    *   使用 `CartService` 的 `addToCart()` 方法把產品加入購物車
    *   顯示訊息，告知你已把產品加入購物車

1.  在 `product-details.component.html` 中，加入標籤為 **Buy** 的按鈕，並把 `click()` 事件繫結到 `addToCart()` 方法。
    這段程式碼會更新產品詳細資料範本，加入一個標示為 **Buy** 的按鈕，按下後會把目前的產品加入購物車。

    <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html"></code-example>

1.  重新整理應用程式並點選產品名稱以顯示詳細資料，確認新的 **Buy** 按鈕如預期出現。

    <div class="lightbox">

    <img alt="顯示所選產品的詳細資料，並有一個 Buy 按鈕" src="generated/images/guide/start/product-details-buy.png">

    </div>

1.  點選 **Buy** 按鈕，把產品加入購物車已儲存的商品清單，並顯示確認訊息。

    <div class="lightbox">

    <img alt="顯示所選產品的詳細資料，並有一個 Buy 按鈕" src="generated/images/guide/start/buy-alert.png">

    </div>

## 建立購物車檢視

要讓顧客看到購物車，你可以分兩個步驟建立購物車檢視：

1.  建立購物車元件，並為新元件設定路由。
1.  顯示購物車商品。

### 設定購物車元件

要建立購物車檢視，請依照建立 `ProductDetailsComponent` 並為新元件設定路由時相同的步驟進行。

1.  在終端機執行以下指令，產生一個名為 `cart` 的新元件：

    <code-example format="shell" language="shell">

    ng generate component cart

    </code-example>

    這個指令會產生 `cart.component.ts` 檔案，以及相關的範本與樣式檔案。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

    StackBlitz 也會在元件中預設產生 `ngOnInit()`。
    在本教學中，你可以忽略 `CartComponent` 的 `ngOnInit()`。

1.  請注意，新建立的 `CartComponent` 已加入 `app.module.ts` 中模組的 `declarations`。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="declare-cart"></code-example>

1.  仍在 `app.module.ts` 中，為 `CartComponent` 元件加入路由，`path` 為 `cart`。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route"></code-example>

1.  更新 **Checkout** 按鈕，讓它導向 `/cart` 這個 URL。
    在 `top-bar.component.html` 中，加入指向 `/cart` 的 `routerLink` 指令。

    <code-example header="src/app/top-bar/top-bar.component.html" path="getting-started/src/app/top-bar/top-bar.component.html" region="cart-route"></code-example>

1.  點選 **Checkout** 按鈕，確認新的 `CartComponent` 如預期運作。
    你會看到預設文字「cart works!」，而 URL 的格式為 `https://getting-started.stackblitz.io/cart`，其中 `getting-started.stackblitz.io` 在你的 StackBlitz 專案中可能不同。

    <div class="lightbox">
    
    <img alt="自訂前的購物車檢視" src="generated/images/guide/start/cart-works.png">
    
    </div>

### 顯示購物車商品

本節說明如何使用購物車服務顯示購物車中的產品。

1.  在 `cart.component.ts` 中，從 `cart.service.ts` 檔案匯入 `CartService`。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports"></code-example>

1.  把 `CartService` 加入 `constructor()` 完成注入，讓 `CartComponent` 能夠使用它。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="inject-cart"></code-example>

1.  定義 `items` 屬性，用來儲存購物車中的產品。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="items"></code-example>

    這段程式碼使用 `CartService` 的 `getItems()` 方法設定商品。
    這個方法是你在[建立 `cart.service.ts`](#generate-cart-service)時定義的。

1.  更新購物車範本，加入標題，並使用帶有 `*ngFor` 的 `<div>`，顯示每個購物車商品的名稱與價格。
    產生的 `CartComponent` 範本如下。

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices"></code-example>

1.  確認你的購物車如預期運作：

    1.  點選 **My Store**。
    1.  點選產品名稱以顯示詳細資料。
    1.  點選 **Buy**，把產品加入購物車。
    1.  點選 **Checkout**，查看購物車。

    <div class="lightbox">

    <img alt="已加入產品的購物車檢視" src="generated/images/guide/start/cart-page-full.png">

    </div>

如需進一步了解服務，請參閱[服務與依賴注入簡介](guide/architecture-services "概念 > 服務與依賴注入簡介")。

## 擷取運費價格

伺服器經常以串流的形式傳回資料。
串流很有用，因為它們讓轉換傳回的資料變得容易，也方便調整請求資料的方式。
Angular 的 `HttpClient` 是從外部 API 取得資料，並以串流形式提供給應用程式的內建方式。

本節說明如何使用 `HttpClient` 從外部檔案擷取運費價格。

StackBlitz 為本指南產生的應用程式，在 `assets/shipping.json` 中附有預先定義的運送資料。
使用這份資料，為購物車中的商品加入運費價格。

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json"></code-example>

### 設定 `AppModule` 以使用 `HttpClient`

要使用 Angular 的 `HttpClient`，你必須設定應用程式使用 `HttpClientModule`。

Angular 的 `HttpClientModule` 會註冊應用程式在各處使用 `HttpClient` 服務所需的提供者。

1.  在 `app.module.ts` 的檔案頂端，與其他匯入陳述式放在一起，從 `@angular/common/http` 套件匯入 `HttpClientModule`。
    由於還有許多其他匯入項目，為求簡潔，這段程式碼片段省略了它們。
    請務必保留現有的匯入項目。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import"></code-example>

1.  要在全域註冊 Angular 的 `HttpClient` 提供者，請把 `HttpClientModule` 加入 `AppModule` 的 `@NgModule()` `imports` 陣列。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module"></code-example>

### 設定 `CartService` 以使用 `HttpClient`

接下來的步驟是把 `HttpClient` 服務注入你的服務，讓應用程式可以取得資料，並與外部 API 及資源互動。

1.  在 `cart.service.ts` 中，從 `@angular/common/http` 套件匯入 `HttpClient`。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http"></code-example>

1.  把 `HttpClient` 注入 `CartService` 的 `constructor()`。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="inject-http"></code-example>

### 設定 `CartService` 以取得運費價格

要從 `shipping.json` 取得運送資料，可以使用 `HttpClient` 的 `get()` 方法。

1.  在 `cart.service.ts` 中，於 `clearCart()` 方法下方定義新的 `getShippingPrices()` 方法，使用 `HttpClient` 的 `get()` 方法。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>

如需進一步了解 Angular 的 `HttpClient`，請參閱[用戶端與伺服器互動](guide/http "透過 HTTP 與伺服器互動")指南。

## 建立運送元件

既然你已設定好應用程式來擷取運送資料，現在可以建立一個呈現這些資料的地方。

1.  在終端機執行以下指令，產生一個名為 `shipping` 的購物車元件：

    <code-example format="shell" language="shell">

    ng generate component shipping

    </code-example>

    這個指令會產生 `shipping.component.ts` 檔案，以及相關的範本與樣式檔案。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1.  在 `app.module.ts` 中，為運送功能加入路由。
    `path` 指定為 `shipping`，元件指定為 `ShippingComponent`。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    目前還沒有連到新運送元件的連結，不過你可以在網址列輸入該路由指定的 URL，在預覽窗格中看到它的範本。
    URL 的格式為：`https://angular-ynqttp--4200.local.webcontainer.io/shipping`，其中 `angular-ynqttp--4200.local.webcontainer.io` 這個部分在你的 StackBlitz 專案中可能不同。

### 設定 `ShippingComponent` 以使用 `CartService`

本節會引導你修改 `ShippingComponent`，透過 HTTP 從 `shipping.json` 檔案擷取運送資料。

1.  在 `shipping.component.ts` 中，匯入 `CartService`。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

1.  在 `ShippingComponent` 的 `constructor()` 中注入購物車服務。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

1. 定義 `shippingCosts` 屬性，使用 `CartService` 的 `getShippingPrices()` 方法設定 `shippingCosts` 屬性。
   在 `ngOnInit()` 方法內初始化 `shippingCosts` 屬性。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="props"></code-example>

1.  更新 `ShippingComponent` 範本，使用 `async` 管道顯示運送方式與價格。

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

    `async` 管道會傳回資料串流的最新值，並在指定元件的整個生命週期中持續這麼做。
    當 Angular 銷毀該元件時，`async` 管道會自動停止。
    如需 `async` 管道的詳細資訊，請參閱 [AsyncPipe API 文件](api/common/AsyncPipe)。

1.  在 `CartComponent` 檢視中加入連到 `ShippingComponent` 檢視的連結。

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1.  點選 **Checkout** 按鈕，查看更新後的購物車。
    請記住，變更應用程式會使預覽重新整理，購物車也會隨之清空。

    <div class="lightbox">

    <img alt="附有運費價格連結的購物車" src="generated/images/guide/start/cart-empty-with-shipping-prices.png">

    </div>

    點選連結，導覽至運費價格。

    <div class="lightbox">

    <img alt="顯示運費價格" src="generated/images/guide/start/shipping-prices.png">

    </div>

## 接下來

你現在擁有一個商店應用程式，包含產品目錄、購物車，還可以查詢運費價格。

要繼續探索 Angular：

*   繼續前往[使用者輸入的表單](start/start-forms "使用者輸入的表單")，加入購物車檢視與結帳表單，完成應用程式
*   直接跳到[部署](start/start-deployment "部署")，轉為本機開發，或把應用程式部署到 Firebase 或自己的伺服器

@reviewed 2022-02-28
