# HttpClient

大多數前端應用程式透過 HTTP 協定與後端服務通訊。現代瀏覽器支援兩種不同的 API 來發出 HTTP 請求：`XMLHttpRequest` 介面與 `fetch()` API。

透過 `HttpClient`，`@angular/common/http` 為 Angular 應用程式提供簡化的 HTTP 功能 API，它建立在瀏覽器公開的 `XMLHttpRequest` 介面之上。
`HttpClient` 的其他優點包括可測試性支援、請求與回應物件的強型別、請求與回應攔截器支援，以及基於 Observable 的 API 所帶來的更佳錯誤處理。

## 設定：安裝模組

在你能使用 `HttpClient` 之前，需要安裝提供它的 `HttpClientModule`。這可以在你的應用程式模組中完成，而且只需要做一次。

```javascript
// app.module.ts:

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// Import HttpClientModule from @angular/common/http
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    // Include it under 'imports' in your application module
    // after BrowserModule.
    HttpClientModule,
  ],
})
export class MyAppModule {}
```

將 `HttpClientModule` 匯入你的應用程式模組後，你就可以將 `HttpClient` 注入你的元件與服務中。

## 請求 JSON 資料

應用程式對後端最常見的請求類型，就是請求 JSON 資料。例如，假設你有一個列出項目的 API 端點 `/api/items`，它回傳如下形式的 JSON 物件：

```json
{
  "results": [
    "Item 1",
    "Item 2",
  ]
}
```

`HttpClient` 上的 `get()` 方法讓存取這份資料變得簡單直接。


```javascript
@Component(...)
export class MyComponent implements OnInit {

  results: string[];

  // Inject HttpClient into your component or service.
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Make the HTTP request:
    this.http.get('/api/items').subscribe(data => {
      // Read the result field from the JSON response.
      this.results = data['results'];
    });
  }
}
```


### 對回應進行型別檢查

在上方的範例中，`data['results']` 欄位存取特別顯眼，因為你用括號表示法來存取 results 欄位。如果你改寫 `data.results`，TypeScript 會正確地抱怨：從 HTTP 回來的 `Object` 沒有 `results` 屬性。這是因為 `HttpClient` 雖然將 JSON 回應解析為 `Object`，卻不知道該物件的形狀是什麼。

不過，你可以告訴 `HttpClient` 回應的型別會是什麼，這也是建議的做法。
為此，先定義一個具有正確形狀的介面：

```javascript
interface ItemsResponse {
  results: string[];
}
```

接著，在呼叫 `HttpClient.get` 時傳入型別參數：

```javascript
http.get<ItemsResponse>('/api/items').subscribe(data => {
  // data is now an instance of type ItemsResponse, so you can do this:
  this.results = data.results;
});
```

### 讀取完整回應

回應主體不會回傳你可能需要的所有資料。伺服器有時會回傳特殊的標頭或狀態碼來指出某些情況，檢視它們可能是必要的。為此，你可以用 `observe` 選項告訴 `HttpClient`，你想要的是完整回應，而不只是主體：

```javascript
http
  .get<MyJsonData>('/data.json', {observe: 'response'})
  .subscribe(resp => {
    // Here, resp is of type HttpResponse<MyJsonData>.
    // You can inspect its headers:
    console.log(resp.headers.get('X-Custom-Header'));
    // And access the body directly, which is typed as MyJsonData as requested.
    console.log(resp.body.someField);
  });
```

如你所見，產生的物件有一個型別正確的 `body` 屬性。



### 錯誤處理

如果請求在伺服器上失敗，或者不良的網路連線使它甚至無法抵達伺服器，會發生什麼事？`HttpClient` 會回傳一個*錯誤*，而不是成功的回應。

若要處理它，請在你的 `.subscribe()` 呼叫中加入錯誤處理常式：

```javascript
http
  .get<ItemsResponse>('/api/items')
  .subscribe(
    // Successful responses call the first callback.
    data => {...},
    // Errors will call this callback instead:
    err => {
      console.log('Something went wrong!');
    }
  );
```

#### 取得錯誤詳細資訊

偵測到錯誤發生是一回事，但知道實際發生了什麼錯誤更有用。上方回呼的 `err` 參數型別是 `HttpErrorResponse`，包含關於出錯原因的有用資訊。

可能發生兩種類型的錯誤。如果後端回傳不成功的回應碼（404、500 等），它會以錯誤的形式回傳。另外，如果用戶端出了問題，例如 RxJS 運算子中拋出例外，或者網路錯誤導致請求無法成功完成，就會拋出一個真正的 `Error`。

