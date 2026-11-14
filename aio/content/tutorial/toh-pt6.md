# HTTP

在本頁中，你將進行以下改進。

* 從伺服器取得英雄資料。
* 讓使用者新增、編輯與刪除英雄名稱。
* 把變更儲存到伺服器。

你將教應用程式對遠端伺服器的 Web API 發出對應的 HTTP 呼叫。

完成本頁後，應用程式應該像這樣 <live-example></live-example>。

## 上次離開的地方

在[上一頁](tutorial/toh-pt5)中，你學會了在儀表板與固定的英雄清單之間導覽，
並在過程中編輯所選的英雄。
這就是本頁的起點。

## 讓應用程式持續轉譯並執行
在終端機視窗中輸入以下指令：

<code-example language="sh" class="code-shell">
  npm start
</code-example>

此指令會以「監看模式」執行 TypeScript 編譯器，在程式碼變更時自動重新編譯。
此指令同時會在瀏覽器中啟動應用程式，並在程式碼變更時重新整理瀏覽器。

你可以持續建置 Tour of Heroes，不必停下來重新編譯或重新整理瀏覽器。

## 提供 HTTP 服務

`HttpModule` 不是核心 NgModule。
`HttpModule` 是 Angular 選用的 Web 存取方式。它以名為 `@angular/http` 的獨立附加模組形式存在，
並作為 Angular npm 套件的一部分，以獨立的指令碼檔案形式提供。

你已經可以從 `@angular/http` 匯入，因為 `systemjs.config` 已設定 *SystemJS* 在你需要時載入該函式庫。

## 註冊 HTTP 服務

應用程式將依賴 Angular 的 `http` 服務，而該服務本身又依賴其他支援服務。
來自 `@angular/http` 函式庫的 `HttpModule` 包含一整套 HTTP 服務的提供者。

若要讓應用程式中的任何地方都能存取這些服務，
請把 `HttpModule` 加入 `AppModule` 的 `imports` 清單。

<code-example path="toh-pt6/src/app/app.module.ts" region="v1" title="src/app/app.module.ts (v1)"></code-example>

請注意，你同時也把 `HttpModule` 作為根 NgModule `AppModule` 中 *imports* 陣列的一部分提供。

## 模擬 Web API

我們建議在根
`AppModule` 的 *providers* 中註冊全應用程式範圍的服務。

在你擁有能處理英雄資料請求的 Web 伺服器之前，
HTTP 用戶端會從模擬服務擷取與儲存資料，
該服務即*記憶體內 Web API*。

請以使用模擬服務的這個版本更新 <code>src/app/app.module.ts</code>：

<code-example path="toh-pt6/src/app/app.module.ts" region="v2" title="src/app/app.module.ts (v2)"></code-example>

此範例不需要真正的 API 伺服器，而是透過加入
<a href="https://github.com/angular/in-memory-web-api" title="In-memory Web API">InMemoryWebApiModule</a>
到模組的 `imports`，來模擬與遠端伺服器的通訊，實際上是把 `Http` 用戶端的 XHR 後端服務換成記憶體內的替代方案。

<code-example path="toh-pt6/src/app/app.module.ts" region="in-mem-web-api"></code-example>

`forRoot()` 設定方法會接受一個 `InMemoryDataService` 類別，
為記憶體內資料庫預先填入資料。
在 `app` 中加入檔案 `in-memory-data.service.ts`，內容如下：

<code-example path="toh-pt6/src/app/in-memory-data.service.ts" region="init" title="src/app/in-memory-data.service.ts" linenums="false"></code-example>

此檔案取代了 `mock-heroes.ts`，現在可以安全地刪除它。
加入了英雄「Zero」，以確認資料服務能處理 `id==0` 的英雄。


<div class="alert is-helpful">

  記憶體內 Web API 只在開發初期以及像 Tour of Heroes 這樣的示範中才有用。
  不必擔心這個後端替代方案的細節；當你有了真正的 Web API 伺服器時，
  就可以跳過它。

</div>

## 英雄與 HTTP

在目前的 `HeroService` 實作中，會回傳一個以模擬英雄解析完成的 Promise。

<code-example path="toh-pt4/src/app/hero.service.ts" region="get-heroes" title="src/app/hero.service.ts (old getHeroes)"></code-example>

