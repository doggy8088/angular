# 理解 Binding

在 Angular 範本中，繫結會在從範本建立的 UI 部分（DOM 元素、指令或元件）和模型（範本所屬的元件實例）之間建立動態連結。此連結可以用於將檢視與模型同步，在檢視中發生事件或使用者動作時通知模型，或同時進行這兩項操作。Angular 的 [變更偵測](best-practices/runtime-performance) 演算法負責讓檢視和模型保持同步。

範例包含：

* 文字插補
* 屬性繫結
* 事件繫結
* 雙向繫結

繫結總是包含兩部分：一個會接收繫結值的 _目標_，以及一個從模型產生值的 _範本表達式_。

## 語法

模板表達式類似於 JavaScript 表達式。
許多 JavaScript 表達式都是合法的模板表達式，但有以下例外。

你不能使用有或促進副作用的 JavaScript 表達式，包括：

* 指定（`=`, `+=`, `-=`, `...`）
* 運算子，例如 `new`, `typeof` 或 `instanceof`
* 以 ; 或 , 連結表達式
* 增量和減量運算子 `++` 和 `--`
* 一些 ES2015+ 運算子

其他與 JavaScript 語法值得注意的不同包括：

* 不支援位元運算子，例如 `|` 和 `&`

## 表達式內容

插補表達式有一個情境&mdash;一個表達式所屬的應用程式特定部分。通常，這個情境是元件實例。

在以下程式碼片段中，表達式 `recommended` 和表達式 `itemImageUrl2` 參考 `AppComponent` 的屬性。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="component-context" header="src/app/app.component.html"/>

表達式也可以參照範本的內容屬性，例如 [範本輸入變數](guide/directives/structural-directives#shorthand) 或 [範本參考變數](guide/templates/reference-variables)。

以下範例使用範本輸入變數 `customer`。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="template-input-variable" header="src/app/app.component.html (template input variable)"/>

以下範例具有範本參考變數 `#customerInput`。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="template-reference-variable" header="src/app/app.component.html (template reference variable)"/>

HELPFUL: 範本表達式無法參照全域名稱空間中的任何內容，但 `undefined` 除外。它們無法參照 `window` 或 `document`。此外，它們無法呼叫 `console.log()` 或 `Math.max()`，並且僅限於參照表達式內容的成員。

### 避免名稱衝突

運算式評估的內容是範本變數、指令的內容物件（如果有的話）和元件成員的聯集。
如果您參照屬於多個這些命名空間的名稱，則 Angular 會套用下列優先順序邏輯來決定內容：

1. 範本變數名稱。
1. 指令文脈中的名稱。
1. 元件的成員名稱。

為了避免變數遮蔽其他內容中的變數，請保持變數名稱的唯一性。
在以下範例中，`AppComponent` 範本向顧客 Padma 問候。

`@for` 然後列出 `customers` 陣列中的每個 `customer`。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.1.ts" visibleRegion="var-collision" header="src/app/app.component.ts"/>

`@for` 內的 `customer` 處於由 _@for_ 定義的隱含 `<ng-template>` 的上下文中。它指的是 `customers` 陣列中的每一個 `customer`，並顯示「Ebony」和「Chiho」。沒有顯示「Padma」，因為該名稱不在該陣列中。

另一方面，`<h1>` 顯示「Padma」，這個值繫結到元件類別中 `customer` 屬性的值。

## 表達式最佳做法

使用範本表達式時，請遵循以下最佳範例：

* **使用簡短的表達式**

盡可能使用屬性名稱或方法呼叫。將應用程式和業務邏輯保留在元件中，以便於開發和測試。

* **快速執行**

Angular 在每次變更偵測週期之後執行範本表達式。許多非同步活動會觸發變更偵測週期，例如承諾解決、HTTP 結果、計時器事件、按鍵和滑鼠移動。

表達式應該快速完成以保持使用者體驗盡可能有效率，尤其是在較慢的裝置上。當其運算需要更多資源時，請考慮快取值。

## 無明顯的副作用

根據 Angular 的單向資料流模型，範本表達式不應變更目標屬性值以外的任何應用程式狀態。讀取元件值不應變更其他顯示值。檢視應在單一繪製過程中保持穩定。

<docs-callout title='冪等表達式減少副作用'>

[冪等](https://zh.wikipedia.org/wiki/%E5%89%B2%E7%AD%89) 表達式沒有副作用，並可改善 Angular 的變更偵測效能。在 Angular 用語中，冪等表達式在任一相依值變更之前，始終回傳「完全相同的事物」。

在事件循環的一次單次輪轉期間，相依值不應變更。如果一個冪等表達式回傳一個字串或一個數字，它會在您連續呼叫它兩次時回傳相同的字串或數字。如果表達式回傳一個物件，包括一個陣列，它會在您連續呼叫它兩次時回傳相同的物件_參考_。

</docs-callout>

## 接下來

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding" title="屬性繫結"/>
  <docs-pill href="guide/templates/event-binding" title="事件繫結"/>
</docs-pill-row>
