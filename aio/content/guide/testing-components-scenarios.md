# 元件測試情境

本指南探討常見的元件測試使用情境。

<div class="alert is-helpful">

如果你想試用本指南所述的應用程式，可以<live-example name="testing" noDownload>在瀏覽器中執行</live-example>，或<live-example name="testing" downloadOnly>下載並在本機執行</live-example>。

</div>

## 元件繫結

在範例應用程式中，`BannerComponent` 在 HTML 範本中呈現靜態的標題文字。

經過幾次變更後，`BannerComponent` 透過繫結到元件的 `title` 屬性，呈現動態標題，如下所示。

<code-example header="app/banner/banner.component.ts" path="testing/src/app/banner/banner.component.ts" region="component"></code-example>

即使內容如此精簡，你還是決定加入一個測試，確認元件確實在你預期的位置顯示正確的內容。

#### 查詢 `<h1>`
你將撰寫一系列測試，檢查包住 _title_ 屬性插值繫結的 `<h1>` 元素之值。

你更新 `beforeEach`，使用標準的 HTML `querySelector` 找到該元素，並將它指派給 `h1` 變數。

<code-example header="app/banner/banner.component.spec.ts (setup)" path="testing/src/app/banner/banner.component.spec.ts" region="setup"></code-example>

<a id="detect-changes"></a>

#### `createComponent()` 不會繫結資料
在你的第一個測試中，你想看到畫面顯示預設的 `title`。
你的直覺是撰寫一個立即檢查 `<h1>` 的測試，如下所示：

<code-example path="testing/src/app/banner/banner.component.spec.ts" region="expect-h1-default-v1"></code-example>

_該測試失敗_，並顯示下列訊息：

<code-example format="javascript" language="javascript">

expected '' to contain 'Test Tour of Heroes'.

</code-example>

繫結發生在 Angular 執行**變更偵測**時。

在正式環境中，當 Angular 建立一個元件、使用者輸入按鍵，或非同步活動（例如 AJAX）完成時，變更偵測會自動啟動。

`TestBed.createComponent` *不會*觸發變更偵測；修訂後的測試證實了這個事實：

<code-example path="testing/src/app/banner/banner.component.spec.ts" region="test-w-o-detect-changes"></code-example>

#### `detectChanges()`
你必須呼叫 `fixture.detectChanges()`，告訴 `TestBed` 執行資料繫結。
只有到那時，`<h1>` 才會有預期的標題。

<code-example path="testing/src/app/banner/banner.component.spec.ts" region="expect-h1-default"></code-example>

延遲變更偵測是刻意且有用的設計。
它讓測試者有機會在 Angular 啟動資料繫結並呼叫[生命週期鉤子](guide/lifecycle-hooks)*之前*，檢查並變更元件的狀態。

這是另一個測試，它在呼叫 `fixture.detectChanges()` _之前_ 先變更元件的 `title` 屬性。

<code-example path="testing/src/app/banner/banner.component.spec.ts" region="after-change"></code-example>

<a id="auto-detect-changes"></a>

#### 自動變更偵測
`BannerComponent` 測試經常呼叫 `detectChanges`。
有些測試人員偏好 Angular 測試環境自動執行變更偵測。

這可以透過使用 `ComponentFixtureAutoDetect` 提供者來設定 `TestBed` 達成。
先從測試工具程式庫匯入它：

<code-example header="app/banner/banner.component.detect-changes.spec.ts (import)" path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="import-ComponentFixtureAutoDetect"></code-example>

然後將它加入測試模組設定的 `providers` 陣列：

<code-example header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)" path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect"></code-example>

以下是三個示範自動變更偵測如何運作的測試。

<code-example header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)" path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect-tests"></code-example>

第一個測試展示了自動變更偵測的好處。

第二個與第三個測試揭示了一個重要的限制。
Angular 測試環境*不知道*測試變更了元件的 `title`。
`ComponentFixtureAutoDetect` 服務會回應*非同步活動*，例如 promise 解析、計時器與 DOM 事件。
但對元件屬性的直接、同步更新是看不見的。
測試必須手動呼叫 `fixture.detectChanges()`，觸發另一輪變更偵測。

<div class="alert is-helpful">

與其猜測測試 fixture 何時會、何時不會執行變更偵測，本指南的範例*一律*明確地呼叫 `detectChanges()`。
比嚴格需要的次數更常呼叫 `detectChanges()`，也沒有壞處。

</div>

<a id="dispatch-event"></a>

#### 以 `dispatchEvent()` 變更輸入值
若要模擬使用者輸入，請找到輸入元素並設定它的 `value` 屬性。

你將呼叫 `fixture.detectChanges()` 來觸發 Angular 的變更偵測。
但這中間有一個不可或缺的步驟。

Angular 並不知道你設定了輸入元素的 `value` 屬性。
在你呼叫 `dispatchEvent()` 引發元素的 `input` 事件之前，它不會讀取該屬性。
*然後*你呼叫 `detectChanges()`。

下列範例示範了正確的順序。

<code-example header="app/hero/hero-detail.component.spec.ts (pipe test)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe"></code-example>

## 具有外部檔案的元件

前面的 `BannerComponent` 以_內嵌範本_與_內嵌 css_定義，分別在 `@Component.template` 與 `@Component.styles` 屬性中指定。

許多元件以 `@Component.templateUrl` 與 `@Component.styleUrls` 屬性指定_外部範本_與_外部 css_，如下列 `BannerComponent` 的變體所示。

<code-example header="app/banner/banner-external.component.ts (metadata)" path="testing/src/app/banner/banner-external.component.ts" region="metadata"></code-example>

這種語法告訴 Angular 編譯器在元件編譯期間讀取外部檔案。

當你執行 CLI 的 `ng test` 指令時，這不是問題，因為它會_在執行測試之前編譯應用程式_。

