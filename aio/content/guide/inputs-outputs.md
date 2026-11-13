# `@Input()` 與 `@Output()` 屬性

`@Input()` 與 `@Output()` 讓 Angular 能在父脈絡與子指令或子元件之間共享資料。`@Input()` 屬性是可寫入的，而 `@Output()` 屬性是可觀察的。

<div class="alert is-helpful">

請見 <live-example></live-example>，查看包含本指南程式碼片段的可運作範例。

</div>

以下是一個子／父關係的範例：

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

在這裡，`<child-component>` 選取器（即子指令）嵌在 `<parent-component>` 裡面，後者是子元件的脈絡。

`@Input()` 與 `@Output()` 就像是子元件的 API（應用程式介面），讓子元件能與父元件溝通。你可以把 `@Input()` 與 `@Output()` 想像成連接埠或門&mdash;`@Input()` 是通往元件內部的門，讓資料流入；`@Output()` 則是通往元件外部的門，讓子元件把資料送出去。

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

首先，使用子元件的選取器（這裡是 `<app-item-detail>`）作為父元件範本內的指令。接著，使用[屬性繫結](guide/property-binding)，將子元件中的屬性繫結到父元件的屬性。

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

### `OnChanges` 與 `@Input()`

若要監看 `@Input()` 屬性的變更，請使用 `OnChanges`，它是 Angular 的[生命週期鉤子](guide/lifecycle-hooks#onchanges)之一。
`OnChanges` 是專門為了與具有 `@Input()` 裝飾器的屬性搭配使用而設計的。關於更多詳細資訊與範例，請見[生命週期鉤子](guide/lifecycle-hooks)指南中的 [`OnChanges`](guide/lifecycle-hooks#onchanges) 一節。

</div>

{@a output}

## 如何使用 `@Output()`

在子元件或指令中使用 `@Output()` 裝飾器，讓資料能從子元件_向外_流向父元件。

`@Output()` 屬性通常應該初始化為 Angular 的 [`EventEmitter`](api/core/EventEmitter)，讓值以[事件](guide/event-binding)的形式流出元件。


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

## 在子元件中

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

### 在子元件的範本中

子元件的範本有兩個控制項。第一個是帶有[範本參照變數](guide/template-reference-variables) `#newItem` 的 HTML `<input>`，使用者在其中輸入項目名稱。使用者在 `<input>` 中輸入的任何內容，都會儲存在 `#newItem` 變數的 `value` 屬性中。

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

第二個元素是帶有[事件繫結](guide/event-binding)的 `<button>`。你會知道它是事件繫結，是因為等號左邊的部分被放在括號中，也就是 `(click)`。

`(click)` 事件會繫結到子元件類別中的 `addNewItem()` 方法，該方法以 `#newItem.value` 屬性的值作為引數。

現在子元件已經有一個用來將資料傳送給父元件的 `@Output()`，以及一個發出事件的方法。下一步在父元件中進行。

## 在父元件中

在這個範例中，父元件是 `AppComponent`，但你可以使用任何可以巢狀放入子元件的元件。

這個範例中的 `AppComponent` 有一個陣列形式的 `items` 清單，以及一個向陣列加入更多項目的方法。

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

`addItem()` 方法接受一個字串形式的引數，然後將該字串推入（或加入）`items` 陣列。

### 在父元件的範本中

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

若要使用香蕉盒語法 `[()]` 結合屬性繫結與事件繫結，請見[雙向繫結](guide/two-way-binding)。

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
