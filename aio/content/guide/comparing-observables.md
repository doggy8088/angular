# Observable 與其他技術的比較

你經常可以用 observable 取代 promise，以非同步方式傳遞值。同樣地，observable 也可以取代事件處理常式。最後，由於 observable 可以傳遞多個值，你可以在原本需要建立陣列並對其操作的場合使用它。

在上述每種情況下，observable 的行為都與替代技術略有不同，但提供了一些顯著的優點。以下詳細比較這些差異。

## Observable 與 Promise 的比較

Observable 經常被拿來與 promise 比較。以下是一些主要的差異：

*   Observable 是宣告式的；計算要等到訂閱時才開始。
    Promise 在建立時會立即執行。
    這讓 observable 很適合用來定義配方，在你需要結果時隨時執行。

*   Observable 提供多個值。
    Promise 只提供一個值。
    這讓 observable 很適合用來隨時間取得多個值。

*   Observable 會區分鏈結與訂閱。
    Promise 只有 `.then()` 子句。
    這讓 observable 很適合用來建立複雜的轉換配方，供系統的其他部分使用，而不會導致工作被執行。

*   Observable 的 `subscribe()` 負責處理錯誤。
    Promise 會把錯誤推給子 promise。
    這讓 observable 很適合用來集中且可預測地處理錯誤。

### 建立與訂閱

*   在消費者訂閱之前，observable 不會執行。
    `subscribe()` 會執行已定義的行為一次，而且可以再次呼叫。
    每次訂閱都有自己的計算。
    重新訂閱會導致重新計算值。

    <code-example header="src/observables.ts (observable)" path="comparing-observables/src/observables.ts" region="observable"></code-example>

*   Promise 會立即執行，而且只執行一次。
    結果的計算在 promise 建立時啟動。
    沒有辦法重新開始工作。
    所有的 `then` 子句（訂閱）共享同一個計算。

    <code-example header="src/promises.ts (promise)" path="comparing-observables/src/promises.ts" region="promise"></code-example>

### 鏈結

*   Observable 會區分轉換函式（例如 map）與訂閱。
    只有訂閱會啟用訂閱者函式，開始計算值。

    <code-example header="src/observables.ts (chain)" path="comparing-observables/src/observables.ts" region="chain"></code-example>

*   Promise 不會區分最後的 `.then` 子句（相當於訂閱）與中間的 `.then` 子句（相當於 map）。

    <code-example header="src/promises.ts (chain)" path="comparing-observables/src/promises.ts" region="chain"></code-example>

### 取消

*   Observable 的訂閱可以取消。
    取消訂閱會讓監聽器不再接收後續的值，並通知訂閱者函式取消工作。

    <code-example header="src/observables.ts (unsubscribe)" path="comparing-observables/src/observables.ts" region="unsubscribe"></code-example>

*   Promise 無法取消。

### 錯誤處理

*   Observable 的執行錯誤會傳遞給訂閱者的錯誤處理常式，且訂閱者會自動取消訂閱 observable。

    <code-example header="src/observables.ts (error)" path="comparing-observables/src/observables.ts" region="error"></code-example>

*   Promise 會把錯誤推給子 promise。

    <code-example header="src/promises.ts (error)" path="comparing-observables/src/promises.ts" region="error"></code-example>

### 速查表

下列程式碼片段說明了如何使用 observable 與 promise 定義同一種操作。

| 操作   | Observable                                                                                                                                                           | Promise |
|:---         |:---                                                                                                                                                                  |:---     |
| 建立    | <code-example format="typescript" hideCopy language="typescript"> new Observable((observer) =&gt; { &NewLine;&nbsp; observer.next(123); &NewLine;}); </code-example> | <code-example format="typescript" hideCopy language="typescript"> new Promise((resolve, reject) =&gt; { &NewLine;&nbsp; resolve(123); &NewLine;}); </code-example> |
| 轉換   | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(map((value) =&gt; value &ast; 2));</pre>                                                  | <code-example format="typescript" hideCopy language="typescript"> promise.then((value) =&gt; value &ast; 2);</code-example>                                        |
| 訂閱   | <code-example format="typescript" hideCopy language="typescript"> sub = obs.subscribe((value) =&gt; { &NewLine;&nbsp; console.log(value) &NewLine;});</code-example> | <code-example format="typescript" hideCopy language="typescript"> promise.then((value) =&gt; { &NewLine;&nbsp; console.log(value); &NewLine;}); </code-example>    |
| 取消訂閱 | <code-example format="typescript" hideCopy language="typescript"> sub.unsubscribe();</code-example>                                                                  | 由 promise 解析時自動處理。                                                                                                                                     |

## Observable 與 Events API 的比較

Observable 與使用 Events API 的事件處理常式非常相似。兩種技術都會定義通知處理常式，並用它們處理隨時間傳遞的多個值。訂閱 observable 就相當於加入事件監聽器。一個顯著的差異是，你可以設定 observable，在事件傳遞給處理常式之前先轉換它。

在 HTTP 請求等情境中，使用 observable 處理事件與非同步操作的好處是具備更高的一致性。

以下是一些程式碼範例，說明如何使用 observable 與 Events API 定義同一種操作。

