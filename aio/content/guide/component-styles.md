# 元件樣式

Angular 應用程式使用標準 CSS 設定樣式。也就是說，你可以直接把你所知道關於 CSS 樣式表、選擇器、規則與媒體查詢的一切，套用到 Angular 應用程式上。

此外，Angular 可以把*元件樣式*與元件打包在一起，實現比一般樣式表更模組化的設計。

本頁說明如何載入與套用這些元件樣式。

在 Stackblitz 中執行 <live-example></live-example>，並從那裡下載程式碼。

## 使用元件樣式

對於你撰寫的每個 Angular 元件，你不僅可以定義 HTML 範本，還可以定義搭配該範本的 CSS 樣式，指定你需要的任何選擇器、規則與媒體查詢。

其中一種做法是在元件詮釋資料中設定 `styles` 屬性。`styles` 屬性接受一個由包含 CSS 程式碼的字串組成的陣列。通常你會給它一個字串，如下列範例所示：

<code-example header="src/app/hero-app.component.ts" path="component-styles/src/app/hero-app.component.ts"></code-example>

## 元件樣式最佳實務

<div class="alert is-helpful">

關於 Angular 如何將樣式限定於特定元件，請參閱 [View Encapsulation](guide/view-encapsulation)。

</div>

你應該把元件的樣式視為該元件的私有實作細節。當你使用一個共用元件時，不應覆寫該元件的樣式，就像你不應存取 TypeScript 類別的私有成員一樣。雖然 Angular 預設的樣式封裝可以防止元件樣式影響其他元件，但全域樣式會影響頁面上的所有元件。這包括 `::ng-deep`，它會把元件樣式提升為全域樣式。

### 撰寫支援客製化的元件

身為元件作者，你可以明確地設計元件，讓它以四種不同方式之一接受客製化。

#### 1. 使用 CSS 自訂屬性（建議）

你可以透過以 CSS 自訂屬性（也稱為 CSS 變數）定義元件的樣式，為元件定義一個受支援的客製化 API。任何使用你元件的人都可以透過為這些屬性定義值來使用這個 API，客製化元件在渲染頁面上的最終外觀。

雖然這需要在每個客製化點定義一個自訂屬性，但它建立了一個清晰的 API 契約，適用於所有樣式封裝模式。

#### 2. 用 `@mixin` 宣告全域 CSS

雖然 Angular 的模擬樣式封裝可以防止樣式從元件中逸出，但它無法防止全域 CSS 影響整個頁面。雖然元件使用者應避免直接覆寫元件的 CSS 內部結構，但你可以透過 Sass 這類 CSS 前處理器，提供受支援的客製化 API。

例如，元件可以提供一或多個受支援的 mixin，來客製化元件外觀的各個面向。雖然這種做法在實作上使用全域樣式，但它讓元件作者能夠隨著元件私有 DOM 結構與 CSS 類別的變更，保持 mixin 的最新狀態。

#### 3. 用 CSS `::part` 客製化

