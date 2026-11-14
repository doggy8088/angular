# 元件樣式

Angular 應用程式使用標準 CSS 設定樣式。也就是說，你可以
直接把你所知道關於 CSS 樣式表、選擇器、規則與媒體查詢的一切，
套用到 Angular 應用程式上。

此外，Angular 可以把*元件樣式*
與元件打包在一起，實現比一般樣式表更模組化的設計。

本頁說明如何載入與套用這些元件樣式。

在 Stackblitz 中執行 <live-example></live-example>，並從那裡下載程式碼。

## 使用元件樣式

對於你撰寫的每個 Angular 元件，你不僅可以定義 HTML 範本，
還可以定義搭配該範本的 CSS 樣式，
指定你需要的任何選擇器、規則與媒體查詢。

其中一種做法是在元件詮釋資料中設定 `styles` 屬性。
`styles` 屬性接受一個由包含 CSS 程式碼的字串組成的陣列。
通常你會給它一個字串，如下列範例所示：

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts" linenums="false">
</code-example>

## 樣式範圍

<div class="alert is-critical">

在 `@Component` 詮釋資料中指定的樣式，*只會套用在該元件的範本內*。

</div>

它們*不會被*範本中巢狀的任何元件繼承，也不會被投影進元件的任何內容繼承。

在這個範例中，`h1` 樣式只套用到 `HeroAppComponent`，
不會套用到巢狀的 `HeroMainComponent`，也不會套用到應用程式其他任何地方的 `<h1>` 標籤。

這種範圍限制是一個***樣式模組化功能***。

* 使用在各元件脈絡中最合理的 CSS 類別名稱與選擇器。

* 類別名稱與選擇器是元件本機的，不會與
  應用程式其他地方使用的類別與選擇器衝突。

* 應用程式其他地方的樣式變更不會影響元件的樣式。

* 把每個元件的 CSS 程式碼與該元件的 TypeScript 及 HTML 程式碼放在一起，
  讓專案結構整潔有序。

* 變更或移除元件 CSS 程式碼時，不必搜遍
  整個應用程式，尋找該程式碼還在哪些地方被使用。

{@a special-selectors}

## 特殊選擇器

