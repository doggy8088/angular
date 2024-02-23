# 內建控制流程

Angular 模板支援 *控制流程區塊*，讓你可以有條件地顯示、隱藏和重複元素。

重要提示：Angular 內建控制流程目前仍處於 [開發人員預覽](reference/releases#developer-preview) 階段。它已經可以試用，但在穩定之前可能會有所變更。

## `@if` 區塊條件

當其條件表達式為真值時，`@if` 區塊會條件式顯示其內容：

```html
@if (a > b) {
   {{a}} is greater than {{b}}
}
```

`@if` 區塊可能有一個或多個關聯的 `@else` 區塊。在 `@if` 區塊之後，您可以選擇指定任意數量的 `@else if` 區塊和一個 `@else` 區塊：

```html
@if (a > b) {
  {{a}} is greater than {{b}}
} @else if (b > a) {
  {{a}} is less than {{b}}
} @else {
  {{a}} is equal to {{b}}
}
```

### 參照條件式運算式的結果

新的內建 `@if` 條件式支援參照表達式結果以保持常見編碼模式的解決方案：

```html
@if (users$ | async; as users) {
  {{ users.length }}
}
```

## `@for` 區塊 - 重複器

`@for` 重複呈現區塊中的內容，以供集合中的每個項目使用。集合可以表示為任何 JavaScript [可叠代](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Iteration_protocols) 項目，但使用常規 `Array` 會有性能優勢。基本的 `@for` 循環如下所示：

```html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

### `track` 用於計算兩個集合的差異

`track` 表達式的值決定用於將陣列項目與 DOM 中的檢視關聯的鍵。清楚指出項目身分，讓 Angular 能在陣列中新增、移除或移動項目時執行最少數量的 DOM 操作。

在 Angular 應用程式中，重複運算不變資料而不使用 `trackBy` 是最常見的效能問題原因之一。由於效能不佳的可能性，`@for` 迴圈需要 `track` 表達式。有疑問時，使用 `track $index` 是個不錯的預設值。

### `$index` 和其他情境變數

在 `@for` 內容中，數個隱含變數永遠可用：

| 變數 | 意義 |
| -------- | ------- |
| `$count` | 反覆運算的集合中的項目數目 |
| `$index` | 目前列的索引 |
| `$first` | 目前列是否為第一列 |
| `$last` | 目前列是否為最後一列 |
| `$even` | 目前列索引是否為偶數 |
| `$odd` | 目前列索引是否為奇數 |

這些變數總是使用這些名稱，但可透過 `let` 片段別名：

```html
@for (item of items; track item.id; let idx = $index, e = $even) {
  Item #{{ idx }}: {{ item.name }}
}
```

在使用嵌套的 `@for` 區塊時別名特別有用，因為上下文變數名稱可能會發生衝突。

### `empty` 區塊

您也可以在 `@for` 區塊內容之後立即包含 `@empty` 區段。當沒有項目時，`@empty` 區塊的內容會顯示：

```html
@for (item of items; track item.name) {
  <li> {{ item.name }} </li>
} @empty {
  <li> There are no items. </li>
}
```

## `@switch` 區塊 - 選擇

`switch` 的語法和 `if` 非常相似，並受到 JavaScript `switch` 語句的啟發：

```html
@switch (condition) {
  @case (caseA) {
    Case A.
  }
  @case (caseB) {
    Case B.
  }
  @default {
    Default case.
  }
}
```

條件式的值使用 `===` 運算子與案例式進行比較。

**`@switch` 沒有穿透執行**，因此您不需要等同於 `break` 或 `return` 語句。

`@default` 區塊是可選的，可以省略。如果沒有 `@case` 與表達式相符，也沒有 `@default` 區塊，則不會顯示任何內容。

## 內建控制流程和 `NgIf`、`NgSwitch` 和 `NgFor` 結構型指令

`@if` 區塊取代 `*ngIf`，用於表達 UI 的條件部分。

`@switch` 區塊取代 `ngSwitch`，具有以下主要優點：

* 它不需要容器元素來保存條件表達式或每個條件範本；
* 它支援範本類型檢查，包括每個分支中的類型縮小。

@for` 區塊取代 `*ngFor` 進行反覆，與其結構型指令 `NgFor` 前身相比有幾個差異：

* 追蹤表達式（計算與物件識別對應的鍵）是強制性的，但具有更好的便利性（只需寫一個表達式即可，而不是建立 `trackBy` 方法）；
* 使用新的最佳化演算法計算最少數量的 DOM 操作，以響應集合的變更，而不是 Angular 的可自定義比較實作（`IterableDiffer`）；
* 支援 `@empty` 區塊。

`track` 設定取代了 `NgFor` 的 `trackBy` 函數概念。由於 `@for` 是內建的，因此我們可以提供比傳遞 `trackBy` 函數更好的體驗，並直接使用代表鍵的表達式。可以透過呼叫 `trackBy` 函數，從 `trackBy` 遷移到 `track`：

```html
@for (item of items; track itemId($index, item)) {
  {{ item.name }}
}
```

