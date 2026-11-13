# 樣式優先順序

當有多個繫結指向同一個類別名稱或樣式屬性時，Angular 會使用一組優先順序規則來決定要對元素套用哪些類別或樣式。
這些規則指定了哪些與樣式及類別相關的繫結具有優先權。
此樣式優先順序如下，從最具體、優先順序最高，到最不具體、優先順序最低：

1. 範本繫結最為具體，因為它們直接且專門地套用到元素上，所以具有最高的優先順序。
  <table width="100%">
    <col width="40%"></col>
    <col width="60%"></col>
    <thead>
      <tr>
        <th>繫結類型</th>
        <th>範例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>屬性繫結</td>
        <td><code>&lt;div [class.foo]="hasFoo"&gt;</code><br><code>&lt;div [style.color]="color"&gt;</code></td>
      </tr>
      <tr>
        <td>對映繫結</td>
        <td><code>&lt;div [class]="classExpression"&gt;</code><br><code>&lt;div [style]="styleExpression"&gt;</code></td>
      </tr>
      <tr>
        <td>靜態值</td>
        <td><code>&lt;div class="foo"&gt;</code><br><code>&lt;div style="color: blue"&gt;</code></td>
      </tr>
    </tbody>
  </table>
1. 指令主元素繫結較不具體，因為你可以在多個位置使用指令，所以其優先順序比範本繫結低。
  <table width="100%">
    <col width="40%"></col>
    <col width="60%"></col>
    <thead>
      <tr>
        <th>繫結類型</th>
        <th>範例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>屬性繫結</td>
        <td><code>host: {'[class.foo]': 'hasFoo'}</code><br><code>host: {'[style.color]': 'color'}</code></td>
      </tr>
      <tr>
        <td>對映繫結</td>
        <td><code>host: {'[class]': 'classExpr'}</code><br><code>host: {'[style]': 'styleExpr'}</code></td>
      </tr>
      <tr>
        <td>靜態值</td>
        <td><code>host: {'class': 'foo'}</code><br><code>host: {'style': 'color: blue'}</code></td>
      </tr>
    </tbody>
  </table>
1. 元件主元素繫結的優先順序最低。
    <table width="100%">
    <col width="40%"></col>
    <col width="60%"></col>
    <thead>
      <tr>
        <th>繫結類型</th>
        <th>範例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>屬性繫結</td>
        <td><code>host: {'[class.foo]': 'hasFoo'}</code><br><code>host: {'[style.color]': 'color'}</code></td>
      </tr>
      <tr>
        <td>對映繫結</td>
        <td><code>host: {'[class]': 'classExpression'}</code><br><code>host: {'[style]': 'styleExpression'}</code></td>
      </tr>
      <tr>
        <td>靜態值</td>
        <td><code>host: {'class': 'foo'}</code><br><code>host: {'style': 'color: blue'}</code></td>
      </tr>
    </tbody>
  </table>

## 優先順序與具體程度

在以下範例中，繫結到特定類別（例如 `[class.special]`）的優先順序高於一般的 `[class]` 繫結。
同樣地，繫結到特定樣式（例如 `[style.color]`）的優先順序高於一般的 `[style]` 繫結。

<code-example path="attribute-binding/src/app/app.component.html" region="basic-specificity" header="src/app/app.component.html"></code-example>

## 不同來源的繫結的優先順序

具體程度規則也適用於來自不同來源的繫結。
一個元素可以擁有來自其自身範本的繫結、來自相符指令上的主元素繫結，以及來自相符元件上的主元素繫結。

<code-example path="attribute-binding/src/app/app.component.html" region="source-specificity" header="src/app/app.component.html"></code-example>

## 繫結與靜態屬性的優先順序

繫結的優先順序高於靜態屬性，因為繫結是動態的。
在以下情形中，`class` 與 `[class]` 的具體程度相似，但 `[class]` 繫結的優先順序較高。

<code-example path="attribute-binding/src/app/app.component.html" region="dynamic-priority" header="src/app/app.component.html"></code-example>

{@a styling-delegation}

## 委派給優先順序較低的樣式

優先順序較高的樣式可以使用 `undefined` 值，委派給優先順序較低的樣式。
舉例來說，請看下列範本：

<code-example path="attribute-binding/src/app/app.component.html" region="style-delegation" header="src/app/app.component.html"></code-example>

假設 `dirWithHostBinding` 指令與 `comp-with-host-binding` 元件都有一個 `[style.width]` 主元素繫結。

<code-example path="attribute-binding/src/app/comp-with-host-binding.component.ts" region="hostbinding" header="src/app/comp-with-host-binding.component.ts and dirWithHostBinding.directive.ts"></code-example>

如果 `dirWithHostBinding` 把它的繫結設定為 `undefined`，`width` 屬性就會退回 `comp-with-host-binding` 主元素繫結的值。

<code-example header="dirWithHostBinding directive">
@HostBinding('style.width')
width = ''; // undefined
</code-example>

<div class="alert is-helpful">

  如果 `dirWithHostBinding` 把它的繫結設定為 `null`，Angular 會完全移除 `width` 屬性。

  <code-example header="dirWithHostBinding">
  @HostBinding('style.width')
  width = null;
  </code-example>

</div>
