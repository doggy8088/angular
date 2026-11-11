# 路由轉場動畫

路由讓使用者能在應用程式中的不同路由之間導覽。

## 先決條件

對下列概念有基本的了解：

*   [Angular 動畫簡介](guide/animations)
*   [轉場與觸發器](guide/transition-and-triggers)
*   [可重複使用的動畫](guide/reusable-animations)

## 啟用路由轉場動畫

當使用者從一個路由導覽到另一個路由時，Angular 路由器會將 URL 路徑對應到相關的元件，並顯示其檢視。 為這段路由轉場加入動畫，能大幅提升使用者體驗。

Angular 路由器內建高階動畫函式，讓你能在路由變更時為檢視之間的轉場加入動畫。 若要在切換路由時產生動畫序列，你需要定義巢狀的動畫序列。 從承載檢視的最上層元件開始，並在承載內嵌檢視的元件中巢狀地加入動畫。

若要啟用路由轉場動畫，請執行下列步驟：

1.  建立定義可能路由的路由設定。對於以 NgModule 為基礎的應用程式，這包括建立一個 `RouterModule`，並將它加入主要的 `AppModule`。
1.  加入路由器出口，告訴 Angular 路由器要將啟用狀態的元件放置在 DOM 中的哪個位置。
1.  定義動畫。

透過在兩個路由 *Home* 與 *About* 之間導覽，來說明路由轉場動畫；這兩個路由分別與 `HomeComponent` 和 `AboutComponent` 檢視相關聯。 這兩個元件檢視都是最上層檢視的子檢視，由 `AppComponent` 承載。 實作一段路由轉場動畫，在兩個路由之間導覽時，讓新檢視向右滑入，並將舊檢視滑出。

<div class="lightbox">

<img alt="動畫實際運作" width="440" src="generated/images/guide/animations/route-animation.gif">

</div>

## 路由設定

首先，設定一組路由。此路由設定會告訴路由器如何導覽。

- 在 `app.routes.ts` 中建立一個名為 `routes` 的陣列，以定義一組路由。
- 在 `app.config.ts` 的 providers 陣列中，將路由加入 `provideRouter` 函式。

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

<div class="alert is-helpful">

**注意**：<br />
對於以 `NgModule` 為基礎的應用程式：

使用 `RouterModule.forRoot` 方法來定義一組路由。
此外，將 `RouterModule` 加入主模組 `AppModule` 的 `imports` 陣列中。

在根模組 `AppModule` 中使用 `RouterModule.forRoot` 方法，註冊頂層應用程式路由與提供者。
對於功能模組，請改為呼叫 `RouterModule.forChild` 方法。

</div>

下列設定定義了應用程式可能的路由。

<code-example header="src/app/app.routes.ts" path="animations/src/app/app.routes.ts" region="route-animation-data"></code-example>

`home` 與 `about` 路徑分別與 `HomeComponent` 和 `AboutComponent` 檢視相關聯。路由設定會告訴 Angular 路由器，在導覽符合對應路徑時，具現化 `HomeComponent` 與 `AboutComponent` 檢視。

每個路由的 `data` 屬性定義了與路由相關聯的動畫專用設定鍵值。當路由變更時，`data` 屬性值會被傳入 `AppComponent`。

<div class="alert is-helpful">

**注意**：<br />
你使用的 `data` 屬性名稱可以是任意的。
例如，前面範例中使用的名稱 *animation* 就是一個任意的選擇。

</div>

## 路由器出口

設定好路由後，在根 `AppComponent` 範本內加入一個 `<router-outlet>`。`<router-outlet>` 指令會告訴 Angular 路由器，在與路由相符時要在哪裡渲染檢視。

`ChildrenOutletContexts` 保存了關於 outlet 與已啟用路由的資訊。每個 `Route` 的 `data` 屬性可以用來為路由轉場製作動畫。