在這兩種情況下，你都可以檢視 `HttpErrorResponse` 來弄清楚發生了什麼。

```javascript
http
  .get<ItemsResponse>('/api/items')
  .subscribe(
    data => {...},
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', err.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    }
  );
```

#### `.retry()`

處理錯誤的一種方法，就是直接重試請求。當錯誤是暫時性的、不太可能重複發生時，這個策略很有用。

RxJS 有一個實用的運算子叫做 `.retry()`，它會在遇到錯誤時自動重新訂閱 Observable，藉此重新發出請求。

首先，匯入它：

```js
import 'rxjs/add/operator/retry';
```

接著，你可以像這樣將它用在 HTTP Observable 上：

```javascript
http
  .get<ItemsResponse>('/api/items')
  // Retry this request up to 3 times.
  .retry(3)
  // Any errors after the 3rd retry will fall through to the app.
  .subscribe(...);
```

### 請求非 JSON 資料

並非所有 API 都回傳 JSON 資料。假設你想讀取伺服器上的一個文字檔，你必須告訴 `HttpClient` 你預期的是文字回應：

```javascript
http
  .get('/textfile.txt', {responseType: 'text'})
  // The Observable returned by get() is of type Observable<string>
  // because a text response was specified. There's no need to pass
  // a <string> type parameter to get().
  .subscribe(data => console.log(data));
```

## 傳送資料到伺服器

除了從伺服器取得資料外，`HttpClient` 還支援變更型請求，也就是以各種形式將資料傳送到伺服器。

### 發出 POST 請求

一個常見的操作是將資料 POST 到伺服器，例如提交表單時。傳送 POST 請求的程式碼與 GET 非常相似：

```javascript
const body = {name: 'Brad'};

http
  .post('/api/developers/add', body)
  // See below - subscribe() is still necessary when using post().
  .subscribe(...);
```
<div class="alert is-important">

*請注意 `subscribe()` 方法。* 從 `HttpClient` 回傳的所有 Observable 都是*冷的（cold）*，也就是說，它們是發出請求的*藍圖*。在你呼叫 `subscribe()` 之前什麼都不會發生，而且每次這樣的呼叫都會發出一個獨立的請求。例如，這段程式碼會以相同資料傳送兩次 POST 請求：

```javascript
const req = http.post('/api/items/add', body);
// 0 requests made - .subscribe() not called.
req.subscribe();
// 1 request made.
req.subscribe();
// 2 requests made.
```
</div>

### 設定請求的其他部分

除了 URL 與可能的請求主體之外，外送請求還有其他你可能想設定的面向。這些都可以透過你傳給請求的 options 物件來設定。

#### 標頭

一個常見的任務是為外送請求加入 `Authorization` 標頭。做法如下：

```javascript
http
  .post('/api/items/add', body, {
    headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
  })
  .subscribe();
```

`HttpHeaders` 類別是不可變的，所以每個 `set()` 都會回傳一個新實例並套用變更。

#### URL 參數

加入 URL 參數的方法也相同。若要傳送一個將 `id` 參數設為 `3` 的請求，你會這樣做：

```javascript
http
  .post('/api/items/add', body, {
    params: new HttpParams().set('id', '3'),
  })
  .subscribe();
```

以這種方式，你會將 POST 請求傳送到 URL `/api/items/add?id=3`。

## 進階用法

上述章節詳細說明了如何使用 `@angular/common/http` 中的基本 HTTP 功能，但有時你需要做的不只是發出請求並取回資料。


### 攔截所有請求或回應

`@angular/common/http` 的一項主要功能是*攔截*，也就是宣告攔截器的能力，攔截器位於你的應用程式與後端之間。當你的應用程式發出請求時，攔截器會在將它傳送到伺服器之前轉換它，攔截器也可以在回應返回的途中、在你的應用程式看到它之前轉換回應。這對從驗證到記錄的一切都很有用。

#### 撰寫攔截器

若要實作攔截器，請宣告一個實作 `HttpInterceptor` 的類別，它有一個單一的 `intercept()` 方法。以下是一個簡單的攔截器，它什麼都不做，只是將請求原封不動地轉發：

```javascript
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
```

`intercept` 是一個方法，它將請求轉換為一個最終回傳回應的 Observable。從這個意義上說，每個攔截器都完全有能力自行處理整個請求。

