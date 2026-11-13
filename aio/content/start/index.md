# 開始使用 Angular：你的第一個應用程式

歡迎使用 Angular！

本教學將帶你逐步建置一個簡單的電子商務網站，其中包含商品目錄、購物車與結帳表單，藉此介紹 Angular 的基本要素。它使用 [StackBlitz](https://stackblitz.com/ "StackBlitz website") 線上開發環境，讓你可以立即開始。


<div class="alert is-helpful">

本指南使用 StackBlitz Generator，展示一個現成的簡單應用程式，你可以互動式地檢視與操作它。在實際開發中，你通常會使用 [Angular CLI](guide/glossary#命令列介面（command-line-interface，cli）)，這是一個強大的命令列工具，讓你可以產生與修改應用程式。如需進一步了解，請參閱 [CLI 總覽](cli)。

</div>

<div class="callout is-helpful">
<header>剛接觸網頁開發？</header>


 有許多資源可以輔助 Angular 文件。Mozilla 的 MDN 文件包含 [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML "Learning HTML: Guides and tutorials") 與 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript "JavaScript") 的入門介紹。[TypeScript 文件](https://www.typescriptlang.org/docs/home.html "TypeScript documentation")包含一份 5 分鐘教學。各種線上課程平台，例如 [Udemy](http://www.udemy.com "Udemy online courses") 與 [Codecademy](https://www.codecademy.com/ "Codecademy online courses")，也涵蓋了網頁開發的基礎知識。


</div>



{@a new-project}
## 建立新專案

<h4>
<live-example name="getting-started-v0" noDownload>點這裡在 StackBlitz 中建立新專案。</live-example>
</h4>

StackBlitz 會建立一個起始 Angular 應用程式，其中包含頂端
列&mdash;含有商店名稱與
結帳圖示&mdash;，以及商品清單的標題。


<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/start/new-app.png" alt="入門線上商店應用程式">
  </div>
</figure>


<div class="callout is-helpful">
<header>StackBlitz 小提示</header>

* 登入 StackBlitz，這樣你就可以儲存你的工作並稍後繼續。
如果你有 GitHub 帳號，你可以使用
該帳號登入 StackBlitz。為了儲存你的進度，請先
使用左上方的 Fork 按鈕分叉專案，
之後你就能按一下儲存按鈕，將你的工作儲存到你自己的 StackBlitz
帳號。
* 若要從本教學複製程式碼範例，請按一下
程式碼範例方框右上方的圖示，然後將
剪貼簿中的程式碼片段貼到 StackBlitz 中。
* 如果 StackBlitz 預覽窗格沒有顯示你
預期的內容，請先儲存，然後按一下重新整理按鈕。
* StackBlitz 持續改進中，因此在產生的程式碼
上可能會有細微差異，但應用程式的
行為將會相同。

</div>

{@a template-syntax}
## 範本語法

Angular 的範本語法擴充了 HTML 與 JavaScript。
本節透過強化「Products」區域，介紹範本語法。

<div class="alert is-helpful">

為了幫助你開始，下列步驟使用預先定義的商品資料，以及 `product-list.component.ts` 檔案中的方法。

</div>

1. 在 `product-list` 資料夾中，開啟範本
檔案 `product-list.component.html`。

1. 修改商品清單範本，顯示商品名稱清單。

    1. 清單中的每項商品都以相同方式顯示，一個接著一個出現在頁面上。若要逐一處理預先定義的商品清單，請在 `<div>` 上加入 `*ngFor` 指令，如下所示：

      <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html" region="ngfor">
      </code-example>

      使用 `*ngFor` 時，`<div>` 會針對清單中的每項商品重複出現。

      <div class="alert is-helpful">

      `*ngFor` 是一個「結構指令」。結構指令會透過新增、移除與操作它們所附加的元素，來塑造或重塑 DOM 的結構。任何帶有星號 `*` 的指令都是結構指令。

      </div>

    1. 若要顯示商品的名稱，請使用內插語法 `{{ }}`。內插會將屬性的值算繪為文字。在 `<div>` 內加入一個 `<h3>`，顯示商品 name 屬性的內插結果：

      <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html" region="interpolation">
      </code-example>

      預覽窗格會立即更新，顯示清單中每項商品的名稱。

      <figure class="lightbox">
        <div class="card">
          <img src="generated/images/guide/start/template-syntax-product-names.png" alt="已將產品名稱加入清單">
        </div>
      </figure>

1. 若要讓每個商品名稱成為連往商品詳細資訊的連結，請加入 `<a>` 元素，並使用屬性繫結 `[ ]` 語法，將它的標題設定為商品的名稱，如下所示：

    <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    在預覽窗格中，將滑鼠游標停留在商品
    名稱上，即可看到繫結的 name 屬性值，也就是
    商品名稱加上「details」一詞。
    內插 `{{ }}` 可讓你將
    屬性值算繪為文字；屬性繫結 `[ ]` 可讓你
    在範本運算式中使用屬性值。

    <figure class="lightbox">
      <div class="card">
        <img src="generated/images/guide/start/template-syntax-product-anchor.png" alt="產品名稱錨點文字為產品名稱屬性">
      </div>
    </figure>


4. 加入商品描述。在 `<p>` 元素上使用 `*ngIf` 指令，讓 Angular 只有在目前商品有描述時才建立 `<p>` 元素。

    <code-example path="getting-started/src/app/product-list/product-list.component.3.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    應用程式現在會顯示清單中每項商品的名稱與描述。請注意，最後一項商品沒有描述段落。因為該商品的 description 屬性是空的，Angular 不會建立 `<p>` 元素&mdash;包括「Description」一詞。

    <figure class="lightbox">
      <div class="card">
      <img src="generated/images/guide/start/template-syntax-product-description.png" alt="已將產品描述加入清單">
      </div>
    </figure>

5. 加入一個按鈕，讓使用者可以與朋友分享商品。把按鈕的 `click` 事件繫結到 `share()` 方法（位於 `product-list.component.ts` 中）。事件繫結會在事件周圍使用一組括號 `( )`，如下列 `<button>` 元素所示：

    <code-example path="getting-started/src/app/product-list/product-list.component.4.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    每項商品現在都有一個「Share」按鈕：

    <figure class="lightbox">
      <div class="card">
      <img src="generated/images/guide/start/template-syntax-product-share-button.png" alt="已為每個產品加入分享按鈕">
      </div>
    </figure>

    測試「Share」按鈕：

    <figure class="lightbox">
      <div class="card">
      <img src="generated/images/guide/start/template-syntax-product-share-alert.png" alt="表示產品已分享的警示方塊">
      </div>
    </figure>

這個應用程式現在有商品清單與分享功能。
在這個過程中，你已學會使用 Angular 範本語法的五個常見功能：
* `*ngFor`
* `*ngIf`
* 內插 `{{ }}`
* 屬性繫結 `[ ]`
* 事件繫結 `( )`


<div class="alert is-helpful">

如需進一步了解 Angular 範本語法的完整功能，請參閱[範本語法](guide/template-syntax "Template Syntax")。

</div>


{@a components}
## 元件

*元件*定義了使用者介面（即 UI）中的責任範圍，
讓你可以重複使用一組 UI 功能。
你已經用商品清單元件建立了一個元件。

一個元件由三個部分組成：
* **元件類別**負責處理資料與功能。在上一節中，元件類別裡的商品資料與 `share()` 方法分別負責處理資料與功能。
* **HTML 範本**決定 UI。在上一節中，商品清單的 HTML 範本為每項商品顯示名稱、描述與「Share」按鈕。
* **元件專屬樣式**定義外觀與感覺。
雖然商品清單沒有定義任何樣式，這裡就是元件 CSS
所在之處。

<!--
### Class definition

Let's take a quick look a the product list component's class definition:

1. In the `product-list` directory, open `product-list.component.ts`.

1. Notice the `@Component` decorator. This provides metadata about the component, including its templates, styles, and a selector.

    * The `selector` is used to identify the component. The selector is the name you give the Angular component when it is rendered as an HTML element on the page. By convention, Angular component selectors begin with the prefix such as `app-`, followed by the component name.

    * The template and style filename also are provided here. By convention each of the component's parts is in a separate file, all in the same directory and with the same prefix.

1. The component definition also includes an exported class, which handles functionality for the component. This is where the product list data and `Share()` method are defined.

### Composition
-->

Angular 應用程式由一棵元件樹組成，其中每個 Angular 元件都有其特定的用途與責任。

目前，這個範例應用程式有三個元件：

<figure class="lightbox">
  <div class="card">
  <img src="generated/images/guide/start/app-components.png" alt="含三個元件的線上商店">
  </div>
</figure>

* `app-root`（橘色方框）是應用程式外殼。這是第一個載入的元件，也是所有其他元件的父元件。你可以把它想成是基礎頁面。
* `app-top-bar`（藍色背景）是商店名稱與結帳按鈕。
* `app-product-list`（紫色方框）是你在上一節中修改的商品清單。

下一節會把新的元件&mdash;商品提醒&mdash;作為商品清單元件的子元件加入，藉此擴充應用程式的功能。


<div class="alert is-helpful">

如需進一步了解元件，以及它們如何與範本互動，請參閱[元件簡介](guide/architecture-components "Architecture > Introduction to Components")。

</div>


{@a input}
## 輸入

目前，商品清單會顯示每項商品的名稱與描述。
商品清單元件還定義了一個 `products` 屬性，其中包含從 `products.ts` 的 `products` 陣列匯入的每項商品資料。

下一步是建立一個新的提醒功能，它會將商品作為輸入。該提醒會檢查商品的價格，如果價格大於 $700，就顯示「Notify Me」按鈕，讓使用者能註冊通知，在商品特價時收到通知。

1. 建立一個新的商品提醒元件。

    1. 在 `app` 資料夾上按右鍵，使用 `Angular Generator` 產生一個名為 `product-alerts` 的新元件。

        <figure class="lightbox">
          <div class="card">
          <img src="generated/images/guide/start/generate-component.png" alt="產生元件的 StackBlitz 指令">
          </div>
        </figure>

        產生器會為元件的三個部分建立起始檔案：
        * `product-alerts.component.ts`
        * `product-alerts.component.html`
        * `product-alerts.component.css`

1. 開啟 `product-alerts.component.ts`。

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="as-generated"></code-example>

    1. 注意 `@Component()` 裝飾器。它表示接下來的類別是一個元件。它提供關於元件的中繼資料，包括其選取器、範本與樣式。

        * `selector` 用來識別元件。選取器是你在 Angular 元件以 HTML 元素形式算繪到頁面上時給它的名稱。按照慣例，Angular 元件選取器以 `app-` 這樣的前置詞開頭，後面接著元件名稱。

        * 範本與樣式檔案名稱參照 StackBlitz 產生的 HTML 與 CSS 檔案。

    1. 元件定義也會匯出 `ProductAlertsComponent` 類別，該類別負責處理元件的功能。

1. 設定新的商品提醒元件，接收商品作為輸入：

    1. 從 `@angular/core` 匯入 `Input`。

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="imports" header="src/app/product-list/product-alerts.component.ts"></code-example>

    1. 在 `ProductAlertsComponent` 類別定義中，定義一個名為 `product` 的屬性，並加上 `@Input()` 裝飾器。`@Input()` 裝飾器表示該屬性值是從元件的父元件，也就是商品清單元件傳入的。

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="input-decorator" header="src/app/product-list/product-alerts.component.ts"></code-example>

1. 定義新商品提醒元件的檢視。

    1. 開啟 `product-alerts.component.html` 範本，將預留位置段落替換為一個「Notify Me」按鈕，該按鈕會在商品價格超過 $700 時出現。

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.1.html"></code-example>

1. 將新的商品提醒元件顯示為商品清單的子元件。

    1. 開啟 `product-list.component.html`。

    1. 若要包含新元件，請將其選取器 `app-product-alert` 像 HTML 元素一樣使用。

    1. 使用屬性繫結，將目前商品作為輸入傳遞給該元件。

        <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.5.html" region="app-product-alerts"></code-example>

新的商品提醒元件會從商品清單接收一項商品作為輸入。有了該輸入，它會根據商品價格顯示或隱藏「Notify Me」按鈕。Phone XL 的價格超過 $700，因此「Notify Me」按鈕會出現在該商品上。

<figure class="lightbox">
  <div class="card">
  <img src="generated/images/guide/start/product-alert-button.png" alt="已為超過 700 美元的產品加入產品警示按鈕">
  </div>
</figure>

<div class="alert is-helpful">

如需進一步了解如何將資料從父元件傳遞給子元件、攔截並處理來自父元件的值，以及偵測並處理輸入屬性值的變更，請參閱[元件互動](guide/component-interaction "Components & Templates > Component Interaction")。

</div>


{@a output}
## 輸出

若要讓「Notify Me」按鈕發揮作用，你需要設定兩件事：

  - 讓商品提醒元件在使用者按一下「Notify Me」時發出事件
  - 讓商品清單元件對該事件作出反應

1. 開啟 `product-alerts.component.ts`。

1. 從 `@angular/core` 匯入 `Output` 與 `EventEmitter`：

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.ts" region="imports"></code-example>

1. 在元件類別中，定義一個名為 `notify` 的屬性，並加上 `@Output()` 裝飾器與 `EventEmitter()` 的執行個體。這可讓商品提醒元件在 notify 屬性的值變更時發出事件。

    <code-example path="getting-started/src/app/product-alerts/product-alerts.component.ts" header="src/app/product-alerts/product-alerts.component.ts" region="input-output"></code-example>

1. 在商品提醒範本 `product-alerts.component.html` 中，更新「Notify Me」按鈕，加入事件繫結以呼叫 `notify.emit()` 方法。

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.html"></code-example>

1. 接著，定義使用者按一下按鈕時應該發生的行為。回想一下，當子元件引發事件時，是由父元件商品清單元件&mdash;而非商品提醒元件&mdash;採取行動。在  `product-list.component.ts` 中，定義一個 `onNotify()` 方法，類似於 `share()` 方法：

    <code-example header="src/app/product-list/product-list.component.ts" path="getting-started/src/app/product-list/product-list.component.ts" region="on-notify"></code-example>

1. 最後，更新商品清單元件，使其接收來自商品提醒元件的輸出。

    在 `product-list.component.html` 中，將 `app-product-alerts` 元件（即顯示「Notify Me」按鈕的元件）繫結到商品清單元件的 `onNotify()` 方法。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.6.html" region="on-notify"></code-example>

1. 試試「Notify Me」按鈕：

    <figure class="lightbox">
      <div class="card">
      <img src="generated/images/guide/start/product-alert-notification.png" alt="產品警示通知確認對話方塊">
      </div>
    </figure>


<div class="alert is-helpful">

如需進一步了解如何監聽子元件的事件、讀取子元件屬性或呼叫子元件方法，以及使用服務在元件之間進行雙向通訊，請參閱[元件互動](guide/component-interaction "Components & Templates > Component Interaction")。

</div>


{@a next-steps}
## 後續步驟

恭喜！你已完成你的第一個 Angular 應用程式！

你已有一個基本的線上商店目錄，包含商品清單、「Share」按鈕與「Notify Me」按鈕。
你已了解 Angular 的基礎：元件與範本語法。
你也已了解元件類別與範本如何互動，以及元件如何彼此通訊。

要繼續探索 Angular，請選擇下列其中一個選項：
* [繼續前往「Routing」一節](start/routing "Getting Started: Routing")，建立一個可以點選商品名稱存取、且具有專屬 URL 格式的商品詳細資料頁面。
* [直接跳到「Deployment」一節](start/deployment "Getting Started: Deployment")，轉移到本機開發，或將應用程式部署到 Firebase 或你自己的伺服器。
