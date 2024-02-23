# 建立自訂路由匹配

Angular Router 支援強大的比對策略，你可以使用它來幫助使用者導覽你的應用程式。
此比對策略支援靜態路由、帶有參數的變數路由、萬用字元路由等等。
此外，為 URL 比較複雜的情況建構你自己的自訂模式比對。

在本教學中，你將使用 Angular 的 `UrlMatcher` 建立自訂路由比對器。
這個比對器會在 URL 中尋找 Twitter 句柄。

## 目標

實作 Angular 的 `UrlMatcher` 以建立自訂路由比對器。

## 建立範例應用程式

使用 Angular CLI，建立一個新應用程式 *angular-custom-route-match*。
除了預設的 Angular 應用程式架構之外，您還將建立一個 *profile* 元件。

1. 建立一個新的 Angular 專案，*angular-custom-route-match*。

    shell
    ng new angular-custom-route-match
    

    當出現提示「您要新增 Angular 路由嗎？」時，選擇「Y」。

    當出現提示「您想使用哪種樣式表格式？」時，選擇「CSS」。

    幾分鐘後，一個新的專案「angular-custom-route-match」即已準備就緒。

1. 從您的終端機，導覽至 `angular-custom-route-match` 目錄。
1. 建立一個元件，*profile*。

    shell
    ng generate component profile
    

1. 在您的程式碼編輯器中，找到檔案 `profile.component.html` 並將預留位置內容替換為下列 HTML。

    <docs-code header="src/app/profile/profile.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.component.html"/>

1. 在您的程式碼編輯器中，找到檔案 `app.component.html` 並將預留位置內容替換為下列 HTML。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.component.html"/>

## 為您的應用程式設定您的路由

在應用程式架構就緒後，您接下來需要將路由功能新增至 `app.config.ts` 檔案。
在此過程中，您將建立一個自定義 URL 比對器，用於在 URL 中尋找 Twitter 句柄。
此句柄以 `@` 符號為前導。

1. 在你的程式碼編輯器中，開啟你的 `app.config.ts` 檔案。
1. 加入 Angular 的 `provideRouter` 和 `withComponentInputBinding` 的 `import` 陳述，以及應用程式路由。

    ts
    import {provideRouter, withComponentInputBinding} from '@angular/router';

    import {routes} from './app.routes';
    1. 在 providers 陣列中，加入 `provideRouter(routes, withComponentInputBinding())` 陳述。

1. 定義自訂路徑比對器，將以下程式碼加入應用程式路線。

    <docs-code header="src/app/app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" visibleRegion="matcher"/>

此自訂比對器是一個執行下列任務的函式：

* 匹配器驗證陣列僅包含一個區段
* 匹配器使用正規表達式來確保使用者名稱的格式符合匹配
* 如果有匹配，函數會傳回完整的 URL，定義 `username` 路由參數作為路徑的子字串
* 如果沒有匹配，函數會傳回 null，路由器會繼續尋找與 URL 匹配的其他路由

HELPFUL: 自訂 URL 比對器如同任何其他路徑定義一樣。定義子路徑或延遲載入路徑時，可如同對待任何其他路徑一樣。

## 閱讀路由參數

使用自訂比對器後，您現在可以在 `profile` 組件中繫結路由參數。

在您的程式碼編輯器中，開啟您的 `profile.component.ts` 檔案並建立一個與 `username` 參數匹配的 `Input`。
我們先前在 `provideRouter` 中加入了 `withComponentInputBinding` 功能。這允許 `Router` 將資訊直接繫結到路由元件。

```ts
@Input() username!: string;
```

## 測試您的自訂 URL 比對器

當程式碼就緒之後，您現在可以測試自訂網址比對器。

1. 從終端機視窗，執行 `ng serve` 指令。

    <docs-code language="shell">
    ng serve
    </docs-code>

1. 開啟瀏覽器至 `http://localhost:4200`。

    您應該會看到一個單一的網頁，其中包含一句句子寫著 `Navigate to my profile`。

1. 點擊 **my profile** 超連結。

    一個新的句子 `Hello, Angular!` 會顯示在頁面上。

## 後續步驟

當應用程式中具有動態網址時，使用 Angular Router 進行模式比對可為您提供極大的彈性。
如需進一步了解 Angular Router，請參閱下列主題：

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="應用程式內路由與導覽"/>
  <docs-pill href="api/router/Router" title="路由器 API"/>
</docs-pill-row>

HELPFUL: 此內容基於 [使用 Angular 路由進行自訂路由比對](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483)，作者：[Brandon Roberts](https://twitter.com/brandontroberts)。

