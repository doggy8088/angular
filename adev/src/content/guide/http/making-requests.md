# 發出 HTTP 請求

`HttpClient` 具有對應各種 HTTP 動詞的方法，用來發出請求，既可載入資料，也可對伺服器套用變更。每個方法都會回傳一個 [RxJS `Observable`](https://rxjs.dev/guide/observable)，當它被訂閱時，就會送出請求，並在伺服器回應時發出結果。

NOTE: 由 `HttpClient` 建立的 `Observable` 可以被訂閱任意多次，每次訂閱都會向後端發出一個新請求。

透過傳給請求方法的 options 物件，可以調整請求的各種屬性，以及回傳的回應型別。

## 擷取 JSON 資料 {#fetching-json-data}

從後端擷取資料通常需要使用 [`HttpClient.get()`](api/common/http/HttpClient#get) 方法發出 GET 請求。此方法接受兩個參數：要擷取資料的字串端點 URL，以及一個用來設定請求的「選用 options」物件。

例如，使用 `HttpClient.get()` 方法從一個假設的 API 擷取設定資料：

<docs-code language="ts">
http.get<Config>('/api/config').subscribe(config => {
  // process the configuration.
});
</docs-code>

請注意其中的泛型型別參數，它指定伺服器回傳的資料型別為 `Config`。此參數為選用，如果省略，回傳資料的型別將為 `any`。

TIP: 如果資料的形狀未知，那麼比起 `any`，更安全的替代方案是使用 `unknown` 型別作為回應型別。

CRITICAL: 請求方法的泛型型別，是對伺服器回傳資料的一種型別「斷言」。`HttpClient` 不會驗證實際回傳的資料是否符合此型別。

## 擷取其他型別的資料

`HttpClient` 預設假設伺服器會回傳 JSON 資料。當與非 JSON 的 API 互動時，你可以在發出請求時告訴 `HttpClient` 預期何種回應型別。這是透過 `responseType` 選項完成的。

| **`responseType` 值** | **回傳的回應型別**                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `'json'`（預設）       | 給定泛型型別的 JSON 資料                                                                                                       |
| `'text'`                 | 字串資料                                                                                                                               |
| `'arraybuffer'`          | 包含原始回應位元組的 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |
| `'blob'`                 | [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) 執行個體                                                                        |

例如，你可以要求 `HttpClient` 把 `.jpeg` 圖片的原始位元組下載到 `ArrayBuffer` 中：

<docs-code language="ts">
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe(buffer => {
  console.log('The image is ' + buffer.length + ' bytes large');
});
</docs-code>

<docs-callout important title="`responseType` 的字面值">
因為 `responseType` 的值會影響 `HttpClient` 回傳的型別，它必須是字面型別，而非 `string` 型別。

如果傳給請求方法的 options 物件本身是字面物件，這會自動成立；但如果你把請求選項抽出到變數或輔助方法中，你可能需要明確將其指定為字面值，例如 `responseType: 'text' as const`。
</docs-callout>

## 變更伺服器狀態

執行變更的伺服器 API，通常需要發出 POST 請求，並在請求主體中指定新狀態或要套用的變更。

[`HttpClient.post()`](api/common/http/HttpClient#post) 方法的行為與 `get()` 類似，並在其 options 之前接受一個額外的 `body` 參數：

<docs-code language="ts">
http.post<Config>('/api/config', newConfig).subscribe(config => {
  console.log('Updated config:', config);
});
</docs-code>

請求的 `body` 可以提供許多不同型別的值，`HttpClient` 會相應地將它們序列化：

| **`body` 型別**                                                                                                               | **序列化為**                                    |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| string                                                                                                                        | 純文字                                           |
| number、boolean、array 或 plain object                                                                                       | JSON                                                 |
| [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)                       | 來自緩衝區的原始資料                             |
| [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)                                                                     | 帶有 `Blob` 內容型別的原始資料              |
| [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)                                                             | `multipart/form-data` 編碼資料                   |
| [`HttpParams`](api/common/http/HttpParams) 或 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | `application/x-www-form-urlencoded` 格式字串 |

IMPORTANT: 請記得對變更請求的 `Observable` 呼叫 `.subscribe()`，請求才會真正發出。

## 設定 URL 參數 {#setting-url-parameters}

使用 `params` 選項，指定應包含在請求 URL 中的請求參數。

傳入物件字面值是設定 URL 參數最簡單的方式：

<docs-code language="ts">
http.get('/api/config', {
  params: {filter: 'all'},
}).subscribe(config => {
  // ...
});
</docs-code>

或者，如果你需要對參數的建構或序列化有更多控制，可以傳入 `HttpParams` 的執行個體。

IMPORTANT: `HttpParams` 的執行個體是「不可變」的，無法直接變更。變更方法（例如 `append()`）會回傳一個套用了變更的新 `HttpParams` 執行個體。

<docs-code language="ts">
const baseParams = new HttpParams().set('filter', 'all');

http.get('/api/config', {
  params: baseParams.set('details', 'enabled'),
}).subscribe(config => {
  // ...
});
</docs-code>

你可以使用自訂的 `HttpParameterCodec` 來建立 `HttpParams`，由它決定 `HttpClient` 如何將參數編碼進 URL。

## 設定請求標頭 {#setting-request-headers}

使用 `headers` 選項，指定應包含在請求中的請求標頭。

傳入物件字面值是設定請求標頭最簡單的方式：

<docs-code language="ts">
http.get('/api/config', {
  headers: {
    'X-Debug-Level': 'verbose',
  }
}).subscribe(config => {
  // ...
});
</docs-code>

或者，如果你需要對標頭的建構有更多控制，可以傳入 `HttpHeaders` 的執行個體。

IMPORTANT: `HttpHeaders` 的執行個體是「不可變」的，無法直接變更。變更方法（例如 `append()`）會回傳一個套用了變更的新 `HttpHeaders` 執行個體。

<docs-code language="ts">
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http.get<Config>('/api/config', {
  params: baseParams.set('X-Debug-Level', 'verbose'),
}).subscribe(config => {
  // ...
});
</docs-code>

## 與伺服器回應事件互動 {#interacting-with-the-server-response-events}

為了方便，`HttpClient` 預設回傳伺服器回傳資料（回應主體）的 `Observable`。有時我們會想檢視實際的回應，例如擷取特定的回應標頭。

若要存取完整的回應，請將 `observe` 選項設定為 `'response'`：

<docs-code language="ts">
http.get<Config>('/api/config', {observe: 'response'}).subscribe(res => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
</docs-code>

<docs-callout important title="`observe` 的字面值">
因為 `observe` 的值會影響 `HttpClient` 回傳的型別，它必須是字面型別，而非 `string` 型別。

如果傳給請求方法的 options 物件本身是字面物件，這會自動成立；但如果你把請求選項抽出到變數或輔助方法中，你可能需要明確將其指定為字面值，例如 `observe: 'response' as const`。
</docs-callout>

## 接收原始進度事件 {#receiving-raw-progress-events}

除了回應主體或回應物件之外，`HttpClient` 也可以回傳一串原始「事件」，對應請求生命週期中的特定時刻。這些事件包括請求送出時、回應標頭回傳時，以及主體完成時。這些事件還可以包括「進度事件」，回報大型請求或回應主體的上傳與下載狀態。

進度事件預設為停用（因為它們有效能成本），但可以透過 `reportProgress` 選項啟用。

NOTE: `HttpClient` 的選用 `fetch` 實作不會回報「上傳」進度事件。

若要觀察事件串流，請將 `observe` 選項設定為 `'events'`：

<docs-code language="ts">
http.post('/api/upload', myData, {
  reportProgress: true,
  observe: 'events',
}).subscribe(event => {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
      break;
    case HttpEventType.Response:
      console.log('Finished uploading!');
      break;
  }
});
</docs-code>

<docs-callout important title="`observe` 的字面值">
因為 `observe` 的值會影響 `HttpClient` 回傳的型別，它必須是字面型別，而非 `string` 型別。

如果傳給請求方法的 options 物件本身是字面物件，這會自動成立；但如果你把請求選項抽出到變數或輔助方法中，你可能需要明確將其指定為字面值，例如 `observe: 'events' as const`。
</docs-callout>

事件串流中回報的每個 `HttpEvent` 都有一個 `type`，用來區分該事件代表什麼：

| **`type` 值**                 | **事件意義**                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `HttpEventType.Sent`             | 請求已送往伺服器                                      |
| `HttpEventType.UploadProgress`   | 一個 `HttpUploadProgressEvent`，回報請求主體的上傳進度      |
| `HttpEventType.ResponseHeader`   | 已收到回應的開頭，包括狀態與標頭           |
| `HttpEventType.DownloadProgress` | 一個 `HttpDownloadProgressEvent`，回報回應主體的下載進度 |
| `HttpEventType.Response`         | 已收到完整回應，包括回應主體                 |
| `HttpEventType.User`             | 來自 HTTP 攔截器的自訂事件。                                           |

## 處理請求失敗 {#handling-request-failure}

HTTP 請求可能以兩種方式失敗：

* 網路或連線錯誤可能使請求無法到達後端伺服器。
* 後端可以收到請求，但處理失敗，並回傳錯誤回應。

`HttpClient` 會將這兩類錯誤擷取在 `HttpErrorResponse` 中，並透過 `Observable` 的錯誤通道回傳。網路錯誤的 `status` 碼為 `0`，且 `error` 是 [`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) 的執行個體。後端錯誤帶有後端回傳的失敗 `status` 碼，並以錯誤回應作為 `error`。請檢查回應，以找出錯誤的成因，以及處理錯誤的適當行動。

[RxJS 函式庫](https://rxjs.dev/)提供多個對錯誤處理有幫助的運算子。

你可以使用 `catchError` 運算子，將錯誤回應轉換為給 UI 使用的值。這個值可以告訴 UI 顯示錯誤頁面或錯誤值，並在必要時擷取錯誤的成因。

有時，網路中斷等暫時性錯誤可能導致請求意外失敗，而只要重試請求就能成功。RxJS 提供多個「重試」運算子，會在特定條件下自動重新訂閱失敗的 `Observable`。例如，`retry()` 運算子會自動嘗試重新訂閱指定的次數。

## Http `Observable`s

`HttpClient` 上的每個請求方法都會建構並回傳一個所請求回應型別的 `Observable`。在使用 `HttpClient` 時，了解這些 `Observable` 如何運作非常重要。

`HttpClient` 產生 RxJS 所謂的「冷」`Observable`，意思是除非 `Observable` 被訂閱，否則不會發生真正的請求。只有到那時，請求才會真正送往伺服器。多次訂閱同一個 `Observable` 將觸發多次後端請求。每次訂閱都是獨立的。

TIP: 你可以把 `HttpClient` 的 `Observable` 想像成真正伺服器請求的「藍圖」。

一旦訂閱，取消訂閱將中止進行中的請求。如果 `Observable` 是透過 `async` 管道訂閱的，這非常有用，因為當使用者離開目前頁面時，它會自動取消請求。此外，如果你搭配 RxJS 組合器（例如 `switchMap`）使用 `Observable`，這種取消機制會清除所有過時的請求。

回應回傳後，來自 `HttpClient` 的 `Observable` 通常會完成（但攔截器可能影響這一點）。

由於會自動完成，如果不清理 `HttpClient` 的訂閱，通常沒有記憶體洩漏的風險。然而，如同任何非同步操作，我們強烈建議在元件銷毀時清理訂閱，否則訂閱回呼可能會執行，並在試圖與已銷毀的元件互動時遇到錯誤。

TIP: 使用 `async` 管道或 `toSignal` 操作來訂閱 `Observable`，可確保訂閱被妥善處置。

## 最佳實務

雖然 `HttpClient` 可以直接注入並在元件中使用，我們一般建議你建立可重複使用、可注入的服務，將資料存取邏輯隔離並封裝。例如，這個 `UserService` 封裝了依 id 請求使用者資料的邏輯：

<docs-code language="ts">
@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
</docs-code>

在元件內，你可以結合 `NgIf` 與 `async` 管道，僅在資料載入完成後，才渲染該資料的 UI：

<docs-code language="ts">
@Component({
  template: `
    <ng-container *ngIf="user$ | async as user">
      <p>Name: {{ user.name }}</p>
      <p>Biography: {{ user.biography }}</p>
    </ng-container>
  `,
})
export class UserProfileComponent {
  @Input() userId!: string;
  user$!: Observable<User>;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user$ = userService.getUser(this.userId);
  }
}
</docs-code>
