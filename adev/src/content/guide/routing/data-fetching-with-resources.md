# 使用資源擷取資料

IMPORTANT: 路由資源目前處於[開發者預覽](reference/releases#developer-preview)階段。

Angular 路由透過 `resources` 路由設定與 Angular 訊號整合。這讓你能使用 `Resource` API，以反應式的方式擷取資料。

## 為什麼使用路由資源？

相較於傳統的[資料解析器](/guide/routing/data-resolvers)，路由資源有幾項優勢：

- **平行執行**：所有相符路由的路由資源會同時載入，而不是一次一條路由。
- **非阻擋式資料載入**：使用 `nonBlocking()` 可立即啟用路由，並在資料於背景載入時，先渲染載入骨架或 UI 狀態。
- **不需重新導覽即可重新載入**：呼叫個別資源的 `.reload()`，或更新訊號參數，就能重新整理資料，而不需重新執行守衛或重新比對路由。
- **反應式資料擷取**：資源直接與 Angular 訊號整合，當訊號相依性改變時會自動重新評估，並公開 `isLoading()`、`error()` 等反應式狀態訊號。

## 啟用路由資源

若要啟用路由資源，請在路由設定中提供 `withRouterResources()`：

```ts
import {provideRouter, withComponentInputBinding, withRouterResources} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding(), withRouterResources())],
});
```

TIP: 啟用 `withComponentInputBinding()`，讓路由能把解析後的資源直接繫結到元件輸入。

## 定義路由資源

你可以使用 `resources` 函式在路由上定義資源。此函式在注入情境中執行，因此你可以直接在路由定義內使用 `inject()` 存取服務、API 用戶端或 store。

```angular-ts
import {Component, inject, input, resource} from '@angular/core';
import {Routes} from '@angular/router';
import {UserService} from './user.service';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const userService = inject(UserService);
      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: ({params: id}) => userService.getUser(id),
        }),
      };
    },
  },
];

@Component({
  template: `<p>User: {{ user().name }}</p>`,
})
export class UserProfile {
  // The router binds only the value for blocking resources.
  user = input.required<User>();
}
```

### `ResourceContext` 物件

`resources` 函式接收一個 `ResourceContext`，它提供：

- 路由訊號：`params`、`queryParams`、`fragment` 與 `data`。
- `resources`：從祖先路由繼承的資源訊號。請參閱[資源繼承](#resource-inheritance)。

### 支援的資源實作

`resources` 函式可以回傳任何 Angular `Resource` 實作，例如 `resource()`、`rxResource()` 或自訂資源。

```ts
import {Routes} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => ({
      user: rxResource({
        params: () => ctx.params()['id'],
        stream: ({params: id}) => fetchUserObservable(id),
      }),
    }),
  },
];
```

NOTE: `rxResource` 使用 `stream` 屬性而非 `loader`，來接受一個回傳 Observable 的函式。

`resources` 函式也可以是 `async` 並回傳 `Promise`，若你需要在設定資源之前執行非同步設定或動態匯入：

```ts
resources: async (ctx) => {
  const injector = inject(Injector);
  const {fetchUserData} = await import('./user-api');
  return {
    user: resource({
      params: () => ctx.params()['id'],
      loader: ({params: id}) => fetchUserData(id),
      injector,
    }),
  };
},
```

## 使用訊號進行細粒度變更追蹤

資源會追蹤其 `params` 函式讀取的訊號。請讀取你需要的確切值，讓資源只在該值改變時才重新擷取：

```ts
resources: (ctx) => ({
  products: resource({
    // Tracks only the 'category' query parameter
    params: () => ctx.queryParams()['category'],
    loader: ({params: category}) => fetchProducts(category),
  }),
}),
```

改變不相關查詢參數（例如 `?sort=desc` 或 `?page=2`）的導覽，會讓 `category` 保持不變，因此資源不會重新擷取。

TIP: 請讀取特定屬性，例如 `ctx.params()['id']`，而不是回傳整個參數物件，例如 `ctx.params()`。路由在每次導覽時都會建立新的物件，因此回傳整個物件會讓資源即使在個別值未改變時也重新擷取。

## 平行執行

資料解析器會從父路由到子路由依序執行。若父路由解析器花費 200ms、子路由解析器花費 300ms，導覽會被阻擋 500ms。

在相符的路由階層中，路由資源會同時執行，因此同樣的導覽在 300ms 內完成，也就是最慢的資源所花的時間。依賴祖先路由資料的資源也會立即設定，不需等待；請參閱[從祖先資源鏈接出新資源](#chaining-a-resource-off-an-ancestor-resource)。

## 資源繼承 {#resource-inheritance}

每條路由都會繼承其祖先路由的資源。Angular 以兩種形式公開這些繼承的資源：

| API                                                               | 內容                                     | 行為                                                                                            | 用途                                                       |
| :---------------------------------------------------------------- | :--------------------------------------- | :---------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| 在 `resources` 函式內的 `ctx.resources()`                         | 僅祖先資源                               | 祖先 `resources` 函式回傳的原始資源。其狀態永遠是即時的。                                       | 從祖先資源鏈接出新資源                                     |
| `ActivatedRoute.resources` 與 `ActivatedRouteSnapshot.resources`  | 路由自身的資源與祖先資源                 | 由路由管理的唯讀資源。在導覽待處理期間，其狀態會被凍結。                                        | 從元件、指令或守衛讀取資料，或呼叫 `reload()`              |

若一條路由定義了與祖先資源同名的資源，路由自身的資源會遮蔽繼承的資源。

### 把繼承的資源繫結到元件輸入

透過 `withComponentInputBinding()`，路由會把繼承的資源與路由自身的資源都繫結到相符的元件輸入：

```angular-ts
import {Component, input, resource} from '@angular/core';
import {Routes} from '@angular/router';

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
}

const routes: Routes = [
  {
    path: 'projects/:projectId',
    resources: (ctx) => ({
      project: resource({
        params: () => ctx.params()['projectId'],
        loader: ({params: id}) => fetchProject(id),
      }),
    }),
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskDetail,
        resources: (ctx) => ({
          task: resource({
            params: () => ctx.params()['taskId'],
            loader: ({params: id}) => fetchTask(id),
          }),
        }),
      },
    ],
  },
];

@Component({
  template: `
    <h1>Project: {{ project().name }}</h1>
    <h2>Task: {{ task().title }}</h2>
  `,
})
export class TaskDetail {
  // Inherited from the parent 'projects/:projectId' route
  project = input.required<Project>();

  // Bound from the route's own resource
  task = input.required<Task>();
}
```

NOTE: 當路由把路由狀態繫結到元件輸入時，資源名稱的優先順序高於路由 `data`（包含解析後的值）、路徑參數與查詢參數。

### 從祖先資源鏈接出新資源 {#chaining-a-resource-off-an-ancestor-resource}

子路由經常需要祖先路由的資料，才能載入自己的資料。子路由不需等待祖先路由完成載入，可使用 [`chain()`](/guide/signals/resource#chaining-resources) 把自己的 `params` 函式鏈接到祖先資源。Angular 會把包含 `chain` 的情境物件傳給每個 `params` 函式：

```ts
import {Resource, resource} from '@angular/core';
import {Routes} from '@angular/router';

interface User {
  id: string;
  role: string;
}

const routes: Routes = [
  {
    path: 'user/:id',
    resources: (ctx) => ({
      user: resource({
        params: () => ctx.params()['id'],
        loader: ({params: id}) => fetchUser(id),
      }),
    }),
    children: [
      {
        path: 'details',
        component: UserDetails,
        resources: (ctx) => ({
          details: resource({
            // Retains the loading state until the inherited 'user' resource resolves
            params: ({chain}) => chain(ctx.resources()['user'] as Resource<User>).role,
            loader: ({params: role}) => fetchRoleDetails(role),
          }),
        }),
      },
    ],
  },
];
```

IMPORTANT: 絕不要在外層 `resources` 函式主體中直接解構或呼叫 `ctx.resources()`（例如 `const {user} = ctx.resources()`）。因為祖先路由會平行初始化，且可能以非同步方式進行，所以在路由設定期間，祖先資源尚不可用。在反應式情境之外同步呼叫 `ctx.resources()` 會拋出錯誤並使導覽失敗。請務必在資源的 `params` 函式內，以反應式的方式讀取 `ctx.resources()`。

NOTE: 由於 `ctx.resources()` 的型別是 `Resource<unknown>` 的紀錄，讀取繼承的資源時，請把它轉型為其值型別（例如 `as Resource<User>`）。

`chain()` 也會傳播祖先資源的狀態。若祖先發生錯誤，鏈接的資源會以 `ResourceDependencyError` 發生錯誤，而當該鏈接資源是阻擋型時，路由會取消導覽。若祖先處於 `idle`，鏈接的資源會變成 `idle`。

## 阻擋型與非阻擋型資源 {#blocking-and-non-blocking-resources}

預設情況下，從 `resources` 回傳的每個資源都是阻擋型的：路由會等到資料完全載入後，才啟用路由與元件。

對於阻擋型資源，路由會把解析後的值繫結到元件輸入，因此輸入的型別是 `T` 而非 `Resource<T>`。元件永遠不會觀察到 `loading` 狀態，因為路由會阻擋導覽直到資源載入完成；也不會觀察到 `error` 狀態，因為資源發生錯誤時路由會取消導覽。

若想改在 UI 中處理載入狀態，請把資源包裝在 `nonBlocking()` 中。路由會立即啟用元件，並把完整的 `Resource<T>` 物件繫結到元件輸入，讓你能存取 `isLoading()`、`error()` 以及其他資源訊號。

```angular-ts
import {Component, input, Resource, resource} from '@angular/core';
import {Routes, nonBlocking} from '@angular/router';

const routes: Routes = [
  {
    path: 'reports',
    component: Reports,
    resources: () => ({
      reportData: nonBlocking(
        resource({
          loader: () => fetchHeavyReportData(),
        }),
      ),
    }),
  },
];

@Component({
  template: `
    @if (reportData().isLoading()) {
      <p>Loading...</p>
    } @else if (reportData().error()) {
      <p>Error loading report.</p>
    } @else if (reportData().hasValue()) {
      <report-view [data]="reportData().value()" />
    }
  `,
})
export class Reports {
  reportData = input.required<Resource<ReportData>>();
}
```

NOTE: 若阻擋型資源發生錯誤，路由會取消導覽並發出 `NavigationError` 事件。包裝在 `nonBlocking()` 中的資源會完成導覽，並透過其 `error()` 訊號公開失敗。

### 從資源重新導向

若阻擋型資源需要重新導向使用者（例如找不到某個項目時），請在資源載入器內拋出 `RedirectCommand`。路由會取消目前的導覽，並重新導向到指定的 URL：

```ts
import {inject, resource} from '@angular/core';
import {RedirectCommand, Router, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const router = inject(Router);

      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: async ({params: id}) => {
            const user = await fetchUser(id);
            if (!user) {
              throw new RedirectCommand(router.parseUrl('/not-found'));
            }
            return user;
          },
        }),
      };
    },
  },
];
```

## 不需重新導覽即可重新載入資源 {#reloading-resources-without-renavigation}

使用資料解析器時，重新擷取資料需要一次路由導覽（例如以 `onSameUrlNavigation: 'reload'` 導覽），這會重新比對路由，並重新執行守衛與解析器。

路由資源支援兩種就地重新整理資料的方式：

1. **程式化重新載入**：呼叫 `Resource` 實例的 `.reload()`。
2. **反應式重新載入**：更新資源的 `params` 函式讀取的訊號，例如應用程式篩選器或狀態訊號，這會重新執行載入器。

由於路由只把阻擋型資源的值繫結到元件輸入，當你需要呼叫 `.reload()` 或檢查狀態訊號時，請從 `ActivatedRoute` 或 `ActivatedRouteSnapshot` 讀取 `Resource` 實例：

```angular-ts
import {Component, inject, input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <p>User: {{ user().name }}</p>
    <button (click)="refreshUser()">Refresh</button>
  `,
})
export class UserProfile {
  user = input.required<User>();
  private userResource = inject(ActivatedRoute).resources?.['user'];

  refreshUser() {
    // Reloads only this specific resource without renavigating the route
    this.userResource?.reload();
  }
}
```

## 導覽待處理期間的過渡狀態

在導覽待處理期間，路由會凍結它在 `ActivatedRoute` 上公開的資源，遮蔽中間的 `loading` 與 `reloading` 狀態。

若你從 `/user/1` 導覽到 `/user/2`，且路由重用了 `UserProfile` 元件，元件會繼續渲染 `/user/1` 的資料，直到 `/user/2` 解析完成。接著路由會解凍資源，UI 直接過渡到新資料，不會出現載入閃爍。

路由把這些資源公開為唯讀，即使 `resources` 函式回傳的是像 `resource()` 這樣可寫入的資源。你可以讀取資源訊號並呼叫 `reload()`，但不能呼叫 `set()` 或 `update()`。在作用中的導覽期間或回滾復原期間呼叫 `reload()` 會回傳 `false`，使其無法中斷路由的過渡追蹤。

NOTE: 凍結只適用於路由在 `ActivatedRoute` 上公開的資源。透過 `ctx.resources()` 取得的原始資源永遠回報其即時狀態，這正是鏈接資源能在導覽期間對祖先資源做出反應的原因。

### 取消時的回滾復原

若導覽被取消（例如被守衛取消），路由會把狀態樹回復到先前的狀態。這個回復可能導致資源的訊號相依性（例如路由參數）回復到先前的值。

由於參數變回原樣，資源可能自動觸發一次新的載入，為舊參數擷取資料。為避免為已經可見的資料閃爍載入狀態，路由會在 UI 中保留先前的資源快照，直到資源在回復後的狀態中穩定下來。

TIP: 把資源載入器提供的 `abortSignal` 轉傳給你的非同步呼叫（例如 `fetch`）。當路由回滾參數或取代導覽時，待處理的請求會被乾淨地中止：`loader: ({params: id, abortSignal}) => fetchUser(id, {signal: abortSignal})`。
