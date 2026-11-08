# 定義路由

路由是 Angular 應用程式中導覽的基本組成單位。

## 什麼是路由？

在 Angular 中，**路由**是一個物件，定義了針對特定 URL 路徑或模式應渲染哪個元件，以及使用者導覽到該 URL 時還會發生什麼的其他設定選項。

以下是一個路由的基本範例：

```ts
import {AdminPage} from './app-admin';

const adminPage = {
  path: 'admin',
  component: AdminPage,
};
```

對於這條路由，當使用者造訪 `/admin` 路徑時，應用程式會顯示 `AdminPage` 元件。

### 在應用程式中管理路由

大多數專案把路由定義在一個獨立檔案中，其檔名包含 `routes`。

一組路由看起來像這樣：

```ts
import {Routes} from '@angular/router';
import {HomePage} from './home-page';
import {AdminPage} from './admin-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'admin',
    component: AdminPage,
  },
];
```

TIP: 若你使用 Angular CLI 產生專案，你的路由定義在 `src/app/app.routes.ts`。

### 把路由加入應用程式

在不使用 Angular CLI 引導 Angular 應用程式時，你可以傳入一個包含 `providers` 陣列的設定物件。

在 `providers` 陣列內，你可以呼叫 `provideRouter` 函式並傳入你的路由，把 Angular 路由加入應用程式。

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ],
};
```

## 路由 URL 路徑

### 靜態 URL 路徑

靜態 URL 路徑指的是具有預先定義路徑、不隨動態參數改變的路由。這些路由會精確比對 `path` 字串，並有固定的結果。

這類範例包括：

- "/admin"
- "/blog"
- "/settings/account"

### 使用路由參數定義 URL 路徑

參數化 URL 讓你定義動態路徑，使多個 URL 能通往同一個元件，同時依據 URL 中的參數動態顯示資料。

你可以把參數加入路由的 `path` 字串，並在每個參數前面加上冒號（`:`）字元，來定義這類模式。

IMPORTANT: 參數與 URL 的[查詢字串](https://en.wikipedia.org/wiki/Query_string)中的資訊不同。
如需深入瞭解 Angular 中的查詢參數，請參閱[本指南](/guide/routing/read-route-state#query-parameters)。

下列範例依據透過 URL 傳入的使用者 id，顯示使用者個人資料元件。

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile/user-profile';

const routes: Routes = [{path: 'user/:id', component: UserProfile}];
```

在此範例中，`/user/leeroy` 與 `/user/jenkins` 等 URL 會渲染 `UserProfile` 元件。此元件接著可以讀取 `id` 參數，並用它執行額外的工作，例如擷取資料。讀取路由參數的詳細資訊，請參閱[讀取路由狀態指南](/guide/routing/read-route-state)。

有效的路由參數名稱必須以字母（a-z、A-Z）開頭，且只能包含：

- 字母（a-z、A-Z）
- 數字（0-9）
- 底線（\_）
- 連字號（-）

你也可以定義具有多個參數的路徑：

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile';
import {SocialMediaFeed} from './social-media-feed';

const routes: Routes = [
  {path: 'user/:id/:social-media', component: SocialMediaFeed},
  {path: 'user/:id', component: UserProfile},
];
```

有了這條新路徑，使用者可以造訪 `/user/leeroy/youtube` 與 `/user/leeroy/bluesky`，並依據使用者 leeroy 的參數，看到各自的社群媒體動態。

讀取路由參數的詳細資訊，請參閱[讀取路由狀態](/guide/routing/read-route-state)。

### 萬用字元

當你需要攔截特定路徑的所有路由時，解決方法是使用以雙星號（`**`）定義的萬用字元路由。

一個常見的範例是定義找不到頁面的元件。

```ts
import {Routes} from '@angular/router';
import {Home} from './home/home';
import {UserProfile} from './user-profile';
import {NotFound} from './not-found';

const routes: Routes = [
  {path: 'home', component: Home},
  {path: 'user/:id', component: UserProfile},
  {path: '**', component: NotFound},
];
```

在此路由陣列中，當使用者造訪 `home` 與 `user/:id` 以外的任何路徑時，應用程式會顯示 `NotFound` 元件。

TIP: 萬用字元路由通常放在路由陣列的末尾。

## Angular 如何比對 URL

當你定義路由時，順序很重要，因為 Angular 採用先比對先贏的策略。這表示一旦 Angular 把某個 URL 與一條路由的 `path` 比對成功，就會停止檢查後續的路由。因此，請務必把更具體的路由放在較不具體的路由之前。

下列範例顯示了從最具體到最不具體定義的路由：

```ts
const routes: Routes = [
  {path: '', component: Home}, // Empty path
  {path: 'users/new', component: NewUser}, // Static, most specific
  {path: 'users/:id', component: UserDetail}, // Dynamic
  {path: 'users', component: Users}, // Static, less specific
  {path: '**', component: NotFound}, // Wildcard - always last
];
```

若使用者造訪 `/users/new`，Angular 路由會經過下列步驟：

1. 檢查 `''`：不相符
1. 檢查 `users/new`：相符！在此停止
1. 永遠不會到達 `users/:id`，即使它也可能相符
1. 永遠不會到達 `users`
1. 永遠不會到達 `**`

## 重新導向

你可以定義一條路由，讓它重新導向到另一條路由，而不是渲染元件：

```ts
import {Routes} from '@angular/router';
import {Blog} from './home/blog';

