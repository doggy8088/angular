# 更新 Angular

本指南包含與更新至 Angular 第 12 版相關的資訊。

## 更新 CLI 應用程式

如需了解如何更新至最新 Angular 版本、並運用我們的自動化遷移工具來做到這一點的逐步說明，請使用 [update.angular.io](https://update.angular.io) 上的互動式更新指南。


## 以 Ivy 建置應用程式

對於程式庫，View Engine 已被棄用，並將在第 13 版中移除。
以第 12 版或更新版本建立的新程式庫預設使用 Ivy。
如需了解以 View Engine 與 Ivy 發佈程式庫的更多資訊，請參閱[建立程式庫](guide/creating-libraries)中的[以 Ivy 建置程式庫](guide/creating-libraries#ivy-libraries)一節。

## 第 12 版的變更與棄用

<div class="alert is-helpful">

   如需了解 Angular 的棄用與移除實務，請參閱 [Angular 發佈實務](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices")。

</div>

* 應用程式不能再透過把 `enableIvy: false` 設好來以 View Engine 建置。
  為了向後相容而以 View Engine 建置程式庫的支援已被棄用，並將在 Angular 第 13 版中移除。
  以 Angular 第 12 版建立的新程式庫將預設以 Ivy 建置與發佈。
  如需更多資訊，請參閱[建立程式庫](guide/creating-libraries)。
* 以 Ivy 為基礎的 IDE [語言服務](guide/language-service)現在預設啟用。
  請參閱 [PR #1279](https://github.com/angular/vscode-ng-language-service/pull/1279)。
* Angular 以 View Engine 為基礎的 i18n 訊息 ID 產生演算法已被棄用。
  Angular 第 12 版為 `localize-extract` 新增了一個名為 `--migrateMapFile` 的旗標，它會產生一個 JSON 檔案，可用來把舊版訊息 ID 對映到正式訊息 ID。
  還有一個名為 `localize-migrate` 的新指令碼，可以使用 `localize-extract` 產生的對映檔案，遷移傳入檔案中的所有 ID。
  為了更好的穩定性，如果你正在使用 Angular 的 `i18n`，請執行這次遷移，轉移到新的訊息 ID 產生演算法。
  如果你不執行這次遷移，當 Angular 移除 View Engine 編譯器時，你所有產生的訊息 ID 都將改變。
  請參閱 [PR #41026](https://github.com/angular/angular/pull/41026)。
* 現在有一個名為 `inlineStyleLanguage` 的新建置選項，用於定義行內元件樣式中的樣式表語言。
  目前支援的語言選項為 CSS（預設）、Sass、SCSS 與 LESS。
  CSS 的預設值讓既有專案能如預期般繼續運作。
  請參閱 [PR #20514](https://github.com/angular/angular-cli/pull/20514)。
* 對於新應用程式，嚴格模式現在是 CLI 的預設值。
  請參閱 [PR #20029](https://github.com/angular/angular-cli/pull/20029)。
* 為 `AbstractControl` 類別方法加入 `emitEvent` 選項。
  請參閱 [PR #31031](https://github.com/angular/angular/pull/31031)。
* 支援 `APP_INITIALIZER` 與 observable 搭配運作。
  請參閱 [PR #31031](https://github.com/angular/angular/pull/31031)。
* `HttpClient` 支援指定請求中繼資料。
  請參閱 [PR #25751](https://github.com/angular/angular/pull/25751)。


{@a breaking-changes}
### Angular 第 12 版的破壞性變更

* 加入對 TypeScript 4.2 的支援。
  TypeScript <4.2.3 不再受支援。
  受支援的 TypeScript 版本範圍為 4.2.3 到 4.2.x。
  請參閱 [PR #41158](https://github.com/angular/angular/pull/41158)。
* Angular CDK 與 Angular Material 內部現在使用新的 [Sass 模組系統](https://sass-lang.com/blog/the-module-system-is-launched)，該系統由 Google 的 Sass 團隊積極維護。
  因此，應用程式不能再以 [`node-sass` npm 套件](https://www.npmjs.com/package/node-sass)取用 Angular CDK／Material 的 Sass。
  `node-sass` 已無人維護，且不支援較新的 Sass 功能。相反地，應用程式必須使用 [`sass` npm 套件](https://www.npmjs.com/package/sass)，或針對 `sass-embedded` beta 使用 [`sass-embedded` npm 套件](https://www.npmjs.com/package/sass-embedded)。
* Angular 工具現在使用 Webpack 5 來建置應用程式。Webpack 4 的使用與支援已被移除。
  使用官方 Angular 建置器時，你不需要做任何專案層級的設定變更，就能使用升級後的 Webpack 版本。
  以此套件為基礎、使用實驗性程式化 API 的自訂建置器，可能需要更新才能與 Webpack 5 相容。
  請參閱 [PR #20466](https://github.com/angular/angular-cli/pull/20466)。
* 當啟用 `namedChunks` 選項時，Webpack 5 會為開發設定中延遲載入的 JavaScript 檔案產生相似但名稱不同的檔案。
  對大多數使用者而言，這項變更對應用程式或建置流程不應有任何影響。
  生產建置也不應受到影響，因為 `namedChunks` 選項在生產設定中預設停用。
  然而，如果專案的建置後流程對檔案名稱有所假設，就可能需要調整以因應新的命名方式。
  這類建置後流程可能包括建置後的自訂檔案轉換、整合到伺服器端框架，或部署程序。
  開發檔案名稱變更的一個範例是 `lazy-lazy-module.js` 變成 `src_app_lazy_lazy_module_ts.js`。
  請參閱 [PR #20466](https://github.com/angular/angular-cli/pull/20466)。
* Webpack 5 現在包含 web worker 支援。
  然而，worker 建構子內 URL 的結構必須採用與目前要求不同的特定格式。
  若要更新 web worker 的使用方式，其中 `./app.worker` 是實際的 worker 名稱，請把 `new Worker('./app.worker', ...)` 改為 `new Worker(new URL('./app.worker', import.meta.url), ...)`。
  請參閱 [PR #20466](https://github.com/angular/angular-cli/pull/20466)。
* 關鍵 CSS 內嵌現在預設啟用。
  若要關閉它，請把 `inlineCritical` 設為 false。
  請參閱 [PR #20096](https://github.com/angular/angular-cli/pull/20096)與 [Angular 工作區設定](guide/workspace-config)中的[樣式預處理器選項](guide/workspace-config#最佳化設定)一節。
* `ng build` 現在預設產生生產 bundle。
  請參閱 [PR #20128](https://github.com/angular/angular-cli/pull/20128)。
* 先前，Forms 模組會忽略在 `<input type="number">` 上定義的 `min` 與 `max` 屬性。
  現在，當給定的輸入上同時存在 `formControl`、`formControlName` 或 `ngModel` 指令時，這些屬性會觸發 `min` 與 `max` 驗證邏輯。
  請參閱 [PR #39063](https://github.com/angular/angular/pull/39063)。


{@a deprecations}
### 新增的棄用

* 對 Internet Explorer 11 的支援已被棄用。
  請參閱[已棄用的 API 與功能](guide/deprecations)與 [Microsoft 365 apps say farewell to Internet Explorer 11 and Windows 10 sunsets Microsoft Edge Legacy](https://techcommunity.microsoft.com/t5/microsoft-365-blog/microsoft-365-apps-say-farewell-to-internet-explorer-11-and/ba-p/1591666)。
* 從 `@angular/material/theming` 匯入 Sass 已被棄用。現在有一個新的 Angular Material Sass API 供 `@use` 使用。
  執行遷移指令碼 `ng g @angular/material:themingApi`，把你所有的 Angular CDK 與 Angular Material 的 Sass 匯入切換到新 API 與 `@use`。
* 以 View Engine 發行程式庫的支援已被棄用：
  - 你現在可以以[_部分_編譯模式](guide/angular-compiler-options#compilationmode)編譯程式庫，產生與 Ivy 相容的輸出，當使用該程式庫的應用程式被打包時，該輸出會被_連結_。
  - 你以 Angular CLI 建立的新程式庫預設為部分編譯模式，且不支援 View Engine。你仍然可以以 View Engine 建置程式庫。如需更多資訊，請參閱[建立程式庫](guide/creating-libraries)。
  - 以部分編譯模式編譯的程式庫將不包含舊版 `i18n` 訊息 ID。
    如果該程式庫先前是由 View Engine 編譯、且包含舊版 `i18n` 訊息 ID，那麼應用程式可能有需要遷移到新訊息 ID 格式的翻譯檔案。如需更多資訊，請參閱[遷移舊版本地化 ID](guide/migration-legacy-message-id)。
  - 相關背景請參閱 [Issue #38366](https://github.com/angular/angular/issues/38366)。

<div class="alert is-helpful">

自第 9 版起，Angular Ivy 是預設的渲染引擎。
如需了解 Ivy 的更多資訊，請參閱 [Angular Ivy](guide/ivy)。

</div>
