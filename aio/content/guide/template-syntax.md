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

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1" header="src/app/app.component.html"></code-example>

大括號之間的文字通常是元件屬性的名稱。Angular 會以對應元件屬性的字串值取代該名稱。

<code-example path="interpolation/src/app/app.component.html" region="component-property" header="src/app/app.component.html"></code-example>

在上例中，Angular 會評估 `title` 與 `itemImageUrl` 屬性並填入空白，先顯示一些標題文字，接著顯示一張圖片。

更一般來說，大括號之間的文字是一個範本運算式，Angular 會先評估它，再將它轉換為字串。
下列插值以兩個數字相加來說明這一點：

<code-example path="interpolation/src/app/app.component.html" region="convert-string" header="src/app/app.component.html"></code-example>

運算式可以叫用宿主元件的方法，例如以下範例中的 `getVal()`：

<code-example path="interpolation/src/app/app.component.html" region="invoke-method" header="src/app/app.component.html"></code-example>

Angular 會評估雙大括號中的所有運算式，將運算式結果轉換為字串，並將它們與相鄰的文字字串連結。最後，它會將這個組合而成的插值結果指派給**元素或指令屬性。**

你看起來像是把結果插入元素標籤之間，並指派給屬性。
然而，插值是一種特殊語法，Angular 會把它轉換成*屬性繫結*。

<div class="alert is-helpful">

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
* 新的[範本運算式運算子](guide/template-syntax#expression-operators)，例如 `|`、`?.` 與 `!`

### 運算式脈絡

*運算式上下文*通常就是 _元件_ 實例。
在以下程式碼片段中，雙大括號內的 `recommended` 與引號內的
`itemImageUrl2` 參照的是 `AppComponent` 的屬性。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html"></code-example>

運算式也可以參照*範本*上下文的屬性
例如範本輸入變數、

<!-- link to built-in-directives#template-input-variables -->

`let customer`，或範本參照變數 `#customerInput`。

<!-- link to guide/template-ref-variables -->

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)"></code-example>

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)"></code-example>

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

