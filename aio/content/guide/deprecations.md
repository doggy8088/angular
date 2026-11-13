# 已棄用的 API 與功能

Angular 致力於在創新與穩定之間取得平衡。
有時候，API 與功能會變得過時，需要移除或取代，讓 Angular 能跟上新的最佳實務、相依性的變化，或 (web) 平台本身的變化。

為了讓這些轉換盡可能輕鬆，我們會先將 API 與功能棄用一段時間，再將它們移除。這讓你有時間將應用程式更新為最新的 API 與最佳實務。

本指南摘要列出目前已棄用的所有 Angular API 與功能。

<div class="alert is-helpful">

在 v6 或更早版本棄用的功能與 API，是在第 9 版或任何後續主要版本中移除的候選對象。關於 Angular 的棄用與移除實務，請參閱 [Angular Release Practices](guide/releases#淘汰實務 "Angular Release Practices: Deprecation practices")。

關於如何逐步更新到最新 Angular 版本的說明，請使用 [update.angular.io](https://update.angular.io) 上的互動式更新指南。

</div>

## 索引

為了協助你讓專案面向未來，下表列出所有已棄用的 API 與功能，並依可能移除的版本整理。每個項目都會連結到本指南後面說明棄用原因與替代選項的小節。

<!--
deprecation -> removal cheat sheet
v4 - v7
v5 - v8
v6 - v9
v7 - v10
v8 - v11
v9 - v12
v10 - v13
v11 - v14
v12 - v15
-->

| 領域                    | API 或功能                                                                                | 可能移除於     |
|:---                     |:---                                                                                           |:---                   |
| `@angular/common`       | [`ReflectiveInjector`](#reflectiveinjector)                                                   | <!--v8--> v11         |
| `@angular/common`       | [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | <!--v9--> v11         |
| `@angular/common/http`  | [`XhrFactory`](api/common/http/XhrFactory)                                                    | <!--v12--> v15        |
| `@angular/core`         | [`DefaultIterableDiffer`](#core)                                                              | <!--v7--> v11         |
| `@angular/core`         | [`ReflectiveKey`](#core)                                                                      | <!--v8--> v11         |
| `@angular/core`         | [`RenderComponentType`](#core)                                                                | <!--v7--> v11         |
| `@angular/core`         | [`WrappedValue`](#core)                                                                       | <!--v10--> v12        |
| `@angular/forms`        | [`ngModel` with reactive forms](#ngmodel-reactive)                                            | <!--v6--> v11         |
| `@angular/upgrade`      | [`@angular/upgrade`](#upgrade)                                                                | <!--v8--> v11         |
| `@angular/upgrade`      | [`getAngularLib`](#upgrade-static)                                                            | <!--v8--> v11         |
| `@angular/upgrade`      | [`setAngularLib`](#upgrade-static)                                                            | <!--v8--> v11         |
| 範本語法         | [`<template>`](#template-tag)                                                                 | <!--v7--> v11         |
| polyfills               | [reflect-metadata](#reflect-metadata)                                                         | <!--v8--> v11         |
| npm 套件格式      | [`esm5` and `fesm5` entry-points in @angular/* npm packages](guide/deprecations#esm5-fesm5)   | <!-- v9 --> v11       |
| `@angular/core`         | [`defineInjectable`](#core)                                                                   | <!--v8--> v11         |
| `@angular/core`         | [`entryComponents`](api/core/NgModule#entryComponents)                                        | <!--v9--> v11         |
| `@angular/core`         | [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS)                       | <!--v9--> v11         |
| `@angular/router`       | [`loadChildren` string syntax](#loadChildren)                                                 | <!--v9--> v11         |
| `@angular/core/testing` | [`TestBed.get`](#testing)                                                                     | <!--v9--> v12         |
| `@angular/core/testing` | [`async`](#testing)                                                                           | <!--v9--> v12         |
| `@angular/forms`        | [`FormBuilder.group` legacy options parameter](api/forms/FormBuilder#group)                   | <!--v11--> v14        |
| `@angular/router`       | [`ActivatedRoute` params and `queryParams` properties](#activatedroute-props)                 | unspecified           |
| 範本語法         | [`/deep/`, `>>>`, and `::ng-deep`](#deep-component-style-selector)                            | <!--v7--> unspecified |

關於 Angular CDK 與 Angular Material 的棄用資訊，請參閱[變更日誌](https://github.com/angular/components/blob/master/CHANGELOG.md)。

## 已棄用的 API

本節完整列出目前所有已棄用的 API，並附上詳細資訊，協助你規劃遷移到替代方案。

<div class="alert is-helpful">

**提示**：本站的 [API 參考](api)區段中，已棄用的 API 會以 ~~刪除線~~ 標示。你可以依 [**Status: deprecated**](api?status=deprecated) 篩選 API 清單。

</div>

{@a common}

### @angular/common

| API                                                                                           | 替代方案                                         | 宣布棄用 | 詳細資訊                                                                                                     |
| :---                                                                                          |:---                                                 |:---                   |:---                                                                                                       |
| [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | `{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}` | v9                    | 從 v11 起，預設代碼將從 `LOCALE_ID` 提供的地區設定資料中擷取，而不是 `USD`。 |

{@a common-http}

### @angular/common/http

| API                                        | 替代方案                       | 宣布棄用 | 詳細資訊                                                                        |
|:---                                        |:---                               |:---                   |:---                                                                          |
| [`XhrFactory`](api/common/http/XhrFactory) | `@angular/common` 中的 `XhrFactory` | v12                   | `XhrFactory` 已從 `@angular/common/http` 移至 `@angular/common`。 |

{@a core}

### @angular/core

| API                                                                                | 替代方案                                                                        | 宣布棄用 | 詳細資訊                                                                                                                                                                                                                                    |
|:---                                                                                |:---                                                                                |:---                   |:---                                                                                                                                                                                                                                      |
| [`DefaultIterableDiffer`](api/core/DefaultIterableDiffer)                          | n/a                                                                                | v4                    | 不屬於公開 API。                                                                                                                                                                                                                  |
| [`ReflectiveInjector`](api/core/ReflectiveInjector)                                | `{@link Injector#create Injector.create()}`                                        | v5                    | 請參閱 [`ReflectiveInjector`](#reflectiveinjector)                                                                                                                                                                                          |
| [`ReflectiveKey`](api/core/ReflectiveKey)                                          | 無                                                                               | v5                    | 無                                                                                                                                                                                                                                     |
| [`defineInjectable`](api/core/defineInjectable)                                    | `ɵɵdefineInjectable`                                                               | v8                    | 僅用於產生的程式碼。原始碼不應依賴這個 API。                                                                                                                                                                   |
| [`entryComponents`](api/core/NgModule#entryComponents)                             | 無                                                                               | v9                    | 請參閱 [`entryComponents`](#entryComponents)                                                                                                                                                                                                |
| [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS)            | 無                                                                               | v9                    | 請參閱 [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents)                                                                                                                                                                                   |
| [`WrappedValue`](api/core/WrappedValue)                                            | 無                                                                               | v10                   | 請參閱[移除 `WrappedValue`](#wrapped-value)                                                                                                                                                                                            |
| [`async`](api/core/testing/async)                                                  | [`waitForAsync`](api/core/testing/waitForAsync)                                    | v11                   | `@angular/core/testing` 的 [`async`](api/core/testing/async) 函式已重新命名為 `waitForAsync`，以免與原生 JavaScript <code class="no-auto-link">async</code> 語法混淆。現有的函式已被棄用，將在未來版本中移除。 |
| `ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly` | 無（屬於 [issue #40091](https://github.com/angular/angular/issues/40091) 的一部分） |                       | 這是為修復 [issue #40091](https://github.com/angular/angular/issues/40091) 而引入的暫時旗標，將會被移除。                                                                                            |

{@a testing}

### @angular/core/testing

| API                                           | 替代方案                                         | 宣布棄用 | 詳細資訊                                         |
|:---                                           |:---                                                 |:---                   |:---                                           |
| [`TestBed.get`](api/core/testing/TestBed#get) | [`TestBed.inject`](api/core/testing/TestBed#inject) | v9                    | 行為相同，但具備型別安全。                 |
| [`async`](api/core/testing/async)             | [`waitForAsync`](api/core/testing/waitForAsync)     | v10                   | 行為相同，但重新命名以免混淆。 |

{@a forms}

### @angular/forms

| API                                                                         | 替代方案                                                                  | 宣布棄用 | 詳細資訊 |
|:---                                                                         |:---                                                                          |:---                   |:---   |
| [`ngModel` with reactive forms](#ngmodel-reactive)                          | [`FormControlDirective`](api/forms/FormControlDirective)                     | v6                    | 無  |
| [`FormBuilder.group` legacy options parameter](api/forms/FormBuilder#group) | [`AbstractControlOptions` parameter value](api/forms/AbstractControlOptions) | v11                   | 無  |

{@a upgrade}

### @angular/upgrade

| API                             | 替代方案                                     | 宣布棄用 | 詳細資訊                                          |
|:---                             |:---                                             |:---                   |:---                                            |
| [All entry points](api/upgrade) | [`@angular/upgrade/static`](api/upgrade/static) | v5                    | 請參閱[從 AngularJS 升級](guide/upgrade)。 |

{@a upgrade-static}

### @angular/upgrade/static

| API                                                 | 替代方案                                                   | 宣布棄用 | 詳細資訊                                          |
|:---                                                 |:---                                                           |:---                   |:---                                            |
| [`getAngularLib`](api/upgrade/static/getAngularLib) | [`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal) | v5                    | 請參閱[從 AngularJS 升級](guide/upgrade)。 |
| [`setAngularLib`](api/upgrade/static/setAngularLib) | [`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal) | v5                    | 請參閱[從 AngularJS 升級](guide/upgrade)。 |

{@a deprecated-features}

## 已棄用的功能

本節列出目前所有已棄用的功能，包括範本語法、設定選項，以及未列在上文[已棄用的 API](#已棄用的-api)一節中的其他棄用項目。其中也包含已棄用的 API 使用情境或 API 組合，作為上述資訊的補充。

{@a bazelbuilder}

### Bazel builder 與 schematics

Bazel builder 與 schematics 在 Angular Labs 中推出，讓使用者可以試用 Bazel，而不必管理 Bazel 版本與 BUILD 檔案。
這項功能已被棄用。更多資訊，請參閱[遷移文件](https://github.com/angular/angular/blob/master/packages/bazel/docs/BAZEL_SCHEMATICS.md)。

{@a wtf}

### Web Tracing Framework 整合

Angular 過去支援與 [Web Tracing Framework (WTF)](https://google.github.io/tracing-framework) 的整合，用於 Angular 應用程式的效能測試。這項整合已無人維護，現已失效。因此，這項整合在 Angular 第 8 版中被棄用，而且由於沒有任何現有使用跡象，在第 9 版中被移除。

{@a deep-component-style-selector}

### `/deep/`、`>>>` 與 `::ng-deep` 元件樣式選取器

穿透 shadow DOM 的子代組合器已被棄用，各大瀏覽器與工具正在[移除對它的支援](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing)。因此，在 v4 中，我們棄用了 Angular 對 `/deep/`、`>>>` 與 `::ng-deep` 三者的支援。在移除之前，為了與工具保持更廣泛的相容性，建議優先使用 `::ng-deep`。

更多資訊，請參閱 Component Styles 指南中的 [/deep/、>>> 與 ::ng-deep](guide/component-styles#已棄用deep-與-ng-deep "Component Styles guide, Deprecated deep and ngdeep")。

{@a template-tag}

### `<template>` 標籤

`<template>` 標籤在 v4 中被棄用，以避免與同名的 DOM 元素衝突（例如使用 web components 時）。請改用 `<ng-template>`。更多資訊，請參閱 [Ahead-of-Time Compilation](guide/aot-compiler) 指南。

{@a ngmodel-reactive}

### 搭配 reactive forms 的 ngModel

將 `ngModel` 輸入屬性與 `ngModelChange` 事件搭配 reactive form 指令使用的支援，已在 Angular v6 中棄用，將在未來版本的 Angular 中移除。

現已棄用的寫法：

<code-example path="deprecation-guide/src/app/app.component.html" region="deprecated-example" language="html"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="deprecated-example"></code-example>

這項支援被棄用有幾個原因。首先，開發人員覺得這種模式令人困惑。看起來像是實際使用了 `ngModel` 指令，但實際上它是 reactive form 指令上名為 `ngModel` 的輸入／輸出屬性，只近似該指令的部分行為，而非全部。它允許取得與設定值，以及攔截值事件，但 `ngModel` 的其他某些功能（例如使用 `ngModelOptions` 延遲更新，或匯出指令）無法運作。

此外，這種模式混合了範本驅動與 reactive forms 兩種策略，無法充分發揮任一策略的完整優點。在範本中設定值違反了 reactive forms 背後的範本無關原則，而在類別中加入 `FormControl`/`FormGroup` 層，則失去了在範本中定義表單的便利性。

若要在支援被移除之前更新你的程式碼，你會想要決定要繼續使用 reactive form 指令（並以 reactive forms 模式取得／設定值），還是改用範本驅動指令。

**修改後**（選項 1 - 使用 reactive forms）：

<code-example path="deprecation-guide/src/app/app.component.html" region="reactive-form-example" language="html"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="reactive-form-example"></code-example>

**修改後**（選項 2 - 使用範本驅動 forms）：

<code-example path="deprecation-guide/src/app/app.component.html" region="template-driven-form-example" language="html"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="template-driven-form-example"></code-example>

預設情況下，使用這種模式時，你會在開發模式中看到一次棄用警告。你可以在匯入時設定 `ReactiveFormsModule`，選擇關閉這個警告：

<code-example path="deprecation-guide/src/app/app.module.ts" region="reactive-form-no-warning"></code-example>

或者，你也可以選擇為這種模式的每個實例顯示個別警告，設定值為 `"always"`。這可能有助於在更新程式碼時，追蹤程式碼中使用這種模式的位置。

{@a reflectiveinjector}

### ReflectiveInjector

在第 5 版中，Angular 以 `StaticInjector` 取代了 `ReflectiveInjector`。注入器不再需要 Reflect polyfill，為大多數開發者縮減了應用程式大小。

**之前**：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="reflective-injector-deprecated-example"></code-example>

**之後**：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="static-injector-example"></code-example>

{@a loadChildren}

### loadChildren 字串語法

Angular 剛推出延遲載入路由時，瀏覽器尚不支援動態載入額外的 JavaScript。Angular 設計了我們自己的機制，使用 `loadChildren: './lazy/lazy.module#LazyModule'` 語法，並建立了工具來支援它。如今許多瀏覽器已支援 ECMAScript 動態匯入，Angular 正朝向這個新語法發展。

在第 8 版中，[`loadChildren`](api/router/LoadChildren) 路由規格的字串語法已被棄用，改採使用 `import()` 語法的新語法。

**之前**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="lazyload-deprecated-syntax"></code-example>

**之後**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="lazyload-syntax"></code-example>

<div class="alert is-helpful">

**第 8 版更新**：更新到第 8 版時，[`ng update`](cli/update) 指令會自動執行轉換。第 7 版之前，`import()` 語法只能在 JIT 模式下運作（使用 View Engine）。

</div>

<div class="alert is-helpful">

**宣告語法**：請務必遵循 `loadChildren: () => import('...').then(m => m.ModuleName)` 這種路由宣告語法，讓 `ngc` 能找到延遲載入的模組與相關聯的 `NgModule`。允許的語法結構完整清單請見[這裡](https://github.com/angular/angular-cli/blob/a491b09800b493fe01301387fa9a025f7c7d4808/packages/ngtools/webpack/src/transformers/import_factory.ts#L104-L113)。Ivy 發佈後這些限制將會放寬，因為它不再使用 `NgFactories`。

</div>

{@a activatedroute-props}

### ActivatedRoute 的 params 與 queryParams 屬性

[ActivatedRoute](api/router/ActivatedRoute) 包含兩個[屬性](api/router/ActivatedRoute#properties)，它們的能力不及各自的替代方案，未來可能會在 Angular 的某個版本中被棄用。

| 屬性 | 替代方案 |
| -------- | ----------- |
| `params` | `paramMap` |
| `queryParams` | `queryParamMap` |

更多資訊，請參閱 [Router 指南](guide/router) 中的[取得路由資訊](guide/router-reference#activated-route)一節。

{@a reflect-metadata}

### 在 JIT 模式中對 reflect-metadata polyfill 的依賴

Angular 應用程式，特別是依賴 JIT 編譯器的應用程式，過去需要一個 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) API 的 polyfill。

在 Angular 8.0 版中已移除對這個 polyfill 的需求（[參閱 #14473](https://github.com/angular/angular-cli/pull/14473)），使得大多數 Angular 應用程式中的 polyfill 變得不必要。由於第三方程式庫可能依賴這個 polyfill，我們不是從所有 Angular 專案中移除它，而是在 8.0 版中棄用對這個 polyfill 的需求。這應該能給程式庫作者與應用程式開發人員足夠的時間，評估是否需要這個 polyfill，並執行必要的重構來移除對它的依賴。

在典型的 Angular 專案中，polyfill 不會用於正式環境建置，因此移除它不應影響正式環境應用程式。這次移除的目標是整體簡化建置設定，並減少外部相依性的數量。

{@a static-query-resolution}

### `@ViewChild()` / `@ContentChild()` 靜態解析作為預設值

請參閱[靜態查詢專用遷移指南](guide/static-query-migration)。

{@a contentchild-input-together}

### `@ContentChild()` / `@Input()` 一起使用

下列模式已被棄用：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="template-with-input-deprecated"></code-example>

請不要使用這種模式，而是將兩個裝飾器分開放在各自的屬性中，並加入遞補邏輯，如下列範例所示：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="template-with-input"></code-example>

{@a cant-assign-template-vars}

### 無法指派給範本變數

在下列範例中，雙向繫結表示當 `valueChange` 事件觸發時，應該寫入 `optionName`。

<code-example path="deprecation-guide/src/app/app.component.1.html" region="two-way-template-deprecated"></code-example>

然而，實際上 Angular 會忽略對範本變數的雙向繫結。從第 8 版開始，嘗試寫入範本變數已被棄用。在未來版本中，我們會拋出錯誤，表示不支援這種寫入。

<code-example path="deprecation-guide/src/app/app.component.html" region="valid-template-bind"></code-example>

{@a binding-to-innertext}

### 在 `platform-server` 中繫結 `innerText`

[Domino](https://github.com/fgnass/domino) 用於伺服器端渲染，它不支援 `innerText`，因此在 platform-server 的「domino adapter」中，有特殊程式碼會在你嘗試繫結 `innerText` 時遞補為 `textContent`。

這兩個屬性有細微的差異，因此在底層切換為 `textContent` 可能會讓使用者感到意外。基於這個原因，我們正在棄用這種行為。往後，使用 Domino 時，使用者應明確繫結到 `textContent`。

{@a wtf-apis}

### `wtfStartTimeRange` 與所有 `wtf*` API

所有 `wtf*` API 都已被棄用，將在未來版本中移除。

{@a entryComponents}

### `entryComponents` 與 `ANALYZE_FOR_ENTRY_COMPONENTS` 不再需要

過去，`NgModule` 定義中的 `entryComponents` 陣列用於告訴編譯器哪些元件會被動態建立與插入。使用 Ivy 後，這不再是必要條件，`entryComponents` 陣列可以從現有的模組宣告中移除。`ANALYZE_FOR_ENTRY_COMPONENTS` 注入 token 也同樣適用。

**注意**：如果你要建置的程式庫會被 View Engine 應用程式使用，你可能仍需要保留這些。

{@a moduleWithProviders}

### 沒有泛型的 `ModuleWithProviders` 型別

某些 Angular 程式庫（例如 `@angular/router` 與 `@ngrx/store`）實作的 API 會回傳一種稱為 `ModuleWithProviders` 的型別（通常使用名為 `forRoot()` 的方法）。這種型別代表一個 `NgModule` 以及額外的 provider。Angular 第 9 版棄用了未明確指定泛型型別的 `ModuleWithProviders` 用法，其中泛型型別指的是 `NgModule` 的型別。在未來的 Angular 版本中，泛型將不再是選填的。

如果你使用 CLI，`ng update` 應該會[自動遷移你的程式碼](guide/migration-module-with-providers)。如果你不使用 CLI，可以手動為應用程式加入缺少的泛型型別。例如：

**修改前**

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="ModuleWithProvidersNonGeneric"></code-example>

**修改後**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="ModuleWithProvidersGeneric"></code-example>

{@a wrapped-value}

### `WrappedValue`

`WrappedValue` 的用途是讓同一個物件實例在變更偵測時被視為不同。它通常與 `async` 管道搭配使用，用於 `Observable` 產生相同實例值的情況。

鑑於這個使用情境相對罕見，而且特殊處理會影響應用程式效能，我們已在 v10 中將它棄用。本次棄用沒有規劃替代方案。

如果你依賴「同一個物件實例應觸發變更偵測」的行為，你有兩個選項：

*   複製產生的值，讓它具有新的身分。
*   明確呼叫 [`ChangeDetectorRef.detectChanges()`](api/core/ChangeDetectorRef#detectchanges) 來強制更新。

<!--
### Internet Explorer 11

Angular support for Microsoft's Internet Explorer 11 (IE11) is deprecated and will be removed in Angular v13.
Ending IE11 support allows Angular to take advantage of web platform APIs present only in evergreen browsers, resulting in better APIs for developers and more capabilities for application users.
An additional motivation behind this removal is the drop in global usage of IE11 to just ~1% (as of March 2021).
For full rationale and discussion behind this deprecation, see [RFC: Internet Explorer 11 support deprecation and removal](https://github.com/angular/angular/issues/41840).

**Note**: IE11 will be supported in Angular v12 LTS releases through November 2022.
-->

### Internet Explorer 11
Angular 對 Microsoft 的 Internet Explorer 11 (IE11) 的支援已被棄用，將在 Angular v13 中移除。
結束 IE11 支援讓 Angular 能利用只有常青瀏覽器才具備的 Web 平台 API，為開發者帶來更好的 API，為應用程式使用者帶來更多功能。
移除的另一個動機，是 IE11 的全球使用率已降至約 1%（截至 2021 年 3 月）。
棄用背後的完整理由與討論，請參閱 [RFC: Internet Explorer 11 support deprecation and removal](https://github.com/angular/angular/issues/41840)。

*注意：Angular v12 LTS 版本將持續支援 IE11 至 2022 年 11 月。*

{@a deprecated-cli-flags}

## 已棄用的 CLI API 與選項

本節完整列出目前已棄用的所有 CLI 旗標。

### @angular-devkit/build-angular

| API/選項                | 可能移除於 | 詳細資訊                                                                                                          |
| ------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `extractCss`              | <!--v11--> v13    | 在開發期間不再需要停用 CSS 擷取。                                               |
| `i18nFormat`              | <!--v9--> v12     | 格式現在會自動偵測。                                                                          |
| `i18nLocale`              | <!--v9--> v12     | 第 9 版及更新版本中的新[本地化選項][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]。 |
| `hmrWarning`              | <!--v11--> v13    | 已不再有任何作用。                                                                                       |
| `servePathDefaultWarning` | <!--v11--> v13    | 已不再有任何作用。                                                                                       |

### @schematics/angular

| API/選項                      | 可能移除於 | 詳細資訊                                                                           |
| ------------------------------- | ----------------- |-------------------------------------------------------------------------------- |
| `lintFix`                       | <!--v11--> v12    | 作為 TSLint 棄用的一部分而棄用。                                      |

{@a removed}

## 已移除的 API

下列 API 已從 11.0.0 版開始移除*：

| 套件          | API            | 替代方案 | 詳細資訊 |
| ---------------- | -------------- | ----------- | ----- |
| `@angular/router` | `preserveQueryParams` | [`queryParamsHandling`](api/router/UrlCreationOptions#queryParamsHandling) | |

\* 若要查看在第 10 版移除的 API，請參閱[第 10 版文件網站](https://v10.angular.tw/guide/deprecations#removed)上的本指南。

{@a esm5-fesm5}

### `esm5` 與 `fesm5` 程式碼格式（@angular/* npm 套件）

自 Angular v8 起，CLI 主要取用 `@angular/*` npm 套件所散佈程式碼的 `fesm2015` 變體。這使得 `esm5` 與 `fesm5` 散佈版本變得過時且不必要，徒增套件大小並拖慢 npm 安裝速度。

這項移除對 CLI 使用者沒有影響，除非他們修改了建置設定，明確指定取用這些程式碼散佈版本。

任何仍依賴 `esm5` 與 `fesm5` 作為其建置系統輸入的應用程式，都需要確保其建置管線能夠接受符合 ECMAScript 2015 (ES2015) 語言規格的 JavaScript 程式碼。

請注意，這項變更不會使以這種格式散佈的現有程式庫與 Angular CLI 不相容。如果沒有其他格式可用，CLI 會遞補取用較不理想格式的程式庫。不過，我們仍建議程式庫以 ES2015 格式提供其程式碼，讓建置更快、建置輸出更小。

實際而言，所有 `@angular` 套件的 `package.json` 有了下列變化：

**之前**：

<code-example path="deprecation-guide/angular.package.json" language="json" region="deprecatedPackageJson"></code-example>

**之後**：

<code-example path="deprecation-guide/angular.package.json" language="json" region="packageJson"></code-example>

如需更多關於 npm 套件格式的資訊，請參閱 [Angular Package Format 規格](https://goo.gl/jB3GVv)。

{@a style-sanitization}

### `[style]` 與 `[style.prop]` 繫結的樣式清理

Angular 過去會清理 `[style]` 與 `[style.prop]` 繫結，以防止惡意程式碼透過 CSS `url()` 項目中的 `javascript:` 運算式插入。然而，大多數現代瀏覽器已不再支援這類運算式的用法，因此清理只是為了 IE 6 與 7 而維持。鑑於 Angular 不支援 IE 6 或 7，而且清理有效能成本，從 Angular 第 10 版起，我們將不再清理樣式繫結。

<!-- links -->

[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#在建置設定中定義地區設定 "Define locales in the build configuration - Common Internationalization task #6: Merge translations into the application | Angular"

<!-- end links -->

@reviewed 2021-09-15
