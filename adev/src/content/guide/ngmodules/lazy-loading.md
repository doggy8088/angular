# 延遲載入功能模組

預設情況下，NgModule 是及早載入的。這表示應用程式一載入，所有的 NgModule 也會載入，無論它們是否立即需要。
對於具有大量路由的大型應用程式，請考慮延遲載入——這是一種依需要載入 NgModule 的設計模式。
延遲載入有助於保持初始套件大小較小，進而有助於減少載入時間。

<!-- For the final sample application with two lazy-loaded modules that this page describes: -->
<!-- TODO: link to GitHub -->
<!-- <docs-code live/> -->

## 延遲載入基礎 {#lazy-loading-basics}

本節介紹設定延遲載入路由的基本程序。
逐步範例請見本頁的[逐步設定](#step-by-step-setup)章節。

若要延遲載入 Angular 模組，請在你的 `AppRoutingModule` `routes` 設定中使用 `loadChildren`（而不是 `component`），如下所示。

<docs-code header="AppRoutingModule (excerpt)" language="typescript">

const routes: Routes = [
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
  }
];

</docs-code>

在延遲載入模組的路由模組中，為該元件加入一條路由。

<docs-code header="Routing module for lazy loaded module (excerpt)" language="typescript">

const routes: Routes = [
  {
    path: '',
    component: ItemsComponent
  }
];

</docs-code>

同時務必將 `ItemsModule` 從 `AppModule` 中移除。
延遲載入模組的逐步指示，請繼續閱讀本頁的下列章節。

## 逐步設定 {#step-by-step-setup}

設定延遲載入功能模組需要兩個主要步驟：

1. 使用 Angular CLI 並帶上 `--route` 旗標，建立功能模組。
1. 設定路由。

### 設定應用程式 {#set-up-an-application}

如果你還沒有應用程式，請依照下列步驟使用 Angular CLI 建立一個。
如果你已經有應用程式，請跳至[設定路由](#imports-and-route-configuration)。

在下列指令中輸入你的應用程式名稱（此處為 `customer-app`）：

<docs-code language="shell">

ng new customer-app --no-standalone --routing

</docs-code>

這會建立一個名為 `customer-app` 的應用程式，`--no-standalone` 旗標使應用程式採模組架構，`--routing` 旗標則產生一個名為 `app-routing.module.ts` 的檔案。
這是為功能模組設定延遲載入所需的檔案之一。
執行指令 `cd customer-app` 進入專案。

### 建立帶有路由的功能模組 {#create-a-feature-module-with-routing}

接著，你需要一個帶有可路由元件的功能模組。
若要建立它，請在命令列工具中輸入下列指令，其中 `customers` 是功能模組的名稱。
載入 `customers` 功能模組的路徑也是 `customers`，因為它是用 `--route` 選項指定的：

<docs-code language="shell">

ng generate module customers --route customers --module app.module

</docs-code>

這會建立一個 `customers` 目錄，其中包含定義在 `customers.module.ts` 檔案中的新可延遲載入功能模組 `CustomersModule`，以及定義在 `customers-routing.module.ts` 檔案中的路由模組 `CustomersRoutingModule`。
該指令會自動宣告 `CustomersComponent`，並在新功能模組內匯入 `CustomersRoutingModule`。

因為新模組旨在延遲載入，該指令**不會**在應用程式的根模組檔案 `app.module.ts` 中加入對它的參照。
相反地，它會將宣告的路由 `customers` 加入 `--module` 選項指定的模組中所宣告的 `routes` 陣列。

<docs-code header="src/app/app-routing.module.ts" language="typescript">
const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
  }
];
</docs-code>

注意，延遲載入的語法使用 `loadChildren`，後面跟著一個使用瀏覽器內建 `import('...')` 動態匯入語法的函式。
匯入路徑是該模組的相對路徑。

<docs-callout title="String-based lazy loading">

在 Angular 第 8 版中，`loadChildren` 路由規格的字串語法已被棄用，改用 `import()` 語法。
你可以將延遲載入的路由包含在你的 `tsconfig` 檔案中，讓編譯納入這些延遲載入的檔案，藉此選用字串式延遲載入（`loadChildren: './path/to/module#Module'`）。

預設情況下，Angular CLI 產生的專案具有較嚴格的檔案包含規則，旨在搭配 `import()` 語法使用。

</docs-callout>

### 再加入一個功能模組 {#add-another-feature-module}

使用相同的指令，建立第二個帶有路由的延遲載入功能模組，以及其存根元件。

<docs-code language="shell">

ng generate module orders --route orders --module app.module

</docs-code>

這會建立一個名為 `orders` 的新目錄，其中包含 `OrdersModule` 與 `OrdersRoutingModule`，以及新的 `OrdersComponent` 原始檔。
以 `--route` 選項指定的 `orders` 路由，會使用延遲載入語法，加入 `app-routing.module.ts` 檔案內的 `routes` 陣列。

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

