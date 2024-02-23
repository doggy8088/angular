# 導覽概述

對於大多數應用程式，會遇到應用程式需要多於一個頁面的情況。當這情況不可避免地發生時，路由就成為使用者效能故事的重要元素。

在這個活動中，您將學習如何設定和配置您的應用程式以使用 Angular Router。

<hr>

<docs-workflow>

<docs-step title="建立 app.route.ts 檔案">

在 `app.routes.ts` 內，做出以下變更：

1. 從 `@angular/router` 套件匯入 `Routes`。
1. 匯出一個名為 `routes` 的常數，類型為 `Routes`，將 `[]` 指定為值。

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="將路由新增至提供者">

在 `app.config.ts` 中，以下列步驟將應用程式設定為 Angular Router：

1. 從 `@angular/router` 匯入 `provideRouter` 函式。
1. 從 `./app.routes.ts` 匯入 `routes`。
1. 在 `providers` 陣列中呼叫 `provideRouter` 函式，並將 `routes` 傳入作為參數。

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

最後，為了確保您的應用程式已準備好使用 Angular Router，您需要告訴應用程式您預期路由器會在哪裡顯示所需的內容。使用 `@angular/router` 中的 `RouterOutlet` 指令來完成此操作。

通過添加 `<router-outlet />` 來更新 `AppComponent` 的範本`

<docs-code language="ts" highlight="[11]">
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

您的應用程式現在已設定好使用 Angular Router。幹得好！ 🙌

保持動力，學習為我們的應用程式定義路由的下一步。
