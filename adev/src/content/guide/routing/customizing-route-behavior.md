# 自訂路由行為

Angular 路由提供了強大的擴充點，讓你自訂路由在應用程式中的行為。雖然預設的路由行為對大多數應用程式來說都運作良好，但特定的需求往往需要針對效能最佳化、特殊的 URL 處理或複雜的路由邏輯進行自訂實作。

在下列情況下，自訂路由會很有價值：

- **元件狀態保留**：在導覽之間保留狀態，避免重新擷取資料
- **策略性的延遲模組載入**：依據使用者行為或網路狀況決定
- **外部 URL 整合**：或讓 Angular 路由與舊有系統並存處理
- **動態路由比對**：依據執行階段條件進行比對，而不只是簡單的路徑模式

NOTE: 在實作自訂策略之前，請先確認預設的路由行為無法滿足你的需求。Angular 的預設路由已針對常見使用案例最佳化，在效能與簡潔之間取得了最佳平衡。自訂路由策略會增加程式碼複雜度，若管理不慎，也可能對記憶體用量造成影響。

## 路由設定選項 {#router-configuration-options}

`withRouterConfig` 或 `RouterModule.forRoot` 允許提供額外的 `RouterConfigOptions`，來調整路由的行為。

### 處理被取消的導覽

`canceledNavigationResolution` 控制在導覽被取消時，路由如何還原瀏覽器歷史紀錄。預設值是 `'replace'`，它會用 `location.replaceState` 回復到導覽前的 URL。實際上，這表示只要網址列已因該次導覽而更新（例如使用者按下瀏覽器的上一頁或下一頁按鈕），若導覽失敗或被守衛拒絕，該歷史紀錄項目就會被「回滾」的結果覆寫。
改用 `'computed'` 則讓進行中的歷史索引與 Angular 導覽保持同步，因此取消一次上一頁導覽會觸發一次下一頁導覽（反之亦然），以回到原始頁面。

當你的應用程式使用 `urlUpdateStrategy: 'eager'`，或守衛經常取消由瀏覽器發起的 popstate 導覽時，這個設定最有幫助。

```ts
provideRouter(routes, withRouterConfig({canceledNavigationResolution: 'computed'}));
```

### 回應相同 URL 的導覽

