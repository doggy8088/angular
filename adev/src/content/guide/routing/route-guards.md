# 使用守衛控制路由存取

CRITICAL: 千萬不要只依賴用戶端的路由守衛來作為唯一的存取控制手段。所有在網頁瀏覽器中執行的 JavaScript，都可能被使用該瀏覽器的人加以修改。除了用戶端的守衛之外，請務必同時在伺服器端強制執行使用者的授權檢查。

路由守衛是一種函式，可以控制使用者是否能夠導覽到某個特定路由，或是離開某個特定路由。它們就像一道道檢查點，管理著使用者能否存取特定路由。使用路由守衛的常見情境，包括身分驗證與存取控制。

## 建立路由守衛

你可以使用 Angular CLI 來產生一個路由守衛：

```bash
ng generate guard CUSTOM_NAME
```

執行後，系統會提示你選擇要使用哪一種[路由守衛類型](#types-of-route-guards)，並建立對應的 `CUSTOM_NAME-guard.ts` 檔案。

TIP: 你也可以在 Angular 專案中建立一個獨立的 TypeScript 檔案，手動建立路由守衛。開發者通常會在檔案名稱後加上 `-guard.ts` 後綴，讓它和其他檔案有所區別。

## 路由守衛的回傳類型 {#route-guard-return-types}

所有的路由守衛都具有相同的回傳類型選項。這讓你能更靈活地控制導覽流程：

| 回傳類型                        | 說明                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| `boolean`                       | `true` 表示允許導覽，`false` 表示阻擋導覽（請參閱 `CanMatch` 路由守衛的備註）             |
| `UrlTree` 或 `RedirectCommand`  | 改為重新導向到另一個路由，而不是直接阻擋導覽                                              |
| `Promise<T>` 或 `Observable<T>` | Router 會採用第一個發出的值，然後解除訂閱                                                 |

Note: `CanMatch` 的行為有所不同：當它回傳 `false` 時，Angular 會嘗試其他可比對的路由，而不是完全阻擋導覽。

## 路由守衛的類型 {#types-of-route-guards}

Angular 提供了四種類型的路由守衛，每一種都有不同的用途：

<docs-pill-row>
  <docs-pill href="#canactivate" title="CanActivate"/>
  <docs-pill href="#canactivatechild" title="CanActivateChild"/>
  <docs-pill href="#candeactivate" title="CanDeactivate"/>
  <docs-pill href="#canmatch" title="CanMatch"/>
</docs-pill-row>

### CanActivate {#canactivate}

`CanActivate` 守衛用來決定使用者是否可以存取某個路由。它最常被用在身分驗證與授權這類情境上。

它可以存取以下這些預設引數：

- `route: ActivatedRouteSnapshot`：包含即將被啟用的路由相關資訊
- `state: RouterStateSnapshot`：包含路由器目前的狀態

它可以回傳[標準的守衛回傳類型](#route-guard-return-types)。

```ts
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

Tip: 如果你需要將使用者重新導向到其他地方，請回傳一個 [`URLTree`](api/router/UrlTree) 或 [`RedirectCommand`](api/router/RedirectCommand)，**不要**回傳 `false` 後，再透過程式來 `navigate` 使用者。

如需更多資訊，請參閱 [CanActivateFn 的 API 文件](api/router/CanActivateFn)。

### CanActivateChild {#canactivatechild}

`CanActivateChild` 守衛用來決定使用者是否可以存取某個父路由底下的子路由。當你想要保護一整段巢狀路由時，這非常好用。換句話說，`canActivateChild` 會針對_所有_的子路由執行。假如某個子元件底下還嵌套了另一個子元件，則 `canActivateChild` 會針對這兩個元件各執行一次。

它可以存取以下這些預設引數：

- `childRoute: ActivatedRouteSnapshot`：包含即將被啟用的子路由之「未來」快照（也就是路由器試圖導覽前往的狀態）的相關資訊
- `state: RouterStateSnapshot`：包含路由器目前的狀態

它可以回傳[標準的守衛回傳類型](#route-guard-return-types)。

```ts
export const adminChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

如需更多資訊，請參閱 [CanActivateChildFn 的 API 文件](api/router/CanActivateChildFn)。

### CanDeactivate {#candeactivate}

`CanDeactivate` 守衛用來決定使用者是否可以離開某個路由。一個常見的情境，就是避免使用者在尚未儲存表單的狀態下離開。

它可以存取以下這些預設引數：

- `component: T`：即將被停用的元件實例
- `currentRoute: ActivatedRouteSnapshot`：包含目前路由的相關資訊
- `currentState: RouterStateSnapshot`：包含目前路由器的狀態
- `nextState: RouterStateSnapshot`：包含即將導覽前往的下一個路由器狀態

它可以回傳[標準的守衛回傳類型](#route-guard-return-types)。

```ts
export const unsavedChangesGuard: CanDeactivateFn<FormComponent> = (component: FormComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
```

如需更多資訊，請參閱 [CanDeactivateFn 的 API 文件](api/router/CanDeactivateFn)。

### CanMatch {#canmatch}

`CanMatch` 守衛用來決定某個路由在路徑比對期間是否能夠被成功配對。與其他守衛不同的是，一旦它拒絕配對，系統並不會直接阻擋所有導覽流程，而是會接著去嘗試比對其他符合的路由。這對於功能開關、A/B 測試，或是條件式載入路由等情境都相當好用。

它可以存取以下這些預設引數：

- `route: Route`：即將被評估的路由設定
- `segments: UrlSegment[]`：尚未被先前的父路由評估所消耗掉的 URL 區段

它可以回傳[標準的守衛回傳類型](#route-guard-return-types)，但當它回傳 `false` 時，Angular 會嘗試比對其他路由，而不是完全阻擋導覽。

```ts
export const featureToggleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};
```

它還能讓你針對相同的路徑使用不同的元件。

```ts
// 📄 routes.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard]
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard]
  }
]
```

在這個範例中，當使用者造訪 `/dashboard` 時，系統會使用第一個通過正確守衛檢查的路由。

如需更多資訊，請參閱 [CanMatchFn 的 API 文件](api/router/CanMatchFn)。

## 將守衛套用到路由上

當你建立好路由守衛後，需要在路由定義中設定它們。

守衛在路由設定中以陣列的形式指定，以便你能為單一個路由套用多個守衛。它們會依照在陣列中出現的順序執行。

```ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { featureToggleGuard } from './guards/feature-toggle.guard';

const routes: Routes = [
  // Basic CanActivate - requires authentication
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Multiple CanActivate guards - requires authentication AND admin role
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard]
  },

  // CanActivate + CanDeactivate - protected route with unsaved changes check
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard]
  },

  // CanActivateChild - protects all child routes
  {
    path: 'users', // /user - NOT protected
    canActivateChild: [authGuard],
    children: [
      // /users/list - PROTECTED
      { path: 'list', component: UserListComponent },
      // /users/detail/:id - PROTECTED
      { path: 'detail/:id', component: UserDetailComponent }
    ]
  },

  // CanMatch - conditionally matches route based on feature flag
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canMatch: [featureToggleGuard]
  },

  // Fallback route if beta feature is disabled
  {
    path: 'beta-feature',
    component: ComingSoonComponent
  }
];
```
