# 測試服務

要檢查您的服務是否如您預期般運作，您可以特別為它們撰寫測試。

服務通常是單元測試中最順暢的文件。
以下是使用非 Angular 測試工具編寫的 `ValueService` 的同步和非同步單元測試。

<docs-code header="app/demo/demo.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="ValueService"/>

## 服務有依賴性

服務通常依賴 Angular 注入到建構函式中的其他服務。
在許多情況下，您可以在呼叫服務的建構函式的同時手動建立和*注入*這些依賴項。

MasterService 是一個簡單的範例：

<docs-code header="app/demo/demo.ts" path="adev/src/content/examples/testing/src/app/demo/demo.ts" visibleRegion="MasterService"/>

`MasterService` 將它唯一的方法 `getValue` 委派給注入的 `ValueService`。

這裡有幾種方法可以測試它。

<docs-code header="app/demo/demo.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="MasterService"/>

第一次測試以 `new` 建立 `ValueService` 並將它傳遞給 `MasterService` 建構函數。

然而，注入實際服務很少能順利運作，因為大多數依賴服務都很難建立和控制。

相反，模擬相依性、使用虛擬值，或在相關服務方法上建立 [spy](https://jasmine.github.io/tutorials/your_first_suite#section-Spies)。

HELPFUL: 偏好間諜，因為它們通常是模擬服務的最佳方式。

這些標準測試技術非常適合單元測試隔離服務。

然而，您幾乎總是使用 Angular 相依性注入將服務注入到應用程式類別中，而且您應該有反映該使用模式的測試。
Angular 測試工具可以讓您輕鬆地調查注入服務的行為。

## 使用 `TestBed` 測試服務

html
<div class="card">
  <div class="card-header">
    Hero Detail
  </div>
  <div class="card-body">
    <div class="row">
      <div class="col-sm-6">
        <label for="hero-name">Name</label>
        <input type="text" class="form-control" id="hero-name">
      </div>
      <div class="col-sm-6">
        <label for="hero-alterEgo">Alter Ego</label>
        <input type="text" class="form-control" id="hero-alterEgo">
      </div>
    </div>
    <button type="button" class="btn btn-primary" (click)="save()">Save</button>
  </div>
</div>

您的應用程式仰賴 Angular [相依性注入 (DI)](guide/di) 來建立服務。
當服務具有依賴服務時，DI 會尋找或建立該依賴服務。
如果該依賴服務具有其自己的依賴項，DI 也會尋找或建立它們。

身為服務 *消費者*，您不必擔心任何這方面的事情。
您不必擔心建構函數參數的順序或它們的建立方式。

作為一個服務 *測試人員*，您至少必須考慮服務依賴項的第一個層級，但當您使用 `TestBed` 測試工具來提供和建立服務時，*可以* 讓 Angular DI 執行服務建立並處理建構函數參數順序。

## Angular `TestBed`

`TestBed` 是 Angular 測試工具中最重要的。
`TestBed` 建立一個動態建構的 Angular *測試* 模組，模擬 Angular [@NgModule](guide/ngmodules)。

`TestBed.configureTestingModule()` 方法採用一個可擁有大部分 [@NgModule](guide/ngmodules) 屬性的元資料物件。

要測試服務，您可以將 `providers` 元資料屬性設定為您要測試或模擬的服務陣列。

<docs-code header="app/demo/demo.testbed.spec.ts (provide ValueService in beforeEach)" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-before-each"/>

然後透過呼叫 `TestBed.inject()` 並以服務類別作為參數，將它注入測試中。

HELPFUL: 從 Angular 版本 9 開始，`TestBed.get()` 已棄用。
為了盡量減少重大變更，Angular 引進一個新的函數 `TestBed.inject()`，你應該改用這個函數。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-it"/>

或在 `beforeEach()` 內部，如果您想將服務注入為您的設定一部分。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-before-each"> </docs-code>

在測試具有依賴項的服務時，在 `providers` 陣列中提供模擬。

在以下範例中，模擬是一個間諜物件。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-before-each"/>

測試以相同的方式消耗該間諜，就像它先前所做的那樣。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-it"/>

## 不使用 `beforeEach()` 進行測試

本指南中的大多數測試套件會呼叫 `beforeEach()` 來設定每個 `it()` 測試的前提條件，並依賴 `TestBed` 來建立類別和注入服務。

另一個測試流派從不呼叫 `beforeEach()`，並且偏好明確建立類別，而非使用 `TestBed`。

以下是如何用這種風格重寫其中一個 `MasterService` 測試。

開始時，將可重複使用的準備程式碼放在 *setup* 函數中，而不是 `beforeEach()`。

<docs-code header="app/demo/demo.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup"/>

`setup()` 函數傳回一個物件文字，其中包含測試可能會參考的變數，例如 `masterService`。
您不要在 `describe()` 的主體中定義 *半全域* 變數\(例如，`let masterService: MasterService`\)。

然後每個測試在第一行都會呼叫 `setup()`，然後再繼續執行操作測試主體和斷言預期的步驟。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-test"/>

請注意測試如何使用 [*解構賦值*](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 來提取它所需的設定變數。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup-call"/>

許多開發人員認為這種方式比傳統的 `beforeEach()` 風格更簡潔且更明確。

雖然這份測試指南遵循傳統風格，且預設 [CLI 架構](https://github.com/angular/angular-cli) 會產生具有 `beforeEach()` 和 `TestBed` 的測試檔案，您可以在自己的專案中自由採用 *此替代方法*。

## 測試 HTTP 服務

通常會注入並委派給 Angular [`HttpClient`](guide/http/testing) 服務以進行 XHR 呼叫，而資料服務會對遠端伺服器進行 HTTP 呼叫。

您可以使用注入的 `HttpClient` 間諜測試資料服務，就像您可以測試具有依賴項的任何服務一樣。

<docs-code header="app/model/hero.service.spec.ts (tests with spies)" path="adev/src/content/examples/testing/src/app/model/hero.service.spec.ts" visibleRegion="test-with-spies"/>

重要提示：`HeroService` 方法傳回 `Observables`。
您必須 *訂閱* 可觀察對象，才能 \(a\) 導致其執行和 \(b\) 斷言方法成功或失敗。

`subscribe()` 方法會採用成功 \(`next`\) 和失敗 \(`error`\) 回呼。
請務必提供 *兩個* 回呼，以便捕捉錯誤。
忽略此操作會產生非同步的未捕捉 Observable 錯誤，測試執行器可能會將其歸因於完全不同的測試。

## `HttpClientTestingModule`

資料服務與 `HttpClient` 之間的延伸互動可能很複雜，也難以用間諜程式來模擬。

`HttpClientTestingModule` 可以讓這些測試情境更易於管理。

雖然這個指南附帶的 *程式碼範例* 示範了 `HttpClientTestingModule`，但此頁面會讓位於 [Http 指南](guide/http/testing) 中，詳細介紹使用 `HttpClientTestingModule` 進行測試的內容。
