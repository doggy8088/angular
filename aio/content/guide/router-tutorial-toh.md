
<a id="router-tutorial"></a>

# 路由器教學：英雄之旅

本教學提供 Angular 路由器的廣泛總覽。在本教學中，你會在基本路由器設定的基礎上，探索子路由、路由參數、延遲載入 NgModule、守衛路由，以及預先載入資料以改善使用者體驗等功能。

若要查看應用程式最終版本的運作範例，請見 <live-example name="router"></live-example>。

<a id="router-tutorial-objectives"></a>

## 學習目標

本指南說明一個多頁面路由範例應用程式的開發過程。在此過程中，它會突顯路由器的關鍵功能，例如：

*   將應用程式功能組織成模組
*   導覽到元件（*Heroes* 連結到「Heroes List」）
*   包含路由參數（在路由到「Hero Detail」時傳遞英雄 `id`）
*   子路由（*Crisis Center* 有自己的路由）
*   `canActivate` 守衛（檢查路由存取權）
*   `canActivateChild` 守衛（檢查子路由存取權）
*   `canDeactivate` 守衛（詢問是否放棄未儲存的變更）
*   `resolve` 守衛（預先擷取路由資料）
*   延遲載入 `NgModule`
*   `canMatch` 守衛（在載入功能模組資產之前檢查）

本指南以一系列里程碑的形式進行，就像你一步一步地建立應用程式一樣，但假設你已熟悉基本的 [Angular 概念](guide/architecture)。若要對 Angular 有一般的介紹，請見 [入門](start)。若要更深入的總覽，請見 [Tour of Heroes](tutorial/tour-of-heroes) 教學。

## 先決條件

若要完成本教學，你應該對下列概念有基本的了解：

*   JavaScript
*   HTML
*   CSS
*   [Angular CLI](cli)

你可能會覺得 [Tour of Heroes 教學](tutorial/tour-of-heroes)很有幫助，但它並非必要。

## 範例應用程式實際運作

本教學的範例應用程式協助英雄就業仲介所為英雄尋找可以解決的危機。

應用程式有三個主要功能區域：

1.  一個*危機中心*，用於維護要指派給英雄的危機清單。
1.  一個*英雄*區域，用於維護仲介所僱用的英雄清單。
1.  一個*管理*區域，用於管理危機與英雄清單。

點按這個 <live-example name="router" title="Hero Employment Agency Live Example">即時範例連結</live-example>來試試看。

應用程式會渲染出一排導覽按鈕，以及帶有英雄清單的 *Heroes* 檢視。

<div class="lightbox">

<img alt="範例應用程式，含一列導覽按鈕與英雄清單" src="generated/images/guide/router/hero-list.gif">

</div>

選取一位英雄，應用程式會帶你到英雄編輯畫面。

<div class="lightbox">

<img alt="英雄的詳細檢視，含額外資訊、輸入欄位與返回按鈕" src="generated/images/guide/router/hero-detail.png">

</div>

變更姓名。點按「Back」按鈕，應用程式會返回英雄清單，並顯示已變更的英雄姓名。請注意，姓名變更會立即生效。

如果你點按的是瀏覽器的返回按鈕，而不是應用程式的「Back」按鈕，應用程式同樣會把你帶回英雄清單。Angular 應用程式的導覽會像一般的網頁導覽一樣更新瀏覽器歷史記錄。

現在點按 *Crisis Center* 連結，查看進行中的危機清單。

<div class="lightbox">

<img alt="危機中心危機清單" src="generated/images/guide/router/crisis-center-list.gif">

</div>

選取一個危機，應用程式會帶你到危機編輯畫面。*Crisis Detail* 會出現在同一頁面清單下方的子元件中。

變更危機的名稱。請注意，危機清單中對應的名稱並*沒有*改變。

<div class="lightbox">

<img alt="危機中心的危機詳細資料，含資料、輸入欄位與儲存、取消按鈕" src="generated/images/guide/router/crisis-center-detail.gif">

</div>

與隨著輸入即時更新的 *Hero Detail* 不同，*Crisis Detail* 的變更只是暫時的，直到你按下「Save」或「Cancel」按鈕儲存或捨棄它們為止。兩個按鈕都會導覽回 *Crisis Center* 及其危機清單。

點按瀏覽器的返回按鈕或「Heroes」連結來啟用一個對話框。

<div class="lightbox">

<img alt="要求使用者確認捨棄變更的警示" src="generated/images/guide/router/confirm-dialog.png">

</div>

你可以說「OK」並遺失你的變更，或點按「Cancel」並繼續編輯。

這個行為的背後是路由器的 `canDeactivate` 守衛。該守衛讓你在離開目前檢視之前，有機會清理或詢問使用者的許可。

`Admin` 與 `Login` 按鈕說明了本指南稍後會介紹的其他路由器功能。

<a id="getting-started"></a>

## 里程碑 1：開始

從一個在兩個空白檢視之間導覽的應用程式基本版本開始。

<div class="lightbox">

<img alt="應用程式動畫：含危機中心按鈕與英雄按鈕，指標點按各按鈕顯示對應檢視" src="generated/images/guide/router/router-1-anim.gif">

</div>

<a id="import"></a>

### 建立範例應用程式

1. 建立一個新的 Angular 專案 _angular-router-tour-of-heroes_。

   <code-example format="shell" language="shell">
    ng new angular-router-tour-of-heroes
   </code-example>

當畫面提示 `Would you like to add Angular routing?` 時，選取 `N`。

當畫面提示 `Which stylesheet format would you like to use?` 時，選取 `CSS`。

稍待片刻，新專案 `angular-router-tour-of-heroes` 就準備好了。
   
1. 在終端機中，切換到 `angular-router-tour-of-heroes` 目錄。

1. 執行 `ng serve` 指令，驗證新應用程式是否如預期般運作。

   <code-example language="sh">
    ng serve
   </code-example>

1. 在瀏覽器中開啟 `http://localhost:4200`。

你應該會在瀏覽器中看到應用程式正在執行。

### 定義路由

路由器必須使用一組路由定義來設定。

每個定義都會轉換為一個 [Route](api/router/Route) 物件，它有兩個要素：`path`（此路由的 URL 路徑區段）與 `component`（與此路由相關聯的元件）。

當瀏覽器 URL 變更，或應用程式程式碼告訴路由器沿著某個路由路徑導覽時，路由器會依據其定義登錄檔來處理。

第一個路由會執行下列動作：

*   當瀏覽器的位置 URL 變更為符合路徑區段 `/crisis-center` 時，路由器會啟用 `CrisisListComponent` 的一個執行個體並顯示其檢視
*   當應用程式請求導覽到路徑 `/crisis-center` 時，路由器會啟用 `CrisisListComponent` 的一個執行個體、顯示其檢視，並以該路徑的 URL 更新瀏覽器的位址位置與歷史記錄

第一個設定定義了一個包含兩條路由的陣列，其路徑最短，分別通往 `CrisisListComponent` 與 `HeroListComponent`。

產生 `CrisisList` 與 `HeroList` 元件，讓路由器有東西可以渲染。

<code-example format="shell" language="shell">

ng generate component crisis-list

</code-example>

<code-example format="shell" language="shell">

ng generate component hero-list

</code-example>

將每個元件的內容替換為下列範例 HTML。

<code-tabs>
    <code-pane header="src/app/crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html"></code-pane>
    <code-pane header="src/app/hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html" region="template"></code-pane>
</code-tabs>

### 註冊 `Router` 與 `Routes`

若要使用 `Router`，你必須先從 `@angular/router` 套件註冊 `RouterModule`。定義一個路由陣列 `appRoutes`，並將它們傳給 `RouterModule.forRoot()` 方法。`RouterModule.forRoot()` 方法會回傳一個模組，其中包含已設定的 `Router` 服務提供者，以及路由函式庫所需的其他提供者。應用程式啟動後，`Router` 會根據目前的瀏覽器 URL 執行初始導覽。

<div class="alert is-important">