如果你的元件使用 [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)，你可以套用 `part` attribute 來指定元件範本中的元素。這讓元件的使用者可以撰寫任意樣式，透過[ `::part` 偽元素](https://developer.mozilla.org/docs/Web/CSS/::part)針對那些特定元素設定樣式。

雖然這能限制使用者可以客製化的範本內元素，但它並不限制哪些 CSS 屬性可以客製化。

#### 4. 提供 TypeScript API

你可以使用範本繫結來更新 CSS 類別與樣式，定義一個用於客製化樣式的 TypeScript API。不建議這麼做，因為這種樣式 API 額外的 JavaScript 成本，會比 CSS 帶來大得多的效能成本。

## 特殊選擇器

元件樣式有一些來自 Shadow DOM 樣式範圍世界的特殊*選擇器*（相關說明請參閱 [W3C](https://www.w3.org) 網站上的 [CSS Scoping Module Level 1](https://www.w3.org/TR/css-scoping-1) 頁面）。以下各節會介紹這些選擇器。

### :host

每個元件都會與一個符合該元件選擇器的元素建立關聯。範本會渲染到這個元素中，它被稱為*宿主元素*。`:host` 偽類別選擇器可用來建立針對宿主元素本身的樣式，而不是針對宿主內部的元素。

<code-example header="src/app/host-selector-example.component.ts" path="component-styles/src/app/host-selector-example.component.ts"></code-example>

建立下列樣式會針對元件的宿主元素。套用到這個選擇器的任何規則，都會影響宿主元素及其所有後代元素（在這個情況下，就是把所有包含的文字變成斜體）。

<code-example header="src/app/hero-details.component.css" path="component-styles/src/app/hero-details.component.css" region="host"></code-example>

`:host` 選擇器只會針對元件的宿主元素。子元件 `:host` 區塊內的任何樣式都*不會*影響父元件。

使用*函式形式*，在 `:host` 後面的小括號內加入另一個選擇器，即可有條件地套用宿主樣式。

在這個範例中，當 `active` CSS 類別套用到宿主元素時，宿主的內容也會變成粗體。

<code-example header="src/app/hero-details.component.css" path="component-styles/src/app/hero-details.component.css" region="hostfunction"></code-example>

`:host` 選擇器也可以與其他選擇器結合。在 `:host` 後面加入選擇器來選取子元素，例如使用 `:host h2` 來針對元件檢視內的所有 `<h2>` 元素。

<div class="alert is-helpful">

你不應該在 `:host` 選取器前面加上選取器 \(`:host-context` 除外\)，來根據元件檢視的外部脈絡為元件設定樣式。
這類選取器並不限定於元件檢視的範圍，會選取外部脈絡，但這不是內建行為。
請改用 `:host-context` 選取器來達成這個目的。

</div>

### :host-context

有時候，根據宿主元素的祖先元素中的某些條件，對元件範本內的元素套用樣式是很有用的。例如，文件 `<body>` 元素上可能套用了某個 CSS 主題類別，而你想據此改變元件的外觀。

使用 `:host-context()` 偽類別選擇器，它的運作方式與 `:host()` 的函式形式相同。`:host-context()` 選擇器會在元件宿主元素的任何祖先元素中（直到文件根元素）尋找 CSS 類別。`:host-context()` 選擇器只有在與另一個選擇器結合時才有用。

下列範例會把元件內的所有文字變成斜體，但只有在宿主元素的某個*祖先*元素具有 CSS 類別 `active` 時才會如此。

<code-example header="src/app/hero-details.component.css" path="component-styles/src/app/hero-details.component.css" region="hostcontext"></code-example>

<div class="alert is-helpful">

注意：<br />
只有宿主元素及其子孫元素會受到影響，不包括被指派 `active` 類別的祖先元素。

</div>

### （已棄用）`/deep/`、`>>>` 與 `::ng-deep`

元件樣式通常只會套用到元件自己範本中的 HTML。

把 `::ng-deep` 偽類別套用到任何 CSS 規則上，會完全停用該規則的檢視封裝。任何套用了 `::ng-deep` 的樣式都會變成全域樣式。要把指定的樣式限定在目前元件及其所有後代元素，請務必在 `::ng-deep` 之前加入 `:host` 選擇器。如果 `::ng-deep` 組合器未搭配 `:host` 偽類別選擇器使用，樣式可能會滲入其他元件。

下列範例會針對從宿主元素開始、經過這個元件、到 DOM 中所有子元素的全部 `<h3>` 元素。

<code-example header="src/app/hero-details.component.css" path="component-styles/src/app/hero-details.component.css" region="deep"></code-example>

`/deep/` 組合器也有 `>>>` 與 `::ng-deep` 這兩個別名。

<div class="alert is-important">

請只在 *emulated* 檢視封裝下使用 `/deep/`、`>>>` 與 `::ng-deep`。
Emulated 是預設且最常用的檢視封裝。
更多資訊請參閱 [View Encapsulation](guide/view-encapsulation) 一節。

</div>

<div class="alert is-important">

穿透陰影的子孫組合器已被棄用，[主要瀏覽器](https://www.chromestatus.com/feature/6750456638341120)與工具正在移除對它的支援。
因此我們計畫在 Angular 中停止支援 \(涵蓋 `/deep/`、`>>>` 與 `::ng-deep` 三者\)。
在那之前，為了與工具保持更廣泛的相容性，應優先使用 `::ng-deep`。

</div>

<a id="loading-styles"></a>

## 載入元件樣式

為元件加入樣式有幾種方式：

*   設定 `styles` 或 `styleUrls` 詮釋資料
*   直接寫在範本 HTML 中
*   使用 CSS 匯入

前面概述的範圍規則適用於上述每一種載入模式。

### 元件詮釋資料中的樣式

在 `@Component` 裝飾器中加入 `styles` 陣列屬性。

陣列中的每個字串都會為這個元件定義一些 CSS。

<code-example header="src/app/hero-app.component.ts (CSS inline)" path="component-styles/src/app/hero-app.component.ts"></code-example>

<div class="alert is-critical">

提醒：
這些樣式*只適用於這個元件*。
它們*不會被*範本中巢狀的任何元件繼承，也不會被投影進元件的任何內容繼承。

</div>

使用 `--inline-style` 旗標建立元件時，Angular CLI 指令 [`ng generate component`](cli/generate) 會定義一個空的 `styles` 陣列。

<code-example format="shell" language="shell">

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

<code-example format="shell" language="shell">

ng generate component hero-app

</code-example>

### 範本內嵌樣式

把 CSS 樣式放在 `<style>` 標籤內，直接嵌入 HTML 範本中。

<code-example header="src/app/hero-controls.component.ts" path="component-styles/src/app/hero-controls.component.ts" region="inlinestyles"></code-example>

### 範本連結標籤

你也可以在元件的 HTML 範本中寫入 `<link>` 標籤。

<code-example header="src/app/hero-team.component.ts" path="component-styles/src/app/hero-team.component.ts" region="stylelink"></code-example>

<div class="alert is-critical">

使用 CLI 建置時，請務必把連結的樣式檔納入要複製到伺服器的資產中，詳見 [Assets configuration guide](guide/workspace-config#資產設定)。

納入之後，CLI 就會包含該樣式表，不論 link 標籤的 href URL 是相對於應用程式根目錄還是元件檔案。

</div>

### CSS @import

使用標準 CSS `@import` 規則，把 CSS 檔案匯入 CSS 檔案中。詳細資訊請參閱 [MDN](https://developer.mozilla.org) 網站上的 [`@import`](https://developer.mozilla.org/en/docs/Web/CSS/@import) 說明。

在這種情況下，URL 是相對於你要匯入的 CSS 檔案。

<code-example header="src/app/hero-details.component.css (excerpt)" path="component-styles/src/app/hero-details.component.css" region="import"></code-example>

### 外部與全域樣式檔案

使用 CLI 建置時，你必須設定 `angular.json`，納入*所有外部資產*，包括外部樣式檔案。

在 `styles` 區段中註冊**全域**樣式檔案，該區段預設已預先設定好全域的 `styles.css` 檔案。

更多資訊請參閱[樣式設定指南](guide/workspace-config#樣式與指令碼設定)。

### 非 CSS 樣式檔案

如果你使用 CLI 建置，可以用 [sass](https://sass-lang.com) 或 [less](https://lesscss.org) 撰寫樣式檔案，並在 `@Component.styleUrls` 詮釋資料中以適當的副檔名（`.scss`、`.less`）指定這些檔案，如下列範例所示：

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
&hellip;

</code-example>

CLI 建置流程會執行相關的 CSS 前處理器。

使用 `ng generate component` 產生元件檔案時，CLI 預設會發出一個空的 CSS 樣式檔案（`.css`）。請依[工作區設定指南](guide/workspace-config#產生原理圖)中的說明，設定 CLI 預設使用你偏好的 CSS 前處理器。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
