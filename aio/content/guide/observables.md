# Observables

Observables 提供在應用程式中的發佈者與訂閱者之間傳遞訊息的支援。Observables 相較於其他技術，在事件處理、非同步程式設計與處理多個值方面提供了顯著的優勢。

Observables 是宣告式的&mdash;也就是說，你定義一個用來發佈值的函式，但直到消費者訂閱它時才會執行。訂閱的消費者隨後會收到通知，直到函式完成，或直到他們取消訂閱。

observable 可以傳遞任何型別的多個值&mdash;字面值、訊息或事件，依情境而定。接收值的 API 相同，無論值是同步還是非同步傳遞。由於設定與拆解邏輯都由 observable 處理，你的應用程式程式碼只需要關心訂閱以取用值，以及完成後取消訂閱。無論串流是按鍵、HTTP 回應或間隔計時器，監聽值與停止監聽的介面都相同。

由於這些優點，observables 在 Angular 內部被廣泛使用，也推薦用於應用程式開發。

## 基本用法與術語

作為發佈者，你建立一個 `Observable` 實例，定義一個 *subscriber* 函式。這個函式會在消費者呼叫 `subscribe()` 方法時執行。訂閱者函式定義如何取得或產生要發佈的值或訊息。

若要執行你建立的 observable 並開始接收通知，你呼叫它的 `subscribe()` 方法，傳入一個 *observer*。這是一個 JavaScript 物件，定義了你收到的通知的處理常式。`subscribe()` 呼叫會回傳一個 `Subscription` 物件，它有一個 `unsubscribe()` 方法，你呼叫它來停止接收通知。

以下範例透過展示如何使用 observable 提供地理位置更新，來說明基本的使用模式。

<code-example path="observables/src/geolocation.ts" header="Observe geolocation updates"></code-example>

## 定義觀察者

接收 observable 通知的處理常式會實作 `Observer` 介面。它是一個物件，定義了回呼方法來處理 observable 可以傳送的三種通知類型：

| 通知類型 | 說明 |
|:---------|:-------------------------------------------|
| `next`  | 必要。每個傳遞值的處理常式。在執行開始後呼叫零次或多次。|
| `error` | 選用。錯誤通知的處理常式。錯誤會停止 observable 實例的執行。|
| `complete` | 選用。執行完成通知的處理常式。執行完成後，延遲的值仍可以繼續傳遞給 next 處理常式。|

觀察者物件可以定義這些處理常式的任意組合。如果你沒有為某種通知類型提供處理常式，觀察者會忽略該類型的通知。

## 訂閱

只有在有人訂閱時，`Observable` 實例才會開始發佈值。你呼叫實例的 `subscribe()` 方法並傳入一個觀察者物件來接收通知，以完成訂閱。

<div class="alert is-helpful">

為了展示訂閱如何運作，我們需要建立一個新的 observable。有一個建構函式可用來建立新的實例，但為了說明，我們可以使用 RxJS 程式庫中的一些方法，它們會建立常用類型的簡單 observable：

  * `of(...items)`&mdash;回傳一個 `Observable` 實例，同步傳遞作為引數提供的值。
  * `from(iterable)`&mdash;將其引數轉換為 `Observable` 實例。這個方法常用來將陣列轉換為 observable。

</div>

以下是一個建立並訂閱簡單 observable 的範例，觀察者會將收到的訊息記錄到主控台：

<code-example
  path="observables/src/subscribing.ts"
  region="observer"
  header="Subscribe using observer"></code-example>

或者，`subscribe()` 方法可以接受行內回呼函式定義，分別作為 `next`、`error` 與 `complete` 處理常式。例如，下列 `subscribe()` 呼叫與指定預先定義觀察者的呼叫相同：

<code-example path="observables/src/subscribing.ts" region="sub_fn" header="Subscribe with positional arguments"></code-example>

無論哪種情況，都需要一個 `next` 處理常式。`error` 與 `complete` 處理常式是選用的。

請注意，`next()` 函式可能接收例如訊息字串、事件物件、數值或結構，依情境而定。一般來說，我們把 observable 發佈的資料稱為 *串流*。任何型別的值都可以用 observable 表示，值會以串流的形式發佈。

## 建立 observable

使用 `Observable` 建構函式來建立任何型別的 observable 串流。建構函式以訂閱者函式作為引數，該函式會在 observable 的 `subscribe()` 方法執行時執行。訂閱者函式會接收一個 `Observer` 物件，並可以將值發佈到觀察者的 `next()` 方法。

例如，若要建立一個等同於上述 `of(1, 2, 3)` 的 observable，你可以這樣做：

<code-example path="observables/src/creating.ts" region="subscriber" header="Create observable with constructor"></code-example>

再進一步，我們可以建立一個發佈事件的 observable。在這個範例中，訂閱者函式是行內定義的。

<code-example path="observables/src/creating.ts" region="fromevent" header="Create with custom fromEvent function"></code-example>

現在你可以使用這個函式來建立一個發佈 keydown 事件的 observable：

<code-example path="observables/src/creating.ts" region="fromevent_use" header="Use custom fromEvent function"></code-example>

## 多播

典型的 observable 會為每個訂閱的觀察者建立新的、獨立的執行。當觀察者訂閱時，observable 會接上事件處理常式，並將值傳遞給該觀察者。當第二個觀察者訂閱時，observable 會再接上新的事件處理常式，並在獨立的執行中將值傳遞給第二個觀察者。

有時候，你不希望為每個訂閱者開始獨立的執行，而是希望每個訂閱都取得相同的值&mdash;即使值已經開始發送。例如文件物件的點擊 observable 就可能是這種情況。

*多播*是在單一執行中向多個訂閱者清單廣播的作法。使用多播 observable 時，你不會在文件上註冊多個監聽器，而是重複使用第一個監聽器，將值傳送給每個訂閱者。

建立 observable 時，你應該決定希望如何使用該 observable，以及是否要多播它的值。

來看一個從 1 數到 3 的範例，每個數字發送後延遲一秒。

<code-example path="observables/src/multicasting.ts" region="delay_sequence" header="Create a delayed sequence"></code-example>

請注意，如果你訂閱兩次，就會有兩個獨立的串流，每秒各發送一次值。看起來像這樣：

<code-example path="observables/src/multicasting.ts" region="subscribe_twice" header="Two subscriptions"></code-example>

將 observable 改為多播，看起來像這樣：

<code-example path="observables/src/multicasting.ts" region="multicast_sequence" header="Create a multicast subscriber"></code-example>

<div class="alert is-helpful">
   多播 observable 需要多一點設定，但對某些應用程式可能很有用。稍後我們會介紹簡化多播程序的工具，讓你可以將任何 observable 變成多播。
</div>

## 錯誤處理

由於 observables 是非同步產生值，try/catch 無法有效捕捉錯誤。你應該在觀察者上指定 `error` 回呼來處理錯誤。產生錯誤也會導致 observable 清理訂閱並停止產生值。observable 可以產生值（呼叫 `next` 回呼），也可以完成，呼叫 `complete` 或 `error` 回呼。

<code-example>
myObservable.subscribe({
  next(num) { console.log('Next num: ' + num)},
  error(err) { console.log('Received an errror: ' + err)}
});
</code-example>

錯誤處理（特別是從錯誤中復原）會在稍後的章節中更詳細說明。
