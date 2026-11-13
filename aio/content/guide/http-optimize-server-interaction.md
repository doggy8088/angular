# HTTP - 使用防抖動最佳化伺服器互動

如果你需要根據使用者輸入發出 HTTP 請求，每次按鍵都送出一個請求並沒有效率。比較好的做法是等使用者停止輸入後再送出請求。這種技巧稱為防抖動（debouncing）。

## 實作防抖動

請看下列範本，它讓使用者輸入搜尋字詞，依名稱尋找套件。當使用者在搜尋框中輸入名稱時，`PackageSearchComponent` 會向套件搜尋 API 送出一個搜尋該名稱套件的請求。

<code-example header="app/package-search/package-search.component.html (search)" path="http/src/app/package-search/package-search.component.html" region="search"></code-example>

在這裡，`keyup` 事件綁定會把每次按鍵都送到元件的 `search()` 方法。

<div class="alert is-helpful">

在範本中，`$event.target` 的型別只有 `EventTarget`。
在 `getValue()` 方法中，目標會被轉型為 `HTMLInputElement`，以便以型別安全的方式存取其 `value` 屬性。

<code-example path="http/src/app/package-search/package-search.component.ts" region="getValue"></code-example>

</div>

下列程式碼片段使用 RxJS 運算子為這個輸入實作防抖動。

<code-example header="app/package-search/package-search.component.ts (excerpt)" path="http/src/app/package-search/package-search.component.ts" region="debounce"></code-example>

`searchText$` 是來自使用者的搜尋框值序列。它被定義為一個 RxJS `Subject`，也就是一個多播的 `Observable`，也可以像 `search()` 方法中所做的那樣，透過呼叫 `next(value)` 自行發出值。

程式碼不會把每個 `searchText` 值直接轉送給注入的 `PackageSearchService`，而是讓 `ngOnInit()` 中的程式碼把搜尋值透過三個運算子傳遞，只有在該值是新值、且使用者已停止輸入時，搜尋值才會到達服務。

| RxJS 運算子 | 詳細說明 |
|:---                      |:---     |
| `debounceTime(500)`⁠ | 等使用者停止輸入，在此例中是 1/2 秒。 |
| `distinctUntilChanged()` | 等到搜尋文字改變為止。 |
| `switchMap()`⁠ | 將搜尋請求送到服務。 |

程式碼將 `packages$` 設定為這個重新組合而成的搜尋結果 `Observable`。範本使用 [AsyncPipe](api/common/AsyncPipe) 訂閱 `packages$`，並在搜尋結果到達時顯示它們。

<div class="alert is-helpful">

如需進一步了解 `withRefresh` 選項，請見[使用攔截器請求多個值](guide/http-interceptor-use-cases#cache-refresh)。

</div>

## 使用 `switchMap()` 運算子

`switchMap()` 運算子接受一個回傳 `Observable` 的函式引數。在這個範例中，`PackageSearchService.search` 會回傳一個 `Observable`，如同其他資料服務方法一樣。如果先前的搜尋請求仍在進行中，例如網路連線不佳時，該運算子會取消該請求並送出一個新的請求。

<div class="alert is-helpful">

**注意**：<br />
即使伺服器回傳的順序不同，`switchMap()` 仍會以原始請求順序回傳服務回應。

</div>

<div class="alert is-helpful">

如果你認為會重複使用這個防抖動邏輯，請考慮將它移到一個工具函式中，或移到 `PackageSearchService` 本身。

</div>

@reviewed 2023-02-27
