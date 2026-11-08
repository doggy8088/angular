# Angular 元素概覽

_Angular 元素_ 是包裝成_自訂元素_（也稱為 Web Components）的 Angular 元件；自訂元素是一種以與框架無關的方式定義新 HTML 元素的 Web 標準。

[自訂元素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) 是 Web Platform 的功能，在 Angular 支援的所有瀏覽器上都能使用。
自訂元素擴充了 HTML，讓你能定義一個標籤，其內容由 JavaScript 程式碼建立與控制。
瀏覽器維護著已定義自訂元素的 `CustomElementRegistry`，它把可具現化的 JavaScript 類別對應到 HTML 標籤。

`@angular/elements` 套件匯出了 `createCustomElement()` API，它在 Angular 的元件介面與變更偵測功能和內建 DOM API 之間搭起橋梁。

把元件轉換成自訂元素，能讓瀏覽器使用所有必要的 Angular 基礎設施。
建立自訂元素簡單又直接，它會自動把你以元件定義的檢視與變更偵測及資料繫結連接起來，把 Angular 功能對應到相對應的內建 HTML 等價功能。

## 使用自訂元素

自訂元素會自行啟動：加入 DOM 時啟動，從 DOM 移除時銷毀。
自訂元素一旦加入任何頁面的 DOM，它的外觀與行為就跟其他 HTML 元素一樣，不需要任何 Angular 術語或使用慣例的特殊知識。

若要把 `@angular/elements` 套件加入你的工作區，請執行下列指令：

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/elements
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/elements
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/elements
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/elements
  </docs-code>
</docs-code-multifile>

### 運作方式

`createCustomElement()` 函式會把元件轉換成一個可以向瀏覽器註冊為自訂元素的類別。
把設定好的類別向瀏覽器的自訂元素註冊表註冊後，你就能像使用內建 HTML 元素一樣，在直接加入 DOM 的內容中使用這個新元素：

```html
<my-popup message="Use Angular!" />
```

當你的自訂元素被放到頁面上時，瀏覽器會建立已註冊類別的執行個體，並把它加入 DOM。
內容由元件的範本提供，該範本使用 Angular 範本語法，並利用元件與 DOM 資料進行算繪。
元件的輸入屬性對應到元素的輸入屬性。

## 把元件轉換成自訂元素

Angular 提供 `createCustomElement()` 函式，可把 Angular 元件連同其相依性一起轉換成自訂元素。

轉換過程會實作 `NgElementConstructor` 介面，並建立一個建構函式類別，其設定能產生可自行啟動的元件執行個體。

使用瀏覽器原生的 [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) 函式，把設定好的建構函式及其關聯的自訂元素標籤註冊到瀏覽器的 [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry)。
當瀏覽器遇到已註冊元素的標籤時，它會使用該建構函式建立自訂元素的執行個體。

IMPORTANT: 避免把元件的選擇器用作自訂元素的標籤名稱。
這可能導致非預期的行為，因為 Angular 會為單一 DOM 元素建立兩個元件執行個體：
一個是一般的 Angular 元件，另一個是使用自訂元素的元件。

### 對應關係

自訂元素_承載_著一個 Angular 元件，在元件中定義的資料與邏輯和標準 DOM API 之間搭起橋梁。
元件的屬性與邏輯會直接對應到 HTML 屬性與瀏覽器的事件系統。

- 建立 API 會解析元件、尋找輸入屬性，並為自訂元素定義對應的屬性。
  它會轉換屬性名稱，使其與不區分大小寫的自訂元素相容。
  產生的屬性名稱使用以連字號分隔的小寫形式。
  例如，對於有 `inputProp = input('', {alias: 'myInputProp'})` 的元件，對應的自訂元素會定義一個 `my-input-prop` 屬性。

