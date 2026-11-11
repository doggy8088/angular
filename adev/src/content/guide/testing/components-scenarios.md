# 元件測試情境

本指南探討常見的元件測試使用情境。

## 元件繫結

在範例應用程式中，`BannerComponent` 在 HTML 範本中呈現靜態的標題文字。

經過幾次變更後，`BannerComponent` 透過繫結到元件的 `title` 屬性，呈現動態標題，如下所示。

<docs-code header="banner.component.ts" path="adev/src/content/examples/testing/src/app/banner/banner.component.ts" visibleRegion="component"/>

即使內容如此精簡，你還是決定加入一個測試，確認元件確實在你預期的位置顯示正確的內容。

### 查詢 `<h1>`

你將撰寫一系列測試，檢查包住 _title_ 屬性插值繫結的 `<h1>` 元素之值。

你更新 `beforeEach`，使用標準的 HTML `querySelector` 找到該元素，並將它指派給 `h1` 變數。

<docs-code header="banner.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="setup"/>

### `createComponent()` 不會繫結資料

在你的第一個測試中，你想看到畫面顯示預設的 `title`。
你的直覺是撰寫一個立即檢查 `<h1>` 的測試，如下所示：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default-v1"/>

_該測試失敗_，並顯示下列訊息：

<docs-code language="javascript">

expected '' to contain 'Test Tour of Heroes'.

</docs-code>

繫結發生在 Angular 執行**變更偵測**時。

在正式環境中，舉例來說，當 Angular 建立一個元件，或使用者輸入按鍵時，變更偵測會自動啟動。

`TestBed.createComponent` 預設不會觸發變更偵測；修訂後的測試證實了這個事實：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="test-w-o-detect-changes"/>

### `detectChanges()`

你可以呼叫 `fixture.detectChanges()`，告訴 `TestBed` 執行資料繫結。
只有到那時，`<h1>` 才會有預期的標題。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default"/>

延遲變更偵測是有意設計且實用的。
它讓測試者有機會在 _Angular 開始資料繫結並呼叫[生命週期鉤子](guide/components/lifecycle)之前_，檢查並變更元件的狀態。

這是另一個測試，它在呼叫 `fixture.detectChanges()` _之前_ 先變更元件的 `title` 屬性。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="after-change"/>

### 自動變更偵測 {#automatic-change-detection}

`BannerComponent` 測試經常呼叫 `detectChanges`。
許多測試人員偏好 Angular 測試環境像在正式環境中一樣，自動執行變更偵測。

這可以透過使用 `ComponentFixtureAutoDetect` 提供者來設定 `TestBed` 達成。
先從測試工具程式庫匯入它：

<docs-code header="banner.component.detect-changes.spec.ts (import)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="import-ComponentFixtureAutoDetect"/>

然後將它加入測試模組設定的 `providers` 陣列：

<docs-code header="banner.component.detect-changes.spec.ts (AutoDetect)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect"/>

HELPFUL: 如果你只想在更新 fixture 元件的狀態之後才啟用自動變更偵測，也可以使用 `fixture.autoDetectChanges()` 函式。此外，使用 `provideZonelessChangeDetection` 時，自動變更偵測預設為開啟，不建議將它關閉。

以下是三個示範自動變更偵測如何運作的測試。

<docs-code header="banner.component.detect-changes.spec.ts (AutoDetect Tests)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect-tests"/>

第一個測試展示了自動變更偵測的好處。

第二個與第三個測試揭示了一個重要的限制。
Angular 測試環境在變更元件 `title` 的測試案例內部發生更新時，不會同步執行變更偵測。
測試必須呼叫 `await fixture.whenStable`，等待另一輪變更偵測。

HELPFUL: Angular 不知道對非訊號值的直接更新。若要確保變更偵測會被排程，最簡單的方法是對範本中讀取的值使用訊號。

### 以 `dispatchEvent()` 變更輸入值

若要模擬使用者輸入，請找到輸入元素並設定它的 `value` 屬性。

但這中間有一個不可或缺的步驟。

Angular 並不知道你設定了輸入元素的 `value` 屬性。
在你呼叫 `dispatchEvent()` 引發元素的 `input` 事件之前，它不會讀取該屬性。

下列範例示範了正確的順序。

<docs-code header="hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>

## 具有外部檔案的元件

前面的 `BannerComponent` 以_內嵌範本_與_內嵌 css_定義，分別在 `@Component.template` 與 `@Component.styles` 屬性中指定。

許多元件以 `@Component.templateUrl` 與 `@Component.styleUrls` 屬性指定_外部範本_與_外部 css_，如下列 `BannerComponent` 的變體所示。

