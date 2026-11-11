# 常見的路由任務

本指南涵蓋在應用程式中使用 Angular 路由時的其他一些常見任務。

<a id="basics"></a>

## 產生啟用路由的應用程式

下列指令使用 Angular CLI 產生一個基本的 Angular 應用程式，其中包含一個應用程式路由模組 `AppRoutingModule`，這是一個 NgModule，你可以在其中設定路由。
下列範例中的應用程式名稱是 `routing-app`。

<code-example format="shell" language="shell">

ng new routing-app --routing --defaults

</code-example>

### 為路由新增元件

若要使用 Angular 路由器，應用程式至少需要兩個元件，才能從一個導覽到另一個。若要用 CLI 建立元件，請在命令列輸入以下內容，其中 `first` 是你的元件名稱：

<code-example format="shell" language="shell">

ng generate component first

</code-example>

對第二個元件重複這個步驟，但給它一個不同的名稱。這裡的新名稱是 `second`。

<code-example format="shell" language="shell">

ng generate component second

</code-example>

CLI 會自動附加 `Component`，所以如果你寫的是 `first-component`，你的元件就會是 `FirstComponentComponent`。

<a id="basics-base-href"></a>

<div class="alert is-helpful">

<header><code>&lt;base href&gt;</code></header>

本指南適用於以 CLI 產生的 Angular 應用程式。
如果你是手動建立，請確認你的 index.html 檔案的 `<head>` 中有 `<base href="/">`。
這裡假設 `app` 資料夾是應用程式根目錄，並使用 `"/"`。

</div>

### 匯入你的新元件

若要使用你的新元件，請在檔案頂部將它們匯入 `AppRoutingModule`，如下所示：

<code-example header="AppRoutingModule (excerpt)">

import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';

</code-example>

<a id="basic-route"></a>

## 定義基本路由

建立一條路由有三個基本組成部分。

把 `AppRoutingModule` 匯入 `AppModule`，並加入 `imports` 陣列。

Angular CLI 會替你執行這個步驟。
不過，如果你是手動建立應用程式，或是使用現有的非 CLI 應用程式，請確認匯入與設定都正確。
以下是使用 CLI 加上 `--routing` 旗標時預設的 `AppModule`。

<code-example header="Default CLI AppModule with routing" path="router/src/app/app.module.8.ts"></code-example>

1. 把 `RouterModule` 與 `Routes` 匯入你的路由模組。

    Angular CLI 會自動執行這個步驟。
    CLI 也會為你的路由建立一個 `Routes` 陣列，並為 `@NgModule()` 設定 `imports` 與 `exports` 陣列。

    <code-example header="CLI application routing module" path="router/src/app/app-routing.module.7.ts"></code-example>

1. 在你的 `Routes` 陣列中定義路由。

這個陣列中的每條路由都是一個包含兩個屬性的 JavaScript 物件。第一個屬性 `path` 定義路由的 URL 路徑。第二個屬性 `component` 定義 Angular 應為對應路徑使用的元件。

    <code-example header="AppRoutingModule (excerpt)" path="router/src/app/app-routing.module.8.ts" region="routes"></code-example>

1. 把你的路由加入應用程式。

定義好路由後，將它們加入你的應用程式。首先，為這兩個元件加入連結。把你想加入路由的錨點標籤指定給 `routerLink` 屬性，並將屬性值設為使用者點選每個連結時要顯示的元件。接著，更新你的元件範本，加入 `<router-outlet>`。這個元素會告訴 Angular 以所選路由的元件更新應用程式檢視。

    <code-example header="Template with routerLink and router-outlet" path="router/src/app/app.component.7.html"></code-example>

<a id="route-order"></a>

### 路由順序

