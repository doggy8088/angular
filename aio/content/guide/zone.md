<!-- vale Angular.Google_Headings = NO -->

# NgZone

<!-- vale Angular.Google_Headings = YES -->

區域是一種可跨非同步工作持續存在的執行環境。
你可以將它視為 JavaScript VM 的[執行緒區域儲存](https://en.wikipedia.org/wiki/Thread-local_storage)。
本指南說明如何使用 Angular 的 NgZone 自動偵測元件中的變更以更新 HTML。

## 變更偵測的基本概念

若要了解 `NgZone` 的優點，清楚掌握變更偵測是什麼以及如何運作非常重要。

### 在 Angular 中顯示與更新資料

在 Angular 中，你可以將 HTML 範本中的控制項繫結至 Angular 元件的屬性來顯示資料。

<code-example header="src/app/app.component.ts" path="displaying-data/src/app/app.component.1.ts"></code-example>

你也可以將 DOM 事件繫結至 Angular 元件的方法。
在這類方法中，你也可以更新 Angular 元件的屬性，進而更新範本中顯示的對應資料。

<code-example header="src/app/click-me.component.ts" path="user-input/src/app/click-me.component.ts" region="click-me-component"></code-example>

在前述兩個範例中，元件的程式碼只更新了元件的屬性。
HTML 也會自動更新。
本指南說明 Angular 如何以及何時根據 Angular 元件的資料渲染 HTML。

### 以純 JavaScript 偵測變更

為了說明如何偵測變更並更新值，請考慮下列以純 JavaScript 撰寫的程式碼。

<code-example format="javascript" language="javascript">

&lt;html&gt;
  &lt;div id="dataDiv"&gt;&lt;/div&gt;
  &lt;button id="btn"&gt;updateData&lt;/button&gt;
  &lt;canvas id="canvas"&gt;&lt;/canvas&gt;
  &lt;script&gt;
    let value = 'initialValue';
    // initial rendering
    detectChange();

    function renderHTML() {
      document.getElementById('dataDiv').innerText = value;
    }

    function detectChange() {
      const currentValue = document.getElementById('dataDiv').innerText;
      if (currentValue !== value) {
        renderHTML();
      }
    }

    // Example 1: update data inside button click event handler
    document.getElementById('btn').addEventListener('click', () =&gt; {
      // update value
      value = 'button update value';
      // call detectChange manually
      detectChange();
    });

    // Example 2: HTTP Request
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      // get response from server
      value = this.responseText;
      // call detectChange manually
      detectChange();
    });
    xhr.open('GET', serverUrl);
    xhr.send();

    // Example 3: setTimeout
    setTimeout(() =&gt; {
      // update value inside setTimeout callback
      value = 'timeout update value';
      // call detectChange manually
      detectChange();
    }, 100);

    // Example 4: Promise.then
    Promise.resolve('promise resolved a value').then(v =&gt; {
      // update value inside Promise thenCallback
      value = v;
      // call detectChange manually
      detectChange();
    }, 100);

    // Example 5: some other asynchronous APIs
    document.getElementById('canvas').toBlob(blob =&gt; {
      // update value when blob data is created from the canvas
      value = `value updated by canvas, size is &dollar;{blob.size}`;
      // call detectChange manually
      detectChange();
    });
  &lt;/script&gt;
&lt;/html&gt;

</code-example>

更新資料後，你需要手動呼叫 `detectChange()`，查看資料是否已變更。
如果資料已變更，你就渲染 HTML 以反映更新後的資料。

在 Angular 中，不需要這個步驟。
每當你更新資料時，HTML 都會自動更新。

### 應用程式何時更新 HTML

若要了解變更偵測如何運作，首先要考慮應用程式何時需要更新 HTML。
一般而言，更新會因下列其中一個原因而發生：

