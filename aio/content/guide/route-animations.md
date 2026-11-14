# 路由轉場動畫

#### 先決條件

對下列概念有基本的了解：

* [Angular 動畫簡介](guide/animations)
* [轉場與觸發器](guide/transition-and-triggers)
* [可重複使用的動畫](guide/reusable-animations)

<hr>

路由讓使用者能在應用程式中的不同路由之間導覽。當使用者從一個路由導覽到另一個路由時，Angular 路由器會將 URL 路徑對應到相關的元件，並顯示其檢視。為這段路由轉場加入動畫，能大幅提升使用者體驗。

Angular 路由器內建高階動畫函式，讓你能在路由變更時為檢視之間的轉場加入動畫。若要在切換路由時產生動畫序列，你需要定義巢狀的動畫序列。從承載檢視的最上層元件開始，並在承載內嵌檢視的元件中巢狀地加入額外動畫。

若要啟用路由轉場動畫，請執行下列步驟：

1. 將路由模組匯入應用程式，並建立定義可能路由的路由設定。
2. 加入路由器出口，告訴 Angular 路由器要將啟用狀態的元件放置在 DOM 中的哪個位置。
3. 定義動畫。


透過在兩個路由 *Home* 與 *About* 之間導覽，來說明路由轉場動畫；這兩個路由分別與 `HomeComponent` 和 `AboutComponent` 檢視相關聯。這兩個元件檢視都是最上層檢視的子檢視，由 `AppComponent` 承載。我們將實作一段路由轉場動畫，當使用者在兩個路由之間導覽時，讓新檢視向右滑入，並將舊檢視滑出。

</br>

<figure>
<img src="generated/images/guide/animations/route-animation.gif" alt="動畫實際運作" width="440">
</figure>

## 路由設定

首先，使用 `RouterModule` 類別中可用的方法設定一組路由。此路由設定會告訴路由器如何導覽。

使用 `RouterModule.forRoot` 方法來定義一組路由。此外，將 `RouterModule` 匯入主模組 `AppModule` 的 `imports` 陣列中。

<div class="alert is-helpful">

**注意：** 在根模組 `AppModule` 中使用 `RouterModule.forRoot` 方法，註冊頂層應用程式路由與提供者。對於功能模組，請呼叫 `RouterModule.forChild` 方法註冊額外的路由。

</div>

下列設定定義了應用程式可能的路由。

<code-example path="animations/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts" region="route-animation-data" language="typescript">
</code-example>

`home` 與 `about` 路徑分別與 `HomeComponent` 和 `AboutComponent` 檢視相關聯。路由設定會告訴 Angular 路由器，在導覽符合對應路徑時，具現化 `HomeComponent` 與 `AboutComponent` 檢視。

除了 `path` 與 `component` 之外，每個路由的 `data` 屬性定義了與路由相關聯的動畫專用設定鍵值。當路由變更時，`data` 屬性值會被傳入 `AppComponent`。你也可以在路由設定中傳入額外資料，供動畫使用。`data` 屬性值必須與 `routeAnimation` 觸發器中定義的轉場相符，我們稍後就會定義它。

<div class="alert is-helpful">

**注意：** 你使用的 `data` 屬性名稱可以是任意的。例如，上面範例中使用的名稱 *animation* 就是一個任意的選擇。

</div>

## 路由器出口

設定好路由後，告訴 Angular 路由器在與路由相符時要在哪裡渲染檢視。你可以在根 `AppComponent` 範本內插入一個 `<router-outlet>` 容器，來設定路由出口。

`<router-outlet>` 容器有一個屬性指令，其中包含作用中路由及其狀態的資料，這些資料是根據我們在路由設定中設定的 `data` 屬性而來。

<code-example path="animations/src/app/app.component.html" title="src/app/app.component.html" region="route-animations-outlet">
</code-example>

