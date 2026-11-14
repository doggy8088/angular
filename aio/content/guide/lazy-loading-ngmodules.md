# 延遲載入功能模組

#### 先決條件
對下列各項有基本的理解：
* [功能模組](guide/feature-modules)
* [JavaScript 模組與 NgModule](guide/ngmodule-vs-jsmodule)
* [常用模組](guide/frequent-ngmodules)
* [功能模組的類型](guide/module-types)
* [路由與導覽](guide/router)

關於本頁所述、具有兩個延遲載入模組的最終範例應用程式，請見
<live-example></live-example>。

<hr>

## 高層次概覽

設定延遲載入功能模組有三個主要步驟：

1. 建立功能模組。
1. 建立功能模組的路由模組。
1. 設定路由。

## 設定應用程式

如果你還沒有應用程式，請依照下列步驟使用 CLI 建立一個。如果你已經有應用程式，請跳至
[設定路由](#config-routes)。輸入下列指令，其中 `customer-app` 是你的應用程式名稱：

```sh
ng new customer-app --routing
```

這會建立一個名為 `customer-app` 的應用程式，`--routing` 旗標
產生一個名為 `app-routing.module.ts` 的檔案，這是
為功能模組設定延遲載入所需的檔案之一。
執行指令 `cd customer-app` 進入專案。

## 建立帶有路由的功能模組

接著，你將需要一個可供路由前往的功能模組。若要建立它，請在終端機視窗提示符號處輸入下列指令，其中 `customers` 是模組的名稱：

```sh
ng generate module customers --routing
```

這會建立一個 customers 資料夾，裡面有兩個檔案：`CustomersModule`
與 `CustomersRoutingModule`。`CustomersModule` 將作為所有與 customers 相關事務的守門者。`CustomersRoutingModule` 將處理
所有與 customer 相關的路由。這能讓應用程式的結構在應用程式成長時維持井然有序，並讓你重複使用此模組，同時輕鬆保持其路由完整。

CLI 會在檔案頂端加入一條 JavaScript import 陳述式，並將 `CustomersRoutingModule` 加入 `@NgModule` 的 `imports` 陣列，從而將 `CustomersRoutingModule` 匯入 `CustomersModule`。

## 將元件加入功能模組

為了在瀏覽器中看到模組延遲載入的情形，請建立一個元件，在應用程式載入 `CustomersModule` 時渲染一些 HTML。在命令列輸入下列指令：

```sh
ng generate component customers/customer-list
```

這會在 `customers` 裡面建立一個名為 `customer-list` 的資料夾，其中包含構成該元件的四個檔案。

<!-- For more information
about components, see [Components](). -->

就像路由模組一樣，CLI 會將 `CustomerListComponent` 匯入 `CustomersModule`。


## 再加入一個功能模組

為了有另一個可路由前往的地方，請建立第二個帶有路由的功能模組：

```sh
ng generate module orders --routing
```

這會建立一個名為 `orders` 的新資料夾，其中包含 `OrdersModule` 與 `OrdersRoutingModule`。

現在，就像 `CustomersModule` 一樣，給它一些內容：

```sh
ng generate component orders/order-list
```

## 設定 UI

雖然你可以在網址列輸入 URL，但導覽對使用者來說更直接，也更常見。將 `app.component.html` 中的預設佔位標記，替換為自訂導覽，讓你可以在瀏覽器中輕鬆導覽至你的模組：


<code-example path="lazy-loading-ngmodules/src/app/app.component.html" region="app-component-template" header="src/app/app.component.html" linenums="false">

</code-example>



若要查看目前為止的應用程式在瀏覽器中的樣子，請在終端機視窗中輸入下列指令：

```sh
ng serve
```

接著前往 `localhost:4200`，你應該會看到 “app works!” 與三個按鈕。

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300" alt="瀏覽器中的三個按鈕">
</figure>


若要讓這些按鈕能運作，你需要設定路由模組。

{@a config-routes}

## 設定路由

這兩個功能模組 `OrdersModule` 與 `CustomersModule`，必須與 `AppRoutingModule` 連接起來，路由器才能知道它們。其結構如下：

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/lazy-load-relationship.jpg" width="400" alt="延遲載入模組圖">
</figure>


每個功能模組都透過路由器扮演一道門。在 `AppRoutingModule` 中，你設定指向功能模組的路由，在這個例子中是 `OrdersModule` 與 `CustomersModule`。這樣一來，路由器就知道要前往功能模組。接著，功能模組將 `AppRoutingModule` 連接到 `CustomersRoutingModule` 或 `OrdersRoutingModule`。這些路由模組會告訴路由器要前往何處載入相關元件。

### 應用程式層級的路由

在 `AppRoutingModule` 中，以下列內容更新 `routes` 陣列：


<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts" linenums="false">

</code-example>


import 陳述式保持不變。前兩條路徑分別是前往 `CustomersModule` 與 `OrdersModule` 的路由。請注意，延遲載入語法使用 `loadChildren`，後面跟著一個字串，該字串是模組的相對路徑、一個井字號 `#`，以及模組的類別名稱。

### 功能模組內部

接著，看看 `customers.module.ts`。如果你使用 CLI 並遵循本頁列出的步驟，你不需要在這裡做任何事。功能模組就像 `AppRoutingModule` 與功能路由模組之間的連接器。`AppRoutingModule` 匯入功能模組 `CustomersModule`，而 `CustomersModule` 則匯入 `CustomersRoutingModule`。


<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts" linenums="false">

</code-example>



`customers.module.ts` 檔案匯入了 `CustomersRoutingModule` 與 `CustomerListComponent`，讓 `CustomersModule` 類別能存取它們。`CustomersRoutingModule` 接著列在 `@NgModule` 的 `imports` 陣列中，讓 `CustomersModule` 能存取它自己的路由模組，而 `CustomerListComponent` 在 `declarations` 陣列中，這表示 `CustomerListComponent` 屬於 `CustomersModule`。


### 設定功能模組的路由

下一步在 `customers-routing.module.ts` 中進行。首先，將元件連同其他 JavaScript 匯入陳述式一起在檔案頂端匯入。接著，加入指向 `CustomerListComponent` 的路由。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts" linenums="false">

</code-example>


請注意，`path` 被設為空字串。這是因為 `AppRoutingModule` 中的路徑已經設為 `customers`，所以 `CustomersRoutingModule` 中的這條路由已經在 `customers` 脈絡之內。此路由模組中的每條路由都是子路由。

針對 `orders-routing.module.ts`，重複這最後一步：匯入 `OrdersListComponent` 並設定 Routes 陣列：

<code-example path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" region="orders-routing-module-detail" header="src/app/orders/orders-routing.module.ts (excerpt)" linenums="false">

</code-example>

現在，如果你在瀏覽器中檢視應用程式，這三個按鈕會把你帶到各個模組。

## 確認它能運作

你可以使用 Chrome 開發人員工具，查看模組是否確實是延遲載入的。在 Chrome 中，按 Mac 的 `Cmd+Option+i` 或 PC 的 `Ctrl+Shift+j` 開啟開發人員工具，然後前往 Network 頁籤。

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/network-tab.png" width="600" alt="延遲載入模組圖">
</figure>


點選 Orders 或 Customers 按鈕。如果你看到一個區塊（chunk）出現，表示你已正確連接一切，功能模組正在延遲載入。Orders 與 Customers 各會出現一個區塊，而且每個只會出現一次。


<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/chunk-arrow.png" width="600" alt="延遲載入模組圖">
</figure>


若要再次看到它，或在專案中作業後測試，點選 Network 分頁左上角那個帶有一條線的圓圈，清除所有內容：

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/clear.gif" width="200" alt="延遲載入模組圖">
</figure>


然後依你的平台，按 `Cmd+r` 或 `Ctrl+r` 重新載入。

## `forRoot()` 與 `forChild()`

你可能已經注意到，CLI 將 `RouterModule.forRoot(routes)` 加入了 `app-routing.module.ts` 的 `imports` 陣列。這讓 Angular 知道這個模組，
`AppRoutingModule`，是一個路由模組，而 `forRoot()` 指定這是根
路由模組。它設定你傳入的所有
路由，讓你能存取路由器指令，並註冊 `RouterService`。
在 `AppRoutingModule` 中使用 `forRoot()`&mdash;也就是說，在應用程式中於根層級使用一次。

CLI 也將 `RouterModule.forChild(routes)` 加入功能路由模組。如此一來，Angular
知道這份路由清單只負責提供額外的路由，旨在供功能模組使用。你可以在多個模組中使用 `forChild()`。

`forRoot()` 包含全域的注入器設定，例如設定路由器。`forChild()` 沒有注入器設定，只有 `RouterOutlet` 與 `RouterLink` 等指令。

更多資訊，請見[單例服務](guide/singleton-services)指南中的 [`forRoot()` deep dive](guide/singleton-services#forRoot) 章節。

<hr>

## 更多關於 NgModules 與路由

你可能也會對下列內容感興趣：
* [路由與導覽](guide/router)。
* [提供者](guide/providers)。
* [功能模組的類型](guide/module-types)。
