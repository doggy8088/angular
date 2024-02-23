# 將路由新增到應用程式

本教學課程示範如何將路線新增至您的應用程式。

<docs-video src="https://www.youtube.com/embed/r5DEBMuStPw?si=H6Bx6nLJoMLaMxkx" />

重要：我們建議使用您的本地環境來學習路由。

## 你將會學到

在這個課程結束時，你的應用程式將支援路由。

## 路由的概念預覽

本教學介紹 Angular 中的路由。路由是從應用程式的一個元件導航到另一個元件的能力。在 [單頁應用程式 (SPA)](/guide/routing) 中，只有部分頁面會更新以代表使用者的請求檢視。

[Angular 路由器](/guide/routing) 使用戶能夠宣告路由並指定如果應用程式要求該路由，應該在螢幕上顯示哪個元件。

在本課程中，您將在您的應用程式中啟用路由以導航至詳細資訊頁面。

<docs-workflow>

<docs-step title="建立預設的 details 元件">
1. 在終端機輸入以下指令建立 `DetailsComponent`：

    <docs-code language="shell">
    ng generate component details
    </docs-code>

    This component will represent the details page that provides more information on a given housing location.

</docs-step>

<docs-step title="Add routing to the application">
1.  In the `src/app` directory, create a file called `routes.ts`. This file is where we will define the routes in the application.

1. In `main.ts`, make the following updates to enable routing in the application:
    1. Import the routes file and the `provideRouter` function:

        <docs-code header="Import routing details in src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[7,8]"/>

    1. Update the call to `bootstrapApplication` to include the routing configuration:

        <docs-code header="Add router configuration in src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[10,17]"/>

1. In `src/app/app.component.ts`, update the component to use routing:
    1. Add a file level import for `RoutingModule`:

        <docs-code header="Import RouterModule in src/app/app.component.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.component.ts" visibleLines="[3]"/>

    1. Add `RouterModule` to the `@Component` metadata imports

        <docs-code header="Import RouterModule in src/app/app.component.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.component.ts" visibleLines="[9,12]"/>

    1. In the `template` property, replace the `<app-home></app-home>` tag with the `<router-outlet>` directive and add a link back to the home page. Your code should match this code:

        <docs-code header="Add router-outlet in src/app/app.component.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.component.ts" visibleLines="[13,24]"/>


</docs-step>

<docs-step title="Add route to new component">
In the previous step you removed the reference to the `<app-home>` component in the template. In this step, you will add a new route to that component.

1. In `routes.ts`, perform the following updates to create a route.
    1. Add a file level imports for the `HomeComponent`, `DetailsComponent` and the `Routes` type that you'll use in the route definitions.

        <docs-code header="Import components and Routes" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[1,3]"/>

    1. Define a variable called `routeConfig` of type `Routes` and define two  routes for the app:
        <docs-code header="Add routes to the app" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[5,18]"/>

        The entries in the `routeConfig` array represent the routes in the application. The first entry navigates to the `HomeComponent` whenever the url matches `''`. The second entry uses some special formatting that will be revisited in a future lesson.

1. Save all changes and confirm that the application works in the browser. The application should still display the list of housing locations.
</docs-step>


</docs-workflow>

Summary: In this lesson, you enabled routing in your app as well as defined new routes. Now your app can support navigation between views. In the next lesson, you will learn to navigate to the "details" page for a given housing location.

You are making great progress with your app, well done.

For more information about the topics covered in this lesson, visit:

<docs-pill-row>
  <docs-pill href="guide/routing" title="Routing in Angular Overview"/>
  <docs-pill href="guide/routing/common-router-tasks" title="Common Routing Tasks"/>
</docs-pill-row>

