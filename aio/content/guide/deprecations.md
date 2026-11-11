# 已棄用的 API 與功能

Angular 致力於在創新與穩定之間取得平衡。有時候，API 與功能會變得過時，需要移除或取代，讓 Angular 能跟上新的最佳實務、相依性的變化，或 \(web\) 平台本身的變化。

為了讓這些轉換盡可能輕鬆，API 與功能在被移除之前會先棄用一段時間。這讓你有時間將應用程式更新為最新的 API 與最佳實務。

本指南摘要列出目前已棄用的重要 Angular API 與功能。關於棄用與重大變更的完整詳細資訊，請參閱[完整變更日誌](https://github.com/angular/angular/blob/main/CHANGELOG.md)。

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
v13 - v16
v14 - v17
v15 - v18
v16 - v19
-->

### 可在 v11 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/core`                     | [`DefaultIterableDiffer`](#core)                                                                           |  v7           | v11         |
| `@angular/core`                     | [`defineInjectable`](#core)                                                                                |  v8           | v11         |
| `@angular/core`                     | [`entryComponents`](api/core/NgModule)                                                                     |  v9           | v11         |
| `@angular/core`                     | [`ANALYZE_FOR_ENTRY_COMPONENTS`](#core)                                                                    |  v9           | v11         |
| `@angular/forms`                    | [`ngModel` with reactive forms](#ngmodel-reactive)                                                         |  v6           | v11         |
| `@angular/upgrade`                  | [`@angular/upgrade`](#upgrade)                                                                             |  v8           | v11         |
| `@angular/upgrade`                  | [`getAngularLib`](#upgrade-static)                                                                         |  v8           | v11         |
| `@angular/upgrade`                  | [`setAngularLib`](#upgrade-static)                                                                         |  v8           | v11         |
| Polyfill | [reflect-metadata](#reflect-metadata)                                                                      |  v8           | v11         |
| 範本語法 | [`<template>`](#template-tag)                                                                              |  v7           | v11         |

### 可在 v12 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/core/testing`             | [`TestBed.get`](#testing)                                                                                  |  v9           | v12         |
| `@angular/core/testing`             | [`async`](#testing)                                                                                        |  v9           | v12         |

### 可在 v14 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/forms`                    | [`FormBuilder.group` 舊版選項參數](api/forms/FormBuilder#group)                                | v11           | v14         |

### 可在 v15 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/compiler-cli`             | [輸入 setter 強制轉換](#輸入-setter-強制轉換)                                                            | v13           | v15         |
| `@angular/compiler-cli`             | [`fullTemplateTypeCheck`](#full-template-type-check)                                                       | v13           | v15         |
| `@angular/core`                     | [`ApplicationRef.bootstrap` 的 factory 式簽名](#core)                                             | v13           | v15         |
| `@angular/core`                     | [`PlatformRef.bootstrapModuleFactory`](#core)                                                              | v13           | v15         |
| `@angular/core`                     | [`ViewContainerRef.createComponent` 的 factory 式簽名](api/core/ViewContainerRef#createComponent) | v13           | v15         |
| `@angular/upgrade`                  | [`downgradeModule` 的 factory 式簽名](#upgrade-static)                                            | v13           | v15         |
| 範本語法 | [`bind-`、`on-`、`bindon-` 與 `ref-`](#bind-syntax)                                                      | v13           | v15         |

### 可在 v16 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/common/http/testing`      | [`TestRequest` 接受 `ErrorEvent` 以模擬錯誤](#testrequest-errorevent)                       | v13           | v16         |
| `@angular/core`                     | [`getModuleFactory`](#core)                                                                                | v13           | v16         |
| `@angular/core`                     | [`ModuleWithComponentFactories`](#core)                                                                    | v13           | v16         |
| `@angular/core`                     | [`Compiler`](#core)                                                                                        | v13           | v16         |
| `@angular/core`                     | [`CompilerFactory`](#core)                                                                                 | v13           | v16         |
| `@angular/core`                     | [`NgModuleFactory`](#core)                                                                                 | v13           | v16         |
| `@angular/core`                     | [`ComponentFactory`](#core)                                                                                | v13           | v16         |
| `@angular/core`                     | [`ComponentFactoryResolver`](#core)                                                                        | v13           | v16         |
| `@angular/core`                     | [`CompilerOptions.useJit` 與 `CompilerOptions.missingTranslation` 設定選項](#core)                    | v13           | v16         |
| `@angular/platform-browser-dynamic` | [`JitCompilerFactory`](#platform-browser-dynamic)                                                          | v13           | v16         |
| `@angular/platform-browser-dynamic` | [`RESOURCE_CACHE_PROVIDER`](#platform-browser-dynamic)                                                     | v13           | v16         |
| `@angular/platform-server`          | [`ServerTransferStateModule`](#platform-server)                                                            | v14           | v16         |
| `@angular/service-worker`           | [`SwUpdate#activated`](api/service-worker/SwUpdate#activated)                                              | v13           | v16         |
| `@angular/service-worker`           | [`SwUpdate#available`](api/service-worker/SwUpdate#available)                                              | v13           | v16         |

### 可在 v17 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/common`                   | [`NgComponentOutlet.ngComponentOutletNgModuleFactory`](#common)                                            | v14           | v17         |
| `@angular/common`                   | [`DatePipe` - `DATE_PIPE_DEFAULT_TIMEZONE`](api/common/DATE_PIPE_DEFAULT_TIMEZONE)                         | v15           | v17         |
| `@angular/core`                     | 適用於 [`providedIn`](#core) 的 NgModule 與 `'any'` 選項                                                     | v15           | v17         |
| `@angular/core`                     | [`@Component.moduleId`](api/core/Component#moduleId) | v16 | v17 |
| `@angular/router`                   | [`RouterLinkWithHref` directive](#router)                                                                  | v15           | v17         |
| `@angular/router`                   | [Router 可寫入屬性](#router-writable-properties)                                                 | v15.1         | v17         |
| `@angular/router`                   | [Router CanLoad 守衛](#router-can-load)                                                 | v15.1         | v17         |
| `@angular/router`                   | [類別與 `InjectionToken` 守衛及解析器](#router-class-and-injection-token-guards)                | v15.2         | v17         |

### 可在 v18 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/common` | `isPlatformWorkerApp` 與 `isPlatformWorkerUi` | v16 | v18 |
| `@angular/core` | `EnvironmentInjector.runInContext` | v16 | v18 |
| `@angular/platform-server`          | [`PlatformConfig.baseUrl` 與 `PlatformConfig.useAbsoluteUrl` 設定選項](api/platform-server/PlatformConfig) | v16           | v18               |
| `@angular/platform-server`          | [`platformDynamicServer`](api/platform-server/platformDynamicServer) | v16           | v18               |
| `@angular/platform-browser`         | [`BrowserModule.withServerTransition`](api/platform-browser/BrowserModule#withservertransition)            | v16           | v18         |
| `@angular/platform-browser`         | [`makeStateKey`、`StateKey` 與 `TransferState`](#platform-browser)，這些符號已移至 `@angular/core`                                        | v16           | v18         |


### 可在 v19 或之後版本移除的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/core` | `PACKAGE_ROOT_URL` | v17 | v19 |

### 未規劃移除版本的已棄用功能

| 領域 | API 或功能                                                                                             | 棄用於 | 可能移除於 |
|:---                  |:---                         |:---                                                                         |:---                  |
| 範本語法 | [`/deep/`、`>>>` 與 `::ng-deep`](#deep-component-style-selector)                                         |  v7           | 未指定 |

關於 Angular Component Development Kit（CDK）與 Angular Material 的棄用資訊，請參閱[變更日誌](https://github.com/angular/components/blob/main/CHANGELOG.md)。

## 已棄用的 API

本節完整列出所有已棄用的 API，並附上詳細資訊，協助你規劃遷移到替代方案。

<div class="alert is-helpful">

**提示**：<br />
本站的 [API 參考](api)區段中，已棄用的 API 會以~~刪除線~~標示。你可以依 [狀態：已棄用](api?status=deprecated) 篩選 API 清單。

</div>

<a id="common"></a>

### &commat;angular/common

| API                                                                                           | 替代方案                                         | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`NgComponentOutlet.ngComponentOutletNgModuleFactory`](api/common/NgComponentOutlet)          | `NgComponentOutlet.ngComponentOutletNgModule`       | v14                   | 請改用 `ngComponentOutletNgModule` 輸入。這個輸入不需要解析 NgModule factory。 |
| [`DatePipe` - `DATE_PIPE_DEFAULT_TIMEZONE`](api/common/DATE_PIPE_DEFAULT_TIMEZONE) |`{ provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: '-1200' }` | v15                    | 請改用 `DATE_PIPE_DEFAULT_OPTIONS` 注入 token，它可以一次設定多個設定。 |
| `isPlatformWorkerApp` 與 `isPlatformWorkerUi` | 無 | v16 | 自從 webworker 平台移除之後，這兩個函式就沒有用途（它們只會回傳 `false`）。它們可以安全移除。

<a id="core"></a>

### &commat;angular/core

| API                                                                                                        | 替代方案                                                                                                                                                       | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`DefaultIterableDiffer`](api/core/DefaultIterableDiffer)                                                  | n/a                                                                                                                                                               | v4                    | 不屬於公開 API。                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                            |
| [`defineInjectable`](api/core/defineInjectable)                                                            | `ɵɵdefineInjectable`                                                                                                                                              | v8                    | 僅用於產生的程式碼。原始碼不應依賴這個 API。                                                                                                                                                                                             |
| [`entryComponents`](api/core/NgModule)                                                     | 無 | v9                    | 請參閱 [`entryComponents`](#entryComponents)                                                                                                                                                                                                                          |
| `ANALYZE_FOR_ENTRY_COMPONENTS`                                   | 無 | v9                    | 請參閱 [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents)                                                                                                                                                                                                             |
| [`async`](api/core/testing/async)                                                                          | [`waitForAsync`](api/core/testing/waitForAsync)                                                                                                                   | v11                   | `@angular/core/testing` 的 [`async`](api/core/testing/async) 函式已重新命名為 `waitForAsync`，以免與原生 JavaScript `async` 語法混淆。現有的函式已被棄用，未來版本可能會移除。 |
| [`getModuleFactory`](api/core/getModuleFactory)                                                            | [`getNgModuleById`](api/core/getNgModuleById)                                                                                                                     | v13                   | Ivy 允許直接使用 NgModule 類別，不需要取得對應的 factory。                                                                                                                                                                     |
| `ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly`                         | 無（屬於 [issue #40091](https://github.com/angular/angular/issues/40091) 的一部分）                                                                              |                       | 這是為修復 [issue #40091](https://github.com/angular/angular/issues/40091) 而引入的暫時旗標，將會被移除。                                                                                                                      |
| Factory-based signature of [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)                 | 以型別為基礎的 [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap) 簽名                                                                           | v13                   | 使用 Ivy 時，不需要解析 Component factory，可以直接提供 Component Type。                                                                                                                                                               |
| [`PlatformRef.bootstrapModuleFactory`](api/core/PlatformRef#bootstrapModuleFactory)                        | [`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule)                                                                                             | v13                   | 使用 Ivy 時，不需要解析 NgModule factory，可以直接提供 NgModule Type。                                                                                                                                                                 |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories)                                    | 無 | v13                   | Ivy JIT 模式不需要存取這個符號。更多背景資訊，請參閱 [因 ViewEngine 棄用而產生的 JIT API 變更](#jit-api-changes)。                                                                                                                  |
| [`Compiler`](api/core/Compiler)                                                                            | 無 | v13                   | Ivy JIT 模式不需要存取這個符號。更多背景資訊，請參閱 [因 ViewEngine 棄用而產生的 JIT API 變更](#jit-api-changes)。                                                                                                                  |
| [`CompilerFactory`](api/core/CompilerFactory)                                                              | 無 | v13                   | Ivy JIT 模式不需要存取這個符號。更多背景資訊，請參閱 [因 ViewEngine 棄用而產生的 JIT API 變更](#jit-api-changes)。                                                                                                                  |
| [`NgModuleFactory`](api/core/NgModuleFactory)                                                              | 請使用非 factory 式的框架 API，例如 [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) 與 [createNgModule](api/core/createNgModule) | v13                   | Ivy JIT 模式不需要存取這個符號。更多背景資訊，請參閱 [因 ViewEngine 棄用而產生的 JIT API 變更](#jit-api-changes)。                                                                                                                  |
| [`ViewContainerRef.createComponent` 的 factory 式簽名](api/core/ViewContainerRef#createComponent) | [以型別為基礎的 `ViewContainerRef.createComponent` 簽名](api/core/ViewContainerRef#createComponent)                                                           | v13                   | Angular 不再需要 component factory 來動態建立元件。請使用 `createComponent` 方法的不同簽名，它允許直接傳入 Component 類別。                                                                           |
| [`ComponentFactory`](api/core/ComponentFactory)                                                            | 請使用非 factory 式的框架 API。                                                                                                                             | v13                   | 自 Ivy 起，不再需要 Component factory。Angular 提供其他 API，可直接使用 Component 類別。                                                                                                                                         |
| [`ComponentFactoryResolver`](api/core/ComponentFactoryResolver)                                            | 請使用非 factory 式的框架 API。                                                                                                                             | v13                   | 自 Ivy 起，不再需要 Component factory，因此也不需要解析它們。                                                                                                                                                                            |
| [`CompilerOptions.useJit and CompilerOptions.missingTranslation config options`](api/core/CompilerOptions) | 無 | v13                   | 自 Ivy 起，這些設定選項已不再使用，傳入它們沒有任何效果。                                                                                                                                                                                            |
| [`providedIn`](api/core/Injectable#providedIn) with NgModule | 請優先使用 `'root'` provider，或在需要限定於 NgModule 範圍時使用 NgModule `providers` | v15 | 無 |
| [`providedIn: 'any'`](api/core/Injectable#providedIn) | 無 | v15 | 這個選項的語意令人困惑，而且幾乎沒有人使用。 |
| [`EnvironmentInjector.runInContext`](api/core/EnvironmentInjector#runInContext) | `runInInjectionContext`  | v16 | `runInInjectionContext` 是更靈活的操作，也支援 element injector。 |
| [`@Component.moduleId`](api/core/Component#moduleId) | 無 | v16 |


<a id="testing"></a>

### &commat;angular/core/testing

| API                                                                                                      | 替代方案                                         | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`TestBed.get`](api/core/testing/TestBed#get)                                                            | [`TestBed.inject`](api/core/testing/TestBed#inject) | v9                    | 行為相同，但具備型別安全。                 |
| [`async`](api/core/testing/async)                                                                        | [`waitForAsync`](api/core/testing/waitForAsync)     | v10                   | 行為相同，但重新命名以免混淆。 |

<a id="router"></a>

### &commat;angular/router

| API                                        | 替代方案                       | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`RouterLinkWithHref` directive](api/router/RouterLinkWithHref) | 請改用 `RouterLink`。 | v15                   | `RouterLinkWithHref` 指令的程式碼已合併到 `RouterLink` 中。現在 `RouterLink` 指令可用於所有具有 `routerLink` 屬性的元素。 |
| [`provideRoutes` function](api/router/provideRoutes) | 請改用 `ROUTES` `InjectionToken`。 | v15                   | `provideRoutes` 輔助函式的用途極小，而且由於拼寫相近，可能會被誤用為 `provideRouter`。 |
| [`setupTestingRouter` function](api/router/testing/setupTestingRouter) | 請改用 `provideRouter` 或 `RouterModule`。 | v15.1                   | `setupTestingRouter` 函式並非必要。在測試中，`Router` 會根據 DI 設定初始化，就像在正式環境中一樣。 |
| [class and `InjectionToken` guards and resolvers](api/router/DeprecatedGuard) | 請改用一般的 JavaScript 函式。 | v15.2                   | 函式式守衛比類別式與 token 式守衛更簡單、更強大。 |


<a id="platform-browser"></a>

### &commat;angular/platform-browser

| API                                                              | 替代方案                                        | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`BrowserModule.withServerTransition`](api/platform-browser/BrowserModule#withservertransition) | 不需要替代方案。  | v16.0                   | 應改用 `APP_ID` token 來設定應用程式 ID。 |
| `makeStateKey`, `StateKey` and `TransferState` | 改為從 `@angular/core` 匯入。  | v16.0                   | 行為相同，但從不同的套件匯出。 |
<a id="platform-browser-dynamic"></a>

### &commat;angular/platform-browser-dynamic

| API                                                                               | 替代方案 | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory)           | 無 | v13                   | 這個符號已不再需要。更多背景資訊，請參閱 [因 ViewEngine 棄用而產生的 JIT API 變更](#jit-api-changes)。 |
| [`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER) | 無 | v13                   | 過去在某些情況下，要使用 View Engine 測試 AOT 編譯的元件需要這個項目，但自 Ivy 起已不再需要。         |

<a id="platform-server"></a>

### &commat;angular/platform-server

| API                                                              | 替代方案                                        | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`ServerTransferStateModule`](api/platform-server/ServerTransferStateModule) | 不需要替代方案。  | v14.1                   | 在伺服器端渲染期間，當匯入 `ServerModule` 或使用 `renderApplication` 函式進行啟動時，`TransferState` 類別不需要匯入額外的模組即可注入。 |
| [`PlatformConfig.baseUrl` 與 `PlatformConfig.useAbsoluteUrl` 設定選項](api/platform-server/PlatformConfig) | 無 | v16                   | 這個項目先前未被使用。                   |
| [`platformDynamicServer`](api/platform-server/platformDynamicServer) | 匯入 `@angular/compiler`，並改用 `platformServer` 取代原本的用法。 | v16                   | 這麼做是為了縮小 AOT 建置的伺服器套件大小。                   |


<a id="forms"></a>

### &commat;angular/forms

| API                                                                         | 替代方案                                                                  | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`ngModel` with reactive forms](#ngmodel-reactive)                          | [`FormControlDirective`](api/forms/FormControlDirective)                     | v6                    | 無 |
| [`FormBuilder.group` 舊版選項參數](api/forms/FormBuilder#group) | [`AbstractControlOptions` parameter value](api/forms/AbstractControlOptions) | v11                   | 無 |

<a id="service-worker"></a>

### &commat;angular/service-worker

| API                                                           | 替代方案                                                                            | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | [`SwUpdate#activateUpdate()` return value](api/service-worker/SwUpdate#activateUpdate) | v13                   | `SwUpdate#activateUpdate()` 的回傳值表示更新是否已成功啟用。                                                                    |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)                | v13                   | `SwUpdate#available` 的行為可以透過在 [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) 上篩選 `VersionReadyEvent` 事件來重建。 |

<a id="upgrade"></a>

### &commat;angular/upgrade

| API                             | 替代方案                                     | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [All entry points](api/upgrade) | [`@angular/upgrade/static`](api/upgrade/static) | v5                    | 請參閱 [從 AngularJS 升級](guide/upgrade)。 |

<a id="upgrade-static"></a>

### &commat;angular/upgrade/static

| API                                                                                | 替代方案                                                                         | 宣布棄用 | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| [`getAngularLib`](api/upgrade/static/getAngularLib)                                | [`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal)                       | v5                    | 請參閱 [從 AngularJS 升級](guide/upgrade)。                                                          |
| [`setAngularLib`](api/upgrade/static/setAngularLib)                                | [`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal)                       | v5                    | 請參閱 [從 AngularJS 升級](guide/upgrade)。                                                          |
| [`downgradeModule` 的 factory 式簽名](api/upgrade/static/downgradeModule) | [NgModule-based signature of `downgradeModule`](api/upgrade/static/downgradeModule) | v13                   | `downgradeModule` 支援更符合人體工學的 NgModule 式 API（相對於 NgModule factory 式 API）。 |

<a id="deprecated-features"></a>

## 已棄用的功能

本節列出所有已棄用的功能，包括範本語法、設定選項，以及未列在 [已棄用的 API](#已棄用的-api) 一節中的其他棄用項目。其中也包含已棄用的 API 使用情境或 API 組合，作為上述資訊的補充。

<a id="wtf"></a>

### Web Tracing Framework 整合

Angular 過去支援與 [Web Tracing Framework（WTF）](https://google.github.io/tracing-framework) 的整合，用於 Angular 應用程式的效能測試。這項整合已無人維護，現已失效。因此，這項整合在 Angular 第 8 版中被棄用，而且由於沒有任何現有使用跡象，在第 9 版中被移除。

<a id="deep-component-style-selector"></a>

### `/deep/`、`>>>` 與 `::ng-deep` 元件樣式選取器

穿透 shadow DOM 的子代組合器已被棄用，各大瀏覽器與工具正在[移除對它的支援](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing)。因此，Angular 在 v4 中棄用了對 `/deep/`、`>>>` 與 `::ng-deep` 的支援。在移除之前，為了與工具保持更廣泛的相容性，建議優先使用 `::ng-deep`。

更多資訊，請參閱 Component Styles 指南中的 [/deep/、>>> 與 ::ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "Component Styles guide, Deprecated deep and ngdeep")。

<a id="bind-syntax"></a>

### `bind-`、`on-`、`bindon-` 與 `ref-` 前綴

範本前綴 `bind-`、`on-`、`bindon-` 與 `ref-` 已在 v13 中棄用。範本應改用文件記載更廣泛的繫結與參照語法：

*   `[input]="value"`，而非 `bind-input="value"`
*   `[@trigger]="value"`，而非 `bind-animate-trigger="value"`
*   `(click)="onClick()"`，而非 `on-click="onClick()"`
*   `[(ngModel)]="value"`，而非 `bindon-ngModel="value"`
*   `#templateRef`，而非 `ref-templateRef`

<a id="template-tag"></a>

### `<template>` 標籤

`<template>` 標籤在 v4 中被棄用，以避免與同名的 DOM 元素衝突（例如使用 web components 時）。請改用 `<ng-template>`。更多資訊，請參閱 [Ahead-of-Time Compilation](guide/aot-compiler) 指南。

<a id="ngmodel-reactive"></a>

### 搭配 reactive forms 的 `ngModel`

將 `ngModel` 輸入屬性與 `ngModelChange` 事件搭配 reactive form 指令使用的支援，已在 Angular v6 中棄用，未來版本的 Angular 可能會移除。

現已棄用的寫法：

<code-example path="deprecation-guide/src/app/app.component.html" region="deprecated-example"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="deprecated-example"></code-example>

這項支援被棄用有幾個原因。首先，開發人員覺得這種模式令人困惑。看起來像是實際使用了 `ngModel` 指令，但實際上它是 reactive form 指令上名為 `ngModel` 的輸入／輸出屬性，只近似該指令的部分行為，而非全部。它允許取得與設定值，以及攔截值事件，但 `ngModel` 的某些功能（例如使用 `ngModelOptions` 延遲更新，或匯出指令）無法運作。

此外，這種模式混合了範本驅動與 reactive forms 兩種策略，無法充分發揮任一策略的完整優點。在範本中設定值違反了 reactive forms 背後的範本無關原則，而在類別中加入 `FormControl`／`FormGroup` 層，則失去了在範本中定義表單的便利性。

在支援被移除之前更新你的程式碼時，請決定要繼續使用 reactive form 指令（並以 reactive forms 模式取得／設定值），還是改用範本驅動指令。

**修改後** （選項 1 - 使用 reactive forms）：

<code-example path="deprecation-guide/src/app/app.component.html" region="reactive-form-example"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="reactive-form-example"></code-example>

**修改後** （選項 2 - 使用範本驅動 forms）：

<code-example path="deprecation-guide/src/app/app.component.html" region="template-driven-form-example"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="template-driven-form-example"></code-example>

預設情況下，使用這種模式時，你會在開發模式中收到一次棄用警告。你可以在匯入時設定 `ReactiveFormsModule`，選擇關閉這個警告：

<code-example path="deprecation-guide/src/app/app.module.ts" region="reactive-form-no-warning"></code-example>

或者，你也可以選擇為這種模式的每個實例顯示個別警告，設定值為 `"always"`。這可能有助於在更新程式碼時，追蹤程式碼中使用這種模式的位置。


<a id="router-class-and-injection-token-guards"></a>

### Router 類別與 InjectionToken 守衛及解析器

類別式與 injection token 守衛及解析器已被棄用。`Route` 物件應改用函式式守衛與解析器。類別式守衛可以改用 `inject` 取得相依性，轉換為函式。

測試函式式 `canActivate` 守衛時，建議使用 `TestBed` 與 `TestBed.runInInjectionContext`。測試用的 mock 與 stub 可以透過 DI 提供，例如 `{provide: X, useValue: StubX}`。函式式守衛也可以寫成能以 `runInInjectionContext` 測試，或傳入相依性的 mock 實作。例如：

```
export function myGuardWithMockableDeps(
  dep1 = inject(MyService),
  dep2 = inject(MyService2),
  dep3 = inject(MyService3),
) { }

const route = {
  path: 'admin',
  canActivate: [myGuardWithMockableDeps]
}
```

這項棄用只影響 `Route` 定義中對類別式與 `InjectionToken` 守衛的支援。`Injectable` 類別與 `InjectionToken` provider 在一般意義上並*未*被棄用。話雖如此，`CanActivate`、`CanDeactivate` 等介面將在未來的 Angular 版本中刪除。只要從 injectable 類別中移除 `implements CanActivate`，並將路由定義更新為 `canActivate: [() => inject(MyGuard).canActivate()]` 這樣的函式，就足以消除棄用警告。

函式式守衛足夠強大，甚至可以透過轉換來支援現有的類別式守衛：

```
import {CanMatchFn} from '@angular/router';

function mapToCanMatch(providers: Array<Type<{canMatch: CanMatchFn}>>): CanMatchFn[] {
  return providers.map(provider => (...params) => inject(provider).canMatch(...params));
}
const route = {
  path: 'admin',
  canMatch: mapToCanMatch([AdminGuard]),
};
```

也就是說，守衛可以繼續以類別實作，然後在路由定義處轉換為函式。

<a id="router-writable-properties"></a>

### 公開的 `Router` 屬性

`Router` 的公開屬性都不應被寫入。它們都應使用其他已記載的方法來設定。

下列策略應透過在根 `NgModule` 或 `bootstrapApplication` 的 `providers` 中，於 DI 註冊應用程式策略來設定：
* `routeReuseStrategy`
* `titleStrategy`
* `urlHandlingStrategy`

下列選項應使用 `RouterModule.forRoot` 或 `provideRouter` 與 `withRouterConfig` 中提供的選項來設定。
* `onSameUrlNavigation`
* `paramsInheritanceStrategy`
* `urlUpdateStrategy`
* `canceledNavigationResolution`
* `errorHandler`

下列選項已完全棄用：
* `malformedUriErrorHandler` - URI 解析錯誤應改在 `UrlSerializer` 中處理。
* `errorHandler` - 請改為訂閱 `Router` 事件並篩選 `NavigationError`。

<a id="router-can-load"></a>

### `CanLoad` 守衛

Router 中的 `CanLoad` 守衛已被棄用，改為使用 `CanMatch`。這些守衛在導覽生命週期的同一時間執行。回傳 false 的 `CanMatch` 守衛會完全阻止 `Route` 被比對，也會阻止載入該 `Route` 的子項。`CanMatch` 守衛可以達成與 `CanLoad` 相同的目標，此外當它們拒絕時，還允許導覽去比對其他路由（例如萬用字元路由）。API 介面中不需要同時存在兩種守衛。

<a id="reflect-metadata"></a>

### 在 JIT 模式中對 reflect-metadata polyfill 的依賴

Angular 應用程式，特別是依賴 JIT 編譯器的應用程式，過去需要一個 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) API 的 polyfill。

在 Angular 8.0 版中已移除對這個 polyfill 的需求（[參閱 #14473](https://github.com/angular/angular-cli/pull/14473)），使得大多數 Angular 應用程式中的 polyfill 變得不必要。由於第三方程式庫可能依賴這個 polyfill，我們不是從所有 Angular 專案中移除它，而是在 8.0 版中棄用對這個 polyfill 的需求。這應該能給程式庫作者與應用程式開發人員足夠的時間，評估是否需要這個 polyfill，並執行必要的重構來移除對它的依賴。

在典型的 Angular 專案中，polyfill 不會用於正式環境建置，因此移除它不應影響正式環境應用程式。這次移除的目標是整體簡化建置設定，並減少外部相依性的數量。

<a id="static-query-resolution"></a>

### `@ViewChild()`／`@ContentChild()` 靜態解析作為預設值

請參閱[靜態查詢專用遷移指南](guide/static-query-migration)。

<a id="contentchild-input-together"></a>

### `@ContentChild()` 與 `@Input()` 一起使用

下列模式已被棄用：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="template-with-input-deprecated"></code-example>

請不要使用這種模式，而是將兩個裝飾器分開放在各自的屬性中，並加入遞補邏輯，如下列範例所示：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="template-with-input"></code-example>

<a id="cant-assign-template-vars"></a>

### 無法指派給範本變數

在下列範例中，雙向繫結表示當 `valueChange` 事件觸發時，應該寫入 `optionName`。

<code-example path="deprecation-guide/src/app/app.component.1.html" region="two-way-template-deprecated"></code-example>

然而，實際上 Angular 會忽略對範本變數的雙向繫結。從第 8 版開始，嘗試寫入範本變數已被棄用。在未來版本中，我們會拋出錯誤，表示不支援這種寫入。

<code-example path="deprecation-guide/src/app/app.component.html" region="valid-template-bind"></code-example>

<a id="binding-to-innertext"></a>

### 在 `platform-server` 中繫結 `innerText`

[Domino](https://github.com/fgnass/domino) 用於伺服器端渲染，它不支援 `innerText`，因此在 platform-server 的 *domino adapter* 中，有特殊程式碼會在你嘗試繫結 `innerText` 時遞補為 `textContent`。

這兩個屬性有細微的差異，因此在底層切換為 `textContent` 可能會讓使用者感到意外。基於這個原因，我們正在棄用這種行為。往後，使用 Domino 時，使用者應明確繫結到 `textContent`。

<a id="wtf-apis"></a>

### `wtfStartTimeRange` 與所有 `wtf*` API

所有 `wtf*` API 都已被棄用，將在未來版本中移除。

<a id="entryComponents"></a>

### 不再需要 `entryComponents` 與 `ANALYZE_FOR_ENTRY_COMPONENTS`

過去，`NgModule` 定義中的 `entryComponents` 陣列用於告訴編譯器哪些元件會被動態建立與插入。使用 Ivy 後，這不再是必要條件，`entryComponents` 陣列可以從現有的模組宣告中移除。`ANALYZE_FOR_ENTRY_COMPONENTS` 注入 token 也同樣適用。

<div class="alert is-helpful">

**注意**：<br />
如果你要建置的程式庫會被 View Engine 應用程式使用，你可能仍需要保留這些內容。

</div>

<a id="moduleWithProviders"></a>

### 沒有泛型的 `ModuleWithProviders` 型別

某些 Angular 程式庫（例如 `@angular/router` 與 `@ngrx/store`）實作的 API 會回傳一種稱為 `ModuleWithProviders` 的型別（通常使用名為 `forRoot()` 的方法）。這種型別代表一個 `NgModule` 以及額外的 provider。Angular 第 9 版棄用了未明確指定泛型型別的 `ModuleWithProviders` 用法，其中泛型型別指的是 `NgModule` 的型別。在未來的 Angular 版本中，泛型將不再是選填的。

如果你使用 CLI，`ng update` 應該會[自動遷移你的程式碼](guide/migration-module-with-providers)。如果你不使用 CLI，可以手動為應用程式加入缺少的泛型型別。例如：

**修改前**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="ModuleWithProvidersNonGeneric"></code-example>

**修改後**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="ModuleWithProvidersGeneric"></code-example>

<!--

### Internet Explorer 11

Angular support for Microsoft's Internet Explorer 11 \(IE11\) is deprecated and will be removed in Angular v13.
Ending IE11 support allows Angular to take advantage of web platform APIs present only in evergreen browsers, resulting in better APIs for developers and more capabilities for application users.
An additional motivation behind this removal is the drop in global usage of IE11 to just ~1% \(as of March 2021\).
For full rationale and discussion behind this deprecation, see [RFC: Internet Explorer 11 support deprecation and removal](https://github.com/angular/angular/issues/41840).

<div class="alert is-helpful">

**NOTE**: <br />
IE11 will be supported in Angular v12 LTS releases through November 2022.

</div>

-->

<a id="input-setter-coercion"></a>

### 輸入 setter 強制轉換

自從 Angular 引入 `strictTemplates` 旗標以來，編譯器已能根據對應指令宣告的輸入型別，對輸入繫結進行型別檢查。當輸入使用 getter／setter 配對時，setter 可能需要接受比 getter 回傳值更多的型別，例如 setter 會先轉換輸入值。然而，在 TypeScript 4.3 之前，getter／setter 配對必須具有相同的型別，因此這種模式無法被準確宣告。

為了緩解這項限制，指令中可以宣告 [input setter coercion 欄位](guide/template-typecheck#輸入-setter-強制轉型)，在對輸入繫結進行型別檢查時使用。然而，自 [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties) 起，這項限制已被移除；setter 現在可以接受比 getter 回傳值更寬的型別。這表示不再需要輸入強制轉換欄位，因為加寬 setter 的型別即可達到相同的效果。

例如，下列指令：

<code-example path="deprecation-guide/src/app/submit-button/submit-button.component.ts" language="typescript" region="submitButtonNarrow"></code-example>

可以重構如下：

<code-example path="deprecation-guide/src/app/submit-button/submit-button.component.ts" language="typescript" region="submitButton"></code-example>

<a id="full-template-type-check"></a>

### `fullTemplateTypeCheck`

使用 AOT 編譯器編譯應用程式時，你的範本會依照一定的嚴格程度進行型別檢查。在 Angular 9 之前，範本型別檢查只有兩種嚴格程度，由 [`fullTemplateTypeCheck` 編譯器選項](guide/angular-compiler-options)決定。在第 9 版中，引入了 `strictTemplates` 系列編譯器選項，以更細緻的方式設定範本型別檢查的嚴格程度。

`fullTemplateTypeCheck` 旗標正被棄用，改為使用新的 `strictTemplates` 選項及其相關編譯器選項。目前設定了 `fullTemplateTypeCheck: true` 的專案，可以遷移到下列編譯器選項組合，以達到相同程度的型別檢查：

<code-example language="json" header="tsconfig.app.json">

{
  "angularCompilerOptions": {
    &hellip;
    "strictTemplates": true,
    "strictInputTypes": false,
    "strictNullInputTypes": false,
    "strictAttributeTypes": false,
    "strictOutputEventTypes": false,
    "strictDomEventTypes": false,
    "strictDomLocalRefTypes": false,
    "strictSafeNavigationTypes": false,
    "strictContextGenerics": false,
    &hellip;
  }
}

</code-example>

<a id="jit-api-changes"></a>

## 因 ViewEngine 棄用而產生的 JIT API 變更

在 ViewEngine 中，[JIT 編譯](/guide/glossary#jit)需要將特殊 provider（例如 `Compiler` 或 `CompilerFactory`）注入應用程式，並呼叫對應的方法。使用 Ivy 時，如果 Component、NgModule 等尚未經過 [AOT 編譯](/guide/glossary#aot)，JIT 編譯會隱含地進行。這些特殊 provider 在 Ivy 中是為了與 ViewEngine 向下相容而提供，讓過渡到 Ivy 的過程更順暢。由於 ViewEngine 已被棄用且即將移除，這些符號現在也被棄用了。

<div class="alert is-important">

**重要**：<br />
這項棄用不會影響 Ivy 中的 JIT 模式（JIT 在 Ivy 中仍然可用，不過我們正在探討未來棄用它的可能性。請參閱 [RFC：探索 Angular JIT 編譯模式的使用情境](https://github.com/angular/angular/issues/43133)）。

</div>

<a id="testrequest-errorevent"></a>

### 接受 `ErrorEvent` 的 `TestRequest`

Angular 提供用於測試 `HttpClient` 的工具。`@angular/common/http/testing` 的 `TestRequest` 類別會模擬 HTTP 請求物件，供 `HttpTestingController` 使用。

`TestRequest` 提供 API，可模擬帶有錯誤的 HTTP 回應。在舊版 Angular 中，這個 API 接受 `ErrorEvent` 型別的物件，但這與瀏覽器原生回傳的錯誤事件型別不符。如果你將 `ErrorEvent` 與 `TestRequest` 搭配使用，應改用 `ProgressEvent`。

以下是使用 `ProgressEvent` 的範例：

<code-example format="typescript" language="typescript">

const mockError = new ProgressEvent('error');
const mockRequest = httpTestingController.expectOne(..);

mockRequest.error(mockError);

</code-example>

<a id="deprecated-cli-flags"></a>

## 已棄用的 CLI API 與選項

本節完整列出目前已棄用的所有 CLI 旗標。

### &commat;angular-devkit/build-angular

| API／選項                 | 可能移除於 | 詳細資訊 |
|:---                              |:---           |:---            |
| `deployUrl`                | <!--v13--> v15    | 請改用 `baseHref` 選項、`APP_BASE_HREF` DI token，或兩者搭配使用。更多資訊，請參閱[部署網址](guide/deployment#deploy-網址)。 |
| Protractor builder         | <!--v12--> v14    | 作為 Protractor 棄用的一部分而棄用。                                                                                                               |

<a id="removed"></a>

## 已移除的 API

下列 API 已從 11.0.0 版開始移除&ast;：

| 套件           | API                   | 替代方案                                                                | 詳細資訊 |
|:---                  |:---                         |:---                                                                         |:---                  |
| `@angular/router` | `preserveQueryParams` | [`queryParamsHandling`](api/router/UrlCreationOptions#queryParamsHandling) |         |

&ast; 若要查看在第 10 版移除的 API，請參閱[第 10 版文件網站](https://v10.angular.tw/guide/deprecations#removed)上的本指南。

<a id="style-sanitization"></a>

### `[style]` 與 `[style.prop]` 繫結的樣式清理

Angular 過去會清理 `[style]` 與 `[style.prop]` 繫結，以防止惡意程式碼透過 CSS `url()` 項目中的 `javascript:` 運算式插入。然而，大多數現代瀏覽器已不再支援這類運算式的用法，因此清理只是為了 IE 6 與 7 而維持。鑑於 Angular 不支援 IE 6 或 7，而且清理有效能成本，從 Angular 第 10 版起，我們將不再清理樣式繫結。

### `@angular/router` 中的 `loadChildren` 字串語法

已無法使用 `loadChildren` 字串語法來設定延遲路由。字串語法已被動態 import 陳述式取代。`DeprecatedLoadChildren` 型別已從 `@angular/router` 移除。關於替代方案的更多資訊，請參閱 [`LoadChildrenCallback` 文件](api/router/LoadChildrenCallback)。

支援類別 `NgModuleFactoryLoader`、`SystemJsNgModuleLoader` 與 `SystemJsNgModuleLoaderConfig` 已從 `@angular/core` 移除，`@angular/router` 的 `SpyNgModuleFactoryLoader` 亦然。

### `WrappedValue`

`WrappedValue` 的用途是讓同一個物件實例在變更偵測時被視為不同。它通常與 `async` 管道搭配使用，用於 `Observable` 產生相同實例值的情況。

鑑於這個使用情境相對罕見，而且特殊處理會影響應用程式效能，`WrappedValue` API 已在 Angular 13 中移除。

如果你依賴「同一個物件實例應觸發變更偵測」的行為，你有兩個選項：

*   複製產生的值，讓它具有新的身分
*   明確呼叫 [`ChangeDetectorRef.detectChanges()`](api/core/ChangeDetectorRef#detectchanges) 來強制更新

<!-- links -->

[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#在建置設定中定義地區設定 "Define locales in the build configuration - Common Internationalization task #6: Merge translations into the application | Angular"

<!-- end links -->

@reviewed 2023-05-03
