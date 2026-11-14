# 變更日誌



Angular 文件是一份持續改進的活文件。
本日誌著重記錄近期的重大變更。

## 已更新至 Angular 4.0。Angular 2.x 的文件可在 [v2.angular.tw](https://v2.angular.tw) 找到。

## 已移除所有提及 moduleId 的內容。「元件相對路徑」指南已刪除 (2017-03-13)
我們已在建議的 SystemJS 設定中加入一個新的 SystemJS 外掛程式（systemjs-angular-loader.js）。
此外掛程式會自動為你將 templateUrl 與 styleUrls 中的「元件相對」路徑動態轉換為「絕對路徑」。

我們強烈建議你只撰寫元件相對路徑。
本文件討論的 URL 只有這種形式。你不再需要寫 @Component({ moduleId: module.id })，也不應該這樣寫。

## 新增：每份指南皆提供可下載的範例 (2017-02-28)
現在你可以下載任何指南的範例程式碼，並在本機執行。
留意「即時範例」連結旁的新下載連結。

## 範本語法／結構指令：內容翻新 (2017-02-06)
[_範本語法_](guide/template-syntax) 與 [_結構指令_](guide/structural-directives)
兩份指南已大幅修訂，使內容更清晰、更正確，並符合目前的建議做法。
其中討論了 `<ng-container>`。
修訂後的範例更清晰，並涵蓋所有討論的主題。

## 新增：範例改以 `src/` 資料夾重新組織 (2017-02-02)
所有文件範例都已與 Angular CLI 的預設資料夾結構對齊。
這是朝向以 Angular CLI 為範例基礎邁進的一步。
但這本身也是件好事。
它有助於清楚地將應用程式程式碼與安裝設定檔案區分開來。

現在所有範例在專案根目錄都有一個 `src/` 資料夾。
原來的 `app/` 資料夾已移至 `src/` 之下。
若要了解如何將現有專案遷移到此結構，請參閱
<a href="https://github.com/angular/quickstart#updating-to-a-newer-version-of-the-quickstart-repo" target="Migrating samples/quickstart app to the src folder">
QuickStart 儲存庫的更新說明</a>。

值得注意的是：

* `app/main.ts` 已移至 `src/main.ts`。
* `app/` 已移至 `src/app/`。
* `index.html`、`styles.css` 與 `tsconfig.json` 已移至 `src/` 內。
* `systemjs.config.js` 現在匯入的是 `main.js` 而非 `app`。
* 新增 `lite-server` 設定（`bs-config.json`），用來提供 `src/` 的內容。

## 新增：反應式表單指南 (2017-01-31)
新的 [**Reactive Forms**](guide/reactive-forms) 指南說明了如何以及為何要建立「反應式表單」。
「反應式表單」是以程式碼為基礎的做法，與宣告式的「範本驅動」表單做法相對應，
後者在 [表單](guide/forms) 指南中介紹。
在決定如何為應用程式加入表單之前，先來看看這份指南。
另請記住，你可以在同一個應用程式中同時使用這兩種技術，
依每個情境選擇最適合的做法。

## 新增：部署指南 (2017-01-30)

新的 [部署](guide/deployment) 指南說明了將應用程式放上伺服器的技術。
其中包含針對生產環境最佳化的重要建議。

## 階層式依賴注入：內容翻新 (2017-01-13)

[階層式依賴注入](guide/hierarchical-dependency-injection) 指南已大幅修訂。
已關閉 issue #3086。
修訂後的範例更清晰，並涵蓋所有討論的主題。

## 雜項 (2017-01-05)

* [設定](guide/setup) 指南：
加入了如何移除_非必要_檔案的（可選）說明。
* 不再將 RxJS 運算子匯入合併至 `rxjs-extensions` 檔案；每個檔案應匯入自己需要的內容。
* 所有範例都以 `./` 作為範本／樣式 URL 的前綴，作為最佳做法。
* [風格指南](guide/styleguide)：文字編修與規則修訂。

## 路由：更多細節 (2016-12-21)

在 [路由](guide/router) 指南中加入了更多資訊，
包括名為 outlets、wildcard routes 與 preload strategies 的小節。

## HTTP：如何設定預設請求標頭（以及其他請求選項） (2016-12-14)

在 HTTP 指南中加入了如何設定預設請求標頭（以及其他請求選項）的小節。

## 測試：加入元件測試 plunker (2016-12-02)

新增了兩個 plunker，每個各自測試_一個簡單元件_，讓你能自己撰寫元件測試 plunker：QuickStart 種子專案 `AppComponent` 的 <live-example name="setup" plnkr="quickstart-specs">第一個</live-example>，以及測試指南 `BannerComponent` 的 <live-example name="testing" plnkr="banner-specs">另一個</live-example>。
已在「測試」與「設定剖析」指南中加入這些 plunker 的連結。

## 國際化：複數處理與 _select_ (2016-11-30)

[國際化（i18n）](guide/i18n) 指南說明如何使用 `select` 處理複數形式，
以及替代文字的翻譯。
範例也示範了這些功能。

## 測試：karma 檔案更新 (2016-11-30)

