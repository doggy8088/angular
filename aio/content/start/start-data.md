# 試試看：管理資料

在[應用程式內導覽](start/start-routing "Try it: In-app Navigation")結束時，線上商店應用程式已有一個產品目錄，包含兩個檢視：產品清單與產品詳細資料。
使用者可以點選清單中的產品名稱，在新的檢視中查看詳細資料，該檢視有專屬的 URL，也就是路由。

本頁會引導你分三個階段建立購物車：

* 更新產品詳細資料檢視，加入「Buy」按鈕，按下後會把目前的產品加入購物車服務所管理的產品清單。
* 加入購物車元件，顯示購物車中的商品。
* 加入運送元件，使用 Angular 的 `HttpClient` 從 `.json` 檔案擷取運送資料，取得購物車商品的運費價格。

{@a services}
## 服務

服務是 Angular 應用程式不可或缺的一部分。在 Angular 中，服務是某個類別的執行個體，你可以使用 Angular 的[依賴注入系統](guide/glossary#依賴注入dependency-injectiondi "依賴注入定義")，讓應用程式的任何部分都能使用它。

服務是你可以在應用程式各部分之間分享資料的地方。以線上商店來說，購物車服務就是你存放購物車資料與方法的地方。

{@a create-cart-service}
## 建立購物車服務

到目前為止，使用者可以檢視產品資訊，並
模擬分享與收到產品變更通知。
不過，他們還不能購買產品。

在本節中，你將在產品
詳細資料檢視中加入「Buy」按鈕，並設定購物車服務來儲存
購物車中產品的資訊。

<div class="alert is-helpful">

本教學後面的部分，[使用表單取得使用者輸入](start/start-forms "Try it: Forms for user input")，會引導你從使用者結帳的檢視存取這個購物車服務。

</div>

{@a generate-cart-service}
### 定義購物車服務

1. 若要產生購物車服務，請在 `app` 資料夾上按右鍵，選擇 `Angular Generator`，再選擇 `Service`。將新服務命名為 `cart`。

        <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.1.ts"></code-example>

    <div class="alert is-helpful>

    StackBlitz 產生器可能會依預設在 `app.module.ts` 中提供購物車服務。這與範例不同，範例使用了一種包大小最佳化技巧：帶有 `{ providedIn: 'root' }` 陳述式的 `@Injectable()` 裝飾器。
    如需進一步了解服務，請參閱[服務與依賴注入簡介](guide/architecture-services "Concepts > Intro to Services and DI")。

    </div>

1. 在 `CartService` 類別中，定義 `items` 屬性，用來儲存購物車中目前產品的陣列。

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="props"></code-example>

1. 定義方法，把商品加入購物車、傳回購物車商品，以及清空購物車商品：

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="methods"></code-example>

    * `addToCart()` 方法會把產品附加到 `items` 陣列。

    * `getItems()` 方法會收集使用者加入購物車的商品，並傳回每個商品及其相關數量。

    * `clearCart()` 方法會傳回空的商品陣列。

{@a product-details-use-cart-service}
### 使用購物車服務

本節會引導你使用購物車服務，透過「Buy」按鈕把產品加入購物車。

1. 開啟 `product-details.component.ts`。

1. 設定元件來使用購物車服務。

    1. 匯入購物車服務。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service">
        </code-example>

    1. 把購物車服務加入 `constructor()`，完成注入。

        <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="inject-cart-service">
        </code-example>

        <!--
        To do: Consider defining "inject" and describing the concept of "dependency injection"
        -->

1. 定義 `addToCart()` 方法，把目前的產品加入購物車。

    `addToCart()` 方法會做以下三件事：
    * 接收目前的 `product`。
    * 使用購物車服務的 `addToCart()` 方法把產品加入購物車。
    * 顯示訊息，告知你已把產品加入購物車。

    <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

1. 更新產品詳細資料範本，加入「Buy」按鈕，按下後會把目前的產品加入購物車。

    1. 開啟 `product-details.component.html`。

    1. 加入標籤為「Buy」的按鈕，並把 `click()` 事件繫結到 `addToCart()` 方法：

        <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html">
        </code-example>
    
    <div class="alert is-helpful">

    這一行 `<h4>{{ product.price | currency }}</h4>` 使用 `currency` 管道，把 `product.price` 從數字轉換為貨幣字串。管道是一種在 HTML 範本中轉換資料的方式。如需進一步了解 Angular 管道，請參閱[管道](guide/pipes "Pipes")。

    </div>

1. 若要查看新的「Buy」按鈕，請重新整理應用程式，並點選產品名稱以顯示其詳細資料。

    <div class="lightbox">
      <img src='generated/images/guide/start/product-details-buy.png' alt="顯示所選產品的詳細資料，並有一個 Buy 按鈕">
    </div>

 1. 點選「Buy」按鈕，把產品加入購物車已儲存的商品清單，並顯示確認訊息。

    <div class="lightbox">
      <img src='generated/images/guide/start/buy-alert.png' alt="顯示所選產品的詳細資料，並有一個 Buy 按鈕">
    </div>


## 建立購物車檢視

目前，使用者點選「Buy」就能把商品放進購物車，但還看不到自己的購物車。

用兩個步驟建立購物車檢視：

1. 建立購物車元件，並為新元件設定路由。此時，購物車檢視只有預設文字。
1. 顯示購物車商品。

### 設定元件

若要建立購物車檢視，先依照你建立產品詳細資料元件並為新元件設定路由時相同的步驟進行。

1. 產生一個購物車元件，命名為 `cart`。

    提醒：在檔案清單中，在 `app` 資料夾上按右鍵，選擇 `Angular Generator` 與 `Component`。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

1. 為購物車元件加入路由（URL 模式）。

    開啟 `app.module.ts`，為 `CartComponent` 元件加入一條路由，`path` 為 `cart`：

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route">
    </code-example>

1. 更新「Checkout」按鈕，讓它路由到 `/cart` url。

    開啟 `top-bar.component.html`，加入指向 `/cart` 的 `routerLink` 指令。

    <code-example
        header="src/app/top-bar/top-bar.component.html"
        path="getting-started/src/app/top-bar/top-bar.component.html"
        region="cart-route">
    </code-example>

1. 若要查看新的購物車元件，請點選「Checkout」按鈕。你會看到預設文字「cart works!」，而 URL 的格式為 `https://getting-started.stackblitz.io/cart`，其中 `getting-started.stackblitz.io` 在你的 StackBlitz 專案中可能不同。

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-works.png' alt="自訂前的購物車檢視">
    </div>

### 顯示購物車商品

你可以使用服務在各元件之間分享資料：

* 產品詳細資料元件已使用購物車服務把產品加入購物車。
* 本節說明如何使用購物車服務顯示購物車中的產品。


1. 開啟 `cart.component.ts`。

1. 設定元件來使用購物車服務。

    1. 從 `cart.service.ts` 檔案匯入 `CartService`。

        <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports">
        </code-example>

    1. 注入 `CartService`，讓購物車元件能夠使用它。

        <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="inject-cart">
        </code-example>

1. 定義 `items` 屬性，用來儲存購物車中的產品。

    <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="items">
    </code-example>

1. 使用購物車服務的 `getItems()` 方法設定商品。回想一下，你在[產生 `cart.service.ts` 時](#generate-cart-service)定義了這個方法。

    產生的 `CartComponent` 類別如下：

    <code-example path="getting-started/src/app/cart/cart.component.3.ts" header="src/app/cart/cart.component.ts" region="props-services">
    </code-example>

1. 更新範本，加入標題，並使用帶有 `*ngFor` 的 `<div>` 顯示每個購物車商品的名稱與價格。

    產生的 `CartComponent` 範本如下：

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices">
    </code-example>

1. 測試你的購物車元件。

    1. 點選「My Store」前往產品清單檢視。
    1. 點選產品名稱以顯示其詳細資料。
    1. 點選「Buy」把產品加入購物車。
    1. 點選「Checkout」查看購物車。
    1. 若要再加入其他產品，點選「My Store」回到產品清單。

  重複上述步驟，把更多商品加入購物車。

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-page-full.png' alt="已加入產品的購物車檢視">
    </div>


<div class="alert is-helpful">

StackBlitz 小提示：只要預覽重新整理，購物車就會被清空。如果你變更了應用程式，頁面會重新整理，因此你需要重新購買產品，才能把購物車填滿。

</div>

<div class="alert is-helpful">

如需進一步了解服務，請參閱[服務與依賴注入簡介](guide/architecture-services "Concepts > Intro to Services and DI")。

</div>


## 擷取運費價格
<!-- Accessing data with the HTTP client -->

伺服器經常以串流的形式傳回資料。
串流很有用，因為它們讓轉換傳回的資料變得容易，也方便調整請求資料的方式。
Angular 的 HTTP 用戶端 `HttpClient`，是從外部 API 取得資料並以串流形式提供給你的應用程式的內建方式。

本節說明如何使用 HTTP 用戶端從外部檔案擷取運費價格。

### 預先定義的運送資料

StackBlitz 為本指南產生的應用程式，在 `assets/shipping.json` 中附有預先定義的運送資料。
使用這份資料，為購物車中的商品加入運費價格。

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json">
</code-example>


### 在 `AppModule` 中使用 `HttpClient`

在使用 Angular 的 HTTP 用戶端之前，你必須先設定你的應用程式使用 `HttpClientModule`。

Angular 的 `HttpClientModule` 會註冊你的應用程式在各處使用單一 `HttpClient` 服務執行個體所需的提供者。

1. 開啟 `app.module.ts`。

  這個檔案包含整個應用程式都能使用的匯入項目與功能。

1. 在檔案頂端，與其他匯入項目放在一起，從 `@angular/common/http` 套件匯入 `HttpClientModule`。由於還有許多其他匯入項目，為求簡潔，這段程式碼片段省略了它們。請務必保留現有的匯入項目。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import">
    </code-example>

1. 將 `HttpClientModule` 加入 `AppModule` 的 `@NgModule()` `imports` 陣列，在全域註冊 Angular 的 `HttpClient` 提供者。

    <code-example path="getting-started/src/app/app.module.ts" header="src/app/app.module.ts" region="http-client-module">
    </code-example>

### 在購物車服務中使用 `HttpClient`

現在 `AppModule` 已匯入 `HttpClientModule`，下一步是把 `HttpClient` 服務注入你的服務，讓應用程式可以取得資料，並與外部 API 及資源互動。


1. 開啟 `cart.service.ts`。

1. 從 `@angular/common/http` 套件匯入 `HttpClient`。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http">
    </code-example>

1. 把 `HttpClient` 注入 `CartService` 建構子：

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="inject-http">
    </code-example>


### 定義 `get()` 方法

多個元件可以利用同一個服務。
在本教學後面，運送元件會使用購物車服務，透過 HTTP 從 `shipping.json` 檔案擷取運送資料。
首先，定義一個 `get()` 方法。

1. 繼續在 `cart.service.ts` 中工作。

1. 在 `clearCart()` 方法下方，定義新的 `getShippingPrices()` 方法，使用 `HttpClient` 的 `get()` 方法擷取運送資料。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>


<div class="alert is-helpful">

如需進一步了解 Angular 的 `HttpClient`，請參閱[用戶端與伺服器互動](guide/http "透過 HTTP 與伺服器互動")指南。

</div>

## 定義運送檢視

現在你的應用程式已能擷取運送資料，接著建立運送元件與範本。

1. 產生一個名為 `shipping` 的新元件。

    提醒：在檔案清單中，在 `app` 資料夾上按右鍵，選擇 `Angular Generator` 與 `Component`。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1. 在 `app.module.ts` 中，為運送功能加入路由。將 `path` 指定為 `shipping`，元件指定為 `ShippingComponent`。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    目前還沒有連到新運送元件的連結，不過你可以在預覽窗格中輸入其路由指定的 URL 來查看它的範本。URL 的格式為：`https://getting-started.stackblitz.io/shipping`，其中 `getting-started.stackblitz.io` 這個部分在你的 StackBlitz 專案中可能不同。

1. 修改運送元件，讓它使用購物車服務，透過 HTTP 從 `shipping.json` 檔案擷取運送資料。

    1. 匯入購物車服務。

        <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

    1. 定義 `shippingCosts` 屬性。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="props"></code-example>

    1. 在 `ShippingComponent` 建構子中注入購物車服務：

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

    1. 使用購物車服務的 `getShippingPrices()` 方法設定 `shippingCosts` 屬性。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="ctor"></code-example>

1. 更新運送元件的範本，使用 `async` 管道顯示運送方式與價格：

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

    `async` 管道會傳回資料串流的最新值，並在指定元件的整個生命週期中持續這麼做。當 Angular 銷毀該元件時，`async` 管道會自動停止。如需 `async` 管道的詳細資訊，請參閱 [AsyncPipe API 文件](/api/common/AsyncPipe)。

1. 從購物車檢視加入連到運送檢視的連結：

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1. 測試你的運費價格功能：

    點選「Checkout」按鈕，查看更新後的購物車。請記住，變更應用程式會使預覽重新整理，購物車也會隨之清空。

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-empty-with-shipping-prices.png' alt="附有運費價格連結的購物車">
    </div>

    點選連結，導覽至運費價格。

    <div class="lightbox">
      <img src='generated/images/guide/start/shipping-prices.png' alt="顯示運費價格">
    </div>


## 後續步驟

恭喜！你現在擁有一個線上商店應用程式，包含產品目錄與購物車。你也可以查詢並顯示運費價格。

要繼續探索 Angular，請選擇下列其中一個選項：
* [繼續前往「表單」一節](start/start-forms "Try it: Forms for User Input")，加入購物車檢視與結帳表單，完成應用程式。
* [直接跳到「部署」一節](start/start-deployment "Try it: Deployment")，轉移到本機開發，或將應用程式部署到 Firebase 或你自己的伺服器。
