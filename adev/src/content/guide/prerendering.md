# 預渲染（SSG）

預渲染，通常稱為靜態網站生成（SSG），是一種在建置過程中將頁面渲染為靜態 HTML 檔案的方法。

預渲染維持了[伺服器端渲染（SSR）](guide/ssr#why-use-server-side-rendering)的效能優勢，同時縮短第一位元組時間（TTFB），最終提升使用者體驗。其關鍵差異在於它的做法：頁面是作為靜態內容提供的，不存在依請求進行的渲染。

當伺服器端渲染所需的資料對所有使用者都保持一致時，預渲染策略便成為一個有價值的替代方案。預渲染不為每個使用者請求動態渲染頁面，而是主動預先渲染這些頁面。

## 如何預渲染頁面 {#how-to-prerender-a-page}

若要預渲染靜態頁面，請使用以下 Angular CLI 指令，為你的應用程式加入 SSR 功能：

<docs-code language="shell">

ng add @angular/ssr

</docs-code>

<div class="docs-alert docs-alert-helpful">

若要從一開始就建立具備預渲染功能的應用程式，請使用 [`ng new --ssr`](tools/cli/setup-local) 指令。

</div>

加入 SSR 之後，你可以執行建置指令來產生靜態頁面：

<docs-code language="shell">

ng build

</docs-code>

### 預渲染的建置選項 {#build-options-for-prerender}

應用程式建置器的 `prerender` 選項可以是 Boolean 或 Object，以便進行更精細的設定。
當選項為 `false` 時，不執行預渲染。當選項為 `true` 時，所有選項都使用預設值。當選項為 Object 時，每個選項都可以個別設定。

| 選項             | 說明                                                                                                                                                                      | 預設值        |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------ |
| `discoverRoutes` | 建置器是否應處理 Angular Router 設定，找出所有未參數化的路由並預渲染它們。                                                                                                | `true`        |
| `routesFile`     | 包含所有要預渲染之路由清單的檔案路徑，路由之間以換行分隔。如果你想預渲染帶有參數化 URL 的路由，這個選項很有用。                                                          |               |

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "prerender": {
              "discoverRoutes": false
            }
          }
        }
      }
    }
  }
}

</docs-code>

### 預渲染參數化路由 {#prerendering-parameterized-routes}

你可以使用 `routesFile` 選項來預渲染參數化路由。參數化路由的一個範例是 `product/:id`，其中 `id` 是動態提供的。若要指定這些路由，應將它們列在文字檔案中，每條路由佔一行。

如果應用程式有大量參數化路由，可以考慮在執行 `ng build` 之前，先用腳本產生這個檔案。

<docs-code header="routes.txt" language="text">

/products/1
/products/555

</docs-code>

在 `routes.txt` 檔案中指定路由後，使用 `routesFile` 選項設定建置器，預渲染產品路由。

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "prerender": {
              "routesFile": "routes.txt"
            }
          }
        }
      }
    }
  }
}

</docs-code>

這樣設定後，`ng build` 會在建置時預渲染 `/products/1` 與 `/products/555`。