* `karma.config` 與 `karma-test-shim` 可處理多個 spec 來源路徑；
參見 quickstart issue：[angular/quickstart#294](https://github.com/angular/quickstart/issues/294)。
* 在 karma 啟動的瀏覽器中顯示 Jasmine Runner 的輸出。

## QuickStart 重寫 (2016-11-18)

QuickStart 已完全重寫，讓它名副其實地快速。
它引用了一個在 Plunker 中執行的最小「Hello Angular」應用程式。
新的 [設定](guide/setup) 頁面告訴你如何透過下載（或複製）QuickStart github 儲存庫來安裝本機開發環境。
你不再需要把程式碼複製貼上到那些反正也沒解釋過的設定檔案中。

## 與 Angular v.2.2.0 同步 (2016-11-14)

文件與程式碼範例已更新，並以 Angular v.2.2.0 測試。

## 更新：適用於 AOT 友善 _upgrade/static_ 模組的 NgUpgrade 指南 (2016-11-14)

更新後的 [NgUpgrade 指南](guide/upgrade) 涵蓋了
v.2.2.0 中發佈的 AOT 友善 `upgrade/static` 模組，
這是從 AngularJS 遷移到 Angular 的建議做法。
v.2.2.0 之前版本的文件已移除。

## 在「TypeScript 轉 JavaScript」中說明 ES6 (2016-11-14)

更新後的 TypeScript 轉 JavaScript 指南說明如何以 ES6/7 撰寫應用程式，
方法是將 TypeScript 文件範例（以及網路上其他地方）中常見的慣用寫法轉換為 ES6/7 與 ES5。

此內容已在 [2017 年 8 月移除](https://github.com/angular/angular/pull/18694)，但仍可
在 [v2 文件](https://v2.angular.tw/docs/ts/latest/cookbook/ts-to-js.html) 中查看。

## 與 Angular v.2.1.1 同步 (2016-10-21)

文件與程式碼範例已更新，並以 Angular v.2.1.1 測試。

## npm _@types_ 套件取代 _typings_ (2016-10-20)

現在文件範例從 npm `@types` 套件取得第三方函式庫的 TypeScript 型別資訊，
而不再使用 _typings_ 工具。
`typings.json` 檔案已消失。

[AngularJS 升級](guide/upgrade) 指南反映了這項變更。
`package.json` 會安裝 `@types/angular` 以及數個 `@types/angular-...`
套件以支援升級；純 Angular 開發不需要這些套件。

## 「範本語法」說明雙向資料繫結語法 (2016-10-20)

示範如何對自訂 Angular 元件進行雙向資料繫結，
並以基本的 `[()]` 語法重新說明 `[(ngModel)]`。

## 破壞性變更：`in-memory-web-api` (v.0.1.11) 改以 esm umd 形式交付 (2016-10-19)

這項變更支援 ES6 開發者，並與典型的 Angular 函式庫更加一致。
它不影響該模組的 API，但會影響你載入與匯入它的方式。
參見 `in-memory-web-api` 儲存庫中的 <a href="https://github.com/angular/in-memory-web-api/blob/master/CHANGELOG.md#0113-2016-10-20">變更說明</a>。

## 「路由」的 _preload_ 語法與 _:enter_/_:leave_ 動畫 (2016-10-19)

路由器可以在應用程式啟動_之後_、使用者前往這些模組_之前_，
以延遲載入的方式預先載入模組，藉此改善使用者體感的效能。

新的 `:enter` 與 `:leave` 別名讓動畫更自然。

## 與 Angular v.2.1.0 同步 (2016-10-12)

文件與程式碼範例已更新，並以 Angular v.2.1.0 測試。

## 新增：「預先編譯 (AOT)」指南 (2016-10-11)

新增的 [預先編譯 (AOT)](guide/aot-compiler) 指南
說明什麼是 AOT 編譯，以及你為何會需要它。
它先以 QuickStart 應用程式示範基礎，
接著說明編譯與打包英雄之旅的進階考量。

## 與 Angular v.2.0.2 同步 (2016-10-6)

文件與程式碼範例已更新，並以 Angular v.2.0.2 測試。

## 含 _路由模組_ 的「路由與導覽」指南 (2016-10-5)

[路由與導覽](guide/router) 指南現在將路由設定放在 _路由模組_ 中。
_路由模組_ 取代了先前涉及 `ModuleWithProviders` 的 _路由物件_。

所有含路由的導引範例都使用 _路由模組_，散文內容也已更新，
其中最明顯的是
[NgModule](guide/ngmodules) 指南與 [NgModule FAQ](guide/ngmodule-faq) 指南。

## 新增「國際化」指南 (2016-09-30)

新增了 [國際化（i18n）](guide/i18n) 指南，說明如何
使用 Angular 的「i18n」功能，將範本文字翻譯成多種語言。

## 「angular-in-memory-web-api」套件更名 (2016-09-27)

許多範例使用 `angular-in-memory-web-api` 來模擬遠端伺服器。
在你還沒有可連線的伺服器時，這個函式庫在早期開發階段也對你很有用。

套件名稱已由 "angular2-in-memory-web-api" 更改，後者在 npm 上仍凍結在當時的狀態。
新的 "angular-in-memory-web-api" 具備新功能。
<a href="https://github.com/angular/in-memory-web-api/blob/master/README.md">在 github 上閱讀相關資訊</a>。

## 含 _NgModules_ 的「風格指南」 (2016-09-27)

[StyleGuide](guide/styleguide) 說明了 NgModules 的建議慣例。
Barrels 現在已遠不如以往有用，並已從風格指南中移除；
它們仍然有價值，但不屬於 Angular 風格的範疇。
此外，也放寬了不鼓勵使用 `@Component.host` 屬性的規則。

## 各處皆有 _moduleId: module.id_ (2016-09-25)

使用 `templateUrl` 或 `styleUrls` 取得範本或樣式的範例元件，
已轉換為_模組相對_ URL。
並已在其 `@Component` 中繼資料中加入 `moduleId: module.id` 屬性與值。

當應用程式以 SystemJS 載入模組時（如目前的範例），
這項變更是以 AOT 編譯器編譯時的必要條件。

## 「生命週期鉤子」指南已簡化 (2016-09-24)

[生命週期鉤子](guide/lifecycle-hooks) 指南變得更短、更簡單，
並更強調 Angular 呼叫這些鉤子的順序。
