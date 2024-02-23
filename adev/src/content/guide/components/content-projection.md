# 內容投影與 ng-content

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

您經常需要建立元件作為不同類型內容的容器。例如，您可能想要建立自定義卡片元件：

```ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {/* ... */}
```

**您可以使用 `<ng-content>` 元素作為標記內容應放置位置的預留位置**:

```ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content></ng-content> </div>',
})
export class CustomCard {/* ... */}
```

提示：`<ng-content>` 的作用類似於
[原生 `<slot>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)，
但具有一些專屬於 Angular 的功能。

當您使用帶有 `<ng-content>` 的元件時，會在該 `<ng-content>` 的位置呈現或 **投射** 元件主機元素的任何子元素：

```ts
// Component source
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {/* ... */}
```

```html
<!-- Using the component -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
```

```html
<!-- The rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
```

Angular 指稱以這種方式傳遞的任何子元件為該元件的 **內容**。這不同於元件的 **檢視**，後者是指元件範本中定義的元素。

**`<ng-content>` 元素既不是元件也不是 DOM 元素**。相反，它是一個特殊預留位置，告訴 Angular 在哪裡呈現內容。Angular 的編譯器在建置時處理所有 `<ng-content>` 元素。您在執行階段無法插入、移除或修改 `<ng-content>`。您無法將 **<span style="text-decoration:underline;">指令</span>**、樣式或任意屬性新增至 `<ng-content>`。

不應使用 `ngIf`、`ngFor` 或 `ngSwitch` 來有條件地包含 `<ng-content>`。如需有條件地呈現元件內容，請參閱 [範本片段](api/core/ng-template)。

## 多個內容預留位置

Angular 支援根據 CSS 選擇器將多個不同的元素投射到不同的 `<ng-content>` 預留位置。擴充上面的卡片範例，您可以使用 `select` 屬性為卡片標題和卡片內容建立兩個預留位置：

```html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body"></ng-content>
</div>
```

```html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <card-body>Welcome to the example</card-body>
</custom-card>
```

```html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
```

`<ng-content>` 預留位置支援與 [元件選擇器](guide/components/selectors) 相同的 CSS 選擇器。

如果您包含一個或多個帶有 `select` 屬性的 `<ng-content>` 預留位置和一個沒有 `select` 屬性的 `<ng-content>` 預留位置，後者會擷取所有與 `select` 屬性不匹配的元素：

```html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- capture anything except "card-title" -->
  <ng-content></ng-content>
</div>
```

```html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
```

```html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example></p>
  </div>
</custom-card>
```

如果元件不包含沒有 `select` 屬性的 `<ng-content>` 預留位置，則任何與元件的預留位置之一不匹配的元素都不會呈現在 DOM 中。

## 投影內容別名

Angular 支援一個特殊屬性 `ngProjectAs`，它允許您在任何元素上指定一個 CSS 選擇器。每當一個有 `ngProjectAs` 的元素被檢查是否符合 `<ng-content>`
預留位置時，Angular 會根據 `ngProjectAs` 值進行比較，而不是元素的身份：

```html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content></ng-content>
</div>
```

```html
<!-- Using the component -->
<custom-card>
  <h3 ngProjectAs="card-title">Hello</h3>

  <p>Welcome to the example</p>
</custom-card>
```

```html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>Hello</h3>
    <div class="card-divider"></div>
    <p>Welcome to the example></p>
  </div>
</custom-card>
```

`ngProjectAs` 僅支援靜態值，無法與動態表達式繫結。
