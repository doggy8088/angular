# 路由轉場動畫

Routing 讓使用者可以在應用程式中的不同路由之間導航。

## 啟用路由轉場動畫

當使用者從一個路由導航到另一個路由時，Angular 路由器會將 URL 路徑對應到相關的元件並顯示其檢視。
為此路由轉換加上動畫效果可以大幅提升使用者體驗。

Angular 路由器附帶高階動畫函式，讓你可以在路由變更時為檢視之間的轉換加上動畫效果。
要在路由之間切換時產生動畫序列，你需要定義巢狀動畫序列。
從主機檢視的頂層組件開始，並在主機嵌入式檢視的組件中巢狀動畫。

如需啟用路由轉場動畫，請執行以下動作：

1. 建立一個路由組態，以定義可能的路由。對於基於 NgModule 的應用程式，這將包括建立一個 `RouterModule` 並將其新增至主 `AppModule`。
1. 新增一個路由器出口，以告訴 Angular 路由器在 DOM 中放置已啟用的元件。
1. 定義動畫。

說明路由器轉換動畫，在兩個路由之間導航，*首頁* 和 *關於* 分別與 `HomeComponent` 和 `AboutComponent` 檢視關聯。
這兩個元件檢視都是最上層檢視的子項，由 `AppComponent` 託管。
在兩個路由之間導航時，實作一個路由器轉換動畫，將新檢視滑入右側，並滑出舊檢視。

<img alt="動畫實際操作" width="440" src="assets/content/images/guide/animations/route-animation.gif">

## 路由設定

要開始，請設定一組路由。此路由配置告訴路由器如何導航。

建立一個 `Routes` 陣列來定義一組路由。將路由加入 `provideRouter` 函數中，在 `main.ts` 的 `bootstrapApplication` 函數呼叫的提供者陣列中。

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
  ]
});
```

註：針對基於 `NgModule` 的應用程式：
使用 `RouterModule.forRoot` 方法定義一組路由。
另外，將 `RouterModule` 新增至主模組 `AppModule` 的 `imports` 陣列中。

在根模組 `AppModule` 中使用 `RouterModule.forRoot` 方法，來註冊頂層應用程式路由和提供者。
對於功能模組，請改為呼叫 `RouterModule.forChild` 方法。

以下設定定義應用程式的可能路由。

<docs-code header="src/app/app.routes.ts" path="adev/src/content/examples/animations/src/app/app.routes.ts" visibleRegion="route-animation-data"/>

`home` 和 `about` 路徑與 `HomeComponent` 和 `AboutComponent` 檢視相關聯。
路由設定告訴 Angular 路由器當導覽與對應路徑相符時，要實例化 `HomeComponent` 和 `AboutComponent` 檢視。

每個路由的 `data` 屬性定義與路由關聯的關鍵動畫特定配置。
當路由變更時，`data` 屬性值會傳入 `AppComponent`。

HELPFUL: 您使用的 `data` 屬性名稱可以是任意名稱。
例如，在前一個範例中使用的名稱 *動畫* 是個任意選擇。

## 路由插座

配置好路由後，在根 `AppComponent` 範本內新增一個 `<router-outlet>`。
`<router-outlet>` 指令會告訴 Angular 路由器在與路由匹配時要在哪裡呈現檢視。

`ChildrenOutletContexts` 保存有關出口和已啟用路由的資訊。
每個 `Route` 的 `data` 屬性可以用來執行路由轉換動畫。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/animations/src/app/app.component.html" visibleRegion="route-animations-outlet"/>

`AppComponent` 定義了一個方法，該方法可以偵測檢視何時會變更。
此方法會根據路由組態 `data` 屬性值，將動畫狀態值指定給動畫觸發器 \(`@routeAnimation`\)。
以下是一個 `AppComponent` 方法的範例，它會偵測何時發生路由變更。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="get-route-animations-data"/>

`getRouteAnimationData()` 方法採用 outlet 的值。它會傳回一個字串，這個字串代表動畫的狀態，該狀態是根據目前 active 路由的客製化資料而定。
使用此資料來控制每個路由要執行哪個轉場。

## 動畫定義

動畫可以定義在元件內。
對於這個範例，您在一個獨立檔案中定義動畫，這允許動畫的重複使用。

以下程式碼片段定義一個可重複使用的動畫，名為 `slideInAnimation`。

<docs-code header="src/app/animations.ts" path="adev/src/content/examples/animations/src/app/animations.ts" visibleRegion="route-animations"/>

動畫定義執行以下任務：

* 定義兩個轉場（單一 `trigger` 可以定義多個狀態和轉場）
* 調整主機和子檢視的樣式，以便在轉場期間控制它們的相對位置
* 使用 `query()` 來判斷哪個子檢視正在進入，哪個正在離開主機檢視

路線變更會啟用動畫觸發器，並套用與狀態變更相符的轉場。

HELPFUL: 轉換狀態必須與在路徑設定中定義的 `data` 屬性值相符。

透過將可重複使用的動畫 \(`slideInAnimation`\) 新增至 `AppComponent` 的 `animations` 元資料，讓動畫定義在應用程式中可用。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="define"/>

### 設定 host 和 child 元件的樣式

在轉換期間，新檢視會直接插入舊檢視之後，而且兩個元素會同時顯示在螢幕上。
若要防止這種行為，請更新主機檢視以使用相對定位。
然後，更新已移除和已插入的子檢視以使用絕對定位。
將這些樣式新增至檢視會在原地對容器執行動畫，並防止一個檢視影響另一個檢視在頁面上的位置。

<docs-code header="src/app/animations.ts (excerpt)" path="adev/src/content/examples/animations/src/app/animations.ts" visibleRegion="style-view"/>

### 查詢檢視容器

使用 `query()` 方法來尋找和動畫化當前主機元件內的元素。
`query(":enter")` 語句傳回正在插入的檢視，而 `query(":leave")` 傳回正在移除的檢視。

假設你正在從 *首頁 =&gt; 關於* 路由。

<docs-code header="src/app/animations.ts (excerpt)" path="adev/src/content/examples/animations/src/app/animations.ts" visibleRegion="query"/>

動畫程式碼在樣式化檢視後執行下列動作：

1. `query(':enter', style({ left: '-100%' }))` 匹配新增的檢視，並透過將其定位在最左邊來隱藏新增的檢視。
1. 對即將離開的檢視呼叫 `animateChild()`，以執行其子動畫。
1. 使用 [`group()`](api/animations/group) 函數使內部動畫並行執行。
1. 在 [`group()`](api/animations/group) 函數中：
    1. 查詢已移除的檢視並讓它動畫化，使其遠遠滑動到右邊。
    1. 透過為檢視加入緩衝函數和持續時間，讓新檢視滑入。

        此動畫會讓 `about` 檢視從左側滑入。

1. 在主動畫完成後，對新檢視呼叫 `animateChild()` 方法，以執行其子動畫。

現在，您有了一個基本的可路由動畫，可以將路由從一個檢視動畫到另一個檢視。

## 更多關於 Angular 動畫

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular 動畫介紹"/>
  <docs-pill href="guide/animations/transition-and-triggers" title="轉場與觸發器"/>
  <docs-pill href="guide/animations/complex-sequences" title="複雜動畫序列"/>
  <docs-pill href="guide/animations/reusable-animations" title="可重複使用的動畫"/>
</docs-pill-row>

