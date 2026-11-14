# 服務

Tour of Heroes 的 `HeroesComponent` 目前正在取得並顯示假資料。

經過本教學的重構後，`HeroesComponent` 將變得精簡，並專注於支援檢視。
它也會更容易以模擬服務進行單元測試。

## 為什麼需要服務

元件不應該直接擷取或儲存資料，當然也不應該明知是假資料還拿來呈現。
元件應該專注於呈現資料，並把資料存取委派給服務。

在本教學中，你將建立一個 `HeroService`，讓所有應用程式類別都能用它來取得英雄。
建立該服務時，你不會使用 `new`，
而是仰賴 Angular 的[*依賴注入*](guide/dependency-injection)
把它注入 `HeroesComponent` 的建構子。

服務是讓彼此_互不相識_的類別共享資訊的好方法。
你將建立一個 `MessageService`，並把它注入兩個地方：

1. 在 `HeroService` 中，它使用此服務來傳送訊息。
2. 在 `MessagesComponent` 中，它會顯示該訊息。


## 建立 _HeroService_

使用 Angular CLI，建立一個名為 `hero` 的服務。

<code-example language="sh" class="code-shell">
  ng generate service hero
</code-example>

此命令會在 `src/app/hero.service.ts` 產生 `HeroService` 類別的骨架
`HeroService` 類別應該如下列範例所示。

<code-example path="toh-pt4/src/app/hero.service.1.ts" region="new"
 title="src/app/hero.service.ts (new service)" linenums="false">
</code-example>

### _@Injectable()_ 服務

