# 樣式優先順序

當有多個繫結指向同一個類別名稱或樣式屬性時，Angular 會使用一組優先順序規則來決定要對元素套用哪些類別或樣式。這些規則指定了哪些與樣式及類別相關的繫結具有優先權。此樣式優先順序如下，從最具體、優先順序最高，到最不具體、優先順序最低：

1.  範本繫結最為具體，因為它們直接且專門地套用到元素上，所以具有最高的優先順序。

    | 繫結類型 | 範例 |
    |:---              |:---     |
    | 屬性繫結 | <code-example format="html" hideCopy language="html"> &lt;div [class.foo]="hasFoo"&gt; </code-example> <code-example format="html" hideCopy language="html" >&lt;div [style.color]="color"&gt; </code-example> |
    | 對映繫結 | <code-example format="html" hideCopy language="html"> &lt;div [class]="classExpression"&gt; </code-example> <code-example format="html" hideCopy language="html"> &lt;div [style]="styleExpression"&gt; </code-example> |
    | 靜態值 | <code-example format="html" hideCopy language="html"> &lt;div class="foo"&gt; </code-example> <code-example format="html" hideCopy language="html"> &lt;div style="color: blue"&gt; </code-example> |

1.  指令主元素繫結較不具體，因為你可以在多個位置使用指令，所以其優先順序比範本繫結低。

    | 繫結類型 | 範例 |
    |:---              |:---     |
    | 屬性繫結 | <code-example format="typescript" hideCopy language="typescript"> host: {'[class.foo]': 'hasFoo'} </code-example> <code-example format="typescript" hideCopy language="typescript"> host: {'[style.color]': 'color'} </code-example> |
    | 對映繫結 | <code-example format="typescript" hideCopy language="typescript"> host: {'[class]': 'classExpr'} </code-example> <code-example format="typescript" hideCopy language="typescript"> host: {'[style]': 'styleExpr'} </code-example> |
    | 靜態值 | <code-example format="typescript" hideCopy language="typescript"> host: {'class': 'foo'} </code-example> <code-example format="typescript" hideCopy language="typescript"> host: {'style': 'color: blue'} </code-example> |

1.  元件主元素繫結的優先順序最低。

    | 繫結類型 | 範例 |
    |:---              |:---     |
    | 屬性繫結 | <code-example format="typescript" hideCopy language="typescript"> host: {'[class.foo]': 'hasFoo'} </code-example> <code-example format="typescript" hideCopy language="typescript">host: {'[style.color]': 'color'} </code-example> |
    | 對映繫結 | <code-example format="typescript" hideCopy language="typescript"> host: {'[class]': 'classExpression'} </code-example> <code-example format="typescript" hideCopy language="typescript"> host: {'[style]': 'styleExpression'} </code-example> |
    | 靜態值 | <code-example format="typescript" hideCopy language="typescript"> host: {'class': 'foo'} </code-example> <code-example format="typescript" hideCopy language="typescript"> host: {'style': 'color: blue'} </code-example> |

## 優先順序與具體程度

在以下範例中，繫結到特定類別（例如 `[class.special]`）的優先順序高於一般的 `[class]` 繫結。同樣地，繫結到特定樣式（例如 `[style.color]`）的優先順序高於一般的 `[style]` 繫結。

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="basic-specificity"></code-example>

## 不同來源的繫結的優先順序

具體程度規則也適用於來自不同來源的繫結。一個元素可以擁有來自其自身範本的繫結、來自相符指令上的主元素繫結，以及來自相符元件上的主元素繫結。

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="source-specificity"></code-example>

## 繫結與靜態屬性的優先順序

繫結的優先順序高於靜態屬性，因為繫結是動態的。在以下情形中，`class` 與 `[class]` 的具體程度相似，但 `[class]` 繫結的優先順序較高。

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="dynamic-priority"></code-example>

<a id="styling-delegation"></a>

## 委派給優先順序較低的樣式

優先順序較高的樣式可以使用 `undefined` 值，委派給優先順序較低的樣式。舉例來說，請看下列範本：

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="style-delegation"></code-example>

假設 `dirWithHostBinding` 指令與 `comp-with-host-binding` 元件都有一個 `[style.width]` 主元素繫結。

<code-example header="src/app/comp-with-host-binding.component.ts and dirWithHostBinding.directive.ts" path="attribute-binding/src/app/comp-with-host-binding.component.ts" region="hostbinding"></code-example>

如果 `dirWithHostBinding` 把它的繫結設定為 `undefined`，`width` 屬性就會退回 `comp-with-host-binding` 主元素繫結的值。

<code-example format="typescript" header="dirWithHostBinding directive" language="typescript">

&commat;HostBinding('style.width')
width = ''; // undefined

</code-example>

<div class="alert is-helpful">

如果 `dirWithHostBinding` 把它的繫結設定為 `null`，Angular 會完全移除 `width` 屬性。

<code-example format="typescript" header="dirWithHostBinding" language="typescript">

&commat;HostBinding('style.width')
width = null;

</code-example>

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
