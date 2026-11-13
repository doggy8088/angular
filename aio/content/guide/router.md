# 應用程式內導覽：路由至檢視

在單頁應用程式中，你透過顯示或隱藏與特定元件對應的畫面部分，來改變使用者看到的內容，而不是到伺服器去取得新頁面。
當使用者執行應用程式的各項工作時，他們需要在你定義的不同[檢視](guide/glossary#view "Definition of view")之間移動。若要在你的應用程式的單一頁面內實現這類導覽，你會使用 Angular 的 **`Router`**。

若要處理從一個[檢視](guide/glossary#view)到下一個檢視的導覽，你會使用 Angular _router_。
_router_ 會將瀏覽器 URL 解讀為改變檢視的指令，從而實現導覽。

若要探索包含路由器主要功能的範例應用程式，請參閱 <live-example></live-example>。

## 先決條件

在建立路由之前，你應該熟悉下列內容：

* [元件基礎](guide/architecture-components)
* [範本基礎](guide/glossary#template)
* 一個 Angular 應用程式&mdash;你可以使用 [Angular CLI](cli) 產生一個基本的 Angular 應用程式。

如需透過現成的應用程式認識 Angular，請參閱[入門](start)。
如需更深入地體驗建構 Angular 應用程式，請參閱[英雄之旅](tutorial)教學。兩者都會引導你使用元件類別與範本。

<hr />

{@a basics}
## 產生啟用路由的應用程式

下列指令使用 Angular CLI 產生一個基本的 Angular 應用程式，其中包含一個應用程式路由模組 `AppRoutingModule`，這是一個 NgModule，你可以在其中設定路由。
下列範例中的應用程式名稱是 `routing-app`。

<code-example language="none" class="code-shell">
  ng new routing-app --routing
</code-example>

產生新的應用程式時，CLI 會提示你選擇 CSS 或 CSS 預處理器。
在這個範例中，接受預設的 `CSS`。

### 為路由新增元件

若要使用 Angular 路由器，應用程式至少需要兩個元件，才能從一個導覽到另一個。若要用 CLI 建立元件，請在命令列輸入以下內容，其中 `first` 是你的元件名稱：

<code-example language="none" class="code-shell">
  ng generate component first
</code-example>

對第二個元件重複這個步驟，但給它一個不同的名稱。
這裡的新名稱是 `second`。

<code-example language="none" class="code-shell">
  ng generate component second
</code-example>

CLI 會自動附加 `Component`，所以如果你寫的是 `first-component`，你的元件就會是 `FirstComponentComponent`。

{@a basics-base-href}

<div class="alert is-helpful">

  #### `<base href>`

  本指南適用於以 CLI 產生的 Angular 應用程式。
  如果你是手動建立，請確認你的 index.html 檔案的 `<head>` 中有 `<base href="/">`。
  這裡假設 `app` 資料夾是應用程式根目錄，並使用 `"/"`。

  </code-example>

</div>

### 匯入你的新元件

若要使用你的新元件，請在檔案頂部將它們匯入 `AppRoutingModule`，如下所示：

<code-example header="AppRoutingModule (excerpt)">

import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';

</code-example>

{@a basic-route}

## 定義基本路由

建立一條路由有三個基本組成部分。

把 `AppRoutingModule` 匯入 `AppModule`，並加入 `imports` 陣列。

Angular CLI 會替你執行這個步驟。
不過，如果你是手動建立應用程式，或是使用現有的非 CLI 應用程式，請確認匯入與設定都正確。
以下是使用 CLI 加上 `--routing` 旗標時預設的 `AppModule`。

  <code-example path="router/src/app/app.module.8.ts" header="Default CLI AppModule with routing">

  </code-example>

  1. 把 `RouterModule` 與 `Routes` 匯入你的路由模組。

  Angular CLI 會自動執行這個步驟。
  CLI 也會為你的路由建立一個 `Routes` 陣列，並為 `@NgModule()` 設定 `imports` 與 `exports` 陣列。

  <code-example path="router/src/app/app-routing.module.7.ts" header="CLI app routing module">

  </code-example>

1. 在你的 `Routes` 陣列中定義路由。

  這個陣列中的每條路由都是一個包含兩個屬性的 JavaScript 物件。
  第一個屬性 `path` 定義路由的 URL 路徑。
  第二個屬性 `component` 定義 Angular 應為對應路徑使用的元件。

  <code-example path="router/src/app/app-routing.module.8.ts" region="routes" header="AppRoutingModule (excerpt)">

  </code-example>

  1. 把你的路由加入應用程式。

  定義好路由後，將它們加入你的應用程式。
  首先，為這兩個元件加入連結。
  把你想加入路由的錨點標籤指定給 `routerLink` 屬性。
  將屬性值設為使用者點選每個連結時要顯示的元件。
  接著，更新你的元件範本，加入 `<router-outlet>`。
  這個元素會告訴 Angular 以所選路由的元件更新應用程式檢視。

  <code-example path="router/src/app/app.component.7.html" header="Template with routerLink and router-outlet"></code-example>

{@a route-order}

### 路由順序

路由的順序很重要，因為 `Router` 在比對路由時使用先匹配先贏（first-match wins）策略，所以較具體的路由應放在較不具體的路由之前。
先列出靜態路徑的路由，接著是符合預設路由的空路徑路由。
[萬用字元路由](guide/router#設定萬用字元路由)放在最後，因為它符合每個 URL，且 `Router` 只在沒有其他路由先符合時才會選擇它。

{@a activated-route}

## 取得路由資訊

使用者在應用程式中導覽時，你常會想把資訊從一個元件傳遞到另一個元件。
例如，假設有一個顯示雜貨購物清單的應用程式。
清單中的每個項目都有唯一的 `id`。
若要編輯某個項目，使用者會點選 Edit 按鈕，開啟 `EditGroceryItem` 元件。
你希望這個元件能取得該雜貨項目的 `id`，以便向使用者顯示正確的資訊。

可以使用路由把這類資訊傳遞給應用程式的元件。
做法是使用 [ActivatedRoute](api/router/ActivatedRoute) 介面。

若要從路由取得資訊：

  1. 將 `ActivatedRoute` 與 `ParamMap` 匯入你的元件。

    <code-example path="router/src/app/heroes/hero-detail/hero-detail.component.ts" region="imports-route-info" header="In the component class (excerpt)">
    </code-example>

    這些 `import` 陳述式為你的元件加入了數個重要元素。
    若要深入了解每個元素，請參閱下列 API 頁面：

      * [`Router`](api/router)
      * [`ActivatedRoute`](api/router/ActivatedRoute)
      * [`ParamMap`](api/router/ParamMap)

  1. 將 `ActivatedRoute` 加入應用程式的建構子，以注入它的一個執行個體：

    <code-example path="router/src/app/heroes/hero-detail/hero-detail.component.ts" region="activated-route" header="In the component class (excerpt)">
    </code-example>

  1. 更新 `ngOnInit()` 方法，以存取 `ActivatedRoute` 並追蹤 `id` 參數：

      <code-example header="In the component (excerpt)">
        ngOnInit() {
          this.route.queryParams.subscribe(params => {
            this.name = params['name'];
          });
        }
      </code-example>

    注意：前面的範例使用了一個變數 `name`，並根據 `name` 參數為它指派值。

{@a wildcard-route-how-to}

## 設定萬用字元路由

運作良好的應用程式應該要能妥善處理使用者嘗試導覽到應用程式中不存在的部分。
若要為你的應用程式加入這項功能，你需要設定萬用字元路由。
只要請求的 URL 不符合任何路由器路徑，Angular 路由器就會選擇這條路由。

若要設定萬用字元路由，請將下列程式碼加入你的 `routes` 定義。

<code-example header="AppRoutingModule (excerpt)">

{ path: '**', component: <component-name> }

</code-example>

兩個星號 `**` 向 Angular 表明這個 `routes` 定義是一條萬用字元路由。
對於 `component` 屬性，你可以定義應用程式中的任何元件。
常見的選擇包括應用程式專屬的 `PageNotFoundComponent`，你可以定義它來向使用者[顯示 404 頁面](guide/router#404-page-how-to)；或是重新導向到應用程式的主要元件。
萬用字元路由是最後一條路由，因為它符合任何 URL。
關於路由順序為何重要，詳情請參閱[路由順序](guide/router#route-order)。

{@a 404-page-how-to}

## 顯示 404 頁面

若要顯示 404 頁面，請設定一條[萬用字元路由](guide/router#wildcard-route-how-to)，並把 `component` 屬性設為你想用於 404 頁面的元件，如下所示：

<code-example path="router/src/app/app-routing.module.8.ts" region="routes-with-wildcard" header="AppRoutingModule (excerpt)">

</code-example>

最後一條 `path` 為 `**` 的路由是萬用字元路由。
若請求的 URL 與清單中較前面的任何路徑都不符，路由會選取這條路由，並把使用者送往 `PageNotFoundComponent`。

## 設定重新導向

若要設定重新導向，請設定一條路由，包含你想從其重新導向的 `path`、你想重新導向到的 `component`，以及一個告訴路由器如何比對 URL 的 `pathMatch` 值。

<code-example path="router/src/app/app-routing.module.8.ts" region="redirect" header="AppRoutingModule (excerpt)">

</code-example>

在這個範例中，第三條路由是重新導向，讓路由器預設使用 `first-component` 路由。
請注意，這個重新導向排在萬用字元路由之前。
這裡的 `path: ''` 表示使用初始的相對 URL（`''`）。

關於 `pathMatch` 的更多細節，請參閱[`pathMatch` 聚光燈](guide/router#pathmatch)。

{@a nesting-routes}

## 巢狀路由

隨著應用程式愈來愈複雜，你可能想建立相對於根元件以外其他元件的路由。
這類巢狀路由稱為子路由。
這表示你要在應用程式中再加入第二個 `<router-outlet>`，因為它是在 `AppComponent` 的 `<router-outlet>` 之外額外增加的。

在這個範例中，有兩個額外的子元件：`child-a` 與 `child-b`。
這裡，`FirstComponent` 有自己的 `<nav>`，以及除了 `AppComponent` 中那個之外的第二個 `<router-outlet>`。

<code-example path="router/src/app/app.component.8.html" region="child-routes" header="In the template">

</code-example>

子路由與其他路由一樣，都需要 `path` 與 `component`。
唯一的差別是，子路由要放在父路由內的 `children` 陣列中。

<code-example path="router/src/app/app-routing.module.9.ts" region="child-routes" header="AppRoutingModule (excerpt)">

</code-example>

{@a using-relative-paths}

## 使用相對路徑

相對路徑讓你定義相對於目前 URL 區段的路徑。
下列範例顯示通往另一個元件 `second-component` 的相對路由。
`FirstComponent` 與 `SecondComponent` 在樹狀結構中位於同一層級，然而，通往 `SecondComponent` 的連結位於 `FirstComponent` 之內，這表示路由器必須先上升一層，再進入第二個目錄，才能找到 `SecondComponent`。
不必寫出通往 `SecondComponent` 的完整路徑，使用 `../` 表示法上升一層即可。

<code-example path="router/src/app/app.component.8.html" region="relative-route" header="In the template">

</code-example>

除了 `../` 之外，也可以使用 `./` 或不加開頭斜線來指定目前層級。

### 指定相對路由

若要指定相對路由，請使用 `NavigationExtras` 的 `relativeTo` 屬性。
在元件類別中，從 `@angular/router` 匯入 `NavigationExtras`。

接著在你的導覽方法中使用 `relativeTo`。
在連結參數陣列（這裡包含 `items`）之後，加入一個物件，將 `relativeTo` 屬性設為 `ActivatedRoute`，即 `this.route`。

<code-example path="router/src/app/app.component.4.ts" region="relative-to" header="RelativeTo">

The `navigate()` arguments configure the router to use the current route as a basis upon which to append `items`.

</code-example>

`goToItems()` 方法將目的 URI 解讀為相對於已啟用路由，並導覽到 `items` 路由。

## 存取查詢參數與 fragment

有時候，應用程式的某項功能需要存取路由的一部分，例如查詢參數或 fragment。
此階段教學中的英雄之旅（Tour of Heroes）應用程式使用清單檢視，你可以點選英雄來查看詳情。
路由器使用 `id` 來顯示正確的英雄詳情。

首先，在你想從其導覽的元件中，匯入下列成員。

<code-example header="Component import statements (excerpt)">

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

</code-example>

接著注入已啟用路由服務：

<code-example header="Component (excerpt)">
constructor(private route: ActivatedRoute) {}
</code-example>

設定這個類別，讓你有一個 observable `heroes$`、一個保存英雄 `id` 編號的 `selectedId`，以及英雄清單；在 `ngOnInit()` 中，加入下列程式碼，取得所選英雄的 `id`。
這段程式碼片段假設你已經有英雄清單、英雄服務、取得英雄的函式，以及渲染清單與詳情的 HTML，就像英雄之旅（Tour of Heroes）範例一樣。

<code-example header="Component 1 (excerpt)">
heroes$: Observable<Hero[]>;
selectedId: number;
heroes = HEROES;

ngOnInit() {
  this.heroes$ = this.route.paramMap.pipe(
    switchMap(params => {
      this.selectedId = Number(params.get('id'));
      return this.service.getHeroes();
    })
  );
}

</code-example>

接著，在你想導覽到的元件中，匯入下列成員。

<code-example header="Component 2 (excerpt)">

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

</code-example>

在元件類別的建構函式中注入 `ActivatedRoute` 與 `Router`，讓這個元件可以使用它們：

<code-example header="Component 2 (excerpt)">

  item$: Observable<Item>;

  constructor(
    private route: ActivatedRoute,
    private router: Router  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.hero$ = this.service.getHero(id);
  }

  gotoItems(item: Item) {
    let heroId = item ? hero.id : null;
    // Pass along the item id if available
    // so that the HeroList component can select that item.
    this.router.navigate(['/heroes', { id: itemId }]);
  }

</code-example>

{@a lazy-loading}

## 延遲載入

你可以設定路由來延遲載入模組，這表示 Angular 只在需要時才載入模組，而不是在應用程式啟動時載入所有模組。
此外，你可以在背景預先載入應用程式的部分內容，以改善使用者體驗。

關於延遲載入與預先載入的更多資訊，請參閱專門的指南[延遲載入 NgModules](guide/lazy-loading-ngmodules)。

## 防止未經授權的存取

使用路由守衛來防止使用者在未經授權的情況下導覽到應用程式的某些部分。
Angular 提供下列路由守衛：

* [`CanActivate`](api/router/CanActivate)
* [`CanActivateChild`](api/router/CanActivateChild)
* [`CanDeactivate`](api/router/CanDeactivate)
* [`Resolve`](api/router/Resolve)
* [`CanLoad`](api/router/CanLoad)

若要使用路由守衛，可以考慮使用無元件路由，因為這有助於保護子路由。

為你的守衛建立一個服務：

<code-example language="none" class="code-shell">
  ng generate guard your-guard
</code-example>

在你的守衛類別中，實作你想使用的守衛。
下列範例使用 `CanActivate` 來保護路由。

<code-example header="Component (excerpt)">
export class YourGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // your  logic goes here
  }
}
</code-example>

在你的路由模組中，在 `routes` 設定裡使用適當的屬性。
在這裡，`canActivate` 會告訴路由器居中協調前往這條特定路由的導覽。

<code-example header="Routing module (excerpt)">
{
  path: '/your-path',
  component: YourComponent,
  canActivate: [YourGuard],
}
</code-example>

關於實際可運作的範例與更多資訊，請參閱路由教學中[關於路由守衛的一節](guide/router#milestone-5-route-guards)。


{@a router-tutorial}

## 路由器教學：英雄之旅

雖然[入門：英雄之旅](tutorial)教學介紹了 Angular 的一般概念，這份[路由器教學](guide/router#getting-started)則更深入地講解 Angular 的路由功能。
本教學將引導你以基本路由器設定為基礎，逐步建立子路由、讀取路由參數、延遲載入 NgModule、守衛路由，並預先擷取資料以改善使用者體驗。

{@a router-tutorial-overview}

### 路由器教學概覽

本指南說明一個多頁面路由範例應用程式的開發過程。
在此過程中，它會突顯路由器的關鍵功能，例如：

* 將應用程式功能組織成模組。
* 導覽到元件（*Heroes* 連結到「Heroes List」）。
* 包含路由參數（在路由到「Hero Detail」時傳遞英雄 `id`）。
* 子路由（*Crisis Center* 有自己的路由）。
* `CanActivate` 守衛（檢查路由存取權）。
* `CanActivateChild` 守衛（檢查子路由存取權）。
* `CanDeactivate` 守衛（詢問是否放棄未儲存的變更）。
* `Resolve` 守衛（預先擷取路由資料）。
* 延遲載入 `NgModule`。
* `CanLoad` 守衛（在載入功能模組資產之前檢查）。

本指南以一系列里程碑的形式進行，就像你一步一步地建立應用程式一樣，但假設你已熟悉基本的 [Angular 概念](guide/architecture)。
若要對 Angular 有一般的介紹，請見 [入門](start)。若要更深入的總覽，請見 [Tour of Heroes](tutorial) 教學。


若要查看最終版應用程式的實際範例，請見 <live-example></live-example>。


### 範例應用程式實際運作

本教學的範例應用程式協助英雄就業仲介所為英雄尋找可以解決的危機。

應用程式有三個主要功能區域：

1. 一個 *Crisis Center*，用於維護要指派給英雄的危機清單。
1. 一個 *Heroes* 區域，用於維護仲介所僱用的英雄清單。
1. 一個 *Admin* 區域，用於管理危機與英雄清單。

點按這個 <live-example title="Hero Employment Agency Live Example">即時範例連結</live-example>來試試看。

應用程式會渲染出一排導覽按鈕，以及帶有英雄清單的 *Heroes* 檢視。


<div class="lightbox">
  <img src='generated/images/guide/router/hero-list.png' alt="英雄清單">
</div>



選取一位英雄，應用程式會帶你到英雄編輯畫面。

<div class="lightbox">
  <img src='generated/images/guide/router/hero-detail.png' alt="危機中心詳情">
</div>



變更姓名。
點按「Back」按鈕，應用程式會返回英雄清單，並顯示已變更的英雄姓名。
請注意，姓名變更會立即生效。

如果你點按的是瀏覽器的返回按鈕，而不是應用程式的「Back」按鈕，應用程式同樣會把你帶回英雄清單。
Angular 應用程式的導覽會像一般的網頁導覽一樣更新瀏覽器歷史記錄。

現在點按 *Crisis Center* 連結，查看進行中的危機清單。


<div class="lightbox">
  <img src='generated/images/guide/router/crisis-center-list.png' alt="危機中心清單">
</div>

選取一個危機，應用程式會帶你到危機編輯畫面。
_Crisis Detail_ 會出現在同一頁面清單下方的子元件中。

變更危機的名稱。
請注意，危機清單中對應的名稱並*沒有*改變。


<div class="lightbox">
  <img src='generated/images/guide/router/crisis-center-detail.png' alt="危機中心詳情">
</div>


與隨著輸入即時更新的 *Hero Detail* 不同，*Crisis Detail* 的變更只是暫時的，直到你按下「Save」或「Cancel」按鈕儲存或捨棄它們為止。
兩個按鈕都會導覽回 *Crisis Center* 及其危機清單。

點按瀏覽器的返回按鈕或「Heroes」連結來啟用一個對話框。


<div class="lightbox">
  <img src='generated/images/guide/router/confirm-dialog.png' alt="確認對話框">
</div>



你可以說「OK」並遺失你的變更，或點按「Cancel」並繼續編輯。

這個行為的背後是路由器的 `CanDeactivate` 守衛。
該守衛讓你在離開目前檢視之前，有機會清理或詢問使用者的許可。

`Admin` 與 `Login` 按鈕說明了本指南稍後會介紹的其他路由器功能。


{@a getting-started}

## 里程碑 1：開始

從一個在兩個空白檢視之間導覽的應用程式基本版本開始。


<div class="lightbox">
  <img src='generated/images/guide/router/router-1-anim.gif' alt="應用程式運作中">
</div>

{@a import}

使用 Angular CLI 產生範例應用程式。

<code-example language="none" class="code-shell">
  ng new angular-router-sample
</code-example>

### 定義路由

路由器必須使用一組路由定義來設定。

每個定義都會轉換為一個 [Route](api/router/Route) 物件，它有兩個要素：`path`（此路由的 URL 路徑區段）與 `component`（與此路由相關聯的元件）。

當瀏覽器 URL 變更，或應用程式程式碼告訴路由器沿著某個路由路徑導覽時，路由器會依據其定義登錄檔來處理。

第一個路由會執行下列動作：

* 當瀏覽器的位置 URL 變更為符合路徑區段 `/crisis-center` 時，路由器會啟用 `CrisisListComponent` 的一個執行個體並顯示其檢視。

* 當應用程式請求導覽到路徑 `/crisis-center` 時，路由器會啟用 `CrisisListComponent` 的一個執行個體、顯示其檢視，並以該路徑的 URL 更新瀏覽器的位址位置與歷史記錄。

第一個設定定義了一個包含兩條路由的陣列，其路徑最短，分別通往 `CrisisListComponent` 與 `HeroListComponent`。

產生 `CrisisList` 與 `HeroList` 元件，讓路由器有東西可以渲染。

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

### 註冊 `Router` 與 `Routes`

若要使用 `Router`，你必須先從 `@angular/router` 套件註冊 `RouterModule`。
定義一個路由陣列 `appRoutes`，並將它們傳給 `RouterModule.forRoot()` 方法。
`RouterModule.forRoot()` 方法會回傳一個模組，其中包含已設定的 `Router` 服務提供者，以及路由函式庫所需的其他提供者。
應用程式啟動後，`Router` 會根據目前的瀏覽器 URL 執行初始導覽。

<div class="alert is-important">

  **注意：** `RouterModule.forRoot()` 方法是一種用於註冊應用程式範圍提供者的模式。若要進一步了解應用程式範圍的提供者，請閱讀 [Singleton services](guide/singleton-services#forRoot-router) 指南。

</div>

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (first-config)" region="first-config"></code-example>

<div class="alert is-helpful">

將已設定的 `RouterModule` 加入 `AppModule` 對於最小的路由設定來說就足夠了。
然而，隨著應用程式成長，請將路由設定[重構](#將路由設定重構為路由模組)到獨立的檔案中，並建立一個[路由模組](#routing-module)。
路由模組是一種專門用於路由的特殊類型 `Service Module`。

</div>

在 `AppModule` 的 `imports` 陣列中註冊 `RouterModule.forRoot()`，會讓 `Router` 服務在應用程式的任何地方都可以使用。

{@a shell}

### 加入路由器插座

根 `AppComponent` 是應用程式的外殼。它有一個標題、一個帶有兩個連結的導覽列，以及一個路由器插座，路由器會在其中渲染元件。

<div class="lightbox">
  <img src='generated/images/guide/router/shell-and-outlet.png' alt="殼層">
</div>

路由器插座是一個預留位置，路由元件會在其中被渲染。

{@a shell-template}

對應的元件範本如下所示：

<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

{@a wildcard}

### 定義萬用字元路由

到目前為止，你已在應用程式中建立了兩條路由，一條通往 `/crisis-center`，另一條通往 `/heroes`。
任何其他 URL 都會導致路由器擲出錯誤並讓應用程式當掉。

加入一條萬用字元路由來攔截無效的 URL 並妥善處理。
萬用字元路由的路徑由兩個星號組成。
它會比對每個 URL。
因此，如果路由器無法比對設定中較早的路由，就會選取這條萬用字元路由。
萬用字元路由可以導覽到自訂的「404 Not Found」元件，或[重新導向](#redirect)到現有的路由。


<div class="alert is-helpful">

路由器使用[_先比對先贏_](#example-config)策略來選取路由。
因為萬用字元路由是最不具特定性的路由，請將它放在路由設定的最後。

</div>

若要測試這個功能，請在 `HeroListComponent` 範本中加入一個帶有 `RouterLink` 的按鈕，並將連結設為一個不存在的路由 `"/sidekicks"`。

<code-example path="router/src/app/hero-list/hero-list.component.1.html" header="src/app/hero-list/hero-list.component.html (excerpt)"></code-example>

如果使用者點按該按鈕，應用程式會失敗，因為你尚未定義 `"/sidekicks"` 路由。

不要加入 `"/sidekicks"` 路由，而是定義一條 `wildcard` 路由，讓它導覽到 `PageNotFoundComponent`。

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

當應用程式啟動時，瀏覽器列中的初始 URL 預設為：

<code-example>
  localhost:4200
</code-example>

這不符合任何寫死的路由，意味著路由器會落到萬用字元路由並顯示 `PageNotFoundComponent`。

應用程式需要一條預設路由通往有效的頁面。
本應用程式的預設頁面是英雄清單。
應用程式應該像使用者點按了「Heroes」連結，或在網址列中貼上 `localhost:4200/heroes` 一樣，導覽到那裡。

加入一條 `redirect` 路由，將初始的相對 URL（`''`）轉換為你想要的預設路徑（`/heroes`）。

將預設路由加入萬用字元路由_上方_的某個位置。
在下列摘錄中，它就位於萬用字元路由的正上方，顯示了這個里程碑的完整 `appRoutes`。


<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts (appRoutes)" region="appRoutes"></code-example>

瀏覽器的網址列會顯示 `.../heroes`，就像你直接導覽到那裡一樣。

重新導向路由需要一個 `pathMatch` 屬性，來告訴路由器如何將 URL 與路由的路徑進行比對。
在這個應用程式中，只有當*整個 URL* 符合 `''` 時，路由器才應該選取通往 `HeroListComponent` 的路由，因此請將 `pathMatch` 值設為 `'full'`。

{@a pathmatch}

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

  若要了解更多，請閱讀 Victor Savkin 關於重新導向的[文章](http://vsavkin.tumblr.com/post/146722301646/  angular-router-empty-paths-componentless-routes)。

</div>

### 里程碑 1 總結

你的範例應用程式可以在使用者點按連結時，在兩個檢視之間切換。

里程碑 1 涵蓋了如何執行下列事項：

* 載入路由器函式庫。
* 在外殼範本中加入導覽列，使用錨點標籤、`routerLink` 與 `routerLinkActive` 指令。
* 在外殼範本中加入 `router-outlet`，檢視會在其中顯示。
* 使用 `RouterModule.forRoot()` 設定路由器模組。
* 將路由器設為組成 HTML5 瀏覽器 URL。
* 使用 `wildcard` 路由處理無效路由。
* 在應用程式以空路徑啟動時導覽到預設路由。

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

以下是這個里程碑的檔案。



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

這個里程碑會向你展示如何設定一個稱為*路由模組*的特殊用途模組，其中保存了應用程式的路由設定。

路由模組具有下列特性：

* 將路由關注點與其他應用程式關注點分開。
* 提供一個在測試應用程式時可以取代或移除的模組。
* 為守衛與解析器等路由服務提供者提供一個眾所皆知的位置。
* 不宣告元件。

{@a integrate-routing}

### 將路由與應用程式整合

範例路由應用程式預設不包含路由。
當你使用 [Angular CLI](cli) 建立一個使用路由的專案時，請為專案或應用程式以及每個 NgModule 設定 `--routing` 選項。
當你建立或初始化新專案（使用 CLI [`ng new`](cli/new) 命令）或新應用程式（使用 [`ng generate app`](cli/generate) 命令）時，請指定 `--routing` 選項。
這會告訴 CLI 包含 `@angular/router` npm 套件，並建立一個名為 `app-routing.module.ts` 的檔案。
接著你可以在加入專案或應用程式的任何 NgModule 中使用路由。

例如，下列命令會產生一個可以使用路由的 NgModule。

```sh
ng generate module my-module --routing
```

這會建立一個名為 `my-module-routing.module.ts` 的獨立檔案，用來儲存 NgModule 的路由。
該檔案包含一個空的 `Routes` 物件，你可以用通往不同元件與 NgModule 的路由來填滿它。

{@a routing-refactor}


### 將路由設定重構為路由模組

在 `/app` 資料夾中建立一個 `AppRouting` 模組，以包含路由設定。

<code-example language="none" class="code-shell">
  ng generate module app-routing --module app --flat
</code-example>

像在 `app.module.ts` 中一樣，匯入 `CrisisListComponent`、`HeroListComponent` 與 `PageNotFoundComponent` 符號。
接著將 `Router` 匯入與路由設定（包括 `RouterModule.forRoot()`）移到這個路由模組中。

將 Angular 的 `RouterModule` 加入模組的 `exports` 陣列，來重新匯出它。
透過在此處重新匯出 `RouterModule`，`AppModule` 中宣告的元件就可以存取 `RouterLink` 與 `RouterOutlet` 等路由器指令。

完成這些步驟後，檔案應如下所示。

<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts"></code-example>

接著，移除 `app.module.ts` 檔案 `imports` 陣列中的 `RouterModule.forRoot` 來更新它。

<code-example path="router/src/app/app.module.2.ts" header="src/app/app.module.ts"></code-example>

<div class="alert is-helpful">

稍後，本指南會向你展示如何建立[多個路由模組](#heroes-functionality)，並以[正確的順序](#routing-module-order)匯入這些路由模組。

</div>

應用程式會繼續以相同的方式運作，而且你可以使用 `AppRoutingModule` 作為維護未來路由設定的集中位置。

{@a why-routing-module}

### 路由模組的好處

路由模組（通常稱為 `AppRoutingModule`）會取代根模組或功能模組中的路由設定。

當應用程式成長，以及設定包含專門的守衛與解析器服務時，路由模組會很有幫助。

有些開發人員在設定很小時會跳過路由模組，直接將路由設定合併到對應的模組中（例如 `AppModule`）。

大多數應用程式都應該實作路由模組以保持一致性。
它能讓程式碼保持整潔（當設定變得複雜時）。
它讓功能模組的測試更容易。
它的存在提醒人們一個模組是被路由的。
它是開發人員預期找到並擴充路由設定的地方。

{@a heroes-feature}

## 里程碑 3：英雄功能

這個里程碑涵蓋下列內容：

* 使用模組將應用程式與路由組織成功能區域。
* 以命令式方式從一個元件導覽到另一個元件。
* 在路由參數中傳遞必要與選擇性的資訊。

這個範例應用程式重現了 [Tour of Heroes 教學](tutorial/toh-pt4 "Tour of Heroes: Services")「Services」一節中的英雄功能，並重複使用 <live-example name="toh-pt4" title="Tour of Heroes: Services example code"></live-example> 中的大部分程式碼。

<!-- KW - this gif isn't ideal for accessibility. Would like to remove it.-->
<!-- Here's how the user will experience this version of the app:


<div class="lightbox">
  <img src='generated/images/guide/router/router-2-anim.gif' alt="App in action">
</div> -->

典型的應用程式有多個功能區域，每個區域都專注於特定的業務目的，並有自己的資料夾。

本節會向你展示如何將應用程式重構為不同的功能模組、將它們匯入主模組，並在它們之間導覽。


{@a heroes-functionality}

### 加入英雄功能

請依下列步驟操作：

* 若要管理英雄，請在 heroes 資料夾中建立一個帶有路由的 `HeroesModule`，並將它註冊到根 `AppModule`。

<code-example language="none" class="code-shell">
  ng generate module heroes/heroes --module app --flat --routing
</code-example>

* 將 `app` 資料夾中作為預留位置的 `hero-list` 資料夾移到 `heroes` 資料夾中。
* 將 <live-example name="toh-pt4" title="Tour of Heroes: Services example code">「Services」教學</live-example>中 `heroes/heroes.component.html` 的內容複製到 `hero-list.component.html` 範本中。

  * 將 `<h2>` 重新標示為 `<h2>HEROES</h2>`。
  * 刪除範本底部的 `<app-hero-detail>` 元件。

* 將即時範例中 `heroes/heroes.component.css` 的內容複製到 `hero-list.component.css` 檔案中。
* 將即時範例中 `heroes/heroes.component.ts` 的內容複製到 `hero-list.component.ts` 檔案中。

  * 將元件類別名稱變更為 `HeroListComponent`。
  * 將 `selector` 變更為 `app-hero-list`。

<div class="alert is-helpful">

   路由元件不需要選擇器，因為元件是在頁面渲染時動態插入的。然而，它們對於在 HTML 元素樹中識別與定位它們很有用。

</div>

* 將 `hero-detail` 資料夾、`hero.ts`、`hero.service.ts` 與 `mock-heroes.ts` 檔案複製到 `heroes` 子資料夾中。
* 將 `message.service.ts` 複製到 `src/app` 資料夾中。
* 更新 `hero.service.ts` 檔案中 `message.service` 的相對路徑匯入。

接著，更新 `HeroesModule` 的中繼資料。

  * 匯入 `HeroDetailComponent` 與 `HeroListComponent`，並將它們加入 `HeroesModule` 的 `declarations` 陣列中。

<code-example path="router/src/app/heroes/heroes.module.ts" header="src/app/heroes/heroes.module.ts"></code-example>

英雄管理檔案結構如下：

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

#### 英雄功能路由需求

英雄功能有兩個互相作用的元件：英雄清單與英雄詳細資料。
當你導覽到清單檢視時，它會取得英雄清單並顯示它們。
當你點按一位英雄時，詳細資料檢視必須顯示該位特定的英雄。

你可以透過在路由 URL 中包含所選英雄的 ID，告訴詳細資料檢視要顯示哪位英雄。

從 `src/app/heroes/` 資料夾中的新位置匯入英雄元件，並定義兩個英雄路由。

現在你有了 `Heroes` 模組的路由，請像在 `AppRoutingModule` 中一樣，使用 `RouterModule` 將它們註冊到 `Router`，但有一個重要的差異。

在 `AppRoutingModule` 中，你使用靜態 `RouterModule.forRoot()` 方法來註冊路由與應用程式層級的服務提供者。
在功能模組中，你使用靜態 `forChild()` 方法。


<div class="alert is-helpful">

只在根 `AppRoutingModule` 中呼叫 `RouterModule.forRoot()`
（或在 `AppModule` 中，如果那是你註冊頂層應用程式路由的地方）。
在任何其他模組中，你必須呼叫 `RouterModule.forChild()` 方法來註冊額外的路由。

</div>

更新後的 `HeroesRoutingModule` 如下所示：


<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts"></code-example>


<div class="alert is-helpful">

請考慮為每個功能模組提供自己的路由設定檔案。
雖然功能路由目前很少，但即使在小型應用程式中，路由也有變得更複雜的傾向。

</div>


{@a remove-duplicate-hero-routes}


#### 移除重複的英雄路由

英雄路由目前定義在兩個地方：透過 `HeroesModule` 定義在 `HeroesRoutingModule` 中，以及定義在 `AppRoutingModule` 中。

功能模組提供的路由會由路由器合併到它們被匯入的模組的路由中。這讓你可以繼續定義功能模組路由，而不必修改主要的路由設定。

從 `app-routing.module.ts` 中移除 `HeroListComponent` 匯入與 `/heroes` 路由。

保留預設路由與萬用字元路由，因為它們仍在應用程式的頂層使用中。

<code-example path="router/src/app/app-routing.module.2.ts" header="src/app/app-routing.module.ts (v2)"></code-example>

{@a merge-hero-routes}

#### 移除英雄宣告

因為 `HeroesModule` 現在提供了 `HeroListComponent`，請將它從 `AppModule` 的 `declarations` 陣列中移除。
現在你有了獨立的 `HeroesModule`，你可以用更多的元件與不同的路由來發展英雄功能。

完成這些步驟後，`AppModule` 應如下所示：

<code-example path="router/src/app/app.module.3.ts" header="src/app/app.module.ts" region="remove-heroes"></code-example>

{@a routing-module-order}

### 模組匯入順序

請注意，在模組的 `imports` 陣列中，`AppRoutingModule` 位於最後，排在 `HeroesModule` _之後_。

<code-example path="router/src/app/app.module.3.ts" region="module-imports" header="src/app/app.module.ts (module-imports)"></code-example>


路由設定的順序很重要，因為路由器會接受第一個符合導覽請求路徑的路由。

當所有路由都在同一個 `AppRoutingModule` 中時，你將預設路由與[萬用字元](#wildcard)路由放在最後、`/heroes` 路由之後，讓路由器有機會在碰到萬用字元路由並導覽到「Page not found」之前，先將 URL 與 `/heroes` 路由比對。

每個路由模組會依匯入順序擴充路由設定。如果你先列出 `AppRoutingModule`，萬用字元路由就會在英雄路由_之前_被註冊。
萬用字元路由&mdash;它會比對_每個_ URL&mdash;會攔截嘗試導覽到英雄路由的請求。


<div class="alert is-helpful">

反轉路由模組，看看點按 heroes 連結會導致「Page not found」。
請在[下方](#inspect-config "Inspect the router config")了解如何檢查執行時期的路由器設定。

</div>

### 路由參數

{@a route-def-with-parameter}

#### 帶有參數的路由定義

回到 `HeroesRoutingModule`，再看一次路由定義。通往 `HeroDetailComponent` 的路由在路徑中有一個 `:id` 權杖。

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (excerpt)" region="hero-detail-route"></code-example>

`:id` 權杖會在路徑中為路由參數建立一個位置。在這個情況下，此設定會讓路由器將英雄的 `id` 插入該位置。

如果你告訴路由器導覽到詳細資料元件並顯示「Magneta」，你會預期瀏覽器 URL 中出現一個英雄 ID，如下所示：


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



如果使用者將該 URL 輸入瀏覽器的網址列，路由器應該會辨認該模式，並前往同一個「Magneta」詳細資料檢視。


<div class="callout is-helpful">

<header>
  路由參數：必要還是可選？
</header>

將路由參數權杖 `:id` 嵌入路由定義路徑中，是這個情境的好選擇，因為 `id` 是 `HeroDetailComponent` *需要*的，而且路徑中的值 `15` 能清楚區分通往「Magneta」的路由與通往其他英雄的路由。

</div>


{@a route-parameters}

#### 在清單檢視中設定路由參數

導覽到 `HeroDetailComponent` 後，你會預期看到所選英雄的詳細資料。
你需要兩項資訊：通往該元件的路由路徑，以及英雄的 `id`。

因此，_連結參數陣列_有兩個項目：路由_路徑_，以及指定所選英雄 `id` 的_路由參數_。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>

路由器會像這樣從陣列組成目的地 URL：`localhost:4200/hero/15`。

路由器會從 URL 中擷取路由參數（`id:15`），並使用 `ActivatedRoute` 服務將它提供給 `HeroDetailComponent`。


{@a activated-route-in-action}

### `Activated Route` 實際運作

從路由器套件匯入 `Router`、`ActivatedRoute` 與 `ParamMap` 權杖。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (activated route)" region="imports"></code-example>

匯入 `switchMap` 運算子，因為你稍後需要它來處理 `Observable` 路由參數。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (switchMap operator import)" region="rxjs-operator-import"></code-example>

{@a hero-detail-ctor}

將服務作為私有變數加入建構子，讓 Angular 注入它們（使它們對元件可見）。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (constructor)" region="ctor"></code-example>

在 `ngOnInit()` 方法中，使用 `ActivatedRoute` 服務擷取路由的參數、從參數中取出英雄 `id`，並擷取要顯示的英雄。


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit)" region="ngOnInit"></code-example>

當對應改變時，`paramMap` 會從變更後的參數中取得 `id` 參數。

接著你告訴 `HeroService` 擷取具有該 `id` 的英雄，並回傳 `HeroService` 請求的結果。

`switchMap` 運算子會做兩件事。它會將 `HeroService` 回傳的 `Observable<Hero>` 扁平化，並取消先前待處理的請求。
如果使用者在 `HeroService` 仍在擷取舊 `id` 時，使用新的 `id` 重新導覽到這個路由，`switchMap` 會捨棄舊請求，並回傳新 `id` 的英雄。

`AsyncPipe` 會處理 observable 的訂閱，而元件的 `hero` 屬性將會以擷取到的英雄（重新）設定。

#### _ParamMap_ API

`ParamMap` API 的靈感來自 [URLSearchParams 介面](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)。
它提供方法來處理路由參數（`paramMap`）與查詢參數（`queryParamMap`）的參數存取。

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

預設情況下，當路由器重新導覽到相同類型的元件，而沒有先造訪不同的元件時，它會重複使用元件執行個體。
路由參數每次都可能改變。

假設父元件導覽列有「向前」與「向後」按鈕，可以捲動瀏覽英雄清單。
每次點按都會以命令式方式導覽到 `HeroDetailComponent`，並帶上下一個或上一個 `id`。

你不會希望路由器將目前的 `HeroDetailComponent` 執行個體從 DOM 中移除，只為了下一個 `id` 再重新建立它，因為這會重新渲染檢視。
為了更好的使用者體驗，路由器會重複使用相同的元件執行個體並更新參數。

因為 `ngOnInit()` 在每次元件具現化時只會被呼叫一次，你可以使用 observable 的 `paramMap` 屬性，從_同一個執行個體內_偵測路由參數何時改變。


<div class="alert is-helpful">

當你在元件中訂閱 observable 時，幾乎總是會在元件被摧毀時取消訂閱。

然而，`ActivatedRoute` 的 observable 是例外之一，因為 `ActivatedRoute` 及其 observable 與 `Router` 本身是隔離的。
`Router` 會在不再需要路由元件時，連同注入的 `ActivatedRoute` 一起摧毀它。

</div>

{@a snapshot}

<a id="snapshot無-observable-的替代方案"></a>
#### `snapshot`：無 observable 的替代方案

這個應用程式不會重複使用 `HeroDetailComponent`。
使用者總是會返回英雄清單以選取另一位要檢視的英雄。
在沒有先造訪中間的清單元件的情況下，無法從一位英雄的詳細資料導覽到另一位英雄的詳細資料。
因此，路由器每次都會建立一個新的 `HeroDetailComponent` 執行個體。

當你確定 `HeroDetailComponent` 執行個體永遠不會被重複使用時，你可以使用 `snapshot`。

`route.snapshot` 會提供路由參數對應的初始值。你可以直接存取參數，而不必像下列這樣訂閱或加入 observable 運算子：

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.2.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit snapshot)" region="snapshot"></code-example>

<div class="alert is-helpful">

`snapshot` 使用這種技巧時只會取得參數對應的初始值。
如果路由器有可能重複使用元件，請使用 observable 的 `paramMap` 方法。
本教學範例應用程式使用 observable 的 `paramMap`。

</div>

{@a nav-to-list}

### 導覽回清單元件

`HeroDetailComponent` 的「Back」按鈕使用 `gotoHeroes()` 方法，以命令式方式導覽回 `HeroListComponent`。

路由器的 `navigate()` 方法接受與你可以綁定到 `[routerLink]` 指令的相同的單一項目_連結參數陣列_。
它保存了通往 `HeroListComponent` 的路徑：


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (excerpt)" region="gotoHeroes"></code-example>


{@a optional-route-parameters}

#### 路由參數：必要或選擇性？

使用[路由參數](#route-parameters)，在路由 URL 內指定必要的參數值，就像你在導覽到 `HeroDetailComponent` 以檢視 `id` 為 15 的英雄時所做的那樣：


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



你也可以在路由請求中加入選擇性資訊。例如，當從英雄詳細資料檢視返回 `hero-detail.component.ts` 清單時，如果被檢視的英雄能在清單中被預先選取，那就太好了。

<div class="lightbox">
  <img src='generated/images/guide/router/selected-hero.png' alt="選取的英雄">
</div>

你可以透過在從 `HeroDetailComponent` 返回時，將被檢視英雄的 `id` 作為選擇性參數包含在 URL 中，來實作這個功能。

選擇性資訊也可以包含其他形式，例如：

* 結構鬆散的搜尋條件；例如 `name='wind*'`。
* 多個值；例如 `after='12/31/2015' & before='1/1/2017'`&mdash;順序不重要&mdash;`before='1/1/2017' & after='12/31/2015'`&mdash;以各種格式&mdash;`during='currentYear'`。

由於這類參數不容易放入 URL 路徑中，你可以使用選擇性參數，在導覽期間傳達任意複雜的資訊。選擇性參數不參與模式比對，並提供了表達上的彈性。

路由器支援使用選擇性參數以及必要的路由參數進行導覽。在定義必要的路由參數_之後_，請在一個獨立的物件中定義選擇性參數。

一般來說，當值是強制性的（例如，為了區分一條路由路徑與另一條）時，請使用必要的路由參數；當值是選擇性的、複雜的，以及／或多變的時，請使用選擇性參數。

{@a optionally-selecting}

#### 英雄清單：選擇性地選取英雄

當導覽到 `HeroDetailComponent` 時，你在路由參數中指定了要編輯英雄的必要 `id`，並將它作為[_連結參數陣列_](#link-parameters-array)的第二個項目。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>

路由器將 `id` 值嵌入導覽 URL 中，因為你已將它定義為路由參數，在路由 `path` 中使用 `:id` 預留位置權杖：

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (hero-detail-route)" region="hero-detail-route"></code-example>

當使用者點按返回按鈕時，`HeroDetailComponent` 會建構另一個_連結參數陣列_，用它來導覽回 `HeroListComponent`。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (gotoHeroes)" region="gotoHeroes"></code-example>

這個陣列缺少路由參數，因為你先前不需要將資訊傳送給 `HeroListComponent`。

現在，請在導覽請求中傳送目前英雄的 `id`，讓 `HeroListComponent` 可以在清單中突顯該英雄。

使用一個包含選擇性 `id` 參數的物件來傳送 `id`。為了示範目的，物件中有一個額外的無用參數（`foo`），`HeroListComponent` 應該忽略它。以下是修訂後的導覽陳述式：

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (go to heroes)" region="gotoHeroes"></code-example>

應用程式仍然可以運作。點按「back」會返回英雄清單檢視。

查看瀏覽器的網址列。

它應該看起來像這樣，取決於你在哪裡執行它：

<code-example language="bash">
  localhost:4200/heroes;id=15;foo=foo

</code-example>

`id` 值出現在 URL 中，如（`;id=15;foo=foo`），而不是出現在 URL 路徑中。「Heroes」路由的路徑沒有 `:id` 權杖。

選擇性路由參數不是像 URL 查詢字串中那樣以「?」與「&」分隔。它們以分號「;」分隔。這是矩陣 URL 表示法。

<div class="alert is-helpful">

矩陣 URL 表示法是網際網路創始人 Tim Berners-Lee 在 [1996 年提案](http://www.w3.org/DesignIssues/MatrixURIs.html)中首次提出的想法。

雖然矩陣表示法從未進入 HTML 標準，但它是合法的，而且在瀏覽器路由系統中變得很受歡迎，成為隔離屬於父路由與子路由的參數的一種方式。
因此，Router 在各瀏覽器中都支援矩陣表示法。

</div>

{@a route-parameters-activated-route}

### `ActivatedRoute` 服務中的路由參數

以目前的開發狀態來看，英雄清單沒有改變。沒有任何英雄列被突顯。

`HeroListComponent` 需要預期參數的程式碼。

先前，當你從 `HeroListComponent` 導覽到 `HeroDetailComponent` 時，你訂閱了路由參數對應 `Observable`，並在 `ActivatedRoute` 服務中將它提供給 `HeroDetailComponent`。
你在 `HeroDetailComponent` 的建構子中注入了該服務。

這一次你將朝相反的方向導覽，從 `HeroDetailComponent` 到 `HeroListComponent`。

首先，擴充路由器匯入陳述式以包含 `ActivatedRoute` 服務符號：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (import)" region="import-router"></code-example>

匯入 `switchMap` 運算子，以對路由參數對應的 `Observable` 執行操作。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (rxjs imports)" region="rxjs-imports"></code-example>

在 `HeroListComponent` 建構子中注入 `ActivatedRoute`。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (constructor and ngOnInit)" region="ctor"></code-example>

`ActivatedRoute.paramMap` 屬性是一個路由參數的 `Observable` 對應。
當使用者導覽到該元件時，`paramMap` 會發出一個包含 `id` 的新值對應。
在 `ngOnInit()` 中，你訂閱這些值、設定 `selectedId`，並取得英雄。

使用[類別綁定](guide/template-syntax#類別繫結)更新範本。
當比較回傳 `true` 時，該綁定會加入 `selected` CSS 類別，回傳 `false` 時則移除它。
請在重複的 `<li>` 標籤內尋找它，如下所示：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.html" header="src/app/heroes/hero-list/hero-list.component.html"></code-example>

加入一些在清單項目被選取時套用的樣式。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.css" region="selected" header="src/app/heroes/hero-list/hero-list.component.css"></code-example>

當使用者從英雄清單導覽到「Magneta」英雄再返回時，「Magneta」會顯示為被選取：

<div class="lightbox">
  <img src='generated/images/guide/router/selected-hero.png' alt="選取的清單">
</div>

選擇性的 `foo` 路由參數是無害的，路由器會繼續忽略它。

{@a route-animation}

### 加入可路由的動畫

本節會向你展示如何為 `HeroDetailComponent` 加入一些[動畫](guide/animations)。

首先，匯入 `BrowserAnimationsModule` 並將它加入 `imports` 陣列：

<code-example path="router/src/app/app.module.ts" header="src/app/app.module.ts (animations-module)" region="animations-module"></code-example>

接著，為 `HeroListComponent` 與 `HeroDetailComponent` 的路由加入一個 `data` 物件。
轉場是基於 `states` 的，你使用路由中的 `animation` 資料來為轉場提供一個具名的動畫 `state`。

<code-example path="router/src/app/heroes/heroes-routing.module.2.ts" header="src/app/heroes/heroes-routing.module.ts (animation data)"></code-example>

在根 `src/app/` 資料夾中建立一個 `animations.ts` 檔案。其內容如下所示：

<code-example path="router/src/app/animations.ts" header="src/app/animations.ts (excerpt)"></code-example>

這個檔案會執行下列動作：

* 匯入建立動畫觸發器、控制狀態，以及管理狀態之間轉場的動畫符號。

* 匯出一個名為 `slideInAnimation` 的常數，它被設為一個名為 `routeAnimation` 的動畫觸發器。

* 定義一個轉場，在 `heroes` 與 `hero` 路由之間來回切換時，讓元件在進入應用程式檢視時（`:enter`）從螢幕左側緩入，另一個轉場則在元件離開應用程式檢視時（`:leave`）讓它向右滑出。

回到 `AppComponent`，從 `@angular/router` 套件匯入 `RouterOutlet` 權杖，並從 `'./animations.ts` 匯入 `slideInAnimation`。

在 `@Component` 中繼資料中加入一個包含 `slideInAnimation` 的 `animations` 陣列。

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (animations)" region="animation-imports"></code-example>

若要使用可路由的動畫，請將 `RouterOutlet` 包裝在一個元素內，使用 `@routeAnimation` 觸發器，並將它綁定到該元素。

為了讓 `@routeAnimation` 轉場根據狀態觸發，請提供它來自 `ActivatedRoute` 的 `data`。`RouterOutlet` 會以 `outlet` 範本變數的形式公開，因此請綁定一個對路由器插座的參照。這個範例使用 `routerOutlet` 變數。

<code-example path="router/src/app/app.component.2.html" header="src/app/app.component.html (router outlet)"></code-example>

`@routeAnimation` 屬性會綁定到 `getAnimationData()`，並提供 `routerOutlet` 參照，因此下一步是在 `AppComponent` 中定義該函式。
`getAnimationData()` 函式會回傳主要路由透過 `ActivatedRoute` 提供的 `data` 中的動畫屬性。`animation` 屬性會符合你在 `animations.ts` 中定義的 `slideInAnimation` 中使用的 `transition` 名稱。

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (router outlet)" region="function-binding"></code-example>

在兩個路由之間切換時，`HeroDetailComponent` 與 `HeroListComponent` 現在會在被路由到時從左側緩入，在離開時向右滑出。

{@a milestone-3-wrap-up}

### 里程碑 3 總結

本節涵蓋了下列內容：

* 將應用程式組織成功能區域。
* 以命令式方式從一個元件導覽到另一個元件。
* 在路由參數中傳遞資訊，並在元件中訂閱它們。
* 將功能區域 NgModule 匯入 `AppModule`。
* 根據頁面套用可路由的動畫。

在這些變更之後，資料夾結構如下：

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

Here are the relevant files for this version of the sample application.

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

本節會向你展示如何加入子路由，並在應用程式中使用相對路由。

若要為應用程式目前的危機中心加入更多功能，請採取與英雄功能類似的步驟：

* 在 `src/app` 資料夾中建立一個 `crisis-center` 子資料夾。
* 將 `app/heroes` 中的檔案與資料夾複製到新的 `crisis-center` 資料夾中。
* 在新檔案中，將每個提到的「hero」改為「crisis」，「heroes」改為「crises」。
* 將 NgModule 檔案重新命名為 `crisis-center.module.ts` 與 `crisis-center-routing.module.ts`。

使用模擬危機而非模擬英雄：

<code-example path="router/src/app/crisis-center/mock-crises.ts" header="src/app/crisis-center/mock-crises.ts"></code-example>

產生的危機中心是引入新概念&mdash;子路由&mdash;的基礎。
你可以將 Heroes 保持在目前狀態，作為與危機中心的對照。

<div class="alert is-helpful">

遵循<a href="https://blog.8thlight.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html" title="Separation of Concerns">關注點分離原則</a>，對危機中心的變更不會影響 `AppModule` 或任何其他功能的元件。

</div>

{@a crisis-child-routes}

### 帶有子路由的危機中心

本節會向你展示如何組織危機中心，以符合下列 Angular 應用程式的建議模式：

* 每個功能區域都位於自己的資料夾中。
* 每個功能都有自己的 Angular 功能模組。
* 每個區域都有自己的區域根元件。
* 每個區域根元件都有自己的路由器插座與子路由。
* 功能區域路由很少（即使有）會與其他功能的路由交叉。

如果你的應用程式有許多功能區域，應用程式的元件樹可能看起來像這樣：


<div class="lightbox">
  <img src='generated/images/guide/router/component-tree.png' alt="元件樹">
</div>


{@a child-routing-component}


### 子路由元件

在 `crisis-center` 資料夾中產生一個 `CrisisCenter` 元件：

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center
</code-example>

使用下列標記更新元件範本：

<code-example path="router/src/app/crisis-center/crisis-center/crisis-center.component.html" header="src/app/crisis-center/crisis-center/crisis-center.component.html"></code-example>

`CrisisCenterComponent` 與 `AppComponent` 有以下共通點：

* 它是危機中心區域的根，就像 `AppComponent` 是整個應用程式的根一樣。
* 它是危機管理功能區的殼層，就像 `AppComponent` 是管理高階工作流程的殼層一樣。

和大多數殼層一樣，`CrisisCenterComponent` 類別非常精簡，因為它沒有商業邏輯，而且它的範本沒有連結，只有標題和一個供危機中心子元件使用的 `<router-outlet>`。

{@a child-route-config}

### 子路由設定

作為「危機中心」功能的宿主頁面，請在 `crisis-center` 資料夾中產生一個 `CrisisCenterHome` 元件。

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center-home
</code-example>

使用歡迎來到 `Crisis Center` 的訊息更新範本。

<code-example path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html" header="src/app/crisis-center/crisis-center-home/crisis-center-home.component.html"></code-example>

更新你從 `heroes-routing.module.ts` 檔案複製後重新命名的 `crisis-center-routing.module.ts`。
這次，你要在父層 `crisis-center` 路由內定義子路由。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (Routes)" region="routes"></code-example>

請注意，父層 `crisis-center` 路由有一個 `children` 屬性，其中包含一個含有 `CrisisListComponent` 的路由。
`CrisisListComponent` 路由也有一個包含兩個路由的 `children` 陣列。

這兩個路由分別導覽至危機中心子元件 `CrisisCenterHomeComponent` 與 `CrisisDetailComponent`。

路由器處理子路由的方式有幾個重要差異。

路由器會把這些路由的元件顯示在 `CrisisCenterComponent` 的 `RouterOutlet` 中，而不是 `AppComponent` 殼層的 `RouterOutlet` 中。

`CrisisListComponent` 包含危機清單，以及一個用來顯示 `Crisis Center Home` 與 `Crisis Detail` 路由元件的 `RouterOutlet`。

`Crisis Detail` 路由是 `Crisis List` 的子路由。
路由器預設會[重複使用元件](#reuse)，因此當你選取不同的危機時，`Crisis Detail` 元件會被重複使用。
相較之下，先前在 `Hero Detail` 路由中，每次從英雄清單選取不同的英雄時，[元件都會重新建立](#snapshot無-observable-的替代方案)。

在最上層，以 `/` 開頭的路徑指的是應用程式的根。
但子路由會延伸父路由的路徑。
沿著路由樹每往下一層，你就要加上一個斜線再接路由路徑，除非路徑是空的。

把這個邏輯套用到危機中心的導覽，其父路徑為 `/crisis-center`。

* 若要導覽至 `CrisisCenterHomeComponent`，完整 URL 是 `/crisis-center`（`/crisis-center` + `''` + `''`）。

* 若要導覽至 `id=2` 危機的 `CrisisDetailComponent`，完整 URL 是
`/crisis-center/2`（`/crisis-center` + `''` + `'/2'`）。

後一個範例的絕對 URL（包含 `localhost` 來源）如下：

<code-example>
  localhost:4200/crisis-center/2

</code-example>

以下是完整的 `crisis-center-routing.module.ts` 檔案及其匯入。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (excerpt)"></code-example>

{@a import-crisis-module}

### 將危機中心模組匯入 `AppModule` 路由

和 `HeroesModule` 一樣，你必須把 `CrisisCenterModule` 加入 `AppModule` 的 `imports` 陣列，而且要放在 `AppRoutingModule` _之前_：

<code-tabs>

  <code-pane path="router/src/app/crisis-center/crisis-center.module.ts"header="src/app/crisis-center/crisis-center.module.ts">

  </code-pane>

  <code-pane path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (import CrisisCenterModule)" region="crisis-center-module">

  </code-pane>

</code-tabs>

移除 `app-routing.module.ts` 中最初的危機中心路由，因為現在 `HeroesModule` 與 `CrisisCenter` 模組會提供功能路由。

`app-routing.module.ts` 檔案會保留預設路由與萬用字元路由等最上層應用程式路由。

<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (v3)" region="v3"></code-example>

{@a relative-navigation}

### 相對導覽

在建置危機中心功能的過程中，你是使用以斜線開頭的絕對路徑來導覽至危機詳細資料路由。

路由器會從路由設定的最上層開始，將這類絕對路徑與路由進行比對。

你可以繼續使用像這樣的絕對路徑在危機中心功能內導覽，但這樣會把連結綁死在父層路由結構上。
如果你變更父層 `/crisis-center` 路徑，就必須變更連結參數陣列。

你可以改用相對於目前 URL 區段的路徑來定義連結，擺脫這種相依性。
即使你變更通往該功能區的父路由路徑，功能區內的導覽仍然保持完整。

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

呼叫路由器的 `navigateByUrl()` 方法時，務必指定完整的絕對路徑。

</div>

{@a nav-to-crisis}

### 使用相對 URL 導覽至危機清單

你已經注入了組成相對導覽路徑所需的 `ActivatedRoute`。

若改用 `RouterLink` 而非 `Router` 服務來導覽，你會使用相同的連結參數陣列，但不會提供帶有 `relativeTo` 屬性的物件。
`ActivatedRoute` 在 `RouterLink` 指令中是隱含的。

更新 `CrisisDetailComponent` 的 `gotoCrises()` 方法，改用相對路徑導覽回到危機中心清單。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (relative navigation)" region="gotoCrises-navigate"></code-example>

請注意，路徑會使用 `../` 語法往上一層。
如果目前危機的 `id` 是 `3`，回到危機清單的結果路徑就是 `/crisis-center/;id=3;foo=foo`。

{@a named-outlets}

### 在具名 outlet 中顯示多個路由

你決定提供使用者聯絡危機中心的方式。
當使用者點選「Contact」按鈕時，你希望在彈出視窗中顯示一則訊息。

彈出視窗應保持開啟，即使在應用程式的頁面之間切換也一樣，直到使用者傳送訊息或取消後才關閉。
顯然你不能把彈出視窗放在與其他頁面相同的 outlet 中。

到目前為止，你只定義了一個 outlet，並在該 outlet 下嵌套子路由來將路由分組。
路由器在每個範本中只支援一個主要的未具名 outlet。

範本也可以有任意數量的具名 outlet。
每個具名 outlet 都有自己的一組路由與各自的元件。
多個 outlet 可以同時顯示由不同路由決定的不同內容。

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

它會顯示一個簡短的表單，包含標頭、訊息輸入方塊，以及「Send」與「Cancel」兩個按鈕。

<div class="lightbox">
  <img src='generated/images/guide/router/contact-popup.png' alt="聯絡快顯">
</div>

以下是該元件、其範本與樣式：

<code-tabs>

  <code-pane header="src/app/compose-message/compose-message.component.css" path="router/src/app/compose-message/compose-message.component.css">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.html" path="router/src/app/compose-message/compose-message.component.html">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.ts" path="router/src/app/compose-message/compose-message.component.ts">

  </code-pane>

</code-tabs>

它看起來和本指南中的其他元件相似，但有兩個關鍵差異。

請注意，`send()` 方法會在「傳送」訊息並關閉彈出視窗之前，等待一秒來模擬延遲。

`closePopup()` 方法會導覽至帶有 `null` 的彈出 outlet 來關閉彈出視窗，[清除次要路由](#clear-secondary-routes)一節會說明這一點。

{@a add-secondary-route}

#### 加入次要路由

開啟 `AppRoutingModule`，並在 `appRoutes` 中加入一個新的 `compose` 路由。

<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (compose route)" region="compose"></code-example>

除了 `path` 與 `component` 屬性之外，還有一個名為 `outlet` 的新屬性，設為 `'popup'`。
這個路由現在以彈出 outlet 為目標，`ComposeMessageComponent` 會顯示在那裡。

若要讓使用者有辦法開啟彈出視窗，請在 `AppComponent` 範本中加入一個「Contact」連結。

<code-example path="router/src/app/app.component.4.html" header="src/app/app.component.html (contact-link)" region="contact-link"></code-example>

雖然 `compose` 路由已設定為「popup」outlet，但僅這樣還不足以把路由連接到 `RouterLink` 指令。
你必須在_連結參數陣列_中指定具名 outlet，並透過屬性繫結將其繫結到 `RouterLink`。

_連結參數陣列_包含一個物件，該物件只有一個 `outlets` 屬性，其值是另一個以一個（或多個）outlet 名稱為鍵的物件。
在這個例子中，只有「popup」outlet 屬性，其值是另一個指定 `compose` 路由的_連結參數陣列_。

換句話說，當使用者點選這個連結時，路由器會把與 `compose` 路由相關聯的元件顯示在 `popup` outlet 中。

<div class="alert is-helpful">

當只有一個路由與一個未具名 outlet 時，這個外層物件內的 `outlets` 物件是不必要的。

路由器假設你的路由規格以未具名的主要 outlet 為目標，並為你建立這些物件。

路由到具名 outlet 揭示了路由器的一項功能：
你可以在同一個 `RouterLink` 指令中使用多個路由來指定多個 outlet。

</div>

{@a secondary-route-navigation}

#### 次要路由導覽：在導覽期間合併路由

導覽至_危機中心_並點選「Contact」。
你應該會在瀏覽器網址列中看到類似以下的 URL。

<code-example>
  http://.../crisis-center(popup:compose)

</code-example>

URL 中與 `...` 相關的部分如下：

* `crisis-center` 是主要導覽。
* 括號圍住次要路由。
* 次要路由由 outlet 名稱（`popup`）、一個 `colon` 分隔符號，以及次要路由路徑（`compose`）組成。

點選 _Heroes_ 連結，再看一次 URL。

<code-example>
  http://.../heroes(popup:compose)
</code-example>

主要導覽的部分改變了；次要路由維持不變。

路由器會追蹤導覽樹中的兩個獨立分支，並在 URL 中產生該樹的表示法。

你可以加入更多 outlet 與路由，位於最上層與嵌套層級，建立具有許多分支的導覽樹，路由器也會產生相應的 URL。

你可以填寫 `outlets` 物件，一次導覽整棵樹，然後把該物件放在_連結參數陣列_中傳給 `router.navigate` 方法。

{@a clear-secondary-routes}

#### 清除次要路由

和一般 outlet 一樣，次要 outlet 會持續存在，直到你導覽至新的元件。

每個次要 outlet 都有自己的導覽，獨立於驅動主要 outlet 的導覽。
變更顯示在主要 outlet 中的目前路由，對彈出 outlet 沒有影響。
這就是彈出視窗在你於危機與英雄之間導覽時仍保持可見的原因。

再看一次 `closePopup()` 方法：

<code-example path="router/src/app/compose-message/compose-message.component.ts" header="src/app/compose-message/compose-message.component.ts (closePopup)" region="closePopup"></code-example>

點選「send」或「cancel」按鈕會清除彈出視窗。
`closePopup()` 函式會使用 `Router.navigate()` 方法以命令式導覽，傳入一個[連結參數陣列](#link-parameters-array)。

和繫結到 `AppComponent` 中 _Contact_ `RouterLink` 的陣列一樣，這個陣列包含一個帶有 `outlets` 屬性的物件。
`outlets` 屬性的值是另一個以 outlet 名稱為鍵的物件。
唯一具名的 outlet 是 `'popup'`。

這次 `'popup'` 的值是 `null`。
那不是一個路由，但卻是合法的值。
把彈出 `RouterOutlet` 設為 `null` 會清除該 outlet，並從目前 URL 中移除次要彈出路由。

{@a guards}

{@a milestone-5-route-guards}


## 里程碑 5：路由守衛

目前，任何使用者隨時都可以在應用程式中任意導覽，但有時候你需要基於各種原因，控制對應用程式不同部分的存取。其中可能包括以下情況：

* 使用者可能未獲授權導覽至目標元件。
* 使用者可能必須先登入（驗證身分）。
* 在顯示目標元件之前，你可能應該先擷取一些資料。
* 離開元件之前，你可能想儲存待處理的變更。
* 你可能想詢問使用者是否可以捨棄待處理的變更，而不是儲存它們。

你可以在路由設定中加入守衛來處理這些情境。

守衛的回傳值會控制路由器的行為：

* 如果它回傳 `true`，導覽程序繼續進行。
* 如果它回傳 `false`，導覽程序停止，使用者停留在原地。
* 如果它回傳一個 `UrlTree`，目前的導覽取消，並對回傳的 `UrlTree` 開始新的導覽。

<div class="alert is-helpful">

**注意：** 守衛也可以告訴路由器導覽至別處，實際上就是取消目前的導覽。
在守衛內這樣做時，守衛應該回傳 `false`；

</div>

守衛可能會同步回傳布林答案。
但在許多情況下，守衛無法同步產生答案。
守衛可能會向使用者提問、把變更儲存到伺服器，或擷取最新資料。
這些都是非同步操作。

因此，路由守衛可以回傳 `Observable<boolean>` 或 `Promise<boolean>`，路由器會等待該 observable 解析為 `true` 或 `false`。

<div class="alert is-critical">

**注意：** 提供給 `Router` 的 observable 也必須完成。如果 observable 沒有完成，導覽就不會繼續。

</div>

路由器支援多種守衛介面：

* [`CanActivate`](api/router/CanActivate) 調解導覽_至_某個路由。

* [`CanActivateChild`](api/router/CanActivateChild) 調解導覽_至_某個子路由。

* [`CanDeactivate`](api/router/CanDeactivate) 調解從目前路由_離開_的導覽。

* [`Resolve`](api/router/Resolve) 在路由啟用_之前_執行路由資料擷取。

* [`CanLoad`](api/router/CanLoad) 調解導覽_至_以非同步方式載入的功能模組。


你可以在路由階層的每個層級設置多個守衛。
路由器會先檢查 `CanDeactivate` 與 `CanActivateChild` 守衛，從最深層的子路由檢查到最上層。
接著從最上層檢查到最深層的子路由，檢查 `CanActivate` 守衛。
如果功能模組是非同步載入的，`CanLoad` 守衛會在模組載入之前檢查。
如果_任何_守衛回傳 false，尚未完成的待處理守衛會被取消，整個導覽也會被取消。

接下來幾節有數個範例。

{@a can-activate-guard}

### `CanActivate`：要求驗證身分

應用程式經常會根據使用者身分限制對功能區的存取。
你可能只允許已驗證的使用者或具有特定角色的使用者存取。
你也可能在使用者帳號啟用之前封鎖或限制存取。

`CanActivate` 守衛就是用來管理這些導覽商業規則的工具。

#### 加入管理功能模組

本節會引導你擴充危機中心，加入一些新的管理功能。
首先加入一個名為 `AdminModule` 的新功能模組。

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

管理功能檔案結構如下：


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

管理功能模組包含用於功能模組內路由的 `AdminComponent`、一個儀表板路由，以及兩個用來管理危機與英雄的未完成元件。

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

雖然管理儀表板的 `RouterLink` 只包含一個沒有額外 URL 區段的相對斜線，但它與管理功能區內的任何路由都相符。
你只希望 `Dashboard` 連結在使用者造訪該路由時才處於作用中狀態。
在 `Dashboard` 的 routerLink 上加入額外的繫結 `[routerLinkActiveOptions]="{ exact: true }"`，會在使用者導覽至 `/admin` URL 時把 `./` 連結標記為作用中，而不是在導覽至任何子路由時。

</div>

{@a component-less-route}

##### 無元件路由：在沒有元件的情況下分組路由

初始的管理路由設定如下：

<code-example path="router/src/app/admin/admin-routing.module.1.ts" header="src/app/admin/admin-routing.module.ts (admin routing)" region="admin-routes"></code-example>

`AdminComponent` 下的子路由有 `path` 與 `children` 屬性，但沒有使用 `component`。
這定義了一個_無元件_路由。

若要把 `Crisis Center` 管理路由分組在 `admin` 路徑之下，並不需要元件。
此外，_無元件_路由讓[守衛子路由](#can-activate-child-guard)變得更容易。

接著，把 `AdminModule` 匯入 `app.module.ts`，並加入 `imports` 陣列以註冊管理路由。

<code-example path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (admin module)" region="admin-module"></code-example>

在 `AppComponent` 殼層中加入一個「Admin」連結，讓使用者可以前往這個功能。

<code-example path="router/src/app/app.component.5.html" header="src/app/app.component.html (template)"></code-example>

{@a guard-admin-feature}

#### 守衛管理功能

目前，危機中心內的每個路由都對所有人開放。
新的管理功能應該只有已驗證的使用者才能存取。

撰寫一個 `canActivate()` 守衛方法，當匿名使用者嘗試進入管理區時，將他們重新導向至登入頁面。

在 `auth` 資料夾中產生一個 `AuthGuard`。

<code-example language="none" class="code-shell">
  ng generate guard auth/auth
</code-example>

為了示範基本原理，本範例只會記錄到主控台、立即 `returns` true，並讓導覽繼續進行：

<code-example path="router/src/app/auth/auth.guard.1.ts" header="src/app/auth/auth.guard.ts (excerpt)"></code-example>

接著，開啟 `admin-routing.module.ts `，匯入 `AuthGuard` 類別，並使用 `canActivate` 守衛屬性更新管理路由，該屬性會參照它：

<code-example path="router/src/app/admin/admin-routing.module.2.ts" header="src/app/admin/admin-routing.module.ts (guarded admin route)" region="admin-route"></code-example>

管理功能現在受到守衛保護，但守衛需要更多客製化才能完整運作。

{@a teach-auth}

#### 使用 `AuthGuard` 進行驗證

讓 `AuthGuard` 模擬驗證。

`AuthGuard` 應該呼叫一個可以讓使用者登入並保留目前使用者資訊的應用程式服務。在 `auth` 資料夾中產生一個新的 `AuthService`：

<code-example language="none" class="code-shell">
  ng generate service auth/auth
</code-example>

更新 `AuthService` 以登入使用者：

<code-example path="router/src/app/auth/auth.service.ts" header="src/app/auth/auth.service.ts (excerpt)"></code-example>

雖然它並不真的登入，但它有一個 `isLoggedIn` 旗標，可以告訴你使用者是否已驗證身分。
它的 `login()` 方法會回傳一個在短暫停頓後成功解析的 observable，模擬對外部服務的 API 呼叫。
`redirectUrl` 屬性會儲存使用者想存取的 URL，讓你可以在驗證後導覽至該 URL。

<div class="alert is-helpful">

為了保持精簡，本範例將未驗證的使用者重新導向至 `/admin`。

</div>

修改 `AuthGuard` 以呼叫 `AuthService`。

<code-example path="router/src/app/auth/auth.guard.2.ts" header="src/app/auth/auth.guard.ts (v2)"></code-example>

請注意，你在建構子中注入了 `AuthService` 與 `Router`。
你尚未提供 `AuthService`，但很高興知道你可以將有用的服務注入路由守衛中。

這個守衛會回傳一個同步的布林結果。
如果使用者已登入，它會回傳 true，導覽繼續進行。

`ActivatedRouteSnapshot` 包含將被啟用的_未來_路由，而 `RouterStateSnapshot` 包含應用程式的_未來_ `RouterState`（如果你通過守衛檢查的話）。

如果使用者未登入，你會使用 `RouterStateSnapshot.url` 儲存使用者嘗試前往的 URL，並告訴路由器重新導向至登入頁面&mdash;一個你尚未建立的頁面。
這個次要導覽會自動取消目前的導覽；`checkLogin()` 會回傳 `false`。

{@a add-login-component}

#### 加入 `LoginComponent`

你需要一個 `LoginComponent` 讓使用者登入應用程式。登入後，你會重新導向至儲存的 URL（如果有的話），或使用預設 URL。
這個元件以及你在路由器設定中使用它的方式都沒有什麼新意。

<code-example language="none" class="code-shell">
  ng generate component auth/login
</code-example>

在 `auth/auth-routing.module.ts` 中註冊一個 `/login` 路由。
在 `app.module.ts` 中，匯入 `AuthModule` 並將它加入 `AppModule` 的 imports。


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

### `CanActivateChild`：守衛子路由

你也可以使用 `CanActivateChild` 守衛來保護子路由。
`CanActivateChild` 守衛類似於 `CanActivate` 守衛。
關鍵差異在於它會在任何子路由被啟用之前執行。

你已保護管理功能模組免於未經授權的存取。
你也應該保護功能模組_內部_的子路由。

擴充 `AuthGuard`，在 `admin` 路由之間導覽時提供保護。
開啟 `auth.guard.ts`，並將 `CanActivateChild` 介面加入從路由器套件匯入的權杖中。

接著，實作 `canActivateChild()` 方法，它接受與 `canActivate()` 方法相同的引數：一個 `ActivatedRouteSnapshot` 與 `RouterStateSnapshot`。
`canActivateChild()` 方法可以回傳 `Observable<boolean>` 或 `Promise<boolean>` 進行非同步檢查，回傳 `boolean` 進行同步檢查。
這個方法會回傳一個 `boolean`：

<code-example path="router/src/app/auth/auth.guard.3.ts" header="src/app/auth/auth.guard.ts (excerpt)" region="can-activate-child"></code-example>

將同一個 `AuthGuard` 加入 `component-less` 管理路由，一次保護所有其他子路由，
而不用把 `AuthGuard` 分別加入每條路由。

<code-example path="router/src/app/admin/admin-routing.module.3.ts" header="src/app/admin/admin-routing.module.ts (excerpt)" region="can-activate-child"></code-example>

{@a can-deactivate-guard}


### `CanDeactivate`：處理未儲存的變更

回到「Heroes」工作流程，應用程式會立即接受對英雄的每個變更，不進行驗證。

在真實世界中，你可能必須累積使用者的變更、跨欄位驗證、在伺服器上驗證，或將變更保持在待處理狀態，直到使用者將它們整組確認或取消並還原所有變更為止。

當使用者導覽離開時，你可以讓使用者決定如何處理未儲存的變更。
如果使用者取消，你會停留在原地並允許更多變更。
如果使用者核准，應用程式可以儲存。

你仍然可能延遲導覽，直到儲存成功為止。
如果你讓使用者立即移到下一個畫面，而儲存卻失敗（可能資料被判定為無效），你就會失去錯誤的脈絡。

你需要在等待伺服器非同步回傳答案的期間，停止導覽。

`CanDeactivate` 守衛會協助你決定如何處理未儲存的變更，以及如何繼續。

{@a cancel-save}

#### 取消與儲存

使用者在 `CrisisDetailComponent` 中更新危機資訊。
與 `HeroDetailComponent` 不同，使用者的變更不會立即更新危機實體。
相反地，應用程式會在使用者按下 Save 按鈕時更新實體，在使用者按下 Cancel 按鈕時捨棄變更。

兩個按鈕都會在儲存或取消後導覽回危機清單。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (cancel and save methods)" region="cancel-save"></code-example>

在這個情境中，使用者可能點按 heroes 連結、取消、按下瀏覽器返回按鈕，或在未儲存的情況下導覽離開。

這個範例應用程式會以一個確認對話框要求使用者明確表態，該對話框會非同步等待使用者的回應。

<div class="alert is-helpful">

你可以用同步、阻塞的程式碼等待使用者的答案，然而，應用程式以非同步方式等待使用者的答案會更有回應性&mdash;而且可以做其他工作。

</div>

產生一個 `Dialog` 服務來處理使用者確認。

<code-example language="none" class="code-shell">
  ng generate service dialog
</code-example>

為 `DialogService` 加入一個 `confirm()` 方法，提示使用者確認他們的意圖。
`window.confirm` 是一個阻塞動作，會顯示一個強制回應對話框並等待使用者互動。

<code-example path="router/src/app/dialog.service.ts" header="src/app/dialog.service.ts"></code-example>

它會回傳一個 `Observable`，在使用者最終決定要做什麼時解析：捨棄變更並導覽離開（`true`），或保留待處理的變更並停留在危機編輯器中（`false`）。

{@a CanDeactivate}

產生一個守衛，檢查元件中是否存在 `canDeactivate()` 方法&mdash;任何元件都可以。

<code-example language="none" class="code-shell">
  ng generate guard can-deactivate
</code-example>

將下列程式碼貼入你的守衛。

<code-example path="router/src/app/can-deactivate.guard.ts" header="src/app/can-deactivate.guard.ts"></code-example>

雖然守衛不需要知道哪個元件有 deactivate 方法，但它可以偵測 `CrisisDetailComponent` 元件有 `canDeactivate()` 方法並呼叫它。
守衛不知道任何元件 deactivate 方法的細節，這讓守衛可以重複使用。

或者，你可以為 `CrisisDetailComponent` 建立一個元件專屬的 `CanDeactivate` 守衛。
`canDeactivate()` 方法會提供你 `component` 的目前執行個體、目前的 `ActivatedRoute` 與 `RouterStateSnapshot`，以防你需要存取某些外部資訊。
如果你只想將這個守衛用於這個元件，且需要取得元件的屬性或確認路由器是否應該允許導覽離開它，這會很有用。

<code-example path="router/src/app/can-deactivate.guard.1.ts" header="src/app/can-deactivate.guard.ts (component-specific)"></code-example>

回頭看 `CrisisDetailComponent`，它實作了未儲存變更的確認工作流程。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (excerpt)" region="canDeactivate"></code-example>

請注意，`canDeactivate()` 方法可以同步回傳；如果沒有危機或沒有待處理的變更，它會立即回傳 `true`。
但它也可以回傳 `Promise` 或 `Observable`，路由器會等待它解析為真值（導覽）或假值（停留在目前路由）。

使用 `canDeactivate` 陣列屬性，將 `Guard` 加入 `crisis-center-routing.module.ts` 中的危機詳細資料路由。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.3.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (can deactivate guard)"></code-example>

現在你已經為使用者提供了防止未儲存變更遺失的保障。

{@a Resolve}

{@a resolve-guard}

### _Resolve_：預先擷取元件資料

在 `Hero Detail` 與 `Crisis Detail` 中，應用程式會等到路由被啟用後才擷取對應的英雄或危機。

如果你使用的是真實世界的 API，從伺服器回傳要顯示的資料之前可能會有若干延遲。
你不會希望在等待資料時顯示一個空白元件。

若要改善這個行為，你可以使用解析器從伺服器預先擷取資料，讓它在路由被啟用的那一刻就準備好。
這也讓你可以在路由到元件之前處理錯誤。
對於沒有記錄的 `id`，導覽到危機詳細資料是沒有意義的。
把使用者送回只顯示有效危機中心的 `Crisis List` 會更好。

總之，你希望延遲渲染被路由的元件，直到所有必要的資料都擷取完成為止。


{@a fetch-before-navigating}

#### 在導覽之前擷取資料

目前，`CrisisDetailComponent` 會擷取所選的危機。
如果找不到危機，路由器會導覽回危機清單檢視。

如果這一切都先處理好、在路由被啟用之前完成，體驗可能會更好。
`CrisisDetailResolver` 服務可以在啟用路由並建立 `CrisisDetailComponent` _之前_，擷取一個 `Crisis`，或在 `Crisis` 不存在時導覽離開。

在 `Crisis Center` 功能區內產生一個 `CrisisDetailResolver` 服務檔案。

<code-example language="none" class="code-shell">
  ng generate service crisis-center/crisis-detail-resolver
</code-example>

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.1.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts (generated)"></code-example>

將 `CrisisDetailComponent.ngOnInit()` 中危機擷取邏輯的相關部分，移到 `CrisisDetailResolverService` 中。
匯入 `Crisis` 模型、`CrisisService` 與 `Router`，讓你在無法擷取危機時可以導覽至別處。

明確地實作型別為 `Crisis` 的 `Resolve` 介面。

注入 `CrisisService` 與 `Router`，並實作 `resolve()` 方法。
該方法可以回傳 `Promise`、`Observable`，或同步的回傳值。

`CrisisService.getCrisis()` 方法會回傳一個 observable，目的是防止路由在資料擷取完成之前載入。
`Router` 守衛要求 observable 必須 `complete`，這表示它已發出它的所有值。
你使用引數為 `1` 的 `take` 運算子，確保 `Observable` 在從 `getCrisis()` 方法回傳的 Observable 擷取第一個值之後完成。

如果它沒有回傳有效的 `Crisis`，就回傳一個空的 `Observable`，取消先前進行中通往 `CrisisDetailComponent` 的導覽，並將使用者導覽回 `CrisisListComponent`。
更新後的解析器服務如下所示：

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts"></code-example>

在 `crisis-center-routing.module.ts` 中匯入這個解析器，並將 `resolve` 物件加入 `CrisisDetailComponent` 路由設定。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.4.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (resolver)"></code-example>

`CrisisDetailComponent` 不應該再擷取危機。
當你重新設定路由時，你改變了危機所在的位置。
改為更新 `CrisisDetailComponent`，從 `ActivatedRoute.data.crisis` 屬性取得危機；

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (ngOnInit v2)" region="ngOnInit"></code-example>

請注意以下兩個重點：

1. 路由器的 `Resolve` 介面是選擇性的。
`CrisisDetailResolverService` 不繼承任何基底類別。
路由器會尋找該方法，如果找到了就呼叫它。

1. 只要使用者可能導覽離開，路由器就會呼叫解析器，所以你不需要為每個使用情境編寫程式碼。


這個里程碑的相關危機中心程式碼如下。

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

在[路由參數](#optional-route-parameters)一節中，你只處理了特定於路由的參數。
不過，你可以使用查詢參數來取得所有路由都可用的選用參數。

[Fragment](https://en.wikipedia.org/wiki/Fragment_identifier) 指的是頁面上以 `id` 屬性識別的特定元素。

更新 `AuthGuard` 以提供一個在導覽至另一個路由後仍保留的 `session_id` 查詢。

加入一個 `anchor` 元素，讓你可以跳到頁面上的某個特定位置。

在導覽至 `/login` 路由的 `router.navigate()` 方法中加入 `NavigationExtras` 物件。

<code-example path="router/src/app/auth/auth.guard.4.ts" header="src/app/auth/auth.guard.ts (v3)"></code-example>

你也可以在導覽時保留查詢參數與 fragment，不必在導覽時重新提供。
在 `LoginComponent` 中，你會在 `router.navigateUrl()` 函式的第二個引數中加入一個_物件_，並提供 `queryParamsHandling` 與 `preserveFragment`，把目前的查詢參數與 fragment 傳遞到下一個路由。

<code-example path="router/src/app/auth/login/login.component.ts" header="src/app/auth/login/login.component.ts (preserve)" region="preserve"></code-example>

<div class="alert is-helpful">

`queryParamsHandling` 功能也提供一個 `merge` 選項，它會在導覽時保留並合併目前的查詢參數與提供的查詢參數。

</div>

若要在登入後導覽至管理儀表板路由，請更新 `admin-dashboard.component.ts` 以處理查詢參數與 fragment。

<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (v2)"></code-example>

查詢參數與 fragment 也可以透過 `ActivatedRoute` 服務取得。
和路由參數一樣，查詢參數與 fragment 是以 `Observable` 的形式提供。
更新後的危機管理元件會使用 `AsyncPipe` 將 `Observable` 直接傳入範本。

現在，你可以點選「Admin」按鈕，它會帶你到附有提供的 `queryParamMap` 與 `fragment` 的登入頁面。
點選登入按鈕後，請注意你已被重新導向至 `Admin Dashboard` 頁面，查詢參數與 fragment 在網址列中仍然完整保留。

你可以使用這些跨頁面提供的持久資訊，來處理需要在各頁面間提供的事物，例如驗證權杖或工作階段 ID。

<div class="alert is-helpful">

`query params` 與 `fragment` 也可以分別使用帶有 `queryParamsHandling` 與 `preserveFragment` 繫結的 `RouterLink` 來保留。

</div>


{@a asynchronous-routing}

## 里程碑 6：非同步路由

在完成這些里程碑的過程中，應用程式自然變得越來越大。
在某個時候，應用程式載入會花很長的時間。

為了解決這個問題，請使用非同步路由，它會在需要時延遲載入功能模組。
延遲載入有多項好處。

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

把 `admin-routing.module.ts` 中的 `admin` 路徑從 `'admin'` 改為空字串 `''`，也就是空路徑。

使用空路徑路由將路由分組在一起，而不會在 URL 中加入任何額外的路徑區段。
使用者仍會造訪 `/admin`，而 `AdminComponent` 仍作為包含子路由的路由元件。

開啟 `AppRoutingModule`，並在其 `appRoutes` 陣列中加入一個新的 `admin` 路由。

給它一個 `loadChildren` 屬性，而不是 `children` 屬性。
`loadChildren` 屬性接受一個函式，該函式會使用瀏覽器內建的延遲載入程式碼語法（動態匯入 `import('...')`）回傳一個 promise。
路徑是 `AdminModule` 的位置（相對於應用程式根目錄）。
在程式碼被要求並載入後，`Promise` 會解析為一個包含 `NgModule` 的物件，在這個例子中就是 `AdminModule`。

<code-example path="router/src/app/app-routing.module.5.ts" region="admin-1" header="app-routing.module.ts (load children)"></code-example>

<div class="alert is-important">

*注意*：使用絕對路徑時，`NgModule` 檔案位置必須以 `src/app` 開頭才能正確解析。若要使用絕對路徑進行自訂[路徑對應](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)，你必須在專案的 `tsconfig.json` 中設定 `baseUrl` 與 `paths` 屬性。

</div>

當路由器導覽至這個路由時，它會使用 `loadChildren` 字串動態載入 `AdminModule`。
接著它會把 `AdminModule` 的路由加入目前的路由設定。
最後，它會載入要求的目的地管理元件的路由。

延遲載入與重新設定只會發生一次，也就是在第一次要求該路由時；模組與路由在後續要求時會立即提供。


<div class="alert is-helpful">

Angular 提供了一個內建的模組載入器，支援 SystemJS 以非同步方式載入模組。如果你使用的是其他打包工具（例如 Webpack），你會使用 Webpack 的機制來非同步載入模組。

</div>

最後一步，把管理功能集從主應用程式中分離。
根 `AppModule` 既不應載入也不應參照 `AdminModule` 或其檔案。

在 `app.module.ts` 中，從檔案頂部移除 `AdminModule` 的匯入陳述式，並從 NgModule 的 `imports` 陣列中移除 `AdminModule`。

{@a can-load-guard}

### `CanLoad`：守衛功能模組的未授權載入

你已經使用 `CanActivate` 守衛來保護 `AdminModule`，防止未經授權的使用者存取管理功能區。
如果使用者未獲授權，它會重新導向至登入頁面。

但是，即使使用者無法造訪其任何元件，路由器仍在載入 `AdminModule`。
理想情況下，只有在使用者登入時才載入 `AdminModule`。

加入一個 `CanLoad` 守衛，只有在使用者登入_並且_嘗試存取管理功能區時，才載入 `AdminModule`。

現有的 `AuthGuard` 在其 `checkLogin()` 方法中，已經有支援 `CanLoad` 守衛所需的基本邏輯。

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

<a id="預先載入在背景載入功能區"></a>
### 預先載入：在背景載入功能區

除了隨選載入模組之外，你也可以使用預先載入來非同步載入模組。

`AppModule` 在應用程式啟動時會被積極載入，也就是說它會立即載入。
現在 `AdminModule` 只在使用者點選連結時才載入，這稱為延遲載入。

預先載入讓你在背景載入模組，讓資料在使用者啟用特定路由時準備好渲染。
以危機中心為例。
它不是使用者第一個看到的檢視。
預設情況下，Heroes 是第一個檢視。
為了最小的初始酬載與最快的啟動時間，你應該積極載入 `AppModule` 與 `HeroesModule`。

你可以延遲載入危機中心。
但你幾乎可以確定，使用者會在啟動應用程式後的幾分鐘內造訪危機中心。
理想情況下，應用程式啟動時只載入 `AppModule` 與 `HeroesModule`，然後幾乎立即在背景載入 `CrisisCenterModule`。
等到使用者導覽至危機中心時，其模組已載入並準備就緒。

{@a how-preloading}

#### 預先載入如何運作

在每次成功導覽之後，路由器會在其設定中尋找可以預先載入的未載入模組。
它是否預先載入模組、以及預先載入哪些模組，取決於預先載入策略。

`Router` 提供兩種預先載入策略：

* 不預先載入，這是預設值。延遲載入的功能區仍然會隨選載入。
* 預先載入所有延遲載入的功能區。

路由器要麼從不預先載入，要麼預先載入每個延遲載入的模組。
`Router` 也支援[自訂預先載入策略](#custom-preloading)，讓你精細控制要預先載入哪些模組以及何時預先載入。

本節會引導你更新 `CrisisCenterModule`，讓它預設延遲載入，並使用 `PreloadAllModules` 策略載入所有延遲載入的模組。

{@a lazy-load-crisis-center}

#### 延遲載入危機中心

更新路由設定，以延遲載入 `CrisisCenterModule`。
採取你用來為 `AdminModule` 設定延遲載入的相同步驟。

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

這會設定 `Router` 預先載入器立即載入所有延遲載入的路由（帶有 `loadChildren` 屬性的路由）。

當你造訪 `http://localhost:4200` 時，`/heroes` 路由會在啟動時立即載入，路由器會在 `HeroesModule` 載入後立即開始載入 `CrisisCenterModule`。

目前，`AdminModule` 不會預先載入，因為 `CanLoad` 正在封鎖它。

{@a preload-canload}

#### `CanLoad` 封鎖預先載入

`PreloadAllModules` 策略不會載入受 [CanLoad](#can-load-guard) 守衛保護的功能區。

你在幾個步驟之前為 `AdminModule` 中的路由加入了 `CanLoad` 守衛，以封鎖該模組的載入，直到使用者獲得授權為止。
該 `CanLoad` 守衛的優先級高於預先載入策略。

如果你想預先載入模組，同時防範未經授權的存取，請移除 `canLoad()` 守衛方法，僅依靠 [canActivate()](#can-activate-guard) 守衛。

{@a custom-preloading}

### 自訂預先載入策略

在許多情況下，預先載入每個延遲載入的模組效果很好。
然而，考量到低頻寬與使用者指標等因素，你可以為特定功能模組使用自訂預先載入策略。

本節會引導你加入一個自訂策略，它只預先載入 `data.preload` 旗標設為 `true` 的路由。
回想一下，你可以將任何東西加入路由的 `data` 屬性。

在 `AppRoutingModule` 的 `crisis-center` 路由中設定 `data.preload` 旗標。

<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (route data preload)" region="preload-v2"></code-example>

產生一個新的 `SelectivePreloadingStrategy` 服務。

<code-example language="none" class="code-shell">
  ng generate service selective-preloading-strategy
</code-example>

將 `selective-preloading-strategy.service.ts` 的內容替換為下列內容：

<code-example path="router/src/app/selective-preloading-strategy.service.ts" header="src/app/selective-preloading-strategy.service.ts"></code-example>

`SelectivePreloadingStrategyService` 實作了 `PreloadingStrategy`，它有一個方法 `preload()`。

路由器會以兩個引數呼叫 `preload()` 方法：

1. 要考慮的路由。
1. 一個可以非同步載入被路由模組的載入器函式。

`preload` 的實作必須回傳一個 `Observable`。
如果路由確實預先載入，它會回傳呼叫載入器函式所回傳的 observable。
如果路由不預先載入，它會回傳一個 `null` 的 `Observable`。

在這個範例中，`preload()` 方法會在路由的 `data.preload` 旗標為真值時載入該路由。

作為附帶效果，`SelectivePreloadingStrategyService` 會把所選路由的 `path` 記錄在其公開的 `preloadedModules` 陣列中。

很快地，你會擴充 `AdminDashboardComponent`，注入這個服務並顯示其 `preloadedModules` 陣列。

但首先，對 `AppRoutingModule` 做幾處變更。

1. 將 `SelectivePreloadingStrategyService` 匯入 `AppRoutingModule`。
1. 將 `forRoot()` 呼叫中的 `PreloadAllModules` 策略替換為這個 `SelectivePreloadingStrategyService`。
1. 將 `SelectivePreloadingStrategyService` 策略加入 `AppRoutingModule` 的 providers 陣列，這樣你就能在應用程式的其他地方注入它。

現在編輯 `AdminDashboardComponent`，顯示預先載入路由的記錄。

1. 匯入 `SelectivePreloadingStrategyService`。
1. 將它注入儀表板的建構子。
1. 更新範本，顯示策略服務的 `preloadedModules` 陣列。

現在檔案如下所示：

<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (preloaded modules)"></code-example>

一旦應用程式載入初始路由，`CrisisCenterModule` 就會被預先載入。
登入 `Admin` 功能區，並注意 `crisis-center` 列在 `Preloaded Modules` 中，即可驗證這一點。
它也會記錄到瀏覽器的主控台。

{@a redirect-advanced}

### 使用重新導向遷移 URL

你已設定好在應用程式中導覽的路由，並以命令式與宣告式方式使用導覽。
但和任何應用程式一樣，需求會隨時間改變。
你已從 `HeroListComponent` 與 `HeroDetailComponent` 元件設定了通往 `/heroes` 與 `/hero/:id` 的連結與導覽。
如果有需求要求通往 `heroes` 的連結改為 `superheroes`，你仍會希望先前的 URL 能正確導覽。
你也不想更新應用程式中的每個連結，因此重新導向讓重構路由變得輕而易舉。

{@a url-refactor}

#### 將 `/heroes` 改為 `/superheroes`

本節會引導你將 `Hero` 路由遷移到新的 URL。
`Router` 會在導覽前檢查設定中的重新導向，因此每個重新導向都會在需要時觸發。若要支援這項變更，請在 `heroes-routing.module` 中加入從舊路由到新路由的重新導向。

<code-example path="router/src/app/heroes/heroes-routing.module.ts" header="src/app/heroes/heroes-routing.module.ts (heroes redirects)"></code-example>

請注意兩種不同類型的重新導向。
第一個變更是從 `/heroes` 到 `/superheroes`，不帶任何參數。
第二個變更是從 `/hero/:id` 到 `/superhero/:id`，包含 `:id` 路由參數。
路由器的重新導向也使用強大的模式比對，因此 `Router` 會檢查 URL，並把 `path` 中的路由參數替換為其適當的目的地。
先前，你導覽至例如 `/hero/15` 這樣的 URL，路由參數 `id` 為 `15`。

<div class="alert is-helpful">

`Router` 在使用重新導向時也支援[查詢參數](#query-parameters)與 [fragment](#fragment)。

* 使用絕對重新導向時，`Router` 會使用路由設定中 `redirectTo` 的查詢參數與 fragment。
* 使用相對重新導向時，`Router` 會使用來源 URL 的查詢參數與 fragment。

</div>

目前，空路徑路由會重新導向至 `/heroes`，而它又重新導向至 `/superheroes`。
這行不通，因為 `Router` 在每個路由設定層級只處理一次重新導向。
這可以防止重新導向鏈結，避免導致無止境的重新導向迴圈。

相反地，請更新 `app-routing.module.ts` 中的空路徑路由，讓它重新導向至 `/superheroes`。

<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (superheroes redirect)"></code-example>

`routerLink` 並不綁定於路由設定，因此請更新相關的路由器連結，讓它們在新路由作用中時保持作用中狀態。
更新 `app.component.ts` 範本中 `/heroes` 的 `routerLink`。

<code-example path="router/src/app/app.component.html" header="src/app/app.component.html (superheroes active routerLink)"></code-example>

更新 `hero-detail.component.ts` 中的 `goToHeroes()` 方法，讓它以選擇性路由參數導覽回 `/superheroes`。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.ts" region="redirect" header="src/app/heroes/hero-detail/hero-detail.component.ts (goToHeroes)"></code-example>

重新導向設定完成後，所有先前的路由現在都指向它們的新目的地，兩個 URL 都仍如預期般運作。

{@a inspect-config}

### 檢查路由器的設定

若要判斷你的路由是否真的以[正確的順序](#routing-module-order)被評估，你可以檢查路由器的設定。

做法是注入路由器，並將其 `config` 屬性記錄到主控台。
例如，像這樣更新 `AppModule`，並查看瀏覽器主控台視窗中完成的路由設定。

<code-example path="router/src/app/app.module.7.ts" header="src/app/app.module.ts (inspect the router config)" region="inspect-config"></code-example>

{@a final-app}

## 最終應用程式

若要查看完成的路由器應用程式，請見 <live-example></live-example> 中的最終原始碼。

{@a link-parameters-array}

## 連結參數陣列

連結參數陣列包含路由導覽所需的下列要素：

* 通往目標元件的路由路徑。
* 進入路由 URL 的必要與選用路由參數。

把 `RouterLink` 指令繫結到這樣的陣列，如下所示：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (h-anchor)" region="h-anchor"></code-example>

以下是在指定路由參數時包含兩個元素的陣列：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (nav-to-detail)" region="nav-to-detail"></code-example>

在物件中提供選用的路由參數，如 `{ foo: 'foo' }`：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (cc-query-params)" region="cc-query-params"></code-example>

這三個範例涵蓋了只有一層路由的應用程式的需求。
不過，若有子路由（例如危機中心），就會產生新的連結陣列可能性。

下列精簡的 `RouterLink` 範例，建立在危機中心指定的[預設子路由](guide/router#帶有子路由的危機中心)之上。

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (cc-anchor-w-default)" region="cc-anchor-w-default"></code-example>

請檢視下列事項：

* 陣列的第一個項目識別父路由（`/crisis-center`）。
* 此父路由沒有參數。
* 子路由沒有預設值，所以你需要挑選一個。
* 你要導覽到 `CrisisListComponent`，其路由路徑是 `/`，但你不需要明確加上斜線。

考慮下列路由連結：它從應用程式的根目錄一路導覽到 Dragon Crisis：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (Dragon-anchor)" region="Dragon-anchor"></code-example>

* 陣列的第一個項目識別父路由（`/crisis-center`）。
* 此父路由沒有參數。
* 第二個項目識別關於某個特定危機的子路由詳細資料（`/:id`）。
* 詳細資料子路由需要一個 `id` 路由參數。
* 你把龍危機（Dragon Crisis）的 `id` 加為陣列的第二個項目（`1`）。
* 產生的路徑是 `/crisis-center/1`。

你也可以只用 Crisis Center 路由重新定義 `AppComponent` 範本：

<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (template)" region="template"></code-example>

總之，你可以撰寫具有一層、兩層或更多層路由的應用程式。
連結參數陣列提供了足夠的彈性，可以表示任意路由深度，以及任意合法的路由路徑、（必要的）路由參數與（選用的）路由參數物件序列。

{@a browser-url-styles}

{@a location-strategy}

## `LocationStrategy` 與瀏覽器 URL 樣式

當路由器導覽到新的元件檢視時，它會以該檢視的 URL 更新瀏覽器的位置與歷史紀錄。
由於這是嚴格的本機 URL，瀏覽器不會把這個 URL 送到伺服器，也不會重新載入頁面。

現代 HTML5 瀏覽器支援 <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState</a>，這是一種在不觸發伺服器頁面請求的情況下，變更瀏覽器位置與歷史紀錄的技術。
路由可以組出一個「自然的」URL，與原本需要載入頁面才得到的 URL 無法區分。

以下是這種「HTML5 pushState」樣式的 Crisis Center URL：

<code-example format="nocode">
  localhost:3002/crisis-center/

</code-example>

較舊的瀏覽器在位置 URL 變更時會向伺服器送出頁面請求，除非變更發生在 "#" 之後（稱為「hash」）。
路由可以利用這個例外，以 hash 組出應用程式內的路由 URL。
以下是一個導向 Crisis Center 的「hash URL」。

<code-example format="nocode">
  localhost:3002/src/#/crisis-center/

</code-example>

路由透過兩個 `LocationStrategy` 提供者支援這兩種樣式：

1. `PathLocationStrategy`&mdash;預設的 "HTML5 pushState" 風格。
1. `HashLocationStrategy`&mdash;"雜湊 URL" 風格。

`RouterModule.forRoot()` 函式把 `LocationStrategy` 設為 `PathLocationStrategy`，使它成為預設策略。
你也可以在引導過程中透過覆寫，切換到 `HashLocationStrategy`。

<div class="alert is-helpful">

如需深入瞭解提供者與引導程序，請參閱[依賴注入](guide/dependency-injection#bootstrap)。

</div>

## 選擇路由策略

你必須在專案開發早期就選擇路由策略，因為一旦應用程式上線，網站訪客就會使用並依賴應用程式的 URL 參照。

幾乎所有 Angular 專案都應該使用預設的 HTML5 樣式。
它產生的 URL 更容易讓使用者理解，同時保留了進行伺服器端渲染的選項。

在伺服器上渲染關鍵頁面，是一種能在應用程式首次載入時大幅改善感知響應速度的技巧。
一個原本需要十秒以上才能啟動的應用程式，可以在伺服器上渲染，並在一秒內傳送到使用者的裝置。

只有當應用程式 URL 看起來像正常的網路 URL，且中間沒有井字（`#`）字元時，才能使用這個選項。

## `<base href>`

路由器使用瀏覽器的 <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState</a> 進行導覽。
`pushState` 讓你可以自訂應用程式內的 URL 路徑，例如 `localhost:4200/crisis-center`。
應用程式內的 URL 與伺服器 URL 看起來可以完全一樣。

現代 HTML5 瀏覽器率先支援 `pushState`，因此許多人把這類 URL 稱為「HTML5 風格」URL。

<div class="alert is-helpful">

HTML5 風格導覽是路由器的預設方式。
在 [LocationStrategy 與瀏覽器 URL 風格](#browser-url-styles) 一節中，你可以了解為什麼 HTML5 風格較佳、如何調整它的行為，以及必要時如何切換到較舊的 hash（`#`）風格。

</div>

你必須在應用程式的 `index.html` 中加入 <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">&lt;base href&gt; 元素</a>，`pushState` 路由才能運作。
瀏覽器在參照 CSS 檔案、指令碼與圖片時，會用 `<base href>` 的值作為相對 URL 的前綴。

把 `<base>` 元素加在 `<head>` 標籤之後。
若 `app` 資料夾是應用程式根目錄（本應用程式正是如此），請如下設定 `index.html` 中的 `href` 值。

<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>

### HTML5 URL 與 `<base href>`

雖然路由器預設使用 <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="Browser history push-state">HTML5 pushState</a> 風格，但你必須用 `<base href>` 來設定該策略。

設定該策略的首選方式，是在 `index.html` 的 `<head>` 中加入 <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">&lt;base href&gt; 元素</a> 標籤。

<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>

少了這個標籤，瀏覽器在「深層連結」進入應用程式時，可能無法載入資源（圖片、CSS、指令碼）。

有些開發者可能無法加入 `<base>` 元素，例如因為他們無法存取 `<head>` 或 `index.html`。

這些開發者仍可透過以下兩個步驟使用 HTML5 URL：

1. 為路由器提供適當的 [APP_BASE_HREF][] 值。
1. 所有網路資源都使用根 URL：CSS、圖片、指令碼與範本 HTML 檔案。

{@a hashlocationstrategy}

### `HashLocationStrategy`

在 `AppModule` 中，把帶有 `useHash: true` 的物件作為 `RouterModule.forRoot()` 的第二個引數，即可使用 `HashLocationStrategy`。

<code-example path="router/src/app/app.module.6.ts" header="src/app/app.module.ts (hash URL strategy)"></code-example>

## 路由器參考

下列章節將重點介紹一些核心的路由器概念。

{@a basics-router-imports}

### 路由器匯入

Angular 路由器是一個選用服務，會針對給定的 URL 呈現特定的元件檢視。
它不屬於 Angular 核心，因此位於它自己的函式庫套件 `@angular/router` 中。

像從任何其他 Angular 套件一樣，從中匯入你需要的內容。

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (import)" region="import-router"></code-example>

<div class="alert is-helpful">

更多關於瀏覽器 URL 樣式的資訊，請參閱 [`LocationStrategy` 與瀏覽器 URL 樣式](#browser-url-styles)。

</div>

{@a basics-config}

<a id="configuration"></a>
### 設定

具有路由的 Angular 應用程式只有一個 `Router` 服務的單例執行個體。
當瀏覽器的 URL 變更時，該路由器會尋找對應的 `Route`，從中決定要顯示的元件。

路由器在你設定它之前沒有任何路由。
下列範例建立五個路由定義，透過 `RouterModule.forRoot()` 方法設定路由器，並將結果加入 `AppModule` 的 `imports` 陣列。

<code-example path="router/src/app/app.module.0.ts" header="src/app/app.module.ts (excerpt)"></code-example>

{@a example-config}

`appRoutes` 路由陣列描述如何導覽。
將它傳入模組 `imports` 中的 `RouterModule.forRoot()` 方法，以設定路由器。

每個 `Route` 都把一個 URL `path` 對應到一個元件。
路徑中沒有開頭斜線。
路由器會為你解析並建立最終的 URL，讓你在應用程式檢視之間導覽時，能同時使用相對與絕對路徑。

第二個路由中的 `:id` 是路由參數的權杖。
在如 `/hero/42` 的 URL 中，"42" 是 `id` 參數的值。
對應的 `HeroDetailComponent` 使用該值來找出並呈現 `id` 為 42 的英雄。

第三個路由中的 `data` 屬性，是存放與此特定路由相關聯的任意資料的地方。
`data` 屬性在每個已啟用的路由中都可存取。用它來存放頁面標題、麵包屑文字，以及其他唯讀的靜態資料。
你可以使用 [resolve 守衛](#resolve-guard) 來取得動態資料。

第四個路由中的空路徑，代表應用程式的預設路徑&mdash;也就是 URL 中的路徑為空時（通常在剛開始時就是如此）要前往的地方。
這個預設路由會重新導向到 `/heroes` URL 的路由，因此會顯示 `HeroesListComponent`。

若你需要查看導覽生命週期中正在發生的事件，路由器的預設設定中有 `enableTracing` 選項可供使用。
這會把每個導覽生命週期中發生的每個路由器事件輸出到瀏覽器主控台。
`enableTracing` 只應用於除錯目的。
你可以在傳給 `RouterModule.forRoot()` 方法第二個引數的物件中，設定 `enableTracing: true` 選項。

{@a basics-router-outlet}

### 路由器出口

`RouterOutlet` 是路由器函式庫中的一個指令，用起來就像元件。
它充當一個佔位符，標示範本中路由器應該顯示該出口之元件的位置。

<code-example language="html">
  &lt;router-outlet>&lt;/router-outlet>
  &lt;!-- Routed components go here -->

</code-example>

以上述設定來說，當這個應用程式的瀏覽器 URL 變成 `/heroes` 時，路由器會將該 URL 比對到路由路徑 `/heroes`，並把 `HeroListComponent` 顯示為你放在宿主元件範本中的 `RouterOutlet` 的同層元素。

{@a basics-router-links}

{@a router-link}

### 路由器連結

若要因使用者的某個動作（例如點選錨點標籤）而進行導覽，請使用 `RouterLink`。

請看下列範本：

<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

錨點標籤上的 `RouterLink` 指令讓路由器掌控這些元素。
導覽路徑是固定的，因此你可以把字串指定給 `routerLink`（一種「一次性」繫結）。

若導覽路徑較為動態，你可以繫結到一個回傳路由連結參數陣列的範本運算式，也就是[連結參數陣列](guide/router#連結參數陣列)。
路由器會將該陣列解析為完整的 URL。

{@a router-link-active}

### 作用中路由器連結

`RouterLinkActive` 指令會根據目前的 `RouterState`，切換作用中 `RouterLink` 繫結的 CSS 類別。

在每個錨點標籤上，你會看到一個指向 `RouterLinkActive` 指令的[屬性繫結](guide/template-syntax#property-binding)，看起來像 `routerLinkActive="..."`。

等號 `=` 右邊的範本運算式，包含一個以空格分隔的 CSS 類別字串，當這個連結處於作用中狀態時，路由器會加入這些類別（連結非作用中時則移除）。
你可把 `RouterLinkActive` 指令設為如 `[routerLinkActive]="'active fluffy'"` 這樣的類別字串，或繫結到一個回傳這種字串的元件屬性。

作用中的路由連結會沿著路由樹的每一層向下串聯，因此父與子路由器連結可以同時處於作用中狀態。
若要覆寫這個行為，可以繫結到 `[routerLinkActiveOptions]` 輸入繫結，並使用 `{ exact: true }` 運算式。使用 `{ exact: true }` 後，給定的 `RouterLink` 只有在它的 URL 與目前 URL 完全相符時，才會處於作用中狀態。

{@a basics-router-state}

### 路由器狀態

在每個成功導覽生命週期結束後，路由器會建立一個由 `ActivatedRoute` 物件組成的樹，構成路由器目前的狀態。你可以使用 `Router` 服務與 `routerState` 屬性，從應用程式中的任何地方存取目前的 `RouterState`。

`RouterState` 中的每個 `ActivatedRoute` 都提供方法，可以在路由樹中上下遍歷，從父、子與同層路由取得資訊。

{@a activated-route}

### 已啟用路由

路由路徑與參數可透過注入的路由器服務 [ActivatedRoute](api/router/ActivatedRoute) 取得。
它包含許多有用的資訊，包括：

<table>
  <tr>
    <th>
      屬性
    </th>

    <th>
      說明
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

    一個 `Observable`，包含為路由提供的 `data` 物件。
    也包含來自 [resolve 守衛](#resolve-guard) 的所有已解析值。

    </td>
  </tr>

  <tr>
    <td>
      <code>paramMap</code>
    </td>
    <td>

    一個 `Observable`，包含該路由專屬的必要與[選用參數](#optional-route-parameters)的 [map](api/router/ParamMap)。
    這個 map 支援從同一個參數擷取單一與多個值。

    </td>
  </tr>

  <tr>
    <td>
      <code>queryParamMap</code>
    </td>
    <td>

    一個 `Observable`，包含所有路由都可用的[查詢參數](#query-parameters)的 [map](api/router/ParamMap)。
    這個 map 支援從查詢參數擷取單一與多個值。

    </td>
  </tr>

  <tr>
    <td>
      <code>fragment</code>
    </td>
    <td>

    一個 `Observable`，表示所有路由都可用的 URL [fragment](#fragment)。

    </td>
  </tr>

  <tr>
    <td>
      <code>outlet</code>
    </td>
    <td>

    用來渲染路由的 `RouterOutlet` 的名稱。
    對於未命名的出口，出口名稱是 primary。

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

    當這個路由是[子路由](#child-routing-component)時，該路由的父 `ActivatedRoute`。

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

    包含在目前路由下啟用的所有[子路由](#child-routing-component)。

    </td>
  </tr>
</table>

<div class="alert is-helpful">

有兩個較舊的屬性仍然可用，不過建議使用它們的替代品，因為它們可能在未來的 Angular 版本中被淘汰。

* `params`：一個 `Observable`，包含該路由專屬的必要與[選用參數](#optional-route-parameters)。改用 `paramMap`。

* `queryParams`：一個 `Observable`，包含所有路由都可用的[查詢參數](#query-parameters)。
改用 `queryParamMap`。

</div>

<a id="router-events"></a>
### 路由器事件

在每次導覽期間，`Router` 會透過 `Router.events` 屬性發出導覽事件。
這些事件涵蓋從導覽開始與結束，到中間的許多時間點。下表列出完整的導覽事件清單。

<table>
  <tr>
    <th>
      路由器事件
    </th>

    <th>
      說明
    </th>
  </tr>
  <tr>
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

      一個在 `Router`[延遲載入](#asynchronous-routing)路由設定之前觸發的[事件](api/router/RouteConfigLoadStart)。

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

      一個在導覽被取消時觸發的[事件](api/router/NavigationCancel)。
      這可能在導覽期間[路由守衛](#guards)回傳 false 時發生，
      或是回傳 `UrlTree` 進行重新導向時發生。

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

當你啟用 `enableTracing` 選項時，Angular 會把這些事件記錄到主控台。
如需篩選路由器導覽事件的範例，請參閱 [Angular 中的 Observable](guide/observables-in-angular) 指南的[路由器章節](guide/observables-in-angular#router)。

### 路由器術語

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
      用於把可點選的 HTML 元素繫結到路由的指令。點選帶有繫結到<i>字串</i>或<i>連結參數陣列</i>的 <code>routerLink</code> 指令的元素，會觸發導覽。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLinkActive</code>
    </td>

    <td>
      用於在元素上或其內部所含的相關 <code>routerLink</code> 變成作用中／非作用中時，為 HTML 元素加入／移除類別的指令。
    </td>

  </tr>

  <tr>

    <td>
      <code>ActivatedRoute</code>
    </td>

    <td>
      一個提供給每個路由元件的服務，包含路由專屬資訊，例如路由參數、靜態資料、resolve 資料、全域查詢參數，以及全域 fragment。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterState</code>
    </td>

    <td>
      路由器目前的狀態，包括目前已啟用路由的樹，以及遍歷路由樹的便利方法。
    </td>

  </tr>

  <tr>

    <td>
      <b><i>連結參數陣列</i></b>
    </td>

    <td>
      一個會被路由器解讀為路由指令的陣列。
      你可以把該陣列繫結到 <code>RouterLink</code>，或把陣列作為引數傳給 <code>Router.navigate</code> 方法。
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
