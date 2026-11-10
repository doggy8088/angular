# 使用 ng-content 進行內容投影

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

你經常需要建立可作為不同類型內容容器的元件。例如，你可能想建立一個自訂卡片元件：

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {
  /* ... */
}
```

**你可以使用 `<ng-content>` 元素作為佔位符，標示內容應該放置的位置**：

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content/> </div>',
})
export class CustomCard {
  /* ... */
}
```

TIP: `<ng-content>` 的運作方式類似[原生的 `<slot>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/slot)，但帶有一些 Angular 專屬功能。

當你使用帶有 `<ng-content>` 的元件時，元件宿主元素的任何子元素都會在該 `<ng-content>` 的位置算繪，也就是被**投影**過去：

```angular-ts
// Component source
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {
  /* ... */
}
```

```angular-html
<!-- Using the component -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
```

```angular-html
<!-- The rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
```

Angular 將以這種方式傳給元件的任何子元素稱為該元件的**內容**。這與元件的**檢視**不同，檢視指的是元件範本中定義的元素。

**`<ng-content>` 元素既不是元件，也不是 DOM 元素**。它是一個特殊的佔位符，用來告訴 Angular 應該在哪裡算繪內容。Angular 的編譯器會在建置時期處理所有 `<ng-content>` 元素。你無法在執行時期插入、移除或修改 `<ng-content>`。你也無法為 `<ng-content>` 加上指令、樣式或任意屬性。

IMPORTANT: 你不應該用 `@if`、`@for` 或 `@switch` 條件式地包含 `<ng-content>`。即使該 `<ng-content>` 佔位符被隱藏，Angular 仍會一律具現化並為算繪到 `<ng-content>` 佔位符的內容建立 DOM 節點。如需條件式算繪元件內容，請參閱[範本片段](api/core/ng-template)。

## 多個內容佔位符

Angular 支援依據 CSS 選擇器，將多個不同的元素投影到不同的 `<ng-content>` 佔位符。擴充上面的卡片範例，你可以使用 `select` 屬性，建立卡片標題與卡片主體兩個佔位符：

```angular-ts
@Component({
  selector: 'card-title',
  template: `<ng-content>card-title</ng-content>`,
})
export class CardTitle {}

@Component({
  selector: 'card-body',
  template: `<ng-content>card-body</ng-content>`,
})
export class CardBody {}
```

```angular-ts
<!-- Component template -->
@Component({
  selector: 'custom-card',
  template: `
  <div class="card-shadow">
    <ng-content select="card-title" />
    <div class="card-divider"></div>
    <ng-content select="card-body" />
  </div>
  `,
})
export class CustomCard {}
```

```angular-ts
<!-- Using the component -->
@Component({
  selector: 'app-root',
  imports: [CustomCard, CardTitle, CardBody],
  template: `
    <custom-card>
      <card-title>Hello</card-title>
      <card-body>Welcome to the example</card-body>
    </custom-card>
`,
})
export class App {}
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
```

`<ng-content>` 佔位符支援的 CSS 選擇器，與[元件選擇器](guide/components/selectors)相同。

IMPORTANT: 若使用屬性或類別選擇器，必須以靜態方式設定，例如 `class="within"`。
動態繫結如 `[class.within]="isWithin()"` 不會被 `select` 選擇器看見。

如果你同時包含一個或多個帶有 `select` 屬性的 `<ng-content>` 佔位符，以及一個不帶 `select` 屬性的 `<ng-content>` 佔位符，後者會擷取所有未符合任何 `select` 屬性的元素：

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title" />
  <div class="card-divider"></div>
  <!-- capture anything except "card-title" -->
  <ng-content />
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

如果元件沒有包含不帶 `select` 屬性的 `<ng-content>` 佔位符，任何未符合該元件佔位符的元素都不會算繪到 DOM 中。

## 備用內容

如果元件沒有任何相符的子內容，Angular 可以為元件的 `<ng-content>` 佔位符顯示_備用內容_。你可以將子內容直接加到 `<ng-content>` 元素本身，來指定備用內容。

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title">Default Title</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Default Body</ng-content>
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <!-- No card-body provided -->
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    Default Body
  </div>
</custom-card>
```

## 為投影內容加上別名 {#aliasing-content-for-projection}

Angular 支援一個特殊屬性 `ngProjectAs`，讓你可以在任何元素上指定 CSS 選擇器。當帶有 `ngProjectAs` 的元素要與 `<ng-content>` 佔位符比對時，Angular 會改以 `ngProjectAs` 的值來比對，而不是元素本身的身分：

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title" />
  <div class="card-divider"></div>
  <ng-content />
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <h3 ngProjectAs="card-title">Hello</h3>

  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>Hello</h3>
    <div class="card-divider"></div>
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

`ngProjectAs` 只支援靜態值，無法繫結到動態運算式。

## 注意事項

### 投影內容存活在父元件的檢視中

即使投影內容是_算繪_在接收元件的內部，它仍然屬於宣告它的元件所有。Angular 將它追蹤為父元件檢視的一部分，這有幾個值得了解的副作用。

**變更偵測**：投影內容會在_父元件_執行變更偵測時被檢查。如果接收元件使用 `OnPush`，Angular 可以略過檢查該元件自己的範本，但不會略過投影內容，因為那屬於父元件。

```angular-html
<!-- Parent template (default change detection) -->
<onpush-wrapper>
  <!-- Still checked on every parent cycle, OnPush doesn't help here -->
  <expensive-component />
</onpush-wrapper>
```

**依賴注入**：投影內容的依賴來自父元件的注入器，而不是接收元件的 `viewProviders`。詳情請參閱[提供者與 viewProviders](guide/di/hierarchical-dependency-injection)。

### 有些函式庫元件不支援投影子元素

某些元件，例如選單、頁籤、清單，會使用 `ContentChildren` 來尋找它們的子元素，並接上鍵盤導覽、焦點管理或 ARIA 屬性等行為。它們的撰寫方式假設自己直接擁有子元素，因此將外部內容投影進去，往往會以微妙的方式弄壞功能。

例如，將 `<mat-menu-item>` 元素多包一層再投影到 `<mat-menu>` 中，可能會無聲地弄壞鍵盤導覽與螢幕閱讀器支援。查詢仍能找到這些項目，但當項目來自不同的檢視情境時，讓它們具備互動性的內部設定可能無法正確運作。

如果某個函式庫元件會管理其子元素的行為，在使用內容投影之前，請先查閱它的文件，該元件可能不支援內容投影。
