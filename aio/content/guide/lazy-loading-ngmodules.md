# 延遲載入功能模組

## 高層次概覽

預設情況下，NgModule 是及早載入的，這表示應用程式一載入，所有的 NgModule 也會載入，無論它們是否立即需要。對於具有大量路由的大型應用程式，請考慮延遲載入&mdash;這是一種依需要載入 NgModule 的設計模式。延遲載入有助於保持初始
套件大小較小，進而有助於減少載入時間。

關於本頁所述、具有兩個延遲載入模組的最終範例應用程式，請見

<live-example></live-example>.

設定延遲載入功能模組有三個主要步驟：

1. 使用 CLI 搭配 `--route` 旗標，建立功能模組。
1. 建立功能模組的元件。
1. 設定路由。

## 設定應用程式

如果你還沒有應用程式，請依照下列步驟使用 CLI 建立一個。如果你已經有應用程式，請跳至
[設定路由](#config-routes)。輸入下列指令，其中 `customer-app` 是你的應用程式名稱：

<code-example language="bash">
ng new customer-app --routing
</code-example>

這會建立一個名為 `customer-app` 的應用程式，`--routing` 旗標
產生一個名為 `app-routing.module.ts` 的檔案，這是
為功能模組設定延遲載入所需的檔案之一。
執行指令 `cd customer-app` 進入專案。

## 建立帶有路由的功能模組

接著，你將需要一個帶有可路由元件的功能模組。
若要建立它，請在終端機中輸入下列指令，其中 `customers` 是功能模組的名稱，而 `customer-list` 是載入 `customers` 元件的路由路徑：

<code-example language="bash">
ng generate module customers --route customer-list --module app.module
</code-example>

這會建立一個 `customers` 資料夾，其中包含定義在檔案 `customers.module.ts` 中的新可延遲載入模組 `CustomersModule`。該指令會自動將 `CustomerComponent` 加入新功能模組。

因為新模組旨在延遲載入，該指令不會在根應用程式的模組檔案 `app.module.ts` 中加入對新功能模組的參照。
相反地，它會將宣告的路由 `customer-list` 加入 `--module` 選項所指定模組中宣告的 `Routes` 陣列。

<code-example language="typescript" header="src/app/app-routing.module.ts">
const routes: Routes = [
    { path: 'customer-list',
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) }
    ];
</code-example>

注意，延遲載入的語法使用 `loadChildren`，後面跟著一個使用瀏覽器內建 `import('...')` 動態匯入語法的函式。
匯入路徑是該模組的相對路徑。

### 再加入一個功能模組

使用相同的指令，建立第二個帶有路由的延遲載入功能模組，以及其存根元件。

<code-example language="bash">
ng generate module orders --route order-list --module app.module
</code-example>

這會建立一個名為 `orders` 的新資料夾，其中包含 `OrdersModule` 與 `OrdersRoutingModule`，以及新的 `OrderComponent` 原始檔。
`order-list` 路由會使用延遲載入語法，加入 `app-routing.module.ts` 中的 `Routes` 陣列。

<code-example language="typescript" header="src/app/app-routing.module.ts">
const routes: Routes = [
    { path: 'customer-list',
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
    { path: 'order-list',
      loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) }
    ];
</code-example>

## 設定 UI

雖然你可以在網址列輸入 URL，但導覽 UI 對使用者來說更直接，也更常見。
將 `app.component.html` 中的預設佔位標記，替換為自訂導覽，讓你可以在瀏覽器中導覽至你的模組：

<code-example path="lazy-loading-ngmodules/src/app/app.component.html" header="app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>

若要查看目前為止的應用程式在瀏覽器中的樣子，請在終端機視窗中輸入下列指令：

<code-example language="bash">
ng serve
</code-example>

接著前往 `localhost:4200`，你應該會看到 “app works!” 與三個按鈕。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300" alt="瀏覽器中的三個按鈕">

  </div>

</figure>

這些按鈕可以運作，因為 CLI 已自動將功能模組的路由加入 `app.module.ts` 的 `routes` 陣列。

{@a config-routes}

## 匯入與路由設定

CLI 已自動在應用程式層級將每個功能模組加入路由對應表。
最後，加入預設路由來完成這一切。在 `AppRoutingModule` 中，以下列內容更新 `routes` 陣列：

<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" id="app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts"></code-example>

