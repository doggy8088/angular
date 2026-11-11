# 路由轉場動畫

路由讓使用者能在應用程式中的不同路由之間導覽。

## 啟用路由轉場動畫 {#enable-routing-transition-animation}

當使用者從一個路由導覽到另一個路由時，Angular 路由器會將 URL 路徑對應到相關的元件，並顯示其檢視。
為這段路由轉場加入動畫，能大幅提升使用者體驗。

Angular 路由器內建高階動畫函式，讓你能在路由變更時為檢視之間的轉場加入動畫。
若要在切換路由時產生動畫序列，你需要定義巢狀的動畫序列。
從承載檢視的最上層元件開始，並在承載內嵌檢視的元件中巢狀地加入動畫。

若要啟用路由轉場動畫，請執行下列步驟：

1. 建立定義可能路由的路由設定。對於以 NgModule 為基礎的應用程式，這包括建立一個 `RouterModule`，並將它加入主要的 `AppModule`。
1. 加入路由器出口，告訴 Angular 路由器要將啟用狀態的元件放置在 DOM 中的哪個位置。
1. 定義動畫。

透過在兩個路由 *Home* 與 *About* 之間導覽，來說明路由轉場動畫；這兩個路由分別與 `HomeComponent` 和 `AboutComponent` 檢視相關聯。
這兩個元件檢視都是最上層檢視的子檢視，由 `AppComponent` 承載。
實作一段路由轉場動畫，在兩個路由之間導覽時，讓新檢視向右滑入，並將舊檢視滑出。

<img alt="運作中的動畫" width="440" src="assets/images/guide/animations/route-animation.gif">

## 路由設定 {#route-configuration}

首先，設定一組路由。這份路由設定告訴路由器如何導覽。

建立一個 `Routes` 陣列來定義一組路由。在 `main.ts` 中呼叫 `bootstrapApplication` 函式時，將這些路由加入其 providers 陣列中的 `provideRouter` 函式。

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
  ]
});
```

Note: 對於以 `NgModule` 為基礎的應用程式：
使用 `RouterModule.forRoot` 方法來定義一組路由。
另外，將 `RouterModule` 加入主要模組 `AppModule` 的 `imports` 陣列。

在根模組 `AppModule` 中使用 `RouterModule.forRoot` 方法，註冊應用程式的最上層路由與提供者。
對於功能模組，則改呼叫 `RouterModule.forChild` 方法。

下列設定定義了應用程式可能的路由。

<docs-code header="src/app/app.routes.ts" path="adev/src/content/examples/animations/src/app/app.routes.ts" visibleRegion="route-animation-data"/>

`home` 與 `about` 路徑分別與 `HomeComponent` 和 `AboutComponent` 檢視相關聯。
當導覽符合對應路徑時，路由設定會告訴 Angular 路由器具現化 `HomeComponent` 與 `AboutComponent` 檢視。

每個路由的 `data` 屬性定義了與該路由相關聯的動畫專用設定鍵。
當路由變更時，`data` 屬性的值會被傳入 `AppComponent`。

HELPFUL: 你所使用的 `data` 屬性名稱可以是任意的。
例如，前例中所用的 *animation* 這個名稱就是任意選定的。

## 路由器出口 {#router-outlet}

設定好路由之後，在根元件 `AppComponent` 的範本中加入一個 `<router-outlet>`。
`<router-outlet>` 指令告訴 Angular 路由器，當路由符合時要在哪裡算繪檢視。

`ChildrenOutletContexts` 保存著出口與已啟用路由的相關資訊。
每個 `Route` 的 `data` 屬性都可以用來為路由轉場加入動畫。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/animations/src/app/app.component.html" visibleRegion="route-animations-outlet"/>

`AppComponent` 定義了一個方法，可以偵測檢視何時變更。
這個方法會依據路由設定的 `data` 屬性值，將動畫狀態值指派給動畫觸發器 \(`@routeAnimation`\)。
以下是一個偵測路由變更何時發生的 `AppComponent` 方法範例。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="get-route-animations-data"/>

`getRouteAnimationData()` 方法接收出口的值。它會依據目前啟用路由的自訂資料，傳回一個代表動畫狀態的字串。
使用這份資料來控制每個路由要執行哪一種轉場。

## 動畫定義 {#animation-definition}

動畫可以直接定義在你的元件裡面。
在本範例中，動畫定義在一個獨立的檔案中，這樣可以重複使用動畫。

下列程式碼片段定義了一個名為 `slideInAnimation` 的可重複使用動畫。

<docs-code header="src/app/animations.ts" path="adev/src/content/examples/animations/src/app/animations.ts" visibleRegion="route-animations"/>

這份動畫定義會執行下列工作：

* 定義兩個轉場（單一 `trigger` 可以定義多個狀態與轉場）
* 調整宿主與子檢視的樣式，以控制它們在轉場期間的相對位置
* 使用 `query()` 判斷哪一個子檢視正在進入宿主檢視、哪一個正在離開

路由變更時會啟用動畫觸發器，並套用與狀態變更相符的轉場。

HELPFUL: 轉場狀態必須與路由設定中所定義的 `data` 屬性值相符。

將可重複使用的動畫 \(`slideInAnimation`\) 加入 `AppComponent` 的 `animations` 中繼資料，讓這份動畫定義能在你的應用程式中使用。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="define"/>

### 設定宿主與子元件的樣式 {#style-the-host-and-child-components}

在轉場期間，新檢視會直接插入在舊檢視之後，兩個元素會同時出現在畫面上。
若要避免這種行為，請將宿主檢視改為使用相對定位。
接著，將被移除與被插入的子檢視改為使用絕對定位。
把這些樣式加入檢視後，容器會在原地進行動畫，也能避免一個檢視影響另一個檢視在頁面上的位置。

<docs-code header="src/app/animations.ts (excerpt)" path="adev/src/content/examples/animations/src/app/animations.ts" visibleRegion="style-view"/>

### 查詢檢視容器 {#query-the-view-containers}

使用 `query()` 方法，在目前的宿主元件中尋找元素並為其加入動畫。
`query(":enter")` 陳述式會傳回正在被插入的檢視，而 `query(":leave")` 會傳回正在被移除的檢視。

假設你正從 *Home => About* 進行路由。

<docs-code header="src/app/animations.ts (excerpt)" path="adev/src/content/examples/animations/src/app/animations.ts" visibleRegion="query"/>

在為檢視設定樣式之後，這段動畫程式碼會執行下列動作：

1. `query(':enter', style({ left: '-100%' }))` 符合被加入的檢視，並將新加入的檢視定位到最左側來隱藏它。
1. 對正在離開的檢視呼叫 `animateChild()`，執行它的子動畫。
1. 使用 [`group()`](api/animations/group) 函式，讓內部動畫平行執行。
1. 在 [`group()`](api/animations/group) 函式中：
    1. 查詢被移除的檢視，並為其加入動畫，使其滑向最右側。
    1. 使用緩動函式與持續時間為新檢視加入動畫，將它滑入。

        這個動畫會讓 `about` 檢視從左側滑入。

1. 對新檢視呼叫 `animateChild()` 方法，在主動畫完成後執行它的子動畫。

你現在已經有了一段基本的可用於路由的動畫，可以為從一個檢視到另一個檢視的路由加入動畫。

## 深入了解 Angular 動畫 {#more-on-angular-animations}

你可能也會對下列內容感興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫簡介"/>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場與觸發器"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜動畫序列"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
</docs-pill-row>
