<docs-decorative-header title="Angular 路由" imgSrc="adev/src/assets/images/routing.svg"> <!-- markdownlint-disable-line -->
路由能協助你改變使用者在單頁應用程式中看到的內容。
</docs-decorative-header>

Angular Router（`@angular/router`）是管理 Angular 應用程式導覽的官方函式庫，也是框架的核心組成部分。所有由 Angular CLI 建立的專案都預設包含它。

## 為什麼 SPA 需要路由？

當你在網頁瀏覽器中導覽至某個 URL 時，瀏覽器通常會向網頁伺服器發出網路請求，並顯示回傳的 HTML 頁面。當你導覽至不同的 URL（例如點選連結），瀏覽器會再發出另一個網路請求，並以新頁面完全取代整個頁面。

單頁應用程式（SPA）不同之處在於，瀏覽器只會向網頁伺服器請求第一個頁面，也就是 `index.html`。之後便由用戶端路由接手，根據 URL 控制要顯示的內容。當使用者導覽至不同的 URL 時，路由會就地更新頁面內容，而不觸發整頁重新載入。

## Angular 如何管理路由

Angular 的路由由三個主要部分組成：

1. **路由**定義使用者造訪特定 URL 時要顯示哪個元件。
2. **出口**是範本中的佔位元素，會根據目前啟用的路由，動態載入並渲染元件。
3. **連結**讓使用者能在應用程式的不同路由之間導覽，而不觸發整頁重新載入。

此外，Angular 路由函式庫還提供以下額外功能：

- 巢狀路由
- 程式化導覽
- 路由參數、查詢與萬用字元
- 透過 `ActivatedRoute` 取得已啟用路由的資訊
- 透過路由資源與解析器擷取資料
- 檢視轉場效果
- 導覽守衛

## 後續步驟

進一步了解如何[使用 Angular Router 定義路由](/guide/routing/define-routes)。
