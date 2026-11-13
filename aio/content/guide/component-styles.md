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

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts"></code-example>

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

元件樣式有一些來自 Shadow DOM 樣式範圍世界的特殊*選擇器*
（相關說明請參閱 [W3C](https://www.w3.org) 網站上的
[CSS Scoping Module Level 1](https://www.w3.org/TR/css-scoping-1) 頁面）。
以下各節會介紹這些選擇器。


### :host
使用 `:host` 偽類別選擇器，來針對*承載*元件的元素設定樣式（而不是針對元件範本*內部*的元素）。
<code-example path="component-styles/src/app/hero-details.component.css" region="host" header="src/app/hero-details.component.css"></code-example>

`:host` 選擇器是針對宿主元素的唯一方法。你無法從元件內部使用其他選擇器觸及宿主元素，因為它不屬於元件自己的範本。宿主元素位於父元件的範本中。

使用*函式形式*，在 `:host` 後面的小括號內加入另一個選擇器，即可有條件地套用宿主樣式。

下一個範例同樣針對宿主元素，但只有在它同時具有 `active` CSS 類別時才會套用。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostfunction" header="src/app/hero-details.component.css"></code-example>

`:host` 選擇器也可以與其他選擇器結合。
在 `:host` 後面加入選擇器來選取子元素，例如使用 `:host h2` 來針對元件檢視內的所有 `<h2>` 元素。

<div class="alert is-helpful">

你不應該在 `:host` 選取器前面加上選取器（`:host-context` 除外），來根據元件檢視的外部脈絡為元件設定樣式。
這類選取器並不限定於元件檢視的範圍，會選取外部脈絡，但這不是原生行為。
請改用 `:host-context` 選取器來達成這個目的。

</div>

### :host-context

有時候，根據元件檢視*外部*的某些條件來套用樣式是很有用的。
例如，文件 `<body>` 元素上可能套用了某個 CSS 主題類別，
而你想據此改變元件的外觀。

使用 `:host-context()` 偽類別選擇器，它的運作方式與 `:host()` 的函式形式相同。`:host-context()` 選擇器會在元件宿主元素的任何祖先元素中（直到文件根元素）尋找 CSS 類別。`:host-context()` 選擇器在與另一個選擇器結合時很有用。

下列範例會對元件*內部*的所有 `<h2>` 元素套用 `background-color` 樣式，但只有
在某個祖先元素具有 CSS 類別 `theme-light` 時才會如此。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostcontext" header="src/app/hero-details.component.css"></code-example>

### （已棄用）`/deep/`、`>>>` 與 `::ng-deep`

元件樣式通常只會套用到元件自己範本中的 HTML。

把 `::ng-deep` 偽類別套用到任何 CSS 規則上，會完全停用該規則的檢視封裝。任何套用了 `::ng-deep` 的樣式都會變成全域樣式。要把指定的樣式限定在目前元件及其所有後代元素，請務必在 `::ng-deep` 之前加入 `:host` 選擇器。如果 `::ng-deep` 組合器未搭配 `:host` 偽類別選擇器使用，樣式可能會滲入其他元件。

下列範例會針對從宿主元素開始、經過這個元件、到 DOM 中所有子元素的全部 `<h3>` 元素。

<code-example path="component-styles/src/app/hero-details.component.css" region="deep" header="src/app/hero-details.component.css"></code-example>

`/deep/` 組合器也有 `>>>` 與 `::ng-deep` 這兩個別名。

<div class="alert is-important">

請只在 *emulated* 檢視封裝下使用 `/deep/`、`>>>` 與 `::ng-deep`。
Emulated 是預設且最常用的檢視封裝。
更多資訊請參閱 [View Encapsulation](guide/view-encapsulation) 一節。

</div>

<div class="alert is-important">

穿透陰影的子孫組合器已被棄用，[主要瀏覽器](https://www.chromestatus.com/feature/6750456638341120)與工具正在移除對它的支援。
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

<code-example language="sh">
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

<code-example language="sh">
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

使用 CLI 建置時，請務必把連結的樣式檔納入要複製到伺服器的資產中，詳見 [Assets configuration guide](guide/workspace-config#資產設定)。

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

更多資訊請參閱[樣式設定指南](guide/workspace-config#樣式與指令碼設定)。


### 非 CSS 樣式檔案

如果你使用 CLI 建置，
你可以用 [sass](https://sass-lang.com)、[less](http://lesscss.org/) 或 [stylus](https://stylus-lang.com/) 撰寫樣式檔案，並在 `@Component.styleUrls` 詮釋資料中以適當的副檔名（`.scss`、`.less`、`.styl`）指定這些檔案，如下列範例所示：

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
請依[工作區設定指南](guide/workspace-config#產生原理圖)中的說明，設定 CLI 預設使用你偏好的 CSS 前處理器。


<div class="alert is-important">

加入 `@Component.styles` 陣列的樣式字串*必須以 CSS 撰寫*，因為 CLI 無法對內嵌樣式套用前處理器。

</div>
