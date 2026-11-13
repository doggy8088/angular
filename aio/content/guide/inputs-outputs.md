# 在子指令與父指令及元件之間共享資料

Angular 中常見的模式，是在父元件與一個或多個子元件之間共享資料。
請使用 `@Input()` 與 `@Output()` 裝飾器來實作這種模式。

<div class="alert is-helpful">

請見 <live-example></live-example>，查看包含本指南程式碼片段的可運作範例。

</div>

考慮以下階層結構：

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

`<parent-component>` 作為 `<child-component>` 的脈絡。

`@Input()` 與 `@Output()` 讓子元件有辦法與父元件溝通。
`@Input()` 讓父元件可以更新子元件中的資料。
反之，`@Output()` 讓子元件可以將資料傳送給父元件。

{@a input}

## 將資料傳送給子元件

子元件或指令中的 `@Input()` 裝飾器，表示該屬性可以從父元件接收它的值。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="父元件到子元件的輸入資料流程圖">
</div>

若要使用 `@Input()`，你必須設定父元件與子元件。

### 設定子元件

若要在子元件類別中使用 `@Input()` 裝飾器，請先匯入 `Input`，再以 `@Input()` 裝飾該屬性，如下列範例所示。

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>

在這個案例中，`@Input()` 裝飾了型別為 `string` 的屬性 <code class="no-auto-link">item</code>，不過 `@Input()` 屬性的型別可以是任何型別，例如 `number`、`string`、`boolean` 或 `object`。
`item` 的值來自父元件。

接著，在子元件範本中加入以下內容：

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>

### 設定父元件

下一步是在父元件範本中繫結該屬性。
在這個範例中，父元件範本是 `app.component.html`。

1.  使用子元件的選取器（這裡是 `<app-item-detail>`）作為父元件範本內的指令。
2.  使用[屬性繫結](guide/property-binding)，將子元件的 `item` 屬性繫結到父元件的 `currentItem` 屬性。

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

3.  在父元件類別中，為 `currentItem` 指定一個值：

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

使用 `@Input()` 時，Angular 會將 `currentItem` 的值傳給子元件，使 `item` 渲染為 `Television`。

下圖顯示了這種結構：

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="屬性繫結圖：目標 item 以方括號表示，來源 currentItem 在等號右側">
</div>

方括號 `[]` 中的目標，就是你在子元件中以 `@Input()` 裝飾的屬性。
繫結來源，也就是等號右邊的部分，是父元件傳給巢狀元件的資料。

### 監看 `@Input()` 的變更

