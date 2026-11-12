# 術語表

Angular 有自己的一套詞彙。
多數 Angular 術語是常見的英文單字或電腦術語，但在 Angular 系統中有特定的含義。

本術語表列出最主要的術語，以及一些較不熟悉、定義特殊或出乎意料的術語。

[A][AioGuideGlossaryA]
[B][AioGuideGlossaryB]
[C][AioGuideGlossaryC]
[D][AioGuideGlossaryD]
[E][AioGuideGlossaryE]
[F][AioGuideGlossaryF]
[G][AioGuideGlossaryG]
[H][AioGuideGlossaryH]
[I][AioGuideGlossaryI]
[J][AioGuideGlossaryJ]
[K][AioGuideGlossaryK]
[L][AioGuideGlossaryL]
[M][AioGuideGlossaryM]
[N][AioGuideGlossaryN]
[O][AioGuideGlossaryO]
[P][AioGuideGlossaryP]
[Q][AioGuideGlossaryQ]
[R][AioGuideGlossaryR]
[S][AioGuideGlossaryS]
[T][AioGuideGlossaryT]
[U][AioGuideGlossaryU]
[V][AioGuideGlossaryV]
[W][AioGuideGlossaryW]
[X][AioGuideGlossaryX]
[Y][AioGuideGlossaryY]
[Z][AioGuideGlossaryZ]

<!-- vale Angular.Google_Headings = NO -->

<a id="aot"></a>

## 預先編譯（ahead-of-time compilation，AOT）

Angular 的預先編譯（AOT）編譯器會在建置階段將 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼。建置階段發生在瀏覽器下載並執行渲染後的程式碼之前。
與[即時（JIT）編譯][AioGuideGlossaryJustInTimeJitCompilation]相比，這是生產環境的最佳編譯模式，載入時間更短、效能更高。

使用 `ngc` 命令列工具編譯應用程式時，可以直接啟動至模組工廠，因此不需要在 JavaScript 套件中包含 Angular 編譯器。

## Angular 元素（Angular element）

包裝為[自訂元素][AioGuideGlossaryCustomElement]的 Angular [元件][AioGuideGlossaryComponent]。

詳見[Angular Elements 概覽][AioGuideElements]。

## Angular 套件格式（Angular package format，APF）

一種 Angular 專屬的 npm 套件版面配置規範，所有第一方 Angular 套件以及大多數第三方 Angular 程式庫都採用此規範。

詳見 [Angular 套件格式規範][AioGuideAngularPackageFormat]。

## 註解（annotation）

為類別提供中繼資料的結構。
詳見[裝飾器][AioGuideGlossaryDecoratorDecoration]。

<a id="app-shell"></a>
## 應用程式殼層（app-shell）

應用程式殼層是一種在建置時期使用路由渲染應用程式一部分的方式。
這能讓使用者快速看到有意義的首屏畫面，因為瀏覽器只需渲染靜態 HTML 與 CSS，不需要初始化 JavaScript。
詳見[應用程式殼層模型][GoogleDevelopersWebFundamentalsArchitectureAppShell]。

你可以使用 Angular CLI 來[產生][AioCliGenerateAppShell]應用程式殼層。
這可以在瀏覽器下載完整用戶端版本、並在程式碼載入後自動切換的同時，透過快速啟動靜態渲染頁面來改善使用者體驗。
靜態渲染頁面是所有頁面共用的骨架。
詳見 [Service Worker 與 PWA][AioGuideServiceWorkerIntro]。

## Architect

Angular CLI 用來依提供的設定執行編譯、測試等複雜工作的工具。
Architect 是一個殼層，會以給定的[目標設定][AioGuideGlossaryTarget]執行[建置器][AioGuideGlossaryBuilder]。
[建置器][AioGuideGlossaryBuilder]定義於某個 [npm 套件][AioGuideGlossaryNpmPackage]中。

在[工作區設定檔][AioGuideWorkspaceConfigProjectToolConfigurationOptions]中，「architect」區段為 Architect 建置器提供設定選項。

例如，內建的 lint 建置器定義於套件 `@angular-devkit/build_angular:tslint`，使用 [TSLint][GithubPalantirTslint] 工具執行 lint，並以 `tslint.json` 檔案中的設定為準。

使用 Angular CLI 的 [`ng run`][AioCliRun] 命令，指定與建置器相關聯的[目標設定][AioGuideGlossaryTarget]即可叫用建置器。
整合者可以加入建置器，讓工具與工作流程能透過 Angular CLI 執行。
例如，自訂建置器可以取代 Angular CLI 命令（如 `ng build` 或 `ng test`）內建實作所使用的第三方工具。

## 屬性指令（attribute directive）

一類[指令][AioGuideGlossaryDirective]，可以監聽並修改其他 HTML 元素、屬性、特性與元件的行為。
它們通常以 HTML 屬性的形式呈現，因此得名。

詳見[屬性指令][AioGuideAttributeDirectives]。

## 繫結（binding）

一般而言，是將變數或屬性設定為資料值的作法。
在 Angular 中，通常指[資料繫結][AioGuideGlossaryDataBinding]，也就是協調 DOM 物件屬性與資料物件屬性。

有時也指[依賴注入][AioGuideGlossaryDependencyInjectionDi]中[權杖][AioGuideGlossaryToken]與依賴[提供者][AioGuideGlossaryProvider]之間的繫結。

## 啟動（bootstrap）

初始化並啟動應用程式或系統的方式。

在 Angular 中，應用程式的根 NgModule `AppModule` 具有 `bootstrap` 屬性，用來指定應用程式最上層的[元件][AioGuideGlossaryComponent]。
在啟動過程中，Angular 會建立這些元件並插入 `index.html` 宿主網頁。
你可以在同一個 `index.html` 中啟動多個應用程式。
每個應用程式都有自己的元件。

詳見[啟動][AioGuideBootstrapping]。

## 建置器（builder）

使用 [Architect][AioGuideGlossaryArchitect] API 執行 `build` 或 `test` 等複雜流程的函式。
建置器程式碼定義於某個 [npm 套件][AioGuideGlossaryNpmPackage]中。

例如，[BrowserBuilder][GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersBrowser] 會為瀏覽器目標執行 [webpack][JsWebpackMain] 建置，而 [KarmaBuilder][GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersKarma] 會啟動 Karma 伺服器並為單元測試執行 webpack 建置。

Angular CLI 的 [`ng run`][AioCliRun] 命令會以特定的[目標設定][AioGuideGlossaryTarget]叫用建置器。
[工作區設定][AioGuideWorkspaceConfig]檔 `angular.json` 包含內建建置器的預設設定。

<a id ="camelcase"></a>

<a id="case-conventions"></a>
<a id="dash-case"></a>

<a id="case-types"></a>
## 大小寫慣例（case types）

Angular 使用大小寫慣例來區分各種類型的名稱，如風格指南的[命名準則章節][AioGuideStyleguide0201]所述。

以下是大小寫慣例的摘要：

|                                                                           | 詳細說明                                                                                                                                                                      | 範例             |
|:---                                                                       |:---                                                                                                                                                                          |:---                 |
| camelCase                                                                 | 符號、屬性、方法、管道名稱、非元件指令選擇器、常數。<br />標準或小寫駝峰式寫法，項目的第一個字母為小寫。  | `selectedHero`      |
| UpperCamelCase <br /> PascalCase                                          | 類別名稱，包括定義元件、介面、NgModule、指令與管道的類別。<br />大寫駝峰式寫法，項目的第一個字母為大寫。 | `HeroComponent` |
| dash-case <br /> kebab-case                                               | 檔案名稱的描述性部分、元件選擇器。                                                                                                                         | `app-hero-list`     |
| underscore_case <br /> snake_case                                         | Angular 中通常不使用。<br />蛇形式寫法使用底線連接單字。                                                                                      | `convert_link_mode` |
| UPPER_UNDERSCORE_CASE <br /> UPPER_SNAKE_CASE <br /> SCREAMING_SNAKE_CASE | 常數的傳統寫法。<br />這種寫法可以接受，但建議使用 camelCase。<br />大寫蛇形式寫法使用全大寫單字並以底線連接。 | `FIX_ME`            |

## 變更偵測（change detection）

Angular 框架用來同步應用程式 UI 狀態與資料狀態的機制。
變更偵測器在每次執行時檢查資料模型的目前狀態，並將其保存為前次狀態，以便在下一次迭代時比較。

當應用程式邏輯更新元件資料時，檢視中繫結至 DOM 屬性的值可能會改變。
變更偵測器負責更新檢視以反映目前的資料模型。
同樣地，使用者可以與 UI 互動，引發改變資料模型狀態的事件。
這些事件可以觸發變更偵測。

使用預設的變更偵測策略時，變更偵測器會在每個 VM 週期遍歷[檢視階層][AioGuideGlossaryViewHierarchy]，檢查範本中每一個[資料繫結屬性][AioGuideGlossaryDataBinding]。
第一階段會比較相依資料的目前狀態與前次狀態，並收集變更。
第二階段會更新頁面 DOM 以反映新的資料值。

如果將變更偵測策略設為 `OnPush`，變更偵測器只會在[明確叫用][AioApiCoreChangedetectorref]時，或由 `Input` 參照變更或事件處理常式觸發時才執行。
這通常可以改善效能。
詳見[最佳化 Angular 的變更偵測][WebDevFasterAngularChangeDetection]。

