# 其他常見的路由任務

本指南涵蓋在應用程式中使用 Angular 路由時的其他一些常見任務。

## 取得路由資訊

使用者在應用程式中導覽時，你常會想把資訊從一個元件傳遞到另一個元件。
例如，假設有一個顯示雜貨購物清單的應用程式。
清單中的每個項目都有唯一的 `id`。
若要編輯某個項目，使用者會點選 Edit 按鈕，開啟 `EditGroceryItem` 元件。
你希望這個元件能取得該雜貨項目的 `id`，以便向使用者顯示正確的資訊。

可以使用路由把這類資訊傳遞給應用程式的元件。
做法是搭配 `provideRouter` 使用 `withComponentInputBinding` 功能，或使用 `RouterModule.forRoot` 的 `bindToComponentInputs` 選項。

若要從路由取得資訊：

<docs-workflow>

<docs-step title="加入 `withComponentInputBinding`">

把 `withComponentInputBinding` 功能加入 `provideRouter` 方法。

```ts
providers: [provideRouter(appRoutes, withComponentInputBinding())];
```

</docs-step>

<docs-step title="為元件加入 `input`">

更新元件，讓它有一個名稱與參數相符的 `input()` 屬性。

```ts
id = input.required<string>();
hero = computed(() => this.service.getHero(this.id()));
```

</docs-step>
<docs-step title="選用：使用預設值">
當 `withComponentInputBinding` 啟用時，路由會依據目前的路由，把值指派給所有輸入。
若沒有路由資料符合輸入的鍵，路由會指派 `undefined`，例如選用的查詢參數缺失時。
當輸入有可能無法被路由比對到時，應在 `input` 的型別中包含 `undefined`。

你可以透過在輸入上使用 `transform` 選項來提供預設值，或使用 `linkedSignal` 管理本地狀態。

```ts
id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});
// or
id = input<string | undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());
```

</docs-step>
</docs-workflow>

NOTE: 你可以把所有以鍵值對表示的路由資料繫結到元件輸入：路由資源、靜態或已解析的路由資料、路徑參數、矩陣參數與查詢參數。

### 輸入繫結的優先順序

當多個路由來源定義了相同的鍵時，路由會以下列優先順序（由高到低）解決衝突：

1. **路由資源**：在路由的 `resources` 對應表中定義的值。阻擋型資源繫結其解包後的值（`resource.value()`），非阻擋型資源則繫結 `Resource` 實例。
2. **路由資料與解析器**：在 `data` 中定義的靜態資料，或透過 `resolve` 解析的值。
3. **路徑參數與矩陣參數**：來自 URL 路徑的參數（例如 `:id`）與矩陣參數。
4. **查詢參數**：來自查詢字串的參數（例如 `?id=123`）。

例如，若一條路由同時有路徑參數 `:id` 與查詢參數 `?id=...`，路徑參數的值會繫結到元件的 `id` 輸入。若該路由還定義了名為 `id` 的資源，資源的值優先於兩者。

### 停用查詢參數繫結

若你另外管理查詢參數，可使用 `ComponentInputBindingOptions` 停用查詢參數繫結：

```ts
provideRouter(appRoutes, withComponentInputBinding({queryParams: false}));
```

### 設定路由資料中沒有對應輸入時的行為

預設情況下，若某個輸入在導覽期間無法從路由資料取得，路由會把該輸入設為 `undefined`。這可確保不會保留過時的資料。

若你想避免為在作用中的元件實例上從未出現在路由資料中的輸入設定 `undefined`，可把 `unmatchedInputBehavior` 選項設為 `'undefinedIfStale'`：

```ts
provideRouter(appRoutes, withComponentInputBinding({unmatchedInputBehavior: 'undefinedIfStale'}));
```

當你把 `unmatchedInputBehavior: 'undefinedIfStale'` 與 `queryParams: false` 組合使用時，輸入會保留其初始值，除非路由明確提供。唯一的例外是矩陣參數：若矩陣參數在一次導覽中提供、卻在後續導覽中被移除，路由會把該輸入設為 `undefined`，以避免保留過時資料。

```ts
provideRouter(
  appRoutes,
  withComponentInputBinding({
    queryParams: false,
    unmatchedInputBehavior: 'undefinedIfStale',
  }),
);
```

### 繼承父路由資料

預設情況下，子路由會繼承父路由的參數與資料（等同於 `paramsInheritanceStrategy: 'always'`）。這表示你可以直接在子元件中存取父路由的資訊。

