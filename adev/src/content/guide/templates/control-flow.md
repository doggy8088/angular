# 內建控制流程 {#built-in-control-flow}

Angular 範本支援控制流程區塊，讓你能依條件顯示、隱藏與重複元素。

IMPORTANT: Angular 內建控制流程目前處於[開發者預覽](reference/releases#developer-preview)階段。它已經可以試用，但在成為穩定版之前仍可能有所變更。

## `@if` 區塊條件式 {#if-block-conditionals}

當條件運算式為 truthy 時，`@if` 區塊會顯示其內容：

```html
@if (a > b) {
{{a}} is greater than {{b}}
}
```

`@if` 區塊可以有關聯的一個或多個 `@else` 區塊。緊接在 `@if` 區塊之後，你可以選擇性地指定任意數量的 `@else if` 區塊和一個 `@else` 區塊：

```html
@if (a > b) {
{{a}} is greater than {{b}}
} @else if (b > a) {
{{a}} is less than {{b}}
} @else {
{{a}} is equal to {{b}}
}
```

### 參照條件運算式的結果 {#referencing-the-conditional-expressions-result}

新的內建 `@if` 條件式支援參照運算式的結果，以因應常見的程式編寫模式：

```html
@if (users$ | async; as users) {
{{ users.length }}
}
```

## `@for` 區塊 - 重複器 {#for-block---repeaters}

`@for` 會針對集合中的每個項目重複算繪區塊的內容。集合可以表示為任何 JavaScript [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)，但使用一般的 `Array` 有效能上的優勢。基本的 `@for` 迴圈如下所示：

```html
@for (item of items; track item.id) {
{{ item.name }}
}
```

### 用 `track` 計算兩個集合的差異 {#track-for-calculating-difference-of-two-collections}

`track` 運算式的值決定了一個鍵，用來將陣列項目與 DOM 中的檢視建立關聯。清楚標示項目的身分，能讓 Angular 在集合中的項目被新增、移除或移動時，只執行最少量的 DOM 操作。

有效運用 track，能在對資料集合進行迴圈時大幅提升應用程式的效能。

對於不會變動的集合（沒有項目被移動、新增或刪除），使用 `track $index` 是有效率的策略。對於資料可變或頻繁變更的集合，請選用能唯一識別每個項目的屬性，作為你的 track 運算式。

請注意，對不可變資料結構使用物件同一性作為 track 鍵，可能會增加 DOM 重建的機會，進而帶來不必要的效能成本。

### `$index` 與其他上下文變數 {#index-and-other-contextual-variables}

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

```html
@for (item of items; track item.id; let idx = $index, e = $even) {
Item #{{ idx }}: {{ item.name }}
}
```

別名在巢狀 `@for` 區塊的情況下特別有用，因為上下文變數名稱可能會互相衝突。

### `empty` 區塊 {#empty-block}

你可以選擇在 `@for` 區塊內容之後緊接著加入 `@empty` 區段。當集合中沒有任何項目時，會顯示 `@empty` 區塊的內容：

```html
@for (item of items; track item.name) {
<li> {{ item.name }}</li>
} @empty {
<li> There are no items.</li>
}
```

## `@switch` 區塊 - 選取 {#switch-block---selection}

`switch` 的語法與 `if` 非常相似，靈感來自 JavaScript 的 `switch` 陳述式：

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

條件運算式的值會使用 `===` 運算子與 case 運算式進行比較。

`@switch` **沒有 fallthrough**，因此你不需要相當於 `break` 或 `return` 陳述式的寫法。

`@default` 區塊是選擇性的，可以省略。如果沒有任何 `@case` 符合運算式，也沒有 `@default` 區塊，就不會顯示任何內容。

## 內建控制流程與 `NgIf`、`NgSwitch` 和 `NgFor` 結構指令 {#built-in-control-flow-and-the-ngif-ngswitch-and-ngfor-structural-directives}

`@if` 區塊取代了 `*ngIf`，用來表達 UI 中的條件部分。

`@switch` 區塊取代了 `ngSwitch`，並帶來重大好處：

* 它不需要用容器元素來承載條件運算式或每個條件範本；
* 它支援範本型別檢查，包括每個分支內的型別縮小。

`@for` 區塊取代了 `*ngFor` 的迭代功能，與其前身結構指令 `NgFor` 相比，有幾點不同：

* 追蹤運算式（計算對應物件身分的鍵）是必要的，但使用體驗更好（只需要寫一個運算式，不必建立 `trackBy` 方法）；
* 它使用新的最佳化演算法，計算因應集合變更所需執行的最少 DOM 操作數量，而非 Angular 可自訂的差異比對實作（`IterableDiffer`）；
* 它支援 `@empty` 區塊。

`track` 設定取代了 `NgFor` 的 `trackBy` 函式概念。由於 `@for` 是內建的，我們能提供比傳遞 `trackBy` 函式更好的體驗，直接使用代表鍵的運算式。從 `trackBy` 遷移到 `track`，可以透過呼叫 `trackBy` 函式來達成：

```html
@for (item of items; track itemId($index, item)) {
{{ item.name }}
}
```
