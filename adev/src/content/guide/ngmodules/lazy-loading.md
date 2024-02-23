# 延遲載入功能模組

預設情況下，NgModules 會被急切載入。這表示當應用程式載入時，所有 NgModules 也會載入，無論它們是否立即需要。
對於具有大量路由的大型應用程式，請考慮採用延遲載入，這是一種在需要時載入 NgModules 的設計模式。
延遲載入有助於減小初始套件大小，進而有助於減少載入時間。

<!-- 有關此頁面所述兩個延遲載入模組的最終範例應用程式： -->

<!-- TODO：連結至 GitHub -->

<!-- <docs-code live/> -->

## 延遲載入基礎知識

本節介紹配置延遲載入路由的基本程序。
有關逐步範例，請參閱此頁面上的 [逐步設定](#step-by-step-setup) 部分。

若要延遲載入 Angular 模組，請在 `AppRoutingModule` `routes` 組態中使用 `loadChildren`（取代 `component`），如下所示。

<docs-code header="AppRoutingModule (excerpt)" language="typescript">

const routes: Routes = [
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
  }
];

</docs-code>

在延遲載入模組的路由模組中，為元件新增路由。

<docs-code header="Routing module for lazy loaded module (excerpt)" language="typescript">

const routes: Routes = [
  {
    path: '',
    component: ItemsComponent
  }
];

</docs-code>

同時務必將 `ItemsModule` 從 `AppModule` 中移除。
若要了解延遲載入模組的分步說明，請繼續閱讀本頁的以下各節。

## 步驟式設定

設定一個延遲載入的功能模組需要兩個主要的步驟：

1. 使用 `--route` 旗標，透過 Angular CLI 建立功能模組。
1. 設定路由。

### 設定應用程式

如果您還沒有應用程式，請遵照以下步驟使用 Angular CLI 建立一個應用程式。
如果您已經有應用程式，請跳至 [設定路徑](#config-routes)。

在 `customer-app` 是你的應用程式名稱的地方，輸入下列指令：

<docs-code language="shell">

ng new customer-app --no-standalone --routing

</docs-code>

這會建立一個名為 `customer-app` 的應用程式，`--no-standalone` 標記讓應用程式以模組為基礎，而 `--routing` 標記會產生一個名為 `app-routing.module.ts` 的檔案。
這是設定功能模組延遲載入所需的其中一個檔案。
透過下達 `cd customer-app` 指令來導航至專案。

### 使用路由建立功能模組

接下來，您需要一個帶有要導向到的元件的功能模組。
要建立一個，請在命令列工具中輸入以下命令，其中 `customers` 是功能模組的名稱。
載入 `customers` 功能模組的路徑也是 `customers`，因為它使用 `--route` 選項指定：

<docs-code language="shell">

ng generate module customers --route customers --module app.module

</docs-code>

這會建立一個 `customers` 目錄，其中包含在 `customers.module.ts` 檔案中定義的新惰性可載入功能模組 `CustomersModule`，以及在 `customers-routing.module.ts` 檔案中定義的路由模組 `CustomersRoutingModule`。
此命令會自動在新的功能模組內宣告 `CustomersComponent` 並匯入 `CustomersRoutingModule`。

因為新模組可延遲載入，所以指令 **不會** 在應用程式的根模組檔案 `app.module.ts` 中新增對它的參照。
相反地，它會將已宣告的路由 `customers` 新增到在提供 `--module` 選項的模組中宣告的 `routes` 陣列。

<docs-code header="src/app/app-routing.module.ts" language="typescript">
const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
  }
];
</docs-code>

請注意延遲載入語法使用 `loadChildren` 後接一個使用瀏覽器內建 `import('...')` 語法進行動態匯入的函式。
匯入路徑是相對於模組的相對路徑。

<docs-callout title="基於字串的延遲載入">