元件樣式有一些來自 shadow DOM 樣式範圍世界的特殊*選擇器*
（相關說明請參閱 [CSS Scoping Module Level 1](https://www.w3.org/TR/css-scoping-1) 頁面，位於
[W3C](https://www.w3.org) 網站）。
以下各節會介紹這些選擇器。

### :host

使用 `:host` 偽類別選擇器，來針對*承載*元件的元素設定樣式（而不是針對元件範本*內部*的元素）。

<code-example path="component-styles/src/app/hero-details.component.css" region="host" header="src/app/hero-details.component.css" linenums="false">
</code-example>

`:host` 選擇器是針對宿主元素的唯一方法。你無法從元件內部使用其他選擇器觸及宿主元素，因為它不屬於元件自己的範本。宿主元素位於父元件的範本中。

使用*函式形式*，在 `:host` 後面的小括號內加入另一個選擇器，即可有條件地套用宿主樣式。

下一個範例同樣針對宿主元素，但只有在它同時具有 `active` CSS 類別時才會套用。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostfunction" header="src/app/hero-details.component.css" linenums="false">
</code-example>

### :host-context

有時候，根據元件檢視*外部*的某些條件來套用樣式是很有用的。
例如，文件 `<body>` 元素上可能套用了某個 CSS 主題類別，
而你想據此改變元件的外觀。

使用 `:host-context()` 偽類別選擇器，它的運作方式與 `:host()` 的函式形式相同。`:host-context()` 選擇器會在元件宿主元素的任何祖先元素中（直到文件根元素）尋找 CSS 類別。`:host-context()` 選擇器在與另一個選擇器結合時很有用。

下列範例會對元件*內部*的所有 `<h2>` 元素套用 `background-color` 樣式，但只有
在某個祖先元素具有 CSS 類別 `theme-light` 時才會如此。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostcontext" header="src/app/hero-details.component.css" linenums="false">
</code-example>

### （已棄用）`/deep/`、`>>>` 與 `::ng-deep`

元件樣式通常只會套用到元件自己範本中的 HTML。

使用 `/deep/` 穿透陰影的子孫組合器，強制讓樣式穿透子元件樹，深入所有子元件檢視。`/deep/` 組合器可套用到任意深度的巢狀元件，且同時適用於元件的檢視子元素與內容子元素。

下列範例會針對從宿主元素開始、經過這個元件、到 DOM 中所有子元素的全部 `<h3>` 元素。

<code-example path="component-styles/src/app/hero-details.component.css" region="deep" header="src/app/hero-details.component.css" linenums="false">

</code-example>

`/deep/` 組合器也有 `>>>` 與 `::ng-deep` 這兩個別名。

<div class="alert is-important">

請只與 *emulated* 檢視封裝一起使用 `/deep/`、`>>>` 與 `::ng-deep`。
Emulated 是預設且最常用的檢視封裝。更多資訊，請參閱
[控制檢視封裝](guide/component-styles#view-encapsulation)一節。

</div>

<div class="alert is-important">

穿透陰影的子孫組合器已被棄用，[主要瀏覽器](https://www.chromestatus.com/features/6750456638341120)與工具正在移除對它的支援。
因此我們計畫在 Angular 中停止支援（涵蓋 `/deep/`、`>>>` 與 `::ng-deep` 三者）。
在那之前，為了與工具保持更廣泛的相容性，應優先使用 `::ng-deep`。

</div>

{@a loading-styles}

## 載入元件樣式

為元件加入樣式有幾種方式：

* 設定 `styles` 或 `styleUrls` 詮釋資料。
* 直接寫在範本 HTML 中。
* 使用 CSS 匯入。

前面概述的範圍規則適用於上述每一種載入模式。

### 元件詮釋資料中的樣式

在 `@Component` 裝飾器中加入 `styles` 陣列屬性。

陣列中的每個字串都會為這個元件定義一些 CSS。

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts (CSS inline)">
</code-example>

<div class="alert is-critical">

提醒：這些樣式*只適用於這個元件*。
它們*不會被*範本中巢狀的任何元件繼承，也不會被投影進元件的任何內容繼承。

</div>

使用 `--inline-style` 旗標建立元件時，Angular CLI 指令 [`ng generate component`](cli/generate) 會定義一個空的 `styles` 陣列。

<code-example language="sh" class="code-shell">
ng generate component hero-app --inline-style
</code-example>

### 元件詮釋資料中的樣式檔案

透過在元件的 `@Component` 裝飾器中加入 `styleUrls` 屬性，從外部 CSS 檔案載入樣式：

<code-tabs>
  <code-pane header="src/app/hero-app.component.ts (CSS in file)" path="component-styles/src/app/hero-app.component.1.ts"></code-pane>
  <code-pane header="src/app/hero-app.component.css" path="component-styles/src/app/hero-app.component.css"></code-pane>
</code-tabs>

<div class="alert is-critical">

提醒：樣式檔中的樣式*只適用於這個元件*。
它們*不會被*範本中巢狀的任何元件繼承，也不會被投影進元件的任何內容繼承。

</div>

<div class="alert is-helpful">

  你可以指定多個樣式檔，甚至可以結合使用 `styles` 與 `styleUrls`。

</div>

使用 Angular CLI 指令 [`ng generate component`](cli/generate) 且不加 `--inline-style` 旗標時，它會為你建立一個空的樣式檔案，並在元件產生的 `styleUrls` 中參照該檔案。

<code-example language="sh" class="code-shell">
ng generate component hero-app
</code-example>

### 範本內嵌樣式

把 CSS 樣式放在 `<style>` 標籤內，直接嵌入 HTML 範本中。

<code-example path="component-styles/src/app/hero-controls.component.ts" region="inlinestyles" header="src/app/hero-controls.component.ts">
</code-example>

### 範本連結標籤

你也可以在元件的 HTML 範本中寫入 `<link>` 標籤。

<code-example path="component-styles/src/app/hero-team.component.ts" region="stylelink" header="src/app/hero-team.component.ts">
</code-example>

<div class="alert is-critical">

使用 CLI 建置時，請務必把連結的樣式檔納入要複製到伺服器的資產中，詳見 [CLI wiki](https://github.com/angular/angular-cli/wiki/stories-asset-configuration)。
<!-- 2018-10-16: The link above is still the best source for this information. -->

納入之後，CLI 就會包含該樣式表，不論 link 標籤的 href URL 是相對於應用程式根目錄還是元件檔案。

</div>

### CSS @import

使用標準 CSS `@import` 規則，把 CSS 檔案匯入 CSS 檔案中。
詳細資訊請參閱 [MDN](https://developer.mozilla.org) 網站上的 [`@import`](https://developer.mozilla.org/en/docs/Web/CSS/@import) 說明。

在這種情況下，URL 是相對於你要匯入的 CSS 檔案。

<code-example path="component-styles/src/app/hero-details.component.css" region="import" header="src/app/hero-details.component.css (excerpt)">
</code-example>

### 外部與全域樣式檔案

使用 CLI 建置時，你必須設定 `angular.json`，納入*所有外部資產*，包括外部樣式檔案。

在 `styles` 區段中註冊**全域**樣式檔案，該區段預設已預先設定好全域的 `styles.css` 檔案。

更多資訊請參閱 [CLI wiki](https://github.com/angular/angular-cli/wiki/stories-global-styles)。
<!-- 2018-10-16: The link above is still the best source for this information. -->

### 非 CSS 樣式檔案

如果你使用 CLI 建置，
你可以用 [sass](http://sass-lang.com/)、[less](http://lesscss.org/) 或 [stylus](http://stylus-lang.com/) 撰寫樣式檔案，並在 `@Component.styleUrls` 詮釋資料中以適當的副檔名（`.scss`、`.less`、`.styl`）指定這些檔案，如下列範例所示：

<code-example>
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
...
</code-example>

CLI 建置流程會執行相關的 CSS 前處理器。

使用 `ng generate component` 產生元件檔案時，CLI 預設會發出一個空的 CSS 樣式檔案（`.css`）。
你可以設定 CLI 預設使用你偏好的 CSS 前處理器
如 [CLI wiki](https://github.com/angular/angular-cli/wiki/stories-css-preprocessors
"CSS Preprocessor integration") 中所述。
<!-- 2018-10-16: The link above is still the best source for this information. -->

<div class="alert is-important">

加入 `@Component.styles` 陣列的樣式字串*必須以 CSS 撰寫*，因為 CLI 無法對內嵌樣式套用前處理器。

</div>

{@a view-encapsulation}

## 檢視封裝

如前所述，元件的 CSS 樣式會封裝到元件的檢視中，不影響應用程式的其他部分。

若要控制這種封裝如何以*逐一
元件*的方式進行，你可以在元件詮釋資料中設定*檢視封裝模式*。
請從下列模式中選擇：

* `ShadowDom` 檢視封裝使用瀏覽器的原生 shadow DOM 實作（請參閱
  [MDN](https://developer.mozilla.org) 網站上的
  [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)），
  將 shadow DOM 附加到元件的宿主元素，然後把元件
  檢視放進該 shadow DOM 中。元件的樣式包含在 shadow DOM 內。

* `Native` 檢視封裝使用瀏覽器原生 shadow DOM 實作中現已棄用的版本——[了解這些變更](https://hayato.io/2016/shadowdomv1/)。

* `Emulated` 檢視封裝（預設）透過預先處理
  （並重新命名）CSS 程式碼來模擬 shadow DOM 的行為，有效地將 CSS 限定在元件的檢視範圍內。
  詳情請參閱[附錄 1](guide/component-styles#inspect-generated-css)。

* `None` 表示 Angular 不做任何檢視封裝。
  Angular 會把 CSS 加入全域樣式。
  前面討論的範圍規則、隔離與保護不適用。
  這基本上等同於把元件的樣式貼到 HTML 中。

若要設定元件的封裝模式，請在元件詮釋資料中使用 `encapsulation` 屬性：

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.native" header="src/app/quest-summary.component.ts" linenums="false">
</code-example>

`ShadowDom` 檢視封裝只能在原生支援
shadow DOM 的瀏覽器上運作（請參閱 [Can I use](http://caniuse.com) 網站上的
[Shadow DOM v1](https://caniuse.com/#feat=shadowdomv1)）。支援仍然有限，
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
產生，你絕不會在應用程式程式碼中參照它們。但它們是
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
