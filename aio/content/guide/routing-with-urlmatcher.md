# 教學：建立自訂路由比對

Angular Router 支援強大的比對策略，協助使用者在你的應用程式中導覽。這套比對策略支援靜態路由、帶參數的可變路由、萬用字元路由等。你也可以為 URL 較複雜的情境，建立自己的自訂模式比對。

在本教學中，你將使用 Angular 的 `UrlMatcher` 建立自訂路由比對器。這個比對器會在 URL 中尋找 Twitter 帳號名稱。

關於本教學最終版本的實際範例，請參閱 <live-example></live-example>。

## 學習目標

實作 Angular 的 `UrlMatcher`，建立自訂路由比對器。

## 先備知識

若要完成本教學，你應該對下列概念有基本的理解：

* JavaScript
* HTML
* CSS
* [Angular CLI](/cli)

如果你不熟悉 Angular 路由器的運作方式，請先閱讀[在單頁應用程式中使用 Angular 路由](guide/router-tutorial)。

## 建立範例應用程式

使用 Angular CLI 建立一個新應用程式 _angular-custom-route-match_。除了預設的 Angular 應用程式框架外，你還會建立一個 _profile_ 元件。

1. 建立一個新的 Angular 專案 _angular-custom-route-match_。

   <code-example language="sh">
   ng new angular-custom-route-match
   </code-example>

   當畫面提示 `Would you like to add Angular routing?` 時，選取 `Y`。

   當畫面提示 `Which stylesheet format would you like to use?` 時，選取 `CSS`。

   稍待片刻，新專案 `angular-custom-route-match` 就準備好了。

1. 在終端機中，切換到 `angular-custom-route-match` 目錄。

1. 建立一個元件 _profile_。

  <code-example language="sh">
   ng generate component profile
  </code-example>

1. 在程式碼編輯器中，找到 `profile.component.html` 檔案，把預留內容換成下列 HTML。

   <code-example path="routing-with-urlmatcher/src/app/profile/profile.component.html" header="src/app/profile/profile.component.html"></code-example>

1. 在程式碼編輯器中，找到 `app.component.html` 檔案，把預留內容換成下列 HTML。

   <code-example path="routing-with-urlmatcher/src/app/app.component.html" header="src/app/app.component.html"></code-example>

## 為應用程式設定路由

應用程式框架就緒後，接下來你需要把路由功能加入 `app.module.ts` 檔案。在這個過程中，你將建立一個自訂 URL 比對器，在 URL 中尋找 Twitter 帳號名稱。帳號名稱前面會帶有 `@` 符號。

1. 在程式碼編輯器中，開啟 `app.module.ts` 檔案。

1. 為 Angular 的 `RouterModule` 與 `UrlMatcher` 加入一個 `import` 陳述式。

   <code-example path="routing-with-urlmatcher/src/app/app.module.ts" header="src/app/app.module.ts" region="import"></code-example>

1. 在 imports 陣列中，加入一個 `RouterModule.forRoot([])` 陳述式。

   <code-example path="routing-with-urlmatcher/src/app/app.module.ts" header="src/app/app.module.ts" region="imports-array"></code-example>

1. 把下列程式碼加入 `RouterModule.forRoot()` 陳述式，以定義自訂路由比對器。

   <code-example path="routing-with-urlmatcher/src/app/app.module.ts" header="src/app/app.module.ts" region="matcher"></code-example>

這個自訂比對器是一個函式，負責以下工作：

* 比對器確認陣列中只有一個區段。
* 比對器使用正規表示式確認使用者名稱的格式符合。
* 若符合，函式傳回整個 URL，並把路徑的子字串定義為 `username` 路由參數。
* 若不符合，函式傳回 null，路由器繼續尋找其他符合該 URL 的路由。

<div class="is-helpful">

自訂 URL 比對器的行為與其他路由定義相同。定義子路由或延遲載入路由的方式，都與一般路由無異。

</div>

## 訂閱路由參數

自訂比對器就緒後，你還需要在 `profile` 元件中訂閱路由參數。

1. 在程式碼編輯器中，開啟 `profile.component.ts` 檔案。

1. 為 Angular 的 `ActivatedRoute` 與 `ParamMap` 加入一個 `import` 陳述式。

   <code-example path="routing-with-urlmatcher/src/app/profile/profile.component.ts" header="src/app/profile/profile.component.ts" region="activated-route-and-parammap"></code-example>

1. 為 RxJS 的 `map` 加入一個 `import` 陳述式。

   <code-example path="routing-with-urlmatcher/src/app/profile/profile.component.ts" header="src/app/profile/profile.component.ts" region="rxjs-map"></code-example>

1. 訂閱 `username` 路由參數。

   <code-example path="routing-with-urlmatcher/src/app/profile/profile.component.ts" header="src/app/profile/profile.component.ts" region="subscribe"></code-example>

1. 把 `ActivatedRoute` 注入元件的建構子。

   <code-example path="routing-with-urlmatcher/src/app/profile/profile.component.ts" header="src/app/profile/profile.component.ts" region="activatedroute"></code-example>

## 測試自訂 URL 比對器

程式碼就緒後，你現在可以測試自訂 URL 比對器了。

1. 在終端機視窗中，執行 `ng serve` 指令。

  <code-example language="sh">
   ng serve
  </code-example>

1. 在瀏覽器中開啟 `http://localhost:4200`。

   你應該會看到一個只有一句話的網頁，內容是 `Navigate to my profile`。

1. 點選 **my profile** 超連結。

   頁面上會出現一句新的話：`Hello, Angular!`。

## 後續步驟

Angular Router 的模式比對，讓你的應用程式在處理動態 URL 時擁有很大的彈性。若要深入了解 Angular Router，請參閱下列主題：

* [應用程式內路由與導覽](/guide/router)
* [Router API](/api/router)

<div class="alert is-helpful">

本內容改編自 [Brandon Roberts](https://twitter.com/brandontroberts) 所撰寫的 [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483)。

</div>
