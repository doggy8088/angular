一種特殊元素，可以容納結構指令，而不會在 DOM 中加入新的元素。

`<ng-container>` 讓我們可以在不加入任何額外元素的情況下使用結構指令，確保套用的 DOM 變更只有指令本身所指示的那些。

這不僅能提升效能 \(即使只是些微提升\)，因為瀏覽器最終需要渲染的元素變少了，還能讓 DOM 與樣式都更乾淨，這也是一項寶貴的優點。

例如，它能讓我們使用結構指令，而不會破壞依賴精確 DOM 結構的樣式 \(例如使用彈性容器、邊距、子代組合選擇器等時得到的樣式\)。

@usageNotes

### 搭配 `*NgIf` 使用

`<ng-container>` 的一個常見使用情境，是搭配 `*ngIf` 結構指令使用。透過使用這個特殊元素，我們可以產生非常乾淨、容易理解與使用的範本。

例如，我們可能希望有多個元素依條件顯示，但它們不需要全部位於同一個根元素之下。只要用這樣的區塊將它們包起來，就能輕鬆做到：

<code-example format="html" language="html">

&lt;ng-container *ngIf="condition"&gt;
  &hellip;
&lt;/ng-container&gt;

</code-example>

這也可以搭配 `else` 陳述式與 `<ng-template>` 一起使用，如下所示：

<code-example format="html" language="html">

&lt;ng-container *ngIf="condition; else templateA"&gt;
  &hellip;
&lt;/ng-container&gt;
&lt;ng-template #templateA&gt;
  &hellip;
&lt;/ng-template&gt;

</code-example>

### 結合多個結構指令

多個結構指令不能用在同一個元素上；如果你需要使用一個以上的結構指令，建議為每個結構指令使用一個 `<ng-container>`。

最常見的情境是搭配 `*ngIf` 與 `*ngFor` 使用。例如，假設我們有一個項目清單，但每個項目只有在特定條件為真時才需要顯示。我們可能會想嘗試這樣寫：

<code-example format="html" language="html">

&lt;ul&gt;
  &lt;li *ngFor="let item of items" *ngIf="item.isValid"&gt;
    {{ item.name }}
  &lt;/li&gt;
&lt;/ul&gt;

</code-example>

如我們所說，那樣做行不通，我們可以做的是把其中一個結構指令移到 `<ng-container>` 元素上，由它包住另一個指令，像這樣：

<code-example format="html" language="html">

&lt;ul&gt;
  &lt;ng-container *ngFor="let item of items"&gt;
    &lt;li *ngIf="item.isValid"&gt;
      {{ item.name }}
    &lt;/li&gt;
  &lt;/ng-container&gt;
&lt;/ul&gt;

</code-example>

這樣就能如預期運作，而且不會在 DOM 中引入任何不必要的新元素。

如需更多資訊，請參閱[每個元素一個結構指令](guide/structural-directives#one-per-element)。

### 搭配 ngTemplateOutlet 使用

`NgTemplateOutlet` 指令可以套用到任何元素上，但大多數時候是套用到 `<ng-container>` 元素上。將兩者結合，我們就能得到非常清楚、容易理解的 HTML 與 DOM 結構，其中不需要額外的元素，範本檢視會在要求的位置具現化。

例如，想像一種情況：我們有一大段 HTML，其中有一小部分需要在不同位置重複出現。一個簡單的解決方法是定義一個包含重複 HTML 的 `<ng-template>`，並在需要的地方使用 `<ng-container>` 搭配 `NgTemplateOutlet` 來渲染它。

如下所示：

<code-example format="html" language="html">

&lt;!-- &hellip; --&gt;

&lt;ng-container *ngTemplateOutlet="tmpl; context: {&dollar;implicit: 'Hello'}"&gt;
&lt;/ng-container&gt;

&lt;!-- &hellip; --&gt;

&lt;ng-container *ngTemplateOutlet="tmpl; context: {&dollar;implicit: 'World'}"&gt;
&lt;/ng-container&gt;

&lt;!-- &hellip; --&gt;

&lt;ng-template #tmpl let-text&gt;
  &lt;h1&gt;{{ text }}&lt;/h1&gt;
&lt;/ng-template&gt;

</code-example>

如需更多關於 `NgTemplateOutlet` 的資訊，請參閱 [`NgTemplateOutlet` 的 API 說明文件頁面](api/common/NgTemplateOutlet)。