不過，大多數時候，攔截器會對請求做一些小變更，然後將它轉發給鏈的其餘部分。這就是 `next` 參數派上用場的地方。`next` 是一個 `HttpHandler`，它是一個介面，與 `intercept` 類似，能將請求轉換為回應的 Observable。在攔截器中，`next` 一律代表鏈中的下一個攔截器（如果有的話），或者在沒有更多攔截器時代表最終的後端。所以大多數攔截器最後都會對它們轉換過的請求呼叫 `next`。

我們這個什麼都不做的處理器，只是對原始請求呼叫 `next.handle`，完全不變更地將它轉發。

這個模式與 Express.js 等中介軟體框架中的模式相似。

##### 提供你的攔截器

僅僅宣告上方的 `NoopInterceptor`，並不會讓你的應用程式使用它。你需要在應用程式模組中將它提供為攔截器，把它接上線，做法如下：

```javascript
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: NoopInterceptor,
    multi: true,
  }],
})
export class AppModule {}
```

請注意 `multi: true` 選項。這是必要的，它告訴 Angular，`HTTP_INTERCEPTORS` 是一個值陣列，而不是單一值。


##### 事件

你可能也注意到了，`intercept` 與 `HttpHandler.handle` 回傳的 Observable 不是 `Observable<HttpResponse<any>>`，而是 `Observable<HttpEvent<any>>`。那是因為攔截器在比 `HttpClient` 介面更低的層級運作。單一請求可以產生多個事件，包括上傳與下載進度事件。`HttpResponse` 類別本身其實就是一個事件，其 `type` 為 `HttpEventType.HttpResponseEvent`。

攔截器必須原封不動地傳遞所有它不理解或不打算修改的事件。它絕不能過濾掉它沒預期要處理的事件。不過，許多攔截器只關心外送的請求，並會直接回傳來自 `next` 的事件串流而不修改它。


##### 順序

當你在應用程式中提供多個攔截器時，Angular 會依你提供它們的順序套用它們。

##### 不可變性

攔截器的存在是為了檢視並變更外送請求與傳入回應。然而，你可能會驚訝地發現，`HttpRequest` 與 `HttpResponse` 類別在很大程度上是不可變的。

這是有原因的：因為應用程式可能會重試請求，攔截器鏈可能會多次處理同一個請求。如果請求是可變的，重試的請求就會與原始請求不同。不可變性確保攔截器在每次嘗試時看到的都是同一個請求。

在撰寫攔截器時，有一種情況是型別安全無法保護你的&mdash;請求主體。在攔截器內變更請求主體是無效的，但型別系統不會檢查這一點。

如果你需要變更請求主體，你需要複製請求主體、變更複製件，然後使用 `clone()` 複製請求並設定新的主體。

由於請求是不可變的，它們無法被直接修改。若要變更它們，請使用 `clone()`：

```javascript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // This is a duplicate. It is exactly the same as the original.
  const dupReq = req.clone();

  // Change the URL and replace 'http://' with 'https://'
  const secureReq = req.clone({url: req.url.replace('http://', 'https://')});
}
```

如你所見，`clone()` 接受的雜湊讓你可以在複製其他內容的同時，變更請求的特定屬性。

#### 設定新標頭

攔截器的一個常見用途是在外送回應上設定預設標頭。例如，假設你有一個可注入的 `AuthService`，它可以提供驗證權杖，以下示範如何撰寫一個將它加入所有外送請求的攔截器：

```javascript
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    const authHeader = this.auth.getAuthorizationHeader();
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
```

複製請求以設定新標頭的做法非常常見，因此實際上有一個捷徑可用：

```javascript
const authReq = req.clone({setHeaders: {Authorization: authHeader}});
```

變更標頭的攔截器可以用於許多不同的操作，包括：

* 驗證／授權
* 快取行為；例如 If-Modified-Since
* XSRF 防護

#### 記錄

因為攔截器可以*一起*處理請求與回應，它們可以執行記錄或為請求計時之類的事。請看這個攔截器，它使用 `console.log` 顯示每個請求花費的時間：

```javascript
import 'rxjs/add/operator/do';

export class TimingInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	const started = Date.now();
    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        }
      });
  }
}
```
請注意 RxJS 的 `do()` 運算子&mdash;它為 Observable 加入副作用，而不影響串流上的值。在這裡，它偵測 `HttpResponse` 事件，並記錄請求花費的時間。

#### 快取

你也可以使用攔截器來實作快取。在這個範例中，假設你已經寫了一個具有簡單介面的 HTTP 快取：

```javascript
abstract class HttpCache {
  /**
   * Returns a cached response, if any, or null if not present.
   */
  abstract get(req: HttpRequest<any>): HttpResponse<any>|null;

  /**
   * Adds or updates the response in the cache.
   */
  abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}
```

