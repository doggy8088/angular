# 在檢視中顯示資料

Angular 的[元件](guide/glossary#component)構成你應用程式的資料結構。
與元件相關聯的 HTML [範本](guide/glossary#template)，提供了在網頁脈絡中顯示該資料的方法。
元件的類別與範本結合在一起，形成應用程式資料的一個[檢視](guide/glossary#view)。

將資料值與其在頁面上的呈現結合起來的過程，稱為[資料繫結](guide/glossary#data-binding)。
你透過把 HTML 範本中的控制項*繫結*到元件類別的資料屬性，把資料顯示給使用者（並從使用者收集資料）。

此外，你可以透過加入[指令](guide/glossary#directive)為範本加入邏輯，指令會告訴 Angular 在頁面渲染時如何修改頁面。

Angular 定義了一種*範本語言*，它擴充了 HTML 記法，加入了讓你能定義各種資料繫結與邏輯指令的語法。
當頁面被渲染時，Angular 會解讀範本語法，依你的邏輯與目前的資料狀態更新 HTML。
在你閱讀完整的[範本語法指南](guide/template-syntax)之前，本頁的練習先快速示範範本語法如何運作。

在這個示範中，你將建立一個帶有英雄清單的元件。
你將顯示英雄名稱清單，並在清單下方有條件地顯示一則訊息。
最終的 UI 看起來像這樣：

<div class="lightbox">
  <img src="generated/images/guide/displaying-data/final.png" alt="最終 UI">
</div>

<div class="alert is-helpful">

<live-example></live-example>示範了本頁所述的全部語法與程式碼片段。

</div>

{@a interpolation}

## 使用插值顯示元件屬性
顯示元件屬性最簡單的方法，是透過插值來繫結屬性名稱。
使用插值時，你把屬性名稱放在檢視範本中，以雙大括號包住：`{{myHero}}`。

使用 CLI 命令 [`ng new displaying-data`](cli/new) 建立一個名為 `displaying-data` 的工作區與應用程式。

刪除 <code>app.component.html</code> 檔案。這個範例不需要它。

接著修改 <code>app.component.ts</code> 檔案，
變更範本與元件的主體。

完成後，它應該看起來像這樣：

<code-example path="displaying-data/src/app/app.component.1.ts" header="src/app/app.component.ts"></code-example>

你為先前空白的元件加入了兩個屬性：`title` 與 `myHero`。

範本使用雙大括號插值來顯示這兩個元件屬性：

<code-example path="displaying-data/src/app/app.component.1.ts" header="src/app/app.component.ts (template)" region="template"></code-example>

<div class="alert is-helpful">

該範本是 ECMAScript 2015 反引號（<code>\`</code>）內的多行字串。
反引號（<code>\`</code>）&mdash;它*不是*單引號
（`'`）這個字元&mdash;讓你能跨多行組出一個字串，使 HTML 更易讀。

</div>

Angular 會自動從元件取得 `title` 與 `myHero` 屬性的值，
並把這些值插入瀏覽器。當這些屬性變更時，Angular 會更新顯示。

<div class="alert is-helpful">

更精確地說，重新顯示發生在某種與檢視相關的非同步事件之後，例如按鍵、計時器完成，或 HTTP 請求的回應。

</div>

請注意，你並不需要呼叫 **new** 來建立 `AppComponent` 類別的實例。
Angular 正在為你建立一個實例。怎麼做到的？

`@Component` 裝飾器中的 CSS `selector` 指定了一個名為 `<app-root>` 的元素。
該元素是你 `index.html` 檔案主體中的一個佔位符：

<code-example path="displaying-data/src/index.html" header="src/index.html (body)" region="body"></code-example>

當你以 `AppComponent` 類別啟動（在 <code>main.ts</code> 中）時，Angular 會在 `index.html` 中尋找 `<app-root>`，找到它、實例化 `AppComponent` 的一個實例，並把它渲染到 `<app-root>` 標籤內。

現在執行應用程式。它應該顯示標題與英雄名稱：

<div class="lightbox">
  <img src="generated/images/guide/displaying-data/title-and-hero.png" alt="標題與英雄">
</div>

接下來的幾節回顧這個應用程式中的一些程式碼選擇。


## 選擇範本來源

`@Component` 中繼資料告訴 Angular 去哪裡找元件的範本。
你可以把元件的範本存放在兩個地方之一。

* 你可以使用 `@Component` 裝飾器的 `template` 屬性，*行內*定義範本。行內範本適用於小型示範或測試。
* 或者，你可以在一個獨立的 HTML 檔案中定義範本，並在 `@Component` 裝飾器的 `templateUrl` 屬性中連結到該檔案。這種設定是任何比小型測試或示範更複雜的東西的典型作法，也是你產生新元件時的預設方式。

無論哪種風格，範本資料繫結對元件屬性都有相同的存取權。
這裡的應用程式使用行內 HTML，因為範本很小，而且不需要額外的 HTML 檔案，示範更簡單。

<div class="alert is-helpful">

  預設情況下，Angular CLI 命令 [`ng generate component`](cli/generate) 會產生帶有範本檔案的元件。
  你可以加入 "-t" 選項（`inlineTemplate=true` 的簡寫）來覆寫這一點：

  <code-example hideCopy language="sh" class="code-shell">
    ng generate component hero -t
  </code-example>

</div>


## 初始化

以下範例使用變數賦值來初始化元件。

<code-example path="displaying-data/src/app/app-ctor.component.1.ts" region="class"></code-example>

 你也可以改用建構函式來宣告並初始化這些屬性。
 這個應用程式單純為了簡潔，使用較精簡的「變數賦值」風格。


{@a ngFor}

## 加入邏輯來迴圈遍歷資料

`*ngFor` 指令（由 Angular 預先定義）讓你能迴圈遍歷資料。以下範例使用該指令顯示陣列屬性中的全部值。

若要顯示英雄清單，先為元件加入一組英雄名稱陣列，並把 `myHero` 重新定義為陣列中的第一個名稱。


<code-example path="displaying-data/src/app/app.component.2.ts" header="src/app/app.component.ts (class)" region="class"></code-example>


現在在範本中使用 Angular 的 `ngFor` 指令，顯示 `heroes` 清單中的每個項目。


<code-example path="displaying-data/src/app/app.component.2.ts" header="src/app/app.component.ts (template)" region="template"></code-example>


這個 UI 使用帶有 `<ul>` 與 `<li>` 標籤的 HTML 無序清單。`<li>` 元素中的 `*ngFor`
是 Angular 的「重複器（repeater）」指令。
它把那個 `<li>` 元素（及其子元素）標記為「重複器範本」：


<code-example path="displaying-data/src/app/app.component.2.ts" header="src/app/app.component.ts (li)" region="li"></code-example>

<div class="alert is-important">

別忘了 `*ngFor` 開頭的星號（\*）。它是語法中不可或缺的一部分。
更多關於 `ngFor` 與 `*` 的資訊，請參閱[範本語法](guide/template-syntax)頁面中的 [ngFor 一節](guide/template-syntax#ngfor)。

</div>

請注意 `ngFor` 雙引號指令中的 `hero`；
它是範本輸入變數的一個例子。更多關於範本輸入變數的資訊，請參閱
[範本語法](guide/template-syntax)頁面中的[微語法](guide/template-syntax#microsyntax)一節。

Angular 會為清單中的每個項目複製一份 `<li>`，並把 `hero` 變數
設定為目前迭代中的項目（英雄）。Angular 使用該變數作為
雙大括號中插值的脈絡。

<div class="alert is-helpful">

在這個例子中，`ngFor` 顯示的是一個陣列，但 `ngFor` 可以
為任何 [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) 物件重複項目。

</div>

現在英雄以無序清單的形式出現。

<div class="lightbox">
  <img src="generated/images/guide/displaying-data/hero-names-list.png" alt="ngFor 之後">
</div>


## 為資料建立類別

這個應用程式的程式碼直接在元件內定義資料，這並非最佳實務。
不過在簡單的示範中，這樣做沒問題。

目前，這個繫結指向一個字串陣列。
在真實的應用程式中，大多數繫結都指向更專門的物件。

若要把這個繫結改成使用專門的物件，把英雄名稱陣列
轉換為 `Hero` 物件陣列。為此你需要一個 `Hero` 類別：

<code-example language="sh" class="code-shell">
  ng generate class hero
</code-example>

這個命令會建立以下程式碼。


<code-example path="displaying-data/src/app/hero.ts" header="src/app/hero.ts"></code-example>

你定義了一個帶有建構函式與兩個屬性的類別：`id` 與 `name`。

它看起來可能不像有屬性，但它確實有。
建構函式參數的宣告利用了 TypeScript 的一個捷徑。

以第一個參數為例：


<code-example path="displaying-data/src/app/hero.ts" header="src/app/hero.ts (id)" region="id"></code-example>

那短短的語法做了很多事：

* 宣告一個建構函式參數及其型別。
* 宣告一個同名的公開屬性。
* 在建立該類別的實例時，以對應的引數初始化該屬性。


### 使用 Hero 類別

在匯入 `Hero` 類別之後，`AppComponent.heroes` 屬性可以回傳一個有_型別_的
`Hero` 物件陣列：


<code-example path="displaying-data/src/app/app.component.3.ts" header="src/app/app.component.ts (heroes)" region="heroes"></code-example>



接著，更新範本。
它目前顯示英雄的 `id` 與 `name`。
把它修正為只顯示英雄的 `name` 屬性。


<code-example path="displaying-data/src/app/app.component.3.ts" header="src/app/app.component.ts (template)" region="template"></code-example>


顯示出來的樣子相同，但程式碼更清楚。

{@a ngIf}

## 使用 NgIf 條件式顯示

有時候，應用程式需要在特定情況下，才顯示某個檢視或檢視的一部分。

讓我們修改這個範例：當英雄超過三個時，顯示一則訊息。

Angular 的 `ngIf` 指令會根據一個 _truthy/falsy_ 條件，插入或移除一個元素。
若要看到它的效果，在範本底部加入以下段落：


<code-example path="displaying-data/src/app/app.component.ts" header="src/app/app.component.ts (message)" region="message"></code-example>


<div class="alert is-important">

別忘了 `*ngIf` 開頭的星號（\*）。它是語法中不可或缺的一部分。
更多關於 `ngIf` 與 `*` 的資訊，請參閱[範本語法](guide/template-syntax)頁面中的 [ngIf 一節](guide/template-syntax#ngIf)。

</div>


雙引號內的範本運算式
`*ngIf="heroes.length > 3"`，外觀與行為都與 TypeScript 非常相似。
當元件的英雄清單有超過三個項目時，Angular 會把該段落
加入 DOM，訊息隨即出現。
如果項目只有三個或更少，Angular 會省略該段落，因此訊息不會出現。

更多資訊，請參閱[範本運算式](guide/template-syntax#範本運算式)。


<div class="alert is-helpful">

Angular 不是在顯示與隱藏訊息。它是把段落元素加入 DOM 或從 DOM 移除。這改善了效能，尤其在較大的專案中，當依條件包含或排除
帶有許多資料繫結的大塊 HTML 時。

</div>

試試看。因為陣列有四個項目，訊息應該會出現。
回到 <code>app.component.ts</code>，從 heroes 陣列中刪除或註解掉其中一個元素。
瀏覽器應該會自動重新整理，訊息應該會消失。


## 摘要
現在你知道如何使用：

* 使用雙大括號**插值**來顯示元件屬性。
* 使用 **ngFor** 顯示項目陣列。
* 使用 TypeScript 類別塑造元件的模型資料，並顯示該模型的屬性。
* 使用 **ngIf** 依布林運算式有條件地顯示一塊 HTML。

以下是最終的程式碼：

<code-tabs>

  <code-pane header="src/app/app.component.ts" path="displaying-data/src/app/app.component.ts" region="final">

  </code-pane>

  <code-pane header="src/app/hero.ts" path="displaying-data/src/app/hero.ts">

  </code-pane>

  <code-pane header="src/app/app.module.ts" path="displaying-data/src/app/app.module.ts">

  </code-pane>

  <code-pane header="main.ts" path="displaying-data/src/main.ts">

  </code-pane>

</code-tabs>