<a id="decorator"></a>

## 類別裝飾器（class decorator）

緊接在類別定義之前出現的[裝飾器][AioGuideGlossaryDecoratorDecoration]，用來宣告該類別屬於指定類型，並提供適合該類型的中繼資料。

以下裝飾器可以宣告 Angular 類別類型。

*   `@Component()`
*   `@Directive()`
*   `@Pipe()`
*   `@Injectable()`
*   `@NgModule()`

## 類別欄位裝飾器（class field decorator）

緊接在類別定義中某個欄位之前的[裝飾器][AioGuideGlossaryDecoratorDecoration]陳述式，用來宣告該欄位的類型。
例如 `@Input` 與 `@Output`。

## 集合（collection）

在 Angular 中，指收集於某個 [npm 套件][AioGuideGlossaryNpmPackage]中的一組相關[原理圖][AioGuideGlossarySchematic]。

<a id="cli"></a>

## 命令列介面（command-line interface，CLI）

[Angular CLI][AioCliMain] 是管理 Angular 開發週期的命令列工具。
用它為[工作區][AioGuideGlossaryWorkspace]或[專案][AioGuideGlossaryProject]建立初始檔案系統骨架，並執行[原理圖][AioGuideGlossarySchematic]，為各種元素的初始通用版本加入與修改程式碼。
Angular CLI 支援開發週期的所有階段，包括建置、測試、打包與部署。

*   若要開始在新專案中使用 Angular CLI，請參閱[本機環境設定][AioGuideSetupLocal]。
*   若要進一步了解 Angular CLI 的完整功能，請參閱 [Angular CLI 命令參考][AioCliMain]。

另見 [Schematics CLI][AioGuideGlossarySchematicsCli]。

## 元件（component）

具有 `@Component()` [裝飾器][AioGuideGlossaryDecoratorDecoration]的類別，裝飾器會將其與伴隨的[範本][AioGuideGlossaryTemplate]關聯。
元件類別與範本共同定義一個[檢視][AioGuideGlossaryView]。
元件是一種特殊的[指令][AioGuideGlossaryDirective]。
`@Component()` 裝飾器以範本導向的功能擴充了 `@Directive()` 裝飾器。

Angular 元件類別負責透過[資料繫結][AioGuideGlossaryDataBinding]公開資料，並處理檢視的大多數顯示與使用者互動邏輯。

在 [Angular 概念簡介][AioGuideArchitecture]中進一步了解元件類別、範本與檢視。

## 設定（configuration）

見[工作區設定][AioGuideGlossaryWorkspaceConfig]

## 內容投影（content projection）

將元件外部的 DOM 內容插入元件檢視中指定位置的方式。

詳見[回應內容的變更][AioGuideLifecycleHooksRespondingToProjectedContentChanges]。

## 自訂元素（custom element）

Web 平台功能，目前大多數瀏覽器都支援，其他瀏覽器可透過 polyfill 使用。
見[瀏覽器支援][AioGuideBrowserSupport]。

自訂元素功能擴充了 HTML，讓你可以定義標籤，其內容由 JavaScript 程式碼建立與控制。
當自訂元素加入 [CustomElementRegistry][MdnDocsWebApiCustomelementregistry] 時，瀏覽器便能識別它。
自訂元素也稱為 *Web 元件*。

你可以使用 API 轉換 Angular 元件，使其能向瀏覽器註冊，並在 Angular 應用程式中直接加入 DOM 的任何 HTML 中使用。
自訂元素標籤會將元件的檢視，連同變更偵測與資料繫結功能，插入原本不經 Angular 處理就會顯示的內容中。
見 [Angular 元素][AioGuideGlossaryAngularElement]。
另見[動態元件載入][AioGuideGlossaryDynamicComponentLoading]。

## 資料繫結（data binding）

讓應用程式能向使用者顯示資料值並回應使用者操作的流程。
使用者操作包括點選、觸控、按鍵等。

在資料繫結中，你宣告 HTML 元件與資料來源之間的關係，讓框架處理細節。
資料繫結可取代手動將應用程式資料值推入 HTML、附加事件監聽器、從畫面擷取變更後的值、再更新應用程式資料值的做法。

請閱讀 Angular [範本語法][AioGuideTemplateSyntax]中以下幾種繫結形式：

*   [插值][AioGuideInterpolation]
*   [屬性繫結][AioGuidePropertyBinding]
*   [事件繫結][AioGuideEventBinding]
*   [屬性繫結][AioGuideAttributeBinding]
*   [類別與樣式繫結][AioGuideAttributeBindingBindingToTheClassAttribute]
*   [使用 ngModel 的雙向資料繫結][AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]

<a id="declarable"></a>
## 可宣告類別（declarable）

可以加入 [NgModule][AioGuideGlossaryNgmodule] 的 `declarations` 清單中的類別。
你可以宣告[元件][AioGuideGlossaryComponent]、[指令][AioGuideGlossaryDirective] 與[管道][AioGuideGlossaryPipe]，除非它們裝飾器中的 `standalone` 旗標設為 `true`，也就是獨立類別。注意：獨立元件／指令／管道**不是**可宣告類別。關於獨立類別的更多資訊，請見[下方][AioGuideGlossaryStandalone]。

請勿宣告以下項目：

*   已宣告為[獨立][AioGuideGlossaryStandalone]的類別。
*   已在另一個 NgModule 中宣告的類別。
*   從其他套件匯入的指令陣列。
    例如，請勿宣告來自 `@angular/forms` 的 `FORMS_DIRECTIVES`。
*   NgModule 類別。
*   服務類別。
*   非 Angular 的類別與物件，例如字串、數字、函式、實體模型、設定、商業邏輯與輔助類別。

請注意，可宣告類別也可以宣告為獨立類別，直接在其他獨立元件或現有 NgModule 中匯入。詳見[獨立元件指南][AioGuideStandalone]。

## 裝飾器（decorator、decoration）

修改類別或屬性定義的函式。
裝飾器是實驗性（第 3 階段）的 [JavaScript 語言功能][GithubTC39ProposalDecorators]。
裝飾器也稱為*註解*。
TypeScript 加入了對裝飾器的支援。

Angular 定義了裝飾器，將中繼資料附加到類別或屬性上，讓框架知道這些類別或屬性的含義與運作方式。

詳見[類別裝飾器][AioGuideGlossaryClassDecorator]。
另見[類別欄位裝飾器][AioGuideGlossaryClassFieldDecorator]。

## 依賴注入（dependency injection，DI）

一種設計模式與機制，用來建立應用程式的某些部分（依賴）並交付給需要它們的其他部分。

在 Angular 中，依賴通常是服務，但也可以是值，例如字串或函式。
應用程式的[注入器][AioGuideGlossaryInjector]（在啟動期間自動建立）會在需要時，使用已設定的服務或值的[提供者][AioGuideGlossaryProvider]來具現化依賴。
詳見 [Angular 的依賴注入][AioGuideDependencyInjection]。

<a id="di-token"></a>
## DI 權杖（DI token）

與依賴[提供者][AioGuideGlossaryProvider]相關聯的查詢權杖，供[依賴注入][AioGuideGlossaryDependencyInjectionDi]系統使用。

## 指令（directive）

可以修改 DOM 結構，或修改 DOM 中的屬性與元件資料模型的類別。
指令類別定義之前緊接著 `@Directive()` [裝飾器][AioGuideGlossaryDecoratorDecoration]，用來提供中繼資料。

指令類別通常與 HTML 元素或屬性相關聯，而該元素或屬性常被直接稱為指令本身。
當 Angular 在 HTML [範本][AioGuideGlossaryTemplate]中找到指令時，會建立對應的指令類別執行個體，並將瀏覽器 DOM 該部分的控制權交給它。

Angular 有三種指令：

*   [元件][AioGuideGlossaryComponent]使用 `@Component()` 將範本與類別關聯。
    `@Component()` 是 `@Directive()` 的擴充。

*   [屬性指令][AioGuideGlossaryAttributeDirective]會修改頁面元素的行為與外觀。
*   [結構指令][AioGuideGlossaryStructuralDirective]會修改 DOM 的結構。

Angular 提供了許多以 `ng` 前綴開頭的內建指令。
你也可以建立新的指令來實作自己的功能。
你可以為自訂指令關聯一個*選擇器*；這會擴充你在應用程式中可以使用的[範本語法][AioGuideTemplateSyntax]。
*選擇器*是一個 HTML 標籤，例如 `<my-directive>`。

**UpperCamelCase**（例如 `NgIf`）指的是指令類別。
描述屬性與指令行為時可以使用 **UpperCamelCase**。

**lowerCamelCase**（例如 `ngIf`）指的是指令的屬性名稱。
描述如何在 HTML 範本中將指令套用到元素時，可以使用 **lowerCamelCase**。

## 領域特定語言（domain-specific language，DSL）

專用程式庫或 API。
詳見[領域特定語言][WikipediaWikiDomainSpecificLanguage]。
Angular 以領域特定語言擴充 TypeScript，涵蓋與 Angular 應用程式相關的多個領域，定義於 [animations][AioGuideAnimations]、[forms][AioGuideForms] 與[路由與導覽][AioGuideRouter] 等 NgModule 中。

## 動態元件載入（dynamic component loading）

