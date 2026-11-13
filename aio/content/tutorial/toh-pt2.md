# 顯示選取清單

在本頁中，你將擴充 Tour of Heroes 應用程式來顯示英雄清單，並讓使用者選取一位英雄、顯示該英雄的詳細資料。

<div class="alert is-helpful">

關於本頁所述的範例應用程式，請參閱 <live-example></live-example>。

</div>

## 建立模擬英雄

你會需要一些英雄來顯示。

最終你會從遠端資料伺服器取得它們。
目前，你先建立一些*模擬英雄*，並假裝它們來自伺服器。

在 `src/app/` 資料夾中建立一個名為 `mock-heroes.ts` 的檔案。
把 `HEROES` 常數定義為包含十位英雄的陣列並將其匯出。
這個檔案應該會像這樣。

<code-example header="src/app/mock-heroes.ts" path="toh-pt2/src/app/mock-heroes.ts"></code-example>

## 顯示英雄

開啟 `HeroesComponent` 類別檔案，匯入模擬的 `HEROES`。

<code-example header="src/app/heroes/heroes.component.ts (import HEROES)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="import-heroes"></code-example>

在同一個檔案中（`HeroesComponent` 類別），定義一個名為 `heroes` 的元件屬性，把 `HEROES` 陣列公開出來以供繫結。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt2/src/app/heroes/heroes.component.ts" region="component"></code-example>

### 使用 `*ngFor` 列出英雄

開啟 `HeroesComponent` 範本檔案，進行以下修改：

1.  在最上方加入一個 `<h2>`。
1.  在它下方加入一個 HTML 無序清單（`<ul>`）元素。
1.  在 `<ul>` 中插入一個 `<li>`。
1.  在 `<li>` 中放入一個 `<button>`，在 `<span>` 元素中顯示 `hero` 的屬性。
1.  撒上一些 CSS 類別來設定樣式（你很快就會加入 CSS 樣式）。

讓它看起來像這樣：

<code-example header="heroes.component.html (heroes template)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="list"></code-example>

這樣會顯示錯誤，因為 'hero' 屬性並不存在。
要存取每一位英雄並列出全部，請在 `<li>` 上加入 `*ngFor` 來逐一走訪英雄清單：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="li"></code-example>