### 設定 UI {#set-up-the-ui}

雖然你可以在網址列輸入 URL，但導覽 UI 對使用者來說更直接，也更常見。
將 `app.component.html` 中的預設佔位標記，替換為自訂導覽，讓你可以在瀏覽器中導覽至你的模組：

<docs-code header="src/app/app.component.html" language="html" highlight="[4,5,6]">
<h1>
  {{title}}
</h1>
<button type="button" routerLink="/customers">Customers</button>
<button type="button" routerLink="/orders">Orders</button>
<button type="button" routerLink="">Home</button>
<router-outlet></router-outlet>
</docs-code>

若要查看目前為止的應用程式在瀏覽器中的樣子，請在命令列工具視窗中輸入下列指令：

<docs-code language="shell">

ng serve

</docs-code>

接著前往 `localhost:4200`，你應該會看到「customer-app」與三個按鈕。

<img alt="three buttons in the browser" src="assets/images/guide/modules/lazy-loading-three-buttons.png" width="300">

這些按鈕可以運作，因為 Angular CLI 已自動將功能模組的路由加入 `app-routing.module.ts` 的 `routes` 陣列。

### 匯入與路由設定 {#imports-and-route-configuration}

Angular CLI 已自動在應用程式層級將每個功能模組加入路由對應表。
最後，加入預設路由來完成這一切。
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

前兩條路徑是前往 `CustomersModule` 與 `OrdersModule` 的路由。
最後一個條目定義了預設路由。
空路徑會比對所有與先前路徑不符的路徑。

### 功能模組內部 {#inside-the-feature-module}

接著，看看 `customers.module.ts` 檔案。
如果你使用 Angular CLI 並遵循本頁列出的步驟，你不需要在這裡做任何事。

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

`customers.module.ts` 檔案匯入了 `customers-routing.module.ts` 與 `customers.component.ts` 檔案。
`CustomersRoutingModule` 列在 `@NgModule` 的 `imports` 陣列中，讓 `CustomersModule` 能存取它自己的路由模組。
`CustomersComponent` 在 `declarations` 陣列中，這表示 `CustomersComponent` 屬於 `CustomersModule`。

接著，`app-routing.module.ts` 使用 JavaScript 的動態匯入，匯入功能模組 `customers.module.ts`。

功能專屬的路由定義檔案 `customers-routing.module.ts`，會匯入定義在 `customers.component.ts` 檔案中的它自己的功能元件，以及其他 JavaScript 匯入敘述。
接著它將空路徑對應到 `CustomersComponent`。

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

這裡的 `path` 設為空字串，因為 `AppRoutingModule` 中的路徑已經設為 `customers`，所以 `CustomersRoutingModule` 中的這條路由已經在 `customers` 脈絡之內。
此路由模組中的每條路由都是子路由。

另一個功能模組的路由模組也以類似方式設定。

<docs-code header="src/app/orders/orders-routing.module.ts (excerpt)" language="typescript">
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent
  }
];
</docs-code>

### 驗證延遲載入 {#verify-lazy-loading}

你可以用 Chrome 開發者工具驗證模組確實被延遲載入。
在 Chrome 中，在 Mac 上按 <kbd>⌘ Cmd</kbd>+<kbd>Option</kbd>+<kbd>i</kbd>，或在 PC 上按 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>j</kbd>，開啟開發者工具，並前往 Network 分頁。

<img alt="lazy loaded modules diagram" src="assets/images/guide/modules/lazy-loading-network-tab.png" width="600">

點選 Orders 或 Customers 按鈕。
如果你看到一個區塊（chunk）出現，表示一切都已正確連接，功能模組正在延遲載入。
Orders 與 Customers 各會出現一個區塊，而且每個只會出現一次。

<img alt="lazy loaded modules diagram" src="assets/images/guide/modules/lazy-loading-chunk-arrow.png" width="600">

若要再次看到它，或在做了變更後測試，點選 Network 分頁左上角那個帶有一條線的圓圈：

<img alt="lazy loaded modules diagram" src="assets/images/guide/modules/lazy-loading-clear.gif" width="200">

接著依你的平台，按 <kbd>⌘ Cmd</kbd>+<kbd>R</kbd> 或 <kbd>Ctrl</kbd>+<kbd>R</kbd> 重新載入。

## `forRoot()` 與 `forChild()` {#forroot-and-forchild}

你可能已經注意到，Angular CLI 將 `RouterModule.forRoot(routes)` 加入了 `AppRoutingModule` 的 `imports` 陣列。
這讓 Angular 知道 `AppRoutingModule` 是一個路由模組，而 `forRoot()` 指定這是根路由模組。
它設定你傳入的所有路由，讓你能存取路由器指令，並註冊 `Router` 服務。
在應用程式中只在 `AppRoutingModule` 內使用一次 `forRoot()`。