在執行時期將元件加入 DOM 的技術。
這需要將元件排除在編譯之外，然後在加入 DOM 時，將其連接至 Angular 的變更偵測與事件處理框架。

另見[自訂元素][AioGuideGlossaryCustomElement]，它以更簡單的方式達到相同的結果。

## 積極載入（eager loading）

在啟動時載入的 NgModule 或元件稱為積極載入，以區別於在執行時期載入、稱為延遲載入的項目。
另見[延遲載入][AioGuideGlossaryLazyLoading]。

## ECMAScript

[官方 JavaScript 語言規範][WikipediaWikiEcmascript]。

並非所有瀏覽器都支援最新的 ECMAScript 標準，但你可以使用[轉譯器][AioGuideGlossaryTranspile]，以最新功能撰寫程式碼，再轉譯為可在瀏覽器支援版本上執行的程式碼。
[轉譯器][AioGuideGlossaryTranspile]的一個例子是 [TypeScript][AioGuideGlossaryTypescript]。
詳見[瀏覽器支援][AioGuideBrowserSupport]。

<a id="element"></a>
## 元素（element）

Angular 定義了 `ElementRef` 類別，用來包裝與渲染相關的原生 UI 元素。
在大多數情況下，這讓你可以使用 Angular 範本與資料繫結來存取 DOM 元素，而不需要參照原生元素。

文件一般將*元素*與 *DOM 元素*區分開來。
*元素*是 `ElementRef` 類別的執行個體。
*DOM 元素*在必要時可以直接存取。

詳見[自訂元素][AioGuideGlossaryCustomElement]。

## 進入點（entry point）

供 [npm 套件][AioGuideNpmPackages] 使用者匯入的 [JavaScript 模組][AioGuideGlossaryModule]。
進入點模組通常會重新匯出其他內部模組的符號。
一個套件可以包含多個進入點。
例如，`@angular/core` 套件有兩個進入點模組，可以使用模組名稱 `@angular/core` 與 `@angular/core/testing` 匯入。

## 表單控制項（form control）

`FormControl` 的執行個體，是 Angular 表單的基本組成單位。
它與 `FormGroup` 與 `FormArray` 一起追蹤表單輸入元素的值、驗證與狀態。

在 [Angular 表單簡介][AioGuideFormsOverview]中進一步了解表單。

## 表單模型（form model）

在特定時間點，表單輸入元素的值與驗證狀態的「唯一真相來源」。
使用[反應式表單][AioGuideGlossaryReactiveForms]時，表單模型會在元件類別中明確建立。
使用[範本驅動表單][AioGuideGlossaryTemplateDrivenForms]時，表單模型會由指令隱含建立。

在 [Angular 表單簡介][AioGuideFormsOverview]中進一步了解反應式與範本驅動表單。

## 表單驗證（form validation）

在表單值變更時執行的檢查，會依定義的約束回報給定的值是否正確且完整。
反應式表單會套用[驗證器函式][AioGuideFormValidationAddingCustomValidatorsToReactiveForms]。
範本驅動表單使用[驗證器指令][AioGuideFormValidationAddingCustomValidatorsToTemplateDrivenForms]。

詳見[表單驗證][AioGuideFormValidation]。

## 不可變性（immutability）

值在建立後無法變更其狀態的特性。
[反應式表單][AioGuideGlossaryReactiveForms]會執行不可變變更，也就是每次資料模型的變更都會產生新的資料模型，而不是修改現有的模型。
[範本驅動表單][AioGuideGlossaryTemplateDrivenForms]則使用 `NgModel` 與[雙向資料繫結][AioGuideGlossaryDataBinding]執行可變變更，直接修改現有的資料模型。

## 可注入（injectable）

使用[依賴注入][AioGuideGlossaryDependencyInjectionDi]機制提供依賴的 Angular 類別或其他定義。
可注入的[服務][AioGuideGlossaryService]類別必須以 `@Injectable()` [裝飾器][AioGuideGlossaryDecoratorDecoration]標記。

其他項目（例如常數值）也可以是可注入的。

<a id="injector"></a>
## 注入器（injector）

Angular [依賴注入][AioGuideGlossaryDependencyInjectionDi]系統中的物件，可以在其快取中找到具名的依賴，或使用已設定的[提供者][AioGuideGlossaryProvider]建立依賴。
注入器會在啟動過程中自動為 NgModule 建立，並透過元件階層繼承。

*   注入器會提供依賴的單一執行個體，並可將同一個執行個體注入多個元件。
*   NgModule 與元件層級的注入器階層，可以為各自的元件與子元件提供依賴的不同執行個體。
*   你可以使用不同的提供者設定注入器，為相同的依賴提供不同的實作。

在[階層式依賴注入器][AioGuideHierarchicalDependencyInjection]中進一步了解注入器階層。

## 輸入（input）

定義[指令][AioGuideGlossaryDirective]時，指令屬性上的 `@Input()` 裝飾器會讓該屬性成為[屬性繫結][AioGuidePropertyBinding]的*目標*。
資料值會從等號右側[範本運算式][AioGuideGlossaryTemplateExpression]所識別的資料來源，流入輸入屬性。

詳見 [`@Input()` 與 `@Output()` 裝飾器函式][AioGuideInputsOutputs]。

## 插值（interpolation）

一種屬性[資料繫結][AioGuideGlossaryDataBinding]形式，其中雙大括號之間的[範本運算式][AioGuideGlossaryTemplateExpression]會渲染為文字。
該文字可以在指派給元素屬性或顯示於元素標籤之間之前，與相鄰文字串接，如以下範例所示。

<code-example format="html" language="html">

&lt;label&gt;My current hero is {{hero.name}}&lt;/label&gt;

</code-example>

詳見[插值][AioGuideInterpolation]指南。

## Ivy

Ivy 是 Angular 目前[編譯與渲染管線][AngularBlogAPlanForVersion80AndIvyB3318dfc19f7]的歷史代號。
它現在是唯一受支援的引擎，因此所有內容都使用 Ivy。

## JavaScript

詳見 [ECMAScript][AioGuideGlossaryEcmascript]。
另見 [TypeScript][AioGuideGlossaryTypescript]。

<a id="jit"></a>

## 即時編譯（just-in-time compilation，JIT）

Angular 的即時（JIT）編譯器會在執行時期、作為啟動的一部分，將你的 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼。

執行 `ng build` 與 `ng serve` Angular CLI 命令時，JIT 編譯是預設值（相對於 AOT 編譯），很適合開發期間使用。
強烈不建議在生產環境使用 JIT 模式，因為它會產生龐大的應用程式承載，拖慢啟動效能。

與[預先編譯（AOT）][AioGuideGlossaryAheadOfTimeAotCompilation]比較。

<a id="lazy-loading"></a>
## 延遲載入（lazy loading）

一種透過將應用程式分割為多個套件並按需載入，來加快應用程式載入時間的流程。
例如，依賴可以依需要延遲載入。
此範例與[積極載入][AioGuideGlossaryEagerLoading]的模組不同，後者是根模組所需的模組，在啟動時載入。

[路由器][AioGuideGlossaryRouter]利用延遲載入，只在父檢視啟用時才載入子檢視。
同樣地，你可以建置自訂元素，在需要時載入 Angular 應用程式中。

## 程式庫（library）

在 Angular 中，指提供功能、可納入其他 Angular 應用程式的[專案][AioGuideGlossaryProject]。
程式庫不是完整的 Angular 應用程式，無法獨立執行。

若要將可重複使用的 Angular 功能加入非 Angular 的 Web 應用程式，請使用 Angular [自訂元素][AioGuideGlossaryAngularElement]。

*   程式庫開發者可以使用 [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] 在現有[工作區][AioGuideGlossaryWorkspace]中 `generate` 新程式庫的骨架，並將程式庫發布為 `npm` 套件。
*   應用程式開發者可以使用 [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] `add` 已發布的程式庫，供同一[工作區][AioGuideGlossaryWorkspace]中的應用程式使用。

另見[原理圖][AioGuideGlossarySchematic]。

## 生命週期掛鉤（lifecycle hook）

一種介面，讓你可以在[指令][AioGuideGlossaryDirective]與[元件][AioGuideGlossaryComponent]建立、更新與銷毀的生命週期中介入。

每個介面都有一個掛鉤方法，名稱為介面名稱加上 `ng` 前綴。
例如，`OnInit` 介面有一個名為 `ngOnInit` 的掛鉤方法。

Angular 依以下順序執行這些掛鉤方法：

|     | 掛鉤方法                | 詳細說明                                                                                           |
|:--- |:---                     |:---                                                                                               |
| 1   | `ngOnChanges`           | 當[輸入][AioGuideGlossaryInput]或[輸出][AioGuideGlossaryOutput]繫結值變更時。 |
| 2   | `ngOnInit`              | 在第一次 `ngOnChanges` 之後。                                                                    |
| 3   | `ngDoCheck`             | 開發者自訂的變更偵測。                                                              |
| 4   | `ngAfterContentInit`    | 在元件內容初始化之後。                                                              |
| 5   | `ngAfterContentChecked` | 在每次檢查元件內容之後。                                                           |
| 6   | `ngAfterViewInit`       | 在元件的檢視初始化之後。                                                   |
| 7   | `ngAfterViewChecked`    | 在每次檢查元件的檢視之後。                                                    |
| 8   | `ngOnDestroy`           | 在指令銷毀之前。                                                           |

