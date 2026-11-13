# 檢視封裝

在 Angular 中，元件的 CSS 樣式會封裝到元件的檢視中，不
影響應用程式的其他部分。

若要控制這種封裝如何以 *逐一
元件* 的方式進行，你可以在元件詮釋資料中設定 *檢視封裝模式*。
請從下列模式中選擇：

* `ShadowDom` 檢視封裝使用瀏覽器的原生 shadow DOM 實作（請參閱
  [MDN](https://developer.mozilla.org) 網站上的
  [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)），
  將 shadow DOM 附加到元件的宿主元素，然後把元件
  檢視放進該 shadow DOM 中。元件的樣式包含在 shadow DOM 內。

* `Emulated` 檢視封裝（預設）透過預先處理
  （並重新命名）CSS 程式碼來模擬 shadow DOM 的行為，有效地將 CSS 限定在元件的檢視範圍內。
  詳情請參閱下方的[檢視產生的 CSS](guide/view-encapsulation#inspect-generated-css)。

* `None` 表示 Angular 不做任何檢視封裝。
  Angular 會把 CSS 加入全域樣式。
  前面討論的範圍規則、隔離與保護不適用。
  這基本上等同於把元件的樣式貼到 HTML 中。

若要設定元件的封裝模式，請在元件詮釋資料中使用 `encapsulation` 屬性：

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.shadow" header="src/app/quest-summary.component.ts"></code-example>

`ShadowDom` 檢視封裝只能在原生支援
shadow DOM 的瀏覽器上運作（請參閱 [Can I use](https://caniuse.com/) 網站上的
[Shadow DOM v1](https://caniuse.com/shadowdomv1)）。支援仍然有限，
這就是為什麼 `Emulated` 檢視封裝是預設模式，且在大多數情況下建議
使用。

{@a inspect-generated-css}

## 檢視產生的 CSS

使用模擬檢視封裝時，Angular 會預先處理
所有元件樣式，讓它們近似標準的 shadow CSS 範圍規則。

在已啟用模擬檢視
封裝的執行中 Angular 應用程式的 DOM 中，每個 DOM 元素都會有一些額外屬性
附加其上：

<code-example format="">
  &lt;hero-details _nghost-pmm-5>
    &lt;h2 _ngcontent-pmm-5>Mister Fantastic&lt;/h2>
    &lt;hero-team _ngcontent-pmm-5 _nghost-pmm-6>
      &lt;h3 _ngcontent-pmm-6>Team&lt;/h3>
    &lt;/hero-team>
  &lt;/hero-detail>

</code-example>

產生的屬性有兩種：

* 在原生封裝中會是 shadow DOM 宿主的元素，會有一個
  產生的 `_nghost` 屬性。這通常是元件宿主元素的情況。
* 元件檢視內的元素會有一個 `_ngcontent` 屬性，
  指出該元素屬於哪個宿主的模擬 shadow DOM。

這些屬性的確切值並不重要。它們會自動
產生，你絕不應該在應用程式程式碼中參照它們。但它們是
產生的元件樣式的目標，這些樣式位於 DOM 的 `<head>` 區段中：

<code-example format="">
  [_nghost-pmm-5] {
    display: block;
    border: 1px solid black;
  }

  h3[_ngcontent-pmm-6] {
    background-color: white;
    border: 1px solid #777;
  }
</code-example>

這些樣式會經過後處理，讓每個選擇器都加上
`_nghost` 或 `_ngcontent` 屬性選擇器。
這些額外選擇器啟用了本頁所述的範圍規則。