* [簡單](guide/template-syntax#簡單)
* [快速執行](guide/template-syntax#快速執行)
* [無明顯副作用](guide/template-syntax#無明顯副作用)

#### 簡單

雖然可以撰寫複雜的範本運算式，但比較好的
做法是避免這麼做。

屬性名稱或方法呼叫應該是常態，但偶爾使用布林否定 `!` 是可以的。
除此之外，請將應用程式與業務邏輯侷限在元件中，
讓它易於開發和測試。

#### 快速執行

Angular 會在每次變更偵測週期後執行範本運算式。
許多非同步活動都會觸發變更偵測週期，例如
promise 的解析、HTTP 結果、計時器事件、按鍵與滑鼠移動。

運算式應該要能快速完成，否則使用者體驗可能會拖慢，在較慢的裝置上尤其如此。
當運算需要較多資源時，可以考慮快取其值。

#### 無明顯副作用

範本運算式不應變更目標屬性值以外的
任何應用程式狀態。

這條規則是 Angular「單向資料流」政策的關鍵。
你永遠不必擔心讀取一個元件值可能會改變其他顯示中的值。
檢視在單次算繪過程中應該保持穩定。

[冪等](https://en.wikipedia.org/wiki/Idempotence)運算式是理想的選擇，因為
它沒有副作用，還能提升 Angular 的變更偵測效能。
以 Angular 的用語來說，冪等運算式
在它的相依值改變之前，永遠回傳*完全相同的東西*。

相依值在事件迴圈的單次輪轉期間不應改變。
如果冪等運算式回傳字串或數字，連續呼叫兩次會回傳相同的字串或數字。如果運算式回傳物件（包括 `array`），連續呼叫兩次會回傳相同的物件*參照*。

<div class="alert is-helpful">

這項行為有一個例外，適用於 `*ngFor`。`*ngFor` 具有 `trackBy` 功能，可以在走訪物件時處理物件的參照不等式。詳情請參閱 [*ngFor 搭配 `trackBy`](guide/template-syntax#搭配-trackby-的-ngfor)。

</div>

<!-- end of Interpolation doc -->

<hr/>

{@a template-statements}

## 範本陳述式

範本**陳述式**會回應繫結目標所引發的**事件**
例如元素、元件或指令。
你會在[事件繫結](guide/template-syntax#event-binding)一節中看到範本陳述式，
它們出現在 `=`&nbsp;符號右側的引號中，如 `(event)="statement"`。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html"></code-example>

範本陳述式*具有副作用*。
這正是事件的全部意義。
這是你根據使用者動作更新應用程式狀態的方式。

回應事件是 Angular「單向資料流」的另一面。
在事件迴圈的這一輪中，你可以自由變更任何地方的任何內容。

和範本運算式一樣，範本*陳述式*使用的語言看起來像 JavaScript。
範本陳述式剖析器與範本運算式剖析器不同，
它特別支援基本指派（`=`）以及以 <code>;</code> 串連運算式。

不過，某些 JavaScript 與範本運算式語法是不允許的：

* <code>new</code>
* 遞增與遞減運算子，`++` 與 `--`
* 運算子指派，例如 `+=` 與 `-=`
* 位元運算子，例如 `|` 與 `&`
* [管道運算子](guide/template-syntax#pipe)

### 陳述式脈絡

和運算式一樣，陳述式只能參照陳述式脈絡中的內容，
例如元件實例的事件處理方法。

*陳述式脈絡*通常就是元件實例。
`(click)="deleteHero()"` 中的 *deleteHero* 是資料繫結元件的方法。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html"></code-example>

陳述式上下文也可以參照範本自身上下文的屬性。
在下列範例中，範本 `$event` 物件、
[範本輸入變數](guide/template-syntax#template-input-variable)（`let hero`），
以及[範本參照變數](guide/template-syntax#ref-vars)（`#heroForm`）
會被傳遞給元件的事件處理方法。

<code-example path="template-syntax/src/app/app.component.html" region="context-var-statement" header="src/app/app.component.html"></code-example>

範本上下文名稱的優先順序高於元件上下文名稱。
在前面的 `deleteHero(hero)` 中，`hero` 是範本輸入變數，而不是元件的 `hero` 屬性。

### 陳述式準則

範本陳述式不能參照全域命名空間中的任何內容。它們
不能參照 `window` 或 `document`。
它們不能呼叫 `console.log` 或 `Math.max`。

和運算式一樣，避免撰寫複雜的範本陳述式。
方法呼叫或簡單的屬性指派應該是常態。

<hr/>

{@a binding-syntax}

## 繫結語法：概覽

資料繫結是一種協調機制，用來協調使用者所看到的內容，特別是與應用程式資料值之間的協調。
雖然你可以自行把值推送到 HTML 或從 HTML 拉取值，
但把這些工作交給繫結框架，應用程式會更容易撰寫、閱讀與維護。
你只需要宣告繫結來源與目標 HTML 元素之間的繫結，其餘的就交給框架處理。

本節語法與程式碼片段的示範，請參閱 <live-example name="binding-syntax">繫結語法範例</live-example>。

Angular 提供多種資料繫結。繫結類型依資料流動的方向，可分為三個類別：

* 從 _來源到檢視_
* 從 _檢視到來源_
* 雙向序列：_檢視到來源再到檢視_

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
      類型
    </th>
    <th>
      語法
    </th>
    <th>
      類別
    </th>

  </tr>
  <tr>
     <td>
      插值<br>
      屬性<br>
      Attribute<br>
      類別<br>
      樣式
    </td>
    <td>

      <code-example>
        {{expression}}
        [target]="expression"
        bind-target="expression"
      </code-example>

    </td>

    <td>
      單向<br>從資料來源<br>到檢視目標
    </td>
    <tr>
      <td>
        事件
      </td>
      <td>
        <code-example>
          (target)="statement"
          on-target="statement"
        </code-example>
      </td>

      <td>
        單向<br>從檢視目標<br>到資料來源
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

插值以外的繫結類型，在等號左邊都有一個**目標名稱**，可以用標點符號 `[]` 或 `()` 包圍，
或在前面加上前綴：`bind-`、`on-`、`bindon-`。

繫結的*目標*是繫結標點符號之內的屬性或事件：`[]`、`()` 或 `[()]`。

**來源**指令的每個公開成員都會自動可供繫結。
你不需要做任何特殊處理，就能在範本運算式或陳述式中存取指令成員。

### 資料繫結與 HTML

在一般的 HTML 開發過程中，你會用 HTML 元素建立視覺結構，
並以字串常數設定元素 attribute 的方式來修改這些元素。

```html
<div class="special">Plain old HTML</div>
<img src="images/item.png">
<button disabled>Save</button>
```

透過資料繫結，你可以控制像是按鈕狀態這類事情：

<code-example path="binding-syntax/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

請注意，這個繫結是對按鈕 DOM 元素的 `disabled` 屬性，
**不是** attribute。這一點普遍適用於資料繫結。資料繫結處理的是 DOM 元素、元件與指令的*屬性*，而不是 HTML *attribute*。

### HTML attribute 與 DOM 屬性

區分 HTML attribute 與 DOM 屬性，是理解 Angular 繫結如何運作的關鍵。**Attribute 是由 HTML 定義的。屬性是從 DOM（Document Object Model）節點存取的。**

* 少數 HTML attribute 與屬性有 1:1 的對應關係；例如 `id`。

* 有些 HTML attribute 沒有對應的屬性；例如 `aria-*`。

* 有些 DOM 屬性沒有對應的 attribute；例如 `textContent`。

請務必記住，*HTML attribute* 與 *DOM 屬性*是不同的東西，即使它們有相同的名稱。
在 Angular 中，HTML attribute 的唯一作用是初始化元素與指令的狀態。

**範本繫結處理的是*屬性*與*事件*，而不是 *attribute*。**

當你撰寫資料繫結時，你處理的完全是目標物件的 DOM 屬性與事件。

<div class="alert is-helpful">

這個一般規則能幫助你建立 attribute 與 DOM 屬性的心智模型：
**Attribute 初始化 DOM 屬性，之後就功成身退。
屬性值可以改變；attribute 值不能。**

這個規則有一個例外。
Attribute 可以被 `setAttribute()` 改變，而這會重新初始化對應的 DOM 屬性。

</div>

如需更多資訊，請參閱 [MDN 介面文件](https://developer.mozilla.org/en-US/docs/Web/API#Interfaces)，其中包含所有標準 DOM 元素及其屬性的 API 文件。
將 [`<td>` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td) 與 [`<td>` 屬性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement) 互相比較，是很有幫助的區分範例。
特別是，你可以從 attribute 頁面透過 "DOM interface" 連結導覽到屬性，並沿著繼承階層向上導覽至 `HTMLTableCellElement`。

#### 範例 1：`<input>`

當瀏覽器渲染 `<input type="text" value="Sarah">` 時，它會建立一個
對應的 DOM 節點，帶有 `value` 屬性，並把該 `value` 初始化為 "Sarah"。

```html
<input type="text" value="Sarah">
```

當使用者在 `<input>` 中輸入 "Sally" 時，DOM 元素的 `value` *屬性*會變成 "Sally"。
不過，如果你用 `input.getAttribute('value')` 查看 HTML attribute `value`，會看到 *attribute* 維持不變&mdash;它回傳 "Sarah"。

HTML attribute `value` 指定的是*初始*值；DOM `value` 屬性是*目前*值。

要在實際運作的應用程式中查看 attribute 與 DOM 屬性的差異，請參閱 <live-example name="binding-syntax"></live-example>，特別是繫結語法的部分。

#### 範例 2：停用的按鈕

`disabled` attribute 是另一個例子。按鈕的 `disabled`
*屬性*預設為 `false`，所以按鈕是啟用的。

當你加入 `disabled` *attribute* 時，光是它的存在就會把按鈕的 `disabled` *屬性*初始化為 `true`，
因此按鈕會被停用。

```html
<button disabled>Test Button</button>
```

加入與移除 `disabled` attribute 會停用與啟用按鈕。
不過，attribute 的值並不重要，這就是為什麼你無法透過寫 `<button disabled="false">Still Disabled</button>` 來啟用按鈕。

要控制按鈕的狀態，請設定 `disabled` *屬性*，

<div class="alert is-helpful">

雖然技術上你可以設定 `[attr.disabled]` attribute 繫結，但兩者的值並不相同：屬性繫結要求值為布林值，而對應的 attribute 繫結則取決於值是否為 `null`。請看下列範例：

```html
<input [disabled]="condition ? true : false">
<input [attr.disabled]="condition ? 'disabled' : null">
```

一般來說，應優先使用屬性繫結而非 attribute 繫結，因為它更直覺（使用布林值）、語法較短，而且效能更好。

</div>

要在實際運作的應用程式中查看 `disabled` 按鈕範例，請參閱 <live-example name="binding-syntax"></live-example>，特別是繫結語法的部分。這個範例會教你如何從元件切換 disabled 屬性。

## 繫結類型與目標

**資料繫結的目標**是 DOM 中的某個東西。
依繫結類型而定，目標可以是屬性（元素、元件或指令）、
事件（元素、元件或指令），有時也可以是 attribute 名稱。
下表總結了不同繫結類型的目標。

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
      下列程式碼中的 <code>src</code>、<code>hero</code> 與 <code>ngClass</code>：
      <code-example path="template-syntax/src/app/app.component.html" region="property-binding-syntax-1"></code-example>
      <!-- For more information, see [Property Binding](guide/property-binding). -->
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
      下列程式碼中的 <code>click</code>、<code>deleteRequest</code> 與 <code>myClick</code>：
      <code-example path="template-syntax/src/app/app.component.html" region="event-binding-syntax-1"></code-example>
      <!-- KW--Why don't these links work in the table? -->
      <!-- <div>For more information, see [Event Binding](guide/event-binding).</div> -->
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
      <code-example path="template-syntax/src/app/app.component.html" region="2-way-binding-syntax-1"></code-example>
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
      <code-example path="template-syntax/src/app/app.component.html" region="attribute-binding-syntax-1"></code-example>
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
      <code-example path="template-syntax/src/app/app.component.html" region="class-binding-syntax-1"></code-example>
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
      <code-example path="template-syntax/src/app/app.component.html" region="style-binding-syntax-1"></code-example>
    </td>
  </tr>
</table>

<!-- end of binding syntax -->

<hr/>

{@a property-binding}

## 屬性繫結 `[property]`

使用屬性繫結來 _設定_ 目標元素的屬性或
指令的 `@Input()` 裝飾器。若要查看
示範本節所有要點的範例，請參閱

<live-example name="property-binding">property binding example</live-example>.

### 單向流入

屬性繫結以單一方向移動值，從元件的屬性進入目標元素屬性。

你不能使用屬性
繫結來讀取或取出目標元素的值。同樣地，你也不能使用
屬性繫結來呼叫目標元素的方法。
如果元素會引發事件，你可以用[事件繫結](guide/template-syntax#event-binding)來監聽它們。

若要讀取目標元素屬性或呼叫它的方法，請參閱 [ViewChild](api/core/ViewChild) 與 [ContentChild](api/core/ContentChild) 的 API 參考。

### 範例

最常見的屬性繫結是將元素屬性設定為元件
屬性值。例如
將圖片元素的 `src` 屬性繫結到元件的 `itemImageUrl` 屬性：

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

這是繫結到 `colSpan` 屬性的範例。請注意它不是 `colspan`，
後者是屬性名稱，拼寫為小寫的 `s`。

<code-example path="property-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

詳情請參閱 [MDN HTMLTableCellElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement) 文件。

<!-- Add link when Attribute Binding updates are merged:
For more about `colSpan` and `colspan`, see (Attribute Binding)[guide/template-syntax]. -->

另一個範例是在元件表示 `isUnchanged` 時停用按鈕：

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

另一個是設定指令的屬性：

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

再一個是設定自訂元件的 model 屬性&mdash;這是父元件與子元件溝通的好方法：

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

### 繫結目標

以方括號圍住的元素屬性標識了目標屬性。
下列程式碼中的目標屬性是圖片元素的 `src` 屬性。

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

也有 `bind-` 前綴的替代寫法：

<code-example path="property-binding/src/app/app.component.html" region="bind-prefix" header="src/app/app.component.html"></code-example>

在大多數情況下，目標名稱是屬性的名稱，即使它看起來像是 attribute 的名稱。
在這個範例中，`src` 是 `<img>` 元素屬性的名稱。

元素屬性可能是較常見的目標，
但 Angular 會先查看該名稱是否為已知指令的屬性，
如下列範例所示：

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

技術上，Angular 是將該名稱與指令的 `@Input()` 比對，
即指令 `inputs` 陣列中列出的屬性名稱之一
或以 `@Input()` 裝飾的屬性。
這些輸入會對應到指令自身的屬性。

如果該名稱無法與已知指令或元素的屬性相符，Angular 會回報「unknown directive」錯誤。

<div class="alert is-helpful">

雖然目標名稱通常就是屬性名稱，
但 Angular 對數個常見屬性有自動的屬性對應（attribute-to-property）機制，
包括 `class`/`className`、`innerHtml`/`innerHTML` 以及
`tabindex`/`tabIndex`。

</div>

### 避免副作用

範本運算式的評估不應該有可見的副作用。
運算式語言本身，或你撰寫範本運算式的方式，
在某種程度上有所幫助；
你不能在屬性繫結運算式中對任何東西指派值，
也不能使用遞增與遞減運算子。

例如，你可能有一個運算式叫用了具有副作用的屬性或方法
。該運算式可能呼叫像 `getFoo()` 之類的方法，只有你
知道 `getFoo()` 做了什麼。如果 `getFoo()` 變更了某些東西，
而你恰好正繫結到那個東西，
Angular 可能會、也可能不會顯示變更後的值。Angular 可能會偵測到
變更並拋出警告錯誤。
作為最佳實務，請堅持使用屬性以及會回傳
值的方法，並避免副作用。

### 回傳適當的型別

範本運算式應求值為目標屬性所期望的
值型別。
如果目標屬性期望字串就回傳字串，期望數字就回傳
數字，期望物件就回傳物件，依此類推。

在下列範例中，`ItemDetailComponent` 的 `childItem` 屬性期望一個字串，而這正是你在屬性繫結中傳送的內容：

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

你可以查看 `ItemDetailComponent` 來確認這一點，其中 `@Input` 的型別被設定為字串：

<code-example path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type" header="src/app/item-detail/item-detail.component.ts (setting the @Input() type)"></code-example>

正如你在此所見，`AppComponent` 中的 `parentItem` 是一個字串，正是 `ItemDetailComponent` 所期望的：

<code-example path="property-binding/src/app/app.component.ts" region="parent-data-type" header="src/app/app.component.ts"></code-example>

#### 傳入物件

前面的簡單範例示範了傳入字串。要傳入物件，
語法與思路都相同。

在這個情境中，`ItemListComponent` 巢狀於 `AppComponent` 之內，`items` 屬性期望一個物件陣列。

<code-example path="property-binding/src/app/app.component.html" region="pass-object" header="src/app/app.component.html"></code-example>

`items` 屬性在 `ItemListComponent` 中宣告，型別為 `Item`，並以 `@Input()` 裝飾：

<code-example path="property-binding/src/app/item-list/item-list.component.ts" region="item-input" header="src/app/item-list.component.ts"></code-example>

在這個範例應用程式中，`Item` 是一個具有兩個屬性的物件：`id` 與 `name`。

<code-example path="property-binding/src/app/item.ts" region="item-class" header="src/app/item.ts"></code-example>

雖然項目清單存在於另一個檔案 `mock-items.ts` 中，你可以
在 `app.component.ts` 中指定不同的項目，讓新項目被渲染：

<code-example path="property-binding/src/app/app.component.ts" region="pass-object" header="src/app.component.ts"></code-example>

在這個情況下，你只需要確保你提供的是物件陣列，因為這是 `Item` 的型別，也是巢狀元件 `ItemListComponent` 所期望的。

在這個範例中，`AppComponent` 指定了一個不同的 `item` 物件
（`currentItems`）並將它傳給巢狀的 `ItemListComponent`。`ItemListComponent` 能夠使用 `currentItems`，因為它符合 `item.ts` 中對 `Item` 物件的定義。`item.ts` 檔案就是
`ItemListComponent` 取得其 `item` 定義的地方。

### 記住括號

括號 `[]` 告訴 Angular 要對範本運算式求值。
如果你省略括號，Angular 會將字串視為常數
並以該字串*初始化目標屬性*：

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>

省略括號會算繪出字串 `parentItem`，而不是 `parentItem` 的值。

### 一次性字串初始化

當下列所有條件都成立時，你*應該*省略括號：

* 目標屬性接受字串值。
* 該字串是可直接放入範本的固定值。
* 這個初始值永遠不會變更。

你在標準 HTML 中經常以這種方式初始化屬性，它對於指令與元件屬性
初始化同樣有效。
下列範例將 `StringInitComponent` 的 `prefix` 屬性初始化為一個固定字串，
而非範本運算式。Angular 設定後就不會再管它。

<code-example path="property-binding/src/app/app.component.html" region="string-init" header="src/app/app.component.html"></code-example>

另一方面，`[item]` 繫結仍然是對元件 `currentItems` 屬性的即時繫結。

### 屬性繫結與插值的比較

你經常可以在插值與屬性繫結之間做選擇。
下列繫結組做的事相同：

<code-example path="property-binding/src/app/app.component.html" region="property-binding-interpolation" header="src/app/app.component.html"></code-example>

在許多情況下，插值是屬性繫結的方便替代方案。
將資料值渲染為字串時，
沒有技術上的理由偏好某一種形式，雖然可讀性
往往較偏好插值。然而，*當要將元素
屬性設定為非字串的資料值時，你必須使用屬性繫結*。

### 內容安全

想像下列惡意內容。

<code-example path="property-binding/src/app/app.component.ts" region="malicious-content" header="src/app/app.component.ts"></code-example>

在元件範本中，該內容可能會與插值一起使用：

<code-example path="property-binding/src/app/app.component.html" region="malicious-interpolated" header="src/app/app.component.html"></code-example>

幸好，Angular 資料繫結會警戒危險的 HTML。在上述情況中，
HTML 會原樣顯示，Javascript 不會執行。Angular **不**
允許帶有 script 標籤的 HTML 洩漏到瀏覽器中，無論是透過插值
還是屬性繫結。

然而，在下列範例中，Angular 會在顯示值之前先加以[清理](guide/security#清理與安全性上下文)。

<code-example path="property-binding/src/app/app.component.html" region="malicious-content" header="src/app/app.component.html"></code-example>

文字插值處理 `<script>` 標籤的方式與屬性繫結不同，但兩種方式算繪出的內容都是無害的。
以下是 `evilTitle` 範例的瀏覽器輸出。

<code-example language="bash">
"Template <script>alert("evil never sleeps")</script> Syntax" is the interpolated evil title.
"Template alert("evil never sleeps")Syntax" is the property bound evil title.
</code-example>

<hr/>
{@a other-bindings}

## 屬性、類別與樣式繫結

範本語法為較不適合屬性繫結的情境，提供了專門的單向繫結。

若要在運作中的應用程式中查看屬性、類別與樣式繫結，請參閱 <live-example name="attribute-binding"></live-example>，尤其是本節。

<a id="屬性繫結attribute-binding"></a>
### 屬性繫結（attribute binding）

使用**屬性繫結（attribute binding）**直接設定屬性的值。這是「繫結設定的是目標屬性」這條規則的唯一例外，也是唯一會建立並設定屬性的繫結。

通常，使用[屬性繫結](guide/template-syntax#property-binding)設定元素屬性，
比使用字串設定屬性更可取。然而，有時
沒有可繫結的元素屬性，這時屬性繫結就是解決方案。

以 [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) 與
[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) 為例。它們純粹是屬性，不對應到元素屬性，也不會設定元素屬性。在這些情況下，沒有可繫結的屬性目標。

屬性繫結語法與屬性繫結相似，但
不是在括號中放元素屬性，而是以 `attr` 前綴開頭，
後接一個點（`.`），再接屬性名稱。
接著你設定屬性值，使用會解析為字串的運算式，
或者當運算式解析為 `null` 時移除該屬性。

attribute 繫結的主要使用案例之一
就是設定 ARIA attribute，如下列範例所示：

<code-example path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

#### `colspan` 與 `colSpan`

請注意 `colspan` 屬性與 `colSpan` 屬性（property）之間的差異。

如果你這樣寫：

<code-example language="html">
  &lt;tr&gt;&lt;td colspan="{{1 + 1}}"&gt;Three-Four&lt;/td&gt;&lt;/tr&gt;
</code-example>

你會得到這個錯誤：

<code-example language="bash">
  Template parse errors:
  Can't bind to 'colspan' since it isn't a known native property
</code-example>

正如訊息所說，`<td>` 元素沒有 `colspan` 屬性。這是因為
`colspan` 是 attribute&mdash;`colSpan`（`S` 為大寫）才是
對應的屬性。文字插值與屬性繫結只能設定*屬性*，不能設定 attribute。

相反地，你會使用屬性繫結，像這樣寫：

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

</div>

<hr/>

### 類別繫結

以下是在純 HTML 中不使用繫結設定 `class` 屬性的方式：

```html
<!-- standard class attribute setting -->
<div class="foo bar">Some text</div>
```

你也可以使用**類別繫結**，從元素的 `class` 屬性新增與移除 CSS 類別名稱。

若要建立單一類別繫結，以 `class` 前綴開頭，後接一個點（`.`）與 CSS 類別名稱（例如 `[class.foo]="hasFoo"`）。 
當繫結運算式為 truthy 時，Angular 會加入該類別；當運算式為 falsy 時，則會移除該類別（`undefined` 為例外，請參閱[委派給樣式](#styling-delegation)）。

若要建立對多個類別的繫結，使用不帶點的通用 `[class]` 繫結（例如 `[class]="classExpr"`）。
該運算式可以是以空白分隔的類別名稱字串，或者你可以將它格式化為物件，以類別名稱為鍵、truthy/falsy 運算式為值。 
使用物件格式時，Angular 只會在相關聯的值為 truthy 時才加入類別。 

需要注意的是，對於任何物件類型的運算式（`object`、`Array`、`Map`、`Set` 等），物件的同一性必須改變，類別清單才會更新。
在不改變物件同一性的情況下更新屬性將不會有任何效果。

如果有多個繫結指向同一個類別名稱，衝突會使用[樣式優先順序](#styling-precedence)來解決。

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="15%">
  </col>
  <col width="20%">
  </col>
  <col width="35%">
  </col>
  <col width="30%">
  </col>
  <tr>
    <th>
      繫結類型
    </th>
    <th>
      語法
    </th>
    <th>
      輸入類型
    </th>
    <th>
      輸入值範例
    </th>
  </tr>
  <tr>
    <td>單一類別繫結</td>
    <td><code>[class.foo]="hasFoo"</code></td>
    <td><code>boolean | undefined | null</code></td>
    <td><code>true</code>, <code>false</code></td>
  </tr>
  <tr>
    <td rowspan=3>多類別繫結</td>
    <td rowspan=3><code>[class]="classExpr"</code></td>
    <td><code>string</code></td>
    <td><code>"my-class-1 my-class-2 my-class-3"</code></td>
  </tr>
  <tr>
    <td><code>{[key: string]: boolean | undefined | null}</code></td>
    <td><code>{foo: true, bar: false}</code></td>
  </tr>
  <tr>
    <td><code>Array</code><<code>string</code>></td>
    <td><code>['foo', 'bar']</code></td>
  </tr>
</table>

[NgClass](#ngclass) 指令可以作為直接 `[class]` 繫結的替代方案。 
然而，由於 Angular 的類別繫結已有所改進，`NgClass` 不再提供顯著的價值，未來可能最終會被移除，因此較建議使用上述不搭配 `NgClass` 的類別繫結語法。

<hr/>

### 樣式繫結

以下是在純 HTML 中不使用繫結設定 `style` 屬性的方式：

```html
<!-- standard style attribute setting -->
<div style="color: blue">Some text</div>
```

你也可以使用**樣式繫結**動態設定樣式。

若要建立單一樣式繫結，以 `style` 前綴開頭，後接一個點（`.`）與 CSS 樣式屬性名稱（例如 `[style.width]="width"`）。 
該屬性將被設定為繫結運算式的值，該值通常是字串。
你也可以選擇性地加上單位後綴，例如 `em` 或 `%`，這需要數字型別。

<div class="alert is-helpful">

請注意，_樣式屬性_名稱可以以下列任一形式撰寫
[dash-case](guide/glossary#dash-case)，如上所示，或
[camelCase](guide/glossary#camelcase)，例如 `fontSize`。

</div>

如果你有多個想要切換的樣式，你可以直接繫結到 `[style]` 屬性而不用加點（例如 `[style]="styleExpr"`）。
附加到 `[style]` 繫結的運算式最常是像 `"width: 100px; height: 100px;"` 這樣的樣式字串清單。 

你也可以將運算式格式化為物件，以樣式名稱為鍵、樣式值為值，例如 `{width: '100px', height: '100px'}`。 
需要注意的是，對於任何物件類型的運算式（`object`、`Array`、`Map`、`Set` 等），物件的同一性必須改變，類別清單才會更新。
在不改變物件同一性的情況下更新屬性將不會有任何效果。

如果有多個繫結指向同一個樣式屬性，衝突會使用[樣式優先順序規則](#styling-precedence)來解決。

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="15%">
  </col>
  <col width="20%">
  </col>
  <col width="35%">
  </col>
  <col width="30%">
  </col>
  <tr>
    <th>
      繫結類型
    </th>
    <th>
      語法
    </th>
    <th>
      輸入類型
    </th>
    <th>
      輸入值範例
    </th>
  </tr>
  <tr>
    <td>單一樣式繫結</td>
    <td><code>[style.width]="width"</code></td>
    <td><code>string | undefined | null</code></td>
    <td><code>"100px"</code></td>
  </tr>
  <tr>
  <tr>
    <td>單一樣式繫結（附單位）</td>
    <td><code>[style.width.px]="width"</code></td>
    <td><code>number | undefined | null</code></td>
    <td><code>100</code></td>
  </tr>
    <tr>
    <td rowspan=3>多樣式繫結</td>
    <td rowspan=3><code>[style]="styleExpr"</code></td>
    <td><code>string</code></td>
    <td><code>"width: 100px; height: 100px"</code></td>
  </tr>
  <tr>
    <td><code>{[key: string]: string | undefined | null}</code></td>
    <td><code>{width: '100px', height: '100px'}</code></td>
  </tr>
  <tr>
    <td><code>Array</code><<code>string</code>></td>
    <td><code>['width', '100px']</code></td>
  </tr>
</table>

[NgStyle](#ngstyle) 指令可以作為直接 `[style]` 繫結的替代方案。 
然而，由於 Angular 的樣式繫結已有所改進，`NgStyle` 不再提供顯著的價值，未來可能最終會被移除，因此較建議使用上述不搭配 `NgStyle` 的樣式繫結語法。

<hr/>

{@a styling-precedence}
### 樣式優先順序

單一 HTML 元素的 CSS 類別清單與樣式值可以繫結到多個來源（例如，來自多個指令的宿主繫結）。

當有多個繫結指向同一個類別名稱或樣式屬性時，Angular 會使用一組優先順序規則來解決衝突，並決定最終將哪些類別或樣式套用到元素上。

<div class="alert is-helpful">
<h4>樣式優先順序（由高至低）</h4>

1. 範本繫結
    1. 屬性繫結（例如 `<div [class.foo]="hasFoo">` 或 `<div [style.color]="color">`）
    1. 對應表繫結（例如 `<div [class]="classExpr">` 或 `<div [style]="styleExpr">`）
    1. 靜態值（例如 `<div class="foo">` 或 `<div style="color: blue">`） 
1. 指令宿主繫結
    1. 屬性繫結（例如 `host: {'[class.foo]': 'hasFoo'}` 或 `host: {'[style.color]': 'color'}`）
    1. 對應表繫結（例如 `host: {'[class]': 'classExpr'}` 或 `host: {'[style]': 'styleExpr'}`）
    1. 靜態值（例如 `host: {'class': 'foo'}` 或 `host: {'style': 'color: blue'}`）    
1. 元件宿主繫結
    1. 屬性繫結（例如 `host: {'[class.foo]': 'hasFoo'}` 或 `host: {'[style.color]': 'color'}`）
    1. 對應表繫結（例如 `host: {'[class]': 'classExpr'}` 或 `host: {'[style]': 'styleExpr'}`）
    1. 靜態值（例如 `host: {'class': 'foo'}` 或 `host: {'style': 'color: blue'}`）    

</div>

類別或樣式繫結越具體，其優先順序越高。

對特定類別的繫結（例如 `[class.foo]`）將優先於通用的 `[class]` 繫結，而對特定樣式的繫結（例如 `[style.bar]`）將優先於通用的 `[style]` 繫結。

<code-example path="attribute-binding/src/app/app.component.html" region="basic-specificity" header="src/app/app.component.html"></code-example>

當繫結來自不同來源時，具體性規則同樣適用。 
一個元素可能同時在它被宣告的範本中有繫結、來自相符指令的宿主繫結，以及來自相符元件的宿主繫結。

範本繫結最為具體，因為它們直接且專門套用在該元素上，因此具有最高優先順序。

指令宿主繫結被認為較不具體，因為指令可以在多個位置使用，因此其優先順序低於範本繫結。

指令通常用於增益元件行為，因此來自元件的宿主繫結具有最低優先順序。 

<code-example path="attribute-binding/src/app/app.component.html" region="source-specificity" header="src/app/app.component.html"></code-example>

此外，繫結優先於靜態屬性。 

在下列情況中，`class` 與 `[class]` 具有相近的具體性，但 `[class]` 繫結將優先，因為它是動態的。

<code-example path="attribute-binding/src/app/app.component.html" region="dynamic-priority" header="src/app/app.component.html"></code-example>

{@a styling-delegation}
### 委派給優先順序較低的樣式

優先順序較高的樣式可以使用 `undefined` 值，「委派」給優先順序較低的樣式。
將樣式屬性設定為 `null` 可確保該樣式被移除，而將它設定為 `undefined` 則會讓 Angular 退回到該樣式次高優先順序的繫結。

舉例來說，請看下列範本：

<code-example path="attribute-binding/src/app/app.component.html" region="style-delegation" header="src/app/app.component.html"></code-example>

假設 `dirWithHostBinding` 指令與 `comp-with-host-binding` 元件都有一個 `[style.width]` 主元素繫結。
在這種情況下，如果 `dirWithHostBinding` 將其繫結設定為 `undefined`，`width` 屬性將退回到 `comp-with-host-binding` 宿主繫結的值。
然而，如果 `dirWithHostBinding` 將其繫結設定為 `null`，`width` 屬性將被完全移除。

{@a event-binding}

## 事件繫結 `(event)`

事件繫結讓你可以監聽某些事件，例如
按鍵、滑鼠移動、點選與觸控。若要查看
示範本節所有要點的範例，請參閱 <live-example name="event-binding">事件繫結範例</live-example>。

Angular 事件繫結語法由一個**目標事件**名稱組成，
位於等號左側的括號中，以及右側引號內的
範本陳述式。
下列事件繫結監聽按鈕的 click 事件，每當發生點選時就呼叫
元件的 `onSave()` 方法：

<a id="custom-events-with-eventemitter"></a>

### 目標事件

如上所示，目標是按鈕的 click 事件。

<code-example path="event-binding/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html"></code-example>

或者，使用 `on-` 前綴，也就是所謂的標準形式：

<code-example path="event-binding/src/app/app.component.html" region="event-binding-2" header="src/app/app.component.html"></code-example>

元素事件可能是較常見的目標，但 Angular 會先查看該名稱是否與已知指令的事件屬性相符，
如下列範例所示：

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

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

<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html"></code-example>

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

<code-example path="event-binding/src/app/item-detail/item-detail.component.html" header="src/app/item-detail/item-detail.component.html (template)" region="line-through"></code-example>

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest"></code-example>

這個元件定義了一個會回傳 `EventEmitter` 的 `deleteRequest` 屬性。
當使用者點選 *delete* 時，元件會呼叫 `delete()` 方法，讓 `EventEmitter` 發出一個 `Item` 物件。

現在想像一個宿主父元件，它繫結到 `ItemDetailComponent` 的 `deleteRequest` 事件。

<code-example path="event-binding/src/app/app.component.html" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component"></code-example>

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

## 雙向繫結 `[(...)]`

雙向繫結讓你的應用程式能在元件類別與其範本之間共用資料。

本節語法與程式碼片段的示範，請參閱 <live-example name="two-way-binding">雙向繫結範例</live-example>。

### 雙向繫結基礎

雙向繫結做兩件事：

1. 設定特定的元素屬性。
1. 監聽元素變更事件。

Angular 為此提供了一個特殊的 _雙向資料繫結_ 語法 `[()]`。
`[()]` 語法結合了屬性繫結的括號
`[]` 與事件繫結的括號 `()`。

<div class="callout is-important">

<header>
  [( )] = banana in a box
</header>

想像 *banana in a box*（盒子裡的香蕉）這個畫面，記住括號要放在方括號 _裡面_。

</div>

當元素有一個可設定的
屬性 `x`，以及一個對應的事件 `xChange` 時，`[()]` 語法就很容易示範。
以下是一個符合這個模式的 `SizerComponent`。
它有一個 `size` 值屬性與一個相伴的 `sizeChange` 事件：

<code-example path="two-way-binding/src/app/sizer/sizer.component.ts" header="src/app/sizer.component.ts"></code-example>

<code-example path="two-way-binding/src/app/sizer/sizer.component.html" header="src/app/sizer.component.html"></code-example>

初始的 `size` 是來自屬性繫結的輸入值。
點選按鈕會增大或減小 `size`，在
最小/最大值限制內，
然後以調整後的大小引發（即發出）`sizeChange` 事件。

以下範例中，`AppComponent.fontSizePx` 與 `SizerComponent` 進行雙向繫結：

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-1)" region="two-way-1"></code-example>

`AppComponent.fontSizePx` 建立了 `SizerComponent.size` 的初始值。

<code-example path="two-way-binding/src/app/app.component.ts" header="src/app/app.component.ts" region="font-size"></code-example>

點選按鈕會透過雙向繫結更新 `AppComponent.fontSizePx`。
更新後的 `AppComponent.fontSizePx` 值會流向 _樣式_ 繫結，
讓顯示的文字變大或變小。

雙向繫結語法其實只是 _屬性_ 繫結與 _事件_ 繫結的語法糖。
Angular 將 `SizerComponent` 繫結去糖化後如下：

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-2)" region="two-way-2"></code-example>

`$event` 變數包含 `SizerComponent.sizeChange` 事件的資料。
當使用者點選按鈕時，Angular 會把 `$event` 值指派給 `AppComponent.fontSizePx`。

### 表單中的雙向繫結

相較於分開的屬性繫結與事件繫結，雙向繫結語法
方便得多。對 HTML 表單元素（例如 `<input>` 與
`<select>`）使用雙向繫結也會很方便。然而，沒有原生 HTML 元素遵循 `x`
值與 `xChange` 事件模式。

若要深入了解如何在表單中使用雙向繫結，請參閱
Angular [NgModel](guide/template-syntax#ngModel)。

<hr/>

{@a directives}

## 內建指令

Angular 提供兩種內建指令：屬性
指令與結構指令。本段回顧一些最常見的內建指令，
分類為[_屬性_指令](guide/template-syntax#attribute-directives)或[_結構_指令](guide/template-syntax#structural-directives)，並有其專屬的 <live-example name="built-in-directives">內建指令範例</live-example>。

關於如何建立自己的自訂指令的資訊，請參閱[屬性指令](guide/attribute-directives)與[結構指令](guide/structural-directives)。

<hr/>

{@a attribute-directives}

### 內建屬性指令

屬性指令會監聽並修改其他 HTML 元素、屬性、性質與元件的行為。
你通常會把它們像 HTML attribute 一樣套用到元素上，因此得名。

許多 NgModule，例如 [`RouterModule`](guide/router "Routing and Navigation") 與 [`FormsModule`](guide/forms "Forms")，都定義了自己的屬性指令。
最常見的屬性指令如下：

* [`NgClass`](guide/template-syntax#ngClass)&mdash;新增與移除一組 CSS 類別。
* [`NgStyle`](guide/template-syntax#ngStyle)&mdash;新增與移除一組 HTML 樣式。
* [`NgModel`](guide/template-syntax#ngModel)&mdash;為 HTML 表單元素加入雙向資料繫結。

<hr/>

{@a ngClass}

### `NgClass`

使用 `ngClass` 一次新增或移除多個 CSS 類別。

<code-example path="built-in-directives/src/app/app.component.html" region="special-div" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

若要新增或移除*單一*類別，請使用[類別繫結](guide/template-syntax#類別繫結)，而不是 `NgClass`。

</div>

考慮一個 `setCurrentClasses()` 元件方法，它會設定元件屬性
`currentClasses`，其值是一個物件，會根據另外三個元件屬性的
`true`/`false` 狀態新增或移除三個類別。物件的每個鍵都是一個 CSS 類別名稱；其值為 `true` 表示應加入該類別，
`false` 表示應移除。

<code-example path="built-in-directives/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts"></code-example>

把 `ngClass` 屬性繫結加入 `currentClasses`，即可相應地設定元素的類別：

<code-example path="built-in-directives/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

請記住，在這種情況下，你會呼叫 `setCurrentClasses()`，
包括初始時，以及相依屬性變更時。

</div>

<hr/>

{@a ngStyle}

### `NgStyle`

使用 `NgStyle`，根據元件的狀態一次動態地設定多個行內樣式。

#### 不使用 `NgStyle`

作為背景脈絡，請考慮在不使用 `NgStyle` 的情況下，以[樣式繫結](guide/template-syntax#樣式繫結)設定*單一*樣式值。

<code-example path="built-in-directives/src/app/app.component.html" region="without-ng-style" header="src/app/app.component.html"></code-example>

不過，若要同時設定*多個*行內樣式，請使用 `NgStyle` 指令。

以下是 `setCurrentStyles()` 方法，它會設定元件
屬性 `currentStyles`，其值是一個物件，會根據另外三個元件屬性的狀態定義三種樣式：

<code-example path="built-in-directives/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts"></code-example>

把 `ngStyle` 屬性繫結加入 `currentStyles`，即可相應地設定元素的樣式：

<code-example path="built-in-directives/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

請記得呼叫 `setCurrentStyles()`，包括初始時，以及相依屬性變更時。

</div>

<hr/>

{@a ngModel}

### `[(ngModel)]`：雙向繫結

`NgModel` 指令可讓你顯示資料屬性，並在使用者變更時更新該屬性。範例如下：

<code-example path="built-in-directives/src/app/app.component.html" header="src/app/app.component.html (NgModel example)" region="NgModel-1"></code-example>

#### 匯入 `FormsModule` 以使用 `ngModel`

在雙向資料繫結中使用 `ngModel` 指令之前，
你必須匯入 `FormsModule` 並把它加入 NgModule 的 `imports` 清單。
如需 `FormsModule` 與 `ngModel` 的更多資訊，請參閱[表單](guide/forms#ngModel)。

請記得匯入 `FormsModule`，讓 `[(ngModel)]` 可以如下使用：

<code-example path="built-in-directives/src/app/app.module.ts" header="src/app/app.module.ts (FormsModule import)" region="import-forms-module"></code-example>

你也可以分別繫結 `<input>` 元素的 `value` 屬性與 `input` 事件，達到相同的結果：

<code-example path="built-in-directives/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html"></code-example>

為了簡化語法，`ngModel` 指令把細節隱藏在它自己的 `ngModel` 輸入與 `ngModelChange` 輸出屬性背後：

<code-example path="built-in-directives/src/app/app.component.html" region="NgModelChange" header="src/app/app.component.html"></code-example>

`ngModel` 資料屬性會設定元素的值屬性，而 `ngModelChange` 事件屬性
會監聽元素值的變更。

#### `NgModel` 與值存取器

這些細節因元素種類而異，因此 `NgModel` 指令只適用於受到 [ControlValueAccessor](api/forms/ControlValueAccessor) 支援的元素，該存取器會把元素適配到此協定。
Angular 為所有基本 HTML 表單元素提供了*值存取器*，而
[表單](guide/forms)指南示範了如何繫結到這些元素。

在你撰寫合適的值存取器之前，你無法把 `[(ngModel)]` 套用到非表單的原生元素或
第三方自訂元件。如需更多資訊，請參閱
[DefaultValueAccessor](api/forms/DefaultValueAccessor) 的 API 文件。

對於你自行撰寫的 Angular 元件，你不需要值存取器，因為你可以命名值與事件屬性，
以符合 Angular 基本的[雙向繫結語法](guide/template-syntax#two-way)，並完全略過 `NgModel`。
[雙向繫結](guide/template-syntax#two-way)一節中的 `sizer` 就是這種技巧的範例。

把 `ngModel` 分開繫結，比繫結到元素的原生屬性有所改進，但你可以用單一宣告以 `[(ngModel)]` 語法進一步簡化繫結：

<code-example path="built-in-directives/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html"></code-example>

這個 `[(ngModel)]` 語法只能*設定*資料繫結的屬性。
如果你需要做更多事，可以撰寫展開形式；
例如，下列程式碼會把 `<input>` 的值改為大寫：

<code-example path="built-in-directives/src/app/app.component.html" region="uppercase" header="src/app/app.component.html"></code-example>

以下是所有變化形式的實際運作，包括大寫版本：

<div class="lightbox">
  <img src='generated/images/guide/built-in-directives/ng-model-anim.gif' alt="NgModel 變化">
</div>

<hr/>

{@a structural-directives}

## 內建 _結構_ 指令

結構指令負責 HTML 版面配置。
它們塑造或重塑 DOM 的結構，通常是透過新增、移除與操作它們所附加的宿主元素來達成。

本節介紹最常見的內建結構指令：

* [`NgIf`](guide/template-syntax#ngIf)&mdash;依條件從範本建立或銷毀子檢視。
* [`NgFor`](guide/template-syntax#ngFor)&mdash;為清單中的每個項目重複一個節點。
* [`NgSwitch`](guide/template-syntax#ngSwitch)&mdash;一組在替代檢視之間切換的指令。

<div class="alert is-helpful">

結構指令的深入細節在
[結構指令](guide/structural-directives)指南中有涵蓋，
該指南說明了下列內容：

* 為什麼要[在指令名稱前加上星號（\*）前綴](guide/structural-directives#星號前綴)。
* 當指令沒有合適的宿主元素時，使用 [`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>")
來群組元素。
* 如何撰寫你自己的結構指令。
* 為什麼你[只能對一個元素套用一個結構指令](guide/structural-directives#one-per-element "one per host element")。

</div>

<hr/>

{@a ngIf}

### NgIf

把 `NgIf` 指令套用到
宿主元素，即可從 DOM 新增或移除元素。
把指令繫結到像本範例中 `isActive` 這樣的條件運算式。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

別忘了 `ngIf` 前面的星號（`*`）。如需星號的更多資訊，請參閱[結構指令](guide/structural-directives)中的[星號（*）前綴](guide/structural-directives#星號前綴)一節。

</div>

當 `isActive` 運算式傳回真值時，`NgIf` 會把 `ItemDetailComponent` 加入 DOM。
當運算式為假值時，`NgIf` 會把 `ItemDetailComponent` 從 DOM 移除，並棄置該元件及其所有子元件。

#### 顯示/隱藏與 `NgIf` 的比較

隱藏元素與使用 `NgIf` 移除元素不同。
作為比較，下列範例示範如何控制
元素的可見性，使用
[類別](guide/template-syntax#類別繫結)或[樣式](guide/template-syntax#樣式繫結)繫結。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html"></code-example>

當你隱藏一個元素時，該元素及其所有後代都會留在 DOM 中。
這些元素的元件全都留在記憶體中，
Angular 可能會繼續檢查變更。
你可能會不必要地握有大量運算資源並降低效能。

`NgIf` 的運作方式不同。當 `NgIf` 為 `false` 時，Angular 會把元素及其後代從 DOM 移除。
它會棄置它們的元件，釋放資源，
從而帶來更好的使用者體驗。

如果你要隱藏大型元件樹，請考慮以 `NgIf` 作為比顯示/隱藏更有效率的替代方案。

<div class="alert is-helpful">

如需 `NgIf` 與 `ngIfElse` 的更多資訊，請參閱 [NgIf API 文件](api/common/NgIf)。

</div>

#### 防範 null

`ngIf` 的另一個優點是可以用來防範 null。顯示/隱藏
最適合非常簡單的使用情境，所以當你需要防護時，改用 `ngIf`。如果巢狀運算式嘗試存取 `null` 的屬性，Angular 會擲出錯誤。

下列範例示範 `NgIf` 如何防護兩個 `<div>`。
只有存在 `currentCustomer` 時，才會出現 `currentCustomer` 名稱。
只要 `nullCustomer` 是 `null`，就不會顯示它。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html"></code-example>

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2b" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

另請參閱
[安全導覽運算子](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)")，見下文。

</div>
<hr/>

{@a ngFor}
### `NgFor`

`NgFor` 是一個重複器指令&mdash;一種呈現項目清單的方式。
你定義一段 HTML，說明單一項目應如何顯示，
然後告訴 Angular 把該段落當作範本，用來算繪清單中的每個項目。
指派給 `*ngFor` 的文字是指導重複器流程的指令。

下列範例示範將 `NgFor` 套用到簡單的 `<div>`。（別忘了 `ngFor` 前面的星號（`*`）。）

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

別忘了 `ngFor` 前面的星號（`*`）。如需星號的更多資訊，請參閱[結構指令](guide/structural-directives)中的[星號（*）前綴](guide/structural-directives#星號前綴)一節。

</div>

你也可以把 `NgFor` 套用到元件元素，如下列範例所示。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html"></code-example>

{@a microsyntax}

<div class="callout is-critical">
<header>*ngFor 簡寫</header>

指派給 `*ngFor` 的字串不是[範本運算式](guide/template-syntax#範本運算式)。相反地，
它是一種*簡寫*&mdash;一種由 Angular 自行解讀的小型語言。
字串 `"let item of items"` 的意思是：

> *取出 `items` 陣列中的每個項目，把它存入區域 `item` 迴圈變數，並讓它在每次迭代時可供範本 HTML 使用。*

Angular 會把這個指令轉譯為宿主元素周圍的 `<ng-template>`，
再重複使用這個範本，為清單中的每個 `item` 建立一組新的元素與繫結。
如需簡寫的更多資訊，請參閱[結構指令](guide/structural-directives#microsyntax)指南。

</div>

{@a template-input-variable}

{@a template-input-variables}

#### 範本輸入變數

`item` 前面的 `let` 關鍵字會建立一個名為 `item` 的範本輸入變數。
`ngFor` 指令會迭代父元件 `items` 屬性傳回的 `items` 陣列，
並在每次迭代時把 `item` 設為陣列中的目前項目。

在 `ngFor` 宿主元素內
以及其後代內參照 `item`，即可存取該項目的屬性。
下列範例先在插值中參照 `item`，
再把繫結傳入 `<app-item-detail>` 元件的 `item` 屬性。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html"></code-example>

如需範本輸入變數的更多資訊，請參閱
[結構指令](guide/structural-directives#template-input-variable)。

#### 搭配 `index` 的 `*ngFor`

`NgFor` 指令內容的 `index` 屬性
會傳回每次迭代中項目的零基索引。
你可以把 `index` 擷取到範本輸入變數中，並在範本中使用它。

下一個範例把 `index` 擷取到名為 `i` 的變數中，並把它與項目名稱一起顯示。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`NgFor` 由 `NgForOf` 指令實作。如需其他 `NgForOf` 內容值（例如 `last`、`even`
與 `odd`）的更多資訊，請參閱 [NgForOf API 參考](api/common/NgForOf)。

</div>

{@a trackBy}
#### 搭配 `trackBy` 的 *ngFor

如果你把 `NgFor` 用在大型清單上，對單一項目的小變更（例如移除或新增一個項目）可能觸發一連串 DOM 操作。例如，重新向伺服器查詢可能把清單重設為全新的項目物件，即使那些項目先前已經顯示過。在這種情況下，Angular 只看到一份全新的物件參照清單，只能把舊的 DOM 元素全部換成新的 DOM 元素。

你可以透過 `trackBy` 讓這件事更有效率。
在元件中加入一個方法，傳回 `NgFor` 應該追蹤的值。
在本例中，該值是英雄的 `id`。如果該 `id` 已經算繪過，
Angular 會持續追蹤它，不會為了相同的 `id` 再次向伺服器查詢。

<code-example path="built-in-directives/src/app/app.component.ts" region="trackByItems" header="src/app/app.component.ts"></code-example>

在簡寫運算式中，把 `trackBy` 設為 `trackByItems()` 方法。

<code-example path="built-in-directives/src/app/app.component.html" region="trackBy" header="src/app/app.component.html"></code-example>

以下是 `trackBy` 效果的圖示。
"Reset items" 會建立具有相同 `item.id` 的新項目。
"Change ids" 會建立具有新 `item.id` 的新項目。

* 沒有 `trackBy` 時，兩個按鈕都會觸發完整的 DOM 元素取代。
* 使用 `trackBy` 時，只有變更 `id` 才會觸發元素取代。

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngfor-trackby.gif" alt="trackBy 動畫">
</div>

<div class="alert is-helpful">

內建指令只使用公開 API。
它們並未擁有其他指令無法存取的任何私有 API 的特殊存取權。

</div>

<hr/>

{@a ngSwitch}
## `NgSwitch` 指令

NgSwitch 就像 JavaScript 的 `switch` 陳述式。
它會根據切換條件，從數個可能的元素中顯示一個元素。
Angular 只會把選取的元素放入 DOM。

<!-- API Flagged -->

`NgSwitch` 實際上是一組三個協作的指令：
`NgSwitch`、`NgSwitchCase` 與 `NgSwitchDefault`，如下列範例所示。

 <code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html"></code-example>

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngswitch.gif" alt="NgSwitch 動畫">
</div>

`NgSwitch` 是控制器指令。把它繫結到一個傳回
*切換值*的運算式，例如 `feature`。雖然本範例中的 `feature` 值是
字串，但切換值可以是任何型別。

**繫結到 `[ngSwitch]`**。如果你嘗試設定 `*ngSwitch`，會得到錯誤，因為
`NgSwitch` 是*屬性*指令，不是*結構*指令。
它不直接碰觸 DOM，而是改變其同伴指令的行為。

**繫結到 `*ngSwitchCase` 與 `*ngSwitchDefault`**。
`NgSwitchCase` 與 `NgSwitchDefault` 指令是*結構*指令
，因為它們會從 DOM 新增或移除元素。

* `NgSwitchCase` 會在其繫結值等於切換值時，把它的元素加入 DOM；不等於切換值時，則移除其元素。

* `NgSwitchDefault` 會在沒有選取的 `NgSwitchCase` 時，把它的元素加入 DOM。

切換指令特別適合用來新增與移除*元件元素*。
本範例在 `item-switch.components.ts` 檔案中定義的四個 `item` 元件之間切換。
每個元件都有一個 `item` [輸入屬性](guide/template-syntax#inputs-outputs "Input property")
，它繫結到父元件的 `currentItem`。

切換指令也可以搭配原生元素與 Web 元件使用。
例如，你可以把 `<app-best-item>` 切換案例換成下列寫法。

<code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html"></code-example>

<hr/>

{@a template-reference-variable}

{@a template-reference-variables--var-}

{@a ref-vars}

{@a ref-var}

## 範本參照變數（`#var`）

**範本參照變數**通常是對範本中某個 DOM 元素的參照。
它也可以參照指令（其中包含元件）、元素、[TemplateRef](api/core/TemplateRef)，或 <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web component</a>。

本節語法與程式碼片段的示範，請參閱 <live-example name="template-reference-variables">範本參照變數範例</live-example>。

使用井號（#）來宣告參照變數。
下列參照變數 `#phone` 在 `<input>` 元素上宣告了一個 `phone` 變數。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

你可以在元件範本中的任何地方參照範本參照變數。
在這裡，範本下方的一個 `<button>` 參照了 `phone` 變數。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

<h3 class="no-toc">參照變數如何取得其值</h3>

在大多數情況下，Angular 會將參照變數的值設為宣告它的那個元素。
在前面的範例中，`phone` 參照的是電話號碼 `<input>`。
按鈕的 click 處理常式會把 `<input>` 值傳給元件的 `callPhone()` 方法。

`NgForm` 指令可以改變該行為，將值設定為其他東西。在下列範例中，範本參照變數 `itemForm` 出現三次，被 HTML
分隔。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

itemForm 的參照值，如果沒有 ngForm 屬性值，將會是
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)。
然而，Component 與 Directive 之間有一個差異：`Component`
在不指定屬性值的情況下會被參照，而 `Directive` 則不會
改變隱含的參照（也就是元素）。

有了 `NgForm`，`itemForm` 就是對 [NgForm](api/forms/NgForm "API: NgForm") 指令的參照，能夠追蹤表單中每個控制項的值與有效性。

原生 `<form>` 元素沒有 `form` 屬性，但 `NgForm` 指令有，這使得在 `itemForm.form.valid` 無效時可以停用提交按鈕，
並將整個表單控制項樹
傳遞給父元件的 `onSubmit()` 方法。

<h3 class="no-toc">範本參照變數注意事項</h3>

範本_參照_變數（`#phone`）與範本_輸入_變數（`let phone`）不同，例如 [`*ngFor`](guide/template-syntax#template-input-variable) 中的那種。
更多資訊請參閱[_結構指令_](guide/structural-directives#template-input-variable)。

參照變數的作用域是整個範本。因此，不要在同一個範本中多次定義相同的變數名稱，否則執行期值將無法預測。

#### 替代語法

你可以使用 `ref-` 前綴作為 `#` 的替代。
這個範例將 `fax` 變數宣告為 `ref-fax`，而不是 `#fax`。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html"></code-example>

<hr/>

{@a inputs-outputs}

<a id="input-and-output-properties"></a>

## `@Input()` 與 `@Output()` 屬性

`@Input()` 與 `@Output()` 讓 Angular 能在父脈絡與子指令或子元件之間共享資料。`@Input()` 屬性是可寫入的，而 `@Output()` 屬性是可觀察的。

以下是一個子／父關係的範例：

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

在這裡，`<child-component>` 選取器（即子指令）嵌在 `<parent-component>` 裡面，後者是子元件的脈絡。

`@Input()` 與 `@Output()` 就像是子元件的 API（應用程式介面），讓子元件能與父元件溝通。你可以把 `@Input()` 與 `@Output()` 想像成連接埠或門&mdash;`@Input()` 是通往元件內部的門，讓資料流入；`@Output()` 則是通往元件外部的門，讓子元件把資料送出去。

這個關於 `@Input()` 與 `@Output()` 的章節有其專屬的 <live-example name="inputs-outputs"></live-example>。下列小節將重點介紹
範例應用程式中的關鍵要點。

<div class="alert is-helpful">

#### `@Input()` 與 `@Output()` 彼此獨立

雖然 `@Input()` 與 `@Output()` 在應用程式中經常一起出現，你也可以分開使用它們。如果巢狀元件只需要將資料傳送給父元件，你就不需要 `@Input()`，只需要 `@Output()`。反之亦然，如果子元件只需要從父元件接收資料，你就只需要 `@Input()`。

</div>

{@a input}

## 如何使用 `@Input()`

在子元件或指令中使用 `@Input()` 裝飾器，讓 Angular 知道該元件中的屬性可以從父元件接收它的值。
請記住，資料流是從子元件的視角出發的。因此，`@Input()` 讓資料能從父元件輸入_到_子元件裡面。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="輸入資料流程圖">
</div>

為了說明 `@Input()` 的用法，請編輯應用程式的這些部分：

* 子元件類別與範本
* 父元件類別與範本

### 在子元件中

若要在子元件類別中使用 `@Input()` 裝飾器，請先匯入 `Input`，再以 `@Input()` 裝飾該屬性：

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>

在這個案例中，`@Input()` 裝飾了型別為 `string` 的屬性 <code class="no-auto-link">item</code>，不過 `@Input()` 屬性的型別可以是任何型別，例如 `number`、`string`、`boolean` 或 `object`。`item` 的值將來自父元件，下一節會說明。

接著，在子元件範本中加入以下內容：

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>

### 在父元件中

下一步是在父元件範本中繫結該屬性。
在這個範例中，父元件範本是 `app.component.html`。

首先，使用子元件的選取器（這裡是 `<app-item-detail>`）作為父元件範本內的指令。接著，使用[屬性繫結](guide/template-syntax#property-binding)，將子元件中的屬性繫結到父元件的屬性。

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

接著，在父元件類別 `app.component.ts` 中，為 `currentItem` 指定一個值：

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

使用 `@Input()` 時，Angular 會將 `currentItem` 的值傳給子元件，使 `item` 渲染為 `Television`。

下圖顯示了這種結構：

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="屬性繫結圖">
</div>

方括號 `[]` 中的目標，就是你在子元件中以 `@Input()` 裝飾的屬性。
繫結來源，也就是等號右邊的部分，是父元件傳給巢狀元件的資料。

關鍵重點是：在父元件中繫結子元件的屬性時&mdash;也就是方括號中的東西&mdash;你必須在子元件中以 `@Input()` 裝飾該屬性。

<div class="alert is-helpful">

#### `OnChanges` 與 `@Input()`

若要監看 `@Input()` 屬性的變更，請使用 `OnChanges`，它是 Angular 的[生命週期鉤子](guide/lifecycle-hooks#onchanges)之一。
`OnChanges` 是專門為了與具有 `@Input()` 裝飾器的屬性搭配使用而設計的。關於更多詳細資訊與範例，請見[生命週期鉤子](guide/lifecycle-hooks)指南中的 [`OnChanges`](guide/lifecycle-hooks#onchanges) 一節。

</div>

{@a output}

## 如何使用 `@Output()`

在子元件或指令中使用 `@Output()` 裝飾器，讓資料能從子元件_向外_流向父元件。

`@Output()` 屬性通常應該初始化為 Angular 的 [`EventEmitter`](api/core/EventEmitter)，讓值以[事件](#event-binding)的形式流出元件。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="輸出圖">
</div>

就像 `@Input()` 一樣，你可以在子元件的屬性上使用 `@Output()`，但它的型別應該是 `EventEmitter`。

`@Output()` 將子元件中的屬性標記為一道門，資料可以經由它從子元件傳到父元件。
接著，子元件必須發出事件，讓父元件知道有事情改變了。若要發出事件，`@Output()` 會與 `EventEmitter` 密切配合，後者是 `@angular/core` 中的一個類別，你可以用它來發出自訂事件。

使用 `@Output()` 時，請編輯應用程式的這些部分：

* 子元件類別與範本
* 父元件類別與範本

以下範例展示如何在子元件中設定 `@Output()`，將你在 HTML `<input>` 中輸入的資料推入父元件的陣列中。

<div class="alert is-helpful">

HTML 元素 `<input>` 與 Angular 裝飾器 `@Input()` 是不同的。本文件說明的是 Angular 中與 `@Input()` 及 `@Output()` 有關的元件溝通。關於 HTML 元素 `<input>` 的更多資訊，請見 [W3C 建議](https://www.w3.org/TR/html5/sec-forms.html#the-input-element)。

</div>

### 在子元件中

這個範例有一個 `<input>`，使用者可以在其中輸入值，並點選一個會發出事件的 `<button>`。`EventEmitter` 接著會將資料轉交給父元件。

首先，請務必在子元件類別中匯入 `Output` 與 `EventEmitter`：

```js
import { Output, EventEmitter } from '@angular/core';

```

接著，同樣在子元件中，在元件類別裡以 `@Output()` 裝飾一個屬性。
以下範例中的 `@Output()` 名為 `newItemEvent`，其型別是 `EventEmitter`，表示它是一個事件。

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

上述宣告的各個部分如下：

* `@Output()`&mdash;一個裝飾器函式，將屬性標記為資料從子元件傳到父元件的途徑
* `newItemEvent`&mdash;`@Output()` 的名稱
* `EventEmitter<string>`&mdash;`@Output()` 的型別
* `new EventEmitter<string>()`&mdash;告訴 Angular 建立一個新的事件發出器，且它發出的資料型別為字串。型別可以是任何型別，例如 `number`、`boolean` 等。關於 `EventEmitter` 的更多資訊，請見 [EventEmitter API 文件](api/core/EventEmitter)。

接著，在同一個元件類別中建立 `addNewItem()` 方法：

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

`addNewItem()` 函式使用 `@Output()` `newItemEvent` 來發出事件，送出使用者在 `<input>` 中輸入的值。換句話說，當使用者點選 UI 中的新增按鈕時，子元件會讓父元件知道這個事件，並把該資料給父元件。

#### 在子元件的範本中

子元件的範本有兩個控制項。第一個是帶有
[範本參照變數](guide/template-syntax#ref-var) `#newItem` 的 HTML `<input>`，
使用者在其中輸入項目名稱。使用者在
`<input>` 中輸入的任何內容都會儲存在 `#newItem` 變數中。

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

第二個元素是帶有[事件繫結](guide/template-syntax#event-binding)的 `<button>`。你會知道它是事件繫結，是因為等號左邊的部分被放在括號中，也就是 `(click)`。

`(click)` 事件會繫結到子元件類別中的 `addNewItem()` 方法，該方法以 `#newItem` 的值作為引數。

現在子元件已經有一個用來將資料傳送給父元件的 `@Output()`，以及一個發出事件的方法。下一步在父元件中進行。

### 在父元件中

在這個範例中，父元件是 `AppComponent`，但你可以使用任何可以巢狀放入子元件的元件。

這個範例中的 `AppComponent` 有一個陣列形式的 `items` 清單，以及一個向陣列加入更多項目的方法。

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

`addItem()` 方法接受一個字串形式的引數，然後將該字串推入（或加入）`items` 陣列。

#### 在父元件的範本中

接著，在父元件的範本中，將父元件的方法繫結到子元件的事件。將子元件的選取器（這裡是 `<app-item-output>`）放在父元件的範本 `app.component.html` 中。

<code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

事件繫結 `(newItemEvent)='addItem($event)'` 告訴 Angular 將子元件中的事件 `newItemEvent` 連接到父元件中的方法 `addItem()`，而子元件通知父元件的該事件將成為 `addItem()` 的引數。換句話說，這裡就是資料實際交接的地方。`$event` 包含使用者在子元件範本 UI 的 `<input>` 中輸入的資料。

現在，若要查看 `@Output()` 的運作情形，請在父元件的範本中加入以下內容：

```html
  <ul>
    <li *ngFor="let item of items">{{item}}</li>
  </ul>
  ```

`*ngFor` 會逐一走訪 `items` 陣列中的項目。當你在子元件的 `<input>` 中輸入值並點選按鈕時，子元件會發出事件，父元件的 `addItem()` 方法會將值推入 `items` 陣列，它便會渲染在清單中。

## 同時使用 `@Input()` 與 `@Output()`

在同一個子元件上同時使用 `@Input()` 與 `@Output()`，如下所示：

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

目標 `item` 是子元件類別中的 `@Input()` 屬性，它從父元件的屬性 `currentItem` 接收值。當你點選刪除時，子元件會發出事件 `deleteRequest`，它是父元件 `crossOffItem()` 方法的引數。

下圖是同一個子元件上的 `@Input()` 與 `@Output()`，顯示了各自的不同部分：

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="輸入/輸出圖">
</div>

如圖所示，將輸入與輸出一起使用的方式，與分開使用它們相同。在這裡，子元件的選取器是 `<app-input-output>`，其中 `item` 與 `deleteRequest` 分別是子元件類別中的 `@Input()` 與 `@Output()` 屬性。屬性 `currentItem` 與方法 `crossOffItem()` 都在父元件類別中。

除了使用 `@Input()` 與 `@Output()` 裝飾器來宣告輸入與輸出，你也可以在指令中繼資料的 `inputs` 與 `outputs` 陣列中指定成員，如這個範例所示：
語法 `[()]`，請參閱[雙向繫結](guide/template-syntax#two-way)。

關於這些如何運作的更多細節，請參閱前面關於 [Input](guide/template-syntax#input) 與 [Output](guide/template-syntax#output) 的章節。若要查看實際運作情形，請參閱 <live-example name="inputs-outputs">輸入與輸出範例</live-example>。

## `@Input()` 與 `@Output()` 宣告

除了使用 `@Input()` 與 `@Output()` 裝飾器來宣告輸入與輸出，你也可以在指令中繼資料的 `inputs` 與 `outputs` 陣列中指定成員，如這個範例所示：

<code-example path="inputs-outputs/src/app/in-the-metadata/in-the-metadata.component.ts" region="metadata" header="src/app/in-the-metadata/in-the-metadata.component.ts"></code-example>

雖然可以在 `@Directive` 與 `@Component` 中繼資料中宣告 `inputs` 與 `outputs`，但比較好的做法是改用 `@Input()` 與 `@Output()` 類別裝飾器，如下所示：

<code-example path="inputs-outputs/src/app/input-output/input-output.component.ts" region="input-output" header="src/app/input-output/input-output.component.ts"></code-example>

詳情請見[風格指南](guide/styleguide)中的[裝飾輸入與輸出屬性](guide/styleguide#以裝飾器標記-input-與-output-屬性)一節。

<div class="alert is-helpful">

如果你在使用輸入或輸出時遇到範本解析錯誤，但你確定這些屬性確實存在，請再次檢查你的屬性是否已以 `@Input()` / `@Output()` 註解，或是否已在 `inputs`/`outputs` 陣列中宣告它們：

<code-example language="bash">
Uncaught Error: Template parse errors:
Can't bind to 'item' since it isn't a known property of 'app-item-detail'
</code-example>

</div>

{@a aliasing-io}

## 為輸入與輸出取別名

有時候，輸入／輸出屬性的公開名稱應該與內部名稱不同。雖然最佳實務是避免這種情況，Angular 仍然提供了因應的方法。

### 在中繼資料中取別名

在中繼資料中，使用以冒號（`:`）分隔的字串為輸入與輸出取別名，左邊是指令屬性名稱，右邊是公開別名：

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias" header="src/app/aliasing/aliasing.component.ts"></code-example>

### 使用 `@Input()`/`@Output()` 裝飾器取別名

你可以將別名傳給 `@Input()`/`@Output()` 裝飾器，來指定屬性名稱的別名。內部名稱維持不變。

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias-input-output" header="src/app/aliasing/aliasing.component.ts"></code-example>

<hr/>

{@a expression-operators}

## 範本運算式運算子

Angular 範本運算式語言採用 JavaScript 語法的子集，並輔以少數針對特定情境的特殊運算子。接下來的章節將介紹其中三個運算子：

* [管道](guide/template-syntax#pipe)
* [安全導覽運算子](guide/template-syntax#safe-navigation-operator)
* [非空斷言運算子](guide/template-syntax#non-null-assertion-operator)

{@a pipe}

### 管道運算子（`|`）

運算式的結果在準備用於繫結之前，可能需要先經過一些轉換。
例如，你可以將數字顯示為貨幣、將文字改為大寫，或篩選清單並加以排序。

管道是簡單的函式，接受一個輸入值並回傳轉換後的值。
使用管道運算子（`|`），就能輕鬆地在範本運算式中套用它們：

<code-example path="template-expression-operators/src/app/app.component.html" region="uppercase-pipe" header="src/app/app.component.html"></code-example>

管道運算子會將左側運算式的結果，傳給右側的管道函式。

你可以透過多個管道串連運算式：

<code-example path="template-expression-operators/src/app/app.component.html" region="pipe-chain" header="src/app/app.component.html"></code-example>

你也可以為管道[套用參數](guide/pipes#為管道加上參數)：

<code-example path="template-expression-operators/src/app/app.component.html" region="date-pipe" header="src/app/app.component.html"></code-example>

`json` 管道對於繫結的除錯特別有幫助：

<code-example path="template-expression-operators/src/app/app.component.html" region="json-pipe" header="src/app/app.component.html"></code-example>

產生的輸出大致如下：

<code-example language="json">
  { "name": "Telephone",
    "manufactureDate": "1980-02-25T05:00:00.000Z",
    "price": 98 }
</code-example>

<div class="alert is-helpful">

管道運算子的優先順序高於三元運算子（`?:`），
這表示 `a ? b : c | x` 會被解析為 `a ? b : (c | x)`。
不過，由於種種原因，
管道運算子在 `?:` 的第一個與第二個運算元中，無法在不加括號的情況下使用。
在第三個運算元中也使用括號，是良好的做法。

</div>

<hr/>

{@a safe-navigation-operator}

### 安全導覽運算子（ `?` ）與 null 屬性路徑

Angular 的安全導航運算子 `?`，可以防範屬性路徑中的 `null` 與 `undefined`
值。在這裡，當 `item` 為 `null` 時，它能避免檢視渲染失敗。

<code-example path="template-expression-operators/src/app/app.component.html" region="safe" header="src/app/app.component.html"></code-example>

如果 `item` 為 `null`，檢視仍會渲染，但顯示的值是空白的；你只會看到「The item name is:」，其後什麼都沒有。

請看下一個使用 `nullItem` 的範例。

<code-example language="html">
  The null item name is {{nullItem.name}}
</code-example>

由於沒有安全導航運算子，且 `nullItem` 為 `null`，JavaScript 與 Angular 會擲出 `null` 參照錯誤，並中斷 Angular 的渲染過程：

<code-example language="bash">
  TypeError: Cannot read property 'name' of null.
</code-example>

不過，屬性路徑中的 `null` 值在某些情況下是可以接受的，
特別是當值一開始為 null、但資料最終會送達的時候。

使用安全導航運算子 `?`，Angular 會在遇到第一個 `null` 值時停止求值該運算式，並在不發生錯誤的情況下渲染檢視。

它對於 `a?.b?.c?.d` 這樣的長屬性路徑也能完美運作。

<hr/>

{@a non-null-assertion-operator}

### 非空斷言運算子（ `!` ）

自 TypeScript 2.0 起，你可以使用 `--strictNullChecks` 旗標，強制啟用[嚴格空值檢查](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript")。TypeScript 會確保沒有任何變數在非預期的情況下為 `null` 或 `undefined`。

在此模式下，具型別的變數預設不允許 `null` 與 `undefined`。如果你讓某個變數未指派值，或嘗試將 `null` 或 `undefined` 指派給型別不允許 `null` 與 `undefined` 的變數，型別檢查器會擲出錯誤。

如果型別檢查器無法判斷某個變數在執行時會是 `null` 或 `undefined`，也會擲出錯誤。你可以套用後綴的
[非空值斷言運算子 !](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator")，告訴型別檢查器不要擲出錯誤。

Angular 的非空值斷言運算子 `!`，在 Angular 範本中也有相同的用途。例如，你可以斷言 `item` 的屬性也已定義。

<code-example path="template-expression-operators/src/app/app.component.html" region="non-null" header="src/app/app.component.html"></code-example>

當 Angular 編譯器將你的範本轉換為 TypeScript 程式碼時，
它會防止 TypeScript 回報 `item.color` 可能為 `null` 或 `undefined`。

與[安全導航運算子](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?)")不同，
非空值斷言運算子不會防範 `null` 或 `undefined`。
相反地，它會告訴 TypeScript 型別檢查器，針對特定的屬性運算式，暫停嚴格的 `null` 檢查。

非空值斷言運算子 `!` 是選用的，唯一的例外是當你開啟嚴格空值檢查時，就必須使用它。

<a href="#top-of-page">回到頂部</a>

<hr/>

{@a built-in-template-functions}

## 內建範本函式

{@a any-type-cast-function}

### `$any()` 型別轉換函式

有時繫結運算式會在 [AOT 編譯](guide/aot-compiler)期間觸發型別錯誤，而且無法或難以完整指定型別。
若要消除這個錯誤，你可以使用 `$any()` 轉換函式，將
運算式轉換為 [`any` 型別](http://www.typescriptlang.org/docs/handbook/basic-types.html#any)，如下列範例所示：

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html"></code-example>

當 Angular 編譯器將此範本轉換為 TypeScript 程式碼時，
它會在對範本執行型別檢查時，防止 TypeScript 回報 `bestByDate` 不是 `item`
物件的成員。

`$any()` 轉換函式也可以搭配 `this` 使用，以便存取元件
未宣告的成員。

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html"></code-example>

`$any()` 轉換函式可在繫結運算式中任何方法呼叫有效的位置使用。

## 範本中的 SVG

可以在 Angular 中將 SVG 用作有效的範本。以下所有範本語法
都同時適用於 SVG 與 HTML。更多資訊請參閱 SVG [1.1](https://www.w3.org/TR/SVG11/) 與
[2.0](https://www.w3.org/TR/SVG2/) 規格。

為什麼要將 SVG 用作範本，而不是直接將它作為圖片加入你的應用程式呢？

當你將 SVG 用作範本時，你可以像使用 HTML
範本一樣使用指令與繫結。這表示你將能夠動態產生互動式圖形。

請參閱下方的範例程式碼片段，以了解語法範例：

<code-example path="template-syntax/src/app/svg.component.ts" header="src/app/svg.component.ts"></code-example>

將以下程式碼加入你的 `svg.component.svg` 檔案：

<code-example path="template-syntax/src/app/svg.component.svg" header="src/app/svg.component.svg"></code-example>

在這裡你可以看到 `click()` 事件繫結與屬性繫結語法的使用
（`[attr.fill]="fillColor"`）。
