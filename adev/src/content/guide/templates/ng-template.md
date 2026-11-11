# 以 ng-template 建立範本片段

受[原生 `<template>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)啟發，`<ng-template>` 元素讓你能宣告**範本片段**：一段可以動態或以程式方式算繪的內容區段。

## 建立範本片段

你可以在任何元件範本內以 `<ng-template>` 元素建立範本片段：

```angular-html
<p>This is a normal element</p>

<ng-template>
  <p>This is a template fragment</p>
</ng-template>
```

當上述內容算繪時，`<ng-template>` 元素的內容不會算繪到頁面上。相反地，你可以取得範本片段的參照，並撰寫程式碼來動態算繪它。

### 片段的繫結上下文

範本片段可以包含帶有動態運算式的繫結：

```angular-ts
@Component({
  /* ... */,
  template: `<ng-template>You've selected {{count}} items.</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}
```

範本片段中的運算式或陳述式，會以宣告該片段的元件來評估，與片段實際算繪的位置無關。

## 取得範本片段的參照 {#getting-a-reference-to-a-template-fragment}

你可以用下列三種方式之一取得範本片段的參照：

- 在 `<ng-template>` 元素上宣告[範本參照變數](/guide/templates/variables#template-reference-variables)
- 以[元件或指令查詢](/guide/components/queries)查詢該片段
- 在直接套用到 `<ng-template>` 元素的指令中注入該片段。

在這三種情況下，片段都以 [TemplateRef](/api/core/TemplateRef) 物件表示。

### 以範本參照變數參照範本片段

你可以為 `<ng-template>` 元素加上範本參照變數，以便在同一個範本檔案的其他部分參照該範本片段：

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

接著你就可以透過 `myFragment` 變數，在範本的其他任何地方參照這個片段。

### 以查詢參照範本片段

你可以使用任何[元件或指令查詢 API](/guide/components/queries) 取得範本片段的參照。

舉例來說，如果你的範本恰好只有一個範本片段，你可以直接使用 `@ViewChild` 查詢來查詢 `TemplateRef` 物件：

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template>
      <p>This is a template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  @ViewChild(TemplateRef) myFragment: TemplateRef<unknown> | undefined;
}
```

接著你就可以像其他類別成員一樣，在元件程式碼或元件範本中參照這個片段。

如果一個範本包含多個片段，你可以為每個 `<ng-template>` 元素加上範本參照變數來為每個片段命名，並依該名稱查詢片段：

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template #fragmentOne>
      <p>This is one template fragment</p>
    </ng-template>

    <ng-template #fragmentTwo>
      <p>This is another template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  // When querying by name, you can use the `read` option to specify that you want to get the
  // TemplateRef object associated with the element.
  @ViewChild('fragmentOne', {read: TemplateRef}) fragmentOne: TemplateRef<unknown> | undefined;
  @ViewChild('fragmentTwo', {read: TemplateRef}) fragmentTwo: TemplateRef<unknown> | undefined;
}
```

同樣地，接著你就可以像其他類別成員一樣，在元件程式碼或元件範本中參照這些片段。

### 注入範本片段

如果一個指令直接套用到 `<ng-template>` 元素，該指令就可以注入 `TemplateRef`：

```angular-ts
@Directive({
  selector: '[myDirective]'
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}
```

```angular-html
<ng-template myDirective>
  <p>This is one template fragment</p>
</ng-template>
```

接著你就可以像其他類別成員一樣，在指令程式碼中參照這個片段。

## 算繪範本片段

一旦你取得範本片段的 `TemplateRef` 物件參照，你可以用兩種方式之一算繪片段：在範本中使用 `NgTemplateOutlet` 指令，或在 TypeScript 程式碼中使用 `ViewContainerRef`。

### 使用 `NgTemplateOutlet` {#using-ngtemplateoutlet}

來自 `@angular/common` 的 `NgTemplateOutlet` 指令接受一個 `TemplateRef`，並將片段算繪為帶有該出口之元素的**同層同級元素**。一般來說，你應該在 [`<ng-container>` 元素](/guide/templates/ng-container)上使用 `NgTemplateOutlet`。

首先，匯入 `NgTemplateOutlet`：
```typescript
import { NgTemplateOutlet } from '@angular/common';
```

下列範例宣告了一個範本片段，並以 `NgTemplateOutlet` 將該片段算繪到 `<ng-container>` 元素：

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a fragment</p>
</ng-template>

<ng-container *ngTemplateOutlet="myFragment"></ng-container>
```

這個範例會產生下列算繪後的 DOM：

```angular-html
<p>This is a normal element</p>
<p>This is a fragment</p>
```

### 使用 `ViewContainerRef`

**檢視容器**是 Angular 元件樹中的一個節點，可以容納內容。任何元件或指令都可以注入 `ViewContainerRef`，取得與該元件或指令在 DOM 中位置相對應的檢視容器參照。

你可以使用 `ViewContainerRef` 上的 `createEmbeddedView` 方法來動態算繪範本片段。當你以 `ViewContainerRef` 算繪片段時，Angular 會將它附加到 DOM 中，成為注入該 `ViewContainerRef` 之元件或指令的下一個同層同級元素。

下列範例展示一個元件，它接受範本片段的參照作為輸入，並在點選按鈕時將該片段算繪到 DOM 中。

```angular-ts
@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>Component with a fragment</h2>
    <ng-template #myFragment>
      <p>This is the fragment</p>
    </ng-template>
    <my-outlet [fragment]="myFragment" />
  `,
})
export class ComponentWithFragment { }

@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="showFragment()">Show</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  @Input() fragment: TemplateRef<unknown> | undefined;

  showFragment() {
    if (this.fragment) {
      this.viewContainer.createEmbeddedView(this.fragment);
    }
  }
}
```

在上述範例中，點選「Show」按鈕會產生下列輸出：

```angular-html
<component-with-fragment>
  <h2>Component with a fragment>
  <my-outlet>
    <button>Show</button>
  </my-outlet>
  <p>This is the fragment</p>
</component-with-fragment>
```

## 算繪範本片段時傳遞參數

以 `<ng-template>` 宣告範本片段時，你可以額外宣告該片段接受的參數。算繪片段時，你可以選擇傳入與這些參數相對應的 `context` 物件。除了參照宣告該片段之元件的資料外，你還可以在繫結運算式與陳述式中使用這個 context 物件的資料。

每個參數都寫為以 `let-` 為前綴的 attribute，其值對應到 context 物件中的某個屬性名稱：

```angular-html
<ng-template let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>
```

### 使用 `NgTemplateOutlet` {#using-ngtemplateoutlet-with-parameters}

你可以將 context 物件繫結到 `ngTemplateOutletContext` 輸入：

```angular-html
<ng-template #myFragment let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>

<ng-container
  [ngTemplateOutlet]="myFragment"
  [ngTemplateOutletContext]="{topping: 'onion'}"
/>
```

### 使用 `ViewContainerRef` {#using-viewcontainerref-with-parameters}

你可以將 context 物件作為第二個引數傳給 `createEmbeddedView`：

```angular-ts
this.viewContainer.createEmbeddedView(this.myFragment, {topping: 'onion'});
```

## 結構指令

**結構指令**是任何符合下列條件的指令：

- 注入 `TemplateRef`
- 注入 `ViewContainerRef`，並以程式方式算繪注入的 `TemplateRef`

Angular 支援結構指令的特殊便利語法。如果你將指令套用到某個元素，並在該指令的選擇器前加上星號（`*`）字元，Angular 會將整個元素及其全部內容解讀為範本片段：

```angular-html
<section *myDirective>
  <p>This is a fragment</p>
</section>
```

這等同於：

```angular-html
<ng-template myDirective>
  <section>
    <p>This is a fragment</p>
  </section>
</ng-template>
```

開發者通常使用結構指令來依條件算繪片段，或多次算繪片段。

如需更多細節，請參閱[結構指令](/guide/directives/structural-directives)。

## 其他資源

如需了解其他函式庫如何使用 `ng-template` 的範例，請參閱：

- [Angular Material 的 Tabs](https://material.angular.dev/components/tabs/overview)：在分頁啟用之前，不會有任何內容算繪到 DOM 中
- [Angular Material 的 Table](https://material.angular.dev/components/table/overview)：讓開發者能定義不同的資料算繪方式
