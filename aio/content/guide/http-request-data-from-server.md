# HTTP：從伺服器請求資料

使用 [`HttpClient.get()`](api/common/http/HttpClient#get) 方法從伺服器擷取資料。
這個非同步方法會傳送 HTTP 請求，並回傳一個 Observable，在收到回應時發出所請求的資料。
回傳型別會依據你傳給呼叫的 `observe` 與 `responseType` 值而有所不同。

`get()` 方法接受兩個引數：要擷取資料的端點 URL，以及用來設定請求的 *options* 物件。

<code-example format="typescript" language="typescript">

options: {
  headers?: HttpHeaders &verbar; {[header: string]: string &verbar; string[]},
  observe?: 'body' &verbar; 'events' &verbar; 'response',
  params?: HttpParams&verbar;{[param: string]: string &verbar; number &verbar; boolean &verbar; ReadonlyArray&lt;string &verbar; number &verbar; boolean&gt;},
  reportProgress?: boolean,
  responseType?: 'arraybuffer'&verbar;'blob'&verbar;'json'&verbar;'text',
  withCredentials?: boolean,
}

</code-example>

重要的選項包括 *observe* 與 *responseType* 屬性。

*   *observe* 選項指定要回傳多少回應內容
*   *responseType* 選項指定回傳資料的格式

<div class="alert is-helpful">

使用 `options` 物件設定發出請求的其他各個面向。
例如，在加入標頭時，服務會使用 `headers` 選項屬性設定預設標頭。

使用 `params` 屬性以 HTTP URL 參數設定請求，並使用 `reportProgress` 選項，在傳輸大量資料時監聽進度事件。

</div>

應用程式經常向伺服器請求 JSON 資料。
在 `ConfigService` 範例中，應用程式需要在伺服器上有一個設定檔 `config.json`，其中指定了資源 URL。

<code-example header="assets/config.json" path="http/src/assets/config.json"></code-example>

若要擷取這類資料，`get()` 呼叫需要下列選項：`{observe: 'body', responseType: 'json'}`。
這些是這些選項的預設值，因此下列範例不會傳入選項物件。
後面的章節會介紹其他一些選項的可能性。

<a id="config-service"></a>

這個範例遵循建立可擴充解決方案的最佳實務：定義一個可重複使用的[可注入服務](guide/glossary#服務（service） "service definition")來執行資料處理功能。
除了擷取資料之外，這個服務還可以對資料進行後處理、加入錯誤處理與重試邏輯。

`ConfigService` 使用 `HttpClient.get()` 方法擷取這個檔案。

<code-example header="app/config/config.service.ts (getConfig v.1)" path="http/src/app/config/config.service.ts" region="getConfig_1"></code-example>

`ConfigComponent` 會注入 `ConfigService` 並呼叫 `getConfig` 服務方法。

因為服務方法會回傳設定資料的 `Observable`，元件會 *訂閱* 該方法的回傳值。
訂閱回呼函式會執行最少的後處理。
它會將資料欄位複製到元件的 `config` 物件中，該物件會在元件範本中進行資料繫結以顯示。

<code-example header="app/config/config.component.ts (showConfig v.1)" path="http/src/app/config/config.component.ts" region="v1"></code-example>

<a id="always-subscribe"></a>

## 開始請求

對於所有 `HttpClient` 方法，在你對方法回傳的 observable 呼叫 `subscribe()` 之前，方法不會開始其 HTTP 請求。

這對 *所有* `HttpClient` *方法* 都成立。

<div class="alert is-helpful">

當元件被銷毀時，你應該一律取消訂閱 observable。

</div>

`HttpClient` 方法回傳的所有 observable 在設計上都是 *cold*。
HTTP 請求的執行是 *延遲* 的，讓你可以在實際發生任何事之前，使用 `tap` 與 `catchError` 等額外操作擴充 observable。

呼叫 `subscribe()` 會觸發 observable 的執行，並使 `HttpClient` 組成 HTTP 請求並傳送到伺服器。

請將這些 observable 視為實際 HTTP 請求的 *藍圖*。

<div class="alert is-helpful">

事實上，每次 `subscribe()` 都會啟動 observable 一次獨立的執行。
訂閱兩次會產生兩個 HTTP 請求。

<code-example format="javascript" language="javascript">

const req = http.get&lt;Heroes&gt;('/api/heroes');
// 0 requests made - .subscribe() not called.
req.subscribe();
// 1 request made.
req.subscribe();
// 2 requests made.

</code-example>

</div>

<a id="typed-response"></a>

## 請求具型別的回應

請為 `HttpClient` 請求的結構宣告回應物件的型別，讓輸出更容易、更明確地被使用。
指定回應型別在編譯期可作為型別斷言。

<div class="alert is-important">

指定回應型別是向 TypeScript 宣告，它應該將你的回應視為給定的型別。
這是建置期檢查，並不保證伺服器實際上會回應這種型別的物件。
伺服器有責任確保回傳伺服器 API 指定的型別。

</div>

若要指定回應物件的型別，請先定義一個具備必要屬性的介面。
請使用介面而非類別，因為回應是一個純物件，無法自動轉換為類別的實例。

<code-example path="http/src/app/config/config.service.ts" region="config-interface"></code-example>

接著，在服務中將該介面指定為 `HttpClient.get()` 呼叫的型別參數。

<code-example header="app/config/config.service.ts (getConfig v.2)" path="http/src/app/config/config.service.ts" region="getConfig_2"></code-example>

<div class="alert is-helpful">

當你將介面作為型別參數傳給 `HttpClient.get()` 方法時，請使用 [RxJS `map` 運算子](guide/rx-library#運算子)視 UI 需要轉換回應資料。
接著你可以將轉換後的資料傳給 [async 管道](api/common/AsyncPipe)。

</div>

更新後元件方法中的回呼函式會收到一個具型別的資料物件，使用起來更容易、更安全：

<code-example header="app/config/config.component.ts (showConfig v.2)" path="http/src/app/config/config.component.ts" region="v2"></code-example>

若要存取介面中定義的屬性，你必須明確地將從 JSON 取得的純物件轉換為所需的回應型別。
例如，下列 `subscribe` 回呼函式會收到 `data` 作為 Object，再進行型別轉換以存取屬性。

<code-example format="typescript" language="typescript">

.subscribe(data =&gt; this.config = {
  heroesUrl: (data as any).heroesUrl,
  textfile:  (data as any).textfile,
});

</code-example>

<a id="string-union-types"></a>

<div class="callout is-important">

<header><code>observe</code> 與 <code>response</code> 型別</header>

`observe` 與 `response` 選項的型別是 *字串聯集*，而非單純的字串。

<code-example format="typescript" language="typescript">

options: {
  &hellip;
  observe?: 'body' &verbar; 'events' &verbar; 'response',
  &hellip;
  responseType?: 'arraybuffer'&verbar;'blob'&verbar;'json'&verbar;'text',
  &hellip;
}

</code-example>

這可能會造成混淆。
例如：

<code-example format="typescript" language="typescript">

// this works
client.get('/foo', {responseType: 'text'})

// but this does NOT work
const options = {
  responseType: 'text',
};
client.get('/foo', options)

</code-example>

在第二種情況下，TypeScript 會推斷 `options` 的型別為 `{responseType: string}`。
這個型別太寬，無法傳給 `HttpClient.get`，因為它預期 `responseType` 的型別是其中一個 *特定* 字串。
`HttpClient` 刻意以這種方式明確定義型別，讓編譯器可以根據你提供的選項回報正確的回傳型別。

請使用 `as const` 讓 TypeScript 知道你確實是要使用常數字串型別：

<code-example format="typescript" language="typescript">

const options = {
  responseType: 'text' as const,
};
client.get('/foo', options);

</code-example>

</div>

## 讀取完整回應

在前一個範例中，`HttpClient.get()` 的呼叫沒有指定任何選項。
依預設，它回傳了回應主體中包含的 JSON 資料。

你可能需要比回應主體包含的資訊更多的交易資訊。
有時候伺服器會回傳特殊的標頭或狀態碼，以表示對應用程式工作流程很重要的特定狀況。

請使用 `get()` 方法的 `observe` 選項，告訴 `HttpClient` 你想要完整的回應：

<code-example path="http/src/app/config/config.service.ts" region="getConfigResponse"></code-example>

現在 `HttpClient.get()` 回傳的是 `HttpResponse` 型別的 `Observable`，而不只是主體中包含的 JSON 資料。

元件的 `showConfigResponse()` 方法會同時顯示回應標頭與設定：

<code-example header="app/config/config.component.ts (showConfigResponse)" path="http/src/app/config/config.component.ts" region="showConfigResponse"></code-example>

如你所見，回應物件有一個正確型別的 `body` 屬性。

@reviewed 2023-02-27
