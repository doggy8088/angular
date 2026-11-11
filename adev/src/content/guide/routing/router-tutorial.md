# 在單頁應用程式中使用 Angular 路由

本教學說明如何建立一個使用多條 Angular 路由的單頁應用程式（SPA）。

在單頁應用程式（SPA）中，應用程式的所有功能都存在於單一 HTML 頁面中。
當使用者使用應用程式的功能時，瀏覽器只需要渲染與使用者相關的部分，不必載入新頁面。
這種模式能大幅提升應用程式的使用者體驗。

你可以使用路由來定義使用者如何在應用程式中導覽。
加入路由，定義使用者如何從應用程式的一個部分導覽到另一個部分。
你也可以設定路由，防範未預期或未經授權的行為。

## 目標

* 將範例應用程式的功能組織成模組。
* 定義如何導覽到某個元件。
* 使用參數將資訊傳給元件。
* 透過巢狀方式安排多條路由，建構路由結構。
* 檢查使用者是否可以存取某條路由。
* 控制應用程式是否可以捨棄未儲存的變更。
* 透過預先擷取路由資料與延遲載入功能模組來改善效能。
* 要求符合特定條件才能載入元件。

## 建立範例應用程式

使用 Angular CLI 建立一個新應用程式 *angular-router-sample*。
這個應用程式將有兩個元件：*crisis-list* 與 *heroes-list*。

1. 建立一個新的 Angular 專案 *angular-router-sample*。

    <docs-code language="shell">
    ng new angular-router-sample
    </docs-code>

    當畫面提示 `Would you like to add Angular routing?` 時，選取 `N`。

    當畫面提示 `Which stylesheet format would you like to use?` 時，選取 `CSS`。

    稍待片刻，新專案 `angular-router-sample` 就準備好了。

1. 在終端機中，切換到 `angular-router-sample` 目錄。
1. 建立一個元件 *crisis-list*。

    <docs-code language="shell">
    ng generate component crisis-list
    </docs-code>

1. 在程式碼編輯器中，找到 `crisis-list.component.html` 檔案，把預留內容換成下列 HTML。

    <docs-code header="src/app/crisis-list/crisis-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/crisis-list/crisis-list.component.html"/>

1. 建立第二個元件 *heroes-list*。

    <docs-code language="shell">
    ng generate component heroes-list
    </docs-code>

1. 在程式碼編輯器中，找到 `heroes-list.component.html` 檔案，把預留內容換成下列 HTML。

    <docs-code header="src/app/heroes-list/heroes-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/heroes-list/heroes-list.component.html"/>

1. 在程式碼編輯器中，開啟 `app.component.html` 檔案，把其內容換成下列 HTML。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="setup"/>

1. 執行 `ng serve` 指令，驗證新應用程式是否如預期般運作。

    <docs-code language="shell">
    ng serve
    </docs-code>

1. 在瀏覽器中開啟 `http://localhost:4200`。

    你應該會看到一個網頁，內容包含一個標題與你的兩個元件的 HTML。

## 定義你的路由

在本節中，你將定義兩條路由：

* 路由 `/crisis-center` 會開啟 `crisis-center` 元件。
* 路由 `/heroes-list` 會開啟 `heroes-list` 元件。

路由定義是一個 JavaScript 物件。
每條路由通常有兩個屬性。
第一個屬性 `path` 是一個字串，指定該路由的 URL 路徑。
第二個屬性 `component`，指定應用程式應該為該路徑顯示哪個元件。

1. 在程式碼編輯器中，建立並開啟 `app.routes.ts` 檔案。
1. 為你的應用程式建立並匯出一個路由清單：

    ```ts
    import {Routes} from '@angular/router';

    export const routes = [];
    ```

1. 為你的前兩個元件加入兩條路由：

    ```ts
    {path: 'crisis-list', component: CrisisListComponent},
    {path: 'heroes-list', component: HeroesListComponent},
    ```

這個路由清單是一個 JavaScript 物件陣列，每個物件都定義一條路由的屬性。

## 從 `@angular/router` 匯入 `provideRouter`

路由讓你可以依 URL 路徑顯示應用程式的特定檢視。
若要把這項功能加入範例應用程式，你需要更新 `app.config.ts` 檔案，使用路由器提供者函式 `provideRouter`。
這個提供者函式是從 `@angular/router` 匯入的。

1. 在程式碼編輯器中，開啟 `app.config.ts` 檔案。
1. 加入下列 import 陳述式：

    ```ts
    import { provideRouter } from '@angular/router';
    import { routes } from './app.routes';
    ```

1. 更新 `appConfig` 中的 providers：

    ```ts
    providers: [provideRouter(routes)]
    ```

對於以 `NgModule` 為基礎的應用程式，請把 `provideRouter` 放在 `AppModule` 的 `providers` 清單中，或放在應用程式傳給 `bootstrapModule` 的那個模組中。

## 以 `router-outlet` 更新你的元件

至此，你已為應用程式定義了兩條路由。
然而，你的應用程式仍把 `crisis-list` 與 `heroes-list` 兩個元件寫死在 `app.component.html` 範本中。
若要讓路由運作，你需要更新範本，依 URL 路徑動態載入元件。

若要實作這項功能，你需要把 `router-outlet` 指令加入範本檔案。

1. 在程式碼編輯器中，開啟 `app.component.html` 檔案。
1. 刪除下列幾行。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="components"/>

1. 加入 `router-outlet` 指令。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="router-outlet"/>

1. 在 `app.component.ts` 中，把 `RouterOutlet` 加入 `AppComponent` 的 imports。

    ```ts
    imports: [RouterOutlet],
    ```

在瀏覽器中檢視更新後的應用程式。
你應該只會看到應用程式標題。
若要檢視 `crisis-list` 元件，請在瀏覽器網址列的路徑末端加上 `crisis-list`。
例如：

