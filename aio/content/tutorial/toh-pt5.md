# 路由

Tour of Heroes 應用程式有了新的需求：

* 加入一個 *Dashboard* 檢視。
* 加入在 *Heroes* 與 *Dashboard* 檢視之間導覽的功能。
* 當使用者在任一檢視中點選英雄名稱時，導覽到所選英雄的詳細檢視。
* 當使用者點選電子郵件中的*深層連結*時，開啟特定英雄的詳細檢視。

完成後，使用者將能像這樣導覽應用程式：

<figure>

  <img src='generated/images/guide/toh/nav-diagram.png' alt="檢視導覽">

</figure>

## 加入 `AppRoutingModule`

Angular 的最佳做法，是在一個獨立的頂層模組中載入並設定路由器，該模組專門負責路由，並由根模組 `AppModule` 匯入。

按照慣例，模組類別名稱是 `AppRoutingModule`，位於 `src/app` 資料夾中的 `app-routing.module.ts`。

使用 CLI 來產生它。

<code-example language="sh" class="code-shell">
  ng generate module app-routing --flat --module=app
</code-example>

<div class="alert is-helpful">

`--flat` 把檔案放在 `src/app`，而不是放在自己的資料夾中。<br>
`--module=app` 告訴 CLI 把它註冊到 `AppModule` 的 `imports` 陣列中。
</div>

產生的檔案如下所示：

<code-example path="toh-pt5/src/app/app-routing.module.0.ts" 
  title="src/app/app-routing.module.ts (generated)">
</code-example>

一般而言，你不會在路由模組中宣告元件，因此可以刪除
`@NgModule.declarations` 陣列，並一併刪除 `CommonModule` 的參照。

你將使用 `RouterModule` 中的 `Routes` 來設定路由器，
因此請從 `@angular/router` 函式庫匯入這兩個符號。

加入一個 `@NgModule.exports` 陣列，並在其中放入 `RouterModule`。
匯出 `RouterModule` 可讓需要它的 `AppModule` 元件使用路由器指令。

`AppRoutingModule` 現在如下所示：

<code-example path="toh-pt5/src/app/app-routing.module.ts" 
  region="v1"
  title="src/app/app-routing.module.ts (v1)">
</code-example>

### 加入路由

*路由*會告訴路由器，當使用者點選連結或
把 URL 貼到瀏覽器網址列時，應顯示哪個檢視。

典型的 Angular `Route` 有兩個屬性：

1. `path`：與瀏覽器網址列中 URL 相符的字串。
1. `component`：路由器在導覽到此路由時應建立的元件。

你打算在 URL 類似 `localhost:4200/heroes` 時導覽到 `HeroesComponent`。

匯入 `HeroesComponent`，讓你可以在 `Route` 中參照它。
然後定義一個路由陣列，其中只有一個指向該元件的 `route`。

<code-example path="toh-pt5/src/app/app-routing.module.ts" 
  region="heroes-route">
</code-example>

設定完成後，路由器會把該 URL 對應到 `path: 'heroes'`
並顯示 `HeroesComponent`。

### _RouterModule.forRoot()_

你首先必須初始化路由器，並讓它開始監聽瀏覽器位置的變更。

把 `RouterModule` 加入 `@NgModule.imports` 陣列，並
在同一個步驟中、於 `imports` 陣列_內_呼叫
`RouterModule.forRoot()`，以 `routes` 設定它，如下所示：

<code-example path="toh-pt5/src/app/app-routing.module.ts" 
  region="ngmodule-imports">
</code-example>

<div class="alert is-helpful">

  這個方法之所以稱為 `forRoot()`，是因為你是在應用程式的根層級設定路由器。
  `forRoot()` 方法會提供路由所需的服務提供者與指令，並根據目前的瀏覽器 URL 執行初始導覽。

</div>

## 加入 _RouterOutlet_

開啟 `AppComponent` 範本，把 `<app-heroes>` 元素取代為 `<router-outlet>` 元素。

<code-example path="toh-pt5/src/app/app.component.html" 
  region="outlet"
  title="src/app/app.component.html (router-outlet)">
</code-example>

你移除了 `<app-heroes>`，因為只有在使用者導覽到它時才會顯示 `HeroesComponent`。

