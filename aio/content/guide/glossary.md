# 術語表

Angular 有自己的一套詞彙。
多數 Angular 術語是常見的英文單字或電腦術語，但在 Angular 系統中有特定的含義。

本術語表列出最主要的術語，以及一些較不熟悉、定義特殊或出乎意料的術語。

[A](guide/glossary#A) [B](guide/glossary#B) [C](guide/glossary#C) [D](guide/glossary#D) [E](guide/glossary#E) [F](guide/glossary#F) [G](guide/glossary#G) [H](guide/glossary#H) [I](guide/glossary#I)
[J](guide/glossary#J) [K](guide/glossary#K) [L](guide/glossary#L) [M](guide/glossary#M) [N](guide/glossary#N) [O](guide/glossary#O) [P](guide/glossary#P) [Q](guide/glossary#Q) [R](guide/glossary#R)
[S](guide/glossary#S) [T](guide/glossary#T) [U](guide/glossary#U) [V](guide/glossary#V) [W](guide/glossary#W) [X](guide/glossary#X) [Y](guide/glossary#Y) [Z](guide/glossary#Z)


{@a A}
{@a aot}


## 預先編譯（ahead-of-time compilation，AOT）

Angular 的預先編譯（AOT）編譯器會在建置階段將 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼，也就是在瀏覽器下載並執行該程式碼之前。
與[即時（JIT）編譯](guide/glossary#即時編譯（just-in-time-compilation，jit）)相比，這是生產環境的最佳編譯模式，載入時間更短、效能更高。

使用 `ngc` 命令列工具編譯應用程式時，可以直接啟動至模組工廠，因此不需要在 JavaScript 套件中包含 Angular 編譯器。

{@a angular-element}

## Angular 元素（Angular element）

包裝為[自訂元素](guide/glossary#自訂元素（custom-element）)的 Angular [元件](guide/glossary#元件（component）)。

詳見[Angular Elements 概覽](guide/elements)。

{@a annotation}

## 註解（annotation）

為類別提供中繼資料的結構。
詳見[裝飾器](guide/glossary#裝飾器（decorator、decoration）)。

{@a app-shell}

## 應用程式殼層（app-shell）

應用程式殼層是一種在建置時期使用路由渲染應用程式一部分的方式。
這能讓使用者快速看到有意義的首屏畫面，因為瀏覽器只需渲染靜態 HTML 與 CSS，不需要初始化 JavaScript。
詳見[應用程式殼層模型](https://developers.google.com/web/fundamentals/architecture/app-shell)。

你可以使用 Angular CLI 來[產生](cli/generate#appshell)應用程式殼層。
這可以在瀏覽器下載完整用戶端版本、並在程式碼載入後自動切換的同時，透過快速啟動靜態渲染頁面來改善使用者體驗。
靜態渲染頁面是所有頁面共用的骨架。
詳見 [Service Worker 與 PWA](guide/service-worker-intro)。

{@a attribute-directive}


{@a attribute-directives}


## 屬性指令（attribute directive）

一類[指令](guide/glossary#指令（directive）)，可以監聽並修改其他 HTML 元素、屬性、特性與元件的行為。
它們通常以 HTML 屬性的形式呈現，因此得名。

詳見[屬性指令](guide/attribute-directives)。


{@a B}

{@a binding}

## 繫結（binding）

一般而言，是將變數或屬性設定為資料值的作法。
在 Angular 中，通常指[資料繫結](guide/glossary#資料繫結（data-binding）)，也就是協調 DOM 物件屬性與資料物件屬性。

有時也指[依賴注入](guide/glossary#依賴注入（dependency-injection，di）)中[權杖](guide/glossary#權杖（token）)與依賴[提供者](guide/glossary#提供者（provider）)之間的繫結。

{@a bootstrap}

## 啟動（bootstrap）

初始化並啟動應用程式或系統的方式。

在 Angular 中，應用程式的根 NgModule `AppModule` 具有 `bootstrap` 屬性，用來指定應用程式最上層的[元件](guide/glossary#元件（component）)。
在啟動過程中，Angular 會建立這些元件並插入 `index.html` 宿主網頁。
你可以在同一個 `index.html` 中啟動多個應用程式。
每個應用程式都有自己的元件。

詳見[啟動](guide/bootstrapping)。

{@a C}

{@a case-conventions}
{@a dash-case}
{@a camelcase}
{@a kebab-case}

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

{@a class-decorator}

## 類別裝飾器（class decorator）

緊接在類別定義之前出現的[裝飾器](guide/glossary#裝飾器（decorator、decoration）)，用來宣告該類別屬於指定類型，並提供適合該類型的中繼資料。

以下裝飾器可以宣告 Angular 類別類型。

*   `@Component()`
*   `@Directive()`
*   `@Pipe()`
*   `@Injectable()`
*   `@NgModule()`


{@a class-field-decorator}

## 類別欄位裝飾器（class field decorator）

緊接在類別定義中某個欄位之前的[裝飾器](guide/glossary#裝飾器（decorator、decoration）)陳述式，用來宣告該欄位的類型。
例如 `@Input` 與 `@Output`。

{@a collection}

## 集合（collection）

在 Angular 中，指收集於某個 [npm 套件](#npm-package)中的一組相關[原理圖](#schematic)。

{@a cli}

## 命令列介面（command-line interface，CLI）

[Angular CLI](cli) 是管理 Angular 開發週期的命令列工具。
用它為[工作區](guide/glossary#工作區（workspace）)或[專案](guide/glossary#專案（project）)建立初始檔案系統骨架，並執行[原理圖](guide/glossary#原理圖（schematic）)，為各種元素的初始通用版本加入與修改程式碼。
Angular CLI 支援開發週期的所有階段，包括建置、測試、打包與部署。

*   若要開始在新專案中使用 CLI，請參閱[入門](guide/quickstart)。
*   若要進一步了解 Angular CLI 的完整功能，請參閱 [Angular CLI 命令參考](cli)。

另見 [Schematics CLI](#schematics-cli)。

{@a component}

## 元件（component）

具有 `@Component()` [裝飾器](guide/glossary#裝飾器（decorator、decoration）)的類別，裝飾器會將其與伴隨的[範本](guide/glossary#範本（template）)關聯。
元件與範本共同定義一個[檢視](guide/glossary#檢視（view）)。
元件是一種特殊的[指令](guide/glossary#指令（directive）)。
`@Component()` 裝飾器以範本導向的功能擴充了 `@Directive()` 裝飾器。

Angular 元件類別負責透過[資料繫結](guide/glossary#資料繫結（data-binding）)公開資料，並處理檢視的大多數顯示與使用者互動邏輯。

在[架構總覽](guide/architecture)中進一步了解元件、範本與檢視。

{@a custom-element}

## 自訂元素（custom element）

Web 平台功能，目前大多數瀏覽器都支援，其他瀏覽器可透過 polyfill 使用。
見[瀏覽器支援](guide/browser-support)。

自訂元素功能擴充了 HTML，讓你可以定義標籤，其內容由 JavaScript 程式碼建立與控制。
當自訂元素加入 [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) 時，瀏覽器便能識別它。
自訂元素也稱為 *Web 元件*。

你可以使用 API 轉換 Angular 元件，使其能向瀏覽器註冊，並在 Angular 應用程式中直接加入 DOM 的任何 HTML 中使用。
自訂元素標籤會將元件的檢視，連同變更偵測與資料繫結功能，插入原本不經 Angular 處理就會顯示的內容中。
另見[動態元件載入](guide/glossary#動態元件載入（dynamic-component-loading）)。


{@a D}

{@a data-binding}

## 資料繫結（data binding）

讓應用程式能向使用者顯示資料值並回應使用者操作的流程。
使用者操作包括點選、觸控、按鍵等。

在資料繫結中，你宣告 HTML 元件與資料來源之間的關係，讓框架處理細節。
資料繫結可取代手動將應用程式資料值推入 HTML、附加事件監聽器、從畫面擷取變更後的值、再更新應用程式資料值的做法。

請在[範本語法](guide/template-syntax)中閱讀以下幾種繫結形式：

*   [插值](guide/template-syntax#interpolation)
*   [屬性繫結](guide/template-syntax#property-binding)
*   [事件繫結](guide/template-syntax#event-binding)
*   [屬性繫結](guide/template-syntax#屬性繫結（attribute-binding）)
*   [類別繫結](guide/template-syntax#類別繫結)
*   [樣式繫結](guide/template-syntax#樣式繫結)
*   [使用 ngModel 的雙向資料繫結](guide/template-syntax#ngModel)

{@a declarable}

## 可宣告類別（declarable）

可以加入 [NgModule](guide/glossary#ngmodule) 的 `declarations` 清單中的類別類型。
你可以宣告[元件](guide/glossary#元件（component）)、[指令](guide/glossary#指令（directive）) 與[管道](guide/glossary#管道（pipe）)。

請勿宣告以下項目：

*   已在另一個 NgModule 中宣告的類別
*   從其他套件匯入的指令陣列。
    例如，請勿宣告來自 `@angular/forms` 的 `FORMS_DIRECTIVES`

*   NgModule 類別
*   服務類別
*   非 Angular 的類別與物件，例如字串、數字、函式、實體模型、設定、商業邏輯與輔助類別


{@a decorator}

{@a decoration}

## 裝飾器（decorator、decoration）

修改類別或屬性定義的函式。
裝飾器是實驗性（第 2 階段）的 [JavaScript 語言功能](https://github.com/wycats/javascript-decorators)。
裝飾器也稱為*註解*。
TypeScript 加入了對裝飾器的支援。

Angular 定義了裝飾器，將中繼資料附加到類別或屬性上，讓框架知道這些類別或屬性的含義與運作方式。

詳見[類別裝飾器](guide/glossary#類別裝飾器（class-decorator）)。
另見[類別欄位裝飾器](guide/glossary#類別欄位裝飾器（class-field-decorator）)。

{@a di}

{@a dependency-injection}

## 依賴注入（dependency injection，DI）

一種設計模式與機制，用來建立應用程式的某些部分（依賴）並交付給需要它們的其他部分。

在 Angular 中，依賴通常是服務，但也可以是值，例如字串或函式。
應用程式的[注入器](guide/glossary#注入器（injector）)（在啟動期間自動建立）會在需要時，使用已設定的服務或值的[提供者](guide/glossary#提供者（provider）)來具現化依賴。
詳見 [Angular 的依賴注入](guide/dependency-injection)。

{@a di-token}

## DI 權杖（DI token）

與依賴[提供者](guide/glossary#提供者（provider）)相關聯的查詢權杖，供[依賴注入](guide/glossary#依賴注入（dependency-injection，di）)系統使用。


{@a directive}
{@a directives}

## 指令（directive）

可以修改 DOM 結構，或修改 DOM 中的屬性與元件資料模型的類別。
指令類別定義之前緊接著 `@Directive()` [裝飾器](guide/glossary#裝飾器（decorator、decoration）)，用來提供中繼資料。

指令類別通常與 HTML 元素或屬性相關聯，而該元素或屬性常被直接稱為指令本身。
當 Angular 在 HTML [範本](guide/glossary#範本（template）)中找到指令時，會建立對應的指令類別執行個體，並將瀏覽器 DOM 該部分的控制權交給它。

Angular 有三種指令：

*   [元件](guide/glossary#元件（component）)使用 `@Component()` 將範本與類別關聯。
    `@Component()` 是 `@Directive()` 的擴充。

*   [屬性指令](guide/glossary#屬性指令（attribute-directive）)會修改頁面元素的行為與外觀。
*   [結構指令](guide/glossary#結構指令（structural-directive）)會修改 DOM 的結構。

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

## 動態元件載入（dynamic component loading）

在執行時期將元件加入 DOM 的技術。
這需要將元件排除在編譯之外，然後在加入 DOM 時，將其連接至 Angular 的變更偵測與事件處理框架。

另見[自訂元素](guide/glossary#自訂元素（custom-element）)，它以更簡單的方式達到相同的結果。


{@a E}

{@a eager-loading}

## 積極載入（eager loading）

在啟動時載入的 NgModule 或元件稱為積極載入，以區別於在執行時期載入、稱為延遲載入的項目。
另見[延遲載入](guide/glossary#延遲載入（lazy-loading）)。


{@a ecma}

## ECMAScript

[官方 JavaScript 語言規範](https://en.wikipedia.org/wiki/ECMAScript)。

並非所有瀏覽器都支援最新的 ECMAScript 標準，但你可以使用[轉譯器](guide/glossary#轉譯（transpile）)（例如 [TypeScript](guide/glossary#typescript)），以最新功能撰寫程式碼，再轉譯為可在瀏覽器支援版本上執行的程式碼。
詳見[瀏覽器支援](guide/browser-support)。


{@a element}

## 元素（element）

Angular 定義了 `ElementRef` 類別，用來包裝與渲染相關的原生 UI 元素。
在大多數情況下，這讓你可以使用 Angular 範本與資料繫結來存取 DOM 元素，而不需要參照原生元素。

文件一般將*元素*與 *DOM 元素*區分開來。
*元素*是 `ElementRef` 類別的執行個體。
*DOM 元素*在必要時可以直接存取。

詳見[自訂元素](guide/glossary#自訂元素（custom-element）)。

{@a entry-point}

## 進入點（entry point）

一個 JavaScript 符號，讓 [npm 套件](guide/npm-packages) 的部分內容可供其他程式碼匯入。
Angular 的[限定範圍套件](guide/glossary#限定範圍套件（scoped-package）)各自有一個進入點，名為 `index`。
在 Angular 內部，使用 [NgModule](guide/glossary#ngmodule) 讓公開部分可供其他 NgModule 匯入。


{@a F}

{@a form-control}

## 表單控制項（form control）

`FormControl` 的執行個體，是 Angular 表單的基本組成單位。
它與 `FormGroup` 與 `FormArray` 一起追蹤表單輸入元素的值、驗證與狀態。

在 [Angular 表單簡介](guide/forms-overview)中進一步了解表單。

{@a form-model}

## 表單模型（form model）

在特定時間點，表單輸入元素的值與驗證狀態的「唯一真相來源」。
使用[反應式表單](guide/glossary#反應式表單（reactive-forms）)時，表單模型會在元件類別中明確建立。
使用[範本驅動表單](guide/glossary#範本驅動表單（template-driven-forms）)時，表單模型會由指令隱含建立。

在 [Angular 表單簡介](guide/forms-overview)中進一步了解反應式與範本驅動表單。

{@a form-validation}

## 表單驗證（form validation）

在表單值變更時執行的檢查，會依定義的約束回報給定的值是否正確且完整。
反應式表單會套用[驗證器函式](guide/form-validation#加入反應式表單)。
範本驅動表單使用[驗證器指令](guide/form-validation#加入範本驅動表單)。

詳見[表單驗證](guide/form-validation)。

{@a G}


{@a H}

{@a I}


{@a immutability}

## 不可變性（immutability）

值在建立後無法變更其狀態的特性。
[反應式表單](guide/glossary#反應式表單（reactive-forms）)會執行不可變變更，也就是每次資料模型的變更都會產生新的資料模型，而不是修改現有的模型。
[範本驅動表單](guide/glossary#範本驅動表單（template-driven-forms）)則使用 `NgModel` 與[雙向資料繫結](guide/glossary#資料繫結（data-binding）)執行可變變更，直接修改現有的資料模型。

{@a injectable}

## 可注入（injectable）

使用[依賴注入](guide/glossary#依賴注入（dependency-injection，di）)機制提供依賴的 Angular 類別或其他定義。
可注入的[服務](guide/glossary#服務（service）)類別必須以 `@Injectable()` [裝飾器](guide/glossary#裝飾器（decorator、decoration）)標記。

其他項目（例如常數值）也可以是可注入的。

{@a injector}

## 注入器（injector）

Angular [依賴注入](guide/glossary#依賴注入（dependency-injection，di）)系統中的物件，可以在其快取中找到具名的依賴，或使用已設定的[提供者](guide/glossary#提供者（provider）)建立依賴。
注入器會在啟動過程中自動為 NgModule 建立，並透過元件階層繼承。

*   注入器會提供依賴的單一執行個體，並可將同一個執行個體注入多個元件。
*   NgModule 與元件層級的注入器階層，可以為各自的元件與子元件提供依賴的不同執行個體。
*   你可以使用不同的提供者設定注入器，為相同的依賴提供不同的實作。

在[階層式依賴注入器](guide/hierarchical-dependency-injection)中進一步了解注入器階層。

{@a input}

## 輸入（input）

定義[指令](guide/glossary#指令（directive）)時，指令屬性上的 `@Input()` 裝飾器會讓該屬性成為[屬性繫結](guide/template-syntax#property-binding)的*目標*。
資料值會從等號右側[範本運算式](guide/glossary#範本運算式（template-expression）)所識別的資料來源，流入輸入屬性。

詳見[輸入與輸出屬性](guide/template-syntax#inputs-outputs)。

{@a interpolation}

## 插值（interpolation）

一種屬性[資料繫結](guide/glossary#資料繫結（data-binding）)形式，其中雙大括號之間的[範本運算式](guide/glossary#範本運算式（template-expression）)會渲染為文字。
該文字可以在指派給元素屬性或顯示於元素標籤之間之前，與相鄰文字串接，如以下範例所示。

<code-example language="html" escape="html">
  <label>My current hero is {{hero.name}}</label>
</code-example>

在[範本語法](guide/template-syntax)中進一步了解[插值](guide/template-syntax#interpolation)。


{@a J}

{@a javascript}

## JavaScript

詳見 [ECMAScript](guide/glossary#ecmascript)。
另見 [TypeScript](guide/glossary#typescript)。


{@a jit}


## 即時編譯（just-in-time compilation，JIT）

Angular 的即時（JIT）編譯器會在執行時期、作為啟動的一部分，將你的 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼。

執行 `ng build` 與 `ng serve` Angular CLI 命令時，JIT 編譯是預設值（相對於 AOT 編譯），很適合開發期間使用。
強烈不建議在生產環境使用 JIT 模式，因為它會產生龐大的應用程式承載，拖慢啟動效能。

與[預先編譯（AOT）](guide/glossary#預先編譯（ahead-of-time-compilation，aot）)比較。


{@a K}


{@a L}

{@a lazy-load}

## 延遲載入（lazy loading）

一種透過將應用程式分割為多個套件並按需載入，來加快應用程式載入時間的流程。
例如，依賴可以依需要延遲載入。
此範例與[積極載入](guide/glossary#積極載入（eager-loading）)的模組不同，後者是根模組所需的模組，在啟動時載入。

[路由器](guide/glossary#路由器（router）)利用延遲載入，只在父檢視啟用時才載入子檢視。
同樣地，你可以建置自訂元素，在需要時載入 Angular 應用程式中。

{@a library}

## 程式庫（library）

在 Angular 中，指提供功能、可納入其他 Angular 應用程式的[專案](guide/glossary#專案（project）)。
程式庫不是完整的 Angular 應用程式，無法獨立執行。


*   程式庫開發者可以使用 [Angular CLI](guide/glossary#命令列介面（command-line-interface，cli）) 在現有[工作區](guide/glossary#工作區（workspace）)中 `generate` 新程式庫的骨架，並將程式庫發布為 `npm` 套件。
*   應用程式開發者可以使用 [Angular CLI](guide/glossary#命令列介面（command-line-interface，cli）) `add` 已發布的程式庫，供同一[工作區](guide/glossary#工作區（workspace）)中的應用程式使用。

另見[原理圖](#schematic)。

{@a lifecycle-hook}

## 生命週期掛鉤（lifecycle hook）

一種介面，讓你可以在[指令](guide/glossary#指令（directive）)與[元件](guide/glossary#元件（component）)建立、更新與銷毀的生命週期中介入。

每個介面都有一個掛鉤方法，名稱為介面名稱加上 `ng` 前綴。
例如，`OnInit` 介面有一個名為 `ngOnInit` 的掛鉤方法。

Angular 依以下順序執行這些掛鉤方法：

* `ngOnChanges`：當[輸入](guide/glossary#input)/[輸出](guide/glossary#output)繫結值變更時。
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

## 模組（module）

一般而言，模組會收集專用於單一用途的一組程式碼。
Angular 使用標準 JavaScript 模組，也定義了 Angular 模組 `NgModule`。

在 JavaScript（ECMAScript）中，每個檔案都是一個模組，檔案中定義的所有物件都屬於該模組。
物件可以匯出成為公開物件，公開物件可以供其他模組匯入使用。

Angular 以 JavaScript 模組集合的形式提供。
JavaScript 模組的集合也稱為程式庫。
每個 Angular 程式庫的名稱都以 `@angular` 前綴開頭。
使用 [npm 套件管理員](https://docs.npmjs.com/getting-started/what-is-npm)安裝 Angular 程式庫，並以 JavaScript `import` 宣告匯入其中的部分內容。

與 [NgModule](guide/glossary#ngmodule) 比較。


{@a N}

{@a ngmodule}

## NgModule

以 `@NgModule()` [裝飾器](guide/glossary#裝飾器（decorator、decoration）)為前綴的類別定義，用來宣告並作為專用於應用程式領域、工作流程或密切相關功能集合的程式碼區塊的清單。

與 [JavaScript 模組](guide/glossary#模組（module）)相同，NgModule 可以匯出功能供其他 NgModule 使用，也可以從其他 NgModule 匯入公開功能。
NgModule 類別的中繼資料會收集應用程式使用的元件、指令與管道，以及匯入與匯出清單。
另見[可宣告類別](guide/glossary#可宣告類別（declarable）)。

NgModule 通常以定義匯出內容的檔案命名。
例如，Angular 的 [DatePipe](api/common/DatePipe) 類別屬於 `date_pipe.ts` 檔案中名為 `date_pipe` 的功能模組。
你可以從 `@angular/core` 這類 Angular [限定範圍套件](guide/glossary#限定範圍套件（scoped-package）)匯入它們。

每個 Angular 應用程式都有一個根模組。
依慣例，類別命名為 `AppModule`，位於名為 `app.module.ts` 的檔案中。

詳見 [NgModules](guide/ngmodules)。

{@a npm-package}

## npm 套件

[npm 套件管理員](https://docs.npmjs.com/getting-started/what-is-npm)用於發布與載入 Angular 模組與程式庫。

進一步了解 Angular 如何使用 [npm 套件](guide/npm-packages)。

{@a O}

{@a observable}

## 可觀察物件（observable）

多個值的生產者，會將值推送給[訂閱者](guide/glossary#訂閱者（subscriber）)。
用於 Angular 各處的非同步事件處理。
你可以使用 `subscribe()` 方法並傳入新值、錯誤或完成通知的回呼函式來訂閱，以執行可觀察物件。

可觀察物件可以透過以下其中一種方式，將單一值或多個任意類型的值傳遞給訂閱者。

*   同步傳遞，如同函式將值傳遞給請求者
*   排程傳遞

訂閱者會在新值產生時收到通知，也會收到正常完成或錯誤完成的通知。

Angular 使用名為 [Reactive Extensions（RxJS）](http://reactivex.io/rxjs/) 的第三方程式庫。
詳見[可觀察物件](guide/observables)。


{@a observer}

## 觀察者（observer）

傳遞給[可觀察物件](guide/glossary#可觀察物件（observable）)的 `subscribe()` 方法的物件。
該物件為[訂閱者](guide/glossary#訂閱者（subscriber）)定義回呼函式。

{@a output}

## 輸出（output）

定義[指令](guide/glossary#指令（directive）)時，指令屬性上的 `@Output{}` 裝飾器會讓該屬性成為[事件繫結](guide/template-syntax#event-binding)的*目標*。
事件會從這個屬性*流出*至等號右側[範本運算式](guide/glossary#範本運算式（template-expression）)所識別的接收者。

詳見[輸入與輸出屬性](guide/template-syntax#inputs-outputs)。


{@a P}

{@a pipe}

## 管道（pipe）

以 `@Pipe{}` 裝飾器為前綴的類別，定義一個函式，可將輸入值轉換為輸出值以顯示於[檢視](guide/glossary#檢視（view）)中。
Angular 定義了各種管道，你也可以定義新的管道。

詳見[管道](guide/pipes)。

{@a polyfill}

## Polyfill

用來填補瀏覽器 JavaScript 實作缺口的 [npm 套件](guide/npm-packages)。
見[瀏覽器支援](guide/browser-support)，了解為特定平台上的特定功能提供支援的 polyfill。

{@a project}

## 專案（project）

在 Angular 中，指[工作區](guide/glossary#工作區（workspace）)內的一個資料夾，其中包含 Angular 應用程式或[程式庫](guide/glossary#程式庫（library）)。
一個工作區可以包含多個專案。
同一個工作區中的所有應用程式都可以使用同一工作區中的程式庫。

{@a provider}

## 提供者（provider）

實作 [`Provider`](api/core/Provider) 介面之一的物件。
提供者物件定義如何取得與 [DI 權杖](guide/glossary#di-權杖（di-token）)相關聯的可注入依賴。
[注入器](guide/glossary#注入器（injector）)使用提供者為需要依賴的類別建立依賴的新執行個體。

Angular 會為其定義的服務向每個注入器註冊自己的提供者。
你可以為應用程式需要的服務註冊自己的提供者。

另見[服務](guide/glossary#服務（service）)。
另見[依賴注入](guide/glossary#依賴注入（dependency-injection，di）)。

詳見[依賴注入](guide/dependency-injection)。


{@a Q}

{@a R}

{@a reactive-forms}

## 反應式表單（reactive forms）

透過元件中的程式碼建置 Angular 表單的框架。
另一種選擇是[範本驅動表單](guide/glossary#範本驅動表單（template-driven-forms）)。

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

## 路由器（router）

在 Angular 應用程式中設定並實作狀態與[檢視](guide/glossary#檢視（view）)之間導覽的工具。

`Router` 模組是一個 [NgModule](guide/glossary#ngmodule)，提供在應用程式檢視之間導覽所需的服務提供者與指令。
[路由元件](guide/glossary#路由元件（routing-component）)是指匯入 `Router` 模組、且範本包含 `RouterOutlet` 元素以顯示路由器產生的檢視的元件。

路由器定義單一頁面內檢視之間的導覽，而非頁面之間的導覽。
它會解讀類似 URL 的連結，以決定要建立或銷毀哪些檢視，以及要載入或卸載哪些元件。
它讓你可以在 Angular 應用程式中利用[延遲載入](guide/glossary#延遲載入（lazy-loading）)。

詳見[路由與導覽](guide/router)。

{@a router-outlet}

## 路由出口（router outlet）

在路由元件範本中作為預留位置的[指令](guide/glossary#指令（directive）)。
Angular 會依目前的路由器狀態動態渲染範本。

{@a router-component}

## 路由元件（routing component）

範本中有 `RouterOutlet` 指令、會依路由器導覽顯示檢視的 Angular [元件](guide/glossary#元件（component）)。

詳見[路由與導覽](guide/router)。

{@a rule}

在[原理圖](#schematic)中，指操作[檔案樹](#file-tree)、以特定方式建立、刪除或修改檔案，並傳回一個新的 `Tree` 物件的函式。


{@a S}

{@a schematic}

## 原理圖（schematic）

一種鷹架程式庫，定義如何透過建立、修改、重構或移動檔案與程式碼，來產生或轉換程式設計專案。
原理圖定義了操作虛擬檔案系統（稱為[樹狀結構](#file-tree)）的[規則](#rule)。

[Angular CLI](guide/glossary#命令列介面（command-line-interface，cli）) 使用原理圖來產生與修改 [Angular 專案](guide/glossary#專案（project）)及專案的組成部分。

*   Angular 提供一組原理圖供 Angular CLI 使用。
    請參閱 [Angular CLI 命令參考](cli)。
    Angular CLI 的 [`ng add`](cli/add) 命令會在將程式庫加入專案的過程中執行原理圖。
    Angular CLI 的 [`ng generate`](cli/generate) 命令會執行原理圖來建立應用程式、程式庫與 Angular 程式碼結構。

*   [程式庫](#library)開發者可以使用 [Schematics CLI](#schematics-cli) 建立原理圖，讓 Angular CLI 能夠加入與更新他們發布的程式庫，並產生程式庫定義的成品。

   如需更多資訊，請參閱 [devkit 文件](https://www.npmjs.com/package/@angular-devkit/schematics)。

{@a schematics-cli}

## Schematics CLI

Schematics 有自己的命令列工具。
使用 Node 6.9 以上版本全域安裝 Schematics CLI。

<code-example format="." language="bash">
npm install -g @angular-devkit/schematics-cli
</code-example>

這會安裝 `schematics` 可執行檔，你可以用它建立新專案、將新的原理圖加入現有專案，或擴充現有的原理圖。

{@a scoped-package}

## 限定範圍套件（scoped package）

一種將相關的 [npm 套件](guide/npm-packages)分組的方式。
NgModule 會在限定範圍套件中提供，其名稱以 Angular 的*範圍名稱* `@angular` 開頭。
例如 `@angular/core`、`@angular/common`、`@angular/forms` 與 `@angular/router`。

匯入限定範圍套件的方式與匯入一般套件相同。

<code-example path="architecture/src/app/app.component.ts" linenums="false" header="architecture/src/app/app.component.ts (import)" region="import">

</code-example>

{@a server-side-rendering}

## 伺服器端渲染（server-side rendering）

一種在伺服器上產生靜態應用程式頁面的技術，並可回應瀏覽器的請求產生與提供這些頁面。
它也可以預先產生頁面為 HTML 檔案，稍後再提供。

這項技術可以改善行動裝置與低效能裝置的效能，並在用戶端應用程式載入期間快速顯示靜態首頁，改善使用者體驗。
靜態版本也可以讓你的應用程式更容易被網路爬蟲看見。

你可以使用 [Angular CLI](guide/glossary#命令列介面（command-line-interface，cli）) 執行 [Angular Universal](#universal) 工具，搭配 `@nguniversal/express-engine` [原理圖](#schematic)，輕鬆為應用程式準備伺服器端渲染。


{@a service}

## 服務（service）

在 Angular 中，指具有 [@Injectable()](guide/glossary#可注入（injectable）) 裝飾器、封裝可跨應用程式重複使用的非 UI 邏輯與程式碼的類別。
Angular 區分元件與服務，以提高模組化與可重複使用性。

`@Injectable()` 中繼資料讓服務類別可以搭配[依賴注入](guide/glossary#依賴注入（dependency-injection，di）)機制使用。
可注入類別由[提供者](guide/glossary#提供者（provider）)具現化。
[注入器](guide/glossary#注入器（injector）)會維護提供者清單，並在元件或其他服務需要時使用它們提供服務執行個體。

詳見[服務與依賴注入簡介](guide/architecture-services)。

{@a structural-directive}
{@a structural-directives}

## 結構指令（structural directive）

一類[指令](guide/glossary#指令（directive）)，負責透過修改 DOM 來塑造 HTML 版面配置。
修改 DOM 包括加入、移除或操作元素及其相關子元素。

詳見[結構指令](guide/structural-directives)。

{@a subscriber}

## 訂閱者（subscriber）

定義如何取得或產生要發布的值或訊息的函式。
當消費者執行[可觀察物件](guide/glossary#可觀察物件（observable）)的 `subscribe()` 方法時，就會執行此函式。

訂閱可觀察物件會觸發其執行、將回呼函式與其關聯，並建立一個 `Subscription` 物件，讓你可以取消訂閱。

`subscribe()` 方法接受一個 [觀察者](guide/glossary#觀察者（observer）) JavaScript 物件，其中最多有三個回呼函式，分別對應可觀察物件可以傳遞的每種通知類型。

*   `next` 通知會傳送一個值，例如數字、字串或物件。
*   `error` 通知會傳送 JavaScript 錯誤或例外。
*   `complete` 通知不會傳送值，但方法完成時會執行處理常式。
    方法完成後仍可繼續傳回排程的值。

{@a T}
{@a template}

## 範本（template）

與元件相關聯、定義如何渲染元件[檢視](guide/glossary#檢視（view）)的程式碼。

範本結合純 HTML 與 Angular [資料繫結](guide/glossary#資料繫結（data-binding）)語法、[指令](guide/glossary#指令（directive）)與[範本運算式](guide/glossary#範本運算式（template-expression）)（邏輯結構）。
Angular 元素會在頁面顯示之前插入或計算值，以修改 HTML 元素。

範本透過 `@Component()` [裝飾器](guide/glossary#裝飾器（decorator、decoration）)與[元件](guide/glossary#元件（component）)類別關聯。
HTML 可以行內提供，作為 `template` 屬性的值，或放在透過 `templateUrl` 屬性連結的獨立 HTML 檔案中。

以 `TemplateRef` 物件表示的其他範本，可以定義替代或*內嵌*檢視，供多個元件參照。

{@a template-drive-forms}

## 範本驅動表單（template-driven forms）

一種使用檢視中的 HTML 表單與輸入元素建置 Angular 表單的格式。
另一種格式使用[反應式表單](guide/glossary#反應式表單（reactive-forms）)框架。

使用範本驅動表單時：

*   「唯一真相來源」是範本。
    驗證是使用個別輸入元素上的屬性來定義的。

*   使用 `ngModel` 的[雙向繫結](guide/glossary#資料繫結（data-binding）)可讓元件模型與使用者在輸入元素中的輸入保持同步。
*   在幕後，Angular 會為每個輸入元素建立新的控制項，前提是你已為每個輸入設定 `name` 屬性與雙向繫結。
*   相關的 Angular 指令以 `ng` 為前綴，例如 `ngForm`、`ngModel` 與 `ngModelGroup`。

另一種選擇是反應式表單。
關於兩種表單方法的介紹與比較，請參閱 [Angular 表單簡介](guide/forms-overview)。

{@a template-expression}

## 範本運算式（template expression）

一種類似 TypeScript 的語法，Angular 會在[資料繫結](guide/glossary#資料繫結（data-binding）)中對其求值。

請閱讀[範本運算式](guide/template-syntax#範本運算式)，了解如何撰寫範本運算式。

{@a token}

## 權杖（token）

用於高效率表格查詢的不透明識別碼。
在 Angular 中，[DI 權杖](guide/glossary#di-權杖（di-token）)用於在[依賴注入](guide/glossary#依賴注入（dependency-injection，di）)系統中尋找依賴的[提供者](guide/glossary#提供者（provider）)。

{@a transpile}

## 轉譯（transpile）

將某個版本的 JavaScript 轉換為另一個版本的翻譯過程；例如，將 ES2015 降級為較舊的 ES5 版本。

{@a file-tree}

## 樹狀結構（tree）

在[原理圖](#schematic)中，指以 `Tree` 類別表示的虛擬檔案系統。
原理圖[規則](#rule)接受樹狀結構物件作為輸入，對其操作，並傳回新的樹狀結構物件。

{@a typescript}

## TypeScript

一種以 JavaScript 為基礎的程式語言，以其可選的型別系統著稱。
TypeScript 提供編譯時期型別檢查與強大的工具支援。
型別檢查與工具支援包括程式碼自動完成、重構、行內文件與智慧搜尋。
許多程式碼編輯器與 IDE 原生支援 TypeScript，或透過外掛程式支援。

TypeScript 是 Angular 開發的首選語言。
詳見 [typescriptlang.org](http://www.typescriptlang.org/)。


{@a U}

{@a universal}

## Universal

用來為 Angular 應用程式實作[伺服器端渲染](#server-side-rendering)的工具。
與應用程式整合後，Universal 會在伺服器上產生靜態頁面並提供給瀏覽器，以回應來自瀏覽器的請求。
初始靜態頁面可作為快速載入的佔位內容，同時完整的應用程式正在瀏覽器中準備正常執行。

詳見 [Angular Universal：伺服器端渲染](guide/universal)。

{@a V}

{@a view}

## 檢視（view）

可以一起建立與銷毀的最小顯示元素群組。
Angular 會在一個或多個[指令](guide/glossary#指令（directive）)的控制下渲染檢視，特別是[元件](guide/glossary#元件（component）)指令及其伴隨的[範本](guide/glossary#範本（template）)。

檢視具體由與元件相關聯的 `ViewRef` 執行個體表示。
屬於元件的檢視稱為*宿主檢視*。
檢視通常會收集為[檢視階層](guide/glossary#檢視階層（view-hierarchy）)。

檢視中元素的屬性可以因應使用者操作而動態變更；檢視中元素的結構（數量與順序）則不能。
你可以透過在其檢視容器中插入、移動或移除巢狀檢視來變更元素的結構。

檢視階層可以在使用者於應用程式中導覽時動態載入與卸載，通常由[路由器](guide/glossary#路由器（router）)控制。

{@a view-tree}

## 檢視階層（view hierarchy）

一組相關檢視構成的樹狀結構，可以作為一個整體來操作。
根檢視稱為元件的*宿主檢視*。
宿主檢視是*內嵌檢視*樹的根，這些內嵌檢視收集於附加在宿主元件中錨點元素上的 `ViewContainerRef` 檢視容器中。
檢視階層是 Angular 變更偵測的關鍵部分。

檢視階層並不意味著元件階層。
內嵌於特定階層脈絡中的檢視，可以是其他元件的宿主檢視。
這些元件可以與宿主元件位於同一個 NgModule，或屬於其他 NgModule。

{@a W}
{@a web-component}

## Web 元件（web component）

見[自訂元素](guide/glossary#自訂元素（custom-element）)。

{@a workspace}

## 工作區（workspace）

在 Angular 中，指包含 [專案](guide/glossary#專案（project）)（也就是應用程式與程式庫）的資料夾。
[CLI](guide/glossary#命令列介面（command-line-interface，cli）) 的 `ng new` 命令會建立一個工作區來容納專案。

建立或操作應用程式與程式庫的命令（例如 `add` 與 `generate`）必須在工作區目錄內執行。

{@a X}


{@a Y}


{@a Z}
{@a zone}

## 區域（zone）

一組非同步工作的執行脈絡。
對於除錯、效能分析與測試包含非同步操作（例如事件處理、Promise 與遠端伺服器呼叫）的應用程式很有用。

Angular 應用程式在一個區域中執行，可以透過檢查資料變更並解析[資料繫結](guide/glossary#資料繫結（data-binding）)來更新顯示的資訊，以回應非同步事件。

區域用戶端可以在非同步操作完成之前與之後採取行動。

在這支 [Brian Ford 影片](https://www.youtube.com/watch?v=3IqtmUscE_U)中進一步了解區域。