<docs-code language="http">
http://localhost:4200/crisis-list
</docs-code>

請注意，畫面上顯示了 `crisis-list` 元件。
Angular 正使用你定義的路由來動態載入該元件。
你可以用相同方式載入 `heroes-list` 元件：

<docs-code language="http">
http://localhost:4200/heroes-list
</docs-code>

## 以 UI 元素控制導覽

目前，你的應用程式支援兩條路由。
然而，使用者要使用這些路由，唯一的方法是在瀏覽器網址列中手動輸入路徑。
在本節中，你將加入兩個連結，讓使用者點選後能在 `heroes-list` 與 `crisis-list` 元件之間導覽。
你也會加入一些 CSS 樣式。
這些樣式並非必要，但能讓使用者更容易辨認目前顯示元件所對應的連結。
你將在下一節加入這項功能。

1. 開啟 `app.component.html` 檔案，在標題下方加入下列 HTML。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="nav"/>

    這段 HTML 使用了 Angular 指令 `routerLink`。
    這個指令把你定義的路由與範本檔案連接起來。

1. 在 `app.component.ts` 中，把 `RouterLink` 指令加入 `AppComponent` 的 imports 清單。

1. 開啟 `app.component.css` 檔案，加入下列樣式。

    <docs-code header="src/app/app.component.css" path="adev/src/content/examples/router-tutorial/src/app/app.component.css"/>

在瀏覽器中檢視你的應用程式，你應該會看到這兩個連結。
點選其中一個連結時，對應的元件就會出現。

## 辨認目前的路由

使用者雖然能用你在上一節加入的連結導覽應用程式，卻沒有簡單的方法辨認目前的路由是哪一條。
使用 Angular 的 `routerLinkActive` 指令來加入這項功能。

1. 在程式碼編輯器中，開啟 `app.component.html` 檔案。
1. 更新 anchor 標籤，加入 `routerLinkActive` 指令。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="routeractivelink"/>
1. Add the `RouterLinkActive` directive to the `imports` list of `AppComponent` in `app.component.ts`.

再次檢視你的應用程式。
當你點選其中一個按鈕時，該按鈕的樣式會自動更新，向使用者標示目前的元件。
加入 `routerLinkActive` 指令，等於告訴應用程式要把特定的 CSS 類別套用到目前的路由。
在本教學中，該 CSS 類別是 `activebutton`，但你可以使用任何你想要的類別。

請注意，我們也為 `routerLinkActive` 的 `ariaCurrentWhenActive` 指定了值。這能確保視障使用者（他們可能無法察覺套用的不同樣式）也能辨認目前的按鈕。更多資訊請參閱無障礙最佳實務的[使用中連結辨認一節](/best-practices/a11y#active-links-identification)。

## 加入重新導向

在教學的這個步驟中，你將加入一條路由，把使用者重新導向以顯示 `/heroes-list` 元件。

1. 在程式碼編輯器中，開啟 `app.routes.ts` 檔案。
1. 如下更新 `routes` 區段。

    ```ts
    {path: '', redirectTo: '/heroes-list', pathMatch: 'full'},
    ```

    請注意，這條新路由以空字串作為其路徑。
    此外，它以兩個新屬性取代了 `component` 屬性：

    | 屬性         | 說明                                                                                                                                                                                     |
    |:---        |:---    |
    | `redirectTo` | 這個屬性指示 Angular 從空路徑重新導向到 `heroes-list` 路徑。                                                                                                                             |
    | `pathMatch`  | 這個屬性指示 Angular 要比對 URL 的多少部分。在本教學中，你應該把這個屬性設為 `full`。當路徑是空字串時，建議使用這個策略。關於這個屬性的更多資訊，請參閱 [Route API 文件](api/router/Route)。 |

現在當你開啟應用程式時，它預設會顯示 `heroes-list` 元件。

## 加入 404 頁面

使用者可能會嘗試存取你尚未定義的路由。
為了因應這種情況，最佳實務是顯示 404 頁面。
在本節中，你將建立一個 404 頁面，並更新路由設定，讓未指定的路由都顯示該頁面。

1. 在終端機中，建立一個新元件 `PageNotFound`。

    <docs-code language="shell">
    ng generate component page-not-found
    </docs-code>

1. 在程式碼編輯器中，開啟 `page-not-found.component.html` 檔案，把其內容換成下列 HTML。

    <docs-code header="src/app/page-not-found/page-not-found.component.html" path="adev/src/content/examples/router-tutorial/src/app/page-not-found/page-not-found.component.html"/>

1. 開啟 `app.routes.ts` 檔案，把下列路由加入路由清單：

    ```ts
    {path: '**', component: PageNotFoundComponent}
    ```

    這條新路由使用的路徑是 `**`。
    Angular 以這個路徑辨認萬用字元路由。
    任何與設定中既有路由不符的路由，都會使用這條路由。

IMPORTANT: 請注意，萬用字元路由放在陣列的最後。
路由的順序很重要，因為 Angular 會依序套用路由，並使用第一個符合的路由。

試著導覽到應用程式中不存在的路由，例如 `http://localhost:4200/powers`。
這條路由與 `app.routes.ts` 檔案中定義的任何路由都不符合。
然而，由於你定義了萬用字元路由，應用程式會自動顯示你的 `PageNotFound` 元件。

## 後續步驟

至此，你已擁有一個基本的應用程式，它使用 Angular 的路由功能，依 URL 位址改變使用者能看到的元件。
你也擴充了這些功能，加入重新導向，以及用來顯示自訂 404 頁面的萬用字元路由。

關於路由的更多資訊，請參閱下列主題：

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="In-app Routing and Navigation"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>