`<router-outlet>` 會告訴路由器要在何處顯示路由檢視。

<div class="alert is-helpful">

`RouterOutlet` 是路由器指令之一，`AppComponent` 之所以能使用它，
是因為 `AppModule` 匯入了匯出 `RouterModule` 的 `AppRoutingModule`。

</div>

#### 試試看

你應該仍在執行這個 CLI 命令。

<code-example language="sh" class="code-shell">
  ng serve
</code-example>

瀏覽器應會重新整理並顯示應用程式標題，但不會顯示英雄清單。

查看瀏覽器的網址列。
URL 的結尾是 `/`。
通往 `HeroesComponent` 的路由路徑是 `/heroes`。

在瀏覽器網址列的 URL 後面加上 `/heroes`。
你應該會看到熟悉的英雄主／詳細檢視。

{@a routerlink}

## 加入導覽連結（`routerLink`）

使用者不應該被迫把路由 URL 貼到網址列。
他們應該能夠點選連結來導覽。

加入一個 `<nav>` 元素，並在其中加入一個錨點元素，點選時
會觸發導覽到 `HeroesComponent`。
修改後的 `AppComponent` 範本如下所示：

<code-example 
  path="toh-pt5/src/app/app.component.html" 
  region="heroes"
  title="src/app/app.component.html (heroes RouterLink)">
</code-example>

