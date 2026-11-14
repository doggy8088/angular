@title
路由

@intro
加入 Angular 元件路由器，並學習如何在各檢視之間導覽。

@description

Tour of Heroes 應用程式有了新的需求：

* 加入一個 *Dashboard* 檢視。
* 加入在 *Heroes* 與 *Dashboard* 檢視之間導覽的功能。
* 當使用者在任一檢視中點選英雄名稱時，導覽到所選英雄的詳細檢視。
* 當使用者點選電子郵件中的*深層連結*時，開啟特定英雄的詳細檢視。

完成後，使用者將能像這樣導覽應用程式：

<figure>
  <img src='generated/images/guide/toh/nav-diagram.png' alt="檢視導覽">
</figure>

為了滿足這些需求，你將把 Angular 的路由器加入應用程式。

<div class="l-sub-section">

想了解路由器的更多資訊，請閱讀[路由與導覽](guide/router)頁面。

</div>

完成本頁後，應用程式應該像這樣 <live-example></live-example>。

## 上次停下的地方

在繼續 Tour of Heroes 之前，請確認你有以下結構。

<div class='filetree'>

  <div class='file'>
    angular-tour-of-heroes
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          app.component.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

        <div class='file'>
          hero.service.ts
        </div>

        <div class='file'>
          hero.ts
        </div>

        <div class='file'>
          hero-detail.component.ts
        </div>

        <div class='file'>
          mock-heroes.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        systemjs.config.js
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>

## 讓應用程式持續轉譯並執行

在終端機視窗中輸入以下命令：

<code-example language="sh" class="code-shell">
  npm start

</code-example>

這個命令會以「監看模式」執行 TypeScript 編譯器，在程式碼變更時自動重新編譯。
這個命令同時會在瀏覽器中啟動應用程式，並在程式碼變更時重新整理瀏覽器。

你可以持續建置 Tour of Heroes，不必停下來重新編譯或重新整理瀏覽器。

## 行動計畫

計畫如下：

* 把 `AppComponent` 變成只處理導覽的應用程式殼層。
* 把目前 `AppComponent` 中與 *Heroes* 相關的部分，搬到獨立的 `HeroesComponent` 中。
* 加入路由。
* 建立新的 `DashboardComponent`。
* 把 *Dashboard* 連進導覽結構中。

<div class="l-sub-section">

*路由*是*導覽*的另一個名稱。路由器就是在各檢視之間導覽的機制。

</div>

## 拆分 *AppComponent*

目前的應用程式會載入 `AppComponent`，並立即顯示英雄清單。

修改後的應用程式應該呈現一個殼層，提供檢視的選擇（*Dashboard* 與 *Heroes*），
然後預設顯示其中一個。

`AppComponent` 應該只處理導覽，所以你要把 *Heroes* 的顯示
從 `AppComponent` 移出，放到它自己的 `HeroesComponent` 中。

### *HeroesComponent*

`AppComponent` 目前專門負責 *Heroes*。
與其把程式碼移出 `AppComponent`，不如把它重新命名為 `HeroesComponent`，
並建立一個獨立的 `AppComponent` 殼層。

請執行以下步驟：

* 把 <code>app.component.ts</code> 檔案重新命名為 <code>heroes.component.ts</code>。
* 把 `AppComponent` 類別重新命名為 `HeroesComponent`（只在本檔案內局部重新命名）。
* 把選取器 `my-app` 重新命名為 `my-heroes`。

<code-example path="toh-pt5/src/app/heroes.component.ts" region="renaming" title="src/app/heroes.component.ts (showing renamings only)">

</code-example>

### 建立 *AppComponent*

新的 `AppComponent` 是應用程式殼層。
它的頂部會有若干導覽連結，下方則是顯示區域。

請執行以下步驟：

* 建立檔案 <code>src/app/app.component.ts</code>。
* 定義一個匯出的 `AppComponent` 類別。
* 在類別上方加入 `@Component` 裝飾器，選取器為 `my-app`。
* 把以下內容從 `HeroesComponent` 移到 `AppComponent`：

  * `title` 類別屬性。
  * `@Component` 範本中包含 `title` 繫結的 `<h1>` 元素。

* 在應用程式範本的標題正下方加入 `<my-heroes>` 元素，讓你仍然看得到英雄。
* 把 `HeroesComponent` 加入 `AppModule` 的 `declarations` 陣列，讓 Angular 能辨識 `<my-heroes>` 標籤。
* 把 `HeroService` 加入 `AppModule` 的 `providers` 陣列，因為你在其他每個檢視中都會需要它。
* 把 `HeroService` 從 `HeroesComponent` 的 `providers` 陣列中移除，因為它已經被提升了。
* 加入 `AppComponent` 所需的 `import` 陳述式。