詳見[生命週期掛鉤][AioGuideLifecycleHooks]。

## 模組（module）

一般而言，模組會收集專用於單一用途的一組程式碼。
Angular 使用標準 JavaScript 模組，也定義了 Angular 模組 `NgModule`。

在 JavaScript（ECMAScript）中，每個檔案都是一個模組，檔案中定義的所有物件都屬於該模組。
物件可以匯出成為公開物件，公開物件可以供其他模組匯入使用。

Angular 以 JavaScript 模組集合的形式提供。
JavaScript 模組的集合也稱為程式庫。
每個 Angular 程式庫的名稱都以 `@angular` 前綴開頭。
使用 [npm 套件管理員][NpmjsDocsAboutNpm]安裝 Angular 程式庫，並以 JavaScript `import` 宣告匯入其中的部分內容。

與 [NgModule][AioGuideGlossaryNgmodule] 比較。

## NgModule

以 `@NgModule()` [裝飾器][AioGuideGlossaryDecoratorDecoration]為前綴的類別定義，用來宣告並作為專用於應用程式領域、工作流程或密切相關功能集合的程式碼區塊的清單。

與 [JavaScript 模組][AioGuideGlossaryModule]相同，NgModule 可以匯出功能供其他 NgModule 使用，也可以從其他 NgModule 匯入公開功能。
NgModule 類別的中繼資料會收集應用程式使用的元件、指令與管道，以及匯入與匯出清單。
另見[可宣告類別][AioGuideGlossaryDeclarable]。

NgModule 通常以定義匯出內容的檔案命名。
例如，Angular 的 [DatePipe][AioApiCommonDatepipe] 類別屬於 `date_pipe.ts` 檔案中名為 `date_pipe` 的功能模組。
你可以從 `@angular/core` 這類 Angular [限定範圍套件][AioGuideGlossaryScopedPackage]匯入它們。

每個 Angular 應用程式都有一個根模組。
依慣例，類別命名為 `AppModule`，位於名為 `app.module.ts` 的檔案中。

詳見 [NgModules][AioGuideNgmodules]。

## npm 套件

[npm 套件管理員][NpmjsDocsAboutNpm]用於發布與載入 Angular 模組與程式庫。

進一步了解 Angular 如何使用 [npm 套件][AioGuideNpmPackages]。

## ngc

`ngc` 是 TypeScript 轉 JavaScript 的轉譯器，可處理 Angular 裝飾器、中繼資料與範本，並產生 JavaScript 程式碼。
最新的實作內部稱為 `ngtsc`，因為它是以 TypeScript 編譯器 `tsc` 為基礎的精簡包裝，並加入轉換以處理 Angular 程式碼。

## 可觀察物件（observable）

多個值的生產者，會將值推送給[訂閱者][AioGuideGlossarySubscriber]。
用於 Angular 各處的非同步事件處理。
你可以使用 `subscribe()` 方法並傳入新值、錯誤或完成通知的回呼函式來訂閱，以執行可觀察物件。

可觀察物件可以透過以下其中一種方式，將單一值或多個任意類型的值傳遞給訂閱者。

*   同步傳遞，如同函式將值傳遞給請求者
*   排程傳遞

訂閱者會在新值產生時收到通知，也會收到正常完成或錯誤完成的通知。

Angular 使用名為 [Reactive Extensions（RxJS）][RxjsMain] 的第三方程式庫。
詳見[可觀察物件][AioGuideObservables]。

## 觀察者（observer）

傳遞給[可觀察物件][AioGuideGlossaryObservable]的 `subscribe()` 方法的物件。
該物件為[訂閱者][AioGuideGlossarySubscriber]定義回呼函式。

## 輸出（output）

定義[指令][AioGuideGlossaryDirective]時，指令屬性上的 `@Output{}` 裝飾器會讓該屬性成為[事件繫結][AioGuideEventBinding]的*目標*。
事件會從這個屬性*流出*至等號右側[範本運算式][AioGuideGlossaryTemplateExpression]所識別的接收者。

詳見 [`@Input()` 與 `@Output()` 裝飾器函式][AioGuideInputsOutputs]。

## 管道（pipe）

以 `@Pipe{}` 裝飾器為前綴的類別，定義一個函式，可將輸入值轉換為輸出值以顯示於[檢視][AioGuideGlossaryView]中。
Angular 定義了各種管道，你也可以定義新的管道。

詳見[管道][AioGuidePipes]。

## 平台（platform）

在 Angular 術語中，平台是 Angular 應用程式執行的環境。
Angular 應用程式最常見的平台是 Web 瀏覽器，但也可以是行動裝置的作業系統或 Web 伺服器。

各種 Angular 執行時期平台的支援由 `@angular/platform-*` 套件提供。
這些套件讓使用 `@angular/core` 與 `@angular/common` 的應用程式，能在不同環境中執行，方法是為收集使用者輸入與為指定平台渲染 UI 提供實作。
將平台專屬功能隔離開來，可讓開發者以平台無關的方式使用框架的其他部分。

*   在 Web 瀏覽器中執行時，會從 `platform-browser` 套件匯入 [`BrowserModule`][AioApiPlatformBrowserBrowsermodule]，它支援簡化安全性與事件處理的服務，並讓應用程式存取瀏覽器專屬功能，例如解讀鍵盤輸入與控制顯示中文件的標題。
    所有在瀏覽器中執行的應用程式都使用相同的平台服務。

*   使用[伺服器端渲染（SSR）][AioGuideGlossaryServerSideRendering]時，[`platform-server`][AioApiPlatformServer] 套件提供 `DOM`、`XMLHttpRequest` 及其他不依賴瀏覽器的低階功能的 Web 伺服器實作。

## Polyfill

用來填補瀏覽器 JavaScript 實作缺口的 [npm 套件][AioGuideNpmPackages]。
見[瀏覽器支援][AioGuideBrowserSupport]，了解為特定平台上的特定功能提供支援的 polyfill。

## 專案（project）

在 Angular CLI 中，指可以由 Angular CLI 命令建立或修改的獨立應用程式或[程式庫][AioGuideGlossaryLibrary]。

由 [`ng new`][AioCliNew] 產生的專案，包含使用 Angular CLI 開發與測試應用程式所需的來源檔案、資源與設定檔集合。
專案也可以使用 `ng generate application` 與 `ng generate library` 命令建立。

詳見[專案檔案結構][AioGuideFileStructure]。

[`angular.json`][AioGuideWorkspaceConfig] 檔案會設定[工作區][AioGuideGlossaryWorkspace]中的所有專案。

<a id="provider"></a>
## 提供者（provider）

實作 [`Provider`][AioApiCoreProvider] 介面之一的物件。
提供者物件定義如何取得與 [DI 權杖][AioGuideGlossaryDiToken]相關聯的可注入依賴。
[注入器][AioGuideGlossaryInjector]使用提供者為需要依賴的類別建立依賴的新執行個體。

Angular 會為其定義的服務向每個注入器註冊自己的提供者。
你可以為應用程式需要的服務註冊自己的提供者。

另見[服務][AioGuideGlossaryService]。
另見[依賴注入][AioGuideGlossaryDependencyInjectionDi]。

詳見[依賴注入][AioGuideDependencyInjection]。

## 反應式表單（reactive forms）

透過元件中的程式碼建置 Angular 表單的框架。
另一種選擇是[範本驅動表單][AioGuideGlossaryTemplateDrivenForms]。

使用反應式表單時：

*   「唯一真相來源」，也就是表單模型，是在元件類別中定義的。
*   驗證是透過驗證函式而非驗證指令來設定的。
*   每個控制項都是在元件類別中明確建立的，方法是手動建立 `FormControl` 執行個體或使用 `FormBuilder`。
*   範本輸入元素*不*使用 `ngModel`。
*   相關的 Angular 指令以 `form` 為前綴，例如 `formControl`、`formGroup` 與 `formControlName`。

另一種選擇是範本驅動表單。
關於兩種表單方法的介紹與比較，請參閱 [Angular 表單簡介][AioGuideFormsOverview]。

## 解析器（resolver）

實作 [Resolve][AioApiRouterResolve] 介面的類別，用來產生或擷取完成導覽至請求路由之前所需的資料。
你也可以使用與 [resolve()][AioApiRouterResolve] 方法簽名相同的函式，取代 [Resolve][AioApiRouterResolve] 介面。
解析器會在路由樹的所有[路由守衛][AioGuideGlossaryRouteGuard]都已執行且成功之後執行。

請參閱使用[解析守衛][AioGuideRouterTutorialTohResolvePreFetchingComponentData]擷取動態資料的範例。

## 路由守衛（route guard）

在路由應用程式中控制導覽至請求路由的方法。
守衛決定路由是否可以啟用或停用，以及延遲載入的模組是否可以載入。

詳見[路由與導覽][AioGuideRouterPreventingUnauthorizedAccess]指南。

## 路由器（router）

在 Angular 應用程式中設定並實作狀態與[檢視][AioGuideGlossaryView]之間導覽的工具。

`Router` 模組是一個 [NgModule][AioGuideGlossaryNgmodule]，提供在應用程式檢視之間導覽所需的服務提供者與指令。
[路由元件][AioGuideGlossaryRoutingComponent]是指匯入 `Router` 模組、且範本包含 `RouterOutlet` 元素以顯示路由器產生的檢視的元件。

