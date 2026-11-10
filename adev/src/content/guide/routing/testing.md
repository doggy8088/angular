# 測試路由與導覽

測試路由與導覽，對於確保使用者在不同路由之間導覽時應用程式行為正確至關重要。本指南涵蓋在 Angular 應用程式中測試路由功能的各種策略。

## 先決條件

本指南假設你已熟悉下列工具與程式庫：

- **[Vitest](https://vitest.dev/)** - 提供測試語法（`describe`、`it`、`expect`）的 JavaScript 測試框架
- **[Angular Testing Utilities](guide/testing)** - Angular 內建的測試工具（[`TestBed`](api/core/testing/TestBed)、[`ComponentFixture`](api/core/testing/ComponentFixture)）
- **[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)** - 用於測試路由元件的測試工具，內建導覽與元件測試功能

## 測試情境

### 路由參數

元件常需依賴 URL 中的路由參數來取得資料，例如個人檔案頁面要用到的使用者 ID。

下列範例示範如何測試一個從路由顯示使用者 ID 的 `UserProfile` 元件。

```ts { header: 'user-profile.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {UserProfile} from './user-profile';

describe('UserProfile', () => {
  it('should display user ID from route parameters', async () => {
    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [provideRouter([{path: 'user/:id', component: UserProfile}])],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user/123', UserProfile);

    expect(harness.routeNativeElement?.textContent).toContain('User Profile: 123');
  });
});
```

```angular-ts {header: 'user-profile.ts'}
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: '<h1>User Profile: {{userId}}</h1>',
})
export class UserProfile {
  private route = inject(ActivatedRoute);
  userId: string | null = this.route.snapshot.paramMap.get('id');
}
```

### 路由守衛

路由守衛會依驗證或權限等條件，控制路由的存取。測試守衛時，應著重於模擬相依性並驗證導覽結果。

下列範例測試一個 `authGuard`：它允許已驗證的使用者導覽，並把未驗證的使用者重新導向到登入頁面。

```ts {header: 'auth.guard.spec.ts'}
import {vi, type Mocked} from 'vitest';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter, Router} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthStore} from './auth-store';
import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

@Component({template: '<h1>Protected Page</h1>'})
class Protected {}

@Component({template: '<h1>Login Page</h1>'})
class Login {}

describe('authGuard', () => {
  let authStore: Mocked<AuthStore>;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authStore = {isAuthenticated: vi.fn().mockReturnValue(isAuthenticated)} as Mocked<AuthStore>;

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthStore, useValue: authStore},
        provideRouter([
          {path: 'protected', component: Protected, canActivate: [authGuard]},
          {path: 'login', component: Login},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', Protected);
    // The protected component should render when authenticated
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', Login);
    // The login component should render after redirect
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});
```

```ts {header: 'auth.guard.ts'}
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from './auth-store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### 路由器 outlet

路由器 outlet 測試比較偏向整合測試，因為你實際上是在測試 [`Router`](api/router/Router)、outlet 與所顯示元件之間的整合。

下列範例示範如何設定測試，驗證不同路由會顯示不同元件：

```ts {header: 'app.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Component} from '@angular/core';
import {App} from './app';

@Component({
  template: '<h1>Home Page</h1>',
})
class MockHome {}

@Component({
  template: '<h1>About Page</h1>',
})
class MockAbout {}

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          {path: '', component: MockHome},
          {path: 'about', component: MockAbout},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should display home component for default route', async () => {
    await harness.navigateByUrl('');

    expect(harness.routeNativeElement?.textContent).toContain('Home Page');
  });

  it('should display about component for about route', async () => {
    await harness.navigateByUrl('/about');

    expect(harness.routeNativeElement?.textContent).toContain('About Page');
  });
});
```

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

### 巢狀路由

測試巢狀路由，可以確保導覽到巢狀 URL 時，父元件與子元件都能正確渲染。這一點很重要，因為巢狀路由牽涉多個層次。

你需要驗證：

1. 父元件正確渲染。
2. 子元件在父元件內渲染。
3. 確認兩個元件都能存取各自的路由資料。

下列是測試父子路由結構的範例：

```ts {header: 'nested-routes.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Parent, Child} from './nested-components';

describe('Nested Routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Parent, Child],
      providers: [
        provideRouter([
          {
            path: 'parent',
            component: Parent,
            children: [{path: 'child', component: Child}],
          },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should render parent and child components for nested route', async () => {
    await harness.navigateByUrl('/parent/child');

    expect(harness.routeNativeElement?.textContent).toContain('Parent Component');
    expect(harness.routeNativeElement?.textContent).toContain('Child Component');
  });
});
```

```angular-ts {header: 'nested.ts'}
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Parent Component</h1>
    <router-outlet />
  `,
})
export class Parent {}

@Component({
  template: '<h2>Child Component</h2>',
})
export class Child {}
```

### 查詢參數與 fragment

查詢參數（如 `?search=angular&category=web`）與 URL fragment（如 `#section1`）會透過 URL 提供額外資料；它們不影響載入哪個元件，但會影響元件的行為。透過 [`ActivatedRoute.queryParams`](api/router/ActivatedRoute#queryParams) 讀取查詢參數的元件，需要經過測試，確保它能正確處理各種參數情境。

與屬於路由定義一部分的路由參數不同，查詢參數是選擇性的，可以在不觸發路由導覽的情況下改變。這表示你既要測試初次載入，也要測試查詢參數改變時的反應式更新。

下列範例示範如何測試查詢參數與 fragment：

```ts {header: 'search.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {Search} from './search';

describe('Search', () => {
  let component: Search;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [provideRouter([{path: 'search', component: Search}])],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should read search term from query parameters', async () => {
    component = await harness.navigateByUrl('/search?q=angular', Search);

    expect(component.searchTerm()).toBe('angular');
  });
});
```

```angular-ts {header: 'search.ts'}
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: '<div>Search term: {{searchTerm()}}</div>',
})
export class Search {
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, {initialValue: {}});

  searchTerm = computed(() => this.queryParams()['q'] || null);
}
```

## 路由測試的最佳實務

1. **使用 RouterTestingHarness**：測試路由元件時，使用 [`RouterTestingHarness`](api/router/testing/RouterTestingHarness)；它提供更簡潔的 API，省去測試宿主元件的需要，並提供直接存取元件、內建導覽與更好的型別安全性。不過，它不適合某些情境，例如測試具名 outlet，這時你可能需要建立自訂宿主元件。
2. **審慎處理外部相依性**：盡可能優先使用真實實作，讓測試更貼近實際。若真實實作不可行（例如外部 API），請使用近似真實行為的假實作。模擬或 stub 只應作為最後手段，因為它們可能讓測試變得脆弱且不可靠。
3. **測試導覽狀態**：同時驗證導覽動作與其後的應用程式狀態，包括 URL 變化與元件渲染。
4. **處理非同步操作**：路由器導覽是非同步的。在測試中使用 `async/await`，妥善處理時機。
5. **測試錯誤情境**：為無效路由、導覽失敗與守衛拒絕等情況撰寫測試，確保應用程式能妥善處理邊界案例。
6. **不要模擬 Angular Router**：改為提供真實的路由設定，並使用測試工具進行導覽。這樣能讓測試更穩健，較不容易因 Angular 內部更新而壞掉；同時也能在路由器更新時抓到真正的問題，因為模擬可能會掩蓋破壞性變更。