然而，如果你在**非 CLI 環境**中執行測試，這個元件的測試可能會失敗。
例如，如果你在像 [plunker](https://plnkr.co) 這樣的網路程式編寫環境中執行 `BannerComponent` 測試，你會看到像這樣的訊息：

<code-example format="output" hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</code-example>

當執行階段環境_在測試本身進行期間_編譯原始碼時，你會得到這個測試失敗訊息。

若要修正這個問題，請呼叫 `compileComponents()`，如以下[呼叫 compileComponents](#compile-components)一節所說明。

<a id="component-with-dependency"></a>

## 具有相依性的元件

元件經常有服務相依性。

`WelcomeComponent` 會向已登入的使用者顯示歡迎訊息。
它依據注入的 `UserService` 的某個屬性，知道使用者是誰：

<code-example header="app/welcome/welcome.component.ts" path="testing/src/app/welcome/welcome.component.ts"></code-example>

`WelcomeComponent` 具有與服務互動的決策邏輯，這些邏輯讓這個元件值得測試。
以下是這個 spec 檔案的測試模組設定：

<code-example header="app/welcome/welcome.component.spec.ts" path="testing/src/app/welcome/welcome.component.spec.ts" region="config-test-module"></code-example>

這次，除了宣告*受測元件*之外，
這個設定還把一個 `UserService` 提供者加入 `providers` 清單。
但不是真實的 `UserService`。

<a id="service-test-doubles"></a>

#### 提供服務測試替身
*受測元件*不一定要注入真實的服務。
事實上，如果它們是測試替身，例如 stub、fake、spy 或 mock，通常更好。
這個 spec 的目的是測試元件，而不是服務，而真實的服務可能帶來麻煩。

注入真實的 `UserService` 可能是一場噩夢。
真實的服務可能會要求使用者提供登入憑證，並嘗試連線到驗證伺服器。
這些行為可能很難攔截。
建立並註冊一個測試替身來代替真實的 `UserService`，要容易也安全得多。

這個特定的測試套件提供了一個 `UserService` 的最小 mock，滿足 `WelcomeComponent` 及其測試的需求：

<code-example header="app/welcome/welcome.component.spec.ts" path="testing/src/app/welcome/welcome.component.spec.ts" region="user-service-stub"></code-example>

<a id="get-injected-service"></a>

#### 取得注入的服務
測試需要存取注入到 `WelcomeComponent` 中的 stub `UserService`。

Angular 有一套階層式注入系統。
從 `TestBed` 建立的根注入器，一路往下到元件樹，注入器可以存在於多個層級。

取得注入服務最安全、**永遠有效**的方法，
是**從受測元件的注入器取得它**。
元件注入器是 fixture 的 `DebugElement` 的一個屬性。

<code-example header="WelcomeComponent's injector" path="testing/src/app/welcome/welcome.component.spec.ts" region="injected-service"></code-example>

<a id="testbed-inject"></a>

#### `TestBed.inject()`
你*也許*還能使用 `TestBed.inject()` 從根注入器取得服務。
這個方法更容易記住，也更簡潔。
但它只有在 Angular 以測試根注入器中的服務執行個體注入元件時才有效。

在這個測試套件中，`UserService` 的*唯一*提供者是根測試模組，因此可以安全地如下呼叫 `TestBed.inject()`：

<code-example header="TestBed injector" path="testing/src/app/welcome/welcome.component.spec.ts" region="inject-from-testbed" ></code-example>

<div class="alert is-helpful">

關於 `TestBed.inject()` 無法運作的使用情境，請參閱[覆寫元件的提供者](#component-override)一節，該節說明了何時以及為何你必須改從元件的注入器取得服務。

</div>

<a id="welcome-spec-setup"></a>

#### 最終設定與測試
以下是完整的 `beforeEach()`，使用 `TestBed.inject()`：

<code-example header="app/welcome/welcome.component.spec.ts" path="testing/src/app/welcome/welcome.component.spec.ts" region="setup"></code-example>

以下是一些測試：

<code-example header="app/welcome/welcome.component.spec.ts" path="testing/src/app/welcome/welcome.component.spec.ts" region="tests"></code-example>

第一個是健全性測試；它確認被 stub 的 `UserService` 有被呼叫且正常運作。

<div class="alert is-helpful">

Jasmine 比對器的第二個參數（例如 `'expected name'`）是選擇性的失敗標籤。
如果期望不成立，Jasmine 會將這個標籤附加到期望失敗訊息中。
在包含多個期望的規格中，它能幫助釐清出了什麼問題，以及是哪個期望失敗。

</div>

其餘的測試則確認服務傳回不同值時元件的邏輯。
第二個測試驗證變更使用者名稱的效果。
第三個測試檢查在沒有已登入使用者時，元件是否顯示適當的訊息。

<a id="component-with-async-service"></a>

## 具有非同步服務的元件

在這個範例中，`AboutComponent` 範本承載了一個 `TwainComponent`。
`TwainComponent` 會顯示 Mark Twain 的名言。

<code-example header="app/twain/twain.component.ts (template)" path="testing/src/app/twain/twain.component.ts" region="template" ></code-example>

<div class="alert is-helpful">

元件的 `quote` 屬性之值會通過一個 `AsyncPipe`。
這表示該屬性傳回的是 `Promise` 或 `Observable`。

</div>

在這個範例中，`TwainComponent.getQuote()` 方法告訴你，`quote` 屬性傳回的是一個 `Observable`。

<code-example header="app/twain/twain.component.ts (getQuote)" path="testing/src/app/twain/twain.component.ts" region="get-quote"></code-example>

`TwainComponent` 從注入的 `TwainService` 取得名言。
在服務能傳回第一句名言之前，元件先以一個佔位值（`'...'`）作為傳回的 `Observable` 的起始值。

`catchError` 會攔截服務錯誤、準備錯誤訊息，並在成功通道上傳回佔位值。
它必須等候一個 tick 才能設定 `errorMessage`，以免在同一個變更偵測週期內更新該訊息兩次。

這些都是你會想測試的功能。

#### 使用 spy 進行測試
測試元件時，重要的應該只有服務的公開 API。
一般而言，測試本身不應該呼叫遠端伺服器。
它們應該模擬這類呼叫。
這個 `app/twain/twain.component.spec.ts` 中的設定展示了其中一種做法：

<code-example header="app/twain/twain.component.spec.ts (setup)" path="testing/src/app/twain/twain.component.spec.ts" region="setup"></code-example>

<a id="service-spy"></a>

請聚焦在 spy 上。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="spy"></code-example>

這個 spy 的設計讓任何對 `getQuote` 的呼叫都能收到一個帶有測試名言的 observable。
與真實的 `getQuote()` 方法不同，這個 spy 繞過了伺服器，傳回一個值可立即取得的同步 observable。

即使這個 spy 的 `Observable` 是同步的，你也可以用它撰寫許多有用的測試。

<a id="sync-tests"></a>

#### 同步測試
同步 `Observable` 的一個關鍵優勢是，你經常可以把非同步程序轉變為同步測試。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="sync-test"></code-example>

由於 spy 的結果是同步傳回的，`getQuote()` 方法會在 Angular 呼叫 `ngOnInit` 的第一個變更偵測週期*之後*，立即更新螢幕上的訊息。

測試錯誤路徑時就沒這麼幸運了。
雖然服務 spy 會同步傳回錯誤，但元件方法呼叫了 `setTimeout()`。
測試必須至少等候 JavaScript 引擎的一整個回合，值才會變得可用。
測試必須變成*非同步*的。

<a id="fake-async"></a>

#### 使用 `fakeAsync()` 的非同步測試
要使用 `fakeAsync()` 功能，你必須在測試設定檔中匯入 `zone.js/testing`。
如果你是用 Angular CLI 建立專案，`zone-testing` 已經在 `src/test.ts` 中匯入了。

下列測試確認服務傳回 `ErrorObservable` 時的預期行為。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="error-test"></code-example>

<div class="alert is-helpful">

**NOTE**: <br />
`it()` 函式接收下列形式的引數。

</div>

<code-example format="javascript" language="javascript">

fakeAsync(() =&gt; { /* test body */ })

</code-example>

`fakeAsync()` 函式透過在特殊的 `fakeAsync test zone` 中執行測試主體，啟用線性的程式撰寫風格。
測試主體看起來是同步的。
沒有巢狀語法（例如 `Promise.then()`）來打斷控制流程。

<div class="alert is-helpful">

限制：如果測試主體發出 `XMLHttpRequest`（XHR）呼叫，`fakeAsync()` 函式將無法運作。
測試中的 XHR 呼叫很少見，但如果你需要呼叫 XHR，請參閱 [`waitForAsync()`](#waitForAsync) 一節。

</div>

<a id="tick"></a>

#### `tick()` 函式
你確實必須呼叫 [tick()](api/core/testing/tick) 來推進虛擬時鐘。

呼叫 [tick()](api/core/testing/tick) 會模擬時間的流逝，直到所有擱置中的非同步活動完成。
在這個案例中，它會等待錯誤處理常式的 `setTimeout()`。

[tick()](api/core/testing/tick) 函式接受 milliseconds 與 tickOptions 作為參數；millisecond 參數表示虛擬時鐘推進多少，未提供時預設為 0。
例如，如果你在 `fakeAsync()` 測試中有一個 `setTimeout(fn, 100)`，你需要使用 `tick(100)` 來觸發 fn 回呼。
tickOptions 是選擇性參數，帶有一個名為 `processNewMacroTasksSynchronously` 的屬性（預設為 true），表示在 tick 時是否要叫用新產生的巨集任務。

<code-example path="testing/src/app/demo/async-helper.spec.ts" region="fake-async-test-tick"></code-example>

[tick()](api/core/testing/tick) 函式是你透過 `TestBed` 匯入的 Angular 測試工具之一。
它是 `fakeAsync()` 的夥伴，而且只能在 `fakeAsync()` 主體內呼叫它。

#### tickOptions

<code-example path="testing/src/app/demo/async-helper.spec.ts" region="fake-async-test-tick-new-macro-task-sync"></code-example>

在這個範例中，你有一個新的巨集任務（巢狀 setTimeout），預設情況下，當 `tick` 是 setTimeout 時，`outside` 與 `nested` 都會被觸發。

<code-example path="testing/src/app/demo/async-helper.spec.ts" region="fake-async-test-tick-new-macro-task-async"></code-example>

而在某些情況下，你不想在 tick 時觸發新的巨集任務，可以使用 `tick(milliseconds, {processNewMacroTasksSynchronously: false})`，避免叫用新的巨集任務。

#### 在 fakeAsync() 中比較日期
`fakeAsync()` 模擬時間的流逝，讓你可以在 `fakeAsync()` 內計算日期之間的差異。

<code-example path="testing/src/app/demo/async-helper.spec.ts" region="fake-async-test-date"></code-example>

#### 搭配 fakeAsync() 使用 jasmine.clock
Jasmine 也提供 `clock` 功能來模擬日期。
對於在 `fakeAsync()` 方法內、呼叫 `jasmine.clock().install()` 之後執行的測試，Angular 會自動執行它們，直到呼叫 `jasmine.clock().uninstall()` 為止。
不需要 `fakeAsync()`，而且巢狀使用時會擲出錯誤。

預設情況下，這個功能是停用的。
若要啟用它，請在匯入 `zone-testing` 之前設定一個全域旗標。

如果你使用 Angular CLI，請在 `src/test.ts` 中設定這個旗標。

<code-example format="typescript" language="typescript">

(window as any)['&lowbar;&lowbar;zone&lowbar;symbol__fakeAsyncPatchLock'] = true;
import 'zone.js/testing';

</code-example>

<code-example path="testing/src/app/demo/async-helper.spec.ts" region="fake-async-test-clock"></code-example>

#### 在 fakeAsync() 中使用 RxJS 排程器
你也可以在 `fakeAsync()` 中使用 RxJS 排程器，就像使用 `setTimeout()` 或 `setInterval()` 一樣，但你需要匯入 `zone.js/plugins/zone-patch-rxjs-fake-async` 來為 RxJS 排程器套用修補。

<code-example path="testing/src/app/demo/async-helper.spec.ts" region="fake-async-test-rxjs"></code-example>

#### 支援更多 macroTasks
預設情況下，`fakeAsync()` 支援下列巨集任務。

- `setTimeout`
- `setInterval`
- `requestAnimationFrame`
- `webkitRequestAnimationFrame`
- `mozRequestAnimationFrame`

如果你執行其他巨集任務，例如 `HTMLCanvasElement.toBlob()`，就會擲出一個_「Unknown macroTask scheduled in fake async test」_錯誤。

<code-tabs>
    <code-pane header="src/app/shared/canvas.component.spec.ts (failing)" path="testing/src/app/shared/canvas.component.spec.ts" region="without-toBlob-macrotask"></code-pane>
    <code-pane header="src/app/shared/canvas.component.ts" path="testing/src/app/shared/canvas.component.ts" region="main"></code-pane>
</code-tabs>

如果你想支援這種情況，你需要在 `beforeEach()` 中定義你想支援的巨集任務。
例如：

<code-example header="src/app/shared/canvas.component.spec.ts (excerpt)" path="testing/src/app/shared/canvas.component.spec.ts" region="enable-toBlob-macrotask"></code-example>

<div class="alert is-helpful">

為了讓 `<canvas>` 元素在你的應用程式中感知 Zone.js，你需要匯入 `zone-patch-canvas` 修補（在 `polyfills.ts` 中，或在使用 `<canvas>` 的特定檔案中）：

</div>

<code-example header="src/polyfills.ts or src/app/shared/canvas.component.ts" path="testing/src/app/shared/canvas.component.ts" region="import-canvas-patch"></code-example>

#### 非同步 observables
你可能對這些測試的測試覆蓋率感到滿意。

然而，你可能會對真實服務並非完全如此運作而感到困擾。
真實服務會向遠端伺服器送出請求。
伺服器需要時間回應，而且回應當然不會像前兩個測試那樣立即可用。

如果你從 `getQuote()` spy 傳回一個_非同步_ observable，如下所示，你的測試將更忠實地反映真實世界。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="async-setup"></code-example>

#### 非同步 observable 輔助函式
這個非同步 observable 是由一個 `asyncData` 輔助函式產生的。
`asyncData` 輔助函式是一個工具函式，你必須自己撰寫，或從範例程式碼複製這一個。

<code-example header="testing/async-observable-helpers.ts" path="testing/src/testing/async-observable-helpers.ts" region="async-data"></code-example>

這個輔助函式的 observable 會在 JavaScript 引擎的下一輪中發出 `data` 值。

[RxJS `defer()` 運算子](http://reactivex.io/documentation/operators/defer.html) 會傳回一個 observable。
它接受一個傳回 promise 或 observable 的工廠函式。
當有東西訂閱 _defer_ 的 observable 時，它會將訂閱者加入以該工廠建立的新 observable。

`defer()` 運算子將 `Promise.resolve()` 轉換成一個新的 observable，它像 `HttpClient` 一樣，發出一次後即完成。
訂閱者在收到資料值之後會被取消訂閱。

有一個類似的輔助函式用於產生非同步錯誤。

<code-example path="testing/src/testing/async-observable-helpers.ts" region="async-error"></code-example>

#### 更多非同步測試
現在 `getQuote()` spy 傳回的是非同步 observable，你的大多數測試也必須是非同步的。

以下是一個 `fakeAsync()` 測試，展示你在真實世界中預期的資料流。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="fake-async-test"></code-example>

請注意，名言元素在 `ngOnInit()` 之後顯示的是佔位值（`'...'`）。
第一句名言尚未送達。

若要將第一句名言從 observable 中排出，你呼叫 [tick()](api/core/testing/tick)。
然後呼叫 `detectChanges()`，告訴 Angular 更新畫面。

接著你就可以斷言名言元素顯示預期的文字。

<a id="waitForAsync"></a>

#### 使用 `waitForAsync()` 的非同步測試
要使用 `waitForAsync()` 功能，你必須在測試設定檔中匯入 `zone.js/testing`。
如果你是用 Angular CLI 建立專案，`zone-testing` 已經在 `src/test.ts` 中匯入了。

以下是上一個 `fakeAsync()` 測試以 `waitForAsync()` 公用程式改寫後的版本。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="waitForAsync-test"></code-example>

`waitForAsync()` 公用程式會安排測試者的程式碼在一個特殊的*非同步測試區域*中執行，藉此隱藏一些非同步樣板程式碼。
你不需要把 Jasmine 的 `done()` 傳入測試並呼叫 `done()`，因為它在 promise 或 observable 回呼中是 `undefined`。

但測試的非同步本質，會從對 `fixture.whenStable()` 的呼叫中顯露出來，它打破了線性的控制流。

在 `waitForAsync()` 中使用 `setInterval()` 這類 `intervalTimer()` 時，記得在測試後以 `clearInterval()` 取消計時器，否則 `waitForAsync()` 永遠不會結束。

<a id="when-stable"></a>

#### `whenStable`
測試必須等待 `getQuote()` observable 發出下一句名言。
它不呼叫 [tick()](api/core/testing/tick)，而是呼叫 `fixture.whenStable()`。

`fixture.whenStable()` 傳回一個 promise，在 JavaScript 引擎的工作佇列變空時解析。
在這個範例中，當 observable 發出第一句名言時，工作佇列就會變空。

測試在 promise 回呼中恢復，該回呼呼叫 `detectChanges()`，以預期的文字更新名言元素。

<a id="jasmine-done"></a>

#### Jasmine `done()`
雖然 `waitForAsync()` 與 `fakeAsync()` 函式大幅簡化了 Angular 非同步測試，你仍然可以退回到傳統技巧，傳給 `it` 一個接受 [`done` 回呼](https://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support) 的函式。

你不能在 `waitForAsync()` 或 `fakeAsync()` 函式中呼叫 `done()`，因為 `done parameter` 是 `undefined`。

現在你要負責串連 promise、處理錯誤，並在適當的時機呼叫 `done()`。

使用 `done()` 撰寫測試函式比 `waitForAsync()` 和 `fakeAsync()` 更繁瑣，但當程式碼涉及像 `setInterval` 這類 `intervalTimer()` 時，偶爾有其必要。

以下是上一個測試的另外兩個版本，以 `done()` 撰寫。
第一個版本訂閱元件的 `quote` 屬性向範本公開的 `Observable`。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="quote-done-test"></code-example>

RxJS 的 `last()` 運算子會在完成之前發出 observable 的最後一個值，那將是測試名言。
`subscribe` 回呼呼叫 `detectChanges()`，以與稍早的測試相同的方式，用測試名言更新名言元素。

在某些測試中，你比較在意的是注入的服務方法如何被呼叫、傳回了什麼值，而不是螢幕上出現了什麼。

服務 spy，例如假 `TwainService` 的 `qetQuote()` spy，可以給你這些資訊，並對檢視的狀態做出斷言。

<code-example path="testing/src/app/twain/twain.component.spec.ts" region="spy-done-test"></code-example>

<a id="marble-testing"></a>

## 元件 marble 測試

先前的 `TwainComponent` 測試使用 `asyncData` 與 `asyncError` 公用程式，模擬了 `TwainService` 的非同步 observable 回應。

這些是簡短、簡單的函式，你可以自己撰寫。
不幸的是，對許多常見情境來說，它們太過簡單。
observable 經常會發出多次，可能在一段顯著的延遲之後。
元件可能要協調多個 observable，它們的值與錯誤序列彼此重疊。

**RxJS marble 測試**是測試 observable 情境（無論簡單或複雜）的好方法。
你可能看過用來說明 observables 如何運作的 [marble 圖](https://rxmarbles.com)。
Marble 測試使用類似的 marble 語言，在你的測試中指定 observable 串流與期望。

以下範例以 marble 測試重訪兩個 `TwainComponent` 測試。

先安裝 `jasmine-marbles` npm 套件。
然後匯入你需要的符號。

<code-example header="app/twain/twain.component.marbles.spec.ts (import marbles)" path="testing/src/app/twain/twain.component.marbles.spec.ts" region="import-marbles"></code-example>

以下是取得名言的完整測試：

<code-example path="testing/src/app/twain/twain.component.marbles.spec.ts" region="get-quote-test"></code-example>

請注意，Jasmine 測試是同步的。
沒有 `fakeAsync()`。
Marble 測試使用測試排程器，在同步測試中模擬時間的流逝。

Marble 測試的美妙之處，在於 observable 串流的視覺化定義。
這個測試定義了一個 [*cold* observable](#cold-observable)，它等待三個 [frame](#marble-frame)（`---`）、發出一個值（`x`），然後完成（`|`）。
在第二個引數中，你把值標記（`x`）對應到發出的值（`testQuote`）。

<code-example path="testing/src/app/twain/twain.component.marbles.spec.ts" region="test-quote-marbles"></code-example>

marble 函式庫會建構對應的 observable，測試將它設為 `getQuote` spy 的傳回值。

當你準備啟動 marble observables 時，你告訴 `TestScheduler` 像這樣 *flush* 它已準備好的任務佇列。

<code-example path="testing/src/app/twain/twain.component.marbles.spec.ts" region="test-scheduler-flush"></code-example>

這個步驟的目的，類似於稍早 `fakeAsync()` 與 `waitForAsync()` 範例中的 [tick()](api/core/testing/tick) 與 `whenStable()`。
測試的其餘部分與那些範例相同。

#### Marble 錯誤測試
以下是 `getQuote()` 錯誤測試的 marble 測試版本。

<code-example path="testing/src/app/twain/twain.component.marbles.spec.ts" region="error-test"></code-example>

它仍然是非同步測試，呼叫 `fakeAsync()` 與 [tick()](api/core/testing/tick)，因為元件本身在處理錯誤時呼叫了 `setTimeout()`。

看一下 marble observable 的定義。

<code-example path="testing/src/app/twain/twain.component.marbles.spec.ts" region="error-marbles"></code-example>

這是一個 *cold* observable，等待三個 frame 後發出一個錯誤，hash（`#`）字元表示在第三個引數中指定的錯誤時機。
第二個引數是 null，因為這個 observable 從不發出值。

#### 了解 marble 測試
<a id="marble-frame"></a>

*marble frame* 是測試時間的一個虛擬單位。
每個符號（`-`、`x`、`|`、`#`）標記一個 frame 的流逝。

<a id="cold-observable"></a>

*cold* observable 在你訂閱它之前不會產生值。
你的應用程式中大多數 observable 都是 cold。
所有 [*HttpClient*](guide/http) 方法都會傳回 cold observable。

*hot* observable 在你訂閱它*之前*就已經在產生值。
[`Router.events`](api/router/Router#events) observable 會報告路由器的活動，是一個 *hot* observable。

RxJS marble 測試是一個豐富的主題，超出本指南的範圍。
從[官方文件](https://rxjs.dev/guide/testing/marble-testing)開始，在網路上了解它。

<a id="component-with-input-output"></a>

## 具有輸入與輸出的元件

具有輸入與輸出的元件，通常出現在宿主元件的檢視範本內。
宿主使用屬性繫結來設定輸入屬性，並使用事件繫結來監聽輸出屬性引發的事件。

測試的目標是驗證這類繫結是否如預期運作。
測試應該設定輸入值，並監聽輸出事件。

`DashboardHeroComponent` 是扮演這個角色的一個小範例元件。
它顯示由 `DashboardComponent` 提供的一位英雄。
點選該英雄會告訴 `DashboardComponent`，使用者已選取該英雄。

`DashboardHeroComponent` 像這樣內嵌在 `DashboardComponent` 範本中：

<code-example header="app/dashboard/dashboard.component.html (excerpt)" path="testing/src/app/dashboard/dashboard.component.html" region="dashboard-hero"></code-example>

`DashboardHeroComponent` 出現在一個 `*ngFor` 重複器中，該重複器將每個元件的 `hero` 輸入屬性設為迴圈的值，並監聽元件的 `selected` 事件。

以下是元件的完整定義：

<a id="dashboard-hero-component"></a>

<code-example header="app/dashboard/dashboard-hero.component.ts (component)" path="testing/src/app/dashboard/dashboard-hero.component.ts" region="component"></code-example>

雖然測試這麼簡單的元件本身沒有多少價值，但知道怎麼做還是有用的。
請使用下列方法之一：

* 依它被 `DashboardComponent` 使用的方式來測試它
* 將它作為獨立元件來測試
* 依它被 `DashboardComponent` 的替代者使用的方式來測試它

快速看一眼 `DashboardComponent` 的建構函式，就會讓人打消第一個方法的念頭：

<code-example header="app/dashboard/dashboard.component.ts (constructor)" path="testing/src/app/dashboard/dashboard.component.ts" region="ctor"></code-example>

`DashboardComponent` 相依於 Angular 路由器與 `HeroService`。
你可能必須把兩者都換成測試替身，那是很多工作。
路由器看起來特別具有挑戰性。

<div class="alert is-helpful">

[下面的討論](#路由元件)涵蓋了需要路由器的元件之測試。

</div>

眼前的目標是測試 `DashboardHeroComponent`，而不是 `DashboardComponent`，所以請試試第二與第三個選項。

<a id="dashboard-standalone"></a>

#### 以獨立方式測試 `DashboardHeroComponent`
以下是規格檔案設定的核心部分。

<code-example header="app/dashboard/dashboard-hero.component.spec.ts (setup)" path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="setup"></code-example>

請注意，設定程式碼如何把一個測試英雄（`expectedHero`）指派給元件的 `hero` 屬性，模擬 `DashboardComponent` 在其重複器中使用屬性繫結設定它的方式。

下列測試驗證英雄名稱是否透過繫結傳遞到範本中。

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="name-test"></code-example>

由於[範本](#dashboard-hero-component)會讓英雄名稱通過 Angular `UpperCasePipe`，測試必須以轉成大寫的名稱來比對元素的值。

<div class="alert is-helpful">

這個小測試示範了 Angular 測試如何以低成本驗證元件的視覺呈現——這是[元件類別測試](guide/testing-components-basics#元件類別測試)做不到的——而不必訴諸慢得多也複雜得多的端對端測試。

</div>

#### 點選
點選英雄應該引發一個 `selected` 事件，讓宿主元件（推測是 `DashboardComponent`）能聽到：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="click-test"></code-example>

元件的 `selected` 屬性回傳一個 `EventEmitter`，對使用者而言，它看起來就像一個 RxJS 的同步 `Observable`。
測試_明確地_訂閱它，就像宿主元件_隱含地_做的那樣。

如果元件如預期運作，點選英雄的元素應該會讓元件的 `selected` 屬性發出 `hero` 物件。

測試透過它對 `selected` 的訂閱偵測到該事件。

<a id="trigger-event-handler"></a>

#### `triggerEventHandler`
上一個測試中的 `heroDe` 是一個 `DebugElement`，代表英雄的 `<div>`。

它具有 Angular 的屬性與方法，抽象化了與原生元素的互動。
這個測試以「click」事件名稱呼叫 `DebugElement.triggerEventHandler`。
「click」事件繫結會以呼叫 `DashboardHeroComponent.click()` 來回應。

Angular 的 `DebugElement.triggerEventHandler` 可以依_事件名稱_引發_任何資料繫結事件_。
第二個參數是傳給處理常式的事件物件。

這個測試觸發了一個「click」事件。

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="trigger-event-handler"></code-example>

測試假設（在這個情況下是正確的）執行期事件處理常式，也就是元件的 `click()` 方法，並不在意事件物件。

<div class="alert is-helpful">

其他處理常式就沒這麼寬容了。
舉例來說，`RouterLink` 指令預期事件物件帶有一個 `button` 屬性，用來識別點選期間按下了哪個滑鼠按鈕（如果有的話）。
如果事件物件缺失，`RouterLink` 指令會擲出錯誤。

</div>

#### 點選元素
下列替代測試呼叫原生元素自己的 `click()` 方法，這對_這個元件_來說完全沒問題。

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="click-test-2"></code-example>

<a id="click-helper"></a>

#### `click()` 輔助函式
點選按鈕、錨點或任意 HTML 元素，是常見的測試工作。

將_觸發點選_的過程封裝在像下列 `click()` 函式這樣的輔助函式中，讓這件事保持一致且簡單明瞭：

<code-example header="testing/index.ts (click helper)" path="testing/src/testing/index.ts" region="click-event"></code-example>

第一個參數是_要點選的元素_。
如果你想的話，可以將自訂事件物件作為第二個參數傳入。
預設值是一個部分的[左鍵滑鼠事件物件](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)，許多處理常式（包括 `RouterLink` 指令）都能接受它。

<div class="alert is-important">

`click()` 輔助函式**不是** Angular 測試公用程式之一。
它是定義在_本指南範例程式碼_中的函式。
所有的範例測試都使用它。
如果你喜歡它，就將它加入你自己的輔助函式收藏中。

</div>

以下是上一個測試以點選輔助函式改寫後的版本。

<code-example header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)" path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="click-test-3"></code-example>

<a id="component-inside-test-host"></a>

## 位於測試宿主中的元件

前面的測試自己扮演了宿主 `DashboardComponent` 的角色。
但當 `DashboardHeroComponent` 正確地資料繫結到一個宿主元件時，它能正常運作嗎？

你可以用實際的 `DashboardComponent` 來測試。
但這麼做可能需要很多設定，特別是當它的範本具有一個 `*ngFor` 重複器、其他元件、版面 HTML、額外的繫結，一個注入多個服務的建構函式，而且它一開始就與這些服務互動時。

想像一下，要費多大的力氣來排除這些干擾，只為了證明一個用像這樣的*測試宿主*就能令人滿意地達成的論點：

<code-example header="app/dashboard/dashboard-hero.component.spec.ts (test host)" path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host"></code-example>

這個測試宿主以 `DashboardComponent` 會用的方式繫結到 `DashboardHeroComponent`，但沒有 `Router`、`HeroService` 或 `*ngFor` 重複器的噪音。

測試宿主以它的測試英雄設定元件的 `hero` 輸入屬性。
它以自己的 `onSelected` 處理常式繫結元件的 `selected` 事件，該處理常式會將發出的英雄記錄在它的 `selectedHero` 屬性中。

稍後，測試將能檢查 `selectedHero`，驗證 `DashboardHeroComponent.selected` 事件是否發出了預期的英雄。

`test-host` 測試的設定與獨立測試的設定類似：

<code-example header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)" path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-setup"></code-example>

這個測試模組設定展示了三個重要的差異：

* 它*宣告*了 `DashboardHeroComponent` 與 `TestHostComponent` 兩者
* 它*建立*的是 `TestHostComponent`，而不是 `DashboardHeroComponent`
* `TestHostComponent` 以繫結設定 `DashboardHeroComponent.hero`

`createComponent` 傳回的 `fixture` 持有的是 `TestHostComponent` 的實例，而不是 `DashboardHeroComponent` 的實例。

建立 `TestHostComponent` 的副作用是建立了一個 `DashboardHeroComponent`，因為後者出現在前者的範本中。
對英雄元素的查詢（`heroEl`）仍然能在測試 DOM 中找到它，儘管它在元素樹中的深度比之前更大。

這些測試本身與獨立版本幾乎完全相同：

<code-example header="app/dashboard/dashboard-hero.component.spec.ts (test-host)" path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-tests"></code-example>

只有 selected 事件測試不同。
它確認所選的 `DashboardHeroComponent` 英雄確實透過事件繫結一路傳遞到宿主元件。

<a id="routing-component"></a>

## 路由元件

_路由元件_ 是告訴 `Router` 導航到另一個元件的元件。
`DashboardComponent` 是一個_路由元件_，因為使用者可以點選儀表板上的某個_英雄按鈕_，導航到 `HeroDetailComponent`。

路由是相當複雜的。
測試 `DashboardComponent` 之所以看起來令人卻步，一部分原因是它涉及到與 `HeroService` 一起注入的 `Router`。

<code-example header="app/dashboard/dashboard.component.ts (constructor)" path="testing/src/app/dashboard/dashboard.component.ts" region="ctor"></code-example>

用 spy 替身模擬 `HeroService` 是一個[熟悉的故事](#component-with-async-service)。
但 `Router` 有一個複雜的 API，而且與其他服務和應用程式先決條件糾纏在一起。
模擬它會不會很困難呢？

幸好，在這個例子中並不會，因為 `DashboardComponent` 並沒有用 `Router` 做太多事

<code-example header="app/dashboard/dashboard.component.ts (goToDetail)" path="testing/src/app/dashboard/dashboard.component.ts" region="goto-detail" ></code-example>

這種情況在_路由元件_中經常出現。
原則上，你測試的是元件，而不是路由器，你只在乎元件是否在給定條件下以正確的地址導航。

為_這個元件_測試套件提供一個路由器 spy 替身，恰好和提供一個 `HeroService` spy 替身一樣容易。

<code-example header="app/dashboard/dashboard.component.spec.ts (spies)" path="testing/src/app/dashboard/dashboard.component.spec.ts" region="router-spy"></code-example>

下列測試點選顯示的英雄，並確認 `Router.navigateByUrl` 以預期的 url 被呼叫。

<code-example header="app/dashboard/dashboard.component.spec.ts (navigate test)" path="testing/src/app/dashboard/dashboard.component.spec.ts" region="navigate-test"></code-example>

<a id="routed-component-w-param"></a>

## 路由目標元件

_路由目標元件_ 是 `Router` 導航的目的地。
它可能比較難測試，尤其是當通往該元件的路由_包含參數_時。
`HeroDetailComponent` 是一個_路由目標元件_，是這類路由的目的地。

當使用者點選一個 _Dashboard_ 英雄時，`DashboardComponent` 會告訴 `Router` 導航到 `heroes/:id`。
`:id` 是一個路由參數，其值是要編輯之英雄的 `id`。

`Router` 將該 URL 比對到通往 `HeroDetailComponent` 的路由。
它會建立一個帶有路由資訊的 `ActivatedRoute` 物件，並將它注入到 `HeroDetailComponent` 的新實例中。

以下是 `HeroDetailComponent` 的建構函式：

<code-example header="app/hero/hero-detail.component.ts (constructor)" path="testing/src/app/hero/hero-detail.component.ts" region="ctor"></code-example>

`HeroDetail` 元件需要 `id` 參數，才能使用 `HeroDetailService` 取得對應的英雄。
元件必須從 `ActivatedRoute.paramMap` 屬性取得 `id`，而該屬性是一個 `Observable`。

它不能只參照 `ActivatedRoute.paramMap` 的 `id` 屬性。
元件必須_訂閱_ `ActivatedRoute.paramMap` observable，並為 `id` 在它的生命週期中變更做好準備。

<code-example header="app/hero/hero-detail.component.ts (ngOnInit)" path="testing/src/app/hero/hero-detail.component.ts" region="ng-on-init"></code-example>

<div class="alert is-helpful">

[Router 教學：Tour of Heroes](guide/router-tutorial-toh) 指南中的[「ActivatedRoute 實戰」](guide/router-tutorial-toh#activated-route-實際運作)一節會更詳細地說明 `ActivatedRoute.paramMap`。

</div>

測試可以探索 `HeroDetailComponent` 如何回應不同的 `id` 參數值，方法是操縱注入到元件建構函式中的 `ActivatedRoute`。

你已經知道如何對 `Router` 與資料服務使用 spy 替身。

你會對 `ActivatedRoute` 採取不同的方法，因為

*   `paramMap` 傳回一個 `Observable`，它在測試期間可以發出不只一個值
*   你需要路由器輔助函式 `convertToParamMap()` 來建立一個 `ParamMap`
*   其他_路由目標元件_測試需要 `ActivatedRoute` 的測試替身

這些差異說明了為什麼需要一個可重複使用的替身類別。

#### `ActivatedRouteStub`

下列 `ActivatedRouteStub` 類別可作為 `ActivatedRoute` 的測試替身。

<code-example header="testing/activated-route-stub.ts (ActivatedRouteStub)" path="testing/src/testing/activated-route-stub.ts" region="activated-route-stub"></code-example>

考慮將這類輔助函式放在與 `app` 資料夾同層的 `testing` 資料夾中。
本範例將 `ActivatedRouteStub` 放在 `testing/activated-route-stub.ts`。

<div class="alert is-helpful">

考慮使用 [*marble 測試函式庫*](#marble-testing) 撰寫功能更強大的這個替身類別版本。

</div>

<a id="tests-w-test-double"></a>

#### 使用 `ActivatedRouteStub` 進行測試

以下是一個測試，示範當觀察到的 `id` 指向一位現有的英雄時，元件的行為：

<code-example header="app/hero/hero-detail.component.spec.ts (existing id)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-good-id"></code-example>

<div class="alert is-helpful">

在下一節中會討論 `createComponent()` 方法與 `page` 物件。
先憑直覺理解即可。

</div>

當找不到該 `id` 時，元件應該重新導向到 `HeroListComponent`。

測試套件的設定提供了[前文所述](#路由元件)的相同路由器 spy 替身，它會監視路由器，但不會真的導航。

這個測試預期元件會嘗試導航到 `HeroListComponent`。

<code-example header="app/hero/hero-detail.component.spec.ts (bad id)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-bad-id"></code-example>

雖然這個應用程式沒有一條省略 `id` 參數、通往 `HeroDetailComponent` 的路由，但將來某天可能會加入這樣一條路由。
當沒有 `id` 時，元件應該做一些合理的事。

在這個實作中，元件應該建立並顯示一位新英雄。
新英雄的 `id=0`，且 `name` 為空白。
這個測試確認元件如預期運作：

<code-example header="app/hero/hero-detail.component.spec.ts (no id)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-no-id" ></code-example>

## 巢狀元件測試

元件範本經常有巢狀元件，而這些元件的範本可能又包含更多元件。

元件樹可能非常深，而且大多數時候，巢狀元件在測試樹頂端元件時並不扮演任何角色。

舉例來說，`AppComponent` 會顯示一個導覽列，其中有錨點與它們的 `RouterLink` 指令。

<code-example header="app/app.component.html" path="testing/src/app/app.component.html"></code-example>

雖然 `AppComponent` _類別_ 是空的，你可能會想撰寫單元測試，確認這些連結正確地接上 `RouterLink` 指令，或許是基於[下一節](#why-stubbed-routerlink-tests)所解釋的理由。

若要驗證這些連結，你不需要 `Router` 進行導航，也不需要 `<router-outlet>` 來標示 `Router` 插入_路由目標元件_的位置。

`BannerComponent` 與 `WelcomeComponent`（由 `<app-banner>` 與 `<app-welcome>` 表示）同樣不相關。

然而，任何在 DOM 中建立 `AppComponent` 的測試，也會建立這三個元件的實例，而且如果你放任這件事發生，你就必須設定 `TestBed` 來建立它們。

如果你疏於宣告它們，Angular 編譯器將無法辨識 `AppComponent` 範本中的 `<app-banner>`、`<app-welcome>` 與 `<router-outlet>` 標籤，並會擲出錯誤。

如果你宣告的是真實元件，你還必須宣告_它們的_巢狀元件，並為樹中_任何_元件注入的_所有_服務做準備。

只是為了回答幾個關於連結的簡單問題，這樣的功夫太多了。

本節描述兩種將設定工作降到最低的技巧。
你可以單獨使用它們，或合併使用，讓自己專注於測試主要元件。

<a id="stub-component"></a>

##### 為不需要的元件建立替身
在第一種技巧中，你建立並宣告在測試中幾乎不扮演任何角色的元件與指令的替身版本。

<code-example header="app/app.component.spec.ts (stub declaration)" path="testing/src/app/app.component.spec.ts" region="component-stubs"></code-example>

替身的選擇器與對應真實元件的選擇器相符。
但它們的範本與類別是空的。

接著，在 `TestBed` 設定中宣告它們，與需要用真實版本的元件、指令和管道並列。

<code-example header="app/app.component.spec.ts (TestBed stubs)" path="testing/src/app/app.component.spec.ts" region="testbed-stubs"></code-example>

`AppComponent` 是測試主體，所以你當然宣告它的真實版本。

`RouterLinkDirectiveStub`（在[後面](#routerlink)說明）是真實 `RouterLink` 的測試版本，可協助進行連結測試。

其餘的都是替身。

<a id="no-errors-schema"></a>

#### `NO_ERRORS_SCHEMA`
在第二種方法中，將 `NO_ERRORS_SCHEMA` 加入 `TestBed.schemas` 中繼資料。

<code-example header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)" path="testing/src/app/app.component.spec.ts" region="no-errors-schema"></code-example>

`NO_ERRORS_SCHEMA` 告訴 Angular 編譯器忽略無法辨識的元素與屬性。

編譯器能辨識 `<app-root>` 元素與 `routerLink` 屬性，因為你在 `TestBed` 設定中宣告了對應的 `AppComponent` 與 `RouterLinkDirectiveStub`。

但當編譯器遇到 `<app-banner>`、`<app-welcome>` 或 `<router-outlet>` 時，它不會擲出錯誤。
它只是將它們渲染為空標籤，瀏覽器會忽略它們。

你不再需要替身元件了。

#### 兩種技巧合併使用
這些是_淺層元件測試_的技巧，會如此命名，是因為它們將元件的視覺介面縮減到只剩範本中對測試重要的元素。

`NO_ERRORS_SCHEMA` 方法是兩者中較容易的一個，但不要過度使用它。

`NO_ERRORS_SCHEMA` 也會讓編譯器無法告訴你，你不慎遺漏或拼錯的元件與屬性。
你可能會浪費好幾個小時追查編譯器本可在一瞬間抓到的幽靈錯誤。

_替身元件_ 方法還有另一個優點。
雖然_這個_範例中的替身是空的，但如果你的測試需要以某種方式與它們互動，你可以給它們精簡過的範本與類別。

實務上，你會在同一個設定中合併這兩種技巧，如這個範例所示。

<code-example header="app/app.component.spec.ts (mixed setup)" path="testing/src/app/app.component.spec.ts" region="mixed-setup"></code-example>

Angular 編譯器為 `<app-banner>` 元素建立 `BannerComponentStub`，並將 `RouterLinkStubDirective` 套用到帶有 `routerLink` 屬性的錨點上，但它會忽略 `<app-welcome>` 與 `<router-outlet>` 標籤。

<a id="routerlink"></a>

## 具有 `RouterLink` 的元件

真實的 `RouterLinkDirective` 相當複雜，而且與 `RouterModule` 的其他元件與指令糾纏在一起。
它需要具挑戰性的設定，才能模擬並在測試中使用。

本範例程式碼中的 `RouterLinkDirectiveStub` 以一個替代版本取代真實指令，設計用來驗證在 `AppComponent` 範本中看到的那種錨點標籤接線方式。

<code-example header="testing/router-link-directive-stub.ts (RouterLinkDirectiveStub)" path="testing/src/testing/router-link-directive-stub.ts" region="router-link"></code-example>

繫結到 `[routerLink]` 屬性的 URL 會流入指令的 `linkParams` 屬性。

`HostListener` 將宿主元素（`AppComponent` 中的 `<a>` 錨點元素）的點選事件，接上替身指令的 `onClick` 方法。

點選錨點應該觸發 `onClick()` 方法，它會設定替身那個表明身分的 `navigatedTo` 屬性。
測試會檢查 `navigatedTo`，確認點選錨點有設定預期的路由定義。

<div class="alert is-helpful">

路由器是否已正確設定、能以該路由定義導航，那是另一組測試要回答的問題。

</div>

<a id="by-directive"></a>
<a id="inject-directive"></a>

#### `By.directive` 與注入的指令
再多一點設定，就能觸發初始資料繫結，並取得導覽連結的參照：

<code-example header="app/app.component.spec.ts (test setup)" path="testing/src/app/app.component.spec.ts" region="test-setup"></code-example>

有三個特別值得注意的點：

- 使用 `By.directive` 定位附有指令的錨點元素
- 查詢傳回包住相符元素的 `DebugElement` 包裝
- 每個 `DebugElement` 都暴露一個相依性注入器，帶有附加到該元素的指令之特定實例

要驗證的 `AppComponent` 連結如下：

<code-example header="app/app.component.html (navigation links)" path="testing/src/app/app.component.html" region="links"></code-example>

<a id="app-component-tests"></a>

以下是一些確認這些連結如預期接上 `routerLink` 指令的測試：

<code-example header="app/app.component.spec.ts (selected tests)" path="testing/src/app/app.component.spec.ts" region="tests"></code-example>

<div class="alert is-helpful">

_這個範例_中的「點選」測試具有誤導性。
它測試的是 `RouterLinkDirectiveStub`，而不是_元件_。
這是指令替身常見的缺點。

它在本指南中有正當的用途。
它示範如何在不動用完整的路由器機制下，找到一個 `RouterLink` 元素、點選它，並檢查一個結果。
這是一項你可能需要的技能，用來測試更精密的元件：當使用者點選連結時，那種元件會變更顯示、重新計算參數，或重新安排導航選項。

</div>

<a id="why-stubbed-routerlink-tests"></a>

#### 這些測試有什麼用？

使用替身的 `RouterLink` 測試可以確認：一個帶有連結與出口的元件已正確設定、該元件擁有它應該有的連結，而且它們全都指向預期的方向。
這些測試並不關心，當使用者點選連結時，應用程式是否能成功導航到目標元件。

對於這類有限的測試目標，將 RouterLink 與 RouterOutlet 換成替身是最好的選擇。
仰賴真實的路由器會讓它們變得脆弱。
它們可能因為與元件無關的原因而失敗。
例如，一個導航守衛可能會阻止未經授權的使用者造訪 `HeroListComponent`。
那不是 `AppComponent` 的錯，而且對該元件做任何變更都無法修好那個失敗的測試。

_另一組_測試則可以探索：在使用者是否已完成身分驗證與取得授權等會影響守衛的條件存在時，應用程式是否如預期導航。

<div class="alert is-helpful">

未來的一次指南更新會說明如何使用 `RouterTestingModule` 撰寫這類測試。

</div>

<a id="page-object"></a>

## 使用 `page` 物件

`HeroDetailComponent` 是一個簡單的檢視，帶有一個標題、兩個英雄欄位與兩個按鈕。

<div class="lightbox">

<img alt="HeroDetailComponent 實際運作" src="generated/images/guide/testing/hero-detail.component.png">

</div>

但即使是這麼簡單的表單，範本也有不少複雜度。

<code-example
  path="testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"></code-example>

測試元件的測試需要 &hellip;

* 等到英雄到達，元素才出現在 DOM 中
* 標題文字的參照
* 名稱輸入框的參照，以便檢查並設定它
* 兩個按鈕的參照，以便點選它們
* 一些元件與路由器方法的 spy

即使是這麼小的一個表單，也可能產生一團混亂的條件式設定與 CSS 元素選取，令人備受折磨。

用一個 `Page` 類別來駕馭這份複雜度：它負責存取元件屬性，並封裝設定這些屬性的邏輯。

以下就是為 `hero-detail.component.spec.ts` 準備的這樣一個 `Page` 類別

<code-example header="app/hero/hero-detail.component.spec.ts (Page)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="page"></code-example>

現在，用於操控與檢查元件的重要掛鉤都整齊地組織起來，可以從 `Page` 的實例存取。

`createComponent` 方法會建立一個 `page` 物件，並在 `hero` 到達後填補其中的空白。

<code-example header="app/hero/hero-detail.component.spec.ts (createComponent)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="create-component"></code-example>

較早一節中的 [`HeroDetailComponent` 測試](#tests-w-test-double) 示範了 `createComponent` 與 `page` 如何讓測試保持簡短且_切中主題_。
沒有干擾：不需要等待 promise 解析，也不需要在 DOM 中搜尋要比較的元素值。

以下再多看幾個 `HeroDetailComponent` 測試，來強化這個重點。

<code-example header="app/hero/hero-detail.component.spec.ts (selected tests)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="selected-tests"></code-example>

<a id="compile-components"></a>

## 呼叫 `compileComponents()`

<div class="alert is-helpful">

如果你_只_透過 CLI 的 `ng test` 指令執行測試，可以忽略本節，因為 CLI 會在執行測試前先編譯應用程式。

</div>

如果你在**非 CLI 環境**中執行測試，測試可能會失敗，並出現像這樣的訊息：

<code-example format="output" hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</code-example>

問題的根源在於，參與測試的元件中至少有一個指定了外部範本或 CSS 檔案，如下列版本的 `BannerComponent` 所示。

<code-example header="app/banner/banner-external.component.ts (external template & css)" path="testing/src/app/banner/banner-external.component.ts"></code-example>

當 `TestBed` 嘗試建立該元件時，測試就會失敗。

<code-example avoid header="app/banner/banner-external.component.spec.ts (setup that fails)" path="testing/src/app/banner/banner-external.component.spec.ts" region="setup-may-fail"></code-example>

回想一下，應用程式尚未編譯。
因此當你呼叫 `createComponent()` 時，`TestBed` 會隱含地進行編譯。

當原始碼在記憶體中時，這不是問題。
但 `BannerComponent` 需要外部檔案，編譯器必須從檔案系統讀取它們，而這本質上是一個_非同步_操作。

如果放任 `TestBed` 繼續，測試會在編譯器完成之前就執行並莫名其妙地失敗。

那則搶先發出的錯誤訊息就是在告訴你，要用 `compileComponents()` 明確地編譯。

#### `compileComponents()` 是非同步的
你必須在非同步測試函式中呼叫 `compileComponents()`。

<div class="alert is-critical">

CRITICAL: 如果你疏於讓測試函式成為非同步（例如忘了使用前述的 `waitForAsync()`），你會看到這則錯誤訊息

<code-example format="output" hideCopy language="shell">

Error: ViewDestroyedError: Attempt to use a destroyed view

</code-example>

</div>

一個典型的做法是將設定邏輯拆成兩個獨立的 `beforeEach()` 函式：

| 函式 | 說明 |
|:--- |:--- |
| 非同步 `beforeEach()` | 編譯元件 |
| 同步 `beforeEach()` | 執行其餘的設定 |

#### 非同步的 `beforeEach`

第一個非同步 `beforeEach` 這樣寫：

<code-example header="app/banner/banner-external.component.spec.ts (async beforeEach)" path="testing/src/app/banner/banner-external.component.spec.ts" region="async-before-each"></code-example>

`TestBed.configureTestingModule()` 方法會傳回 `TestBed` 類別，因此你可以鏈式呼叫其他 `TestBed` 靜態方法，例如 `compileComponents()`。

在這個範例中，`BannerComponent` 是唯一要編譯的元件。
其他範例會以多個元件設定測試模組，也可能匯入含有更多元件的應用程式模組。
其中任何一個都可能需要外部檔案。

`TestBed.compileComponents` 方法會以非同步方式編譯測試模組中設定的所有元件。

<div class="alert is-important">

在呼叫 `compileComponents()` 之後，請勿重新設定 `TestBed`。

</div>

呼叫 `compileComponents()` 會讓目前的 `TestBed` 實例不再接受進一步設定。
你不能再呼叫任何 `TestBed` 設定方法，無論是 `configureTestingModule()` 還是任何 `override&hellip;` 方法。
如果你嘗試這麼做，`TestBed` 會擲出錯誤。

讓 `compileComponents()` 成為呼叫 `TestBed.createComponent()` 之前的最後一步。

#### 同步的 `beforeEach`

第二個同步的 `beforeEach()` 包含其餘的設定步驟，包括建立元件，以及查詢要檢查的元素。

<code-example header="app/banner/banner-external.component.spec.ts (synchronous beforeEach)" path="testing/src/app/banner/banner-external.component.spec.ts" region="sync-before-each"></code-example>

你可以放心，測試執行器會等第一個非同步 `beforeEach` 完成後，才呼叫第二個。

#### 合併後的設定
你可以將這兩個 `beforeEach()` 函式合併成單一個非同步的 `beforeEach()`。

`compileComponents()` 方法會傳回一個 promise，因此你可以把同步程式碼移到 `await` 關鍵字之後（也就是 promise 已解決之處），在編譯_之後_執行同步設定工作。

<code-example header="app/banner/banner-external.component.spec.ts (one beforeEach)" path="testing/src/app/banner/banner-external.component.spec.ts" region="one-before-each"></code-example>

#### `compileComponents()` 是無害的
在不需要的時候呼叫 `compileComponents()` 也沒有壞處。

CLI 產生的元件測試檔案會呼叫 `compileComponents()`，儘管執行 `ng test` 時從來不需要它。

本指南中的測試只在必要時才呼叫 `compileComponents`。

<a id="import-module"></a>

## 以模組匯入進行設定

先前的元件測試是像這樣用一些 `declarations` 來設定測試模組的：

<code-example header="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)" path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="config-testbed"></code-example>

`DashboardComponent` 很簡單。
它不需要任何協助。
但更複雜的元件通常相依於其他元件、指令、管道與提供者，而這些也必須加入測試模組。

幸好，`TestBed.configureTestingModule` 的參數與傳給 `@NgModule` 裝飾器的中繼資料相對應，也就是說，你同樣可以指定 `providers` 與 `imports`。

`HeroDetailComponent` 儘管體積小、結構簡單，卻需要很多協助。
除了預設測試模組 `CommonModule` 提供的支援之外，它還需要：

- `FormsModule` 中的 `NgModel` 及其夥伴，以啟用雙向資料繫結
- 來自 `shared` 資料夾的 `TitleCasePipe`
- 這些測試正在以替身取代的 Router 服務
- 同樣以替身取代的 Hero 資料存取服務

一種做法是像這個範例一樣，用個別的零件來設定測試模組：

<code-example header="app/hero/hero-detail.component.spec.ts (FormsModule setup)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-forms-module"></code-example>

<div class="alert is-helpful">

注意，這個 `beforeEach()` 是非同步的，而且會呼叫 `TestBed.compileComponents`，因為 `HeroDetailComponent` 有外部範本與 css 檔案。

如[呼叫 `compileComponents()`](#compile-components)一節所述，這些測試可能會在非 CLI 環境中執行，屆時 Angular 必須在瀏覽器中編譯它們。

</div>

#### 匯入共用模組
由於許多應用程式元件都需要 `FormsModule` 與 `TitleCasePipe`，開發者建立了一個 `SharedModule`，把這些以及其他經常需要的零件組合在一起。

測試設定也可以使用 `SharedModule`，如這個替代設定所示：

<code-example header="app/hero/hero-detail.component.spec.ts (SharedModule setup)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-shared-module"></code-example>

它稍微更緊湊、更小，import 陳述式也更少（未顯示）。

<a id="feature-module-import"></a>

#### 匯入功能模組
`HeroDetailComponent` 是 `HeroModule`[功能模組](guide/feature-modules)的一部分，該模組匯集了更多彼此相依的零件，包括 `SharedModule`。
試試像這樣匯入 `HeroModule` 的測試設定：

<code-example header="app/hero/hero-detail.component.spec.ts (HeroModule setup)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-hero-module"></code-example>

真是_簡潔俐落_。
只剩下 `providers` 中的_測試替身_。
連 `HeroDetailComponent` 的宣告都不見了。

事實上，如果你試圖宣告它，Angular 會擲出錯誤，因為 `HeroDetailComponent` 同時被宣告在 `HeroModule` 與 `TestBed` 建立的 `DynamicTestModule` 中。

<div class="alert is-helpful">

當模組內有許多彼此相依的關係、而且模組本身很小時（功能模組通常如此），匯入元件的功能模組可能是設定測試的最佳方式。

</div>

<a id="component-override"></a>

## 覆寫元件的提供者

`HeroDetailComponent` 提供了它自己的 `HeroDetailService`。

<code-example header="app/hero/hero-detail.component.ts (prototype)" path="testing/src/app/hero/hero-detail.component.ts" region="prototype"></code-example>

你無法在 `TestBed.configureTestingModule` 的 `providers` 中為元件的 `HeroDetailService` 建立替身。
那些是_測試模組_的提供者，不是元件的。
它們把相依性注入器準備在 _fixture 層級_。

Angular 會用它_自己的_注入器建立元件，而該注入器是 fixture 注入器的_子_注入器。
它會把元件的提供者（在本例中是 `HeroDetailService`）註冊到這個子注入器。

測試無法從 fixture 注入器取得子注入器的服務。
`TestBed.configureTestingModule` 也無法設定它們。

Angular 一直以來建立的都是真實 `HeroDetailService` 的新實例！

<div class="alert is-helpful">

如果 `HeroDetailService` 自己向遠端伺服器發出 XHR 呼叫，這些測試可能會失敗或逾時。
也可能根本沒有遠端伺服器可以呼叫。

幸好，`HeroDetailService` 將遠端資料存取的責任委派給注入的 `HeroService`。

<code-example header="app/hero/hero-detail.service.ts (prototype)" path="testing/src/app/hero/hero-detail.service.ts" region="prototype"></code-example>

[先前的測試設定](#feature-module-import)將真實的 `HeroService` 換成 `TestHeroService`，由它攔截伺服器請求並偽造回應。

</div>

如果你沒那麼幸運呢？
如果偽造 `HeroService` 很困難呢？
如果 `HeroDetailService` 自己發出伺服器請求呢？

`TestBed.overrideComponent` 方法可以把元件的 `providers` 換成容易管理的_測試替身_，如下列設定變化所示：

<code-example header="app/hero/hero-detail.component.spec.ts (Override setup)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-override"></code-example>

注意，`TestBed.configureTestingModule` 不再提供假的 `HeroService`，因為它[不需要了](#spy-stub)。

<a id="override-component-method"></a>

#### `overrideComponent` 方法
聚焦於 `overrideComponent` 方法。

<code-example header="app/hero/hero-detail.component.spec.ts (overrideComponent)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-component-method"></code-example>

它接受兩個引數：要覆寫的元件型別（`HeroDetailComponent`），以及一個覆寫中繼資料物件。
[覆寫中繼資料物件](guide/testing-utility-apis#metadata-override-object)是一個泛型，定義如下：

<code-example language="javascript">

type MetadataOverride&lt;T&gt; = {
  add?: Partial&lt;T&gt;;
  remove?: Partial&lt;T&gt;;
  set?: Partial&lt;T&gt;;
};

</code-example>

中繼資料覆寫物件可以在中繼資料屬性中加入與移除元素，或完全重設那些屬性。
這個範例重設了元件的 `providers` 中繼資料。

型別參數 `T` 是你會傳給 `@Component` 裝飾器的中繼資料種類：

<code-example language="javascript">

selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
&hellip;

</code-example>

<a id="spy-stub"></a>

#### 提供 _spy 替身_（`HeroDetailServiceSpy`）
這個範例將元件的 `providers` 陣列完全換成一個新陣列，其中包含一個 `HeroDetailServiceSpy`。

`HeroDetailServiceSpy` 是真實 `HeroDetailService` 的替身版本，它偽造了該服務所有必要的功能。
它既不注入也不委派給較低層級的 `HeroService`，因此不需要為後者提供測試替身。

相關的 `HeroDetailComponent` 測試會透過監控服務方法，來斷言 `HeroDetailService` 的方法有被呼叫。
因此，這個替身將它的方法實作為 spy：

<code-example header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="hds-spy"></code-example>

<a id="override-tests"></a>

#### 覆寫測試
現在，測試可以直接操控替身的 `testHero` 來控制元件的英雄，並確認服務方法有被呼叫。

<code-example header="app/hero/hero-detail.component.spec.ts (override tests)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-tests"></code-example>

<a id="more-overrides"></a>

#### 更多覆寫
`TestBed.overrideComponent` 方法可以針對相同或不同的元件呼叫多次。
`TestBed` 也提供類似的 `overrideDirective`、`overrideModule` 與 `overridePipe` 方法，用來深入並取代這些其他類別的部分內容。

請自行探索這些選項與組合。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
