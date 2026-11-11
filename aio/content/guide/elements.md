# Angular 元素概覽

_Angular 元素_ 是包裝成_自訂元素_（也稱為 Web Components）的 Angular 元件；自訂元素是一種以與框架無關的方式定義新 HTML 元素的 Web 標準。

<div class="alert is-helpful">

本頁描述的範例應用程式，請參閱 <live-example></live-example>。

</div>

[自訂元素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements)是 Web 平台功能，目前 Chrome、Edge（以 Chromium 為基礎）、Firefox、Opera 與 Safari 都支援，其他瀏覽器則可透過 polyfill 使用（請見[瀏覽器支援](#browser-support)）。自訂元素透過讓你定義標籤來擴充 HTML，該標籤的內容由 JavaScript 程式碼建立與控制。瀏覽器維護一份已定義自訂元素的 `CustomElementRegistry`，將可具現化的 JavaScript 類別對應到 HTML 標籤。

`@angular/elements` 套件匯出了 `createCustomElement()` API 函式，它在 Angular 的元件介面與變更偵測功能和內建 DOM API 之間搭起橋梁。

把元件轉換成自訂元素，能讓瀏覽器使用所有必要的 Angular 基礎設施。
建立自訂元素簡單又直接，它會自動把你以元件定義的檢視與變更偵測及資料繫結連接起來，把 Angular 功能對應到相對應的內建 HTML 等價功能。

<div class="alert is-helpful">

我們正在開發可供其他框架建立的 Web 應用程式使用的自訂元素。Angular 框架的一個最小化、自給自足的版本會以服務的形式注入，以支援元件的變更偵測與資料繫結功能。如需進一步了解開發方向，請看這段[影片簡報](https://www.youtube.com/watch?v=Z1gLFPLVJjY&t=4s)。

</div>

## 使用自訂元素

自訂元素會自行啟動：加入 DOM 時會自動啟動，從 DOM 移除時會自動銷毀。
自訂元素一旦加入任何頁面的 DOM，它的外觀與行為就跟其他 HTML 元素一樣，不需要任何 Angular 術語或使用慣例的特殊知識。

|                                                | 詳細說明 |
|:---                                            |:---     |
| 在 Angular 應用程式中輕鬆建立動態內容 | 把元件轉換成自訂元素，提供了一條在 Angular 應用程式中建立動態 HTML 內容的直截了當的途徑。直接加入 Angular 應用程式 DOM 的 HTML 內容，通常不會經過 Angular 處理就直接顯示，除非你定義一個*動態元件*，自行撰寫程式碼把 HTML 標籤連接到應用程式資料並參與變更偵測。使用自訂元素時，所有這些接線工作都會自動處理好。                                                                                                                                        |
| 內容豐富的應用程式                      | 如果你的應用程式內容豐富，例如本指南描述的 Angular 應用程式，自訂元素能讓你為內容提供者提供精密的 Angular 功能，而不需要他們了解 Angular。舉例來說，像這樣的 Angular 指南是由 Angular 導覽工具直接加入 DOM 的，但可以包含 `<code-snippet>` 這類執行複雜操作的特殊元素。你只需要告訴內容提供者你的自訂元素的語法，他們不需要了解 Angular，也不需要了解你的元件的資料結構或實作。 |

### 運作方式

使用 `createCustomElement()` 函式把元件轉換成一個可以向瀏覽器註冊為自訂元素的類別。
把設定好的類別向瀏覽器的自訂元素註冊表註冊後，你就能像使用內建 HTML 元素一樣，在直接加入 DOM 的內容中使用這個新元素：

<code-example format="html" language="html">

&lt;my-popup message="Use Angular!"&gt;&lt;/my-popup&gt;

</code-example>

當你的自訂元素被放到頁面上時，瀏覽器會建立已註冊類別的執行個體，並把它加入 DOM。
內容由元件的範本提供，該範本使用 Angular 範本語法，並利用元件與 DOM 資料進行算繪。
元件的輸入屬性對應到元素的輸入屬性。

<div class="lightbox">

<img alt="瀏覽器中的自訂元素" class="left" src="generated/images/guide/elements/customElement1.png">

</div>

## 把元件轉換成自訂元素

Angular 提供了 `createCustomElement()` 函式，可將 Angular 元件連同其依賴一起轉換成自訂元素。這個函式會收集元件的可觀察屬性，以及瀏覽器建立與銷毀執行個體、偵測與回應變更所需的 Angular 功能。

轉換過程會實作 `NgElementConstructor` 介面，並建立一個建構函式類別，其設定能產生可自行啟動的元件執行個體。

使用內建的 [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) 函式，把設定好的建構函式及其關聯的自訂元素標籤註冊到瀏覽器的 [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry)。
當瀏覽器遇到已註冊元素的標籤時，它會使用該建構函式建立自訂元素的執行個體。

<div class="lightbox">

<img alt="將元件轉換為自訂元素" class="left" src="generated/images/guide/elements/createElement.png">

</div>

<div class="alert is-important">

請避免使用 [`@Component`](api/core/Component) [selector](api/core/Directive#selector) 作為自訂元素的標籤名稱。這可能導致非預期的行為，因為 Angular 會為單一 DOM 元素建立兩個元件執行個體：一個是一般的 Angular 元件，另一個則是使用自訂元素的那一個。

</div>

### 對應關係

自訂元素_承載_著一個 Angular 元件，在元件中定義的資料與邏輯和標準 DOM API 之間搭起橋梁。
元件的屬性與邏輯會直接對應到 HTML 屬性與瀏覽器的事件系統。

* 建立 API 會解析元件、尋找輸入屬性，並為自訂元素定義對應的屬性。
  它會轉換屬性名稱，使其與不區分大小寫的自訂元素相容。
  產生的屬性名稱使用以連字號分隔的小寫形式。
  例如，對於有 `@Input('myInputProp') inputProp` 的元件，對應的自訂元素會定義一個 `my-input-prop` 屬性。

* 元件的輸出會以 HTML [Custom Events](https://developer.mozilla.org/docs/Web/API/CustomEvent) 的形式派送，自訂事件的名稱與輸出名稱相同。
  例如，對於有 `@Output() valueChanged = new EventEmitter()` 的元件，對應的自訂元素會派送名稱為 `valueChanged` 的事件，發出的資料則儲存在事件的 `detail` 屬性上。
  如果你提供了別名，就會使用該值；例如 `@Output('myClick') clicks = new EventEmitter<string>();` 會派送名稱為 `myClick` 的事件。

如需更多資訊，請參閱 Web Component 文件中的[建立自訂事件](https://developer.mozilla.org/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events)。

<a id="browser-support"></a>

## 自訂元素的瀏覽器支援

最近開發的[自訂元素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) Web 平台功能，目前已有許多瀏覽器原生支援。

| 瀏覽器                 | 自訂元素支援 |
|:---                     |:---                    |
| Chrome                  | 原生支援。    |
| Edge（以 Chromium 為基礎） | 原生支援。    |
| Firefox                 | 原生支援。    |
| Opera                   | 原生支援。    |
| Safari                  | 原生支援。    |

若要把 `@angular/elements` 套件加入你的工作區，請執行下列指令：

<code-example format="shell" language="shell">

npm install @angular/elements --save

</code-example>

## 範例：Popup 服務

以前，當你想在執行階段把元件加入應用程式時，必須定義一個*動態元件*，然後載入它、把它附加到 DOM 中的元素上，並接好所有的依賴、變更偵測與事件處理，如[動態元件載入器](guide/dynamic-component-loader)所述。

使用 Angular 自訂元素能讓這個過程簡單得多、透明得多，因為它會自動提供所有的基礎設施與框架——你只需要定義想要的事件處理方式。

<div class="alert is-helpful">
  如果你不打算在應用程式中使用該元件，你仍然必須把它排除在編譯之外。
</div>

下列 Popup Service 範例應用程式定義了一個元件，你可以動態載入它，或把它轉換成自訂元素。

| 檔案                | 詳細說明 |
|:---                  |:---     |
| `popup.component.ts` | 定義一個簡單的彈出元素，顯示一則輸入訊息，並帶有一些動畫與樣式。                                                                                                                             |
| `popup.service.ts`   | 建立一個可注入服務，提供兩種不同的方式來呼叫 `PopupComponent`：作為動態元件，或作為自訂元素。請注意，動態載入方式需要多得多的前置準備。         |
| `app.module.ts`      | 把 `PopupComponent` 加入模組的 `declarations` 清單。                                                                                                                                                               |
| `app.component.ts`   | 定義應用程式的根元件，它使用 `PopupService` 在執行階段把彈出元素加入 DOM。應用程式執行時，根元件的建構子會把 `PopupComponent` 轉換成自訂元素。 |

為了比較，這個示範展示了兩種方法。
一個按鈕使用動態載入方式加入彈出元素，另一個則使用自訂元素。
結果相同，但前置準備不同。

<code-tabs>
    <code-pane header="popup.component.ts" path="elements/src/app/popup.component.ts"></code-pane>
    <code-pane header="popup.service.ts" path="elements/src/app/popup.service.ts"></code-pane>
    <code-pane header="app.module.ts" path="elements/src/app/app.module.ts"></code-pane>
    <code-pane header="app.component.ts" path="elements/src/app/app.component.ts"></code-pane>
</code-tabs>

## 自訂元素的型別

一般的 DOM API，例如 `document.createElement()` 或 `document.querySelector()`，會傳回適合指定參數的元素型別。
例如，呼叫 `document.createElement('a')` 會傳回 `HTMLAnchorElement`，TypeScript 知道它有 `href` 屬性。
同樣地，`document.createElement('div')` 會傳回 `HTMLDivElement`，TypeScript 知道它沒有 `href` 屬性。

當以未知元素呼叫時，例如自訂元素名稱（本範例中的 `popup-element`），這些方法會傳回一般型別，例如 `HTMLElement`，因為 TypeScript 無法推斷傳回元素的正確型別。

以 Angular 建立的自訂元素繼承自 `NgElement`（而 `NgElement` 又繼承自 `HTMLElement`）。
此外，這些自訂元素會為對應元件的每個輸入各有一個屬性。
例如，我們的 `popup-element` 有一個型別為 `string` 的 `message` 屬性。

如果你想為自訂元素取得正確的型別，有幾種做法。
假設你以下列元件為基礎建立了一個 `my-dialog` 自訂元素：

<code-example format="typescript" language="typescript">

&commat;Component(&hellip;)
class MyDialog {
  &commat;Input() content: string;
}

</code-example>

取得準確型別最直接的方法，是把相關 DOM 方法的傳回值轉型為正確的型別。
為此，請使用 `NgElement` 與 `WithProperties` 型別（兩者都從 `@angular/elements` 匯出）：

<code-example format="typescript" language="typescript">

const aDialog = document.createElement('my-dialog') as NgElement &amp; WithProperties&lt;{content: string}&gt;;
aDialog.content = 'Hello, world!';
aDialog.content = 123;  // &lt;-- ERROR: TypeScript knows this should be a string.
aDialog.body = 'News';  // &lt;-- ERROR: TypeScript knows there is no `body` property on `aDialog`.

</code-example>

這是讓你的自訂元素快速獲得 TypeScript 功能的好方法，例如型別檢查與自動完成支援。
但如果你需要在多個地方使用它，就會變得繁瑣，因為每次出現都得轉換傳回型別。

另一種方法只需要為每個自訂元素定義一次型別，那就是擴充 `HTMLElementTagNameMap`；TypeScript 會用它依標籤名稱推斷傳回元素的型別（適用於 `document.createElement()`、`document.querySelector()` 等 DOM 方法）：

<code-example format="typescript" language="typescript">

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement &amp; WithProperties&lt;{content: string}&gt;;
    'my-other-element': NgElement &amp; WithProperties&lt;{foo: 'bar'}&gt;;
    &hellip;
  }
}

</code-example>

現在，TypeScript 就能以處理內建元素相同的方式推斷正確型別：

<code-example format="typescript" language="typescript">

document.createElement('div')               //--&gt; HTMLDivElement (built-in element)
document.querySelector('foo')               //--&gt; Element        (unknown element)
document.createElement('my-dialog')         //--&gt; NgElement &amp; WithProperties&lt;{content: string}&gt; (custom element)
document.querySelector('my-other-element')  //--&gt; NgElement &amp; WithProperties&lt;{foo: 'bar'}&gt;      (custom element)

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-04-27
