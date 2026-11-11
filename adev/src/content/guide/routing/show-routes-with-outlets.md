# 使用 outlet 顯示路由

`RouterOutlet` 指令是一個預留位置，標示路由器應在此處渲染目前 URL 對應的元件。

```angular-html
<app-header />
<router-outlet />  <!-- Angular inserts your route content here -->
<app-footer />
```

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

在本範例中，假設應用程式定義了下列路由：

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Our Products'
  }
];
```

當使用者造訪 `/products` 時，Angular 會渲染下列內容：

```angular-html
<app-header />
<app-products />
<app-footer />
```

若使用者回到首頁，Angular 則會渲染：

```angular-html
<app-header />
<app-home />
<app-footer />
```

顯示路由時，`<router-outlet>` 元素會保留在 DOM 中，作為後續導覽的參照點。Angular 會把路由內容插入在 outlet 元素之後，作為其同層元素。

```angular-html
<!-- Contents of the component's template -->
<app-header />
<router-outlet />
<app-footer />
```

```angular-html
<!-- Content rendered on the page when the user visits /admin -->
<app-header>...</app-header>
<router-outlet></router-outlet>
<app-admin-page>...</app-admin-page>
<app-footer>...</app-footer>
```

## 使用子路由建立巢狀路由

隨著應用程式越來越複雜，你可能會想建立相對於根元件以外元件的路由。這樣一來，URL 改變時只有應用程式的一部分會跟著改變，使用者不會感覺整個頁面都被重新整理。

這類巢狀路由稱為子路由。這表示你要在應用程式中再加入第二個 `<router-outlet>`，因為它是在 AppComponent 的 `<router-outlet>` 之外額外增加的。

在本範例中，`Settings` 元件會依使用者選取的項目顯示對應的面板。子路由的一個特別之處是，該元件通常有自己的 `<nav>` 與 `<router-outlet>`。

```angular-html
<h1>Settings</h1>
<nav>
  <ul>
    <li><a routerLink="profile">Profile</a></li>
    <li><a routerLink="security">Security</a></li>
  </ul>
</nav>
<router-outlet />
```

子路由與其他路由一樣，都需要 `path` 與 `component`。唯一的差別是，子路由要放在父路由內的 children 陣列中。

```ts
const routes: Routes = [
  {
    path: 'settings-component',
    component: SettingsComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'profile', // child route path
        component: ProfileComponent, // child route component that the router renders
      },
      {
        path: 'security',
        component: SecurityComponent, // another child route component that the router renders
      },
    ],
  },
];
```

只要 `routes` 與 `<router-outlet>` 都設定正確，你的應用程式就已經用上巢狀路由了！

## 使用具名 outlet 的次要路由

一個頁面可以有多個 outlet，你可以為每個 outlet 指定名稱，表明哪些內容屬於哪個 outlet。

```angular-html
<app-header />
<router-outlet />
<router-outlet name='read-more' />
<router-outlet name='additional-actions' />
<app-footer />
```

每個 outlet 的名稱必須唯一。名稱無法動態設定或變更。名稱預設為 `'primary'`。

Angular 會把 outlet 的名稱與每條路由上定義的 `outlet` 屬性進行比對：

```ts
{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}
```

## Outlet 生命週期事件

路由器 outlet 可以發出四種生命週期事件：

| 事件         | 說明                                                     |
| ------------ | -------------------------------------------------------- |
| `activate`   | 新元件被實例化時                                         |
| `deactivate` | 元件被銷毀時                                             |
| `attach`     | `RouteReuseStrategy` 指示 outlet 附加子樹時              |
| `detach`     | `RouteReuseStrategy` 指示 outlet 分離子樹時              |

你可以使用標準的事件繫結語法加入事件監聽器：

```angular-html
<router-outlet
  (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'
  (attach)='onAttach($event)'
  (detach)='onDetach($event)'
/>
```

若想深入了解，請參閱 [RouterOutlet 的 API 文件](/api/router/RouterOutlet?tab=api)。

## 把上下文資料傳給路由元件 {#passing-contextual-data-to-routed-components}

把上下文資料傳給路由元件，往往需要全域狀態或複雜的路由設定。為了簡化這件事，每個 `RouterOutlet` 都支援 `routerOutletData` 輸入。路由元件及其子元件可以使用 `ROUTER_OUTLET_DATA` 注入權杖，把這份資料當作訊號讀取，藉此進行 outlet 專屬的設定，而不必修改路由定義。

```angular-ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `
    <h2>Dashboard</h2>
    <router-outlet [routerOutletData]="{ layout: 'sidebar' }" />
  `,
})
export class DashboardComponent {}
```

路由元件可以使用 `ROUTER_OUTLET_DATA` 注入所提供的 outlet 資料：

```angular-ts
import { Component, inject } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';

@Component({
  selector: 'app-stats',
  template: `<p>Stats view (layout: {{ outletData().layout }})</p>`,
})
export class StatsComponent {
  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{ layout: string }>;
}
```

當 Angular 在該 outlet 中啟用 `StatsComponent` 時，它會收到 `{ layout: 'sidebar' }` 作為注入的資料。

NOTE: 未設定 `routerOutletData` 輸入時，注入的值預設為 null。

---

## 後續步驟

了解如何使用 Angular Router [導覽至路由](/guide/routing/navigate-to-routes)。
