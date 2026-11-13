# 更新 Angular

本指南包含與更新至 Angular 最新版本相關的資訊。

## 更新 CLI 應用程式

如需了解如何更新至最新 Angular 版本、並運用我們的自動化遷移工具來做到這一點的逐步說明，請使用 [update.angular.io](https://update.angular.io) 上的互動式更新指南。

## 第 11 版的變更與棄用

<div class="alert is-helpful">

   如需了解 Angular 的棄用與移除實務，請參閱 [Angular 發佈實務](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices")。

</div>

{@a breaking-changes}
### 新的破壞性變更

* 移除已棄用的 IE 9、10 與 IE mobile 支援。請參閱 [PR 38931](https://github.com/angular/angular/pull/38931)。
* 不再支援 TypeScript 3.9。請更新至 TypeScript 4.0。請參閱 [PR 39313](https://github.com/angular/angular/pull/39313)。
* `NavigationExtras#preserveQueryParams` 已從 `@angular/router` 移除。請參閱 [PR 38762](https://github.com/angular/angular/pull/38762)
* `CollectionChangeRecord` 已從 `@angular/core` 移除。請參閱 [PR 38668](https://github.com/angular/angular/pull/38668)。
* 我們將 `relativeLinkResolution` 的預設值從 `'legacy'` 改為 `'corrected'`，讓新應用程式自動採用 [PR 22394](https://github.com/angular/angular/pull/22394) 的修正行為。使用目前預設值的應用程式，會由遷移工具指定 `'legacy'`，以確保在預設值更新後仍維持目前的行為。請參閱 [PR 25609](https://github.com/angular/angular/pull/25609)。
* 修正路由器中的一個錯誤：在處理子路由時，呼叫 `shouldReuseRoute` 時 `future` 與 `curr` 快照的引數順序相反。通常這個順序錯誤沒有影響，因為 [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute) 的大多數實作只對 `future` 與 `curr` 做相等比較。然而，有些實作確實依賴其中之一的特定值，將需要更新。請參閱 [PR 26949](https://github.com/angular/angular/pull/26949)。
* `ViewEncapsulation.Native` 已移除。Angular 先前支援一種以 v0 Shadow DOM 草案 API 為基礎的檢視封裝模式 `ViewEncapsulaion.Native`。這些 API 已被最終版 Shadow DOM API 取代，後者透過 `ViewEncapsulation.ShadowDom` 啟用。如需此變更的背景資訊，請參閱 [Web Components update: more time to upgrade to v1 APIs](https://developers.google.com/web/updates/2019/07/web-components-time-to-upgrade)。
* `@angular/platform-webworker` 已移除，且不再受到支援。請參閱 [PR 38846](https://github.com/angular/angular/pull/38846)。
* `@angular/platform-webworker` 不再受到支援，之後不會再發佈新版本。請參閱 [PR 38846](https://github.com/angular/angular/pull/38846)。
* 更新了 `initialNavigation` 的選項。更多資訊，請參閱 API 文件中的 [initialNavigation](api/router/InitialNavigation)。請參閱 [PR 33128](https://github.com/angular/angular/pull/33128)。
* `DatePipe` 不再對小數毫秒進位。請參閱 [PR 38009](https://github.com/angular/angular/pull/38009)。
* 地區設定資料陣列現在是唯讀的。請參閱 [PR 30397](https://github.com/angular/angular/pull/30397)。
* 為 `NG_VALUE_ACCESSOR` 注入的 `ControlValueAccessor` 現在是唯讀的。請參閱 [PR 29273](https://github.com/angular/angular/pull/29723)。
* `AbstractControl#parent` 的型別現在表明它可能為 null。請參閱 [PR 32671](https://github.com/angular/angular/pull/32671)。
* 在初始化 TestBed 之前呼叫 `overrideProvider`，現在會丟出錯誤。請參閱 [PR 38717](https://github.com/angular/angular/pull/38717)。
* 許多 Angular 內建管道的型別已縮小或擴大，以更為準確。更多資訊，請參閱對應的 [Pipes](https://angular.io/api?type=pipe) API 文件。請參閱 [PR 37447](https://github.com/angular/angular/pull/37447)。
* `@angular/forms` 套件中的指令，先前在建構函式中 validators 與 asyncValidators 引數的型別為 `any[]`。現在這些引數已有正確的型別，因此如果你的程式碼依賴指令建構函式型別，可能需要做一些更新以改善型別安全。請參閱 [PR 38994](https://github.com/angular/angular/pull/38944)。
* `routerLink` 現在接受 `undefined` 輸入。請參閱 [PR 39151](https://github.com/angular/angular/pull/39151)。
* `@angular/core/testing` 的 `async` 函式已更名為 `waitForAsync`，以避免與原生 JavaScript `async` 語法混淆。既有的函式已被棄用，並將在未來版本中移除。請參閱 [PR 37583](https://github.com/angular/angular/pull/37583)。

{@a deprecations}
### 新增的棄用

| 區域                          | API 或功能                                     | 可能移除的版本 |
| ----------------------------- | -------------------------------------------------- | ----------------- |
| `@angular/core/testing`       | 將 `async` 更名為 `waitForAsync`                       | <!--v11--> v13 |


{@a removals}
### 新移除的已棄用 API

下列 API 已自 11.0.0 版起移除*：

| 套件          | API            | 替代方案 | 備註 |
| ---------------- | -------------- | ----------- | ----- |
| `@angular/router`| `NavigationExtras#preserveQueryParams` | 無需任何動作 | NavigationExtras#preserveQueryParams 已從 `@angular/router` 移除。|
| `@angular/core` | `CollectionChangeRecord` | 無需任何動作 | CollectionChangeRecord 已從 `@angular/core` 移除。|
| `@angular/core` | `ViewEncapsulation.Native` | 無需任何動作 | Angular 先前支援一種以 v0 Shadow DOM 草案 API 為基礎的檢視封裝模式 `ViewEncapsulaion.Native`。這些 API 已被最終版 Shadow DOM API 取代，後者透過 `ViewEncapsulation.ShadowDom` 啟用。如需此變更的背景資訊，請參閱 [Web Components update: more time to upgrade to v1 APIs](https://developers.google.com/web/updates/2019/07/web-components-time-to-upgrade)。|

{@a ivy}

## Ivy 功能與相容性

自第 9 版起，Angular Ivy 是預設的渲染引擎。如果你還沒聽過 Ivy，可以在 [Angular Ivy 指南](guide/ivy) 中了解更多。

* Ivy 的功能之一，是在範本中引入更完整的型別檢查。詳情請參閱 [範本型別檢查](guide/template-typecheck)。

* 如需除錯的一般指引，以及與 Ivy 相關的小幅變更清單，請參閱 [Ivy 相容性指南](guide/ivy-compatibility)。

* 如需退出 Ivy 的說明，請參閱[這裡](guide/ivy#opting-out-of-angular-ivy) 的指示。
