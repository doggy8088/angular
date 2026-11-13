# 加入服務

Tour of Heroes 的 `HeroesComponent` 目前取得並顯示的是假資料。

重構 `HeroesComponent` 的重點在於支援檢視，並讓它更容易以模擬服務進行單元測試。

<div class="alert is-helpful">

關於本頁說明的範例應用程式，請參閱 <live-example></live-example>。

</div>

## 為什麼需要服務

元件不應該直接擷取或儲存資料，當然也不應該明知是假資料還拿來呈現。
元件應該專注於呈現資料，並把資料存取委派給服務。

本教學會建立一個 `HeroService`，讓所有應用程式類別都能用它來取得英雄。
不要用 [`new` 關鍵字](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/new)來建立該服務，而是使用 Angular 支援的[*依賴注入*](guide/dependency-injection)，把它注入 `HeroesComponent` 的建構子。

服務是讓彼此*互不相識*的類別共享資訊的好方法。
接著建立 `MessageService`，並把它注入以下兩個地方。

*   注入到 `HeroService` 中，它使用此服務來傳送訊息
*   注入到 `MessagesComponent` 中，它會顯示該訊息，並在使用者點按英雄時顯示 ID

## 建立 `HeroService`

執行 `ng generate`，建立一個名為 `hero` 的服務。

<code-example format="shell" language="shell">

ng generate service hero

</code-example>

此命令會在 `src/app/hero.service.ts` 中產生一個 `HeroService` 類別的骨架，如下所示：

<code-example header="src/app/hero.service.ts (new service)" path="toh-pt4/src/app/hero.service.1.ts" region="new"></code-example>

### `@Injectable()` 服務

請注意，新的服務會匯入 Angular 的 `Injectable` 符號，並以 `@Injectable()` 裝飾器標註類別。這表示該類別會參與*依賴注入系統*。
`HeroService` 類別將提供一個可注入的服務，它也可以有自己的注入依賴。
它目前還沒有任何依賴。

`@Injectable()` 裝飾器會接受服務的中繼資料物件，就像 `@Component()` 裝飾器對元件類別所做的那樣。

### 取得英雄資料

`HeroService` 可以從任何地方取得英雄資料，例如 Web 服務、本地儲存空間或模擬資料來源。

把資料存取從元件中移除，意味著你可以隨時改變實作方式，而不需動到任何元件。
元件不知道服務是如何運作的。

*本*教學的實作會繼續提供*模擬英雄*。

匯入 `Hero` 與 `HEROES`。

<code-example header="src/app/hero.service.ts" path="toh-pt4/src/app/hero.service.ts" region="import-heroes"></code-example>

加入一個 `getHeroes` 方法來回傳*模擬英雄*。

<code-example header="src/app/hero.service.ts" path="toh-pt4/src/app/hero.service.1.ts" region="getHeroes"></code-example>

<a id="provide"></a>

## 提供 `HeroService`

在 Angular 能把 `HeroService` *注入* `HeroesComponent` 之前，你必須先註冊一個*提供者*，讓 `HeroService` 可供依賴注入系統使用。
提供者是可以建立或提供服務的東西。在這個例子中，它會實例化 `HeroService` 類別來提供服務。

為了確保 `HeroService` 能提供此服務，請向*注入器*註冊它。*注入器*是會在應用程式需要時，選擇並注入提供者的物件。

預設情況下，`ng generate service` 會透過在 `@Injectable()` 裝飾器中加入提供者中繼資料，也就是 `providedIn: 'root'`，為你的服務向*根注入器*註冊一個提供者。

<code-example format="typescript" language="typescript">

@Injectable({
  providedIn: 'root',
})

</code-example>

當你在根層級提供服務時，Angular 會建立一個單一、共享的 `HeroService` 執行個體，並注入到任何請求它的類別中。
在 `@Injectable` 中繼資料中註冊提供者，也能讓 Angular 在服務未被使用時將其移除，以最佳化應用程式。

<div class="alert is-helpful">

若想進一步了解提供者，請參閱[提供者一節](guide/providers)。
若想進一步了解注入器，請參閱[依賴注入指南](guide/dependency-injection)。

</div>

