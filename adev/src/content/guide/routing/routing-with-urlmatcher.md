# 建立自訂路由比對

Angular Router 支援強大的比對策略，協助使用者在你的應用程式中導覽。
這套比對策略支援靜態路由、帶參數的可變路由、萬用字元路由等。
你也可以為 URL 較複雜的情境，建立自己的自訂模式比對。

在本教學中，你將使用 Angular 的 `UrlMatcher` 建立自訂路由比對器。
這個比對器會在 URL 中尋找 X（前身為 Twitter）帳號名稱。

## 目標

實作 Angular 的 `UrlMatcher`，建立自訂路由比對器。

## 建立範例應用程式

使用 Angular CLI 建立一個新應用程式 _angular-custom-route-match_。
除了預設的 Angular 應用程式框架外，你還會建立一個 _profile_ 元件。

1. 建立一個新的 Angular 專案 _angular-custom-route-match_。

   ```shell
   ng new angular-custom-route-match
   ```

   當畫面提示 `Would you like to add Angular routing?` 時，選取 `Y`。

   當畫面提示 `Which stylesheet format would you like to use?` 時，選取 `CSS`。

   稍待片刻，新專案 `angular-custom-route-match` 就準備好了。

1. 在終端機中，切換到 `angular-custom-route-match` 目錄。
1. 建立一個元件 _profile_。

   ```shell
   ng generate component profile
   ```

1. 在程式碼編輯器中，找到 `profile.html` 檔案，把預留內容換成下列 HTML。

   <docs-code header="profile.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.html"/>

1. 在程式碼編輯器中，找到 `app.html` 檔案，把預留內容換成下列 HTML。

   <docs-code header="app.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.html"/>

## 為應用程式設定路由

應用程式框架就緒後，接下來你需要把路由功能加入 `app.config.ts` 檔案。
在這個過程中，你將建立一個自訂 URL 比對器，在 URL 中尋找 X 帳號名稱。
帳號名稱前面會帶有 `@` 符號。

1. 在程式碼編輯器中，開啟 `app.config.ts` 檔案。
1. 加入 Angular 的 `provideRouter` 與 `withComponentInputBinding` 以及應用程式路由的 `import` 陳述式。

   ```ts
   import {provideRouter, withComponentInputBinding} from '@angular/router';

   import {routes} from './app.routes';
   ```

1. 在 providers 陣列中，加入 `provideRouter(routes, withComponentInputBinding())` 陳述式。

1. 把下列程式碼加入應用程式路由，定義自訂路由比對器。

   <docs-code header="app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" region="matcher"/>

這個自訂比對器是一個函式，負責以下工作：

- 確認陣列中只有一個區段
- 使用正規表示式確認使用者名稱的格式符合
- 若符合，函式傳回整個 URL，並把路徑的子字串定義為 `username` 路由參數
- 若不符合，函式傳回 null，路由器繼續尋找其他符合該 URL 的路由

HELPFUL: 自訂 URL 比對器的行為與其他路由定義相同。定義子路由或延遲載入路由的方式，都與一般路由無異。

## 讀取路由參數

自訂比對器就緒後，你現在可以在 `profile` 元件中繫結路由參數。

在程式碼編輯器中，開啟 `profile.ts` 檔案，建立一個與 `username` 參數對應的 `input`。
我們先前已在 `provideRouter` 中加入 `withComponentInputBinding` 功能。
這讓 `Router` 能把資訊直接繫結到路由元件。

```ts
username = input.required<string>();
```

## 測試自訂 URL 比對器

程式碼就緒後，你現在可以測試自訂 URL 比對器了。

1. 在終端機視窗中，執行 `ng serve` 指令。

   ```shell
   ng serve
   ```

1. 在瀏覽器開啟 `http://localhost:4200`。

   你應該會看到一個只有一句話的網頁，內容是 `Navigate to my profile`。

1. 點選 **my profile** 超連結。

   頁面上會出現一句新的話：`Hello, Angular!`。

## 後續步驟

Angular Router 的模式比對，讓你的應用程式在處理動態 URL 時擁有很大的彈性。
若要深入了解 Angular Router，請參閱下列主題：

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="應用程式內路由與導覽"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>

HELPFUL: 本內容改編自 [Brandon Roberts](https://x.com/brandontroberts) 所撰寫的 [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483)。