`onSameUrlNavigation` 設定當使用者要求導覽到目前的 URL 時應如何處理。預設的 `'ignore'` 會略過處理，而 `'reload'` 則指示路由在其導覽管線中處理該 URL，而不是略過它。守衛與解析器是否重新執行，由 [`runGuardsAndResolvers`](api/router/RunGuardsAndResolvers) 決定；元件是否重用，則由[路由重用策略](#route-reuse-strategy)決定。

當你希望使用者重複點選清單篩選器、左側導覽項目或重新整理按鈕時，即使 URL 沒有改變，也能觸發新的資料擷取，這個設定就很有用。

```ts
provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload'}));
```

你也可以針對個別導覽控制這個行為，而不是全域設定。這樣你就能保留 `'ignore'` 的預設值，同時為特定使用案例選擇性地啟用重新載入行為：

```ts
router.navigate(['/some-path'], {onSameUrlNavigation: 'reload'});
```

TIP: 若你使用[路由資源](/guide/routing/data-fetching-with-resources#reloading-resources-without-renavigation)，可以呼叫資源的 `.reload()`，或更新在 `params` 中讀取的訊號，來按需重新整理資料，不需要設定 `onSameUrlNavigation` 或觸發路由導覽。

### 控制參數繼承

`paramsInheritanceStrategy` 定義路由參數與資料如何從父路由向下流動。

預設情況下（`'always'`），子路由會自動繼承父路由的參數、路由資料與解析後的值。這能確保矩陣參數、路由資料與解析後的值在路由樹的更下層也能使用——當你在不同功能區域之間共用情境識別碼時非常方便，例如：

```text {hideCopy}
/org/:orgId/projects/:projectId/customers/:customerId
```

```ts
export const routes: Routes = [
  {
    path: 'org/:orgId',
    component: Organization,
    children: [
      {
        path: 'projects/:projectId',
        component: Project,
        children: [
          {
            path: 'customers/:customerId',
            component: Customer,
          },
        ],
      },
    ],
  },
];
```

```ts
@Component({/* ... */})
export class Customer {
  private route = inject(ActivatedRoute);

  // All parent parameters are available directly
  orgId = this.route.snapshot.params['orgId'];
  projectId = this.route.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

若要還原舊有行為，請把 `paramsInheritanceStrategy` 設為 `'emptyOnly'`。使用 `'emptyOnly'` 時，子路由只在其路徑為空，或父路由未宣告元件時，才會繼承參數：

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'emptyOnly'}));
```

在這種情況下，`Customer` 元件必須從其祖先路由讀取父參數：

```ts
@Component({/* ... */})
export class Customer {
  private route = inject(ActivatedRoute);

  orgId = this.route.parent?.parent?.snapshot.params['orgId'];
  projectId = this.route.parent?.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

### 決定 URL 更新的時機

`urlUpdateStrategy` 決定 Angular 何時寫入瀏覽器網址列。預設的 `'deferred'` 會等到導覽成功後才變更 URL。使用 `'eager'` 可在導覽一開始就立即更新。急切更新讓你在導覽因守衛或錯誤而失敗時，更容易呈現嘗試使用的 URL；但若守衛執行時間較長，可能會短暫顯示進行中的 URL。

當你的分析管線即使在守衛阻擋時也需要看到嘗試使用的路由時，可以考慮這個設定。

```ts
provideRouter(routes, withRouterConfig({urlUpdateStrategy: 'eager'}));
```

### 選擇預設的查詢參數處理方式

`defaultQueryParamsHandling` 為 `Router.createUrlTree` 設定後備行為：當呼叫時未指定 `queryParamsHandling`，就以此為準。`'replace'` 是預設值，會換掉現有的查詢字串；`'merge'` 把提供的值與目前的值合併；`'preserve'` 則保留現有的查詢參數，除非你明確提供新的參數。

```ts
provideRouter(routes, withRouterConfig({defaultQueryParamsHandling: 'merge'}));
```

這對搜尋與篩選頁面特別有幫助：在提供額外參數時，能自動保留現有的篩選條件。

### 設定尾隨斜線處理

預設情況下，`Location` 服務在讀取 URL 時會去掉尾隨斜線。

你可以在應用程式中提供 `TrailingSlashPathLocationStrategy`，設定 `Location` 服務，強制在寫入瀏覽器的所有 URL 上加上尾隨斜線。

```ts
import {LocationStrategy, TrailingSlashPathLocationStrategy} from '@angular/common';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy}],
});
```

你也可以提供 `NoTrailingSlashPathLocationStrategy`，強制 `Location` 服務在寫入瀏覽器的所有 URL 上永遠不加尾隨斜線。

```ts
import {LocationStrategy, NoTrailingSlashPathLocationStrategy} from '@angular/common';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: NoTrailingSlashPathLocationStrategy}],
});
```

這些策略只影響寫入瀏覽器的 URL。
`Location.path()` 與 `Location.normalize()` 在讀取 URL 時，仍會繼續去掉尾隨斜線。

Angular 路由公開了四個主要的自訂領域：

  <docs-pill-row>
    <docs-pill href="#route-reuse-strategy" title="路由重用策略"/>
    <docs-pill href="#preloading-strategy" title="預載策略"/>
    <docs-pill href="#url-handling-strategy" title="URL 處理策略"/>
    <docs-pill href="#custom-route-matchers" title="自訂路由比對器"/>
  </docs-pill-row>

## 路由重用策略 {#route-reuse-strategy}

路由重用策略控制 Angular 在導覽期間是銷毀並重新建立元件，還是保留元件以供重用。預設情況下，Angular 在導覽離開一條路由時會銷毀元件實例，在導覽回來時建立新的實例。

### 何時實作路由重用

自訂路由重用策略對有下列需求的應用程式有益：

- **表單狀態保留**：使用者導覽離開再回來時，保留填寫到一半的表單
- **昂貴資料的保留**：避免重新擷取大型資料集或複雜計算
- **捲動位置維護**：在長清單或無限捲動的實作中保留捲動位置
- **分頁式介面**：在分頁之間切換時維持元件狀態

### 建立自訂路由重用策略

Angular 的 `RouteReuseStrategy` 類別讓你透過「分離路由控點」的概念，自訂導覽行為。

「分離路由控點」是 Angular 儲存元件實例及其整個檢視階層的方式。當路由被分離時，Angular 會把元件實例、其子元件以及所有相關狀態保存在記憶體中。這份保留的狀態之後可以在導覽回到該路由時重新接上。

`RouteReuseStrategy` 類別提供下列方法，控制路由元件的生命週期：

| 方法                                                                           | 說明                                                                                                |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [`shouldDetach`](api/router/RouteReuseStrategy#shouldDetach)                   | 判斷在導覽離開時，路由是否應被儲存以供之後重用                                                      |
| [`store`](api/router/RouteReuseStrategy#store)                                 | 當 `shouldDetach` 回傳 true 時，儲存分離的路由控點                                                  |
| [`shouldAttach`](api/router/RouteReuseStrategy#shouldAttach)                   | 判斷在導覽到該路由時，是否應重新接上已儲存的路由                                                    |
| [`retrieve`](api/router/RouteReuseStrategy#retrieve)                           | 回傳先前儲存的路由控點以供重新接上                                                                  |
| [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute)           | 判斷在導覽期間，路由是否應重用目前的路由實例，而不是將其銷毀                                        |
| [`shouldDestroyInjector`](api/router/RouteReuseStrategy#shouldDestroyInjector) | 判斷當分離的路由不再被儲存時，路由是否應銷毀其注入器                                                |

下列範例示範了一個自訂路由重用策略，它依據路由中繼資料選擇性地保留元件狀態：

```ts
import {
  RouteReuseStrategy,
  Route,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Determines if a route should be stored for later reuse
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Stores the detached route handle when shouldDetach returns true
    if (handle && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Checks if a stored route should be reattached
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Returns the stored route handle for reattachment
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true ? (this.handlers.get(key) ?? null) : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Determines if the router should reuse the current route instance
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }
}
```

IMPORTANT: 繼承的路由[資源](guide/routing/data-fetching-with-resources#resource-inheritance)在搭配自訂 `RouteReuseStrategy` 時無法運作，若該策略分離了某條路由，卻沒有同時分離其所依賴資源的祖先路由。

### 手動銷毀分離的路由控點

實作自訂 `RouteReuseStrategy` 時，若你決定丟棄某個 `DetachedRouteHandle` 而不重新接上，可能需要手動將其銷毀。例如，若你的策略有快取大小上限，或在一段時間後讓控點過期，你必須確保元件及其狀態被正確銷毀，以避免記憶體洩漏。

由於 `DetachedRouteHandle` 是不透明型別，你無法直接對它呼叫銷毀方法。請改用路由提供的 `destroyDetachedRouteHandle` 函式。

```ts
import {destroyDetachedRouteHandle} from '@angular/router';

