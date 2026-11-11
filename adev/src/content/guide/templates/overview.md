<docs-decorative-header title="範本語法" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
在 Angular 中，範本是一段 HTML。
在範本中使用特殊語法，就能建立在 Angular 的許多功能之上。
</docs-decorative-header>

Tip: 在深入這份完整指南之前，先看看 Angular 的 [Essentials](essentials/rendering-dynamic-templates)。

<!--todo: Do we still need the following section? It seems more relevant to those coming from AngularJS, which is now 7 versions ago. -->
<!-- You may be familiar with the component/template duality from your experience with model-view-controller (MVC) or model-view-viewmodel (MVVM).
In Angular, the component plays the part of the controller/viewmodel, and the template represents the view. -->

應用程式中的每個 Angular 範本都是一段 HTML，作為瀏覽器所顯示頁面的一部分被包含進來。
Angular HTML 範本和一般 HTML 一樣，在瀏覽器中算繪出一個檢視，也就是使用者介面，但功能要多得多。

當你用 Angular CLI 產生 Angular 應用程式時，`app.component.html` 檔案是包含佔位 HTML 的預設範本。

範本語法指南會示範如何透過在類別與範本之間協調資料，來控制 UX/UI。

## 強化你的 HTML {#empower-your-html}

在範本中使用特殊的 Angular 語法，擴充應用程式的 HTML 詞彙。
例如，Angular 透過內建範本函式、變數、事件監聽與資料繫結等功能，協助你動態地取得與設定 DOM \(Document Object Model\) 值。

幾乎所有 HTML 語法都是有效的範本語法。
不過，由於 Angular 範本是整個網頁的一部分，而不是完整的頁面，你不需要包含 `<html>`、`<body>` 或 `<base>` 等元素，可以專注於你正在開發的頁面部分。

IMPORTANT: 為了消除指令碼注入攻擊的風險，Angular 不支援在範本中使用 `<script>` 元素。
Angular 會忽略 `<script>` 標籤，並在瀏覽器主控台輸出警告。
更多資訊，請參閱 [Security](guide/security) 頁面。

## 範本語法更多資訊 {#more-on-template-syntax}

你可能也有興趣了解以下內容：

| 主題                                                                      | 詳細資訊                                                              |
| :------------------------------------------------------------------------ | :-------------------------------------------------------------------- |
| [插值](guide/templates/interpolation)                                     | 了解如何在 HTML 中使用插值與運算式。                                  |
| [範本陳述式](guide/templates/template-statements)                         | 回應範本中的事件。                                                    |
| [繫結語法](guide/templates/binding)                                       | 使用繫結來協調應用程式中的值。                                        |
| [屬性繫結](guide/templates/property-binding)                              | 設定目標元素或指令 `@Input()` 裝飾器的屬性。                          |
| [Attribute、類別與樣式繫結](guide/templates/attribute-binding)            | 設定 attribute、類別與樣式的值。                                      |
| [事件繫結](guide/templates/event-binding)                                 | 監聽事件與你的 HTML。                                                 |
| [雙向繫結](guide/templates/two-way-binding)                               | 在類別與其範本之間共用資料。                                          |
| [內建指令](guide/directives)                                              | 監聽並修改 HTML 的行為與版面。                                        |
| [範本參照變數](guide/templates/reference-variables)                       | 使用特殊變數來參照範本內的 DOM 元素。                                 |
| [輸入](guide/components/inputs)                                           | 以輸入屬性接受資料                                                    |
| [輸出](guide/components/outputs)                                          | 以輸出建立自訂事件                                                    |
| [在範本中使用 SVG](guide/templates/svg-in-templates)                      | 動態產生互動式圖形。                                                  |