路由器定義單一頁面內檢視之間的導覽，而非頁面之間的導覽。
它會解讀類似 URL 的連結，以決定要建立或銷毀哪些檢視，以及要載入或卸載哪些元件。
它讓你可以在 Angular 應用程式中利用[延遲載入][AioGuideGlossaryLazyLoading]。

詳見[路由與導覽][AioGuideRouter]。

## 路由出口（router outlet）

在路由元件範本中作為預留位置的[指令][AioGuideGlossaryDirective]。
Angular 會依目前的路由器狀態動態渲染範本。

## 路由元件（routing component）

範本中有 `RouterOutlet` 指令、會依路由器導覽顯示檢視的 Angular [元件][AioGuideGlossaryComponent]。

詳見[路由與導覽][AioGuideRouter]。

## 規則（rule）

在[原理圖][AioGuideGlossarySchematic]中，指操作[檔案樹][AioGuideGlossaryTree]、以特定方式建立、刪除或修改檔案的函式。

## 原理圖（schematic）

一種鷹架程式庫，定義如何透過建立、修改、重構或移動檔案與程式碼，來產生或轉換程式設計專案。
原理圖定義了操作虛擬檔案系統（稱為[樹狀結構][AioGuideGlossaryTree]）的[規則][AioGuideGlossaryRule]。

[Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] 使用原理圖來產生與修改 [Angular 專案][AioGuideGlossaryProject]及專案的組成部分。

*   Angular 提供一組原理圖供 Angular CLI 使用。
    請參閱 [Angular CLI 命令參考][AioCliMain]。
    Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 的 [`ng add`][AioCliAdd] 命令會在將程式庫加入專案的過程中執行原理圖。
    Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 的 [`ng generate`][AioCliGenerate] 命令會執行原理圖來建立應用程式、程式庫與 Angular 程式碼結構。

*   [程式庫][AioGuideGlossaryLibrary]開發者可以建立原理圖，讓 Angular CLI 能夠加入與更新他們發布的程式庫，並產生程式庫定義的成品。
    將這些原理圖加入你用來發布與分享程式庫的 npm 套件。

詳見 [Schematics][AioGuideSchematics]。
另見[將程式庫與 CLI 整合][AioGuideCreatingLibrariesIntegratingWithTheCliUsingCodeGenerationSchematics]。

## Schematics CLI

Schematics 有自己的命令列工具。
使用 Node 6.9 以上版本全域安裝 Schematics CLI。

<code-example format="shell" language="shell">

npm install -g @angular-devkit/schematics-cli

</code-example>

這會安裝 `schematics` 可執行檔，你可以用它建立一個新的原理圖[集合][AioGuideGlossaryCollection]，其中包含初始的具名原理圖。
集合目錄是原理圖的工作區。
你也可以使用 `schematics` 命令將新的原理圖加入現有集合，或擴充現有的原理圖。

## 限定範圍套件（scoped package）

一種將相關的 [npm 套件][AioGuideNpmPackages]分組的方式。
NgModule 會在限定範圍套件中提供，其名稱以 Angular 的*範圍名稱* `@angular` 開頭。
例如 `@angular/core`、`@angular/common`、`@angular/forms` 與 `@angular/router`。

匯入限定範圍套件的方式與匯入一般套件相同。

<code-example path="architecture/src/app/app.component.ts" header="architecture/src/app/app.component.ts (import)" region="import"></code-example>

<a id="server-side-rendering"></a>
## 伺服器端渲染（server-side rendering）

一種在伺服器上產生靜態應用程式頁面的技術，並可回應瀏覽器的請求產生與提供這些頁面。
它也可以預先產生頁面為 HTML 檔案，稍後再提供。

這項技術可以改善行動裝置與低效能裝置的效能，並在用戶端應用程式載入期間快速顯示靜態首頁，改善使用者體驗。
靜態版本也可以讓你的應用程式更容易被網路爬蟲看見。

你可以使用 [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] 執行 [Angular Universal][AioGuideGlossaryUniversal] 工具，搭配 `@nguniversal/express-engine` [原理圖][AioGuideGlossarySchematic]，輕鬆為應用程式準備伺服器端渲染。

## 服務（service）

在 Angular 中，指具有 [@Injectable()][AioGuideGlossaryInjectable] 裝飾器、封裝可跨應用程式重複使用的非 UI 邏輯與程式碼的類別。
Angular 區分元件與服務，以提高模組化與可重複使用性。

`@Injectable()` 中繼資料讓服務類別可以搭配[依賴注入][AioGuideGlossaryDependencyInjectionDi]機制使用。
可注入類別由[提供者][AioGuideGlossaryProvider]具現化。
[注入器][AioGuideGlossaryInjector]會維護提供者清單，並在元件或其他服務需要時使用它們提供服務執行個體。

詳見[服務與依賴注入簡介][AioGuideArchitectureServices]。

## 獨立（standalone）

[元件][AioGuideGlossaryComponent]、[指令][AioGuideGlossaryDirective] 與[管道][AioGuideGlossaryPipe]的一種設定，表示此類別可以直接匯入，不需要在任何 [NgModule][AioGuideGlossaryNgmodule] 中宣告。

獨立元件、指令與管道與非獨立類別的不同之處在於：
 - 裝飾器的 `standalone` 欄位設為 `true`。
 - 可以直接匯入，不需要經過 NgModule。
 - 直接在裝飾器中指定其依賴。

詳見[獨立元件指南][AioGuideStandalone]。

## 結構指令（structural directive）

一類[指令][AioGuideGlossaryDirective]，負責透過修改 DOM 來塑造 HTML 版面配置。
修改 DOM 包括加入、移除或操作元素及其相關子元素。

詳見[結構指令][AioGuideStructuralDirectives]。

## 訂閱者（subscriber）

定義如何取得或產生要發布的值或訊息的函式。
當消費者執行[可觀察物件][AioGuideGlossaryObservable]的 `subscribe()` 方法時，就會執行此函式。

訂閱可觀察物件會觸發其執行、將回呼函式與其關聯，並建立一個 `Subscription` 物件，讓你可以取消訂閱。

`subscribe()` 方法接受一個 [觀察者][AioGuideGlossaryObserver] JavaScript 物件，其中最多有三個回呼函式，分別對應可觀察物件可以傳遞的每種通知類型。

*   `next` 通知會傳送一個值，例如數字、字串或物件。
*   `error` 通知會傳送 JavaScript 錯誤或例外。
*   `complete` 通知不會傳送值，但方法完成時會執行處理常式。
    方法完成後仍可繼續傳回排程的值。

## 目標（target）

[專案][AioGuideGlossaryProject]中可建置或可執行的子集，設定為[工作區設定檔][AioGuideWorkspaceConfigProjectToolConfigurationOptions]中的物件，並由 [Architect][AioGuideGlossaryArchitect] [建置器][AioGuideGlossaryBuilder]執行。

在 `angular.json` 檔案中，每個專案都有一個 "architect" 區段，其中包含設定建置器的目標。
其中一些目標對應於 Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 命令，例如 `build`、`serve`、`test` 與 `lint`。

例如，`ng build` 命令叫用的 Architect 建置器會使用特定的建置工具來編譯專案，並具有預設設定，其值可以在命令列上覆寫。
`build` 目標也為「development」建置定義了替代設定，你可以在 `build` 命令上使用 `--configuration development` 旗標叫用。

Architect 工具提供一組建置器。
Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 的 [`ng new`][AioCliNew] 命令為初始應用程式專案提供一組目標。
[`ng generate application`][AioCliGenerateApplication] 與 [`ng generate library`][AioCliGenerateLibrary] Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 命令為每個新的[專案][AioGuideGlossaryProject]提供一組目標。
這些目標、選項與設定可以自訂以滿足專案的需求。
例如，你可能想為專案的 "build" 目標加入 "staging" 或 "testing" 設定。

你也可以定義自訂建置器，並將使用自訂建置器的目標加入專案設定。
然後你可以使用 Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 的 [`ng run`][AioCliRun] 命令執行該目標。

## 範本（template）

定義如何渲染元件[檢視][AioGuideGlossaryView]的程式碼。

範本結合純 HTML 與 Angular [資料繫結][AioGuideGlossaryDataBinding]語法、[指令][AioGuideGlossaryDirective]與[範本運算式][AioGuideGlossaryTemplateExpression]（邏輯結構）。
Angular 元素會在頁面顯示之前插入或計算值，以修改 HTML 元素。
在[範本語法][AioGuideTemplateSyntax]指南中進一步了解 Angular 範本語言。

範本透過 `@Component()` [裝飾器][AioGuideGlossaryDecoratorDecoration]與[元件類別][AioGuideGlossaryComponent]關聯。
範本程式碼可以行內提供，作為 `template` 屬性的值，或放在透過 `templateUrl` 屬性連結的獨立 HTML 檔案中。

以 `TemplateRef` 物件表示的其他範本，可以定義替代或*內嵌*檢視，供多個元件參照。

## 範本驅動表單（template-driven forms）

一種使用檢視中的 HTML 表單與輸入元素建置 Angular 表單的格式。
另一種格式使用[反應式表單][AioGuideGlossaryReactiveForms]框架。

使用範本驅動表單時：

*   「唯一真相來源」是範本。
    驗證是使用個別輸入元素上的屬性來定義的。

