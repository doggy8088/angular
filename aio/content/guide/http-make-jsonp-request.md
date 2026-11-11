# HTTP：發出 JSONP 請求

「JSON with Padding」（JSONP）是一種欺騙網頁瀏覽器執行請求的方法：它使用 `<script>` 標籤，並利用 SRC 屬性發出特殊的 API 請求。

當伺服器不支援 [CORS 協定](https://developer.mozilla.org/docs/Web/HTTP/CORS)時，應用程式可以使用 `HttpClient` 跨網域發出 [JSONP](https://en.wikipedia.org/wiki/JSONP) 請求。

Angular 的 JSONP 請求會回傳一個 `Observable`。
請依循訂閱 observable 的模式，並使用 RxJS 的 `map` 運算子轉換回應，再使用 [async 管道](api/common/AsyncPipe)來管理結果。

在 Angular 中使用 JSONP 的方式，是將 `HttpClientJsonpModule` 加入 `NgModule` 的 imports。
在下列範例中，`searchHeroes()` 方法使用 JSONP 請求，查詢名稱包含搜尋字詞的英雄。

<code-example format="typescript" language="typescript">

/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable {
  term = term.trim();

  const heroesURL = `&dollar;{this.heroesURL}?&dollar;{term}`;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', [])) // then handle the error
    );
}

</code-example>

這個請求將 `heroesURL` 作為第一個參數，並將回呼函式名稱作為第二個參數傳入。
回應會包裝在回呼函式中，該函式接收 JSONP 方法回傳的 observable，並將它們透過管道傳給錯誤處理常式。

## 請求非 JSON 資料

並非所有 API 都會回傳 JSON 資料。
在接下來的範例中，`DownloaderService` 的方法會從伺服器讀取文字檔並記錄檔案內容，再將這些內容以 `Observable<string>` 的形式回傳給呼叫者。

<code-example header="app/downloader/downloader.service.ts (getTextFile)" linenums="false" path="http/src/app/downloader/downloader.service.ts" region="getTextFile"></code-example>

由於 `responseType` 選項，`HttpClient.get()` 回傳的是字串而非預設的 JSON。

RxJS 的 `tap` 運算子讓程式碼可以檢查通過 observable 的成功值與錯誤值，而不干擾它們。

`DownloaderComponent` 中的 `download()` 方法會訂閱服務方法，藉此發起請求。

<code-example header="app/downloader/downloader.component.ts (download)" linenums="false" path="http/src/app/downloader/downloader.component.ts" region="download"></code-example>

<a id="error-handling"></a>

@reviewed 2022-11-03
