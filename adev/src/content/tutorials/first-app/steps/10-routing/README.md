# 為應用程式加入路由

本教學課程示範如何為你的應用程式加入路由。

<docs-video src="https://www.youtube.com/embed/r5DEBMuStPw?si=H6Bx6nLJoMLaMxkx" />

IMPORTANT: 我們建議使用你的本機環境來學習路由。

## 你將學到什麼

在這一課結束時，你的應用程式將支援路由。

## 路由概念預覽

本教學介紹 Angular 中的路由。路由是從應用程式中的一個元件導覽到另一個元件的能力。在[單頁應用程式（SPA）](guide/routing)中，頁面只有部分會更新，以呈現使用者所要求的檢視畫面。

[Angular Router](guide/routing)讓使用者能宣告路由，並指定當應用程式請求某條路由時，畫面上應該顯示哪個元件。

在這一課中，你會在應用程式中啟用路由，以便導覽到詳細資訊頁面。

<docs-workflow>

<docs-step title="建立預設的詳細資訊元件">
1. 在終端機中，輸入下列指令，建立 `DetailsComponent`：

    <docs-code language="shell">
    ng generate component details
    </docs-code>

    這個元件將代表詳細資訊頁面，提供特定房屋地點的更多資訊。
</docs-step>

<docs-step title="為應用程式加入路由">
1.  在 `src/app` 目錄中，建立一個名為 `routes.ts` 的檔案。我們會在這個檔案中定義應用程式的路由。

1. 在 `main.ts` 中，進行下列更新，在應用程式中啟用路由：
    1. 匯入路由檔案與 `provideRouter` 函式：

        <docs-code header="在 src/main.ts 中匯入路由相關內容" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[7,8]"/>

    1. 更新對 `bootstrapApplication` 的呼叫，加入路由設定：

        <docs-code header="在 src/main.ts 中加入路由設定" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[10,17]"/>

1. 在 `src/app/app.component.ts` 中，更新元件以使用路由：
    1. 為 `RoutingModule` 加入檔案層級的匯入：

        <docs-code header="在 src/app/app.component.ts 中匯入 RouterModule" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.component.ts" visibleLines="[3]"/>

    1. 將 `RouterModule` 加入 `@Component` 中繼資料的 imports

        <docs-code header="在 src/app/app.component.ts 中匯入 RouterModule" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.component.ts" visibleLines="[7]"/>

    1. 在 `template` 屬性中，用 `<router-outlet>` 指令取代 `<app-home></app-home>` 標籤，並加入一個連回首頁的連結。你的程式碼應該與這段程式碼一致：

        <docs-code header="在 src/app/app.component.ts 中加入 router-outlet" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.component.ts" visibleLines="[8,18]"/>

</docs-step>

<docs-step title="為新元件加入路由">
在上一個步驟中，你移除了範本中對 `<app-home>` 元件的參照。在這個步驟中，你會為該元件加入一條新路由。

1. 在 `routes.ts` 中，進行下列更新，建立一條路由。
    1. 為 `HomeComponent`、`DetailsComponent` 與路由定義中會用到的 `Routes` 型別加入檔案層級的匯入。

        <docs-code header="匯入元件與 Routes" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[1,3]"/>

    1. 定義一個型別為 `Routes`、名為 `routeConfig` 的變數，並為應用程式定義兩條路由：
        <docs-code header="為應用程式加入路由" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[5,18]"/>

        `routeConfig` 陣列中的項目代表應用程式中的路由。第一個項目會在 url 符合 `''` 時導覽到 `HomeComponent`。第二個項目使用了一些特殊格式，之後的課程會再回頭說明。

1. 儲存所有變更，確認應用程式在瀏覽器中可以運作。應用程式應該仍然會顯示房屋地點清單。
</docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你在應用程式中啟用了路由，也定義了新路由。現在你的應用程式可以支援在不同檢視畫面之間導覽。在下一課中，你將學會如何導覽到特定房屋地點的「詳細資訊」頁面。

你的應用程式有很大的進展，做得很好。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/routing" title="Angular 路由總覽"/>
  <docs-pill href="guide/routing/common-router-tasks" title="常見路由工作"/>
</docs-pill-row>
