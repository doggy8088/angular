# 應用程式內導覽：路由至檢視

在單頁應用程式中，你透過顯示或隱藏與特定元件對應的畫面部分，來改變使用者看到的內容，而不是到伺服器去取得新頁面。
當使用者執行應用程式的各項工作時，他們需要在你定義的不同[檢視](guide/glossary#view "Definition of view")之間移動。

你會使用 Angular 的 **`Router`** 來處理從一個[檢視](guide/glossary#view)到下一個檢視的導覽。
**`Router`** 會將瀏覽器 URL 解讀為改變檢視的指令，從而實現導覽。

若要探索包含路由器主要功能的範例應用程式，請參閱 <live-example></live-example>。

## 先決條件

在建立路由之前，你應該熟悉下列內容：

* [元件基礎](guide/architecture-components)
* [範本基礎](guide/glossary#template)
* 一個 Angular 應用程式&mdash;你可以使用 [Angular CLI](cli) 產生一個基本的 Angular 應用程式。

如需透過現成的應用程式認識 Angular，請參閱[入門](start)。
如需更深入地體驗建構 Angular 應用程式，請參閱[英雄之旅](tutorial)教學。兩者都會引導你使用元件類別與範本。

{@a basics}
## 產生啟用路由的應用程式

下列指令使用 Angular CLI 產生一個基本的 Angular 應用程式，其中包含一個應用程式路由模組 `AppRoutingModule`，這是一個 NgModule，你可以在其中設定路由。
下列範例中的應用程式名稱是 `routing-app`。

<code-example language="sh">
  ng new routing-app --routing
</code-example>

產生新的應用程式時，CLI 會提示你選擇 CSS 或 CSS 預處理器。
在這個範例中，接受預設的 `CSS`。

### 為路由新增元件

若要使用 Angular 路由器，應用程式至少需要兩個元件，才能從一個導覽到另一個。若要用 CLI 建立元件，請在命令列輸入以下內容，其中 `first` 是你的元件名稱：

<code-example language="sh">
  ng generate component first
</code-example>

對第二個元件重複這個步驟，但給它一個不同的名稱。
這裡的新名稱是 `second`。

<code-example language="sh">
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

{@a getting-route-information}

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

關於 `pathMatch` 的更多細節，請參閱[`pathMatch` 聚光燈](guide/router-tutorial-toh#pathmatch)。

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

  hero$: Observable<Hero>;

  constructor(
    private route: ActivatedRoute,
    private router: Router  ) {}

  ngOnInit() {
    const heroId = this.route.snapshot.paramMap.get('id');
    this.hero$ = this.service.getHero(heroId);
  }

  gotoItems(hero: Hero) {
    const heroId = hero ? hero.id : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that item.
    this.router.navigate(['/heroes', { id: heroId }]);
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

若要使用路由守衛，可以考慮使用[無元件路由](api/router/Route#componentless-routes)，因為這有助於保護子路由。

為你的守衛建立一個服務：

<code-example language="sh">
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

關於實際可運作的範例與更多資訊，請參閱路由教學中[關於路由守衛的一節](guide/router-tutorial-toh#milestone-5-route-guards)。

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

下列精簡的 `RouterLink` 範例，建立在危機中心指定的[預設子路由](guide/router-tutorial-toh#帶有子路由的危機中心)之上。

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

後續的說明會提到 URL 的不同部分。
下圖說明這些部分所指為何：

```
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
```

雖然路由器預設使用 <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="Browser history push-state">HTML5 pushState</a> 風格，但你必須用 `<base href>` 來設定該策略。

設定該策略的首選方式，是在 `index.html` 的 `<head>` 中加入 <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">&lt;base href&gt; 元素</a> 標籤。

<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>

少了這個標籤，瀏覽器在「深層連結」進入應用程式時，可能無法載入資源（圖片、CSS、指令碼）。

有些開發者可能無法加入 `<base>` 元素，例如因為他們無法存取 `<head>` 或 `index.html`。

這些開發者仍可透過以下兩個步驟使用 HTML5 URL：

1. 為路由器提供適當的 `APP_BASE_HREF` 值。
1. 所有網路資源都使用根 URL（帶有 `authority` 的 URL）：CSS、圖片、指令碼與範本 HTML 檔案。

* `<base href>` 的 `path` 應以 "/" 結尾，因為瀏覽器會忽略 `path` 中最右側 "`/`" 之後的字元。
* 若 `<base href>` 包含 `query` 部分，只有當頁面中連結的 `path` 為空且沒有 `query` 時，才會使用該 `query`。
這表示 `<base href>` 中的 `query` 只有在使用 `HashLocationStrategy` 時才會被包含。
* 若頁面中的連結是根 URL（帶有 `authority`），就不會使用 `<base href>`。
如此一來，帶有 authority 的 `APP_BASE_HREF` 會使 Angular 建立的所有連結都忽略 `<base href>` 的值。
* `<base href>` 中的 fragment _絕不_ 會被保留。

關於 `<base href>` 如何用來建構目標 URI 的更完整資訊，請參閱 [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) 中關於轉換參照的章節。

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
你可以使用 [resolve 守衛](guide/router-tutorial-toh#resolve-guard) 來取得動態資料。

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

在每個錨點標籤上，你會看到一個指向 `RouterLinkActive` 指令的[屬性繫結](guide/property-binding)，看起來像 `routerLinkActive="..."`。

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
    也包含來自 [resolve 守衛](guide/router-tutorial-toh#resolve-guard) 的所有已解析值。

    </td>
  </tr>

  <tr>
    <td>
      <code>paramMap</code>
    </td>
    <td>

    一個 `Observable`，包含該路由專屬的必要與[選用參數](guide/router-tutorial-toh#optional-route-parameters)的 [map](api/router/ParamMap)。
    這個 map 支援從同一個參數擷取單一與多個值。

    </td>
  </tr>

  <tr>
    <td>
      <code>queryParamMap</code>
    </td>
    <td>

    一個 `Observable`，包含所有路由都可用的[查詢參數](guide/router-tutorial-toh#query-parameters)的 [map](api/router/ParamMap)。
    這個 map 支援從查詢參數擷取單一與多個值。

    </td>
  </tr>

  <tr>
    <td>
      <code>fragment</code>
    </td>
    <td>

    一個 `Observable`，表示所有路由都可用的 URL [fragment](guide/router-tutorial-toh#fragment)。

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

    當這個路由是[子路由](guide/router-tutorial-toh#child-routing-component)時，該路由的父 `ActivatedRoute`。

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

    包含在目前路由下啟用的所有[子路由](guide/router-tutorial-toh#child-routing-component)。

    </td>
  </tr>
</table>

<div class="alert is-helpful">

有兩個較舊的屬性仍然可用，不過建議使用它們的替代品，因為它們可能在未來的 Angular 版本中被淘汰。

* `params`：一個 `Observable`，包含該路由專屬的必要與[選用參數](guide/router-tutorial-toh#optional-route-parameters)。改用 `paramMap`。

* `queryParams`：一個 `Observable`，包含所有路由都可用的[查詢參數](guide/router-tutorial-toh#query-parameters)。
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

      一個在 `Router`[延遲載入](guide/router-tutorial-toh#asynchronous-routing)路由設定之前觸發的[事件](api/router/RouteConfigLoadStart)。

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
      這可能在導覽期間[路由守衛](guide/router-tutorial-toh#guards)回傳 false 時發生，
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
