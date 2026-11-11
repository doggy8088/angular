# 路由概覽

對大多數應用程式來說，總有一刻會需要不只一個頁面。當那一刻無可避免地到來時，路由就會成為使用者效能體驗中的重要一環。

在這個練習中，你將學習如何設定與組態你的應用程式，讓它使用 Angular Router。

<hr>

<docs-workflow>

<docs-step title="建立 app.routes.ts 檔案">

在 `app.routes.ts` 中，進行以下變更：

1. 從 `@angular/router` 套件匯入 `Routes`。
1. 匯出一個名為 `routes` 的常數，型別為 `Routes`，並把 `[]` 指派為它的值。

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="把路由加到提供者中">

在 `app.config.ts` 中，依照以下步驟把應用程式組態為使用 Angular Router：

1. 從 `@angular/router` 匯入 `provideRouter` 函式。
1. 從 `./app.routes.ts` 匯入 `routes`。
1. 在 `providers` 陣列中呼叫 `provideRouter` 函式，並把 `routes` 傳入作為引數。

<docs-code language="ts" highlight="[2,3,6]">
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
</docs-code>

</docs-step>

<docs-step title="在元件中匯入 `RouterOutlet`">

最後，為了確保你的應用程式已準備好使用 Angular Router，你需要告訴應用程式，期望路由器在哪裡顯示想要的內容。使用 `@angular/router` 的 `RouterOutlet` 指令即可做到這一點。

更新 `AppComponent` 的範本，加上 `<router-outlet />`

<docs-code language="angular-ts" highlight="[11]">
import {RouterOutlet} from '@angular/router';

@Component({
  ...
  template: `
    <nav>
      <a href="/">Home</a>
      |
      <a href="/user">User</a>
    </nav>
    <router-outlet />
  `,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {}
</docs-code>

</docs-step>

</docs-workflow>

你的應用程式現在已設定好使用 Angular Router。做得好！🙌

保持這股氣勢，繼續學習下一步：為我們的應用程式定義路由。
