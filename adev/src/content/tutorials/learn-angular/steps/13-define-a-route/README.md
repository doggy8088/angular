# 定義路由

現在你已經把應用程式設定好使用 Angular Router，接下來需要定義路由。

NOTE: 在[深入指南](/guide/routing/common-router-tasks#defining-a-basic-route)中進一步了解如何定義基本路由。

在這個練習中，你將學習如何為應用程式加上路由並進行組態。

<hr>

<docs-workflow>

<docs-step title="在 `app.routes.ts` 中定義路由">

在你的應用程式中，有兩個頁面要顯示：（1）首頁和（2）使用者頁面。

要定義路由，請在 `app.routes.ts` 的 `routes` 陣列中加上一個路由物件，包含：

- 路由的 `path`（它會自動從根路徑開始，也就是 `/`）
- 你希望該路由顯示的 `component`

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

上面的程式碼示範如何把 `HomeComponent` 加為一條路由。現在就在 playground 中實作它，並一併加上 `UserComponent`。

`UserComponent` 的路徑請使用 `'user'`。

</docs-step>

<docs-step title="為路由定義加上標題">

除了正確定義路由之外，Angular Router 也讓你能為每條路由加上 `title` 屬性，在使用者導覽時設定頁面標題。

在 `app.routes.ts` 中，為預設路由（`path: ''`）和 `user` 路由加上 `title` 屬性。範例如下：

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

在這個練習中，你學會了如何在 Angular 應用程式中定義路由並進行組態。做得好。🙌

在應用程式中完整啟用路由的旅程就快完成了，繼續前進。