這樣實作是為了預先因應最終
以 HTTP 用戶端擷取英雄的需求，而這必須是非同步操作。

現在把 `getHeroes()` 改為使用 HTTP。

<code-example path="toh-pt6/src/app/hero.service.ts" region="getHeroes" title="src/app/hero.service.ts (updated getHeroes and new class members)"></code-example>

如下更新匯入陳述式：

<code-example path="toh-pt6/src/app/hero.service.ts" region="imports" title="src/app/hero.service.ts (updated imports)"></code-example>

重新整理瀏覽器。英雄資料應能成功從
模擬伺服器載入。

{@a http-promise}

### HTTP 的 Promise

Angular 的 `http.get` 會回傳 RxJS 的 `Observable`。
*Observables* 是管理非同步資料流的強大方式。
你將在本頁稍後讀到關於 [Observables](tutorial/toh-pt6#可觀察物件) 的內容。

目前，你已使用 `toPromise` 運算子把 `Observable` 轉換為 `Promise`。

<code-example path="toh-pt6/src/app/hero.service.ts" region="to-promise"></code-example>

Angular 的 `Observable` 並未內建 `toPromise` 運算子。

有許多像 `toPromise` 這樣的運算子，能以實用的能力擴充 `Observable`。
若要使用這些能力，你必須加入運算子本身。
這就像從 RxJS 函式庫匯入它們一樣簡單，如下所示：

<code-example path="toh-pt6/src/app/hero.service.ts" region="rxjs"></code-example>


<div class="l-sub-section">

  你將加入更多運算子，並了解為何必須這麼做，詳見[本教學稍後的部分](tutorial/toh-pt6#rxjs-imports)。

</div>


### 在 *then* 回呼中擷取資料

在 *Promise* 的 `then()` 回呼中，你呼叫 HTTP `Response` 的 `json` 方法來擷取
回應中的資料。

<code-example path="toh-pt6/src/app/hero.service.ts" region="to-data"></code-example>

回應的 JSON 有單一的 `data` 屬性，其中
存放著呼叫者想要的英雄陣列。
因此你取出該陣列，並把它作為已解析的 Promise 值回傳。


<div class="alert is-important">

  請注意伺服器回傳資料的形狀。
  這個特定的記憶體內 Web API 範例會回傳帶有 `data` 屬性的物件。
  你的 API 可能回傳不同的東西。請調整程式碼以符合你的 Web API。

</div>


呼叫者並不知道你已從（模擬）伺服器擷取了英雄。
它像先前一樣，接收到一個裝著 *heroes* 的 Promise。

### 錯誤處理

在 `getHeroes()` 的結尾，你會 `catch` 伺服器失敗，並把它們傳給錯誤處理常式。

<code-example path="toh-pt6/src/app/hero.service.ts" region="catch"></code-example>

這是關鍵的一步。
你必須預期 HTTP 失敗，因為它們常因你無法控制的原因而發生。

<code-example path="toh-pt6/src/app/hero.service.ts" region="handleError"></code-example>

這個示範服務會把錯誤記錄到主控台；在真實情境中，
你會在程式碼中處理錯誤。對於示範來說，這樣就可以了。

程式碼也會把錯誤放在一個被拒絕的 Promise 中傳給
呼叫者，讓呼叫者能向使用者顯示適當的錯誤訊息。

### 依 id 取得英雄

當 `HeroDetailComponent` 要求 `HeroService` 擷取一位英雄時，
`HeroService` 目前會擷取所有英雄，
再篩選出 `id` 相符的那一位。
對於模擬來說這樣沒問題，但當你只要一位英雄時，向真正的伺服器要求所有英雄是很浪費的。
大多數 Web API 都支援形式為 `api/hero/:id` 的_依 id 取得_請求（例如 `api/hero/11`）。

更新 `HeroService.getHero()` 方法，改為發出_依 id 取得_請求：

<code-example path="toh-pt6/src/app/hero.service.ts" region="getHero" title="src/app/hero.service.ts"></code-example>

這個請求與 `getHeroes()` 幾乎相同。
URL 中的英雄 id 指出伺服器應更新哪一位英雄。

此外，回應中的 `data` 是單一英雄物件，而不是陣列。

### 未變更的 _getHeroes_ API

雖然你對 `getHeroes()` 與 `getHero()` 做了重大的內部變更，
但公開的簽章並未改變。
你仍然從這兩個方法回傳 Promise。
你不必更新任何呼叫它們的元件。

現在是時候加入建立與刪除英雄的功能了。

## 更新英雄詳細資料

試著在英雄詳細檢視中編輯英雄的名稱。
當你輸入時，英雄名稱會在檢視標題中更新。
但如果你點選 Back 按鈕，變更就會遺失。

先前更新並不會遺失。什麼變了呢？
當應用程式使用模擬英雄清單時，更新會直接套用到
單一、全應用程式共用清單中的英雄物件。現在你從伺服器擷取資料，
如果你希望變更能保留下來，就必須把它們寫回
伺服器。

### 加入儲存英雄詳細資料的功能

在英雄詳細範本的結尾，加入一個儲存按鈕，帶有 `click` 事件
繫結，會呼叫名為 `save()` 的新元件方法。

<code-example path="toh-pt6/src/app/hero-detail.component.html" region="save" title="src/app/hero-detail.component.html (save)"></code-example>

加入以下 `save()` 方法，它會使用英雄服務的
`update()` 方法來保存英雄名稱的變更，然後導覽回上一個檢視。

<code-example path="toh-pt6/src/app/hero-detail.component.ts" region="save" title="src/app/hero-detail.component.ts (save)"></code-example>

### 加入英雄服務的 _update()_ 方法

`update()` 方法的整體結構與
`getHeroes()` 類似，但它使用 HTTP 的 `put()` 來保存伺服器端的變更。

<code-example path="toh-pt6/src/app/hero.service.ts" region="update" title="src/app/hero.service.ts (update)"></code-example>

為了指出伺服器應更新哪一位英雄，英雄的 `id` 會編碼在
URL 中。`put()` 的主體是英雄的 JSON 字串編碼，透過呼叫
`JSON.stringify` 取得。主體的內容型別
（`application/json`）會在請求標頭中標明。

重新整理瀏覽器，變更英雄名稱，儲存你的變更，
然後點選瀏覽器的 Back 按鈕。變更現在應該能保留下來。

## 加入新增英雄的功能

若要加入英雄，應用程式需要英雄的名稱。你可以使用一個 `input`
元素搭配一個加入按鈕。

把以下內容插入英雄元件的 HTML 中，就在
標題之後：

<code-example path="toh-pt6/src/app/heroes.component.html" region="add" title="src/app/heroes.component.html (add)"></code-example>

為了回應點選事件，請呼叫元件的點選處理常式，然後
清除輸入欄位，以便輸入下一個名稱。

<code-example path="toh-pt6/src/app/heroes.component.ts" region="add" title="src/app/heroes.component.ts (add)"></code-example>

當給定的名稱不是空白時，處理常式會把建立該名稱英雄的工作委派給
英雄服務，然後把新英雄加入陣列。

在 `HeroService` 類別中實作 `create()` 方法。

<code-example path="toh-pt6/src/app/hero.service.ts" region="create" title="src/app/hero.service.ts (create)"></code-example>

重新整理瀏覽器並建立一些英雄。

## 加入刪除英雄的功能

英雄檢視中的每位英雄都應該有一個刪除按鈕。

把以下按鈕元素加入英雄元件的 HTML 中，放在重複的 `<li>` 元素中
英雄名稱之後。

<code-example path="toh-pt6/src/app/heroes.component.html" region="delete"></code-example>

`<li>` 元素現在應如下所示：

<code-example path="toh-pt6/src/app/heroes.component.html" region="li-element" title="src/app/heroes.component.html (li-element)"></code-example>

刪除按鈕的點選處理常式除了呼叫元件的 `delete()` 方法之外，
還會停止點選事件的傳播&mdash;你
不希望觸發 `<li>` 的點選處理常式，因為那樣會
選取使用者將要刪除的英雄。

`delete()` 處理常式的邏輯稍微複雜一些：

<code-example path="toh-pt6/src/app/heroes.component.ts" region="delete" title="src/app/heroes.component.ts (delete)"></code-example>

當然，你會把英雄刪除委派給英雄服務，但元件
仍須負責更新顯示內容：它會移除已刪除的英雄，
並在必要時重設所選的英雄。

若要把刪除按鈕放在英雄項目的最右側，
請加入這段 CSS：

<code-example path="toh-pt6/src/app/heroes.component.css" region="additions" title="src/app/heroes.component.css (additions)"></code-example>

### 英雄服務的 _delete()_ 方法

加入英雄服務的 `delete()` 方法，它使用 `delete()` HTTP 方法從伺服器移除英雄：

<code-example path="toh-pt6/src/app/hero.service.ts" region="delete" title="src/app/hero.service.ts (delete)"></code-example>

重新整理瀏覽器，試試新的刪除功能。

## 可觀察物件

每個 `Http` 服務方法都會回傳 HTTP `Response` 物件的 `Observable`。

`HeroService` 會把該 `Observable` 轉換為 `Promise`，並把 Promise 回傳給呼叫者。
本節將說明如何、何時以及為何直接回傳 `Observable`。

### 背景

*Observable* 是一串事件流，你可以用類似陣列的運算子來處理它。

Angular 核心對可觀察物件有基本支援。
開發者會以運算子與擴充功能增強該支援，這些來自
<a href="http://reactivex.io/rxjs" target="_blank" title="RxJS">RxJS library</a>.
你很快就會看到做法。

回想一下，`HeroService` 把 `toPromise` 運算子串連到 `http.get()` 的 `Observable` 結果上。
該運算子把 `Observable` 轉換為 `Promise`，而你把該 Promise 回傳給呼叫者。

轉換為 Promise 通常是個好選擇。你通常會要求 `http.get()` 擷取單一區塊的資料。
當你收到資料時，就完成了。
呼叫的元件可以輕鬆地以 Promise 的形式使用單一結果。

但請求並非總是只執行一次。
你可能啟動一個請求，
取消它，並在伺服器回應第一個請求之前發出不同的請求。

*request-cancel-new-request*（請求－取消－新請求）序列用 `Promise` 很難實作，但
用 `Observable` 卻很容易。

### 加入依名稱搜尋的功能

你將為 Tour of Heroes 加入*英雄搜尋*功能。
當使用者在搜尋框中輸入名稱時，你會針對依該名稱篩選的英雄重複發出 HTTP 請求。

首先建立 `HeroSearchService`，把搜尋查詢傳送到伺服器的 Web API。

<code-example path="toh-pt6/src/app/hero-search.service.ts" title="src/app/hero-search.service.ts"></code-example>

`HeroSearchService` 中的 `http.get()` 呼叫與
`HeroService` 中的呼叫類似，不過 URL 現在帶有查詢字串。

更重要的是，你不再呼叫 `toPromise()`。
相反地，你回傳來自 `http.get()` 的 *Observable*，
並在把它串連到另一個 RxJS 運算子 <code>map()</code> 之後，
從回應資料中擷取英雄。
RxJS 運算子串連讓回應處理變得簡單且易讀。
請參閱[下方關於運算子的討論](tutorial/toh-pt6#rxjs-imports)。</span>

### HeroSearchComponent

建立一個呼叫新 `HeroSearchService` 的 `HeroSearchComponent`。

元件範本很簡單&mdash;只有一個文字框與一份符合的搜尋結果清單。

<code-example path="toh-pt6/src/app/hero-search.component.html" title="src/app/hero-search.component.html"></code-example>

此外，為新元件加入樣式。

<code-example path="toh-pt6/src/app/hero-search.component.css" title="src/app/hero-search.component.css"></code-example>

當使用者在搜尋框中輸入時，*keyup* 事件繫結會以新的搜尋框值呼叫元件的 `search()`
方法。

一如預期，`*ngFor` 會重複元件 `heroes` 屬性中的英雄物件。

但你很快就會看到，`heroes` 屬性現在是英雄陣列的 *Observable*，而不只是英雄陣列。
`*ngFor` 無法對 `Observable` 做任何事，除非你把它透過 `async` 管道（`AsyncPipe`）傳送。
`async` 管道會訂閱 `Observable`，並產生英雄陣列給 `*ngFor`。

建立 `HeroSearchComponent` 類別與中繼資料。

<code-example path="toh-pt6/src/app/hero-search.component.ts" title="src/app/hero-search.component.ts"></code-example>

#### 搜尋字詞

請關注 `searchTerms`：

<code-example path="toh-pt6/src/app/hero-search.component.ts" region="searchTerms"></code-example>

`Subject` 是_可觀察_事件流的產生者；
`searchTerms` 會產生字串的 `Observable`，也就是名稱搜尋的篩選條件。

每次呼叫 `search()` 都會透過呼叫 `next()`，把新字串放入此 Subject 的_可觀察_串流中。

{@a ngoninit}

#### 初始化 *heroes* 屬性（*ngOnInit*）

`Subject` 本身也是 `Observable`。
你可以把
搜尋字詞的串流轉換為 `Hero` 陣列的串流，並把結果指派給 `heroes` 屬性。

<code-example path="toh-pt6/src/app/hero-search.component.ts" region="search"></code-example>

把使用者的每一次按鍵都直接傳給 `HeroSearchService`，會產生過多的 HTTP 請求，
耗費伺服器資源，也會耗盡行動網路的流量方案。

相反地，你可以串連 `Observable` 運算子，把請求流量減少到字串 `Observable`。
你對 `HeroSearchService` 的呼叫次數會更少，同時仍能及時取得結果。做法如下：

* `debounceTime(300)` 會等到新字串事件的流程暫停 300 毫秒後，
才傳遞最新的字串。你發出請求的頻率永遠不會高於每 300 毫秒一次。
* `distinctUntilChanged` 會確保只有在篩選文字變更時才傳送請求。
* `switchMap()` 會針對每個通過 `debounce` 與 `distinctUntilChanged` 的搜尋字詞呼叫搜尋服務。
它會取消並捨棄先前的搜尋可觀察物件，只回傳最新的搜尋服務可觀察物件。


<div class="l-sub-section">

  使用 [switchMap 運算子](http://www.learnrxjs.io/operators/transformation/switchmap.html)
  （前身為 `flatMapLatest`）時，
  每個符合條件的按鍵事件都可能觸發一次 `http()` 方法呼叫。
  即使每次請求之間有 300 毫秒的暫停，你仍可能有許多進行中的 HTTP 請求，
  而且它們回傳的順序可能與傳送順序不同。

  `switchMap()` 會保留原始請求的順序，同時只回傳最近一次 `http` 方法呼叫的可觀察物件。
  先前呼叫的結果會被取消並捨棄。

  如果搜尋文字是空的，`http()` 方法呼叫也會被短路，
  並回傳一個包含空陣列的可觀察物件。

  請注意，在服務支援該功能之前，_取消_ `HeroSearchService` 的 Observable
  並不會真的中止待處理的 HTTP 請求。
  目前，不需要的結果會被捨棄。

</div>


* `catch` 會攔截失敗的可觀察物件。
這個簡單範例會把錯誤印到主控台；真實的應用程式會做得更好。
接著，若要清除搜尋結果，你回傳一個包含空陣列的可觀察物件。

{@a rxjs-imports}

### 匯入 RxJS 運算子

大多數 RxJS 運算子並未包含在 Angular 的基礎 `Observable` 實作中。
基礎實作只包含 Angular 本身所需的內容。

當你需要更多 RxJS 功能時，可以透過*匯入*定義這些功能的函式庫來擴充 `Observable`。
以下是_這個_元件需要的所有 RxJS 匯入：

<code-example path="toh-pt6/src/app/hero-search.component.ts" region="rxjs-imports" title="src/app/hero-search.component.ts (rxjs imports)" linenums="false"></code-example>

`import 'rxjs/add/...'` 語法可能讓人感到陌生。
它缺少大括號之間常見的符號清單：`{...}`。

你不需要運算子符號本身。
在每種情況下，光是匯入函式庫這個動作，
就會載入並執行函式庫的指令碼檔案，進而把運算子加入 `Observable` 類別。

### 把搜尋元件加入儀表板

把英雄搜尋 HTML 元素加入 `DashboardComponent` 範本的底部。

<code-example path="toh-pt6/src/app/dashboard.component.html" title="src/app/dashboard.component.html" linenums="false"></code-example>

最後，從
<code>hero-search.component.ts</code>
匯入 `HeroSearchComponent`，並把它加入 `declarations` 陣列。


<code-example path="toh-pt6/src/app/app.module.ts" region="search" title="src/app/app.module.ts (search)"></code-example>

再次執行應用程式。在儀表板中，於搜尋框輸入一些文字。
如果你輸入與任何現有英雄名稱相符的字元，你會看到類似以下的畫面。

<figure>
  <img src='generated/images/guide/toh/toh-hero-search.png' alt="英雄搜尋元件">
</figure>

## 應用程式結構與程式碼

請在本頁的 <live-example></live-example> 中檢閱範例原始碼。
確認你的結構如下：

<div class='filetree'>
  <div class='file'>angular-tour-of-heroes</div>
  <div class='children'>
    <div class='file'>src</div>
    <div class='children'>
      <div class='file'>app</div>
      <div class='children'>
        <div class='file'>app.component.ts</div>
        <div class='file'>app.component.css</div>
        <div class='file'>app.module.ts</div>
        <div class='file'>app-routing.module.ts</div>
        <div class='file'>dashboard.component.css</div>
        <div class='file'>dashboard.component.html</div>
        <div class='file'>dashboard.component.ts</div>
        <div class='file'>hero.ts</div>
        <div class='file'>hero-detail.component.css</div>
        <div class='file'>hero-detail.component.html</div>
        <div class='file'>hero-detail.component.ts</div>
        <div class='file'>hero-search.component.html (new)</div>
        <div class='file'>hero-search.component.css (new)</div>
        <div class='file'>hero-search.component.ts (new)</div>
        <div class='file'>hero-search.service.ts (new)</div>
        <div class='file'>hero.service.ts</div>
        <div class='file'>heroes.component.css</div>
        <div class='file'>heroes.component.html</div>
        <div class='file'>heroes.component.ts</div>
        <div class='file'>in-memory-data.service.ts (new)</div>
      </div>
      <div class='file'>main.ts</div>
      <div class='file'>index.html</div>
      <div class='file'>styles.css</div>
      <div class='file'>systemjs.config.js</div>
      <div class='file'>tsconfig.json</div>
    </div>
    <div class='file'>node_modules ...</div>
    <div class='file'>package.json</div>
  </div>
</div>

## 摘要

你已經走到旅程的終點，而且完成了很多事。
* 你加入了在應用程式中使用 HTTP 所需的依賴。
* 你重構了 `HeroService`，改為從 Web API 載入英雄。
* 你擴充了 `HeroService`，支援 `post()`、`put()` 與 `delete()` 方法。
* 你更新了元件，允許新增、編輯與刪除英雄。
* 你設定了一個記憶體內 Web API。
* 你學會了如何使用可觀察物件。

以下是你在本頁中加入或變更的檔案。


<code-tabs>
  <code-pane title="app.comp...ts" path="toh-pt6/src/app/app.component.ts"></code-pane>
  <code-pane title="app.mod...ts" path="toh-pt6/src/app/app.module.ts"></code-pane>
  <code-pane title="heroes.comp...ts" path="toh-pt6/src/app/heroes.component.ts"></code-pane>
  <code-pane title="heroes.comp...html" path="toh-pt6/src/app/heroes.component.html"></code-pane>
  <code-pane title="heroes.comp...css" path="toh-pt6/src/app/heroes.component.css"></code-pane>
  <code-pane title="hero-detail.comp...ts" path="toh-pt6/src/app/hero-detail.component.ts"></code-pane>
  <code-pane title="hero-detail.comp...html" path="toh-pt6/src/app/hero-detail.component.html"></code-pane>
  <code-pane title="hero.service.ts" path="toh-pt6/src/app/hero.service.ts"></code-pane>
  <code-pane title="in-memory-data.service.ts" path="toh-pt6/src/app/in-memory-data.service.ts"></code-pane>
</code-tabs>

<code-tabs>
  <code-pane title="hero-search.service.ts" path="toh-pt6/src/app/hero-search.service.ts"></code-pane>
  <code-pane title="hero-search.component.ts" path="toh-pt6/src/app/hero-search.component.ts"></code-pane>
  <code-pane title="hero-search.component.html" path="toh-pt6/src/app/hero-search.component.html"></code-pane>
  <code-pane title="hero-search.component.css" path="toh-pt6/src/app/hero-search.component.css"></code-pane>
</code-tabs>

## 下一步

至此，「Tour of Heroes」教學告一段落。
你已經準備好在基礎章節中進一步學習 Angular 開發，
首先從[架構](guide/architecture "Architecture")指南開始。
