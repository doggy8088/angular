# 顯示選取清單

在本頁中，你將擴充 Tour of Heroes 應用程式來顯示英雄清單，並
讓使用者選取一位英雄、顯示該英雄的詳細資料。


## 建立模擬英雄

你會需要一些英雄來顯示。

最終你會從遠端資料伺服器取得它們。
目前，你先建立一些_模擬英雄_，並假裝它們來自伺服器。

在 `src/app/` 資料夾中建立一個名為 `mock-heroes.ts` 的檔案。
把 `HEROES` 常數定義為包含十位英雄的陣列並將其匯出。
這個檔案應該會像這樣。

<code-example path="toh-pt2/src/app/mock-heroes.ts" header="src/app/mock-heroes.ts"></code-example>

## 顯示英雄

開啟 `HeroesComponent` 類別檔案，匯入模擬的 `HEROES`。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="import-heroes" header="src/app/heroes/heroes.component.ts (import HEROES)">
</code-example>

在同一個檔案中（`HeroesComponent` 類別），定義一個名為 `heroes` 的元件屬性，把 `HEROES` 陣列公開出來以供繫結。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="component">
</code-example>

### 使用 `*ngFor` 列出英雄

開啟 `HeroesComponent` 範本檔案，進行以下修改：

* 在最上方加入一個 `<h2>`，
* 在它下方加入一個 HTML 無序清單（`<ul>`）
* 在 `<ul>` 中插入一個 `<li>`，用來顯示 `hero` 的屬性。
* 撒上一些 CSS 類別來設定樣式（你很快就會加入 CSS 樣式）。

讓它看起來像這樣：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="list" header="heroes.component.html (heroes template)"></code-example>

這樣只會顯示一位英雄。若要列出全部，請在 `<li>` 上加入 `*ngFor` 來逐一走訪英雄清單：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="li">
</code-example>

