# 測試組件的基礎

元件，與 Angular 應用程式的所有其他部分不同，結合了 HTML 範本和 TypeScript 類別。
元件真正是範本和類別 *共同運作* 的結果。
若要充分測試元件，您應測試它們是否如預期般共同運作。

此類測試需要在瀏覽器 DOM 中建立元件的主機元素，就像 Angular 所做的那樣，並根據範本的描述來研究元件類別與 DOM 的互動。

Angular `TestBed` 簡化了這類測試，您將在以下各節中看到。
但在許多情況下，*單獨測試元件類別*，不涉及 DOM，可以用直接、更明顯的方式驗證元件的許多行為。

## 元件類別測試

測試一個元件類別本身，如同測試服務類別一樣。

Component 類別測試應該保持非常乾淨和簡單。
它應該只測試一個單元。
乍看之下，你應該能理解測試正在測試什麼。

考慮這個 `LightswitchComponent`，當使用者點擊按鈕時，它會打開和關閉燈（由螢幕上的訊息表示）。

<docs-code header="app/demo/demo.ts (LightswitchComp)" path="adev/src/content/examples/testing/src/app/demo/demo.ts" visibleRegion="LightswitchComp"/>

您可能決定僅測試 `clicked()` 方法是否切換燈光的 *開/關* 狀態並適當設定訊息。

此組件類別沒有相依性。
若要測試這些類別的類型，請按照您對沒有相依性的服務所執行的步驟：

1. 使用 new 關鍵字建立組件。
1. 測試其 API。
1. 斷言其公開狀態的預期。

<docs-code header="app/demo/demo.spec.ts (Lightswitch tests)" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="Lightswitch"/>

以下內容是來自 *英雄之旅* 教學的 `DashboardHeroComponent`。

<docs-code header="app/dashboard/dashboard-hero.component.ts (component)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.ts" visibleRegion="class"/>

它出現在父元件的範本中，該父元件將 *英雄* 繫結至 `@Input` 屬性，並監聽透過 *選取* `@Output` 屬性引發的事件。

您可以在不建立 `DashboardHeroComponent` 或其父元件的情況下測試類別程式碼是否有效運作。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (class tests)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="class-only"/>

當一個元件有依賴關係時，你可能想要使用 `TestBed` 來建立元件及其依賴關係。

以下 `WelcomeComponent` 依賴 `UserService` 來知道要問候的使用者名稱。

IMPORTANT: 記得要 *匯入* 或 *提供* 你想測試的每個獨立元件。

<docs-code header="app/welcome/welcome.component.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.ts" visibleRegion="class"/>

您可以先建立一個滿足此元件最低需求的 `UserService` 模擬。

<docs-code header="app/welcome/welcome.component.spec.ts (MockUserService)" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="mock-user-service"/>

然後在 `TestBed` 配置中提供並注入*元件和服務*。

<docs-code header="app/welcome/welcome.component.spec.ts (class-only setup)" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="class-only-before-each"/>

然後練習元件類別，記得呼叫 [生命週期掛鉤方法](guide/components/lifecycle)，就像 Angular 在執行應用程式時所做的一樣。

<docs-code header="app/welcome/welcome.component.spec.ts (class-only tests)" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="class-only-tests"/>

## 元件 DOM 測試

測試元件 *class* 與 [測試服務](guide/testing/services) 一樣簡單。

但元件不只是類別而已。
元件會與 DOM 和其他元件互動。
*僅有類別* 的測試可以告訴你類別行為。
無法告訴你元件是否會正確呈現、回應使用者輸入和手勢，或與其父元件和子元件整合。

上述所有僅有的 *class* 測試，均無法回答有關元件在螢幕上實際行為的主要問題。