*   使用 `ngModel` 的[雙向繫結][AioGuideGlossaryDataBinding]可讓元件模型與使用者在輸入元素中的輸入保持同步。
*   在幕後，Angular 會為每個輸入元素建立新的控制項，前提是你已為每個輸入設定 `name` 屬性與雙向繫結。
*   相關的 Angular 指令以 `ng` 為前綴，例如 `ngForm`、`ngModel` 與 `ngModelGroup`。

另一種選擇是反應式表單。
關於兩種表單方法的介紹與比較，請參閱 [Angular 表單簡介][AioGuideFormsOverview]。

## 範本運算式（template expression）

一種類似 TypeScript 的語法，Angular 會在[資料繫結][AioGuideGlossaryDataBinding]中對其求值。

<!--todo: have Alex review this -->
<!-- 閱讀 [插值][AioGuideInterpolation]指南中[範本運算式][AioGuideInterpolationTemplateExpressions]一節，了解如何撰寫範本運算式。 -->

## 範本參照變數（template reference variable）

在範本中定義的變數，用來參照與元素相關聯的執行個體，例如指令執行個體、元件執行個體、如 `TemplateRef` 的範本，或 DOM 元素。
在範本中的元素上宣告範本參照變數後，你可以在同一範本的其他位置存取該變數的值。
以下範例定義了一個名為 `#phone` 的範本參照變數。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

詳見[範本參照變數][AioGuideTemplateReferenceVariables]。

## 範本輸入變數（template input variable）

範本輸入變數是可以在範本的單一執行個體中參照的變數。
你使用 `let` 關鍵字宣告範本輸入變數，例如 `let customer`。

<code-example format="html" language="html">

&lt;tr *ngFor="let customer of customers;"&gt;
    &lt;td&gt;{{customer.customerNo}}&lt;/td&gt;
    &lt;td&gt;{{customer.name}}&lt;/td&gt;
    &lt;td&gt;{{customer.address}}&lt;/td&gt;
    &lt;td&gt;{{customer.city}}&lt;/td&gt;
    &lt;td&gt;{{customer.state}}&lt;/td&gt;
    &lt;button (click)="selectedCustomer=customer"&gt;Select&lt;/button&gt;
&lt;/tr&gt;

</code-example>

閱讀並進一步了解[範本輸入變數][AioGuideTemplateReferenceVariablesTemplateInputVariable]。

## 權杖（token）

用於高效率表格查詢的不透明識別碼。
在 Angular 中，[DI 權杖][AioGuideGlossaryDiToken]用於在[依賴注入][AioGuideGlossaryDependencyInjectionDi]系統中尋找依賴的[提供者][AioGuideGlossaryProvider]。

## 轉譯（transpile）

將某個版本的 JavaScript 轉換為另一個版本的翻譯過程；例如，將 ES2015 降級為較舊的 ES5 版本。

## 樹狀結構（tree）

在[原理圖][AioGuideGlossarySchematic]中，指以 `Tree` 類別表示的虛擬檔案系統。
原理圖[規則][AioGuideGlossaryRule]接受樹狀結構物件作為輸入，對其操作，並傳回新的樹狀結構物件。

## TypeScript

一種以 JavaScript 為基礎的程式語言，以其可選的型別系統著稱。
TypeScript 提供編譯時期型別檢查與強大的工具支援。
型別檢查與工具支援包括程式碼自動完成、重構、行內文件與智慧搜尋。
許多程式碼編輯器與 IDE 原生支援 TypeScript，或透過外掛程式支援。

TypeScript 是 Angular 開發的首選語言。
詳見 [typescriptlang.org][TypescriptlangMain]。

## TypeScript 設定檔（TypeScript configuration file）

指定編譯 TypeScript 專案所需的根檔案與編譯器選項的檔案。
詳見 [TypeScript 設定][AioGuideTypescriptConfiguration]。

## 單向資料流（unidirectional data flow）

一種資料流模型，其中元件樹總是沿著從父元件到子元件的單一方向檢查變更，可防止變更偵測圖中出現循環。

實際上，這表示 Angular 中的資料在變更偵測期間會向下流動。
父元件可以輕易變更其子元件中的值，因為父元件會先被檢查。
然而，如果子元件在變更偵測期間試圖變更其父元件中的值（顛倒預期的資料流），就可能發生失敗，因為父元件已經渲染完成。
在開發模式下，如果應用程式試圖這樣做，Angular 會擲出 `ExpressionChangedAfterItHasBeenCheckedError` 錯誤，而不是靜默地無法渲染新值。

為避免此錯誤，試圖進行這類變更的[生命週期掛鉤][AioGuideLifecycleHooks]方法應該觸發新一輪的變更偵測。
新一輪會沿著與之前相同的方向進行，但能成功取得新值。

## Universal

一種為 Angular 應用程式實作[伺服器端渲染][AioGuideGlossaryServerSideRendering]的工具。
與應用程式整合後，Universal 會在伺服器上產生靜態頁面並回應瀏覽器的請求提供這些頁面。
初始靜態頁面可作為快速載入的預留位置，同時完整應用程式正在準備於瀏覽器中正常執行。
詳見 [Angular Universal：伺服器端渲染][AioGuideUniversal]。

<a id="view"></a>
## 檢視（view）

可以一起建立與銷毀的最小顯示元素群組。
Angular 會在一個或多個[指令][AioGuideGlossaryDirective]的控制下渲染檢視。

[元件][AioGuideGlossaryComponent]類別及其相關聯的[範本][AioGuideGlossaryTemplate]定義一個檢視。
檢視具體由與元件相關聯的 `ViewRef` 執行個體表示。
直接屬於元件的檢視稱為*宿主檢視*。
檢視通常會收集為[檢視階層][AioGuideGlossaryViewHierarchy]。

檢視中元素的屬性可以因應使用者操作而動態變更；檢視中元素的結構（數量與順序）則不能。
你可以透過在其檢視容器中插入、移動或移除巢狀檢視來變更元素的結構。

檢視階層可以在使用者於應用程式中導覽時動態載入與卸載，通常由[路由器][AioGuideGlossaryRouter]控制。

<a id="ve"></a>

## View Engine

Angular 先前使用的編譯與渲染管線。
它已被 [Ivy][AioGuideGlossaryIvy] 取代，不再使用。
View Engine 在第 9 版棄用，並於第 13 版移除。

<a id="view-tree"></a>

<a id="view-hierarchy"></a>
## 檢視階層（view hierarchy）

一組相關檢視構成的樹狀結構，可以作為一個整體來操作。
根檢視稱為元件的*宿主檢視*。
宿主檢視是*內嵌檢視*樹的根，這些內嵌檢視收集於附加在宿主元件中錨點元素上的 `ViewContainerRef` 檢視容器中。
檢視階層是 Angular [變更偵測][AioGuideGlossaryChangeDetection]的關鍵部分。

檢視階層並不意味著元件階層。
內嵌於特定階層脈絡中的檢視，可以是其他元件的宿主檢視。
這些元件可以與宿主元件位於同一個 NgModule，或屬於其他 NgModule。

## Web 元件（web component）

見[自訂元素][AioGuideGlossaryCustomElement]。

## 工作區（workspace）

由 Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 驅動的一組 Angular [專案][AioGuideGlossaryProject]（也就是應用程式與程式庫），通常共同位於單一原始碼控制儲存庫（例如 [git][GitScmMain]）中。

Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 的 [`ng new`][AioCliNew] 命令會建立檔案系統目錄（「工作區根目錄」）。
在工作區根目錄中，它還會建立工作區[設定檔][AioGuideGlossaryConfiguration]（`angular.json`），預設也會建立一個同名的初始應用程式專案。

建立或操作應用程式與程式庫的命令（例如 `add` 與 `generate`）必須在工作區目錄內執行。
詳見[工作區設定][AioGuideWorkspaceConfig]。

## 工作區設定（workspace configuration）

位於 Angular [工作區][AioGuideGlossaryWorkspace]根層級、名為 `angular.json` 的檔案，為由 Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 提供或與其整合的建置與開發工具，提供工作區範圍與專案專屬的設定預設值。
詳見[工作區設定][AioGuideWorkspaceConfig]。

其他專案專屬設定檔由工具使用，例如 `package.json` 用於 [npm 套件管理員][AioGuideGlossaryNpmPackage]、`tsconfig.json` 用於 [TypeScript 轉譯][AioGuideGlossaryTranspile]，以及 `tslint.json` 用於 [TSLint][GithubPalantirTslint]。
詳見[工作區與專案檔案結構][AioGuideFileStructure]。

## 區域（zone）

一組非同步工作的執行脈絡。
對於除錯、效能分析與測試包含非同步操作（例如事件處理、Promise 與遠端伺服器呼叫）的應用程式很有用。

Angular 應用程式在一個區域中執行，可以透過檢查資料變更並解析[資料繫結][AioGuideGlossaryDataBinding]來更新顯示的資訊，以回應非同步事件。

區域用戶端可以在非同步操作完成之前與之後採取行動。

在這支 [Brian Ford 影片][YoutubeWatchV3iqtmusceU]中進一步了解區域。

<!-- vale Angular.Google_Headings = YES -->

<!-- links -->

[AioApiCommonDatepipe]: api/common/DatePipe "DatePipe | @angular/common - API | Angular"

[AioApiCoreChangedetectorref]: api/core/ChangeDetectorRef "ChangeDetectorRef | @angular/core - API | Angular"

