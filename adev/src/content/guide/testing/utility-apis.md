# 測試工具 API

此頁面描述最實用的 Angular 測試功能。

Angular 測試工具包括 `TestBed`、`ComponentFixture` 和一些控制測試環境的函式。
[`TestBed`](#testbed-api-summary) 和 [`ComponentFixture`](#component-fixture-api-summary) 類別會分別介紹。

以下是以可能實用性為順序排列的獨立函式摘要：

| 功能                     | 詳細資料 |
|:---                          |:---     |
| `waitForAsync`               | 在特殊 *非同步測試區域* 中執行測試 \(`it`\) 或設定 \(`beforeEach`\) 函式的主體。請參閱 [waitForAsync](guide/testing/components-scenarios#waitForAsync)。                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `fakeAsync`                  | 在特殊 *假非同步測試區域* 中執行測試 \(`it`\) 的主體，啟用線性控制流程編碼樣式。請參閱 [fakeAsync](guide/testing/components-scenarios#fake-async)。                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `tick`                       | 模擬時間流逝以及完成待處理的非同步活動，方法是在 *假非同步測試區域* 中清除 *計時器* 和 *微任務* 佇列。好奇且專心的讀者可能會喜歡這篇冗長的部落格文章，["*任務、微任務、佇列和排程*"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules)。接受一個可選參數，將虛擬時鐘向前移動指定毫秒數，清除在該時間範圍內排定的非同步活動。請參閱 [tick](guide/testing/components-scenarios#tick)。 |
| `inject`                     | 將目前 `TestBed` 注入器中的其中一項或多項服務注入測試函式。它無法注入元件本身提供的服務。請參閱 [debugElement.injector](guide/testing/components-scenarios#get-injected-services) 的討論。                                                                                                                                                                                                                                                                                                                                                                          |
| `discardPeriodicTasks`       | 當 `fakeAsync()` 測試以待處理的計時器事件 *任務*（排隊的 `setTimeOut` 和 `setInterval` 回呼）結束時，測試會失敗並顯示明確的錯誤訊息。 <br /> 通常，測試應在沒有排隊任務的情況下結束。當預期有待處理的計時器任務時，請呼叫 `discardPeriodicTasks` 以清除 *任務* 佇列並避免錯誤。                                                                                                                                                                                                                                                                                          |
| `flushMicrotasks`            | 當 `fakeAsync()` 測試以待處理的 *微任務*（例如未解決的承諾）結束時，測試會失敗並顯示明確的錯誤訊息。 <br /> 通常，測試應等到微任務完成。當預期有待處理的微任務時，請呼叫 `flushMicrotasks` 以清除 *微任務* 佇列並避免錯誤。                                                                                                                                                                                                                                                                                                                 |
| `ComponentFixtureAutoDetect` | 開啟 [自動變更偵測](guide/testing/components-scenarios#automatic-change-detection) 服務的提供者權杖。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `getTestBed`                 | 取得 `TestBed` 的目前執行個體。通常不需要，因為 `TestBed` 類別的靜態類別方法通常就已足夠。`TestBed` 執行個體公開一些很少使用的成員，而這些成員不以靜態方法提供。                                                                                                                                                                                                                                                                                                                                                                                  |

## `TestBed` 類別摘要

`TestBed` 類別是其中一個主要的 Angular 測試工具。
它的 API 非常龐大，在您逐漸探索之前可能會令人不知所措。
在嘗試吸收完整 API 之前，請先閱讀本指南的早期部分以瞭解基礎知識。

傳遞至 `configureTestingModule` 的模組定義是 `@NgModule` 元數據屬性的子集。

<docs-code language="javascript">

type TestModuleMetadata = {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array&lt;SchemaMetadata | any[]&gt;;
};

</docs-code>

每個覆寫方法都採用 `MetadataOverride<T>`，其中 `T` 是適用于該方法的元數據類型，亦即 `@NgModule`、`@Component`、`@Directive` 或 `@Pipe` 的參數。

<docs-code language="javascript">

type MetadataOverride&lt;T&gt; = {
  add?: Partial&lt;T&gt;;
  remove?: Partial&lt;T&gt;;
  set?: Partial&lt;T&gt;;
};

</docs-code>

`TestBed` API 包含靜態類別方法，這些方法會更新或參照 `TestBed` 的*全域*實例。

在內部，所有靜態方法都會涵蓋當前執行階段 `TestBed` 實例的方法，`getTestBed()` 函式也會傳回此實例。

在每個單元測試之前，請在 `beforeEach()` *內* 呼叫 `TestBed` 方法，以確保每次都重新開始。

以下是最重要的靜態方法，按可能的實用性排序。

| 方法                                                        | 詳細資料 |
|:---                                                            |:---     |
| `configureTestingModule`                                       | 測試模擬（`karma-test-shim`、`browser-test-shim`）建立 [初始測試環境](guide/testing) 和預設測試模組。預設測試模組以基本宣告和一些每個測試人員所需的 Angular 服務替代項進行設定。<br />呼叫 `configureTestingModule` 以透過新增和移除匯入、宣告（元件、指令和管道）和提供者來調整特定測試集的測試模組設定。                                                                                                                                              |
| `compileComponents`                                            | 在完成設定後，非同步編譯測試模組。如果您有 *任何* 測試模組元件具有 `templateUrl` 或 `styleUrls`，則 **必須** 呼叫此方法，因為擷取元件範本和樣式檔案必然是非同步的。請參閱 [compileComponents](guide/testing/components-scenarios#compile-components)。<br />在呼叫 `compileComponents` 後，`TestBed` 設定會在目前規格的期間凍結。                                                                                                                                                                 |
| `createComponent<T>`                                     | 根據目前 `TestBed` 設定，建立類型為 `T` 的元件執行個體。在呼叫 `createComponent` 後，`TestBed` 設定會在目前規格的期間凍結。                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `overrideModule`                                               | 取代給定 `NgModule` 的中繼資料。請記住，模組可以匯入其他模組。`overrideModule` 方法可以深入目前測試模組以修改其中一個內部模組。                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `overrideComponent`                                            | 取代給定元件類別的中繼資料，該類別可以深層巢狀在內部模組中。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `overrideDirective`                                            | 取代給定指令類別的中繼資料，該類別可以深層巢狀在內部模組中。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `overridePipe`                                                 | 取代給定管道類別的中繼資料，該類別可以深層巢狀在內部模組中。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|
 `inject`                           | 從目前 `TestBed` 注入器中擷取服務。`inject` 函式通常足以用於此目的。但如果 `inject` 無法提供服務，則會擲回錯誤。<br />如果服務是選用的，該怎麼辦？<br />`TestBed.inject()` 方法會採用第二個選用參數，如果 Angular 找不到提供者（在此範例中為 `null`），則會傳回該物件： <docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="testbed-get-w-null"/>在呼叫 `TestBed.inject` 後，`TestBed` 設定會在目前規格的期間凍結。 |
|
 `initTestEnvironment` | 初始化整個測試執行階段的測試環境。<br />測試模擬（`karma-test-shim`、`browser-test-shim`）會為您呼叫它，因此您很少有理由自己呼叫它。<br />呼叫此方法 *僅一次*。若要在測試執行階段的中間變更此預設值，請先呼叫 `resetTestEnvironment`。<br />指定 Angular 編譯器工廠、`PlatformRef` 和預設 Angular 測試模組。一般形式 `@angular/platform-<platform_name>/testing/<platform_name>` 中提供了非瀏覽器平台的替代選項。                                                                  |
| `resetTestEnvironment`                                         | 重設初始測試環境，包括預設測試模組。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

有一些 `TestBed` 實例方法沒有被靜態 `TestBed` *類別* 方法涵蓋。
這些很少需要用到。

## `ComponentFixture`

`TestBed.createComponent<T>` 會建立元件 `T` 的執行個體，並為該元件傳回強類型化的 `ComponentFixture`。

`ComponentFixture` 屬性和方法提供對元件、其 DOM 表達和其 Angular 環境的層面存取權限。

### `ComponentFixture` 屬性

以下是最重要的測試人員屬性，按可能效用排序。

| 屬性          | 詳細資訊 |
|:---                 |:---     |
| `componentInstance` | 由 `TestBed.createComponent` 建立的元件類別實例。                                                                                                                                                                                                                          |
| `debugElement`      | 與元件根元素相關聯的 `DebugElement`。 <br /> `debugElement` 提供測試和除錯期間元件及其 DOM 元素的深入資訊。對測試人員而言，這項屬性至關重要。最有趣的成員涵蓋於 [下方](#debug-element-details)。 |
| `nativeElement`     | 元件根部的原生 DOM 元素。                                                                                                                                                                                                                                               |
| `changeDetectorRef` | 元件的 `ChangeDetectorRef`。 <br /> 在測試具有 `ChangeDetectionStrategy.OnPush` 方法的元件，或是元件的變更偵測在您的程式控制之下時，`ChangeDetectorRef` 最為重要。                                                   |

### `ComponentFixture` 方法

*fixture* 方法會導致 Angular 對元件樹執行特定任務。
呼叫這些方法以觸發 Angular 行為以回應模擬的使用者動作。

以下是對測試人員最有用的方法。

| 方法             | 詳細資料 |
|:---                 |:---     |
| `detectChanges`     | 為元件觸發變更偵測週期。 <br /> 呼叫它以初始化元件（它會呼叫 `ngOnInit`）並在測試程式碼之後，變更元件的資料繫結屬性值。Angular 無法得知您已變更 `personComponent.name`，且不會更新 `name` 繫結，直到您呼叫 `detectChanges` 為止。 <br /> 之後執行 `checkNoChanges` 以確認沒有循環更新，除非呼叫時為 `detectChanges(false)`；                                                                                    |
| `autoDetectChanges` | 當您想要讓固定裝置自動偵測變更時，將此設定為 `true`。 <br /> 當自動偵測為 `true` 時，測試固定裝置會在建立元件後立即呼叫 `detectChanges`。然後，它會聆聽相關區域事件，並相應地呼叫 `detectChanges`。當您的測試程式碼直接修改元件屬性值時，您可能仍必須呼叫 `fixture.detectChanges` 以觸發資料繫結更新。 <br /> 預設值為 `false`。偏好精細控制測試行為的測試人員傾向於將其維持為 `false`。 |
| `checkNoChanges`    | 執行變更偵測以確認沒有待處理的變更。如果有，則擲回例外狀況。                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `isStable`          | 如果固定裝置目前為 *穩定*，則傳回 `true`。如果有尚未完成的非同步工作，則傳回 `false`。                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `whenStable`        | 傳回在固定裝置穩定時解析的承諾。 <br /> 如要於非同步活動或非同步變更偵測完成後繼續測試，請連結該承諾。請參閱 [whenStable](guide/testing/components-scenarios#when-stable)。                                                                                                                                                                                                                                                                                                  |
| `destroy`           | 觸發元件毀損。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### `DebugElement`

`DebugElement` 提供了元件的 DOM 表示形式的重要見解。

從測試根元件的 `DebugElement` 由 `fixture.debugElement` 傳回，您可以遍歷 \(並查詢\) 固定裝置的整個元素和元件子樹。

以下是最有用的 `DebugElement` 成員，按照實用性順序排列，供測試人員使用：

| Members               | Details |
|:---                   |:---     |
| `nativeElement`       | The corresponding DOM element in the browser                                                                                                                                                                                                                                                                        |
| `query`               | Calling `query(predicate: Predicate<DebugElement>)` returns the first `DebugElement` that matches the [predicate](#query-predicate) at any depth in the subtree.                                                                                                                                                                                                                                        |
| `queryAll`            | Calling `queryAll(predicate: Predicate<DebugElement>)` returns all `DebugElements` that matches the [predicate](#query-predicate) at any depth in subtree.                                                                                                                                                                                                                                              |
| `injector`            | The host dependency injector. For example, the root element's component instance injector.                                                                                                                                                                                                                                                                                                              |
| `componentInstance`   | The element's own component instance, if it has one.                                                                                                                                                                                                                                                                                                                                                    |
| `context`             | An object that provides parent context for this element. Often an ancestor component instance that governs this element. <br /> When an element is repeated within `*ngFor`, the context is an `NgForOf` whose `$implicit` property is the value of the row instance value. For example, the `hero` in `*ngFor="let hero of heroes"`.                                                                   |
| `children`            | The immediate `DebugElement` children. Walk the tree by descending through `children`.  `DebugElement` also has `childNodes`, a list of `DebugNode` objects. `DebugElement` derives from `DebugNode` objects and there are often more nodes than elements. Testers can usually ignore plain nodes.                                                                  |
| `parent`              | The `DebugElement` parent. Null if this is the root element.                                                                                                                                                                                                                                                                                                                                            |
| `name`                | The element tag name, if it is an element.                                                                                                                                                                                                                                                                                                                                                              |
| `triggerEventHandler` | Triggers the event by its name if there is a corresponding listener in the element's `listeners` collection. The second parameter is the *event object* expected by the handler. See [triggerEventHandler](guide/testing/components-scenarios#trigger-event-handler). <br /> If the event lacks a listener or there's some other problem, consider calling `nativeElement.dispatchEvent(eventObject)`. |
| `listeners`           | The callbacks attached to the component's `@Output` properties and/or the element's event properties.                                                                                                                                                                                                                                                                                                   |
| `providerTokens`      | This component's injector lookup tokens. Includes the component itself plus the tokens that the component lists in its `providers` metadata.                                                                                                                                                                                                                                                            |
| `source`              | Where to find this element in the source component template.                                                                                                                                                                                                                                                                                                                                            |
| `references`          | Dictionary of objects associated with template local variables \(for example, `#foo`\), keyed by the local variable name.                                                                                                                                                                                                                                                                                        |

`DebugElement.query(predicate)` 和 `DebugElement.queryAll(predicate)` 方法採用一個過濾來源元素子樹的謂詞，以尋找符合的 `DebugElement`。

謂詞是任何採用 `DebugElement` 並傳回 *truthy* 值的方法。
以下範例會找出所有具有名為「content」的範本局部變數參照的 `DebugElements`：

<docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="custom-predicate"/>

Angular `By` 類別有三個用於常見謂詞的靜態方法：

| 靜態方法             | 詳細資料 |
|:---                       |:---     |
| `By.all`                  | 傳回所有元素                                                        |
| `By.css(selector)`        | 傳回與 CSS 選擇器相符的元素                                |
| `By.directive(directive)` | 傳回 Angular 與指令類別的執行個體相符的元素 |

<docs-code header="app/hero/hero-list.component.spec.ts" path="adev/src/content/examples/testing/src/app/hero/hero-list.component.spec.ts" visibleRegion="by"/>