// ... inside your strategy
if (this.handles.size > MAX_CACHE_SIZE) {
  const handle = this.handles.get(oldestKey);
  if (handle) {
    destroyDetachedRouteHandle(handle);
    this.handles.delete(oldestKey);
  }
}
```

NOTE: 當涉及 `canMatch` 守衛時，應避免使用路由路徑作為鍵，否則可能導致重複的項目。

### 自動清理未使用的路由注入器 {#automatic-cleanup-of-unused-route-injectors}

預設情況下，即使分離的路由不再被 `RouteReuseStrategy` 儲存，Angular 也不會銷毀它們的注入器。這主要是因為對大多數應用程式而言，這一層級的記憶體管理並不常用。

若要啟用未使用路由注入器的自動清理，可在路由設定中使用 `withAutoCleanupInjectors` 功能。此功能會在導覽後檢查策略目前儲存了哪些路由，並銷毀所有未被重用策略儲存的分離路由的注入器。

```ts
import {provideRouter, withAutoCleanupInjectors} from '@angular/router';
import {ApplicationConfig} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withAutoCleanupInjectors())],
};
```

若你沒有提供自訂的 `RouteReuseStrategy`，或你的自訂策略繼承自 `BaseRouteReuseStrategy`，注入器現在會在路由處於非作用中狀態時被銷毀。

#### 搭配自訂 `RouteReuseStrategy` 的清理

若你的應用程式使用自訂 `RouteReuseStrategy`，_而且_該策略沒有繼承 `BaseRouteReuseStrategy`，你必須實作 `shouldDestroyInjector`，告訴路由哪些路由的注入器應被銷毀：

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  // ... other methods

  shouldDestroyInjector(route: Route): boolean {
    return !route.data['retainInjector'];
  }
}
```

