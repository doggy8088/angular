# 發出 HTTP 請求

HttpClient` 有對應於用於發出要求的不同 HTTP 動詞的方法，用於載入資料和套用伺服器上的突變。每種方法都會傳回一個 [RxJS `Observable`](https://rxjs.dev/guide/observable)，當訂閱時，會傳送要求，然後在伺服器回應時發出結果。

備註：由 `HttpClient` 建立的 `Observable` 可以訂閱任意次數，並會為每個訂閱建立新的後端要求。

透過傳遞給 request 方法的選項物件，可以調整請求的各種屬性和回傳的回應類型。

## 擷取 JSON 資料

從後端擷取資料通常需要使用 [`HttpClient.get()`](api/common/http/HttpClient#get) 方法發出 GET 要求。此方法接受兩個參數：要從中擷取的字串端點 URL，以及用於設定要求的*選項物件*。

例如，使用 `HttpClient.get()` 方法從假設的 API 中擷取組態資料：

<docs-code language="ts">
http.get<Config>('/api/config').subscribe(config => {
  // process the configuration.
});
</docs-code>

注意指定伺服器回傳資料為 `Config` 類型的泛型類型引數。此引數為選用，若您省略它，回傳資料類型為 `any`。

提示：如果資料具有未知的形狀，那麼 `any` 的更安全的替代方案是使用 `unknown` 類型作為回應類型。

CRITICAL: 要求方法的泛型類型是對伺服器傳回資料的一種類型 **斷言**。`HttpClient` 沒有驗證實際傳回的資料是否符合此類型。

## 擷取其他類型的資料

`HttpClient` 預設假設伺服器會回傳 JSON 資料。當與非 JSON API 互動時，您可以在發出請求時告訴 `HttpClient` 預期和回傳的回應類型。這是透過 `responseType` 選項來完成。

| **`responseType` 值** | **回傳的回應類型** |
| - | - |
| `'json'` (預設) | 具有給定一般類型的 JSON 資料 |
| `'text'` | 字串資料 |
| `'arraybuffer'` | 包含原始回應位元組的 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |
| `'blob'` | [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) 實例 |

例如，您可以要求 `HttpClient` 將 `.jpeg` 圖像的原始位元組下載到 `ArrayBuffer` 中：

<docs-code language="ts">
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe(buffer => {
  console.log('The image is ' + buffer.length + ' bytes large');
});
</docs-code>

<docs-callout important title="`responseType` 的字面值">
由於 `responseType` 的值會影響 `HttpClient` 傳回的類型，它必須具有字面值類型，而不是 `string` 類型。

如果傳遞給 request 方法的選項物件為文字物件，這會自動發生，但如果您要將要求選項提取到變數或輔助方法中，您可能需要明確地指定為文字，例如 `responseType: 'text' as const`。
</docs-callout>

## 改變伺服器狀態

執行變更的伺服器 API 通常需要建立 POST 要求，其中要求主體指定新的狀態或要進行的變更。

[`HttpClient.post()`](api/common/http/HttpClient#post) 方法行為類似於 `get()`，並在選項之前接受額外的 `body` 參數：

<docs-code language="ts">
http.post<Config>('/api/config', newConfig).subscribe(config => {
  console.log('Updated config:', config);
});
</docs-code>

請求的 `body` 可以提供許多不同類型的值，而 `HttpClient` 會相應地序列化它們：

| **`body` 類型** | **序列化為** |
| - | - |
| 字串 | 純文字 |
| 數字、布林值、陣列或一般物件 | JSON |
| [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | 緩衝區的原始資料 |
| [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) | 具有 `Blob` 內容類型的原始資料 |
| [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) | `multipart/form-data` 編碼資料 |
| [`HttpParams`](api/common/http/HttpParams) 或 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | `application/x-www-form-urlencoded` 格式的字串 |

重要：請記得`.subscribe()` 到變更要求 `Observable`，以便實際發出要求。

## 設定 URL 參數

使用 `params` 選項指定應包含在要求 URL 中的要求參數。

傳遞一個物件字面值是最簡單的 URL 參數設定方式：

<docs-code language="ts">
http.get('/api/config', {
  params: {filter: 'all'},
}).subscribe(config => {
  // ...
});
</docs-code>

或者，如果您需要更精確地控制參數的建構或序列化，請傳遞 `HttpParams` 的執行個體。

IMPORTANT: `HttpParams` 的實例是 _不可變_ 的，且無法直接變更。相反地，突變方法（例如 `append()`）會回傳一個已套用突變的 `HttpParams` 新實例。

<docs-code language="ts">
const baseParams = new HttpParams().set('filter', 'all');

http.get('/api/config', {
  params: baseParams.set('details', 'enabled'),
}).subscribe(config => {
  // ...
});
</docs-code>

您可以使用決定 `HttpClient` 將如何將參數編碼到 URL 的自訂 `HttpParameterCodec` 來實例化 `HttpParams`。

## 設定請求標頭

使用 `headers` 選項指定應包含在請求中的請求標頭。

透過物件文字傳遞是最簡單的設定要求標頭方式：

<docs-code language="ts">
http.get('/api/config', {
  headers: {
    'X-Debug-Level': 'verbose',
  }
}).subscribe(config => {
  // ...
});
</docs-code>

或者，如果您需要更多控制權來建構標頭，請傳遞 `HttpHeaders` 的執行個體

重要提示：`HttpHeaders` 的實例是 _不可變_ 的，且無法直接變更。相反地，異動方法（例如 `append()`）會傳回一個已套用異動的新 `HttpHeaders` 實例。

<docs-code language="ts">
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http.get<Config>('/api/config', {
  params: baseParams.set('X-Debug-Level', 'verbose'),
}).subscribe(config => {
  // ...
});
</docs-code>

## 與伺服器回應事件互動

為了方便，`HttpClient` 預設會傳回伺服器傳回資料的 `Observable` (回應內文)。偶爾會想要檢查實際的回應，例如擷取特定的回應標頭。

如需存取完整回應，請將 `observe` 選項設為 `'response'`：

<docs-code language="ts">
http.get<Config>('/api/config', {observe: 'response'}).subscribe(res => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
</docs-code>

<docs-callout important title="`observe` 的字面值">
因為 `observe` 的值會影響 `HttpClient` 回傳的類型，所以它必須是字面類型而非 `string` 類型。

如果傳遞給請求方法的選項物件是文字物件，則會自動執行此動作，但如果您將請求選項萃取到變數或輔助方法中，您可能需要明確地將它指定為文字，例如 `observe: 'response' as const`。
</docs-callout>

## 接收原始進度事件

除了回應主體或回應物件之外，`HttpClient` 也能傳回對應於請求生命週期中的特定時刻的原始 _事件_ 串流。這些事件包括請求發送時、回應標頭傳回時，以及主體完成時。這些事件也可以包含 _進度事件_，以報告大型請求或回應主體的上傳和下載狀態。

進度事件在預設情況下已停用（因為它們有性能成本），但可以使用 `reportProgress` 選項啟用它們。

注：`HttpClient` 的可選 `fetch` 實作不會報告 _上傳_ 進度事件。

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
因為 `observe` 的值會影響 `HttpClient` 回傳的類型，所以它必須是字面類型而非 `string` 類型。

如果傳遞給 request 方法的選項物件是字面值物件，這會自動發生，但如果您將要求選項萃取到變數或輔助方法中，您可能需要明確地指定它為字面值，例如 `observe: 'events' as const`。
</docs-callout>

事件串流中所報告的每個 `HttpEvent` 都有 `type`，用來區分事件代表的內容：

| **`type` 值** | **事件含義** |
| - | - |
| `HttpEventType.Sent` | 請求已派發到伺服器 |
| `HttpEventType.UploadProgress` | `HttpUploadProgressEvent` 報告上傳請求主體的進度 |
| `HttpEventType.ResponseHeader` | 已收到回應的標頭，包括狀態和標頭 |
| `HttpEventType.DownloadProgress` | `HttpDownloadProgressEvent` 報告下載回應主體的進度 |
| `HttpEventType.Response` | 已收到整個回應，包括回應主體 |
| `HttpEventType.User` | Http 攔截器的自訂事件。

## 處理請求失敗

HTTP 要求有兩種可能失敗的方式：

* 網路或連線錯誤可能導致請求無法到達後端伺服器。
* 後端可以收到請求，但無法處理它，並返回錯誤回應。

`HttpClient` 會在 `HttpErrorResponse` 中擷取兩種錯誤，並透過 `Observable` 的錯誤頻道回傳。網路錯誤的 `status` 程式碼為 `0`，而 `error` 為 [`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) 的執行個體。後端錯誤會回傳後端返回的失敗 `status` 程式碼，而錯誤回應則為 `error`。檢查回應以識別錯誤原因和處理錯誤的適當動作。

