# RxJS 函式庫

反應式程式設計是一種非同步程式設計範式，關注資料流與變更的傳播（[維基百科](https://en.wikipedia.org/wiki/Reactive_programming)）。RxJS（Reactive Extensions for JavaScript）是一個用於反應式程式設計的函式庫，它使用 observable，讓組合非同步或回呼式程式碼變得更容易（[RxJS 文件](http://reactivex.io/rxjs/)）。

RxJS 提供了 `Observable` 型別的實作，在該型別成為語言的一部分、並且獲得瀏覽器支援之前，都需要它。這個函式庫也提供用於建立與操作 observable 的工具函式。這些工具函式可用於：

* 把現有非同步操作程式碼轉換為 observable
* 逐一取出串流中的值
* 把值對應到不同的型別
* 篩選串流
* 組合多個串流

## Observable 建立函式

RxJS 提供了許多可用於建立新 observable 的函式。這些函式可以簡化從事件、計時器與 promise 等來源建立 observable 的過程。例如：


<code-example path="rx-library/src/simple-creation.ts" region="promise" header="Create an observable from a promise"></code-example>

<code-example path="rx-library/src/simple-creation.ts" region="interval" header="Create an observable from a counter"></code-example>

<code-example path="rx-library/src/simple-creation.ts" region="event" header="Create an observable from an event"></code-example>

<code-example path="rx-library/src/simple-creation.ts" region="ajax" header="Create an observable that creates an AJAX request"></code-example>

## 運算子

運算子是建立在 observable 基礎上的函式，可對集合進行精細的操作。例如，RxJS 定義了 `map()`、`filter()`、`concat()` 與 `flatMap()` 等運算子。

運算子接受設定選項，並傳回一個接受來源 observable 的函式。執行這個傳回的函式時，運算子會觀察來源 observable 發出的值、加以轉換，並傳回一個包含這些轉換後值的新 observable。以下是一個簡單的範例：

<code-example path="rx-library/src/operators.ts" header="Map operator"></code-example>

你可以使用管道把運算子連結在一起。管道可以把多個函式結合成一個函式。`pipe()` 函式以你想組合的函式作為引數，並傳回一個新函式；執行時，它會依序執行組合後的函式。

把一組運算子套用到某個 observable，就像一份食譜&mdash;也就是一組用來產生你感興趣的值的操作說明。光是這份食譜本身不會做任何事。你需要呼叫 `subscribe()`，才能透過這份食譜產生結果。

範例如下：

<code-example path="rx-library/src/operators.1.ts" header="Standalone pipe function"></code-example>

`pipe()` 函式也是 RxJS `Observable` 上的一個方法，所以你可以用這種較簡短的形式定義相同的操作：

<code-example path="rx-library/src/operators.2.ts" header="Observable.pipe function"></code-example>

### 常見的運算子

RxJS 提供了許多運算子，但經常使用的只有少數幾個。關於運算子清單與使用範例，請造訪 [RxJS API 文件](https://rxjs-dev.firebaseapp.com/api)。

<div class="alert is-helpful">
  請注意，對於 Angular 應用程式，我們偏好以管道組合運算子，而不是用鏈接的方式。許多 RxJS 範例使用的是鏈接。
</div>

| 領域 | 運算子 |
| :------------| :----------|
| 建立 |  `from`,`fromEvent`, `of` |
| 組合 | `combineLatest`, `concat`, `merge`, `startWith` , `withLatestFrom`, `zip` |
| 篩選 | `debounceTime`, `distinctUntilChanged`, `filter`, `take`, `takeUntil` |
| 轉換 | `bufferTime`, `concatMap`, `map`, `mergeMap`, `scan`, `switchMap` |
| 工具 | `tap` |
| 多播 | `share` |

## 錯誤處理

除了你在訂閱時提供的 `error()` 處理器之外，RxJS 還提供 `catchError` 運算子，讓你處理 observable 食譜中已知的錯誤。

例如，假設你有一個 observable，它發出 API 請求，並對應到伺服器的回應。如果伺服器傳回錯誤，或是值不存在，就會產生一個錯誤。如果你捕捉這個錯誤並提供一個預設值，你的串流會繼續處理值，而不會直接出錯中斷。

以下是使用 `catchError` 運算子來做到這一點的範例：

<code-example path="rx-library/src/error-handling.ts" header="catchError operator"></code-example>

### 重試失敗的 observable

`catchError` 運算子提供了一條簡單的復原途徑，而 `retry` 運算子則可以讓你重試失敗的請求。

請在 `catchError` 運算子之前使用 `retry` 運算子。它會重新訂閱原始的來源 observable，然後重新執行導致錯誤的完整動作序列。如果其中包含 HTTP 請求，它就會重試該 HTTP 請求。

下列程式碼修改了前面的範例，會在捕捉錯誤之前先重試請求：

<code-example path="rx-library/src/retry-on-error.ts" header="retry operator"></code-example>

<div class="alert is-helpful">

   請勿重試**驗證**請求，因為這類請求只應由使用者操作來發起。我們不希望以使用者未發起的重複登入請求，導致使用者帳號被鎖定。

</div>

## Observable 的命名慣例

因為 Angular 應用程式大多以 TypeScript 撰寫，你通常會知道某個變數是不是 observable。雖然 Angular 框架並未強制規定 observable 的命名慣例，但你經常會看到 observable 的名稱結尾帶有「$」符號。

在瀏覽程式碼、尋找 observable 值時，這麼做會很有用。此外，如果你想用一個屬性來儲存某個 observable 的最新值，直接使用有或沒有「$」的相同名稱會很方便。

例如：

<code-example path="rx-library/src/naming-convention.ts" header="Naming observables"></code-example>
