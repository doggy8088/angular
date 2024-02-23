# 常見的路由任務

這個主題說明如何實作許多與將 Angular 路由器新增到應用程式相關的常見任務。

## 啟用路由功能來產生應用程式

以下指令使用 Angular CLI 來產生一個具有應用程式路由的基本 Angular 應用程式。以下範例中的應用程式名稱為 `routing-app`。

```shell
ng new routing-app
```

### 加入路由元件

若要使用 Angular 路由器，應用程式至少需要兩個元件，以便讓您可以從一個元件導覽至另一個元件。若要使用 CLI 建立元件，請在命令列中輸入下列內容，其中 `first` 是元件的名稱：

```shell
ng generate component first
```

針對第二個元件重複此步驟，但給它不同的名稱。這裡，新名稱為 `second`。

<docs-code language="shell">

ng generate component second

</docs-code>

CLI 會自動附加 `Component`，因此如果您寫 `first-component`，您的元件將會是 `FirstComponentComponent`。

<docs-callout title="`base href`">

本指南適用於 CLI 產生的 Angular 應用程式。

</docs-callout>

### 匯入您的新元件

如要使用您的新元件，請將其導入 `app.routes.ts` 檔案頂端，如下所示：

<docs-code language="ts">

import {FirstComponent} from './first/first.component';
import {SecondComponent} from './second/second.component';

</docs-code>

## 定義基本路由

建立路線有三個基本建構模組。

將路由匯入 `app.config.ts` 並將其新增至 `provideRouter` 函數。以下是在 CLI 中使用的預設 `ApplicationConfig`。

<docs-code language="ts">

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};

</docs-code>

Angular CLI 會為您執行此步驟。但是，如果您手動建立應用程式或使用現有的非 CLI 應用程式，請驗證匯入和組態是否正確。

<docs-workflow>

<docs-step title="為您的路由設定 `Routes` 陣列">

Angular CLI 會自動執行此步驟。

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="在您的 `Routes` 陣列中定義您的路由">

這個陣列中的每個路由都是一個包含兩個屬性的 JavaScript 物件。第一個屬性 `path` 定義路由的 URL 路徑。第二個屬性 `component` 定義 Angular 應針對對應路徑所使用的元件。

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
];
```

</docs-step>

<docs-step title="將您的路由新增至您的應用程式">

現在您已定義好路由，將其加入您的應用程式。首先，新增連結至兩個元件。將您想要加入路由的錨點標籤指定給 `routerLink` 屬性。將屬性的值設定為使用者點擊各連結時要顯示的元件。接著，更新您的元件範本，加入 `<router-outlet>`。此元素通知 Angular 使用所選路由的元件更新應用程式檢視。

```html
<h1>Angular Router App</h1>
<nav>
  <ul>
    <li><a routerLink="/first-component" routerLinkActive="active" ariaCurrentWhenActive="page">First Component</a></li>
    <li><a routerLink="/second-component" routerLinkActive="active" ariaCurrentWhenActive="page">Second Component</a></li>
  </ul>