|                             | Observable                                                                                                                                                                                                                                                                                                                                                      | Events API |
|:---                         |:---                                                                                                                                                                                                                                                                                                                                                             |:---        |
| 建立與取消 | <code-example format="typescript" hideCopy language="typescript"> // Setup &NewLine;const clicks&dollar; = fromEvent(buttonEl, 'click'); &NewLine;// Begin listening &NewLine;const subscription = clicks&dollar; &NewLine;&nbsp; .subscribe(e =&gt; console.log('Clicked', e)) &NewLine;// Stop listening &NewLine;subscription.unsubscribe(); </code-example> | <code-example format="typescript" hideCopy language="typescript">function handler(e) { &NewLine;&nbsp; console.log('Clicked', e); &NewLine;} &NewLine;// Setup &amp; begin listening &NewLine;button.addEventListener('click', handler); &NewLine;// Stop listening &NewLine;button.removeEventListener('click', handler); </code-example> |
| 訂閱                | <code-example format="typescript" hideCopy language="typescript">observable.subscribe(() =&gt; { &NewLine;&nbsp; // notification handlers here &NewLine;});</code-example>                                                                                                                                                                                      | <code-example format="typescript" hideCopy language="typescript">element.addEventListener(eventName, (event) =&gt; { &NewLine;&nbsp; // notification handler here &NewLine;}); </code-example>                                                                                                                                             |
| 設定               | 監聽按鍵，但提供一個代表輸入框中值的串流。 <code-example format="typescript" hideCopy language="typescript"> fromEvent(inputEl, 'keydown').pipe( &NewLine;&nbsp; map(e =&gt; e.target.value) &NewLine;); </code-example>                                                                                                  | 不支援設定。 <code-example format="typescript" hideCopy language="typescript"> element.addEventListener(eventName, (event) =&gt; { &NewLine;&nbsp; // Cannot change the passed Event into another &NewLine;&nbsp; // value before it gets to the handler &NewLine;}); </code-example>                                   |

## Observable 與陣列的比較

Observable 會隨時間產生值。陣列則是建立為一組靜態的值。某種意義上，observable 是非同步的，而陣列是同步的。在下列範例中，<code>&rarr;</code> 表示非同步的值傳遞。

| 值        | Observable                                                                                                                                                                                                                                           | 陣列                                                                                                                                                                                                                |
|:---           |:---                                                                                                                                                                                                                                                  |:---                                                                                                                                                                                                                 |
| 已知值         | <code-example format="typescript" hideCopy language="typescript"> obs: &rarr;1&rarr;2&rarr;3&rarr;5&rarr;7 </code-example> <code-example format="typescript" hideCopy language="typescript"> obsB: &rarr;'a'&rarr;'b'&rarr;'c' </code-example>       | <code-example format="typescript" hideCopy language="typescript"> arr: [1, 2, 3, 5, 7] </code-example> <code-example format="typescript" hideCopy language="typescript"> arrB: ['a', 'b', 'c'] </code-example>      |
| `concat()`    | <code-example format="typescript" hideCopy language="typescript"> concat(obs, obsB) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;1&rarr;2&rarr;3&rarr;5&rarr;7&rarr;'a'&rarr;'b'&rarr;'c' </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.concat(arrB) </code-example> <code-example format="typescript" hideCopy language="typescript"> [1,2,3,5,7,'a','b','c'] </code-example>        |
| `filter()`    | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(filter((v) =&gt; v&gt;3)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;5&rarr;7 </code-example>                                | <code-example format="typescript" hideCopy language="typescript"> arr.filter((v) =&gt; v&gt;3) </code-example> <code-example format="typescript" hideCopy language="typescript"> [5, 7] </code-example>             |
| `find()`      | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(find((v) =&gt; v&gt;3)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;5 </code-example>                                         | <code-example format="typescript" hideCopy language="typescript"> arr.find((v) =&gt; v&gt;3) </code-example> <code-example format="typescript" hideCopy language="typescript"> 5 </code-example>                    |
| `findIndex()` | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(findIndex((v) =&gt; v&gt;3)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;3 </code-example>                                    | <code-example format="typescript" hideCopy language="typescript"> arr.findIndex((v) =&gt; v&gt;3) </code-example> <code-example format="typescript" hideCopy language="typescript"> 3 </code-example>               |
| `forEach()`   | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(tap((v) =&gt; { &NewLine; &nbsp; console.log(v); &NewLine; })) &NewLine; 1 &NewLine; 2 &NewLine; 3 &NewLine; 5 &NewLine; 7 </code-example>                                | <code-example format="typescript" hideCopy language="typescript"> arr.forEach((v) =&gt; { &NewLine; &nbsp; console.log(v); &NewLine; }) &NewLine; 1 &NewLine; 2 &NewLine; 3 &NewLine; 5 &NewLine; 7 </code-example> |
| `map()`       | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(map((v) =&gt; -v)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;-1&rarr;-2&rarr;-3&rarr;-5&rarr;-7 </code-example>             | <code-example format="typescript" hideCopy language="typescript"> arr.map((v) =&gt; -v) </code-example> <code-example format="typescript" hideCopy language="typescript"> [-1, -2, -3, -5, -7] </code-example>      |
| `reduce()`    | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(reduce((s,v)=&gt; s+v, 0)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;18 </code-example>                                     | <code-example format="typescript" hideCopy language="typescript"> arr.reduce((s,v) =&gt; s+v, 0) </code-example> <code-example format="typescript" hideCopy language="typescript"> 18 </code-example>               |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