1.  元件初始化。
    例如，在啟動 Angular 應用程式時，Angular 會載入啟動元件並觸發 [ApplicationRef.tick()](api/core/ApplicationRef#tick) 來呼叫變更偵測與檢視渲染。

1.  事件監聽器。
    DOM 事件監聽器可以更新 Angular 元件中的資料，也可以觸發變更偵測，如下列範例所示。

    <code-example header="src/app/click-me.component.ts" path="user-input/src/app/click-me.component.ts" region="click-me-component"></code-example>

1.  HTTP 資料請求。
    你也可以透過 HTTP 請求從伺服器取得資料。
    例如：

    <code-example format="typescript" language="typescript">

    &commat;Component({
      selector: 'app-root',
      template: '&lt;div&gt;{{data}}&lt;/div&gt;';
    })
    export class AppComponent implements OnInit {
      data = 'initial value';
      serverUrl = 'SERVER_URL';
      constructor(private httpClient: HttpClient) {}

      ngOnInit() {
        this.httpClient.get(this.serverUrl).subscribe(response =&gt; {
          // user does not need to trigger change detection manually
          this.data = response.data;
        });
      }
    }

    </code-example>

1.  巨集任務，例如 `setTimeout()` 或 `setInterval()`。
    你也可以在 `setTimeout()` 等 `macroTask` 的回呼函式中更新資料。
    例如：

    <code-example format="typescript" language="typescript">

    &commat;Component({
      selector: 'app-root',
      template: '&lt;div&gt;{{data}}&lt;/div&gt;';
    })
    export class AppComponent implements OnInit {
      data = 'initial value';

      ngOnInit() {
        setTimeout(() =&gt; {
          // user does not need to trigger change detection manually
          this.data = 'value updated';
        });
      }
    }

    </code-example>

1.  微任務，例如 `Promise.then()`。
    其他非同步 API 會回傳 Promise 物件（例如 `fetch`），因此 `then()` 回呼函式也可以更新資料。
    例如：

    <code-example format="typescript" language="typescript">

    &commat;Component({
      selector: 'app-root',
      template: '&lt;div&gt;{{data}}&lt;/div&gt;';
    })
    export class AppComponent implements OnInit {
      data = 'initial value';

      ngOnInit() {
        Promise.resolve(1).then(v =&gt; {
          // user does not need to trigger change detection manually
          this.data = v;
        });
      }
    }

    </code-example>

1.  其他非同步操作。
    除了 `addEventListener()`、`setTimeout()` 與 `Promise.then()` 之外，還有其他可以非同步更新資料的操作。
    一些範例包括 `WebSocket.onmessage()` 與 `Canvas.toBlob()`。

    前述清單包含應用程式可能變更資料的最常見情境。
    Angular 會在偵測到資料可能已變更時執行變更偵測。
    變更偵測的結果是 DOM 會以新資料更新。
    Angular 以不同方式偵測變更。
    對於元件初始化，Angular 會明確呼叫變更偵測。
    對於[非同步操作](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous)，Angular 會使用區域來偵測資料可能已變更的位置，並自動執行變更偵測。

## 區域與執行環境

區域提供一個可跨非同步工作持續存在的執行環境。
[執行環境](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/this)是一個抽象概念，保存了關於目前正在執行的程式碼所處環境的資訊。
請考慮下列範例：

<code-example format="javascript" language="javascript">

const callback = function() {
  console.log('setTimeout callback context is', this);
}

const ctx1 = { name: 'ctx1' };
const ctx2 = { name: 'ctx2' };

const func = function() {
  console.log('caller context is', this);
  setTimeout(callback);
}

func.apply(ctx1);
func.apply(ctx2);

</code-example>

`setTimeout()` 回呼函式中的 `this` 值，可能會因 `setTimeout()` 被呼叫的時機而有所不同。
因此，你可能會在非同步操作中遺失環境。

區域提供了一個不同於 `this` 的新區域環境，這個區域環境會跨非同步操作持續存在。
在下列範例中，新的區域環境稱為 `zoneThis`。

<code-example format="javascript" language="javascript">

zone.run(() =&gt; {
  // now you are in a zone
  expect(zoneThis).toBe(zone);
  setTimeout(function() {
    // the zoneThis context will be the same zone
    // when the setTimeout is scheduled
    expect(zoneThis).toBe(zone);
  });
});

</code-example>

這個新的環境 `zoneThis` 可以從 `setTimeout()` 回呼函式中取得，而且這個環境在排定 `setTimeout()` 時是相同的。
若要取得環境，你可以呼叫 [`Zone.current`](https://github.com/angular/angular/blob/main/packages/zone.js/lib/zone.ts)。

## 區域與非同步生命週期掛鉤

Zone.js 可以建立跨非同步操作持續存在的環境，同時為非同步操作提供生命週期掛鉤。

<code-example format="javascript" language="javascript">

const zone = Zone.current.fork({
  name: 'zone',
  onScheduleTask: function(delegate, curr, target, task) {
    console.log('new task is scheduled:', task.type, task.source);
    return delegate.scheduleTask(target, task);
  },
  onInvokeTask: function(delegate, curr, target, task, applyThis, applyArgs) {
    console.log('task will be invoked:', task.type, task.source);
    return delegate.invokeTask(target, task, applyThis, applyArgs);
  },
  onHasTask: function(delegate, curr, target, hasTaskState) {
    console.log('task state changed in the zone:', hasTaskState);
    return delegate.hasTask(target, hasTaskState);
  },
  onInvoke: function(delegate, curr, target, callback, applyThis, applyArgs) {
    console.log('the callback will be invoked:', callback);
    return delegate.invoke(target, callback, applyThis, applyArgs);
  }
});
zone.run(() =&gt; {
  setTimeout(() =&gt; {
    console.log('timeout callback is invoked.');
  });
});

</code-example>

前述範例建立了一個具有數個掛鉤的區域。

`onXXXTask` 掛鉤會在工作狀態變更時觸發。
*區域工作*的概念可與 JavaScript VM 工作概念相比：

*   `macroTask`：例如 `setTimeout()`
*   `microTask`：例如 `Promise.then()`
*   `eventTask`：例如 `element.addEventListener()`

這些掛鉤會在下列情況下觸發：

| 掛鉤             | 詳細資訊 |
|:---              |:---     |
| `onScheduleTask` | 在排定新的非同步工作時觸發，例如呼叫 `setTimeout()` 時。                                                                                                                                                         |
| `onInvokeTask`   | 在非同步工作即將執行時觸發，例如 `setTimeout()` 的回呼函式即將執行時。                                                                                                                          |
| `onHasTask`      | 在區域內某種工作的狀態從穩定變為不穩定，或從不穩定變為穩定時觸發。「穩定」狀態表示區域內沒有工作，而「不穩定」表示區域內排定了新的工作。 |
| `onInvoke`       | 在同步函式即將在區域內執行時觸發。                                                                                                                                                                             |

有了這些掛鉤，`Zone` 可以觀察區域內所有同步與非同步操作的狀態。

前述範例會回傳下列輸出：

<code-example format="output" hideCopy language="shell">

the callback will be invoked: () =&gt; {
  setTimeout(() =&gt; {
    console.log('timeout callback is invoked.');
  });
}
new task is scheduled: macroTask setTimeout
task state changed in the zone: { microTask: false,
  macroTask: true,
  eventTask: false,
  change: 'macroTask' }
task will be invoked macroTask: setTimeout
timeout callback is invoked.
task state changed in the zone: { microTask: false,
  macroTask: false,
  eventTask: false,
  change: 'macroTask' }

</code-example>

`Zone` 的所有功能都由一個名為 [Zone.js](https://github.com/angular/angular/tree/main/packages/zone.js/README.md) 的程式庫提供。
此程式庫透過猴子補丁攔截非同步 API 來實作這些功能。
猴子補丁是一種在執行時期新增或變更函式預設行為的技術，無需變更原始碼。

<!-- vale Angular.Google_Headings = NO -->

## NgZone

<!-- vale Angular.Google_Headings = YES -->

雖然 Zone.js 可以觀察同步與非同步操作的所有狀態，Angular 還另外提供了一個名為 NgZone 的服務。
此服務會建立一個名為 `angular` 的區域，在滿足下列條件時自動觸發變更偵測：

1.  執行同步或非同步函式時
1.  沒有排定的 `microTask` 時

<!-- vale Angular.Google_Headings = NO -->

### NgZone 的 `run()` 與 `runOutsideOfAngular()`

<!-- vale Angular.Google_Headings = YES -->

`Zone` 會處理大多數非同步 API，例如 `setTimeout()`、`Promise.then()` 與 `addEventListener()`。
完整清單請參閱 [Zone 模組文件](https://github.com/angular/angular/blob/main/packages/zone.js/MODULE.md)。
在這些非同步 API 中，你不需要手動觸發變更偵測。

有些第三方 API 不由 Zone 處理。
在這些情況下，`NgZone` 服務提供了一個 [`run()`](api/core/NgZone#run) 方法，可讓你在 Angular 區域內執行函式。
這個函式，以及該函式中的所有非同步操作，會在正確的時間自動觸發變更偵測。

<code-example format="typescript" language="typescript">

export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    // New async API is not handled by Zone, so you need to use ngZone.run()
    // to make the asynchronous operation callback in the Angular zone and
    // trigger change detection automatically.
    someNewAsyncAPI(() =&gt; {
      this.ngZone.run(() =&gt; {
        // update the data of the component
      });
    });
  }
}

</code-example>

預設情況下，所有非同步操作都在 Angular 區域內，會自動觸發變更偵測。
另一種常見情況是你不希望觸發變更偵測。
在這種情況下，你可以使用另一個 `NgZone` 方法：[`runOutsideAngular()`](api/core/NgZone#runoutsideangular)。

<code-example format="typescript" language="typescript">

export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    // You know no data will be updated,
    // so you don't want to trigger change detection in this
    // specified operation. Instead, call ngZone.runOutsideAngular()
    this.ngZone.runOutsideAngular(() =&gt; {
      setTimeout(() =&gt; {
        // update component data
        // but don't trigger change detection.
      });
    });
  }
}

</code-example>

<!-- vale Angular.Google_Headings = NO -->

### 設定 Zone.js

<!-- vale Angular.Google_Headings = YES -->

若要在 Angular 中使用 Zone.js，你需要匯入 `zone.js` 套件。
如果你使用 Angular CLI，此步驟會自動完成，你可以在 `src/polyfills.ts` 中看到下列這行：

<code-example format="typescript" language="typescript">

/***************************************************************************************************
 &ast; Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.

</code-example>

在匯入 `zone.js` 套件之前，你可以設定下列組態：

*   停用某些非同步 API 的猴子補丁，以獲得更好的效能。
    例如，停用 `requestAnimationFrame()` 的猴子補丁，使 `requestAnimationFrame()` 的回呼函式不會觸發變更偵測。
    如果在你的應用程式中，`requestAnimationFrame()` 的回呼函式不會更新任何資料，這會很有用。

*   指定某些 DOM 事件不在 Angular 區域內執行。例如，防止 `mousemove` 或 `scroll` 事件觸發變更偵測

還可以變更其他數項設定。
若要進行這些變更，你需要建立一個 `zone-flags.ts` 檔案，如下所示。

<code-example format="typescript" language="typescript">

// disable patching requestAnimationFrame
(window as any).__Zone_disable_requestAnimationFrame = true;

// disable patching specified eventNames
(window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove'];

</code-example>

接著，在 `polyfills.ts` 中匯入 `zone.js` 之前先匯入 `zone-flags`：

<code-example format="typescript" language="typescript">

/***************************************************************************************************
 &ast; Zone JS is required by default for Angular.
 */
import `./zone-flags`;
import 'zone.js';  // Included with Angular CLI.

</code-example>

關於可以設定的項目，更多資訊請參閱 [Zone.js](https://github.com/angular/angular/tree/main/packages/zone.js) 文件。

<!-- vale Angular.Google_Headings = NO -->

### NoopZone

<!-- vale Angular.Google_Headings = YES -->

`Zone` 協助 Angular 知道何時觸發變更偵測，讓開發人員專注於應用程式開發。
預設情況下，`Zone` 已載入，無需進一步設定即可運作。
你不一定需要使用 `Zone` 才能讓 Angular 運作。
你也可以選擇自行觸發變更偵測。

<div class="callout is-helpful">

<header>停用 Zone</header>

**停用 `Zone` 需要你自行在正確的時機觸發所有變更偵測，這需要對變更偵測有全面的了解**。

</div>

若要移除 Zone.js，請進行下列變更。

1.  從 `polyfills.ts` 中移除 `zone.js` 匯入：

    <code-example format="typescript" language="typescript">

    /***************************************************************************************************
     &ast; Zone JS is required by default for Angular itself.
     */
    // import 'zone.js';  // Included with Angular CLI.

    </code-example>

1.  在 `src/main.ts` 中使用 `noop` 區域啟動 Angular：

    <code-example format="typescript" language="typescript">

    platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
    .catch(err =&gt; console.error(err));

    </code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
