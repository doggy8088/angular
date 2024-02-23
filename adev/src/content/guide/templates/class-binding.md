# Class 和 style 繫結

使用類別和樣式繫結來新增和移除 CSS 類別名稱，從元素的 `class` 屬性中新增和移除，並動態設定樣式。

## 繫結到單一 CSS `class`

若要建立單一類別繫結，請鍵入下列內容：

`[class.sale]="onSale"`

Angular 在繫結表達式 `onSale` 為真時加入類別，並在表達式為假時移除類別，但 `undefined` 除外。

## 繫結到多個 CSS 類別

若要繫結到多個類別，輸入下列內容：

`[class]="classExpression"`

表達式可以是其中之一：

* 以空格分隔的類別名稱字串。
* 以類別名稱為鍵值，以真或假表達式為值的物件。
* 類別名稱陣列。

使用物件格式時，Angular 僅在關聯值為真時才新增類別。

IMPORTANT: 對於任何物件的表達式，例如 `object`、`Array`、`Map` 或 `Set`，物件的身份必須改變才能讓 Angular 更新類別清單。
更新屬性而不改變物件的身份不會有任何效果。

如果有多個繫結至相同類別名稱，Angular 使用樣式優先權來決定要使用哪一個繫結。

下表總結了類別繫結語法。

| 繫結類型         | 語法                      | 輸入類型                                                                  | 範例輸入值 |
|:---                  |:---                         |:---                                                                         |:---                  |
| 單一類別繫結 | `[class.sale]="onSale"`     | boolean &verbar; undefined &verbar; null                       | `true`, `false`                      |
| 多重類別繫結  | `[class]="classExpression"` | `string`                                                                    | `"my-class-1 my-class-2 my-class-3"` |
| 多重類別繫結  | `[class]="classExpression"` | Record&lt;string, boolean &verbar; undefined &verbar; null&gt; | `{foo: true, bar: false}`            |
| 多重類別繫結  | `[class]="classExpression"` | Array&lt;string&gt;                                            | `['foo', 'bar']`                     |

## 繫結至單一樣式

若要建立單一樣式繫結，請使用前綴 `style`，後接一個句點和 CSS 樣式的名稱。

例如，要設定 `width` 樣式，請輸入以下內容：`[style.width]="width"`

Angular 將屬性設定為繫結表達式的值，該值通常是字串。您也可以選擇性地新增像 `em` 或 `%` 之類的單位延伸，這需要數字類型。

1. 若要以 dash-case 撰寫樣式，請鍵入以下內容：

    <docs-code language="html">&lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;</docs-code>

2. 若要以 camelCase 撰寫樣式，請鍵入以下內容：

    <docs-code language="html">&lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;</docs-code>

## 繫結到多種樣式

若要切換多種樣式，請繫結至 `[style]` 屬性，例如 `[style]="styleExpression"`。`styleExpression` 可以是下列其中之一：

* 一個樣式的字串清單，例如 `"width: 100px; height: 100px; background-color: cornflowerblue;"`。
* 一個物件，樣式名稱為鍵，樣式值為值，例如 `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`。

請注意，不支援將陣列繫結至 `[style]`。

重要：當將 `[style]` 繫結至物件表達式時，物件識別碼必須變更，Angular 才能更新類別清單。
更新屬性但不變更物件識別碼沒有任何作用。

### 單一和多重樣式繫結範例

<docs-code path="adev/src/content/examples/attribute-binding/src/app/single-and-multiple-style-binding.component.ts" header="nav-bar.component.ts"/>

如果存在多個繫結到相同樣式屬性的情況，Angular 會使用樣式優先順序來決定要使用哪個繫結。

下表總結樣式繫結語法。

| 繫結類型                      | 語法                        | 輸入類型                                                                  | 範例輸入值 |
|:---                             |:---                         |:---                                                                        |:---                  |
| 單一樣式繫結                    | `[style.width]="width"`     | 字串 &verbar; 未定義 &verbar; null                        | `"100px"`                           |
| 帶單位的單一樣式繫結            | `[style.width.px]="width"`  | 數字 &verbar; 未定義 &verbar; null                        | `100`                               |
| 多重樣式繫結                    | `[style]="styleExpression"` | `字串`                                                                    | `"width: 100px; height: 100px"`     |
| 多重樣式繫結                    | `[style]="styleExpression"` | 記錄&lt;字串, 字串 &verbar; 未定義 &verbar; null&gt; | `{width: '100px', height: '100px'}` |

## 樣式優先權

單一 HTML 元素可以讓其 CSS 類別清單和樣式值繫結至多個來源（例如，來自多個指令的主機繫結）。

## 接下來

<docs-pill-row>
  <docs-pill href="/guide/components/styling" title="元件造型"/>
  <docs-pill href="/guide/animations" title="Angular 動畫簡介"/>
</docs-pill-row>
