# Router 生命週期與事件

Angular Router 提供了一套完整的生命週期勾點與事件，讓你能回應導覽的變化，並在路由過程中執行自訂邏輯。

## 常見的 Router 事件

Angular Router 會發出導覽事件，你可以訂閱這些事件來追蹤導覽生命週期。這些事件可透過 `Router.events` 這個 Observable 取得。本節依時間順序，介紹用於導覽與錯誤追蹤的常見路由生命週期事件。

| Events                                              | 說明                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)     | 導覽開始時發生，包含所請求的 URL。                                                                       |
| [`RoutesRecognized`](api/router/RoutesRecognized)   | 路由判斷出哪個路由與 URL 相符後發生，包含路由狀態資訊。                                                  |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)   | 路由守衛階段開始。Router 會評估 `canActivate`、`canDeactivate` 等路由守衛。                              |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)       | 表示守衛評估完成，包含評估結果（允許或拒絕）。                                                           |
| [`ResolveStart`](api/router/ResolveStart)           | 資料解析階段開始，路由解析器開始擷取資料。                                                         |
| [`ResolveEnd`](api/router/ResolveEnd)               | 資料解析完成，所有必要的資料都已可供使用。                                                   |
| [`NavigationEnd`](api/router/NavigationEnd)         | 導覽成功完成時的最終事件，Router 會更新 URL。                                                            |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Router 略過導覽時發生（例如導覽至相同的 URL）。                                                          |

以下是常見的錯誤事件：

| Event                                             | 說明                                                                                                           |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`NavigationCancel`](api/router/NavigationCancel) | Router 取消導覽時發生，通常是因為守衛回傳了 `false`。                                                          |
| [`NavigationError`](api/router/NavigationError)   | 導覽失敗時發生，可能是因為路由無效或解析器發生錯誤。                                     |

如需所有生命週期事件的清單，請參閱[本指南中的完整表格](#all-router-events)。

## 如何訂閱 Router 事件

當你想在特定的導覽生命週期事件中執行程式碼時，可以訂閱 `router.events`，並檢查事件的執行個體類型：

```ts
// Example of subscribing to router events
import {Component, inject, signal, effect} from '@angular/core';
import {Event, Router, NavigationStart, NavigationEnd} from '@angular/router';

@Component({
  /*...*/
})
export class RouterEvents {
  private readonly router = inject(Router);

  constructor() {
    // Subscribe to router events and react to events
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navigation starting
        console.log('Navigation starting:', event.url);
      }
      if (event instanceof NavigationEnd) {
        // Navigation completed
        console.log('Navigation completed:', event.url);
      }
    });
  }
}
```

NOTE: 從 `@angular/router` 匯入的 [`Event`](api/router/Event) 型別，與一般的全域 [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) 型別同名，但兩者並不相同；它也與 [`RouterEvent`](api/router/RouterEvent) 型別不同。

## 如何對路由事件進行除錯

在看不到事件順序的情況下，除錯 Router 導覽問題可能會相當困難。Angular 提供內建的除錯功能，能將所有 Router 事件記錄到主控台，幫助你了解導覽流程，並找出問題發生的位置。

當你需要檢查 Router 事件順序時，可以啟用內部導覽事件的記錄功能來進行除錯。你可以傳入設定選項（`withDebugTracing()`）來設定，藉此啟用所有路由事件的詳細主控台記錄。

```ts
import {provideRouter, withDebugTracing} from '@angular/router';

const appRoutes: Routes = [];
bootstrapApplication(App, {
  providers: [provideRouter(appRoutes, withDebugTracing())],
});
```

如需更多資訊，請參閱 [`withDebugTracing`](api/router/withDebugTracing) 的官方文件。

## 常見使用情境

Router 事件能在真實世界的應用程式中實現許多實用功能。以下列出一些搭配 Router 事件使用的常見模式。

### 載入指示器

在導覽期間顯示載入指示器：

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
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

### 分析追蹤

追蹤頁面瀏覽以進行分析：

```ts
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {inject, Injectable, DestroyRef} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      // Track page views when URL changes
      if (event instanceof NavigationEnd) {
        // Send page view to analytics
        this.analytics.trackPageView(event.url);
      }
    });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Page view tracked:', url);
    },
  };
}
```

### 錯誤處理

妥善處理導覽錯誤，並為使用者提供回饋：

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  NavigationCancellationCode,
} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Dismiss</button>
      </div>
    }
  `,
})
export class ErrorHandler {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.errorMessage.set('Failed to load page. Please try again.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled:', event.reason);
        if (event.code === NavigationCancellationCode.GuardRejected) {
          this.errorMessage.set('Access denied. Please check your permissions.');
        }
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
```

## 所有 Router 事件 {#all-router-events}

以下列出 Angular 中所有可用的 Router 事件，供你參考。這些事件依類別組織，並依照它們在導覽期間通常發生的順序排列。

### 導覽事件

這些事件追蹤核心的導覽流程，從開始、路由辨識、守衛檢查到資料解析，讓你能掌握導覽生命週期的每個階段。

| Event                                                     | 說明                                            |
| --------------------------------------------------------- | ----------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | 發生於導覽開始時                                |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | 發生於延遲載入路由設定之前                      |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | 發生於延遲載入的路由設定載入完成之後            |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | 發生於 Router 解析 URL 並辨識出路由時           |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | 發生於守衛階段開始時                            |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | 發生於守衛階段結束時                            |
| [`ResolveStart`](api/router/ResolveStart)                 | 發生於解析階段開始時                            |
| [`ResolveEnd`](api/router/ResolveEnd)                     | 發生於解析階段結束時                            |

### 啟用事件

這些事件發生在啟用階段，此時路由元件正被建立實例並進行初始化。路由樹中的每個路由（包括父路由與子路由）都會觸發啟用事件。

| Event                                                     | 說明                       |
| --------------------------------------------------------- | -------------------------- |
| [`ActivationStart`](api/router/ActivationStart)           | 發生於路由啟用開始時       |
| [`ChildActivationStart`](api/router/ChildActivationStart) | 發生於子路由啟用開始時     |
| [`ActivationEnd`](api/router/ActivationEnd)               | 發生於路由啟用結束時       |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | 發生於子路由啟用結束時     |

### 導覽完成事件

這些事件代表一次導覽嘗試的最終結果。每一次導覽都恰好會以其中一個事件結束，表明該次導覽是成功、被取消、失敗，還是被略過。

| Event                                               | 說明                                                |
| --------------------------------------------------- | --------------------------------------------------- |
| [`NavigationEnd`](api/router/NavigationEnd)         | 發生於導覽成功結束時                                |
| [`NavigationCancel`](api/router/NavigationCancel)   | 發生於 Router 取消導覽時                            |
| [`NavigationError`](api/router/NavigationError)     | 發生於導覽因未預期的錯誤而失敗時                    |
| [`NavigationSkipped`](api/router/NavigationSkipped) | 發生於 Router 略過導覽時（例如導覽至相同的 URL）    |

### 其他事件

還有一個額外的事件，發生在主要導覽生命週期之外，但它仍屬於 Router 事件系統的一部分。

| Event                         | 說明             |
| ----------------------------- | ---------------- |
| [`Scroll`](api/router/Scroll) | 發生於捲動期間   |

## 後續步驟

進一步了解[路由守衛](/guide/routing/route-guards)與[常見的 Router 任務](/guide/routing/common-router-tasks)。
