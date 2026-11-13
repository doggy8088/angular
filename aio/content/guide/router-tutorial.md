# 在單頁應用程式中使用 Angular 路由

本教學說明如何建立一個使用多條 Angular 路由的單頁應用程式（SPA）。

在單頁應用程式（SPA）中，應用程式的所有功能都存在於單一 HTML 頁面中。
當使用者使用應用程式的功能時，瀏覽器只需要渲染與使用者相關的部分，不必載入新頁面。
這種模式能大幅提升應用程式的使用者體驗。

你可以使用路由來定義使用者如何在應用程式中導覽。
加入路由，定義使用者如何從應用程式的一個部分導覽到另一個部分。
你也可以設定路由，防範未預期或未經授權的行為。

若要探索包含本教學內容的範例應用程式，請參閱 <live-example></live-example>。

## 學習目標

* 將範例應用程式的功能組織成模組。
* 定義如何導覽到某個元件。
* 使用參數將資訊傳給元件。
* 透過巢狀方式安排多條路由，建構路由結構。
* 檢查使用者是否可以存取某條路由。
* 控制應用程式是否可以捨棄未儲存的變更。
* 透過預先擷取路由資料與延遲載入功能模組來改善效能。
* 要求符合特定條件才能載入元件。

## 先決條件

若要完成本教學，你應該對下列概念有基本的理解：

*   JavaScript
*   HTML
*   CSS
*   [Angular CLI](cli)

你可能會覺得[英雄之旅教學](tutorial)很有幫助，但並非必要。

## 建立範例應用程式

使用 Angular CLI 建立一個新應用程式 *angular-router-sample*。
這個應用程式將有兩個元件：*crisis-list* 與 *heroes-list*。

1. 建立一個新的 Angular 專案 *angular-router-sample*。

    <code-example format="shell" language="shell">

    ng new angular-router-sample

    </code-example>

    當畫面提示 `Would you like to add Angular routing?` 時，選取 `N`。

    當畫面提示 `Which stylesheet format would you like to use?` 時，選取 `CSS`。

    稍待片刻，新專案 `angular-router-sample` 就準備好了。

1. 在終端機中，切換到 `angular-router-sample` 目錄。
1. 建立一個元件 *crisis-list*。

    <code-example format="shell" language="shell">

    ng generate component crisis-list

    </code-example>

1. 在程式碼編輯器中，找到 `crisis-list.component.html` 檔案，把預留內容換成下列 HTML。

    <code-example header="src/app/crisis-list/crisis-list.component.html" path="router-tutorial/src/app/crisis-list/crisis-list.component.html"></code-example>

1. 建立第二個元件 *heroes-list*。

    <code-example format="shell" language="shell">

    ng generate component heroes-list

    </code-example>

1. 在程式碼編輯器中，找到 `heroes-list.component.html` 檔案，把預留內容換成下列 HTML。

    <code-example header="src/app/heroes-list/heroes-list.component.html" path="router-tutorial/src/app/heroes-list/heroes-list.component.html"></code-example>

1. 在程式碼編輯器中，開啟 `app.component.html` 檔案，把其內容換成下列 HTML。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="setup"></code-example>

1. 執行 `ng serve` 指令，驗證新應用程式是否如預期般運作。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1. 在瀏覽器中開啟 `http://localhost:4200`。

    你應該會看到一個網頁，內容包含一個標題與你的兩個元件的 HTML。

## 從 `@angular/router` 匯入 `RouterModule`

路由功能可依 URL 路徑顯示應用程式的特定檢視。若要為範例應用程式加入這項功能，你需要更新 `app.module.ts` 檔案以使用 `RouterModule` 模組。
你可以從 `@angular/router` 匯入這個模組。

1. 在程式碼編輯器中，開啟 `app.module.ts` 檔案。
1. 加入下列 `import` 陳述式：

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="router-import"></code-example>

## 定義你的路由

在本節中，你將定義兩條路由：

* 路由 `/crisis-center` 會開啟 `crisis-center` 元件。
* 路由 `/heroes-list` 會開啟 `heroes-list` 元件。

路由定義是一個 JavaScript 物件。
每條路由通常有兩個屬性。
第一個屬性 `path` 是一個字串，指定該路由的 URL 路徑。
第二個屬性 `component`，指定應用程式應該為該路徑顯示哪個元件。

1. 在程式碼編輯器中，開啟 `app.module.ts` 檔案。
1. 找到 `@NgModule()` 區段。
1. 將該區段中的 `imports` 陣列換成下列內容。

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="import-basic"></code-example>

