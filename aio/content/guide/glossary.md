# 術語表

Angular 有自己的一套詞彙。
多數 Angular 術語是常見的英文單字或電腦術語，但在 Angular 系統中有特定的含義。

本術語表列出最主要的術語，以及一些較不熟悉、定義特殊或出乎意料的術語。

[A](#A) [B](#B) [C](#C) [D](#D) [E](#E) [F](#F) [G](#G) [H](#H) [I](#I)
[J](#J) [K](#K) [L](#L) [M](#M) [N](#N) [O](#O) [P](#P) [Q](#Q) [R](#R)
[S](#S) [T](#T) [U](#U) [V](#V) [W](#W) [X](#X) [Y](#Y) [Z](#Z)

{@a A}
{@a aot}
<a id="預先編譯ahead-of-time-compilationaot"></a>
## 預先編譯（ahead-of-time compilation，AOT）

Angular 的預先編譯（AOT）編譯器會在建置階段將 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼，也就是在瀏覽器下載並執行該程式碼之前。
與[即時（JIT）編譯](#即時編譯just-in-time-compilationjit)相比，這是生產環境的最佳編譯模式，載入時間更短、效能更高。

使用 `ngc` 命令列工具編譯應用程式時，可以直接啟動至模組工廠，因此不需要在 JavaScript 套件中包含 Angular 編譯器。

{@a angular-element}
<a id="angular-元素angular-element"></a>
## Angular 元素（Angular element）

包裝為[自訂元素](#自訂元素custom-element)的 Angular [元件](#元件component)。

詳見[Angular Elements 概覽](guide/elements)。

{@a annotation}
## 註解（annotation）

為類別提供中繼資料的結構。
詳見[裝飾器](#裝飾器decoratordecoration)。

{@a app-shell}
## 應用程式殼層（app-shell）

應用程式殼層是一種在建置時期使用路由渲染應用程式一部分的方式。
這能讓使用者快速看到有意義的首屏畫面，因為瀏覽器只需渲染靜態 HTML 與 CSS，不需要初始化 JavaScript。
詳見[應用程式殼層模型](https://developers.google.com/web/fundamentals/architecture/app-shell)。

你可以使用 Angular CLI 來[產生](cli/generate#appshell)應用程式殼層。
這可以在瀏覽器下載完整用戶端版本、並在程式碼載入後自動切換的同時，透過快速啟動靜態渲染頁面來改善使用者體驗。
靜態渲染頁面是所有頁面共用的骨架。
詳見 [Service Worker 與 PWA](guide/service-worker-intro)。

{@a architect}
## Architect

Angular CLI 用來依提供的設定執行編譯、測試等複雜工作的工具。
Architect 是一個殼層，會以給定的[目標設定](#目標target)執行[建置器](#建置器builder)。
[建置器](#建置器builder)定義於某個 [npm 套件](#npm-套件)中。

在[工作區設定檔](guide/workspace-config#專案工具設定選項)中，「architect」區段為 Architect 建置器提供設定選項。

例如，內建的 lint 建置器定義於套件 `@angular-devkit/build_angular:tslint`，使用 [TSLint](https://palantir.github.io/tslint) 工具執行 lint，並以 `tslint.json` 檔案中的設定為準。

使用 Angular CLI 的 [`ng run`](cli/run) 命令，指定與建置器相關聯的[目標設定](#目標target)即可叫用建置器。
整合者可以加入建置器，讓工具與工作流程能透過 Angular CLI 執行。
例如，自訂建置器可以取代 Angular CLI 命令（如 `ng build` 或 `ng test`）內建實作所使用的第三方工具。

{@a attribute-directive}
{@a attribute-directives}
<a id="屬性指令attribute-directive"></a>
## 屬性指令（attribute directive）

一類[指令](#指令directive)，可以監聽並修改其他 HTML 元素、屬性、特性與元件的行為。
它們通常以 HTML 屬性的形式呈現，因此得名。

詳見[屬性指令](guide/attribute-directives)。

{@a B}
{@a binding}
## 繫結（binding）

一般而言，是將變數或屬性設定為資料值的作法。
在 Angular 中，通常指[資料繫結](#資料繫結data-binding)，也就是協調 DOM 物件屬性與資料物件屬性。

有時也指[依賴注入](#依賴注入dependency-injectiondi)中[權杖](#權杖token)與依賴[提供者](#提供者provider)之間的繫結。

{@a bootstrap}
## 啟動（bootstrap）

初始化並啟動應用程式或系統的方式。

在 Angular 中，應用程式的根 NgModule `AppModule` 具有 `bootstrap` 屬性，用來指定應用程式最上層的[元件](#元件component)。
在啟動過程中，Angular 會建立這些元件並插入 `index.html` 宿主網頁。
你可以在同一個 `index.html` 中啟動多個應用程式。
每個應用程式都有自己的元件。

詳見[啟動](guide/bootstrapping)。

{@a builder}
<a id="建置器builder"></a>
## 建置器（builder）

使用 [Architect](#architect) API 執行 `build` 或 `test` 等複雜流程的函式。
建置器程式碼定義於某個 [npm 套件](#npm-套件)中。

例如，[BrowserBuilder](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/build_angular/src/builders/browser) 會為瀏覽器目標執行 [webpack](https://webpack.js.org) 建置，而 [KarmaBuilder](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/build_angular/src/builders/karma) 會啟動 Karma 伺服器並為單元測試執行 webpack 建置。

Angular CLI 的 [`ng run`](cli/run) 命令會以特定的[目標設定](#目標target)叫用建置器。
[工作區設定](guide/workspace-config)檔 `angular.json` 包含內建建置器的預設設定。

{@a C}
{@a case-conventions}
{@a dash-case}
{@a camelcase}
{@a kebab-case}
<a id="case-types"></a>
<a id="大小寫慣例case-types"></a>
## 大小寫慣例（case types）

Angular 使用大小寫慣例來區分各種類型的名稱，如風格指南的[命名準則章節](guide/styleguide#02-01)所述。以下是大小寫慣例的摘要：

* camelCase：符號、屬性、方法、管道名稱、非元件指令選擇器、常數。
標準或小寫駝峰式寫法，項目的第一個字母為小寫。例如 "selectedHero"。

* UpperCamelCase（或 PascalCase）：類別名稱，包括定義元件、介面、NgModule、指令與管道的類別。
大寫駝峰式寫法，項目的第一個字母為大寫。例如 "HeroListComponent"。

* dash-case（或 "kebab-case"）：檔案名稱的描述性部分、元件選擇器。例如 "app-hero-list"。

* underscore_case（或 "snake_case"）：Angular 中通常不使用。蛇形式寫法使用底線連接單字。
例如 "convert_link_mode"。

* UPPER_UNDERSCORE_CASE（或 UPPER_SNAKE_CASE，或 SCREAMING_SNAKE_CASE）：常數的傳統寫法（可以接受，但建議使用 camelCase）。
大寫蛇形式寫法使用全大寫單字並以底線連接。例如 "FIX_ME"。

{@a change-detection}
<a id="變更偵測change-detection"></a>
## 變更偵測（change detection）

Angular 框架用來同步應用程式 UI 狀態與資料狀態的機制。
變更偵測器在每次執行時檢查資料模型的目前狀態，並將其保存為前次狀態，以便在下一次迭代時比較。

當應用程式邏輯更新元件資料時，檢視中繫結至 DOM 屬性的值可能會改變。
變更偵測器負責更新檢視以反映目前的資料模型。
同樣地，使用者可以與 UI 互動，引發改變資料模型狀態的事件。
這些事件可以觸發變更偵測。

使用預設（"CheckAlways"）變更偵測策略時，變更偵測器會在每個 VM 週期遍歷[檢視階層](#檢視階層view-hierarchy)，檢查範本中每一個[資料繫結屬性](#資料繫結data-binding)。
第一階段會比較相依資料的目前狀態與前次狀態，並收集變更。
第二階段會更新頁面 DOM 以反映新的資料值。

如果將變更偵測策略設為 `OnPush`（"CheckOnce"），變更偵測器只會在[明確叫用] (api/core/ChangeDetectorRef)時，或由 `Input` 參照變更或事件處理常式觸發時才執行。
這通常可以改善效能。
詳見[最佳化 Angular 的變更偵測](https://web.dev/faster-angular-change-detection)。

{@a class-decorator}
<a id="類別裝飾器class-decorator"></a>
## 類別裝飾器（class decorator）

緊接在類別定義之前出現的[裝飾器](#裝飾器decoratordecoration)，用來宣告該類別屬於指定類型，並提供適合該類型的中繼資料。

以下裝飾器可以宣告 Angular 類別類型。

*   `@Component()`
*   `@Directive()`
*   `@Pipe()`
*   `@Injectable()`
*   `@NgModule()`

{@a class-field-decorator}
<a id="類別欄位裝飾器class-field-decorator"></a>
## 類別欄位裝飾器（class field decorator）

緊接在類別定義中某個欄位之前的[裝飾器](#裝飾器decoratordecoration)陳述式，用來宣告該欄位的類型。
例如 `@Input` 與 `@Output`。

{@a collection}
<a id="集合collection"></a>
## 集合（collection）

在 Angular 中，指收集於某個 [npm 套件](#npm-套件)中的一組相關[原理圖](#原理圖schematic)。

{@a cli}
<a id="命令列介面command-line-interfacecli"></a>
## 命令列介面（command-line interface，CLI）

[Angular CLI](cli) 是管理 Angular 開發週期的命令列工具。
用它為[工作區](#工作區workspace)或[專案](#專案project)建立初始檔案系統骨架，並執行[原理圖](#原理圖schematic)，為各種元素的初始通用版本加入與修改程式碼。
Angular CLI 支援開發週期的所有階段，包括建置、測試、打包與部署。

*   若要開始在新專案中使用 Angular CLI，請參閱[本機環境設定](guide/setup-local)。
*   若要進一步了解 Angular CLI 的完整功能，請參閱 [Angular CLI 命令參考](cli)。

另見 [Schematics CLI](#schematics-cli)。

{@a component}
<a id="元件component"></a>
## 元件（component）

具有 `@Component()` [裝飾器](#裝飾器decoratordecoration)的類別，裝飾器會將其與伴隨的[範本](#範本template)關聯。
元件類別與範本共同定義一個[檢視](#檢視view)。
元件是一種特殊的[指令](#指令directive)。
`@Component()` 裝飾器以範本導向的功能擴充了 `@Directive()` 裝飾器。

Angular 元件類別負責透過[資料繫結](#資料繫結data-binding)公開資料，並處理檢視的大多數顯示與使用者互動邏輯。

在 [Angular 概念簡介](guide/architecture)中進一步了解元件類別、範本與檢視。

<a id="設定configuration"></a>
## 設定（configuration）

見[工作區設定](#工作區設定workspace-configuration)

{@a content-projection}
## 內容投影（content projection）

將元件外部的 DOM 內容插入元件檢視中指定位置的方式。

詳見[回應內容的變更](guide/lifecycle-hooks#回應投影內容的變更)。

{@a custom-element}
<a id="自訂元素custom-element"></a>
## 自訂元素（custom element）

Web 平台功能，目前大多數瀏覽器都支援，其他瀏覽器可透過 polyfill 使用。
見[瀏覽器支援](guide/browser-support)。

自訂元素功能擴充了 HTML，讓你可以定義標籤，其內容由 JavaScript 程式碼建立與控制。
當自訂元素加入 [CustomElementRegistry](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry) 時，瀏覽器便能識別它。
自訂元素也稱為 *Web 元件*。

你可以使用 API 轉換 Angular 元件，使其能向瀏覽器註冊，並在 Angular 應用程式中直接加入 DOM 的任何 HTML 中使用。
自訂元素標籤會將元件的檢視，連同變更偵測與資料繫結功能，插入原本不經 Angular 處理就會顯示的內容中。
見 [Angular 元素](#angular-元素angular-element)。
另見[動態元件載入](#動態元件載入dynamic-component-loading)。

{@a D}
{@a data-binding}
<a id="資料繫結data-binding"></a>
## 資料繫結（data binding）

讓應用程式能向使用者顯示資料值並回應使用者操作的流程。
使用者操作包括點選、觸控、按鍵等。

在資料繫結中，你宣告 HTML 元件與資料來源之間的關係，讓框架處理細節。
資料繫結可取代手動將應用程式資料值推入 HTML、附加事件監聽器、從畫面擷取變更後的值、再更新應用程式資料值的做法。

請在[範本語法](guide/template-syntax)中閱讀以下幾種繫結形式：

*   [插值](guide/template-syntax#interpolation)
*   [屬性繫結](guide/template-syntax#property-binding)
*   [事件繫結](guide/template-syntax#event-binding)
*   [屬性繫結](guide/template-syntax#屬性繫結attribute-binding)
*   [類別繫結](guide/template-syntax#類別繫結)
*   [樣式繫結](guide/template-syntax#樣式繫結)
*   [使用 ngModel 的雙向資料繫結](guide/template-syntax#ngModel)

{@a declarable}
<a id="可宣告類別declarable"></a>
## 可宣告類別（declarable）

可以加入 [NgModule](#ngmodule) 的 `declarations` 清單中的類別類型。
你可以宣告[元件](#元件component)、[指令](#指令directive) 與[管道](#管道pipe)。

請勿宣告以下項目：

*   已在另一個 NgModule 中宣告的類別
*   從其他套件匯入的指令陣列。
    例如，請勿宣告來自 `@angular/forms` 的 `FORMS_DIRECTIVES`

*   NgModule 類別
*   服務類別
*   非 Angular 的類別與物件，例如字串、數字、函式、實體模型、設定、商業邏輯與輔助類別

{@a decorator}
{@a decoration}
<a id="裝飾器decoratordecoration"></a>
## 裝飾器（decorator、decoration）

修改類別或屬性定義的函式。
裝飾器是實驗性（第 3 階段）的 [JavaScript 語言功能](https://github.com/tc39/proposal-decorators)。
裝飾器也稱為*註解*。
TypeScript 加入了對裝飾器的支援。

Angular 定義了裝飾器，將中繼資料附加到類別或屬性上，讓框架知道這些類別或屬性的含義與運作方式。

詳見[類別裝飾器](#類別裝飾器class-decorator)。
另見[類別欄位裝飾器](#類別欄位裝飾器class-field-decorator)。

{@a di}
{@a dependency-injection}
<a id="依賴注入dependency-injectiondi"></a>
## 依賴注入（dependency injection，DI）

一種設計模式與機制，用來建立應用程式的某些部分（依賴）並交付給需要它們的其他部分。

在 Angular 中，依賴通常是服務，但也可以是值，例如字串或函式。
應用程式的[注入器](#注入器injector)（在啟動期間自動建立）會在需要時，使用已設定的服務或值的[提供者](#提供者provider)來具現化依賴。
詳見 [Angular 的依賴注入](guide/dependency-injection)。

{@a di-token}
<a id="di-權杖di-token"></a>
## DI 權杖（DI token）

與依賴[提供者](#提供者provider)相關聯的查詢權杖，供[依賴注入](#依賴注入dependency-injectiondi)系統使用。

{@a differential-loading}
## 差異式載入（differential loading）

一種建置技術，為應用程式建立兩個套件。一個較小的套件供現代瀏覽器使用。第二個較大的套件讓應用程式能在不支援所有現代瀏覽器 API 的舊瀏覽器（例如 IE11）中正確執行。

如需更多資訊，請見[部署](guide/deployment#differential-loading)指南。

{@a directive}
{@a directives}
<a id="指令directive"></a>
## 指令（directive）

可以修改 DOM 結構，或修改 DOM 中的屬性與元件資料模型的類別。
指令類別定義之前緊接著 `@Directive()` [裝飾器](#裝飾器decoratordecoration)，用來提供中繼資料。

指令類別通常與 HTML 元素或屬性相關聯，而該元素或屬性常被直接稱為指令本身。
當 Angular 在 HTML [範本](#範本template)中找到指令時，會建立對應的指令類別執行個體，並將瀏覽器 DOM 該部分的控制權交給它。

Angular 有三種指令：

*   [元件](#元件component)使用 `@Component()` 將範本與類別關聯。
    `@Component()` 是 `@Directive()` 的擴充。

*   [屬性指令](#屬性指令attribute-directive)會修改頁面元素的行為與外觀。
*   [結構指令](#結構指令structural-directive)會修改 DOM 的結構。

Angular 提供了許多以 `ng` 前綴開頭的內建指令。
你也可以建立新的指令來實作自己的功能。
你可以為自訂指令關聯一個*選擇器*；這會擴充你在應用程式中可以使用的[範本語法](guide/template-syntax)。
*選擇器*是一個 HTML 標籤，例如 `<my-directive>`。

{@a dom}
## 領域特定語言（domain-specific language，DSL）

專用程式庫或 API。
詳見[領域特定語言](https://en.wikipedia.org/wiki/Domain-specific_language)。
Angular 以領域特定語言擴充 TypeScript，涵蓋與 Angular 應用程式相關的多個領域，定義於 [animations](guide/animations)、[forms](guide/forms) 與[路由與導覽](guide/router) 等 NgModule 中。

{@a dynamic-components}
<a id="動態元件載入dynamic-component-loading"></a>
## 動態元件載入（dynamic component loading）

在執行時期將元件加入 DOM 的技術。
這需要將元件排除在編譯之外，然後在加入 DOM 時，將其連接至 Angular 的變更偵測與事件處理框架。

另見[自訂元素](#自訂元素custom-element)，它以更簡單的方式達到相同的結果。

{@a E}
{@a eager-loading}
<a id="積極載入eager-loading"></a>
## 積極載入（eager loading）

在啟動時載入的 NgModule 或元件稱為積極載入，以區別於在執行時期載入、稱為延遲載入的項目。
另見[延遲載入](#延遲載入lazy-loading)。

{@a ecma}
## ECMAScript

[官方 JavaScript 語言規範](https://en.wikipedia.org/wiki/ECMAScript)。

並非所有瀏覽器都支援最新的 ECMAScript 標準，但你可以使用[轉譯器](#轉譯transpile)，以最新功能撰寫程式碼，再轉譯為可在瀏覽器支援版本上執行的程式碼。
[轉譯器](#轉譯transpile)的一個例子是 [TypeScript](#typescript)。
詳見[瀏覽器支援](guide/browser-support)。

{@a element}
## 元素（element）

Angular 定義了 `ElementRef` 類別，用來包裝與渲染相關的原生 UI 元素。
在大多數情況下，這讓你可以使用 Angular 範本與資料繫結來存取 DOM 元素，而不需要參照原生元素。

文件一般將*元素*與 *DOM 元素*區分開來。
*元素*是 `ElementRef` 類別的執行個體。
*DOM 元素*在必要時可以直接存取。

詳見[自訂元素](#自訂元素custom-element)。

{@a entry-point}
## 進入點（entry point）

供 [npm 套件](guide/npm-packages) 使用者匯入的 [JavaScript 模組](#模組module)。
進入點模組通常會重新匯出其他內部模組的符號。
一個套件可以包含多個進入點。
例如，`@angular/core` 套件有兩個進入點模組，可以使用模組名稱 `@angular/core` 與 `@angular/core/testing` 匯入。

{@a F}
{@a form-control}
## 表單控制項（form control）

`FormControl` 的執行個體，是 Angular 表單的基本組成單位。
它與 `FormGroup` 與 `FormArray` 一起追蹤表單輸入元素的值、驗證與狀態。

在 [Angular 表單簡介](guide/forms-overview)中進一步了解表單。

{@a form-model}
## 表單模型（form model）

在特定時間點，表單輸入元素的值與驗證狀態的「唯一真相來源」。
使用[反應式表單](#反應式表單reactive-forms)時，表單模型會在元件類別中明確建立。
使用[範本驅動表單](#範本驅動表單template-driven-forms)時，表單模型會由指令隱含建立。

在 [Angular 表單簡介](guide/forms-overview)中進一步了解反應式與範本驅動表單。

{@a form-validation}
## 表單驗證（form validation）

在表單值變更時執行的檢查，會依定義的約束回報給定的值是否正確且完整。
反應式表單會套用[驗證器函式](guide/form-validation#將自訂驗證器加入反應式表單)。
範本驅動表單使用[驗證器指令](guide/form-validation#將自訂驗證器加入範本驅動表單)。

詳見[表單驗證](guide/form-validation)。

{@a G}
{@a H}
{@a I}
{@a immutability}
## 不可變性（immutability）

值在建立後無法變更其狀態的特性。
[反應式表單](#反應式表單reactive-forms)會執行不可變變更，也就是每次資料模型的變更都會產生新的資料模型，而不是修改現有的模型。
[範本驅動表單](#範本驅動表單template-driven-forms)則使用 `NgModel` 與[雙向資料繫結](#資料繫結data-binding)執行可變變更，直接修改現有的資料模型。

{@a injectable}
<a id="可注入injectable"></a>
## 可注入（injectable）

使用[依賴注入](#依賴注入dependency-injectiondi)機制提供依賴的 Angular 類別或其他定義。
可注入的[服務](#服務service)類別必須以 `@Injectable()` [裝飾器](#裝飾器decoratordecoration)標記。

其他項目（例如常數值）也可以是可注入的。

{@a injector}
<a id="注入器injector"></a>
## 注入器（injector）

Angular [依賴注入](#依賴注入dependency-injectiondi)系統中的物件，可以在其快取中找到具名的依賴，或使用已設定的[提供者](#提供者provider)建立依賴。
注入器會在啟動過程中自動為 NgModule 建立，並透過元件階層繼承。

*   注入器會提供依賴的單一執行個體，並可將同一個執行個體注入多個元件。
*   NgModule 與元件層級的注入器階層，可以為各自的元件與子元件提供依賴的不同執行個體。
*   你可以使用不同的提供者設定注入器，為相同的依賴提供不同的實作。

在[階層式依賴注入器](guide/hierarchical-dependency-injection)中進一步了解注入器階層。

{@a input}
## 輸入（input）

定義[指令](#指令directive)時，指令屬性上的 `@Input()` 裝飾器會讓該屬性成為[屬性繫結](guide/template-syntax#property-binding)的*目標*。
資料值會從等號右側[範本運算式](#範本運算式template-expression)所識別的資料來源，流入輸入屬性。

詳見[輸入與輸出屬性](guide/template-syntax#inputs-outputs)。

{@a interpolation}
## 插值（interpolation）

一種屬性[資料繫結](#資料繫結data-binding)形式，其中雙大括號之間的[範本運算式](#範本運算式template-expression)會渲染為文字。
該文字可以在指派給元素屬性或顯示於元素標籤之間之前，與相鄰文字串接，如以下範例所示。

```html
<label>My current hero is {{hero.name}}</label>
```

在[範本語法](guide/template-syntax)中進一步了解[插值](guide/template-syntax#interpolation)。

{@a ivy}
## Ivy

Ivy 是 Angular [次世代編譯與渲染管線](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7)的代號。
隨著 Angular 第 9 版發布，預設使用新的編譯器與執行時期指令，而非稱為 [View Engine](#ve) 的舊編譯器與執行時期。

請見 [Angular Ivy](guide/ivy)。

{@a J}
{@a javascript}
## JavaScript

詳見 [ECMAScript](#ecmascript)。
另見 [TypeScript](#typescript)。

{@a jit}
<a id="即時編譯just-in-time-compilationjit"></a>
## 即時編譯（just-in-time compilation，JIT）

Angular 的即時（JIT）編譯器會在執行時期、作為啟動的一部分，將你的 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼。

執行 `ng build` 與 `ng serve` Angular CLI 命令時，JIT 編譯是預設值（相對於 AOT 編譯），很適合開發期間使用。
強烈不建議在生產環境使用 JIT 模式，因為它會產生龐大的應用程式承載，拖慢啟動效能。

與[預先編譯（AOT）](#預先編譯ahead-of-time-compilationaot)比較。

{@a K}
{@a L}
{@a lazy-load}
<a id="延遲載入lazy-loading"></a>
## 延遲載入（lazy loading）

一種透過將應用程式分割為多個套件並按需載入，來加快應用程式載入時間的流程。
例如，依賴可以依需要延遲載入。
此範例與[積極載入](#積極載入eager-loading)的模組不同，後者是根模組所需的模組，在啟動時載入。

[路由器](#路由器router)利用延遲載入，只在父檢視啟用時才載入子檢視。
同樣地，你可以建置自訂元素，在需要時載入 Angular 應用程式中。

{@a library}
<a id="程式庫library"></a>
## 程式庫（library）

在 Angular 中，指提供功能、可納入其他 Angular 應用程式的[專案](#專案project)。
程式庫不是完整的 Angular 應用程式，無法獨立執行。

若要將可重複使用的 Angular 功能加入非 Angular 的 Web 應用程式，請使用 Angular [自訂元素](#angular-元素angular-element)。

*   程式庫開發者可以使用 [Angular CLI](#命令列介面command-line-interfacecli) 在現有[工作區](#工作區workspace)中 `generate` 新程式庫的骨架，並將程式庫發布為 `npm` 套件。
*   應用程式開發者可以使用 [Angular CLI](#命令列介面command-line-interfacecli) `add` 已發布的程式庫，供同一[工作區](#工作區workspace)中的應用程式使用。

另見[原理圖](#原理圖schematic)。

{@a lifecycle-hook}
## 生命週期掛鉤（lifecycle hook）

一種介面，讓你可以在[指令](#指令directive)與[元件](#元件component)建立、更新與銷毀的生命週期中介入。

每個介面都有一個掛鉤方法，名稱為介面名稱加上 `ng` 前綴。
例如，`OnInit` 介面有一個名為 `ngOnInit` 的掛鉤方法。

Angular 依以下順序執行這些掛鉤方法：

* `ngOnChanges`：當[輸入](#input)/[輸出](#output)繫結值變更時。
* `ngOnInit`：在第一次 `ngOnChanges` 之後。
* `ngDoCheck`：開發者自訂的變更偵測。
* `ngAfterContentInit`：在元件內容初始化之後。
* `ngAfterContentChecked`：在每次檢查元件內容之後。
* `ngAfterViewInit`：在元件的檢視初始化之後。
* `ngAfterViewChecked`：在每次檢查元件的檢視之後。
* `ngOnDestroy`：在指令銷毀之前。

詳見[生命週期掛鉤](guide/lifecycle-hooks)。

{@a M}
{@a module}
<a id="模組module"></a>
## 模組（module）

一般而言，模組會收集專用於單一用途的一組程式碼。
Angular 使用標準 JavaScript 模組，也定義了 Angular 模組 `NgModule`。

在 JavaScript（ECMAScript）中，每個檔案都是一個模組，檔案中定義的所有物件都屬於該模組。
物件可以匯出成為公開物件，公開物件可以供其他模組匯入使用。

Angular 以 JavaScript 模組集合的形式提供。
JavaScript 模組的集合也稱為程式庫。
每個 Angular 程式庫的名稱都以 `@angular` 前綴開頭。
使用 [npm 套件管理員](https://docs.npmjs.com/about-npm)安裝 Angular 程式庫，並以 JavaScript `import` 宣告匯入其中的部分內容。

與 [NgModule](#ngmodule) 比較。

{@a N}
{@a ngcc}
## ngcc

Angular 相容性編譯器。
如果你使用 [Ivy](#ivy) 建置應用程式，但它依賴尚未以 Ivy 編譯的程式庫，Angular CLI 會使用 `ngcc` 自動將依賴的程式庫更新為使用 Ivy。

{@a ngmodule}
## NgModule

以 `@NgModule()` [裝飾器](#裝飾器decoratordecoration)為前綴的類別定義，用來宣告並作為專用於應用程式領域、工作流程或密切相關功能集合的程式碼區塊的清單。

與 [JavaScript 模組](#模組module)相同，NgModule 可以匯出功能供其他 NgModule 使用，也可以從其他 NgModule 匯入公開功能。
NgModule 類別的中繼資料會收集應用程式使用的元件、指令與管道，以及匯入與匯出清單。
另見[可宣告類別](#可宣告類別declarable)。

NgModule 通常以定義匯出內容的檔案命名。
例如，Angular 的 [DatePipe](api/common/DatePipe) 類別屬於 `date_pipe.ts` 檔案中名為 `date_pipe` 的功能模組。
你可以從 `@angular/core` 這類 Angular [限定範圍套件](#限定範圍套件scoped-package)匯入它們。

每個 Angular 應用程式都有一個根模組。
依慣例，類別命名為 `AppModule`，位於名為 `app.module.ts` 的檔案中。

詳見 [NgModules](guide/ngmodules)。

{@a npm-package}
## npm 套件

[npm 套件管理員](https://docs.npmjs.com/about-npm)用於發布與載入 Angular 模組與程式庫。

進一步了解 Angular 如何使用 [npm 套件](guide/npm-packages)。

{@a O}
{@a observable}
<a id="可觀察物件observable"></a>
## 可觀察物件（observable）

多個值的生產者，會將值推送給[訂閱者](#訂閱者subscriber)。
用於 Angular 各處的非同步事件處理。
你可以使用 `subscribe()` 方法並傳入新值、錯誤或完成通知的回呼函式來訂閱，以執行可觀察物件。

可觀察物件可以透過以下其中一種方式，將單一值或多個任意類型的值傳遞給訂閱者。

*   同步傳遞，如同函式將值傳遞給請求者
*   排程傳遞

訂閱者會在新值產生時收到通知，也會收到正常完成或錯誤完成的通知。

Angular 使用名為 [Reactive Extensions（RxJS）](http://reactivex.io/rxjs/) 的第三方程式庫。
詳見[可觀察物件](guide/observables)。

{@a observer}
<a id="觀察者observer"></a>
## 觀察者（observer）

傳遞給[可觀察物件](#可觀察物件observable)的 `subscribe()` 方法的物件。
該物件為[訂閱者](#訂閱者subscriber)定義回呼函式。

{@a output}
## 輸出（output）

定義[指令](#指令directive)時，指令屬性上的 `@Output{}` 裝飾器會讓該屬性成為[事件繫結](guide/template-syntax#event-binding)的*目標*。
事件會從這個屬性*流出*至等號右側[範本運算式](#範本運算式template-expression)所識別的接收者。

詳見[輸入與輸出屬性](guide/template-syntax#inputs-outputs)。

{@a P}
{@a pipe}
<a id="管道pipe"></a>
## 管道（pipe）

以 `@Pipe{}` 裝飾器為前綴的類別，定義一個函式，可將輸入值轉換為輸出值以顯示於[檢視](#檢視view)中。
Angular 定義了各種管道，你也可以定義新的管道。

詳見[管道](guide/pipes)。

{@a platform}
## 平台（platform）

在 Angular 術語中，平台是 Angular 應用程式執行的環境。
Angular 應用程式最常見的平台是 Web 瀏覽器，但也可以是行動裝置的作業系統或 Web 伺服器。

各種 Angular 執行時期平台的支援由 `@angular/platform-*` 套件提供。
這些套件讓使用 `@angular/core` 與 `@angular/common` 的應用程式，能在不同環境中執行，方法是為收集使用者輸入與為指定平台渲染 UI 提供實作。
將平台專屬功能隔離開來，可讓開發者以平台無關的方式使用框架的其他部分。

*   在 Web 瀏覽器中執行時，會從 `platform-browser` 套件匯入 [`BrowserModule`](api/platform-browser/BrowserModule)，它支援簡化安全性與事件處理的服務，並讓應用程式存取瀏覽器專屬功能，例如解讀鍵盤輸入與控制顯示中文件的標題。
    所有在瀏覽器中執行的應用程式都使用相同的平台服務。

*   使用[伺服器端渲染（SSR）](#伺服器端渲染server-side-rendering)時，[`platform-server`](api/platform-server) 套件提供 `DOM`、`XMLHttpRequest` 及其他不依賴瀏覽器的低階功能的 Web 伺服器實作。

{@a polyfill}
## Polyfill

用來填補瀏覽器 JavaScript 實作缺口的 [npm 套件](guide/npm-packages)。
見[瀏覽器支援](guide/browser-support)，了解為特定平台上的特定功能提供支援的 polyfill。

{@a project}
<a id="專案project"></a>
## 專案（project）

在 Angular CLI 中，指可以由 Angular CLI 命令建立或修改的獨立應用程式或[程式庫](#程式庫library)。

由 [`ng new`](cli/new) 產生的專案，包含使用 Angular CLI 開發與測試應用程式所需的來源檔案、資源與設定檔集合。
專案也可以使用 `ng generate application` 與 `ng generate library` 命令建立。

詳見[專案檔案結構](guide/file-structure)。

[`angular.json`](guide/workspace-config) 檔案會設定[工作區](#工作區workspace)中的所有專案。

{@a provider}
<a id="提供者provider"></a>
## 提供者（provider）

實作 [`Provider`](api/core/Provider) 介面之一的物件。
提供者物件定義如何取得與 [DI 權杖](#di-權杖di-token)相關聯的可注入依賴。
[注入器](#注入器injector)使用提供者為需要依賴的類別建立依賴的新執行個體。

Angular 會為其定義的服務向每個注入器註冊自己的提供者。
你可以為應用程式需要的服務註冊自己的提供者。

另見[服務](#服務service)。
另見[依賴注入](#依賴注入dependency-injectiondi)。

詳見[依賴注入](guide/dependency-injection)。

{@a Q}
{@a R}
{@a reactive-forms}
<a id="反應式表單reactive-forms"></a>
## 反應式表單（reactive forms）

透過元件中的程式碼建置 Angular 表單的框架。
另一種選擇是[範本驅動表單](#範本驅動表單template-driven-forms)。

使用反應式表單時：

*   「唯一真相來源」，也就是表單模型，是在元件類別中定義的。
*   驗證是透過驗證函式而非驗證指令來設定的。
*   每個控制項都是在元件類別中明確建立的，方法是手動建立 `FormControl` 執行個體或使用 `FormBuilder`。
*   範本輸入元素*不*使用 `ngModel`。
*   相關的 Angular 指令以 `form` 為前綴，例如 `formControl`、`formGroup` 與 `formControlName`。

另一種選擇是範本驅動表單。
關於兩種表單方法的介紹與比較，請參閱 [Angular 表單簡介](guide/forms-overview)。

{@a router}
{@a router-module}
<a id="路由器router"></a>
## 路由器（router）

在 Angular 應用程式中設定並實作狀態與[檢視](#檢視view)之間導覽的工具。

`Router` 模組是一個 [NgModule](#ngmodule)，提供在應用程式檢視之間導覽所需的服務提供者與指令。
[路由元件](#路由元件routing-component)是指匯入 `Router` 模組、且範本包含 `RouterOutlet` 元素以顯示路由器產生的檢視的元件。

路由器定義單一頁面內檢視之間的導覽，而非頁面之間的導覽。
它會解讀類似 URL 的連結，以決定要建立或銷毀哪些檢視，以及要載入或卸載哪些元件。
它讓你可以在 Angular 應用程式中利用[延遲載入](#延遲載入lazy-loading)。

詳見[路由與導覽](guide/router)。

{@a router-outlet}
## 路由出口（router outlet）

在路由元件範本中作為預留位置的[指令](#指令directive)。
Angular 會依目前的路由器狀態動態渲染範本。

{@a router-component}
<a id="路由元件routing-component"></a>
## 路由元件（routing component）

範本中有 `RouterOutlet` 指令、會依路由器導覽顯示檢視的 Angular [元件](#元件component)。

詳見[路由與導覽](guide/router)。

{@a rule}
<a id="規則rule"></a>
## 規則（rule）

在[原理圖](#原理圖schematic)中，指操作[檔案樹](#樹狀結構tree)、以特定方式建立、刪除或修改檔案的函式。

{@a S}
{@a schematic}
<a id="原理圖schematic"></a>
## 原理圖（schematic）

一種鷹架程式庫，定義如何透過建立、修改、重構或移動檔案與程式碼，來產生或轉換程式設計專案。
原理圖定義了操作虛擬檔案系統（稱為[樹狀結構](#樹狀結構tree)）的[規則](#規則rule)。

[Angular CLI](#命令列介面command-line-interfacecli) 使用原理圖來產生與修改 [Angular 專案](#專案project)及專案的組成部分。

*   Angular 提供一組原理圖供 Angular CLI 使用。
    請參閱 [Angular CLI 命令參考](cli)。
    Angular [CLI](#命令列介面command-line-interfacecli) 的 [`ng add`](cli/add) 命令會在將程式庫加入專案的過程中執行原理圖。
    Angular [CLI](#命令列介面command-line-interfacecli) 的 [`ng generate`](cli/generate) 命令會執行原理圖來建立應用程式、程式庫與 Angular 程式碼結構。

*   [程式庫](#程式庫library)開發者可以建立原理圖，讓 Angular CLI 能夠加入與更新他們發布的程式庫，並產生程式庫定義的成品。
    將這些原理圖加入你用來發布與分享程式庫的 npm 套件。

詳見 [Schematics](guide/schematics)。
另見[將程式庫與 CLI 整合](guide/creating-libraries#與-cli-整合)。

{@a schematics-cli}
## Schematics CLI

Schematics 有自己的命令列工具。
使用 Node 6.9 以上版本全域安裝 Schematics CLI。

<code-example language="bash">
npm install -g @angular-devkit/schematics-cli
</code-example>

這會安裝 `schematics` 可執行檔，你可以用它建立一個新的原理圖[集合](#集合collection)，其中包含初始的具名原理圖。
集合目錄是原理圖的工作區。
你也可以使用 `schematics` 命令將新的原理圖加入現有集合，或擴充現有的原理圖。

{@a scoped-package}
<a id="限定範圍套件scoped-package"></a>
## 限定範圍套件（scoped package）

一種將相關的 [npm 套件](guide/npm-packages)分組的方式。
NgModule 會在限定範圍套件中提供，其名稱以 Angular 的*範圍名稱* `@angular` 開頭。
例如 `@angular/core`、`@angular/common`、`@angular/forms` 與 `@angular/router`。

匯入限定範圍套件的方式與匯入一般套件相同。

<code-example path="architecture/src/app/app.component.ts" header="architecture/src/app/app.component.ts (import)" region="import">

</code-example>

{@a server-side-rendering}
<a id="伺服器端渲染server-side-rendering"></a>
## 伺服器端渲染（server-side rendering）

一種在伺服器上產生靜態應用程式頁面的技術，並可回應瀏覽器的請求產生與提供這些頁面。
它也可以預先產生頁面為 HTML 檔案，稍後再提供。

這項技術可以改善行動裝置與低效能裝置的效能，並在用戶端應用程式載入期間快速顯示靜態首頁，改善使用者體驗。
靜態版本也可以讓你的應用程式更容易被網路爬蟲看見。

你可以使用 [Angular CLI](#命令列介面command-line-interfacecli) 執行 [Angular Universal](#universal) 工具，搭配 `@nguniversal/express-engine` [原理圖](#原理圖schematic)，輕鬆為應用程式準備伺服器端渲染。

{@a service}
<a id="服務service"></a>
## 服務（service）

在 Angular 中，指具有 [@Injectable()](#可注入injectable) 裝飾器、封裝可跨應用程式重複使用的非 UI 邏輯與程式碼的類別。
Angular 區分元件與服務，以提高模組化與可重複使用性。

`@Injectable()` 中繼資料讓服務類別可以搭配[依賴注入](#依賴注入dependency-injectiondi)機制使用。
可注入類別由[提供者](#提供者provider)具現化。
[注入器](#注入器injector)會維護提供者清單，並在元件或其他服務需要時使用它們提供服務執行個體。

詳見[服務與依賴注入簡介](guide/architecture-services)。

{@a structural-directive}
{@a structural-directives}
<a id="結構指令structural-directive"></a>
## 結構指令（structural directive）

一類[指令](#指令directive)，負責透過修改 DOM 來塑造 HTML 版面配置。
修改 DOM 包括加入、移除或操作元素及其相關子元素。

詳見[結構指令](guide/structural-directives)。

{@a subscriber}
<a id="訂閱者subscriber"></a>
## 訂閱者（subscriber）

定義如何取得或產生要發布的值或訊息的函式。
當消費者執行[可觀察物件](#可觀察物件observable)的 `subscribe()` 方法時，就會執行此函式。

訂閱可觀察物件會觸發其執行、將回呼函式與其關聯，並建立一個 `Subscription` 物件，讓你可以取消訂閱。

`subscribe()` 方法接受一個 [觀察者](#觀察者observer) JavaScript 物件，其中最多有三個回呼函式，分別對應可觀察物件可以傳遞的每種通知類型。

*   `next` 通知會傳送一個值，例如數字、字串或物件。
*   `error` 通知會傳送 JavaScript 錯誤或例外。
*   `complete` 通知不會傳送值，但方法完成時會執行處理常式。
    方法完成後仍可繼續傳回排程的值。

{@a T}
{@a target}
<a id="目標target"></a>
## 目標（target）

[專案](#專案project)中可建置或可執行的子集，設定為[工作區設定檔](guide/workspace-config#專案工具設定選項)中的物件，並由 [Architect](#architect) [建置器](#建置器builder)執行。

在 `angular.json` 檔案中，每個專案都有一個 "architect" 區段，其中包含設定建置器的目標。
其中一些目標對應於 Angular [CLI](#命令列介面command-line-interfacecli) 命令，例如 `build`、`serve`、`test` 與 `lint`。

例如，`ng build` 命令叫用的 Architect 建置器會使用特定的建置工具來編譯專案，並具有預設設定，其值可以在命令列上覆寫。
`build` 目標也為「production」建置定義了替代設定，你可以在 `build` 命令上使用 `--prod` 旗標叫用。

Architect 工具提供一組建置器。
Angular [CLI](#命令列介面command-line-interfacecli) 的 [`ng new`](cli/new) 命令為初始應用程式專案提供一組目標。
[`ng generate application`](cli/generate#application) 與 [`ng generate library`](cli/generate#library) Angular [CLI](#命令列介面command-line-interfacecli) 命令為每個新的[專案](#專案project)提供一組目標。
這些目標、選項與設定可以自訂以滿足專案的需求。
例如，你可能想為專案的 "build" 目標加入 "staging" 或 "testing" 設定。

你也可以定義自訂建置器，並將使用自訂建置器的目標加入專案設定。
然後你可以使用 Angular [CLI](#命令列介面command-line-interfacecli) 的 [`ng run`](cli/run) 命令執行該目標。

{@a template}
<a id="範本template"></a>
## 範本（template）

定義如何渲染元件[檢視](#檢視view)的程式碼。

範本結合純 HTML 與 Angular [資料繫結](#資料繫結data-binding)語法、[指令](#指令directive)與[範本運算式](#範本運算式template-expression)（邏輯結構）。
Angular 元素會在頁面顯示之前插入或計算值，以修改 HTML 元素。
在[範本語法](guide/template-syntax)指南中進一步了解 Angular 範本語言。

範本透過 `@Component()` [裝飾器](#裝飾器decoratordecoration)與[元件類別](#元件component)關聯。
範本程式碼可以行內提供，作為 `template` 屬性的值，或放在透過 `templateUrl` 屬性連結的獨立 HTML 檔案中。

以 `TemplateRef` 物件表示的其他範本，可以定義替代或*內嵌*檢視，供多個元件參照。

{@a template-driven-forms}
<a id="範本驅動表單template-driven-forms"></a>
## 範本驅動表單（template-driven forms）

一種使用檢視中的 HTML 表單與輸入元素建置 Angular 表單的格式。
另一種格式使用[反應式表單](#反應式表單reactive-forms)框架。

使用範本驅動表單時：

*   「唯一真相來源」是範本。
    驗證是使用個別輸入元素上的屬性來定義的。

*   使用 `ngModel` 的[雙向繫結](#資料繫結data-binding)可讓元件模型與使用者在輸入元素中的輸入保持同步。
*   在幕後，Angular 會為每個輸入元素建立新的控制項，前提是你已為每個輸入設定 `name` 屬性與雙向繫結。
*   相關的 Angular 指令以 `ng` 為前綴，例如 `ngForm`、`ngModel` 與 `ngModelGroup`。

另一種選擇是反應式表單。
關於兩種表單方法的介紹與比較，請參閱 [Angular 表單簡介](guide/forms-overview)。

{@a template-expression}
<a id="範本運算式template-expression"></a>
## 範本運算式（template expression）

一種類似 TypeScript 的語法，Angular 會在[資料繫結](#資料繫結data-binding)中對其求值。

請閱讀[範本運算式](guide/template-syntax#範本運算式)，了解如何撰寫範本運算式。

{@a token}
<a id="權杖token"></a>
## 權杖（token）

用於高效率表格查詢的不透明識別碼。
在 Angular 中，[DI 權杖](#di-權杖di-token)用於在[依賴注入](#依賴注入dependency-injectiondi)系統中尋找依賴的[提供者](#提供者provider)。

{@a transpile}
<a id="轉譯transpile"></a>
## 轉譯（transpile）

將某個版本的 JavaScript 轉換為另一個版本的翻譯過程；例如，將 ES2015 降級為較舊的 ES5 版本。

{@a file-tree}
<a id="樹狀結構tree"></a>
## 樹狀結構（tree）

在[原理圖](#原理圖schematic)中，指以 `Tree` 類別表示的虛擬檔案系統。
原理圖[規則](#規則rule)接受樹狀結構物件作為輸入，對其操作，並傳回新的樹狀結構物件。

{@a typescript}
## TypeScript

一種以 JavaScript 為基礎的程式語言，以其可選的型別系統著稱。
TypeScript 提供編譯時期型別檢查與強大的工具支援。
型別檢查與工具支援包括程式碼自動完成、重構、行內文件與智慧搜尋。
許多程式碼編輯器與 IDE 原生支援 TypeScript，或透過外掛程式支援。

TypeScript 是 Angular 開發的首選語言。
詳見 [typescriptlang.org](http://www.typescriptlang.org/)。

{@a U}
{@a unidirectional-data-flow}
<a id="單向資料流unidirectional-data-flow"></a>
## 單向資料流（unidirectional data flow）

一種資料流模型，其中元件樹總是沿著從父元件到子元件的單一方向檢查變更，可防止變更偵測圖中出現循環。

實際上，這表示 Angular 中的資料在變更偵測期間會向下流動。
父元件可以輕易變更其子元件中的值，因為父元件會先被檢查。
然而，如果子元件在變更偵測期間試圖變更其父元件中的值（顛倒預期的資料流），就可能發生失敗，因為父元件已經渲染完成。
在開發模式下，如果應用程式試圖這樣做，Angular 會擲出 `ExpressionChangedAfterItHasBeenCheckedError` 錯誤，而不是靜默地無法渲染新值。

為避免此錯誤，試圖進行這類變更的[生命週期掛鉤](guide/lifecycle-hooks)方法應該觸發新一輪的變更偵測。
新一輪會沿著與之前相同的方向進行，但能成功取得新值。

{@a universal}
## Universal

一種為 Angular 應用程式實作[伺服器端渲染](#伺服器端渲染server-side-rendering)的工具。
與應用程式整合後，Universal 會在伺服器上產生靜態頁面並回應瀏覽器的請求提供這些頁面。
初始靜態頁面可作為快速載入的預留位置，同時完整應用程式正在準備於瀏覽器中正常執行。
詳見 [Angular Universal：伺服器端渲染](guide/universal)。

{@a V}
{@a view}
<a id="檢視view"></a>
## 檢視（view）

可以一起建立與銷毀的最小顯示元素群組。
Angular 會在一個或多個[指令](#指令directive)的控制下渲染檢視。

[元件](#元件component)類別及其相關聯的[範本](#範本template)定義一個檢視。
檢視具體由與元件相關聯的 `ViewRef` 執行個體表示。
直接屬於元件的檢視稱為*宿主檢視*。
檢視通常會收集為[檢視階層](#檢視階層view-hierarchy)。

檢視中元素的屬性可以因應使用者操作而動態變更；檢視中元素的結構（數量與順序）則不能。
你可以透過在其檢視容器中插入、移動或移除巢狀檢視來變更元素的結構。

檢視階層可以在使用者於應用程式中導覽時動態載入與卸載，通常由[路由器](#路由器router)控制。

{@a ve}
## View Engine

Angular 在第 9 版之前使用的編譯與渲染管線。比較 [Ivy](#ivy)。

{@a view-tree}
<a id="檢視階層view-hierarchy"></a>
## 檢視階層（view hierarchy）

一組相關檢視構成的樹狀結構，可以作為一個整體來操作。
根檢視稱為元件的*宿主檢視*。
宿主檢視是*內嵌檢視*樹的根，這些內嵌檢視收集於附加在宿主元件中錨點元素上的 `ViewContainerRef` 檢視容器中。
檢視階層是 Angular [變更偵測](#變更偵測change-detection)的關鍵部分。

檢視階層並不意味著元件階層。
內嵌於特定階層脈絡中的檢視，可以是其他元件的宿主檢視。
這些元件可以與宿主元件位於同一個 NgModule，或屬於其他 NgModule。

{@a W}
{@a web-component}
## Web 元件（web component）

見[自訂元素](#自訂元素custom-element)。

{@a workspace}
<a id="工作區workspace"></a>
## 工作區（workspace）

由 Angular [CLI](#命令列介面command-line-interfacecli) 驅動的一組 Angular [專案](#專案project)（也就是應用程式與程式庫），通常共同位於單一原始碼控制儲存庫（例如 [git](https://git-scm.com)）中。

Angular [CLI](#命令列介面command-line-interfacecli) 的 [`ng new`](cli/new) 命令會建立檔案系統目錄（「工作區根目錄」）。
在工作區根目錄中，它還會建立工作區[設定檔](#設定configuration)（`angular.json`），預設也會建立一個同名的初始應用程式專案。

建立或操作應用程式與程式庫的命令（例如 `add` 與 `generate`）必須在工作區目錄內執行。
詳見[工作區設定](guide/workspace-config)。

{@a cli-config}
{@a config}
<a id="工作區設定workspace-configuration"></a>
## 工作區設定（workspace configuration）

位於 Angular [工作區](#工作區workspace)根層級、名為 `angular.json` 的檔案，為由 Angular [CLI](#命令列介面command-line-interfacecli) 提供或與其整合的建置與開發工具，提供工作區範圍與專案專屬的設定預設值。
詳見[工作區設定](guide/workspace-config)。

其他專案專屬設定檔由工具使用，例如 `package.json` 用於 [npm 套件管理員](#npm-套件)、`tsconfig.json` 用於 [TypeScript 轉譯](#轉譯transpile)，以及 `tslint.json` 用於 [TSLint](https://palantir.github.io/tslint)。
詳見[工作區與專案檔案結構](guide/file-structure)。

{@a X}
{@a Y}
{@a Z}
{@a zone}
## 區域（zone）

一組非同步工作的執行脈絡。
對於除錯、效能分析與測試包含非同步操作（例如事件處理、Promise 與遠端伺服器呼叫）的應用程式很有用。

Angular 應用程式在一個區域中執行，可以透過檢查資料變更並解析[資料繫結](#資料繫結data-binding)來更新顯示的資訊，以回應非同步事件。

區域用戶端可以在非同步操作完成之前與之後採取行動。

在這支 [Brian Ford 影片](https://www.youtube.com/watch?v=3IqtmUscE_U)中進一步了解區域。