攔截器可以將這個快取套用到外送請求上。

```javascript
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	// Before doing anything, it's important to only cache GET requests.
    // Skip this interceptor if the request method isn't GET.
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // First, check the cache to see if this request exists.
    const cachedResponse = this.cache.get(req);
    if (cachedResponse) {
      // A cached response exists. Serve it instead of forwarding
      // the request to the next handler.
      return Observable.of(cachedResponse);
    }

    // No cached response exists. Go to the network, and cache
    // the response when it arrives.
    return next.handle(req).do(event => {
      // Remember, there may be other events besides just the response.
      if (event instanceof HttpResponse) {
      	// Update the cache.
      	this.cache.put(req, event);
      }
    });
  }
}
```

很明顯，這個範例略過了請求比對、快取失效等細節，但不難看出，攔截器的能力遠不止轉換請求。如果需要，它們可以用來完全接管請求流程。

為了真正展示它們的彈性，你可以變更上方的範例，讓它在請求已存在於快取中時回傳*兩個*回應事件&mdash;先是快取的回應，稍後再是更新後的網路回應。

```javascript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Still skip non-GET requests.
  if (req.method !== 'GET') {
    return next.handle(req);
  }

  // This will be an Observable of the cached value if there is one,
  // or an empty Observable otherwise. It starts out empty.
  let maybeCachedResponse: Observable<HttpEvent<any>> = Observable.empty();

  // Check the cache.
  const cachedResponse = this.cache.get(req);
  if (cachedResponse) {
    maybeCachedResponse = Observable.of(cachedResponse);
  }

  // Create an Observable (but don't subscribe) that represents making
  // the network request and caching the value.
  const networkResponse = next.handle(req).do(event => {
    // Just like before, check for the HttpResponse event and cache it.
    if (event instanceof HttpResponse) {
      this.cache.put(req, event);
    }
  });

  // Now, combine the two and send the cached response first (if there is
  // one), and the network response second.
  return Observable.concat(maybeCachedResponse, networkResponse);
}
```

現在，任何執行 `http.get(url)` 的人，如果該 URL 先前已被快取過，就會收到*兩個*回應。

### 監聽進度事件

應用程式有時需要傳輸大量資料，而這些傳輸可能需要很長時間。提供這類傳輸進度的回饋是良好的使用者體驗做法；例如，上傳檔案&mdash;而 `@angular/common/http` 支援這一點。

若要發出啟用了進度事件的請求，請先建立一個 `HttpRequest` 實例，並設定特殊的 `reportProgress` 選項：

```javascript
const req = new HttpRequest('POST', '/upload/file', file, {
  reportProgress: true,
});
```

這個選項啟用進度事件的追蹤。請記住，每個進度事件都會觸發變更偵測，所以只在你真的打算在每個事件都更新 UI 時才開啟它們。

接著，透過 `HttpClient` 的 `request()` 方法發出請求。結果會是一個事件的 Observable，就像攔截器那樣：

```javascript
http.request(req).subscribe(event => {
  // Via this API, you get access to the raw event stream.
  // Look for upload progress events.
  if (event.type === HttpEventType.UploadProgress) {
    // This is an upload progress event. Compute and show the % done:
    const percentDone = Math.round(100 * event.loaded / event.total);
    console.log(`File is ${percentDone}% uploaded.`);
  } else if (event instanceof HttpResponse) {
    console.log('File is completely uploaded!');
  }
});
```

## 安全性：XSRF 防護

