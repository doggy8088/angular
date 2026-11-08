# 資料解析器

資料解析器讓你在導覽到一條路由之前先擷取資料，確保元件在渲染之前就收到所需的資料。這有助於避免載入狀態的需求，並透過預先載入必要資料改善使用者體驗。

TIP: 若你的應用程式使用 Angular Signals，請考慮使用[路由資源](/guide/routing/data-fetching-with-resources)，透過 `Resource` API 進行反應式資料擷取，並內建支援非阻擋式資料載入。

## 什麼是資料解析器？

資料解析器是實作 `ResolveFn` 函式的服務。它在路由啟用之前執行，可以從 API、資料庫或其他來源擷取資料。解析後的資料會透過 `ActivatedRoute` 提供給元件。

資料解析器可以存取[在路由層級提供的服務](guide/di/defining-dependency-providers#route-providers)，以及透過 `route` 參數取得的路由專屬資訊。

## 為什麼使用資料解析器？

資料解析器解決了常見的路由挑戰：

- **防止空白狀態**：元件在載入時立即收到資料
- **更好的使用者體驗**：關鍵資料不需要載入指示
- **錯誤處理**：在導覽之前處理資料擷取錯誤
- **資料一致性**：確保必要資料在渲染前可用，這對 SSR 很重要

## 建立解析器

你可以撰寫一個型別為 `ResolveFn` 的函式來建立解析器。

它接收 `ActivatedRouteSnapshot` 與 `RouterStateSnapshot` 作為參數。

以下是一個解析器範例，它使用 [`inject`](api/core/inject) 函式，在渲染路由之前取得使用者資訊：

```ts
import {inject} from '@angular/core';
import {UserStore, SettingsStore} from './user-store';
import type {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import type {User, Settings} from './types';

export const userResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};

export const settingsResolver: ResolveFn<Settings> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};
```

## 使用解析器設定路由

當你想為一條路由加入一個或多個資料解析器時，可以把它加在路由設定的 `resolve` 鍵之下。`Routes` 型別定義了路由設定的結構：

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver,
    },
  },
];
```

你可以在 [API 文件中深入瞭解 `resolve` 設定](api/router/Route#resolve)。

## 在元件中存取解析後的資料

### 使用 ActivatedRoute

你可以使用 `toSignal` 函式，把 `ActivatedRoute` 的 `data` observable 轉換成訊號，藉此在元件中存取解析後的資料：

```angular-ts
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, {requireSync: true});
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}
```

### 使用 withComponentInputBinding

另一種存取解析後資料的方法，是在以 `provideRouter` 設定路由時使用 `withComponentInputBinding()`。這讓解析後的資料能直接作為元件輸入傳入：

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding())],
});
```

有了這個設定，你可以在元件中定義與解析器鍵相符的輸入，使用 `input` 函式，並以 `input.required` 表示必要輸入：

```angular-ts
import {Component, input} from '@angular/core';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}
```

這種方法提供更好的型別安全性，並消除了僅為了存取解析後資料而注入 `ActivatedRoute` 的需求。

## 解析器中的錯誤處理

發生導覽失敗時，在資料解析器中妥善處理錯誤非常重要。否則會發生 `NavigationError`，導覽到目前路由將會失敗，導致使用者體驗不佳。

使用資料解析器時，有三種主要的錯誤處理方式：

1. 在 `withNavigationErrorHandler` 中集中處理錯誤
2. 透過訂閱路由事件管理錯誤
3. 直接在解析器中處理錯誤

### 在 `withNavigationErrorHandler` 中集中處理錯誤

[`withNavigationErrorHandler`](api/router/withNavigationErrorHandler) 功能提供了一個集中處理所有導覽錯誤（包含來自失敗的資料解析器的錯誤）的方式。這種方法把錯誤處理邏輯放在同一個地方，避免各解析器中出現重複的錯誤處理程式碼。

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, Router, withNavigationErrorHandler} from '@angular/router';
import {inject} from '@angular/core';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(
      routes,
      withNavigationErrorHandler((error) => {
        const router = inject(Router);

        if (error.error?.message) {
          console.error('Navigation error occurred:', error.error.message);
        }

        router.navigate(['/error']);
      }),
    ),
  ],
});
```

有了這個設定，你的解析器可以專注於擷取資料，把錯誤情境交給集中式處理常式管理：

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  // No need for explicit error handling - let it bubble up
  return userStore.getUser(userId);
};
```