[AioApiCoreProvider]: api/core/Provider "Provider | @angular/core - API | Angular"

[AioApiPlatformBrowserBrowsermodule]: api/platform-browser/BrowserModule "BrowserModule | @angular/platform-browser - API | Angular"

[AioApiPlatformServer]: api/platform-server "@angular/platform-server | API | Angular"

[AioApiRouterResolve]: api/router/Resolve "Resolve | @angular/router - API | Angular"

[AioCliAdd]: cli/add "ng add | CLI | Angular"

[AioCliGenerate]: cli/generate "ng generate | CLI | Angular"
[AioCliGenerateApplication]: cli/generate#application "application - ng generate | CLI | Angular"
[AioCliGenerateAppShell]: cli/generate#app-shell "app-shell - ng generate | CLI | Angular"
[AioCliGenerateLibrary]: cli/generate#library "library - ng generate | CLI | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliNew]: cli/new "ng new | CLI | Angular"

[AioCliRun]: cli/run "ng run | CLI | Angular"

[AioGuideAngularPackageFormat]: guide/angular-package-format "Angular Package Format | Angular"

[AioGuideAnimations]: guide/animations "Introduction to Angular animations | Angular"

[AioGuideArchitecture]: guide/architecture "Introduction to Angular concepts | Angular"

[AioGuideArchitectureServices]: guide/architecture-services "Introduction to services and dependency injection | Angular"

[AioGuideAttributeBinding]: guide/attribute-binding "Attribute binding | Angular"
[AioGuideAttributeBindingBindingToTheClassAttribute]: guide/class-binding "Class and style binding | Angular"

[AioGuideAttributeDirectives]: guide/attribute-directives "Attribute directives | Angular"

[AioGuideBootstrapping]: guide/bootstrapping "Launching your app with a root module | Angular"

[AioGuideBrowserSupport]: guide/browser-support "Browser support | Angular"

[AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]: guide/built-in-directives#使用-ngmodel-顯示與更新屬性 "Displaying and updating properties with ngModel - Built-in directives | Angular"

[AioGuideLifecycleHooks]: guide/lifecycle-hooks "Lifecycle Hooks | Angular"

[AioGuideLifecycleHooksRespondingToProjectedContentChanges]: guide/lifecycle-hooks#回應投影內容的變更 "Responding to projected content changes - Lifecycle Hooks | Angular"

[AioGuideInputsOutputs]: guide/inputs-outputs "Sharing data between child and parent directives and components | Angular"

[AioGuideCreatingLibrariesIntegratingWithTheCliUsingCodeGenerationSchematics]: guide/creating-libraries#透過程式碼產生原理圖與-cli-整合 "Integrating with the CLI using code-generation schematics - Creating libraries | Angular"

[AioGuideDependencyInjection]: guide/dependency-injection "Dependency injection in Angular | Angular"

[AioGuideElements]: guide/elements "Angular elements overview | Angular"

[AioGuideEventBinding]: guide/event-binding "Event binding | Angular"

[AioGuideForms]: guide/forms "Building a template-driven form | Angular"

[AioGuideFileStructure]: guide/file-structure "Workspace and project file structure | Angular"

[AioGuideFormsOverview]: guide/forms-overview "Introduction to forms in Angular | Angular"

[AioGuideFormValidation]: guide/form-validation "Validating form input | Angular"
[AioGuideFormValidationAddingCustomValidatorsToReactiveForms]: guide/form-validation#將自訂驗證器加入反應式表單 "Adding custom validators to reactive forms - Validating form input | Angular"
[AioGuideFormValidationAddingCustomValidatorsToTemplateDrivenForms]: guide/form-validation#將自訂驗證器加入範本驅動表單 "Adding custom validators to template-driven forms - Validating form input | Angular"

