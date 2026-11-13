# 檢視封裝

在 Angular 中，元件的樣式可以封裝在元件的宿主元素內，讓它們不影響應用程式的其他部分。

`Component` 裝飾器提供 [`encapsulation`](api/core/Component#encapsulation) 選項，可用來控制封裝如何以*逐一元件*的方式套用。

請從下列模式中選擇：

<!-- vale off -->

| 模式                          | 詳細說明 |
|:---                           |:---     |
| `ViewEncapsulation.ShadowDom` | Angular 使用瀏覽器內建的 [Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Shadow_DOM)，將元件的檢視包在 ShadowRoot 內（作為元件的宿主元素），並以隔離的方式套用提供的樣式。 <div class="alert is-important"> `ViewEncapsulation.ShadowDom` 只能在內建支援 shadow DOM 的瀏覽器上運作（請參閱 [Can I use - Shadow DOM v1](https://caniuse.com/shadowdomv1)）。並非所有瀏覽器都支援它，這就是為什麼 `ViewEncapsulation.Emulated` 是建議採用的預設模式。 </div> |
| `ViewEncapsulation.Emulated`  | Angular 會修改元件的 CSS 選擇器，讓它們只套用到元件的檢視，不影響應用程式中的其他元素，以此*模擬* Shadow DOM 的行為。更多詳細資訊請參閱[檢視產生的 CSS](guide/view-encapsulation#inspect-generated-css)。 |
| `ViewEncapsulation.None`      | Angular 不套用任何檢視封裝，這表示為元件指定的任何樣式實際上都會全域套用，並可能影響應用程式內存在的任何 HTML 元素。此模式基本上等同於把樣式直接寫入 HTML 本身。 |

<a id="inspect-generated-css"></a>

## 檢視產生的 CSS

<!-- vale on -->

使用模擬檢視封裝時，Angular 會預先處理元件的所有樣式，讓它們只套用到元件的檢視。

在執行中的 Angular 應用程式的 DOM 中，屬於使用模擬檢視封裝之元件的元素會附加一些額外屬性：

<code-example language="html">

&lt;hero-details _nghost-pmm-5&gt;
  &lt;h2 _ngcontent-pmm-5&gt;Mister Fantastic&lt;/h2&gt;
  &lt;hero-team &lowbar;ngcontent-pmm-5 &lowbar;nghost-pmm-6&gt;
    &lt;h3 _ngcontent-pmm-6&gt;Team&lt;/h3&gt;
  &lt;/hero-team&gt;
&lt;/hero-details&gt;

</code-example>

這類屬性有兩種：

| 屬性         | 詳細說明 |
|:---          |:---     |
| `_nghost`    | 加到包住元件檢視的元素上，在原生 Shadow DOM 封裝中，這些元素會是 ShadowRoot。這通常是元件宿主元素的情況。          |
| `_ngcontent` | 加到元件檢視內的子元素上，用來將元素與其各自的模擬 ShadowRoot（具有相符 `_nghost` 屬性的宿主元素）配對。 |

這些屬性的確切值是 Angular 的私有實作細節。
它們會自動建立，你絕不應該在應用程式程式碼中參照它們。

建立的元件樣式會以這些屬性為目標，並注入 DOM 的 `<head>` 區段中：

<code-example format="css" language="css">

[_nghost-pmm-5] {
  display: block;
  border: 1px solid black;
}
h3[_ngcontent-pmm-6] {
  background-color: white;
  border: 1px solid #777;
}

</code-example>

這些樣式會經過後處理，讓每個 CSS 選擇器都加上適當的 `_nghost` 或 `_ngcontent` 屬性。
這些修改過的選擇器可確保樣式以隔離且有針對性的方式套用到元件的檢視。

## 混合封裝模式

如前所述，你可以在 Component 的裝飾器中以*逐一元件*的方式指定封裝模式。這表示在你的應用程式中，不同元件可以使用不同的封裝策略。

雖然可行，但不建議這麼做。
如果確實有需要，你應該了解使用不同封裝模式之元件的樣式如何彼此互動：

| 模式                          | 詳細說明 |
|:---                           |:---     |
| `ViewEncapsulation.Emulated`  | 元件的樣式會加入文件的 `<head>` 中，使其在整個應用程式中都可用，但其選擇器只會影響各自元件範本內的元素。 |
| `ViewEncapsulation.None`      | 元件的樣式會加入文件的 `<head>` 中，使其在整個應用程式中都可用，因此完全是全域的，會影響文件內任何相符的元素。          |
| `ViewEncapsulation.ShadowDom` | 元件的樣式只會加入 shadow DOM 宿主，確保它們只影響各自元件檢視內的元素。                                                            |

<div class="alert is-helpful">

`ViewEncapsulation.Emulated` 與 `ViewEncapsulation.None` 元件的樣式，也會加入每個 `ViewEncapsulation.ShadowDom` 元件的 shadow DOM 宿主。

這表示 `ViewEncapsulation.None` 元件的樣式會影響 shadow DOM 內的相符元素。

這種做法乍看之下可能有違直覺。但如果沒有它，`ViewEncapsulation.None` 元件在 `ViewEncapsulation.ShadowDom` 元件內的算繪結果會有所不同，因為它的樣式將無法使用。

</div>

### 範例

本節展示使用不同 `ViewEncapsulation` 之元件的樣式如何互動的範例。

請參閱 <live-example noDownload></live-example>，親自試用這些元件。

#### 無封裝

第一個範例展示一個具有 `ViewEncapsulation.None` 的元件。
此元件會將其範本元素著色為紅色。

<code-example header="src/app/no-encapsulation.component.ts" path="view-encapsulation/src/app/no-encapsulation.component.ts"></code-example>

Angular 會把此元件的樣式以全域樣式的形式加入文件的 `<head>` 中。

如前所述，Angular 也會把這些樣式加入所有 shadow DOM 宿主，讓樣式在整個應用程式中都可用。

<div class="lightbox">

<img alt="無封裝的元件" src="generated/images/guide/view-encapsulation/no-encapsulation.png">

</div>

#### 模擬封裝

第二個範例展示一個具有 `ViewEncapsulation.Emulated` 的元件。
此元件會將其範本元素著色為綠色。

<code-example header="src/app/emulated-encapsulation.component.ts" path="view-encapsulation/src/app/emulated-encapsulation.component.ts"></code-example>

與 `ViewEncapsulation.None` 類似，Angular 會把此元件的樣式加入文件的 `<head>` 中，但使用「限定範圍」的樣式。

只有直接位於此元件範本內的元素才會符合其樣式。
由於 `EmulatedEncapsulationComponent` 的「限定範圍」樣式較為具體，它們會覆寫來自 `NoEncapsulationComponent` 的全域樣式。

在此範例中，`EmulatedEncapsulationComponent` 包含一個 `NoEncapsulationComponent`，但 `NoEncapsulationComponent` 仍如預期般套用樣式，因為 `EmulatedEncapsulationComponent` 的「限定範圍」樣式不會符合其範本中的元素。

<div class="lightbox">

<img alt="無封裝的元件" src="generated/images/guide/view-encapsulation/emulated-encapsulation.png">

</div>

#### Shadow DOM 封裝

第三個範例展示一個具有 `ViewEncapsulation.ShadowDom` 的元件。
此元件會將其範本元素著色為藍色。

<code-example header="src/app/shadow-dom-encapsulation.component.ts" path="view-encapsulation/src/app/shadow-dom-encapsulation.component.ts"></code-example>

Angular 只把此元件的樣式加入 shadow DOM 宿主，因此在 shadow DOM 之外看不到它們。

<div class="alert is-helpful">

**NOTE**: <br />
Angular 也會把 `NoEncapsulationComponent` 與 `EmulatedEncapsulationComponent` 的全域樣式加入 shadow DOM 宿主。這些樣式對此元件範本中的元素仍然可用。

</div>

在此範例中，`ShadowDomEncapsulationComponent` 同時包含 `NoEncapsulationComponent` 與 `EmulatedEncapsulationComponent`。

`ShadowDomEncapsulationComponent` 元件加入的樣式，在此元件的整個 shadow DOM 中都可用，因此 `NoEncapsulationComponent` 與 `EmulatedEncapsulationComponent` 也都能使用。

`EmulatedEncapsulationComponent` 具有具體的「限定範圍」樣式，因此此元件範本的樣式不受影響。

由於 `ShadowDomEncapsulationComponent` 的樣式是在全域樣式之後加入 shadow 宿主，因此 `h2` 樣式會覆寫來自 `NoEncapsulationComponent` 的樣式。
結果是 `NoEncapsulationComponent` 中的 `<h2>` 元素會著色為藍色而非紅色，這可能不是該元件作者的本意。

<div class="lightbox">

<img alt="無封裝的元件" src="generated/images/guide/view-encapsulation/shadow-dom-encapsulation.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