若你需要還原舊有行為（參數只從空路徑路由繼承），可把 `paramsInheritanceStrategy` 設為 `'emptyOnly'`：

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'emptyOnly'}));
```

其他可用設定的詳細資訊，請參閱[路由設定選項](guide/routing/customizing-route-behavior#router-configuration-options)。

## 顯示 404 頁面

若要顯示 404 頁面，請設定一條[萬用字元路由](guide/routing/define-routes#wildcards)，把它的 `component` 屬性設為你想用作 404 頁面的元件，如下所示：

```ts
const routes: Routes = [
  {path: 'first-component', component: First},
  {path: 'second-component', component: Second},
  {path: '**', component: PageNotFound}, // Wildcard route for a 404 page
];
```

最後一條 `path` 為 `**` 的路由是萬用字元路由。
若請求的 URL 與清單中較前面的任何路徑都不符，路由會選取這條路由，並把使用者送往 `PageNotFound`。

## 連結參數陣列

連結參數陣列包含路由導覽所需的下列要素：

- 通往目標元件的路由路徑
- 進入路由 URL 的必要與選用路由參數

把 `RouterLink` 指令繫結到這樣的陣列，如下所示：

```angular-html
<a [routerLink]="['/heroes']">Heroes</a>
```

以下是在指定路由參數時包含兩個元素的陣列：

```angular-html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span
  >{{ hero.name }}
</a>
```

在物件中提供選用的路由參數，如 `{ foo: 'foo' }`：

```angular-html
<a [routerLink]="['/crisis-center', {foo: 'foo'}]">Crisis Center</a>
```

這種語法傳遞的是矩陣參數，也就是與特定 URL 區段相關聯的選用參數。深入瞭解[矩陣參數](/guide/routing/read-route-state#matrix-parameters)。

這三個範例涵蓋了只有一層路由的應用程式的需求。
不過，若有子路由（例如危機中心），就會產生新的連結陣列可能性。

下列極簡的 `RouterLink` 範例，以危機中心指定的預設子路由為基礎。

```angular-html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

請檢視下列事項：

- 陣列的第一個項目識別父路由 \(`/crisis-center`\)
- 此父路由沒有參數
- 子路由沒有預設值，所以你需要挑選一個
- 你要導覽到 `CrisisList`，其路由路徑是 `/`，但你不需要明確加上斜線

考慮下列路由連結：它從應用程式的根目錄一路導覽到 Dragon Crisis：

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- 陣列的第一個項目識別父路由 \(`/crisis-center`\)
- 此父路由沒有參數
- 第二個項目識別特定危機的子路由詳細資訊 \(`/:id`\)
- 該詳細資訊子路由需要一個 `id` 路由參數
- 你把 Dragon Crisis 的 `id` 作為陣列的第二個項目加入 \(`1`\)
- 產生的路徑是 `/crisis-center/1`

你也可以只用 Crisis Center 路由重新定義 `App` 範本：

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', {foo: 'foo'}]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

總之，你可以撰寫具有一層、兩層或更多層路由的應用程式。
連結參數陣列提供了足夠的彈性，可以表示任意路由深度，以及任意合法的路由路徑、（必要的）路由參數與（選用的）路由參數物件序列。

## `LocationStrategy` 與瀏覽器 URL 樣式

當路由導覽到新的元件檢視時，它會以該檢視的 URL 更新瀏覽器的位置與歷史紀錄。

現代 HTML5 瀏覽器支援 [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state')，這是一種在不觸發伺服器頁面請求的情況下，變更瀏覽器位置與歷史紀錄的技術。
路由可以組出一個「自然的」URL，與原本需要載入頁面才得到的 URL 無法區分。

以下是這種「HTML5 pushState」樣式的 Crisis Center URL：

```text
localhost:3002/crisis-center
```

較舊的瀏覽器在位置 URL 變更時會向伺服器送出頁面請求，除非變更發生在 "#" 之後（稱為「hash」）。
路由可以利用這個例外，以 hash 組出應用程式內的路由 URL。
以下是一個導向 Crisis Center 的「hash URL」。

```text
localhost:3002/src/#/crisis-center
```

路由透過兩個 `LocationStrategy` 提供者支援這兩種樣式：

| 提供者                 | 詳細資訊                             |
| :--------------------- | :----------------------------------- |
| `PathLocationStrategy` | 預設的「HTML5 pushState」樣式。      |
| `HashLocationStrategy` | 「hash URL」樣式。                   |

`RouterModule.forRoot()` 函式把 `LocationStrategy` 設為 `PathLocationStrategy`，使它成為預設策略。
你也可以在引導過程中透過覆寫，切換到 `HashLocationStrategy`。

HELPFUL: 如需深入瞭解提供者與引導程序，請參閱[依賴注入](guide/di/defining-dependency-providers)。
