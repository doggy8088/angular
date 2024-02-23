# 在單頁應用程式中使用 Angular 路由

本教學說明如何建置單頁應用程式，SPA 使用多個 Angular 路由。

在單頁應用程式 (SPA) 中，應用程式的功能皆存在於單一 HTML 頁面中。
當使用者存取應用程式的功能時，瀏覽器僅需呈現對使用者重要的部分，而不需載入新頁面。
這種模式可以顯著改善應用程式的使用者體驗。

若要定義使用者如何在您的應用程式中導覽，請使用路由。
新增路由以定義使用者如何從應用程式的一個部分導覽到另一個部分。
您也可以設定路由以防範意外或未經授權的行為。

## 目標

* 將範例應用程式的功能整理成模組。
* 定義如何導覽至元件。
* 使用參數將資訊傳遞至元件。
* 透過巢狀多個路由來建構路由。
* 檢查使用者是否可以存取路由。
* 控制應用程式是否可以捨棄未儲存的變更。
* 透過預先擷取路由資料和延遲載入功能模組來提升效能。
* 要求特定條件來載入元件。

## 建立範例應用程式

使用 Angular CLI，建立一個新的應用程式，*angular-router-sample*。
此應用程式將有兩個元件：*crisis-list* 和 *heroes-list*。

1. 建立一個新的 Angular 專案，*angular-router-sample*。

    <docs-code language="shell">
    ng new angular-router-sample
    </docs-code>

    當出現提示 `您要新增 Angular 路由嗎？`，選擇 `N`。

    當出現提示 `您想要使用哪一種樣式表格式？`，選擇 `CSS`。

    幾分鐘後，新的專案 `angular-router-sample` 就準備好了。

1. 從終端機移至 `angular-router-sample` 目錄。
1. 建立一個元件，*crisis-list*。

    <docs-code language="shell">
    ng generate component crisis-list
    </docs-code>

1. 在您的程式碼編輯器中，找到檔案 `crisis-list.component.html`，並將 placeholder 內容替換為以下 HTML。

    <docs-code header="src/app/crisis-list/crisis-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/crisis-list/crisis-list.component.html"/>

1. 建立第二個元件，*heroes-list*。

    <docs-code language="shell">
    ng generate component heroes-list
    </docs-code>

1. 在您的程式碼編輯器中，找到檔案 `heroes-list.component.html`，並將 placeholder 內容替換為以下 HTML。

    <docs-code header="src/app/heroes-list/heroes-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/heroes-list/heroes-list.component.html"/>

1. 在您的程式碼編輯器中，開啟檔案 `app.component.html`，並將其內容替換為以下 HTML。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="setup"/>

1. 執行 `ng serve` 指令，驗證您的新應用程式是否如預期般執行。

    <docs-code language="shell">
    ng serve
    </docs-code>

1. 在瀏覽器中開啟 `http://localhost:4200`。

    您應該會看到一個單一的網頁，包含一個標題和兩個元件的 HTML。

## 定義您的路由

在這個章節中，您將定義兩個路由：

* 路由 `/crisis-center` 打開 `crisis-center` 元件。
* 路由 `/heroes-list` 打開 `heroes-list` 元件。

路由定義是一個 JavaScript 物件。
每個路由通常有兩個屬性。
第一個屬性 `path` 是指定路由的 URL 路徑的字串。
第二個屬性 `component` 是指定應用程式應為該路徑顯示哪個元件的字串。

1. 在你的程式碼編輯器中，建立並開啟 `app.routes.ts` 檔案。
1. 為你的應用程式建立並匯出一個路由清單：

    ts
    import {Routes} from '@angular/router';

    export const routes = [];
    1. 為你的前兩個元件新增兩個路由：

    ts
    {path: 'crisis-list', component: CrisisListComponent},
    {path: 'heroes-list', component: HeroesListComponent},

這個路由清單是一個 JavaScript 物件陣列，每個物件定義路由的屬性。

## 從 `@angular/router` 匯入 `provideRouter`

路由可讓您根據 URL 路徑顯示應用程式的特定檢視。
若要將此功能新增至範例應用程式，您需要更新 `app.config.ts` 檔案以使用路由器提供者函式 `provideRouter`。
您從 `@angular/router` 匯入此提供者函式。

1. 從程式碼編輯器中，開啟 `app.config.ts` 檔案。
1. 加入以下匯入陳述式：

    ts
    import { provideRouter } from '@angular/router';
    import { routes } from './app.routes';
    1. 更新 `appConfig` 中的提供者：

    ts
    providers: [provideRouter(routes)]

對於基於 `NgModule` 的應用程式，請將 `provideRouter` 放在 `AppModule` 的 `providers` 清單中，或放在應用程式中傳遞給 `bootstrapModule` 的任何模組中。

## 使用 `router-outlet` 更新元件

html
<router-outlet></router-outlet>

在這個階段，您已經為應用程式定義了兩個路由。
然而，您的應用程式仍然在 `app.component.html` 範本中硬編碼了 `crisis-list` 和 `heroes-list` 元件。
若要讓您的路由運作，您需要更新範本以根據 URL 路徑動態載入元件。

若要實作這個功能，請將 `router-outlet` 指令新增至範本檔案。

1. 在你的程式碼編輯器中，開啟 `app.component.html` 檔案。
1. 刪除以下列。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="components"/>

1. 加入 `router-outlet` 指令。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="router-outlet"/>

1. 將 `RouterOutlet` 加入 `app.component.ts` 中 `AppComponent` 的 imports

    ts
    imports: [RouterOutlet],

檢視瀏覽器中已更新的應用程式。
您應該只會看到應用程式標題。
若要檢視 `crisis-list` 元件，請在瀏覽器網址列的路徑尾端加入 `crisis-list`。
例如：

