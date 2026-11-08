# 控制流程

Angular 範本支援控制流程區塊，讓你能依條件顯示、隱藏與重複元素。

## 以 `@if`、`@else if` 與 `@else` 依條件顯示內容

當條件運算式為 truthy 時，`@if` 區塊會顯示其內容：

```angular-html
@if (a > b) {
  <p>{{ a }} is greater than {{ b }}</p>
}
```

如果你想顯示替代內容，可以提供任意數量的 `@else if` 區塊，以及一個 `@else` 區塊。

```angular-html
@if (a > b) {
  {{ a }} is greater than {{ b }}
} @else if (b > a) {
  {{ a }} is less than {{ b }}
} @else {
  {{ a }} is equal to {{ b }}
}
```

### 參照條件運算式的結果

`@if` 條件支援將條件運算式的結果存入變數，以便在區塊內重複使用。

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

這在參照較長的運算式時很有用，能讓範本更容易閱讀與維護。

## 以 `@for` 區塊重複內容 {#repeat-content-with-the-for-block}

`@for` 區塊會逐一走訪集合，並重複算繪區塊的內容。集合可以是任何 JavaScript [iterable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols)，但 Angular 對 `Array` 值有額外的效能最佳化。

典型的 `@for` 迴圈如下所示：

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

Angular 的 `@for` 區塊不支援 JavaScript 的 `continue` 或 `break` 這類改變流程的陳述式。

### 為什麼 `@for` 區塊中的 `track` 很重要？ {#why-is-track-in-for-blocks-important}

`track` 運算式讓 Angular 能維持你的資料與頁面上 DOM 節點之間的對應關係。這讓 Angular 在資料變更時，只執行最少必要的 DOM 操作，進而最佳化效能。

有效運用 track，能在對資料集合進行迴圈時大幅提升應用程式的算繪效能。

請在 `track` 運算式中選用能唯一識別每個項目的屬性。如果你的資料模型包含唯一識別屬性，通常是 `id` 或 `uuid`，請使用該值。如果你的資料沒有這類欄位，強烈建議新增一個。

對於永不變更的靜態集合，你可以使用 `$index`，告訴 Angular 依項目在集合中的索引來追蹤每個項目。

如果沒有其他選擇，你可以使用項目本身作為追蹤鍵。這會告訴 Angular 使用三等號運算子（`===`）依參照同一性來追蹤項目。請盡量避免這個選項，因為它可能導致算繪更新明顯變慢：Angular 無法對應哪筆資料項目對應到哪些 DOM 節點。

```angular-html
@for (item of items; track item) {
  {{ item.name }}
}
```

NOTE: 與 `*ngFor` 不同，`@for` 區塊優先重複使用檢視。如果被追蹤的屬性變更，但物件參照維持不變，Angular 會更新檢視的繫結（包括元件輸入），而不是銷毀並重新建立整個元素。

### `@for` 區塊中的上下文變數

在 `@for` 區塊內，有幾個隱含變數永遠可用：

| 變數     | 意義                   |
| -------- | ---------------------- |
| `$count` | 被走訪集合中的項目數量 |
| `$index` | 目前列的索引           |
| `$first` | 目前列是否為第一列     |
| `$last`  | 目前列是否為最後一列   |
| `$even`  | 目前列的索引是否為偶數 |
| `$odd`   | 目前列的索引是否為奇數 |

這些變數永遠以這些名稱提供，但可以透過 `let` 區段為它們取別名：

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

別名在巢狀 `@for` 區塊中很有用，讓內層 `@for` 區塊能讀取外層 `@for` 區塊的變數。

### 以 `@empty` 區塊為 `@for` 區塊提供備援內容

你可以選擇在 `@for` 區塊內容之後緊接著加入 `@empty` 區段。當集合中沒有任何項目時，會顯示 `@empty` 區塊的內容：

```angular-html
@for (item of items; track item.name) {
  <li>{{ item.name }}</li>
} @empty {
  <li>There are no items.</li>
}
```

## 以 `@switch` 區塊依條件顯示內容

雖然 `@if` 區塊適用於大多數情境，`@switch` 區塊提供了另一種依條件算繪資料的語法。它的語法與 JavaScript 的 `switch` 陳述式十分相似。

```angular-html
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer')
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```

條件運算式的值會使用三等號（`===`）運算子與各 case 運算式進行比較。

`@switch` **沒有 fallthrough 行為**，因此你不需要在區塊中寫相當於 `break` 或 `return` 的陳述式。

你可以連續寫多個 `@case` 陳述式，為單一區塊指定多個條件。

你也可以選擇加入 `@default` 區塊。當前面所有 case 運算式都不符合 switch 值時，會顯示 `@default` 區塊的內容。

如果沒有任何 `@case` 符合運算式，也沒有 `@default` 區塊，就不會顯示任何內容。

### 窮舉型別檢查

`@switch` 支援窮舉型別檢查，讓 Angular 能在編譯時期驗證聯合型別的所有可能值都已被處理。

透過使用 `@default never;`，你可以明確宣告不應再有其他剩餘情況。如果日後聯合型別擴充、新增了未被 @case 涵蓋的情況，Angular 的範本型別檢查器會回報錯誤，協助你及早發現遺漏的分支。

NOTE: 窮舉檢查依賴 TypeScript 的型別縮小（type narrowing），這只對變數有效。如果 switch 條件是函式呼叫或訊號（例如 `@switch (state())`），就無法運作。若要繞過此限制，請將訊號指派給 `@let` 變數，例如：`@let mySignal = this.mySignal()`。

```angular-ts
@Component({
  template: `
    @switch (state) {
      @case ('loggedOut') {
        <button>Login</button>
      }

      @case ('loggedIn') {
        <p>Welcome back!</p>
      }

      @default never;
      <!-- throws because @case ('loading') is missing -->
    }
  `,
})
export class AppComponent {
  state: 'loggedOut' | 'loading' | 'loggedIn' = 'loggedOut';
}
```

當被 switch 的運算式巢狀於聯合型別之中時，你必須明確指定要檢查窮舉性的運算式。

<!-- prettier-ignore -->
```angular-ts
@Component({
  template: `
    @switch (state.mode) {
      @case ('show') {
        {{ state.menu }};
      }
      @case ('hide') {}
      @default never(state);
    }
  `,
})
export class App {
  state!: {mode: 'hide'} | {mode: 'show'; menu: number};
}
```
