@title
主版/詳細資料

@intro
建立一個帶有英雄清單的主版/詳細資料頁面。

@description


在本頁中，你將擴充 Tour of Heroes 應用程式來顯示英雄清單，並
讓使用者選取一位英雄、顯示該英雄的詳細資料。

完成本頁後，應用程式應該像這樣 <live-example></live-example>。



## 上次停下的地方
在繼續本頁的 Tour of Heroes 之前，
請確認在[英雄編輯器](tutorial/toh-pt1)頁面之後，你已具備以下結構。
如果你的結構不一致，請回到該頁面，找出你遺漏了什麼。


<div class='filetree'>

  <div class='file'>
    angular-tour-of-heroes
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          app.component.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        systemjs.config.js
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>



## 讓應用程式持續轉譯並執行
在終端機視窗中輸入以下命令：


<code-example language="sh" class="code-shell">
  npm start

</code-example>



這個命令會以「watch mode」執行 TypeScript 編譯器，在程式碼變更時自動重新編譯。
該命令同時會在瀏覽器中啟動應用程式，並在程式碼變更時重新整理瀏覽器。

你可以在建置 Tour of Heroes 的同時，不必暫停來重新編譯或重新整理瀏覽器。



## 顯示英雄
若要顯示英雄清單，你將把英雄加入檢視的範本中。

### 建立英雄
建立一個包含十位英雄的陣列。


<code-example path="toh-pt2/src/app/app.component.ts" region="hero-array" title="src/app/app.component.ts (hero array)">

</code-example>



`HEROES` 陣列的型別是 `Hero`，也就是前一頁定義的類別。
最終這個應用程式會從 Web 服務取得英雄清單，但目前
你可以先顯示模擬英雄。

### 公開英雄
在 `AppComponent` 中建立一個公開屬性，把英雄公開出來以供繫結。



<code-example path="toh-pt2/src/app/app.component.1.html" region="hero-array-1" title="app.component.ts (hero array property)">

</code-example>



`heroes` 的型別並未定義，因為 TypeScript 會從 `HEROES` 陣列推斷它。


<div class="l-sub-section">



英雄資料之所以與類別實作分開，
是因為最終英雄名稱會來自資料服務。


</div>



### 在範本中顯示英雄名稱
若要在無序清單中顯示英雄名稱，
請在標題下方、英雄詳細資料上方插入以下這段 HTML。



<code-example path="toh-pt2/src/app/app.component.1.html" region="heroes-template-1" title="app.component.ts (heroes template)" linenums="false">

</code-example>



現在你可以用英雄名稱填入範本了。

### 使用 ngFor 列出英雄

目標是把元件中的英雄陣列繫結到範本、逐一走訪它們，
並個別顯示它們。

修改 `<li>` 標籤，加入內建指令 `*ngFor`。


<code-example path="toh-pt2/src/app/app.component.1.html" region="heroes-ngfor-1" title="app.component.ts (ngFor)">

</code-example>



<div class="l-sub-section">



`ngFor` 前面的（`*`）前綴是這個語法的關鍵部分。
它表示 `<li>` 元素及其子元素
構成一個主範本。

`ngFor` 指令會走訪元件的 `heroes` 陣列，
並為陣列中的每位英雄呈現這個範本的一個實例。

運算式中的 `let hero` 部分將 `hero` 識別為範本輸入變數，
它保存每次走訪時的目前英雄項目。
你可以在範本中參照這個變數，來存取目前英雄的屬性。

