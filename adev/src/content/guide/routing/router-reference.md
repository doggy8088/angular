# 路由器參考

以下各節說明路由器的一些核心概念與術語。

## 路由器事件

每次導覽期間，`Router` 都會透過 `Router.events` 屬性發出導覽事件。
下表列出這些事件。

| 路由器事件                                                | 說明                                                                                                                                                                   |
| :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | 導覽開始時觸發。                                                                                                                                                       |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | `Router` 延遲載入路由設定之前觸發。                                                                                                                                    |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | 路由完成延遲載入之後觸發。                                                                                                                                             |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Router 解析 URL 且路由被辨識出來時觸發。                                                                                                                               |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Router 開始路由的 Guards 階段時觸發。                                                                                                                                  |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Router 開始啟用某條路由的子路由時觸發。                                                                                                                                |
| [`ActivationStart`](api/router/ActivationStart)           | Router 開始啟用某條路由時觸發。                                                                                                                                        |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Router 成功完成路由的 Guards 階段時觸發。                                                                                                                              |
| [`ResolveStart`](api/router/ResolveStart)                 | Router 開始路由的 Resolve 階段時觸發。                                                                                                                                 |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Router 成功完成路由的 Resolve 階段時觸發。                                                                                                                             |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Router 完成啟用某條路由的子路由時觸發。                                                                                                                                |
| [`ActivationEnd`](api/router/ActivationEnd)               | Router 完成啟用某條路由時觸發。                                                                                                                                        |
| [`NavigationEnd`](api/router/NavigationEnd)               | 導覽成功結束時觸發。                                                                                                                                                   |
| [`NavigationCancel`](api/router/NavigationCancel)         | 導覽被取消時觸發。例如路由守衛在導覽期間傳回 false，或傳回 `UrlTree` 或 `RedirectCommand` 進行重新導向時，就可能發生。                                                |
| [`NavigationError`](api/router/NavigationError)           | 導覽因未預期的錯誤而失敗時觸發。                                                                                                                                       |
| [`Scroll`](api/router/Scroll)                             | 代表一個捲動事件。                                                                                                                                                     |

啟用 `withDebugTracing` 功能後，Angular 會把這些事件記錄到主控台。

## 路由器術語

以下是重要的 `Router` 術語及其意義：

| 路由器組成            | 說明                                                                                                                                                                                                                                      |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Router`              | 顯示目前 URL 對應的應用程式元件，並管理從一個元件到下一個元件的導覽。                                                                                                                                                                     |
| `provideRouter`       | 提供在應用程式檢視之間導覽所需的服務提供者。                                                                                                                                                                                              |
| `RouterModule`        | 獨立的 NgModule，提供在應用程式檢視之間導覽所需的服務提供者與指令。                                                                                                                                                                       |
| `Routes`              | 定義一組 Routes 陣列，每一筆都把一條 URL 路徑對應到一個元件。                                                                                                                                                                             |
| `Route`               | 定義路由器應如何依 URL 模式導覽到某個元件。Route 可包含路徑、元件、子路由、守衛、解析器與資源。                                                                                                                                           |
| `RouterOutlet`        | 標示路由器顯示檢視位置的指令 \(`<router-outlet>`\)。                                                                                                                                                                                      |
| `RouterLink`          | 把可點選的 HTML 元素繫結到路由的指令。點選繫結了 _字串_ 或 _連結參數陣列_ 的 `routerLink` 指令元素，就會觸發導覽。                                                                                                                       |
| `RouterLinkActive`    | 當元素上或元素內部的相關 `routerLink` 變為啟用／未啟用狀態時，為 HTML 元素新增或移除 class 的指令。它也可以設定啟用中連結的 `aria-current`，以提升無障礙體驗。                                                                             |
| `ActivatedRoute`      | 提供給每個路由元件的服務，包含該路由專屬的資訊，例如路由參數、靜態資料、解析資料、路由資源、全域查詢參數與全域 fragment。                                                                                                                 |
| `RouterState`         | 路由器的目前狀態，包含目前已啟用路由組成的樹狀結構，以及遍歷路由樹的便利方法。                                                                                                                                                            |
| 連結參數陣列          | 路由器會把這個陣列解讀為路由指示。你可以把該陣列繫結到 `RouterLink`，或把它當作引數傳給 `Router.navigate` 方法。                                                                                                                         |
| 路由元件              | 帶有 `RouterOutlet` 的 Angular 元件，依路由器導覽顯示檢視。                                                                                                                                                                               |

## `<base href>`

路由器使用瀏覽器的 [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') 進行導覽。
`pushState` 讓你可以自訂應用程式內的 URL 路徑，例如 `localhost:4200/crisis-center`。
應用程式內的 URL 與伺服器 URL 看起來可以完全一樣。

現代 HTML5 瀏覽器率先支援 `pushState`，因此許多人把這類 URL 稱為「HTML5 風格」URL。

HELPFUL: HTML5 風格導覽是路由器的預設方式。
在 [LocationStrategy 與瀏覽器 URL 風格](guide/routing/common-router-tasks#locationstrategy-and-browser-url-styles) 一節中，你可以了解為什麼 HTML5 風格較佳、如何調整它的行為，以及必要時如何切換到較舊的 hash \(`#`\) 風格。

