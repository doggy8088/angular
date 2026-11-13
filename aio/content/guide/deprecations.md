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
-->

| 領域 | API 或功能 | 可能移除於 |
| ---- | -------------- | ----------------- |
| `@angular/common` | [Pipes using Intl API](#i18n-pipes) | <!--v8--> v9 |
| `@angular/common` | [`ReflectiveInjector`](#reflectiveinjector) | <!--v8--> v9 |
| `@angular/core` | [`CollectionChangeRecord`](#core) | <!--v7--> v9 |
| `@angular/core` | [`DefaultIterableDiffer`](#core) | <!--v7--> v9 |
| `@angular/core` | [`ReflectiveKey`](#core) | <!--v8--> v9 |
| `@angular/core` | [`RenderComponentType`](#core) | <!--v7--> v9 |
| `@angular/core` | [`Renderer`](#core) | <!--v7--> v9 |
| `@angular/core` | [`RootRenderer`](#core) | <!--v7--> v9 |
| `@angular/core` | [`ViewEncapsulation.Native`](#core) | v9 |
| `@angular/forms` | [`ngForm` element selector](#ngform) | v9 |
| `@angular/forms` | [`NgFormSelectorWarning`](#forms) | v9 |
| `@angular/forms` | [`ngModel` with reactive forms](#ngmodel-reactive) | v9 |
| `@angular/router` | [`preserveQueryParams`](#router) | <!--v7--> v9 |
| `@angular/upgrade` | [`@angular/upgrade`](#upgrade) | <!--v8--> v9 |
| `@angular/upgrade` | [`getAngularLib`](#upgrade-static) | <!--v8--> v9 |
| `@angular/upgrade` | [`setAngularLib`](#upgrade-static) | <!--v8--> v9 |
| 範本語法 | [`/deep/`, `>>>`, and `::ng-deep`](#deep-component-style-selector) | <!--v7--> unspecified |
| 範本語法 | [`<template`>](#template-tag) | <!--v7--> v9 |
| service worker | [`versionedFiles` setting](#sw-versionedfiles)| v9 |
| polyfills | [reflect-metadata](#reflect-metadata) | <!--v8--> v9 |
| `@angular/core` | [`defineInjectable`](#core) | v11 |
| `@angular/router` | [`loadChildren` string syntax](#loadChildren) | v11 |
| `@angular/router` | [`ActivatedRoute` params and `queryParams` properties](#activatedroute-props) | unspecified |

## 已棄用的 API

本節完整列出目前所有已棄用的 API，並附上詳細資訊，協助你規劃遷移到替代方案。

<div class="alert is-helpful">

提示：本文件站的 [API 參考](api)區段中，已棄用的 API 會以 ~~刪除線~~ 標示。你可以依 [**Status: deprecated**](api?status=deprecated) 篩選 API 清單。

</div>

{@a common}

### @angular/common

| API | 替代方案 | 宣布棄用 | 詳細資訊 |
| --- | ----------- | --------------------- | ----- |
| [`DeprecatedI18NPipesModule`](api/common/DeprecatedI18NPipesModule) | [`CommonModule`](api/common/CommonModule#pipes) | v5 | 請參閱[管道](#i18n-pipes) |
 | [`DeprecatedCurrencyPipe`](api/common/DeprecatedCurrencyPipe) | [`CurrencyPipe`](api/common/CurrencyPipe) | v5  | 請參閱[管道](#i18n-pipes) |
 | [`DeprecatedDatePipe`](api/common/DeprecatedDatePipe) | [`DatePipe`](api/common/DatePipe) | v5  | 請參閱[管道](#i18n-pipes) |
 | [`DeprecatedDecimalPipe`](api/common/DeprecatedDecimalPipe) | [`DecimalPipe`](api/common/DecimalPipe) | v5  | 請參閱[管道](#i18n-pipes) |
 | [`DeprecatedPercentPipe`](api/common/DeprecatedPercentPipe) | [`PercentPipe`](api/common/PercentPipe) | v5 | 請參閱[管道](#i18n-pipes) |

{@a core}

### @angular/core

| API | 替代方案 | 宣布棄用 | 詳細資訊 |
| --- | ----------- | --------------------- | ----- |
| [`CollectionChangeRecord`](api/core/CollectionChangeRecord) | [`IterableChangeRecord`](api/core/IterableChangeRecord) | v4 | 無 |
| [`DefaultIterableDiffer`](api/core/DefaultIterableDiffer) | n/a | v4 | 不屬於公開 API。 |
| [`defineInjectable`](api/core/defineInjectable) | `ɵɵdefineInjectable` | v8 | 僅用於產生的程式碼。任何原始碼都不應依賴此 API。 |
| [`ReflectiveInjector`](api/core/ReflectiveInjector) | [`Injector.create`](api/core/Injector#create)  | v5 | 請參閱 [`ReflectiveInjector`](#reflectiveinjector) |
| [`ReflectiveKey`](api/core/ReflectiveKey) | 無 | v5 | 無 |
| [`RenderComponentType`](api/core/RenderComponentType) | [`RendererType2`](api/core/RendererType2) 與  [`Renderer2`](api/core/Renderer2) | v4 | 無 |
| [`Renderer`](api/core/Renderer) | [`Renderer2`](api/core/Renderer2) | v4 | 無 |
| [`RootRenderer`](api/core/RootRenderer) | [`RendererFactory2`](api/core/RendererFactory2) | v4 | 無 |
| [`ViewEncapsulation.Native`](api/core/ViewEncapsulation#Native) | [`ViewEncapsulation.ShadowDom`](api/core/ViewEncapsulation#ShadowDom) | v6 | 使用渲染器的原生封裝機制。請參閱 [view.ts](https://github.com/angular/angular/blob/3e992e18ebf51d6036818f26c3d77b52d3ec48eb/packages/core/src/metadata/view.ts#L32)。 |
| [`WtfScopeFn`](api/core/WtfScopeFn) | 無 | v8 | 請參閱 [Web Tracing Framework](#wtf) |
| [`wtfCreateScope`](api/core/wtfCreateScope) | 無 | v8 | 請參閱 [Web Tracing Framework](#wtf) |
| [`wtfStartTimeRange`](api/core/wtfStartTimeRange) | 無 | v8 | 請參閱 [Web Tracing Framework](#wtf) |
| [`wtfEndTimeRange`](api/core/wtfEndTimeRange) | 無 | v8 | 請參閱 [Web Tracing Framework](#wtf) |
| [`wtfLeave`](api/core/wtfLeave) | 無 | v8 | 請參閱 [Web Tracing Framework](#wtf) |

{@a forms}

### @angular/forms

| API | 替代方案 | 宣布棄用 | 詳細資訊 |
| --- | ----------- | --------------------- | ----- |
| [`NgFormSelectorWarning`](api/forms/NgFormSelectorWarning) | n/a | v6 | 請參閱 [ngForm](#ngform)。 |

{@a router}

### @angular/router

| API | 替代方案 | 宣布棄用 | 詳細資訊 |
| --- | ----------- | --------------------- | ----- |
| [`preserveQueryParams`](api/router/NavigationExtras#preserveQueryParams) | [`queryParamsHandling`](api/router/NavigationExtras#queryParamsHandling) | v4 | 無 |

{@a platform-webworker}

### @angular/platform-webworker

| API | 替代方案 | 宣布棄用 | 詳細資訊 |
| --- | ----------- | --------------------- | ----- |
| [All entry points](api/platform-webworker) | 無 | v8 | 請參閱 [platform-webworker](#webworker-apps)。 |

{@a platform-webworker-dynamic}

### @angular/platform-webworker-dynamic

| API | 替代方案 | 宣布棄用 | 詳細資訊 |
| --- | ----------- | --------------------- | ----- |
| [All entry points](api/platform-webworker-dynamic) | 無 | v8 | 請參閱 [platform-webworker](#webworker-apps)。 |

{@a upgrade}

### @angular/upgrade

| API                             | 替代方案                                     | 宣布棄用 | 詳細資訊                                          |
|---                             |---                                             |---                   |---                                            |
| [All entry points](api/upgrade) | [`@angular/upgrade/static`](api/upgrade/static) | v5                    | 請參閱[從 AngularJS 升級](guide/upgrade)。 |

{@a upgrade-static}

### @angular/upgrade/static

| API                                                 | 替代方案                                                   | 宣布棄用 | 詳細資訊                                          |
|---                                                 |---                                                           |---                   |---                                            |
| [`getAngularLib`](api/upgrade/static/getAngularLib) | [`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal) | v5                    | 請參閱[從 AngularJS 升級](guide/upgrade)。 |
[`setAngularLib`](api/upgrade/static/setAngularLib) | [`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal) | v5                    | 請參閱[從 AngularJS 升級](guide/upgrade)。 |

{@a deprecated-features}

## 已棄用的功能

本節列出目前所有已棄用的功能，包括範本語法、設定選項，以及未列在上文[已棄用的 API](#已棄用的-api)一節中的其他棄用項目。其中也包含已棄用的 API 使用情境或 API 組合，作為上述資訊的補充。

{@a wtf}

### Web Tracing Framework 整合

Angular 過去支援與 Web Tracing Framework（WTF）的整合，用於 Angular 應用程式的效能測試。這項整合已無人維護，如今對大多數 Angular 應用程式而言可能已無法運作。因此，我們在 Angular 第 8 版中棄用這項整合。

{@a deep-component-style-selector}

### `/deep/`、`>>>` 與 `:ng-deep` 元件樣式選取器

穿透 shadow DOM 的子代組合器已被棄用，各大瀏覽器與工具正在[移除對它的支援](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing)。因此，在 v4 中，我們棄用了 Angular 對 `/deep/`、`>>>` 與 `::ng-deep` 三者的支援。在移除之前，為了與工具保持更廣泛的相容性，建議優先使用 `::ng-deep`。

更多資訊，請參閱 Component Styles 指南中的 [/deep/、>>> 與 ::ng-deep](guide/component-styles#（已棄用）deep、-與-ng-deep "Component Styles guide, Deprecated deep and ngdeep")。

{@a template-tag}

### &lt;template&gt; 標籤

`<template>` 標籤在 v4 中被棄用，以避免與同名的 DOM 元素衝突（例如使用 web components 時）。請改用 `<ng-template>`。更多資訊，請參閱 [Ahead-of-Time Compilation](guide/angular-compiler-options#enablelegacytemplate) 指南。

{@a ngform}

### ngForm 元素選擇器

在 v6 中，棄用了使用 `ngForm` 元素選擇器的支援。
這麼做是為了與其他核心 Angular 選擇器保持一致，這些選擇器通常以 kebab-case 撰寫。

已棄用的寫法：

```
<ngForm #myForm="ngForm">
```

替代寫法：

```
<ng-form #myForm="ngForm">
```

[`NgFormSelectorWarning`](api/forms/NgFormSelectorWarning) 指令專門用於在使用已棄用的 `ngForm` 選擇器時顯示警告。

{@a ngmodel-reactive}

<a id="ngmodel-with-reactive-forms"></a>

### 搭配 reactive forms 的 ngModel

將 `ngModel` 輸入屬性與 `ngModelChange` 事件搭配反應式表單指令使用的支援，已在第 6 版中棄用。

更多資訊，請參閱 [`FormControlDirective`](api/forms/FormControlDirective#use-with-ngmodel) 與 [`FormControlName`](api/forms/FormControlName#use-with-ngmodel) 的使用說明。

{@a sw-versionedfiles}

### Service worker 的 versionedFiles

在 service worker 設定檔 `ngsw-config.json` 中，`versionedFiles` 與 `files` 的行為相同。自 v6 起，`versionedFiles` 已棄用；請改用 `files`。

更多資訊，請參閱 [Service Worker 設定](guide/service-worker-config#assetgroups)。

{@a reflectiveinjector}

### ReflectiveInjector

在第 5 版中，Angular 以 `StaticInjector` 取代了 `ReflectiveInjector`。注入器不再需要 Reflect polyfill，為大多數開發者縮減了應用程式大小。

之前：

```
ReflectiveInjector.resolveAndCreate(providers);
```

之後：

```
Injector.create({providers});
```

{@a i18n-pipes}

### 使用 Intl API 的管道

<!--
From https://blog.angular.io/version-5-0-0-of-angular-now-available-37e414935ced
-->

Angular 過去依賴瀏覽器使用瀏覽器 i18n API 來提供數字、日期與貨幣格式化。這種做法意味著大多數應用程式都需要使用 polyfill、使用者在不同瀏覽器間看到不一致的結果，而且常見格式（例如貨幣管道）開箱即用地不符合開發者的期望。

在 4.3 版中，Angular 引入了新的數字、日期與貨幣管道，提高了跨瀏覽器的一致性，並消除了對 i18n polyfill 的需求。這些管道使用 Unicode 通用語言環境資料儲存庫（CLDR），而非 JS Intl API，以提供廣泛的地區設定支援。

在 5.0.0 版中，Angular 更新了其標準管道，改用 CLRD 實作。
當時，Angular 也加入了 [`DeprecatedI18NPipesModule`](api/common/DeprecatedI18NPipesModule) 與相關 API，提供對舊行為的限時存取。如果你需要使用這些 `Deprecated*` 管道，請參閱 [Angular 變更日誌](https://github.com/angular/angular/blob/master/CHANGELOG.md#i18n-pipes) 與 [Date Formats 對應表](https://docs.google.com/spreadsheets/d/12iygt-_cakNP1VO7MV9g4lq9NsxVWG4tSfc98HpHb0k/edit#gid=0 "Date Formats Google sheet")。

提醒：如果你使用這些 `Deprecated*` 管道，應盡快遷移到上面列出的現行 API。這些已棄用的 API 是在第 9 版中移除的候選對象。

{@a loadChildren}

### loadChildren 字串語法

Angular 剛推出延遲載入路由時，瀏覽器尚不支援動態載入額外的 JavaScript。Angular 設計了我們自己的機制，使用 `loadChildren: './lazy/lazy.module#LazyModule'` 語法，並建立了工具來支援它。如今許多瀏覽器已支援 ECMAScript 動態匯入，Angular 正朝向這個新語法發展。

在第 8 版中，[`loadChildren`](api/router/LoadChildren) 路由規格的字串語法已被棄用，改採使用 `import()` 語法的新語法。

之前：

```
const routes: Routes = [{
  path: 'lazy',
  // The following string syntax for loadChildren is deprecated
  loadChildren: './lazy/lazy.module#LazyModule'
}];
```

之後：

```
const routes: Routes = [{
  path: 'lazy',
  // The new import() syntax
  loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
}];
```

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

更多資訊，請參閱 [Router 指南](guide/router#activated-route)。

{@a reflect-metadata}

### 在 JIT 模式中對 reflect-metadata polyfill 的依賴

Angular 應用程式，特別是依賴 JIT 編譯器的應用程式，過去需要一個 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) API 的 polyfill。

在 Angular 8.0 版中已移除對這個 polyfill 的需求（[參閱 #14473](https://github.com/angular/angular-cli/pull/14473)），使得大多數 Angular 應用程式中的 polyfill 變得不必要。由於第三方程式庫可能依賴這個 polyfill，我們不是從所有 Angular 專案中移除它，而是在 8.0 版中棄用對這個 polyfill 的需求。這應該能給程式庫作者與應用程式開發人員足夠的時間，評估是否需要這個 polyfill，並執行必要的重構來移除對它的依賴。

在典型的 Angular 專案中，polyfill 不會用於正式環境建置，因此移除它不應影響正式環境應用程式。這次移除的目標是整體簡化建置設定，並減少外部相依性的數量。

{@a static-query-resolution}

### `@ViewChild()` / `@ContentChild()` 靜態解析作為預設值

請參閱我們的[靜態查詢專用遷移指南](guide/static-query-migration)。

{@a contentchild-input-together}

### `@ContentChild()` / `@Input()` 一起使用

下列模式已被棄用：

```ts
@Input() @ContentChild(TemplateRef) tpl !: TemplateRef<any>;
```

請不要使用這種模式，而是將兩個裝飾器分開放在各自的屬性中，並加入遞補邏輯，如下列範例所示：

```ts
@Input() tpl !: TemplateRef<any>;
@ContentChild(TemplateRef) inlineTemplate !: TemplateRef<any>;
```

{@a cant-assign-template-vars}

### 無法指派給範本變數

在下列範例中，雙向繫結表示當 `valueChange` 事件觸發時，應該寫入 `optionName`。

```html
<option *ngFor="let optionName of options" [(value)]="optionName"></option>
```

然而，實際上 Angular 會忽略對範本變數的雙向繫結。從第 8 版開始，嘗試寫入範本變數已被棄用。在未來版本中，我們會拋出錯誤，表示不支援這種寫入。

```html
<option *ngFor="let optionName of options" [value]="optionName"></option>
```

{@a binding-to-innertext}

### 在 `platform-server` 中繫結 `innerText`

[Domino](https://github.com/fgnass/domino) 用於伺服器端渲染，它不支援 `innerText`，因此在 platform-server 的「domino adapter」中，有特殊程式碼會在你嘗試繫結 `innerText` 時遞補為 `textContent`。

這兩個屬性有細微的差異，因此在底層切換為 `textContent` 可能會讓使用者感到意外。基於這個原因，我們正在棄用這種行為。往後，使用 Domino 時，使用者應明確繫結到 `textContent`。

{@a wtf-apis}

### `wtfStartTimeRange` 與所有 `wtf*` API

所有 `wtf*` API 都已被棄用，將在未來版本中移除。

{@a webworker-apps}

### 在 platform-webworker 中執行 Angular 應用程式

`@angular/platform-*` 套件讓 Angular 能在不同的情境中執行。例如，
`@angular/platform-server` 讓 Angular 能在伺服器上執行，而 `@angular/platform-browser`
讓 Angular 能在網頁瀏覽器中執行。

`@angular/platform-webworker` 在 Angular 第 2 版推出，是一項實驗，嘗試運用
Angular 的渲染架構，在 [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 中執行整個網頁應用程式。我們從
這個實驗中學到很多，並得出結論：在 web
worker 中執行整個應用程式，對大多數應用程式而言不是最佳策略。

今後，我們與 web worker 相關的工作將聚焦於它的主要使用情境：
卸載初始渲染所需的 CPU 密集型、非關鍵工作（例如記憶體內搜尋
與影像處理）。詳情請參閱
[使用 Angular CLI 的 Web Workers 指南](guide/web-worker)。

自 Angular 第 8 版起，所有 `platform-webworker` API 都已被棄用。
這包括兩個套件：`@angular/platform-webworker` 與
`@angular/platform-webworker-dynamic`。

{@a removed}

## 已移除的 API

下列 API 已從 8.0.0 版開始移除：

| 套件 | API            | 替代方案 | 詳細資訊 |
| ------- | -------------- | ----------- | ----- |
| [`@angular/http`](https://v7.angular.tw/api/http) | 所有匯出 | [`@angular/common/http`](api/common/http) | 請參閱[下文](#http)。 |
[`@angular/http/testing`](https://v7.angular.tw/api/http/testing) | 所有匯出 | [`@angular/common/http/testing`](api/common/http/testing) | 請參閱[下文](#http)。 |
| `@angular/platform-browser` | [`DOCUMENT`](https://v7.angular.tw/api/platform-browser/DOCUMENT) | [`DOCUMENT` in `@angular/common`](api/common/DOCUMENT) | 使用 [`ng update`](cli/update) 更新到第 8 版時會自動變更這一點。  |
| `@angular/core/testing` | [`TestBed.deprecatedOverrideProvider()`](https://v7.angular.tw/api/core/testing/TestBed#deprecatedoverrideprovider) | [`TestBed.overrideProvider()`](api/core/testing/TestBed#overrideprovider) | 無 |
| `@angular/core/testing` | [`TestBedStatic.deprecatedOverrideProvider()`](https://v7.angular.tw/api/core/testing/TestBedStatic#deprecatedoverrideprovider) | [`TestBedStatic.overrideProvider()`](api/core/testing/TestBedStatic#overrideprovider) | 無 |

<!-- The following anchor is used by redirects from the removed API pages. Do not change or remove. -->

{@a http}

### @angular/http

<!--
Deprecation announced in version 5
https://blog.angular.io/version-5-0-0-of-angular-now-available-37e414935ced)
-->

整個 [`@angular/http`](http://v7.angular.tw/api/http) 套件已被移除。請改用 [`@angular/common/http`](api/common/http)。

新的 API 是在 Angular 中發出 HTTP 請求的更小、更簡單且更強大的方式。
新的 API 簡化了預設的使用體驗：不需要透過呼叫 `.json()` 方法來對映。
它也支援型別化回傳值與攔截器。

若要更新你的應用程式：
* 在你的每個模組中，將 `HttpModule` 取代為 [`HttpClientModule`](api/common/http/HttpClientModule)（來自 [`@angular/common/http`](api/common/http)）。
* 將 `Http` 服務取代為 [`HttpClient`](api/common/http/HttpClient) 服務。
* 移除任何 `map(res => res.json())` 呼叫。它們不再需要。

更多關於使用 `@angular/common/http` 的資訊，請參閱 [HttpClient 指南](guide/http "HTTP Client guide")。

| `@angular/http` | Closest replacement in `@angular/common/http` |
| ------------- | ------------------------------------------- |
| `BaseRequestOptions` |  [`HttpRequest`](/api/common/http/HttpRequest) |
| `BaseResponseOptions` | [`HttpResponse`](/api/common/http/HttpResponse) |
| `BrowserXhr` |  |
| `Connection` | [`HttpBackend`](/api/common/http/HttpBackend) |
| `ConnectionBackend` | [`HttpBackend`](/api/common/http/HttpBackend) |
| `CookieXSRFStrategy` | [`HttpClientXsrfModule`](/api/common/http/HttpClientXsrfModule) |
| `Headers` | [`HttpHeaders`](/api/common/http/HttpHeaders) |
| `Http` | [`HttpClient`](/api/common/http/HttpClient) |
| `HttpModule` | [`HttpClientModule`](/api/common/http/HttpClientModule) |
| `Jsonp` | [`HttpClient`](/api/common/http/HttpClient) |
| `JSONPBackend` | [`JsonpClientBackend`](/api/common/http/JsonpClientBackend) |
| `JSONPConnection` | [`JsonpClientBackend`](/api/common/http/JsonpClientBackend) |
| `JsonpModule` | [`HttpClientJsonpModule`](/api/common/http/HttpClientJsonpModule) |
| `QueryEncoder` | [`HttpUrlEncodingCodec`](/api/common/http/HttpUrlEncodingCodec) |
| `ReadyState` | [`HttpBackend`](/api/common/http/HttpBackend) |
| `Request` | [`HttpRequest`](/api/common/http/HttpRequest) |
| `RequestMethod` | [`HttpClient`](/api/common/http/HttpClient) |
| `RequestOptions` | [`HttpRequest`](/api/common/http/HttpRequest) |
| `RequestOptionsArgs` | [`HttpRequest`](/api/common/http/HttpRequest) |
| `Response` | [`HttpResponse`](/api/common/http/HttpResponse) |
| `ResponseContentType` | [`HttpClient`](/api/common/http/HttpClient) |
| `ResponseOptions` | [`HttpResponse`](/api/common/http/HttpResponse) |
| `ResponseOptionsArgs` | [`HttpResponse`](/api/common/http/HttpResponse) |
| `ResponseType` | [`HttpClient`](/api/common/http/HttpClient) |
| `URLSearchParams` | [`HttpParams`](/api/common/http/HttpParams) |
| `XHRBackend` | [`HttpXhrBackend`](/api/common/http/HttpXhrBackend) |
| `XHRConnection` | [`HttpXhrBackend`](/api/common/http/HttpXhrBackend) |
| `XSRFStrategy` | [`HttpClientXsrfModule`](/api/common/http/HttpClientXsrfModule) |

| `@angular/http/testing` | Closest replacement in `@angular/common/http/testing` |
| --------------------- | ------------------------------------------- |
| `MockBackend` | [`HttpTestingController`](/api/common/http/testing/HttpTestingController) |
| `MockConnection` | [`HttpTestingController`](/api/common/http/testing/HttpTestingController) |