* `Lightswitch.clicked()` 是否繫結到任何項目，以便使用者可以呼叫它？
* 是否顯示 `Lightswitch.message`？
* 使用者是否可以實際選取由 `DashboardHeroComponent` 顯示的英雄？
* 英雄名稱是否如預期顯示\(例如大寫\)?
* 是否由 `WelcomeComponent` 範本顯示歡迎訊息？

對於前面說明的簡單元件來說，這些可能不是麻煩的問題。
但許多元件與其範本中所述的 DOM 元素有複雜的互動，導致在元件狀態變化的同時，HTML 會出現和消失。

要回答這類問題，您必須建立與元件相關聯的 DOM 元素，您必須檢查 DOM 以確認元件狀態在適當時間正確顯示，並且您必須模擬使用者與螢幕的互動，以判斷這些互動是否導致元件的行為如預期。

要撰寫這些類型的測試，您必須使用 `TestBed` 的其他功能以及其他測試輔助程式。

### CLI-產生的測試

當您要求它產生新的組件時，CLI 會預設為您建立一個初始測試檔案。

例如，以下 CLI 命令會在 `app/banner` 資料夾中產生一個 `BannerComponent` （包含內嵌範本和樣式）：

<docs-code language="shell">

ng generate component banner --inline-template --inline-style --module app

</docs-code>

它也為元件產生一個初始測試檔案 `banner-external.component.spec.ts`，如下所示：

<docs-code header="app/banner/banner-external.component.spec.ts (initial)" path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v1"/>

HELPFUL: 因為 `compileComponents` 是非同步的，因此它使用從 `@angular/core/testing` 匯入的 [`waitForAsync`](api/core/testing/waitForAsync) 實用函數。