</nav>
<!-- The routed views render in the <router-outlet>-->
<router-outlet></router-outlet>
```

您還需要將 `RouterLink`、`RouterLinkActive` 和 `RouterOutlet` 新增到 `AppComponent` 的 `imports` 陣列。

```ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'routing-app';
}
```

</docs-step>

</docs-workflow>

### 路線順序

路由的順序很重要，因為 `Router` 在比對路由時會採用先配對先獲勝的策略，因此較明確的路由應該放在較不明確的路由上方。
首先列出具有靜態路徑的路由，接著是空路徑路由，它符合預設路由。
[萬用字元路由](guide/routing/common-router-tasks#setting-up-wildcard-routes) 排在最後，因為它符合每個 URL，而且只有在沒有其他路由先符合時，`Router` 才會選取它。

## 取得路線資訊

通常，當使用者瀏覽您的應用程式時，您可能會想要將資訊從一個元件傳遞到另一個元件。
例如，考慮一個顯示購物清單的應用程式。
清單中的每個項目都有唯一的 `id`。
若要編輯項目，使用者會按一下「編輯」按鈕，這會開啟 `EditGroceryItem` 元件。
您希望該元件擷取雜貨項目的 `id`，以便向使用者顯示正確的資訊。

使用路由將此類型的資訊傳遞至您的應用程式元件。
為此，您使用 [withComponentInputBinding](api/router/withComponentInputBinding) 功能搭配 `provideRouter` 或 `RouterModule.forRoot` 的 `bindToComponentInputs` 選項。

如何從路線取得資訊：

<docs-workflow>

<docs-step title="加入 `withComponentInputBinding`">

將 `withComponentInputBinding` 功能新增至 `provideRouter` 方法中。

```ts
providers: [
  provideRouter(appRoutes, withComponentInputBinding()),
]
```

</docs-step>

<docs-step title="在元件中新增 `Input`">

將該元件更新為具有與參數名稱相符的 `Input`。

```ts
@Input()
set id(heroId: string) {
  this.hero$ = this.service.getHero(heroId);
}
```

備註：您可以將所有路由資料與金鑰、值對繫結至元件輸入：靜態或已解析路由資料、路徑參數、矩陣參數和查詢參數。
如果您想使用父元件的路由資訊，您需要設定路由參數繼承策略選項：withRouterConfig({paramsInheritanceStrategy: 'always'})

</docs-step>

備註：您可以將所有路由資料與金鑰、值對繫結至元件輸入：靜態或已解析的路由資料、路徑參數、矩陣參數和查詢參數。

如果要使用父元件路由資訊，您需要設定路由器 `paramsInheritanceStrategy` 選項：
`withRouterConfig({paramsInheritanceStrategy: 'always'})`

</docs-step>

</docs-workflow>

## 設定萬用字元路由

運作良好的應用程式應該在使用者嘗試導覽至應用程式中不存在的部分時，以優雅的方式處理。
若要將此功能新增至您的應用程式，請設定萬用字元路由。
Angular 路由器會在要求的 URL 與任何路由路徑不符時，選擇此路由。

若要設定萬用字元路由，請將下列程式碼新增至 `routes` 定義。

<docs-code>

{ path: '\*\*', component: <component-name> }

</docs-code>

兩個星號 `**` 告知 Angular 此 `routes` 定義為萬用字元路由。
對於 `component` 屬性，您可以定義應用程式中的任何元件。
常見的選擇包括應用程式專用的 `PageNotFoundComponent`，您可以定義它以 [向使用者顯示 404 頁面](guide/routing/common-router-tasks#displaying-a-404-page)；或者重新導向至應用程式的 main 元件。
萬用字元路由是最後一個路由，因為它會比對任何 URL。
有關路由順序為何重要的詳細資訊，請參閱 [路由順序](guide/routing/common-router-tasks#route-order)。

## 顯示 404 頁面

html
<!DOCTYPE html>
<html>
<head>
  <title>404 Not Found</title>
</head>
<body>
  <h1>404 Not Found</h1>
  <p>The requested URL was not found on this server.</p>
</body>
</html>

若要顯示 404 頁面，請設定 [萬用字元路由](guide/routing/common-router-tasks#setting-up-wildcard-routes)，其 `component` 屬性設定為您想用於 404 頁面的元件，如下所示：

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

最後一個具有 `path` 的 `**` 路由是一個萬用字元路由。
如果請求的 URL 與清單中較早的路徑都不相符，路由器會選擇此路由，並將使用者傳送至 `PageNotFoundComponent`。

## 設定重新導向

要設定重新導向，請設定一條路徑，其中包含您要重新導向的 `path`、您要重新導向的 `component`，以及一個 `pathMatch` 值，用於告知路由器如何比對 URL。

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

在此範例中，第三個路由是重新導向，因此路由器預設為 `first-component` 路由。
請注意，此重新導向位於萬用字元路由之前。
在此，`path: ''` 表示使用初始相對 URL \(`''`\)。

## 巢狀路由

隨著您的應用程式變得更複雜，您可能需要建立相對於根元件以外的元件的路由。
這種類型的巢狀路由稱為子路由。
這表示您正在將第二個 `<router-outlet>` 新增到您的應用程式，因為它除了 `AppComponent` 中的 `<router-outlet>` 之外。

在此範例中，有兩個額外的子元件，`child-a` 和 `child-b`。
在此，`FirstComponent` 除了 `AppComponent` 中的一個之外，還有它自己的 `<nav>` 和第二個 `<router-outlet>`。

```html
<h2>First Component</h2>

<nav>
  <ul>
    <li><a routerLink="child-a">Child A</a></li>
    <li><a routerLink="child-b">Child B</a></li>
  </ul>
</nav>