<code-example header="src/app/app.component.html" path="animations/src/app/app.component.html" region="route-animations-outlet"></code-example>

`AppComponent` 定義了一個可以偵測檢視何時變更的方法。該方法會根據路由設定 `data` 屬性值，將一個動畫狀態值指派給動畫觸發器（`@routeAnimation`）。以下是 `AppComponent` 中偵測路由變更發生時機的方法範例。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="get-route-animations-data"></code-example>

`getRouteAnimationData()` 方法會取得 outlet 的值。它會回傳一個字串，代表根據目前作用中路由的自訂資料所決定的動畫狀態。使用這個資料來控制每個路由要執行哪個轉場。

## 動畫定義

動畫可以直接在元件內部定義。在這個範例中，你將在一個獨立的檔案中定義動畫，以便重複使用動畫。

下列程式碼片段定義了一個名為 `slideInAnimation` 的可重複使用動畫。

<code-example header="src/app/animations.ts" path="animations/src/app/animations.ts" region="route-animations"></code-example>

動畫定義會執行下列工作：

*   定義兩個轉場（單一 `trigger` 可以定義多個狀態與轉場）
*   調整宿主檢視與子檢視的樣式，以控制它們在轉場期間的相對位置
*   使用 `query()` 來判斷哪個子檢視正在進入宿主檢視、哪個正在離開

路由變更會啟用動畫觸發器，並套用符合狀態變更的轉場。

<div class="alert is-helpful">

**注意**：<br />
轉場狀態必須符合路由設定中定義的 `data` 屬性值。

</div>

將可重複使用的動畫（`slideInAnimation`）加入 `AppComponent` 的 `animations` 中繼資料，讓動畫定義可以在應用程式中使用。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="define"></code-example>

### 為宿主與子元件設定樣式

在轉場期間，新檢視會直接插入在舊檢視之後，兩個元素會同時出現在螢幕上。為防止這種行為，請更新宿主檢視以使用相對定位。接著，更新被移除與被插入的子檢視以使用絕對定位。將這些樣式加入檢視後，會讓容器在原地產生動畫，並防止一個檢視影響另一個檢視在頁面上的位置。

<code-example header="src/app/animations.ts (excerpt)" path="animations/src/app/animations.ts" region="style-view"></code-example>

### 查詢檢視容器

使用 `query()` 方法尋找目前宿主元件內的項目並為其製作動畫。`query(":enter")` 陳述式會回傳正在插入的檢視，而 `query(":leave")` 會回傳正在移除的檢視。

假設你正在從 *Home =&gt; About* 進行路由。

<code-example header="src/app/animations.ts (excerpt)" path="animations/src/app/animations.ts" region="query"></code-example>

動畫程式碼在為檢視設定樣式後會執行下列動作：

1.  `query(':enter', style({ left: '-100%' }))` 會比對被加入的檢視，並透過將新加入的檢視定位到最左側來隱藏它。
1.  在正在離開的檢視上呼叫 `animateChild()`，以執行其子動畫。
1.  使用 [`group()`](api/animations/group) 函式，讓內部動畫平行執行。
1.  在 [`group()`](api/animations/group) 函式內：
    1.  查詢被移除的檢視，並為其製作動畫，讓它向右滑出很遠。
    1.  使用緩動函式與持續時間為檢視製作動畫，讓新檢視滑入。

這個動畫會讓 `about` 檢視從左側滑入。

1.  在主動畫完成後，於新檢視上呼叫 `animateChild()` 方法，以執行其子動畫。

現在你已經有一個基本的、可路由的動畫，可以將路由從一個檢視動畫化到另一個檢視。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

*   [Angular 動畫簡介](guide/animations)
*   [轉場與觸發器](guide/transition-and-triggers)
*   [複雜動畫序列](guide/complex-animation-sequences)
*   [可重複使用的動畫](guide/reusable-animations)

@reviewed 2022-10-11