const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: Blog,
  },
];
```

若你修改或移除了某條路由，有些使用者仍可能點選指向該路由的過時連結或書籤。你可以加入重新導向，把這些使用者導向適當的替代路由，而不是「找不到」頁面。

## 頁面標題

你可以為每條路由關聯一個 **title**。Angular 會在路由啟用時自動更新[頁面標題](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)。請務必為應用程式定義適當的頁面標題，因為這些標題是打造無障礙體驗的必要元素。

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home Page',
  },
  {
    path: 'about',
    component: About,
    title: 'About Us',
  },
];
```

頁面的 `title` 屬性可以使用 [`ResolveFn`](/api/router/ResolveFn) 動態設定為一個解析器函式。

```ts
const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
const routes: Routes = [
  // ...
  {
    path: 'products',
    component: Products,
    title: titleResolver,
  },
];
```

路由標題也可以透過繼承 [`TitleStrategy`](/api/router/TitleStrategy) 抽象類別的服務來設定。預設情況下，Angular 使用 [`DefaultTitleStrategy`](/api/router/DefaultTitleStrategy)。

### 使用 TitleStrategy 設定頁面標題

在需要集中控制文件標題組成方式的進階情境中，請實作 `TitleStrategy`。

`TitleStrategy` 是一個你可以提供的 token，用來覆寫 Angular 使用的預設標題策略。你可以提供自訂的 `TitleStrategy`，實作諸如加上應用程式字尾、從麵包屑格式化標題，或從路由資料動態產生標題等慣例。

```ts
import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleStrategy, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // PageTitle is equal to the "Title" of a route if it's set
    // If its not set it will use the "title" given in index.html
    const pageTitle = this.buildTitle(snapshot) || this.title.getTitle();
    this.title.setTitle(`MyAwesomeApp - ${pageTitle}`);
  }
}
```

若要使用自訂策略，請在應用程式層級以 `TitleStrategy` token 提供它：

```ts
import {provideRouter, TitleStrategy} from '@angular/router';
import {AppTitleStrategy} from './app-title.strategy';

export const appConfig = {
  providers: [provideRouter(routes), {provide: TitleStrategy, useClass: AppTitleStrategy}],
};
```

## 用於依賴注入的路由層級提供者

每條路由都有一個 `providers` 屬性，讓你透過[依賴注入](/guide/di)把相依性提供給該路由的內容。

常見的適用情境包括：依據使用者是否為管理員而使用不同服務的應用程式。

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [AdminService, {provide: ADMIN_API_KEY, useValue: '12345'}],
    children: [
      {path: 'users', component: AdminUsers},
      {path: 'teams', component: AdminTeams},
    ],
  },
  // ... other application routes that don't
  //     have access to ADMIN_API_KEY or AdminService.
];
```

在此程式碼範例中，`admin` 路徑包含受保護的資料屬性 `ADMIN_API_KEY`，只有其區段內的子路由才能使用。因此，其他任何路徑都無法存取透過 `ADMIN_API_KEY` 提供的資料。

如需深入瞭解 Angular 中的提供者與注入，請參閱[依賴注入指南](/guide/di)。

## 為路由關聯資料

路由資料讓你把額外資訊附加到路由上。你可以依據這些資料設定元件的行為方式。

處理路由資料有兩種方式：保持不變的靜態資料，以及可依據執行階段條件改變的動態資料。

### 靜態資料

你可以透過 `data` 屬性為路由關聯任意的靜態資料，以集中管理路由專屬的中繼資料（例如分析追蹤、權限等）：

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: 'about',
    component: About,
    data: {analyticsId: '456'},
  },
  {
    path: '',
    component: Home,
    data: {analyticsId: '123'},
  },
];
```

在此程式碼範例中，首頁與關於頁面設定了特定的 `analyticsId`，之後會在各自的元件中用於頁面追蹤分析。

你可以注入 `ActivatedRoute` 來讀取這份靜態資料。詳細資訊請參閱[讀取路由狀態](/guide/routing/read-route-state)。

### 使用資源與解析器的動態資料

當你需要為路由擷取資料時，Angular 路由支援反應式路由資源以及資料解析器：

- [使用資源擷取資料](/guide/routing/data-fetching-with-resources)：使用 Angular Signals 的 `Resource` API，以反應式的方式擷取資料。
- [路由資料解析器](/guide/routing/data-resolvers)：在路由啟用之前，使用解析器函式擷取資料。

## 巢狀路由

巢狀路由（也稱為子路由）是一種常見技術，用來管理較複雜的導覽路由：某個元件擁有一個會依據 URL 改變的子檢視。

<img alt="巢狀路由示意圖" src="assets/images/guide/router/nested-routing-diagram.svg">

你可以使用 `children` 屬性，為任何路由定義加入子路由：

```ts
const routes: Routes = [
  {
    path: 'product/:id',
    component: Product,
    children: [
      {
        path: 'info',
        component: ProductInfo,
      },
      {
        path: 'reviews',
        component: ProductReviews,
      },
    ],
  },
];
```

上述範例定義了一條產品頁面的路由，讓使用者能依據 URL 切換顯示產品資訊或評論。

`children` 屬性接受一個 `Route` 物件陣列。

若要顯示子路由，父元件（範例中的 `Product`）需包含它自己的 `<router-outlet>`。

```angular-html
<!-- Product -->
<article>
  <h1>Product {{ id }}</h1>
  <router-outlet />
</article>
```

在設定中加入子路由，並在元件中加入 `<router-outlet>` 之後，在符合子路由的 URL 之間導覽，只會更新巢狀的 outlet。

## 後續步驟

<docs-pill-row>
  <docs-pill href="/guide/routing/loading-strategies" title="路由載入策略"/>
  <docs-pill href="/guide/routing/show-routes-with-outlets" title="使用 Outlet 顯示路由內容"/>
</docs-pill-row>
