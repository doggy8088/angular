# 路由載入策略

了解 Angular 路由中路由與元件的載入方式與時機，對於建置反應迅速的網頁應用程式至關重要。Angular 提供兩種主要策略來控制載入行為：

1. **立即載入**：會立即載入的路由與元件
2. **延遲載入**：只在需要時才載入的路由與元件

每種做法在不同的情境下各有其優勢。

## 立即載入的元件

當你以 [`component`](api/router/Route#component) 屬性定義路由時，被參照的元件會立即載入，成為與路由設定同屬一個 JavaScript 打包檔的一部分。

```ts
import {Routes} from '@angular/router';
import {HomePage} from './components/home/home-page';
import {LoginPage} from './components/auth/login-page';

export const routes: Routes = [
  // HomePage and LoginPage are both directly referenced in this config,
  // so their code is eagerly included in the same JavaScript bundle as this file.
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
```

像這樣立即載入路由元件，意味著瀏覽器在初始頁面載入時就必須下載並解析這些元件的全部 JavaScript，但這些元件能立即供 Angular 使用。

在初始頁面載入時包含更多 JavaScript 會讓初始載入時間變慢，但使用者在應用程式中導覽時，轉換可以更加流暢。

## 延遲載入的元件與路由 {#lazily-loaded-components-and-routes}

你可以使用 [`loadComponent`](api/router/Route#loadComponent) 屬性，在路由即將啟用之際，延遲載入該元件的 JavaScript。[`loadChildren`](api/router/Route#loadChildren) 屬性則會在路由比對期間延遲載入子路由。

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login-page'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    loadChildren: () => import('./admin/admin.routes'),
  },
];
```

[`loadComponent`](/api/router/Route#loadComponent) 與 [`loadChildren`](/api/router/Route#loadChildren) 屬性接受一個載入器函式，該函式會回傳一個 Promise，其解析結果分別是 Angular 元件或一組路由。在大多數情況下，此函式使用標準的 [JavaScript 動態匯入 API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)。不過，你也可以使用任何自訂的非同步載入器函式。

如果延遲載入的檔案使用 `default` 匯出，你可以直接回傳 `import()` 的 Promise，不需要額外呼叫 `.then` 來選取匯出的類別。

延遲載入路由可以大幅改善 Angular 應用程式的載入速度，因為它能從初始打包檔中移除大量 JavaScript。這些程式碼會編譯成獨立的 JavaScript 區塊，路由器只會在使用者造訪對應的路由時才去請求它們。

## 注入上下文中的延遲載入

Router 會在**目前路由的注入上下文**中執行 [`loadComponent`](/api/router/Route#loadComponent) 與 [`loadChildren`](/api/router/Route#loadChildren)，讓你能在這些載入器函式中呼叫 [`inject`](/api/core/inject)，以存取在該路由上宣告的提供者、透過階層式依賴注入從父路由繼承的提供者，或全域可用的提供者。這讓你能實現具上下文感知能力的延遲載入。

```ts
import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {FeatureFlags} from './feature-flags';

export const routes: Routes = [
  {
    path: 'dashboard',
    // Runs inside the route's injection context
    loadComponent: () => {
      const flags = inject(FeatureFlags);
      return flags.isPremium
        ? import('./dashboard/premium-dashboard')
        : import('./dashboard/basic-dashboard');
    },
  },
];
```

## 我應該使用立即載入還是延遲載入的路由？

決定某個路由應該立即載入還是延遲載入時，有許多因素需要考量。

一般而言，建議主要的到達頁面使用立即載入，其他頁面則使用延遲載入。

NOTE: 雖然延遲載入的路由有減少使用者初始請求資料量的前期效能優勢，但它也會增加日後的資料請求，在某些情況下並不理想。尤其當多個層級都使用巢狀延遲載入時，對效能的影響會特別顯著。

## 後續步驟

了解如何[使用 Outlet 顯示路由內容](/guide/routing/show-routes-with-outlets)。
