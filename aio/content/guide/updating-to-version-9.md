# 更新到 Angular 第 9 版

本指南包含與更新到 Angular 第 9 版相關的資訊。

## 更新 CLI 應用程式

如需了解如何更新至最新 Angular 版本、並運用我們的自動化遷移工具來做到這一點的逐步說明，請使用 [update.angular.io](https://update.angular.io) 上的互動式更新指南。

如果你好奇 CLI 執行了哪些具體的遷移，請參閱[自動遷移一節](#migrations)，了解哪些程式碼正在變更以及原因。

## 第 9 版的變更與棄用

<div class="alert is-helpful">

   如需了解 Angular 的棄用與移除實務，請參閱 [Angular 發佈實務](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices")。

</div>

{@a breaking-changes}
### 新的破壞性變更

- Angular 現在預設以 Ivy 編譯。請參閱 [Ivy 相容性一節](#ivy)。

- CLI 應用程式預設以 [AOT 模式](/guide/aot-compiler)編譯（包含範本型別檢查）。
過去只以 JIT 建置的使用者可能會看到新的型別錯誤。
詳情請參閱我們的[範本型別檢查指南](guide/template-typecheck)，了解更多資訊與除錯提示。

- 不再支援 Typescript 3.4 與 3.5。請更新至 Typescript 3.7。

- `tslib` 現在列為同儕相依性（peer dependency），而非直接相依性。如果你沒有使用 CLI，必須手動安裝 `tslib`，使用 `yarn add tslib` 或 `npm install tslib --save`。

{@a deprecations}
### 新增的棄用

| API                                                                     | 替代方案                          | 備註 |
| ------------------------------------------------------------------------| ------------------------------------ | ----- |
| [`entryComponents`](api/core/NgModule#entryComponents)                  | 無                                 | 請參閱 [`entryComponents`](guide/deprecations#entryComponents) |
| [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation)| `{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}` | 自第 11 版起，預設的貨幣代碼將從 `LOCAL_ID` 提供的地區設定資料中取得，而非 `USD`。 |
| [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS) | 無                                 | 請參閱 [`ANALYZE_FOR_ENTRY_COMPONENTS`](guide/deprecations#entryComponents) |
| 沒有泛型的 `ModuleWithProviders`                                 | 帶有泛型的 `ModuleWithProviders` | 請參閱 [`ModuleWithProviders` 一節](guide/deprecations#moduleWithProviders) |
| 使用 Angular 功能的未裝飾基底類別                      | 使用加上 `@Directive()` 裝飾器、並使用 Angular 功能的基底類別 | 請參閱[未裝飾基底類別一節](guide/deprecations#undecorated-base-classes) |
| `@angular/*` npm 套件中的 `esm5` 與 `fesm5` 散佈形式            | `esm2015` 與 `fesm2015` 進入點 | 請參閱 [`esm5` 與 `fesm5`](guide/deprecations#esm5-fesm5) |
| [`TestBed.get`](api/core/testing/TestBed#get)                           | [`TestBed.inject`](api/core/testing/TestBed#inject) | 行為相同，但具備型別安全。 |


{@a removals}
### 新移除的已棄用 API

| 套件 | API            | 替代方案 | 備註 |
| ------- | -------------- | ----------- | ----- |
| `@angular/core`  | [`Renderer`](https://v8.angular.tw/api/core/Renderer) | [`Renderer2`](api/core/Renderer2) | [遷移指南。](guide/migration-renderer) |
| `@angular/core`  | [`RootRenderer`](https://v8.angular.tw/api/core/RootRenderer) | [`RendererFactory2`](api/core/RendererFactory2) | 無 |
| `@angular/core`  | [`RenderComponentType`](https://v8.angular.tw/api/core/RenderComponentType) | [`RendererType2`](api/core/RendererType2) | 無 |
| `@angular/core`  | [`WtfScopeFn`](https://v8.angular.tw/api/core/WtfScopeFn) | 無 | v8 | 請參閱 [Web Tracing Framework](#wtf) |
| `@angular/core`  | [`wtfCreateScope`](https://v8.angular.tw/api/core/wtfCreateScope) | 無 | v8 | 請參閱 [Web Tracing Framework](guide/deprecations#wtf) |
| `@angular/core`  | [`wtfStartTimeRange`](https://v8.angular.tw/api/core/wtfStartTimeRange) | 無 | v8 | 請參閱 [Web Tracing Framework](guide/deprecations#wtf) |
| `@angular/core`  | [`wtfEndTimeRange`](https://v8.angular.tw/api/core/wtfEndTimeRange) | 無 | v8 | 請參閱 [Web Tracing Framework](guide/deprecations#wtf) |
| `@angular/core`  | [`wtfLeave`](https://v8.angular.tw/api/core/wtfLeave) | 無 | v8 | 請參閱 [Web Tracing Framework](guide/deprecations#wtf) |
| `@angular/common` | `DeprecatedI18NPipesModule` | [`CommonModule`](api/common/CommonModule#pipes) | 無 |
| `@angular/common` | `DeprecatedCurrencyPipe` | [`CurrencyPipe`](api/common/CurrencyPipe) | 無 |
| `@angular/common` | `DeprecatedDatePipe`     | [`DatePipe`](api/common/DatePipe) | 無 |
| `@angular/common` | `DeprecatedDecimalPipe` | [`DecimalPipe`](api/common/DecimalPipe) | 無 |
| `@angular/common` | `DeprecatedPercentPipe` | [`PercentPipe`](api/common/PercentPipe) | 無 |
| `@angular/forms` | [`NgFormSelectorWarning`](https://v8.angular.tw/api/forms/NgFormSelectorWarning) | 無 |
| `@angular/forms` | `ngForm` 元素選擇器 | `ng-form` 元素選擇器 | 無 |
| `@angular/service-worker` | `versionedFiles` | `files` | 在 service worker 設定檔 `ngsw-config.json` 中，將 `versionedFiles` 取代為 `files`。請參閱 [Service Worker 設定](guide/service-worker-config#assetgroups)。 |

{@a ivy}

## Ivy 功能與相容性

在第 9 版中，Angular Ivy 是預設的渲染引擎。如果你還沒聽過 Ivy，可以在 [Angular Ivy 指南](guide/ivy) 中了解更多。

* Ivy 的功能之一，是在範本中引入更完整的型別檢查。詳情請參閱[範本型別檢查](guide/template-typecheck)。

* 如需除錯的一般指引，以及與 Ivy 相關的小幅變更清單，請參閱 [Ivy 相容性指南](guide/ivy-compatibility)。

* 如需退出 Ivy 的說明，請參閱[這裡](guide/ivy#opting-out-of-angular-ivy) 的指示。

{@a migrations}
## 第 9 版的自動遷移

了解 CLI 為你自動處理的遷移：

- [從 `Renderer` 遷移到 `Renderer2`](guide/migration-renderer)
- [遷移缺失的 `@Directive()`/`@Component()` 裝飾器](guide/migration-undecorated-classes)
- [遷移缺失的 `@Injectable()` 裝飾器與不完整的 provider 定義](guide/migration-injectable)
- [遷移動態查詢](guide/migration-dynamic-flag)
- [遷移到新的 `$localize` i18n 支援](guide/migration-localize)
- [遷移 `ModuleWithProviders`](guide/migration-module-with-providers)
