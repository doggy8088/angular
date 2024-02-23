# 預先渲染 (SSG)

預先渲染，通常稱為靜態網站產生 (SSG)，代表在建置過程中將頁面渲染成靜態 HTML 檔案的方法。

預先渲染維持與 [伺服器端渲染 (SSR)](guide/ssr#why-use-server-side-rendering) 相同的效能優勢，但減少了首次位元組時間 (TTFB)，最終提升使用者體驗。其關鍵區別在於它的方法，頁面以靜態內容提供，且沒有基於要求的渲染。

當伺服器端渲染所需要的資料在所有使用者間保持一致時，預先渲染的策略便成為有價值的替代方案。預先渲染採取主動方式，在每個使用者要求之前就先渲染頁面，而不是動態地渲染。

## 如何預先呈示頁面

若要預先呈現靜態頁面，請使用以下 Angular CLI 指令為應用程式新增 SSR 功能：

<docs-code language="shell">

ng add @angular/ssr

</docs-code>

<div class="alert is-helpful">

要從一開始就建立具有預先呈現功能的應用程式，請使用 [`ng new --ssr`](tools/cli/setup-local) 指令。

</div>

一旦加入 SSR，您可以藉由執行建置指令來產生靜態頁面：

<docs-code language="shell">

ng build

</docs-code>

### Prerender 的建置選項

應用程式建構器 `prerender` 選項可以是布林值或用於更精細調整設定的物件。
當選項為 `false` 時，不會進行任何預先渲染。當選項為 `true` 時，所有選項都使用預設值。當選項為物件時，每個選項都可以個別設定。

| 選項          | 詳細資料                                                                                                                                                                   | 預設值 |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------ |
| `discoverRoutes` | 是否由 Builder 處理 Angular Router 組態，以尋找所有未參數化的路徑並預先呈現。                                                                                                            | `true`        |
| `routesFile`     | 包含所有要預先呈現的路徑清單之檔案路徑，以換行符號分隔。此選項適用於要預先呈現具有參數化 URL 的路徑。                                                                   |               |

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

### 預先渲染參數化路由

你可以使用 `routesFile` 選項預先呈現參數化的路由。參數化路由的範例為 `product/:id`，其中 `id` 是動態提供的。若要指定這些路由，應將它們列在文字檔案中，每條路由佔一行。

對於具有大量參數化路由的應用程式，請考慮在執行 `ng build` 之前使用腳本來產生此檔案。

<docs-code header="routes.txt" language="text">

/products/1
/products/555

</docs-code>

使用 `routes.txt` 檔案中指定的路由，使用 `routesFile` 選項來設定建構器以預先呈現產品路由。

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

這會將 `ng build` 配置為在建置時預先呈現 `/products/1` 和 `/products/555`。

