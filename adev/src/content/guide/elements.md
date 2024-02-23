# Angular 元素概述

_Angular 元素_ 是將 Angular 元件包裝為 _自訂元素_（也稱為 Web 元件）的 Angular 元件，這是一種以與框架無關的方式定義新的 HTML 元素的網路標準。

[自訂元素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) 是所有支援 Angular 的瀏覽器上可用的 Web 平台功能。
自訂元素透過允許您定義其內容由 JavaScript 程式碼建立和控制的標籤來延伸 HTML。
瀏覽器維護已定義的自訂元素的 `CustomElementRegistry`，它將可實例化的 JavaScript 類別對應到 HTML 標籤。

`@angular/elements` 套件匯出一個 `createCustomElement()` API，提供一個橋樑，從 Angular 的元件介面和變更偵測功能到內建的 DOM API。

將元件轉換為自訂元素會讓所有必要的 Angular 架構都能供瀏覽器使用。
建立自訂元素既簡單又直接，並能自動將您定義的元件檢視與變更偵測及資料繫結連接，同時將 Angular 功能對應到內建 HTML 等效項。

## 使用自訂元素

自訂元素會自行啟動，一加入 DOM 就開始，從 DOM 中移除時就結束。
自訂元素加入 DOM 後，在任何頁面中看來都像其他 HTML 元素，而且不需要任何特殊的 Angular 術語或用法慣例知識。

要將 `@angular/elements` 套件新增到您的工作區，請執行以下指令：

<docs-code language="shell">

npm install @angular/elements --save

</docs-code>

### 運作方式###

`createCustomElement()` 函數將元件轉換為可向瀏覽器註冊為自訂元素的類別。
將設定好的類別向瀏覽器的自訂元素註冊表註冊後，即可直接在內容中將新元素當成內建 HTML 元素使用，並將其新增至 DOM 中：

<docs-code language="html">

&lt;my-popup message="Use Angular!"&gt;&lt;/my-popup&gt;

</docs-code>

當您的自訂元素放在頁面上時，瀏覽器會建立已註冊類別的執行個體，並將其新增至 DOM。
內容由元件範本提供，該範本使用 Angular 範本語法，並使用元件和 DOM 資料進行呈現。
元件中的輸入屬性對應至元素的輸入屬性。

## 將元件轉換為自訂元素

Angular 提供 `createCustomElement()` 函數，用於將 Angular 元件連同其相依項轉換為自訂元素。

轉換程序實作 `NgElementConstructor` 介面，並建立設定為產生元件的自我開機執行個體的建構函式類別。

使用瀏覽器的原生 [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) 函數，以註冊已設定的建構函數及其關聯的客製元素標記至瀏覽器的 [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry)。
當瀏覽器遇到已註冊元素的標記時，它會使用建構函數來建立客製元素實例。

IMPORTANT: 請避免使用元件選取器作為自訂元素標記名稱。
這可能會導致意外行為，因為 Angular 會為單一 DOM 元素建立兩個元件執行個體：
一個常規 Angular 元件和另一個使用自訂元素的元件。

### 對應

自訂元素 _主持_ Angular 元件，在元件中定義的資料和邏輯與標準 DOM API 之間提供橋樑。
元件屬性和邏輯直接映射到 HTML 屬性和瀏覽器的事件系統。

* 創建 API 會剖析組件，尋找輸入屬性，並為自訂元素定義對應的屬性。
  它會轉換屬性名稱，以使其與不區分大小寫的自訂元素相容。
  產生的屬性名稱使用連字符分隔的小寫字母。
  例如，對於具有 `@Input('myInputProp') inputProp` 的組件，對應的自訂元素會定義一個屬性 `my-input-prop`。

