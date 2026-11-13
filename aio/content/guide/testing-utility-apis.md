# 測試工具 API

本頁說明最實用的 Angular 測試功能。

Angular 測試工具包括 `TestBed`、`ComponentFixture`，以及一些控制測試環境的函式。
[`TestBed`](#testbed-api-summary) 與 [`ComponentFixture`](#component-fixture-api-summary) 類別另有專節說明。

以下是獨立函式的摘要，依可能的實用程度排序：

| Function                     | Details |
|:---                          |:---     |
| `waitForAsync`               | 在特殊的 _async 測試區_ 內執行測試（`it`）或設定（`beforeEach`）函式的主體。請參閱 [waitForAsync](guide/testing-components-scenarios#waitForAsync)。 |
| `fakeAsync`                  | 在特殊的 _fakeAsync 測試區_ 內執行測試（`it`）函式的主體，讓程式碼能以線性的控制流程撰寫。請參閱 [fakeAsync](guide/testing-components-scenarios#fake-async)。 |
| `tick`                       | 模擬時間的流逝與待處理非同步活動的完成，方式是在 _fakeAsync 測試區_ 內排清 _timer_ 與 _micro-task_ 佇列。<div class="alert is-helpful"> 熱心投入的讀者或許會喜歡這篇長篇部落格文章：[「_Tasks, microtasks, queues and schedules_」](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules)。 </div> 它接受一個選用的參數，可將虛擬時鐘向前推進指定的毫秒數，並清除在該時間範圍內排程的非同步活動。請參閱 [tick](guide/testing-components-scenarios#tick)。 |
| `inject`                     | 將目前 `TestBed` 注入器中的一或多個服務注入測試函式。它無法注入由元件本身提供的服務。請參閱 [debugElement.injector](guide/testing-components-scenarios#取得注入的服務) 的討論。 |
| `discardPeriodicTasks`       | 當 `fakeAsync()` 測試在結束時仍有待處理的計時器事件 _tasks_（排入佇列的 `setTimeOut` 與 `setInterval` 回呼），測試會以清楚的錯誤訊息失敗。<br /> 一般來說，測試結束時不應有任何排入佇列的工作。當預期會有待處理的計時器工作時，呼叫 `discardPeriodicTasks` 排清 _task_ 佇列，以避免這個錯誤。 |
| `flushMicrotasks`            | 當 `fakeAsync()` 測試在結束時仍有待處理的 _micro-tasks_（例如尚未解決的 promise），測試會以清楚的錯誤訊息失敗。<br /> 一般來說，測試應等待 micro-task 完成。當預期會有待處理的 microtask 時，呼叫 `flushMicrotasks` 排清 _micro-task_ 佇列，以避免這個錯誤。 |
| `ComponentFixtureAutoDetect` | 一個 provider token，對應的服務會開啟[自動變更偵測](guide/testing-components-scenarios#自動變更偵測)。 |
| `getTestBed`                 | 取得 `TestBed` 的目前實例。通常不需要使用，因為 `TestBed` 類別的靜態類別方法一般就已足夠。`TestBed` 實例公開了一些較少使用、且沒有靜態方法版本的成員。 |

<a id="testbed-class-summary"></a>

## `TestBed` 類別摘要

`TestBed` 類別是主要的 Angular 測試工具之一。
它的 API 相當龐大，在你逐漸探索之前可能會覺得難以招架。
請先閱讀本指南前面的部分掌握基礎，再試著理解完整的 API。

傳入 `configureTestingModule` 的模組定義，是 `@NgModule` 中繼資料屬性的子集。

<code-example format="javascript" language="javascript">

type TestModuleMetadata = {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array&lt;SchemaMetadata | any[]&gt;;
};

</code-example>

<a id="metadata-override-object"></a>

每個覆寫方法都接受一個 `MetadataOverride<T>`，其中 `T` 是適合該方法的中繼資料種類，也就是 `@NgModule`、`@Component`、`@Directive` 或 `@Pipe` 的參數。

<code-example format="javascript" language="javascript">

type MetadataOverride&lt;T&gt; = {
  add?: Partial&lt;T&gt;;
  remove?: Partial&lt;T&gt;;
  set?: Partial&lt;T&gt;;
};

</code-example>

<a id="testbed-methods"></a>
<a id="testbed-api-summary"></a>

`TestBed` API 由靜態類別方法組成，這些方法不是更新、就是引用 `TestBed` 的_全域_實例。

在內部，所有靜態方法都是目前執行期 `TestBed` 實例的方法的包裝，而該實例也會由 `getTestBed()` 函式傳回。

請在 `beforeEach()` _內_呼叫 `TestBed` 方法，確保每個個別測試開始前都是全新狀態。

以下是最重要的靜態方法，依可能的實用程度排序。

| Methods                                                        | Details |
|:---                                                            |:---     |
| `configureTestingModule`                                       | 測試墊片（`karma-test-shim`、`browser-test-shim`）會建立[初始測試環境](guide/testing)與預設的測試模組。預設測試模組設定了基本的宣告式成員，以及每位測試者都需要的一些 Angular 服務替代實作。<br /> 呼叫 `configureTestingModule`，可以加入與移除匯入、宣告（元件、指令與管道）及 providers，為特定的測試組調整測試模組設定。 |
| `compileComponents`                                            | 在你完成測試模組的設定後，以非同步方式編譯該模組。如果測試模組的_任何_元件具有 `templateUrl` 或 `styleUrls`，你**必須**呼叫這個方法，因為取得元件範本與樣式檔案必然是非同步的。請參閱 [compileComponents](guide/testing-components-scenarios#compile-components)。<br /> 呼叫 `compileComponents` 之後，`TestBed` 設定會在目前規格執行的期間內凍結。 |
| `createComponent<T>`                                     | 根據目前的 `TestBed` 設定，建立型別為 `T` 的元件實例。呼叫 `createComponent` 之後，`TestBed` 設定會在目前規格的執行期間凍結。 |
| `overrideModule`                                               | 取代指定的 `NgModule`。請記住，模組可以匯入其他模組。`overrideModule` 方法可以深入目前的測試模組，修改其中某個內層模組。 |
| `overrideComponent`                                            | 取代指定元件類別的中繼資料，該元件可能深藏在內層模組之中。 |
| `overrideDirective`                                            | 取代指定指令類別的中繼資料，該指令可能深藏在內層模組之中。 |
| `overridePipe`                                                 | 取代指定管道類別的中繼資料，該管道可能深藏在內層模組之中。 |
| 
<a id="testbed-inject"></a>
 `inject`                           | 從目前的 `TestBed` 注入器取得服務。`inject` 函式通常就足以勝任此用途。但若 `inject` 無法提供該服務，就會擲出錯誤。<br /> 如果該服務是選用的，該怎麼辦？<br /> `TestBed.inject()` 方法接受一個選用的第二個參數，也就是 Angular 找不到 provider 時要傳回的物件（此例為 `null`）：<code-example header="app/demo/demo.testbed.spec.ts" path="testing/src/app/demo/demo.testbed.spec.ts" region="testbed-get-w-null"></code-example> 呼叫 `TestBed.inject` 之後，`TestBed` 設定會在目前規格的執行期間凍結。 |
| 
<a id="testbed-initTestEnvironment"></a>
 `initTestEnvironment` | 為整個測試執行初始化測試環境。<br /> 測試墊片（`karma-test-shim`、`browser-test-shim`）會為你呼叫它，所以你幾乎不需要自己呼叫。<br /> 這個方法只能呼叫_恰好一次_。若要在測試執行中途變更這個預設值，請先呼叫 `resetTestEnvironment`。<br /> 指定 Angular 編譯器工廠、一個 `PlatformRef`，以及一個預設的 Angular 測試模組。非瀏覽器平台的替代方案可在 `@angular/platform-<platform_name>/testing/<platform_name>` 這個一般形式下取得。 |
| `resetTestEnvironment`                                         | 重設初始測試環境，包括預設的測試模組。 |

少數 `TestBed` 實例方法沒有對應的靜態 `TestBed` _類別_方法。
這些方法很少需要使用。

<a id="component-fixture-api-summary"></a>

## `ComponentFixture`

`TestBed.createComponent<T>` 會建立元件 `T` 的實例，並為該元件傳回強型別的 `ComponentFixture`。

`ComponentFixture` 的屬性與方法提供對元件、其 DOM 表示方式，以及其 Angular 環境各方面的存取。

<a id="component-fixture-properties"></a>

### `ComponentFixture` 屬性

以下是對測試者最重要的屬性，依可能的實用程度排序。

| Properties          | Details |
|:---                 |:---     |
| `componentInstance` | 由 `TestBed.createComponent` 建立的元件類別實例。 |
| `debugElement`      | 與元件根元素相關聯的 `DebugElement`。<br /> `debugElement` 讓你在測試與除錯期間深入了解元件及其 DOM 元素。這是測試者的關鍵屬性。最值得關注的成員在[下文](#debug-element-details)說明。 |
| `nativeElement`     | 位於元件根部的原生 DOM 元素。 |
| `changeDetectorRef` | 元件的 `ChangeDetectorRef`。<br /> 當所測試的元件具有 `ChangeDetectionStrategy.OnPush`，或元件的變更偵測由你的程式控制時，`ChangeDetectorRef` 最有價值。 |

<a id="component-fixture-methods"></a>

### `ComponentFixture` 方法

_fixture_ 方法會讓 Angular 對元件樹執行某些工作。
呼叫這些方法，可以觸發 Angular 行為以回應模擬的使用者動作。

以下是最實用的方法。

| Methods             | Details |
|:---                 |:---     |
| `detectChanges`     | 為元件觸發一個變更偵測週期。<br /> 呼叫它來初始化元件（它會呼叫 `ngOnInit`），以及在測試程式碼變更元件的資料繫結屬性值之後呼叫。Angular 無法得知你已變更 `personComponent.name`，在你呼叫 `detectChanges` 之前，不會更新 `name` 繫結。<br /> 之後會執行 `checkNoChanges`，確認沒有循環更新，除非以 `detectChanges(false)` 的方式呼叫； |
| `autoDetectChanges` | 當你希望 fixture 自動偵測變更時，將它設為 `true`。<br /> 當自動偵測為 `true` 時，測試 fixture 會在建立元件後立即呼叫 `detectChanges`。接著它會監聽相關的 zone 事件，並相應地呼叫 `detectChanges`。當你的測試程式碼直接修改元件屬性值時，你可能仍然必須呼叫 `fixture.detectChanges` 來觸發資料繫結更新。<br /> 預設值為 `false`。偏好精細控制測試行為的測試者，通常會將它保持為 `false`。 |
| `checkNoChanges`    | 執行一次變更偵測，確保沒有待處理的變更。若有變更則擲出例外。 |
| `isStable`          | 若 fixture 目前_穩定_，傳回 `true`。若有尚未完成的非同步工作，傳回 `false`。 |
| `whenStable`        | 傳回一個在 fixture 穩定時完成的 promise。<br /> 若要在非同步活動或非同步變更偵測完成後繼續測試，請掛接該 promise。請參閱 [whenStable](guide/testing-components-scenarios#when-stable)。 |
| `destroy`           | 觸發元件銷毀。 |

<a id="debug-element-details"></a>

#### `DebugElement`

`DebugElement` 提供對元件 DOM 表示方式的關鍵洞察。

從測試根元件由 `fixture.debugElement` 傳回的 `DebugElement`，你可以走訪（並查詢）fixture 的整個元素與元件子樹。

以下是對測試者最實用的 `DebugElement` 成員，依大約的實用程度排序：

| Members               | Details |
|:---                   |:---     |
| `nativeElement`       | 瀏覽器中對應的 DOM 元素（WebWorker 中為 null） |
| `query`               | 呼叫 `query(predicate: Predicate<DebugElement>)`，傳回子樹中任意深度第一個符合[述詞](#query-predicate)的 `DebugElement`。 |
| `queryAll`            | 呼叫 `queryAll(predicate: Predicate<DebugElement>)`，傳回子樹中任意深度所有符合[述詞](#query-predicate)的 `DebugElements`。 |
| `injector`            | 宿主的相依性注入器。例如，根元素的元件實例注入器。 |
| `componentInstance`   | 元素自身的元件實例（如果有的話）。 |
| `context`             | 提供此元素父層上下文的物件。通常是掌管此元素的祖先元件實例。<br /> 當元素在 `*ngFor` 內重複時，其 context 是一個 `NgForOf`，其 `$implicit` 屬性是該列實例的值。例如，`*ngFor="let hero of heroes"` 中的 `hero`。 |
| `children`            | 直接的 `DebugElement` 子元素。透過 `children` 逐層往下走訪整棵樹。<div class="alert is-helpful"> `DebugElement` 也有 `childNodes`，是 `DebugNode` 物件的清單。`DebugElement` 源自 `DebugNode` 物件，而且節點的數量往往比元素多。測試者通常可以忽略純節點。 </div> |
| `parent`              | `DebugElement` 的父元素。若這是根元素，則為 Null。 |
| `name`                | 元素的標籤名稱（如果它是元素的話）。 |
| `triggerEventHandler` | 若元素的 `listeners` 集合中有對應的監聽器，則依名稱觸發該事件。第二個參數是處理常式預期的_事件物件_。請參閱 [triggerEventHandler](guide/testing-components-scenarios#trigger-event-handler)。<br /> 若事件缺少監聽器，或有其他問題，請考慮呼叫 `nativeElement.dispatchEvent(eventObject)`。 |
| `listeners`           | 附加在元件 `@Output` 屬性及／或元素事件屬性上的回呼。 |
| `providerTokens`      | 此元件的注入器查找權杖。包括元件本身，加上元件在其 `providers` 中繼資料中所列的權杖。 |
| `source`              | 在來源元件範本中找到這個元素的位置。 |
| `references`          | 與範本區域變數相關聯的物件字典（例如 `#foo`），以區域變數名稱為鍵。 |

<a id="query-predicate"></a>

`DebugElement.query(predicate)` 與 `DebugElement.queryAll(predicate)` 方法接受一個述詞，用來篩選來源元素的子樹，找出符合的 `DebugElement`。

述詞可以是任何接受 `DebugElement` 並傳回_真值_的方法。
下列範例找出所有具有名為 "content" 的範本區域變數參照的 `DebugElements`：

<code-example header="app/demo/demo.testbed.spec.ts" path="testing/src/app/demo/demo.testbed.spec.ts" region="custom-predicate"></code-example>

Angular 的 `By` 類別有三個靜態方法，用於常見的述詞：

| Static method             | Details |
|:---                       |:---     |
| `By.all`                  | 傳回所有元素 |
| `By.css(selector)`        | 傳回符合 CSS 選擇器的元素 |
| `By.directive(directive)` | 傳回 Angular 對應到該指令類別實例的元素 |

<code-example header="app/hero/hero-list.component.spec.ts" path="testing/src/app/hero/hero-list.component.spec.ts" region="by"></code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