<router-outlet></router-outlet>
```

子路由與其他路由一樣，需要 `path` 和 `component`。
唯一的不同是，您將子路由置於父路由中的 `children` 陣列中。

```ts
const routes: Routes = [
  {
    path: 'first-component',
    component: FirstComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'child-a', // child route path
        component: ChildAComponent, // child route component that the router renders
      },
      {
        path: 'child-b',
        component: ChildBComponent, // another child route component that the router renders
      },
    ],
  },
];
```

## 設定頁面標題

應用程式中的每個頁面都應該有一個獨特的標題，以便在瀏覽器歷史記錄中識別它們。
`Router` 使用 `Route` 配置中的 `title` 屬性來設定文件的標題。

```ts
const routes: Routes = [
  {
    path: 'first-component',
    title: 'First component',
    component: FirstComponent,  // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'child-a',  // child route path
        title: resolvedChildATitle,
        component: ChildAComponent,  // child route component that the router renders
      },
      {
        path: 'child-b',
        title: 'child b',
        component: ChildBComponent,  // another child route component that the router renders
      },
    ],
  },
];

const resolvedChildATitle: ResolveFn<string> = () => Promise.resolve('child a');
```

HELPFUL: `title` 屬性遵循與靜態路由 `data` 和實作 `ResolveFn` 的動態值相同的規則。

您也可以透過擴充 `TitleStrategy` 來提供自訂的標題策略。

```ts
@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`My Application | ${title}`);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
  ]
};
```

## 使用相對路徑

相對路徑可讓您定義相對於目前 URL 片段的路徑。
以下範例顯示前往另一個元件 `second-component` 的相對路線。
`FirstComponent` 和 `SecondComponent` 在樹狀結構中位於同一層級，不過連結到 `SecondComponent` 的連結位於 `FirstComponent` 中，這表示路由器必須往上一個層級，然後進入第二個目錄才能找到 `SecondComponent`。
您可以使用 `../` 符號往上一個層級，而不是寫出前往 `SecondComponent` 的完整路徑。

```html
<h2>First Component</h2>

<nav>
  <ul>
    <li><a routerLink="../second-component">Relative Route to second component</a></li>
  </ul>
</nav>
<router-outlet></router-outlet>
```

除了 `../`，使用 `./` 或不帶前置斜線來指定目前層級。

### 指定相對路徑

若要指定相對路徑，請使用 `NavigationExtras` 的 `relativeTo` 屬性。
在元件類別中，從 `@angular/router` 匯入 `NavigationExtras`。

然後在導覽方法中使用 `relativeTo`。
在連結參數陣列，這裡包含 `items`，後面新增一個物件，其 `relativeTo` 屬性設定為 `ActivatedRoute`，也就是 `this.route`。

```ts
goToItems() {
  this.router.navigate(['items'], { relativeTo: this.route });
}
```

`navigate()` 參數將路由器設定為使用目前路由作為基礎，其上附加 `items`。

`goToItems()` 方法將目的地 URI 解釋為相對於已啟用路由並導航至 `items` 路由。

## 存取查詢參數和片段

有時，應用程式的功能需要存取路由的一部分，例如查詢參數或片段。
英雄之旅應用程式在教學課程的這個階段使用清單檢視，您可以在其中點擊英雄以查看詳細資訊。
路由器使用 `id` 來顯示正確的英雄詳細資訊。

首先，在您要導航的元件中匯入下列成員。

```ts
import { ActivatedRoute } from '&commat;angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
```

接下來注入已啟用的路由服務：

```ts
constructor(private route: ActivatedRoute) {}
```

將類別設定為具有可觀察物件 `heroes$`、`selectedId` 以保存英雄的 `id` 號碼，以及在 `ngOnInit()` 中的英雄，加入以下程式碼以取得所選英雄的 `id`。
此程式碼片段假設您有英雄清單、英雄服務、取得英雄的函式，以及用於呈現清單和詳細資料的 HTML，就像在英雄之旅範例中一樣。

```ts
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
```

接下來，在您想要導航到的元件中，匯入下列成員。

```ts
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
```

在元件類別的建構函數中注入 `ActivatedRoute` 和 `Router`，讓此元件可以使用它們：

```ts
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
```

## 延遲加載

您可以將路由設定為延遲載入模組，這表示 Angular 只會在需要時載入模組，而不是在應用程式啟動時載入所有模組。
另外，在背景預載應用程式的一部分以改善使用者體驗。

有關延遲載入和預載入的詳細資訊，請參閱專屬指南 [延遲載入](guide/ngmodules/lazy-loading)。

## 防止未經授權的存取

使用路線守衛來防止使用者在未經授權的情況下導覽至應用程式的一部分。
以下路線守衛在 Angular 中可用：

<docs-pill-row>
  <docs-pill href="api/router/CanActivateFn" title="`canActivate`"/>
  <docs-pill href="api/router/CanActivateChildFn" title="`canActivateChild`"/>
  <docs-pill href="api/router/CanDeactivateFn" title="`canDeactivate`"/>
  <docs-pill href="api/router/CanMatchFn" title="`canMatch`"/>
  <docs-pill href="api/router/ResolveFn" title="`resolve`"/>
  <docs-pill href="api/router/CanLoadFn" title="`canLoad`"/>
</docs-pill-row>

若要使用路由防護，請考慮使用 [無元件路由](api/router/Route#componentless-routes)，因為這有助於保護子路由。

建立一個檔案給你的守衛：

```bash
ng generate guard your-guard
```

在你的 guard 檔案中，新增你想使用的 guard 函式。
以下範例使用 `canActivateFn` 來保護路由。

```ts
export const yourGuardFunction: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) => {
      // your  logic goes here
  }
