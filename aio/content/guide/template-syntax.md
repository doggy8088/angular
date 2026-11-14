# 範本語法

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }
  h4 .syntax { font-size: 100%; }
</style>

Angular 應用程式管理使用者看到的內容與能執行的操作，透過元件類別實例（即 *元件*）與其面向使用者的範本之間的互動來達成。

你可能已從 model-view-controller（MVC）或 model-view-viewmodel（MVVM）的經驗中，熟悉元件／範本的二元性。
在 Angular 中，元件扮演控制器／檢視模型的角色，範本則代表檢視。

本頁是 Angular 範本語言的完整技術參考。
它說明範本語言的基本原則，並描述你在文件其他地方會遇到的大部分語法。

許多程式碼片段說明了這些要點與概念，全部都可以在
<live-example title="Template Syntax Live Code"></live-example> 中取得。

{@a html}
## 範本中的 HTML

HTML 是 Angular 範本的語言。
幾乎所有 HTML 語法都是有效的範本語法。
`<script>` 元素是一個值得注意的例外；
它被禁止使用，以消除指令碼注入攻擊的風險。
實務上，`<script>` 會被忽略，瀏覽器主控台會出現警告。
詳情請參閱 [Security](guide/security) 頁面。

有些合法的 HTML 在範本中不太有意義。
`<html>`、`<body>` 與 `<base>` 元素沒有實際用途。
幾乎所有其他元素都可以使用。

你可以使用以新元素與屬性形式出現的元件和指令，擴充範本的 HTML 詞彙。
在接下來的章節中，你將學習如何透過資料繫結，動態取得並設定 DOM（Document Object Model）值。

從第一種資料繫結形式&mdash;插值&mdash;開始，看看範本 HTML 能變得多豐富。

<hr/>

{@a interpolation}

## 插值與範本運算式

插值讓你可以將計算得到的字串納入 HTML 元素標籤之間的文字，以及屬性指派之中。範本運算式就是你用來計算這些字串的工具。

插值 <live-example></live-example> 示範了本節所述的全部
語法與程式碼片段。

### 插值 `{{...}}`

插值是指將運算式嵌入標記文字中。
依預設，插值以雙大括號 `{{` 與 `}}` 作為其分隔符號。

在以下範例中，`{{ currentCustomer }}` 就是插值的一個範例。

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1" header="src/app/app.component.html" linenums="false">
</code-example>

大括號之間的文字通常是元件屬性的名稱。Angular 會以對應元件屬性的字串值取代該名稱。

<code-example path="interpolation/src/app/app.component.html" region="component-property" header="src/app/app.component.html" linenums="false">
</code-example>

在上例中，Angular 會評估 `title` 與 `itemImageUrl` 屬性並填入空白，先顯示一些標題文字，接著顯示一張圖片。

更一般來說，大括號之間的文字是一個範本運算式，Angular 會先評估它，再將它轉換為字串。
下列插值以兩個數字相加來說明這一點：

<code-example path="interpolation/src/app/app.component.html" region="convert-string" header="src/app/app.component.html" linenums="false">
</code-example>

運算式可以叫用宿主元件的方法，例如以下範例中的 `getVal()`：

<code-example path="interpolation/src/app/app.component.html" region="invoke-method" header="src/app/app.component.html" linenums="false">
</code-example>

Angular 會評估雙大括號中的所有運算式，將運算式結果轉換為字串，並將它們與相鄰的文字字串連結。最後，它會將這個組合而成的插值結果指派給**元素或指令屬性。**

你看起來像是把結果插入元素標籤之間，並指派給屬性。

<div class="alert is-helpful">

然而，插值是一種特殊語法，Angular 會把它轉換成
屬性繫結。

如果你想使用 `{{` 與 `}}` 以外的符號，可以透過 `Component` 中繼資料中的
[interpolation](api/core/Component#interpolation)
選項，設定插值分隔符號。

</div>

### 範本運算式

範本**運算式**會產生一個值，並出現在雙大括號 `{{ }}` 之內。
Angular 會執行該運算式，並將它指派給繫結目標的一個屬性；
目標可以是 HTML 元素、元件或指令。

`{{1 + 1}}` 的插值大括號包圍著範本運算式 `1 + 1`。
在屬性繫結中，
範本運算式會出現在引號內、位於&nbsp;`=` 符號的右側，如 `[property]="expression"`。

就語法而言，範本運算式與 JavaScript 相似。
許多 JavaScript 運算式都是合法的範本運算式，但有少數例外。

你不能使用具有副作用或會助長副作用的 JavaScript 運算式，
包括：

* 指派（`=`, `+=`, `-=`, `...`）
* `new`、`typeof`、`instanceof` 等運算子
* 以 <code>;</code> 或 <code>,</code> 串連運算式
* 遞增（`++`）與遞減（`--`）運算子
* 部分 ES2015+ 運算子

與 JavaScript 語法其他值得注意的差異包括：

* 不支援 `|` 和 `&` 等位元運算子
* 新的範本運算式運算子，例如 `|`、`?.` 與 `!`
<!-- link to: guide/template-syntax#expression-operators -->

### 運算式脈絡

*運算式上下文*通常就是 _元件_ 實例。
在以下程式碼片段中，雙大括號內的 `recommended` 與引號內的
`itemImageUrl2` 參照的是 `AppComponent` 的屬性。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html" linenums="false">
</code-example>

運算式也可以參照 _範本_ 內容的屬性，
例如範本輸入變數，
<!-- link to built-in-directives#template-input-variables -->
`let customer`，或範本參照變數 `#customerInput`。
<!-- link to guide/template-ref-variables -->

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)" linenums="false">
</code-example>

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)" linenums="false">
</code-example>

運算式中詞彙的上下文，是*範本變數*、
指令的 _context_ 物件（如果有的話）與元件*成員*的混合。
如果你參照的名稱同時屬於其中多個命名空間，
範本變數名稱的優先順序最高，其次是指令 _context_ 中的名稱，
最後才是元件的成員名稱。

前一個範例就呈現了這樣的名稱衝突。元件有一個 `customer`
屬性，而 `*ngFor` 定義了一個 `customer` 範本變數。

<div class="alert is-helpful">

`{{customer.name}}` 中的 `customer`
參照的是範本輸入變數，而不是元件的屬性。

範本運算式不能參照全域命名空間中的任何東西，
`undefined` 除外。它們不能參照
`window` 或 `document`。此外，它們
不能呼叫 `console.log()` 或 `Math.max()`，且只能參照
運算式上下文的成員。

</div>

### 運算式準則

使用範本運算式時，請遵循下列準則：

