# 路由參考

以下各節重點介紹一些核心路由器概念。

## 路由器導入

Angular Router 是一個可選服務，可為給定的 URL 呈現特定元件檢視。
它不是 Angular 核心的一部分，因此位於自己的程式庫套件 `@angular/router` 中。

從中匯入您需要的項目，就像您從任何其他 Angular 套件匯入一樣。

```ts
import { provideRouter } from '@angular/router';
```

HELPFUL: 有關更多瀏覽器 URL 樣式的資訊，請參閱 [`LocationStrategy` 和瀏覽器 URL 樣式](guide/routing/common-router-tasks#browser-url-styles)。

## 配置

路由的 Angular 應用程式有一個 `Router` 服務的單一例項。
當瀏覽器的 URL 變更時，該路由器會尋找對應的 `Route`，以決定要顯示的元件。

路由器在您配置它之前沒有路由。
以下範例建立五個路由定義，透過 `provideRouter` 方法配置路由器，並將結果新增到 `ApplicationConfig`' 的 `providers` 陣列。

```ts
const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'heroes',
    component: HeroListComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/heroes',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];
export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes, withDebugTracing())]
}
```

`routes` 路線陣列說明如何導航。
將其傳遞給 `ApplicationConfig` `providers` 中的 `provideRouter` 方法，以配置路由器。

每個 `Route` 將 URL `路徑` 映射到一個元件。
路徑中沒有前導斜線。
路由器為你解析和建構最終 URL，這使你可以在應用程式視圖之間導航時使用相對路徑和絕對路徑。

第二個路由中的 `:id` 是路由參數的令牌。
在 `/hero/42` 等 URL 中，「42」是 `id` 參數的值。
對應的 `HeroDetailComponent` 使用該值來尋找並顯示 `id` 等於 42 的英雄。

第三個路由中的 `data` 屬性是儲存與這個特定路由關聯的任意資料的地方。
資料屬性可在每個已啟用的路由中存取。
使用它來儲存項目，例如頁面標題、麵包屑文字，以及其他唯讀的靜態資料。
使用解析防護來擷取動態資料。

第四條路由中的空路徑代表應用程式的預設路徑 &mdash; 當 URL 中的路徑為空時要前往的地方，在開始時通常是這樣。
此預設路由會重新導向到 `/heroes` URL 的路由，因此會顯示 `HeroesListComponent`。

如果您需要查看在導覽生命週期中發生哪些事件，可以使用 `withDebugTracing` 功能。
這會將在每個導覽生命週期期間發生的每個路由器事件輸出到瀏覽器主控台。
僅在除錯目的時使用 `withDebugTracing`。
您在傳遞給 `provideRouter` 方法的第二個參數的物件中設定 `withDebugTracing` 選項。

## 路由插座

`RouterOutlet` 是路由器庫中的指令，使用方式類似於元件。
它扮演標記模板中路由器應顯示該出口的元件位置的預留位置。

<docs-code language="html">

&lt;router-outlet&gt;&lt;/router-outlet&gt;
&lt;!-- Routed components go here --&gt;

</docs-code>

在給予前述設定後，當該應用程式的瀏覽器網址變成 `/heroes` 時，路由器會將該網址比對至路由路徑 `/heroes`，並在您放置於主機元件範本中的 `RouterOutlet` 旁顯示 `HeroListComponent` 作為兄弟元素。

## Router 連結

若要導航至某些使用者動作的結果，例如點擊錨點標籤，請使用 `RouterLink`。

考慮以下範本：

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/router/src/app/app.component.1.html"/>

錨點標籤上的 `RouterLink` 指令讓路由器可以控制這些元素。
導覽路徑是固定的，所以你可以將字串指定為 `routerLink` 的一次性繫結。

如果導覽路徑更動態，您可以繫結到傳回路徑連結參數陣列的範本表達式；也就是說，[連結參數陣列](guide/routing/common-router-tasks#link-parameters-array)。
路由器將該陣列解析為完整的 URL。

## 活動路由鏈接

`RouterLinkActive` 指令根據目前的 `RouterState`，為活躍的 `RouterLink` 綁定切換 CSS 類別。

在每個錨點標記上，您會看到一個指向 `RouterLinkActive` 指令的 [屬性繫結](guide/templates/property-binding)，如下所示

<docs-code hideCopy language="html">

routerLinkActive="..."

</docs-code>

等號右邊的範本運算式 `=` 包含一個以空格分隔的 CSS 類別字串，當連結處於啟用狀態時，路由器會新增此字串，而當連結處於停用狀態時，路由器會移除此字串。
您可以將 `RouterLinkActive` 指令設定為一組類別，例如 `routerLinkActive="active fluffy"` 或將其繫結至會傳回此類別字串的元件屬性。
例如，

<docs-code hideCopy language="typescript">

[routerLinkActive]="someStringProperty"

</docs-code>

活動路由連結會向下串聯到路由樹的每個層級，因此父項和子項的路由器連結可以同時處於活動狀態。
若要覆寫此行為，請使用 `{ exact: true }` 表達式繫結到 `[routerLinkActiveOptions]` 輸入繫結。
透過使用 `{ exact: true }`，只有當 `RouterLink` 的網址與目前的網址完全相符時，它才會處於活動狀態。

RouterLinkActive 亦允許您輕鬆地將 `aria-current` 屬性套用至活動元素，因而為所有使用者提供更易於存取的體驗。如需更多資訊，請參閱 [無障礙最佳實務](/best-practices/a11y) 的 [活動連結識別區段](/#active-links-identification)。

## 路由狀態

在每個成功的導航生命週期結束後，路由器會建立一個由 `ActivatedRoute` 物件組成的樹狀結構，以構成路由器的當前狀態。
您可以使用 `Router` 服務和 `routerState` 屬性，在應用程式中的任何位置存取目前的 `RouterState`。

`RouterState` 中的每個 `ActivatedRoute` 提供方法來遍歷路由樹的上下，以從父、子、兄弟路由獲取資訊。

## 已啟用路由

路由路徑和參數可通過注入的路由器服務 [ActivatedRoute](api/router/ActivatedRoute) 使用。
它有很多有用的資訊，包括：

| 屬性        | 詳細資料 |
|:---             |:---     |
| `url`           | 路徑的每個部分表示為字串陣列的路由路徑的 `Observable`。                                                                                                                                                        |
| `data`          | 包含為路由提供的 `data` 物件的 `Observable`。也包含解析防護的任何已解析值。                                                                                     |
| `params`        | 包含特定於路由的必要和選用參數的 `Observable`。                                                                                                                 |
| `paramMap`      | 包含特定於路由的必要和選用參數的 [map](api/router/ParamMap) 的 `Observable`。該地圖支援從同一個參數中擷取單一和多個值。 |
| `queryParamMap` | 包含所有路由可用的查詢參數的 [map](api/router/ParamMap) 的 `Observable`。該地圖支援從查詢參數中擷取單一和多個值。                       |
| `queryParams`   | 包含所有路由可用的查詢參數的 `Observable`。                                                                                                                                        |
| `fragment`      | 所有路由可用的 URL 片段的 `Observable`。                                                                                                                                                               |
| `outlet`        | 用於呈現路由的 `RouterOutlet` 的名稱。對於未命名出口，出口名稱是主要出口。                                                                                                                                                      |
| `routeConfig`   | 包含原始路徑的路由的路由設定。                                                                                                                                                                                        |
| `parent`        | 當此路由是子路由時，路由的父 `ActivatedRoute`。                                                                                                                                       |
| `firstChild`    | 包含此路由子路由清單中的第一個 `ActivatedRoute`。                                                                                                                                                                                    |
| `children`      | 包含在目前路由下啟用的所有子路由。                                                                                                                                            |

## 路由事件

在每次導航期間，`Router` 會透過 `Router.events` 屬性發出導航事件。
這些事件顯示在以下表格中。

| 路由事件                                             | 詳細資料 |
|:---                                                  |:---     |
| [`NavigationStart`](api/router/NavigationStart)       | 觸發於導航開始時。                                                                                                                                                    |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | 在 `Router` 延遲載入路由設定之前觸發。                                                                                                                              |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)   | 路由延遲載入後觸發。                                                                                                                                              |
| [`RoutesRecognized`](api/router/RoutesRecognized)     | 當路由器解析 URL 且路由被辨識時觸發。                                                                                                                                   |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)     | 當路由器開始路由的 Guards 階段時觸發。                                                                                                                             |
| [`ChildActivationStart`](api/router/ChildActivationStart) | 當路由器開始啟動路由的子項目時觸發。                                                                                                                             |
| [`ActivationStart`](api/router/ActivationStart)       | 當路由器開始啟動路由時觸發。                                                                                                                                     |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)         | 當路由器成功完成路由的 Guards 階段時觸發。                                                                                                                            |
| [`ResolveStart`](api/router/ResolveStart)             | 當路由器開始路由的 Resolve 階段時觸發。                                                                                                                              |
| [`ResolveEnd`](api/router/ResolveEnd)                 | 當路由器成功完成路由的 Resolve 階段時觸發。                                                                                                                              |
| [`ChildActivationEnd`](api/router/ChildActivationEnd) | 當路由器完成啟動路由的子項目時觸發。                                                                                                                             |
| [`ActivationEnd`](api/router/ActivationEnd)           | 當路由器完成啟動路由時觸發。                                                                                                                                       |
| [`NavigationEnd`](api/router/NavigationEnd)           | 當導航成功完成時觸發。                                                                                                                                           |
| [`NavigationCancel`](api/router/NavigationCancel)     | 當導航被取消時觸發。這可能會在路由防護在導航期間回傳 false，或透過回傳 `UrlTree` 來重新導向時發生。                                                                |
| [`NavigationError`](api/router/NavigationError)       | 當導航因意外錯誤而失敗時觸發。                                                                                                                                   |
| [`Scroll`](api/router/Scroll)                         | 代表一個捲動事件。                                                                                                                                                    |

