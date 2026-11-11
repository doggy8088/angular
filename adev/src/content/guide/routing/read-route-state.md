# 讀取路由狀態

Angular Router 讓你能讀取並使用與路由相關聯的資訊，藉此建立反應敏捷且具上下文感知能力的元件。

## 透過 ActivatedRoute 取得目前路由的資訊 {#get-information-about-the-current-route-with-activatedroute}

`ActivatedRoute` 是來自 `@angular/router` 的服務，提供與目前路由相關聯的全部資訊。

```angular-ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
})
export class ProductComponent {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute);
  }
}
```

`ActivatedRoute` 能提供關於路由的各種不同資訊，一些常見的屬性包括：

| Property      | Details                                                                                                                           |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------- |
| `url`         | 路由路徑的 `Observable`，以字串陣列表示路徑的每個部分。                                                           |
| `data`        | 一個 `Observable`，包含為該路由提供的 `data` 物件，也包含解析守衛所解析出的任何值。                                               |
| `params`      | 一個 `Observable`，包含該路由特有的必要與選擇性參數。                                                                             |
| `queryParams` | 一個 `Observable`，包含所有路由皆可使用的查詢參數。                                                                               |

請參閱 [`ActivatedRoute` API 文件](/api/router/ActivatedRoute)，取得你可以透過路由存取之內容的完整清單。

## 了解路由快照 {#understanding-route-snapshots}

頁面導覽是隨著時間發生的事件，你可以擷取路由快照，來存取 Router 在某個時間點的狀態。

路由快照包含關於路由的必要資訊，包括它的參數、資料與子路由。此外，快照是靜態的，不會反映未來的變化。

以下是如何存取路由快照的範例：

```angular-ts
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({ ... })
export class UserProfileComponent {
  readonly userId: string;
  private route = inject(ActivatedRoute);

  constructor() {
    // Example URL: https://www.angular.dev/users/123?role=admin&status=active#contact

    // Access route parameters from snapshot
    this.userId = this.route.snapshot.paramMap.get('id');

    // Access multiple route elements
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url,           // https://www.angular.dev
      // Route parameters object: {id: '123'}
      params: snapshot.params,
      // Query parameters object: {role: 'admin', status: 'active'}
      queryParams: snapshot.queryParams,  // Query parameters
    });
  }
}
```

請參閱 [`ActivatedRoute` API 文件](/api/router/ActivatedRoute) 與 [`ActivatedRouteSnapshot` API 文件](/api/router/ActivatedRouteSnapshot)，取得你可以存取之所有屬性的完整清單。

## 讀取路由上的參數

開發者可以從路由利用兩種類型的參數：路由參數與查詢參數。

### 路由參數

路由參數讓你能透過 URL 將資料傳遞給元件。當你想根據 URL 中的識別碼（例如使用者 ID 或產品 ID）來顯示特定內容時，這非常有用。