```

在您的路由模組中，在您的 `routes` 配置中使用適當的屬性。
在此，`canActivate` 告訴路由器調解導航至這個特定路由。

```ts
{
  path: '/your-path',
  component: YourComponent,
  canActivate: [yourGuardFunction],
}
```

## 連結參數陣列

連結參數陣列含有以下路由導航成分：

- 路線到目的地元件的路徑
- 路線 URL 中的必要和可選路線參數

將 `RouterLink` 指令綁定至陣列，如下：

```html
<a [routerLink]="['/heroes']">Heroes</a>
```

在指定路徑參數時，以下是一個包含兩個元素的陣列：

```html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span>{{ hero.name }}
</a>
```

以物件提供選用路由參數，如 `{ foo: 'foo' }`：

```html
<a [routerLink]="['/crisis-center', { foo: 'foo' }]">Crisis Center</a>
```

這三個範例涵蓋了一個具有路由單層級應用程式的需求。
然而，使用子路由器（例如危機中心），您可以建立新的連結陣列可能性。

以下最小的 `RouterLink` 範例建立在危機中心的指定預設子路由上。

```html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

檢視下列內容：

- 陣列中的第一個項目識別父路由 \(`/crisis-center`\)
- 這個父路由沒有參數
- 子路由沒有預設值，所以你需要挑選一個
- 你正在導航到 `CrisisListComponent`，其路由路徑為 `/`，但你不需要明確添加斜線

考慮以下路由連結，它從應用程式的根目錄導航到 Dragon Crisis：

```html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- 陣列中的第一個項目識別父路由 \(`/crisis-center`\)
- 這個父路由沒有參數
- 第二個項目識別子路由，提供特定危機的詳細資訊 \(`/:id`\)
- 詳細資訊子路由需要一個 `id` 路由參數
- 你將龍危機的 `id` 新增為陣列中的第二個項目 \(`1`\)
- 產生的路徑是 `/crisis-center/1`

您也可以重新定義僅包含危機中心路由的 `AppComponent` 範本：

```ts
template: `
  <h1 class="title">Angular Router</h1>
  <nav>
    <a [routerLink]="['/crisis-center']">Crisis Center</a>
    <a [routerLink]="['/crisis-center/1', { foo: 'foo' }]">Dragon Crisis</a>
    <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
  </nav>
  <router-outlet></router-outlet>
`
```

總體而言，您可以使用一個、兩個或多個路由層級來撰寫應用程式。
連結參數陣列提供了彈性，可代表任何路由深度和任何合法的路由路徑順序、\(必要的\) 路由器參數，以及\(選用的\) 路由器參數物件。

## `LocationStrategy` 與瀏覽器網址樣式

當路由器導航到新的元件視圖時，它會使用該視圖的 URL 更新瀏覽器的位址和記錄。

現代 HTML5 瀏覽器支援 [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 瀏覽器歷史記錄推入狀態')，這項技術會變更瀏覽器的位置和歷史記錄，而不會觸發伺服器頁面請求。
路由器可以組合「自然」的 URL，它與否則需要載入頁面的 URL 無法區分。

以下是使用「HTML5 pushState」樣式的危機中心網址：

```http
localhost:3002/crisis-center
```

較舊的瀏覽器會在位置 URL 變更時向伺服器發送頁面要求，除非變更發生在「#」之後（稱為「雜湊」）。
路由器可以透過在應用程式路由 URL 中加入雜湊來利用此例外。
以下是一個路由到危機中心的「雜湊 URL」。

```http
localhost:3002/src/#/crisis-center
```

路由器支援兩種樣式，提供兩個 `LocationStrategy` 提供者：

| 供應商              | 詳細資訊                              |
| :--------------------- | :----------------------------------- |
| `PathLocationStrategy` | 預設的「HTML5 pushState」樣式。 |
| `HashLocationStrategy` | 「雜湊 URL」樣式。                |

`RouterModule.forRoot()` 函數會將 `LocationStrategy` 設為 `PathLocationStrategy`，使其成為預設策略。
您也可以在引導程序期間以覆寫的方式切換至 `HashLocationStrategy`。

HELPFUL: 有關提供者和引導程序的更多資訊，請參閱 [相依性注入](guide/di/dependency-injection-providers)。

## 選擇路由策略

在項目開發早期，您必須選擇路由策略，因為一旦應用程式投入生產，網站訪客會使用並依賴應用程式網址參考。

幾乎所有 Angular 專案都應該使用預設的 HTML5 風格。
它產生的 URL 使用者更容易理解，並保留了執行伺服器端呈現的選項。

在伺服器上呈現關鍵頁面是一種技術，它可以大幅改善應用程式首次載入時感受到的回應性。
一個原本需要十秒以上才能啟動的應用程式，可以在伺服器上進行呈現，並在不到一秒的時間內傳送到使用者的裝置。

如果應用程式網址看起來像沒有中間雜湊 (`#`) 字元的正常網路網址，則此選項才可用。