<docs-code header="banner-external.component.ts (metadata)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.ts" visibleRegion="metadata"/>

這種語法告訴 Angular 編譯器在元件編譯期間讀取外部檔案。

當你執行 CLI 的 `ng test` 指令時，這不是問題，因為它會_在執行測試之前編譯應用程式_。

然而，如果你在**非 CLI 環境**中執行測試，這個元件的測試可能會失敗。
例如，如果你在像 [plunker](https://plnkr.co) 這樣的網路程式編寫環境中執行 `BannerComponent` 測試，你會看到像這樣的訊息：

<docs-code hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</docs-code>

當執行階段環境_在測試本身進行期間_編譯原始碼時，你會得到這個測試失敗訊息。

若要修正這個問題，請呼叫 `compileComponents()`，如以下[呼叫 compileComponents](#calling-compilecomponents)一節所說明。

## 具有相依性的元件

元件經常有服務相依性。

`WelcomeComponent` 會向已登入的使用者顯示歡迎訊息。
它依據注入的 `UserService` 的某個屬性，知道使用者是誰：

<docs-code header="welcome.component.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.ts"/>

`WelcomeComponent` 具有與服務互動的決策邏輯，這些邏輯讓這個元件值得測試。

### 提供服務測試替身

_受測元件_ 不一定要搭配真實的服務。

注入真實的 `UserService` 可能很困難。
真實的服務可能會要求使用者提供登入憑證，並嘗試連線到驗證伺服器。
這些行為可能很難攔截。請注意，使用測試替身會讓測試的行為與正式環境不同，因此請謹慎使用。

### 取得注入的服務 {#get-injected-services}

測試需要存取注入到 `WelcomeComponent` 中的 `UserService`。

Angular 有一套階層式注入系統。
從 `TestBed` 建立的根注入器，一路往下到元件樹，注入器可以存在於多個層級。

取得注入服務最安全、**永遠有效**的方法，
是**從受測元件的注入器取得它**。
元件注入器是 fixture 的 `DebugElement` 的一個屬性。

<docs-code header="WelcomeComponent's injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="injected-service"/>

HELPFUL: 這_通常_沒有必要。服務經常在根層級提供，或由 TestBed 覆寫，而且可以更容易地以 `TestBed.inject()` 取得（見下文）。

### `TestBed.inject()`

比起使用 fixture 的 `DebugElement` 取得服務，這個方法更容易記住，也更簡潔。

在這個測試套件中，`UserService` 的_唯一_提供者是根測試模組，因此可以安全地如下呼叫 `TestBed.inject()`：

<docs-code header="TestBed injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="inject-from-testbed" />

HELPFUL: 關於 `TestBed.inject()` 無法運作的使用情境，請參閱[覆寫元件的提供者](#override-component-providers)一節，該節說明了何時以及為何你必須改從元件的注入器取得服務。

### 最終設定與測試

以下是完整的 `beforeEach()`，使用 `TestBed.inject()`：

<docs-code header="welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="setup"/>

以下是一些測試：

<docs-code header="welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="tests"/>

第一個是健全性測試；它確認 `UserService` 有被呼叫且正常運作。

HELPFUL: withContext 函式（例如 `'expected name'`）是選擇性的失敗標籤。
如果期望不成立，Jasmine 會將這個標籤附加到期望失敗訊息中。
在包含多個期望的規格中，它能幫助釐清出了什麼問題，以及是哪個期望失敗。

其餘的測試則確認服務傳回不同值時元件的邏輯。
第二個測試驗證變更使用者名稱的效果。
第三個測試檢查在沒有已登入使用者時，元件是否顯示適當的訊息。

## 具有非同步服務的元件

在這個範例中，`AboutComponent` 範本承載了一個 `TwainComponent`。
`TwainComponent` 會顯示 Mark Twain 的名言。

<docs-code header="twain.component.ts (template)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="template" />

HELPFUL: 元件的 `quote` 屬性之值會通過一個 `AsyncPipe`。
這表示該屬性傳回的是 `Promise` 或 `Observable`。

在這個範例中，`TwainComponent.getQuote()` 方法告訴你，`quote` 屬性傳回的是一個 `Observable`。

<docs-code header="twain.component.ts (getQuote)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="get-quote"/>

`TwainComponent` 從注入的 `TwainService` 取得名言。
在服務能傳回第一句名言之前，元件先以一個佔位值（`'...'`）作為傳回的 `Observable` 的起始值。

`catchError` 會攔截服務錯誤、準備錯誤訊息，並在成功通道上傳回佔位值。

這些都是你會想測試的功能。

### 使用 spy 進行測試

測試元件時，重要的應該只有服務的公開 API。
一般而言，測試本身不應該呼叫遠端伺服器。
它們應該模擬這類呼叫。
這個 `app/twain/twain.component.spec.ts` 中的設定展示了其中一種做法：

<docs-code header="twain.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="setup"/>

請聚焦在 spy 上。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="spy"/>

這個 spy 的設計讓任何對 `getQuote` 的呼叫都能收到一個帶有測試名言的 observable。
與真實的 `getQuote()` 方法不同，這個 spy 繞過了伺服器，傳回一個值可立即取得的同步 observable。

即使這個 spy 的 `Observable` 是同步的，你也可以用它撰寫許多有用的測試。

HELPFUL: 最好將 spies 的使用限制在測試所必需的範圍內。為超出必要的範圍建立 mock 或 spy，可能會讓測試變得脆弱。隨著元件與可注入物件演變，不相關的測試可能會失敗，因為它們不再模擬足夠的行為，而這些行為原本並不會影響測試。

### 使用 `fakeAsync()` 的非同步測試

若要使用 `fakeAsync()` 功能，你必須在測試設定檔案中匯入 `zone.js/testing`。
如果你是用 Angular CLI 建立的專案，`zone-testing` 已經在 `src/test.ts` 中匯入。

下列測試確認服務傳回 `ErrorObservable` 時的預期行為。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="error-test"/>

HELPFUL: `it()` 函式接收下列形式的參數。

<docs-code language="javascript">

fakeAsync(() => { /_test body_/ })

</docs-code>

`fakeAsync()` 函式透過在特殊的 `fakeAsync test zone` 中執行測試主體，啟用線性的程式撰寫風格。
測試主體看起來是同步的。
沒有巢狀語法（例如 `Promise.then()`）來打斷控制流程。

HELPFUL: 限制：如果測試主體發出 `XMLHttpRequest`（XHR）呼叫，`fakeAsync()` 函式將無法運作。
測試中的 XHR 呼叫很少見，但如果你需要呼叫 XHR，請參閱 [`waitForAsync()`](#waitForAsync) 一節。

IMPORTANT: 請注意，發生在 `fakeAsync` 區域內的非同步任務需要以 `flush` 或 `tick` 手動執行。如果你試圖在不使用 `fakeAsync` 測試輔助函式推進時間的情況下等待它們完成（例如使用 `fixture.whenStable`），你的測試很可能會失敗。更多資訊請見下文。

### `tick()` 函式

你確實必須呼叫 [tick()](api/core/testing/tick) 來推進虛擬時鐘。

呼叫 [tick()](api/core/testing/tick) 會模擬時間的流逝，直到所有擱置中的非同步活動完成。
在這個案例中，它會等待 observable 的 `setTimeout()`。

[tick()](api/core/testing/tick) 函式接受 `millis` 與 `tickOptions` 作為參數。`millis` 參數指定虛擬時鐘推進多少，未提供時預設為 `0`。
例如，如果你在 `fakeAsync()` 測試中有一個 `setTimeout(fn, 100)`，你需要使用 `tick(100)` 來觸發 fn 回呼。
選擇性的 `tickOptions` 參數有一個名為 `processNewMacroTasksSynchronously` 的屬性。`processNewMacroTasksSynchronously` 屬性表示在 tick 時是否要叫用新產生的巨集任務，預設為 `true`。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick"/>

[tick()](api/core/testing/tick) 函式是你透過 `TestBed` 匯入的 Angular 測試工具之一。
它是 `fakeAsync()` 的夥伴，而且只能在 `fakeAsync()` 主體內呼叫它。

### tickOptions

在這個範例中，你有一個新的巨集任務，也就是巢狀的 `setTimeout` 函式。預設情況下，當 `tick` 是 setTimeout 時，`outside` 與 `nested` 都會被觸發。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-sync"/>

在某些情況下，你不想在 tick 時觸發新的巨集任務。你可以使用 `tick(millis, {processNewMacroTasksSynchronously: false})`，避免叫用新的巨集任務。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-async"/>

### 在 fakeAsync() 中比較日期

`fakeAsync()` 模擬時間的流逝，讓你可以在 `fakeAsync()` 內計算日期之間的差異。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-date"/>

### 搭配 fakeAsync() 使用 jasmine.clock

Jasmine 也提供 `clock` 功能來模擬日期。
對於在 `fakeAsync()` 方法內、呼叫 `jasmine.clock().install()` 之後執行的測試，Angular 會自動執行它們，直到呼叫 `jasmine.clock().uninstall()` 為止。
不需要 `fakeAsync()`，而且巢狀使用時會擲出錯誤。

預設情況下，這個功能是停用的。
若要啟用它，請在匯入 `zone-testing` 之前設定一個全域旗標。

如果你使用 Angular CLI，請在 `src/test.ts` 中設定這個旗標。

<docs-code language="typescript">

[window as any]('__zone_symbol__fakeAsyncPatchLock') = true;
import 'zone.js/testing';

</docs-code>

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-clock"/>

### 在 fakeAsync() 中使用 RxJS 排程器

你也可以在 `fakeAsync()` 中使用 RxJS 排程器，就像使用 `setTimeout()` 或 `setInterval()` 一樣，但你需要匯入 `zone.js/plugins/zone-patch-rxjs-fake-async` 來為 RxJS 排程器套用修補。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-rxjs"/>

### 支援更多 macroTasks

預設情況下，`fakeAsync()` 支援下列巨集任務。

- `setTimeout`
- `setInterval`
- `requestAnimationFrame`
- `webkitRequestAnimationFrame`
- `mozRequestAnimationFrame`

如果你執行其他巨集任務，例如 `HTMLCanvasElement.toBlob()`，就會擲出一個_「Unknown macroTask scheduled in fake async test」_錯誤。

<docs-code-multifile>
    <docs-code header="canvas.component.spec.ts (failing)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="without-toBlob-macrotask"/>
    <docs-code header="canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="main"/>
</docs-code-multifile>

如果你想支援這種情況，你需要在 `beforeEach()` 中定義你想支援的巨集任務。
例如：

<docs-code header="canvas.component.spec.ts (excerpt)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="enable-toBlob-macrotask"/>

HELPFUL: 為了讓 `<canvas>` 元素在你的應用程式中感知 Zone.js，你需要匯入 `zone-patch-canvas` 修補（在 `polyfills.ts` 中，或在使用 `<canvas>` 的特定檔案中）：

<docs-code header="src/polyfills.ts or src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="import-canvas-patch"/>

### 非同步 observables

你可能對這些測試的測試覆蓋率感到滿意。

然而，你可能會對真實服務並非完全如此運作而感到困擾。
真實服務會向遠端伺服器送出請求。
伺服器需要時間回應，而且回應當然不會像前兩個測試那樣立即可用。

如果你從 `getQuote()` spy 傳回一個_非同步_ observable，如下所示，你的測試將更忠實地反映真實世界。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-setup"/>

### 非同步 observable 輔助函式

這個非同步 observable 是由一個 `asyncData` 輔助函式產生的。
`asyncData` 輔助函式是一個工具函式，你必須自己撰寫，或從範例程式碼複製這一個。

<docs-code header="testing/async-observable-helpers.ts" path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-data"/>

這個輔助函式的 observable 會在 JavaScript 引擎的下一輪中發出 `data` 值。

[RxJS `defer()` 運算子](http://reactivex.io/documentation/operators/defer.html) 會傳回一個 observable。
它接受一個傳回 promise 或 observable 的工廠函式。
當有東西訂閱 _defer_ 的 observable 時，它會將訂閱者加入以該工廠建立的新 observable。

`defer()` 運算子將 `Promise.resolve()` 轉換成一個新的 observable，它像 `HttpClient` 一樣，發出一次後即完成。
訂閱者在收到資料值之後會被取消訂閱。

有一個類似的輔助函式用於產生非同步錯誤。

<docs-code path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-error"/>

### 更多非同步測試

現在 `getQuote()` spy 傳回的是非同步 observable，你的大多數測試也必須是非同步的。

以下是一個 `fakeAsync()` 測試，展示你在真實世界中預期的資料流。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="fake-async-test"/>

請注意，名言元素在 `ngOnInit()` 之後顯示的是佔位值（`'...'`）。
第一句名言尚未送達。

若要將第一句名言從 observable 中排出，你呼叫 [tick()](api/core/testing/tick)。
然後呼叫 `detectChanges()`，告訴 Angular 更新畫面。

接著你就可以斷言名言元素顯示預期的文字。

### 不使用 `fakeAsync()` 的非同步測試

以下是上一個 `fakeAsync()` 測試以 `async` 改寫後的版本。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-test"/>

### `whenStable` {#whenstable}

測試必須等待 `getQuote()` observable 發出下一句名言。
它不呼叫 [tick()](api/core/testing/tick)，而是呼叫 `fixture.whenStable()`。

`fixture.whenStable()` 傳回一個 promise，在 JavaScript 引擎的工作佇列變空時解析。
在這個範例中，當 observable 發出第一句名言時，工作佇列就會變空。

## 具有輸入與輸出的元件

具有輸入與輸出的元件，通常出現在宿主元件的檢視範本內。
宿主使用屬性繫結來設定輸入屬性，並使用事件繫結來監聽輸出屬性引發的事件。

測試的目標是驗證這類繫結是否如預期運作。
測試應該設定輸入值，並監聽輸出事件。

`DashboardHeroComponent` 是扮演這個角色的一個小範例元件。
它顯示由 `DashboardComponent` 提供的一位英雄。
點選該英雄會告訴 `DashboardComponent`，使用者已選取該英雄。

`DashboardHeroComponent` 像這樣內嵌在 `DashboardComponent` 範本中：

<docs-code header="dashboard.component.html (excerpt)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.html" visibleRegion="dashboard-hero"/>

`DashboardHeroComponent` 出現在一個 `@for` 區塊中，該區塊將每個元件的 `hero` 輸入屬性設為迴圈的值，並監聽元件的 `selected` 事件。

以下是元件的完整定義：

<docs-code header="dashboard-hero.component.ts (component)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.ts" visibleRegion="component"/>

雖然測試這麼簡單的元件本身沒有多少價值，但知道怎麼做還是有用的。
請使用下列方法之一：

- 依它被 `DashboardComponent` 使用的方式來測試它
- 將它作為獨立元件來測試
- 依它被 `DashboardComponent` 的替代者使用的方式來測試它

眼前的目標是測試 `DashboardHeroComponent`，而不是 `DashboardComponent`，所以請試試第二與第三個選項。

### 以獨立方式測試 `DashboardHeroComponent`

以下是規格檔案設定的核心部分。

<docs-code header="dashboard-hero.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="setup"/>

請注意，設定程式碼如何把一個測試英雄（`expectedHero`）指派給元件的 `hero` 屬性，模擬 `DashboardComponent` 在其重複器中使用屬性繫結設定它的方式。

下列測試驗證英雄名稱是否透過繫結傳遞到範本中。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="name-test"/>

由於[範本](#dashboard-hero-component)會讓英雄名稱通過 Angular `UpperCasePipe`，測試必須以轉成大寫的名稱來比對元素的值。

### 點選

點選英雄應該引發一個 `selected` 事件，讓宿主元件（推測是 `DashboardComponent`）能聽到：

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test"/>

元件的 `selected` 屬性回傳一個 `EventEmitter`，對使用者而言，它看起來就像一個 RxJS 的同步 `Observable`。
測試_明確地_訂閱它，就像宿主元件_隱含地_做的那樣。

如果元件如預期運作，點選英雄的元素應該會讓元件的 `selected` 屬性發出 `hero` 物件。

測試透過它對 `selected` 的訂閱偵測到該事件。

### `triggerEventHandler`

上一個測試中的 `heroDe` 是一個 `DebugElement`，代表英雄的 `<div>`。

它具有 Angular 的屬性與方法，抽象化了與原生元素的互動。
這個測試以「click」事件名稱呼叫 `DebugElement.triggerEventHandler`。
「click」事件繫結會以呼叫 `DashboardHeroComponent.click()` 來回應。

Angular 的 `DebugElement.triggerEventHandler` 可以依_事件名稱_引發_任何資料繫結事件_。
第二個參數是傳給處理常式的事件物件。

這個測試觸發了一個「click」事件。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="trigger-event-handler"/>

在這個情況下，測試正確地假設執行期事件處理常式，也就是元件的 `click()` 方法，並不在意事件物件。

HELPFUL: 其他處理常式就沒這麼寬容了。
舉例來說，`RouterLink` 指令預期事件物件帶有一個 `button` 屬性，用來識別點選期間按下了哪個滑鼠按鈕（如果有的話）。
如果事件物件缺失，`RouterLink` 指令會擲出錯誤。

### 點選元素

下列替代測試呼叫原生元素自己的 `click()` 方法，這對_這個元件_來說完全沒問題。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-2"/>

### `click()` 輔助函式

點選按鈕、錨點或任意 HTML 元素，是常見的測試工作。

將_觸發點選_的過程封裝在像下列 `click()` 函式這樣的輔助函式中，讓這件事保持一致且簡單明瞭：

<docs-code header="testing/index.ts (click helper)" path="adev/src/content/examples/testing/src/testing/index.ts" visibleRegion="click-event"/>

第一個參數是_要點選的元素_。
如果你想的話，可以將自訂事件物件作為第二個參數傳入。
預設值是一個部分的[左鍵滑鼠事件物件](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)，許多處理常式（包括 `RouterLink` 指令）都能接受它。

IMPORTANT: `click()` 輔助函式**不是** Angular 測試公用程式之一。
它是定義在_本指南範例程式碼_中的函式。
所有的範例測試都使用它。
如果你喜歡它，就將它加入你自己的輔助函式收藏中。

以下是上一個測試以點選輔助函式改寫後的版本。

<docs-code header="dashboard-hero.component.spec.ts (test with click helper)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-3"/>

## 位於測試宿主中的元件

前面的測試自己扮演了宿主 `DashboardComponent` 的角色。
但當 `DashboardHeroComponent` 正確地資料繫結到一個宿主元件時，它能正常運作嗎？

<docs-code header="dashboard-hero.component.spec.ts (test host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host"/>

測試宿主以它的測試英雄設定元件的 `hero` 輸入屬性。
它以自己的 `onSelected` 處理常式繫結元件的 `selected` 事件，該處理常式會將發出的英雄記錄在它的 `selectedHero` 屬性中。

稍後，測試將能檢查 `selectedHero`，驗證 `DashboardHeroComponent.selected` 事件是否發出了預期的英雄。

`test-host` 測試的設定與獨立測試的設定類似：

<docs-code header="dashboard-hero.component.spec.ts (test host setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-setup"/>

這個測試模組設定展示了兩個重要的差異：

- 它_建立_的是 `TestHostComponent`，而不是 `DashboardHeroComponent`
- `TestHostComponent` 以繫結設定 `DashboardHeroComponent.hero`

`createComponent` 傳回的 `fixture` 持有的是 `TestHostComponent` 的實例，而不是 `DashboardHeroComponent` 的實例。

建立 `TestHostComponent` 的副作用是建立了一個 `DashboardHeroComponent`，因為後者出現在前者的範本中。
對英雄元素的查詢（`heroEl`）仍然能在測試 DOM 中找到它，儘管它在元素樹中的深度比之前更大。

這些測試本身與獨立版本幾乎完全相同：

<docs-code header="dashboard-hero.component.spec.ts (test-host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-tests"/>

只有 selected 事件測試不同。
它確認所選的 `DashboardHeroComponent` 英雄確實透過事件繫結一路傳遞到宿主元件。

## 路由元件

_路由元件_ 是告訴 `Router` 導航到另一個元件的元件。
`DashboardComponent` 是一個_路由元件_，因為使用者可以點選儀表板上的某個_英雄按鈕_，導航到 `HeroDetailComponent`。

Angular 提供測試輔助工具，以減少樣板程式碼，並更有效地測試依賴 `HttpClient` 的程式碼。`provideRouter` 函式也可以直接用在測試模組中。

<docs-code header="dashboard.component.spec.ts" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="router-harness"/>

下列測試點選顯示的英雄，並確認我們導航到預期的 URL。

<docs-code header="dashboard.component.spec.ts (navigate test)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="navigate-test"/>

## 路由目標元件

_路由目標元件_ 是 `Router` 導航的目的地。
它可能比較難測試，尤其是當通往該元件的路由_包含參數_時。
`HeroDetailComponent` 是一個_路由目標元件_，是這類路由的目的地。

當使用者點選一個 _Dashboard_ 英雄時，`DashboardComponent` 會告訴 `Router` 導航到 `heroes/:id`。
`:id` 是一個路由參數，其值是要編輯之英雄的 `id`。

`Router` 將該 URL 比對到通往 `HeroDetailComponent` 的路由。
它會建立一個帶有路由資訊的 `ActivatedRoute` 物件，並將它注入到 `HeroDetailComponent` 的新實例中。

以下是注入到 `HeroDetailComponent` 中的服務：

<docs-code header="hero-detail.component.ts (inject)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="inject"/>

`HeroDetail` 元件需要 `id` 參數，才能使用 `HeroDetailService` 取得對應的英雄。
元件必須從 `ActivatedRoute.paramMap` 屬性取得 `id`，而該屬性是一個 `Observable`。

它不能只參照 `ActivatedRoute.paramMap` 的 `id` 屬性。
元件必須_訂閱_ `ActivatedRoute.paramMap` observable，並為 `id` 在它的生命週期中變更做好準備。

<docs-code header="hero-detail.component.ts (constructor)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="ctor"/>

測試可以透過導航到不同的路由，探索 `HeroDetailComponent` 如何回應不同的 `id` 參數值。

## 巢狀元件測試 {#nested-component-tests}

元件範本經常有巢狀元件，而這些元件的範本可能又包含更多元件。

元件樹可能非常深，有時候巢狀元件在測試樹頂端元件時並不扮演任何角色。

舉例來說，`AppComponent` 會顯示一個導覽列，其中有錨點與它們的 `RouterLink` 指令。

<docs-code header="app.component.html" path="adev/src/content/examples/testing/src/app/app.component.html"/>

若只要驗證連結而不驗證導航，你不需要 `Router` 進行導航，也不需要 `<router-outlet>` 來標示 `Router` 插入_路由目標元件_的位置。

`BannerComponent` 與 `WelcomeComponent`（由 `<app-banner>` 與 `<app-welcome>` 表示）同樣不相關。

然而，任何在 DOM 中建立 `AppComponent` 的測試，也會建立這三個元件的實例，而且如果你放任這件事發生，你就必須設定 `TestBed` 來建立它們。

如果你疏於宣告它們，Angular 編譯器將無法辨識 `AppComponent` 範本中的 `<app-banner>`、`<app-welcome>` 與 `<router-outlet>` 標籤，並會擲出錯誤。

如果你宣告的是真實元件，你還必須宣告_它們的_巢狀元件，並為樹中_任何_元件注入的_所有_服務做準備。

本節描述兩種將設定工作降到最低的技巧。
你可以單獨使用它們，或合併使用，讓自己專注於測試主要元件。

### 為不需要的元件建立替身

在第一種技巧中，你建立並宣告在測試中幾乎不扮演任何角色的元件與指令的替身版本。

<docs-code header="app.component.spec.ts (stub declaration)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="component-stubs"/>

替身的選擇器與對應真實元件的選擇器相符。
但它們的範本與類別是空的。

接著，使用 `TestBed.overrideComponent` 覆寫你元件的 `imports` 來宣告它們。

<docs-code header="app.component.spec.ts (TestBed stubs)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="testbed-stubs"/>

HELPFUL: 這個範例中的 `set` 鍵會取代你元件上所有現有的 imports，請務必匯入所有相依性，不只是替身。或者，你可以使用 `remove`/`add` 鍵，選擇性地移除與加入 imports。

### `NO_ERRORS_SCHEMA`

在第二種方法中，將 `NO_ERRORS_SCHEMA` 加入你元件的中繼資料覆寫。

<docs-code header="app.component.spec.ts (NO_ERRORS_SCHEMA)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="no-errors-schema"/>

`NO_ERRORS_SCHEMA` 告訴 Angular 編譯器忽略無法辨識的元素與屬性。

編譯器能辨識 `<app-root>` 元素與 `routerLink` 屬性，因為你在 `TestBed` 設定中宣告了對應的 `AppComponent` 與 `RouterLink`。

但當編譯器遇到 `<app-banner>`、`<app-welcome>` 或 `<router-outlet>` 時，它不會擲出錯誤。
它只是將它們渲染為空標籤，瀏覽器會忽略它們。

你不再需要替身元件了。

### 兩種技巧合併使用

這些是_淺層元件測試_的技巧，會如此命名，是因為它們將元件的視覺介面縮減到只剩範本中對測試重要的元素。

`NO_ERRORS_SCHEMA` 方法是兩者中較容易的一個，但不要過度使用它。

`NO_ERRORS_SCHEMA` 也會讓編譯器無法告訴你，你不慎遺漏或拼錯的元件與屬性。
你可能會浪費好幾個小時追查編譯器本可在一瞬間抓到的幽靈錯誤。

_替身元件_ 方法還有另一個優點。
雖然_這個_範例中的替身是空的，但如果你的測試需要以某種方式與它們互動，你可以給它們精簡過的範本與類別。

實務上，你會在同一個設定中合併這兩種技巧，如這個範例所示。

<docs-code header="app.component.spec.ts (mixed setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="mixed-setup"/>

Angular 編譯器為 `<app-banner>` 元素建立 `BannerStubComponent`，並將 `RouterLink` 套用到帶有 `routerLink` 屬性的錨點上，但它會忽略 `<app-welcome>` 與 `<router-outlet>` 標籤。

### `By.directive` 與注入的指令

再多一點設定，就能觸發初始資料繫結，並取得導覽連結的參照：

<docs-code header="app.component.spec.ts (test setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="test-setup"/>

有三個特別值得注意的點：

- 使用 `By.directive` 定位附有指令的錨點元素
- 查詢傳回包住相符元素的 `DebugElement` 包裝
- 每個 `DebugElement` 都暴露一個相依性注入器，帶有附加到該元素的指令之特定實例

要驗證的 `AppComponent` 連結如下：

<docs-code header="app.component.html (navigation links)" path="adev/src/content/examples/testing/src/app/app.component.html" visibleRegion="links"/>

以下是一些確認這些連結如預期接上 `routerLink` 指令的測試：

<docs-code header="app.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="tests"/>

## 使用 `page` 物件

`HeroDetailComponent` 是一個簡單的檢視，帶有一個標題、兩個英雄欄位與兩個按鈕。

但即使是這麼簡單的表單，範本也有不少複雜度。

<docs-code
  path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.html" header="hero-detail.component.html"/>

Tests that exercise the component need …

- To wait until a hero arrives before elements appear in the DOM
- A reference to the title text
- A reference to the name input box to inspect and set it
- References to the two buttons so they can click them

Even a small form such as this one can produce a mess of tortured conditional setup and CSS element selection.

Tame the complexity with a `Page` class that handles access to component properties and encapsulates the logic that sets them.

Here is such a `Page` class for the `hero-detail.component.spec.ts`

<docs-code header="hero-detail.component.spec.ts (Page)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="page"/>

Now the important hooks for component manipulation and inspection are neatly organized and accessible from an instance of `Page`.

A `createComponent` method creates a `page` object and fills in the blanks once the `hero` arrives.

<docs-code header="hero-detail.component.spec.ts (createComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="create-component"/>

Here are a few more `HeroDetailComponent` tests to reinforce the point.

<docs-code header="hero-detail.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="selected-tests"/>

## Override component providers

The `HeroDetailComponent` provides its own `HeroDetailService`.

<docs-code header="hero-detail.component.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="prototype"/>

It's not possible to stub the component's `HeroDetailService` in the `providers` of the `TestBed.configureTestingModule`.
Those are providers for the _testing module_, not the component.
They prepare the dependency injector at the _fixture level_.

Angular creates the component with its _own_ injector, which is a _child_ of the fixture injector.
It registers the component's providers \(the `HeroDetailService` in this case\) with the child injector.

A test cannot get to child injector services from the fixture injector.
And `TestBed.configureTestingModule` can't configure them either.

Angular has created new instances of the real `HeroDetailService` all along!

HELPFUL: These tests could fail or timeout if the `HeroDetailService` made its own XHR calls to a remote server.
There might not be a remote server to call.

Fortunately, the `HeroDetailService` delegates responsibility for remote data access to an injected `HeroService`.

<docs-code header="hero-detail.service.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.service.ts" visibleRegion="prototype"/>

The [previous test configuration](#import-a-feature-module) replaces the real `HeroService` with a `TestHeroService` that intercepts server requests and fakes their responses.

What if you aren't so lucky.
What if faking the `HeroService` is hard?
What if `HeroDetailService` makes its own server requests?

The `TestBed.overrideComponent` method can replace the component's `providers` with easy-to-manage _test doubles_ as seen in the following setup variation:

<docs-code header="hero-detail.component.spec.ts (Override setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-override"/>

Notice that `TestBed.configureTestingModule` no longer provides a fake `HeroService` because it's [not needed](#spy-stub).

### The `overrideComponent` method

Focus on the `overrideComponent` method.

<docs-code header="hero-detail.component.spec.ts (overrideComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-component-method"/>

It takes two arguments: the component type to override \(`HeroDetailComponent`\) and an override metadata object.
The [override metadata object](guide/testing/utility-apis#metadata-override-object) is a generic defined as follows:

<docs-code language="javascript">

type MetadataOverride<T> = {
add?: Partial<T>;
remove?: Partial<T>;
set?: Partial<T>;
};

</docs-code>

中繼資料覆寫物件可以在中繼資料屬性中加入與移除元素，或完全重設那些屬性。
這個範例重設了元件的 `providers` 中繼資料。

型別參數 `T` 是你會傳給 `@Component` 裝飾器的中繼資料種類：

<docs-code language="javascript">

selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…

</docs-code>

### 提供 _spy 替身_（`HeroDetailServiceSpy`） {#provide-a-spy-stub-herodetailservicespy}

這個範例將元件的 `providers` 陣列完全換成一個新陣列，其中包含一個 `HeroDetailServiceSpy`。

`HeroDetailServiceSpy` 是真實 `HeroDetailService` 的替身版本，它偽造了該服務所有必要的功能。
它既不注入也不委派給較低層級的 `HeroService`，因此不需要為後者提供測試替身。

相關的 `HeroDetailComponent` 測試會透過監控服務方法，來斷言 `HeroDetailService` 的方法有被呼叫。
因此，這個替身將它的方法實作為 spy：

<docs-code header="hero-detail.component.spec.ts (HeroDetailServiceSpy)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="hds-spy"/>

### 覆寫測試

現在，測試可以直接操控替身的 `testHero` 來控制元件的英雄，並確認服務方法有被呼叫。

<docs-code header="hero-detail.component.spec.ts (override tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-tests"/>

### 更多覆寫

`TestBed.overrideComponent` 方法可以針對相同或不同的元件呼叫多次。
`TestBed` 也提供類似的 `overrideDirective`、`overrideModule` 與 `overridePipe` 方法，用來深入並取代這些其他類別的部分內容。

請自行探索這些選項與組合。