第一版草稿如下所示：

<code-tabs>

  <code-pane title="src/app/app.component.ts (v1)" path="toh-pt5/src/app/app.component.1.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts (v1)" path="toh-pt5/src/app/app.module.1.ts">

  </code-pane>

</code-tabs>

應用程式仍然可以執行並顯示英雄。

## 加入路由

英雄不應該自動顯示，而應該在使用者點選按鈕後才顯示。
換句話說，使用者應該能夠導覽到英雄清單。

使用 Angular 路由器來啟用導覽。

Angular 路由器是一個外部的選用 Angular NgModule，稱為 `RouterModule`。
路由器由多個提供的服務（`RouterModule`）、
多個指令（`RouterOutlet, RouterLink, RouterLinkActive`）
以及一份設定（`Routes`）組合而成。你會先設定路由。

### *&lt;base href>*

開啟 `index.html`，並確認 `<head>` 區段的頂部有一個 `<base href="...">` 元素
（或一段能動態設定這個元素的指令碼）。

<code-example path="toh-pt5/src/index.html" region="base-href" title="src/index.html (base-href)">

</code-example>

<div class="callout is-important">

<header>
  base href 不可或缺
</header>

想了解更多資訊，請參閱[路由與導覽](guide/router)頁面中的
[設定 base href](guide/router)一節。

</div>

{@a configure-routes}

### 設定路由

為應用程式路由建立一個設定檔。

*路由*會告訴路由器，當使用者點選連結或
把 URL 貼到瀏覽器網址列時，應顯示哪個檢視。

把第一個路由定義為通往英雄元件的路由。

<code-example path="toh-pt5/src/app/app.module.2.ts" region="heroes" title="src/app/app.module.ts (heroes route)">

</code-example>

`Routes` 是一個*路由定義*陣列。

這個路由定義包含以下部分：

* *Path*：路由器會把這個路由的路徑，對應到瀏覽器網址列中的 URL（`heroes`）。
* *Component*：路由器在導覽到此路由時應建立的元件（`HeroesComponent`）。

<div class="l-sub-section">

想了解以 `Routes` 定義路由的更多資訊，請閱讀[路由與導覽](guide/router)頁面。

</div>

### 讓路由器可用

匯入 `RouterModule`，並把它加入 `AppModule` 的 imports 陣列。

<code-example path="toh-pt5/src/app/app.module.2.ts" title="src/app/app.module.ts (app routing)">

</code-example>

<div class="l-sub-section">

之所以呼叫 `forRoot()` 方法，是因為設定的路由器是在應用程式的根層級提供的。
`forRoot()` 方法會提供路由所需的 Router 服務提供者與指令，並
根據目前的瀏覽器 URL 執行初始導覽。

</div>

### 路由器出口

如果你把路徑 `/heroes` 貼到瀏覽器網址列中 URL 的結尾，
路由器應該會把它對應到 `heroes` 路由，並顯示 `HeroesComponent`。
不過，你必須告訴路由器要在哪裡顯示這個元件。
為此，你可以在範本結尾加入一個 `<router-outlet>` 元素。
`RouterOutlet` 是 `RouterModule` 提供的指令之一。
當使用者在應用程式中導覽時，路由器會把每個元件顯示在 `<router-outlet>` 的正下方。

### 路由器連結

使用者不應該被迫把路由 URL 貼到網址列。
改在範本中加入一個錨點標籤，點選時會觸發導覽到 `HeroesComponent`。

修改後的範本如下所示：

<code-example path="toh-pt5/src/app/app.component.1.ts" region="template-v2" title="src/app/app.component.ts (template-v2)">

</code-example>

請注意錨點標籤中的 `routerLink` 繫結。
`RouterLink` 指令（`RouterModule` 的另一個指令）繫結到一個字串，
用來告訴路由器，當使用者點選連結時要導覽到何處。

由於這個連結不是動態的，路由指令是以對路由路徑的一次性繫結來定義的。
回頭看路由設定，你可以確認 `'/heroes'` 就是通往 `HeroesComponent` 的路由路徑。

<div class="l-sub-section">

