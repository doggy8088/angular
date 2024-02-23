# 元件測試情境

本指南探討常見的元件測試用例。

## 元件繫結

在範例應用程式中，`BannerComponent` 在 HTML 範本中呈現靜態標題文字。

經過幾次變更後，`BannerComponent` 透過綁定元件的 `title` 屬性，呈現動態標題，如下所示。

<docs-code header="app/banner/banner.component.ts" path="adev/src/content/examples/testing/src/app/banner/banner.component.ts" visibleRegion="component"/>

儘管這很小，您決定新增一個測試，以確認元件實際上在您認為應該出現的地方顯示正確的內容。

### 查詢 `<h1>`

您將撰寫一系列測試，用來檢查包含 *標題* 屬性插補繫結的 `<h1>` 元素的值。

您更新 `beforeEach` 以使用標準 HTML `querySelector` 尋找該元素，並將其指派給 `h1` 變數。

<docs-code header="app/banner/banner.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="setup"/>

### `createComponent()` 不會繫結資料

對於您的第一次測試，您希望看到螢幕顯示預設的 `title`。
您的直覺是寫一個立即檢查 `<h1>` 的測試，像這樣：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default-v1"/>

*該測試失敗* 訊息為：

<docs-code language="javascript">

expected '' to contain 'Test Tour of Heroes'.

</docs-code>

Binding 會在 Angular 執行 **變更偵測** 時發生。

在生產環境中，當 Angular 建立元件或使用者輸入鍵擊或非同步活動（例如 AJAX）完成時，變更偵測會自動啟動。

`TestBed.createComponent` *不* 會觸發變更偵測；在已修訂的測試中確認了這個事實：

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="test-w-o-detect-changes"/>

### `detectChanges()`

你必須呼叫 `fixture.detectChanges()` 來告訴 `TestBed` 執行資料繫結。
只有這樣 `<h1>` 才會有預期的標題。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default"/>

延遲變更偵測是有意且有用的。
它給予測試人員一個機會來檢查和變更元件的狀態，*在 Angular 發起資料繫結和呼叫 [生命週期掛鉤](guide/components/lifecycle)* 之前。

以下是如何在呼叫 `fixture.detectChanges()` *之前* 變更元件的 `title` 屬性的另一個測試。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="after-change"/>

### 自動變更偵測

`BannerComponent` 測試經常呼叫 `detectChanges`。
有些測試人員偏好 Angular 測試環境自動執行變更偵測。

那可透過使用 `ComponentFixtureAutoDetect` 提供者來設定 `TestBed` 來實現。
首先從測試實用程式庫匯入：

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (import)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="import-ComponentFixtureAutoDetect"/>

然後將它加入測試模組組態的 `providers` 陣列中：

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect"/>

以下三個測試說明自動變更偵測如何運作。

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect-tests"/>

第一個測試顯示自動變更偵測的好處。

第二和第三個測試揭露了一個重要的限制。
Angular 測試環境不知道測試已更改元件的 `title`。
`ComponentFixtureAutoDetect` 服務會回應 *非同步活動*，例如承諾解決方案、計時器和 DOM 事件。
但元件屬性的直接同步更新是不可見的。
測試必須手動呼叫 `fixture.detectChanges()` 以觸發另一個變更偵測週期。

HELPFUL: 與其想知道測試固定裝置何時會或不會執行變更偵測，本指南中的範例 *總是會* *明確地* 呼叫 `detectChanges()`。
呼叫 `detectChanges()` 的次數比絕對必要的次數多並不會造成任何危害。

### 用 `dispatchEvent()` 改變輸入值

若要模擬使用者輸入，請尋找 input 元素並設定其 `value` 屬性。

您將呼叫 `fixture.detectChanges()` 來觸發 Angular 的變更偵測。
但有一個必要的中間步驟。

Angular 不知道您已設定輸入元素的 `value` 屬性。
除非您透過呼叫 `dispatchEvent()` 觸發元素的 `input` 事件，否則它不會讀取該屬性。
*然後* 您呼叫 `detectChanges()`。

以下範例說明正確的順序。

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>

## 外部檔案的元件

前述的 `BannerComponent` 使用 *inline 範本* 和 *inline css* 定義，分別在 `@Component.template` 和 `@Component.styles` 屬性中指定。

許多元件會以 `@Component.templateUrl` 和 `@Component.styleUrls` 屬性分別指定 *外部範本* 和 *外部 css*，就像下列 `BannerComponent` 的變體。

<docs-code header="app/banner/banner-external.component.ts (metadata)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.ts" visibleRegion="metadata"/>

此語法告訴 Angular 編譯器在元件編譯期間讀取外部檔案。

當您執行 CLI `ng test` 指令時，這不是問題，因為它會在執行測試前先編譯應用程式。

