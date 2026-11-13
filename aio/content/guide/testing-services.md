# 測試服務

若要檢查你的服務是否如你所預期般運作，你可以專門為它們撰寫測試。

<div class="alert is-helpful">

如果你想試用本指南所述的應用程式，可以<live-example name="testing" noDownload>在瀏覽器中執行</live-example>，或<live-example name="testing" downloadOnly>下載到本機執行</live-example>。

</div>

服務通常是最容易進行單元測試的檔案。 以下是一些在沒有 Angular 測試工具協助下撰寫的 `ValueService` 同步與非同步單元測試。

<code-example header="app/demo/demo.spec.ts" path="testing/src/app/demo/demo.spec.ts" region="ValueService"></code-example>

<a id="services-with-dependencies"></a>

## 具有相依性的服務

服務通常相依於 Angular 注入到建構函式中的其他服務。 在許多情況下，你可以在呼叫服務建構函式時，手動建立並_注入_這些相依性。

`MasterService` 是一個簡單的範例：

<code-example header="app/demo/demo.ts" path="testing/src/app/demo/demo.ts" region="MasterService"></code-example>

`MasterService` 將它唯一的方法 `getValue` 委派給注入的 `ValueService`。

以下是幾種測試它的方法。

<code-example header="app/demo/demo.spec.ts" path="testing/src/app/demo/demo.spec.ts" region="MasterService"></code-example>

第一個測試以 `ValueService` 建立一個 `new`，並將它傳給 `MasterService` 建構函式。

然而，注入真實的服務很少能運作得好，因為大多數相依的服務都很難建立與控制。

