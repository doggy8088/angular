
# 繫結語法：總覽

資料繫結是一種協調機制，用來協調使用者所看到的內容，特別是與應用程式資料值之間的協調。
雖然你可以自行把值推送到 HTML 或從 HTML 拉取值，
但把這些工作交給繫結框架，應用程式會更容易撰寫、閱讀與維護。
你只需要宣告繫結來源與目標 HTML 元素之間的繫結，其餘的就交給框架處理。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

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

{@a html-attribute-vs-dom-property}

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
      <!-- 更多資訊請參閱 [屬性繫結](guide/property-binding)。 -->
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

