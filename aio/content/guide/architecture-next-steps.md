# 下一步：工具與技術

瞭解 Angular 的基本建構單元之後，你可以進一步認識有助於開發與交付 Angular 應用程式的功能與工具。

*   完成 [Tour of Heroes](tutorial) 教學，體驗如何將基本建構單元組合起來，建立設計良好的應用程式。
*   查閱 [術語表](guide/glossary)，瞭解 Angular 專屬術語與用法。
*   依照你的開發階段與感興趣的領域，善用文件更深入地學習關鍵功能。

## 應用程式架構

*   目錄中的 **主要概念** 一節包含數個主題，說明如何將應用程式資料從 [元件](guide/glossary#元件component) 連接到負責顯示頁面的 [範本](guide/glossary#範本template)，建立完整的互動式應用程式。
*   [NgModules](guide/ngmodules) 指南深入說明 Angular 應用程式的模組化結構。
*   [路由與導覽](guide/router) 指南深入說明如何建構應用程式，讓使用者能在單頁應用程式內瀏覽不同的 [檢視](guide/glossary#檢視view)。
*   [依賴注入](guide/dependency-injection) 指南深入說明如何建構應用程式，讓每個元件類別都能取得執行其功能所需的服務與物件。

## 回應式程式設計

[範本語法](guide/template-syntax) 及相關主題詳細說明如何在檢視中於你想要的時間與位置顯示元件資料，以及如何收集可供你回應的使用者輸入。

其他頁面與章節介紹一些 Angular 應用程式的基本程式設計技巧。

*   [生命週期掛鉤](guide/lifecycle-hooks)：實作生命週期掛鉤介面，掌握元件從建立到銷毀的生命週期中的關鍵時刻。
*   [Observable 與事件處理](guide/observables)：如何搭配元件與服務使用 Observable，發佈與訂閱任何類型的訊息，例如使用者互動事件與非同步操作結果。
*   [Angular elements](guide/elements)：如何使用 Web Components（一種以框架無關的方式定義新 HTML 元素的網頁標準），將元件封裝為 *自訂元素。*
*   [表單](guide/forms-overview)：以 HTML 為基礎的輸入驗證，支援複雜的資料輸入情境。
*   [動畫](guide/animations)：使用 Angular 的動畫程式庫為元件行為加上動畫效果，不需要深入瞭解動畫技術或 CSS。

## 用戶端與伺服器互動

Angular 為單頁應用程式提供框架，其中大部分邏輯與資料都位於用戶端。
大多數應用程式仍需使用 `HttpClient` 存取伺服器，以存取與儲存資料。
對於某些平台與應用程式，你可能也想採用 PWA（Progressive Web App，漸進式網頁應用程式）模式來改善使用者體驗。

*   [HTTP](guide/http)：使用 HTTP 用戶端與伺服器溝通，以取得資料、儲存資料，以及呼叫伺服器端動作。
*   [伺服器端渲染](guide/universal)：Angular Universal 透過伺服器端渲染（SSR）在伺服器上產生靜態應用程式頁面。這讓你可以在伺服器上執行 Angular 應用程式，以提升效能、在行動裝置與低效能裝置上快速顯示第一頁，並方便網路爬蟲檢索。
*   [Service Worker 與 PWA](guide/service-worker-intro)：使用 Service Worker 降低對網路的依賴，並大幅改善使用者體驗。
*   [Web Worker](guide/web-worker)：瞭解如何在背景執行緒中執行耗用 CPU 的運算。

## 開發週期支援

*   [CLI 指令參考](cli)：Angular CLI 是命令列工具，可用來建立專案、產生應用程式與程式庫程式碼，並執行測試、打包與部署等各類持續進行的開發工作。
*   [編譯](guide/aot-compiler)：Angular 為開發環境提供即時（JIT）編譯，為生產環境提供預先（AOT）編譯。
*   [測試平台](guide/testing)：針對應用程式各部分與 Angular 框架互動的情形執行單元測試。
*   [部署](guide/deployment)：學習將 Angular 應用程式部署到遠端伺服器的技巧。
*   [安全性指南](guide/security)：瞭解 Angular 針對常見網頁應用程式弱點與攻擊（例如跨網站指令碼攻擊）的內建防護。
*   [國際化][AioGuideI18nOverview]：使用 Angular 的國際化（i18n）工具，讓你的應用程式支援多種語言。
*   [無障礙](guide/accessibility)：讓所有使用者都能使用你的應用程式。

## 檔案結構、設定與相依性

*   [工作區與檔案結構](guide/file-structure)：瞭解 Angular 工作區與專案資料夾的結構。
*   [建置與提供](guide/build)：學習為專案定義不同的建置與 Proxy 伺服器設定，例如開發、預備與生產環境。
*   [npm 套件](guide/npm-packages)：Angular 框架、Angular CLI 以及 Angular 應用程式使用的元件，都以 [npm](https://docs.npmjs.com) 套件的形式封裝，並透過 npm 登錄檔發佈。Angular CLI 會建立預設的 `package.json` 檔案，指定一組能良好搭配、共同支援許多常見應用程式情境的初始套件。
*   [TypeScript 設定](guide/typescript-configuration)：TypeScript 是 Angular 應用程式開發的主要語言。
*   [瀏覽器支援](guide/browser-support)：讓你的應用程式相容於各種瀏覽器。

## 擴充 Angular

*   [Angular 程式庫](guide/libraries)：學習如何使用與建立可重複使用的程式庫。
*   [Schematics](guide/schematics)：學習如何自訂與擴充 CLI 的產生功能。
*   [CLI 建置器](guide/cli-builder)：學習如何自訂與擴充 CLI 套用工具以執行複雜工作（例如建置與測試應用程式）的能力。

<!-- links -->

[AioGuideI18nOverview]: guide/i18n-overview "Angular 國際化 | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
