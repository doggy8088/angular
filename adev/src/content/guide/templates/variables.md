# 範本中的變數

Angular 在範本中有兩種變數宣告：區域範本變數與範本參照變數。

## 使用 `@let` 的區域範本變數 {#local-template-variables-with-let}

Angular 的 `@let` 語法讓你能定義一個區域變數，並在整個範本中重複使用它，類似 [JavaScript `let` 語法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)。

### 使用 `@let`

使用 `@let` 宣告一個變數，其值以範本運算式的結果為基礎。Angular 會自動讓變數的值隨著給定的運算式保持最新，類似[繫結](./templates/bindings)。

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
                      'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
                      'Ut enim ad minim veniam...';
```

每個 `@let` 區塊只能宣告一個變數。你不能在同一個區塊中用逗號宣告多個變數。

### 參照 `@let` 的值

用 `@let` 宣告變數之後，你可以在同一個範本中重複使用它：

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{user.name}}</h1>
  <user-avatar [photo]="user.photo"/>

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{snack.name}}</li>
    }
  </ul>

  <button (click)="update(user)">Update profile</button>
}
```

### 可指派性

`@let` 與 JavaScript 的 `let` 之間的一個關鍵差異是，`@let` 在宣告之後不能重新指派。不過，Angular 會自動讓變數的值隨著給定的運算式保持最新。

```angular-html
@let value = 1;

<!-- Invalid - This does not work! -->
<button (click)="value = value + 1">Increment the value</button>
```

### 變數範圍

`@let` 宣告的範圍限於目前檢視及其後代。Angular 會在元件邊界，以及範本中可能包含動態內容的任何地方建立新檢視，例如控制流程區塊、`@defer` 區塊或結構指令。

由於 `@let` 宣告不會被提升（hoist），它們**無法**被父檢視或同層檢視存取：

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

{{topLevel}} <!-- Valid -->
{{insideDiv}} <!-- Valid -->

@if (condition) {
  {{topLevel + insideDiv}} <!-- Valid -->

  @let nested = value;

  @if (condition) {
    {{topLevel + insideDiv + nested}} <!-- Valid -->
  }
}

{{nested}} <!-- Error, not hoisted from @if -->
```

### 完整語法

`@let` 語法的正式定義如下：

- `@let` 關鍵字。
- 接著一個或多個空白字元，不包括換行。
- 接著一個有效的 JavaScript 名稱與零個或多個空白字元。
- 接著 = 符號與零個或多個空白字元。
- 接著一個 Angular 運算式，可以跨多行。
- 以 `;` 符號結尾。

## 範本參照變數 {#template-reference-variables}

範本參照變數讓你能宣告一個變數，用來參照範本中某個元素的值。

範本參照變數可以參照以下項目：

- 範本中的 DOM 元素（包括[自訂元素](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)）
- Angular 元件或指令
- 來自 [ng-template](/api/core/ng-template) 的 [TemplateRef](/api/core/TemplateRef)

你可以使用範本參照變數，在同一個範本中，從某個部分讀取資訊並用於另一個部分。

### 宣告範本參照變數 {#declaring-a-template-reference-variable}

你可以在範本中的元素上加入一個以井字字元（`#`）開頭、後接變數名稱的屬性，來宣告變數。

```angular-html
<!-- Create a template reference variable named "taskInput", referring to the HTMLInputElement. -->
<input #taskInput placeholder="Enter task name">
```

### 將值指派給範本參照變數 {#assigning-values-to-template-reference-variables}

Angular 會根據變數宣告所在的元素，將值指派給範本變數。

如果你在 Angular 元件上宣告變數，該變數會參照該元件執行個體。

```angular-html
<!-- The `startDate` variable is assigned the instance of `MyDatepicker`. -->
<my-datepicker #startDate />
```

如果你在 `<ng-template>` 元素上宣告變數，該變數會參照代表該範本的 TemplateRef 執行個體。詳情請參閱[結構指令](/guide/directives/structural-directives)中的[Angular 如何使用星號 \* 語法](/guide/directives/structural-directives#structural-directive-shorthand)。

```angular-html
<!-- The `myFragment` variable is assigned the `TemplateRef` instance corresponding to this template fragment. -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

如果你在任何其他顯示元素上宣告變數，該變數會參照 `HTMLElement` 執行個體。

```angular-html
<!-- The "taskInput" variable refers to the HTMLInputElement instance. -->
<input #taskInput placeholder="Enter task name">
```

#### 將參照指派給 Angular 指令 {#assigning-a-reference-to-an-angular-directive}

Angular 指令可能有一個 `exportAs` 屬性，定義該指令在範本中可被參照的名稱：

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone { /* ... */ }
```

當你在元素上宣告範本變數時，可以指定這個 `exportAs` 名稱，將該變數指派為指令執行個體：

```angular-html
<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone"> ... </section>
```

你不能參照沒有指定 `exportAs` 名稱的指令。

### 搭配查詢使用範本參照變數

除了使用範本變數從同一個範本的其他部分讀取值之外，你也可以使用這種變數宣告方式，「標記」某個元素，以供[元件與指令查詢](/guide/components/queries)使用。

當你想查詢範本中的特定元素時，你可以在該元素上宣告範本變數，然後根據變數名稱查詢該元素。

```angular-html
 <input #description value="Original description">
```

```angular-ts
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // Query for the input element based on the template variable name.
  @ViewChild('description') input: ElementRef | undefined;
}
```

若要了解查詢的更多資訊，請參閱[使用查詢參照子項](/guide/components/queries)。
