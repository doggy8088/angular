# 路由器參考

以下各節將介紹一些核心的路由器概念。

<a id="basics-router-imports"></a>

## 路由器匯入

Angular Router 是一項選擇性服務，會針對給定的 URL 呈現特定的元件檢視。
它不屬於 Angular 核心，因此放在自己的函式庫套件 `@angular/router` 中。

你可以像使用其他 Angular 套件一樣，從中匯入你需要的內容。

<code-example header="src/app/app.module.ts (import)" path="router/src/app/app.module.1.ts" region="import-router"></code-example>

<div class="alert is-helpful">

關於瀏覽器 URL 樣式的更多資訊，請參閱[`LocationStrategy` 與瀏覽器 URL 樣式](guide/router#browser-url-styles)。

</div>

<a id="basics-config"></a>

## 設定

經路由的 Angular 應用程式會有一個 `Router` 服務的單例實例。
當瀏覽器的 URL 變更時，該路由器會尋找對應的 `Route`，據此判斷要顯示哪個元件。

路由器在你設定之前沒有任何路由。
下列範例建立了五個路由定義、透過 `RouterModule.forRoot()` 方法設定路由器，並將結果加入 `AppModule` 的 `imports` 陣列中。

<code-example header="src/app/app.module.ts (excerpt)" path="router/src/app/app.module.0.ts"></code-example>

<a id="example-config"></a>

`appRoutes` 路由陣列描述了如何導覽。
請將它傳給模組 `imports` 中的 `RouterModule.forRoot()` 方法來設定路由器。

每個 `Route` 都將一個 URL `path` 對應到一個元件。
路徑中沒有前置斜線。
路由器會為你解析並建構最終的 URL，讓你在應用程式檢視之間導覽時，能同時使用相對路徑與絕對路徑。

第二個路由中的 `:id` 是路由參數的權杖。
在 `/hero/42` 這樣的 URL 中，"42" 是 `id` 參數的值。
對應的 `HeroDetailComponent` 會使用該值，找出並呈現 `id` 為 42 的英雄。

第三個路由中的 `data` 屬性是存放與這條特定路由相關之任意資料的地方。
`data` 屬性可以在每個已啟用的路由中存取。
你可以用它來存放頁面標題、麵包屑文字，以及其他唯讀的靜態資料。
若要擷取動態資料，請使用[解析守衛](guide/router-tutorial-toh#resolve-guard)。

第四個路由中的空路徑代表應用程式的預設路徑——當 URL 中的路徑為空時（剛開始時通常如此）要前往的地方。
這個預設路由會重新導向到 `/heroes` URL 對應的路由，因此會顯示 `HeroesListComponent`。

如果你需要在導覽生命週期中查看正在發生的事件，可以使用路由器預設設定中的 `enableTracing` 選項。
這個選項會把每次導覽生命週期中發生的每個路由器事件輸出到瀏覽器主控台。
`enableTracing` 僅供除錯使用。
你可以在傳給 `RouterModule.forRoot()` 方法第二個引數的物件中設定 `enableTracing: true` 選項。

<a id="basics-router-outlet"></a>

## 路由器出口

`RouterOutlet` 是路由器函式庫中的一個指令，使用方式與元件相似。
它扮演佔位元素的角色，標示範本中路由器應為該出口顯示元件的位置。

<code-example format="html" language="html">

&lt;router-outlet&gt;&lt;/router-outlet&gt;
&lt;!-- Routed components go here --&gt;

</code-example>

承接前面的設定，當此應用程式的瀏覽器 URL 變成 `/heroes` 時，路由器會把該 URL 比對到路由路徑 `/heroes`，並將 `HeroListComponent` 顯示為你放在宿主元件範本中的 `RouterOutlet` 的同層元素。

<a id="basics-router-links"></a>
<a id="router-link"></a>

## 路由器連結

若要因應使用者的操作（例如點選錨點標籤）進行導覽，請使用 `RouterLink`。

請看下列範本：

<code-example header="src/app/app.component.html" path="router/src/app/app.component.1.html"></code-example>

錨點標籤上的 `RouterLink` 指令讓路由器能控制這些元素。
導覽路徑是固定的，因此你可以把字串以一次性繫結的方式指派給 `routerLink`。

如果導覽路徑更具動態性，你可以繫結到一個傳回路由連結參數陣列的範本運算式，也就是[連結參數陣列](guide/router#連結參數陣列)。
路由器會將該陣列解析為完整的 URL。

<a id="router-link-active"></a>

## 啟用中的路由器連結

`RouterLinkActive` 指令會根據目前的 `RouterState`，為啟用中的 `RouterLink` 繫結切換 CSS 類別。

在每個錨點標籤上，你會看到一個指向 `RouterLinkActive` 指令的[屬性繫結](guide/property-binding)，形式如下

<code-example format="html" hideCopy language="html">

routerLinkActive="..."

</code-example>

等號 `=` 右側的範本運算式包含一個以空白分隔的 CSS 類別字串，Router 會在這個連結啟用時加入這些類別、在連結停用時將其移除。
你可以把 `RouterLinkActive` 指令設為像 `routerLinkActive="active fluffy"` 這樣的類別字串，或將它繫結到傳回這類字串的元件屬性。
例如，

<code-example format="typescript" hideCopy language="typescript">

[routerLinkActive]="someStringProperty"

</code-example>

啟用中的路由連結會沿著路由樹的每一層向下串聯，因此父層與子層的路由器連結可以同時處於啟用狀態。
若要覆寫此行為，請將 `[routerLinkActiveOptions]` 輸入繫結設定為 `{ exact: true }` 運算式。
使用 `{ exact: true }` 時，給定的 `RouterLink` 只有在其 URL 與目前 URL 完全相符時才會啟用。

`RouterLinkActive` 也讓你能輕鬆地將 `aria-current` 屬性套用到啟用中的元素上，從而為所有使用者提供更無障礙的體驗。更多資訊請參閱無障礙最佳實務的[使用中連結的標示一節](/guide/accessibility#使用中連結的標示)。

<a id="basics-router-state"></a>

## 路由器狀態

在每次成功導覽的生命週期結束後，路由器會建立一棵由 `ActivatedRoute` 物件組成的樹，構成路由器目前的狀態。
你可以使用 `Router` 服務與 `routerState` 屬性，從應用程式中的任何位置存取目前的 `RouterState`。

`RouterState` 中的每個 `ActivatedRoute` 都提供方法，可沿路由樹上下遍歷，取得父層、子層與同層路由的資訊。

<a id="activated-route"></a>

## 已啟用的路由

路由路徑與參數可以透過一個注入的路由器服務取得，這個服務稱為 [ActivatedRoute](api/router/ActivatedRoute)。
它包含大量實用資訊，包括：

| 屬性        | 詳細說明 |
|:---             |:---     |
| `url`           | 路由路徑的 `Observable`，以字串陣列表示路由路徑的每個部分。 |
| `data`          | 包含為路由提供的 `data` 物件的 `Observable`。也包含來自[解析守衛](guide/router-tutorial-toh#resolve-guard)的任何已解析值。 |
| `params`        | 包含該路由專屬的必要與[選用參數](guide/router-tutorial-toh#optional-route-parameters)的 `Observable`。 |
| `paramMap`      | 包含該路由專屬的必要與[選用參數](guide/router-tutorial-toh#optional-route-parameters)的[對應表](api/router/ParamMap)的 `Observable`。該對應表支援從同一個參數擷取單一值與多個值。 |
| `queryParamMap` | 包含所有路由都可用的[查詢參數](guide/router-tutorial-toh#query-parameters)的[對應表](api/router/ParamMap)的 `Observable`。該對應表支援從查詢參數擷取單一值與多個值。 |
| `queryParams`   | 包含所有路由都可用的[查詢參數](guide/router-tutorial-toh#query-parameters)的 `Observable`。 |
| `fragment`      | 所有路由都可用的 URL [片段](guide/router-tutorial-toh#fragment)的 `Observable`。 |
| `outlet`        | 用來渲染路由的 `RouterOutlet` 名稱。對於未命名的出口，出口名稱為 primary。 |
| `routeConfig`   | 用於該路由的路由設定，其中包含原始路徑。 |
| `parent`        | 當此路由是[子路由](guide/router-tutorial-toh#子路由元件)時，該路由的父層 `ActivatedRoute`。 |
| `firstChild`    | 包含此路由的子路由清單中的第一個 `ActivatedRoute`。 |
| `children`      | 包含目前路由之下已啟用的所有[子路由](guide/router-tutorial-toh#子路由元件)。 |

## 路由器事件

每次導覽期間，`Router` 都會透過 `Router.events` 屬性發出導覽事件。
下表列出這些事件。

| 路由器事件                                              | 詳細說明 |
|:---                                                       |:---     |
| [`NavigationStart`](api/router/NavigationStart)           | 在導覽開始時觸發。 |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | 在 `Router` [延遲載入](guide/router-tutorial-toh#asynchronous-routing)路由設定之前觸發。 |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | 在路由被延遲載入後觸發。 |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | 在 Router 解析 URL 且路由被辨認時觸發。 |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | 在 Router 開始路由的 Guards 階段時觸發。 |
| [`ChildActivationStart`](api/router/ChildActivationStart) | 在 Router 開始啟用路由的子路由時觸發。 |
| [`ActivationStart`](api/router/ActivationStart)           | 在 Router 開始啟用路由時觸發。 |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | 在 Router 成功完成路由的 Guards 階段時觸發。 |
| [`ResolveStart`](api/router/ResolveStart)                 | 在 Router 開始路由的 Resolve 階段時觸發。 |
| [`ResolveEnd`](api/router/ResolveEnd)                     | 在 Router 成功完成路由的 Resolve 階段時觸發。 |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | 在 Router 完成啟用路由的子路由時觸發。 |
| [`ActivationEnd`](api/router/ActivationEnd)               | 在 Router 完成啟用路由時觸發。 |
| [`NavigationEnd`](api/router/NavigationEnd)               | 在導覽成功結束時觸發。 |
| [`NavigationCancel`](api/router/NavigationCancel)         | 在導覽被取消時觸發。這可能發生在[路由守衛](guide/router-tutorial-toh#guards)在導覽期間傳回 false，或以傳回 `UrlTree` 的方式重新導向時。 |
| [`NavigationError`](api/router/NavigationError)           | 在導覽因未預期的錯誤而失敗時觸發。 |
| [`Scroll`](api/router/Scroll)                             | 代表捲動事件。 |

當你啟用 `enableTracing` 選項時，Angular 會把這些事件記錄到主控台。
關於篩選路由器導覽事件的範例，請參閱 [Angular 中的 Observable](guide/observables-in-angular) 指南的[路由器一節](guide/observables-in-angular#router)。

## 路由器術語

以下是重要的 `Router` 術語及其意義：

| 路由器組成           | 詳細說明 |
|:---                   |:---     |
| `Router`              | 顯示目前 URL 的應用程式元件。管理從一個元件到下一個元件的導覽。 |
| `RouterModule`        | 獨立的 NgModule，提供瀏覽應用程式檢視所需的服務提供者與指令。 |
| `Routes`              | 定義路由陣列，每條路由將一個 URL 路徑對應到一個元件。 |
| `Route`               | 定義路由器應如何根據 URL 模式導覽到元件。大多數路由由路徑與元件類型組成。 |
| `RouterOutlet`        | 標示路由器顯示檢視位置的指令（`<router-outlet>`）。 |
| `RouterLink`          | 將可點選的 HTML 元素繫結到路由的指令。點選具有 `routerLink` 指令（繫結到*字串*或*連結參數陣列*）的元素會觸發導覽。 |
| `RouterLinkActive`    | 當元素上或元素內包含的相關 `routerLink` 啟用／停用時，為 HTML 元素加入／移除類別的指令。它也可以為啟用中的連結設定 `aria-current`，以提升無障礙體驗。 |
| `ActivatedRoute`      | 提供給每個路由元件的服務，包含路由專屬資訊，例如路由參數、靜態資料、解析資料、全域查詢參數與全域片段。 |
| `RouterState`         | 路由器的目前狀態，包含目前已啟用路由的樹狀結構，以及用於遍歷路由樹的便利方法。 |
| 連結參數陣列 | 路由器將其解讀為路由指令的陣列。你可以將該陣列繫結到 `RouterLink`，或將其作為引數傳給 `Router.navigate` 方法。 |
| 路由元件     | 具有 `RouterOutlet` 的 Angular 元件，會根據路由器導覽顯示檢視。 |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
