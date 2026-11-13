# 延遲載入功能模組

預設情況下，NgModule 是及早載入的，這表示應用程式一載入，所有的 NgModule 也會載入，無論它們是否立即需要。對於具有大量路由的大型應用程式，請考慮延遲載入&mdash;這是一種依需要載入 NgModule 的設計模式。延遲載入有助於保持初始
套件大小較小，進而有助於減少載入時間。

<div class="alert is-helpful">

關於本頁所述、具有兩個延遲載入模組的最終範例應用程式，請見
<live-example></live-example>。

</div>

{@a lazy-loading}

## 延遲載入基礎

本節介紹設定延遲載入路由的基本程序。
逐步範例請見本頁的[逐步設定](#step-by-step)章節。

若要延遲載入 Angular 模組，請在你的 `AppRoutingModule` `routes` 設定中使用 `loadchildren`（而不是 `component`），如下所示。

<code-example header="AppRoutingModule (excerpt)">

const routes: Routes = [
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
  }
];

</code-example>

在延遲載入模組的路由模組中，為該元件加入一條路由。

<code-example header="Routing module for lazy loaded module (excerpt)">

const routes: Routes = [
  {
    path: '',
    component: ItemsComponent
  }
];

</code-example>

同時務必將 `ItemsModule` 從 `AppModule` 中移除。
延遲載入模組的逐步指示，請繼續閱讀本頁的下列章節。

{@a step-by-step}

## 逐步設定

設定延遲載入功能模組有兩個主要步驟：

1. 使用 CLI 搭配 `--route` 旗標，建立功能模組。
1. 設定路由。

### 設定應用程式

