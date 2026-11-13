# 管理資料

在[路由](start/routing "Getting Started: Routing")結束時，線上商店應用程式已有一個產品目錄，包含兩個檢視：產品清單與產品詳細資料。
使用者可以點選清單中的產品名稱，在新的檢視中查看詳細資料，該檢視有專屬的 URL，也就是路由。

在本節中，你將建立購物車。你將會：
* 更新產品詳細資料頁面，加入「Buy」按鈕，按下後會把目前的產品加入購物車服務所管理的產品清單。
* 加入購物車元件，顯示你加入購物車的商品。
* 加入運送元件，使用 Angular 的 `HttpClient` 從 `.json` 檔案擷取運送資料，取得購物車商品的運費價格。

{@a services}
## 服務

服務是 Angular 應用程式不可或缺的一部分。在 Angular 中，服務是某個類別的執行個體，你可以使用 Angular 的[依賴注入系統](guide/glossary#依賴注入（dependency-injection，di） "依賴注入定義")，讓應用程式的任何部分都能使用它。

服務是你可以在應用程式各部分之間分享資料的地方。以線上商店來說，購物車服務就是你存放購物車資料與方法的地方。

{@a create-cart-service}
## 建立購物車服務

到目前為止，使用者可以檢視產品資訊，並模擬分享與收到產品變更通知。不過，他們還不能購買產品。

在本節中，你將在產品詳細資料頁面加入「Buy」按鈕。
你也會設定購物車服務，來儲存購物車中產品的資訊。

<div class="alert is-helpful">

本教學後面的部分，[表單](start/forms "Getting Started: Forms")，這個購物車服務也會從使用者結帳的頁面被存取。

</div>

{@a generate-cart-service}
### 定義購物車服務

1. 產生購物車服務。

    1. 在 `app` 資料夾上按右鍵，選擇 `Angular Generator`，再選擇 `Service`。將新服務命名為 `cart`。

        <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.1.ts"></code-example>

    1. 如果產生的 `@Injectable()` 裝飾器未包含 `{ providedIn: 'root' }` 陳述式，請如上所示將它加入。

1. 在 `CartService` 類別中，定義 `items` 屬性，用來儲存購物車中目前產品的清單（陣列）。

    <code-example path="getting-started/src/app/cart.service.ts" region="props"></code-example>

1. 定義方法，把商品加入購物車、傳回購物車商品，以及清空購物車商品：

    <code-example path="getting-started/src/app/cart.service.ts" region="methods"></code-example>

    <!--
    To check: StackBlitz includes the constructor. If it's important (and not obvious) that the methods be below the constructor, then we should show it or say something.
    -->

    <!--
    * The `addToCart()` method appends a product to an array of `items`.

    * The `getItems()` method collects the items added to the cart and returns each item with its associated quantity.

    * The `clearCart()` method returns an empty array of items.
    -->

{@a product-details-use-cart-service}
### 使用購物車服務

在本節中，你將更新產品詳細資料元件來使用購物車服務。
你會在產品詳細資料檢視中加入「Buy」按鈕。
當「Buy」按鈕被點選時，你會使用購物車服務把目前的產品加入購物車。

1. 開啟 `product-details.component.ts`。

1. 設定元件來使用購物車服務。

    1. 匯入購物車服務。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service">
        </code-example>

    1. 注入購物車服務。

        <code-example path="getting-started/src/app/product-details/product-details.component.ts" region="inject-cart-service">
        </code-example>

        <!--
        To do: Consider defining "inject" and describing the concept of "dependency injection"
        -->

1. 定義 `addToCart()` 方法，把目前的產品加入購物車。

    `addToCart()` 方法會：
    * 接收目前的 `product`
    * 使用購物車服務的 `#addToCart()` 方法把產品加入購物車
    * 顯示訊息，告知產品已加入購物車

    <code-example path="getting-started/src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

1. 更新產品詳細資料範本，加入「Buy」按鈕，按下後會把目前的產品加入購物車。

    1. 開啟 `product-details.component.html`。

    1. 加入標籤為「Buy」的按鈕，並把 `click()` 事件繫結到 `addToCart()` 方法：

        <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html">
        </code-example>

1. 若要查看新的「Buy」按鈕，請重新整理應用程式，並點選產品名稱以顯示其詳細資料。

    <figure class="lightbox">
      <div class="card">
        <img src='generated/images/guide/start/product-details-buy.png' alt="顯示所選產品的詳細資料，並有一個 Buy 按鈕">
      </div>
    </figure>

1. 點選「Buy」按鈕。產品會被加入購物車已儲存的商品清單，並顯示一則訊息。

    <figure class="lightbox">
      <div class="card">
        <img src='generated/images/guide/start/buy-alert.png' alt="顯示所選產品的詳細資料，並有一個 Buy 按鈕">
      </div>
    </figure>


## 建立購物車頁面

目前，使用者點選「Buy」就能把商品放進購物車，但還看不到自己的購物車。

我們將以兩個步驟建立購物車頁面：

1. 建立購物車元件，並為新元件設定路由。此時，購物車頁面只有預設文字。
1. 顯示購物車商品。

### 設定元件

 若要建立購物車頁面，先依照你建立產品詳細資料元件並為新元件設定路由時相同的步驟進行。

1. 產生一個購物車元件，命名為 `cart`。

    提醒：在檔案清單中，在 `app` 資料夾上按右鍵，選擇 `Angular Generator` 與 `Component`。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

1. 為購物車元件加入路由（URL 模式）。

    提醒：開啟 `app.module.ts`，為 `CartComponent` 元件加入一條路由，`path` 為 `cart`：

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route">
    </code-example>

    <!--
    To do: Can we shorten the example code to remove the extra at the bottom?
    -->

1. 若要查看新的購物車元件，請點選「Checkout」按鈕。你會看到預設文字「cart works!」，而 URL 的格式為 `https://getting-started.stackblitz.io/cart`，其中 `getting-started.stackblitz.io` 在你的 StackBlitz 專案中可能不同。

    （注意：我們在 top-bar 元件中提供的「Checkout」按鈕，已預先設定好指向 `/cart` 的 `routerLink`。）

    <figure class="lightbox">
      <div class="card">
        <img src='generated/images/guide/start/cart-works.png' alt="自訂前的購物車頁面">
      </div>
    </figure>


### 顯示購物車商品

你可以使用服務在各元件之間分享資料：

* 產品詳細資料元件已使用購物車服務（`CartService`）把產品加入購物車。
* 在本節中，你將更新購物車元件，使用購物車服務來顯示購物車中的產品。


1. 開啟 `cart.component.ts`。

1. 設定元件來使用購物車服務。（這與上方設定產品詳細資料元件使用購物車服務的方式相同。）

    1. 從 `cart.service.ts` 檔案匯入 `CartService`。

        <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports">
        </code-example>

    1. 注入 `CartService` 來管理購物車資訊。

        <code-example path="getting-started/src/app/cart/cart.component.2.ts" region="inject-cart">
        </code-example>

1. 定義 `items` 屬性，用來儲存購物車中的產品。

    <code-example path="getting-started/src/app/cart/cart.component.2.ts" region="items">
    </code-example>

1. 使用購物車服務的 `getItems()` 方法設定商品。（你是在[產生 `cart.service.ts` 時](#generate-cart-service)定義這個方法的。）

    產生的 `CartComponent` 類別應該像這樣：

    <code-example path="getting-started/src/app/cart/cart.component.3.ts" region="props-services">
    </code-example>

1. 更新範本，加入標題（「Cart」），並使用帶有 `*ngFor` 的 `<div>` 顯示每個購物車商品的名稱與價格。

    產生的 `CartComponent` 範本應該像這樣：

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices">
    </code-example>

1. 測試你的購物車元件。

    1. 點選「My Store」前往產品清單頁面。
    1. 點選產品名稱以顯示其詳細資料。
    1. 點選「Buy」把產品加入購物車。
    1. 點選「Checkout」查看購物車。
    1. 若要再加入其他產品，點選「My Store」回到產品清單。重複上述步驟。

    <figure class="lightbox">
      <div class="card">
        <img src='generated/images/guide/start/cart-page-full.png' alt="已加入產品的購物車頁面">
      </div>
    </figure>


<div class="alert is-helpful">

StackBlitz 小提示：只要預覽重新整理，購物車就會被清空。如果你變更了應用程式，頁面會重新整理，因此你需要重新購買產品，才能把購物車填滿。

</div>

<!--
To do: New screen shot. No shipping prices link yet. Show a few products in the cart.
-->

<div class="alert is-helpful">

了解更多：如需進一步了解服務，請參閱[服務與依賴注入簡介](guide/architecture-services "Architecture > Intro to Services and DI")。

</div>



## 擷取運費價格
<!-- Accessing data with the HTTP client -->

伺服器傳回的資料經常採用串流的形式。
串流很有用，因為它們讓轉換傳回的資料變得容易，也方便調整請求資料的方式。
Angular 的 HTTP 用戶端（`HttpClient`）是從外部 API 取得資料並以串流形式提供給你的應用程式的內建方式。

在本節中，你將使用 HTTP 用戶端從外部檔案擷取運費價格。

### 預先定義的運送資料

為了本入門指南的目的，我們已在 `assets/shipping.json` 中提供運送資料。
你將使用這份資料，為購物車中的商品加入運費價格。

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json">
</code-example>


### 為應用程式啟用 HttpClient

在使用 Angular 的 HTTP 用戶端之前，你必須先設定你的應用程式使用 `HttpClientModule`。

Angular 的 `HttpClientModule` 會註冊在整個應用程式中使用單一 `HttpClient` 服務執行個體所需的提供者。
`HttpClient` 服務就是你注入到服務中、用來擷取資料並與外部 API 及資源互動的服務。

1. 開啟 `app.module.ts`。

  這個檔案包含整個應用程式都能使用的匯入項目與功能。

1. 從 `@angular/common/http` 套件匯入 `HttpClientModule`。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import">
    </code-example>

1. 將 `HttpClientModule` 加入應用程式模組（`@NgModule`）的 `imports` 陣列。

    這會在全域註冊 Angular 的 `HttpClient` 提供者。

    <code-example path="getting-started/src/app/app.module.ts" region="http-client-module">
    </code-example>

<!--
To do: Should ReactiveFormsModule already be here? Currently, it is in the starter stackblitz, so this doc assumes it is already included and not added in the forms section.
-->

<!--
To do: Should ReactiveFormsModule already be here?
-->

### 為購物車服務啟用 HttpClient

1. 開啟 `cart.service.ts`。

1. 從 `@angular/common/http` 套件匯入 `HttpClient`。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http">
    </code-example>

1. 將 `HttpClient` 注入 `CartService` 元件類別的建構子：

    <code-example path="getting-started/src/app/cart.service.ts" region="inject-http">
    </code-example>


### 定義 get() 方法

如你所見，多個元件可以利用同一個服務。
在本教學後面，運送元件會使用購物車服務，透過 HTTP 從 `shipping.json` 檔案擷取運送資料。
在這裡，你將定義會被用到的 `get()` 方法。

1. 繼續在 `cart.service.ts` 中工作。

1. 在 `clearCart()` 方法下方，定義新的 `getShippingPrices()` 方法，使用 `HttpClient#get()` 方法擷取運送資料（類型與價格）。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>


<div class="alert is-helpful">

了解更多：如需進一步了解 Angular 的 `HttpClient`，請參閱 [HttpClient 指南](guide/http "HttpClient guide")。

</div>




## 定義運送頁面

現在你的應用程式已能擷取運送資料，接著你將建立運送元件與相關範本。

1. 產生一個名為 `shipping` 的新元件。

    提醒：在檔案清單中，在 `app` 資料夾上按右鍵，選擇 `Angular Generator` 與 `Component`。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1. 在 `app.module.ts` 中，為運送功能加入路由。將 `path` 指定為 `shipping`，元件指定為 `ShippingComponent`。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    新的運送元件尚未與任何其他元件掛勾，不過你可以在預覽窗格中輸入其路由指定的 URL 來查看它。URL 的格式為：`https://getting-started.stackblitz.io/shipping`，其中 `getting-started.stackblitz.io` 這個部分在你的 StackBlitz 專案中可能不同。

1. 修改運送元件，讓它使用購物車服務，透過 HTTP 從 `shipping.json` 檔案擷取運送資料。

    1. 匯入購物車服務。

        <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

    1. 定義 `shippingCosts` 屬性。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="props"></code-example>

    1. 將購物車服務注入 `ShippingComponent` 類別：

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

    1. 使用購物車服務的 `getShippingPrices()` 方法設定 `shippingCosts` 屬性。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="ctor"></code-example>

1. 更新運送元件的範本，使用 async 管道顯示運送方式與價格：

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

    <!--
    To decide: Should we describe async pipe
    -->

1. 從購物車頁面加入連到運送頁面的連結：

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1. 測試你的運費價格功能：

    點選「Checkout」按鈕，查看更新後的購物車。（請記住，變更應用程式會使預覽重新整理，購物車也會隨之清空。）

    <figure class="lightbox">
      <div class="card">
        <img src='generated/images/guide/start/cart-empty-with-shipping-prices.png' alt="附有運費價格連結的購物車">
      </div>
    </figure>

    點選連結，導覽至運費價格。

    <figure class="lightbox">
      <div class="card">
        <img src='generated/images/guide/start/shipping-prices.png' alt="顯示運費價格">
      </div>
    </figure>


## 後續步驟

恭喜！你現在擁有一個線上商店應用程式，包含產品目錄與購物車。你也可以查詢並顯示運費價格。

要繼續探索 Angular，請選擇下列其中一個選項：
* [繼續前往「表單」一節](start/forms "Getting Started: Forms")，加入購物車頁面與結帳表單，完成應用程式。你將建立表單，在結帳時收集使用者資訊。
* [直接跳到「部署」一節](start/deployment "Getting Started: Deployment")，轉移到本機開發，或將應用程式部署到 Firebase 或你自己的伺服器。
