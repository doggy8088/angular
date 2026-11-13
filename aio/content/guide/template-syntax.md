# 範本語法

在 Angular 中，*範本*是一段 HTML。
在範本中，你可以使用特殊語法，善用 Angular 的許多功能。


## 先備知識

在學習範本語法之前，你應該先熟悉下列內容：

* [Angular 概念](guide/architecture)
* JavaScript
* HTML
* CSS


<!-- Do we still need the following section? It seems more relevant to those coming from AngularJS, which is now 7 versions ago. -->
<!-- You may be familiar with the component/template duality from your experience with model-view-controller (MVC) or model-view-viewmodel (MVVM).
In Angular, the component plays the part of the controller/viewmodel, and the template represents the view. -->

<hr />

應用程式中的每個 Angular 範本都是一段 HTML，作為瀏覽器所顯示頁面的一部分被包含進來。
Angular HTML 範本和一般 HTML 一樣，在瀏覽器中算繪出一個檢視，也就是使用者介面，但功能要多得多。

當你用 Angular CLI 產生 Angular 應用程式時，`app.component.html` 檔案是包含佔位 HTML 的預設範本。

範本語法指南會示範如何透過在類別與範本之間協調資料，來控制 UX/UI。

<div class="is-helpful alert">

大部分的範本語法指南都有專屬的實作範例應用程式，用來展示各指南的個別主題。
要查看它們全部整合在一個應用程式中的運作情形，請參閱完整的 <live-example title="Template Syntax Live Code"></live-example>。

</div>


## 強化你的 HTML

有了範本中的特殊 Angular 語法，你就能擴充應用程式的 HTML 詞彙。
例如，Angular 透過內建範本函式、變數、事件監聽與資料繫結等功能，協助你動態地取得與設定 DOM（Document Object Model）值。

幾乎所有 HTML 語法都是有效的範本語法。
不過，由於 Angular 範本是整個網頁的一部分，而不是完整的頁面，你不需要包含 `<html>`、`<body>` 或 `<base>` 等元素。
你可以專注於你正在開發的頁面部分。


<div class="alert is-important">

為了消除指令碼注入攻擊的風險，Angular 不支援在範本中使用 `<script>` 元素。
Angular 會忽略 `<script>` 標籤，並在瀏覽器主控台輸出警告。
更多資訊，請參閱 [Security](guide/security) 頁面。

</div>

<hr />

## 範本語法更多資訊

你可能也會對以下內容有興趣：

* [插值](guide/interpolation)&mdash;了解如何在 HTML 中使用插值與運算式。
* [範本陳述式](guide/template-statements)&mdash;回應範本中的事件。
* [繫結語法](guide/binding-syntax)&mdash;使用繫結來協調應用程式中的值。
* [屬性繫結](guide/property-binding)&mdash;設定目標元素或指令 `@Input()` 裝飾器的屬性。
* [Attribute、類別與樣式繫結](guide/attribute-binding)&mdash;設定 attribute、類別與樣式的值。
* [事件繫結](guide/event-binding)&mdash;監聽事件與你的 HTML。
* [雙向繫結](guide/two-way-binding)&mdash;在類別與其範本之間共用資料。
* [內建指令](guide/built-in-directives)&mdash;監聽並修改 HTML 的行為與版面。
* [範本參照變數](guide/template-reference-variables)&mdash;使用特殊變數來參照範本內的 DOM 元素。
* [輸入與輸出](guide/inputs-outputs)&mdash;在父層內容與子指令或元件之間共用資料
* [範本運算式運算子](guide/template-expression-operators)&mdash;了解管道運算子 `|`，並防範 HTML 中的 `null` 或 `undefined` 值。
* [在範本中使用 SVG](guide/svg-in-templates)&mdash;動態產生互動式圖形。
