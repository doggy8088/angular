# 使用路由加入導覽

Tour of Heroes 應用程式有了新的需求：

*   加入一個*儀表板*檢視
*   加入在*英雄*與*儀表板*檢視之間導覽的功能
*   當使用者在任一檢視中點選英雄名稱時，導覽到所選英雄的詳細檢視
*   當使用者點選電子郵件中的*深層連結*時，開啟特定英雄的詳細檢視

<div class="alert is-helpful">

關於本頁說明的範例應用程式，請參閱 <live-example></live-example>。

</div>

完成後，使用者可以像這樣導覽應用程式：

<div class="lightbox">

<img alt="檢視導覽" src="generated/images/guide/toh/nav-diagram.png">

</div>

## 加入 `AppRoutingModule`

在 Angular 中，最佳做法是在一個獨立的頂層模組中載入並設定路由器。
路由器專門負責路由，並由根模組 `AppModule` 匯入。

按照慣例，模組類別名稱是 `AppRoutingModule`，位於 `src/app` 目錄中的 `app-routing.module.ts`。

執行 `ng generate` 來建立應用程式路由模組。

<code-example format="shell" language="shell">

ng generate module app-routing --flat --module=app

</code-example>

<div class="alert is-helpful">

| 參數           | 詳細說明 |
|:---            |:---     |
| `--flat`       | 把檔案放在 `src/app`，而不是放在自己的目錄中。                   |
| `--module=app` | 告訴 `ng generate` 把它註冊到 `AppModule` 的 `imports` 陣列中。 |

</div>

`ng generate` 建立的檔案如下所示：

<code-example header="src/app/app-routing.module.ts (generated)" path="toh-pt5/src/app/app-routing.module.0.ts"></code-example>

請把它取代為以下內容：

<code-example header="src/app/app-routing.module.ts (updated)" path="toh-pt5/src/app/app-routing.module.1.ts"></code-example>

首先，`app-routing.module.ts` 檔案會匯入 `RouterModule` 與 `Routes`，讓應用程式具備路由功能。
下一個匯入 `HeroesComponent`，讓路由器在你設定路由後有地方可去。

請注意，`CommonModule` 參照與 `declarations` 陣列是不必要的，因此不再是 `AppRoutingModule` 的一部分。
以下各節會更詳細地說明 `AppRoutingModule` 的其餘部分。

### 路由

檔案的下一部分是你設定路由的地方。
*路由*會告訴路由器，當使用者點選連結或把 URL 貼到瀏覽器網址列時，應顯示哪個檢視。

由於 `app-routing.module.ts` 已經匯入了 `HeroesComponent`，你可以在 `routes` 陣列中使用它：

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="heroes-route"></code-example>

典型的 Angular `Route` 有兩個屬性：

| 屬性        | 詳細說明 |
|:---         |:---     |
| `path`      | 與瀏覽器網址列中 URL 相符的字串。                  |
| `component` | 路由器在導覽到此路由時應建立的元件。 |

這會告訴路由器把該 URL 對應到 `path: 'heroes'`，並在 URL 類似 `localhost:4200/heroes` 時顯示 `HeroesComponent`。

### `RouterModule.forRoot()`

`@NgModule` 中繼資料會初始化路由器，並開始監聽瀏覽器位置的變更。

以下這行會把 `RouterModule` 加入 `AppRoutingModule` 的 `imports` 陣列，並透過呼叫 `RouterModule.forRoot()`，在一個步驟中以 `routes` 設定它：

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="ngmodule-imports"></code-example>

<div class="alert is-helpful">

這個方法之所以稱為 `forRoot()`，是因為你是在應用程式的根層級設定路由器。
`forRoot()` 方法會提供路由所需的服務提供者與指令，並根據目前的瀏覽器 URL 執行初始導覽。

</div>

接著，`AppRoutingModule` 會匯出 `RouterModule`，讓整個應用程式都能使用它。

<code-example header="src/app/app-routing.module.ts (exports array)" path="toh-pt5/src/app/app-routing.module.ts" region="export-routermodule"></code-example>

## 加入 `RouterOutlet`

<!-- markdownlint-disable MD001 -->

開啟 `AppComponent` 範本，把 `<app-heroes>` 元素取代為 `<router-outlet>` 元素。

