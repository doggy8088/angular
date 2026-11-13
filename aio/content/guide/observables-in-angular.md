# Angular 中的 Observable

Angular 使用 observable 作為介面，來處理各種常見的非同步操作。例如：

<!--todo: Have Alex review this -->
<!-- *   You can define [custom events](guide/event-binding#custom-events-with-eventemitter) that send observable output data from a child to a parent component -->
*   HTTP 模組使用 observable 來處理 AJAX 請求與回應
*   Router 與 Forms 模組使用 observable 來監聽並回應使用者輸入事件

## 在元件之間傳輸資料

Angular 提供一個 `EventEmitter` 類別，用於透過 [`@Output()` 裝飾器](guide/inputs-outputs#output)從元件發佈值。`EventEmitter` 擴充了 RxJS 的 [`Subject`](https://rxjs.dev/api/index/class/Subject)，並加入一個 `emit()` 方法，讓它可以傳送任意值。當你呼叫 `emit()` 時，它會把發出的值傳給任何已訂閱觀察者的 `next()` 方法。

在 [EventEmitter](api/core/EventEmitter) 文件中可以找到一個很好的使用範例。以下是監聽開啟與關閉事件的範例元件：

<code-example format="typescript" language="typescript">

&lt;app-zippy (open)="onOpen(&dollar;event)" (close)="onClose(&dollar;event)"&gt;&lt;/app-zippy&gt;

</code-example>

以下是元件定義：

<code-example header="EventEmitter" path="observables-in-angular/src/main.ts" region="eventemitter"></code-example>

## HTTP

Angular 的 `HttpClient` 會從 HTTP 方法呼叫回傳 observable。例如，`http.get('/api')` 會回傳一個 observable。相較於以 promise 為基礎的 HTTP API，這有幾個優點：

*   Observable 不會改變伺服器回應（這可能發生在使用 promise 的鏈式 `.then()` 呼叫時）。相反地，你可以使用一連串運算子，依需要轉換值。

*   HTTP 請求可以透過 `unsubscribe()` 方法取消
*   請求可以設定為取得進度事件更新
*   失敗的請求可以輕鬆重試

## Async 管道

[AsyncPipe](api/common/AsyncPipe) 會訂閱一個 observable 或 promise，並回傳它發出的最新值。當發出新值時，該管道會將元件標記為需要檢查變更。

下列範例將 `time` observable 綁定到元件的檢視。該 observable 會持續以目前時間更新檢視。

<code-example header="Using async pipe" path="observables-in-angular/src/main.ts" region="pipe"></code-example>

## Router

[`Router.events`](api/router/Router#events) 以 observable 的形式提供事件。你可以使用 RxJS 的 `filter()` 運算子來尋找感興趣的事件，並訂閱它們，以便根據導覽流程中的事件順序做出決策。以下是一個範例：

<code-example header="Router events" path="observables-in-angular/src/main.ts" region="router"></code-example>

[ActivatedRoute](api/router/ActivatedRoute) 是一個注入的路由器服務，它使用 observable 來取得關於路由路徑與參數的資訊。例如，`ActivatedRoute.url` 包含一個會回報路由路徑的 observable。以下是一個範例：

<code-example header="ActivatedRoute" path="observables-in-angular/src/main.ts" region="activated_route"></code-example>

## 反應式表單

反應式表單具有使用 observable 來監控表單控制項值的屬性。[`FormControl`](api/forms/FormControl) 的屬性 `valueChanges` 與 `statusChanges` 包含會引發變更事件的 observable。訂閱 observable 表單控制項屬性，是在元件類別內觸發應用程式邏輯的一種方式。例如：

<code-example header="Reactive forms" path="observables-in-angular/src/main.ts" region="forms"></code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