你可以透過在參數名稱前加上冒號（`:`），來[定義路由參數](/guide/routing/define-routes#define-url-paths-with-route-parameters)。

```angular-ts
import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: 'product/:id', component: ProductComponent }
];
```

你可以訂閱 `route.params` 來存取參數。

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Product Details: {{ productId() }}</h1>`,
})
export class ProductDetailComponent {
  productId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Access route parameters
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }
}
```

### 查詢參數 {#query-parameters}

[查詢參數](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 提供了一種靈活的方式，透過 URL 傳遞選擇性資料，而不會影響路由結構。與路由參數不同，查詢參數可以在多次導覽事件之間持續存在，非常適合處理篩選、排序、分頁，以及其他具狀態性的 UI 元素。

```angular-ts
// Single parameter structure
// /products?category=electronics
router.navigate(['/products'], {
  queryParams: { category: 'electronics' }
});

// Multiple parameters
// /products?category=electronics&sort=price&page=1
router.navigate(['/products'], {
  queryParams: {
    category: 'electronics',
    sort: 'price',
    page: 1
  }
});
```

你可以使用 `route.queryParams` 來存取查詢參數。

以下是一個 `ProductListComponent` 的範例，它會更新影響其產品清單顯示方式的查詢參數：

```angular-ts
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <select (change)="updateSort($event)">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <!-- Products list -->
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Access query parameters reactively
    this.route.queryParams.subscribe(params => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    // Update URL with new query parameter
    this.router.navigate([], {
      queryParams: { sort },
      queryParamsHandling: 'merge' // Preserve other query parameters
    });
  }
}
```

在這個範例中，使用者可以使用下拉選單，依名稱或價格排序產品清單。與其相關聯的變更處理常式會更新 URL 的查詢參數，進而觸發變更事件，藉此讀取更新後的查詢參數，並更新產品清單。

如需更多資訊，請參閱 [QueryParamsHandling 的官方文件](/api/router/QueryParamsHandling)。

### 矩陣參數 {#matrix-parameters}

矩陣參數是屬於特定 URL 區段的選擇性參數，而不是套用到整個路由。與出現在 `?` 之後並全域套用的查詢參數不同，矩陣參數使用分號（`;`），且只套用到個別的路徑區段。

矩陣參數非常適合在不影響路由定義或比對行為的情況下，將輔助資料傳遞給特定的路由區段。與查詢參數一樣，它們不需要在你的路由設定中定義。

```ts
// URL format: /path;key=value
// Multiple parameters: /path;key1=value1;key2=value2

// Navigate with matrix parameters
this.router.navigate(['/awesome-products', { view: 'grid', filter: 'new' }]);
// Results in URL: /awesome-products;view=grid;filter=new
```

**使用 ActivatedRoute**

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component(/* ... */)
export class AwesomeProducts  {
  private route = inject(ActivatedRoute);

  constructor() {
    // Access matrix parameters via params
    this.route.params.subscribe((params) => {
      const view = params['view']; // e.g., 'grid'
      const filter = params['filter']; // e.g., 'new'
    });
  }
}
```

NOTE: 除了使用 `ActivatedRoute` 之外，當使用 `withComponentInputBinding` 時，矩陣參數也會綁定到元件輸入上。

## 使用 RouterLinkActive 偵測目前啟用的路由 {#detect-active-current-route-with-routerlinkactive}

你可以使用 `RouterLinkActive` 指令，根據目前啟用的路由，動態地為導覽元素套用樣式。這在導覽元素中很常見，用來通知使用者目前啟用的是哪個路由。

```angular-html
<nav>
  <a class="button"
     routerLink="/about"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    About
  </a> |
  <a class="button"
     routerLink="/settings"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    Settings
  </a>
</nav>
```

在這個範例中，當 URL 與對應的 `routerLink` 相符時，Angular Router 會將 `active-button` 類別套用到正確的錨點連結上，並將 `ariaCurrentWhenActive` 設定為 `page`。

如果你需要在單一元素上加入多個類別，你可以使用以空格分隔的字串，或使用陣列：

```angular-html
<!-- Space-separated string syntax -->
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>

<!-- Array syntax -->
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
```

當你為 `routerLinkActive` 指定值時，你同時也為 `ariaCurrentWhenActive` 定義了相同的值。這能確保視覺障礙使用者（他們可能無法察覺所套用的不同樣式）也能辨識出目前啟用的按鈕。

若你想為 aria 定義不同的值，你需要使用 `ariaCurrentWhenActive` 指令明確設定該值。

### 路由比對策略

在預設情況下，`RouterLinkActive` 會將路由中的任何祖先都視為相符。

```angular-html
<a [routerLink]="['/user/jane']" routerLinkActive="active-link">
  User
</a>
<a [routerLink]="['/user/jane/role/admin']" routerLinkActive="active-link">
  Role
</a>
```

當使用者造訪 `/user/jane/role/admin` 時，兩個連結都會帶有 `active-link` 類別。

### 只在精確符合路由時才套用 RouterLinkActive

如果你只想在精確相符時才套用該類別，你需要為 `routerLinkActiveOptions` 指令提供一個設定物件，其中包含 `exact: true` 這個值。

```angular-html
<a [routerLink]="['/user/jane']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  User
</a>
<a [routerLink]="['/user/jane/role/admin']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  Role
</a>
```

如果你想更精確地控制路由的比對方式，值得注意的是，`exact: true` 其實是整套比對選項的語法糖衣：

```angular-ts
// `exact: true` is equivalent to
{
  paths: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'exact',
}

// `exact: false` is equivalent
{
  paths: 'subset',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'subset',
}
```

如需更多資訊，請參閱 [isActiveMatchOptions 的官方文件](/api/router/IsActiveMatchOptions)。

### 將 RouterLinkActive 套用到祖先元素上

RouterLinkActive 指令也可以套用到祖先元素上，讓開發者能隨心所欲地為其中的元素套用樣式。

```angular-html
<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>
```

如需更多資訊，請參閱 [RouterLinkActive 的 API 文件](/api/router/RouterLinkActive)。