<code-example header="src/app/app.component.html (router-outlet)" path="toh-pt5/src/app/app.component.html" region="outlet"></code-example>

`AppComponent` 範本不再需要 `<app-heroes>`，因為應用程式只有在使用者導覽到它時才會顯示 `HeroesComponent`。

`<router-outlet>` 會告訴路由器要在何處顯示路由檢視。

<div class="alert is-helpful">

`RouterOutlet` 是路由器指令之一，`AppComponent` 之所以能使用它，是因為 `AppModule` 匯入了匯出 `RouterModule` 的 `AppRoutingModule`。
你在本教學一開始執行的 `ng generate` 命令，因為 `--module=app` 旗標而加入了這個匯入。
如果你沒有使用 `ng generate` 命令來建立 `app-routing.module.ts`，請把 `AppRoutingModule` 匯入 `app.module.ts`，並把它加入 `NgModule` 的 `imports` 陣列。

</div>

<!-- markdownlint-disable MD024 -->

#### 試試看

如果你還沒有繼續提供應用程式，請執行 `ng serve`，在瀏覽器中查看你的應用程式。

瀏覽器應會重新整理並顯示應用程式標題，但不會顯示英雄清單。

查看瀏覽器的網址列。
URL 的結尾是 `/`。
通往 `HeroesComponent` 的路由路徑是 `/heroes`。

在瀏覽器網址列的 URL 後面加上 `/heroes`。
你應該會看到熟悉的英雄總覽／詳細檢視。

從瀏覽器網址列的 URL 中移除 `/heroes`。
瀏覽器應會重新整理並顯示應用程式標題，但不會顯示英雄清單。

<!-- markdownlint-enable MD001 -->
<!-- markdownlint-enable MD024 -->

<a id="routerlink"></a>

## 使用 `routerLink` 加入導覽連結

理想情況下，使用者應該能夠點選連結來導覽，而不是把路由 URL 貼到網址列。

加入一個 `<nav>` 元素，並在其中加入一個錨點元素，點選時會觸發導覽到 `HeroesComponent`。
修改後的 `AppComponent` 範本如下所示：

<code-example header="src/app/app.component.html (heroes RouterLink)" path="toh-pt5/src/app/app.component.html" region="heroes"></code-example>