這段程式碼把 `RouterModule` 加入 `imports` 陣列。
接著，程式碼使用 `RouterModule` 的 `forRoot()` 方法定義你的兩條路由。
這個方法接受一個 JavaScript 物件陣列，每個物件定義一條路由的屬性。
`forRoot()` 方法確保你的應用程式只會建立一個 `RouterModule` 實例。
更多資訊請參閱[單例服務](guide/singleton-services#forroot-與-router)。

## 以 `router-outlet` 更新你的元件

至此，你已為應用程式定義了兩條路由。
然而，你的應用程式仍把 `crisis-list` 與 `heroes-list` 兩個元件寫死在 `app.component.html` 範本中。
若要讓路由運作，你需要更新範本，依 URL 路徑動態載入元件。

若要實作這項功能，你需要把 `router-outlet` 指令加入範本檔案。

1. 在程式碼編輯器中，開啟 `app.component.html` 檔案。
1. 刪除下列幾行。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="components"></code-example>

1. 加入 `router-outlet` 指令。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="router-outlet"></code-example>

在瀏覽器中檢視更新後的應用程式。
你應該只會看到應用程式標題。
若要檢視 `crisis-list` 元件，請在瀏覽器網址列的路徑末端加上 `crisis-list`。
例如：

<code-example format="https" language="https">

http://localhost:4200/crisis-list

</code-example>

請注意，畫面上顯示了 `crisis-list` 元件。
Angular 正使用你定義的路由來動態載入該元件。
你可以用相同方式載入 `heroes-list` 元件：

<code-example format="https" language="https">

http://localhost:4200/heroes-list

</code-example>

## 以 UI 元素控制導覽

目前，你的應用程式支援兩條路由。
然而，使用者要使用這些路由，唯一的方法是在瀏覽器網址列中手動輸入路徑。
在本節中，你將加入兩個連結，讓使用者點選後能在 `heroes-list` 與 `crisis-list` 元件之間導覽。
你也會加入一些 CSS 樣式。
這些樣式並非必要，但能讓使用者更容易辨認目前顯示元件所對應的連結。
你將在下一節加入這項功能。

1. 開啟 `app.component.html` 檔案，在標題下方加入下列 HTML。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="nav"></code-example>

    這段 HTML 使用了 Angular 指令 `routerLink`。
    這個指令把你定義的路由與範本檔案連接起來。

1. 開啟 `app.component.css` 檔案，加入下列樣式。

    <code-example header="src/app/app.component.css" path="router-tutorial/src/app/app.component.css"></code-example>

在瀏覽器中檢視你的應用程式，你應該會看到這兩個連結。
點選其中一個連結時，對應的元件就會出現。

## 辨認目前的路由

使用者雖然能用你在上一節加入的連結導覽應用程式，卻沒有簡單的方法辨認目前的路由是哪一條。
使用 Angular 的 `routerLinkActive` 指令來加入這項功能。

1. 在程式碼編輯器中，開啟 `app.component.html` 檔案。
1. 更新錨點標籤，加入 `routerLinkActive` 指令。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="routeractivelink"></code-example>

再次檢視你的應用程式。
當你點選其中一個按鈕時，該按鈕的樣式會自動更新，向使用者標示目前的元件。
加入 `routerLinkActive` 指令，等於告訴應用程式要把特定的 CSS 類別套用到目前的路由。
在本教學中，該 CSS 類別是 `activebutton`，但你可以使用任何你想要的類別。

請注意，我們也為 `routerLinkActive` 的 `ariaCurrentWhenActive` 指定了值。這能確保視障使用者（他們可能無法察覺套用的不同樣式）也能辨認目前的按鈕。更多資訊請參閱無障礙最佳實務的[使用中連結的標示一節](/guide/accessibility#使用中連結的標示)。

## 加入重新導向

在教學的這個步驟中，你將加入一條路由，把使用者重新導向以顯示 `/heroes-list` 元件。

1. 在程式碼編輯器中，開啟 `app.module.ts` 檔案。
1. 在 `imports` 陣列中，像這樣更新 `RouterModule` 區段。

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="import-redirect"></code-example>

    請注意，這條新路由以空字串作為其路徑。
    此外，它以兩個新屬性取代了 `component` 屬性：

    | 屬性   | 詳細說明 |
    |:---          |:---     |
    | `redirectTo` | 這個屬性指示 Angular 從空路徑重新導向到 `heroes-list` 路徑。 |
    | `pathMatch`  | 這個屬性指示 Angular 要比對多少 URL。對於本教學，你應該把這個屬性設為 `full`。當路徑為空字串時，建議使用這種策略。關於這個屬性的更多資訊，請參閱[Route API 文件](api/router/Route)。 |

現在當你開啟應用程式時，它預設會顯示 `heroes-list` 元件。

## 加入 404 頁面

使用者可能會嘗試存取你尚未定義的路由。
為了因應這種情況，最佳實務是顯示 404 頁面。
在本節中，你將建立一個 404 頁面，並更新路由設定，讓未指定的路由都顯示該頁面。

1. 在終端機中，建立一個新元件 `PageNotFound`。

    <code-example format="shell" language="shell">

    ng generate component page-not-found

    </code-example>

1. 在程式碼編輯器中，開啟 `page-not-found.component.html` 檔案，把其內容換成下列 HTML。

    <code-example header="src/app/page-not-found/page-not-found.component.html" path="router-tutorial/src/app/page-not-found/page-not-found.component.html"></code-example>

1.  開啟 `app.module.ts` 檔案。
    在 `imports` 陣列中，像這樣更新 `RouterModule` 區段。

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="import-wildcard"></code-example>

    這條新路由使用的路徑是 `**`。
    Angular 以這個路徑辨認萬用字元路由。
    任何與設定中既有路由不符的路由，都會使用這條路由。

    <div class="alert is-important">

    請注意，萬用字元路由放在陣列的最後。
路由的順序很重要，因為 Angular 會依序套用路由，並使用第一個符合的路由。

    </div>

試著導覽到應用程式中不存在的路由，例如 `http://localhost:4200/powers`。
這條路由與 `app.module.ts` 檔案中定義的任何路由都不符合。
然而，由於你定義了萬用字元路由，應用程式會自動顯示你的 `PageNotFound` 元件。

## 後續步驟

至此，你已擁有一個基本的應用程式，它使用 Angular 的路由功能，依 URL 位址改變使用者能看到的元件。
你也擴充了這些功能，加入重新導向，以及用來顯示自訂 404 頁面的萬用字元路由。

關於路由的更多資訊，請參閱下列主題：

*   [應用程式內路由與導覽](guide/router)
*   [Router API](api/router)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
