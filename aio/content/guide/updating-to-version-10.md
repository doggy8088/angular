# 更新到 Angular 第 10 版

本指南包含與更新到 Angular 第 10 版相關的資訊。

<div class="alert is-helpful">

如需升級到 Angular 第 9 版的資訊，請參閱[更新到 Angular 第 9 版](https://v9.angular.tw/guide/updating-to-version-9)。

</div>

## 更新 CLI 應用程式

如需了解如何更新至最新 Angular 版本、並運用我們的自動化遷移工具來做到這一點的逐步說明，請使用 [update.angular.io](https://update.angular.io) 上的互動式更新指南。

如果你好奇 CLI 執行了哪些具體的遷移，請參閱[自動遷移一節](#migrations)，了解哪些程式碼正在變更以及原因。

## 第 10 版的變更與棄用

<div class="alert is-helpful">

   如需了解 Angular 的棄用與移除實務，請參閱 [Angular 發佈實務](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices")。

</div>

{@a breaking-changes}
### 新的破壞性變更

* 不再支援 TypeScript 3.6、3.7 與 3.8。請更新至 TypeScript 3.9。
* 型別為 `number` 的輸入欄位，每次值變更時只會觸發一次 `valueChanges` 事件（不像某些情況下會觸發兩次）。請參閱 [PR 36087](https://github.com/angular/angular/pull/36087)。
* `minLength` 與 `maxLength` 驗證器只驗證具有數值型 `length` 屬性的值。請參閱 [PR 36157](https://github.com/angular/angular/pull/36157)。
* 帶有未知屬性繫結或未知元素名稱的範本，現在會記錄錯誤而非警告。請參閱 [PR 36399](https://github.com/angular/angular/pull/36399)。
* `UrlMatcher` 現在可以傳回 `null` 值。請參閱 [PR 36402](https://github.com/angular/angular/pull/36402)。
* 移植的檢視現在只在插入點重新整理。請參閱 [PR 35968](https://github.com/angular/angular/pull/35968)。
* 使用 `b` 或 `B` 格式代碼格式化時間，現在支援跨越午夜的時段。請參閱 [PR 36611](https://github.com/angular/angular/pull/36611)。
* 對於至少有一個空解析器的路由，導覽會被取消。請參閱 [PR 24621](https://github.com/angular/angular/pull/24621)。

{@a deprecations}
### 新增的棄用

| 區域                          | API 或功能                                                                 | 可能移除的版本 |
| ----------------------------- | ---------------------------------------------------------------------------    | ----------------- |
| `@angular/core`               | [`WrappedValue`](guide/deprecations#wrapped-value)                                     | <!--v10--> v12 |
| 瀏覽器支援               | [`IE 9, 10, and IE Mobile`](guide/deprecations#ie-910-與-ie-mobile-支援) | <!--v10--> v11 |


{@a removals}
### 新移除的已棄用 API

下列 API 已自 10.0.0 版起移除*：

| 套件          | API            | 替代方案 | 備註 |
| ---------------- | -------------- | ----------- | ----- |
| `@angular/core`  | 使用 Angular 功能的未加裝飾器基礎類別 | 加入 Angular 裝飾器 | 詳情請參閱[遷移指南](guide/migration-undecorated-classes) |
| `@angular/core`  | 不帶泛型的 `ModuleWithProviders`             | 帶泛型的 `ModuleWithProviders` | 詳情請參閱[遷移指南](guide/migration-module-with-providers) |
| `@angular/core`  | 樣式清理 | 無需任何動作 | 詳情請參閱[樣式清理 API 移除](/guide/deprecations#style-sanitization)
| `@angular/bazel` | [`Bazel builder and schematics`](guide/deprecations#bazelbuilder) | `bazelbuild/rules_nodejs` | [更多資訊](https://github.com/angular/angular/tree/10.0.x/packages/bazel/src/schematics) |


*若要查看第 9 版移除的 API，請參閱[第 9 版文件網站](https://v9.angular.tw/guide/deprecations#removed)上的本指南。

{@a ivy}

## Ivy 功能與相容性

自第 9 版起，Angular Ivy 是預設的渲染引擎。如果你還沒聽過 Ivy，可以在 [Angular Ivy 指南](guide/ivy) 中了解更多。

* Ivy 的功能之一，是在範本中引入更完整的型別檢查。詳情請參閱 [範本型別檢查](guide/template-typecheck)。

* 如需除錯的一般指引，以及與 Ivy 相關的小幅變更清單，請參閱 [Ivy 相容性指南](guide/ivy-compatibility)。

* 如需退出 Ivy 的說明，請參閱[這裡](guide/ivy#opting-out-of-angular-ivy) 的指示。

{@a migrations}
## 第 10 版的自動遷移

了解 CLI 為你自動處理的遷移：

* [遷移缺失的 `@Directive()`/`@Component()` 裝飾器](guide/migration-undecorated-classes)
* [遷移 `ModuleWithProviders`](guide/migration-module-with-providers)
* [`tslib` 直接相依性遷移](guide/migration-update-libraries-tslib)
* [更新 `module` 與 `target` 編譯器選項遷移](guide/migration-update-module-and-target-compiler-options)