若你的策略曾儲存 `DetachedRouteHandle`，你還需要把這些控點告訴路由，讓它不會銷毀該分離控點所需的任何注入器：

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private readonly handles = new Map<Route, DetachedRouteHandle>();

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null) {
    if (handle) {
      this.handles.set(route.routeConfig!, handle);
    }
  }

  retrieveStoredRouteHandles(): DetachedRouteHandle[] {
    return Array.from(this.handles.values());
  }

  // ... other methods
}
```

### 設定路由使用自訂路由重用策略

路由可以透過路由設定中繼資料選擇啟用重用行為。這種做法讓重用邏輯與元件程式碼分離，調整行為時不需要修改元件：

```ts
export const routes: Routes = [
  {
    path: 'products',
    component: ProductList,
    data: {reuse: true}, // Component state persists across navigations
  },
  {
    path: 'products/:id',
    component: ProductDetail,
    // No reuse flag - component recreates on each navigation
  },
  {
    path: 'search',
    component: Search,
    data: {reuse: true}, // Preserves search results and filter state
  },
];
```

你也可以透過 Angular 的依賴注入系統，在應用程式層級設定自訂路由重用策略。在這種情況下，Angular 會建立策略的單一實例，管理整個應用程式的所有路由重用決策：

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
  ],
};
```

## 預載策略 {#preloading-strategy}

預載策略決定 Angular 何時在背景載入延遲載入的路由模組。雖然延遲載入透過延後模組下載改善了初始載入時間，但使用者第一次導覽到延遲路由時仍會感受到延遲。預載策略透過在使用者請求之前先載入模組，消除了這個延遲。

### 內建的預載策略

Angular 開箱即提供兩個預載策略：

| 策略                                                | 說明                                                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`NoPreloading`](api/router/NoPreloading)           | 預設策略，停用所有預載。換句話說，模組只在使用者導覽到它們時才載入 |
| [`PreloadAllModules`](api/router/PreloadAllModules) | 在初始導覽後立即載入所有延遲載入的模組                                           |

