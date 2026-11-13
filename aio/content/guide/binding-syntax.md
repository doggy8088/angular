# 繫結語法

資料繫結會根據應用程式的狀態，自動讓你的頁面保持最新。
你可以使用資料繫結來指定例如圖片的來源、按鈕的狀態，或特定使用者的資料。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>


## 資料繫結與 HTML

開發者可以透過指定字串值的 attribute 來客製化 HTML。
在下列範例中，`class`、`src` 與 `disabled` 分別修飾 `<div>`、`<img>` 與 `<button>` 元素。

```html
<div class="special">Plain old HTML</div>
<img src="images/item.png">
<button disabled>Save</button>
```

使用資料繫結來控制按鈕狀態這類事情：

<code-example path="binding-syntax/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

請注意，這個繫結是對按鈕 DOM 元素的 `disabled` 屬性，而不是對 attribute。
資料繫結是針對 DOM 元素、元件與指令的屬性，而不是 HTML attribute。

{@a html-attribute-vs-dom-property}

### HTML attribute 與 DOM 屬性

Angular 繫結會區分 HTML attribute 與 DOM 屬性。

attribute 會初始化 DOM 屬性，你可以設定它們來修改元素的行為。
屬性是 DOM 節點的特徵。

* 少數 HTML attribute 與屬性有 1:1 的對應關係；例如 `id`。

* 有些 HTML attribute 沒有對應的屬性；例如 `aria-*`。

* 有些 DOM 屬性沒有對應的 attribute；例如 `textContent`。

<div class="alert is-important">

請記住，HTML attribute 與 DOM 屬性是不同的東西，即使它們有相同的名稱。

</div>

在 Angular 中，HTML attribute 的唯一作用是初始化元素與指令的狀態。

當你撰寫資料繫結時，你處理的完全是目標物件的 DOM 屬性與事件。

#### 範例 1：`<input>`

當瀏覽器渲染 `<input type="text" value="Sarah">` 時，它會建立一個
對應的 DOM 節點，帶有 `value` 屬性，並把該 `value` 初始化為 "Sarah"。

```html
<input type="text" value="Sarah">
```

當使用者在 `<input>` 中輸入 `Sally` 時，DOM 元素的 `value` 屬性會變成 `Sally`。
不過，如果你用 `input.getAttribute('value')` 查看 HTML attribute `value`，會看到 attribute 維持不變&mdash;它回傳 "Sarah"。

HTML attribute `value` 指定的是初始值；DOM `value` 屬性則是目前的值。

要在實際運作的應用程式中查看 attribute 與 DOM 屬性的差異，請參閱 <live-example name="binding-syntax"></live-example>，特別是繫結語法的部分。

#### 範例 2：停用的按鈕

按鈕的 `disabled` 屬性預設為 `false`，所以按鈕是啟用的。

當你加入 `disabled` attribute 時，你是把按鈕的 `disabled` 屬性初始化為 `true`，這會停用按鈕。

```html
<button disabled>Test Button</button>
```

加入與移除 `disabled` attribute 會停用與啟用按鈕。
不過，attribute 的值並不重要，這就是為什麼你無法透過寫 `<button disabled="false">Still Disabled</button>` 來啟用按鈕。

要控制按鈕的狀態，請改為設定 `disabled` 屬性。

#### 屬性與 attribute 比較

雖然技術上你可以設定 `[attr.disabled]` attribute 繫結，但兩者的值並不相同：屬性繫結必須是布林值，而對應的 attribute 繫結則取決於值是否為 `null`。
請看下列範例：

```html
<input [disabled]="condition ? true : false">
<input [attr.disabled]="condition ? 'disabled' : null">
```

第一行使用 `disabled` 屬性，採用布林值。
第二行使用 disabled attribute，檢查是否為 `null`。

一般來說，應優先使用屬性繫結而非 attribute 繫結，因為布林值容易閱讀、語法較短，而且屬性的效能較好。

要在實際運作的應用程式中查看 `disabled` 按鈕範例，請參閱 <live-example></live-example>。
這個範例會教你如何從元件切換 disabled 屬性。


## 資料繫結的類型

Angular 依資料流動方向，提供三種資料繫結：

* 從來源到檢視
* 從檢視到來源
* 在檢視到來源再到檢視的雙向序列中

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


插值以外的繫結類型，在等號左邊都有一個目標名稱。
繫結的目標是屬性或事件，你要用方括號 `[]`、小括號 `()`，或兩者 `[()]` 把它包起來。

`[]`、`()`、`[()]` 這些繫結標點符號與前綴，指定了資料流動的方向。

* 使用 `[]` 從來源繫結到檢視。
* 使用 `()` 從檢視繫結到來源。
* 使用 `[()]` 在檢視到來源再到檢視的雙向序列中繫結。


把運算式或陳述式放在等號右邊，用雙引號 `""` 包起來。
更多資訊請參閱[插值](guide/interpolation)與[範本陳述式](guide/template-statements)。

## 繫結類型與目標

資料繫結的目標可以是屬性、事件或 attribute 名稱。
來源指令的每個公開成員，都會自動開放給範本運算式或陳述式繫結。
下表彙整了不同繫結類型的目標。

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