[`*ngFor`](guide/built-in-directives#ngFor) 是 Angular 的*重複器*指令。
它會為清單中的每個元素重複宿主元素。

本範例中的語法如下：

| 語法   | 說明 |
|:---      |:---     |
| `<li>`   | 宿主元素。                                                                  |
| `heroes` | 保存來自 `HeroesComponent` 類別的模擬英雄清單。 |
| `hero`   | 保存每次走訪清單時的目前英雄物件。                 |

<div class="alert is-important">

別忘了在 `ngFor` 前面加上星號 `*`。
這是語法中關鍵的一部分。

</div>

瀏覽器重新整理後，就會出現英雄清單。

<div class="callout is-helpful">

<header>互動元素</header>

**NOTE**: <br />
在 `<li>` 元素內，我們已把英雄的詳細資料包在 `<button>` 元素中。稍後我們會讓英雄可以被點選，而為了無障礙，使用原生互動式 HTML 元素（例如 `<button>`）會比在非互動元素（例如 `<li>`）上加入事件監聽器更好。

想進一步了解無障礙，請參閱 [Angular 中的無障礙](guide/accessibility)。

</div>

<a id="styles"></a>

### 設定英雄樣式

英雄清單應該要美觀，而且當使用者
將滑鼠移到清單中的英雄上方或選取英雄時，應該要有視覺上的回應。

在[第一篇教學](tutorial/toh-pt0#app-wide-styles)中，你在 `styles.css` 中為整個應用程式設定了基本樣式。
那份樣式表並未包含這個英雄清單的樣式。

你可以繼續在 `styles.css` 中加入更多樣式，隨著加入元件而讓那份樣式表不斷擴大。

你也可以改為針對特定元件定義專用樣式，並把元件所需的一切 &mdash;程式碼、HTML 與 CSS&mdash; 都放在同一個地方。

這種做法讓元件更容易在其他地方重複使用，即使全域樣式不同，也能呈現元件預期的外觀。

你可以把專用樣式以行內方式定義在 `@Component.styles` 陣列中，或是定義在 `@Component.styleUrls` 陣列所指出的樣式表檔案中。

當 CLI 產生 `HeroesComponent` 時，它為 `HeroesComponent` 建立了一個空的 `heroes.component.css` 樣式表，並在 `@Component.styleUrls` 中指向它，如下所示。

<code-example header="src/app/heroes/heroes.component.ts (@Component)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="metadata"></code-example>

開啟 `heroes.component.css` 檔案，貼入 `HeroesComponent` 的專用 CSS 樣式。
你可以在本指南底部的[最終程式碼檢閱](#final-code-review)中找到它們。

<div class="alert is-important">

在 `@Component` 中繼資料中指出的樣式與樣式表，其作用範圍僅限於該特定元件。
`heroes.component.css` 的樣式只會套用到 `HeroesComponent`，不會影響外部的 HTML 或任何其他元件中的 HTML。

</div>

## 檢視詳細資料

當使用者點選清單中的英雄時，元件應該在頁面底部顯示所選英雄的詳細資料。

在本節中，你將監聽英雄項目的點選事件，並顯示／更新英雄的詳細資料。

### 加入點選事件繫結

像這樣在 `<li>` 中的 `<button>` 上加入點選事件繫結：

<code-example header="heroes.component.html (template excerpt)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="selectedHero-click"></code-example>

這是 Angular [事件繫結](guide/event-binding)語法的一個範例。

`click` 周圍的括號告訴 Angular，要監聽 `<button>` 元素的 `click` 事件。
當使用者點選 `<button>` 時，Angular 就會執行 `onSelect(hero)` 運算式。

在下一節中，於 `HeroesComponent` 中定義一個 `onSelect()` 方法，來顯示在 `*ngFor` 運算式中定義的英雄。

### 加入點選事件處理常式

把元件的 `hero` 屬性重新命名為 `selectedHero`，但不要給它指派任何值，因為應用程式啟動時還沒有任何*已選取的英雄*。

加入以下的 `onSelect()` 方法，它會把範本中被點選的英雄指派給元件的 `selectedHero`。

<code-example header="src/app/heroes/heroes.component.ts (onSelect)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="on-select"></code-example>

### 加入詳細資料區段

目前，元件範本中有一個清單。
若要點選清單上的英雄並揭露該英雄的詳細資料，你需要在範本中有一個供詳細資料渲染的區段。
在 `heroes.component.html` 的清單區段下方加入以下內容：

<code-example header="heroes.component.html (selected hero details)" path="toh-pt2/src/app/heroes/heroes.component.html" region="selectedHero-details"></code-example>

只有在選取了英雄時，才應該顯示英雄的詳細資料。元件最初建立時，還沒有已選取的英雄，所以我們在包住英雄詳細資料的 `<div>` 上加入 `*ngIf` 指令，指示 Angular 只在 `selectedHero` 確實有定義時（在點選英雄完成選取之後）才渲染這個區段。

<div class="alert is-important">

別忘了在 `ngIf` 前面加上星號 `*` 字元。
這是語法中關鍵的一部分。

</div>

### 設定已選取英雄的樣式

為了幫助辨識已選取的英雄，你可以使用[先前加入的樣式](#styles)中的 `.selected` CSS 類別。
要在使用者點選 `<li>` 時套用 `.selected` 類別，請使用類別繫結。

<div class="lightbox">

<img alt="選取的英雄以深色背景與淺色文字，與未選取的清單項目區分" src="generated/images/guide/toh/heroes-list-selected.png">

</div>

Angular 的[類別繫結](guide/attribute-binding#class-binding)可以依條件加入或移除 CSS 類別。
在你想設定樣式的元素上加入 `[class.some-css-class]="some-condition"`。

在 `HeroesComponent` 範本的 `<button>` 上加入以下的 `[class.selected]` 繫結：

<code-example header="heroes.component.html (toggle the 'selected' CSS class)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="class-selected"></code-example>

當目前列的英雄與 `selectedHero` 相同時，Angular 會加入 `selected` CSS 類別。
當兩位英雄不同時，Angular 會移除這個類別。

完成後的 `<li>` 看起來像這樣：

<code-example header="heroes.component.html (list item hero)" path="toh-pt2/src/app/heroes/heroes.component.html" region="li"></code-example>

<a id="final-code-review"></a>

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案，包括 `HeroesComponent` 的樣式。

<code-tabs>
    <code-pane header="src/app/mock-heroes.ts" path="toh-pt2/src/app/mock-heroes.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt2/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt2/src/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.css" path="toh-pt2/src/app/heroes/heroes.component.css"></code-pane>
</code-tabs>

## 摘要

*   Tour of Heroes 應用程式會顯示英雄清單與詳細資料檢視
*   使用者可以選取一位英雄並查看該英雄的詳細資料
*   你使用 `*ngFor` 來顯示清單
*   你使用 `*ngIf` 來依條件包含或排除一段 HTML
*   你可以使用 `class` 繫結來切換 CSS 樣式類別。

@reviewed 2022-05-23