`AppComponent` 定義了一個可以偵測檢視何時變更的方法。該方法會根據路由設定 `data` 屬性值，將一個動畫狀態值指派給動畫觸發器（`@routeAnimation`）。以下是 `AppComponent` 中偵測路由變更發生時機的方法範例。

<code-example path="animations/src/app/app.component.ts" linenums="false" title="src/app/app.component.ts" region="prepare-router-outlet" language="typescript">
</code-example>

在這裡，`prepareRoute()` 方法會取得 output 指令的值（透過 `#outlet="outlet"` 建立），並根據目前作用中路由的自訂資料，回傳一個代表動畫狀態的字串值。你可以使用這個資料來控制每個路由要執行哪個轉場。

## 動畫定義

動畫可以直接在元件內部定義。在這個範例中，我們在獨立的檔案中定義動畫，這讓我們能重複使用這些動畫。

下列程式碼片段定義了一個名為 `slideInAnimation` 的可重複使用動畫。


<code-example path="animations/src/app/animations.ts" linenums="false" title="src/app/animations.ts" region="route-animations" language="typescript">
</code-example>

動畫定義會做幾件事：

* 定義兩個轉場。單一觸發器可以定義多個狀態與轉場。
* 調整宿主檢視與子檢視的樣式，以控制它們在轉場期間的相對位置。
* 使用 `query()` 來判斷哪個子檢視正在進入宿主檢視、哪個正在離開。

路由變更會啟用動畫觸發器，並套用符合狀態變更的轉場。

<div class="alert is-helpful">

**注意：** 轉場狀態必須符合路由設定中定義的 `data` 屬性值。
</div>

將可重複使用的動畫（`slideInAnimation`）加入 `AppComponent` 的 `animations` 中繼資料，讓動畫定義可以在應用程式中使用。

<code-example path="animations/src/app/app.component.ts" linenums="false" title="src/app/app.component.ts" region="define" language="typescript">
</code-example>

### 為宿主與子元件設定樣式

在轉場期間，新檢視會直接插入在舊檢視之後，兩個元素會同時出現在螢幕上。為防止這種情況，請對宿主檢視，以及被移除與被插入的子檢視套用額外的樣式。宿主檢視必須使用相對定位，子檢視則必須使用絕對定位。為檢視加入樣式，會讓容器在原地產生動畫，而不需由 DOM 搬動各個元素。

<code-example path="animations/src/app/animations.ts" linenums="false" title="src/app/animations.ts" region="style-view" language="typescript">
</code-example>

### 查詢檢視容器

使用 `query()` 方法尋找目前宿主元件內的項目並為其製作動畫。`query(":enter")` 陳述式會回傳正在插入的檢視，而 `query(":leave")` 會回傳正在移除的檢視。

假設我們正在從 *Home => About* 進行路由。

<code-example path="animations/src/app/animations.ts" linenums="false" title="src/app/animations.ts" region="query" language="typescript" linenums="false">
</code-example>

動畫程式碼在為檢視設定樣式後會執行下列動作：

* `query(':enter style({ left: '-100%'})` 會比對被加入的檢視，並透過將新加入的檢視定位到最左側來隱藏它。
* 在正在離開的檢視上呼叫 `animateChild()`，以執行其子動畫。
* 使用 `group()` 函式，讓內部動畫平行執行。
* 在 `group()` 函式內：
    * 查詢被移除的檢視，並為其製作動畫，讓它向右滑出很遠。
    * 使用緩動函式與持續時間為檢視製作動畫，讓新檢視滑入。 </br>
    這個動畫會讓 `about` 檢視從左向右滑動。
* 在主動畫完成後，於新檢視上呼叫 `animateChild()` 方法，以執行其子動畫。

現在你已經有一個基本的、可路由的動畫，可以將路由從一個檢視動畫化到另一個檢視。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

* [Angular 動畫簡介](guide/animations)
* [轉場與觸發器](guide/transition-and-triggers)
* [複雜動畫序列](guide/complex-animation-sequences)
* [可重複使用的動畫](guide/reusable-animations)
