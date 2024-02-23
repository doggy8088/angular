<docs-decorative-header title="條件判斷與迴圈" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
根據動態資料有條件地顯示和/或重複內容。
</docs-decorative-header>

使用 Angular 等架構的其中一個優點是，它為開發人員遇到的常見問題提供內建解決方案。這包括：根據特定條件顯示內容、根據應用程式資料呈現項目清單等。

為了解決這個問題，Angular 使用內建控制流程區塊，用來告訴架構何時以及如何呈現您的範本。

## 條件式渲染

開發人員遇到的最常見情況之一是根據條件顯示或隱藏範本中的內容。

一個常見的範例是基於使用者的權限層級，在螢幕上顯示或不顯示某些控制項。

### `@if` 區塊

與 JavaScript 的 `if` 語句類似，Angular 使用 `@if` 控制流程區塊來有條件地隱藏和顯示範本及其內容。

```ts
// user-controls.component.ts
@Component({
  standalone: true,
  selector: 'user-controls',
  template: `
    @if (isAdmin) {
      <button>Erase database</button>
    }
  `,
})
export class UserControls {
  isAdmin = true;
}
```

在此範例中，Angular 僅在 `isAdmin` 屬性為 true 時才呈現 `<button>` 元素。否則，它不會顯示在頁面上。

### `@else` 區塊

雖然 `@if` 區塊在許多情況下很有用，但當條件不符合時，也常會顯示備用 UI。

例如，在 `UserControls` 元件中，而不是顯示空白螢幕，讓使用者知道他們無法看到任何內容，因為他們尚未驗證，這對使用者來說會很有幫助。

當您需要一個類似 JavaScript `else` 子句的後備選項時，新增一個 `@else` 區塊以達成相同的效果。

```ts
// user-controls.component.ts
@Component({
  standalone: true,
  selector: 'user-controls',
  template: `
    @if (isAdmin) {
      <button>Erase database</button>
    } @else {
      <p>You are not authorized.</p>
    }
  `,
})
export class UserControls {
  isAdmin = true;
}
```

## 呈現清單

html
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>

另一個開發人員會遇到的常見場景是需要呈現一列項目。

### `@for` 區塊

與 JavaScript 的 `for...of` 迴圈類似，Angular 提供 `@for` 區塊用於呈現重複元素。

```html
<!-- ingredient-list.component.html -->
<ul>
  @for (ingredient of ingredientList; track ingredient.name) {
    <li>{{ ingredient.quantity }} - {{ ingredient.name }}</li>
  }
</ul>
```

```ts
// ingredient-list.component.ts
@Component({
  standalone: true,
  selector: 'ingredient-list',
  templateUrl: './ingredient-list.component.html',
})
export class IngredientList {
  ingredientList = [
    {name: 'noodles', quantity: 1},
    {name: 'miso broth', quantity: 1},
    {name: 'egg', quantity: 2},
  ];
}
```

然而，與標準的 `for...of` 迴圈不同，您可能注意到有一個額外的 `track` 關鍵字。

#### `track` 屬性

當 Angular 呈現具有 `@for` 的元素清單時，那些項目之後可能會變更或移動。Angular 需要追蹤每個元素的任何重新排序，通常會將項目的某個屬性視為唯一識別碼或金鑰。

這確保清單中的任何更新都正確反映在 UI 中，並在 Angular 中適當追蹤，尤其是在狀態元素或動畫的情況下。

為了做到這一點，我們可以使用 `track` 關鍵字為 Angular 提供一個唯一金鑰。

## 下一步

有了決定何時以及如何呈現範本的能力，現在是時候學習我們如何處理大多數應用程式的某個重要面向：處理使用者輸入。

<docs-pill-row>
  <docs-pill title="處理使用者互動" href="essentials/handling-user-interaction" />
</docs-pill-row>

