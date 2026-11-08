# 範本中的變數

Angular 在範本中有兩種變數宣告：區域範本變數與範本參照變數。

HELPFUL: 在本指南中，「範本」並不是指整個 HTML 範本檔案。它只指檔案中某個特定的範本結構或運算式。

## 使用 `@let` 的區域範本變數

Angular 的 `@let` 語法讓你能定義一個區域變數，並在整個範本中重複使用它，類似 [JavaScript `let` 語法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)。

### 使用 `@let`

使用 `@let` 宣告一個變數，其值以範本運算式的結果為基礎。Angular 會自動讓變數的值隨著給定的運算式保持最新，類似[繫結](/guide/templates/binding)。

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
  'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
  'Ut enim ad minim veniam...';
```

每個 `@let` 區塊只能宣告一個變數。你不能在同一個區塊中用逗號宣告多個變數。

### 參照 `@let` 的值

用 `@let` 宣告變數之後，你可以在同一個範本中重複使用它：

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{ user.name }}</h1>
  <user-avatar [photo]="user.photo" />

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{ snack.name }}</li>
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

<!-- Valid -->
{{ topLevel }}
<!-- Valid -->
{{ insideDiv }}

@if (condition) {
  <!-- Valid -->
  {{ topLevel + insideDiv }}

  @let nested = value;

  @if (condition) {
    <!-- Valid -->
    {{ topLevel + insideDiv + nested }}
  }
}

<!-- Error, not hoisted from @if -->
{{ nested }}
```

### 完整語法

`@let` 語法的正式定義如下：

- `@let` 關鍵字。
- 接著一個或多個空白字元，不包括換行。
- 接著一個有效的 JavaScript 名稱與零個或多個空白字元。
- 接著 = 符號與零個或多個空白字元。
- 接著一個 Angular 運算式，可以跨多行。
- 以 `;` 符號結尾。

## 範本參照變數

範本參照變數讓你能宣告一個變數，用來參照範本中某個元素的值。

範本參照變數可以參照以下項目：

- 範本中的 DOM 元素（包括[自訂元素](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)）
- Angular 元件或指令
- 來自 [ng-template](/api/core/ng-template) 的 [TemplateRef](/api/core/TemplateRef)

你可以使用範本參照變數，在同一個範本中，從某個部分讀取資訊並用於另一個部分。

### 宣告範本參照變數

你可以在範本中的元素上加入一個以井字字元（`#`）開頭、後接變數名稱的屬性，來宣告變數。

```angular-html
<!-- Create a template reference variable named "taskInput", referring to the HTMLInputElement. -->
<input #taskInput placeholder="Enter task name" />
```

### 將值指派給範本參照變數

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
<input #taskInput placeholder="Enter task name" />
```

#### 將參照指派給 Angular 指令

Angular 指令可能有一個 `exportAs` 屬性，定義該指令在範本中可被參照的名稱：

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone {
  /* ... */
}
```

當你在元素上宣告範本變數時，可以指定這個 `exportAs` 名稱，將該變數指派為指令執行個體：

```angular-html
<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone">...</section>
```

你不能參照沒有指定 `exportAs` 名稱的指令。

### 搭配查詢使用範本參照變數

除了使用範本變數從同一個範本的其他部分讀取值之外，你也可以使用這種變數宣告方式，「標記」某個元素，以供[元件與指令查詢](/guide/components/queries)使用。

當你想查詢範本中的特定元素時，你可以在該元素上宣告範本變數，然後根據變數名稱查詢該元素。

```angular-html
<input #description value="Original description" />
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

### 範本變數範圍

就像 JavaScript 或 TypeScript 程式碼中的變數一樣，範本變數的範圍限於宣告它們的範本。

同樣地，像 `@if` 與 `@for` 這類[控制流程區塊](guide/templates/control-flow)、[結構指令](guide/directives/structural-directives)與 `<ng-template>` 宣告都會建立一個新的巢狀範本範圍，很像 JavaScript 的 `if` 與 `for` 這類控制流程敘述會建立新的語彙範圍。你不能從這些巢狀範本的邊界之外，存取其中的範本變數。

HELPFUL: 在範本中只定義變數一次，讓執行階段的值保持可預測。

#### 在巢狀範本中存取

內層範本可以存取外層範本定義的範本變數。

在以下範例中，變更 `<input>` 中的文字會變更 `<span>` 中的值，因為 Angular 會透過範本變數 `ref1` 立即更新變更。

```angular-html
<input #ref1 type="text" [(ngModel)]="firstExample" />

@if (true) {
  <span>Value: {{ ref1.value }}</span>
}
```

在這個情況下，`@if` 區塊會建立一個新的範本範圍，其中包含來自父範圍的 `ref1` 變數。

不過，從父範本存取子範圍中的範本變數並不可行：

```angular-html {avoid}
@if (true) {
  <input #ref2 type="text" [(ngModel)]="secondExample" />
}

<span>Value: {{ ref2?.value }}</span>
```

在這裡，`ref2` 是在 `@if` 建立的子範圍中宣告的，無法從父範本存取。