**注意**：<br />
`RouterModule.forRoot()` 方法是一種用於註冊應用程式範圍提供者的模式。若要進一步了解應用程式範圍的提供者，請閱讀 [Singleton services](guide/singleton-services#forRoot-router) 指南。

</div>

<code-example header="src/app/app.module.ts (first-config)" path="router/src/app/app.module.1.ts" region="first-config"></code-example>

<div class="alert is-helpful">

將已設定的 `RouterModule` 加入 `AppModule` 對於最小的路由設定來說就足夠了。
然而，隨著應用程式成長，請將路由設定[重構](#將路由設定重構為路由模組)到獨立的檔案中，並建立一個[路由模組](#routing-module)。
路由模組是一種專門用於路由的特殊類型 `Service Module`。

</div>

在 `AppModule` 的 `imports` 陣列中註冊 `RouterModule.forRoot()`，會讓 `Router` 服務在應用程式的任何地方都可以使用。

<a id="shell"></a>

### 加入路由器插座

根 `AppComponent` 是應用程式的外殼。它有一個標題、一個帶有兩個連結的導覽列，以及一個路由器插座，路由器會在其中渲染元件。

<div class="lightbox">

<img alt="導覽列由兩個導覽按鈕組成，第一個按鈕為作用中狀態並顯示其對應檢視" src="generated/images/guide/router/shell-and-outlet.gif">

</div>

路由器插座是一個預留位置，路由元件會在其中被渲染。

<a id="shell-template"></a>

對應的元件範本如下所示：

<code-example header="src/app/app.component.html" path="router/src/app/app.component.1.html"></code-example>

<a id="wildcard"></a>

### 定義萬用字元路由

到目前為止，你已在應用程式中建立了兩條路由，一條通往 `/crisis-center`，另一條通往 `/heroes`。任何其他 URL 都會導致路由器擲出錯誤並讓應用程式當掉。

加入一條萬用字元路由來攔截無效的 URL 並妥善處理。萬用字元路由的路徑由兩個星號組成。它會比對每個 URL。因此，如果路由器無法比對設定中較早的路由，就會選取這條萬用字元路由。萬用字元路由可以導覽到自訂的「404 Not Found」元件，或[重新導向](#redirect)到現有的路由。

<div class="alert is-helpful">

路由器使用[*先比對先贏*](guide/router-reference#example-config)策略來選取路由。
因為萬用字元路由是最不具特定性的路由，請將它放在路由設定的最後。

</div>

若要測試這個功能，請在 `HeroListComponent` 範本中加入一個帶有 `RouterLink` 的按鈕，並將連結設為一個不存在的路由 `"/sidekicks"`。

<code-example header="src/app/hero-list/hero-list.component.html (excerpt)" path="router/src/app/hero-list/hero-list.component.1.html"></code-example>

如果使用者點按該按鈕，應用程式會失敗，因為你尚未定義 `"/sidekicks"` 路由。

不要加入 `"/sidekicks"` 路由，而是定義一條 `wildcard` 路由，讓它導覽到 `PageNotFoundComponent`。

<code-example header="src/app/app.module.ts (wildcard)" path="router/src/app/app.module.1.ts" region="wildcard"></code-example>

建立 `PageNotFoundComponent`，在使用者造訪無效 URL 時顯示。

<code-example format="shell" language="shell">

ng generate component page-not-found

</code-example>

<code-example header="src/app/page-not-found.component.html (404 component)" path="router/src/app/page-not-found/page-not-found.component.html"></code-example>

現在，當使用者造訪 `/sidekicks` 或任何其他無效 URL 時，瀏覽器會顯示「Page not found」。瀏覽器的網址列仍會指向該無效 URL。

<a id="redirect"></a>

### 設定重新導向

當應用程式啟動時，瀏覽器列中的初始 URL 預設為：

<code-example format="http" language="http">

localhost:4200

</code-example>

這不符合任何寫死的路由，意味著路由器會落到萬用字元路由並顯示 `PageNotFoundComponent`。

應用程式需要一條預設路由通往有效的頁面。本應用程式的預設頁面是英雄清單。應用程式應該像使用者點按了「Heroes」連結，或在網址列中貼上 `localhost:4200/heroes` 一樣，導覽到那裡。

加入一條 `redirect` 路由，將初始的相對 URL（`''`）轉換為你想要的預設路徑（`/heroes`）。

將預設路由加入萬用字元路由*上方*的某個位置。在下列摘錄中，它就位於萬用字元路由的正上方，顯示了這個里程碑的完整 `appRoutes`。

<code-example header="src/app/app-routing.module.ts (appRoutes)" path="router/src/app/app-routing.module.1.ts" region="appRoutes"></code-example>

瀏覽器的網址列會顯示 `.../heroes`，就像你直接導覽到那裡一樣。

重新導向路由需要一個 `pathMatch` 屬性，來告訴路由器如何將 URL 與路由的路徑進行比對。在這個應用程式中，只有當*整個 URL* 符合 `''` 時，路由器才應該選取通往 `HeroListComponent` 的路由，因此請將 `pathMatch` 值設為 `'full'`。

<a id="pathmatch"></a>

<div class="callout is-helpful">

<header>聚焦 pathMatch</header>

從技術上說，當 URL 中*剩餘*、未比對的區段符合 `''` 時，`pathMatch = 'full'` 會導致路由命中。
在這個範例中，重新導向位於頂層路由，因此*剩餘*的 URL 與*整個* URL 是同一回事。

另一個可能的 `pathMatch` 值是 `'prefix'`，它會告訴路由器在剩餘 URL 以重新導向路由的前綴路徑開頭時，比對重新導向路由。
這不適用於這個範例應用程式，因為如果 `pathMatch` 值是 `'prefix'`，每個 URL 都會符合 `''`。

試著將它設為 `'prefix'` 並點按 `Go to sidekicks` 按鈕。
因為那是一個錯誤的 URL，你應該會看到「Page not found」頁面。
相反地，你仍然停留在「Heroes」頁面。
在瀏覽器的網址列中輸入一個錯誤的 URL。
你會立即被重新導向到 `/heroes`。
每個落到這個路由定義的 URL，無論好壞，都是一個符合項。

預設路由只有在整個 URL 是 `''` 時才應該重新導向到 `HeroListComponent`。
請記得將重新導向還原為 `pathMatch = 'full'`。

若要了解更多，請閱讀 Victor Savkin 關於重新導向的[文章](https://vsavkin.tumblr.com/post/146722301646/angular-router-empty-paths-componentless-routes)。

</div>

### 里程碑 1 總結

你的範例應用程式可以在使用者點按連結時，在兩個檢視之間切換。

里程碑 1 涵蓋了如何執行下列事項：

*   載入路由器函式庫
*   在外殼範本中加入導覽列，使用錨點標籤、`routerLink` 與 `routerLinkActive` 指令
*   在外殼範本中加入 `router-outlet`，檢視會在其中顯示
*   使用 `RouterModule.forRoot()` 設定路由器模組
*   將路由器設為組成 HTML5 瀏覽器 URL
*   使用 `wildcard` 路由處理無效路由
*   在應用程式以空路徑啟動時導覽到預設路由

起始應用程式的結構如下所示：

<div class="filetree">
  <div class="file">
    angular-router-tour-of-heroes
  </div>
  <div class="children">
    <div class="file">
      src
    </div>
    <div class="children">
      <div class="file">
        app
      </div>
      <div class="children">
        <div class="file">
          crisis-list
        </div>
        <div class="children">
          <div class="file">
            crisis-list.component.css
          </div>
          <div class="file">
            crisis-list.component.html
          </div>
          <div class="file">
            crisis-list.component.ts
          </div>
        </div>
        <div class="file">
          hero-list
        </div>
        <div class="children">
          <div class="file">
            hero-list.component.css
          </div>
          <div class="file">
            hero-list.component.html
          </div>
          <div class="file">
            hero-list.component.ts
          </div>
        </div>
        <div class="file">
          page-not-found
        </div>
        <div class="children">
          <div class="file">
            page-not-found.component.css
          </div>
          <div class="file">
            page-not-found.component.html
          </div>
          <div class="file">
            page-not-found.component.ts
          </div>
        </div>
        <div class="file">
          app.component.css
        </div>
        <div class="file">
          app.component.html
        </div>
        <div class="file">
          app.component.ts
        </div>
        <div class="file">
          app.module.ts
        </div>
      </div>
      <div class="file">
        main.ts
      </div>
      <div class="file">
        index.html
      </div>
      <div class="file">
        styles.css
      </div>
      <div class="file">
        tsconfig.json
      </div>
    </div>
    <div class="file">
      node_modules &hellip;
    </div>
    <div class="file">
      package.json
    </div>
  </div>
</div>

以下是這個里程碑中的檔案。

<code-tabs>
    <code-pane header="app.component.html" path="router/src/app/app.component.1.html"></code-pane>
    <code-pane header="app.module.ts" path="router/src/app/app.module.1.ts"></code-pane>
    <code-pane header="hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html"></code-pane>
    <code-pane header="crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html"></code-pane>
    <code-pane header="page-not-found/page-not-found.component.html" path="router/src/app/page-not-found/page-not-found.component.html"></code-pane>
    <code-pane header="index.html" path="router/src/index.html"></code-pane>
</code-tabs>

<a id="routing-module"></a>

## 里程碑 2：*路由模組*

這個里程碑會向你展示如何設定一個稱為*路由模組*的特殊用途模組，其中保存了應用程式的路由設定。

路由模組具有下列特性：

*   將路由關注點與其他應用程式關注點分開
*   提供一個在測試應用程式時可以取代或移除的模組
*   為守衛與解析器等路由服務提供者提供一個眾所皆知的位置
*   不宣告元件

<a id="integrate-routing"></a>

### 將路由與應用程式整合

範例路由應用程式預設不包含路由。當你使用 [Angular CLI](cli) 建立一個使用路由的專案時，請為專案或應用程式以及每個 NgModule 設定 `--routing` 選項。當你建立或初始化新專案（使用 CLI [`ng new`](cli/new) 命令）或新應用程式（使用 [`ng generate app`](cli/generate) 命令）時，請指定 `--routing` 選項。這會告訴 CLI 包含 `@angular/router` npm 套件，並建立一個名為 `app-routing.module.ts` 的檔案。接著你可以在加入專案或應用程式的任何 NgModule 中使用路由。

例如，下列命令會產生一個可以使用路由的 NgModule。

<code-example format="shell" language="shell">

ng generate module my-module --routing

</code-example>

這會建立一個名為 `my-module-routing.module.ts` 的獨立檔案，用來儲存 NgModule 的路由。該檔案包含一個空的 `Routes` 物件，你可以用通往不同元件與 NgModule 的路由來填滿它。

<a id="routing-refactor"></a>

### 將路由設定重構為路由模組

在 `/app` 資料夾中建立一個 `AppRouting` 模組，以包含路由設定。

<code-example format="shell" language="shell">

ng generate module app-routing --module app --flat

</code-example>

像在 `app.module.ts` 中一樣，匯入 `CrisisListComponent`、`HeroListComponent` 與 `PageNotFoundComponent` 符號。接著將 `Router` 匯入與路由設定（包括 `RouterModule.forRoot()`）移到這個路由模組中。

將 Angular 的 `RouterModule` 加入模組的 `exports` 陣列，來重新匯出它。透過在此處重新匯出 `RouterModule`，`AppModule` 中宣告的元件就可以存取 `RouterLink` 與 `RouterOutlet` 等路由器指令。

完成這些步驟後，檔案應如下所示。

<code-example header="src/app/app-routing.module.ts" path="router/src/app/app-routing.module.1.ts"></code-example>

接著，移除 `app.module.ts` 檔案 `imports` 陣列中的 `RouterModule.forRoot` 來更新它。

<code-example header="src/app/app.module.ts" path="router/src/app/app.module.2.ts"></code-example>

<div class="alert is-helpful">

稍後，本指南會向你展示如何建立[多個路由模組](#heroes-functionality)，並以[正確的順序](#routing-module-order)匯入這些路由模組。

</div>

應用程式會繼續以相同的方式運作，而且你可以使用 `AppRoutingModule` 作為維護未來路由設定的集中位置。

<a id="why-routing-module"></a>

### 路由模組的好處

路由模組（通常稱為 `AppRoutingModule`）會取代根模組或功能模組中的路由設定。

當應用程式成長，以及設定包含專門的守衛與解析器函式時，路由模組會很有幫助。

有些開發人員在設定很小時會跳過路由模組，直接將路由設定合併到對應的模組中（例如 `AppModule`）。

大多數應用程式都應該實作路由模組以保持一致性。當設定變得複雜時，它能讓程式碼保持整潔。它讓功能模組的測試更容易。它的存在提醒人們一個模組是被路由的。它是開發人員預期找到並擴充路由設定的地方。

<a id="heroes-feature"></a>

## 里程碑 3：英雄功能

這個里程碑涵蓋下列內容：

*   使用模組將應用程式與路由組織成功能區域
*   以命令式方式從一個元件導覽到另一個元件
*   在路由參數中傳遞必要與選擇性的資訊

這個範例應用程式重現了 [Tour of Heroes 教學](tutorial/tour-of-heroes/toh-pt4 "Tour of Heroes: Services")「Services」一節中的英雄功能，並重複使用 <live-example name="toh-pt4" title="Tour of Heroes: Services example code"></live-example> 中的大部分程式碼。

典型的應用程式有多個功能區域，每個區域都專注於特定的業務目的，並有自己的資料夾。

本節會向你展示如何將應用程式重構為不同的功能模組、將它們匯入主模組，並在它們之間導覽。

<a id="heroes-functionality"></a>

### 加入英雄功能

請依下列步驟操作：

*   若要管理英雄，請在 heroes 資料夾中建立一個帶有路由的 `HeroesModule`，並將它註冊到根 `AppModule`。

    <code-example format="shell" language="shell">

    ng generate module heroes/heroes --module app --flat --routing

    </code-example>

*   將 `app` 資料夾中作為預留位置的 `hero-list` 資料夾移到 `heroes` 資料夾中。
*   將 <live-example name="toh-pt4" title="Tour of Heroes: Services example code">「Services」教學</live-example>中 `heroes/heroes.component.html` 的內容複製到 `hero-list.component.html` 範本中。

    *   將 `<h2>` 重新標示為 `<h2>HEROES</h2>`。
    *   刪除範本底部的 `<app-hero-detail>` 元件。

*   將即時範例中 `heroes/heroes.component.css` 的內容複製到 `hero-list.component.css` 檔案中。
*   將即時範例中 `heroes/heroes.component.ts` 的內容複製到 `hero-list.component.ts` 檔案中。

    *   將元件類別名稱變更為 `HeroListComponent`。
    *   將 `selector` 變更為 `app-hero-list`。
    *   將 `templateUrl` 變更為 `./hero-list.component.html`。
    *   將 `styleUrls` 變更為 `./hero-list.component.css`。

        <div class="alert is-helpful">

        路由元件不需要選擇器，因為元件是在頁面渲染時動態插入的。
        然而，它們對於在 HTML 元素樹中識別與定位它們很有用。

        </div>

*   將 `hero-detail` 資料夾、`hero.ts`、`hero.service.ts` 與 `mock-heroes.ts` 檔案複製到 `heroes` 子資料夾中
*   將 `message.service.ts` 複製到 `src/app` 資料夾中
*   更新 `hero.service.ts` 檔案中 `message.service` 的相對路徑匯入

接著，更新 `HeroesModule` 的中繼資料。

*   匯入 `HeroDetailComponent` 與 `HeroListComponent`，並將它們加入 `HeroesModule` 的 `declarations` 陣列中。

<code-example header="src/app/heroes/heroes.module.ts" path="router/src/app/heroes/heroes.module.ts"></code-example>

英雄管理檔案結構如下：

<div class="filetree">
  <div class="file">
    src/app/heroes
  </div>
  <div class="children">
    <div class="file">
      hero-detail
    </div>
      <div class="children">
        <div class="file">
          hero-detail.component.css
        </div>
        <div class="file">
          hero-detail.component.html
        </div>
        <div class="file">
          hero-detail.component.ts
        </div>
      </div>
    <div class="file">
      hero-list
    </div>
      <div class="children">
        <div class="file">
          hero-list.component.css
        </div>
        <div class="file">
          hero-list.component.html
        </div>
        <div class="file">
          hero-list.component.ts
        </div>
      </div>
    <div class="file">
      hero.service.ts
    </div>
    <div class="file">
      hero.ts
    </div>
    <div class="file">
      heroes-routing.module.ts
    </div>
    <div class="file">
      heroes.module.ts
    </div>
    <div class="file">
      mock-heroes.ts
    </div>
    </div>
  </div>
</div>

<a id="hero-routing-requirements"></a>

#### 英雄功能路由需求

英雄功能有兩個互相作用的元件：英雄清單與英雄詳細資料。當你導覽到清單檢視時，它會取得英雄清單並顯示它們。當你點按一位英雄時，詳細資料檢視必須顯示該位特定的英雄。

你可以透過在路由 URL 中包含所選英雄的 ID，告訴詳細資料檢視要顯示哪位英雄。

從 `src/app/heroes/` 資料夾中的新位置匯入英雄元件，並定義兩個英雄路由。

現在你有了 `Heroes` 模組的路由，請像在 `AppRoutingModule` 中一樣，使用 `RouterModule` 將它們註冊到 `Router`，但有一個重要的差異。

在 `AppRoutingModule` 中，你使用靜態 `RouterModule.forRoot()` 方法來註冊路由與應用程式層級的服務提供者。在功能模組中，你使用靜態 `forChild()` 方法。

<div class="alert is-helpful">

只在根 `AppRoutingModule` 中呼叫 `RouterModule.forRoot()`
（或在 `AppModule` 中，如果那是你註冊頂層應用程式路由的地方）。
在任何其他模組中，你必須呼叫 `RouterModule.forChild()` 方法來註冊額外的路由。

</div>

更新後的 `HeroesRoutingModule` 如下所示：

<code-example header="src/app/heroes/heroes-routing.module.ts" path="router/src/app/heroes/heroes-routing.module.1.ts"></code-example>

<div class="alert is-helpful">

請考慮為每個功能模組提供自己的路由設定檔案。
雖然功能路由目前很少，但即使在小型應用程式中，路由也有變得更複雜的傾向。

</div>

<a id="remove-duplicate-hero-routes"></a>

#### 移除重複的英雄路由

英雄路由目前定義在兩個地方：透過 `HeroesModule` 定義在 `HeroesRoutingModule` 中，以及定義在 `AppRoutingModule` 中。

功能模組提供的路由會由路由器合併到它們被匯入的模組的路由中。這讓你可以繼續定義功能模組路由，而不必修改主要的路由設定。

從 `app-routing.module.ts` 中移除 `HeroListComponent` 匯入與 `/heroes` 路由。

保留預設路由與萬用字元路由，因為它們仍在應用程式的頂層使用中。

<code-example header="src/app/app-routing.module.ts (v2)" path="router/src/app/app-routing.module.2.ts"></code-example>

<a id="merge-hero-routes"></a>

#### 移除英雄宣告

因為 `HeroesModule` 現在提供了 `HeroListComponent`，請將它從 `AppModule` 的 `declarations` 陣列中移除。現在你有了獨立的 `HeroesModule`，你可以用更多的元件與不同的路由來發展英雄功能。

完成這些步驟後，`AppModule` 應如下所示：

<code-example header="src/app/app.module.ts" path="router/src/app/app.module.3.ts" region="remove-heroes"></code-example>

<a id="routing-module-order"></a>

### 模組匯入順序

請注意，在模組的 `imports` 陣列中，`AppRoutingModule` 位於最後，排在 `HeroesModule` *之後*。

<code-example header="src/app/app.module.ts (module-imports)" path="router/src/app/app.module.3.ts" region="module-imports"></code-example>

路由設定的順序很重要，因為路由器會接受第一個符合導覽請求路徑的路由。

當所有路由都在同一個 `AppRoutingModule` 中時，你將預設路由與[萬用字元](#wildcard)路由放在最後、`/heroes` 路由之後，讓路由器有機會在碰到萬用字元路由並導覽到「Page not found」之前，先將 URL 與 `/heroes` 路由比對。

每個路由模組會依匯入順序擴充路由設定。如果你先列出 `AppRoutingModule`，萬用字元路由就會在英雄路由*之前*被註冊。萬用字元路由——它會比對*每個* URL——會攔截嘗試導覽到英雄路由的請求。

<div class="alert is-helpful">

反轉路由模組，看看點按 heroes 連結會導致「Page not found」。
請在[下方](#inspect-config "檢查路由器設定")了解如何檢查執行時期的路由器設定。

</div>

### 路由參數

<a id="route-def-with-parameter"></a>

#### 帶有參數的路由定義

回到 `HeroesRoutingModule`，再看一次路由定義。通往 `HeroDetailComponent` 的路由在路徑中有一個 `:id` 權杖。

<code-example header="src/app/heroes/heroes-routing.module.ts (excerpt)" path="router/src/app/heroes/heroes-routing.module.1.ts" region="hero-detail-route"></code-example>

`:id` 權杖會在路徑中為路由參數建立一個位置。在這個情況下，此設定會讓路由器將英雄的 `id` 插入該位置。

如果你告訴路由器導覽到詳細資料元件並顯示「Magneta」，你會預期瀏覽器 URL 中出現一個英雄 ID，如下所示：

<code-example format="nocode">

localhost:4200/hero/15

</code-example>

如果使用者將該 URL 輸入瀏覽器的網址列，路由器應該會辨認該模式，並前往同一個「Magneta」詳細資料檢視。

<div class="callout is-helpful">

<header>路由參數：必要還是可選？</header>

將路由參數權杖 `:id` 嵌入路由定義路徑中，是這個情境的好選擇，因為 `HeroDetailComponent` *需要* `id`，而且路徑中的值 `15` 能清楚區分通往「Magneta」的路由與通往其他英雄的路由。

</div>

<a id="route-parameters"></a>

#### 在清單檢視中設定路由參數

導覽到 `HeroDetailComponent` 後，你會預期看到所選英雄的詳細資料。你需要兩項資訊：通往該元件的路由路徑，以及英雄的 `id`。

因此，*連結參數陣列*有兩個項目：路由*路徑*，以及指定所選英雄 `id` 的*路由參數*。

<code-example header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" path="router/src/app/heroes/hero-list/hero-list.component.1.html" region="link-parameters-array"></code-example>

路由器會像這樣從陣列組成目的地 URL：`localhost:4200/hero/15`。

路由器會從 URL 中擷取路由參數（`id:15`），並使用 `ActivatedRoute` 服務將它提供給 `HeroDetailComponent`。

<a id="activated-route-in-action"></a>

### `Activated Route` 實際運作

從路由器套件匯入 `Router`、`ActivatedRoute` 與 `ParamMap` 權杖。

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (activated route)" path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" region="imports"></code-example>

匯入 `switchMap` 運算子，因為你稍後需要它來處理 `Observable` 路由參數。

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (switchMap operator import)" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" region="rxjs-operator-import"></code-example>

<a id="hero-detail-ctor"></a>

將服務作為私有變數加入建構子，讓 Angular 注入它們（使它們對元件可見）。

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (constructor)" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" region="ctor"></code-example>

在 `ngOnInit()` 方法中，使用 `ActivatedRoute` 服務擷取路由的參數、從參數中取出英雄 `id`，並擷取要顯示的英雄。

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit)" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" region="ngOnInit"></code-example>

當對應改變時，`paramMap` 會從變更後的參數中取得 `id` 參數。

接著你告訴 `HeroService` 擷取具有該 `id` 的英雄，並回傳 `HeroService` 請求的結果。

`switchMap` 運算子會做兩件事。它會將 `HeroService` 回傳的 `Observable<Hero>` 扁平化，並取消先前待處理的請求。如果使用者在 `HeroService` 仍在擷取舊 `id` 時，使用新的 `id` 重新導覽到這個路由，`switchMap` 會捨棄舊請求，並回傳新 `id` 的英雄。

`AsyncPipe` 會處理 observable 的訂閱，而元件的 `hero` 屬性將會以擷取到的英雄（重新）設定。

#### `ParamMap` API

`ParamMap` API 的靈感來自 [URLSearchParams 介面](https://developer.mozilla.org/docs/Web/API/URLSearchParams)。它提供方法來處理路由參數（`paramMap`）與查詢參數（`queryParamMap`）的參數存取。

| Members | Details |
|:---            |:---     |
| `has(name)` | 如果參數名稱在參數的對應中，則回傳 `true`。 |
| `get(name)` | 如果存在，則回傳參數名稱的值（一個 `string`），如果參數名稱不在對應中，則回傳 `null`。如果參數值實際上是值的陣列，則回傳*第一個*元素。 |
| `getAll(name)` | 如果找到，則回傳參數名稱值的 `string array`，如果參數名稱值不在對應中，則回傳空的 `array`。當單一參數可能有多個值時，請使用 `getAll`。 |
| `keys` | 回傳對應中所有參數名稱的 `string array`。 |

<a id="reuse"></a>

#### Observable `paramMap` 與元件重複使用

在這個範例中，你從一個 `Observable` 擷取路由參數對應。這意味著路由參數對應可能在這個元件的生命週期中改變。

預設情況下，當路由器重新導覽到相同類型的元件，而沒有先造訪不同的元件時，它會重複使用元件執行個體。路由參數每次都可能改變。

假設父元件導覽列有「向前」與「向後」按鈕，可以捲動瀏覽英雄清單。每次點按都會以命令式方式導覽到 `HeroDetailComponent`，並帶上下一個或上一個 `id`。

你不會希望路由器將目前的 `HeroDetailComponent` 執行個體從 DOM 中移除，只為了下一個 `id` 再重新建立它，因為這會重新渲染檢視。為了更好的使用者體驗，路由器會重複使用相同的元件執行個體並更新參數。

因為 `ngOnInit()` 在每次元件具現化時只會被呼叫一次，你可以使用 observable 的 `paramMap` 屬性，從*同一個執行個體內*偵測路由參數何時改變。

<div class="alert is-helpful">

當你在元件中訂閱 observable 時，幾乎總是會在元件被摧毀時取消訂閱。

然而，`ActivatedRoute` 的 observable 是例外之一，因為 `ActivatedRoute` 及其 observable 與 `Router` 本身是隔離的。
`Router` 會在不再需要路由元件時摧毀它。
這意味著元件的所有成員也會被摧毀，包括注入的 `ActivatedRoute` 及其 `Observable` 屬性的訂閱。

`Router` 不會 `complete` 任何 `ActivatedRoute` 的 `Observable`，因此任何 `finalize` 或 `complete` 區塊都不會執行。
如果你需要在 `finalize` 中處理某些事情，你仍然需要在 `ngOnDestroy` 中取消訂閱。
如果你的 observable 管道有延遲，且其中有你不希望在元件被摧毀後執行的程式碼，你也必須取消訂閱。

</div>

<a id="snapshot"></a>

#### `snapshot`：無 observable 的替代方案

這個應用程式不會重複使用 `HeroDetailComponent`。使用者總是會返回英雄清單以選取另一位要檢視的英雄。在沒有先造訪中間的清單元件的情況下，無法從一位英雄的詳細資料導覽到另一位英雄的詳細資料。因此，路由器每次都會建立一個新的 `HeroDetailComponent` 執行個體。

當你確定 `HeroDetailComponent` 執行個體永遠不會被重複使用時，你可以使用 `snapshot`。

`route.snapshot` 會提供路由參數對應的初始值。你可以直接存取參數，而不必像下列這樣訂閱或加入 observable 運算子：

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit snapshot)" path="router/src/app/heroes/hero-detail/hero-detail.component.2.ts" region="snapshot"></code-example>

<div class="alert is-helpful">

`snapshot` 使用這種技巧時只會取得參數對應的初始值。
如果路由器有可能重複使用元件，請使用 observable 的 `paramMap` 方法。
本教學範例應用程式使用 observable 的 `paramMap`。

</div>

<a id="nav-to-list"></a>

### 導覽回清單元件

`HeroDetailComponent` 的「Back」按鈕使用 `gotoHeroes()` 方法，以命令式方式導覽回 `HeroListComponent`。

路由器的 `navigate()` 方法接受與你可以綁定到 `[routerLink]` 指令的相同的單一項目*連結參數陣列*。它保存了通往 `HeroListComponent` 的路徑：

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (excerpt)" path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" region="gotoHeroes"></code-example>

<a id="optional-route-parameters"></a>

#### 路由參數：必要或選擇性？

使用[路由參數](#路由參數)，在路由 URL 內指定必要的參數值，就像你在導覽到 `HeroDetailComponent` 以檢視 `id` 為 15 的英雄時所做的那樣：

<code-example format="http" language="http">

localhost:4200/hero/15

</code-example>

你也可以在路由請求中加入選擇性資訊。例如，當從英雄詳細資料檢視返回 `hero-detail.component.ts` 清單時，如果被檢視的英雄能在清單中被預先選取，那就太好了。

<div class="lightbox">
  <img alt="選取的英雄" src="generated/images/guide/router/selected-hero.png">
</div>

你可以透過在從 `HeroDetailComponent` 返回時，將被檢視英雄的 `id` 作為選擇性參數包含在 URL 中，來實作這個功能。

選擇性資訊也可以包含其他形式，例如：

*   結構鬆散的搜尋條件；例如 `name='wind*'`
*   多個值；例如 `after='12/31/2015' & before='1/1/2017'`——順序不重要——`before='1/1/2017' & after='12/31/2015'`——以各種格式——`during='currentYear'`

由於這類參數無法平順地放入 URL 路徑中，你可以使用選擇性參數，在導覽期間傳達任意複雜的資訊。選擇性參數不參與模式比對，並提供了表達上的彈性。

路由器支援使用選擇性參數以及必要的路由參數進行導覽。在定義必要的路由參數*之後*，請在一個獨立的物件中定義選擇性參數。

一般來說，當值是強制性的（例如，為了區分一條路由路徑與另一條）時，請使用必要的路由參數；當值是選擇性的、複雜的，以及／或多變的時，請使用選擇性參數。

<a id="optionally-selecting"></a>

#### 英雄清單：選擇性地選取英雄

當導覽到 `HeroDetailComponent` 時，你在路由參數中指定了要編輯英雄的必要 `id`，並將它作為[*連結參數陣列*](#link-parameters-array)的第二個項目。

<code-example header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" path="router/src/app/heroes/hero-list/hero-list.component.1.html" region="link-parameters-array"></code-example>

路由器將 `id` 值嵌入導覽 URL 中，因為你已將它定義為路由參數，在路由 `path` 中使用 `:id` 預留位置權杖：

<code-example header="src/app/heroes/heroes-routing.module.ts (hero-detail-route)" path="router/src/app/heroes/heroes-routing.module.1.ts" region="hero-detail-route"></code-example>

當使用者點按返回按鈕時，`HeroDetailComponent` 會建構另一個*連結參數陣列*，用它來導覽回 `HeroListComponent`。

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (gotoHeroes)" path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" region="gotoHeroes"></code-example>

這個陣列缺少路由參數，因為你先前不需要將資訊傳送給 `HeroListComponent`。

現在，請在導覽請求中傳送目前英雄的 `id`，讓 `HeroListComponent` 可以在清單中突顯該英雄。

使用一個包含選擇性 `id` 參數的物件來傳送 `id`。為了示範目的，物件中有一個額外的無用參數（`foo`），`HeroListComponent` 應該忽略它。以下是修訂後的導覽陳述式：

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (go to heroes)" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" region="gotoHeroes"></code-example>

應用程式仍然可以運作。點按「back」會返回英雄清單檢視。

查看瀏覽器的網址列。

它應該看起來像這樣，取決於你在哪裡執行它：

<code-example format="shell" language="shell">

localhost:4200/heroes;id=15;foo=foo

</code-example>

`id` 值出現在 URL 中，如（`;id=15;foo=foo`），而不是出現在 URL 路徑中。「Heroes」路由的路徑沒有 `:id` 權杖。

選擇性路由參數不是像 URL 查詢字串中那樣以「?」與「&」分隔。它們以分號「;」分隔。這是矩陣 URL 表示法。

<div class="alert is-helpful">

矩陣 URL 表示法是網際網路創始人 Tim Berners-Lee 在 [1996 年提案](https://www.w3.org/DesignIssues/MatrixURIs.html)中首次提出的想法。

雖然矩陣表示法從未進入 HTML 標準，但它是合法的，而且在瀏覽器路由系統中變得很受歡迎，成為隔離屬於父路由與子路由的參數的一種方式。
因此，Router 在各瀏覽器中都支援矩陣表示法。

</div>

<a id="route-parameters-activated-route"></a>

### `ActivatedRoute` 服務中的路由參數

以目前的開發狀態來看，英雄清單沒有改變。沒有任何英雄列被突顯。

`HeroListComponent` 需要預期參數的程式碼。

先前，當你從 `HeroListComponent` 導覽到 `HeroDetailComponent` 時，你訂閱了路由參數對應 `Observable`，並在 `ActivatedRoute` 服務中將它提供給 `HeroDetailComponent`。你在 `HeroDetailComponent` 的建構子中注入了該服務。

這一次你將朝相反的方向導覽，從 `HeroDetailComponent` 到 `HeroListComponent`。

首先，擴充路由器匯入陳述式以包含 `ActivatedRoute` 服務符號：

<code-example header="src/app/heroes/hero-list/hero-list.component.ts (import)" path="router/src/app/heroes/hero-list/hero-list.component.ts" region="import-router"></code-example>

匯入 `switchMap` 運算子，以對路由參數對應的 `Observable` 執行操作。

<code-example header="src/app/heroes/hero-list/hero-list.component.ts (rxjs imports)" path="router/src/app/heroes/hero-list/hero-list.component.ts" region="rxjs-imports"></code-example>

在 `HeroListComponent` 建構子中注入 `ActivatedRoute`。

<code-example header="src/app/heroes/hero-list/hero-list.component.ts (constructor and ngOnInit)" path="router/src/app/heroes/hero-list/hero-list.component.ts" region="ctor"></code-example>

`ActivatedRoute.paramMap` 屬性是一個路由參數的 `Observable` 對應。當使用者導覽到該元件時，`paramMap` 會發出一個包含 `id` 的新的值對應。在 `ngOnInit()` 中，你訂閱這些值、設定 `selectedId`，並取得英雄。

使用[類別綁定](guide/class-binding)更新範本。當比較回傳 `true` 時，該綁定會加入 `selected` CSS 類別，回傳 `false` 時則移除它。請在重複的 `<li>` 標籤內尋找它，如下所示：

<code-example header="src/app/heroes/hero-list/hero-list.component.html" path="router/src/app/heroes/hero-list/hero-list.component.html"></code-example>

加入一些在英雄被選取時套用的樣式。

<code-example header="src/app/heroes/hero-list/hero-list.component.css" path="router/src/app/heroes/hero-list/hero-list.component.css" region="selected"></code-example>

當使用者從英雄清單導覽到「Magneta」英雄再返回時，「Magneta」會顯示為被選取：

<div class="lightbox">

<img alt="清單中選取的英雄有不同背景顏色" src="generated/images/guide/router/selected-hero.png">

</div>

選擇性的 `foo` 路由參數是無害的，路由器會繼續忽略它。

<a id="route-animation"></a>

### 加入可路由的動畫

本節會向你展示如何為 `HeroDetailComponent` 加入一些[動畫](guide/animations)。

首先，匯入 `BrowserAnimationsModule` 並將它加入 `imports` 陣列：

<code-example header="src/app/app.module.ts (animations-module)" path="router/src/app/app.module.ts" region="animations-module"></code-example>

接著，為 `HeroListComponent` 與 `HeroDetailComponent` 的路由加入一個 `data` 物件。轉場是基於 `states` 的，你使用路由中的 `animation` 資料來為轉場提供一個具名的動畫[`state`](api/animations/state)。

<code-example header="src/app/heroes/heroes-routing.module.ts (animation data)" path="router/src/app/heroes/heroes-routing.module.2.ts"></code-example>

在根 `src/app/` 資料夾中建立一個 `animations.ts` 檔案。其內容如下所示：

<code-example header="src/app/animations.ts (excerpt)" path="router/src/app/animations.ts"></code-example>

這個檔案會執行下列動作：

*   匯入建立動畫觸發器、控制狀態，以及管理狀態之間轉場的動畫符號
*   匯出一個名為 `slideInAnimation` 的常數，它被設為一個名為 `routeAnimation` 的動畫觸發器
*   定義一個轉場，在 `heroes` 與 `hero` 路由之間來回切換時，讓元件在進入應用程式檢視時（`:enter`）從螢幕左側緩入，另一個轉場則在元件離開應用程式檢視時（`:leave`）讓它向右滑出

回到 `AppComponent`，從 `@angular/router` 套件匯入 `RouterOutlet` 權杖，並從 `'./animations.ts` 匯入 `slideInAnimation`。

在 `@Component` 中繼資料中加入一個包含 `slideInAnimation` 的 `animations` 陣列。

<code-example header="src/app/app.component.ts (animations)" path="router/src/app/app.component.2.ts" region="animation-imports"></code-example>

若要使用可路由的動畫，請將 `RouterOutlet` 包裝在一個元素內，使用 `@routeAnimation` 觸發器，並將它綁定到該元素。

為了讓 `@routeAnimation` 轉場根據狀態觸發，請提供它來自 `ActivatedRoute` 的 `data`。`RouterOutlet` 會以 `outlet` 範本變數的形式公開，因此請綁定一個對路由器插座的參照。這個範例使用 `routerOutlet` 變數。

<code-example header="src/app/app.component.html (router outlet)" path="router/src/app/app.component.2.html"></code-example>

`@routeAnimation` 屬性會綁定到 `getAnimationData()`，它會回傳主要路由提供的 `data` 中的動畫屬性。`animation` 屬性會符合你在 `animations.ts` 中定義的 `slideInAnimation` 中使用的 `transition` 名稱。


<code-example header="src/app/app.component.ts (router outlet)" path="router/src/app/app.component.2.ts" region="function-binding"></code-example>

在兩個路由之間切換時，`HeroDetailComponent` 與 `HeroListComponent` 現在會在被路由到時從左側緩入，在離開時向右滑出。

<a id="milestone-3-wrap-up"></a>

### 里程碑 3 總結

本節涵蓋了下列內容：

*   將應用程式組織成功能區域
*   以命令式方式從一個元件導覽到另一個元件
*   在路由參數中傳遞資訊，並在元件中訂閱它們
*   將功能區域 NgModule 匯入 `AppModule`
*   根據頁面套用可路由的動畫

完成這些變更後，資料夾結構如下：

<div class="filetree">
  <div class="file">
    angular-router-tour-of-heroes
  </div>
  <div class="children">
    <div class="file">
      src
    </div>
    <div class="children">
      <div class="file">
        app
      </div>
      <div class="children">
        <div class="file">
          crisis-list
        </div>
          <div class="children">
            <div class="file">
              crisis-list.component.css
            </div>
            <div class="file">
              crisis-list.component.html
            </div>
            <div class="file">
              crisis-list.component.ts
            </div>
          </div>
        <div class="file">
          heroes
        </div>
        <div class="children">
          <div class="file">
            hero-detail
          </div>
            <div class="children">
              <div class="file">
                hero-detail.component.css
              </div>
              <div class="file">
                hero-detail.component.html
              </div>
              <div class="file">
                hero-detail.component.ts
              </div>
            </div>
          <div class="file">
            hero-list
          </div>
            <div class="children">
              <div class="file">
                hero-list.component.css
              </div>
              <div class="file">
                hero-list.component.html
              </div>
              <div class="file">
                hero-list.component.ts
              </div>
            </div>
          <div class="file">
            hero.service.ts
          </div>
          <div class="file">
            hero.ts
          </div>
          <div class="file">
            heroes-routing.module.ts
          </div>
          <div class="file">
            heroes.module.ts
          </div>
          <div class="file">
            mock-heroes.ts
          </div>
        </div>
        <div class="file">
          page-not-found
        </div>
        <div class="children">
          <div class="file">
            page-not-found.component.css
          </div>
          <div class="file">
            page-not-found.component.html
          </div>
          <div class="file">
            page-not-found.component.ts
          </div>
        </div>
      </div>
      <div class="file">
        animations.ts
      </div>
      <div class="file">
        app.component.css
      </div>
      <div class="file">
        app.component.html
      </div>
      <div class="file">
        app.component.ts
      </div>
      <div class="file">
        app.module.ts
      </div>
      <div class="file">
        app-routing.module.ts
      </div>
      <div class="file">
        main.ts
      </div>
      <div class="file">
        message.service.ts
      </div>
      <div class="file">
        index.html
      </div>
      <div class="file">
        styles.css
      </div>
      <div class="file">
        tsconfig.json
      </div>
    </div>
    <div class="file">
      node_modules &hellip;
    </div>
    <div class="file">
      package.json
    </div>
  </div>
</div>

以下是這個版本範例應用程式的相關檔案。

<code-tabs>
    <code-pane header="animations.ts" path="router/src/app/animations.ts"></code-pane>
    <code-pane header="app.component.html" path="router/src/app/app.component.2.html"></code-pane>
    <code-pane header="app.component.ts" path="router/src/app/app.component.2.ts"></code-pane>
    <code-pane header="app.module.ts" path="router/src/app/app.module.3.ts"></code-pane>
    <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.2.ts" region="milestone3"></code-pane>
    <code-pane header="hero-list.component.css" path="router/src/app/heroes/hero-list/hero-list.component.css"></code-pane>
    <code-pane header="hero-list.component.html" path="router/src/app/heroes/hero-list/hero-list.component.html"></code-pane>
    <code-pane header="hero-list.component.ts" path="router/src/app/heroes/hero-list/hero-list.component.ts"></code-pane>
    <code-pane header="hero-detail.component.html" path="router/src/app/heroes/hero-detail/hero-detail.component.html"></code-pane>
    <code-pane header="hero-detail.component.ts" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts"></code-pane>
    <code-pane header="hero.service.ts" path="router/src/app/heroes/hero.service.ts"></code-pane>
    <code-pane header="heroes.module.ts" path="router/src/app/heroes/heroes.module.ts"></code-pane>
    <code-pane header="heroes-routing.module.ts" path="router/src/app/heroes/heroes-routing.module.2.ts"></code-pane>
    <code-pane header="message.service.ts" path="router/src/app/message.service.ts"></code-pane>
</code-tabs>

<a id="milestone-4"></a>

## 里程碑 4：危機中心功能

本節會向你展示如何加入子路由，並在應用程式中使用相對路由。

若要為應用程式目前的危機中心加入更多功能，請採取與英雄功能類似的步驟：

*   在 `src/app` 資料夾中建立一個 `crisis-center` 子資料夾
*   將 `app/heroes` 中的檔案與資料夾複製到新的 `crisis-center` 資料夾中
*   在新檔案中，將每個提到的「hero」改為「crisis」，「heroes」改為「crises」
*   將 NgModule 檔案重新命名為 `crisis-center.module.ts` 與 `crisis-center-routing.module.ts`

使用模擬危機而非模擬英雄：

<code-example header="src/app/crisis-center/mock-crises.ts" path="router/src/app/crisis-center/mock-crises.ts"></code-example>

產生的危機中心是引入新概念——子路由——的基礎。你可以將 Heroes 保持在目前狀態，作為與危機中心的對照。

<div class="alert is-helpful">

遵循[關注點分離原則](https://blog.8thlight.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html "關注點分離")，對危機中心的變更不會影響 `AppModule` 或任何其他功能的元件。

</div>

<a id="crisis-child-routes"></a>

### 帶有子路由的危機中心

本節會向你展示如何組織危機中心，以符合下列 Angular 應用程式的建議模式：

*   每個功能區域都位於自己的資料夾中
*   每個功能都有自己的 Angular 功能模組
*   每個區域都有自己的區域根元件
*   每個區域根元件都有自己的路由器插座與子路由
*   功能區域路由很少（即使有）會與其他功能的路由交叉

如果你的應用程式有許多功能區域，元件樹可能由多個功能元件組成，每個元件都有其他相關元件的分支。

<a id="child-routing-component"></a>

### 子路由元件

在 `crisis-center` 資料夾中產生一個 `CrisisCenter` 元件：

<code-example format="shell" language="shell">

ng generate component crisis-center/crisis-center

</code-example>

使用下列標記更新元件範本：

<code-example header="src/app/crisis-center/crisis-center/crisis-center.component.html" path="router/src/app/crisis-center/crisis-center/crisis-center.component.html"></code-example>

`CrisisCenterComponent` 與 `AppComponent` 有以下共通點：

*   它是危機中心區域的根，就像 `AppComponent` 是整個應用程式的根一樣
*   它是危機管理功能區的殼層，就像 `AppComponent` 是管理高階工作流程的殼層一樣

和大多數殼層一樣，`CrisisCenterComponent` 類別非常精簡，因為它沒有商業邏輯，而且它的範本沒有連結，只有標題和一個供危機中心子元件使用的 `<router-outlet>`。

<a id="child-route-config"></a>

### 子路由設定

作為「危機中心」功能的宿主頁面，請在 `crisis-center` 資料夾中產生一個 `CrisisCenterHome` 元件。

<code-example format="shell" language="shell">

ng generate component crisis-center/crisis-center-home

</code-example>

使用歡迎來到 `Crisis Center` 的訊息更新範本。

<code-example header="src/app/crisis-center/crisis-center-home/crisis-center-home.component.html" path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html"></code-example>

更新你從 `heroes-routing.module.ts` 檔案複製後重新命名的 `crisis-center-routing.module.ts`。這次，你要在父層 `crisis-center` 路由內定義子路由。

<code-example header="src/app/crisis-center/crisis-center-routing.module.ts (Routes)" path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" region="routes"></code-example>

請注意，父層 `crisis-center` 路由有一個 `children` 屬性，其中包含一個含有 `CrisisListComponent` 的路由。`CrisisListComponent` 路由也有一個包含兩個路由的 `children` 陣列。

這兩個路由分別導覽至危機中心子元件 `CrisisCenterHomeComponent` 與 `CrisisDetailComponent`。

路由器處理子路由的方式有幾個重要差異。

路由器會把這些路由的元件顯示在 `CrisisCenterComponent` 的 `RouterOutlet` 中，而不是 `AppComponent` 殼層的 `RouterOutlet` 中。

`CrisisListComponent` 包含危機清單，以及一個用來顯示 `Crisis Center Home` 與 `Crisis Detail` 路由元件的 `RouterOutlet`。

`Crisis Detail` 路由是 `Crisis List` 的子路由。路由器預設會[重複使用元件](#reuse)，因此當你選取不同的危機時，`Crisis Detail` 元件會被重複使用。相較之下，先前在 `Hero Detail` 路由中，每次從英雄清單選取不同的英雄時，[元件都會重新建立](#snapshot無-observable-的替代方案)。

在最上層，以 `/` 開頭的路徑指的是應用程式的根。但子路由會延伸父路由的路徑。沿著路由樹每往下一層，你就要加上一個斜線再接路由路徑，除非路徑是空的。

把這個邏輯套用到危機中心的導覽，其父路徑為 `/crisis-center`。

*   若要導覽至 `CrisisCenterHomeComponent`，完整 URL 是 `/crisis-center` \(`/crisis-center` + `''` + `''`\)
*   若要導覽至 `id=2` 危機的 `CrisisDetailComponent`，完整 URL 是 `/crisis-center/2` \(`/crisis-center` + `''` + `'/2'`\)

後一個範例的絕對 URL（包含 `localhost` 來源）如下：

<code-example>

localhost:4200/crisis-center/2

</code-example>

以下是完整的 `crisis-center-routing.module.ts` 檔案及其匯入。

<code-example header="src/app/crisis-center/crisis-center-routing.module.ts (excerpt)" path="router/src/app/crisis-center/crisis-center-routing.module.1.ts"></code-example>

<a id="import-crisis-module"></a>

### 將危機中心模組匯入 `AppModule` 路由

和 `HeroesModule` 一樣，你必須把 `CrisisCenterModule` 加入 `AppModule` 的 `imports` 陣列，而且要放在 `AppRoutingModule` *之前*：

<code-tabs>
    <code-pane header="src/app/crisis-center/crisis-center.module.ts" path="router/src/app/crisis-center/crisis-center.module.ts"></code-pane>
    <code-pane header="src/app/app.module.ts (import CrisisCenterModule)" path="router/src/app/app.module.4.ts" region="crisis-center-module"></code-pane>
</code-tabs>

<div class="alert is-helpful">

模組的匯入順序很重要，因為模組中定義的路由順序會影響路由比對。
如果先匯入 `AppModule`，其萬用字元路由（`path: '**'`）會優先於 `CrisisCenterModule` 中定義的路由。
更多資訊請參閱[路由順序](guide/router#路由順序)一節。

</div>

移除 `app-routing.module.ts` 中最初的危機中心路由，因為現在 `HeroesModule` 與 `CrisisCenter` 模組會提供功能路由。

`app-routing.module.ts` 檔案會保留預設路由與萬用字元路由等最上層應用程式路由。

<code-example header="src/app/app-routing.module.ts (v3)" path="router/src/app/app-routing.module.3.ts" region="v3"></code-example>

<a id="relative-navigation"></a>

### 相對導覽

在建置危機中心功能的過程中，你是使用以斜線開頭的絕對路徑來導覽至危機詳細資料路由。

路由器會從路由設定的最上層開始，將這類絕對路徑與路由進行比對。

你可以繼續使用像這樣的絕對路徑在危機中心功能內導覽，但這樣會把連結綁死在父層路由結構上。如果你變更父層 `/crisis-center` 路徑，就必須變更連結參數陣列。

你可以改用相對於目前 URL 區段的路徑來定義連結，擺脫這種相依性。即使你變更通往該功能區的父路由路徑，功能區內的導覽仍然保持完整。

<div class="alert is-helpful">

路由器支援*連結參數清單*中的目錄式語法，以協助引導路由名稱查詢：

| 目錄式語法 | 詳細說明 |
|:--- |:--- |
| `./` <br /> `no leading slash` | 相對於目前層級。 |
| `../` | 在路由路徑中往上一層。 |

你可以把相對導覽語法與祖先路徑結合使用。
如果你必須導覽至同層路由，可以使用 `../<sibling>` 慣例，先往上一層，
再橫向移至同層路由路徑。

</div>

若要使用 `Router.navigate` 方法導覽相對路徑，你必須提供 `ActivatedRoute`，讓路由器知道你在目前路由樹中的位置。

在*連結參數陣列*之後，加入一個將 `relativeTo` 屬性設為 `ActivatedRoute` 的物件。路由器接著會根據作用中路由的位置來計算目標 URL。

<div class="alert is-helpful">

呼叫路由器的 `navigateByUrl()` 方法時，務必指定完整的絕對路徑。

</div>

<a id="nav-to-crisis"></a>

### 使用相對 URL 導覽至危機清單

你已經注入了組成相對導覽路徑所需的 `ActivatedRoute`。

若改用 `RouterLink` 而非 `Router` 服務來導覽，你會使用相同的連結參數陣列，但不會提供帶有 `relativeTo` 屬性的物件。`ActivatedRoute` 在 `RouterLink` 指令中是隱含的。

更新 `CrisisDetailComponent` 的 `gotoCrises()` 方法，改用相對路徑導覽回到危機中心清單。

<code-example header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (relative navigation)" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" region="gotoCrises-navigate"></code-example>

請注意，路徑會使用 `../` 語法往上一層。如果目前危機的 `id` 是 `3`，回到危機清單的結果路徑就是 `/crisis-center/;id=3;foo=foo`。

<a id="named-outlets"></a>

<a id="displaying-multiple-routes-in-named-outlets"></a>
### 在具名 outlet 中顯示多個路由

你決定提供使用者聯絡危機中心的方式。當使用者點選「聯絡」按鈕時，你希望在彈出視窗中顯示一則訊息。

彈出視窗應保持開啟，即使在應用程式的頁面之間切換也一樣，直到使用者傳送訊息或取消後才關閉。顯然你不能把彈出視窗放在與其他頁面相同的 outlet 中。

到目前為止，你只定義了一個 outlet，並在該 outlet 下嵌套子路由來將路由分組。路由器在每個範本中只支援一個主要的未具名 outlet。

範本也可以有任意數量的具名 outlet。每個具名 outlet 都有自己的一組路由與各自的元件。多個 outlet 可以同時顯示由不同路由決定的不同內容。

在 `AppComponent` 中加入一個名為「popup」的 outlet，緊接在未具名 outlet 之後。

<code-example header="src/app/app.component.html (outlets)" path="router/src/app/app.component.4.html" region="outlets"></code-example>

一旦你學會如何把彈出元件路由到該 outlet，彈出視窗就會出現在那裡。

<a id="secondary-routes"></a>

#### 次要路由

具名 outlet 是*次要路由*的目標。

次要路由看起來像主要路由，設定方式也相同。它們在幾個關鍵方面有所不同。

*   它們彼此獨立
*   它們會與其他路由搭配運作
*   它們顯示在具名 outlet 中

產生一個新的元件來撰寫訊息。

<code-example format="shell" language="shell">

ng generate component compose-message

</code-example>

它會顯示一個簡短的表單，包含標頭、訊息輸入方塊，以及「傳送」與「取消」兩個按鈕。

<div class="lightbox">

<img alt="聯絡文字區域，含傳送與取消按鈕" src="generated/images/guide/router/contact-form.png">

</div>

以下是該元件、其範本與樣式：

<code-tabs>
    <code-pane header="src/app/compose-message/compose-message.component.html" path="router/src/app/compose-message/compose-message.component.html"></code-pane>
    <code-pane header="src/app/compose-message/compose-message.component.ts" path="router/src/app/compose-message/compose-message.component.ts"></code-pane>
    <code-pane header="src/app/compose-message/compose-message.component.css" path="router/src/app/compose-message/compose-message.component.css"></code-pane>
</code-tabs>

它看起來和本指南中的其他元件相似，但有兩個關鍵差異。

<div class="alert is-helpful">

**注意**：<br />
`send()` 方法會在「傳送」訊息並關閉彈出視窗之前，等待一秒來模擬延遲。

</div>

`closePopup()` 方法會導覽至帶有 `null` 的彈出 outlet 來關閉彈出視窗，[清除次要路由](#clear-secondary-routes)一節會說明這一點。

<a id="add-secondary-route"></a>

#### 加入次要路由

開啟 `AppRoutingModule`，並在 `appRoutes` 中加入一個新的 `compose` 路由。

<code-example header="src/app/app-routing.module.ts (compose route)" path="router/src/app/app-routing.module.3.ts" region="compose"></code-example>

除了 `path` 與 `component` 屬性之外，還有一個名為 `outlet` 的新屬性，設為 `'popup'`。這個路由現在以彈出 outlet 為目標，`ComposeMessageComponent` 會顯示在那裡。

若要讓使用者有辦法開啟彈出視窗，請在 `AppComponent` 範本中加入一個「聯絡」連結。

<code-example header="src/app/app.component.html (contact-link)" path="router/src/app/app.component.4.html" region="contact-link"></code-example>

雖然 `compose` 路由已設定為「popup」outlet，但僅這樣還不足以把路由連接到 `RouterLink` 指令。你必須在*連結參數陣列*中指定具名 outlet，並透過屬性繫結將其繫結到 `RouterLink`。

*連結參數陣列*包含一個物件，該物件只有一個 `outlets` 屬性，其值是另一個以一個（或多個）outlet 名稱為鍵的物件。在這個例子中，只有「popup」outlet 屬性，其值是另一個指定 `compose` 路由的*連結參數陣列*。

換句話說，當使用者點選這個連結時，路由器會把與 `compose` 路由相關聯的元件顯示在 `popup` outlet 中。

<div class="alert is-helpful">

當只有一個路由與一個未具名 outlet 時，這個外層物件內的 `outlets` 物件是不必要的。

路由器假設你的路由規格以未具名的主要 outlet 為目標，並為你建立這些物件。

路由到具名 outlet 揭示了路由器的一項功能：
你可以在同一個 `RouterLink` 指令中使用多個路由來指定多個 outlet。

</div>

<a id="secondary-route-navigation"></a>

#### 次要路由導覽：在導覽期間合併路由

導覽至*危機中心*並點選「聯絡」。你應該會在瀏覽器網址列中看到類似以下的 URL。

<code-example format="http" language="http">

http://&hellip;/crisis-center(popup:compose)

</code-example>

URL 中與 `...` 相關的部分如下：

*   `crisis-center` 是主要導覽
*   括號圍住次要路由
*   次要路由由 outlet 名稱 \(`popup`\)、一個 `colon` 分隔符號，以及次要路由路徑 \(`compose`\) 組成

點選 *Heroes* 連結，再看一次 URL。

<code-example format="http" language="http">

http://&hellip;/heroes(popup:compose)

</code-example>

主要導覽的部分改變了；次要路由維持不變。

路由器會追蹤導覽樹中的兩個獨立分支，並在 URL 中產生該樹的表示法。

你可以加入更多 outlet 與路由，位於最上層與嵌套層級，建立具有許多分支的導覽樹，路由器也會產生相應的 URL。

你可以填寫 `outlets` 物件，一次導覽整棵樹，然後把該物件放在*連結參數陣列*中傳給 `router.navigate` 方法。

<a id="clear-secondary-routes"></a>

#### 清除次要路由

和一般 outlet 一樣，次要 outlet 會持續存在，直到你導覽至新的元件。

每個次要 outlet 都有自己的導覽，獨立於驅動主要 outlet 的導覽。變更顯示在主要 outlet 中的目前路由，對彈出 outlet 沒有影響。這就是彈出視窗在你於危機與英雄之間導覽時仍保持可見的原因。

再看一次 `closePopup()` 方法：

<code-example header="src/app/compose-message/compose-message.component.ts (closePopup)" path="router/src/app/compose-message/compose-message.component.ts" region="closePopup"></code-example>

點選「傳送」或「取消」按鈕會清除彈出視窗。`closePopup()` 函式會使用 `Router.navigate()` 方法以命令式導覽，傳入一個[連結參數陣列](#link-parameters-array)。

和繫結到 `AppComponent` 中 *Contact* `RouterLink` 的陣列一樣，這個陣列包含一個帶有 `outlets` 屬性的物件。`outlets` 屬性的值是另一個以 outlet 名稱為鍵的物件。唯一具名的 outlet 是 `'popup'`。

這次 `'popup'` 的值是 `null`。那不是一個路由，但卻是合法的值。把彈出 `RouterOutlet` 設為 `null` 會清除該 outlet，並從目前 URL 中移除次要彈出路由。

<div class="alert is-critical">

**注意：**傳給 `Router.navigate()` 的陣列中的所有命令，都以 `UrlTree` 中的_特定區段_為目標。
我們把 `ActivatedRoute` 的父層指定為 `relativeTo` 選項，因為我們想要從持有其參照的區段中移除 `'popup'`。
務必隨時注意命令會套用到哪些區段。

</div>

<div class="alert is-helpful">

當沒有提供 `relativeTo` 給 `Router.navigate()` 方法時，命令會從根開始處理。
在這個特定範例中，我們可以省略 `relativeTo` 選項，因為 `'popup'` outlet 出現在設定的根層級。
  
</div>

<div class="alert is-helpful">

如果你想關閉出現在任何區段深度的 outlet，可以
透過從目前 URL 建立一個 `UrlTree`、遞迴清除與 outlet 名稱相符的區段 `children`，最後
使用目前 `UrlTree` 的 `root` 區段呼叫 `Router.navigateByUrl()` 來達成。

</div>

<a id="guards"></a>
<a id="milestone-5-route-guards"></a>

## 里程碑 5：路由守衛

目前，任何使用者隨時都可以在應用程式中任意導覽，但有時候你需要基於各種原因控制對應用程式不同部分的存取，其中可能包括以下情況：

*   使用者可能未獲授權導覽至目標元件
*   使用者可能必須先登入（驗證身分）
*   在顯示目標元件之前，你可能應該先擷取一些資料
*   離開元件之前，你可能想儲存待處理的變更
*   你可能想詢問使用者是否可以捨棄待處理的變更，而不是儲存它們

你可以在路由設定中加入守衛來處理這些情境。

守衛的回傳值會控制路由器的行為：

| 守衛回傳值 | 詳細說明 |
|:---                |:---     |
| `true` | 導覽程序繼續進行 |
| `false` | 導覽程序停止，使用者停留在原地 |
| `UrlTree` | 目前的導覽取消，並對回傳的 `UrlTree` 開始新的導覽 |

<div class="alert is-helpful">

**注意：**守衛也可以告訴路由器導覽至別處，實際上就是取消目前的導覽。
在守衛內這樣做時，守衛應該回傳 `UrlTree`。

</div>

守衛可能會同步回傳布林答案。但在許多情況下，守衛無法同步產生答案。守衛可能會向使用者提問、把變更儲存到伺服器，或擷取最新資料。這些都是非同步操作。

因此，路由守衛可以回傳 `Observable<boolean>` 或 `Promise<boolean>`，路由器會等待該 Observable 或 Promise 解析為 `true` 或 `false`。

<div class="alert is-helpful">

**注意**：<br />
提供給 `Router` 的 Observable 會在擷取第一個值之後自動完成。

</div>

路由器支援多種守衛方法：

| 守衛介面 | 詳細說明 |
|:---                                               |:---     |
| [`canActivate`](api/router/CanActivateFn) | 調解導覽*至*某個路由 |
| [`canActivateChild`](api/router/CanActivateChildFn) | 調解導覽*至*某個子路由 |
| [`canDeactivate`](api/router/CanDeactivateFn) | 調解從目前路由*離開*的導覽 |
| [`resolve`](api/router/ResolveFn) | 在路由啟用*之前*執行路由資料擷取 |
| [`canMatch`](api/router/CanMatchFn) | 控制是否完全使用某個 `Route`，即使 `path` 與 URL 區段相符 |

你可以在路由階層的每個層級設置多個守衛。路由器會先檢查 `canDeactivate` 守衛，從最深層的子路由檢查到最上層。接著從最上層檢查到最深層的子路由，檢查 `canActivate` 與 `canActivateChild` 守衛。如果功能模組是非同步載入的，`canMatch` 守衛會在模組載入之前檢查。

除了 `canMatch` 之外，如果*任何*守衛回傳 false，尚未完成的待處理守衛會被取消，整個導覽也會被取消。如果 `canMatch` 守衛回傳 `false`，`Router` 會繼續處理其餘的 `Routes`，看看是否有不同的 `Route` 設定與 URL 相符。你可以把這想成 `Router` 假裝帶有 `canMatch` 守衛的 `Route` 不存在。

接下來幾節有數個範例。

<a id="can-activate-guard"></a>

### `canActivate`：要求驗證身分

應用程式經常會根據使用者身分限制對功能區的存取。你可能只允許已驗證的使用者或具有特定角色的使用者存取。你也可能在使用者帳號啟用之前封鎖或限制存取。

`canActivate` 守衛就是用來管理這些導覽商業規則的工具。

#### 加入管理功能模組

本節會引導你擴充危機中心，加入一些新的管理功能。首先加入一個名為 `AdminModule` 的新功能模組。

產生一個 `admin` 資料夾，內含功能模組檔案與路由設定檔案。

<code-example format="shell" language="shell">

ng generate module admin --routing

</code-example>

接著，產生支援元件。

<code-example format="shell" language="shell">

ng generate component admin/admin-dashboard

</code-example>

<code-example format="shell" language="shell">

ng generate component admin/admin

</code-example>

<code-example format="shell" language="shell">

ng generate component admin/manage-crises

</code-example>

<code-example format="shell" language="shell">

ng generate component admin/manage-heroes

</code-example>

管理功能檔案結構如下：

<div class="filetree">
  <div class="file">
    src/app/admin
  </div>
  <div class="children">
    <div class="file">
      admin
    </div>
      <div class="children">
        <div class="file">
          admin.component.css
        </div>
        <div class="file">
          admin.component.html
        </div>
        <div class="file">
          admin.component.ts
        </div>
      </div>
    <div class="file">
      admin-dashboard
    </div>
      <div class="children">
        <div class="file">
          admin-dashboard.component.css
        </div>
        <div class="file">
          admin-dashboard.component.html
        </div>
        <div class="file">
          admin-dashboard.component.ts
        </div>
      </div>
    <div class="file">
      manage-crises
    </div>
      <div class="children">
        <div class="file">
          manage-crises.component.css
        </div>
        <div class="file">
          manage-crises.component.html
        </div>
        <div class="file">
          manage-crises.component.ts
        </div>
      </div>
    <div class="file">
      manage-heroes
    </div>
      <div class="children">
        <div class="file">
          manage-heroes.component.css
        </div>
        <div class="file">
          manage-heroes.component.html
        </div>
        <div class="file">
          manage-heroes.component.ts
        </div>
      </div>
    <div class="file">
      admin.module.ts
    </div>
    <div class="file">
      admin-routing.module.ts
    </div>
  </div>
</div>

管理功能模組包含用於功能模組內路由的 `AdminComponent`、一個儀表板路由，以及兩個用來管理危機與英雄的未完成元件。

<code-tabs>
    <code-pane header="src/app/admin/admin/admin.component.html"  path="router/src/app/admin/admin/admin.component.html"></code-pane>
    <code-pane header="src/app/admin/admin-dashboard/admin-dashboard.component.html" path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.html"></code-pane>
    <code-pane header="src/app/admin/admin.module.ts" path="router/src/app/admin/admin.module.ts"></code-pane>
    <code-pane header="src/app/admin/manage-crises/manage-crises.component.html" path="router/src/app/admin/manage-crises/manage-crises.component.html"></code-pane>
    <code-pane header="src/app/admin/manage-heroes/manage-heroes.component.html"  path="router/src/app/admin/manage-heroes/manage-heroes.component.html"></code-pane>
</code-tabs>

<div class="alert is-helpful">

雖然管理儀表板的 `RouterLink` 只包含一個沒有額外 URL 區段的相對斜線，但它與管理功能區內的任何路由都相符。
你只希望 `Dashboard` 連結在使用者造訪該路由時才處於作用中狀態。
在 `Dashboard` 的 routerLink 上加入額外的繫結 `[routerLinkActiveOptions]="{ exact: true }"`，會在使用者導覽至 `/admin` URL 時把 `./` 連結標記為作用中，而不是在導覽至任何子路由時。

</div>

<a id="component-less-route"></a>

##### 無元件路由：在沒有元件的情況下分組路由

初始的管理路由設定如下：

<code-example header="src/app/admin/admin-routing.module.ts (admin routing)" path="router/src/app/admin/admin-routing.module.1.ts" region="admin-routes"></code-example>

`AdminComponent` 下的子路由有 `path` 與 `children` 屬性，但沒有使用 `component`。這定義了一個*無元件*路由。

若要把 `Crisis Center` 管理路由分組在 `admin` 路徑之下，並不需要元件。此外，*無元件*路由讓[守衛子路由](#can-activate-child-guard)變得更容易。

接著，把 `AdminModule` 匯入 `app.module.ts`，並加入 `imports` 陣列以註冊管理路由。

<code-example header="src/app/app.module.ts (admin module)" path="router/src/app/app.module.4.ts" region="admin-module"></code-example>

在 `AppComponent` 殼層中加入一個「管理」連結，讓使用者可以前往這個功能。

<code-example header="src/app/app.component.html (template)" path="router/src/app/app.component.5.html"></code-example>

<a id="guard-admin-feature"></a>

#### 守衛管理功能

目前，危機中心內的每個路由都對所有人開放。新的管理功能應該只有已驗證的使用者才能存取。

撰寫一個 `canActivate()` 守衛方法，當匿名使用者嘗試進入管理區時，將他們重新導向至登入頁面。

在 `auth` 資料夾中建立一個名為 `auth.guard.ts` 的新檔案。`auth.guard.ts` 檔案將包含 `authGuard` 函式。

<code-example format="shell" language="shell">

ng generate guard auth/auth

</code-example>

為了示範基本原理，本範例只會記錄到主控台、立即回傳 `true`，並讓導覽繼續進行：

<code-example header="src/app/auth/auth.guard.ts (excerpt)" path="router/src/app/auth/auth.guard.1.ts"></code-example>

接著，開啟 `admin-routing.module.ts`，匯入 `authGuard` 函式，並使用 `canActivate` 守衛屬性更新管理路由，該屬性會參照它：

<code-example header="src/app/admin/admin-routing.module.ts (guarded admin route)" path="router/src/app/admin/admin-routing.module.2.ts" region="admin-route"></code-example>

管理功能現在受到守衛保護，但守衛需要更多客製化才能完整運作。

<a id="teach-auth"></a>

#### 使用 `authGuard` 進行驗證

讓 `authGuard` 模擬驗證。

`authGuard` 應該呼叫一個可以讓使用者登入並保留目前使用者資訊的應用程式服務。在 `auth` 資料夾中產生一個新的 `AuthService`：

<code-example format="shell" language="shell">

ng generate service auth/auth

</code-example>

更新 `AuthService` 以讓使用者登入：

<code-example header="src/app/auth/auth.service.ts (excerpt)" path="router/src/app/auth/auth.service.ts"></code-example>

雖然它實際上並沒有登入，但它有一個 `isLoggedIn` 旗標，可以告訴你使用者是否已驗證。它的 `login()` 方法會回傳一個 Observable，模擬對外部服務的 API 呼叫，在短暫暫停後成功解析。`redirectUrl` 屬性會儲存使用者想要存取的 URL，讓你可以在驗證後導覽至該 URL。

<div class="alert is-helpful">

為了保持簡潔，這個範例會把未驗證的使用者重新導向至 `/admin`。

</div>

修改 `authGuard` 以呼叫 `AuthService`。

<code-example header="src/app/auth/auth.guard.ts (v2)" path="router/src/app/auth/auth.guard.2.ts"></code-example>

這個守衛會回傳同步布林結果或 `UrlTree`。如果使用者已登入，它會回傳 `true`，導覽繼續進行。否則，它會重新導向至登入頁面；一個你尚未建立的頁面。回傳 `UrlTree` 會告訴 `Router` 取消目前的導覽，並排定一個新的導覽來重新導向使用者。

<a id="add-login-component"></a>

#### 加入 `LoginComponent`

你需要一個 `LoginComponent` 讓使用者登入應用程式。登入後，你會重新導向至儲存的 URL（如果有的話），或使用預設 URL。這個元件或它在路由器設定中的使用方式沒有什麼新東西。

<code-example format="shell" language="shell">

ng generate component auth/login

</code-example>

在 `auth/auth-routing.module.ts` 檔案中註冊一個 `/login` 路由。在 `app.module.ts` 中匯入 `AuthModule` 並將其加入 `AppModule` 的 imports 陣列。

<code-tabs>
    <code-pane header="src/app/app.module.ts" path="router/src/app/app.module.ts" region="auth"></code-pane>
    <code-pane header="src/app/auth/login/login.component.html" path="router/src/app/auth/login/login.component.html"></code-pane>
    <code-pane header="src/app/auth/login/login.component.ts" path="router/src/app/auth/login/login.component.1.ts"></code-pane>
    <code-pane header="src/app/auth/auth.module.ts" path="router/src/app/auth/auth.module.ts"></code-pane>
</code-tabs>


<a id="can-activate-child-guard"></a>

### `canActivateChild`：守衛子路由

你也可以使用 `canActivateChild` 守衛來保護子路由。`canActivateChild` 守衛與 `canActivate` 守衛相似。主要差異在於它會在任何子路由啟用之前執行。

你已經保護管理功能模組免於未經授權的存取。你也應該保護功能模組*內*的子路由。

在 `component-less`（無元件）管理路由中加入相同的 `authGuard`，一次保護所有其他子路由，而不必逐一為每個路由加入 `authGuard`。

<code-example header="src/app/admin/admin-routing.module.ts (excerpt)" path="router/src/app/admin/admin-routing.module.3.ts" region="can-activate-child"></code-example>

<a id="can-deactivate-guard"></a>

### `canDeactivate`：處理未儲存的變更

回到「英雄」工作流程，應用程式會立即接受對英雄的每項變更，不做任何驗證。

在真實世界中，你可能必須累積使用者的變更、跨欄位驗證、在伺服器上驗證，或將變更保持在待處理狀態，直到使用者以群組方式確認或取消並還原所有變更。

當使用者離開時，你可以讓使用者決定如何處理未儲存的變更。如果使用者取消，你會停留在原地並允許更多變更。如果使用者核准，應用程式就可以儲存。

你仍然可能延遲導覽，直到儲存成功為止。如果你讓使用者立即移至下一個畫面，而儲存卻失敗了（也許資料被判定為無效），你就會失去錯誤的脈絡。

你需要在等待伺服器回傳答案時，以非同步方式停止導覽。

`canDeactivate` 守衛可以協助你決定如何處理未儲存的變更，以及如何繼續進行。

<a id="cancel-save"></a>

#### 取消與儲存

使用者在 `CrisisDetailComponent` 中更新危機資訊。與 `HeroDetailComponent` 不同，使用者的變更不會立即更新危機實體。相反地，應用程式會在使用者按下「儲存」按鈕時更新實體，並在使用者按下「取消」按鈕時捨棄變更。

兩個按鈕在儲存或取消後都會導覽回危機清單。

<code-example header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (cancel and save methods)" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" region="cancel-save"></code-example>

在這種情境中，使用者可能會點選英雄連結、取消、按下瀏覽器的上一頁按鈕，或在未儲存的情況下離開。

這個範例應用程式會要求使用者透過確認對話方塊明確表示，該對話方塊會以非同步方式等待使用者的回應。

<div class="alert is-helpful">

你可以用同步的阻斷式程式碼等待使用者的答案，不過，應用程式以非同步方式等待使用者的答案時，回應速度會更快——而且可以同時處理其他工作。

</div>

產生一個 `Dialog` 服務來處理使用者確認。

<code-example format="shell" language="shell">

ng generate service dialog

</code-example>

在 `DialogService` 中加入一個 `confirm()` 方法，提示使用者確認其意圖。`window.confirm` 是一個阻斷式動作，會顯示一個強制回應對話方塊並等待使用者互動。

<code-example header="src/app/dialog.service.ts" path="router/src/app/dialog.service.ts"></code-example>

它會回傳一個 `Observable`，在使用者最終決定要做什麼時解析：捨棄變更並離開（`true`），或保留待處理的變更並停留在危機編輯器中（`false`）。

<a id="canDeactivate"></a>

建立一個守衛，檢查元件中是否存在 `canDeactivate()` 方法——任何元件都可以。

<code-example format="shell" language="shell">

ng generate guard can-deactivate

</code-example>

將以下程式碼貼入你的守衛。

<code-example header="src/app/can-deactivate.guard.ts" path="router/src/app/can-deactivate.guard.ts"></code-example>

雖然守衛不必知道哪個元件有 `deactivate` 方法，但它可以偵測到 `CrisisDetailComponent` 元件有 `canDeactivate()` 方法並加以呼叫。守衛不知道任何元件停用方法的細節，讓守衛可以重複使用。

或者，你可以為 `CrisisDetailComponent` 建立一個元件專屬的 `canDeactivate` 守衛。`canDeactivate()` 方法會提供你目前 `component` 的執行個體、目前的 `ActivatedRoute` 與 `RouterStateSnapshot`，以防你需要存取某些外部資訊。如果你只想把這個守衛用於這個元件，而且需要取得元件的屬性或確認路由器是否應該允許離開該元件，這會很有用。

<code-example header="src/app/can-deactivate.guard.ts (component-specific)" path="router/src/app/can-deactivate.guard.1.ts"></code-example>

回顧 `CrisisDetailComponent`，它實作了未儲存變更的確認工作流程。

<code-example header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (excerpt)" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" region="canDeactivate"></code-example>

請注意，`canDeactivate()` 方法可以同步回傳；如果沒有危機或沒有待處理的變更，它會立即回傳 `true`。但它也可以回傳 `Promise` 或 `Observable`，路由器會等待它解析為真值（導覽）或假值（停留在目前路由）。

使用 `canDeactivate` 陣列屬性，在 `crisis-center-routing.module.ts` 中把 `Guard` 加入危機詳細資料路由。

<code-example header="src/app/crisis-center/crisis-center-routing.module.ts (can deactivate guard)" path="router/src/app/crisis-center/crisis-center-routing.module.3.ts"></code-example>

現在你已經為使用者提供了防範未儲存變更的保護措施。

<a id="Resolve"></a>
<a id="resolve-guard"></a>

### *Resolve*：預先擷取元件資料

在 `Hero Detail` 與 `Crisis Detail` 中，應用程式會等到路由啟用後才擷取各自的英雄或危機。

如果你使用的是真實世界的 API，伺服器回傳要顯示的資料之前可能會有延遲。你不會想在等待資料時顯示空白元件。

為了改善這種行為，你可以使用解析器在伺服器預先擷取資料，讓資料在路由啟用那一刻就準備就緒。這也讓你可以在路由到元件之前處理錯誤。導覽至一個沒有記錄的 `id` 的危機詳細資料是沒有意義的。最好把使用者送回只顯示有效危機中心的 `Crisis List`。

總結來說，你希望延遲渲染已路由的元件，直到所有必要的資料都已擷取完成。

<a id="fetch-before-navigating"></a>

#### 在導覽之前擷取資料

目前，`CrisisDetailComponent` 會擷取選取的危機。如果找不到危機，路由器會導覽回危機清單檢視。

如果所有這些都在路由啟用之前先處理，體驗可能會更好。`crisisDetailResolver` 可以在啟用路由並建立 `CrisisDetailComponent` *之前*，擷取 `Crisis` 或在 `Crisis` 不存在時離開。

在 `Crisis Center` 功能區內建立一個 `crisis-detail-resolver.ts` 檔案。這個檔案將包含 `crisisDetailResolver` 函式。

<code-example format="shell" language="shell">

ng generate resolver crisis-center/crisis-detail-resolver

</code-example>

<code-example header="src/app/crisis-center/crisis-detail-resolver.ts" path="router/src/app/crisis-center/crisis-detail-resolver.1.ts"></code-example>

把 `CrisisDetailComponent.ngOnInit()` 中危機擷取邏輯的相關部分移入 `crisisDetailResolver`。匯入 `Crisis` 模型、`CrisisService` 與 `Router`，這樣如果你無法擷取危機，就可以導覽至別處。

明確一點，使用型別為 `Crisis` 的 `ResolveFn` 型別。

注入 `CrisisService` 與 `Router`。該方法可以回傳 `Promise`、 `Observable` 或同步回傳值。

`CrisisService.getCrisis()` 方法會回傳一個 Observable，以防止路由在資料擷取完成之前載入。

如果它沒有回傳有效的 `Crisis`，就回傳一個空的 `Observable`、取消先前進行中前往 `CrisisDetailComponent` 的導覽，並把使用者導覽回 `CrisisListComponent`。更新後的解析器函式如下：

<code-example header="src/app/crisis-center/crisis-detail-resolver.ts" path="router/src/app/crisis-center/crisis-detail-resolver.ts"></code-example>

在 `crisis-center-routing.module.ts` 中匯入這個解析器，並在 `CrisisDetailComponent` 路由設定中加入一個 `resolve` 物件。

<code-example header="src/app/crisis-center/crisis-center-routing.module.ts (resolver)" path="router/src/app/crisis-center/crisis-center-routing.module.4.ts"></code-example>

`CrisisDetailComponent` 應該不再擷取危機。當你重新設定路由時，你改變了危機所在的位置。請更新 `CrisisDetailComponent`，改為從 `ActivatedRoute.data.crisis` 屬性取得危機；

<code-example header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (ngOnInit v2)" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" region="ngOnInit"></code-example>

請檢視以下三個重點：

1.  路由器的 `ResolveFn` 是選用的。
1.  無論使用者在何種情況下可能離開，路由器都會呼叫解析器，因此你不必針對每個使用案例撰寫程式碼。
1.  在至少一個解析器中回傳空的 `Observable` 會取消導覽。

這個里程碑的相關危機中心程式碼如下。

<code-tabs>
    <code-pane header="app.component.html" path="router/src/app/app.component.html"></code-pane>
    <code-pane header="crisis-center-home.component.html" path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html"></code-pane>
    <code-pane header="crisis-center.component.html" path="router/src/app/crisis-center/crisis-center/crisis-center.component.html"></code-pane>
    <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.4.ts"></code-pane>
    <code-pane header="crisis-list.component.html" path="router/src/app/crisis-center/crisis-list/crisis-list.component.html"></code-pane>
    <code-pane header="crisis-list.component.ts" path="router/src/app/crisis-center/crisis-list/crisis-list.component.ts"></code-pane>
    <code-pane header="crisis-detail.component.html" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.html"></code-pane>
    <code-pane header="crisis-detail.component.ts" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts"></code-pane>
    <code-pane header="crisis-detail-resolver.ts" path="router/src/app/crisis-center/crisis-detail-resolver.ts"></code-pane>
    <code-pane header="crisis.service.ts" path="router/src/app/crisis-center/crisis.service.ts"></code-pane>
    <code-pane header="dialog.service.ts" path="router/src/app/dialog.service.ts"></code-pane>
</code-tabs>

守衛

<code-tabs>
    <code-pane header="auth.guard.ts" path="router/src/app/auth/auth.guard.3.ts"></code-pane>
    <code-pane header="can-deactivate.guard.ts" path="router/src/app/can-deactivate.guard.ts"></code-pane>
</code-tabs>

<a id="query-parameters"></a>
<a id="fragment"></a>

### 查詢參數與 fragment

在[路由參數](#optional-route-parameters)一節中，你只處理了特定於路由的參數。不過，你可以使用查詢參數來取得所有路由都可用的選用參數。

[Fragment](https://en.wikipedia.org/wiki/Fragment_identifier) 指的是頁面上以 `id` 屬性識別的特定元素。

更新 `authGuard` 以提供一個在導覽至另一個路由後仍保留的 `session_id` 查詢。

加入一個 `anchor` 元素，讓你可以跳到頁面上的某個特定位置。

在導覽至 `/login` 路由的 `router.navigate()` 方法中加入 `NavigationExtras` 物件。

<code-example header="src/app/auth/auth.guard.ts (v3)" path="router/src/app/auth/auth.guard.4.ts"></code-example>

你也可以在導覽時保留查詢參數與 fragment，不必在導覽時重新提供。在 `LoginComponent` 中，你會在 `router.navigate()` 函式的第二個引數中加入一個*物件*，並提供 `queryParamsHandling` 與 `preserveFragment`，把目前的查詢參數與 fragment 傳遞到下一個路由。

<code-example header="src/app/auth/login/login.component.ts (preserve)" path="router/src/app/auth/login/login.component.ts" region="preserve"></code-example>

<div class="alert is-helpful">

`queryParamsHandling` 功能也提供一個 `merge` 選項，它會在導覽時保留並合併目前的查詢參數與提供的查詢參數。

</div>

若要在登入後導覽至管理儀表板路由，請更新 `admin-dashboard.component.ts` 以處理查詢參數與 fragment。

<code-example header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (v2)" path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.ts"></code-example>

查詢參數與 fragment 也可以透過 `ActivatedRoute` 服務取得。和路由參數一樣，查詢參數與 fragment 是以 `Observable` 的形式提供。更新後的危機管理元件會使用 `AsyncPipe` 將 `Observable` 直接傳入範本。

現在，你可以點選「管理」按鈕，它會帶你到附有提供的 `queryParamMap` 與 `fragment` 的登入頁面。點選登入按鈕後，請注意你已被重新導向至 `Admin Dashboard` 頁面，查詢參數與 fragment 在網址列中仍然完整保留。

你可以使用這些跨頁面提供的持久資訊位元，來處理需要在各頁面間提供的事物，例如驗證權杖或工作階段 ID。

<div class="alert is-helpful">

`query params` 與 `fragment` 也可以分別使用帶有 `queryParamsHandling` 與 `preserveFragment` 繫結的 `RouterLink` 來保留。

</div>

<a id="asynchronous-routing"></a>

## 里程碑 6：非同步路由

在完成這些里程碑的過程中，應用程式自然變得越來越大。在某個時候，應用程式載入會花很長的時間。

為了解決這個問題，請使用非同步路由，它會在需要時延遲載入功能模組。延遲載入有多項好處。

*   你可以只在使用者要求時載入功能區
*   你可以為只造訪應用程式特定區域的使用者加快載入時間
*   你可以持續擴充延遲載入的功能區，而不會增加初始載入套件的大小

你已經完成了一部分。透過將應用程式組織成模組——`AppModule`、`HeroesModule`、`AdminModule` 與 `CrisisCenterModule`——你就有了延遲載入的天然候選者。

有些模組，例如 `AppModule`，必須從一開始就載入。但其他模組可以而且應該延遲載入。例如 `AdminModule` 只有少數授權使用者需要，因此你應該只在合適的人要求時才載入它。

<a id="lazy-loading-route-config"></a>

### 延遲載入路由設定

把 `admin-routing.module.ts` 中的 `admin` 路徑從 `'admin'` 改為空字串 `''`，也就是空路徑。

使用空路徑路由將路由分組在一起，而不會在 URL 中加入任何額外的路徑區段。使用者仍會造訪 `/admin`，而 `AdminComponent` 仍作為包含子路由的路由元件。

開啟 `AppRoutingModule`，並在其 `appRoutes` 陣列中加入一個新的 `admin` 路由。

給它一個 `loadChildren` 屬性，而不是 `children` 屬性。`loadChildren` 屬性接受一個函式，該函式會使用瀏覽器內建的延遲載入程式碼語法（動態匯入 `import('...')`）回傳一個 Promise。路徑是 `AdminModule` 的位置（相對於應用程式根目錄）。在程式碼被要求並載入後，`Promise` 會解析為一個包含 `NgModule` 的物件，在這個例子中就是 `AdminModule`。

<code-example header="app-routing.module.ts (load children)" path="router/src/app/app-routing.module.5.ts" region="admin-1"></code-example>

<div class="alert is-important">

**注意**：<br />
使用絕對路徑時，`NgModule` 檔案位置必須以 `src/app` 開頭才能正確解析。
若要使用絕對路徑進行自訂[路徑對應](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)，你必須在專案的 `tsconfig.json` 中設定 `baseUrl` 與 `paths` 屬性。

</div>

當路由器導覽至這個路由時，它會使用 `loadChildren` 字串動態載入 `AdminModule`。接著它會把 `AdminModule` 的路由加入目前的路由設定。最後，它會載入要求的目的地管理元件的路由。

延遲載入與重新設定只會發生一次，也就是在第一次要求該路由時；模組與路由在後續要求時會立即提供。

最後一步，把管理功能集從主應用程式中分離。根 `AppModule` 既不應載入也不應參照 `AdminModule` 或其檔案。

在 `app.module.ts` 中，從檔案頂部移除 `AdminModule` 的匯入陳述式，並從 NgModule 的 `imports` 陣列中移除 `AdminModule`。

<a id="can-match-guard"></a>

### `canMatch`：守衛功能模組的未授權存取

你已經使用 `canActivate` 守衛來保護 `AdminModule`，防止未經授權的使用者存取管理功能區。如果使用者未獲授權，它會重新導向至登入頁面。

但是，即使使用者無法造訪其任何元件，路由器仍在載入 `AdminModule`。理想情況下，只有在使用者登入時才載入 `AdminModule`。

`canMatch` 守衛控制 `Router` 是否嘗試比對某個 `Route`。這讓你可以擁有多個共用相同 `path` 但根據不同條件進行比對的 `Route` 設定。這種方法讓 `Router` 可以改為比對萬用字元 `Route`。

現有的 `authGuard` 包含支援 `canMatch` 守衛的邏輯。

最後，把 `authGuard` 加入 `admin` 路由的 `canMatch` 陣列屬性。完成後的管理路由如下：

<code-example header="app-routing.module.ts (lazy admin route)" path="router/src/app/app-routing.module.5.ts" region="admin"></code-example>

<a id="preloading"></a>

### 預先載入：在背景載入功能區

除了依需求載入模組之外，你也可以使用預先載入以非同步方式載入模組。

`AppModule` 在應用程式啟動時會積極載入，也就是說它會立即載入。現在 `AdminModule` 只會在使用者點選連結時載入，這稱為延遲載入。

預先載入讓你可以在背景載入模組，以便使用者啟用特定路由時，資料已準備好可以渲染。以危機中心為例。它不是使用者看到的第一個檢視。預設情況下，英雄是第一個檢視。為了最小的初始承載量與最快的啟動時間，你應該積極載入 `AppModule` 與 `HeroesModule`。

你可以延遲載入危機中心。但你幾乎可以確定，使用者在啟動應用程式幾分鐘內就會造訪危機中心。理想情況下，應用程式啟動時只載入 `AppModule` 與 `HeroesModule`，然後幾乎立即在背景載入 `CrisisCenterModule`。等使用者導覽至危機中心時，它的模組已經載入完成並準備就緒。

<a id="how-preloading"></a>

#### 預先載入的運作方式

每次成功導覽後，路由器會在設定中尋找可以預先載入的未載入模組。是否預先載入模組，以及預先載入哪些模組，取決於預先載入策略。

`Router` 提供兩種預先載入策略：

| 策略 | 詳細說明 |
|:---           |:---     |
| 不預先載入 | 預設值。延遲載入的功能區仍會依需求載入。 |
| 預先載入 | 所有延遲載入的功能區都會預先載入。 |

路由器要麼從不預先載入，要麼預先載入每一個延遲載入的模組。`Router` 也支援[自訂預先載入策略](#custom-preloading)，可以精細控制要預先載入哪些模組以及何時預先載入。

本節會引導你更新 `CrisisCenterModule`，讓它預設延遲載入，並使用 `PreloadAllModules` 策略載入所有延遲載入的模組。

<a id="lazy-load-crisis-center"></a>

#### 延遲載入危機中心

更新路由設定以延遲載入 `CrisisCenterModule`。採取你用來設定 `AdminModule` 延遲載入的相同步驟。

1.  把 `CrisisCenterRoutingModule` 中的 `crisis-center` 路徑改為空字串。
1.  在 `AppRoutingModule` 中加入一個 `crisis-center` 路由。
1.  把 `loadChildren` 字串設為載入 `CrisisCenterModule`。
1.  從 `app.module.ts` 中移除所有提及 `CrisisCenterModule` 的內容。

以下是更新後的模組（*啟用預先載入之前*）：

<code-tabs>
    <code-pane header="app.module.ts" path="router/src/app/app.module.ts" region="preload"></code-pane>
    <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.6.ts" region="preload-v1"></code-pane>
    <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.ts"></code-pane>
</code-tabs>

你現在可以試試看，確認點選「危機中心」按鈕後 `CrisisCenterModule` 會載入。

若要啟用所有延遲載入模組的預先載入，請從 Angular 路由套件匯入 `PreloadAllModules` 權杖。

`RouterModule.forRoot()` 方法的第二個引數接受一個物件，用於額外的設定選項。`preloadingStrategy` 就是其中一個選項。把 `PreloadAllModules` 權杖加入 `forRoot()` 呼叫：

<code-example header="src/app/app-routing.module.ts (preload all)" path="router/src/app/app-routing.module.6.ts" region="forRoot"></code-example>

這會將 `Router` 預先載入器設定為立即載入所有延遲載入的路由（帶有 `loadChildren` 屬性的路由）。

當你造訪 `http://localhost:4200` 時，`/heroes` 路由會在啟動時立即載入，路由器會在 `HeroesModule` 載入後立即開始載入 `CrisisCenterModule`。

<a id="custom-preloading"></a>

### 自訂預先載入策略

在許多情況下，預先載入每一個延遲載入的模組效果都很好。然而，考量到低頻寬與使用者指標等因素，你可以針對特定功能模組使用自訂預先載入策略。

本節會引導你加入一個自訂策略，該策略只預先載入 `data.preload` 旗標設為 `true` 的路由。請記住，你可以在路由的 `data` 屬性中加入任何內容。

在 `AppRoutingModule` 的 `crisis-center` 路由中設定 `data.preload` 旗標。

<code-example header="src/app/app-routing.module.ts (route data preload)" path="router/src/app/app-routing.module.ts" region="preload-v2"></code-example>

產生一個新的 `SelectivePreloadingStrategy` 服務。

<code-example format="shell" language="shell">

ng generate service selective-preloading-strategy

</code-example>

把 `selective-preloading-strategy.service.ts` 的內容替換為以下內容：

<code-example header="src/app/selective-preloading-strategy.service.ts" path="router/src/app/selective-preloading-strategy.service.ts"></code-example>

`SelectivePreloadingStrategyService` 實作了 `PreloadingStrategy`，它有一個方法 `preload()`。

路由器會使用兩個引數呼叫 `preload()` 方法：

1.  要考慮的路由。
1.  一個可以非同步載入已路由模組的載入器函式。

`preload` 的實作必須回傳一個 `Observable`。如果路由確實預先載入，它會回傳呼叫載入器函式所回傳的 Observable。如果路由不預先載入，它會回傳一個 `null` 的 `Observable`。

在這個範例中，如果路由的 `data.preload` 旗標為真值，`preload()` 方法會載入該路由。如果有 `canMatch` 守衛，我們也會跳過載入該 `Route`，因為使用者可能沒有存取權限。

附帶效果是，`SelectivePreloadingStrategyService` 會把選取路由的 `path` 記錄在其公開的 `preloadedModules` 陣列中。

稍後，你會擴充 `AdminDashboardComponent`，注入這個服務並顯示其 `preloadedModules` 陣列。

但首先，請對 `AppRoutingModule` 做一些變更。

1.  把 `SelectivePreloadingStrategyService` 匯入 `AppRoutingModule`。
1.  在 `forRoot()` 的呼叫中，把 `PreloadAllModules` 策略替換為這個 `SelectivePreloadingStrategyService`。

現在編輯 `AdminDashboardComponent` 以顯示預先載入路由的記錄。

1.  匯入 `SelectivePreloadingStrategyService`。
1.  把它注入儀表板的建構子。
1.  更新範本以顯示策略服務的 `preloadedModules` 陣列。

現在檔案如下：

<code-example header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (preloaded modules)" path="router/src/app/admin/admin-dashboard/admin-dashboard.component.ts"></code-example>

一旦應用程式載入初始路由，`CrisisCenterModule` 就會被預先載入。登入 `Admin` 功能區並注意 `crisis-center` 列在 `Preloaded Modules` 中，以驗證這一點。它也會記錄到瀏覽器的主控台。

<a id="redirect-advanced"></a>

### 使用重新導向遷移 URL

你已經設定了在應用程式中導覽的路由，並以命令式與宣告式方式使用導覽。但和任何應用程式一樣，需求會隨時間改變。你已經設定了從 `HeroListComponent` 與 `HeroDetailComponent` 元件到 `/heroes` 與 `/hero/:id` 的連結與導覽。如果有需求要把指向 `heroes` 的連結改為 `superheroes`，你仍會希望先前的 URL 能正確導覽。你也不想更新應用程式中的每一個連結，因此重新導向讓路由重構變得輕而易舉。

<a id="url-refactor"></a>

#### 把 `/heroes` 改為 `/superheroes`

本節會引導你把 `Hero` 路由遷移至新的 URL。`Router` 會在導覽之前檢查設定中的重新導向，因此每個重新導向會在需要時觸發。為了支援這項變更，請在 `heroes-routing.module` 中加入從舊路由到新路由的重新導向。

<code-example header="src/app/heroes/heroes-routing.module.ts (heroes redirects)" path="router/src/app/heroes/heroes-routing.module.ts"></code-example>

請注意兩種不同類型的重新導向。第一個變更是不帶任何參數的從 `/heroes` 到 `/superheroes`。第二個變更是從 `/hero/:id` 到 `/superhero/:id`，其中包含 `:id` 路由參數。路由器重新導向也使用強大的模式比對，因此 `Router` 會檢查 URL，並把 `path` 中的路由參數替換為適當的目的地。先前，你導覽至像 `/hero/15` 這樣的 URL，其路由參數 `id` 為 `15`。

<div class="alert is-helpful">

`Router` 在使用重新導向時也支援[查詢參數](#query-parameters)與 [fragment](#fragment)。

*   當使用絕對重新導向時，`Router` 會使用路由設定中 `redirectTo` 的查詢參數與 fragment
*   當使用相對重新導向時，`Router` 會使用來源 URL 的查詢參數與 fragment

</div>

目前，空路徑路由會重新導向至 `/heroes`，而該路由又會重新導向至 `/superheroes`。這樣行不通，因為 `Router` 在路由設定的每個層級只處理一次重新導向。這可以防止重新導向鏈結，否則可能導致無止境的重新導向迴圈。

請改為更新 `app-routing.module.ts` 中的空路徑路由，改為重新導向至 `/superheroes`。

<code-example header="src/app/app-routing.module.ts (superheroes redirect)" path="router/src/app/app-routing.module.ts"></code-example>

`routerLink` 與路由設定沒有關聯，因此請更新相關的路由器連結，讓新路由啟用時仍保持作用中。更新 `app.component.ts` 範本中 `/heroes` 的 `routerLink`。

<code-example header="src/app/app.component.html (superheroes active routerLink)" path="router/src/app/app.component.html"></code-example>

更新 `hero-detail.component.ts` 中的 `goToHeroes()` 方法，改為使用選用路由參數導覽回 `/superheroes`。

<code-example header="src/app/heroes/hero-detail/hero-detail.component.ts (goToHeroes)" path="router/src/app/heroes/hero-detail/hero-detail.component.ts" region="redirect"></code-example>

設定好重新導向後，所有先前的路由現在都會指向新的目的地，兩個 URL 仍能如預期運作。

<a id="inspect-config"></a>

### 檢查路由器的設定

若要判斷你的路由是否確實[以正確的順序評估](#routing-module-order)，你可以檢查路由器的設定。

透過注入路由器並把其 `config` 屬性記錄到主控台來執行此操作。例如，依下列方式更新 `AppModule`，並查看瀏覽器主控台視窗以看到完成的路由設定。

<code-example header="src/app/app.module.ts (inspect the router config)" path="router/src/app/app.module.7.ts" region="inspect-config"></code-example>

<a id="final-app"></a>

## 最終應用程式

關於已完成的路由器應用程式，請參閱 <live-example name="router"></live-example> 以取得最終原始碼。

<a id="link-parameters-array"></a>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
