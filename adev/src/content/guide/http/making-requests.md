# 發出 HTTP 請求

`HttpClient` 具有對應各種 HTTP 動詞的方法，用來發出請求，既可載入資料，也可對伺服器套用變更。每個方法都會回傳一個 [RxJS `Observable`](https://rxjs.dev/guide/observable)，當它被訂閱時，就會送出請求，並在伺服器回應時發出結果。

NOTE: 由 `HttpClient` 建立的 `Observable` 可以被訂閱任意多次，每次訂閱都會向後端發出一個新請求。

透過傳給請求方法的 options 物件，可以調整請求的各種屬性，以及回傳的回應型別。

## 擷取 JSON 資料 {#fetching-json-data}

從後端擷取資料通常需要使用 [`HttpClient.get()`](api/common/http/HttpClient#get) 方法發出 GET 請求。此方法接受兩個參數：要擷取資料的字串端點 URL，以及一個用來設定請求的「選用 options」物件。

例如，使用 `HttpClient.get()` 方法從一個假設的 API 擷取設定資料：

```ts
http.get<Config>('/api/config').subscribe((config) => {
  // process the configuration.
});
```

請注意其中的泛型型別參數，它指定伺服器回傳的資料型別為 `Config`。此參數為選用，如果省略，回傳資料的型別將為 `Object`。

TIP: 處理結構不確定、且可能含 `undefined` 或 `null` 值的資料時，請考慮使用 `unknown` 型別而非 `Object` 作為回應型別。

CRITICAL: 請求方法的泛型型別，是對伺服器回傳資料的一種型別「斷言」。`HttpClient` 不會驗證實際回傳的資料是否符合此型別。

## 擷取其他型別的資料

`HttpClient` 預設假設伺服器會回傳 JSON 資料。當與非 JSON 的 API 互動時，你可以在發出請求時告訴 `HttpClient` 預期何種回應型別。這是透過 `responseType` 選項完成的。

| **`responseType` 值** | **回傳的回應型別**                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `'json'`（預設）       | 給定泛型型別的 JSON 資料                                                                                                       |
| `'text'`                 | 字串資料                                                                                                                               |
| `'arraybuffer'`          | 包含原始回應位元組的 [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |
| `'blob'`                 | [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) 執行個體                                                                        |

例如，你可以要求 `HttpClient` 把 `.jpeg` 圖片的原始位元組下載到 `ArrayBuffer` 中：

```ts
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe((buffer) => {
  console.log('The image is ' + buffer.byteLength + ' bytes large');
});
```

<docs-callout important title="`responseType` 的字面值">
因為 `responseType` 的值會影響 `HttpClient` 回傳的型別，它必須是字面型別，而非 `string` 型別。

如果傳給請求方法的 options 物件本身是字面物件，這會自動成立；但如果你把請求選項抽出到變數或輔助方法中，你可能需要明確將其指定為字面值，例如 `responseType: 'text' as const`。
</docs-callout>

## 變更伺服器狀態

執行變更的伺服器 API，通常需要發出 POST 請求，並在請求主體中指定新狀態或要套用的變更。

[`HttpClient.post()`](api/common/http/HttpClient#post) 方法的行為與 `get()` 類似，並在其 options 之前接受一個額外的 `body` 參數：

```ts
http.post<Config>('/api/config', newConfig).subscribe((config) => {
  console.log('Updated config:', config);
});
```

請求的 `body` 可以提供許多不同型別的值，`HttpClient` 會相應地將它們序列化：

| **`body` 型別**                                                                                                               | **序列化為**                                    |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| string                                                                                                                        | 純文字                                           |
| number、boolean、array 或 plain object                                                                                       | JSON                                                 |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)                       | 來自緩衝區的原始資料                             |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                                                                     | 帶有 `Blob` 內容型別的原始資料              |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData)                                                             | `multipart/form-data` 編碼資料                   |
| [`HttpParams`](api/common/http/HttpParams) 或 [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | `application/x-www-form-urlencoded` 格式字串 |

IMPORTANT: 請記得對變更請求的 `Observable` 呼叫 `.subscribe()`，請求才會真正發出。

## 設定 URL 參數

使用 `params` 選項，指定應包含在請求 URL 中的請求參數。

傳入物件字面值是設定 URL 參數最簡單的方式：

```ts
http
  .get('/api/config', {
    params: {filter: 'all'},
  })
  .subscribe((config) => {
    // ...
  });
```

或者，如果你需要對參數的建構或序列化有更多控制，可以傳入 `HttpParams` 的執行個體。

IMPORTANT: `HttpParams` 的執行個體是「不可變」的，無法直接變更。變更方法（例如 `append()`）會回傳一個套用了變更的新 `HttpParams` 執行個體。

```ts
const baseParams = new HttpParams().set('filter', 'all');

http
  .get('/api/config', {
    params: baseParams.set('details', 'enabled'),
  })
  .subscribe((config) => {
    // ...
  });
```

你可以使用自訂的 `HttpParameterCodec` 來建立 `HttpParams`，由它決定 `HttpClient` 如何將參數編碼進 URL。

### 自訂參數編碼

`HttpParams` 預設使用內建的 [`HttpUrlEncodingCodec`](api/common/http/HttpUrlEncodingCodec) 來編碼與解碼參數的鍵與值。

你可以提供自己的 [`HttpParameterCodec`](api/common/http/HttpParameterCodec) 實作，自訂編碼與解碼的套用方式。

```ts
import {HttpClient, HttpParams, HttpParameterCodec} from '@angular/common/http';
import {inject} from '@angular/core';

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

export class ApiService {
  private http = inject(HttpClient);

  search() {
    const params = new HttpParams({
      encoder: new CustomHttpParamEncoder(),
    })
      .set('email', 'dev+alerts@example.com')
      .set('q', 'a & b? c/d = e');

    return this.http.get('/api/items', {params});
  }
}
```

## 設定請求標頭

使用 `headers` 選項，指定應包含在請求中的請求標頭。

傳入物件字面值是設定請求標頭最簡單的方式：

```ts
http
  .get('/api/config', {
    headers: {
      'X-Debug-Level': 'verbose',
    },
  })
  .subscribe((config) => {
    // ...
  });
```

或者，如果你需要對標頭的建構有更多控制，可以傳入 `HttpHeaders` 的執行個體。

IMPORTANT: `HttpHeaders` 的執行個體是「不可變」的，無法直接變更。變更方法（例如 `append()`）會回傳一個套用了變更的新 `HttpHeaders` 執行個體。

```ts
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http
  .get<Config>('/api/config', {
    headers: baseHeaders.set('X-Debug-Level', 'verbose'),
  })
  .subscribe((config) => {
    // ...
  });
```

## 與伺服器回應事件互動

為了方便，`HttpClient` 預設回傳伺服器回傳資料（回應主體）的 `Observable`。有時我們會想檢視實際的回應，例如擷取特定的回應標頭。

若要存取完整的回應，請將 `observe` 選項設定為 `'response'`：

```ts
http.get<Config>('/api/config', {observe: 'response'}).subscribe((res) => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
```

<docs-callout important title="`observe` 的字面值">
因為 `observe` 的值會影響 `HttpClient` 回傳的型別，它必須是字面型別，而非 `string` 型別。

如果傳給請求方法的 options 物件本身是字面物件，這會自動成立；但如果你把請求選項抽出到變數或輔助方法中，你可能需要明確將其指定為字面值，例如 `observe: 'response' as const`。
</docs-callout>

## 接收原始進度事件

除了回應主體或回應物件之外，`HttpClient` 也可以回傳一串原始「事件」，對應請求生命週期中的特定時刻。這些事件包括請求送出時、回應標頭回傳時，以及主體完成時。這些事件還可以包括「進度事件」，回報大型請求或回應主體的上傳與下載狀態。

進度事件預設為停用（因為它們有效能成本），但可以透過 `reportUploadProgress` 與 `reportDownloadProgress` 選項啟用。

NOTE: `HttpClient` 的預設 fetch 後端不支援「上傳」進度事件，如果你設定 `reportUploadProgress` 將會擲出錯誤。如果你的應用程式需要上傳進度事件，請在 `provideHttpClient(...)` 中以 `withXhr()` 設定 `HttpClient`。

若要觀察事件串流，請將 `observe` 選項設定為 `'events'`：

```ts
http
  .get('/api/download', {
    reportDownloadProgress: true,
    observe: 'events',
  })
  .subscribe((event) => {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        console.log('Downloaded ' + event.loaded + ' out of ' + event.total + ' bytes');
        break;
      case HttpEventType.Response:
        console.log('Finished downloading!');
        break;
    }
  });
```

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

HTTP 請求可能以三種方式失敗：

- 網路或連線錯誤可能使請求無法到達後端伺服器。
- 當設定了 timeout 選項時，請求未在時間內回應。
- 後端可以收到請求，但處理失敗，並回傳錯誤回應。

`HttpClient` 會將上述所有類型的錯誤擷取在 `HttpErrorResponse` 中，並透過 `Observable` 的錯誤通道回傳。網路與逾時錯誤的 `status` 碼為 `0`。對於逾時，`error` 是名為 `TimeoutError` 的 `DOMException`；對於網路錯誤，則是 `fetch` 擲出的錯誤（或使用 `withXhr()` 時為 [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent)）。後端錯誤帶有後端回傳的失敗 `status` 碼，並以錯誤回應作為 `error`。請檢查回應，以找出錯誤的成因，以及處理錯誤的適當行動。

[RxJS 函式庫](https://rxjs.dev/)提供多個對錯誤處理有幫助的運算子。

你可以使用 `catchError` 運算子，將錯誤回應轉換為給 UI 使用的值。這個值可以告訴 UI 顯示錯誤頁面或錯誤值，並在必要時擷取錯誤的成因。

有時，網路中斷等暫時性錯誤可能導致請求意外失敗，而只要重試請求就能成功。RxJS 提供多個「重試」運算子，會在特定條件下自動重新訂閱失敗的 `Observable`。例如，`retry()` 運算子會自動嘗試重新訂閱指定的次數。

### 逾時

若要為請求設定逾時，你可以將 `timeout` 選項連同其他請求選項一起設定為毫秒數。如果後端請求未在指定時間內完成，請求將被中止，並發出一個錯誤。

NOTE: 逾時只會套用到後端 HTTP 請求本身。它不是整個請求處理鏈的逾時。因此，此選項不受攔截器引入的任何延遲影響。

```ts
http
  .get('/api/config', {
    timeout: 3000,
  })
  .subscribe({
    next: (config) => {
      console.log('Config fetched successfully:', config);
    },
    error: (err) => {
      // If the request times out, an error will have been emitted.
    },
  });
```

## 進階 fetch 選項

Angular 的 `HttpClient` 支援進階的 fetch API 選項，可以提升效能與使用者體驗。這些選項在使用 fetch 後端時可用，而 fetch 後端是預設後端。

### Fetch 選項

下列選項在使用 fetch 後端時，能對請求行為提供細粒度的控制。

#### 保持連線（keep-alive）

`keepalive` 選項讓請求的生命週期能超過發起它的頁面。這對於分析或記錄請求特別有用，因為這類請求即使在使用者離開頁面後也需要完成。

```ts
http
  .post('/api/analytics', analyticsData, {
    keepalive: true,
  })
  .subscribe();
```

#### HTTP 快取控制

`cache` 選項控制請求如何與瀏覽器的 HTTP 快取互動，這能顯著提升重複請求的效能。

```ts
//  Use cached response regardless of freshness
http
  .get('/api/config', {
    cache: 'force-cache',
  })
  .subscribe((config) => {
    // ...
  });

// Always fetch from network, bypass cache
http
  .get('/api/live-data', {
    cache: 'no-cache',
  })
  .subscribe((data) => {
    // ...
  });

// Use cached response only, fail if not in cache
http
  .get('/api/static-data', {
    cache: 'only-if-cached',
  })
  .subscribe((data) => {
    // ...
  });
```

#### 用於 Core Web Vitals 的請求優先級

`priority` 選項讓你指出請求的相對重要性，協助瀏覽器最佳化資源載入，以獲得更好的 Core Web Vitals 分數。

```ts
// High priority for critical resources
http
  .get('/api/user-profile', {
    priority: 'high',
  })
  .subscribe((profile) => {
    // ...
  });

// Low priority for non-critical resources
http
  .get('/api/recommendations', {
    priority: 'low',
  })
  .subscribe((recommendations) => {
    // ...
  });

// Auto priority (default) lets the browser decide
http
  .get('/api/settings', {
    priority: 'auto',
  })
  .subscribe((settings) => {
    // ...
  });
```

可用的 `priority` 值：

- `'high'`：高優先級，提早載入（例如關鍵使用者資料、首屏即可見的內容）
- `'low'`：低優先級，在資源可用時載入（例如分析、預擷取資料）
- `'auto'`：瀏覽器依請求上下文決定優先級（預設）

TIP: 對於影響最大內容繪製（LCP）的請求，請使用 `priority: 'high'`；對於不影響初始使用者體驗的請求，請使用 `priority: 'low'`。

#### 請求模式

`mode` 選項控制請求如何處理跨來源請求，並決定回應型別。

```ts
// Same-origin requests only
http
  .get('/api/local-data', {
    mode: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// CORS-enabled cross-origin requests
http
  .get('https://api.external.com/data', {
    mode: 'cors',
  })
  .subscribe((data) => {
    // ...
  });

// No-CORS mode for simple cross-origin requests
http
  .get('https://external-api.com/public-data', {
    mode: 'no-cors',
  })
  .subscribe((data) => {
    // ...
  });
```

可用的 `mode` 值：

- `'same-origin'`：只允許同來源請求，跨來源請求將失敗
- `'cors'`：允許搭配 CORS 的跨來源請求（預設）
- `'no-cors'`：允許不搭配 CORS 的簡單跨來源請求，回應為不透明（opaque）

TIP: 在瀏覽器中，對於絕不應跨來源的敏感請求，請使用 `mode: 'same-origin'`。

IMPORTANT: 在 Node.js 上進行 SSR 期間，`HttpClient` 使用 Node.js 的 [Undici 版 Fetch 實作](https://nodejs.org/api/globals.html#fetch)。[Undici 不強制執行瀏覽器的 CORS 檢查](https://undici.nodejs.org/#cors)，因此 `mode: 'same-origin'` 不會限制伺服器端請求。請針對允許清單驗證受使用者影響的 URL。

#### 重新導向處理

`redirect` 選項指定如何處理來自伺服器的重新導向回應。

```ts
// Follow redirects automatically (default behavior)
http
  .get('/api/resource', {
    redirect: 'follow',
  })
  .subscribe((data) => {
    // ...
  });

// Prevent automatic redirects
http
  .get('/api/resource', {
    redirect: 'manual',
  })
  .subscribe((response) => {
    // Handle redirect manually
  });

// Treat redirects as errors
http
  .get('/api/resource', {
    redirect: 'error',
  })
  .subscribe({
    next: (data) => {
      // Success response
    },
    error: (err) => {
      // Redirect responses will trigger this error handler
    },
  });
```

可用的 `redirect` 值：

- `'follow'`：自動跟隨重新導向（預設）
- `'error'`：將重新導向視為錯誤
- `'manual'`：不自動跟隨重新導向，回傳重新導向回應

TIP: 當你需要以自訂邏輯處理重新導向時，請使用 `redirect: 'manual'`。

#### 憑證處理

`credentials` 選項控制在跨來源請求時，是否隨請求傳送 cookie、授權標頭及其他憑證。這在驗證情境中特別重要。

```ts
// Include credentials for cross-origin requests
http
  .get('https://api.example.com/protected-data', {
    credentials: 'include',
  })
  .subscribe((data) => {
    // ...
  });

// Never send credentials (default for cross-origin)
http
  .get('https://api.example.com/public-data', {
    credentials: 'omit',
  })
  .subscribe((data) => {
    // ...
  });

// Send credentials only for same-origin requests
http
  .get('/api/user-data', {
    credentials: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// withCredentials overrides credentials setting
http
  .get('https://api.example.com/data', {
    credentials: 'omit', // This will be ignored
    withCredentials: true, // This forces credentials: 'include'
  })
  .subscribe((data) => {
    // Request will include credentials despite credentials: 'omit'
  });

// Legacy approach (still supported)
http
  .get('https://api.example.com/data', {
    withCredentials: true,
  })
  .subscribe((data) => {
    // Equivalent to credentials: 'include'
  });
```

IMPORTANT: `withCredentials` 選項的優先級高於 `credentials` 選項。如果兩者都指定，`withCredentials: true` 將一律導致 `credentials: 'include'`，無論明確指定的 `credentials` 值為何。

可用的 `credentials` 值：

- `'omit'`：永不傳送憑證
- `'same-origin'`：只對同來源請求傳送憑證（預設）
- `'include'`：一律傳送憑證，即使是跨來源請求

TIP: 當你需要把驗證 cookie 或標頭傳送到支援 CORS 的不同網域時，請使用 `credentials: 'include'`。避免混用 `credentials` 與 `withCredentials` 選項，以免混淆。

IMPORTANT: 在 Node.js 上進行 SSR 期間，`credentials: 'include'` 不會自動轉送來自瀏覽器請求的 cookie。`credentials` 選項不會移除你明確加入的 `Cookie` 或 `Authorization` 標頭。[Undici 允許某些瀏覽器禁止的標頭](https://undici.nodejs.org/#forbidden-and-safelisted-header-names)，因此只應將憑證標頭轉送至受信任的來源。

#### Referrer

`referrer` 選項讓你控制隨請求傳送的 referrer 資訊。這對隱私與安全考量很重要。

```ts
// Send a specific referrer URL
http
  .get('/api/data', {
    referrer: 'https://example.com/page',
  })
  .subscribe((data) => {
    // ...
  });

// Use the current page as referrer (default behavior)
http
  .get('/api/analytics', {
    referrer: 'about:client',
  })
  .subscribe((data) => {
    // ...
  });
```

`referrer` 選項接受：

- 有效的 URL 字串：設定要傳送的特定 referrer URL
- 空字串 `''`：不傳送 referrer 資訊
- `'about:client'`：使用預設 referrer（目前頁面的 URL）

TIP: 對於不希望洩漏來源頁面 URL 的敏感請求，請使用 `referrer: ''`。

#### Referrer 政策

`referrerPolicy` 選項控制隨 HTTP 請求傳送多少 referrer 資訊，也就是發出請求頁面的 URL。此設定同時影響隱私與分析，讓你在資料可見性與安全考量之間取得平衡。

```ts
// Send no referrer information regardless of the current page
http
  .get('/api/data', {
    referrerPolicy: 'no-referrer',
  })
  .subscribe();

// Send origin only (e.g. https://example.com)
http
  .get('/api/analytics', {
    referrerPolicy: 'origin',
  })
  .subscribe();
```

`referrerPolicy` 選項接受：

- `'no-referrer'` 永不傳送 `Referer` 標頭。
- `'no-referrer-when-downgrade'` 對同來源與安全（HTTPS→HTTPS）請求傳送 referrer，但從安全來源導向較不安全的來源（HTTPS→HTTP）時省略。
- `'origin'` 只傳送 referrer 的來源（scheme、host、port），省略路徑與查詢資訊。
- `'origin-when-cross-origin'` 對同來源請求傳送完整 URL，但對跨來源請求只傳送來源。
- `'same-origin'` 對同來源請求傳送完整 URL，對跨來源請求不傳送 referrer。
- `'strict-origin'` 只傳送來源，且僅在通訊協定安全等級未降級時（例如 HTTPS→HTTPS）。降級時省略 referrer。
- `'strict-origin-when-cross-origin'` 瀏覽器的預設行為。對同來源請求傳送完整 URL；對未降級的跨來源請求傳送來源；降級時省略 referrer。
- `'unsafe-url'` 一律傳送完整 URL（包括路徑與查詢）。這可能暴露敏感資料，應謹慎使用。

TIP: 對於注重隱私的請求，請優先使用保守的值，例如 `'no-referrer'`、`'origin'` 或 `'strict-origin-when-cross-origin'`。

#### 完整性

`integrity` 選項讓你透過提供預期內容的加密雜湊，驗證回應是否遭到竄改。這在從 CDN 載入指令碼或其他資源時特別有用。

```ts
// Verify response integrity with SHA-256 hash
http
  .get('/api/script.js', {
    integrity: 'sha256-ABC123...',
    responseType: 'text',
  })
  .subscribe((script) => {
    // Script content is verified against the hash
  });
```

IMPORTANT: `integrity` 選項要求回應內容與所提供的雜湊完全相符。如果內容不符，請求將以網路錯誤失敗。

CRITICAL: 在 SSR 期間，Fetch 實作會在回傳回應之前讀取整個回應主體來驗證 `integrity`，這是 [Fetch 標準](https://fetch.spec.whatwg.org/#concept-main-fetch)的要求。Angular 只有在 Fetch 回傳回應之後，才強制執行 [`maxResponseBodySize`](/guide/ssr#configuring-the-response-body-size-limit)，因此此限制不會約束在完整性驗證期間緩衝的資料。

TIP: 從外部來源載入關鍵資源時，請使用子資源完整性（subresource integrity）來確保它們未被修改。請使用 `openssl` 等工具產生雜湊。

## HTTP `Observable`

`HttpClient` 上的每個請求方法都會建構並回傳一個所請求回應型別的 `Observable`。在使用 `HttpClient` 時，了解這些 `Observable` 如何運作非常重要。

`HttpClient` 產生 RxJS 所謂的「冷」`Observable`，意思是除非 `Observable` 被訂閱，否則不會發生真正的請求。只有到那時，請求才會真正送往伺服器。多次訂閱同一個 `Observable` 將觸發多次後端請求。每次訂閱都是獨立的。

TIP: 你可以把 `HttpClient` 的 `Observable` 想像成真正伺服器請求的「藍圖」。

一旦訂閱，取消訂閱將中止進行中的請求。如果 `Observable` 是透過 `async` 管道訂閱的，這非常有用，因為當使用者離開目前頁面時，它會自動取消請求。此外，如果你搭配 RxJS 組合器（例如 `switchMap`）使用 `Observable`，這種取消機制會清除所有過時的請求。

回應回傳後，來自 `HttpClient` 的 `Observable` 通常會完成（但攔截器可能影響這一點）。

由於會自動完成，如果不清理 `HttpClient` 的訂閱，通常沒有記憶體洩漏的風險。然而，如同任何非同步操作，我們強烈建議在元件銷毀時清理訂閱，否則訂閱回呼可能會執行，並在試圖與已銷毀的元件互動時遇到錯誤。

TIP: 使用 `async` 管道或 `toSignal` 操作來訂閱 `Observable`，可確保訂閱被妥善處置。

## 最佳實務

雖然 `HttpClient` 可以直接注入並在元件中使用，我們一般建議你建立可重複使用、可注入的服務，將資料存取邏輯隔離並封裝。例如，這個 `UserService` 封裝了依 id 請求使用者資料的邏輯：

```ts
@Service()
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```

在元件內，你可以結合 `@if` 與 `async` 管道，僅在資料載入完成後，才渲染該資料的 UI：

```angular-ts
import {AsyncPipe} from '@angular/common';
import {Component, input, inject, effect} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Name: {{ user.name }}</p>
      <p>Biography: {{ user.biography }}</p>
    }
  `,
})
export class UserProfile {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor() {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
```
