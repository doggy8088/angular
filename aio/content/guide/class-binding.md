# 類別與樣式繫結

使用類別與樣式繫結，可以從元素的 `class` attribute 中加入和移除 CSS 類別名稱，並動態設定樣式。

## 先決條件

* [屬性繫結](guide/property-binding)

## 繫結到單一 CSS `class`

要建立單一類別繫結，請輸入下列內容：

`[class.sale]="onSale"`

當繫結的運算式 `onSale` 為 truthy 時，Angular 會加入該類別；當運算式為 falsy 時，則會移除該類別——`undefined` 除外。更多資訊請參閱[樣式委派](guide/style-precedence#styling-delegation)。

## 繫結到多個 CSS 類別

要繫結到多個類別，請輸入下列內容：

`[class]="classExpression"`

運算式可以是下列其中之一：

* 以空白分隔的類別名稱字串。
* 以類別名稱為鍵、以 truthy 或 falsy 運算式為值的物件。
* 類別名稱的陣列。

使用物件格式時，Angular 只會在類別的關聯值為 truthy 時加入該類別。

<div class="alert is-important">

對於任何類物件的運算式&mdash;例如 `object`、`Array`、`Map` 或 `Set`&mdash;物件的身分必須改變，Angular 才會更新類別清單。
只更新屬性而不改變物件身分是沒有效果的。

</div>

如果有多個繫結指向同一個類別名稱，Angular 會使用[樣式優先順序](guide/style-precedence)來決定採用哪個繫結。

下表摘要整理了類別繫結語法。

| 繫結類型 | 語法 | 輸入類型 | 輸入值範例 |
|:---                  |:---                         |:---                                                                         |:---                  |
| 單一類別繫結 | `[class.sale]="onSale"` | <code>boolean &verbar; undefined &verbar; null</code> | `true`, `false` |
| 多類別繫結 | `[class]="classExpression"` | `string` | `"my-class-1 my-class-2 my-class-3"` |
| 多重類別繫結 | `[class]="classExpression"` | <code>Record&lt;string, boolean &verbar; undefined &verbar; null&gt;</code> | `{foo: true, bar: false}` |
| 多類別繫結 | `[class]="classExpression"` | <code>Array&lt;string&gt;</code> | `['foo', 'bar']` |

## 繫結到單一樣式

要建立單一樣式繫結，請使用前綴 `style`，後面接一個點，再接 CSS 樣式的名稱。

例如，要設定 `width` 樣式，請輸入下列內容： `[style.width]="width"`

Angular 會將屬性設為繫結運算式的值，該值通常是字串。你也可以選擇性地加上單位後綴，例如 `em` 或 `%`，這需要數字型別。

1. 要以 dash-case 寫樣式，請輸入下列內容：

    <code-example language="html">&lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;</code-example>

2. 要以 camelCase 寫樣式，請輸入下列內容：

    <code-example language="html">&lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;</code-example>

## 繫結到多個樣式

要切換多個樣式，請繫結到 `[style]` attribute，例如 `[style]="styleExpression"`。`styleExpression` 可以是下列其中之一：

* 樣式的字串清單，例如 `"width: 100px; height: 100px; background-color: cornflowerblue;"`。
* 以樣式名稱為鍵、以樣式值為值的物件，例如 `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`。

請注意，不支援將陣列繫結到 `[style]`。

<div class="alert is-important">

將 `[style]` 繫結到物件運算式時，物件的身分必須改變，Angular 才會更新類別清單。
只更新屬性而不改變物件身分是沒有效果的。

</div>

### 單一與多樣式繫結範例

<code-example path="attribute-binding/src/app/single-and-multiple-style-binding.component.ts" header="nav-bar.component.ts"></code-example>

如果有多個繫結指向同一個樣式 attribute，Angular 會使用[樣式優先順序](guide/style-precedence)來決定採用哪個繫結。

下表摘要整理了樣式繫結語法。

| 繫結類型 | 語法 | 輸入類型 | 輸入值範例 |
|:---                             |:---                         |:---                                                                        |:---                  |
| 單一樣式繫結 | `[style.width]="width"` | <code>string &verbar; undefined &verbar; null</code> | `"100px"` |
| 單一樣式繫結（附單位） | `[style.width.px]="width"` | <code>number &verbar; undefined &verbar; null</code> | `100` |
| 多樣式繫結 | `[style]="styleExpression"` | `string` | `"width: 100px; height: 100px"` |
| 多重樣式繫結 | `[style]="styleExpression"` | <code>Record&lt;string, string &verbar; undefined &verbar; null&gt;</code> | `{width: '100px', height: '100px'}` |

{@a styling-precedence}
## 樣式優先順序

單一 HTML 元素的 CSS 類別清單與樣式值，可以繫結到多個來源（例如，來自多個指令的宿主繫結）。

## 下一步

* [元件樣式](https://angular.io/guide/component-styles)
* [Angular 動畫簡介](https://angular.io/guide/animations)

@reviewed 2022-05-09
