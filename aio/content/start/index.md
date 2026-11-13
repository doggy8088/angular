# 開始使用 Angular

歡迎使用 Angular！

本教學將帶你逐步建立一個包含商品目錄、購物車與結帳表單的電子商務網站，藉此介紹 Angular 的基本要素。

為了讓你立即開始，本教學使用一個現成的應用程式，你可以在 [Stackblitz](https://stackblitz.com/) 上互動式地檢視與修改它&mdash;不需要[設定本機工作環境](guide/setup-local "Setup guide")。
StackBlitz 是一個以瀏覽器為基礎的開發環境，你可以在其中使用各種技術建立、儲存及分享專案。

## 先備條件

為了充分利用本教學，你應該已經對下列內容有基本的了解。

* [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML "Learning HTML: Guides and tutorials")
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript "JavaScript")
* [TypeScript](https://www.typescriptlang.org/ "The TypeScript language")


{@a components}
## 瀏覽範例應用程式

你使用元件來建立 Angular 應用程式。
元件定義了 UI 中的責任範圍，讓你可以重複使用一組 UI 功能。

一個元件由三個部分組成：

* **元件類別**負責處理資料與功能。
* **HTML 範本**決定 UI。
* **元件專屬樣式**定義外觀與感覺。

本指南示範如何使用下列元件來建立應用程式。

* `<app-root>`&mdash;第一個載入的元件，也是其他元件的容器。
* `<app-top-bar>`&mdash;商店名稱與結帳按鈕。
* `<app-product-list>`&mdash;商品清單。
* `<app-product-alerts>`&mdash;包含應用程式提醒的元件。

<div class="lightbox">
  <img src="generated/images/guide/start/app-components.png" alt="含三個元件的線上商店">
</div>

如需進一步了解元件，請參閱[元件簡介](guide/architecture-components "Introduction to Components and Templates")。


{@a new-project}

## 建立範例專案

若要建立範例專案，請產生 <live-example name="getting-started-v0" noDownload>StackBlitz 中的現成範例專案</live-example>。
若要儲存你的工作：

1. 登入 StackBlitz。
1. 分叉你產生的專案。
1. 定期儲存。

在 StackBlitz 中，右側的預覽窗格會顯示範例應用程式的起始狀態。
預覽包含兩個區域：

* 頂端列，包含商店名稱 *My Store* 與一個結帳按鈕
* 商品清單的標頭 *Products*

<div class="lightbox">
  <img src="generated/images/guide/start/new-app-all.gif" alt="入門線上商店應用程式">
</div>

左側的專案區段會顯示構成應用程式的原始碼檔案，包括基礎架構與設定檔。

當你產生教學隨附的 StackBlitz 範例應用程式時，StackBlitz 會為你建立起始檔案與模擬資料。
你在整個教學中使用的檔案都位於 `src` 資料夾中。

如需進一步了解如何使用 StackBlitz，請參閱 [StackBlitz 文件](https://developer.stackblitz.com/docs/platform/)。

{@a product-list}
## 建立商品清單

在本節中，你將更新應用程式以顯示商品清單。
你將使用 `products.ts` 檔案中預先定義的商品資料，以及 `product-list.component.ts` 檔案中的方法。
本節將引導你編輯 HTML，也就是所謂的範本。

1. 在 `product-list` 資料夾中，開啟範本檔案 `product-list.component.html`。

1. 在 `<div>` 上加入 `*ngFor` 結構指令，如下所示。

  <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html" region="ngfor">
  </code-example>

  使用 `*ngFor` 時，`<div>` 會針對清單中的每項商品重複出現。

  結構指令會透過新增、移除與操作元素，來塑造或重塑 DOM 的結構。
  如需進一步了解結構指令，請參閱[結構指令](guide/structural-directives)。

1. 在 `<div>` 內加入 `<h3>` 與 `{{ product.name }}`。
  `{{ product.name }}` 陳述式是 Angular 內插語法的一個範例。
  內插 `{{ }}` 可讓你將屬性值渲染為文字。

  <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html" region="interpolation">
</code-example>

  預覽窗格會更新，顯示清單中每項商品的名稱。

  <div class="lightbox">
    <img src="generated/images/guide/start/template-syntax-product-names.png" alt="已將產品名稱加入清單">
  </div>

1. 若要讓每個商品名稱成為連往商品詳細資訊的連結，請把 `<a>` 元素加在 `{{ product.name }}` 外圍。

1. 使用屬性繫結 `[ ]` 語法，將標題設定為商品的名稱，如下所示：

    <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    在預覽窗格中，將滑鼠游標停留在商品名稱上，即可看到繫結的 name 屬性值，也就是商品名稱加上「details」一詞。
    屬性繫結 `[ ]` 可讓你在範本運算式中使用屬性值。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-anchor.png" alt="產品名稱錨點文字為產品名稱屬性">
    </div>

1. 加入商品描述。在 `<p>` 元素上使用 `*ngIf` 指令，讓 Angular 只有在目前商品有描述時才建立 `<p>` 元素。

    <code-example path="getting-started/src/app/product-list/product-list.component.3.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    應用程式現在會顯示清單中每項商品的名稱與描述。
    請注意，最後一項商品沒有描述段落。
    Angular 不會建立 `<p>` 元素，因為該商品的 description 屬性是空的。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-description.png" alt="已將產品描述加入清單">
    </div>

1. 加入一個按鈕，讓使用者可以分享商品。
  將按鈕的 `click` 事件繫結到 `product-list.component.ts` 中的 `share()` 方法。事件繫結會在事件周圍使用一組括號 `( )`，例如 `<button>` 元素上的 `(click)` 事件。

    <code-example path="getting-started/src/app/product-list/product-list.component.4.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    每項商品現在都有一個 **Share** 按鈕。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-button.png" alt="已為每個產品加入分享按鈕">
    </div>

    按一下 **Share** 按鈕會觸發一個提醒，指出「The product has been shared!」。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-alert.png" alt="表示產品已分享的警示方塊">
    </div>

在編輯範本的過程中，你已經探索了 Angular 範本一些最受歡迎的功能。
如需進一步了解，請參閱[元件與範本簡介](guide/architecture-components#範本語法 "Template Syntax")。

{@a passing-data-in}

## 將資料傳遞給子元件

目前商品清單會顯示每項商品的名稱與描述。
`ProductListComponent` 也定義了一個 `products` 屬性，其中包含從 `products.ts` 的 `products` 陣列匯入的每項商品資料。

下一步是建立一個新的提醒功能，它會使用來自 `ProductListComponent` 的商品資料。
該提醒會檢查商品的價格，如果價格大於 $700，就會顯示 **Notify Me** 按鈕，讓使用者能註冊通知，在商品特價時收到通知。

本節將帶你逐步建立一個子元件 `ProductAlertsComponent`，它可以從其父元件 `ProductListComponent` 接收資料。

1. 在 `app` 資料夾上按右鍵，使用 `Angular Generator` 產生一個名為 `product-alerts` 的新元件。

  <div class="lightbox">
    <img src="generated/images/guide/start/generate-component.png" alt="產生元件的 StackBlitz 指令">
  </div>

    產生器會為元件的三個部分建立起始檔案：
    * `product-alerts.component.ts`
    * `product-alerts.component.html`
    * `product-alerts.component.css`

1. 開啟 `product-alerts.component.ts`。
  `@Component()` 裝飾器表示接下來的類別是一個元件。
  `@Component()` 也提供關於元件的中繼資料，包括其選取器、範本與樣式。

  <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="as-generated"></code-example>

  `@Component()` 的主要功能如下：

    * `selector`（即 `app-product-alerts`）用來識別元件。
      按照慣例，Angular 元件選取器以 `app-` 前置詞開頭，後面接著元件名稱。
    * 範本與樣式檔案名稱參照元件的 HTML 與 CSS。
    * `@Component()` 定義也會匯出 `ProductAlertsComponent` 類別，該類別負責處理元件的功能。

1. 若要設定 `ProductAlertsComponent` 來接收商品資料，請先從 `@angular/core` 匯入 `Input`。

  <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="imports" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

1. 在 `ProductAlertsComponent` 類別定義中，定義一個名為 `product` 的屬性，並加上 `@Input()` 裝飾器。
  `@Input()` 裝飾器表示該屬性值是從元件的父元件 `ProductListComponent` 傳入的。

  <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="input-decorator" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

1. 開啟 `product-alerts.component.html`，將預留位置段落替換為一個 **Notify Me** 按鈕，該按鈕會在商品價格超過 $700 時出現。

  <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.1.html"></code-example>

1. 若要將 `ProductAlertsComponent` 顯示為 `ProductListComponent` 的子元件，請將選取器 `<app-product-alerts>` 加入 `product-list.component.html`。
  使用屬性繫結將目前商品作為輸入傳遞給該元件。

  <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.5.html" region="app-product-alerts"></code-example>

新的商品提醒元件會從商品清單接收一項商品作為輸入。
有了該輸入，它會根據商品價格顯示或隱藏 **Notify Me** 按鈕。
Phone XL 的價格超過 $700，因此 **Notify Me** 按鈕會出現在該商品上。

<div class="lightbox">
  <img src="generated/images/guide/start/product-alert-button.png" alt="已為超過 700 美元的產品加入產品警示按鈕">
</div>

{@a output}

## 將資料傳遞給父元件

若要讓 **Notify Me** 按鈕發揮作用，子元件需要通知父元件並將資料傳遞給它。
`ProductAlertsComponent` 需要在使用者按一下 **Notify Me** 時發出事件，而 `ProductListComponent` 需要回應此事件。

1. 在 `product-alerts.component.ts` 中，從 `@angular/core` 匯入 `Output` 與 `EventEmitter`。

  <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.ts" region="imports"></code-example>

1. 在元件類別中，定義一個名為 `notify` 的屬性，並加上 `@Output()` 裝飾器與 `EventEmitter()` 的執行個體。
  使用 `@Output()` 設定 `ProductAlertsComponent`，可讓 `ProductAlertsComponent` 在 `notify` 屬性的值變更時發出事件。

  <code-example path="getting-started/src/app/product-alerts/product-alerts.component.ts" header="src/app/product-alerts/product-alerts.component.ts" region="input-output"></code-example>

  <div class="alert is-helpful">

  在新元件中，Angular 產生器會加入一個空的 `constructor()`、`OnInit` 介面以及 `ngOnInit()` 方法。
  由於這些步驟不會用到它們，以下程式碼範例為求簡潔將其省略。

  </div>

1. 在 `product-alerts.component.html` 中，更新 **Notify Me** 按鈕，加入事件繫結以呼叫 `notify.emit()` 方法。

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.html"></code-example>

1. 定義使用者按一下按鈕時發生的行為。
  當子元件引發事件時，是由父元件 `ProductListComponent`&mdash;而非 `ProductAlertsComponent`&mdash;採取行動。
  在 `product-list.component.ts` 中，定義一個 `onNotify()` 方法，類似於 `share()` 方法。

  <code-example header="src/app/product-list/product-list.component.ts" path="getting-started/src/app/product-list/product-list.component.ts" region="on-notify"></code-example>

1. 更新 `ProductListComponent`，使其從 `ProductAlertsComponent` 接收資料。

  在 `product-list.component.html` 中，將 `<app-product-alerts>` 繫結到商品清單元件的 `onNotify()` 方法。
  `<app-product-alerts>` 就是顯示 **Notify Me** 按鈕的元素。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.6.html" region="on-notify"></code-example>

1. 按一下 **Notify Me** 按鈕，觸發一個內容為「You will be notified when the product goes on sale」的提醒。

  <div class="lightbox">
    <img src="generated/images/guide/start/product-alert-notification.png" alt="產品警示通知確認對話方塊">
  </div>

如需進一步了解元件之間的通訊，請參閱[元件互動](guide/component-interaction "Component interaction")。

{@a whats-next}

## 後續步驟

在本節中，你已經建立了一個會逐一處理資料的應用程式，其中包含彼此通訊的元件。

若要繼續探索 Angular 並開發此應用程式：

* 繼續前往[應用程式內導覽](start/start-routing "Getting started: In-app navigation")，建立商品詳細資訊頁面。
* 直接跳到[部署](start/start-deployment "Getting started: Deployment")，轉移到本機開發，或將應用程式部署到 Firebase 或你自己的伺服器。