想了解更多 `ngFor` 與範本輸入變數的資訊，請參閱
[使用 *ngFor 顯示陣列屬性](guide/displaying-data#ngFor)一節（位於[顯示資料](guide/displaying-data)頁面），以及
[ngFor](guide/template-syntax#ngFor)一節（位於
[範本語法](guide/template-syntax)頁面）。


</div>



在 `<li>` 標籤內，加入使用
`hero` 範本變數來顯示英雄屬性的內容。



<code-example path="toh-pt2/src/app/app.component.1.html" region="ng-for" title="app.component.ts (ngFor template)" linenums="false">

</code-example>



當瀏覽器重新整理時，就會出現英雄清單。

### 設定英雄樣式
使用者應該能從視覺提示得知，他們正將滑鼠移到哪位英雄上方、以及哪位英雄被選取。

若要為元件加入樣式，請把 `@Component` 裝飾器上的 `styles` 屬性
設定為以下 CSS 類別：


<code-example path="toh-pt2/src/app/app.component.ts" region="styles" title="src/app/app.component.ts (styles)" linenums="false">

</code-example>



請記得對多行字串使用反引號記法。

加入這些樣式會讓檔案變得長得多。在後續的頁面中，你會把樣式移到獨立的檔案。

當你把樣式指派給元件時，它們的作用範圍僅限於該特定元件。
這些樣式只會套用到 `AppComponent`，不會影響外部的 HTML。

顯示英雄的範本應該像這樣：



<code-example path="toh-pt2/src/app/app.component.1.html" region="heroes-styled" title="src/app/app.component.ts (styled heroes)" linenums="false">

</code-example>




## 選取英雄
應用程式現在會顯示英雄清單，以及在詳細資料檢視中顯示單一英雄。但是
清單與詳細資料檢視並未相連。
當使用者從清單中選取一位英雄時，所選英雄應該出現在詳細資料檢視中。
這種 UI 模式稱為「主版/詳細資料」。
在這個例子中，_主版_是英雄清單，_詳細資料_是所選英雄。

接著，你將透過 `selectedHero` 元件屬性把主版與詳細資料連接起來，
該屬性會繫結到點選事件。

### 處理點選事件
像這樣在 `<li>` 上加入點選事件繫結：



<code-example path="toh-pt2/src/app/app.component.1.html" region="selectedHero-click" title="app.component.ts (template excerpt)" linenums="false">

</code-example>



括號將 `<li>` 元素的 `click` 事件識別為目標。
`onSelect(hero)` 運算式會呼叫 `AppComponent` 方法 `onSelect()`，
並把範本輸入變數 `hero` 作為引數傳入。
那就是你先前在 `ngFor` 指令中定義的同一個 `hero` 變數。

<div class="l-sub-section">



想了解更多事件繫結，請參閱
[使用者輸入](guide/user-input)頁面，以及
[事件繫結](guide/template-syntax#event-binding)一節（位於
[範本語法](guide/template-syntax)頁面）。


</div>



### 加入點選處理常式以公開所選英雄
你不再需要 `hero` 屬性，因為你不再顯示單一英雄；你顯示的是英雄清單。
但是使用者將能透過點選來選取其中一位英雄。
所以請用這個簡單的 `selectedHero` 屬性取代 `hero` 屬性：


<code-example path="toh-pt2/src/app/app.component.ts" region="selected-hero" title="src/app/app.component.ts (selectedHero)">

</code-example>



在使用者選取英雄之前，所有英雄名稱都應該是未選取狀態，所以
你不會像對 `hero` 那樣初始化 `selectedHero`。

加入一個 `onSelect()` 方法，把 `selectedHero` 屬性設定為使用者點選的 `hero`。

<code-example path="toh-pt2/src/app/app.component.ts" region="on-select" title="src/app/app.component.ts (onSelect)" linenums="false">

</code-example>



範本仍然參照舊的 `hero` 屬性。
請改為繫結到新的 `selectedHero` 屬性，如下所示：



<code-example path="toh-pt2/src/app/app.component.1.html" region="selectedHero-details" title="app.component.ts (template excerpt)" linenums="false">

</code-example>



### 用 ngIf 隱藏空白的詳細資料

應用程式載入時，`selectedHero` 是 undefined。
所選英雄會在使用者點選英雄名稱時初始化。
Angular 無法顯示 undefined 的 `selectedHero` 的屬性，並會擲出以下錯誤，
可在瀏覽器的主控台中看到：


<code-example format="nocode">
  EXCEPTION: TypeError: Cannot read property 'name' of undefined in [null]

</code-example>



雖然範本中顯示了 `selectedHero.name`，
你必須在有選取的英雄之前，把英雄詳細資料留在 DOM 之外。

把範本的 HTML 英雄詳細資料內容包在 `<div>` 中。
接著加入 `ngIf` 內建指令，並將其設定為元件的 `selectedHero` 屬性。


<code-example path="toh-pt2/src/app/app.component.1.html" region="ng-if" title="src/app/app.component.ts (ngIf)" linenums="false">

</code-example>



<div class="alert is-critical">



別忘了 `ngIf` 前面的星號（`*`）。


</div>



應用程式不再失敗，名稱清單會再次顯示在瀏覽器中。


當沒有選取的英雄時，`ngIf` 指令會把英雄詳細資料 HTML 從 DOM 中移除。
這樣就沒有英雄詳細資料元素或繫結需要擔心。

當使用者選取一位英雄時，`selectedHero` 就會變為已定義，
`ngIf` 便會把英雄詳細資料內容放入 DOM 中，並評估巢狀的繫結。


<div class="l-sub-section">



想了解更多 `ngIf` 與 `ngFor`，請參閱
[結構指令](guide/structural-directives)頁面，以及
[內建指令](guide/template-syntax#directives)一節（位於
[範本語法](guide/template-syntax)頁面）。



</div>



### 設定已選取英雄的樣式

雖然所選英雄的詳細資料會出現在清單下方，但在清單本身之中很難辨識所選英雄。

在你先前加入的 `styles` 中繼資料中，有一個名為 `selected` 的自訂 CSS 類別。
為了讓所選英雄更醒目，你將在使用者點選英雄名稱時，把這個 `selected` 類別套用到 `<li>`。
例如，當使用者點選「Magneta」時，它應該以獨特但低調的背景色呈現
像這樣：


<figure>
  <img src='generated/images/guide/toh/heroes-list-selected.png' alt="已選取的英雄">
</figure>



在範本中，在 `<li>` 上加入以下 `[class.selected]` 繫結：

<code-example path="toh-pt2/src/app/app.component.1.html" region="class-selected-1" title="app.component.ts (setting the CSS class)" linenums="false">

</code-example>



當運算式（`hero === selectedHero`）為 `true` 時，Angular 會加入 `selected` CSS 類別。
當運算式為 `false` 時，Angular 會移除 `selected` 類別。



<div class="l-sub-section">



想了解更多 `[class]` 繫結，請參閱 [範本語法](guide/template-syntax#ngClass "Template syntax: NgClass") 指南。


</div>



`<li>` 的最終版本像這樣：

<code-example path="toh-pt2/src/app/app.component.1.html" region="class-selected-2" title="app.component.ts (styling each hero)" linenums="false">

</code-example>



點選「Magneta」之後，清單應該像這樣：


<figure>
  <img src='generated/images/guide/toh/heroes-list-1.png' alt="英雄清單應用程式的輸出">
</figure>



以下是目前為止完整的 `app.component.ts`：


<code-example path="toh-pt2/src/app/app.component.ts" title="src/app/app.component.ts">

</code-example>




## 摘要

以下是你在本頁中達成的成果：

* Tour of Heroes 應用程式顯示一份可選取的英雄清單。
* 你加入了選取英雄並顯示英雄詳細資料的功能。
* 你學會了如何在元件的範本中使用內建指令 `ngIf` 與 `ngFor`。

你的應用程式應該像這樣 <live-example></live-example>。

## 下一步
你已經擴充了 Tour of Heroes 應用程式，但它還遠未完成。
應用程式不應該是一個單一龐大的元件。
在[下一頁](tutorial/toh-pt3 "Multiple Components")中，你將把應用程式拆成子元件，並讓它們一起運作。
