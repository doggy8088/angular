# 重新導向路由

路由重新導向讓你能自動將使用者從一個路由導覽至另一個路由。可以把它想像成郵件轉送：寄往某個地址的郵件，會被送到另一個不同的地址。這在處理舊有 URL、實作預設路由，或管理存取控制時非常有用。

## 如何設定重新導向

你可以在路由設定中，以 `redirectTo` 屬性定義重新導向。這個屬性接受一個字串。

```ts
import {Routes} from '@angular/router';

const routes: Routes = [
  // Simple redirect
  {path: 'marketing', redirectTo: 'newsletter'},

  // Redirect with path parameters
  {path: 'legacy-user/:id', redirectTo: 'users/:id'},

  // Redirect any other URLs that don’t match
  // (also known as a "wildcard" redirect)
  {path: '**', redirectTo: '/login'},
];
```

在這個範例中，一共有三個重新導向：

1. 當使用者造訪 `/marketing` 路徑時，他們會被重新導向至 `/newsletter`。
2. 當使用者造訪任何 `/legacy-user/:id` 路徑時，他們會被導向至對應的 `/users/:id` 路徑。
3. 當使用者造訪任何未在路由器中定義的路徑時，由於 `**` 萬用字元路徑定義，他們會被重新導向至登入頁面。

## 了解 `pathMatch`

路由上的 `pathMatch` 屬性，讓開發者能控制 Angular 如何將 URL 與路由進行比對。

`pathMatch` 可以接受兩個值：

| Value      | 說明                                         |
| ---------- | -------------------------------------------- |
| `'full'`   | 整個 URL 路徑必須完全相符                    |
| `'prefix'` | 只有 URL 的開頭部分需要相符                  |

在預設情況下，所有重新導向都會使用 `prefix` 策略。

### `pathMatch: 'prefix'`

`pathMatch: 'prefix'` 是預設策略，當你希望 Angular Router 在觸發重新導向時比對所有後續路由時，這個策略非常適合。

```ts
export const routes: Routes = [
  // This redirect route is equivalent to…
  { path: 'news', redirectTo: 'blog },

  // This explicitly defined route redirect pathMatch
  { path: 'news', redirectTo: 'blog', pathMatch: 'prefix' },
];
```

在這個範例中，所有以 `news` 為前綴的路由，都會被重新導向至它們對應的 `/blog` 路徑。以下是使用者造訪舊的 `news` 前綴時被重新導向的一些範例：

- `/news` 重新導向至 `/blog`
- `/news/article` 重新導向至 `/blog/article`
- `/news/article/:id` 重新導向至 `/blog/article/:id`

### `pathMatch: 'full'`

另一方面，當你希望 Angular Router 只重新導向某個特定路徑時，`pathMatch: 'full'` 非常有用。

```ts
export const routes: Routes = [{path: '', redirectTo: '/dashboard', pathMatch: 'full'}];
```

在這個範例中，每當使用者造訪根 URL（即 `''`）時，路由器就會將該名使用者重新導向至 `'/dashboard'` 頁面。

任何後續頁面（例如 `/login`、`/about`、`/product/id` 等），都不會被納入考量，也不會觸發重新導向。

TIP: 在根頁面（即 `"/"` 或 `""`）上設定重新導向時要小心。如果你沒有設定 `pathMatch: 'full'`，路由器將會重新導向所有的 URL。

進一步說明，如果前一節的 `news` 範例改用 `pathMatch: 'full'`：

```ts
export const routes: Routes = [{path: 'news', redirectTo: '/blog', pathMatch: 'full'}];
```

這意味著：

1. 只有 `/news` 路徑會被重新導向至 `/blog`。
2. 任何後續區段，例如 `/news/articles` 或 `/news/articles/1`，都不會使用新的 `/blog` 前綴進行重新導向。

## 條件式重新導向 {#conditional-redirects}

`redirectTo` 屬性也可以接受一個函式，藉此為使用者的重新導向方式加入邏輯。

在路由比對階段中，有些資料並無法準確得知，因此這個[函式](api/router/RedirectFunction)只能存取 [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot) 的部分資料。舉例來說，這些資料包括：已解析的標題、延遲載入的元件等等。

它通常回傳一個字串或 [`URLTree`](api/router/UrlTree)，但也可以回傳一個 observable 或 promise。

以下範例中，使用者會根據一天中的時間，被重新導向至不同的選單：

```ts
import {Routes} from '@angular/router';
import {Menu} from './menu';

export const routes: Routes = [
  {
    path: 'restaurant/:location/menu',
    redirectTo: (activatedRouteSnapshot) => {
      const location = activatedRouteSnapshot.params['location'];
      const currentHour = new Date().getHours();

      // Check if user requested a specific meal via query parameter
      if (activatedRouteSnapshot.queryParams['meal']) {
        return `/restaurant/${location}/menu/${queryParams['meal']}`;
      }

      // Auto-redirect based on time of day
      if (currentHour >= 5 && currentHour < 11) {
        return `/restaurant/${location}/menu/breakfast`;
      } else if (currentHour >= 11 && currentHour < 17) {
        return `/restaurant/${location}/menu/lunch`;
      } else {
        return `/restaurant/${location}/menu/dinner`;
      }
    },
  },

  // Destination routes
  {path: 'restaurant/:location/menu/breakfast', component: Menu},
  {path: 'restaurant/:location/menu/lunch', component: Menu},
  {path: 'restaurant/:location/menu/dinner', component: Menu},

  // Default redirect
  {path: '', redirectTo: '/restaurant/downtown/menu', pathMatch: 'full'},
];
```

如需了解更多，請參閱 [RedirectFunction 的 API 文件](api/router/RedirectFunction)。

## 後續步驟

如需關於 `redirectTo` 屬性的更多資訊，請參閱 [API 文件](api/router/Route#redirectTo)。
