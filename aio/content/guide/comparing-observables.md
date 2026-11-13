# Observable 與其他技術的比較

你經常可以用 observable 取代 promise，以非同步方式傳遞值。同樣地，observable 也可以取代事件處理常式。最後，由於 observable 可以傳遞多個值，你可以在原本需要建立陣列並對其操作的場合使用它。

在上述每種情況下，observable 的行為都與替代技術略有不同，但提供了一些顯著的優點。以下詳細比較這些差異。

## Observable 與 Promise 的比較

Observable 經常被拿來與 promise 比較。以下是一些主要的差異：

* Observable 是宣告式的；計算要等到訂閱時才開始。Promise 在建立時會立即執行。這讓 observable 很適合用來定義配方，在你需要結果時隨時執行。

* Observable 提供多個值。Promise 只提供一個值。這讓 observable 很適合用來隨時間取得多個值。

* Observable 會區分鏈結與訂閱。Promise 只有 `.then()` 子句。這讓 observable 很適合用來建立複雜的轉換配方，供系統的其他部分使用，而不會導致工作被執行。

* Observable 的 `subscribe()` 負責處理錯誤。Promise 會把錯誤推給子 promise。這讓 observable 很適合用來集中且可預測地處理錯誤。

### 建立與訂閱

* 在消費者訂閱之前，observable 不會執行。`subscribe()` 會執行已定義的行為一次，而且可以再次呼叫。每次訂閱都有自己的計算。重新訂閱會導致重新計算值。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (observable)" 
    region="observable">
  </code-example>

* Promise 會立即執行，而且只執行一次。結果的計算在 promise 建立時啟動。沒有辦法重新開始工作。所有的 `then` 子句（訂閱）共享同一個計算。

  <code-example 
    path="comparing-observables/src/promises.ts" 
    header="src/promises.ts (promise)"
    region="promise">
  </code-example>

### 鏈結

* Observable 會區分轉換函式（例如 map）與訂閱。只有訂閱會啟用訂閱者函式，開始計算值。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (chain)" 
    region="chain">
  </code-example>

* Promise 不會區分最後的 `.then` 子句（相當於訂閱）與中間的 `.then` 子句（相當於 map）。

  <code-example 
    path="comparing-observables/src/promises.ts"
    header="src/promises.ts (chain)" 
    region="chain">
  </code-example>

### 取消

* Observable 的訂閱可以取消。取消訂閱會讓監聽器不再接收後續的值，並通知訂閱者函式取消工作。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (unsubcribe)" 
    region="unsubscribe">
  </code-example>

* Promise 無法取消。

### 錯誤處理

* Observable 的執行錯誤會傳遞給訂閱者的錯誤處理常式，且訂閱者會自動取消訂閱 observable。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (error)"
    region="error">
  </code-example>

* Promise 會把錯誤推給子 promise。

  <code-example 
    path="comparing-observables/src/promises.ts" 
    header="src/promises.ts (error)"
    region="error">
  </code-example>

### 速查表

下列程式碼片段說明了如何使用 observable 與 promise 定義同一種操作。

<table>
  <thead>
    <tr>
      <th>操作</th>
      <th>Observable</th>
      <th>Promise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>建立</td>
      <td>
        <pre>
new Observable((observer) => {
  observer.next(123);
});</pre>
      </td>
      <td>
        <pre>
new Promise((resolve, reject) => {
  resolve(123);
});</pre>
      </td>
    </tr>
    <tr>
      <td>轉換</td>
      <td><pre>obs.pipe(map((value) => value * 2));</pre></td>
      <td><pre>promise.then((value) => value * 2);</pre></td>
    </tr>
    <tr>
      <td>訂閱</td>
      <td>
        <pre>
sub = obs.subscribe((value) => {
  console.log(value)
});</pre>
      </td>
      <td>
        <pre>
promise.then((value) => {
  console.log(value);
});</pre>
      </td>
    </tr>
    <tr>
      <td>取消訂閱</td>
      <td><pre>sub.unsubscribe();</pre></td>
      <td>由 promise 解析時自動處理。</td>
    </tr>
  </tbody>
</table>

## Observable 與 Events API 的比較

Observable 與使用 Events API 的事件處理常式非常相似。兩種技術都會定義通知處理常式，並用它們處理隨時間傳遞的多個值。訂閱 observable 就相當於加入事件監聽器。一個顯著的差異是，你可以設定 observable，在事件傳遞給處理常式之前先轉換它。

