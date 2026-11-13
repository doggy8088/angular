# 模組簡介

Angular 應用程式是模組化的，而 Angular 有自己的模組化系統，稱為 *NgModules*。
NgModules 是容器，用來容納專屬於某個應用程式領域、工作流程或一組密切相關功能的內聚程式碼區塊。它們可以包含元件、服務提供者，以及範圍由所屬 NgModule 定義的其他程式碼檔案。它們可以匯入其他 NgModules 匯出的功能，也可以匯出選定的功能供其他 NgModules 使用。

每個 Angular 應用程式至少有一個 NgModule 類別，即 [*根模組*](guide/bootstrapping)，依慣例命名為 `AppModule`，位於名為 `app.module.ts` 的檔案中。你可以透過*啟動*根 NgModule 來啟動應用程式。

小型應用程式可能只有一個 NgModule，但大多數應用程式會有更多*功能模組*。應用程式的*根* NgModule 之所以如此命名，是因為它可以將子 NgModule 納入任何深度的階層之中。

## NgModule 中繼資料

NgModule 是由以 `@NgModule()` 裝飾的類別所定義。`@NgModule()` 裝飾器是一個函式，接受單一中繼資料物件，其屬性描述該模組。最重要的屬性如下。

* `declarations`：屬於此 NgModule 的 [元件](guide/architecture-components)、*指令*與*管道*。

* `exports`：應在其他 NgModules 的*元件範本*中可見且可用的宣告子集。

* `imports`：其他模組，其匯出的類別是*此* NgModule 中宣告的元件範本所需要的。

* `providers`：建立 [服務](guide/architecture-services) 的建立者，此 NgModule 將這些服務貢獻給全域服務集合；它們可在應用程式的所有部分存取。（你也可以在元件層級指定提供者。）

* `bootstrap`：主要的應用程式檢視，稱為*根元件*，它承載所有其他應用程式檢視。只有*根 NgModule*應設定 `bootstrap` 屬性。

以下是一個簡單的根 NgModule 定義。

<code-example path="architecture/src/app/mini-app.ts" region="module" header="src/app/app.module.ts"></code-example>

<div class="alert is-helpful">

  `AppComponent` 在此列於 `exports` 清單中僅供說明；在此範例中實際上並不需要。根 NgModule 沒有理由*匯出*任何東西，因為其他模組不需要*匯入*根 NgModule。

</div>

## NgModules 與元件

NgModules 為其元件提供*編譯上下文*。根 NgModule 一定有一個在啟動期間建立的根元件，但任何 NgModule 都可以包含任意數量的其他元件，這些元件可以透過路由器載入，或透過範本建立。屬於同一 NgModule 的元件共用一個編譯上下文。

<div class="lightbox">
  <img src="generated/images/guide/architecture/compilation-context.png" alt="元件編譯內容" class="left">
</div>

<br class="clear">

元件及其範本共同定義一個*檢視*。元件可以包含*檢視階層*，讓你能定義任意複雜的螢幕區域，這些區域可以作為一個單元來建立、修改與銷毀。檢視階層可以混合屬於不同 NgModules 的元件中所定義的檢視。這種情況很常見，特別是對於 UI 程式庫。

<div class="lightbox">
  <img src="generated/images/guide/architecture/view-hierarchy.png" alt="檢視階層" class="left">
</div>

<br class="clear">

建立元件時，它會直接與單一檢視相關聯，稱為*宿主檢視*。宿主檢視可以是檢視階層的根，其中可包含*內嵌檢視*，而這些內嵌檢視又是其他元件的宿主檢視。這些元件可以位於同一個 NgModule，也可以從其他 NgModules 匯入。樹狀結構中的檢視可以巢狀到任何深度。

<div class="alert is-helpful">

**注意：** 檢視的階層結構是 Angular 偵測並回應 DOM 與應用程式資料變更方式的關鍵因素。

</div>

## NgModules 與 JavaScript 模組

NgModule 系統與用於管理 JavaScript 物件集合的 JavaScript（ES2015）模組系統不同，且彼此無關。這些是*互補*的模組系統，你可以搭配使用它們來撰寫應用程式。

在 JavaScript 中，每個*檔案*都是一個模組，檔案中定義的所有物件都屬於該模組。
模組以 `export` 關鍵字標記某些物件，將其宣告為公開。
其他 JavaScript 模組使用*import 陳述式*來存取其他模組中的公開物件。

<code-example path="architecture/src/app/app.module.ts" region="imports"></code-example>

<code-example path="architecture/src/app/app.module.ts" region="export"></code-example>

<div class="alert is-helpful">
  <a href="http://exploringjs.com/es6/ch_modules.html">在網路上進一步瞭解 JavaScript 模組系統。</a>
</div>

## Angular 程式庫

<img src="generated/images/guide/architecture/library-module.png" alt="元件" class="left">

Angular 以 JavaScript 模組集合的形式載入。你可以將它們視為程式庫模組。每個 Angular 程式庫名稱都以 `@angular` 前置詞開頭。使用 Node 套件管理員 `npm` 安裝它們，並以 JavaScript `import` 陳述式匯入其中部分內容。

<br class="clear">

例如，像這樣從 `@angular/core` 程式庫匯入 Angular 的 `Component` 裝飾器。

<code-example path="architecture/src/app/app.component.ts" region="import"></code-example>

你也可以使用 JavaScript import 陳述式，從 Angular *程式庫*匯入 NgModules。
例如，下列程式碼從 `platform-browser` 程式庫匯入 `BrowserModule` NgModule。

<code-example path="architecture/src/app/mini-app.ts" region="import-browser-module"></code-example>

在上述簡單根模組的範例中，應用程式模組需要 `BrowserModule` 內的素材。
若要存取該素材，請像這樣將它加入 `@NgModule` 中繼資料的 `imports`。

<code-example path="architecture/src/app/mini-app.ts" region="ngmodule-imports"></code-example>

如此一來，你便同時使用 Angular 與 JavaScript 模組系統。雖然這兩個系統很容易混淆，因為它們共用「imports」與「exports」等共通詞彙，但你將逐漸熟悉它們各自使用的不同情境。

<div class="alert is-helpful">

  請參閱 [NgModules](guide/ngmodules) 指南，瞭解更多資訊。

</div>
