# 定義一個路由

現在您已將應用程式設定為使用 Angular 路由器，您需要定義路由。

在這個活動中，您將學習如何為您的應用程式新增並設定路由。

<hr>

<docs-workflow>

<docs-step title="在 `app.routes.ts` 中定義路由">

在你的 app 中，有兩個頁面要顯示：(1) 首頁和 (2) 使用者頁面。

若要定義路由，請在 `app.routes.ts` 中將路由物件新增到 `routes` 陣列，其中包含：

- 路徑（自動從根路徑（例如，`/`）開始）
- 您想讓路徑顯示的 `component`

```ts
import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];
```

上面的程式碼是 `HomeComponent` 如何新增為路由的範例。現在請在練習區中繼續實作這個，以及 `UserComponent`。

使用 `'user'` 作為 `UserComponent` 的路徑。

</docs-step>

<docs-step title="在路由定義中新增標題">

除了正確定義路由外，Angular Router 也能讓你在使用者導航時設定頁面標題，方法是將 `title` 屬性新增到各個路由中。

在 `app.routes.ts` 中，將 `title` 屬性新增至預設路由 (`path: ''`) 和 `user` 路由。以下是一個範例：

<docs-code language="ts" highlight="[8]">
import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';

export const routes: Routes = [
{
path: '',
title: 'App Home Page',
component: HomeComponent,
},
];
</docs-code>

</docs-step>

</docs-workflow>

在活動中，您已經學會如何在 Angular 應用程式中定義和設定路由。做得好。🙌

在你的 app 中完全啟用路由的旅程即將完成，繼續努力。

