# 路由中的錯誤邊界

IMPORTANT: 路由器錯誤邊界目前處於[開發者預覽](reference/releases#developer-preview)階段。

在建置網頁應用程式時，執行階段錯誤可能發生在元件初始化、資料載入或渲染期間。Angular 路由器讓你可以使用**錯誤邊界**，把這些失敗隔離到個別路由，避免單一故障元件拖垮整個應用程式殼層。

NOTE: 本指南涵蓋路由層級的錯誤處理。如需攔截元件範本特定區段內的錯誤，請參閱[範本 `@boundary` 區塊指南](/guide/templates/error-boundaries)。

## 什麼是路由器錯誤邊界？

路由器錯誤邊界在路由出口層級提供宣告式錯誤處理。當路由內的元件擲出錯誤時——例如失敗的網路資源、範本中未預期的 null 參照，或是依賴注入期間發生的錯誤——Angular 路由器會攔截該錯誤，並在故障檢視的位置顯示專用的後備元件（`errorComponent`）。

同層出口、父層版面配置元件與全域導覽標頭，仍可完整互動、保持完好。

## 設定錯誤元件

若要在路由失敗時顯示自訂的後備 UI，請在路由定義中加入 `errorComponent` 屬性：

```ts {header:"app.routes.ts"}
import {Routes} from '@angular/router';
import {ProductDetails} from './product-details';
import {ProductErrorFallback} from './product-error-fallback';

export const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetails,
    errorComponent: ProductErrorFallback,
  },
];
```

當你導覽到 `/products/123` 時，若 `ProductDetails` 在建立或渲染期間擲出錯誤，Angular 路由器會改為在 `<router-outlet>` 內建立 `ProductErrorFallback` 的執行個體。

NOTE: 只有在啟用錯誤邊界後，`errorComponent` 才會生效。請參閱[全域錯誤邊界設定](#global-error-boundary-configuration)。

NOTE: 與可使用 `loadComponent` 延遲載入的路由元件不同，`errorComponent` 必須在路由設定中積極載入。

---

## 建立錯誤後備元件

錯誤後備元件是標準的 Angular 元件，可以接收被攔截錯誤的詳細資訊。

### 使用輸入接收錯誤詳細資訊

你可以宣告一個 `error` 輸入，來接收被攔截的錯誤物件：

```angular-ts {header:"product-error-fallback.ts"}
import {Component, input} from '@angular/core';

@Component({
  selector: 'app-product-error-fallback',
  template: `
    <div class="error-card">
      <h3>Failed to load product</h3>
      <p>{{ error()?.message }}</p>
    </div>
  `,
})
export class ProductErrorFallback {
  readonly error = input<Error>();
}
```

NOTE: 若你的路由設定包含名為 `error` 的參數、查詢參數或路由資料，被攔截的執行階段 `Error` 在錯誤元件的 `error` 輸入上永遠優先。

IMPORTANT: 若 `errorComponent` 本身在建立或渲染期間擲出錯誤，`RouterOutlet` 不會再次攔截它。這個例外會從出口向上冒泡到根層級的 `ErrorHandler`（或外層的[範本 `@boundary` 區塊](/guide/templates/error-boundaries)），以避免無限錯誤迴圈。

## 路由參數與資料繫結

使用 `withComponentInputBinding()` 時，Angular 路由器也會把路由參數與靜態資料繫結到 `errorComponent` 的輸入。這讓你可以在錯誤 UI 中顯示情境資訊：

```angular-ts {header:"product-error-fallback.ts"}
import {Component, input} from '@angular/core';

@Component({
  selector: 'app-product-error-fallback',
  template: `
    <div class="error-card">
      <h3>Failed to load product #{{ id() }}</h3>
      <p>{{ error()?.message }}</p>
    </div>
  `,
})
export class ProductErrorFallback {
  readonly id = input<string>();
  readonly error = input<Error>();
}
```

## 全域錯誤邊界設定 {#global-error-boundary-configuration}

使用 `provideRouter` 中的 `withErrorBoundaries` 功能，為你的應用程式啟用路由器錯誤邊界。沒有它，路由的 `errorComponent` 會被忽略：

```ts {header:"app.config.ts"}
import {ApplicationConfig, inject} from '@angular/core';
import {provideRouter, withComponentInputBinding, withErrorBoundaries} from '@angular/router';
import {routes} from './app.routes';
import {GlobalErrorFallback} from './global-error-fallback';
import {AnalyticsService} from './analytics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withErrorBoundaries({
        // Default fallback component for routes that do not define their own errorComponent
        defaultErrorComponent: GlobalErrorFallback,

        // Global telemetry hook invoked whenever a route error is caught
        onError: (error, details) => {
          inject(AnalyticsService).logException(error, details);
        },
      }),
    ),
  ],
};
```

### 選項

| 選項                  | 型別                                             | 說明                                                                                                                          |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `defaultErrorComponent` | `Type<unknown>`                                  | 當沒有設定自有 `errorComponent` 的路由擲出錯誤時，要渲染的預設後備元件。                                  |
| `onError`               | `(error: Error, details?: ErrorDetails) => void` | 每當路由器錯誤邊界攔截到任何錯誤時，就會呼叫的全域回呼。適合用來將遙測資料傳送到監控服務。 |

---

## 使用 `RedirectCommand` 重新導向

當驗證失敗或資料條件需要導覽到另一個頁面時，元件與路由資源可以擲出 `RedirectCommand`：

```angular-ts {header:"user-profile.ts"}
import {Component, inject, resource} from '@angular/core';
import {Router, RedirectCommand} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  template: `...`,
})
export class UserProfile {
  private router = inject(Router);

  userData = resource({
    loader: async () => {
      const response = await fetch('/api/user');
      if (response.status === 401) {
        // Automatically redirects to /login when unauthorized
        throw new RedirectCommand(this.router.parseUrl('/login'));
      }
      return response.json();
    },
  });
}
```

當 `RedirectCommand` 被擲出時：

1. `RouterOutlet` 會攔截這個指令，並開始導覽到指定的重新導向目的地。
2. 若存在巢狀出口或範本錯誤邊界，Angular 會對指令去重，確保導覽只觸發一次。
3. 錯誤元件（若已設定）會在轉換期間渲染。

NOTE: 若 `RedirectCommand` 被擲出、且未設定 `errorComponent`，路由器會開始導覽，並刻意吞掉這個錯誤，避免它被全域 `ErrorHandler` 記錄為當機。

## 錯誤邊界範圍與導覽錯誤的區別

了解**檢視層錯誤**與**導覽管線錯誤**之間的區別很有幫助：

- **檢視層錯誤（錯誤邊界）**：發生在元件建構函式、依賴注入、生命週期鉤子（`ngOnInit`）、範本運算式與元件 `resource()` 載入器內部。這些錯誤會被 `RouterOutlet` 攔截，並顯示 `errorComponent`。
- **導覽管線錯誤（`NavigationError`）**：發生在路由啟用之前，例如失敗的 `canActivate`／`canMatch` 守衛或路由 `resolve` 資料函式。這些錯誤會在到達出口之前中止導覽轉換，並可使用 `withNavigationErrorHandler` 自訂。

NOTE: 當錯誤邊界顯示 `errorComponent` 時，為該路由設定的 `canDeactivate` 守衛會在離開時執行。守衛會以其 `component` 參數接收使用中的 `errorComponent` 執行個體。若你的守衛會存取元件特有的屬性或方法，請驗證元件型別，或安全地處理錯誤元件執行個體。

## 後續步驟

<docs-pill-row>
  <docs-pill href="/guide/templates/error-boundaries" title="範本錯誤邊界"/>
  <docs-pill href="/guide/routing/show-routes-with-outlets" title="使用 Outlet 顯示路由內容"/>
  <docs-pill href="/guide/routing/redirecting-routes" title="重新導向路由"/>
  <docs-pill href="/guide/routing/data-fetching-with-resources" title="使用資源擷取資料"/>
</docs-pill-row>