當您啟用 `withDebugTracing` 功能時，Angular 會將這些事件記錄到主控台。

## 路由器術語

以下為 `Router` 的關鍵術語及其含義：

| 路由器部分 | 細節 |
|:--- |:--- |
| `Router` | 顯示活躍 URL 的應用程式元件。管理從一個元件導覽到另一個元件。 |
| `provideRouter` | 提供必要的服務提供者，以便導覽應用程式檢視。 |
| `RouterModule` | 一個獨立的 NgModule，提供必要的服務提供者和指令，以便導覽應用程式檢視。 |
| `Routes` | 定義一個路由陣列，每個路由都將 URL 路徑對應到一個元件。 |
| `Route` | 定義路由器應如何根據 URL 模式導覽到元件。大多數路由都包括路徑和元件類型。 |
| `RouterOutlet` | 指令（`<router-outlet>`）標記路由器顯示檢視的位置。 |
| `RouterLink` | 將可點擊的 HTML 元素繫結到路由的指令。點擊繫結到 *字串* 或 *連結參數陣列* 的 `routerLink` 指令的元素會觸發導覽。 |
| `RouterLinkActive` | 在與元素相關聯的 `routerLink` 位於元素內部或上面時，新增/移除 HTML 元素類別的指令。它還可以設定活躍連結的 `aria-current` 以提高輔助使用。 |
| `ActivatedRoute` | 提供給每個路由元件的服務，包含路由特定資訊，例如路由參數、靜態資料、解析資料、全域查詢參數和全域片段。 |
| `RouterState` | 路由器的目前狀態，包括目前已啟用的路由樹，以及用於遍歷路由樹的便利方法。 |
| 連結參數陣列 | 路由器解釋為路由指令的陣列。您可以將該陣列繫結到 `RouterLink` 或將陣列作為參數傳遞給 `Router.navigate` 方法。 |
| 路由元件 | 具有 `RouterOutlet` 的 Angular 元件，根據路由導覽顯示檢視。 |