[`*ngFor`](guide/template-syntax#ngFor) 是 Angular 的_重複器_指令。
它會為清單中的每個元素重複宿主元素。

本範例中的語法如下：

* `<li>` 是宿主元素。
* `heroes` 保存來自 `HeroesComponent` 類別的模擬英雄清單，也就是模擬英雄清單。
* `hero` 保存每次走訪清單時的目前英雄物件。

<div class="alert is-important">

別忘了在 `ngFor` 前面加上星號（*）。這是語法中關鍵的一部分。

</div>

瀏覽器重新整理後，就會出現英雄清單。

{@a styles}

### 設定英雄樣式

英雄清單應該要美觀，而且當使用者
將滑鼠移到清單中的英雄上方或選取英雄時，應該要有視覺上的回應。

在[第一篇教學](tutorial/toh-pt0#app-wide-styles)中，你在 `styles.css` 中為整個應用程式設定了基本樣式。
那份樣式表並未包含這個英雄清單的樣式。

你可以繼續在 `styles.css` 中加入更多樣式，隨著加入元件而讓那份樣式表不斷擴大。

你也可以改為針對特定元件定義專用樣式，並把元件所需的一切&mdash;程式碼、HTML
與 CSS&mdash;都放在同一個地方。

這種做法讓元件更容易在其他地方重複使用，
即使全域樣式不同，也能呈現元件預期的外觀。

你可以把專用樣式以行內方式定義在 `@Component.styles` 陣列中，
或是定義在 `@Component.styleUrls` 陣列所指出的樣式表檔案中。

當 CLI 產生 `HeroesComponent` 時，它為 `HeroesComponent` 建立了一個空的 `heroes.component.css` 樣式表，
並在 `@Component.styleUrls` 中指向它，如下所示。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="metadata"
 header="src/app/heroes/heroes.component.ts (@Component)">
</code-example>

開啟 `heroes.component.css` 檔案，貼入 `HeroesComponent` 的專用 CSS 樣式。
你可以在本指南底部的[最終程式碼檢閱](#final-code-review)中找到它們。

<div class="alert is-important">

在 `@Component` 中繼資料中指出的樣式與樣式表，其作用範圍僅限於該特定元件。
`heroes.component.css` 的樣式只會套用到 `HeroesComponent`，不會影響外部的 HTML 或任何其他元件中的 HTML。

</div>

## 主版/詳細資料

當使用者點選**主版**清單中的英雄時，元件應該在頁面底部顯示所選英雄的**詳細資料**。

在本節中，你將監聽英雄項目的點選事件，
並更新英雄的詳細資料。

### 加入點選事件繫結

像這樣在 `<li>` 上加入點選事件繫結：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="selectedHero-click" header="heroes.component.html (template excerpt)"></code-example>

這是 Angular [事件繫結](guide/template-syntax#event-binding)語法的一個範例。

`click` 周圍的括號告訴 Angular，要監聽 `<li>` 元素的 `click` 事件。
當使用者在 `<li>` 中點選時，Angular 就會執行 `onSelect(hero)` 運算式。


在下一節中，於 `HeroesComponent` 中定義一個 `onSelect()` 方法，
來顯示在 `*ngFor` 運算式中定義的英雄。


### 加入點選事件處理常式

把元件的 `hero` 屬性重新命名為 `selectedHero`，但不要給它指派任何值。
應用程式啟動時還沒有任何_已選取的英雄_。

加入以下的 `onSelect()` 方法，它會把範本中被點選的英雄
指派給元件的 `selectedHero`。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="on-select" header="src/app/heroes/heroes.component.ts (onSelect)"></code-example>

### 加入詳細資料區段

目前，元件範本中有一個清單。若要點選清單上的英雄
並揭露該英雄的詳細資料，你需要在範本中有一個供詳細資料渲染的
區段。在 `heroes.component.html` 的清單區段下方加入以下內容：

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="selectedHero-details" header="heroes.component.html (selected hero details)"></code-example>

瀏覽器重新整理後，應用程式就壞掉了。

開啟瀏覽器的開發人員工具，在主控台中尋找類似以下的錯誤訊息：

<code-example language="sh" class="code-shell">
  HeroesComponent.html:3 ERROR TypeError: Cannot read property 'name' of undefined
</code-example>

#### 發生了什麼事？

應用程式啟動時，`selectedHero` _依設計_就是 `undefined`。

範本中參照 `selectedHero` 屬性的繫結運算式&mdash;例如 `{{selectedHero.name}}` 這類運算式&mdash;_必然會失敗_，因為還沒有選取任何英雄。


#### 修復方式&mdash;用 _*ngIf_ 隱藏空白的詳細資料


元件只應該在 `selectedHero` 存在時，才顯示所選英雄的詳細資料。

把英雄詳細資料的 HTML 包在 `<div>` 中。
在 `<div>` 上加入 Angular 的 `*ngIf` 指令，並將其設為 `selectedHero`。


<div class="alert is-important">

別忘了在 `ngIf` 前面加上星號（*）。這是語法中關鍵的一部分。

</div>

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="ng-if" header="src/app/heroes/heroes.component.html (*ngIf)"></code-example>

瀏覽器重新整理後，名稱清單會再次出現。
詳細資料區域是空白的。
點選英雄清單中的一位英雄，其詳細資料就會出現。
應用程式似乎又能運作了。
英雄會以清單形式出現，被點選英雄的詳細資料則會出現在頁面底部。


#### 為什麼這樣有效

當 `selectedHero` 是 undefined 時，`ngIf` 會把英雄詳細資料從 DOM 中移除。這樣就沒有需要考量的 `selectedHero` 繫結。

當使用者選取一位英雄時，`selectedHero` 就有了值，
`ngIf` 便會把英雄詳細資料放入 DOM 中。

### 設定已選取英雄的樣式

當所有 `<li>` 元素看起來都一樣時，很難在清單中辨識出_已選取的英雄_。

如果使用者點選「Magneta」，該英雄應以獨特但低調的背景色呈現，如下所示：

<div class="lightbox">
  <img src='generated/images/guide/toh/heroes-list-selected.png' alt="已選取的英雄">
</div>

_已選取的英雄_之所以有這樣的配色，是[先前加入的樣式](#styles)中 `.selected` CSS 類別的效果。
你只要在使用者點選 `<li>` 時，把 `.selected` 類別套用到該 `<li>` 即可。

Angular 的[類別繫結](guide/template-syntax#類別繫結)讓你能輕鬆地依條件加入或移除 CSS 類別。
只要在你想設定樣式的元素上加入 `[class.some-css-class]="some-condition"` 即可。

在 `HeroesComponent` 範本的 `<li>` 上加入以下的 `[class.selected]` 繫結：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="class-selected" header="heroes.component.html (toggle the 'selected' CSS class)"></code-example>

當目前列的英雄與 `selectedHero` 相同時，Angular 會加入 `selected` CSS 類別。當兩位英雄不同時，Angular 會移除這個類別。

完成後的 `<li>` 看起來像這樣：

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="li" header="heroes.component.html (list item hero)"></code-example>

{@a final-code-review}

## 最終程式碼檢閱

你的應用程式應該像這樣 <live-example></live-example>。

以下是本頁討論過的程式碼檔案，包括 `HeroesComponent` 的樣式。

<code-tabs>

  <code-pane header="src/app/mock-heroes.ts" path="toh-pt2/src/app/mock-heroes.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt2/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt2/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.css" path="toh-pt2/src/app/heroes/heroes.component.css">
  </code-pane>

</code-tabs>

## 摘要

* Tour of Heroes 應用程式以主版/詳細資料檢視顯示英雄清單。
* 使用者可以選取一位英雄並查看該英雄的詳細資料。
* 你使用 `*ngFor` 來顯示清單。
* 你使用 `*ngIf` 來依條件包含或排除一段 HTML。
* 你可以使用 `class` 繫結來切換 CSS 樣式類別。
