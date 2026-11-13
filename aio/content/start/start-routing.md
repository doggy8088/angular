# 加入導覽

本指南延續入門教學的第一步，[開始使用基本 Angular 應用程式](start "Get started with a basic Angular app")。

在這個開發階段，線上商店應用程式已有一個基本的產品目錄。

在接下來的各節中，你將為應用程式加入以下功能：

* 在網址列輸入 URL，導覽至對應的產品頁面。
* 點選頁面上的連結，在單頁應用程式內導覽。
* 點選瀏覽器的上一頁與下一頁按鈕，直覺地瀏覽瀏覽器記錄。

{@a define-routes}

## 將 URL 路徑與元件建立關聯

應用程式已使用 Angular `Router` 導覽至 `ProductListComponent`。
本節說明如何定義路由，以顯示個別產品的詳細資料。

1. 為產品詳細資料產生一個新的元件。
    在檔案清單中，在 `app` 資料夾上按右鍵，選擇 `Angular Generator` 與 `Component`。
    將元件命名為 `product-details`。

1. 在 `app.module.ts` 中，為產品詳細資料加入路由，`path` 為 `products/:productId`，`component` 為 `ProductDetailsComponent`，並將 `ProductDetailsComponent` 包含在 `AppModule` 的 declarations 中。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="product-details-route">
    </code-example>

1. 開啟 `product-list.component.html`。

1. 修改產品名稱錨點，加入帶有 `product.id` 參數的 `routerLink`。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.html" region="router-link">
    </code-example>

    `RouterLink` 指令可協助你自訂錨點元素。
    在這個例子中，路由或 URL 包含一個固定區段 `/products`。
    最後一段是變數，會插入目前產品的 `id` 屬性。
    舉例來說，`id` 為 1 的產品，其 URL 會類似 `https://getting-started-myfork.stackblitz.io/products/1`。

 1. 點選產品名稱，確認路由如預期運作。
    應用程式應顯示 `ProductDetailsComponent`，目前會顯示「product-details works!」。

    請注意預覽視窗中的 URL 會改變。
    最後一段是 `products/#`，其中 `#` 是你點選的路由編號。

    <div class="lightbox">
      <img src="generated/images/guide/start/product-details-works.png" alt="產品詳細資料檢視，URL 已更新">
    </div>

## 檢視產品詳細資料

`ProductDetailsComponent` 負責顯示各產品的內容。
Angular 路由器會根據瀏覽器的 URL 與[你定義的路由](#define-routes)顯示元件。

在本節中，你將使用 Angular 路由器，結合 `products` 資料與路由資訊，顯示各產品的具體詳細資料。

1. 在 `product-details.component.ts` 中，從 `@angular/router` 匯入 `ActivatedRoute`，以及從 `../products` 匯入 `products` 陣列。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="imports">
    </code-example>

1. 定義 `product` 屬性。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="product-prop">
    </code-example>

1. 在 `constructor()` 中注入 `ActivatedRoute`，做法是在建構函式的括號內加入 `private route: ActivatedRoute` 作為引數。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="props-methods">
    </code-example>

    `ActivatedRoute` 是 Angular 路由器載入的每個元件各自專屬的。
    `ActivatedRoute` 包含路由及其參數的資訊。

    注入 `ActivatedRoute`，就是在設定元件使用某個服務。
    [管理資料](start/start-data "Try it: Managing Data")這個步驟會更詳細地介紹服務。

1. 在 `ngOnInit()` 方法中，從路由參數取出 `productId`，再從 `products` 陣列找出對應的產品。

    <code-example path="getting-started/src/app/product-details/product-details.component.1.ts" header="src/app/product-details/product-details.component.ts" region="get-product">
    </code-example>

    路由參數對應你在路由中定義的路徑變數。
    要存取路由參數，我們使用 `route.snapshot`，也就是 `ActivatedRouteSnapshot`，其中包含該特定時刻作用中路由的資訊。
    符合該路由的 URL 會提供 `productId`。
    Angular 會使用 `productId` 顯示每個不重複產品的詳細資料。

1. 更新 `ProductDetailsComponent` 範本，使用 `*ngIf` 顯示產品詳細資料。
    如果產品存在，`<div>` 就會算繪出名稱、價格與描述。

    <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html" region="details">
    </code-example>

    這一行 `<h4>{{ product.price | currency }}</h4>` 使用 `currency` 管道，把 `product.price` 從數字轉換為貨幣字串。
    管道是一種在 HTML 範本中轉換資料的方式。
    如需進一步了解 Angular 管道，請參閱[管道](guide/pipes "Pipes")。

當使用者點選產品清單中的名稱時，路由器會將他們導覽至該產品專屬的 URL，顯示 `ProductDetailsComponent`，並呈現產品詳細資料。

<div class="lightbox">
  <img src="generated/images/guide/start/product-details-routed.png" alt="產品詳細資料頁面，URL 已更新並顯示完整詳細資料">
</div>

如需進一步了解 Angular 路由器，請參閱[路由與導覽](guide/router "Routing & Navigation guide")。

## 接下來

你已設定好應用程式，可以檢視產品詳細資料，每個產品都有專屬的 URL。

要繼續探索 Angular：

* 繼續前往[管理資料](start/start-data "Try it: Managing Data")，加入購物車功能、管理購物車資料，並擷取外部運費價格資料。
* 直接跳到[部署](start/start-deployment "Try it: Deployment")，把應用程式部署到 Firebase，或轉為本機開發。

@reviewed 2021-09-15