然而，如果您在 **非 CLI 環境** 中執行測試，這個元件的測試可能會失敗。
例如，如果您在像是 [plunker](https://plnkr.co) 的網路編碼環境中執行 `BannerComponent` 測試，您會看到類似這樣的訊息：

<docs-code hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</docs-code>

當執行時間環境在 *測試期間* 編譯原始碼時，您會收到此測試失敗訊息。

若要修正此問題，請依照下列 [Calling compileComponents](#compile-components) 區段所說明的呼叫 `compileComponents()`。

## 具有依賴項的元件

元件通常具有服務相依性。

`WelcomeComponent` 向已登入使用者顯示歡迎訊息。
它根據注入的 `UserService` 的屬性得知使用者是誰：

<docs-code header="app/welcome/welcome.component.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.ts"/>

`WelcomeComponent` 具有與服務互動的決策邏輯，此邏輯使此元件值得測試。
以下是規範檔案的測試模組組態：

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="config-test-module"/>

這次，除了宣告 *component-under-test* 之外，
設定檔在 `providers` 清單中加入一個 `UserService` 提供者。
但不是真正的 `UserService`。

### 提供服務測試替身

*component-under-test* 不需要注入真正的服務。
事實上，如果它們是測試替身（例如存根、假貨、間諜或模擬）通常會更好。
規範的目的是測試元件，而不是服務，而真正的服務可能會造成麻煩。

注入真正的 `UserService` 可能是一場惡夢。
真正的服務可能會要求使用者提供登入憑證並嘗試連線到驗證伺服器。
這些行為可能很難攔截。
在真正的 `UserService` 中建立並註冊測試替身要容易且安全得多。

這個特定測試套件提供 `UserService` 的最小模擬，以滿足 `WelcomeComponent` 及其測試的需求：

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="user-service-stub"/>

### 取得注入服務

測試需要存取注入到 `WelcomeComponent` 的 stub `UserService`。

Angular 具有階層式注入系統。
可以有多個層級的注入器，從 `TestBed` 建立的根注入器，一直到元件樹。

取得注入服務最安全的方法，始終有效的方式，
是從**受測元件的注入器**取得。
元件注入器是固定裝置的 `DebugElement` 的屬性。

<docs-code header="WelcomeComponent's injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="injected-service"/>

### `TestBed.inject()`

您也可以使用 `TestBed.inject()` 從根注入器取得服務。
這比較容易記住且較不冗長。
但這僅適用於 Angular 在測試的根注入器中以服務實例注入元件時。

在此測試套件中，`UserService` 的 *唯一* 提供者是根測試模組，因此可以安全地呼叫 `TestBed.inject()` 如下：

<docs-code header="TestBed injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="inject-from-testbed" />

HELPFUL：如需瞭解 `TestBed.inject()` 無法使用的案例，請參閱 [*覆寫元件提供者*](#component-override) 部分，其中說明何時以及為何您必須從元件的注入器取得服務。

### 最後的設定與測試

以下是完整的 `beforeEach()`，使用 `TestBed.inject()`：

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="setup"/>

以下是部分測試：

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="tests"/>

第一個是健全性測試；它確認存根的 `UserService` 已呼叫並正常運作。

HELPFUL: Jasmine 比對器的第二個參數（例如，`'預期名稱'`）是選擇性失敗標籤。
如果預期失敗，Jasmine 會將此標籤附加到預期失敗訊息。
在具有多個預期的規格中，它可以幫助釐清錯誤所在和預期失敗的位置。

其餘的測試確認服務回傳不同值時元件的邏輯。
第二個測試驗證變更使用者名稱的效果。
第三個測試檢查當沒有登入使用者時，元件顯示正確的訊息。

## 元件搭配非同步服務

在此範例中，`AboutComponent` 範本會主機一個 `TwainComponent`。
`TwainComponent` 會顯示馬克吐溫的名言。

<docs-code header="app/twain/twain.component.ts (template)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="template" />

HELPFUL: 元件的 `quote` 屬性的值會通過 `AsyncPipe`。
這表示屬性會傳回 `Promise` 或 `Observable`。

在此範例中，`TwainComponent.getQuote()` 方法告訴您 `quote` 屬性會傳回一個 `Observable`。

<docs-code header="app/twain/twain.component.ts (getQuote)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="get-quote"/>

`TwainComponent` 從注入的 `TwainService` 取得名言。
元件以預留位置值 \(`'...'`\) 啟動回傳的 `Observable`，服務才能回傳第一個名言。

`catchError` 會攔截服務錯誤，準備錯誤訊息，並在成功頻道上傳回 placeholder 值。
它必須等待一個 tick，才能設定 `errorMessage`，以避免在同一個變更偵測週期中更新該訊息兩次。

以下這些都是您會想測試的功能。

### 使用間諜測試

在測試元件時，只應在意服務的公開 API。
一般而言，測試本身不應呼叫遠端伺服器。
它們應模擬此類呼叫。
這個 `app/twain/twain.component.spec.ts` 中的設定顯示一種方法：

<docs-code header="app/twain/twain.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="setup"/>

專注於間諜。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="spy"/>

間諜設計成任何呼叫 `getQuote` 都會收到一個帶有測試報價的可觀察對象。
與真正的 `getQuote()` 方法不同，此間諜繞過伺服器並回傳一個同步的可觀察對象，其值可立即使用。

即使其 `Observable` 是同步的，您也可以使用此間諜撰寫許多有用的測試。

### 同步測試

同步 `Observable` 的一個主要優勢是您可以經常將非同步程序轉換為同步測試。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="sync-test"/>

由於間諜結果同步傳回，`getQuote()` 方法在 Angular 呼叫 `ngOnInit` 時，於第一個變更偵測週期 *之後* 立即更新畫面上的訊息。

當測試錯誤路徑時，您就不會這麼幸運了。
儘管服務間諜會同步傳回錯誤，但元件方法呼叫 `setTimeout()`。
測試必須至少等待 JavaScript 引擎完整執行一次，值才會可用。
測試必須成為 *非同步的*。

### 使用 `fakeAsync()` 進行非同步測試

若要使用 `fakeAsync()` 功能，您必須在測試設定檔案中匯入 `zone.js/testing`。
如果您使用 Angular CLI 建立專案，則已在 `src/test.ts` 中匯入 `zone-testing`。

下列測試確認當服務傳回 `ErrorObservable` 時的預期行為。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="error-test"/>

HELPFUL: `it()` 函數接收以下形式的參數。

<docs-code language="javascript">

fakeAsync(() =&gt; { /*test body*/ })

</docs-code>

`fakeAsync()` 函數會在特殊的 `fakeAsync 測試區域` 中執行測試主體，進而讓線性程式碼風格成為可能。
測試主體看起來是同步的。
沒有巢狀語法（例如 `Promise.then()`）會中斷控制流程。

HELPFUL: 限制：如果測試主體呼叫 `XMLHttpRequest` \(XHR\) 的話，`fakeAsync()` 函數將無法運作。
測試中的 XHR 呼叫很少見，但如果您需要呼叫 XHR，請參閱 [`waitForAsync()`](#waitForAsync) 部分。

### `tick()` 函數

您必須呼叫 [tick()](api/core/testing/tick) 以推進虛擬時鐘。

呼叫 [tick()](api/core/testing/tick) 模擬時間經過，直到所有待處理的非同步活動結束。
在這個案例中，它會等待錯誤處理程序的 `setTimeout()`。

`[tick()]` (api/core/testing/tick) 函數接受 `millis` 和 `tickOptions` 作為參數。`millis` 參數指定虛擬時鐘前進的量，如果未提供，則預設為 `0`。
例如，如果在 `fakeAsync()` 測試中有 `setTimeout(fn, 100)`，則需要使用 `tick(100)` 來觸發 fn 回呼。
可選的 `tickOptions` 參數有一個名為 `processNewMacroTasksSynchronously` 的屬性。`processNewMacroTasksSynchronously` 屬性表示在計時時是否呼叫新產生的巨集任務，預設為 `true`。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick"/>

[tick()](api/core/testing/tick) 函數是您使用 `TestBed` 匯入的 Angular 測試工具之一。
它是 `fakeAsync()` 的搭檔，您只能在 `fakeAsync()` 主體中呼叫它。

### tickOptions

在此範例中，您有一個新的巨集任務，即巢狀 `setTimeout` 函數。預設情況下，當 `tick` 為 setTimeout 時，`outside` 和 `nested` 都會觸發。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-sync"/>

在某些情況下，您不希望在滴答時觸發新的巨集任務。您可以使用 `tick(millis, {processNewMacroTasksSynchronously: false})` 不呼叫新的巨集任務。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-async"/>

### 在 fakeAsync() 內比較日期

`fakeAsync()` 模擬時間流逝，讓你計算 `fakeAsync()` 內部日期之間的差異。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-date"/>

### jasmine.clock 與 fakeAsync()

Jasmine 也提供了一個 `clock` 功能來模擬日期。
Angular 自動執行在 `fakeAsync()` 方法內呼叫 `jasmine.clock().install()` 之後執行的測試，直到呼叫 `jasmine.clock().uninstall()` 為止。
如果巢狀使用，則不需要 `fakeAsync()`，且會擲回錯誤。

預設情況下，此功能已被停用。
若要啟用此功能，請在匯入 `zone-testing` 之前設定一個全域旗標。

如果您使用 Angular CLI，請在 `src/test.ts` 中設定此標誌。

<docs-code language="typescript">

[window as any]('&lowbar;&lowbar;zone&lowbar;symbol__fakeAsyncPatchLock') = true;
import 'zone.js/testing';

</docs-code>

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-clock"/>

### 在 fakeAsync() 內使用 RxJS 排程器

你也可以在 `fakeAsync()` 中使用 RxJS 排程器，就像使用 `setTimeout()` 或 `setInterval()` 一樣，但你必須匯入 `zone.js/plugins/zone-patch-rxjs-fake-async` 來修補 RxJS 排程器。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-rxjs"/>

### 支援更多 macroTasks

預設情況下，`fakeAsync()` 支援下列巨集任務。

* `setTimeout`
* `setInterval`
* `requestAnimationFrame`
* `webkitRequestAnimationFrame`
* `mozRequestAnimationFrame`

如果執行其他巨集任務，例如 `HTMLCanvasElement.toBlob()`，將會引發「*在偽非同步測試中安排的未知巨集任務*」錯誤。

<docs-code-multifile>
    <docs-code header="src/app/shared/canvas.component.spec.ts (failing)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="without-toBlob-macrotask"/>
    <docs-code header="src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="main"/>
</docs-code-multifile>

如果您想要支援這種情況，您需要在 `beforeEach()` 中定義您想要支援的巨集任務。
例如：

<docs-code header="src/app/shared/canvas.component.spec.ts (excerpt)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="enable-toBlob-macrotask"/>

HELPFUL: 為了讓 `<canvas>` 元素在您的應用程式中支援 Zone.js，您需要匯入 `zone-patch-canvas` 修補程式（在 `polyfills.ts` 或使用 `<canvas>` 的特定檔案中）：

<docs-code header="src/polyfills.ts or src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="import-canvas-patch"/>

### 非同步 observables

您可能會滿意這些測試的測試覆蓋率。

然而，您可能會為實際服務無法以這種方式運行感到困擾。
實際服務會將請求發送到遠端伺服器。
伺服器需要時間來回應，而且回應肯定不會像前兩個測試那樣立即可用。

如果像這樣從 `getQuote()` 間諜函數回傳一個非同步可觀察物件，您的測試將更忠實地反映真實世界。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-setup"/>

### 非同步 observable 輔助程式

非同步 observable 是由 `asyncData` 輔助程式產生的。
`asyncData` 輔助程式是一個公用函數，您必須自行撰寫，或是從範例程式碼複製這個。

<docs-code header="testing/async-observable-helpers.ts" path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-data"/>

此輔助工具的可觀察目標會在 JavaScript 引擎的下一輪發出 `data` 值。

[RxJS `defer()` 運算子](http://reactivex.io/documentation/operators/defer.html) 傳回一個可觀察物。
它採用一個工廠函數，該函數傳回一個承諾或一個可觀察物。
當某些東西訂閱 *defer* 的可觀察物時，它會將訂閱者新增到使用該工廠建立的新可觀察物。

`defer()` 運算子將 `Promise.resolve()` 轉換為一個新的可觀察對象，像 `HttpClient` 一樣發射一次並完成。
訂閱者在收到資料值後會取消訂閱。

有一個產生非同步錯誤的類似輔助程式。

<docs-code path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-error"/>

### 更多非同步測試

現在 `getQuote()` 間諜會傳回非同步可觀察資料，因此您的大部分測試也必須是非同步的。

以下是一個 `fakeAsync()` 測試，展示了您在真實世界中預期的數據流程。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="fake-async-test"/>

注意，引用元素在 `ngOnInit()` 之後顯示預留位置值 \(`'...'`\)。
第一句引文尚未到達。

若要從可觀察物件清除第一個引號，請呼叫 [tick()](api/core/testing/tick)。
然後呼叫 `detectChanges()` 以告訴 Angular 更新畫面。

然後你可以斷言引號元素顯示預期的文字。

### 使用 `waitForAsync()` 進行非同步測試`

若要使用 `waitForAsync()` 功能，必須在測試設定檔案中匯入 `zone.js/testing`。
如果您使用 Angular CLI 建立專案，`zone-testing` 已經在 `src/test.ts` 中匯入。

以下是上一個 `fakeAsync()` 測試，使用 `waitForAsync()` 工具重新撰寫。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="waitForAsync-test"/>

`waitForAsync()` 實用工具隱藏了一些非同步樣板，方法是安排測試人員的程式碼在一個特殊的 *非同步測試區域* 中執行。
您不需要將 Jasmine 的 `done()` 傳遞到測試中，並且呼叫 `done()`，因為它在 promise 或可觀察的回呼中是 `undefined`。

但測試的非同步性質可由呼叫 `fixture.whenStable()` 揭露，這會中斷控制的線性流程。

在 `waitForAsync()` 中使用 `intervalTimer()`（例如 `setInterval()`）時，請記得在測試後使用 `clearInterval()` 取消計時器，否則 `waitForAsync()` 永遠不會結束。

### `whenStable`

測試必須等候 `getQuote()` 可觀察項目發出下一個報價。
它不呼叫 [tick()](api/core/testing/tick)，而是呼叫 `fixture.whenStable()`。

`fixture.whenStable()` 會傳回一個在 JavaScript 引擎的任務佇列變為空時解析的 Promise。
在此範例中，當可觀察物件發出第一個報價時，任務佇列就會變為空。

測試在承諾的回呼中繼續執行，該回呼呼叫 `detectChanges()` 以使用預期的文字更新引號元素。

### Jasmine `done()`

儘管 `waitForAsync()` 和 `fakeAsync()` 函式極大地簡化了 Angular 非同步測試，您仍可退而求其次，使用傳統技術，並將 `it` 傳遞給一個函式，該函式接受 [`done` 回呼](https://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support)。

在 `waitForAsync()` 或 `fakeAsync()` 函數中無法呼叫 `done()`，因為 `done 參數` 是 `未定義` 的。

現在您有責任鏈接承諾、處理錯誤，並在適當的時刻調用 `done()`。

使用 `done()` 撰寫測試函數比 `waitForAsync()` 和 `fakeAsync()` 更為繁瑣，但當程式碼涉及 `intervalTimer()`（例如 `setInterval`）時，偶爾需要使用它。

以下是兩個使用 `done()` 編寫的先前測試版本。
第一個訂閱了元件的 `quote` 屬性公開給範本的 `Observable`。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="quote-done-test"/>

RxJS `last()` 算子會在完成之前發出可觀察的最後一個值，這將是測試引號。
`subscribe` 回呼呼叫 `detectChanges()` 以使用測試引號更新引號元素，方式與較早的測試相同。

在某些測試中，您更感興趣的是注入的服務方法是如何被呼叫的，以及它回傳的數值，而不是出現在螢幕上的內容。

服務間諜，像是假 `TwainService` 的 `qetQuote()` 間諜，可以給你這些資訊，並對檢視的狀態做出斷言。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="spy-done-test"/>

## 元件 marble 測試

之前的 `TwainComponent` 測試模擬了來自 `TwainService` 的非同步 observable 回應，使用 `asyncData` 和 `asyncError` 工具。

這些是可以自行撰寫的簡單函數。
很遺憾，它們對於許多常見的情況來說過於簡單。
可觀察物通常會發出多次，可能經過一段時間的延遲。
元件可能會協調多個可觀察物，這些可觀察物具有重疊的數值和錯誤序列。

**RxJS marble testing** 是一種測試可觀察情境（簡單和複雜的）的絕佳方式。
您可能已經看過說明可觀察值如何運作的 [marble diagrams](https://rxmarbles.com)。
Marble 測試使用類似的 marble 語言來指定可觀察串流和測試中的預期值。

以下範例透過 marble 測試重新檢視 `TwainComponent` 測試中的兩個。

首先安裝 `jasmine-marbles` npm 套件。
然後匯入您需要的符號。

<docs-code header="app/twain/twain.component.marbles.spec.ts (import marbles)" path="adev/src/content/examples/testing/src/app/twain/twain.component.marbles.spec.ts" visibleRegion="import-marbles"/>

以下是取得報價的完整測試：

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.marbles.spec.ts" visibleRegion="get-quote-test"/>

注意 Jasmine 測試是同步的。
沒有 `fakeAsync()`。
Marble 測試使用測試排程器來模擬同步測試中時間的流逝。

大理石測試的美感在於可觀察串流的可視化定義。
此測試定義一個等待三個 [frame](#marble-frame) \(`---`\) 的 [*cold* observable](#cold-observable)，發射一個值 \(`x`\)，並完成 \(`|`\)。
在第二個參數中，您將值標記 \(`x`\) 映射到發射的值 \(`testQuote`\)。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.marbles.spec.ts" visibleRegion="test-quote-marbles"/>

`marble` 函式庫建構對應的可觀察對象，測試將其設定為 `getQuote` 間諜的回傳值。

當您準備好要啟動 marble 可觀察項目時，您可以告訴 `TestScheduler` 將其準備好的工作佇列像這樣 *flush* 掉。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.marbles.spec.ts" visibleRegion="test-scheduler-flush"/>

這步驟的用途與先前 `fakeAsync()` 和 `waitForAsync()` 範例中的 [tick()](api/core/testing/tick) 和 `whenStable()` 類似。
測試的其餘部分與那些範例相同。

### 大理石錯誤測試

以下為 `getQuote()` 錯誤測試的大理石測試版本。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.marbles.spec.ts" visibleRegion="error-test"/>

這仍然是一個非同步測試，呼叫 `fakeAsync()` 和 [tick()](api/core/testing/tick)，因為元件本身在處理錯誤時會呼叫 `setTimeout()`。

請查看 marble observable 定義。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.marbles.spec.ts" visibleRegion="error-marbles"/>

這是一個等待三個影格然後發出錯誤的 *冷* observable，雜湊符號 \(`#`\) 字元表示在第三個參數中指定的錯誤計時。
第二個參數為 null，因為 observable 永遠不會發出值。

### 了解大理石測試

*大理石框架* 是測試時間的虛擬單位。
每個符號 \(`-`, `x`, `|`, `#`\) 標示一個框架的經過。

*冷* observable 直到您訂閱它才產生值。
您的應用程式 observable 大多是冷的。
所有 [*HttpClient*](guide/http) 方法都會傳回冷的 observable。

*熱門* 可觀察物件在您訂閱之前已經產生值。
報告路由器活動的 [`Router.events`](api/router/Router#events) 可觀察物件是一個 *熱門* 可觀察物件。

RxJS marble 測試是一個豐富的主題，超出了本指南的範圍。
在網路上了解它，從 [官方文件](https://rxjs.dev/guide/testing/marble-testing) 開始。

## 具有輸入和輸出功能的元件

一個具有輸入和輸出的元件通常出現在主機元件的檢視範本中。
主機使用屬性繫結來設定輸入屬性，並使用事件繫結來聆聽輸出屬性引發的事件。

測試目標是驗證此類別綁定是否按預期運作。
測試應該設定輸入值和偵聽輸出事件。

`DashboardHeroComponent` 是此角色中的一個小範例。
它顯示由 `DashboardComponent` 提供的個別英雄。
點擊該英雄會告訴 `DashboardComponent` 使用者已選擇該英雄。

`DashboardHeroComponent` 嵌入在 `DashboardComponent` 範本中，如下所示：

<docs-code header="app/dashboard/dashboard.component.html (excerpt)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.html" visibleRegion="dashboard-hero"/>

`DashboardHeroComponent` 出現在 `*ngFor` 重複器中，它會將每個元件的 `hero` 輸入屬性設定為循環值，並監聽元件的 `selected` 事件。

以下是元件的完整定義：

<docs-code header="app/dashboard/dashboard-hero.component.ts (component)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.ts" visibleRegion="component"/>

當測試元件如此簡單幾乎沒有內在價值時，知道如何執行測試是有價值的。
使用以下其中一種方法：

* 測試它如同 `DashboardComponent` 使用
* 測試它如同獨立元件
* 測試它如同 `DashboardComponent` 的替代品使用

快速瀏覽 `DashboardComponent` 建構函數會阻止第一種方法：

<docs-code header="app/dashboard/dashboard.component.ts (constructor)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.ts" visibleRegion="ctor"/>

`DashboardComponent` 依賴 Angular 路由器和 `HeroService`。
您可能必須將它們兩個都替換為測試替身，這是一項繁重的工作。
路由器似乎特別具有挑戰性。

HELPFUL: [以下討論](#routing-component)涵蓋了測試需要路由器的元件。

最直接的目標是測試 `DashboardHeroComponent`，而不是 `DashboardComponent`，所以，請嘗試第二和第三個選項。

### 測試 `DashboardHeroComponent` 獨立

以下是規格檔案設定的重點。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="setup"/>

注意設定程式碼將測試英雄 \(`expectedHero`\) 指定給元件的 `hero` 屬性，模擬 `DashboardComponent` 使用其重複器中的屬性繫結設定它的方式。

以下測試驗證英雄名稱透過繫結傳播到範本。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="name-test"/>

由於 [範本](#dashboard-hero-component) 會透過 Angular `UpperCasePipe` 傳遞英雄名稱，測試必須以大寫的名稱比對元素值。

HELPFUL: 這項小型測試展示 Angular 測試如何驗證元件的視覺呈現，這在 [元件類別測試](guide/testing/components-basics#component-class-testing)中無法做到，成本低且無需訴諸速度慢且複雜的端到端測試。

### 點擊

點擊英雄應該會引發 `selected` 事件，主機元件（假設為 `DashboardComponent`）可以聽到：

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test"/>

該元件的 `selected` 屬性傳回一個 `EventEmitter`，它看起來像是給消費者使用的 RxJS 同步 `Observable`。
測試明確地訂閱它，就像主機元件隱式地訂閱一樣。

如果元件行為符合預期，點擊英雄元素應該會告知元件的 `selected` 屬性來發出 `hero` 物件。

該測試透過其對 `selected` 的訂閱來偵測該事件。

### `triggerEventHandler`

前一個測試中的 `heroDe` 是代表英雄 `<div>` 的 `DebugElement`。

它具有 Angular 屬性及方法，可抽象與原生元素的互動。
此測試使用「click」事件名稱呼叫 `DebugElement.triggerEventHandler`。
「click」事件繫結會透過呼叫 `DashboardHeroComponent.click()` 來回應。

Angular `DebugElement.triggerEventHandler` 可以藉由 *事件名稱* 觸發 *任何資料繫結事件*。
第二個參數是傳遞給處理常式的事件物件。

測試觸發了一個「點擊」事件。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="trigger-event-handler"/>

這種情況下，測試正確地假設執行階段事件處理器，即元件的 `click()` 方法，不關心事件物件。

HELPFUL: 其他處理程序比較不寬容。
例如，`RouterLink` 指令期望一個具有 `button` 屬性的物件，用於識別在點擊期間按下哪個滑鼠按鈕（如果有）。
如果事件物件遺失，`RouterLink` 指令會擲回錯誤。

### 點擊元素

以下測試替代方案會呼叫原生元素自身的 `click()` 方法，這對 *此元件* 來說完全沒問題。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-2"/>

### `click()` 輔助函數

點擊按鈕、錨點或任意 HTML 元素是常見的測試任務。

藉由將 *click-triggering* 程序封裝在以下 `click()` 函數等輔助函數中，使之具有一致性且簡單明瞭：

<docs-code header="testing/index.ts (click helper)" path="adev/src/content/examples/testing/src/testing/index.ts" visibleRegion="click-event"/>

第一個參數是 *要點擊的元素*。
如果您願意，可以將自訂的事件物件當成第二個參數傳遞。
預設值是部分 [左鍵滑鼠事件物件](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)，許多處理程式都接受它，包括 `RouterLink` 指令。

重要：`click()` 輔助函數 **並非** Angular 測試實用工具之一。
這是由 *本指南的範例程式碼* 定義的函數。
所有範例測試都會使用它。
如果您喜歡它，請將它新增到您自己的輔助函數集合中。

以下為使用點擊輔助工具，重寫的前一個測試。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-3"/>

## 測試主機內的元件

之前的測試扮演了主機 `DashboardComponent` 本身。
但當正確地將資料繫結到主機元件時，`DashboardHeroComponent` 是否能正常運作？

你可以使用實際的 `DashboardComponent` 進行測試。
但這樣可能需要大量的設定，尤其是當範本具有 `*ngFor` 重複器、其他元件、配置 HTML、其他繫結、注入多個服務的建構函式，而且它會立即開始與這些服務互動時。

想像一下停用這些干擾的努力，只是為了證明一個可以用像這樣的 *測試主機* 令人滿意地完成的觀點：

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host"/>

此測試主機繫結到 `DashboardHeroComponent` 作為 `DashboardComponent`，但沒有 `Router`、`HeroService` 或 `*ngFor` 重複器的雜訊。

測試主機使用其測試英雄設定元件的 `hero` 輸入屬性。
它將元件的 `selected` 事件繫結至其 `onSelected` 處理常式，該常式會在其 `selectedHero` 屬性中記錄發出的英雄。

稍後，測試將能夠檢查 `selectedHero` 以驗證 `DashboardHeroComponent.selected` 事件發出預期的英雄。

`test-host` 測試的設定類似於獨立測試的設定：

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-setup"/>

此測試模組設定顯示三個重要的差異：

* 它 *宣告* `DashboardHeroComponent` 和 `TestHostComponent`
* 它 *建立* `TestHostComponent` 而不是 `DashboardHeroComponent`
* `TestHostComponent` 使用繫結來設定 `DashboardHeroComponent.hero`

`createComponent` 傳回一個包含 `TestHostComponent` 實體（而非 `DashboardHeroComponent` 實體）的 `fixture`。

建立 `TestHostComponent` 有建立 `DashboardHeroComponent` 的副作用，因為後者出現在前者的範本中。

英雄元素的查詢 \(`heroEl`\) 仍然在測試 DOM 中找到它，儘管在元素樹中的深度比以前更大。

測試本身幾乎和單獨版本相同：

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test-host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-tests"/>

只有選取的事件測試不同。
它確認選取的 `DashboardHeroComponent` 英雄確實能透過事件繫結找到其途徑至主機元件。

## 路由元件

一個 *路由元件* 是告訴 `Router` 導航至另一個元件的元件。
`DashboardComponent` 是 *路由元件*，因為使用者可透過點擊資訊面板上的一個 *英雄按鈕* 來導航至 `HeroDetailComponent`。

路由相當複雜。
測試 `DashboardComponent` 看起來令人生畏，部分原因是它涉及到 `Router`，它與 `HeroService` 一起注入。

<docs-code header="app/dashboard/dashboard.component.ts (constructor)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.ts" visibleRegion="ctor"/>

<docs-code header="app/dashboard/dashboard.component.ts (goToDetail)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.ts" visibleRegion="goto-detail" />

Angular 提供測試助手，以減少樣板程式碼，並更有效地測試依賴於路由器和 HttpClient 的程式碼。

<docs-code header="app/dashboard/dashboard.component.spec.ts" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="router-harness"/>

以下測試點擊顯示的英雄並確認我們導航到預期的 URL。

<docs-code header="app/dashboard/dashboard.component.spec.ts (navigate test)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="navigate-test"/>

## 路由元件

一個 *導向元件* 是 `路由器` 導航的目的地。
測試起來可能比較棘手，尤其當元件的路線 *包含參數* 時。
`HeroDetailComponent` 是 *導向元件*，是此類路線的目的地。

當使用者點擊 *Dashboard* 英雄時，`DashboardComponent` 會告訴 `Router` 導航到 `heroes/:id`。
`:id` 是路由參數，其值是編輯英雄的 `id`。

`Router` 將該 URL 比對到 `HeroDetailComponent` 的路由。
它會建立一個包含路由資訊的 `ActivatedRoute` 物件，並將它注入 `HeroDetailComponent` 的新執行個體。

以下是 `HeroDetailComponent` 建構函數：

<docs-code header="app/hero/hero-detail.component.ts (constructor)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="ctor"/>

`HeroDetail` 元件需要 `id` 參數，以便使用 `HeroDetailService` 擷取對應英雄。
元件必須從 `ActivatedRoute.paramMap` 屬性取得 `id`，該屬性是 `Observable`。

它無法只參考 `ActivatedRoute.paramMap` 的 `id` 屬性。
該元件必須 *訂閱* `ActivatedRoute.paramMap` 可觀察項目並在生命週期中隨時準備好讓 `id` 變更。

<docs-code header="app/hero/hero-detail.component.ts (ngOnInit)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="ng-on-init"/>

測試可以透過導覽至不同路由，探索 `HeroDetailComponent` 如何回應不同的 `id` 參數值。

### 使用 `RouterTestingHarness` 進行測試`

以下是展示當觀察的 `id` 參照現有英雄時，元件行為的測試：

<docs-code header="app/hero/hero-detail.component.spec.ts (existing id)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="route-good-id"/>

HELPFUL: 在以下章節中，將討論 `createComponent()` 方法和 `page` 物件。
現在請依賴您的直覺。

當找不到 `id` 時，元件應重新導向到 `HeroListComponent`。

測試套件設定提供了相同的路由器套件 [如上所述](#routing-component)。

此測試希望元件嘗試導覽至 `HeroListComponent`。

<docs-code header="app/hero/hero-detail.component.spec.ts (bad id)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="route-bad-id"/>

## 內嵌元件測試

元件範本通常有巢狀元件，其範本可能包含更多元件。

元件樹可以非常深，並且在大部分時間，巢狀元件在測試樹頂端的元件時不扮演任何角色。

例如，`AppComponent` 顯示包含錨點及其 `RouterLink` 指令的導覽列。

<docs-code header="app/app.component.html" path="adev/src/content/examples/testing/src/app/app.component.html"/>

若要驗證連結，您不需要 `Router` 來導航，也不需要 `<router-outlet>` 來標記 `Router` 插入 *已路由的元件* 的位置。

`BannerComponent` 和 `WelcomeComponent`（由 `<app-banner>` 和 `<app-welcome>` 指示）也無關。

然而，在 DOM 中建立 `AppComponent` 的任何測試也會建立這三個元件的執行個體，而且如果您允許發生這種情況，您必須設定 `TestBed` 來建立它們。

如果您忽略宣告它們，Angular 編譯器將無法辨識 `AppComponent` 範本中的 `<app-banner>`, `<app-welcome>`, 和 `<router-outlet>` 標籤，並且會擲回錯誤。

如果您宣告真實元件，您也必須宣告 *它們* 的嵌套元件，並提供 *任何* 樹中元件中注入的 *所有* 服務。

這只是為了回答有關鏈接的幾個簡單問題而付出了太多努力。

本節介紹兩種用於最小化設定的技巧。
單獨或結合使用，以專注於測試主要元件。

### 忽略不需要的元件

在第一種技術中，您建立並宣告元件和指令的 stub 版本，它們在測試中所扮演的角色很小或根本沒有。

<docs-code header="app/app.component.spec.ts (stub declaration)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="component-stubs"/>

存根選擇器與對應真實元件的選擇器相符。
但其範本和類別是空的。

然後在 `TestBed` 組態中，將它們宣告在需要真實的元件、指令和管線旁邊。

<docs-code header="app/app.component.spec.ts (TestBed stubs)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="testbed-stubs"/>

`AppComponent` 是測試主體，所以當然要宣告真實的版本。

其餘是存根。

### `NO_ERRORS_SCHEMA`

第二種方法，在 `TestBed.schemas` 元數據中加入 `NO_ERRORS_SCHEMA`。

<docs-code header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="no-errors-schema"/>

`NO_ERRORS_SCHEMA` 告知 Angular 編譯器忽略不識別的元素和屬性。

編譯器識別 `<app-root>` 元素和 `routerLink` 屬性，因為您在 `TestBed` 組態中宣告了對應的 `AppComponent` 和 `RouterLink`。

但編譯器在遇到 `<app-banner>`、`<app-welcome>` 或 `<router-outlet>` 時，並不會擲出錯誤。
它只是將它們呈現為空標籤，而瀏覽器會忽略它們。

您不再需要 stub 元件。

### 同時使用兩種技巧

這些是 *淺層元件測試* 的技術，之所以如此命名，是因為它們把元件的可視介面減少到元件範本中對測試很重要的元素。

`NO_ERRORS_SCHEMA` 的方式比較容易，但是不要過度使用。

`NO_ERRORS_SCHEMA` 亦會阻止編譯器告知您無意中遺漏或拼寫錯誤的遺失元件和屬性。
您可能會浪費數小時追查幻影錯誤，而編譯器會立即捕獲這些錯誤。

* stub 元件* 方法還有另一個優點。
雖然 *此* 範例中的存根是空的，但如果您的測試需要與它們互動，您可以為它們提供精簡的範本和類別。

實際上，您會將兩種技術結合在相同的設定中，如同在這個範例中看到的一樣。

<docs-code header="app/app.component.spec.ts (mixed setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="mixed-setup"/>

Angular 編譯器為 `<app-banner>` 元素建立 `BannerStubComponent` 並將 `RouterLink` 套用到具有 `routerLink` 屬性的錨點，但它忽略了 `<app-welcome>` 和 `<router-outlet>` 標籤。

### `By.directive` 和內建指令

再進一步的設定會觸發初始資料繫結，並取得導覽連結的參照：

<docs-code header="app/app.component.spec.ts (test setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="test-setup"/>

三個特別感興趣的點：

* 使用 `By.directive` 找出具有附加指令的錨點元素
* 查詢會傳回與符合元素相關的 `DebugElement` 包裝器
* 每個 `DebugElement` 都會公開一個相依性注入器，其中包含附加到該元素的特定指令實例

AppComponent 連結用以驗證如下：

<docs-code header="app/app.component.html (navigation links)" path="adev/src/content/examples/testing/src/app/app.component.html" visibleRegion="links"/>

以下是一些測試，確認那些連結已如預期般連接到 `routerLink` 指令：

<docs-code header="app/app.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="tests"/>

## 使用 `page` 物件

`HeroDetailComponent` 是一個簡單的檢視，包含標題、兩個英雄欄位和兩個按鈕。

<img alt="HeroDetailComponent in action" src="assets/content/images/guide/testing/hero-detail.component.png">

但即使在這種簡單形式中，也有很多範本複雜性。

<docs-code
  path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"/>

測試元件所需的運算符 &hellip;

* 在英雄出現之前等待元素出現在 DOM 中
* 對標題文字的參照
* 對名稱輸入框的參照，以檢查並設定它
* 對兩個按鈕的參照，以便他們可以點擊
* 偵測一些元件和路由器方法

即使像這個這樣的小表格也可能產生一系列扭曲的條件設置和 CSS 元素選擇。

使用可處理對元件屬性的存取並封裝設定邏輯的 `Page` 類別來控制複雜性。

以下是在 `hero-detail.component.spec.ts` 中的 `Page` 類別

<docs-code header="app/hero/hero-detail.component.spec.ts (Page)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="page"/>

現在，用於元件操作和檢查的重要掛鉤已井然有序地整理並可從 `Page` 的實例存取。

`createComponent` 方法建立一個 `page` 物件，並在 `hero` 到達時填入空格。

<docs-code header="app/hero/hero-detail.component.spec.ts (createComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="create-component"/>

以下是幾個加強觀點的 `HeroDetailComponent` 測試。

<docs-code header="app/hero/hero-detail.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="selected-tests"/>

## 呼叫 `compileComponents()`

HELPFUL：如果您*僅*使用 CLI `ng test` 命令執行測試，請忽略此區段，因為 CLI 會在執行測試前編譯應用程式。

如果您在 **非 CLI 環境** 中執行測試，測試可能會失敗，並顯示類似這樣的訊息：

<docs-code hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</docs-code>

問題的根源是至少一個參與測試的元件指定了一個外部範本或 CSS 檔案，如同以下版本的 `BannerComponent` 所做的一樣。

<docs-code header="app/banner/banner-external.component.ts (external template & css)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.ts"/>

當 `TestBed` 嘗試建立元件時，測試失敗。

<docs-code avoid header="app/banner/banner-external.component.spec.ts (setup that fails)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="setup-may-fail"/>

請記得，應用程式尚未編譯。
因此，當您呼叫 `createComponent()` 時，`TestBed` 會隱式編譯。

當原始碼在記憶體中時，這不是問題。
但 `BannerComponent` 需要編譯器必須從檔案系統讀取的外部檔案，這是一個固有的*異步*操作。

如果允許 `TestBed` 繼續進行，測試將會在編譯器完成之前運行並神秘地失敗。

先發制人的錯誤訊息告訴您使用 `compileComponents()` 明確編譯。

### `compileComponents()` 是非同步的

您必須在非同步測試函數中呼叫 `compileComponents()`。

CRITICAL: 如果你忽略讓測試函數變成非同步（例如，忘記使用 `waitForAsync()` 如說明所示），你將看到此錯誤訊息

<docs-code hideCopy language="shell">

Error: ViewDestroyedError: Attempt to use a destroyed view

</docs-code>

一個典型的方法是將設定邏輯分為兩個獨立的 `beforeEach()` 函數：

| 函數                   | 詳細資料                      |
| :-------------------------- | :--------------------------- |
| 非同步 `beforeEach()` | 編譯元件      |
| 同步 `beforeEach()`  | 執行其餘的設定 |

### 非同步 `beforeEach`

以這種方式撰寫第一個非同步 `beforeEach`。

<docs-code header="app/banner/banner-external.component.spec.ts (async beforeEach)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="async-before-each"/>

`TestBed.configureTestingModule()` 方法會傳回 `TestBed` 類別，因此您可以將呼叫串連至其他 `TestBed` 靜態方法，例如 `compileComponents()`.

在此範例中，`BannerComponent` 是唯一要編譯的元件。
其他範例會使用多個元件來設定測試模組，並且可能會匯入應用程式模組，其中含有更多元件。
其中任何一個都可能需要外部檔案。

`TestBed.compileComponents` 方法會非同步編譯在測試模組中配置的所有元件。

重要：在呼叫 `compileComponents()` 後，請勿重新設定 `TestBed`。

呼叫 `compileComponents()` 會將目前的 `TestBed` 實例關閉以供進一步設定。
您無法呼叫任何其他 `TestBed` 設定方法，不包括 `configureTestingModule()` 或任何 `override...` 方法。
如果您嘗試，`TestBed` 會擲回錯誤。

將 `compileComponents()` 設為在呼叫 `TestBed.createComponent()` 前的最後一個步驟。

### 同步 `beforeEach`

第二個同步 `beforeEach()` 包含其餘的設定步驟，其中包括建立元件和查詢要檢查的元素。

<docs-code header="app/banner/banner-external.component.spec.ts (synchronous beforeEach)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="sync-before-each"/>

相信測試執行器會等待第一個非同步的 `beforeEach` 完成後再呼叫第二個。

### 整合設定

你可以將兩個 `beforeEach()` 函數合併成單一的非同步 `beforeEach()`。

`compileComponents()` 方法會傳回一個 Promise，以便您可以在編譯 *之後* 執行同步設定工作，方法是在 `await` 關鍵字之後移動同步程式碼，Promise 已解析。

<docs-code header="app/banner/banner-external.component.spec.ts (one beforeEach)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="one-before-each"/>

### `compileComponents()` 是無害的

在不需要時呼叫 `compileComponents()` 沒有害處。

即使在執行 `ng test` 時從未需要，CLI 所產生的元件測試檔案仍會呼叫 `compileComponents()`。

本指南中的測試只在必要時呼叫 `compileComponents`。

## 以模組匯入設定

之前的元件測試使用幾個 `declarations` 來組態測試模組，如下所示：

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="config-testbed"/>

DashboardComponent 很簡單。
它不需要任何幫助。
但更複雜的元件通常依賴於其他元件、指令、管道和提供者，這些也必須新增到測試模組中。

幸運的是，`TestBed.configureTestingModule` 參數與傳遞給 `@NgModule` 裝飾器的元數據是平行的，這表示您也可以指定 `providers` 和 `imports`。

儘管 `HeroDetailComponent` 體積小而且結構簡單，但仍需要許多協助。
除了它從預設測試模組 `CommonModule` 收到的支援之外，它還需要：

* `NgModel` 及 `FormsModule` 中的相關函數，以啟用雙向資料繫結
* `shared` 資料夾中的 `TitleCasePipe`
* 路由器服務
* 英雄資料存取服務

一種做法是透過個別片段配置測試模組，如下例所示：

<docs-code header="app/hero/hero-detail.component.spec.ts (FormsModule setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-forms-module"/>

HELPFUL：請注意 `beforeEach()` 是非同步的，並呼叫 `TestBed.compileComponents`，因為 `HeroDetailComponent` 具有外部範本和 css 檔案。

如 [Calling `compileComponents()`](#compile-components) 中所述，這些測試可在非 CLI 環境中執行，Angular 必須在瀏覽器中編譯它們。

### 匯入共用模組

由於許多應用程式元件需要 `FormsModule` 和 `TitleCasePipe`，因此開發人員建立一個 `SharedModule` 以結合這些和其他經常要求的部分。

測試組態也可以使用 `SharedModule`，如在此替代設定中所示：

<docs-code header="app/hero/hero-detail.component.spec.ts (SharedModule setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-shared-module"/>

它更緊湊且更小，導入語句更少，此範例中未顯示。

### 導入功能模組

`HeroDetailComponent` 是 `HeroModule` [Feature Module](guide/ngmodules/feature-modules) 的一部分，它聚合了更多相互依賴的部分，包括 `SharedModule`。
嘗試一個導入 `HeroModule` 的測試配置，如下所示：

<docs-code header="app/hero/hero-detail.component.spec.ts (HeroModule setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-hero-module"/>

只有在 `providers` 中的 *測試替身*。
即使 `HeroDetailComponent` 宣告也不見了。

事實上，如果您嘗試宣告它，Angular 會擲回錯誤，因為 `HeroDetailComponent` 同時在 `HeroModule` 和 `TestBed` 建立的 `DynamicTestModule` 中宣告。

有用的：在模組內有許多相互依賴性且模組很小的時候，匯入元件的功能模組可能是配置測試的最佳方式，而功能模組往往很小。

## 覆寫元件提供者

`HeroDetailComponent` 提供它自己的 `HeroDetailService`。

<docs-code header="app/hero/hero-detail.component.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="prototype"/>

無法在 `TestBed.configureTestingModule` 的 `providers` 中存根元件的 `HeroDetailService`。
這些是 *測試模組* 的提供者，而不是元件。
它們在 *固定裝置級別* 準備依賴項注入器。

Angular 使用其 *自己的* 注入器來建立元件，它是固定裝置注入器的 *子代*。
它將元件的提供者（本例中的 `HeroDetailService`）註冊到子代注入器。

測試無法從固定元件注入器取得子注入器服務。
而 `TestBed.configureTestingModule` 也無法設定它們。

Angular 一直以來都建立了 `HeroDetailService` 的新實例！

HELPFUL: 如果 `HeroDetailService` 對遠端伺服器發出自己的 XHR 呼叫，這些測試可能會失敗或逾時。
可能沒有遠端伺服器可以呼叫。

幸運的是，`HeroDetailService` 將遠端資料存取的責任委派給注入的 `HeroService`。

<docs-code header="app/hero/hero-detail.service.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.service.ts" visibleRegion="prototype"/>

[前一個測試組態](#feature-module-import) 用 `TestHeroService` 替換真正的 `HeroService`，它會攔截伺服器要求並偽造其回應。

如果你沒有那麼幸運怎麼辦？
如果偽造 `HeroService` 很難怎麼辦？
如果 `HeroDetailService` 提出自己的伺服器請求怎麼辦？

`TestBed.overrideComponent` 方法可以將元件的 `providers` 替換成易於管理的 *測試替身*，如下面的設定變化所示：

<docs-code header="app/hero/hero-detail.component.spec.ts (Override setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-override"/>

注意，`TestBed.configureTestingModule` 不再提供假的 `HeroService`，因為它[不需要](#spy-stub)。

### `overrideComponent` 方法

專注於 `overrideComponent` 方法。

<docs-code header="app/hero/hero-detail.component.spec.ts (overrideComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-component-method"/>

它需要兩個參數：要覆寫的元件類型 \(`HeroDetailComponent`\) 和一個覆寫的元數據物件。
[覆寫元數據物件](guide/testing/utility-apis#metadata-override-object) 是以如下方式定義的通用物件：

<docs-code language="javascript">

type MetadataOverride&lt;T&gt; = {
  add?: Partial&lt;T&gt;;
  remove?: Partial&lt;T&gt;;
  set?: Partial&lt;T&gt;;
};

</docs-code>

元數據覆寫物件可以新增和移除元數據屬性中的元素，或完全重設那些屬性。
此範例重設元件的 `providers` 元數據。

`T` 類型參數是您會傳遞給 `@Component` 裝飾器的元數據類型：

<docs-code language="javascript">

selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
&hellip;

</docs-code>

### 提供 *spy stub* (`HeroDetailServiceSpy`)

此範例完全取代元件的 `providers` 陣列，以包含 `HeroDetailServiceSpy` 的新陣列。

`HeroDetailServiceSpy` 是真實 `HeroDetailService` 的 stub 版本，可偽造該服務的所有必要功能。
它既不注入也不委派到下層的 `HeroService`，因此無需為其提供測試替身。

相關的 `HeroDetailComponent` 測試會斷言 `HeroDetailService` 的方法被呼叫，方法是透過監控服務方法。
因此，存根程式碼實作其方法作為間諜：

<docs-code header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="hds-spy"/>

### 覆寫測試

現在，測試可以通過操作 spy-stub 的 `testHero` 直接控制元件的英雄，並確認已呼叫服務方法。

<docs-code header="app/hero/hero-detail.component.spec.ts (override tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-tests"/>

### 更多覆寫

`TestBed.overrideComponent` 方法可以針對相同或不同的元件呼叫多次。
`TestBed` 提供類似的 `overrideDirective`、`overrideModule` 和 `overridePipe` 方法來深入挖掘並替換這些其他類別的部分。

自行探索選項和組合。
