# 更新 Angular

本指南包含更新到 Angular 版本 13 的資訊。

## 更新 Angular CLI 應用程式

關於如何更新到最新 Angular 版本並利用 Angular 自動移轉工具的逐步說明，請使用 [update.angular.io][AngularUpdateMain] 上的互動式更新指南。

## 版本 13 的變更與棄用

<div class="alert is-helpful">

關於 Angular 的棄用與移除作法，請參閱 [Angular Release Practices][AioGuideReleasesDeprecationPractices]。

</div>

*   **移除 View Engine**

    要求所有應用程式與程式庫都使用 Ivy 建置。
    請參閱 [Upcoming improvements to Angular library distribution][AngularBlog76c02f782aa4] 部落格。

*   **Angular 套件格式 \(APF\) 現代化**

    移除了較舊的輸出格式，包括 View Engine 專屬的中繼資料。

*   **移除 IE11 支援**

    移除對 Microsoft Internet Explorer 11 \(IE11\) 的所有支援。
    請參閱 [Issue&nbsp;#41840][GithubAngularAngularIssues41840]。

*   **TestBed 模組拆卸**

    在 `initTestEnvironment` 中加入選項，可以從應用程式中完全移除測試環境。
    請參閱 [Improving Angular tests by enabling Angular testing module teardown][DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh] 文章。

*   **`$localize` 標記訊息字串**

    加入 Angular `$localize` API 與標記訊息字串的文件。

*   **磁碟快取**

    預設為所有應用程式啟用持久性建置快取。
    請參閱 [Issue&nbsp;#21545][GithubAngularAngularCliIssues21545]。

### Angular 版本 13 的破壞性變更

<a id="breaking-changes"></a>

|                                                     | 詳細資訊                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|:---                                                 |:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [**PR&nbsp;#43642**][GithubAngularAngularPull43642] | 不再支援比 `4.4.2` 舊的 TypeScript 版本。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [**PR&nbsp;#43740**][GithubAngularAngularPull43740] | 不再支援比 `v12.20.0` 舊的 NodeJS 版本。Angular 套件現在使用帶有子路徑模式的 NodeJS 套件 exports 功能，需要高於 `14.15.0` 或 `16.10.0` 的 NodeJS 版本。                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [PR&nbsp;#31187][GithubAngularAngularPull31187]     | 先前，預設的 url serializer 會丟棄查詢參數中問號及其之後的所有內容。也就是說，導覽到 `/path?q=hello?&other=123` 時，查詢參數只會解析為 `{q: 'hello'}`。這是不正確的，因為 URI 規格允許查詢資料中出現問號字元。此變更現在會把 `/path?q=hello?&other=123` 的查詢參數正確解析為 `{q: 'hello?', other: '123'}`。                                                                                                                                                                                                                                         |
| [PR&nbsp;#41730][GithubAngularAngularPull41730]     | `RouterTestingModule` 所使用的 `SpyLocation` 行為已變更，以符合瀏覽器的行為。呼叫 `Location.go` 時，它不再發出 `popstate` 事件。此外，`simulateHashChange` 現在會同時觸發 `hashchange` 事件與 `popstate` 事件。使用 `location.go` 並期望 `Router` 能接收變更的測試，應該移轉到 `simulateHashChange`。每個測試想要斷言的內容都不同，因此沒有單一變更適用於所有測試。每個使用 `SpyLocation` 模擬瀏覽器 URL 變更的測試，都應該逐案評估。                             |
| [PR&nbsp;#42952][GithubAngularAngularPull42952]     | 引入了一個名為 `FormControlStatus` 的新類型，它是表單控制項所有可能狀態字串的聯集。`AbstractControl.status` 已從 `string` 縮小為 `FormControlStatus`，`statusChanges` 已從 `Observable<any>` 縮小為 `Observable<FormControlStatus>`。大多數應用程式應該可以無痛地使用這些新類型。此變更造成的任何破壞，很可能源於以下兩個問題之一： <ol><li>應用程式把 <code>AbstractControl.status</code> 與一個不是有效狀態的字串比較。</li><li>應用程式把 `statusChanges` 事件當作字串以外的東西使用。</li></ol> |
| [PR&nbsp;#43087][GithubAngularAngularPull43087]     | 先前，`routerLink` 的 `null` 與 `undefined` 輸入等同於空字串，而且無法停用連結的導覽。此外，`href` 從屬性 `HostBinding()` 改為屬性繫結 \(`HostBinding('attr.href')`\)。此變更的影響是，`DebugElement.properties['href']` 現在回傳原生元素回傳的 `href` 值，也就是完整的 URL，而不是 `RouterLink` 的 `href` 屬性內部值。                                                                                                                                                                              |
| [PR&nbsp;#43496][GithubAngularAngularPull43496]     | 當新的導覽取消進行中的導覽時，路由器不再取代瀏覽器 URL。取代瀏覽器 URL 常造成 URL 閃爍，而且當初加入只是為了支援某些 AngularJS 混合應用程式。依賴 Angular 路由器處理的每個初始導覽上都有 `navigationId` 的混合應用程式，應該改為訂閱 `NavigationCancel` 事件，並手動執行 `location.replaceState`，把 `navigationId` 加入 Router 狀態。<br />此外，對 `SpyLocation` 斷言 `urlChanges` 的測試，應該調整以因應缺少 `replaceState` 觸發的情況。                          |
| [PR&nbsp;#43507][GithubAngularAngularPull43507]     | `WrappedValue` 類別不再從 `@angular/core` 匯入。如果使用了依賴 `WrappedValue` 的過時程式庫，此變更可能導致編譯錯誤或執行階段失敗。應該移除對 `WrappedValue` 的依賴，因為沒有替代方案。                                                                                                                                                                                                                                                                                                                                                                                                      |
| [PR&nbsp;#43591][GithubAngularAngularPull43591]     | 不再可以使用字串值來使用 `Route.loadChildren`。以下支援類別已從 `@angular/core` 移除： <ul><li><code>NgModuleFactoryLoader</code></li><li><code>SystemJsNgModuleFactoryLoader</code></li></ul> `@angular/router` 套件不再匯出以下符號： <ul><li><code>SpyNgModuleFactoryLoader</code></li><li><code>DeprecatedLoadChildren</code></li></ul> 來自 `@angular/core/testing` 的 `setupTestingRouter` 函式簽章已變更，移除了 `NgModuleFactoryLoader` 參數，因為無法建立該參數的值。                                                        |
| [PR&nbsp;#43668][GithubAngularAngularPull43668]     | `SwUpdate#activateUpdate` 與 `SwUpdate#checkForUpdate` 的回傳類型改為 `Promise<boolean>`。<br />雖然不太可能，但此變更在某些情況下可能導致 TypeScript 類型檢查失敗。如有必要，請更新你的類型以因應新的回傳類型。                                                                                                                                                                                                                                                                                                                                                                                                              |
| [PR&nbsp;#43791][GithubAngularAngularPull43791]     | 儲存與擷取 `DetachedRouteHandle` 時，Router 會遍歷 `Route` 子項，以便在有多個可儲存的子 `Route` 設定時，正確地允許儲存父路由。這讓 `RouteReuseStrategy` 可以儲存父 `Route` *和* 子項，同時在還原父項時保留變更子路由的能力。某些 `RouteReuseStrategy` 的實作需要更新，才能正確儲存與擷取後代的 `DetachedRouteHandle` 以及已儲存的父 `ActivatedRouteSnapshot`。 <br /> 先前，`Router` 只會儲存父項，使得擷取已儲存的父項時，無法變更後代路徑。請參閱 [**Issue&nbsp;#20114**][GithubAngularAngularIssues20114] |
| [Issue&nbsp;#22159][GithubAngularAngularCliIssues22159]     | 透過動態 `import()` 載入的指令碼現在被視為 ES 模組 \(也就是說，它們必須與嚴格模式相容\)。 |

### 新的棄用項目

<a id="deprecations"></a>

| 已移除                                                                                                             | 取代方案                                                                                             | 詳細資訊                                                                                                                                                                         |
|:---                                                                                                                 |:---                                                                                                     |:---                                                                                                                                                                             |
| [`getModuleFactory`][AioApiCoreGetmodulefactory]                                                                    | [`getNgModuleById`][AioApiCoreGetngmodulebyid]                                                          |                                                                                                                                                                                 |
| [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] 的工廠式簽章                          | [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] 的型別式簽章                 | 使用型別式簽章，取代工廠式簽章。                                                                                                           |
| [`PlatformRef.bootstrapModuleFactory`][AioApiCorePlatformrefBootstrapmodulefactory]                                 | [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule]                                   |                                                                                                                                                                                 |
| [`ModuleWithComponentFactories`][AioApiCoreModulewithcomponentfactories]                                            | 無                                                                                                    |                                                                                                                                                                                 |
| [`Compiler`][AioApiCoreCompiler]                                                                                    | 無                                                                                                    |                                                                                                                                                                                 |
| [`CompilerFactory`][AioApiCoreCompilerfactory]                                                                      | 無                                                                                                    |                                                                                                                                                                                 |
| [`NgModuleFactory`][AioApiCoreNgmodulefactory]                                                                      | 非工廠式的框架 API                                                                        | 使用非工廠式的框架 API，例如 [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule] 與 [`createNgModuleRef`][AioApiCoreCreatengmoduleref]。 |
| [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] 的工廠式簽章          | [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] 的型別式簽章 | 使用型別式簽章，取代工廠式簽章。                                                                                                           |
| [`TestBed.initTestEnvironment` 方法][AioApiCoreTestingTestbedInittestenvironment] 的 `aotSummaries` 參數 | 無                                                                                                    |                                                                                                                                                                                 |
| [`TestModuleMetadata` 類型][AioApiCoreTestingTestmodulemetadata] 的 `aotSummaries` 參數                    | 無                                                                                                    |                                                                                                                                                                                 |
| [`renderModuleFactory`][AioApiPlatformServerRendermodulefactory]                                                    | [`renderModule`][AioApiPlatformServerRendermodule]                                                      |                                                                                                                                                                                 |
| [`SwUpdate#activated`][AioApiServiceWorkerSwupdateActivated]                                                        | [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate]                                | 使用 [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate] 的回傳值。                                                                               |
| [`SwUpdate#available`][AioApiServiceWorkerSwupdateAvailable]                                                        | [`SwUpdate#versionUpdates`][AioApiServiceWorkerSwupdateVersionupdates]                                  |                                                                                                                                                                                 |
| `bind-input="value"`                                                                                                | `[input]="value"`                                                                                       |                                                                                                                                                                                 |
| `bind-animate-trigger="value"`                                                                                      | `[@trigger]="value"`                                                                                    |                                                                                                                                                                                 |
| `on-click="onClick()"`                                                                                              | `(click)="onClick()"`                                                                                   |                                                                                                                                                                                 |
| `bindon-ngModel="value"`                                                                                            | `[(ngModel)]="value"`                                                                                   |                                                                                                                                                                                 |
| `ref-templateRef`                                                                                                   | `#templateRef`                                                                                          |                                                                                                                                                                                 |

<!-- links -->

[AioApiCoreApplicationrefBootstrap]: api/core/ApplicationRef#bootstrap "bootstrap - ApplicationRef | Core - API | Angular"
[AioApiCoreCompiler]: api/core/Compiler "Compiler | Core - API | Angular"
[AioApiCoreCompilerfactory]: api/core/CompilerFactory "CompilerFactory | Core - API | Angular"
[AioApiCoreCreatengmoduleref]: api/core/createNgModuleRef "createNgModuleRef | Core - API | Angular"
[AioApiCoreGetmodulefactory]: api/core/getModuleFactory "getModuleFactory | Core - API | Angular"
[AioApiCoreGetngmodulebyid]: api/core/getNgModuleById "getNgModuleById | Core - API | Angular"
[AioApiCoreModulewithcomponentfactories]: api/core/ModuleWithComponentFactories "ModuleWithComponentFactories | Core - API | Angular"
[AioApiCoreNgmodulefactory]: api/core/NgModuleFactory "NgModuleFactory | Core - API | Angular"
[AioApiCorePlatformrefBootstrapmodulefactory]: api/core/PlatformRef#bootstrapModuleFactory "bootstrapModuleFactory - PlatformRef | Core - API | Angular"
[AioApiCorePlatformrefBootstrapmodule]: api/core/PlatformRef#bootstrapModule "bootstrapModule - PlatformRef | Core - API | Angular"
[AioApiCoreTestingTestbedInittestenvironment]: api/core/testing/TestBed#inittestenvironment "inittestenvironment - TestBed | Testing - Core - API | Angular"
[AioApiCoreTestingTestmodulemetadata]: api/core/testing/TestModuleMetadata "TestModuleMetadata | Testing - Core - API | Angular"
[AioApiCoreViewcontainerrefCreatecomponent]: api/core/ViewContainerRef#createComponent "createComponent - ViewContainerRef | Core - API | Angular"

[AioApiPlatformServerRendermodulefactory]: api/platform-server/renderModuleFactory "renderModuleFactory | Platform server - API | Angular"
[AioApiPlatformServerRendermodule]: api/platform-server/renderModule "renderModule | Platform server - API | Angular"

[AioApiServiceWorkerSwupdateActivated]: api/service-worker/SwUpdate#activated "activated - SwUpdate | Service worker - API | Angular"
[AioApiServiceWorkerSwupdateActivateupdate]: api/service-worker/SwUpdate#activateUpdate "activateUpdate - SwUpdate | Service worker - API | Angular"
[AioApiServiceWorkerSwupdateAvailable]: api/service-worker/SwUpdate#available "available - SwUpdate | Service worker - API | Angular"
[AioApiServiceWorkerSwupdateVersionupdates]: api/service-worker/SwUpdate#versionUpdates "versionUpdates - SwUpdate | Service worker - API | Angular"

[AioGuideReleasesDeprecationPractices]: guide/releases#淘汰實務 "Deprecation practices - Angular versioning and releases | Angular"

<!-- external links -->

[AngularBlog76c02f782aa4]: https://blog.angular.io/76c02f782aa4 "Upcoming improvements to Angular library distribution | Angular Blog"

[AngularUpdateMain]: https://update.angular.io " Angular Update Guide"

[DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh]: https://dev.to/this-is-angular/improving-angular-tests-by-enabling-angular-testing-module-teardown-38kh "Improving Angular tests by enabling Angular testing module teardown | This is Angular | DEV Community"

[GithubAngularAngularIssues41840]: https://github.com/angular/angular/issues/41840 "RFC: Internet Explorer 11 support deprecation and removal #41840 | angular/angular | GitHub"

[GithubAngularAngularPull31187]: https://github.com/angular/angular/pull/31187 "fix(router): Allow question marks in query param values #31187 | angular/angular | GitHub"
[GithubAngularAngularPull41730]: https://github.com/angular/angular/pull/41730 "fix(common): synchronise location mock behavior with the navigators #41730 | angular/angular | GitHub"
[GithubAngularAngularPull42952]: https://github.com/angular/angular/pull/42952 "feat(forms): Give form statuses a more specific type #42952 | angular/angular | GitHub"
[GithubAngularAngularPull43087]: https://github.com/angular/angular/pull/43087 "fix(router): null/undefined routerLink should disable navigation #43087 | angular/angular | GitHub"
[GithubAngularAngularPull43496]: https://github.com/angular/angular/pull/43496 "fix(router): Prevent URL flicker when new navigations cancel ongoing &hellip; #43496 | angular/angular | GitHub"
[GithubAngularAngularPull43507]: https://github.com/angular/angular/pull/43507 "perf(core): remove support for the deprecated WrappedValue #43507 | angular/angular | GitHub"
[GithubAngularAngularPull43591]: https://github.com/angular/angular/pull/43591 "refactor(router): remove support for loadChildren string syntax #43591 | angular/angular | GitHub"
[GithubAngularAngularPull43642]: https://github.com/angular/angular/pull/43642 "feat(core): drop support for TypeScript 4.2 and 4.3 #43642 | angular/angular | GitHub"
[GithubAngularAngularPull43668]: https://github.com/angular/angular/pull/43668 "feat(service-worker): improve ergonomics of the SwUpdate APIs #43668 | angular/angular | GitHub"
[GithubAngularAngularPull43740]: https://github.com/angular/angular/pull/43740 "feat(bazel): expose esm2020 and es2020 conditions in APF package exports #43740 | angular/angular | GitHub"
[GithubAngularAngularPull43791]: https://github.com/angular/angular/pull/43791 "fix(router): reuse route strategy fix #43791 | angular/angular | GitHub"

[GithubAngularAngularCliIssues21545]: https://github.com/angular/angular-cli/issues/21545 "[RFC] Persistent build cache by default #21545 | angular/angular-cli | GitHub"
[GithubAngularAngularCliIssues22159]: https://github.com/angular/angular-cli/issues/22159 "Script imports are modules by default #22159 | angular/angular-cli | GitHub"
[GithubAngularAngularIssues20114]: https://github.com/angular/angular/issues/20114 "RouteReuseStrategy impossible to store/retrieve siblings AND ALSO a non-sibling #20114 | angular/angular | GitHub"

<!-- end links -->

@reviewed 2022-02-28