[RxJS 函式庫](https://rxjs.dev/) 提供了幾個可用於錯誤處理的運算子。

您可以使用 `catchError` 運算子將錯誤回應轉換為 UI 的值。此值可以告訴 UI 顯示錯誤頁面或值，並在必要時擷取錯誤原因。

有時暫時性錯誤，例如網路中斷，會導致要求意外失敗，而只需重試要求即可讓它成功。RxJS 提供多個 *retry* 運算子，可在特定條件下自動重新訂閱失敗的 `Observable`。例如，`retry()` 運算子會自動嘗試重新訂閱指定次數。

## Http `Observable`

## Http `Observable`s

`HttpClient` 上的每個請求方法都會建構並傳回請求回應類型的一個 `Observable`。在使用 `HttpClient` 時，了解這些 `Observable` 的工作方式非常重要。

`HttpClient` 產生 RxJS 所稱的「冷」`Observable`，表示在 `Observable` 訂閱之前不會發生實際的請求。只有在那個時候，請求才會實際發送至伺服器。多次訂閱同一個 `Observable` 將會觸發多個後端請求。每個訂閱都是獨立的。

提示：您可以將 `HttpClient` `Observable` 視為實際伺服器請求的_藍圖_。

一旦訂閱，取消訂閱將中止正在進行的請求。這非常有用，如果 `Observable` 是透過 `async` 管道訂閱的，因為如果使用者導覽離開目前的頁面，它會自動取消請求。此外，如果您將 `Observable` 與 RxJS 組合器一起使用，例如 `switchMap`，這個取消將會清除任何過期的請求。

一旦回應返回，`HttpClient` 的 `Observable` 通常會完成 (儘管攔截器可能會影響此行為)。

由於自動完成，`HttpClient` 訂閱通常不會有記憶體洩漏的風險。但是，與任何非同步操作一樣，我們強烈建議您在使用它們的元件毀損時清除訂閱，否則訂閱回呼可能會執行並在嘗試與毀損的元件互動時遇到錯誤。

TIP：使用 `async` 管道或 `toSignal` 運算來訂閱 `Observable` 可確保訂閱正確地被處置。

## 最佳實務範例

雖然 `HttpClient` 可以注入並直接從元件使用，但我們通常建議您建立可重複使用、可注入的服務，以隔離和封裝資料存取邏輯。例如，此 `UserService` 封裝了根據其 ID 要求使用者資料的邏輯：

<docs-code language="ts">
@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}

getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
</docs-code>

在元件內，您可以結合 `NgIf` 與 `async` 管道，來在資料載入完成之後才呈現 UI：

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
