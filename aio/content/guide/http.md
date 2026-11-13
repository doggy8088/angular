# HttpClient

大多數前端應用程式透過 HTTP 協定與後端服務通訊。
現代瀏覽器支援兩種不同的 API 來發出 HTTP 請求：`XMLHttpRequest` 介面與 `fetch()` API。

`@angular/common/http` 中的 `HttpClient` 為 Angular 應用程式提供簡化的用戶端 HTTP API，它建立在瀏覽器公開的 `XMLHttpRequest` 介面之上。
`HttpClient` 的其他優點包括可測試性功能、具型別的請求與回應物件、請求與回應攔截、`Observable` API，以及簡化的錯誤處理。

你可以執行本指南隨附的 <live-example></live-example>。

<div class="alert is-helpful">

範例應用程式不需要資料伺服器。
它依賴 [Angular *in-memory-web-api*](https://github.com/angular/in-memory-web-api/blob/master/README.md)，它會取代 *HttpClient* 模組的 `HttpBackend`。
這個替代服務模擬了類 REST 後端的行為。

查看 `AppModule` 的 *imports* 以了解它是如何設定的。

</div>

## 設定

在你能使用 `HttpClient` 之前，需要匯入 Angular 的 `HttpClientModule`。
大多數應用程式會在根 `AppModule` 中這樣做。

<code-example
  path="http/src/app/app.module.ts"
  region="sketch"
  header="app/app.module.ts (excerpt)">
</code-example>

將 `HttpClientModule` 匯入 `AppModule` 後，你可以將 `HttpClient` 注入應用程式類別，如下列 `ConfigService` 範例所示。

<code-example
  path="http/src/app/config/config.service.ts"
  region="proto"
  header="app/config/config.service.ts (excerpt)">
</code-example>

## 從伺服器請求資料

應用程式經常向伺服器請求 JSON 資料。
例如，應用程式可能需要伺服器上的一個設定檔 `config.json`，用來指定資源 URL。

<code-example
  path="http/src/assets/config.json"
  header="assets/config.json">
</code-example>

`ConfigService` 以 `HttpClient` 上的 `get()` 方法取得這個檔案。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_1"
  header="app/config/config.service.ts (getConfig v.1)">
</code-example>

元件（例如 `ConfigComponent`）會注入 `ConfigService` 並呼叫 `getConfig` 服務方法。

<code-example
  path="http/src/app/config/config.component.ts"
  region="v1"
  header="app/config/config.component.ts (showConfig v.1)">
</code-example>

因為服務方法回傳的是設定資料的 `Observable`，元件會**訂閱**該方法的回傳值。
訂閱回呼會將資料欄位複製到元件的 `config` 物件中，該物件在元件範本中進行資料繫結以供顯示。

<div class="callout is-helpful">

 <header>為什麼要寫服務？</header>

這個範例非常簡單，讓人很想把 `Http.get()` 直接寫在元件裡面，跳過服務。
然而在實務上，資料存取很少會一直這麼簡單。
你通常需要對資料進行後處理、加入錯誤處理，甚至可能需要一些重試邏輯，以應對間歇性的連線問題。

元件很快就會被資料存取的瑣事塞滿。
元件變得更難理解、更難測試，而且資料存取邏輯無法重複使用或標準化。

這就是為什麼最佳實務是將資料的呈現與資料存取分離：把資料存取封裝在獨立的服務中，並在元件中委派給該服務，即使是像這樣簡單的情況也一樣。
</div>

### 請求具型別的回應

將你的 `HttpClient` 請求組織為宣告回應物件的型別，讓輸出的使用更簡單、更明確。
指定回應型別在編譯時期相當於一個型別斷言。

若要指定回應物件型別，先定義一個具有所需屬性的介面。
（使用介面而不是類別；回應無法自動轉換為類別的實例。）

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

當你將介面作為型別參數傳給 `HttpClient.get()` 方法時，使用 RxJS `map` 運算子依 UI 的需要轉換回應資料。
接著你可以將轉換後的資料傳給 [async 管道](api/common/AsyncPipe)。

</div>

更新後元件方法中的回呼會收到具型別的資料物件，使用起來更簡單也更安全：

<code-example
  path="http/src/app/config/config.component.ts"
  region="v2"
  header="app/config/config.component.ts (showConfig v.2)">
</code-example>

<div class="alert is-important">

指定回應型別是向 TypeScript 宣告，它應該預期你的回應為給定的型別。
這是建置時期的檢查，並不保證伺服器真的會以此型別的物件回應。
伺服器有責任確保回傳伺服器 API 所指定的型別。

</div>

若要存取介面中定義的屬性，你必須明確地將從 JSON 得到的 Object 轉換為所需的回應型別。
例如，下列 `subscribe` 回呼收到作為 Object 的 `data`，然後對其進行型別轉換以存取屬性。

<code-example>
   .subscribe(data => this.config = {
    heroesUrl: (data as any).heroesUrl,
    textfile:  (data as any).textfile,
   });
</code-example>

### 讀取完整回應

回應主體不會回傳你可能需要的所有資料。
伺服器有時會回傳特殊的標頭或狀態碼，指出對應用程式工作流程很重要的某些情況。

告訴 `HttpClient` 你想要完整回應，使用 `observe` 選項：

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfigResponse">
</code-example>

現在 `HttpClient.get()` 回傳的是 `HttpResponse` 型別的 `Observable`，而不僅僅是 JSON 資料。

元件的 `showConfigResponse()` 方法會顯示回應標頭以及設定：

<code-example
  path="http/src/app/config/config.component.ts"
  region="showConfigResponse"
  header="app/config/config.component.ts (showConfigResponse)"
 >
</code-example>

如你所見，回應物件有一個型別正確的 `body` 屬性。

### 發出 JSONP 請求

當伺服器不支援 [CORS 協定](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)時，應用程式可以使用 `HttpClient` 跨網域發出 [JSONP](https://en.wikipedia.org/wiki/JSONP) 請求。

Angular 的 JSONP 請求會回傳一個 `Observable`。
遵循訂閱 observable 的模式，並使用 RxJS `map` 運算子轉換回應，再使用 [async 管道](api/common/AsyncPipe) 管理結果。

在 Angular 中，透過在 `NgModule` 匯入中包含 `HttpClientJsonpModule` 來使用 JSONP。
在下列範例中，`searchHeroes()` 方法使用 JSONP 請求，查詢名稱包含搜尋詞的英雄。

```ts
/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable {
  term = term.trim();

  let heroesURL = `${this.heroesURL}?${term}`;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', []) // then handle the error
    );
};
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

## 錯誤處理

如果請求在伺服器上失敗，或者不良的網路連線使它甚至無法抵達伺服器，會發生什麼事？
`HttpClient` 會回傳一個*錯誤*物件，而不是成功的回應。

你*可以*在元件中處理，方法是為 `.subscribe()` 加入第二個回呼：

<code-example
  path="http/src/app/config/config.component.ts"
  region="v3"
  header="app/config/config.component.ts (showConfig v.3 with error handling)"
 >
</code-example>

在資料存取失敗時給使用者某種回饋，肯定是個好主意。
但顯示 `HttpClient` 回傳的原始錯誤物件，遠非最佳做法。

{@a error-details}

### 取得錯誤詳細資訊

偵測到錯誤發生是一回事。
解讀該錯誤並撰寫使用者友善的回應，則稍微複雜一些。

可能發生兩種類型的錯誤。
伺服器後端可能拒絕請求，回傳帶有 404 或 500 等狀態碼的 HTTP 回應。
這些是錯誤*回應*。

或者用戶端可能出錯，例如網路錯誤導致請求無法成功完成，或 RxJS 運算子中拋出的例外。
這些錯誤會產生 JavaScript `ErrorEvent` 物件。

`HttpClient` 將這兩種錯誤都捕捉在其 `HttpErrorResponse` 中，你可以檢視該回應來弄清楚實際發生了什麼。

錯誤的檢視、解讀與解決，是你會想在*服務*中、而非在*元件*中進行的事。

你可能先設計出像這樣的一個錯誤處理器：

<code-example
  path="http/src/app/config/config.service.ts"
  region="handleError"
  header="app/config/config.service.ts (handleError)">
</code-example>

注意，這個處理器會回傳一個帶有使用者友善錯誤訊息的 RxJS [`ErrorObservable`](#rxjs)。
服務的使用者預期服務方法會回傳某種 `Observable`，即使是「不好的」也一樣。

現在你將 `HttpClient` 方法回傳的 `Observables` *透過管道傳給*錯誤處理器。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_3"
  header="app/config/config.service.ts (getConfig v.3 with error handler)">
</code-example>

### 重試

有時錯誤是暫時性的，只要再試一次就會自動消失。
例如，網路中斷在行動情境中很常見，再試一次可以產生成功的結果。

[RxJS 函式庫](#rxjs)提供了多個值得探索的*重試*運算子。
最簡單的稱為 `retry()`，它會自動重新訂閱失敗的 `Observable` 指定的次數。
*重新訂閱* `HttpClient` 方法呼叫的結果，其效果就是重新發出 HTTP 請求。

在錯誤處理器之前，將它*透過管道*接到 `HttpClient` 方法的結果上。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig"
  header="app/config/config.service.ts (getConfig with retry)">
</code-example>

{@a rxjs}

## Observables 與運算子

本指南先前的章節提到 RxJS `Observables` 與 `catchError`、`retry` 等運算子。
在繼續往下閱讀時，你會遇到更多 RxJS 產物。

[RxJS](http://reactivex.io/rxjs/) 是一個函式庫，用於以*函式式、反應式風格*撰寫非同步與基於回呼的程式碼。
許多 Angular API（包括 `HttpClient`）都會產生與使用 RxJS `Observables`。

RxJS 本身不在本指南的範圍內。你可以在網路上找到許多學習資源。
雖然只具備最起碼的 RxJS 知識也能應付，但為了有效使用 `HttpClient`，你會想隨著時間逐步提升你的 RxJS 技能。

如果你正在跟著這些程式碼片段操作，請注意你必須匯入片段中出現的 RxJS observable 與運算子符號。
這些 `ConfigService` 匯入是典型的寫法。

<code-example
  path="http/src/app/config/config.service.ts"
  region="rxjs-imports"
  header="app/config/config.service.ts (RxJS imports)">
</code-example>

## HTTP 標頭

許多伺服器要求儲存操作附帶額外的標頭。
例如，它們可能要求 "Content-Type" 標頭，以明確宣告請求主體的 MIME 型別；或者伺服器可能要求授權權杖。

### 新增標頭

`HeroesService` 在 `httpOptions` 物件中定義了這類標頭，並將其傳給每個 `HttpClient` 儲存方法。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="http-options"
  header="app/heroes/heroes.service.ts (httpOptions)">
</code-example>

### 更新標頭

你無法直接修改先前 options 物件中的既有標頭，因為 `HttpHeaders` 類別的實例是不可變的。

改用 `set()` 方法，它會回傳目前實例的複製件，並套用新的變更。

以下展示如何更新授權標頭（在舊權杖過期之後），再發出下一個請求。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
   region="update-headers" linenums="false">
</code-example>

## 傳送資料到伺服器

除了從伺服器取得資料外，`HttpClient` 還支援變更型請求，也就是以 PUT、POST 和 DELETE 等其他 HTTP 方法將資料傳送到伺服器。

本指南的範例應用程式包含「英雄之旅」範例的簡化版本，它會取得英雄，並讓使用者新增、刪除和更新英雄。

下列章節摘錄範例的 `HeroesService` 的方法。

### 發出 POST 請求

應用程式經常將資料以 POST 傳送到伺服器。它們在提交表單時使用 POST。
在下列範例中，`HeroesService` 在將英雄加入資料庫時進行 POST。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="addHero"
  header="app/heroes/heroes.service.ts (addHero)">
</code-example>

`HttpClient.post()` 方法與 `get()` 類似，它有一個型別參數（你預期伺服器會回傳新的英雄），並且接受一個資源 URL。

它還接受兩個參數：

1. `hero`：要在請求主體中以 POST 傳送的資料。
1. `httpOptions`：方法選項，在此例中用來[指定所需的標頭](#新增標頭)。

當然，它會以與[上文所述](#error-details)大致相同的方式捕捉錯誤。

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
僅呼叫 `HeroesService.deleteHero()` **並不會啟動 DELETE 請求。**

</div>

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-no-subscribe">
</code-example>

{@a always-subscribe}

**務必 *subscribe*。**

在你對 `HttpClient` 方法回傳的 observable 呼叫 `subscribe()` 之前，該方法不會開始它的 HTTP 請求。這對所有 `HttpClient` 方法都成立。

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

應用程式會傳送 PUT 請求，以更新後的資料完全取代一個資源。
下列 `HeroesService` 範例與 POST 範例一樣。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="updateHero"
  header="app/heroes/heroes.service.ts (updateHero)">
</code-example>

基於[上文說明](#always-subscribe)的原因，呼叫者（在此例中為 `HeroesComponent.update()`）必須對 `HttpClient.put()` 回傳的 observable 呼叫 `subscribe()`，才能啟動請求。

## 進階用法

我們已經討論了 `@angular/common/http` 的基本 HTTP 功能，但有時你需要做的不只是發出簡單的請求並取回資料。

{@a intercepting-requests-and-responses }

### HTTP 攔截器

*HTTP 攔截*是 `@angular/common/http` 的一項主要功能。
透過攔截，你可以宣告*攔截器*，檢視並轉換從你的應用程式傳到伺服器的 HTTP 請求。
相同的攔截器也可以檢視並轉換伺服器回應返回應用程式途中的內容。
多個攔截器形成一條*來回*的請求／回應處理器鏈。

攔截器可以以例行、標準的方式，為每個 HTTP 請求／回應執行各種*隱含*任務，從驗證到記錄都包括在內。

若沒有攔截，開發者就必須為每個 `HttpClient` 方法呼叫*明確地*實作這些任務。

#### 撰寫攔截器

若要實作攔截器，請宣告一個實作 `HttpInterceptor` 介面的 `intercept()` 方法的類別。

以下是一個什麼都不做的 _noop_ 攔截器，它只是讓請求原封不動地通過：

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

與 `intercept()` 一樣，`handle()` 方法將 HTTP 請求轉換為 [`HttpEvents`](#httpevents) 的 `Observable`，其最終包含伺服器的回應。
`intercept()` 方法可以檢視該 observable 並在將其回傳給呼叫者之前變更它。

這個 _no-op_ 攔截器只是以原始請求呼叫 `next.handle()`，並且什麼都不做就回傳該 observable。

#### _next_ 物件

`next` 物件代表攔截器鏈中的下一個攔截器。
鏈中的最後一個 `next` 是 `HttpClient` 後端處理器，它將請求傳送到伺服器並接收伺服器的回應。

大多數攔截器會呼叫 `next.handle()`，讓請求流經下一個攔截器，最終到達後端處理器。
攔截器*可以*跳過呼叫 `next.handle()`，使鏈短路，並以人工的伺服器回應[回傳自己的 `Observable`](#快取)。

這是 Express.js 等框架中常見的中介軟體模式。

#### 提供攔截器

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

#### 攔截器順序

Angular 會依你提供攔截器的順序套用它們。
如果你依序提供攔截器 _A_、再 _B_、再 _C_，請求會以 _A->B->C_ 的順序流動，回應則以 _C->B->A_ 的順序流出。

你之後無法變更攔截器的順序或移除攔截器。
如果你需要動態啟用和停用攔截器，就必須將該能力建置到攔截器本身之中。

#### _HttpEvents_

你可能以為 `intercept()` 與 `handle()` 方法會像大多數 `HttpClient` 方法一樣，回傳 `HttpResponse<any>` 的 observable。

但它們回傳的是 `HttpEvent<any>` 的 observable。

那是因為攔截器在比那些 `HttpClient` 方法更低的層級運作。
單一 HTTP 請求可以產生多個*事件*，包括上傳與下載進度事件。
`HttpResponse` 類別本身其實就是一個事件，其型別是 `HttpEventType.Response`。

許多攔截器只關心外送的請求，並直接回傳來自 `next.handle()` 的事件串流而不修改它。

但檢視並修改來自 `next.handle()` 回應的攔截器，會看到所有這些事件。
你的攔截器應該*原封不動地回傳每個事件*，除非它有*不得不這樣做的充分理由*。

#### 不可變性

雖然攔截器能夠修改請求與回應，但 `HttpRequest` 與 `HttpResponse` 實例屬性是 `readonly`，讓它們在很大程度上是不可變的。

它們是不可變的，理由很充分：應用程式可能在請求成功之前重試多次，這意味著攔截器鏈可以多次重新處理同一個請求。
如果攔截器可以修改原始請求物件，重試的操作就會從修改過的請求開始，而不是原始請求。
不可變性確保攔截器在每次嘗試時看到的都是同一個請求。

TypeScript 會阻止你設定 `HttpRequest` 的唯讀屬性。

```javascript
  // Typescript disallows the following assignment because req.url is readonly
  req.url = req.url.replace('http://', 'https://');
```

若要變更請求，先複製它並修改複製件，再將其傳給 `next.handle()`。
你可以一步完成複製與修改，如下列範例所示。

<code-example
  path="http/src/app/http-interceptors/ensure-https-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/ensure-https-interceptor.ts (excerpt)">
</code-example>

`clone()` 方法的雜湊引數讓你可以在複製其他內容的同時，改變請求的特定屬性。

##### 請求主體

`readonly` 指派防護無法阻止深層更新，特別是無法阻止你修改請求主體物件的屬性。

```javascript
  req.body.name = req.body.name.trim(); // bad idea!
```

如果你必須變更請求主體，先複製它，變更複製件，`clone()` 請求，並以新的主體設定複製件的主體，如下列範例所示。

<code-example
  path="http/src/app/http-interceptors/trim-name-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/trim-name-interceptor.ts (excerpt)">
</code-example>

##### 清除請求主體

有時你需要清除請求主體，而不是取代它。
如果你將複製後請求的主體設為 `undefined`，Angular 會假設你打算保留主體原樣。
但那不是你想要的。
如果你將複製後請求的主體設為 `null`，Angular 就知道你打算清除請求主體。

```javascript
  newReq = req.clone({ ... }); // body not mentioned => preserve original body
  newReq = req.clone({ body: undefined }); // preserve original body
  newReq = req.clone({ body: null }); // clear the body
```

#### 設定預設標頭

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

#### 記錄

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

#### 快取

攔截器可以自行處理請求，而不轉發給 `next.handle()`。

例如，你可能決定快取某些請求與回應以提升效能。
你可以將快取委派給攔截器，而不干擾你既有的資料服務。

`CachingInterceptor` 展示了這種做法。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="v1"
  header="app/http-interceptors/caching-interceptor.ts)">
</code-example>

`isCachable()` 函式決定請求是否可快取。
在這個範例中，只有對 npm 套件搜尋 API 的 GET 請求可快取。

如果請求不可快取，攔截器就只是將請求轉發給鏈中的下一個處理器。

如果在快取中找到可快取的請求，攔截器會回傳一個帶有快取回應的 `of()` *observable*，繞過 `next` 處理器以及下游的所有其他攔截器。

如果可快取的請求不在快取中，程式碼會呼叫 `sendRequest`。

{@a send-request}

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="send-request">
</code-example>

`sendRequest` 函式會建立一個不含標頭的[請求複製件](#不可變性)，因為 npm API 禁止標頭。

它將該請求轉發給 `next.handle()`，後者最終會呼叫伺服器並回傳伺服器的回應。

注意 `sendRequest` 如何在回應返回應用程式的途中攔截它。
它將回應透過 `tap()` 運算子傳遞，其回呼會將回應加入快取。

原始回應不受影響地沿著攔截器鏈繼續返回應用程式的呼叫者。

資料服務（如 `PackageSearchService`）並不知道它們的某些 `HttpClient` 請求實際上回傳的是快取的回應。

{@a cache-refresh}

#### 回傳多值 _Observable_

`HttpClient.get()` 方法通常回傳一個*observable*，它不是發出資料就是發出錯誤。
有些人將其描述為「*一次完成*」observable。

但攔截器可以將其改為發出不只一次的*observable*。

`CachingInterceptor` 的修訂版本會選擇性地回傳一個 observable，它立即發出快取的回應，無論如何都將請求傳送到 NPM web API，稍後再以更新後的搜尋結果再次發出。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="intercept-refresh">
</code-example>

*先快取再重新整理*選項是由**自訂的 `x-refresh` 標頭**的存在觸發的。

<div class="alert is-helpful">

`PackageSearchComponent` 上的一個核取方塊會切換 `withRefresh` 旗標，它是 `PackageSearchService.search()` 的引數之一。
該 `search()` 方法會建立自訂的 `x-refresh` 標頭，並在呼叫 `HttpClient.get()` 之前將其加入請求。

</div>

修訂後的 `CachingInterceptor` 無論是否有快取值，都會使用上述相同的 `sendRequest()` 方法建立伺服器請求。
`results$` observable 在被訂閱時發出請求。

如果沒有快取值，攔截器會回傳 `results$`。

如果有快取值，程式碼會將快取的回應*透過管道*接到 `results$` 上，產生一個重新組合的 observable，它會發出兩次回應：先是快取回應（立即發出），稍後則是來自伺服器的回應。
訂閱者會看到兩個回應的序列。

### 設定請求

外送請求的其他方面，可以透過傳給 `HttpClient` 方法作為最後一個引數的 options 物件來設定。

在[新增標頭](#新增標頭)中，`HeroesService` 透過將 options 物件（`httpOptions`）傳給其儲存方法，設定了預設標頭。
你還可以做得更多。

#### URL 查詢字串

在本節中，你將看到如何使用 `HttpParams` 類別在你的 `HttpRequest` 中加入 URL 查詢字串。

下列 `searchHeroes` 方法查詢名稱包含搜尋詞的英雄。
先匯入 `HttpParams` 類別。

<code-example hideCopy language="typescript">
import {HttpParams} from "@angular/common/http";
</code-example>

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="searchHeroes" linenums="false">
</code-example>

如果有搜尋詞，程式碼會建構一個帶有 HTML URL 編碼搜尋參數的 options 物件。
例如，如果詞是 "foo"，GET 請求 URL 就會是 `api/heroes?name=foo`。

`HttpParams` 是不可變的，所以你必須儲存 `.set()` 方法的回傳值，才能更新 options。

#### 使用 `fromString` 建立 HttpParams

你也可以使用 `fromString` 變數直接從查詢字串建立 HTTP 參數：

<code-example hideCopy language="typescript">
const params = new HttpParams({fromString: 'name=foo'});
</code-example>

### 對請求進行去抖動

此範例包含一個*npm 套件搜尋*功能。

當使用者在搜尋框中輸入名稱時，`PackageSearchComponent` 會向 NPM web API 傳送對該名稱套件的搜尋請求。

以下是範本的相關摘錄：

<code-example
  path="http/src/app/package-search/package-search.component.html"
  region="search"
  header="app/package-search/package-search.component.html (search)">
</code-example>

`keyup` 事件繫結將每次按鍵都傳送到元件的 `search()` 方法。

為每次按鍵傳送請求可能代價高昂。
最好等到使用者停止輸入後再傳送請求。
使用 RxJS 運算子很容易實現這一點，如這段摘錄所示。

<code-example
  path="http/src/app/package-search/package-search.component.ts"
  region="debounce"
  header="app/package-search/package-search.component.ts (excerpt)">
</code-example>

`searchText$` 是來自使用者的搜尋框值的序列。
它被定義為 RxJS 的 `Subject`，這意味著它是一個多播的 `Observable`，也可以透過呼叫 `next(value)` 為自己發出值，就像在 `search()` 方法中發生的那樣。

程式碼在 `ngOnInit()` 中並不將每個 `searchText` 值直接轉發給注入的 `PackageSearchService`，而是將搜尋值透過三個運算子傳遞：

1. `debounceTime(500)`：等待使用者停止輸入，在此例中為 1/2 秒。

2. `distinctUntilChanged()`：等待搜尋文字變更。

3. `switchMap()`：將搜尋請求傳送給服務。

程式碼將 `packages$` 設為這個重新組合的搜尋結果 `Observable`。
範本以 [AsyncPipe](api/common/AsyncPipe) 訂閱 `packages$`，並在搜尋結果到達時顯示它們。

搜尋值只有在它是新值且使用者已停止輸入時，才會到達服務。

<div class="alert is-helpful">

`withRefresh` 選項在[下文](#cache-refresh)有說明。

</div>

#### _switchMap()_

`switchMap()` 運算子有三個重要特性。

1. 它接受一個回傳 `Observable` 的函式引數。
`PackageSearchService.search` 會回傳一個 `Observable`，與其他資料服務方法一樣。

2. 如果先前的搜尋請求仍在*進行中*（例如網路連線不佳時），它會取消該請求並傳送新的請求。

3. 它會依原始請求順序回傳服務回應，即使伺服器以不同順序回傳它們。

<div class="alert is-helpful">

如果你認為會重複使用這套防抖動邏輯，可以考慮將它移到工具函式中，或移到 `PackageSearchService` 本身。

</div>

### 監聽進度事件

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

每個進度事件都會觸發變更偵測，因此只在你真的打算在 UI 中回報進度時才開啟它們。

當使用帶有 HTTP 方法的 [`HttpClient#request()`](api/common/http/HttpClient#request) 時，請以 [`observe: 'events'`](api/common/http/HttpClient#request) 設定，以查看所有事件，包括傳輸的進度。

</div>

接著，將這個請求物件傳給 `HttpClient.request()` 方法，它會回傳 `HttpEvents` 的 `Observable`，與攔截器處理的事件相同：

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

## 安全性：XSRF 防護

[跨站請求偽造（XSRF）](https://en.wikipedia.org/wiki/Cross-site_request_forgery)是一種攻擊技術，攻擊者可以藉此誘騙已驗證的使用者在不知情的情況下在你的網站上執行操作。
`HttpClient` 支援一種用來防止 XSRF 攻擊的[常見機制](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token)。
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
否則，Angular 的預設防護將無效。

</div>

### 設定自訂 cookie／標頭名稱

如果你的後端服務為 XSRF 權杖 cookie 或標頭使用不同的名稱，請使用 `HttpClientXsrfModule.withOptions()` 覆寫預設值。

<code-example
  path="http/src/app/app.module.ts"
  region="xsrf">
</code-example>

## 測試請求

對於任何外部相依性，你都必須模擬 HTTP 後端，讓你的測試可以模擬與遠端伺服器的互動。
`@angular/common/http/testing` 函式庫讓這類模擬的設定變得簡單直接。

Angular 的 HTTP 測試函式庫是為一種測試模式而設計的，在這種模式中，應用程式先執行程式碼並發出請求。
接著，測試預期某些請求已經或尚未發出，對那些請求執行斷言，最後透過「衝放」（flushing）每個預期請求來提供回應。

最後，測試可能會驗證應用程式沒有發出任何意料之外的請求。

<div class="alert is-helpful">

你可以在即時編碼環境中執行 <live-example stackblitz="specs">這些範例測試</live-example>。

本指南所述的測試位於 `src/testing/http-client.spec.ts`。
也有呼叫 `HttpClient` 的應用程式資料服務的測試，位於 `src/app/heroes/heroes.service.spec.ts`。

</div>

### 設定

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

此設定也會呼叫 `TestBed.get()` 注入 `HttpClient` 服務和模擬控制器，讓它們可以在測試期間被參照。

### 預期並回應請求

現在你可以撰寫一個測試，預期會發生 GET 請求，並提供模擬回應。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="get-test"
  header="app/testing/http-client.spec.ts(httpClient.get)">
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