[AioGuideGlossaryA]: guide/glossary#預先編譯ahead-of-time-compilationaot "A - Glossary | Angular"
[AioGuideGlossaryAheadOfTimeAotCompilation]: guide/glossary#預先編譯ahead-of-time-compilationaot "ahead-of-time (AOT) compilation - Glossary | Angular"
[AioGuideGlossaryAngularElement]: guide/glossary#angular-元素angular-element "Angular element - Glossary | Angular"
[AioGuideGlossaryArchitect]: guide/glossary#architect "Architect - Glossary | Angular"
[AioGuideGlossaryAttributeDirective]: guide/glossary#屬性指令attribute-directive "attribute directive - Glossary | Angular"
[AioGuideGlossaryB]: guide/glossary#繫結binding "B - Glossary | Angular"
[AioGuideGlossaryBuilder]: guide/glossary#建置器builder "builder - Glossary | Angular"
[AioGuideGlossaryC]: guide/glossary#大小寫慣例case-types "C - Glossary | Angular"
[AioGuideGlossaryChangeDetection]: guide/glossary#變更偵測change-detection " change detection - Glossary | Angular"
[AioGuideGlossaryClassDecorator]: guide/glossary#類別裝飾器class-decorator "class decorator - Glossary | Angular"
[AioGuideGlossaryClassFieldDecorator]: guide/glossary#類別欄位裝飾器class-field-decorator "class field decorator - Glossary | Angular"
[AioGuideGlossaryCollection]: guide/glossary#集合collection "collection - Glossary | Angular"
[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#命令列介面command-line-interfacecli "command-line interface (CLI) - Glossary | Angular"
[AioGuideGlossaryComponent]: guide/glossary#元件component "component - Glossary | Angular"
[AioGuideGlossaryConfiguration]: guide/glossary#設定configuration "configuration - Glossary | Angular"
[AioGuideGlossaryCustomElement]: guide/glossary#自訂元素custom-element "custom element - Glossary | Angular"
[AioGuideGlossaryD]: guide/glossary#資料繫結data-binding "D - Glossary | Angular"
[AioGuideGlossaryDataBinding]: guide/glossary#資料繫結data-binding "data binding - Glossary | Angular"
[AioGuideGlossaryDeclarable]: guide/glossary#可宣告類別declarable "declarable - Glossary | Angular"
[AioGuideGlossaryDecoratorDecoration]: guide/glossary#裝飾器decoratordecoration "decorator | decoration - Glossary | Angular"
[AioGuideGlossaryDependencyInjectionDi]: guide/glossary#依賴注入dependency-injectiondi "dependency injection (DI) - Glossary | Angular"
[AioGuideGlossaryDirective]: guide/glossary#指令directive "directive - Glossary | Angular"
[AioGuideGlossaryDiToken]: guide/glossary#di-權杖di-token "DI token - Glossary | Angular"
[AioGuideGlossaryDynamicComponentLoading]: guide/glossary#動態元件載入dynamic-component-loading "dynamic component loading - Glossary | Angular"
[AioGuideGlossaryE]: guide/glossary#積極載入eager-loading "E - Glossary | Angular"
[AioGuideGlossaryEagerLoading]: guide/glossary#積極載入eager-loading "eager loading - Glossary | Angular"
[AioGuideGlossaryEcmascript]: guide/glossary#ecmascript "ECMAScript - Glossary | Angular"
[AioGuideGlossaryF]: guide/glossary#表單控制項form-control "F - Glossary | Angular"
[AioGuideGlossaryG]: guide/glossary#不可變性immutability "G - Glossary | Angular"
[AioGuideGlossaryH]: guide/glossary#不可變性immutability "H - Glossary | Angular"
[AioGuideGlossaryI]: guide/glossary#不可變性immutability "I - Glossary | Angular"
[AioGuideGlossaryInjectable]: guide/glossary#可注入injectable "injectable - Glossary | Angular"
[AioGuideGlossaryInjector]: guide/glossary#注入器injector "injector - Glossary | Angular"
[AioGuideGlossaryInput]: guide/glossary#輸入input "input - Glossary | Angular"
[AioGuideGlossaryIvy]: guide/glossary#ivy "Ivy - Glossary | Angular"
[AioGuideGlossaryJ]: guide/glossary#javascript "J - Glossary | Angular"
[AioGuideGlossaryJustInTimeJitCompilation]: guide/glossary#即時編譯just-in-time-compilationjit "just-in-time (JIT) compilation - Glossary | Angular"
[AioGuideGlossaryK]: guide/glossary#延遲載入lazy-loading "K - Glossary | Angular"
[AioGuideGlossaryL]: guide/glossary#延遲載入lazy-loading "L - Glossary | Angular"
[AioGuideGlossaryLazyLoading]: guide/glossary#延遲載入lazy-loading "lazy loading - Glossary | Angular"
[AioGuideGlossaryLibrary]: guide/glossary#程式庫library "library - Glossary | Angular"
[AioGuideGlossaryM]: guide/glossary#模組module "M - Glossary | Angular"
[AioGuideGlossaryModule]: guide/glossary#模組module "module - Glossary | Angular"
[AioGuideGlossaryN]: guide/glossary#ngmodule "N - Glossary | Angular"
[AioGuideGlossaryNgmodule]: guide/glossary#ngmodule "NgModule - Glossary | Angular"
[AioGuideGlossaryNpmPackage]: guide/glossary#npm-套件 "npm package - Glossary | Angular"
[AioGuideGlossaryO]: guide/glossary#可觀察物件observable "O - Glossary | Angular"
[AioGuideGlossaryObservable]: guide/glossary#可觀察物件observable "observable - Glossary | Angular"
[AioGuideGlossaryObserver]: guide/glossary#觀察者observer "observer - Glossary | Angular"
[AioGuideGlossaryOutput]: guide/glossary#輸出output "output - Glossary | Angular"
[AioGuideGlossaryP]: guide/glossary#管道pipe "P - Glossary | Angular"
[AioGuideGlossaryPipe]: guide/glossary#管道pipe "pipe - Glossary | Angular"
[AioGuideGlossaryProject]: guide/glossary#專案project "project - Glossary | Angular"
[AioGuideGlossaryProvider]: guide/glossary#提供者provider "provider - Glossary | Angular"
[AioGuideGlossaryQ]: guide/glossary#反應式表單reactive-forms "Q - Glossary | Angular"
[AioGuideGlossaryR]: guide/glossary#反應式表單reactive-forms "R - Glossary | Angular"
[AioGuideGlossaryReactiveForms]: guide/glossary#反應式表單reactive-forms "reactive forms - Glossary | Angular"
[AioGuideGlossaryRouteGuard]: guide/glossary#路由守衛route-guard "route guard - Glossary | Angular"
[AioGuideGlossaryRouter]: guide/glossary#路由器router "router - Glossary | Angular"
[AioGuideGlossaryRoutingComponent]: guide/glossary#路由元件routing-component "routing component - Glossary | Angular"
[AioGuideGlossaryRule]: guide/glossary#規則rule "rule - Glossary | Angular"
[AioGuideGlossaryS]: guide/glossary#原理圖schematic "S - Glossary | Angular"
[AioGuideGlossarySchematic]: guide/glossary#原理圖schematic "schematic - Glossary | Angular"
[AioGuideGlossarySchematicsCli]: guide/glossary#schematics-cli "Schematics CLI - Glossary | Angular"
[AioGuideGlossaryScopedPackage]: guide/glossary#限定範圍套件scoped-package "scoped package - Glossary | Angular"
[AioGuideGlossaryServerSideRendering]: guide/glossary#伺服器端渲染server-side-rendering "server-side rendering - Glossary | Angular"
[AioGuideGlossaryService]: guide/glossary#服務service "service - Glossary | Angular"
[AioGuideGlossaryStandalone]: guide/glossary#獨立standalone "standalone - Glossary | Angular"
[AioGuideGlossaryStructuralDirective]: guide/glossary#結構指令structural-directive "structural directive - Glossary | Angular"
[AioGuideGlossarySubscriber]: guide/glossary#訂閱者subscriber "subscriber - Glossary | Angular"
[AioGuideGlossaryT]: guide/glossary#目標target "T - Glossary | Angular"
[AioGuideGlossaryTarget]: guide/glossary#目標target "target - Glossary | Angular"
[AioGuideGlossaryTemplate]: guide/glossary#範本template "template - Glossary | Angular"
[AioGuideGlossaryTemplateDrivenForms]: guide/glossary#範本驅動表單template-driven-forms "template-driven forms - Glossary | Angular"
[AioGuideGlossaryTemplateExpression]: guide/glossary#範本運算式template-expression "template expression - Glossary | Angular"
[AioGuideGlossaryToken]: guide/glossary#權杖token "token - Glossary | Angular"
[AioGuideGlossaryTranspile]: guide/glossary#轉譯transpile "transpile - Glossary | Angular"
[AioGuideGlossaryTree]: guide/glossary#樹狀結構tree "tree - Glossary | Angular"
[AioGuideGlossaryTypescript]: guide/glossary#typescript "TypeScript - Glossary | Angular"
[AioGuideGlossaryU]: guide/glossary#單向資料流unidirectional-data-flow "U - Glossary | Angular"
[AioGuideGlossaryUniversal]: guide/glossary#universal "Universal - Glossary | Angular"
[AioGuideGlossaryV]: guide/glossary#檢視view "V - Glossary | Angular"
[AioGuideGlossaryView]: guide/glossary#檢視view "view - Glossary | Angular"
[AioGuideGlossaryViewHierarchy]: guide/glossary#檢視階層view-hierarchy "view hierarchy - Glossary | Angular"
[AioGuideGlossaryW]: guide/glossary#web-元件web-component "W - Glossary | Angular"
[AioGuideGlossaryWorkspace]: guide/glossary#工作區workspace "workspace - Glossary | Angular"
[AioGuideGlossaryWorkspaceConfig]: guide/glossary#工作區設定workspace-configuration "workspace configuration - Glossary | Angular"
[AioGuideGlossaryX]: guide/glossary#區域zone "X - Glossary | Angular"
[AioGuideGlossaryY]: guide/glossary#區域zone "Y - Glossary | Angular"
[AioGuideGlossaryZ]: guide/glossary#區域zone "Z - Glossary | Angular"

[AioGuideHierarchicalDependencyInjection]: guide/hierarchical-dependency-injection "Hierarchical injectors | Angular"

[AioGuideInterpolation]: guide/interpolation "Text interpolation | Angular"

<!-- [AioGuideInterpolationTemplateExpressions]: guide/interpolation#template-expressions "Template expressions - Text interpolation | Angular" -->

[AioGuideNgmodules]: guide/ngmodules "NgModules | Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

[AioGuideObservables]: guide/observables "Using observables to pass values | Angular"

[AioGuidePipes]: guide/pipes "Transforming Data Using Pipes | Angular"

[AioGuidePropertyBinding]: guide/property-binding "Property binding | Angular"

[AioGuideRouter]: guide/router "Common Routing Tasks | Angular"
[AioGuideRouterPreventingUnauthorizedAccess]: guide/router#防止未經授權的存取 "Preventing unauthorized access - Common Routing Tasks | Angular"

[AioGuideRouterTutorialTohResolvePreFetchingComponentData]: guide/router-tutorial-toh#resolve預先擷取元件資料 "Resolve: pre-fetching component data - Router tutorial: tour of heroes | Angular"

[AioGuideSchematics]: guide/schematics "Generating code using schematics | Angular"

[AioGuideServiceWorkerIntro]: guide/service-worker-intro "Angular service worker introduction | Angular"

[AioGuideSetupLocal]: guide/setup-local "Setting up the local environment and workspace | Angular"

[AioGuideStandalone]: guide/standalone-components "Getting started with standalone components | Angular"

[AioGuideStructuralDirectives]: guide/structural-directives "Structural directives | Angular"

[AioGuideStyleguide0201]: guide/styleguide#02-01 "Style 02-01 - Angular coding style guide | Angular"

[AioGuideTemplateReferenceVariables]: guide/template-reference-variables "Template variables | Angular"
[AioGuideTemplateReferenceVariablesTemplateInputVariable]: guide/template-reference-variables#範本輸入變數 "Template input variable - Template variables | Angular"

[AioGuideTemplateSyntax]: guide/template-syntax "Template syntax | Angular"

[AioGuideTypescriptConfiguration]: guide/typescript-configuration "TypeScript configuration | Angular"

[AioGuideUniversal]: guide/universal "Server-side rendering (SSR) with Angular Universal | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"
[AioGuideWorkspaceConfigProjectToolConfigurationOptions]: guide/workspace-config#專案工具設定選項 "Project tool configuration options - Angular workspace configuration | Angular"

<!-- external links -->

[AngularBlogAPlanForVersion80AndIvyB3318dfc19f7]: https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7 "A plan for version 8.0 and Ivy | Angular Blog"

[GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersBrowser]: https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/build_angular/src/builders/browser "packages/angular_devkit/build_angular/src/builders/browser | angular/angular-cli | GitHub"
[GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersKarma]: https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/build_angular/src/builders/karma "packages/angular_devkit/build_angular/src/builders/karma | angular/angular-cli | GitHub"

[GithubPalantirTslint]: https://palantir.github.io/tslint "TSLint | Palantir | GitHub"

[GithubTC39ProposalDecorators]: https://github.com/tc39/proposal-decorators "tc39/proposal-decorators | GitHub"

[GitScmMain]: https://git-scm.com "Git"

[GoogleDevelopersWebFundamentalsArchitectureAppShell]: https://developers.google.com/web/fundamentals/architecture/app-shell "The App Shell Model | Web Fundamentals | Google Developers"

[JsWebpackMain]: https://webpack.js.org "webpack | JS.ORG"

[MdnDocsWebApiCustomelementregistry]: https://developer.mozilla.org/docs/Web/API/CustomElementRegistry "CustomElementRegistry | MDN"

[NpmjsDocsAboutNpm]: https://docs.npmjs.com/about-npm "About npm | npm"

[RxjsMain]: https://rxjs.dev "RxJS"

[TypescriptlangMain]: https://www.typescriptlang.org "TypeScript"

[WebDevFasterAngularChangeDetection]: https://web.dev/faster-angular-change-detection "Optimize Angular's change detection | web.dev"

[WikipediaWikiDomainSpecificLanguage]: https://en.wikipedia.org/wiki/Domain-specific_language "Domain-specific language | Wikipedia"
[WikipediaWikiEcmascript]: https://en.wikipedia.org/wiki/ECMAScript "ECMAScript | Wikipedia"

[YoutubeWatchV3iqtmusceU]: https://www.youtube.com/watch?v=3IqtmUscE_U "Brian Ford - Zones - NG-Conf 2014 | YouTube"

<!-- end links -->

@reviewed 2023-02-16