若要監看 `@Input()` 屬性的變更，請使用 `OnChanges`，它是 Angular 的[生命週期鉤子](guide/lifecycle-hooks)之一。
關於更多詳細資訊與範例，請見[生命週期鉤子](guide/lifecycle-hooks)指南中的 [`OnChanges`](guide/lifecycle-hooks#onchanges) 一節。

{@a output}

## 將資料傳送給父元件

子元件或指令中的 `@Output()` 裝飾器，讓資料從子元件流向父元件。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="子元件到父元件的輸出資料流程圖">
</div>

`@Output()` 將子元件中的屬性標記為一道門，資料可以經由它從子元件傳到父元件。

子元件使用 `@Output()` 屬性來發出事件，通知父元件發生變更。
若要發出事件，`@Output()` 的型別必須是 `EventEmitter`，它是 `@angular/core` 中的一個類別，你可以用它來發出自訂事件。

以下範例展示如何在子元件中設定 `@Output()`，將資料從 HTML `<input>` 推入父元件的陣列中。

若要使用 `@Output()`，你必須設定父元件與子元件。

### 設定子元件

以下範例有一個 `<input>`，使用者可以在其中輸入值，並點選一個會發出事件的 `<button>`。
`EventEmitter` 接著會將資料轉交給父元件。

1.  在子元件類別中匯入 `Output` 與 `EventEmitter`：

  ```js
  import { Output, EventEmitter } from '@angular/core';

  ```

1.  在元件類別中，以 `@Output()` 裝飾一個屬性。
    以下範例中的 `newItemEvent` `@Output()` 型別為 `EventEmitter`，表示它是一個事件。

  <code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

    上述宣告的各個部分如下：

    * `@Output()`&mdash;一個裝飾器函式，將屬性標記為資料從子元件傳到父元件的途徑
    * `newItemEvent`&mdash;`@Output()` 的名稱
    * `EventEmitter<string>`&mdash;`@Output()` 的型別
    * `new EventEmitter<string>()`&mdash;告訴 Angular 建立一個新的事件發出器，且它發出的資料型別為字串。

    關於 `EventEmitter` 的更多資訊，請見 [EventEmitter API 文件](api/core/EventEmitter)。

1.  在同一個元件類別中建立 `addNewItem()` 方法：

  <code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

    `addNewItem()` 函式使用 `@Output()` `newItemEvent`，以使用者在 `<input>` 中輸入的值發出事件。

### 設定子元件的範本

子元件的範本有兩個控制項。
第一個是帶有[範本參照變數](guide/template-reference-variables) `#newItem` 的 HTML `<input>`，使用者在其中輸入項目名稱。
`#newItem` 變數的 `value` 屬性會儲存使用者在 `<input>` 中輸入的內容。

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

第二個元素是帶有 `click` [事件繫結](guide/event-binding)的 `<button>`。

`(click)` 事件會繫結到子元件類別中的 `addNewItem()` 方法。
`addNewItem()` 方法以 `#newItem.value` 屬性的值作為引數。

### 設定父元件

這個範例中的 `AppComponent` 有一個陣列形式的 `items` 清單，以及一個向陣列加入更多項目的方法。

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

`addItem()` 方法接受一個字串形式的引數，然後將該字串加入 `items` 陣列。

### 設定父元件的範本

1.  在父元件的範本中，將父元件的方法繫結到子元件的事件。
1.  將子元件的選取器（這裡是 `<app-item-output>`）放在父元件的範本 `app.component.html` 中。

  <code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

    事件繫結 `(newItemEvent)='addItem($event)'` 將子元件中的事件 `newItemEvent` 連接到父元件中的方法 `addItem()`。

    `$event` 包含使用者在子元件範本 UI 的 `<input>` 中輸入的資料。

    若要查看 `@Output()` 的運作情形，請在父元件的範本中加入以下內容：

  ```html
    <ul>
      <li *ngFor="let item of items">{{item}}</li>
    </ul>
  ```

    `*ngFor` 會逐一走訪 `items` 陣列中的項目。
    當你在子元件的 `<input>` 中輸入值並點選按鈕時，子元件會發出事件，父元件的 `addItem()` 方法會將值推入 `items` 陣列，新的項目便會渲染在清單中。

## 同時使用 `@Input()` 與 `@Output()`

在同一個子元件上同時使用 `@Input()` 與 `@Output()`，如下所示：

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

目標 `item` 是子元件類別中的 `@Input()` 屬性，它從父元件的屬性 `currentItem` 接收值。
當你點選刪除時，子元件會發出事件 `deleteRequest`，它是父元件 `crossOffItem()` 方法的引數。

下圖顯示了 `<app-input-output>` 子元件上 `@Input()` 與 `@Output()` 的不同部分。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="輸入目標與輸出目標各自繫結到來源的圖">
</div>

子元件的選取器是 `<app-input-output>`，其中 `item` 與 `deleteRequest` 分別是子元件類別中的 `@Input()` 與 `@Output()` 屬性。
屬性 `currentItem` 與方法 `crossOffItem()` 都在父元件類別中。

若要使用香蕉盒語法 `[()]` 結合屬性繫結與事件繫結，請見[雙向繫結](guide/two-way-binding)。

@reviewed 2021-09-17