前兩條路徑是前往 `CustomersModule` 與 `OrdersModule` 的路由。
最後一個條目定義了預設路由。空路徑會比對所有與先前路徑不符的路徑。

### 功能模組內部

接著，看看 `customers.module.ts`。如果你使用 CLI 並遵循本頁列出的步驟，你不需要在這裡做任何事。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" id="customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts"></code-example>

`customers.module.ts` 檔案匯入了 `CustomersRoutingModule` 與 `CustomerListComponent`，讓 `CustomersModule` 類別能存取它們。`CustomersRoutingModule` 接著列在 `@NgModule` 的 `imports` 陣列中，讓 `CustomersModule` 能存取它自己的路由模組，而 `CustomerListComponent` 在 `declarations` 陣列中，這表示 `CustomerListComponent` 屬於 `CustomersModule`。

功能模組有它自己的路由模組，`customers-routing.module.ts`。`AppRoutingModule` 匯入功能模組 `CustomersModule`，而 `CustomersModule` 則匯入 `CustomersRoutingModule`。

功能專屬的路由模組會匯入它自己的功能元件 `CustomerListComponent`，連同其他 JavaScript 匯入敘述。它也會加入指向其自身元件的路由。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" id="customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts"></code-example>

請注意，`path` 被設為空字串。這是因為 `AppRoutingModule` 中的路徑已經設為 `customers`，所以 `CustomersRoutingModule` 中的這條路由已經在 `customers` 脈絡之內。此路由模組中的每條路由都是子路由。

另一個功能模組的路由模組也以類似方式設定。

<code-example path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" id="orders-routing.module.ts" region="orders-routing-module-detail" header="src/app/orders/orders-routing.module.ts (excerpt)"></code-example>

## 確認它能運作

你可以使用 Chrome 開發人員工具，查看模組是否確實是延遲載入的。在 Chrome 中，按 Mac 的 `Cmd+Option+i` 或 PC 的 `Ctrl+Shift+j` 開啟開發人員工具，然後前往 Network 頁籤。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/lazy-loading-ngmodules/network-tab.png" width="600" alt="延遲載入模組圖">

  </div>

</figure>

點選 Orders 或 Customers 按鈕。如果你看到一個區塊（chunk）出現，表示一切都已正確連接，功能模組正在延遲載入。Orders 與 Customers 各會出現一個區塊，而且每個只會出現一次。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/lazy-loading-ngmodules/chunk-arrow.png" width="600" alt="延遲載入模組圖">

  </div>

</figure>

若要再次看到它，或在專案中作業後測試，點選 Network 分頁左上角那個帶有一條線的圓圈，清除所有內容：

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/lazy-loading-ngmodules/clear.gif" width="200" alt="延遲載入模組圖">

  </div>

</figure>

然後依你的平台，按 `Cmd+r` 或 `Ctrl+r` 重新載入。

## `forRoot()` 與 `forChild()`

你可能已經注意到，CLI 將 `RouterModule.forRoot(routes)` 加入了 `app-routing.module.ts` 的 `imports` 陣列。
這讓 Angular 知道這個模組 `AppRoutingModule` 是一個路由模組，而 `forRoot()` 指定這是根路由模組。
它設定你傳入的所有路由，讓你能存取路由器指令，並註冊 `RouterService`。
在 `AppRoutingModule` 中使用 `forRoot()`&mdash;也就是說，在應用程式中於根層級使用一次。

CLI 也將 `RouterModule.forChild(routes)` 加入功能路由模組。
如此一來，Angular 知道這份路由清單只負責提供額外的路由，旨在供功能模組使用。
你可以在多個模組中使用 `forChild()`。

`forRoot()` 方法負責 Router 的*全域*注入器設定。
`forChild()` 方法沒有注入器設定。它使用 `RouterOutlet` 與 `RouterLink` 等指令。
更多資訊，請見[單例服務](guide/singleton-services)指南中的 [`forRoot()` pattern](guide/singleton-services#forRoot) 章節。

<hr>

## 更多關於 NgModules 與路由

你可能也會對下列內容感興趣：
* [路由與導覽](guide/router)。
* [提供者](guide/providers)。
* [功能模組的類型](guide/module-types)。
* [Angular 中的路由層級程式碼分割](https://web.dev/route-level-code-splitting-in-angular/)
* [Angular 中的路由預先載入策略](https://web.dev/route-preloading-in-angular/)