請注意，新的服務會匯入 Angular 的 `Injectable` 符號，並以 `@Injectable()` 裝飾器標註類別。這表示該類別會參與_依賴注入系統_。`HeroService` 類別將提供一個可注入的服務，它也可以有自己的注入依賴。
它目前還沒有任何依賴，但[很快就會有](#inject-message-service)。

`@Injectable()` 裝飾器會接受服務的中繼資料物件，就像 `@Component()` 裝飾器對元件類別所做的那樣。

### 取得英雄資料

`HeroService` 可以從任何地方取得英雄資料&mdash;Web 服務、本地儲存空間或模擬資料來源。

把資料存取從元件中移除，意味著你可以隨時改變實作方式，而不需動到任何元件。
元件不知道服務是如何運作的。

_本_教學的實作會繼續提供_模擬英雄_。

匯入 `Hero` 與 `HEROES`。

<code-example path="toh-pt4/src/app/hero.service.ts" region="import-heroes">
</code-example>

加入一個 `getHeroes` 方法來回傳_模擬英雄_。

<code-example path="toh-pt4/src/app/hero.service.1.ts" region="getHeroes">
</code-example>

{@a provide}
## 提供 `HeroService`

你必須讓 `HeroService` 可供依賴注入系統使用，
Angular 才能把它_注入_ `HeroesComponent`，
如你將在[下方](#inject)所做的那樣。你可以透過註冊一個_提供者_來達成這件事。提供者是可以建立或交付服務的東西；在這個例子中，它會實例化 `HeroService` 類別來提供服務。

現在，你需要確保 `HeroService` 已註冊為此服務的提供者。
你會把它註冊到_注入器_，注入器是負責在需要時選擇並注入提供者的物件。

預設情況下，Angular CLI 指令 `ng generate service` 會透過在 `@Injectable` 裝飾器中加入提供者中繼資料，為你的服務向_根注入器_註冊一個提供者。

如果你看一下緊鄰在 `HeroService` 類別定義之前的 `@Injectable()` 陳述式，就會看到 `providedIn` 中繼資料的值是 'root'：

```
@Injectable({
  providedIn: 'root',
})
```

當你在根層級提供服務時，Angular 會建立一個單一、共享的 `HeroService` 執行個體，並注入到任何請求它的類別中。
在 `@Injectable` 中繼資料中註冊提供者，也能讓 Angular 在服務最終未被使用時將其移除，以最佳化應用程式。

<div class="alert is-helpful">

若想進一步了解提供者，請參閱[提供者一節](guide/providers)。
若想進一步了解注入器，請參閱[依賴注入指南](guide/dependency-injection)。

</div>

`HeroService` 現在已可接入 `HeroesComponent`。

<div class="alert is-important">

這是一個過渡的程式碼範例，它將讓你可以提供並使用 `HeroService`。此時的程式碼將與[「最終程式碼檢閱」](#final-code-review)中的 `HeroService` 不同。

</div>


## 更新 `HeroesComponent`

開啟 `HeroesComponent` 類別檔案。

刪除 `HEROES` 的匯入，因為你不再需要它。
改為匯入 `HeroService`。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" title="src/app/heroes/heroes.component.ts (import HeroService)" region="hero-service-import">
</code-example>

把 `heroes` 屬性的定義改為簡單的宣告。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" region="heroes">
</code-example>

{@a inject}

### 注入 `HeroService`

在建構子中加入一個型別為 `HeroService` 的私有 `heroService` 參數。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" region="ctor">
</code-example>

此參數同時定義了一個私有的 `heroService` 屬性，並將其標示為 `HeroService` 的注入位置。

當 Angular 建立 `HeroesComponent` 時，[依賴注入](guide/dependency-injection)系統
會把 `heroService` 參數設為 `HeroService` 的單一執行個體。

### 加入 _getHeroes()_

建立一個函式，從服務中取得英雄。

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="getHeroes">
</code-example>

{@a oninit}

### 在 `ngOnInit` 中呼叫它

雖然你可以在建構子中呼叫 `getHeroes()`，但那不是最佳做法。

建構子只應保留給簡單的初始化，例如把建構子參數繫結到屬性。
建構子不應該_做任何事_。
它當然不應該呼叫一個函式，去向遠端伺服器發出 HTTP 請求，就像_真正的_資料服務會做的那樣。

請改在 [*ngOnInit 生命週期鉤子*](guide/lifecycle-hooks)中呼叫 `getHeroes()`，
讓 Angular 在建立 `HeroesComponent` 執行個體_之後_的適當時機呼叫 `ngOnInit`。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" region="ng-on-init">
</code-example>

### 看看執行結果

瀏覽器重新整理後，應用程式應如之前一樣執行，
當你點選英雄名稱時，會顯示英雄清單與英雄詳細檢視。

## 可觀察的資料

`HeroService.getHeroes()` 方法具有_同步簽名_，
這意味著 `HeroService` 可以同步擷取英雄。
`HeroesComponent` 會像英雄可以同步擷取一樣，
取用 `getHeroes()` 的結果。

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="get-heroes">
</code-example>

這在真正的應用程式中行不通。
你現在能這樣蒙混過關，是因為服務目前回傳的是_模擬英雄_。
但很快地，應用程式將從遠端伺服器擷取英雄，
而這本質上是一個_非同步_操作。

`HeroService` 必須等待伺服器回應，
`getHeroes()` 無法立即回傳英雄資料，
而瀏覽器不會在服務等待時被阻擋。

`HeroService.getHeroes()` 必須具有某種_非同步簽名_。

它可以接受一個回呼。它可以回傳一個 `Promise`。它可以回傳一個 `Observable`。

在本教學中，`HeroService.getHeroes()` 將回傳一個 `Observable`，
部分原因是它最終會使用 Angular 的 `HttpClient.get` 方法來擷取英雄，
而 [`HttpClient.get()` 會回傳一個 `Observable`](guide/http)。

### 可觀察的 _HeroService_

`Observable` 是 [RxJS 函式庫](http://reactivex.io/rxjs/)中的關鍵類別之一。

在[後續的 HTTP 教學](tutorial/toh-pt6)中，你將學到 Angular 的 `HttpClient` 方法會回傳 RxJS `Observable`。
在本教學中，你將使用 RxJS 的 `of()` 函式來模擬從伺服器取得資料。

開啟 `HeroService` 檔案，並從 RxJS 匯入 `Observable` 與 `of` 符號。

<code-example path="toh-pt4/src/app/hero.service.ts" 
title="src/app/hero.service.ts (Observable imports)" region="import-observable">
</code-example>

把 `getHeroes` 方法換成下面這個。

<code-example path="toh-pt4/src/app/hero.service.ts" region="getHeroes-1"></code-example>

`of(HEROES)` 會回傳一個 `Observable<Hero[]>`，它會發出 _單一值_，也就是模擬英雄的陣列。

<div class="alert is-helpful">

在[HTTP 教學](tutorial/toh-pt6)中，你將呼叫 `HttpClient.get<Hero[]>()`，它同樣會回傳一個 `Observable<Hero[]>`，發出 _單一值_，也就是 HTTP 回應主體中的英雄陣列。

</div>

### 在 _HeroesComponent_ 中訂閱

`HeroService.getHeroes` 方法原本會回傳 `Hero[]`。
現在它回傳的是 `Observable<Hero[]>`。

你必須適應 `HeroesComponent` 中的這項差異。

找到 `getHeroes` 方法，並以下列程式碼取代它
（與先前版本並排顯示，以供比較）

<code-tabs>

  <code-pane title="heroes.component.ts (Observable)" 
    path="toh-pt4/src/app/heroes/heroes.component.ts" region="getHeroes">
  </code-pane>

  <code-pane title="heroes.component.ts (Original)" 
    path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="getHeroes">
  </code-pane>

</code-tabs>

`Observable.subscribe()` 是關鍵的差異。

先前的版本會把英雄陣列指派給元件的 `heroes` 屬性。
該指派是_同步_發生的，就像伺服器可以立即回傳英雄，
或瀏覽器可以在等待伺服器回應時凍結 UI 一樣。

當 `HeroService` 真的向遠端伺服器發出請求時，那樣是_行不通的_。

新版本會等待 `Observable` 發出英雄陣列&mdash;
可能發生在現在，也可能發生在幾分鐘後。
`subscribe` 會把發出的陣列傳給回呼函式，
由它設定元件的 `heroes` 屬性。

當 `HeroService` 向伺服器請求英雄時，這種非同步做法_將會奏效_。

## 顯示訊息

本節會引導你完成以下事項：

* 加入一個 `MessagesComponent`，在畫面底部顯示應用程式訊息
* 建立一個可注入、應用程式範圍的 `MessageService`，用來傳送要顯示的訊息
* 把 `MessageService` 注入 `HeroService`
* 在 `HeroService` 成功擷取英雄時顯示訊息

### 建立 _MessagesComponent_

使用 CLI 建立 `MessagesComponent`。

<code-example language="sh" class="code-shell">
  ng generate component messages
</code-example>

CLI 會在 `src/app/messages` 資料夾中建立元件檔案，並在 `AppModule` 中宣告 `MessagesComponent`。

修改 `AppComponent` 範本來顯示產生的 `MessagesComponent`

<code-example
  title = "/src/app/app.component.html"
  path="toh-pt4/src/app/app.component.html">
</code-example>

你應該會在頁面底部看到來自 `MessagesComponent` 的預設段落。

### 建立 _MessageService_

使用 CLI 在 `src/app` 中建立 `MessageService`。

<code-example language="sh" class="code-shell">
  ng generate service message
</code-example>

開啟 `MessageService`，並以下列內容取代其內容。

<code-example
  title = "/src/app/message.service.ts"
  path="toh-pt4/src/app/message.service.ts">
</code-example>

此服務會公開它的 `messages` 快取與兩個方法：一個用來把訊息加入快取的 `add()` 方法，另一個用來清除快取的 `clear()` 方法。

{@a inject-message-service}
### 把它注入 `HeroService`

在 `HeroService` 中匯入 `MessageService`。

<code-example
  title = "/src/app/hero.service.ts (import MessageService)"
  path="toh-pt4/src/app/hero.service.ts" region="import-message-service">
</code-example>

編輯建構子，加入一個宣告私有 `messageService` 屬性的參數。
當 Angular 建立 `HeroService` 時，會把單一的 `MessageService` 注入該屬性。

<code-example
  path="toh-pt4/src/app/hero.service.ts" region="ctor">
</code-example>

<div class="alert is-helpful">

這是典型的「*服務中的服務*」情境：
你把 `MessageService` 注入 `HeroService`，而 `HeroService` 則注入 `HeroesComponent`。

</div>

### 從 `HeroService` 傳送訊息

編輯 `getHeroes` 方法，在擷取英雄時傳送訊息。

<code-example path="toh-pt4/src/app/hero.service.ts" region="getHeroes">
</code-example>

### 顯示來自 `HeroService` 的訊息

`MessagesComponent` 應顯示所有訊息，
包括 `HeroService` 在擷取英雄時傳送的訊息。

開啟 `MessagesComponent` 並匯入 `MessageService`。

<code-example
  title = "/src/app/messages/messages.component.ts (import MessageService)"
  path="toh-pt4/src/app/messages/messages.component.ts" region="import-message-service">
</code-example>

編輯建構子，加入一個宣告**公開** `messageService` 屬性的參數。
當 Angular 建立 `MessagesComponent` 時，會把單一的 `MessageService` 注入該屬性。

<code-example
  path="toh-pt4/src/app/messages/messages.component.ts" region="ctor">
</code-example>

因為你要在範本中繫結它，所以 `messageService` 屬性**必須是公開的**。

<div class="alert is-important">

Angular 只會繫結到_公開_的元件屬性。

</div>

### 繫結到 _MessageService_

把 CLI 產生的 `MessagesComponent` 範本取代為以下內容。

<code-example
  title = "src/app/messages/messages.component.html"
  path="toh-pt4/src/app/messages/messages.component.html">
</code-example>

此範本會直接繫結到元件的 `messageService`。

* 只有在有訊息要顯示時，`*ngIf` 才會顯示訊息區域。


* `*ngFor` 會以重複的 `<div>` 元素呈現訊息清單。


* Angular [事件繫結](guide/template-syntax#event-binding)會把按鈕的 click 事件
繫結到 `MessageService.clear()`。

當你把私有 CSS 樣式加入 `messages.component.css` 後，訊息看起來會更好，
這些樣式列在下方其中一個[「最終程式碼檢閱」](#final-code-review)頁籤中。

瀏覽器會重新整理，頁面隨即顯示英雄清單。
捲動到底部，即可在訊息區域看到來自 `HeroService` 的訊息。
點選「clear」按鈕，訊息區域便會消失。

{@a final-code-review}

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案，你的應用程式應該像這樣 <live-example></live-example>。

<code-tabs>

  <code-pane title="src/app/hero.service.ts" 
  path="toh-pt4/src/app/hero.service.ts">
  </code-pane>

  <code-pane title="src/app/message.service.ts" 
  path="toh-pt4/src/app/message.service.ts">
  </code-pane>

  <code-pane title="src/app/heroes/heroes.component.ts"
  path="toh-pt4/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane title="src/app/messages/messages.component.ts"
  path="toh-pt4/src/app/messages/messages.component.ts">
  </code-pane>

  <code-pane title="src/app/messages/messages.component.html"
  path="toh-pt4/src/app/messages/messages.component.html">
  </code-pane>

  <code-pane title="src/app/messages/messages.component.css"
  path="toh-pt4/src/app/messages/messages.component.css">
  </code-pane>

  <code-pane title="src/app/app.module.ts"
  path="toh-pt4/src/app/app.module.ts">
  </code-pane>

  <code-pane title="src/app/app.component.html"
  path="toh-pt4/src/app/app.component.html">
  </code-pane>

</code-tabs>

## 摘要

* 你把資料存取重構到 `HeroService` 類別。
* 你在根層級把 `HeroService` 註冊為其服務的_提供者_，以便在應用程式的任何地方注入它。
* 你使用 [Angular 依賴注入](guide/dependency-injection)把它注入元件。
* 你為 `HeroService` 的 _get data_ 方法加上了非同步簽名。
* 你認識了 `Observable` 與 RxJS 的 _Observable_ 函式庫。
* 你使用 RxJS 的 `of()` 來回傳模擬英雄的可觀察物件（`Observable<Hero[]>`）。
* 元件的 `ngOnInit` 生命週期鉤子會呼叫 `HeroService` 方法，而不是建構子。
* 你建立了一個 `MessageService`，用於類別之間鬆散耦合的通訊。
* 注入到元件中的 `HeroService` 是以另一個注入的服務
 `MessageService` 建立的。