`PreloadAllModules` 策略的設定方式如下：

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withPreloading, PreloadAllModules} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withPreloading(PreloadAllModules))],
};
```

`PreloadAllModules` 策略很適合中小型應用程式：下載所有模組不會顯著影響效能。不過，擁有許多功能模組的大型應用程式，可能更適合更具選擇性的預載。

### 建立自訂預載策略

自訂預載策略實作 `PreloadingStrategy` 介面，該介面要求一個 `preload` 方法。此方法接收路由設定，以及一個觸發實際模組載入的函式。策略會回傳一個 Observable，在預載完成時發出值，或回傳空的 Observable 以略過預載：

```ts
import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route} from '@angular/router';
import {Observable, of, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload routes marked with data: { preload: true }
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

這個選擇性策略會檢查路由中繼資料來決定預載行為。路由可以透過其設定選擇啟用預載：

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    data: {preload: true}, // Preload immediately after initial navigation
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes'),
    data: {preload: false}, // Only load when user navigates to reports
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
    // No preload flag - won't be preloaded
  },
];
```

### 預載的效能考量

預載同時影響網路用量與記憶體消耗。每個預載的模組都會消耗頻寬，並增加應用程式的記憶體足跡。在按流量計費的連線上，行動使用者可能偏好最少的預載；使用高速網路的桌面使用者則可以承受積極的預載策略。

預載的時機也很重要。在初始載入後立即預載，可能會與圖片或 API 呼叫等其他關鍵資源競爭。策略應考量應用程式在載入後的行為，並與其他背景任務協調，以避免效能下降。

瀏覽器的資源限制也會影響預載行為。瀏覽器會限制同時的 HTTP 連線數，因此積極的預載可能會排在其他請求之後。Service Worker 可以提供對快取與網路請求的細粒度控制，輔助預載策略。

## URL 處理策略 {#url-handling-strategy}

URL 處理策略決定 Angular 路由處理哪些 URL、忽略哪些 URL。預設情況下，Angular 會嘗試處理應用程式內的所有導覽事件，但真實世界的應用程式經常需要與其他系統共存、處理外部連結，或與管理自身路由的舊有應用程式整合。

`UrlHandlingStrategy` 類別讓你控制 Angular 管理的路由與外部 URL 之間的界線。當把應用程式逐步遷移到 Angular，或 Angular 應用程式需要與其他框架共用 URL 空間時，這一點至關重要。

### 實作自訂 URL 處理策略

自訂 URL 處理策略繼承 `UrlHandlingStrategy` 類別並實作三個方法。`shouldProcessUrl` 方法決定 Angular 是否應處理某個 URL，`extract` 回傳 Angular 應處理的 URL 部分，`merge` 則把 URL 片段與 URL 的其餘部分合併：

```ts
import {Injectable} from '@angular/core';
import {UrlHandlingStrategy, UrlTree} from '@angular/router';

@Injectable()
export class CustomUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree): boolean {
    // Only handle URLs that start with /app or /admin
    return url.toString().startsWith('/app') || url.toString().startsWith('/admin');
  }

  extract(url: UrlTree): UrlTree {
    // Return the URL unchanged if we should process it
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    // Combine the URL fragment with the rest of the URL
    return newUrlPart;
  }
}
```

這個策略在 URL 空間中建立了明確的界線。Angular 處理 `/app` 與 `/admin` 路徑，忽略其他所有路徑。當遷移舊有應用程式、由 Angular 控制特定區段、舊有系統維護其他區段時，這種模式運作得很好。

### 設定自訂 URL 處理策略

你可以透過 Angular 的依賴注入系統註冊自訂策略：

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter, UrlHandlingStrategy} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy},
  ],
};
```

## 自訂路由比對器 {#custom-route-matchers}

預設情況下，Angular 路由會依定義順序逐一檢查路由，嘗試把 URL 路徑與每條路由的路徑模式比對。它支援靜態區段、參數化區段（`:id`）與萬用字元（`**`）。第一條相符的路由獲勝，路由隨即停止搜尋。

當應用程式需要基於執行階段條件、複雜 URL 模式或其他自訂規則的更精細比對邏輯時，自訂比對器提供了這種彈性，同時不犧牲標準路由的簡潔。

路由會在路由比對階段（路徑比對發生之前）評估自訂比對器。當比對器回傳成功的比對結果時，它也可以從 URL 中抽取參數，讓這些參數能像標準路由參數一樣供啟用的元件使用。

### 建立自訂比對器

自訂比對器是一個函式，接收 URL 區段，並回傳包含已消耗區段與參數的比對結果，或回傳 null 表示不相符。比對器函式會在 Angular 評估路由的 path 屬性之前執行：

```ts
import {Route, UrlSegment, UrlSegmentGroup, UrlMatchResult} from '@angular/router';

export function customMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route,
): UrlMatchResult | null {
  // Matching logic here
  if (matchSuccessful) {
    return {
      consumed: segments,
      posParams: {
        paramName: new UrlSegment('paramValue', {}),
      },
    };
  }
  return null;
}
```

### 實作以版本為基礎的路由

考慮一個 API 文件網站，它需要依據 URL 中的版本號進行路由。不同版本可能有不同的元件結構或功能集：