在 HTTP 請求等情境中，使用 observable 處理事件與非同步操作的好處是具備更高的一致性。

以下是一些程式碼範例，說明如何使用 observable 與 Events API 定義同一種操作。

<table>
  <tr>
    <th></th>
    <th>Observable</th>
    <th>Events API</th>
  </tr>
  <tr>
    <td>建立與取消</td>
    <td>
<pre>// Setup
let clicks$ = fromEvent(buttonEl, ‘click’);
// Begin listening
let subscription = clicks$
  .subscribe(e => console.log(‘Clicked’, e))
// Stop listening
subscription.unsubscribe();</pre>
   </td>
   <td>
<pre>function handler(e) {
  console.log(‘Clicked’, e);
}
// Setup & begin listening
button.addEventListener(‘click’, handler);
// Stop listening
button.removeEventListener(‘click’, handler);
</pre>
    </td>
  </tr>
  <tr>
    <td>訂閱</td>
    <td>
<pre>observable.subscribe(() => {
  // notification handlers here
});</pre>
    </td>
    <td>
<pre>element.addEventListener(eventName, (event) => {
  // notification handler here
});</pre>
    </td>
  </tr>
  <tr>
    <td>設定</td>
    <td>監聽按鍵，但提供一個代表輸入框中值的串流。
<pre>fromEvent(inputEl, 'keydown').pipe(
  map(e => e.target.value)
);</pre>
    </td>
    <td>不支援設定。
<pre>element.addEventListener(eventName, (event) => {
  // Cannot change the passed Event into another
  // value before it gets to the handler
});</pre>
    </td>
  </tr>
</table>

## Observable 與陣列的比較

Observable 會隨時間產生值。陣列則是建立為一組靜態的值。某種意義上，observable 是非同步的，而陣列是同步的。在下列範例中，➞ 表示非同步的值傳遞。

<table>
  <tr>
    <th></th>
    <th>Observable</th>
    <th>Array</th>
  </tr>
  <tr>
    <td>已知值</td>
    <td>
      <pre>obs: ➞1➞2➞3➞5➞7</pre>
      <pre>obsB: ➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr: [1, 2, 3, 5, 7]</pre>
      <pre>arrB: ['a', 'b', 'c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>concat()</pre></td>
    <td>
      <pre>concat(obs, obsB)</pre>
      <pre>➞1➞2➞3➞5➞7➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr.concat(arrB)</pre>
      <pre>[1,2,3,5,7,'a','b','c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>filter()</pre></td>
    <td>
      <pre>obs.pipe(filter((v) => v>3))</pre>
      <pre>➞5➞7</pre>
    </td>
    <td>
      <pre>arr.filter((v) => v>3)</pre>
      <pre>[5, 7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>find()</pre></td>
    <td>
      <pre>obs.pipe(find((v) => v>3))</pre>
      <pre>➞5</pre>
    </td>
    <td>
      <pre>arr.find((v) => v>3)</pre>
      <pre>5</pre>
    </td>
  </tr>
  <tr>
    <td><pre>findIndex()</pre></td>
    <td>
      <pre>obs.pipe(findIndex((v) => v>3))</pre>
      <pre>➞3</pre>
    </td>
    <td>
      <pre>arr.findIndex((v) => v>3)</pre>
      <pre>3</pre>
    </td>
  </tr>
  <tr>
    <td><pre>forEach()</pre></td>
    <td>
      <pre>obs.pipe(tap((v) => {
  console.log(v);
}))
1
2
3
5
7</pre>
    </td>
    <td>
      <pre>arr.forEach((v) => {
  console.log(v);
})
1
2
3
5
7</pre>
    </td>
  </tr>
  <tr>
    <td><pre>map()</pre></td>
    <td>
      <pre>obs.pipe(map((v) => -v))</pre>
      <pre>➞-1➞-2➞-3➞-5➞-7</pre>
    </td>
    <td>
      <pre>arr.map((v) => -v)</pre>
      <pre>[-1, -2, -3, -5, -7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>reduce()</pre></td>
    <td>
      <pre>obs.pipe(reduce((s,v)=> s+v, 0))</pre>
      <pre>➞18</pre>
    </td>
    <td>
      <pre>arr.reduce((s,v) => s+v, 0)</pre>
      <pre>18</pre>
    </td>
  </tr>
</table>