* [無明顯副作用](guide/template-syntax#無明顯副作用)
* [快速執行](guide/template-syntax#快速執行)
* [簡單](guide/template-syntax#簡單)

### 無明顯副作用

範本運算式不應變更目標屬性值以外的
任何應用程式狀態。

這條規則是 Angular「單向資料流」政策的關鍵。
你永遠不必擔心讀取一個元件值可能會改變其他顯示中的值。
檢視在單次算繪過程中應該保持穩定。

[冪等](https://en.wikipedia.org/wiki/Idempotence)運算式是理想的選擇，因為
它沒有副作用，還能提升 Angular 的變更偵測效能。

以 Angular 的用語來說，冪等運算式永遠回傳
*完全相同的東西*，直到
它的相依值之一改變為止。

相依值在事件迴圈的單次輪轉期間不應改變。
如果冪等運算式回傳字串或數字，連續呼叫兩次會回傳相同的字串或數字。如果運算式回傳物件（包括 `array`），連續呼叫兩次會回傳相同的物件*參照*。

<div class="alert is-helpful">

這項行為有一個例外，適用於 `*ngFor`。`*ngFor` 具有 `trackBy` 功能，可以處理走訪物件時物件的參照不等式。

詳情請參閱本指南的 [*ngFor 搭配 `trackBy`](guide/template-syntax#搭配-trackby-的-ngfor) 一節。

</div>

### 快速執行

Angular 會在每次變更偵測週期後執行範本運算式。
許多非同步活動都會觸發變更偵測週期，例如
promise 的解析、HTTP 結果、計時器事件、按鍵與滑鼠移動。

運算式應該要能快速完成，否則使用者體驗可能會拖慢，在較慢的裝置上尤其如此。
當運算需要較多資源時，可以考慮快取其值。

### 簡單

雖然可以撰寫複雜的範本運算式，但比較好的
做法是避免這麼做。

屬性名稱或方法呼叫應該是常態，但偶爾使用布林否定 `!` 是可以的。
除此之外，請將應用程式與業務邏輯侷限在元件中，
讓它易於開發和測試。

<!-- end of Interpolation doc -->

<hr/>

{@a template-statements}

## 範本陳述式

範本**陳述式**會回應繫結目標所引發的**事件**
例如元素、元件或指令。
你會在[事件繫結](guide/template-syntax#event-binding)一節中看到範本陳述式，
它們出現在 `=`&nbsp;符號右側的引號中，如 `(event)="statement"`。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html" linenums="false">
</code-example>

範本陳述式*具有副作用*。
這正是事件的全部意義。
這是你根據使用者動作更新應用程式狀態的方式。

回應事件是 Angular「單向資料流」的另一面。
在事件迴圈的這一輪中，你可以自由變更任何地方的任何內容。

和範本運算式一樣，範本*陳述式*使用的語言看起來像 JavaScript。
範本陳述式剖析器與範本運算式剖析器不同，
它特別支援基本指派（`=`）以及串連運算式（使用 <code>;</code> 或 <code>,</code>）。

不過，某些 JavaScript 語法是不允許的：

* <code>new</code>
* 遞增與遞減運算子，`++` 與 `--`
* 運算子指派，例如 `+=` 與 `-=`
* 位元運算子 `|` 與 `&`
* [範本運算式運算子](guide/template-syntax#expression-operators)

### 陳述式脈絡

和運算式一樣，陳述式只能參照陳述式脈絡中的內容，
例如元件實例的事件處理方法。

*陳述式脈絡*通常就是元件實例。
`(click)="deleteHero()"` 中的 *deleteHero* 是資料繫結元件的方法。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html" linenums="false">
</code-example>

陳述式上下文也可以參照範本自身上下文的屬性。
在下列範例中，範本 `$event` 物件、
[範本輸入變數](guide/template-syntax#template-input-variable)（`let hero`），
以及[範本參照變數](guide/template-syntax#ref-vars)（`#heroForm`）
會被傳遞給元件的事件處理方法。

<code-example path="template-syntax/src/app/app.component.html" region="context-var-statement" header="src/app/app.component.html" linenums="false">
</code-example>

範本上下文名稱的優先順序高於元件上下文名稱。
在前面的 `deleteHero(hero)` 中，`hero` 是範本輸入變數，而不是元件的 `hero` 屬性。

範本陳述式不能參照全域命名空間中的任何內容。它們
不能參照 `window` 或 `document`。
它們不能呼叫 `console.log` 或 `Math.max`。

### 陳述式準則

和運算式一樣，避免撰寫複雜的範本陳述式。
方法呼叫或簡單的屬性指派應該是常態。

現在你已對範本運算式與陳述式有了感覺，
你已準備好學習插值之外各種資料繫結語法了。

<hr/>

{@a binding-syntax}

## 繫結語法：概覽

資料繫結是一種協調機制，用來協調使用者所看到的內容與應用程式資料值。
雖然你可以自行把值推送到 HTML 或從 HTML 拉取值，
但把這些工作交給繫結框架，應用程式會更容易撰寫、閱讀與維護。
你只需要宣告繫結來源與目標 HTML 元素之間的繫結，其餘的就交給框架處理。

Angular 提供多種資料繫結。
本指南在概覽 Angular 資料繫結及其語法之後，將涵蓋其中大部分內容。

繫結類型依資料流動的方向，可分為三個類別：
從 _source-to-view_、從 _view-to-source_，以及雙向的序列：_view-to-source-to-view_：

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="30%">
  </col>
  <col width="50%">
  </col>
  <col width="20%">
  </col>
  <tr>
    <th>
      資料方向
    </th>
    <th>
      語法
    </th>
    <th>
      類型
    </th>

  </tr>
  <tr>
    <td>
      單向<br>從資料來源<br>到檢視目標
    </td>
    <td>

      <code-example>
        {{expression}}
        [target]="expression"
        bind-target="expression"
      </code-example>

    </td>
    <td>
      插值<br>
      屬性<br>
      Attribute<br>
      類別<br>
      樣式
    </td>
    <tr>
      <td>
        單向<br>從檢視目標<br>到資料來源
      </td>
      <td>
        <code-example>
          (target)="statement"
          on-target="statement"
        </code-example>
      </td>
      <td>
        事件
      </td>
    </tr>
    <tr>
      <td>
        雙向
      </td>
      <td>
        <code-example>
          [(target)]="expression"
          bindon-target="expression"
        </code-example>
      </td>
      <td>
        雙向
      </td>
    </tr>
  </tr>
</table>

插值以外的繫結類型，在等號左邊都有一個**目標名稱。**
它可以用標點符號（`[]`、`()`）包圍，或在前面加上前綴（`bind-`、`on-`、`bindon-`）。

目標名稱是 _屬性_ 的名稱。它可能看起來像 _attribute_ 的名稱，但絕不是。
若要體會其中的差異，你必須培養一種思考範本 HTML 的新方式。

### 新的心智模型

有了資料繫結的全部能力，以及用自訂標記擴充 HTML 詞彙的能力，
很容易讓人把範本 HTML 想成 *HTML Plus*。

它確實*是* HTML Plus。
但它也與你所習慣的 HTML 有顯著不同。
它需要一種新的心智模型。

在一般的 HTML 開發過程中，你會用 HTML 元素建立視覺結構，
並以字串常數設定元素 attribute 的方式來修改這些元素。

<code-example path="template-syntax/src/app/app.component.html" region="img+button" header="src/app/app.component.html" linenums="false">
</code-example>

在 Angular 範本中，你仍然以這種方式建立結構並初始化 attribute 值。

接著你學會用封裝 HTML 的元件建立新元素，
並把它們像原生 HTML 元素一樣放入範本中。

<code-example path="template-syntax/src/app/app.component.html" region="hero-detail-1" header="src/app/app.component.html" linenums="false">
</code-example>

這就是 HTML Plus。

接著你學會資料繫結。你遇到的第一個繫結可能長這樣：

<code-example path="template-syntax/src/app/app.component.html" region="disabled-button-1" header="src/app/app.component.html" linenums="false">
</code-example>

你馬上就會看到那個奇特的括號記法。先撇開它不談，
你的直覺會認為你正在繫結到按鈕的 `disabled` attribute，並把它設為
元件 `isUnchanged` 屬性的目前值。

你的直覺是錯的！你日常的 HTML 心智模型具有誤導性。
事實上，一旦你開始資料繫結，你就不再是與 HTML *attribute* 打交道了。你設定的不是 attribute。
你設定的是 DOM 元素、元件與指令的*屬性*。

<div class="alert is-helpful">

### HTML attribute 與 DOM 屬性

區分 HTML attribute 與 DOM 屬性，是理解 Angular 繫結如何運作的關鍵。

**Attribute 是由 HTML 定義的。屬性是由 DOM（Document Object Model）定義的。**

* 少數 HTML attribute 與屬性有 1:1 的對應關係。`id` 就是一個例子。

* 有些 HTML attribute 沒有對應的屬性。`colspan` 就是一個例子。

* 有些 DOM 屬性沒有對應的 attribute。`textContent` 就是一個例子。

* 許多 HTML attribute 看似對應到屬性……但並不是你所想的那種方式！

最後這一類在你掌握這條一般規則之前會令人困惑：

**Attribute 會*初始化* DOM 屬性，之後就功成身退。
屬性值可以改變；attribute 值不能。**

例如，當瀏覽器渲染 `<input type="text" value="Bob">` 時，它會建立一個
對應的 DOM 節點，其 `value` 屬性*初始化*為 "Bob"。

當使用者在輸入框中輸入 "Sally" 時，DOM 元素的 `value` *屬性*會變成 "Sally"。
但 HTML `value` *attribute* 維持不變，你向輸入元素詢問該 attribute 就會發現：`input.getAttribute('value')` 回傳 "Bob"。

HTML attribute `value` 指定的是*初始*值；DOM `value` 屬性是*目前*值。

`disabled` attribute 是另一個奇特的例子。按鈕的 `disabled` *屬性*預設為
`false`，所以按鈕是啟用的。
當你加入 `disabled` *attribute* 時，光是它的存在就會把按鈕的 `disabled` *屬性*初始化為 `true`，
因此按鈕會被停用。

加入與移除 `disabled` *attribute* 會停用與啟用按鈕。*attribute* 的值並不重要，
這就是為什麼你無法透過寫 `<button disabled="false">Still Disabled</button>` 來啟用按鈕。

設定按鈕的 `disabled` *屬性*（例如用 Angular 繫結）會停用或啟用按鈕。
*屬性*的值很重要。

**HTML attribute 與 DOM 屬性不是同一回事，即使它們同名。**

</div>

這一事實值得重申：
**範本繫結處理的是*屬性*與*事件*，而不是 *attribute*。**

<div class="callout is-helpful">

<header>
  沒有 attribute 的世界
</header>

在 Angular 的世界裡，attribute 的唯一作用是初始化元素與指令的狀態。
當你撰寫資料繫結時，你處理的完全是目標物件的屬性與事件。
HTML attribute 實際上消失了。

</div>

牢記這個模型後，繼續閱讀以瞭解繫結目標。

### 繫結目標

**資料繫結的目標**是 DOM 中的某個東西。
依繫結類型而定，目標可以是
（元素 | 元件 | 指令）屬性、
（元素 | 元件 | 指令）事件，或（少數情況下）attribute 名稱。
下表總結如下：

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="10%">
  </col>
  <col width="15%">
  </col>
  <col width="75%">
  </col>
  <tr>
    <th>
      類型
    </th>
    <th>
      目標
    </th>
    <th>
      範例
    </th>
  </tr>
  <tr>
    <td>
      屬性
    </td>
    <td>
      元素&nbsp;屬性<br>
      元件&nbsp;屬性<br>
      指令&nbsp;屬性
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="property-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
  <tr>
    <td>
      事件
    </td>
    <td>
      元素&nbsp;事件<br>
      元件&nbsp;事件<br>
      指令&nbsp;事件
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="event-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
  <tr>
    <td>
      雙向
    </td>
    <td>
      事件與屬性
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="2-way-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
  <tr>
    <td>
      Attribute
    </td>
    <td>
      Attribute
      （例外）
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="attribute-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
  <tr>
    <td>
      類別
    </td>
    <td>
      <code>class</code> 屬性
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="class-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
  <tr>
    <td>
      樣式
    </td>
    <td>
      <code>style</code> 屬性
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="style-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
</table>

有了這個廣泛的視野，你已準備好詳細瞭解繫結類型了。

<hr/>

{@a property-binding}

## 屬性繫結（ <span class="syntax">[property]</span> ）

撰寫範本**屬性繫結**來設定檢視元素的屬性。
該繫結會把屬性設為[範本運算式](guide/template-syntax#範本運算式)的值。

最常見的屬性繫結是把元素屬性設為元件屬性值。例如
把影像元素的 `src` 屬性繫結到元件的 `heroImageUrl` 屬性：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

另一個範例是在元件表示 `isUnchanged` 時停用按鈕：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

另一個是設定指令的屬性：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

另一個是設定自訂元件的 model 屬性（這是父元件與子元件溝通的好方法）：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-4" header="src/app/app.component.html" linenums="false">
</code-example>

### 單向*流入*

人們常把屬性繫結描述為*單向資料繫結*，因為它讓值朝單一方向流動，
從元件的資料屬性流入目標元素屬性。

你不能使用屬性繫結把值從目標元素中*拉出*。
你不能繫結到目標元素的屬性來*讀取*它。你只能*設定*它。

<div class="alert is-helpful">

同樣地，你不能使用屬性繫結來*呼叫*目標元素上的方法。

如果元素會引發事件，你可以用[事件繫結](guide/template-syntax#event-binding)來監聽它們。

如果你必須讀取目標元素屬性或呼叫它的方法之一，
你需要另一種技巧。
請參閱 API 參考中的
[ViewChild](api/core/ViewChild) 與
[ContentChild](api/core/ContentChild)。

</div>

### 繫結目標

以方括號圍住的元素屬性標識了目標屬性。
下列程式碼中的目標屬性是圖片元素的 `src` 屬性。

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

有些人偏好 `bind-` 前綴的替代寫法，稱為*標準形式*：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-5" header="src/app/app.component.html" linenums="false">
</code-example>

目標名稱永遠是屬性的名稱，即使它看起來像是別的東西的名稱。
你看到 `src`，可能認為它是 attribute 的名稱。不。它是影像元素屬性的名稱。

元素屬性可能是較常見的目標，
但 Angular 會先查看該名稱是否為已知指令的屬性，
如下列範例所示：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

技術上，Angular 是將該名稱與指令的 [input](guide/template-syntax#inputs-outputs) 比對，
即指令 `inputs` 陣列中列出的屬性名稱之一，或以 `@Input()` 裝飾的屬性。
這些輸入會對應到指令自身的屬性。

</div>

如果該名稱無法與已知指令或元素的屬性相符，Angular 會回報「unknown directive」錯誤。

### 避免副作用

如前所述，範本運算式的評估不應該有可見的副作用。
運算式語言本身會盡其所能保障你的安全。
你不能在屬性繫結運算式中對任何東西指派值，也不能使用遞增與遞減運算子。

當然，運算式可能會叫用具有副作用的屬性或方法。
Angular 無從得知，也無法阻止你。

運算式可能呼叫像 `getFoo()` 之類的方法。只有你知道 `getFoo()` 做了什麼。
如果 `getFoo()` 變更了某些東西，而你恰好正繫結到那個東西，你可能會面臨不愉快的體驗。
Angular 可能會、也可能不會顯示變更後的值。Angular 可能會偵測到變更並擲出警告錯誤。
一般而言，請堅持使用資料屬性，以及只回傳值、不做其他事的方法。

### 回傳適當的型別

範本運算式應求值為目標屬性所期望的值型別。
如果目標屬性期望字串就回傳字串。
如果目標屬性期望數字就回傳數字。
如果目標屬性期望物件就回傳物件。

`HeroDetail` 元件的 `hero` 屬性期望一個 `Hero` 物件，而這正是你在屬性繫結中傳送的內容：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-4" header="src/app/app.component.html" linenums="false">
</code-example>

### 記住括號

括號告訴 Angular 要對範本運算式求值。
如果你省略括號，Angular 會將字串視為常數
並以該字串*初始化目標屬性*。
它*不會*對字串求值！

不要犯下列錯誤：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-6" header="src/app/app.component.html" linenums="false">
</code-example>

{@a one-time-initialization}

### 一次性字串初始化

當下列所有條件都成立時，你*應該*省略括號：

* 目標屬性接受字串值。
* 該字串是一個可直接寫入範本的固定值。
* 這個初始值永遠不會變更。

你在標準 HTML 中經常以這種方式初始化 attribute，它對於指令與元件屬性
初始化同樣有效。
下列範例將 `HeroDetailComponent` 的 `prefix` 屬性初始化為一個固定字串，
而非範本運算式。Angular 設定後就不會再管它。

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-7" header="src/app/app.component.html" linenums="false">
</code-example>

另一方面，`[hero]` 繫結仍然是對元件 `currentHero` 屬性的即時繫結。

{@a property-binding-or-interpolation}

### 屬性繫結還是插值？

你經常可以在插值與屬性繫結之間做選擇。
下列繫結組做的事相同：

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-vs-interpolation" header="src/app/app.component.html" linenums="false">
</code-example>

在許多情況下，_插值_是_屬性繫結_的方便替代方案。

當把資料值算繪為字串時，沒有技術上的理由偏好某一種形式。
你會傾向可讀性，而可讀性往往傾向於插值。
建議你建立程式碼風格規則，並選擇既符合規則、又對手邊工作感覺最自然的形式。

當把元素屬性設為非字串資料值時，你必須使用_屬性繫結_。

#### 內容安全

想像下列*惡意內容*。

<code-example path="template-syntax/src/app/app.component.ts" region="evil-title" header="src/app/app.component.ts" linenums="false">
</code-example>

幸好，Angular 資料繫結會警戒危險的 HTML。
它會在顯示值之前先加以[*淨化*](guide/security#清理與安全性上下文)。
它**不會**允許帶有 script 標籤的 HTML 洩漏到瀏覽器中，無論是透過插值
還是屬性繫結。

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-vs-interpolation-sanitization" header="src/app/app.component.html" linenums="false">
</code-example>

插值處理 `<script>` 標籤的方式與屬性繫結不同，但兩種方式算繪出的
內容都是無害的。以下是 `evilTitle` 範例的瀏覽器輸出。

<figure>
  <img src='generated/images/guide/template-syntax/evil-title.png' alt="已變得安全的邪惡標題">
</figure>

<hr/>
{@a other-bindings}

## 屬性、類別與樣式繫結

範本語法為較不適合屬性繫結的情境，提供了專門的單向繫結。

### 屬性繫結（attribute binding）

你可以用**attribute 繫結**直接設定 attribute 的值。

<div class="alert is-helpful">

這是「繫結設定的是目標屬性」這條規則的唯一例外。
這是唯一會建立並設定 attribute 的繫結。

</div>

本指南一再強調，用屬性繫結設定元素屬性，永遠比用字串設定 attribute 更受偏好。為什麼 Angular 要提供 attribute 繫結？

**當沒有元素屬性可繫結時，你必須使用 attribute 繫結。**

以 [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)、
[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) 與
表格跨欄 attribute 為例。它們是純 attribute。
它們不對應到元素屬性，也不會設定元素屬性。
沒有可繫結的屬性目標。

當你寫出像這樣的程式碼時，這一事實就痛苦地明顯了。

<code-example language="html">
  &lt;tr&gt;&lt;td colspan="{{1 + 1}}"&gt;Three-Four&lt;/td&gt;&lt;/tr&gt;
</code-example>

而你會得到這個錯誤：

<code-example format="nocode">
  Template parse errors:
  Can't bind to 'colspan' since it isn't a known native property
</code-example>

正如訊息所說，`<td>` 元素沒有 `colspan` 屬性。
它有 "colspan" *attribute*，但
插值與屬性繫結只能設定*屬性*，不能設定 attribute。

你需要 attribute 繫結來建立這類 attribute 並繫結到它們。

Attribute 繫結語法與屬性繫結相似。
不是在括號中放元素屬性，而是以 **`attr`** 前綴開頭，
後接一個點（`.`）與 attribute 的名稱。
接著你設定 attribute 值，使用會解析為字串的運算式。

把 `[attr.colspan]` 繫結到一個計算出的值：

<code-example path="template-syntax/src/app/app.component.html" region="attrib-binding-colspan" header="src/app/app.component.html" linenums="false">
</code-example>

表格的算繪結果如下：

<table border="1px">
  <tr><td colspan="2">One-Two</td></tr>
  <tr><td>Five</td><td>Six</td></tr>
 </table>

attribute 繫結的主要使用案例之一
就是設定 ARIA attribute，如下列範例所示：

<code-example path="template-syntax/src/app/app.component.html" region="attrib-binding-aria" header="src/app/app.component.html" linenums="false">
</code-example>

<hr/>

### 類別繫結

你可以用**類別繫結**從元素的 `class` attribute 新增與移除 CSS 類別名稱。

類別繫結語法與屬性繫結相似。
不是在方括號中放元素屬性，而是以 `class` 前綴開頭，
其後可接一個點（`.`）與 CSS 類別的名稱：`[class.class-name]`。

下列範例示範如何用類別繫結新增與移除應用程式的 "special" 類別。以下是未使用繫結時設定 attribute 的方式：

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

你可以將它換成繫結到所需類別名稱字串的方式；這是一種全有或全無的取代式繫結。

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

最後，你可以繫結到特定的類別名稱。
當範本運算式的求值結果為 truthy 時，Angular 會加入該類別。
當運算式為 falsy 時，它會移除該類別。

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

雖然這是切換單一類別名稱的好方法，
但當你同時管理多個類別名稱時，通常更偏好使用 [NgClass 指令](guide/template-syntax#ngClass)。

</div>

<hr/>

### 樣式繫結

你可以使用**樣式繫結**來設定行內樣式。

樣式繫結語法與屬性繫結相似。
不是在方括號中放元素屬性，而是以 `style` 前綴開頭，
後接一個點（`.`）與 CSS 樣式屬性的名稱：`[style.style-property]`。

<code-example path="template-syntax/src/app/app.component.html" region="style-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

某些樣式繫結的樣式具有單位副檔名。
下列範例會有條件地以 “em” 與 “%” 單位設定字型大小。

<code-example path="template-syntax/src/app/app.component.html" region="style-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

雖然這是設定單一樣式的好方法，
但當你同時設定多個行內樣式時，通常更偏好使用 [NgStyle 指令](guide/template-syntax#ngStyle)。

</div>

<div class="alert is-helpful">

請注意，_樣式屬性_名稱可以以下列任一形式撰寫
[dash-case](guide/glossary#dash-case)，如上所示，或
[camelCase](guide/glossary#camelcase)，例如 `fontSize`。

</div>

<hr/>

{@a event-binding}

## 事件繫結 `(event)`

事件繫結可讓你監聽鍵盤輸入、滑鼠移動、點選與觸控等特定事件。如需示範本節所有要點的範例，請參閱 <live-example name="event-binding">事件繫結範例</live-example>。

Angular 事件繫結語法由等號左邊括號內的**目標事件**名稱，以及右邊引號內的範本陳述式組成。
下列事件繫結監聽按鈕的 click 事件，每當發生點選時就呼叫元件的 `onSave()` 方法：

<figure>
  <img src='generated/images/guide/event-binding/syntax-diagram.svg' alt="語法圖">
</figure>

### 目標事件

如上所述，目標是按鈕的 click 事件。

<code-example path="event-binding/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

或者，使用 `on-` 前綴，也就是所謂的標準形式：

<code-example path="event-binding/src/app/app.component.html" region="event-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

元素事件可能是較常見的目標，但 Angular 會先查看該名稱是否與已知指令的事件屬性相符，
如下列範例所示：

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html" linenums="false">
</code-example>

如果該名稱無法與元素事件或已知指令的輸出屬性相符，
Angular 會回報「unknown directive」錯誤。

### *$event* 與事件處理陳述式

在事件繫結中，Angular 會為目標事件設定事件處理常式。

當事件被引發時，處理常式會執行範本陳述式。
範本陳述式通常涉及一個接收者，它會執行一個動作
以回應該事件，例如將來自 HTML 控制項的值儲存
到模型中。

繫結會傳達有關事件的資訊。這些資訊可以包括資料值，例如名為 `$event` 的事件物件、字串或數字。

目標事件決定了 `$event` 物件的形狀。如果目標事件是原生的 DOM 元素事件，那麼 `$event` 就是一個 [DOM 事件物件](https://developer.mozilla.org/en-US/docs/Web/Events)，帶有 `target` 與 `target.value` 等屬性。

請看這個範例：

<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

這段程式碼透過繫結到 `name` 屬性，來設定 `<input>` 的 `value` 屬性。
若要監聽值的變更，程式碼會繫結到 `<input>` 元素的
`input` 事件。
當使用者進行變更時，`input` 事件會被引發，繫結會在一個包含 DOM 事件物件 `$event` 的脈絡中
執行該陳述式。

若要更新 `name` 屬性，可透過 `$event.target.value` 路徑取得變更後的文字。

如果事件屬於指令&mdash;請記住，元件
就是指令&mdash;`$event` 的形態就是該指令所產生的形態。

### 使用 `EventEmitter` 的自訂事件

指令通常使用 Angular [EventEmitter](api/core/EventEmitter) 來引發自訂事件。
指令會建立一個 `EventEmitter` 並將它公開為屬性。
指令呼叫 `EventEmitter.emit(payload)` 來觸發事件，傳入訊息承載（payload），它可以是任何東西。
父指令透過繫結到此屬性來監聽事件，並透過 `$event` 物件存取承載。

以呈現項目資訊並回應使用者操作的 `ItemDetailComponent` 為例。
雖然 `ItemDetailComponent` 有一個刪除按鈕，但它不知道如何刪除英雄。它只能引發一個事件，來通報使用者的刪除請求。

以下是該 `ItemDetailComponent` 的相關摘錄：

<code-example path="event-binding/src/app/item-detail/item-detail.component.html" linenums="false" header="src/app/item-detail/item-detail.component.html (template)" region="line-through">
</code-example>

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" linenums="false" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest">
</code-example>

這個元件定義了一個會回傳 `EventEmitter` 的 `deleteRequest` 屬性。
當使用者點選 *delete* 時，元件會呼叫 `delete()` 方法，讓 `EventEmitter` 發出一個 `Item` 物件。

現在想像一個宿主父元件，它繫結到 `ItemDetailComponent` 的 `deleteRequest` 事件。

<code-example path="event-binding/src/app/app.component.html" linenums="false" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component">
</code-example>

當 `deleteRequest` 事件觸發時，Angular 會呼叫父元件的
`deleteItem()` 方法，並將 *要刪除的項目*（由 `ItemDetail` 發出）
以 `$event` 變數傳入。

### 範本陳述式具有副作用

雖然[範本運算式](guide/template-syntax#範本運算式)不應有[副作用](guide/template-syntax#避免副作用)，但範本
陳述式通常有。`deleteItem()` 方法確實具有
副作用：它會刪除一個項目。

刪除項目會更新模型，並依你的程式碼而定，觸發
其他變更，包括查詢以及儲存到遠端伺服器。
這些變更會在整個系統中傳播，最終顯示在這個與其他檢視中。

<hr/>

{@a two-way}

## 雙向繫結（ <span class="syntax">[(...)]</span> ）

你常常既想顯示資料屬性，又想在使用者變更時更新該屬性。

在元素這一側，這需要結合設定特定的元素屬性與監聽元素變更事件。

Angular 為此提供了一個特殊的 _雙向資料繫結_ 語法 **`[(x)]`。**
`[(x)]` 語法結合了 _屬性繫結_ `[x]` 的方括號與 _事件繫結_ `(x)` 的括號。

<div class="callout is-important">

<header>
  [( )] = banana in a box
</header>

想像 *banana in a box*（盒子裡的香蕉）這個畫面，記住括號要放在方括號 _裡面_。

</div>

當元素有一個名為 `x` 的可設定屬性，以及一個名為 `xChange` 的對應事件時，`[(x)]` 語法就很容易示範。
以下是一個符合這個模式的 `SizerComponent`。
它有一個 `size` 值屬性與一個相伴的 `sizeChange` 事件：

<code-example path="template-syntax/src/app/sizer.component.ts" header="src/app/sizer.component.ts">
</code-example>

初始的 `size` 是來自屬性繫結的輸入值。
點選按鈕會增大或減小 `size`，在
最小/最大值限制內，
然後以調整後的大小引發（即發出）`sizeChange` 事件。

以下範例中，`AppComponent.fontSizePx` 與 `SizerComponent` 進行雙向繫結：

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (two-way-1)" region="two-way-1">
</code-example>

`AppComponent.fontSizePx` 建立了 `SizerComponent.size` 的初始值。
點選按鈕會透過雙向繫結更新 `AppComponent.fontSizePx`。
更新後的 `AppComponent.fontSizePx` 值會流向 _樣式_ 繫結，
讓顯示的文字變大或變小。

雙向繫結語法其實只是 _屬性_ 繫結與 _事件_ 繫結的語法糖。
Angular 將 `SizerComponent` 繫結去糖化後如下：

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (two-way-2)" region="two-way-2">
</code-example>

`$event` 變數包含 `SizerComponent.sizeChange` 事件的資料。
當使用者點選按鈕時，Angular 會把 `$event` 值指派給 `AppComponent.fontSizePx`。

顯然，相較於分開的屬性繫結與事件繫結，雙向繫結語法方便得多。

對 HTML 表單元素（例如 `<input>` 與 `<select>`）使用雙向繫結也會很方便。
然而，沒有原生 HTML 元素遵循 `x` 值與 `xChange` 事件模式。

幸好，Angular 的 [_NgModel_](guide/template-syntax#ngModel) 指令是一座橋樑，能對表單元素啟用雙向繫結。

<hr/>

{@a directives}

## 內建指令

舊版 Angular 包含了七十多個內建指令。
社群又貢獻了更多，而無數的私有指令是為內部應用程式建立的。

在 Angular 中你不需要那麼多指令。
你常常可以用功能更強、表現力更高的 Angular 繫結系統達到相同結果。
當你可以寫出像這樣簡單的繫結時，何必建立指令來處理點選？

<code-example path="template-syntax/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

你仍然能從簡化複雜工作的指令中受益。
Angular 仍然隨附內建指令，只是沒那麼多。
你還是會撰寫自己的指令，只是沒那麼多。

本段回顧一些最常用的內建指令，
分類為[_屬性_指令](guide/template-syntax#attribute-directives)或[_結構_指令](guide/template-syntax#structural-directives)。

<hr/>

{@a attribute-directives}

## 內建的_屬性_指令

屬性指令會監聽並修改其他 HTML 元素、attribute、屬性與元件的行為。
它們通常像 HTML attribute 一樣套用到元素上，因此得名。

許多細節在[_屬性指令_](guide/attribute-directives)指南中有涵蓋。
許多 NgModule，例如 [`RouterModule`](guide/router "Routing and Navigation")
與 [`FormsModule`](guide/forms "Forms")，都定義了自己的屬性指令。
本節介紹最常用的屬性指令：

* [`NgClass`](guide/template-syntax#ngClass) - 新增與移除一組 CSS 類別
* [`NgStyle`](guide/template-syntax#ngStyle) - 新增與移除一組 HTML 樣式
* [`NgModel`](guide/template-syntax#ngModel) - 對 HTML 表單元素進行雙向資料繫結

<hr/>

{@a ngClass}

### NgClass

你通常透過動態新增與移除 CSS 類別來控制元素的呈現方式。
你可以繫結到 `ngClass`，同時新增或移除數個類別。

[類別繫結](guide/template-syntax#類別繫結)是新增或移除*單一*類別的好方法。

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-3a" header="src/app/app.component.html" linenums="false">
</code-example>

若要同時新增或移除*許多* CSS 類別，`NgClass` 指令可能是更好的選擇。

試著把 `ngClass` 繫結到一個鍵:值控制物件。
物件的每個鍵都是一個 CSS 類別名稱；其值為 `true` 表示應加入該類別，
`false` 表示應移除。

考慮一個 `setCurrentClasses` 元件方法，它會設定元件屬性
`currentClasses`，其值是一個物件，會根據另外三個元件屬性的 `true`/`false` 狀態新增或移除三個類別：

<code-example path="template-syntax/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts" linenums="false">
</code-example>

把 `ngClass` 屬性繫結加入 `currentClasses`，即可相應地設定元素的類別：

<code-example path="template-syntax/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

呼叫 `setCurrentClasses()` 由你負責，包括初始時，以及相依屬性變更時。

</div>

<hr/>

{@a ngStyle}

### NgStyle

你可以根據元件的狀態動態設定行內樣式。
使用 `NgStyle`，你可以同時設定多個行內樣式。

[樣式繫結](guide/template-syntax#樣式繫結)是設定*單一*樣式值的簡單方法。

<code-example path="template-syntax/src/app/app.component.html" region="NgStyle-1" header="src/app/app.component.html" linenums="false">
</code-example>

若要同時設定*許多*行內樣式，`NgStyle` 指令可能是更好的選擇。

試著把 `ngStyle` 繫結到一個鍵:值控制物件。
物件的每個鍵都是一個樣式名稱；其值是該樣式所適合的值。

考慮一個 `setCurrentStyles` 元件方法，它會設定元件屬性 `currentStyles`，
其值是一個物件，會根據另外三個元件屬性的狀態定義三種樣式：

<code-example path="template-syntax/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts" linenums="false">
</code-example>

把 `ngStyle` 屬性繫結加入 `currentStyles`，即可相應地設定元素的樣式：

<code-example path="template-syntax/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

呼叫 `setCurrentStyles()` 由你負責，包括初始時，以及相依屬性變更時。

</div>

<hr/>

{@a ngModel}

### NgModel - 使用 <span class="syntax">[(ngModel)]</span> 對表單元素進行雙向繫結

在開發資料輸入表單時，你常常既顯示資料屬性，又在使用者變更時更新該屬性。

使用 `NgModel` 指令進行雙向資料繫結讓這件事變得容易。範例如下：

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (NgModel-1)" region="NgModel-1">
</code-example>

#### 使用 _ngModel_ 前必須先有 _FormsModule_

在雙向資料繫結中使用 `ngModel` 指令之前，
你必須匯入 `FormsModule` 並把它加入 NgModule 的 `imports` 清單。
如需 `FormsModule` 與 `ngModel` 的更多資訊，請參閱[表單](guide/forms#ngModel)指南。

以下是匯入 `FormsModule` 以讓 `[(ngModel)]` 可用的方式。

<code-example path="template-syntax/src/app/app.module.1.ts" linenums="false" header="src/app/app.module.ts (FormsModule import)">
</code-example>

#### <span class="syntax">[(ngModel)]</span> 的內部

回顧 `name` 繫結，請注意
你也可以分別繫結 `<input>` 元素的 `value` 屬性與 `input` 事件，達到相同的結果。

<code-example path="template-syntax/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html" linenums="false">
</code-example>

那樣很笨拙。誰能記得要設定哪個元素屬性、哪個元素事件會發出使用者的變更？
你如何從輸入框擷取目前顯示的文字，以便更新資料屬性？
誰想每次都去查這些？

`ngModel` 指令把這些繁瑣的細節隱藏在它自己的 `ngModel` 輸入與 `ngModelChange` 輸出屬性背後。

<code-example path="template-syntax/src/app/app.component.html" region="NgModel-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

`ngModel` 資料屬性會設定元素的值屬性，而 `ngModelChange` 事件屬性
會監聽元素值的變更。

這些細節因元素種類而異，因此 `NgModel` 指令只適用於受到 [ControlValueAccessor](api/forms/ControlValueAccessor) 支援的元素，該存取器會把元素適配到此協定。
`<input>` 框就是這類元素之一。
Angular 為所有基本 HTML 表單元素提供了*值存取器*，而
[表單](guide/forms)指南示範了如何繫結到這些元素。

在你撰寫合適的*值存取器*之前，你無法把 `[(ngModel)]` 套用到非表單的原生元素或第三方自訂元件，這項技巧超出了本指南的範圍。

對於你自行撰寫的 Angular 元件，你不需要值存取器，因為你可以命名值與事件屬性，
以符合 Angular 基本的[雙向繫結語法](guide/template-syntax#two-way)，並完全略過 `NgModel`。
[雙向繫結](guide/template-syntax#two-way)一節中的 `sizer` 就是這種技巧的範例。

</div>

把 `ngModel` 分開繫結，比繫結到元素的原生屬性有所改進。你還可以做得更好。

你不應該需要提及資料屬性兩次。Angular 應該能以單一宣告擷取元件的資料屬性並加以設定，而它確實能用 `[(ngModel)]` 語法做到：

<code-example path="template-syntax/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html" linenums="false">
</code-example>

`[(ngModel)]` 就是你需要的全部嗎？有沒有理由改用它的展開形式？

`[(ngModel)]` 語法只能*設定*資料繫結的屬性。
如果你需要做更多事或不同的事，你可以撰寫展開形式。

下列刻意造作的範例會強制把輸入值改為大寫：

<code-example path="template-syntax/src/app/app.component.html" region="NgModel-4" header="src/app/app.component.html" linenums="false">
</code-example>

以下是所有變化形式的實際運作，包括大寫版本：

<figure>
  <img src='generated/images/guide/template-syntax/ng-model-anim.gif' alt="NgModel 變化">
</figure>

<hr/>

{@a structural-directives}

## 內建 _結構_ 指令

結構指令負責 HTML 版面配置。
它們塑造或重塑 DOM 的_結構_，通常是透過新增、移除與操作它們所附加的宿主元素來達成。

結構指令的深入細節在
[_結構指令_](guide/structural-directives)指南中有涵蓋，
在該指南中你將學到：

* 為什麼要[_在指令名稱前加上星號（\*）前綴_](guide/structural-directives#asterisk "The * in *ngIf")。
* 當指令沒有合適的宿主元素時，使用 [`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>")
來群組元素。
* 如何撰寫你自己的結構指令。
* 你[只能對一個元素套用一個結構指令](guide/structural-directives#one-per-element "one per host element")。

_本_節介紹常見的結構指令：

* [`NgIf`](guide/template-syntax#ngIf) - 依條件從 DOM 新增或移除元素
* [`NgSwitch`](guide/template-syntax#ngSwitch) - 一組在替代檢視之間切換的指令
* [NgForOf](guide/template-syntax#ngFor) - 為清單中的每個項目重複一個範本

<hr/>

{@a ngIf}

### NgIf

把 `NgIf` 指令套用到某個元素（稱為_宿主元素_），即可從 DOM 新增或移除該元素。
把指令繫結到像本範例中 `isActive` 這樣的條件運算式。

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-critical">

別忘了 `ngIf` 前面的星號（`*`）。

</div>

當 `isActive` 運算式傳回真值時，`NgIf` 會把 `HeroDetailComponent` 加入 DOM。
當運算式為假值時，`NgIf` 會把 `HeroDetailComponent` 從 DOM 移除，並銷毀該元件及其所有子元件。

#### 顯示/隱藏並不相同

你可以用
[class](guide/template-syntax#類別繫結) 或 [style](guide/template-syntax#樣式繫結) 繫結來控制元素的可見性：

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html" linenums="false">
</code-example>

隱藏元素與使用 `NgIf` 移除元素截然不同。

當你隱藏一個元素時，該元素及其所有後代都會留在 DOM 中。
這些元素的元件全都留在記憶體中，
Angular 可能會繼續檢查變更。
你可能會握有大量運算資源並降低效能，只為了使用者看不到的東西。

當 `NgIf` 為 `false` 時，Angular 會把元素及其後代從 DOM 移除。
它會銷毀它們的元件，可能釋放大量資源，
從而帶來回應更迅速的使用者體驗。

顯示/隱藏技巧對於少數子元素不多的元素是沒問題的。
當隱藏大型元件樹時你應該謹慎；`NgIf` 可能是更安全的選擇。

#### 防範 null

`ngIf` 指令常用於防範 null。
顯示/隱藏作為防護毫無用處。
如果巢狀運算式嘗試存取 `null` 的屬性，Angular 會擲出錯誤。

這裡我們看到 `NgIf` 防護兩個 `<div>`。
只有存在 `currentHero` 時，才會出現 `currentHero` 名稱。
`nullHero` 永遠不會顯示。

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

另請參閱
下文所述的[_安全導覽運算子_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)")。

</div>

<hr/>

{@a ngFor}

### NgForOf

`NgForOf` 是一個_重複器_指令&mdash;一種呈現項目清單的方式。
你定義一段 HTML，說明單一項目應如何顯示。
你告訴 Angular 把該段落當作範本，用來算繪清單中的每個項目。

以下是把 `NgForOf` 套用到簡單 `<div>` 的範例：

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html" linenums="false">
</code-example>

你也可以把 `NgForOf` 套用到元件元素，如本範例所示：

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-critical">

別忘了 `ngFor` 前面的星號（`*`）。

</div>

指派給 `*ngFor` 的文字是指導重複器流程的指令。

{@a microsyntax}

#### *ngFor 簡寫

指派給 `*ngFor` 的字串不是[範本運算式](guide/template-syntax#範本運算式)。
它是一種*簡寫*&mdash;一種由 Angular 自行解讀的小型語言。
字串 `"let hero of heroes"` 的意思是：

> *取出 `heroes` 陣列中的每個 hero，把它存入區域 `hero` 迴圈變數，並讓它在每次迭代時可供範本 HTML 使用。*

Angular 會把這個指令轉譯為宿主元素周圍的 `<ng-template>`，
再重複使用這個範本，為清單中的每個 `hero` 建立一組新的元素與繫結。

在[_結構指令_](guide/structural-directives#microsyntax)指南中瞭解_簡寫_。

{@a template-input-variable}

{@a template-input-variables}

### 範本輸入變數

`hero` 前面的 `let` 關鍵字會建立一個名為 `hero` 的_範本輸入變數_。
`NgForOf` 指令會迭代父元件 `heroes` 屬性傳回的 `heroes` 陣列，
並在每次迭代時把 `hero` 設為陣列中的目前項目。

你在 `NgForOf` 宿主元素內（以及其後代內）參照 `hero` 輸入變數，即可存取 hero 的屬性。
這裡先在插值中參照它，
再在繫結中把它傳給 `<hero-detail>` 元件的 `hero` 屬性。

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html" linenums="false">
</code-example>

在[_結構指令_](guide/structural-directives#template-input-variable)指南中瞭解_範本輸入變數_的更多資訊。

#### 搭配 _index_ 的 *ngFor

`NgForOf` 指令內容的 `index` 屬性會傳回每次迭代中項目的零基索引。
你可以把 `index` 擷取到範本輸入變數中，並在範本中使用它。

下一個範例把 `index` 擷取到名為 `i` 的變數中，並像這樣把它與 hero 名稱一起顯示。

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

`NgFor` 由 `NgForOf` 指令實作。如需其他 `NgForOf` 內容值（例如 `last`、`even`
與 `odd`）的更多資訊，請參閱 [NgForOf API 參考](api/common/NgForOf)。

</div>

{@a trackBy}

#### 搭配 _trackBy_ 的 *ngFor

`NgForOf` 指令的效能可能不佳，尤其是對大型清單而言。
對單一項目做小變更、移除一個項目或新增一個項目，都可能觸發一連串的 DOM 操作。

例如，重新向伺服器查詢可能以全新的 hero 物件重設清單。

其中大多數（若非全部）都是先前顯示過的 hero。
*你*知道這一點，因為每個 hero 的 `id` 都沒有改變。
但 Angular 只看到一份全新的物件參照清單。
它別無選擇，只能拆掉舊的 DOM 元素並插入全新的 DOM 元素。

Angular 可以用 `trackBy` 避免這種翻攪。
在元件中加入一個方法，回傳 `NgForOf` _應該_追蹤的值。
在這個情況下，該值是 hero 的 `id`。

<code-example path="template-syntax/src/app/app.component.ts" region="trackByHeroes" header="src/app/app.component.ts" linenums="false">
</code-example>

在簡寫運算式中，把 `trackBy` 設為這個方法。

<code-example path="template-syntax/src/app/app.component.html" region="trackBy" header="src/app/app.component.html" linenums="false">
</code-example>

以下是 _trackBy_ 效果的圖示。
"Reset heroes" 會建立具有相同 `hero.id` 的新 hero。
"Change ids" 會建立具有新 `hero.id` 的新 hero。

* 沒有 `trackBy` 時，兩個按鈕都會觸發完整的 DOM 元素取代。
* 使用 `trackBy` 時，只有變更 `id` 才會觸發元素取代。

<figure>
  <img src="generated/images/guide/template-syntax/ng-for-track-by-anim.gif" alt="trackBy">
</figure>

<hr/>

{@a ngSwitch}

### _NgSwitch_ 指令

*NgSwitch* 就像 JavaScript 的 `switch` 陳述式。
它可以根據_切換條件_，從數個可能的元素中顯示_一個_元素。
Angular 只把*選取的*元素放入 DOM。

*NgSwitch* 實際上是一組三個協同運作的指令：
`NgSwitch`、`NgSwitchCase` 與 `NgSwitchDefault`，如本範例所示。

<code-example path="template-syntax/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html" linenums="false">
</code-example>

<figure>
  <img src="generated/images/guide/template-syntax/switch-anim.gif" alt="trackBy">
</figure>

`NgSwitch` 是控制器指令。把它繫結到一個傳回*切換值*的運算式。
本範例中的 `emotion` 值是字串，但切換值可以是任何型別。

**繫結到 `[ngSwitch]`。**如果你嘗試設定 `*ngSwitch`，會得到錯誤，因為
`NgSwitch` 是*屬性*指令，不是*結構*指令。
它會改變其同伴指令的行為。
它不直接碰觸 DOM。

**繫結到 `*ngSwitchCase` 與 `*ngSwitchDefault`**。
`NgSwitchCase` 與 `NgSwitchDefault` 指令是*結構*指令
，因為它們會從 DOM 新增或移除元素。

* `NgSwitchCase` 會在它的繫結值等於切換值時，把它的元素加入 DOM。
* `NgSwitchDefault` 會在沒有選取的 `NgSwitchCase` 時，把它的元素加入 DOM。

切換指令特別適合用來新增與移除*元件元素*。
本範例在 `hero-switch.components.ts` 檔案中定義的四個「情緒 hero」元件之間切換。
每個元件都有一個 `hero` [輸入屬性](guide/template-syntax#inputs-outputs "Input property")，
它繫結到父元件的 `currentHero`。

切換指令也可以搭配原生元素與 Web 元件使用。
例如，你可以把 `<confused-hero>` 切換案例換成下列寫法。

<code-example path="template-syntax/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html" linenums="false">
</code-example>

<hr/>

{@a template-reference-variable}

{@a ref-vars}

{@a ref-var}

## 範本參照變數（ <span class="syntax">#var</span> ）

**範本參照變數**通常是對範本中某個 DOM 元素的參照。
它也可以是對 Angular 元件、指令或 <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web component</a> 的參照。

使用井號（#）來宣告參照變數。
`#phone` 在 `<input>` 元素上宣告了一個 `phone` 變數。

<code-example path="template-syntax/src/app/app.component.html" region="ref-var" header="src/app/app.component.html" linenums="false">
</code-example>

你可以在範本中的_任何地方_參照範本參照變數。
宣告在這個 `<input>` 上的 `phone` 變數，
在範本另一側的 `<button>` 中被使用

<code-example path="template-syntax/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html" linenums="false">
</code-example>

<h3 class="no-toc">參照變數如何取得其值</h3>

在大多數情況下，Angular 會將參照變數的值設為宣告它的那個元素。
在前面的範例中，`phone` 參照的是_電話號碼_ `<input>` 框。
電話按鈕的 click 處理常式會把_input_值傳給元件的 `callPhone` 方法。
但指令可以改變這種行為，把值設為別的東西，例如它自己。
`NgForm` 指令就是這樣做的。

以下是 [Forms](guide/forms) 指南中表單範例的*簡化*版本。

<code-example path="template-syntax/src/app/hero-form.component.html" header="src/app/hero-form.component.html" linenums="false">
</code-example>

範本參照變數 `heroForm` 在本範例中出現三次，中間隔著大量 HTML。
`heroForm` 的值是什麼？

如果 Angular 在你匯入 `FormsModule` 時沒有接管它，
它就會是 [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)。
`heroForm` 實際上是對 Angular [NgForm](api/forms/NgForm "API: NgForm") 指令的參照，該指令能追蹤表單中每個控制項的值與有效性。

原生 `<form>` 元素沒有 `form` 屬性。
但 `NgForm` 指令有，這說明了為什麼在 `heroForm.form.valid` 無效時你可以停用提交按鈕，並將整個表單控制項樹傳遞給父元件的 `onSubmit` 方法。

<h3 class="no-toc">範本參照變數警告注意事項</h3>

範本_參照_變數（`#phone`）與範本_輸入_變數（`let phone`）不同，例如你在 [`*ngFor`](guide/template-syntax#template-input-variable) 中可能看到的那種。
在[_結構指令_](guide/structural-directives#template-input-variable)指南中瞭解兩者的差異。

參照變數的作用域是_整個範本_。
不要在同一個範本中多次定義相同的變數名稱。
執行期值將無法預測。

你可以使用 `ref-` 前綴作為 `#` 的替代。
這個範例將 `fax` 變數宣告為 `ref-fax`，而不是 `#fax`。

<code-example path="template-syntax/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html" linenums="false">
</code-example>

<hr/>

{@a inputs-outputs}

## 輸入與輸出屬性

_Input_ 屬性是一個以 `@Input` 裝飾器標註的_可設定_屬性。
當它以[屬性繫結](#property-binding)進行資料繫結時，值會_流入_該屬性

_Output_ 屬性是一個以 `@Output` 裝飾器標註的_可觀察_屬性。
該屬性幾乎總是回傳 Angular 的 [`EventEmitter`](api/core/EventEmitter)。
值會以事件的形式_流出_元件，而事件是以[事件繫結](#event-binding)繫結的。

你只能透過另一個元件或指令的 _Input_ 與 _Output_ 屬性繫結到它。

<div class="alert is-important">

請記住，所有**元件**都是**指令。**

下列討論為了簡潔而提及_元件_，
也因為這個主題主要與元件作者有關。
</div>

<h3 class="no-toc">討論</h3>

你通常是把範本繫結到它_自己的元件類別_。
在這類繫結運算式中，元件的屬性或方法位於（`=`）的_右邊_。

<code-example path="template-syntax/src/app/app.component.html" region="io-1" header="src/app/app.component.html" linenums="false">
</code-example>

`iconUrl` 與 `onSave` 是 `AppComponent` 類別的成員。
它們_沒有_以 `@Input()` 或 `@Output` 裝飾。
Angular 不會反對。

**你永遠可以在元件自己的範本中繫結到元件的公開屬性。**
它不必是 _Input_ 或 _Output_ 屬性

元件的類別與範本緊密耦合。
它們都是同一個東西的兩個部分。
它們合在一起_就是_該元件。
元件類別與其範本之間的交流是內部實作細節。

### 繫結到不同的元件

你也可以繫結到_不同_元件的屬性。
在這類繫結中，_另一個_元件的屬性位於（`=`）的_左邊_。

在下列範例中，`AppComponent` 範本把 `AppComponent` 類別成員繫結到選擇器為 `'app-hero-detail'` 的 `HeroDetailComponent` 的屬性。

<code-example path="template-syntax/src/app/app.component.html" region="io-2" header="src/app/app.component.html" linenums="false">
</code-example>

Angular 編譯器_可能_會以像這樣的錯誤拒絕這些繫結：

<code-example language="sh" class="code-shell">
Uncaught Error: Template parse errors:
Can't bind to 'hero' since it isn't a known property of 'app-hero-detail'
</code-example>

你知道 `HeroDetailComponent` 有 `hero` 與 `deleteRequest` 屬性。
但 Angular 編譯器拒絕辨識它們。

**Angular 編譯器不會繫結到不同元件的屬性，
除非它們是 Input 或 Output 屬性**。

這條規則有充分的理由。

元件繫結到它_自己的_屬性是可以的。
元件作者完全掌控那些繫結。

但其他元件不應該擁有這種不受限制的存取權。
如果任何人都能繫結到你元件的任何屬性，你將很難支援你的元件。
外部元件應該只能繫結到元件的公開繫結 API。

Angular 要求你對該 API 保持_明確_。
哪些屬性可供外部元件繫結，由_你_決定。

#### TypeScript 的 _public_ 並不重要

你不能使用 TypeScript 的 _public_ 與 _private_ 存取修飾詞來塑造元件的公開繫結 API。

<div class="alert is-important">

所有資料繫結的屬性都必須是 TypeScript 的 _public_ 屬性。
Angular 永遠不會繫結到 TypeScript 的 _private_ 屬性。

</div>

Angular 需要另一種方式來識別_外部_元件被允許繫結到的屬性。
那_另一種方式_就是 `@Input()` 與 `@Output()` 裝飾器。

### 宣告 Input 與 Output 屬性

在本指南的範例中，對 `HeroDetailComponent` 的繫結不會失敗，
因為資料繫結的屬性已以 `@Input()` 與 `@Output()` 裝飾器標註。

<code-example path="template-syntax/src/app/hero-detail.component.ts" region="input-output-1" header="src/app/hero-detail.component.ts" linenums="false">
</code-example>

<div class="alert is-helpful">

或者，你可以在指令中繼資料的 `inputs` 與 `outputs` 陣列中指定成員，如本範例所示：

<code-example path="template-syntax/src/app/hero-detail.component.ts" region="input-output-2" header="src/app/hero-detail.component.ts" linenums="false">
</code-example>

</div>

### Input 還是 output？

*Input* 屬性通常接收資料值。
*Output* 屬性會公開事件生產者，例如 `EventEmitter` 物件。

_input_ 與 _output_ 這兩個詞反映了目標指令的視角。

<figure>
  <img src="generated/images/guide/template-syntax/input-output.png" alt="輸入與輸出">
</figure>

從 `HeroDetailComponent` 的視角來看，`HeroDetailComponent.hero` 是一個 **input** 屬性，
因為資料從範本繫結運算式*流入*該屬性。

從 `HeroDetailComponent` 的視角來看，`HeroDetailComponent.deleteRequest` 是一個 **output** 屬性，
因為事件從該屬性*流出*，流向範本繫結陳述式中的處理常式。

<h3 id='aliasing-io'>
  為 input/output 屬性取別名
</h3>

有時候，input/output 屬性的公開名稱應該與內部名稱不同。

這在[屬性指令](guide/attribute-directives)中經常如此。
指令使用者期望繫結到指令的名稱。
例如，當你把選擇器為 `myClick` 的指令套用到 `<div>` 標籤時，
你期望繫結到一個也稱為 `myClick` 的事件屬性。

<code-example path="template-syntax/src/app/app.component.html" region="myClick" header="src/app/app.component.html" linenums="false">
</code-example>

然而，指令名稱對於指令類別內的屬性名稱而言，往往不是好選擇。
指令名稱很少能描述該屬性的功能。
`myClick` 這個指令名稱，對於一個發出 click 訊息的屬性而言不是好名稱。

幸好，你可以為屬性設定符合慣例期望的公開名稱，
同時在內部使用不同的名稱。
在緊接著的上一個範例中，你實際上是*透過* `myClick` *別名*繫結到指令自己的 `clicks` 屬性。

你可以把別名傳入 input/output 裝飾器，來為屬性名稱指定別名，像這樣：

<code-example path="template-syntax/src/app/click.directive.ts" region="output-myClick" header="src/app/click.directive.ts" linenums="false">
</code-example>

<div class="alert is-helpful">

你也可以在 `inputs` 與 `outputs` 陣列中為屬性名稱取別名。
你撰寫一個以冒號（`:`）分隔的字串，
左邊是指令屬性名稱，右邊是公開別名：

<code-example path="template-syntax/src/app/click.directive.ts" region="output-myClick2" header="src/app/click.directive.ts" linenums="false">
</code-example>

</div>

<hr/>

{@a expression-operators}

## 範本運算式運算子

範本運算式語言採用 JavaScript 語法的子集，並輔以少數針對特定情境的特殊運算子。接下來的章節將介紹其中兩個運算子：_管道_與_安全導覽運算子_。

{@a pipe}

### 管道運算子（ <span class="syntax">|</span> ）

運算式的結果在準備用於繫結之前，可能需要先經過一些轉換。
例如，你可以將數字顯示為貨幣、強制把文字改為大寫，或篩選清單並加以排序。

Angular 的[管道](guide/pipes)是進行這類小型轉換的好選擇。
管道是簡單的函式，接受一個輸入值並回傳轉換後的值。
使用**管道運算子（`|`），**就能輕鬆地在範本運算式中套用它們：

<code-example path="template-syntax/src/app/app.component.html" region="pipes-1" header="src/app/app.component.html" linenums="false">
</code-example>

管道運算子會將左側運算式的結果，傳給右側的管道函式。

你可以透過多個管道串連運算式：

<code-example path="template-syntax/src/app/app.component.html" region="pipes-2" header="src/app/app.component.html" linenums="false">
</code-example>

你也可以為管道[套用參數](guide/pipes#為管道加上參數)：

<code-example path="template-syntax/src/app/app.component.html" region="pipes-3" header="src/app/app.component.html" linenums="false">
</code-example>

`json` 管道對於繫結的除錯特別有幫助：

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (pipes-json)" region="pipes-json">
</code-example>

產生的輸出大致如下：

<code-example language="json">
  { "id": 0, "name": "Hercules", "emotion": "happy",
    "birthdate": "1970-02-25T08:00:00.000Z",
    "url": "http://www.imdb.com/title/tt0065832/",
    "rate": 325 }
</code-example>

<hr/>

{@a safe-navigation-operator}

### 安全導覽運算子（ <span class="syntax">?.</span> ）與 null 屬性路徑

Angular 的**安全導覽運算子（`?.`）**是一種流暢又方便的方式，可防範屬性路徑中的 null 與 undefined 值。
這裡它能避免在 `currentHero` 為 null 時發生檢視算繪失敗。

<code-example path="template-syntax/src/app/app.component.html" region="safe-2" header="src/app/app.component.html" linenums="false">
</code-example>

當下列資料繫結的 `title` 屬性為 null 時會發生什麼事？

<code-example path="template-syntax/src/app/app.component.html" region="safe-1" header="src/app/app.component.html" linenums="false">
</code-example>

檢視仍會算繪，但顯示的值是空白的；你只會看到 "The title is"，其後什麼都沒有。
那是合理的行為。至少應用程式不會當掉。

假設範本運算式涉及屬性路徑，如下一個範例所示，它顯示 null hero 的 `name`。

<code-example language="html">
  The null hero's name is {{nullHero.name}}
</code-example>

JavaScript 會擲出 null 參照錯誤，Angular 也一樣：

<code-example format="nocode">
  TypeError: Cannot read property 'name' of null in [null].
</code-example>

更糟的是，*整個檢視消失*。

如果 `hero` 屬性永遠不可能為 null，這會是合理的行為。
如果它絕不能為 null 卻又是 null，
那就是應該被抓到並修復的程式錯誤。
擲出例外是正確的做法。

另一方面，屬性路徑中的 null 值有時是可以接受的，
尤其是在資料目前為 null、但最終會到達的時候。

在等待資料時，檢視應該毫無怨言地算繪，
而 null 屬性路徑應該像 `title` 屬性一樣顯示為空白。

不幸的是，當 `currentHero` 為 null 時應用程式會當掉。

你可以用 [*ngIf](guide/template-syntax#ngIf) 繞過這個問題。

<code-example path="template-syntax/src/app/app.component.html" region="safe-4" header="src/app/app.component.html" linenums="false">
</code-example>

你可以嘗試用 `&&` 串連屬性路徑的各部分，因為你知道運算式在遇到第一個 null 時就會中止。

<code-example path="template-syntax/src/app/app.component.html" region="safe-5" header="src/app/app.component.html" linenums="false">
</code-example>

這些方法各有優點，但可能很笨拙，尤其是屬性路徑很長的時候。
想像要防範像 `a.b.c.d` 這樣長的屬性路徑中某處的 null。

Angular 的安全導覽運算子（`?.`）是一種更流暢、更方便的方式，可防範屬性路徑中的 null。
運算式在遇到第一個 null 值時就會中止。
顯示為空白，但應用程式不會出錯、繼續運作。

<code-example path="template-syntax/src/app/app.component.html" region="safe-6" header="src/app/app.component.html" linenums="false">
</code-example>

它對於 `a?.b?.c?.d` 這樣的長屬性路徑也能完美運作。

<hr/>

{@a non-null-assertion-operator}

### 非空斷言運算子（ <span class="syntax">!</span> ）

自 Typescript 2.0 起，你可以使用 `--strictNullChecks` 旗標，強制啟用[嚴格 null 檢查](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript")。TypeScript 會確保沒有任何變數在_非預期_的情況下為 null 或 undefined。

在此模式下，具型別的變數預設不允許 null 與 undefined。如果你讓某個變數未指派值，或嘗試將 null 或 undefined 指派給型別不允許 null 與 undefined 的變數，型別檢查器會擲出錯誤。

如果型別檢查器無法判斷某個變數在執行時會是 null 或 undefined，也會擲出錯誤。
你可能知道那不會發生，但型別檢查器不知道。
你可以套用後綴的[_非空斷言運算子（!）_](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator")，告訴型別檢查器那不會發生。

_Angular_ 的**非空斷言運算子（`!`）**在 Angular 範本中也有相同的用途。

例如，在你使用 [*ngIf](guide/template-syntax#ngIf) 檢查 `hero` 已定義之後，你就可以斷言 `hero` 的屬性也已定義。

<code-example path="template-syntax/src/app/app.component.html" region="non-null-assertion-1" header="src/app/app.component.html" linenums="false">
</code-example>

當 Angular 編譯器將你的範本轉換為 TypeScript 程式碼時，
它會防止 TypeScript 回報 `hero.name` 可能為 null 或 undefined。

與[_安全導覽運算子_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)")不同，
**非空斷言運算子**不會防範 null 或 undefined。
相反地，它會告訴 TypeScript 型別檢查器，針對特定的屬性運算式，暫停嚴格 null 檢查。

當你啟用嚴格 null 檢查時，你會需要這個範本運算子。否則它是可選的。

<a href="#top-of-page">回到頂部</a>

<hr/>

{@a built-in-template-functions}

## 內建範本函式

{@a any-type-cast-function}

### `$any()` 型別轉換函式

有時繫結運算式會在 [AOT 編譯](guide/aot-compiler)期間觸發型別錯誤，而且無法或難以完整指定型別。
若要消除這個錯誤，你可以使用 `$any()` 轉換函式，將
運算式轉換為 [`any` 型別](http://www.typescriptlang.org/docs/handbook/basic-types.html#any)，如下列範例所示：

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html" linenums="false">
</code-example>

當 Angular 編譯器將此範本轉換為 TypeScript 程式碼時，
它會在對範本執行型別檢查時，防止 TypeScript 回報 `bestByDate` 不是 `item`
物件的成員。

`$any()` 轉換函式也可以搭配 `this` 使用，以便存取元件
未宣告的成員。

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html" linenums="false">
</code-example>

`$any()` 轉換函式可在繫結運算式中任何方法呼叫有效的位置使用。
