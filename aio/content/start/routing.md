# 路由

在[你的第一個應用程式](start "Getting Started: Your First App")結束時，線上商店應用程式已有一個基本的產品目錄。
這個應用程式沒有任何可變狀態或導覽。
只有一個 URL，而該 URL 永遠顯示「My Store」頁面，其中包含產品清單及其描述。

在本節中，你將擴充應用程式，在各自擁有專屬 URL 的獨立頁面中顯示完整的產品詳細資料。

要做到這一點，你將使用 Angular *路由器*。
Angular [路由器](guide/glossary#router "router definition")讓你能根據使用者在應用程式中的位置，向使用者顯示不同的元件與資料。
路由器讓使用者在執行應用程式工作時，能從一個檢視導覽到下一個檢視：

* 在網址列輸入 URL，瀏覽器便導覽至對應的頁面。
* 點選頁面上的連結，瀏覽器便導覽到新的頁面。
* 點選瀏覽器的上一頁與下一頁按鈕，瀏覽器便在你看過的頁面記錄中往前或往後導覽。


## 註冊路由

這個應用程式已設定為使用 Angular 路由器，並使用路由導覽至你先前修改過的產品清單元件。現在來定義一條路由，以顯示個別產品的詳細資料。

1. 為產品詳細資料產生一個新的元件。將元件命名為 `product-details`。

    提醒：在檔案清單中，在 `app` 資料夾上按右鍵，選擇 `Angular Generator` 與 `Component`。

1. 在 `app.module.ts` 中，為產品詳細資料加入一條路由，`path` 為 `products/:productId`，`component` 為 `ProductDetailsComponent`。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="product-details-route">
    </code-example>

    路由會將一個或多個 URL 路徑與元件建立關聯。

1. 使用 `RouterLink` 指令定義連結。`routerLink` 以宣告式的方式，在元件範本中定義使用者如何導覽至該路由（或 URL）。

    我們希望使用者點選產品名稱，以顯示該產品的詳細資料。

    1. 開啟 `product-list.component.html`。

    1. 更新 `*ngFor` 指令，在走訪清單時，將 `products` 陣列中的每個索引指派給 `productId` 變數。

    1. 修改產品名稱錨點，加入 `routerLink`。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.html" region="router-link">
    </code-example>

    <!--
    To do: I see a comment line with ellipses between the closing of h3 and div. It's an interesting way to show that we've clipped out some code. Should we use this elsewhere?
    -->

      `RouterLink` 指令讓路由器能掌控錨點元素。在這個例子中，路由（URL）包含一個固定區段（`/products`），而最後一段是變數，會插入目前產品的 id 屬性。舉例來說，`id` 為 1 的產品，其 URL 會類似 `https://getting-started-myfork.stackblitz.io/products/1`。

1. 點選產品名稱來測試路由器。應用程式會顯示產品詳細資料元件，目前永遠顯示「product-details works!」（我們會在下一節修正這一點。）

    請注意預覽視窗中的 URL 會改變。最後一段是 `products/1`。

    <figure class="lightbox">
      <div class="card">
        <img src="generated/images/guide/start/product-details-works.png" alt="產品詳細資料頁面，URL 已更新">
      </div>
    </figure>



## 使用路由資訊

產品詳細資料元件負責處理各產品的顯示。Angular 路由器會根據瀏覽器的 URL 與你定義的路由顯示元件。你將使用 Angular 路由器，結合 `products` 資料與路由資訊，顯示各產品的具體詳細資料。

1. 開啟 `product-details.component.ts`

1. 安排使用來自外部檔案的產品資料。

    1. 從 `@angular/router` 套件匯入 `ActivatedRoute`，並從 `../products` 匯入 `products` 陣列。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="imports">
        </code-example>

    1. 定義 `product` 屬性，並將 `ActivatedRoute` 注入建構子。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="props-methods">
        </code-example>

        `ActivatedRoute` 是 Angular 路由器載入的每個被路由元件各自專屬的。它包含路由、其參數，以及與該路由相關的其他資料的資訊。

        <!--
        To do: This is the first time we inject anything into a component. Should we mention it here? There's also a comment about maybe explaining it a bit in the services section (in data.md).
        -->

1. 在 `ngOnInit()` 方法中，*訂閱*路由參數，並根據 `productId` 擷取產品。

    <code-example path="getting-started/src/app/product-details/product-details.component.1.ts" region="get-product">
    </code-example>

    Angular 會在建立元件後不久呼叫 `ngOnInit()`。

    路由參數對應在路由中定義的路徑變數。`productId` 來自與該路由相符的 URL。你會使用 `productId` 來顯示每個不重複產品的詳細資料。

    <div class="alert is-helpful">

    如需更多關於 `ngOnInit()` 的資訊，請參閱[生命週期鉤子](guide/lifecycle-hooks)。

    </div>

1. 更新範本，在 `*ngIf` 內顯示產品詳細資料。

    <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html" region="details">
    </code-example>

現在，當使用者點選產品清單中的名稱時，路由器會將你導覽至該產品專屬的 URL，將產品清單元件換成產品詳細資料元件，並顯示產品詳細資料。

  <figure class="lightbox">
    <div class="card">
      <img src="generated/images/guide/start/product-details-routed.png" alt="產品詳細資料頁面，URL 已更新並顯示完整詳細資料">
    </div>
  </figure>



<div class="alert is-helpful">

了解更多：如需更多關於 Angular 路由器的資訊，請參閱[路由與導覽](guide/router "Routing & Navigation")。

</div>


## 後續步驟

恭喜！你已將路由整合到你的線上商店中。

* 產品從產品清單頁面連結到個別產品
* 使用者可以點選清單中的產品名稱，在具有專屬 URL（路由）的新檢視中查看詳細資料

要繼續探索 Angular，請選擇下列其中一個選項：
* [繼續前往「管理資料」一節](start/data "Getting Started: Managing Data")，加入購物車功能，使用服務來管理購物車資料，並使用 HTTP 擷取外部運費價格資料。
* [直接跳到「部署」一節](start/deployment "Getting Started: Deployment")，將應用程式部署到 Firebase 或轉為本機開發。