在 Angular 版本 8 中，`loadChildren` 路徑規範的字串語法已棄用，取而代之的是 `import()` 語法。
您可以選擇使用基於字串的延遲載入 (`loadChildren: './path/to/module#Module'`)，方法是在您的 `tsconfig` 檔案中包含延遲載入的路由，其中包含編譯中的延遲載入檔案。

預設情況下，Angular CLI 會產生包含更嚴格檔案的專案，供與 `import()` 語法搭配使用。

</docs-callout>

### 加入另一個功能模組

使用相同的指令建立第二個具有路由的延遲載入功能模組，並加上 stub 元件。

<docs-code language="shell">

ng generate module orders --route orders --module app.module

</docs-code>

這會建立一個新的目錄，稱為 `orders`，其中包含 `OrdersModule` 和 `OrdersRoutingModule`，以及新的 `OrdersComponent` 原始檔。
使用延遲載入語法將 `orders` 路由（使用 `--route` 選項指定）新增到 `app-routing.module.ts` 檔案中的 `routes` 陣列。

<docs-code header="src/app/app-routing.module.ts" language="typescript" highlight="[6,7,8,9]">
const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  }
];
</docs-code>

### 建立 UI

雖然你可以將網址輸入位址列中，但導覽 UI 對使用者來說很簡單，也更為常見。
用自訂導覽取代 `app.component.html` 中的預設 placeholder 標記，如此一來你就能在瀏覽器中導覽你的模組：

<docs-code header="src/app/app.component.html" language="html" highlight="[4,5,6]">
<h1>
  {{title}}
</h1>
<button type="button" routerLink="/customers">Customers</button>
<button type="button" routerLink="/orders">Orders</button>
<button type="button" routerLink="">Home</button>
<router-outlet></router-outlet>
</docs-code>

要查看目前在瀏覽器中的應用程式，請在命令列工具視窗中輸入以下指令：

<docs-code language="shell">

ng serve

</docs-code>

然後前往 `localhost:4200`，您應該會看到「customer-app」和三個按鈕。

<img alt="瀏覽器中的三個按鈕" src="https://angular.dev/assets/images/guide/modules/lazy-loading-three-buttons.png" width="300">

這些按鈕有效運作，因為 Angular CLI 自動將功能模組的路由新增到 `app-routing.module.ts` 中的 `routes` 陣列。

### 匯入和路由配置

Angular CLI 會自動將每個功能模組新增到應用程式層級的路由映射。
透過新增預設路由完成此動作。
在 `app-routing.module.ts` 檔案中，以下列內容更新 `routes` 陣列：

<docs-code header="src/app/app-routing.module.ts" language="typescript">
const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
</docs-code>

前兩個路徑是 `CustomersModule` 和 `OrdersModule` 的路由。
最後一個項目定義了預設路由。
空路徑符合任何與先前路徑不符的內容。

### 在功能模組內

接下來，請看看 `customers.module.ts` 檔案。
如果您使用 Angular CLI 並且依照此頁面中概述的步驟進行，您無須在此處執行任何操作。

<docs-code header="src/app/customers/customers.module.ts" language="typescript">
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';

@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule
  ],
  declarations: [CustomersComponent]
})
export class CustomersModule { }
</docs-code>

`customers.module.ts` 檔案匯入 `customers-routing.module.ts` 與 `customers.component.ts` 檔案。
`CustomersRoutingModule` 列在 `@NgModule` `imports` 陣列中，讓 `CustomersModule` 可以存取自己的路由模組。
`CustomersComponent` 位於 `declarations` 陣列中，這表示 `CustomersComponent` 屬於 `CustomersModule`。

然後，`app-routing.module.ts` 使用 JavaScript 的動態匯入匯入功能模組 `customers.module.ts`。

特定於功能的路由定義檔案 `customers-routing.module.ts` 匯入它自己定義在 `customers.component.ts` 檔案中的功能元件，連同其他 JavaScript 匯入陳述。
然後它將空路徑對應到 `CustomersComponent`。

