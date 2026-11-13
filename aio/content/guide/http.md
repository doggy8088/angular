# 使用 HTTP 與後端服務通訊

大多數前端應用程式需要透過 HTTP 協定與伺服器通訊，以下載或上傳資料，並存取其他後端服務。
Angular 為 Angular 應用程式提供了用戶端 HTTP API，也就是 `@angular/common/http` 中的 `HttpClient` 服務類別。

HTTP 用戶端服務提供下列主要功能。

*   請求[具型別回應物件](#typed-response)的能力
*   簡化的[錯誤處理](#error-handling)
*   [可測試性](#testing-requests)功能
*   請求與回應[攔截](#intercepting-requests-and-responses)

##### 必要條件


在使用 `HttpClientModule` 之前，你應該對下列內容有基本了解：

*   TypeScript 程式設計
*   HTTP 協定的使用
*   Angular 應用程式設計基礎，如 [Angular 概念](guide/architecture)所述
*   Observable 技術與運算子。
    請見 [Observables](guide/observables) 指南。

## 設定伺服器通訊

在你能使用 `HttpClient` 之前，需要匯入 Angular 的 `HttpClientModule`。
大多數應用程式會在根 `AppModule` 中這樣做。

<code-example
  path="http/src/app/app.module.ts"
  region="sketch"
  header="app/app.module.ts (excerpt)">
</code-example>

接著你可以將 `HttpClient` 服務注入為應用程式類別的相依性，如下列 `ConfigService` 範例所示。

<code-example
  path="http/src/app/config/config.service.ts"
  region="proto"
  header="app/config/config.service.ts (excerpt)">
</code-example>

`HttpClient` 服務在所有交易中都使用 [observables](guide/glossary#可觀察物件（observable） "Observable definition")。
你必須匯入範例程式碼片段中出現的 RxJS observable 與運算子符號。
這些 `ConfigService` 匯入是典型的寫法。

<code-example
  path="http/src/app/config/config.service.ts"
  region="rxjs-imports"
  header="app/config/config.service.ts (RxJS imports)">
</code-example>

<div class="alert is-helpful">

你可以執行本指南隨附的 <live-example></live-example>。

範例應用程式不需要資料伺服器。
它依賴 [Angular *in-memory-web-api*](https://github.com/angular/angular/tree/main/packages/misc/angular-in-memory-web-api)，它會取代 *HttpClient* 模組的 `HttpBackend`。
這個替代服務模擬了類 REST 後端的行為。

查看 `AppModule` 的 *imports* 以了解它是如何設定的。

</div>

## 從伺服器請求資料

使用 [`HttpClient.get()`](api/common/http/HttpClient#get) 方法從伺服器取得資料。
這個非同步方法會傳送 HTTP 請求，並回傳一個 Observable，在收到回應時發出所請求的資料。
回傳型別會因你傳給呼叫的 `observe` 和 `responseType` 值而有所不同。

`get()` 方法接受兩個引數：要取得資料的端點 URL，以及用來設定請求的 *options* 物件。

```
options: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams|{[param: string]: string | string[]},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  }
```

重要的選項包括 *observe* 和 *responseType* 屬性。

*   *observe* 選項指定要回傳回應的多少部分
*   *responseType* 選項指定回傳資料的格式

<div class="alert is-helpful">

使用 `options` 物件來設定外送請求的其他各個方面。
例如在[新增標頭](#新增標頭)中，服務使用 `headers` 選項屬性設定了預設標頭。

使用 `params` 屬性以 [HTTP URL 參數](#url-params)設定請求，並使用 `reportProgress` 選項在傳輸大量資料時[聆聽進度事件](#report-progress)。

</div>

應用程式經常向伺服器請求 JSON 資料。
在 `ConfigService` 範例中，應用程式需要伺服器上的一個設定檔 `config.json`，用來指定資源 URL。

<code-example
  path="http/src/assets/config.json"
  header="assets/config.json">
</code-example>

若要取得這類資料，`get()` 呼叫需要下列選項：`{observe: 'body', responseType: 'json'}`。
這些是這些選項的預設值，因此下列範例不會傳入 options 物件。
後面的章節會展示一些額外的選項可能性。

{@a config-service}

此範例遵循建立可擴展解決方案的最佳實務，定義了一個可重複使用的[可注入服務](guide/glossary#服務（service） "service definition")來執行資料處理功能。
除了取得資料外，該服務還可以對資料進行後處理、加入錯誤處理，以及加入重試邏輯。

`ConfigService` 使用 `HttpClient.get()` 方法取得這個檔案。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_1"
  header="app/config/config.service.ts (getConfig v.1)">
</code-example>

`ConfigComponent` 注入 `ConfigService` 並呼叫 `getConfig` 服務方法。

因為服務方法回傳的是設定資料的 `Observable`，元件會*訂閱*該方法的回傳值。
訂閱回呼會執行最少量的後處理。
它會將資料欄位複製到元件的 `config` 物件中，該物件在元件範本中進行資料繫結以供顯示。

<code-example
  path="http/src/app/config/config.component.ts"
  region="v1"
  header="app/config/config.component.ts (showConfig v.1)">
</code-example>

{@a typed-response}

### 請求具型別的回應

將你的 `HttpClient` 請求組織為宣告回應物件的型別，讓輸出的使用更簡單、更明確。
指定回應型別在編譯時期相當於一個型別斷言。

<div class="alert is-important">

指定回應型別是向 TypeScript 宣告，它應該將你的回應視為給定的型別。
這是建置時期的檢查，並不保證伺服器真的會以此型別的物件回應。
伺服器有責任確保回傳伺服器 API 所指定的型別。

</div>

若要指定回應物件型別，先定義一個具有所需屬性的介面。
使用介面而不是類別，因為回應是純物件，無法自動轉換為類別的實例。

<code-example
  path="http/src/app/config/config.service.ts"
  region="config-interface">
</code-example>

接著，在服務中將該介面指定為 `HttpClient.get()` 呼叫的型別參數。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_2"
  header="app/config/config.service.ts (getConfig v.2)">
</code-example>

<div class="alert is-helpful">

當你將介面作為型別參數傳給 `HttpClient.get()` 方法時，使用 [RxJS `map` 運算子](guide/rx-library#運算子)依 UI 的需要轉換回應資料。
接著你可以將轉換後的資料傳給 [async 管道](api/common/AsyncPipe)。

</div>

更新後元件方法中的回呼會收到具型別的資料物件，使用起來更簡單也更安全：

<code-example
  path="http/src/app/config/config.component.ts"
  region="v2"
  header="app/config/config.component.ts (showConfig v.2)">
</code-example>

若要存取介面中定義的屬性，你必須明確地將從 JSON 得到的純物件轉換為所需的回應型別。
例如，下列 `subscribe` 回呼收到作為 Object 的 `data`，然後對其進行型別轉換以存取屬性。

<code-example>
   .subscribe(data => this.config = {
     heroesUrl: (data as any).heroesUrl,
     textfile:  (data as any).textfile,
   });
</code-example>

{@a string-union-types}

<div class="callout is-important">

<header>*observe* 與 *response* 型別</header>

`observe` 和 `response` 選項的型別是*字串聯集*，而不是純字串。

```
options: {
    ...
    observe?: 'body' | 'events' | 'response',
    ...
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    ...
  }
```

這可能會造成混淆。
例如：

```typescript
// this works
client.get('/foo', {responseType: 'text'})

// but this does NOT work
const options = {
  responseType: 'text',
};
client.get('/foo', options)
```

在第二種情況下，TypeScript 推斷 `options` 的型別為 `{responseType: string}`。
這個型別太寬，無法傳給預期 `responseType` 型別為某個*特定*字串之一的 `HttpClient.get`。
`HttpClient` 以這種方式明確定義型別，是為了讓編譯器能根據你提供的選項回報正確的回傳型別。

使用 `as const` 讓 TypeScript 知道你確實打算使用常數字串型別：

```typescript
const options = {
  responseType: 'text' as const,
};
client.get('/foo', options);
```

</div>

### 讀取完整回應

在前面的範例中，對 `HttpClient.get()` 的呼叫沒有指定任何選項。
預設情況下，它回傳回應主體中包含的 JSON 資料。

你可能需要比回應主體所包含的更多的交易資訊。
伺服器有時會回傳特殊的標頭或狀態碼，指出對應用程式工作流程很重要的某些情況。

告訴 `HttpClient` 你想要完整回應，使用 `get()` 方法的 `observe` 選項：

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfigResponse">
</code-example>

現在 `HttpClient.get()` 回傳的是 `HttpResponse` 型別的 `Observable`，而不僅僅是主體中包含的 JSON 資料。

元件的 `showConfigResponse()` 方法會顯示回應標頭以及設定：

<code-example
  path="http/src/app/config/config.component.ts"
  region="showConfigResponse"
  header="app/config/config.component.ts (showConfigResponse)"
 >
</code-example>

如你所見，回應物件有一個型別正確的 `body` 屬性。

### 發出 JSONP 請求

當伺服器不支援 [CORS 協定](https://developer.mozilla.org/docs/Web/HTTP/CORS)時，應用程式可以使用 `HttpClient` 跨網域發出 [JSONP](https://en.wikipedia.org/wiki/JSONP) 請求。

Angular 的 JSONP 請求會回傳一個 `Observable`。
遵循訂閱 observable 的模式，並使用 RxJS `map` 運算子轉換回應，再使用 [async 管道](api/common/AsyncPipe) 管理結果。

在 Angular 中，透過在 `NgModule` 匯入中包含 `HttpClientJsonpModule` 來使用 JSONP。
在下列範例中，`searchHeroes()` 方法使用 JSONP 請求，查詢名稱包含搜尋詞的英雄。

```ts
/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable {
  term = term.trim();

  const heroesURL = `${this.heroesURL}?${term}`;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', [])) // then handle the error
    );
}
```

這個請求將 `heroesURL` 作為第一個參數傳入，將回呼函式名稱作為第二個參數傳入。
回應被包裝在回呼函式中，該函式接收 JSONP 方法回傳的 observables，並將它們透過管道傳給錯誤處理器。

### 請求非 JSON 資料

並非所有 API 都回傳 JSON 資料。
在下一個範例中，`DownloaderService` 的一個方法從伺服器讀取文字檔並記錄檔案內容，然後將這些內容作為 `Observable<string>` 回傳給呼叫者。

<code-example
  path="http/src/app/downloader/downloader.service.ts"
  region="getTextFile"
  header="app/downloader/downloader.service.ts (getTextFile)" linenums="false">
</code-example>

由於 `responseType` 選項，`HttpClient.get()` 回傳的是字串而不是預設的 JSON。

RxJS 的 `tap` 運算子（如同「竊聽」的 tap）讓程式碼可以檢視通過 observable 的成功和錯誤值，而不干擾它們。

`DownloaderComponent` 中的 `download()` 方法透過訂閱服務方法來啟動請求。

<code-example
  path="http/src/app/downloader/downloader.component.ts"
  region="download"
  header="app/downloader/downloader.component.ts (download)" linenums="false">
</code-example>

{@a error-handling}

## 處理請求錯誤

如果請求在伺服器上失敗，`HttpClient` 會回傳一個*錯誤*物件，而不是成功的回應。

執行伺服器交易的同一個服務，也應該執行錯誤的檢視、解讀與解決。

當錯誤發生時，你可以取得失敗的詳細資訊，以通知使用者。
在某些情況下，你也可以自動[重試請求](#retry)。

{@a error-details}

### 取得錯誤詳細資訊

當資料存取失敗時，應用程式應該給使用者有用的回饋。
原始的錯誤物件作為回饋並不是特別有用。
除了偵測到錯誤已發生之外，你還需要取得錯誤詳細資訊，並使用這些詳細資訊撰寫對使用者友善的回應。

可能會發生兩種類型的錯誤。

*   伺服器後端可能拒絕請求，回傳帶有 404 或 500 等狀態碼的 HTTP 回應。
    這些是錯誤*回應*。

*   用戶端可能出錯，例如網路錯誤導致請求無法成功完成，或 RxJS 運算子中拋出的例外。
    這些錯誤的 `status` 設為 `0`，且 `error` 屬性包含一個 `ProgressEvent` 物件，其 `type` 可能提供進一步的資訊。

`HttpClient` 將這兩種錯誤都捕捉在其 `HttpErrorResponse` 中。
檢視該回應以找出錯誤的原因。

下列範例在先前定義的 [ConfigService](#config-service "ConfigService defined") 中定義了一個錯誤處理器。

<code-example
  path="http/src/app/config/config.service.ts"
  region="handleError"
  header="app/config/config.service.ts (handleError)">
</code-example>

該處理器回傳一個帶有對使用者友善錯誤訊息的 RxJS `ErrorObservable`。
下列程式碼更新了 `getConfig()` 方法，使用[管道](guide/pipes "Pipes guide")將 `HttpClient.get()` 呼叫回傳的所有 observables 傳送給錯誤處理器。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_3"
  header="app/config/config.service.ts (getConfig v.3 with error handler)">
</code-example>

{@a retry}

### 重試失敗的請求

有時錯誤是暫時性的，只要再試一次就會自動消失。
例如，網路中斷在行動情境中很常見，再試一次可以產生成功的結果。

[RxJS 函式庫](guide/rx-library)提供了多個*重試*運算子。
例如，`retry()` 運算子會自動重新訂閱失敗的 `Observable` 指定的次數。
*重新訂閱* `HttpClient` 方法呼叫的結果，其效果就是重新發出 HTTP 請求。

下列範例展示如何將失敗的請求透過管道傳給 `retry()` 運算子，再傳給錯誤處理器。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig"
  header="app/config/config.service.ts (getConfig with retry)">
</code-example>

## 傳送資料到伺服器

除了從伺服器取得資料外，`HttpClient` 還支援 PUT、POST 和 DELETE 等其他 HTTP 方法，你可以用它們來修改遠端資料。

本指南的範例應用程式包含「英雄之旅」範例的節略版本，它會取得英雄，並讓使用者新增、刪除和更新英雄。
下列章節展示範例的 `HeroesService` 中的資料更新方法範例。

### 發出 POST 請求

應用程式在提交表單時，經常以 POST 請求將資料傳送到伺服器。
在下列範例中，`HeroesService` 在將英雄加入資料庫時發出 HTTP POST 請求。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="addHero"
  header="app/heroes/heroes.service.ts (addHero)">
</code-example>

`HttpClient.post()` 方法與 `get()` 類似，它有一個型別參數，你可以用它指定你預期伺服器回傳給定型別的資料。
該方法接受一個資源 URL 和兩個額外參數：

* *body*：要以 POST 傳送、在請求主體中的資料。
* *options*：包含方法選項的物件，在此例中用來[指定必要的標頭](#新增標頭)。

此範例[如上所述](#error-details)捕捉錯誤。

`HeroesComponent` 透過訂閱此服務方法回傳的 `Observable`，啟動實際的 POST 操作。

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="add-hero-subscribe"
  header="app/heroes/heroes.component.ts (addHero)">
</code-example>

當伺服器以新加入的英雄成功回應時，元件將該英雄加入顯示的 `heroes` 清單中。

### 發出 DELETE 請求

這個應用程式使用 `HttpClient.delete` 方法刪除英雄，在請求 URL 中傳入英雄的 ID。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="deleteHero"
  header="app/heroes/heroes.service.ts (deleteHero)">
</code-example>

`HeroesComponent` 透過訂閱此服務方法回傳的 `Observable`，啟動實際的 DELETE 操作。

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-subscribe"
  header="app/heroes/heroes.component.ts (deleteHero)">
</code-example>

元件不預期刪除操作有任何結果，因此它在沒有回呼的情況下訂閱。
即使你不使用結果，你仍然必須訂閱。
呼叫 `subscribe()` 方法會*執行* observable，這正是啟動 DELETE 請求的原因。

<div class="alert is-important">

你必須呼叫 _subscribe()_，否則什麼都不會發生。
僅呼叫 `HeroesService.deleteHero()` 並不會啟動 DELETE 請求。

</div>

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-no-subscribe">
</code-example>


{@a always-subscribe}

**務必 *subscribe*。**

`HttpClient` 方法在你對該方法回傳的 observable 呼叫 `subscribe()` 之前，不會開始其 HTTP 請求。
這對*所有* `HttpClient` *方法*都成立。

<div class="alert is-helpful">

[`AsyncPipe`](api/common/AsyncPipe) 會自動為你訂閱（並取消訂閱）。

</div>

從 `HttpClient` 方法回傳的所有 observable 在設計上都是*冷*（cold）的。
HTTP 請求的執行會被*延遲*，讓你可以在任何事情實際發生之前，以 `tap` 和 `catchError` 等額外操作擴展該 observable。

呼叫 `subscribe(...)` 會觸發 observable 的執行，並促使 `HttpClient` 組裝 HTTP 請求並將其傳送到伺服器。

將這些 observable 想成實際 HTTP 請求的*藍圖*。

<div class="alert is-helpful">

事實上，每次 `subscribe()` 都會啟動該 observable 的一次獨立執行。
訂閱兩次會產生兩個 HTTP 請求。

```javascript
const req = http.get<Heroes>('/api/heroes');
// 0 requests made - .subscribe() not called.
req.subscribe();
// 1 request made.
req.subscribe();
// 2 requests made.
```

</div>

### 發出 PUT 請求

應用程式可以使用 HTTP 用戶端服務傳送 PUT 請求。
下列 `HeroesService` 範例與 POST 範例一樣，以更新後的資料取代資源。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="updateHero"
  header="app/heroes/heroes.service.ts (updateHero)">
</code-example>

對於任何回傳 observable 的 HTTP 方法，呼叫者 `HeroesComponent.update()` 都[必須 `subscribe()`](#always-subscribe "Why you must always subscribe.") 訂閱 `HttpClient.put()` 回傳的 observable，才能啟動請求。

### 新增與更新標頭

許多伺服器要求儲存操作附帶額外的標頭。
例如，伺服器可能需要授權權杖，或 "Content-Type" 標頭，以明確宣告請求主體的 MIME 型別。

##### 新增標頭

`HeroesService` 在 `httpOptions` 物件中定義了這類標頭，並將其傳給每個 `HttpClient` 儲存方法。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="http-options"
  header="app/heroes/heroes.service.ts (httpOptions)">
</code-example>

##### 更新標頭

你無法直接修改先前 options 物件中的既有標頭，因為 `HttpHeaders` 類別的實例是不可變的。
改用 `set()` 方法，它會回傳目前實例的複製件，並套用新的變更。

下列範例展示當舊權杖過期時，如何在發出下一個請求之前更新授權標頭。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
   region="update-headers" linenums="false">
</code-example>

{@a url-params}

## 設定 HTTP URL 參數

將 `HttpParams` 類別與 `params` 請求選項搭配使用，在你的 `HttpRequest` 中加入 URL 查詢字串。

在下列範例中，`searchHeroes()` 方法查詢名稱包含搜尋詞的英雄。

先匯入 `HttpParams` 類別。

<code-example hideCopy language="typescript">
import {HttpParams} from "@angular/common/http";
</code-example>

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="searchHeroes" linenums="false">
</code-example>

如果有搜尋詞，程式碼會建構一個帶有 HTML URL 編碼搜尋參數的 options 物件。
例如，如果詞是 "cat"，GET 請求 URL 就會是 `api/heroes?name=cat`。

`HttpParams` 物件是不可變的。
如果你需要更新 options，請儲存 `.set()` 方法的回傳值。

你也可以使用 `fromString` 變數直接從查詢字串建立 HTTP 參數：

<code-example hideCopy language="typescript">
const params = new HttpParams({fromString: 'name=foo'});
</code-example>

{@a intercepting-requests-and-responses}

## 攔截請求與回應

透過攔截，你可以宣告*攔截器*，檢視並轉換從你的應用程式傳到伺服器的 HTTP 請求。
相同的攔截器也可以檢視並轉換伺服器回應返回應用程式途中的內容。
多個攔截器形成一條*來回*的請求／回應處理器鏈。

攔截器可以以例行、標準的方式，為每個 HTTP 請求／回應執行各種*隱含*任務，從驗證到記錄都包括在內。

若沒有攔截，開發者就必須為每個 `HttpClient` 方法呼叫*明確地*實作這些任務。

### 撰寫攔截器

若要實作攔截器，請宣告一個實作 `HttpInterceptor` 介面的 `intercept()` 方法的類別。

以下是一個什麼都不做的 _noop_ 攔截器，它讓請求原封不動地通過：

<code-example
  path="http/src/app/http-interceptors/noop-interceptor.ts"
  header="app/http-interceptors/noop-interceptor.ts">
</code-example>

`intercept` 方法將請求轉換為一個 `Observable`，最終回傳 HTTP 回應。
從這個意義上說，每個攔截器都完全有能力自行處理整個請求。

大多數攔截器會在請求進入時檢視它，並將可能已變更的請求轉發給 `next` 物件的 `handle()` 方法，該物件實作了 [`HttpHandler`](api/common/http/HttpHandler) 介面。

```javascript
export abstract class HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
```

與 `intercept()` 一樣，`handle()` 方法將 HTTP 請求轉換為 [`HttpEvents`](#interceptor-events) 的 `Observable`，其最終包含伺服器的回應。
`intercept()` 方法可以檢視該 observable 並在將其回傳給呼叫者之前變更它。

這個 _no-op_ 攔截器以原始請求呼叫 `next.handle()`，並且什麼都不做就回傳該 observable。

### _next_ 物件

`next` 物件代表攔截器鏈中的下一個攔截器。
鏈中的最後一個 `next` 是 `HttpClient` 後端處理器，它將請求傳送到伺服器並接收伺服器的回應。

大多數攔截器會呼叫 `next.handle()`，讓請求流經下一個攔截器，最終到達後端處理器。
攔截器*可以*跳過呼叫 `next.handle()`，使鏈短路，並以人工的伺服器回應[回傳自己的 `Observable`](#caching)。

這是 Express.js 等框架中常見的中介軟體模式。

### 提供攔截器

`NoopInterceptor` 是由 Angular 的[依賴注入（DI）](guide/dependency-injection)系統管理的服務。
與其他服務一樣，你必須先提供攔截器類別，應用程式才能使用它。

因為攔截器是 `HttpClient` 服務的可選相依性，你必須在提供 `HttpClient` 的同一個注入器或其父注入器中提供它們。
在 DI 建立 `HttpClient` *之後*提供的攔截器會被忽略。

這個應用程式在應用程式的根注入器中提供 `HttpClient`，這是將 `HttpClientModule` 匯入 `AppModule` 的副作用。
你也應該在 `AppModule` 中提供攔截器。

從 `@angular/common/http` 匯入 `HTTP_INTERCEPTORS` 注入權杖後，像這樣撰寫 `NoopInterceptor` 提供者：

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="noop-provider">
</code-example>

注意 `multi: true` 選項。
這個必要的設定告訴 Angular，`HTTP_INTERCEPTORS` 是一個*多重提供者*的權杖，它注入的是一個值陣列，而不是單一值。

你*可以*將這個提供者直接加入 `AppModule` 的 providers 陣列。
然而，這樣相當冗長，而且你很可能會建立更多攔截器並以相同方式提供它們。
你還必須[密切注意提供這些攔截器的順序](#攔截器順序)。

考慮建立一個「桶」檔案，將所有攔截器提供者彙集到一個 `httpInterceptorProviders` 陣列中，從這第一個 `NoopInterceptor` 開始。

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="interceptor-providers"
  header="app/http-interceptors/index.ts">
</code-example>

接著像這樣將它匯入並加入 `AppModule` 的 _providers_ 陣列：

<code-example
  path="http/src/app/app.module.ts"
  region="interceptor-providers"
  header="app/app.module.ts (interceptor providers)">
</code-example>

隨著你建立新的攔截器，將它們加入 `httpInterceptorProviders` 陣列，就不必再回頭修改 `AppModule`。

<div class="alert is-helpful">

完整範例程式碼中還有更多攔截器。

</div>

### 攔截器順序

Angular 會依你提供攔截器的順序套用它們。
例如，假設你想處理 HTTP 請求的驗證，並在將它們傳送到伺服器之前記錄它們。
若要完成這項任務，你可以先提供 `AuthInterceptor` 服務，接著提供 `LoggingInterceptor` 服務。
外送的請求會從 `AuthInterceptor` 流向 `AuthInterceptor`。
這些請求的回應會以相反方向流動，從 `LoggingInterceptor` 回到 `AuthInterceptor`。
以下是此過程的視覺化呈現：

<div class="lightbox">

<img alt="攔截器依 HttpClient、AuthInterceptor、AuthInterceptor、HttpBackend、Server 的順序排列，並以相反順序返回，展示雙向流程" src="generated/images/guide/http/interceptor-order.svg">

</div>

<div class="alert is-helpful">

此過程中的最後一個攔截器永遠是處理與伺服器通訊的 `HttpBackend`。

</div>

你之後無法變更攔截器的順序或移除攔截器。
如果你需要動態啟用和停用攔截器，就必須將該能力建置到攔截器本身之中。

{@a interceptor-events}

### 處理攔截器事件

大多數 `HttpClient` 方法回傳 `HttpResponse<any>` 的 observables。
`HttpResponse` 類別本身其實是一個事件，其型別為 `HttpEventType.Response`。
然而，單一 HTTP 請求可以產生其他型別的多個事件，包括上傳與下載進度事件。
`HttpInterceptor.intercept()` 和 `HttpHandler.handle()` 方法回傳 `HttpEvent<any>` 的 observables。

許多攔截器只關心外送的請求，並直接回傳來自 `next.handle()` 的事件串流而不修改它。
然而，有些攔截器需要檢視並修改來自 `next.handle()` 的回應；這些操作可以看到串流中的所有這些事件。

{@a immutability}

雖然攔截器能夠修改請求與回應，但 `HttpRequest` 和 `HttpResponse` 實例屬性是 `readonly`，讓它們在很大程度上是不可變的。
它們是不可變的，理由很充分：
應用程式可能在請求成功之前重試多次，這意味著攔截器鏈可以多次重新處理同一個請求。
如果攔截器可以修改原始請求物件，重試的操作就會從修改過的請求開始，而不是原始請求。
不可變性確保攔截器在每次嘗試時看到的都是同一個請求。

<div class="alert is-helpful">

除非有充分的理由，否則你的攔截器應該不加修改地回傳每個事件。

</div>

TypeScript 會阻止你設定 `HttpRequest` 的唯讀屬性。

```javascript
  // Typescript disallows the following assignment because req.url is readonly
  req.url = req.url.replace('http://', 'https://');
```

如果你必須變更請求，先複製它並修改複製件，再將其傳給 `next.handle()`。
你可以一步完成複製與修改，如下列範例所示。

<code-example
  path="http/src/app/http-interceptors/ensure-https-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/ensure-https-interceptor.ts (excerpt)">
</code-example>

`clone()` 方法的雜湊引數讓你可以在複製其他內容的同時，改變請求的特定屬性。

#### 修改請求主體

`readonly` 指派防護無法阻止深層更新，特別是無法阻止你修改請求主體物件的屬性。

```javascript
  req.body.name = req.body.name.trim(); // bad idea!
```

如果你必須修改請求主體，請遵循下列步驟。

1.  複製主體，並在複製件中進行變更。
1.  使用請求物件的 `clone()` 方法複製請求物件。
1.  將複製件的主體替換為修改過的複製件。

<code-example
  path="http/src/app/http-interceptors/trim-name-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/trim-name-interceptor.ts (excerpt)">
</code-example>

#### 清除複製件中的請求主體

有時你需要清除請求主體，而不是替換它。
若要這樣做，將複製後請求的主體設為 `null`。

<div class="alert is-helpful">

**TIP**: <br />
如果你將複製後請求的主體設為 `undefined`，Angular 會假設你打算保持主體原樣。

</div>

```javascript
  newReq = req.clone({ ... }); // body not mentioned => preserve original body
  newReq = req.clone({ body: undefined }); // preserve original body
  newReq = req.clone({ body: null }); // clear the body
```

## HTTP 攔截器使用案例

以下是攔截器的一些常見用途。

### 設定預設標頭

應用程式經常使用攔截器在外送的請求上設定預設標頭。

範例應用程式有一個會產生授權權杖的 `AuthService`。
以下是其 `AuthInterceptor`，它注入該服務以取得權杖，並在每個外送的請求上加入帶有該權杖的授權標頭：

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  header="app/http-interceptors/auth-interceptor.ts">
</code-example>

複製請求以設定新標頭的做法非常常見，因此有一個 `setHeaders` 捷徑可用：

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  region="set-header-shortcut">
</code-example>

變更標頭的攔截器可以用於許多不同的操作，包括：

*   驗證／授權
*   快取行為；例如 `If-Modified-Since`
*   XSRF 防護

### 記錄請求與回應配對

因為攔截器可以*一起*處理請求與回應，它們可以執行諸如為整個 HTTP 操作計時與記錄等任務。

請看下列 `LoggingInterceptor`，它捕捉請求的時間與回應的時間，並以注入的 `MessageService` 記錄結果與經過時間。

<code-example
  path="http/src/app/http-interceptors/logging-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/logging-interceptor.ts)">
</code-example>

RxJS 的 `tap` 運算子會捕捉請求是成功還是失敗。
RxJS 的 `finalize` 運算子會在回應 observable 拋出錯誤或完成（它必然會完成）時被呼叫，並將結果回報給 `MessageService`。

`tap` 和 `finalize` 都不會觸碰回傳給呼叫者的 observable 串流的值。

{@a custom-json-parser}

### 自訂 JSON 解析

攔截器可以用來以自訂實作取代內建的 JSON 解析。

下列範例中的 `CustomJsonInterceptor` 展示了如何做到這一點。
如果被攔截的請求預期 `'json'` 回應，`responseType` 會被改為 `'text'`，以停用內建的 JSON 解析。
接著，回應會透過注入的 `JsonParser` 進行解析。

<code-example
  path="http/src/app/http-interceptors/custom-json-interceptor.ts"
  region="custom-json-interceptor"
  header="app/http-interceptors/custom-json-interceptor.ts">
</code-example>

接著你可以實作你自己的自訂 `JsonParser`。
以下是一個帶有特殊日期復活器的自訂 JsonParser。

<code-example
  path="http/src/app/http-interceptors/custom-json-interceptor.ts"
  region="custom-json-parser"
  header="app/http-interceptors/custom-json-interceptor.ts">
</code-example>

你會將 `CustomParser` 與 `CustomJsonInterceptor` 一起提供。

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="custom-json-interceptor"
  header="app/http-interceptors/index.ts">
</code-example>

{@a caching}

### 快取請求

攔截器可以自行處理請求，而不轉發給 `next.handle()`。

例如，你可能決定快取某些請求與回應以提升效能。
你可以將快取委派給攔截器，而不干擾你既有的資料服務。

下列範例中的 `CachingInterceptor` 展示了這種做法。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="v1"
  header="app/http-interceptors/caching-interceptor.ts)">
</code-example>

*   `isCacheable()` 函式決定請求是否可快取。
    在這個範例中，只有對套件搜尋 API 的 GET 請求可快取。

*   如果請求不可快取，攔截器會將請求轉發給鏈中的下一個處理器
*   如果在快取中找到可快取的請求，攔截器會回傳一個帶有快取回應的 `of()` *observable*，繞過 `next` 處理器以及下游的所有其他攔截器
*   如果可快取的請求不在快取中，程式碼會呼叫 `sendRequest()`。
    這個函式將請求轉發給 `next.handle()`，它最終會呼叫伺服器並回傳伺服器的回應。

{@a send-request}

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="send-request">
</code-example>

<div class="alert is-helpful">

注意 `sendRequest()` 如何在回應返回應用程式的途中攔截它。
這個方法將回應透過 `tap()` 運算子傳遞，其回呼會將回應加入快取。

原始回應不受影響地沿著攔截器鏈繼續返回應用程式的呼叫者。

資料服務（如 `PackageSearchService`）並不知道它們的某些 `HttpClient` 請求實際上回傳的是快取的回應。

{@a cache-refresh}

### 使用攔截器請求多個值

`HttpClient.get()` 方法通常回傳一個只發出單一值的 observable，該值不是資料就是錯誤。
攔截器可以將其改為發出[多個值](guide/observables)的 observable。

`CachingInterceptor` 的下列修訂版本會選擇性地回傳一個 observable，它立即發出快取的回應，將請求繼續傳送到套件搜尋 API，稍後再以更新後的搜尋結果再次發出。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="intercept-refresh">
</code-example>

<div class="alert is-helpful">

*先快取再重新整理*選項是由自訂的 `x-refresh` 標頭的存在觸發的。

`PackageSearchComponent` 上的一個核取方塊會切換 `withRefresh` 旗標，它是 `PackageSearchService.search()` 的引數之一。
該 `search()` 方法會建立自訂的 `x-refresh` 標頭，並在呼叫 `HttpClient.get()` 之前將其加入請求。

</div>

修訂後的 `CachingInterceptor` 無論是否有快取值，都會使用上述相同的 `sendRequest()` 方法建立伺服器請求。
`results$` observable 在被訂閱時發出請求。

*   如果沒有快取值，攔截器會回傳 `results$`。
*   如果有快取值，程式碼會將快取的回應*透過管道*接到 `results$` 上，產生一個重新組合的 observable，它會發出兩次回應：先是快取回應（立即發出），稍後則是來自伺服器的回應。
    訂閱者會看到兩個回應的序列。

{@a report-progress}

## 追蹤並顯示請求進度

應用程式有時會傳輸大量資料，而這些傳輸可能需要很長時間。
檔案上傳就是典型的例子。
你可以透過提供這類傳輸的進度回饋，給使用者更好的體驗。

若要發出啟用了進度事件的請求，請建立 `HttpRequest` 的實例，並將 `reportProgress` 選項設為 true，以啟用進度事件的追蹤。

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-request"
  header="app/uploader/uploader.service.ts (upload request)">
</code-example>

<div class="alert is-important">

**TIP**: <br />
每個進度事件都會觸發變更偵測，因此只在你需要在 UI 中回報進度時才開啟它們。

當使用帶有 HTTP 方法的 [`HttpClient.request()`](api/common/http/HttpClient#request) 時，請以 [`observe: 'events'`](api/common/http/HttpClient#request) 設定該方法，以查看所有事件，包括傳輸的進度。

</div>

接著，將這個請求物件傳給 `HttpClient.request()` 方法，它會回傳 `HttpEvents` 的 `Observable`（與[攔截器](#interceptor-events)處理的事件相同）。

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-body"
  header="app/uploader/uploader.service.ts (upload body)">
</code-example>

`getEventMessage` 方法解讀事件串流中每一種型別的 `HttpEvent`。

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="getEventMessage"
  header="app/uploader/uploader.service.ts (getEventMessage)">
</code-example>

<div class="alert is-helpful">

本指南的範例應用程式沒有接受上傳檔案的伺服器。
`app/http-interceptors/upload-interceptor.ts` 中的 `UploadInterceptor` 會攔截並短路上傳請求，回傳一個由模擬事件組成的 observable。

</div>

## 以防抖動最佳化伺服器互動

如果你需要因應使用者輸入而發出 HTTP 請求，為每次按鍵都傳送請求並不有效率。
最好等到使用者停止輸入後再傳送請求。
這項技術稱為防抖動（debouncing）。

請看下列範本，它讓使用者輸入搜尋詞，以依名稱尋找套件。
當使用者在搜尋框中輸入名稱時，`PackageSearchComponent` 會向套件搜尋 API 傳送對該名稱套件的搜尋請求。

<code-example
  path="http/src/app/package-search/package-search.component.html"
  region="search"
  header="app/package-search/package-search.component.html (search)">
</code-example>

在這裡，`keyup` 事件繫結將每次按鍵都傳送到元件的 `search()` 方法。

<div class="alert is-helpful">

範本中 `$event.target` 的型別僅為 `EventTarget`。
在 `getValue()` 方法中，target 被轉換為 `HTMLInputElement`，讓型別安全的程式碼可以存取其 `value` 屬性。

<code-example path="http/src/app/package-search/package-search.component.ts" region="getValue"></code-example>

</div>

下列程式碼片段使用 RxJS 運算子為此輸入實作防抖動。

<code-example
  path="http/src/app/package-search/package-search.component.ts"
  region="debounce"
  header="app/package-search/package-search.component.ts (excerpt)">
</code-example>

`searchText$` 是來自使用者的搜尋框值的序列。
它被定義為 RxJS 的 `Subject`，這意味著它是一個多播的 `Observable`，也可以透過呼叫 `next(value)` 為自己發出值，就像在 `search()` 方法中發生的那樣。

程式碼在 `ngOnInit()` 中並不將每個 `searchText` 值直接轉發給注入的 `PackageSearchService`，而是將搜尋值透過三個運算子傳遞，這樣搜尋值只有在它是新值且使用者已停止輸入時才會到達服務。

* `debounceTime(500)`：等待使用者停止輸入，在此例中為 1/2 秒。
* `distinctUntilChanged()`：等待搜尋文字變更。
* `switchMap()`：將搜尋請求傳送給服務。

程式碼將 `packages$` 設為這個重新組合的搜尋結果 `Observable`。
範本以 [AsyncPipe](api/common/AsyncPipe) 訂閱 `packages$`，並在搜尋結果到達時顯示它們。

<div class="alert is-helpful">

請見[使用攔截器請求多個值](#cache-refresh)，了解 `withRefresh` 選項的更多資訊。

</div>

### 使用 *switchMap()* 運算子

`switchMap()` 運算子接受一個回傳 `Observable` 的函式引數。
在此範例中，`PackageSearchService.search` 會回傳一個 `Observable`，與其他資料服務方法一樣。
如果先前的搜尋請求仍在進行中（例如網路連線不佳時），運算子會取消該請求並傳送新的請求。

<div class="alert is-helpful">

**NOTE**: <br />
`switchMap()` 會依原始請求順序回傳服務回應，即使伺服器以不同順序回傳它們。

</div>

<div class="alert is-helpful">

如果你認為會重複使用這套防抖動邏輯，可以考慮將它移到工具函式中，或移到 `PackageSearchService` 本身。

</div>

## 安全性：XSRF 防護

[跨站請求偽造（XSRF 或 CSRF）](https://en.wikipedia.org/wiki/Cross-site_request_forgery)是一種攻擊技術，攻擊者可以藉此誘騙已驗證的使用者在不知情的情況下在你的網站上執行操作。
`HttpClient` 支援一種用來防止 XSRF 攻擊的[常見機制](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token)。
執行 HTTP 請求時，攔截器會從 cookie 讀取權杖（預設為 `XSRF-TOKEN`），並將其設為 HTTP 標頭 `X-XSRF-TOKEN`。
因為只有在你的網域上執行的程式碼才能讀取該 cookie，後端可以確定 HTTP 請求來自你的用戶端應用程式，而不是攻擊者。

預設情況下，攔截器會在所有對相對 URL 的變動請求（如 POST）上傳送此標頭，但不會在 GET/HEAD 請求或帶有絕對 URL 的請求上傳送。

若要利用這一點，你的伺服器需要在頁面載入或第一個 GET 請求時，在名為 `XSRF-TOKEN`、可由 JavaScript 讀取的工作階段 cookie 中設定權杖。
在後續的請求中，伺服器可以驗證該 cookie 與 `X-XSRF-TOKEN` HTTP 標頭相符，藉此確定只有在你的網域上執行的程式碼才能傳送該請求。
權杖對每個使用者必須是唯一的，且必須能由伺服器驗證；這能防止用戶端自己編造權杖。
為了額外的安全性，請將權杖設為你的網站驗證 cookie 加上鹽值（salt）的摘要。

為了在多個 Angular 應用程式共用同一網域或子網域的環境中防止衝突，請為每個應用程式提供唯一的 cookie 名稱。

<div class="alert is-important">

*`HttpClient` 只支援 XSRF 防護方案的用戶端一半。*
你的後端服務必須設定為為你的頁面設定 cookie，並驗證所有符合條件的請求上都有該標頭。
若未這樣做，Angular 的預設防護將失效。

</div>

### 設定自訂 cookie／標頭名稱

如果你的後端服務為 XSRF 權杖 cookie 或標頭使用不同的名稱，請使用 `HttpClientXsrfModule.withOptions()` 覆寫預設值。

<code-example
  path="http/src/app/app.module.ts"
  region="xsrf">
</code-example>

{@a testing-requests}

## 測試請求

對於任何外部相依性，你都必須模擬 HTTP 後端，讓你的測試可以模擬與遠端伺服器的互動。
`@angular/common/http/testing` 函式庫讓這類模擬的設定變得簡單直接。

Angular 的 HTTP 測試函式庫是為一種測試模式而設計的，在這種模式中，應用程式先執行程式碼並發出請求。
接著，測試預期某些請求已經或尚未發出，對那些請求執行斷言，最後透過「衝放」（flushing）每個預期請求來提供回應。

最後，測試可以驗證應用程式沒有發出任何意料之外的請求。

<div class="alert is-helpful">

你可以在即時編碼環境中執行 <live-example stackblitz="specs">這些範例測試</live-example>。

本指南所述的測試位於 `src/testing/http-client.spec.ts`。
也有呼叫 `HttpClient` 的應用程式資料服務的測試，位於 `src/app/heroes/heroes.service.spec.ts`。

</div>

### 測試設定

若要開始測試對 `HttpClient` 的呼叫，請匯入 `HttpClientTestingModule` 和模擬控制器 `HttpTestingController`，以及你的測試所需的其他符號。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="imports"
  header="app/testing/http-client.spec.ts (imports)">
</code-example>

接著，將 `HttpClientTestingModule` 加入 `TestBed`，並繼續設定*被測服務*。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="setup"
  header="app/testing/http-client.spec.ts(setup)">
</code-example>

現在，測試過程中發出的請求會抵達測試後端，而不是正規後端。

此設定也會呼叫 `TestBed.inject()` 注入 `HttpClient` 服務和模擬控制器，讓它們可以在測試期間被參照。

### 預期並回應請求

現在你可以撰寫一個測試，預期會發生 GET 請求，並提供模擬回應。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="get-test"
  header="app/testing/http-client.spec.ts (HttpClient.get)">
</code-example>

最後一步（驗證沒有未完成的請求）常見到足以讓你將它移到 `afterEach()` 步驟中：

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="afterEach">
</code-example>

#### 自訂請求預期

如果僅以 URL 比對還不夠，你可以實作你自己的比對函式。
例如，你可以尋找帶有授權標頭的外送請求：

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="predicate">
</code-example>

與前面的 `expectOne()` 一樣，如果有 0 個或 2 個以上請求滿足此述詞，測試就會失敗。

#### 處理多個請求

如果你需要在測試中回應重複的請求，請使用 `match()` API 而不是 `expectOne()`。
它接受相同的引數，但回傳一個符合請求的陣列。
一旦回傳，這些請求會從未來的比對中移除，你有責任衝放並驗證它們。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="multi-request">
</code-example>

### 測試錯誤

你應該測試應用程式對失敗 HTTP 請求的防禦。

以錯誤訊息呼叫 `request.flush()`，如下列範例所示。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="404">
</code-example>

或者，以 `ErrorEvent` 呼叫 `request.error()`。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="network-error">
</code-example>

## 將中繼資料傳遞給攔截器

許多攔截器需要設定，或能從設定中受益。
請看一個會重試失敗請求的攔截器。
預設情況下，攔截器可能重試請求三次，但對於特別容易出錯或敏感的請求，你可能想覆寫這個重試次數。

`HttpClient` 請求包含一個可以攜帶請求中繼資料的 *context*。
這個 context 可供攔截器讀取或修改，不過在請求傳送時，它不會被傳輸到後端伺服器。
這讓應用程式或其他攔截器可以以設定參數標記請求，例如請求要重試幾次。

### 建立 context 權杖

Angular 使用 `HttpContextToken` 在 context 中儲存和擷取值。
你可以使用 `new` 運算子建立 context 權杖，如下列範例所示：

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="context-token" header="creating a context token"></code-example>

在建立 `HttpContextToken` 時傳入的 lambda 函式 `() => 3` 有兩個用途：

1.  它讓 TypeScript 推斷此權杖的型別：
    `HttpContextToken<number>`
    請求 context 是型別安全的 &mdash;從請求的 context 讀取權杖會回傳適當型別的值。

1.  它設定權杖的預設值。
    如果沒有為此權杖設定其他值，請求 context 就會回傳這個值。
    使用預設值可以省去檢查特定值是否已設定的需要。

### 發出請求時設定 context 值

發出請求時，你可以提供一個 `HttpContext` 實例，你已經在其中設定好 context 值。

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="set-context" header="setting context values"></code-example>

### 在攔截器中讀取 context 值

在攔截器內，你可以用 `HttpContext.get()` 讀取給定請求的 context 中權杖的值。
如果你沒有明確為權杖設定值，Angular 會回傳權杖中指定的預設值。

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="reading-context" header="reading context values in an interceptor"></code-example>

### Context 是可變的

與 `HttpRequest` 實例的大多數其他方面不同，請求 context 是可變的，並且在請求的其他不可變轉換之間持續存在。
這讓攔截器可以透過 context 協調操作。
例如，`RetryInterceptor` 範例可以使用第二個 context 權杖，追蹤給定請求執行期間發生多少錯誤：

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="mutable-context" header="coordinating operations through the context"></code-example>

<!-- links -->