有關更多詳細資訊，請參閱 [waitForAsync](guide/testing/components-scenarios#waitForAsync) 部分。

### 減少設定

只有此檔案的最後三行實際測試元件，而且它們所做的只是斷言 Angular 可以建立元件。

其餘檔案是預期可能成為必要之更進階測試的樣板設定程式碼，若元件演變成實質內容。

您將在以下各節中瞭解這些進階測試功能。
現在，您可以徹底減少此測試檔案至更易於管理的大小：

<docs-code header="app/banner/banner-initial.component.spec.ts (minimal)" path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v2"/>

在此範例中，傳遞給 `TestBed.configureTestingModule` 的元資料物件僅宣告要測試的元件 `BannerComponent`。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="configureTestingModule"/>

HELPFUL：無需宣告或匯入其他任何內容。
預設測試模組已預先配置類似於 `@angular/platform-browser` 中的 `BrowserModule`。

稍後，您會呼叫 `TestBed.configureTestingModule()`，其中包含匯入、提供者，以及更多聲明，以滿足您的測試需求。
選用的 `override` 方法可以進一步微調組態的各個方面。

### `createComponent()`

設定 `TestBed` 之後，您呼叫其 `createComponent()` 方法。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="createComponent"/>

TestBed.createComponent()` 建立一個 `BannerComponent` 的實例，將對應的元素新增到測試執行器的 DOM，並傳回一個 [`ComponentFixture`](#component-fixture)。

IMPORTANT: 在呼叫 `createComponent` 後，請勿重新配置 `TestBed`。

`createComponent` 方法將凍結目前的 `TestBed` 定義，並將其關閉以進行進一步的配置。

您無法再呼叫任何 `TestBed` 組態方法，包括 `configureTestingModule()`、`get()` 或任何 `override...` 方法。
如果您嘗試，`TestBed` 會擲回錯誤。

### `ComponentFixture`

[ComponentFixture](api/core/testing/ComponentFixture) 是一個測試工具，用於與已建立的元件及其對應元素互動。

通過 fixture 存取元件實體，並使用 Jasmine 期望確認它存在：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="componentInstance"/>

### `beforeEach()`

隨著此元件演進，您會新增更多測試。
與其為每個測試重複 `TestBed` 設定，您重構以將設定拉到 Jasmine `beforeEach()` 及一些支援變數：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v3"/>

現在加入一個測試，從 `fixture.nativeElement` 取得元件的元素，並尋找預期的文字。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-2"/>

### `nativeElement`

`ComponentFixture.nativeElement` 的值具有 `any` 類型。
稍後你會遇到 `DebugElement.nativeElement`，它也具有 `any` 類型。

`nativeElement` 是什麼類型的 HTML 元素或它是否甚至是 HTML 元素，Angular 在編譯時無法得知。
應用程式可能在 *非瀏覽器平台* 上執行，例如伺服器或 [Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API)，在此情況下，元素的 API 可能有所減少或根本不存在。

本指南中的測試設計為在瀏覽器中執行，因此 `nativeElement` 值永遠會是 `HTMLElement` 或其衍生類別。

知道它是一種 `HTMLElement`，使用標準的 HTML `querySelector` 來更深入地探究元素樹。

以下為另一個測試，呼叫 `HTMLElement.querySelector` 來取得段落元素並尋找標語文字：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-3"/>

### `DebugElement`

Angular *fixture* 透過 `fixture.nativeElement` 直接提供元件的元素。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="nativeElement"/>

這實際上是一個便利方法，實現為 `fixture.debugElement.nativeElement`。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="debugElement-nativeElement"/>

元素採用這種曲折路徑是有充分理由的。

`nativeElement` 的屬性取決於執行時間環境。
您可能會在沒有 DOM 或其 DOM 模擬不支援完整 `HTMLElement` API 的 *非瀏覽器* 平臺上執行這些測試。

Angular 依靠 `DebugElement` 抽象來安全地跨 *所有支援的平台* 工作。
Angular 沒有建立 HTML 元素樹，而是建立一個 `DebugElement` 樹來包裝執行階段平台的 *原生元素*。
`nativeElement` 屬性會將 `DebugElement` 解包並傳回特定於平台的元素物件。

因為本指南的範例測試設計為僅在瀏覽器中執行，所以這些測試中的 `nativeElement` 始終是 `HTMLElement`，您可以使用測試中的熟悉方法和屬性來探索。

以下是先前的測試，使用 `fixture.debugElement.nativeElement` 重新實作：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-4"/>

`DebugElement` 還有其他在測試中很有用的方法和屬性，您將會在指南的其他地方看到。

您可以從 Angular 核心函式庫匯入 `DebugElement` 符號。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="import-debug-element"/>

### `By.css()`

雖然本指南中的測試皆在瀏覽器中執行，但某些應用程式可能會在至少某段時間內於不同平台執行。

例如，該元件可能首先在伺服器上呈現，作為一種策略，以使應用程式在連線不良的裝置上更快啟動。
伺服器端渲染器可能不支援完整的 HTML 元素 API。
如果它不支援 `querySelector`，則先前的測試可能會失敗。

`DebugElement` 提供適用於所有支援平台的查詢方法。
這些查詢方法採用一個 *謂詞* 函數，當 `DebugElement` 樹中的節點符合選擇條件時，該函數會傳回 `true`。

您可以藉助從運行時平台的庫匯入的 `By` 類別來建立 *謂詞*。
這是瀏覽器平台的 `By` 匯入：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="import-by"/>

以下範例使用 `DebugElement.query()` 與瀏覽器的 `By.css` 方法重新實作前一個測試。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-5"/>

一些值得注意的觀察：

* `By.css()` 靜態方法選取具有 [標準 CSS 選擇器](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS selectors') 的 `DebugElement` 節點。
* 查詢會傳回段落的一個 `DebugElement`。
* 您必須展開該結果以取得段落元素。

當您以 CSS 選擇器過濾並僅測試瀏覽器 *原生元素* 的屬性時，`By.css` 的方法可能會殺雞用牛刀。

通常使用標準的 `HTMLElement` 方法（例如 `querySelector()` 或 `querySelectorAll()`) 來過濾會更直接且更清楚。