### 透過訂閱路由事件管理錯誤

你也可以訂閱路由事件並監聽 `NavigationError` 事件，來處理解析器錯誤。這種方法讓你能更細粒度地控制錯誤處理，並實作自訂的錯誤復原邏輯。

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {Router, NavigationError, RouterOutlet} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Retry</button>
      </div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      map((event) => {
        if (event instanceof NavigationError) {
          this.lastFailedUrl.set(event.url);

          if (event.error) {
            console.error('Navigation error', event.error);
          }

          return 'Navigation failed. Please try again.';
        }
        return '';
      }),
    ),
    {initialValue: ''},
  );

  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
```

這種方法在下列情況下特別有用：

- 為失敗的導覽實作自訂重試邏輯
- 依據失敗類型顯示特定的錯誤訊息
- 基於分析目的追蹤導覽失敗

### 直接在解析器中處理錯誤

以下是 `userResolver` 的更新範例，它記錄錯誤，並使用 `Router` 服務導覽回通用的 `/users` 頁面：

```ts
import {inject} from '@angular/core';
import {ResolveFn, RedirectCommand, Router} from '@angular/router';
import {catchError, of, EMPTY} from 'rxjs';
import {UserStore} from './user-store';
import type {User} from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;

  return userStore.getUser(userId).pipe(
    catchError((error) => {
      console.error('Failed to load user:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    }),
  );
};
```

## 導覽載入的考量

資料解析器雖然能避免元件內部的載入狀態，卻帶來了另一種 UX 考量：在解析器執行期間，導覽會被阻擋。使用者可能會感受到從點選連結到看到新路由之間的延遲，尤其是在網路請求緩慢時。

TIP: 若要避免阻擋導覽、立即渲染元件並顯示骨架或載入指示，請使用[非阻擋型路由資源](/guide/routing/data-fetching-with-resources#blocking-and-non-blocking-resources)。

### 提供導覽回饋

若要在解析器執行期間改善使用者體驗，你可以監聽路由事件並顯示載入指示：

```angular-ts
import {Component, computed, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

這種方法確保使用者在解析器擷取資料時，能收到導覽正在進行的視覺回饋。

## 最佳實務

- **保持解析器輕量**：解析器應只擷取必要資料，而不是頁面可能需要的一切
- **處理錯誤**：務必妥善處理錯誤，盡可能為使用者提供最佳體驗
- **使用快取**：考慮快取解析後的資料以改善效能
- **考量導覽 UX**：由於資料擷取期間導覽會被阻擋，請為解析器執行實作載入指示
- **設定合理的逾時**：避免解析器無限期懸掛並阻擋導覽
- **型別安全**：為解析後的資料使用 TypeScript 介面

## 在子解析器中讀取父路由的解析資料

解析器會從父到子依序執行。當父路由定義了解析器時，其解析後的資料可供之後執行的子解析器使用。

NOTE: 由於解析器從父到子依序執行，每多一層巢狀都會增加總導覽等待時間（網路瀑布）。若你的子路由不依賴父資料，請考慮使用[路由資源](/guide/routing/data-fetching-with-resources)，它們會在所有路由之間同時執行。

```ts
import {inject} from '@angular/core';
import {provideRouter, ActivatedRouteSnapshot} from '@angular/router';
import {userResolver} from './resolvers';
import {UserPosts} from './pages';
import {PostService} from './services';
import type {User} from './types';

provideRouter([
  {
    path: 'users/:id',
    resolve: {user: userResolver}, // user resolver in the parent route
    children: [
      {
        path: 'posts',
        component: UserPosts,
        // route.data.user is available here while this resolver runs
        resolve: {
          posts: (route: ActivatedRouteSnapshot) => {
            const postService = inject(PostService);
            const user = route.parent?.data['user'] as User; // parent data
            const userId = user.id;
            return postService.getPostByUser(userId);
          },
        },
      },
    ],
  },
]);
```

## 後續步驟

<docs-pill-row>
  <docs-pill href="/guide/routing/data-fetching-with-resources" title="使用資源擷取資料"/>
  <docs-pill href="/guide/routing/route-guards" title="使用守衛控制路由存取"/>
</docs-pill-row>