Angular CLI 也將 `RouterModule.forChild(routes)` 加入功能路由模組。
如此一來，Angular 知道這份路由清單只負責提供額外的路由，旨在供功能模組使用。
你可以在多個模組中使用 `forChild()`。

`forRoot()` 方法負責 Router 的*全域*注入器設定。
`forChild()` 方法沒有注入器設定。
它使用 `RouterOutlet` 與 `RouterLink` 等指令。
更多資訊，請見 singleton services 指南中的 [`forRoot()` pattern](guide/ngmodules/singleton-services#forRoot) 章節。

## 預載入 {#preloading}

預載入會在背景載入應用程式的部分內容，藉此改善使用者體驗。
你可以預載入模組、獨立元件或元件資料。

### 預載入模組與獨立元件 {#preloading-modules-and-standalone-components}

預載入模組與獨立元件，會在背景載入應用程式的部分內容，藉此改善使用者體驗。如此一來，當使用者啟用某條路由時，就不需要等待元素下載。

若要啟用所有延遲載入模組與獨立元件的預載入，請從 Angular `router` 匯入 `PreloadAllModules` 權杖。

### 以模組為基礎的應用程式 {#module-based-application}

<docs-code header="AppRoutingModule (excerpt)" language="typescript">

import { PreloadAllModules } from '@angular/router';

</docs-code>

接著，在 `AppRoutingModule` 的 `RouterModule.forRoot()` 呼叫中指定你的預載入策略。

<docs-code header="AppRoutingModule (excerpt)" language="typescript" highlight="[4]">
RouterModule.forRoot(
  appRoutes,
  {
    preloadingStrategy: PreloadAllModules
  }
)
</docs-code>

### 獨立應用程式 {#standalone-application}

對於獨立應用程式，請將 `withPreloading` 加入 `app.config.ts` 中 `provideRouter` 的 RouterFeatures，來設定預載入策略

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

### 預載入元件資料 {#preloading-component-data}

若要預載入元件資料，請使用 `resolver`。
解析器（resolver）會封鎖頁面載入，直到完整顯示頁面所需的所有資料都可用，藉此改善使用者體驗。

#### 解析器 {#resolvers}

建立一個解析器服務。
使用 Angular CLI 時，建立服務的指令如下：

<docs-code language="shell">
ng generate service <service-name>
</docs-code>

在新建立的服務中，實作 `@angular/router` 套件提供的 `Resolve` 介面：

<docs-code header="Resolver service (excerpt)" language="typescript">

import { Resolve } from '@angular/router';

…

/*An interface that represents your data model*/
export interface Crisis {
  id: number;
  name: string;
}

export class CrisisDetailResolverService implements Resolve<Crisis> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> {
    // your logic goes here
  }
}

</docs-code>

將此解析器匯入你的模組的路由模組。

<docs-code header="Feature module's routing module (excerpt)" language="typescript">

import { CrisisDetailResolverService } from './crisis-detail-resolver.service';

</docs-code>

在元件的 `route` 設定中加入一個 `resolve` 物件。

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

在元件的建構子中，注入一個代表目前路由的 `ActivatedRoute` 類別實例。

<docs-code header="Component's constructor (excerpt)">
import { ActivatedRoute } from '@angular/router';

@Component({ … })
class YourComponent {
  constructor(private route: ActivatedRoute) {}
}
</docs-code>

使用注入的 `ActivatedRoute` 類別實例，存取與給定路由相關聯的 `data`。

<docs-code header="Component's ngOnInit lifecycle hook (excerpt)" language="typescript"
           highlight="[1,5,8]">
import { ActivatedRoute } from '@angular/router';

@Component({ … })
class YourComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        const crisis: Crisis = data.crisis;
        // …
      });
  }
}
</docs-code>

## 延遲載入模組疑難排解 {#troubleshooting-lazy-loading-modules}

延遲載入模組時一個常見的錯誤，是在應用程式的多個地方匯入常用模組。
若要測試這種情況，首先使用 Angular CLI 產生模組，並包含 `--route route-name` 參數，其中 `route-name` 是你的模組名稱。
接著，在不帶 `--route` 參數的情況下建立該模組。
如果帶 `--route` 參數的 `ng generate module` 回傳錯誤，但不帶參數時能正確執行，你可能已經在多個地方匯入了同一個模組。

請記住，許多常用的 Angular 模組應該在你的應用程式基底處匯入。

關於 Angular 模組的更多資訊，請見 [NgModules](guide/ngmodules)。

## 更多關於 NgModules 與路由 {#more-on-ngmodules-and-routing}

你可能也會對下列內容感興趣：

* [路由與導覽](guide/routing)
* [提供者](guide/ngmodules/providers)
* [功能模組的類型](guide/ngmodules/module-types)
* [Route-level code-splitting in Angular](https://web.dev/route-level-code-splitting-in-angular)
* [Route preloading strategies in Angular](https://web.dev/route-preloading-in-angular)
