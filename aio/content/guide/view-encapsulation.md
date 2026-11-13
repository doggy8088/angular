# 檢視封裝

在 Angular 中，元件的 CSS 樣式會封裝到元件的檢視中，不
影響應用程式的其他部分。

若要控制這種封裝如何以 _逐一
元件_ 的方式進行，請在元件詮釋資料中設定_檢視封裝模式_。
請從下列模式中選擇：

- `ShadowDom` 檢視封裝使用瀏覽器內建的 shadow DOM 實作（請參閱
  [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)），
  將 shadow DOM 附加到元件的宿主元素，然後把元件
  檢視放進該 shadow DOM 中。元件的樣式包含在 shadow DOM 內。

- `Emulated` 檢視封裝（預設）透過預先處理
  （並重新命名）CSS 程式碼來模擬 shadow DOM 的行為，有效地將 CSS 限定在元件的檢視範圍內。
  詳情請參閱[檢視產生的 CSS](guide/view-encapsulation#inspect-generated-css)。

- `None` 表示 Angular 不做任何檢視封裝。
  Angular 會把 CSS 加入全域樣式。
  前面討論的範圍規則、隔離與保護不適用。
  此模式基本上等同於把元件的樣式貼到 HTML 中。

若要設定元件的封裝模式，請在元件詮釋資料中使用 `encapsulation` 屬性：

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.shadow" header="src/app/quest-summary.component.ts"></code-example>

`ShadowDom` 檢視封裝只能在內建支援
shadow DOM 的瀏覽器上運作（請參閱 [Can I use - Shadow DOM v1](https://caniuse.com/shadowdomv1)）。
支援仍然有限，這就是為什麼 `Emulated` 檢視封裝是預設模式，且在大多數情況下建議使用。

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

- 在原生封裝中會是 shadow DOM 宿主的元素，會有一個
  產生的 `_nghost` 屬性。這通常是元件宿主元素的情況。
- 元件檢視內的元素會有一個 `_ngcontent` 屬性，
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

## 混合封裝模式

避免混合使用不同檢視封裝的元件。在必要時，你應該了解元件樣式將如何彼此互動。

- 使用 `ViewEncapsulation.Emulated` 之元件的樣式會加入文件的 `<head>` 中，使其在整個應用程式中都可用，但有「限定範圍」，因此只影響元件範本內的元素。

- 使用 `ViewEncapsulation.None` 之元件的樣式會加入文件的 `<head>` 中，使其在整個應用程式中都可用，而且沒有「限定範圍」，因此可以影響應用程式中的任何元素。

- 使用 `ViewEncapsulation.ShadowDom` 之元件的樣式只會加入 shadow DOM 宿主，確保它們只影響元件範本內的元素。

**`ViewEncapsulation.Emulated` 與 `ViewEncapsulation.None` 元件的所有樣式，也會加入每個 `ViewEncapsulation.ShadowDom` 元件的 shadow DOM 宿主。**

結果是，`ViewEncapsulation.None` 元件的樣式會影響 shadow DOM 內相符的元素。

這種做法乍看之下可能有違直覺，但如果沒有它，`ViewEncapsulation.None` 元件就無法在 `ViewEncapsulation.ShadowDom` 元件內使用，因為它的樣式將無法使用。

### 範例

本節展示使用不同 `ViewEncapsulation` 之元件的樣式如何互動的範例。

請參閱 <live-example noDownload></live-example>，親自試用這些元件。

#### 無封裝

第一個範例展示一個具有 `ViewEncapsulation.None` 的元件。此元件會將其範本元素著色為紅色。

<code-example path="view-encapsulation/src/app/no-encapsulation.component.ts" header="src/app/no-encapsulation.component.ts"></code-example>>

Angular 會把此元件的樣式以全域樣式的形式加入文件的 `<head>` 中。

**Angular 也會把這些樣式加入所有 shadow DOM 宿主。** 因此，這些樣式在整個應用程式中都可用。

<img src="generated/images/guide/view-encapsulation/no-encapsulation.png" alt="無封裝的元件">

#### 模擬封裝

第二個範例展示一個具有 `ViewEncapsulation.Emulated` 的元件。此元件會將其範本元素著色為綠色。

<code-example path="view-encapsulation/src/app/emulated-encapsulation.component.ts" header="src/app/emulated-encapsulation.component.ts"></code-example>>

與 `ViewEncapsulation.None` 類似，Angular 會把此元件的樣式加入文件的 `<head>` 中，並加入所有 shadow DOM 宿主。
但在這個情況下，樣式會被「檢視產生的 CSS」一節所述的屬性限定範圍。

因此，只有直接位於此元件範本內的元素才會符合其樣式。
由於 `EmulatedEncapsulationComponent` 的「限定範圍」樣式非常具體，它們會覆寫來自 `NoEncapsulationComponent` 的全域樣式。

在此範例中，`EmulatedEncapsulationComponent` 包含一個 `NoEncapsulationComponent`。
`NoEncapsulationComponent` 如預期般套用樣式，因為限定範圍的樣式不會符合其範本中的元素。

<img src="generated/images/guide/view-encapsulation/emulated-encapsulation.png" alt="無封裝的元件">

#### Shadow DOM 封裝

第三個範例展示一個具有 `ViewEncapsulation.ShadowDom` 的元件。此元件會將其範本元素著色為藍色。

<code-example path="view-encapsulation/src/app/shadow-dom-encapsulation.component.ts" header="src/app/shadow-dom-encapsulation.component.ts"></code-example>>

Angular 只把此元件的樣式加入 shadow DOM 宿主，因此在 shadow DOM 之外看不到它們。

請注意，Angular 也會把 `NoEncapsulationComponent` 與 `ViewEncapsulationComponent` 的全域樣式加入 shadow DOM 宿主，因此這些樣式對此元件範本中的元素仍然可用。

在此範例中，`ShadowDomEncapsulationComponent` 同時包含 `NoEncapsulationComponent` 與 `ViewEncapsulationComponent`。

`ShadowDomEncapsulationComponent` 元件加入的樣式，在此元件的整個 shadow DOM 中都可用，因此 `NoEncapsulationComponent` 與 `ViewEncapsulationComponent` 也都能使用。

`EmulatedEncapsulationComponent` 具有具體的「限定範圍」樣式，因此此元件範本的樣式不受影響。

但由於 `ShadowDomEncapsulationComponent` 的樣式是在全域樣式之後加入 shadow 宿主，因此 `h2` 樣式會覆寫來自 `NoEncapsulationComponent` 的樣式。
結果是 `NoEncapsulationComponent` 中的 `<h2>` 元素會著色為藍色而非紅色，這可能不是元件作者的本意。

<img src="generated/images/guide/view-encapsulation/shadow-dom-encapsulation.png" alt="無封裝的元件">

@reviewed 2021-09-17
