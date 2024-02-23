<docs-decorative-header title="範本語法" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
在 Angular 中，*範本*是 HTML 塊。
在範本中使用特殊語法以建構許多 Angular 的功能。
</docs-decorative-header>

提示：在深入這份完整指南之前，請先查看 Angular 的 [精華](essentials/rendering-dynamic-templates)。

<!--todo：我們是否仍需要以下部分？對於那些來自 AngularJS 的人來說，這似乎更相關，而 AngularJS 現在已經有 7 個版本了。 -->

<!-- 你可能熟悉模型-檢視-控制器 (MVC) 或模型-檢視-檢視模型 (MVVM) 經驗中的元件/範本二元性。
在 Angular 中，元件扮演控制器/檢視模型的角色，而範本代表檢視。 -->

應用程式中的每個 Angular 範本都是 HTML 的一部份，用於作為瀏覽器顯示頁面的其中一部分。
Angular HTML 範本會在瀏覽器中呈現檢視或使用者介面，就像一般 HTML 一樣，但具有更多功能。

當您使用 Angular CLI 自動建立 Angular 應用程式時，`app.component.html` 檔案是包含預留位置 HTML 的預設範本。

範本語法指南說明如何藉由協調類別與範本之間的資料來控制 UX/UI。

## 增強你的 HTML

在範本中使用特殊的 Angular 語法，以擴充應用程式的 HTML 語彙。
例如，Angular 可以幫助您動態地取得和設定 DOM（文件物件模型）值，其具有的功能包括內建範本函式、變數、事件監聽和資料繫結。

幾乎所有 HTML 語法都是有效的範本語法。
但是，由於 Angular 範本是整體網頁的一部分，而不是整個網頁，因此您不需要包含 `<html>`, `<body>` 或 `<base>` 等元素，而可以專注於您正在開發的網頁部分。

重要事項：為消除腳本注入攻擊的風險，Angular 不支援範本中的 `<script>` 元素。
Angular 會忽略 `<script>` 標籤，並在瀏覽器主控台輸出警告。
如需更多資訊，請參閱 [安全性](guide/security) 頁面。

## 範本語法的更多資訊

您可能也有興趣：

| 主題                                                                     | 詳細                                                                 |
| :------------------------------------------------------------------------ | :-------------------------------------------------------------------- |
| [插值](guide/templates/interpolation)                            | 了解如何在 HTML 中使用插值和表達式。                               |
| [範本語句](guide/templates/template-statements)                | 回應範本中的事件。                                                 |
| [繫結語法](guide/templates/binding)                                 | 使用繫結來協調應用程式中的值。                                     |
| [屬性繫結](guide/templates/property-binding)                      | 設定目標元素的屬性或指令 `@Input()` 裝飾器。                    |
| [屬性、類別和樣式繫結](guide/templates/attribute-binding) | 設定屬性、類別和樣式的值。                                       |
| [事件繫結](guide/templates/event-binding)                            | 偵聽事件和您的 HTML。                                             |
| [雙向繫結](guide/templates/two-way-binding)                        | 在類別和其範本之間共享資料。                                     |
| [內建指令](guide/directives)                                   | 偵聽和修改 HTML 的行為和佈局。                                   |
| [範本參考變數](guide/templates/reference-variables)       | 使用特殊變數來參照範本中的 DOM 元素。                              |
| [輸入](guide/components/inputs)                                         | 使用輸入屬性接受資料                                           |
| [輸出](guide/components/outputs)                                       | 使用輸出進行自訂事件                                             |
| [範本中的 SVG](guide/templates/svg-in-templates)                      | 動態產生互動式圖形。                                           |