路由的順序很重要，因為 `Router` 在比對路由時使用先匹配先贏（first-match wins）策略，所以較具體的路由應放在較不具體的路由之前。
先列出靜態路徑的路由，接著是符合預設路由的空路徑路由。
[萬用字元路由](guide/router#設定萬用字元路由)放在最後，因為它符合每個 URL，且 `Router` 只在沒有其他路由先符合時才會選擇它。

<a id="getting-route-information"></a>

## 取得路由資訊

使用者在應用程式中導覽時，你常會想把資訊從一個元件傳遞到另一個元件。
例如，假設有一個顯示雜貨購物清單的應用程式。
清單中的每個項目都有唯一的 `id`。
若要編輯某個項目，使用者會點選 Edit 按鈕，開啟 `EditGroceryItem` 元件。
你希望這個元件能取得該雜貨項目的 `id`，以便向使用者顯示正確的資訊。

可以使用路由把這類資訊傳遞給應用程式的元件。
做法是使用 `provideRouter` 的 [withComponentInputBinding](api/router/withComponentInputBinding) 功能，或 `RouterModule.forRoot` 的 `bindToComponentInputs` 選項。

若要從路由取得資訊：

1. 把 `withComponentInputBinding` 功能加入 `provideRouter` 方法。

    <code-example header="provideRouter feature" path="router/src/app/app-routing.module.11.ts" region="withComponentInputBinding"></code-example>

1. 更新元件，讓它有一個名稱與參數相符的 `Input`。

    <code-example header="The component input (excerpt)" path="router/src/app/heroes/hero-detail/hero-detail.component.4.ts" region="id-input"></code-example>

    <div class="alert is-helpful">

注意：<br />
你可以把所有以鍵值對表示的路由資料繫結到元件輸入：靜態或已解析的路由資料、路徑參數、矩陣參數與查詢參數。
若你想使用父元件的路由資訊，你需要設定路由器的 {@link paramsInheritanceStrategy} 選項：
`withRouterConfig({paramsInheritanceStrategy: 'always'})`
    </div>

<a id="wildcard-route-how-to"></a>

## 設定萬用字元路由

運作良好的應用程式應該要能妥善處理使用者嘗試導覽到應用程式中不存在的部分。
若要為你的應用程式加入這項功能，你需要設定萬用字元路由。
只要請求的 URL 不符合任何路由器路徑，Angular 路由器就會選擇這條路由。

若要設定萬用字元路由，請將下列程式碼加入你的 `routes` 定義。

<code-example header="AppRoutingModule (excerpt)">

{ path: '**', component: &lt;component-name&gt; }

</code-example>

兩個星號 `**` 向 Angular 表明這個 `routes` 定義是一條萬用字元路由。
對於 `component` 屬性，你可以定義應用程式中的任何元件。
常見的選擇包括應用程式專屬的 `PageNotFoundComponent`，你可以定義它來向使用者[顯示 404 頁面](guide/router#404-page-how-to)；或是重新導向到應用程式的主要元件。
萬用字元路由是最後一條路由，因為它符合任何 URL。
關於路由順序為何重要，詳情請參閱[路由順序](guide/router#路由順序)。

<a id="404-page-how-to"></a>

## 顯示 404 頁面

若要顯示 404 頁面，請設定一條[萬用字元路由](guide/router#wildcard-route-how-to)，並把 `component` 屬性設為你想用於 404 頁面的元件，如下所示：

<code-example header="AppRoutingModule (excerpt)" path="router/src/app/app-routing.module.8.ts" region="routes-with-wildcard"></code-example>

最後一條 `path` 為 `**` 的路由是萬用字元路由。
若請求的 URL 與清單中較前面的任何路徑都不符，路由會選取這條路由，並把使用者送往 `PageNotFoundComponent`。

## 設定重新導向

若要設定重新導向，請設定一條路由，包含你想從其重新導向的 `path`、你想重新導向到的 `component`，以及一個告訴路由器如何比對 URL 的 `pathMatch` 值。

<code-example header="AppRoutingModule (excerpt)" path="router/src/app/app-routing.module.8.ts" region="redirect"></code-example>

在這個範例中，第三條路由是重新導向，讓路由器預設使用 `first-component` 路由。
請注意，這個重新導向排在萬用字元路由之前。
這裡的 `path: ''` 表示使用初始的相對 URL \(`''`\)。

關於 `pathMatch` 的更多細節，請參閱[`pathMatch` 聚光燈](guide/router-tutorial-toh#pathmatch)。

<a id="nesting-routes"></a>

## 巢狀路由

隨著應用程式愈來愈複雜，你可能想建立相對於根元件以外其他元件的路由。
這類巢狀路由稱為子路由。
這表示你要在應用程式中再加入第二個 `<router-outlet>`，因為它是在 `AppComponent` 的 `<router-outlet>` 之外額外增加的。

在這個範例中，有兩個額外的子元件：`child-a` 與 `child-b`。
這裡，`FirstComponent` 有自己的 `<nav>`，以及除了 `AppComponent` 中那個之外的第二個 `<router-outlet>`。

<code-example header="In the template" path="router/src/app/app.component.8.html" region="child-routes"></code-example>

子路由與其他路由一樣，都需要 `path` 與 `component`。
唯一的差別是，子路由要放在父路由內的 `children` 陣列中。

<code-example header="AppRoutingModule (excerpt)" path="router/src/app/app-routing.module.9.ts" region="child-routes"></code-example>

<a id="setting-the-page-title"></a>

## 設定頁面標題

應用程式中的每個頁面都應該有唯一的標題，這樣才能在瀏覽器歷史中辨識它們。
`Router` 使用 `Route` 設定中的 `title` 屬性來設定文件標題。

<code-example header="AppRoutingModule (excerpt)" path="router/src/app/app-routing.module.10.ts" region="page-title"></code-example>

<div class="alert is-helpful">

注意：<br />
`title` 屬性遵循與靜態路由 `data` 相同的規則，以及實作 `ResolveFn` 的動態值。

</div>

你也可以透過擴展 `TitleStrategy` 來提供自訂的標題策略。

<code-example header="AppRoutingModule (excerpt)" path="router/src/app/app-routing.module.10.ts" region="custom-page-title"></code-example>

<a id="using-relative-paths"></a>

## 使用相對路徑

相對路徑讓你定義相對於目前 URL 區段的路徑。
下列範例顯示通往另一個元件 `second-component` 的相對路由。
`FirstComponent` 與 `SecondComponent` 在樹狀結構中位於同一層級，然而，通往 `SecondComponent` 的連結位於 `FirstComponent` 之內，這表示路由器必須先上升一層，再進入第二個目錄，才能找到 `SecondComponent`。
不必寫出通往 `SecondComponent` 的完整路徑，使用 `../` 表示法上升一層即可。

<code-example header="In the template" path="router/src/app/app.component.8.html" region="relative-route"></code-example>

除了 `../` 之外，也可以使用 `./` 或不加開頭斜線來指定目前層級。

### 指定相對路由

若要指定相對路由，請使用 `NavigationExtras` 的 `relativeTo` 屬性。
在元件類別中，從 `@angular/router` 匯入 `NavigationExtras`。

接著在你的導覽方法中使用 `relativeTo`。
在連結參數陣列（這裡包含 `items`）之後，加入一個物件，將 `relativeTo` 屬性設為 `ActivatedRoute`，即 `this.route`。

<code-example header="RelativeTo" path="router/src/app/app.component.4.ts" region="relative-to">

The `navigate()` arguments configure the router to use the current route as a basis upon which to append `items`.

</code-example>

`goToItems()` 方法將目的 URI 解讀為相對於已啟用路由，並導覽到 `items` 路由。

## 存取查詢參數與 fragment

有時候，應用程式的某項功能需要存取路由的一部分，例如查詢參數或 fragment。
此階段教學中的英雄之旅（Tour of Heroes）應用程式使用清單檢視，你可以點選英雄來查看詳情。
路由器使用 `id` 來顯示正確的英雄詳情。

首先，在你想從其導覽的元件中，匯入下列成員。

<code-example header="Component import statements (excerpt)">

import { ActivatedRoute } from '&commat;angular/router';
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

heroes&dollar;: Observable&lt;Hero[]&gt;;
selectedId: number;
heroes = HEROES;

ngOnInit() {
  this.heroes&dollar; = this.route.paramMap.pipe(
    switchMap(params =&gt; {
      this.selectedId = Number(params.get('id'));
      return this.service.getHeroes();
    })
  );
}

</code-example>

接著，在你想導覽到的元件中，匯入下列成員。

<code-example header="Component 2 (excerpt)">

import { Router, ActivatedRoute, ParamMap } from '&commat;angular/router';
import { Observable } from 'rxjs';

</code-example>

在元件類別的建構函式中注入 `ActivatedRoute` 與 `Router`，讓這個元件可以使用它們：

<code-example header="Component 2 (excerpt)">

hero&dollar;: Observable&lt;Hero&gt;;

constructor(
  private route: ActivatedRoute,
  private router: Router  ) {}

ngOnInit() {
  const heroId = this.route.snapshot.paramMap.get('id');
  this.hero&dollar; = this.service.getHero(heroId);
}

gotoItems(hero: Hero) {
  const heroId = hero ? hero.id : null;
  // Pass along the hero id if available
  // so that the HeroList component can select that item.
  this.router.navigate(['/heroes', { id: heroId }]);
}

</code-example>

<a id="lazy-loading"></a>

## 延遲載入

你可以設定路由來延遲載入模組，這表示 Angular 只在需要時才載入模組，而不是在應用程式啟動時載入所有模組。
此外，你可以在背景預先載入應用程式的部分內容，以改善使用者體驗。

關於延遲載入與預先載入的更多資訊，請參閱專門的指南[延遲載入 NgModules](guide/lazy-loading-ngmodules)。

## 防止未經授權的存取

使用路由守衛來防止使用者在未經授權的情況下導覽到應用程式的某些部分。
Angular 提供下列路由守衛：

*   [`canActivate`](api/router/CanActivateFn)
*   [`canActivateChild`](api/router/CanActivateChildFn)
*   [`canDeactivate`](api/router/CanDeactivateFn)
*   [`canMatch`](api/router/CanMatchFn)
*   [`resolve`](api/router/ResolveFn)
*   [`canLoad`](api/router/CanLoadFn)

若要使用路由守衛，可以考慮使用[無元件路由](api/router/Route#componentless-routes)，因為這有助於保護子路由。

為你的守衛建立一個檔案：

<code-example format="shell" language="shell">

ng generate guard your-guard

</code-example>

在你的守衛檔案中，加入你想使用的守衛函式。
下列範例使用 `canActivateFn` 來保護路由。

<code-example header="guard (excerpt)">

export const yourGuardFunction: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) => {
      // your  logic goes here
  }
</code-example>
在你的路由模組中，在 `routes` 設定裡使用適當的屬性。
在這裡，`canActivate` 會告訴路由器居中協調前往這條特定路由的導覽。
<code-example header="Routing module (excerpt)">
{
  path: '/your-path',
  component: YourComponent,
  canActivate: [yourGuardFunction],
}

</code-example>

關於實際可運作的範例與更多資訊，請參閱路由教學中[關於路由守衛的一節](guide/router-tutorial-toh#里程碑-5：路由守衛)。

## 連結參數陣列

連結參數陣列包含路由導覽所需的下列要素：

- 通往目標元件的路由路徑
- 進入路由 URL 的必要與選用路由參數

把 `RouterLink` 指令繫結到這樣的陣列，如下所示：

<code-example header="src/app/app.component.ts (h-anchor)" path="router/src/app/app.component.3.ts" region="h-anchor"></code-example>

以下是在指定路由參數時包含兩個元素的陣列：

<code-example header="src/app/heroes/hero-list/hero-list.component.html (nav-to-detail)" path="router/src/app/heroes/hero-list/hero-list.component.1.html" region="nav-to-detail"></code-example>

在物件中提供選用的路由參數，如 `{ foo: 'foo' }`：

<code-example header="src/app/app.component.ts (cc-query-params)" path="router/src/app/app.component.3.ts" region="cc-query-params"></code-example>

這三個範例涵蓋了只有一層路由的應用程式的需求。
不過，若有子路由（例如危機中心），就會產生新的連結陣列可能性。

下列精簡的 `RouterLink` 範例，建立在危機中心指定的[預設子路由](guide/router-tutorial-toh#帶有子路由的危機中心)之上。

<code-example header="src/app/app.component.ts (cc-anchor-w-default)" path="router/src/app/app.component.3.ts" region="cc-anchor-w-default"></code-example>

請檢視下列事項：

- 陣列的第一個項目識別父路由 \(`/crisis-center`\)
- 此父路由沒有參數
- 子路由沒有預設值，所以你需要挑選一個
- 你要導覽到 `CrisisListComponent`，其路由路徑是 `/`，但你不需要明確加上斜線

考慮下列路由連結：它從應用程式的根目錄一路導覽到 Dragon Crisis：

<code-example header="src/app/app.component.ts (Dragon-anchor)" path="router/src/app/app.component.3.ts" region="Dragon-anchor"></code-example>

*   陣列的第一個項目識別父路由 \(`/crisis-center`\)
*   此父路由沒有參數
*   第二個項目識別關於某個特定危機的子路由詳細資料 \(`/:id`\)
*   詳細資料子路由需要一個 `id` 路由參數
*   你把龍危機（Dragon Crisis）的 `id` 加為陣列的第二個項目 \(`1`\)
*   產生的路徑是 `/crisis-center/1`

你也可以只用 Crisis Center 路由重新定義 `AppComponent` 範本：

<code-example header="src/app/app.component.ts (template)" path="router/src/app/app.component.3.ts" region="template"></code-example>

總之，你可以撰寫具有一層、兩層或更多層路由的應用程式。
連結參數陣列提供了足夠的彈性，可以表示任意路由深度，以及任意合法的路由路徑、（必要的）路由參數與（選用的）路由參數物件序列。

<a id="browser-url-styles"></a>
<a id="location-strategy"></a>

## `LocationStrategy` 與瀏覽器 URL 樣式

當路由導覽到新的元件檢視時，它會以該檢視的 URL 更新瀏覽器的位置與歷史紀錄。

現代 HTML5 瀏覽器支援 [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries "HTML5 browser history push-state")，這是一種在不觸發伺服器頁面請求的情況下，變更瀏覽器位置與歷史紀錄的技術。
路由可以組出一個「自然的」URL，與原本需要載入頁面才得到的 URL 無法區分。

以下是這種「HTML5 pushState」樣式的 Crisis Center URL：

<code-example format="none" language="http">

localhost:3002/crisis-center

</code-example>

較舊的瀏覽器在位置 URL 變更時會向伺服器送出頁面請求，除非變更發生在 "#" 之後（稱為「hash」）。
路由可以利用這個例外，以 hash 組出應用程式內的路由 URL。
以下是一個導向 Crisis Center 的「hash URL」。

<code-example format="none" language="http">

localhost:3002/src/#/crisis-center

</code-example>

路由透過兩個 `LocationStrategy` 提供者支援這兩種樣式：

| 提供者                | 詳細說明 |
|:---                    |:---     |
| `PathLocationStrategy` | 預設的 "HTML5 pushState" 風格。 |
| `HashLocationStrategy` | "雜湊 URL" 風格。                |

`RouterModule.forRoot()` 函式把 `LocationStrategy` 設為 `PathLocationStrategy`，使它成為預設策略。
你也可以在引導過程中透過覆寫，切換到 `HashLocationStrategy`。

<div class="alert is-helpful">

如需深入瞭解提供者與引導程序，請參閱[依賴注入](guide/dependency-injection-providers)。

</div>

## 選擇路由策略

你必須在專案開發早期就選擇路由策略，因為一旦應用程式上線，網站訪客就會使用並依賴應用程式的 URL 參照。

幾乎所有 Angular 專案都應該使用預設的 HTML5 樣式。
它產生的 URL 更容易讓使用者理解，同時保留了進行伺服器端渲染的選項。

在伺服器上渲染關鍵頁面，是一種能在應用程式首次載入時大幅改善感知響應速度的技巧。
一個原本需要十秒以上才能啟動的應用程式，可以在伺服器上渲染，並在一秒內傳送到使用者的裝置。

只有當應用程式 URL 看起來像正常的網路 URL，且中間沒有井字 \(`#`\) 字元時，才能使用這個選項。

## `<base href>`

路由器使用瀏覽器的 [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries "HTML5 browser history push-state") 進行導覽。
`pushState` 讓你可以自訂應用程式內的 URL 路徑，例如 `localhost:4200/crisis-center`。
應用程式內的 URL 與伺服器 URL 看起來可以完全一樣。

現代 HTML5 瀏覽器率先支援 `pushState`，因此許多人把這類 URL 稱為「HTML5 風格」URL。

<div class="alert is-helpful">

HTML5 風格導覽是路由器的預設方式。
在 [LocationStrategy 與瀏覽器 URL 風格](#browser-url-styles) 一節中，你可以了解為什麼 HTML5 風格較佳、如何調整它的行為，以及必要時如何切換到較舊的 hash \(`#`\) 風格。

</div>

你必須在應用程式的 `index.html` 中加入 [`<base href>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/base "base href")，`pushState` 路由才能運作。
瀏覽器在參照 CSS 檔案、指令碼與圖片時，會用 `<base href>` 的值作為相對 URL 的前綴。

把 `<base>` 元素加在 `<head>` 標籤之後。
若 `app` 資料夾是應用程式根目錄（本應用程式正是如此），請如下設定 `index.html` 中的 `href` 值。

<code-example header="src/index.html (base-href)" path="router/src/index.html" region="base-href"></code-example>

### HTML5 URL 與 `<base href>`

後續的說明會提到 URL 的不同部分。
下圖說明這些部分所指為何：

<code-example format="output" hideCopy language="none">

foo://example.com:8042/over/there?name=ferret#nose
&bsol;&lowbar;/   &bsol;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;/&bsol;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;/ &bsol;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;&lowbar;/ &bsol;&lowbar;&lowbar;/
 &verbar;           &verbar;            &verbar;            &verbar;        &verbar;
scheme    authority      path        query   fragment

</code-example>

路由器預設使用 [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries "Browser history push-state") 風格，但你必須用 `<base href>` 來設定該策略。

設定該策略的首選方式，是在 `index.html` 的 `<head>` 中加入 [`<base href>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/base "base href") 標籤。

<code-example header="src/index.html (base-href)" path="router/src/index.html" region="base-href"></code-example>

少了這個標籤，瀏覽器在「深層連結」進入應用程式時，可能無法載入資源 \(圖片、CSS、指令碼\)。

有些開發者可能無法加入 `<base>` 元素，例如因為他們無法存取 `<head>` 或 `index.html`。

這些開發者仍可透過以下兩個步驟使用 HTML5 URL：

1. 為路由器提供適當的 `APP_BASE_HREF` 值。
1. 所有網路資源都使用根 URL（帶有 `authority` 的 URL）：CSS、圖片、指令碼與範本 HTML 檔案。

   - `<base href>` 的 `path` 應以 "/" 結尾，因為瀏覽器會忽略 `path` 中最右側 "`/`" 之後的字元
   - 若 `<base href>` 包含 `query` 部分，只有當頁面中連結的 `path` 為空且沒有 `query` 時，才會使用該 `query`。
     這表示 `<base href>` 中的 `query` 只有在使用 `HashLocationStrategy` 時才會被包含。

   - 若頁面中的連結是根 URL（帶有 `authority`），就不會使用 `<base href>`。
     如此一來，帶有 authority 的 `APP_BASE_HREF` 會使 Angular 建立的所有連結都忽略 `<base href>` 的值。

   - `<base href>` 中的 fragment _絕不_ 會被保留

關於 `<base href>` 如何用來建構目標 URI 的更完整資訊，請參閱 [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) 中關於轉換參照的章節。

<a id="hashlocationstrategy"></a>

### `HashLocationStrategy`

在 `AppModule` 中，把帶有 `useHash: true` 的物件作為 `RouterModule.forRoot()` 的第二個引數，即可使用 `HashLocationStrategy`。

<code-example header="src/app/app.module.ts (hash URL strategy)" path="router/src/app/app.module.6.ts"></code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