<docs-code header="src/app/customers/customers-routing.module.ts" language="typescript"
           highlight="[8,9]">
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersComponent } from './customers.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
</docs-code>

此處的 `path` 設為空字串，因為 `AppRoutingModule` 中的路徑已設為 `customers`，因此 `CustomersRoutingModule` 中的這個路由已在 `customers` 的內容中。
此路由模組中的每個路由都是子路由。

其他功能模組的路由模組配置類似。

<docs-code header="src/app/orders/orders-routing.module.ts (excerpt)" language="typescript">
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent
  }
];
</docs-code>

### 驗證延遲載入

您可以使用 Chrome 開發人員工具驗證模組是否確實是延遲載入。
在 Chrome 中，按一下 Mac 上的 <kbd>⌘ Cmd</kbd>+<kbd>Option</kbd>+<kbd>i</kbd> 或 PC 上的 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>j</kbd> 開啟開發人員工具，然後前往「網路」索引標籤。

<img alt="延遲載入模組圖示" src="https://angular.dev/assets/images/guide/modules/lazy-loading-network-tab.png" width="600">

點擊「訂單」或「客戶」按鈕。
如果您看到區塊出現，一切均已正確連接，且功能模組正在延遲載入。
區塊應出現在「訂單」和「客戶」中，但每個只出現一次。

<img alt="延遲載入模組圖表" src="https://angular.dev/assets/images/guide/modules/lazy-loading-chunk-arrow.png" width="600">

如要再看一次，或在做出變更後測試，請按一下網路標籤左上角的帶有斜線的圓圈：

<img alt="延遲載入模組圖" src="https://angular.dev/assets/images/guide/modules/lazy-loading-clear.gif" width="200">

然後使用 <kbd>⌘ Cmd</kbd>+<kbd>R</kbd> 或 <kbd>Ctrl</kbd>+<kbd>R</kbd> 重新載入，視您的平台而定。

## `forRoot()` 和 `forChild()`

您可能注意到 Angular CLI 將 `RouterModule.forRoot(routes)` 新增至 `AppRoutingModule` `imports` 陣列中。
這讓 Angular 知道 `AppRoutingModule` 是路由模組，而 `forRoot()` 則指定這是根路由模組。
它會設定您傳遞給它的所有路由，讓您存取路由器指令，並註冊 `Router` 服務。
在 `AppRoutingModule` 中，僅在應用程式內使用 `forRoot()` 一次。

Angular CLI 也會將 `RouterModule.forChild(routes)` 新增至功能路由模組。
這樣，Angular 便知道路由清單僅負責提供額外的路由，並用於功能模組。
您可以在多個模組中使用 `forChild()`。

`forRoot()` 方法負責路由器的 *全域* 注入器設定。
`forChild()` 方法沒有注入器設定。
它使用指令，例如 `RouterOutlet` 和 `RouterLink`。
如需更多資訊，請參閱單一服務指南的 [`forRoot()` 模式](guide/ngmodules/singleton-services#forRoot) 區段。

## 預載

預載透過背景載入應用程式部分來改善 UX。
您可以預載模組、獨立元件或元件資料。

### 預載入模組和獨立元件

預先載入模組和獨立元件可讓您的應用程式在背景中載入部份內容，藉此改善 UX。這樣一來，當使用者啟用路由時，就不用等待元素下載。

為了啟用所有延遲載入模組和獨立元件的預載，請從 Angular `router` 匯入 `PreloadAllModules` 標記。

### 基於模組的應用程式

<docs-code header="AppRoutingModule (excerpt)" language="typescript">

import { PreloadAllModules } from '@angular/router';

</docs-code>

然後，在 `AppRoutingModule` 的 `RouterModule.forRoot()` 呼叫中指定您的預載入策略。

<docs-code header="AppRoutingModule (excerpt)" language="typescript" highlight="[4]">
RouterModule.forRoot(
  appRoutes,
  {
    preloadingStrategy: PreloadAllModules
  }
)
</docs-code>

### 獨立應用程式

對於獨立應用程式，透過在 `app.config.ts` 中將 `withPreloading` 加入 `provideRouter` 的 RouterFeatures 來設定預載入策略

<docs-code header="app.config.ts" language="typescript" highlight="[3,5,14]">
import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),
  ],
};
</docs-code>