相反地，請模擬該相依性、使用虛擬值，或在相關的服務方法上建立一個 [spy](https://jasmine.github.io/tutorials/your_first_suite#section-Spies)。

<div class="alert is-helpful">

建議優先使用 spy 替身，因為它們通常是模擬服務的最佳方式。

</div>

這些標準測試技巧非常適合以獨立方式單元測試服務。

然而，你幾乎總是使用 Angular 依賴注入將服務注入應用程式類別，因此你應該要有能反映該使用模式的測試。 Angular 測試工具讓調查注入服務的行為變得直接明瞭。

## 以 `TestBed` 測試服務

你的應用程式仰賴 Angular [依賴注入（DI）](guide/dependency-injection) 來建立服務。 當一個服務有相依的服務時，DI 會尋找或建立該相依服務。 而如果該相依服務有它自己的相依性，DI 也會一併尋找或建立它們。

身為服務的_消費者_，你不需要擔心這一切。 你不需要擔心建構函式引數的順序，也不需要擔心它們如何被建立。

身為服務的_測試者_，你至少必須思考第一層級的服務相依性，但你可以讓 Angular DI 處理服務的建立與建構函式引數順序，方法是使用 `TestBed` 測試工具來提供與建立服務。

<a id="testbed"></a>

## Angular `TestBed`

`TestBed` 是 Angular 測試工具中最重要的一個。 `TestBed` 會建立一個動態建構的 Angular_測試_模組，模擬 Angular 的 [@NgModule](guide/ngmodules)。

`TestBed.configureTestingModule()` 方法接受一個中繼資料物件，該物件可以具有 [@NgModule](guide/ngmodules) 的大多數屬性。

若要測試服務，請將 `providers` 中繼資料屬性設定為你要測試或模擬的服務陣列。

<code-example header="app/demo/demo.testbed.spec.ts (provide ValueService in beforeEach)" path="testing/src/app/demo/demo.testbed.spec.ts" region="value-service-before-each"></code-example>

然後在測試內呼叫 `TestBed.inject()`，並以服務類別作為引數來注入它。

<div class="alert is-helpful">

**注意**： <br />
`TestBed.get()` 已於 Angular 第 9 版起棄用。
為了盡量減少破壞性變更，Angular 推出了一個名為 `TestBed.inject()` 的新函式，你應該改用它。
如需了解 `TestBed.get()` 的移除資訊，請參閱[棄用索引](guide/deprecations#索引)中的相關條目。

</div>

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="value-service-inject-it"></code-example>

或是在 `beforeEach()` 內注入，如果你偏好將服務的注入作為設定作業的一部分。

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="value-service-inject-before-each"> </code-example>

測試具有相依性的服務時，請在 `providers` 陣列中提供該 mock。

在下列範例中，mock 是一個 spy 物件。

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="master-service-before-each"></code-example>

該測試以與先前相同的方式使用該 spy。

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="master-service-it"></code-example>

<a id="no-before-each"></a>

## 不使用 `beforeEach()` 進行測試

本指南中的大多數測試套件都會呼叫 `beforeEach()`，為每個 `it()` 測試設定前置條件，並仰賴 `TestBed` 來建立類別與注入服務。

還有另一派測試從不呼叫 `beforeEach()`，偏好明確地建立類別，而非使用 `TestBed`。

以下是你可能如何以那種風格改寫其中一個 `MasterService` 測試。

先將可重複使用、具準備性質的程式碼放進一個 _setup_ 函式，而不是放在 `beforeEach()` 中。

<code-example header="app/demo/demo.spec.ts (setup)" path="testing/src/app/demo/demo.spec.ts" region="no-before-each-setup"></code-example>

`setup()` 函式會傳回一個物件字面值，其中帶有測試可能引用的變數，例如 `masterService`。 你不會在 `let masterService: MasterService` 的主體中定義_半全域_變數（例如 `describe()`）。

然後每個測試在第一行叫用 `setup()`，接著繼續進行操作測試主體並斷言期望的步驟。

<code-example path="testing/src/app/demo/demo.spec.ts" region="no-before-each-test"></code-example>

請注意，測試如何使用[_解構賦值_](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)來擷取它需要的設定變數。

<code-example path="testing/src/app/demo/demo.spec.ts" region="no-before-each-setup-call"></code-example>

許多開發者覺得這種作法比傳統的 `beforeEach()` 風格更簡潔、更明確。

雖然本測試指南遵循傳統風格，且預設的 [CLI schematics](https://github.com/angular/angular-cli) 產生的測試檔案帶有 `beforeEach()` 與 `TestBed`，仍歡迎你在自己的專案中採用_這個替代作法_。

## 測試 HTTP 服務

向遠端伺服器發出 HTTP 呼叫的資料服務，通常會注入 Angular 的 [`HttpClient`](guide/http) 服務，並委派給它進行 XHR 呼叫。

你可以像測試任何具有相依性的服務一樣，使用注入的 `HttpClient` spy 來測試資料服務。

<code-example header="app/model/hero.service.spec.ts (tests with spies)" path="testing/src/app/model/hero.service.spec.ts" region="test-with-spies"></code-example>

<div class="alert is-important">

`HeroService` 的方法會回傳 `Observables`。
你必須*訂閱* observable，才能（a）讓它執行，以及（b）斷言該方法成功或失敗。

`subscribe()` 方法接受一個成功（`next`）與一個失敗（`error`）回呼。 請確保你有提供_這兩個_回呼，這樣你才能捕捉到錯誤。 若疏於這麼做，會產生一個非同步的未捕捉 observable 錯誤，測試執行器很可能會將它歸因到一個完全不同的測試上。

</div>

## `HttpClientTestingModule`

資料服務與 `HttpClient` 之間的擴充互動可能很複雜，而且很難用 spy 來模擬。

`HttpClientTestingModule` 可以讓這些測試情境更容易管理。

雖然本指南隨附的*程式碼範例*有示範 `HttpClientTestingModule`，但本頁將內容留給 [Http 指南](guide/http#測試請求)，該指南詳細涵蓋了使用 `HttpClientTestingModule` 的測試。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