<docs-code language="https">
http://localhost:4200/crisis-list
</docs-code>

請注意 `crisis-list` 元件已顯示。
Angular 使用您定義的路由來動態載入元件。
您可以以相同的方式載入 `heroes-list` 元件：

<docs-code language="https">
http://localhost:4200/heroes-list
</docs-code>

## 使用 UI 元素控制導覽

目前，您的應用程式支援兩種路由。
不過，使用這些路由的唯一方法是讓使用者手動在瀏覽器的網址列中輸入路徑。
在本節中，您將新增兩個連結，使用者可以按一下這些連結，在 `heroes-list` 和 `crisis-list` 元件之間進行導覽。
您還將新增一些 CSS 樣式。
雖然不需要這些樣式，但它們可以讓您更容易辨識目前顯示元件的連結。
您將在下一個部分中新增該功能。

1. 開啟 `app.component.html` 檔案，並在標題下方加入以下 HTML。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="nav"/>

    這段 HTML 使用了 Angular 指令 `routerLink`。
    此指令將您定義的路由連接到您的範本檔案。

1. 在 `app.component.ts` 中將 `RouterLink` 指令新增至 `AppComponent` 的匯入清單。

1. 開啟 `app.component.css` 檔案，並加入以下樣式。

    <docs-code header="src/app/app.component.css" path="adev/src/content/examples/router-tutorial/src/app/app.component.css"/>

如果您在瀏覽器中檢視您的應用程式，您應該會看到這兩個連結。
當您點擊連結時，相對應的元件會出現。

## 識別活躍的路由

雖然使用者可以使用您在上一節中新增的連結來導覽您的應用程式，但他們沒有直接的方式來識別目前的路徑是什麼。
使用 Angular 的 `routerLinkActive` 指令來新增此功能。

1. 從您的程式碼編輯器開啟 `app.component.html` 檔案。
1. 更新錨點標籤以包含 `routerLinkActive` 指令。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="routeractivelink"/>
1. 將 `RouterLinkActive` 指令新增至 `app.component.ts` 中 `AppComponent` 的 `imports` 清單。

再次檢視您的應用程式。
當您按一下其中一個按鈕時，該按鈕的樣式會自動更新，以識別使用者的活動元件。
藉由新增 `routerLinkActive` 指示，您告知應用程式將特定 CSS 類別套用至活動路由。
在本教學課程中，該 CSS 類別為 `activebutton`，但您可以使用任何您想要的類別。

請注意，我們也為 `routerLinkActive` 的 `ariaCurrentWhenActive` 指定一個值。這可確保視障用戶（可能無法察覺所套用的不同樣式）也能識別活動按鈕。有關更多資訊，請參閱無障礙最佳實務 [活動連結識別部分](/best-practices/a11y#active-links-identification)。

## 添加重新導向

在本教學課程的這個步驟中，您新增一個路由，將使用者重新導向以顯示 `/heroes-list` 元件。

1. 從你的程式編輯器中，開啟 `app.routes.ts` 檔案。
1. 更新 `routes` 區段如下。

    ts
    {path: '', redirectTo: '/heroes-list', pathMatch: 'full'},
    請注意，這個新路由使用空字串作為路徑。
    此外，它以兩個新的取代 `component` 屬性：

    | 屬性   | 詳細資料 |
    |:---        |:---    |
    | `redirectTo` | 這個屬性指示 Angular 從空路徑重新導向到 `heroes-list` 路徑。                                                                                                                                                       |
    | `pathMatch`  | 這個屬性指示 Angular 要比對多少的網址。對於本教學課程，你應該將這個屬性設定為 `full`。當路徑為空字串時，建議使用此策略。有關此屬性的更多資訊，請參閱 [Route API 文件](api/router/Route)。 |

現在當你開啟你的應用程式時，它會預設顯示 `heroes-list` 元件。

## 404 頁面新增

使用者可能會嘗試存取您未定義的路由。
為了考量這種行為，最佳作法是顯示 404 頁面。
在本節中，您將建立 404 頁面並更新路由設定，以顯示任何未指定路由的頁面。

1. 在終端機中，建立一個新的元件，`PageNotFound`。

    <docs-code language="shell">
    ng generate component page-not-found
    </docs-code>

1. 從你的程式碼編輯器中，開啟 `page-not-found.component.html` 檔案並將其內容替換為以下 HTML。

    <docs-code header="src/app/page-not-found/page-not-found.component.html" path="adev/src/content/examples/router-tutorial/src/app/page-not-found/page-not-found.component.html"/>

1. 開啟 `app.routes.ts` 檔案並將以下路由新增到路由清單：

    ts
    {path: '**', component: PageNotFoundComponent}


    新的路由使用路徑 `**`。
    這個路徑就是 Angular 識別萬用字元路由的方式。
    任何與你的組態中現有路由不匹配的路由都會使用這個路由。

重要：請注意萬用字元路由放在陣列的最後。
您的路由順序很重要，因為 Angular 會依序套用路由，並使用找到的第一個匹配項。

請嘗試在應用程式中導航至不存在的路由，例如 `http://localhost:4200/powers`。
此路由與 `app.routes.ts` 檔案中定義的任何內容都不相符。
然而，因為您定義了一個萬用字元路由，所以應用程式會自動顯示您的 `PageNotFound` 元件。

## 後續步驟

現在，您有一個基本應用程式，它使用 Angular 的路由功能來變更使用者可以根據 URL 位址看到的元件。
您已擴充這些功能以包含重新導向，以及萬用字元路由來顯示自訂 404 頁面。

有關路由的更多資訊，請參閱下列主題：

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="應用程式內路由與導覽"/>
  <docs-pill href="api/router/Router" title="路由器 API"/>
</docs-pill-row>