* 組件輸出會以 HTML [自訂事件](https://developer.mozilla.org/docs/Web/API/CustomEvent) 形式發送，自訂事件名稱與輸出名稱相符。
  例如，對於具有 `@Output() valueChanged = new EventEmitter()` 的組件，對應的自訂元素會發送名稱為「valueChanged」的事件，而發送的資料會儲存在事件的 `detail` 屬性中。
  如果您提供別名，則會使用該值；例如，`@Output('myClick') clicks = new EventEmitter<string>();` 會導致發送名稱為「myClick」的事件。

如需瞭解詳情，請參閱 Web Component 文件，以取得 [建立自訂事件](https://developer.mozilla.org/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events) 的資訊。

## 範例：快顯服務

以前，當您想要在執行階段將元件新增到應用程式時，您必須定義一個「動態元件」，然後您必須載入它，將它附加到 DOM 中的元素，並連接所有相依性、變更偵測和事件處理。

使用 Angular 自訂元素可讓程序更簡單且更透明，透過自動提供所有基礎架構和架構，您只需定義想要的事件處理類型即可。
（如果您不打算在應用程式中使用該元件，您仍必須將元件排除在編譯之外。）

以下 Popup Service 範例應用程式定義一項您可以動態載入或轉換成自訂元素的元件。

| 檔案                | 詳細                                                                                                                                                                                                                      |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popup.component.ts` | 定義一個簡單的彈出元素，會顯示一個輸入訊息，並帶有一些動畫和樣式。                                                                                                                             |
| `popup.service.ts`   | 建立一個可注入的服務，提供兩種不同的方式來呼叫 `PopupComponent`；作為動態元件或自訂元素。請注意動態載入方法需要更多設定。                                                                  |  |
| `app.component.ts`   | 定義應用程式的根元件，它使用 `PopupService` 在執行時將彈出視窗新增至 DOM。當應用程式執行時，根元件的建構函式會將 `PopupComponent` 轉換成自訂元素。 |

為了便於比較，示範中同時展示了兩種方法。
一個按鈕使用動態加載的方法增加彈出視窗，另一個則使用自訂元素。
結果相同，但準備工作不同。

<docs-code-multifile>
    <docs-code header="popup.component.ts" path="adev/src/content/examples/elements/src/app/popup.component.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/elements/src/app/app.component.ts"/>
</docs-code-multifile>

## 自定義元素的類型

Generic DOM API，例如 `document.createElement()` 或 `document.querySelector()`，會傳回適當於指定參數的元素類型。
例如，呼叫 `document.createElement('a')` 會傳回 `HTMLAnchorElement`，而 TypeScript 知道它具有 `href` 屬性。
類似地，`document.createElement('div')` 會傳回 `HTMLDivElement`，而 TypeScript 知道它沒有 `href` 屬性。

當使用未知元素（例如，我們範例中的自訂元素名稱 `popup-element`）呼叫方法時，這些方法會傳回通用類型，例如 `HTMLElement`，因為 TypeScript 無法推斷傳回元素的正確類型。

使用 Angular 建立的客製元素會延伸 `NgElement`（進而延伸 `HTMLElement`）。
此外，這些客製元素會針對對應元件的每個輸入項目，擁有一個屬性。
例如，我們的 `popup-element` 有 `message` 屬性，類型為 `string`。

如果您想要為自定義元素取得正確的類型，有幾個選項。
假設您根據以下元件建立 `my-dialog` 自定義元素：

<docs-code language="typescript">

&commat;Component(&hellip;)
class MyDialog {
  &commat;Input() content: string;
}

</docs-code>

取得準確的類型最直接的方法是將相關 DOM 方法的傳回值轉換為正確的類型。
為此，請使用 `NgElement` 和 `WithProperties` 類型（均從 `@angular/elements` 匯出）：

<docs-code language="typescript">

const aDialog = document.createElement('my-dialog') as NgElement &amp; WithProperties&lt;{content: string}&gt;;
aDialog.content = 'Hello, world!';
aDialog.content = 123;  // &lt;-- ERROR: TypeScript knows this should be a string.
aDialog.body = 'News';  // &lt;-- ERROR: TypeScript knows there is no `body` property on `aDialog`.

</docs-code>

這是一種快速取得 TypeScript 功能（例如類型檢查和自動完成支援）的良好方式，適用於您的自訂元素。
但如果您需要它在多個地方，它可能會變得繁瑣，因為您必須對每個出現的情況強制轉換回傳類型。

另一種方法，只需定義每個自訂元素的類型一次，即可擴充 `HTMLElementTagNameMap`，TypeScript 會利用它根據標記名稱推斷回傳元素的類型（例如 `document.createElement()`、`document.querySelector()` 等 DOM 方法）：

<docs-code language="typescript">

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement &amp; WithProperties&lt;{content: string}&gt;;
    'my-other-element': NgElement &amp; WithProperties&lt;{foo: 'bar'}&gt;;
    &hellip;
  }
}

</docs-code>

現在，TypeScript 可以像內建元素一樣推斷正確的類型：

<docs-code language="typescript">

document.createElement('div')               //--&gt; HTMLDivElement (built-in element)
document.querySelector('foo')               //--&gt; Element        (unknown element)
document.createElement('my-dialog')         //--&gt; NgElement &amp; WithProperties&lt;{content: string}&gt; (custom element)
document.querySelector('my-other-element')  //--&gt; NgElement &amp; WithProperties&lt;{foo: 'bar'}&gt;      (custom element)

</docs-code>