## `<base href>`

該路由器使用瀏覽器的 [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 瀏覽器歷史記錄 push-state') 進行導覽。
`pushState` 讓您可以自訂應用程式內部 URL 路徑；例如，`localhost:4200/crisis-center`。
應用程式內部的 URL 無法與伺服器 URL 區分。

現代的 HTML5 瀏覽器是第一批支援 `pushState` 的瀏覽器，這就是為什麼很多人稱呼這些網址為「HTML5 風格」網址。

HELPFUL: HTML5 風格導覽是路由器預設值。
在 [LocationStrategy 和瀏覽器 URL 風格](#browser-url-styles) 部分中，瞭解為何 HTML5 風格較佳、如何調整其行為以及如何在有需要時切換至較舊的雜湊 \(`#`\) 風格。

您必須在應用程式的 `index.html` 中加入 [`<base href>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href')，`pushState` 路由才能運作。
瀏覽器使用 `<base href>` 值為 CSS 檔案、指令碼和圖片參照時加上相對 URL 的字首。

將 `<base>` 元素新增到 `<head>` 標籤之後。
如果 `app` 資料夾是應用程式根目錄，如這個應用程式，請在 `index.html` 中設定 `href` 值，如下所示。

<docs-code header="src/index.html (base-href)" path="adev/src/content/examples/router/src/index.html" visibleRegion="base-href"/>

### HTML5 網址和 `<base href>`

以下準則將參考 URL 的不同部分。
此圖表概述這些部分所指為何：

<docs-code hideCopy language="text">
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
</docs-code>

雖然路由器預設使用 [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries '瀏覽器歷史 push-state') 風格，您必須以 `<base href>` 配置該策略。

設定策略的優先方式是在 `index.html` 的 `<head>` 中加入一個 [`<base href>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') 標記。

```html
<base href="/">
```

沒有該標籤，瀏覽器在「深度連結」到應用程式時，可能無法載入資源（圖像、CSS、腳本）。

有些開發人員可能無法新增 `<base>` 元素，可能是因為他們無法存取 `<head>` 或 `index.html`。

這些開發人員仍可藉由採取下列兩個步驟來使用 HTML5 URL：

1. 提供路由器一個適當的 `APP_BASE_HREF` 值。
1. 使用根網址 (具有「權限」的網址) 作為所有網路資源的 CSS、圖像、腳本和範本 HTML 檔案。

   - `<base href>` `path` 應以「/」結尾，因為瀏覽器會忽略 `path` 中位於最右邊「`/`」之後的字元
   - 如果 `<base href>` 包含 `query` 部分，則僅在頁面中連結的 `path` 為空且沒有 `query` 時才會使用 `query`。
     這表示僅在使用 `HashLocationStrategy` 時才會包含 `<base href>` 中的 `query`。

   - 如果頁面中的連結是根網址 (具有「權限」)，則不會使用 `<base href>`。
     如此一來，具有權限的 `APP_BASE_HREF` 會導致 Angular 建立的所有連結忽略 `<base href>` 值。

   - `<base href>` 中的片段 _從不_ 會被保留

有關 `<base href>` 如何用於建構目標 URI 的更完整資訊，請參閱 [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) 關於轉換參考的章節。

### `HashLocationStrategy``

在 `AppModule` 中的 `RouterModule.forRoot()` 的第二個參數中，提供一個物件 `{ useHash: true }`，使用 `HashLocationStrategy`。

```ts
providers: [
  provideRouter(appRoutes, withHashLocation())
]
```

在使用 `RouterModule.forRoot` 時，這會在第二個參數中以 `useHash: true` 進行配置：`RouterModule.forRoot(routes, {useHash: true})`。