```ts
import {Routes, UrlSegment, UrlMatchResult} from '@angular/router';

export function versionMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  // Match patterns like /v1/docs, /v2.1/docs, /v3.0.1/docs
  if (segments.length >= 2 && segments[0].path.match(/^v\d+(\.\d+)*$/)) {
    return {
      consumed: segments.slice(0, 2), // Consume version and 'docs'
      posParams: {
        version: segments[0], // Make version available as a parameter
        section: segments[1], // Make section available too
      },
    };
  }
  return null;
}

// Route configuration
export const routes: Routes = [
  {
    matcher: versionMatcher,
    component: Documentation,
  },
  {
    path: 'latest/docs',
    redirectTo: 'v3/docs',
  },
];
```

元件透過路由輸入接收抽取出的參數：

```angular-ts
import {Component, input, inject, resource} from '@angular/core';

@Component({
  selector: 'app-documentation',
  template: `
    @if (documentation.isLoading()) {
      <div>Loading documentation...</div>
    } @else if (documentation.error()) {
      <div>Error loading documentation</div>
    } @else if (documentation.value(); as docs) {
      <article>{{ docs.content }}</article>
    }
  `,
})
export class Documentation {
  // Route parameters are automatically bound to signal inputs
  version = input.required<string>(); // Receives the version parameter
  section = input.required<string>(); // Receives the section parameter

  private docsService = inject(DocumentationService);

  // Resource automatically loads documentation when version or section changes
  documentation = resource({
    params: () => {
      if (!this.version() || !this.section()) return;

      return {
        version: this.version(),
        section: this.section(),
      };
    },
    loader: ({params}) => {
      return this.docsService.loadDocumentation(params.version, params.section);
    },
  });
}
```

### 感知語系的路由

國際化應用程式經常把語系資訊編碼在 URL 中。自訂比對器可以抽取語系代碼，路由到適當的元件，同時把語系作為參數提供：

```ts
// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export function localeMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0) {
    const potentialLocale = segments[0].path;

    if (locales.includes(potentialLocale)) {
      // This is a locale prefix, consume it and continue matching
      return {
        consumed: [segments[0]],
        posParams: {
          locale: segments[0],
        },
      };
    } else {
      // No locale prefix, use default locale
      return {
        consumed: [], // Don't consume any segments
        posParams: {
          locale: new UrlSegment('en', {}),
        },
      };
    }
  }

  return null;
}
```

### 複雜商業邏輯比對

自訂比對器擅長實作難以用路徑模式表達的商業規則。考慮一個電子商務網站，產品 URL 會依據產品類型遵循不同的模式：

```ts
export function productMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return null;

  const firstSegment = segments[0].path;

  // Books: /isbn-1234567890
  if (firstSegment.startsWith('isbn-')) {
    return {
      consumed: [segments[0]],
      posParams: {
        productType: new UrlSegment('book', {}),
        identifier: new UrlSegment(firstSegment.substring(5), {}),
      },
    };
  }

  // Electronics: /sku/ABC123
  if (firstSegment === 'sku' && segments.length > 1) {
    return {
      consumed: segments.slice(0, 2),
      posParams: {
        productType: new UrlSegment('electronics', {}),
        identifier: segments[1],
      },
    };
  }

  // Clothing: /style/BRAND/ITEM
  if (firstSegment === 'style' && segments.length > 2) {
    return {
      consumed: segments.slice(0, 3),
      posParams: {
        productType: new UrlSegment('clothing', {}),
        brand: segments[1],
        identifier: segments[2],
      },
    };
  }

  return null;
}
```

### 自訂比對器的效能考量

自訂比對器會在每次導覽嘗試時執行，直到找到相符項為止。因此，複雜的比對邏輯可能影響導覽效能，在擁有許多路由的應用程式中尤其如此。讓比對器保持專注且有效率：

- 在不可能相符時提早回傳
- 避免 API 呼叫或複雜正規表示式等昂貴操作
- 考慮為重複出現的 URL 模式快取結果

自訂比對器能優雅地解決複雜的路由需求，但過度使用會讓路由設定更難理解與維護。請把自訂比對器保留給標準路徑比對確實不足的情境。