[`routerLink` 屬性](#routerlink)設為 `"/heroes"`，
也就是路由器用來對應到 `HeroesComponent` 路由的字串。
`routerLink` 是 [`RouterLink` 指令](#routerlink)的選取器，
它會把使用者的點選轉換為路由器導覽。
它是 `RouterModule` 中另一個公開指令。

瀏覽器會重新整理並顯示應用程式標題與英雄連結，
但不會顯示英雄清單。

點選該連結。
網址列會更新為 `/heroes`，並出現英雄清單。

<div class="alert is-helpful">

請把私有 CSS 樣式加入 `app.component.css`，讓這個與未來的導覽連結看起來更好看，
樣式列在下方的[最終程式碼檢閱](#appcomponent)中。

</div>


## 加入儀表板檢視

當有多個檢視時，路由才更有意義。
目前為止只有英雄檢視。

使用 CLI 加入 `DashboardComponent`：

<code-example language="sh" class="code-shell">
  ng generate component dashboard
</code-example>

CLI 會產生 `DashboardComponent` 的檔案，並在 `AppModule` 中宣告它。

請如下取代這三個檔案的預設內容，然後回來進行一點討論：

<code-tabs>
  <code-pane 
    title="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.1.html">
  </code-pane>

  <code-pane 
    title="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts">
  </code-pane>

  <code-pane 
    title="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css">
  </code-pane>
</code-tabs>

_範本_會呈現一個英雄名稱連結的網格。

* `*ngFor` 重複器會建立與元件 `heroes` 陣列中一樣多的連結。
* 這些連結會由 `dashboard.component.css` 設定樣式，呈現為彩色區塊。
* 這些連結目前還不會連到任何地方，但[很快就會了](#hero-details)。

_類別_與 `HeroesComponent` 類別類似。
* 它定義了一個 `heroes` 陣列屬性。
* 建構子預期 Angular 把 `HeroService` 注入私有的 `heroService` 屬性。
* `ngOnInit()` 生命週期鉤子會呼叫 `getHeroes`。

這個 `getHeroes` 會回傳英雄的切片清單，取的是位置 1 和 5 之間的部分，只回傳 Top Heroes 中的四位（第 2、3、4 和 5 位）。

<code-example path="toh-pt5/src/app/dashboard/dashboard.component.ts" region="getHeroes">
</code-example>

### 加入儀表板路由

若要導覽到儀表板，路由器需要一個適當的路由。

在 `AppRoutingModule` 中匯入 `DashboardComponent`。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="import-dashboard" 
  title="src/app/app-routing.module.ts (import DashboardComponent)">
</code-example>

在 `AppRoutingModule.routes` 陣列中加入一個路由，讓路徑對應到 `DashboardComponent`。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="dashboard-route">
</code-example>

### 加入預設路由

當應用程式啟動時，瀏覽器的網址列會指向網站的根目錄。
那與任何現有路由都不相符，因此路由器不會導覽到任何地方。
`<router-outlet>` 下方的空間是空白的。

若要讓應用程式自動導覽到儀表板，請在 `AppRoutingModule.Routes` 陣列中加入以下
路由。

<code-example path="toh-pt5/src/app/app-routing.module.ts" region="redirect-route">
</code-example>

此路由會把完全符合空路徑的 URL 重新導向到路徑為 `'/dashboard'` 的路由。

瀏覽器重新整理後，路由器會載入 `DashboardComponent`，
瀏覽器網址列會顯示 `/dashboard` URL。

### 在外殼中加入儀表板連結

使用者應該能夠透過點選頁面頂部附近導覽區域中的連結，在
`DashboardComponent` 與 `HeroesComponent` 之間來回導覽。

請在 `AppComponent` 外殼範本中、*Heroes* 連結的上方加入一個儀表板導覽連結。

<code-example path="toh-pt5/src/app/app.component.html" title="src/app/app.component.html">
</code-example>

瀏覽器重新整理後，你可以透過點選連結，在這兩個檢視之間自由導覽。

{@a hero-details}
## 導覽到英雄詳細資料

`HeroDetailsComponent` 會顯示所選英雄的詳細資料。
目前 `HeroDetailsComponent` 只會顯示在 `HeroesComponent` 的底部

使用者應該能夠透過以下三種方式取得這些詳細資料。

1. 點選儀表板中的英雄。
1. 點選英雄清單中的英雄。
1. 把識別要顯示英雄的「深層連結」URL 貼到瀏覽器網址列。

在本節中，你將啟用導覽到 `HeroDetailsComponent` 的功能，
並讓它脫離 `HeroesComponent`。

### 從 `HeroesComponent` 刪除_英雄詳細資料_

當使用者在 `HeroesComponent` 中點選英雄項目時，應用程式應導覽到 `HeroDetailComponent`，
以英雄詳細檢視取代英雄清單檢視。
英雄清單檢視不應再像現在這樣顯示英雄詳細資料。

開啟 `HeroesComponent` 範本（`heroes/heroes.component.html`），
並從底部刪除 `<app-hero-detail>` 元素。

點選英雄項目現在不會有任何作用。
你可以在啟用路由到 `HeroDetailComponent` 後，[立刻修正這個問題](#heroes-component-links)。

### 加入_英雄詳細資料_路由

像 `~/detail/11` 這樣的 URL，很適合作為導覽到 *Hero Detail* 檢視（`id` 為 `11` 的英雄）的 URL。

開啟 `AppRoutingModule` 並匯入 `HeroDetailComponent`。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="import-herodetail" 
  title="src/app/app-routing.module.ts (import HeroDetailComponent)">
</code-example>

接著在 `AppRoutingModule.routes` 陣列中加入一個_參數化_路由，讓路徑模式對應到_英雄詳細資料_檢視。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="detail-route">
</code-example>

`path` 中的冒號（:）表示 `:id` 是特定英雄 `id` 的預留位置。

此時，所有應用程式路由都已就緒。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="routes" 
  title="src/app/app-routing.module.ts (all routes)">
</code-example>

### `DashboardComponent` 英雄連結

`DashboardComponent` 的英雄連結目前沒有任何作用。

既然路由器已有通往 `HeroDetailComponent` 的路由，
請修正儀表板英雄連結，讓它使用_參數化_的儀表板路由進行導覽。

<code-example 
  path="toh-pt5/src/app/dashboard/dashboard.component.html" 
  region="click" 
  title="src/app/dashboard/dashboard.component.html (hero links)">
</code-example>

你正在 `*ngFor` 重複器中使用 Angular 的[插值繫結](guide/template-syntax#interpolation)，把目前迭代的 `hero.id` 插入每個
[`routerLink`](#routerlink)。

{@a heroes-component-links}
### `HeroesComponent` 英雄連結

`HeroesComponent` 中的英雄項目是 `<li>` 元素，其 click 事件
會繫結到元件的 `onSelect()` 方法。

<code-example 
  path="toh-pt4/src/app/heroes/heroes.component.html" 
  region="list" 
  title="src/app/heroes/heroes.component.html (list with onSelect)">
</code-example>

把 `<li>` 改回只保留 `*ngFor` 的形式，
用錨點元素（`<a>`）包住徽章與名稱，
並在錨點上加入一個 `routerLink` 屬性，
與儀表板範本中的相同

<code-example 
  path="toh-pt5/src/app/heroes/heroes.component.html" 
  region="list" 
  title="src/app/heroes/heroes.component.html (list with links)">
</code-example>

你必須修正私有樣式表（`heroes.component.css`），讓
清單看起來和之前一樣。
修改後的樣式列在本指南底部的[最終程式碼檢閱](#heroescomponent)中。

#### 移除無用程式碼（選用）

雖然 `HeroesComponent` 類別仍然可以運作，
但 `onSelect()` 方法與 `selectedHero` 屬性已不再使用。

整理乾淨是很好的做法，你將來會感謝自己的。
以下是刪除無用程式碼後的類別。

<code-example 
  path="toh-pt5/src/app/heroes/heroes.component.ts"
  region="class" 
  title="src/app/heroes/heroes.component.ts (cleaned up)" linenums="false">
</code-example>

## 可路由的 *HeroDetailComponent*

先前，父元件 `HeroesComponent` 會設定 `HeroDetailComponent.hero`
屬性，再由 `HeroDetailComponent` 顯示英雄。

`HeroesComponent` 現在不再這樣做了。
現在路由器會回應像 `~/detail/11` 這樣的 URL，來建立 `HeroDetailComponent`。

`HeroDetailComponent` 需要一個新的方式來取得_要顯示的英雄_。

* 取得建立它的路由，
* 從路由中擷取 `id`
* 使用 `HeroService` 從伺服器取得具有該 `id` 的英雄

加入以下匯入：

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" 
  region="added-imports" 
  title="src/app/hero-detail/hero-detail.component.ts">
</code-example>

{@a hero-detail-ctor}

把 `ActivatedRoute`、`HeroService` 與 `Location` 服務注入
建構子，並把它們的值儲存在私有欄位中：

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ctor">
</code-example>

[`ActivatedRoute`](api/router/ActivatedRoute) 持有關於通往此 `HeroDetailComponent` 執行個體的路由資訊。
此元件感興趣的是從 URL 中擷取的路由參數。
「id」參數就是要顯示的英雄的 `id`。

[`HeroService`](tutorial/toh-pt4) 會從遠端伺服器取得英雄資料，
此元件將用它來取得要顯示的英雄。

[`location`](api/common/Location) 是 Angular 用來與瀏覽器互動的服務。
你將在[稍後](#goback)使用它，導覽回把你帶到這裡的檢視。

### 擷取 _id_ 路由參數

在 `ngOnInit()` [生命週期鉤子](guide/lifecycle-hooks#oninit)
中呼叫 `getHero()`，並如下定義它。

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ngOnInit">
</code-example>

`route.snapshot` 是元件建立後不久的路由資訊靜態快照。

`paramMap` 是從 URL 中擷取的路由參數值字典。
`"id"` 鍵會回傳要擷取的英雄的 `id`。

路由參數永遠是字串。
JavaScript 的 (+) 運算子會把字串轉換為數字，
而這正是英雄 `id` 應有的型別。

瀏覽器會重新整理，應用程式會因編譯器錯誤而當掉。
`HeroService` 沒有 `getHero()` 方法。
現在就加入它。

### 加入 `HeroService.getHero()`

開啟 `HeroService`，並加入這個 `getHero()` 方法

<code-example 
  path="toh-pt5/src/app/hero.service.ts" 
  region="getHero" 
  title="src/app/hero.service.ts (getHero)">
</code-example>

<div class="alert is-important">

請注意定義 JavaScript
[_範本字面值_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)（用來嵌入 `id`）的反引號（ &#96; ）。
</div>

如同 [`getHeroes()`](tutorial/toh-pt4#可觀察的-heroservice)，
`getHero()` 具有非同步簽名。
它會使用 RxJS 的 `of()` 函式，以 `Observable` 的形式回傳一個_模擬英雄_。

你將能把 `getHero()` 重新實作為真正的 `Http` 請求，
而不需變更呼叫它的 `HeroDetailComponent`。

#### 試試看

瀏覽器會重新整理，應用程式會再次正常運作。
你可以在儀表板或英雄清單中點選英雄，導覽到該英雄的詳細檢視。

如果你在瀏覽器網址列中貼上 `localhost:4200/detail/11`，
路由器會導覽到 `id: 11` 的英雄的詳細檢視，也就是「Mr. Nice」。

{@a goback}

### 找到回去的路

點選瀏覽器的上一頁按鈕，
你可以回到英雄清單或儀表板檢視，
取決於是哪一個把你帶到詳細檢視。

在 `HeroDetail` 檢視上有一個可以做到這件事的按鈕會很好。

在元件範本底部加入一個*返回*按鈕，並把它
繫結到元件的 `goBack()` 方法。

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.html" 
  region="back-button"
  title="src/app/hero-detail/hero-detail.component.html (back button)">
</code-example>

在元件類別中加入一個 `goBack()` _方法_，使用你[先前注入](#hero-detail-ctor)的 `Location` 服務，在瀏覽器的歷史紀錄堆疊中向後導覽一步。

<code-example path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="goBack" title="src/app/hero-detail/hero-detail.component.ts (goBack)">

</code-example>


重新整理瀏覽器並開始點選。
使用者可以在應用程式中四處導覽，從儀表板到英雄詳細資料再回來，
從英雄清單到迷你詳細資料再到英雄詳細資料，然後再回到英雄清單。

你已經達成了驅動本頁的全部導覽需求。

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案，你的應用程式應該像這樣 <live-example></live-example>。

{@a approutingmodule}
{@a appmodule}
#### _AppRoutingModule_、_AppModule_ 與 _HeroService_

<code-tabs>
  <code-pane 
    title="src/app/app-routing.module.ts" 
    path="toh-pt5/src/app/app-routing.module.ts">
  </code-pane>
  <code-pane 
    title="src/app/app.module.ts" 
    path="toh-pt5/src/app/app.module.ts">
  </code-pane>
  <code-pane 
    title="src/app/hero.service.ts" 
    path="toh-pt5/src/app/hero.service.ts">
  </code-pane>
</code-tabs>

{@a appcomponent}
#### _AppComponent_

<code-tabs>
  <code-pane 
    title="src/app/app.component.html"
    path="toh-pt5/src/app/app.component.html">
  </code-pane>

  <code-pane 
    title="src/app/app.component.css"
    path="toh-pt5/src/app/app.component.css">
  </code-pane>
</code-tabs>

{@a dashboardcomponent}
#### _DashboardComponent_

<code-tabs>
  <code-pane 
    title="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.html">
  </code-pane>

  <code-pane 
    title="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts">
  </code-pane>

  <code-pane 
    title="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css">
  </code-pane>
</code-tabs>

{@a heroescomponent}
#### _HeroesComponent_

<code-tabs>
  <code-pane 
    title="src/app/heroes/heroes.component.html" path="toh-pt5/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane 
    title="src/app/heroes/heroes.component.ts" 
    path="toh-pt5/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane 
    title="src/app/heroes/heroes.component.css" 
    path="toh-pt5/src/app/heroes/heroes.component.css">
  </code-pane>
</code-tabs>

{@a herodetailcomponent}
#### _HeroDetailComponent_

<code-tabs>
  <code-pane 
    title="src/app/hero-detail/hero-detail.component.html" path="toh-pt5/src/app/hero-detail/hero-detail.component.html">
  </code-pane>

  <code-pane 
    title="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>

  <code-pane 
    title="src/app/hero-detail/hero-detail.component.css" path="toh-pt5/src/app/hero-detail/hero-detail.component.css">
  </code-pane>
</code-tabs>

## 摘要

* 你加入了 Angular 路由器，可在不同元件之間導覽。
* 你把 `AppComponent` 變成一個導覽外殼，內含 `<a>` 連結與 `<router-outlet>`。
* 你在 `AppRoutingModule` 中設定了路由器。
* 你定義了簡單的路由、重新導向路由與參數化路由。
* 你在錨點元素中使用了 `routerLink` 指令。
* 你把緊密耦合的主／詳細檢視重構成路由詳細檢視。
* 你使用路由器連結參數，導覽到使用者所選英雄的詳細檢視。
* 你與多個元件共享了 `HeroService`。