想了解動態路由器連結與連結參數陣列的更多資訊，請參閱
[路由與導覽](guide/router)頁面中的[附錄：連結參數陣列](guide/router#link-parameters-array)一節。

</div>

重新整理瀏覽器。瀏覽器會顯示應用程式標題與英雄連結，但不會顯示英雄清單。

<div class="l-sub-section">

瀏覽器的網址列顯示 `/`。
通往 `HeroesComponent` 的路由路徑是 `/heroes`，不是 `/`。
你很快就會加入一個與路徑 `/` 相符的路由。

</div>

點選 *Heroes* 導覽連結。網址列會更新為 `/heroes`，
並顯示英雄清單。

`AppComponent` 現在如下所示：

<code-example path="toh-pt5/src/app/app.component.1.ts" region="v2" title="src/app/app.component.ts (v2)">

</code-example>

*AppComponent* 現在已連接到路由器，並顯示路由檢視。
基於這個理由，也為了與其他種類的元件區分，
這種類型的元件稱為*路由器元件*。

## 加入儀表板

只有在多個檢視存在時，路由才有意義。
若要加入另一個檢視，請建立一個預留位置用的 `DashboardComponent`，讓使用者可以導覽前往與離開。

<code-example path="toh-pt5/src/app/dashboard.component.1.ts" title="src/app/dashboard.component.ts (v1)">

</code-example>

稍後你會讓這個元件更有用。

### 設定儀表板路由

若要教 `app.module.ts` 如何導覽到儀表板，
請匯入儀表板元件，並
把以下路由定義加入 `Routes` 定義陣列中。

<code-example path="toh-pt5/src/app/app.module.3.ts" region="dashboard" title="src/app/app.module.ts (Dashboard route)">

</code-example>

也要匯入 `DashboardComponent`，並把它加入 `AppModule` 的 `declarations`。

<code-example path="toh-pt5/src/app/app.module.ts" region="dashboard" title="src/app/app.module.ts (dashboard)">

</code-example>

### 加入重新導向路由

目前，瀏覽器啟動時網址列中是 `/`。
當應用程式啟動時，它應該顯示儀表板，並
在瀏覽器網址列中顯示 `/dashboard` URL。

為了達成這一點，請使用重新導向路由。把以下內容
加入路由定義陣列中：

<code-example path="toh-pt5/src/app/app.module.3.ts" region="redirect" title="src/app/app.module.ts (redirect)">

</code-example>

<div class="l-sub-section">

想了解*重新導向*的更多資訊，請參閱
[路由與導覽](guide/router)頁面中的[重新導向路由](guide/router)一節。

</div>

### 在範本中加入導覽

在範本中、*Heroes* 連結的正上方加入一個儀表板導覽連結。

<code-example path="toh-pt5/src/app/app.component.1.ts" region="template-v3" title="src/app/app.component.ts (template-v3)">

</code-example>

<div class="l-sub-section">

`<nav>` 標籤目前還沒有任何作用，但稍後你在為連結設定樣式時，它們會派上用場。

</div>

在瀏覽器中，前往應用程式根目錄（`/`）並重新載入。
應用程式會顯示儀表板，你可以在儀表板與英雄之間導覽。

## 在儀表板中加入英雄

為了讓儀表板更有趣，你會一覽顯示前四名英雄。

把 `template` 中繼資料換成 `templateUrl` 屬性，指向一個新的
範本檔案。

<code-example path="toh-pt5/src/app/dashboard.component.ts" region="metadata" title="src/app/dashboard.component.ts (metadata)">

</code-example>

用以下內容建立該檔案：

<code-example path="toh-pt5/src/app/dashboard.component.1.html" title="src/app/dashboard.component.html">

</code-example>

這裡再次使用 `*ngFor` 來迭代英雄清單並顯示他們的名字。
額外的 `<div>` 元素將有助於稍後的樣式設定。

### 共用 *HeroService*

若要填入元件的 `heroes` 陣列，你可以重複使用 `HeroService`。

先前，你把 `HeroService` 從 `HeroesComponent` 的 `providers` 陣列中移除，
並把它加入 `AppModule` 的 `providers` 陣列。
那個移動建立了一個單例的 `HeroService` 執行個體，可供應用程式的所有元件使用。
Angular 會注入 `HeroService`，你可以在 `DashboardComponent` 中使用它。

### 取得英雄

在 <code>dashboard.component.ts</code> 中，加入以下 `import` 陳述式。

<code-example path="toh-pt5/src/app/dashboard.component.ts" region="imports" title="src/app/dashboard.component.ts (imports)">

</code-example>

現在像這樣建立 `DashboardComponent` 類別：

<code-example path="toh-pt5/src/app/dashboard.component.ts" region="class" title="src/app/dashboard.component.ts (class)">

</code-example>

這類邏輯在 `HeroesComponent` 中也被使用：

* 定義一個 `heroes` 陣列屬性。
* 在建構子中注入 `HeroService`，並把它保存在私有的 `heroService` 欄位中。
* 在 Angular 的 `ngOnInit()` 生命週期鉤子中呼叫該服務來取得英雄。

在這個儀表板中，你用 `Array.slice` 方法指定四位英雄（第 2、3、4 和 5 位）。

重新整理瀏覽器，即可在新的儀表板中看到四位英雄的名字。

## 導覽到英雄詳細資料

雖然所選英雄的詳細資料會顯示在 `HeroesComponent` 的底部，
使用者應該還能透過以下額外方式導覽到 `HeroDetailComponent`：

* 從儀表板前往所選英雄。
* 從英雄清單前往所選英雄。
* 從貼到瀏覽器網址列的「深層連結」URL 前往。

### 路由到英雄詳細資料

你可以在 `app.module.ts` 中加入通往 `HeroDetailComponent` 的路由，也就是設定其他路由的地方。

這個新路由不尋常之處，在於你必須告訴 `HeroDetailComponent` 要顯示哪一位英雄。
你不必告訴 `HeroesComponent` 或 `DashboardComponent` 任何事。

目前，父元件 `HeroesComponent` 會透過像這樣的繫結，
把元件的 `hero` 屬性設定為一個英雄物件：

<code-example language="html">
  &lt;hero-detail [hero]="selectedHero">&lt;/hero-detail>

</code-example>

但這個繫結在任何路由情境中都行不通。

### 參數化路由

你可以把英雄的 `id` 加入 URL。當路由到 `id` 為 11 的英雄時，
你預期會看到像這樣的 URL：

<code-example format="nocode">
  /detail/11

</code-example>

URL 的 `/detail/` 部分是固定的。尾端的數字 `id` 會因英雄而異。
你需要用一個代表英雄 `id` 的*參數*（或*權杖*），來表示路由中可變的部分。

### 設定帶參數的路由

請使用以下*路由定義*。

<code-example path="toh-pt5/src/app/app.module.3.ts" region="hero-detail" title="src/app/app.module.ts (hero detail)">

</code-example>

路徑中的冒號（:）表示 `:id` 是特定英雄 `id` 的預留位置，
在導覽到 `HeroDetailComponent` 時使用。

<div class="l-sub-section">

在建立這個路由之前，請務必先匯入英雄詳細資料元件。

</div>

應用程式路由到此已設定完成。

你沒有在範本中加入 `'Hero Detail'` 連結，因為使用者
不會點選導覽*連結*來檢視特定英雄；
無論名字顯示在儀表板上還是英雄清單中，他們點選的是*英雄名稱*。

在 `HeroDetailComponent` 修改完成並準備好被導覽前往之前，
你還不必加入英雄點選。

## 修改 *HeroDetailComponent*

`HeroDetailComponent` 目前如下所示：

<code-example path="toh-pt4/src/app/hero-detail.component.ts" title="src/app/hero-detail.component.ts (current)">

</code-example>

範本不會改變。英雄名字會以相同方式顯示。
主要的改變，來自於你取得英雄名字的方式。

你將不再透過父元件的屬性繫結接收英雄。
新的 `HeroDetailComponent` 應該從 `ActivatedRoute` 服務的 `paramMap` Observable 中
取得 `id` 參數，並使用 `HeroService` 來擷取具有該 `id` 的英雄。

加入以下匯入：

<code-example path="toh-pt5/src/app/hero-detail.component.1.ts" region="added-imports" title="src/app/hero-detail.component.ts">

</code-example>

把 `ActivatedRoute`、`HeroService` 與 `Location` 服務
注入建構子，並把它們的值儲存在私有欄位中：

<code-example path="toh-pt5/src/app/hero-detail.component.ts" region="ctor" title="src/app/hero-detail.component.ts (constructor)">

</code-example>

匯入 `switchMap` 運算子，稍後要與路由參數 `Observable` 一起使用。

<code-example path="toh-pt5/src/app/hero-detail.component.ts" region="rxjs-import" title="src/app/hero-detail.component.ts (switchMap import)">

</code-example>

告訴類別要實作 `OnInit` 介面。

<code-example path="toh-pt5/src/app/hero-detail.component.ts" region="implement" title="src/app/hero-detail.component.ts">

</code-example>

在 `ngOnInit()` 生命週期鉤子中，使用 `paramMap` Observable
從 `ActivatedRoute` 服務中擷取 `id` 參數值，
並使用 `HeroService` 來擷取具有該 `id` 的英雄。

<code-example path="toh-pt5/src/app/hero-detail.component.ts" region="ngOnInit" title="src/app/hero-detail.component.ts">

</code-example>

`switchMap` 運算子會把 Observable 路由參數中的 `id`，
對應到一個新的 `Observable`，也就是 `HeroService.getHero()` 方法的結果。

如果使用者在 `getHero` 請求仍在處理時，再次導覽到這個元件，
`switchMap` 會取消舊的請求，然後再次呼叫 `HeroService.getHero()`。

英雄的 `id` 是數字。路由參數永遠是字串。
因此，路由參數值會用 JavaScript 的 (+) 運算子轉換為數字。

<div class="l-sub-section">

### 你需要取消訂閱嗎？

如 [路由與導覽](guide/router) 頁面中的
[ActivatedRoute：路由資訊的一站式來源](guide/router#activated-route)一節所述，
`Router` 會管理它所提供的 Observable，並把
訂閱侷限在本地。這些訂閱會在元件銷毀時清除，以防止
記憶體流失，所以你不需要取消訂閱路由的 `paramMap` `Observable`。

</div>

### 加入 *HeroService.getHero()*

在前面的程式碼片段中，`HeroService` 沒有 `getHero()` 方法。為了解決這個問題，
請開啟 `HeroService`，並加入一個 `getHero()` 方法，用 `id` 從 `getHeroes()` 取得的英雄清單中篩選。

<code-example path="toh-pt5/src/app/hero.service.ts" region="getHero" title="src/app/hero.service.ts (getHero)">

</code-example>

### 找到回去的路

使用者有多種方式可以導覽*到* `HeroDetailComponent`。

若要導覽到其他地方，使用者可以點選 `AppComponent` 中的兩個連結之一，或點選瀏覽器的上一頁按鈕。
現在加入第三個選項：一個 `goBack()` 方法，使用你先前注入的 `Location` 服務，
在瀏覽器的歷史紀錄堆疊中向後導覽一步。

<code-example path="toh-pt5/src/app/hero-detail.component.ts" region="goBack" title="src/app/hero-detail.component.ts (goBack)">

</code-example>

<div class="l-sub-section">

回得太遠，可能會把使用者帶出應用程式。
在真正的應用程式中，你可以用 *CanDeactivate* 守衛來防止這個問題。
想了解更多資訊，請閱讀 [CanDeactivate](api/router/CanDeactivate) 頁面。

</div>

你會用事件繫結把這個方法連接到一個*返回*按鈕，該按鈕會加入元件範本中。

<code-example path="toh-pt5/src/app/hero-detail.component.html" region="back-button">

</code-example>

把範本遷移到它自己的檔案中，
該檔案名為 <code>hero-detail.component.html</code>：

<code-example path="toh-pt5/src/app/hero-detail.component.html" title="src/app/hero-detail.component.html">

</code-example>

用指向你剛建立的範本檔案的 `templateUrl`，更新元件中繼資料。

<code-example path="toh-pt5/src/app/hero-detail.component.ts" region="metadata" title="src/app/hero-detail.component.ts (metadata)">

</code-example>

重新整理瀏覽器，查看結果。

## 選取儀表板英雄

當使用者在儀表板中選取一位英雄時，應用程式應該導覽到 `HeroDetailComponent`，以檢視並編輯所選英雄。

雖然儀表板英雄呈現為按鈕般的區塊，它們應該表現得像錨點標籤。
當游標懸停在英雄區塊上時，目標 URL 應該顯示在瀏覽器狀態列中，
而且使用者應該能夠複製連結，或在新分頁中開啟英雄詳細檢視。

為了達成這個效果，請重新開啟 `dashboard.component.html`，並把重複的 `<div *ngFor...>` 標籤
換成 `<a>` 標籤。把開啟的 `<a>` 標籤改為以下內容：

<code-example path="toh-pt5/src/app/dashboard.component.html" region="click" title="src/app/dashboard.component.html (repeated &lt;a&gt; tag)">

</code-example>

請注意 `[routerLink]` 繫結。
如本頁的[路由器連結](tutorial/toh-pt5#路由器連結)一節所述，
`AppComponent` 範本中的頂層導覽，其路由器連結設定為
目標路由的固定路徑："/dashboard" 與 "/heroes"。

這一次，你繫結到的是一個包含*連結參數陣列*的運算式。
該陣列有兩個元素：目標路由的*路徑*，
以及一個路由參數，其值設定為目前英雄的 `id`。

這兩個陣列項目，與你先前加入
`app.module.ts` 的參數化英雄詳細資料路由定義中的*路徑*與 *:id*
權杖相對齊：

<code-example path="toh-pt5/src/app/app.module.3.ts" region="hero-detail" title="src/app/app.module.ts (hero detail)">

</code-example>

重新整理瀏覽器，並從儀表板中選取一位英雄；應用程式會導覽到該英雄的詳細資料。

## 把路由重構成*路由模組*

`AppModule` 中有將近 20 行專門用來設定四個路由。
大多數應用程式有更多的路由，而且它們會加入守衛服務，
以防止不想要或未經授權的導覽。
（想了解守衛服務的更多資訊，請參閱 [路由與導覽](guide/router) 頁面中的
[路由守衛](guide/router#guards)一節。）
路由方面的考量很快就可能主導這個模組，並遮蔽它的主要目的，也就是
為 Angular 編譯器建立關於整個應用程式的關鍵事實。

把路由設定重構成它自己的類別，是個好主意。
目前的 `RouterModule.forRoot()` 會產生一個 Angular 的 `ModuleWithProviders`，
一個專門負責路由的類別應該是一個*路由模組*。
想了解更多資訊，請參閱 [路由與導覽](guide/router) 頁面中的
[里程碑 #2：路由模組](guide/router#routing-module)一節。

按照慣例，路由模組的名稱包含「Routing」這個詞，並
與宣告被導覽到之元件的模組名稱相對齊。

建立一個 `app-routing.module.ts` 檔案，與 `app.module.ts` 位於同一層。
為它加上以下內容，這些內容是從 `AppModule` 類別中擷取的：

<code-example path="toh-pt5/src/app/app-routing.module.ts" title="src/app/app-routing.module.ts">

</code-example>

以下幾點是路由模組的典型特徵：

* 路由模組把路由拉進一個變數中。這個變數釐清了
  路由模組的模式，以備你將來匯出這個模組。
* 路由模組把 `RouterModule.forRoot(routes)` 加入 `imports`。
* 路由模組把 `RouterModule` 加入 `exports`，以便
  伴隨模組中的元件能使用 Router 的可宣告項目，
  例如 `RouterLink` 與 `RouterOutlet`。
* 這裡沒有 `declarations`。宣告是伴隨模組的責任。
* 如果你有守衛服務，路由模組會加入模組的 `providers`。（本範例中沒有。）

### 更新 *AppModule*

從 `AppModule` 中刪除路由設定，並匯入 `AppRoutingModule`。
使用 ES2015 的 `import` 陳述式，*並且*把它加入 `NgModule.imports` 清單。

以下是修改後的 `AppModule`，與重構前的狀態對照：

<code-tabs>
  <code-pane path="toh-pt5/src/app/app.module.ts" title="src/app/app.module.ts (after)"></code-pane>
  <code-pane path="toh-pt5/src/app/app.module.3.ts" title="src/app/app.module.ts (before)"></code-pane>
</code-tabs>

修改後簡化了的 `AppModule`，專注於識別應用程式的關鍵組成部分。

## 在 *HeroesComponent* 中選取英雄

在 `HeroesComponent` 中，
目前的範本呈現「主／詳細」風格，頂部是英雄清單，
下方是所選英雄的詳細資料。

<code-example path="toh-pt4/src/app/app.component.ts" region="template" title="src/app/heroes.component.ts (current template)" linenums="false">

</code-example>

刪除頂部的 `<h1>`。

刪除範本的最後一行，也就是帶有 `<hero-detail>` 標籤的那一行。

你將不再在這裡顯示完整的 `HeroDetailComponent`。
取而代之，你會把英雄詳細資料顯示在它自己的頁面上，並像你在儀表板中所做的那樣路由前往。

不過，當使用者從清單中選取一位英雄時，他們不會前往詳細資料頁面。
他們會改在*本頁*看到一個迷你詳細資料，並必須點選按鈕才能導覽到*完整詳細資料*頁面。

### 加入*迷你詳細資料*

在範本底部、`<hero-detail>` 原本所在的位置，加入以下 HTML 片段：

<code-example path="toh-pt5/src/app/heroes.component.html" region="mini-detail" title="src/app/heroes.component.ts">

</code-example>

點選英雄後，使用者應該會在英雄清單下方看到像這樣的內容：

<figure>
  <img src='generated/images/guide/toh/mini-hero-detail.png' alt="迷你英雄詳細資料">
</figure>

### 用 uppercase 管道格式化

英雄的名字以大寫字母顯示，是因為插值繫結中包含了 `uppercase` 管道，
它就在管道運算子（ | ）的正後方。

<code-example path="toh-pt5/src/app/heroes.component.html" region="pipe">

</code-example>

管道是格式化字串、貨幣金額、日期與其他顯示資料的好方法。
Angular 附帶了數個管道，你也可以撰寫自己的管道。

<div class="l-sub-section">

想了解管道的更多資訊，請閱讀[管道](guide/pipes)頁面。

</div>

### 把內容移出元件檔案

你仍然必須更新元件類別，以支援在使用者點選 *View Details* 按鈕時，
導覽到 `HeroDetailComponent`。

元件檔案很大。
在 HTML 與 CSS 的雜訊中，很難找到元件邏輯。

在做任何進一步變更之前，請把範本與樣式遷移到它們自己的檔案中。

首先，把範本內容從 `heroes.component.ts`
移到一個新的 <code>heroes.component.html</code> 檔案中。
不要複製反引號。至於 `heroes.component.ts`，你
等一下會再回到它。接著，把
樣式內容移到一個新的 <code>heroes.component.css</code> 檔案中。

這兩個新檔案應該如下所示：

<code-tabs>

  <code-pane title="src/app/heroes.component.html" path="toh-pt5/src/app/heroes.component.html">

  </code-pane>

  <code-pane title="src/app/heroes.component.css" path="toh-pt5/src/app/heroes.component.css">

  </code-pane>

</code-tabs>

現在，回到 `heroes.component.ts` 的元件中繼資料，
刪除 `template` 與 `styles`，分別以
`templateUrl` 與 `styleUrls` 取代。
把它們的屬性設定為參照這些新檔案。

<code-example path="toh-pt5/src/app/heroes.component.ts" region="metadata" title="src/app/heroes.component.ts (revised metadata)">

</code-example>

<div class="l-sub-section">

`styleUrls` 屬性是一個樣式檔案名稱（連同路徑）的陣列。
如果需要的話，你可以列出多個來自不同位置的樣式檔案。

</div>

### 更新 _HeroesComponent_ 類別

`HeroesComponent` 會在回應按鈕點選時，導覽到 `HeroesDetailComponent`。
該按鈕的 click 事件繫結到一個 `gotoDetail()` 方法，這個方法會*以命令式*
告訴路由器要前往何處，來進行導覽。

這個做法需要對元件類別做以下變更：

1. 從 Angular 路由器函式庫匯入 `Router`。
1. 在建構子中注入 `Router`，以及 `HeroService`。
1. 呼叫路由器的 `navigate()` 方法來實作 `gotoDetail()`。

<code-example path="toh-pt5/src/app/heroes.component.ts" region="gotoDetail" title="src/app/heroes.component.ts (gotoDetail)">

</code-example>

請注意，你傳遞給路由器 `navigate()` 方法的是一個雙元素的*連結參數陣列*，也就是
一個路徑與路由參數，
就像你在 `DashboardComponent` 中的 `[routerLink]` 繫結所做的那樣。
以下是修改後的 `HeroesComponent` 類別：

<code-example path="toh-pt5/src/app/heroes.component.ts" region="class" title="src/app/heroes.component.ts (class)">

</code-example>

重新整理瀏覽器，開始點選。
使用者可以在應用程式中四處導覽，從儀表板到英雄詳細資料再回來，
從英雄清單到迷你詳細資料再到英雄詳細資料，然後再回到英雄清單。

你已經達成了驅動本頁的全部導覽需求。

## 為應用程式設定樣式

應用程式已能運作，但它需要樣式。
儀表板英雄應該以一排矩形顯示。
你已收到約 60 行用於此目的的 CSS，包括一些用於響應式設計的簡單媒體查詢。

如你現在所知，把 CSS 加入元件的 `styles` 中繼資料，
會遮蔽元件邏輯。
改在一個獨立的 `*.css` 檔案中編輯 CSS。

在 `app` 資料夾中加入一個 <code>dashboard.component.css</code> 檔案，並在
元件中繼資料的 `styleUrls` 陣列屬性中像這樣參照該檔案：

<code-example path="toh-pt5/src/app/dashboard.component.ts" region="css" title="src/app/dashboard.component.ts (styleUrls)">

</code-example>

### 加入時尚的英雄詳細資料

你還收到了專門用於 `HeroDetailComponent` 的 CSS 樣式。

在 `app` 資料夾中加入一個 <code>hero-detail.component.css</code>，
並像你對 `DashboardComponent` 所做的那樣，在
`styleUrls` 陣列中參照該檔案。
另外，在 `hero-detail.component.ts` 中，移除 `hero` 屬性的 `@Input` 裝飾器
以及它的匯入。

以下是元件 CSS 檔案的內容。

<code-tabs>

  <code-pane title="src/app/hero-detail.component.css" path="toh-pt5/src/app/hero-detail.component.css">

  </code-pane>

  <code-pane title="src/app/dashboard.component.css" path="toh-pt5/src/app/dashboard.component.css">

  </code-pane>

</code-tabs>

### 為導覽連結設定樣式

提供的 CSS 讓 `AppComponent` 中的導覽連結看起來更像可選取的按鈕。
你會把這些連結包在 `<nav>` 標籤中。

在 `app` 資料夾中加入一個 <code>app.component.css</code> 檔案，內容如下。

<code-example path="toh-pt5/src/app/app.component.css" title="src/app/app.component.css (navigation styles)">

</code-example>

<div class="l-sub-section">

**routerLinkActive 指令**

Angular 路由器提供了一個 `routerLinkActive` 指令，你可以用它
為其路由與目前作用中路由相符的 HTML 導覽元素加入一個類別。
你所要做的，就是為它定義樣式。

</div>

<code-example path="toh-pt5/src/app/app.component.ts" region="template" title="src/app/app.component.ts (active router links)">

</code-example>

加入一個參照此 CSS 檔案的 `styleUrls` 屬性，如下所示：

<code-example path="toh-pt5/src/app/app.component.ts" region="styleUrls" title="src/app/app.component.ts">

</code-example>

### 全域應用程式樣式

當你為元件加入樣式時，你把元件所需的一切，也就是 HTML、
CSS 與程式碼，一起保存在一個方便的地方。
把這一切打包起來、在其他地方重複使用這個元件，是很容易的。

你也可以在任何元件之外，建立*應用程式層級*的樣式。

設計師提供了一些基本樣式，可套用到整個應用程式的元素上。
這些樣式對應到你先前在[設定](guide/setup)期間安裝的完整主樣式集。
以下是一個摘錄：

<code-example path="toh-pt5/src/styles.1.css" title="src/styles.css (excerpt)">

</code-example>

建立檔案 <code>styles.css</code>。
請確認該檔案包含[這裡提供的主樣式](https://raw.githubusercontent.com/angular/angular/master/aio/tools/examples/shared/boilerplate/common/src/styles.css)。
另外也要編輯 <code>index.html</code>，讓它參照這個樣式表。

<code-example path="toh-pt5/src/index.html" region="css" title="src/index.html (link ref)">

</code-example>

現在看看這個應用程式。儀表板、英雄與導覽連結都已設定了樣式。

<figure>
  <img src='generated/images/guide/toh/heroes-dashboard-1.png' alt="檢視導覽">
</figure>

## 應用程式結構與程式碼

請檢閱本頁範例原始碼的 <live-example></live-example>。
請確認你有以下結構：

<div class='filetree'>

  <div class='file'>
    angular-tour-of-heroes
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          app.component.css
        </div>

        <div class='file'>
          app.component.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

        <div class='file'>
          app-routing.module.ts
        </div>

        <div class='file'>
          dashboard.component.css
        </div>

        <div class='file'>
          dashboard.component.html
        </div>

        <div class='file'>
          dashboard.component.ts
        </div>

        <div class='file'>
          hero.service.ts
        </div>

        <div class='file'>
          hero.ts
        </div>

        <div class='file'>
          hero-detail.component.css
        </div>

        <div class='file'>
          hero-detail.component.html
        </div>

        <div class='file'>
          hero-detail.component.ts
        </div>

        <div class='file'>
          heroes.component.css
        </div>

        <div class='file'>
          heroes.component.html
        </div>

        <div class='file'>
          heroes.component.ts
        </div>

        <div class='file'>
          mock-heroes.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        systemjs.config.js
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>

## 摘要

以下是你在本頁中達成的成果：

* 你加入了 Angular 路由器，可在不同元件之間導覽。
* 你學會了如何建立代表導覽選單項目的路由器連結。
* 你使用路由器連結參數，導覽到使用者所選英雄的詳細資料。
* 你與多個元件共享了 `HeroService`。
* 你把 HTML 與 CSS 移出元件檔案，放到它們自己的檔案中。
* 你加入了 `uppercase` 管道來格式化資料。

你的應用程式應該像這樣 <live-example></live-example>。

### 下一步

你已具備建置應用程式所需的大部分基礎。
你還缺少一個關鍵部分：遠端資料存取。

在[下一頁教學](tutorial/toh-pt6 "Http")中，
你將把模擬資料換成使用 http 從伺服器擷取的資料。
