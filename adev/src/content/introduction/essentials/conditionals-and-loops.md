<docs-decorative-header title="條件與迴圈" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
依據動態資料，有條件地顯示及／或重複內容。
</docs-decorative-header>

使用像 Angular 這樣的框架，優點之一是它為開發者常見的問題提供了內建的解決方案。例如：依據特定條件顯示內容、依據應用程式資料算繪項目清單等等。

為了解決這類問題，Angular 使用內建的控制流程區塊，告訴框架應該在何時、以何種方式算繪你的範本。

## 條件式算繪 {#conditional-rendering}

開發者最常遇到的情境之一，就是想依據某個條件，在範本中顯示或隱藏內容。

一個常見的例子是，依據使用者的權限等級，決定是否在畫面上顯示特定的控制項。

### `@if` 區塊 {#if-block}

和 JavaScript 的 `if` 陳述式類似，Angular 使用 `@if` 控制流程區塊，有條件地隱藏與顯示範本的一部分及其內容。

```angular-ts
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

在這個範例中，Angular 只有在 `isAdmin` 屬性為 true 時，才會算繪 `<button>` 元素。否則，它就不會出現在頁面上。

### `@else` 區塊 {#else-block}

雖然 `@if` 區塊在許多情況下很有幫助，但當條件不成立時，通常也需要顯示備用的 UI。

例如，在 `UserControls` 元件中，與其顯示一片空白的畫面，不如讓使用者知道他們是因為尚未通過驗證，才看不到任何內容，這樣對使用者更有幫助。

當你需要備用內容時，就像 JavaScript 的 `else` 子句一樣，加入 `@else` 區塊即可達到相同的效果。

```angular-ts
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

## 算繪清單 {#rendering-a-list}

開發者另一個常見的情境，是需要算繪一份項目清單。

### `@for` 區塊 {#for-block}

和 JavaScript 的 `for...of` 迴圈類似，Angular 提供了 `@for` 區塊，用來算繪重複的元素。

```angular-html
<!-- ingredient-list.component.html -->
<ul>
  @for (ingredient of ingredientList; track ingredient.name) {
    <li>{{ ingredient.quantity }} - {{ ingredient.name }}</li>
  }
</ul>
```

```angular-ts
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

不過，和標準的 `for...of` 迴圈不同，你可能已經注意到，這裡多了一個 `track` 關鍵字。

#### `track` 屬性 {#track-property}

當 Angular 用 `@for` 算繪元素清單時，其中的項目之後可能會變更或移動。Angular 需要在任何重新排序的過程中追蹤每個元素，通常的做法是把項目的某個屬性當作唯一識別碼或鍵。

這樣能確保清單的任何更新都正確地反映在 UI 上，並在 Angular 內部被妥善追蹤，特別是對於有狀態的元素或動畫而言。

為了做到這一點，我們可以用 `track` 關鍵字，為 Angular 提供一個唯一的鍵。

## 下一步 {#next-step}

有了決定範本何時、如何算繪的能力之後，接著來學習如何處理大多數應用程式的一個重要面向：處理使用者輸入。

<docs-pill-row>
  <docs-pill title="處理使用者互動" href="essentials/handling-user-interaction" />
</docs-pill-row>