如果你還沒有應用程式，請依照下列步驟使用 CLI 建立一個。如果你已經有應用程式，請跳至
[設定路由](#config-routes)。輸入下列指令，其中 `customer-app` 是你的應用程式名稱：

<code-example language="bash">
ng new customer-app --routing
</code-example>

這會建立一個名為 `customer-app` 的應用程式，`--routing` 旗標
產生一個名為 `app-routing.module.ts` 的檔案，這是
為功能模組設定延遲載入所需的檔案之一。
執行指令 `cd customer-app` 進入專案。

<div class="alert is-helpful">

`--routing` 選項需要 Angular/CLI 8.1 或更高版本。
請見[讓你的 Angular 專案保持最新](guide/updating)。

</div>

### 建立帶有路由的功能模組

接著，你將需要一個帶有可路由元件的功能模組。
若要建立它，請在終端機中輸入下列指令，其中 `customers` 是功能模組的名稱。載入 `customers` 功能模組的路徑也是 `customers`，因為它是用 `--route` 選項指定的：

<code-example language="bash">
ng generate module customers --route customers --module app.module
</code-example>

這會建立一個 `customers` 資料夾，其中包含定義在 `customers.module.ts` 檔案中的新可延遲載入功能模組 `CustomersModule`，以及定義在 `customers-routing.module.ts` 檔案中的路由模組 `CustomersRoutingModule`。該指令會自動宣告 `CustomersComponent`，並在新功能模組內匯入 `CustomersRoutingModule`。

因為新模組旨在延遲載入，該指令不會在應用程式的根模組檔案 `app.module.ts` 中加入對新功能模組的參照。
相反地，它會將宣告的路由 `customers` 加入 `--module` 選項指定的模組中所宣告的 `routes` 陣列。

<code-example
  header="src/app/app-routing.module.ts"
  path="lazy-loading-ngmodules/src/app/app-routing.module.ts"
  region="routes-customers">
</code-example>

注意，延遲載入的語法使用 `loadChildren`，後面跟著一個使用瀏覽器內建 `import('...')` 動態匯入語法的函式。
匯入路徑是該模組的相對路徑。

#### 再加入一個功能模組

使用相同的指令，建立第二個帶有路由的延遲載入功能模組，以及其存根元件。

<code-example language="bash">
ng generate module orders --route orders --module app.module
</code-example>

這會建立一個名為 `orders` 的新資料夾，其中包含 `OrdersModule` 與 `OrdersRoutingModule`，以及新的 `OrdersComponent` 原始檔。
以 `--route` 選項指定的 `orders` 路由，會使用延遲載入語法，加入 `app-routing.module.ts` 檔案內的 `routes` 陣列。

<code-example
  header="src/app/app-routing.module.ts"
  path="lazy-loading-ngmodules/src/app/app-routing.module.ts"
  region="routes-customers-orders">
</code-example>

### 設定 UI

雖然你可以在網址列輸入 URL，但導覽 UI 對使用者來說更直接，也更常見。
將 `app.component.html` 中的預設佔位標記，替換為自訂導覽，讓你可以在瀏覽器中導覽至你的模組：

<code-example path="lazy-loading-ngmodules/src/app/app.component.html" header="app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>

若要查看目前為止的應用程式在瀏覽器中的樣子，請在終端機視窗中輸入下列指令：

<code-example language="bash">
ng serve
</code-example>

接著前往 `localhost:4200`，你應該會看到 “customer-app” 與三個按鈕。

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300" alt="瀏覽器中的三個按鈕">
</div>

這些按鈕可以運作，因為 CLI 已自動將功能模組的路由加入 `app.module.ts` 的 `routes` 陣列。

{@a config-routes}

### 匯入與路由設定

CLI 已自動在應用程式層級將每個功能模組加入路由對應表。
最後，加入預設路由來完成這一切。在 `app-routing.module.ts` 檔案中，以下列內容更新 `routes` 陣列：

<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" id="app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts"></code-example>

前兩條路徑是前往 `CustomersModule` 與 `OrdersModule` 的路由。
最後一個條目定義了預設路由。空路徑會比對所有與先前路徑不符的路徑。


### 功能模組內部

接著，看看 `customers.module.ts` 檔案。如果你使用 CLI 並遵循本頁列出的步驟，你不需要在這裡做任何事。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" id="customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts"></code-example>

`customers.module.ts` 檔案匯入了 `customers-routing.module.ts` 與 `customers.component.ts` 檔案。`CustomersRoutingModule` 列在 `@NgModule` 的 `imports` 陣列中，讓 `CustomersModule` 能存取它自己的路由模組。`CustomersComponent` 在 `declarations` 陣列中，這表示 `CustomersComponent` 屬於 `CustomersModule`。


接著，`app-routing.module.ts` 使用 JavaScript 的動態匯入，匯入功能模組 `customers.module.ts`。

功能專屬的路由定義檔案 `customers-routing.module.ts`，會匯入定義在 `customers.component.ts` 檔案中的它自己的功能元件，以及其他 JavaScript 匯入敘述。它將空路徑對應到 `CustomersComponent`。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" id="customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts"></code-example>

這裡的 `path` 設為空字串，因為 `AppRoutingModule` 中的路徑已經設為 `customers`，所以 `CustomersRoutingModule` 中的這條路由已經在 `customers` 脈絡之內。此路由模組中的每條路由都是子路由。

另一個功能模組的路由模組也以類似方式設定。

<code-example path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" id="orders-routing.module.ts" region="orders-routing-module-detail" header="src/app/orders/orders-routing.module.ts (excerpt)"></code-example>

### 驗證延遲載入

你可以使用 Chrome 開發人員工具，查看模組是否確實是延遲載入的。在 Chrome 中，按 Mac 的 `Cmd+Option+i` 或 PC 的 `Ctrl+Shift+j` 開啟開發人員工具，然後前往 Network 頁籤。

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/network-tab.png" width="600" alt="延遲載入模組圖">
</div>


點選 Orders 或 Customers 按鈕。如果你看到一個區塊（chunk）出現，表示一切都已正確連接，功能模組正在延遲載入。Orders 與 Customers 各會出現一個區塊，而且每個只會出現一次。


<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/chunk-arrow.png" width="600" alt="延遲載入模組圖">
</div>


若要再次看到它，或在專案中作業後測試，點選 Network 分頁左上角那個帶有一條線的圓圈，清除所有內容：

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/clear.gif" width="200" alt="延遲載入模組圖">
</div>


然後依你的平台，按 `Cmd+r` 或 `Ctrl+r` 重新載入。

## `forRoot()` 與 `forChild()`

你可能已經注意到，CLI 將 `RouterModule.forRoot(routes)` 加入了 `AppRoutingModule` 的 `imports` 陣列。
這讓 Angular 知道 `AppRoutingModule` 是一個路由模組，而 `forRoot()` 指定這是根路由模組。
它設定你傳入的所有路由，讓你能存取路由器指令，並註冊 `Router` 服務。
在應用程式中只在 `AppRoutingModule` 內使用一次 `forRoot()`。

CLI 也將 `RouterModule.forChild(routes)` 加入功能路由模組。
如此一來，Angular 知道這份路由清單只負責提供額外的路由，旨在供功能模組使用。
你可以在多個模組中使用 `forChild()`。

`forRoot()` 方法負責 Router 的*全域*注入器設定。
`forChild()` 方法沒有注入器設定。它使用 `RouterOutlet` 與 `RouterLink` 等指令。
更多資訊，請見[單例服務](guide/singleton-services)指南中的 [`forRoot()` pattern](guide/singleton-services#forRoot) 章節。

{@a preloading}

## 預載入

預載入會在背景載入應用程式的部分內容，藉此改善使用者體驗。
你可以預載入模組或元件資料。

### 預載入模組

預載入模組會在背景載入應用程式的部分內容，藉此改善使用者體驗，讓使用者在啟用某條路由時，不需要等待元素下載。

若要啟用所有延遲載入模組的預載入，請從 Angular `router` 匯入 `PreloadAllModules` 權杖。

<code-example header="AppRoutingModule (excerpt)">

import { PreloadAllModules } from '@angular/router';

</code-example>

仍在 `AppRoutingModule` 中，於 `forRoot()` 指定你的預先載入策略。

<code-example header="AppRoutingModule (excerpt)">

RouterModule.forRoot(
  appRoutes,
  {
    preloadingStrategy: PreloadAllModules
  }
)

</code-example>

### 預載入元件資料

若要預載入元件資料，你可以使用 `resolver`。
解析器（resolver）會封鎖頁面載入，直到完整顯示頁面所需的所有資料都可用，藉此改善使用者體驗。

#### 解析器

建立一個解析器服務。
使用 CLI 時，產生服務的指令如下：


<code-example language="none" class="code-shell">
  ng generate service <service-name>
</code-example>

在你的服務中，匯入以下路由成員、實作 `Resolve`，並注入 `Router` 服務：

<code-example header="Resolver service (excerpt)">

import { Resolve } from '@angular/router';

...

export class CrisisDetailResolverService implements Resolve<> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<> {
    // your logic goes here
  }
}

</code-example>

將此解析器匯入你的模組的路由模組。

<code-example header="Feature module's routing module (excerpt)">

import { YourResolverService }    from './your-resolver.service';

</code-example>

在元件的 `route` 設定中加入一個 `resolve` 物件。

<code-example header="Feature module's routing module (excerpt)">
{
  path: '/your-path',
  component: YourComponent,
  resolve: {
    crisis: YourResolverService
  }
}
</code-example>


在元件中，使用 `Observable` 從 `ActivatedRoute` 取得資料。


<code-example header="Component (excerpt)">
ngOnInit() {
  this.route.data
    .subscribe((your-parameters) => {
      // your data-specific code goes here
    });
}
</code-example>

關於更多資訊與可運作的範例，請見[路由教學中關於預先載入的一節](guide/router-tutorial-toh#預先載入在背景載入功能區)。


<hr>

## 更多關於 NgModules 與路由

你可能也會對下列內容感興趣：
* [路由與導覽](guide/router)。
* [提供者](guide/providers)。
* [功能模組的類型](guide/module-types)。
* [Angular 中的路由層級程式碼分割](https://web.dev/route-level-code-splitting-in-angular/)
* [Angular 中的路由預先載入策略](https://web.dev/route-preloading-in-angular/)
