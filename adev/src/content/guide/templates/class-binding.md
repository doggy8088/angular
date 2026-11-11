# 類別與樣式繫結 {#class-and-style-binding}

使用類別與樣式繫結，可以從元素的 `class` attribute 中加入和移除 CSS 類別名稱，並動態設定樣式。

## 繫結到單一 CSS `class` {#binding-to-a-single-css-class}

要建立單一類別繫結，請輸入下列內容：

`[class.sale]="onSale"`

當繫結運算式 `onSale` 為 truthy 時，Angular 會加入該類別；當運算式為 falsy 時，則會移除該類別，但 `undefined` 是例外。`undefined` 的這個行為，在同一個元素上跨多個指令對同一個類別有多個繫結時特別有用。

## 繫結到多個 CSS 類別 {#binding-to-multiple-css-classes}

要繫結到多個類別，請輸入下列內容：

`[class]="classExpression"`

運算式可以是下列其中之一：

* 以空白分隔的類別名稱字串。
* 以類別名稱為鍵、以 truthy 或 falsy 運算式為值的物件。
* 類別名稱的陣列。

使用物件格式時，Angular 只會在類別的關聯值為 truthy 時加入該類別。

IMPORTANT: 使用任何物件類型的運算式（例如 `object`、`Array`、`Map` 或 `Set`）時，物件的同一性必須改變，Angular 才會更新類別清單。
只更新屬性而不改變物件同一性，不會有效果。

如果同一個類別名稱有多個繫結，Angular 會使用樣式優先順序來決定要使用哪一個繫結。

下表摘要整理了類別繫結語法。

| 繫結類型             | 語法                        | 輸入類型                                                                    | 輸入值範例                   |
|:---                  |:---                         |:---                                                                         |:---                  |
| 單一類別繫結         | `[class.sale]="onSale"`     | <code>boolean | undefined | null</code>                                   | `true`, `false`                      |
| 多類別繫結           | `[class]="classExpression"` | `string`                                                                    | `"my-class-1 my-class-2 my-class-3"` |
| 多類別繫結           | `[class]="classExpression"` | <code>Record<string, boolean | undefined | null></code>                   | `{foo: true, bar: false}`            |
| 多類別繫結           | `[class]="classExpression"` | <code>Array<string></code>                                                  | `['foo', 'bar']`                     |

## 繫結到單一樣式 {#binding-to-a-single-style}

要建立單一樣式繫結，請使用前綴 `style`，後面接一個點，再接 CSS 樣式的名稱。

例如，要設定 `width` 樣式，請輸入下列內容： `[style.width]="width"`

Angular 會將屬性設為繫結運算式的值，該值通常是字串。你也可以選擇性地加上單位後綴，例如 `em` 或 `%`，這需要數字型別。

1. 要以 dash-case 寫樣式，請輸入下列內容：

    <docs-code language="html"><nav [style.background-color]="expression"></nav></docs-code>

2. 要以 camelCase 寫樣式，請輸入下列內容：

    <docs-code language="html"><nav [style.backgroundColor]="expression"></nav></docs-code>

## 繫結到多個樣式 {#binding-to-multiple-styles}

要切換多個樣式，請繫結到 `[style]` attribute，例如 `[style]="styleExpression"`。`styleExpression` 可以是下列其中之一：

* 樣式的字串清單，例如 `"width: 100px; height: 100px; background-color: cornflowerblue;"`。
* 以樣式名稱為鍵、以樣式值為值的物件，例如 `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`。

請注意，不支援將陣列繫結到 `[style]`。

IMPORTANT: 將 `[style]` 繫結到物件運算式時，物件的同一性必須改變，Angular 才會更新類別清單。
只更新屬性而不改變物件同一性，不會有效果。

### 單一與多樣式繫結範例 {#single-and-multiple-style-binding-example}

<docs-code path="adev/src/content/examples/attribute-binding/src/app/single-and-multiple-style-binding.component.ts" header="nav-bar.component.ts"/>

如果同一個樣式 attribute 有多個繫結，Angular 會使用樣式優先順序來決定要使用哪一個繫結。

下表摘要整理了樣式繫結語法。

| 繫結類型                | 語法                        | 輸入類型                                                                   | 輸入值範例                          |
|:---                             |:---                         |:---                                                                        |:---                  |
| 單一樣式繫結                    | `[style.width]="width"`     | <code>string | undefined | null</code>                                   | `"100px"`                           |
| 帶單位的單一樣式繫結            | `[style.width.px]="width"`  | <code>number | undefined | null</code>                                   | `100`                               |
| 多樣式繫結                      | `[style]="styleExpression"` | `string`                                                                   | `"width: 100px; height: 100px"`     |
| 多樣式繫結                      | `[style]="styleExpression"` | <code>Record<string, string | undefined | null></code>                   | `{width: '100px', height: '100px'}` |

## 樣式優先順序 {#styling-precedence}

單一 HTML 元素的 CSS 類別清單與樣式值，可以繫結到多個來源（例如，來自多個指令的宿主繫結）。

## 下一步 {#whats-next}

<docs-pill-row>
  <docs-pill href="/guide/components/styling" title="元件樣式"/>
  <docs-pill href="/guide/animations" title="Angular 動畫簡介"/>
</docs-pill-row>