- 元件的輸出會以 HTML [Custom Events](https://developer.mozilla.org/docs/Web/API/CustomEvent) 的形式派送，自訂事件的名稱與輸出名稱相同。
  例如，對於有 `valueChanged = output()` 的元件，對應的自訂元素會派送名稱為 “valueChanged” 的事件，發出的資料則儲存在事件的 `detail` 屬性上。
  如果你提供了別名，就會使用該值；例如 `clicks = output<string>({alias: 'myClick'});` 會派送名稱為 “myClick” 的事件。

如需更多資訊，請參閱 Web Component 文件中的[建立自訂事件](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events#creating_custom_events)。

## 範例：Popup 服務

若要在執行時期把元件加入應用程式，你可以用 `createComponent` API [以程式方式算繪它](guide/components/programmatic-rendering)。
採用這種方式，你必須負責周邊的基礎設施：把元件的宿主檢視附加到 `ApplicationRef` 讓變更偵測能執行、設定它的輸入、訂閱它的輸出，以及在元件移除時分離並清理檢視。

使用 Angular 自訂元素能讓這個過程更簡單、更透明，因為它會自動提供所有這些基礎設施，你要做的只有定義你想要的事件處理方式。

下列 Popup Service 範例應用程式定義了一個元件，你可以動態載入它，或把它轉換成自訂元素。

| 檔案               | 說明                                                                                                                                                        |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popup.ts`         | 定義一個簡單的彈出元素，用來顯示輸入訊息，帶有一些動畫與樣式。                                                                                              |
| `popup.service.ts` | 建立一個可注入的服務，提供兩種不同的方式來叫用 `Popup`：作為動態元件，或作為自訂元素。注意動態載入方式需要多少額外設定。                                    |
| `app.ts`           | 定義應用程式的根元件，它使用 `PopupService` 在執行時期把彈出元素加入 DOM。當應用程式執行時，根元件的建構函式會把 `Popup` 轉換成自訂元素。                  |

為了比較，這個示範展示了兩種方法。
一個按鈕使用動態載入方式加入彈出元素，另一個則使用自訂元素。
結果相同，但前置準備不同。

<docs-code-multifile>
    <docs-code language="angular-ts" header="popup.ts" path="adev/src/content/examples/elements/src/app/popup.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.ts" path="adev/src/content/examples/elements/src/app/app.ts"/>
</docs-code-multifile>

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

```ts
@Component(/* ... */)
class MyDialog {
  content = input('');
}
```

取得準確型別最直接的方法，是把相關 DOM 方法的傳回值轉型為正確的型別。
為此，請使用 `NgElement` 與 `WithProperties` 型別（兩者都從 `@angular/elements` 匯出）：

```ts
const aDialog = document.createElement('my-dialog') as NgElement &
  WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123; // <-- ERROR: TypeScript knows this should be a string.
aDialog.body = 'News'; // <-- ERROR: TypeScript knows there is no `body` property on `aDialog`.
```

這是讓你的自訂元素快速獲得 TypeScript 功能的好方法，例如型別檢查與自動完成支援。
但如果你需要在多個地方使用它，就會變得繁瑣，因為每次出現都得轉換傳回型別。

另一種方法只需要為每個自訂元素定義一次型別，那就是擴充 `HTMLElementTagNameMap`；TypeScript 會用它依標籤名稱推斷傳回元素的型別（適用於 `document.createElement()`、`document.querySelector()` 等 DOM 方法）：

```ts

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    …
  }
}

```

現在，TypeScript 就能以處理內建元素相同的方式推斷正確型別：

```ts
document.createElement('div'); //--> HTMLDivElement (built-in element)
document.querySelector('foo'); //--> Element        (unknown element)
document.createElement('my-dialog'); //--> NgElement & WithProperties<{content: string}> (custom element)
document.querySelector('my-other-element'); //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)
```

## 限制

由於 [disconnect()](https://github.com/angular/angular/issues/38778) 回呼存在問題，銷毀後再重新附加以 `@angular/elements` 建立的自訂元素時應多加小心。你可能在下列情況遇到這個問題：

- 在 `AngularJS` 的 `ng-if` 或 `ng-repeat` 中算繪元件
- 手動將元素從 DOM 分離後再重新附加