`HeroService` 現在已可接入 `HeroesComponent`。

<div class="alert is-important">

這是一個過渡的程式碼範例，讓你可以提供並使用 `HeroService`。
此時的程式碼與[最終程式碼檢閱](#最終程式碼檢閱)中的 `HeroService` 不同。

</div>

## 更新 `HeroesComponent`

開啟 `HeroesComponent` 類別檔案。

刪除 `HEROES` 的匯入，因為你不再需要它。
改為匯入 `HeroService`。

<code-example header="src/app/heroes/heroes.component.ts (import HeroService)" path="toh-pt4/src/app/heroes/heroes.component.ts" region="hero-service-import"></code-example>

把 `heroes` 屬性的定義改為宣告。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt4/src/app/heroes/heroes.component.ts" region="heroes"></code-example>

<a id="inject"></a>

### 注入 `HeroService`

在建構子中加入一個型別為 `HeroService` 的私有 `heroService` 參數。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="ctor"></code-example>

此參數同時定義了一個私有的 `heroService` 屬性，並將其標示為 `HeroService` 的注入位置。

當 Angular 建立 `HeroesComponent` 時，[依賴注入](guide/dependency-injection)系統會把 `heroService` 參數設為 `HeroService` 的單一執行個體。

### 加入 `getHeroes()`

建立一個方法，從服務中取得英雄。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="getHeroes"></code-example>

<a id="oninit"></a>

### 在 `ngOnInit()` 中呼叫它

雖然你可以在建構子中呼叫 `getHeroes()`，但那不是最佳做法。

建構子只應保留給最基本的初始化，例如把建構子參數繫結到屬性。
建構子不應該*做任何事*。
它當然不應該呼叫一個函式，去向遠端伺服器發出 HTTP 請求，就像*真正的*資料服務會做的那樣。

請改在 [*ngOnInit 生命週期鉤子*](guide/lifecycle-hooks)中呼叫 `getHeroes()`，讓 Angular 在建立 `HeroesComponent` 執行個體*之後*的適當時機呼叫 `ngOnInit()`。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt4/src/app/heroes/heroes.component.ts" region="ng-on-init"></code-example>

### 看看執行結果

瀏覽器重新整理後，應用程式應如之前一樣執行，當你點選英雄名稱時，會顯示英雄清單與英雄詳細檢視。

## 可觀察的資料

`HeroService.getHeroes()` 方法具有*同步簽名*，這意味著 `HeroService` 可以同步擷取英雄。
`HeroesComponent` 會像英雄可以同步擷取一樣，取用 `getHeroes()` 的結果。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="get-heroes"></code-example>

這種做法在真正使用非同步呼叫的應用程式中行不通。
它現在能運作，是因為你的服務會同步回傳*模擬英雄*。

如果 `getHeroes()` 無法立即回傳英雄資料，它就不應該是同步的，因為那會在等待回傳資料時阻擋瀏覽器。

`HeroService.getHeroes()` 必須具有某種*非同步簽名*。

在本教學中，`HeroService.getHeroes()` 會回傳一個 `Observable`，以便使用 Angular 的 `HttpClient.get` 方法來擷取英雄，並讓 [`HttpClient.get()`](guide/http) 回傳一個 `Observable`。

### 可觀察的 `HeroService`

`Observable` 是 [RxJS 函式庫](https://rxjs.dev)中的關鍵類別之一。

在[關於 HTTP 的教學](tutorial/toh-pt6)中，你可以看到 Angular 的 `HttpClient` 方法如何回傳 RxJS `Observable` 物件。
本教學會使用 RxJS 的 `of()` 函式來模擬從伺服器取得資料。

開啟 `HeroService` 檔案，並從 RxJS 匯入 `Observable` 與 `of` 符號。

<code-example header="src/app/hero.service.ts (Observable imports)" path="toh-pt4/src/app/hero.service.ts" region="import-observable"></code-example>

把 `getHeroes()` 方法取代為以下內容：

<code-example header="src/app/hero.service.ts" path="toh-pt4/src/app/hero.service.ts" region="getHeroes-1"></code-example>

`of(HEROES)` 會回傳一個 `Observable<Hero[]>`，它會發出*單一值*，也就是模擬英雄的陣列。

<div class="alert is-helpful">

[HTTP 教學](tutorial/toh-pt6)會說明如何呼叫 `HttpClient.get<Hero[]>()`，它同樣會回傳一個 `Observable<Hero[]>`，發出*單一值*，也就是 HTTP 回應主體中的英雄陣列。

</div>

### 在 `HeroesComponent` 中訂閱

`HeroService.getHeroes` 方法原本會回傳 `Hero[]`。
現在它回傳的是 `Observable<Hero[]>`。

你需要調整應用程式，以配合 `HeroesComponent` 的這項變更。

找到 `getHeroes` 方法，並以下列程式碼取代它。新程式碼會與目前版本並排顯示，以供比較。

<code-tabs>
    <code-pane header="heroes.component.ts (Observable)" path="toh-pt4/src/app/heroes/heroes.component.ts" region="getHeroes"></code-pane>
    <code-pane header="heroes.component.ts (Original)" path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="getHeroes"></code-pane>
</code-tabs>

`Observable.subscribe()` 是關鍵的差異。

先前的版本會把英雄陣列指派給元件的 `heroes` 屬性。
該指派是*同步*發生的，就像伺服器可以立即回傳英雄，或瀏覽器可以在等待伺服器回應時凍結 UI 一樣。

當 `HeroService` 真的向遠端伺服器發出請求時，那樣是*行不通*的。

新版本會等待 `Observable` 發出英雄陣列，這可能發生在現在，也可能發生在幾分鐘後。
`subscribe()` 方法會把發出的陣列傳給回呼函式，由它設定元件的 `heroes` 屬性。

當 `HeroService` 向伺服器請求英雄時，這種非同步做法*可以運作*。

## 顯示訊息

本節會引導你完成以下事項：

*   加入一個 `MessagesComponent`，在畫面底部顯示應用程式訊息
*   建立一個可注入、應用程式範圍的 `MessageService`，用來傳送要顯示的訊息
*   把 `MessageService` 注入 `HeroService`
*   在 `HeroService` 成功擷取英雄時顯示訊息

### 建立 `MessagesComponent`

使用 `ng generate` 建立 `MessagesComponent`。

<code-example format="shell" language="shell">

ng generate component messages

</code-example>

`ng generate` 會在 `src/app/messages` 目錄中建立元件檔案，並在 `AppModule` 中宣告 `MessagesComponent`。

編輯 `AppComponent` 範本來顯示 `MessagesComponent`。

<code-example header="src/app/app.component.html" path="toh-pt4/src/app/app.component.html"></code-example>

你應該會在頁面底部看到來自 `MessagesComponent` 的預設段落。

### 建立 `MessageService`

使用 `ng generate` 在 `src/app` 中建立 `MessageService`。

<code-example format="shell" language="shell">

ng generate service message

</code-example>

開啟 `MessageService`，並以下列內容取代其內容。

<code-example header="src/app/message.service.ts" path="toh-pt4/src/app/message.service.ts"></code-example>

此服務會公開它的 `messages` 快取與兩個方法：

* 一個用來把訊息加入快取的 `add()` 方法。
* 另一個用來清除快取的 `clear()` 方法。

<a id="inject-message-service"></a>

### 把它注入 `HeroService`

在 `HeroService` 中匯入 `MessageService`。

<code-example header="src/app/hero.service.ts (import MessageService)" path="toh-pt4/src/app/hero.service.ts" region="import-message-service"></code-example>

編輯建構子，加入一個宣告私有 `messageService` 屬性的參數。
當 Angular 建立 `HeroService` 時，會把單一的 `MessageService` 注入該屬性。

<code-example header="src/app/hero.service.ts" path="toh-pt4/src/app/hero.service.ts" region="ctor"></code-example>

<div class="alert is-helpful">

這是典型的*服務中的服務*情境範例，你把 `MessageService` 注入 `HeroService`，而 `HeroService` 則注入 `HeroesComponent`。

</div>

### 從 `HeroService` 傳送訊息

編輯 `getHeroes()` 方法，在擷取英雄時傳送訊息。

<code-example header="src/app/hero.service.ts" path="toh-pt4/src/app/hero.service.ts" region="getHeroes"></code-example>

### 顯示來自 `HeroService` 的訊息

`MessagesComponent` 應顯示所有訊息，包括 `HeroService` 在擷取英雄時傳送的訊息。

開啟 `MessagesComponent` 並匯入 `MessageService`。

<code-example header="src/app/messages/messages.component.ts (import MessageService)" path="toh-pt4/src/app/messages/messages.component.ts" region="import-message-service"></code-example>

編輯建構子，加入一個宣告**公開** `messageService` 屬性的參數。
當 Angular 建立 `MessagesComponent` 時，會把單一的 `MessageService` 注入該屬性。

<code-example header="src/app/messages/messages.component.ts" path="toh-pt4/src/app/messages/messages.component.ts" region="ctor"></code-example>

因為你要在範本中繫結它，所以 `messageService` 屬性**必須是公開的**。

<div class="alert is-important">

Angular 只會繫結到*公開*的元件屬性。

</div>

### 繫結到 `MessageService`

把 `ng generate` 建立的 `MessagesComponent` 範本取代為以下內容。

<code-example header="src/app/messages/messages.component.html" path="toh-pt4/src/app/messages/messages.component.html"></code-example>

此範本會直接繫結到元件的 `messageService`。

|                                              | 詳細說明 |
|:---                                          |:---     |
| `*ngIf`                                      | 只有在有訊息要顯示時，才會顯示訊息區域。 |
| `*ngFor`                                     | 以重複的 `<div>` 元素呈現訊息清單。    |
| Angular [事件繫結](guide/event-binding) | 把按鈕的 click 事件繫結到 `MessageService.clear()`。    |

在你把 `messages.component.css` 的私有 CSS 樣式加入後，訊息看起來會更好，這些樣式列在下方其中一個[「最終程式碼檢閱」](#最終程式碼檢閱)頁籤中。

## 在 hero service 中加入訊息

以下範例說明如何顯示使用者每次點選英雄的歷史紀錄。
這在你進入下一節[路由](tutorial/toh-pt5)時會很有幫助。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt4/src/app/heroes/heroes.component.ts"></code-example>

重新整理瀏覽器以查看英雄清單，並捲動到底部查看來自 HeroService 的訊息。
每次點選英雄時，都會出現一則新訊息，記錄這次選取。
使用 **清除訊息** 按鈕來清除訊息歷史紀錄。

<a id="final-code-review"></a>

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案。

<code-tabs>
    <code-pane header="src/app/hero.service.ts" path="toh-pt4/src/app/hero.service.ts"></code-pane>
    <code-pane header="src/app/message.service.ts" path="toh-pt4/src/app/message.service.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt4/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/messages/messages.component.ts" path="toh-pt4/src/app/messages/messages.component.ts"></code-pane>
    <code-pane header="src/app/messages/messages.component.html" path="toh-pt4/src/app/messages/messages.component.html"></code-pane>
    <code-pane header="src/app/messages/messages.component.css" path="toh-pt4/src/app/messages/messages.component.css"></code-pane>
    <code-pane header="src/app/app.module.ts" path="toh-pt4/src/app/app.module.ts"></code-pane>
    <code-pane header="src/app/app.component.html" path="toh-pt4/src/app/app.component.html"></code-pane>
</code-tabs>

## 摘要

*   你把資料存取重構到 `HeroService` 類別。
*   你在根層級把 `HeroService` 註冊為其服務的*提供者*，以便在應用程式的任何地方注入它。
*   你使用 [Angular 依賴注入](guide/dependency-injection)把它注入元件。
*   你為 `HeroService` 的 `get data` 方法加上了非同步簽名。
*   你認識了 `Observable` 與 RxJS 的 `Observable` 函式庫。
*   你使用 RxJS 的 `of()` 來回傳 `Observable<Hero[]>`，也就是模擬英雄的可觀察物件。
*   元件的 `ngOnInit` 生命週期鉤子會呼叫 `HeroService` 方法，而不是建構子。
*   你建立了一個 `MessageService`，用於類別之間鬆散耦合的通訊。
*   注入到元件中的 `HeroService` 是以另一個注入的服務 `MessageService` 建立的。

@reviewed 2022-02-28
