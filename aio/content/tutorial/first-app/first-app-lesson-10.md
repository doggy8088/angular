# 為應用程式加入路由
本教學課程示範如何為你的應用程式加入路由。

**預計時間**：約 15 分鐘

**起始程式碼：** <live-example name="first-app-lesson-09"></live-example>

**完成程式碼：** <live-example name="first-app-lesson-10"></live-example>

## 你將學到什麼
在這一課結束時，你的應用程式將會支援路由。

## 路由概念預覽

<!-- markdownLint-disable MD001 -->
本教學介紹 Angular 中的路由。路由是指從應用程式中的一個元件導覽到另一個元件的能力。在[單頁應用程式（SPA）](/guide/router-tutorial#在單頁應用程式中使用-angular-路由)中，頁面只有部分內容會更新，以呈現使用者請求的檢視畫面。

[Angular Router](/guide/router-tutorial)讓使用者能宣告路由，並指定當應用程式請求某條路由時，畫面上應該顯示哪個元件。

在這一課中，你會在應用程式中啟用路由，以便導覽到詳細資訊頁面。

## 步驟 1 - 建立預設的詳細資訊元件

1. 在終端機中輸入下列指令，建立 `DetailsComponent`：

    <code-example format="shell" language="shell">

    ng generate component details --standalone --inline-template --skip-tests

    </code-example>

    這個元件將代表詳細資訊頁面，提供特定房屋地點的更多資訊。

## 步驟 2 - 為應用程式加入路由
1. 在 `src/app` 目錄中，建立一個名為 `routes.ts` 的檔案。我們會在這個檔案中定義應用程式的路由。

1. 在 `main.ts` 中，進行下列更新，在應用程式中啟用路由：
    1. 匯入路由檔案與 `provideRouter` 函式：

        <code-example header="Import routing details in src/main.ts" path="first-app-lesson-10/src/main.ts" region="add-router-imports"></code-example>

    1. 更新對 `bootstrapApplication` 的呼叫，加入路由設定：

        <code-example header="Add router configuration in src/main.ts" path="first-app-lesson-10/src/main.ts" region="add-router-config"></code-example>        

1. 在 `src/app/app.component.ts` 中，更新元件以使用路由：
    1. 為 `RoutingModule` 加入檔案層級的匯入：

        <code-example header="Import RouterModule in src/app/app.component.ts" path="first-app-lesson-10/src/app/app.component.ts" region="import-router-module"></code-example>
    
    1. 將 `RouterModule` 加入 `@Component` 中繼資料的 imports

        <code-example header="Import RouterModule in src/app/app.component.ts" path="first-app-lesson-10/src/app/app.component.ts" region="import-router-module-deco"></code-example>
    
    1. 在 `template` 屬性中，用 `<router-outlet>` 指令取代 `<app-home></app-home>` 標籤，並加入一個連回首頁的連結。你的程式碼應該與這段程式碼一致：

        <code-example header="Add router-outlet in src/app/app.component.ts" path="first-app-lesson-10/src/app/app.component.ts" region="add-router-outlet"></code-example>
    
## 步驟 3 - 為新元件加入路由
在上一個步驟中，你移除了範本中對 `<app-home>` 元件的參照。在這個步驟中，你會為該元件加入一條新路由。

1. 在 `routes.ts` 中，進行下列更新，建立一條路由。
    1. 為 `HomeComponent`、`DetailsComponent` 與路由定義中會用到的 `Routes` 型別加入檔案層級的匯入。

        <code-example header="Import components and Routes" path="first-app-lesson-10/src/app/routes.ts" region="import-routes-components"></code-example>

    1. 定義一個型別為 `Routes`、名為 `routeConfig` 的變數，並為應用程式定義兩條路由：
    
        <code-example header="Add routes to the app" path="first-app-lesson-10/src/app/routes.ts" region="define-app-routes"></code-example>

        `routeConfig` 陣列中的項目代表應用程式中的路由。第一個項目會在 url 符合 `''` 時導覽到 `HomeComponent`。第二個項目使用了一些特殊格式，之後的課程會再回頭說明。

1. 儲存所有變更，確認應用程式在瀏覽器中可以運作。應用程式應該仍然會顯示房屋地點清單。

## 課程回顧

在這一課中，你在應用程式中啟用了路由，也定義了新路由。現在你的應用程式可以支援在不同檢視畫面之間導覽。在下一課中，你將學會如何導覽到特定房屋地點的「詳細資訊」頁面。

你的應用程式有很大的進展，做得很好。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看它的完成程式碼。

## 後續步驟

*  [第 11 課 - 將詳細資訊頁面整合到應用程式中](tutorial/first-app/first-app-lesson-11)

## 更多資訊

如需本課所涵蓋主題的更多資訊，請造訪：

<!-- vale Angular.Google_WordListSuggestions = NO -->

*  [Angular 路由總覽](guide/routing-overview)
*  [常見路由工作](guide/router)

@reviewed 2023-07-11
