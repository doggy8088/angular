# 路由與導覽

The Angular **`Router`** 讓使用者在執行應用程式工作時，能從一個[檢視](guide/glossary#view)導覽到下一個檢視。

本指南涵蓋路由器的主要功能，並透過一個小應用程式的演進過程來加以說明，你可以<live-example>在瀏覽器中即時執行</live-example>這個應用程式。

<!-- style for all tables on this page -->
<style>
  td, th {vertical-align: top}
</style>

## 總覽

瀏覽器是大家熟悉的應用程式導覽模型：

* 在網址列輸入 URL，瀏覽器便導覽到對應的頁面。
* 點擊頁面上的連結，瀏覽器便導覽到新頁面。
* 點擊瀏覽器的上一頁與下一頁按鈕，瀏覽器便在你看過的頁面歷史中前後導覽。

Angular `Router`（「路由器」）借用了這個模型。
它可以把瀏覽器 URL 解讀為導覽到用戶端產生之檢視的指示。
它可以沿途傳遞選用參數給支援該檢視的元件，協助元件決定要呈現哪些具體內容。
你可以把路由器繫結到頁面上的連結，當使用者點擊連結時，它便導覽到適當的應用程式檢視。
當使用者點擊按鈕、從下拉框選取，或回應來自任何來源的其他刺激時，你也可以命令式地導覽。而且路由器會把活動記錄在瀏覽器的歷史日誌中，所以上一頁與下一頁按鈕也能如常運作。

{@a basics}

## 基礎

本指南按階段進行，以里程碑標示，從簡單的兩頁應用程式開始，
逐步建置成具有子路由的模組化、多檢視設計。

先介紹幾個核心的路由器概念，有助於你掌握後續的細節。

{@a basics-base-href}

### *&lt;base href>*

大多數路由應用程式都應該在 `index.html` 的 `<head>` 標籤中，把 `<base>` 元素加為第一個子元素，
以告訴路由器如何組裝導覽 URL。

如果 `app` 資料夾是應用程式根目錄（如本範例應用程式），
請*完全*依照這裡所示設定 `href` 值。

<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>

{@a basics-router-imports}

### 路由器匯入

Angular 路由器是一個選用服務，它為給定的 URL 呈現特定的元件檢視。
它不是 Angular 核心的一部分，而是位於自己的程式庫套件 `@angular/router` 中。
你可以像從任何其他 Angular 套件一樣，從中匯入你需要的東西。

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (import)" region="import-router"></code-example>

<div class="alert is-helpful">

你將在[下方的細節](#browser-url-styles)中了解更多選項。

</div>

{@a basics-config}

<a id="configuration"></a>
### 設定

被路由的 Angular 應用程式有一個單例的 *`Router`* 服務實例。
當瀏覽器的 URL 變更時，該路由器會尋找對應的 `Route`，
並據此決定要顯示的元件。

路由器在你設定它之前沒有任何路由。
下面的範例建立五個路由定義，透過 `RouterModule.forRoot()` 方法設定路由器，
並把結果加入 `AppModule` 的 `imports` 陣列。

<code-example path="router/src/app/app.module.0.ts" header="src/app/app.module.ts (excerpt)"></code-example>

{@a example-config}

`appRoutes` 路由陣列描述了如何導覽。
把它傳給模組 `imports` 中的 `RouterModule.forRoot()` 方法來設定路由器。

每個 `Route` 都把一個 URL `path` 對應到一個元件。
_path_ 中*沒有前導斜線*。
路由器會為你解析並組建最終的 URL，
讓你在應用程式檢視之間導覽時，可以同時使用相對路徑與絕對路徑。

第二個路由中的 `:id` 是路由參數的權杖。在像 `/hero/42` 這樣的 URL 中，「42」
就是 `id` 參數的值。對應的 `HeroDetailComponent`
會使用該值來尋找並呈現 `id` 為 42 的英雄。
你將在本指南後段進一步了解路由參數。

第三個路由中的 `data` 屬性是用來存放與
這個特定路由相關聯的任意資料的地方。data 屬性可以在每個被啟用的路由中存取。用它來存放
諸如頁面標題、麵包屑文字以及其他唯讀的*靜態*資料之類的項目。
稍後在本指南中，你將使用[解析守衛](#resolve-guard)來擷取*動態*資料。

第四個路由中的**空路徑**代表應用程式的預設路徑，
也就是當 URL 中的路徑為空時要前往的地方，如同應用程式啟動時通常的情形。
這個預設路由重新導向到 `/heroes` URL 的路由，因此會顯示 `HeroesListComponent`。

最後一個路由中的 `**` 路徑是**萬用字元**。如果請求的 URL 與設定中先前定義的任何路由路徑都不相符，
路由器就會選取這個路由。
這對於顯示「404 - Not Found」頁面或重新導向到另一個路由很有用。

**設定中路由的順序很重要**，這是刻意設計的。路由器在比對路由時使用**第一個相符者勝出**
策略，所以較具體的路由應該放在較不具體的路由上方。
在上面的設定中，靜態路徑的路由列在最前面，其次是空路徑路由，
它符合預設路由。
萬用字元路由放在最後，因為它符合*每一個 URL*，而且應該*只有*在沒有其他路由先相符時才被選取。

如果你需要查看導覽生命週期中正在發生的事件，路由器的預設設定中有一個 **enableTracing** 選項。它會把每次導覽生命週期中發生的每個路由器事件輸出到瀏覽器主控台。這應該只用於*偵錯*目的。你要在傳給 `RouterModule.forRoot()` 方法的第二個引數物件中，設定 `enableTracing: true` 選項。

{@a basics-router-outlet}

### 路由器出口

`RouterOutlet` 是路由器函式庫中的一個指令，用起來就像元件。
它充當一個佔位符，標示範本中路由器應該顯示該出口之元件的位置。

<code-example language="html">
  &lt;router-outlet>&lt;/router-outlet>
  &lt;!-- Routed components go here -->

</code-example>

以上面的設定而言，當這個應用程式的瀏覽器 URL 變成 `/heroes` 時，
路由器把該 URL 與路由路徑 `/heroes` 進行比對，並把 `HeroListComponent` 顯示
為你放在宿主元件範本中的 `RouterOutlet` 的同層元素。

{@a basics-router-links}
{@a router-link}

### 路由器連結

現在你已設定好路由，也有了渲染它們的地方，但
你要如何導覽？URL 可能直接從瀏覽器網址列而來。
但大多數時候，你是因為使用者的某個動作（例如點擊
錨點標籤）而導覽。

請看下列範本：

<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

錨點標籤上的 `RouterLink` 指令讓路由器掌控這些元素。
導覽路徑是固定的，因此你可以把字串指定給 `routerLink`（一種「一次性」繫結）。

如果導覽路徑更具動態性，你可以繫結到一個範本運算式，
讓它傳回路由連結參數的陣列（即*連結參數陣列*）。
路由器會把該陣列解析成完整的 URL。

{@a router-link-active}

### 作用中路由器連結

`RouterLinkActive` 指令會根據目前的 `RouterState`，為作用中的 `RouterLink` 繫結切換 CSS 類別。

在每個錨點標籤上，你會看到一個指向 `RouterLinkActive` 指令的[屬性繫結](guide/template-syntax#property-binding)，形如 `routerLinkActive="..."`。

等號（=）右邊的範本運算式包含一個以空格分隔的 CSS 類別字串，
當這個連結處於作用中時，路由器會加上這些類別（連結非作用中時則移除）。你可以把 `RouterLinkActive`
指令設定為像 `[routerLinkActive]="'active fluffy'"` 這樣的類別字串，或把它繫結到一個
傳回此類字串的元件屬性。

作用中路由連結會沿著路由樹的每個層級向下串聯，所以父連結與子路由器連結可以同時處於作用中。若要覆寫此行為，你可以繫結到 `[routerLinkActiveOptions]` 輸入繫結，使用 `{ exact: true }` 運算式。透過使用 `{ exact: true }`，給定的 `RouterLink` 只有在其 URL 與目前 URL 完全相符時才會處於作用中。

{@a basics-router-state}

### 路由器狀態

在每次成功的導覽生命週期結束之後，路由器會建立一棵由 `ActivatedRoute` 物件組成的樹，
它們構成路由器的目前狀態。你可以使用 `Router` 服務與 `routerState` 屬性，
從應用程式中的任何地方存取目前的 `RouterState`。

`RouterState` 中的每個 `ActivatedRoute` 都提供方法來上上下下遍歷路由樹，
以從父路由、子路由與同層路由取得資訊。

{@a activated-route}

### 已啟用路由

路由路徑與參數可以透過一個注入的路由器服務取得，該服務稱為
[ActivatedRoute](api/router/ActivatedRoute)。
它有大量有用的資訊，包括：

<table>
  <tr>
    <th>
      屬性
    </th>

    <th>
      Description
    </th>
  </tr>

  <tr>
    <td>
      <code>url</code>
    </td>
    <td>

    一個 `Observable`，表示路由路徑，會以字串陣列呈現路由路徑的每個部分。

    </td>
  </tr>

  <tr>
    <td>
      <code>data</code>
    </td>
    <td>

    一個 `Observable`，包含為路由提供的 `data` 物件。也包含來自[解析守衛](#resolve-guard)的任何已解析值。

    </td>
  </tr>

  <tr>
    <td>
      <code>paramMap</code>
    </td>
    <td>

    一個 `Observable`，包含此路由專屬的必要參數與[選用參數](#optional-route-parameters)的[對應表](api/router/ParamMap)。這個對應表支援從同一個參數擷取單一與多個值。

    </td>
  </tr>

  <tr>
    <td>
      <code>queryParamMap</code>
    </td>
    <td>

    一個 `Observable`，包含所有路由皆可用的[查詢參數](#query-parameters)的[對應表](api/router/ParamMap)。
    這個對應表支援從查詢參數擷取單一與多個值。

    </td>
  </tr>

  <tr>
    <td>
      <code>fragment</code>
    </td>
    <td>

    一個 `Observable`，是所有路由皆可用的 URL [片段](#fragment)。

    </td>
  </tr>

  <tr>
    <td>
      <code>outlet</code>
    </td>
    <td>

    用來渲染路由的 `RouterOutlet` 名稱。對於未命名的出口，出口名稱是 _primary_。

    </td>
  </tr>

  <tr>
    <td>
      <code>routeConfig</code>
    </td>
    <td>

    用於該路由的路由設定，而該路由包含原始路徑。

    </td>
  </tr>

    <tr>
    <td>
      <code>parent</code>
    </td>
    <td>

    當此路由是[子路由](#子路由元件)時，此路由的父 `ActivatedRoute`。

    </td>
  </tr>

  <tr>
    <td>
      <code>firstChild</code>
    </td>
    <td>

    包含此路由的子路由清單中的第一個 `ActivatedRoute`。

    </td>
  </tr>

  <tr>
    <td>
      <code>children</code>
    </td>
    <td>

    包含在目前路由下啟用的所有[子路由](#子路由元件)。

    </td>
  </tr>
</table>

<div class="alert is-helpful">

兩個較舊的屬性仍然可用。它們不如其替代者強大，不建議使用，並可能在未來的 Angular 版本中棄用。

**`params`**&mdash;一個 `Observable`，包含此路由專屬的必要參數與[選用參數](#optional-route-parameters)。請改用 `paramMap`。

**`queryParams`**&mdash;一個 `Observable`，包含所有路由皆可用的[查詢參數](#query-parameters)。
請改用 `queryParamMap`。

</div>

### 路由器事件

在每次導覽期間，`Router` 會透過 `Router.events` 屬性發出導覽事件。這些事件的範圍從導覽開始與結束，到中間的許多時間點。導覽事件的完整清單顯示在下表中。

<table>
  <tr>
    <th>
      路由器事件
    </th>

    <th>
      Description
    </th>
  </tr>

    <td>
      <code>NavigationStart</code>
    </td>
    <td>

      一個在導覽開始時觸發的[事件](api/router/NavigationStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadStart</code>
    </td>
    <td>

      一個[event](api/router/RouteConfigLoadStart)，在 `Router`
      [延遲載入](#asynchronous-routing)路由設定之前觸發。

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadEnd</code>
    </td>
    <td>

      一個在路由完成延遲載入後觸發的[事件](api/router/RouteConfigLoadEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>RoutesRecognized</code>
    </td>
    <td>

      一個在路由器解析 URL 且路由被識別時觸發的[事件](api/router/RoutesRecognized)。

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckStart</code>
    </td>
    <td>

      一個在路由器開始進行路由的 Guards 階段時觸發的[事件](api/router/GuardsCheckStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationStart</code>
    </td>
    <td>

      一個在路由器開始啟用某路由的子路由時觸發的[事件](api/router/ChildActivationStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationStart</code>
    </td>
    <td>

      一個在路由器開始啟用某路由時觸發的[事件](api/router/ActivationStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckEnd</code>
    </td>
    <td>

      一個在路由器成功完成路由的 Guards 階段時觸發的[事件](api/router/GuardsCheckEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveStart</code>
    </td>
    <td>

      一個在路由器開始進行路由的 Resolve 階段時觸發的[事件](api/router/ResolveStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveEnd</code>
    </td>
    <td>

      一個在路由器成功完成路由的 Resolve 階段時觸發的[事件](api/router/ResolveEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationEnd</code>
    </td>
    <td>

      一個在路由器完成啟用某路由的子路由時觸發的[事件](api/router/ChildActivationEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationEnd</code>
    </td>
    <td>

      一個在路由器完成啟用某路由時觸發的[事件](api/router/ActivationStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationEnd</code>
    </td>
    <td>

      一個在導覽成功結束時觸發的[事件](api/router/NavigationEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationCancel</code>
    </td>
    <td>

      一個[event](api/router/NavigationCancel)，在導覽被取消時觸發。
      當[路由守衛](#guards)在導覽期間傳回 false，
      或透過傳回 `UrlTree` 重新導向時，就可能發生這種情況。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationError</code>
    </td>
    <td>

      一個在導覽因未預期錯誤而失敗時觸發的[事件](api/router/NavigationError)。

    </td>
  </tr>

  <tr>
    <td>
      <code>Scroll</code>
    </td>
    <td>

      一個代表捲動事件的[事件](api/router/Scroll)。

    </td>
  </tr>
</table>

啟用 `enableTracing` 選項時，這些事件也會記錄到主控台。如需篩選路由器導覽事件的範例，請造訪 [Observables in Angular](guide/observables-in-angular) 指南中的[路由器一節](guide/observables-in-angular#router)。

{@a basics-summary}

### 摘要

應用程式有一個設定好的路由器。
殼層元件有一個 `RouterOutlet`，可以在其中顯示路由器產生的檢視。
它有 `RouterLink`，使用者可以點擊它們，透過路由器導覽。

以下是關鍵的 `Router` 術語及其含義：

<table>

  <tr>

    <th>
      路由器組成部分
    </th>

    <th>
      含義
    </th>

  </tr>

  <tr>

    <td>
      <code>Router</code>
    </td>

    <td>
      顯示目前 URL 的應用程式元件。
      管理從一個元件到下一個元件的導覽。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterModule</code>
    </td>

    <td>
      一個獨立的 NgModule，提供在應用程式檢視之間導覽所需的服務提供者
      與指令。
    </td>

  </tr>

  <tr>

    <td>
      <code>Routes</code>
    </td>

    <td>
      定義一個 Routes 陣列，每個路由把一個 URL 路徑對應到一個元件。
    </td>

  </tr>

  <tr>

    <td>
      <code>Route</code>
    </td>

    <td>
      定義路由器應如何根據 URL 模式導覽到元件。
      大多數路由由一個路徑與一個元件類型組成。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterOutlet</code>
    </td>

    <td>
      標示路由器顯示檢視位置的指令（<code>&lt;router-outlet></code>）。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLink</code>
    </td>

    <td>
      用於把可點擊的 HTML 元素繫結到
      路由的指令。點擊帶有 <code>routerLink</code> 指令的元素，
      當該指令繫結到<i>字串</i>或<i>連結參數陣列</i>時，會觸發導覽。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLinkActive</code>
    </td>

    <td>
      當元素上或元素內的相關聯
      <code>routerLink</code> 變為作用中／非作用中時，用於為 HTML 元素加入／移除類別的指令。
    </td>

  </tr>

  <tr>

    <td>
      <code>ActivatedRoute</code>
    </td>

    <td>
      提供給每個路由元件的服務，包含路由專屬
      資訊，例如路由參數、靜態資料、解析資料、全域查詢參數與全域片段。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterState</code>
    </td>

    <td>
      路由器的目前狀態，包括一棵目前已啟用的
      路由樹，以及遍歷路由樹的便利方法。
    </td>

  </tr>

  <tr>

    <td>
      <b><i>連結參數陣列</i></b>
    </td>

    <td>
      路由器解讀為路由指示的陣列。
      你可以把該陣列繫結到 <code>RouterLink</code>，或把該陣列作為引數傳給
      <code>Router.navigate</code> 方法。
    </td>

  </tr>

  <tr>

    <td>
      <b><i>路由元件</i></b>
    </td>

    <td>
      一個帶有 <code>RouterOutlet</code> 的 Angular 元件，會根據路由器導覽顯示檢視。
    </td>

  </tr>

</table>

{@a sample-app-intro}

## 範例應用程式

本指南描述一個多頁面路由範例應用程式的開發過程。
沿途它會重點說明設計決策，並描述路由器的關鍵功能，例如：

* 把應用程式功能組織成模組。
* 導覽到元件（*Heroes* 連結前往「Heroes List」）。
* 包含路由參數（路由到「Hero Detail」時傳遞 Hero `id`）。
* 子路由（*Crisis Center* 有自己的路由）。
* `CanActivate` 守衛（檢查路由存取權限）。
* `CanActivateChild` 守衛（檢查子路由存取權限）。
* `CanDeactivate` 守衛（詢問是否允許捨棄未儲存的變更）。
* `Resolve` 守衛（預先擷取路由資料）。
* 延遲載入功能模組。
* `CanLoad` 守衛（在載入功能模組資產之前檢查）。

本指南以一系列里程碑進行，彷彿你正一步一步建置這個應用程式。
但它不是教學，會略過 Angular 應用程式建構的細節，
這些細節在文件中其他地方有更完整的介紹。

最終版應用程式的完整原始碼可以在 <live-example></live-example> 中查看與下載。

### 範例應用程式實際運作

想像一個應用程式，協助*英雄就業仲介*經營其業務。
英雄需要工作，而仲介為他們尋找要解決的危機。

應用程式有三個主要功能區域：

1. 一個 *Crisis Center*，用於維護要指派給英雄的危機清單。
1. 一個 *Heroes* 區域，用於維護仲介所僱用的英雄清單。
1. 一個 *Admin* 區域，用於管理危機與英雄清單。

點按這個 <live-example title="Hero Employment Agency Live Example">即時範例連結</live-example>來試試看。

應用程式熱身完成後，你會看到一排導覽按鈕
以及帶有英雄清單的 *Heroes* 檢視。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/hero-list.png' alt="英雄清單">
  </div>
</figure>

選取一位英雄，應用程式會帶你到英雄編輯畫面。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/hero-detail.png' alt="危機中心詳細資料">
  </div>
</figure>

變更姓名。
點按「Back」按鈕，應用程式會返回英雄清單，並顯示已變更的英雄姓名。
請注意，姓名變更會立即生效。

如果你點擊的是瀏覽器的上一頁按鈕，而不是「Back」按鈕，
應用程式同樣會把你帶回英雄清單。
Angular 應用程式導覽會像一般 Web 導覽一樣更新瀏覽器歷史。

現在點按 *Crisis Center* 連結，查看進行中的危機清單。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/crisis-center-list.png' alt="危機中心清單">
  </div>
</figure>

選取一個危機，應用程式會帶你到危機編輯畫面。
_Crisis Detail_ 會出現在同一頁面清單下方的子元件中。

變更危機的名稱。
請注意，危機清單中對應的名稱並*沒有*改變。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/crisis-center-detail.png' alt="危機中心詳細資料">
  </div>
</figure>

與 *Hero Detail* 在你輸入時就更新不同，
*Crisis Detail* 的變更只是暫時的，直到你按下「Save」或「Cancel」按鈕儲存或捨棄它們為止。
兩個按鈕都會導覽回 *Crisis Center* 及其危機清單。

***先不要點擊任何一個按鈕***。
改為點擊瀏覽器上一頁按鈕或「Heroes」連結。

跳出了一個對話框。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/confirm-dialog.png' alt="確認對話框">
  </div>
</figure>

你可以說「OK」並遺失你的變更，或點按「Cancel」並繼續編輯。

這個行為的背後是路由器的 `CanDeactivate` 守衛。
該守衛讓你在離開目前檢視之前，有機會清理或詢問使用者的許可。

`Admin` 與 `Login` 按鈕展示了本指南稍後會介紹的其他路由器功能。
這個簡短的介紹到此為止。

前往應用程式的第一個里程碑。

{@a getting-started}

## 里程碑 1：開始

從應用程式的簡單版本開始，它在兩個空檢視之間導覽。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/router-1-anim.gif' alt="運作中的應用程式">
  </div>
</figure>

{@a import}

產生一個範例應用程式，跟著本教學走一遍。

<code-example language="none" class="code-shell">
  ng new angular-router-sample
</code-example>

### 定義路由

路由器必須使用一組路由定義來設定。

每個定義都轉換為一個 [Route](api/router/Route) 物件，它有兩樣東西：一個
`path`，即此路由的 URL 路徑區段；以及一個
`component`，即與此路由相關聯的元件。

當瀏覽器 URL 變更時，路由器會利用它的定義註冊表，
或當應用程式程式碼告訴路由器沿著路由路徑導覽時也是如此。

換個更簡單的說法，對於第一個路由，你可以這樣描述：

* 當瀏覽器的位置 URL 變更為符合路徑區段 `/crisis-center` 時，
路由器便啟用 `CrisisListComponent` 的實例並顯示其檢視。

* 當應用程式請求導覽到路徑 `/crisis-center` 時，路由器
啟用 `CrisisListComponent` 的實例、顯示其檢視，並以該路徑的 URL 更新
瀏覽器的位址位置與歷史。

第一個設定定義了一個包含兩個路由的陣列，它們以簡單的路徑通向
`CrisisListComponent` 與 `HeroListComponent`。產生 `CrisisList` 與 `HeroList` 元件。

<code-example language="none" class="code-shell">
  ng generate component crisis-list
</code-example>

<code-example language="none" class="code-shell">
  ng generate component hero-list
</code-example>

將每個元件的內容替換為下面的範例 HTML。

<code-tabs>

  <code-pane header="src/app/crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="src/app/hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html" region="template">

  </code-pane>

</code-tabs>

### 註冊 Router 與 Routes

為了使用路由器，你必須先從 `@angular/router` 套件註冊 `RouterModule`。定義一個路由陣列 `appRoutes`，並把它們傳給 `RouterModule.forRoot()` 方法。它傳回一個模組，其中包含設定好的 `Router` 服務提供者，以及路由程式庫所需的其他提供者。應用程式啟動後，`Router` 會根據目前的瀏覽器 URL 執行初始導覽。

<div class="alert is-important">

  **注意：**`RouterModule.forRoot` 方法是一種用來註冊應用程式層級提供者的模式。如需了解更多應用程式層級提供者的資訊，請參閱 [Singleton services](guide/singleton-services#forRoot-router) 指南。

</div>

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (first-config)" region="first-config"></code-example>

<div class="alert is-helpful">

把設定好的 `RouterModule` 加入 `AppModule`，對於簡單的路由設定就足夠了。隨著應用程式成長，你會想把路由設定[重構成](#把路由設定重構成路由模組)獨立檔案，並建立一個**[路由模組](#routing-module)**，這是一種專門用於在功能模組中進行路由的特殊型別的 `Service Module`。

</div>

在 `AppModule` 的 imports 中註冊 `RouterModule.forRoot()`，會讓 `Router` 服務在應用程式的任何地方都可使用。

{@a shell}

### 加入路由器插座

根 `AppComponent` 是應用程式殼層。它有一個標題、一個帶有兩個連結的導覽列，以及一個路由器出口，路由器在其中把元件換上換下頁面。你會得到這樣的結果：

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/shell-and-outlet.png' alt="殼層">
  </div>
</figure>

路由器出口在被路由的元件將渲染於其下方時，充當佔位符。

{@a shell-template}

對應的元件範本如下所示：

<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

{@a wildcard}

### 定義萬用字元路由

到目前為止，你在應用程式中建立了兩個路由，一個通往 `/crisis-center`，另一個通往 `/heroes`。任何其他 URL 都會導致路由器擲出錯誤並使應用程式崩潰。

加入一個**萬用字元**路由，以攔截無效的 URL 並妥善處理。
_萬用字元_路由的路徑由兩個星號組成。它符合*每一個* URL。
如果路由器在設定中找不到更早的相符路由，就會選取*這個*路由。
萬用字元路由可以導覽到自訂的「404 Not Found」元件，或[重新導向](#redirect)到既有的路由。

<div class="alert is-helpful">

路由器以[_第一個相符者勝出_](#example-config)策略選取路由。
萬用字元路由是路由設定中最不具體的路由。
請確定它是設定中的*最後一個*路由。

</div>

若要測試這個功能，請在 `HeroListComponent` 範本中加入一個帶有 `RouterLink` 的按鈕，並把連結設為 `"/sidekicks"`。

<code-example path="router/src/app/hero-list/hero-list.component.1.html" header="src/app/hero-list/hero-list.component.html (excerpt)"></code-example>

如果使用者點擊該按鈕，應用程式將會失敗，因為你還沒有定義 `"/sidekicks"` 路由。

不要加入 `"/sidekicks"` 路由，改為定義一個 `wildcard` 路由，讓它導覽到一個簡單的 `PageNotFoundComponent`。

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (wildcard)" region="wildcard"></code-example>

建立 `PageNotFoundComponent`，在使用者造訪無效 URL 時顯示。

<code-example language="none" class="code-shell">
  ng generate component page-not-found
</code-example>

<code-example path="router/src/app/page-not-found/page-not-found.component.html" header="src/app/page-not-found.component.html (404 component)"></code-example>

現在，當使用者造訪 `/sidekicks` 或任何其他無效 URL 時，瀏覽器會顯示「Page not found」。
瀏覽器的網址列仍會指向該無效 URL。

{@a redirect}

### 設定重新導向

應用程式啟動時，瀏覽器列中的初始 URL 大約是這樣：

<code-example>
  localhost:4200
</code-example>

那不符合任何具體的已設定路由，這意味著
路由器會落到萬用字元路由，並顯示 `PageNotFoundComponent`。

應用程式需要一個通往有效頁面的**預設路由**。
這個應用程式的預設頁面是英雄清單。
應用程式應該導覽到那裡，就像使用者點擊了「Heroes」連結，或把 `localhost:4200/heroes` 貼到網址列一樣。

偏好的解決方案是加入一個 `redirect` 路由，把初始的相對 URL（`''`）
轉換成想要的預設路徑（`/heroes`）。瀏覽器網址列會顯示 `.../heroes`，就像你直接導覽到那裡一樣。

將預設路由加入萬用字元路由_上方_的某個位置。
在下列摘錄中，它就位於萬用字元路由的正上方，顯示了這個里程碑的完整 `appRoutes`。

<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts (appRoutes)" region="appRoutes"></code-example>

重新導向路由需要一個 `pathMatch` 屬性，告訴路由器如何把 URL 與路由的路徑進行比對。
如果你不這麼做，路由器會擲出錯誤。
在這個應用程式中，路由器應該只有在*整個 URL* 都符合 `''` 時，
才選取前往 `HeroListComponent` 的路由，
所以請把 `pathMatch` 值設為 `'full'`。

<div class="alert is-helpful">

從技術上講，當 URL 中*其餘*未相符的區段符合 `''` 時，`pathMatch = 'full'` 導致路由命中。
在這個範例中，重新導向位於頂層路由，所以*其餘* URL 與*整個* URL 是同一件事。

另一個可能的 `pathMatch` 值是 `'prefix'`，它告訴路由器
當*其餘* URL ***以***重新導向路由的 _prefix_ 路徑***開頭***時，比對該重新導向路由。

不要在這裡這麼做。
如果 `pathMatch` 值是 `'prefix'`，_每個_ URL 都會符合 `''`。

試著把它設為 `'prefix'`，然後點擊 `Go to sidekicks` 按鈕。
請記住，那是一個錯誤的 URL，你應該會看到「Page not found」頁面。
但你仍然停留在「Heroes」頁面。
在瀏覽器網址列輸入一個錯誤的 URL。
你會立即被重新路由到 `/heroes`。
_每個_ URL，無論好壞，只要落到*這個*路由定義，
都會相符。

預設路由應該*只有*在_整個_ url 是 `''` 時，才重新導向到 `HeroListComponent`。
記得把重新導向還原為 `pathMatch = 'full'`。

在 Victor Savkin 的
[關於重新導向的文章](http://vsavkin.tumblr.com/post/146722301646/angular-router-empty-paths-componentless-routes)中了解更多。

</div>

### 基礎回顧

你已經有一個非常基本的導覽應用程式，當使用者點擊連結時，
它可以在兩個檢視之間切換。

你已經學會如何做下列事情：

* 載入路由器程式庫。
* 在殼層範本中加入帶有錨點標籤、`routerLink` 與 `routerLinkActive` 指令的導覽列。
* 在殼層範本中加入 `router-outlet`，檢視將顯示在那裡。
* 以 `RouterModule.forRoot()` 設定路由器模組。
* 設定路由器組裝 HTML5 瀏覽器 URL。
* 以 `wildcard` 路由處理無效路由。
* 在應用程式以空路徑啟動時，導覽到預設路由。

起始應用程式的結構如下所示：

<div class='filetree'>

  <div class='file'>
    angular-router-sample
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
          crisis-list
        </div>

  <div class='children'>

          <div class='file'>

            crisis-list.component.css

</div>

          <div class='file'>

            crisis-list.component.html

</div>

          <div class='file'>

            crisis-list.component.ts

</div>

</div>

        <div class='file'>
          hero-list
        </div>

  <div class='children'>

          <div class='file'>

            hero-list.component.css

</div>

          <div class='file'>

            hero-list.component.html

</div>

          <div class='file'>

            hero-list.component.ts

</div>

</div>

        <div class='file'>
          page-not-found
        </div>

  <div class='children'>

          <div class='file'>

            page-not-found.component.css

</div>

          <div class='file'>

            page-not-found.component.html

</div>

          <div class='file'>

            page-not-found.component.ts

</div>

</div>

        <div class='file'>
          app.component.css
        </div>

        <div class='file'>
          app.component.html
        </div>

        <div class='file'>
          app.component.ts
        </div>

        <div class='file'>
          app.module.ts
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

以下是這個里程碑所討論的檔案。

<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.1.html">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.1.ts">

  </code-pane>

  <code-pane header="hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html">

  </code-pane>

  <code-pane header="crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="page-not-found/page-not-found.component.html" path="router/src/app/page-not-found/page-not-found.component.html">

  </code-pane>

  <code-pane header="index.html" path="router/src/index.html">

  </code-pane>

</code-tabs>

{@a routing-module}

## 里程碑 2：*路由模組*

在初始路由設定中，你提供了一個簡單的設定，使用兩個路由
來為應用程式設定路由。對於簡單的路由而言，這完全沒問題。
隨著應用程式成長，你使用更多 `Router` 功能，例如守衛、
解析器與子路由，你自然會想把路由設定重構到它自己的檔案中。
我們建議把路由資訊移到一個特殊用途的模組，稱為*路由模組*。

**路由模組**有幾個特點：

* 把路由關注點與其他應用程式關注點分離。
* 提供一個在測試應用程式時可以替換或移除的模組。
* 為路由服務提供者（包括守衛與解析器）提供一個眾所周知的位置。
* **不**宣告元件。

{@a integrate-routing}

### 將路由與應用程式整合

範例路由應用程式預設不包含路由。
當你使用 [Angular CLI](cli) 建立一個將使用路由的專案時，請為專案或應用程式，以及每個 NgModule 設定 `--routing` 選項。
當你建立或初始化新專案（使用 CLI [`ng new`](cli/new) 指令）或新應用程式（使用 [`ng generate app`](cli/generate) 指令）時，請指定 `--routing` 選項。這會告訴 CLI 包含 `@angular/router` npm 套件，並建立一個名為 `app-routing.module.ts` 的檔案。
然後你就可以在加入專案或應用程式的任何 NgModule 中使用路由。

例如，下列命令會產生一個可以使用路由的 NgModule。

```sh
ng generate module my-module --routing
```

這會建立一個名為 `my-module-routing.module.ts` 的獨立檔案，用來儲存 NgModule 的路由。
該檔案包含一個空的 `Routes` 物件，你可以用通往不同元件與 NgModule 的路由來填滿它。

{@a routing-refactor}

### 把路由設定重構成*路由模組*

在 `/app` 資料夾中建立一個 `AppRouting` 模組，以包含路由設定。

<code-example language="none" class="code-shell">
  ng generate module app-routing --module app --flat
</code-example>

就像你在 `app.module.ts` 中所做的那樣，匯入 `CrisisListComponent`、`HeroListComponent` 與 `PageNotFoundComponent` 符號。然後把 `Router` 匯入
與路由設定（包括 `RouterModule.forRoot()`）移到這個路由模組中。

把 Angular `RouterModule` 加入模組的 `exports` 陣列，重新匯出它。
透過在這裡重新匯出 `RouterModule`，在 `AppModule` 中宣告的元件將能存取諸如 `RouterLink` 與 `RouterOutlet` 等路由器指令。

完成這些步驟後，檔案應如下所示。

<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts"></code-example>

接著，更新 `app.module.ts` 檔案，從
`imports` 陣列中移除 `RouterModule.forRoot`。

<code-example path="router/src/app/app.module.2.ts" header="src/app/app.module.ts"></code-example>

<div class="alert is-helpful">

稍後在本指南中，你將建立[多個路由模組](#heroes-functionality)，並發現
你必須以[正確的順序](#routing-module-order)匯入那些路由模組。

</div>

應用程式繼續以相同的方式運作，你可以使用 `AppRoutingModule` 作為
維護未來路由設定的中心位置。

{@a why-routing-module}

### 你需要*路由模組*嗎？

_路由模組_會*取代*根模組或功能模組中的路由設定。
可以把路由設定在路由模組中，_或者_設定在模組本身之中，但不能兩邊都設定。

路由模組是一種設計選擇，當設定複雜
且包含專門的守衛與解析器服務時，它的價值最為明顯。
當實際設定非常簡單時，它可能顯得有點過頭。

有些開發者在設定簡單時會跳過路由模組（例如 `AppRoutingModule`），
並把路由設定直接合併到同伴模組（例如 `AppModule`）中。

選擇一種模式，然後始終如一地遵循該模式。

大多數開發者為了保持一致性，應該永遠實作路由模組。
當設定變得複雜時，它能保持程式碼整潔。
它讓測試功能模組更容易。
它的存在提醒人們該模組是被路由的。
它是開發者預期尋找與擴充路由設定的地方。

{@a heroes-feature}

## 里程碑 3：英雄功能

你已經看過如何使用 `RouterLink` 指令導覽。
現在你將學習下列內容：

* 使用模組把應用程式與路由組織成*功能區域*。
* 以命令式方式從一個元件導覽到另一個元件。
* 在路由參數中傳遞必要與選用資訊。

這個範例重現了[英雄之旅教學](tutorial/toh-pt4 "Tour of Heroes: Services")「Services」一集中的英雄功能，
你將會複製大部分的程式碼，
它們來自 <live-example name="toh-pt4" title="Tour of Heroes: Services example code"></live-example>。

使用者將這樣體驗這個版本的應用程式：

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/router-2-anim.gif' alt="運作中的應用程式">
  </div>
</figure>

典型的應用程式有多個*功能區域*，
每個區域專注於特定的業務目的。

雖然你可以繼續把檔案加入 `src/app/` 資料夾，
但那不切實際，最終也無法維護。
大多數開發者偏好把每個功能區域放在它自己的資料夾中。

你即將把應用程式拆成不同的*功能模組*，每個模組有其自身的關注點。
然後你將把它們匯入主模組，並在它們之間導覽。

{@a heroes-functionality}

### 加入英雄功能

請依下列步驟操作：

* 在 heroes 資料夾中建立一個帶有路由的 `HeroesModule`，並把它註冊到根 `AppModule`。你將在這裡實作*英雄管理*。

<code-example language="none" class="code-shell">
  ng generate module heroes/heroes --module app --flat --routing
</code-example>

* 把位於 `app` 中的佔位用 `hero-list` 資料夾移到 `heroes` 資料夾。
* 把 <live-example name="toh-pt4" title="Tour of Heroes: Services example code">「Services」教學</live-example> 中的 `heroes/heroes.component.html` 內容複製到 `hero-list.component.html` 範本中。

  * 把 `<h2>` 重新標記為 `<h2>HEROES</h2>`。
  * 刪除範本底部的 `<app-hero-detail>` 元件。

* 將即時範例中 `heroes/heroes.component.css` 的內容複製到 `hero-list.component.css` 檔案中。
* 將即時範例中 `heroes/heroes.component.ts` 的內容複製到 `hero-list.component.ts` 檔案中。

  * 將元件類別名稱變更為 `HeroListComponent`。
  * 將 `selector` 變更為 `app-hero-list`。

<div class="alert is-helpful">

   對於_被路由的元件_而言，選擇器**不是必要的**，因為元件是在頁面渲染時動態插入的，但它們對於在你的 HTML 元素樹中識別與定位這些元件很有用。

</div>

* 將 `hero-detail` 資料夾、`hero.ts`、`hero.service.ts` 與 `mock-heroes.ts` 檔案複製到 `heroes` 子資料夾中。
* 將 `message.service.ts` 複製到 `src/app` 資料夾中。
* 更新 `hero.service.ts` 檔案中 `message.service` 的相對路徑匯入。

接著，你將更新 `HeroesModule` 中繼資料。

  * 匯入 `HeroDetailComponent` 與 `HeroListComponent`，並將它們加入 `HeroesModule` 的 `declarations` 陣列中。

<code-example path="router/src/app/heroes/heroes.module.ts" header="src/app/heroes/heroes.module.ts"></code-example>

完成後，你將擁有這些*英雄管理*檔案：

<div class='filetree'>

  <div class='file'>
    src/app/heroes
  </div>

  <div class='children'>

    <div class='file'>
      hero-detail
    </div>

  <div class='children'>

        <div class='file'>
          hero-detail.component.css
        </div>

        <div class='file'>
          hero-detail.component.html
        </div>

        <div class='file'>
          hero-detail.component.ts
        </div>

</div>

    <div class='file'>
      hero-list
    </div>

  <div class='children'>

        <div class='file'>
          hero-list.component.css
        </div>

        <div class='file'>
          hero-list.component.html
        </div>

        <div class='file'>
          hero-list.component.ts
        </div>

</div>

    <div class='file'>
      hero.service.ts
    </div>

    <div class='file'>
      hero.ts
    </div>

    <div class='file'>
      heroes-routing.module.ts
    </div>

    <div class='file'>
      heroes.module.ts
    </div>

    <div class='file'>
      mock-heroes.ts
    </div>

</div>

</div>

</div>

{@a hero-routing-requirements}

#### *Hero* 功能路由需求

英雄功能有兩個互相作用的元件：英雄清單與英雄詳細資料。
清單檢視是自給自足的；你導覽到它，它取得英雄清單並顯示它們。

詳細資料檢視則不同。它顯示特定的英雄。它無法自行知道要顯示哪個英雄。
該資訊必須來自外部。

當使用者從清單中選取英雄時，應用程式應該導覽到詳細資料檢視
並顯示該英雄。
你透過在路由 URL 中包含所選英雄的 id，告訴詳細資料檢視要顯示哪個英雄。

從它們在 `src/app/heroes/` 資料夾中的新位置匯入英雄元件，定義這兩個英雄路由。

現在你已為 `Heroes` 模組準備好路由，請透過
`RouterModule` 把它們向 `Router` 註冊，方式_幾乎_與你在 `AppRoutingModule` 中所做的一樣。

有一個小而關鍵的差異。
在 `AppRoutingModule` 中，你使用靜態的 **`RouterModule.forRoot()`** 方法來註冊路由與應用程式層級的服務提供者。
在功能模組中，你使用靜態的 **`forChild`** 方法。

<div class="alert is-helpful">

只能在根 `AppRoutingModule` 中呼叫 `RouterModule.forRoot()`
（或在 `AppModule` 中呼叫，如果你是在那裡註冊頂層應用程式路由的話）。
在任何其他模組中，你必須呼叫 **`RouterModule.forChild`** 方法來註冊額外的路由。

</div>

更新後的 `HeroesRoutingModule` 如下所示：

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts"></code-example>

<div class="alert is-helpful">

考慮為每個功能模組提供它自己的路由設定檔。
當功能路由還很簡單時，這在早期可能顯得過頭。
但路由往往會變得更複雜，而模式上的一致性會隨著時間而得到回報。

</div>

{@a remove-duplicate-hero-routes}

#### 移除重複的英雄路由

英雄路由目前定義在*兩個*地方：在 `HeroesRoutingModule` 中，
透過 `HeroesModule`，以及在 `AppRoutingModule` 中。

功能模組提供的路由會由路由器合併到它們被匯入的模組的路由中。這讓你可以繼續定義功能模組路由，而不必修改主要的路由設定。

從 `app-routing.module.ts` 中移除 `HeroListComponent` 匯入與 `/heroes` 路由。

**保留預設路由與萬用字元路由！**
這些是應用程式本身頂層的關注點。

<code-example path="router/src/app/app-routing.module.2.ts" header="src/app/app-routing.module.ts (v2)"></code-example>

{@a merge-hero-routes}

#### 移除英雄宣告

從 `AppModule` 的 `declarations` 中移除 `HeroListComponent`，因為它現在由 `HeroesModule` 提供。你可以用更多元件與不同路由來演進英雄功能。這就是為每個功能區域建立獨立模組的一個關鍵好處。

完成這些步驟後，`AppModule` 應如下所示：

<code-example path="router/src/app/app.module.3.ts" header="src/app/app.module.ts"></code-example>

{@a routing-module-order}

### 模組匯入順序很重要

看一下模組的 `imports` 陣列。請注意 `AppRoutingModule` 在_最後_。
最重要的是，它在 `HeroesModule` _之後_。

<code-example path="router/src/app/app.module.3.ts" region="module-imports" header="src/app/app.module.ts (module-imports)"></code-example>

路由設定的順序很重要。
路由器接受第一個符合導覽請求路徑的路由。

當所有路由都在一個 `AppRoutingModule` 中時，
你把預設路由與 [wildcard](#wildcard) 路由放在最後，在 `/heroes` 路由之後，
這樣路由器就有機會在碰到萬用字元路由並導覽到「Page not found」之前，
先把 URL 與 `/heroes` 路由進行比對。

這些路由不再位於一個檔案中。
它們分佈在兩個模組中，`AppRoutingModule` 與 `HeroesRoutingModule`。

每個路由模組都依_匯入順序_擴充路由設定。
如果你把 `AppRoutingModule` 列在第一位，萬用字元路由將註冊在
英雄路由_之前_。
萬用字元路由&mdash;它符合*每個* URL&mdash;將攔截前往英雄路由的導覽嘗試。

<div class="alert is-helpful">

把路由模組的順序顛倒，親自看看
點擊 heroes 連結會得到「Page not found」。
了解如何檢視執行階段的路由器設定，
請看[下方](#inspect-config "Inspect the router config")。

</div>

### 路由參數

{@a route-def-with-parameter}

#### 帶有參數的路由定義

回到 `HeroesRoutingModule`，再次查看路由定義。
通往 `HeroDetailComponent` 的路由有一個轉折。

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (excerpt)" region="hero-detail-route"></code-example>

注意路徑中的 `:id` 權杖。那在路徑中為**路由參數**建立了一個槽位。
在這個情況下，路由器會把英雄的 `id` 插入該槽位。

如果你告訴路由器導覽到詳細資料元件並顯示「Magneta」，
你預期英雄 id 會像這樣出現在瀏覽器 URL 中：

<code-example format="nocode">
  localhost:4200/hero/15

</code-example>

如果使用者把該 URL 輸入瀏覽器網址列，路由器應該辨識出
這個模式，並前往同一個「Magneta」詳細資料檢視。

<div class="callout is-helpful">

<header>
  路由參數：必要還是可選？
</header>

把路由參數權杖 `:id`
嵌入路由定義路徑，對於這個情境是很好的選擇，
因為 `id` 是 `HeroDetailComponent` *必要*的，而且因為
路徑中的值 `15` 清楚地把通往「Magneta」的路由與
通往其他英雄的路由區分開來。

</div>

{@a route-parameters}

#### 在清單檢視中設定路由參數

導覽到 `HeroDetailComponent` 之後，你預期會看到所選英雄的詳細資料。
你需要*兩項*資訊：通往該元件的路由路徑，以及英雄的 `id`。

因此，_連結參數陣列_有*兩項*：路由_路徑_，以及一個指定
所選英雄 `id` 的_路由參數_。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>

路由器像這樣從陣列組裝目標 URL：
`localhost:4200/hero/15`。

<div class="alert is-helpful">

目標 `HeroDetailComponent` 如何得知該 `id`？
不要自己分析 URL。讓路由器來做。

路由器會從 URL 中擷取路由參數（`id:15`），並使用 `ActivatedRoute` 服務將它提供給 `HeroDetailComponent`。

</div>

{@a activated-route}

### *Activated Route* 實作

從路由器套件匯入 `Router`、`ActivatedRoute` 與 `ParamMap` 權杖。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (activated route)" region="imports"></code-example>

匯入 `switchMap` 運算子，因為你稍後需要它來處理 `Observable` 路由參數。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (switchMap operator import)" region="rxjs-operator-import"></code-example>

{@a hero-detail-ctor}

一如往常，你撰寫一個建構子，要求 Angular 注入服務，
即元件需要的服務，並把它們參照為私有變數。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (constructor)" region="ctor"></code-example>

稍後，在 `ngOnInit` 方法中，你使用 `ActivatedRoute` 服務來擷取路由的參數，
從參數中取出英雄 `id`，並擷取要顯示的英雄。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit)" region="ngOnInit"></code-example>

`paramMap` 的處理有點棘手。當對應表變更時，你從變更後的參數中 `get()`
`id` 參數。

接著你告訴 `HeroService` 擷取具有該 `id` 的英雄，並回傳 `HeroService` 請求的結果。

你可能會想到使用 RxJS 的 `map` 運算子。
但 `HeroService` 傳回的是一個 `Observable<Hero>`。
所以你改用 `switchMap` 運算子來攤平這個 `Observable`。

`switchMap` 運算子也會取消先前進行中的請求。如果使用者以新的 `id` 重新導覽到這個路由，
而 `HeroService` 還在擷取舊的 `id`，`switchMap` 會捨棄那個舊請求，並傳回新 `id` 的英雄。

這個 observable `Subscription` 將由 `AsyncPipe` 處理，元件的 `hero` 屬性將以擷取到的英雄（重新）設定。

#### _ParamMap_ API

`ParamMap` API 受到 [URLSearchParams 介面](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 的啟發。它提供方法
來處理路由參數（`paramMap`）與查詢參數（`queryParamMap`）的參數存取。

<table>
  <tr>
    <th>
      Member
    </th>

    <th>
      Description
    </th>
  </tr>

  <tr>
    <td>
      <code>has(name)</code>
    </td>
    <td>

    如果參數名稱在參數的對應中，則回傳 `true`。

    </td>
  </tr>

  <tr>
    <td>
      <code>get(name)</code>
    </td>
    <td>

    如果存在，則回傳參數名稱的值（一個 `string`），如果參數名稱不在對應中，則回傳 `null`。如果參數值實際上是值的陣列，則回傳_第一個_元素。

    </td>
  </tr>

  <tr>
    <td>
      <code>getAll(name)</code>
    </td>
    <td>

    如果找到，則回傳參數名稱值的 `string array`，如果參數名稱值不在對應中，則回傳空的 `array`。當單一參數可能有多個值時，請使用 `getAll`。

    </td>
  </tr>

  <tr>
    <td>
      <code>keys</code>
    </td>
    <td>

    回傳對應中所有參數名稱的 `string array`。

    </td>
  </tr>
</table>

{@a reuse}

#### Observable <i>paramMap</i> 與元件重複使用

在這個範例中，你從一個 `Observable` 擷取路由參數對應。
這意味著路由參數對應可能在這個元件的生命週期中改變。

他們可能會。依預設，當路由器重新導覽到相同元件型別，
且沒有先造訪其他元件時，它會重複使用元件實例。路由參數每次都可能改變。

假設父元件導覽列有「向前」與「向後」按鈕，可以捲動瀏覽英雄清單。
每次點按都會以命令式方式導覽到 `HeroDetailComponent`，並帶上下一個或上一個 `id`。

你不會希望路由器把目前的 `HeroDetailComponent` 實例從 DOM 中移除，只為了為了下一個 `id` 重新建立它。
那可能造成明顯的突兀感。
更好的做法是重複使用同一個元件實例，並更新參數。

不幸的是，`ngOnInit` 每次元件實例化時只會被呼叫一次。
你需要一種方法，能從_同一個實例內部_偵測路由參數何時變更。
observable 的 `paramMap` 屬性把這件事處理得很漂亮。

<div class="alert is-helpful">

當你在元件中訂閱 observable 時，你幾乎總是會安排在元件被銷毀時取消訂閱。

有少數幾個特殊的 observable 不需要這樣做。
`ActivatedRoute` 的 observable 就屬於這些例外。

`ActivatedRoute` 及其 observable 與 `Router` 本身隔離。
當被路由的元件不再需要時，`Router` 會銷毀它，而注入的 `ActivatedRoute` 也隨之消亡。

你可以照樣取消訂閱。這無害，而且永遠不是壞習慣。

</div>

{@a snapshot}

#### *Snapshot*：*無 observable* 的替代方案
_這個_應用程式不會重複使用 `HeroDetailComponent`。
使用者總是回到英雄清單來選擇另一個要查看的英雄。
沒有辦法從一個英雄詳細資料直接導覽到另一個英雄詳細資料，
中間不經過清單元件。
因此，路由器每次都會建立一個新的 `HeroDetailComponent` 實例。

當你確知 `HeroDetailComponent` 實例*永遠、永遠、永遠*不會
被重複使用時，你可以用*快照*來簡化程式碼。

`route.snapshot` 提供路由參數對應表的初始值。
你可以直接存取參數，無需訂閱或加入 observable 運算子。
它寫起來與讀起來都簡單得多：

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.2.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit snapshot)" region="snapshot"></code-example>

<div class="alert is-helpful">

**請記住：**使用這種技巧，你只能得到參數對應表的_初始_值。
如果路由器甚至有可能重複使用該元件，
請堅持使用 observable `paramMap` 方法。
本範例為了以防萬一，維持使用 observable `paramMap` 策略。

</div>

{@a nav-to-list}

### 導覽回清單元件

`HeroDetailComponent` 有一個「Back」按鈕，連接到它的 `gotoHeroes` 方法，該方法以命令式方式導覽
回到 `HeroListComponent`。

router `navigate` 方法接受與你可以繫結到 `[routerLink]` 指令的相同的一項
_連結參數陣列_。
它存放著_通往 `HeroListComponent` 的路徑_：

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (excerpt)" region="gotoHeroes"></code-example>

{@a optional-route-parameters}

#### 路由參數：必要或選擇性？

使用[*路由參數*](#路由參數)來在路由 URL *內*指定*必要*參數值，
就像你在導覽到 `HeroDetailComponent` 以查看 *id* 為 15 的英雄時所做的那樣：

<code-example format="nocode">
  localhost:4200/hero/15

</code-example>

你也可以為路由請求加入*選用*資訊。
例如，當從英雄詳細資料檢視回到 hero-detail.component.ts 清單時，
如果被查看的英雄在清單中預先被選取，那就太好了。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/selected-hero.png' alt="被選取的英雄">
  </div>
</figure>

你稍後會實作這個功能，方法是從 `HeroDetailComponent` 返回時，
在 URL 中把被查看英雄的 `id` 作為選用參數包含進去。

選用資訊有其他形式。搜尋條件通常是鬆散結構的，例如 `name='wind*'`。
多個值很常見&mdash;`after='12/31/2015' & before='1/1/2017'`&mdash;沒有
特定順序&mdash;`before='1/1/2017' & after='12/31/2015'`&mdash;以
各種格式&mdash;`during='currentYear'`。

這類參數不容易塞進 URL *路徑*中。即使你能定義出合適的 URL 權杖方案，
那也會大大複雜化把傳入 URL 轉換為命名路由所需的模式比對。

選用參數是在導覽期間傳達任意複雜資訊的理想載體。
選用參數不參與模式比對，並提供表達上的靈活性。

路由器支援以選用參數以及必要路由參數進行導覽。
在定義必要路由參數_之後_，在獨立的物件中定義_選用_參數。

一般而言，當該值是強制性的時（例如，對於區分一條路由路徑與另一條路由路徑是必要的），
偏好使用*必要路由參數*；
當該值是選用的、複雜的及／或多變量時，偏好使用*選用參數*。

{@a optionally-selecting}

#### 英雄清單：選擇性地選取英雄

導覽到 `HeroDetailComponent` 時，你在
*路由參數*中指定了要編輯之英雄的*必要* `id`，並把它作為[_連結參數陣列_](#link-parameters-array)的第二項。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>

路由器把 `id` 值嵌入導覽 URL，因為你已把它定義
為路由 `path` 中帶有 `:id` 佔位符權杖的路由參數：

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (hero-detail-route)" region="hero-detail-route"></code-example>

當使用者點按返回按鈕時，`HeroDetailComponent` 會建構另一個_連結參數陣列_，用它來導覽回 `HeroListComponent`。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (gotoHeroes)" region="gotoHeroes"></code-example>

這個陣列缺乏路由參數，因為你沒有理由向 `HeroListComponent` 傳送資訊。

現在你有理由了。你希望隨著導覽請求傳送目前英雄的 id，讓
`HeroListComponent` 能在它的清單中反白顯示該英雄。
這是一個*有更好、沒有也行*的功能；沒有它，清單也能完美地顯示。

以一個包含_選用_ `id` 參數的物件傳送 `id`。
為了示範，物件中有一個額外的垃圾參數（`foo`），`HeroListComponent` 應該忽略它。
以下是修訂後的導覽陳述式：

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (go to heroes)" region="gotoHeroes"></code-example>

應用程式仍然可以運作。點按「back」會返回英雄清單檢視。

查看瀏覽器的網址列。

它應該看起來像這樣，取決於你在哪裡執行它：

<code-example language="bash">
  localhost:4200/heroes;id=15;foo=foo

</code-example>

`id` 值出現在 URL 中，如（`;id=15;foo=foo`），而不是出現在 URL 路徑中。「Heroes」路由的路徑沒有 `:id` 權杖。

選用路由參數不是像在 URL 查詢字串中那樣以「?」與「&」分隔。
它們是**以分號「;」分隔**。
這是 *matrix URL* 記法&mdash;你可能以前沒見過的東西。

<div class="alert is-helpful">

*Matrix URL* 記法是一個最早在
1996 年由 Web 創始人 Tim Berners-Lee 提出的[提案](http://www.w3.org/DesignIssues/MatrixURIs.html)中引入的想法。

雖然 matrix 記法從未進入 HTML 標準，但它是合法的，
並且在瀏覽器路由系統中流行起來，作為隔離屬於
父路由與子路由之參數的一種方式。Router 就是這樣一個系統，並提供
跨瀏覽器的 matrix 記法支援。

這種語法對你而言可能看起來很奇怪，但使用者不太可能注意到或在意，
只要 URL 可以用電子郵件傳送並貼到瀏覽器網址列，
就像這個 URL 一樣。

</div>

{@a route-parameters-activated-route}

### *ActivatedRoute* 服務中的路由參數

英雄清單沒有改變。沒有任何英雄列被反白顯示。

<div class="alert is-helpful">

<live-example></live-example> *確實*反白顯示了被選取的
列，因為它示範的是應用程式的最終狀態，其中包括你*即將*要涵蓋的步驟。
目前本指南描述的是這些步驟*之前*的狀況。

</div>

`HeroListComponent` 根本不期望任何參數，也不知道該拿它們怎麼辦。
你可以改變這一點。

先前，當你從 `HeroListComponent` 導覽到 `HeroDetailComponent` 時，你訂閱了路由參數對應 `Observable`，並在 `ActivatedRoute` 服務中將它提供給 `HeroDetailComponent`。
你在 `HeroDetailComponent` 的建構子中注入了該服務。

這一次你將朝相反的方向導覽，從 `HeroDetailComponent` 到 `HeroListComponent`。

首先，你擴充 router 匯入陳述式，加入 `ActivatedRoute` 服務符號：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (import)" region="import-router"></code-example>

匯入 `switchMap` 運算子，以對路由參數對應的 `Observable` 執行操作。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (rxjs imports)" region="rxjs-imports"></code-example>

然後你在 `HeroListComponent` 建構子中注入 `ActivatedRoute`。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (constructor and ngOnInit)" region="ctor"></code-example>

`ActivatedRoute.paramMap` 屬性是一個路由參數的 `Observable` 對應表。當使用者導覽到該元件時，`paramMap` 會發出一個包含 `id` 的新值對應表。在 `ngOnInit` 中，你訂閱這些值、設定 `selectedId`，並取得英雄。

使用[類別綁定](guide/template-syntax#類別繫結)更新範本。
當比較回傳 `true` 時，該綁定會加入 `selected` CSS 類別，回傳 `false` 時則移除它。
請在重複的 `<li>` 標籤內尋找它，如下所示：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.html" header="src/app/heroes/hero-list/hero-list.component.html"></code-example>

加入一些在清單項目被選取時套用的樣式。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.css" region="selected" header="src/app/heroes/hero-list/hero-list.component.css"></code-example>

當使用者從英雄清單導覽到「Magneta」英雄再返回時，「Magneta」會顯示為被選取：

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/selected-hero.png' alt="被選取的清單">
  </div>
</figure>

選用的 `foo` 路由參數無害，並繼續被忽略。

### 加入可路由的動畫

{@a route-animation}

#### 為被路由的元件加入動畫
英雄功能模組幾乎完成了，但一個功能沒有一些流暢的轉場怎麼行？

本節會向你展示如何為 `HeroDetailComponent` 加入一些[動畫](guide/animations)。

首先匯入 `BrowserAnimationsModule`，並把它加入 `imports` 陣列：

<code-example path="router/src/app/app.module.ts" header="src/app/app.module.ts (animations-module)" region="animations-module"></code-example>

接著，為 `HeroListComponent` 與 `HeroDetailComponent` 的路由加入一個 `data` 物件。轉場是基於 `states` 的，你將使用路由中的 `animation` 資料，為轉場提供一個命名的動畫 `state`。

<code-example path="router/src/app/heroes/heroes-routing.module.2.ts" header="src/app/heroes/heroes-routing.module.ts (animation data)"></code-example>

在根 `src/app/` 資料夾中建立一個 `animations.ts` 檔案。其內容如下所示：

<code-example path="router/src/app/animations.ts" header="src/app/animations.ts (excerpt)"></code-example>

這個檔案會執行下列動作：

* 匯入建立動畫觸發器、控制狀態，以及管理狀態之間轉場的動畫符號。

* 匯出一個名為 `slideInAnimation` 的常數，設定為一個名為 *`routeAnimation`* 的動畫觸發器；

* 定義一個*轉場*，當在 `heroes` 與 `hero` 路由之間來回切換時，讓元件在進入應用程式檢視時從螢幕左側緩入（`:enter`），另一個轉場則讓元件在離開應用程式檢視時向右動畫移動（`:leave`）。

你也可以為其他路由建立更多轉場。這個觸發器對於目前的里程碑已經足夠。

回到 `AppComponent`，從 `@angular/router` 套件匯入 `RouterOutlet` 權杖，並從
`'./animations.ts` 匯入 `slideInAnimation`。

把一個 `animations` 陣列加入 `@Component` 中繼資料，其中包含 `slideInAnimation`。

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (animations)" region="animation-imports"></code-example>

為了使用可路由的動畫，你需要把 `RouterOutlet` 包在一個元素內。你將
使用 `@routeAnimation` 觸發器並把它繫結到該元素。

為了讓 `@routeAnimation` 轉場能依據狀態觸發，你需要向它提供來自 `ActivatedRoute` 的 `data`。`RouterOutlet` 以 `outlet` 範本變數的形式公開，所以你繫結一個對路由器出口的參照。`routerOutlet` 這個變數是理想的選擇。

<code-example path="router/src/app/app.component.2.html" header="src/app/app.component.html (router outlet)"></code-example>

`@routeAnimation` 屬性繫結到 `getAnimationData`，並提供 `routerOutlet` 參照，所以你需要在 `AppComponent` 中定義該函式。`getAnimationData` 函式傳回來自由 `ActivatedRoute` 提供的 `data` 中的 animation 屬性。`animation` 屬性與你在 `animations.ts` 中定義的 `slideInAnimation` 中使用的 `transition` 名稱相符。

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (router outlet)" region="function-binding"></code-example>

在兩個路由之間切換時，`HeroDetailComponent` 與 `HeroListComponent` 在被路由到時會從左側緩入，而在導覽離開時會滑向右側。

{@a milestone-3-wrap-up}

### 里程碑 3 總結

你已經學會如何做下列事情：

* 把應用程式組織成*功能區域*。
* 以命令式方式從一個元件導覽到另一個元件。
* 在路由參數中沿途傳遞資訊，並在元件中訂閱它們。
* 把功能區域 NgModule 匯入 `AppModule`。
* 根據頁面套用可路由的動畫。

在這些變更之後，資料夾結構看起來像這樣：

<div class='filetree'>

  <div class='file'>
    angular-router-sample
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
          crisis-list
        </div>

  <div class='children'>

            <div class='file'>
              crisis-list.component.css
            </div>

            <div class='file'>
              crisis-list.component.html
            </div>

            <div class='file'>
              crisis-list.component.ts
            </div>

</div>

        <div class='file'>
          heroes
        </div>

  <div class='children'>

          <div class='file'>
            hero-detail
          </div>

  <div class='children'>

              <div class='file'>
                hero-detail.component.css
              </div>

              <div class='file'>
                hero-detail.component.html
              </div>

              <div class='file'>
                hero-detail.component.ts
              </div>

</div>

          <div class='file'>
            hero-list
          </div>

  <div class='children'>

              <div class='file'>
                hero-list.component.css
              </div>

              <div class='file'>
                hero-list.component.html
              </div>

              <div class='file'>
                hero-list.component.ts
              </div>

</div>

          <div class='file'>
            hero.service.ts
          </div>

          <div class='file'>
            hero.ts
          </div>

          <div class='file'>
            heroes-routing.module.ts
          </div>

          <div class='file'>
            heroes.module.ts
          </div>

          <div class='file'>
            mock-heroes.ts
          </div>

</div>

        <div class='file'>
          page-not-found
        </div>

  <div class='children'>

          <div class='file'>

            page-not-found.component.css

</div>

          <div class='file'>

            page-not-found.component.html

</div>

          <div class='file'>

            page-not-found.component.ts

</div>

</div>

</div>

      <div class='file'>
        animations.ts
      </div>

      <div class='file'>
        app.component.css
      </div>

      <div class='file'>
        app.component.html
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
        main.ts
      </div>

      <div class='file'>
        message.service.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
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

以下是這個範例應用程式版本的相關檔案。

<code-tabs>

  <code-pane header="animations.ts" path="router/src/app/animations.ts">

  </code-pane>

  <code-pane header="app.component.html" path="router/src/app/app.component.2.html">

  </code-pane>

  <code-pane header="app.component.ts" path="router/src/app/app.component.2.ts">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.3.ts">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.2.ts" region="milestone3">

  </code-pane>

  <code-pane header="hero-list.component.css" path="router/src/app/heroes/hero-list/hero-list.component.css">

  </code-pane>

  <code-pane header="hero-list.component.html" path="router/src/app/heroes/hero-list/hero-list.component.html">

  </code-pane>

  <code-pane header="hero-list.component.ts" path="router/src/app/heroes/hero-list/hero-list.component.ts">

  </code-pane>

  <code-pane header="hero-detail.component.html" path="router/src/app/heroes/hero-detail/hero-detail.component.html">

  </code-pane>

  <code-pane header="hero-detail.component.ts" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts">

  </code-pane>

  <code-pane header="hero.service.ts" path="router/src/app/heroes/hero.service.ts">

  </code-pane>

  <code-pane header="heroes.module.ts" path="router/src/app/heroes/heroes.module.ts">

  </code-pane>

  <code-pane header="heroes-routing.module.ts" path="router/src/app/heroes/heroes-routing.module.2.ts">

  </code-pane>

  <code-pane header="message.service.ts" path="router/src/app/message.service.ts">

  </code-pane>

</code-tabs>

{@a milestone-4}

## 里程碑 4：危機中心功能

是時候為應用程式目前的佔位用危機中心加入真正的功能了。

先模仿英雄功能來開始：

* 在 `src/app` 資料夾中建立一個 `crisis-center` 子資料夾。
* 將 `app/heroes` 中的檔案與資料夾複製到新的 `crisis-center` 資料夾中。
* 在新檔案中，將每個提到的「hero」改為「crisis」，「heroes」改為「crises」。
* 將 NgModule 檔案重新命名為 `crisis-center.module.ts` 與 `crisis-center-routing.module.ts`。

你將使用模擬危機而不是模擬英雄：

<code-example path="router/src/app/crisis-center/mock-crises.ts" header="src/app/crisis-center/mock-crises.ts"></code-example>

由此產生的危機中心，是引入新概念&mdash;**子路由**的基礎。
你可以讓 *Heroes* 保持在目前狀態，作為與 *Crisis Center* 的對照，
稍後再決定這些差異是否值得。

<div class="alert is-helpful">

依照
<a href="https://blog.8thlight.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html" title="Separation of Concerns">*關注點分離*原則</a>，
對 *Crisis Center* 的變更不會影響 `AppModule` 或
任何其他功能的元件。

</div>

{@a crisis-child-routes}

### 帶有子路由的危機中心

這一節展示如何組織危機中心，
使其符合下列 Angular 應用程式的推薦模式：

* 每個功能區域都位於自己的資料夾中。
* 每個功能都有自己的 Angular 功能模組。
* 每個區域都有自己的區域根元件。
* 每個區域根元件都有自己的路由器插座與子路由。
* 功能區域路由很少（即使有）會與其他功能的路由交叉。

如果你的應用程式有許多功能區域，應用程式的元件樹可能看起來像這樣：

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/component-tree.png' alt="元件樹">
  </div>
</figure>

{@a child-routing-component}

### 子路由元件

在 `crisis-center` 資料夾中產生一個 `CrisisCenter` 元件：

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center
</code-example>

把元件範本更新成這樣：

<code-example path="router/src/app/crisis-center/crisis-center/crisis-center.component.html" header="src/app/crisis-center/crisis-center/crisis-center.component.html"></code-example>

`CrisisCenterComponent` 與 `AppComponent` 有以下共通點：

* 它是危機中心區域的*根*，
就像 `AppComponent` 是整個應用程式的根。
* 它是危機管理功能區域的*殼層*，
就像 `AppComponent` 是管理高層級工作流程的殼層。

像大多數殼層一樣，`CrisisCenterComponent` 類別非常簡單，甚至比 `AppComponent` 還簡單：
它沒有業務邏輯，其範本也沒有連結，只有一個標題和
危機中心子元件的 `<router-outlet>`。

{@a child-route-config}

### 子路由設定

作為「危機中心」功能的宿主頁面，請在 `crisis-center` 資料夾中產生一個 `CrisisCenterHome` 元件。

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center-home
</code-example>

使用歡迎來到 `Crisis Center` 的訊息更新範本。

<code-example path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html" header="src/app/crisis-center/crisis-center-home/crisis-center-home.component.html"></code-example>

更新你從 `heroes-routing.module.ts` 檔案複製後重新命名的 `crisis-center-routing.module.ts`。
這次，你在父 `crisis-center` 路由*內*定義**子路由**。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (Routes)" region="routes"></code-example>

請注意，父 `crisis-center` 路由有一個 `children` 屬性，
其中有一個包含 `CrisisListComponent` 的路由。`CrisisListComponent` 路由
也有一個包含兩個路由的 `children` 陣列。

這兩個路由分別導覽至危機中心子元件 `CrisisCenterHomeComponent` 與 `CrisisDetailComponent`。

路由器處理這些_子路由_的方式有*重要差異*。

路由器把這些路由的元件顯示在 `CrisisCenterComponent` 的 `RouterOutlet` 中，
而不是在 `AppComponent` 殼層的 `RouterOutlet` 中。

`CrisisListComponent` 包含危機清單與一個 `RouterOutlet`，
用來顯示 `Crisis Center Home` 與 `Crisis Detail` 路由元件。

`Crisis Detail` 路由是 `Crisis List` 的子路由。路由器依預設[重複使用元件](#reuse)，
所以當你選取不同危機時，`Crisis Detail` 元件將被重複使用。
相比之下，回到 `Hero Detail` 路由時，當你從英雄清單中選取不同英雄時，[該元件會重新建立](#snapshot：無-observable-的替代方案)。

在頂層，以 `/` 開頭的路徑指的是應用程式的根。
但子路由會*擴充*父路由的路徑。
沿著路由樹每往下一步，
你加入一個斜線，後面跟著路由路徑，除非該路徑是_空的_。

把這個邏輯套用到危機中心的導覽，其父路徑為 `/crisis-center`。

* 若要導覽至 `CrisisCenterHomeComponent`，完整 URL 是 `/crisis-center`（`/crisis-center` + `''` + `''`）。

* 若要導覽至 `id=2` 危機的 `CrisisDetailComponent`，完整 URL 是
`/crisis-center/2`（`/crisis-center` + `''` + `'/2'`）。

後一個範例的絕對 URL，包括 `localhost` 來源，是

<code-example>
  localhost:4200/crisis-center/2

</code-example>

以下是完整的 `crisis-center-routing.module.ts` 檔案及其匯入。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (excerpt)"></code-example>

{@a import-crisis-module}

### 把危機中心模組匯入 *AppModule* 路由

和 `HeroesModule` 一樣，你必須把 `CrisisCenterModule` 加入 `AppModule` 的 `imports` 陣列，而且要放在 `AppRoutingModule` _之前_：

<code-tabs>

  <code-pane path="router/src/app/crisis-center/crisis-center.module.ts"header="src/app/crisis-center/crisis-center.module.ts">

  </code-pane>

  <code-pane path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (import CrisisCenterModule)" region="crisis-center-module">

  </code-pane>

</code-tabs>

從 `app-routing.module.ts` 中移除初始的危機中心路由。
功能路由現在由 `HeroesModule` 與 `CrisisCenter` 模組提供。

`app-routing.module.ts` 檔案會保留預設路由與萬用字元路由等最上層應用程式路由。

<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (v3)" region="v3"></code-example>

{@a relative-navigation}

### 相對導覽

在建置危機中心功能的過程中，你使用以_斜線_開頭的**絕對路徑**，
導覽到危機詳細資料路由。

路由器把這樣的_絕對_路徑，與從路由設定頂部開始的路由進行比對。

你可以繼續使用像這樣的絕對路徑，在 *Crisis Center*
功能內部導覽，但那會把連結釘死在父路由結構上。
如果你變更了父 `/crisis-center` 路徑，你就必須變更連結參數陣列。

你可以定義**相對於**目前 URL 區段的路徑，把連結從這種相依性中解放出來。
即使你變更通往該功能的父路由路徑，功能區域*內部*的導覽仍保持完整。

這是一個範例：

<div class="alert is-helpful">

路由器支援_連結參數清單_中的目錄式語法，以協助引導路由名稱查詢：

`./` 或 `no leading slash` 相對於目前層級。

`../` 在路由路徑中往上一層。

你可以把相對導覽語法與祖先路徑結合使用。
如果你必須導覽至同層路由，可以使用 `../<sibling>` 慣例，先往上一層，
再橫向移至同層路由路徑。

</div>

若要使用 `Router.navigate` 方法導覽相對路徑，你必須提供 `ActivatedRoute`，讓路由器知道你在目前路由樹中的位置。

在_連結參數陣列_之後，加入一個將 `relativeTo` 屬性設為 `ActivatedRoute` 的物件。
路由器接著會根據作用中路由的位置來計算目標 URL。

<div class="alert is-helpful">

**永遠**在呼叫路由器的 `navigateByUrl` 方法時，指定完整的_絕對_路徑。

</div>

{@a nav-to-crisis}

### 使用相對 URL 導覽至危機清單

你已經注入了組成相對導覽路徑所需的 `ActivatedRoute`。

當使用 `RouterLink` 而不是 `Router` 服務來導覽時，你會使用_相同_的
連結參數陣列，但你不會提供帶有 `relativeTo` 屬性的物件。
在 `RouterLink` 指令中，`ActivatedRoute` 是隱含的。

更新 `CrisisDetailComponent` 的 `gotoCrises` 方法，使用相對路徑導覽回到 *Crisis Center* 清單。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (relative navigation)" region="gotoCrises-navigate"></code-example>

請注意，路徑會使用 `../` 語法往上一層。
如果目前危機的 `id` 是 `3`，回到危機清單的結果路徑就是 `/crisis-center/;id=3;foo=foo`。

{@a named-outlets}

### 在具名 outlet 中顯示多個路由

你決定提供使用者聯絡危機中心的方式。
當使用者點選「Contact」按鈕時，你希望在彈出視窗中顯示一則訊息。

彈出視窗應保持開啟，即使在應用程式的頁面之間切換也一樣，直到使用者傳送訊息或取消後才關閉。
顯然你不能把彈出視窗放在與其他頁面相同的 outlet 中。

到目前為止，你定義了單一出口，並把子路由巢狀
放在該出口之下，以把路由分組在一起。
路由器每個範本只支援一個主要的_未命名_出口。

範本也可以有任意數量的_命名_出口。
每個命名出口都有自己的一組路由與自己的元件。
多個出口可以同時顯示不同的內容，由不同的路由決定。

在 `AppComponent` 中加入一個名為「popup」的 outlet，位於未具名 outlet 的正下方。

<code-example path="router/src/app/app.component.4.html" header="src/app/app.component.html (outlets)" region="outlets"></code-example>

一旦你學會如何把彈出元件路由到該 outlet，彈出視窗就會出現在那裡。

{@a secondary-routes}

#### 次要路由

具名 outlet 是_次要路由_的目標。

次要路由看起來像主要路由，設定方式也相同。
它們在幾個關鍵方面有所不同。

* 它們彼此獨立。
* 它們會與其他路由搭配運作。
* 它們顯示在具名 outlet 中。

產生一個新的元件來撰寫訊息。

<code-example language="none" class="code-shell">
  ng generate component compose-message
</code-example>

它顯示一個簡單的表單，帶有標題、一個訊息輸入框，
以及兩個按鈕「Send」與「Cancel」。

<figure class="lightbox">
  <div class="card">
    <img src='generated/images/guide/router/contact-popup.png' alt="聯絡快顯視窗">
  </div>
</figure>

以下是該元件、其範本與樣式：

<code-tabs>

  <code-pane header="src/app/compose-message/compose-message.component.css" path="router/src/app/compose-message/compose-message.component.css">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.html" path="router/src/app/compose-message/compose-message.component.html">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.ts" path="router/src/app/compose-message/compose-message.component.ts">

  </code-pane>

</code-tabs>

它看起來與你在本指南中看過的任何其他元件差不多。
有兩個值得注意的差異。

請注意，`send()` 方法會在「傳送」訊息並關閉彈出視窗之前，等待一秒來模擬延遲。

`closePopup()` 方法透過以 `null` 導覽到快顯出口，來關閉快顯檢視。
這是[下方](#清除次要路由)涵蓋的一個特殊情形。

{@a add-secondary-route}

#### 加入次要路由

開啟 `AppRoutingModule`，並在 `appRoutes` 中加入一個新的 `compose` 路由。

<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (compose route)" region="compose"></code-example>

`path` 與 `component` 屬性應該很熟悉。
有一個新的屬性 `outlet`，設為 `'popup'`。
這個路由現在以快顯出口為目標，`ComposeMessageComponent` 將在那裡顯示。

使用者需要一種打開快顯視窗的方法。
開啟 `AppComponent`，並加入一個「Contact」連結。

<code-example path="router/src/app/app.component.4.html" header="src/app/app.component.html (contact-link)" region="contact-link"></code-example>

雖然 `compose` 路由被釘在「popup」出口，但那不足以把路由連接到 `RouterLink` 指令。
你必須在_連結參數陣列_中指定命名出口，並以屬性繫結把它繫結到 `RouterLink`。

_連結參數陣列_包含一個物件，其單一 `outlets` 屬性的值
是另一個以一（或多）個出口名稱為鍵的物件。
在這個情況下，只有「popup」出口屬性，其值是另一個指定 `compose` 路由的_連結參數陣列_。

你實際上是在說：_當使用者點擊這個連結時，在 `popup` 出口中顯示與 `compose` 路由相關聯的元件_。

<div class="alert is-helpful">

當只有一個路由和一個需要考慮的_未命名_出口時，
這個外層物件內的 `outlets` 物件是完全不必要的。

路由器假設你的路由規格以_未命名_的主要出口為目標，
並為你建立了這些物件。

路由到命名出口揭示了一個先前隱藏的路由器真相：
你可以在同一個 `RouterLink` 指令中，以多個路由為多個出口的目標。

你實際上在這裡並沒有這樣做。
但若要以命名出口為目標，你必須使用更豐富、更冗長的語法。

</div>

{@a secondary-route-navigation}

#### 次要路由導覽：在導覽期間合併路由
導覽到 _Crisis Center_ 並點擊「Contact」。
你應該在瀏覽器網址列中看到類似下面的 URL。

<code-example>
  http://.../crisis-center(popup:compose)

</code-example>

URL 中有趣的部分在 `...` 之後：

* `crisis-center` 是主要導覽。
* 括號圍住次要路由。
* 次要路由由 outlet 名稱（`popup`）、一個 `colon` 分隔符號，以及次要路由路徑（`compose`）組成。

點選 _Heroes_ 連結，再看一次 URL。

<code-example>
  http://.../heroes(popup:compose)
</code-example>

主要導覽的部分改變了；次要路由維持不變。

路由器會追蹤導覽樹中的兩個獨立分支，並在 URL 中產生該樹的表示法。

你可以在頂層與巢狀層級加入更多出口與路由，建立一個有許多分支的導覽樹。
路由器會產生相應的 URL。

你可以填好上面提到的 `outlets` 物件，告訴路由器一次導覽整個樹。
然後把該物件放在_連結參數陣列_內，傳給 `router.navigate` 方法。

在你閒暇時實驗這些可能性。

{@a clear-secondary-routes}

#### 清除次要路由
如你所學，出口中的元件會持續存在，直到你導覽離開到新元件為止。
次要出口在這方面也沒有不同。

每個次要 outlet 都有自己的導覽，獨立於驅動主要 outlet 的導覽。
變更顯示在主要 outlet 中的目前路由，對彈出 outlet 沒有影響。
這就是彈出視窗在你於危機與英雄之間導覽時仍保持可見的原因。

點擊「send」或「cancel」按鈕*確實*會清除快顯檢視。
若要了解如何做到，請再次查看 `closePopup()` 方法：

<code-example path="router/src/app/compose-message/compose-message.component.ts" header="src/app/compose-message/compose-message.component.ts (closePopup)" region="closePopup"></code-example>

它以 `Router.navigate()` 方法命令式地導覽，傳入一個[連結參數陣列](#link-parameters-array)。

就像繫結到 `AppComponent` 中 _Contact_ `RouterLink` 的陣列一樣，
這個陣列包含一個帶有 `outlets` 屬性的物件。
`outlets` 屬性的值是另一個以出口名稱為鍵的物件。
唯一的命名出口是 `'popup'`。

這次，`'popup'` 的值是 `null`。那不是路由，但它是合法的值。
把 popup `RouterOutlet` 設為 `null`，會清除該出口，並從
目前 URL 中移除次要的 popup 路由。

{@a guards}

<a id="milestone-5-route-guards"></a>

## 里程碑 5：路由守衛

目前，*任何*使用者都可以隨時導覽到應用程式中的*任何地方*。
那並不總是正確的做法。

* 或許使用者無權導覽到目標元件。
* 也許使用者必須先登入（*驗證*）。
* 也許你應該在顯示目標元件之前先取得一些資料。
* 你可能想在離開元件之前儲存待處理的變更。
* 你可能想詢問使用者，捨棄待處理的變更而不是儲存它們是否可以。

你在路由設定中加入_守衛_來處理這些情境。

守衛的回傳值會控制路由器的行為：

* 如果它回傳 `true`，導覽程序繼續進行。
* 如果它回傳 `false`，導覽程序停止，使用者停留在原地。
* 如果它回傳一個 `UrlTree`，目前的導覽取消，並對回傳的 `UrlTree` 開始新的導覽。

<div class="alert is-helpful">

**注意：**守衛也可以告訴路由器導覽到其他地方，實際上取消目前的導覽。當
在守衛內這樣做時，守衛應該傳回 `false`；

</div>

守衛*可能*會同步傳回它的布林答案。
但在許多情況下，守衛無法同步產生答案。
守衛可能要向使用者提問、把變更儲存到伺服器，或擷取新資料。
這些全都是非同步操作。

因此，路由守衛可以回傳 `Observable<boolean>` 或 `Promise<boolean>`，路由器會等待該 observable 解析為 `true` 或 `false`。

<div class="alert is-critical">

**注意：**提供給路由器的 observable 也必須完成。如果 observable 沒有完成，導覽將不會繼續。

</div>

路由器支援多種守衛介面：

* [`CanActivate`](api/router/CanActivate) 調解導覽_至_某個路由。

* [`CanActivateChild`](api/router/CanActivateChild) 調解導覽_至_某個子路由。

* [`CanDeactivate`](api/router/CanDeactivate) 調解從目前路由_離開_的導覽。

* [`Resolve`](api/router/Resolve) 在路由啟用_之前_執行路由資料擷取。

* [`CanLoad`](api/router/CanLoad) 調解導覽_至_以非同步方式載入的功能模組。

你可以在路由階層的每個層級擁有多個守衛。
路由器先檢查 `CanDeactivate` 與 `CanActivateChild` 守衛，從最深的子路由到頂部。
然後它從頂部往下到最深的子路由檢查 `CanActivate` 守衛。如果功能模組
是以非同步方式載入的，`CanLoad` 守衛會在模組載入之前被檢查。
如果_任何_守衛傳回 false，尚未完成的待處理守衛將被取消，
且整個導覽被取消。

接下來幾節有數個範例。

{@a can-activate-guard}

### _CanActivate_：要求驗證

應用程式經常會根據使用者身分限制對功能區的存取。
你可能只允許已驗證的使用者或具有特定角色的使用者存取。
你也可能在使用者帳號啟用之前封鎖或限制存取。

`CanActivate` 守衛就是用來管理這些導覽商業規則的工具。

#### 加入管理功能模組

在下一節中，你將以一些新的*管理*功能擴充危機中心。
那些功能尚未定義。
但你可以先加入一個名為 `AdminModule` 的新功能模組。

產生一個 `admin` 資料夾，內含功能模組檔案與路由設定檔案。

<code-example language="none" class="code-shell">
  ng generate module admin --routing
</code-example>

接著，產生支援元件。

<code-example language="none" class="code-shell">
  ng generate component admin/admin-dashboard
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/admin
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/manage-crises
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/manage-heroes
</code-example>

管理功能檔案結構看起來像這樣：

<div class='filetree'>

  <div class='file'>
    src/app/admin
  </div>

  <div class='children'>

    <div class='file'>
      admin
    </div>

  <div class='children'>

        <div class='file'>
          admin.component.css
        </div>

        <div class='file'>
          admin.component.html
        </div>

        <div class='file'>
          admin.component.ts
        </div>

</div>

    <div class='file'>
      admin-dashboard
    </div>

  <div class='children'>

        <div class='file'>
          admin-dashboard.component.css
        </div>

        <div class='file'>
          admin-dashboard.component.html
        </div>

        <div class='file'>
          admin-dashboard.component.ts
        </div>

</div>

    <div class='file'>
      manage-crises
    </div>

  <div class='children'>

        <div class='file'>
          manage-crises.component.css
        </div>

        <div class='file'>
          manage-crises.component.html
        </div>

        <div class='file'>
          manage-crises.component.ts
        </div>

</div>

    <div class='file'>
      manage-heroes
    </div>

  <div class='children'>

        <div class='file'>
          manage-heroes.component.css
        </div>

        <div class='file'>
          manage-heroes.component.html
        </div>

        <div class='file'>
          manage-heroes.component.ts
        </div>

</div>

    <div class='file'>
      admin.module.ts
    </div>

    <div class='file'>
      admin-routing.module.ts
    </div>

</div>

</div>

管理功能模組包含用於在
功能模組內路由的 `AdminComponent`、一個儀表板路由，以及兩個未完成的、分別管理危機與英雄的元件。

<code-tabs>

  <code-pane header="src/app/admin/admin/admin.component.html"  path="router/src/app/admin/admin/admin.component.html">

  </code-pane>

  <code-pane header="src/app/admin/admin-dashboard/admin-dashboard.component.html" path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.html">

  </code-pane>

  <code-pane header="src/app/admin/admin.module.ts" path="router/src/app/admin/admin.module.ts">

  </code-pane>

  <code-pane header="src/app/admin/manage-crises/manage-crises.component.html" path="router/src/app/admin/manage-crises/manage-crises.component.html">

  </code-pane>

  <code-pane header="src/app/admin/manage-heroes/manage-heroes.component.html"  path="router/src/app/admin/manage-heroes/manage-heroes.component.html">

  </code-pane>

</code-tabs>

<div class="alert is-helpful">

雖然管理儀表板 `RouterLink` 只包含一個相對斜線，沒有額外的 URL 區段，但它被視為與管理功能區域內的任何路由相符。你只希望在使用者造訪該路由時，`Dashboard` 連結才處於作用中。為 `Dashboard` routerLink 加入額外的繫結 `[routerLinkActiveOptions]="{ exact: true }"`，會把 `./` 連結標記為：當使用者導覽到 `/admin` URL 時處於作用中，而導覽到任何子路由時則否。

</div>

{@a component-less-route}

##### 無元件路由：在沒有元件的情況下分組路由

初始的管理路由設定如下：

<code-example path="router/src/app/admin/admin-routing.module.1.ts" header="src/app/admin/admin-routing.module.ts (admin routing)" region="admin-routes"></code-example>

看一下 `AdminComponent` 下的子路由，它有一個 `path` 和一個 `children`
屬性，但沒有使用 `component`。
你的設定沒有錯。
你定義了一個_無元件_路由。

其目標是把 `Crisis Center` 管理路由分組在 `admin` 路徑下。
你不需要元件就能做到這一點。
_無元件_路由讓[守衛子路由](#can-activate-child-guard)變得更容易。

接著，把 `AdminModule` 匯入 `app.module.ts`，並加入 `imports` 陣列以註冊管理路由。

<code-example path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (admin module)" region="admin-module"></code-example>

在 `AppComponent` 殼層中加入一個「Admin」連結，讓使用者可以前往這個功能。

<code-example path="router/src/app/app.component.5.html" header="src/app/app.component.html (template)"></code-example>

{@a guard-admin-feature}

#### 守衛管理功能

目前 *Crisis Center* 內的每個路由都對所有人開放。
新的*管理*功能應該只對已驗證的使用者可存取。

你可以把連結隱藏起來，直到使用者登入為止。但那很棘手，也難以維護。

你將改為撰寫一個 `canActivate()` 守衛方法，當匿名使用者
試圖進入管理區域時，把他們重新導向到登入頁面。

這是一個通用目的的守衛&mdash;你可以想像其他需要
已驗證使用者的功能&mdash;所以你在 `auth` 資料夾中產生一個
`AuthGuard`。

<code-example language="none" class="code-shell">
  ng generate guard auth/auth
</code-example>

目前你有興趣觀察守衛如何運作，所以第一版什麼有用的事都不做。
它只是記錄到主控台，並立即 `returns` true，允許導覽繼續進行：

<code-example path="router/src/app/auth/auth.guard.1.ts" header="src/app/auth/auth.guard.ts (excerpt)"></code-example>

接著，開啟 `admin-routing.module.ts `，匯入 `AuthGuard` 類別，並使用 `canActivate` 守衛屬性更新管理路由，該屬性會參照它：

<code-example path="router/src/app/admin/admin-routing.module.2.ts" header="src/app/admin/admin-routing.module.ts (guarded admin route)" region="admin-route"></code-example>

管理功能現在受到守衛的保護，儘管保護得很差。

{@a teach-auth}

#### 教 *AuthGuard* 進行驗證

讓 `AuthGuard` 至少假裝進行驗證。

`AuthGuard` 應該呼叫一個可以讓使用者登入並保留目前使用者資訊的應用程式服務。在 `auth` 資料夾中產生一個新的 `AuthService`：

<code-example language="none" class="code-shell">
  ng generate service auth/auth
</code-example>

更新 `AuthService` 以登入使用者：

<code-example path="router/src/app/auth/auth.service.ts" header="src/app/auth/auth.service.ts (excerpt)"></code-example>

雖然它並不真的登入，但它擁有本次討論所需的東西。
它有一個 `isLoggedIn` 旗標，告訴你使用者是否已驗證。
它的 `login` 方法透過傳回一個
在短暫停頓後成功解析的 observable，模擬對外部服務的 API 呼叫。
`redirectUrl` 屬性將存放嘗試的 URL，以便你在驗證後能導覽到它。

修訂 `AuthGuard` 來呼叫它。

<code-example path="router/src/app/auth/auth.guard.2.ts" header="src/app/auth/auth.guard.ts (v2)"></code-example>

請注意，你在建構子中*注入*了 `AuthService` 與 `Router`。
你還沒有提供 `AuthService`，但很高興知道你可以把有用的服務注入路由守衛中。

這個守衛會回傳一個同步的布林結果。
如果使用者已登入，它會回傳 true，導覽繼續進行。

`ActivatedRouteSnapshot` 包含將被啟用的_未來_路由，而 `RouterStateSnapshot`
包含應用程式的_未來_ `RouterState`，前提是你通過守衛檢查。

如果使用者未登入，你使用 `RouterStateSnapshot.url` 存放使用者來自的嘗試 URL，並
告訴路由器導覽到登入頁面&mdash;一個你還沒建立的頁面。
這個次要導覽會自動取消目前的導覽；`checkLogin()` 傳回
`false`，只是為了把這一點說清楚。

{@a add-login-component}

#### 加入 *LoginComponent*

你需要一個 `LoginComponent`，讓使用者登入應用程式。登入後，你將重新導向
到存放的 URL（如果有的話），或使用預設 URL。
這個元件以及你把它連接到路由器設定的方式，都沒有什麼新意。

<code-example language="none" class="code-shell">
  ng generate component auth/login
</code-example>

在 `auth/auth-routing.module.ts` 中註冊一個 `/login` 路由。在 `app.module.ts` 中，匯入 `AuthModule` 並把它加入 `AppModule` 的 imports。

<code-tabs>

  <code-pane header="src/app/app.module.ts" path="router/src/app/app.module.ts" region="auth">

  </code-pane>

  <code-pane header="src/app/auth/login/login.component.html" path="router/src/app/auth/login/login.component.html">

  </code-pane>

  <code-pane header="src/app/auth/login/login.component.ts" path="router/src/app/auth/login/login.component.1.ts">

  </code-pane>

  <code-pane header="src/app/auth/auth.module.ts" path="router/src/app/auth/auth.module.ts">

  </code-pane>

</code-tabs>

{@a can-activate-child-guard}

### _CanActivateChild_：守衛子路由

你也可以以 `CanActivateChild` 守衛保護子路由。
`CanActivateChild` 守衛與 `CanActivate` 守衛類似。
關鍵差異在於，它在任何子路由被啟用_之前_執行。

你已保護管理功能模組免於未經授權的存取。
你也應該保護功能模組_內部_的子路由。

擴充 `AuthGuard`，在 `admin` 路由之間導覽時提供保護。
開啟 `auth.guard.ts`，並將 `CanActivateChild` 介面加入從路由器套件匯入的權杖中。

接著，實作 `canActivateChild()` 方法，它接受與 `canActivate()` 方法相同的引數：
一個 `ActivatedRouteSnapshot` 與 `RouterStateSnapshot`。
`canActivateChild()` 方法可以為
非同步檢查傳回 `Observable<boolean>` 或 `Promise<boolean>`，並為同步檢查傳回 `boolean`。
這個方法傳回的是一個 `boolean`：

<code-example path="router/src/app/auth/auth.guard.3.ts" header="src/app/auth/auth.guard.ts (excerpt)" region="can-activate-child"></code-example>

將同一個 `AuthGuard` 加入 `component-less` 管理路由，一次保護所有其他子路由，
而不用把 `AuthGuard` 分別加入每條路由。

<code-example path="router/src/app/admin/admin-routing.module.3.ts" header="src/app/admin/admin-routing.module.ts (excerpt)" region="can-activate-child"></code-example>

{@a can-deactivate-guard}

### _CanDeactivate_：處理未儲存的變更
回到「Heroes」工作流程，應用程式毫不猶豫、也不驗證地立即接受對英雄的每一個變更。

在現實世界中，你可能必須累積使用者的變更。
你可能必須跨欄位驗證。
你可能必須在伺服器上驗證。
你可能必須把變更保持在待處理狀態，直到使用者*整組*確認它們，或
取消並還原所有變更。

當使用者導覽離開時，你如何處理未經核准、未儲存的變更？
你不能就這樣離開，冒著遺失使用者變更的風險；那將是非常糟糕的體驗。

更好的做法是暫停，讓使用者決定怎麼做。
如果使用者取消，你將留在原地，允許更多變更。
如果使用者核准，應用程式就可以儲存。

你仍然可能延遲導覽，直到儲存成功為止。
如果你讓使用者立即移到下一個畫面，
而儲存失敗（也許資料被判定為無效），你將遺失錯誤的脈絡。

你不能在等待伺服器時阻塞&mdash;那在瀏覽器中是不可能的。
你需要在等待時停止導覽，非同步地等待伺服器
帶著它的答案返回。

你需要 `CanDeactivate` 守衛。

{@a cancel-save}

#### 取消與儲存

範例應用程式不與伺服器對話。
幸運的是，你有另一種方法來示範非同步路由器鉤子。

使用者在 `CrisisDetailComponent` 中更新危機資訊。
與 `HeroDetailComponent` 不同，使用者的變更不會立即更新危機實體。
相反地，應用程式在使用者按下 *Save* 按鈕時更新實體，並
在使用者按下 *Cancel* 按鈕時捨棄變更。

兩個按鈕都會在儲存或取消後導覽回危機清單。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (cancel and save methods)" region="cancel-save"></code-example>

如果使用者在沒有儲存或取消的情況下試圖導覽離開，會怎樣？
使用者可能按下瀏覽器上一頁按鈕，或點擊 heroes 連結。
這兩個動作都會觸發導覽。
應用程式應該自動儲存還是取消？

這個示範兩者都不做。相反地，它要求使用者明確地做出選擇，
在一個確認對話框中，該對話框會*非同步地等待使用者的
答案*。

<div class="alert is-helpful">

你可以用同步、阻塞的程式碼等待使用者的答案。
應用程式將更具回應性&mdash;而且可以做其他工作&mdash;透過
非同步地等待使用者的答案。非同步地等待使用者
就像非同步地等待伺服器一樣。

</div>

產生一個 `Dialog` 服務來處理使用者確認。

<code-example language="none" class="code-shell">
  ng generate service dialog
</code-example>

為 `DialogService` 加入一個 `confirm()` 方法，提示使用者確認他們的意圖。`window.confirm` 是一個_阻塞_動作，它會顯示強制回應對話框，並等待使用者互動。

<code-example path="router/src/app/dialog.service.ts" header="src/app/dialog.service.ts"></code-example>

它傳回一個 `Observable`，當使用者最終決定要做什麼時*解析*：要麼
捨棄變更並導覽離開（`true`），要麼保留待處理的變更並留在危機編輯器中（`false`）。

{@a CanDeactivate}

產生一個_守衛_，檢查元件&mdash;任何元件&mdash;中是否存在 `canDeactivate()` 方法。

<code-example language="none" class="code-shell">
  ng generate guard can-deactivate
</code-example>

`CrisisDetailComponent` 將有這個方法。
但守衛不จำเป็นต้อง知道這一點。
守衛不應該知道任何元件的停用方法的細節。
它只需要偵測到該元件有 `canDeactivate()` 方法並呼叫它。
這種方法讓守衛可重複使用。

<code-example path="router/src/app/can-deactivate.guard.ts" header="src/app/can-deactivate.guard.ts"></code-example>

或者，你也可以為 `CrisisDetailComponent` 建立一個元件專屬的 `CanDeactivate` 守衛。
`canDeactivate()` 方法向你提供目前的
`component` 實例、目前的 `ActivatedRoute`，
以及 `RouterStateSnapshot`，以防你需要存取
某些外部資訊。如果你只想
把這個守衛用於這個元件，且需要取得
該元件的屬性，或確認路由器是否應該允許導覽離開它，這會很有用。

<code-example path="router/src/app/can-deactivate.guard.1.ts" header="src/app/can-deactivate.guard.ts (component-specific)"></code-example>

回頭看 `CrisisDetailComponent`，它實作了未儲存變更的確認工作流程。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (excerpt)" region="canDeactivate"></code-example>

請注意，`canDeactivate()` 方法*可以*同步傳回；
如果沒有危機，或者沒有待處理的變更，它立即傳回 `true`。
但它也可以傳回 `Promise` 或 `Observable`，路由器會等待它
解析為真值（導覽）或假值（留在原地）。

使用 `canDeactivate` 陣列屬性，將 `Guard` 加入 `crisis-center-routing.module.ts` 中的危機詳細資料路由。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.3.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (can deactivate guard)"></code-example>

現在你已為使用者提供了防範未儲存變更的保障。
{@a Resolve}

{@a resolve-guard}

### _Resolve_：預先擷取元件資料

在 `Hero Detail` 與 `Crisis Detail` 中，應用程式會等到路由被啟用後才擷取對應的英雄或危機。

這運作得很好，但有更好的方法。
如果你使用的是現實世界的 API，在要顯示的資料從伺服器傳回之前，可能會有一些延遲。
你不會希望在等待資料時顯示空白元件。

最好從伺服器預先擷取資料，讓它在
路由被啟用的那一刻就準備好。這也讓你能在路由到元件之前處理錯誤。
把使用者導覽到一個沒有記錄的 `id` 的危機詳細資料，是沒有意義的。
更好的做法是把使用者送回 `Crisis List`，那裡只顯示有效的危機中心。

總之，你希望延遲渲染被路由的元件，直到所有必要的資料都已擷取。

你需要一個*解析器*。

{@a fetch-before-navigating}

#### 在導覽之前擷取資料

目前，`CrisisDetailComponent` 負責擷取被選取的危機。
如果找不到該危機，它會導覽回危機清單檢視。

如果這一切都在路由被啟用之前先處理，體驗可能會更好。
`CrisisDetailResolver` 服務可以在啟用路由並建立 `CrisisDetailComponent` _之前_，
擷取 `Crisis`，或者在 `Crisis` 不存在時導覽離開。

在 `Crisis Center` 功能區內產生一個 `CrisisDetailResolver` 服務檔案。

<code-example language="none" class="code-shell">
  ng generate service crisis-center/crisis-detail-resolver
</code-example>

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.1.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts (generated)"></code-example>

把 `CrisisDetailComponent.ngOnInit` 中危機擷取邏輯的相關部分，
移到 `CrisisDetailResolverService` 中。
匯入 `Crisis` 模型、`CrisisService` 與 `Router`，
以便在你無法擷取危機時導覽到其他地方。

明確一點。以 `Crisis` 型別實作 `Resolve` 介面。

注入 `CrisisService` 與 `Router`，並實作 `resolve()` 方法。
該方法可以回傳 `Promise`、`Observable`，或同步的回傳值。

`CrisisService.getCrisis` 方法傳回一個 observable，以防止路由在資料擷取完成之前載入。
`Router` 守衛要求 observable `complete`，意思是它已經發出它的
所有值。你使用引數為 `1` 的 `take` 運算子，確保
Observable 在從 `getCrisis` 方法傳回的 Observable 擷取第一個值之後完成。

如果它沒有傳回有效的 `Crisis`，就傳回一個空的 `Observable`，取消先前進行中的、通往 `CrisisDetailComponent` 的導覽，並把使用者導覽回 `CrisisListComponent`。更新後的解析器服務看起來像這樣：

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts"></code-example>

在 `crisis-center-routing.module.ts` 中匯入這個解析器，
並把一個 `resolve` 物件加入 `CrisisDetailComponent` 路由設定。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.4.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (resolver)"></code-example>

`CrisisDetailComponent` 不應該再擷取危機。
把 `CrisisDetailComponent` 更新為改從 `ActivatedRoute.data.crisis` 屬性取得危機；
那就是你重新設定路由時所說它應該在的地方。
當 `CrisisDetailComponent` 要求它時，它將在那裡。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (ngOnInit v2)" region="ngOnInit"></code-example>

**兩個關鍵點**

1. 路由器的 `Resolve` 介面是選擇性的。
`CrisisDetailResolverService` 不繼承任何基底類別。
路由器會尋找該方法，如果找到了就呼叫它。

1. 倚賴路由器呼叫解析器。
不要擔心使用者可能導覽離開的所有方式。
那是路由器的工作。撰寫這個類別，讓路由器從那裡接手。

這個里程碑相關的 *Crisis Center* 程式碼如下。

<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.html">

  </code-pane>

  <code-pane header="crisis-center-home.component.html" path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html">

  </code-pane>

  <code-pane header="crisis-center.component.html" path="router/src/app/crisis-center/crisis-center/crisis-center.component.html">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.4.ts">

  </code-pane>

  <code-pane header="crisis-list.component.html" path="router/src/app/crisis-center/crisis-list/crisis-list.component.html">

  </code-pane>

  <code-pane header="crisis-list.component.ts" path="router/src/app/crisis-center/crisis-list/crisis-list.component.ts">

  </code-pane>

  <code-pane header="crisis-detail.component.html" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.html">

  </code-pane>

  <code-pane header="crisis-detail.component.ts" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts">

  </code-pane>

  <code-pane header="crisis-detail-resolver.service.ts" path="router/src/app/crisis-center/crisis-detail-resolver.service.ts">

  </code-pane>

  <code-pane header="crisis.service.ts" path="router/src/app/crisis-center/crisis.service.ts">

  </code-pane>

  <code-pane header="dialog.service.ts" path="router/src/app/dialog.service.ts">

  </code-pane>

</code-tabs>

守衛

<code-tabs>

  <code-pane header="auth.guard.ts" path="router/src/app/auth/auth.guard.3.ts">

  </code-pane>

  <code-pane header="can-deactivate.guard.ts" path="router/src/app/can-deactivate.guard.ts">

  </code-pane>

</code-tabs>

{@a query-parameters}

{@a fragment}

### 查詢參數與 fragment

在[路由參數](#optional-route-parameters)範例中，你只處理了專屬於
路由的參數，但如果你想要所有路由皆可用的選用參數，該怎麼辦？
這就是查詢參數發揮作用的地方。

[Fragment](https://en.wikipedia.org/wiki/Fragment_identifier) 指的是頁面上以 `id` 屬性識別的特定元素。

更新 `AuthGuard` 以提供一個在導覽至另一個路由後仍保留的 `session_id` 查詢。

加入一個 `anchor` 元素，讓你可以跳到頁面上的某個特定位置。

在導覽至 `/login` 路由的 `router.navigate()` 方法中加入 `NavigationExtras` 物件。

<code-example path="router/src/app/auth/auth.guard.4.ts" header="src/app/auth/auth.guard.ts (v3)"></code-example>

你也可以在導覽之間保留查詢參數與片段，而無需在導覽時
再次提供它們。在 `LoginComponent` 中，你將在
`router.navigateUrl()` 函式的第二個引數加入一個*物件*，
並提供 `queryParamsHandling` 與 `preserveFragment`，把目前的查詢參數
與片段傳遞到下一個路由。

<code-example path="router/src/app/auth/login/login.component.ts" header="src/app/auth/login/login.component.ts (preserve)" region="preserve"></code-example>

<div class="alert is-helpful">

`queryParamsHandling` 功能還提供一個 `merge` 選項，它將在導覽時
保留目前的查詢參數，並與任何提供的查詢參數合併。

</div>

由於你將在登入後導覽到 *Admin Dashboard* 路由，你將更新它來處理
查詢參數與片段。

<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (v2)"></code-example>

*查詢參數*與*片段*也可以透過 `ActivatedRoute` 服務取得。
就像*路由參數*一樣，查詢參數與片段以 `Observable` 的形式提供。
更新後的 *Crisis Admin* 元件使用 `AsyncPipe`，把 `Observable` 直接餵給範本。

現在，你可以點擊 *Admin* 按鈕，它會帶著提供的 `queryParamMap` 與 `fragment`，把你帶到 *Login*
頁面。點擊登入按鈕後，請注意，
你已被重新導向到 `Admin Dashboard` 頁面，而查詢參數與片段在網址列中仍然完好無損。

你可以使用這些持續性的資訊片段，來處理需要在頁面之間提供的事物，例如
驗證權杖或工作階段 id。

<div class="alert is-helpful">

`query params` 與 `fragment` 也可以分別使用帶有 `queryParamsHandling` 與 `preserveFragment` 繫結的 `RouterLink` 來保留。

</div>

{@a asynchronous-routing}

## 里程碑 6：非同步路由

隨著你逐步完成各個里程碑，應用程式自然變得更大了。
隨著你繼續建置功能區域，應用程式的整體大小將持續增長。
在某個時刻，你會到達一個臨界點，應用程式需要很長時間才能載入。

你如何對抗這個問題？以非同步路由，它會_延遲_載入功能模組，依請求載入。
延遲載入有多種好處。

* 你可以只在使用者要求時載入功能區。
* 你可以為只造訪應用程式特定區域的使用者加快載入時間。
* 你可以持續擴充延遲載入的功能區，而不會增加初始載入套件的大小。

你已經完成了一部分。
透過將應用程式組織成模組&mdash;`AppModule`、`HeroesModule`、`AdminModule` 與 `CrisisCenterModule`&mdash;你就有了延遲載入的天然候選者。

有些模組，例如 `AppModule`，必須從一開始就載入。
但其他模組可以而且應該延遲載入。
例如 `AdminModule` 只有少數授權使用者需要，因此你應該只在合適的人要求時才載入它。

{@a lazy-loading-route-config}

### 延遲載入路由設定

把 `admin-routing.module.ts` 中的 `admin` **path** 從 `'admin'` 改為空字串 `''`，即_空路徑_。

`Router` 支援*空路徑*路由；
用它們把路由分組在一起，而不為 URL 加入任何額外的路徑區段。
使用者仍將造訪 `/admin`，`AdminComponent` 仍充當包含子路由的*路由元件*。

開啟 `AppRoutingModule`，並在其 `appRoutes` 陣列中加入一個新的 `admin` 路由。

給它一個 `loadChildren` 屬性，而不是 `children` 屬性。
`loadChildren` 屬性接受一個函式，該函式會使用瀏覽器內建的延遲載入程式碼語法（動態匯入 `import('...')`）回傳一個 promise。
路徑是 `AdminModule` 的位置（相對於應用程式根目錄）。
在程式碼被要求並載入後，`Promise` 會解析為一個包含 `NgModule` 的物件，在這個例子中就是 `AdminModule`。

<code-example path="router/src/app/app-routing.module.5.ts" region="admin-1" header="app-routing.module.ts (load children)"></code-example>

<div class="alert is-important">

*注意*：使用絕對路徑時，`NgModule` 檔案位置必須以 `src/app` 開頭，才能正確解析。對於使用絕對路徑的自訂[路徑對應](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)，專案 `tsconfig.json` 中的 `baseUrl` 與 `paths` 屬性必須設定。

</div>

當路由器導覽至這個路由時，它會使用 `loadChildren` 字串動態載入 `AdminModule`。
接著它會把 `AdminModule` 的路由加入目前的路由設定。
最後，它會載入要求的目的地管理元件的路由。

延遲載入與重新設定只發生一次，在路由_第一次_被請求時；
該模組與路由在後續請求中即可立即使用。

<div class="alert is-helpful">

Angular 提供了一個內建的模組載入器，支援 SystemJS 以非同步方式載入模組。如果你使用的是其他打包工具（例如 Webpack），你會使用 Webpack 的機制來非同步載入模組。

</div>

最後一步，把管理功能集從主應用程式中分離。
根 `AppModule` 既不應載入也不應參照 `AdminModule` 或其檔案。

在 `app.module.ts` 中，從檔案頂部移除 `AdminModule` 的匯入陳述式，並從 NgModule 的 `imports` 陣列中移除 `AdminModule`。

{@a can-load-guard}

### _CanLoad_ 守衛：守衛功能模組的未授權載入

你已經以 `CanActivate` 守衛保護 `AdminModule`，防止未授權使用者
存取管理功能區域。
如果使用者未獲授權，它會重新導向到登入頁面。

但是，即使使用者無法造訪其任何元件，路由器仍在載入 `AdminModule`。
理想情況下，只有在使用者登入時才載入 `AdminModule`。

加入一個 **`CanLoad`** 守衛，只有在使用者已登入_且_嘗試存取管理功能區域時，才載入 `AdminModule`。

既有的 `AuthGuard` 在其
`checkLogin()` 方法中已具備支援 `CanLoad` 守衛所必需的邏輯。

開啟 `auth.guard.ts`。
從 `@angular/router` 匯入 `CanLoad` 介面。
把它加入 `AuthGuard` 類別的 `implements` 清單。
接著依下列方式實作 `canLoad()`：

<code-example path="router/src/app/auth/auth.guard.ts" header="src/app/auth/auth.guard.ts (CanLoad guard)" region="canLoad"></code-example>

路由器會把 `canLoad()` 方法的 `route` 參數設定為預定的目的地 URL。
`checkLogin()` 方法會在使用者登入後重新導向至該 URL。

現在把 `AuthGuard` 匯入 `AppRoutingModule`，並將 `AuthGuard` 加入 `admin` 路由的 `canLoad` 陣列屬性。
完成後的管理路由如下所示：

<code-example path="router/src/app/app-routing.module.5.ts" region="admin" header="app-routing.module.ts (lazy admin route)"></code-example>

{@a preloading}

### 預先載入：在背景載入功能區域
你已經學會如何依需求載入模組。
你也可以以_預先載入_的方式非同步載入模組。

這可能看起來像應用程式一直以來的做法。不完全是。
`AppModule` 在應用程式啟動時載入；那是_即時_載入。
現在 `AdminModule` 只有在使用者點擊連結時才載入；那是_延遲_載入。

_預先載入_介於兩者之間。
想想 _Crisis Center_。
它不是使用者看到的第一個檢視。
依預設，_Heroes_ 是第一個檢視。
為了最小的初始酬載與最快的啟動時間，
你應該即時載入 `AppModule` 與 `HeroesModule`。

你可以延遲載入 _Crisis Center_。
但你幾乎可以確定，使用者會在啟動應用程式後的幾分鐘內造訪 _Crisis Center_。
理想情況下，應用程式啟動時只載入 `AppModule` 與 `HeroesModule`，
然後幾乎立即在背景載入 `CrisisCenterModule`。
當使用者導覽到 _Crisis Center_ 時，其模組將已經載入並準備就緒。

那就是_預先載入_。

{@a how-preloading}

#### 預先載入如何運作

在每次_成功_導覽之後，路由器會在它的設定中尋找它可以預先載入的未載入模組。
它是否預先載入某個模組，以及它預先載入哪些模組，取決於*預先載入策略*。

 `Router` 開箱即提供兩種預先載入策略：

* 完全不預先載入，這是預設值。延遲載入的功能區域仍然依需求載入。
* 預先載入所有延遲載入的功能區域。

開箱即用地，路由器要麼永遠不預先載入，要麼預先載入每個延遲載入模組。
`Router` 也支援[自訂預先載入策略](#custom-preloading)，以
精細控制要預先載入哪些模組以及何時預先載入。

在下一節中，你將更新 `CrisisCenterModule`，讓它依預設
延遲載入，並使用 `PreloadAllModules` 策略，
讓它（以及_所有其他_延遲載入模組）盡快載入。

{@a lazy-load-crisis-center}

#### 延遲載入*危機中心*

更新路由設定，以延遲載入 `CrisisCenterModule`。
採取你用來為延遲載入設定 `AdminModule` 的相同步驟。

1. 把 `CrisisCenterRoutingModule` 中的 `crisis-center` 路徑改為空字串。

1. 在 `AppRoutingModule` 中加入一個 `crisis-center` 路由。

1. 將 `loadChildren` 字串設為載入 `CrisisCenterModule`。

1. 從 `app.module.ts` 中移除所有提及 `CrisisCenterModule` 的內容。

以下是在_啟用預先載入之前_更新後的模組：

<code-tabs>

  <code-pane header="app.module.ts" path="router/src/app/app.module.ts" region="preload">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.6.ts" region="preload-v1">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.ts">

  </code-pane>

</code-tabs>

你現在可以試試看，確認 `CrisisCenterModule` 會在你點選「Crisis Center」按鈕後載入。

若要啟用所有延遲載入模組的預先載入，請從 Angular 路由器套件匯入 `PreloadAllModules` 權杖。

`RouterModule.forRoot()` 方法的第二個引數接受一個用於額外設定選項的物件。
`preloadingStrategy` 是其中一個選項。
將 `PreloadAllModules` 權杖加入 `forRoot()` 呼叫：

<code-example path="router/src/app/app-routing.module.6.ts" header="src/app/app-routing.module.ts (preload all)" region="forRoot"></code-example>

這告訴 `Router` 預先載入器立即載入_所有_延遲載入路由（帶有 `loadChildren` 屬性的路由）。

當你造訪 `http://localhost:4200` 時，`/heroes` 路由在啟動時立即載入，
而且路由器在 `HeroesModule` 載入後立即開始載入 `CrisisCenterModule`。

令人驚訝的是，`AdminModule` *沒有*預先載入。有什麼東西在阻擋它。

{@a preload-canload}

#### CanLoad 阻擋預先載入

`PreloadAllModules` 策略不會載入受到 [CanLoad](#can-load-guard) 守衛保護的功能區域。
這是刻意設計的。

你在幾步之前，為 `AdminModule` 中的路由加入了一個 `CanLoad` 守衛，
以阻擋該模組的載入，直到使用者獲得授權為止。
該 `CanLoad` 守衛的優先級高於預先載入策略。

如果你想預先載入一個模組_並且_防範未授權存取，
就放棄 `canLoad()` 守衛方法，只倚賴 [canActivate()](#can-activate-guard) 守衛。

{@a custom-preloading}

### 自訂預先載入策略

在許多情況下，預先載入每個延遲載入模組都運作得很好，
但它並不總是正確的選擇，尤其是在行動裝置上與低頻寬連線時。
你可能選擇只預先載入某些功能模組，基於使用者指標以及其他業務與技術因素。

你可以用自訂的預先載入策略，控制路由器預先載入什麼以及如何預先載入。

在這一節中，你將加入一個自訂策略，它_只_預先載入其 `data.preload` 旗標被設為 `true` 的路由。
回想一下，你可以把任何東西加入路由的 `data` 屬性。

在 `AppRoutingModule` 的 `crisis-center` 路由中設定 `data.preload` 旗標。

<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (route data preload)" region="preload-v2"></code-example>

產生一個新的 `SelectivePreloadingStrategy` 服務。

<code-example language="none" class="code-shell">
  ng generate service selective-preloading-strategy
</code-example>

<code-example path="router/src/app/selective-preloading-strategy.service.ts" header="src/app/selective-preloading-strategy.service.ts (excerpt)"></code-example>

`SelectivePreloadingStrategyService` 實作了 `PreloadingStrategy`，它有一個方法 `preload`。

路由器以兩個引數呼叫 `preload` 方法：

1. 要考慮的路由。
1. 一個可以非同步載入被路由模組的載入器函式。

`preload` 的實作必須傳回一個 `Observable`。
如果該路由應該預先載入，它傳回呼叫載入器函式所傳回的 observable。
如果該路由_不應該_預先載入，它傳回一個 `null` 的 `Observable`。

在本範例中， `preload` 方法在路由的 `data.preload` 旗標為真值時載入該路由。

它也有一個副作用。
`SelectivePreloadingStrategyService` 把被選取路由的 `path` 記錄在其公開的 `preloadedModules` 陣列中。

很快地，你會擴充 `AdminDashboardComponent`，注入這個服務並顯示其 `preloadedModules` 陣列。

但首先，對 `AppRoutingModule` 做幾處變更。

1. 把 `SelectivePreloadingStrategyService` 匯入 `AppRoutingModule`。
1. 在對 `forRoot()` 的呼叫中，把 `PreloadAllModules` 策略換成這個 `SelectivePreloadingStrategyService`。
1. 把 `SelectivePreloadingStrategyService` 策略加入 `AppRoutingModule` 的 providers 陣列，讓它可以注入
應用程式的其他地方。

現在編輯 `AdminDashboardComponent`，顯示預先載入路由的記錄。

1. 匯入 `SelectivePreloadingStrategyService`。
1. 將它注入儀表板的建構子。
1. 更新範本，顯示策略服務的 `preloadedModules` 陣列。

完成後看起來像這樣。

<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (preloaded modules)"></code-example>

應用程式載入初始路由後，`CrisisCenterModule` 就被預先載入了。
透過登入 `Admin` 功能區域，並注意到 `crisis-center` 列在 `Preloaded Modules` 中，來驗證這一點。
它也會記錄到瀏覽器的主控台。

{@a redirect-advanced}

## 以重新導向遷移 URL

你已經設定好在應用程式各處導覽的路由。你以命令式與宣告式方式導覽到許多不同的路由。但就像任何應用程式一樣，需求會隨時間而改變。你已從 `HeroListComponent` 與 `HeroDetailComponent` 元件設定了通往 `/heroes` 與 `/hero/:id` 的連結與導覽。如果有一項要求是讓通往 `heroes` 的連結變成 `superheroes`，你仍希望先前的 URL 能正確導覽。你也不想去更新應用程式中的每個連結，所以重新導向讓重構路由變得輕而易舉。

{@a url-refactor}

### 把 /heroes 變更為 /superheroes

讓我們把 `Hero` 路由遷移到新的 URL。`Router` 在導覽之前會在你的設定中檢查重新導向，所以每個重新導向都會在需要時觸發。為了支援這項變更，你將在 `heroes-routing.module` 中加入從舊路由到新路由的重新導向。

<code-example path="router/src/app/heroes/heroes-routing.module.ts" header="src/app/heroes/heroes-routing.module.ts (heroes redirects)"></code-example>

你會注意到兩種不同型別的重新導向。第一個變更是從 `/heroes` 到 `/superheroes`，沒有任何參數。這是一個直接的重新導向，不像從 `/hero/:id` 到 `/superhero/:id` 的變更，它包含 `:id` 路由參數。Router 重新導向也使用強大的模式比對，所以 `Router` 會檢查 URL，並把 `path` 中的路由參數換成它們適當的目的地。以前，你導覽到像 `/hero/15` 這樣的 URL，其中路由參數 `id` 為 `15`。

<div class="alert is-helpful">

`Router` 在使用重新導向時也支援[查詢參數](#query-parameters)與 [fragment](#fragment)。

* 使用絕對重新導向時，`Router` 將使用路由設定中 redirectTo 的查詢參數與片段。
* 使用相對重新導向時，`Router` 使用來源 URL 的查詢參數與片段。

</div>

在更新 `app-routing.module.ts` 之前，你需要考慮一條重要的規則。目前，我們的空路徑路由重新導向到 `/heroes`，而 `/heroes` 又重新導向到 `/superheroes`。這_不會_運作，而且是刻意設計的，因為 `Router` 在路由設定的每個層級只處理一次重新導向。這能防止重新導向鏈結，那可能導致無止境的重新導向迴圈。

所以，你將改為更新 `app-routing.module.ts` 中的空路徑路由，讓它重新導向到 `/superheroes`。

<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (superheroes redirect)"></code-example>

`RouterLink` 與路由設定無關，所以你需要更新相關聯的路由連結，讓它們在新路由處於作用中時保持作用中。你將更新 `/heroes` routerLink 的 `app.component.ts` 範本。

<code-example path="router/src/app/app.component.html" header="src/app/app.component.html (superheroes active routerLink)"></code-example>

更新 `hero-detail.component.ts` 中的 `goToHeroes()` 方法，讓它以選擇性路由參數導覽回 `/superheroes`。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.ts" region="redirect" header="src/app/heroes/hero-detail/hero-detail.component.ts (goToHeroes)"></code-example>

重新導向設定完成後，所有先前的路由現在都指向它們的新目的地，兩個 URL 都仍如預期般運作。

{@a inspect-config}

## 檢視路由器的設定

你花了很多精力在幾個路由模組檔案中設定路由器，
並小心地以[適當的順序](#routing-module-order)列出它們。
路由真的如你計畫的那樣被評估嗎？
路由器到底是如何設定的？

你可以隨時透過注入路由器並
檢查它的 `config` 屬性，來檢視路由器目前的設定。
例如，如下更新 `AppModule`，並查看瀏覽器主控台視窗，
以查看完成的路由設定。

<code-example path="router/src/app/app.module.7.ts" header="src/app/app.module.ts (inspect the router config)" region="inspect-config"></code-example>

{@a final-app}

## 回顧與最終應用程式

你在本指南中涵蓋了很多內容，而這個應用程式太大，無法在這裡重新列印。
請造訪 <live-example title="Router Sample in Stackblitz"></live-example>，
你可以在那裡下載最終的原始碼。

{@a appendices}

## 附錄

本指南的其餘部分是一組附錄，
詳細闡述你在上面快速涵蓋的一些要點。

附錄材料不是必需的。繼續閱讀是為了好奇的人。

{@a link-parameters-array}

### 附錄：連結參數陣列

連結參數陣列包含路由導覽所需的下列要素：

* 通往目標元件之路由的*路徑*。
* 進入路由 URL 的必要與選用路由參數。

把 `RouterLink` 指令繫結到這樣的陣列，如下所示：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (h-anchor)" region="h-anchor"></code-example>

你在像這樣指定路由參數時，撰寫了一個兩元素陣列：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (nav-to-detail)" region="nav-to-detail"></code-example>

你可以像這樣在物件中提供選用路由參數：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (cc-query-params)" region="cc-query-params"></code-example>

這三個範例涵蓋了具有單層路由的應用程式的需求。
一旦你加入子路由器（例如危機中心），你就創造了新的連結陣列可能性。

回想一下，你為危機中心指定了一個預設子路由，所以這個簡單的 `RouterLink` 沒問題。

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (cc-anchor-w-default)" region="cc-anchor-w-default"></code-example>

把它解析出來。

* 陣列的第一項識別父路由（`/crisis-center`）。
* 這個父路由沒有參數，所以你完成了它。
* 子路由沒有預設值，所以你需要選一個。
* 你正在導覽到 `CrisisListComponent`，其路由路徑是 `/`，但你不需要明確加入斜線。
* 瞧！`['/crisis-center']`。

再進一步。考慮下面這個路由連結，它
從應用程式的根導覽到 *Dragon Crisis*：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (Dragon-anchor)" region="Dragon-anchor"></code-example>

* 陣列的第一項識別父路由（`/crisis-center`）。
* 這個父路由沒有參數，所以你完成了它。
* 第二項識別關於特定危機的子路由詳細資料（`/:id`）。
* 詳細資料子路由需要一個 `id` 路由參數。
* 你把 *Dragon Crisis* 的 `id` 作為陣列的第二項加入（`1`）。
* 由此產生的路徑是 `/crisis-center/1`。

如果你想，你可以專門以 *Crisis Center* 路由重新定義 `AppComponent` 範本：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (template)" region="template"></code-example>

總之，你可以撰寫具有一層、兩層或更多層路由的應用程式。
連結參數陣列提供了靈活性，可以表示任何路由深度，以及
路由路徑、（必要）路由器參數與（選用）路由參數物件的任何合法序列。

{@a browser-url-styles}

{@a location-strategy}

### 附錄：*LocationStrategy* 與瀏覽器 URL 樣式

當路由器導覽到新的元件檢視時，它會以該檢視的 URL
更新瀏覽器的位置與歷史。
這是嚴格的本機 URL。瀏覽器不應該把這個 URL 傳送到伺服器，
也不應該重新載入頁面。

現代 HTML5 瀏覽器支援
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState</a>，
這是一種在不觸發伺服器頁面請求的情況下，變更瀏覽器位置與歷史的技術。
路由器可以組裝一個「自然」URL，與
原本需要載入頁面的 URL 無法區分。

這是「HTML5 pushState」樣式的 *Crisis Center* URL：

<code-example format="nocode">
  localhost:3002/crisis-center/

</code-example>

較舊的瀏覽器在位置 URL 變更時會向伺服器傳送頁面請求，
_除非_該變更發生在「#」之後（稱為「hash」）。
路由器可以利用這個例外，以 hash 組裝應用程式內路由
URL。這是一個路由到 *Crisis Center* 的「hash URL」。

<code-example format="nocode">
  localhost:3002/src/#/crisis-center/

</code-example>

路由透過兩個 `LocationStrategy` 提供者支援這兩種樣式：

1. `PathLocationStrategy`&mdash;預設的 "HTML5 pushState" 風格。
1. `HashLocationStrategy`&mdash;"雜湊 URL" 風格。

`RouterModule.forRoot()` 函式把 `LocationStrategy` 設為 `PathLocationStrategy`，
使它成為預設策略。
如果你偏好它，你可以在啟動過程中以覆寫的方式切換到 `HashLocationStrategy`。

<div class="alert is-helpful">

在 [Dependency Injection 指南](guide/dependency-injection#bootstrap)中了解提供者與啟動過程。

</div>

#### 哪種策略最好？

你必須選擇一種策略，而且你需要在專案早期做出正確的決定。
一旦應用程式進入生產環境，
且外界有大量的應用程式 URL 參照，之後就不容易更改了。

幾乎所有 Angular 專案都應該使用預設的 HTML5 樣式。
它產生的 URL 對使用者而言更容易理解。
而且它保留了日後進行_伺服器端渲染_的選項。

在伺服器上渲染關鍵頁面，是一種可以大幅改善
應用程式第一次載入時感知回應速度的技術。
一個原本需要十秒以上才能啟動的應用程式，
可以在伺服器上渲染，並傳送到使用者的裝置，
在不到一秒的時間內完成。

這個選項只有在應用程式 URL 看起來像一般 Web URL（
中間沒有 hash（#））時才可用。

堅持使用預設值，除非你有令人信服的理由
改用 hash 路由。

#### *&lt;base href>*

路由器使用瀏覽器的
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState</a>
進行導覽。歸功於 `pushState`，你可以讓應用程式內 URL 路徑看起來像你想要的
樣子，例如 `localhost:4200/crisis-center`。應用程式內 URL 可以與伺服器 URL 無法區分。

現代 HTML5 瀏覽器是最早支援 `pushState` 的，這就是為什麼許多人把這些 URL 稱為
「HTML5 樣式」URL。

<div class="alert is-helpful">

HTML5 樣式導覽是路由器的預設值。
在 [LocationStrategy 與瀏覽器 URL 樣式](#browser-url-styles) 附錄中，
了解為什麼 HTML5 樣式受到偏好、如何調整它的行為，以及如何切換到
較舊的 hash（#）樣式（如果有必要的話）。

</div>

你必須把一個
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">&lt;base href&gt; 元素</a>**
加入應用程式的 `index.html`，`pushState` 路由才能運作。
瀏覽器使用 `<base href>` 值，為參照
CSS 檔案、指令碼與圖片時的*相對* URL 加上前綴。

把 `<base>` 元素加在 `<head>` 標籤之後。
如果 `app` 資料夾是應用程式根目錄，如同這個應用程式，
請在 **`index.html`** 中*完全*依照這裡所示設定 `href` 值。

<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>

#### HTML5 URL 與 *&lt;base href>*

雖然路由器依預設使用
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="Browser history push-state">HTML5 pushState</a>
樣式，但你*必須*以 **base href** 設定該策略。

設定該策略的偏好方式，是把一個
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">&lt;base href&gt; 元素</a>
標籤加入 `index.html` 的 `<head>` 中。

<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>

如果沒有該標籤，當「深層連結」進入應用程式時，瀏覽器可能無法載入資源
（圖片、CSS、指令碼）。
當有人把應用程式連結貼到
瀏覽器的網址列，或點擊電子郵件中的這類連結時，可能會發生壞事。

有些開發者可能無法加入 `<base>` 元素，或許是因為他們沒有
存取 `<head>` 或 `index.html` 的權限。

那些開發者仍然可以採取兩個補救步驟來使用 HTML5 URL：

1. 為路由器提供適當的 [APP_BASE_HREF][] 值。
1. 對所有 Web 資源使用_根 URL_：CSS、圖片、指令碼與範本 HTML 檔案。

{@a hashlocationstrategy}

#### *HashLocationStrategy*

你可以透過在 `AppModule` 中，
在 `RouterModule.forRoot()` 的第二個引數以物件形式提供 `useHash: true`，
以老派的方式使用 `HashLocationStrategy`。

<code-example path="router/src/app/app.module.6.ts" header="src/app/app.module.ts (hash URL strategy)"></code-example>
