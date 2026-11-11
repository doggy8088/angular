# 運算式語法

Angular 運算式以 JavaScript 為基礎，但在一些關鍵方面有所不同。本指南將逐一說明 Angular 運算式與標準 JavaScript 之間的異同。

## 值字面值

Angular 支援 JavaScript [字面值](https://developer.mozilla.org/en-US/docs/Glossary/Literal)的一個子集。

### 支援的值字面值

| 字面值類型     | 範例值                          |
| -------------- | ------------------------------- |
| 字串           | `'Hello'`, `"World"`            |
| 布林           | `true`, `false`                 |
| 數字           | `123`, `3.14`                   |
| 物件           | `{name: 'Alice'}`               |
| 陣列           | `['Onion', 'Cheese', 'Garlic']` |
| null           | `null`                          |
| 範本字串       | `` `Hello ${name}` ``           |

### 不支援的字面值

| 字面值類型           | 範例值                    |
| -------------------- | ------------------------- |
| RegExp               | `/\d+/`                  |
| 標記範本字串         | `` tag`Hello ${name}` `` |

## 全域值

Angular 運算式支援下列[全域值](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)：

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

不支援任何其他 JavaScript 全域值。常見的 JavaScript 全域值包括 `Number`、`Boolean`、`NaN`、`Infinity`、`parseInt` 等。

## 區域變數

Angular 會在特定上下文中，自動提供特殊的區域變數供運算式使用。這些特殊變數一律以貨幣符號（`$`）開頭。

例如，`@for` 區塊會提供數個與迴圈資訊對應的區域變數，例如 `$index`。

## 支援哪些運算子？

### 支援的運算子

Angular 支援下列來自標準 JavaScript 的運算子。

| 運算子                        | 範例                                   |
| ----------------------------- | -------------------------------------- |
| 加法／串接                    | `1 + 2`                                |
| 減法                          | `52 - 3`                               |
| 乘法                          | `41 * 6`                               |
| 除法                          | `20 / 4`                               |
| 餘數（模數）                  | `17 % 5`                               |
| 括號                          | `9 * (8 + 4)`                          |
| 條件（三元）                  | `a > b ? true : false`                 |
| 邏輯 AND                      | `&&`                                   |
| 邏輯 OR                       | `\|\|`                                 |
| 邏輯 NOT                      | `!`                                    |
| 空值合併                      | `const foo = null ?? 'default'`        |
| 比較運算子                    | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==` |
| 一元否定                      | `const y = -x`                         |
| 一元正號                      | `const x = +y`                         |
| 屬性存取子                    | `person['name'] = 'Mirabel'`           |

Angular 運算式另外還支援下列非標準運算子：

| 運算子                          | 範例                           |
| ------------------------------- | ------------------------------ |
| [管道](/guide/templates/pipes)  | `{{ total \| currency }}`      |
| 選擇性串連\*                    | `someObj.someProp?.nestedProp` |
| 非空斷言（TypeScript）          | `someObj!.someProp`            |

NOTE: 選擇性串連的行為與標準 JavaScript 版本不同：當 Angular 的選擇性串連運算子左側為 `null` 或 `undefined` 時，它會回傳 `null`，而不是 `undefined`。

### 不支援的運算子

| 運算子              | 範例                              |
| ------------------- | --------------------------------- |
| 所有位元運算子      | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| 指派運算子          | `=`                               |
| 物件解構            | `const { name } = person`         |
| 陣列解構            | `const [firstItem] = items`       |
| 逗號運算子          | `x = (x++, x)`                    |
| typeof              | `typeof 42`                       |
| void                | `void 1`                          |
| in                  | `'model' in car`                  |
| instanceof          | `car instanceof Automobile`       |
| new                 | `new Car()`                       |

## 運算式的詞彙上下文

Angular 運算式會在元件類別的上下文中評估，同時也會參照任何相關的[範本變數](/guide/templates/variables)、區域變數與全域值。

參照元件類別成員時，`this` 永遠是隱含的。然而，如果範本宣告了與成員同名的[範本變數](guide/templates/variables)，該變數會遮蔽該成員。你可以明確使用 `this.` 來無歧義地參照這類類別成員。這在建立會遮蔽類別成員的 `@let` 宣告時很有用，例如為了縮小訊號型別範圍。

## 宣告

一般而言，Angular 運算式不支援宣告。這包括但不限於：

| 宣告                        | 範例                                        |
| --------------------------- | ------------------------------------------- |
| 變數                        | `let label = 'abc'`, `const item = 'apple'` |
| 函式                        | `function myCustomFunction() { }`           |
| 箭頭函式                    | `() => { }`                                 |
| 類別                        | `class Rectangle { }`                       |

# 事件監聽器陳述式 {#event-listener-statements}

事件處理常式是**陳述式**，而非運算式。雖然它們支援與 Angular 運算式相同的全部語法，但有兩個關鍵差異：

1. 陳述式**確實支援**指派運算子（但不支援解構指派）
1. 陳述式**不支援**管道