[`routerLink` 屬性](#routerlink)設為 `"/heroes"`，也就是路由器用來對應到 `HeroesComponent` 路由的字串。
`routerLink` 是 [`RouterLink` 指令](api/router/RouterLink)的選取器，它會把使用者的點選轉換為路由器導覽。
它是 `RouterModule` 中另一個公開指令。

瀏覽器會重新整理並顯示應用程式標題與英雄連結，但不會顯示英雄清單。

點選該連結。
網址列會更新為 `/heroes`，並出現英雄清單。

<div class="alert is-helpful">

請把私有 CSS 樣式加入 `app.component.css`，讓這個與未來的導覽連結看起來更好看，樣式列在下方的[最終程式碼檢閱](#appcomponent)中。

</div>

## 加入儀表板檢視

當應用程式有多個檢視時，路由才更有意義，然而
*Tour of Heroes* 應用程式目前只有英雄檢視。

若要加入 `DashboardComponent`，請如下執行 `ng generate`：

<code-example format="shell" language="shell">

ng generate component dashboard

</code-example>

`ng generate` 會建立 `DashboardComponent` 的檔案，並在 `AppModule` 中宣告它。

請如下所示，取代這些檔案中的預設內容：

<code-tabs>
    <code-pane header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.1.html"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css"></code-pane>
</code-tabs>

*範本*會呈現一個英雄名稱連結的網格。

*   `*ngFor` 重複器會建立與元件 `heroes` 陣列中一樣多的連結。
*   這些連結會由 `dashboard.component.css` 設定樣式，呈現為彩色區塊。
*   這些連結目前還不會連到任何地方。

*類別*與 `HeroesComponent` 類別類似。

*   它定義了一個 `heroes` 陣列屬性
*   建構子預期 Angular 把 `HeroService` 注入私有的 `heroService` 屬性
*   `ngOnInit()` 生命週期鉤子會呼叫 `getHeroes()`

這個 `getHeroes()` 會回傳位置 1 到 5 的英雄切片清單，只回傳第二、三、四、五位英雄。

<code-example header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts" region="getHeroes"></code-example>

### 加入儀表板路由

若要導覽到儀表板，路由器需要一個適當的路由。

在 `app-routing.module.ts` 檔案中匯入 `DashboardComponent`。

<code-example header="src/app/app-routing.module.ts (import DashboardComponent)" path="toh-pt5/src/app/app-routing.module.ts" region="import-dashboard"></code-example>

在 `routes` 陣列中加入一個路由，讓路徑對應到 `DashboardComponent`。

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="dashboard-route"></code-example>

### 加入預設路由

當應用程式啟動時，瀏覽器的網址列會指向網站的根目錄。
那與任何現有路由都不相符，因此路由器不會導覽到任何地方。
`<router-outlet>` 下方的空間是空白的。

若要讓應用程式自動導覽到儀表板，請在 `routes` 陣列中加入以下路由。

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="redirect-route"></code-example>

此路由會把完全符合空路徑的 URL 重新導向到路徑為 `'/dashboard'` 的路由。

瀏覽器重新整理後，路由器會載入 `DashboardComponent`，瀏覽器網址列會顯示 `/dashboard` URL。

### 在外殼中加入儀表板連結

使用者應該能夠透過點選頁面頂部附近導覽區域中的連結，在 `DashboardComponent` 與 `HeroesComponent` 之間導覽。

請在 `AppComponent` 外殼範本中、*英雄*連結的上方加入一個儀表板導覽連結。

<code-example header="src/app/app.component.html" path="toh-pt5/src/app/app.component.html"></code-example>

瀏覽器重新整理後，你可以透過點選連結，在這兩個檢視之間自由導覽。

<a id="hero-details"></a>

## 導覽到英雄詳細資料

`HeroDetailComponent` 會顯示所選英雄的詳細資料。
目前 `HeroDetailComponent` 只會顯示在 `HeroesComponent` 的底部。

使用者應該能夠透過以下三種方式取得這些詳細資料。

1.  點選儀表板中的英雄。
1.  點選英雄清單中的英雄。
1.  把識別要顯示英雄的「深層連結」URL 貼到瀏覽器網址列。

本節會啟用導覽到 `HeroDetailComponent` 的功能，並讓它脫離 `HeroesComponent`。

### 從 `HeroesComponent` 刪除*英雄詳細資料*

當使用者在 `HeroesComponent` 中點選英雄時，應用程式應導覽到 `HeroDetailComponent`，以英雄詳細檢視取代英雄清單檢視。
英雄清單檢視不應再像現在這樣顯示英雄詳細資料。

開啟 `heroes/heroes.component.html`，並從底部刪除 `<app-hero-detail>` 元素。

點選英雄項目現在不會有任何作用。
你可以在啟用路由到 `HeroDetailComponent` 後修正這個問題。

### 加入*英雄詳細資料*路由

像 `~/detail/11` 這樣的 URL，很適合作為導覽到 `id` 為 `11` 的英雄的*英雄詳細資料*檢視。

開啟 `app-routing.module.ts` 並匯入 `HeroDetailComponent`。

<code-example header="src/app/app-routing.module.ts (import HeroDetailComponent)" path="toh-pt5/src/app/app-routing.module.ts" region="import-herodetail"></code-example>

接著在 `routes` 陣列中加入一個*參數化*路由，讓路徑模式對應到*英雄詳細資料*檢視。

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="detail-route"></code-example>

路徑 `path` 中的冒號 `:` 字元表示 `:id` 是特定英雄 `id` 的預留位置。

此時，所有應用程式路由都已就緒。

<code-example header="src/app/app-routing.module.ts (all routes)" path="toh-pt5/src/app/app-routing.module.ts" region="routes"></code-example>

### `DashboardComponent` 英雄連結

`DashboardComponent` 的英雄連結目前沒有任何作用。

既然路由器已有通往 `HeroDetailComponent` 的路由，請修正儀表板英雄連結，讓它使用*參數化*的儀表板路由進行導覽。

<code-example header="src/app/dashboard/dashboard.component.html (hero links)" path="toh-pt5/src/app/dashboard/dashboard.component.html" region="click"></code-example>

你正在 `*ngFor` 重複器中使用 Angular 的[插值繫結](guide/interpolation)，把目前迭代的 `hero.id` 插入每個 [`routerLink`](#routerlink)。

<a id="heroes-component-links"></a>

### `HeroesComponent` 英雄連結

`HeroesComponent` 中的英雄項目是 `<li>` 元素，其 click 事件會繫結到元件的 `onSelect()` 方法。

<code-example header="src/app/heroes/heroes.component.html (list with onSelect)" path="toh-pt4/src/app/heroes/heroes.component.html" region="list"></code-example>

移除 `<li>` 的內部 HTML。
用錨點 `<a>` 元素包住徽章與名稱。
在錨點上加入一個 `routerLink` 屬性，與儀表板範本中的相同。

<code-example header="src/app/heroes/heroes.component.html (list with links)" path="toh-pt5/src/app/heroes/heroes.component.html" region="list"></code-example>

請務必修正 `heroes.component.css` 中的私有樣式表，讓清單看起來和之前一樣。
修改後的樣式列在本指南底部的[最終程式碼檢閱](#heroescomponent)中。

#### 移除無用程式碼 - 選用

雖然 `HeroesComponent` 類別仍然可以運作，但 `onSelect()` 方法與 `selectedHero` 屬性已不再使用。

為未來的自己整理一下是很好的做法。
以下是刪除無用程式碼後的類別。

<code-example header="src/app/heroes/heroes.component.ts (cleaned up)" path="toh-pt5/src/app/heroes/heroes.component.ts" region="class"></code-example>

## 可路由的 `HeroDetailComponent`

父元件 `HeroesComponent` 過去會設定 `HeroDetailComponent.hero` 屬性，再由 `HeroDetailComponent` 顯示英雄。

`HeroesComponent` 現在不再這樣做了。
現在路由器會回應像 `~/detail/12` 這樣的 URL，來建立 `HeroDetailComponent`。

`HeroDetailComponent` 需要新的方式來取得要顯示的英雄。
本節會說明以下內容：

*   取得建立它的路由
*   從路由中擷取 `id`
*   使用 `HeroService` 從伺服器取得具有該 `id` 的英雄

加入以下匯入：

<code-example header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="added-imports"></code-example>

<a id="hero-detail-ctor"></a>

把 `ActivatedRoute`、`HeroService` 與 `Location` 服務注入建構子，並把它們的值儲存在私有欄位中：

<code-example header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ctor"></code-example>

[`ActivatedRoute`](api/router/ActivatedRoute) 持有關於通往此 `HeroDetailComponent` 執行個體的路由資訊。
此元件感興趣的是從 URL 中擷取的路由參數。
「id」參數就是要顯示的英雄的 `id`。

[`HeroService`](tutorial/tour-of-heroes/toh-pt4) 會從遠端伺服器取得英雄資料，此元件會用它來取得要顯示的英雄。

[`location`](api/common/Location) 是 Angular 用來與瀏覽器互動的服務。
此服務可讓你導覽回上一個檢視。

### 擷取 `id` 路由參數

在 `ngOnInit()` [生命週期鉤子](guide/lifecycle-hooks#oninit)中呼叫 `getHero()`，並如下定義它。

<code-example header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ngOnInit"></code-example>

`route.snapshot` 是元件建立後不久的路由資訊靜態快照。

`paramMap` 是從 URL 中擷取的路由參數值字典。
`"id"` 鍵會回傳要擷取的英雄的 `id`。

路由參數永遠是字串。
JavaScript 的 `Number` 函式會把字串轉換為數字，而這正是英雄 `id` 應有的型別。

瀏覽器會重新整理，應用程式會因編譯器錯誤而當掉。
`HeroService` 沒有 `getHero()` 方法。
現在就加入它。

### 加入 `HeroService.getHero()`

開啟 `HeroService`，在 `getHeroes()` 方法之後加入以下 `getHero()` 方法，並帶入 `id`：

<code-example header="src/app/hero.service.ts (getHero)" path="toh-pt5/src/app/hero.service.ts" region="getHero"></code-example>

<div class="alert is-important">

**IMPORTANT**: <br />
反引號 \( <code>&grave;</code> \) 字元定義了一個 JavaScript [範本字面值](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)，用來嵌入 `id`。

</div>

如同 [`getHeroes()`](tutorial/tour-of-heroes/toh-pt4#可觀察的-heroservice)，`getHero()` 具有非同步簽名。
它會使用 RxJS 的 `of()` 函式，以 `Observable` 的形式回傳一個*模擬英雄*。

你可以把 `getHero()` 改寫為真正的 `Http` 請求，而不需變更呼叫它的 `HeroDetailComponent`。

<!-- markdownlint-disable MD024 -->

#### 試試看

瀏覽器會重新整理，應用程式會再次正常運作。
你可以在儀表板或英雄清單中點選英雄，導覽到該英雄的詳細檢視。

如果你在瀏覽器網址列中貼上 `localhost:4200/detail/12`，路由器會導覽到 `id: 12` 的英雄的詳細檢視，也就是 **Dr Nice**。

<!-- markdownlint-enable MD024 -->

<a id="goback"></a>

### 找到回去的路

點選瀏覽器的上一頁按鈕，你可以回到上一頁。這可能是英雄清單或儀表板檢視，取決於是哪一個把你帶到詳細檢視。

在 `HeroDetail` 檢視上有一個可以做到這件事的按鈕會很好。

在元件範本底部加入一個*返回*按鈕，並把它繫結到元件的 `goBack()` 方法。

<code-example header="src/app/hero-detail/hero-detail.component.html (back button)" path="toh-pt5/src/app/hero-detail/hero-detail.component.html" region="back-button"></code-example>

在元件類別中加入一個 `goBack()` *方法*，使用你[先前注入](#hero-detail-ctor)的 `Location` 服務，在瀏覽器的歷史紀錄堆疊中向後導覽一步。

<code-example header="src/app/hero-detail/hero-detail.component.ts (goBack)" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="goBack"></code-example>

重新整理瀏覽器並開始點選。
使用者現在可以使用新的按鈕在應用程式中導覽。

在你把私有 CSS 樣式加入 `hero-detail.component.css` 後，詳細資料看起來會更好，這些樣式列在下方其中一個[「最終程式碼檢閱」](#最終程式碼檢閱)頁籤中。

## 最終程式碼檢閱

<!-- markdownlint-disable MD001 -->

以下是本頁討論過的程式碼檔案。

<a id="approutingmodule"></a>
<a id="appmodule"></a>

#### `AppRoutingModule`、`AppModule` 與 `HeroService`

<code-tabs>
    <code-pane header="src/app/app.module.ts" path="toh-pt5/src/app/app.module.ts"></code-pane>
    <code-pane header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts"></code-pane>
    <code-pane header="src/app/hero.service.ts" path="toh-pt5/src/app/hero.service.ts"></code-pane>
</code-tabs>

<a id="appcomponent"></a>

#### `AppComponent`

<code-tabs>
    <code-pane header="src/app/app.component.html" path="toh-pt5/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/app.component.ts" path="toh-pt5/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.component.css" path="toh-pt5/src/app/app.component.css"></code-pane>
</code-tabs>

<a id="dashboardcomponent"></a>

#### `DashboardComponent`

<code-tabs>
    <code-pane header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.html"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css"></code-pane>
</code-tabs>

<a id="heroescomponent"></a>

#### `HeroesComponent`

<code-tabs>
    <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt5/src/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt5/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.css" path="toh-pt5/src/app/heroes/heroes.component.css"></code-pane>
</code-tabs>

<a id="herodetailcomponent"></a>

#### `HeroDetailComponent`

<code-tabs>
    <code-pane header="src/app/hero-detail/hero-detail.component.html" path="toh-pt5/src/app/hero-detail/hero-detail.component.html"></code-pane>
    <code-pane header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts"></code-pane>
    <code-pane header="src/app/hero-detail/hero-detail.component.css" path="toh-pt5/src/app/hero-detail/hero-detail.component.css"></code-pane>
</code-tabs>

<!-- markdownlint-enable MD001 -->

## 摘要

*   你加入了 Angular 路由器，可在不同元件之間導覽
*   你把 `AppComponent` 變成一個導覽外殼，內含 `<a>` 連結與 `<router-outlet>`
*   你在 `AppRoutingModule` 中設定了路由器
*   你定義了路由、重新導向路由與參數化路由
*   你在錨點元素中使用了 `routerLink` 指令
*   你把緊密耦合的主／詳細檢視重構成路由詳細檢視
*   你使用路由器連結參數，導覽到使用者所選英雄的詳細檢視
*   你與其他元件共享了 `HeroService`

@reviewed 2022-02-28