### 預先載入元件資料

若要預載元件資料，請使用 `resolver`。
Resolvers 透過在所有必要的資料都可供完整顯示頁面之前封鎖頁面載入來改善 UX。

#### 解析器

建立一個解析器服務。
使用 Angular CLI，建立服務的指令如下：

<docs-code language="shell">
ng generate service <service-name>
</docs-code>

在新建的服務中，實作由 `@angular/router` 套件提供的 `Resolve` 介面：

<docs-code header="Resolver service (excerpt)" language="typescript">

import { Resolve } from '@angular/router';

&hellip;

/*An interface that represents your data model*/
export interface Crisis {
  id: number;
  name: string;
}

export class CrisisDetailResolverService implements Resolve&lt;Crisis&gt; {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable&lt;Crisis&gt; {
    // your logic goes here
  }
}

</docs-code>

將此解析器匯入至您的模組路由模組中。

<docs-code header="Feature module's routing module (excerpt)" language="typescript">

import { CrisisDetailResolverService } from './crisis-detail-resolver.service';

</docs-code>

將 `resolve` 物件新增到元件的 `route` 組態。

<docs-code header="Feature module's routing module (excerpt)" language="typescript"
           highlight="[4,5,6]">
{
  path: '/your-path',
  component: YourComponent,
  resolve: {
    crisis: CrisisDetailResolverService
  }
}
</docs-code>

在元件的建構函式中，注入一個代表目前路由的 `ActivatedRoute` 類別實例。

<docs-code header="Component's constructor (excerpt)">
import { ActivatedRoute } from '@angular/router';

@Component({ &hellip; })
class YourComponent {
  constructor(private route: ActivatedRoute) {}
}
</docs-code>

使用注入的 `ActivatedRoute` 類別實例存取與指定路徑相關的 `data`。

<docs-code header="Component's ngOnInit lifecycle hook (excerpt)" language="typescript"
           highlight="[1,5,8]">
import { ActivatedRoute } from '@angular/router';

@Component({ &hellip; })
class YourComponent {
  constructor(private route: ActivatedRoute) {}

ngOnInit() {
    this.route.data
      .subscribe(data => {
        const crisis: Crisis = data.crisis;
        // &hellip;
      });
  }
}
</docs-code>

## 疑難排解延遲載入模組

在延遲載入模組時的一個常見錯誤是，在應用程式中的多個位置匯入共用模組。
首先，使用 Angular CLI 並包含 `--route route-name` 參數來產生模組，測試此狀況，其中 `route-name` 是模組的名稱。
接下來，建立不帶有 `--route` 參數的模組。
如果帶有 `--route` 參數的 `ng generate module` 傳回錯誤，但沒有該參數則可以正確執行，您可能在多個位置匯入了相同的模組。

請記住，應在應用程式基礎處匯入許多常見的 Angular 模組。

有關 Angular 模組的更多資訊，請參閱 [NgModules](/guide/ngmodules)。

## 關於 NgModules 和路由的更多資訊

您可能也有興趣：

* [路由和導航](guide/routing)
* [提供者](guide/ngmodules/providers)
* [功能模組類型](guide/ngmodules/module-types)
* [Angular 中的路由級別程式碼拆分](https://web.dev/route-level-code-splitting-in-angular)
* [Angular 中的路線預載入策略](https://web.dev/route-preloading-in-angular)