[跨站請求偽造（XSRF）](https://en.wikipedia.org/wiki/Cross-site_request_forgery)是一種攻擊技術，攻擊者可以藉此誘騙已驗證的使用者在不知情的情況下在你的網站上執行操作。`HttpClient` 支援一種用來防止 XSRF 攻擊的[常見機制](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token)。執行 HTTP 請求時，攔截器會從 cookie 讀取權杖，預設為 `XSRF-TOKEN`，並將其設為 HTTP 標頭 `X-XSRF-TOKEN`。因為只有在你的網域上執行的程式碼才能讀取該 cookie，後端可以確定 HTTP 請求來自你的用戶端應用程式，而不是攻擊者。

預設情況下，攔截器會在所有對相對 URL 的變更型請求（POST 等）上傳送這個 cookie，但不會在 GET/HEAD 請求或帶有絕對 URL 的請求上傳送。

若要利用這一點，你的伺服器需要在頁面載入或第一個 GET 請求時，在一個可由 JavaScript 讀取、名為 `XSRF-TOKEN` 的工作階段 cookie 中設定權杖。在後續的請求中，伺服器可以驗證該 cookie 與 `X-XSRF-TOKEN` HTTP 標頭相符，藉此確定只有在你的網域上執行的程式碼才能傳送該請求。權杖對每個使用者必須是唯一的，且必須能由伺服器驗證；這能防止用戶端自己編造權杖。為了額外的安全性，請將權杖設為你的網站驗證 cookie 加上鹽值（salt）的摘要。

為了在多個 Angular 應用程式共用同一網域或子網域的環境中防止衝突，請為每個應用程式提供唯一的 cookie 名稱。

<div class="alert is-important">
*請注意，`HttpClient` 的支援只是 XSRF 防護方案的用戶端一半。* 你的後端服務必須設定為為你的頁面設定 cookie，並驗證所有符合條件的請求上都有該標頭。否則，Angular 的預設防護將無效。
</div>

### 設定自訂 cookie／標頭名稱

如果你的後端服務為 XSRF 權杖 cookie 或標頭使用不同的名稱，請使用 `HttpClientXsrfModule.withConfig()` 覆寫預設值。

```javascript
imports: [
  HttpClientModule,
  HttpClientXsrfModule.withConfig({
    cookieName: 'My-Xsrf-Cookie',
    headerName: 'My-Xsrf-Header',
  }),
]
```

## 測試 HTTP 請求

如同任何外部相依性，HTTP 後端也需要被模擬，這是良好的測試實務的一部分。`@angular/common/http` 提供了一個測試函式庫 `@angular/common/http/testing`，讓這類模擬的設定變得簡單直接。

### 模擬理念

Angular 的 HTTP 測試函式庫是針對一種測試模式所設計的，在這種模式下，應用程式會先執行程式碼並發出請求。之後，測試預期某些請求已經或尚未發出，對那些請求執行斷言，最後透過「衝放」（flushing）每個預期請求來提供回應，這可能會觸發更多新請求，依此類推。最後，測試可以選擇驗證應用程式沒有發出任何意外的請求。

### 設定

若要開始測試透過 `HttpClient` 發出的請求，請匯入 `HttpClientTestingModule` 並將它加入你的 `TestBed` 設定，如下所示：

```javascript

import {HttpClientTestingModule} from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    ...,
    imports: [
      HttpClientTestingModule,
    ],
  })
});
```

就是這樣。現在，測試過程中發出的請求會抵達測試後端，而不是正規後端。

### 預期並回應請求

模擬透過模組安裝好後，你可以撰寫一個測試，預期會發生 GET 請求並提供模擬回應。以下範例透過將 `HttpClient` 與一個名為 `HttpTestingController` 的類別一起注入測試來做到這一點

```javascript
it('expects a GET request', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
  // Make an HTTP GET request, and expect that it return an object
  // of the form {name: 'Test Data'}.
  http
    .get('/data')
    .subscribe(data => expect(data['name']).toEqual('Test Data'));

  // At this point, the request is pending, and no response has been
  // sent. The next step is to expect that the request happened.
  const req = httpMock.expectOne('/data');

  // If no request with that URL was made, or if multiple requests match,
  // expectOne() would throw. However this test makes only one request to
  // this URL, so it will match and return a mock request. The mock request
  // can be used to deliver a response or make assertions against the
  // request. In this case, the test asserts that the request is a GET.
  expect(req.request.method).toEqual('GET');

  // Next, fulfill the request by transmitting a response.
  req.flush({name: 'Test Data'});

  // Finally, assert that there are no outstanding requests.
  httpMock.verify();
}));
```

最後一步（驗證沒有未完成的請求）常見到足以讓你將它移到 `afterEach()` 步驟中：

```javascript
afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
  httpMock.verify();
}));
```

#### 自訂請求預期

如果僅以 URL 比對還不夠，你可以實作你自己的比對函式。例如，你可以尋找一個帶有 Authorization 標頭的外送請求：

```javascript
const req = httpMock.expectOne((req) => req.headers.has('Authorization'));
```

就如同上方測試中以 URL 使用 `expectOne()` 一樣，如果有 0 個或 2 個以上請求符合這個預期，它就會拋出錯誤。

#### 處理多個請求

如果你需要在測試中回應重複的請求，請使用 `match()` API 而不是 `expectOne()`，它接受相同的引數，但回傳一個符合請求的陣列。一旦回傳，這些請求會從未來的比對中移除，你有責任驗證並衝放它們。

```javascript
// Expect that 5 pings have been made and flush them.
const reqs = httpMock.match('/ping');
expect(reqs.length).toBe(5);
reqs.forEach(req => req.flush());
```
