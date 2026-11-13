# 範本中的 SVG

可以在 Angular 中將 SVG 用作有效的範本。以下所有範本語法
都同時適用於 SVG 與 HTML。更多資訊請參閱 SVG [1.1](https://www.w3.org/TR/SVG11/) 與
[2.0](https://www.w3.org/TR/SVG2/) 規格。

<div class="alert is-helpful">

請參閱 <live-example name="template-syntax"></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

為什麼要將 SVG 用作範本，而不是直接將它作為圖片加入你的應用程式呢？

當你將 SVG 用作範本時，你可以像使用 HTML
範本一樣使用指令與繫結。這表示你將能夠動態產生互動式圖形。

請參閱下方的範例程式碼片段，以了解語法範例：

<code-example path="template-syntax/src/app/svg.component.ts" header="src/app/svg.component.ts"></code-example>

將以下程式碼加入你的 `svg.component.svg` 檔案：

<code-example path="template-syntax/src/app/svg.component.svg" header="src/app/svg.component.svg"></code-example>

在這裡你可以看到 `click()` 事件繫結與屬性繫結語法的使用
（`[attr.fill]="fillColor"`）。
