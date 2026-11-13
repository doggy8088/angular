# 從伺服器取得資料

在本教學中，你將在 Angular 的 `HttpClient` 協助下，加入以下資料持續性功能：

* `HeroService` 以 HTTP 請求取得英雄資料。
* 使用者可以新增、編輯與刪除英雄，並透過 HTTP 儲存這些變更。
* 使用者可以依名稱搜尋英雄。

<div class="alert is-helpful">

  關於本頁所述的範例應用程式，請參閱 <live-example></live-example>。

</div>

## 啟用 HTTP 服務

`HttpClient` 是 Angular 透過 HTTP 與遠端伺服器通訊的機制。

請分兩個步驟，讓 `HttpClient` 在應用程式中隨處可用。首先，透過匯入把它加入根模組 `AppModule`：

<code-example path="toh-pt6/src/app/app.module.ts" region="import-http-client" header="src/app/app.module.ts (HttpClientModule import)">
</code-example>

接著，仍在 `AppModule` 中，把 `HttpClientModule` 加入 `imports` 陣列：

<code-example path="toh-pt6/src/app/app.module.ts" region="import-httpclientmodule" header="src/app/app.module.ts (imports array excerpt)">
</code-example>


## 模擬資料伺服器

本教學範例會使用
[In-memory Web API](https://github.com/angular/angular/tree/master/packages/misc/angular-in-memory-web-api "In-memory Web API") 模組，來模擬與遠端資料伺服器的通訊。

安裝此模組後，應用程式會向 `HttpClient` 發出請求並接收回應，
而不知道 *In-memory Web API* 正在攔截這些請求，
把它們套用到記憶體內資料儲存區，並回傳模擬的回應。

使用 In-memory Web API，你就不必為了學習 `HttpClient` 而架設伺服器。

<div class="alert is-important">

**重點：** In-memory Web API 模組與 Angular 中的 HTTP 無關。

如果你閱讀本教學是為了學習 `HttpClient`，可以[跳過](#import-heroes)這個步驟。
如果你是跟著本教學一起寫程式，請留在這裡，現在就加入 In-memory Web API。

</div>

請使用以下命令，從 npm 安裝 In-memory Web API 套件：

<code-example language="sh">
  npm install angular-in-memory-web-api --save
</code-example>

在 `AppModule` 中，匯入 `HttpClientInMemoryWebApiModule` 與 `InMemoryDataService` 類別，
你稍後就會建立它。

<code-example path="toh-pt6/src/app/app.module.ts" region="import-in-mem-stuff" header="src/app/app.module.ts (In-memory Web API imports)">
</code-example>

在 `HttpClientModule` 之後，把 `HttpClientInMemoryWebApiModule`
加入 `AppModule` 的 `imports` 陣列，並以 `InMemoryDataService` 設定它。

<code-example path="toh-pt6/src/app/app.module.ts" header="src/app/app.module.ts (imports array excerpt)" region="in-mem-web-api-imports">
</code-example>

`forRoot()` 設定方法會接受一個 `InMemoryDataService` 類別，
為記憶體內資料庫預先填入資料。

請使用以下命令，產生 `src/app/in-memory-data.service.ts` 類別：

<code-example language="sh">
  ng generate service InMemoryData
</code-example>

請以下列內容取代 `in-memory-data.service.ts` 的預設內容：

<code-example path="toh-pt6/src/app/in-memory-data.service.ts" region="init" header="src/app/in-memory-data.service.ts"></code-example>

`in-memory-data.service.ts` 檔案將接手 `mock-heroes.ts` 的功能。
不過，請先不要刪除 `mock-heroes.ts`，在本教學接下來的幾個步驟中你還會用到它。

伺服器就緒後，你將分離 In-memory Web API，應用程式的請求將直接傳送到伺服器。


{@a import-heroes}
## 英雄與 HTTP

在 `HeroService` 中，匯入 `HttpClient` 與 `HttpHeaders`：

<code-example path="toh-pt6/src/app/hero.service.ts" region="import-httpclient" header="src/app/hero.service.ts (import HTTP symbols)">
</code-example>

仍在 `HeroService` 中，把 `HttpClient` 注入建構子，成為名為 `http` 的私有屬性。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="ctor" >
</code-example>

請注意，你仍會繼續注入 `MessageService`，但由於你會頻繁地呼叫它，請把它包裝在一個私有的 `log()` 方法中：

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="log" >
</code-example>

請以 `:base/:collectionName` 的形式定義 `heroesUrl`，指向伺服器上英雄資源的位址。
 這裡的 `base` 是發出請求的資源，
 而 `collectionName` 是 `in-memory-data-service.ts` 中的英雄資料物件。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="heroesUrl" >
</code-example>

### 使用 `HttpClient` 取得英雄

目前的 `HeroService.getHeroes()`
使用 RxJS 的 `of()` 函式，以 `Observable<Hero[]>` 的形式回傳模擬英雄陣列。

<code-example path="toh-pt4/src/app/hero.service.ts" region="getHeroes-1" header="src/app/hero.service.ts (getHeroes with RxJs 'of()')">
</code-example>

請如下所示，把該方法改為使用 `HttpClient`：

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes-1">
</code-example>

重新整理瀏覽器，英雄資料應能成功從
模擬伺服器載入。

你已把 `of()` 換成 `http.get()`，應用程式不需其他變更就能繼續運作，
因為這兩個函式都會回傳 `Observable<Hero[]>`。

### `HttpClient` 方法只回傳一個值

所有 `HttpClient` 方法都會回傳某種 RxJS `Observable`。

HTTP 是請求／回應協定。
你發出一個請求，它會回傳單一回應。

一般來說，可觀察物件_可以_隨著時間回傳多個值。
來自 `HttpClient` 的可觀察物件則永遠只發出單一值，然後就完成，不會再發出。

這次對 `HttpClient.get()` 的特定呼叫會回傳 `Observable<Hero[]>`，也就是「_英雄陣列的可觀察物件_」。實際上，它只會回傳單一英雄陣列。

### `HttpClient.get()` 回傳回應資料

`HttpClient.get()` 預設會以未定型別的 JSON 物件形式回傳回應主體。
套用選用的型別指定子 `<Hero[]>`，可以加入 TypeScript 功能，減少編譯時期的錯誤。

伺服器的資料 API 會決定 JSON 資料的形狀。
_Tour of Heroes_ 資料 API 會以陣列形式回傳英雄資料。

<div class="alert is-helpful">

其他 API 可能會把你要的資料埋在物件之中。
你可能需要使用 RxJS 的 `map()` 運算子來處理 `Observable` 的結果，才能把該資料挖出來。

雖然這裡不討論，但範例原始碼中包含的 `getHeroNo404()` 方法就有一個 `map()` 的範例。

</div>

### 錯誤處理

事情總會出錯，尤其是在你從遠端伺服器取得資料的時候。
`HeroService.getHeroes()` 方法應該捕捉錯誤並做出適當的處理。

若要捕捉錯誤，請把 `http.get()` 回傳的可觀察結果**以管道方式傳送**，經過 RxJS `catchError()` 運算子。

請從 `rxjs/operators` 匯入 `catchError` 符號，以及稍後會用到的其他運算子。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="import-rxjs-operators">
</code-example>

現在請使用 `pipe()` 方法擴充可觀察結果，並
給它一個 `catchError()` 運算子。

<code-example path="toh-pt6/src/app/hero.service.ts" region="getHeroes-2" header="src/app/hero.service.ts">
</code-example>

`catchError()` 運算子會攔截**失敗的 `Observable`**。
該運算子接著會把錯誤傳給錯誤處理函式。

以下 `handleError()` 方法會回報錯誤，然後回傳一個
無害的結果，讓應用程式繼續運作。

#### `handleError`

以下 `handleError()` 將由許多 `HeroService` 方法共用，
因此已通用化，以滿足它們不同的需求。

它不是直接處理錯誤，而是回傳一個錯誤處理函式給 `catchError`，該函式
已同時以失敗操作的名稱與安全的回傳值設定好。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="handleError">
</code-example>

在把錯誤回報到主控台之後，處理常式會建立
一個友善的訊息，並把安全值回傳給應用程式，讓應用程式可以繼續運作。

因為每個服務方法都會回傳不同種類的 `Observable` 結果，
`handleError()` 會接受一個型別參數，以便把安全值以應用程式預期的型別回傳。

### 接入 Observable

`HeroService` 的方法將**接入**可觀察值的流程，
並使用 `log()` 方法，把訊息傳送到頁面底部的訊息區域。

它們透過 RxJS 的 `tap()` 運算子來做到這一點，
該運算子會查看可觀察值、對這些值做一些事，
再把它們傳遞下去。
`tap()` 回呼不會碰觸這些值本身。

以下是包含記錄操作的 `tap()` 的 `getHeroes()` 最終版本。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts"  region="getHeroes" >
</code-example>

### 依 id 取得英雄

大多數 Web API 都支援 `:baseURL/:id` 形式的_依 id 取得_請求。

在這裡，_基本 URL_ 是[英雄與 HTTP](tutorial/toh-pt6#英雄與-http)一節中定義的 `heroesURL`（`api/heroes`），而 _id_ 是
你要取得的英雄編號。例如 `api/heroes/11`。

請以下列內容更新 `HeroService` 的 `getHero()` 方法，以發出該請求：

<code-example path="toh-pt6/src/app/hero.service.ts" region="getHero" header="src/app/hero.service.ts"></code-example>

getHero() 與 `getHeroes()` 有三個顯著差異：

* `getHero()` 會以所需英雄的 id 建立請求 URL。
* 伺服器應回應單一英雄，而不是英雄陣列。
* `getHero()` 會回傳 `Observable<Hero>`（「_Hero 物件的可觀察物件_」），
 而不是英雄_陣列_的可觀察物件。

## 更新英雄

在英雄詳細檢視中編輯英雄名稱。
當你輸入時，英雄名稱會更新頁面頂部的標題。
但當你點選「返回按鈕」時，你的變更就會遺失。

如果你希望變更能保留下來，必須把它們寫回
伺服器。

在英雄詳細範本的結尾，加入一個儲存按鈕，帶有 `click` 事件
繫結，會呼叫一個名為 `save()` 的新元件方法。

<code-example path="toh-pt6/src/app/hero-detail/hero-detail.component.html" region="save" header="src/app/hero-detail/hero-detail.component.html (save)"></code-example>

在 `HeroDetail` 元件類別中，加入以下 `save()` 方法，它會使用英雄服務
的 `updateHero()` 方法來持續保存英雄名稱的變更，然後導覽回上一個檢視。

<code-example path="toh-pt6/src/app/hero-detail/hero-detail.component.ts" region="save" header="src/app/hero-detail/hero-detail.component.ts (save)"></code-example>

#### 加入 `HeroService.updateHero()`

`updateHero()` 方法的整體結構與
`getHeroes()` 類似，但它使用 `http.put()` 把變更後的英雄
持續保存到伺服器。請把以下內容加入 `HeroService`。

<code-example path="toh-pt6/src/app/hero.service.ts" region="updateHero" header="src/app/hero.service.ts (update)">
</code-example>

`HttpClient.put()` 方法接受三個參數：
* URL
* 要更新的資料（本例中為修改後的英雄）
* 選項

URL 不變。英雄 Web API 會查看英雄的 `id`，就知道要更新哪一位英雄。

英雄 Web API 會在 HTTP 儲存請求中預期一個特殊的標頭。
該標頭位於 `HeroService` 中定義的 `httpOptions` 常數。請把以下內容加入 `HeroService` 類別。

<code-example path="toh-pt6/src/app/hero.service.ts" region="http-options" header="src/app/hero.service.ts">
</code-example>

重新整理瀏覽器，變更英雄名稱並儲存你的變更。`save()`
方法會在 `HeroDetailComponent` 中導覽到上一個檢視。
該英雄現在會以變更後的名稱出現在清單中。


## 加入新英雄

若要加入英雄，此應用程式只需要英雄的名稱。你可以使用一個 `<input>`
元素搭配一個加入按鈕。

請在標題之後，把以下內容插入 `HeroesComponent` 範本：

<code-example path="toh-pt6/src/app/heroes/heroes.component.html" region="add" header="src/app/heroes/heroes.component.html (add)"></code-example>

為了回應點選事件，請呼叫元件的點選處理常式 `add()`，然後
清除輸入欄位，以便輸入下一個名稱。請把以下內容加入
`HeroesComponent` 類別：

<code-example path="toh-pt6/src/app/heroes/heroes.component.ts" region="add" header="src/app/heroes/heroes.component.ts (add)"></code-example>

當給定的名稱不是空白時，處理常式會根據名稱建立一個類似 `Hero` 的物件
（它只缺少 `id`），並把它傳給服務的 `addHero()` 方法。

當 `addHero()` 儲存成功時，`subscribe()` 回呼
會接收新英雄，並把它推入 `heroes` 清單以供顯示。

請把以下 `addHero()` 方法加入 `HeroService` 類別。

<code-example path="toh-pt6/src/app/hero.service.ts" region="addHero" header="src/app/hero.service.ts (addHero)"></code-example>

`addHero()` 與 `updateHero()` 有兩個不同之處：

* 它呼叫 `HttpClient.post()`，而不是 `put()`。
* 它預期伺服器會為新英雄產生一個 id，
並在 `Observable<Hero>` 中回傳給呼叫者。

重新整理瀏覽器並加入一些英雄。

## 刪除英雄

英雄清單中的每位英雄都應該有一個刪除按鈕。

請在重複的 `<li>` 元素中、英雄名稱之後，把以下按鈕元素加入 `HeroesComponent` 範本。

<code-example path="toh-pt6/src/app/heroes/heroes.component.html" header="src/app/heroes/heroes.component.html" region="delete"></code-example>

英雄清單的 HTML 應如下所示：

<code-example path="toh-pt6/src/app/heroes/heroes.component.html" region="list" header="src/app/heroes/heroes.component.html (list of heroes)"></code-example>

若要把刪除按鈕放在英雄項目的最右側，
請把一些 CSS 加入 `heroes.component.css`。你可以在
下方的[最終檢閱程式碼](#heroescomponent)中找到該 CSS。

請在元件類別中加入 `delete()` 處理常式。

<code-example path="toh-pt6/src/app/heroes/heroes.component.ts" region="delete" header="src/app/heroes/heroes.component.ts (delete)"></code-example>

雖然元件把英雄刪除委派給 `HeroService`，
但它仍須負責更新自己的英雄清單。
元件的 `delete()` 方法會立即從該清單中移除_要刪除的英雄_，
因為它預期 `HeroService` 會在伺服器上成功執行。

雖然元件對於 `heroService.delete()` 回傳的 `Observable` 幾乎無事可做，
**但無論如何都必須訂閱**。

<div class="alert is-important">

  如果你疏忽了呼叫 `subscribe()`，服務就不會把刪除請求傳送到伺服器。
  一般來說，`Observable` _在有東西訂閱之前_不會有任何動作。

  請你自己確認這一點：暫時移除 `subscribe()`，
  點選「Dashboard」，再點選「Heroes」。
  你會再次看到完整的英雄清單。

</div>

接著，請像這樣在 `HeroService` 中加入 `deleteHero()` 方法。

<code-example path="toh-pt6/src/app/hero.service.ts" region="deleteHero" header="src/app/hero.service.ts (delete)"></code-example>

請注意以下重點：

* `deleteHero()` 會呼叫 `HttpClient.delete()`。
* URL 是英雄資源 URL 加上要刪除英雄的 `id`。
* 你不會像使用 `put()` 與 `post()` 時那樣傳送資料。
* 你仍會傳送 `httpOptions`。

重新整理瀏覽器，試試新的刪除功能。

## 依名稱搜尋

在最後一個練習中，你會學習如何把 `Observable` 運算子串連起來，
以盡量減少類似 HTTP 請求的數量，
經濟地使用網路頻寬。

你將在儀表板中加入英雄搜尋功能。
當使用者在搜尋框中輸入名稱時，
你會針對依該名稱篩選的英雄重複發出 HTTP 請求。
你的目標是只發出必要數量的請求。

#### `HeroService.searchHeroes()`

首先，請在 `HeroService` 中加入 `searchHeroes()` 方法。

<code-example path="toh-pt6/src/app/hero.service.ts" region="searchHeroes" header="src/app/hero.service.ts">
</code-example>

如果沒有搜尋字詞，此方法會立即回傳一個空陣列。
其餘部分與 `getHeroes()` 非常相似，唯一的顯著差異是
URL，其中包含帶有搜尋字詞的查詢字串。

### 在儀表板中加入搜尋

開啟 `DashboardComponent` 範本，並
在標記底部加入英雄搜尋元素 `<app-hero-search>`。

<code-example path="toh-pt6/src/app/dashboard/dashboard.component.html" header="src/app/dashboard/dashboard.component.html"></code-example>

此範本與 `HeroesComponent` 範本中的 `*ngFor` 重複器非常相似。

若要讓它運作，下一步是加入一個選取器符合 `<app-hero-search>` 的元件。


### 建立 `HeroSearchComponent`

使用 CLI 建立 `HeroSearchComponent`。

<code-example language="sh">
  ng generate component hero-search
</code-example>

CLI 會產生三個 `HeroSearchComponent` 檔案，並把該元件加入 `AppModule` 的宣告。

請如下所示，把產生的 `HeroSearchComponent` 範本取代為一個 `<input>` 與一份符合的搜尋結果清單。

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.html" header="src/app/hero-search/hero-search.component.html"></code-example>

請把下方[最終程式碼檢閱](#herosearchcomponent)中列出的私有 CSS 樣式加入 `hero-search.component.css`。

當使用者在搜尋框中輸入時，輸入事件繫結會以新的搜尋框值呼叫元件的 `search()` 方法。

{@a asyncpipe}

### `AsyncPipe`

`*ngFor` 會重複英雄物件。請注意，`*ngFor` 是迭代一個名為 `heroes$` 的清單，而不是 `heroes`。`$` 是一種慣例，表示 `heroes$` 是 `Observable`，而不是陣列。


<code-example path="toh-pt6/src/app/hero-search/hero-search.component.html" header="src/app/hero-search/hero-search.component.html" region="async"></code-example>

由於 `*ngFor` 無法對 `Observable` 做任何事，請使用
管道字元（`|`），後面接上 `async`。這會識別 Angular 的 `AsyncPipe`，並自動訂閱 `Observable`，因此你不必
在元件類別中自行訂閱。

### 編輯 `HeroSearchComponent` 類別

請如下所示，取代產生的 `HeroSearchComponent` 類別與中繼資料。

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts"></code-example>

請注意 `heroes$` 宣告為 `Observable`：

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts" region="heroes-stream">
</code-example>

你將在 [`ngOnInit()`](#search-pipe) 中設定它。
在此之前，請先關注 `searchTerms` 的定義。

### `searchTerms` RxJS 主體

`searchTerms` 屬性是一個 RxJS `Subject`。

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts" region="searchTerms"></code-example>

`Subject` 既是可觀察值的來源，本身也是 `Observable`。
你可以像訂閱任何 `Observable` 一樣訂閱 `Subject`。

你也可以像 `search()` 方法那樣，呼叫它的 `next(value)` 方法，把值推入該 `Observable`。

繫結到文字框 `input` 事件的事件繫結會呼叫 `search()` 方法。

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.html" header="src/app/hero-search/hero-search.component.html" region="input"></code-example>

每當使用者在文字框中輸入，繫結就會以文字框的值（一個「搜尋字詞」）呼叫 `search()`。
`searchTerms` 會成為一個發出穩定搜尋字詞串流的 `Observable`。

{@a search-pipe}

### 串連 RxJS 運算子

在每次使用者按鍵後，直接把新的搜尋字詞傳給 `searchHeroes()`，會產生過多的 HTTP 請求，
耗費伺服器資源，也會燒掉數據流量方案。

相反地，`ngOnInit()` 方法會把 `searchTerms` 可觀察物件透過一系列 RxJS 運算子傳送，以減少對 `searchHeroes()` 的呼叫次數，
最終回傳一個及時的英雄搜尋結果可觀察物件（每個結果都是一個 `Hero[]`）。

以下是對程式碼的進一步說明。

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts" region="search">
</code-example>

每個運算子的運作方式如下：

* `debounceTime(300)` 會等到新字串事件的流程暫停 300 毫秒後，才傳遞最新的字串。你發出請求的頻率永遠不會高於每 300 毫秒一次。

* `distinctUntilChanged()` 會確保只有在篩選文字變更時才傳送請求。

* `switchMap()` 會針對每個通過 `debounce()` 與 `distinctUntilChanged()` 的搜尋字詞呼叫搜尋服務。
它會取消並捨棄先前的搜尋可觀察物件，只回傳最新的搜尋服務可觀察物件。


<div class="alert is-helpful">

  使用 [switchMap 運算子](https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)時，
  每個符合條件的按鍵事件都可能觸發一次 `HttpClient.get()` 方法呼叫。
  即使每次請求之間有 300 毫秒的暫停，你仍可能有許多進行中的 HTTP 請求，
  而且它們回傳的順序可能與傳送順序不同。

  `switchMap()` 會保留原始請求的順序，同時只回傳最近一次 HTTP 方法呼叫的可觀察物件。
  先前呼叫的結果會被取消並捨棄。

  請注意，取消先前的 `searchHeroes()` Observable
  並不會真的中止待處理的 HTTP 請求。
  不需要的結果會在到達你的應用程式程式碼之前被捨棄。

</div>

請記住，元件_類別_不會訂閱 `heroes$` 這個_可觀察物件_。
那是範本中 [`AsyncPipe`](#asyncpipe) 的工作。

#### 試試看

再次執行應用程式。在 *Dashboard* 中，於搜尋框輸入一些文字。
如果你輸入與任何現有英雄名稱相符的字元，你會看到類似以下的畫面。

<div class="lightbox">
  <img src='generated/images/guide/toh/toh-hero-search.gif' alt="英雄搜尋欄位，輸入字母 'm' 與 'a'，並在搜尋輸入框下方的清單中顯示四個符合查詢的搜尋結果">
</div>

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案（全部都在 `src/app/` 資料夾中）。

{@a heroservice}
{@a inmemorydataservice}
{@a appmodule}
#### `HeroService`、`InMemoryDataService`、`AppModule`

<code-tabs>
  <code-pane
    header="hero.service.ts"
    path="toh-pt6/src/app/hero.service.ts">
  </code-pane>
  <code-pane
    header="in-memory-data.service.ts"
    path="toh-pt6/src/app/in-memory-data.service.ts">
  </code-pane>
  <code-pane
    header="app.module.ts"
    path="toh-pt6/src/app/app.module.ts">
  </code-pane>
</code-tabs>

{@a heroescomponent}
#### `HeroesComponent`

<code-tabs>
  <code-pane
    header="heroes/heroes.component.html"
    path="toh-pt6/src/app/heroes/heroes.component.html">
  </code-pane>
  <code-pane
    header="heroes/heroes.component.ts"
    path="toh-pt6/src/app/heroes/heroes.component.ts">
  </code-pane>
  <code-pane
    header="heroes/heroes.component.css"
    path="toh-pt6/src/app/heroes/heroes.component.css">
  </code-pane>
</code-tabs>

{@a herodetailcomponent}
#### `HeroDetailComponent`

<code-tabs>
  <code-pane
    header="hero-detail/hero-detail.component.html"
    path="toh-pt6/src/app/hero-detail/hero-detail.component.html">
  </code-pane>
  <code-pane
    header="hero-detail/hero-detail.component.ts"
    path="toh-pt6/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>
</code-tabs>

{@a dashboardcomponent}
#### `DashboardComponent`

<code-tabs>
  <code-pane
    header="src/app/dashboard/dashboard.component.html"
    path="toh-pt6/src/app/dashboard/dashboard.component.html">
  </code-pane>
</code-tabs>

{@a herosearchcomponent}
#### `HeroSearchComponent`

<code-tabs>
  <code-pane
    header="hero-search/hero-search.component.html"
    path="toh-pt6/src/app/hero-search/hero-search.component.html">
  </code-pane>
  <code-pane
    header="hero-search/hero-search.component.ts"
    path="toh-pt6/src/app/hero-search/hero-search.component.ts">
  </code-pane>
  <code-pane
    header="hero-search/hero-search.component.css"
    path="toh-pt6/src/app/hero-search/hero-search.component.css">
  </code-pane>
</code-tabs>

## 摘要

你已經走到旅程的終點，而且完成了很多事。
* 你加入了在應用程式中使用 HTTP 所需的依賴。
* 你重構了 `HeroService`，改為從 Web API 載入英雄。
* 你擴充了 `HeroService`，支援 `post()`、`put()` 與 `delete()` 方法。
* 你更新了元件，允許新增、編輯與刪除英雄。
* 你設定了一個記憶體內 Web API。
* 你學會了如何使用可觀察物件。

至此，「Tour of Heroes」教學告一段落。
你已經準備好在基礎章節中進一步學習 Angular 開發，
首先從[架構](guide/architecture "Architecture")指南開始。