你必須在應用程式的 `index.html` 中加入 [`<base href>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href')，`pushState` 路由才能運作。
瀏覽器在參照 CSS 檔案、指令碼與圖片時，會用 `<base href>` 的值作為相對 URL 的前綴。

把 `<base>` 元素加在 `<head>` 標籤之後。
若 `app` 資料夾是應用程式根目錄（本應用程式正是如此），請如下設定 `index.html` 中的 `href` 值。

```html
<base href="/" />
```

### HTML5 URL 與 `<base href>`

後續的說明會提到 URL 的不同部分。
下圖說明這些部分所指為何：

```text {hideCopy}
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
```

路由器預設使用 [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state') 風格，但你必須用 `<base href>` 來設定該策略。

設定該策略的首選方式，是在 `index.html` 的 `<head>` 中加入 [`<base href>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') 標籤。

```angular-html
<base href="/" />
```

少了這個標籤，瀏覽器在「深層連結」進入應用程式時，可能無法載入資源 \(圖片、CSS、指令碼\)。

有些開發者可能無法加入 `<base>` 元素，例如因為他們無法存取 `<head>` 或 `index.html`。

這些開發者仍可透過以下兩個步驟使用 HTML5 URL：

1. 為路由器提供適當的 `APP_BASE_HREF` 值。
1. 所有網路資源（CSS、圖片、指令碼與範本 HTML 檔案）都使用根 URL（帶有 `authority` 的 URL）：
   - `<base href>` 的 `path` 應以 "/" 結尾，因為瀏覽器會忽略 `path` 中最右側 "`/`" 之後的字元
   - 若 `<base href>` 包含 `query` 部分，只有當頁面中連結的 `path` 為空且沒有 `query` 時，才會使用該 `query`。
     這表示 `<base href>` 中的 `query` 只有在使用 `HashLocationStrategy` 時才會被納入。

   - 若頁面中的連結是根 URL（帶有 `authority`），就不會使用 `<base href>`。
     如此一來，帶有 authority 的 `APP_BASE_HREF` 會使 Angular 建立的所有連結都忽略 `<base href>` 的值。

   - `<base href>` 中的 fragment _絕不_ 會被保留

關於 `<base href>` 如何用來建構目標 URI 的更完整資訊，請參閱 [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) 中關於轉換參照的章節。

### `HashLocationStrategy`

在 `AppModule` 中，把帶有 `useHash: true` 的物件作為 `RouterModule.forRoot()` 的第二個引數，即可使用 `HashLocationStrategy`。

```ts
providers: [provideRouter(appRoutes, withHashLocation())];
```

使用 `RouterModule.forRoot` 時，這項設定是在第二個引數中以 `useHash: true` 指定：`RouterModule.forRoot(routes, {useHash: true})`。
